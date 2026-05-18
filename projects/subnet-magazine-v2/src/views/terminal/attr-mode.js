/* =================================================================
   SUBNET MAGAZINE, ATTR MODE (terminal mode)
   -----------------------------------------------------------------
   Standalone attribution surface — Brinson-Fachler decomposition
   on whichever portfolio preset the reader picks (paper / watchlist /
   top-10-emission / top-20-mcap / all). Distinct from DESK mode
   (which composes paper + attribution) by NOT requiring paper
   positions — useful for "what would the network rotation have
   done to a hypothetical book?"

   Tier: FREE for the default preset (top-10-emission), PRO to
   switch presets to your own watchlist / paper portfolio.
   ================================================================= */

import {
  renderAttribution,
  wireAttribution,
  defaultAttribState,
} from '../dashboard/attribution.js';

const attribState = defaultAttribState();

export function mountAttrMode(root, ctx){
  root.innerHTML = `
    <div class="attr-mode" data-attr-root>
      <header class="attr-mode__head">
        <div>
          <div class="attr-mode__eyebrow">⊕ ATTR · Brinson-Fachler</div>
          <h2 class="attr-mode__h">Where did the alpha come from?</h2>
          <div class="attr-mode__sub">
            Active return decomposed into ALLOCATION effect (sector tilt) +
            SELECTION effect (within-sector picking skill). Pick a portfolio
            and benchmark above — the math recomputes live.
          </div>
        </div>
      </header>
      <div class="attr-mode__body" data-attr-body>
        ${renderAttribution(attribState)}
      </div>
    </div>`;

  function wireAttribPanel(){
    wireAttribution(root, attribState, wireAttribPanel);
  }
  wireAttribPanel();

  return () => {};
}
