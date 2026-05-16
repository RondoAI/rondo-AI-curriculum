/* =================================================================
   INTERVIEWS VIEW
   -----------------------------------------------------------------
   Card grid of every Subneτ Magazine video interview. Each card
   shows the thumbnail + title + guest + dek + tags. Tapping the
   thumbnail swaps it for an embedded YouTube player lazily — we
   never load the iframe until the user actually wants to watch,
   so the page itself stays light.
   ================================================================= */

import { html, mount, qsa } from '../lib/dom.js';
import { INTERVIEWS, thumbFor, embedFor } from '../data/interviews.js';

function fmtDate(iso){
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00Z');
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    year:  'numeric',
    month: 'short',
    day:   'numeric',
  }).toUpperCase();
}

/**
 * @param {HTMLElement} root
 * @returns {{ destroy: () => void }}
 */
export function mountInterviews(root){
  const cards = INTERVIEWS.map(r => html`
    <li class="interview" data-id="${r.id}" id="${r.id}">
      <div class="interview__player" data-role="player">
        <button type="button" class="interview__thumb" data-role="play" aria-label="Play ${r.title}">
          <img src="${thumbFor(r)}" alt="" loading="lazy" decoding="async" width="480" height="360">
          <span class="interview__playbtn" aria-hidden="true">
            <svg viewBox="0 0 64 64"><polygon points="22,16 22,48 50,32" fill="currentColor"/></svg>
          </span>
          ${r.duration ? `<span class="interview__dur">${r.duration}</span>` : ''}
        </button>
      </div>
      <div class="interview__body">
        <div class="interview__meta">
          <span class="interview__date">${fmtDate(r.recordedAt)}</span>
          ${r.tags.map(t => `<span class="interview__tag">${t}</span>`).join('')}
        </div>
        <h2 class="interview__title"><a href="https://youtu.be/${r.youtubeId}" target="_blank" rel="noopener">${r.title}</a></h2>
        <p class="interview__guest"><span class="interview__guest-name">${r.guest}</span> &middot; ${r.guestRole}</p>
        <p class="interview__dek">${r.dek}</p>
        <a class="interview__yt" href="https://youtu.be/${r.youtubeId}" target="_blank" rel="noopener">Watch on YouTube &rarr;</a>
      </div>
    </li>
  `).join('');

  mount(root, html`
    <section class="interviews-page" aria-label="Interviews">
      <header class="interviews-page__head">
        <span class="interviews-page__kicker">Interviews &middot; Subne<span class="tau">τ</span> Magazine</span>
        <h1 class="interviews-page__title">The conversations.</h1>
        <p class="interviews-page__dek">
          Primary-source video interviews with the founders, operators,
          and capital allocators inside the decentralized-intelligence
          economy. Recorded by Subne<span class="tau">τ</span> Magazine, hosted on
          <a href="https://www.youtube.com/@subnetmagazine" target="_blank" rel="noopener">YouTube</a>.
        </p>
      </header>

      <ul class="interviews-page__grid">
        ${cards}
      </ul>
    </section>
  `);

  /* Lazy iframe mount on first play tap — swaps the thumbnail
     button for the YouTube embed iframe. No iframe is loaded
     until the user clicks. */
  const onPlay = (e) => {
    const btn = e.target.closest('[data-role="play"]');
    if (!btn) return;
    e.preventDefault();
    const card = btn.closest('.interview');
    if (!card) return;
    const row = INTERVIEWS.find(r => r.id === card.dataset.id);
    if (!row) return;
    const player = card.querySelector('[data-role="player"]');
    if (!player) return;
    player.innerHTML = `
      <div class="interview__iframe-wrap">
        <iframe
          src="${embedFor(row, { autoplay: true })}"
          title="${row.title}"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
          loading="lazy"></iframe>
      </div>
    `;
  };
  root.addEventListener('click', onPlay);

  return {
    destroy(){
      root.removeEventListener('click', onPlay);
    },
  };
}
