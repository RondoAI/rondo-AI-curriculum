/* =================================================================
   SUBNET MAGAZINE, DONUT CHART
   -----------------------------------------------------------------
   A focused single-arc donut for "share of total" stats. Optionally
   takes multiple slices for a category breakdown, but the common
   case is one: "this subnet's slice of network emission."

   Big bold center label + soft outer glow + smooth animation.
   ================================================================= */

import { Chart } from './Chart.js';

export class DonutChart extends Chart {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {{
   *   value:  number,            // primary value
   *   total:  number,            // denominator
   *   color?: string,            // primary arc color
   *   label?: string,            // big center label (e.g., "12.4%")
   *   sub?:   string,            // small label below
   *   slices?: { value:number, color:string, label?:string }[],
   * }} [opts]
   */
  constructor(canvas, opts = {}){
    super(canvas, { animate: true });
    /** @private */ this.value  = opts.value  ?? 0;
    /** @private */ this.total  = opts.total  ?? 1;
    /** @private */ this.color  = opts.color  ?? '#FF1E3C';
    /** @private */ this.label  = opts.label  ?? '';
    /** @private */ this.sub    = opts.sub    ?? '';
    /** @private */ this.slices = opts.slices ?? null;
    /** @private */ this.t0     = performance.now();
  }

  setValue(value, total){
    if (Number.isFinite(value)) this.value = value;
    if (Number.isFinite(total)) this.total = total;
    this.invalidate();
  }

  draw(ctx, w, h){
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const Ro = Math.min(w, h) / 2 - 14;
    const Ri = Ro * 0.62;
    const thick = Ro - Ri;
    const ring = (Ro + Ri) / 2;

    /* faint outer atmosphere */
    const glow = ctx.createRadialGradient(cx, cy, Ri * 0.8, cx, cy, Ro * 1.12);
    glow.addColorStop(0,    `${this.color}33`);
    glow.addColorStop(0.6,  `${this.color}11`);
    glow.addColorStop(1,    `${this.color}00`);
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(cx, cy, Ro * 1.12, 0, Math.PI * 2); ctx.fill();

    /* background track */
    ctx.strokeStyle = 'rgba(255,30,60,.08)';
    ctx.lineWidth = thick;
    ctx.beginPath(); ctx.arc(cx, cy, ring, 0, Math.PI * 2); ctx.stroke();

    /* easing */
    const animT = Math.min(1, (performance.now() - this.t0) / 800);
    const ease  = 1 - Math.pow(1 - animT, 3);

    if (this.slices){
      let start = -Math.PI / 2;
      const sum = this.slices.reduce((a, s) => a + s.value, 0) || 1;
      for (const s of this.slices){
        const sweep = (s.value / sum) * Math.PI * 2 * ease;
        ctx.strokeStyle = s.color;
        ctx.shadowColor = s.color; ctx.shadowBlur = 12;
        ctx.lineWidth = thick;
        ctx.lineCap = 'butt';
        ctx.beginPath();
        ctx.arc(cx, cy, ring, start, start + sweep);
        ctx.stroke();
        start += sweep;
      }
      ctx.shadowBlur = 0;
    } else {
      const sweep = (this.value / Math.max(1e-9, this.total)) * Math.PI * 2 * ease;
      ctx.strokeStyle = this.color;
      ctx.shadowColor = this.color; ctx.shadowBlur = 16;
      ctx.lineWidth = thick;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(cx, cy, ring, -Math.PI / 2, -Math.PI / 2 + sweep);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    /* center label */
    if (this.label){
      ctx.fillStyle = '#F5E5E8';
      const labelSize = Math.max(18, Math.min(46, Ri * 0.55));
      ctx.font = `700 ${labelSize}px JetBrains Mono, monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.label, cx, this.sub ? cy - labelSize * 0.18 : cy);
    }
    if (this.sub){
      ctx.fillStyle = 'rgba(232,200,205,.62)';
      ctx.font = '600 11px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.sub, cx, cy + Ri * 0.34);
    }

    /* keep animating until eased in */
    if (animT < 1) this.invalidate();
  }
}
