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
import { compact } from '../lib/format.js';
import { WorldGlobe } from '../charts/WorldGlobe.js';
import { SUBNETS } from '../data/subnets.js';
import { catColor, catLabel } from '../data/categories.js';

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

/* ----- Activity feed action types ----- */
const ACTIONS = [
  { code: 'STAKE',    desc: 'stake added',       w: 18, amount: () => randAmount(80, 4_800)   },
  { code: 'UNSTAKE',  desc: 'stake removed',     w:  8, amount: () => randAmount(40, 1_400)   },
  { code: 'EMIT',     desc: 'epoch emission',    w: 12, amount: () => randAmount(20, 800)     },
  { code: 'REGISTER', desc: 'miner registered',  w:  6, amount: () => null                    },
  { code: 'WEIGHT',   desc: 'validator weights', w: 10, amount: () => null                    },
  { code: 'BURN',     desc: 'reg burn',          w:  5, amount: () => randAmount(8, 120)      },
  { code: 'CHILDKEY', desc: 'childkey set',      w:  3, amount: () => null                    },
];
const ACTION_TOTAL = ACTIONS.reduce((a, x) => a + x.w, 0);
function pickAction(){
  let r = Math.random() * ACTION_TOTAL;
  for (const a of ACTIONS){ r -= a.w; if (r <= 0) return a; }
  return ACTIONS[0];
}
function randAmount(min, max){ return min + Math.random() * (max - min); }

const HUB_CODES = ['SFO','NYC','YYZ','MEX','SAO','LON','FRA','AMS','HEL','CPT','BOM','DXB','SIN','SEL','TYO','SYD'];

function zStamp(date = new Date()){
  const z = x => String(x).padStart(2, '0');
  return `${z(date.getUTCHours())}:${z(date.getUTCMinutes())}:${z(date.getUTCSeconds())}`;
}

/**
 * @param {HTMLElement} root
 * @param {{subscribe: (channel: string, fn: Function) => Function} | null} [dataLayer]
 * @returns {{destroy: () => void}}
 */
export function mountNetworkMap(root, dataLayer = null){
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
          <span class="pill" data-bind="pill-vals">N · 6,184 validators</span>
          <span class="pill" data-bind="pill-stake">Σ · τ 6.24M stake</span>
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

      <!-- Network health row — live operational metrics. -->
      <div class="netmap__health">
        <div class="health">
          <span class="health__label">TPS</span>
          <span class="health__value" data-bind="tps">2,147</span>
          <span class="health__spark"><i style="width:74%"></i></span>
        </div>
        <div class="health">
          <span class="health__label">MEMPOOL</span>
          <span class="health__value" data-bind="mempool">412</span>
          <span class="health__sub">pending tx</span>
        </div>
        <div class="health">
          <span class="health__label">VAL PARTICIPATION</span>
          <span class="health__value" data-bind="vp">96.4%</span>
          <span class="health__spark"><i style="width:96.4%"></i></span>
        </div>
        <div class="health">
          <span class="health__label">BLOCK TIME</span>
          <span class="health__value">12.0s</span>
          <span class="health__sub">target</span>
        </div>
        <div class="health">
          <span class="health__label">PROP LATENCY</span>
          <span class="health__value">186ms</span>
          <span class="health__sub">P50 global</span>
        </div>
        <div class="health">
          <span class="health__label">CONCENTRATION</span>
          <span class="health__value">0.41</span>
          <span class="health__sub">Gini, top hotkeys</span>
        </div>
      </div>

      <!-- Live activity stream — Bloomberg-style scrolling feed. -->
      <div class="panel is-bracketed netmap__feed">
        <div class="panel__head">
          <span class="panel__title">
            <span class="panel__fcode">&lt;014&gt;</span>
            LIVE ACTIVITY · ON-CHAIN
            <span class="panel__go">&lt;GO&gt;</span>
          </span>
          <span class="panel__meta">
            <span class="panel__pill panel__pill--live"><span class="live-dot"></span>STREAMING</span>
          </span>
        </div>
        <div class="panel__body panel__body--pad-0">
          <ul class="activity-list" id="activity-list" aria-live="polite"></ul>
        </div>
        <div class="panel__foot">
          <span>STAKE · UNSTAKE · EMIT · REGISTER · WEIGHT · BURN</span>
          <span>SIM · BLOCK <span data-bind="block-foot">4,812,047</span></span>
        </div>
      </div>

      <!-- Network totals strip — the hard numbers the reader leaves with. -->
      <div class="netmap__totals">
        <div class="total">
          <span class="total__label">VALIDATORS</span>
          <span class="total__value" data-bind="tot-vals">${NETWORK_TOTAL.validators.toLocaleString('en-US')}</span>
          <span class="total__sub">root + subnet</span>
        </div>
        <div class="total">
          <span class="total__label">STAKE</span>
          <span class="total__value" data-bind="tot-stake">τ ${NETWORK_TOTAL.stakeTao.toFixed(2)}M</span>
          <span class="total__sub">${NETWORK_TOTAL.supplyPct}% of supply</span>
        </div>
        <div class="total">
          <span class="total__label">ACTIVE SUBNETS</span>
          <span class="total__value" data-bind="tot-subnets">${NETWORK_TOTAL.subnets}</span>
          <span class="total__sub">live roster</span>
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
  const chart = canvas ? new WorldGlobe(canvas) : null;

  /* ----- Live state simulation: block, epoch, TPS, VP, mempool ----- */
  const state = {
    block:       4_812_047,
    epoch:       14_302,
    epochBlock:  268,
    tps:         2_147,
    vp:          96.4,
    mempool:     412,
    emissionDay: 7_200,
  };
  const tpsEl     = qs('[data-bind="tps"]',     root);
  const vpEl      = qs('[data-bind="vp"]',      root);
  const memEl     = qs('[data-bind="mempool"]', root);
  const blockFoot = qs('[data-bind="block-foot"]', root);

  function syncOverlay(){
    chart?.setStatus(state);
    if (tpsEl)     tpsEl.textContent     = state.tps.toLocaleString('en-US');
    if (vpEl)      vpEl.textContent      = `${state.vp.toFixed(1)}%`;
    if (memEl)     memEl.textContent     = state.mempool.toLocaleString('en-US');
    if (blockFoot) blockFoot.textContent = state.block.toLocaleString('en-US');
  }
  syncOverlay();

  /* simulated block production — overwritten the moment live data
     arrives via DataLayer's 'tao:block' channel. */
  const blockTimer = setInterval(() => {
    state.block += 1;
    state.epochBlock += 1;
    if (state.epochBlock >= 360){
      state.epochBlock = 0;
      state.epoch += 1;
    }
    /* gentle wobble on operational metrics */
    state.tps = Math.max(800, Math.min(4_200, state.tps + (Math.random() - .5) * 120 | 0));
    state.vp  = Math.max(88, Math.min(99.4, +(state.vp + (Math.random() - .5) * 0.3).toFixed(2)));
    state.mempool = Math.max(40, Math.min(1_800, state.mempool + (Math.random() - .5) * 60 | 0));
    syncOverlay();
  }, 1500);

  let blockUnsub = () => {};
  if (dataLayer){
    blockUnsub = dataLayer.subscribe('tao:block', (d) => {
      if (d && typeof d.height === 'number'){
        state.block = d.height;
        syncOverlay();
      }
    });
  }

  /* ----- Live activity stream ----- */
  const feed = qs('#activity-list', root);
  const MAX_ROWS = 14;

  function pushRow(){
    if (!feed) return;
    const action = pickAction();
    const subnet = SUBNETS[Math.floor(Math.random() * SUBNETS.length)];
    const hub = HUB_CODES[Math.floor(Math.random() * HUB_CODES.length)];
    const amt = action.amount();
    const li = document.createElement('li');
    li.className = 'activity is-new';
    const amtStr = amt == null ? '' : `<span class="activity__amt">τ ${amt.toLocaleString('en-US', { maximumFractionDigits: 1 })}</span>`;
    li.innerHTML = `
      <span class="activity__ts">${zStamp()}</span>
      <span class="activity__action" data-action="${action.code}">${action.code}</span>
      <span class="activity__subject">
        <span class="activity__net">SN${subnet.netuid}</span>
        <span class="activity__name">${subnet.name}</span>
        <span class="activity__cat" style="color:${catColor(subnet.cat)}">${catLabel(subnet.cat)}</span>
      </span>
      ${amtStr}
      <span class="activity__hub">${hub}</span>
    `;
    feed.prepend(li);
    while (feed.children.length > MAX_ROWS) feed.lastElementChild.remove();
    /* clear the flash class after the animation completes */
    requestAnimationFrame(() => requestAnimationFrame(() => li.classList.remove('is-new')));
  }
  for (let i = 0; i < 8; i++) pushRow();
  const feedTimer = setInterval(pushRow, 1100);

  /* ----- live network totals: tao:chain + tao:subnets + tao:validators ----- */
  const pillVals   = qs('[data-bind="pill-vals"]',   root);
  const pillStake  = qs('[data-bind="pill-stake"]',  root);
  const totVals    = qs('[data-bind="tot-vals"]',    root);
  const totStake   = qs('[data-bind="tot-stake"]',   root);
  const totSubnets = qs('[data-bind="tot-subnets"]', root);
  function applyChain(d){
    if (!d || d.totalStaked == null) return;
    /* TMC may report staked τ as a raw count or already in millions */
    const txt = 'τ ' + (d.totalStaked >= 1000 ? compact(d.totalStaked) : d.totalStaked.toFixed(2) + 'M');
    if (pillStake) pillStake.textContent = `Σ · ${txt} stake`;
    if (totStake)  totStake.textContent  = txt;
  }
  function applySubnets(list){
    if (!Array.isArray(list) || !list.length) return;
    if (totSubnets) totSubnets.textContent = String(list.length);
  }
  function applyValidators(list){
    if (!Array.isArray(list) || !list.length) return;
    const n = list.length.toLocaleString('en-US');
    if (pillVals) pillVals.textContent = `N · ${n} validators`;
    if (totVals)  totVals.textContent  = n;
  }
  let chainUnsub = () => {}, subnetsUnsub = () => {}, valsUnsub = () => {};
  if (dataLayer){
    chainUnsub   = dataLayer.subscribe('tao:chain',      applyChain);
    subnetsUnsub = dataLayer.subscribe('tao:subnets',    applySubnets);
    valsUnsub    = dataLayer.subscribe('tao:validators', applyValidators);
    if (dataLayer.get){
      applyChain(dataLayer.get('tao:chain'));
      applySubnets(dataLayer.get('tao:subnets'));
      applyValidators(dataLayer.get('tao:validators'));
    }
  }

  return {
    destroy(){
      chart?.destroy();
      clearInterval(blockTimer);
      clearInterval(feedTimer);
      blockUnsub();
      chainUnsub();
      subnetsUnsub();
      valsUnsub();
    },
  };
}
