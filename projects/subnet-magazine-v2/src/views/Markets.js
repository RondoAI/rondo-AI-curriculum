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
import { SUBNETS } from '../data/subnets.js';
import { CENTRALIZED_PLAYERS, ASIAN_REGIONS, tickerFor } from '../data/centralized.js';

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
        <!-- ===== TRENDING & MOVERS ===== -->
        <section class="mk-panel" aria-label="Trending and movers">
          <div class="mk-panel__head">
            <h2 class="mk-panel__title">Trending &amp; movers</h2>
            <div class="mk-tabs" role="tablist">
              <button class="mk-tab is-on" data-tab="gainers" role="tab">Gainers</button>
              <button class="mk-tab" data-tab="losers" role="tab">Losers</button>
              <button class="mk-tab" data-tab="active" role="tab">Most active</button>
            </div>
          </div>
          <ul class="mk-rows" id="mk-movers"></ul>
          <a class="mk-panel__more" href="oracle.html">Open the Oracle ↗</a>
        </section>

        <!-- ===== HIGHEST VALUATION ===== -->
        <section class="mk-panel" aria-label="Highest valuation">
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
          <a class="mk-panel__more" href="read.html">Magazine coverage ↗</a>
        </section>
      </div>
    </section>
  `);

  /* ---------- movers ---------- */
  const moversEl = qs('#mk-movers', root);
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

    moversEl.innerHTML = rows.map(s => {
      const up = s.chg24 >= 0;
      return `
        <li class="mk-row">
          <a class="mk-row__link" href="markets.html#sn${s.netuid}" id="sn${s.netuid}">
            <span class="mk-row__id">
              <span class="mk-row__tk">SN${s.netuid}</span>
              <span class="mk-row__name">${s.name}</span>
            </span>
            <span class="mk-row__spark"><canvas></canvas></span>
            <span class="mk-row__price">${fmtPrice(s.price)}</span>
            <span class="mk-row__chg ${up ? 'up' : 'down'}">${fmtPct(s.chg24)}</span>
          </a>
        </li>`;
    }).join('');

    qsa('.mk-row__spark canvas', moversEl).forEach((cv, i) => {
      const s = rows[i];
      sparks.push(new Sparkline(cv, { series: seedSeries(s.name, s.chg24, 26) }));
    });
  }
  renderMovers();

  qsa('.mk-tab', root).forEach(btn => on(btn, 'click', () => {
    qsa('.mk-tab', root).forEach(b => b.classList.remove('is-on'));
    btn.classList.add('is-on');
    tab = btn.dataset.tab;
    renderMovers();
  }));

  /* ---------- go live ---------- */
  let unsub = null;
  if (dataLayer){
    const onLive = listRaw => {
      if (!Array.isArray(listRaw) || !listRaw.length) return;
      subnets = listRaw.map(fromLive);
      live = true;
      if (srcEl) srcEl.innerHTML = '<span class="live-dot"></span>LIVE · TAO MARKET CAP';
      renderMovers();
    };
    unsub = dataLayer.subscribe('tao:subnets', onLive);
    onLive(dataLayer.get('tao:subnets'));
  }

  return {
    destroy(){
      sparks.splice(0).forEach(sp => { try { sp.destroy(); } catch (_) {} });
      if (unsub) unsub();
    },
  };
}
