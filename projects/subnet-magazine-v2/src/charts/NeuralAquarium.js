/* =================================================================
   SUBNET MAGAZINE, NEURAL AQUARIUM
   -----------------------------------------------------------------
   A 3D neural-network playground rendered with hand-rolled
   perspective projection on a single 2D canvas. The reader builds
   layers, adjusts neurons, kills nodes, and watches packets of
   light propagate source-to-target along weighted connections.

   Architecture:

     NeuralAquarium extends Chart
       OrbitCamera          spherical-coord camera with smooth idle orbit
       NetworkModel         layer/neuron/connection topology + lifecycle
       PacketBus            per-connection packet phase + speed
       BurstQueue           kill burst lifecycle, drawn over connections
       GestureRouter        pointer + wheel + touch + keyboard
       AnimationKit         positional spring tweens (smooth rebuilds)
       SceneRenderer        composes render passes back-to-front

   The base class handles DPR scaling, ResizeObserver, the rAF loop,
   prefers-reduced-motion fallback (single static render), error
   containment, and clean teardown. Every magic number is named and
   hoisted to TUNE.

   This file is the single source of truth for the simulation; the
   page (aquarium.html) is a thin wrapper that wires DOM controls to
   the instance and calls destroy() on unload.
   ================================================================= */

import { Chart } from './Chart.js';
import { clamp, prefersReducedMotion } from '../lib/dom.js';

/* ---------- tokens ----------------------------------------------- */

/** Brand color palette, hoisted so the renderer is one place to
 *  re-theme. Hex strings match style/tokens.css; rgb tuples are
 *  for runtime alpha blending. */
const C = Object.freeze({
  red:      '#FF1E3C',
  redSoft:  '#FF4D60',
  redHot:   '#FF8094',
  inkOne:   '#F5E5E8',
  inkTwo:   '#C8A8AD',
  inkDim:   '#8B6B70',
  bg:       '#000000',

  /* rgb tuples for runtime composition */
  redRGB:   [255, 30, 60],
  redHotRGB:[255, 140, 160],
  whiteRGB: [255, 255, 255],
});

/** Every tunable number lives here. Reader who wants the camera to
 *  rotate twice as fast bumps TUNE.AUTO_ORBIT_RAD_PER_MS and that's
 *  the whole edit. Reader who wants packets to stream three times
 *  faster bumps TUNE.PACKET_BASE_SPEED. */
const TUNE = Object.freeze({
  /* layout ------------------------------------------------------ */
  LAYER_SPACING_X:        1.6,    // world units between adjacent layers
  NEURON_SPACING_Y:       0.30,   // world units between adjacent neurons in a column
  NEURON_Z_JITTER:        0.04,   // ±jitter on Z so depth-sort breaks ties

  /* camera ------------------------------------------------------ */
  CAMERA_THETA_INIT:     -0.45,   // initial yaw (radians)
  CAMERA_PHI_INIT:        0.20,   // initial pitch (radians)
  CAMERA_DIST_INIT:       9.2,    // initial orbit radius (world units)
  CAMERA_DIST_MIN:        3.0,
  CAMERA_DIST_MAX:       30.0,
  CAMERA_PHI_LIMIT:       1.2,    // clamp pitch so user can't flip upside down
  CAMERA_FOV:           860,      // focal length in screen-equivalent px
  CAMERA_NEAR_Z:          0.05,   // anything closer is behind the lens
  CAMERA_DRAG_THETA:      0.006,  // radians per pixel of horizontal drag
  CAMERA_DRAG_PHI:        0.005,  // radians per pixel of vertical drag

  /* auto-orbit -------------------------------------------------- */
  IDLE_MS_BEFORE_ORBIT: 3000,     // ms of no interaction before camera drifts
  AUTO_ORBIT_RAD_PER_MS: 0.00012, // ~one full orbit every 87 seconds

  /* connections ------------------------------------------------- */
  CONN_BASE_ALPHA_MULT:   0.35,   // base line alpha = weight × this × depth
  CONN_DEAD_ALPHA_FACTOR: 0.10,   // multiplier when either endpoint is dead
  CONN_DEPTH_FALLOFF:     0.08,   // alpha falloff per world unit of depth
  CONN_NEAR_FALLOFF:      0.06,   // color/width interpolation per world unit
  CONN_BASE_LINEW:        0.6,    // width of dim base line at far depth
  CONN_NEAR_LINEW_ADD:    0.3,    // additional width at near depth

  /* packets ----------------------------------------------------- */
  PACKET_BASE_SPEED:      0.18,   // cycles/sec for weight=0 connections
  PACKET_WEIGHT_SPEED:    0.55,   // additional cycles/sec scaled by weight
  PACKET_CYCLE:           1.25,   // duration of one packet trip (travel 0→1 + gap)
  PACKET_TAIL:            0.14,   // length of the bright tail behind the head
  PACKET_ALPHA_BASE:      0.55,   // base packet alpha (depth-attenuated)
  PACKET_ALPHA_WEIGHT:    0.45,   // additional alpha scaled by weight
  PACKET_LINEW_NEAR:      1.6,    // packet width additional at near depth
  PACKET_LINEW_BASE:      1.4,    // packet base width at far depth

  /* neurons ----------------------------------------------------- */
  NEURON_RADIUS_ALIVE:    3.0,
  NEURON_RADIUS_DEAD:     2.2,
  NEURON_DEPTH_SCALE_FAR: 0.55,
  NEURON_DEPTH_SCALE_NEAR:1.6,
  NEURON_HALO_MULT:       5.5,    // halo radius = core × this
  NEURON_HALO_ALPHA:      0.40,
  NEURON_BREATH_RATE:     1.4,    // radians/sec of breathing
  NEURON_BREATH_RADIUS:   0.15,   // ±15% radius modulation
  NEURON_BREATH_BRIGHT:   0.30,   // ±30% brightness modulation

  /* kill bursts ------------------------------------------------- */
  BURST_LIFE_MS:          700,
  BURST_RING_MIN:         4,
  BURST_RING_MAX:        40,
  BURST_FLASH_RADIUS:     8,
  BURST_FLASH_FADE_T:     0.35,   // flash visible for first 35% of life
  BURST_SPARK_COUNT:      6,
  BURST_SPARK_DIST:      36,
  BURST_SPARK_RADIUS:     2.2,

  /* tweens ------------------------------------------------------ */
  REBUILD_SPRING_MS:    400,      // ms for neurons to spring to new positions

  /* picking ----------------------------------------------------- */
  PICK_RADIUS_PX:        18,      // tap target around alive neurons
});

/* ---------- math primitives -------------------------------------- */

/** Spherical-coordinate orbit camera. Owns its own state, exposes a
 *  `project(p)` that converts world-space (x,y,z) to screen-space
 *  (sx,sy,depth). Pure math, no rendering. */
class OrbitCamera {
  constructor(){
    this.theta  = TUNE.CAMERA_THETA_INIT;
    this.phi    = TUNE.CAMERA_PHI_INIT;
    this.dist   = TUNE.CAMERA_DIST_INIT;
    this.target = { x: 0, y: 0, z: 0 };
  }

  rotateBy(dTheta, dPhi){
    this.theta += dTheta;
    this.phi   = clamp(this.phi + dPhi, -TUNE.CAMERA_PHI_LIMIT, TUNE.CAMERA_PHI_LIMIT);
  }

  zoomBy(factor){
    this.dist = clamp(this.dist * factor, TUNE.CAMERA_DIST_MIN, TUNE.CAMERA_DIST_MAX);
  }

  /** Project a world-space point to screen-space. Returns NaN on
   *  points that fall behind the lens; caller is expected to skip
   *  those (or check `visible`). */
  project(p, screenW, screenH){
    const tx = p.x - this.target.x;
    const ty = p.y - this.target.y;
    const tz = p.z - this.target.z;
    const cy = Math.cos(-this.theta), sy = Math.sin(-this.theta);
    const cx = Math.cos(-this.phi),   sx = Math.sin(-this.phi);

    // Yaw around Y
    const x1 =  cy * tx + sy * tz;
    const y1 =  ty;
    const z1 = -sy * tx + cy * tz;

    // Pitch around X
    const y2 = cx * y1 - sx * z1;
    const z2 = sx * y1 + cx * z1;

    // Translate camera back along +Z
    const zc = z2 + this.dist;
    if (zc <= TUNE.CAMERA_NEAR_Z){
      return { sx: 0, sy: 0, depth: zc, visible: false };
    }
    const k = TUNE.CAMERA_FOV / zc;
    return {
      sx: x1 * k + screenW / 2,
      sy: -y2 * k + screenH / 2,
      depth: zc,
      visible: true,
    };
  }
}

/* ---------- network model ---------------------------------------- */

/** Network topology + neuron state. Pure data + simple ops; no
 *  rendering. The renderer reads (alive, x, y, z, w) per neuron and
 *  the connection list per frame. */
class NetworkModel {
  /** @param {LayerSpec[]} layers */
  constructor(layers){
    /** @type {LayerSpec[]} */ this.layers = layers.map(l => ({ ...l }));
    /** @type {Neuron[]} */    this.neurons = [];
    /** @type {NeuronGroup[]} */ this.groups = [];
    /** @type {Connection[]} */ this.connections = [];
    this.rebuild();
  }

  /** Recompute neuron positions + connection list from the current
   *  layers array. Called after any topology mutation. */
  rebuild(){
    this.neurons = [];
    this.groups = [];
    this.connections = [];

    const xOffset = -((this.layers.length - 1) * TUNE.LAYER_SPACING_X) / 2;
    this.layers.forEach((layer, li) => {
      const x = xOffset + li * TUNE.LAYER_SPACING_X;
      const half = (layer.n - 1) / 2;
      /** @type {NeuronGroup} */
      const group = { info: layer, neurons: [] };
      for (let i = 0; i < layer.n; i++){
        /** @type {Neuron} */
        const n = {
          // World position (target — actual position during a rebuild
          // tween will lerp from prevX/Y to x/y over REBUILD_SPRING_MS)
          x, y: (i - half) * TUNE.NEURON_SPACING_Y,
          z: Math.sin(i * 1.7 + li * 0.9) * TUNE.NEURON_Z_JITTER,
          alive: true,
          layer: li, idx: i,
          // Screen-space projection cache (filled by renderer each frame)
          sx: 0, sy: 0, depth: 0,
          // Per-neuron breathing phase, stable across renders so the
          // shimmer pattern is deterministic per architecture
          breathPhase: li * 0.83 + i * 0.41,
        };
        this.neurons.push(n);
        group.neurons.push(n);
      }
      this.groups.push(group);
    });

    // Connections: fully connected between adjacent layers. Weight is
    // deterministic per (na, nb) pair so URL-shared networks look
    // identical (no random seed needed).
    for (let li = 0; li < this.layers.length - 1; li++){
      const a = this.groups[li].neurons;
      const b = this.groups[li + 1].neurons;
      for (const na of a){
        for (const nb of b){
          const seed = na.layer * 31 + na.idx * 7.13 + nb.idx * 3.47;
          const w = 0.35 + 0.65 * Math.abs(Math.sin(seed));
          /** @type {Connection} */
          const c = {
            a: na, b: nb, w,
            pktSpeed: TUNE.PACKET_BASE_SPEED + TUNE.PACKET_WEIGHT_SPEED * w,
            pktPhase: Math.abs(Math.sin(seed * 1.7)) % 1,
          };
          this.connections.push(c);
        }
      }
    }
  }

  /** Mutate one layer's neuron count. Triggers a rebuild. */
  setLayerSize(layerIdx, n){
    if (!this.layers[layerIdx]) return;
    this.layers[layerIdx].n = n;
    this.rebuild();
  }

  /** Mutate one layer's activation function. No topology change so
   *  no rebuild needed. */
  setLayerActivation(layerIdx, act){
    if (!this.layers[layerIdx]) return;
    this.layers[layerIdx].act = act;
  }

  /** Insert a new hidden layer just before the OUT layer. */
  addHiddenLayer(){
    if (this.layers.length >= 9) return false;
    this.layers.splice(this.layers.length - 1, 0, {
      name: '',
      n: 16,
      act: 'ReLU',
    });
    this._renameHidden();
    this.rebuild();
    return true;
  }

  /** Remove the hidden layer at index li. IN and OUT cannot be
   *  removed; returns false on invalid index. */
  removeHiddenLayer(li){
    if (li <= 0 || li >= this.layers.length - 1) return false;
    this.layers.splice(li, 1);
    this._renameHidden();
    this.rebuild();
    return true;
  }

  /** Replace the entire architecture (e.g. when loading a preset or
   *  decoding a URL). */
  loadLayers(layers){
    this.layers = layers.map(l => ({ ...l }));
    this._renameHidden();
    this.rebuild();
  }

  /** Bring every dead neuron back to life. */
  reviveAll(){
    for (const n of this.neurons) n.alive = true;
  }

  /** How many neurons are currently alive. */
  aliveCount(){
    let c = 0;
    for (const n of this.neurons) if (n.alive) c++;
    return c;
  }

  /** @private */
  _renameHidden(){
    let h = 0;
    this.layers.forEach((layer, li) => {
      if (li === 0){ layer.name = 'IN'; return; }
      if (li === this.layers.length - 1){ layer.name = 'OUT'; return; }
      h += 1;
      layer.name = `H${h}`;
    });
  }
}

/* ---------- kill bursts ------------------------------------------ */

/** A queue of short-lived particle effects spawned when neurons die.
 *  Each burst is a ring + flash + sparks lasting BURST_LIFE_MS, then
 *  drops out of the queue. Drawn over connections, under neurons. */
class BurstQueue {
  constructor(){
    /** @type {Burst[]} */ this.bursts = [];
  }

  spawnAt(neuron){
    this.bursts.push({
      sx: neuron.sx,
      sy: neuron.sy,
      depth: neuron.depth,
      startedAt: performance.now(),
    });
  }

  /** Render every active burst, evicting expired ones. */
  draw(ctx, now){
    for (let i = this.bursts.length - 1; i >= 0; i--){
      const b = this.bursts[i];
      const age = (now - b.startedAt) / TUNE.BURST_LIFE_MS;
      if (age >= 1){ this.bursts.splice(i, 1); continue; }

      const easeOut = 1 - Math.pow(1 - age, 3);
      const depthScale = clamp(2.0 - b.depth * 0.15, 0.5, 1.4);
      const ringRadius = (TUNE.BURST_RING_MIN + TUNE.BURST_RING_MAX * easeOut) * depthScale;
      const ringAlpha = (1 - age) * 0.85;

      // Expanding ring
      ctx.strokeStyle = `rgba(255,80,100,${ringAlpha.toFixed(3)})`;
      ctx.lineWidth = (2.4 - age * 1.6) * depthScale;
      ctx.beginPath();
      ctx.arc(b.sx, b.sy, ringRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Inner flash (only during first 35% of life)
      if (age < TUNE.BURST_FLASH_FADE_T){
        const flashAlpha = (TUNE.BURST_FLASH_FADE_T - age) / TUNE.BURST_FLASH_FADE_T;
        ctx.fillStyle = `rgba(255,200,210,${(flashAlpha * 0.7).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(b.sx, b.sy, TUNE.BURST_FLASH_RADIUS * depthScale * (1 - age * 0.5), 0, Math.PI * 2);
        ctx.fill();
      }

      // Spark particles flying outward at fixed angles, slowly
      // rotating so a single burst doesn't look static under rAF
      ctx.fillStyle = `rgba(255,140,160,${((1 - age) * 0.9).toFixed(3)})`;
      const sparkR = (TUNE.BURST_SPARK_RADIUS - age * 1.8) * depthScale;
      for (let k = 0; k < TUNE.BURST_SPARK_COUNT; k++){
        const ang = (k / TUNE.BURST_SPARK_COUNT) * Math.PI * 2 + age * 0.4;
        const dist = easeOut * TUNE.BURST_SPARK_DIST;
        const px = b.sx + Math.cos(ang) * dist * depthScale;
        const py = b.sy + Math.sin(ang) * dist * depthScale;
        ctx.beginPath();
        ctx.arc(px, py, sparkR, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

/* ---------- rebuild spring tween --------------------------------- */

/** When the architecture changes (slider, +/− layer, preset load),
 *  neurons spring smoothly to their new positions over
 *  REBUILD_SPRING_MS instead of jumping. Each neuron remembers
 *  (prevX, prevY) and the render code lerps from prev to current
 *  weighted by spring progress (cubic ease-out). */
class RebuildSpring {
  constructor(){
    this.start = 0;
    this.duration = TUNE.REBUILD_SPRING_MS;
    /** @type {Map<Neuron, {fromX:number, fromY:number, toX:number, toY:number}>} */
    this.from = new Map();
  }

  /** Capture pre-rebuild positions for every neuron that will exist
   *  after the rebuild. Call BEFORE NetworkModel.rebuild(). */
  capture(neurons){
    this.from.clear();
    for (const n of neurons){
      this.from.set(n, { fromX: n.x, fromY: n.y, toX: n.x, toY: n.y });
    }
  }

  /** After the rebuild, walk the new neuron list. Any neuron that
   *  existed before gets its (fromX, fromY) from the capture; new
   *  neurons spring outward from the layer center (y = 0). */
  commit(neurons){
    for (const n of neurons){
      const prev = this.from.get(n);
      if (prev){
        prev.toX = n.x;
        prev.toY = n.y;
      } else {
        // Brand-new neuron — spring inward from center so additions
        // feel like the layer "growing" outward.
        this.from.set(n, { fromX: n.x, fromY: 0, toX: n.x, toY: n.y });
      }
    }
    this.start = performance.now();
  }

  /** Apply spring transform to every neuron's (x, y) for one frame.
   *  Returns true if the spring is still in progress. */
  apply(neurons, now){
    const t = (now - this.start) / this.duration;
    if (t >= 1 || this.from.size === 0) return false;
    const eased = 1 - Math.pow(1 - t, 3);   // cubic ease-out
    for (const n of neurons){
      const tween = this.from.get(n);
      if (!tween) continue;
      n.x = tween.fromX + (tween.toX - tween.fromX) * eased;
      n.y = tween.fromY + (tween.toY - tween.fromY) * eased;
    }
    return true;
  }
}

/* ---------- the chart class -------------------------------------- */

/**
 * @typedef {Object} NeuralAquariumOptions
 * @prop {LayerSpec[]} [initialLayers]   Network to start with
 * @prop {(model: NetworkModel) => void} [onChange]   Fired whenever
 *   the architecture mutates (slider, +/− layer, preset). UI uses
 *   this to repaint the editor panel and push to the URL.
 * @prop {(model: NetworkModel) => void} [onKill]    Fired when a
 *   neuron is killed (after BurstQueue spawns).
 */

/**
 * Main class. Owns the model, the camera, the burst queue, the
 * rebuild spring, and the gesture state. The Chart base class owns
 * DPR/rAF/resize/destroy/reduced-motion plumbing.
 */
export class NeuralAquarium extends Chart {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {NeuralAquariumOptions} [opts]
   */
  constructor(canvas, opts = {}){
    super(canvas, { animate: true, maxDPR: 2 });

    /* IMPORTANT: do NOT name this `_opts` — Chart base reserves that
       for { animate, maxDPR }, and any subclass clobber breaks the
       DPR math (Chart._resize reads this._opts.maxDPR; if it's
       undefined, the canvas buffer goes to NaN → 0). */
    /** @private */ this._callbacks = opts;
    /** @private */ this._reduced = prefersReducedMotion();

    /** @public */ this.model    = new NetworkModel(opts.initialLayers || DEFAULT_LAYERS);
    /** @public */ this.camera   = new OrbitCamera();
    /** @private */ this._bursts = new BurstQueue();
    /** @private */ this._spring = new RebuildSpring();

    // Interaction state
    /** @private */ this._dragging      = false;
    /** @private */ this._pressStart    = null;
    /** @private */ this._dragStart     = null;
    /** @private */ this._camStart      = null;
    /** @private */ this._lastInteract  = performance.now();
    /** @private */ this._killMode      = true;
    /** @private */ this._hover         = null;
    /** @private */ this._pinchStart    = null;

    this._attachGestures();
    this._attachKeyboard();
  }

  /* ===== Public API used by the page ============================ */

  /** Toggle whether clicks kill neurons. Returns the new state. */
  setKillMode(on){
    this._killMode = !!on;
    return this._killMode;
  }

  isKilling(){ return this._killMode; }

  /** Bring every dead neuron back, reset interaction state. */
  resetNetwork(){
    this.model.reviveAll();
    this._bursts.bursts.length = 0;
    if (this._callbacks.onChange) this._callbacks.onChange(this.model);
  }

  /** Replace the architecture (preset, URL load, programmatic). */
  loadLayers(layers){
    this._spring.capture(this.model.neurons);
    this.model.loadLayers(layers);
    this._spring.commit(this.model.neurons);
    if (this._callbacks.onChange) this._callbacks.onChange(this.model);
  }

  /** Mutate one layer's neuron count, with smooth spring rebuild. */
  setLayerSize(layerIdx, n){
    this._spring.capture(this.model.neurons);
    this.model.setLayerSize(layerIdx, n);
    this._spring.commit(this.model.neurons);
    if (this._callbacks.onChange) this._callbacks.onChange(this.model);
  }

  /** Mutate one layer's activation function. No spring (no topology). */
  setLayerActivation(layerIdx, act){
    this.model.setLayerActivation(layerIdx, act);
    if (this._callbacks.onChange) this._callbacks.onChange(this.model);
  }

  addHiddenLayer(){
    this._spring.capture(this.model.neurons);
    const ok = this.model.addHiddenLayer();
    this._spring.commit(this.model.neurons);
    if (ok && this._callbacks.onChange) this._callbacks.onChange(this.model);
    return ok;
  }

  removeHiddenLayer(li){
    this._spring.capture(this.model.neurons);
    const ok = this.model.removeHiddenLayer(li);
    this._spring.commit(this.model.neurons);
    if (ok && this._callbacks.onChange) this._callbacks.onChange(this.model);
    return ok;
  }

  /** Programmatically focus a neuron (used by keyboard nav).
   *  Returns the neuron or null. */
  focusNeuron(layerIdx, neuronIdx){
    const g = this.model.groups[layerIdx];
    if (!g) return null;
    const n = g.neurons[neuronIdx];
    if (!n) return null;
    this._hover = n;
    return n;
  }

  /* ===== Chart hooks ============================================ */

  layout(){
    /* Nothing to pre-compute on resize — the projection is per-frame
       and adapts to (w, h). Kept as an explicit no-op so the lifecycle
       contract is visible in this class. */
  }

  draw(ctx, w, h, t){
    const now = performance.now();
    const dt = (this._lastFrameTime ? (now - this._lastFrameTime) : 16.7);
    this._lastFrameTime = now;
    const timeS = t;

    // Auto-orbit when idle. The reduced-motion fallback skips this
    // entirely; the camera stays where it last was.
    if (!this._reduced){
      const idleMs = now - this._lastInteract;
      if (!this._dragging && idleMs > TUNE.IDLE_MS_BEFORE_ORBIT){
        this.camera.theta += TUNE.AUTO_ORBIT_RAD_PER_MS * dt;
      }
    }

    // Apply rebuild spring (lerps neuron positions toward their new
    // home after an architecture mutation).
    this._spring.apply(this.model.neurons, now);

    // Project every neuron to screen space once per frame.
    for (const n of this.model.neurons){
      const p = this.camera.project(n, w, h);
      n.sx = p.sx; n.sy = p.sy; n.depth = p.depth;
    }

    // ----- background -------------------------------------------
    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, w, h);
    this._drawGridFloor(ctx, w, h);

    // ----- connections (back-to-front) --------------------------
    this._drawConnections(ctx, timeS);

    // ----- kill bursts (over connections, under neurons) --------
    this._bursts.draw(ctx, now);

    // ----- neurons (back-to-front) ------------------------------
    this._drawNeurons(ctx, timeS);

    // ----- hover highlight + tooltip ----------------------------
    if (this._hover && this._hover.alive){
      this._drawHoverHighlight(ctx, this._hover);
    }
  }

  destroy(){
    super.destroy();
    this._detachGestures();
    this._detachKeyboard();
  }

  /* ===== Render passes ========================================== */

  /** Subtle grid in the y = -3.6 plane, just for spatial anchoring. */
  _drawGridFloor(ctx, w, h){
    if (this._reduced) return;     // reduced-motion: skip the grid entirely
    const Y = -3.6;
    const SIZE = 6, STEP = 0.6;
    ctx.save();
    ctx.strokeStyle = 'rgba(255,30,60,0.06)';
    ctx.lineWidth = 0.6;
    for (let i = -SIZE; i <= SIZE; i += STEP){
      const a = this.camera.project({ x: -SIZE, y: Y, z: i }, w, h);
      const b = this.camera.project({ x:  SIZE, y: Y, z: i }, w, h);
      if (a.visible && b.visible){
        ctx.beginPath(); ctx.moveTo(a.sx, a.sy); ctx.lineTo(b.sx, b.sy); ctx.stroke();
      }
      const c = this.camera.project({ x: i, y: Y, z: -SIZE }, w, h);
      const d = this.camera.project({ x: i, y: Y, z:  SIZE }, w, h);
      if (c.visible && d.visible){
        ctx.beginPath(); ctx.moveTo(c.sx, c.sy); ctx.lineTo(d.sx, d.sy); ctx.stroke();
      }
    }
    ctx.restore();
  }

  /** Two passes per connection:
   *    1. base line (dim, persistent, structure-revealing)
   *    2. packet segment (bright, riding source→target along the line)
   *  Reduced-motion users get only the base line. */
  _drawConnections(ctx, timeS){
    const conns = this.model.connections;

    // Depth-sort once per frame, in place, so far connections render
    // first and near ones overpaint. Caller-allocated array, no
    // per-frame garbage.
    conns.sort(byMidDepthDesc);

    for (let i = 0; i < conns.length; i++){
      const c = conns[i];
      const aAlive = c.a.alive, bAlive = c.b.alive;
      if (!aAlive && !bAlive) continue;

      const depthMid = (c.a.depth + c.b.depth) / 2;
      const depthAlpha = clamp(1.5 - depthMid * TUNE.CONN_DEPTH_FALLOFF, 0.05, 1.0);
      const nearness   = clamp(1.0 - depthMid * TUNE.CONN_NEAR_FALLOFF, 0, 1);

      // Base line
      let baseAlpha = c.w * TUNE.CONN_BASE_ALPHA_MULT * depthAlpha;
      if (!aAlive || !bAlive) baseAlpha *= TUNE.CONN_DEAD_ALPHA_FACTOR;
      const baseG = Math.round(30 + 50 * nearness);
      const baseB = Math.round(60 + 25 * nearness);
      ctx.strokeStyle = `rgba(255,${baseG},${baseB},${baseAlpha.toFixed(3)})`;
      ctx.lineWidth = TUNE.CONN_BASE_LINEW + TUNE.CONN_NEAR_LINEW_ADD * nearness;
      ctx.beginPath();
      ctx.moveTo(c.a.sx, c.a.sy);
      ctx.lineTo(c.b.sx, c.b.sy);
      ctx.stroke();

      // Packet — only on alive→alive connections and only in motion mode
      if (this._reduced) continue;
      if (!aAlive || !bAlive) continue;
      const cycle = (timeS * c.pktSpeed + c.pktPhase) % TUNE.PACKET_CYCLE;
      if (cycle > 1.0) continue;   // gap period — packet "off-screen"

      const tHead = cycle;
      const tTail = Math.max(0, cycle - TUNE.PACKET_TAIL);
      const hx = c.a.sx + (c.b.sx - c.a.sx) * tHead;
      const hy = c.a.sy + (c.b.sy - c.a.sy) * tHead;
      const tx = c.a.sx + (c.b.sx - c.a.sx) * tTail;
      const ty = c.a.sy + (c.b.sy - c.a.sy) * tTail;
      const pktAlpha = clamp(
        (TUNE.PACKET_ALPHA_BASE + TUNE.PACKET_ALPHA_WEIGHT * c.w) * depthAlpha,
        0.1, 1.0
      );
      ctx.strokeStyle = `rgba(255,${Math.round(120 + 80 * nearness)},${Math.round(130 + 60 * nearness)},${pktAlpha.toFixed(3)})`;
      ctx.lineWidth = TUNE.PACKET_LINEW_BASE + TUNE.PACKET_LINEW_NEAR * nearness;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(hx, hy);
      ctx.stroke();
      ctx.lineCap = 'butt';
    }
  }

  /** Alive neurons render with breathing (radius + brightness
   *  modulation, per-neuron phase). Dead neurons render as dim
   *  outlines. Reduced-motion users get no breathing. */
  _drawNeurons(ctx, timeS){
    const sorted = this.model.neurons.slice().sort((a, b) => b.depth - a.depth);
    for (let i = 0; i < sorted.length; i++){
      const n = sorted[i];
      const depthScale = clamp(
        TUNE.NEURON_DEPTH_SCALE_NEAR - n.depth * 0.18,
        TUNE.NEURON_DEPTH_SCALE_FAR,
        TUNE.NEURON_DEPTH_SCALE_NEAR
      );

      let breath = 1, breathBright = 1;
      if (n.alive && !this._reduced){
        const s = Math.sin(timeS * TUNE.NEURON_BREATH_RATE + n.breathPhase);
        breath       = 1 + TUNE.NEURON_BREATH_RADIUS * s;
        breathBright = 1 + TUNE.NEURON_BREATH_BRIGHT * s;
      }

      const radius = (n.alive ? TUNE.NEURON_RADIUS_ALIVE : TUNE.NEURON_RADIUS_DEAD) * depthScale * breath;
      const brightness = clamp((1.4 - n.depth * 0.08) * breathBright, 0.25, 1.2);

      if (n.alive){
        // Halo (radial gradient, depth-keyed alpha)
        const g = ctx.createRadialGradient(n.sx, n.sy, 0, n.sx, n.sy, radius * TUNE.NEURON_HALO_MULT);
        g.addColorStop(0,   `rgba(255,30,60,${(TUNE.NEURON_HALO_ALPHA * brightness).toFixed(3)})`);
        g.addColorStop(0.4, `rgba(255,30,60,${(0.18 * brightness).toFixed(3)})`);
        g.addColorStop(1,   'rgba(255,30,60,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(n.sx, n.sy, radius * TUNE.NEURON_HALO_MULT, 0, Math.PI * 2);
        ctx.fill();

        // White-hot core
        ctx.fillStyle = `rgba(255,255,255,${Math.min(1, brightness).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(n.sx, n.sy, radius, 0, Math.PI * 2);
        ctx.fill();

        // Inner red ring
        ctx.strokeStyle = `rgba(255,30,60,${(0.7 * brightness).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(n.sx, n.sy, radius + 0.6, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        // Dead — dim outline + tiny dim core
        ctx.strokeStyle = 'rgba(120,80,90,0.45)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(n.sx, n.sy, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = 'rgba(80,60,68,0.55)';
        ctx.beginPath();
        ctx.arc(n.sx, n.sy, radius * 0.55, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  _drawHoverHighlight(ctx, n){
    ctx.save();
    ctx.strokeStyle = C.redHot;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(n.sx, n.sy, 10, 0, Math.PI * 2);
    ctx.stroke();
    // Tooltip label, e.g. "H3.27"
    const label = `${this.model.layers[n.layer].name}.${n.idx + 1}`;
    ctx.font = '11px JetBrains Mono, monospace';
    const w = ctx.measureText(label).width + 14;
    const x = n.sx + 14, y = n.sy - 22;
    ctx.fillStyle = 'rgba(0,0,0,.85)';
    ctx.strokeStyle = 'rgba(255,30,60,.55)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.rect(x, y, w, 20);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x + 7, y + 10);
    ctx.restore();
  }

  /* ===== Picking ================================================ */

  _pickNeuron(mx, my){
    const r2 = TUNE.PICK_RADIUS_PX * TUNE.PICK_RADIUS_PX;
    let best = null, bestD2 = r2;
    for (const n of this.model.neurons){
      if (!n.alive) continue;
      const dx = n.sx - mx, dy = n.sy - my;
      const d2 = dx * dx + dy * dy;
      if (d2 < bestD2){ bestD2 = d2; best = n; }
    }
    return best;
  }

  /* ===== Gestures =============================================== */

  _attachGestures(){
    const c = this.canvas;
    this._gestureBindings = [
      ['pointerdown', this._onPointerDown.bind(this)],
      ['pointermove', this._onPointerMove.bind(this)],
      ['pointerup',   this._onPointerUp.bind(this)],
      ['pointercancel', this._onPointerUp.bind(this)],
      ['wheel',       this._onWheel.bind(this), { passive: false }],
      ['touchstart',  this._onTouchStart.bind(this), { passive: true }],
      ['touchmove',   this._onTouchMove.bind(this),  { passive: true }],
      ['touchend',    this._onTouchEnd.bind(this),   { passive: true }],
    ];
    for (const [type, fn, opts] of this._gestureBindings) c.addEventListener(type, fn, opts);
  }

  _detachGestures(){
    if (!this._gestureBindings) return;
    const c = this.canvas;
    for (const [type, fn, opts] of this._gestureBindings) c.removeEventListener(type, fn, opts);
    this._gestureBindings = null;
  }

  _markInteract(){ this._lastInteract = performance.now(); }

  _onPointerDown(ev){
    const r = this.canvas.getBoundingClientRect();
    const x = ev.clientX - r.left, y = ev.clientY - r.top;
    this._pressStart = { x, y };
    this._dragStart  = { x, y };
    this._camStart   = { theta: this.camera.theta, phi: this.camera.phi };
    this._dragging   = false;
    this.canvas.setPointerCapture?.(ev.pointerId);
    this._markInteract();
  }

  _onPointerMove(ev){
    const r = this.canvas.getBoundingClientRect();
    const x = ev.clientX - r.left, y = ev.clientY - r.top;
    if (this._pressStart){
      const dx = x - this._pressStart.x, dy = y - this._pressStart.y;
      if (!this._dragging && (dx * dx + dy * dy) > 16){
        this._dragging = true;
        this.canvas.classList.add('is-grabbing');
      }
      if (this._dragging){
        this.camera.theta = this._camStart.theta - dx * TUNE.CAMERA_DRAG_THETA;
        this.camera.phi   = clamp(
          this._camStart.phi - dy * TUNE.CAMERA_DRAG_PHI,
          -TUNE.CAMERA_PHI_LIMIT, TUNE.CAMERA_PHI_LIMIT
        );
      }
    }
    this._hover = this._pickNeuron(x, y);
  }

  _onPointerUp(ev){
    const r = this.canvas.getBoundingClientRect();
    const x = ev.clientX - r.left, y = ev.clientY - r.top;
    if (this._pressStart && !this._dragging){
      // Tap (not a drag) — fire kill if kill mode is on
      this._tryKillAt(x, y);
    }
    this._dragging = false;
    this._pressStart = null;
    this.canvas.classList.remove('is-grabbing');
  }

  _onWheel(ev){
    ev.preventDefault();
    const f = Math.exp(ev.deltaY * 0.001);
    this.camera.zoomBy(f);
    this._markInteract();
  }

  _onTouchStart(ev){
    if (ev.touches.length === 2){
      const a = ev.touches[0], b = ev.touches[1];
      this._pinchStart = {
        d: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY),
        dist: this.camera.dist,
      };
    }
  }

  _onTouchMove(ev){
    if (ev.touches.length === 2 && this._pinchStart){
      const a = ev.touches[0], b = ev.touches[1];
      const d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      const ratio = this._pinchStart.d / d;
      this.camera.dist = clamp(
        this._pinchStart.dist * ratio,
        TUNE.CAMERA_DIST_MIN, TUNE.CAMERA_DIST_MAX
      );
      this._markInteract();
    }
  }

  _onTouchEnd(){ this._pinchStart = null; }

  _tryKillAt(x, y){
    if (!this._killMode) return;
    const target = this._pickNeuron(x, y);
    if (target && target.alive){
      target.alive = false;
      this._bursts.spawnAt(target);
      if (this._callbacks.onKill) this._callbacks.onKill(this.model);
    } else if (this._callbacks.onKill){
      // Notify caller of a miss too, so the UI can reset streak counters
      this._callbacks.onKill(this.model, /* miss */ true);
    }
  }

  /* ===== Keyboard =============================================== */

  _attachKeyboard(){
    this._onKey = this._onKey.bind(this);
    window.addEventListener('keydown', this._onKey);
  }

  _detachKeyboard(){
    if (this._onKey) window.removeEventListener('keydown', this._onKey);
  }

  _onKey(ev){
    // Don't grab keys while the user is typing in an input
    const tag = (ev.target && ev.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    switch (ev.key.toLowerCase()){
      case 'r':
        this.resetNetwork();
        ev.preventDefault();
        break;
      case 'k':
        this.setKillMode(!this._killMode);
        if (this._callbacks.onChange) this._callbacks.onChange(this.model);
        ev.preventDefault();
        break;
      case 'arrowleft':
        this.camera.rotateBy(-0.12, 0);
        this._markInteract();
        ev.preventDefault();
        break;
      case 'arrowright':
        this.camera.rotateBy(0.12, 0);
        this._markInteract();
        ev.preventDefault();
        break;
      case 'arrowup':
        this.camera.rotateBy(0, -0.08);
        this._markInteract();
        ev.preventDefault();
        break;
      case 'arrowdown':
        this.camera.rotateBy(0, 0.08);
        this._markInteract();
        ev.preventDefault();
        break;
      case '=':
      case '+':
        this.camera.zoomBy(0.88);
        this._markInteract();
        ev.preventDefault();
        break;
      case '-':
      case '_':
        this.camera.zoomBy(1.13);
        this._markInteract();
        ev.preventDefault();
        break;
    }
  }
}

/* ---------- defaults --------------------------------------------- */

/**
 * Starter architecture. The page picks this if the URL doesn't have
 * a valid `?n=...&a=...` encoding. Six layers, 124 neurons total —
 * dense enough to feel like a real network, small enough to render
 * comfortably at 60fps.
 *
 * @type {LayerSpec[]}
 */
export const DEFAULT_LAYERS = Object.freeze([
  { name: 'IN',  n: 16, act: 'linear'  },
  { name: 'H1',  n: 28, act: 'ReLU'    },
  { name: 'H2',  n: 32, act: 'ReLU'    },
  { name: 'H3',  n: 28, act: 'ReLU'    },
  { name: 'H4',  n: 14, act: 'ReLU'    },
  { name: 'OUT', n: 6,  act: 'Softmax' },
]);

/** A smaller default for the mobile breakpoint (≤720px) so the
 *  layer structure reads on a phone column. */
export const MOBILE_DEFAULT_LAYERS = Object.freeze([
  { name: 'IN',  n: 12, act: 'linear'  },
  { name: 'H1',  n: 16, act: 'ReLU'    },
  { name: 'OUT', n: 4,  act: 'Softmax' },
]);

/** Built-in architecture presets, named for the chip labels. */
export const PRESETS = Object.freeze({
  'Perceptron': [
    { name: 'IN',  n: 8,  act: 'linear' },
    { name: 'OUT', n: 2,  act: 'Softmax' },
  ],
  'Simple MLP': [
    { name: 'IN',  n: 12, act: 'linear' },
    { name: 'H1',  n: 16, act: 'ReLU'   },
    { name: 'OUT', n: 4,  act: 'Softmax' },
  ],
  'Deep Net': [
    { name: 'IN',  n: 16, act: 'linear' },
    { name: 'H1',  n: 28, act: 'ReLU'   },
    { name: 'H2',  n: 32, act: 'ReLU'   },
    { name: 'H3',  n: 28, act: 'ReLU'   },
    { name: 'H4',  n: 14, act: 'ReLU'   },
    { name: 'OUT', n: 6,  act: 'Softmax' },
  ],
});

/* ---------- types ------------------------------------------------ */

/** @typedef {'linear'|'ReLU'|'Sigmoid'|'Tanh'|'Softmax'} ActivationName */
/** @typedef {{ name:string, n:number, act:ActivationName }} LayerSpec */
/** @typedef {{ x:number, y:number, z:number, alive:boolean, layer:number,
 *              idx:number, sx:number, sy:number, depth:number,
 *              breathPhase:number }} Neuron */
/** @typedef {{ info: LayerSpec, neurons: Neuron[] }} NeuronGroup */
/** @typedef {{ a:Neuron, b:Neuron, w:number,
 *              pktSpeed:number, pktPhase:number }} Connection */
/** @typedef {{ sx:number, sy:number, depth:number, startedAt:number }} Burst */

/* ---------- sort helper ------------------------------------------ */

function byMidDepthDesc(a, b){
  return ((b.a.depth + b.b.depth) - (a.a.depth + a.b.depth));
}
