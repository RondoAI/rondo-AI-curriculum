/* =================================================================
   SUBNET MAGAZINE, NODE SPHERE (v2)
   -----------------------------------------------------------------
   The brand mark. A slowly rotating dense plexus of red nodes, a
   KNN base mesh plus a near-complete density fill so the interior
   packs with crossing chords into a filigree mass, the bittensor
   mark in red. Deliberately quiet: a smooth spin, depth-keyed edge
   and node alpha, an atmospheric halo. No packets, no flashing,    the density itself is the statement.

   Render pipeline (per frame):
     1. Soft red atmospheric halo behind the sphere.
     2. Edges painted back-to-front, alpha keyed to mid-depth.
     3. Nodes painted back-to-front, brighter toward the front.
   ================================================================= */

import { Chart } from './Chart.js';

const RED       = '#FF1E3C';
const RED_BR    = '#FF4D60';
const RED_HOT   = '#FF8094';
const RED_SOFT  = 'rgba(255,30,60,.55)';

export class NodeSphere extends Chart {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {{
   *   nodes?:  number,
   *   K?:      number,
   *   density?:number,
   *   edgeCap?:number,
   *   chords?: number,
   *   speed?:  number,
   *   glow?:   boolean,
   *   atmos?:  boolean
   * }} [opts]
   */
  constructor(canvas, opts = {}){
    super(canvas, { animate: true });
    /** @private */ this.N        = opts.nodes   ?? 72;    // few enough to read angular
    /** @private */ this.K        = opts.K       ?? 4;     // KNN structural mesh
    /** @private */ this.density  = opts.density ?? 0.45;  // 0..1, chance any pair wires
    /** @private */ this.edgeCap  = opts.edgeCap ?? 3000;  // safety cap
    /** @private */ this.chords   = opts.chords  ?? 0;     // extra explicit random chords
    /** @private */ this.speed    = opts.speed   ?? 0.32;
    /** @private */ this.glow     = opts.glow   !== false;
    /** @private */ this.atmos    = opts.atmos  !== false;

    /** @private */ this.points  = this._buildPoints();
    /** @private */ this.edges   = this._buildEdges();
  }

  /** Fibonacci-sphere distribution. */
  _buildPoints(){
    const pts = [];
    const phi = Math.PI * (Math.sqrt(5) - 1);
    for (let i = 0; i < this.N; i++){
      const y = 1 - (i / (this.N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = phi * i;
      pts.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r });
    }
    return pts;
  }

  /** Build the edge web. A KNN base mesh for structure, then a
      near-complete random fill so the interior packs with crossing
      chords, the dense angular filigree of the bittensor mark, not
      a clean surface sphere. */
  _buildEdges(){
    const N = this.points.length;
    const seen = new Set();
    const out = [];
    const add = (i, j) => {
      if (i === j) return;
      const key = i < j ? `${i}:${j}` : `${j}:${i}`;
      if (seen.has(key)) return;
      seen.add(key);
      const a = this.points[i], b = this.points[j];
      const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z;
      out.push({ a: i, b: j, d2: dx*dx + dy*dy + dz*dz });
    };

    /* KNN structural mesh */
    for (let i = 0; i < N; i++){
      const a = this.points[i];
      const d = [];
      for (let j = 0; j < N; j++){
        if (i === j) continue;
        const b = this.points[j];
        const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z;
        d.push({ j, d2: dx*dx + dy*dy + dz*dz });
      }
      d.sort((u, v) => u.d2 - v.d2);
      for (let k = 0; k < this.K && k < d.length; k++) add(i, d[k].j);
    }

    /* dense crossing filigree, every pair, by probability */
    if (this.density > 0){
      for (let i = 0; i < N; i++)
        for (let j = i + 1; j < N; j++)
          if (Math.random() < this.density) add(i, j);
    }

    /* extra explicit chords if asked */
    for (let c = 0; c < this.chords; c++){
      add((Math.random() * N) | 0, (Math.random() * N) | 0);
    }

    /* keep all unless we blow the safety cap (then keep a random subset) */
    if (out.length > this.edgeCap){
      for (let i = out.length - 1; i > 0; i--){
        const k = (Math.random() * (i + 1)) | 0;
        [out[i], out[k]] = [out[k], out[i]];
      }
      out.length = this.edgeCap;
    }
    return out;
  }

  draw(ctx, w, h, t){
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const R  = Math.min(w, h) * 0.42;

    /* ===== rotation, a steady Y spin with a slow, gentle nod on X,
       instead of a continuous tumble, so it reads smooth ===== */
    const ay = t * this.speed;
    const ax = Math.sin(t * this.speed * 0.45) * 0.42;
    const cosX = Math.cos(ax), sinX = Math.sin(ax);
    const cosY = Math.cos(ay), sinY = Math.sin(ay);

    /* ===== atmospheric halo ===== */
    if (this.atmos){
      const grad = ctx.createRadialGradient(cx, cy, R * 0.4, cx, cy, R * 1.35);
      grad.addColorStop(0,    'rgba(255,30,60,.10)');
      grad.addColorStop(0.55, 'rgba(255,30,60,.06)');
      grad.addColorStop(1,    'rgba(255,30,60,0)');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(cx, cy, R * 1.35, 0, Math.PI * 2); ctx.fill();
    }

    /* ===== project all points ===== */
    const N = this.points.length;
    const p = new Array(N);
    for (let i = 0; i < N; i++){
      const pt = this.points[i];
      const x1 = pt.x * cosY + pt.z * sinY;
      const z1 = -pt.x * sinY + pt.z * cosY;
      const y2 = pt.y * cosX - z1 * sinX;
      const z2 = pt.y * sinX + z1 * cosX;
      const depth = (z2 + 1) / 2;  // 0 (back) .. 1 (front)
      p[i] = { sx: cx + x1 * R, sy: cy + y2 * R, d: depth };
    }

    /* ===== edges, back to front ===== */
    const eSorted = this.edges
      .map((e, i) => ({ ...e, i, mid: (p[e.a].d + p[e.b].d) / 2 }))
      .sort((u, v) => u.mid - v.mid);

    for (const e of eSorted){
      const a = p[e.a], b = p[e.b];
      const md = (a.d + b.d) / 2;
      /* low per-edge alpha so the hundreds of crossing chords build
         into a filigree mass instead of a solid red blob */
      const alpha = 0.045 + md * 0.4;
      ctx.strokeStyle = `rgba(255,30,60,${alpha})`;
      ctx.lineWidth = 0.3 + md * 0.5;
      ctx.beginPath();
      ctx.moveTo(a.sx, a.sy);
      ctx.lineTo(b.sx, b.sy);
      ctx.stroke();
    }

    /* ===== nodes, back to front ===== */
    const pSorted = p
      .map((q, i) => ({ ...q, i }))
      .sort((u, v) => u.d - v.d);

    for (const q of pSorted){
      const r = 0.7 + q.d * 1.9;
      const a = 0.4 + q.d * 0.6;
      if (this.glow && q.d > 0.62){
        ctx.fillStyle = `rgba(255,30,60,${0.22 * (q.d - 0.62) / 0.38})`;
        ctx.beginPath(); ctx.arc(q.sx, q.sy, r * 3.8, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = `rgba(255,${30 + q.d * 110},${60 + q.d * 100},${a})`;
      ctx.beginPath(); ctx.arc(q.sx, q.sy, r, 0, Math.PI * 2); ctx.fill();
      /* bright core on the frontmost nodes, a quiet hull sparkle */
      if (q.d > 0.86){
        ctx.fillStyle = `rgba(255,224,228,${((q.d - 0.86) / 0.14).toFixed(3)})`;
        ctx.beginPath(); ctx.arc(q.sx, q.sy, r * 0.55, 0, Math.PI * 2); ctx.fill();
      }
    }

    /* no rim ring, the silhouette is the plexus itself, not a circle */

    /* unused-color guard (lint) */
    void RED; void RED_BR; void RED_HOT; void RED_SOFT;
  }
}
