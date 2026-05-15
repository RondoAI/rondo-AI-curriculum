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
    /** @private */ this.N        = opts.nodes   ?? 72;    // few enough to read angular
    /** @private */ this.K        = opts.K       ?? 4;     // KNN structural mesh
    /** @private */ this.density  = opts.density ?? 0.45;  // 0..1 — chance any pair wires
    /** @private */ this.edgeCap  = opts.edgeCap ?? 3000;  // safety cap
    /** @private */ this.chords   = opts.chords  ?? 0;     // extra explicit random chords
    /** @private */ this.speed    = opts.speed   ?? 0.32;
    /** @private */ this.glow     = opts.glow   !== false;
    /** @private */ this.atmos    = opts.atmos  !== false;

    /** @private */ this.points  = this._buildPoints();
    /** @private */ this.edges   = this._buildEdges();

    /* adjacency: edge indices touching each node, so packets can
       chain node-to-node instead of teleporting to a random edge */
    /** @private */ this.adj = Array.from({ length: this.N }, () => []);
    this.edges.forEach((e, i) => { this.adj[e.a].push(i); this.adj[e.b].push(i); });

    /** @private */ this.nodeAct = new Float32Array(this.N);  // activation, decays
    /** @private */ this._lastT  = 0;

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

  /** Build the edge web. A KNN base mesh for structure, then a
      near-complete random fill so the interior packs with crossing
      chords — the dense angular filigree of the bittensor mark, not
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

    /* dense crossing filigree — every pair, by probability */
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

  /** Each packet rides an edge, then chains onto a connected edge at
      the node it lands on — data routing through the network. */
  _buildPackets(){
    const arr = [];
    for (let i = 0; i < this.packetN; i++){
      const e = (Math.random() * this.edges.length) | 0;
      arr.push({
        e,
        from:  this.edges[e].a,                  // node it travels away from
        t:     Math.random(),
        speed: 0.5 + Math.random() * 0.8,
      });
    }
    return arr;
  }

  /** Pick a fresh edge leaving `node`; fall back to any edge. */
  _nextEdge(node){
    const opts = this.adj[node];
    if (opts && opts.length) return opts[(Math.random() * opts.length) | 0];
    return (Math.random() * this.edges.length) | 0;
  }

  draw(ctx, w, h, t){
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const R  = Math.min(w, h) * 0.42;

    /* real frame delta — keeps motion smooth and frame-rate-independent */
    const dt = this._lastT ? Math.min(0.05, t - this._lastT) : 0.016;
    this._lastT = t;

    /* ===== rotation — a steady Y spin with a slow, gentle nod on X,
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

    /* ===== packets fire through the network, node to node ===== */
    for (const pk of this.packets){
      pk.t += pk.speed * dt;
      const e = this.edges[pk.e];
      let from = pk.from, to = (e.a === from) ? e.b : e.a;

      if (pk.t >= 1){
        /* arrived — light up the node, then route onto a connected edge */
        this.nodeAct[to] = Math.min(1.6, this.nodeAct[to] + 1);
        pk.from = to;
        pk.e = this._nextEdge(to);
        pk.speed = 0.5 + Math.random() * 0.9;
        pk.t = 0;
        from = pk.from;
        const ne = this.edges[pk.e];
        to = (ne.a === from) ? ne.b : ne.a;
      }

      const a = p[from], b = p[to];
      const md = (a.d + b.d) / 2;
      const x = a.sx + (b.sx - a.sx) * pk.t;
      const y = a.sy + (b.sy - a.sy) * pk.t;
      /* trailing streak along the edge behind the head */
      const tail = Math.max(0, pk.t - 0.22);
      ctx.strokeStyle = `rgba(255,128,148,${(0.32 + md * 0.4).toFixed(3)})`;
      ctx.lineWidth = 1 + md * 1.1;
      ctx.beginPath();
      ctx.moveTo(a.sx + (b.sx - a.sx) * tail, a.sy + (b.sy - a.sy) * tail);
      ctx.lineTo(x, y);
      ctx.stroke();
      /* glowing head */
      ctx.fillStyle = `rgba(255,30,60,${(0.35 + md * 0.4).toFixed(3)})`;
      ctx.beginPath(); ctx.arc(x, y, 3.4 + md * 2.2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = `rgba(255,232,236,${(0.7 + md * 0.3).toFixed(3)})`;
      ctx.beginPath(); ctx.arc(x, y, 1.5 + md * 0.8, 0, Math.PI * 2); ctx.fill();
    }

    /* activation decay — nodes cool after a packet lands on them */
    for (let i = 0; i < N; i++){
      if (this.nodeAct[i] > 0){
        this.nodeAct[i] -= dt * 2.4;
        if (this.nodeAct[i] < 0) this.nodeAct[i] = 0;
      }
    }

    /* ===== nodes, back to front ===== */
    const pSorted = p
      .map((q, i) => ({ ...q, i }))
      .sort((u, v) => u.d - v.d);

    for (const q of pSorted){
      const r = 0.7 + q.d * 1.9;
      const a = 0.4 + q.d * 0.6;
      const act = this.nodeAct[q.i];
      /* activation flash — a node a packet just reached pulses bright */
      if (act > 0){
        const ar = r + act * 7;
        const g = ctx.createRadialGradient(q.sx, q.sy, 0, q.sx, q.sy, ar);
        g.addColorStop(0, `rgba(255,128,148,${Math.min(0.7, act * 0.6)})`);
        g.addColorStop(1, 'rgba(255,30,60,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(q.sx, q.sy, ar, 0, Math.PI * 2); ctx.fill();
      }
      if (this.glow && q.d > 0.62){
        ctx.fillStyle = `rgba(255,30,60,${0.22 * (q.d - 0.62) / 0.38})`;
        ctx.beginPath(); ctx.arc(q.sx, q.sy, r * 3.8, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = `rgba(255,${30 + q.d * 110},${60 + q.d * 100},${a})`;
      ctx.beginPath(); ctx.arc(q.sx, q.sy, r + act * 0.9, 0, Math.PI * 2); ctx.fill();
      /* bright core on frontmost or freshly-activated nodes */
      if (q.d > 0.86 || act > 0.4){
        ctx.fillStyle = `rgba(255,224,228,${Math.max((q.d - 0.86) / 0.14, act * 0.8).toFixed(3)})`;
        ctx.beginPath(); ctx.arc(q.sx, q.sy, r * 0.55, 0, Math.PI * 2); ctx.fill();
      }
    }

    /* no rim ring — the silhouette is the plexus itself, not a circle */

    /* unused-color guard (lint) */
    void RED; void RED_BR; void RED_HOT; void RED_SOFT;
  }
}
