/* =================================================================
   SUBNET MAGAZINE — NEURAL NETWORK CHART
   -----------------------------------------------------------------
   A live feed-forward neural network rendered to canvas. Maps the
   Bittensor consensus stack:

       SUBNETS  →  MINERS  →  VALIDATORS  →  CONSENSUS

   Pipeline:
     - Layers laid out in columns; nodes spaced evenly per column.
     - Edges between adjacent layers are fully connected with
       deterministic weights so the silhouette is stable across
       resizes.
     - "Pulses" spawn at input nodes on a steady cadence, traverse
       to a random next-layer node, activate it on arrival, then
       chain forward to the next layer. The visible result is a
       continuously firing network — exactly what Bittensor is
       doing under the hood every block.

   Performance:
     - All node positions cached on layout. Per-frame work is
       O(edges + pulses), both small.
     - Edges are drawn once with depth-derived alpha; only active
       edges (with a pulse on them) get extra brightness.
   ================================================================= */

import { Chart } from './Chart.js';

const RED      = '#FF1E3C';
const RED_2    = '#FF4D60';
const RED_3    = '#FF8094';
const WHITE    = '#F5E5E8';
const E_FAINT  = 'rgba(255,30,60,.06)';
const E_LIGHT  = 'rgba(255,30,60,.16)';

/** Default layer sizes (configurable per instance). */
const DEFAULT_LAYERS = [22, 40, 32, 18, 1];
const DEFAULT_LABELS = ['SUBNETS', 'MINERS', 'VALIDATORS', 'WEIGHTS', 'CONSENSUS'];

export class NeuralNet extends Chart {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {{layers?: number[], labels?: string[], spawnRate?: number}} [opts]
   */
  constructor(canvas, opts = {}){
    super(canvas, { animate: true });
    /** @private */ this.layerSizes = opts.layers ?? DEFAULT_LAYERS;
    /** @private */ this.labels = opts.labels ?? DEFAULT_LABELS;
    /** @private */ this.spawnRate = opts.spawnRate ?? 0.55;     // pulses/sec/input-node
    /** @private */ this.nodes = [];       // [layer][i] → {x, y, act, lastFire}
    /** @private */ this.edges = [];       // [layer] → [{from, to, weight}]
    /** @private */ this.pulses = [];      // {layer, edgeIdx, t, speed, intensity}
    /** @private */ this.lastTick = 0;
    /** @private */ this.lastSpawn = 0;
  }

  layout(ctx, w, h){
    const padX = Math.min(80, w * 0.06);
    const padTop = 34;
    const padBot = 28;
    const cols = this.layerSizes.length;
    const colW = (w - padX * 2) / (cols - 1);

    /* nodes */
    const nodes = [];
    for (let l = 0; l < cols; l++){
      const n = this.layerSizes[l];
      const colNodes = [];
      const innerH = h - padTop - padBot;
      // node spacing; very small layers get pushed to center
      const spacing = innerH / Math.max(n, 1);
      const offset = padTop + spacing / 2;
      const x = padX + colW * l;
      for (let i = 0; i < n; i++){
        const y = offset + i * spacing;
        colNodes.push({ x, y, act: 0, lastFire: -1 });
      }
      nodes.push(colNodes);
    }
    this.nodes = nodes;

    /* edges per pair of adjacent layers, deterministic pseudo-random
       weights so the silhouette doesn't shuffle on resize */
    const edges = [];
    for (let l = 0; l < cols - 1; l++){
      const layerEdges = [];
      const a = this.layerSizes[l], b = this.layerSizes[l + 1];
      for (let i = 0; i < a; i++){
        for (let j = 0; j < b; j++){
          // hash-based deterministic weight in [0..1]
          const seed = ((l + 1) * 1009 + i * 73 + j * 13) >>> 0;
          const r = ((seed * 9301 + 49297) % 233280) / 233280;
          // pruning: keep ~90% of edges — a dense, fully-wired mesh
          if (r < 0.10) continue;
          layerEdges.push({ from: i, to: j, weight: r });
        }
      }
      edges.push(layerEdges);
    }
    this.edges = edges;
    this.pulses = [];
    this.lastTick = 0;
    this.lastSpawn = 0;
  }

  /** Spawn pulses on input-layer outgoing edges at a steady cadence. */
  _spawn(t){
    const dt = t - this.lastSpawn;
    if (dt < 0.04) return;     // ~25 spawn-ticks/sec budget
    this.lastSpawn = t;

    const inputCount = this.layerSizes[0];
    // Per-node Poisson firing
    for (let i = 0; i < inputCount; i++){
      const lambda = this.spawnRate * dt;
      if (Math.random() < lambda){
        this._fireNode(0, i, 0.9 + Math.random() * 0.4);
      }
    }
  }

  /** Fire a node: activates it and dispatches pulses to next layer. */
  _fireNode(layer, idx, intensity){
    this.nodes[layer][idx].act = Math.min(1.5, this.nodes[layer][idx].act + intensity);
    this.nodes[layer][idx].lastFire = this.t;

    // dispatch on a random subset of outgoing edges
    if (layer >= this.edges.length) return;
    const candidates = this.edges[layer].filter(e => e.from === idx);
    if (!candidates.length) return;
    // pick 1-3 edges weighted by edge weight
    const k = 1 + Math.floor(Math.random() * 3);
    for (let n = 0; n < k && n < candidates.length; n++){
      const e = candidates[Math.floor(Math.random() * candidates.length)];
      this.pulses.push({
        layer,
        from: e.from, to: e.to,
        t: 0,
        speed: 1.6 + Math.random() * 1.4,
        intensity: intensity * (0.6 + 0.4 * e.weight),
      });
    }
  }

  draw(ctx, w, h, t){
    const dt = this.lastTick === 0 ? 0 : Math.min(0.1, t - this.lastTick);
    this.lastTick = t;

    ctx.clearRect(0, 0, w, h);

    /* === all edges (faint base layer) === */
    ctx.lineWidth = 0.5;
    for (let l = 0; l < this.edges.length; l++){
      const layer = this.edges[l];
      for (const e of layer){
        const a = this.nodes[l][e.from];
        const b = this.nodes[l + 1][e.to];
        const alpha = 0.04 + e.weight * 0.14;
        ctx.strokeStyle = `rgba(255,30,60,${alpha})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    /* === advance pulses, then draw bright trails === */
    this._spawn(t);
    const survivors = [];
    for (const p of this.pulses){
      p.t += p.speed * dt;
      if (p.t >= 1){
        // arrived → activate target & chain forward
        const target = this.nodes[p.layer + 1][p.to];
        target.act = Math.min(1.5, target.act + p.intensity * 0.85);
        target.lastFire = t;
        if (p.layer + 1 < this.edges.length){
          this._fireNode(p.layer + 1, p.to, p.intensity * 0.75);
        }
        continue;
      }
      survivors.push(p);

      const a = this.nodes[p.layer][p.from];
      const b = this.nodes[p.layer + 1][p.to];
      // bright edge segment
      ctx.strokeStyle = `rgba(255,30,60,${0.55 * p.intensity})`;
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
      ctx.stroke();

      // traveling head
      const x = a.x + (b.x - a.x) * p.t;
      const y = a.y + (b.y - a.y) * p.t;
      // outer glow
      ctx.fillStyle = `rgba(255,128,148,${0.42 * p.intensity})`;
      ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
      // core
      ctx.fillStyle = WHITE;
      ctx.beginPath(); ctx.arc(x, y, 1.4, 0, Math.PI * 2); ctx.fill();
    }
    this.pulses = survivors;

    /* === nodes — activation decays, halo on active nodes === */
    for (let l = 0; l < this.nodes.length; l++){
      for (const n of this.nodes[l]){
        // exponential decay
        n.act *= Math.pow(0.001, dt);   // ~63% decay in ~150ms
        if (n.act < 0.01) n.act = 0;

        const active = n.act > 0.05;
        if (active){
          const halo = 8 + n.act * 6;
          const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, halo);
          g.addColorStop(0, `rgba(255,30,60,${Math.min(0.6, 0.4 * n.act)})`);
          g.addColorStop(1, 'rgba(255,30,60,0)');
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(n.x, n.y, halo, 0, Math.PI * 2); ctx.fill();
        }
        const r = 1.6 + (active ? n.act * 1.6 : 0);
        ctx.fillStyle = active ? RED_2 : RED;
        ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2); ctx.fill();
        if (active){
          ctx.fillStyle = WHITE;
          ctx.beginPath(); ctx.arc(n.x, n.y, 0.8, 0, Math.PI * 2); ctx.fill();
        }
      }
    }

    /* === layer labels === */
    ctx.font = '600 9.5px JetBrains Mono, monospace';
    ctx.fillStyle = 'rgba(255,30,60,.55)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (let l = 0; l < this.layerSizes.length; l++){
      const col = this.nodes[l];
      if (!col?.length) continue;
      const x = col[0].x;
      ctx.fillText(this.labels[l] || `L${l}`, x, 8);
      ctx.fillStyle = 'rgba(255,30,60,.30)';
      ctx.fillText(`n · ${this.layerSizes[l]}`, x, 22);
      ctx.fillStyle = 'rgba(255,30,60,.55)';
    }

    /* === watermark === */
    ctx.font = '600 9.5px JetBrains Mono, monospace';
    ctx.fillStyle = 'rgba(255,30,60,.45)';
    ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
    ctx.fillText(`FEED-FORWARD · ${this.layerSizes.length} LAYERS · ${this.pulses.length} PULSES`, 10, h - 8);
    ctx.textAlign = 'right';
    ctx.fillText(`T+${t.toFixed(1)}s`, w - 10, h - 8);

    /* lint guard */
    void E_FAINT; void E_LIGHT; void RED_3;
  }
}
