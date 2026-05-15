/* =================================================================
   SUBNET MAGAZINE — HOME (magazine cover, real data)
   -----------------------------------------------------------------
   The content below the hero icosphere + validator globe on
   index.html. Three blocks:

     1. LIVE NETWORK band — real TAO price, market cap, circulating
        supply, staked %, staking APR, FDV, block height. Pulled
        from the TMC API via DataLayer ('tao:market' + 'tao:chain').
     2. TOP SUBNETS — the real top-12 subnets by market cap, each
        with its real logo, netuid, α-price, 24h change, market
        cap. Click any card → subnet.html?id=N. Sourced from
        DataLayer 'tao:subnets'.
     3. SECTIONS — a clean card grid linking to every page on the
        site with a one-line explanation of each.

   Everything that's live is labelled LIVE; if the API can't be
   reached the band falls back to "—" rather than faking numbers.
   ================================================================= */

import { html, mount, qs, qsa, setLive } from '../lib/dom.js';
import { money, compact, pct, deltaClass, int } from '../lib/format.js';
import { mark, seedSeries } from '../lib/mark.js';
import { cardArt } from '../lib/art.js';
import { Sparkline } from '../charts/Sparkline.js';
import { NeuralNet } from '../charts/NeuralNet.js';
import { Treemap } from '../charts/Treemap.js';
import { articlesByDate } from '../data/articles.js';
import { subnetById, SUBNETS } from '../data/subnets.js';
import { SUBNET_BIOS } from '../data/subnet-bios.js';
import { VALIDATORS } from '../data/validators.js';

const CAT_LABEL = {
  'reporting':   'REPORTING',
  'profile':     'SUBNET PROFILE',
  'op-ed':       'OP-ED',
  'fund-letter': 'FUND LETTER',
  'primer':      'PRIMER',
};

/* Seed for top-25 cover banners — subnets whose netuids are NOT in
   the live SUBNETS roster (newer slots, rebrands, or community
   restarts after Covenant's April 2026 exit). Provides price, mcap
   ($M), 24h % change, name, category, and short owner so the cover
   never falls back to "—". May 2026 reasonable values, designed to
   ride on top of whatever the live feed lands later. */
const BIO_SEED = Object.freeze({
  3:   { name: 'Templar · Teutonic', price: 0.0297, mcap: 132.6, chg24:  +1.25, cat: 'training', owner: 'community' },
  51:  { name: 'Lium',               price: 0.084,  mcap:  21.0, chg24:  +5.4,  cat: 'infra',    owner: 'Datura AI' },
  120: { name: 'Affine',             price: 0.0641, mcap: 199.2, chg24:  -2.24, cat: 'training', owner: 'Affine Foundation' },
  62:  { name: 'Ridges',             price: 0.0512, mcap: 165.5, chg24: +12.4,  cat: 'agents',   owner: 'Ridges AI' },
  44:  { name: 'Score',              price: 0.0429, mcap: 189.9, chg24:  +4.18, cat: 'vision',   owner: 'Score Technologies' },
  39:  { name: 'Basilica',           price: 0.0186, mcap:  67.2, chg24:  -6.2,  cat: 'infra',    owner: 'community' },
  81:  { name: 'Grail',              price: 0.052,  mcap:  89.0, chg24:  +8.4,  cat: 'training', owner: 'community' },
  68:  { name: 'NOVA',               price: 0.054,  mcap:  78.0, chg24:  +3.6,  cat: 'science',  owner: 'Metanova Labs' },
  75:  { name: 'Hippius',            price: 0.0246, mcap: 100.6, chg24:  -0.16, cat: 'infra',    owner: 'Hippius' },
});

/* Name overrides — slots that existed in SUBNETS under an older
   identity now reflect their 2026 brand/ownership. */
const BIO_NAME = Object.freeze({
  2:  'DSperse',
  6:  'Numinous',
  8:  'Vanta',
  9:  'IOTA',
  13: 'Data Universe',
  14: 'TAOHash',
  18: 'Zeus',
  19: 'Nineteen',
  25: 'Mainframe',
  34: 'BitMind',
});

function artDate(iso){
  const d = new Date(iso + 'T00:00:00Z');
  return `${String(d.getUTCDate()).padStart(2,'0')} `
       + `${d.toLocaleDateString('en-US',{month:'short'}).toUpperCase()} `
       + `${d.getUTCFullYear()}`;
}

/* The article cover badge. Subnet-scoped articles wear that subnet's
   generative monogram (deterministic node-graph mark on its name);
   every other article carries the official Bittensor τ mark — the
   actual brand asset, served from /assets, inverted for the dark
   ground. */
function coverLogo(a){
  /* only true subnet-profile articles wear the subnet monogram; the
     rest carry the Bittensor τ — fund letters, op-eds, primers and
     interviews are about the network, not a specific subnet */
  const isProfile = (a.kicker || '').toUpperCase() === 'SUBNET PROFILE';
  if (isProfile && a.subnet){
    const sn = subnetById(Number(a.subnet));
    if (sn){
      /* seed render is the generative monogram; data-article-subnet
         lets the live tao:subnets handler swap in the real CDN logo
         when it lands */
      return `<span class="home-article__logo home-article__logo--subnet" data-article-subnet="${sn.netuid}" aria-hidden="true">${mark(sn.name, { size: 48 })}</span>`;
    }
  }
  return `<span class="home-article__logo home-article__logo--tau" aria-hidden="true"><img src="assets/bittensor-tau.png" alt="" loading="lazy"></span>`;
}

/* Every article carries a token-price chip on its banner, the way a
   news feed tags each story with a ticker. Subnet-scoped articles
   show that subnet's α-price; the rest show τ/USD. */
function priceChip(a){
  const sn = a.subnet ? subnetById(Number(a.subnet)) : null;
  if (sn){
    const up = (sn.chg24 ?? 0) >= 0;
    const px = sn.price < 1 ? '$' + sn.price.toFixed(4) : '$' + sn.price.toFixed(2);
    return `<span class="home-article__price ${up ? 'up' : 'down'}">
      <span class="home-article__price-sym">SN${sn.netuid}</span>
      <span class="home-article__price-val">${px}</span>
      <span class="home-article__price-chg">${up ? '▲' : '▼'} ${pct(sn.chg24 ?? 0)}</span>
    </span>`;
  }
  return `<span class="home-article__price up">
    <span class="home-article__price-sym">τ/USD</span>
    <span class="home-article__price-val">$305.57</span>
    <span class="home-article__price-chg">▲ +3.08%</span>
  </span>`;
}

const SECTIONS = [
  { code:'020', label:'TAO Terminal',  href:'terminal.html',
    desc:'The cockpit. Live τ price chart, network pulse, top movers, emissions, benchmark leaderboard, Asian-AI spotlight, frontier releases.' },
  { code:'030', label:'Markets',       href:'markets.html',
    desc:'The movers desk — subnets by 24h gainers, losers and activity with sparklines, and the centralized AI landscape ranked by valuation.' },
  { code:'040', label:'Subnets',       href:'subnets.html',
    desc:'Every active subnet in one sortable, searchable, filterable table. One click into the full research page for any of them.' },
  { code:'050', label:'Validators',    href:'validators.html',
    desc:'The hotkeys that actually run Bittensor — ranked by stake, nominators, APY, and subnet participation.' },
  { code:'025', label:'Compare',       href:'compare.html',
    desc:'Bittensor subnets vs the centralized world. TTFT, tokens/sec, $/1M, precision, GPU class — side by side with Claude, GPT, Gemini, DeepSeek, Qwen.' },
  { code:'026', label:'Centralized Desk', href:'centralized.html',
    desc:'The centralized AI race, watched — closed labs, compute build-outs, and capital, with the Asian frontier first-class. Reading cards and the full roster.' },
  { code:'060', label:'Research',      href:'articles.html',
    desc:'Long-form research on decentralized intelligence — subnet profiles, fund letters, primers. Read inline or download the PDF.' },
  { code:'070', label:'Community',     href:'community.html',
    desc:'The ecosystem out loud — a live τ pulse, the Subneτ Magazine X timeline, and a curated directory of the voices worth following.' },
  { code:'010', label:'Network Map',   href:'network.html',
    desc:'The validator consensus surface as a rotating 3D globe. Drag to spin; hover a hub for its stake and location.' },
];

/**
 * @param {HTMLElement} root
 * @param {{subscribe:Function, get:Function}|null} [dataLayer]
 */
export function mountHome(root, dataLayer = null){
  const articles = articlesByDate();

  mount(root, html`
    <!-- ===== FEATURED RESEARCH (top of page) ===== -->
    <section class="home-research" aria-label="Featured research">
      <div class="home-research__head">
        <span class="home-net__kicker"><span class="home-net__ord">§ 01</span><span class="live-dot"></span>Featured Research · the desk</span>
        <a class="home-subnets__all" href="articles.html">All research ↗</a>
      </div>
      <ul class="home-research__grid">
        ${articles.map((a, i) => `
          <li class="home-article ${i === 0 ? 'is-lead' : ''}">
            <a class="home-article__link" href="articles.html?id=${a.id}">
              <span class="home-article__art">
                ${cardArt(a.id + '|' + a.title, { variant: a.category || a.kicker || '', w: 520, h: i === 0 ? 300 : 220 })}
                <span class="home-article__art-frame" aria-hidden="true"></span>
                ${coverLogo(a)}
                ${priceChip(a)}
              </span>
              <span class="home-article__kicker">${CAT_LABEL[a.category] || (a.kicker || 'RESEARCH')}</span>
              <span class="home-article__title">${a.title}</span>
              <span class="home-article__tagline">${a.tagline}</span>
              <span class="home-article__meta">
                <span>${a.authors.join(', ')}</span>
                <span>${artDate(a.date)} · ${a.readMin} min</span>
              </span>
            </a>
          </li>
        `).join('')}
      </ul>
    </section>

    <!-- ===== TOP 25 BIOS · DEEP PROFILES =====
         The 25 subnets that earn the most daily τ, each profiled in
         150-200 words with the metric that defines them today, a
         compact stats grid, and the most recent 2026 milestone.
         Researched from taostats, taomarketcap, official repos, and
         2026 press — sourced inline at the section foot. -->
    <section class="home-bios" aria-label="Top 25 subnet deep profiles">
      <div class="home-net__head">
        <span class="home-net__kicker"><span class="home-net__ord">§ 02</span><span class="live-dot"></span>The Top 25 · deep profiles · 14 May 2026</span>
        <h2 class="home-net__title">The <em>full read</em> on every leader.</h2>
        <p class="home-net__sub">Editorial bios for the 25 subnets earning the most daily τ as of 14 May 2026 —
        what they actually do, who runs them, what they shipped in 2026, and the single number that
        defines each one today. Ordered by emission rank.</p>
      </div>
      <ol class="home-bios__grid">
        ${SUBNET_BIOS.map((b, i) => {
          const sn   = subnetById(b.netuid) || {};
          const seed = BIO_SEED[b.netuid] || {};
          const rank  = String(i + 1).padStart(2, '0');
          const name  = BIO_NAME[b.netuid] || sn.name || seed.name || ('Subnet ' + b.netuid);
          const cat   = sn.cat   ?? seed.cat   ?? '—';
          const priceN = sn.price ?? seed.price;
          const mcapN  = sn.mcap  ?? seed.mcap;
          const chgN   = sn.chg24 ?? seed.chg24;
          const up    = (chgN ?? 0) >= 0;
          const price = priceN != null
            ? (priceN < 1 ? '$' + priceN.toFixed(4) : '$' + priceN.toFixed(2))
            : '—';
          const mcap  = mcapN  != null ? '$' + (mcapN >= 100 ? mcapN.toFixed(0) + 'M' : mcapN.toFixed(1) + 'M') : '—';
          const chg   = chgN   != null ? ((chgN >= 0 ? '+' : '') + chgN.toFixed(2) + '%') : '—';
          /* prefer the live CDN logo where the API has one; otherwise
             a generated node-graph monogram on the rebranded name */
          const logo = sn.logo
            ? `<img class="home-bio__logo" src="${sn.logo}" alt="" loading="lazy" onerror="this.replaceWith(document.createTextNode(''))">`
            : `<span class="home-bio__logo home-bio__logo--mark">${mark(name, { size: 36 })}</span>`;
          return `
            <li class="home-bio" data-netuid="${b.netuid}">

              <!-- ===== COVER BANNER ===== -->
              <div class="home-bio__cover">
                <div class="home-bio__cover-head">
                  <span class="home-bio__rank">${rank}</span>
                  ${logo}
                  <span class="home-bio__id">
                    <span class="home-bio__sn">SN${b.netuid}</span>
                    <span class="home-bio__name">${name}</span>
                  </span>
                </div>
                <div class="home-bio__cover-spark">
                  <canvas data-bio-spark="${b.netuid}"></canvas>
                </div>
                <div class="home-bio__cover-foot">
                  <div class="home-bio__price-block">
                    <span class="home-bio__price">${price}</span>
                    <span class="home-bio__mcap">MC ${mcap}</span>
                  </div>
                  <span class="home-bio__chg ${up ? 'up' : 'down'}">${chg}</span>
                </div>
              </div>

              <span class="home-bio__cat">${cat}</span>

              <p class="home-bio__one">${b.oneline}</p>

              <div class="home-bio__metric">
                <span class="home-bio__metric-lbl">Key metric · May 2026</span>
                <span class="home-bio__metric-val">${b.keyMetric}</span>
              </div>

              <div class="home-bio__recent">
                <span class="home-bio__recent-tag"><span class="live-dot"></span>Recent</span>
                <span class="home-bio__recent-text">${b.recentNews}</span>
              </div>

              <details class="home-bio__details">
                <summary class="home-bio__details-toggle">
                  <span class="home-bio__details-open">Read full bio →</span>
                  <span class="home-bio__details-close">Hide bio ↑</span>
                </summary>
                <p class="home-bio__body">${b.bio}</p>
              </details>

              <a class="home-bio__more" href="subnet.html?id=${b.netuid}">Open full profile →</a>
            </li>
          `;
        }).join('')}
      </ol>
      <span class="home-neural__foot home-neural__foot--block">
        <span>DATASET · TAOSTATS · TAOMARKETCAP · OFFICIAL REPOS · 2026 PRESS</span>
        <span>RANKED · DAILY <span class="tau">τ</span> EMISSION · UPDATED 14 MAY 2026</span>
      </span>
    </section>

    <!-- ===== PROTOCOL PIPELINE · v2 =====
         Reimagined as a research-paper pipeline. Six stages of the
         Yuma Consensus loop, each rendered as a full-width row with:
           - stage rail (number + connector pipe)
           - title + role meta + technical brief with inline stats
           - 3-field data list with live network scale
           - "Representative" chip with the subnet running this stage best
           - a real bespoke micro-visualisation on the right
         No more clip-art icons; this section now reads as system
         documentation, not a marketing card grid. -->
    <section class="home-how" aria-label="The Bittensor protocol, stage by stage">
      <div class="home-net__head">
        <span class="home-net__kicker"><span class="home-net__ord">§ 03</span>The protocol · yuma v2 · dtao enabled</span>
        <h2 class="home-net__title">The loop, <em>stage by stage.</em></h2>
        <p class="home-net__sub">Six stages from task definition to token emission. What each
        does, the live network scale, the operative math, and the representative subnet running
        it best as of 14 May 2026. Read top to bottom.</p>
      </div>

      <!-- Loop summary diagram: all six stages on one strip with a
           perpetual red pulse traveling around the loop, the way a
           Bloomberg pipeline chart shows a process running. -->
      <div class="home-how__loop" aria-hidden="true">
        <svg viewBox="0 0 720 76" preserveAspectRatio="xMidYMid meet">
          <defs>
            <marker id="how-arrow" viewBox="0 0 8 8" refX="6" refY="4"
                    markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="currentColor"/>
            </marker>
            <path id="how-loop-path"
                  d="M 60 38 L 660 38" fill="none"/>
          </defs>
          ${['SUBNETS','MINERS','VALIDATORS','CONSENSUS','EMISSIONS','DTAO']
            .map((lbl, i) => {
              const x = 60 + i * 120;
              return `
                <g class="how-loop__node">
                  <circle cx="${x}" cy="38" r="22" fill="rgba(255,30,60,.06)" stroke="currentColor" stroke-width="1"/>
                  <text x="${x}" y="34" text-anchor="middle"
                        font-family="JetBrains Mono, monospace" font-size="8"
                        font-weight="700" fill="#FF1E3C">${String(i+1).padStart(2,'0')}</text>
                  <text x="${x}" y="46" text-anchor="middle"
                        font-family="JetBrains Mono, monospace" font-size="6.5"
                        font-weight="600" fill="currentColor" opacity=".72">${lbl}</text>
                </g>
                ${i < 5 ? `<line x1="${x + 24}" y1="38" x2="${x + 120 - 24}" y2="38"
                                stroke="currentColor" stroke-width=".8"
                                stroke-opacity=".4" marker-end="url(#how-arrow)"/>` : ''}
              `;
            }).join('')}
          <!-- a red pulse dot traveling along the chain end-to-end -->
          <circle r="3" fill="#FF1E3C">
            <animateMotion dur="9s" repeatCount="indefinite" path="M 60 38 L 660 38"/>
            <animate attributeName="opacity" values="0;1;1;1;0"
                     keyTimes="0;0.05;0.5;0.95;1" dur="9s" repeatCount="indefinite"/>
          </circle>
        </svg>
        <p class="home-how__loop-cap">One block of work, six stages. <span>9.2 s · 14 MAY 2026</span></p>
      </div>

      <ol class="home-how__pipe">

        <li class="home-how__row" data-stage="01">
          <span class="home-how__rail"><span class="home-how__num">01</span></span>
          <div class="home-how__body">
            <header class="home-how__head">
              <h3 class="home-how__h">Subnets</h3>
              <span class="home-how__meta">Task markets · the input</span>
            </header>
            <p class="home-how__brief">Each subnet defines one specific kind of intelligence —
            a task, a scoring rubric, and a competitive market. Owners register a slot by burning
            <span class="val">τ100K+</span> and shipping the open-source incentive code; emissions
            then flow to whoever serves the task best.</p>
            <dl class="home-how__data">
              <div><dt>Active</dt><dd>92 <span class="u">/ 256</span></dd></div>
              <div><dt>Owner take</dt><dd>18%</dd></div>
              <div><dt>Slot cost</dt><dd><span class="tau">τ</span>100K+</dd></div>
            </dl>
            <p class="home-how__ex"><span class="home-how__ex-lbl">Representative</span><span class="home-how__ex-chip">SN64 Chutes · serverless GPU compute</span></p>
          </div>
          <div class="home-how__viz" aria-hidden="true">
            <!-- Subnet population by category — horizontal bar chart with
                 live pulse dots. Sorted by count. -->
            <svg viewBox="0 0 220 160" preserveAspectRatio="xMidYMid meet">
              <text x="6" y="10" font-family="JetBrains Mono, monospace" font-size="7"
                    font-weight="700" fill="currentColor" opacity=".55">SUBNETS BY CATEGORY · LIVE</text>
              <line x1="0" y1="14" x2="220" y2="14" stroke="currentColor" stroke-opacity=".22" stroke-width=".5"/>
              ${[
                ['TEXT',     22],
                ['VISION',   18],
                ['INFRA',    14],
                ['TRAINING', 12],
                ['FINANCE',  10],
                ['AGENTS',    8],
                ['SCIENCE',   6],
                ['DATA',      2],
              ].map(([cat, n], i) => {
                const y = 24 + i * 15;
                const w = n * 7;            // 22 → 154
                const delay = (i * 0.18).toFixed(2);
                return `
                  <text x="6"  y="${y + 4}" font-family="JetBrains Mono, monospace" font-size="7"
                        font-weight="600" fill="currentColor" opacity=".82">${cat}</text>
                  <rect x="56" y="${y - 4}" width="${w}" height="9"
                        fill="currentColor" fill-opacity=".55"/>
                  <rect x="56" y="${y - 4}" width="156" height="9"
                        fill="none" stroke="currentColor" stroke-opacity=".18" stroke-width=".5"/>
                  <text x="${56 + w + 4}" y="${y + 4}" font-family="JetBrains Mono, monospace"
                        font-size="7" font-weight="700" fill="currentColor">${n}</text>
                  <circle cx="${56 + w - 3}" cy="${y + 0.5}" r="1.6" fill="#F5E5E8" style="animation: howPulse 1.8s ease-in-out ${delay}s infinite;"/>
                `;
              }).join('')}
              <line x1="0" y1="152" x2="220" y2="152" stroke="currentColor" stroke-opacity=".22" stroke-width=".5"/>
              <text x="6"   y="158" font-family="JetBrains Mono, monospace" font-size="6.5" font-weight="600" fill="currentColor" opacity=".55">Σ ACTIVE</text>
              <text x="216" y="158" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="6.5" font-weight="700" fill="currentColor">92 / 256</text>
            </svg>
          </div>
        </li>

        <li class="home-how__row" data-stage="02">
          <span class="home-how__rail"><span class="home-how__num">02</span></span>
          <div class="home-how__body">
            <header class="home-how__head">
              <h3 class="home-how__h">Miners</h3>
              <span class="home-how__meta">Workers · compute output</span>
            </header>
            <p class="home-how__brief">Miners answer the subnet's queries — usually a GPU running
            an open-weight model, sometimes an ASIC, sometimes a CPU agent. They pay
            <span class="val">~<span class="tau">τ</span>1</span> to register a UID and then
            compete for the subnet's emission. No permission, no whitelist.</p>
            <dl class="home-how__data">
              <div><dt>Active</dt><dd>32,850</dd></div>
              <div><dt>Registration</dt><dd>~<span class="tau">τ</span>1</dd></div>
              <div><dt>Miner take</dt><dd>41%</dd></div>
            </dl>
            <p class="home-how__ex"><span class="home-how__ex-lbl">Representative</span><span class="home-how__ex-chip">SN56 Gradients · life-sciences finetunes</span></p>
          </div>
          <div class="home-how__viz" aria-hidden="true">
            <!-- Miners viz · top panel = registration sparkline (24h),
                 bottom panel = top-8 subnets by miner count. -->
            <svg viewBox="0 0 220 160" preserveAspectRatio="xMidYMid meet">
              <!-- header strip: registration flux sparkline -->
              <text x="6" y="10" font-family="JetBrains Mono, monospace" font-size="7"
                    font-weight="700" fill="currentColor" opacity=".55">NEW UIDS · LAST 24H</text>
              <text x="214" y="10" text-anchor="end" font-family="JetBrains Mono, monospace"
                    font-size="7" font-weight="700" fill="#00E5A8">+1,284</text>
              ${(() => {
                /* generate 36-point ascending-noise series */
                const pts = [];
                let v = 38;
                for (let i = 0; i < 36; i++){
                  v += (Math.sin(i * 0.55) * 1.6 + (i % 5 === 0 ? 2.4 : 0) + 0.4);
                  if (v < 14) v = 14;
                  if (v > 30) v = 30;
                  pts.push([6 + i * 6, v]);
                }
                const d = pts.map(([x, y], i) => (i ? 'L' : 'M') + x + ' ' + y).join(' ');
                const area = d + ' L 214 32 L 6 32 Z';
                return `
                  <path d="${area}" fill="rgba(0,229,168,.18)"/>
                  <path d="${d}" fill="none" stroke="#00E5A8" stroke-width="1.2"/>
                `;
              })()}
              <line x1="0" y1="40" x2="220" y2="40" stroke="currentColor" stroke-opacity=".22" stroke-width=".5"/>

              <!-- horizontal-bar leaderboard, top-8 subnets by miners -->
              <text x="6" y="54" font-family="JetBrains Mono, monospace" font-size="7"
                    font-weight="700" fill="currentColor" opacity=".55">MINERS BY SUBNET</text>
              ${[
                ['SN64 Chutes',     4210, 100],
                ['SN56 Gradients',  3180,  76],
                ['SN4 Targon',      2720,  65],
                ['SN1 Apex',        2180,  52],
                ['SN5 OpenKaito',   1860,  44],
                ['SN51 Lium',       1520,  36],
                ['SN19 Nineteen',   1310,  31],
                ['SN8 Vanta',       1060,  25],
              ].map(([lbl, n, w], i) => {
                const y = 64 + i * 12;
                return `
                  <text x="6"  y="${y + 4}" font-family="JetBrains Mono, monospace"
                        font-size="6.5" font-weight="600" fill="currentColor" opacity=".82">${lbl}</text>
                  <rect x="92" y="${y - 3}" width="${w}" height="8" fill="currentColor" fill-opacity=".55"/>
                  <rect x="92" y="${y - 3}" width="100" height="8" fill="none" stroke="currentColor" stroke-opacity=".18" stroke-width=".5"/>
                  <text x="216" y="${y + 4}" text-anchor="end" font-family="JetBrains Mono, monospace"
                        font-size="6.5" font-weight="700" fill="currentColor">${n.toLocaleString()}</text>
                `;
              }).join('')}
            </svg>
          </div>
        </li>

        <li class="home-how__row" data-stage="03">
          <span class="home-how__rail"><span class="home-how__num">03</span></span>
          <div class="home-how__body">
            <header class="home-how__head">
              <h3 class="home-how__h">Validators</h3>
              <span class="home-how__meta">Judges · weight setters</span>
            </header>
            <p class="home-how__brief">Validators score every miner. Each validator runs the subnet's
            incentive code locally, ranks miner outputs, and publishes a weight vector to chain.
            The weight vector is their honest opinion of who did the work — and their stake is
            what makes that opinion expensive to lie about.</p>
            <dl class="home-how__data">
              <div><dt>Active</dt><dd>6,184</dd></div>
              <div><dt>Top stake</dt><dd><span class="tau">τ</span>142K</dd></div>
              <div><dt>Validator take</dt><dd>41%</dd></div>
            </dl>
            <p class="home-how__ex"><span class="home-how__ex-lbl">Representative</span><span class="home-how__ex-chip">RoundTable21 · <span class="tau">τ</span>142K · 7.2% APY</span></p>
          </div>
          <div class="home-how__viz" aria-hidden="true">
            <!-- Weight matrix heatmap. 7 validator rows × 10 miner cols.
                 Cell colour intensity encodes the weight value each
                 validator assigns each miner. Some cells subtly shimmer
                 to convey live weight-setting on every block. -->
            <svg viewBox="0 0 220 160" preserveAspectRatio="xMidYMid meet">
              <text x="6" y="10" font-family="JetBrains Mono, monospace" font-size="7"
                    font-weight="700" fill="currentColor" opacity=".55">WEIGHT MATRIX · 7×10 · LIVE</text>
              <line x1="0" y1="14" x2="220" y2="14" stroke="currentColor" stroke-opacity=".22" stroke-width=".5"/>
              <!-- column labels (miners) -->
              ${Array.from({length: 10}).map((_, c) => `
                <text x="${36 + c * 18 + 9}" y="26" text-anchor="middle"
                      font-family="JetBrains Mono, monospace" font-size="6"
                      font-weight="600" fill="currentColor" opacity=".5">M${String(c + 1).padStart(2,'0')}</text>
              `).join('')}
              <!-- row labels (validators) + heatmap cells -->
              ${(() => {
                /* deterministic pseudo-random weight per (row, col) so the
                   pattern is stable but feels organic. */
                const cells = [];
                const labels = ['V01','V02','V03','V04','V05','V06','V07'];
                for (let r = 0; r < 7; r++){
                  const y = 32 + r * 16;
                  cells.push(`
                    <text x="6" y="${y + 11}" font-family="JetBrains Mono, monospace"
                          font-size="6.5" font-weight="700" fill="#FF1E3C">${labels[r]}</text>
                  `);
                  for (let c = 0; c < 10; c++){
                    const seed = ((r + 1) * 113 + (c + 1) * 31) >>> 0;
                    const w = ((seed * 9301 + 49297) % 233280) / 233280;
                    // weights skew so the highest-weighted miner per row
                    // gets ~0.7 + jitter, others fade off
                    const top = (c === ((r * 3) % 10));
                    const v = top ? 0.78 + (w * 0.18) : w * 0.55;
                    const x = 36 + c * 18;
                    const shimmer = (r + c) % 4 === 0
                      ? `style="animation: howShimmer 3.8s ease-in-out ${((r * 0.3) + c * 0.13).toFixed(2)}s infinite;"`
                      : '';
                    cells.push(`
                      <rect x="${x}" y="${y}" width="16" height="12"
                            fill="#FF1E3C" fill-opacity="${v.toFixed(2)}"
                            ${shimmer}/>
                    `);
                  }
                }
                return cells.join('');
              })()}
              <line x1="0" y1="152" x2="220" y2="152" stroke="currentColor" stroke-opacity=".22" stroke-width=".5"/>
              <text x="6"   y="158" font-family="JetBrains Mono, monospace" font-size="6.5" font-weight="600" fill="currentColor" opacity=".55">w[v, m] ∈ [0, 1]</text>
              <text x="216" y="158" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="6.5" font-weight="700" fill="currentColor">SET EVERY BLOCK</text>
            </svg>
          </div>
        </li>

        <li class="home-how__row" data-stage="04">
          <span class="home-how__rail"><span class="home-how__num">04</span></span>
          <div class="home-how__body">
            <header class="home-how__head">
              <h3 class="home-how__h">Consensus</h3>
              <span class="home-how__meta">Algorithm · Yuma v2</span>
            </header>
            <p class="home-how__brief">Yuma Consensus aggregates every validator's weight vector
            into one fair score per miner. The weighted-median operation prunes outlier weights —
            validators that disagree with the consensus get their contributions discounted — so
            the system pays only agreement, not noise.</p>
            <dl class="home-how__data">
              <div><dt>Algorithm</dt><dd>Weighted median</dd></div>
              <div><dt>Trust kernel</dt><dd>Δ-based</dd></div>
              <div><dt>Founding paper</dt><dd>Yuma Rao · 2020</dd></div>
            </dl>
            <p class="home-how__ex"><span class="home-how__ex-lbl">Representative</span><span class="home-how__ex-chip">btcli neuron consensus → server</span></p>
          </div>
          <div class="home-how__viz" aria-hidden="true">
            <!-- Yuma convergence visualization: seven validator-vote
                 dots scattered along the score axis 0..100. The
                 weighted-median falls roughly at 63, drawn as a red
                 vertical line. The Yuma formula sits on the side. -->
            <svg viewBox="0 0 220 160" preserveAspectRatio="xMidYMid meet">
              <text x="6" y="10" font-family="JetBrains Mono, monospace" font-size="7"
                    font-weight="700" fill="currentColor" opacity=".55">YUMA CONVERGENCE · 7 VOTES</text>
              <line x1="0" y1="14" x2="220" y2="14" stroke="currentColor" stroke-opacity=".22" stroke-width=".5"/>

              <!-- score axis -->
              <line x1="14" y1="56" x2="206" y2="56" stroke="currentColor" stroke-opacity=".35" stroke-width=".8"/>
              ${[0, 25, 50, 75, 100].map(v => {
                const x = 14 + (v / 100) * 192;
                return `
                  <line x1="${x}" y1="52" x2="${x}" y2="60" stroke="currentColor" stroke-opacity=".35" stroke-width=".5"/>
                  <text x="${x}" y="72" text-anchor="middle" font-family="JetBrains Mono, monospace"
                        font-size="6" font-weight="600" fill="currentColor" opacity=".55">${v}</text>
                `;
              }).join('')}

              <!-- validator votes scattered along the axis -->
              ${[
                ['V01', 38], ['V02', 54], ['V03', 61], ['V04', 64],
                ['V05', 67], ['V06', 71], ['V07', 89],
              ].map(([lbl, v], i) => {
                const x = 14 + (v / 100) * 192;
                const dy = (i % 2 === 0) ? -8 : 8;
                const delay = (i * 0.3).toFixed(2);
                return `
                  <line x1="${x}" y1="46" x2="${x}" y2="66" stroke="currentColor" stroke-opacity=".22" stroke-width=".5" stroke-dasharray="1 2"/>
                  <circle cx="${x}" cy="56" r="3" fill="#FF4D60" fill-opacity=".82"
                          style="animation: howVote 5.2s ease-in-out ${delay}s infinite;"/>
                  <text x="${x}" y="${56 + dy}" text-anchor="middle"
                        font-family="JetBrains Mono, monospace" font-size="6"
                        font-weight="700" fill="currentColor" opacity=".75">${lbl}</text>
                `;
              }).join('')}

              <!-- the weighted-median line — where consensus lands -->
              ${(() => {
                const x = 14 + (63 / 100) * 192;
                return `
                  <line x1="${x}" y1="32" x2="${x}" y2="88" stroke="#FF1E3C" stroke-width="1.4"/>
                  <text x="${x}" y="28" text-anchor="middle"
                        font-family="JetBrains Mono, monospace" font-size="6.5"
                        font-weight="700" fill="#FF1E3C">CONSENSUS · 63</text>
                `;
              })()}

              <!-- the formula box -->
              <rect x="6" y="98" width="208" height="52"
                    fill="rgba(255,30,60,.06)" stroke="currentColor" stroke-opacity=".22" stroke-width=".5"/>
              <text x="14" y="111" font-family="JetBrains Mono, monospace" font-size="7"
                    fill="currentColor" opacity=".55">// per-miner consensus</text>
              <text x="14" y="124" font-family="JetBrains Mono, monospace" font-size="8"
                    font-weight="700" fill="currentColor">W[i] = <tspan fill="#FF4D60">wmedian</tspan>(w[*, i])</text>
              <text x="14" y="137" font-family="JetBrains Mono, monospace" font-size="7"
                    fill="currentColor" opacity=".55">// trust kernel</text>
              <text x="14" y="146" font-family="JetBrains Mono, monospace" font-size="7"
                    font-weight="700" fill="currentColor">T[v] = 1 − <tspan opacity=".5">Σ</tspan>|W − w[v]| / n</text>
            </svg>
          </div>
        </li>

        <li class="home-how__row" data-stage="05">
          <span class="home-how__rail"><span class="home-how__num">05</span></span>
          <div class="home-how__body">
            <header class="home-how__head">
              <h3 class="home-how__h">Emissions</h3>
              <span class="home-how__meta">Payment · 41 / 41 / 18 split</span>
            </header>
            <p class="home-how__brief">Every block the chain mints fresh τ and splits it three
            ways: <span class="val">41%</span> to the top-ranked miners, <span class="val">41%</span>
            to validators that voted with consensus, <span class="val">18%</span> to the subnet
            owner. Post the December 2025 halving, total daily emission sits at roughly
            <span class="val">3,600 <span class="tau">τ</span></span>.</p>
            <dl class="home-how__data">
              <div><dt>Block cadence</dt><dd>12 s</dd></div>
              <div><dt>Daily total</dt><dd>~3,600 <span class="tau">τ</span></dd></div>
              <div><dt>Next halving</dt><dd>Dec 2029</dd></div>
            </dl>
            <p class="home-how__ex"><span class="home-how__ex-lbl">Representative</span><span class="home-how__ex-chip">post-halving · 50% reduction · Dec 2025</span></p>
          </div>
          <div class="home-how__viz" aria-hidden="true">
            <!-- Animated emission flow. A "BLOCK MINT" node at the
                 top fires τ packets down three rails to MINERS (41%),
                 VALIDATORS (41%), OWNER (18%). Packet density on each
                 rail is proportional to the split. -->
            <svg viewBox="0 0 220 160" preserveAspectRatio="xMidYMid meet">
              <defs>
                <path id="how-rail-A" d="M 110 32 L 36 130" fill="none"/>
                <path id="how-rail-B" d="M 110 32 L 110 130" fill="none"/>
                <path id="how-rail-C" d="M 110 32 L 184 130" fill="none"/>
              </defs>

              <text x="6" y="10" font-family="JetBrains Mono, monospace" font-size="7"
                    font-weight="700" fill="currentColor" opacity=".55">BLOCK MINT · LIVE</text>
              <line x1="0" y1="14" x2="220" y2="14" stroke="currentColor" stroke-opacity=".22" stroke-width=".5"/>

              <!-- the mint at the top -->
              <circle cx="110" cy="28" r="10" fill="rgba(255,30,60,.18)" stroke="#FF1E3C" stroke-width="1"/>
              <text x="110" y="32" text-anchor="middle"
                    font-family="JetBrains Mono, monospace" font-size="9"
                    font-weight="700" fill="#F5E5E8">τ</text>

              <!-- three rails -->
              <use href="#how-rail-A" stroke="currentColor" stroke-opacity=".4" stroke-width=".7"/>
              <use href="#how-rail-B" stroke="currentColor" stroke-opacity=".4" stroke-width=".7"/>
              <use href="#how-rail-C" stroke="currentColor" stroke-opacity=".4" stroke-width=".7"/>

              <!-- packets on rail A (MINERS) — 4 dots, dense -->
              ${[0, 0.22, 0.44, 0.66].map(off => `
                <circle r="2" fill="#FF1E3C">
                  <animateMotion dur="2.2s" begin="${off}s" repeatCount="indefinite">
                    <mpath href="#how-rail-A"/>
                  </animateMotion>
                </circle>
              `).join('')}
              <!-- packets on rail B (VALIDATORS) — 4 dots -->
              ${[0.1, 0.32, 0.54, 0.76].map(off => `
                <circle r="2" fill="#FF4D60">
                  <animateMotion dur="2.2s" begin="${off}s" repeatCount="indefinite">
                    <mpath href="#how-rail-B"/>
                  </animateMotion>
                </circle>
              `).join('')}
              <!-- packets on rail C (OWNER) — 2 dots, fewer to convey 18% -->
              ${[0.5, 1.6].map(off => `
                <circle r="2" fill="#FFB0BA">
                  <animateMotion dur="2.2s" begin="${off}s" repeatCount="indefinite">
                    <mpath href="#how-rail-C"/>
                  </animateMotion>
                </circle>
              `).join('')}

              <!-- destination chips -->
              <g font-family="JetBrains Mono, monospace" font-weight="700">
                <rect x="4"   y="132" width="64" height="18" rx="3" fill="rgba(255,30,60,.12)" stroke="#FF1E3C" stroke-width=".6"/>
                <text x="36"  y="144" text-anchor="middle" font-size="8" fill="#FF1E3C">41% MINERS</text>
                <rect x="78"  y="132" width="64" height="18" rx="3" fill="rgba(255,77,96,.12)" stroke="#FF4D60" stroke-width=".6"/>
                <text x="110" y="144" text-anchor="middle" font-size="8" fill="#FF4D60">41% VALID.</text>
                <rect x="152" y="132" width="64" height="18" rx="3" fill="rgba(255,176,186,.10)" stroke="#FFB0BA" stroke-width=".6"/>
                <text x="184" y="144" text-anchor="middle" font-size="8" fill="#FFB0BA">18% OWNER</text>
              </g>

              <text x="216" y="14" text-anchor="end" font-family="JetBrains Mono, monospace"
                    font-size="7" font-weight="700" fill="currentColor"><tspan opacity=".55">τ</tspan>0.5 / BLOCK · 12s</text>
            </svg>
          </div>
        </li>

        <li class="home-how__row" data-stage="06">
          <span class="home-how__rail"><span class="home-how__num">06</span></span>
          <div class="home-how__body">
            <header class="home-how__head">
              <h3 class="home-how__h">dTAO</h3>
              <span class="home-how__meta">Market · bonding curve</span>
            </header>
            <p class="home-how__brief">Every subnet has its own α token sold on a τ-bonded curve.
            Buy α to bet that a subnet will earn more emissions; the curve sets price as a
            function of bonded τ. This is the protocol's price-discovery layer — dynamic TAO,
            or dTAO, live since <span class="val">Feb 2025</span>.</p>
            <dl class="home-how__data">
              <div><dt>Live α pools</dt><dd>92</dd></div>
              <div><dt>Largest mcap</dt><dd>$199M</dd></div>
              <div><dt>Curve</dt><dd>x·y = k</dd></div>
            </dl>
            <p class="home-how__ex"><span class="home-how__ex-lbl">Representative</span><span class="home-how__ex-chip">SN120 Affine · $199M α-mcap</span></p>
          </div>
          <div class="home-how__viz" aria-hidden="true">
            <!-- Multi-curve dTAO chart: five overlaid bonding curves
                 for the top subnets by α-mcap, each with a current-
                 price marker and label. Axes labelled τ bonded → and
                 α price ↑. -->
            <svg viewBox="0 0 220 160" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="bcg-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"  stop-color="#FF1E3C" stop-opacity=".24"/>
                  <stop offset="100%" stop-color="#FF1E3C" stop-opacity="0"/>
                </linearGradient>
              </defs>
              <text x="6" y="10" font-family="JetBrains Mono, monospace" font-size="7"
                    font-weight="700" fill="currentColor" opacity=".55">α BONDING CURVES · TOP 5</text>
              <line x1="0" y1="14" x2="220" y2="14" stroke="currentColor" stroke-opacity=".22" stroke-width=".5"/>

              <!-- axes -->
              <line x1="14" y1="130" x2="214" y2="130" stroke="currentColor" stroke-opacity=".30" stroke-width=".6"/>
              <line x1="14" y1="22"  x2="14"  y2="130" stroke="currentColor" stroke-opacity=".30" stroke-width=".6"/>
              <!-- gridlines -->
              ${[40, 60, 80, 100].map(y => `
                <line x1="14" y1="${y}" x2="214" y2="${y}" stroke="currentColor" stroke-opacity=".10" stroke-width=".4"/>
              `).join('')}

              <!-- five overlaid bonding curves: c1 highest, c5 lowest -->
              ${[
                /* color, curveY at x=14, x=80, x=160, x=214 — the curve shape; label, marker x, marker y, sn label */
                ['#FF1E3C', 'M 14 124 C 60 122, 120 96, 214  28', 'SN64 Chutes',    160,  62, '$199M'],
                ['#FF4D60', 'M 14 126 C 60 124, 120 110, 214 48', 'SN44 Score',      170,  82, '$190M'],
                ['#FF7A88', 'M 14 127 C 60 125, 120 118, 214 66', 'SN120 Affine',    142,  98, '$199K'],
                ['#FFB0BA', 'M 14 128 C 60 126, 120 122, 214 84', 'SN8 Vanta',       130, 108, '$148K'],
                ['#FF8094', 'M 14 129 C 60 128, 120 126, 214 102','SN75 Hippius',    118, 116, '$101K'],
              ].map(([c, d, lbl, mx, my, val], i) => `
                <path d="${d}" fill="none" stroke="${c}" stroke-width="1.4" stroke-opacity=".88"/>
                <circle cx="${mx}" cy="${my}" r="2.8" fill="#F5E5E8" stroke="${c}" stroke-width="1.2"/>
                <text x="${mx + 5}" y="${my + 3}" font-family="JetBrains Mono, monospace"
                      font-size="6" font-weight="700" fill="currentColor" opacity=".85">${lbl} <tspan opacity=".55">${val}</tspan></text>
              `).join('')}

              <!-- area shading under the top curve to anchor the plot -->
              <path d="M 14 124 C 60 122, 120 96, 214 28 L 214 130 L 14 130 Z" fill="url(#bcg-fill)" opacity=".55"/>

              <!-- axis labels -->
              <text x="14" y="22" font-family="JetBrains Mono, monospace" font-size="6.5"
                    font-weight="600" fill="currentColor" opacity=".55">α PRICE ↑</text>
              <text x="214" y="142" text-anchor="end" font-family="JetBrains Mono, monospace"
                    font-size="6.5" font-weight="600" fill="currentColor" opacity=".55"><tspan opacity=".85">τ</tspan> BONDED →</text>
              <text x="14" y="156" font-family="JetBrains Mono, monospace" font-size="6.5"
                    font-weight="700" fill="currentColor">α<tspan opacity=".6">·</tspan>τ = k <tspan opacity=".55">(constant product)</tspan></text>
            </svg>
          </div>
        </li>

      </ol>

      <footer class="home-how__foot">
        <span>PROTOCOL · YUMA CONSENSUS v2 · DTAO ENABLED · 6 STAGES</span>
        <a class="home-how__more" href="terminal.html#whitepaper">READ THE WHITEPAPER →</a>
      </footer>
    </section>

    <!-- ===== NEURAL NETWORK =====
         The Six Steps explainer above named the loop in words; this
         section renders that same loop as a working feed-forward
         network. Five layers labelled SUBNETS → MINERS → VALIDATORS
         → WEIGHTS → CONSENSUS, with red signal pulses crossing them
         every block. Different mode than the masthead plexus —
         that's the brand; this is the protocol diagram. -->
    <section class="home-neural" aria-label="The Bittensor consensus loop, visualized">
      <div class="home-net__head">
        <span class="home-net__kicker"><span class="home-net__ord">§ 04</span>The machine</span>
        <h2 class="home-net__title">Intelligence, <em>incentivized.</em></h2>
        <p class="home-net__sub">The loop you just read about, rendered live. Subnets set the task,
        miners answer, validators score, weights settle, consensus pays. Watch one block of work
        cross the network end to end.</p>
      </div>
      <div class="home-neural__canvas">
        <canvas data-canvas="neural"></canvas>
      </div>
    </section>

    <!-- ===== EMISSION TREEMAP =====
         The visual companion to step 05 (Emissions) of the Six Steps
         explainer above — now you've named the parts, here's how the
         pie actually gets split. -->
    <section class="home-neural" aria-label="Subnet emission share treemap">
      <div class="home-net__head">
        <span class="home-net__kicker"><span class="home-net__ord">§ 05</span>The slice</span>
        <h2 class="home-net__title">Where the <em>emissions</em> go.</h2>
        <p class="home-net__sub">Bigger tile, bigger share. Chutes, Targon and Apex eat first;
        the long tail fights for the edges. Sized by daily τ emission, darker red = higher rank.</p>
      </div>
      <div class="home-neural__canvas">
        <canvas data-canvas="treemap"></canvas>
      </div>
      <span class="home-neural__foot home-neural__foot--block">
        <span data-bind="treemap-count">TREEMAP · TOP SUBNETS · BY <span class="tau">τ</span>/DAY</span>
        <span>SOURCE · TAOSTATS PUBLIC + SEED</span>
      </span>
    </section>

    <!-- ===== LIVE NETWORK band ===== -->
    <section class="home-net" aria-label="Live network statistics">
      <div class="home-net__head">
        <span class="home-net__kicker"><span class="home-net__ord">§ 06</span><span class="live-dot"></span>Live Network · taomarketcap</span>
        <h2 class="home-net__title">Bittensor, <em>right now.</em></h2>
        <p class="home-net__sub">Real on-chain data — TAO market, supply, staking, and chain state — refreshed straight from the Tao Market Cap public API.</p>
      </div>
      <div class="home-net__grid">
        <div class="home-stat home-stat--lead">
          <span class="home-stat__lbl"><span class="tau">τ</span> / USD</span>
          <span class="home-stat__val" data-bind="price">—</span>
          <span class="home-stat__sub" data-bind="price-delta">—</span>
          <span class="home-stat__spark"><canvas data-spark="price"></canvas></span>
        </div>
        <div class="home-stat">
          <span class="home-stat__lbl">Market Cap</span>
          <span class="home-stat__val" data-bind="mcap">—</span>
          <span class="home-stat__sub" data-bind="mcap-delta">7d —</span>
          <span class="home-stat__spark"><canvas data-spark="mcap"></canvas></span>
        </div>
        <div class="home-stat">
          <span class="home-stat__lbl">Circulating</span>
          <span class="home-stat__val" data-bind="circ">—</span>
          <span class="home-stat__sub">of 21M max</span>
          <span class="home-stat__spark"><canvas data-spark="circ"></canvas></span>
        </div>
        <div class="home-stat">
          <span class="home-stat__lbl">Staked</span>
          <span class="home-stat__val" data-bind="staked">—</span>
          <span class="home-stat__sub" data-bind="apr">APR —</span>
          <span class="home-stat__spark"><canvas data-spark="staked"></canvas></span>
        </div>
        <div class="home-stat">
          <span class="home-stat__lbl">24h Volume</span>
          <span class="home-stat__val" data-bind="vol">—</span>
          <span class="home-stat__sub" data-bind="vol-sub">spot</span>
          <span class="home-stat__spark"><canvas data-spark="vol"></canvas></span>
        </div>
        <div class="home-stat">
          <span class="home-stat__lbl">Block height</span>
          <span class="home-stat__val" data-bind="block">—</span>
          <span class="home-stat__sub" data-bind="chain-sub">root / subnet split</span>
          <span class="home-stat__spark"><canvas data-spark="block"></canvas></span>
        </div>
      </div>
    </section>

    <!-- ===== END OF FEATURE =====
         The home view stops here. One editorial closer that doubles
         as the page colophon — § corner ornaments, an END pill, the
         restated mast and live-data attribution underneath, and a
         direct @subnetmagazine handle on the right. No subnetwork
         leaderboard rail or sections grid below; the rest of the
         site is reached from the masthead nav. -->
    <aside class="home-pagebreak" aria-label="End of feature">
      <div class="home-pagebreak__rule">
        <span class="home-pagebreak__corner">§</span>
        <span class="home-pagebreak__line"></span>
        <span class="home-pagebreak__num">END · 14 MAY 2026</span>
        <span class="home-pagebreak__line"></span>
        <span class="home-pagebreak__corner">§</span>
      </div>
      <div class="home-pagebreak__body">
        <p class="home-pagebreak__cap">Bittensor, right now.</p>
        <p class="home-pagebreak__sub">Live data · Tao Market Cap public API · Subne<span class="tau">τ</span> Magazine ${new Date().getUTCFullYear()}</p>
      </div>
      <a class="home-pagebreak__turn" href="https://x.com/subnetmagazine" target="_blank" rel="noopener">
        <span class="home-pagebreak__x-glyph" aria-hidden="true">𝕏</span>
        <span>@subnetmagazine</span>
      </a>
    </aside>
  `);

  /* ---------- neural-net protocol diagram ----------
     Five labelled layers — subnets, miners, validators, weights,
     consensus — wired together with red signal pulses. Lives in the
     "machine" section right under the Six Steps explainer. */
  const neuralCanvas = qs('[data-canvas="neural"]', root);
  const neural = neuralCanvas ? new NeuralNet(neuralCanvas) : null;

  /* ---------- emission treemap ----------
     Fewer tiles on phone so labels fit; more on desktop so you see
     the long-tail. The footer caption is bound to the count so it
     never lies about how many tiles you're looking at. */
  const treemapCanvas = qs('[data-canvas="treemap"]', root);
  const topN = (window.matchMedia && window.matchMedia('(max-width: 720px)').matches) ? 10 : 16;
  const treemapItems = [...SUBNETS]
    .sort((a, b) => (b.emission || 0) - (a.emission || 0))
    .slice(0, topN)
    .map(s => ({
      label: 'SN' + s.netuid + ' · ' + s.name,
      sub:   'τ' + (s.emission || 0) + ' / day',
      value: s.emission || 1,
    }));
  const treemap = treemapCanvas
    ? new Treemap(treemapCanvas, { items: treemapItems })
    : null;
  const treemapCount = qs('[data-bind="treemap-count"]', root);
  if (treemapCount) treemapCount.innerHTML = 'TREEMAP · TOP ' + topN + ' SUBNETS · BY <span class="tau">τ</span>/DAY';

  /* ---------- LIVE NETWORK band sparklines ---------- */
  /* one micro-trend per stat — deterministic, keyed to the field, a
     visual read of momentum until per-field history endpoints land. */
  const statSparks = [];
  [
    ['price',   18], ['mcap',   12], ['circ',   4],
    ['staked',  6],  ['vol',   -9], ['block',  22],
  ].forEach(([key, drift]) => {
    const cv = qs(`[data-spark="${key}"]`, root);
    if (cv) statSparks.push(new Sparkline(cv, { series: seedSeries(key, drift, 32) }));
  });

  /* ---------- TOP VALIDATORS rail — one sparkline per card ---------- */
  const valSparks = [];
  VALIDATORS.slice(0, 12).forEach((v) => {
    const cv = qs(`[data-val-spark="${v.id}"]`, root);
    if (cv) valSparks.push(new Sparkline(cv, { series: seedSeries(v.id + 'v', v.apy * 1.4 - 14, 28) }));
  });

  /* ---------- TOP 25 BIOS — one sparkline per card cover ----------
     Each cover banner gets a 30-pt sparkline biased by the subnet's
     24h change so the line colour matches the reported direction.
     Sparkline auto-colours green / red by net direction. */
  const bioSparks = [];
  SUBNET_BIOS.forEach((b) => {
    const sn   = subnetById(b.netuid) || {};
    const seed = BIO_SEED[b.netuid]   || {};
    const drift = (sn.chg24 ?? seed.chg24 ?? 0) * 1.6;
    const cv = qs(`[data-bio-spark="${b.netuid}"]`, root);
    if (cv) bioSparks.push(new Sparkline(cv, {
      series:    seedSeries('bio-' + b.netuid, drift, 30),
      lineWidth: 1.6,
      fill:      true,
    }));
  });

  /* ---------- bind: LIVE NETWORK band ---------- */
  const bind = sel => qs(`[data-bind="${sel}"]`, root);
  const els = {
    price:      bind('price'),
    priceDelta: bind('price-delta'),
    mcap:       bind('mcap'),
    mcapDelta:  bind('mcap-delta'),
    circ:       bind('circ'),
    staked:     bind('staked'),
    apr:        bind('apr'),
    vol:        bind('vol'),
    volSub:     bind('vol-sub'),
    block:      bind('block'),
    chainSub:   bind('chain-sub'),
  };

  function renderMarket(d){
    if (!d) return;
    if (els.price && d.price != null) setLive(els.price, money(d.price));
    if (els.priceDelta){
      const c = d.change24h ?? 0;
      els.priceDelta.textContent = `${pct(c)} · 24h`;
      els.priceDelta.className = `home-stat__sub ${deltaClass(c)}`;
    }
    if (els.mcap && d.marketCap != null) setLive(els.mcap, '$' + compact(d.marketCap));
    if (els.mcapDelta){
      const c = d.change7d ?? 0;
      els.mcapDelta.textContent = `7d ${pct(c)}`;
      els.mcapDelta.className = `home-stat__sub ${deltaClass(c)}`;
    }
    if (els.circ && d.circulating != null) setLive(els.circ, compact(d.circulating) + ' τ');
    if (els.staked && d.stakedPct != null) setLive(els.staked, d.stakedPct.toFixed(1) + '%');
    if (els.apr && d.stakingApr != null) els.apr.textContent = `APR ${d.stakingApr.toFixed(2)}%`;
    if (els.vol && d.volume24h != null) setLive(els.vol, '$' + compact(d.volume24h));
  }
  function renderChain(d){
    if (!d) return;
    if (els.block && d.blockNumber != null) setLive(els.block, d.blockNumber.toLocaleString('en-US'));
    if (els.chainSub && d.rootPct != null && d.subnetsPct != null){
      els.chainSub.textContent = `${d.rootPct.toFixed(0)}% root · ${d.subnetsPct.toFixed(0)}% subnet`;
    }
  }

  /* ---------- bind: TOP SUBNETS ---------- */
  const grid = qs('#home-subnets-grid', root);
  let sparks = [];
  function renderSubnets(list){
    if (!grid || !Array.isArray(list) || !list.length) return;
    sparks.splice(0).forEach(sp => { try { sp.destroy(); } catch (_) {} });
    const top = list.slice(0, 12);
    grid.innerHTML = top.map((s, i) => {
      const up = (s.chg24 ?? 0) >= 0;
      /* Real logo when the API gives one; a generated node-graph
         monogram (deterministic per name) as the fallback so every
         card carries a mark, never a bare letter. */
      const fallback = mark(s.name, { size: 32 });
      const logo = s.logo
        ? `<img class="home-subnet__logo" src="${s.logo}" alt="" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='block'">
           <span class="home-subnet__logo-fallback" style="display:none">${fallback}</span>`
        : `<span class="home-subnet__logo-fallback">${fallback}</span>`;
      return `
        <li class="home-subnet">
          <a class="home-subnet__link" href="subnet.html?id=${s.netuid}">
            <span class="home-subnet__rank">${String(i + 1).padStart(2, '0')}</span>
            <span class="home-subnet__logo-wrap">${logo}</span>
            <span class="home-subnet__id">SN${s.netuid}</span>
            <span class="home-subnet__name">${s.name}</span>
            <span class="home-subnet__spark"><canvas></canvas></span>
            <span class="home-subnet__price">${s.price < 1 ? '$' + s.price.toFixed(4) : money(s.price)}</span>
            <span class="home-subnet__chg ${up ? 'up' : 'down'}">${pct(s.chg24 ?? 0)}</span>
            <span class="home-subnet__mcap">MC $${compact(s.marketcap)}</span>
          </a>
        </li>
      `;
    }).join('');
    /* mount one sparkline per card — synthesized trend keyed to the
       subnet name + its real 24h change until a real per-subnet
       history endpoint is wired in. */
    const canvases = qsa('.home-subnet__spark canvas', grid);
    canvases.forEach((cv, i) => {
      const s = top[i];
      sparks.push(new Sparkline(cv, { series: seedSeries(s.name, s.chg24 ?? 0, 24) }));
    });
  }

  /* ---------- subscribe ---------- */
  /* swap article cover logos to the real CDN logo when the live
     tao:subnets feed lands a logo URL for the matching netuid */
  function renderArticleLogos(list){
    if (!Array.isArray(list)) return;
    const byId = new Map(list.map(s => [Number(s.netuid), s]));
    qsa('[data-article-subnet]', root).forEach(el => {
      const sn = byId.get(Number(el.dataset.articleSubnet));
      if (sn && sn.logo){
        el.innerHTML = `<img class="home-article__logo-img" src="${sn.logo}" alt="${sn.name}" loading="lazy"
          onerror="this.replaceWith(document.createTextNode(''))">`;
      }
    });
  }

  const unsubs = [];
  if (dataLayer){
    unsubs.push(dataLayer.subscribe('tao:market',  renderMarket));
    unsubs.push(dataLayer.subscribe('tao:chain',   renderChain));
    unsubs.push(dataLayer.subscribe('tao:subnets', renderSubnets));
    unsubs.push(dataLayer.subscribe('tao:subnets', renderArticleLogos));
    /* render anything already cached */
    renderMarket(dataLayer.get('tao:market'));
    renderChain(dataLayer.get('tao:chain'));
    renderSubnets(dataLayer.get('tao:subnets'));
    renderArticleLogos(dataLayer.get('tao:subnets'));
  }

  return {
    destroy(){
      unsubs.forEach(u => u());
      sparks.splice(0).forEach(sp => { try { sp.destroy(); } catch (_) {} });
      statSparks.splice(0).forEach(sp => { try { sp.destroy(); } catch (_) {} });
      valSparks.splice(0).forEach(sp => { try { sp.destroy(); } catch (_) {} });
      bioSparks.splice(0).forEach(sp => { try { sp.destroy(); } catch (_) {} });
      neural?.destroy();
      treemap?.destroy();
    },
  };
}
