/* =================================================================
   SUBNET MAGAZINE — TREEMAP
   -----------------------------------------------------------------
   Squarified treemap on canvas. Tiles sized by `value`, coloured
   off the red ramp by rank. Used for the home-page "where the
   emissions go" infographic — a different visual language from the
   rotating plexus, but the same red-on-black terminal grammar.
   ================================================================= */

import { Chart } from './Chart.js';

/** A red gradient — darker → higher rank. */
const RAMP = [
  '#FF1E3C', '#E61833', '#CC152D', '#B31226',
  '#990F20', '#80101D', '#680E1A', '#4D0C16',
];

/**
 * @typedef {Object} TreeItem
 * @prop {string} label    headline label (e.g. "SN64 · Chutes")
 * @prop {string} sub      sub label (e.g. "τ612 / day")
 * @prop {number} value    the area weight
 */

export class Treemap extends Chart {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {{ items?: TreeItem[], colors?: string[] }} [opts]
   */
  constructor(canvas, opts = {}){
    super(canvas, { animate: false });
    /** @private */ this.items = (opts.items || []).slice()
      .sort((a, b) => b.value - a.value);
    /** @private */ this.colors = opts.colors || RAMP;
    /** @private */ this.boxes = [];
  }

  layout(ctx, w, h){
    this.boxes = squarify(this.items, w, h);
    this.invalidate();
  }

  draw(ctx, w, h){
    ctx.clearRect(0, 0, w, h);
    if (!this.boxes.length) return;
    const colors = this.colors;
    const pad = 1;

    /* tiles */
    this.boxes.forEach((b, i) => {
      ctx.fillStyle = colors[Math.min(i, colors.length - 1)];
      ctx.fillRect(b.x + pad, b.y + pad,
                   Math.max(0, b.w - pad * 2),
                   Math.max(0, b.h - pad * 2));
    });

    /* labels — name on top, value below; clipped to each tile so a
       long string never bleeds into the neighbour. Sub-line only if
       there's vertical room for it. */
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    for (const b of this.boxes){
      if (b.w < 48 || b.h < 26) continue;
      ctx.save();
      ctx.beginPath();
      ctx.rect(b.x + 2, b.y + 2, Math.max(0, b.w - 4), Math.max(0, b.h - 4));
      ctx.clip();
      ctx.fillStyle = 'rgba(245,229,232,.96)';
      ctx.font = '700 11px JetBrains Mono, ui-monospace, monospace';
      ctx.fillText(b.label, b.x + 7, b.y + 7);
      if (b.h > 42){
        ctx.fillStyle = 'rgba(245,229,232,.72)';
        ctx.font = '500 10px JetBrains Mono, ui-monospace, monospace';
        ctx.fillText(b.sub || '', b.x + 7, b.y + 22);
      }
      ctx.restore();
    }

    /* hairline divisions over the tiles — keeps the terminal grid */
    ctx.strokeStyle = 'rgba(0,0,0,.55)';
    ctx.lineWidth = 1;
    for (const b of this.boxes){
      ctx.strokeRect(b.x + .5, b.y + .5, b.w, b.h);
    }
  }
}

/* ---- squarified treemap (Bruls / Huijgen / van Wijk) ---- */
function worst(row, side){
  let max = -Infinity, min = Infinity, sum = 0;
  for (const r of row){
    if (r > max) max = r;
    if (r < min) min = r;
    sum += r;
  }
  const s2 = sum * sum, side2 = side * side;
  return Math.max((side2 * max) / s2, s2 / (side2 * min));
}

function squarify(items, W, H){
  const total = items.reduce((a, v) => a + v.value, 0) || 1;
  const scale = (W * H) / total;
  const q = items.map(v => ({ ...v, scaled: v.value * scale }));
  const out = [];
  let area = { x: 0, y: 0, w: W, h: H };
  let row = [];
  const flush = () => {
    const sum = row.reduce((a, v) => a + v.scaled, 0);
    const wide = area.w >= area.h;
    if (wide){
      const rw = sum / area.h;
      let cy = area.y;
      for (const v of row){
        const rh = v.scaled / rw;
        out.push({ ...v, x: area.x, y: cy, w: rw, h: rh });
        cy += rh;
      }
      area = { x: area.x + rw, y: area.y, w: area.w - rw, h: area.h };
    } else {
      const rh = sum / area.w;
      let cx = area.x;
      for (const v of row){
        const rw = v.scaled / rh;
        out.push({ ...v, x: cx, y: area.y, w: rw, h: rh });
        cx += rw;
      }
      area = { x: area.x, y: area.y + rh, w: area.w, h: area.h - rh };
    }
    row = [];
  };
  while (q.length){
    const v = q[0];
    const side = Math.min(area.w, area.h);
    const cur = row.map(r => r.scaled);
    if (row.length === 0 || worst(cur.concat(v.scaled), side) <= worst(cur, side)){
      row.push(v);
      q.shift();
    } else {
      flush();
    }
  }
  if (row.length) flush();
  return out;
}
