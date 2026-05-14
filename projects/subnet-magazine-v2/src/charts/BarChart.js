/* =================================================================
   SUBNET MAGAZINE — BAR CHART
   -----------------------------------------------------------------
   A clear, labeled bar chart. Two orientations:
     - 'horizontal'   labels on the left, bars to the right
                      (best for ranked lists of named things)
     - 'vertical'     labels on the bottom, bars going up
                      (best for time series or top-N values)

   Built for legibility, not for density: every bar carries its
   label and its value. Up bars use --c-up green; down bars use
   --c-down red. A zero baseline is drawn when values straddle 0.

   Data shape:
     [{ label: string, value: number, color?: string, sub?: string }]
   ================================================================= */

import { Chart } from './Chart.js';

const C_UP   = '#00E5A8';
const C_DOWN = '#FF4D6D';
const C_INK  = '#F5E5E8';
const C_DIM  = 'rgba(245,229,232,.55)';
const C_RULE = 'rgba(255,30,60,.10)';

export class BarChart extends Chart {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {{
   *   orientation?: 'horizontal'|'vertical',
   *   data?:        { label: string, value: number, color?: string, sub?: string }[],
   *   formatValue?: (v: number) => string,
   *   bipolar?:     boolean,
   *   maxBars?:     number,
   * }} [opts]
   */
  constructor(canvas, opts = {}){
    super(canvas, { animate: false });
    /** @private */ this.orientation = opts.orientation ?? 'horizontal';
    /** @private */ this.data        = (opts.data ?? []).slice();
    /** @private */ this.formatValue = opts.formatValue ?? (v => v.toLocaleString('en-US'));
    /** @private */ this.bipolar     = !!opts.bipolar;
    /** @private */ this.maxBars     = opts.maxBars ?? Infinity;
    /** @private */ this.onBarClick  = opts.onBarClick ?? null;
    /** @private */ this.hover       = null;
    canvas.addEventListener('pointermove', e => {
      const r = canvas.getBoundingClientRect();
      this.hover = { x: e.clientX - r.left, y: e.clientY - r.top };
      canvas.style.cursor = (this.onBarClick && this._barAt(this.hover.x, this.hover.y) >= 0) ? 'pointer' : 'default';
      this.invalidate();
    });
    canvas.addEventListener('pointerleave', () => { this.hover = null; canvas.style.cursor = 'default'; this.invalidate(); });
    canvas.addEventListener('click', e => {
      if (!this.onBarClick) return;
      const r = canvas.getBoundingClientRect();
      const idx = this._barAt(e.clientX - r.left, e.clientY - r.top);
      if (idx >= 0 && this.data[idx]) this.onBarClick(this.data[idx], idx);
    });
  }

  /** Hit-test which bar (if any) is under (px, py). */
  _barAt(px, py){
    if (!this.data.length) return -1;
    const w = this.w, h = this.h;
    const rows = this.data.slice(0, this.maxBars);
    if (this.orientation === 'horizontal'){
      const padT = 8, padB = 8;
      const trackH = (h - padT - padB) / rows.length;
      const idx = Math.floor((py - padT) / trackH);
      return idx >= 0 && idx < rows.length ? idx : -1;
    } else {
      const padL = 30, padR = 12;
      const trackW = w - padL - padR;
      const colW = trackW / rows.length;
      const idx = Math.floor((px - padL) / colW);
      return idx >= 0 && idx < rows.length ? idx : -1;
    }
  }

  setData(rows){
    this.data = (rows ?? []).slice();
    this.invalidate();
  }

  draw(ctx, w, h){
    ctx.clearRect(0, 0, w, h);
    if (!this.data.length) return;
    const rows = this.data.slice(0, this.maxBars);

    if (this.orientation === 'horizontal') this._drawHorizontal(ctx, w, h, rows);
    else                                   this._drawVertical(ctx, w, h, rows);
  }

  _scale(values){
    if (this.bipolar){
      const maxAbs = Math.max(0.001, ...values.map(v => Math.abs(v)));
      return { min: -maxAbs, max: maxAbs };
    }
    const min = Math.min(0, ...values);
    const max = Math.max(0.001, ...values);
    return { min, max };
  }

  /* ----- horizontal: labels on left, bars to right ----- */
  _drawHorizontal(ctx, w, h, rows){
    const padL = 12, padR = 14, padT = 8, padB = 8;
    const labelW = Math.min(180, Math.max(120, w * 0.34));
    const valueW = 64;
    const trackW = w - padL - padR - labelW - valueW - 12;
    const trackX = padL + labelW + 8;
    const trackH = (h - padT - padB) / rows.length;
    const barH = Math.min(22, trackH - 4);

    const { min, max } = this._scale(rows.map(r => r.value));
    const zeroX = this.bipolar ? trackX + trackW * (0 - min) / (max - min) : trackX;
    const lenAt = v => {
      if (this.bipolar) return (v - 0) * (trackW / (max - min));
      return (v - min) * (trackW / (max - min));
    };

    ctx.font = '600 12px JetBrains Mono, monospace';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < rows.length; i++){
      const r = rows[i];
      const cy = padT + i * trackH + trackH / 2;
      const up = r.value >= 0;
      const color = r.color ?? (up ? C_UP : C_DOWN);

      /* label (left) */
      ctx.fillStyle = C_INK;
      ctx.textAlign = 'right';
      ctx.fillText(this._truncate(ctx, r.label, labelW), padL + labelW, cy);

      /* track line */
      ctx.strokeStyle = C_RULE;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(trackX, cy); ctx.lineTo(trackX + trackW, cy);
      ctx.stroke();

      /* bar */
      const len = lenAt(r.value);
      ctx.fillStyle = color;
      if (this.bipolar){
        if (r.value >= 0) ctx.fillRect(zeroX, cy - barH / 2, Math.abs(len), barH);
        else              ctx.fillRect(zeroX + len, cy - barH / 2, Math.abs(len), barH);
      } else {
        ctx.fillRect(trackX, cy - barH / 2, Math.max(1, len), barH);
      }

      /* value (right) */
      ctx.fillStyle = color;
      ctx.textAlign = 'right';
      ctx.fillText(this.formatValue(r.value), w - padR, cy);

      /* sub line under label */
      if (r.sub){
        ctx.font = '500 9.5px JetBrains Mono, monospace';
        ctx.fillStyle = C_DIM;
        ctx.fillText(r.sub, padL + labelW, cy + 12);
        ctx.font = '600 12px JetBrains Mono, monospace';
      }
    }

    /* zero baseline */
    if (this.bipolar){
      ctx.strokeStyle = 'rgba(245,229,232,.32)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(zeroX, padT); ctx.lineTo(zeroX, h - padB);
      ctx.stroke();
    }
  }

  /* ----- vertical: labels on bottom, bars rising up ----- */
  _drawVertical(ctx, w, h, rows){
    const padL = 30, padR = 12, padT = 12, padB = 42;
    const trackW = w - padL - padR;
    const trackH = h - padT - padB;
    const colW = trackW / rows.length;

    const { min, max } = this._scale(rows.map(r => r.value));
    const yFor = v => padT + (max - v) / (max - min) * trackH;
    const zeroY = yFor(0);

    /* grid */
    ctx.strokeStyle = C_RULE;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let g = 0; g <= 4; g++){
      const y = padT + (trackH * g) / 4;
      ctx.moveTo(padL, y); ctx.lineTo(padL + trackW, y);
    }
    ctx.stroke();

    /* y axis labels */
    ctx.font = '600 9.5px JetBrains Mono, monospace';
    ctx.fillStyle = C_DIM;
    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    for (let g = 0; g <= 4; g++){
      const v = max - (max - min) * (g / 4);
      const y = padT + (trackH * g) / 4;
      ctx.fillText(this.formatValue(v), padL - 4, y);
    }

    /* bars */
    const barPad = Math.max(2, colW * 0.18);
    for (let i = 0; i < rows.length; i++){
      const r = rows[i];
      const x = padL + i * colW + barPad;
      const bw = colW - barPad * 2;
      const up = r.value >= 0;
      const color = r.color ?? (up ? C_UP : C_DOWN);
      const y0 = up ? yFor(r.value) : zeroY;
      const y1 = up ? zeroY         : yFor(r.value);
      ctx.fillStyle = color;
      ctx.fillRect(x, y0, bw, Math.max(1, y1 - y0));

      /* value above the bar */
      ctx.fillStyle = C_INK;
      ctx.font = '600 10px JetBrains Mono, monospace';
      ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
      ctx.fillText(this.formatValue(r.value), x + bw / 2, y0 - 2);

      /* category color band at the top (optional, sized to bar) */

      /* x-axis label */
      ctx.fillStyle = C_DIM;
      ctx.font = '600 9.5px JetBrains Mono, monospace';
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      const lbl = this._truncate(ctx, r.label, colW + 6);
      ctx.fillText(lbl, x + bw / 2, h - padB + 6);
      if (r.sub){
        ctx.fillStyle = 'rgba(245,229,232,.40)';
        ctx.font = '500 9px JetBrains Mono, monospace';
        ctx.fillText(this._truncate(ctx, r.sub, colW + 6), x + bw / 2, h - padB + 18);
      }
    }

    /* zero baseline */
    if (this.bipolar){
      ctx.strokeStyle = 'rgba(245,229,232,.32)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padL, zeroY); ctx.lineTo(padL + trackW, zeroY);
      ctx.stroke();
    }
  }

  _truncate(ctx, text, maxWidth){
    if (ctx.measureText(text).width <= maxWidth) return text;
    let lo = 0, hi = text.length;
    while (lo < hi){
      const mid = (lo + hi + 1) >> 1;
      if (ctx.measureText(text.slice(0, mid) + '…').width <= maxWidth) lo = mid;
      else hi = mid - 1;
    }
    return text.slice(0, lo) + '…';
  }
}
