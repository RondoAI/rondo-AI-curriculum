/* =================================================================
   SUBNET MAGAZINE — PRICE CHART (Apple Stocks / Public.com style)
   -----------------------------------------------------------------
   The clean stock-app price chart. Pure smooth line, dynamic color
   (green when the period is up, red when down), dotted horizontal
   reference at the start price, hover crosshair with date + price
   tooltip. No axis labels — those clutter the small view; the
   header above (price, delta) and the tooltip on hover do the
   heavy lifting.

   The big bold "$487.12 / +3.24%" header is rendered in HTML by
   the panel that hosts the canvas, NOT inside the canvas itself.
   That keeps fonts crisp at any DPR and lets the user select text.

   Optional event dots can ride the line (small circles colored by
   category). They light up on hover to show the event story.
   ================================================================= */

import { Chart } from './Chart.js';

const C_UP        = '#21CE99';    /* Robinhood-green */
const C_UP_AREA   = 'rgba(33,206,153,.18)';
const C_UP_FADE   = 'rgba(33,206,153,0)';
const C_DOWN      = '#FF4D6D';
const C_DOWN_AREA = 'rgba(255,77,109,.18)';
const C_DOWN_FADE = 'rgba(255,77,109,0)';
const C_REF       = 'rgba(245,229,232,.30)';
const C_INK       = '#F5E5E8';

export class PriceChart extends Chart {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {{
   *   data?: { t: number, p: number }[],
   *   events?: { date: string, title: string, cat: string, body?: string }[],
   *   eventColors?: Record<string, string>,
   *   showEvents?: boolean,
   *   onHover?: (state: { price: number, date: Date, change: number, pct: number } | null) => void,
   * }} [opts]
   */
  constructor(canvas, opts = {}){
    super(canvas, { animate: false });
    /** @private */ this.data        = opts.data ?? [];
    /** @private */ this.events      = opts.events ?? [];
    /** @private */ this.eventColors = opts.eventColors ?? {};
    /** @private */ this.showEvents  = opts.showEvents !== false;
    /** @private */ this.onHover     = opts.onHover ?? null;
    /** @private */ this.hover       = null;

    canvas.addEventListener('pointermove', e => {
      const r = canvas.getBoundingClientRect();
      this.hover = { x: e.clientX - r.left, y: e.clientY - r.top };
      this.invalidate();
    });
    canvas.addEventListener('pointerleave', () => {
      this.hover = null;
      if (this.onHover) this.onHover(null);
      this.invalidate();
    });
  }

  setData(data){
    this.data = data ?? [];
    this.invalidate();
  }

  setShowEvents(flag){
    this.showEvents = !!flag;
    this.invalidate();
  }

  /** Public: derived stats for the current dataset. */
  stats(){
    if (this.data.length < 2) return { start: 0, end: 0, change: 0, pct: 0, isUp: true };
    const start = this.data[0].p;
    const end   = this.data[this.data.length - 1].p;
    const change = end - start;
    const pct = (change / start) * 100;
    return { start, end, change, pct, isUp: change >= 0 };
  }

  draw(ctx, w, h){
    ctx.clearRect(0, 0, w, h);
    if (this.data.length < 2) return;

    const { start, isUp } = this.stats();

    /* layout — leave a tiny pad so the line never kisses the edges */
    const padL = 8, padR = 8, padT = 12, padB = 12;
    const innerW = w - padL - padR;
    const innerH = h - padT - padB;

    /* scale */
    let pMin = +Infinity, pMax = -Infinity;
    let tMin = +Infinity, tMax = -Infinity;
    for (const k of this.data){
      if (k.p < pMin) pMin = k.p;
      if (k.p > pMax) pMax = k.p;
      if (k.t < tMin) tMin = k.t;
      if (k.t > tMax) tMax = k.t;
    }
    /* include the start price in the visible range so the dotted
       reference line is always inside the chart */
    if (start < pMin) pMin = start;
    if (start > pMax) pMax = start;
    const yPad = (pMax - pMin) * 0.10 || 1;
    pMin -= yPad; pMax += yPad;

    const xFor = ts => padL + (ts - tMin) / (tMax - tMin) * innerW;
    const yFor = p  => padT + (pMax - p) / (pMax - pMin) * innerH;

    const lineColor = isUp ? C_UP   : C_DOWN;
    const areaTop   = isUp ? C_UP_AREA : C_DOWN_AREA;
    const areaBot   = isUp ? C_UP_FADE : C_DOWN_FADE;

    /* ===== area fill underneath the line ===================== */
    const grad = ctx.createLinearGradient(0, padT, 0, padT + innerH);
    grad.addColorStop(0, areaTop);
    grad.addColorStop(1, areaBot);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(xFor(this.data[0].t), padT + innerH);
    for (const k of this.data) ctx.lineTo(xFor(k.t), yFor(k.p));
    ctx.lineTo(xFor(this.data[this.data.length - 1].t), padT + innerH);
    ctx.closePath();
    ctx.fill();

    /* ===== dotted reference line at start price ============== */
    const yRef = yFor(start);
    ctx.setLineDash([3, 4]);
    ctx.strokeStyle = C_REF;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padL, yRef); ctx.lineTo(padL + innerW, yRef);
    ctx.stroke();
    ctx.setLineDash([]);

    /* ===== smooth solid price line =========================== */
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < this.data.length; i++){
      const k = this.data[i];
      const x = xFor(k.t), y = yFor(k.p);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    /* ===== optional event dots on the line =================== */
    if (this.showEvents && this.events.length){
      for (const ev of this.events){
        const ts = Date.parse(ev.date + 'T00:00:00Z');
        if (ts < tMin || ts > tMax) continue;
        /* find nearest data point's y so the dot rides the line */
        let nearest = this.data[0];
        for (const k of this.data) if (Math.abs(k.t - ts) < Math.abs(nearest.t - ts)) nearest = k;
        const x = xFor(ts), y = yFor(nearest.p);
        const color = this.eventColors[ev.cat] || lineColor;
        ctx.fillStyle = color;
        ctx.shadowColor = color; ctx.shadowBlur = 6;
        ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    /* ===== hover: crosshair + dot + emit callback ============ */
    if (this.hover){
      const hx = this.hover.x;
      if (hx >= padL && hx <= padL + innerW){
        const ts = tMin + (hx - padL) / innerW * (tMax - tMin);
        let nearest = this.data[0];
        for (const k of this.data) if (Math.abs(k.t - ts) < Math.abs(nearest.t - ts)) nearest = k;
        const x = xFor(nearest.t), y = yFor(nearest.p);

        /* faint crosshair line */
        ctx.strokeStyle = 'rgba(245,229,232,.18)';
        ctx.lineWidth = 0.6;
        ctx.beginPath(); ctx.moveTo(x, padT); ctx.lineTo(x, padT + innerH); ctx.stroke();

        /* dot on the line */
        ctx.fillStyle = C_INK;
        ctx.shadowColor = lineColor; ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;

        /* notify host */
        if (this.onHover){
          const change = nearest.p - start;
          const pct = (change / start) * 100;
          this.onHover({ price: nearest.p, date: new Date(nearest.t), change, pct });
        }
      }
    }
  }
}
