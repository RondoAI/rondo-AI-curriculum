/* =================================================================
   SUBNET MAGAZINE — TICKER BAR
   -----------------------------------------------------------------
   The two marquee tapes that sit at the very top of every page:

     1. Bittensor — live from the 'tao:subnets' feed: subnet mark,
        netuid, name, α-price, 24h change. Each chip links to that
        subnet's page.
     2. Central Desk — a slow newswire of the centralized AI world:
        source, headline, and an up/down/flat impact read. Not
        stock prices — what actually happened.

   Both loop seamlessly (content duplicated), pause on hover, and
   respect prefers-reduced-motion.
   ================================================================= */

import { html, mount, qs } from '../lib/dom.js';
import { money, pct } from '../lib/format.js';
import { mark } from '../lib/mark.js';
import { AI_NEWS } from '../data/ai-news.js';

const IMPACT_GLYPH = { up: '▲', down: '▼', flat: '■' };

/** The Central Desk newswire — recent AI-world headlines as chips
    (duplicated for a seamless loop). */
function newsTickerHtml(){
  const items = [...AI_NEWS]
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .slice(0, 26);
  const chip = n => {
    const imp = n.impact || 'flat';
    return `
    <a class="tick tick--news" href="centralized.html">
      <span class="tick__src">${n.source}</span>
      <span class="tick__head">${n.headline}</span>
      <span class="tick__chg ${imp}">${IMPACT_GLYPH[imp] || '■'}</span>
    </a>`;
  };
  const once = items.map(chip).join('');
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
        <span class="ticker__tag ticker__tag--alt">Central Desk</span>
        <div class="ticker__viewport">
          <div class="ticker__track ticker__track--rev">${newsTickerHtml()}</div>
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
        : `<span class="tick__mark">${mark(s.name, { size: 15 })}</span>`;
      const price = s.price < 1 ? '$' + s.price.toFixed(4) : money(s.price);
      return `
        <a class="tick" href="subnet.html?id=${s.netuid}">
          ${logo}
          <span class="tick__sym">SN${s.netuid}</span>
          <span class="tick__name">${s.name}</span>
          <span class="tick__val">${price}</span>
          <span class="tick__chg ${up ? 'up' : 'down'}">${up ? '▲' : '▼'} ${pct(s.chg24 ?? 0)}</span>
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
