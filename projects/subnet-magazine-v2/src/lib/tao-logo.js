/* =================================================================
   SUBNET MAGAZINE — TAO LOGO
   -----------------------------------------------------------------
   The Bittensor τ mark, as a clean geometric SVG so it renders
   sharp at any size and inherits colour from its context. Used
   wherever the network is referenced as a mark rather than a word
   — the status strip quote, the ticker tape, the masthead.

   `currentColor` by default, so `color: var(--c-red)` on a parent
   tints it; pass an explicit colour to override.
   ================================================================= */

/**
 * @param {{ size?: number, color?: string, className?: string }} [opts]
 * @returns {string} an inline <svg> string
 */
export function taoLogo(opts = {}){
  const size  = opts.size ?? 18;
  const color = opts.color ?? 'currentColor';
  const cls   = opts.className ? ` class="${opts.className}"` : '';
  /* a refined tau: full top bar, centred stem, the foot curving
     right the way the Greek τ does — drawn as one path. */
  return `<svg${cls} viewBox="0 0 32 32" width="${size}" height="${size}" `
       + `xmlns="http://www.w3.org/2000/svg" role="img" aria-label="TAO">`
       + `<path fill="${color}" d="M3.6 6.4h24.8v4.5H18.6v11.4c0 2.2 1.3 3.4 3.6 3.4 `
       + `1 0 1.9-.2 2.7-.6l-.5 4.1c-1 .4-2.2.6-3.4.6-4.8 0-7.4-2.6-7.4-7.2V10.9H3.6z"/>`
       + `</svg>`;
}

/** data: URI form, for use in an <img src> or CSS background. */
export function taoLogoUri(opts){
  return 'data:image/svg+xml,' + encodeURIComponent(taoLogo(opts));
}
