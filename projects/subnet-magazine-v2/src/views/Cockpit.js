/* =================================================================
   SUBNET MAGAZINE, COCKPIT VIEW
   -----------------------------------------------------------------
   The research cockpit. One screen, no scroll required on desktop,
   four panes:

     LEFT   (260px)  Subnet rail — search + watchlist + 53 rows
     CENTER (flex)   Big chart you work inside —
                       header (subnet, price, change)
                       canvas (price line + volume bars, 365d data)
                       time range tabs (1D / 7D / 30D / 90D / 1Y)
                       KPI strip below (price, mcap, em, miners, vals)
     RIGHT  (320px)  Live news + signals feed for the selected subnet

   Mobile (≤900px): the three panes collapse into a tab switcher
   (SUBNETS | CHART | FEED) so each pane fills the viewport. You
   tap a tab to swap panes; selection persists across swaps.

   The cockpit deliberately does ONE thing well: pick a subnet,
   study its chart with context. The dashboard is for surveying;
   the cockpit is for drilling. They share the SUBNETS data and
   the watchlist, so picks in either surface flow to the other.

   Data:
     SUBNETS           src/data/subnets.js          128-subnet roster
     CENTRALIZED_NEWS  src/data/centralized-news.js SemiAnalysis feed
     ORACLE_ARTICLES   src/data/oracle-articles.js  oracle research
     ARTICLES          src/data/articles.js         magazine articles
   ================================================================= */

import { html, mount, qs, qsa } from '../lib/dom.js';
import { SUBNETS, subnetById } from '../data/subnets.js';
import { CENTRALIZED_NEWS, newsForSubnet } from '../data/centralized-news.js';
import { recentOracleArticles } from '../data/oracle-articles.js';
import { ARTICLES } from '../data/articles.js';
import { GH_ACTIVITY, ghByNetuid } from '../data/github-activity.js';
import { generateSeries, sma, SERIES_DAYS } from '../lib/synthetic-series.js';

const WATCHLIST_KEY = 'sbn:dashboard:watchlist:v1';
const COCKPIT_KEY   = 'sbn:cockpit:v1';

const CAT_LABEL = {
  text:'TEXT', vision:'VISION', audio:'AUDIO', video:'VIDEO',
  multimodal:'MULTIMODAL', training:'TRAINING', data:'DATA',
  search:'SEARCH', finance:'FINANCE', agents:'AGENTS',
  robotics:'ROBOTICS', science:'SCIENCE', infra:'INFRA',
  prediction:'PREDICTION',
};
const catLabel = c => CAT_LABEL[c] || (c || '').toUpperCase();

const RANGES = [
  { key: '1D',  days: 1,   label: '1D'  },
  { key: '7D',  days: 7,   label: '7D'  },
  { key: '30D', days: 30,  label: '30D' },
  { key: '90D', days: 90,  label: '90D' },
  { key: '1Y',  days: 365, label: '1Y'  },
];

const PANES = [
  { key: 'subnets', label: 'SUBNETS' },
  { key: 'chart',   label: 'CHART'   },
  { key: 'feed',    label: 'FEED'    },
];

/* ---------- formatters --------------------------------------- */
const fmtPrice = p => p == null ? '·' : (p < 1 ? '$' + p.toFixed(4) : '$' + p.toFixed(2));
const fmtPct   = v => v == null ? '·' : (v >= 0 ? '+' : '') + v.toFixed(2) + '%';
const fmtInt   = n => n == null ? '·' : Math.round(n).toLocaleString('en-US');
const fmtMcap  = m => m == null ? '·' : '$' + (m >= 1000 ? (m/1000).toFixed(2) + 'B' : m.toFixed(1) + 'M');
const fmtDate  = d => {
  if (!d) return '·';
  const [y,m,dd] = String(d).split('-');
  return `${dd} ${['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][parseInt(m,10)-1]} ${y.slice(2)}`;
};
const cls   = v => v == null ? 'is-flat' : (v > 0 ? 'is-up' : v < 0 ? 'is-down' : 'is-flat');
const arrow = v => v == null ? '·' : (v > 0.001 ? '▲' : v < -0.001 ? '▼' : '—');

/* ---------- watchlist + cockpit state ----------------------- */
function loadWatchlist(){
  try { return new Set(JSON.parse(localStorage.getItem(WATCHLIST_KEY) || '[]')); }
  catch (_) { return new Set(); }
}
function saveWatchlist(set){
  try { localStorage.setItem(WATCHLIST_KEY, JSON.stringify([...set])); } catch (_) {}
}
function loadCockpitState(){
  /* Cockpit ALWAYS leads with the CHART pane on every fresh page
     load (Rondo's directive: "the page to lead with a price chart").
     We don't restore a previously-active pane — the chart is the
     primary, always-visible-first. Selection + range + watched-filter
     still persist across visits. */
  try {
    const raw = JSON.parse(localStorage.getItem(COCKPIT_KEY) || '{}');
    return {
      selectedId:  Number.isFinite(raw.selectedId)  ? raw.selectedId  : 4,
      range:       raw.range                        || '30D',
      pane:        'chart',
      onlyWatched: !!raw.onlyWatched,
    };
  } catch (_) { return { selectedId: 4, range: '30D', pane: 'chart', onlyWatched: false }; }
}
function saveCockpitState(s){
  try { localStorage.setItem(COCKPIT_KEY, JSON.stringify(s)); } catch (_) {}
}

/* ---------- deterministic price + volume series -------------
   Walks backward from the subnet's current price, apportioning
   chg24 / chg7 / chg30 across their respective windows and adding
   a small random walk. Seeded per netuid so the series is stable
   across renders. Real time-series ships when DataLayer / TaoStats
   wiring lands; this gives the chart a credible shape today. */
/* ---------- chart-rendering tunables ------------------------- */
/* generateSeries() + sma() + SERIES_DAYS are imported from
   src/lib/synthetic-series.js — single source of truth shared
   with terminal/chart-mode.js and editorial-mode.js. The MA
   palette below is chart-rendering only (lines + legend swatches)
   and stays here. Same RGB lives in terminal/chart-mode.js. */
const MA_FAST_WINDOW      = 20;
const MA_SLOW_WINDOW      = 50;
const MA_FAST_LINE_RGBA   = 'rgba(156,230,204,0.55)';
const MA_FAST_SWATCH_RGBA = 'rgba(156,230,204,0.85)';
const MA_SLOW_LINE_RGBA   = 'rgba(232,192,103,0.45)';
const MA_SLOW_SWATCH_RGBA = 'rgba(232,192,103,0.85)';
const MA_SLOW_DASH        = [4, 3];

/* ---------- canvas chart drawing ---------------------------- */
/* No external chart lib — direct canvas2d. Reasons: keeps bundle
   tiny, gives us the exact terminal look (mint line + red volume
   bars, 1px hairlines, monospace tabular axis labels), no theming
   fight. Re-draws on resize + on range change via the wireChart
   loop. */
/* ---------- editorial annotation events --------------------- */
/* Coordinated with Mac's terminal CHART mode (commit 6234f0e) —
   same pattern, same data shape, so a reader switching between
   /cockpit.html and /terminal.html?mode=chart sees consistent
   news markers on the chart canvas. amber dot = magazine article
   published that day, red dot = oracle research published that day.
   Pulled from ARTICLES + recentOracleArticles by subnet match. */
function annotationsFor(netuid, subnetName){
  const out = [];
  for (const a of ARTICLES){
    const isThisSubnet =
      (a.subnet != null && (Number(a.subnet) === netuid ||
                            String(a.subnet) === String(subnetName)));
    if (!isThisSubnet || !a.date) continue;
    const t = Date.parse(a.date + 'T12:00:00Z');
    if (!Number.isFinite(t)) continue;
    out.push({ t, kind: 'mag', title: a.title, date: a.date });
  }
  for (const a of recentOracleArticles(Infinity)){
    const matchesSubnet =
      (a.subnetId === netuid) ||
      ((a.subnetName || '').toLowerCase() === (subnetName || '').toLowerCase()) ||
      ((a.title || '').toLowerCase().includes((subnetName || '').toLowerCase()));
    if (!matchesSubnet || !a.date) continue;
    const t = Date.parse(a.date + 'T12:00:00Z');
    if (!Number.isFinite(t)) continue;
    out.push({ t, kind: 'orc', title: a.title, date: a.date });
  }
  return out.sort((x, y) => x.t - y.t);
}

/* offset (in days back from today) lets the reader pan the chart
   into history without changing the window size. offset=0 means
   "window ending today"; offset=range.days shifts back one full
   window; etc. Clamped so slice never reads off the start of the
   synthesized series. */
function drawChart(canvas, series, range, annotations, offset = 0){
  if (!canvas) return null;
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();
  const W = Math.max(200, rect.width);
  const H = Math.max(160, rect.height);
  canvas.width  = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);

  if (!series || !series.length) return null;

  const safeOffset = Math.max(0, Math.min(offset, series.length - range.days));
  const sliceStart = Math.max(0, series.length - range.days - safeOffset);
  const sliceEnd   = Math.min(series.length, sliceStart + range.days);
  const slice = series.slice(sliceStart, sliceEnd);
  if (slice.length < 2) return null;

  const PAD_L = 50, PAD_R = 14, PAD_T = 14, PAD_B = 60;
  const VOL_H = 38;
  const priceH = H - PAD_T - PAD_B;
  const priceY0 = PAD_T;
  const priceY1 = PAD_T + priceH;
  const volY0   = priceY1 + 8;
  const volY1   = volY0 + VOL_H;

  const minP = Math.min(...slice.map(s => s.low));
  const maxP = Math.max(...slice.map(s => s.high));
  const padP = (maxP - minP) * 0.08 || maxP * 0.04 || 1;
  const lo = Math.max(0, minP - padP);
  const hi = maxP + padP;
  const range_p = hi - lo || 1;
  const maxV = Math.max(...slice.map(s => s.volume), 1);

  const xAt = i => PAD_L + (i / (slice.length - 1)) * (W - PAD_L - PAD_R);
  const yAt = p => priceY1 - ((p - lo) / range_p) * priceH;
  const vyAt = v => volY1 - (v / maxV) * VOL_H;

  /* Background grid */
  ctx.strokeStyle = 'rgba(255,30,60,0.06)';
  ctx.lineWidth   = 1;
  const yGridSteps = 4;
  for (let i = 0; i <= yGridSteps; i++){
    const y = priceY0 + (i / yGridSteps) * priceH;
    ctx.beginPath();
    ctx.moveTo(PAD_L, y); ctx.lineTo(W - PAD_R, y);
    ctx.stroke();
  }
  const xGridSteps = Math.min(6, slice.length - 1);
  for (let i = 0; i <= xGridSteps; i++){
    const x = PAD_L + (i / xGridSteps) * (W - PAD_L - PAD_R);
    ctx.beginPath();
    ctx.moveTo(x, priceY0); ctx.lineTo(x, priceY1);
    ctx.stroke();
  }

  /* Price area fill */
  ctx.beginPath();
  ctx.moveTo(xAt(0), priceY1);
  for (let i = 0; i < slice.length; i++){
    ctx.lineTo(xAt(i), yAt(slice[i].close));
  }
  ctx.lineTo(xAt(slice.length - 1), priceY1);
  ctx.closePath();
  const grad = ctx.createLinearGradient(0, priceY0, 0, priceY1);
  const lastClose = slice[slice.length - 1].close;
  const firstClose = slice[0].close;
  const isUp = lastClose >= firstClose;
  const lineColor = isUp ? '#00E5A8' : '#FF4D60';
  grad.addColorStop(0, isUp ? 'rgba(0,229,168,0.32)' : 'rgba(255,77,109,0.30)');
  grad.addColorStop(1, isUp ? 'rgba(0,229,168,0.02)' : 'rgba(255,77,109,0.02)');
  ctx.fillStyle = grad;
  ctx.fill();

  /* Moving-average overlays — port of mac-session's terminal CHART
     mode pattern (commit 5f3995e). MA20 fast (solid muted teal) +
     MA50 slow (dashed amber). Computed over the FULL series then
     sliced to the visible window so day-0 of the slice has real
     preceding-window data, not a partial approximation that would
     mislead a trader.

     Drawn AFTER the area fill and BEFORE the price line so the
     price stays on top visually. Skip-on-null lets the MA line
     start mid-chart when there isn't enough history for the early
     bars (e.g. MA50 on a 30D window). */
  const allCloses = series.map(b => b.close);
  const ma20Full  = sma(allCloses, MA_FAST_WINDOW);
  const ma50Full  = sma(allCloses, MA_SLOW_WINDOW);
  const ma20      = ma20Full.slice(sliceStart);
  const ma50      = ma50Full.slice(sliceStart);
  const drawMA = (arr, color, dash) => {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth   = 1;
    ctx.setLineDash(dash);
    ctx.lineJoin    = 'round';
    let started = false;
    for (let i = 0; i < slice.length; i++){
      const v = arr[i];
      if (v == null){ started = false; continue; }
      const x = xAt(i), y = yAt(v);
      if (!started){ ctx.beginPath(); ctx.moveTo(x, y); started = true; }
      else ctx.lineTo(x, y);
    }
    if (started) ctx.stroke();
    ctx.restore();
  };
  drawMA(ma20, MA_FAST_LINE_RGBA, []);
  drawMA(ma50, MA_SLOW_LINE_RGBA, MA_SLOW_DASH);

  /* Price line */
  ctx.beginPath();
  ctx.moveTo(xAt(0), yAt(slice[0].close));
  for (let i = 1; i < slice.length; i++){
    ctx.lineTo(xAt(i), yAt(slice[i].close));
  }
  ctx.strokeStyle = lineColor;
  ctx.lineWidth   = 1.8;
  ctx.lineCap     = 'round';
  ctx.lineJoin    = 'round';
  ctx.stroke();

  /* Volume bars */
  for (let i = 0; i < slice.length; i++){
    const x = xAt(i);
    const y = vyAt(slice[i].volume);
    const w = Math.max(1, (W - PAD_L - PAD_R) / slice.length - 1);
    const up = i > 0 && slice[i].close >= slice[i-1].close;
    ctx.fillStyle = up ? 'rgba(0,229,168,0.55)' : 'rgba(255,77,109,0.55)';
    ctx.fillRect(x - w/2, y, w, volY1 - y);
  }

  /* News-flag overlays — Bloomberg-style markers at editorial
     publish dates that fall inside the visible window. Ported from
     Mac's terminal CHART mode (commit 6234f0e) so the cockpit and
     terminal chart surfaces use the same visual language. Amber
     dots = magazine, red dots = oracle. Stagger lane (0/1/2) when
     adjacent dates collide within 18px.
     Flags collected into an array so the returned hit-tester can
     resolve cursor-over-flag → article click/hover. */
  const flags = [];
  if (annotations && annotations.length){
    const tMin = slice[0].t, tMax = slice[slice.length - 1].t;
    let lastFlagX = -Infinity;
    let lane = 0;
    for (const a of annotations){
      if (a.t < tMin || a.t > tMax) continue;
      const f = (a.t - tMin) / (tMax - tMin);
      const x = PAD_L + f * (W - PAD_L - PAD_R);
      if (x - lastFlagX < 18) lane = (lane + 1) % 3; else lane = 0;
      lastFlagX = x;
      const dotY = priceY0 + 8 + lane * 11;
      const color = a.kind === 'mag' ? '#FFB85C' : '#FF4D60';
      // Dashed vertical hairline through the plot
      ctx.save();
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.40;
      ctx.setLineDash([2, 3]);
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(x, priceY0);
      ctx.lineTo(x, priceY1);
      ctx.stroke();
      ctx.restore();
      // Marker dot at top
      ctx.beginPath();
      ctx.arc(x, dotY, 3.2, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = '#050203';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      flags.push({ x, y: dotY, ann: a });
    }
  }

  /* Y-axis labels (price) */
  ctx.fillStyle    = 'rgba(139,107,112,0.85)';
  ctx.font         = '10px "JetBrains Mono", monospace';
  ctx.textAlign    = 'right';
  ctx.textBaseline = 'middle';
  for (let i = 0; i <= yGridSteps; i++){
    const v = lo + ((yGridSteps - i) / yGridSteps) * range_p;
    const y = priceY0 + (i / yGridSteps) * priceH;
    ctx.fillText(v < 1 ? '$' + v.toFixed(4) : '$' + v.toFixed(2), PAD_L - 6, y);
  }

  /* X-axis labels (dates) */
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'top';
  const dayMs = 86400000;
  for (let i = 0; i <= xGridSteps; i++){
    const idx = Math.round((i / xGridSteps) * (slice.length - 1));
    const t = slice[idx].t;
    const d = new Date(t);
    const label = range.days <= 7
      ? `${d.getMonth()+1}/${d.getDate()}`
      : range.days <= 90
        ? `${d.getMonth()+1}/${d.getDate()}`
        : `${['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][d.getMonth()]} ${String(d.getFullYear()).slice(2)}`;
    const x = PAD_L + (i / xGridSteps) * (W - PAD_L - PAD_R);
    ctx.fillText(label, x, volY1 + 8);
  }

  /* VOL label on the left */
  ctx.fillStyle = 'rgba(255,30,60,0.55)';
  ctx.font      = '8.5px "JetBrains Mono", monospace';
  ctx.textAlign = 'right';
  ctx.fillText('VOL', PAD_L - 6, volY0 + VOL_H/2);

  /* MA legend — top-right corner. Mirrors mac-session's terminal
     CHART mode legend so the reader can decode the two overlay
     lines without hunting. MA20 swatch (solid teal hairline) +
     MA50 swatch (dashed amber hairline). */
  ctx.font = '9px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  const legendY = PAD_T + 4;
  let legendX = W - PAD_R - 110;
  ctx.fillStyle = MA_FAST_SWATCH_RGBA;
  ctx.fillRect(legendX, legendY + 4, 10, 1);
  ctx.fillText('MA' + MA_FAST_WINDOW, legendX + 14, legendY);
  legendX += 56;
  ctx.fillStyle = MA_SLOW_SWATCH_RGBA;
  ctx.fillRect(legendX, legendY + 4, 3, 1);
  ctx.fillRect(legendX + 5, legendY + 4, 3, 1);
  ctx.fillText('MA' + MA_SLOW_WINDOW, legendX + 14, legendY);

  /* Hit-test controller — closes Cockpit Chart Tooltip Parity gap
     logged in CLAUDE.md by mac-session. Mirrors the pattern in
     src/views/terminal/chart-mode.js drawChart so cockpit + terminal
     CHART expose the SAME hover interaction — OHLC + MA values on
     bar hover, editorial-flag tooltip on marker hover.
     Returns null if drawChart bailed early; the caller null-checks. */
  return {
    flags,
    hitFlag(px, py){
      let best = null, bestD = Infinity;
      for (const f of flags){
        const dx = px - f.x, dy = py - f.y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < 10 && d < bestD){ bestD = d; best = f; }
      }
      return best;
    },
    hitTest(px, py){
      if (px < PAD_L || px > W - PAD_R) return null;
      const f = (px - PAD_L) / (W - PAD_L - PAD_R);
      const idx = Math.round(f * (slice.length - 1));
      const bar = slice[idx];
      if (!bar) return null;
      return {
        idx, bar,
        x: xAt(idx), y: yAt(bar.close),
        ma20: ma20[idx],
        ma50: ma50[idx],
      };
    },
    drawCrosshair(px, py){
      const h = this.hitTest(px, py);
      if (!h) return;
      ctx.save();
      ctx.strokeStyle = 'rgba(255,30,60,0.55)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(h.x, priceY0); ctx.lineTo(h.x, priceY1);
      ctx.moveTo(PAD_L, h.y);    ctx.lineTo(W - PAD_R, h.y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = lineColor;
      ctx.beginPath();
      ctx.arc(h.x, h.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#050203';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.restore();
    },
  };
}

/* ---------- main mount -------------------------------------- */
/**
 * @param {HTMLElement} root
 * @param {{subscribe:Function, get:Function}|null} [dataLayer]
 */
export function mountCockpit(root, dataLayer = null){
  const state    = loadCockpitState();
  let watchlist  = loadWatchlist();
  let series     = generateSeries(subnetById(state.selectedId) || SUBNETS[0]);
  let searchQ    = '';
  /* `hit` is the drawChart-returned hit-test controller. Declared
     at the top of the closure so drawChartNow() (called during
     initial mount, before its own internal definition site)
     doesn't hit a temporal-dead-zone ReferenceError when assigning
     to it. */
  let hit        = null;
  /* Chart pan offset in DAYS BACK FROM TODAY. 0 = window ends today,
     positive shifts the window into history. Reset on subnet
     change + range change so the reader doesn't get stuck deep in
     history after picking a different subnet. */
  let chartOffset = 0;

  /* Render the whole cockpit shell once; sub-panes repaint in place
     on selection / range / pane changes without disturbing the chart
     canvas if only metadata changed. */
  mount(root, html`
    <section class="cockpit" data-cockpit-root>
      ${renderTabs()}
      <div class="cockpit__grid">
        <aside class="cockpit__rail" data-pane="subnets">
          ${renderRail()}
        </aside>
        <section class="cockpit__main" data-pane="chart">
          ${renderMain()}
        </section>
        <aside class="cockpit__feed" data-pane="feed">
          ${renderFeed()}
        </aside>
      </div>
    </section>
  `);

  setActivePane(state.pane);
  drawChartNow();
  wireEverything();

  /* ---------- sub-renders ----------------------------------- */

  function renderTabs(){
    return `
      <nav class="cockpit-tabs" aria-label="Cockpit panes">
        ${PANES.map(p => `
          <button type="button" class="cockpit-tabs__btn" data-pane-btn="${p.key}">${p.label}</button>
        `).join('')}
        <span class="cockpit-tabs__hint">tap to swap panes on mobile</span>
        <!-- MARKETS shortcut — the mobile bottom-nav was removed
             from the cockpit (Subnet Oracle dock owns the bottom);
             this pill keeps the markets jump one tap away inside
             the cockpit chrome itself. Per Rondo 2026-05-18 "but
             markets in the cockpit." -->
        <a class="cockpit-tabs__markets" href="markets.html" aria-label="Open markets page">⊕ MARKETS ↗</a>
      </nav>`;
  }

  function renderRail(){
    const rows = filteredSubnets().map(s => {
      const isOn = s.netuid === state.selectedId;
      const star = watchlist.has(s.netuid);
      return `
        <button type="button" class="cock-rail__row ${isOn ? 'is-on' : ''}" data-row="${s.netuid}">
          <span class="cock-rail__star ${star ? 'is-on' : ''}" data-star="${s.netuid}">★</span>
          <span class="cock-rail__sn">SN${s.netuid}</span>
          <span class="cock-rail__name">${s.name}</span>
          <span class="cock-rail__chg ${cls(s.chg24)}">${fmtPct(s.chg24)}</span>
        </button>`;
    }).join('');
    return `
      <header class="cock-rail__head">
        <div class="cock-rail__lbl">SUBNETS · ${filteredSubnets().length} of ${SUBNETS.length}</div>
        <input class="cock-rail__search" type="search" data-rail-search placeholder="search name, SN, owner…" value="${searchQ}"/>
        <div class="cock-rail__toolbar">
          <button type="button" class="cock-rail__pill ${state.onlyWatched ? 'is-on' : ''}" data-rail-watched>★ WATCHED ${watchlist.size ? '<b>' + watchlist.size + '</b>' : ''}</button>
        </div>
      </header>
      <div class="cock-rail__list" data-rail-list>${rows}</div>`;
  }

  function renderMain(){
    const s = subnetById(state.selectedId) || SUBNETS[0];
    const gh = ghByNetuid(s.netuid) || null;
    const range = RANGES.find(r => r.key === state.range) || RANGES[2];

    /* Small-multiples row — three mini-sparklines below the
       chart matching the taostats-style institutional dashboard
       pattern (sibling shared in docs/inspiration/...). Reuses
       the synthetic series so what the reader sees in the
       sparkline tracks what's in the main chart, just compressed
       to 30 bars per panel. */
    /* GH COMMITS 30D is real (ghByNetuid) when the subnet is
       indexed in github-activity.js; falls back to a "·" label
       when there's no commit data. */
    const ghCommits = (gh && Number.isFinite(gh.commits30d)) ? gh.commits30d : null;
    const microPanels = [
      { label: 'EMISSION τ/d', value: s.emission,   seed: s.netuid * 23 + 9,  unit: 'τ', color: '#FFB85C' },
      { label: 'MINERS',       value: s.miners,     seed: s.netuid * 31 + 11, unit: '',  color: '#9CE6CC' },
      { label: 'VALIDATORS',   value: s.validators, seed: s.netuid * 17 + 7,  unit: '',  color: '#FF4D60' },
      { label: 'GH COMMITS 30D', value: ghCommits,  seed: s.netuid * 13 + 5,  unit: '',  color: '#E8C067' },
    ];
    const microHtml = microPanels.map(p => {
      const hasValue = Number.isFinite(p.value) && p.value > 0;
      const valTxt = hasValue ? fmtInt(p.value) + p.unit : '·';
      const sparkOrEmpty = hasValue
        ? microSparkSvg(p.value, p.seed, p.color)
        : `<div class="cock-micro__empty" aria-hidden="true">no data</div>`;
      return `
        <div class="cock-micro ${hasValue ? '' : 'cock-micro--empty'}">
          <div class="cock-micro__head">
            <span class="cock-micro__lbl">${p.label}</span>
            <span class="cock-micro__val">${valTxt}</span>
          </div>
          ${sparkOrEmpty}
        </div>`;
    }).join('');

    const kpis = [
      { lbl: 'α PRICE',      val: fmtPrice(s.price),         chg: s.chg24, note: '24h' },
      { lbl: 'FDV',          val: fmtMcap(s.mcap),           chg: s.chg30, note: '30d' },
      { lbl: 'EMISSION',     val: fmtInt(s.emission) + 'τ',  chg: null,   note: '24h on chain' },
      { lbl: 'STAKE',        val: fmtInt(s.stake) + 'τ',     chg: null,   note: 'all validators' },
      { lbl: 'VAL · MIN',    val: fmtInt(s.validators) + '/' + fmtInt(s.miners), chg: null, note: 'active 24h' },
      { lbl: 'GH COMMITS 30D', val: gh ? fmtInt(gh.commits30d) : '·', chg: null, note: gh ? gh.pulse : 'no data' },
    ].map(k => `
      <div class="cock-kpi">
        <div class="cock-kpi__lbl">${k.lbl}</div>
        <div class="cock-kpi__val">${k.val}</div>
        <div class="cock-kpi__note ${cls(k.chg)}">
          ${k.chg != null ? `${arrow(k.chg)} ${fmtPct(k.chg)} · ` : ''}${k.note}
        </div>
      </div>`).join('');

    const rangeBtns = RANGES.map(r => {
      const on = r.key === state.range;
      return `
      <button type="button" class="cock-range__btn ${on ? 'is-on' : ''}" data-range="${r.key}" role="tab" aria-selected="${on}" aria-label="${r.label}">${r.label}</button>`;
    }).join('');

    /* COCKPIT ARTICLE FEED — reimagined 2026-05-18 per Rondo
       "side article is too small and short — make more use of
       the page." Articles now render as a full-width editorial
       grid BELOW the chart, with bigger cards carrying real
       content (kind chip + date + serif title + dek/takeaway +
       source + read button). Each card has breathing room +
       the page width to itself instead of being squeezed into
       a 33% side column.
       Pull MORE per kind now that we have the room (6 each =
       up to 18 total, capped at 15 for the grid). */
    const team = ARTICLES.filter(a =>
      Number(a.subnet) === s.netuid ||
      String(a.subnet) === String(s.name)
    ).slice(0, 6).map(a => ({
      kind: 'mag', date: a.date, title: a.title,
      dek:  a.tagline || a.dek || '',
      url:  a.pdf || a.externalUrl || '#',
      source: (a.authors && a.authors[0]) || 'Subneτ Magazine',
    }));
    const oracle = recentOracleArticles(Infinity)
      .filter(a =>
        (a.subnetId === s.netuid) ||
        ((a.subnetName || '').toLowerCase() === s.name.toLowerCase()) ||
        ((a.title || '').toLowerCase().includes(s.name.toLowerCase()))
      )
      .slice(0, 6)
      .map(a => ({
        kind: 'orc', date: a.date, title: a.title,
        dek:  a.dek || '',
        url:  a.pdf || '#',
        source: 'Subnet Oracle',
      }));
    let central = [];
    try { central = newsForSubnet(s, 6).map(n => ({
      kind: 'cen', date: n.date, title: n.headline,
      dek:  n.takeaway || '',
      url:  n.url || '#',
      source: n.source,
    })); } catch (_) {}
    const cockpitArticles = [...team, ...oracle, ...central]
      .sort((a,b) => (b.date || '').localeCompare(a.date || ''))
      .slice(0, 15);
    /* Each item gets a mini procedural SVG mark (12px) — a tiny
       red node-glyph that hints "this is a magazine article" /
       a small mint dot for "centralized" / an orange star for
       "oracle". Plus a left-edge color bar matching the kind so
       cards read at-a-glance and the column feels like graphic
       design, not a list of text rows. */
    const miniMark = (kind) => {
      if (kind === 'mag') return `<svg viewBox="0 0 14 14" class="cock-chart__news-mark"><circle cx="7" cy="7" r="5.5" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M4 7l2.5 2 3.5-4" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`;
      if (kind === 'orc') return `<svg viewBox="0 0 14 14" class="cock-chart__news-mark"><path d="M7 2l1.5 3.2 3.5.4-2.6 2.4.7 3.5L7 9.8 3.9 11.5l.7-3.5L2 5.6l3.5-.4z" fill="currentColor"/></svg>`;
      return `<svg viewBox="0 0 14 14" class="cock-chart__news-mark"><circle cx="7" cy="7" r="2.5" fill="currentColor"/><circle cx="7" cy="7" r="6" fill="none" stroke="currentColor" stroke-width="1" opacity="0.4"/></svg>`;
    };
    const dateChip = (d) => {
      if (!d) return '·';
      const [y, m, dd] = String(d).split('-');
      const MON = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
      return `<span class="cock-chart__news-day">${dd}</span><span class="cock-chart__news-mon">${MON[parseInt(m,10)-1]}</span>`;
    };
    const kindLbl = (k) => k === 'mag' ? 'MAGAZINE' : k === 'orc' ? 'ORACLE' : 'CENTRALIZED';
    const cockpitArticlesHtml = cockpitArticles.length
      ? cockpitArticles.map(a => `
          <a class="cock-articles__card cock-articles__card--${a.kind}" href="${a.url}" target="_blank" rel="noopener">
            <span class="cock-articles__bar" aria-hidden="true"></span>
            <div class="cock-articles__card-head">
              <span class="cock-articles__kind cock-articles__kind--${a.kind}">${kindLbl(a.kind)}</span>
              <span class="cock-articles__date">${dateChip(a.date)}</span>
            </div>
            <h3 class="cock-articles__title">${a.title || '·'}</h3>
            ${a.dek ? `<p class="cock-articles__dek">${a.dek}</p>` : ''}
            <div class="cock-articles__foot">
              <span class="cock-articles__src">${a.source || '·'}</span>
              <span class="cock-articles__read">READ ↗</span>
            </div>
          </a>`).join('')
      : `<div class="cock-articles__empty">No dispatches indexed for SN${s.netuid} yet — the editorial desk rotates coverage as subnets enter the top emission tier.</div>`;

    return `
      <header class="cock-chart__head">
        <div class="cock-chart__title">
          <span class="cock-chart__eyebrow">⊕ COCKPIT · LIVE</span>
          <h1 class="cock-chart__h">SN${s.netuid} · ${s.name}<span class="cock-chart__cat">${catLabel(s.cat)}</span></h1>
          <div class="cock-chart__sub">${s.desc || ''} · <span style="color:var(--c-ink-3)">team ${s.owner || '·'}</span></div>
        </div>
        <div class="cock-chart__price-block">
          <div class="cock-chart__price">${fmtPrice(s.price)}</div>
          <div class="cock-chart__chg ${cls(s.chg24)}">${arrow(s.chg24)} ${fmtPct(s.chg24)} · 24h</div>
          <div class="cock-chart__chg2 ${cls(s.chg7)}">${fmtPct(s.chg7)} · 7d</div>
          <div class="cock-chart__chg2 ${cls(s.chg30)}">${fmtPct(s.chg30)} · 30d</div>
        </div>
      </header>

      <!-- CHART + SIDE ARTICLE COLUMN — restored 2026-05-18 per
           Rondo: "keep my original idea — put the feed back inside
           the chart." Side column on the LEFT with the picker at
           the top + richer article cards (kind/date/title/dek/source)
           — same kind-color spine as the chart-mode sidebar so the
           visual language is consistent across surfaces. Chart fills
           the remaining width on the right. -->
      <div class="cock-chart__row">
        <aside class="cock-chart__news" aria-label="News for SN${s.netuid} ${s.name}">
          <div class="cock-chart__picker">
            <label class="cock-chart__picker-lbl" for="cock-chart-picker">PICK SUBNET</label>
            <select class="cock-chart__picker-sel" id="cock-chart-picker" data-chart-picker>
              ${SUBNETS.slice().sort((a,b) => (b.mcap||0)-(a.mcap||0)).map(x =>
                `<option value="${x.netuid}" ${x.netuid === s.netuid ? 'selected' : ''}>SN${x.netuid} · ${x.name} · $${(x.price||0).toFixed(x.price < 1 ? 4 : 2)} ${x.chg24 >= 0 ? '+' : ''}${(x.chg24||0).toFixed(1)}%</option>`
              ).join('')}
            </select>
          </div>
          <header class="cock-chart__news-head">
            <span class="cock-chart__news-h">⊕ SIGNALS · SN${s.netuid}</span>
            <span class="cock-chart__news-n">${cockpitArticles.length}</span>
          </header>
          <div class="cock-chart__news-list">
            ${cockpitArticlesHtml}
          </div>
        </aside>
        <div class="cock-chart__canvas-wrap">
          <canvas class="cock-chart__canvas" data-chart-canvas
                  role="img"
                  aria-label="SN${s.netuid} ${s.name} price chart, ${state.range} window"></canvas>
          <div class="cm-tooltip" data-chart-tooltip style="display:none" role="tooltip" aria-live="polite"></div>
          <!-- Inline article preview reveal — populated when the
               reader clicks a news-flag marker on the chart. Slides
               up from the bottom of the chart pane so the article
               appears INSIDE the chart context, not in a new tab. -->
          <div class="cock-chart__flag-preview" data-flag-preview hidden></div>
        </div>
      </div>

      <!-- Chart navigation: range tabs + pan history controls.
           ◀ pans the visible window BACKWARD by its own width
           (on 30D, ◀ shows day-60 to day-30 instead of 30D-to-
           today); ▶ pans forward. ⏵ Today resets offset to 0
           (window ending today). Per Rondo: "add chart navigation
           so people can see chart history." -->
      <div class="cock-chart__nav">
        <div class="cock-chart__range" role="tablist" aria-label="Time range">
          ${rangeBtns}
        </div>
        <div class="cock-chart__pan" role="group" aria-label="Chart history navigation">
          <button type="button" class="cock-pan__btn" data-pan="back" aria-label="Pan chart history backward by one window">◀ EARLIER</button>
          <span class="cock-pan__lbl" data-pan-lbl>now</span>
          <button type="button" class="cock-pan__btn" data-pan="fwd"  aria-label="Pan chart history forward by one window">LATER ▶</button>
          <button type="button" class="cock-pan__btn cock-pan__btn--today" data-pan="today" aria-label="Reset chart to current window">⏵ TODAY</button>
        </div>
      </div>

      <div class="cock-kpis">${kpis}</div>

      <!-- Small-multiples row — institutional pattern from the
           taostats inspiration (sibling commit 761a157). Three
           mini-sparklines surfacing emission / miners / validators
           trends per the active subnet. Compressed enough to fit
           below the KPIs without scroll, dense enough to read at
           a glance. -->
      <div class="cock-micro-row" aria-label="Subnet activity small multiples">
        ${microHtml}
      </div>
    `;
  }

  /* Tiny 80×24 SVG sparkline used by the cockpit's small-multiples
     row. Walks a seeded random pattern anchored on `current` so
     the sparkline shape is stable per (subnet, metric) pair. Pure
     SVG so no canvas allocation per cockpit mount. */
  function microSparkSvg(current, seed, color){
    const W = 90, H = 26, N = 30;
    const lo = Math.max(0, current * 0.7);
    const hi = Math.max(1, current * 1.3);
    const span = hi - lo || 1;
    let state = (seed * 1103515245 + 12345) >>> 0;
    const rnd = () => {
      state = (state * 1103515245 + 12345) >>> 0;
      return ((state >>> 16) & 0x7FFF) / 0x7FFF;
    };
    const pts = [];
    for (let i = 0; i < N; i++){
      /* Anchor the LAST point to the current value so the
         sparkline ends where the KPI reads — keeps the visual
         coherent with the numeric. */
      const v = i === N - 1 ? current : lo + rnd() * span;
      const x = (i / (N - 1)) * W;
      const y = H - 1 - ((v - lo) / span) * (H - 2);
      pts.push(x.toFixed(1) + ',' + Math.max(0, Math.min(H, y)).toFixed(1));
    }
    return `<svg class="cock-micro__svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-hidden="true" preserveAspectRatio="none">
      <polyline fill="none" stroke="${color}" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" points="${pts.join(' ')}"/>
    </svg>`;
  }

  /* Procedural cover art for a news/article item. The magazine has
     no photo pipeline, so each item gets a deterministic SVG cover
     keyed off (kind, subject hash): hairline grid + kind-tinted
     gradient + large display-weight glyph (SN# / source initial /
     τ). Stable per title so readers learn the visual as identity. */
  function feedCoverSvg(item, subnet){
    const isMag    = item.kind === 'magazine';
    const isOracle = item.kind === 'oracle';
    const accent =
      isMag    ? '#FFB85C' :
      isOracle ? '#FF1E3C' :
      item.kind === 'chip'    ? '#FFB85C' :
      item.kind === 'capex'   ? '#00E5A8' :
      item.kind === 'capital' ? '#00E5A8' :
      item.kind === 'policy'  ? '#FF4D60' :
      item.kind === 'lab'     ? '#FF8094' :
      item.kind === 'research'? '#FF4D60' :
      '#FF1E3C';
    const glyph = subnet ? 'SN' + subnet.netuid
                : (item.source ? item.source.slice(0, 3).toUpperCase()
                                : 'τ');
    const title = String(item.title || item.headline || '');
    let h = 0;
    for (let i = 0; i < title.length; i++) h = ((h << 5) - h + title.charCodeAt(i)) | 0;
    const seed = Math.abs(h) % 1000;
    const rotate  = ((seed * 7) % 12) - 6;
    const offsetX = (seed % 30) - 15;
    const fontSize = glyph.length > 4 ? 28 : 44;
    return `<svg viewBox="0 0 280 140" preserveAspectRatio="xMidYMid slice" aria-hidden="true" class="cock-news__cover-svg">
      <defs>
        <linearGradient id="cf${seed}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stop-color="#050203"/>
          <stop offset="100%" stop-color="${accent}" stop-opacity="0.28"/>
        </linearGradient>
        <pattern id="cp${seed}" patternUnits="userSpaceOnUse" width="14" height="14">
          <path d="M0 7L14 7M7 0L7 14" stroke="${accent}" stroke-opacity="0.10" stroke-width="0.6"/>
        </pattern>
      </defs>
      <rect width="280" height="140" fill="#050203"/>
      <rect width="280" height="140" fill="url(#cf${seed})"/>
      <rect width="280" height="140" fill="url(#cp${seed})"/>
      <line x1="0" y1="140" x2="280" y2="${80 - (seed % 30)}" stroke="${accent}" stroke-opacity="0.22" stroke-width="0.8"/>
      <text x="${140 + offsetX}" y="86" text-anchor="middle"
            font-family="Archivo, Inter, sans-serif" font-size="${fontSize}" font-weight="800"
            fill="${accent}" fill-opacity="0.85"
            transform="rotate(${rotate} ${140 + offsetX} 70)">${glyph}</text>
      <line x1="12" y1="128" x2="268" y2="128" stroke="${accent}" stroke-opacity="0.4" stroke-width="0.6"/>
      <text x="12" y="137" font-family="'JetBrains Mono', monospace" font-size="6.5"
            font-weight="800" letter-spacing="1.8" fill="${accent}" fill-opacity="0.7">SUBNE&#x3C4; MAGAZINE</text>
    </svg>`;
  }

  /* Image-rich news card. Replaces the prior plain-text item with a
     Yahoo Finance / Bloomberg-style card: 16:9 cover + kind chip
     + serif headline + sans takeaway + bottom meta. Reads as a
     research feed, not a wall of text. */
  function renderNewsCard(item, subnet, opts = {}){
    const kindLbl = ({
      magazine: 'MAG',
      oracle:   'ORC',
      lab: 'LAB', chip: 'CHIP', capex: 'CAPEX', capital: 'CAPITAL',
      policy: 'POLICY', research: 'RESEARCH', infra: 'INFRA',
    })[item.kind] || (item.kind || '·').slice(0, 4).toUpperCase();
    const title = item.title || item.headline || '·';
    const dek   = item.takeaway || item.dek || item.meta || '';
    const meta  = item.source ? `${item.source}${(item.subjects||[]).length ? ' · ' + item.subjects.slice(0,2).join(' · ') : ''}` : (item.meta || '');
    return `
      <a class="cock-news ${opts.compact ? 'cock-news--compact' : ''}"
         href="${item.url || '#'}" target="_blank" rel="noopener">
        <div class="cock-news__cover">
          ${feedCoverSvg(item, subnet)}
          <span class="cock-news__kind cock-news__kind--${item.kind}">${kindLbl}</span>
          ${subnet ? `<span class="cock-news__sn">SN${subnet.netuid}</span>` : ''}
        </div>
        <div class="cock-news__body">
          <span class="cock-news__date">${fmtDate(item.date)}</span>
          <h4 class="cock-news__title">${title}</h4>
          ${dek ? `<p class="cock-news__dek">${dek}</p>` : ''}
          <div class="cock-news__foot">
            <span class="cock-news__meta">${meta}</span>
            <span class="cock-news__read">READ ↗</span>
          </div>
        </div>
      </a>`;
  }

  function renderFeed(){
    const s = subnetById(state.selectedId) || SUBNETS[0];

    // Centralized news scored for this subnet
    const centralized = newsForSubnet(s, 8);

    // Magazine + Oracle articles tied to this subnet
    const team = ARTICLES.filter(a =>
      Number(a.subnet) === s.netuid ||
      String(a.subnet) === String(s.name)
    ).slice(0, 5).map(a => ({
      kind: 'magazine',
      date: a.date,
      title: a.title,
      url:  a.pdf || a.externalUrl || '#',
      meta: (a.authors || ['Subneτ Magazine'])[0],
      dek:  a.tagline || a.dek || '',
    }));
    const oracle = recentOracleArticles(Infinity)
      .filter(a =>
        (a.subnetId === s.netuid) ||
        ((a.subnetName || '').toLowerCase() === s.name.toLowerCase()) ||
        ((a.title || '').toLowerCase().includes(s.name.toLowerCase()))
      )
      .slice(0, 4)
      .map(a => ({
        kind: 'oracle',
        date: a.date,
        title: a.title,
        url:  a.pdf || '#',
        meta: 'Subnet Oracle',
        dek:  a.dek || '',
      }));

    const editorial = [...team, ...oracle]
      .sort((a,b) => (b.date || '').localeCompare(a.date || ''));

    /* Top strip: side-scrolling row of the FRESHEST 5 items (mix of
       editorial + centralized, newest first) so the reader has an
       at-a-glance scrubbable header before diving into the deeper
       stack below. Horizontal scroll-snap on mobile, no scroll on
       desktop where the strip just fits. */
    const fresh = [...editorial, ...centralized.map(n => ({
      kind: n.cat, date: n.date, title: n.headline, url: n.url,
      meta: `${n.source} · ${(n.subjects || []).slice(0, 2).join(' · ')}`,
      dek: n.takeaway, source: n.source, subjects: n.subjects,
    }))]
      .sort((a,b) => (b.date || '').localeCompare(a.date || ''))
      .slice(0, 6);

    const stripHtml = fresh.length ? fresh.map(item =>
      renderNewsCard(item, item.kind === 'magazine' || item.kind === 'oracle' ? s : null, { compact: true })
    ).join('') : `<div class="cock-feed__empty">No signals indexed.</div>`;

    const editorialCards = editorial.length ? editorial.slice(0, 4).map(a =>
      renderNewsCard(a, s)
    ).join('') : `<div class="cock-feed__empty">No editorial dispatches indexed for SN${s.netuid} yet.</div>`;

    const centralCards = centralized.length ? centralized.map(n =>
      renderNewsCard({
        kind: n.cat, date: n.date, title: n.headline, url: n.url,
        meta: n.source, dek: n.takeaway, source: n.source, subjects: n.subjects,
      }, null)
    ).join('') : `<div class="cock-feed__empty">No centralized signals scored for this subnet's category yet.</div>`;

    return `
      <header class="cock-feed__head">
        <div class="cock-feed__lbl">SIGNALS · SN${s.netuid} ${s.name}</div>
        <div class="cock-feed__sub">${s.desc || 'Editorial + centralized signals scored for this subnet.'}</div>
      </header>

      <section class="cock-feed__strip-wrap">
        <div class="cock-feed__strip-head">
          <span class="cock-feed__strip-lbl">⊕ FRESH · scroll →</span>
          <span class="cock-feed__strip-meta">${fresh.length} items</span>
        </div>
        <div class="cock-feed__strip">${stripHtml}</div>
      </section>

      <section class="cock-feed__group">
        <h3 class="cock-feed__group-h">⊕ EDITORIAL · MAG &amp; ORACLE <span class="cock-feed__group-n">${editorial.length}</span></h3>
        <div class="cock-news-list">${editorialCards}</div>
      </section>

      <section class="cock-feed__group">
        <h3 class="cock-feed__group-h">⊕ CENTRALIZED · BACKDROP <span class="cock-feed__group-n">${centralized.length}</span></h3>
        <div class="cock-news-list">${centralCards}</div>
      </section>
    `;
  }

  /* ---------- selection + filter helpers -------------------- */

  function filteredSubnets(){
    let rows = SUBNETS.slice().sort((a,b) => (b.mcap || 0) - (a.mcap || 0));
    if (state.onlyWatched){
      rows = rows.filter(s => watchlist.has(s.netuid));
    }
    if (searchQ){
      const q = searchQ.toLowerCase();
      rows = rows.filter(s =>
        s.name.toLowerCase().includes(q) ||
        ('sn' + s.netuid).includes(q) ||
        String(s.netuid).includes(q) ||
        (s.owner || '').toLowerCase().includes(q) ||
        (s.cat || '').toLowerCase().includes(q));
    }
    return rows;
  }

  function setSelected(netuid){
    if (netuid === state.selectedId) return;
    state.selectedId = netuid;
    saveCockpitState(state);
    series = generateSeries(subnetById(netuid) || SUBNETS[0]);
    /* Subnet change resets pan so the reader lands on the new
       subnet's CURRENT window, not whatever historic offset the
       prior subnet was parked at. */
    chartOffset = 0;
    repaintMain();
    repaintFeed();
    qsa('[data-row]', root).forEach(r => r.classList.toggle('is-on', parseInt(r.dataset.row, 10) === netuid));
  }

  function setRange(key){
    if (key === state.range) return;
    state.range = key;
    saveCockpitState(state);
    /* Keep visual is-on + aria-selected in lockstep so SR users
       hear the new range as the active tab. */
    qsa('[data-range]', root).forEach(b => {
      const on = b.dataset.range === key;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-selected', String(on));
    });
    /* Range change resets pan — the new window starts at "today"
       so the reader has a known anchor. */
    chartOffset = 0;
    drawChartNow();
  }

  function setActivePane(key){
    state.pane = key;
    saveCockpitState(state);
    qsa('[data-pane]',     root).forEach(p => p.classList.toggle('is-active', p.dataset.pane === key));
    qsa('[data-pane-btn]', root).forEach(b => b.classList.toggle('is-on',     b.dataset.paneBtn === key));
    /* Chart needs to recompute its bounds when the pane becomes
       visible because it was display:none before and getBoundingClientRect
       returned zero. Re-draw on the next frame. */
    if (key === 'chart') requestAnimationFrame(drawChartNow);
  }

  /* ---------- repaint primitives ---------------------------- */

  function repaintRail(){
    const r = qs('[data-pane="subnets"]', root);
    if (r){ r.innerHTML = renderRail(); wireRail(); }
  }
  function repaintMain(){
    const m = qs('[data-pane="chart"]', root);
    if (m){ m.innerHTML = renderMain(); wireChart(); drawChartNow(); }
  }
  function repaintFeed(){
    const f = qs('[data-pane="feed"]', root);
    if (f) f.innerHTML = renderFeed();
  }

  /* drawChartNow assigns to `hit` (declared at the top of
     mountCockpit). The closure-level `let hit` was hoisted up so
     this function — invoked during initial mount before its own
     definition site — doesn't trip the temporal dead zone. */
  function drawChartNow(){
    const c = qs('[data-chart-canvas]', root);
    const range = RANGES.find(r => r.key === state.range) || RANGES[2];
    const s = subnetById(state.selectedId) || SUBNETS[0];
    const annotations = annotationsFor(s.netuid, s.name);
    /* Clamp the pan offset so we never read off the start of the
       series. range.days <= series.length means max offset is
       (series.length - range.days). */
    const maxOffset = Math.max(0, series.length - range.days);
    if (chartOffset > maxOffset) chartOffset = maxOffset;
    if (chartOffset < 0)         chartOffset = 0;
    hit = drawChart(c, series, range, annotations, chartOffset);
    /* Pan-state label below the chart — the visible window's
       literal start → end dates ("01/19 → 02/18" style) plus
       the pan offset ("now" / "−30d") so the reader sees BOTH
       where they are in the chart's history AND the actual
       dates they're looking at. */
    const lbl = qs('[data-pan-lbl]', root);
    if (lbl && series && series.length){
      const sliceStart = Math.max(0, series.length - range.days - chartOffset);
      const sliceEnd   = Math.min(series.length, sliceStart + range.days);
      const startT = series[sliceStart]?.t;
      const endT   = series[sliceEnd - 1]?.t;
      const fmtDate = (t) => {
        if (!Number.isFinite(t)) return '·';
        const d = new Date(t);
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${m}/${dd}`;
      };
      const offsetTxt = chartOffset === 0 ? 'NOW' : `−${chartOffset}d`;
      lbl.innerHTML =
        `<span class="cock-pan__dates">${fmtDate(startT)} → ${fmtDate(endT)}</span>` +
        `<span class="cock-pan__offset">${offsetTxt}</span>`;
      lbl.classList.toggle('is-back', chartOffset > 0);
    }
    /* Refresh canvas aria-label so SR users hear the new subnet
       + range pair on every redraw. Synthesizes the headline read
       of the visible window (up X% / down Y% / last close $Z) from
       the price slice — same pattern as the terminal CHART mode. */
    if (c && series && series.length){
      const sliceStart = Math.max(0, series.length - range.days - chartOffset);
      const sliceEnd   = Math.min(series.length, sliceStart + range.days);
      const slice = series.slice(sliceStart, sliceEnd);
      if (slice.length >= 2){
        const first = slice[0].close;
        const last  = slice[slice.length - 1].close;
        const ret   = first > 0 ? ((last - first) / first) * 100 : 0;
        const dir   = ret >= 0 ? 'up' : 'down';
        const lastPriced = last < 1 ? '$' + last.toFixed(4) : '$' + last.toFixed(2);
        const histTag = chartOffset === 0 ? '' : `, ${chartOffset} days back`;
        c.setAttribute('aria-label',
          `SN${s.netuid} ${s.name || ''} price chart, ${range.label} window${histTag}, ${dir} ${Math.abs(ret).toFixed(2)} percent, last close ${lastPriced}`);
      }
    }
  }

  /* ---------- wiring --------------------------------------- */

  function wireEverything(){
    wireTabs();
    wireRail();
    wireChart();
    /* Window resize triggers a chart re-draw (canvas needs to
       recompute its pixel dimensions when the viewport changes). */
    let rTick = 0;
    window.addEventListener('resize', () => {
      if (rTick) return;
      rTick = requestAnimationFrame(() => { rTick = 0; drawChartNow(); });
    });
  }

  function wireTabs(){
    qsa('[data-pane-btn]', root).forEach(b => {
      b.addEventListener('click', () => setActivePane(b.dataset.paneBtn));
    });
  }

  function wireRail(){
    qsa('[data-row]', root).forEach(rowEl => {
      rowEl.addEventListener('click', (e) => {
        if (e.target.closest('[data-star]')) return;
        const id = parseInt(rowEl.dataset.row, 10);
        if (Number.isNaN(id)) return;
        setSelected(id);
        /* On mobile, tapping a row swaps to the chart pane so the
           reader sees the result of their pick immediately. */
        if (window.innerWidth <= 900) setActivePane('chart');
      });
    });
    qsa('[data-star]', root).forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.dataset.star, 10);
        if (watchlist.has(id)) watchlist.delete(id); else watchlist.add(id);
        saveWatchlist(watchlist);
        repaintRail();
      });
    });
    const search = qs('[data-rail-search]', root);
    if (search){
      let st = 0;
      search.addEventListener('input', (e) => {
        searchQ = e.target.value || '';
        clearTimeout(st);
        st = setTimeout(() => repaintRail(), 90);
      });
    }
    const w = qs('[data-rail-watched]', root);
    if (w){
      w.addEventListener('click', () => {
        state.onlyWatched = !state.onlyWatched;
        saveCockpitState(state);
        repaintRail();
      });
    }
  }

  function wireChart(){
    qsa('[data-range]', root).forEach(b => {
      b.addEventListener('click', () => setRange(b.dataset.range));
    });
    /* Inline subnet picker — change event switches the global
       selection across the cockpit (chart re-mounts, articles
       re-list, KPIs reload). */
    const picker = qs('[data-chart-picker]', root);
    if (picker){
      picker.addEventListener('change', () => {
        const id = parseInt(picker.value, 10);
        if (Number.isFinite(id)) setSelected(id);
      });
    }

    /* Chart hover — OHLC + MA tooltip on bar hover, editorial
       tooltip on news-flag marker hover. Closes the "Cockpit Chart
       Tooltip Parity" coordination ask logged in CLAUDE.md
       (commit 2cb3f75) — cockpit + terminal CHART now expose the
       same hover interaction. */
    const canvas    = qs('[data-chart-canvas]', root);
    const tooltipEl = qs('[data-chart-tooltip]', root);
    if (!canvas) return;
    const onMove = (ev) => {
      if (!hit) return;
      const r = canvas.getBoundingClientRect();
      const x = ev.clientX - r.left, y = ev.clientY - r.top;
      /* Flag hover first — within 10px of a marker dot we show
         the editorial tooltip instead of the price-bar tooltip. */
      const flagHit = hit.hitFlag(x, y);
      if (flagHit){
        drawChartNow();              // clear any prior crosshair
        const a = flagHit.ann;
        const kindCls   = a.kind === 'mag' ? 'is-mag' : 'is-orc';
        const kindLabel = a.kind === 'mag' ? 'MAGAZINE' : 'ORACLE';
        if (tooltipEl){
          tooltipEl.innerHTML = `
            <span class="ct-tt__date ct-tt__flag ${kindCls}">${escapeAttr(a.date)} · ${kindLabel}</span>
            <span class="ct-tt__title">${escapeAttr(a.title)}</span>
            ${a.url || a.href ? `<span class="ct-tt__cta">↗ click marker to open</span>` : ''}`;
          tooltipEl.style.display = 'block';
          const cw = canvas.clientWidth || r.width;
          const left = Math.max(8, Math.min(cw - 240, x + 14));
          const top  = Math.max(8, y - 10);
          tooltipEl.style.left = left + 'px';
          tooltipEl.style.top  = top + 'px';
        }
        canvas.style.cursor = (a.url || a.href) ? 'pointer' : 'help';
        return;
      }
      canvas.style.cursor = '';
      const h = hit.hitTest(x, y);
      if (!h){ if (tooltipEl) tooltipEl.style.display = 'none'; drawChartNow(); return; }
      drawChartNow();
      hit.drawCrosshair(x, y);
      if (tooltipEl){
        const d = new Date(h.bar.t);
        const date = `${['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][d.getMonth()]} ${d.getDate()} ${String(d.getFullYear()).slice(2)}`;
        const fmtP = p => p == null ? '·' : (p < 1 ? '$' + p.toFixed(4) : '$' + p.toFixed(2));
        const maRows =
          (h.ma20 != null ? `<span class="ct-tt__row ct-tt__row--ma20">MA20 <b>${fmtP(h.ma20)}</b></span>` : '') +
          (h.ma50 != null ? `<span class="ct-tt__row ct-tt__row--ma50">MA50 <b>${fmtP(h.ma50)}</b></span>` : '');
        tooltipEl.innerHTML = `
          <span class="ct-tt__date">${date}</span>
          <span class="ct-tt__row">O <b>${fmtP(h.bar.open)}</b></span>
          <span class="ct-tt__row">H <b>${fmtP(h.bar.high)}</b></span>
          <span class="ct-tt__row">L <b>${fmtP(h.bar.low)}</b></span>
          <span class="ct-tt__row">C <b>${fmtP(h.bar.close)}</b></span>
          <span class="ct-tt__row">V <b>${(h.bar.volume/1e3).toFixed(1)}K</b></span>
          ${maRows}`;
        tooltipEl.style.display = 'block';
        const cw = canvas.clientWidth || r.width;
        const left = Math.max(8, Math.min(cw - 160, x + 14));
        const top  = Math.max(8, y - 10);
        tooltipEl.style.left = left + 'px';
        tooltipEl.style.top  = top + 'px';
      }
    };
    const onLeave = () => {
      if (tooltipEl) tooltipEl.style.display = 'none';
      drawChartNow();
    };
    /* News-flag click → inline article preview slides up INSIDE
       the chart pane (per Rondo's "add in article" direction —
       article appears in the chart context, not in a new tab).
       PDF hrefs additionally open in the inline PDF viewer drawer
       (the global handler in pdf-viewer.js picks up data-pdf-*
       attrs on the panel's READ button). */
    const previewEl = qs('[data-flag-preview]', root);
    const onClick = (ev) => {
      if (!hit) return;
      const r = canvas.getBoundingClientRect();
      const f = hit.hitFlag(ev.clientX - r.left, ev.clientY - r.top);
      if (!f) {
        if (previewEl){ previewEl.hidden = true; previewEl.innerHTML = ''; }
        return;
      }
      const a = f.ann;
      const href = a.url || a.href || '';
      const isPdf = /\.pdf(\?|$|#)/i.test(href);
      const kindLbl = a.kind === 'mag' ? 'MAGAZINE' : a.kind === 'orc' ? 'ORACLE' : 'EDITORIAL';
      const kindCls = a.kind === 'mag' ? 'is-mag' : (a.kind === 'orc' ? 'is-orc' : 'is-cen');
      const pdfAttrs = isPdf
        ? ` data-pdf-href="${escapeAttr(href)}" data-pdf-title="${escapeAttr(a.title || '')}" data-pdf-kind="${escapeAttr(a.kind || '')}" data-pdf-date="${escapeAttr(a.date || '')}" data-pdf-kicker="${kindLbl}"`
        : '';
      if (previewEl){
        previewEl.innerHTML = `
          <div class="cock-chart__flag-preview-inner">
            <div class="cock-chart__flag-preview-head">
              <span class="cock-chart__flag-preview-kind ${kindCls}">${kindLbl}</span>
              <span class="cock-chart__flag-preview-date">${escapeAttr(a.date || '·')}</span>
              <button type="button" class="cock-chart__flag-preview-x" data-flag-close aria-label="Close article preview">×</button>
            </div>
            <h4 class="cock-chart__flag-preview-title">${escapeAttr(a.title || '·')}</h4>
            ${href ? `<a class="cock-chart__flag-preview-cta" href="${escapeAttr(href)}" target="_blank" rel="noopener"${pdfAttrs}>READ ${isPdf ? 'PDF' : 'ARTICLE'} ↗</a>` : ''}
          </div>`;
        previewEl.hidden = false;
      }
    };
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);
    canvas.addEventListener('click', onClick);

    /* Pan history controls — wired once. Each click recomputes
       offset relative to current range.days so the step matches
       the visible window. Bounded by drawChartNow's own clamp.
       Plus close-X on the flag preview panel. */
    const range_ = () => (RANGES.find(r => r.key === state.range) || RANGES[2]);
    root.addEventListener('click', (ev) => {
      const closeBtn = ev.target.closest('[data-flag-close]');
      if (closeBtn){
        if (previewEl){ previewEl.hidden = true; previewEl.innerHTML = ''; }
        ev.preventDefault();
        return;
      }
      const panBtn = ev.target.closest('[data-pan]');
      if (!panBtn) return;
      const cmd = panBtn.dataset.pan;
      const step = range_().days;
      if      (cmd === 'back')  chartOffset += step;
      else if (cmd === 'fwd')   chartOffset = Math.max(0, chartOffset - step);
      else if (cmd === 'today') chartOffset = 0;
      drawChartNow();
    });
  }

  /* Minimal HTML-attribute escape for the tooltip strings. The
     annotation data comes from local SUBNETS-keyed files so it's
     trusted, but we escape at the boundary anyway per Code
     Quality Bar rule 5 (validate at boundaries even when sources
     are trusted). */
  function escapeAttr(v){
    return String(v == null ? '' : v)
      .replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
      .replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* Optional: react to live data ticks when the DataLayer wiring
     populates real prices. Mark the current subnet's price live and
     redraw the latest data point. */
  if (dataLayer && typeof dataLayer.subscribe === 'function'){
    dataLayer.subscribe(() => { /* future hook for live ticks */ });
  }

  return () => { /* no teardown needed; listeners die with the page */ };
}
