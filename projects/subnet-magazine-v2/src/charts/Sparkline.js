/* =================================================================
   SUBNET MAGAZINE — SPARKLINE
   -----------------------------------------------------------------
   The tiny inline trend line that rides next to a price anywhere a
   row or card needs to show direction at a glance — subnet grids,
   directory tables, quote boards.

   Deliberately minimal: no axes, no labels, no hover. Just a smooth
   line plus a soft area fill, colored green/red by net direction
   (the house "up is green" rule). One dot marks the latest point.

   Static chart — paints once per setData(), no rAF loop.
   ================================================================= */

import { Chart } from './Chart.js';

const C_UP   = '#00E5A8';
const C_DOWN = '#FF4D6D';
const C_FLAT = '#8B6B70';

export class Sparkline extends Chart {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {{ series?: number[], lineWidth?: number, fill?: boolean }} [opts]
   */
  constructor(canvas, opts = {}){
    super(canvas, { animate: false });
    /** @private */ this.series    = Array.isArray(opts.series) ? opts.series : [];
    /** @private */ this.lineWidth = opts.lineWidth ?? 1.5;
    /** @private */ this.fill      = opts.fill !== false;
  }

  /** @param {number[]} series */
  setData(series){
    this.series = Array.isArray(series) ? series : [];
    this.invalidate();
  }

  draw(ctx, w, h){
    ctx.clearRect(0, 0, w, h);
    const s = this.series;
    if (s.length < 2) return;

    const pad = this.lineWidth + 1;
    let min = Infinity, max = -Infinity;
    for (const v of s){ if (v < min) min = v; if (v > max) max = v; }
    const span = max - min || 1;

    const x = i => pad + (i / (s.length - 1)) * (w - pad * 2);
    const y = v => h - pad - ((v - min) / span) * (h - pad * 2);

    const up   = s[s.length - 1] - s[0];
    const color = up > 0 ? C_UP : up < 0 ? C_DOWN : C_FLAT;

    /* area fill */
    if (this.fill){
      ctx.beginPath();
      ctx.moveTo(x(0), h);
      for (let i = 0; i < s.length; i++) ctx.lineTo(x(i), y(s[i]));
      ctx.lineTo(x(s.length - 1), h);
      ctx.closePath();
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, hexA(color, 0.22));
      g.addColorStop(1, hexA(color, 0));
      ctx.fillStyle = g;
      ctx.fill();
    }

    /* line */
    ctx.beginPath();
    ctx.moveTo(x(0), y(s[0]));
    for (let i = 1; i < s.length; i++) ctx.lineTo(x(i), y(s[i]));
    ctx.strokeStyle = color;
    ctx.lineWidth = this.lineWidth;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke();

    /* latest-point dot */
    ctx.beginPath();
    ctx.arc(x(s.length - 1), y(s[s.length - 1]), this.lineWidth + 0.6, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }
}

/** Apply an alpha to a #RRGGBB hex → rgba() string. */
function hexA(hex, a){
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}
