/* =================================================================
   TAO TERMINAL — page view (clarity pass)
   -----------------------------------------------------------------
   Goal: every panel is readable at a glance. Plain-English titles,
   explicit legends, fully labeled bars. No cryptic codes; the
   function-code chrome stays for terminal flavor but every panel
   carries a one-line description of what it shows.

   Layout:
     1. Price summary strip (large τ price + change + volume + mcap)
     2. τ/USD price + ecosystem-events timeline (32-month view)
     3. 24-hour subnet performance — horizontal bipolar bar chart
        of top gainers and losers in one view
     4. Daily τ emissions — horizontal bar chart of top 12 subnets
        by emission with category sub-labels
     5. Where TAO flows — category breakdown table
   ================================================================= */

import { html, mount, qs } from '../lib/dom.js';
import { Timeline } from '../charts/Timeline.js';
import { PriceChart } from '../charts/PriceChart.js';
import { BarChart } from '../charts/BarChart.js';
import { SUBNETS } from '../data/subnets.js';
import { CATEGORIES, catColor, catLabel } from '../data/categories.js';
import { BENCHMARKS } from '../data/benchmarks.js';
import { CENTRALIZED_PLAYERS, ASIAN_REGIONS, REGIONS } from '../data/centralized.js';
import { EVENTS, EVENT_COLORS, EVENT_LABELS } from '../data/events.js';
import { openChartModal } from '../lib/chart-modal.js';
import { money, pct, deltaClass, compact } from '../lib/format.js';

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
          <a class="term-head__back" href="subnets.html">SUBNETS ↗</a>
          <a class="term-head__back" href="validators.html">VALIDATORS ↗</a>
          <a class="term-head__back" href="compare.html">COMPARE ↗</a>
          <a class="term-head__back" href="articles.html">RESEARCH ↗</a>
          <span class="term-head__pills">
            <span class="pill"><span class="live-dot"></span>STREAMING</span>
            <span class="pill">v0.21</span>
          </span>
        </div>
      </header>

      <!-- ===== Launchpad command bar (Bloomberg-style) ===== -->
      <div class="launchpad" role="search">
        <span class="launchpad__prompt">SBNT &gt;</span>
        <input class="launchpad__input" id="launchpad-input"
               type="text" autocomplete="off" spellcheck="false"
               placeholder="type a function code · TAO · BENCH · ASIA · MODELS · EMIT · MOVE · CAT  ↵">
        <span class="launchpad__hint">↵ GO</span>
        <div class="launchpad__chips">
          <button class="lp-chip" data-lp="timeline">τ /USD</button>
          <button class="lp-chip" data-lp="bench">BENCH</button>
          <button class="lp-chip" data-lp="asia">ASIA</button>
          <button class="lp-chip" data-lp="models">MODELS</button>
          <button class="lp-chip" data-lp="emit">EMIT</button>
          <button class="lp-chip" data-lp="move">MOVE</button>
          <button class="lp-chip" data-lp="cat">CAT</button>
        </div>
      </div>

      <!-- ===== Network Pulse — cockpit multi-stat strip ===== -->
      <div class="netpulse">
        <div class="netpulse__cell"><span class="netpulse__lbl">BLOCK</span><span class="netpulse__val" data-bind="np-block">4,812,047</span><span class="netpulse__sub">↑ ~12s</span></div>
        <div class="netpulse__cell"><span class="netpulse__lbl">EPOCH</span><span class="netpulse__val">14,302</span><span class="netpulse__sub" data-bind="np-epoch-prog">74% · 18:24</span></div>
        <div class="netpulse__cell"><span class="netpulse__lbl">TPS</span><span class="netpulse__val" data-bind="np-tps">2,147</span><span class="netpulse__sub">tx / s</span></div>
        <div class="netpulse__cell"><span class="netpulse__lbl">VAL · PARTIC.</span><span class="netpulse__val" data-bind="np-vp">96.4%</span><span class="netpulse__sub">trailing 24h</span></div>
        <div class="netpulse__cell"><span class="netpulse__lbl">MEMPOOL</span><span class="netpulse__val" data-bind="np-mem">412</span><span class="netpulse__sub">pending tx</span></div>
        <div class="netpulse__cell"><span class="netpulse__lbl">SUBNETS</span><span class="netpulse__val">${SUBNETS.length}</span><span class="netpulse__sub">active</span></div>
        <div class="netpulse__cell"><span class="netpulse__lbl">τ STAKED</span><span class="netpulse__val">τ 6.24M</span><span class="netpulse__sub">63% supply</span></div>
        <div class="netpulse__cell"><span class="netpulse__lbl">EMISSION</span><span class="netpulse__val">τ 7,200</span><span class="netpulse__sub">/ 24h</span></div>
        <div class="netpulse__cell"><span class="netpulse__lbl">UPTIME</span><span class="netpulse__val">99.94%</span><span class="netpulse__sub">90d</span></div>
        <div class="netpulse__cell"><span class="netpulse__lbl">PROP · LATENCY</span><span class="netpulse__val">186 ms</span><span class="netpulse__sub">P50 global</span></div>
      </div>

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

      <!-- ===== Market Overview — CMC-style dashboard ===== -->
      <section class="term-overview" id="market">
        <div class="term-overview__head">
          <span class="term-head__kicker">030&gt;  MARKET OVERVIEW</span>
          <h2 class="term-overview__title">Bittensor, <em>by the numbers.</em></h2>
        </div>
        <div class="ov-grid">
          <div class="ov-card ov-card--lead">
            <span class="ov-card__lbl">τ / USD</span>
            <span class="ov-card__val" data-bind="ov-price">$—</span>
            <span class="ov-card__sub" data-bind="ov-price-d">—</span>
          </div>
          <div class="ov-card">
            <span class="ov-card__lbl">Market Cap</span>
            <span class="ov-card__val" data-bind="ov-mcap">$—</span>
            <span class="ov-card__sub" data-bind="ov-mcap-d">7d —</span>
          </div>
          <div class="ov-card">
            <span class="ov-card__lbl">24h Volume</span>
            <span class="ov-card__val" data-bind="ov-vol">$—</span>
            <span class="ov-card__sub">spot</span>
          </div>
          <div class="ov-card">
            <span class="ov-card__lbl">Fully Diluted</span>
            <span class="ov-card__val" data-bind="ov-fdv">$—</span>
            <span class="ov-card__sub">at 21M τ</span>
          </div>
          <div class="ov-card">
            <span class="ov-card__lbl">Circulating</span>
            <span class="ov-card__val" data-bind="ov-circ">—</span>
            <span class="ov-card__sub">of 21M τ max</span>
          </div>
          <div class="ov-card">
            <span class="ov-card__lbl">Staked</span>
            <span class="ov-card__val" data-bind="ov-staked">—</span>
            <span class="ov-card__sub" data-bind="ov-apr">APR —</span>
          </div>
          <div class="ov-card">
            <span class="ov-card__lbl">AI Mkt Dominance</span>
            <span class="ov-card__val" data-bind="ov-aidom">—</span>
            <span class="ov-card__sub">of crypto-AI</span>
          </div>
          <div class="ov-card">
            <span class="ov-card__lbl">Block Height</span>
            <span class="ov-card__val" data-bind="ov-block">—</span>
            <span class="ov-card__sub" data-bind="ov-split">root / subnet</span>
          </div>
        </div>
        <p class="term-overview__note">Live from the Tao Market Cap public API — falls back to “—” when the feed is unreachable.</p>
      </section>

      <!-- ===== Panel 1: τ Price · Apple-Stocks-style hero ===== -->
      <article class="stockp is-bracketed term-cell--stockp">
        <header class="stockp__head">
          <div class="stockp__ticker">
            <h2 class="stockp__symbol"><em>τ</em> / USD</h2>
            <span class="stockp__name">Bittensor · live · CoinGecko</span>
          </div>
          <div class="stockp__price" data-bind="sp-price">$—</div>
          <div class="stockp__delta up" data-bind="sp-delta">— <span class="label" data-bind="sp-range-label">All time</span></div>
        </header>
        <div class="stockp__viz" style="position:relative">
          <canvas data-canvas="pricechart" aria-label="τ/USD price"></canvas>
          <div class="stockp__hover" data-bind="sp-hover">
            <span class="hd up" data-bind="sp-hover-delta">—</span>
            <div class="hp" data-bind="sp-hover-price">—</div>
            <div class="hd" data-bind="sp-hover-date">—</div>
          </div>
        </div>
        <footer class="stockp__foot">
          <div class="stockp__ranges" role="tablist">
            <button class="stockp__range" data-range="1D">1D</button>
            <button class="stockp__range" data-range="1W">1W</button>
            <button class="stockp__range" data-range="1M">1M</button>
            <button class="stockp__range" data-range="3M">3M</button>
            <button class="stockp__range" data-range="1Y">1Y</button>
            <button class="stockp__range active" data-range="ALL">ALL</button>
          </div>
          <button class="stockp__events" data-events>Events</button>
          <button class="stockp__expand" data-expand="pricechart" aria-label="Expand chart">
            Expand <span class="arr">↗</span>
          </button>
        </footer>
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

      <!-- ===== Panel: Network Live Activity ===== -->
      <article class="panel is-bracketed term-cell--live" id="panel-live">
        <div class="panel__head">
          <span class="panel__title">
            <span class="panel__fcode">&lt;025&gt;</span>
            LIVE NETWORK ACTIVITY
            <span class="panel__go">&lt;GO&gt;</span>
          </span>
          <span class="panel__meta">
            <span class="panel__pill panel__pill--live"><span class="live-dot"></span>STREAMING</span>
          </span>
        </div>
        <div class="panel__caption">
          On-chain events across all subnets in real time. Color-coded by action type:
          <strong style="color:var(--c-up)">stake +</strong>,
          <strong style="color:var(--c-down)">unstake −</strong>,
          <strong style="color:var(--c-red)">emission</strong>,
          <strong style="color:var(--c-warn)">register</strong>.
        </div>
        <div class="panel__body panel__body--pad-0">
          <ul class="term-activity" id="term-activity"></ul>
        </div>
        <div class="panel__foot">
          <span>STAKE · UNSTAKE · EMIT · REGISTER · WEIGHT · BURN</span>
          <span>SIM · NEWEST FIRST</span>
        </div>
      </article>

      <!-- ===== Panel: AI Benchmark Leaderboard ===== -->
      <article class="panel is-bracketed term-cell--bench" id="panel-bench">
        <div class="panel__head">
          <span class="panel__title">
            <span class="panel__fcode">&lt;030&gt;</span>
            AI BENCHMARK LEADERBOARD
            <span class="panel__go">&lt;GO&gt;</span>
          </span>
          <span class="panel__meta">
            <span class="panel__pill panel__pill--live"><span class="live-dot"></span>${BENCHMARKS.length} BENCHMARKS</span>
          </span>
        </div>
        <div class="panel__caption">
          The benchmarks that actually drive the conversation in frontier AI — May 2026.
          <strong style="color:var(--c-up)">Open-weight models</strong> are flagged so you can
          see where the Bittensor training subnets are competing directly. Pick a benchmark to
          see the top six leaders and their scores.
        </div>
        <div class="panel__body bench-body" id="bench-body">
          <!-- benchmark tabs + leader list, rendered by JS -->
        </div>
        <div class="panel__foot">
          <span>SOURCES · LMSYS / OpenLLM-Leaderboard / HELM / paper releases</span>
          <span>UPDATED MAY 2026</span>
        </div>
      </article>

      <!-- ===== Panel: Asian AI Spotlight ===== -->
      <article class="panel is-bracketed term-cell--asia" id="panel-asia">
        <div class="panel__head">
          <span class="panel__title">
            <span class="panel__fcode">&lt;040&gt;</span>
            ASIAN AI SPOTLIGHT
            <span class="panel__go">&lt;GO&gt;</span>
          </span>
          <span class="panel__meta">
            <span class="panel__pill">CN · KR · JP · TW · IN</span>
          </span>
        </div>
        <div class="panel__caption">
          The half of the frontier-AI map most US-focused dashboards miss.
          <strong style="color:var(--c-red))">China leads in open-weight LLMs and domestic silicon</strong>;
          Korea owns the memory + foundry stack; Japan is rebuilding sovereign compute via Rapidus + SoftBank;
          Taiwan still makes everyone's chips. We weigh every subnet against these players.
        </div>
        <div class="panel__body">
          <div class="asia-filter" role="tablist">
            <button class="asia-tab active" data-region="ALL">All Asia</button>
            <button class="asia-tab" data-region="CN">China</button>
            <button class="asia-tab" data-region="KR">Korea</button>
            <button class="asia-tab" data-region="JP">Japan</button>
            <button class="asia-tab" data-region="TW">Taiwan</button>
            <button class="asia-tab" data-region="IN">India</button>
          </div>
          <ul class="asia-list" id="asia-list"></ul>
        </div>
        <div class="panel__foot">
          <span>FILTERED FROM ${CENTRALIZED_PLAYERS.length} TRACKED PLAYERS</span>
          <span id="asia-count">—</span>
        </div>
      </article>

      <!-- ===== Panel: Frontier Releases timeline ===== -->
      <article class="panel is-bracketed term-cell--releases" id="panel-models">
        <div class="panel__head">
          <span class="panel__title">
            <span class="panel__fcode">&lt;050&gt;</span>
            FRONTIER MODEL RELEASES · LAST 12 MO
            <span class="panel__go">&lt;GO&gt;</span>
          </span>
          <span class="panel__meta">
            <span class="panel__pill" style="color:${EVENT_COLORS.model}">${EVENT_LABELS.model}</span>
          </span>
        </div>
        <div class="panel__caption">
          Every flagship model release that moved the goalposts, ordered by date.
          The releases your subnets are benchmarked against.
        </div>
        <div class="panel__body">
          <ol class="release-list" id="release-list"></ol>
        </div>
        <div class="panel__foot">
          <span>FROM events.js</span>
          <span>${EVENTS.filter(e => e.cat === 'model').length} RELEASES TRACKED</span>
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

  /* ===== PriceChart hero (Apple Stocks style) ===== */
  const priceCanvas = qs('[data-canvas="pricechart"]', root);
  /* Build a 32-month daily history once, then slice per range. */
  const fullHistory = (() => {
    const waypoints = [
      ['2023-09-01',  35], ['2023-12-15', 220],
      ['2024-04-10', 700], ['2024-07-05', 320],
      ['2024-11-20', 600], ['2025-02-20', 700],
      ['2025-06-10', 380], ['2025-09-30', 410],
      ['2025-12-15', 520], ['2026-02-01', 460],
      ['2026-04-15', 510], ['2026-05-13', 487],
    ].map(([d, p]) => ({ t: Date.parse(d + 'T00:00:00Z'), p }));
    const out = [];
    const dayMs = 86_400_000;
    let seed = 20260513;
    const rng = () => { seed = (seed * 9301 + 49297) >>> 0; return (seed % 233280) / 233280; };
    for (let i = 0; i < waypoints.length - 1; i++){
      const a = waypoints[i], b = waypoints[i + 1];
      const days = Math.round((b.t - a.t) / dayMs);
      for (let k = 0; k < days; k++){
        const u = k / days;
        const ease = u < .5 ? 2*u*u : 1 - Math.pow(-2*u + 2, 2) / 2;
        const base = a.p + (b.p - a.p) * ease;
        const noise = (rng() - 0.5) * base * 0.06;
        out.push({ t: a.t + k * dayMs, p: Math.max(10, base + noise) });
      }
    }
    out.push(waypoints[waypoints.length - 1]);
    return out;
  })();

  const RANGE_LABEL = { '1D':'Today', '1W':'Past week', '1M':'Past month', '3M':'Past 3 months', '1Y':'Past year', 'ALL':'All time' };
  function sliceFor(range){
    const dayMs = 86_400_000;
    const last = fullHistory[fullHistory.length - 1];
    const ranges = { '1D': 1, '1W': 7, '1M': 30, '3M': 90, '1Y': 365, 'ALL': Infinity };
    const days = ranges[range] ?? Infinity;
    if (range === '1D'){
      /* synthesize 24 hourly points around the last close */
      const out = [];
      const start = last.p * (1 - 0.04 * Math.random());
      for (let i = 23; i >= 0; i--){
        const u = (23 - i) / 23;
        const ease = u < .5 ? 2*u*u : 1 - Math.pow(-2*u + 2, 2) / 2;
        const p = start + (last.p - start) * ease + (Math.random() - .5) * last.p * 0.012;
        out.push({ t: last.t - i * 60 * 60 * 1000, p });
      }
      return out;
    }
    return fullHistory.filter(k => k.t >= last.t - days * dayMs);
  }

  const spPrice    = qs('[data-bind="sp-price"]',       root);
  const spDelta    = qs('[data-bind="sp-delta"]',       root);
  const spRangeLbl = qs('[data-bind="sp-range-label"]', root);
  const spHover    = qs('[data-bind="sp-hover"]',       root);
  const spHovDelta = qs('[data-bind="sp-hover-delta"]', root);
  const spHovPrice = qs('[data-bind="sp-hover-price"]', root);
  const spHovDate  = qs('[data-bind="sp-hover-date"]',  root);

  let currentRange = 'ALL';
  let showEvents   = false;
  const priceChart = priceCanvas ? new PriceChart(priceCanvas, {
    data:        sliceFor(currentRange),
    events:      EVENTS,
    eventColors: EVENT_COLORS,
    showEvents,
    onHover: (h) => {
      if (!h){ spHover?.classList.remove('show'); return; }
      spHover?.classList.add('show');
      if (spHovPrice) spHovPrice.textContent = '$' + h.price.toFixed(2);
      if (spHovDelta){
        const sign = h.change >= 0 ? '+' : '';
        spHovDelta.textContent = `${sign}${h.change.toFixed(2)}  (${sign}${h.pct.toFixed(2)}%)`;
        spHovDelta.classList.toggle('up',   h.change >= 0);
        spHovDelta.classList.toggle('down', h.change < 0);
      }
      if (spHovDate){
        const isHourly = currentRange === '1D';
        spHovDate.textContent = isHourly
          ? h.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          : h.date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
      }
    },
  }) : null;

  function refreshHeader(){
    if (!priceChart) return;
    const s = priceChart.stats();
    if (spPrice) spPrice.textContent = '$' + s.end.toFixed(2);
    if (spDelta){
      const sign = s.change >= 0 ? '+' : '';
      spDelta.innerHTML = `${sign}${s.change.toFixed(2)}  (${sign}${s.pct.toFixed(2)}%) <span class="label">${RANGE_LABEL[currentRange]}</span>`;
      spDelta.classList.toggle('up',   s.isUp);
      spDelta.classList.toggle('down', !s.isUp);
    }
    if (spRangeLbl) spRangeLbl.textContent = RANGE_LABEL[currentRange];
    /* color the active range chip with the trend color too */
    const activeBtn = root.querySelector('.stockp__range.active');
    activeBtn?.classList.toggle('is-up',   s.isUp);
    activeBtn?.classList.toggle('is-down', !s.isUp);
  }
  refreshHeader();

  /* range tab handlers */
  root.querySelectorAll('.stockp__range').forEach(btn => {
    btn.addEventListener('click', () => {
      root.querySelectorAll('.stockp__range').forEach(b => {
        b.classList.remove('active', 'is-up', 'is-down');
      });
      btn.classList.add('active');
      currentRange = btn.dataset.range;
      priceChart?.setData(sliceFor(currentRange));
      refreshHeader();
    });
  });

  /* events toggle */
  const evBtn = qs('[data-events]', root);
  evBtn?.addEventListener('click', () => {
    showEvents = !showEvents;
    evBtn.classList.toggle('active', showEvents);
    priceChart?.setShowEvents(showEvents);
  });

  /* live price subscribes to DataLayer — overrides last point */
  function applyLive(price){
    if (!Number.isFinite(price) || !priceChart) return;
    /* mutate last point's p, refresh header */
    const data = priceChart.data;
    if (!data || !data.length) return;
    data[data.length - 1].p = price;
    priceChart.invalidate();
    refreshHeader();
  }

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
    const low  = price * 0.96;
    const high = price * 1.04;
    if (quoteRange) quoteRange.textContent = `${money(low)} – ${money(high)}`;
    if (quoteVol)   quoteVol.textContent   = '$' + Math.round(price * 480_000).toLocaleString('en-US');
    if (quoteMcap)  quoteMcap.textContent  = '$' + (price * 7_420_000).toLocaleString('en-US', { maximumFractionDigits: 0 });
  }
  renderQuote(487.12, 3.24);

  let priceUnsub = () => {};
  if (dataLayer){
    priceUnsub = dataLayer.subscribe('tao:price', d => {
      if (!d || !Number.isFinite(d.price)) return;
      renderQuote(d.price, d.change24 ?? 0);
      applyLive(d.price);
    });
  }
  const tickTimer = 0;

  /* ===== Market Overview dashboard — live tao:market + tao:chain ===== */
  const ovEl = sel => qs(`[data-bind="${sel}"]`, root);
  const ov = {
    price: ovEl('ov-price'), priceD: ovEl('ov-price-d'),
    mcap:  ovEl('ov-mcap'),  mcapD:  ovEl('ov-mcap-d'),
    vol:   ovEl('ov-vol'),   fdv:    ovEl('ov-fdv'),
    circ:  ovEl('ov-circ'),  staked: ovEl('ov-staked'),
    apr:   ovEl('ov-apr'),   aidom:  ovEl('ov-aidom'),
    block: ovEl('ov-block'), split:  ovEl('ov-split'),
  };
  function renderMarket(d){
    if (!d) return;
    if (ov.price && d.price != null) ov.price.textContent = money(d.price);
    if (ov.priceD){
      const c = d.change24h ?? 0;
      ov.priceD.textContent = `${pct(c)} · 24h`;
      ov.priceD.className = `ov-card__sub ${deltaClass(c)}`;
    }
    if (ov.mcap && d.marketCap != null) ov.mcap.textContent = '$' + compact(d.marketCap);
    if (ov.mcapD){
      const c = d.change7d ?? 0;
      ov.mcapD.textContent = `7d ${pct(c)}`;
      ov.mcapD.className = `ov-card__sub ${deltaClass(c)}`;
    }
    if (ov.vol && d.volume24h != null) ov.vol.textContent = '$' + compact(d.volume24h);
    if (ov.fdv && d.fdv != null) ov.fdv.textContent = '$' + compact(d.fdv);
    if (ov.circ && d.circulating != null) ov.circ.textContent = compact(d.circulating) + ' τ';
    if (ov.staked && d.stakedPct != null) ov.staked.textContent = d.stakedPct.toFixed(1) + '%';
    if (ov.apr && d.stakingApr != null) ov.apr.textContent = `APR ${d.stakingApr.toFixed(2)}%`;
    if (ov.aidom && d.aiDominance != null) ov.aidom.textContent = d.aiDominance.toFixed(2) + '%';
    if (ov.block && d.blockNumber != null) ov.block.textContent = d.blockNumber.toLocaleString('en-US');
    /* feed the existing quote strip real volume + market cap too */
    if (quoteVol && d.volume24h != null) quoteVol.textContent = '$' + compact(d.volume24h);
    if (quoteMcap && d.marketCap != null) quoteMcap.textContent = '$' + compact(d.marketCap);
  }
  function renderChain(d){
    if (!d) return;
    if (ov.block && d.blockNumber != null) ov.block.textContent = d.blockNumber.toLocaleString('en-US');
    if (ov.split && d.rootPct != null && d.subnetsPct != null){
      ov.split.textContent = `${d.rootPct.toFixed(0)}% root · ${d.subnetsPct.toFixed(0)}% subnet`;
    }
  }
  let marketUnsub = () => {}, chainUnsub = () => {};
  if (dataLayer){
    marketUnsub = dataLayer.subscribe('tao:market', renderMarket);
    chainUnsub  = dataLayer.subscribe('tao:chain',  renderChain);
    if (dataLayer.get){
      renderMarket(dataLayer.get('tao:market'));
      renderChain(dataLayer.get('tao:chain'));
    }
  }

  /* ===== Performance bar chart (clickable → SubnetDetail) ===== */
  const perfCanvas = qs('[data-canvas="perf"]', root);
  const perfData = (() => {
    const sorted = [...SUBNETS].sort((a, b) => b.chg24 - a.chg24);
    const top = sorted.slice(0, 6);
    const bot = sorted.slice(-6).reverse();
    return [...top, ...bot].map(s => ({
      label:  `SN${s.netuid} · ${s.name}`,
      value:  s.chg24,
      sub:    catLabel(s.cat),
      netuid: s.netuid,
    }));
  })();
  const perfChart = perfCanvas ? new BarChart(perfCanvas, {
    orientation: 'horizontal',
    bipolar:     true,
    data:        perfData,
    formatValue: v => `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`,
    onBarClick:  (row) => { window.location.href = `subnet.html?id=${row.netuid}`; },
  }) : null;

  /* ===== Emissions leaderboard (clickable → SubnetDetail) ===== */
  const emitCanvas = qs('[data-canvas="emit"]', root);
  const emitSubnets = [...SUBNETS]
    .sort((a, b) => b.emission - a.emission)
    .slice(0, 12);
  const emitData = emitSubnets.map(s => ({
    label:  `SN${s.netuid} · ${s.name}`,
    value:  s.emission,
    sub:    catLabel(s.cat),
    color:  catColor(s.cat),
    netuid: s.netuid,                     // carried through so onBarClick can route
  }));
  const emitChart = emitCanvas ? new BarChart(emitCanvas, {
    orientation: 'horizontal',
    bipolar:     false,
    data:        emitData,
    formatValue: v => `τ ${Math.round(v).toLocaleString('en-US')}`,
    onBarClick:  (row) => { window.location.href = `subnet.html?id=${row.netuid}`; },
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

  /* ===== Benchmark leaderboard ===== */
  const benchBody = qs('#bench-body', root);
  let activeBench = BENCHMARKS[0];
  function renderBench(){
    if (!benchBody) return;
    const tabs = BENCHMARKS.map(b => `
      <button class="bench-tab ${b.id === activeBench.id ? 'active' : ''}" data-bench="${b.id}">
        ${b.name}
      </button>
    `).join('');
    const top = activeBench.leaders.slice(0, 8);
    const maxScore = Math.max(...top.map(l => l.score));
    const rows = top.map((l, i) => {
      const w = (l.score / maxScore) * 100;
      return `
        <li class="bench-row">
          <span class="bench-row__rank">${String(i + 1).padStart(2, '0')}</span>
          <span class="bench-row__model">
            <span class="bench-row__name">${l.model}</span>
            <span class="bench-row__org">${l.org}</span>
          </span>
          <span class="bench-row__flags">
            ${l.open ? '<span class="flag flag--open">OPEN</span>' : ''}
            <span class="flag flag--region flag--${l.region.toLowerCase()}">${l.region}</span>
          </span>
          <span class="bench-row__bar"><i style="width:${w}%"></i></span>
          <span class="bench-row__score">${l.score.toLocaleString('en-US')}${activeBench.unit === '%' ? '%' : ''}</span>
        </li>
      `;
    }).join('');
    benchBody.innerHTML = `
      <div class="bench-tabs">${tabs}</div>
      <div class="bench-desc">
        <strong>${activeBench.full}</strong> · <span>${activeBench.description}</span>
      </div>
      <ol class="bench-list">${rows}</ol>
    `;
    benchBody.querySelectorAll('.bench-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const id = tab.dataset.bench;
        activeBench = BENCHMARKS.find(b => b.id === id) || BENCHMARKS[0];
        renderBench();
      });
    });
  }
  renderBench();

  /* ===== Asian AI Spotlight ===== */
  const asiaList  = qs('#asia-list',  root);
  const asiaCount = qs('#asia-count', root);
  let asiaRegion = 'ALL';
  function renderAsia(){
    if (!asiaList) return;
    let players = CENTRALIZED_PLAYERS.filter(p => ASIAN_REGIONS.has(p.region));
    if (asiaRegion !== 'ALL') players = players.filter(p => p.region === asiaRegion);
    asiaList.innerHTML = players.map(p => `
      <li class="asia-row">
        <span class="asia-row__region flag flag--region flag--${p.region.toLowerCase()}">${p.region}</span>
        <span class="asia-row__main">
          <a class="asia-row__name" href="${p.url}" target="_blank" rel="noopener">${p.name}</a>
          <span class="asia-row__focus">${p.focus}</span>
        </span>
        <span class="asia-row__cat">${(CATEGORIES[p.cat]?.label || p.cat)}</span>
        <span class="asia-row__flags">
          ${p.openSource ? '<span class="flag flag--open">OPEN</span>' : ''}
          <span class="flag flag--val">${p.valuation}</span>
        </span>
      </li>
    `).join('');
    if (asiaCount) asiaCount.textContent = `${players.length} ${asiaRegion === 'ALL' ? 'ASIAN' : REGIONS[asiaRegion]?.toUpperCase() || asiaRegion} PLAYERS`;
  }
  renderAsia();
  root.querySelectorAll('.asia-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      root.querySelectorAll('.asia-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      asiaRegion = tab.dataset.region;
      renderAsia();
    });
  });

  /* ===== Frontier model release list ===== */
  const releaseList = qs('#release-list', root);
  if (releaseList){
    const since = Date.parse('2025-05-13T00:00:00Z');
    const releases = EVENTS
      .filter(e => e.cat === 'model' && Date.parse(e.date) >= since)
      .reverse();    // newest first
    releaseList.innerHTML = releases.map(e => {
      const d = new Date(e.date);
      const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
      return `
        <li class="release">
          <span class="release__date">${month} ${d.getUTCFullYear()}</span>
          <span class="release__body">
            <span class="release__title">${e.title}</span>
            ${e.body ? `<span class="release__note">${e.body}</span>` : ''}
          </span>
        </li>
      `;
    }).join('');
  }

  /* ===== Network Pulse cockpit strip — live ticker ===== */
  const npBlock = qs('[data-bind="np-block"]', root);
  const npTps   = qs('[data-bind="np-tps"]',   root);
  const npVp    = qs('[data-bind="np-vp"]',    root);
  const npMem   = qs('[data-bind="np-mem"]',   root);
  const npProg  = qs('[data-bind="np-epoch-prog"]', root);
  const np = { block: 4_812_047, tps: 2147, vp: 96.4, mempool: 412, epochBlock: 268 };
  function paintPulse(){
    if (npBlock) npBlock.textContent = np.block.toLocaleString('en-US');
    if (npTps)   npTps.textContent   = np.tps.toLocaleString('en-US');
    if (npVp)    npVp.textContent    = `${np.vp.toFixed(1)}%`;
    if (npMem)   npMem.textContent   = np.mempool.toLocaleString('en-US');
    if (npProg){
      const blocksLeft = 360 - (np.epochBlock % 360);
      const secs = Math.max(0, blocksLeft * 12);
      const mm = Math.floor(secs / 60), ss = Math.floor(secs % 60);
      const z = n => String(n).padStart(2, '0');
      npProg.textContent = `${Math.floor(((np.epochBlock % 360) / 360) * 100)}% · ${z(mm)}:${z(ss)}`;
    }
  }
  paintPulse();
  const pulseTimer = setInterval(() => {
    np.block += 1;
    np.epochBlock += 1;
    if (np.epochBlock >= 360) np.epochBlock = 0;
    np.tps     = Math.max(800, Math.min(4200, np.tps + ((Math.random() - .5) * 120) | 0));
    np.vp      = Math.max(88, Math.min(99.4, +(np.vp + (Math.random() - .5) * 0.3).toFixed(2)));
    np.mempool = Math.max(40, Math.min(1800, np.mempool + ((Math.random() - .5) * 60) | 0));
    paintPulse();
  }, 1500);

  /* ===== Live network activity feed ===== */
  const ACT = [
    { code: 'STAKE',    weight: 18 },
    { code: 'UNSTAKE',  weight:  8 },
    { code: 'EMIT',     weight: 14 },
    { code: 'REGISTER', weight:  6 },
    { code: 'WEIGHT',   weight: 10 },
    { code: 'BURN',     weight:  4 },
    { code: 'INFER',    weight: 12 },
  ];
  const ACT_TOTAL = ACT.reduce((a, x) => a + x.weight, 0);
  const liveFeed = qs('#term-activity', root);
  function pickActAct(){ let r = Math.random() * ACT_TOTAL; for (const a of ACT){ r -= a.weight; if (r <= 0) return a; } return ACT[0]; }
  function pushActivity(){
    if (!liveFeed) return;
    const a = pickActAct();
    const sn = SUBNETS[Math.floor(Math.random() * SUBNETS.length)];
    const amt = ['REGISTER','WEIGHT'].includes(a.code) ? null : (40 + Math.random() * 3400);
    const d = new Date();
    const z = n => String(n).padStart(2, '0');
    const ts = `${z(d.getUTCHours())}:${z(d.getUTCMinutes())}:${z(d.getUTCSeconds())}`;
    const li = document.createElement('li');
    li.className = 'term-act is-new';
    li.innerHTML = `
      <span class="term-act__ts">${ts}</span>
      <span class="term-act__code" data-action="${a.code}">${a.code}</span>
      <span class="term-act__sub">
        <span class="term-act__net">SN${sn.netuid}</span>
        <span class="term-act__name">${sn.name}</span>
        <span class="term-act__cat" style="color:${catColor(sn.cat)}">${catLabel(sn.cat)}</span>
      </span>
      ${amt != null ? `<span class="term-act__amt">τ ${amt.toLocaleString('en-US', { maximumFractionDigits: 1 })}</span>` : '<span class="term-act__amt"></span>'}
    `;
    liveFeed.prepend(li);
    while (liveFeed.children.length > 20) liveFeed.lastElementChild.remove();
    requestAnimationFrame(() => requestAnimationFrame(() => li.classList.remove('is-new')));
  }
  for (let i = 0; i < 10; i++) pushActivity();
  const liveTimer = setInterval(pushActivity, 1100);

  /* ===== Expand-to-fullscreen wiring ===== */
  root.querySelectorAll('[data-expand]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const which = btn.dataset.expand;
      if (which === 'pricechart'){
        openChartModal({
          ChartClass: PriceChart,
          opts: {
            data: sliceFor(currentRange),
            events: EVENTS,
            eventColors: EVENT_COLORS,
            showEvents,
          },
          title:    `τ / USD · ${RANGE_LABEL[currentRange]}`,
          subtitle: 'Smooth price line · drag to scrub',
          fcode:    '021',
        });
      } else if (which === 'timeline'){
        openChartModal({
          ChartClass: Timeline,
          title:    'τ / USD · SEPT 2023 — TODAY',
          subtitle: '32-month price line with ecosystem events overlaid',
          fcode:    '021',
        });
      }
    });
  });

  /* ===== Launchpad command bar ===== */
  const lpInput = qs('#launchpad-input', root);
  const lpMap = {
    timeline: 'panel-bench',   /* sentinel; we just scroll to whichever panel they want */
    bench: 'panel-bench', asia: 'panel-asia', models: 'panel-models',
    emit: '.term-cell--emit', move: '.term-cell--perf', cat: '.term-cell--cats',
    tao: '.term-cell--timeline',
  };
  function lpGo(code){
    if (!code) return;
    const key = code.toLowerCase().replace(/[^a-z0-9]/g, '');
    const target = lpMap[key];
    if (!target) return;
    const sel = target.startsWith('panel-') || target.startsWith('.') ? target : `#${target}`;
    const el = root.querySelector(sel.startsWith('.') || sel.startsWith('#') ? sel : `#${sel}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  if (lpInput){
    lpInput.addEventListener('keydown', e => {
      if (e.key === 'Enter'){ e.preventDefault(); lpGo(lpInput.value); lpInput.value = ''; }
    });
  }
  root.querySelectorAll('.lp-chip').forEach(chip => {
    chip.addEventListener('click', () => lpGo(chip.dataset.lp));
  });

  return {
    destroy(){
      priceChart?.destroy();
      perfChart?.destroy();
      emitChart?.destroy();
      if (tickTimer)  clearInterval(tickTimer);
      if (pulseTimer) clearInterval(pulseTimer);
      if (liveTimer)  clearInterval(liveTimer);
      priceUnsub();
      marketUnsub();
      chainUnsub();
    },
  };
}
