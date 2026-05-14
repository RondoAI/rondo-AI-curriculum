/* =================================================================
   SUBNET MAGAZINE — CANDLE CHART
   -----------------------------------------------------------------
   OHLC candlestick chart with volume bars and an optional crosshair
   readout. Built to extend Chart.js so the lifecycle (DPR + resize
   + RAF) is free.

   Data shape:
     [{ t: number, o: number, h: number, l: number, c: number, v: number }]
     t is a unix-ms timestamp; o/h/l/c are prices; v is volume.

   Public surface:
     - new CandleChart(canvas, { bars, baseline, hours })
     - setData(arr)              replace candles wholesale
     - appendTick(price)         walk the last candle, rotate to a
                                 new candle when the bar period
                                 elapses
     - setBaseline(price)        re-seed synthetic generator

   Visual:
     - Up candles: --c-up (green-mint) so traders parse direction
       instantly. Down candles: --c-down (red).
     - Volume bars in muted hues at the bottom 22% of the canvas.
     - Tabular numerals for price/time axis labels.
     - Crosshair on hover with date / OHLC readout.
   ================================================================= */

import { Chart } from './Chart.js';

const C_UP        = '#00E5A8';
const C_UP_DIM    = 'rgba(0,229,168,.32)';
const C_DOWN      = '#FF4D6D';
const C_DOWN_DIM  = 'rgba(255,77,109,.32)';
const C_GRID      = 'rgba(255,30,60,.06)';
const C_AXIS      = 'rgba(255,176,186,.55)';
const C_AXIS_DIM  = 'rgba(255,176,186,.28)';
const C_INK       = '#F5E5E8';

/** Inclusive integer randomizer with a stable seed. */
function rng(seed){
  let s = seed >>> 0;
  return () => {
    s = (s * 9301 + 49297) >>> 0;
    return ((s % 233280) / 233280);
  };
}

/**
 * Generate a synthetic OHLC series walking from `baseline`. Each
 * candle is `barMs` apart. Older bars first.
 * @param {number} bars
 * @param {number} baseline
 * @param {number} barMs
 * @param {number} [seed]
 */
function synth(bars, baseline, barMs, seed = 1337){
  const r = rng(seed);
  const now = Date.now();
  let price = baseline * (0.92 + r() * 0.16);
  const out = [];
  for (let i = bars - 1; i >= 0; i--){
    const drift  = (r() - 0.48) * baseline * 0.012;
    const range  = baseline * (0.004 + r() * 0.014);
    const o      = price;
    const c      = price + drift;
    const h      = Math.max(o, c) + r() * range;
    const l      = Math.min(o, c) - r() * range;
    const v      = Math.floor(baseline * (200 + r() * 1600));
    out.push({ t: now - i * barMs, o, h, l, c, v });
    price = c;
  }
  return out;
}

export class CandleChart extends Chart {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {{ bars?: number, baseline?: number, barMs?: number, seed?: number }} [opts]
   */
  constructor(canvas, opts = {}){
    super(canvas, { animate: false });
    /** @private */ this.bars       = opts.bars     ?? 60;
    /** @private */ this.baseline   = opts.baseline ?? 487;
    /** @private */ this.barMs      = opts.barMs    ?? 60 * 60 * 1000;  // 1h
    /** @private */ this.data       = synth(this.bars, this.baseline, this.barMs, opts.seed);
    /** @private */ this.hover      = null;

    canvas.addEventListener('pointermove', e => {
      const r = canvas.getBoundingClientRect();
      this.hover = { x: e.clientX - r.left, y: e.clientY - r.top };
      this.invalidate();
    });
    canvas.addEventListener('pointerleave', () => {
      this.hover = null;
      this.invalidate();
    });
  }

  /** Replace the dataset (used when live data lands). */
  setData(rows){
    if (!Array.isArray(rows) || !rows.length) return;
    this.data = rows.slice();
    this.invalidate();
  }

  /** Re-seed the synthetic walk around a new price. */
  setBaseline(price){
    if (typeof price !== 'number') return;
    this.baseline = price;
    this.data = synth(this.bars, price, this.barMs);
    this.invalidate();
  }

  /**
   * Apply a live price tick. If the most recent candle's age is
   * still within `barMs`, the tick walks its close (and h/l). If
   * the bar's period elapsed, we close it and open a new candle.
   * @param {number} price
   */
  appendTick(price){
    if (typeof price !== 'number' || !this.data.length) return;
    const last = this.data[this.data.length - 1];
    const now  = Date.now();
    if (now - last.t < this.barMs){
      last.c = price;
      if (price > last.h) last.h = price;
      if (price < last.l) last.l = price;
      last.v += Math.round(this.baseline * 200);
    } else {
      this.data.push({
        t: now, o: last.c, h: Math.max(last.c, price),
        l: Math.min(last.c, price), c: price,
        v: Math.round(this.baseline * 200),
      });
      while (this.data.length > this.bars) this.data.shift();
    }
    this.invalidate();
  }

  draw(ctx, w, h){
    ctx.clearRect(0, 0, w, h);

    /* === layout: chart area + volume area ===================== */
    const padL = 56, padR = 12, padT = 26, padB = 30;
    const innerW = w - padL - padR;
    const innerH = h - padT - padB;
    const volH = Math.round(innerH * 0.22);
    const chartH = innerH - volH - 8;

    /* === price scale ========================================== */
    let pMin = +Infinity, pMax = -Infinity, vMax = 0;
    for (const k of this.data){
      if (k.l < pMin) pMin = k.l;
      if (k.h > pMax) pMax = k.h;
      if (k.v > vMax) vMax = k.v;
    }
    const pPad = (pMax - pMin) * 0.05 || 1;
    pMin -= pPad; pMax += pPad;
    const priceY = p => padT + (pMax - p) / (pMax - pMin) * chartH;
    const volY   = v => padT + chartH + 8 + (1 - v / (vMax || 1)) * volH;

    const N = this.data.length;
    const cwGap = 2;
    const cw = Math.max(1, innerW / N - cwGap);
    const candleX = i => padL + i * (innerW / N) + cwGap / 2;

    /* === grid ================================================ */
    ctx.strokeStyle = C_GRID;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i <= 4; i++){
      const y = padT + (chartH * i) / 4;
      ctx.moveTo(padL, y); ctx.lineTo(w - padR, y);
    }
    ctx.stroke();

    /* === Y axis price labels ================================ */
    ctx.font = '600 9.5px JetBrains Mono, monospace';
    ctx.fillStyle = C_AXIS;
    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    for (let i = 0; i <= 4; i++){
      const p = pMax - (pMax - pMin) * (i / 4);
      const y = padT + (chartH * i) / 4;
      ctx.fillText(`$${p.toFixed(2)}`, padL - 6, y);
    }

    /* === X axis time labels ================================== */
    ctx.fillStyle = C_AXIS_DIM;
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    const labelStep = Math.ceil(N / 6);
    for (let i = 0; i < N; i += labelStep){
      const x = candleX(i) + cw / 2;
      const d = new Date(this.data[i].t);
      const z = n => String(n).padStart(2, '0');
      const label = `${z(d.getUTCHours())}:${z(d.getUTCMinutes())}`;
      ctx.fillText(label, x, padT + innerH + 4);
    }

    /* === volume bars ========================================= */
    for (let i = 0; i < N; i++){
      const k = this.data[i];
      const up = k.c >= k.o;
      const x = candleX(i);
      const top = volY(k.v);
      const bot = padT + chartH + 8 + volH;
      ctx.fillStyle = up ? C_UP_DIM : C_DOWN_DIM;
      ctx.fillRect(x, top, cw, Math.max(1, bot - top));
    }

    /* === candles ============================================= */
    for (let i = 0; i < N; i++){
      const k = this.data[i];
      const up = k.c >= k.o;
      const color = up ? C_UP : C_DOWN;
      const x = candleX(i);
      const xc = x + cw / 2;

      /* wick */
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(0.8, cw * 0.18);
      ctx.beginPath();
      ctx.moveTo(xc, priceY(k.h));
      ctx.lineTo(xc, priceY(k.l));
      ctx.stroke();

      /* body */
      const yo = priceY(k.o), yc = priceY(k.c);
      const top = Math.min(yo, yc), bot = Math.max(yo, yc);
      ctx.fillStyle = color;
      ctx.fillRect(x, top, cw, Math.max(1, bot - top));
    }

    /* === current price line + tag ============================ */
    const last = this.data[N - 1];
    if (last){
      const y = priceY(last.c);
      ctx.strokeStyle = 'rgba(245,229,232,.45)';
      ctx.setLineDash([3, 3]); ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(w - padR, y); ctx.stroke();
      ctx.setLineDash([]);

      /* tag */
      const tag = `$${last.c.toFixed(2)}`;
      ctx.font = '700 10px JetBrains Mono, monospace';
      const tw = ctx.measureText(tag).width;
      const tagW = tw + 12, tagH = 16;
      const up = last.c >= last.o;
      ctx.fillStyle = up ? C_UP : C_DOWN;
      ctx.fillRect(w - padR - tagW - 2, y - tagH / 2, tagW, tagH);
      ctx.fillStyle = '#000';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(tag, w - padR - tagW / 2 - 2, y);
    }

    /* === crosshair + tooltip ================================= */
    if (this.hover){
      const { x: hx, y: hy } = this.hover;
      if (hx >= padL && hx <= w - padR && hy >= padT && hy <= padT + innerH){
        const idx = Math.max(0, Math.min(N - 1, Math.floor((hx - padL) / (innerW / N))));
        const k = this.data[idx];
        const xc = candleX(idx) + cw / 2;
        ctx.strokeStyle = 'rgba(245,229,232,.25)';
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(xc, padT); ctx.lineTo(xc, padT + innerH);
        ctx.moveTo(padL, hy); ctx.lineTo(w - padR, hy);
        ctx.stroke();

        /* readout */
        const d = new Date(k.t);
        const z = n => String(n).padStart(2, '0');
        const dateStr = `${d.getUTCFullYear()}-${z(d.getUTCMonth()+1)}-${z(d.getUTCDate())} ${z(d.getUTCHours())}:${z(d.getUTCMinutes())} UTC`;
        const up = k.c >= k.o;
        const lines = [
          dateStr,
          `O $${k.o.toFixed(2)}   H $${k.h.toFixed(2)}`,
          `L $${k.l.toFixed(2)}   C $${k.c.toFixed(2)}`,
          `Δ ${up ? '+' : ''}${((k.c - k.o) / k.o * 100).toFixed(2)}%   V ${k.v.toLocaleString('en-US')}`,
        ];
        ctx.font = '600 10px JetBrains Mono, monospace';
        let tw = 0;
        for (const ln of lines) tw = Math.max(tw, ctx.measureText(ln).width);
        const bw = tw + 16, bh = lines.length * 14 + 10;
        const bx = Math.min(w - bw - 4, hx + 12);
        const by = Math.max(padT + 4, Math.min(padT + innerH - bh - 4, hy - bh / 2));
        ctx.fillStyle = 'rgba(0,0,0,.82)';
        ctx.fillRect(bx, by, bw, bh);
        ctx.strokeStyle = 'rgba(255,30,60,.45)';
        ctx.strokeRect(bx + 0.5, by + 0.5, bw - 1, bh - 1);
        ctx.fillStyle = C_INK;
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        lines.forEach((ln, i) => ctx.fillText(ln, bx + 8, by + 6 + i * 14));
      }
    }
  }
}
