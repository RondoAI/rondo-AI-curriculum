/* =================================================================
   VOICES VIEW
   -----------------------------------------------------------------
   The Bittensor who's-who. Renders every voice from
   src/data/voices.js as a card grouped by role (founders & core,
   funds & capital, subnet teams, analysts & media, the desk).
   Each card carries: brand logo, name, role, 1-2 sentence bio,
   the netuids they run, and live links to X / GitHub / their site.
   ================================================================= */

import { html, mount } from '../lib/dom.js';
import { VOICES, GROUP_LABEL } from '../data/voices.js';
import { brandChip } from '../lib/brand-monograms.js';
import { mark } from '../lib/mark.js';

const GROUP_ORDER = ['core', 'capital', 'subnet', 'media', 'magazine'];

/** Render one voice card. */
function voiceCard(v){
  /* brand logo if the voice has a brand key; otherwise a deterministic
     node-graph monogram so every card has a mark. */
  const logo = v.brand
    ? `<span class="voice__logo">${brandChip(v.brand, { size: 44 })}</span>`
    : `<span class="voice__logo voice__logo--mark">${mark(v.name, { size: 44 })}</span>`;

  const subnetPills = (v.subnets && v.subnets.length)
    ? `<div class="voice__subnets">${v.subnets.map(n =>
        `<a class="voice__sn" href="subnet.html?id=${n}">SN${n}</a>`
      ).join('')}</div>`
    : '';

  /* link row: X is required, GitHub + site are optional */
  const links = [];
  if (v.handle) links.push(`<a class="voice__link voice__link--x" href="https://x.com/${v.handle}" target="_blank" rel="noopener"><span class="voice__x">𝕏</span>@${v.handle}</a>`);
  if (v.github) links.push(`<a class="voice__link voice__link--gh" href="https://github.com/${v.github}" target="_blank" rel="noopener">GitHub</a>`);
  if (v.site)   links.push(`<a class="voice__link voice__link--site" href="${v.site}" target="_blank" rel="noopener">Site &rarr;</a>`);

  return `
    <li class="voice" id="${v.handle}">
      <header class="voice__head">
        ${logo}
        <div class="voice__id">
          <h3 class="voice__name">${v.name}</h3>
          <p class="voice__role">${v.role}</p>
        </div>
      </header>
      ${v.bio ? `<p class="voice__bio">${v.bio}</p>` : ''}
      ${subnetPills}
      <div class="voice__links">${links.join('')}</div>
    </li>
  `;
}

/**
 * @param {HTMLElement} root
 * @returns {{ destroy: () => void }}
 */
export function mountVoices(root){
  const groupBlocks = GROUP_ORDER.map(g => {
    const inGroup = VOICES.filter(v => v.group === g);
    if (!inGroup.length) return '';
    return `
      <section class="voices-group" id="${g}" aria-label="${GROUP_LABEL[g]}">
        <header class="voices-group__head">
          <span class="voices-group__count">${String(inGroup.length).padStart(2,'0')}</span>
          <h2 class="voices-group__title">${GROUP_LABEL[g]}</h2>
        </header>
        <ol class="voices-group__grid">
          ${inGroup.map(voiceCard).join('')}
        </ol>
      </section>
    `;
  }).join('');

  mount(root, html`
    <section class="voices-page" aria-label="Bittensor voices">
      <header class="voices-page__head">
        <span class="voices-page__kicker">Voices &middot; Subne<span class="tau">τ</span> Magazine</span>
        <h1 class="voices-page__title">The Bittensor who's-who.</h1>
        <p class="voices-page__dek">
          Every founder, operator, capital allocator, and analyst who moves
          the Bittensor conversation. Curated editorially. Each card links
          straight to the live source on X, GitHub, and the operator's own
          site.
        </p>
        <nav class="voices-page__nav" aria-label="Jump to group">
          ${GROUP_ORDER.filter(g => VOICES.some(v => v.group === g))
            .map(g => `<a href="#${g}">${GROUP_LABEL[g]} <span>(${VOICES.filter(v => v.group === g).length})</span></a>`)
            .join('')}
        </nav>
      </header>

      ${groupBlocks}
    </section>
  `);

  return { destroy(){} };
}
