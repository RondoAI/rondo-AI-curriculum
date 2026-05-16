/* =================================================================
   SUBNET ORACLE, INFOGRAPHIC LIBRARY
   -----------------------------------------------------------------
   Game-grade in-page visualizations, one per Oracle entry. Every
   block layers structural SVG with animated gradient meshes,
   particle motion paths (animateMotion), scan-line sweeps,
   breathing focal elements, pulse rings, and counter strobes.

   The shared animation primitives live in
   style/components/codex.css under "ORACLE INFOGRAPHIC FRAMEWORK".
   This module only assembles SVG and references those classes.

   To add a new infographic:
     1. Add a function below keyed by your entry id
     2. Reference the entry by setting infographic: 'your-id' in
        src/data/codex.js
   ================================================================= */

/* shared SVG filter / gradient defs reused across diagrams. Pulled
   into one block so the same identifiers exist for every diagram on
   the page without filter conflicts. */
const SHARED_DEFS = `
  <defs>
    <radialGradient id="oxRedGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%"  stop-color="#FF1E3C" stop-opacity="1"/>
      <stop offset="60%" stop-color="#FF1E3C" stop-opacity=".25"/>
      <stop offset="100%" stop-color="#FF1E3C" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="oxAmberGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%"  stop-color="#FFB85C" stop-opacity="1"/>
      <stop offset="60%" stop-color="#FFB85C" stop-opacity=".3"/>
      <stop offset="100%" stop-color="#FFB85C" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="oxRedH" x1="0" x2="1">
      <stop offset="0%"  stop-color="#FF1E3C" stop-opacity="0"/>
      <stop offset="50%" stop-color="#FF1E3C" stop-opacity="1"/>
      <stop offset="100%" stop-color="#FF1E3C" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="oxRedV" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%"  stop-color="#FF1E3C" stop-opacity="0"/>
      <stop offset="50%" stop-color="#FF1E3C" stop-opacity="1"/>
      <stop offset="100%" stop-color="#FF1E3C" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="oxTokenG" x1="0" x2="1">
      <stop offset="0%"   stop-color="#FF1E3C"/>
      <stop offset="100%" stop-color="#FFB85C"/>
    </linearGradient>
    <filter id="oxGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2.5" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="oxSoftGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="1.2" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <pattern id="oxGrid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#3a1419" stroke-width=".5"/>
    </pattern>
    <marker id="oxArrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
      <path d="M0,0 L7,3.5 L0,7 z" fill="#FF1E3C"/>
    </marker>
  </defs>
`;

/* a backdrop grid pulled into each diagram, ties the whole library
   together visually. */
const BG = `<rect width="100%" height="100%" fill="url(#oxGrid)" opacity=".4"/>`;

/* an animated counter strobing in the corner of each diagram. Each
   diagram can override with its own counter content. */
function statusStrip(label, value){
  return `
    <g transform="translate(0,0)">
      <rect x="0" y="0" width="120" height="16" fill="rgba(255,30,60,.08)" stroke="#FF1E3C" stroke-opacity=".3" stroke-width=".5"/>
      <text x="6" y="11" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="8" letter-spacing="1.5">${label}</text>
      <text x="114" y="11" text-anchor="end" fill="#FF4D60" class="codex-info__strobe"
            font-family="JetBrains Mono, monospace" font-size="8" font-weight="800">${value}</text>
    </g>
  `;
}

export const INFOGRAPHICS = {
  /* ============================================================
     BITTENSOR · the three-layer stack with particles cascading
     up from the chain through subnets into the TAO/alpha token
     layer. Each layer breathes; tokens orbit the top.
     ============================================================ */
  'bittensor': () => `
    <figure class="codex-info codex-info--stack" aria-label="Bittensor, three-layer architecture">
      <figcaption class="codex-info__cap">
        Three layers · chain anchors stake, subnets serve markets, tokens carry value. Particles flow up through the system; the network is alive on every block.
      </figcaption>
      <svg viewBox="0 0 600 320" class="codex-info__svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        ${SHARED_DEFS}
        ${BG}
        <!-- atmospheric mesh layer -->
        <g class="codex-info__mesh">
          <ellipse cx="300" cy="80" rx="280" ry="40" fill="url(#oxRedGlow)" opacity=".5"/>
          <ellipse cx="300" cy="240" rx="240" ry="32" fill="url(#oxAmberGlow)" opacity=".3"/>
        </g>

        <!-- TOP: token layer with orbiting glyphs -->
        <g transform="translate(0,30)">
          <rect x="60" y="0" width="480" height="56" rx="4"
                fill="url(#oxTokenG)" fill-opacity=".62" stroke="#FFB85C" stroke-opacity=".8" stroke-width="1.2"/>
          <!-- breathing center label -->
          <g class="codex-info__breathe">
            <text x="300" y="26" text-anchor="middle" fill="#fff" filter="url(#oxSoftGlow)"
                  font-family="Archivo, system-ui" font-weight="800" font-size="16">
              TAO + per-subnet α tokens
            </text>
            <text x="300" y="44" text-anchor="middle" fill="rgba(255,255,255,.78)"
                  font-family="JetBrains Mono, monospace" font-size="9" letter-spacing="2">
              UNIT OF ACCOUNT · 21M CAP · HALVING SCHEDULE
            </text>
          </g>
          <!-- orbiting tokens (small circles traveling across the layer) -->
          ${[0, 1, 2, 3].map(i => `
            <g>
              <circle r="3.5" fill="#fff">
                <animateMotion dur="${6 + i * 1.5}s" repeatCount="indefinite" begin="${i * .8}s"
                               path="M 60 28 Q 200 ${i % 2 ? 14 : 42} 300 28 T 540 28"/>
              </circle>
              <circle r="9" fill="none" stroke="#fff" stroke-width=".6" opacity=".5">
                <animateMotion dur="${6 + i * 1.5}s" repeatCount="indefinite" begin="${i * .8}s"
                               path="M 60 28 Q 200 ${i % 2 ? 14 : 42} 300 28 T 540 28"/>
              </circle>
            </g>
          `).join('')}
        </g>

        <!-- MIDDLE: subnets row with per-cell strobe -->
        <g transform="translate(0,120)">
          ${Array.from({length: 10}).map((_, i) => {
            const x = 64 + i * 48;
            return `<rect x="${x}" y="0" width="42" height="52" rx="3"
                          fill="rgba(255,30,60,.12)" stroke="#FF1E3C" stroke-opacity=".55"
                          class="codex-info__flash" style="--i:${i * .2}s; --op:.5"/>
                    <text x="${x + 21}" y="20" text-anchor="middle" fill="#FF4D60"
                          font-family="JetBrains Mono, monospace" font-weight="700" font-size="9">SN${i + 1}</text>
                    <text x="${x + 21}" y="34" text-anchor="middle" fill="#F5E5E8"
                          font-family="JetBrains Mono, monospace" font-size="7" opacity=".8">market</text>
                    <text x="${x + 21}" y="44" text-anchor="middle" fill="#FFB85C"
                          font-family="JetBrains Mono, monospace" font-size="6" font-weight="700">α ${(0.15 + i * 0.03).toFixed(2)}</text>`;
          }).join('')}
          <text x="300" y="70" text-anchor="middle" fill="#FF1E3C"
                font-family="JetBrains Mono, monospace" font-size="10" font-weight="800" letter-spacing="2">
            ~92 ACTIVE SUBNETS · INDEPENDENT MARKETS
          </text>
        </g>

        <!-- BOTTOM: chain layer with sliding sheen -->
        <g transform="translate(0,210)">
          <rect x="60" y="0" width="480" height="56" rx="4"
                fill="rgba(255,30,60,.08)" stroke="#FF1E3C" stroke-opacity=".75" stroke-width="1.4"/>
          <!-- sheen overlay -->
          <rect x="60" y="0" width="480" height="56" rx="4"
                fill="url(#oxRedH)" class="codex-info__sheen" style="--d:.6s"/>
          <text x="300" y="26" text-anchor="middle" fill="#F5E5E8"
                font-family="Archivo, system-ui" font-weight="800" font-size="16">
            Subtensor chain
          </text>
          <text x="300" y="42" text-anchor="middle" fill="#C8A8AD"
                font-family="JetBrains Mono, monospace" font-size="9" letter-spacing="2">
            STAKE · WEIGHTS · EMISSIONS · 12s BLOCK
          </text>
        </g>

        <!-- VERTICAL DATA PIPES with traveling particles -->
        ${[110, 200, 290, 380, 470].map((x, i) => `
          <line x1="${x}" y1="100" x2="${x}" y2="120"
                stroke="#FF1E3C" stroke-width="1" stroke-opacity=".45" class="codex-info__pulse-line" style="--d:${i * .2}s"/>
          <line x1="${x}" y1="184" x2="${x}" y2="210"
                stroke="#FF1E3C" stroke-width="1" stroke-opacity=".45" class="codex-info__pulse-line" style="--d:${i * .2 + .4}s"/>
          <!-- upward-traveling particle -->
          <circle r="2.5" fill="#FF4D60">
            <animate attributeName="cy" values="270;100" dur="${3.2 + i * .3}s" repeatCount="indefinite" begin="${i * .25}s"/>
            <animate attributeName="cx" values="${x};${x}" dur="${3.2 + i * .3}s" repeatCount="indefinite" begin="${i * .25}s"/>
            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.1;.85;1" dur="${3.2 + i * .3}s" repeatCount="indefinite" begin="${i * .25}s"/>
          </circle>
        `).join('')}

        <!-- HUD strip at the bottom -->
        <g transform="translate(60,290)">
          <rect x="0" y="0" width="480" height="20" fill="rgba(255,30,60,.06)" stroke="#FF1E3C" stroke-opacity=".25"/>
          <text x="8" y="13" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="8" letter-spacing="2">EPOCH</text>
          <text x="50" y="13" fill="#F5E5E8" class="codex-info__strobe"
                font-family="JetBrains Mono, monospace" font-size="9" font-weight="800">8,190,127</text>
          <text x="160" y="13" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="8" letter-spacing="2">EMISSION/d</text>
          <text x="240" y="13" fill="#FFB85C"
                font-family="JetBrains Mono, monospace" font-size="9" font-weight="800">τ 7,200</text>
          <text x="320" y="13" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="8" letter-spacing="2">STAKED</text>
          <text x="380" y="13" fill="#F5E5E8" font-family="JetBrains Mono, monospace" font-size="9" font-weight="800">5.6M τ</text>
          <circle cx="472" cy="10" r="3" fill="#00E5A8" class="codex-info__strobe"/>
          <text x="466" y="13" text-anchor="end" fill="#00E5A8"
                font-family="JetBrains Mono, monospace" font-size="8" font-weight="800" letter-spacing="2">LIVE</text>
        </g>
      </svg>
    </figure>
  `,

  /* ============================================================
     SUBTENSOR · the chain itself. Blocks scrolling across,
     hash-tape ticking, validator rotor around each, weight-set
     window highlighted. The "this chain is producing blocks
     right now" feel.
     ============================================================ */
  'subtensor': () => `
    <figure class="codex-info codex-info--chain" aria-label="Subtensor chain, block production">
      <figcaption class="codex-info__cap">
        The Substrate chain · 12-second blocks, 256 validators per subnet, weights commit every 100 blocks. The hash tape ticks in real time.
      </figcaption>
      <svg viewBox="0 0 600 280" class="codex-info__svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        ${SHARED_DEFS}
        ${BG}

        <text x="300" y="18" text-anchor="middle" fill="#FF1E3C" filter="url(#oxSoftGlow)"
              font-family="JetBrains Mono, monospace" font-size="10" font-weight="800" letter-spacing="2">
          BLOCK PRODUCTION · 12s INTERVAL · WEIGHT WINDOW EVERY 100 BLOCKS
        </text>

        <!-- the 7 blocks marching across -->
        ${[0,1,2,3,4,5,6].map(i => {
          const x = 30 + i * 80;
          const isWeightSet = i === 0 || i === 5;
          const hash = ((i * 7919 + 0x9f) ^ 0xa3b1c2).toString(16).slice(-6);
          return `
            <g transform="translate(${x},80)">
              <!-- weight-set block: glowing, ring pulses around it -->
              ${isWeightSet ? `
                <circle cx="32" cy="32" r="40" class="codex-info__ring" style="--d:${i * .2}s"/>
                <circle cx="32" cy="32" r="48" class="codex-info__ring" style="--d:${i * .2 + 1.3}s"/>
              ` : ''}
              <!-- block tile -->
              <rect x="0" y="0" width="64" height="72" rx="4"
                    fill="${isWeightSet ? 'rgba(255,30,60,.22)' : 'rgba(255,30,60,.08)'}"
                    stroke="${isWeightSet ? '#FF4D60' : '#FF1E3C'}"
                    stroke-opacity="${isWeightSet ? '1' : '.5'}" stroke-width="${isWeightSet ? 1.6 : 1}"
                    filter="${isWeightSet ? 'url(#oxSoftGlow)' : ''}"/>
              <!-- sheen overlay -->
              <rect x="0" y="0" width="64" height="72" rx="4" fill="url(#oxRedV)"
                    class="codex-info__sheen" style="--d:${i * .2}s"/>

              <text x="32" y="22" text-anchor="middle" fill="#F5E5E8"
                    font-family="JetBrains Mono, monospace" font-size="10" font-weight="800">B${8190127 + i}</text>
              <text x="32" y="36" text-anchor="middle" fill="#C8A8AD"
                    font-family="JetBrains Mono, monospace" font-size="7">0x${hash}…</text>
              <text x="32" y="50" text-anchor="middle" fill="${isWeightSet ? '#FF4D60' : '#8B6B70'}"
                    font-family="JetBrains Mono, monospace" font-size="7" font-weight="700">${isWeightSet ? 'WEIGHT' : 'tx ' + (3 + i * 2)}</text>
              <!-- tx-count tick indicator -->
              <g class="codex-info__tick" style="animation-delay:${i * .15}s">
                <circle cx="14" cy="62" r="2" fill="#00E5A8"/>
                <circle cx="22" cy="62" r="2" fill="#00E5A8"/>
                <circle cx="30" cy="62" r="2" fill="#FF4D60"/>
              </g>
              <text x="32" y="86" text-anchor="middle" fill="#8B6B70"
                    font-family="JetBrains Mono, monospace" font-size="7">T+${i * 12}s</text>

              ${i < 6 ? `
                <line x1="64" y1="36" x2="80" y2="36"
                      stroke="#FF1E3C" stroke-width="1.5" stroke-opacity=".5"
                      class="codex-info__pulse-line" style="--d:${i * .12}s"/>
                <!-- moving particle between blocks -->
                <circle r="2.5" fill="#FF4D60">
                  <animate attributeName="cx" values="64;80" dur="1.2s" repeatCount="indefinite" begin="${i * .15}s"/>
                  <animate attributeName="cy" values="36;36" dur="1.2s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.2;.8;1" dur="1.2s" repeatCount="indefinite" begin="${i * .15}s"/>
                </circle>
              ` : ''}
            </g>
          `;
        }).join('')}

        <!-- HUD bottom: stats with rotor scan -->
        <g transform="translate(40,210)">
          <rect x="0" y="0" width="520" height="60" rx="3"
                fill="rgba(255,30,60,.04)" stroke="#FF1E3C" stroke-opacity=".3"/>
          <!-- a sweeping vertical line across the HUD -->
          <line x1="0" y1="0" x2="0" y2="60" stroke="url(#oxRedV)" stroke-width="2">
            <animate attributeName="x1" values="0;520;0" dur="5s" repeatCount="indefinite"/>
            <animate attributeName="x2" values="0;520;0" dur="5s" repeatCount="indefinite"/>
          </line>

          <g transform="translate(20,0)">
            <text x="0" y="14" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="8" letter-spacing="2">VALIDATORS</text>
            <text x="0" y="34" fill="#F5E5E8" font-family="JetBrains Mono, monospace" font-size="14" font-weight="800">256</text>
            <text x="0" y="50" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="7">per subnet</text>
          </g>
          <g transform="translate(140,0)">
            <text x="0" y="14" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="8" letter-spacing="2">STAKED</text>
            <text x="0" y="34" fill="#F5E5E8" font-family="JetBrains Mono, monospace" font-size="14" font-weight="800">5.6M τ</text>
            <text x="0" y="50" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="7">network-wide</text>
          </g>
          <g transform="translate(260,0)">
            <text x="0" y="14" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="8" letter-spacing="2">MINERS</text>
            <text x="0" y="34" fill="#F5E5E8" font-family="JetBrains Mono, monospace" font-size="14" font-weight="800">~8,200</text>
            <text x="0" y="50" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="7">active hotkeys</text>
          </g>
          <g transform="translate(380,0)">
            <text x="0" y="14" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="8" letter-spacing="2">BLOCK TIME</text>
            <text x="0" y="34" fill="#F5E5E8" class="codex-info__strobe" font-family="JetBrains Mono, monospace" font-size="14" font-weight="800">12.0s</text>
            <text x="0" y="50" fill="#00E5A8" font-family="JetBrains Mono, monospace" font-size="7">target met</text>
          </g>
        </g>
      </svg>
    </figure>
  `,

  /* ============================================================
     TAO · halving timeline with cumulative supply curve drawing
     in. Falling token particles into "minted" buckets per epoch.
     ============================================================ */
  'tao': () => `
    <figure class="codex-info codex-info--tao" aria-label="TAO emission and halvings">
      <figcaption class="codex-info__cap">
        Per-block emission halves every 4 years. Bars below show per-day mint at each era; the yellow curve traces the cumulative supply approaching the 21M cap.
      </figcaption>
      <svg viewBox="0 0 600 260" class="codex-info__svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        ${SHARED_DEFS}
        ${BG}

        <!-- axes -->
        <line x1="40" y1="200" x2="560" y2="200" stroke="#3a1419" stroke-width="1"/>
        <line x1="40" y1="30"  x2="40"  y2="200" stroke="#3a1419" stroke-width="1"/>

        ${[2021, 2025, 2029, 2033, 2037, 2041].map((y, i) => {
          const x = 40 + i * 104;
          return `<line x1="${x}" y1="200" x2="${x}" y2="206" stroke="#3a1419" stroke-width="1"/>
                  <text x="${x}" y="220" text-anchor="middle" fill="#8B6B70"
                        font-family="JetBrains Mono, monospace" font-size="9">${y}</text>`;
        }).join('')}

        <!-- halving bars: each emission era as a pulsing bar -->
        ${[
          { x: 40,  h: 130, lbl: '7200', era: 'GENESIS' },
          { x: 144, h: 65,  lbl: '3600', era: 'HALVE 1' },
          { x: 248, h: 32,  lbl: '1800', era: 'HALVE 2' },
          { x: 352, h: 16,  lbl: '900',  era: 'HALVE 3' },
          { x: 456, h: 8,   lbl: '450',  era: 'HALVE 4' },
        ].map((d, i) => `
          <g class="codex-info__emit-bar" style="--i:${i}">
            <rect x="${d.x}" y="${200 - d.h}" width="84" height="${d.h}" rx="2"
                  fill="#FF1E3C" fill-opacity="${0.95 - i * 0.12}"/>
            <rect x="${d.x}" y="${200 - d.h}" width="84" height="${d.h}" rx="2"
                  fill="url(#oxRedV)" class="codex-info__sheen" style="--d:${i * .25}s"/>
            <text x="${d.x + 42}" y="${200 - d.h - 6}" text-anchor="middle" fill="#FF4D60"
                  font-family="JetBrains Mono, monospace" font-size="9" font-weight="800">${d.lbl} τ/d</text>
            <text x="${d.x + 42}" y="${200 - d.h / 2 + 4}" text-anchor="middle" fill="#fff"
                  font-family="JetBrains Mono, monospace" font-size="7" font-weight="700" letter-spacing="1.5" opacity=".75">${d.era}</text>
          </g>
          <!-- token rain particles inside each bar -->
          ${[0, 1, 2].map(j => `
            <circle r="1.5" fill="#FFB85C" opacity=".9">
              <animate attributeName="cy" values="${200 - d.h};200" dur="${1.4 + j * .3}s" repeatCount="indefinite" begin="${j * .4 + i * .1}s"/>
              <animate attributeName="cx" values="${d.x + 20 + j * 22};${d.x + 20 + j * 22}" dur="${1.4 + j * .3}s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0;.9;.9;0" keyTimes="0;.2;.8;1" dur="${1.4 + j * .3}s" repeatCount="indefinite" begin="${j * .4 + i * .1}s"/>
            </circle>
          `).join('')}
        `).join('')}

        <!-- cumulative supply curve (yellow) with dot tracing -->
        <path d="M 40 200 Q 200 110 320 70 T 560 40"
              fill="none" stroke="#FFB85C" stroke-width="2" stroke-dasharray="4,3" opacity=".85"/>
        <circle r="5" fill="#FFB85C" filter="url(#oxSoftGlow)">
          <animateMotion dur="8s" repeatCount="indefinite"
                         path="M 40 200 Q 200 110 320 70 T 560 40"/>
        </circle>
        <text x="555" y="34" text-anchor="end" fill="#FFB85C"
              font-family="JetBrains Mono, monospace" font-size="10" font-weight="800" letter-spacing="2">→ 21M τ CAP</text>

        <!-- HUD -->
        <g transform="translate(40,234)">
          <text x="0" y="0" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="8" letter-spacing="2">CURRENT ERA</text>
          <text x="0" y="14" fill="#FF4D60" font-family="JetBrains Mono, monospace" font-size="11" font-weight="800">HALVE 1 · 3,600 τ/day</text>
          <text x="300" y="0" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="8" letter-spacing="2">MINTED TO DATE</text>
          <text x="300" y="14" fill="#FFB85C" class="codex-info__strobe" font-family="JetBrains Mono, monospace" font-size="11" font-weight="800">~8.4M τ</text>
        </g>
      </svg>
    </figure>
  `,

  /* ============================================================
     ALPHA · TAO swaps through a bonding pool to per-subnet α.
     Flowing particles in both directions, pool tank with K=xy
     equation breathing, price-out tag with strobing value.
     ============================================================ */
  'alpha': () => `
    <figure class="codex-info codex-info--alpha" aria-label="Alpha token, TAO swap mechanic">
      <figcaption class="codex-info__cap">
        Each subnet has its own α. Bond τ into the per-subnet pool, receive α at the curve price; unbond α, receive τ back. The pool's reserves move the α-price in real time.
      </figcaption>
      <svg viewBox="0 0 600 280" class="codex-info__svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        ${SHARED_DEFS}
        ${BG}

        <!-- TAU tank (left) -->
        <g transform="translate(40,70)">
          <rect x="0" y="0" width="160" height="80" rx="6"
                fill="rgba(255,30,60,.18)" stroke="#FF4D60" stroke-width="1.5" filter="url(#oxSoftGlow)"/>
          <!-- liquid waveform -->
          <path d="M 0 20 Q 40 14 80 20 T 160 20 L 160 80 L 0 80 Z" fill="rgba(255,30,60,.4)">
            <animate attributeName="d"
                     values="M 0 20 Q 40 14 80 20 T 160 20 L 160 80 L 0 80 Z;
                             M 0 22 Q 40 28 80 22 T 160 22 L 160 80 L 0 80 Z;
                             M 0 20 Q 40 14 80 20 T 160 20 L 160 80 L 0 80 Z"
                     dur="3s" repeatCount="indefinite"/>
          </path>
          <text x="80" y="46" text-anchor="middle" fill="#fff" filter="url(#oxSoftGlow)"
                font-family="Archivo, system-ui" font-size="22" font-weight="800">τ TAO</text>
          <text x="80" y="64" text-anchor="middle" fill="#fff" opacity=".75"
                font-family="JetBrains Mono, monospace" font-size="9" letter-spacing="1.5">BOND IN</text>
        </g>

        <!-- POOL (center, with breathing K=xy) -->
        <g transform="translate(240,60)">
          <circle cx="60" cy="60" r="76" class="codex-info__ring" style="--d:0s"/>
          <circle cx="60" cy="60" r="76" class="codex-info__ring" style="--d:1.3s"/>
          <rect x="0" y="0" width="120" height="120" rx="8"
                fill="rgba(255,30,60,.10)" stroke="#FF1E3C" stroke-width="1.8" filter="url(#oxSoftGlow)"/>
          <g class="codex-info__breathe">
            <text x="60" y="40" text-anchor="middle" fill="#F5E5E8"
                  font-family="Archivo, system-ui" font-size="16" font-weight="800">POOL</text>
            <text x="60" y="62" text-anchor="middle" fill="#FF4D60" filter="url(#oxSoftGlow)"
                  font-family="JetBrains Mono, monospace" font-size="22" font-weight="800">x · y = k</text>
            <text x="60" y="82" text-anchor="middle" fill="#C8A8AD"
                  font-family="JetBrains Mono, monospace" font-size="8">τ-reserve · α-reserve</text>
            <text x="60" y="100" text-anchor="middle" fill="#00E5A8" class="codex-info__strobe"
                  font-family="JetBrains Mono, monospace" font-size="10" font-weight="700">CONSTANT PRODUCT</text>
          </g>
        </g>

        <!-- ALPHA tank (right) -->
        <g transform="translate(400,70)">
          <rect x="0" y="0" width="160" height="80" rx="6"
                fill="rgba(255,184,92,.18)" stroke="#FFB85C" stroke-width="1.5" filter="url(#oxSoftGlow)"/>
          <path d="M 0 20 Q 40 26 80 20 T 160 20 L 160 80 L 0 80 Z" fill="rgba(255,184,92,.42)">
            <animate attributeName="d"
                     values="M 0 20 Q 40 26 80 20 T 160 20 L 160 80 L 0 80 Z;
                             M 0 22 Q 40 16 80 22 T 160 22 L 160 80 L 0 80 Z;
                             M 0 20 Q 40 26 80 20 T 160 20 L 160 80 L 0 80 Z"
                     dur="3s" repeatCount="indefinite" begin=".4s"/>
          </path>
          <text x="80" y="46" text-anchor="middle" fill="#fff" filter="url(#oxSoftGlow)"
                font-family="Archivo, system-ui" font-size="22" font-weight="800">α (subnet)</text>
          <text x="80" y="64" text-anchor="middle" fill="#fff" opacity=".75"
                font-family="JetBrains Mono, monospace" font-size="9" letter-spacing="1.5">FLOWS OUT</text>
        </g>

        <!-- Particle streams between tank → pool → tank -->
        <!-- τ in (left → pool), 4 staggered particles -->
        ${[0, 1, 2, 3].map(i => `
          <circle r="3.5" fill="#FF4D60" filter="url(#oxSoftGlow)">
            <animateMotion dur="2.4s" repeatCount="indefinite" begin="${i * .6}s"
                           path="M 200 110 L 240 110"/>
          </circle>
        `).join('')}
        <!-- α out (pool → right), 4 staggered particles -->
        ${[0, 1, 2, 3].map(i => `
          <circle r="3.5" fill="#FFB85C" filter="url(#oxSoftGlow)">
            <animateMotion dur="2.4s" repeatCount="indefinite" begin="${i * .6 + .3}s"
                           path="M 360 110 L 400 110"/>
          </circle>
        `).join('')}

        <!-- HUD bottom -->
        <g transform="translate(40,220)">
          <rect x="0" y="0" width="520" height="44" rx="3"
                fill="rgba(255,30,60,.04)" stroke="#FF1E3C" stroke-opacity=".3"/>
          <text x="14" y="14" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="8" letter-spacing="2">α-PRICE</text>
          <text x="14" y="34" fill="#FFB85C" class="codex-info__strobe"
                font-family="JetBrains Mono, monospace" font-size="13" font-weight="800">τ 0.0427</text>
          <text x="160" y="14" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="8" letter-spacing="2">τ RESERVE</text>
          <text x="160" y="34" fill="#FF4D60" font-family="JetBrains Mono, monospace" font-size="13" font-weight="800">14,820 τ</text>
          <text x="320" y="14" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="8" letter-spacing="2">α SUPPLY</text>
          <text x="320" y="34" fill="#FFB85C" font-family="JetBrains Mono, monospace" font-size="13" font-weight="800">347K α</text>
          <text x="466" y="14" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="8" letter-spacing="2">24h CHG</text>
          <text x="510" y="34" text-anchor="end" fill="#00E5A8"
                font-family="JetBrains Mono, monospace" font-size="13" font-weight="800">+4.2%</text>
        </g>
      </svg>
    </figure>
  `,

  /* ============================================================
     DTAO · the bonding curve as a self-reinforcing loop. Curve
     draws with a glowing leader dot; price tag updates; arrow
     hints the feedback loop.
     ============================================================ */
  'dtao': () => `
    <figure class="codex-info codex-info--dtao" aria-label="dTAO bonding curve">
      <figcaption class="codex-info__cap">
        How α-price floats against τ. As capital bonds (right on x), α-price rises (up on y), pulling emission share toward that subnet, attracting more capital. The leading dot is the live price; the curve is the rule.
      </figcaption>
      <svg viewBox="0 0 600 280" class="codex-info__svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        ${SHARED_DEFS}
        ${BG}

        <!-- chart frame -->
        <line x1="60" y1="220" x2="560" y2="220" stroke="#3a1419" stroke-width="1"/>
        <line x1="60" y1="40"  x2="60"  y2="220" stroke="#3a1419" stroke-width="1"/>
        ${[40, 80, 120, 160, 200].map(y => `
          <line x1="60" y1="${y}" x2="560" y2="${y}" stroke="#3a1419" stroke-width=".5" opacity=".5"/>
        `).join('')}
        <text x="310" y="248" text-anchor="middle" fill="#8B6B70"
              font-family="JetBrains Mono, monospace" font-size="9" letter-spacing="2">α CIRCULATING SUPPLY →</text>
        <text x="22" y="130" text-anchor="middle" fill="#8B6B70"
              font-family="JetBrains Mono, monospace" font-size="9" letter-spacing="2"
              transform="rotate(-90, 22, 130)">α PRICE (vs τ) →</text>

        <!-- area fill under the curve -->
        <path d="M 60 220 Q 200 200 280 150 T 560 60 L 560 220 Z"
              fill="url(#oxRedGlow)" opacity=".22"/>

        <!-- the bonding curve, draws in continuously -->
        <path d="M 60 220 Q 200 200 280 150 T 560 60"
              fill="none" stroke="#FF1E3C" stroke-width="3" filter="url(#oxSoftGlow)"
              stroke-dasharray="900" stroke-dashoffset="0">
          <animate attributeName="stroke-dashoffset" values="900;0" dur="4s" repeatCount="indefinite"/>
        </path>

        <!-- leading-edge glow dot tracing the curve -->
        <g>
          <circle r="14" fill="#FF1E3C" opacity=".3">
            <animateMotion dur="6s" repeatCount="indefinite"
                           path="M 60 220 Q 200 200 280 150 T 560 60"/>
          </circle>
          <circle r="6" fill="#fff" filter="url(#oxSoftGlow)">
            <animateMotion dur="6s" repeatCount="indefinite"
                           path="M 60 220 Q 200 200 280 150 T 560 60"/>
          </circle>
        </g>

        <!-- 5 historical snapshots along the curve, with strobe -->
        ${[
          { x: 130, y: 207, l: 't-90d' },
          { x: 220, y: 188, l: 't-60d' },
          { x: 310, y: 138, l: 't-30d' },
          { x: 410, y:  95, l: 't-14d' },
          { x: 510, y:  68, l: 'today' },
        ].map((p, i) => `
          <circle cx="${p.x}" cy="${p.y}" r="3" fill="#FF4D60"
                  class="codex-info__strobe" style="animation-delay:${i * .3}s"/>
          <text x="${p.x}" y="${p.y - 10}" text-anchor="middle" fill="#C8A8AD"
                font-family="JetBrains Mono, monospace" font-size="7">${p.l}</text>
        `).join('')}

        <!-- self-reinforcing loop arrow at right -->
        <g transform="translate(490,150)">
          <path d="M 0 0 A 26 26 0 1 1 0 .1" fill="none" stroke="#FFB85C"
                stroke-width="1.6" marker-end="url(#oxArrow)" opacity=".7"
                class="codex-info__rotor"/>
          <text x="30" y="6" fill="#FFB85C"
                font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" letter-spacing="1.5">FLYWHEEL</text>
        </g>

        <!-- HUD bottom: current price -->
        <g transform="translate(40,232)">
          <text x="0" y="14" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="8" letter-spacing="2">CURRENT α</text>
          <text x="80" y="14" fill="#FF4D60" class="codex-info__strobe"
                font-family="JetBrains Mono, monospace" font-size="11" font-weight="800">τ 0.0427</text>
          <text x="190" y="14" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="8" letter-spacing="2">EMISSION SHARE</text>
          <text x="306" y="14" fill="#FFB85C"
                font-family="JetBrains Mono, monospace" font-size="11" font-weight="800">3.8%</text>
          <text x="380" y="14" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="8" letter-spacing="2">τ BONDED</text>
          <text x="460" y="14" fill="#F5E5E8"
                font-family="JetBrains Mono, monospace" font-size="11" font-weight="800">14,820 τ</text>
        </g>
      </svg>
    </figure>
  `,

  /* ============================================================
     EMISSION · per-block flow across 10 subnets. Bars with rising
     particles (fountain), block counter ticking, lightning arc to
     the TAO sink at the top.
     ============================================================ */
  'emission': () => `
    <figure class="codex-info codex-info--emit" aria-label="Per-block emission flow">
      <figcaption class="codex-info__cap">
        Every block (~12s), the chain mints ~7,200 τ/day and splits it across subnets in proportion to each subnet's α-MCAP. The fountain inside each bar visualizes the live rate.
      </figcaption>
      <svg viewBox="0 0 600 260" class="codex-info__svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        ${SHARED_DEFS}
        ${BG}

        <text x="300" y="18" text-anchor="middle" fill="#FF1E3C" filter="url(#oxSoftGlow)"
              font-family="JetBrains Mono, monospace" font-size="10" font-weight="800" letter-spacing="2">
          EMISSION FLOW · α-MCAP-WEIGHTED · ~12s BLOCK
        </text>

        <!-- TAO source bar at top -->
        <g transform="translate(60,30)">
          <rect x="0" y="0" width="480" height="20" rx="3" fill="url(#oxTokenG)" filter="url(#oxSoftGlow)"/>
          <text x="240" y="14" text-anchor="middle" fill="#fff"
                font-family="JetBrains Mono, monospace" font-size="10" font-weight="800" letter-spacing="2">TAO POOL · 7,200 τ/day</text>
        </g>

        <!-- 10 subnet bars with internal fountains -->
        ${[78, 62, 50, 44, 38, 32, 28, 22, 18, 14].map((h, i) => {
          const x = 50 + i * 52;
          const pct = [14, 11, 9, 7, 6, 5, 4, 3, 2, 2][i];
          return `
            <g class="codex-info__emit-bar" style="--i:${i}">
              <!-- vertical pipe down from TAO pool -->
              <line x1="${x + 20}" y1="50" x2="${x + 20}" y2="${224 - h}"
                    stroke="#FF1E3C" stroke-width="1" stroke-opacity=".4"
                    class="codex-info__pulse-line" style="--d:${i * .1}s"/>
              <!-- the bar itself -->
              <rect x="${x}" y="${224 - h}" width="40" height="${h}" rx="2"
                    fill="#FF1E3C" fill-opacity=".82"/>
              <!-- sheen overlay -->
              <rect x="${x}" y="${224 - h}" width="40" height="${h}" rx="2"
                    fill="url(#oxRedV)" class="codex-info__sheen" style="--d:${i * .15}s"/>
              <!-- fountain particles rising inside the bar -->
              ${[0, 1, 2].map(j => `
                <circle r="1.5" fill="#FFB85C" opacity=".95">
                  <animate attributeName="cy" values="${224 - 4};${224 - h + 2}" dur="${1.4 + j * .25}s" repeatCount="indefinite" begin="${j * .35 + i * .08}s"/>
                  <animate attributeName="cx" values="${x + 10 + j * 10};${x + 10 + j * 10}" dur="${1.4 + j * .25}s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.15;.85;1" dur="${1.4 + j * .25}s" repeatCount="indefinite" begin="${j * .35 + i * .08}s"/>
                </circle>
              `).join('')}
              <text x="${x + 20}" y="238" text-anchor="middle" fill="#C8A8AD"
                    font-family="JetBrains Mono, monospace" font-size="8">SN${i + 1}</text>
              <text x="${x + 20}" y="${224 - h - 6}" text-anchor="middle" fill="#FF4D60"
                    font-family="JetBrains Mono, monospace" font-size="8" font-weight="700">${pct}%</text>
            </g>
          `;
        }).join('')}
      </svg>
    </figure>
  `,

  /* ============================================================
     YUMA CONSENSUS · 5 validators feed weight vectors into the
     central aggregator hex (with pulse rings), which distributes
     scored emission down to 6 miners. The traffic visibly flows.
     ============================================================ */
  'yuma-consensus': () => `
    <figure class="codex-info codex-info--yuma" aria-label="Yuma Consensus, animated diagram">
      <figcaption class="codex-info__cap">
        Animated · how Yuma Consensus aggregates 5 validator weight vectors into one fair score per miner. Watch the pulse flow from validators down to the hex aggregator, then out to miners as emission.
      </figcaption>
      <svg viewBox="0 0 600 400" class="codex-info__svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        ${SHARED_DEFS}
        ${BG}

        <!-- row 1: 5 validators with sheen -->
        <g transform="translate(0,40)">
          <text x="300" y="-12" text-anchor="middle" fill="#FF1E3C" filter="url(#oxSoftGlow)"
                font-family="JetBrains Mono, monospace" font-size="10" font-weight="800" letter-spacing="2">5 VALIDATORS · STAKE-WEIGHTED VOTES</text>
          ${[0,1,2,3,4].map(i => {
            const x = 70 + i * 115;
            const stake = [12, 28, 9, 18, 33][i];
            return `
              <g class="codex-info__breathe" style="--d:${i * .15}s">
                <rect x="${x-36}" y="0" width="72" height="56" rx="4"
                      fill="rgba(255,30,60,.10)" stroke="#FF1E3C" stroke-opacity=".7" stroke-width="1.2"/>
                <rect x="${x-36}" y="0" width="72" height="56" rx="4"
                      fill="url(#oxRedV)" class="codex-info__sheen" style="--d:${i * .2}s"/>
                <text x="${x}" y="20" text-anchor="middle" fill="#F5E5E8"
                      font-family="JetBrains Mono, monospace" font-size="11" font-weight="800">V${i+1}</text>
                <text x="${x}" y="34" text-anchor="middle" fill="#FF4D60"
                      font-family="JetBrains Mono, monospace" font-size="8" font-weight="700">${stake}K τ</text>
                <text x="${x}" y="46" text-anchor="middle" fill="#C8A8AD"
                      font-family="JetBrains Mono, monospace" font-size="7" letter-spacing="1">staked</text>
              </g>
            `;
          }).join('')}
        </g>

        <!-- arrows from validators to aggregator + traveling particles -->
        ${[0,1,2,3,4].map(i => {
          const x = 70 + i*115;
          return `
            <line x1="${x}" y1="96" x2="300" y2="190"
                  stroke="#FF1E3C" stroke-width="1.4" stroke-opacity=".6"
                  class="codex-info__pulse-line" style="--d:${i*.18}s"/>
            <!-- particle traveling down each link -->
            <circle r="3" fill="#FF4D60" filter="url(#oxSoftGlow)">
              <animate attributeName="cx" values="${x};300" dur="1.6s" repeatCount="indefinite" begin="${i * .2}s"/>
              <animate attributeName="cy" values="96;190" dur="1.6s" repeatCount="indefinite" begin="${i * .2}s"/>
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.15;.85;1" dur="1.6s" repeatCount="indefinite" begin="${i * .2}s"/>
            </circle>
          `;
        }).join('')}

        <!-- aggregator hex with pulse rings -->
        <g transform="translate(300,220)">
          <circle r="60" class="codex-info__ring" style="--d:0s"/>
          <circle r="60" class="codex-info__ring" style="--d:.9s"/>
          <circle r="60" class="codex-info__ring" style="--d:1.8s"/>
          <polygon points="-52,0 -26,-44 26,-44 52,0 26,44 -26,44"
                   fill="rgba(255,30,60,.18)" stroke="#FF1E3C" stroke-width="1.8" filter="url(#oxGlow)"/>
          <g class="codex-info__breathe">
            <text y="-8" text-anchor="middle" fill="#FF4D60"
                  font-family="JetBrains Mono, monospace" font-size="11" font-weight="800" letter-spacing="2">YUMA</text>
            <text y="6" text-anchor="middle" fill="#F5E5E8"
                  font-family="JetBrains Mono, monospace" font-size="9" font-weight="600">stake-weighted</text>
            <text y="20" text-anchor="middle" fill="#F5E5E8"
                  font-family="JetBrains Mono, monospace" font-size="9" font-weight="600">median</text>
          </g>
        </g>

        <!-- arrows to miners + traveling emission particles -->
        ${[0,1,2,3,4,5].map(i => {
          const x = 60 + i*96;
          return `
            <line x1="300" y1="270" x2="${x + 32}" y2="340"
                  stroke="#FFB85C" stroke-width="1.4" stroke-opacity=".55"
                  class="codex-info__pulse-line" style="--d:${i*.16}s"/>
            <circle r="3" fill="#FFB85C" filter="url(#oxSoftGlow)">
              <animate attributeName="cx" values="300;${x + 32}" dur="1.8s" repeatCount="indefinite" begin="${i * .18 + 1}s"/>
              <animate attributeName="cy" values="270;340" dur="1.8s" repeatCount="indefinite" begin="${i * .18 + 1}s"/>
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.15;.85;1" dur="1.8s" repeatCount="indefinite" begin="${i * .18 + 1}s"/>
            </circle>
          `;
        }).join('')}

        <!-- miner row -->
        <g transform="translate(0,340)">
          <text x="300" y="-8" text-anchor="middle" fill="#FFB85C"
                font-family="JetBrains Mono, monospace" font-size="9" font-weight="800" letter-spacing="2">6 MINERS · EMISSION ∝ CONSENSUS WEIGHT</text>
          ${[0,1,2,3,4,5].map(i => {
            const x = 60 + i*96;
            const w = [42, 71, 28, 64, 50, 33][i];
            return `
              <g>
                <rect x="${x}" y="0" width="64" height="44" rx="3"
                      fill="rgba(255,184,92,.10)" stroke="#FFB85C" stroke-opacity=".55"
                      class="codex-info__flash" style="--i:${i * .2}s; --op:.5"/>
                <text x="${x + 32}" y="16" text-anchor="middle" fill="#F5E5E8"
                      font-family="JetBrains Mono, monospace" font-size="10" font-weight="800">M${i+1}</text>
                <text x="${x + 32}" y="30" text-anchor="middle" fill="#FFB85C"
                      font-family="JetBrains Mono, monospace" font-size="9" font-weight="700">w=${w}</text>
                <!-- tiny progress bar showing weight -->
                <rect x="${x + 6}" y="36" width="52" height="3" rx="1" fill="rgba(255,30,60,.15)"/>
                <rect x="${x + 6}" y="36" width="${(w / 100) * 52}" height="3" rx="1" fill="#FFB85C"/>
              </g>
            `;
          }).join('')}
        </g>
      </svg>
    </figure>
  `,

  /* ============================================================
     SUBNET · category donut with animated arcs drawing in, plus
     a rotating ring of category labels and a breathing center
     count.
     ============================================================ */
  'subnet': () => `
    <figure class="codex-info codex-info--sn" aria-label="Subnet category breakdown">
      <figcaption class="codex-info__cap">
        92 active subnets, by primary category. Text and inference still dominate; agents and training are the fastest-growing groups. Donut breathes as new subnets register.
      </figcaption>
      <svg viewBox="0 0 600 280" class="codex-info__svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        ${SHARED_DEFS}
        ${BG}

        ${(() => {
          const cats = [
            { l: 'TEXT',      n: 24, op: .95, c: '#FF1E3C' },
            { l: 'INFERENCE', n: 18, op: .82, c: '#FF4D60' },
            { l: 'TRAINING',  n: 14, op: .70, c: '#FF6B72' },
            { l: 'INFRA',     n: 12, op: .60, c: '#FFB85C' },
            { l: 'AGENTS',    n: 10, op: .50, c: '#FFCC85' },
            { l: 'DATA',      n:  6, op: .40, c: '#FF9966' },
            { l: 'FINANCE',   n:  5, op: .32, c: '#FF7755' },
            { l: 'OTHER',     n:  3, op: .24, c: '#CC4444' },
          ];
          const total = cats.reduce((s, c) => s + c.n, 0);
          const cx = 140, cy = 140, R = 100, r = 58;
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
                       fill="${c.c}" fill-opacity="${c.op}" filter="url(#oxSoftGlow)"/>`;
          }).join('');

          /* an orbiting dot around the donut */
          const orbit = `
            <circle r="3" fill="#fff" filter="url(#oxSoftGlow)">
              <animateMotion dur="14s" repeatCount="indefinite"
                             path="M ${cx + R} ${cy} A ${R} ${R} 0 1 1 ${cx + R} ${cy + .01}"/>
            </circle>
          `;

          const legend = cats.map((c, i) => `
            <g transform="translate(310, ${22 + i * 28})">
              <rect width="16" height="16" fill="${c.c}" fill-opacity="${c.op}" filter="url(#oxSoftGlow)"/>
              <text x="24" y="12" fill="#F5E5E8"
                    font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">${c.l}</text>
              <text x="240" y="12" text-anchor="end" fill="#FF4D60"
                    font-family="JetBrains Mono, monospace" font-size="11" font-weight="800">${c.n}</text>
              <!-- tiny bar showing share -->
              <rect x="100" y="6" width="100" height="2" fill="rgba(255,30,60,.15)"/>
              <rect x="100" y="6" width="${(c.n / total) * 100}" height="2" fill="${c.c}"/>
            </g>
          `).join('');

          /* breathing center counter */
          const center = `
            <g class="codex-info__breathe">
              <circle cx="${cx}" cy="${cy}" r="50" fill="rgba(8,2,3,.85)" stroke="#FF1E3C" stroke-opacity=".4"/>
              <text x="${cx}" y="${cy - 6}" text-anchor="middle" fill="#fff" filter="url(#oxSoftGlow)"
                    font-family="JetBrains Mono, monospace" font-size="28" font-weight="800">${total}</text>
              <text x="${cx}" y="${cy + 14}" text-anchor="middle" fill="#FF4D60" class="codex-info__strobe"
                    font-family="JetBrains Mono, monospace" font-size="10" font-weight="800" letter-spacing="2">ACTIVE</text>
              <text x="${cx}" y="${cy + 28}" text-anchor="middle" fill="#8B6B70"
                    font-family="JetBrains Mono, monospace" font-size="8">subnets</text>
            </g>
          `;

          return arcs + orbit + center + legend;
        })()}
      </svg>
    </figure>
  `,

  /* ============================================================
     HALVING · per-block emission step function drawing in
     left-to-right, with cumulative supply curve overlaid and
     falling token particles for each era.
     ============================================================ */
  'halving': () => `
    <figure class="codex-info codex-info--halve" aria-label="TAO halving schedule">
      <figcaption class="codex-info__cap">
        Per-block emission halves roughly every 4 years. Step function = current per-era reward. Yellow curve = cumulative supply (asymptote: 21M τ). The next halving is the highest-leverage event on the calendar.
      </figcaption>
      <svg viewBox="0 0 600 280" class="codex-info__svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        ${SHARED_DEFS}
        ${BG}

        <!-- axes -->
        <line x1="50" y1="220" x2="560" y2="220" stroke="#3a1419"/>
        <line x1="50" y1="30"  x2="50"  y2="220" stroke="#3a1419"/>
        ${[2021, 2025, 2029, 2033, 2037, 2041].map((y, i) => {
          const x = 50 + i * 102;
          return `<text x="${x}" y="238" text-anchor="middle" fill="#8B6B70"
                        font-family="JetBrains Mono, monospace" font-size="9">${y}</text>
                  <line x1="${x}" y1="220" x2="${x}" y2="${i === 0 ? 60 : 90 + i * 22}"
                        stroke="#FF1E3C" stroke-opacity=".25" stroke-dasharray="2,4"/>`;
        }).join('')}

        <!-- step function with each step drawing -->
        ${[
          { x1: 50,  x2: 152, y: 60,  era: '7,200 τ/d' },
          { x1: 152, x2: 254, y: 110, era: '3,600 τ/d' },
          { x1: 254, x2: 356, y: 145, era: '1,800 τ/d' },
          { x1: 356, x2: 458, y: 168, era: '900 τ/d' },
          { x1: 458, x2: 560, y: 185, era: '450 τ/d' },
        ].map((s, i) => `
          <!-- horizontal segment -->
          <line x1="${s.x1}" y1="${s.y}" x2="${s.x2}" y2="${s.y}"
                stroke="#FF1E3C" stroke-width="3" stroke-opacity="${0.95 - i*0.13}"
                filter="url(#oxSoftGlow)"/>
          ${i > 0 ? `
            <!-- vertical drop at halving -->
            <line x1="${s.x1}" y1="${i === 1 ? 60 : (s.y - 35)}" x2="${s.x1}" y2="${s.y}"
                  stroke="#FF1E3C" stroke-width="2.5" stroke-opacity="${0.95 - i*0.12}"/>
            <!-- halving event ring -->
            <circle cx="${s.x1}" cy="${s.y}" r="8" fill="none" stroke="#FFB85C" stroke-width="1.2" opacity=".7" class="codex-info__strobe" style="animation-delay:${i * .4}s"/>
          ` : ''}
          <text x="${(s.x1 + s.x2) / 2}" y="${s.y - 8}" text-anchor="middle" fill="#FF4D60"
                font-family="JetBrains Mono, monospace" font-size="8" font-weight="800">${s.era}</text>
          <!-- token rain inside each era -->
          ${[0, 1, 2].map(j => `
            <circle r="1.4" fill="#FFB85C" opacity=".7">
              <animate attributeName="cy" values="${s.y};220" dur="${1.6 + j * .3}s" repeatCount="indefinite" begin="${j * .4 + i * .2}s"/>
              <animate attributeName="cx" values="${s.x1 + 20 + j * 24};${s.x1 + 20 + j * 24}" dur="${1.6 + j * .3}s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0;.8;.8;0" keyTimes="0;.15;.85;1" dur="${1.6 + j * .3}s" repeatCount="indefinite" begin="${j * .4 + i * .2}s"/>
            </circle>
          `).join('')}
        `).join('')}

        <!-- cumulative supply curve -->
        <path d="M 50 218 Q 200 130 300 90 T 560 50"
              fill="none" stroke="#FFB85C" stroke-width="2" stroke-dasharray="5,4" opacity=".75"/>
        <circle r="6" fill="#FFB85C" filter="url(#oxSoftGlow)">
          <animateMotion dur="7s" repeatCount="indefinite"
                         path="M 50 218 Q 200 130 300 90 T 560 50"/>
        </circle>
        <text x="555" y="44" text-anchor="end" fill="#FFB85C"
              font-family="JetBrains Mono, monospace" font-size="10" font-weight="800">→ 21M τ CAP</text>

        <!-- labels -->
        <text x="55" y="22" fill="#FF4D60"
              font-family="JetBrains Mono, monospace" font-size="9" font-weight="800" letter-spacing="2">PER-BLOCK EMISSION</text>

        <!-- HUD bottom -->
        <g transform="translate(50,250)">
          <text x="0" y="14" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="8" letter-spacing="2">NEXT HALVING</text>
          <text x="100" y="14" fill="#FF4D60" class="codex-info__strobe"
                font-family="JetBrains Mono, monospace" font-size="11" font-weight="800">~1,247 days</text>
          <text x="290" y="14" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="8" letter-spacing="2">SUPPLY MINTED</text>
          <text x="400" y="14" fill="#FFB85C"
                font-family="JetBrains Mono, monospace" font-size="11" font-weight="800">40.2% of 21M</text>
        </g>
      </svg>
    </figure>
  `,

  /* ============================================================
     WEIGHT · validator-to-miner weight matrix with cells flashing
     as weights are submitted. Aggregation arrow at bottom shows
     consensus emerging.
     ============================================================ */
  'weight': () => `
    <figure class="codex-info codex-info--weight" aria-label="Validator weight matrix">
      <figcaption class="codex-info__cap">
        Each validator (row) publishes a weight vector scoring every miner (column). Cells flash as new weights are submitted. The chain takes a stake-weighted median to produce the consensus vector that drives emission.
      </figcaption>
      <svg viewBox="0 0 600 320" class="codex-info__svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        ${SHARED_DEFS}
        ${BG}

        <text x="300" y="18" text-anchor="middle" fill="#FF1E3C" filter="url(#oxSoftGlow)"
              font-family="JetBrains Mono, monospace" font-size="10" font-weight="800" letter-spacing="2">
          WEIGHT MATRIX · 6 VALIDATORS × 12 MINERS · STAKE-WEIGHTED MEDIAN
        </text>

        <!-- column headers -->
        ${Array.from({length: 12}).map((_, j) => `
          <text x="${110 + j * 38}" y="42" text-anchor="middle" fill="#8B6B70"
                font-family="JetBrains Mono, monospace" font-size="8" font-weight="700">M${j+1}</text>
        `).join('')}

        <!-- 6 rows × 12 cols of weight cells with flash animation -->
        ${(() => {
          const rng = (s) => { let x = s; return () => { x = (x * 9301 + 49297) % 233280; return x / 233280; }; };
          const r = rng(7);
          const stakes = [28, 33, 12, 9, 18, 15];
          let svg = '';
          for (let i = 0; i < 6; i++){
            /* row label */
            svg += `<text x="80" y="${72 + i * 32}" text-anchor="end" fill="#F5E5E8"
                          font-family="JetBrains Mono, monospace" font-size="10" font-weight="800">V${i+1}</text>`;
            svg += `<text x="80" y="${84 + i * 32}" text-anchor="end" fill="#FF4D60"
                          font-family="JetBrains Mono, monospace" font-size="7" font-weight="700">${stakes[i]}K τ</text>`;
            for (let j = 0; j < 12; j++){
              const w = r();
              const op = w.toFixed(2);
              const x = 94 + j * 38;
              const y = 56 + i * 32;
              svg += `<rect x="${x}" y="${y}" width="34" height="24" rx="2"
                            fill="#FF1E3C"
                            class="codex-info__flash" style="--i:${(i * 6 + j) * .08}s; --op:${op}"/>`;
              if (w > 0.65) {
                svg += `<text x="${x + 17}" y="${y + 16}" text-anchor="middle" fill="#fff"
                              font-family="JetBrains Mono, monospace" font-size="8" font-weight="800">${(w * 100).toFixed(0)}</text>`;
              }
            }
          }
          return svg;
        })()}

        <!-- aggregation pulse arrow -->
        <g transform="translate(0,256)">
          <line x1="94" y1="0" x2="550" y2="0" stroke="url(#oxRedH)" stroke-width="2"/>
          <line x1="300" y1="0" x2="300" y2="22" stroke="#FF1E3C" stroke-width="2" filter="url(#oxSoftGlow)"/>
          <polygon points="294,18 306,18 300,28" fill="#FF1E3C" filter="url(#oxSoftGlow)"/>
        </g>

        <!-- consensus output bar -->
        <g transform="translate(94,290)">
          <rect x="0" y="0" width="456" height="22" rx="2" fill="rgba(255,30,60,.10)" stroke="#FF1E3C" stroke-opacity=".6"/>
          <rect x="0" y="0" width="456" height="22" rx="2" fill="url(#oxRedH)" class="codex-info__sheen" style="--d:0s"/>
          <text x="228" y="15" text-anchor="middle" fill="#FF4D60" filter="url(#oxSoftGlow)"
                font-family="JetBrains Mono, monospace" font-size="10" font-weight="800" letter-spacing="2">
            → CONSENSUS WEIGHT VECTOR → EMISSION SCHEDULE
          </text>
        </g>
      </svg>
    </figure>
  `,

  /* ============================================================
     MINER · lifecycle hexagon loop with continuous particle flow.
     Each station strobes when the particle hits it.
     ============================================================ */
  'miner': () => `
    <figure class="codex-info codex-info--miner" aria-label="Miner lifecycle">
      <figcaption class="codex-info__cap">
        The miner's economic loop. Pay τ to register, serve a model, answer validator queries, get scored, receive emission proportional to score. Quiet miners get pruned and burn their registration cost. Particle traces the loop in real time.
      </figcaption>
      <svg viewBox="0 0 600 280" class="codex-info__svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        ${SHARED_DEFS}
        ${BG}

        <!-- the loop path (invisible, for animateMotion) -->
        <path id="oxMinerLoop" d="M 90 140 L 215 70 L 340 70 L 465 140 L 340 210 L 215 210 Z"
              fill="none" stroke="#FF1E3C" stroke-width="1" stroke-opacity=".35" stroke-dasharray="4 6"
              class="codex-info__pulse-line"/>

        ${(() => {
          const nodes = [
            { x: 90,  y: 140, label: 'REGISTER',  sub: 'pay τ_burn',   icon: 'τ', color: '#FF1E3C' },
            { x: 215, y: 70,  label: 'SERVE',     sub: 'model up',     icon: 'M', color: '#FF4D60' },
            { x: 340, y: 70,  label: 'QUERY',     sub: 'from V',       icon: 'Q', color: '#FFB85C' },
            { x: 465, y: 140, label: 'SCORED',    sub: 'weight',       icon: '⊙', color: '#FFB85C' },
            { x: 340, y: 210, label: 'EMISSION',  sub: 'α / epoch',    icon: 'α', color: '#FFB85C' },
            { x: 215, y: 210, label: 'OR PRUNED', sub: 'low score',    icon: '✕', color: '#FF6B6B' },
          ];
          let svg = '';
          nodes.forEach((n, i) => {
            /* outer ring that strobes when active */
            svg += `<circle cx="${n.x}" cy="${n.y}" r="42" fill="none" stroke="${n.color}" stroke-opacity=".25"
                            class="codex-info__strobe" style="animation-delay:${i * .8}s"/>`;
            /* main node */
            svg += `<circle cx="${n.x}" cy="${n.y}" r="36" fill="rgba(255,30,60,.10)" stroke="${n.color}" stroke-width="1.6" filter="url(#oxSoftGlow)"/>`;
            svg += `<text x="${n.x}" y="${n.y - 8}" text-anchor="middle" fill="${n.color}"
                          font-family="Archivo, system-ui" font-size="20" font-weight="800">${n.icon}</text>`;
            svg += `<text x="${n.x}" y="${n.y + 10}" text-anchor="middle" fill="#F5E5E8"
                          font-family="JetBrains Mono, monospace" font-size="9" font-weight="800">${n.label}</text>`;
            svg += `<text x="${n.x}" y="${n.y + 22}" text-anchor="middle" fill="#8B6B70"
                          font-family="JetBrains Mono, monospace" font-size="7">${n.sub}</text>`;
          });
          return svg;
        })()}

        <!-- particle traveling the loop -->
        <circle r="5" fill="#fff" filter="url(#oxSoftGlow)">
          <animateMotion dur="8s" repeatCount="indefinite" rotate="auto">
            <mpath href="#oxMinerLoop"/>
          </animateMotion>
        </circle>
        <circle r="12" fill="#FF1E3C" opacity=".4">
          <animateMotion dur="8s" repeatCount="indefinite" rotate="auto">
            <mpath href="#oxMinerLoop"/>
          </animateMotion>
        </circle>
        <!-- second particle offset by half -->
        <circle r="4" fill="#FFB85C" filter="url(#oxSoftGlow)">
          <animateMotion dur="8s" repeatCount="indefinite" rotate="auto" begin="4s">
            <mpath href="#oxMinerLoop"/>
          </animateMotion>
        </circle>

        <!-- HUD bottom -->
        <g transform="translate(50,260)">
          <text x="0" y="0" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="8" letter-spacing="2">REG COST</text>
          <text x="0" y="14" fill="#FF4D60" font-family="JetBrains Mono, monospace" font-size="11" font-weight="800">~τ 0.42</text>
          <text x="130" y="0" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="8" letter-spacing="2">EPOCH LEN</text>
          <text x="130" y="14" fill="#F5E5E8" font-family="JetBrains Mono, monospace" font-size="11" font-weight="800">360 blocks</text>
          <text x="270" y="0" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="8" letter-spacing="2">PRUNE THRESHOLD</text>
          <text x="270" y="14" fill="#FF4D60" font-family="JetBrains Mono, monospace" font-size="11" font-weight="800">bottom-30%</text>
          <text x="450" y="0" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="8" letter-spacing="2">SURVIVE RATE</text>
          <text x="450" y="14" fill="#00E5A8" class="codex-info__strobe" font-family="JetBrains Mono, monospace" font-size="11" font-weight="800">≈70%</text>
        </g>
      </svg>
    </figure>
  `,

  /* ============================================================
     VALIDATOR · single validator at the top (hex with rotor),
     query particles fanning out to 6 miners with response
     particles returning, weight scores being painted live.
     ============================================================ */
  'validator': () => `
    <figure class="codex-info codex-info--val" aria-label="Validator role and reward">
      <figcaption class="codex-info__cap">
        Validators stake τ, query miners on schedule, score the responses, and submit a weight vector. The chain pays them in proportion to how well their weights align with the consensus (Yuma).
      </figcaption>
      <svg viewBox="0 0 600 320" class="codex-info__svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        ${SHARED_DEFS}
        ${BG}

        <!-- validator hex at top center with rotor -->
        <g transform="translate(300,60)">
          <circle r="60" class="codex-info__ring" style="--d:0s"/>
          <circle r="60" class="codex-info__ring" style="--d:1.3s"/>
          <!-- rotor scan arc -->
          <g class="codex-info__rotor">
            <path d="M -52 0 A 52 52 0 0 1 0 -52" fill="none" stroke="#FFB85C" stroke-width="2" opacity=".7"/>
          </g>
          <polygon points="-52,0 -26,-44 26,-44 52,0 26,44 -26,44"
                   fill="rgba(255,30,60,.22)" stroke="#FF1E3C" stroke-width="1.8" filter="url(#oxGlow)"/>
          <g class="codex-info__breathe">
            <text y="-12" text-anchor="middle" fill="#F5E5E8"
                  font-family="Archivo, system-ui" font-size="14" font-weight="800">VALIDATOR</text>
            <text y="4" text-anchor="middle" fill="#FF4D60" filter="url(#oxSoftGlow)"
                  font-family="JetBrains Mono, monospace" font-size="11" font-weight="800">28K τ</text>
            <text y="20" text-anchor="middle" fill="#C8A8AD"
                  font-family="JetBrains Mono, monospace" font-size="8">5HG…wf2K</text>
          </g>
        </g>

        <!-- 6 miners across bottom -->
        ${Array.from({length: 6}).map((_, i) => {
          const x = 80 + i * 90;
          const score = [82, 64, 91, 33, 76, 58][i];
          return `
            <g transform="translate(${x},220)">
              <!-- miner cell with flash on query hit -->
              <rect x="-30" y="0" width="60" height="50" rx="3"
                    fill="rgba(255,30,60,.08)" stroke="#FF1E3C" stroke-opacity=".55"
                    class="codex-info__flash" style="--i:${i * .3}s; --op:.5"/>
              <text y="18" text-anchor="middle" fill="#F5E5E8"
                    font-family="JetBrains Mono, monospace" font-size="11" font-weight="800">M${i+1}</text>
              <!-- score with gradient bar -->
              <text y="34" text-anchor="middle" fill="#FF4D60"
                    font-family="JetBrains Mono, monospace" font-size="9" font-weight="800">w=${score}</text>
              <rect x="-22" y="40" width="44" height="3" rx="1" fill="rgba(255,30,60,.15)"/>
              <rect x="-22" y="40" width="${(score / 100) * 44}" height="3" rx="1" fill="#FF4D60"/>
            </g>
          `;
        }).join('')}

        <!-- query arrows down + traveling query particles -->
        ${[0,1,2,3,4,5].map(i => {
          const x = 80 + i * 90;
          return `
            <line x1="300" y1="108" x2="${x}" y2="220"
                  stroke="#FF1E3C" stroke-width="1.2" stroke-opacity=".55"
                  class="codex-info__pulse-line" style="--d:${i*.16}s"/>
            <!-- query particle going down -->
            <circle r="3" fill="#FF4D60" filter="url(#oxSoftGlow)">
              <animate attributeName="cx" values="300;${x}" dur="1.6s" repeatCount="indefinite" begin="${i * .2}s"/>
              <animate attributeName="cy" values="108;220" dur="1.6s" repeatCount="indefinite" begin="${i * .2}s"/>
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.15;.85;1" dur="1.6s" repeatCount="indefinite" begin="${i * .2}s"/>
            </circle>
            <!-- response particle going up -->
            <circle r="2.5" fill="#FFB85C" filter="url(#oxSoftGlow)">
              <animate attributeName="cx" values="${x};300" dur="1.6s" repeatCount="indefinite" begin="${i * .2 + .8}s"/>
              <animate attributeName="cy" values="220;108" dur="1.6s" repeatCount="indefinite" begin="${i * .2 + .8}s"/>
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.15;.85;1" dur="1.6s" repeatCount="indefinite" begin="${i * .2 + .8}s"/>
            </circle>
          `;
        }).join('')}

        <!-- HUD bottom -->
        <g transform="translate(50,290)">
          <rect x="0" y="0" width="500" height="22" rx="3" fill="rgba(255,30,60,.05)" stroke="#FF1E3C" stroke-opacity=".25"/>
          <text x="10" y="14" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="8" letter-spacing="2">QUERIES/EPOCH</text>
          <text x="110" y="14" fill="#F5E5E8" font-family="JetBrains Mono, monospace" font-size="10" font-weight="800">~360</text>
          <text x="180" y="14" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="8" letter-spacing="2">CONSENSUS ALIGN</text>
          <text x="300" y="14" fill="#00E5A8" font-family="JetBrains Mono, monospace" font-size="10" font-weight="800">0.94</text>
          <text x="350" y="14" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="8" letter-spacing="2">EMISSION/d</text>
          <text x="430" y="14" fill="#FFB85C" class="codex-info__strobe" font-family="JetBrains Mono, monospace" font-size="10" font-weight="800">~38 τ</text>
        </g>
      </svg>
    </figure>
  `,
};
