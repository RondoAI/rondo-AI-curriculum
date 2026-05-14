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

    /* layout — room on the right for the price scale, bottom for the time axis */
    const padL = 10, padR = 58, padT = 14, padB = 24;
    const innerW = w - padL - padR;
    const innerH = h - padT - padB;
    if (innerW <= 4 || innerH <= 4) return;

    /* scale */
    let pMin = +Infinity, pMax = -Infinity;
    let tMin = +Infinity, tMax = -Infinity;
    for (const k of this.data){
      if (k.p < pMin) pMin = k.p;
      if (k.p > pMax) pMax = k.p;
      if (k.t < tMin) tMin = k.t;
      if (k.t > tMax) tMax = k.t;
    }
    /* keep the start price (reference line) inside the visible range */
    if (start < pMin) pMin = start;
    if (start > pMax) pMax = start;
    const yPad = (pMax - pMin) * 0.12 || 1;
    pMin -= yPad; pMax += yPad;

    const xFor = ts => padL + (ts - tMin) / (tMax - tMin || 1) * innerW;
    const yFor = p  => padT + (pMax - p) / (pMax - pMin || 1) * innerH;

    const lineColor = isUp ? C_UP   : C_DOWN;
    const areaTop   = isUp ? C_UP_AREA : C_DOWN_AREA;
    const areaBot   = isUp ? C_UP_FADE : C_DOWN_FADE;

    const fmtP = v => v >= 1000 ? '$' + Math.round(v).toLocaleString('en-US')
                    : v >= 1   ? '$' + v.toFixed(2)
                    :            '$' + v.toFixed(4);
    const MONO = "'JetBrains Mono', ui-monospace, monospace";

    /* ===== horizontal gridlines + right-edge price scale ===== */
    ctx.textBaseline = 'middle';
    const LEVELS = 4;
    for (let i = 0; i <= LEVELS; i++){
      const p = pMin + (i / LEVELS) * (pMax - pMin);
      const y = yFor(p);
      ctx.strokeStyle = 'rgba(255,30,60,.07)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(padL + innerW, y); ctx.stroke();
      ctx.fillStyle = 'rgba(200,168,173,.6)';
      ctx.font = `10px ${MONO}`;
      ctx.textAlign = 'left';
      ctx.fillText(fmtP(p), padL + innerW + 7, y);
    }

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

    /* ===== dotted reference line at start price + pill ======= */
    const yRef = yFor(start);
    ctx.setLineDash([3, 4]);
    ctx.strokeStyle = C_REF;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padL, yRef); ctx.lineTo(padL + innerW, yRef);
    ctx.stroke();
    ctx.setLineDash([]);
    {
      const label = fmtP(start);
      ctx.font = `10px ${MONO}`;
      const tw = ctx.measureText(label).width;
      const px = padL + 2;
      ctx.fillStyle = 'rgba(20,5,9,.94)';
      ctx.strokeStyle = C_REF;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.rect(px, yRef - 8, tw + 10, 16); ctx.fill(); ctx.stroke();
      ctx.fillStyle = 'rgba(200,168,173,.85)';
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillText(label, px + 5, yRef);
    }

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

    /* latest-point dot */
    const lastK = this.data[this.data.length - 1];
    ctx.beginPath();
    ctx.arc(xFor(lastK.t), yFor(lastK.p), 3, 0, Math.PI * 2);
    ctx.fillStyle = lineColor;
    ctx.fill();

    /* ===== time axis ======================================== */
    {
      const span = tMax - tMin;
      const day = 86_400_000;
      const fmtT = ts => {
        const d = new Date(ts);
        if (span > 80 * day) return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        if (span > 2 * day)  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const z = n => String(n).padStart(2, '0');
        return `${z(d.getUTCHours())}:${z(d.getUTCMinutes())}`;
      };
      ctx.fillStyle = 'rgba(139,107,112,.75)';
      ctx.font = `9.5px ${MONO}`;
      ctx.textBaseline = 'alphabetic';
      const TICKS = 4;
      for (let i = 0; i <= TICKS; i++){
        const ts = tMin + (i / TICKS) * span;
        ctx.textAlign = i === 0 ? 'left' : i === TICKS ? 'right' : 'center';
        ctx.fillText(fmtT(ts), xFor(ts), padT + innerH + 15);
      }
    }

    /* ===== optional event dots on the line =================== */
    if (this.showEvents && this.events.length){
      for (const ev of this.events){
        const ts = Date.parse(ev.date + 'T00:00:00Z');
        if (ts < tMin || ts > tMax) continue;
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

        ctx.strokeStyle = 'rgba(245,229,232,.18)';
        ctx.lineWidth = 0.6;
        ctx.beginPath(); ctx.moveTo(x, padT); ctx.lineTo(x, padT + innerH); ctx.stroke();

        ctx.fillStyle = C_INK;
        ctx.shadowColor = lineColor; ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;

        if (this.onHover){
          const change = nearest.p - start;
          const pct = (change / start) * 100;
          this.onHover({ price: nearest.p, date: new Date(nearest.t), change, pct });
        }
      }
    }
  }
}
