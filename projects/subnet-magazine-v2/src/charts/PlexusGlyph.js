/* =================================================================
   SUBNET MAGAZINE, PLEXUS GLYPH
   -----------------------------------------------------------------
   Renders a glyph (text or, future, an image) as a dense red plexus
   where the dots themselves form the silhouette. The background is
   filled with a sparse ambient plexus so the foreground reads as
   "an emergent shape inside a wider network". Same red-on-dark
   language as the rest of the magazine.

   Used as the cover art for Subnet Oracle article cards: each
   Subnet Spotlight wears its subnet's name rendered as the plexus,
   each Ecosystem State wears a generic Subnet Oracle mark.

   Render pipeline (per frame):
     1. Sparse ambient background plexus
     2. Dense foreground plexus sampled from the glyph
     3. Edges between near-neighbor sample points (KNN-ish)
     4. Subtle per-node alpha breathing for "live" feel
   ================================================================= */

import { Chart } from './Chart.js';

export class PlexusGlyph extends Chart {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {{
   *   imageSrc?: string,   // logo image URL; if present, sampled as glyph
   *   text?:    string,    // fallback text glyph if no image
   *   density?: number,    // foreground dot density (0..1)
   *   ambient?: number,    // ambient background dot count
   *   seed?:    number,
   *   weight?:  'normal' | 'bold' | '900',
   *   stretch?: boolean    // size the text to fill the canvas
   * }} [opts]
   */
  constructor(canvas, opts = {}){
    super(canvas, { animate: true });
    this.imageSrc = opts.imageSrc || null;
    this.text     = (opts.text || 'ORACLE').toString();
    this.density  = opts.density ?? 0.55;
    this.ambient  = opts.ambient ?? 80;
    this.seed     = (opts.seed   ?? 1) >>> 0;
    this.weight   = opts.weight  || '900';
    this.stretch  = opts.stretch !== false;

    /** glyph sample points (foreground) */
    this._fg = [];
    /** ambient background points */
    this._bg = [];
    /** breathing phases per fg point so they shimmer independently */
    this._phase = [];

    /* Image load (async): when it lands we relayout so the chart
       switches from the text fallback to the image-sampled glyph. */
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
      img.onerror = () => { /* text fallback */ };
      img.src = this.imageSrc;
    }
  }

  /* ---------------------------------------------------------------- */
  layout(ctx, w, h){
    const rng = mulberry32(this.seed * 9176 + 1);

    /* Render the glyph (image if loaded, text otherwise) into an
       off-screen canvas, then sample it. Image branch uses an
       adaptive foreground extraction that samples the corner
       pixels as background and selects anything whose color differs
       by more than a threshold; that handles logos with any color
       scheme without per-logo tuning. */
    const off = document.createElement('canvas');
    off.width  = Math.max(8, Math.floor(w));
    off.height = Math.max(8, Math.floor(h));
    const oc = off.getContext('2d');
    oc.fillStyle = '#000';
    oc.fillRect(0, 0, off.width, off.height);

    if (this._image){
      const iw = this._image.naturalWidth  || this._image.width  || 1;
      const ih = this._image.naturalHeight || this._image.height || 1;
      const padX = off.width  * 0.05;
      const padY = off.height * 0.05;
      const boxW = off.width  - padX * 2;
      const boxH = off.height - padY * 2;
      const scale = Math.min(boxW / iw, boxH / ih);
      const dw = iw * scale, dh = ih * scale;
      const dx = (off.width  - dw) / 2;
      const dy = (off.height - dh) / 2;
      oc.drawImage(this._image, dx, dy, dw, dh);

      const id = oc.getImageData(0, 0, off.width, off.height);
      const d  = id.data;

      /* Sample corners of the drawn-image rect as background ref */
      const ix0 = Math.max(0, Math.floor(dx)) + 1;
      const iy0 = Math.max(0, Math.floor(dy)) + 1;
      const ix1 = Math.min(off.width  - 1, Math.floor(dx + dw)) - 1;
      const iy1 = Math.min(off.height - 1, Math.floor(dy + dh)) - 1;
      let br = 0, bg = 0, bb = 0, ba = 0;
      const samp = [[ix0,iy0],[ix1,iy0],[ix0,iy1],[ix1,iy1]];
      for (const [sx, sy] of samp){
        const p = (sy * off.width + sx) * 4;
        br += d[p]; bg += d[p+1]; bb += d[p+2]; ba += d[p+3];
      }
      br /= 4; bg /= 4; bb /= 4; ba /= 4;
      const bgTransparent = ba < 32;
      const THR = 70;

      for (let p = 0; p < d.length; p += 4){
        const aa = d[p+3];
        let on;
        if (aa <= 32) on = false;
        else if (bgTransparent) on = true;
        else {
          const dr = d[p] - br, dg = d[p+1] - bg, db = d[p+2] - bb;
          on = Math.sqrt(dr*dr + dg*dg + db*db) > THR;
        }
        d[p] = d[p+1] = d[p+2] = on ? 255 : 0;
        d[p+3] = 255;
      }
      oc.putImageData(id, 0, 0);
    } else {
      /* Text fallback: auto-fit then render */
      const padX = off.width  * 0.08;
      const padY = off.height * 0.12;
      let fontSize = Math.min(off.height - padY * 2, off.width * 0.9);
      oc.fillStyle = '#ffffff';
      oc.textAlign = 'center';
      oc.textBaseline = 'middle';
      if (this.stretch){
        let lo = 8, hi = Math.min(off.width, off.height) * 2;
        for (let i = 0; i < 12; i++){
          const m = (lo + hi) / 2;
          oc.font = `${this.weight} ${m}px Archivo, "Inter", system-ui, sans-serif`;
          const tw = oc.measureText(this.text).width;
          if (tw > off.width - padX * 2) hi = m;
          else                            lo = m;
        }
        fontSize = lo;
      }
      oc.font = `${this.weight} ${fontSize}px Archivo, "Inter", system-ui, sans-serif`;
      oc.fillText(this.text, off.width / 2, off.height / 2);
    }

    /* 2. Sample non-empty pixels on a stride grid. The stride
          controls dot density; a smaller stride means more dots. */
    const data = oc.getImageData(0, 0, off.width, off.height).data;
    const stride = Math.max(4, Math.round(7 - this.density * 4));
    const fg = [];
    for (let y = 0; y < off.height; y += stride){
      for (let x = 0; x < off.width; x += stride){
        const idx = (y * off.width + x) * 4;
        /* sample green channel (white text on black bg, RGB all equal) */
        if (data[idx + 1] > 90){
          /* small jitter so the grid does not read as a regular grid */
          const jx = x + (rng() - 0.5) * stride * 0.6;
          const jy = y + (rng() - 0.5) * stride * 0.6;
          fg.push([jx, jy]);
        }
      }
    }
    /* Cap to a sensible upper bound for frame budget */
    const MAX_FG = 900;
    if (fg.length > MAX_FG){
      /* sample uniformly */
      const keep = [];
      const step = fg.length / MAX_FG;
      for (let i = 0; i < MAX_FG; i++) keep.push(fg[Math.floor(i * step)]);
      this._fg = keep;
    } else {
      this._fg = fg;
    }

    /* 3. Ambient background dots, scattered uniformly across the
          canvas. Sparse enough to read as atmosphere, not noise. */
    const bg = [];
    for (let i = 0; i < this.ambient; i++){
      bg.push([rng() * w, rng() * h]);
    }
    this._bg = bg;

    /* 4. Phase per foreground point so the breathing shimmer is not
          all in sync. */
    this._phase = this._fg.map(() => rng() * Math.PI * 2);

    /* 5. Pre-compute foreground edges: each point connects to its K
          nearest neighbors below a distance threshold. Computed once
          at layout because the points themselves do not move. */
    this._edges = [];
    const K = 3;
    const maxD = Math.max(off.width, off.height) * 0.045;
    /* O(N^2) is fine at N<=900 since this runs once on resize */
    for (let i = 0; i < this._fg.length; i++){
      const [xi, yi] = this._fg[i];
      const cand = [];
      for (let j = 0; j < this._fg.length; j++){
        if (i === j) continue;
        const dx = this._fg[j][0] - xi;
        const dy = this._fg[j][1] - yi;
        const d2 = dx * dx + dy * dy;
        if (d2 < maxD * maxD) cand.push([d2, j]);
      }
      cand.sort((a, b) => a[0] - b[0]);
      for (let k = 0; k < Math.min(K, cand.length); k++){
        const j = cand[k][1];
        if (j > i) this._edges.push([i, j]);  /* dedupe */
      }
    }
  }

  /* ---------------------------------------------------------------- */
  draw(ctx, w, h, t){
    ctx.clearRect(0, 0, w, h);

    /* 1. Background ambient plexus: scatter dots + a few long
          crossing lines so it reads as "wider network behind". */
    ctx.save();
    ctx.fillStyle = 'rgba(255,30,60,0.22)';
    for (const [x, y] of this._bg){
      ctx.beginPath();
      ctx.arc(x, y, 1.0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = 'rgba(255,30,60,0.10)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < this._bg.length; i += 4){
      const a = this._bg[i];
      const b = this._bg[(i * 7 + 3) % this._bg.length];
      ctx.beginPath();
      ctx.moveTo(a[0], a[1]);
      ctx.lineTo(b[0], b[1]);
      ctx.stroke();
    }
    ctx.restore();

    /* 2. Foreground edges (the glyph's structural mesh). Two passes
          for depth: a soft red underlayer for the bloom, a brighter
          crisp line on top so the silhouette reads sharply. */
    ctx.save();
    ctx.strokeStyle = 'rgba(255,30,60,0.30)';
    ctx.lineWidth = 1.8;
    for (const [i, j] of this._edges){
      const a = this._fg[i], b = this._fg[j];
      ctx.beginPath();
      ctx.moveTo(a[0], a[1]);
      ctx.lineTo(b[0], b[1]);
      ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(255,77,96,0.75)';
    ctx.lineWidth = 0.85;
    for (const [i, j] of this._edges){
      const a = this._fg[i], b = this._fg[j];
      ctx.beginPath();
      ctx.moveTo(a[0], a[1]);
      ctx.lineTo(b[0], b[1]);
      ctx.stroke();
    }
    ctx.restore();

    /* 3. Foreground dots: bright red, with subtle per-node breathing
          alpha so the shape feels alive. */
    ctx.save();
    for (let i = 0; i < this._fg.length; i++){
      const [x, y] = this._fg[i];
      const ph = this._phase[i];
      const a = 0.78 + 0.20 * Math.sin(t * 1.4 + ph);
      ctx.fillStyle = `rgba(255,90,110,${a.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(x, y, 1.9, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    /* 4. A few brighter "hot" pulses on a slow rotating selection of
          points so the eye keeps catching new ones. */
    ctx.save();
    const hotCount = Math.max(4, Math.floor(this._fg.length / 35));
    for (let k = 0; k < hotCount; k++){
      const idx = Math.floor(
        ((Math.sin(t * 0.4 + k * 1.7) + 1) / 2) * this._fg.length,
      ) % this._fg.length;
      const [x, y] = this._fg[idx];
      ctx.fillStyle = 'rgba(255,150,170,1.0)';
      ctx.shadowColor = '#FF1E3C';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(x, y, 2.8, 0, Math.PI * 2);
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
