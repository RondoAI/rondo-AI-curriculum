/* =================================================================
   SUBNET MAGAZINE — TICKER BAR
   -----------------------------------------------------------------
   The two marquee tapes that sit at the very top of every page:

     1. Bittensor — live from the 'tao:subnets' feed: subnet logo /
        generated mark, netuid, α-price, 24h change. Each chip links
        to that subnet's page.
     2. Central players — the top centralized AI companies ranked by
        valuation, with their ticker symbol (real exchange symbol
        when listed, ".PVT" when private).

   Both loop seamlessly (content duplicated), pause on hover, and
   respect prefers-reduced-motion.
   ================================================================= */

import { html, mount, qs } from '../lib/dom.js';
import { money, pct } from '../lib/format.js';
import { mark } from '../lib/mark.js';
import { CENTRALIZED_PLAYERS, ASIAN_REGIONS, tickerFor } from '../data/centralized.js';

/** Parse "$340B" / "$1.6T (parent)" → number, for ranking. */
function parseVal(v){
  const m = String(v || '').match(/\$?\s*([\d.]+)\s*([TBM])/i);
  if (!m) return 0;
  return parseFloat(m[1]) * ({ t:1e12, b:1e9, m:1e6 }[m[2].toLowerCase()] || 1);
}

/** Static central-players chips (duplicated for a seamless loop). */
function centralTickerHtml(){
  const players = CENTRALIZED_PLAYERS
    .map(p => ({ ...p, _v: parseVal(p.valuation) }))
    .sort((a, b) => b._v - a._v)
    .slice(0, 28);
  const chip = p => {
    const tk = tickerFor(p);
    return `
    <span class="tick tick--${ASIAN_REGIONS.has(p.region) ? 'asia' : 'west'}">
      <span class="tick__mark">${mark(p.name, { size: 16 })}</span>
      <span class="tick__sym ${tk.isPrivate ? 'is-pvt' : ''}">${tk.symbol}</span>
      <span class="tick__name">${p.name}</span>
      <span class="tick__val">${p.valuation}</span>
    </span>`;
  };
  const once = players.map(chip).join('');
  return once + once;
}

/**
 * @param {HTMLElement} root
 * @param {{subscribe:Function, get:Function}|null} [dataLayer]
 */
export function mountTickers(root, dataLayer = null){
  mount(root, html`
    <section class="tickerbar" aria-label="Live market tickers">
      <div class="ticker">
        <span class="ticker__tag"><span class="live-dot"></span>Bittensor</span>
        <div class="ticker__viewport">
          <div class="ticker__track" id="ticker-eco">
            <span class="ticker__loading">loading live subnets…</span>
          </div>
        </div>
      </div>
      <div class="ticker">
        <span class="ticker__tag ticker__tag--alt">Central players</span>
        <div class="ticker__viewport">
          <div class="ticker__track ticker__track--rev">${centralTickerHtml()}</div>
        </div>
      </div>
    </section>
  `);

  const ecoTrack = qs('#ticker-eco', root);
  function renderEco(list){
    if (!ecoTrack || !Array.isArray(list) || !list.length) return;
    const top = list.slice(0, 24);
    const chip = s => {
      const up = (s.chg24 ?? 0) >= 0;
      const logo = s.logo
        ? `<img class="tick__logo" src="${s.logo}" alt="" loading="lazy" onerror="this.replaceWith(document.createTextNode(''))">`
        : `<span class="tick__mark">${mark(s.name, { size: 16 })}</span>`;
      const price = s.price < 1 ? '$' + s.price.toFixed(4) : money(s.price);
      return `
        <a class="tick" href="subnet.html?id=${s.netuid}">
          ${logo}
          <span class="tick__sym">SN${s.netuid}</span>
          <span class="tick__val">${price}</span>
          <span class="tick__chg ${up ? 'up' : 'down'}">${pct(s.chg24 ?? 0)}</span>
        </a>`;
    };
    const once = top.map(chip).join('');
    ecoTrack.innerHTML = once + once;   /* duplicated for a seamless loop */
  }

  const unsubs = [];
  if (dataLayer){
    unsubs.push(dataLayer.subscribe('tao:subnets', renderEco));
    renderEco(dataLayer.get('tao:subnets'));
  }

  return { destroy(){ unsubs.forEach(u => u()); } };
}
