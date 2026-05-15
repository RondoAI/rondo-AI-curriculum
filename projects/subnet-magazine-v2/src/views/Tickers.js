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
import { BITTENSOR_NEWS } from '../data/bittensor-news.js';

const IMPACT_GLYPH = { up: '▲', down: '▼', flat: '■' };

/** Render a news item as a chip. Used by both the Central Desk
    AI-world wire and the Bittensor ecosystem wire. */
function newsChip(n, href){
  const imp = n.impact || 'flat';
  return `
    <a class="tick tick--news" href="${href}">
      <span class="tick__src">${n.source}</span>
      <span class="tick__head">${n.headline}</span>
      <span class="tick__chg ${imp}">${IMPACT_GLYPH[imp] || '■'}</span>
    </a>`;
}

/** The Central Desk newswire — recent AI-world headlines as chips
    (duplicated for a seamless loop). */
function centralNewsHtml(){
  const items = [...AI_NEWS]
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .slice(0, 26);
  const once = items.map(n => newsChip(n, 'centralized.html')).join('');
  return once + once;
}

/** Pre-rendered Bittensor news chips, newest first — appended to
    the Bittensor tape after the live subnet price chips. */
function bittensorNewsChipsHtml(){
  return [...BITTENSOR_NEWS]
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .map(n => newsChip(n, 'articles.html'))
    .join('');
}

/**
 * @param {HTMLElement} root
 * @param {{subscribe:Function, get:Function}|null} [dataLayer]
 */
export function mountTickers(root, dataLayer = null){
  mount(root, html`
    <section class="tickerbar" aria-label="Live market tickers">
      <div class="ticker">
        <span class="ticker__tag ticker__tag--brand"><span class="live-dot"></span><span class="ticker__brand">bi<span class="tau">ττ</span>ensor</span></span>
        <div class="ticker__viewport">
          <div class="ticker__track" id="ticker-eco">
            <span class="ticker__loading">loading live subnets…</span>
          </div>
        </div>
      </div>
      <div class="ticker">
        <span class="ticker__tag ticker__tag--alt">Central Desk</span>
        <div class="ticker__viewport">
          <div class="ticker__track ticker__track--rev">${centralNewsHtml()}</div>
        </div>
      </div>
    </section>
  `);

  const ecoTrack = qs('#ticker-eco', root);
  /* seed the tape with the Bittensor newswire so it's never empty,
     even before the live subnet feed answers */
  if (ecoTrack) ecoTrack.innerHTML = bittensorNewsChipsHtml() + bittensorNewsChipsHtml();

  function renderEco(list){
    if (!ecoTrack || !Array.isArray(list) || !list.length) return;
    const top = list.slice(0, 24);
    const chip = s => {
      const up = (s.chg24 ?? 0) >= 0;
      const logo = s.logo
        ? `<img class="tick__logo" src="${s.logo}" alt="" loading="lazy" onerror="this.replaceWith(document.createTextNode(''))">`
        : `<span class="tick__mark">${mark(s.name, { size: 20 })}</span>`;
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
    /* one full pass = the live subnet price chips + the Bittensor
       newswire chips (Opentensor Foundation, Chutes, Targon, …), so
       the tape carries both market data and ecosystem headlines */
    const onePass = top.map(chip).join('') + bittensorNewsChipsHtml();
    ecoTrack.innerHTML = onePass + onePass;
  }

  const unsubs = [];
  if (dataLayer){
    unsubs.push(dataLayer.subscribe('tao:subnets', renderEco));
    renderEco(dataLayer.get('tao:subnets'));
  }

  return { destroy(){ unsubs.forEach(u => u()); } };
}
