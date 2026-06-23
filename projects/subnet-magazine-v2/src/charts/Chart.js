/* =================================================================
   SUBNET MAGAZINE, CHART BASE CLASS
   -----------------------------------------------------------------
   Every chart in the system extends this. Subclasses implement two
   hooks:

     - layout(ctx, w, h)   called whenever size changes
     - draw(ctx, w, h, t)  called every animation frame (or once,
                           if `animate === false`)

   The base handles:
     - DevicePixelRatio scaling so canvas stays crisp on retina
     - ResizeObserver wired to a rAF-throttled resize
     - prefers-reduced-motion: animated charts fall back to a single
       draw on data change
     - destroy() unbinds everything cleanly

   This is the single place where canvas boilerplate lives. Charts
   themselves just describe what to draw.
   ================================================================= */

import { rafThrottle, prefersReducedMotion } from '../lib/dom.js';

/**
 * @typedef {Object} ChartOptions
 * @prop {boolean} [animate=true]   Render every frame, vs. on-demand
 * @prop {number}  [maxDPR=2]       Cap pixel ratio to spare GPUs
 */

export class Chart {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {ChartOptions} [opts]
   */
  constructor(canvas, opts = {}){
    if (!(canvas instanceof HTMLCanvasElement)) {
      throw new TypeError('Chart: canvas must be an HTMLCanvasElement');
    }
    /** @protected */ this.canvas = canvas;
    /** @protected */ this.ctx = canvas.getContext('2d');
    /** @protected */ this.w = 0;
    /** @protected */ this.h = 0;
    /** @protected */ this.dpr = 1;
    /** @protected */ this.t0 = performance.now();
    /** @protected */ this.t = 0;
    /** @private */ this._opts = {
      animate: opts.animate !== false,
      maxDPR: opts.maxDPR ?? 2,
    };
    /** @private */ this._destroyed = false;
    /** @private */ this._rafId = 0;
    /** @private */ this._observer = null;
    /** @private */ this._reduced = prefersReducedMotion();

    this._onResize = rafThrottle(() => this._resize());
    // Pull off first layout/paint after the canvas has a chance to
    // get its computed size from CSS layout.
    requestAnimationFrame(() => {
      if (this._destroyed) return;
      this._resize();
      this._start();
    });
    if (typeof ResizeObserver !== 'undefined'){
      this._observer = new ResizeObserver(this._onResize);
      this._observer.observe(canvas);
    } else {
      window.addEventListener('resize', this._onResize);
    }
  }

  /** Subclass: compute layout for the given pixel dims. */
  // eslint-disable-next-line no-unused-vars
  layout(ctx, w, h){ /* override */ }

  /** Subclass: paint a frame. `t` is seconds since construction. */
  // eslint-disable-next-line no-unused-vars
  draw(ctx, w, h, t){ /* override */ }

  /**
   * Mark the chart dirty, used by static charts to repaint after
   * data updates without running a rAF loop forever.
   */
  invalidate(){
    if (this._opts.animate) return;     // animated charts repaint anyway
    if (this._destroyed) return;
    cancelAnimationFrame(this._rafId);
    this._rafId = requestAnimationFrame(() => this._frame());
  }

  /** Unbind everything. Safe to call more than once. */
  destroy(){
    if (this._destroyed) return;
    this._destroyed = true;
    cancelAnimationFrame(this._rafId);
    if (this._observer) this._observer.disconnect();
    else window.removeEventListener('resize', this._onResize);
  }

  /* ---------- internals ---------- */

  /** @private */
  _resize(){
    if (this._destroyed) return;
    const dpr = Math.min(window.devicePixelRatio || 1, this._opts.maxDPR);
    const w = this.canvas.clientWidth  || this.canvas.width  || 1;
    const h = this.canvas.clientHeight || this.canvas.height || 1;
    if (w === this.w && h === this.h && dpr === this.dpr) return;
    this.dpr = dpr; this.w = w; this.h = h;
    this.canvas.width  = Math.max(1, Math.floor(w * dpr));
    this.canvas.height = Math.max(1, Math.floor(h * dpr));
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    try { this.layout(this.ctx, w, h); } catch (e) { console.error('Chart.layout', e); }
    if (!this._opts.animate) this.invalidate();
  }

  /** @private */
  _start(){
    if (this._destroyed) return;
    if (this._opts.animate && !this._reduced){
      const loop = () => {
        if (this._destroyed) return;
        this._frame();
        this._rafId = requestAnimationFrame(loop);
      };
      this._rafId = requestAnimationFrame(loop);
    } else {
      this._frame();
    }
  }

  /** @private */
  _frame(){
    this.t = (performance.now() - this.t0) / 1000;
    try {
      this.draw(this.ctx, this.w, this.h, this.t);
    } catch (e){
      console.error('Chart.draw', e);
      this.destroy();
    }
  }
}
