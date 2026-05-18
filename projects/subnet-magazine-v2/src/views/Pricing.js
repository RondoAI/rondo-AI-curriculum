/* =================================================================
   SUBNET MAGAZINE, PRICING VIEW — FREE FOR EVERYONE (2026-05-18)
   -----------------------------------------------------------------
   Rewritten per Rondo's directive ("Get rid of pay wall"). The
   previous 3-tier conversion grid (OBSERVER / PRO DESK / INST)
   is gone. This page now says one thing: the magazine is free.

   Kept on the route in case anyone has /pricing.html bookmarked
   from the prior version — the page now honestly explains the
   change rather than 404'ing.
   ================================================================= */

import { html, mount } from '../lib/dom.js';

/* Flat list — every feature, no tiers, no gates. The page reads
   as a feature compendium under one big "Free" claim. */
const FEATURES = [
  { lbl: 'Live markets — all 128 subnets, sortable by anything', icon: '⊕' },
  { lbl: 'Per-subnet charts — 1D / 7D / 30D / 90D / 1Y windows', icon: '⊕' },
  { lbl: 'MA20 + MA50 overlays + news-flag annotations on every chart', icon: '⊕' },
  { lbl: 'Paper portfolio — buy any subnet α at live mark, P&L vs cost', icon: '⊕' },
  { lbl: 'Brinson-Fachler attribution on your positions', icon: '⊕' },
  { lbl: 'Risk screen — Sharpe, vol, β to network, max drawdown', icon: '⊕' },
  { lbl: 'Watchlist — any subnet, any count', icon: '⊕' },
  { lbl: 'Daily briefings — full text, full archive', icon: '⊕' },
  { lbl: 'Oracle research — every dispatch, no preview cap', icon: '⊕' },
  { lbl: 'Inline PDF viewer for all research', icon: '⊕' },
  { lbl: '128 × 128 correlation heatmap (numpy + sklearn → JSON → Canvas)', icon: '⊕' },
  { lbl: 'k-means cluster map + t-SNE behavioral embedding', icon: '⊕' },
  { lbl: 'COMPARE + HIST modals — multi-subnet head-to-head', icon: '⊕' },
  { lbl: '⌘K command palette — verb grammar for power navigation', icon: '⊕' },
  { lbl: 'Editorial alpha back-test on every dispatch', icon: '⊕' },
];

export function mountPricing(root){
  mount(root, html`
    <section class="pricing pricing--free" data-pricing-root>
      <header class="pricing__head pricing__head--free">
        <div class="pricing__eyebrow">⊕ ACCESS · the whole magazine, no gate</div>
        <h1 class="pricing__h">Subneτ Magazine is free.</h1>
        <div class="pricing__sub">
          We previously gated the deeper analytics behind a PRO tier.
          As of May 2026 every feature is open to every reader — the
          paper portfolio, the Brinson-Fachler attribution, the risk
          screen, the full editorial archive, the live correlation
          map, the command palette grammar. All of it.
        </div>
        <div class="pricing__cta-row">
          <a class="pricing-cta pricing-cta--primary" href="terminal.html">OPEN THE TERMINAL ↗</a>
          <a class="pricing-cta pricing-cta--ghost"   href="briefings.html">READ TODAY'S BRIEFING ↗</a>
        </div>
      </header>

      <section class="pricing__features pricing__features--free">
        <h2 class="pricing__features-h">What's included</h2>
        <ul class="pricing__features-list">
          ${FEATURES.map(f => `
            <li class="pricing__features-row">
              <span class="pricing__features-icon" aria-hidden="true">${f.icon}</span>
              <span class="pricing__features-lbl">${f.lbl}</span>
            </li>`).join('')}
        </ul>
      </section>

      <footer class="pricing__foot">
        <div class="pricing__foot-h">The desk still files daily.</div>
        <div class="pricing__foot-sub">
          The magazine's editorial cadence is unchanged — daily briefings,
          rolling Oracle research, image-rich news cards scored for every
          subnet. Free doesn't mean thinner; it means accessible.
        </div>
        <div class="pricing__foot-ctas">
          <a class="pricing-cta pricing-cta--primary" href="terminal.html">OPEN TERMINAL ↗</a>
          <a class="pricing-cta pricing-cta--ghost" href="https://x.com/subnetmagazine" target="_blank" rel="noopener">FOLLOW @subnetmagazine ↗</a>
        </div>
      </footer>
    </section>
  `);

  return () => {};
}
