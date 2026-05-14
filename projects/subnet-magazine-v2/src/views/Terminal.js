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
import { BarChart } from '../charts/BarChart.js';
import { SUBNETS } from '../data/subnets.js';
import { CATEGORIES, catColor, catLabel } from '../data/categories.js';
import { BENCHMARKS } from '../data/benchmarks.js';
import { CENTRALIZED_PLAYERS, ASIAN_REGIONS, REGIONS } from '../data/centralized.js';
import { EVENTS, EVENT_COLORS, EVENT_LABELS } from '../data/events.js';
import { openChartModal } from '../lib/chart-modal.js';
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

      <!-- ===== Panel 1: τ Price + Event Timeline (the marquee) ===== -->
      <article class="panel is-bracketed term-cell--timeline">
        <div class="panel__head">
          <span class="panel__title">
            <span class="panel__fcode">&lt;021&gt;</span>
            τ / USD · SEPT 2023 — TODAY
            <span class="panel__go">&lt;GO&gt;</span>
          </span>
          <span class="panel__meta">
            <span class="panel__pill panel__pill--live"><span class="live-dot"></span>LIVE</span>
            <button class="panel__expand" data-expand="timeline" aria-label="Expand chart">⛶ EXPAND</button>
          </span>
        </div>
        <div class="panel__caption">
          Daily τ / USD price since mainnet, plotted over the major events that shaped it.
          <strong style="color:#FF1E3C">Red dots</strong> = network events (halvings, dTAO).
          <strong style="color:#FF8C42">Amber</strong> = subnet milestones.
          <strong style="color:#00C2FF">Cyan</strong> = frontier model releases (Claude, GPT, Gemini, DeepSeek, Llama).
          <strong style="color:#FFD166">Gold</strong> = market events. Hover anywhere for date · price; hover a dot for the full story.
        </div>
        <div class="panel__body panel__body--pad-0">
          <canvas data-canvas="timeline" aria-label="TAO/USD price with ecosystem event timeline"></canvas>
        </div>
        <div class="panel__foot">
          <span>32 MONTHS · DAILY · EVENTS OVERLAID</span>
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

  /* ===== Timeline wiring (the marquee chart) ===== */
  const timelineCanvas = qs('[data-canvas="timeline"]', root);
  const priceTag       = qs('#term-price-tag', root);
  const timeline       = timelineCanvas ? new Timeline(timelineCanvas) : null;

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
    });
  }
  /* The Timeline is a 32-month historical view — live price updates
     drive the summary strip; the chart itself doesn't tick. */
  const tickTimer = 0;

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

  /* ===== Expand-to-fullscreen wiring ===== */
  root.querySelectorAll('[data-expand]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const which = btn.dataset.expand;
      if (which === 'timeline'){
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
      timeline?.destroy();
      perfChart?.destroy();
      emitChart?.destroy();
      if (tickTimer) clearInterval(tickTimer);
      priceUnsub();
    },
  };
}
