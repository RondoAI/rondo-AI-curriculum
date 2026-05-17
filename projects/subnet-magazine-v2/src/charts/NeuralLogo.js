/* =================================================================
   SUBNET MAGAZINE, NEURAL LOGO
   -----------------------------------------------------------------
   Renders a logo image as the SAME neural-network visual language
   as the masthead NodeSphere: dense plexus of red nodes with a KNN
   structural mesh plus probability-based crossing chords, back-to-
   front low-alpha edges that build to a filigree mass, depth-keyed
   nodes with a frontmost sparkle, atmospheric red halo.

   THE ILLUSION
   ------------
   The logo is a flat 2D shape but reads as a living 3D neural net.
   Three known-good graphics techniques compose to make this work:

     1. Bridson Poisson-disk sampling (Bridson, 2007) places nodes
        inside the silhouette with an organic-but-even spread, no
        clumps, no gaps. Gold-standard distribution for plexus work.

     2. Virtual sphere depth projection: each 2D logo node (x, y)
        is mapped to a position (nx, ny, nz) on an invisible unit
        sphere fitted to the logo's bounding box. nz is chosen so
        the point sits on the sphere; a random sign so half the
        nodes are on the front hemisphere and half on the back. The
        invisible sphere is rotated each frame with the same Y spin
        plus X nod NodeSphere uses; the rotated nz becomes the
        depth. The screen position stays at the original logo (x,y).
        Result: a brightness wave sweeps across the logo silhouette
        as if the logo itself were a 3D sphere, even though the
        shape never deforms.

     3. NodeSphere render pipeline, unchanged: atmospheric halo,
        KNN base mesh, dense crossing-chord fill by probability,
        back-to-front low-alpha edges, depth-keyed node size and
        color, white-pink sparkle on the frontmost nodes.
   ================================================================= */

import { Chart } from './Chart.js';

export class NeuralLogo extends Chart {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {{
   *   imageSrc?:    string,
   *   nodes?:       number,    // target node count (matches NodeSphere default)
   *   K?:           number,    // KNN structural mesh size
   *   density?:     number,    // 0..1 pairwise wiring probability
   *   edgeCap?:     number,    // safety cap on edge count
   *   speed?:       number,    // virtual-sphere rotation rate
   *   glow?:        boolean,   // frontmost-node bloom
   *   atmos?:       boolean,   // atmospheric halo behind logo
   *   supersample?: number,    // off-canvas rasterization multiplier
   *   seed?:        number,
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

    /** Sampled nodes: { x, y, nx, ny, nz }
     *    x, y    = screen position in CSS pixels (the logo silhouette)
     *    nx,ny,nz = position on the invisible unit sphere (drives depth)
     */
    this._nodes = [];
    /** Edge list { a, b } */
    this._edges = [];
    /** Logo bounding box in CSS pixels (for halo + virtual sphere fit) */
    this._bbox  = { cx: 0, cy: 0, r: 0 };

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
    if (!this._image) return;

    const rng = mulberry32(this.seed * 9007 + 11);

    /* --- 1. Rasterize logo and threshold to a binary mask --- */
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

    /* Sample background from image-rect corners so we work with any
       logo regardless of color scheme. */
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

    /* --- 2. Bridson Poisson-disk sampling of the mask, then Lloyd
            relaxation (centroidal Voronoi, two passes) to kill any
            residual clumping. Lloyd was unnecessary for a tonal
            stippling render but on a binary silhouette mask it
            tightens the spacing for free. --- */
    const area = fgCount;
    const r = Math.max(2.5, Math.sqrt(area / (this.N * 0.7)));
    let samples = poissonDiskInMask(mask, W, H, minX, minY, maxX, maxY, r, 30, rng);

    if (samples.length > this.N){
      for (let i = samples.length - 1; i > 0; i--){
        const k = (rng() * (i + 1)) | 0;
        [samples[i], samples[k]] = [samples[k], samples[i]];
      }
      samples = samples.slice(0, this.N);
    }
    if (samples.length >= 2){
      lloydRelax(samples, mask, W, H, minX, minY, maxX, maxY, 2);
    }
    const picks = samples;

    /* --- 3. Map each sample to logo screen coords + virtual sphere --- */
    const bx0 = minX / ss, by0 = minY / ss;
    const bx1 = maxX / ss, by1 = maxY / ss;
    const bcx = (bx0 + bx1) / 2;
    const bcy = (by0 + by1) / 2;
    /* Use the larger half-extent so the inscribed virtual sphere fits
       the whole logo. Nodes outside that radius get clamped to the
       sphere surface, which is fine, they still get valid depth. */
    const bR  = Math.max(bx1 - bx0, by1 - by0) / 2;
    this._bbox = { cx: bcx, cy: bcy, r: bR };

    for (const s of picks){
      const cssX = s.x / ss;
      const cssY = s.y / ss;
      const nx = (cssX - bcx) / bR;
      const ny = (cssY - bcy) / bR;
      const k = nx*nx + ny*ny;
      let nz;
      if (k >= 1){
        /* Slightly outside the inscribed circle, sit on the equator */
        const m = Math.sqrt(k);
        const nx2 = nx / m, ny2 = ny / m;
        nz = 0;
        this._nodes.push({ x: cssX, y: cssY, nx: nx2, ny: ny2, nz });
      } else {
        const sign = rng() < 0.5 ? -1 : 1;
        nz = sign * Math.sqrt(1 - k);
        this._nodes.push({ x: cssX, y: cssY, nx, ny, nz });
      }
    }

    /* --- 4. Edges: KNN structural mesh + dense crossing-chord fill,
            exactly the NodeSphere algorithm. Distance is computed in
            screen space (the chord mass is what the viewer sees). --- */
    const N = this._nodes.length;
    if (N < 2) return;

    const seen = new Set();
    const out  = [];
    const add  = (i, j) => {
      if (i === j) return;
      const key = i < j ? `${i}:${j}` : `${j}:${i}`;
      if (seen.has(key)) return;
      seen.add(key);
      out.push({ a: i, b: j });
    };

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

    /* Atmospheric halo, sized to the logo bounding box */
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

    /* Rotate the invisible virtual sphere, same Y-spin + slow X-nod
       as NodeSphere. The screen positions (x, y) do NOT change, only
       the per-node depth does. */
    const ay = t * this.speed;
    const ax = Math.sin(t * this.speed * 0.45) * 0.42;
    const cosX = Math.cos(ax), sinX = Math.sin(ax);
    const cosY = Math.cos(ay), sinY = Math.sin(ay);

    const N = this._nodes.length;
    const live = new Array(N);
    for (let i = 0; i < N; i++){
      const n = this._nodes[i];
      /* Y rotation: (nx, nz) -> (x1, z1) */
      const x1 = n.nx * cosY + n.nz * sinY;
      const z1 = -n.nx * sinY + n.nz * cosY;
      /* X rotation: (ny, z1) -> (y2, z2) */
      const z2 = n.ny * sinX + z1 * cosX;
      const d  = (z2 + 1) / 2;   // 0 (back) .. 1 (front)
      live[i] = { sx: n.x, sy: n.y, d };
    }

    /* Edges, back to front, low per-edge alpha so the dense chord
       mesh builds to a filigree mass instead of a solid blob. */
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

    /* Nodes, back to front, depth-keyed exactly like NodeSphere.
       'lighter' blend mode here is the signature trick: it gives
       the bloom feel of the masthead without a real postprocess
       blur pass, because overlapping front-node halos accumulate
       additively. Edges stay on source-over so the dense chord
       mesh accumulates correctly as filigree, not white-out. */
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

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

    ctx.restore();
  }
}

/* =================================================================
   Bridson Poisson-disk sampling, restricted to a binary mask.
   Reference: Robert Bridson, "Fast Poisson Disk Sampling in
   Arbitrary Dimensions", SIGGRAPH 2007 sketches.
   Returns array of { x, y } in off-canvas pixel coords.
   ================================================================= */
function poissonDiskInMask(mask, W, H, minX, minY, maxX, maxY, r, k, rng){
  const cell  = r / Math.SQRT2;
  const gridW = Math.ceil((maxX - minX + 1) / cell) + 1;
  const gridH = Math.ceil((maxY - minY + 1) / cell) + 1;
  const grid  = new Int32Array(gridW * gridH).fill(-1);
  const pts   = [];
  const active = [];

  const inMask = (x, y) => {
    const xi = x | 0, yi = y | 0;
    if (xi < 0 || xi >= W || yi < 0 || yi >= H) return false;
    return mask[yi * W + xi] === 1;
  };

  const insertSeed = () => {
    /* Random seed inside the mask, retry up to a few times */
    for (let tries = 0; tries < 200; tries++){
      const x = minX + rng() * (maxX - minX);
      const y = minY + rng() * (maxY - minY);
      if (inMask(x, y)){
        pts.push({ x, y });
        active.push(0);
        const gx = ((x - minX) / cell) | 0;
        const gy = ((y - minY) / cell) | 0;
        grid[gy * gridW + gx] = 0;
        return true;
      }
    }
    return false;
  };

  if (!insertSeed()) return pts;

  while (active.length){
    const ai = (rng() * active.length) | 0;
    const idx = active[ai];
    const base = pts[idx];
    let placed = false;

    for (let tries = 0; tries < k; tries++){
      const angle = rng() * Math.PI * 2;
      const radius = r * (1 + rng());
      const x = base.x + Math.cos(angle) * radius;
      const y = base.y + Math.sin(angle) * radius;
      if (!inMask(x, y)) continue;

      const gx = ((x - minX) / cell) | 0;
      const gy = ((y - minY) / cell) | 0;
      if (gx < 0 || gx >= gridW || gy < 0 || gy >= gridH) continue;

      /* Check 5x5 cell neighborhood for any point closer than r */
      let ok = true;
      for (let dyc = -2; dyc <= 2 && ok; dyc++){
        for (let dxc = -2; dxc <= 2 && ok; dxc++){
          const nx = gx + dxc, ny = gy + dyc;
          if (nx < 0 || nx >= gridW || ny < 0 || ny >= gridH) continue;
          const pi = grid[ny * gridW + nx];
          if (pi < 0) continue;
          const p = pts[pi];
          const ex = p.x - x, ey = p.y - y;
          if (ex*ex + ey*ey < r*r) ok = false;
        }
      }
      if (!ok) continue;

      pts.push({ x, y });
      grid[gy * gridW + gx] = pts.length - 1;
      active.push(pts.length - 1);
      placed = true;
      break;
    }

    if (!placed){
      /* Pop this active point, swap with last */
      active[ai] = active[active.length - 1];
      active.pop();
    }
  }

  return pts;
}

/* =================================================================
   Lloyd relaxation (centroidal Voronoi) restricted to a binary
   mask. For each foreground pixel, assign it to the nearest point
   by squared distance; then move each point to the centroid of its
   assigned pixels. Two passes is plenty for visual cleanup.
   ================================================================= */
function lloydRelax(points, mask, W, H, minX, minY, maxX, maxY, iters){
  const N = points.length;
  for (let it = 0; it < iters; it++){
    const sx = new Float64Array(N);
    const sy = new Float64Array(N);
    const cnt = new Uint32Array(N);

    for (let y = minY; y <= maxY; y++){
      const row = y * W;
      for (let x = minX; x <= maxX; x++){
        if (mask[row + x] !== 1) continue;
        let best = 0, bestD = Infinity;
        for (let i = 0; i < N; i++){
          const dx = points[i].x - x, dy = points[i].y - y;
          const d2 = dx*dx + dy*dy;
          if (d2 < bestD){ bestD = d2; best = i; }
        }
        sx[best]  += x;
        sy[best]  += y;
        cnt[best] += 1;
      }
    }

    for (let i = 0; i < N; i++){
      if (cnt[i] === 0) continue;
      points[i].x = sx[i] / cnt[i];
      points[i].y = sy[i] / cnt[i];
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
