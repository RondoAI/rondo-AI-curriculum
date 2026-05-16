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

/** Build one entry card. */
function entryCard(e){
  const conf = `<span class="codex-entry__conf" title="Confidence: ${e.confidence}"
                     style="background:${CONF_COLOR[e.confidence] || '#888'};
                            box-shadow:0 0 6px ${CONF_COLOR[e.confidence] || '#888'};"></span>`;

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
 * @returns {{ destroy: () => void }}
 */
export function mountCodex(root){
  mount(root, html`
    <section class="codex-page" aria-label="The Codex">

      <header class="codex-page__head">
        <span class="codex-page__kicker">The Codex &middot; Subne<span class="tau">τ</span> Magazine</span>
        <h1 class="codex-page__title">A reference for the network.</h1>
        <p class="codex-page__dek">
          Every concept, mechanism, role, and event inside Bittensor &mdash;
          written to be read, indexed to be searched, sourced so the
          claims are checkable. The library this network deserved.
        </p>

        <!-- Search + category filter chips -->
        <div class="codex-page__controls">
          <label class="codex-search" for="codex-q">
            <span class="codex-search__icon" aria-hidden="true">&#x2315;</span>
            <input id="codex-q" type="search" placeholder="Search the Codex (Yuma, dTAO, validator…)" autocomplete="off">
            <span class="codex-search__count" data-bind="codex-count">${CODEX.length}</span>
          </label>
          <nav class="codex-page__filters" aria-label="Filter by category">
            <button class="codex-filter is-active" data-cat="all" type="button">All</button>
            ${codexByCategory().map(g => `
              <button class="codex-filter" data-cat="${g.key}" type="button">${g.label}</button>
            `).join('')}
          </nav>
        </div>
      </header>

      <div class="codex-layout">
        <!-- Sticky in-page TOC -->
        <aside class="codex-toc" aria-label="Codex table of contents">
          <h3 class="codex-toc__title">Contents</h3>
          <nav>${tocHtml()}</nav>
        </aside>

        <!-- Main body: category sections, each with an array of entry cards -->
        <main class="codex-main">
          ${bodyHtml()}
        </main>
      </div>

    </section>
  `);

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

  return { destroy(){} };
}
