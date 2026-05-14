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

import { html, mount, qs } from '../lib/dom.js';
import { money, compact, pct, deltaClass } from '../lib/format.js';

const SECTIONS = [
  { code:'020', label:'TAO Terminal',  href:'terminal.html',
    desc:'The cockpit. Live τ price chart, network pulse, top movers, emissions, benchmark leaderboard, Asian-AI spotlight, frontier releases.' },
  { code:'040', label:'Subnets',       href:'subnets.html',
    desc:'Every active subnet in one sortable, searchable, filterable table. One click into the full research page for any of them.' },
  { code:'050', label:'Validators',    href:'validators.html',
    desc:'The hotkeys that actually run Bittensor — ranked by stake, nominators, APY, and subnet participation.' },
  { code:'025', label:'Compare',       href:'compare.html',
    desc:'Bittensor subnets vs the centralized world. TTFT, tokens/sec, $/1M, precision, GPU class — side by side with Claude, GPT, Gemini, DeepSeek, Qwen.' },
  { code:'060', label:'Research',      href:'articles.html',
    desc:'Long-form research on decentralized intelligence — subnet profiles, fund letters, primers. Read inline or download the PDF.' },
  { code:'010', label:'Network Map',   href:'#netmap',
    desc:'The validator consensus surface as a rotating 3D globe. Drag to spin; hover a hub for its stake and location.' },
];

/**
 * @param {HTMLElement} root
 * @param {{subscribe:Function, get:Function}|null} [dataLayer]
 */
export function mountHome(root, dataLayer = null){
  mount(root, html`
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
        </div>
        <div class="home-stat">
          <span class="home-stat__lbl">Market Cap</span>
          <span class="home-stat__val" data-bind="mcap">—</span>
          <span class="home-stat__sub" data-bind="mcap-delta">7d —</span>
        </div>
        <div class="home-stat">
          <span class="home-stat__lbl">Circulating</span>
          <span class="home-stat__val" data-bind="circ">—</span>
          <span class="home-stat__sub">of 21M max</span>
        </div>
        <div class="home-stat">
          <span class="home-stat__lbl">Staked</span>
          <span class="home-stat__val" data-bind="staked">—</span>
          <span class="home-stat__sub" data-bind="apr">APR —</span>
        </div>
        <div class="home-stat">
          <span class="home-stat__lbl">24h Volume</span>
          <span class="home-stat__val" data-bind="vol">—</span>
          <span class="home-stat__sub" data-bind="vol-sub">spot</span>
        </div>
        <div class="home-stat">
          <span class="home-stat__lbl">Block height</span>
          <span class="home-stat__val" data-bind="block">—</span>
          <span class="home-stat__sub" data-bind="chain-sub">root / subnet split</span>
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
        <h2 class="home-net__title">Six ways in.</h2>
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
      <span>Live data · Tao Market Cap public API · ${new Date().getUTCFullYear()}</span>
    </footer>
  `);

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
    if (els.price && d.price != null) els.price.textContent = money(d.price);
    if (els.priceDelta){
      const c = d.change24h ?? 0;
      els.priceDelta.textContent = `${pct(c)} · 24h`;
      els.priceDelta.className = `home-stat__sub ${deltaClass(c)}`;
    }
    if (els.mcap && d.marketCap != null) els.mcap.textContent = '$' + compact(d.marketCap);
    if (els.mcapDelta){
      const c = d.change7d ?? 0;
      els.mcapDelta.textContent = `7d ${pct(c)}`;
      els.mcapDelta.className = `home-stat__sub ${deltaClass(c)}`;
    }
    if (els.circ && d.circulating != null) els.circ.textContent = compact(d.circulating) + ' τ';
    if (els.staked && d.stakedPct != null) els.staked.textContent = d.stakedPct.toFixed(1) + '%';
    if (els.apr && d.stakingApr != null) els.apr.textContent = `APR ${d.stakingApr.toFixed(2)}%`;
    if (els.vol && d.volume24h != null) els.vol.textContent = '$' + compact(d.volume24h);
  }
  function renderChain(d){
    if (!d) return;
    if (els.block && d.blockNumber != null) els.block.textContent = d.blockNumber.toLocaleString('en-US');
    if (els.chainSub && d.rootPct != null && d.subnetsPct != null){
      els.chainSub.textContent = `${d.rootPct.toFixed(0)}% root · ${d.subnetsPct.toFixed(0)}% subnet`;
    }
  }

  /* ---------- bind: TOP SUBNETS ---------- */
  const grid = qs('#home-subnets-grid', root);
  function renderSubnets(list){
    if (!grid || !Array.isArray(list) || !list.length) return;
    const top = list.slice(0, 12);
    grid.innerHTML = top.map((s, i) => {
      const up = (s.chg24 ?? 0) >= 0;
      const logo = s.logo
        ? `<img class="home-subnet__logo" src="${s.logo}" alt="" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
           <span class="home-subnet__logo-fallback" style="display:none">${s.symbol || 'α'}</span>`
        : `<span class="home-subnet__logo-fallback">${s.symbol || 'α'}</span>`;
      return `
        <li class="home-subnet">
          <a class="home-subnet__link" href="subnet.html?id=${s.netuid}">
            <span class="home-subnet__rank">${String(i + 1).padStart(2, '0')}</span>
            <span class="home-subnet__logo-wrap">${logo}</span>
            <span class="home-subnet__id">SN${s.netuid}</span>
            <span class="home-subnet__name">${s.name}</span>
            <span class="home-subnet__price">${s.price < 1 ? '$' + s.price.toFixed(4) : money(s.price)}</span>
            <span class="home-subnet__chg ${up ? 'up' : 'down'}">${pct(s.chg24 ?? 0)}</span>
            <span class="home-subnet__mcap">MC $${compact(s.marketcap)}</span>
          </a>
        </li>
      `;
    }).join('');
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
    destroy(){ unsubs.forEach(u => u()); },
  };
}
