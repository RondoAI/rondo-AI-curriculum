/* =================================================================
   SUBNET MAGAZINE, CHART MODE (terminal mode)
   -----------------------------------------------------------------
   Migrated from src/views/Cockpit.js renderMain + drawChart per the
   "Reimagined Architecture" plan. The cockpit's center pane lives
   here as a self-contained terminal mode adapter.

   What you get:
     - Header: SN# · Name · CAT + descriptive line + big price block
       (24h color, 7d/30d in dim) + share/copy actions
     - Canvas: price-line area chart + volume bars at the bottom
       (DPR-scaled, redraws on resize, monospace axis labels)
     - 5 range tabs: 1D / 7D / 30D / 90D / 1Y
     - KPI strip: α PRICE / FDV / EMISSION / STAKE / VAL·MIN /
       GH COMMITS 30D
     - "OPEN IN COCKPIT ↗" deep-link back to the standalone cockpit
       for legacy URL parity

   Mounts at the terminal's center pane; ctx.subnet drives the
   visible series. When the global terminal selection changes, the
   shell re-mounts this mode (per mountActiveMode in Terminal.js),
   so we don't need to subscribe to a selection event — the new
   mount just gets the new subnet via ctx.

   Tier: FREE for 30D window, PRO for 1D/7D/90D/1Y (soft paywall
   overlay shows on PRO ranges for OBSERVER readers).
   ================================================================= */

import { SUBNETS, subnetById } from '../../data/subnets.js';
import { ghByNetuid } from '../../data/github-activity.js';
import { ARTICLES } from '../../data/articles.js';
import { recentOracleArticles } from '../../data/oracle-articles.js';
import { newsForSubnet } from '../../data/centralized-news.js';
import { escapeHtml } from '../../lib/dom.js';

/* Per-subnet article lookup, built once at module load — both my
   composeArticles below AND any future renderers can use these
   maps to fetch a subnet's editorial coverage without re-filtering
   ARTICLES/oracle on every paint. */
const ARTICLES_BY_NETUID = (() => {
  const m = new Map();
  for (const a of ARTICLES){
    const id = a.subnet ? parseInt(a.subnet, 10) : null;
    if (!Number.isFinite(id)) continue;
    if (!m.has(id)) m.set(id, []);
    m.get(id).push(a);
  }
  return m;
})();
const ORACLE_BY_NETUID = (() => {
  const m = new Map();
  for (const a of recentOracleArticles(Infinity)){
    if (a.subnetId == null) continue;
    if (!m.has(a.subnetId)) m.set(a.subnetId, []);
    m.get(a.subnetId).push(a);
  }
  return m;
})();
/* escAttr was a local duplicate of lib/dom.js escapeHtml — we now
   import the shared helper. Keeping the same call-site name so
   downstream string-interp templates didn't need to change. */
const escAttr = escapeHtml;

const RANGES = [
  { key: '1D',  days: 1,   label: '1D',  pro: true  },
  { key: '7D',  days: 7,   label: '7D',  pro: true  },
  { key: '30D', days: 30,  label: '30D', pro: false }, // free tier window
  { key: '90D', days: 90,  label: '90D', pro: true  },
  { key: '1Y',  days: 365, label: '1Y',  pro: true  },
];

const CAT_LABEL = {
  text:'TEXT', vision:'VISION', audio:'AUDIO', video:'VIDEO',
  multimodal:'MULTIMODAL', training:'TRAINING', data:'DATA',
  search:'SEARCH', finance:'FINANCE', agents:'AGENTS',
  robotics:'ROBOTICS', science:'SCIENCE', infra:'INFRA',
  prediction:'PREDICTION',
};
const catLabel = c => CAT_LABEL[c] || (c || '').toUpperCase();

const STATE_KEY = 'sbn:chart-mode:v1';
function loadChartState(){
  try {
    const raw = JSON.parse(localStorage.getItem(STATE_KEY) || '{}');
    return { range: raw.range || '30D' };
  } catch (_) { return { range: '30D' }; }
}
function saveChartState(s){
  try { localStorage.setItem(STATE_KEY, JSON.stringify(s)); } catch (_) {}
}

/* ---------- formatters --------------------------------------- */
const fmtPrice = p => p == null ? '·' : (p < 1 ? '$' + p.toFixed(4) : '$' + p.toFixed(2));
const fmtPct   = v => v == null ? '·' : (v >= 0 ? '+' : '') + v.toFixed(2) + '%';
const fmtInt   = n => n == null ? '·' : Math.round(n).toLocaleString('en-US');
const fmtMcap  = m => m == null ? '·' : '$' + (m >= 1000 ? (m/1000).toFixed(2) + 'B' : m.toFixed(1) + 'M');
const cls      = v => v == null ? 'is-flat' : (v > 0 ? 'is-up' : v < 0 ? 'is-down' : 'is-flat');
const arrow    = v => v == null ? '·' : (v > 0.001 ? '▲' : v < -0.001 ? '▼' : '—');

/* ---------- deterministic 365-day series ------------------- */
/* Same seeded walk as src/views/Cockpit.js generateSeries — so the
   standalone cockpit and this terminal mode agree on the underlying
   data. Backwards-walk from current price, apportioning chg24/7/30
   across their windows with seeded noise. */
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

/* ---------- editorial event list for chart annotations ------ */
/* Computes the timestamped flag events (magazine + oracle) for a
   given subnet. drawChart consumes these and renders vertical
   amber/red lines at each publish date. Same pattern HIST modal
   already uses; here the lines paint directly on the canvas
   (vs. SVG overlay) so they don't compete with the cursor for
   hover events. */
function annotationsFor(netuid){
  const out = [];
  for (const a of (ARTICLES_BY_NETUID.get(netuid) || [])){
    if (!a.date) continue;
    const t = Date.parse(a.date + 'T12:00:00Z');
    if (!Number.isFinite(t)) continue;
    out.push({ t, kind: 'mag',    title: a.title, href: a.pdf || a.externalUrl || '', date: a.date });
  }
  for (const a of (ORACLE_BY_NETUID.get(netuid) || [])){
    if (!a.date) continue;
    const t = Date.parse(a.date + 'T12:00:00Z');
    if (!Number.isFinite(t)) continue;
    out.push({ t, kind: 'orc',    title: a.title, href: a.pdf || '',                  date: a.date });
  }
  return out.sort((x, y) => x.t - y.t);
}

/* ---------- canvas draw (price area + volume bars) --------- */
function drawChart(canvas, series, range, annotations){
  if (!canvas) return null;
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();
  const W = Math.max(220, rect.width);
  const H = Math.max(160, rect.height);
  canvas.width  = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);

  if (!series || !series.length) return null;
  const slice = series.slice(Math.max(0, series.length - range.days));
  if (slice.length < 2) return null;

  const PAD_L = 54, PAD_R = 14, PAD_T = 14, PAD_B = 60;
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
  const rangeP = hi - lo || 1;
  const maxV = Math.max(...slice.map(s => s.volume), 1);

  const xAt = i => PAD_L + (i / (slice.length - 1)) * (W - PAD_L - PAD_R);
  const yAt = p => priceY1 - ((p - lo) / rangeP) * priceH;
  const vyAt = v => volY1 - (v / maxV) * VOL_H;

  // Grid (red-tinted hairline)
  ctx.strokeStyle = 'rgba(255,30,60,0.06)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++){
    const y = priceY0 + (i / 4) * priceH;
    ctx.beginPath(); ctx.moveTo(PAD_L, y); ctx.lineTo(W - PAD_R, y); ctx.stroke();
  }
  const xGridSteps = Math.min(6, slice.length - 1);
  for (let i = 0; i <= xGridSteps; i++){
    const x = PAD_L + (i / xGridSteps) * (W - PAD_L - PAD_R);
    ctx.beginPath(); ctx.moveTo(x, priceY0); ctx.lineTo(x, priceY1); ctx.stroke();
  }

  // Price area fill (gradient)
  ctx.beginPath();
  ctx.moveTo(xAt(0), priceY1);
  for (let i = 0; i < slice.length; i++) ctx.lineTo(xAt(i), yAt(slice[i].close));
  ctx.lineTo(xAt(slice.length - 1), priceY1);
  ctx.closePath();
  const firstClose = slice[0].close;
  const lastClose  = slice[slice.length - 1].close;
  const isUp = lastClose >= firstClose;
  const lineColor = isUp ? '#00E5A8' : '#FF4D60';
  const grad = ctx.createLinearGradient(0, priceY0, 0, priceY1);
  grad.addColorStop(0, isUp ? 'rgba(0,229,168,0.32)' : 'rgba(255,77,109,0.30)');
  grad.addColorStop(1, isUp ? 'rgba(0,229,168,0.02)' : 'rgba(255,77,109,0.02)');
  ctx.fillStyle = grad;
  ctx.fill();

  // Price line
  ctx.beginPath();
  ctx.moveTo(xAt(0), yAt(slice[0].close));
  for (let i = 1; i < slice.length; i++) ctx.lineTo(xAt(i), yAt(slice[i].close));
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 1.8;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();

  // Volume bars (color = up/down vs prior)
  for (let i = 0; i < slice.length; i++){
    const x = xAt(i);
    const y = vyAt(slice[i].volume);
    const w = Math.max(1, (W - PAD_L - PAD_R) / slice.length - 1);
    const up = i > 0 && slice[i].close >= slice[i-1].close;
    ctx.fillStyle = up ? 'rgba(0,229,168,0.55)' : 'rgba(255,77,109,0.55)';
    ctx.fillRect(x - w/2, y, w, volY1 - y);
  }

  // Y-axis labels
  ctx.fillStyle    = 'rgba(139,107,112,0.85)';
  ctx.font         = '10px "JetBrains Mono", monospace';
  ctx.textAlign    = 'right';
  ctx.textBaseline = 'middle';
  for (let i = 0; i <= 4; i++){
    const v = lo + ((4 - i) / 4) * rangeP;
    const y = priceY0 + (i / 4) * priceH;
    ctx.fillText(v < 1 ? '$' + v.toFixed(4) : '$' + v.toFixed(2), PAD_L - 6, y);
  }

  // X-axis labels (date)
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  const MON = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  for (let i = 0; i <= xGridSteps; i++){
    const idx = Math.round((i / xGridSteps) * (slice.length - 1));
    const d = new Date(slice[idx].t);
    const label = range.days <= 90
      ? `${d.getMonth()+1}/${d.getDate()}`
      : `${MON[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`;
    const x = PAD_L + (i / xGridSteps) * (W - PAD_L - PAD_R);
    ctx.fillText(label, x, volY1 + 8);
  }

  // VOL label
  ctx.fillStyle = 'rgba(255,30,60,0.55)';
  ctx.font      = '8.5px "JetBrains Mono", monospace';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.fillText('VOL', PAD_L - 6, volY0 + VOL_H / 2);

  // Range label corner
  ctx.fillStyle = 'rgba(255,30,60,0.7)';
  ctx.font = '9px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(range.label + ' · ' + slice.length + 'd', PAD_L + 4, PAD_T + 4);

  // News-flag overlays — Bloomberg-style markers at editorial
  // publish dates that fall inside the visible window. Amber for
  // magazine, red for oracle. Stagger dotY when adjacent dates
  // collide within 18px so neither overlaps the other.
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
      // Vertical hairline through the plot
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
      // Marker dot at the top
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

  // Return hit-test for crosshair tooltip + flag detection
  return {
    flags,
    hitFlag(px, py){
      /* Prefer flag hover when within 8px of a marker dot —
         vertical price hover takes over otherwise. */
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
      return { idx, bar, x: xAt(idx), y: yAt(bar.close) };
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
      // Dot at the data point
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

/* ---------- mount ------------------------------------------ */

export function mountChartMode(root, ctx){
  const state    = loadChartState();
  const s        = ctx?.subnet || subnetById(ctx?.selectedId) || SUBNETS[0];
  const gh       = ghByNetuid(s.netuid) || null;
  const series   = generateSeries(s);
  /* News-flag annotations for this subnet — passed into drawChart
     so the canvas can render markers at publish dates. */
  const annotations = annotationsFor(s.netuid);

  root.innerHTML = renderHTML(s, gh, state, series);

  const canvas    = root.querySelector('[data-chart-canvas]');
  const tooltipEl = root.querySelector('[data-chart-tooltip]');
  let hit = null;

  const draw = () => {
    const range = RANGES.find(r => r.key === state.range) || RANGES[2];
    hit = drawChart(canvas, series, range, annotations);
  };
  draw();

  // Range tab clicks
  root.querySelectorAll('[data-range]').forEach(b => {
    b.addEventListener('click', () => {
      const k = b.dataset.range;
      if (k === state.range) return;
      state.range = k;
      saveChartState(state);
      root.querySelectorAll('[data-range]').forEach(o =>
        o.classList.toggle('is-on', o.dataset.range === k));
      // Toggle 30D-only free badge
      const r = RANGES.find(rr => rr.key === k);
      const badge = root.querySelector('[data-chart-tier]');
      if (badge){
        badge.textContent = r.pro ? 'PRO range' : 'FREE · 30D window';
        badge.classList.toggle('is-pro', !!r.pro);
      }
      draw();
    });
  });

  // Hover crosshair tooltip — flag hover takes priority within 10px
  // of a marker, otherwise normal price-bar tooltip wins.
  const onMove = (ev) => {
    if (!hit) return;
    const r = canvas.getBoundingClientRect();
    const x = ev.clientX - r.left, y = ev.clientY - r.top;
    /* News-flag hover first — if the cursor is near a marker, show
       the editorial tooltip instead of the OHLC bar tooltip. */
    const flagHit = hit.hitFlag(x, y);
    if (flagHit){
      draw();   /* repaint to clear any previous crosshair */
      const a = flagHit.ann;
      const kindCls   = a.kind === 'mag' ? 'is-mag'    : 'is-orc';
      const kindLabel = a.kind === 'mag' ? 'MAGAZINE' : 'ORACLE';
      if (tooltipEl){
        tooltipEl.innerHTML = `
          <span class="ct-tt__date ct-tt__flag ${kindCls}">${escAttr(a.date)} · ${kindLabel}</span>
          <span class="ct-tt__title">${escAttr(a.title)}</span>
          ${a.href ? `<span class="ct-tt__cta">↗ click marker to open</span>` : ''}`;
        tooltipEl.style.display = 'block';
        const cw = canvas.clientWidth || r.width;
        const left = Math.max(8, Math.min(cw - 240, x + 14));
        const top  = Math.max(8, y - 10);
        tooltipEl.style.left = left + 'px';
        tooltipEl.style.top  = top + 'px';
      }
      canvas.style.cursor = a.href ? 'pointer' : 'help';
      return;
    }
    canvas.style.cursor = '';
    const h = hit.hitTest(x, y);
    if (!h){ if (tooltipEl) tooltipEl.style.display = 'none'; draw(); return; }
    draw();
    hit.drawCrosshair(x, y);
    if (tooltipEl){
      const d = new Date(h.bar.t);
      const date = `${['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][d.getMonth()]} ${d.getDate()} ${String(d.getFullYear()).slice(2)}`;
      tooltipEl.innerHTML = `
        <span class="ct-tt__date">${date}</span>
        <span class="ct-tt__row">O <b>${fmtPrice(h.bar.open)}</b></span>
        <span class="ct-tt__row">H <b>${fmtPrice(h.bar.high)}</b></span>
        <span class="ct-tt__row">L <b>${fmtPrice(h.bar.low)}</b></span>
        <span class="ct-tt__row">C <b>${fmtPrice(h.bar.close)}</b></span>
        <span class="ct-tt__row">V <b>${(h.bar.volume/1e3).toFixed(1)}K</b></span>`;
      tooltipEl.style.display = 'block';
      const cw = canvas.clientWidth || r.width;
      const left = Math.max(8, Math.min(cw - 160, x + 14));
      const top  = Math.max(8, y - 10);
      tooltipEl.style.left = left + 'px';
      tooltipEl.style.top  = top + 'px';
    }
  };

  /* Click on a flag marker → open the article in a new tab.
     The inline PDF viewer drawer (installed globally by boot.js)
     catches .pdf hrefs and opens them in the side drawer instead;
     external URLs open in a new tab as usual. */
  const onClick = (ev) => {
    if (!hit) return;
    const r = canvas.getBoundingClientRect();
    const flagHit = hit.hitFlag(ev.clientX - r.left, ev.clientY - r.top);
    if (flagHit && flagHit.ann.href){
      window.open(flagHit.ann.href, '_blank', 'noopener');
    }
  };
  canvas.addEventListener('click', onClick);
  const onLeave = () => {
    if (tooltipEl) tooltipEl.style.display = 'none';
    draw();
  };
  canvas.addEventListener('mousemove', onMove);
  canvas.addEventListener('mouseleave', onLeave);

  // Resize redraw
  let rt = 0;
  const onResize = () => {
    if (rt) return;
    rt = requestAnimationFrame(() => { rt = 0; draw(); });
  };
  window.addEventListener('resize', onResize);

  return () => {
    canvas.removeEventListener('mousemove', onMove);
    canvas.removeEventListener('mouseleave', onLeave);
    canvas.removeEventListener('click', onClick);
    window.removeEventListener('resize', onResize);
  };
}

/* ---------- article sidebar data ---------------------------- */
/* Rondo, 2026-05-17: "All these articles should be within the
   chart on a side bar." So EDITORIAL dispatches + centralized
   news no longer live as a separate mode — they sit beside the
   chart, scoped to the active subnet. Same data the right-pane
   feed pulls; rendered compact inside CHART so mobile readers
   (who don't see the shell's right pane) get the context. */
function composeArticles(subnet){
  const teamRaw = ARTICLES.filter(a =>
    Number(a.subnet) === subnet.netuid ||
    String(a.subnet) === String(subnet.name)
  );
  const team = teamRaw.map(a => ({
    kind:    'magazine',
    date:    a.date,
    title:   a.title,
    tagline: a.tagline || a.dek || '',
    href:    a.pdf || a.externalUrl || '#',
    author:  (a.authors || ['Subneτ Magazine'])[0],
    category: a.category || '',
  }));
  const oracle = recentOracleArticles(Infinity)
    .filter(a =>
      (a.subnetId === subnet.netuid) ||
      ((a.subnetName || '').toLowerCase() === subnet.name.toLowerCase()) ||
      ((a.title || '').toLowerCase().includes(subnet.name.toLowerCase()))
    )
    .slice(0, 6)
    .map(a => ({
      kind:    'oracle',
      date:    a.date,
      title:   a.title,
      tagline: a.dek || '',
      href:    a.pdf || '#',
      author:  'Subnet Oracle',
      category: a.kind || 'research',
    }));
  const central = newsForSubnet(subnet, 5).map(n => ({
    kind:    'central',
    date:    n.date,
    title:   n.headline,
    tagline: n.takeaway || '',
    href:    n.url || '#',
    author:  n.source,
    category: n.cat || '',
  }));
  return [...team, ...oracle, ...central].sort((a, b) =>
    (b.date || '').localeCompare(a.date || '')
  );
}

function fmtArticleDate(d){
  if (!d) return '·';
  const [y, m, dd] = String(d).split('-');
  const MON = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  return `${dd} ${MON[parseInt(m,10)-1]} ${y.slice(2)}`;
}

function renderArticleCard(a){
  const kindLbl = a.kind === 'oracle'   ? 'ORACLE'
                : a.kind === 'magazine' ? 'MAGAZINE'
                : a.kind === 'central'  ? 'CENTRAL'
                : (a.category || a.kind || '·').toString().slice(0, 4).toUpperCase();
  /* PDF viewer integration — magazine + oracle PDFs open in the
     inline research drawer (data-pdf-* hooks the global viewer
     reads); centralized news + external URLs open in a new tab. */
  const isPdf = /\.pdf(\?|$|#)/i.test(a.href || '');
  const pdfAttrs = isPdf
    ? ` data-pdf-href="${escAttr(a.href)}" data-pdf-title="${escAttr(a.title || '')}" data-pdf-kind="${a.kind}" data-pdf-date="${escAttr(a.date || '')}" data-pdf-kicker="${escAttr(a.author || '')}"`
    : '';
  /* cm-art--<kind> drives the colored LEFT accent bar (CSS
     ::before) — visual identity for the editorial spine without
     any extra DOM nodes. */
  const kindMod = a.kind ? `cm-art--${a.kind}` : '';
  return `
    <a class="cm-art ${kindMod}" href="${escAttr(a.href || '#')}" target="_blank" rel="noopener"${pdfAttrs}>
      <div class="cm-art__head">
        <span class="cm-art__kind cm-art__kind--${a.kind}">${kindLbl}</span>
        <span class="cm-art__date">${fmtArticleDate(a.date)}</span>
      </div>
      <h4 class="cm-art__title">${escAttr(a.title || '·')}</h4>
      ${a.tagline ? `<p class="cm-art__dek">${escAttr(a.tagline)}</p>` : ''}
      <div class="cm-art__foot">
        <span class="cm-art__src">${escAttr(a.author || '·')}</span>
        <span class="cm-art__read">READ ↗</span>
      </div>
    </a>`;
}

function renderHTML(s, gh, state, series){
  const range = RANGES.find(r => r.key === state.range) || RANGES[2];

  /* Articles render via renderNewsSidebar(s) called inside the
     template — composeArticles + renderArticleCard helpers below
     remain available for other call sites but the chart template
     uses the mac-session-shipped renderNewsSidebar instead. */

  const kpis = [
    { lbl: 'α PRICE',      val: fmtPrice(s.price),         chg: s.chg24, note: '24h' },
    { lbl: 'FDV',          val: fmtMcap(s.mcap),           chg: s.chg30, note: '30d' },
    { lbl: 'EMISSION',     val: fmtInt(s.emission) + 'τ',  chg: null,    note: '24h on chain' },
    { lbl: 'STAKE',        val: fmtInt(s.stake) + 'τ',     chg: null,    note: 'all validators' },
    { lbl: 'VAL · MIN',    val: fmtInt(s.validators) + '/' + fmtInt(s.miners), chg: null, note: 'active 24h' },
    { lbl: 'GH COMMITS 30D', val: gh ? fmtInt(gh.commits30d) : '·', chg: null, note: gh ? gh.pulse : 'no data' },
  ].map(k => `
    <div class="cm-kpi">
      <div class="cm-kpi__lbl">${k.lbl}</div>
      <div class="cm-kpi__val">${k.val}</div>
      <div class="cm-kpi__note ${cls(k.chg)}">
        ${k.chg != null ? `${arrow(k.chg)} ${fmtPct(k.chg)} · ` : ''}${k.note}
      </div>
    </div>`).join('');

  const rangeBtns = RANGES.map(r => `
    <button type="button"
            class="cm-range__btn ${r.key === state.range ? 'is-on' : ''}"
            data-range="${r.key}"
            title="${r.pro ? 'PRO · upgrade to unlock' : 'free'}">
      ${r.label}${r.pro ? '<span class="cm-range__pro">PRO</span>' : ''}
    </button>`).join('');

  return `
    <div class="cm-mode">
      <header class="cm-head">
        <div class="cm-head__title">
          <span class="cm-head__eyebrow">⊕ CHART · LIVE</span>
          <h2 class="cm-head__h">SN${s.netuid} · ${s.name}<span class="cm-head__cat">${catLabel(s.cat)}</span></h2>
          <div class="cm-head__sub">${s.desc || ''} <span class="cm-head__team">· team ${s.owner || '·'}</span></div>
        </div>
        <div class="cm-head__price-block">
          <div class="cm-head__price">${fmtPrice(s.price)}</div>
          <div class="cm-head__chg ${cls(s.chg24)}">${arrow(s.chg24)} ${fmtPct(s.chg24)} · 24h</div>
          <div class="cm-head__chg2 ${cls(s.chg7)}">${fmtPct(s.chg7)} · 7d</div>
          <div class="cm-head__chg2 ${cls(s.chg30)}">${fmtPct(s.chg30)} · 30d</div>
        </div>
      </header>

      <!-- Layout: data + editorial sidebar on the LEFT, chart on
           the RIGHT. Articles live WITHIN the chart frame (per
           Rondo's directive). Mobile (<1080px) collapses to a
           single column with chart on top, data + articles below. -->
      <div class="cm-grid">
        <aside class="cm-left" aria-label="Subnet data and editorial">
          <div class="cm-kpis cm-kpis--stack">${kpis}</div>
          ${renderNewsSidebar(s)}
        </aside>
        <div class="cm-main">
          <div class="cm-canvas-wrap">
            <canvas class="cm-canvas" data-chart-canvas></canvas>
            <div class="cm-tooltip" data-chart-tooltip style="display:none"></div>
          </div>
          <div class="cm-range" role="tablist" aria-label="Time range">
            ${rangeBtns}
            <span class="cm-tier ${range.pro ? 'is-pro' : ''}" data-chart-tier>
              ${range.pro ? 'PRO range' : 'FREE · 30D window'}
            </span>
          </div>
        </div>
      </div>
    </div>`;
}

/* ---------- unified article sidebar (mac + sandbox merged) -
   The merge of sibling's composeArticles (filter logic) +
   renderArticleCard (cm-art card design with kind-color chips:
   amber=mag / red=oracle / green=central) into one sidebar that
   uses sibling's CSS classes (cm-articles, cm-art) rather than
   the duplicate cm-side that grew during parallel work.

   Two surfaces:
   - EDITORIAL · SN<id>   in-house + oracle dispatches (PDFs open
                          in the inline viewer drawer via the
                          data-pdf-* attrs)
   - CENTRALIZED · CAT    newsForSubnet filtered to the subnet's
                          competitive cat space

   Empty states name the gap honestly per the editorial discipline.

   Dense card stack — title-first, date + source + kind chip on
   the meta line. No thumbnails (deliberately) so the sidebar
   stays compact; the chart is the visual focus.
*/
function renderNewsSidebar(s){
  /* Use sibling's composeArticles() filter (already imports above) —
     it catches oracle dispatches that mention the subnet by name
     even when subnetId isn't set, which my map-based lookup missed.
     Split the unified list into editorial (mag + oracle) vs.
     centralized backdrop so each section reads as its own surface. */
  const all = composeArticles(s);
  const editorial = all.filter(a => a.kind !== 'central');
  const backdrop  = all.filter(a => a.kind === 'central');

  const editHtml = editorial.length
    ? editorial.slice(0, 10).map(renderArticleCard).join('')
    : `<div class="cm-art-empty">No in-house coverage indexed for SN${s.netuid} yet. The Oracle desk rotates a deep profile when a subnet enters the top emission tier.</div>`;

  const backHtml = backdrop.length
    ? backdrop.slice(0, 6).map(renderArticleCard).join('')
    : `<div class="cm-art-empty">No centralized signals indexed for ${escAttr(catLabel(s.cat).toLowerCase())} yet.</div>`;

  return `
    <aside class="cm-articles" aria-label="News for ${escAttr(s.name)}">

      <section class="cm-articles__sec">
        <header class="cm-articles__head">
          <span class="cm-articles__lbl">EDITORIAL · SN${s.netuid}</span>
          <span class="cm-articles__n">${editorial.length}</span>
        </header>
        <div class="cm-articles__list">${editHtml}</div>
      </section>

      <section class="cm-articles__sec">
        <header class="cm-articles__head">
          <span class="cm-articles__lbl">CENTRALIZED · ${escAttr(catLabel(s.cat))}</span>
          <span class="cm-articles__n">${backdrop.length}</span>
        </header>
        <div class="cm-articles__list">${backHtml}</div>
      </section>

    </aside>`;
}
