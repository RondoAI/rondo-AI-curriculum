/* =================================================================
   SUBNET MAGAZINE, THE CENTRALIZED DESK
   -----------------------------------------------------------------
   The "what's happening outside Bittensor" page, reimagined as a
   visual-first surface, not a wall of text. Three blocks:

     1. THE TAPE, a marquee of centralized AI players, ranked by
        valuation, so the centralized map reads at a glance.
     2. READINGS, a CMC-style news feed: source-attributed cards
        with a generated art banner, headline, summary, and an
        editorial impact read. Filterable by desk.
     3. THE ROSTER, the full ~80-company landscape as a visual
        grid of generated marks, filterable by region (the Asian
        AI map is first-class here).

   Curated editorial data (src/data/ai-news.js + centralized.js);
   all art is generated (src/lib/art.js, src/lib/mark.js).
   ================================================================= */

import { html, mount, qs, qsa, on } from '../lib/dom.js';
import { mark } from '../lib/mark.js';
import { cardArt } from '../lib/art.js';
import { AI_NEWS, newsByDate, NEWS_CATEGORY } from '../data/ai-news.js';
import { CENTRALIZED_PLAYERS, REGIONS, ASIAN_REGIONS, tickerFor } from '../data/centralized.js';

function fmtDate(iso){
  const d = new Date(iso + 'T00:00:00Z');
  return `${String(d.getUTCDate()).padStart(2,'0')} `
       + `${d.toLocaleDateString('en-US',{month:'short'}).toUpperCase()}`;
}
const IMPACT_LABEL = { up:'▲ TAILWIND', down:'▼ HEADWIND', flat:'● NEUTRAL' };
/** Up/down/flat class from a signed change string like "+3.4%". */
const chgClass = c => (String(c)[0] === '-' ? 'down' : String(c)[0] === '+' ? 'up' : 'flat');
/** Render a row of gain/loss ticker chips. */
const tickerChips = list => !list || !list.length ? '' : `
  <div class="cd-tks">${list.map(t => `
    <span class="cd-tk cd-tk--${chgClass(t.chg)}">
      <span class="cd-tk__sym">${t.symbol}</span>
      <span class="cd-tk__chg">${t.chg}</span>
    </span>`).join('')}</div>`;

/** @param {HTMLElement} root */
export function mountCentralized(root){
  const news = newsByDate();
  /* tape: top players by parsed valuation */
  const tape = CENTRALIZED_PLAYERS
    .map(p => ({ ...p, _v: parseValuation(p.valuation) }))
    .sort((a, b) => b._v - a._v)
    .slice(0, 28);

  const NEWS_CATS = ['all', ...Object.keys(NEWS_CATEGORY)];
  const ROSTER_REGIONS = ['ALL', 'ASIA', ...Object.keys(REGIONS)];

  mount(root, html`
    <section class="cd">
      <header class="cd-head">
        <a class="sd-back" href="index.html">‹ MAGAZINE</a>
        <div class="cd-head__main">
          <span class="cd-head__kicker">&lt;026&gt;  THE CENTRALIZED DESK</span>
          <h1 class="cd-head__title">The centralized race, <em>watched.</em></h1>
          <p class="cd-head__sub">
            Decentralized AI doesn't exist in a vacuum. This is the desk that tracks the
            closed labs, the compute build-outs, and the capital, with the Asian frontier
            (China, Korea, Japan, Taiwan) treated as first-class, not a footnote.
          </p>
        </div>
        <div class="cd-head__meta">
          <span class="sd-pill">${CENTRALIZED_PLAYERS.length} PLAYERS</span>
          <span class="sd-pill">${AI_NEWS.length} READINGS</span>
        </div>
      </header>

      <!-- ===== THE TAPE ===== -->
      <section class="cd-tape" aria-label="Centralized AI players by valuation">
        <span class="cd-tape__lbl">THE TAPE · BY VALUATION</span>
        <div class="cd-tape__viewport">
          <div class="cd-tape__track">
            ${[0,1].map(() => tape.map(p => {
              const tk = tickerFor(p);
              return `
              <span class="cd-chip cd-chip--${ASIAN_REGIONS.has(p.region) ? 'asia' : 'west'}">
                <span class="cd-chip__mark">${mark(p.name, { size: 22 })}</span>
                <span class="cd-chip__tk ${tk.isPrivate ? 'is-pvt' : ''}">${tk.symbol}</span>
                <span class="cd-chip__name">${p.name}</span>
                <span class="cd-chip__val">${p.valuation}</span>
              </span>`;
            }).join('')).join('')}
          </div>
        </div>
      </section>

      <!-- ===== READINGS ===== -->
      <section class="cd-readings" aria-label="Centralized AI readings">
        <div class="cd-readings__head">
          <h2 class="cd-section__title"><span class="live-dot"></span>Readings</h2>
          <div class="cd-filters" role="tablist">
            ${NEWS_CATS.map((c, i) => `
              <button class="cd-filter ${i===0?'is-on':''}" data-cat="${c}" role="tab">
                ${c === 'all' ? 'ALL' : NEWS_CATEGORY[c]}
              </button>
            `).join('')}
          </div>
        </div>
        <ul class="cd-feed" id="cd-feed"></ul>
      </section>

      <!-- ===== THE ROSTER ===== -->
      <section class="cd-roster" aria-label="Centralized AI roster">
        <div class="cd-readings__head">
          <h2 class="cd-section__title">The roster</h2>
          <div class="cd-filters" role="tablist">
            ${ROSTER_REGIONS.map((r, i) => `
              <button class="cd-filter ${i===0?'is-on':''}" data-region="${r}" role="tab">
                ${r === 'ALL' ? 'ALL' : r === 'ASIA' ? 'ASIA' : r}
              </button>
            `).join('')}
          </div>
        </div>
        <ul class="cd-grid" id="cd-grid"></ul>
      </section>
    </section>
  `);

  /* ---------- readings feed ---------- */
  const feed = qs('#cd-feed', root);
  function renderFeed(cat = 'all'){
    const items = cat === 'all' ? news : news.filter(n => n.category === cat);
    feed.innerHTML = items.map(n => `
      <li class="cd-card">
        <article class="cd-card__inner">
          <div class="cd-card__main">
            <header class="cd-card__head">
              <span class="cd-card__avatar">${mark(n.source, { size: 20 })}</span>
              <span class="cd-card__src-name">${n.source}</span>
              <span class="cd-card__src-meta">· ${fmtDate(n.date)} · ${n.region}</span>
            </header>
            <h3 class="cd-card__headline">${n.headline}</h3>
            ${tickerChips(n.tickers)}
            <footer class="cd-card__foot">
              <span class="cd-card__cat">${NEWS_CATEGORY[n.category]}</span>
              <span class="cd-impact cd-impact--${n.impact}">${IMPACT_LABEL[n.impact]}</span>
            </footer>
          </div>
          <div class="cd-card__thumb">${cardArt(n.id, { w: 260, h: 320, variant: n.category })}</div>
        </article>
      </li>
    `).join('');
  }
  renderFeed();
  qsa('.cd-filter[data-cat]', root).forEach(btn => {
    on(btn, 'click', () => {
      qsa('.cd-filter[data-cat]', root).forEach(b => b.classList.remove('is-on'));
      btn.classList.add('is-on');
      renderFeed(btn.dataset.cat);
    });
  });

  /* ---------- roster grid ---------- */
  const grid = qs('#cd-grid', root);
  function renderRoster(region = 'ALL'){
    let list = CENTRALIZED_PLAYERS;
    if (region === 'ASIA') list = list.filter(p => ASIAN_REGIONS.has(p.region));
    else if (region !== 'ALL') list = list.filter(p => p.region === region);
    grid.innerHTML = list.map(p => {
      const tk = tickerFor(p);
      return `
      <li class="cd-co">
        <a class="cd-co__link" href="${p.url}" target="_blank" rel="noopener">
          <span class="cd-co__mark">${mark(p.name, { size: 38 })}</span>
          <span class="cd-co__name">
            <span class="cd-co__tk ${tk.isPrivate ? 'is-pvt' : ''}">${tk.symbol}</span>
            <span class="cd-co__co">${p.name}</span>
          </span>
          <span class="cd-co__focus">${p.focus}</span>
          <span class="cd-co__foot">
            <span class="cd-co__region cd-co__region--${ASIAN_REGIONS.has(p.region) ? 'asia' : 'west'}">${p.region}</span>
            <span class="cd-co__val">${p.valuation}</span>
            ${p.openSource ? '<span class="cd-co__os">OSS</span>' : ''}
          </span>
        </a>
      </li>`;
    }).join('');
    if (!list.length) grid.innerHTML = '<li class="cd-empty">No players in this region.</li>';
  }
  renderRoster();
  qsa('.cd-filter[data-region]', root).forEach(btn => {
    on(btn, 'click', () => {
      qsa('.cd-filter[data-region]', root).forEach(b => b.classList.remove('is-on'));
      btn.classList.add('is-on');
      renderRoster(btn.dataset.region);
    });
  });

  return { destroy(){} };
}

/** Parse a human valuation string ("$340B", "$1.6T (parent)") to a number. */
function parseValuation(v){
  if (!v) return 0;
  const m = String(v).match(/\$?\s*([\d.]+)\s*([TBM])/i);
  if (!m) return 0;
  const n = parseFloat(m[1]);
  const mult = { t: 1e12, b: 1e9, m: 1e6 }[m[2].toLowerCase()] || 1;
  return n * mult;
}
