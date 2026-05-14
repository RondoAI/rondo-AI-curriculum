/* =================================================================
   SUBNET MAGAZINE — TIMELINE CHART
   -----------------------------------------------------------------
   A beautiful, readable τ/USD timeline. Two layers:

     - Smooth price line (Catmull-Rom interpolation) with a soft
       area fill underneath. The whole thing reads at a glance.
     - Event ribbon overlaid at the bottom: every major Bittensor
       or AI-ecosystem milestone gets a vertical tick and a colored
       category dot. Hover any tick for the full event story.

   Designed to replace the candle chart as the "marquee" view of
   τ/USD. Candles are for traders; this is for storytelling.
   ================================================================= */

import { Chart } from './Chart.js';
import { EVENTS, EVENT_COLORS, EVENT_LABELS, eventMs } from '../data/events.js';

const C_LINE        = '#FF6B7A';
const C_LINE_GLOW   = 'rgba(255,107,122,.45)';
const C_AREA_TOP    = 'rgba(255,30,60,.35)';
const C_AREA_MID    = 'rgba(255,30,60,.10)';
const C_AREA_BOT    = 'rgba(255,30,60,0)';
const C_GRID        = 'rgba(255,30,60,.05)';
const C_AXIS        = 'rgba(232,200,205,.55)';
const C_AXIS_DIM    = 'rgba(232,200,205,.32)';
const C_INK         = '#F5E5E8';
const C_PRICE_TAG_BG = '#FF1E3C';

/* ---------- Synthetic τ/USD history (32 months) ---------- */

/** Stable seeded RNG so the chart doesn't shuffle on every load. */
function rng(seed){
  let s = seed >>> 0;
  return () => {
    s = (s * 9301 + 49297) >>> 0;
    return ((s % 233280) / 233280);
  };
}

/** Smooth interpolated walk hitting the documented waypoints,
    plus small daily noise. Returns ~32 months of daily samples. */
function buildPriceHistory(){
  const waypoints = [
    /* date, price — anchored on real history shape */
    ['2023-09-01',  35], ['2023-12-15', 220],
    ['2024-04-10', 700], ['2024-07-05', 320],
    ['2024-11-20', 600], ['2025-02-20', 700],
    ['2025-06-10', 380], ['2025-09-30', 410],
    ['2025-12-15', 520], ['2026-02-01', 460],
    ['2026-04-15', 510], ['2026-05-13', 487],
  ].map(([d, p]) => ({ t: Date.parse(d + 'T00:00:00Z'), p }));

  /* Interpolate to daily granularity with a touch of noise. */
  const out = [];
  const dayMs = 86_400_000;
  const r = rng(20260513);
  for (let i = 0; i < waypoints.length - 1; i++){
    const a = waypoints[i], b = waypoints[i + 1];
    const days = Math.round((b.t - a.t) / dayMs);
    for (let k = 0; k < days; k++){
      const u = k / days;
      const easeU = u < .5 ? 2*u*u : 1 - Math.pow(-2*u + 2, 2) / 2;
      const base = a.p + (b.p - a.p) * easeU;
      const noise = (r() - 0.5) * base * 0.08;
      out.push({ t: a.t + k * dayMs, p: Math.max(10, base + noise) });
    }
  }
  out.push({ t: waypoints[waypoints.length - 1].t, p: waypoints[waypoints.length - 1].p });
  return out;
}

const HISTORY = buildPriceHistory();

/* ---------- Class ---------- */

export class Timeline extends Chart {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {{ priceData?: {t:number,p:number}[] }} [opts]
   */
  constructor(canvas, opts = {}){
    super(canvas, { animate: true });
    /** @private */ this.data    = opts.priceData ?? HISTORY;
    /** @private */ this.hover   = null;     // {x,y}
    /** @private */ this.hoverEv = null;     // event idx
    canvas.addEventListener('pointermove', e => {
      const r = canvas.getBoundingClientRect();
      this.hover = { x: e.clientX - r.left, y: e.clientY - r.top };
      this.invalidate();
    });
    canvas.addEventListener('pointerleave', () => {
      this.hover = null;
      this.hoverEv = null;
      this.invalidate();
    });
  }

  /** Replace the price data wholesale. */
  setData(rows){
    if (!Array.isArray(rows) || !rows.length) return;
    this.data = rows.slice();
    this.invalidate();
  }

  draw(ctx, w, h, t){
    ctx.clearRect(0, 0, w, h);

    /* ===== layout ============================================ */
    const padL = 22;
    const padR = 76;            // room for the price tag
    const padT = 28;
    const ribbonH = 56;
    const padB = ribbonH + 18;

    const innerW = w - padL - padR;
    const lineH  = h - padT - padB;

    /* ===== price scale ====================================== */
    let pMin = +Infinity, pMax = -Infinity;
    let tMin = +Infinity, tMax = -Infinity;
    for (const k of this.data){
      if (k.p < pMin) pMin = k.p;
      if (k.p > pMax) pMax = k.p;
      if (k.t < tMin) tMin = k.t;
      if (k.t > tMax) tMax = k.t;
    }
    const yPad = (pMax - pMin) * 0.08 || 1;
    pMin -= yPad; pMax += yPad;
    const yFor = p => padT + (pMax - p) / (pMax - pMin) * lineH;
    const xFor = ts => padL + (ts - tMin) / (tMax - tMin) * innerW;

    /* ===== background grid ================================== */
    ctx.strokeStyle = C_GRID;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let g = 0; g <= 4; g++){
      const y = padT + (lineH * g) / 4;
      ctx.moveTo(padL, y); ctx.lineTo(w - padR, y);
    }
    ctx.stroke();

    /* ===== price-axis labels (right side) =================== */
    ctx.font = '600 10.5px JetBrains Mono, monospace';
    ctx.fillStyle = C_AXIS;
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    for (let g = 0; g <= 4; g++){
      const p = pMax - (pMax - pMin) * (g / 4);
      const y = padT + (lineH * g) / 4;
      ctx.fillText(`$${Math.round(p)}`, w - padR + 6, y);
    }

    /* ===== time-axis labels (year + month) ================== */
    ctx.fillStyle = C_AXIS_DIM;
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    const yearMs = 365.25 * 86_400_000;
    const span = tMax - tMin;
    const stepMs = span > 2.5 * yearMs ? 0.5 * yearMs : 0.25 * yearMs;
    for (let ts = Math.ceil(tMin / stepMs) * stepMs; ts <= tMax; ts += stepMs){
      const d = new Date(ts);
      const x = xFor(ts);
      const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
      const year = d.getUTCFullYear();
      ctx.fillText(`${month} ${year}`, x, h - padB + 6);
      /* faint axis tick */
      ctx.strokeStyle = C_GRID;
      ctx.beginPath(); ctx.moveTo(x, padT); ctx.lineTo(x, h - padB); ctx.stroke();
    }

    /* ===== area fill underneath the line ==================== */
    const grad = ctx.createLinearGradient(0, padT, 0, padT + lineH);
    grad.addColorStop(0,   C_AREA_TOP);
    grad.addColorStop(0.55,C_AREA_MID);
    grad.addColorStop(1,   C_AREA_BOT);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(xFor(this.data[0].t), padT + lineH);
    for (const k of this.data) ctx.lineTo(xFor(k.t), yFor(k.p));
    ctx.lineTo(xFor(this.data[this.data.length - 1].t), padT + lineH);
    ctx.closePath();
    ctx.fill();

    /* ===== smooth price line (Catmull-Rom-ish via quad) ===== */
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.strokeStyle = C_LINE;
    ctx.lineWidth = 2;
    ctx.shadowColor = C_LINE_GLOW;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    for (let i = 0; i < this.data.length; i++){
      const k = this.data[i];
      const x = xFor(k.t), y = yFor(k.p);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    /* ===== event ribbon ===================================== */
    const ribbonY = h - padB + 22;       // top of the ribbon
    /* baseline */
    ctx.strokeStyle = 'rgba(255,30,60,.18)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padL, ribbonY + 18); ctx.lineTo(w - padR, ribbonY + 18);
    ctx.stroke();

    /* event ticks + dots + labels */
    const labelSlots = [];
    /* sort events by date so labels are placed in order */
    for (let i = 0; i < EVENTS.length; i++){
      const ev = EVENTS[i];
      const ts = eventMs(ev);
      if (ts < tMin || ts > tMax) continue;
      const x = xFor(ts);
      const color = EVENT_COLORS[ev.cat];

      /* full-height tick (very faint above the area, more visible below) */
      ctx.strokeStyle = `rgba(255,30,60,${i === this.hoverEv ? 0.55 : 0.18})`;
      ctx.lineWidth = i === this.hoverEv ? 1.2 : 0.6;
      ctx.beginPath();
      ctx.moveTo(x, padT); ctx.lineTo(x, ribbonY + 18);
      ctx.stroke();

      /* dot on the ribbon baseline */
      ctx.fillStyle = color;
      ctx.shadowColor = color; ctx.shadowBlur = i === this.hoverEv ? 12 : 6;
      ctx.beginPath();
      ctx.arc(x, ribbonY + 18, i === this.hoverEv ? 5 : 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      /* label above the dot with simple anti-collision */
      ctx.font = '600 9.5px JetBrains Mono, monospace';
      const labelTxt = ev.title;
      const tw = ctx.measureText(labelTxt).width;
      let labelX = x;
      /* shift to keep on canvas */
      if (labelX - tw / 2 < padL) labelX = padL + tw / 2;
      if (labelX + tw / 2 > w - padR) labelX = w - padR - tw / 2;
      /* stack vertically if collides */
      const baseY = ribbonY + 6;
      let row = 0;
      while (labelSlots.some(s => Math.abs(s.x - labelX) < tw / 2 + 8 && s.row === row)){
        row += 1; if (row > 1) break;
      }
      labelSlots.push({ x: labelX, row });
      const labelY = baseY - row * 12;
      ctx.fillStyle = i === this.hoverEv ? C_INK : 'rgba(232,200,205,.78)';
      ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
      ctx.fillText(labelTxt, labelX, labelY);
    }

    /* ===== category legend in the top-left ================= */
    ctx.font = '600 9.5px JetBrains Mono, monospace';
    ctx.textBaseline = 'middle';
    let lx = padL;
    for (const cat of Object.keys(EVENT_COLORS)){
      ctx.fillStyle = EVENT_COLORS[cat];
      ctx.beginPath(); ctx.arc(lx + 4, 14, 3.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = C_AXIS;
      ctx.textAlign = 'left';
      ctx.fillText(EVENT_LABELS[cat], lx + 12, 14);
      lx += 12 + ctx.measureText(EVENT_LABELS[cat]).width + 14;
    }

    /* ===== current price tag (right side, glowing) ========= */
    const last = this.data[this.data.length - 1];
    if (last){
      const ly = yFor(last.p);
      /* dashed reference line */
      ctx.strokeStyle = 'rgba(255,107,122,.30)';
      ctx.setLineDash([4, 4]); ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.moveTo(padL, ly); ctx.lineTo(w - padR, ly); ctx.stroke();
      ctx.setLineDash([]);

      /* tag */
      const tag = `τ $${last.p.toFixed(2)}`;
      ctx.font = '700 12px JetBrains Mono, monospace';
      const tw = ctx.measureText(tag).width;
      const tagW = tw + 14, tagH = 22;
      const tagX = w - padR + 4;
      ctx.fillStyle = C_PRICE_TAG_BG;
      ctx.shadowColor = C_PRICE_TAG_BG; ctx.shadowBlur = 12;
      ctx.fillRect(tagX, ly - tagH / 2, tagW, tagH);
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#000';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(tag, tagX + tagW / 2, ly);
    }

    /* ===== hover: crosshair + readout ====================== */
    if (this.hover){
      /* did we hover an event tick? */
      this.hoverEv = null;
      for (let i = 0; i < EVENTS.length; i++){
        const ev = EVENTS[i];
        const ts = eventMs(ev);
        if (ts < tMin || ts > tMax) continue;
        const x = xFor(ts);
        if (Math.abs(this.hover.x - x) < 6 && this.hover.y > ribbonY - 4){
          this.hoverEv = i; break;
        }
      }
      const hx = this.hover.x;
      if (hx >= padL && hx <= w - padR){
        /* nearest price point */
        const ts = tMin + (hx - padL) / innerW * (tMax - tMin);
        let nearest = this.data[0];
        for (const k of this.data) if (Math.abs(k.t - ts) < Math.abs(nearest.t - ts)) nearest = k;
        const px = xFor(nearest.t), py = yFor(nearest.p);
        /* vertical crosshair */
        ctx.strokeStyle = 'rgba(245,229,232,.30)';
        ctx.lineWidth = 0.7;
        ctx.beginPath(); ctx.moveTo(px, padT); ctx.lineTo(px, padT + lineH); ctx.stroke();
        /* dot on the line */
        ctx.fillStyle = C_INK;
        ctx.shadowColor = C_LINE_GLOW; ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.arc(px, py, 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;

        /* tooltip */
        const d = new Date(nearest.t);
        const z = n => String(n).padStart(2, '0');
        const lines = this.hoverEv != null
          ? [
              EVENTS[this.hoverEv].title,
              `${d.toLocaleDateString('en-US', { day:'2-digit', month:'short', year:'numeric' })}   τ $${nearest.p.toFixed(2)}`,
              `${EVENT_LABELS[EVENTS[this.hoverEv].cat]} · ${EVENTS[this.hoverEv].body || ''}`,
            ]
          : [
              `${d.toLocaleDateString('en-US', { day:'2-digit', month:'short', year:'numeric' })}`,
              `τ $${nearest.p.toFixed(2)}`,
            ];
        ctx.font = '600 11px JetBrains Mono, monospace';
        let tw = 0;
        for (const ln of lines) tw = Math.max(tw, ctx.measureText(ln).width);
        tw = Math.min(tw, w * 0.55);
        const padX = 10, padY = 7, lh = 14;
        const bh = lines.length * lh + padY * 2 - 2;
        const bw = tw + padX * 2;
        let bx = Math.min(w - bw - 6, px + 12);
        let by = Math.max(8, Math.min(padT + lineH - bh - 4, py - bh - 12));
        if (bx < 6) bx = 6;
        ctx.fillStyle = 'rgba(0,0,0,.86)';
        ctx.fillRect(bx, by, bw, bh);
        ctx.strokeStyle = 'rgba(255,30,60,.45)';
        ctx.strokeRect(bx + 0.5, by + 0.5, bw - 1, bh - 1);
        ctx.fillStyle = C_INK;
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        lines.forEach((ln, i) => {
          /* truncate wide single-line content */
          let s = ln;
          while (ctx.measureText(s).width > tw && s.length > 4) s = s.slice(0, -2) + '…';
          ctx.fillText(s, bx + padX, by + padY + i * lh);
        });
      }
    }

    /* keep animation alive — the price tag glow pulses slightly */
    void t;
  }
}
