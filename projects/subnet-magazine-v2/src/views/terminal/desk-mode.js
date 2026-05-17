/* =================================================================
   SUBNET MAGAZINE, TERMINAL · DESK MODE
   -----------------------------------------------------------------
   "Paper portfolio + Brinson-Fachler attribution running on your
   actual positions" per the sibling-session REIMAGINE plan.

   Composes the two existing sibling-session modules:
     src/views/dashboard/paper-portfolio.js  (positions + P&L)
     src/views/dashboard/attribution.js      (Brinson-Fachler decomp)

   Layout: paper portfolio on top (positions table + KPIs), then
   the attribution panel below (decomposes the return into
   allocation + selection effects). When the user changes positions
   in the portfolio, the attribution recomputes — the two views
   are bound by the global localStorage paper state, so a re-render
   of attribution after any portfolio change picks up the new
   weights automatically.

   Selection: DESK uses ctx.selectedId only as a "default for the
   BUY input" inside paper portfolio (which the panel handles
   internally). The attribution panel uses its own PORTFOLIO
   preset chip set (PAPER / WATCHLIST / TOP10EM / TOP20MCAP / ALL).

   PRO tier per Monetization plan: paper portfolio CLOUD-SYNCED +
   attribution are PRO features. OBSERVER sees the empty-state
   teaser (the modules handle that themselves today; future auth
   wires the gate). Honest about the tier without blocking the
   click.
   ================================================================= */

import {
  renderPaperPortfolio,
  wirePaperPortfolio,
} from '../dashboard/paper-portfolio.js';
import {
  defaultAttribState,
  renderAttribution,
  wireAttribution,
} from '../dashboard/attribution.js';

/**
 * Mount the DESK mode into the terminal's center pane.
 *
 * @param {HTMLElement} root  the center-pane container
 * @param {{selectedId:number,dataLayer:any,select:Function}} _ctx
 * @returns {()=>void}        destroy callback
 */
export function mountDeskMode(root, _ctx){
  if (!root) return () => {};

  /* Attribution state lives in the closure so the two halves
     share the same recompute trigger. */
  let attribState = defaultAttribState();

  function repaintAll(){
    root.innerHTML = `
      <section class="term-desk">
        <header class="term-desk__head">
          <span class="term-desk__kicker"><span class="term-desk__dot"></span>DESK · paper portfolio + brinson-fachler attribution</span>
          <span class="term-desk__hint">
            Buy any subnet α at the current mark · track P&amp;L vs cost basis · attribution decomposes the active return
            into allocation (sector tilt) + selection (pick quality) effects. Both panels read/write the same
            localStorage paper state, so any trade re-flows the attribution below.
          </span>
        </header>

        <div class="term-desk__portfolio" data-desk-portfolio>
          ${renderPaperPortfolio()}
        </div>

        <div class="term-desk__attribution" data-desk-attribution>
          ${renderAttribution(attribState)}
        </div>

        <footer class="term-desk__foot">
          <span>PRO · cloud-synced positions across devices + per-position attribution coming with auth</span>
          <span class="term-desk__brand">⌘ DESK · YOUR POSITIONS</span>
        </footer>
      </section>
    `;

    /* Wire both panels. Paper portfolio re-renders the whole DESK
       on any change so attribution picks up the new positions.
       Attribution re-renders only its own panel on chip changes
       (its own state). */
    const portfolio = root.querySelector('[data-desk-portfolio]');
    if (portfolio){
      wirePaperPortfolio(portfolio, () => {
        /* Position changed — full repaint so attribution recomputes
           against the new weights. */
        repaintAll();
      });
    }
    const attribution = root.querySelector('[data-desk-attribution] [data-attrib-root]');
    if (attribution){
      wireAttribution(attribution, attribState, () => {
        /* Attribution chip changed — re-render just that half so we
           don't lose portfolio scroll state. */
        const att = root.querySelector('[data-desk-attribution]');
        if (att) att.innerHTML = renderAttribution(attribState);
        const inner = root.querySelector('[data-desk-attribution] [data-attrib-root]');
        if (inner) wireAttribution(inner, attribState, repaintAll);
      });
    }
  }

  repaintAll();

  return () => {};
}
