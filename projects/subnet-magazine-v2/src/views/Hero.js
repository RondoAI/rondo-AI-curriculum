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
        <span class="hero__kicker"><span class="live-dot"></span>Volume 02 · Issue 01 · &lt;000&gt;</span>

        <div class="hero__head">
          <h1 class="hero__title">A research terminal for <em>decentralized intelligence.</em></h1>
          <p class="hero__dek">
            Live coverage of the Bittensor network — 92 subnets, 6,184 validators,
            32,850 miners — and the broader frontier-AI desk. Every chart on this
            page reads off the same wire your validators are watching.
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
