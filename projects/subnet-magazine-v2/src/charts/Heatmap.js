/* =================================================================
   SUBNET MAGAZINE, HEATMAP
   -----------------------------------------------------------------
   A grid of cells where each cell is one subnet. Cell color is
   driven by 24h % change: deep-red for losses, bright-red for
   gains, mid-tone for flat. Cell label is the netuid; hover reveals
   the full subnet info as a tooltip.

   Used as the upper-right panel in the TAO Terminal.
   ================================================================= */

import { Chart } from './Chart.js';

const RED       = '#FF1E3C';
const C_INK     = '#F5E5E8';

/**
 * Map a signed % change into an rgb color: deep-red below zero,
 * neutral-dark around zero, bright-red above zero.
 * @param {number} v   percent change
 * @returns {string}
 */
function heatColor(v){
  const t = Math.max(-25, Math.min(25, v)) / 25;   // -1..1
  if (t >= 0){
    /* dark wine → bright red */
    const r = Math.round(  60 + 195 * t);          //  60..255
    const g = Math.round(  10 +  20 * (1 - Math.abs(t)));
    const b = Math.round(  20 +  40 * (1 - t));    //  60..20
    return `rgb(${r},${g},${b})`;
  } else {
    /* dark gray → blood red */
    const k = -t;
    const r = Math.round(  35 +  95 * k);          //  35..130
    const g = Math.round(  10 +   6 * k);
    const b = Math.round(  16 +  18 * k);
    return `rgb(${r},${g},${b})`;
  }
}

export class Heatmap extends Chart {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {{
   *   cells?: { netuid: number, name: string, value: number, cat?: string }[]
   * }} [opts]
   */
  constructor(canvas, opts = {}){
    super(canvas, { animate: false });
    /** @private */ this.cells = opts.cells ?? [];
    /** @private */ this.hover = null;
    /** @private */ this.geom = null;   // {cols, rows, cellW, cellH, padL, padT}
    canvas.addEventListener('pointermove', e => {
      const r = canvas.getBoundingClientRect();
      this.hover = { x: e.clientX - r.left, y: e.clientY - r.top };
      this.invalidate();
    });
    canvas.addEventListener('pointerleave', () => { this.hover = null; this.invalidate(); });
  }

  /** @param {Heatmap['cells']} cells */
  setData(cells){
    this.cells = Array.isArray(cells) ? cells.slice() : [];
    this.invalidate();
  }

  layout(ctx, w, h){
    const n = this.cells.length || 1;
    const aspect = w / h;
    const cols = Math.max(1, Math.ceil(Math.sqrt(n * aspect)));
    const rows = Math.max(1, Math.ceil(n / cols));
    const padL = 8, padR = 8, padT = 8, padB = 8;
    const cellW = (w - padL - padR) / cols;
    const cellH = (h - padT - padB) / rows;
    this.geom = { cols, rows, cellW, cellH, padL, padT };
  }

  draw(ctx, w, h){
    ctx.clearRect(0, 0, w, h);
    if (!this.geom) this.layout(ctx, w, h);
    const { cols, cellW, cellH, padL, padT } = this.geom;
    const gap = 2;

    for (let i = 0; i < this.cells.length; i++){
      const c = this.cells[i];
      const col = i % cols;
      const row = (i - col) / cols;
      const x = padL + col * cellW;
      const y = padT + row * cellH;
      const cw = cellW - gap;
      const ch = cellH - gap;

      ctx.fillStyle = heatColor(c.value);
      ctx.fillRect(x, y, cw, ch);

      /* netuid label only if cell is big enough */
      if (cw > 22 && ch > 16){
        ctx.font = '700 10px JetBrains Mono, monospace';
        ctx.fillStyle = 'rgba(245,229,232,.85)';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(`SN${c.netuid}`, x + cw / 2, y + ch / 2);
      }
    }

    /* hover overlay */
    if (this.hover){
      const i = this._hitTest(this.hover.x, this.hover.y);
      if (i >= 0){
        const c = this.cells[i];
        const col = i % cols;
        const row = (i - col) / cols;
        const x = padL + col * cellW;
        const y = padT + row * cellH;
        const cw = cellW - gap;
        const ch = cellH - gap;
        /* highlight border */
        ctx.strokeStyle = C_INK;
        ctx.lineWidth = 1.6;
        ctx.strokeRect(x + 0.8, y + 0.8, cw - 1.6, ch - 1.6);
        /* tooltip */
        const sign = c.value >= 0 ? '+' : '';
        const txt1 = `SN${c.netuid}  ${c.name}`;
        const txt2 = `${sign}${c.value.toFixed(2)}%`;
        ctx.font = '600 11px JetBrains Mono, monospace';
        const tw = Math.max(ctx.measureText(txt1).width, ctx.measureText(txt2).width);
        const bw = tw + 14, bh = 32;
        let bx = x + cw + 8, by = y;
        if (bx + bw > w) bx = x - bw - 8;
        if (by + bh > h) by = h - bh - 4;
        if (by < 0) by = 0;
        ctx.fillStyle = 'rgba(0,0,0,.85)';
        ctx.fillRect(bx, by, bw, bh);
        ctx.strokeStyle = 'rgba(255,30,60,.45)';
        ctx.strokeRect(bx + 0.5, by + 0.5, bw - 1, bh - 1);
        ctx.fillStyle = C_INK;
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText(txt1, bx + 7, by + 5);
        ctx.fillStyle = c.value >= 0 ? '#00E5A8' : '#FF4D6D';
        ctx.fillText(txt2, bx + 7, by + 18);
      }
    }
    void RED;
  }

  _hitTest(px, py){
    if (!this.geom) return -1;
    const { cols, cellW, cellH, padL, padT } = this.geom;
    const col = Math.floor((px - padL) / cellW);
    const row = Math.floor((py - padT) / cellH);
    if (col < 0 || col >= cols || row < 0) return -1;
    const i = row * cols + col;
    return (i >= 0 && i < this.cells.length) ? i : -1;
  }
}
