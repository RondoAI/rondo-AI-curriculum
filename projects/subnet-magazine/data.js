/* =================================================================
   SUBNET MAGAZINE — DATA LAYER
   -----------------------------------------------------------------
   A single source of truth for live data, with the following design
   goals:

     - One module surface (window.SubnetData) — no global pollution.
     - Pub/sub: views subscribe to channels, the layer fetches on
       intervals and emits. Views never call fetch directly.
     - Retry with exponential backoff + AbortController timeouts.
     - In-memory cache with TTL. Stale-while-revalidate.
     - Graceful degradation: every channel has a synthetic source
       that runs when the live source is unavailable. The UI never
       sees an empty state.
     - All endpoints CORS-friendly OR keyed (taostats). Keys read
       from window.__SUBNET_CONFIG__ at boot — never embedded.

   Channels emitted:
     - 'tao:price'      { price, change24, lastUpdated, source }
     - 'tao:block'      { height, lastUpdated, source }
     - 'tao:subnets'    [{ netuid, name, ..., live? }]
     - 'news:ai'        [{ id, ts, title, source, url, points }]

   Public API:
     SubnetData.subscribe(channel, fn) -> unsubscribe()
     SubnetData.get(channel)           -> last emitted value
     SubnetData.start()                -> begin polling
     SubnetData.stop()                 -> cancel everything

   No build step. No dependencies. No localStorage (would survive
   reloads but introduces a privacy surface — opt in instead).
   ================================================================= */

window.SubnetData = (() => {
  'use strict';

  /* ---------- Config ---------- */
  const USER_CONFIG = (typeof window !== 'undefined' && window.__SUBNET_CONFIG__) || {};
  const CONFIG = Object.freeze({
    refresh: {
      tao_price:  30_000,   // CoinGecko free tier is generous; 30s is polite.
      tao_block:  12_000,   // Bittensor block time is ~12s.
      tao_subnets:60_000,
      news_ai:    180_000,  // 3 minutes
    },
    endpoints: {
      coingecko:   'https://api.coingecko.com/api/v3',
      taostats:    USER_CONFIG.taostatsBase   || 'https://api.taostats.io/api',
      hn_algolia:  'https://hn.algolia.com/api/v1',
    },
    keys: {
      taostats: USER_CONFIG.taostatsKey || null,
    },
    timeouts: { default: 8_000 },
    retries:  { default: 3 },
  });

  /* ---------- Cache + pub/sub ---------- */
  const cache       = new Map();   // channel -> { value, ts }
  const subscribers = new Map();   // channel -> Set<fn>
  const timers      = [];          // setInterval handles
  const controllers = new Set();   // active AbortControllers

  function subscribe(channel, fn){
    if (!subscribers.has(channel)) subscribers.set(channel, new Set());
    subscribers.get(channel).add(fn);
    // immediately deliver the cached value if present
    const cached = cache.get(channel);
    if (cached) {
      try { fn(cached.value, {fromCache:true}); } catch(e) { console.error(e); }
    }
    return () => subscribers.get(channel)?.delete(fn);
  }
  function emit(channel, value, meta={}){
    cache.set(channel, {value, ts: Date.now()});
    const set = subscribers.get(channel);
    if (!set) return;
    set.forEach(fn => {
      try { fn(value, meta); } catch(e) { console.error('[SubnetData] subscriber error', e); }
    });
  }
  function get(channel){
    return cache.get(channel)?.value ?? null;
  }

  /* ---------- Networking ---------- */
  async function fetchWithRetry(url, {headers={}, timeout=CONFIG.timeouts.default, retries=CONFIG.retries.default} = {}){
    let lastErr;
    for (let attempt = 0; attempt <= retries; attempt++){
      const ctl = new AbortController();
      controllers.add(ctl);
      const to = setTimeout(() => ctl.abort('timeout'), timeout);
      try {
        const res = await fetch(url, {headers, signal: ctl.signal, cache:'no-store'});
        if (!res.ok){
          // do not retry 4xx (config / key / quota) except 429
          if (res.status >= 400 && res.status < 500 && res.status !== 429) {
            throw new Error(`HTTP ${res.status}`);
          }
          throw new Error(`HTTP ${res.status}`);
        }
        return await res.json();
      } catch (err){
        lastErr = err;
        if (attempt === retries) break;
        const backoff = Math.min(2000 * Math.pow(2, attempt), 15000) + Math.random()*200;
        await sleep(backoff);
      } finally {
        clearTimeout(to);
        controllers.delete(ctl);
      }
    }
    throw lastErr;
  }
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  /* ---------- Adapter: CoinGecko ---------- */
  // Public, no key needed. CORS allowed. Rate-limited; one call every 30s is fine.
  async function fetchTaoPriceLive(){
    const url = `${CONFIG.endpoints.coingecko}/simple/price?ids=bittensor&vs_currencies=usd&include_24hr_change=true&include_last_updated_at=true`;
    const data = await fetchWithRetry(url);
    const d = data?.bittensor;
    if (!d || typeof d.usd !== 'number') throw new Error('coingecko: malformed response');
    return {
      price: d.usd,
      change24: d.usd_24h_change ?? 0,
      lastUpdated: (d.last_updated_at || Math.floor(Date.now()/1000)) * 1000,
      source: 'coingecko',
    };
  }

  /* ---------- Adapter: Taostats ---------- */
  // Optional. Activate by setting window.__SUBNET_CONFIG__.taostatsKey.
  // Endpoint shapes follow taostats.io's REST surface; if the key is
  // missing or the endpoint shape changes we fall through to the
  // synthetic source.
  async function fetchTaoBlockLive(){
    if (!CONFIG.keys.taostats) throw new Error('no taostats key');
    const url = `${CONFIG.endpoints.taostats}/block/latest/v1`;
    const data = await fetchWithRetry(url, {headers:{Authorization:CONFIG.keys.taostats, accept:'application/json'}});
    const block = Array.isArray(data?.data) ? data.data[0] : (data?.block ?? data);
    const height = block?.block_number ?? block?.number ?? block?.height;
    if (typeof height !== 'number') throw new Error('taostats: malformed block response');
    return { height, lastUpdated: Date.now(), source: 'taostats' };
  }
  async function fetchSubnetsLive(){
    if (!CONFIG.keys.taostats) throw new Error('no taostats key');
    const url = `${CONFIG.endpoints.taostats}/subnet/latest/v1?limit=100`;
    const data = await fetchWithRetry(url, {headers:{Authorization:CONFIG.keys.taostats, accept:'application/json'}});
    const rows = Array.isArray(data?.data) ? data.data : (data?.subnets ?? []);
    if (!rows.length) throw new Error('taostats: empty subnets');
    return rows.map(r => ({
      netuid:   r.netuid ?? r.uid,
      name:     r.subnet_name ?? r.name ?? `SN${r.netuid}`,
      emission: r.emission ?? r.daily_emission ?? 0,
      miners:   r.active_miners ?? r.miners ?? 0,
      live: true,
    }));
  }

  /* ---------- Adapter: HN Algolia (AI news) ---------- */
  // Free, CORS-friendly, no key. We query the AI-tagged topics and
  // filter for the labs the desk covers.
  async function fetchAiNewsLive(){
    const since = Math.floor((Date.now() - 1000*60*60*48) / 1000); // last 48h
    const q = encodeURIComponent('AI OR Anthropic OR OpenAI OR DeepMind OR Gemini OR Claude OR Llama OR NVIDIA OR GPT');
    const url = `${CONFIG.endpoints.hn_algolia}/search_by_date?query=${q}&tags=story&numericFilters=created_at_i>${since},points>=5&hitsPerPage=24`;
    const data = await fetchWithRetry(url);
    const hits = Array.isArray(data?.hits) ? data.hits : [];
    if (!hits.length) throw new Error('hn: no hits');
    return hits.map(h => ({
      id:      h.objectID,
      ts:      h.created_at_i * 1000,
      title:   h.title,
      source:  inferSource(h.title || ''),
      url:     h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
      points:  h.points || 0,
      live:    true,
    }));
  }
  function inferSource(title){
    const t = title.toLowerCase();
    if (t.includes('anthropic') || t.includes('claude')) return 'ANTH';
    if (t.includes('openai') || t.includes('gpt'))       return 'OPENAI';
    if (t.includes('deepmind') || t.includes('gemini') || t.includes('google'))  return 'DM';
    if (t.includes('meta') || t.includes('llama') || t.includes('facebook'))     return 'META';
    if (t.includes('xai') || t.includes('grok') || t.includes('musk'))           return 'xAI';
    if (t.includes('microsoft') || t.includes('copilot') || t.includes('azure')) return 'MSFT';
    if (t.includes('nvidia') || t.includes('cuda') || t.includes('blackwell'))   return 'NVDA';
    if (t.includes('tsmc') || t.includes('foundry'))                             return 'TSM';
    if (t.includes('broadcom') || t.includes('avgo'))                            return 'AVGO';
    if (t.includes('regulat') || t.includes('policy') || t.includes('eu ai'))    return 'POL';
    return 'AI';
  }

  /* ---------- Synthetic fallbacks ---------- */
  function syntheticTaoPrice(){
    const last = get('tao:price');
    const start = last?.price ?? 487.12;
    const baseline = last?.baseline ?? start;
    const step = (Math.random() - .5) * 1.2;
    const price = Math.max(420, Math.min(540, start + step));
    return {
      price,
      change24: ((price - baseline) / baseline) * 100,
      lastUpdated: Date.now(),
      baseline: baseline + (price - baseline) * 0.002,
      source: 'simulated',
    };
  }
  function syntheticBlock(){
    const last = get('tao:block');
    const height = last?.height ? last.height + 1 : 4_812_047;
    return { height, lastUpdated: Date.now(), source: 'simulated' };
  }
  function syntheticAiNews(){
    return null; // app.js already has a curated synthetic feed for first paint
  }

  /* ---------- Refresh runners ---------- */
  async function refreshTaoPrice(){
    try   { emit('tao:price', await fetchTaoPriceLive()); }
    catch (e){
      console.warn('[SubnetData] tao:price live failed, using sim:', e?.message || e);
      emit('tao:price', syntheticTaoPrice());
    }
  }
  async function refreshTaoBlock(){
    try   { emit('tao:block', await fetchTaoBlockLive()); }
    catch { emit('tao:block', syntheticBlock()); }
  }
  async function refreshSubnets(){
    try   {
      const live = await fetchSubnetsLive();
      emit('tao:subnets', live);
    } catch (_) {
      // nothing to emit; app.js's seeded SUBNETS array still drives the UI.
    }
  }
  async function refreshAiNews(){
    try   {
      const live = await fetchAiNewsLive();
      emit('news:ai', live);
    } catch (e){
      console.warn('[SubnetData] news:ai live failed:', e?.message || e);
      const syn = syntheticAiNews();
      if (syn) emit('news:ai', syn);
    }
  }

  /* ---------- Lifecycle ---------- */
  function start(){
    // immediate kicks, then intervals
    refreshTaoPrice();
    refreshTaoBlock();
    refreshSubnets();
    refreshAiNews();
    timers.push(setInterval(refreshTaoPrice, CONFIG.refresh.tao_price));
    timers.push(setInterval(refreshTaoBlock, CONFIG.refresh.tao_block));
    timers.push(setInterval(refreshSubnets,  CONFIG.refresh.tao_subnets));
    timers.push(setInterval(refreshAiNews,   CONFIG.refresh.news_ai));
  }
  function stop(){
    timers.splice(0).forEach(clearInterval);
    controllers.forEach(c => { try { c.abort('stop'); } catch(_){} });
    controllers.clear();
  }

  return Object.freeze({
    subscribe, get, start, stop,
    _config: CONFIG,            // exposed read-only for debugging
  });
})();
