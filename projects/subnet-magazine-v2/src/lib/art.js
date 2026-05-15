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
  const f = n => n.toFixed(1);
  const pick = arr => arr[Math.floor(r() * arr.length)];

  let defs = '';

  /* ---- soft red blooms for depth ---- */
  let blooms = '';
  const nBlooms = 2 + Math.floor(r() * 2);
  for (let i = 0; i < nBlooms; i++){
    const gx = r() * w, gy = r() * h * 0.7;
    const rad = (0.4 + r() * 0.5) * Math.max(w, h);
    const col = pick(REDS);
    const gid = `${id}b${i}`;
    defs += `<radialGradient id="${gid}" cx="${(gx / w * 100).toFixed(1)}%" cy="${(gy / h * 100).toFixed(1)}%" r="68%">`
          + `<stop offset="0%" stop-color="${col}" stop-opacity="${(0.2 + r() * 0.24).toFixed(2)}"/>`
          + `<stop offset="100%" stop-color="${col}" stop-opacity="0"/></radialGradient>`;
    blooms += `<circle cx="${f(gx)}" cy="${f(gy)}" r="${f(rad)}" fill="url(#${gid})"/>`;
  }

  /* ---- perspective floor grid — the futuristic terminal horizon ---- */
  const horizon = h * (0.34 + r() * 0.12);
  const vpx = w * (0.3 + r() * 0.4);          // vanishing point x
  let grid = `<g stroke="#FF1E3C" fill="none">`;
  for (let i = -6; i <= 6; i++){              // converging verticals
    const bx = w / 2 + (i / 6) * w * 1.4;
    grid += `<line x1="${f(bx)}" y1="${f(h)}" x2="${f(vpx)}" y2="${f(horizon)}" `
          + `stroke-opacity="0.16" stroke-width="0.6"/>`;
  }
  for (let i = 1; i <= 7; i++){               // receding horizontals
    const t = i / 8;
    const y = horizon + Math.pow(t, 1.8) * (h - horizon);
    grid += `<line x1="0" y1="${f(y)}" x2="${w}" y2="${f(y)}" `
          + `stroke-opacity="${(0.05 + t * 0.14).toFixed(2)}" stroke-width="0.6"/>`;
  }
  grid += `<line x1="0" y1="${f(horizon)}" x2="${w}" y2="${f(horizon)}" stroke-opacity="0.30" stroke-width="0.8"/></g>`;

  /* ---- node graph — the neural-net signature, in every banner ---- */
  const nNodes = 9 + Math.floor(r() * 6);
  const nodes = [];
  for (let i = 0; i < nNodes; i++){
    nodes.push({ x: w * (0.08 + r() * 0.84), y: h * (0.12 + r() * 0.62) });
  }
  let edges = '<g stroke="#FF4D60" fill="none" stroke-width="0.7">';
  for (let i = 0; i < nodes.length; i++){
    const a = nodes[i];
    const near = nodes
      .map((b, j) => ({ j, d: (a.x-b.x)**2 + (a.y-b.y)**2 }))
      .filter(o => o.j !== i).sort((u,v) => u.d - v.d).slice(0, 2 + Math.floor(r()*2));
    for (const o of near){
      const b = nodes[o.j];
      edges += `<line x1="${f(a.x)}" y1="${f(a.y)}" x2="${f(b.x)}" y2="${f(b.y)}" stroke-opacity="${(0.14 + r()*0.3).toFixed(2)}"/>`;
    }
  }
  edges += '</g>';
  let dots = '';
  for (const n of nodes){
    const rad = 1.1 + r() * 2.2;
    dots += `<circle cx="${f(n.x)}" cy="${f(n.y)}" r="${f(rad + 2.4)}" fill="#FF1E3C" fill-opacity="0.10"/>`
          + `<circle cx="${f(n.x)}" cy="${f(n.y)}" r="${f(rad)}" fill="${pick(REDS)}" fill-opacity="${(0.5 + r()*0.5).toFixed(2)}"/>`;
  }

  /* ---- HUD corner brackets ---- */
  const bk = Math.min(w, h) * 0.12, pad = 6;
  const bracket = (x, y, sx, sy) =>
    `<path d="M ${f(x + sx*bk)} ${f(y)} L ${f(x)} ${f(y)} L ${f(x)} ${f(y + sy*bk)}" `
    + `fill="none" stroke="#FF7A88" stroke-width="1" stroke-opacity="0.55"/>`;
  const hud = bracket(pad, pad, 1, 1) + bracket(w-pad, pad, -1, 1)
            + bracket(pad, h-pad, 1, -1) + bracket(w-pad, h-pad, -1, -1);

  /* ---- readout ticks along the top edge ---- */
  let ticks = '<g stroke="#FF1E3C" stroke-opacity="0.4" stroke-width="1">';
  const nTicks = Math.floor(w / 14);
  for (let i = 0; i < nTicks; i++){
    const x = 10 + i * 14;
    const tall = i % 4 === 0;
    ticks += `<line x1="${f(x)}" y1="3" x2="${f(x)}" y2="${tall ? 9 : 6}"/>`;
  }
  ticks += '</g>';

  /* ---- one bright scan line ---- */
  const scanY = h * (0.5 + r() * 0.35);
  defs += `<linearGradient id="${id}s" x1="0" y1="0" x2="1" y2="0">`
        + `<stop offset="0%" stop-color="#FF1E3C" stop-opacity="0"/>`
        + `<stop offset="50%" stop-color="#FF8094" stop-opacity="0.7"/>`
        + `<stop offset="100%" stop-color="#FF1E3C" stop-opacity="0"/></linearGradient>`;
  const scan = `<rect x="0" y="${f(scanY)}" width="${w}" height="1.4" fill="url(#${id}s)"/>`;

  /* ---- vignette + scanlines so overlaid text stays readable ---- */
  defs += `<linearGradient id="${id}v" x1="0" y1="0" x2="0" y2="1">`
        + `<stop offset="0%" stop-color="#000" stop-opacity="0.08"/>`
        + `<stop offset="100%" stop-color="#000" stop-opacity="0.66"/></linearGradient>`
        + `<pattern id="${id}sl" width="3" height="3" patternUnits="userSpaceOnUse">`
        + `<rect width="3" height="1" fill="#FF1E3C" fill-opacity="0.05"/></pattern>`;

  return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" `
       + `xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">`
       + `<defs>${defs}</defs>`
       + `<rect width="${w}" height="${h}" fill="#0A0306"/>`
       + blooms + grid + edges + dots + scan
       + `<rect width="${w}" height="${h}" fill="url(#${id}sl)"/>`
       + ticks + hud
       + `<rect width="${w}" height="${h}" fill="url(#${id}v)"/>`
       + `</svg>`;
}
