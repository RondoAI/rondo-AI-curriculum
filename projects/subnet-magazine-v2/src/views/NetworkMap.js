/* =================================================================
   NETWORK MAP VIEW
   -----------------------------------------------------------------
   Wraps the WorldMap chart in a section with a ranked-hub
   leaderboard sidebar and a network totals strip. The goal is
   information density: the reader leaves the section knowing the
   shape of the network, the top hubs, the regional concentration,
   and the headline numbers.
   ================================================================= */

import { html, mount, qs, raw } from '../lib/dom.js';
import { WorldMap } from '../charts/WorldMap.js';

/* The same hub list as WorldMap.js — keep in sync. */
const HUBS = [
  { code:'FRA', city:'Frankfurt',     country:'DE',     stake:11.2 },
  { code:'SIN', city:'Singapore',     country:'SG',     stake: 8.6 },
  { code:'SFO', city:'San Francisco', country:'US',     stake: 8.4 },
  { code:'LON', city:'London',        country:'UK',     stake: 7.6 },
  { code:'AMS', city:'Amsterdam',     country:'NL',     stake: 6.8 },
  { code:'NYC', city:'New York',      country:'US',     stake: 6.1 },
  { code:'TYO', city:'Tokyo',         country:'JP',     stake: 5.8 },
  { code:'SEL', city:'Seoul',         country:'KR',     stake: 3.4 },
  { code:'BOM', city:'Mumbai',        country:'IN',     stake: 2.6 },
  { code:'HEL', city:'Helsinki',      country:'FI',     stake: 2.4 },
  { code:'YYZ', city:'Toronto',       country:'CA',     stake: 2.4 },
  { code:'SYD', city:'Sydney',        country:'AU',     stake: 1.8 },
  { code:'DXB', city:'Dubai',         country:'AE',     stake: 1.5 },
  { code:'SAO', city:'Sao Paulo',     country:'BR',     stake: 1.2 },
  { code:'MEX', city:'Mexico City',   country:'MX',     stake: 0.9 },
  { code:'CPT', city:'Cape Town',     country:'ZA',     stake: 0.8 },
];

const REGIONS = [
  { name: 'NORTH AMERICA',  validators: 2341, share: 38.2, tao: 2.38 },
  { name: 'EUROPE',         validators: 1872, share: 31.4, tao: 1.96 },
  { name: 'ASIA-PACIFIC',   validators: 1124, share: 18.7, tao: 1.17 },
  { name: 'LATAM',          validators:  421, share:  6.8, tao: 0.42 },
  { name: 'AFRICA',         validators:  236, share:  3.4, tao: 0.21 },
  { name: 'MIDDLE EAST',    validators:  190, share:  1.5, tao: 0.10 },
];

const NETWORK_TOTAL = {
  validators: 6184,
  stakeTao: 6.24,           // millions
  supplyPct: 63,            // % of TAO supply staked
  subnets: 92,
  miners: 32850,
  uptime: 99.94,
  emissionTao: 7200,        // τ minted per day
};

const TOTAL_STAKE = HUBS.reduce((s, h) => s + h.stake, 0);

/**
 * @param {HTMLElement} root
 * @returns {{destroy: () => void}}
 */
export function mountNetworkMap(root){
  const topHubsHtml = HUBS.slice(0, 10).map((h, i) => html`
    <li class="hub">
      <span class="hub__rank">${String(i + 1).padStart(2, '0')}</span>
      <span class="hub__code">${h.code}</span>
      <span class="hub__city">${h.city}<span class="hub__country"> · ${h.country}</span></span>
      <span class="hub__stake">τ ${h.stake.toFixed(1)}M</span>
      <span class="hub__pct">${((h.stake / TOTAL_STAKE) * 100).toFixed(1)}%</span>
      <span class="hub__bar"><i style="width:${(h.stake / HUBS[0].stake) * 100}%"></i></span>
    </li>
  `).join('');

  const regionsHtml = REGIONS.map(r => html`
    <li class="region">
      <span class="region__name">${r.name}</span>
      <span class="region__pct">${r.share.toFixed(1)}%</span>
      <span class="region__bar"><i style="width:${r.share * 2.4}%"></i></span>
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
          <p class="netmap__dek">A global view of the Bittensor consensus surface. Sixteen named hubs hold the bulk of stake. Particles trace each hub back to the rolling consensus head as it walks the equator.</p>
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
            <canvas data-canvas="worldmap" aria-label="World map of Bittensor validator hubs"></canvas>
          </div>
          <div class="panel__foot">
            <span>EQUIRECT · WGS84 · 16 HUBS · HOVER FOR DETAIL</span>
            <span>SRC · taostats (sim)</span>
          </div>
        </div>

        <aside class="netmap__sidebar">
          <div class="panel is-bracketed">
            <div class="panel__head">
              <span class="panel__title">
                <span class="panel__fcode">&lt;012&gt;</span>
                TOP HUBS · STAKE
                <span class="panel__go">&lt;GO&gt;</span>
              </span>
              <span class="panel__meta">
                <span class="panel__pill">τ ${TOTAL_STAKE.toFixed(1)}M</span>
              </span>
            </div>
            <div class="panel__body netmap__side">
              <ul class="hub-list">${raw(topHubsHtml)}</ul>
            </div>
            <div class="panel__foot">
              <span>RANK 1—10 OF 16</span>
              <span>UPDATED 24h</span>
            </div>
          </div>

          <div class="panel is-bracketed">
            <div class="panel__head">
              <span class="panel__title">
                <span class="panel__fcode">&lt;013&gt;</span>
                REGION · SHARE
                <span class="panel__go">&lt;GO&gt;</span>
              </span>
              <span class="panel__meta">
                <span class="panel__pill">N · ${NETWORK_TOTAL.validators.toLocaleString('en-US')}</span>
              </span>
            </div>
            <div class="panel__body netmap__side">
              <ul class="region-list">${raw(regionsHtml)}</ul>
            </div>
            <div class="panel__foot">
              <span>6 REGIONS</span>
              <span>SAMPLED 24h</span>
            </div>
          </div>
        </aside>
      </div>

      <!-- Network totals strip — the hard numbers the reader leaves with. -->
      <div class="netmap__totals">
        <div class="total">
          <span class="total__label">VALIDATORS</span>
          <span class="total__value">${NETWORK_TOTAL.validators.toLocaleString('en-US')}</span>
          <span class="total__sub">root + subnet</span>
        </div>
        <div class="total">
          <span class="total__label">STAKE</span>
          <span class="total__value">τ ${NETWORK_TOTAL.stakeTao.toFixed(2)}M</span>
          <span class="total__sub">${NETWORK_TOTAL.supplyPct}% of supply</span>
        </div>
        <div class="total">
          <span class="total__label">ACTIVE SUBNETS</span>
          <span class="total__value">${NETWORK_TOTAL.subnets}</span>
          <span class="total__sub">May 2026 roster</span>
        </div>
        <div class="total">
          <span class="total__label">MINERS</span>
          <span class="total__value">${NETWORK_TOTAL.miners.toLocaleString('en-US')}</span>
          <span class="total__sub">registered hotkeys</span>
        </div>
        <div class="total">
          <span class="total__label">DAILY EMISSION</span>
          <span class="total__value">τ ${NETWORK_TOTAL.emissionTao.toLocaleString('en-US')}</span>
          <span class="total__sub">~$3.5M / day</span>
        </div>
        <div class="total">
          <span class="total__label">UPTIME</span>
          <span class="total__value">${NETWORK_TOTAL.uptime.toFixed(2)}%</span>
          <span class="total__sub">trailing 90 days</span>
        </div>
      </div>
    </section>
  `);

  const canvas = qs('[data-canvas="worldmap"]', root);
  const chart = canvas ? new WorldMap(canvas) : null;

  return {
    destroy(){ chart?.destroy(); },
  };
}
