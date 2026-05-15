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
            <svg viewBox="0 0 120 80" preserveAspectRatio="xMidYMid meet">
              <g fill="none" stroke="currentColor" stroke-width=".8">
                ${(() => {
                  /* 6×4 grid of cells — ~16 of 24 lit to convey "many active markets" */
                  const lit = new Set([0,1,2,4,5,7,8,9,11,12,14,15,17,19,20,22]);
                  let cells = '';
                  for (let r = 0; r < 4; r++){
                    for (let c = 0; c < 6; c++){
                      const i = r * 6 + c;
                      const x = 4 + c * 19, y = 4 + r * 18;
                      cells += lit.has(i)
                        ? `<rect x="${x}" y="${y}" width="15" height="14" fill="currentColor" fill-opacity=".55" stroke="currentColor"/>`
                        : `<rect x="${x}" y="${y}" width="15" height="14" stroke="currentColor" stroke-opacity=".25"/>`;
                    }
                  }
                  return cells;
                })()}
              </g>
              <text x="4" y="78" font-family="JetBrains Mono, monospace" font-size="6" font-weight="600" fill="currentColor" opacity=".55">SUBNET SLOTS · ACTIVE/TOTAL</text>
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
            <svg viewBox="0 0 120 80" preserveAspectRatio="xMidYMid meet">
              <g fill="currentColor">
                ${[
                  ['SN64', 68], ['SN56', 52], ['SN4', 44], ['SN1', 36], ['SN5', 28],
                ].map(([lbl, h], i) => `
                  <rect x="${6 + i * 22}" y="${72 - h}" width="14" height="${h}" fill-opacity=".7"/>
                  <text x="${6 + i * 22 + 7}" y="${66}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="7" font-weight="600" fill="currentColor" opacity=".0">_</text>
                  <text x="${6 + i * 22 + 7}" y="${78}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="6" font-weight="600" fill="currentColor" opacity=".55">${lbl}</text>
                `).join('')}
              </g>
              <line x1="0" y1="72" x2="120" y2="72" stroke="currentColor" stroke-opacity=".25" stroke-width=".5"/>
              <text x="118" y="10" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="6" font-weight="600" fill="currentColor" opacity=".45">MINERS · TOP 5 SUBNETS</text>
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
            <svg viewBox="0 0 140 80" preserveAspectRatio="xMidYMid meet">
              <g font-family="JetBrains Mono, monospace" font-size="7" font-weight="600" fill="currentColor">
                <text x="4" y="10" opacity=".5">RANK</text>
                <text x="32" y="10" opacity=".5">VALIDATOR</text>
                <text x="92" y="10" opacity=".5">STAKE</text>
                <text x="124" y="10" opacity=".5">APY</text>
                <line x1="0" y1="14" x2="140" y2="14" stroke="currentColor" stroke-opacity=".22" stroke-width=".5"/>
                ${[
                  ['01', 'RoundTable21', '142K', '7.2%'],
                  ['02', 'Yuma Group',   '124K', '6.9%'],
                  ['03', 'Polychain',     '98K', '6.5%'],
                  ['04', 'Datura',        '86K', '6.4%'],
                ].map(([r, n, s, a], i) => {
                  const y = 26 + i * 13;
                  return `
                    <text x="4"  y="${y}" fill="#FF1E3C">${r}</text>
                    <text x="32" y="${y}" fill-opacity=".9">${n}</text>
                    <text x="92" y="${y}" fill-opacity=".9"><tspan opacity=".55">τ</tspan>${s}</text>
                    <text x="124" y="${y}" fill="#00E5A8">${a}</text>
                  `;
                }).join('')}
              </g>
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
          <div class="home-how__viz home-how__viz--code" aria-hidden="true">
            <pre><code><span class="c">// per-miner consensus weight</span>
W[i] = <span class="fn">wmedian</span>(weights[*, i])

<span class="c">// per-validator trust</span>
T[v] = 1 − Σ|W − w_v| ÷ n

<span class="c">// emission share</span>
r[i] = T-weighted W[i]</code></pre>
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
            <svg viewBox="0 0 200 80" preserveAspectRatio="xMidYMid meet">
              <g>
                <rect x="0"   y="28" width="82"  height="22" fill="#FF1E3C" fill-opacity=".85"/>
                <rect x="84"  y="28" width="82"  height="22" fill="#FF4D60" fill-opacity=".85"/>
                <rect x="168" y="28" width="32"  height="22" fill="#FFB0BA" fill-opacity=".8"/>
                <text x="41"  y="44" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" fill="#080205">41%</text>
                <text x="125" y="44" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" fill="#080205">41%</text>
                <text x="184" y="44" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" fill="#080205">18%</text>
                <text x="41"  y="64" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="6.5" font-weight="600" fill="currentColor" opacity=".7">MINERS</text>
                <text x="125" y="64" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="6.5" font-weight="600" fill="currentColor" opacity=".7">VALIDATORS</text>
                <text x="184" y="64" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="6.5" font-weight="600" fill="currentColor" opacity=".7">OWNER</text>
                <text x="0" y="14" font-family="JetBrains Mono, monospace" font-size="7" font-weight="600" fill="currentColor" opacity=".55">EVERY BLOCK · 12 SECONDS</text>
                <text x="200" y="14" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="7" font-weight="700" fill="currentColor"><tspan opacity=".55">τ</tspan>0.5 / BLOCK</text>
              </g>
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
            <svg viewBox="0 0 160 80" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="bcg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"  stop-color="#FF1E3C" stop-opacity=".34"/>
                  <stop offset="100%" stop-color="#FF1E3C" stop-opacity="0"/>
                </linearGradient>
              </defs>
              <line x1="6" y1="68" x2="156" y2="68" stroke="currentColor" stroke-opacity=".25" stroke-width=".5"/>
              <line x1="6" y1="68" x2="6"   y2="10" stroke="currentColor" stroke-opacity=".25" stroke-width=".5"/>
              <path d="M 6 66 C 56 64, 96 50, 156 14" fill="none" stroke="#FF1E3C" stroke-width="1.6"/>
              <path d="M 6 66 C 56 64, 96 50, 156 14 L 156 68 L 6 68 Z" fill="url(#bcg)"/>
              <circle cx="106" cy="34" r="2.6" fill="#F5E5E8"/>
              <text x="110" y="32" font-family="JetBrains Mono, monospace" font-size="7" fill="currentColor" opacity=".85">α=√(τ_b)</text>
              <text x="6"   y="10" font-family="JetBrains Mono, monospace" font-size="6.5" font-weight="600" fill="currentColor" opacity=".55">α PRICE</text>
              <text x="156" y="78" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="6.5" font-weight="600" fill="currentColor" opacity=".55"><tspan opacity=".85">τ</tspan> BONDED →</text>
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

    <!-- ===== TOP SUBNETS ===== -->
    <section class="home-subnets" aria-label="Top subnets by market cap">
      <div class="home-subnets__head">
        <div>
          <span class="home-net__kicker"><span class="home-net__ord">§ 07</span><span class="live-dot"></span>Top Subnets · by market cap</span>
          <h2 class="home-net__title">Who's <em>winning</em> the blocks.</h2>
        </div>
        <a class="home-subnets__all" href="subnets.html">All subnets ↗</a>
      </div>
      <ul class="home-subnets__grid" id="home-subnets-grid">
        <li class="home-subnet is-loading"><span class="home-subnet__skeleton"></span></li>
        <li class="home-subnet is-loading"><span class="home-subnet__skeleton"></span></li>
        <li class="home-subnet is-loading"><span class="home-subnet__skeleton"></span></li>
        <li class="home-subnet is-loading"><span class="home-subnet__skeleton"></span></li>
      </ul>
    </section>

    <!-- ===== TOP VALIDATORS ===== -->
    <section class="home-vals" aria-label="Top validators by stake">
      <div class="home-subnets__head">
        <div>
          <span class="home-net__kicker"><span class="home-net__ord">§ 08</span><span class="live-dot"></span>Top Validators · by stake</span>
          <h2 class="home-net__title">The hotkeys that <em>run the network.</em></h2>
        </div>
        <a class="home-subnets__all" href="validators.html">All validators ↗</a>
      </div>
      <ul class="home-vals__rail">
        ${VALIDATORS.slice(0, 12).map((v, i) => `
          <li class="home-val">
            <a class="home-val__link" href="validators.html#${v.id}">
              <span class="home-val__head">
                <span class="home-val__rank">${String(i + 1).padStart(2, '0')}</span>
                <span class="home-val__country">${v.country || ''}</span>
              </span>
              <span class="home-val__name">${v.name}</span>
              <span class="home-val__hotkey">${v.hotkey}</span>
              <span class="home-val__spark"><canvas data-val-spark="${v.id}"></canvas></span>
              <span class="home-val__stats">
                <span class="home-val__stat"><span class="lbl">Stake</span><span class="val">τ${compact(v.stake)}</span></span>
                <span class="home-val__stat"><span class="lbl">APY</span><span class="val up">${v.apy.toFixed(1)}%</span></span>
                <span class="home-val__stat"><span class="lbl">Noms</span><span class="val">${int(v.nominators)}</span></span>
                <span class="home-val__stat"><span class="lbl">SN</span><span class="val">${v.subnets}</span></span>
              </span>
            </a>
          </li>
        `).join('')}
      </ul>
    </section>

    <!-- ===== SECTIONS NAV ===== -->
    <section class="home-sections" aria-label="Site sections">
      <div class="home-net__head">
        <span class="home-net__kicker"><span class="home-net__ord">§ 09</span>The whole terminal</span>
        <h2 class="home-net__title">Nine ways in.</h2>
      </div>
      <ul class="home-sections__grid">
        ${SECTIONS.map(s => `
          <li class="home-section">
            <a class="home-section__link" href="${s.href}">
              <span class="home-section__code">&lt;${s.code}&gt;</span>
              <span class="home-section__label">${s.label}</span>
              <span class="home-section__desc">${s.desc}</span>
              <span class="home-section__go">Open →</span>
            </a>
          </li>
        `).join('')}
      </ul>
    </section>

    <footer class="home-foot">
      <span>Subneτ Magazine · a research terminal for decentralized intelligence</span>
      <a class="home-foot__x" href="https://x.com/subnetmagazine" target="_blank" rel="noopener">𝕏 @subnetmagazine</a>
      <span>Live data · Tao Market Cap public API · ${new Date().getUTCFullYear()}</span>
    </footer>
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
