/* =================================================================
   NETWORK MAP VIEW
   -----------------------------------------------------------------
   The world map section. Wraps the WorldMap chart in a section with
   a kicker, title, pills, and a region-list sidebar that uses the
   same brand color but communicates with bar fills.
   ================================================================= */

import { html, mount, qs, raw } from '../lib/dom.js';
import { WorldMap } from '../charts/WorldMap.js';

const REGIONS = [
  { name: 'NORTH AMERICA',  validators: 2341, share: 38.2, tao: 2.38 },
  { name: 'EUROPE',         validators: 1872, share: 31.4, tao: 1.96 },
  { name: 'ASIA-PACIFIC',   validators: 1124, share: 18.7, tao: 1.17 },
  { name: 'LATAM',          validators:  421, share:  6.8, tao: 0.42 },
  { name: 'AFRICA',         validators:  236, share:  3.4, tao: 0.21 },
  { name: 'MIDDLE EAST',    validators:  190, share:  1.5, tao: 0.10 },
];

/**
 * @param {HTMLElement} root
 * @returns {{destroy: () => void}}
 */
export function mountNetworkMap(root){
  const regionsHtml = REGIONS.map(r => html`
    <li class="region">
      <span class="region__name">${r.name}</span>
      <span class="region__pct">${r.share.toFixed(1)}%</span>
      <span class="region__bar"><i style="width:${r.share * 2}%"></i></span>
      <span class="region__meta">
        <span>${r.validators.toLocaleString('en-US')} validators</span>
        <span>τ ${r.tao.toFixed(2)}M staked</span>
      </span>
    </li>
  `).join('');

  mount(root, html`
    <section class="netmap" id="netmap" aria-label="Validator network map">
      <div class="netmap__head">
        <div>
          <span class="netmap__kicker"><span class="live-dot"></span>Validator Network · &lt;010&gt;</span>
          <h2 class="netmap__title">Where the validators <em>live.</em></h2>
          <p class="netmap__dek">A global view of the Bittensor consensus surface. Each pulse is a known validator hub; arcs trace each one back to the rolling consensus head.</p>
        </div>
        <div class="netmap__pills">
          <span class="pill">N · 6,184 validators</span>
          <span class="pill">Σ · τ 6.24M stake</span>
          <span class="pill" style="color:var(--c-up)"><span class="live-dot"></span>streaming</span>
        </div>
      </div>
      <div class="netmap__grid">
        <div class="panel is-bracketed">
          <div class="panel__head">
            <span class="panel__title">
              <span class="panel__fcode">&lt;011&gt;</span>
              WORLD · CONSENSUS SURFACE
              <span class="panel__go">&lt;GO&gt;</span>
            </span>
            <span class="panel__meta">
              <span class="panel__pill panel__pill--sim">SIM</span>
            </span>
          </div>
          <div class="panel__body panel__body--pad-0 netmap__viz">
            <canvas data-canvas="worldmap" aria-label="World map of Bittensor validators"></canvas>
          </div>
          <div class="panel__foot">
            <span>EQUIRECT · WGS84 · 14 HUBS</span>
            <span>HOVER FOR DETAIL</span>
          </div>
        </div>
        <aside class="panel is-bracketed">
          <div class="panel__head">
            <span class="panel__title">
              <span class="panel__fcode">&lt;012&gt;</span>
              REGION · STAKE Σ
              <span class="panel__go">&lt;GO&gt;</span>
            </span>
            <span class="panel__meta"><span class="panel__pill">τ 6.24M</span></span>
          </div>
          <div class="panel__body netmap__side">
            <ul class="region-list">${raw(regionsHtml)}</ul>
          </div>
          <div class="panel__foot">
            <span>SAMPLED · 24h</span>
            <span>SRC · taostats</span>
          </div>
        </aside>
      </div>
    </section>
  `);

  const canvas = qs('[data-canvas="worldmap"]', root);
  const chart = canvas ? new WorldMap(canvas) : null;

  return {
    destroy(){ chart?.destroy(); },
  };
}
