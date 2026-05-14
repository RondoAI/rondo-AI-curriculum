/* =================================================================
   SUBNET MAGAZINE — TREEMAP
   -----------------------------------------------------------------
   Squarified treemap layout. Each input item gets a rectangle whose
   area is proportional to `value`; the algorithm minimizes aspect
   ratios so rectangles stay readable. Cells are colored by the
   item's `color` (we pass category color in). Big cells get a label
   (netuid + name); small cells stay clean.

   Used as the bottom-right panel in the TAO Terminal to show
   τ-emission distribution by category.
   ================================================================= */

import { Chart } from './Chart.js';

/* ---------- Squarified algorithm (Bruls / Huijgen / van Wijk) ---------- */

function worst(row, w){
  let rMax = -Infinity, rMin = Infinity, s = 0;
  for (const r of row){ if (r > rMax) rMax = r; if (r < rMin) rMin = r; s += r; }
  const ww = w * w, ss = s * s;
  return Math.max((ww * rMax) / ss, ss / (ww * rMin));
}

function layoutRow(row, x, y, w, h, isWide, total){
  const rows = [];
  const sum = row.reduce((a, v) => a + v.scaled, 0);
  if (isWide){
    const rowH = sum / w;
    let cx = x;
    for (const v of row){
      const rw = v.scaled / rowH;
      rows.push({ ...v, x: cx, y, w: rw, h: rowH });
      cx += rw;
    }
    return { rows, x, y: y + rowH, w, h: h - rowH, total: total - sum };
  } else {
    const rowW = sum / h;
    let cy = y;
    for (const v of row){
      const rh = v.scaled / rowW;
      rows.push({ ...v, x, y: cy, w: rowW, h: rh });
      cy += rh;
    }
    return { rows, x: x + rowW, y, w: w - rowW, h, total: total - sum };
  }
}

/**
 * @param {{value:number, [k:string]:any}[]} items   sorted by value desc
 * @param {number} w
 * @param {number} h
 * @returns {{ x:number, y:number, w:number, h:number, value:number }[]}
 */
function squarify(items, w, h){
  const total = items.reduce((a, v) => a + v.value, 0) || 1;
  const scale = (w * h) / total;
  const queue = items.map(v => ({ ...v, scaled: v.value * scale }));
  const out = [];
  let area = { x: 0, y: 0, w, h, total: w * h };

  let row = [];
  while (queue.length){
    const v = queue[0];
    const isWide = area.w < area.h;
    const side = isWide ? area.w : area.h;
    /* worst() needs an array of NUMBERS — `row` holds objects, so map
       to .scaled before concatenating the candidate's scaled value. */
    const candidate = row.map(r => r.scaled).concat([v.scaled]);
    if (row.length === 0 || worst(candidate, side) < worst(row.map(r => r.scaled), side)){
      row.push(v); queue.shift();
    } else {
      const placed = layoutRow(row, area.x, area.y, area.w, area.h, isWide, area.total);
      out.push(...placed.rows);
      area = placed; row = [];
    }
  }
  if (row.length){
    const isWide = area.w < area.h;
    const placed = layoutRow(row, area.x, area.y, area.w, area.h, isWide, area.total);
    out.push(...placed.rows);
  }
  return out;
}

/* ---------- Chart ---------- */

export class Treemap extends Chart {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {{ items?: any[] }} [opts]
   *   items: [{ key, label, value, color, sub? }]
   */
  constructor(canvas, opts = {}){
    super(canvas, { animate: false });
    /** @private */ this.items = (opts.items ?? []).slice().sort((a, b) => b.value - a.value);
    /** @private */ this.cells = [];
    /** @private */ this.hover = null;
    canvas.addEventListener('pointermove', e => {
      const r = canvas.getBoundingClientRect();
      this.hover = { x: e.clientX - r.left, y: e.clientY - r.top };
      this.invalidate();
    });
    canvas.addEventListener('pointerleave', () => { this.hover = null; this.invalidate(); });
  }

  setData(items){
    this.items = (items ?? []).slice().sort((a, b) => b.value - a.value);
    this.cells = [];
    this.invalidate();
  }

  layout(ctx, w, h){
    if (!this.items.length){ this.cells = []; return; }
    this.cells = squarify(this.items, w, h);
  }

  draw(ctx, w, h){
    ctx.clearRect(0, 0, w, h);
    const gap = 2;
    const total = this.items.reduce((a, v) => a + v.value, 0) || 1;

    for (const c of this.cells){
      const cw = Math.max(0, c.w - gap);
      const ch = Math.max(0, c.h - gap);
      const grad = ctx.createLinearGradient(c.x, c.y, c.x + cw, c.y + ch);
      grad.addColorStop(0, c.color + 'EE');
      grad.addColorStop(1, c.color + '99');
      ctx.fillStyle = grad;
      ctx.fillRect(c.x, c.y, cw, ch);

      /* label */
      if (cw > 70 && ch > 30){
        ctx.fillStyle = 'rgba(0,0,0,.78)';
        ctx.font = '700 10.5px JetBrains Mono, monospace';
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText(c.label, c.x + 6, c.y + 6);
        if (ch > 50){
          ctx.font = '600 9.5px JetBrains Mono, monospace';
          ctx.fillStyle = 'rgba(0,0,0,.62)';
          const pct = ((c.value / total) * 100).toFixed(1);
          ctx.fillText(`${c.sub ?? ''}  ·  ${pct}%`, c.x + 6, c.y + 20);
        }
      } else if (cw > 30 && ch > 20){
        ctx.fillStyle = 'rgba(0,0,0,.78)';
        ctx.font = '700 9px JetBrains Mono, monospace';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(c.label, c.x + cw / 2, c.y + ch / 2);
      }
    }

    /* hover */
    if (this.hover){
      const cell = this.cells.find(c => this.hover.x >= c.x && this.hover.x < c.x + c.w
                                       && this.hover.y >= c.y && this.hover.y < c.y + c.h);
      if (cell){
        ctx.strokeStyle = '#F5E5E8';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(cell.x + 0.75, cell.y + 0.75, Math.max(0, cell.w - gap - 1.5),
                       Math.max(0, cell.h - gap - 1.5));
        const txt = `${cell.label}  ·  ${cell.sub ?? ''}  ·  ${((cell.value / total) * 100).toFixed(1)}%`;
        ctx.font = '600 11px JetBrains Mono, monospace';
        const tw = ctx.measureText(txt).width;
        const bw = tw + 14, bh = 18;
        let bx = this.hover.x + 12, by = this.hover.y - bh - 8;
        if (bx + bw > w) bx = w - bw - 4;
        if (by < 0) by = this.hover.y + 12;
        ctx.fillStyle = 'rgba(0,0,0,.85)';
        ctx.fillRect(bx, by, bw, bh);
        ctx.strokeStyle = 'rgba(255,30,60,.45)';
        ctx.strokeRect(bx + 0.5, by + 0.5, bw - 1, bh - 1);
        ctx.fillStyle = '#F5E5E8';
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillText(txt, bx + 7, by + bh / 2);
      }
    }
  }
}
