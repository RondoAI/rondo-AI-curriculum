/* =================================================================
   SUBNET MAGAZINE — LIVE CHART
   -----------------------------------------------------------------
   A real-time line chart that builds itself from a stream of ticks.
   The hosting view subscribes to a DataLayer channel and calls
   push(value) on every update; the chart keeps a rolling window and
   draws a smooth line, soft area fill, a moving grid, and a pulsing
   "now" dot so the feed visibly breathes.

   This is genuinely live data — there is no synthesized history.
   The series starts from the first real tick and grows as the feed
   delivers more, so a fresh page shows "building…" until it has a
   couple of points.
   ================================================================= */

import { Chart } from './Chart.js';

const C_LINE = '#FF1E3C';
const C_LINE_SOFT = '#FF4D60';
const C_GRID = 'rgba(255,30,60,.07)';
const C_INK = '#8B6B70';

export class LiveChart extends Chart {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {{ maxPoints?: number, fmt?: (n:number)=>string }} [opts]
   */
  constructor(canvas, opts = {}){
    super(canvas, { animate: true });
    /** @private */ this.points    = [];          /* {t, p} */
    /** @private */ this.maxPoints = opts.maxPoints ?? 90;
    /** @private */ this.fmt       = opts.fmt || (n => String(n));
  }

  /** Append one real tick. */
  push(value){
    if (value == null || isNaN(+value)) return;
    this.points.push({ t: Date.now(), p: +value });
    if (this.points.length > this.maxPoints) this.points.shift();
  }

  draw(ctx, w, h, t){
    ctx.clearRect(0, 0, w, h);
    const pad = { l: 8, r: 56, t: 14, b: 16 };
    const plotW = w - pad.l - pad.r;
    const plotH = h - pad.t - pad.b;

    /* grid — a slow horizontal drift so an empty chart still lives */
    ctx.strokeStyle = C_GRID;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++){
      const y = pad.t + (i / 4) * plotH;
      ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(pad.l + plotW, y); ctx.stroke();
    }
    const drift = (t * 14) % (plotW / 6);
    for (let x = pad.l + plotW - drift; x > pad.l; x -= plotW / 6){
      ctx.beginPath(); ctx.moveTo(x, pad.t); ctx.lineTo(x, pad.t + plotH); ctx.stroke();
    }

    const pts = this.points;
    if (pts.length < 2){
      ctx.fillStyle = C_INK;
      ctx.font = "11px 'JetBrains Mono', monospace";
      ctx.textAlign = 'center';
      ctx.fillText(pts.length ? 'LIVE · building feed…' : 'waiting for first tick…', w / 2, h / 2);
      if (pts.length){
        /* show the one value we do have */
        ctx.fillStyle = C_LINE;
        ctx.textAlign = 'right';
        ctx.fillText(this.fmt(pts[0].p), w - 6, pad.t + 4);
      }
      return;
    }

    let min = Infinity, max = -Infinity;
    for (const q of pts){ if (q.p < min) min = q.p; if (q.p > max) max = q.p; }
    const span = max - min || Math.abs(max) * 0.01 || 1;
    /* pad the range a touch so the line never kisses the edges */
    min -= span * 0.12; max += span * 0.12;
    const range = max - min;

    const x = i => pad.l + (i / (pts.length - 1)) * plotW;
    const y = v => pad.t + plotH - ((v - min) / range) * plotH;

    /* area fill */
    ctx.beginPath();
    ctx.moveTo(x(0), pad.t + plotH);
    pts.forEach((q, i) => ctx.lineTo(x(i), y(q.p)));
    ctx.lineTo(x(pts.length - 1), pad.t + plotH);
    ctx.closePath();
    const g = ctx.createLinearGradient(0, pad.t, 0, pad.t + plotH);
    g.addColorStop(0, 'rgba(255,30,60,.28)');
    g.addColorStop(1, 'rgba(255,30,60,0)');
    ctx.fillStyle = g;
    ctx.fill();

    /* line */
    ctx.beginPath();
    pts.forEach((q, i) => (i ? ctx.lineTo(x(i), y(q.p)) : ctx.moveTo(x(i), y(q.p))));
    ctx.strokeStyle = C_LINE;
    ctx.lineWidth = 1.75;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke();

    /* pulsing "now" dot */
    const last = pts[pts.length - 1];
    const lx = x(pts.length - 1), ly = y(last.p);
    const pulse = (Math.sin(t * 3) + 1) / 2;            /* 0..1 */
    ctx.beginPath();
    ctx.arc(lx, ly, 4 + pulse * 5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,30,60,${(0.28 * (1 - pulse)).toFixed(3)})`;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(lx, ly, 3, 0, Math.PI * 2);
    ctx.fillStyle = C_LINE;
    ctx.fill();

    /* current value, pinned right */
    ctx.fillStyle = C_LINE_SOFT;
    ctx.font = "600 12px 'JetBrains Mono', monospace";
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.fmt(last.p), lx + 8, ly);

    /* min / max ticks */
    ctx.fillStyle = C_INK;
    ctx.font = "10px 'JetBrains Mono', monospace";
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(this.fmt(max + 0), pad.l + plotW + 6, pad.t + 8);
    ctx.fillText(this.fmt(min + 0), pad.l + plotW + 6, pad.t + plotH);
  }
}
