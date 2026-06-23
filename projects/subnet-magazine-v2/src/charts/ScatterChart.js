/* =================================================================
   SUBNET MAGAZINE, SCATTER CHART
   -----------------------------------------------------------------
   The InferenceX-style comparison plot: every provider is a dot
   positioned by two metrics, cost on X (log scale, since prices
   span $0.10 → $90), speed on Y. Dots are coloured by kind, so the
   decentralized subnets, the frontier labs and the open-weight
   models separate visually. Top-left is the sweet spot: cheap and
   fast.

   Dots stagger-in on mount (taostats-style motion). Hovering a dot
   lifts it and shows a label.
   ================================================================= */

import { Chart } from './Chart.js';

const INK      = '#C8A8AD';
const INK_DIM  = '#8B6B70';
const INK_FAINT= '#4A2A30';
const GRID     = 'rgba(255,30,60,.07)';
const MONO     = "'JetBrains Mono', ui-monospace, monospace";

export class ScatterChart extends Chart {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {{
   *   points?: {x:number,y:number,label:string,color:string,kind?:string}[],
   *   xLabel?: string, yLabel?: string, xLog?: boolean,
   *   fmtX?: (n:number)=>string, fmtY?: (n:number)=>string,
   * }} [opts]
   */
  constructor(canvas, opts = {}){
    super(canvas, { animate: false });
    /** @private */ this.points = opts.points ?? [];
    /** @private */ this.xLabel = opts.xLabel ?? '';
    /** @private */ this.yLabel = opts.yLabel ?? '';
    /** @private */ this.xLog   = opts.xLog !== false;
    /** @private */ this.fmtX   = opts.fmtX ?? (v => String(v));
    /** @private */ this.fmtY   = opts.fmtY ?? (v => String(v));
    /** @private */ this._intro = 1;
    /** @private */ this._introRaf = 0;
    /** @private */ this._introDone = false;
    /** @private */ this.hover = null;

    canvas.addEventListener('pointermove', e => {
      const r = canvas.getBoundingClientRect();
      this.hover = { x: e.clientX - r.left, y: e.clientY - r.top };
      this.invalidate();
    });
    canvas.addEventListener('pointerleave', () => { this.hover = null; this.invalidate(); });
  }

  setData(points){ this.points = points ?? []; this._playIntro(); }

  layout(){
    if (!this._introDone && this.points.length){
      this._introDone = true;
      this._playIntro();
    }
  }

  _playIntro(){
    cancelAnimationFrame(this._introRaf);
    if (this._reduced || !this.points.length){ this._intro = 1; this.invalidate(); return; }
    const t0 = performance.now(), DUR = 720;
    const step = () => {
      const e = (performance.now() - t0) / DUR;
      this._intro = e >= 1 ? 1 : e;
      this.invalidate();
      if (e < 1) this._introRaf = requestAnimationFrame(step);
    };
    this._introRaf = requestAnimationFrame(step);
  }

  destroy(){
    cancelAnimationFrame(this._introRaf);
    super.destroy();
  }

  draw(ctx, w, h){
    ctx.clearRect(0, 0, w, h);
    const pts = this.points;
    if (!pts.length) return;

    const padL = 56, padR = 18, padT = 20, padB = 42;
    const plotW = w - padL - padR;
    const plotH = h - padT - padB;
    if (plotW < 20 || plotH < 20) return;

    /* ranges */
    let xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity;
    for (const p of pts){
      if (p.x < xMin) xMin = p.x; if (p.x > xMax) xMax = p.x;
      if (p.y < yMin) yMin = p.y; if (p.y > yMax) yMax = p.y;
    }
    const ySpan = yMax - yMin || 1;
    yMin = Math.max(0, yMin - ySpan * 0.18);
    yMax = yMax + ySpan * 0.12;

    const lg = v => Math.log10(Math.max(0.01, v));
    const xlo = this.xLog ? lg(xMin * 0.7) : xMin - (xMax - xMin) * 0.08;
    const xhi = this.xLog ? lg(xMax * 1.4) : xMax + (xMax - xMin) * 0.08;
    const xFor = v => padL + ((this.xLog ? lg(v) : v) - xlo) / (xhi - xlo || 1) * plotW;
    const yFor = v => padT + plotH - (v - yMin) / (yMax - yMin || 1) * plotH;

    const ease = this._intro < 1 ? 1 - Math.pow(1 - this._intro, 3) : 1;

    /* ===== gridlines + axes ===== */
    ctx.font = `10px ${MONO}`;
    /* Y grid */
    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    for (let i = 0; i <= 4; i++){
      const v = yMin + (i / 4) * (yMax - yMin);
      const y = yFor(v);
      ctx.strokeStyle = GRID; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(padL + plotW, y); ctx.stroke();
      ctx.fillStyle = INK_DIM;
      ctx.fillText(this.fmtY(v), padL - 7, y);
    }
    /* X grid, log decades or linear quarters */
    const xticks = this.xLog
      ? [0.1, 0.3, 1, 3, 10, 30, 100].filter(v => v >= xMin * 0.6 && v <= xMax * 1.6)
      : [0, 1, 2, 3, 4].map(i => xMin + (i / 4) * (xMax - xMin));
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    for (const v of xticks){
      const x = xFor(v);
      ctx.strokeStyle = GRID; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, padT); ctx.lineTo(x, padT + plotH); ctx.stroke();
      ctx.fillStyle = INK_DIM;
      ctx.fillText(this.fmtX(v), x, padT + plotH + 8);
    }

    /* axis labels */
    ctx.fillStyle = INK_FAINT;
    ctx.font = `9px ${MONO}`;
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    ctx.fillText(this.xLabel + ' →', padL, padT + plotH + 24);
    ctx.save();
    ctx.translate(12, padT + plotH);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(this.yLabel + ' →', 0, 0);
    ctx.restore();

    /* "cheap + fast" sweet-spot hint, top-left */
    ctx.fillStyle = 'rgba(0,229,168,.5)';
    ctx.font = `9px ${MONO}`;
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    ctx.fillText('◤ cheaper + faster', padL + 4, padT + 2);

    /* ===== dots (staggered in) ===== */
    let hovered = null, hoverDist = 22;
    pts.forEach((p, i) => {
      const x = xFor(p.x), y = yFor(p.y);
      /* stagger: each dot eases in over the intro window */
      const t = (i / pts.length) * 0.55;
      const appear = Math.max(0, Math.min(1, (ease - t) / (1 - t || 1)));
      if (appear <= 0) return;
      const r = (p.kind === 'subnet' ? 7 : 5.5) * appear;

      if (this.hover){
        const d = Math.hypot(this.hover.x - x, this.hover.y - y);
        if (d < hoverDist){ hoverDist = d; hovered = { p, x, y, r }; }
      }

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = appear * (p.kind === 'subnet' ? 1 : 0.82);
      ctx.shadowColor = p.color;
      ctx.shadowBlur = p.kind === 'subnet' ? 10 : 4;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      /* label, subnets always, others when not crowded */
      if (appear > 0.9){
        ctx.fillStyle = p.kind === 'subnet' ? '#F5E5E8' : INK_DIM;
        ctx.font = `${p.kind === 'subnet' ? '10' : '9'}px ${MONO}`;
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillText(p.label, x + r + 4, y);
      }
    });

    /* ===== hover tooltip ===== */
    if (hovered){
      const { p, x, y } = hovered;
      ctx.beginPath();
      ctx.arc(x, y, hovered.r + 4, 0, Math.PI * 2);
      ctx.strokeStyle = p.color; ctx.lineWidth = 1.5;
      ctx.stroke();
      const line = `${p.label}  ·  ${this.fmtX(p.x)}  ·  ${this.fmtY(p.y)}`;
      ctx.font = `10px ${MONO}`;
      const tw = ctx.measureText(line).width;
      let bx = x + 10, by = y - 24;
      if (bx + tw + 12 > w) bx = x - tw - 22;
      if (by < padT) by = y + 12;
      ctx.fillStyle = 'rgba(10,3,6,.95)';
      ctx.strokeStyle = p.color;
      ctx.beginPath(); ctx.rect(bx, by, tw + 14, 18); ctx.fill(); ctx.stroke();
      ctx.fillStyle = INK;
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillText(line, bx + 7, by + 9);
    }
  }
}
