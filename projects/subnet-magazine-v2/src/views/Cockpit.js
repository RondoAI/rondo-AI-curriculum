/* =================================================================
   SUBNET MAGAZINE, COCKPIT VIEW
   -----------------------------------------------------------------
   Per Rondo 2026-05-20 ("perfect the cockpit. follow the example
   100%") the cockpit is one workspace built around the CMC-pattern
   interactive chart.

     1. ONE INTERACTIVE CHART (centerpiece)
          Mode chips:  [ SN<n> <name> ]   [ PORTFOLIO $<total> ]
          Square "+" add-position button (icon only)
          Range tabs:  1D · 7D · 30D · 90D · 1Y
          Live α price OR aggregate paper-portfolio value, same
          canvas, swap with one tap (state in localStorage).

     2. CHART SIDEBAR (right rail on desktop, stacks below the
        chart on mobile). Sections, top to bottom:
          ⊕ SIGNALS · SN<n>     Subneτ Magazine + Subnet Oracle +
                                centralized cards scored to the
                                active subnet. Compact rows: kind
                                chip + date + serif title + source.
                                All three editorial kinds carry
                                through here — they are the editorial
                                voice of the magazine on this chart.
          ⊕ NETWORK VITALS       TAO/USD ±%, MCAP, BLK, STAKED %,
                                EMIT τ/d, SUBNETS count. Live via
                                tao:market + tao:chain channels.
          ⊕ TODAY'S MOVERS       Top 3 ↑ / bottom 3 ↓ across SUBNETS
                                by 24h. Clickable rows retarget the
                                chart to that subnet.

     3. HOLDINGS TABLE BELOW
          Holdings / Allocation tabs (Allocation is a future-pass
          placeholder per the CMC spec).
          Asset · Qty · Entry · Current · Value · % Book · P&L
          (row-tap retargets chart + flips mode back to SUBNET).
          TOTAL BOOK row at the foot.

   Data:
     SUBNETS           src/data/subnets.js          128-subnet roster
     ORACLE_ARTICLES   src/data/oracle-articles.js  Oracle research
     ARTICLES          src/data/articles.js         Magazine articles
     CENTRALIZED_NEWS  src/data/centralized-news.js scored news feed
     paper-portfolios  src/data/paper-portfolios.js localStorage book
     DataLayer         src/data/layer.js            tao:market /
                                                    tao:subnets /
                                                    tao:chain feeds
   ================================================================= */

import { html, mount, qs, qsa, setLive } from '../lib/dom.js';
import { SUBNETS, subnetById } from '../data/subnets.js';
import { CENTRALIZED_NEWS, newsForSubnet } from '../data/centralized-news.js';
import { recentOracleArticles } from '../data/oracle-articles.js';
import { ARTICLES } from '../data/articles.js';
import { GH_ACTIVITY, ghByNetuid } from '../data/github-activity.js';
import { generateSeries, sma, SERIES_DAYS } from '../lib/synthetic-series.js';
/* Paper-portfolio imports removed 2026-05-20 — the cockpit no
   longer surfaces paper-trading affordances (Rondo: "doht need
   another paper money chart" + "book measured has to be reimagined
   and may not be necessary at all" + "make sure it looks really
   cool looking for top traders"). The paper book + buy/sell flow
   still lives on dashboard.html's MY DESK fold for readers who
   want it; the cockpit is a pure research surface — chart +
   editorial signals + live market context. */

/* Per-subnet logo lookup — keyed by lowercased subnet name.
   Falls back to the Bittensor mark when no specific logo exists.
   Module-scope so the render template can reference during
   string-building (TDZ-safe). Mirror of the SUBNET_LOGOS map
   in Home.js — when a new logo file lands in assets/, add it
   here too. */
const SUBNET_LOGOS = {
  'hippius': 'assets/hippius-mark.png',
  'targon':  'assets/targon-mark.svg',
};
const FALLBACK_LOGO = 'assets/bittensor-mark.png';

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
  /* DESK pane removed 2026-05-18 — paper money is the chart's
     PORTFOLIO mode toggle now, not a separate pane. */
];

/* ---------- formatters --------------------------------------- */
const fmtPrice = p => p == null ? '·' : (p < 1 ? '$' + p.toFixed(4) : '$' + p.toFixed(2));
const fmtPct   = v => v == null ? '·' : (v >= 0 ? '+' : '') + v.toFixed(2) + '%';
const fmtInt   = n => n == null ? '·' : Math.round(n).toLocaleString('en-US');
const fmtMcap  = m => m == null ? '·' : '$' + (m >= 1000 ? (m/1000).toFixed(2) + 'B' : m.toFixed(1) + 'M');
/* Subnets price in TAO, not dollars — per Rondo 2026-05-21
   ("Every subnet should be priced in TAO first, not dollars.
   Only centralized companies should be denominated in $. Subnets
   should be priced in TAO, the way taostats.io does it.") The
   dollar formatters above stay for centralized companies + the
   TAO/USD bridge pair itself; the TAO formatters below are for
   anything subnet-scoped.
     fmtTAO(0.0124)              → "0.0124 τ"
     fmtTAO(2.4, { compact:1 })  → "τ2.40"  (chart-axis-tight)
     fmtMcapTAO(12400000)        → "12.4M τ"
     fmtMcapTAO(12400)           → "12,400 τ"  */
const fmtTAO = (p, opts = {}) => {
  if (p == null) return '·';
  /* 4 decimals when sub-1, 2 decimals when ≥1 — same precision
     register taostats uses so traders read the same shape across
     surfaces. */
  const n = p < 1 ? p.toFixed(4) : p.toFixed(2);
  return opts.compact ? 'τ' + n : n + ' τ';
};
const fmtMcapTAO = m => {
  if (m == null) return '·';
  /* TAO mcap registers: M for millions, K for thousands. No B
     because subnet mcaps don't hit billion-TAO territory at
     current supply ceilings. */
  if (m >= 1_000_000) return (m / 1_000_000).toFixed(2) + 'M τ';
  if (m >= 1_000)     return (m / 1_000).toFixed(1) + 'K τ';
  return Math.round(m).toLocaleString('en-US') + ' τ';
};
const fmtDate  = d => {
  if (!d) return '·';
  const [y,m,dd] = String(d).split('-');
  return `${dd} ${['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][parseInt(m,10)-1]} ${y.slice(2)}`;
};
const cls   = v => v == null ? 'is-flat' : (v > 0 ? 'is-up' : v < 0 ? 'is-down' : 'is-flat');
const arrow = v => v == null ? '·' : (v > 0.001 ? '▲' : v < -0.001 ? '▼' : '—');

/* ---------- cockpit state ----------------------------------- */
function loadCockpitState(){
  /* Cockpit always leads with the CHART pane on fresh load.
     Selected subnet + range persist across visits via localStorage. */
  try {
    const raw = JSON.parse(localStorage.getItem(COCKPIT_KEY) || '{}');
    return {
      selectedId:  Number.isFinite(raw.selectedId)  ? raw.selectedId  : 4,
      range:       raw.range                        || '30D',
      pane:        'chart',
    };
  } catch (_) { return { selectedId: 4, range: '30D', pane: 'chart' }; }
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
    /* Y-axis labels carry the τ unit — this is a SUBNET price
       chart and subnets denominate in TAO per [[feedback-subnets-
       in-tao]]. The τ glyph trails the number (taostats pattern)
       so the eye reads the magnitude first, then the unit. */
    ctx.fillText(v < 1 ? v.toFixed(4) + ' τ' : v.toFixed(2) + ' τ', PAD_L - 6, y);
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
  /* Tab simplification 2026-05-18: dropped SUBNETS/FEED buttons.
     If a returning reader has state.pane saved as one of those,
     normalize to 'chart' so they don't land on an unreachable
     pane with no toggle back. */
  /* DESK pane removed 2026-05-18; chart is the only pane.
     Returning readers parked on 'desk' get normalized to 'chart'. */
  if (state.pane !== 'chart') state.pane = 'chart';
  let series     = generateSeries(subnetById(state.selectedId) || SUBNETS[0]);
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
  /* Live-data state — set true when 'tao:subnets' first emits a
     real batch, surfaces a pulsing red LIVE badge in the chart
     header. */
  let isLive = false;
  /* No paper-money state here — the cockpit is now a pure subnet-
     research surface per Rondo 2026-05-20 ("doht need another
     paper money chart" / "make sure it looks really cool looking
     for top traders"). Earlier the cockpit had chartMode toggle
     + holdings table + add-position sheet — all stripped. The
     dashboard's MY DESK fold still owns paper-trade affordances
     for readers who want them. */

  /* Render the cockpit shell once; the chart pane repaints in
     place on subnet / range / mode changes. Everything inside
     the workspace lives in .cockpit__main — the chart on the
     left of its row, the SIGNALS + VITALS + MOVERS sidebar on
     the right, the HOLDINGS table directly below. No separate
     panes / no tab switcher: one workspace, one frame. */
  mount(root, html`
    <section class="cockpit" data-cockpit-root>
      ${renderTabs()}
      <div class="cockpit__grid">
        <section class="cockpit__main" data-pane="chart">
          ${renderMain()}
        </section>
      </div>
    </section>
  `);

  setActivePane(state.pane);
  drawChartNow();
  wireEverything();

  /* ---------- sub-renders ----------------------------------- */

  function renderTabs(){
    /* Simplified 2026-05-18 per Rondo "way too many panel options
       and panel options within panel options it's confusing."
       Drop the SUBNETS + FEED buttons — on desktop they don't
       swap anything (panes are pinned), on mobile the rail is
       always one tap away via the masthead's MAGAZINE/MARKETS
       links, and FEED was rarely tapped. Keep CHART · DESK as
       the two meaningful workflow toggles, plus the MARKETS
       jump pill. Three controls instead of five. */
    return `
      <nav class="cockpit-tabs" aria-label="Cockpit view">
        <button type="button" class="cockpit-tabs__btn" data-pane-btn="chart">CHART</button>
        <a class="cockpit-tabs__markets" href="markets.html" aria-label="Open markets page">⊕ MARKETS ↗</a>
      </nav>`;
  }

  function renderMain(){
    const s = subnetById(state.selectedId) || SUBNETS[0];
    const range = RANGES.find(r => r.key === state.range) || RANGES[2];

    const rangeBtns = RANGES.map(r => {
      const on = r.key === state.range;
      return `
      <button type="button" class="cock-range__btn ${on ? 'is-on' : ''}" data-range="${r.key}" role="tab" aria-selected="${on}" aria-label="${r.label}">${r.label}</button>`;
    }).join('');

    return `
      <!-- CHART HEADER — institutional register, no paper-money
           UI. Left side carries the picker, subnet identity, and
           the live/seed status pill. Right side carries the price
           block (big white display number + colored 24h delta +
           7d / 30d deltas + a compact MCAP / EMISSION readout). -->
      <header class="cock-chart__head cock-chart__head--trader">
        <div class="cock-chart__title">
          <!-- PICK SUBNET dropdown — the only navigation in the
               chart header. Wired to setSelected() via wireChart. -->
          <div class="cock-chart__picker cock-chart__picker--head">
            <label class="cock-chart__picker-lbl" for="cock-chart-picker">PICK</label>
            <select class="cock-chart__picker-sel" id="cock-chart-picker" data-chart-picker aria-label="Pick subnet">
              ${SUBNETS.slice().sort((a,b) => (b.mcap||0)-(a.mcap||0)).map(x =>
                /* Each option carries the subnet number, name, α
                   price (in TAO per [[feedback-subnets-in-tao]]),
                   and its 24h delta — the trader scrolls the
                   dropdown reading τ values, never $. */
                `<option value="${x.netuid}" ${x.netuid === s.netuid ? 'selected' : ''}>SN${x.netuid} · ${x.name} · ${(x.price||0).toFixed(x.price < 1 ? 4 : 2)} τ · ${x.chg24 >= 0 ? '+' : ''}${(x.chg24||0).toFixed(1)}%</option>`
              ).join('')}
            </select>
          </div>
          <!-- Subnet identity row: logo + SN# + name + category +
               live pill. The LIVE pill pulses red when tao:subnets
               has emitted a real payload; SEED while we're showing
               synthetic data. -->
          <h1 class="cock-chart__h">
            <span class="cock-chart__logo" aria-hidden="true">
              <img src="${SUBNET_LOGOS[(s.name || '').toLowerCase()] || FALLBACK_LOGO}" alt="" loading="lazy" onerror="this.src='${FALLBACK_LOGO}'">
            </span>
            <span class="cock-chart__sn">SN${s.netuid}</span>
            <span class="cock-chart__name">${s.name}</span>
            <span class="cock-chart__cat">${catLabel(s.cat)}</span>
            <span class="cock-chart__live ${isLive ? 'is-live' : ''}" data-live-pill title="${isLive ? 'Pulling live data from TaoMarketcap' : 'Seed data, waiting on live feed'}">
              <span class="cock-chart__live-dot"></span>${isLive ? 'LIVE · TMC' : 'SEED'}
            </span>
          </h1>
          <div class="cock-chart__sub">${s.desc || ''} · <span style="color:var(--c-ink-3)">team ${s.owner || '·'}</span></div>
        </div>
        <!-- Price block — the institutional register. Big white
             price (28px JetBrains Mono, tabular-nums so it doesn't
             jitter on updates), then the 24h delta in mint/red,
             then the 7d and 30d deltas dimmer below. A trader-
             grade meta row sits beneath: MCAP and 24h EMISSION.
             Each value carries a data-vital attribute so the
             tao:subnets live feed can flash it via setLive. -->
        <!-- Price block — subnets are priced in TAO (Rondo
             2026-05-21 / [[feedback-subnets-in-tao]]). The big
             headline number is α-in-TAO, deltas are %, and the
             meta row below shows TAO mcap + 24h emission so a
             trader can read the size + flow at a glance without
             leaving the chart. -->
        <div class="cock-chart__price-block">
          <div class="cock-chart__price" data-vital="sn-price">${fmtTAO(s.price)}</div>
          <div class="cock-chart__chg ${cls(s.chg24)}">${arrow(s.chg24)} ${fmtPct(s.chg24)} · 24h</div>
          <div class="cock-chart__chg2 ${cls(s.chg7)}">${fmtPct(s.chg7)} · 7d</div>
          <div class="cock-chart__chg2 ${cls(s.chg30)}">${fmtPct(s.chg30)} · 30d</div>
          <div class="cock-chart__meta">
            <span class="cock-chart__meta-row"><span class="cock-chart__meta-lbl">MCAP</span><span class="cock-chart__meta-val">${fmtMcapTAO(s.mcap)}</span></span>
            <span class="cock-chart__meta-row"><span class="cock-chart__meta-lbl">EMIT τ/d</span><span class="cock-chart__meta-val">${fmtInt(s.emission)}</span></span>
          </div>
        </div>
      </header>

      <!-- CHART ROW — canvas LEFT, sidebar RIGHT.
           The chart canvas is the centerpiece. The sidebar
           carries three stacked sections, top to bottom:
             SIGNALS    Magazine + Oracle + centralized cards
                        filtered to the active subnet.
             VITALS     Live network context (TAO/USD, MCAP, BLK,
                        STAKED %, EMIT τ/d, SUBNETS count).
             MOVERS     Top 3 ↑ / Bottom 3 ↓ by 24h, clickable
                        rows that retarget the chart.
           On mobile the row stacks: chart top, sidebar below. -->
      <div class="cock-chart__row">
        <div class="cock-chart__canvas-wrap">
          <canvas class="cock-chart__canvas" data-chart-canvas
                  role="img"
                  aria-label="SN${s.netuid} ${s.name} price chart, ${state.range} window"></canvas>
          <div class="cm-tooltip" data-chart-tooltip style="display:none" role="tooltip" aria-live="polite"></div>
          <div class="cock-chart__flag-preview" data-flag-preview hidden></div>
        </div>
        <aside class="cock-chart__side" data-chart-side aria-label="Market context for SN${s.netuid} ${s.name}">
          ${renderMarketSidebar(s)}
        </aside>
      </div>

      <!-- Chart navigation: range tabs + pan history controls.
           Range tabs pick the visible window (1D / 7D / 30D / 90D /
           1Y); pan buttons walk that window backward/forward through
           history a window-at-a-time, with ⏵ TODAY snapping back to
           the most recent window. -->
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

      <!-- Footer pointer to the full dashboard surface so the
           reader knows where to find briefings, the full markets
           roster, the editorial archive, attribution, paper-
           portfolio affordances etc. The cockpit deliberately
           stays focused on chart + market + editorial context. -->
      <div class="cock-chart__more">
        <span class="cock-chart__more-lbl">Looking for briefings · full markets · attribution · editorial archive · paper desk?</span>
        <a class="cock-chart__more-link" href="dashboard.html">⊕ OPEN FULL DASHBOARD ↗</a>
      </div>
    `;
  }

  /* ---- chart sidebar (right rail) -----------------------------
     Three stacked sections — SIGNALS first (editorial leads),
     then NETWORK VITALS, then TODAY'S MOVERS. Re-renders fully
     when the active subnet changes (signals + vitals carry the
     subnet-relevant rows). Live data from tao:market + tao:chain
     updates VITALS via setLive on the value cells. */
  function renderMarketSidebar(s){
    /* SIGNALS — Magazine + Oracle + centralized cards filtered
       to the active subnet. Compact rows: small kind chip + date
       + serif title + source. All three editorial kinds carry
       through (Rondo flagged article-kind protection 2026-05-20). */
    /* SIGNALS data — sidebar now leads with CENTRALIZED COMPETITOR
       content per Rondo 2026-05-21: "when a person chooses a
       particular subnet chart to look at the articles in the side
       panels should be the centralized competitor articles or
       subjects. comparison data etc."

       Centralized news (cen kind, from newsForSubnet) scores
       third-party AI / hardware / capital news to the subnet's
       category — that's the competitor context. We pull up to 6
       of those, then 1 Magazine and 1 Oracle card as secondary
       (per [[feedback-articles-protected]] — all three kinds
       still need a home; competitor leads but the magazine voice
       still gets a foot in). 8 total.

       FUTURE PASS — proper "competitor data" needs a
         subnet ↔ centralized-rival mapping (e.g. SN4 Targon =
         vision space → OpenAI CLIP, Google Vision, Anthropic
         image API; SN1 = chat → ChatGPT, Claude, Gemini, ...).
       That mapping doesn't exist yet. When it lands, the
       sidebar can show a "VS" comparison stat row (subnet
       mcap τ vs competitor mcap $, subnet emission revenue
       vs competitor revenue, etc.) above the cards. Wiring
       seam: extend src/data/ with `centralized-competitors.js`
       that exports `competitorsForSubnet(s)` and surface its
       values on a tao:competitors DataLayer channel. */
    const team = ARTICLES.filter(a =>
      Number(a.subnet) === s.netuid ||
      String(a.subnet) === String(s.name)
    ).map(a => ({
      kind: 'mag', date: a.date, title: a.title,
      url:  a.pdf || a.externalUrl || '#',
      source: (a.authors && a.authors[0]) || 'Subneτ Magazine',
      dek:  a.tagline || a.dek || '',
    }));
    const oracle = recentOracleArticles(Infinity)
      .filter(a =>
        (a.subnetId === s.netuid) ||
        ((a.subnetName || '').toLowerCase() === s.name.toLowerCase()) ||
        ((a.title || '').toLowerCase().includes(s.name.toLowerCase()))
      )
      .map(a => ({
        kind: 'orc', date: a.date, title: a.title,
        url:  a.pdf || '#',
        source: 'Subnet Oracle',
        dek:  a.dek || '',
      }));
    let central = [];
    try {
      central = newsForSubnet(s, 8).map(n => ({
        kind: 'cen', date: n.date, title: n.headline,
        url:  n.url || '#',
        source: n.source,
        dek:  n.takeaway || '',
      }));
    } catch (_) {}
    /* Order: cen first (competitor context, up to 6), then 1
       freshest mag + 1 freshest orc so the magazine voice stays
       on the surface. The dashboard's editorial archive carries
       the full mag/orc depth for readers who want more. */
    const cenLeading = central
      .slice()
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
      .slice(0, 6);
    const magOne = team
      .slice()
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
      .slice(0, 1);
    const orcOne = oracle
      .slice()
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
      .slice(0, 1);
    const signals = [...cenLeading, ...magOne, ...orcOne].slice(0, 8);
    const kindLbl = (k) => k === 'mag' ? 'MAG' : k === 'orc' ? 'ORC' : 'CEN';
    /* Each signal renders as a native <details> element — the
       summary IS the closed state (kind chip + date + title +
       chevron). Expanding reveals the dek paragraph + source +
       a READ link out to the article. Native <details> gives
       us free keyboard support, accessibility, and graceful
       no-JS behavior. The chevron rotates on open via CSS.
       Per [[feedback-collapsible-default]]: this is the
       magazine's preferred pattern for editorial surfaces. */
    const signalsHtml = signals.length
      ? signals.map(a => `
          <details class="cock-side-sig__card cock-side-sig__card--${a.kind}">
            <summary class="cock-side-sig__summary">
              <span class="cock-side-sig__head">
                <span class="cock-side-sig__kind cock-side-sig__kind--${a.kind}">${kindLbl(a.kind)}</span>
                <span class="cock-side-sig__date">${a.date || '·'}</span>
                <span class="cock-side-sig__chev" aria-hidden="true">›</span>
              </span>
              <span class="cock-side-sig__title">${a.title || '·'}</span>
            </summary>
            <div class="cock-side-sig__body">
              ${a.dek ? `<p class="cock-side-sig__dek">${a.dek}</p>` : ''}
              <div class="cock-side-sig__foot">
                <span class="cock-side-sig__src">${a.source || '·'}</span>
                <a class="cock-side-sig__read" href="${a.url}" target="_blank" rel="noopener" aria-label="Read full article: ${(a.title || '').replace(/"/g, '&quot;')}">READ ↗</a>
              </div>
            </div>
          </details>`).join('')
      : `<div class="cock-side-sig__empty">No dispatches indexed for SN${s.netuid} yet. The editorial desk rotates coverage as subnets enter the top emission tier.</div>`;

    /* NETWORK VITALS — live values are populated via the data-vital
       attributes the tao:market / tao:chain subscriptions update
       (so values flash on change via setLive). Initial values come
       from SUBNETS.length (subnets count) + placeholders for the
       live-fed fields until the first refresh lands. */
    const subnetCount = SUBNETS.length;
    /* TODAY'S MOVERS — top 3 ↑ / bottom 3 ↓ by 24h percent change
       across SUBNETS. Filtered to subnets with a real chg24 value
       so the row reflects real movement, not seed defaults. */
    const movers = SUBNETS.filter(x => Number.isFinite(x.chg24));
    const top = movers.slice().sort((a,b) => (b.chg24 || 0) - (a.chg24 || 0)).slice(0, 3);
    const bot = movers.slice().sort((a,b) => (a.chg24 || 0) - (b.chg24 || 0)).slice(0, 3);
    const moverRow = (x, dir) => `
      <button type="button" class="cock-side-mov__row cock-side-mov__row--${dir}" data-mover="${x.netuid}" aria-label="Switch chart to SN${x.netuid} ${x.name}">
        <span class="cock-side-mov__sn">SN${x.netuid}</span>
        <span class="cock-side-mov__name">${x.name}</span>
        <span class="cock-side-mov__pct ${cls(x.chg24)}">${arrow(x.chg24)} ${fmtPct(x.chg24)}</span>
      </button>`;

    return `
      <section class="cock-side-sig" aria-label="Centralized competitor signals for SN${s.netuid} ${s.name}">
        <header class="cock-side__head">
          <span class="cock-side__h">⊕ COMPETITORS · SN${s.netuid} · ${s.name}</span>
          <span class="cock-side__n">${signals.length}</span>
        </header>
        <!-- COMPARISON STAT ROW — placeholder while the subnet ↔
             centralized-rival mapping is being built. Once a
             centralized-competitors data source + a tao:competitors
             DataLayer channel publish the rival company's mcap +
             24h delta, this row will read e.g.:
                SN4 12.4M τ  vs  OpenAI $80B  +1.2%
             For now it surfaces the gap so the reader knows the
             feature is on deck rather than missing. -->
        <div class="cock-side-sig__compare cock-side-sig__compare--soon">
          <span class="cock-side-sig__compare-lbl">VS CENTRALIZED</span>
          <span class="cock-side-sig__compare-note">comparison data plug-in arriving — see <a href="dashboard.html">⊕ DASHBOARD</a> for full editorial archive in the meantime</span>
        </div>
        <div class="cock-side-sig__list">${signalsHtml}</div>
      </section>

      <section class="cock-side-vit" aria-label="Bittensor network vitals">
        <header class="cock-side__head">
          <span class="cock-side__h">⊕ NETWORK VITALS</span>
          <span class="cock-side__n" data-vital-live aria-hidden="true">·</span>
        </header>
        <dl class="cock-side-vit__list">
          <div class="cock-side-vit__row">
            <dt>TAO / USD</dt>
            <dd><span data-vital="tao-price">·</span> <span class="cock-side-vit__delta" data-vital="tao-chg24">·</span></dd>
          </div>
          <div class="cock-side-vit__row">
            <dt>TAO MCAP</dt>
            <dd data-vital="tao-mcap">·</dd>
          </div>
          <div class="cock-side-vit__row">
            <dt>BLOCK</dt>
            <dd data-vital="tao-block">·</dd>
          </div>
          <div class="cock-side-vit__row">
            <dt>STAKED</dt>
            <dd data-vital="tao-staked">·</dd>
          </div>
          <div class="cock-side-vit__row">
            <dt>EMIT τ/d</dt>
            <dd data-vital="tao-emit">·</dd>
          </div>
          <div class="cock-side-vit__row">
            <dt>SUBNETS</dt>
            <dd>${subnetCount}</dd>
          </div>
        </dl>
      </section>

      <section class="cock-side-mov" aria-label="Today's movers across Bittensor subnets">
        <header class="cock-side__head">
          <span class="cock-side__h">⊕ TODAY'S MOVERS</span>
          <span class="cock-side__n">24H</span>
        </header>
        <div class="cock-side-mov__group" aria-label="Top 3 gainers">
          <div class="cock-side-mov__group-lbl cock-side-mov__group-lbl--up">↑ TOP 3</div>
          ${top.map(x => moverRow(x, 'up')).join('') || '<div class="cock-side-mov__empty">No data yet.</div>'}
        </div>
        <div class="cock-side-mov__group" aria-label="Bottom 3 losers">
          <div class="cock-side-mov__group-lbl cock-side-mov__group-lbl--down">↓ BOTTOM 3</div>
          ${bot.map(x => moverRow(x, 'down')).join('') || '<div class="cock-side-mov__empty">No data yet.</div>'}
        </div>
      </section>
    `;
  }

  /* ---------- selection helpers ------------------------------- */

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
    /* The cockpit is single-pane now; this hook stays as a no-op
       sink so existing state.pane persistence + the post-mount
       chart redraw still work. */
    state.pane = 'chart';
    saveCockpitState(state);
    if (key === 'chart') requestAnimationFrame(drawChartNow);
  }

  /* ---------- repaint primitive ------------------------------ */

  function repaintMain(){
    const m = qs('[data-pane="chart"]', root);
    if (m){ m.innerHTML = renderMain(); wireChart(); drawChartNow(); }
  }

  /* drawChartNow assigns to `hit` (declared at the top of
     mountCockpit). The closure-level `let hit` was hoisted up so
     this function — invoked during initial mount before its own
     definition site — doesn't trip the temporal dead zone. */
  function drawChartNow(){
    const c = qs('[data-chart-canvas]', root);
    const range = RANGES.find(r => r.key === state.range) || RANGES[2];
    const s = subnetById(state.selectedId) || SUBNETS[0];
    /* The cockpit chart renders one thing only: the active
       subnet's α price over `range.days` (Rondo 2026-05-20: no
       second paper-money chart). Annotations are editorial flags
       — magazine + oracle articles tied to this subnet, rendered
       as red/amber dots on the price line. */
    const chartSeries = series;
    const annotations = annotationsFor(s.netuid, s.name);
    const maxOffset = Math.max(0, chartSeries.length - range.days);
    if (chartOffset > maxOffset) chartOffset = maxOffset;
    if (chartOffset < 0)         chartOffset = 0;
    hit = drawChart(c, chartSeries, range, annotations, chartOffset);
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
       of the visible window (up X% / down Y% / last close N τ)
       from the price slice — last-close is in TAO per
       [[feedback-subnets-in-tao]], matching the visual axis. */
    if (c && series && series.length){
      const sliceStart = Math.max(0, series.length - range.days - chartOffset);
      const sliceEnd   = Math.min(series.length, sliceStart + range.days);
      const slice = series.slice(sliceStart, sliceEnd);
      if (slice.length >= 2){
        const first = slice[0].close;
        const last  = slice[slice.length - 1].close;
        const ret   = first > 0 ? ((last - first) / first) * 100 : 0;
        const dir   = ret >= 0 ? 'up' : 'down';
        const lastPriced = (last < 1 ? last.toFixed(4) : last.toFixed(2)) + ' tao';
        const histTag = chartOffset === 0 ? '' : `, ${chartOffset} days back`;
        c.setAttribute('aria-label',
          `SN${s.netuid} ${s.name || ''} price chart, ${range.label} window${histTag}, ${dir} ${Math.abs(ret).toFixed(2)} percent, last close ${lastPriced}`);
      }
    }
  }

  /* ---------- wiring --------------------------------------- */

  function wireEverything(){
    wireChart();
    /* Window resize triggers a chart re-draw (canvas needs to
       recompute its pixel dimensions when the viewport changes). */
    let rTick = 0;
    window.addEventListener('resize', () => {
      if (rTick) return;
      rTick = requestAnimationFrame(() => { rTick = 0; drawChartNow(); });
    });
  }

  function wireChart(){
    /* Range tabs (1D / 7D / 30D / 90D / 1Y) below the chart. Tap
       to swap the visible window; setRange re-clamps the pan
       offset + redraws the canvas. */
    qsa('[data-range]', root).forEach(b => {
      b.addEventListener('click', () => setRange(b.dataset.range));
    });
    /* Subnet picker dropdown in the chart header — change event
       switches the whole cockpit's active subnet. Repaints chart
       + sidebar (signals filter to the new subnet, vitals stay
       network-wide). */
    const picker = qs('[data-chart-picker]', root);
    if (picker){
      picker.addEventListener('change', () => {
        const id = parseInt(picker.value, 10);
        if (Number.isFinite(id)) setSelected(id);
      });
    }
    /* Sidebar mover rows — tap → switch chart to that subnet
       (same selection path as the picker dropdown). */
    qsa('[data-mover]', root).forEach(b => {
      b.addEventListener('click', () => {
        const id = parseInt(b.dataset.mover, 10);
        if (!Number.isFinite(id) || id === state.selectedId) return;
        setSelected(id);
      });
    });

    /* Chart hover — OHLC + MA tooltip on bar hover, editorial
       tooltip on news-flag marker hover. Closes the "Cockpit Chart
       Tooltip Parity" coordination ask logged in CLAUDE.md
       (commit 2cb3f75) — cockpit + terminal CHART now expose the
       same hover interaction. */
    const canvas    = qs('[data-chart-canvas]', root);
    const tooltipEl = qs('[data-chart-tooltip]', root);
    if (!canvas) return;
    /* 150% pass on sibling's P0 freeze-fix draft (CLAUDE.md
       coordination 828925c). Combines all three of sandbox's
       proposed fixes:
         A) rAF coalescing — at most one redraw per frame
         B) hit-test memoization — skip redraw if hover hasn't
            actually changed bar / flag identity
         C) touchmove passive handler — explicit touch path
            with its own frame-locked throttle
       Together these turn ~100 redraws/sec on mobile scrub into
       ≤60Hz with most frames being NO-OPS (when scrubbing within
       the same bar). */
    let rafId = 0;
    let pendingEv = null;
    let lastHitIdx = -2;
    let lastFlagId = null;
    let lastTooltipShown = false;
    /* Hover-tooltip price formatter — same TAO register as the
       chart axis labels (subnet prices in τ per
       [[feedback-subnets-in-tao]]). Kept inline to the hover
       handler so the tooltip render stays one frame, no extra
       allocations per move. */
    const fmtP = p => p == null ? '·' : ((p < 1 ? p.toFixed(4) : p.toFixed(2)) + ' τ');
    const MON = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    const actualOnMove = (ev) => {
      if (!hit) return;
      const r = canvas.getBoundingClientRect();
      const x = ev.clientX - r.left, y = ev.clientY - r.top;
      /* Flag hover takes precedence — within 10px of a marker
         we show the editorial tooltip. Identity = url||date so
         two flags on the same day with different URLs still
         re-render. */
      const flagHit = hit.hitFlag(x, y);
      const flagId = flagHit ? (flagHit.ann.url || flagHit.ann.href || flagHit.ann.date || flagHit.ann.title) : null;
      const h = !flagHit ? hit.hitTest(x, y) : null;
      const idx = h ? h.idx : -1;
      /* Memo gate — bail if neither hit identity changed. The
         crosshair x-position changes with raw pixel, not bar
         index, so we also redraw if the bar IDX matches but
         we have an active crosshair (idx !== -1). For simplicity
         the memo only skips when BOTH the flag and bar are
         identical to the prior frame AND the prior frame also
         had a tooltip showing — the crosshair-jiggle within one
         bar is minor and not worth the per-pixel redraw cost. */
      if (idx === lastHitIdx && flagId === lastFlagId && lastTooltipShown) return;
      lastHitIdx = idx;
      lastFlagId = flagId;
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
        lastTooltipShown = true;
        return;
      }
      canvas.style.cursor = '';
      if (!h){
        if (tooltipEl) tooltipEl.style.display = 'none';
        if (lastTooltipShown) drawChartNow();
        lastTooltipShown = false;
        return;
      }
      drawChartNow();
      hit.drawCrosshair(x, y);
      if (tooltipEl){
        const d = new Date(h.bar.t);
        const date = `${MON[d.getMonth()]} ${d.getDate()} ${String(d.getFullYear()).slice(2)}`;
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
      lastTooltipShown = true;
    };
    const onMove = (ev) => {
      /* rAF coalesce — pendingEv carries the most-recent event,
         the frame callback drains it. Cheapest possible throttle:
         no setTimeout cost, locks to display refresh, drops
         intermediate events the user never sees. */
      pendingEv = ev;
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        const ev2 = pendingEv;
        pendingEv = null;
        if (ev2) actualOnMove(ev2);
      });
    };
    const onLeave = () => {
      if (rafId){ cancelAnimationFrame(rafId); rafId = 0; pendingEv = null; }
      lastHitIdx = -2;
      lastFlagId = null;
      lastTooltipShown = false;
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
    /* Touch path — passive so the browser keeps native scrolling
       eligible, ev.touches[0] feeds the same coalesced onMove
       handler. touchend → onLeave clears the crosshair so the
       tooltip doesn't sit stuck after the finger lifts. */
    canvas.addEventListener('touchmove', (ev) => {
      if (ev.touches && ev.touches[0]) onMove(ev.touches[0]);
    }, { passive: true });
    canvas.addEventListener('touchend', onLeave, { passive: true });
    canvas.addEventListener('touchcancel', onLeave, { passive: true });

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

  /* Live data subscription (TaoMarketcap via DataLayer). When the
     'tao:subnets' channel emits a fresh batch, mutate matching
     SUBNETS rows in place so the per-subnet price / 24h % /
     mcap / miners / validators / emission update immediately.
     Repaint the chart pane to reflect the live numbers. The
     synthetic price series is also regenerated for the active
     subnet so the chart anchors on the latest mark.

     Rondo 2026-05-18: "pull api data from tao stats and tao
     marketcap." DataLayer.start() in boot.js already begins
     polling both APIs; this hook is the cockpit's read side. */
  const liveUnsubs = [];
  if (dataLayer && typeof dataLayer.subscribe === 'function'){
    const onLiveSubnets = (listRaw) => {
      if (!Array.isArray(listRaw) || !listRaw.length) return;
      isLive = true;
      let touched = false;
      listRaw.forEach(live => {
        if (live == null || live.netuid == null) return;
        const local = subnetById(live.netuid);
        if (!local) return;
        /* Map TMC live fields onto the SUBNETS row. Field names
           per layer.js mapping (refreshSubnets). */
        if (Number.isFinite(live.price))       { local.price = live.price; touched = true; }
        if (Number.isFinite(live.chg24h))      local.chg24 = live.chg24h;
        if (Number.isFinite(live.chg7d))       local.chg7  = live.chg7d;
        if (Number.isFinite(live.chg30d))      local.chg30 = live.chg30d;
        if (Number.isFinite(live.mcap_alpha))  local.mcap = live.mcap_alpha;
        if (Number.isFinite(live.emission))    local.emission = live.emission;
        if (Number.isFinite(live.miners))      local.miners = live.miners;
        if (Number.isFinite(live.validators))  local.validators = live.validators;
      });
      if (touched){
        const cur = subnetById(state.selectedId);
        if (cur) series = generateSeries(cur);
        repaintMain();
      }
    };
    liveUnsubs.push(dataLayer.subscribe('tao:subnets', onLiveSubnets));
    const cachedSubnets = dataLayer.get && dataLayer.get('tao:subnets');
    if (cachedSubnets) onLiveSubnets(cachedSubnets);

    /* CHART SIDEBAR — NETWORK VITALS live wiring. The vital cells
       render with "·" placeholders; setLive flashes the value on
       change so the column reads as a live ticker. tao:market
       carries TAO/USD price + delta + mcap + block height +
       stakedPct; tao:chain carries the network's emission rate. */
    const setVital = (key, text) => {
      const el = qs(`[data-vital="${key}"]`, root);
      if (!el) return;
      if (typeof setLive === 'function') setLive(el, text);
      else el.textContent = text;
    };
    const onLiveMarket = (m) => {
      if (!m || typeof m !== 'object') return;
      if (Number.isFinite(m.price))      setVital('tao-price', '$' + m.price.toFixed(2));
      if (Number.isFinite(m.change24h))  setVital('tao-chg24', (m.change24h >= 0 ? '+' : '') + m.change24h.toFixed(2) + '%');
      if (Number.isFinite(m.marketCap))  setVital('tao-mcap',  '$' + (m.marketCap >= 1e9 ? (m.marketCap/1e9).toFixed(2) + 'B' : (m.marketCap/1e6).toFixed(1) + 'M'));
      if (Number.isFinite(m.blockNumber)) setVital('tao-block', '#' + m.blockNumber.toLocaleString('en-US'));
      if (Number.isFinite(m.stakedPct))  setVital('tao-staked', m.stakedPct.toFixed(2) + '%');
      const chgEl = qs('[data-vital="tao-chg24"]', root);
      if (chgEl && Number.isFinite(m.change24h)){
        chgEl.classList.toggle('is-up',   m.change24h > 0);
        chgEl.classList.toggle('is-down', m.change24h < 0);
        chgEl.classList.toggle('is-flat', m.change24h === 0);
      }
    };
    liveUnsubs.push(dataLayer.subscribe('tao:market', onLiveMarket));
    const cachedMarket = dataLayer.get && dataLayer.get('tao:market');
    if (cachedMarket) onLiveMarket(cachedMarket);

    const onLiveChain = (c) => {
      if (!c || typeof c !== 'object') return;
      /* totalIssuance ~= daily-emission proxy across all subnets;
         layer.js exposes it on tao:chain. Round to nearest int
         for the τ/d display register. */
      if (Number.isFinite(c.totalIssuance)) setVital('tao-emit', Math.round(c.totalIssuance).toLocaleString('en-US'));
      if (Number.isFinite(c.blockNumber)  && !qs('[data-vital="tao-block"]', root)?.textContent?.startsWith('#')) {
        setVital('tao-block', '#' + c.blockNumber.toLocaleString('en-US'));
      }
    };
    liveUnsubs.push(dataLayer.subscribe('tao:chain', onLiveChain));
    const cachedChain = dataLayer.get && dataLayer.get('tao:chain');
    if (cachedChain) onLiveChain(cachedChain);
  }

  return () => {
    liveUnsubs.splice(0).forEach(u => { try { u(); } catch (_) {} });
  };
}
