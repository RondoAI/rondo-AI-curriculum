/* =================================================================
   SUBNET MAGAZINE — BITTENSOR BRAND MARKS (crisp SVG)
   -----------------------------------------------------------------
   Faithful vector recreations of the two official Bittensor brand
   assets — the τ glyph (a chamfered, blocky tau, distinct from the
   thin stroked T we used previously) and the wordmark. Both inherit
   colour from `currentColor` so a parent's `color` tints them.
   ================================================================= */

/**
 * The official-style τ mark — a thick horizontal bar over a
 * vertical stem whose bottom-right is chamfered at ~45°.
 *
 * @param {{ size?: number, color?: string, className?: string }} [opts]
 * @returns {string} an inline <svg> string
 */
export function tauMark(opts = {}){
  const size  = opts.size  ?? 40;
  const color = opts.color ?? 'currentColor';
  const cls   = opts.className ? ` class="${opts.className}"` : '';
  return `<svg${cls} viewBox="0 0 100 100" width="${size}" height="${size}" `
       + `fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bittensor tau">`
       + `<rect x="10" y="22" width="80" height="14" rx="3" ry="3" fill="${color}"/>`
       + `<path d="M 39 36 L 61 36 L 61 72 L 51 82 L 39 82 Z" fill="${color}"/>`
       + `</svg>`;
}

/**
 * The lowercase "biττensor" wordmark — the τ characters are the
 * chamfered glyph from `tauMark`, the rest are set in Archivo at
 * a heavy weight via inline styles so it renders the same way on
 * every page even before the font has finished loading.
 *
 * @param {{ size?: number, color?: string }} [opts]
 * @returns {string} an inline <svg> string
 */
export function bittensorWordmark(opts = {}){
  const size  = opts.size  ?? 28;
  const color = opts.color ?? 'currentColor';
  const fs    = size * 0.86;
  return `<svg viewBox="0 0 320 64" width="${size * 5}" height="${size}" `
       + `xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bittensor">`
       + `<text x="0" y="48" font-family="Archivo, system-ui, sans-serif" `
       + `font-weight="800" font-size="${fs}" letter-spacing="-1" fill="${color}">bi</text>`
       + `<g transform="translate(40,0)"><rect x="2" y="22" width="20" height="6" rx="1" fill="${color}"/>`
       + `<path d="M 11 28 L 17 28 L 17 42 L 14 47 L 11 47 Z" fill="${color}"/></g>`
       + `<g transform="translate(64,0)"><rect x="2" y="22" width="20" height="6" rx="1" fill="${color}"/>`
       + `<path d="M 11 28 L 17 28 L 17 42 L 14 47 L 11 47 Z" fill="${color}"/></g>`
       + `<text x="88" y="48" font-family="Archivo, system-ui, sans-serif" `
       + `font-weight="800" font-size="${fs}" letter-spacing="-1" fill="${color}">ensor</text>`
       + `</svg>`;
}
