/* =================================================================
   HERO VIEW
   -----------------------------------------------------------------
   The opening section. A full-bleed Icosphere centerpiece behind
   editorial framing: kicker → headline → dek → CTAs and a live
   three-field readout (τ/USD · validators · subnets) anchored
   bottom-right.
   ================================================================= */

import { html, mount, qs } from '../lib/dom.js';
import { NodeSphere } from '../charts/NodeSphere.js';
import { latestBriefing } from '../data/briefings.js';

/* Format an ISO date as "14 MAY 2026" — uppercase month, used in
   the hero kicker. Returns empty string for unparseable input so
   the kicker degrades gracefully if briefings.js loses dates. */
function fmtKickerDate(iso){
  if (!iso) return '';
  const [y, m, d] = String(iso).split('-');
  const MON = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const mi = parseInt(m, 10) - 1;
  if (!y || isNaN(mi) || !d) return '';
  return `${parseInt(d, 10)} ${MON[mi]} ${y}`;
}

/**
 * @param {HTMLElement} root
 * @param {{subscribe: (channel: string, fn: Function) => Function} | null} [dataLayer]
 * @returns {{destroy: () => void}}
 */
export function mountHero(root, dataLayer = null){
  /* Pull the most recent briefing's date so the kicker dateline
     tracks reality instead of decaying to a hardcoded string.
     Falls back to today if no briefing is indexed. */
  const lead = latestBriefing();
  const datelineISO = lead?.date || new Date().toISOString().slice(0, 10);
  const datelineDisplay = fmtKickerDate(datelineISO);

  mount(root, html`
    <section class="hero" id="overview" aria-label="Subnet Magazine, overview">
      <div class="hero__viz" aria-hidden="true">
        <canvas data-canvas="hero"></canvas>
      </div>
      <div class="hero__inner">
        <span class="hero__kicker"><span class="live-dot"></span>Live · last briefing ${datelineDisplay} · the decentralized intelligence desk · free for everyone</span>

        <div class="hero__head">
          <!-- Hero title is the magazine's role-statement, not its
               brand name. The masthead above already carries the
               wordmark "Subneτ Magazine"; the hero leads with what
               the publication actually is. -->
          <h1 class="hero__title">The Bittensor <em>research terminal.</em></h1>

          <!-- The philosophy. Set apart from the descriptive dek so it
               reads as the editorial position, not the product blurb. -->
          <blockquote class="hero__philosophy">
            <span class="hero__philosophy-q">“</span>
            Decentralized intelligence is the most important market of this decade.
            We cover it that way, every subnet a market, every operator a builder,
            every claim provenanced.
            <span class="hero__philosophy-q">”</span>
          </blockquote>

        </div>

        <div class="hero__foot">
          <div class="hero__cta">
            <a class="hero__btn hero__btn--primary" href="terminal.html">OPEN TERMINAL &lt;GO&gt;</a>
            <a class="hero__btn hero__btn--ghost" href="oracle.html">ORACLE RESEARCH</a>
          </div>
        </div>
      </div>
    </section>
  `);

  /* mount the dense node-sphere centerpiece, the bittensor.com
     plexus language: hundreds of nodes, a thick neighbour mesh, and
     heavy packet traffic so the mark reads as a working network. */
  const canvas = qs('[data-canvas="hero"]', root);
  const sphere = canvas ? new NodeSphere(canvas, {
    nodes:   78,
    K:       4,
    density: 0.46,
    speed:   0.2,
  }) : null;

  /* price + validator/subnet readout used to live here, but the
     status bar already shows τ/USD live, no duplicate */

  return {
    destroy(){
      sphere?.destroy();
    }
  };
}
