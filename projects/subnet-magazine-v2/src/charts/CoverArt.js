/* =================================================================
   SUBNET MAGAZINE — COVER ART
   -----------------------------------------------------------------
   The generative banner behind the magazine masthead block. A slow
   drifting field of nodes with proximity chords — the same "network
   of intelligence" visual language as the hero icosphere and the
   brand mark, but spread wide and ambient.

   Built to sit BEHIND text: low contrast, weighted to the edges, a
   vignette pulling the center dark so a headline stays legible.
   Respects prefers-reduced-motion via the Chart base (falls back to
   a single static frame).
   ================================================================= */

import { Chart } from './Chart.js';

export class CoverArt extends Chart {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {{ density?: number, speed?: number }} [opts]
   */
  constructor(canvas, opts = {}){
    super(canvas, { animate: true });
    /** @private */ this.density = opts.density ?? 0.00018;  /* nodes per px² */
    /** @private */ this.speed   = opts.speed ?? 1;
    /** @private */ this.nodes   = [];
  }

  layout(ctx, w, h){
    const count = Math.max(14, Math.min(70, Math.round(w * h * this.density)));
    this.nodes = [];
    for (let i = 0; i < count; i++){
      this.nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.16 * this.speed,
        vy: (Math.random() - 0.5) * 0.16 * this.speed,
        r: 0.6 + Math.random() * 1.6,
      });
    }
  }

  draw(ctx, w, h){
    ctx.clearRect(0, 0, w, h);

    /* base wash — a faint radial lift from the lower-left */
    const wash = ctx.createRadialGradient(w * 0.2, h * 0.9, 0, w * 0.2, h * 0.9, Math.max(w, h));
    wash.addColorStop(0, 'rgba(255,30,60,0.07)');
    wash.addColorStop(1, 'rgba(255,30,60,0)');
    ctx.fillStyle = wash;
    ctx.fillRect(0, 0, w, h);

    const n = this.nodes;
    for (const p of n){
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      p.x = Math.max(0, Math.min(w, p.x));
      p.y = Math.max(0, Math.min(h, p.y));
    }

    /* proximity chords */
    const link = Math.min(w, h) * 0.28;
    ctx.lineWidth = 1;
    for (let i = 0; i < n.length; i++){
      for (let j = i + 1; j < n.length; j++){
        const dx = n[i].x - n[j].x, dy = n[i].y - n[j].y;
        const d = Math.hypot(dx, dy);
        if (d > link) continue;
        const a = (1 - d / link) * 0.16;
        ctx.strokeStyle = `rgba(255,30,60,${a.toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(n[i].x, n[i].y);
        ctx.lineTo(n[j].x, n[j].y);
        ctx.stroke();
      }
    }

    /* nodes */
    for (const p of n){
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,77,96,0.55)';
      ctx.fill();
    }

    /* center vignette — keep the headline readable */
    const vig = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.7);
    vig.addColorStop(0, 'rgba(0,0,0,0.55)');
    vig.addColorStop(0.6, 'rgba(0,0,0,0.25)');
    vig.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, w, h);
  }
}
