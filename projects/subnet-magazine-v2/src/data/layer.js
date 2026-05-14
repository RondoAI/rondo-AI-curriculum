/* =================================================================
   SUBNET MAGAZINE — DATA LAYER (v2, ES module)
   -----------------------------------------------------------------
   Pub/sub data layer with retry, AbortController timeouts, and
   in-memory caching. Channels:

     - 'tao:price'   { price, change24, lastUpdated, source }
     - 'tao:block'   { height, lastUpdated, source }
     - 'news:ai'     [{ ts, source, title, url, points, ... }]

   Adapters fail silently and the UI falls through to its own
   synthetic source. Configure keys via window.__SUBNET_CONFIG__.
   ================================================================= */

/** @typedef {(value: any, meta?: {fromCache?: boolean}) => void} Subscriber */

const CONFIG = Object.freeze({
  refresh: {
    'tao:price': 30_000,
    'tao:block': 12_000,
    'news:ai':   180_000,
  },
  endpoints: {
    coingecko: 'https://api.coingecko.com/api/v3',
    hn:        'https://hn.algolia.com/api/v1',
  },
});

const cache = new Map();
const subs  = new Map();
const timers = [];
const ctrls  = new Set();

/**
 * Subscribe to a channel. Returns an unsubscribe function.
 * @param {string} channel
 * @param {Subscriber} fn
 * @returns {() => void}
 */
export function subscribe(channel, fn){
  if (!subs.has(channel)) subs.set(channel, new Set());
  subs.get(channel).add(fn);
  const cached = cache.get(channel);
  if (cached) try { fn(cached.value, { fromCache: true }); } catch (e) { console.error(e); }
  return () => subs.get(channel)?.delete(fn);
}

/** Last cached value for a channel, or null. */
export function get(channel){ return cache.get(channel)?.value ?? null; }

function emit(channel, value){
  cache.set(channel, { value, ts: Date.now() });
  const set = subs.get(channel);
  if (!set) return;
  set.forEach(fn => { try { fn(value); } catch (e) { console.error('subscriber', e); } });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function fetchJSON(url, { timeout = 8000, retries = 2, headers = {} } = {}){
  let err;
  for (let attempt = 0; attempt <= retries; attempt++){
    const c = new AbortController(); ctrls.add(c);
    const to = setTimeout(() => c.abort(), timeout);
    try {
      const res = await fetch(url, { signal: c.signal, cache: 'no-store', headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e){
      err = e;
      if (attempt === retries) break;
      await sleep(Math.min(2000 * 2 ** attempt, 8000) + Math.random() * 200);
    } finally {
      clearTimeout(to); ctrls.delete(c);
    }
  }
  throw err;
}

async function refreshTaoPrice(){
  try {
    const url = `${CONFIG.endpoints.coingecko}/simple/price?ids=bittensor&vs_currencies=usd&include_24hr_change=true&include_last_updated_at=true`;
    const data = await fetchJSON(url);
    const d = data?.bittensor;
    if (typeof d?.usd !== 'number') throw new Error('coingecko: malformed');
    emit('tao:price', {
      price: d.usd,
      change24: d.usd_24h_change ?? 0,
      lastUpdated: (d.last_updated_at || Math.floor(Date.now() / 1000)) * 1000,
      source: 'coingecko',
    });
  } catch (e){
    // synthetic drift fallback
    const last = get('tao:price');
    const price = (last?.price ?? 487.12) + (Math.random() - .5) * 1.5;
    emit('tao:price', {
      price: Math.max(420, Math.min(540, price)),
      change24: last?.change24 ?? 0,
      lastUpdated: Date.now(),
      source: 'simulated',
    });
    if (!last) console.warn('[DataLayer] tao:price live failed, using sim:', e?.message);
  }
}

async function refreshAiNews(){
  try {
    const since = Math.floor((Date.now() - 1000 * 60 * 60 * 48) / 1000);
    const q = encodeURIComponent('AI OR Anthropic OR OpenAI OR DeepMind OR Gemini OR Claude OR Llama OR NVIDIA OR GPT');
    const url = `${CONFIG.endpoints.hn}/search_by_date?query=${q}&tags=story&numericFilters=created_at_i>${since},points>=5&hitsPerPage=24`;
    const data = await fetchJSON(url);
    const hits = Array.isArray(data?.hits) ? data.hits : [];
    if (!hits.length) throw new Error('no hits');
    emit('news:ai', hits.map(h => ({
      id: h.objectID,
      ts: (h.created_at_i || 0) * 1000,
      title: h.title || '',
      source: inferSource(h.title || ''),
      url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
      points: h.points || 0,
    })));
  } catch (e){
    // app surface keeps its synthetic feed; no emit
  }
}

function inferSource(t){
  const s = t.toLowerCase();
  if (s.includes('anthropic') || s.includes('claude')) return 'ANTH';
  if (s.includes('openai') || s.includes('gpt'))      return 'OPENAI';
  if (s.includes('deepmind') || s.includes('gemini')) return 'DM';
  if (s.includes('meta') || s.includes('llama'))      return 'META';
  if (s.includes('xai') || s.includes('grok'))        return 'xAI';
  if (s.includes('microsoft') || s.includes('copilot')|| s.includes('azure')) return 'MSFT';
  if (s.includes('nvidia') || s.includes('blackwell'))return 'NVDA';
  if (s.includes('tsmc'))                              return 'TSM';
  if (s.includes('broadcom'))                          return 'AVGO';
  if (s.includes('regulat') || s.includes('eu ai'))   return 'POL';
  return 'AI';
}

/** Start polling. Safe to call once at boot. */
export function start(){
  refreshTaoPrice();
  refreshAiNews();
  timers.push(setInterval(refreshTaoPrice, CONFIG.refresh['tao:price']));
  timers.push(setInterval(refreshAiNews,   CONFIG.refresh['news:ai']));
}

/** Shut everything down (tests, page-leave). */
export function stop(){
  timers.splice(0).forEach(clearInterval);
  ctrls.forEach(c => { try { c.abort(); } catch (_) {} });
  ctrls.clear();
}

/** Public surface for views. */
export const DataLayer = Object.freeze({ subscribe, get, start, stop });
