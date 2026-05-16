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

  /* Subtensor: the Substrate chain. 7 blocks marching across with
     12s timestamps, validator hotkeys orbiting, weight-set windows
     marked. */
  'subtensor': () => `
    <figure class="codex-info codex-info--chain" aria-label="Subtensor chain, block production">
      <figcaption class="codex-info__cap">
        The Substrate-based chain that anchors everything. 12-second block time, validator hotkeys produce blocks in turn, weights are committed every 100 blocks (~20 minutes).
      </figcaption>
      <svg viewBox="0 0 600 220" class="codex-info__svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <text x="300" y="14" text-anchor="middle" fill="#FF1E3C"
              font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" letter-spacing="2">
          BLOCK CHAIN · 12s INTERVAL · WEIGHT WINDOW EVERY 100 BLOCKS
        </text>
        ${[0,1,2,3,4,5,6].map(i => {
          const x = 40 + i * 78;
          const isWeightSet = i === 0 || i === 5;
          return `
            <g class="codex-info__validator" style="--i:${i}">
              <rect x="${x}" y="60" width="64" height="64" rx="3"
                    fill="${isWeightSet ? 'rgba(255,30,60,.18)' : 'rgba(255,30,60,.06)'}"
                    stroke="#FF1E3C" stroke-opacity="${isWeightSet ? '.9' : '.4'}" stroke-width="${isWeightSet ? 1.6 : 1}"/>
              <text x="${x + 32}" y="80" text-anchor="middle" fill="#F5E5E8"
                    font-family="JetBrains Mono, monospace" font-size="9" font-weight="700">B${8190123 + i}</text>
              <text x="${x + 32}" y="96" text-anchor="middle" fill="#C8A8AD"
                    font-family="JetBrains Mono, monospace" font-size="7">0x${(i * 7919 + 0x9f).toString(16).padStart(4,'0')}…</text>
              <text x="${x + 32}" y="112" text-anchor="middle" fill="#FF4D60"
                    font-family="JetBrains Mono, monospace" font-size="7" font-weight="700">${isWeightSet ? 'WEIGHT' : 'tx'} </text>
              ${i < 6 ? `<line class="codex-info__pulse-line" x1="${x + 64}" y1="92" x2="${x + 78}" y2="92" stroke="#FF1E3C" stroke-width="1.4" style="--d:${i*.12}s"/>` : ''}
              <text x="${x + 32}" y="140" text-anchor="middle" fill="#8B6B70"
                    font-family="JetBrains Mono, monospace" font-size="7">T+${i * 12}s</text>
            </g>
          `;
        }).join('')}
        <g transform="translate(0,170)">
          <text x="40" y="0" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="8" letter-spacing="2">STAKE</text>
          <text x="40" y="14" fill="#F5E5E8" font-family="JetBrains Mono, monospace" font-size="11" font-weight="800">5.6M τ</text>
          <text x="180" y="0" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="8" letter-spacing="2">VALIDATORS</text>
          <text x="180" y="14" fill="#F5E5E8" font-family="JetBrains Mono, monospace" font-size="11" font-weight="800">256 / subnet</text>
          <text x="380" y="0" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="8" letter-spacing="2">MINERS</text>
          <text x="380" y="14" fill="#F5E5E8" font-family="JetBrains Mono, monospace" font-size="11" font-weight="800">~8K active</text>
        </g>
      </svg>
    </figure>
  `,

  /* Alpha: the bonding curve again but framed as the per-subnet
     token mechanics. TAO in (left tube), alpha out (right tube),
     pool reserves in the middle. */
  'alpha': () => `
    <figure class="codex-info codex-info--alpha" aria-label="Alpha token, TAO swap mechanic">
      <figcaption class="codex-info__cap">
        Each subnet has its own α token, swapped against TAO through a per-subnet bonding pool. Bond TAO into the pool, receive α at the current curve price; unbond α, receive TAO back at the (then-current) curve price.
      </figcaption>
      <svg viewBox="0 0 600 240" class="codex-info__svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <linearGradient id="alphaTau" x1="0" x2="1">
            <stop offset="0%" stop-color="#FF1E3C" stop-opacity=".95"/>
            <stop offset="100%" stop-color="#FF1E3C" stop-opacity=".2"/>
          </linearGradient>
          <linearGradient id="alphaAlpha" x1="0" x2="1">
            <stop offset="0%" stop-color="#FFB85C" stop-opacity=".2"/>
            <stop offset="100%" stop-color="#FFB85C" stop-opacity=".95"/>
          </linearGradient>
        </defs>
        <!-- TAO tube (left, flowing right) -->
        <rect x="40" y="80" width="180" height="40" rx="6" fill="url(#alphaTau)"/>
        <text x="130" y="70" text-anchor="middle" fill="#FF4D60"
              font-family="Archivo, system-ui" font-size="14" font-weight="800">τ TAO</text>
        <text x="130" y="135" text-anchor="middle" fill="#8B6B70"
              font-family="JetBrains Mono, monospace" font-size="8" letter-spacing="2">BONDS IN</text>
        <!-- Pool (middle) -->
        <g transform="translate(260,60)">
          <rect x="0" y="0" width="80" height="80" rx="6"
                fill="rgba(255,30,60,.08)" stroke="#FF1E3C" stroke-opacity=".8" stroke-width="1.6"/>
          <text x="40" y="32" text-anchor="middle" fill="#F5E5E8"
                font-family="Archivo, system-ui" font-size="12" font-weight="800">POOL</text>
          <text x="40" y="48" text-anchor="middle" fill="#FF4D60"
                font-family="JetBrains Mono, monospace" font-size="9" font-weight="700">x · y = k</text>
          <text x="40" y="62" text-anchor="middle" fill="#C8A8AD"
                font-family="JetBrains Mono, monospace" font-size="7">τ + α reserves</text>
        </g>
        <!-- Alpha tube (right, flowing right) -->
        <rect x="380" y="80" width="180" height="40" rx="6" fill="url(#alphaAlpha)"/>
        <text x="470" y="70" text-anchor="middle" fill="#FFB85C"
              font-family="Archivo, system-ui" font-size="14" font-weight="800">α (subnet)</text>
        <text x="470" y="135" text-anchor="middle" fill="#8B6B70"
              font-family="JetBrains Mono, monospace" font-size="8" letter-spacing="2">FLOWS OUT</text>
        <!-- pulses traveling left-to-right -->
        <circle r="4" fill="#fff">
          <animateMotion dur="3.2s" repeatCount="indefinite"
                         path="M 40 100 L 260 100"/>
        </circle>
        <circle r="4" fill="#FFB85C">
          <animateMotion dur="3.2s" repeatCount="indefinite" begin="1.6s"
                         path="M 340 100 L 560 100"/>
        </circle>
        <!-- Price annotation -->
        <g transform="translate(0,170)">
          <text x="40" y="0" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="8" letter-spacing="2">α PRICE = τ RESERVE / α RESERVE</text>
          <text x="40" y="20" fill="#F5E5E8" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">more τ bonded → α price rises → emission share grows → cycle</text>
          <text x="40" y="40" fill="#FF4D60" font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" letter-spacing="2">↗ ENDOGENOUS DEMAND SIGNAL</text>
        </g>
      </svg>
    </figure>
  `,

  /* Halving: emission per block over time, with vertical drop lines
     at each halving event and cumulative supply curve overlay. */
  'halving': () => `
    <figure class="codex-info codex-info--halve" aria-label="TAO halving schedule">
      <figcaption class="codex-info__cap">
        Per-block emission halves roughly every 4 years (210K blocks at 12s). Cumulative supply (yellow) asymptotes at 21M τ; the next halving is the highest-leverage event in the network's calendar.
      </figcaption>
      <svg viewBox="0 0 600 240" class="codex-info__svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <!-- axes -->
        <line x1="50" y1="200" x2="560" y2="200" stroke="#3a1419"/>
        <line x1="50" y1="30"  x2="50"  y2="200" stroke="#3a1419"/>
        ${[2021, 2025, 2029, 2033, 2037, 2041].map((y, i) => {
          const x = 50 + i * 102;
          return `<text x="${x}" y="218" text-anchor="middle" fill="#8B6B70"
                        font-family="JetBrains Mono, monospace" font-size="9">${y}</text>
                  <line x1="${x}" y1="200" x2="${x}" y2="${i === 0 ? 60 : 90 + i * 20}"
                        stroke="#FF1E3C" stroke-opacity=".2" stroke-dasharray="2,3"/>`;
        }).join('')}
        <!-- per-block emission step function -->
        ${[
          { x1: 50,  x2: 152, y: 60 },
          { x1: 152, x2: 254, y: 110 },
          { x1: 254, x2: 356, y: 143 },
          { x1: 356, x2: 458, y: 162 },
          { x1: 458, x2: 560, y: 175 },
        ].map((s, i) => `
          <line x1="${s.x1}" y1="${s.y}" x2="${s.x2}" y2="${s.y}"
                stroke="#FF1E3C" stroke-width="2.5" stroke-opacity="${0.95 - i*0.12}"/>
          ${i > 0 ? `<line x1="${s.x1}" y1="${i === 1 ? 60 : (s.y - 33)}" x2="${s.x1}" y2="${s.y}"
                       stroke="#FF1E3C" stroke-width="2" stroke-opacity="${0.95 - i*0.1}"/>` : ''}
          <text x="${(s.x1 + s.x2) / 2}" y="${s.y - 6}" text-anchor="middle" fill="#FF4D60"
                font-family="JetBrains Mono, monospace" font-size="8" font-weight="700">${[7200, 3600, 1800, 900, 450][i]} τ/day</text>
        `).join('')}
        <!-- cumulative supply (yellow asymptote) -->
        <path d="M 50 198 Q 200 130 300 90 T 560 50"
              fill="none" stroke="#FFB85C" stroke-width="1.8" stroke-dasharray="4,3"/>
        <text x="555" y="44" text-anchor="end" fill="#FFB85C"
              font-family="JetBrains Mono, monospace" font-size="9" font-weight="700">→ 21M τ cap</text>
        <text x="55" y="22" fill="#FF4D60"
              font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" letter-spacing="2">PER-BLOCK EMISSION</text>
      </svg>
    </figure>
  `,

  /* Weight: a matrix grid showing validators (rows) scoring miners
     (columns), with cell intensity = weight. The bonding/aggregation
     concept made concrete. */
  'weight': () => `
    <figure class="codex-info codex-info--weight" aria-label="Validator weight matrix">
      <figcaption class="codex-info__cap">
        Each validator (row) publishes a vector of weights scoring every miner (column). The chain aggregates these vectors into the consensus weight, which determines emission. Intensity = weight magnitude.
      </figcaption>
      <svg viewBox="0 0 600 260" class="codex-info__svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <text x="300" y="14" text-anchor="middle" fill="#FF1E3C"
              font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" letter-spacing="2">
          WEIGHT MATRIX · 6 VALIDATORS × 12 MINERS · STAKE-WEIGHTED MEDIAN
        </text>
        <!-- column headers (miners) -->
        ${Array.from({length: 12}).map((_, j) => `
          <text x="${110 + j * 36}" y="34" text-anchor="middle" fill="#8B6B70"
                font-family="JetBrains Mono, monospace" font-size="8">M${j+1}</text>
        `).join('')}
        <!-- 6 rows × 12 cols of weight cells -->
        ${(() => {
          const rng = (s) => { let x = s; return () => { x = (x * 9301 + 49297) % 233280; return x / 233280; }; };
          const r = rng(7);
          let svg = '';
          for (let i = 0; i < 6; i++){
            svg += `<text x="80" y="${64 + i * 28}" text-anchor="end" fill="#F5E5E8"
                          font-family="JetBrains Mono, monospace" font-size="9" font-weight="700">V${i+1}</text>`;
            svg += `<text x="80" y="${75 + i * 28}" text-anchor="end" fill="#8B6B70"
                          font-family="JetBrains Mono, monospace" font-size="7">${[28,33,12,9,18,15][i]}K τ</text>`;
            for (let j = 0; j < 12; j++){
              const w = r();
              const op = (w * 0.95).toFixed(2);
              svg += `<rect x="${94 + j * 36}" y="${48 + i * 28}" width="32" height="22" rx="2"
                            fill="#FF1E3C" fill-opacity="${op}"/>`;
              if (w > 0.65) svg += `<text x="${110 + j * 36}" y="${62 + i * 28}" text-anchor="middle" fill="#fff"
                                          font-family="JetBrains Mono, monospace" font-size="7" font-weight="700">${(w * 100).toFixed(0)}</text>`;
            }
          }
          return svg;
        })()}
        <!-- aggregation arrow -->
        <line x1="300" y1="220" x2="300" y2="238" stroke="#FF1E3C" stroke-width="1.5"/>
        <polygon points="295,234 305,234 300,242" fill="#FF1E3C"/>
        <text x="300" y="256" text-anchor="middle" fill="#FF4D60"
              font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" letter-spacing="2">
          → CONSENSUS WEIGHT VECTOR → EMISSION
        </text>
      </svg>
    </figure>
  `,

  /* Miner: lifecycle loop. Register → serve → answer query →
     scored → emission share. The economic loop, animated. */
  'miner': () => `
    <figure class="codex-info codex-info--miner" aria-label="Miner lifecycle">
      <figcaption class="codex-info__cap">
        The miner's economic loop. Pay τ to register, serve a model, answer validator queries, get scored, receive emission proportional to score. Quiet miners get pruned.
      </figcaption>
      <svg viewBox="0 0 600 220" class="codex-info__svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <marker id="minerArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 z" fill="#FF1E3C"/>
          </marker>
        </defs>
        ${(() => {
          const nodes = [
            { x: 90,  y: 110, label: 'REGISTER',  sub: 'pay τ_burn', icon: 'τ' },
            { x: 215, y: 60,  label: 'SERVE',     sub: 'model up',    icon: 'M' },
            { x: 340, y: 60,  label: 'QUERY',     sub: 'validator',   icon: 'Q' },
            { x: 465, y: 110, label: 'SCORED',    sub: 'weight',      icon: '⊙' },
            { x: 340, y: 160, label: 'EMISSION',  sub: 'α per epoch', icon: 'α' },
            { x: 215, y: 160, label: 'OR PRUNED', sub: 'low score',   icon: '✕' },
          ];
          const edges = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]];
          let svg = '';
          edges.forEach(([a, b], i) => {
            const na = nodes[a], nb = nodes[b];
            svg += `<line x1="${na.x + 36}" y1="${na.y}" x2="${nb.x - 36}" y2="${nb.y}"
                          stroke="#FF1E3C" stroke-opacity=".55" stroke-width="1.4"
                          marker-end="url(#minerArrow)"
                          class="codex-info__pulse-line" style="--d:${i*.16}s"/>`;
          });
          nodes.forEach(n => {
            svg += `<circle cx="${n.x}" cy="${n.y}" r="32"
                            fill="rgba(255,30,60,.10)" stroke="#FF1E3C" stroke-width="1.4"/>`;
            svg += `<text x="${n.x}" y="${n.y - 8}" text-anchor="middle" fill="#FF4D60"
                          font-family="Archivo, system-ui" font-size="18" font-weight="800">${n.icon}</text>`;
            svg += `<text x="${n.x}" y="${n.y + 8}" text-anchor="middle" fill="#F5E5E8"
                          font-family="JetBrains Mono, monospace" font-size="8" font-weight="700">${n.label}</text>`;
            svg += `<text x="${n.x}" y="${n.y + 20}" text-anchor="middle" fill="#8B6B70"
                          font-family="JetBrains Mono, monospace" font-size="7">${n.sub}</text>`;
          });
          return svg;
        })()}
      </svg>
    </figure>
  `,

  /* Validator: dual role. Stake (top) → query miners (middle) →
     score & set weights (bottom). Emission flows back to the
     validator proportional to consensus alignment. */
  'validator': () => `
    <figure class="codex-info codex-info--val" aria-label="Validator role and reward">
      <figcaption class="codex-info__cap">
        Validators stake τ, query miners on schedule, score the responses, and submit weight vectors. The chain pays them in proportion to how well their weights align with the consensus (Yuma).
      </figcaption>
      <svg viewBox="0 0 600 240" class="codex-info__svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <!-- validator hex (top center) -->
        <g transform="translate(300,46)">
          <polygon points="-50,0 -25,-36 25,-36 50,0 25,36 -25,36"
                   fill="rgba(255,30,60,.18)" stroke="#FF1E3C" stroke-width="1.6"/>
          <text y="-6" text-anchor="middle" fill="#F5E5E8"
                font-family="Archivo, system-ui" font-size="13" font-weight="800">VALIDATOR</text>
          <text y="10" text-anchor="middle" fill="#FF4D60"
                font-family="JetBrains Mono, monospace" font-size="8" font-weight="700">28K τ STAKED</text>
          <text y="24" text-anchor="middle" fill="#C8A8AD"
                font-family="JetBrains Mono, monospace" font-size="7">hotkey: 5HG…wf2K</text>
        </g>
        <!-- 6 miners across the bottom -->
        ${Array.from({length: 6}).map((_, i) => {
          const x = 70 + i * 92;
          const score = [82, 64, 91, 33, 76, 58][i];
          return `
            <g class="codex-info__validator" style="--i:${i}" transform="translate(${x},170)">
              <rect x="-30" y="0" width="60" height="40" rx="3"
                    fill="rgba(255,30,60,.05)" stroke="#FF1E3C" stroke-opacity=".4"/>
              <text y="16" text-anchor="middle" fill="#F5E5E8"
                    font-family="JetBrains Mono, monospace" font-size="9" font-weight="700">M${i+1}</text>
              <text y="30" text-anchor="middle" fill="#FF4D60"
                    font-family="JetBrains Mono, monospace" font-size="8" font-weight="700">w=${score}</text>
            </g>
          `;
        }).join('')}
        <!-- query arrows out (left side, animated) -->
        ${[0,1,2,3,4,5].map(i => {
          const x = 100 + i * 92;
          return `
            <line class="codex-info__pulse-line"
                  x1="300" y1="82" x2="${x}" y2="170"
                  stroke="#FF1E3C" stroke-width="1.1" stroke-opacity=".55"
                  style="--d:${i*.12}s"/>
          `;
        }).join('')}
        <!-- emission feedback (right side, returning) -->
        <text x="540" y="120" text-anchor="end" fill="#FF4D60"
              font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" letter-spacing="2">
          ↻ EMISSION
        </text>
        <text x="540" y="134" text-anchor="end" fill="#C8A8AD"
              font-family="JetBrains Mono, monospace" font-size="8">
          paid in proportion to consensus alignment
        </text>
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

      ${citedHtml}

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
