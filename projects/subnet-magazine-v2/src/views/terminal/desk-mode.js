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

   Tier: paper portfolio + attribution both fully accessible —
   paywall removed per Rondo's 2026-05-18 directive. The
   position-count chip still shows a soft warning when the reader
   passes 5 positions, but only as a "you're managing a meaningful
   book now" cue — no longer a gating action.
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
import {
  loadPaperState, summarize, STARTING_CASH,
} from '../../data/paper-portfolio.js';

const attribState = defaultAttribState();

/* Free-tier paper portfolio is capped at 5 positions per the
   monetization plan in CLAUDE.md. Named here so the stats strip
   can show "n / 5 free" without burying the number. */
const FREE_POSITION_CAP = 5;

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

      <div data-desk-stats>${renderDeskStats()}</div>

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

  /* When paper-portfolio mutates (buy/sell/reset), re-render the
     stats strip AND both inner panels:
       - stats strip reflects the new equity / P&L / position count
       - paper panel reflects the new positions
       - attribution panel re-derives PAPER preset weights from the
         updated positions */
  function repaintAll(){
    const statsEl  = root.querySelector('[data-desk-stats]');
    const paperEl  = root.querySelector('[data-desk-paper]');
    const attribEl = root.querySelector('[data-desk-attrib]');
    if (statsEl)  statsEl.innerHTML  = renderDeskStats();
    if (paperEl)  paperEl.innerHTML  = renderPaperPortfolio();
    if (attribEl) attribEl.innerHTML = renderAttribution(attribState);
    wirePaperPortfolio(root, repaintAll);
    wireAttribPanel();
  }
  function wireAttribPanel(){
    wireAttribution(root, attribState, wireAttribPanel);
  }

  wirePaperPortfolio(root, repaintAll);
  wireAttribPanel();

  return () => { /* no global teardown — handlers live with the
                    DOM and die when the shell re-mounts */ };
}

/* ---------- desk stats strip ----------------------------- */
/* Four chips computed from summarize(loadPaperState()) — the
   reader gets a one-line read of "what's my book worth, am I
   up or down, what moved overnight, where am I on the free
   cap" before scrolling into the positions table.
   Per Signal Taxonomy: decision-grade, not decorative. Empty
   book is honest (zeros + nudge instead of fake values).
   Re-computed on every paper-portfolio mutation. */
function renderDeskStats(){
  const s = summarize(loadPaperState());
  const fmtUSD = v => v == null ? '·' : (v >= 0 ? '$' : '-$') + Math.abs(v).toLocaleString('en-US', { maximumFractionDigits: 0 });
  const fmtPct = v => v == null ? '·' : (v >= 0 ? '+' : '') + v.toFixed(2) + '%';
  const sign   = v => v == null ? 'is-flat' : (v > 0.001 ? 'is-up' : (v < -0.001 ? 'is-down' : 'is-flat'));

  const empty   = s.positionCount === 0;
  const overCap = s.positionCount > FREE_POSITION_CAP;
  const capCls  = overCap ? 'is-down' : (s.positionCount >= FREE_POSITION_CAP ? 'is-warn' : 'is-flat');

  return `
    <div class="desk-mode__stats" role="region" aria-label="Paper portfolio quick stats">
      <div class="desk-mode__stat">
        <span class="desk-mode__stat-lbl">TOTAL EQUITY</span>
        <span class="desk-mode__stat-val">${fmtUSD(s.total)}</span>
        <span class="desk-mode__stat-sub ${sign(s.totalReturnPct)}">
          ${fmtPct(s.totalReturnPct)} <em>since $${STARTING_CASH.toLocaleString('en-US')} start</em>
        </span>
      </div>
      <div class="desk-mode__stat">
        <span class="desk-mode__stat-lbl">UNREALIZED P&amp;L</span>
        <span class="desk-mode__stat-val ${sign(s.pnl)}">${fmtUSD(s.pnl)}</span>
        <span class="desk-mode__stat-sub ${sign(s.pnlPct)}">
          ${fmtPct(s.pnlPct)} <em>vs cost basis</em>
        </span>
      </div>
      <div class="desk-mode__stat">
        <span class="desk-mode__stat-lbl">24H CHANGE</span>
        <span class="desk-mode__stat-val ${sign(s.dayChangeUSD)}">${fmtUSD(s.dayChangeUSD)}</span>
        <span class="desk-mode__stat-sub ${sign(s.dayChangePct)}">
          ${fmtPct(s.dayChangePct)} <em>weighted by position size</em>
        </span>
      </div>
      <div class="desk-mode__stat">
        <span class="desk-mode__stat-lbl">POSITIONS</span>
        <span class="desk-mode__stat-val ${capCls}">${s.positionCount}</span>
        <span class="desk-mode__stat-sub">
          ${empty
            ? '<em>add via the markets table</em>'
            : '<em>cash $' + s.cashUSD.toLocaleString('en-US') + ' available</em>'}
        </span>
      </div>
    </div>`;
}
