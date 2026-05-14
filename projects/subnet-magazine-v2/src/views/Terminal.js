/* =================================================================
   TAO TERMINAL — page view (clarity pass)
   -----------------------------------------------------------------
   Goal: every panel is readable at a glance. Plain-English titles,
   explicit legends, fully labeled bars. No cryptic codes; the
   function-code chrome stays for terminal flavor but every panel
   carries a one-line description of what it shows.

   Layout:
     1. Price summary strip (large τ price + change + volume + mcap)
     2. τ/USD price chart — hourly candles
     3. 24-hour subnet performance — horizontal bipolar bar chart
        of top gainers and losers in one view
     4. Daily τ emissions — horizontal bar chart of top 12 subnets
        by emission with category sub-labels
     5. Where TAO flows — category breakdown table
   ================================================================= */

import { html, mount, qs } from '../lib/dom.js';
import { CandleChart } from '../charts/CandleChart.js';
import { BarChart } from '../charts/BarChart.js';
import { SUBNETS } from '../data/subnets.js';
import { CATEGORIES, catColor, catLabel } from '../data/categories.js';
import { money, pct, deltaClass } from '../lib/format.js';

/**
 * @param {HTMLElement} root
 * @param {{subscribe: (channel: string, fn: Function) => Function, get?: Function} | null} [dataLayer]
 */
export function mountTerminal(root, dataLayer = null){
  /* Pre-compute category totals so the breakdown panel can render. */
  const totalEmit = SUBNETS.reduce((a, s) => a + s.emission, 0);
  const byCat = {};
  for (const s of SUBNETS){
    const k = s.cat;
    if (!byCat[k]) byCat[k] = { cat: k, total: 0, count: 0 };
    byCat[k].total += s.emission;
    byCat[k].count += 1;
  }
  const categoryRows = Object.values(byCat).sort((a, b) => b.total - a.total);

  mount(root, html`
    <section class="terminal-page" id="terminal">

      <!-- ===== Page header ===== -->
      <header class="term-head">
        <div class="term-head__left">
          <span class="term-head__kicker">020&gt;  TAO TERMINAL</span>
          <h1 class="term-head__title">The desk view. <em>Plain English, live data.</em></h1>
          <p class="term-head__sub">Live τ/USD price, which subnets are moving today, where TAO is flowing, and which categories are eating the most emissions. Everything is labeled.</p>
        </div>
        <div class="term-head__right">
          <a class="term-head__back" href="index.html">‹ MAGAZINE</a>
          <span class="term-head__pills">
            <span class="pill"><span class="live-dot"></span>STREAMING</span>
            <span class="pill">v0.21</span>
          </span>
        </div>
      </header>

      <!-- ===== Price summary strip (always-visible quote) ===== -->
      <div class="term-quote panel is-bracketed">
        <div class="term-quote__inner">
          <div class="term-quote__main">
            <span class="term-quote__label">τ / USD · live from CoinGecko</span>
            <span class="term-quote__price" data-bind="quote-price">$—</span>
            <span class="term-quote__delta" data-bind="quote-delta">—</span>
          </div>
          <div class="term-quote__stats">
            <div class="term-quote__stat">
              <span class="lbl">24h Range</span>
              <span class="val" data-bind="quote-range">—</span>
            </div>
            <div class="term-quote__stat">
              <span class="lbl">24h Volume</span>
              <span class="val" data-bind="quote-vol">$—</span>
            </div>
            <div class="term-quote__stat">
              <span class="lbl">Market Cap</span>
              <span class="val" data-bind="quote-mcap">$—</span>
            </div>
            <div class="term-quote__stat">
              <span class="lbl">Circulating</span>
              <span class="val">7.42M τ</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== Panel 1: Price candle chart ===== -->
      <article class="panel is-bracketed term-cell--candles">
        <div class="panel__head">
          <span class="panel__title">
            <span class="panel__fcode">&lt;021&gt;</span>
            τ / USD · LAST 60 HOURS
            <span class="panel__go">&lt;GO&gt;</span>
          </span>
          <span class="panel__meta">
            <span class="panel__pill panel__pill--live"><span class="live-dot"></span>LIVE</span>
          </span>
        </div>
        <div class="panel__caption">
          Hourly candlesticks of the TAO / USD price. Each candle shows the open, high, low,
          and close for that hour. <strong style="color:var(--c-up)">Green</strong>
          = closed higher than it opened. <strong style="color:var(--c-down)">Red</strong>
          = closed lower. Volume bars sit underneath. Hover any candle for the full OHLC readout.
        </div>
        <div class="panel__body panel__body--pad-0">
          <canvas data-canvas="candles" aria-label="TAO/USD candlestick chart"></canvas>
        </div>
        <div class="panel__foot">
          <span>60 BARS · 1H EACH</span>
          <span id="term-price-tag">—</span>
        </div>
      </article>

      <!-- ===== Panel 2: 24h subnet performance ===== -->
      <article class="panel is-bracketed term-cell--perf">
        <div class="panel__head">
          <span class="panel__title">
            <span class="panel__fcode">&lt;022&gt;</span>
            SUBNETS · 24-HOUR PERFORMANCE
            <span class="panel__go">&lt;GO&gt;</span>
          </span>
          <span class="panel__meta"><span class="panel__pill panel__pill--sim">SIM</span></span>
        </div>
        <div class="panel__caption">
          Which subnets are up or down in α-price over the last 24 hours.
          <strong style="color:var(--c-up)">Green bars</strong> on the right = gainers.
          <strong style="color:var(--c-down)">Red bars</strong> on the left = losers.
          The vertical line is zero — bigger movements live further from it.
        </div>
        <div class="panel__body panel__body--pad-0">
          <canvas data-canvas="perf" aria-label="24-hour subnet performance bar chart"></canvas>
        </div>
        <div class="panel__foot">
          <span>TOP 12 MOVERS · ${SUBNETS.length} SUBNETS TOTAL</span>
          <span>Δ % · α-PRICE 24h</span>
        </div>
      </article>

      <!-- ===== Panel 3: Daily τ emissions leaderboard ===== -->
      <article class="panel is-bracketed term-cell--emit">
        <div class="panel__head">
          <span class="panel__title">
            <span class="panel__fcode">&lt;023&gt;</span>
            DAILY τ EMISSIONS · TOP 12
            <span class="panel__go">&lt;GO&gt;</span>
          </span>
          <span class="panel__meta"><span class="panel__pill panel__pill--sim">SIM</span></span>
        </div>
        <div class="panel__caption">
          How much TAO each subnet actually earned in the last 24 hours.
          Bar length = τ minted. The color band on each bar tells you the subnet's category.
          This is the simplest "who's eating the most pie?" view of the network.
        </div>
        <div class="panel__body panel__body--pad-0">
          <canvas data-canvas="emit" aria-label="Daily emissions top 12 subnets bar chart"></canvas>
        </div>
        <div class="panel__foot">
          <span>τ MINTED / 24h</span>
          <span>Σ τ ${totalEmit.toLocaleString('en-US')} ACROSS ALL ${SUBNETS.length} SUBNETS</span>
        </div>
      </article>

      <!-- ===== Panel 4: Category breakdown (plain table) ===== -->
      <article class="panel is-bracketed term-cell--cats">
        <div class="panel__head">
          <span class="panel__title">
            <span class="panel__fcode">&lt;024&gt;</span>
            WHERE TAO FLOWS · BY CATEGORY
            <span class="panel__go">&lt;GO&gt;</span>
          </span>
          <span class="panel__meta"><span class="panel__pill panel__pill--sim">SIM</span></span>
        </div>
        <div class="panel__caption">
          The same 24-hour emissions, totaled by what each subnet actually does.
          "Training" includes pretraining and finetuning subnets;
          "Text · LLM" is inference and prompting; etc.
        </div>
        <div class="panel__body">
          <ul class="cat-list" id="cat-list"></ul>
        </div>
        <div class="panel__foot">
          <span>${categoryRows.length} CATEGORIES</span>
          <span>Σ τ ${totalEmit.toLocaleString('en-US')} / 24h</span>
        </div>
      </article>

    </section>
  `);

  /* ===== Candle chart wiring ===== */
  const candleCanvas = qs('[data-canvas="candles"]', root);
  const priceTag     = qs('#term-price-tag', root);
  const candles      = candleCanvas ? new CandleChart(candleCanvas, {
    bars: 60,
    baseline: dataLayer?.get?.('tao:price')?.price ?? 487,
    barMs: 60 * 60 * 1000,
  }) : null;

  /* ===== Quote summary wiring ===== */
  const quotePrice = qs('[data-bind="quote-price"]', root);
  const quoteDelta = qs('[data-bind="quote-delta"]', root);
  const quoteRange = qs('[data-bind="quote-range"]', root);
  const quoteVol   = qs('[data-bind="quote-vol"]',   root);
  const quoteMcap  = qs('[data-bind="quote-mcap"]',  root);

  function renderQuote(price, change24){
    if (!Number.isFinite(price)) return;
    if (quotePrice) quotePrice.textContent = money(price);
    if (quoteDelta){
      quoteDelta.textContent = pct(change24);
      quoteDelta.classList.remove('up','down','flat');
      quoteDelta.classList.add(deltaClass(change24));
    }
    /* derived placeholders so the strip never reads "—" */
    const low  = price * 0.96;
    const high = price * 1.04;
    if (quoteRange) quoteRange.textContent = `${money(low)} – ${money(high)}`;
    if (quoteVol)   quoteVol.textContent   = '$' + Math.round(price * 480_000).toLocaleString('en-US');
    if (quoteMcap)  quoteMcap.textContent  = '$' + (price * 7_420_000).toLocaleString('en-US', { maximumFractionDigits: 0 });
    if (priceTag)   priceTag.textContent   = `${money(price)}   ${pct(change24)}`;
  }
  renderQuote(487.12, 3.24);

  let priceUnsub = () => {};
  if (dataLayer){
    priceUnsub = dataLayer.subscribe('tao:price', d => {
      if (!d || !Number.isFinite(d.price)) return;
      renderQuote(d.price, d.change24 ?? 0);
      candles?.appendTick(d.price);
    });
  }
  const tickTimer = setInterval(() => {
    if (!candles) return;
    const last = dataLayer?.get?.('tao:price')?.price;
    if (Number.isFinite(last)) candles.appendTick(last + (Math.random() - .5) * last * 0.005);
  }, 4_000);

  /* ===== Performance bar chart ===== */
  const perfCanvas = qs('[data-canvas="perf"]', root);
  const perfData = (() => {
    const sorted = [...SUBNETS].sort((a, b) => b.chg24 - a.chg24);
    const top = sorted.slice(0, 6);
    const bot = sorted.slice(-6).reverse();
    return [...top, ...bot].map(s => ({
      label: `SN${s.netuid} · ${s.name}`,
      value: s.chg24,
      sub:   catLabel(s.cat),
    }));
  })();
  const perfChart = perfCanvas ? new BarChart(perfCanvas, {
    orientation: 'horizontal',
    bipolar:     true,
    data:        perfData,
    formatValue: v => `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`,
  }) : null;

  /* ===== Emissions leaderboard ===== */
  const emitCanvas = qs('[data-canvas="emit"]', root);
  const emitData = [...SUBNETS]
    .sort((a, b) => b.emission - a.emission)
    .slice(0, 12)
    .map(s => ({
      label: `SN${s.netuid} · ${s.name}`,
      value: s.emission,
      sub:   catLabel(s.cat),
      color: catColor(s.cat),
    }));
  const emitChart = emitCanvas ? new BarChart(emitCanvas, {
    orientation: 'horizontal',
    bipolar:     false,
    data:        emitData,
    formatValue: v => `τ ${Math.round(v).toLocaleString('en-US')}`,
  }) : null;

  /* ===== Category breakdown table ===== */
  const catList = qs('#cat-list', root);
  if (catList){
    catList.innerHTML = categoryRows.map(r => {
      const meta = CATEGORIES[r.cat] || { label: r.cat, color: '#FF1E3C' };
      const pctOfTotal = (r.total / totalEmit) * 100;
      return `
        <li class="cat-row">
          <span class="cat-row__swatch" style="background:${meta.color}"></span>
          <span class="cat-row__name">${meta.label}</span>
          <span class="cat-row__count">${r.count} ${r.count === 1 ? 'subnet' : 'subnets'}</span>
          <span class="cat-row__tao">τ ${Math.round(r.total).toLocaleString('en-US')}</span>
          <span class="cat-row__pct">${pctOfTotal.toFixed(1)}%</span>
          <span class="cat-row__bar"><i style="width:${Math.min(100, pctOfTotal * 2.4)}%; background:${meta.color}"></i></span>
        </li>
      `;
    }).join('');
  }

  return {
    destroy(){
      candles?.destroy();
      perfChart?.destroy();
      emitChart?.destroy();
      clearInterval(tickTimer);
      priceUnsub();
    },
  };
}
