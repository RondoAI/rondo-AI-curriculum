/* =================================================================
   SUBNET MAGAZINE, TAO LOGO
   -----------------------------------------------------------------
   The Bittensor τ mark, as a clean geometric SVG so it renders
   sharp at any size and inherits colour from its context. Used
   wherever the network is referenced as a mark rather than a word
, the status strip quote, the ticker tape, the masthead.

   Drawn the way the official mark reads: a thin, elegant capital
   "T", a horizontal top bar and a centred vertical stem, rounded
   caps. `currentColor` by default so a parent's `color` tints it.
   ================================================================= */

/**
 * @param {{ size?: number, color?: string, weight?: number, className?: string }} [opts]
 * @returns {string} an inline <svg> string
 */
export function taoLogo(opts = {}){
  const size   = opts.size ?? 18;
  const color  = opts.color ?? 'currentColor';
  const weight = opts.weight ?? 2.2;
  const cls    = opts.className ? ` class="${opts.className}"` : '';
  return `<svg${cls} viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" `
       + `xmlns="http://www.w3.org/2000/svg" role="img" aria-label="TAO">`
       + `<path d="M4 6.2H20M12 6.6V18.4" stroke="${color}" `
       + `stroke-width="${weight}" stroke-linecap="round"/>`
       + `</svg>`;
}

/** data: URI form, for use in an <img src> or CSS background. */
export function taoLogoUri(opts){
  return 'data:image/svg+xml,' + encodeURIComponent(taoLogo(opts));
}
