/* =================================================================
   SUBNET MAGAZINE — ICOSPHERE
   -----------------------------------------------------------------
   The hero piece. A regular polyhedron (dodecahedron: 20 vertices)
   with EVERY vertex connected to every other vertex — a complete
   graph K20 = 190 chords riding on top of the 30 natural edges.

   This matches the bittensor.com brand language: a geometric outer
   silhouette with a dense filigree of interior chords. We paint it
   in red on black.

   Pipeline (per frame):
     1. Rotate all 20 vertices around X and Y (slow).
     2. Sort the 190 chords by mid-depth, back to front.
     3. Paint each chord with depth-derived alpha and width. The 30
        canonical dodecahedron edges (the shortest pairs) get a
        slightly bolder treatment so the polyhedron silhouette
        reads.
     4. Animate a pool of packets along random edges.
     5. Paint vertex dots last, front to back, with halo on front-
        facing ones.

   Performance: O(verts^2) for the edge list is 190 — trivial.
   Per-frame work is O(edges + packets), both small.
   ================================================================= */

import { Chart } from './Chart.js';

const RED       = '#FF1E3C';
const RED_2     = '#FF4D60';
const RED_3     = '#FF8094';
const WHITE     = '#F5E5E8';

/** Generate the 20 vertices of a unit dodecahedron, normalized. */
function dodecahedronVerts(){
  const PHI = (1 + Math.sqrt(5)) / 2;
  const IPHI = 1 / PHI;
  const raw = [
    /* 8 cube vertices */
    [-1,-1,-1],[-1,-1, 1],[-1, 1,-1],[-1, 1, 1],
    [ 1,-1,-1],[ 1,-1, 1],[ 1, 1,-1],[ 1, 1, 1],
    /* (0, ±1/φ, ±φ) */
    [0,-IPHI,-PHI],[0,-IPHI, PHI],[0, IPHI,-PHI],[0, IPHI, PHI],
    /* (±1/φ, ±φ, 0) */
    [-IPHI,-PHI, 0],[-IPHI, PHI, 0],[ IPHI,-PHI, 0],[ IPHI, PHI, 0],
    /* (±φ, 0, ±1/φ) */
    [-PHI, 0,-IPHI],[-PHI, 0, IPHI],[ PHI, 0,-IPHI],[ PHI, 0, IPHI],
  ];
  return raw.map(v => {
    const m = Math.hypot(v[0], v[1], v[2]);
    return { x: v[0] / m, y: v[1] / m, z: v[2] / m };
  });
}

export class Icosphere extends Chart {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {{
   *   radius?:    number,       // 0..1 scalar of min(w,h)/2
   *   speed?:     number,       // base radians/sec
   *   packets?:   number,
   *   showVerts?: boolean,
   *   thickEdges?:boolean,       // bolder canonical edges
   *   transparent?:boolean       // clear bg, no fill
   * }} [opts]
   */
  constructor(canvas, opts = {}){
    super(canvas, { animate: true });
    /** @private */ this.radius     = opts.radius     ?? 0.46;
    /** @private */ this.speed      = opts.speed      ?? 0.22;
    /** @private */ this.showVerts  = opts.showVerts  !== false;
    /** @private */ this.thickEdges = opts.thickEdges !== false;
    /** @private */ this.transparent= opts.transparent !== false;

    /** @private */ this.verts = dodecahedronVerts();        // 20 nodes
    /** @private */ this.edges = this._buildEdges();         // all pairs
    /** @private */ this.canonical = this._markCanonicalEdges();

    const PCOUNT = opts.packets ?? 16;
    /** @private */ this.packets = Array.from({ length: PCOUNT }, () => ({
      e: Math.floor(Math.random() * this.edges.length),
      t: Math.random(),
      speed: 0.18 + Math.random() * 0.30,
      hue: Math.random() < 0.3 ? 'white' : 'red',
    }));
  }

  /** Complete graph: every pair of vertices. K20 = 190 edges. */
  _buildEdges(){
    const out = [];
    for (let i = 0; i < this.verts.length; i++)
      for (let j = i + 1; j < this.verts.length; j++)
        out.push({ a: i, b: j });
    return out;
  }

  /** Mark the 30 shortest pairs as the "canonical" dodecahedron edges. */
  _markCanonicalEdges(){
    const dists = this.edges.map((e, i) => {
      const a = this.verts[e.a], b = this.verts[e.b];
      const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z;
      return { i, d2: dx*dx + dy*dy + dz*dz };
    });
    dists.sort((u, v) => u.d2 - v.d2);
    const mark = new Set();
    for (let k = 0; k < 30; k++) mark.add(dists[k].i);
    return mark;
  }

  draw(ctx, w, h, t){
    if (this.transparent) ctx.clearRect(0, 0, w, h);
    else { ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h); }

    const cx = w / 2, cy = h / 2;
    const R  = Math.min(w, h) * this.radius;

    /* slow dual-axis rotation */
    const ax = t * this.speed * 0.45;
    const ay = t * this.speed;
    const cosX = Math.cos(ax), sinX = Math.sin(ax);
    const cosY = Math.cos(ay), sinY = Math.sin(ay);

    /* atmospheric red halo behind the shape */
    const halo = ctx.createRadialGradient(cx, cy, R * 0.35, cx, cy, R * 1.35);
    halo.addColorStop(0,    'rgba(255,30,60,.08)');
    halo.addColorStop(0.65, 'rgba(255,30,60,.04)');
    halo.addColorStop(1,    'rgba(255,30,60,0)');
    ctx.fillStyle = halo;
    ctx.beginPath(); ctx.arc(cx, cy, R * 1.35, 0, Math.PI * 2); ctx.fill();

    /* project all vertices */
    const N = this.verts.length;
    const p = new Array(N);
    for (let i = 0; i < N; i++){
      const v = this.verts[i];
      const x1 = v.x * cosY + v.z * sinY;
      const z1 = -v.x * sinY + v.z * cosY;
      const y2 = v.y * cosX - z1 * sinX;
      const z2 = v.y * sinX + z1 * cosX;
      const depth = (z2 + 1) / 2;  // 0 back .. 1 front
      p[i] = { sx: cx + x1 * R, sy: cy + y2 * R, d: depth };
    }

    /* sort edges back-to-front */
    const sorted = this.edges
      .map((e, i) => ({ ...e, i, mid: (p[e.a].d + p[e.b].d) / 2 }))
      .sort((u, v) => u.mid - v.mid);

    /* paint edges */
    for (const e of sorted){
      const a = p[e.a], b = p[e.b];
      const md = (a.d + b.d) / 2;
      const isCanon = this.canonical.has(e.i);
      const alpha = isCanon
        ? 0.18 + md * 0.62   // bolder canonical edges
        : 0.04 + md * 0.32;  // faint interior chords
      const width = isCanon ? 0.6 + md * 1.0 : 0.4 + md * 0.6;
      ctx.strokeStyle = `rgba(255,30,60,${alpha})`;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(a.sx, a.sy);
      ctx.lineTo(b.sx, b.sy);
      ctx.stroke();
    }

    /* animate packets along edges */
    for (const pk of this.packets){
      pk.t += pk.speed * 0.016;
      if (pk.t >= 1){
        pk.t = 0;
        pk.e = Math.floor(Math.random() * this.edges.length);
        pk.speed = 0.18 + Math.random() * 0.30;
        pk.hue = Math.random() < 0.3 ? 'white' : 'red';
      }
      const e = this.edges[pk.e];
      const a = p[e.a], b = p[e.b];
      const md = (a.d + b.d) / 2;
      const x = a.sx + (b.sx - a.sx) * pk.t;
      const y = a.sy + (b.sy - a.sy) * pk.t;
      const head = 1 - Math.abs(pk.t - .5) * 2;
      const alpha = (0.4 + md * 0.55) * (0.55 + head * 0.45);
      if (pk.hue === 'white'){
        ctx.fillStyle = `rgba(245,229,232,${alpha})`;
        ctx.beginPath(); ctx.arc(x, y, 1.6, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.fillStyle = `rgba(255,107,122,${alpha})`;
        ctx.beginPath(); ctx.arc(x, y, 1.4, 0, Math.PI * 2); ctx.fill();
      }
    }

    /* vertex dots, front to back so front overdraws */
    if (this.showVerts){
      const psort = p
        .map((q, i) => ({ ...q, i }))
        .sort((u, v) => u.d - v.d);
      for (const q of psort){
        const r = 1.5 + q.d * 1.4;
        if (q.d > 0.55){
          ctx.fillStyle = `rgba(255,30,60,${0.22 * (q.d - 0.55) / 0.45})`;
          ctx.beginPath(); ctx.arc(q.sx, q.sy, r * 3.2, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = `rgba(255,${30 + q.d * 110},${60 + q.d * 100},${0.4 + q.d * 0.55})`;
        ctx.beginPath(); ctx.arc(q.sx, q.sy, r, 0, Math.PI * 2); ctx.fill();
        if (q.d > 0.85){
          ctx.fillStyle = `rgba(245,229,232,${(q.d - 0.85) / 0.15})`;
          ctx.beginPath(); ctx.arc(q.sx, q.sy, r * 0.5, 0, Math.PI * 2); ctx.fill();
        }
      }
    }

    /* faint silhouette rim — sells the spherical envelope */
    ctx.strokeStyle = 'rgba(255,30,60,.06)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();

    /* lint guard */
    void RED; void RED_2; void RED_3; void WHITE;
  }
}
