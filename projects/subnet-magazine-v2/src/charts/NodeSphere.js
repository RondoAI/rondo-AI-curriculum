/* =================================================================
   SUBNET MAGAZINE — NODE SPHERE
   -----------------------------------------------------------------
   The brand mark: a rotating wireframe sphere of red nodes connected
   by chords. Same shape as the official logo. Cheap 3D math: every
   point gets stable spherical coords, projected to 2D each frame.

   Used in the masthead at small size (60×60) and as a hero ornament
   at large size (320×320).
   ================================================================= */

import { Chart } from './Chart.js';

const RED        = '#FF1E3C';
const RED_SOFT   = 'rgba(255,30,60,.55)';
const RED_FAINT  = 'rgba(255,30,60,.12)';

export class NodeSphere extends Chart {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {{nodes?: number, edges?: number, speed?: number, glow?: boolean}} [opts]
   */
  constructor(canvas, opts = {}){
    super(canvas, { animate: true });
    /** @private */ this.N = opts.nodes ?? 110;
    /** @private */ this.EDGE_BUDGET = opts.edges ?? 240;
    /** @private */ this.speed = opts.speed ?? 0.35;
    /** @private */ this.glow  = opts.glow !== false;
    /** @private */ this.points = this._buildPoints();
    /** @private */ this.edges  = this._buildEdges();
  }

  /** Fibonacci-sphere distribution for an even node spread. */
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

  /** Connect each point to its K-nearest neighbors, capped by edge budget. */
  _buildEdges(){
    const K = 4;
    const cand = [];
    for (let i = 0; i < this.points.length; i++){
      const a = this.points[i];
      const dists = [];
      for (let j = 0; j < this.points.length; j++){
        if (i === j) continue;
        const b = this.points[j];
        const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z;
        dists.push({ j, d: dx * dx + dy * dy + dz * dz });
      }
      dists.sort((u, v) => u.d - v.d);
      for (let k = 0; k < K; k++) cand.push({ a: i, b: dists[k].j, d: dists[k].d });
    }
    // dedupe (a,b) ~ (b,a) and keep the shortest
    const seen = new Set();
    const edges = [];
    for (const e of cand){
      const key = e.a < e.b ? `${e.a}:${e.b}` : `${e.b}:${e.a}`;
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push(e);
    }
    edges.sort((u, v) => u.d - v.d);
    return edges.slice(0, this.EDGE_BUDGET);
  }

  draw(ctx, w, h, t){
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const R = Math.min(w, h) * 0.42;

    const ax = t * this.speed * 0.6;        // tilt around X
    const ay = t * this.speed;              // spin around Y
    const cosX = Math.cos(ax), sinX = Math.sin(ax);
    const cosY = Math.cos(ay), sinY = Math.sin(ay);

    // Project every point once per frame, cache in `p`
    const p = new Array(this.points.length);
    for (let i = 0; i < this.points.length; i++){
      const { x, y, z } = this.points[i];
      // Rotate Y
      const x1 = x * cosY + z * sinY;
      const z1 = -x * sinY + z * cosY;
      // Rotate X
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;
      const depth = (z2 + 1) / 2;            // 0..1 (front=1)
      p[i] = {
        sx: cx + x1 * R,
        sy: cy + y2 * R,
        d: depth,
      };
    }

    // edges: back to front so front overdraws
    const sortedEdges = this.edges
      .map(e => ({ ...e, mid: (p[e.a].d + p[e.b].d) / 2 }))
      .sort((u, v) => u.mid - v.mid);

    for (const e of sortedEdges){
      const a = p[e.a], b = p[e.b];
      const depth = (a.d + b.d) / 2;
      const alpha = 0.10 + depth * 0.55;
      ctx.strokeStyle = `rgba(255,30,60,${alpha})`;
      ctx.lineWidth = 0.5 + depth * 0.7;
      ctx.beginPath();
      ctx.moveTo(a.sx, a.sy);
      ctx.lineTo(b.sx, b.sy);
      ctx.stroke();
    }

    // points: same back-to-front
    const sortedPoints = p
      .map((q, i) => ({ ...q, i }))
      .sort((u, v) => u.d - v.d);
    for (const q of sortedPoints){
      const r = 0.6 + q.d * 1.6;
      const a = 0.30 + q.d * 0.70;
      if (this.glow && q.d > 0.78){
        ctx.fillStyle = RED_SOFT;
        ctx.beginPath(); ctx.arc(q.sx, q.sy, r * 2.8, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = `rgba(255,30,60,${a})`;
      ctx.beginPath(); ctx.arc(q.sx, q.sy, r, 0, Math.PI * 2); ctx.fill();
    }
    // Reference: silence unused-color lint hints
    void RED; void RED_FAINT;
  }
}
