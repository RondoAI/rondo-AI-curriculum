/* =================================================================
   SUBNET MAGAZINE, GENERATED MARKS
   -----------------------------------------------------------------
   Deterministic, dependency-free identity marks. Every subnet and
   every centralized AI company gets a unique geometric monogram
   derived purely from its name, no image assets, no network calls,
   stable across reloads.

   Two products:
     mark(name, opts)   → an inline SVG string (a node-graph glyph
                          behind the entity's initials, red-on-black)
     seedSeries(name, drift, n)
                        → a deterministic pseudo price series for a
                          sparkline. Shape is real-looking and
                          stable per name; the END direction honors
                          `drift` (the entity's real 24h change) so
                          a viewer scanning a board still reads the
                          trend correctly. It is a synthesized
                          shape, NOT real history, wire a real
                          line-chart endpoint in to replace it.

   Everything here is a pure function. No globals, no side effects.
   ================================================================= */

/* ---------- hashing / PRNG ---------- */

/** FNV-1a 32-bit hash of a string → unsigned int. */
function hash(str){
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++){
    h ^= str.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return h >>> 0;
}

/** Mulberry32, a tiny, fast, seedable PRNG. Returns a () => [0,1). */
function rng(seed){
  let a = seed >>> 0;
  return function(){
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------- initials ---------- */

/**
 * Pull 1–2 display initials from an entity name. "OpenAI" → "OA",
 * "SN64 · Chutes" → "C", "τao" → "T".
 * @param {string} name
 * @returns {string}
 */
export function initials(name){
  const clean = String(name || '')
    .replace(/^SN\d+\s*[·\-, ]?\s*/i, '')   /* drop a leading "SN12 · " */
    .replace(/[^A-Za-z0-9 ]/g, ' ')
    .trim();
  if (!clean) return '?';
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length === 1){
    const w = words[0];
    return (w.length <= 2 ? w : w.slice(0, 2)).toUpperCase();
  }
  return (words[0][0] + words[1][0]).toUpperCase();
}

/* ---------- the mark ---------- */

/**
 * Build an inline SVG identity mark: a procedural node-graph glyph
 * (complete-graph chords between a ring of nodes, the house visual
 * language) with the entity's initials centered on top.
 *
 * @param {string} name
 * @param {{ size?: number, label?: string }} [opts]
 *        size, px square (default 40)
 *        label, override the auto initials
 * @returns {string} an <svg>…</svg> string, safe to inject
 */
export function mark(name, opts = {}){
  const size  = opts.size ?? 40;
  const seed  = hash(String(name || 'subnet'));
  const rand  = rng(seed);
  const label = (opts.label != null ? String(opts.label) : initials(name)).slice(0, 3);

  const cx = 50, cy = 50;
  const nodes = 4 + (seed % 4);              /* 4–7 nodes on the ring */
  const radius = 30 + rand() * 6;
  const rot = rand() * Math.PI * 2;

  const pts = [];
  for (let i = 0; i < nodes; i++){
    const a = rot + (i / nodes) * Math.PI * 2;
    pts.push([cx + Math.cos(a) * radius, cy + Math.sin(a) * radius]);
  }

  /* complete-graph chords, faint */
  let chords = '';
  for (let i = 0; i < nodes; i++){
    for (let j = i + 1; j < nodes; j++){
      chords += `<line x1="${pts[i][0].toFixed(1)}" y1="${pts[i][1].toFixed(1)}" `
              + `x2="${pts[j][0].toFixed(1)}" y2="${pts[j][1].toFixed(1)}" `
              + `stroke="#FF1E3C" stroke-opacity="0.18" stroke-width="1"/>`;
    }
  }
  /* nodes, small red dots */
  let dots = '';
  for (const [x, y] of pts){
    const r = 1.6 + rand() * 1.8;
    dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" `
          + `fill="#FF1E3C" fill-opacity="0.55"/>`;
  }

  const fs = label.length >= 3 ? 26 : label.length === 2 ? 32 : 40;

  return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" `
       + `xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeAttr(name)}">`
       + `<rect width="100" height="100" fill="#0A0306"/>`
       + `<rect x="0.5" y="0.5" width="99" height="99" fill="none" `
       + `stroke="#FF1E3C" stroke-opacity="0.36"/>`
       + chords + dots
       + `<text x="50" y="50" text-anchor="middle" dominant-baseline="central" `
       /* Unquoted "JetBrains Mono, ui-monospace, monospace" so that when this
          SVG gets interpolated into an inline onerror="this.outerHTML='...'"
          attribute (Codex.js, Tickers.js, Home.js all do that fallback
          pattern), the single quotes don't close the outer JS string and
          turn `JetBrains` into an unexpected bare identifier. CSS allows
          space-separated identifiers in font-family unquoted, so this
          parses identically as a CSS value. */
       + `font-family="JetBrains Mono, ui-monospace, monospace" font-weight="600" `
       + `font-size="${fs}" fill="#F5E5E8">${escapeAttr(label)}</text>`
       + `</svg>`;
}

/** A data: URI of the mark, drop straight into an <img src>. */
export function markDataUri(name, opts){
  return 'data:image/svg+xml,' + encodeURIComponent(mark(name, opts));
}

/* ---------- synthesized sparkline series ---------- */

/**
 * Deterministic pseudo price series for a sparkline. Stable per
 * name; the closing leg honors `drift` so the trend reads true.
 * NOTE: synthesized shape, not real history.
 *
 * @param {string} name
 * @param {number} [drift=0]  the real 24h % change, sets end slope
 * @param {number} [n=24]     number of points
 * @returns {number[]}
 */
export function seedSeries(name, drift = 0, n = 24){
  const rand = rng(hash(String(name || 'series')) ^ 0x9e3779b9);
  const out = [];
  let v = 100;
  for (let i = 0; i < n; i++){
    const noise = (rand() - 0.5) * 6;
    const pull  = (drift / n) * 1.2;          /* bias toward the real trend */
    v = Math.max(1, v + noise + pull);
    out.push(v);
  }
  /* normalize so the net move equals `drift` percent */
  const first = out[0];
  const target = first * (1 + drift / 100);
  const last = out[n - 1];
  if (last !== first){
    const k = (target - first) / (last - first);
    for (let i = 0; i < n; i++) out[i] = first + (out[i] - first) * k;
  }
  return out;
}

/* ---------- internal ---------- */

function escapeAttr(v){
  return String(v == null ? '' : v).replace(/[&<>"']/g, ch => (
    {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]
  ));
}
