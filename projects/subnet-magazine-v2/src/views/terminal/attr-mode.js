/* =================================================================
   SUBNET MAGAZINE, TERMINAL · ATTR MODE
   -----------------------------------------------------------------
   Standalone Brinson-Fachler attribution view per the sibling-
   session REIMAGINE plan: "Extract src/views/dashboard/
   attribution.js into its own mode. Standalone, not nested in DESK."

   This module is a thin terminal wrapper around the existing
   attribution engine (sibling-session, ba2e84d). It composes
   defaultAttribState + renderAttribution + wireAttribution so the
   same panel that lives inside the dashboard's DESK zone also
   appears as a first-class terminal mode the reader can switch to.

   Per the Monetization plan (CLAUDE.md): ATTR is the institutional-
   adjacent surface. The Brinson-Fachler math itself is PRO-tier;
   OBSERVER sees the panel but the controls land paywalled (TODO:
   wire tier check from future auth context).

   Selection contract: ATTR uses the global watchlist (sbn:dashboard:
   watchlist:v1) as its default PORTFOLIO preset, not the global
   ctx.selectedId — attribution is portfolio-level, not subnet-level.
   The reader picks portfolio + benchmark + horizon via the chips
   inside renderAttribution; this mode doesn't impose its own.
   ================================================================= */

import {
  defaultAttribState,
  renderAttribution,
  wireAttribution,
} from '../dashboard/attribution.js';

/**
 * Mount the ATTR mode into the terminal's center pane.
 *
 * @param {HTMLElement} root  the center-pane container
 * @param {{selectedId:number,dataLayer:any,select:Function}} _ctx
 * @returns {()=>void}        destroy callback
 */
export function mountAttrMode(root, _ctx){
  if (!root) return () => {};

  /* The attribution engine is stateful at module scope; reseed for
     each mode mount so swapping back into ATTR starts fresh on the
     current SUBNETS + watchlist snapshot rather than carrying stale
     attribState across mounts. */
  let state = defaultAttribState();

  function repaint(){
    root.innerHTML = wrapInModeChrome(renderAttribution(state));
    /* wireAttribution attaches click handlers to the chips +
       row interactions inside the panel. Pass repaint so chip
       changes recompute + re-render. */
    const panel = root.querySelector('[data-attrib-root]');
    if (panel) wireAttribution(panel, state, repaint);
  }

  repaint();

  return () => {};
}

/**
 * Add a thin mode header above the attribution panel so the reader
 * knows what mode they're in (the terminal's center-head shows the
 * label, but this header carries the institutional context that
 * the panel itself doesn't repeat).
 */
function wrapInModeChrome(panelHtml){
  return `
    <div class="term-attr">
      <header class="term-attr__head">
        <span class="term-attr__kicker"><span class="term-attr__dot"></span>ATTR · PORT-STYLE ATTRIBUTION · BRINSON-FACHLER DECOMPOSITION</span>
        <span class="term-attr__hint">
          Where did the alpha come from? Allocation = sector tilt vs. benchmark · Selection = pick quality within sector ·
          Active Return = Allocation + Selection (no Interaction leftover).
        </span>
      </header>
      <div class="term-attr__panel">
        ${panelHtml}
      </div>
      <footer class="term-attr__foot">
        <span>Recompute on every chip change · TAO-base shows α excess return over τ · PORTFOLIO defaults to your watchlist</span>
        <span class="term-attr__brand">⌘ ATTR · INSTITUTIONAL</span>
      </footer>
    </div>
  `;
}
