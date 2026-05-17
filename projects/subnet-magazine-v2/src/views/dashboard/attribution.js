/* =================================================================
   SUBNET MAGAZINE, PORT-STYLE ATTRIBUTION ENGINE
   -----------------------------------------------------------------
   What it is: a sector-attribution module modeled on Bloomberg
   PORT. Pick a portfolio, a benchmark, a horizon, a currency
   base, and a grouping; the screen recomputes Brinson-Fachler
   attribution across the Bittensor universe and shows where the
   alpha came from.

   What it answers, in the reader's voice:
     "Over the last 30d, where did my watchlist's return come from?
      Was it because I overweighted text subnets that rallied
      (allocation), or because the text subnets I picked beat the
      text-subnet average (selection)?"

   Math, in code (clean two-term decomposition that sums exactly
   to Active Return, no leftover Interaction column to explain):
     Active Return        = r_P - r_B
     Allocation Effect    = sum_s (w_P^s - w_B^s) * (r_B^s - r_B)
                            Brinson-Fachler allocation (subtracts the
                            benchmark total so only sector tilts that
                            outpaced the bench show up as positive)
     Selection Effect     = sum_s w_P^s * (r_P^s - r_B^s)
                            BHB-style selection (uses portfolio weight,
                            absorbs the interaction term so Allocation
                            + Selection = Active exactly)
     For sectors held only in benchmark (w_P=0): Selection=0,
     Allocation=-w_B*(r_B_s - r_B_total).
     For sectors held only in portfolio (w_B=0): Allocation=0,
     Selection=w_P*(r_P_s - r_B_total).

   Currency base:
     USD   -> returns are the raw USD-denominated alpha-price chg
     TAO   -> returns are alpha-chg minus tau-chg over same window,
              ie excess return over tau. What a tau holder cares
              about: did this alpha beat the index it lives on?

   The module is intentionally self-contained: it reads SUBNETS
   + localStorage watchlist directly, and returns one HTML string +
   one wire function. Dashboard.js injects it as a section.
   ================================================================= */

import { SUBNETS } from '../../data/subnets.js';
import { loadPaperState, annotatePositions } from '../../data/paper-portfolio.js';

/* ---------- presets ------------------------------------------- */

const HORIZONS = [
  { key: '24H', label: '24H', returnField: 'chg24' },
  { key: '7D',  label: '7D',  returnField: 'chg7'  },
  { key: '30D', label: '30D', returnField: 'chg30' },
];

const PORTFOLIOS = [
  { key: 'PAPER',    label: 'PAPER',      meta: 'your paper-trading positions, weighted by current value' },
  { key: 'WATCH',    label: 'WATCHLIST',  meta: 'starred subnets, equal-weight' },
  { key: 'TOP10EM',  label: 'TOP 10 EM',  meta: 'top 10 by emission, emission-weighted' },
  { key: 'TOP20MC',  label: 'TOP 20 MCAP',meta: 'top 20 by FDV, mcap-weighted' },
  { key: 'ALL',      label: 'ALL ACTIVE', meta: 'every active subnet, equal-weight' },
];

const BENCHMARKS = [
  { key: 'NETWORK',  label: 'NETWORK',    meta: 'all subnets, emission-weighted (the τ index)' },
  { key: 'TOP10EQ',  label: 'TOP 10 EQ',  meta: 'top 10 by emission, equal-weight' },
  { key: 'MCAP20',   label: 'TOP 20 MCAP',meta: 'top 20 by FDV, mcap-weighted' },
];

const CURRENCIES = [
  { key: 'USD', label: 'USD', meta: 'raw α-price change' },
  { key: 'TAO', label: 'τ',   meta: 'α excess return over τ' },
];

const GROUPS = [
  { key: 'cat',   label: 'CATEGORY',  field: 'cat'   },
  { key: 'owner', label: 'OWNER',     field: 'owner' },
];

/* TAO's own period-return, used to translate USD-denominated alpha
   returns into "excess over τ" when the currency base is TAO. These
   are reasonable mid-May 2026 figures, swap to live values when the
   data layer carries them. */
const TAO_RETURN = { '24H': 1.2, '7D': 4.8, '30D': 12.5 };

const CAT_COLOR = {
  text:'#FF1E3C', vision:'#FF8094', audio:'#FFB85C', video:'#C8A8AD',
  multimodal:'#FF4D60', training:'#FF7A88', data:'#8B6B70',
  search:'#5BE599', finance:'#00E5A8', agents:'#FFB0BA',
  robotics:'#FF8C42', science:'#FFB85C', infra:'#C11128',
  prediction:'#F5E5E8',
};
const catColor = c => CAT_COLOR[c] || '#FF1E3C';

const CAT_LABEL = {
  text:'TEXT', vision:'VISION', audio:'AUDIO', video:'VIDEO',
  multimodal:'MULTIMODAL', training:'TRAINING', data:'DATA',
  search:'SEARCH', finance:'FINANCE', agents:'AGENTS',
  robotics:'ROBOTICS', science:'SCIENCE', infra:'INFRA',
  prediction:'PREDICTION',
};
const catLabel = c => CAT_LABEL[c] || (c || '').toUpperCase();

/* ---------- default state ------------------------------------- */

export function defaultAttribState(){
  return {
    portfolio: 'WATCH',
    benchmark: 'NETWORK',
    horizon:   '30D',
    currency:  'USD',
    group:     'cat',
  };
}

/* ---------- portfolio + benchmark resolvers ------------------- */

const WATCHLIST_KEY = 'sbn:dashboard:watchlist:v1';
function loadWatchlistSet(){
  try { return new Set(JSON.parse(localStorage.getItem(WATCHLIST_KEY) || '[]')); }
  catch (_) { return new Set(); }
}

/* Return [{netuid, ..., weight}] where weight is the fraction of
   portfolio that subnet represents. Weights always sum to 1. */
function resolvePortfolio(key){
  if (key === 'PAPER'){
    const paper = loadPaperState();
    const annotated = annotatePositions(paper);
    const totalValue = annotated.reduce((a,p) => a + p.value, 0);
    if (annotated.length === 0 || totalValue <= 0){
      // No paper positions yet -> fall back to TOP10EM so the panel
      // still has something to analyze, flag with fallback for the UI.
      return resolvePortfolio('TOP10EM').map(s => ({ ...s, fallback: true }));
    }
    return annotated.map(p => {
      const full = SUBNETS.find(s => s.netuid === p.netuid) || {};
      return { ...full, weight: p.value / totalValue };
    });
  }
  if (key === 'WATCH'){
    const set = loadWatchlistSet();
    const picks = SUBNETS.filter(s => set.has(s.netuid));
    if (picks.length){
      const w = 1 / picks.length;
      return picks.map(s => ({ ...s, weight: w }));
    }
    /* Empty watchlist -> graceful fallback to TOP10EM, with a flag
       the renderer reads to show "watchlist is empty, showing TOP10
       so the panel still has something to talk about." */
    return resolvePortfolio('TOP10EM').map(s => ({ ...s, fallback: true }));
  }
  if (key === 'TOP10EM'){
    const top = [...SUBNETS].sort((a,b) => b.emission - a.emission).slice(0, 10);
    const tot = top.reduce((a,s) => a + s.emission, 0) || 1;
    return top.map(s => ({ ...s, weight: s.emission / tot }));
  }
  if (key === 'TOP20MC'){
    const top = [...SUBNETS].sort((a,b) => b.mcap - a.mcap).slice(0, 20);
    const tot = top.reduce((a,s) => a + s.mcap, 0) || 1;
    return top.map(s => ({ ...s, weight: s.mcap / tot }));
  }
  // ALL
  const w = 1 / SUBNETS.length;
  return SUBNETS.map(s => ({ ...s, weight: w }));
}

function resolveBenchmark(key){
  if (key === 'NETWORK'){
    const tot = SUBNETS.reduce((a,s) => a + s.emission, 0) || 1;
    return SUBNETS.map(s => ({ ...s, weight: s.emission / tot }));
  }
  if (key === 'TOP10EQ'){
    const top = [...SUBNETS].sort((a,b) => b.emission - a.emission).slice(0, 10);
    const w = 1 / top.length;
    return top.map(s => ({ ...s, weight: w }));
  }
  if (key === 'MCAP20'){
    const top = [...SUBNETS].sort((a,b) => b.mcap - a.mcap).slice(0, 20);
    const tot = top.reduce((a,s) => a + s.mcap, 0) || 1;
    return top.map(s => ({ ...s, weight: s.mcap / tot }));
  }
  return resolveBenchmark('NETWORK');
}

/* ---------- core attribution ---------------------------------- */

/* Apply currency translation: USD = raw, TAO = subtract tau period
   return. Returns the return value (in pct) for a subnet under the
   chosen horizon + currency base. */
function effectiveReturn(s, horizonKey, currencyKey){
  const field = HORIZONS.find(h => h.key === horizonKey).returnField;
  const raw = s[field] || 0;
  if (currencyKey === 'TAO') return raw - (TAO_RETURN[horizonKey] || 0);
  return raw;
}

export function computeAttribution(state){
  const portfolio  = resolvePortfolio(state.portfolio);
  const benchmark  = resolveBenchmark(state.benchmark);
  const groupField = (GROUPS.find(g => g.key === state.group) || GROUPS[0]).field;

  const r = s => effectiveReturn(s, state.horizon, state.currency);

  const r_P_total = portfolio.reduce((a,s) => a + s.weight * r(s), 0);
  const r_B_total = benchmark.reduce((a,s) => a + s.weight * r(s), 0);
  const r_active  = r_P_total - r_B_total;

  // Build per-sector aggregates
  const sectorMap = new Map();
  const getRec = key => {
    if (!sectorMap.has(key)){
      sectorMap.set(key, { key, w_P: 0, w_B: 0, contrib_P: 0, contrib_B: 0, n_P: 0, n_B: 0 });
    }
    return sectorMap.get(key);
  };
  for (const s of portfolio){
    const key = s[groupField] || 'data';
    const rec = getRec(key);
    rec.w_P += s.weight;
    rec.contrib_P += s.weight * r(s);
    rec.n_P++;
  }
  for (const s of benchmark){
    const key = s[groupField] || 'data';
    const rec = getRec(key);
    rec.w_B += s.weight;
    rec.contrib_B += s.weight * r(s);
    rec.n_B++;
  }

  const sectorRows = [...sectorMap.values()].map(rec => {
    const r_P_s = rec.w_P > 0 ? rec.contrib_P / rec.w_P : 0;
    const r_B_s = rec.w_B > 0 ? rec.contrib_B / rec.w_B : 0;
    const activeWt    = rec.w_P - rec.w_B;
    const activeContr = rec.contrib_P - rec.contrib_B;

    let alloc, select;
    if (rec.w_P === 0 && rec.w_B > 0){
      // Sector held only in the benchmark: pure missed-allocation,
      // no selection signal because we have nothing of our own
      // to compare against the bench's holdings.
      alloc  = -rec.w_B * (r_B_s - r_B_total);
      select = 0;
    } else if (rec.w_B === 0 && rec.w_P > 0){
      // Sector held only by us: off-benchmark bet. All the active
      // contribution is selection skill, measured against the bench's
      // overall return as the opportunity cost.
      alloc  = 0;
      select = rec.w_P * (r_P_s - r_B_total);
    } else {
      // Both have weight: BF allocation + BHB-style selection.
      // Decomposition sums exactly to Active Return.
      alloc  = activeWt * (r_B_s - r_B_total);
      select = rec.w_P * (r_P_s - r_B_s);
    }
    return {
      key: rec.key,
      w_P:   rec.w_P * 100,
      w_B:   rec.w_B * 100,
      n_P:   rec.n_P,
      activeWt: activeWt * 100,
      r_P_s, r_B_s,
      activeContr,
      alloc, select,
      total: alloc + select,
    };
  }).sort((a, b) => Math.abs(b.total) - Math.abs(a.total));

  // Per-subnet contributions for the top-5 / bottom-5 panels
  const benchByNet = new Map(benchmark.map(b => [b.netuid, b.weight]));
  const subnetRows = portfolio.map(s => {
    const w_B_i = benchByNet.get(s.netuid) || 0;
    const r_i   = r(s);
    return {
      netuid: s.netuid,
      name:   s.name,
      cat:    s.cat,
      weight: s.weight * 100,
      activeWt: (s.weight - w_B_i) * 100,
      r:      r_i,
      activeContr: (s.weight - w_B_i) * r_i,
      contr:  s.weight * r_i,
    };
  });
  const top5 = subnetRows.slice().sort((a,b) => b.activeContr - a.activeContr).slice(0, 5);
  const bot5 = subnetRows.slice().sort((a,b) => a.activeContr - b.activeContr).slice(0, 5);

  const allocEffect  = sectorRows.reduce((a,r) => a + r.alloc, 0);
  const selectEffect = sectorRows.reduce((a,r) => a + r.select, 0);
  /* The sum-of-effects should agree with active return to within
     floating-point noise. Exposing the residual lets the reader
     verify the decomposition is honest. */
  const residual     = r_active - allocEffect - selectEffect;

  return {
    portfolio, benchmark,
    r_P_total, r_B_total, r_active,
    allocEffect, selectEffect, residual,
    sectorRows, top5, bot5,
    isFallback: !!(portfolio[0] && portfolio[0].fallback),
  };
}

/* ---------- format helpers ----------------------------------- */

const fmtPct = v => v == null || !Number.isFinite(v)
  ? '·'
  : (v >= 0 ? '+' : '') + v.toFixed(2) + '%';
const fmtBp  = v => v == null || !Number.isFinite(v)
  ? '·'
  : (v >= 0 ? '+' : '') + (v * 100).toFixed(0) + 'bp';
const cls    = v => v == null ? 'is-flat' : (v > 0 ? 'is-up' : v < 0 ? 'is-down' : 'is-flat');
const arrow  = v => v == null ? '·' : (v > 0.001 ? '▲' : v < -0.001 ? '▼' : '—');

/* ---------- inline SVG (donut + bars) ------------------------ */

function donut(segments){
  const total = segments.reduce((n, s) => n + s.value, 0) || 1;
  let acc = 0;
  const r1 = 44, r2 = 30, cx = 55, cy = 55;
  const arcs = segments.map(s => {
    const start = (acc / total) * 2 * Math.PI - Math.PI / 2;
    acc += s.value;
    const end = (acc / total) * 2 * Math.PI - Math.PI / 2;
    const large = (s.value / total) > 0.5 ? 1 : 0;
    if ((end - start) <= 0.0001) return '';
    const x1 = cx + r1 * Math.cos(start), y1 = cy + r1 * Math.sin(start);
    const x2 = cx + r1 * Math.cos(end),   y2 = cy + r1 * Math.sin(end);
    const x3 = cx + r2 * Math.cos(end),   y3 = cy + r2 * Math.sin(end);
    const x4 = cx + r2 * Math.cos(start), y4 = cy + r2 * Math.sin(start);
    return `<path d="M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r1} ${r1} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} L ${x3.toFixed(2)} ${y3.toFixed(2)} A ${r2} ${r2} 0 ${large} 0 ${x4.toFixed(2)} ${y4.toFixed(2)} Z" fill="${s.color}"/>`;
  }).join('');
  return `<svg viewBox="0 0 110 110" class="attrib-donut__svg">${arcs}</svg>`;
}

/* Horizontal effect bars: signed, anchored on a centered zero line.
   Three rows (Allocation, Selection, Interaction). Bar length is
   proportional to |value| over the row's max. Positive bars extend
   right (red), negative extend left (mint, matches "up = good" PnL
   for the selection-effect read). */
function effectBars(effects){
  const maxAbs = Math.max(0.001, ...effects.map(e => Math.abs(e.value)));
  return effects.map(e => {
    const len = (Math.abs(e.value) / maxAbs) * 50;
    const isPos = e.value >= 0;
    // Positive contribution to active return = gain = mint;
    // negative = drag = red. Matches the rest of the UI semantics.
    const fill  = isPos ? '#00E5A8' : '#FF1E3C';
    const x = isPos ? 50 : (50 - len);
    return `
      <div class="attrib-fxbar">
        <div class="attrib-fxbar__lbl">${e.label}</div>
        <div class="attrib-fxbar__track">
          <svg viewBox="0 0 100 14" preserveAspectRatio="none" class="attrib-fxbar__svg">
            <line x1="50" y1="0" x2="50" y2="14" stroke="rgba(255,30,60,.32)" stroke-width=".5"/>
            <rect x="${x.toFixed(2)}" y="3" width="${len.toFixed(2)}" height="8" fill="${fill}" fill-opacity=".85"/>
          </svg>
          <div class="attrib-fxbar__val ${cls(e.value)}">${fmtBp(e.value)}</div>
        </div>
      </div>`;
  }).join('');
}

/* ---------- top-strip control chips -------------------------- */

function controlChip(group, options, currentKey, dataAttr, meta){
  const buttons = options.map(o => `
    <button type="button"
            class="attrib-chip ${o.key === currentKey ? 'is-on' : ''}"
            data-attrib="${dataAttr}"
            data-attrib-val="${o.key}"
            title="${o.meta || ''}">${o.label}</button>`).join('');
  return `
    <div class="attrib-control">
      <div class="attrib-control__lbl">${group}</div>
      <div class="attrib-control__chips">${buttons}</div>
      <div class="attrib-control__meta">${meta || ''}</div>
    </div>`;
}

/* ---------- main render -------------------------------------- */

/**
 * @param {ReturnType<typeof defaultAttribState>} state
 * @returns {string} HTML
 */
export function renderAttribution(state){
  const a = computeAttribution(state);

  const horizon = HORIZONS.find(h => h.key === state.horizon);
  const portfolio = PORTFOLIOS.find(p => p.key === state.portfolio);
  const benchmark = BENCHMARKS.find(b => b.key === state.benchmark);
  const currency  = CURRENCIES.find(c => c.key === state.currency);
  const group     = GROUPS.find(g => g.key === state.group);

  const metricCells = [
    { lbl: 'PORTFOLIO RTN', v: a.r_P_total,    note: portfolio.label },
    { lbl: 'BENCHMARK RTN', v: a.r_B_total,    note: benchmark.label },
    { lbl: 'ACTIVE RTN',    v: a.r_active,     note: 'P − B' },
    { lbl: 'ALLOCATION',    v: a.allocEffect,  note: 'sector tilt effect' },
    { lbl: 'SELECTION',     v: a.selectEffect, note: 'within-sector pick effect' },
  ].map(m => `
    <div class="attrib-metric">
      <div class="attrib-metric__lbl">${m.lbl}</div>
      <div class="attrib-metric__val ${cls(m.v)}">${arrow(m.v)} ${fmtPct(m.v)}</div>
      <div class="attrib-metric__note">${m.note}</div>
    </div>`).join('');

  // sector breakdown donut: portfolio weights
  const donutSegs = a.sectorRows
    .filter(r => r.w_P > 0.01)
    .map(r => ({ value: r.w_P, color: catColor(r.key), label: r.key }));
  const donutLegend = donutSegs.slice(0, 8).map(s => `
    <li class="attrib-legend__row">
      <span class="attrib-legend__sw" style="background:${s.color}"></span>
      <span class="attrib-legend__lbl">${catLabel(s.label)}</span>
      <span class="attrib-legend__val">${s.value.toFixed(1)}%</span>
    </li>`).join('');

  // Effects bars: signed, anchored on a zero-line at the center.
  const fxBars = effectBars([
    { label: 'ALLOCATION', value: a.allocEffect },
    { label: 'SELECTION',  value: a.selectEffect },
    { label: 'ACTIVE',     value: a.r_active   },
  ]);

  // Sector attribution table
  const sectorTableRows = a.sectorRows.length ? a.sectorRows.map(r => `
    <tr class="attrib-table__row">
      <td class="attrib-table__cat">
        <span class="attrib-table__sw" style="background:${catColor(r.key)}"></span>
        ${catLabel(r.key)}
        ${r.n_P ? `<span class="attrib-table__n">${r.n_P}</span>` : ''}
      </td>
      <td class="attrib-table__num ${cls(r.activeWt)}">${(r.activeWt >= 0 ? '+' : '') + r.activeWt.toFixed(1)}%</td>
      <td class="attrib-table__num ${cls(r.activeContr)}">${fmtPct(r.activeContr)}</td>
      <td class="attrib-table__num ${cls(r.alloc)}">${fmtBp(r.alloc)}</td>
      <td class="attrib-table__num ${cls(r.select)}">${fmtBp(r.select)}</td>
      <td class="attrib-table__num attrib-table__num--total ${cls(r.total)}">${fmtBp(r.total)}</td>
    </tr>`).join('') : `
    <tr><td colspan="6" class="attrib-table__empty">No sectors in scope.</td></tr>`;

  // Sector attribution cards (mobile)
  const sectorCards = a.sectorRows.length ? a.sectorRows.map(r => `
    <div class="attrib-card">
      <div class="attrib-card__head">
        <span class="attrib-card__sw" style="background:${catColor(r.key)}"></span>
        <span class="attrib-card__name">${catLabel(r.key)}</span>
        <span class="attrib-card__n">${r.n_P} hold</span>
        <span class="attrib-card__total ${cls(r.total)}">${fmtBp(r.total)}</span>
      </div>
      <div class="attrib-card__grid">
        <div><span>ACTIVE WT</span><b class="${cls(r.activeWt)}">${(r.activeWt >= 0 ? '+' : '') + r.activeWt.toFixed(1)}%</b></div>
        <div><span>ACTIVE CONTR</span><b class="${cls(r.activeContr)}">${fmtPct(r.activeContr)}</b></div>
        <div><span>ALLOC</span><b class="${cls(r.alloc)}">${fmtBp(r.alloc)}</b></div>
        <div><span>SELECT</span><b class="${cls(r.select)}">${fmtBp(r.select)}</b></div>
      </div>
    </div>`).join('') : '';

  // Top 5 / Bottom 5 by Active Contribution
  const topRows = a.top5.map(s => `
    <li class="attrib-rank__row">
      <span class="attrib-rank__sn">SN${s.netuid}</span>
      <span class="attrib-rank__name">${s.name}</span>
      <span class="attrib-rank__r ${cls(s.r)}">${fmtPct(s.r)}</span>
      <span class="attrib-rank__contr ${cls(s.activeContr)}">${fmtBp(s.activeContr)}</span>
    </li>`).join('');
  const botRows = a.bot5.map(s => `
    <li class="attrib-rank__row">
      <span class="attrib-rank__sn">SN${s.netuid}</span>
      <span class="attrib-rank__name">${s.name}</span>
      <span class="attrib-rank__r ${cls(s.r)}">${fmtPct(s.r)}</span>
      <span class="attrib-rank__contr ${cls(s.activeContr)}">${fmtBp(s.activeContr)}</span>
    </li>`).join('');

  const fallbackNote = a.isFallback ? `
    <div class="attrib-fallback">
      ${state.portfolio === 'PAPER'
        ? '⊕ PAPER PORTFOLIO is empty &mdash; showing TOP 10 EM as a stand-in. Use the Paper Portfolio panel below to buy your first positions, then this analysis will be about your actual bets.'
        : '★ WATCHLIST is empty &mdash; showing TOP 10 EM as a stand-in. Star subnets in the rail to build your own portfolio.'}
    </div>` : '';

  return `
    <section class="attrib" data-attrib-root>
      <header class="attrib__head">
        <div class="attrib__title">
          <span class="attrib__eyebrow">⊕ ATTRIBUTION DESK</span>
          <h2 class="attrib__h">Where is the alpha coming from?</h2>
          <div class="attrib__sub">Brinson-Fachler sector attribution. Pick a portfolio, a benchmark, a horizon &mdash; the screen recomputes.</div>
        </div>
        <div class="attrib__pulse">
          <span class="attrib__pulse-dot"></span>
          <span class="attrib__pulse-txt">LIVE</span>
          <span class="attrib__pulse-meta">${horizon.label} · ${currency.label}</span>
        </div>
      </header>

      <div class="attrib-controls">
        ${controlChip('PORTFOLIO', PORTFOLIOS, state.portfolio, 'portfolio', portfolio.meta)}
        ${controlChip('BENCHMARK', BENCHMARKS, state.benchmark, 'benchmark', benchmark.meta)}
        ${controlChip('HORIZON',   HORIZONS,   state.horizon,   'horizon',   `α-price change over ${horizon.label}`)}
        ${controlChip('CURRENCY',  CURRENCIES, state.currency,  'currency',  currency.meta)}
        ${controlChip('GROUP BY',  GROUPS,     state.group,     'group',     `bucketed by ${group.label.toLowerCase()}`)}
      </div>

      ${fallbackNote}

      <div class="attrib-metrics">${metricCells}</div>

      <div class="attrib-body">
        <div class="attrib-left">
          <div class="attrib-panel">
            <div class="attrib-panel__head">
              <span class="attrib-panel__lbl">SECTOR ATTRIBUTION · effects in basis points</span>
              <span class="attrib-panel__meta">${a.sectorRows.length} ${group.label.toLowerCase()} buckets</span>
            </div>
            <div class="attrib-table-wrap">
              <table class="attrib-table">
                <thead>
                  <tr>
                    <th>${group.label}</th>
                    <th class="attrib-table__num">ACTIVE WT</th>
                    <th class="attrib-table__num">ACTIVE CONTR</th>
                    <th class="attrib-table__num">ALLOC</th>
                    <th class="attrib-table__num">SELECT</th>
                    <th class="attrib-table__num">TOTAL</th>
                  </tr>
                </thead>
                <tbody>${sectorTableRows}</tbody>
              </table>
            </div>
            <div class="attrib-cards">${sectorCards}</div>
          </div>
        </div>

        <div class="attrib-right">
          <div class="attrib-panel attrib-panel--mix">
            <div class="attrib-panel__head">
              <span class="attrib-panel__lbl">PORTFOLIO MIX · weight share</span>
              <span class="attrib-panel__meta">${portfolio.label}</span>
            </div>
            <div class="attrib-mix">
              <div class="attrib-donut">${donut(donutSegs)}</div>
              <ul class="attrib-legend">${donutLegend}</ul>
            </div>
          </div>

          <div class="attrib-panel">
            <div class="attrib-panel__head">
              <span class="attrib-panel__lbl">ATTRIBUTION EFFECTS</span>
              <span class="attrib-panel__meta">bp of active return</span>
            </div>
            <div class="attrib-fx">${fxBars}</div>
          </div>

          <div class="attrib-panel">
            <div class="attrib-panel__head">
              <span class="attrib-panel__lbl">TOP 5 · active contribution</span>
              <span class="attrib-panel__meta">where the alpha came from</span>
            </div>
            <ul class="attrib-rank">${topRows}</ul>
          </div>

          <div class="attrib-panel">
            <div class="attrib-panel__head">
              <span class="attrib-panel__lbl">BOTTOM 5 · active drag</span>
              <span class="attrib-panel__meta">where it leaked out</span>
            </div>
            <ul class="attrib-rank">${botRows}</ul>
          </div>
        </div>
      </div>
    </section>
  `;
}

/* ---------- wire --------------------------------------------- */

/**
 * Binds the chip clicks. When any chip is clicked, the state is
 * mutated in place and the entire attribution section is re-rendered.
 * @param {HTMLElement} root          the root holding [data-attrib-root]
 * @param {object}      state         mutable state object
 * @param {Function}    onRepaint     called after re-render so caller can re-wire
 */
export function wireAttribution(root, state, onRepaint){
  const sec = root.querySelector('[data-attrib-root]');
  if (!sec) return;
  sec.querySelectorAll('[data-attrib]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.attrib;
      const val = btn.dataset.attribVal;
      if (!key || !val) return;
      if (state[key] === val) return;
      state[key] = val;
      // Re-render just this section, keep scroll
      const next = renderAttribution(state);
      const wrap = document.createElement('div');
      wrap.innerHTML = next;
      sec.replaceWith(wrap.firstElementChild);
      if (typeof onRepaint === 'function') onRepaint();
    });
  });
}
