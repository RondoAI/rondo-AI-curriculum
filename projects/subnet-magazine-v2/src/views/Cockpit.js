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
     SUBNETS           src/data/subnets.js          53-subnet seed
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
function generateSeries(subnet){
  const days = 365;
  const out  = new Array(days);
  let seed   = (subnet.netuid * 12345 + 67) >>> 0;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) >>> 0;
    return ((seed >>> 16) & 0x7FFF) / 0x7FFF;
  };

  const currentPrice = subnet.price || 1;
  const r24 = (subnet.chg24 || 0) / 100;
  const r7  = (subnet.chg7  || 0) / 100;
  const r30 = (subnet.chg30 || 0) / 100;

  // Today's bar
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  out[days - 1] = {
    t:      today.getTime(),
    close:  currentPrice,
    open:   currentPrice / (1 + r24),
    high:   currentPrice * (1 + Math.abs(r24) * 0.4 + rand() * 0.01),
    low:    currentPrice * (1 - Math.abs(r24) * 0.4 - rand() * 0.01),
    volume: (subnet.emission || 100) * 24 * (subnet.price || 1) * (0.8 + rand() * 0.4),
  };

  for (let i = days - 2; i >= 0; i--){
    const dayAgo = days - 1 - i;
    let drift;
    if (dayAgo <= 1)       drift = -r24 / 1;
    else if (dayAgo <= 7)  drift = -r7  / 7;
    else if (dayAgo <= 30) drift = -r30 / 30;
    else                   drift = -0.0008 + (rand() - 0.5) * 0.001;
    const noise   = (rand() - 0.5) * 0.045;
    const tomorrow = out[i + 1];
    const close = tomorrow.close * (1 + drift + noise);
    const open  = close * (1 + (rand() - 0.5) * 0.012);
    const high  = Math.max(open, close) * (1 + rand() * 0.025);
    const low   = Math.min(open, close) * (1 - rand() * 0.025);
    const vol   = (subnet.emission || 100) * 24 * (subnet.price || 1) * (0.4 + rand() * 1.2);
    const t     = today.getTime() - (days - 1 - i) * 86400000;
    out[i] = { t, close, open, high: Math.max(low, high), low: Math.min(low, high), volume: vol };
  }
  return out;
}

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

function drawChart(canvas, series, range, annotations){
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();
  const W = Math.max(200, rect.width);
  const H = Math.max(160, rect.height);
  canvas.width  = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);

  if (!series || !series.length) return;

  const slice = series.slice(Math.max(0, series.length - range.days));
  if (slice.length < 2) return;

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
     adjacent dates collide within 18px. */
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

    const rangeBtns = RANGES.map(r => `
      <button type="button" class="cock-range__btn ${r.key === state.range ? 'is-on' : ''}" data-range="${r.key}">${r.label}</button>
    `).join('');

    /* INLINE ARTICLE COLUMN — per Rondo's 2026-05-17 directive
       (blue-line annotation on the cockpit screenshot): articles
       should live INSIDE the chart pane on the LEFT, not on a
       separate FEED tab. Build a tight column scoped to the
       current subnet. */
    const team = ARTICLES.filter(a =>
      Number(a.subnet) === s.netuid ||
      String(a.subnet) === String(s.name)
    ).slice(0, 4).map(a => ({
      kind: 'mag', date: a.date, title: a.title,
      url: a.pdf || a.externalUrl || '#',
      source: 'Magazine',
    }));
    const oracle = recentOracleArticles(Infinity)
      .filter(a =>
        (a.subnetId === s.netuid) ||
        ((a.subnetName || '').toLowerCase() === s.name.toLowerCase()) ||
        ((a.title || '').toLowerCase().includes(s.name.toLowerCase()))
      )
      .slice(0, 4)
      .map(a => ({
        kind: 'orc', date: a.date, title: a.title,
        url: a.pdf || '#',
        source: 'Subnet Oracle',
      }));
    let central = [];
    try { central = newsForSubnet(s, 4).map(n => ({
      kind: 'cen', date: n.date, title: n.headline,
      url: n.url || '#',
      source: n.source,
    })); } catch (_) {}
    const inlineArticles = [...team, ...oracle, ...central]
      .sort((a,b) => (b.date || '').localeCompare(a.date || ''))
      .slice(0, 10);
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
    const inlineArticlesHtml = inlineArticles.length
      ? inlineArticles.map(a => `
          <a class="cock-chart__news-item cock-chart__news-item--${a.kind}" href="${a.url}" target="_blank" rel="noopener">
            <span class="cock-chart__news-bar" aria-hidden="true"></span>
            <span class="cock-chart__news-row">
              <span class="cock-chart__news-glyph cock-chart__news-glyph--${a.kind}">${miniMark(a.kind)}</span>
              <span class="cock-chart__news-date">${dateChip(a.date)}</span>
              <span class="cock-chart__news-kind cock-chart__news-kind--${a.kind}">${a.kind === 'mag' ? 'MAG' : a.kind === 'orc' ? 'ORC' : 'CEN'}</span>
            </span>
            <span class="cock-chart__news-title">${a.title || '·'}</span>
            <span class="cock-chart__news-src">${a.source || '·'} <span class="cock-chart__news-read">↗</span></span>
          </a>`).join('')
      : `<div class="cock-chart__news-empty">No dispatches indexed for SN${s.netuid} yet.</div>`;

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

      <!-- Chart + inline article column live side-by-side. Article
           column on the LEFT (per Rondo's blue-line annotation),
           chart fills the rest. Article column has its own scroll
           bar. -->
      <div class="cock-chart__row">
        <aside class="cock-chart__news" aria-label="News for SN${s.netuid} ${s.name}">
          <div class="cock-chart__news-head">
            <span class="cock-chart__news-h">⊕ SIGNALS · SN${s.netuid}</span>
            <span class="cock-chart__news-n">${inlineArticles.length}</span>
          </div>
          <div class="cock-chart__news-list">
            ${inlineArticlesHtml}
          </div>
        </aside>
        <div class="cock-chart__canvas-wrap">
          <canvas class="cock-chart__canvas" data-chart-canvas></canvas>
        </div>
      </div>

      <div class="cock-chart__range" role="tablist" aria-label="Time range">
        ${rangeBtns}
      </div>

      <div class="cock-kpis">${kpis}</div>
    `;
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
      <text x="12" y="137" font-family="JetBrains Mono, monospace" font-size="6.5"
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
    repaintMain();
    repaintFeed();
    qsa('[data-row]', root).forEach(r => r.classList.toggle('is-on', parseInt(r.dataset.row, 10) === netuid));
  }

  function setRange(key){
    if (key === state.range) return;
    state.range = key;
    saveCockpitState(state);
    qsa('[data-range]', root).forEach(b => b.classList.toggle('is-on', b.dataset.range === key));
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

  function drawChartNow(){
    const c = qs('[data-chart-canvas]', root);
    const range = RANGES.find(r => r.key === state.range) || RANGES[2];
    const s = subnetById(state.selectedId) || SUBNETS[0];
    const annotations = annotationsFor(s.netuid, s.name);
    drawChart(c, series, range, annotations);
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
  }

  /* Optional: react to live data ticks when the DataLayer wiring
     populates real prices. Mark the current subnet's price live and
     redraw the latest data point. */
  if (dataLayer && typeof dataLayer.subscribe === 'function'){
    dataLayer.subscribe(() => { /* future hook for live ticks */ });
  }

  return () => { /* no teardown needed; listeners die with the page */ };
}
