/* =================================================================
   SUBNET MAGAZINE — TICKER BAR (2028-grade)
   -----------------------------------------------------------------
   Two marquee tapes at the top of every page. Each chip is a real
   asset chip — logo, symbol, price, mini-sparkline, % change —
   rather than a flat text label, so the bar reads as a market wire
   rather than a press feed.

     1. Bittensor tape · live subnet chips from the 'tao:subnets'
        feed (logo + SN# + name + α-price + spark + 24h chg). Pause
        on hover; loops seamlessly.

     2. Central Desk · public stocks, crypto-native exchanges, and
        private frontier-lab valuations, each with a Clearbit-served
        logo and a mini sparkline keyed to its chg trend. Tail of
        the tape carries the AI-world newswire chips so the tape
        also surfaces what happened, not just where prices are.

   Logos: Clearbit's free logo API (`logo.clearbit.com/<domain>`)
   serves the company marks; if the image 404s the chip falls back
   to a generative monogram via lib/mark.js. Live subnet logos come
   from the taostats CDN URL on each row.
   ================================================================= */

import { html, mount, qs, qsa } from '../lib/dom.js';
import { money, pct } from '../lib/format.js';
import { mark, seedSeries } from '../lib/mark.js';
import { Sparkline } from '../charts/Sparkline.js';
import { AI_NEWS } from '../data/ai-news.js';
import { BITTENSOR_NEWS } from '../data/bittensor-news.js';
import { CENTRALIZED_TICKERS } from '../data/centralized-tickers.js';

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

/** Pre-rendered Bittensor news chips, newest first — appended to
    the Bittensor tape after the live subnet price chips. */
function bittensorNewsChipsHtml(){
  return [...BITTENSOR_NEWS]
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .map(n => newsChip(n, 'articles.html'))
    .join('');
}

/** Render a centralized-AI ticker chip with logo + sparkline slot. */
function centralChip(t){
  const up   = (t.chg ?? 0) >= 0;
  const cls  = up ? 'up' : 'down';
  const glyph = (t.chg ?? 0) === 0 ? '■' : (up ? '▲' : '▼');
  const chgStr = (t.chg ?? 0) === 0 ? '—' : pct(t.chg);
  const id = encodeURIComponent(t.sym);
  /* Clearbit logo URL with a generative-mark fallback at the same
     visual footprint. The mark() function takes the company name as
     a seed and returns deterministic node-graph SVG. */
  const fallback = `<span class="tick__mark">${mark(t.name, { size: 18 })}</span>`;
  const logo = t.domain
    ? `<img class="tick__logo" src="https://logo.clearbit.com/${t.domain}" alt="" loading="lazy"
        onerror="this.outerHTML = ${JSON.stringify(fallback).replace(/"/g, '&quot;')};">`
    : fallback;
  const tagPill = t.tag
    ? `<span class="tick__tag">${t.tag}</span>`
    : '';
  return `
    <a class="tick tick--cex" href="${t.href || 'centralized.html'}" target="${t.href ? '_blank' : '_self'}" rel="${t.href ? 'noopener' : ''}">
      ${logo}
      <span class="tick__sym">${t.sym}</span>
      <span class="tick__val">${t.valFmt}</span>
      <span class="tick__spark"><canvas data-cex-spark="${id}"></canvas></span>
      <span class="tick__chg ${cls}">${glyph} ${chgStr}</span>
      ${tagPill}
    </a>`;
}

/** Build the Central Desk tape: company chips first, then a short
    tail of recent AI-world headlines. Duplicated for seamless loop. */
function centralTapeHtml(){
  const company = CENTRALIZED_TICKERS.map(centralChip).join('');
  const news = [...AI_NEWS]
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .slice(0, 8)
    .map(n => newsChip(n, 'centralized.html'))
    .join('');
  const once = company + news;
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
        <span class="ticker__tag ticker__tag--brand">
          <span class="live-dot"></span>
          <span class="ticker__brand">Bi<span class="tau">ττ</span>ensor</span>
        </span>
        <div class="ticker__viewport">
          <div class="ticker__track" id="ticker-eco">
            <span class="ticker__loading">loading live subnets…</span>
          </div>
        </div>
      </div>

      <div class="ticker">
        <span class="ticker__tag ticker__tag--alt">
          <span class="live-dot"></span>
          Central Desk
        </span>
        <div class="ticker__viewport">
          <div class="ticker__track ticker__track--rev" id="ticker-cex">${centralTapeHtml()}</div>
        </div>
      </div>

    </section>
  `);

  const ecoTrack = qs('#ticker-eco', root);
  /* seed the tape with the Bittensor newswire so it's never empty,
     even before the live subnet feed answers */
  if (ecoTrack) ecoTrack.innerHTML = bittensorNewsChipsHtml() + bittensorNewsChipsHtml();

  /* Live subnet chips for the Bittensor tape. Each chip carries a
     mini sparkline canvas (data-eco-spark) mounted with seedSeries
     biased by chg24 so the line trend matches the badge. */
  const ecoSparks = [];
  function renderEco(list){
    if (!ecoTrack || !Array.isArray(list) || !list.length) return;
    /* tear down old sparks before re-rendering */
    ecoSparks.splice(0).forEach(sp => { try { sp.destroy(); } catch (_) {} });
    const top = list.slice(0, 24);
    const chip = s => {
      const up = (s.chg24 ?? 0) >= 0;
      const logo = s.logo
        ? `<img class="tick__logo" src="${s.logo}" alt="" loading="lazy" onerror="this.outerHTML = '<span class=&quot;tick__mark&quot;>${mark(s.name, { size: 18 }).replace(/"/g, '&quot;')}</span>';">`
        : `<span class="tick__mark">${mark(s.name, { size: 18 })}</span>`;
      const price = s.price < 1 ? '$' + s.price.toFixed(4) : money(s.price);
      return `
        <a class="tick" href="subnet.html?id=${s.netuid}">
          ${logo}
          <span class="tick__sym">SN${s.netuid}</span>
          <span class="tick__name">${s.name}</span>
          <span class="tick__val">${price}</span>
          <span class="tick__spark"><canvas data-eco-spark="${s.netuid}"></canvas></span>
          <span class="tick__chg ${up ? 'up' : 'down'}">${up ? '▲' : '▼'} ${pct(s.chg24 ?? 0)}</span>
        </a>`;
    };
    const onePass = top.map(chip).join('') + bittensorNewsChipsHtml();
    ecoTrack.innerHTML = onePass + onePass;

    /* mount per-chip sparklines after DOM lands */
    qsa('canvas[data-eco-spark]', ecoTrack).forEach(cv => {
      const id = cv.dataset.ecoSpark;
      const s = top.find(x => String(x.netuid) === String(id));
      if (!s) return;
      ecoSparks.push(new Sparkline(cv, {
        series:    seedSeries('eco-' + s.netuid, (s.chg24 ?? 0) * 1.4, 14),
        lineWidth: 1.2,
        fill:      true,
      }));
    });
  }

  /* mount Central Desk per-chip sparklines */
  const cexSparks = [];
  function mountCexSparks(){
    const cexTrack = qs('#ticker-cex', root);
    if (!cexTrack) return;
    cexSparks.splice(0).forEach(sp => { try { sp.destroy(); } catch (_) {} });
    qsa('canvas[data-cex-spark]', cexTrack).forEach(cv => {
      const sym = decodeURIComponent(cv.dataset.cexSpark);
      const t = CENTRALIZED_TICKERS.find(x => x.sym === sym);
      if (!t) return;
      cexSparks.push(new Sparkline(cv, {
        series:    seedSeries('cex-' + t.sym, (t.chg ?? 0) * 1.4, 14),
        lineWidth: 1.2,
        fill:      true,
      }));
    });
  }
  mountCexSparks();

  const unsubs = [];
  if (dataLayer){
    unsubs.push(dataLayer.subscribe('tao:subnets', renderEco));
    renderEco(dataLayer.get('tao:subnets'));
  }

  return {
    destroy(){
      unsubs.forEach(u => u());
      ecoSparks.splice(0).forEach(sp => { try { sp.destroy(); } catch (_) {} });
      cexSparks.splice(0).forEach(sp => { try { sp.destroy(); } catch (_) {} });
    },
  };
}
