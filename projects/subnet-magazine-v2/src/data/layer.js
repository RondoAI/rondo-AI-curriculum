/* =================================================================
   SUBNET MAGAZINE, DATA LAYER (v4 · TMC + taostats, REAL data)
   -----------------------------------------------------------------
   Pulls live Bittensor data from two real sources:

     1. Tao Market Cap public API (api.taomarketcap.com/public/v1,
        no auth, 10 req/min per IP), market, subnet table, chain
        analytics. TMC sends no CORS headers, so each request tries
        a direct fetch and, on failure, retries through a public
        CORS proxy (configurable via window.__SUBNET_CONFIG__
        .corsProxy; default codetabs).

     2. taostats.io API (api.taostats.io/api), used ONLY when a key
        is present in window.__SUBNET_CONFIG__.taostatsKey. taostats
        sends `access-control-allow-origin: *`, so it's a clean
        direct fetch, no proxy. Its unique value here is the live
        validator leaderboard, which TMC does not expose.

   The key lives in config.js (gitignored), never committed. With
   no key the site runs fully on the keyless TMC API; the taostats
   feed simply stays empty.

   Pub/sub channels:
     'tao:market'   { price, marketCap, volume24h, change1h/24h/7d/
                      30d/90d, circulating, maxSupply, stakedPct,
                      stakingApr, blockNumber, source, ts }
     'tao:subnets'  Array<{ netuid, name, symbol, price, marketcap,
                      marketcapRank, volume, chg1h/24h/7d/30d,
                      emission, logo, owner, deregRisk, active }>
     'tao:chain'    { totalStaked, totalIssuance, rootPct,
                      subnetsPct, walletsPct, tradingVol1h,
                      blockNumber, ts }
     'tao:validators' Array<{ hotkey, coldkey, name, rank,
                      nominators, nominatorsChg24h, stake,
                      systemStake, stakeChg24h, dominance, take,
                      apr, apr7d, apr30d, subnets, permits,
                      pendingEmission }>   (taostats, key required)
     'tao:block'    { height, source }   (derived from market data)

   PLANNED CHANNELS (stubbed below — emit nothing yet, but the
   channel names are reserved so views can subscribe via the same
   pattern when the real source lands):

     'tao:history'  per-subnet historical α-price + volume.
                    Shape: { netuid, range: '30D'|'90D'|'1Y',
                             series: [{ t, open, high, low, close,
                                        volume }, ...] }
                    Source: taostats key-gated historical endpoint
                    (or our own indexer once we run one). REPLACES
                    the synthetic series in src/lib/synthetic-
                    series.js that the cockpit chart currently
                    paints. Until this channel emits, views show
                    a "SEED HISTORY" affordance per
                    [[feedback-high-coding-standards]].

     'tao:competitors'  centralized rival data (mcap, daily delta,
                    supply-chain entities) currently sourced from
                    src/data/centralized-competitors.js as static
                    seed. Shape mirrors the COMPETITORS array.
                    Source: equities API (FMP / Polygon / Alpaca
                    for public tickers) + a curated quarterly
                    refresh of private-company valuations. When
                    this channel emits, the cockpit's VS row
                    rivals get LIVE deltas instead of static
                    snapshots.

   Every channel falls back gracefully: a failed refresh keeps the
   last good value, and views render their seed data until the
   first real payload lands. The stubbed channels above behave
   the same way — views can subscribe without waiting for the
   wire, and `dataLayer.get('tao:history')` returns null until
   real data shows up.
   ================================================================= */

const USER_CFG = (typeof window !== 'undefined' && window.__SUBNET_CONFIG__) || {};

const CONFIG = Object.freeze({
  base:  'https://api.taomarketcap.com/public/v1',
  /* codetabs is keyless and CORS-open; allorigins / corsproxy are
     alternates the user can swap in via config.js if it rate-limits. */
  proxy: USER_CFG.corsProxy || 'https://api.codetabs.com/v1/proxy/?quest=',
  /* taostats, optional, key-gated, CORS-clean (no proxy needed). */
  taostatsBase: 'https://api.taostats.io/api',
  taostatsKey:  USER_CFG.taostatsKey || null,
  /* Tightened poll intervals to give the dashboard a Bloomberg-grade
     tick cadence. TMC's keyless public API rate-limits at 10 req/min
     per IP; total here is ~8/min so we stay comfortably under the
     cap (market 4/min + subnets 2/min + chain 1/min + validators
     1/min). The `setLive` helper in dom.js already flashes any
     cell whose value actually changed, so a tighter cadence means
     a more visibly alive page without a code change. */
  refresh: {
    'tao:market':     15_000,
    'tao:subnets':    30_000,
    'tao:chain':      60_000,
    'tao:validators': 60_000,
  },
  timeout: 12_000,
  retries: 1,
});

/** RAO → TAO. taostats returns stake amounts in RAO (1 τ = 1e9 RAO). */
const RAO = 1e9;
/** Coerce a possibly-stringified number; null/undefined → fallback. */
const num = (v, fb = null) => (v == null || v === '' || isNaN(+v) ? fb : +v);

/* ---------- pub/sub + cache ---------- */
const cache = new Map();
const subs  = new Map();
const timers = [];
const ctrls  = new Set();

export function subscribe(channel, fn){
  if (!subs.has(channel)) subs.set(channel, new Set());
  subs.get(channel).add(fn);
  const cached = cache.get(channel);
  if (cached) { try { fn(cached.value, { fromCache: true }); } catch (e) { console.error(e); } }
  return () => subs.get(channel)?.delete(fn);
}
export function get(channel){ return cache.get(channel)?.value ?? null; }

function emit(channel, value){
  cache.set(channel, { value, ts: Date.now() });
  const set = subs.get(channel);
  if (!set) return;
  set.forEach(fn => { try { fn(value); } catch (e) { console.error('[DataLayer] subscriber', e); } });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ---------- networking: direct then proxy ---------- */

async function rawFetch(url, { timeout = CONFIG.timeout } = {}){
  const c = new AbortController();
  ctrls.add(c);
  const to = setTimeout(() => c.abort(), timeout);
  try {
    const res = await fetch(url, { signal: c.signal, cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(to);
    ctrls.delete(c);
  }
}

/**
 * Fetch a TMC endpoint. Direct first; on any failure (CORS being
 * the most common), retry through the configured CORS proxy.
 * @param {string} path  e.g. '/market/market-data/'
 */
async function tmc(path){
  const url = CONFIG.base + path;
  /* attempt 1: direct */
  try {
    return await rawFetch(url);
  } catch (_) { /* fall through to proxy */ }
  /* attempt 2..n: via proxy with light backoff */
  for (let i = 0; i <= CONFIG.retries; i++){
    try {
      return await rawFetch(CONFIG.proxy + encodeURIComponent(url), { timeout: CONFIG.timeout + 4000 });
    } catch (e){
      if (i === CONFIG.retries) throw e;
      await sleep(800 * (i + 1));
    }
  }
  throw new Error('tmc: unreachable');
}

/**
 * Fetch a taostats endpoint. Key-gated, CORS-clean, a single
 * direct fetch with the Authorization header, no proxy.
 * @param {string} path  e.g. '/validator/latest/v1?limit=100'
 */
async function taostats(path){
  if (!CONFIG.taostatsKey) throw new Error('taostats: no key');
  const c = new AbortController();
  ctrls.add(c);
  const to = setTimeout(() => c.abort(), CONFIG.timeout);
  try {
    const res = await fetch(CONFIG.taostatsBase + path, {
      signal: c.signal,
      cache: 'no-store',
      headers: { Authorization: CONFIG.taostatsKey },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(to);
    ctrls.delete(c);
  }
}

/* ---------- adapters ---------- */

async function refreshMarket(){
  try {
    const d = await tmc('/market/market-data/');
    const q = d.usd_quote || {};
    emit('tao:market', {
      price:       q.price ?? d.current_price ?? null,
      marketCap:   q.market_cap ?? null,
      fdv:         q.fully_diluted_market_cap ?? null,
      volume24h:   q.volume_24h ?? null,
      change1h:    q.percent_change_1h ?? 0,
      change24h:   q.percent_change_24h ?? 0,
      change7d:    q.percent_change_7d ?? 0,
      change30d:   q.percent_change_30d ?? 0,
      change90d:   q.percent_change_90d ?? 0,
      circulating: d.circulating_supply ?? null,
      maxSupply:   d.max_supply ?? 21_000_000,
      stakedPct:   d.staked_percentage != null ? d.staked_percentage * 100 : null,
      stakingApr:  d.staking_apr != null ? d.staking_apr * 100 : null,
      aiDominance: d.ai_market_dominance != null ? d.ai_market_dominance * 100 : null,
      blockNumber: d.block_number ?? null,
      ts:          d.timestamp ?? new Date().toISOString(),
      source:      'taomarketcap',
    });
    if (d.block_number){
      emit('tao:block', { height: d.block_number, source: 'taomarketcap' });
    }
    /* compat: existing views subscribe to 'tao:price', keep them
       working with real data and no edits. */
    emit('tao:price', {
      price:    q.price ?? d.current_price ?? null,
      change24: q.percent_change_24h ?? 0,
      lastUpdated: Date.now(),
      source: 'taomarketcap',
    });
  } catch (e){
    console.warn('[DataLayer] tao:market failed:', e?.message || e);
  }
}

async function refreshSubnets(){
  try {
    const rows = await tmc('/subnets/table/');
    if (!Array.isArray(rows) || !rows.length) throw new Error('empty');
    const mapped = rows
      .filter(r => r.subnet !== 0)                 /* skip root pseudo-subnet */
      .map(r => ({
        netuid:        r.subnet,
        name:          r.name && r.name !== 'Unknown' ? r.name : `SN${r.subnet}`,
        symbol:        r.symbol || 'α',
        price:         r.price ?? 0,
        marketcap:     r.marketcap ?? 0,
        marketcapRank: r.marketcap_rank ?? 0,
        volume:        r.volume ?? 0,
        chg1h:         r.price_difference_hour ?? 0,
        chg24:         r.price_difference_day ?? 0,
        chg7:          r.price_difference_week ?? 0,
        chg30:         r.price_difference_month ?? 0,
        emission:      r.emission ?? 0,
        logo:          r.logo_url || null,
        owner:         r.subnet_owner || null,
        deregRisk:     !!r.deregistration_risk,
        immune:        !!r.immune,
        active:        r.is_active !== false,
        minersTaoDay:  r.miners_tao_per_day ?? 0,
        block:         r.block_number ?? null,
      }))
      .sort((a, b) => b.marketcap - a.marketcap);
    emit('tao:subnets', mapped);
  } catch (e){
    console.warn('[DataLayer] tao:subnets failed:', e?.message || e);
  }
}

async function refreshChain(){
  try {
    const arr = await tmc('/analytics/chain/');
    if (!Array.isArray(arr) || !arr.length) throw new Error('empty');
    const latest = arr[arr.length - 1];
    emit('tao:chain', {
      totalStaked:    latest.total_staked_tao ?? null,
      totalIssuance:  latest.total_issuance ?? null,
      rootPct:        latest.tao_on_root_percent ?? null,
      subnetsPct:     latest.tao_in_subnets_percent ?? null,
      walletsPct:     latest.tao_on_wallets_percent ?? null,
      tradingVol1h:   latest.trading_volume_1h ?? null,
      totalChainBuys: latest.total_chain_buys ?? null,
      blockNumber:    latest.block_number ?? null,
      ts:             latest.ts ?? null,
      source:         'taomarketcap',
    });
  } catch (e){
    console.warn('[DataLayer] tao:chain failed:', e?.message || e);
  }
}

/**
 * Live validator leaderboard from taostats. Only runs when a key is
 * configured, TMC has no equivalent feed. Stake amounts arrive in
 * RAO and as strings; normalized here to TAO numbers.
 */
async function refreshValidators(){
  if (!CONFIG.taostatsKey) return;
  try {
    const res = await taostats('/validator/latest/v1?limit=100&order=rank_asc');
    const rows = res?.data;
    if (!Array.isArray(rows) || !rows.length) throw new Error('empty');
    const mapped = rows.map(v => ({
      hotkey:          v.hotkey?.ss58 || null,
      coldkey:         v.coldkey?.ss58 || null,
      name:            v.name || (v.hotkey?.ss58 ? v.hotkey.ss58.slice(0, 8) + '…' : 'Unknown'),
      rank:            num(v.rank, 0),
      nominators:      num(v.nominators, 0),
      nominatorsChg24h:num(v.nominators_24_hr_change, 0),
      stake:           num(v.stake, 0) / RAO,
      systemStake:     num(v.system_stake, 0) / RAO,
      stakeChg24h:     num(v.stake_24_hr_change, 0) / RAO,
      dominance:       num(v.dominance, 0),
      take:            num(v.take, 0) * 100,
      apr:             num(v.apr, 0) * 100,
      apr7d:           num(v.apr_7_day_average, 0) * 100,
      apr30d:          num(v.apr_30_day_average, 0) * 100,
      subnets:         Array.isArray(v.registrations) ? v.registrations.length : 0,
      permits:         Array.isArray(v.permits) ? v.permits.length : 0,
      pendingEmission: num(v.pending_emission, 0) / RAO,
    })).sort((a, b) => a.rank - b.rank);
    emit('tao:validators', mapped);
  } catch (e){
    console.warn('[DataLayer] tao:validators failed:', e?.message || e);
  }
}

/* ---------- lifecycle ---------- */

export function start(){
  refreshMarket();
  refreshSubnets();
  refreshChain();
  timers.push(setInterval(refreshMarket,  CONFIG.refresh['tao:market']));
  timers.push(setInterval(refreshSubnets, CONFIG.refresh['tao:subnets']));
  timers.push(setInterval(refreshChain,   CONFIG.refresh['tao:chain']));
  /* taostats validator feed, only when a key is configured. */
  if (CONFIG.taostatsKey){
    refreshValidators();
    timers.push(setInterval(refreshValidators, CONFIG.refresh['tao:validators']));
  }
}

export function stop(){
  timers.splice(0).forEach(clearInterval);
  ctrls.forEach(c => { try { c.abort(); } catch (_) {} });
  ctrls.clear();
}

/** One-shot helpers for views that want a specific endpoint on demand. */
export async function fetchSubnet(netuid){
  try { return await tmc(`/subnets/${netuid}/`); }
  catch (e){ console.warn('[DataLayer] fetchSubnet', netuid, e?.message); return null; }
}
export async function fetchSubnetLineChart(netuid){
  try { return await tmc(`/subnets/${netuid}/line-chart/`); }
  catch (e){ console.warn('[DataLayer] fetchSubnetLineChart', netuid, e?.message); return null; }
}

export const DataLayer = Object.freeze({
  subscribe, get, start, stop, fetchSubnet, fetchSubnetLineChart, _config: CONFIG,
});
