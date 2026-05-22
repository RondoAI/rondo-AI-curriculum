#!/usr/bin/env python3
"""
Regenerate src/data/subnets.js from live taomarketcap.com data.

The local subnets.js was hand-curated and drifted out of sync with the
chain — re-registrations after deregistration left netuids pointing at
completely different teams than what the local file claimed. Per Rondo
2026-05-22 ("local subnet js needs to be updated or replaced by
something more reliable"), this script makes the live API the
source-of-truth and the local file just a generated artifact.

What this does:
  1. Fetch all 128 subnets from api.taomarketcap.com (paged, no key)
  2. Extract identity (subnet_identities_v3) + market snapshot fields
  3. Infer category from the on-chain description text (keyword rules)
  4. Merge any local OVERRIDES (in scripts/subnet_overrides.json)
  5. Emit src/data/subnets.js with all 128 entries, including a
     deprecated:true flag for subnets the chain marks as deprecated /
     parked / for-sale so the cockpit can filter them out

Run:   python3 scripts/build_subnets.py
"""

import json, os, urllib.request, urllib.error, sys, re, ssl
from pathlib import Path

# Some Python installs ship without the system trust store wired up
# (macOS Python.org installer is the classic case). Build a relaxed
# context so the fetch works in those environments — we're hitting a
# public-data API, not a security boundary.
SSL_CTX = ssl.create_default_context()
try:
    import certifi
    SSL_CTX = ssl.create_default_context(cafile=certifi.where())
except ImportError:
    SSL_CTX.check_hostname = False
    SSL_CTX.verify_mode = ssl.CERT_NONE

ROOT = Path(__file__).resolve().parent.parent
LIVE_SNAPSHOT = ROOT / 'src' / 'data' / 'subnets-live-2026-05-22.json'
OUT_FILE = ROOT / 'src' / 'data' / 'subnets.js'
OVERRIDES = ROOT / 'scripts' / 'subnet_overrides.json'

TMC_BASE = 'https://api.taomarketcap.com/public/v1/subnets/?limit=25&offset='

# Category inference rules — order matters, first match wins. Each rule
# is (cat_key, list of keyword substrings to match against description).
# Description text is lowercased before matching.
CAT_RULES = [
    ('infra',      ['serverless compute', 'cloud', 'vpn', 'bandwidth', 'mining pool', 'mining', 'gpu', 'compute', 'infrastructure', 'transaction layer', 'storage']),
    ('finance',    ['liquidity', 'trading', 'lending', 'aum', 'stablecoin', 'capital', 'dex', 'perp', 'investing', 'yield', 'finance', 'liquidation', 'price discovery']),
    ('agents',     ['agent', 'workflow', 'mcp', 'tool use', 'autonomous', 'red-team', 'cybersecurity', 'exploits', 'pen-test']),
    ('training',   ['training', 'finetune', 'pretrain', 'pre-train', 'distillation', 'distil', 'reasoning', 'reason mining']),
    ('text',       ['llm', 'language model', 'translation', 'summariz', 'long-context', 'inference', 'chat', 'dialogue', 'reasoning']),
    ('vision',     ['vision', 'image', '3d', '3-d', 'camera', 'surveillance']),
    ('video',      ['video', 'streaming', 'talking head']),
    ('audio',      ['voice', 'speech', 'audio', 'micropayments']),
    ('multimodal', ['multimodal', 'multi-modal', 'any-to-any']),
    ('science',    ['science', 'research', 'drug', 'genom', 'molecular', 'alignment', 'protein', 'biology', 'physics', 'quantum']),
    ('data',       ['data', 'dataset', 'scraping', 'crawl', 'entity', 'detection', 'synthetic']),
    ('prediction', ['prediction', 'forecast', 'predict']),
    ('search',     ['search', 'retrieval']),
    ('robotics',   ['robot', 'robotics']),
]

# Mark these as deprecated/parked so cockpit can hide them
DEAD_PATTERNS = [
    (re.compile(r'\bdeprecated\b', re.I), 'deprecated'),
    (re.compile(r'\bparked\b', re.I), 'parked'),
    (re.compile(r'for sale.*burn to uid1', re.I), 'for-sale'),
]


def fetch_live():
    """Page through the TMC public API and return {netuid: row}."""
    all_subnets = {}
    offset = 0
    while True:
        url = f'{TMC_BASE}{offset}'
        try:
            with urllib.request.urlopen(url, timeout=15, context=SSL_CTX) as r:
                page = json.load(r)
        except urllib.error.URLError as e:
            print(f'[warn] fetch failed at offset={offset}: {e}', file=sys.stderr)
            break
        results = page.get('results') or []
        if not results:
            break
        for x in results:
            all_subnets[int(x['netuid'])] = x
        if not page.get('next'):
            break
        offset += 25
        if offset > 300:
            break
    return all_subnets


def load_cached():
    """Fall back to the committed snapshot when offline."""
    if not LIVE_SNAPSHOT.exists():
        return None
    with LIVE_SNAPSHOT.open() as f:
        snap = json.load(f)
    # Snapshot keys are strings, normalize to int
    out = {}
    for k, v in snap.items():
        try:
            out[int(k)] = v
        except (TypeError, ValueError):
            pass
    return out


def infer_cat(desc):
    desc = (desc or '').lower()
    for cat, keys in CAT_RULES:
        for k in keys:
            if k in desc:
                return cat
    return 'data'  # safest fallback (least specific claim)


def dead_status(name, desc):
    text = (name or '') + ' ' + (desc or '')
    for rx, status in DEAD_PATTERNS:
        if rx.search(text):
            return status
    return None


def load_overrides():
    """Optional manual fixups for fields the live API can't supply
    (e.g., owner display name, theme tags, or category override when
    keyword matching gets it wrong)."""
    if not OVERRIDES.exists():
        return {}
    with OVERRIDES.open() as f:
        raw = json.load(f)
    out = {}
    for k, v in raw.items():
        try:
            out[int(k)] = v
        except (TypeError, ValueError):
            pass
    return out


def build_row(netuid, live_row, overrides):
    """Build one SUBNETS row dict from a live API row + overrides.

    Handles two shapes:
      - Raw TMC API: nested under live_row['latest_snapshot']['subnet_identities_v3']
      - Cached snapshot (subnets-live-2026-05-22.json): flat fields at row root
    """
    if not live_row:
        return None
    snap = live_row.get('latest_snapshot') or {}
    ident = snap.get('subnet_identities_v3') or {}

    # Identity — prefer nested, fall back to flat
    def pick(field):
        return ident.get(field) or live_row.get(field) or ''
    name = pick('subnetName').strip()
    desc = pick('description').strip().strip('"').replace('\n', ' ')
    url = pick('subnetUrl').strip()
    gh = pick('githubRepo').strip()
    if gh and not gh.startswith('http'):
        gh = ''
    contact = pick('subnetContact').strip()
    is_active = bool(live_row.get('is_active'))

    # Market snapshot — only available in raw API form; default 0 for cached
    def to_float(v, scale=1e9):
        try:
            return float(v) / scale
        except (TypeError, ValueError):
            return 0.0
    price = to_float(snap.get('subnet_moving_price'), 1)
    alpha_in = to_float(snap.get('subnet_alpha_in'))
    alpha_out = to_float(snap.get('subnet_alpha_out'))
    mcap_alpha = alpha_out * price if price else 0
    subnetwork_n = snap.get('subnetwork_n') or 0
    max_validators = snap.get('max_allowed_validators') or 0

    # Category inference + dead status
    cat = infer_cat(desc)
    status = dead_status(name, desc)

    # Apply manual overrides (cat / tags / owner / desc replacement)
    over = overrides.get(netuid) or {}
    if 'cat' in over:
        cat = over['cat']
    owner = over.get('owner', '')
    tags = over.get('tags', [])
    if over.get('desc'):
        desc = over['desc']

    row = {
        'netuid': netuid,
        'name': name or f'Subnet {netuid}',
        'cat': cat,
        'desc': desc,
        'owner': owner,
        'url': url,
        'gh': gh,
        'contact': contact,
        'is_active': is_active,
        'price': round(price, 6),
        # Legacy field-name aliases so Cockpit.js + Dashboard.js don't
        # need a rewrite (s.mcap / s.emission / s.chg24 etc still work).
        # The DataLayer overwrites chg24/7/30 with live TMC values.
        'mcap': round(mcap_alpha, 2),
        'emission': 0,
        'miners': subnetwork_n,
        'validators': max_validators,
        'stake': round(alpha_out / 1e3, 2) if alpha_out else 0,
        'chg24': 0,
        'chg7': 0,
        'chg30': 0,
        # New fields the schema added
        'mcap_alpha_tao': round(mcap_alpha, 2),
        'alpha_in': round(alpha_in, 2),
        'alpha_out': round(alpha_out, 2),
        'subnetwork_n': subnetwork_n,
        'max_validators': max_validators,
        'tags': tags,
    }
    if status:
        row['deprecated'] = True
        row['status'] = status
    if not name or not desc:
        row['unindexed'] = True
    return row


def emit_js(rows):
    """Write the generated subnets.js file."""
    header = '''/* =================================================================
   SUBNET MAGAZINE, SUBNET DATASET (auto-generated)
   -----------------------------------------------------------------
   GENERATED FILE. Do not hand-edit. Source of truth is the live
   taomarketcap.com on-chain identity_v3 feed snapshotted into
   subnets-live-2026-05-22.json.

   Regenerate via:
     python3 scripts/build_subnets.py

   Why a generated file:
     The previous hand-edited subnets.js drifted out of sync with
     the chain — re-registrations after deregistration left netuids
     pointing at completely different teams (SN18 was "Cortex.t",
     now "Zeus"; SN21 was "Omega", now "AdTAO"; etc.). Per Rondo
     2026-05-22 ("local subnet js needs to be updated or replaced
     by something more reliable"), the file is now a generated
     mirror of the chain, refreshed via the build script.

   Schema:
     netuid          — 1-128
     name            — subnetName from chain identity_v3
     cat             — inferred category (keyword match on description)
     desc            — description from chain identity_v3
     owner           — display name (from scripts/subnet_overrides.json,
                       empty when not curated)
     url             — subnetUrl from chain
     gh              — githubRepo from chain (only if it's a URL)
     contact         — subnetContact email from chain
     is_active       — chain liveness flag
     price           — α moving price (TAO)
     mcap_alpha_tao  — α market cap in TAO
     alpha_in        — α pool in (TAO)
     alpha_out       — α pool out (alpha tokens)
     subnetwork_n    — registered UIDs
     max_validators  — validator count cap
     tags            — theme tags from overrides (empty by default)
     deprecated      — true when chain marks the subnet dead
     status          — 'deprecated' | 'parked' | 'for-sale' (when dead)
     unindexed       — true when chain identity is empty/thin
   ================================================================= */

/** @typedef {'text'|'vision'|'audio'|'video'|'multimodal'|'training'|'data'|'search'|'finance'|'agents'|'robotics'|'science'|'infra'|'prediction'} CategoryKey */

/** @type {readonly any[]} */
export const SUBNETS = Object.freeze(['''

    lines = []
    for r in rows:
        # Inline the row as a one-line object
        kv = []
        for k in ('netuid', 'name', 'cat', 'desc', 'owner', 'url', 'gh',
                  'contact', 'is_active', 'price', 'mcap', 'emission',
                  'miners', 'validators', 'stake', 'chg24', 'chg7', 'chg30',
                  'mcap_alpha_tao', 'alpha_in', 'alpha_out', 'subnetwork_n',
                  'max_validators', 'tags', 'deprecated', 'status', 'unindexed'):
            if k not in r:
                continue
            v = r[k]
            if isinstance(v, str):
                kv.append(f'{k}:{json.dumps(v)}')
            elif isinstance(v, bool):
                kv.append(f'{k}:{str(v).lower()}')
            elif v is None:
                kv.append(f'{k}:null')
            elif isinstance(v, list):
                kv.append(f'{k}:{json.dumps(v)}')
            else:
                kv.append(f'{k}:{v}')
        lines.append('  { ' + ', '.join(kv) + ' },')

    footer = ''']);

/* ---- Helpers (re-exported from the generator for consumer
   modules — keep these in sync with the original hand-edited
   subnets.js exports). ---- */

const _byId = new Map(SUBNETS.map(s => [s.netuid, s]));
export function subnetById(netuid){
  return _byId.get(netuid);
}
export function byEmission(){
  return SUBNETS.slice().sort((a, b) => (b.emission || 0) - (a.emission || 0));
}
export function byChange24(){
  return SUBNETS.slice().sort((a, b) => (b.chg24 || 0) - (a.chg24 || 0));
}
'''
    return header + '\n' + '\n'.join(lines) + '\n' + footer


def main():
    print('fetching live taomarketcap data...', file=sys.stderr)
    live = fetch_live()
    if not live:
        print('  live fetch failed, falling back to cached snapshot', file=sys.stderr)
        live = load_cached() or {}
    print(f'  got {len(live)} subnets ({min(live)}..{max(live)})', file=sys.stderr)

    overrides = load_overrides()
    print(f'loaded {len(overrides)} overrides from {OVERRIDES.name}', file=sys.stderr)

    rows = []
    for netuid in range(1, 129):
        live_row = live.get(netuid)
        row = build_row(netuid, live_row, overrides)
        if row is None:
            # Missing from chain — emit a placeholder to keep 128 count
            row = {
                'netuid': netuid,
                'name': f'Subnet {netuid}',
                'cat': 'data',
                'desc': '',
                'owner': '',
                'url': '',
                'gh': '',
                'contact': '',
                'is_active': False,
                'price': 0,
                'mcap_alpha_tao': 0,
                'alpha_in': 0,
                'alpha_out': 0,
                'subnetwork_n': 0,
                'max_validators': 0,
                'tags': [],
                'unindexed': True,
            }
        rows.append(row)

    js = emit_js(rows)
    OUT_FILE.write_text(js)
    n_dead = sum(1 for r in rows if r.get('deprecated'))
    n_unindexed = sum(1 for r in rows if r.get('unindexed'))
    n_active = sum(1 for r in rows if r.get('is_active'))
    print(f'\nwrote {OUT_FILE.relative_to(ROOT)}', file=sys.stderr)
    print(f'  {len(rows)} rows', file=sys.stderr)
    print(f'  {n_active} active', file=sys.stderr)
    print(f'  {n_dead} deprecated/parked/for-sale (filtered in UI)', file=sys.stderr)
    print(f'  {n_unindexed} unindexed (placeholder identity)', file=sys.stderr)


if __name__ == '__main__':
    main()
