/* =================================================================
   SUBNET MAGAZINE, MARKETS
   -----------------------------------------------------------------
   The movers desk, in the markets-app list format:

     1. TRENDING & MOVERS, Bittensor subnets, toggled Gainers /
        Losers / Most Active. Each row: netuid + name, a sparkline,
        live α-price, and a coloured 24h % pill.
     2. HIGHEST VALUATION, the centralized AI landscape ranked by
        valuation, with each company's ticker (".PVT" when
        private), the headline valuation, and its region.

   Subnet rows run on the live 'tao:subnets' feed (seed fallback);
   sparklines are deterministic shapes keyed to name + 24h move.
   ================================================================= */

import { html, mount, qs, qsa, on } from '../lib/dom.js';
import { money, pct } from '../lib/format.js';
import { seedSeries } from '../lib/mark.js';
import { Sparkline } from '../charts/Sparkline.js';
import { Treemap } from '../charts/Treemap.js';
import { Heatmap } from '../charts/Heatmap.js';
import { SUBNETS } from '../data/subnets.js';
import { CENTRALIZED_PLAYERS, ASIAN_REGIONS, tickerFor } from '../data/centralized.js';

/* Per-subnet logo lookup — keyed by lowercased subnet name.
   Mirror of Cockpit.js + Home.js. Falls back to Bittensor mark. */
const SUBNET_LOGOS = {
  'hippius': 'assets/hippius-mark.png',
  'targon':  'assets/targon-mark.svg',
};
const FALLBACK_LOGO = 'assets/bittensor-mark.png';

function parseVal(v){
  const m = String(v || '').match(/\$?\s*([\d.]+)\s*([TBM])/i);
  if (!m) return 0;
  return parseFloat(m[1]) * ({ t: 1e12, b: 1e9, m: 1e6 }[m[2].toLowerCase()] || 1);
}
const fmtPrice = p => p == null ? 'Â·' : (p < 1 ? '$' + p.toFixed(4) : money(p));
const fmtPct   = v => `${v >= 0 ? '+' : ''}${(v ?? 0).toFixed(2)}%`;

/**
 * @param {HTMLElement} root
 * @param {{subscribe:Function, get:Function}|null} [dataLayer]
 */
export function mountMarkets(root, dataLayer = null){
  /* uniform subnet row: { netuid, name, price, chg24, activity } */
  const fromSeed = s => ({
    netuid: s.netuid, name: s.name, price: s.price ?? 0,
    chg24: s.chg24 ?? 0, activity: (s.mcap ?? 0) * 1e6,
  });
  const fromLive = s => ({
    netuid: s.netuid, name: s.name, price: s.price ?? 0,
    chg24: s.chg24 ?? 0, activity: s.volume ?? s.marketcap ?? 0,
  });
  let subnets = SUBNETS.map(fromSeed);
  let live = false;
  let tab = 'gainers';                    // gainers | losers | active

  /* centralized roster, ranked by valuation */
  const valued = CENTRALIZED_PLAYERS
    .map(p => ({ ...p, _v: parseVal(p.valuation), tk: tickerFor(p) }))
    .sort((a, b) => b._v - a._v);

  mount(root, html`
    <section class="mk">
      <header class="mk-head">
        <a class="sd-back" href="index.html">‹ MAGAZINE</a>
        <div class="mk-head__main">
          <span class="mk-head__kicker">&lt;030&gt;  MARKETS</span>
          <h1 class="mk-head__title">The movers desk.</h1>
          <p class="mk-head__sub">
            What's running and what's bleeding, Bittensor subnets by 24h move and
            activity, and the centralized AI landscape ranked by valuation. The
            markets-terminal read, live.
          </p>
        </div>
        <div class="mk-head__meta">
          <span class="sd-pill" id="mk-src"><span class="live-dot"></span>SEED DATA</span>
        </div>
      </header>

      <div class="mk-grid">
        <!-- ===== TRENDING & MOVERS — collapsible + 150%-upgrade
             v2 2026-05-18: TOP 3 podium hero cards + richer row
             format with rank chip, logo, name, sparkline, 24h%
             with magnitude bar, mcap. Per Rondo "the movers desk
             needs a 150% upgrade with much better infographics."
             ===== -->
        <details class="mk-panel mk-fold mk-movers-panel" open>
          <summary class="mk-fold__summary"><span class="mk-fold__chev">⊕</span> TRENDING &amp; MOVERS</summary>
          <div class="mk-panel__head">
            <h2 class="mk-panel__title">Trending &amp; movers</h2>
            <div class="mk-tabs" role="tablist">
              <button class="mk-tab is-on" data-tab="gainers" role="tab">Gainers</button>
              <button class="mk-tab" data-tab="losers" role="tab">Losers</button>
              <button class="mk-tab" data-tab="active" role="tab">Most active</button>
            </div>
          </div>
          <!-- TOP 3 podium — hero cards for the leaders of the
               active tab. Big sparkline, % magnitude, mcap. -->
          <div class="mk-podium" id="mk-podium"></div>
          <!-- RANK 4-12 — compact rows with rank chip, logo,
               sparkline, magnitude bar. -->
          <ol class="mk-rows mk-rows--ranked" id="mk-movers"></ol>
          <a class="mk-panel__more" href="oracle.html">Open the Subnet Oracle ↗</a>
        </details>

        <!-- ===== HIGHEST VALUATION — collapsible ===== -->
        <details class="mk-panel mk-fold" open>
          <summary class="mk-fold__summary"><span class="mk-fold__chev">⊕</span> HIGHEST VALUATION · CENTRALIZED AI</summary>
          <div class="mk-panel__head">
            <h2 class="mk-panel__title">Highest valuation</h2>
            <span class="mk-panel__tag">Centralized AI</span>
          </div>
          <ul class="mk-rows">
            ${valued.slice(0, 14).map((p, i) => `
              <li class="mk-row mk-row--val">
                <a class="mk-row__link" href="${p.url}" target="_blank" rel="noopener">
                  <span class="mk-row__rank">${String(i + 1).padStart(2, '0')}</span>
                  <span class="mk-row__id">
                    <span class="mk-row__tk ${p.tk.isPrivate ? 'is-pvt' : ''}">${p.tk.symbol}</span>
                    <span class="mk-row__name">${p.name}</span>
                  </span>
                  <span class="mk-row__val">${p.valuation}</span>
                  <span class="mk-row__region mk-row__region--${ASIAN_REGIONS.has(p.region) ? 'asia' : 'west'}">${p.region}</span>
                </a>
              </li>
            `).join('')}
          </ul>
          <a class="mk-panel__more" href="research.html">Magazine coverage ↗</a>
        </details>
      </div>

      <!-- ===== ECOSYSTEM TREEMAP — collapsible ===== -->
      <details class="mk-viz mk-fold" open aria-label="Ecosystem treemap">
        <summary class="mk-fold__summary"><span class="mk-fold__chev">⊕</span> ECOSYSTEM TREEMAP</summary>
        <header class="mk-viz__head">
          <span class="mk-viz__kicker">&lt;040&gt;  ECOSYSTEM SURFACE</span>
          <h2 class="mk-viz__title">Where the cap sits.</h2>
          <p class="mk-viz__sub">
            Every active subnet, sized by alpha-MCAP, ranked by emission share. The
            largest cells are the network's gravity wells, the smaller cells are
            the experiments and the long-tail bets.
          </p>
        </header>
        <div class="mk-viz__canvas-wrap">
          <canvas data-canvas="mk-treemap"></canvas>
        </div>
      </details>

      <!-- ===== 24h HEATMAP — collapsible ===== -->
      <details class="mk-viz mk-fold" open aria-label="24-hour movement heatmap">
        <summary class="mk-fold__summary"><span class="mk-fold__chev">⊕</span> 24H MOVEMENT HEATMAP</summary>
        <header class="mk-viz__head">
          <span class="mk-viz__kicker">&lt;041&gt;  24h MOVEMENT HEATMAP</span>
          <h2 class="mk-viz__title">What moved overnight.</h2>
          <p class="mk-viz__sub">
            Each cell is one subnet. Bright cells are large positive moves, dark
            cells are large negative moves; the cluster gradient is the day's
            risk-on or risk-off read in one glance.
          </p>
        </header>
        <div class="mk-viz__canvas-wrap mk-viz__canvas-wrap--heat">
          <canvas data-canvas="mk-heatmap"></canvas>
        </div>
      </details>
    </section>
  `);

  /* ---------- movers ---------- */
  const moversEl = qs('#mk-movers', root);
  const podiumEl = qs('#mk-podium', root);
  const srcEl    = qs('#mk-src', root);
  let sparks = [];

  function renderMovers(){
    if (!moversEl) return;
    sparks.splice(0).forEach(sp => { try { sp.destroy(); } catch (_) {} });
    let rows = subnets.slice();
    if (tab === 'gainers')      rows.sort((a, b) => b.chg24 - a.chg24);
    else if (tab === 'losers')  rows.sort((a, b) => a.chg24 - b.chg24);
    else                        rows.sort((a, b) => b.activity - a.activity);
    rows = rows.slice(0, 12);

    /* Magnitude reference — the biggest |%| in the visible
       window scales the magnitude bars on the compact rows so
       a 5% mover doesn't get the same bar as the top 25%
       mover. Activity tab scales against the top activity
       value instead. */
    const maxMag = tab === 'active'
      ? Math.max(...rows.map(s => s.activity || 0), 1)
      : Math.max(...rows.map(s => Math.abs(s.chg24 || 0)), 0.0001);

    /* --- TOP 3 PODIUM hero cards --- */
    if (podiumEl){
      const podium = rows.slice(0, 3);
      podiumEl.innerHTML = podium.map((s, i) => {
        const up = s.chg24 >= 0;
        const logo = SUBNET_LOGOS[(s.name || '').toLowerCase()] || FALLBACK_LOGO;
        const metric = tab === 'active'
          ? `${(s.activity || 0).toFixed(2)} actv`
          : `${up ? '▲' : '▼'} ${fmtPct(s.chg24)}`;
        return `
          <a class="mk-podium__card mk-podium__card--${i === 0 ? 'gold' : i === 1 ? 'silver' : 'bronze'} ${up ? 'is-up' : 'is-down'}"
             href="markets.html#sn${s.netuid}">
            <span class="mk-podium__rank">#${i + 1}</span>
            <span class="mk-podium__logo"><img src="${logo}" alt="" loading="lazy" onerror="this.src='${FALLBACK_LOGO}'"></span>
            <span class="mk-podium__id">
              <span class="mk-podium__sn">SN${s.netuid}</span>
              <span class="mk-podium__name">${s.name}</span>
            </span>
            <span class="mk-podium__spark"><canvas data-podium-spark></canvas></span>
            <span class="mk-podium__metric">${metric}</span>
            <span class="mk-podium__price">${fmtPrice(s.price)} · mcap ${fmtMcapShort(s.mcap)}</span>
          </a>
        `;
      }).join('');
      qsa('[data-podium-spark]', podiumEl).forEach((cv, i) => {
        const s = podium[i];
        sparks.push(new Sparkline(cv, { series: seedSeries(s.name + ':podium', s.chg24, 48), strokeWidth: 1.5 }));
      });
    }

    /* --- RANK 4-12 COMPACT ROWS --- */
    const compact = rows.slice(3);
    moversEl.innerHTML = compact.map((s, i) => {
      const rank = i + 4;
      const up = s.chg24 >= 0;
      const logo = SUBNET_LOGOS[(s.name || '').toLowerCase()] || FALLBACK_LOGO;
      const magnitude = tab === 'active'
        ? (s.activity || 0)
        : Math.abs(s.chg24 || 0);
      const magPct = Math.min(100, (magnitude / maxMag) * 100);
      const metric = tab === 'active'
        ? `${(s.activity || 0).toFixed(2)}`
        : fmtPct(s.chg24);
      return `
        <li class="mk-row mk-row--enhanced ${up ? 'is-up' : 'is-down'}">
          <a class="mk-row__link" href="markets.html#sn${s.netuid}" id="sn${s.netuid}">
            <span class="mk-row__rank">${String(rank).padStart(2, '0')}</span>
            <span class="mk-row__logo"><img src="${logo}" alt="" loading="lazy" onerror="this.src='${FALLBACK_LOGO}'"></span>
            <span class="mk-row__id">
              <span class="mk-row__tk">SN${s.netuid}</span>
              <span class="mk-row__name">${s.name}</span>
            </span>
            <span class="mk-row__spark"><canvas></canvas></span>
            <span class="mk-row__magbar" aria-label="Move magnitude ${magPct.toFixed(0)}% of top">
              <span class="mk-row__magfill" style="width:${magPct.toFixed(1)}%"></span>
            </span>
            <span class="mk-row__price">${fmtPrice(s.price)}</span>
            <span class="mk-row__chg ${up ? 'up' : 'down'}">${metric}</span>
          </a>
        </li>`;
    }).join('');

    qsa('.mk-row__spark canvas', moversEl).forEach((cv, i) => {
      const s = compact[i];
      sparks.push(new Sparkline(cv, { series: seedSeries(s.name, s.chg24, 26) }));
    });
  }
  /* Short mcap formatter — $1.2B / $124M / $5.4K. Falls back to
     the standard money() for missing/zero values. */
  function fmtMcapShort(m){
    if (!Number.isFinite(m) || m <= 0) return '—';
    if (m >= 1e9)  return '$' + (m / 1e9).toFixed(2) + 'B';
    if (m >= 1e6)  return '$' + (m / 1e6).toFixed(1) + 'M';
    if (m >= 1e3)  return '$' + (m / 1e3).toFixed(1) + 'K';
    return '$' + m.toFixed(0);
  }
  renderMovers();

  qsa('.mk-tab', root).forEach(btn => on(btn, 'click', () => {
    qsa('.mk-tab', root).forEach(b => b.classList.remove('is-on'));
    btn.classList.add('is-on');
    tab = btn.dataset.tab;
    renderMovers();
  }));

  /* ---------- ecosystem treemap + 24h heatmap ----------
     Both render off the current subnets array; we destroy and rebuild
     the treemap on live data (it has no incremental updater), and
     push fresh cells into the heatmap. */
  const treemapCv = qs('[data-canvas="mk-treemap"]', root);
  const heatmapCv = qs('[data-canvas="mk-heatmap"]', root);
  let treemap = null;
  let heatmap = heatmapCv ? new Heatmap(heatmapCv, { cells: [] }) : null;

  function buildTreemap(){
    if (!treemapCv) return;
    if (treemap) { try { treemap.destroy(); } catch (_) {} }
    const items = subnets
      .filter(s => s.activity > 0)
      .sort((a, b) => b.activity - a.activity)
      .slice(0, 28)
      .map(s => ({
        label: `SN${s.netuid} · ${s.name}`,
        sub:   `${fmtPct(s.chg24)} · ${fmtPrice(s.price)}`,
        value: s.activity,
      }));
    treemap = new Treemap(treemapCv, { items });
  }
  function buildHeatmap(){
    if (!heatmap) return;
    const cells = subnets
      .slice()
      .sort((a, b) => b.activity - a.activity)
      .slice(0, 64)
      .map(s => ({ netuid: s.netuid, name: s.name, value: s.chg24 }));
    heatmap.setData(cells);
  }
  buildTreemap();
  buildHeatmap();

  /* ---------- go live ---------- */
  let unsub = null;
  if (dataLayer){
    const onLive = listRaw => {
      if (!Array.isArray(listRaw) || !listRaw.length) return;
      subnets = listRaw.map(fromLive);
      live = true;
      if (srcEl) srcEl.innerHTML = '<span class="live-dot"></span>LIVE · TAO MARKET CAP';
      renderMovers();
      buildTreemap();
      buildHeatmap();
    };
    unsub = dataLayer.subscribe('tao:subnets', onLive);
    onLive(dataLayer.get('tao:subnets'));
  }

  return {
    destroy(){
      sparks.splice(0).forEach(sp => { try { sp.destroy(); } catch (_) {} });
      try { treemap?.destroy(); } catch (_) {}
      try { heatmap?.destroy(); } catch (_) {}
      if (unsub) unsub();
    },
  };
}
