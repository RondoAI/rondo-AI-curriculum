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

/* ---------- canvas draw (price area + volume bars) --------- */
function drawChart(canvas, series, range){
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

  // Return hit-test for crosshair tooltip
  return {
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

  root.innerHTML = renderHTML(s, gh, state, series);

  const canvas    = root.querySelector('[data-chart-canvas]');
  const tooltipEl = root.querySelector('[data-chart-tooltip]');
  let hit = null;

  const draw = () => {
    const range = RANGES.find(r => r.key === state.range) || RANGES[2];
    hit = drawChart(canvas, series, range);
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

  // Hover crosshair tooltip
  const onMove = (ev) => {
    if (!hit) return;
    const r = canvas.getBoundingClientRect();
    const x = ev.clientX - r.left, y = ev.clientY - r.top;
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
    window.removeEventListener('resize', onResize);
  };
}

function renderHTML(s, gh, state, series){
  const range = RANGES.find(r => r.key === state.range) || RANGES[2];

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

      <div class="cm-kpis">${kpis}</div>
    </div>`;
}
