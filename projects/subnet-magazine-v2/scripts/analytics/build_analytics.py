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
import os
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
        raise SystemExit('parse_subnets_js: no rows matched, check the regex against subnets.js')
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

    # Human-readable cluster labels: pick the dominant category per cluster
    # plus a size descriptor based on the cluster's avg log_mcap
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
        avg_mcap = np.mean([m['mcap'] for m in members])
        size = 'large-cap' if avg_mcap > 25 else ('mid-cap' if avg_mcap > 10 else 'small-cap')
        cluster_labels[str(cid)] = f'{size} {dom_cat}'

    tsne_dict   = {str(s['netuid']): [float(pos_n[i, 0]), float(pos_n[i, 1])] for i, s in enumerate(subnets)}
    cluster_dict= {str(s['netuid']): int(cluster_ids[i]) for i, s in enumerate(subnets)}
    return tsne_dict, cluster_dict, cluster_labels


# ---------- main ----------------------------------------------------
def main():
    subnets = parse_subnets_js(SUBNETS_JS)
    print(f'Parsed {len(subnets)} subnets from {SUBNETS_JS.name}')

    prices = {s['netuid']: generate_series(s) for s in subnets}
    print(f'Generated 90-day series for {len(prices)} subnets')

    corr = correlation_matrix(subnets, prices)
    print(f'Correlation matrix: {len(corr)}x{len(corr[0])}')

    tsne, clusters, labels = tsne_and_clusters(subnets, k=6)
    print(f't-SNE + k-means clusters computed (k={len(labels)})')

    out = {
        'generated_at': dt.datetime.utcnow().isoformat() + 'Z',
        'subnets':      [s['netuid'] for s in subnets],
        'names':        {str(s['netuid']): s['name'] for s in subnets},
        'cats':         {str(s['netuid']): s['cat'] for s in subnets},
        'correlation':  corr,
        'tsne':         tsne,
        'cluster':      clusters,
        'cluster_labels': labels,
    }
    OUT_JSON.write_text(json.dumps(out, indent=2))
    print(f'Wrote {OUT_JSON.relative_to(ROOT)}  ({OUT_JSON.stat().st_size/1024:.1f}KB)')


if __name__ == '__main__':
    main()
