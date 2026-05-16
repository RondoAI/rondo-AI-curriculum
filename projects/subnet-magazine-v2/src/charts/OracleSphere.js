/* =================================================================
   SUBNET MAGAZINE, ORACLE SPHERE (multimodal)
   -----------------------------------------------------------------
   The Subnet Oracle's combined signature: a rotating spherical
   plexus of red nodes (the "neural network spinning") with the
   article's subject rendered as a red plexus glyph centered INSIDE
   the sphere. Drawn with depth-sorted z order so the back hemisphere
   sits behind the glyph and the front hemisphere overlays it, giving
   the illusion of the glyph living inside a transparent globe of
   nodes.

   Used as the cover art for Subnet Oracle article cards:
     - Subnet Spotlight: the subnet's name (TARGON, LIUM, RIDGES)
     - Ecosystem State:  the word "ORACLE"

   All red on dark, no other colors, no images. Canvas only.

   Render pipeline (per frame):
     1. Project sphere points to 2D, sort by z (depth)
     2. Draw BACK hemisphere: edges then nodes
     3. Draw glyph in the middle (KNN plexus, breathing alpha)
     4. Draw FRONT hemisphere: edges then nodes, with a soft glow
   ================================================================= */

import { Chart } from './Chart.js';

export class OracleSphere extends Chart {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {{
   *   text?:         string,
   *   imageSrc?:     string,    // optional URL of a logo image; if
   *                              // present, the chart samples its
   *                              // pixels to form the plexus glyph,
   *                              // rather than rendering the text.
   *   sphereNodes?:  number,
   *   sphereSpeed?:  number,
   *   glyphDensity?: number,
   *   sphereRadius?: number,     // 0..1, fraction of min(w,h)/2
   *   seed?:         number,
   *   weight?:       'normal' | 'bold' | '900'
   * }} [opts]
   */
  constructor(canvas, opts = {}){
    super(canvas, { animate: true });
    this.text         = (opts.text || 'ORACLE').toString();
    this.imageSrc     = opts.imageSrc || null;
    this.sphereNodes  = opts.sphereNodes  ?? 64;
    this.sphereSpeed  = opts.sphereSpeed  ?? 0.32;
    this.glyphDensity = opts.glyphDensity ?? 0.58;
    this.sphereRadius = opts.sphereRadius ?? 0.48;
    this.seed         = (opts.seed        ?? 1) >>> 0;
    this.weight       = opts.weight       || '900';

    /* layout-computed */
    this._cx = 0; this._cy = 0; this._R = 0;
    this._spherePts = [];   // unit-sphere points
    this._glyphPts  = [];   // glyph 2D points (canvas coords)
    this._glyphEdges = [];
    this._glyphPhase = [];

    /* if an image is requested, load it now; once it lands we kick a
       relayout. Until then the chart shows the text fallback. */
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
      img.onerror = () => { /* fall through to text */ };
      img.src = this.imageSrc;
    }
  }

  /* ---------------------------------------------------------------- */
  layout(ctx, w, h){
    const rng = mulberry32(this.seed * 9013 + 7);
    this._cx = w / 2;
    this._cy = h / 2;
    this._R  = Math.min(w, h) * this.sphereRadius;

    /* 1. Sphere points via golden-angle spiral on unit sphere */
    const N = this.sphereNodes;
    const phi = Math.PI * (3.0 - Math.sqrt(5.0));
    const pts = [];
    for (let i = 0; i < N; i++){
      const y = 1 - (i / Math.max(1, N - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = phi * i + (rng() - 0.5) * 0.25;
      pts.push([Math.cos(theta) * r, y, Math.sin(theta) * r]);
    }
    this._spherePts = pts;

    /* 2. Glyph: render either an image (if the caller supplied a
          logo URL and it loaded) or the text fallback to an off-screen
          canvas. Either way we end up with a pixel grid we sample. We
          size the off-screen canvas so the glyph fits inside the sphere
          with margin to spare. */
    const gw = Math.floor(w * 0.62);
    const gh = Math.floor(h * 0.52);
    const off = document.createElement('canvas');
    off.width  = Math.max(8, gw);
    off.height = Math.max(8, gh);
    const oc = off.getContext('2d');
    oc.fillStyle = '#000';
    oc.fillRect(0, 0, off.width, off.height);

    if (this._image){
      /* Image path: fit-contain the image into the off-screen box,
         centered. We render it white-on-black so the pixel-sample
         pass downstream treats bright pixels as glyph. The original
         color is discarded; the plexus will be all red. */
      const iw = this._image.naturalWidth  || this._image.width  || 1;
      const ih = this._image.naturalHeight || this._image.height || 1;
      const scale = Math.min(off.width / iw, off.height / ih);
      const dw = iw * scale, dh = ih * scale;
      const dx = (off.width  - dw) / 2;
      const dy = (off.height - dh) / 2;
      oc.drawImage(this._image, dx, dy, dw, dh);
      /* Threshold: any pixel with meaningful luminance becomes glyph.
         We rewrite the off-screen image so the downstream sampler
         can use the same "green channel > 90" test as the text path. */
      const id = oc.getImageData(0, 0, off.width, off.height);
      const d  = id.data;
      for (let p = 0; p < d.length; p += 4){
        const lum = 0.299 * d[p] + 0.587 * d[p + 1] + 0.114 * d[p + 2];
        const aa  = d[p + 3];
        const on  = (aa > 64) && (lum > 60);
        d[p] = d[p + 1] = d[p + 2] = on ? 255 : 0;
        d[p + 3] = 255;
      }
      oc.putImageData(id, 0, 0);
    } else {
      /* Text path (fallback). Binary search font size to fit. */
      oc.fillStyle = '#fff';
      oc.textAlign = 'center';
      oc.textBaseline = 'middle';
      const padX = off.width * 0.08;
      let lo = 8, hi = Math.min(off.width, off.height) * 2;
      for (let i = 0; i < 12; i++){
        const m = (lo + hi) / 2;
        oc.font = `${this.weight} ${m}px Archivo, "Inter", system-ui, sans-serif`;
        const tw = oc.measureText(this.text).width;
        if (tw > off.width - padX * 2) hi = m;
        else                            lo = m;
      }
      oc.font = `${this.weight} ${lo}px Archivo, "Inter", system-ui, sans-serif`;
      oc.fillText(this.text, off.width / 2, off.height / 2);
    }

    /* Sample pixels on a stride grid */
    const data = oc.getImageData(0, 0, off.width, off.height).data;
    const stride = Math.max(3, Math.round(6 - this.glyphDensity * 3));
    const glyph = [];
    const offX = (w - off.width)  / 2;
    const offY = (h - off.height) / 2;
    for (let y = 0; y < off.height; y += stride){
      for (let x = 0; x < off.width; x += stride){
        if (data[(y * off.width + x) * 4 + 1] > 90){
          const jx = x + (rng() - 0.5) * stride * 0.5;
          const jy = y + (rng() - 0.5) * stride * 0.5;
          glyph.push([offX + jx, offY + jy]);
        }
      }
    }
    /* Cap density */
    const MAX = 600;
    if (glyph.length > MAX){
      const keep = [];
      const step = glyph.length / MAX;
      for (let i = 0; i < MAX; i++) keep.push(glyph[Math.floor(i * step)]);
      this._glyphPts = keep;
    } else {
      this._glyphPts = glyph;
    }

    /* 3. Pre-compute glyph KNN edges */
    this._glyphEdges = [];
    const K = 3;
    const maxD = Math.max(w, h) * 0.045;
    for (let i = 0; i < this._glyphPts.length; i++){
      const [xi, yi] = this._glyphPts[i];
      const cand = [];
      for (let j = 0; j < this._glyphPts.length; j++){
        if (i === j) continue;
        const dx = this._glyphPts[j][0] - xi;
        const dy = this._glyphPts[j][1] - yi;
        const d2 = dx * dx + dy * dy;
        if (d2 < maxD * maxD) cand.push([d2, j]);
      }
      cand.sort((a, b) => a[0] - b[0]);
      for (let k = 0; k < Math.min(K, cand.length); k++){
        const j = cand[k][1];
        if (j > i) this._glyphEdges.push([i, j]);
      }
    }

    /* 4. Breathing phase per glyph point */
    this._glyphPhase = this._glyphPts.map(() => rng() * Math.PI * 2);
  }

  /* ---------------------------------------------------------------- */
  draw(ctx, w, h, t){
    ctx.clearRect(0, 0, w, h);
    const cx = this._cx, cy = this._cy, R = this._R;

    /* Rotate sphere around Y axis, project to 2D */
    const phase = t * this.sphereSpeed;
    const cosY = Math.cos(phase), sinY = Math.sin(phase);
    const proj = this._spherePts.map(([x, y, z]) => {
      const xr = x * cosY + z * sinY;
      const zr = -x * sinY + z * cosY;
      return { x: cx + xr * R, y: cy + y * R, z: zr };
    });

    /* Pre-compute KNN-ish edges in 3D (recomputed per frame because
       z keeps changing under rotation; the underlying 3D distances
       are static, but we want to split front/back at draw time). */
    const edges = [];
    for (let i = 0; i < this._spherePts.length; i++){
      for (let j = i + 1; j < this._spherePts.length; j++){
        const dx = this._spherePts[i][0] - this._spherePts[j][0];
        const dy = this._spherePts[i][1] - this._spherePts[j][1];
        const dz = this._spherePts[i][2] - this._spherePts[j][2];
        const d2 = dx*dx + dy*dy + dz*dz;
        if (d2 < 0.38){
          const zmid = (proj[i].z + proj[j].z) * 0.5;
          edges.push({ i, j, z: zmid });
        }
      }
    }

    /* ===== BACK LAYER ===== */
    /* edges behind glyph (z < 0) */
    ctx.save();
    ctx.lineWidth = 0.6;
    for (const e of edges){
      if (e.z >= 0) continue;
      const a = 0.10 + (e.z + 1) * 0.22;
      ctx.strokeStyle = `rgba(255,30,60,${a.toFixed(3)})`;
      ctx.beginPath();
      ctx.moveTo(proj[e.i].x, proj[e.i].y);
      ctx.lineTo(proj[e.j].x, proj[e.j].y);
      ctx.stroke();
    }
    /* back nodes */
    const back = proj.filter(p => p.z < 0).sort((a, b) => a.z - b.z);
    for (const p of back){
      const a = 0.20 + (p.z + 1) * 0.30;
      const r = 0.9 + (p.z + 1) * 0.6;
      ctx.fillStyle = `rgba(255,77,96,${a.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    /* ===== MIDDLE LAYER: the glyph (inside the sphere) ===== */
    /* Glyph edges */
    ctx.save();
    ctx.strokeStyle = 'rgba(255,30,60,0.45)';
    ctx.lineWidth = 0.7;
    for (const [i, j] of this._glyphEdges){
      const a = this._glyphPts[i];
      const b = this._glyphPts[j];
      ctx.beginPath();
      ctx.moveTo(a[0], a[1]);
      ctx.lineTo(b[0], b[1]);
      ctx.stroke();
    }
    /* Glyph dots with subtle breathing */
    for (let i = 0; i < this._glyphPts.length; i++){
      const [x, y] = this._glyphPts[i];
      const ph = this._glyphPhase[i];
      const a = 0.65 + 0.28 * Math.sin(t * 1.4 + ph);
      ctx.fillStyle = `rgba(255,77,96,${a.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    /* Slow rotating hot pulses on the glyph for "live" feel */
    const hotCount = Math.max(2, Math.floor(this._glyphPts.length / 60));
    for (let k = 0; k < hotCount; k++){
      const idx = Math.floor(
        ((Math.sin(t * 0.45 + k * 1.7) + 1) / 2) * this._glyphPts.length,
      ) % this._glyphPts.length;
      const [x, y] = this._glyphPts[idx];
      ctx.fillStyle = 'rgba(255,128,148,0.95)';
      ctx.shadowColor = '#FF1E3C';
      ctx.shadowBlur = 9;
      ctx.beginPath();
      ctx.arc(x, y, 2.3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    /* ===== FRONT LAYER ===== */
    /* edges in front of glyph (z >= 0) */
    ctx.save();
    ctx.lineWidth = 0.7;
    for (const e of edges){
      if (e.z < 0) continue;
      const a = 0.25 + (e.z + 1) * 0.32;
      ctx.strokeStyle = `rgba(255,30,60,${Math.min(0.85, a).toFixed(3)})`;
      ctx.beginPath();
      ctx.moveTo(proj[e.i].x, proj[e.i].y);
      ctx.lineTo(proj[e.j].x, proj[e.j].y);
      ctx.stroke();
    }
    /* front nodes with slight glow */
    const front = proj.filter(p => p.z >= 0).sort((a, b) => a.z - b.z);
    for (const p of front){
      const a = 0.45 + p.z * 0.45;
      const r = 1.2 + p.z * 1.1;
      ctx.fillStyle = `rgba(255,77,96,${Math.min(1, a).toFixed(3)})`;
      ctx.shadowColor = '#FF1E3C';
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
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
