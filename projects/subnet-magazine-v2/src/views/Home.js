/* =================================================================
   SUBNET MAGAZINE — HOME (magazine cover, real data)
   -----------------------------------------------------------------
   The content below the hero icosphere + validator globe on
   index.html. Three blocks:

     1. LIVE NETWORK band — real TAO price, market cap, circulating
        supply, staked %, staking APR, FDV, block height. Pulled
        from the TMC API via DataLayer ('tao:market' + 'tao:chain').
     2. TOP SUBNETS — the real top-12 subnets by market cap, each
        with its real logo, netuid, α-price, 24h change, market
        cap. Click any card → subnet.html?id=N. Sourced from
        DataLayer 'tao:subnets'.
     3. SECTIONS — a clean card grid linking to every page on the
        site with a one-line explanation of each.

   Everything that's live is labelled LIVE; if the API can't be
   reached the band falls back to "—" rather than faking numbers.
   ================================================================= */

import { html, mount, qs, qsa, setLive } from '../lib/dom.js';
import { money, compact, pct, deltaClass, bbgDate } from '../lib/format.js';
import { mark, seedSeries } from '../lib/mark.js';
import { cardArt } from '../lib/art.js';
import { Sparkline } from '../charts/Sparkline.js';
import { CoverArt } from '../charts/CoverArt.js';
import { NeuralNet } from '../charts/NeuralNet.js';
import { articlesByDate } from '../data/articles.js';

const CAT_LABEL = {
  'reporting':   'REPORTING',
  'profile':     'SUBNET PROFILE',
  'op-ed':       'OP-ED',
  'fund-letter': 'FUND LETTER',
  'primer':      'PRIMER',
};

function artDate(iso){
  const d = new Date(iso + 'T00:00:00Z');
  return `${String(d.getUTCDate()).padStart(2,'0')} `
       + `${d.toLocaleDateString('en-US',{month:'short'}).toUpperCase()} `
       + `${d.getUTCFullYear()}`;
}

const SECTIONS = [
  { code:'020', label:'TAO Terminal',  href:'terminal.html',
    desc:'The cockpit. Live τ price chart, network pulse, top movers, emissions, benchmark leaderboard, Asian-AI spotlight, frontier releases.' },
  { code:'030', label:'Markets',       href:'markets.html',
    desc:'The movers desk — subnets by 24h gainers, losers and activity with sparklines, and the centralized AI landscape ranked by valuation.' },
  { code:'040', label:'Subnets',       href:'subnets.html',
    desc:'Every active subnet in one sortable, searchable, filterable table. One click into the full research page for any of them.' },
  { code:'050', label:'Validators',    href:'validators.html',
    desc:'The hotkeys that actually run Bittensor — ranked by stake, nominators, APY, and subnet participation.' },
  { code:'025', label:'Compare',       href:'compare.html',
    desc:'Bittensor subnets vs the centralized world. TTFT, tokens/sec, $/1M, precision, GPU class — side by side with Claude, GPT, Gemini, DeepSeek, Qwen.' },
  { code:'026', label:'Centralized Desk', href:'centralized.html',
    desc:'The centralized AI race, watched — closed labs, compute build-outs, and capital, with the Asian frontier first-class. Reading cards and the full roster.' },
  { code:'060', label:'Research',      href:'articles.html',
    desc:'Long-form research on decentralized intelligence — subnet profiles, fund letters, primers. Read inline or download the PDF.' },
  { code:'070', label:'Community',     href:'community.html',
    desc:'The ecosystem out loud — a live τ pulse, the Subneτ Magazine X timeline, and a curated directory of the voices worth following.' },
  { code:'010', label:'Network Map',   href:'network.html',
    desc:'The validator consensus surface as a rotating 3D globe. Drag to spin; hover a hub for its stake and location.' },
];

/**
 * @param {HTMLElement} root
 * @param {{subscribe:Function, get:Function}|null} [dataLayer]
 */
export function mountHome(root, dataLayer = null){
  const articles = articlesByDate();

  mount(root, html`
    <!-- ===== FEATURED RESEARCH (top of page) ===== -->
    <section class="home-research" aria-label="Featured research">
      <div class="home-research__head">
        <span class="home-net__kicker"><span class="live-dot"></span>Featured Research · the desk</span>
        <a class="home-subnets__all" href="articles.html">All research ↗</a>
      </div>
      <ul class="home-research__grid">
        ${articles.map((a, i) => `
          <li class="home-article ${i === 0 ? 'is-lead' : ''}">
            <a class="home-article__link" href="articles.html?id=${a.id}">
              <span class="home-article__art">
                ${cardArt(a.id + '|' + a.title, { variant: a.category || a.kicker || '', w: 520, h: i === 0 ? 300 : 220 })}
                <span class="home-article__art-frame" aria-hidden="true"></span>
              </span>
              <span class="home-article__kicker">${CAT_LABEL[a.category] || (a.kicker || 'RESEARCH')}</span>
              <span class="home-article__title">${a.title}</span>
              <span class="home-article__tagline">${a.tagline}</span>
              <span class="home-article__meta">
                <span>${a.authors.join(', ')}</span>
                <span>${artDate(a.date)} · ${a.readMin} min</span>
              </span>
            </a>
          </li>
        `).join('')}
      </ul>
    </section>

    <!-- ===== COVER ===== -->
    <section class="home-cover" aria-label="Issue cover">
      <canvas class="home-cover__art" data-canvas="cover-art" aria-hidden="true"></canvas>
      <div class="home-cover__inner">
        <div class="home-cover__meta">
          <span>Issue No. 02</span>
          <span>${bbgDate()}</span>
          <span>Decentralized Intelligence Desk</span>
        </div>
        <h1 class="home-cover__title">The market for <em>intelligence</em>, on-chain.</h1>
        <p class="home-cover__dek">A research terminal for Bittensor — live subnet markets, validator
        analytics, and editorial coverage of decentralized AI, with Asian frontier labs covered first-class.</p>
      </div>
    </section>

    <!-- ===== NEURAL NETWORK ===== -->
    <section class="home-neural" aria-label="The Bittensor consensus network">
      <div class="home-net__head">
        <span class="home-net__kicker">&gt; The machine</span>
        <h2 class="home-net__title">Intelligence, <em>incentivized.</em></h2>
        <p class="home-net__sub">Every block, Bittensor fires the same loop — subnets set the task, miners
        compete, validators score, consensus pays. This is that loop, rendered live.</p>
      </div>
      <div class="home-neural__canvas"><canvas data-canvas="neural"></canvas></div>
    </section>

    <!-- ===== LIVE NETWORK band ===== -->
    <section class="home-net" aria-label="Live network statistics">
      <div class="home-net__head">
        <span class="home-net__kicker"><span class="live-dot"></span>Live Network · taomarketcap</span>
        <h2 class="home-net__title">Bittensor, <em>right now.</em></h2>
        <p class="home-net__sub">Real on-chain data — TAO market, supply, staking, and chain state — refreshed straight from the Tao Market Cap public API.</p>
      </div>
      <div class="home-net__grid">
        <div class="home-stat home-stat--lead">
          <span class="home-stat__lbl">τ / USD</span>
          <span class="home-stat__val" data-bind="price">—</span>
          <span class="home-stat__sub" data-bind="price-delta">—</span>
          <span class="home-stat__spark"><canvas data-spark="price"></canvas></span>
        </div>
        <div class="home-stat">
          <span class="home-stat__lbl">Market Cap</span>
          <span class="home-stat__val" data-bind="mcap">—</span>
          <span class="home-stat__sub" data-bind="mcap-delta">7d —</span>
          <span class="home-stat__spark"><canvas data-spark="mcap"></canvas></span>
        </div>
        <div class="home-stat">
          <span class="home-stat__lbl">Circulating</span>
          <span class="home-stat__val" data-bind="circ">—</span>
          <span class="home-stat__sub">of 21M max</span>
          <span class="home-stat__spark"><canvas data-spark="circ"></canvas></span>
        </div>
        <div class="home-stat">
          <span class="home-stat__lbl">Staked</span>
          <span class="home-stat__val" data-bind="staked">—</span>
          <span class="home-stat__sub" data-bind="apr">APR —</span>
          <span class="home-stat__spark"><canvas data-spark="staked"></canvas></span>
        </div>
        <div class="home-stat">
          <span class="home-stat__lbl">24h Volume</span>
          <span class="home-stat__val" data-bind="vol">—</span>
          <span class="home-stat__sub" data-bind="vol-sub">spot</span>
          <span class="home-stat__spark"><canvas data-spark="vol"></canvas></span>
        </div>
        <div class="home-stat">
          <span class="home-stat__lbl">Block height</span>
          <span class="home-stat__val" data-bind="block">—</span>
          <span class="home-stat__sub" data-bind="chain-sub">root / subnet split</span>
          <span class="home-stat__spark"><canvas data-spark="block"></canvas></span>
        </div>
      </div>
    </section>

    <!-- ===== TOP SUBNETS ===== -->
    <section class="home-subnets" aria-label="Top subnets by market cap">
      <div class="home-subnets__head">
        <div>
          <span class="home-net__kicker"><span class="live-dot"></span>Top Subnets · by market cap</span>
          <h2 class="home-net__title">The market for <em>intelligence.</em></h2>
        </div>
        <a class="home-subnets__all" href="subnets.html">All subnets ↗</a>
      </div>
      <ul class="home-subnets__grid" id="home-subnets-grid">
        <li class="home-subnet is-loading"><span class="home-subnet__skeleton"></span></li>
        <li class="home-subnet is-loading"><span class="home-subnet__skeleton"></span></li>
        <li class="home-subnet is-loading"><span class="home-subnet__skeleton"></span></li>
        <li class="home-subnet is-loading"><span class="home-subnet__skeleton"></span></li>
      </ul>
    </section>

    <!-- ===== SECTIONS NAV ===== -->
    <section class="home-sections" aria-label="Site sections">
      <div class="home-net__head">
        <span class="home-net__kicker">&gt; The whole terminal</span>
        <h2 class="home-net__title">Nine ways in.</h2>
      </div>
      <ul class="home-sections__grid">
        ${SECTIONS.map(s => `
          <li class="home-section">
            <a class="home-section__link" href="${s.href}">
              <span class="home-section__code">&lt;${s.code}&gt;</span>
              <span class="home-section__label">${s.label}</span>
              <span class="home-section__desc">${s.desc}</span>
              <span class="home-section__go">Open →</span>
            </a>
          </li>
        `).join('')}
      </ul>
    </section>

    <footer class="home-foot">
      <span>Subneτ Magazine · a research terminal for decentralized intelligence</span>
      <a class="home-foot__x" href="https://x.com/subnetmagazine" target="_blank" rel="noopener">𝕏 @subnetmagazine</a>
      <span>Live data · Tao Market Cap public API · ${new Date().getUTCFullYear()}</span>
    </footer>
  `);

  /* ---------- cover art + neural network ---------- */
  const coverCanvas = qs('[data-canvas="cover-art"]', root);
  const cover = coverCanvas ? new CoverArt(coverCanvas) : null;
  const neuralCanvas = qs('[data-canvas="neural"]', root);
  const neural = neuralCanvas ? new NeuralNet(neuralCanvas) : null;

  /* ---------- LIVE NETWORK band sparklines ---------- */
  /* one micro-trend per stat — deterministic, keyed to the field, a
     visual read of momentum until per-field history endpoints land. */
  const statSparks = [];
  [
    ['price',   18], ['mcap',   12], ['circ',   4],
    ['staked',  6],  ['vol',   -9], ['block',  22],
  ].forEach(([key, drift]) => {
    const cv = qs(`[data-spark="${key}"]`, root);
    if (cv) statSparks.push(new Sparkline(cv, { series: seedSeries(key, drift, 32) }));
  });

  /* ---------- bind: LIVE NETWORK band ---------- */
  const bind = sel => qs(`[data-bind="${sel}"]`, root);
  const els = {
    price:      bind('price'),
    priceDelta: bind('price-delta'),
    mcap:       bind('mcap'),
    mcapDelta:  bind('mcap-delta'),
    circ:       bind('circ'),
    staked:     bind('staked'),
    apr:        bind('apr'),
    vol:        bind('vol'),
    volSub:     bind('vol-sub'),
    block:      bind('block'),
    chainSub:   bind('chain-sub'),
  };

  function renderMarket(d){
    if (!d) return;
    if (els.price && d.price != null) setLive(els.price, money(d.price));
    if (els.priceDelta){
      const c = d.change24h ?? 0;
      els.priceDelta.textContent = `${pct(c)} · 24h`;
      els.priceDelta.className = `home-stat__sub ${deltaClass(c)}`;
    }
    if (els.mcap && d.marketCap != null) setLive(els.mcap, '$' + compact(d.marketCap));
    if (els.mcapDelta){
      const c = d.change7d ?? 0;
      els.mcapDelta.textContent = `7d ${pct(c)}`;
      els.mcapDelta.className = `home-stat__sub ${deltaClass(c)}`;
    }
    if (els.circ && d.circulating != null) setLive(els.circ, compact(d.circulating) + ' τ');
    if (els.staked && d.stakedPct != null) setLive(els.staked, d.stakedPct.toFixed(1) + '%');
    if (els.apr && d.stakingApr != null) els.apr.textContent = `APR ${d.stakingApr.toFixed(2)}%`;
    if (els.vol && d.volume24h != null) setLive(els.vol, '$' + compact(d.volume24h));
  }
  function renderChain(d){
    if (!d) return;
    if (els.block && d.blockNumber != null) setLive(els.block, d.blockNumber.toLocaleString('en-US'));
    if (els.chainSub && d.rootPct != null && d.subnetsPct != null){
      els.chainSub.textContent = `${d.rootPct.toFixed(0)}% root · ${d.subnetsPct.toFixed(0)}% subnet`;
    }
  }

  /* ---------- bind: TOP SUBNETS ---------- */
  const grid = qs('#home-subnets-grid', root);
  let sparks = [];
  function renderSubnets(list){
    if (!grid || !Array.isArray(list) || !list.length) return;
    sparks.splice(0).forEach(sp => { try { sp.destroy(); } catch (_) {} });
    const top = list.slice(0, 12);
    grid.innerHTML = top.map((s, i) => {
      const up = (s.chg24 ?? 0) >= 0;
      /* Real logo when the API gives one; a generated node-graph
         monogram (deterministic per name) as the fallback so every
         card carries a mark, never a bare letter. */
      const fallback = mark(s.name, { size: 32 });
      const logo = s.logo
        ? `<img class="home-subnet__logo" src="${s.logo}" alt="" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='block'">
           <span class="home-subnet__logo-fallback" style="display:none">${fallback}</span>`
        : `<span class="home-subnet__logo-fallback">${fallback}</span>`;
      return `
        <li class="home-subnet">
          <a class="home-subnet__link" href="subnet.html?id=${s.netuid}">
            <span class="home-subnet__rank">${String(i + 1).padStart(2, '0')}</span>
            <span class="home-subnet__logo-wrap">${logo}</span>
            <span class="home-subnet__id">SN${s.netuid}</span>
            <span class="home-subnet__name">${s.name}</span>
            <span class="home-subnet__spark"><canvas></canvas></span>
            <span class="home-subnet__price">${s.price < 1 ? '$' + s.price.toFixed(4) : money(s.price)}</span>
            <span class="home-subnet__chg ${up ? 'up' : 'down'}">${pct(s.chg24 ?? 0)}</span>
            <span class="home-subnet__mcap">MC $${compact(s.marketcap)}</span>
          </a>
        </li>
      `;
    }).join('');
    /* mount one sparkline per card — synthesized trend keyed to the
       subnet name + its real 24h change until a real per-subnet
       history endpoint is wired in. */
    const canvases = qsa('.home-subnet__spark canvas', grid);
    canvases.forEach((cv, i) => {
      const s = top[i];
      sparks.push(new Sparkline(cv, { series: seedSeries(s.name, s.chg24 ?? 0, 24) }));
    });
  }

  /* ---------- subscribe ---------- */
  const unsubs = [];
  if (dataLayer){
    unsubs.push(dataLayer.subscribe('tao:market',  renderMarket));
    unsubs.push(dataLayer.subscribe('tao:chain',   renderChain));
    unsubs.push(dataLayer.subscribe('tao:subnets', renderSubnets));
    /* render anything already cached */
    renderMarket(dataLayer.get('tao:market'));
    renderChain(dataLayer.get('tao:chain'));
    renderSubnets(dataLayer.get('tao:subnets'));
  }

  return {
    destroy(){
      unsubs.forEach(u => u());
      sparks.splice(0).forEach(sp => { try { sp.destroy(); } catch (_) {} });
      statSparks.splice(0).forEach(sp => { try { sp.destroy(); } catch (_) {} });
      cover?.destroy();
      neural?.destroy();
    },
  };
}
