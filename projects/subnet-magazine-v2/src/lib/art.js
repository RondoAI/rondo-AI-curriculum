/* =================================================================
   SUBNET MAGAZINE — GENERATIVE CARD ART
   -----------------------------------------------------------------
   Deterministic abstract art for news / reading cards. No image
   assets — every banner is an SVG generated from a seed string, so
   it is unique per item, stable across reloads, and free.

   The vocabulary is intentionally more painterly than the node-
   graph mark: layered translucent blooms, flowing bezier ribbons,
   a drifting particle field. Red-on-black, tokens echoed as
   literals (this returns a standalone SVG string).

   cardArt(seed, opts) → an <svg>…</svg> string, safe to inject.
     opts.w / opts.h   viewBox size (default 320 × 200)
     opts.variant      a string bucket (e.g. category) that nudges
                       the palette + composition so families of
                       cards feel related
   ================================================================= */

/* ---------- hashing / PRNG (self-contained) ---------- */

function hash(str){
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++){
    h ^= str.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return h >>> 0;
}
function rng(seed){
  let a = seed >>> 0;
  return function(){
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* The house palette — every variant draws from these reds. */
const REDS = ['#FF1E3C', '#FF4D60', '#FF7A88', '#C11128', '#8B0F20'];

/**
 * @param {string} seed
 * @param {{ w?: number, h?: number, variant?: string }} [opts]
 * @returns {string}
 */
export function cardArt(seed, opts = {}){
  const w = opts.w ?? 320;
  const h = opts.h ?? 200;
  const variant = opts.variant || '';
  const r = rng(hash(String(seed) + '|' + variant));
  const id = 'a' + (hash(seed + variant) % 1e6);

  const pick = arr => arr[Math.floor(r() * arr.length)];

  /* ---- blooms: 2–3 big soft radial gradients ---- */
  let defs = '';
  let blooms = '';
  const nBlooms = 2 + Math.floor(r() * 2);
  for (let i = 0; i < nBlooms; i++){
    const gx = r() * w, gy = r() * h;
    const rad = (0.35 + r() * 0.5) * Math.max(w, h);
    const col = pick(REDS);
    const gid = `${id}b${i}`;
    defs += `<radialGradient id="${gid}" cx="${(gx / w * 100).toFixed(1)}%" cy="${(gy / h * 100).toFixed(1)}%" r="65%">`
          + `<stop offset="0%" stop-color="${col}" stop-opacity="${(0.22 + r() * 0.28).toFixed(2)}"/>`
          + `<stop offset="100%" stop-color="${col}" stop-opacity="0"/></radialGradient>`;
    blooms += `<circle cx="${gx.toFixed(1)}" cy="${gy.toFixed(1)}" r="${rad.toFixed(1)}" fill="url(#${gid})"/>`;
  }

  /* ---- ribbons: flowing bezier strokes ---- */
  let ribbons = '';
  const nRibbons = 3 + Math.floor(r() * 4);
  for (let i = 0; i < nRibbons; i++){
    const y0 = r() * h;
    const x1 = w * (0.2 + r() * 0.2), y1 = r() * h;
    const x2 = w * (0.5 + r() * 0.2), y2 = r() * h;
    const y3 = r() * h;
    const sw = (0.6 + r() * 1.8).toFixed(2);
    const op = (0.10 + r() * 0.34).toFixed(2);
    ribbons += `<path d="M0 ${y0.toFixed(1)} C ${x1.toFixed(1)} ${y1.toFixed(1)}, `
             + `${x2.toFixed(1)} ${y2.toFixed(1)}, ${w} ${y3.toFixed(1)}" `
             + `fill="none" stroke="${pick(REDS)}" stroke-width="${sw}" stroke-opacity="${op}"/>`;
  }

  /* ---- particle field ---- */
  let dots = '';
  const nDots = 14 + Math.floor(r() * 22);
  for (let i = 0; i < nDots; i++){
    dots += `<circle cx="${(r() * w).toFixed(1)}" cy="${(r() * h).toFixed(1)}" `
          + `r="${(0.5 + r() * 1.9).toFixed(2)}" fill="${pick(REDS)}" `
          + `fill-opacity="${(0.25 + r() * 0.5).toFixed(2)}"/>`;
  }

  /* ---- one bold arc or ring for a focal element ---- */
  let focal = '';
  if (r() > 0.35){
    const cx = w * (0.55 + r() * 0.4), cy = h * (0.2 + r() * 0.6);
    const rad = (0.18 + r() * 0.3) * Math.min(w, h);
    focal = `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${rad.toFixed(1)}" `
          + `fill="none" stroke="${pick(REDS)}" stroke-width="${(0.8 + r() * 1.6).toFixed(2)}" `
          + `stroke-opacity="${(0.2 + r() * 0.3).toFixed(2)}"/>`;
  }

  /* faint vignette so overlaid text stays readable */
  defs += `<linearGradient id="${id}v" x1="0" y1="0" x2="0" y2="1">`
        + `<stop offset="0%" stop-color="#000" stop-opacity="0.05"/>`
        + `<stop offset="100%" stop-color="#000" stop-opacity="0.62"/></linearGradient>`;

  return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" `
       + `xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">`
       + `<defs>${defs}</defs>`
       + `<rect width="${w}" height="${h}" fill="#0A0306"/>`
       + blooms + ribbons + focal + dots
       + `<rect width="${w}" height="${h}" fill="url(#${id}v)"/>`
       + `</svg>`;
}
