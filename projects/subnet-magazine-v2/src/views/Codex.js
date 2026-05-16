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
  /* Bittensor: the three layers, chain (Subtensor) at the bottom,
     subnets in the middle, token (TAO + α) on top, with
     animated red signal lines binding them. */
  'bittensor': () => `
    <figure class="codex-info codex-info--stack" aria-label="Bittensor, three-layer architecture">
      <figcaption class="codex-info__cap">
        Three layers. Subtensor (chain) at the base, ~92 active subnets in the middle, TAO + per-subnet α tokens on top. Red signal lines bind them.
      </figcaption>
      <svg viewBox="0 0 600 240" class="codex-info__svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <linearGradient id="stackTokenG" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stop-color="#FF1E3C"/>
            <stop offset="100%" stop-color="#FF4D60"/>
          </linearGradient>
        </defs>
        <!-- Token layer (top) -->
        <g transform="translate(0,30)">
          <rect x="60" y="0" width="480" height="44" rx="3"
                fill="url(#stackTokenG)" fill-opacity=".75" stroke="#FF1E3C"/>
          <text x="300" y="22" text-anchor="middle" fill="#fff"
                font-family="Archivo, system-ui" font-weight="800" font-size="14">
            TAO + per-subnet α tokens
          </text>
          <text x="300" y="36" text-anchor="middle" fill="rgba(255,255,255,.7)"
                font-family="JetBrains Mono, monospace" font-size="8" letter-spacing="2">
            UNIT OF ACCOUNT · 21M CAP · HALVING
          </text>
        </g>
        <!-- Subnets layer (middle) -->
        <g transform="translate(0,100)">
          ${Array.from({length: 10}).map((_, i) => {
            const x = 64 + i * 48;
            return `<rect x="${x}" y="0" width="42" height="44" rx="3"
                         fill="rgba(255,30,60,.10)" stroke="#FF1E3C" stroke-opacity=".5"/>
                    <text x="${x + 21}" y="20" text-anchor="middle" fill="#FF4D60"
                          font-family="JetBrains Mono, monospace" font-weight="700" font-size="8">SN${i + 1}</text>
                    <text x="${x + 21}" y="32" text-anchor="middle" fill="#F5E5E8"
                          font-family="JetBrains Mono, monospace" font-size="6" opacity=".8">market</text>`;
          }).join('')}
          <text x="300" y="58" text-anchor="middle" fill="#FF1E3C"
                font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" letter-spacing="2">
            ~92 ACTIVE SUBNETS · INDEPENDENT MARKETS
          </text>
        </g>
        <!-- Chain layer (bottom) -->
        <g transform="translate(0,180)">
          <rect x="60" y="0" width="480" height="44" rx="3"
                fill="rgba(255,30,60,.05)" stroke="#FF1E3C" stroke-opacity=".6"/>
          <text x="300" y="22" text-anchor="middle" fill="#F5E5E8"
                font-family="Archivo, system-ui" font-weight="800" font-size="14">
            Subtensor chain
          </text>
          <text x="300" y="36" text-anchor="middle" fill="#C8A8AD"
                font-family="JetBrains Mono, monospace" font-size="8" letter-spacing="2">
            STAKE · WEIGHTS · EMISSIONS · 12s BLOCK
          </text>
        </g>
        <!-- vertical pulse lines binding the layers -->
        ${[120, 200, 280, 360, 440].map((x, i) => `
          <line class="codex-info__pulse-line"
                x1="${x}" y1="74" x2="${x}" y2="100"
                stroke="#FF1E3C" stroke-width="1" stroke-opacity=".6"
                style="--d:${i * 0.18}s"/>
          <line class="codex-info__pulse-line"
                x1="${x}" y1="144" x2="${x}" y2="180"
                stroke="#FF1E3C" stroke-width="1" stroke-opacity=".6"
                style="--d:${i * 0.18 + 0.4}s"/>
        `).join('')}
      </svg>
    </figure>
  `,

  /* TAO: halving timeline + emission split donut */
  'tao': () => `
    <figure class="codex-info codex-info--tao" aria-label="TAO emission and halvings">
      <figcaption class="codex-info__cap">
        Halving schedule, every 4 years the per-block emission halves, asymptotically approaching the 21M supply cap.
      </figcaption>
      <svg viewBox="0 0 600 200" class="codex-info__svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <!-- axis -->
        <line x1="40" y1="160" x2="560" y2="160" stroke="#3a1419" stroke-width="1"/>
        ${[2021, 2025, 2029, 2033, 2037, 2041].map((y, i) => {
          const x = 40 + i * 104;
          return `<line x1="${x}" y1="160" x2="${x}" y2="166" stroke="#3a1419" stroke-width="1"/>
                  <text x="${x}" y="180" text-anchor="middle" fill="#8B6B70"
                        font-family="JetBrains Mono, monospace" font-size="9">${y}</text>`;
        }).join('')}
        <!-- emission curve, halvings as drops every 104px -->
        ${[
          { x: 40,  y: 30,  h: 130 },  // launch ~7200/day target
          { x: 144, y: 95,  h: 65 },   // halving 1 (~2025): 50%
          { x: 248, y: 128, h: 32 },   // halving 2 (~2029): 25%
          { x: 352, y: 144, h: 16 },   // halving 3 (~2033)
          { x: 456, y: 152, h: 8 },    // halving 4 (~2037)
          { x: 560, y: 156, h: 4 },    // halving 5
        ].map((d, i) => `
          <rect x="${d.x - 14}" y="${d.y}" width="28" height="${d.h}" rx="2"
                fill="#FF1E3C" fill-opacity="${0.92 - i * 0.12}"/>
          <text x="${d.x}" y="${d.y - 6}" text-anchor="middle" fill="#FF4D60"
                font-family="JetBrains Mono, monospace" font-size="9" font-weight="700">
            ${[7200, 3600, 1800, 900, 450, 225][i]}τ
          </text>
        `).join('')}
        <text x="300" y="20" text-anchor="middle" fill="#FF1E3C"
              font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" letter-spacing="2">
          DAILY EMISSION · τ / DAY
        </text>
      </svg>
    </figure>
  `,

  /* dTAO: bonding curve, price as a function of supply */
  'dtao': () => `
    <figure class="codex-info codex-info--dtao" aria-label="dTAO bonding curve">
      <figcaption class="codex-info__cap">
        How α-price floats against TAO. As capital bonds into a subnet (right on x), α-price rises (up on y), pulling emission share toward that subnet, attracting more capital. Self-reinforcing.
      </figcaption>
      <svg viewBox="0 0 600 240" class="codex-info__svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <!-- axes -->
        <line x1="60" y1="200" x2="560" y2="200" stroke="#3a1419"/>
        <line x1="60" y1="40"  x2="60"  y2="200" stroke="#3a1419"/>
        <text x="310" y="225" text-anchor="middle" fill="#8B6B70"
              font-family="JetBrains Mono, monospace" font-size="9" letter-spacing="2">
          α CIRCULATING SUPPLY →
        </text>
        <text x="22" y="120" text-anchor="middle" fill="#8B6B70"
              font-family="JetBrains Mono, monospace" font-size="9" letter-spacing="2"
              transform="rotate(-90, 22, 120)">α PRICE (vs TAO) →</text>
        <!-- bonding curve, simple sqrt-style -->
        <path d="M 60 200 Q 200 180 280 130 T 560 50"
              fill="none" stroke="#FF1E3C" stroke-width="2.5"/>
        <!-- area under curve, glow fill -->
        <path d="M 60 200 Q 200 180 280 130 T 560 50 L 560 200 Z"
              fill="#FF1E3C" fill-opacity=".10"/>
        <!-- pulse dot traveling along curve -->
        <circle r="5" fill="#fff">
          <animateMotion dur="6s" repeatCount="indefinite"
                         path="M 60 200 Q 200 180 280 130 T 560 50"/>
        </circle>
        <circle r="11" fill="none" stroke="#FF1E3C" stroke-width="1.2">
          <animateMotion dur="6s" repeatCount="indefinite"
                         path="M 60 200 Q 200 180 280 130 T 560 50"/>
          <animate attributeName="r" values="6;18;6" dur="6s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values=".9;0;.9" dur="6s" repeatCount="indefinite"/>
        </circle>
      </svg>
    </figure>
  `,

  /* Emission: per-block allocation across subnets, illustrated as
     bars that pulse height to indicate live flow */
  'emission': () => `
    <figure class="codex-info codex-info--emit" aria-label="Per-block emission flow">
      <figcaption class="codex-info__cap">
        Every block (~12s), the chain mints ~7,200 τ/day and splits it across subnets in proportion to each subnet's α-MCAP. Bars pulse to indicate live block flow.
      </figcaption>
      <svg viewBox="0 0 600 200" class="codex-info__svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <text x="300" y="14" text-anchor="middle" fill="#FF1E3C"
              font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" letter-spacing="2">
          EMISSION FLOW · ALPHA-MCAP-WEIGHTED · ~12s BLOCK
        </text>
        <!-- 10 subnet bars, each pulse-animated independently -->
        ${[78, 62, 50, 44, 38, 32, 28, 22, 18, 14].map((h, i) => {
          const x = 50 + i * 52;
          return `
            <g class="codex-info__emit-bar" style="--i:${i}">
              <rect x="${x}" y="${180 - h}" width="40" height="${h}" rx="2"
                    fill="#FF1E3C" fill-opacity=".82" transform-origin="center bottom"/>
              <text x="${x + 20}" y="192" text-anchor="middle" fill="#C8A8AD"
                    font-family="JetBrains Mono, monospace" font-size="8">SN${i + 1}</text>
              <text x="${x + 20}" y="${180 - h - 4}" text-anchor="middle" fill="#FF4D60"
                    font-family="JetBrains Mono, monospace" font-size="7" font-weight="700">${[14, 11, 9, 7, 6, 5, 4, 3, 2, 2][i]}%</text>
            </g>
          `;
        }).join('')}
      </svg>
    </figure>
  `,

  /* Subnet: category breakdown donut */
  'subnet': () => `
    <figure class="codex-info codex-info--sn" aria-label="Subnet category breakdown">
      <figcaption class="codex-info__cap">
        92 active subnets, by primary category. Text and inference still dominate; agents and training are the fastest-growing groups.
      </figcaption>
      <svg viewBox="0 0 600 240" class="codex-info__svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        ${(() => {
          const cats = [
            { l: 'TEXT',      n: 24, op: .95 },
            { l: 'INFERENCE', n: 18, op: .82 },
            { l: 'TRAINING',  n: 14, op: .70 },
            { l: 'INFRA',     n: 12, op: .58 },
            { l: 'AGENTS',    n: 10, op: .46 },
            { l: 'DATA',      n:  6, op: .34 },
            { l: 'FINANCE',   n:  5, op: .26 },
            { l: 'OTHER',     n:  3, op: .18 },
          ];
          const total = cats.reduce((s, c) => s + c.n, 0);
          const cx = 120, cy = 120, R = 88, r = 56;
          let cum = -90;
          const arcs = cats.map(c => {
            const sweep = (c.n / total) * 360;
            const start = cum, end = cum + sweep;
            cum = end;
            const sx = cx + R * Math.cos(start * Math.PI / 180);
            const sy = cy + R * Math.sin(start * Math.PI / 180);
            const ex = cx + R * Math.cos(end * Math.PI / 180);
            const ey = cy + R * Math.sin(end * Math.PI / 180);
            const ix = cx + r * Math.cos(end * Math.PI / 180);
            const iy = cy + r * Math.sin(end * Math.PI / 180);
            const ix2 = cx + r * Math.cos(start * Math.PI / 180);
            const iy2 = cy + r * Math.sin(start * Math.PI / 180);
            const large = sweep > 180 ? 1 : 0;
            return `<path d="M ${sx.toFixed(1)} ${sy.toFixed(1)}
                       A ${R} ${R} 0 ${large} 1 ${ex.toFixed(1)} ${ey.toFixed(1)}
                       L ${ix.toFixed(1)} ${iy.toFixed(1)}
                       A ${r} ${r} 0 ${large} 0 ${ix2.toFixed(1)} ${iy2.toFixed(1)} Z"
                       fill="#FF1E3C" fill-opacity="${c.op}"/>`;
          }).join('');
          const legend = cats.map((c, i) => `
            <g transform="translate(260, ${30 + i * 24})">
              <rect width="14" height="14" fill="#FF1E3C" fill-opacity="${c.op}"/>
              <text x="22" y="11" fill="#F5E5E8"
                    font-family="JetBrains Mono, monospace" font-size="10" font-weight="700">${c.l}</text>
              <text x="220" y="11" text-anchor="end" fill="#FF4D60"
                    font-family="JetBrains Mono, monospace" font-size="10" font-weight="700">${c.n}</text>
            </g>
          `).join('');
          return arcs + legend + `<text x="${cx}" y="${cy - 4}" text-anchor="middle" fill="#F5E5E8"
                                       font-family="JetBrains Mono, monospace" font-size="22" font-weight="800">${total}</text>
                                  <text x="${cx}" y="${cy + 14}" text-anchor="middle" fill="#FF4D60"
                                       font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" letter-spacing="2">ACTIVE</text>`;
        })()}
      </svg>
    </figure>
  `,

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
      <header class="codex-hero" aria-label="Subnet Oracle">
        <div class="codex-hero__viz" aria-hidden="true">
          <canvas data-canvas="codex-mark"></canvas>
        </div>
        <div class="codex-hero__body">
          <span class="codex-hero__kicker">Subne<span class="tau">τ</span> Oracle &middot; Subne<span class="tau">τ</span> Magazine</span>
          <h1 class="codex-hero__title">Ask the Oracle.</h1>
          <p class="codex-hero__dek">
            Every concept, mechanism, role, and event inside Bittensor. Written
            to be read, sourced so the claims are checkable, drawn so the
            ideas land. Talk to the Oracle, get an answer with citations.
          </p>

          <!-- Ask the Oracle, LLM-style input bar (also opens chat) -->
          <form class="codex-ask" data-role="ask" autocomplete="off">
            <span class="codex-ask__lbl">Ask the Oracle</span>
            <input id="codex-q" type="search" class="codex-ask__input"
                   placeholder="What is Yuma Consensus? How does dTAO work? Show me the leaderboard."
                   spellcheck="false" autocomplete="off">
            <button type="submit" class="codex-ask__send" aria-label="Ask">
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

      <!-- ===== FLOATING CHAT (the Oracle, interactive) ===== -->
      <aside class="oracle-chat" data-role="chat" aria-label="Ask the Oracle">
        <button type="button" class="oracle-chat__open" data-role="chat-open"
                aria-label="Open the Oracle chat">
          <span class="oracle-chat__open-mark" aria-hidden="true">
            <svg viewBox="0 0 28 28">
              <circle cx="14" cy="14" r="11" fill="none" stroke="currentColor" stroke-width="1.2" stroke-opacity=".4"/>
              <circle cx="14" cy="14" r="2.5" fill="#fff"/>
              <circle cx="14" cy="6"  r="1.4" fill="currentColor"/>
              <circle cx="22" cy="14" r="1.4" fill="currentColor"/>
              <circle cx="14" cy="22" r="1.4" fill="currentColor"/>
              <circle cx="6"  cy="14" r="1.4" fill="currentColor"/>
              <line x1="14" y1="14" x2="14" y2="6"  stroke="currentColor" stroke-width=".8" stroke-opacity=".6"/>
              <line x1="14" y1="14" x2="22" y2="14" stroke="currentColor" stroke-width=".8" stroke-opacity=".6"/>
              <line x1="14" y1="14" x2="14" y2="22" stroke="currentColor" stroke-width=".8" stroke-opacity=".6"/>
              <line x1="14" y1="14" x2="6"  y2="14" stroke="currentColor" stroke-width=".8" stroke-opacity=".6"/>
            </svg>
          </span>
          <span class="oracle-chat__open-lbl">Ask</span>
        </button>
        <div class="oracle-chat__panel" data-role="chat-panel" hidden>
          <header class="oracle-chat__head">
            <div class="oracle-chat__title">
              <span class="oracle-chat__live"><span class="dot dot--live"></span>LIVE</span>
              <span>Subne<span class="tau">τ</span> Oracle</span>
            </div>
            <button type="button" class="oracle-chat__close" data-role="chat-close" aria-label="Close">×</button>
          </header>
          <div class="oracle-chat__log" data-role="chat-log">
            <div class="oracle-msg oracle-msg--bot">
              <span class="oracle-msg__who">Oracle</span>
              <p>I know the Bittensor network. Ask me anything, what a concept means, who runs which subnet, how a mechanism works. I'll cite the entries I'm drawing from so you can verify.</p>
            </div>
          </div>
          <form class="oracle-chat__form" data-role="chat-form" autocomplete="off">
            <input type="text" class="oracle-chat__input" data-role="chat-input"
                   placeholder="Ask the Oracle, e.g. 'How does dTAO work?'"
                   spellcheck="false" autocomplete="off">
            <button type="submit" class="oracle-chat__send" aria-label="Send">
              <svg viewBox="0 0 24 24" width="18" height="18"><path d="M4 12h14M14 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          </form>
          <p class="oracle-chat__note">
            Drawing from the Oracle entries on this page. A direct Claude
            link arrives when there's a key to plumb through safely.
          </p>
        </div>
      </aside>

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

  /* ---------- chat panel: open / close / send ---------- */
  const chatOpen   = qs('[data-role="chat-open"]', root);
  const chatClose  = qs('[data-role="chat-close"]', root);
  const chatPanel  = qs('[data-role="chat-panel"]', root);
  const chatLog    = qs('[data-role="chat-log"]', root);
  const chatForm   = qs('[data-role="chat-form"]', root);
  const chatInput  = qs('[data-role="chat-input"]', root);
  const chatWrap   = qs('[data-role="chat"]', root);

  function setChatOpen(open){
    if (!chatPanel) return;
    chatPanel.hidden = !open;
    chatWrap?.classList.toggle('is-open', !!open);
    if (open) setTimeout(() => chatInput?.focus(), 100);
  }
  chatOpen?.addEventListener('click', () => setChatOpen(true));
  chatClose?.addEventListener('click', () => setChatOpen(false));

  /* Tiny scorer that finds the codex entry most relevant to a
     free-text question. Tokenises the query, scores each entry
     by token hits across title (x4), oneLine (x2), section
     headings (x2), and section body (x1). Stopwords stripped.
     Returns the top 2 matches. */
  const STOP = new Set('a an and are as at be by do does for from how i in is it of on or that the to what when where which who whose why with you your yours'.split(' '));
  function findBest(q){
    if (!q) return [];
    const toks = q.toLowerCase().replace(/[^a-z0-9α\s]/g, ' ').split(/\s+/).filter(t => t && !STOP.has(t) && t.length > 1);
    if (!toks.length) return [];
    const scored = CODEX.map(e => {
      const title = e.title.toLowerCase();
      const one   = (e.oneLine || '').toLowerCase();
      const heads = (e.sections || []).map(s => (s.h || '').toLowerCase()).join(' ');
      const body  = (e.sections || []).map(s => (s.body || '').toLowerCase()).join(' ');
      let score = 0;
      toks.forEach(t => {
        if (title.includes(t)) score += 4;
        if (one.includes(t))   score += 2;
        if (heads.includes(t)) score += 2;
        if (body.includes(t))  score += 1;
      });
      return { e, score };
    }).filter(r => r.score > 0).sort((a, b) => b.score - a.score);
    return scored.slice(0, 2).map(r => r.e);
  }

  function appendMsg(who, html){
    if (!chatLog) return;
    const el = document.createElement('div');
    el.className = 'oracle-msg oracle-msg--' + (who === 'you' ? 'you' : 'bot');
    el.innerHTML = `<span class="oracle-msg__who">${who === 'you' ? 'You' : 'Oracle'}</span>${html}`;
    chatLog.appendChild(el);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  chatForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = (chatInput?.value || '').trim();
    if (!q) return;
    appendMsg('you', `<p>${escapeHtml(q)}</p>`);
    chatInput.value = '';
    /* simulated thinking + answer */
    const thinking = document.createElement('div');
    thinking.className = 'oracle-msg oracle-msg--bot oracle-msg--thinking';
    thinking.innerHTML = `<span class="oracle-msg__who">Oracle</span><p><span class="oracle-msg__dots"><span></span><span></span><span></span></span></p>`;
    chatLog.appendChild(thinking);
    chatLog.scrollTop = chatLog.scrollHeight;
    setTimeout(() => {
      thinking.remove();
      const hits = findBest(q);
      if (!hits.length){
        appendMsg('bot', `<p>I don't have an entry that matches that yet. Try a concept like <em>Yuma Consensus</em>, <em>dTAO</em>, <em>α token</em>, or a role like <em>miner</em> / <em>validator</em>.</p>`);
        return;
      }
      const first = hits[0];
      const second = hits[1];
      const refs = hits.map(h => `<a href="#${h.id}" data-jump="${h.id}">${escapeHtml(h.title)}</a>`).join(' · ');
      const moreLine = second
        ? `<p class="oracle-msg__more">Related: ${refs}</p>`
        : `<p class="oracle-msg__more">More: <a href="#${first.id}" data-jump="${first.id}">${escapeHtml(first.title)}</a></p>`;
      appendMsg('bot', `
        <p><strong>${escapeHtml(first.title)}.</strong> ${first.oneLine}</p>
        ${moreLine}
      `);
    }, 380);
  });

  return {
    destroy(){
      markSphere?.destroy();
      leaderSparks.splice(0).forEach(sp => { try { sp.destroy(); } catch (_) {} });
      unsubs.forEach(u => u());
    },
  };
}
