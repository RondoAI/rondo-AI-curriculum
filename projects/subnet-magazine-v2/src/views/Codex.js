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
import { ARTICLES } from '../data/articles.js';
import { INTERVIEWS } from '../data/interviews.js';
import { VOICES } from '../data/voices.js';
import { NodeSphere } from '../charts/NodeSphere.js';
import { Sparkline } from '../charts/Sparkline.js';
import { mark, seedSeries } from '../lib/mark.js';
import { money, pct } from '../lib/format.js';
import { INFOGRAPHICS } from './oracle-infographics.js';

/**
 * Find everything across the magazine that cites a given Oracle
 * entry. Returns articles tagged with oracleRefs:[id], interviews
 * tagged the same way, and voices listing the id in expertise.
 * The function is small and runs once per entry render — the
 * datasets are small enough that this is fine without indexing.
 */
function citedBy(id){
  return {
    articles:   ARTICLES.filter(a => Array.isArray(a.oracleRefs) && a.oracleRefs.includes(id)),
    interviews: INTERVIEWS.filter(i => Array.isArray(i.oracleRefs) && i.oracleRefs.includes(id)),
    voices:     VOICES.filter(v => Array.isArray(v.expertise) && v.expertise.includes(id)),
  };
}

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

  /* "Cited in" — the Wikipedia signature. Every entry knows
     which articles, interviews, and voices reference it. */
  const cites = citedBy(e.id);
  const citedHtml = (cites.articles.length || cites.interviews.length || cites.voices.length)
    ? `
      <footer class="codex-entry__cited">
        <span class="codex-entry__see-lbl">Cited in</span>
        <div class="codex-entry__cited-list">
          ${cites.articles.map(a => `
            <a class="codex-cite codex-cite--art" href="${escapeHtml(a.externalUrl || a.pdf || 'index.html')}" target="_blank" rel="noopener">
              <span class="codex-cite__type">Article</span>
              <span class="codex-cite__title">${escapeHtml(a.title)}</span>
            </a>
          `).join('')}
          ${cites.interviews.map(i => `
            <a class="codex-cite codex-cite--int" href="https://youtu.be/${escapeHtml(i.youtubeId)}" target="_blank" rel="noopener">
              <span class="codex-cite__type">Interview</span>
              <span class="codex-cite__title">${escapeHtml(i.title)}</span>
            </a>
          `).join('')}
          ${cites.voices.map(v => `
            <a class="codex-cite codex-cite--voi" href="voices.html#${escapeHtml(v.handle)}">
              <span class="codex-cite__type">Voice</span>
              <span class="codex-cite__title">${escapeHtml(v.name)}</span>
            </a>
          `).join('')}
        </div>
      </footer>`
    : '';

  /* Entry now a <details> per Rondo's 2026-05-18 directive
     ("all the information in the oracle tab needs to be
     colapseable with the infographic as the cover of each
     topic"). SUMMARY = infographic (cover) + kicker + title +
     one-line preview + expand caret. BODY = the deep content
     (sections, see-also, sources, cited-in, meta). Reader
     scans covers + titles at-a-glance, expands what they want
     to read in full. */
  return `
    <details class="codex-entry" id="${e.id}" data-id="${e.id}"
             data-search="${escapeHtml((e.title + ' ' + e.kicker + ' ' + e.oneLine + ' ' + (e.sections || []).map(s => s.h + ' ' + s.body).join(' ')).toLowerCase())}">
      <summary class="codex-entry__summary">
        ${infographic ? `<div class="codex-entry__cover">${infographic}</div>` : ''}
        <header class="codex-entry__head">
          <span class="codex-entry__kicker">${escapeHtml(CATEGORY_LABEL[e.category] || e.kicker)}</span>
          <h2 class="codex-entry__title">${escapeHtml(e.title)} ${conf}</h2>
          <p class="codex-entry__one">${e.oneLine}</p>
          <span class="codex-entry__expand" aria-hidden="true">
            <span class="codex-entry__expand-lbl">READ</span>
            <span class="codex-entry__expand-caret">▾</span>
          </span>
        </header>
      </summary>

      <div class="codex-entry__body-wrap">
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

        ${citedHtml}

        <footer class="codex-entry__meta">
          <span>Updated <time datetime="${e.updated}">${e.updated}</time></span>
          <span>·</span>
          <span>Confidence <em>${e.confidence}</em></span>
        </footer>
      </div>
    </details>
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
      <header class="codex-hero" aria-label="Subnet Oracle">
        <div class="codex-hero__viz" aria-hidden="true">
          <canvas data-canvas="codex-mark"></canvas>
        </div>
        <div class="codex-hero__body">
          <span class="codex-hero__kicker">Subne<span class="tau">τ</span> Oracle &middot; Subne<span class="tau">τ</span> Magazine</span>
          <h1 class="codex-hero__title">Ask the Subnet Oracle.</h1>
          <p class="codex-hero__dek">
            Every concept, mechanism, role, and event inside Bittensor. Written
            to be read, sourced so the claims are checkable, drawn so the
            ideas land. The ${CODEX.length} entries scroll below; ask the
            Subnet Oracle directly from the dock at the bottom of the page.
          </p>
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

      <!-- The conversational Oracle lives in the bottom dock now,
           one Oracle on every page, no duplicate floating panel. -->

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
          <a class="codex-leader__id" href="markets.html#sn${s.netuid}">SN${s.netuid}</a>
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

  /* ---------- see-also: scroll + briefly highlight + AUTO-OPEN ---- */
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
    /* Auto-open the <details> entry the see-also link points at —
       reader expects the destination to be readable on arrival,
       not still collapsed. */
    if (target.tagName === 'DETAILS') target.open = true;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    target.classList.add('is-flash-codex');
    setTimeout(() => target.classList.remove('is-flash-codex'), 1600);
  });

  /* URL hash auto-open: if someone lands on /oracle.html#some-id
     (deep link from elsewhere), open that <details> so the
     destination renders ready-to-read, not collapsed. Runs once
     on mount + once on hashchange (re-shared links). */
  function openHashTarget(){
    const id = (window.location.hash || '').slice(1);
    if (!id) return;
    const target = root.querySelector('#' + CSS.escape(id));
    if (target && target.tagName === 'DETAILS'){
      target.open = true;
      requestAnimationFrame(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    }
  }
  openHashTarget();
  window.addEventListener('hashchange', openHashTarget);

  /* The conversational chat moved to the bottom Subnet Oracle dock
     (src/views/Console.js). One Oracle, every page. */

  return {
    destroy(){
      markSphere?.destroy();
      leaderSparks.splice(0).forEach(sp => { try { sp.destroy(); } catch (_) {} });
      unsubs.forEach(u => u());
    },
  };
}
