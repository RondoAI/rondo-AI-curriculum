/* =================================================================
   SUBNET MAGAZINE, JARVIS NEURAL NET
   -----------------------------------------------------------------
   The Subnet Oracle's signature chart. A HUD-style ensemble: a small
   rotating node-sphere at the center, concentric arcs spinning at
   different rates, a radar sweep arm with a glowing trail, a hex
   grid backdrop, and short data labels floating along the outer
   ring. Designed to read as "the Oracle is processing, live data is
   flowing through" without ever shouting.

   All in red on dark, no other colors, no images, no DOM. Canvas
   only, single class, drop into any sized canvas (card cover or
   banner hero).

   Render pipeline (per frame):
     1. Hex grid backdrop (very low alpha)
     2. Three concentric rings, each rotating at a distinct rate
     3. Radar sweep arm with motion blur trail
     4. Center sphere of nodes (KNN mesh, depth-shaded)
     5. Floating data labels riding the outer ring
     6. Occasional expanding pulse rings (data event indicators)
   ================================================================= */

import { Chart } from './Chart.js';

const RED      = '#FF1E3C';
const RED_BR   = '#FF4D60';
const RED_HOT  = '#FF8094';
const RED_DIM  = 'rgba(255,30,60,0.35)';
const RED_GHOST = 'rgba(255,30,60,0.10)';

// Short, fast-rotating tokens of "live data" that orbit the outer
// ring. Deliberately terse, the kind of thing you'd glance at on a
// trading desk. No real values; the chart is decorative, not a
// telemetry feed.
const DATA_TOKENS = [
  'SN4·OK',  'TAO·ALIGN',  'TDX·v3',   'YUMA·CONS',
  'DTAO·LIVE', 'GLM·5.1', 'INF·H200',  'POL·Δ-0.03',
  'OPUS·4.7', 'CACHE·HIT', 'TGT·BUY',  'STAKE·LOCK',
  'EMIT·NORM',  'WGT·SET',  'CONV·READY','MoE·8x',
];

export class JarvisNet extends Chart {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {{
   *   nodes?:        number,
   *   ringSpeed?:    number,
   *   sweepSpeed?:   number,
   *   labels?:       boolean,
   *   hexGrid?:      boolean,
   *   pulseRate?:    number,
   *   seed?:         number
   * }} [opts]
   */
  constructor(canvas, opts = {}){
    super(canvas, { animate: true });
    this.N          = opts.nodes      ?? 22;
    this.ringSpeed  = opts.ringSpeed  ?? 0.18;
    this.sweepSpeed = opts.sweepSpeed ?? 0.55;
    this.labelsOn   = opts.labels   !== false;
    this.hexOn      = opts.hexGrid  !== false;
    this.pulseRate  = opts.pulseRate  ?? 4.5;     // seconds between pulses
    this.seed       = opts.seed       ?? 1;

    /* derived once at layout */
    this._cx = 0; this._cy = 0; this._R = 0;
    this._pts3d  = [];
    this._labels = [];
    this._lastPulse = -Infinity;
    this._pulses    = [];     // active pulse rings
  }

  /* ---------------------------------------------------------------- */
  layout(ctx, w, h){
    this._cx = w / 2;
    this._cy = h / 2;
    this._R  = Math.min(w, h) * 0.46;

    /* Generate node positions on a unit sphere via golden-angle
       spiral, seeded jitter so each instance has its own silhouette. */
    const rng = mulberry32(this.seed * 7919 + this.N * 13);
    const phi = Math.PI * (3.0 - Math.sqrt(5.0));
    const pts = [];
    for (let i = 0; i < this.N; i++){
      const y = 1 - (i / Math.max(1, this.N - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = phi * i + (rng() - 0.5) * 0.4;
      pts.push([Math.cos(theta) * r, y, Math.sin(theta) * r]);
    }
    this._pts3d = pts;

    /* Pick 6-8 data labels to display this layout. Stable per
       instance via the same rng. */
    if (this.labelsOn){
      const n = 7;
      const start = Math.floor(rng() * DATA_TOKENS.length);
      this._labels = Array.from({ length: n }, (_, i) =>
        DATA_TOKENS[(start + i * 3) % DATA_TOKENS.length]);
    } else {
      this._labels = [];
    }
  }

  /* ---------------------------------------------------------------- */
  draw(ctx, w, h, t){
    ctx.clearRect(0, 0, w, h);

    const cx = this._cx, cy = this._cy, R = this._R;

    /* 1. Hex grid backdrop, very subtle */
    if (this.hexOn) this._drawHexGrid(ctx, w, h);

    /* 2. Three concentric rings, rotating at different rates */
    this._drawRing(ctx, cx, cy, R * 0.98,  t * this.ringSpeed,       12, 0.38);
    this._drawRing(ctx, cx, cy, R * 0.78, -t * this.ringSpeed * 0.7,  9, 0.28);
    this._drawRing(ctx, cx, cy, R * 0.58,  t * this.ringSpeed * 1.4,  6, 0.22);

    /* 3. Pulse rings, expanding outward, triggered every pulseRate */
    if (t - this._lastPulse > this.pulseRate){
      this._lastPulse = t;
      this._pulses.push({ start: t });
    }
    this._pulses = this._pulses.filter(p => t - p.start < 2.2);
    for (const p of this._pulses){
      const age = t - p.start;
      const r = R * 0.4 + age * R * 0.5;
      const alpha = Math.max(0, 0.55 - age * 0.28);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,30,60,${alpha})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }

    /* 4. Radar sweep arm with a trailing wedge */
    const sweep = (t * this.sweepSpeed) % (Math.PI * 2);
    this._drawSweep(ctx, cx, cy, R * 0.98, sweep);

    /* 5. Center node sphere, rotating */
    this._drawSphere(ctx, cx, cy, R * 0.42, t * 0.45);

    /* 6. Floating data labels along the outer ring */
    if (this.labelsOn && this._labels.length){
      this._drawLabels(ctx, cx, cy, R * 1.08, t * 0.10);
    }
  }

  /* ---------- pieces ---------- */

  _drawHexGrid(ctx, w, h){
    const size = Math.max(18, Math.min(w, h) / 14);
    const hH = size * Math.sqrt(3);
    ctx.save();
    ctx.strokeStyle = RED_GHOST;
    ctx.lineWidth = 0.5;
    for (let y = -hH; y < h + hH; y += hH){
      for (let x = -size * 2; x < w + size * 2; x += size * 1.5){
        const offsetY = ((x / (size * 1.5)) | 0) % 2 === 0 ? 0 : hH / 2;
        this._hexPath(ctx, x, y + offsetY, size);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  _hexPath(ctx, cx, cy, r){
    ctx.beginPath();
    for (let i = 0; i < 6; i++){
      const a = (Math.PI / 3) * i + Math.PI / 6;
      const px = cx + r * Math.cos(a);
      const py = cy + r * Math.sin(a);
      if (i === 0) ctx.moveTo(px, py);
      else         ctx.lineTo(px, py);
    }
    ctx.closePath();
  }

  _drawRing(ctx, cx, cy, r, phase, ticks, alpha){
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(phase);
    /* outer dashed ring */
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255,30,60,${alpha})`;
    ctx.lineWidth = 0.8;
    ctx.setLineDash([4, 7]);
    ctx.stroke();
    ctx.setLineDash([]);
    /* tick marks at evenly spaced angles */
    for (let i = 0; i < ticks; i++){
      const a = (Math.PI * 2 * i) / ticks;
      const ix = Math.cos(a) * (r - 4);
      const iy = Math.sin(a) * (r - 4);
      const ox = Math.cos(a) * (r + 4);
      const oy = Math.sin(a) * (r + 4);
      ctx.beginPath();
      ctx.moveTo(ix, iy);
      ctx.lineTo(ox, oy);
      ctx.strokeStyle = `rgba(255,77,96,${alpha + 0.2})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.restore();
  }

  _drawSweep(ctx, cx, cy, r, angle){
    /* radar wedge: a triangle behind the sweep line, fading out */
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    const grad = ctx.createLinearGradient(0, 0, r, 0);
    grad.addColorStop(0,    'rgba(255,30,60,0.0)');
    grad.addColorStop(0.7,  'rgba(255,30,60,0.05)');
    grad.addColorStop(1.0,  'rgba(255,30,60,0.35)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, r, -0.35, 0);
    ctx.closePath();
    ctx.fill();
    /* leading edge line */
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(r, 0);
    ctx.strokeStyle = RED_HOT;
    ctx.lineWidth = 1.2;
    ctx.shadowColor = RED;
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.restore();
  }

  _drawSphere(ctx, cx, cy, R, phase){
    /* Rotate 3D points around Y, project to 2D, draw KNN edges then
       nodes, back-to-front so front-face glints on top. */
    const cosY = Math.cos(phase), sinY = Math.sin(phase);
    const proj = this._pts3d.map(([x, y, z]) => {
      const xr = x * cosY + z * sinY;
      const zr = -x * sinY + z * cosY;
      return [cx + xr * R, cy + y * R, zr];
    });
    /* edges between near neighbors */
    ctx.save();
    ctx.lineWidth = 0.6;
    for (let i = 0; i < proj.length; i++){
      for (let j = i + 1; j < proj.length; j++){
        const dx = this._pts3d[i][0] - this._pts3d[j][0];
        const dy = this._pts3d[i][1] - this._pts3d[j][1];
        const dz = this._pts3d[i][2] - this._pts3d[j][2];
        const d = Math.sqrt(dx*dx + dy*dy + dz*dz);
        if (d < 0.70){
          const depth = (proj[i][2] + proj[j][2]) * 0.5;
          const a = Math.max(0.10, Math.min(0.75, 0.20 + (depth + 1) * 0.32));
          ctx.strokeStyle = `rgba(255,30,60,${a})`;
          ctx.beginPath();
          ctx.moveTo(proj[i][0], proj[i][1]);
          ctx.lineTo(proj[j][0], proj[j][1]);
          ctx.stroke();
        }
      }
    }
    /* nodes */
    proj.sort((a, b) => a[2] - b[2]);
    for (const [x, y, z] of proj){
      const a = Math.max(0.30, Math.min(1.0, 0.35 + (z + 1) * 0.30));
      const r = 1.1 + (z + 1) * 0.9;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,77,96,${a})`;
      ctx.fill();
    }
    ctx.restore();
  }

  _drawLabels(ctx, cx, cy, r, phase){
    ctx.save();
    ctx.font = '600 9px JetBrains Mono, ui-monospace, monospace';
    ctx.fillStyle = RED_BR;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const n = this._labels.length;
    for (let i = 0; i < n; i++){
      const a = phase + (Math.PI * 2 * i) / n;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r * 0.94;
      /* fade labels at the back of the orbit using y-projection only,
         keeps the front ones legible. */
      const front = Math.sin(a);
      const alpha = 0.35 + Math.max(0, front) * 0.55;
      ctx.fillStyle = `rgba(255,77,96,${alpha})`;
      ctx.fillText(this._labels[i], x, y);
    }
    ctx.restore();
  }
}

/* ---------- tiny seeded PRNG so layouts are deterministic ---------- */
function mulberry32(seed){
  let s = seed >>> 0;
  return function(){
    s |= 0; s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
