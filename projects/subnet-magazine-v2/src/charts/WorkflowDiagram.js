/* =================================================================
   SUBNET MAGAZINE — WORKFLOW DIAGRAM
   -----------------------------------------------------------------
   A horizontal step-flow visualization that shows what actually
   happens when a Bittensor subnet runs an epoch. Each step is a
   rounded box with an icon, a label, an optional count, and a
   one-line description; arrows connect them; small particles
   pulse along the connectors so the diagram reads as a live
   data flow.

   Steps come from the host (a CATEGORY_WORKFLOWS entry merged
   with the subnet's own counts) so the diagram naturally adapts
   to text / training / vision / infra / agents / etc.
   ================================================================= */

import { Chart } from './Chart.js';

const C_BOX_BG     = 'rgba(255,30,60,.08)';
const C_BOX_BG_2   = 'rgba(255,30,60,.04)';
const C_BORDER     = 'rgba(255,30,60,.45)';
const C_INK        = '#F5E5E8';
const C_INK_DIM    = 'rgba(245,229,232,.65)';
const C_RED        = '#FF1E3C';
const C_RED_SOFT   = '#FF6B7A';
const C_LINE       = 'rgba(255,30,60,.32)';

export class WorkflowDiagram extends Chart {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {{
   *   steps?: { icon: string, label: string, count?: string|number,
   *             desc?: string, accent?: string }[]
   * }} [opts]
   */
  constructor(canvas, opts = {}){
    super(canvas, { animate: true });
    /** @private */ this.steps = opts.steps ?? [];
  }

  setSteps(steps){
    this.steps = Array.isArray(steps) ? steps.slice() : [];
    this.invalidate();
  }

  draw(ctx, w, h, t){
    ctx.clearRect(0, 0, w, h);
    const N = this.steps.length;
    if (!N) return;

    const padL = 12, padR = 12, padT = 18, padB = 28;
    const innerW = w - padL - padR;
    const innerH = h - padT - padB;

    /* Box geometry — fit boxes into the row, with gap for arrows */
    const boxW = Math.min(150, (innerW - 18 * (N - 1)) / N);
    const arrW = (innerW - boxW * N) / Math.max(1, N - 1);
    const boxH = Math.min(110, innerH * 0.78);
    const boxY = padT + (innerH - boxH) / 2 - 6;

    /* Pre-compute box X positions */
    const boxX = i => padL + i * (boxW + arrW);

    /* ===== arrows + animated particles ===== */
    for (let i = 0; i < N - 1; i++){
      const x1 = boxX(i) + boxW;
      const x2 = boxX(i + 1);
      const y  = boxY + boxH / 2;

      ctx.strokeStyle = C_LINE;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x1, y); ctx.lineTo(x2 - 6, y);
      ctx.stroke();

      /* arrowhead */
      ctx.fillStyle = C_LINE;
      ctx.beginPath();
      ctx.moveTo(x2, y);
      ctx.lineTo(x2 - 7, y - 4);
      ctx.lineTo(x2 - 7, y + 4);
      ctx.closePath();
      ctx.fill();

      /* 2 traveling particles per gap, offset by phase */
      for (let pi = 0; pi < 2; pi++){
        const phase = ((t * 0.45) + i * 0.31 + pi * 0.5) % 1;
        const px = x1 + (x2 - 6 - x1) * phase;
        const fade = 1 - Math.abs(phase - 0.5) * 1.4;
        ctx.fillStyle = `rgba(255,107,122,${Math.max(0, fade)})`;
        ctx.shadowColor = C_RED_SOFT;
        ctx.shadowBlur  = 6 * Math.max(0, fade);
        ctx.beginPath();
        ctx.arc(px, y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    }

    /* ===== boxes ===== */
    for (let i = 0; i < N; i++){
      const s = this.steps[i];
      const x = boxX(i);
      const accent = s.accent || C_RED;

      /* background gradient */
      const grad = ctx.createLinearGradient(x, boxY, x, boxY + boxH);
      grad.addColorStop(0, C_BOX_BG);
      grad.addColorStop(1, C_BOX_BG_2);
      ctx.fillStyle = grad;
      this._roundRect(ctx, x, boxY, boxW, boxH, 6);
      ctx.fill();

      /* border */
      ctx.strokeStyle = C_BORDER;
      ctx.lineWidth = 1;
      this._roundRect(ctx, x + 0.5, boxY + 0.5, boxW - 1, boxH - 1, 6);
      ctx.stroke();

      /* accent strip top */
      ctx.fillStyle = accent;
      this._roundRect(ctx, x, boxY, boxW, 3, 1);
      ctx.fill();

      /* icon (big) */
      ctx.fillStyle = accent;
      ctx.font = '700 28px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(s.icon ?? '·', x + boxW / 2, boxY + 24);

      /* label */
      ctx.fillStyle = C_INK;
      ctx.font = '700 11px JetBrains Mono, monospace';
      ctx.fillText(s.label ?? '', x + boxW / 2, boxY + 56);

      /* count */
      if (s.count != null){
        ctx.fillStyle = C_RED_SOFT;
        ctx.font = '700 14px JetBrains Mono, monospace';
        ctx.fillText(String(s.count), x + boxW / 2, boxY + 76);
      }

      /* one-line desc beneath the box */
      if (s.desc){
        ctx.fillStyle = C_INK_DIM;
        ctx.font = '500 10px JetBrains Mono, monospace';
        ctx.textBaseline = 'top';
        const words = s.desc.split(' ');
        let line = '', y0 = boxY + boxH + 6, lineH = 12;
        for (const word of words){
          const test = line ? line + ' ' + word : word;
          if (ctx.measureText(test).width > boxW - 4){
            ctx.fillText(line, x + boxW / 2, y0);
            y0 += lineH; line = word;
          } else {
            line = test;
          }
        }
        if (line) ctx.fillText(line, x + boxW / 2, y0);
      }
    }
  }

  _roundRect(ctx, x, y, w, h, r){
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
}
