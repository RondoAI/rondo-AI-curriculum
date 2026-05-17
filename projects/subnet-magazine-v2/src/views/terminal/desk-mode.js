/* =================================================================
   SUBNET MAGAZINE, DESK MODE (terminal mode)
   -----------------------------------------------------------------
   Composes two existing modules into ONE terminal mode per the
   "Reimagined Architecture" plan:

     - src/views/dashboard/paper-portfolio.js  (the positions book)
     - src/views/dashboard/attribution.js      (Brinson-Fachler
                                                analytics on portfolio)

   The two read as ONE workflow: hold (positions) → measure
   (attribution). Same pattern shipped in the dashboard's MY DESK
   zone, but here it lives inside the terminal's center pane —
   no separate page navigation, no dashboard scrolling chrome.

   Re-mounts when the global terminal selection changes (the shell
   calls our mount fn each time the user picks a different subnet
   on the LEFT rail). Both inner modules are subnet-agnostic at
   their top level — they react to the watchlist + paper portfolio
   global state — so we don't actually wire `ctx.subnet` into them
   here. The global selection still drives the FEED pane on the
   right, which is what the reader uses to navigate while studying
   the desk.

   Tier: paper portfolio is FREE for up to 5 positions; attribution
   is PRO. Both modules render with soft paywall overlays on the
   PRO surface when the future auth flag says tier=free.
   ================================================================= */

import {
  renderPaperPortfolio,
  wirePaperPortfolio,
} from '../dashboard/paper-portfolio.js';
import {
  renderAttribution,
  wireAttribution,
  defaultAttribState,
} from '../dashboard/attribution.js';

const attribState = defaultAttribState();

export function mountDeskMode(root, ctx){
  root.innerHTML = `
    <div class="desk-mode" data-desk-root>
      <header class="desk-mode__head">
        <div>
          <div class="desk-mode__eyebrow">⊕ DESK · positions + analytics</div>
          <h2 class="desk-mode__h">Your book. Measured.</h2>
          <div class="desk-mode__sub">
            Paper portfolio at the top — buy any subnet α at the live mark, P&amp;L vs cost basis.
            Below: Brinson-Fachler attribution decomposes YOUR returns into sector tilt
            (allocation effect) + within-sector picking skill (selection effect). One workflow:
            hold &rarr; measure.
          </div>
        </div>
      </header>

      <div class="desk-mode__paper" data-desk-paper>
        ${renderPaperPortfolio()}
      </div>
      <div class="desk-mode__divider" aria-hidden="true">
        <span class="desk-mode__divider-lbl">↓ ANALYTICS ON YOUR BOOK</span>
      </div>
      <div class="desk-mode__attrib" data-desk-attrib>
        ${renderAttribution(attribState)}
      </div>
    </div>`;

  /* When paper-portfolio mutates (buy/sell/reset), re-render BOTH:
     - the paper panel itself, to reflect the new state
     - the attribution panel, because its PAPER portfolio preset
       depends on the user's actual positions */
  function repaintBoth(){
    const paperEl  = root.querySelector('[data-desk-paper]');
    const attribEl = root.querySelector('[data-desk-attrib]');
    if (paperEl)  paperEl.innerHTML  = renderPaperPortfolio();
    if (attribEl) attribEl.innerHTML = renderAttribution(attribState);
    wirePaperPortfolio(root, repaintBoth);
    wireAttribPanel();
  }
  function wireAttribPanel(){
    wireAttribution(root, attribState, wireAttribPanel);
  }

  wirePaperPortfolio(root, repaintBoth);
  wireAttribPanel();

  return () => { /* no global teardown — handlers live with the
                    DOM and die when the shell re-mounts */ };
}
