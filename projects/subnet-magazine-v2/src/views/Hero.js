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

/**
 * @param {HTMLElement} root
 * @param {{subscribe: (channel: string, fn: Function) => Function} | null} [dataLayer]
 * @returns {{destroy: () => void}}
 */
export function mountHero(root, dataLayer = null){
  mount(root, html`
    <section class="hero" id="overview" aria-label="Subnet Magazine — overview">
      <div class="hero__viz" aria-hidden="true">
        <canvas data-canvas="hero"></canvas>
      </div>
      <div class="hero__inner">
        <span class="hero__kicker"><span class="live-dot"></span>Volume 02 · Issue 01 · 14 May 2026 · the decentralized intelligence desk</span>

        <div class="hero__head">
          <h1 class="hero__title">Subne<span class="tau">τ</span> Magazine</h1>
          <p class="hero__subtitle">A Bittensor <em>subnet review.</em></p>

          <!-- The philosophy. Set apart from the descriptive dek so it
               reads as the editorial position, not the product blurb. -->
          <blockquote class="hero__philosophy">
            <span class="hero__philosophy-q">“</span>
            Decentralized intelligence is the most important market of this decade.
            We cover it that way — every subnet a market, every operator a builder,
            every claim provenanced.
            <span class="hero__philosophy-q">”</span>
          </blockquote>

          <p class="hero__dek">
            The reading-room the open AI economy was missing. Live network state, the
            Yuma loop drawn end-to-end, twenty-five operators profiled, the math shown.
            Built for the funds deciding where the next billion of compute goes, and the
            agents they delegate to.
          </p>
        </div>

        <div class="hero__foot">
          <div class="hero__cta">
            <a class="hero__btn hero__btn--primary" href="terminal.html">OPEN TERMINAL &lt;GO&gt;</a>
            <a class="hero__btn hero__btn--ghost" href="subnets.html">SUBNET DIRECTORY</a>
          </div>
        </div>
      </div>
    </section>
  `);

  /* mount the dense node-sphere centerpiece — the bittensor.com
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
     status bar already shows τ/USD live — no duplicate */

  return {
    destroy(){
      sphere?.destroy();
    }
  };
}
