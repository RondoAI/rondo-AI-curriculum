/* =================================================================
   TAO TERMINAL — page view
   -----------------------------------------------------------------
   Standalone trader-grade page (mounted at terminal.html). Layout:

     ┌────────────────────────────────────────────────┐
     │           τ/USD · 1H CANDLES   <020>           │
     ├──────────────────────┬─────────────────────────┤
     │  SUBNET HEAT · 24h   │  TOP MOVERS · 24h       │
     │      <021>           │      <022>              │
     ├──────────────────────┼─────────────────────────┤
     │  EMISSIONS · CATEGORY│  Plain HTML extras       │
     │      <023>           │                          │
     └──────────────────────┴─────────────────────────┘

   Each panel uses the shared Panel chrome (corner brackets +
   function-code title). Charts subscribe to the DataLayer where
   live data exists; everything else uses the simulated subnets
   dataset.
   ================================================================= */

import { html, mount, qs, raw } from '../lib/dom.js';
import { CandleChart } from '../charts/CandleChart.js';
import { Heatmap } from '../charts/Heatmap.js';
import { Treemap } from '../charts/Treemap.js';
import { SUBNETS } from '../data/subnets.js';
import { catColor, catLabel } from '../data/categories.js';

/**
 * @param {HTMLElement} root
 * @param {{subscribe: (channel: string, fn: Function) => Function, get?: Function} | null} [dataLayer]
 */
export function mountTerminal(root, dataLayer = null){
  mount(root, html`
    <section class="terminal-page" id="terminal">
      <header class="term-head">
        <div class="term-head__left">
          <span class="term-head__kicker">020&gt;  TAO TERMINAL</span>
          <h1 class="term-head__title">The desk view. <em>Always on.</em></h1>
          <p class="term-head__sub">Live τ/USD candles, subnet heat, top movers, and emissions allocation. Everything a TAO desk needs in one frame.</p>
        </div>
        <div class="term-head__right">
          <a class="term-head__back" href="index.html">‹ MAGAZINE</a>
          <span class="term-head__pills">
            <span class="pill"><span class="live-dot"></span>STREAMING</span>
            <span class="pill">v0.20</span>
          </span>
        </div>
      </header>

      <div class="term-grid">
        <!-- ===== Candles (hero, full width) ===== -->
        <article class="panel is-bracketed term-cell--candles">
          <div class="panel__head">
            <span class="panel__title">
              <span class="panel__fcode">&lt;020&gt;</span>
              τ/USD · 1H CANDLES
              <span class="panel__go">&lt;GO&gt;</span>
            </span>
            <span class="panel__meta">
              <span class="panel__pill panel__pill--live"><span class="live-dot"></span>LIVE · CoinGecko</span>
            </span>
          </div>
          <div class="panel__body panel__body--pad-0">
            <canvas data-canvas="candles" aria-label="TAO/USD candlestick chart"></canvas>
          </div>
          <div class="panel__foot">
            <span>60 BARS · 1H EACH · OHLC + VOLUME</span>
            <span id="term-price-tag">—</span>
          </div>
        </article>

        <!-- ===== Subnet heatmap ===== -->
        <article class="panel is-bracketed term-cell--heatmap">
          <div class="panel__head">
            <span class="panel__title">
              <span class="panel__fcode">&lt;021&gt;</span>
              SUBNET HEAT · 24h
              <span class="panel__go">&lt;GO&gt;</span>
            </span>
            <span class="panel__meta">
              <span class="panel__pill panel__pill--sim">SIM</span>
            </span>
          </div>
          <div class="panel__body panel__body--pad-0">
            <canvas data-canvas="heatmap" aria-label="Subnet 24-hour change heatmap"></canvas>
          </div>
          <div class="panel__foot">
            <span>${SUBNETS.length} SUBNETS · GREEN = GAIN · RED = LOSS</span>
            <span>HOVER FOR DETAIL</span>
          </div>
        </article>

        <!-- ===== Top movers ===== -->
        <article class="panel is-bracketed term-cell--movers">
          <div class="panel__head">
            <span class="panel__title">
              <span class="panel__fcode">&lt;022&gt;</span>
              TOP MOVERS · 24h
              <span class="panel__go">&lt;GO&gt;</span>
            </span>
            <span class="panel__meta">
              <span class="panel__pill panel__pill--sim">SIM</span>
            </span>
          </div>
          <div class="panel__body panel__body--pad-0">
            <div class="movers">
              <div class="movers__col">
                <h4>GAINERS · 24h</h4>
                <ol class="movers__list" id="movers-up"></ol>
              </div>
              <div class="movers__col">
                <h4 class="is-down">LOSERS · 24h</h4>
                <ol class="movers__list" id="movers-down"></ol>
              </div>
            </div>
          </div>
          <div class="panel__foot">
            <span>RANKED BY 24H Δ</span>
            <span>τ DENOMINATED</span>
          </div>
        </article>

        <!-- ===== Emissions treemap ===== -->
        <article class="panel is-bracketed term-cell--treemap term-cell--full">
          <div class="panel__head">
            <span class="panel__title">
              <span class="panel__fcode">&lt;023&gt;</span>
              EMISSIONS · BY CATEGORY
              <span class="panel__go">&lt;GO&gt;</span>
            </span>
            <span class="panel__meta">
              <span class="panel__pill panel__pill--sim">SIM</span>
            </span>
          </div>
          <div class="panel__body panel__body--pad-0">
            <canvas data-canvas="treemap" aria-label="Subnet emissions treemap"></canvas>
          </div>
          <div class="panel__foot">
            <span>SQUARIFIED · COLORED BY CATEGORY</span>
            <span>Σ τ ${SUBNETS.reduce((a, s) => a + s.emission, 0).toLocaleString('en-US')} / 24h</span>
          </div>
        </article>
      </div>
    </section>
  `);

  /* ---------- Candles ---------- */
  const cCanvas  = qs('[data-canvas="candles"]', root);
  const priceTag = qs('#term-price-tag', root);
  const candles  = cCanvas ? new CandleChart(cCanvas, {
    bars:     60,
    baseline: dataLayer?.get?.('tao:price')?.price ?? 487,
    barMs:    60 * 60 * 1000,
  }) : null;

  let priceUnsub = () => {};
  if (dataLayer && candles){
    priceUnsub = dataLayer.subscribe('tao:price', d => {
      if (!d || typeof d.price !== 'number') return;
      candles.appendTick(d.price);
      if (priceTag){
        const sign = (d.change24 ?? 0) >= 0 ? '+' : '';
        priceTag.textContent = `$${d.price.toFixed(2)}   ${sign}${(d.change24 ?? 0).toFixed(2)}%`;
      }
    });
  }

  /* Even without live data, gently tick the candles so the chart
     reads as live during prototype viewing. */
  const tickTimer = setInterval(() => {
    if (!candles) return;
    const last = dataLayer?.get?.('tao:price')?.price;
    if (typeof last === 'number'){
      const wob = last + (Math.random() - .5) * last * 0.005;
      candles.appendTick(wob);
    }
  }, 4_000);

  /* ---------- Heatmap ---------- */
  const hCanvas = qs('[data-canvas="heatmap"]', root);
  const heatmap = hCanvas ? new Heatmap(hCanvas, {
    cells: SUBNETS.map(s => ({
      netuid: s.netuid,
      name: s.name,
      value: s.chg24,
      cat: s.cat,
    })),
  }) : null;
  /* gentle wobble */
  const heatTimer = setInterval(() => {
    if (!heatmap) return;
    const next = SUBNETS.map(s => ({
      netuid: s.netuid,
      name: s.name,
      value: s.chg24 + (Math.random() - .5) * 0.8,
      cat: s.cat,
    }));
    heatmap.setData(next);
  }, 5_000);

  /* ---------- Top movers ---------- */
  const upList = qs('#movers-up', root);
  const dnList = qs('#movers-down', root);
  function renderMovers(){
    const sorted = [...SUBNETS].sort((a, b) => b.chg24 - a.chg24);
    const top = sorted.slice(0, 8);
    const bot = sorted.slice(-8).reverse();
    const li = (s, i, dir) => html`
      <li class="mover">
        <span class="mover__rank">${String(i + 1).padStart(2, '0')}</span>
        <span class="mover__net">SN${s.netuid}</span>
        <span class="mover__name">${s.name}</span>
        <span class="mover__chg ${dir}">${dir === 'up' ? '+' : ''}${s.chg24.toFixed(2)}%</span>
      </li>
    `;
    if (upList) upList.innerHTML = top.map((s, i) => li(s, i, 'up')).join('');
    if (dnList) dnList.innerHTML = bot.map((s, i) => li(s, i, 'down')).join('');
  }
  renderMovers();

  /* ---------- Treemap ---------- */
  const tCanvas = qs('[data-canvas="treemap"]', root);
  const treemap = tCanvas ? new Treemap(tCanvas, {
    items: SUBNETS.map(s => ({
      key: s.netuid,
      label: `SN${s.netuid} · ${s.name}`,
      value: s.emission,
      color: catColor(s.cat),
      sub: `${catLabel(s.cat)}  τ ${s.emission}`,
    })),
  }) : null;

  return {
    destroy(){
      candles?.destroy();
      heatmap?.destroy();
      treemap?.destroy();
      clearInterval(tickTimer);
      clearInterval(heatTimer);
      priceUnsub();
    },
  };
}

/* keep `raw` import used (template tag) */
void raw;
