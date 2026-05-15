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
import { money, pct, deltaClass } from '../lib/format.js';

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
            <a class="hero__btn hero__btn--primary" href="#netmap">OPEN TERMINAL &lt;GO&gt;</a>
            <a class="hero__btn hero__btn--ghost" href="#directory">SUBNET DIRECTORY</a>
          </div>
          <div class="hero__readout">
            <div class="hero__field">
              <span class="lbl">τ / USD</span>
              <span class="val" data-bind="tao-price">—</span>
              <span class="sub" data-bind="tao-delta">—</span>
            </div>
            <div class="hero__field">
              <span class="lbl">VALIDATORS</span>
              <span class="val">6,184</span>
              <span class="sub">63% of supply</span>
            </div>
            <div class="hero__field">
              <span class="lbl">SUBNETS</span>
              <span class="val">92</span>
              <span class="sub">May 2026 roster</span>
            </div>
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
    nodes:   300,
    K:       8,
    edgeCap: 1000,
    chords:  340,
    speed:   0.24,
    packets: 60,
  }) : null;

  /* subscribe to live τ/USD price */
  const priceEl = qs('[data-bind="tao-price"]', root);
  const deltaEl = qs('[data-bind="tao-delta"]', root);
  let unsub = () => {};
  if (dataLayer){
    unsub = dataLayer.subscribe('tao:price', d => {
      if (!d || typeof d.price !== 'number') return;
      if (priceEl) priceEl.textContent = money(d.price);
      if (deltaEl){
        deltaEl.textContent = pct(d.change24 ?? 0);
        deltaEl.classList.remove('up', 'down', 'flat');
        deltaEl.classList.add(deltaClass(d.change24 ?? 0));
      }
    });
  } else if (priceEl){
    priceEl.textContent = money(487.12);
    if (deltaEl){ deltaEl.textContent = '+3.24%'; deltaEl.classList.add('up'); }
  }

  return {
    destroy(){
      sphere?.destroy();
      unsub();
    }
  };
}
