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
import { Treemap } from '../charts/Treemap.js';
import { articlesByDate } from '../data/articles.js';
import { subnetById, SUBNETS } from '../data/subnets.js';
import { VALIDATORS } from '../data/validators.js';

const CAT_LABEL = {
  'reporting':   'REPORTING',
  'profile':     'SUBNET PROFILE',
  'op-ed':       'OP-ED',
  'fund-letter': 'FUND LETTER',
  'primer':      'PRIMER',
};

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
    <!-- ===== BITTENSOR IN SIX STEPS (teaching block) =====
         A plain-language explainer of the protocol — what makes the
         network work, in the order it works. Every page on the site
         visualises this loop; this section names the parts so the
         visualisations actually mean something to a first-time reader. -->
    <section class="home-how" aria-label="Bittensor, in six steps">
      <div class="home-net__head">
        <span class="home-net__kicker">&gt; The protocol</span>
        <h2 class="home-net__title">Bittensor, in <em>six steps.</em></h2>
        <p class="home-net__sub">The whole network in one read — what subnets are, who mines them,
        who scores them, how consensus pays, and why every subnet has its own alpha token. Plain words.</p>
      </div>
      <ol class="home-how__grid">
        <li class="home-how__step">
          <span class="home-how__num">01</span>
          <span class="home-how__icon" aria-hidden="true">
            <svg viewBox="0 0 56 56" width="56" height="56" fill="none">
              <rect x="6"  y="6"  width="13" height="13" rx="1" stroke="currentColor" stroke-width="1.4"/>
              <rect x="22" y="6"  width="13" height="13" rx="1" stroke="currentColor" stroke-width="1.4"/>
              <rect x="38" y="6"  width="12" height="13" rx="1" stroke="currentColor" stroke-width="1.4"/>
              <rect x="6"  y="22" width="13" height="13" rx="1" stroke="currentColor" stroke-width="1.4"/>
              <rect x="22" y="22" width="13" height="13" rx="1" fill="currentColor"/>
              <rect x="38" y="22" width="12" height="13" rx="1" stroke="currentColor" stroke-width="1.4"/>
              <rect x="6"  y="38" width="13" height="12" rx="1" stroke="currentColor" stroke-width="1.4"/>
              <rect x="22" y="38" width="13" height="12" rx="1" stroke="currentColor" stroke-width="1.4"/>
              <rect x="38" y="38" width="12" height="12" rx="1" stroke="currentColor" stroke-width="1.4"/>
            </svg>
          </span>
          <h3 class="home-how__h">Subnets</h3>
          <p class="home-how__p">A subnet is a market for one specific kind of intelligence —
          text generation, image classification, weather forecasts, protein folding. Today there
          are <span class="val">92 active subnets</span>, each running its own competition.</p>
        </li>

        <li class="home-how__step">
          <span class="home-how__num">02</span>
          <span class="home-how__icon" aria-hidden="true">
            <svg viewBox="0 0 56 56" width="56" height="56" fill="none">
              <rect x="10" y="20" width="36" height="24" rx="2" stroke="currentColor" stroke-width="1.4"/>
              <circle cx="17" cy="28" r="1.6" fill="currentColor"/>
              <circle cx="17" cy="34" r="1.6" fill="currentColor"/>
              <circle cx="17" cy="40" r="1.6" fill="currentColor"/>
              <path d="M28 18 V8 M22 14 L28 8 L34 14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
              <rect x="25" y="26" width="14" height="3" fill="currentColor" opacity=".65"/>
              <rect x="25" y="32" width="11" height="3" fill="currentColor" opacity=".5"/>
              <rect x="25" y="38" width="16" height="3" fill="currentColor" opacity=".8"/>
            </svg>
          </span>
          <h3 class="home-how__h">Miners</h3>
          <p class="home-how__p">Anyone can register a miner on any subnet — usually a GPU running
          a model. Miners answer the subnet's queries; whoever answers <em>best</em> earns the most.
          No permission, no whitelist. Pay <span class="val">~τ1</span> to register a UID.</p>
        </li>

        <li class="home-how__step">
          <span class="home-how__num">03</span>
          <span class="home-how__icon" aria-hidden="true">
            <svg viewBox="0 0 56 56" width="56" height="56" fill="none">
              <circle cx="28" cy="28" r="20" stroke="currentColor" stroke-width="1.4"/>
              <circle cx="28" cy="28" r="12" stroke="currentColor" stroke-width="1.2" opacity=".55"/>
              <circle cx="28" cy="28" r="4"  fill="currentColor"/>
              <path d="M28 2 V12 M28 44 V54 M2 28 H12 M44 28 H54" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
              <path d="M40 18 L46 12 M16 38 L10 44 M40 38 L46 44 M16 18 L10 12" stroke="currentColor" stroke-width="1.1" opacity=".45"/>
            </svg>
          </span>
          <h3 class="home-how__h">Validators</h3>
          <p class="home-how__p">Validators rank the miners. Each validator runs the subnet's
          incentive code, scores every miner's output, and publishes a weight vector — its honest
          opinion of who did the work. <span class="val">6,184 hotkeys</span> validate today.</p>
        </li>

        <li class="home-how__step">
          <span class="home-how__num">04</span>
          <span class="home-how__icon" aria-hidden="true">
            <svg viewBox="0 0 56 56" width="56" height="56" fill="none">
              <circle cx="14" cy="14" r="3"  fill="currentColor"/>
              <circle cx="42" cy="14" r="3"  fill="currentColor"/>
              <circle cx="14" cy="42" r="3"  fill="currentColor"/>
              <circle cx="42" cy="42" r="3"  fill="currentColor"/>
              <circle cx="28" cy="28" r="5"  stroke="currentColor" stroke-width="1.6"/>
              <path d="M14 14 L28 28 M42 14 L28 28 M14 42 L28 28 M42 42 L28 28" stroke="currentColor" stroke-width="1.3"/>
              <circle cx="28" cy="28" r="14" stroke="currentColor" stroke-width="1" opacity=".4" stroke-dasharray="2 3"/>
            </svg>
          </span>
          <h3 class="home-how__h">Consensus</h3>
          <p class="home-how__p">Yuma Consensus aggregates every validator's weights into one
          fair score per miner. Outliers get pruned; agreement gets paid. The math comes from
          <span class="val">Yuma Rao 2020</span> — Bittensor's founding whitepaper.</p>
        </li>

        <li class="home-how__step">
          <span class="home-how__num">05</span>
          <span class="home-how__icon" aria-hidden="true">
            <svg viewBox="0 0 56 56" width="56" height="56" fill="none">
              <circle cx="28" cy="10" r="6" stroke="currentColor" stroke-width="1.6"/>
              <text x="28" y="13" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="7" font-weight="700" fill="currentColor">τ</text>
              <path d="M28 16 L12 38 M28 16 L28 38 M28 16 L44 38" stroke="currentColor" stroke-width="1.4"/>
              <rect x="6"  y="40" width="12" height="10" rx="1" stroke="currentColor" stroke-width="1.2"/>
              <rect x="22" y="40" width="12" height="10" rx="1" stroke="currentColor" stroke-width="1.2"/>
              <rect x="38" y="40" width="12" height="10" rx="1" stroke="currentColor" stroke-width="1.2"/>
              <text x="12" y="48" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="6" font-weight="700" fill="currentColor">41</text>
              <text x="28" y="48" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="6" font-weight="700" fill="currentColor">41</text>
              <text x="44" y="48" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="6" font-weight="700" fill="currentColor">18</text>
            </svg>
          </span>
          <h3 class="home-how__h">Emissions</h3>
          <p class="home-how__p">Every block the chain mints fresh TAO and splits it three ways:
          <span class="val">41 %</span> to miners, <span class="val">41 %</span> to validators,
          <span class="val">18 %</span> to the subnet owner. Daily emission across the whole
          network: roughly <span class="val">7,200 τ</span>.</p>
        </li>

        <li class="home-how__step">
          <span class="home-how__num">06</span>
          <span class="home-how__icon" aria-hidden="true">
            <svg viewBox="0 0 56 56" width="56" height="56" fill="none">
              <path d="M6 46 Q22 46 28 28 T50 10" stroke="currentColor" stroke-width="1.8" fill="none"/>
              <path d="M6 46 H50 M6 46 V10" stroke="currentColor" stroke-width="1" opacity=".4"/>
              <circle cx="28" cy="28" r="3" fill="currentColor"/>
              <text x="44" y="22" font-family="JetBrains Mono, monospace" font-size="8" font-weight="700" fill="currentColor">α</text>
              <text x="10" y="42" font-family="JetBrains Mono, monospace" font-size="7" fill="currentColor" opacity=".6">τ</text>
            </svg>
          </span>
          <h3 class="home-how__h">dTAO</h3>
          <p class="home-how__p">Each subnet has its own token — its <span class="val">α token</span>.
          A bonding curve sets the price: more TAO bonded in, higher the α. Buy α to bet that a
          subnet will earn more emissions; sell α to exit. This is dynamic TAO — dTAO.</p>
        </li>
      </ol>
      <span class="home-how__foot">
        <span>PROTOCOL · YUMA CONSENSUS · DTAO ENABLED</span>
        <span>READ MORE · TERMINAL → /WHITEPAPER</span>
      </span>
    </section>

    <!-- ===== FEATURED RESEARCH (top of page) ===== -->
    <section class="home-research" aria-label="Featured research">
      <div class="home-research__head">
        <span class="home-net__kicker"><span class="live-dot"></span>Featured Research · the desk</span>
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

    <!-- ===== EMISSION TREEMAP =====
         The visual companion to step 05 (Emissions) of the Six Steps
         explainer above — now you've named the parts, here's how the
         pie actually gets split. -->
    <section class="home-neural" aria-label="Subnet emission share treemap">
      <div class="home-net__head">
        <span class="home-net__kicker">&gt; The slice</span>
        <h2 class="home-net__title">Where the <em>emissions</em> go.</h2>
        <p class="home-net__sub">Bigger tile, bigger share. Chutes, Targon and Apex eat first;
        the long tail fights for the edges. Sized by daily τ emission, darker red = higher rank.</p>
      </div>
      <div class="home-neural__canvas">
        <canvas data-canvas="treemap"></canvas>
      </div>
      <span class="home-neural__foot home-neural__foot--block">
        <span data-bind="treemap-count">TREEMAP · TOP SUBNETS · BY τ/DAY</span>
        <span>SOURCE · TAOSTATS PUBLIC + SEED</span>
      </span>
    </section>

    <!-- ===== LIVE NETWORK band ===== -->
    <section class="home-net" aria-label="Live network statistics">
      <div class="home-net__head">
        <span class="home-net__kicker"><span class="live-dot"></span>Live Network · taomarketcap</span>
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
          <span class="home-net__kicker"><span class="live-dot"></span>Top Subnets · by market cap</span>
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
          <span class="home-net__kicker"><span class="live-dot"></span>Top Validators · by stake</span>
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
        <span class="home-net__kicker">&gt; The whole terminal</span>
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
  if (treemapCount) treemapCount.textContent = 'TREEMAP · TOP ' + topN + ' SUBNETS · BY τ/DAY';

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
      treemap?.destroy();
    },
  };
}
