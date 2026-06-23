#!/usr/bin/env python3
"""
build_analytics.py
==================
Pre-compute analytics for the terminal's ANALYTICS mode. Runs offline
(or at build-time, eventually in CI) and emits a single JSON file the
browser fetches once on terminal boot.

Why offline?
  Static HTML site, no backend. Browser can't run scikit-learn. So we
  do the heavy lifting in Python here, save the OUTPUTS as JSON, and
  let the browser render them with pure Canvas (no chart library bloat).

What it computes:
  1. Per-subnet 90-day synthetic price series, deterministic per netuid
     (same seeded walk as src/views/Cockpit.js generateSeries) so the
     in-browser chart and our analytics agree on the underlying data.

  2. Pairwise PRICE CORRELATION matrix (53x53). Pearson r over the 90d
     daily-returns series. Used by the terminal's correlation heatmap.

  3. t-SNE 2D EMBEDDING of subnets. Features = [chg24, chg7, chg30,
     log_mcap, log_emission, log_validators, log_miners]. Standard-
     scaled, then sklearn.manifold.TSNE -> 2D. Subnets that "behave
     similarly" land near each other on the map.

  4. K-MEANS clustering (k=6) on the same feature set, so each subnet
     gets a cluster id the heatmap + t-SNE map can color by.

Output:
  src/data/analytics.json  (single file, ~50KB)
  {
    "generated_at": "2026-05-17T...",
    "subnets":      [4, 8, 9, ...],
    "names":        {"4": "Targon", ...},
    "correlation":  [[1.0, 0.42, ...], ...],          # 53x53
    "tsne":         {"4": [0.12, -0.34], ...},        # netuid -> [x,y] in [-1,1]
    "cluster":      {"4": 2, ...},                    # netuid -> cluster id 0..k-1
    "cluster_labels": {"0": "high-mcap text", ...}    # human readable cluster names
  }

Run:
  python3 scripts/analytics/build_analytics.py

The JS reads src/data/analytics.json at terminal boot. Re-run this
script whenever the SUBNETS seed changes substantively.
"""

import json
import re
import sys
import datetime as dt
import numpy as np
import pandas as pd
from pathlib import Path
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.manifold import TSNE

ROOT = Path(__file__).resolve().parents[2]
SUBNETS_JS = ROOT / 'src' / 'data' / 'subnets.js'
OUT_JSON   = ROOT / 'src' / 'data' / 'analytics.json'

# ---------- tunables (one home, no magic numbers in body) -----------
# Window over which all analytics compute. Must match the JS chart's
# default range for the heatmap reader to trust correlation values.
SERIES_DAYS = 90

# Cluster count for K-means + t-SNE color groups.
N_CLUSTERS = 6

# Concentration / diversifier r thresholds. Tuned for crypto where
# r is rarely negative — diversifier cutoff is set permissively, the
# fallback in derive_insights lifts it to "lowest r" when no negatives
# exist. Move both here so the desk can re-tune without touching the
# computation body.
R_CONCENTRATION_HI = 0.6
R_DIVERSIFIER_LO   = -0.1

# How many rows each ranking + pair list returns to the UI.
TOP_N = 8

# Annualization factor for crypto (24/7 markets, no trading holidays).
TRADING_DAYS = 365

# Cluster size labels — percentile-anchored thresholds (computed from
# the data, not hardcoded). The labels themselves stay constant; the
# breakpoints adapt as the network mcap distribution shifts.
SIZE_PCTL_LARGE = 0.66
SIZE_PCTL_MID   = 0.33

# ---------- parse SUBNETS from the JS source ------------------------
# We don't want a second source of truth, so we parse the JS file
# directly. The shape is { netuid:N, name:'X', cat:'y', ... } per row.
def parse_subnets_js(path):
    text = path.read_text()
    rows = []
    # Each row is on one line in subnets.js, opens with { netuid: ...
    pattern = re.compile(
        r"\{\s*netuid:\s*(\d+),"
        r"\s*name:\s*'([^']+)',"
        r"\s*cat:\s*'([^']+)',"
        r".*?owner:\s*'([^']+)',"
        r"\s*price:\s*([\d.]+),"
        r"\s*mcap:\s*([\d.]+),"
        r"\s*emission:\s*(\d+),"
        r"\s*miners:\s*(\d+),"
        r"\s*validators:\s*(\d+),"
        r"\s*stake:\s*([\d_]+),"
        r"\s*chg24:\s*([+\-\d.]+),"
        r"\s*chg7:\s*([+\-\d.]+),"
        r"\s*chg30:\s*([+\-\d.]+)",
        re.DOTALL,
    )
    for m in pattern.finditer(text):
        rows.append({
            'netuid':     int(m.group(1)),
            'name':       m.group(2),
            'cat':        m.group(3),
            'owner':      m.group(4),
            'price':      float(m.group(5)),
            'mcap':       float(m.group(6)),
            'emission':   int(m.group(7)),
            'miners':     int(m.group(8)),
            'validators': int(m.group(9)),
            'stake':      int(m.group(10).replace('_', '')),
            'chg24':      float(m.group(11)),
            'chg7':       float(m.group(12)),
            'chg30':      float(m.group(13)),
        })
    if not rows:
        raise ValueError(
            f'parse_subnets_js: regex matched 0 rows in {path}. '
            f'subnets.js shape probably changed — re-check the pattern.'
        )
    # Sanity check: count how many top-level `{ netuid:` openings the
    # file has and warn loudly if we matched fewer. A silent skip on
    # a row with a missing/reformatted field would otherwise quietly
    # bias every downstream analytic.
    rough_count = len(re.findall(r'\{\s*netuid:\s*\d+', text))
    if rough_count > len(rows):
        print(
            f'WARNING: parse_subnets_js matched {len(rows)}/{rough_count} '
            f'rows. {rough_count - len(rows)} subnet(s) silently skipped — '
            f'the regex shape probably needs an update.',
            file=sys.stderr,
        )
    return rows


# ---------- synthetic 90-day price series ---------------------------
# Mirrors src/views/Cockpit.js generateSeries(). Deterministic per
# netuid so the browser chart and these analytics use the same data.
def generate_series(subnet, days=90):
    seed = (subnet['netuid'] * 12345 + 67) & 0xFFFFFFFF
    rand_state = seed
    def rand():
        nonlocal rand_state
        rand_state = (rand_state * 1103515245 + 12345) & 0xFFFFFFFF
        return ((rand_state >> 16) & 0x7FFF) / 0x7FFF

    price  = subnet['price']
    r24    = subnet['chg24'] / 100
    r7     = subnet['chg7']  / 100
    r30    = subnet['chg30'] / 100

    closes = [0.0] * days
    closes[-1] = price
    for i in range(days - 2, -1, -1):
        day_ago = days - 1 - i
        if   day_ago <= 1:  drift = -r24 / 1
        elif day_ago <= 7:  drift = -r7  / 7
        elif day_ago <= 30: drift = -r30 / 30
        else:               drift = -0.0008 + (rand() - 0.5) * 0.001
        noise = (rand() - 0.5) * 0.045
        closes[i] = closes[i+1] * (1 + drift + noise)
    return closes


# ---------- correlation matrix --------------------------------------
def correlation_matrix(subnets, prices):
    """Pearson r of DAILY RETURNS (not prices). Returns 53x53 list-of-lists."""
    df = pd.DataFrame({s['netuid']: prices[s['netuid']] for s in subnets})
    rets = df.pct_change().dropna()
    corr = rets.corr().values
    return corr.tolist()


# ---------- per-subnet risk metrics (BlackRock-grade) ---------------
# Numbers a portfolio manager actually uses: vol, Sharpe, max DD, beta.
# All annualized. Sharpe assumes 0% risk-free for simplicity (the
# magazine reader compares INSIDE the network; absolute Sharpe to USD
# treasuries is a separate frame).
def risk_metrics(subnets, prices):
    """Per-subnet risk metrics annualized over `TRADING_DAYS` (365 for
    crypto). All returned as a netuid -> {metric: value} dict; entries
    are `None` for subnets that couldn't yield a clean return series.

    `sharpe_rf0` is named explicitly to flag that the risk-free rate is
    0% (we compare INSIDE the network — absolute Sharpe vs. USD T-bills
    is a separate frame the UI can layer on later if it wants).

    `beta` is None when the equal-weighted network return has zero
    variance (a degenerate seed could produce this) — emitting None
    instead of a 0-divided sentinel forces the UI to render "·" rather
    than a misleading 0.00.
    """
    df = pd.DataFrame({s['netuid']: prices[s['netuid']] for s in subnets})
    rets = df.pct_change().dropna()

    # Network equal-weighted index (the "market" for beta)
    market_rets = rets.mean(axis=1)
    market_var = float(market_rets.var())
    market_var_ok = market_var > 1e-18

    ann = np.sqrt(TRADING_DAYS)

    out = {}
    for s in subnets:
        nid = s['netuid']
        r = rets[nid].values
        if len(r) < 2:
            out[str(nid)] = None
            continue
        mu_d  = float(np.mean(r))
        sig_d = float(np.std(r, ddof=1))
        ann_ret    = mu_d * TRADING_DAYS * 100
        ann_vol    = sig_d * ann * 100
        sharpe_rf0 = (mu_d * TRADING_DAYS) / (sig_d * ann) if sig_d > 0 else 0.0

        # Max drawdown — running peak from the synthetic price path,
        # guarded against any zero/negative peak so the divide stays
        # finite. Synthetic paths can technically wander to zero on
        # extreme noise sequences; defensive math here costs nothing.
        path = np.asarray(prices[nid], dtype=float)
        peaks = np.maximum.accumulate(path)
        safe_peaks = np.where(peaks <= 0, 1.0, peaks)
        dd = (path - peaks) / safe_peaks
        max_dd = float(np.min(dd) * 100)                # 0 = no DD, -100 = total loss

        # Beta to the equal-weighted network index — None when market
        # variance collapses (avoids misleading huge-or-zero betas).
        if market_var_ok:
            cov = float(np.cov(r, market_rets, ddof=1)[0, 1])
            beta = round(cov / market_var, 2)
        else:
            beta = None

        out[str(nid)] = {
            'ann_ret':    round(ann_ret, 2),
            'ann_vol':    round(ann_vol, 2),
            'sharpe_rf0': round(sharpe_rf0, 2),
            'max_dd':     round(max_dd, 2),
            'beta':       beta,
        }
    return out


# ---------- network-wide insights (the "so what") -------------------
# Translates the matrix + risk metrics into the 3-5 things a portfolio
# manager would actually want to know on first glance. Not just data —
# DECISIONS the data implies.
def derive_insights(subnets, corr, risk, prices):
    N = len(subnets)
    ids = [s['netuid'] for s in subnets]
    name_of = {s['netuid']: s['name'] for s in subnets}

    # All pairs (i < j) with their r, sorted by abs(r) desc
    pairs = []
    for i in range(N):
        for j in range(i+1, N):
            r = corr[i][j]
            if r is None or np.isnan(r): continue
            pairs.append({
                'a':  ids[i], 'aName': name_of[ids[i]],
                'b':  ids[j], 'bName': name_of[ids[j]],
                'r':  round(float(r), 3),
            })

    concentration = sorted(
        [p for p in pairs if p['r'] > R_CONCENTRATION_HI],
        key=lambda p: p['r'], reverse=True
    )[:TOP_N]

    diversifiers = sorted(
        [p for p in pairs if p['r'] < R_DIVERSIFIER_LO],
        key=lambda p: p['r']
    )[:TOP_N]
    if not diversifiers:
        diversifiers = sorted(pairs, key=lambda p: p['r'])[:TOP_N]

    # RANKINGS — Sharpe / vol / beta / drawdown. Beta sorts need to
    # exclude None entries (subnets where market variance collapsed)
    # so the sort key never sees None vs. float.
    valid = [{'netuid': int(nid), 'name': name_of[int(nid)], **m}
             for nid, m in risk.items() if m is not None]
    with_beta = [v for v in valid if v['beta'] is not None]
    by_sharpe   = sorted(valid, key=lambda x: x['sharpe_rf0'], reverse=True)
    by_vol_hi   = sorted(valid, key=lambda x: x['ann_vol'],    reverse=True)
    by_vol_lo   = sorted(valid, key=lambda x: x['ann_vol'])
    by_dd       = sorted(valid, key=lambda x: x['max_dd'])
    by_beta_hi  = sorted(with_beta, key=lambda x: x['beta'], reverse=True)
    by_beta_lo  = sorted(with_beta, key=lambda x: x['beta'])

    # Herfindahl-Hirschman concentration on emission share (network-wide)
    em = np.array([max(0, s['emission']) for s in subnets], dtype=float)
    em_share = em / em.sum() if em.sum() > 0 else em
    hhi = float(np.sum(em_share ** 2))         # 1/N (perfect) -> 1 (monopoly)
    effective_n = 1 / hhi if hhi > 0 else N    # "effective number" of subnets

    # Top emitters by share of total emission (incentive concentration).
    em_order = np.argsort(-em)
    top_emit = []
    for k in em_order[:TOP_N]:
        top_emit.append({
            'netuid': int(ids[k]),
            'name':   name_of[ids[k]],
            'share':  round(float(em_share[k]) * 100, 2),
            'emission': int(em[k]),
        })

    return {
        'concentration': concentration,
        'diversifiers':  diversifiers,
        'by_sharpe':     by_sharpe[:TOP_N],
        'by_vol_hi':     by_vol_hi[:TOP_N],
        'by_vol_lo':     by_vol_lo[:TOP_N],
        'by_dd':         by_dd[:TOP_N],
        'by_beta_hi':    by_beta_hi[:TOP_N],
        'by_beta_lo':    by_beta_lo[:TOP_N],
        'emission_hhi':  round(hhi, 4),
        'effective_n':   round(effective_n, 1),
        'top_emitters':  top_emit,
    }


# ---------- t-SNE 2D embedding + k-means clustering -----------------
def tsne_and_clusters(subnets, k=6):
    feats = []
    for s in subnets:
        feats.append([
            s['chg24'],
            s['chg7'],
            s['chg30'],
            np.log1p(s['mcap']),
            np.log1p(s['emission']),
            np.log1p(s['validators']),
            np.log1p(s['miners']),
        ])
    X = StandardScaler().fit_transform(feats)
    n = len(subnets)

    # t-SNE perplexity must be < n. Use min(30, n//4)
    perp = max(5, min(30, n // 4))
    tsne = TSNE(n_components=2, perplexity=perp, init='pca',
                learning_rate='auto', random_state=42, max_iter=1000)
    pos = tsne.fit_transform(X)

    # Normalize to [-1, 1] for easy Canvas mapping
    mn, mx = pos.min(axis=0), pos.max(axis=0)
    span = np.where(mx - mn == 0, 1, mx - mn)
    pos_n = 2 * (pos - mn) / span - 1

    # K-means on the same feature space
    km = KMeans(n_clusters=k, n_init=10, random_state=42)
    cluster_ids = km.fit_predict(X)

    # Human-readable cluster labels: dominant category + size descriptor.
    # Size thresholds are PERCENTILE-anchored against the actual mcap
    # distribution in this run — hardcoded $25M/$10M cutoffs would
    # silently mislabel as the network grows. Recomputed every build.
    all_mcaps = np.array([s['mcap'] for s in subnets], dtype=float)
    p_large = float(np.quantile(all_mcaps, SIZE_PCTL_LARGE))
    p_mid   = float(np.quantile(all_mcaps, SIZE_PCTL_MID))

    cluster_labels = {}
    for cid in range(k):
        members = [subnets[i] for i in range(n) if cluster_ids[i] == cid]
        if not members:
            cluster_labels[str(cid)] = f'cluster {cid}'
            continue
        cats = {}
        for m in members:
            cats[m['cat']] = cats.get(m['cat'], 0) + 1
        dom_cat = max(cats.items(), key=lambda kv: kv[1])[0]
        avg_mcap = float(np.mean([m['mcap'] for m in members]))
        if   avg_mcap >= p_large: size = 'large-cap'
        elif avg_mcap >= p_mid:   size = 'mid-cap'
        else:                     size = 'small-cap'
        cluster_labels[str(cid)] = f'{size} {dom_cat}'

    tsne_dict   = {str(s['netuid']): [float(pos_n[i, 0]), float(pos_n[i, 1])] for i, s in enumerate(subnets)}
    cluster_dict= {str(s['netuid']): int(cluster_ids[i]) for i, s in enumerate(subnets)}
    return tsne_dict, cluster_dict, cluster_labels


# ---------- main ----------------------------------------------------
def main():
    subnets = parse_subnets_js(SUBNETS_JS)
    print(f'Parsed {len(subnets)} subnets from {SUBNETS_JS.name}')

    prices = {s['netuid']: generate_series(s, days=SERIES_DAYS) for s in subnets}
    print(f'Generated {SERIES_DAYS}-day series for {len(prices)} subnets')

    corr = correlation_matrix(subnets, prices)
    print(f'Correlation matrix: {len(corr)}x{len(corr[0])}')

    tsne, clusters, labels = tsne_and_clusters(subnets, k=N_CLUSTERS)
    print(f't-SNE + k-means clusters computed (k={len(labels)})')

    risk = risk_metrics(subnets, prices)
    valid_risk = sum(1 for v in risk.values() if v is not None)
    print(f'Risk metrics computed: {valid_risk} subnets (vol, Sharpe, max-DD, beta)')

    insights = derive_insights(subnets, corr, risk, prices)
    print(f'Insights derived: {len(insights["concentration"])} concentration pairs, '
          f'{len(insights["diversifiers"])} diversifiers, HHI={insights["emission_hhi"]:.4f} '
          f'(effective N={insights["effective_n"]:.1f})')

    out = {
        # Timezone-aware UTC — `datetime.utcnow()` is deprecated in
        # Python 3.12+; the explicit `now(timezone.utc)` is the
        # forward-compatible idiom.
        'generated_at': dt.datetime.now(dt.timezone.utc).isoformat().replace('+00:00', 'Z'),
        'config': {
            'series_days':    SERIES_DAYS,
            'n_clusters':     N_CLUSTERS,
            'top_n':          TOP_N,
            'trading_days':   TRADING_DAYS,
            'sharpe_rf':      0.0,
            'concentration_r_hi': R_CONCENTRATION_HI,
            'diversifier_r_lo':   R_DIVERSIFIER_LO,
        },
        'subnets':      [s['netuid'] for s in subnets],
        'names':        {str(s['netuid']): s['name'] for s in subnets},
        'cats':         {str(s['netuid']): s['cat'] for s in subnets},
        'correlation':  corr,
        'tsne':         tsne,
        'cluster':      clusters,
        'cluster_labels': labels,
        'risk':         risk,
        'insights':     insights,
    }
    OUT_JSON.write_text(json.dumps(out, indent=2))
    print(f'Wrote {OUT_JSON.relative_to(ROOT)}  ({OUT_JSON.stat().st_size/1024:.1f}KB)')


if __name__ == '__main__':
    main()
