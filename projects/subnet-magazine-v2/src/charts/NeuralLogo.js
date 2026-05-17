/* =================================================================
   SUBNET MAGAZINE, NEURAL LOGO
   -----------------------------------------------------------------
   Renders a logo image as the SAME neural-network visual language
   as the masthead NodeSphere: dense plexus of red nodes with a KNN
   structural mesh plus probability-based crossing chords, back-to-
   front low-alpha edges that build to a filigree mass, depth-keyed
   nodes with a frontmost sparkle, atmospheric red halo.

   Where NodeSphere distributes nodes on a Fibonacci sphere, this
   class distributes them inside the silhouette of a logo image
   (rejection-sampled from a threshold mask). The silhouette stays
   put so the brand mark is always readable; depth comes from a per-
   node fake z that oscillates gently to give the plexus the same
   sense of life as the spinning sphere at the top of the page.

   Render pipeline (per frame):
     1. Soft red atmospheric halo at the logo's bounding box.
     2. Each node's z oscillates a touch for parallax breathing.
     3. Edges painted back-to-front, alpha keyed to mid-depth.
     4. Nodes painted back-to-front, brighter toward the front,
        with a quiet white sparkle on the frontmost.
   ================================================================= */

import { Chart } from './Chart.js';

export class NeuralLogo extends Chart {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {{
   *   imageSrc?: string,    // required for image mode
   *   nodes?:    number,    // target node count (matches NodeSphere default)
   *   K?:        number,    // KNN structural mesh size
   *   density?:  number,    // 0..1 pairwise wiring probability
   *   edgeCap?:  number,    // safety cap on edge count
   *   speed?:    number,    // depth-breathing rate
   *   glow?:     boolean,   // frontmost-node bloom
   *   atmos?:    boolean,   // atmospheric halo behind logo
   *   supersample?: number, // off-canvas rasterization multiplier
   *   seed?:     number,
   * }} [opts]
   */
  constructor(canvas, opts = {}){
    super(canvas, { animate: true });
    this.imageSrc    = opts.imageSrc    || null;
    this.N           = opts.nodes       ?? 78;
    this.K           = opts.K           ?? 4;
    this.density     = opts.density     ?? 0.46;
    this.edgeCap     = opts.edgeCap     ?? 3000;
    this.speed       = opts.speed       ?? 0.32;
    this.glow        = opts.glow      !== false;
    this.atmos       = opts.atmos     !== false;
    this.supersample = opts.supersample ?? 3;
    this.seed        = (opts.seed       ?? 1) >>> 0;

    /** Sampled 2D node positions in CSS-pixel coords + static base z */
    this._nodes = [];
    /** Edge list { a, b } */
    this._edges = [];
    /** Per-node breathing phase */
    this._phase = [];
    /** Logo bounding box in CSS pixels for the atmospheric halo */
    this._bbox  = { cx: 0, cy: 0, r: 0 };

    /* Async image load: relayout once it lands. Until then no draw
       happens because _nodes is empty. */
    this._image = null;
    if (this.imageSrc){
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this._image = img;
        if (this.w && this.h){
          try { this.layout(this.ctx, this.w, this.h); } catch (_) {}
        }
      };
      img.onerror = () => { /* silent; nothing to draw */ };
      img.src = this.imageSrc;
    }
  }

  /* ---------------------------------------------------------------- */
  layout(ctx, w, h){
    this._nodes = [];
    this._edges = [];
    this._phase = [];
    if (!this._image) return;

    const rng = mulberry32(this.seed * 9007 + 11);

    /* 1. Rasterize the logo to an off-canvas at supersample x display.
          We then build a binary mask of "logo" pixels by sampling the
          four image-rect corners as background and treating anything
          that differs by more than a color threshold as foreground.
          This handles any logo color scheme without per-image tuning. */
    const ss = Math.max(1, this.supersample);
    const off = document.createElement('canvas');
    off.width  = Math.max(8, Math.floor(w * ss));
    off.height = Math.max(8, Math.floor(h * ss));
    const oc = off.getContext('2d');
    oc.imageSmoothingEnabled = true;
    oc.imageSmoothingQuality = 'high';
    oc.fillStyle = '#000';
    oc.fillRect(0, 0, off.width, off.height);

    const iw = this._image.naturalWidth  || this._image.width  || 1;
    const ih = this._image.naturalHeight || this._image.height || 1;
    const pad = Math.min(off.width, off.height) * 0.06;
    const scale = Math.min((off.width - pad*2) / iw, (off.height - pad*2) / ih);
    const dw = iw * scale, dh = ih * scale;
    const dx = (off.width  - dw) / 2;
    const dy = (off.height - dh) / 2;
    oc.drawImage(this._image, dx, dy, dw, dh);

    const id = oc.getImageData(0, 0, off.width, off.height);
    const data = id.data;

    /* Sample background from image-rect corners */
    const cx0 = Math.max(0, Math.floor(dx)) + 1;
    const cy0 = Math.max(0, Math.floor(dy)) + 1;
    const cx1 = Math.min(off.width  - 1, Math.floor(dx + dw)) - 1;
    const cy1 = Math.min(off.height - 1, Math.floor(dy + dh)) - 1;
    let br = 0, bg = 0, bb = 0, ba = 0;
    for (const [sx, sy] of [[cx0,cy0],[cx1,cy0],[cx0,cy1],[cx1,cy1]]){
      const p = (sy * off.width + sx) * 4;
      br += data[p]; bg += data[p+1]; bb += data[p+2]; ba += data[p+3];
    }
    br /= 4; bg /= 4; bb /= 4; ba /= 4;
    const bgTransparent = ba < 32;
    const THR = 70;

    /* Build a packed mask (1 byte per pixel) and capture bbox of fg */
    const W = off.width, H = off.height;
    const mask = new Uint8Array(W * H);
    let minX = W, minY = H, maxX = 0, maxY = 0;
    let fgCount = 0;
    for (let y = 0; y < H; y++){
      for (let x = 0; x < W; x++){
        const p = (y * W + x) * 4;
        const aa = data[p + 3];
        let on;
        if (aa <= 32) on = false;
        else if (bgTransparent) on = true;
        else {
          const dr = data[p] - br, dgg = data[p+1] - bg, db = data[p+2] - bb;
          on = (dr*dr + dgg*dgg + db*db) > THR*THR;
        }
        if (on){
          mask[y * W + x] = 1;
          fgCount++;
          if (x < minX) minX = x; if (x > maxX) maxX = x;
          if (y < minY) minY = y; if (y > maxY) maxY = y;
        }
      }
    }
    if (fgCount === 0) return;

    /* 2. Rejection-sample N node positions uniformly from the mask.
          Convert from off-canvas pixels to CSS-pixel coords. */
    const target = this.N;
    const maxTries = target * 200;
    let tries = 0;
    while (this._nodes.length < target && tries < maxTries){
      tries++;
      const x = (minX + rng() * (maxX - minX)) | 0;
      const y = (minY + rng() * (maxY - minY)) | 0;
      if (!mask[y * W + x]) continue;
      /* Reject if too close to an existing node, gives the field a
         Poisson-disk-ish even spread instead of clumps. */
      const cssX = x / ss;
      const cssY = y / ss;
      const minDist = Math.max(4, Math.min(w, h) / Math.sqrt(target) * 0.62);
      let ok = true;
      for (let k = 0; k < this._nodes.length; k++){
        const dx2 = this._nodes[k].x - cssX;
        const dy2 = this._nodes[k].y - cssY;
        if (dx2*dx2 + dy2*dy2 < minDist*minDist){ ok = false; break; }
      }
      if (!ok) continue;
      /* Random static base z plus a phase so each node breathes on
         its own clock. The z creates the depth-shaded look that
         NodeSphere gets from its spherical projection; the phase
         keeps the field shimmering instead of all-in-sync pulsing. */
      this._nodes.push({
        x:  cssX,
        y:  cssY,
        bz: rng() * 2 - 1,
        ph: rng() * Math.PI * 2,
      });
    }

    /* 3. Per-node oscillation phase already stored on node */
    this._phase = this._nodes.map(n => n.ph);

    /* 4. Bounding box for the atmospheric halo (in CSS px) */
    const bx0 = minX / ss, by0 = minY / ss;
    const bx1 = maxX / ss, by1 = maxY / ss;
    this._bbox = {
      cx: (bx0 + bx1) / 2,
      cy: (by0 + by1) / 2,
      r:  Math.max(bx1 - bx0, by1 - by0) * 0.62,
    };

    /* 5. Build edges: KNN structural mesh + dense crossing-chord fill
          based on probability, exactly the NodeSphere algorithm. */
    const N = this._nodes.length;
    const seen = new Set();
    const out = [];
    const add = (i, j) => {
      if (i === j) return;
      const key = i < j ? `${i}:${j}` : `${j}:${i}`;
      if (seen.has(key)) return;
      seen.add(key);
      out.push({ a: i, b: j });
    };

    /* KNN base, using 2D distance (the silhouette IS planar) */
    for (let i = 0; i < N; i++){
      const a = this._nodes[i];
      const d = [];
      for (let j = 0; j < N; j++){
        if (i === j) continue;
        const b = this._nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        d.push({ j, d2: dx*dx + dy*dy });
      }
      d.sort((u, v) => u.d2 - v.d2);
      for (let k = 0; k < this.K && k < d.length; k++) add(i, d[k].j);
    }

    /* Dense crossing-chord fill */
    if (this.density > 0){
      for (let i = 0; i < N; i++)
        for (let j = i + 1; j < N; j++)
          if (rng() < this.density) add(i, j);
    }

    if (out.length > this.edgeCap){
      for (let i = out.length - 1; i > 0; i--){
        const k = (rng() * (i + 1)) | 0;
        [out[i], out[k]] = [out[k], out[i]];
      }
      out.length = this.edgeCap;
    }
    this._edges = out;
  }

  /* ---------------------------------------------------------------- */
  draw(ctx, w, h, t){
    ctx.clearRect(0, 0, w, h);
    if (!this._nodes.length) return;

    const { cx, cy, r: R } = this._bbox;

    /* Atmospheric halo behind the logo silhouette */
    if (this.atmos){
      const grad = ctx.createRadialGradient(cx, cy, R * 0.4, cx, cy, R * 1.4);
      grad.addColorStop(0,    'rgba(255,30,60,.12)');
      grad.addColorStop(0.55, 'rgba(255,30,60,.06)');
      grad.addColorStop(1,    'rgba(255,30,60,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.4, 0, Math.PI * 2);
      ctx.fill();
    }

    /* Per-node live depth, base z + a slow per-node breathing wave.
       Range stays inside [-1, 1] so the depth scaling matches the
       NodeSphere formulas. */
    const N = this._nodes.length;
    const live = new Array(N);
    for (let i = 0; i < N; i++){
      const n = this._nodes[i];
      const z = n.bz + 0.45 * Math.sin(t * this.speed + n.ph);
      const d = (Math.max(-1, Math.min(1, z)) + 1) / 2;  // 0 (back) .. 1 (front)
      live[i] = { sx: n.x, sy: n.y, d };
    }

    /* Edges, back to front. Low per-edge alpha so the dense chord
       mesh builds to a filigree mass instead of a solid red blob,
       same formula as NodeSphere. */
    const eSorted = this._edges
      .map(e => ({ a: e.a, b: e.b, mid: (live[e.a].d + live[e.b].d) / 2 }))
      .sort((u, v) => u.mid - v.mid);

    for (const e of eSorted){
      const a = live[e.a], b = live[e.b];
      const md = (a.d + b.d) / 2;
      const alpha = 0.045 + md * 0.4;
      ctx.strokeStyle = `rgba(255,30,60,${alpha.toFixed(3)})`;
      ctx.lineWidth = 0.3 + md * 0.5;
      ctx.beginPath();
      ctx.moveTo(a.sx, a.sy);
      ctx.lineTo(b.sx, b.sy);
      ctx.stroke();
    }

    /* Nodes, back to front, depth-keyed exactly like NodeSphere */
    const pSorted = live
      .map((q, i) => ({ ...q, i }))
      .sort((u, v) => u.d - v.d);

    for (const q of pSorted){
      const r = 0.7 + q.d * 1.9;
      const a = 0.4 + q.d * 0.6;
      if (this.glow && q.d > 0.62){
        ctx.fillStyle = `rgba(255,30,60,${(0.22 * (q.d - 0.62) / 0.38).toFixed(3)})`;
        ctx.beginPath(); ctx.arc(q.sx, q.sy, r * 3.8, 0, Math.PI * 2); ctx.fill();
      }
      const g = Math.round(30 + q.d * 110);
      const bb = Math.round(60 + q.d * 100);
      ctx.fillStyle = `rgba(255,${g},${bb},${a.toFixed(3)})`;
      ctx.beginPath(); ctx.arc(q.sx, q.sy, r, 0, Math.PI * 2); ctx.fill();
      if (q.d > 0.86){
        ctx.fillStyle = `rgba(255,224,228,${((q.d - 0.86) / 0.14).toFixed(3)})`;
        ctx.beginPath(); ctx.arc(q.sx, q.sy, r * 0.55, 0, Math.PI * 2); ctx.fill();
      }
    }
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
