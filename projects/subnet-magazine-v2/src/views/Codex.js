/* =================================================================
   CODEX VIEW
   -----------------------------------------------------------------
   The magazine's reference layer. Renders every entry from
   src/data/codex.js as an expandable card, grouped by category,
   with:
     - sticky in-page TOC (jump to any entry, jump to any category)
     - category filter chips
     - live free-text search (title + kicker + body)
     - confidence dot per entry (high / medium / low)
     - cross-reference links (seeAlso) that scroll to the
       referenced entry, expand it, and highlight it briefly
     - inline source citations

   Designed to be read like an editorial encyclopedia, indexed
   like a library, navigable like a serious reference work.
   ================================================================= */

import { html, mount, qs, qsa } from '../lib/dom.js';
import { CODEX, CATEGORY_LABEL, codexByCategory, codexEntryById } from '../data/codex.js';
import { NodeSphere } from '../charts/NodeSphere.js';
import { Sparkline } from '../charts/Sparkline.js';
import { mark, seedSeries } from '../lib/mark.js';
import { money, pct } from '../lib/format.js';

/** Coloured confidence dot, matches the magazine's epistemic grammar. */
const CONF_COLOR = { high: 'var(--c-up, #00E5A8)', medium: '#FFB85C', low: '#FF4D60' };

function escapeHtml(s){
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function formatBody(b){
  /* Body content is HTML-safe plain text with paragraph breaks via
     \n\n. We allow inline tags (<em>, <strong>, <a>, <code>,
     <span>, <sub>, <sup>) without escaping. Paragraphs get wrapped
     in <p>. */
  return String(b || '')
    .split(/\n\n+/)
    .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
    .join('');
}

/** Build the sticky TOC sidebar. One link per entry, grouped. */
function tocHtml(){
  return codexByCategory().map(g => `
    <section class="codex-toc__group">
      <h4 class="codex-toc__h">${g.label}</h4>
      <ul>
        ${g.entries.map(e => `
          <li><a href="#${e.id}" data-toc="${e.id}">${escapeHtml(e.title)}</a></li>
        `).join('')}
      </ul>
    </section>
  `).join('');
}

/** Per-entry infographic registry. Each function returns an HTML
    string that gets injected between the entry head and the
    section stream. SVG + CSS so the diagrams render crisply on
    any density and animate without consuming a canvas frame
    budget. Add new infographics by appending a new key + setting
    the entry's `infographic` field in src/data/codex.js. */
const INFOGRAPHICS = {
  /* Yuma Consensus: 5 validators submit weight vectors -> chain
     aggregates via stake-weighted median -> miners are paid in
     proportion. The pulse travels down the diagram in a loop. */
  'yuma-consensus': () => `
    <figure class="codex-info codex-info--yuma" aria-label="Yuma Consensus, animated diagram">
      <figcaption class="codex-info__cap">
        Animated · how Yuma Consensus aggregates 5 validator weight
        vectors into a single fair score per miner. Watch the pulse
        flow top, to, bottom: validators score, weights aggregate,
        emission flows.
      </figcaption>
      <svg viewBox="0 0 600 360" class="codex-info__svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <linearGradient id="yumaRed" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%"  stop-color="#FF1E3C" stop-opacity="0"/>
            <stop offset="50%" stop-color="#FF1E3C" stop-opacity="1"/>
            <stop offset="100%" stop-color="#FF1E3C" stop-opacity="0"/>
          </linearGradient>
          <filter id="yumaGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        <!-- row 1: 5 validators -->
        <g class="codex-info__row" transform="translate(0,40)">
          <text x="300" y="-12" text-anchor="middle" fill="#FF1E3C"
                font-family="JetBrains Mono, monospace" font-size="9" font-weight="700"
                letter-spacing="2">5 VALIDATORS · WEIGHT VECTORS</text>
          ${[0,1,2,3,4].map(i => {
            const x = 70 + i*115;
            return `
              <g class="codex-info__validator" style="--i:${i}">
                <rect x="${x-32}" y="0" width="64" height="48" rx="4"
                      fill="rgba(255,30,60,.06)" stroke="#FF1E3C" stroke-opacity=".4"/>
                <text x="${x}" y="18" text-anchor="middle" fill="#F5E5E8"
                      font-family="JetBrains Mono, monospace" font-size="10" font-weight="700">V${i+1}</text>
                <text x="${x}" y="34" text-anchor="middle" fill="#C8A8AD"
                      font-family="JetBrains Mono, monospace" font-size="8">stake ${[12,28,9,18,33][i]}K</text>
              </g>
            `;
          }).join('')}
        </g>

        <!-- arrows from each validator down to the aggregator -->
        ${[0,1,2,3,4].map(i => {
          const x = 70 + i*115;
          return `
            <line class="codex-info__pulse-line"
                  x1="${x}" y1="88" x2="300" y2="170"
                  stroke="url(#yumaRed)" stroke-width="1.2" stroke-opacity=".6"
                  style="--d:${i*.18}s"/>
          `;
        }).join('')}

        <!-- aggregator hex -->
        <g class="codex-info__agg" transform="translate(300,200)">
          <polygon points="-46,0 -23,-40 23,-40 46,0 23,40 -23,40"
                   fill="rgba(255,30,60,.12)" stroke="#FF1E3C" stroke-width="1.4"
                   filter="url(#yumaGlow)"/>
          <text y="-4" text-anchor="middle" fill="#FF4D60"
                font-family="JetBrains Mono, monospace" font-size="9" font-weight="800"
                letter-spacing="1.5">YUMA</text>
          <text y="10" text-anchor="middle" fill="#F5E5E8"
                font-family="JetBrains Mono, monospace" font-size="8"
                font-weight="600">stake-weighted</text>
          <text y="22" text-anchor="middle" fill="#F5E5E8"
                font-family="JetBrains Mono, monospace" font-size="8"
                font-weight="600">median</text>
        </g>

        <!-- arrows down to miners -->
        ${[0,1,2,3,4,5].map(i => {
          const x = 60 + i*96;
          return `
            <line class="codex-info__pulse-line"
                  x1="300" y1="240" x2="${x}" y2="298"
                  stroke="url(#yumaRed)" stroke-width="1.2" stroke-opacity=".6"
                  style="--d:${i*.15 + .9}s"/>
          `;
        }).join('')}

        <!-- row 3: 6 miners, paid -->
        <g class="codex-info__row" transform="translate(0,300)">
          <text x="300" y="60" text-anchor="middle" fill="#FF1E3C"
                font-family="JetBrains Mono, monospace" font-size="9" font-weight="700"
                letter-spacing="2">6 MINERS · EMISSION PAID</text>
          ${[0,1,2,3,4,5].map(i => {
            const x = 60 + i*96;
            const h = [22, 36, 14, 30, 18, 26][i];
            return `
              <g class="codex-info__miner" style="--i:${i}">
                <rect x="${x-14}" y="${36 - h}" width="28" height="${h}" rx="2"
                      fill="#FF1E3C" fill-opacity=".75"/>
                <text x="${x}" y="34" text-anchor="middle" fill="#F5E5E8"
                      font-family="JetBrains Mono, monospace" font-size="7" font-weight="700">M${i+1}</text>
              </g>
            `;
          }).join('')}
        </g>
      </svg>
    </figure>
  `,
};

/** Build one entry card. */
function entryCard(e){
  const conf = `<span class="codex-entry__conf" title="Confidence: ${e.confidence}"
                     style="background:${CONF_COLOR[e.confidence] || '#888'};
                            box-shadow:0 0 6px ${CONF_COLOR[e.confidence] || '#888'};"></span>`;

  const infographic = (e.infographic && INFOGRAPHICS[e.infographic])
    ? INFOGRAPHICS[e.infographic]()
    : '';

  const sections = (e.sections || []).map(s => `
    <section class="codex-entry__section">
      <h3 class="codex-entry__h">${escapeHtml(s.h)}</h3>
      <div class="codex-entry__body">${formatBody(s.body)}</div>
    </section>
  `).join('');

  const seeAlso = (e.seeAlso || [])
    .map(id => codexEntryById(id))
    .filter(Boolean)
    .map(r => `<a class="codex-link" href="#${r.id}" data-jump="${r.id}">${escapeHtml(r.title)}</a>`)
    .join('');

  const sources = (e.sources || [])
    .map(s => `<a class="codex-source" href="${escapeHtml(s.href)}" target="_blank" rel="noopener">${escapeHtml(s.name)} <span aria-hidden="true">&rarr;</span></a>`)
    .join('');

  return `
    <article class="codex-entry" id="${e.id}" data-id="${e.id}"
             data-search="${escapeHtml((e.title + ' ' + e.kicker + ' ' + e.oneLine + ' ' + (e.sections || []).map(s => s.h + ' ' + s.body).join(' ')).toLowerCase())}">
      <header class="codex-entry__head">
        <span class="codex-entry__kicker">${escapeHtml(CATEGORY_LABEL[e.category] || e.kicker)}</span>
        <h2 class="codex-entry__title">${escapeHtml(e.title)} ${conf}</h2>
        <p class="codex-entry__one">${e.oneLine}</p>
      </header>

      ${infographic}

      ${sections}

      ${seeAlso ? `
        <footer class="codex-entry__see">
          <span class="codex-entry__see-lbl">See also</span>
          <div class="codex-entry__see-list">${seeAlso}</div>
        </footer>` : ''}

      ${sources ? `
        <footer class="codex-entry__sources">
          <span class="codex-entry__see-lbl">Sources</span>
          <div class="codex-entry__src-list">${sources}</div>
        </footer>` : ''}

      <footer class="codex-entry__meta">
        <span>Updated <time datetime="${e.updated}">${e.updated}</time></span>
        <span>·</span>
        <span>Confidence <em>${e.confidence}</em></span>
      </footer>
    </article>
  `;
}

/** Build all category sections. */
function bodyHtml(){
  return codexByCategory().map(g => `
    <section class="codex-group" id="cat-${g.key}" aria-label="${g.label}">
      <header class="codex-group__head">
        <span class="codex-group__count">${String(g.entries.length).padStart(2,'0')}</span>
        <h2 class="codex-group__title">${g.label}</h2>
      </header>
      <div class="codex-group__list">
        ${g.entries.map(entryCard).join('')}
      </div>
    </section>
  `).join('');
}

/**
 * @param {HTMLElement} root
 * @param {{subscribe:Function, get:Function}|null} [dataLayer]
 * @returns {{ destroy: () => void }}
 */
export function mountCodex(root, dataLayer = null){
  mount(root, html`
    <section class="codex-page" aria-label="The Codex">

      <!-- ===== HERO ===== -->
      <header class="codex-hero" aria-label="The Codex">
        <div class="codex-hero__viz" aria-hidden="true">
          <canvas data-canvas="codex-mark"></canvas>
        </div>
        <div class="codex-hero__body">
          <span class="codex-hero__kicker">The Codex &middot; Subne<span class="tau">τ</span> Magazine</span>
          <h1 class="codex-hero__title">A reference for the&nbsp;network.</h1>
          <p class="codex-hero__dek">
            Every concept, mechanism, role, and event inside Bittensor. Written
            to be read, sourced so the claims are checkable, indexed so the
            network can finally have a library worth its name.
          </p>

          <!-- Ask the Codex, LLM-style input bar -->
          <form class="codex-ask" data-role="ask" autocomplete="off">
            <span class="codex-ask__lbl">Ask the Codex</span>
            <input id="codex-q" type="search" class="codex-ask__input"
                   placeholder="What is Yuma Consensus? How does dTAO work? Who runs SN64?"
                   spellcheck="false" autocomplete="off">
            <button type="submit" class="codex-ask__send" aria-label="Search">
              <svg viewBox="0 0 24 24" width="18" height="18"><path d="M4 12h14M14 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <span class="codex-ask__count" data-bind="codex-count">${CODEX.length}</span>
          </form>
        </div>
      </header>

      <!-- ===== LIVE NETWORK STATE STRIP ===== -->
      <ol class="codex-state" aria-label="Live network state">
        <li class="codex-state__cell">
          <span class="codex-state__lbl">Active subnets</span>
          <span class="codex-state__val" data-bind="codex-subnets">,</span>
          <span class="codex-state__sub">of 256 max</span>
        </li>
        <li class="codex-state__cell">
          <span class="codex-state__lbl"><span class="alpha">α</span>-MCAP rollup</span>
          <span class="codex-state__val" data-bind="codex-amcap">,</span>
          <span class="codex-state__sub">live · taomarketcap</span>
        </li>
        <li class="codex-state__cell">
          <span class="codex-state__lbl">Emission</span>
          <span class="codex-state__val" data-bind="codex-em">,</span>
          <span class="codex-state__sub">per day · live</span>
        </li>
        <li class="codex-state__cell">
          <span class="codex-state__lbl">Block</span>
          <span class="codex-state__val" data-bind="codex-block">,</span>
          <span class="codex-state__sub">latest height</span>
        </li>
      </ol>

      <!-- ===== TOP-10 SUBNETS LEADERBOARD ===== -->
      <section class="codex-leader" aria-label="Top 10 subnets by α-MCAP">
        <header class="codex-leader__head">
          <span class="codex-leader__count">10</span>
          <h2 class="codex-leader__title">Top subnets by <span class="alpha">α</span>-MCAP</h2>
          <span class="codex-leader__live"><span class="dot dot--live"></span>LIVE</span>
        </header>
        <ol class="codex-leader__list" data-bind="codex-leader">
          <li class="codex-leader__loading">Loading live subnet feed,</li>
        </ol>
      </section>

      <!-- ===== CONTROLS: category filters ===== -->
      <nav class="codex-page__filters" aria-label="Filter by category">
        <button class="codex-filter is-active" data-cat="all" type="button">All</button>
        ${codexByCategory().map(g => `
          <button class="codex-filter" data-cat="${g.key}" type="button">${g.label}</button>
        `).join('')}
      </nav>

      <!-- ===== LAYOUT: TOC + main body ===== -->
      <div class="codex-layout">
        <aside class="codex-toc" aria-label="Codex table of contents">
          <h3 class="codex-toc__title">Contents</h3>
          <nav>${tocHtml()}</nav>
        </aside>
        <main class="codex-main">
          ${bodyHtml()}
        </main>
      </div>

    </section>
  `);

  /* ---------- mount the hero NodeSphere ---------- */
  const markCv = qs('[data-canvas="codex-mark"]', root);
  const markSphere = markCv ? new NodeSphere(markCv, {
    nodes: 96, K: 4, density: 0.52, speed: 0.26, atmos: true,
  }) : null;

  /* ---------- live network state + leaderboard wiring ---------- */
  const subNetsEl = qs('[data-bind="codex-subnets"]', root);
  const amcapEl   = qs('[data-bind="codex-amcap"]', root);
  const emEl      = qs('[data-bind="codex-em"]', root);
  const blockEl   = qs('[data-bind="codex-block"]', root);
  const leaderEl  = qs('[data-bind="codex-leader"]', root);
  const leaderSparks = [];
  const unsubs = [];

  function renderState(list){
    if (!Array.isArray(list) || !list.length) return;
    if (subNetsEl){ subNetsEl.textContent = String(list.length); subNetsEl.classList.add('is-live'); }
    const tot = list.reduce((s, x) => s + (typeof x.mcap === 'number' ? x.mcap : 0), 0);
    if (amcapEl && tot > 0){
      amcapEl.textContent = tot >= 1000 ? '$' + (tot/1000).toFixed(2) + 'B' : '$' + Math.round(tot) + 'M';
      amcapEl.classList.add('is-live');
    }
    renderLeader(list);
  }
  function renderChain(c){
    if (!c) return;
    if (typeof c.blockTime === 'number' && blockEl){
      blockEl.textContent = c.blockTime.toFixed(0) + 's';
      blockEl.classList.add('is-live');
    }
    if (typeof c.emissionPerDay === 'number' && emEl){
      emEl.innerHTML = '<span class="tau">τ</span>' + Math.round(c.emissionPerDay).toLocaleString();
      emEl.classList.add('is-live');
    }
    if (typeof c.block === 'number' && blockEl){
      blockEl.textContent = c.block.toLocaleString();
      blockEl.classList.add('is-live');
    }
  }
  function renderLeader(list){
    if (!leaderEl || !Array.isArray(list)) return;
    leaderSparks.splice(0).forEach(sp => { try { sp.destroy(); } catch (_) {} });
    const top = [...list]
      .filter(x => typeof x.mcap === 'number')
      .sort((a, b) => (b.mcap || 0) - (a.mcap || 0))
      .slice(0, 10);
    leaderEl.innerHTML = top.map((s, i) => {
      const up = (s.chg24 ?? 0) >= 0;
      const logo = s.logo
        ? `<img class="codex-leader__logo" src="${s.logo}" alt="" loading="lazy" onerror="this.outerHTML='<span class=&quot;codex-leader__logo-mark&quot;>${mark(s.name, { size: 24 }).replace(/"/g, '&quot;')}</span>'">`
        : `<span class="codex-leader__logo-mark">${mark(s.name, { size: 24 })}</span>`;
      const mcap = s.mcap >= 1000 ? '$' + (s.mcap/1000).toFixed(2) + 'B' : '$' + Math.round(s.mcap) + 'M';
      return `
        <li class="codex-leader__row">
          <span class="codex-leader__rank">${String(i + 1).padStart(2,'0')}</span>
          <span class="codex-leader__cell-logo">${logo}</span>
          <a class="codex-leader__id" href="subnet.html?id=${s.netuid}">SN${s.netuid}</a>
          <span class="codex-leader__name">${s.name}</span>
          <span class="codex-leader__mcap">${mcap}</span>
          <span class="codex-leader__spark"><canvas data-codex-spark="${s.netuid}"></canvas></span>
          <span class="codex-leader__chg ${up ? 'up' : 'down'}">${up ? '▲' : '▼'} ${pct(s.chg24 ?? 0)}</span>
        </li>
      `;
    }).join('');
    /* mount each row's sparkline */
    qsa('canvas[data-codex-spark]', leaderEl).forEach(cv => {
      const id = cv.dataset.codexSpark;
      const s = top.find(x => String(x.netuid) === String(id));
      if (!s) return;
      leaderSparks.push(new Sparkline(cv, {
        series: seedSeries('codex-' + s.netuid, (s.chg24 ?? 0) * 1.4, 18),
        lineWidth: 1.4, fill: true,
      }));
    });
  }

  if (dataLayer){
    unsubs.push(dataLayer.subscribe('tao:subnets', renderState));
    unsubs.push(dataLayer.subscribe('tao:chain',   renderChain));
    renderState(dataLayer.get('tao:subnets'));
    renderChain(dataLayer.get('tao:chain'));
  }

  /* ---------- filter logic ---------- */
  const filters = qsa('.codex-filter', root);
  const entries = qsa('.codex-entry', root);
  const groupSections = qsa('.codex-group', root);
  const countEl = qs('[data-bind="codex-count"]', root);

  function applyFilter(){
    const activeCat = (qs('.codex-filter.is-active', root)?.dataset.cat) || 'all';
    const query = (qs('#codex-q', root)?.value || '').trim().toLowerCase();
    let shown = 0;
    entries.forEach(el => {
      const cat = el.closest('.codex-group')?.id?.replace(/^cat-/, '') || '';
      const matchCat = activeCat === 'all' || cat === activeCat;
      const matchQuery = !query || (el.dataset.search || '').includes(query);
      const show = matchCat && matchQuery;
      el.hidden = !show;
      if (show) shown += 1;
    });
    /* hide a whole group if none of its entries pass the filter */
    groupSections.forEach(g => {
      const anyShown = Array.from(g.querySelectorAll('.codex-entry')).some(e => !e.hidden);
      g.hidden = !anyShown;
    });
    if (countEl) countEl.textContent = String(shown);
  }

  filters.forEach(b => b.addEventListener('click', () => {
    filters.forEach(x => x.classList.toggle('is-active', x === b));
    applyFilter();
  }));
  qs('#codex-q', root)?.addEventListener('input', applyFilter);
  /* Ask-the-Codex submit: scroll the first matching entry into view */
  qs('[data-role="ask"]', root)?.addEventListener('submit', (e) => {
    e.preventDefault();
    applyFilter();
    const firstShown = entries.find(x => !x.hidden);
    if (firstShown) firstShown.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* ---------- see-also: scroll + briefly highlight target entry ---- */
  root.addEventListener('click', (e) => {
    const a = e.target.closest('[data-jump]');
    if (!a) return;
    e.preventDefault();
    const id = a.getAttribute('data-jump');
    const target = root.querySelector('#' + CSS.escape(id));
    if (!target) return;
    /* clear any filter so the jump target isn't hidden */
    filters.forEach(x => x.classList.toggle('is-active', x.dataset.cat === 'all'));
    const q = qs('#codex-q', root);
    if (q) q.value = '';
    applyFilter();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    target.classList.add('is-flash-codex');
    setTimeout(() => target.classList.remove('is-flash-codex'), 1600);
  });

  return {
    destroy(){
      markSphere?.destroy();
      leaderSparks.splice(0).forEach(sp => { try { sp.destroy(); } catch (_) {} });
      unsubs.forEach(u => u());
    },
  };
}
