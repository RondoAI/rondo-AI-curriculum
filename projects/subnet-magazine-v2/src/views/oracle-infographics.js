/* =================================================================
   SUBNET ORACLE, INFOGRAPHIC LIBRARY
   -----------------------------------------------------------------
   Educational, mechanism-first visualizations. Each diagram walks
   the reader through how something actually works: numbered steps,
   real values flowing through real connections, formulas where
   they clarify. Animation is in service of the explanation, not
   decoration.

   Pedagogical rules every diagram follows:
     1. Numbered steps so the reader can follow the mechanism
        sequentially (STEP 01, STEP 02, ...).
     2. Annotated arrows: every connection shows WHAT flows.
     3. Real example values (12τ stake, 0.87 score, 360 blocks).
     4. Formulas inline when they make the mechanism precise.
     5. A short caption at the bottom states the takeaway.

   Shared CSS animation primitives live in
   style/components/codex.css under "ORACLE INFOGRAPHIC FRAMEWORK".
   ================================================================= */

const SHARED_DEFS = `
  <defs>
    <radialGradient id="oxRedGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%"  stop-color="#FF1E3C" stop-opacity="1"/>
      <stop offset="60%" stop-color="#FF1E3C" stop-opacity=".25"/>
      <stop offset="100%" stop-color="#FF1E3C" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="oxRedH" x1="0" x2="1">
      <stop offset="0%"  stop-color="#FF1E3C" stop-opacity="0"/>
      <stop offset="50%" stop-color="#FF1E3C" stop-opacity="1"/>
      <stop offset="100%" stop-color="#FF1E3C" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="oxAmber" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%"  stop-color="#FFB85C"/>
      <stop offset="100%" stop-color="#FF7A2C"/>
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
    <marker id="oxArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="#FF1E3C"/>
    </marker>
    <marker id="oxArrowAmber" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="#FFB85C"/>
    </marker>
  </defs>
`;

const BG = `<rect width="100%" height="100%" fill="url(#oxGrid)" opacity=".35"/>`;

/** Step badge: a numbered circle + label, used to sequence the
 *  reader through the mechanism. */
function stepBadge(n, label, x, y, color = '#FF1E3C'){
  return `
    <g transform="translate(${x},${y})">
      <circle r="13" fill="${color}" filter="url(#oxSoftGlow)"/>
      <text y="4" text-anchor="middle" fill="#fff"
            font-family="JetBrains Mono, monospace" font-size="12" font-weight="800">${n}</text>
      <text x="20" y="4" fill="#F5E5E8"
            font-family="JetBrains Mono, monospace" font-size="9.5" font-weight="700" letter-spacing="1.5">${label}</text>
    </g>
  `;
}

/** Inline formula box, used to make a mechanism precise without
 *  leaving the diagram. */
function formula(text, x, y, w = 240, color = '#FFB85C'){
  return `
    <g transform="translate(${x},${y})">
      <rect x="0" y="0" width="${w}" height="26" rx="3"
            fill="rgba(0,0,0,.55)" stroke="${color}" stroke-opacity=".55" stroke-dasharray="3,2"/>
      <text x="${w / 2}" y="17" text-anchor="middle" fill="${color}"
            font-family="JetBrains Mono, monospace" font-size="11" font-weight="800">${text}</text>
    </g>
  `;
}

/** Annotated connection: a line + a small label that says what
 *  flows through it ("weight vector", "0.42 τ emission", etc). */
function annotatedArrow(x1, y1, x2, y2, label, color = '#FF1E3C', marker = 'oxArrow'){
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  return `
    <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
          stroke="${color}" stroke-width="1.6" marker-end="url(#${marker})" opacity=".8"/>
    <rect x="${mx - 50}" y="${my - 9}" width="100" height="14" rx="2"
          fill="rgba(8,2,3,.95)" stroke="${color}" stroke-opacity=".5"/>
    <text x="${mx}" y="${my + 1}" text-anchor="middle" fill="${color}"
          font-family="JetBrains Mono, monospace" font-size="8" font-weight="700">${label}</text>
  `;
}

export const INFOGRAPHICS = {
  /* ============================================================
     BITTENSOR · the end-to-end mechanism in five numbered steps.
     A validator queries a miner, the miner responds, the
     validator scores the response, submits a weight vector to
     the chain, and the chain pays out emission. This is the loop
     the entire network runs on every epoch.
     ============================================================ */
  'bittensor': () => `
    <figure class="codex-info codex-info--bittensor" aria-label="Bittensor end-to-end mechanism">
      <figcaption class="codex-info__cap">
        How the network actually works · five steps, repeated every 360 blocks (one epoch). Watch a query travel from validator to miner and back, get scored, settle on chain, and pay out emission.
      </figcaption>
      <svg viewBox="0 0 600 320" class="codex-info__svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        ${SHARED_DEFS}
        ${BG}

        <!-- VALIDATOR (left) -->
        <g transform="translate(50,90)">
          <rect x="0" y="0" width="120" height="80" rx="6"
                fill="rgba(255,30,60,.10)" stroke="#FF1E3C" stroke-width="1.6"/>
          <text x="60" y="22" text-anchor="middle" fill="#F5E5E8"
                font-family="Archivo, system-ui" font-size="13" font-weight="800">VALIDATOR</text>
          <text x="60" y="40" text-anchor="middle" fill="#FF4D60"
                font-family="JetBrains Mono, monospace" font-size="10" font-weight="700">stake: 28K τ</text>
          <text x="60" y="56" text-anchor="middle" fill="#8B6B70"
                font-family="JetBrains Mono, monospace" font-size="8">queries miners</text>
          <text x="60" y="70" text-anchor="middle" fill="#8B6B70"
                font-family="JetBrains Mono, monospace" font-size="8">scores responses</text>
        </g>

        <!-- MINER (right) -->
        <g transform="translate(430,90)">
          <rect x="0" y="0" width="120" height="80" rx="6"
                fill="rgba(255,184,92,.10)" stroke="#FFB85C" stroke-width="1.6"/>
          <text x="60" y="22" text-anchor="middle" fill="#F5E5E8"
                font-family="Archivo, system-ui" font-size="13" font-weight="800">MINER</text>
          <text x="60" y="40" text-anchor="middle" fill="#FFB85C"
                font-family="JetBrains Mono, monospace" font-size="10" font-weight="700">model: SN1-text</text>
          <text x="60" y="56" text-anchor="middle" fill="#8B6B70"
                font-family="JetBrains Mono, monospace" font-size="8">serves predictions</text>
          <text x="60" y="70" text-anchor="middle" fill="#8B6B70"
                font-family="JetBrains Mono, monospace" font-size="8">paid by emission</text>
        </g>

        <!-- STEP 1: validator -> miner (query) -->
        ${annotatedArrow(170, 120, 430, 120, '"translate this text"')}
        <text x="180" y="108" fill="#FF4D60" font-family="JetBrains Mono, monospace" font-size="9" font-weight="800">① QUERY</text>

        <!-- STEP 2: miner -> validator (response) -->
        ${annotatedArrow(430, 148, 170, 148, 'response · score 0.87', '#FFB85C', 'oxArrowAmber')}
        <text x="180" y="172" fill="#FFB85C" font-family="JetBrains Mono, monospace" font-size="9" font-weight="800">② RESPONSE</text>

        <!-- CHAIN (bottom) -->
        <g transform="translate(120,220)">
          <rect x="0" y="0" width="360" height="60" rx="6"
                fill="rgba(255,30,60,.06)" stroke="#FF1E3C" stroke-width="1.6"/>
          <text x="180" y="22" text-anchor="middle" fill="#F5E5E8"
                font-family="Archivo, system-ui" font-size="13" font-weight="800">SUBTENSOR CHAIN</text>
          <text x="180" y="40" text-anchor="middle" fill="#C8A8AD"
                font-family="JetBrains Mono, monospace" font-size="9">aggregates weights · mints emission · 12s block</text>
          <text x="180" y="54" text-anchor="middle" fill="#FF4D60" class="codex-info__strobe"
                font-family="JetBrains Mono, monospace" font-size="10" font-weight="800">block 8,190,127</text>
        </g>

        <!-- STEP 3: validator submits weight vector to chain -->
        <line x1="110" y1="170" x2="170" y2="222"
              stroke="#FF1E3C" stroke-width="1.6" marker-end="url(#oxArrow)"/>
        <rect x="40" y="186" width="116" height="16" rx="2"
              fill="rgba(8,2,3,.95)" stroke="#FF1E3C" stroke-opacity=".5"/>
        <text x="98" y="197" text-anchor="middle" fill="#FF1E3C"
              font-family="JetBrains Mono, monospace" font-size="9" font-weight="700">③ weights=[.87, ...]</text>

        <!-- STEP 4: chain pays emission back to validator + miner -->
        <line x1="430" y1="222" x2="490" y2="170"
              stroke="#FFB85C" stroke-width="1.6" marker-end="url(#oxArrowAmber)"/>
        <rect x="444" y="186" width="116" height="16" rx="2"
              fill="rgba(8,2,3,.95)" stroke="#FFB85C" stroke-opacity=".5"/>
        <text x="502" y="197" text-anchor="middle" fill="#FFB85C"
              font-family="JetBrains Mono, monospace" font-size="9" font-weight="700">④ emission paid</text>

        <!-- Particle showing query in flight -->
        <circle r="3.5" fill="#FF4D60" filter="url(#oxSoftGlow)">
          <animateMotion dur="2.4s" repeatCount="indefinite" path="M 170 120 L 430 120"/>
        </circle>
        <!-- Particle showing response in flight -->
        <circle r="3.5" fill="#FFB85C" filter="url(#oxSoftGlow)">
          <animateMotion dur="2.4s" repeatCount="indefinite" begin="1.2s" path="M 430 148 L 170 148"/>
        </circle>

        <!-- TAKEAWAY ribbon at the top -->
        <g transform="translate(40,30)">
          <text x="0" y="14" fill="#FF1E3C"
                font-family="JetBrains Mono, monospace" font-size="10" font-weight="800" letter-spacing="2">⊕ THE LOOP</text>
          <text x="0" y="30" fill="#F5E5E8"
                font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">Validator queries → Miner responds → Validator scores → Chain settles → Emission paid</text>
        </g>

        <!-- bottom annotation -->
        <text x="300" y="304" text-anchor="middle" fill="#8B6B70"
              font-family="JetBrains Mono, monospace" font-size="9">
          ⑤ NEXT BLOCK · the loop repeats every 12s · 360 blocks per epoch
        </text>
      </svg>
    </figure>
  `,

  /* ============================================================
     SUBTENSOR · what the chain actually records. A ledger view,
     three columns: identity (cold/hot keys), economic state
     (stake, weights), settlement (emission events). Real-looking
     rows so the reader sees what is and is not on-chain.
     ============================================================ */
  'subtensor': () => `
    <figure class="codex-info codex-info--subtensor" aria-label="What Subtensor records on-chain">
      <figcaption class="codex-info__cap">
        What lives on chain (and what does NOT) · the canonical ledger. Identity, economic state, and settlement events are on-chain; queries and model weights are off-chain.
      </figcaption>
      <svg viewBox="0 0 600 320" class="codex-info__svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        ${SHARED_DEFS}
        ${BG}

        <text x="300" y="22" text-anchor="middle" fill="#FF1E3C" filter="url(#oxSoftGlow)"
              font-family="JetBrains Mono, monospace" font-size="10" font-weight="800" letter-spacing="2">
          THE SUBTENSOR LEDGER · WHAT YOU CAN PROVE FROM A BLOCK
        </text>

        <!-- 3 columns -->
        ${[
          {
            x: 30, title: 'IDENTITY', sub: 'who is who',
            rows: [
              ['cold:', '5HG...wf2K'],
              ['hot:',  '5FBp...4nQa'],
              ['SN:',   '14 (TAOHash)'],
              ['UID:',  '#127'],
              ['type:', 'validator'],
            ],
            color: '#FF1E3C',
          },
          {
            x: 210, title: 'ECONOMIC', sub: 'stake + votes',
            rows: [
              ['stake:',     '28,400 τ'],
              ['delegate:',  '14,200 τ'],
              ['weights:',   '[.87, .55, .42 ...]'],
              ['set-block:', '8,190,000'],
              ['α-share:',   '3.8%'],
            ],
            color: '#FF4D60',
          },
          {
            x: 390, title: 'SETTLEMENT', sub: 'paid this epoch',
            rows: [
              ['blocks:',  '360 / 360'],
              ['rewards:', '37.4 τ'],
              ['burn:',    '0.42 τ'],
              ['stake Δ:', '+12.8 τ'],
              ['epoch:',   '22,750'],
            ],
            color: '#FFB85C',
          },
        ].map(col => `
          <g transform="translate(${col.x},50)">
            <rect x="0" y="0" width="180" height="220" rx="4"
                  fill="rgba(255,30,60,.06)" stroke="${col.color}" stroke-opacity=".6" stroke-width="1.4"/>
            <rect x="0" y="0" width="180" height="32" fill="${col.color}" fill-opacity=".22"/>
            <text x="10" y="20" fill="${col.color}"
                  font-family="JetBrains Mono, monospace" font-size="11" font-weight="800" letter-spacing="2">${col.title}</text>
            <text x="170" y="20" text-anchor="end" fill="#C8A8AD"
                  font-family="JetBrains Mono, monospace" font-size="8">${col.sub}</text>
            ${col.rows.map((r, i) => `
              <text x="10" y="${56 + i * 32}" fill="#8B6B70"
                    font-family="JetBrains Mono, monospace" font-size="8.5" letter-spacing="1">${r[0]}</text>
              <text x="170" y="${56 + i * 32}" text-anchor="end" fill="#F5E5E8"
                    font-family="JetBrains Mono, monospace" font-size="10" font-weight="700">${r[1]}</text>
              ${i < col.rows.length - 1 ? `<line x1="10" y1="${60 + i * 32}" x2="170" y2="${60 + i * 32}" stroke="${col.color}" stroke-opacity=".15"/>` : ''}
            `).join('')}
          </g>
        `).join('')}

        <!-- NOT ON CHAIN warning bar -->
        <g transform="translate(30,288)">
          <rect x="0" y="0" width="540" height="26" rx="3"
                fill="rgba(255,30,60,.05)" stroke="#FF1E3C" stroke-opacity=".4" stroke-dasharray="4,3"/>
          <text x="12" y="17" fill="#FF4D60"
                font-family="JetBrains Mono, monospace" font-size="9" font-weight="800" letter-spacing="2">⊘ NOT ON CHAIN</text>
          <text x="130" y="17" fill="#C8A8AD"
                font-family="JetBrains Mono, monospace" font-size="9">model weights · queries · responses · raw data (off-chain P2P transport)</text>
        </g>
      </svg>
    </figure>
  `,

  /* ============================================================
     TAO · the emission formula made concrete. Shows the per-block
     mint rate, the halving schedule, and the cumulative supply
     approaching the 21M cap. Math in the box, curve in the chart.
     ============================================================ */
  'tao': () => `
    <figure class="codex-info codex-info--tao" aria-label="TAO emission schedule">
      <figcaption class="codex-info__cap">
        The TAO emission formula · per-block mint halves every ~4 years (210K blocks). The yellow curve below shows cumulative supply approaching the 21M hard cap.
      </figcaption>
      <svg viewBox="0 0 600 320" class="codex-info__svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        ${SHARED_DEFS}
        ${BG}

        <!-- THE FORMULA -->
        <g transform="translate(30,30)">
          <rect x="0" y="0" width="540" height="62" rx="4"
                fill="rgba(0,0,0,.6)" stroke="#FFB85C" stroke-opacity=".5" stroke-dasharray="3,2"/>
          <text x="14" y="20" fill="#FFB85C"
                font-family="JetBrains Mono, monospace" font-size="10" font-weight="800" letter-spacing="2">⊕ EMISSION FORMULA</text>
          <text x="14" y="44" fill="#F5E5E8"
                font-family="JetBrains Mono, monospace" font-size="14" font-weight="700">per_block = 1 τ ÷ 2^era    where era = floor(block / 210,000)</text>
          <text x="14" y="58" fill="#C8A8AD"
                font-family="JetBrains Mono, monospace" font-size="9">at 12s block time, era 0 mints ≈ 7,200 τ/day · era 1 mints ≈ 3,600 τ/day · ...</text>
        </g>

        <!-- chart frame -->
        <line x1="50" y1="270" x2="560" y2="270" stroke="#3a1419"/>
        <line x1="50" y1="120" x2="50"  y2="270" stroke="#3a1419"/>
        ${[2021, 2025, 2029, 2033, 2037, 2041].map((y, i) => {
          const x = 50 + i * 102;
          return `<text x="${x}" y="288" text-anchor="middle" fill="#8B6B70"
                        font-family="JetBrains Mono, monospace" font-size="9">${y}</text>`;
        }).join('')}

        <!-- per-era step function with labels -->
        ${[
          { x1: 50,  x2: 152, y: 138, era: '7,200 τ/d', label: 'era 0', current: false },
          { x1: 152, x2: 254, y: 170, era: '3,600 τ/d', label: 'era 1', current: true  },
          { x1: 254, x2: 356, y: 198, era: '1,800 τ/d', label: 'era 2', current: false },
          { x1: 356, x2: 458, y: 220, era: '900 τ/d',   label: 'era 3', current: false },
          { x1: 458, x2: 560, y: 238, era: '450 τ/d',   label: 'era 4', current: false },
        ].map((s, i) => `
          <line x1="${s.x1}" y1="${s.y}" x2="${s.x2}" y2="${s.y}"
                stroke="#FF1E3C" stroke-width="${s.current ? 3 : 2}" stroke-opacity="${0.95 - i*0.1}"/>
          ${i > 0 ? `
            <line x1="${s.x1}" y1="${i === 1 ? 138 : (s.y - 28)}" x2="${s.x1}" y2="${s.y}"
                  stroke="#FF1E3C" stroke-width="2" stroke-opacity="${0.95 - i*0.1}"/>
            <circle cx="${s.x1}" cy="${s.y}" r="5" fill="none" stroke="#FFB85C" stroke-width="1.2"
                    class="codex-info__strobe" style="animation-delay:${i * .4}s"/>
            <text x="${s.x1}" y="${s.y - 12}" text-anchor="middle" fill="#FFB85C"
                  font-family="JetBrains Mono, monospace" font-size="8" font-weight="800">HALVING</text>
          ` : ''}
          <text x="${(s.x1 + s.x2) / 2}" y="${s.y - 6}" text-anchor="middle" fill="#FF4D60"
                font-family="JetBrains Mono, monospace" font-size="9" font-weight="800">${s.era}</text>
          <text x="${(s.x1 + s.x2) / 2}" y="${s.y + 14}" text-anchor="middle" fill="#8B6B70"
                font-family="JetBrains Mono, monospace" font-size="7">${s.label}${s.current ? ' · NOW' : ''}</text>
        `).join('')}

        <!-- cumulative supply curve -->
        <path d="M 50 268 Q 200 175 320 130 T 560 110"
              fill="none" stroke="#FFB85C" stroke-width="1.8" stroke-dasharray="5,3" opacity=".7"/>
        <text x="556" y="104" text-anchor="end" fill="#FFB85C"
              font-family="JetBrains Mono, monospace" font-size="10" font-weight="800">cumulative → 21M τ cap</text>

        <!-- live status -->
        <g transform="translate(50,300)">
          <text x="0" y="14" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="9" letter-spacing="1.5">TODAY</text>
          <text x="55" y="14" fill="#F5E5E8" class="codex-info__strobe"
                font-family="JetBrains Mono, monospace" font-size="10" font-weight="800">era 1 · 3,600 τ/d minted · ~8.4M τ in circulation (40% of cap)</text>
        </g>
      </svg>
    </figure>
  `,

  /* ============================================================
     ALPHA · a worked example of the bonding curve. Pool starts
     at (100τ, 1000α), user bonds 10τ, new state is shown with
     the actual arithmetic. This is the most useful single
     diagram on the page because it answers "what does my τ buy".
     ============================================================ */
  'alpha': () => `
    <figure class="codex-info codex-info--alpha" aria-label="Alpha bonding curve worked example">
      <figcaption class="codex-info__cap">
        Worked example · a constant-product pool (x·y = k) before and after a 10τ bond. The α price rises because every bond shifts reserves; this is the mechanism the network uses to price every subnet's token.
      </figcaption>
      <svg viewBox="0 0 600 340" class="codex-info__svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        ${SHARED_DEFS}
        ${BG}

        <!-- THE INVARIANT FORMULA -->
        <g transform="translate(30,28)">
          <rect x="0" y="0" width="540" height="46" rx="4"
                fill="rgba(0,0,0,.6)" stroke="#FFB85C" stroke-opacity=".5" stroke-dasharray="3,2"/>
          <text x="14" y="18" fill="#FFB85C"
                font-family="JetBrains Mono, monospace" font-size="10" font-weight="800" letter-spacing="2">⊕ INVARIANT</text>
          <text x="14" y="36" fill="#F5E5E8"
                font-family="JetBrains Mono, monospace" font-size="14" font-weight="700">τ_reserve × α_reserve = k    →    α_price = τ_reserve ÷ α_reserve</text>
        </g>

        <!-- BEFORE -->
        <g transform="translate(40,100)">
          <rect x="0" y="0" width="220" height="160" rx="4"
                fill="rgba(255,30,60,.06)" stroke="#FF1E3C" stroke-opacity=".55" stroke-width="1.4"/>
          <rect x="0" y="0" width="220" height="26" fill="#FF1E3C" fill-opacity=".22"/>
          <text x="12" y="18" fill="#FF1E3C"
                font-family="JetBrains Mono, monospace" font-size="11" font-weight="800" letter-spacing="2">BEFORE BOND</text>
          <text x="12" y="50" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="9">τ reserve</text>
          <text x="208" y="50" text-anchor="end" fill="#F5E5E8" font-family="JetBrains Mono, monospace" font-size="14" font-weight="800">100 τ</text>
          <text x="12" y="78" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="9">α reserve</text>
          <text x="208" y="78" text-anchor="end" fill="#F5E5E8" font-family="JetBrains Mono, monospace" font-size="14" font-weight="800">1,000 α</text>
          <line x1="12" y1="90" x2="208" y2="90" stroke="#FF1E3C" stroke-opacity=".2"/>
          <text x="12" y="110" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="9">k</text>
          <text x="208" y="110" text-anchor="end" fill="#FFB85C" font-family="JetBrains Mono, monospace" font-size="13" font-weight="800">100,000</text>
          <text x="12" y="134" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="9">α price</text>
          <text x="208" y="134" text-anchor="end" fill="#FFB85C" font-family="JetBrains Mono, monospace" font-size="14" font-weight="800">0.100 τ</text>
        </g>

        <!-- ARROW + ACTION -->
        <g transform="translate(280,160)">
          <line x1="0" y1="20" x2="40" y2="20" stroke="#FFB85C" stroke-width="2" marker-end="url(#oxArrowAmber)"/>
          <text x="20" y="10" text-anchor="middle" fill="#FFB85C"
                font-family="JetBrains Mono, monospace" font-size="9" font-weight="800">BOND</text>
          <text x="20" y="38" text-anchor="middle" fill="#F5E5E8"
                font-family="JetBrains Mono, monospace" font-size="11" font-weight="800">+10 τ</text>
          <text x="20" y="52" text-anchor="middle" fill="#FFB85C"
                font-family="JetBrains Mono, monospace" font-size="8">↳ receive α</text>
        </g>

        <!-- AFTER -->
        <g transform="translate(340,100)">
          <rect x="0" y="0" width="220" height="160" rx="4"
                fill="rgba(255,184,92,.06)" stroke="#FFB85C" stroke-opacity=".7" stroke-width="1.4"/>
          <rect x="0" y="0" width="220" height="26" fill="#FFB85C" fill-opacity=".22"/>
          <text x="12" y="18" fill="#FFB85C"
                font-family="JetBrains Mono, monospace" font-size="11" font-weight="800" letter-spacing="2">AFTER BOND</text>
          <text x="12" y="50" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="9">τ reserve</text>
          <text x="208" y="50" text-anchor="end" fill="#F5E5E8" font-family="JetBrains Mono, monospace" font-size="14" font-weight="800">110 τ</text>
          <text x="12" y="64" fill="#00E5A8" font-family="JetBrains Mono, monospace" font-size="7">+10 τ (you bonded)</text>
          <text x="12" y="82" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="9">α reserve</text>
          <text x="208" y="82" text-anchor="end" fill="#F5E5E8" font-family="JetBrains Mono, monospace" font-size="14" font-weight="800">909 α</text>
          <text x="12" y="96" fill="#FFB85C" font-family="JetBrains Mono, monospace" font-size="7">↳ you got 91 α</text>
          <line x1="12" y1="104" x2="208" y2="104" stroke="#FFB85C" stroke-opacity=".2"/>
          <text x="12" y="120" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="9">k (preserved)</text>
          <text x="208" y="120" text-anchor="end" fill="#FFB85C" font-family="JetBrains Mono, monospace" font-size="13" font-weight="800">100,000</text>
          <text x="12" y="142" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="9">α price</text>
          <text x="208" y="142" text-anchor="end" fill="#FFB85C" class="codex-info__strobe" font-family="JetBrains Mono, monospace" font-size="14" font-weight="800">0.121 τ ▲</text>
        </g>

        <!-- TAKEAWAY -->
        <g transform="translate(30,278)">
          <rect x="0" y="0" width="540" height="44" rx="3"
                fill="rgba(255,30,60,.06)" stroke="#FF1E3C" stroke-opacity=".4"/>
          <text x="14" y="18" fill="#FF1E3C"
                font-family="JetBrains Mono, monospace" font-size="9" font-weight="800" letter-spacing="2">⊕ WHAT JUST HAPPENED</text>
          <text x="14" y="36" fill="#F5E5E8"
                font-family="JetBrains Mono, monospace" font-size="10">
            You bonded 10 τ. Pool gave you 91 α (k stayed constant). Price rose 0.100 → 0.121 τ (+21%). The next bond pays more.
          </text>
        </g>
      </svg>
    </figure>
  `,

  /* ============================================================
     DTAO · how emission share is set by market price. Three
     subnets shown with their α-MCAPs, the share formula applied,
     and the daily emission each one receives. The thing the
     reader walks away with: subnets compete for emission via
     their α token's price.
     ============================================================ */
  'dtao': () => `
    <figure class="codex-info codex-info--dtao" aria-label="dTAO emission allocation by alpha MCAP">
      <figcaption class="codex-info__cap">
        How dTAO decides who gets paid · each subnet's emission share equals its α-MCAP divided by total α-MCAP across all subnets. Worked example with three subnets.
      </figcaption>
      <svg viewBox="0 0 600 320" class="codex-info__svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        ${SHARED_DEFS}
        ${BG}

        <!-- THE FORMULA -->
        <g transform="translate(30,28)">
          <rect x="0" y="0" width="540" height="46" rx="4"
                fill="rgba(0,0,0,.6)" stroke="#FFB85C" stroke-opacity=".5" stroke-dasharray="3,2"/>
          <text x="14" y="18" fill="#FFB85C"
                font-family="JetBrains Mono, monospace" font-size="10" font-weight="800" letter-spacing="2">⊕ EMISSION SHARE</text>
          <text x="14" y="36" fill="#F5E5E8"
                font-family="JetBrains Mono, monospace" font-size="14" font-weight="700">
            share_i = α_mcap_i ÷ Σ α_mcap     →     daily_emission_i = share_i × 7,200 τ
          </text>
        </g>

        <!-- 3 subnet rows -->
        ${[
          { i: 1, name: 'TEXT',     mcap: 480, color: '#FF1E3C' },
          { i: 2, name: 'TRAINING', mcap: 240, color: '#FF7A2C' },
          { i: 3, name: 'AUDIO',    mcap: 80,  color: '#FFB85C' },
        ].map((s, idx) => {
          const total = 800;
          const share = (s.mcap / total) * 100;
          const dailyEmission = ((s.mcap / total) * 7200).toFixed(0);
          const y = 100 + idx * 60;
          const barW = (s.mcap / total) * 360;
          return `
            <g transform="translate(30,${y})">
              <!-- subnet label -->
              <rect x="0" y="0" width="78" height="42" rx="3"
                    fill="rgba(255,30,60,.08)" stroke="${s.color}" stroke-width="1.4"/>
              <text x="39" y="18" text-anchor="middle" fill="#F5E5E8"
                    font-family="JetBrains Mono, monospace" font-size="10" font-weight="800">SN${s.i}</text>
              <text x="39" y="32" text-anchor="middle" fill="${s.color}"
                    font-family="JetBrains Mono, monospace" font-size="8" font-weight="700">${s.name}</text>
              <!-- α-MCAP value -->
              <text x="90" y="18" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="8" letter-spacing="1.5">α-MCAP</text>
              <text x="90" y="34" fill="#F5E5E8" font-family="JetBrains Mono, monospace" font-size="13" font-weight="800">${s.mcap} τ</text>
              <!-- share bar -->
              <rect x="160" y="14" width="360" height="14" rx="2" fill="rgba(255,30,60,.10)"/>
              <rect x="160" y="14" width="${barW}" height="14" rx="2" fill="${s.color}" filter="url(#oxSoftGlow)"/>
              <text x="${160 + barW + 6}" y="25" fill="${s.color}"
                    font-family="JetBrains Mono, monospace" font-size="10" font-weight="800">${share.toFixed(0)}%</text>
              <!-- daily emission earned -->
              <text x="160" y="42" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="8">earns</text>
              <text x="200" y="42" fill="#FFB85C" font-family="JetBrains Mono, monospace" font-size="10" font-weight="800">${dailyEmission} τ/day</text>
            </g>
          `;
        }).join('')}

        <!-- TOTAL row -->
        <g transform="translate(30,272)">
          <line x1="0" y1="0" x2="540" y2="0" stroke="#FF1E3C" stroke-opacity=".3"/>
          <text x="0" y="18" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="9" letter-spacing="1.5">TOTAL</text>
          <text x="90" y="18" fill="#F5E5E8" font-family="JetBrains Mono, monospace" font-size="13" font-weight="800">800 τ α-mcap</text>
          <text x="240" y="18" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="9" letter-spacing="1.5">PAYS OUT</text>
          <text x="340" y="18" fill="#FFB85C" class="codex-info__strobe"
                font-family="JetBrains Mono, monospace" font-size="13" font-weight="800">7,200 τ/day</text>
          <text x="0" y="36" fill="#FF1E3C"
                font-family="JetBrains Mono, monospace" font-size="9" font-weight="700">⊕ takeaway · bid up α to capture more emission · self-organizing capital allocator</text>
        </g>
      </svg>
    </figure>
  `,

  /* ============================================================
     EMISSION · what happens to one block's mint. Shows the
     7,200τ/day pool, the per-subnet split, and inside one
     subnet, the 41/41/18 cut between miners/validators/owner.
     ============================================================ */
  'emission': () => `
    <figure class="codex-info codex-info--emit" aria-label="Per-block emission split">
      <figcaption class="codex-info__cap">
        Where the mint goes · the chain splits each block's emission across subnets by α-MCAP, then each subnet splits its slice 41% miners, 41% validators, 18% subnet owner.
      </figcaption>
      <svg viewBox="0 0 600 320" class="codex-info__svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        ${SHARED_DEFS}
        ${BG}

        <!-- STEP 1: TAO pool at the top -->
        ${stepBadge(1, 'CHAIN MINTS', 30, 36)}
        <g transform="translate(30,56)">
          <rect x="0" y="0" width="540" height="40" rx="4"
                fill="url(#oxAmber)" filter="url(#oxSoftGlow)"/>
          <text x="270" y="25" text-anchor="middle" fill="#1F0A10"
                font-family="Archivo, system-ui" font-size="16" font-weight="800">7,200 τ / day</text>
          <text x="270" y="38" text-anchor="middle" fill="rgba(31,10,16,.7)"
                font-family="JetBrains Mono, monospace" font-size="8" font-weight="800" letter-spacing="2">era 1 · 1 τ ÷ 2 = 0.5 τ per block × 14,400 blocks/day</text>
        </g>

        <!-- STEP 2: split across subnets -->
        ${stepBadge(2, 'SPLIT BY α-MCAP', 30, 124)}
        ${[
          { x: 30,  w: 240, name: 'SN1 TEXT',     pct: 60, emit: 4320 },
          { x: 280, w: 120, name: 'SN2 TRAIN',    pct: 30, emit: 2160 },
          { x: 410, w:  80, name: 'SN3 AUDIO',    pct: 10, emit:  720 },
        ].map(sn => `
          <g transform="translate(${sn.x},150)">
            <rect x="0" y="0" width="${sn.w}" height="34" rx="3"
                  fill="rgba(255,30,60,.18)" stroke="#FF1E3C" stroke-width="1.2"/>
            <text x="${sn.w / 2}" y="14" text-anchor="middle" fill="#F5E5E8"
                  font-family="JetBrains Mono, monospace" font-size="10" font-weight="800">${sn.name}</text>
            <text x="${sn.w / 2}" y="28" text-anchor="middle" fill="#FFB85C"
                  font-family="JetBrains Mono, monospace" font-size="9" font-weight="700">${sn.pct}% · ${sn.emit} τ/d</text>
          </g>
        `).join('')}
        <text x="500" y="172" fill="#8B6B70"
              font-family="JetBrains Mono, monospace" font-size="9">Σ = 7,200 τ</text>

        <!-- STEP 3: within one subnet, 41/41/18 cut -->
        ${stepBadge(3, 'WITHIN SN1: 41 / 41 / 18 CUT', 30, 208)}
        <g transform="translate(30,234)">
          <!-- miners -->
          <rect x="0" y="0" width="222" height="44" rx="3"
                fill="rgba(255,184,92,.15)" stroke="#FFB85C" stroke-width="1.2"/>
          <text x="111" y="18" text-anchor="middle" fill="#FFB85C"
                font-family="Archivo, system-ui" font-size="12" font-weight="800">MINERS</text>
          <text x="111" y="34" text-anchor="middle" fill="#F5E5E8"
                font-family="JetBrains Mono, monospace" font-size="10" font-weight="800">41% · 1,771 τ/d</text>
          <!-- validators -->
          <rect x="230" y="0" width="222" height="44" rx="3"
                fill="rgba(255,30,60,.15)" stroke="#FF4D60" stroke-width="1.2"/>
          <text x="341" y="18" text-anchor="middle" fill="#FF4D60"
                font-family="Archivo, system-ui" font-size="12" font-weight="800">VALIDATORS</text>
          <text x="341" y="34" text-anchor="middle" fill="#F5E5E8"
                font-family="JetBrains Mono, monospace" font-size="10" font-weight="800">41% · 1,771 τ/d</text>
          <!-- owner -->
          <rect x="460" y="0" width="80" height="44" rx="3"
                fill="rgba(255,30,60,.08)" stroke="#FF1E3C" stroke-width="1.2"/>
          <text x="500" y="18" text-anchor="middle" fill="#FF1E3C"
                font-family="Archivo, system-ui" font-size="11" font-weight="800">OWNER</text>
          <text x="500" y="34" text-anchor="middle" fill="#F5E5E8"
                font-family="JetBrains Mono, monospace" font-size="9" font-weight="800">18% · 778 τ/d</text>
        </g>

        <!-- bottom note -->
        <text x="300" y="304" text-anchor="middle" fill="#8B6B70"
              font-family="JetBrains Mono, monospace" font-size="9">
          ⊕ the 41/41/18 cut is set by the subnet owner at registration · this is the SN1 example
        </text>
      </svg>
    </figure>
  `,

  /* ============================================================
     YUMA CONSENSUS · the aggregation made concrete. Three
     validators submit weight vectors; the chain takes a
     stake-weighted median per miner; the consensus vector emerges.
     ============================================================ */
  'yuma-consensus': () => `
    <figure class="codex-info codex-info--yuma" aria-label="Yuma Consensus, worked example">
      <figcaption class="codex-info__cap">
        Yuma in numbers · three validators submit weights, the chain computes a stake-weighted median per miner, and the consensus vector pays the miners. Validators whose weights drift far from consensus get their reward discounted.
      </figcaption>
      <svg viewBox="0 0 600 360" class="codex-info__svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        ${SHARED_DEFS}
        ${BG}

        ${stepBadge(1, 'VALIDATORS SUBMIT WEIGHT VECTORS', 30, 30)}

        <!-- 3 validators with their weight vectors -->
        ${[
          { name: 'V1', stake: 12, w: [.8, .3, .5], color: '#FF1E3C' },
          { name: 'V2', stake: 28, w: [.7, .4, .5], color: '#FF1E3C' },
          { name: 'V3', stake: 9,  w: [.2, .9, .5], color: '#FF7755', outlier: true },
        ].map((v, i) => {
          const y = 56 + i * 50;
          return `
            <g transform="translate(30,${y})">
              <rect x="0" y="0" width="80" height="40" rx="3"
                    fill="rgba(255,30,60,.10)" stroke="${v.color}" stroke-width="1.4"/>
              <text x="40" y="18" text-anchor="middle" fill="#F5E5E8"
                    font-family="JetBrains Mono, monospace" font-size="11" font-weight="800">${v.name}</text>
              <text x="40" y="32" text-anchor="middle" fill="${v.color}"
                    font-family="JetBrains Mono, monospace" font-size="9" font-weight="700">${v.stake}K τ</text>
              <!-- weight vector -->
              <text x="100" y="14" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="8" letter-spacing="1.5">submits weights:</text>
              ${v.w.map((w, j) => `
                <g transform="translate(${100 + j * 80},22)">
                  <rect x="0" y="0" width="68" height="18" rx="2"
                        fill="rgba(255,30,60,${w * .35})" stroke="${v.color}" stroke-opacity=".6"/>
                  <text x="6" y="13" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="8">M${j+1}</text>
                  <text x="62" y="13" text-anchor="end" fill="#F5E5E8"
                        font-family="JetBrains Mono, monospace" font-size="10" font-weight="800">${w.toFixed(2)}</text>
                </g>
              `).join('')}
              ${v.outlier ? `<text x="350" y="32" fill="#FF7755" font-family="JetBrains Mono, monospace" font-size="8" font-weight="700">⚠ outlier</text>` : ''}
            </g>
          `;
        }).join('')}

        ${stepBadge(2, 'CHAIN COMPUTES STAKE-WEIGHTED MEDIAN PER MINER', 30, 220)}

        <!-- aggregation arrow -->
        <line x1="300" y1="246" x2="300" y2="266" stroke="#FFB85C" stroke-width="2" marker-end="url(#oxArrowAmber)"/>

        <!-- consensus row -->
        <g transform="translate(30,280)">
          <rect x="0" y="0" width="540" height="44" rx="3"
                fill="rgba(255,184,92,.12)" stroke="#FFB85C" stroke-width="1.6"/>
          <text x="12" y="18" fill="#FFB85C"
                font-family="JetBrains Mono, monospace" font-size="10" font-weight="800" letter-spacing="2">CONSENSUS</text>
          <text x="12" y="34" fill="#C8A8AD"
                font-family="JetBrains Mono, monospace" font-size="8">paid to miners</text>
          ${[.75, .35, .50].map((w, j) => `
            <g transform="translate(${100 + j * 140},10)">
              <rect x="0" y="0" width="120" height="26" rx="2"
                    fill="#FFB85C" fill-opacity="${w * .6 + .2}" filter="url(#oxSoftGlow)"/>
              <text x="8" y="18" fill="#1F0A10"
                    font-family="JetBrains Mono, monospace" font-size="10" font-weight="800">M${j+1}</text>
              <text x="112" y="18" text-anchor="end" fill="#1F0A10"
                    font-family="JetBrains Mono, monospace" font-size="11" font-weight="800">${w.toFixed(2)}</text>
            </g>
          `).join('')}
        </g>

        <!-- takeaway -->
        <text x="30" y="346" fill="#FF1E3C"
              font-family="JetBrains Mono, monospace" font-size="9" font-weight="800" letter-spacing="2">⊕</text>
        <text x="48" y="346" fill="#F5E5E8"
              font-family="JetBrains Mono, monospace" font-size="10">
          V3 picked M2 (.9) when consensus is .35 · V3's reward is discounted by distance from the median
        </text>
      </svg>
    </figure>
  `,

  /* ============================================================
     SUBNET · what a subnet actually is. Three real-looking
     examples: SN1 TEXT (prompt → response), SN14 TAOHash (work
     → hash share), SN64 RIDGES (route → cache). Anatomy: input
     type, miner role, validator role, α token.
     ============================================================ */
  'subnet': () => `
    <figure class="codex-info codex-info--sn" aria-label="Subnet anatomy, three examples">
      <figcaption class="codex-info__cap">
        A subnet is a market for one specific kind of intelligence · the protocol contract specifies the input, the miner's job, and how validators score the work. Three real subnets shown.
      </figcaption>
      <svg viewBox="0 0 600 320" class="codex-info__svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        ${SHARED_DEFS}
        ${BG}

        <text x="300" y="22" text-anchor="middle" fill="#FF1E3C"
              font-family="JetBrains Mono, monospace" font-size="10" font-weight="800" letter-spacing="2">
          ANATOMY OF A SUBNET · INPUT · MINER JOB · VALIDATOR SCORE · α TOKEN
        </text>

        ${[
          {
            n: '01', name: 'TEXT', color: '#FF1E3C',
            input: '"summarize this article"',
            miner: 'runs LLM, returns summary',
            score: 'rubric quality + latency',
            token: 'α-text',
          },
          {
            n: '14', name: 'TAOHASH', color: '#FF7755',
            input: 'work seed (BTC-like)',
            miner: 'submits proof-of-hash share',
            score: 'hash share count',
            token: 'α-hash',
          },
          {
            n: '64', name: 'RIDGES', color: '#FFB85C',
            input: 'inference route request',
            miner: 'routes to best provider',
            score: 'routing accuracy + cost',
            token: 'α-ridges',
          },
        ].map((s, i) => {
          const y = 50 + i * 80;
          return `
            <g transform="translate(20,${y})">
              <rect x="0" y="0" width="560" height="68" rx="4"
                    fill="rgba(255,30,60,.04)" stroke="${s.color}" stroke-opacity=".6" stroke-width="1.4"/>
              <!-- subnet id -->
              <rect x="0" y="0" width="80" height="68" rx="4 0 0 4" fill="${s.color}" fill-opacity=".22"/>
              <text x="40" y="32" text-anchor="middle" fill="#F5E5E8"
                    font-family="Archivo, system-ui" font-size="16" font-weight="800">SN${s.n}</text>
              <text x="40" y="48" text-anchor="middle" fill="${s.color}"
                    font-family="JetBrains Mono, monospace" font-size="9" font-weight="700">${s.name}</text>
              <!-- input -->
              <g transform="translate(96,8)">
                <text x="0" y="10" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="7.5" letter-spacing="1.5">INPUT</text>
                <text x="0" y="26" fill="#F5E5E8" font-family="JetBrains Mono, monospace" font-size="9" font-weight="700">${s.input}</text>
              </g>
              <!-- miner role -->
              <g transform="translate(96,44)">
                <text x="0" y="10" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="7.5" letter-spacing="1.5">MINER DOES</text>
                <text x="0" y="22" fill="#F5E5E8" font-family="JetBrains Mono, monospace" font-size="9">${s.miner}</text>
              </g>
              <!-- score method -->
              <g transform="translate(300,8)">
                <text x="0" y="10" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="7.5" letter-spacing="1.5">VALIDATOR SCORES BY</text>
                <text x="0" y="26" fill="#F5E5E8" font-family="JetBrains Mono, monospace" font-size="9">${s.score}</text>
              </g>
              <!-- α token -->
              <g transform="translate(460,18)">
                <rect x="0" y="0" width="84" height="34" rx="3"
                      fill="rgba(255,184,92,.15)" stroke="#FFB85C" stroke-opacity=".7"/>
                <text x="42" y="14" text-anchor="middle" fill="#FFB85C"
                      font-family="JetBrains Mono, monospace" font-size="8" font-weight="800" letter-spacing="1.5">TOKEN</text>
                <text x="42" y="28" text-anchor="middle" fill="#F5E5E8"
                      font-family="JetBrains Mono, monospace" font-size="10" font-weight="800">${s.token}</text>
              </g>
            </g>
          `;
        }).join('')}

        <!-- takeaway -->
        <g transform="translate(30,294)">
          <text x="0" y="14" fill="#FF1E3C"
                font-family="JetBrains Mono, monospace" font-size="9" font-weight="800" letter-spacing="2">⊕</text>
          <text x="18" y="14" fill="#F5E5E8"
                font-family="JetBrains Mono, monospace" font-size="10">
            Every subnet has its own input, scoring rule, α token, and emission share. ~92 active subnets today; cap is 256.
          </text>
        </g>
      </svg>
    </figure>
  `,

  /* ============================================================
     HALVING · timeline of past + scheduled halvings with the
     per-block reward at each era marked. Cumulative supply
     shown approaching 21M cap.
     ============================================================ */
  'halving': () => `
    <figure class="codex-info codex-info--halve" aria-label="TAO halving schedule">
      <figcaption class="codex-info__cap">
        The halving calendar · every 210,000 blocks (~4 years) the per-block reward halves. Genesis: 1τ/block. Today: 0.5τ/block. Cap: 21M τ asymptote.
      </figcaption>
      <svg viewBox="0 0 600 320" class="codex-info__svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        ${SHARED_DEFS}
        ${BG}

        <!-- formula -->
        <g transform="translate(30,28)">
          <rect x="0" y="0" width="540" height="40" rx="4"
                fill="rgba(0,0,0,.6)" stroke="#FFB85C" stroke-opacity=".5" stroke-dasharray="3,2"/>
          <text x="14" y="16" fill="#FFB85C"
                font-family="JetBrains Mono, monospace" font-size="10" font-weight="800" letter-spacing="2">⊕ HALVING RULE</text>
          <text x="14" y="32" fill="#F5E5E8"
                font-family="JetBrains Mono, monospace" font-size="12" font-weight="700">at every 210,000th block, per-block reward divides by 2 · forever</text>
        </g>

        <!-- timeline axis -->
        <line x1="50" y1="220" x2="560" y2="220" stroke="#FF1E3C" stroke-opacity=".3" stroke-width="1.5"/>

        ${[
          { x: 70,  date: '2021', block: '0',         reward: '1.0 τ', past: true },
          { x: 198, date: '2025', block: '210,000',   reward: '0.5 τ', past: true, current: true },
          { x: 326, date: '2029', block: '420,000',   reward: '0.25 τ', past: false },
          { x: 454, date: '2033', block: '630,000',   reward: '0.125 τ', past: false },
          { x: 550, date: '2037+', block: '...',      reward: '...',    past: false },
        ].map((h, i) => `
          <g transform="translate(${h.x},220)">
            <!-- vertical event marker -->
            <line x1="0" y1="-${[100, 80, 60, 40, 20][i]}" x2="0" y2="0"
                  stroke="${h.current ? '#FFB85C' : '#FF1E3C'}" stroke-width="${h.current ? 2 : 1}" stroke-opacity="${h.past ? .9 : .35}"/>
            <!-- dot -->
            <circle cx="0" cy="0" r="${h.current ? 7 : 5}"
                    fill="${h.past ? '#FF1E3C' : 'rgba(255,30,60,.15)'}"
                    stroke="${h.current ? '#FFB85C' : '#FF1E3C'}" stroke-width="${h.current ? 2 : 1}"
                    ${h.current ? 'class="codex-info__strobe"' : ''}/>
            <!-- date -->
            <text x="0" y="20" text-anchor="middle" fill="${h.current ? '#FFB85C' : '#C8A8AD'}"
                  font-family="JetBrains Mono, monospace" font-size="9" font-weight="800">${h.date}</text>
            <text x="0" y="34" text-anchor="middle" fill="#8B6B70"
                  font-family="JetBrains Mono, monospace" font-size="7">block ${h.block}</text>
            <!-- reward box on top -->
            <g transform="translate(-32,-${[112, 92, 72, 52, 32][i]})">
              <rect x="0" y="0" width="64" height="22" rx="3"
                    fill="${h.current ? 'rgba(255,184,92,.2)' : 'rgba(255,30,60,.10)'}"
                    stroke="${h.current ? '#FFB85C' : '#FF1E3C'}" stroke-width="1"/>
              <text x="32" y="15" text-anchor="middle" fill="${h.current ? '#FFB85C' : '#F5E5E8'}"
                    font-family="JetBrains Mono, monospace" font-size="10" font-weight="800">${h.reward}</text>
            </g>
            ${h.current ? `<text x="0" y="48" text-anchor="middle" fill="#FFB85C" class="codex-info__strobe" font-family="JetBrains Mono, monospace" font-size="8" font-weight="800" letter-spacing="2">NOW</text>` : ''}
          </g>
        `).join('')}

        <!-- cumulative supply curve below the timeline -->
        <g transform="translate(0,250)">
          <text x="50" y="6" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="8" letter-spacing="2">CUMULATIVE SUPPLY</text>
          <path d="M 50 50 Q 200 30 350 20 T 560 12"
                fill="none" stroke="#FFB85C" stroke-width="2" stroke-dasharray="5,3" opacity=".75"/>
          <text x="555" y="8" text-anchor="end" fill="#FFB85C"
                font-family="JetBrains Mono, monospace" font-size="9" font-weight="800">→ 21M cap</text>
          <text x="50" y="60" fill="#F5E5E8"
                font-family="JetBrains Mono, monospace" font-size="9">today: ~8.4M minted (40% of cap)</text>
        </g>
      </svg>
    </figure>
  `,

  /* ============================================================
     WEIGHT · the aggregation in matrix form. 4 validators × 5
     miners. Cell intensity is the weight; the bottom row is the
     stake-weighted median per miner column.
     ============================================================ */
  'weight': () => `
    <figure class="codex-info codex-info--weight" aria-label="Validator weight matrix">
      <figcaption class="codex-info__cap">
        The weight matrix · each validator (row) is a vote on every miner (column). The chain takes a stake-weighted median down each column. The bottom row is the consensus weight that drives emission.
      </figcaption>
      <svg viewBox="0 0 600 340" class="codex-info__svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        ${SHARED_DEFS}
        ${BG}

        <text x="300" y="22" text-anchor="middle" fill="#FF1E3C"
              font-family="JetBrains Mono, monospace" font-size="10" font-weight="800" letter-spacing="2">
          4 VALIDATORS × 5 MINERS · STAKE-WEIGHTED MEDIAN
        </text>

        ${(() => {
          const validators = [
            { name: 'V1', stake: 28, weights: [0.85, 0.30, 0.55, 0.42, 0.65] },
            { name: 'V2', stake: 33, weights: [0.80, 0.40, 0.60, 0.38, 0.70] },
            { name: 'V3', stake: 12, weights: [0.25, 0.90, 0.50, 0.50, 0.30] },
            { name: 'V4', stake: 18, weights: [0.78, 0.35, 0.58, 0.45, 0.68] },
          ];
          const consensus = [0.81, 0.36, 0.57, 0.42, 0.68];

          /* column headers */
          let svg = '';
          [1, 2, 3, 4, 5].forEach(j => {
            svg += `<text x="${156 + (j - 1) * 78}" y="60" text-anchor="middle" fill="#FF4D60"
                          font-family="JetBrains Mono, monospace" font-size="11" font-weight="800">M${j}</text>`;
          });

          /* validator rows */
          validators.forEach((v, i) => {
            const y = 80 + i * 40;
            /* row label + stake */
            svg += `<text x="40" y="${y + 18}" fill="#F5E5E8"
                          font-family="JetBrains Mono, monospace" font-size="11" font-weight="800">${v.name}</text>`;
            svg += `<text x="40" y="${y + 30}" fill="#FF4D60"
                          font-family="JetBrains Mono, monospace" font-size="8" font-weight="700">${v.stake}K τ</text>`;
            /* cells */
            v.weights.forEach((w, j) => {
              const cx = 120 + j * 78;
              svg += `<rect x="${cx}" y="${y}" width="72" height="32" rx="3"
                            fill="#FF1E3C" fill-opacity="${w * .8 + .15}"
                            stroke="#FF1E3C" stroke-opacity=".3"/>`;
              svg += `<text x="${cx + 36}" y="${y + 21}" text-anchor="middle" fill="#fff"
                            font-family="JetBrains Mono, monospace" font-size="11" font-weight="800">${w.toFixed(2)}</text>`;
            });
          });

          /* aggregation arrow */
          svg += `<line x1="120" y1="252" x2="588" y2="252" stroke="#FFB85C" stroke-opacity=".5" stroke-dasharray="3,3"/>`;
          svg += `<text x="60" y="256" fill="#FFB85C" font-family="JetBrains Mono, monospace" font-size="9" font-weight="800" letter-spacing="1.5">↓ MEDIAN</text>`;

          /* consensus row */
          svg += `<text x="40" y="282" fill="#FFB85C"
                        font-family="JetBrains Mono, monospace" font-size="11" font-weight="800">CONS</text>`;
          consensus.forEach((w, j) => {
            const cx = 120 + j * 78;
            svg += `<rect x="${cx}" y="265" width="72" height="32" rx="3"
                          fill="#FFB85C" fill-opacity="${w * .7 + .25}" filter="url(#oxSoftGlow)"
                          stroke="#FFB85C" stroke-width="1.2"/>`;
            svg += `<text x="${cx + 36}" y="${287}" text-anchor="middle" fill="#1F0A10"
                          font-family="JetBrains Mono, monospace" font-size="12" font-weight="800">${w.toFixed(2)}</text>`;
          });

          return svg;
        })()}

        <!-- takeaway -->
        <text x="30" y="324" fill="#FF1E3C"
              font-family="JetBrains Mono, monospace" font-size="9" font-weight="800">⊕</text>
        <text x="48" y="324" fill="#F5E5E8"
              font-family="JetBrains Mono, monospace" font-size="10">
          V3 picked M2=.90, three others ≈ .35 → median = .36. V3's vote rejected; reward discounted.
        </text>
      </svg>
    </figure>
  `,

  /* ============================================================
     MINER · the economic break-even. Register cost vs. expected
     reward per epoch. Shows the actual math that decides whether
     it's worth running a miner.
     ============================================================ */
  'miner': () => `
    <figure class="codex-info codex-info--miner" aria-label="Miner economics break-even">
      <figcaption class="codex-info__cap">
        The miner's economic decision · pay a registration burn now in exchange for expected emission over the epoch. Survive the prune (bottom 30%) or burn the registration cost.
      </figcaption>
      <svg viewBox="0 0 600 340" class="codex-info__svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        ${SHARED_DEFS}
        ${BG}

        <!-- STEP 1: register -->
        ${stepBadge(1, 'REGISTER (pay τ burn)', 30, 36)}
        <g transform="translate(30,60)">
          <rect x="0" y="0" width="260" height="48" rx="4"
                fill="rgba(255,30,60,.10)" stroke="#FF1E3C" stroke-width="1.4"/>
          <text x="14" y="18" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="8" letter-spacing="1.5">COST</text>
          <text x="250" y="18" text-anchor="end" fill="#FF4D60" font-family="JetBrains Mono, monospace" font-size="13" font-weight="800">0.42 τ</text>
          <text x="14" y="36" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="8" letter-spacing="1.5">RECOVERY</text>
          <text x="250" y="36" text-anchor="end" fill="#FF7755" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">burned · gone forever</text>
        </g>

        <!-- STEP 2: serve and get scored -->
        ${stepBadge(2, 'SERVE THE EPOCH (360 blocks)', 320, 36)}
        <g transform="translate(320,60)">
          <rect x="0" y="0" width="252" height="48" rx="4"
                fill="rgba(255,30,60,.06)" stroke="#FF4D60" stroke-width="1.4"/>
          <text x="14" y="18" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="8" letter-spacing="1.5">QUERIES SERVED</text>
          <text x="240" y="18" text-anchor="end" fill="#F5E5E8" font-family="JetBrains Mono, monospace" font-size="13" font-weight="800">~360</text>
          <text x="14" y="36" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="8" letter-spacing="1.5">SCORE (typical)</text>
          <text x="240" y="36" text-anchor="end" fill="#FFB85C" font-family="JetBrains Mono, monospace" font-size="13" font-weight="800">0.55 / 1.0</text>
        </g>

        <!-- STEP 3: fork in the road -->
        ${stepBadge(3, 'EPOCH ENDS · TWO PATHS', 30, 132)}
        <g transform="translate(30,160)">
          <!-- SURVIVE -->
          <rect x="0" y="0" width="260" height="100" rx="4"
                fill="rgba(0,229,168,.10)" stroke="#00E5A8" stroke-width="1.6"/>
          <text x="14" y="20" fill="#00E5A8" font-family="JetBrains Mono, monospace" font-size="10" font-weight="800" letter-spacing="2">✓ SURVIVE (above bottom-30%)</text>
          <text x="14" y="42" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="8" letter-spacing="1.5">EMISSION EARNED</text>
          <text x="240" y="42" text-anchor="end" fill="#00E5A8" font-family="JetBrains Mono, monospace" font-size="13" font-weight="800">≈ 1.8 τ</text>
          <text x="14" y="60" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="8" letter-spacing="1.5">– REG COST</text>
          <text x="240" y="60" text-anchor="end" fill="#FF4D60" font-family="JetBrains Mono, monospace" font-size="13" font-weight="800">– 0.42 τ</text>
          <line x1="14" y1="68" x2="246" y2="68" stroke="#00E5A8" stroke-opacity=".3"/>
          <text x="14" y="86" fill="#00E5A8" font-family="JetBrains Mono, monospace" font-size="10" font-weight="800" letter-spacing="2">NET PROFIT</text>
          <text x="240" y="86" text-anchor="end" fill="#00E5A8" font-family="JetBrains Mono, monospace" font-size="14" font-weight="800">≈ +1.38 τ</text>
        </g>
        <g transform="translate(320,160)">
          <!-- PRUNED -->
          <rect x="0" y="0" width="252" height="100" rx="4"
                fill="rgba(255,30,60,.10)" stroke="#FF1E3C" stroke-width="1.6"/>
          <text x="14" y="20" fill="#FF4D60" font-family="JetBrains Mono, monospace" font-size="10" font-weight="800" letter-spacing="2">✕ PRUNED (bottom 30%)</text>
          <text x="14" y="42" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="8" letter-spacing="1.5">EMISSION EARNED</text>
          <text x="234" y="42" text-anchor="end" fill="#C8A8AD" font-family="JetBrains Mono, monospace" font-size="13" font-weight="800">≈ 0 τ</text>
          <text x="14" y="60" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="8" letter-spacing="1.5">REG COST</text>
          <text x="234" y="60" text-anchor="end" fill="#FF4D60" font-family="JetBrains Mono, monospace" font-size="13" font-weight="800">burned</text>
          <line x1="14" y1="68" x2="240" y2="68" stroke="#FF4D60" stroke-opacity=".3"/>
          <text x="14" y="86" fill="#FF4D60" font-family="JetBrains Mono, monospace" font-size="10" font-weight="800" letter-spacing="2">NET LOSS</text>
          <text x="234" y="86" text-anchor="end" fill="#FF4D60" font-family="JetBrains Mono, monospace" font-size="14" font-weight="800">– 0.42 τ</text>
        </g>

        <!-- takeaway -->
        <g transform="translate(30,288)">
          <text x="0" y="14" fill="#FF1E3C"
                font-family="JetBrains Mono, monospace" font-size="9" font-weight="800">⊕</text>
          <text x="18" y="14" fill="#F5E5E8"
                font-family="JetBrains Mono, monospace" font-size="10">
            BREAK-EVEN MODEL · the registration burn prices in incompetent operators
          </text>
          <text x="0" y="32" fill="#C8A8AD"
                font-family="JetBrains Mono, monospace" font-size="9">
            survive rate ≈ 70% in mature subnets · expected value = 0.7 × 1.38 + 0.3 × (–0.42) = +0.84 τ per epoch
          </text>
        </g>
      </svg>
    </figure>
  `,

  /* ============================================================
     VALIDATOR · per-epoch economics. Stake, queries sent,
     consensus alignment, emission earned. The "discount for
     dissent" is what makes validators converge.
     ============================================================ */
  'validator': () => `
    <figure class="codex-info codex-info--val" aria-label="Validator economics per epoch">
      <figcaption class="codex-info__cap">
        The validator's job per epoch · stake τ, send queries, score responses, submit weights. Reward scales with stake AND with how well your weights align with consensus.
      </figcaption>
      <svg viewBox="0 0 600 340" class="codex-info__svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        ${SHARED_DEFS}
        ${BG}

        <!-- the validator profile -->
        <g transform="translate(30,32)">
          <rect x="0" y="0" width="540" height="60" rx="4"
                fill="rgba(255,30,60,.10)" stroke="#FF1E3C" stroke-width="1.6"/>
          <text x="14" y="20" fill="#FF1E3C"
                font-family="JetBrains Mono, monospace" font-size="10" font-weight="800" letter-spacing="2">VALIDATOR · 5HG…wf2K</text>
          <text x="14" y="42" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="8">STAKE</text>
          <text x="14" y="54" fill="#F5E5E8" font-family="JetBrains Mono, monospace" font-size="12" font-weight="800">28K τ</text>
          <text x="150" y="42" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="8">SUBNET</text>
          <text x="150" y="54" fill="#F5E5E8" font-family="JetBrains Mono, monospace" font-size="12" font-weight="800">SN1 TEXT</text>
          <text x="300" y="42" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="8">CONSENSUS ALIGN</text>
          <text x="300" y="54" fill="#00E5A8" font-family="JetBrains Mono, monospace" font-size="12" font-weight="800">0.94 / 1.0</text>
          <text x="460" y="42" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="8">EPOCH</text>
          <text x="460" y="54" fill="#F5E5E8" class="codex-info__strobe" font-family="JetBrains Mono, monospace" font-size="12" font-weight="800">22,750</text>
        </g>

        <!-- per-epoch workload -->
        ${stepBadge(1, 'PER EPOCH WORKLOAD', 30, 116)}
        <g transform="translate(30,144)">
          <rect x="0" y="0" width="540" height="50" rx="4"
                fill="rgba(0,0,0,.4)" stroke="#FF4D60" stroke-opacity=".5"/>
          <text x="14" y="20" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="8">QUERIES SENT</text>
          <text x="14" y="36" fill="#F5E5E8" font-family="JetBrains Mono, monospace" font-size="13" font-weight="800">~360</text>
          <text x="150" y="20" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="8">MINERS SCORED</text>
          <text x="150" y="36" fill="#F5E5E8" font-family="JetBrains Mono, monospace" font-size="13" font-weight="800">all of them (~120)</text>
          <text x="340" y="20" fill="#8B6B70" font-family="JetBrains Mono, monospace" font-size="8">WEIGHTS SUBMITTED</text>
          <text x="340" y="36" fill="#F5E5E8" font-family="JetBrains Mono, monospace" font-size="13" font-weight="800">1 vector / epoch</text>
        </g>

        <!-- reward formula -->
        ${stepBadge(2, 'REWARD FORMULA', 30, 216)}
        <g transform="translate(30,244)">
          <rect x="0" y="0" width="540" height="42" rx="4"
                fill="rgba(0,0,0,.6)" stroke="#FFB85C" stroke-opacity=".55" stroke-dasharray="3,2"/>
          <text x="14" y="18" fill="#FFB85C"
                font-family="JetBrains Mono, monospace" font-size="13" font-weight="700">reward = stake × consensus_align × subnet_validator_pool</text>
          <text x="14" y="34" fill="#C8A8AD"
                font-family="JetBrains Mono, monospace" font-size="9">
            = 28K × 0.94 × (1,771 τ/d ÷ 5.6M τ total stake) → ≈ 8.3 τ / day · 22 days to break even on a 180τ ann. cost
          </text>
        </g>

        <!-- takeaway -->
        <g transform="translate(30,300)">
          <text x="0" y="14" fill="#FF1E3C"
                font-family="JetBrains Mono, monospace" font-size="9" font-weight="800">⊕</text>
          <text x="18" y="14" fill="#F5E5E8"
                font-family="JetBrains Mono, monospace" font-size="10">
            Dissent costs you · weights far from consensus get discounted by the chain (the same Yuma median that pays miners)
          </text>
          <text x="0" y="32" fill="#C8A8AD"
                font-family="JetBrains Mono, monospace" font-size="9">
            this is why validators converge over time even without explicit coordination · the incentive does the work
          </text>
        </g>
      </svg>
    </figure>
  `,
};
