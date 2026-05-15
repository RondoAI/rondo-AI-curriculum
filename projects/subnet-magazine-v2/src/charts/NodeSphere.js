/* =================================================================
   SUBNET MAGAZINE — NODE SPHERE (v2)
   -----------------------------------------------------------------
   The brand mark. A rotating wireframe sphere of red nodes wired
   into a dense network. Same identity as the official logo, but
   with more nodes, more connections, atmospheric glow, and live
   data packets flowing along random edges so the mark reads as a
   working network — not a static graphic.

   Render pipeline (per frame):
     1. Soft red atmospheric halo behind the sphere.
     2. Edges painted back-to-front so nearer edges overdraw farther.
        Each edge's alpha is keyed to its mid-depth.
     3. A pool of "packets" travels along randomly-chosen edges,
        re-targeting when they reach the end.
     4. Nodes painted back-to-front. Front-facing nodes get a halo
        and slight scintillation.
     5. A faint outer rim ring on the silhouette.
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
   *   edgeCap?:number,
   *   speed?:  number,
   *   packets?:number,
   *   glow?:   boolean,
   *   atmos?:  boolean
   * }} [opts]
   */
  constructor(canvas, opts = {}){
    super(canvas, { animate: true });
    /** @private */ this.N        = opts.nodes   ?? 180;   // dense
    /** @private */ this.K        = opts.K       ?? 6;     // neighbors per node
    /** @private */ this.edgeCap  = opts.edgeCap ?? 420;   // total local edges
    /** @private */ this.chords   = opts.chords  ?? 0;     // random crossing chords
    /** @private */ this.speed    = opts.speed   ?? 0.32;
    /** @private */ this.glow     = opts.glow   !== false;
    /** @private */ this.atmos    = opts.atmos  !== false;

    /** @private */ this.points  = this._buildPoints();
    /** @private */ this.edges   = this._buildEdges();

    /** @private */ this.packetN = opts.packets ?? 14;
    /** @private */ this.packets = this._buildPackets();
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

  /** K-nearest neighbors per node, deduped, sorted, capped. */
  _buildEdges(){
    const seen = new Set();
    const out = [];
    for (let i = 0; i < this.points.length; i++){
      const a = this.points[i];
      const d = [];
      for (let j = 0; j < this.points.length; j++){
        if (i === j) continue;
        const b = this.points[j];
        const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z;
        d.push({ j, d2: dx*dx + dy*dy + dz*dz });
      }
      d.sort((u, v) => u.d2 - v.d2);
      for (let k = 0; k < this.K; k++){
        const j = d[k].j;
        const key = i < j ? `${i}:${j}` : `${j}:${i}`;
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({ a: i, b: j, d2: d[k].d2 });
      }
    }
    out.sort((u, v) => u.d2 - v.d2);
    const local = out.slice(0, this.edgeCap);

    /* random long-range chords across the interior — this is what
       gives the bittensor.com plexus its busy, crossing-line look
       rather than a clean surface mesh. */
    const N = this.points.length;
    for (let c = 0; c < this.chords; c++){
      const i = (Math.random() * N) | 0;
      let j = (Math.random() * N) | 0;
      if (i === j) j = (j + 1) % N;
      const key = i < j ? `${i}:${j}` : `${j}:${i}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const a = this.points[i], b = this.points[j];
      const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z;
      local.push({ a: i, b: j, d2: dx*dx + dy*dy + dz*dz });
    }
    return local;
  }

  /** Each packet rides a random edge with a phase and speed. */
  _buildPackets(){
    const arr = [];
    for (let i = 0; i < this.packetN; i++){
      arr.push({
        e:     Math.floor(Math.random() * this.edges.length),
        t:     Math.random(),
        speed: 0.18 + Math.random() * 0.35,
      });
    }
    return arr;
  }

  draw(ctx, w, h, t){
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const R  = Math.min(w, h) * 0.42;

    /* ===== rotation ===== */
    const ax = t * this.speed * 0.55;
    const ay = t * this.speed;
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
      const alpha = 0.06 + md * 0.55;
      ctx.strokeStyle = `rgba(255,30,60,${alpha})`;
      ctx.lineWidth = 0.4 + md * 0.7;
      ctx.beginPath();
      ctx.moveTo(a.sx, a.sy);
      ctx.lineTo(b.sx, b.sy);
      ctx.stroke();
    }

    /* ===== packets travel along edges ===== */
    for (const pk of this.packets){
      pk.t += pk.speed * 0.016;
      if (pk.t >= 1){
        pk.t = 0;
        pk.e = Math.floor(Math.random() * this.edges.length);
        pk.speed = 0.18 + Math.random() * 0.35;
      }
      const e = this.edges[pk.e];
      const a = p[e.a], b = p[e.b];
      const x = a.sx + (b.sx - a.sx) * pk.t;
      const y = a.sy + (b.sy - a.sy) * pk.t;
      const md = (a.d + b.d) / 2;
      const alpha = 0.5 + md * 0.5;
      ctx.fillStyle = `rgba(255,128,148,${alpha})`;
      ctx.beginPath(); ctx.arc(x, y, 1.3, 0, Math.PI * 2); ctx.fill();
    }

    /* ===== nodes, back to front ===== */
    const pSorted = p
      .map((q, i) => ({ ...q, i }))
      .sort((u, v) => u.d - v.d);

    for (const q of pSorted){
      const r = 0.6 + q.d * 1.6;
      const a = 0.30 + q.d * 0.70;
      if (this.glow && q.d > 0.72){
        ctx.fillStyle = `rgba(255,30,60,${0.18 * (q.d - 0.72) / 0.28})`;
        ctx.beginPath(); ctx.arc(q.sx, q.sy, r * 3.6, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = `rgba(255,${30 + q.d * 100},${60 + q.d * 90},${a})`;
      ctx.beginPath(); ctx.arc(q.sx, q.sy, r, 0, Math.PI * 2); ctx.fill();
    }

    /* ===== silhouette rim ring ===== */
    ctx.strokeStyle = 'rgba(255,30,60,.18)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();

    /* unused-color guard (lint) */
    void RED; void RED_BR; void RED_HOT; void RED_SOFT;
  }
}
