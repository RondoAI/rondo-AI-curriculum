/* =================================================================
   SUBNET MAGAZINE, ARTICLES PAGE
   -----------------------------------------------------------------
   The research hub. Renders the curated article cards in two
   sizes (one lead card, then a grid of remaining entries) and
   embeds the active article's PDF inline so readers can scroll
   it in place without leaving the site.

   Each article header carries an identity mark: the real subnet
   logo when the piece maps to a specific subnet (pulled live from
   the 'tao:subnets' feed), otherwise the generated Subneτ Magazine
   house mark. Logos arrive asynchronously, so the view re-renders
   when the subnet feed lands.

   The URL takes an optional ?id=… to deep-link to a specific
   article; otherwise the newest article is shown.
   ================================================================= */

import { html, mount, qs } from '../lib/dom.js';
import { ARTICLES, articlesByDate, articleById } from '../data/articles.js';
import { mark } from '../lib/mark.js';

const CATEGORY_LABEL = {
  'reporting':   'REPORTING',
  'profile':     'PROFILE',
  'op-ed':       'OP-ED',
  'fund-letter': 'FUND LETTER',
  'primer':      'PRIMER',
};

function formatDate(iso){
  const d = new Date(iso + 'T00:00:00Z');
  const day = String(d.getUTCDate()).padStart(2, '0');
  const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  return `${day} ${month} ${d.getUTCFullYear()}`;
}

/**
 * @param {HTMLElement} root
 * @param {{subscribe:Function, get:Function}|null} [dataLayer]
 */
export function mountArticles(root, dataLayer = null){
  const sorted = articlesByDate();
  const params = new URLSearchParams(window.location.search);
  const wantedId = params.get('id');
  const active = (wantedId && articleById(wantedId)) || sorted[0];

  /* netuid → real logo URL, filled from the live subnet feed. */
  let subnetLogos = {};

  /**
   * Header identity mark for an article. Real subnet logo when the
   * article maps to a subnet AND the live feed has a logo for it;
   * otherwise the generated house mark. The <img> falls back to the
   * house mark if it fails to load.
   */
  function headerMark(a, size){
    const logo = a.subnet ? subnetLogos[a.subnet] : null;
    const house = mark(a.title, { size, label: (a.kicker || a.category || 'R')[0] });
    if (logo){
      return `<img class="art-logo__img" src="${logo}" alt="" width="${size}" height="${size}"
                   loading="lazy"
                   onerror="this.style.display='none';this.nextElementSibling.style.display='block'">
              <span class="art-logo__fb" style="display:none">${house}</span>`;
    }
    return house;
  }

  mount(root, html`
    <section class="articles">
      <header class="art-head">
        <div class="art-head__main">
          <span class="art-head__kicker">&lt;800&gt;  RESEARCH HUB</span>
          <h1 class="art-head__title">Long-form research on <em>decentralized intelligence.</em></h1>
          <p class="art-head__sub">
            Subnet profiles, fund letters, op-eds, primers. Original research from Subneτ
            Magazine and partners working at the intersection of decentralized infrastructure
            and frontier AI. Read inline or download the PDF.
          </p>
        </div>
        <div class="art-head__meta">
          <span class="sd-pill"><span class="live-dot"></span>NEW</span>
          <span class="sd-pill">${ARTICLES.length} ARTICLES</span>
        </div>
      </header>

      <!-- ===== Article index ===== -->
      <section class="art-index">
        <h2 class="art-index__title">Library</h2>
        <ul class="art-cards" id="art-cards"></ul>
      </section>

      <!-- ===== Active article ===== -->
      <article class="art-reader panel is-bracketed" id="art-reader">
        <!-- populated in renderActive() -->
      </article>
    </section>
  `);

  const cardsRoot = qs('#art-cards', root);
  const readerRoot = qs('#art-reader', root);

  function renderCards(){
    cardsRoot.innerHTML = sorted.map((a, i) => {
      const isActive = a.id === active.id;
      const isLead = i === 0;
      const accent = a.accent || '#FF1E3C';
      return `
        <li class="art-card ${isLead ? 'is-lead' : ''} ${isActive ? 'is-active' : ''}"
            data-id="${a.id}" style="--accent:${accent}">
          <a href="?id=${a.id}" class="art-card__link" data-id="${a.id}">
            <div class="art-card__art" aria-hidden="true">
              <span class="art-logo art-card__art-mark">${headerMark(a, 72)}</span>
            </div>
            <div class="art-card__body">
              <div class="art-card__meta">
                <span class="art-card__cat">${CATEGORY_LABEL[a.category] || a.category.toUpperCase()}</span>
                <span class="art-card__date">${formatDate(a.date)}</span>
                ${a.subnet ? `<span class="art-card__subnet">SN${a.subnet}</span>` : ''}
              </div>
              <h3 class="art-card__title">${a.title}</h3>
              <p class="art-card__tagline">${a.tagline}</p>
              <div class="art-card__foot">
                <span class="art-card__authors">${a.authors.join(' · ')}</span>
                <span class="art-card__read">${a.readMin} min</span>
              </div>
            </div>
          </a>
        </li>
      `;
    }).join('');

    cardsRoot.querySelectorAll('.art-card__link').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        const id = a.dataset.id;
        const next = articleById(id);
        if (!next) return;
        Object.assign(active, next);    // mutate active so renderActive sees it
        renderCards();
        renderActive();
        history.replaceState(null, '', `?id=${id}`);
        readerRoot.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function renderActive(){
    const a = active;
    readerRoot.innerHTML = `
      <header class="art-reader__head" style="--accent:${a.accent || '#FF1E3C'}">
        <div class="art-reader__id">
          <span class="art-logo art-reader__logo">${headerMark(a, 56)}</span>
          <div class="art-reader__id-text">
            <span class="art-reader__kicker">${CATEGORY_LABEL[a.category] || a.category.toUpperCase()}</span>
            ${a.subnet ? `<span class="art-reader__subnet">SUBNET ${a.subnet}</span>` : ''}
          </div>
        </div>
        <h2 class="art-reader__title">${a.title}</h2>
        <p class="art-reader__tagline">${a.tagline}</p>
        <div class="art-reader__meta">
          <div class="art-reader__by">
            <span class="art-reader__by-label">By</span>
            <span class="art-reader__by-name">${a.authors.join(' · ')}</span>
          </div>
          <span class="art-reader__sep">·</span>
          <span class="art-reader__date">${formatDate(a.date)}</span>
          <span class="art-reader__sep">·</span>
          <span class="art-reader__issue">${a.issue}</span>
          <span class="art-reader__sep">·</span>
          <span class="art-reader__read">${a.readMin} min read</span>
        </div>
        <div class="art-reader__tags">
          ${a.tags.map(t => `<span class="art-reader__tag">${t}</span>`).join('')}
        </div>
      </header>

      <section class="art-reader__abstract">
        <span class="art-reader__abs-label">Abstract</span>
        ${a.abstract.map(p => `<p>${p}</p>`).join('')}
      </section>

      <div class="art-reader__actions">
        <a class="art-reader__open" href="${a.pdf}" target="_blank" rel="noopener">▼ Open the full PDF</a>
        <a class="art-reader__download" href="${a.pdf}" download>Download</a>
      </div>

      <section class="art-reader__embed">
        <header class="art-reader__embed-head">
          <span>FULL PDF · INLINE</span>
          <span>${a.pdf}</span>
        </header>
        <object data="${a.pdf}#view=FitH" type="application/pdf" class="art-reader__pdf">
          <p class="art-reader__fallback">
            Your browser can't display the inline PDF.
            <a href="${a.pdf}" target="_blank" rel="noopener">Open it in a new tab →</a>
          </p>
        </object>
      </section>
    `;
  }

  renderCards();
  renderActive();

  /* Live subnet logos, re-render once the feed lands so subnet-
     scoped articles swap their house mark for the real logo. */
  let unsub = null;
  if (dataLayer){
    const onSubnets = list => {
      if (!Array.isArray(list)) return;
      const next = {};
      for (const s of list) if (s.logo) next[String(s.netuid)] = s.logo;
      subnetLogos = next;
      renderCards();
      renderActive();
    };
    unsub = dataLayer.subscribe('tao:subnets', onSubnets);
    onSubnets(dataLayer.get('tao:subnets'));
  }

  return { destroy(){ if (unsub) unsub(); } };
}
