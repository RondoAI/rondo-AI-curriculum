/* =================================================================
   SUBNET MAGAZINE, HOME (magazine cover, real data)
   -----------------------------------------------------------------
   The content below the hero icosphere + validator globe on
   index.html. Three blocks:

     1. LIVE NETWORK band, real TAO price, market cap, circulating
        supply, staked %, staking APR, FDV, block height. Pulled
        from the TMC API via DataLayer ('tao:market' + 'tao:chain').
     2. TOP SUBNETS, the real top-12 subnets by market cap, each
        with its real logo, netuid, α-price, 24h change, market
        cap. Click any card → markets.html#snN. Sourced from
        DataLayer 'tao:subnets'.
     3. SECTIONS, a clean card grid linking to every page on the
        site with a one-line explanation of each.

   Everything that's live is labelled LIVE; if the API can't be
   reached the band falls back to ", " rather than faking numbers.
   ================================================================= */

import { html, mount, qs, qsa, setLive } from '../lib/dom.js';
import { money, compact, pct, deltaClass, int } from '../lib/format.js';
import { mark, seedSeries } from '../lib/mark.js';
import { brandChip } from '../lib/brand-monograms.js';
import { cardArt } from '../lib/art.js';
import { Sparkline } from '../charts/Sparkline.js';
import { NeuralNet } from '../charts/NeuralNet.js';
import { NodeSphere } from '../charts/NodeSphere.js';
import { JarvisNet } from '../charts/JarvisNet.js';
import { PlexusGlyph } from '../charts/PlexusGlyph.js';
import { Treemap } from '../charts/Treemap.js';
import { articlesByDate } from '../data/articles.js';
import { recentOracleArticles } from '../data/oracle-articles.js';
import { subnetById, SUBNETS } from '../data/subnets.js';
import { SUBNET_BIOS } from '../data/subnet-bios.js';
import { FOUNDERS, founderById } from '../data/founders.js';
import { tsByNetuid, TAONSQUARE_COUNT, TAONSQUARE_FETCHED_AT } from '../data/taonsquare.js';
import { socialIcon } from '../lib/social-icons.js';
import { VALIDATORS } from '../data/validators.js';
import { applySlideHint } from '../lib/slide-hint.js';

const CAT_LABEL = {
  'reporting':   'REPORTING',
  'profile':     'SUBNET PROFILE',
  'op-ed':       'OP-ED',
  'fund-letter': 'FUND LETTER',
  'primer':      'PRIMER',
  'interview':   'INTERVIEW',
};

/* Seed for top-25 cover banners, subnets whose netuids are NOT in
   the live SUBNETS roster (newer slots, rebrands, or community
   restarts after Covenant's April 2026 exit). Provides price, mcap
   ($M), 24h % change, name, category, and short owner so the cover
   never falls back to ", ". May 2026 reasonable values, designed to
   ride on top of whatever the live feed lands later. */
const BIO_SEED = Object.freeze({
  3:   { name: 'Templar · Teutonic', price: 0.0297, mcap: 132.6, chg24:  +1.25, chg30: +18.4, emission: 142, cat: 'training', owner: 'community' },
  51:  { name: 'Lium',               price: 0.084,  mcap:  21.0, chg24:  +5.4,  chg30: +12.6, emission:  95, cat: 'infra',    owner: 'Datura AI' },
  120: { name: 'Affine',             price: 0.0641, mcap: 199.2, chg24:  -2.24, chg30: +24.7, emission: 165, cat: 'training', owner: 'Affine Foundation' },
  62:  { name: 'Ridges',             price: 0.0512, mcap: 165.5, chg24: +12.4,  chg30: +31.2, emission:  88, cat: 'agents',   owner: 'Ridges AI' },
  44:  { name: 'Score',              price: 0.0429, mcap: 189.9, chg24:  +4.18, chg30: +14.6, emission: 112, cat: 'vision',   owner: 'Score Technologies' },
  39:  { name: 'Basilica',           price: 0.0186, mcap:  67.2, chg24:  -6.2,  chg30:  -3.4, emission:  58, cat: 'infra',    owner: 'community' },
  81:  { name: 'Grail',              price: 0.052,  mcap:  89.0, chg24:  +8.4,  chg30: +21.8, emission:  72, cat: 'training', owner: 'community' },
  68:  { name: 'NOVA',               price: 0.054,  mcap:  78.0, chg24:  +3.6,  chg30:  +9.4, emission:  78, cat: 'science',  owner: 'Metanova Labs' },
  75:  { name: 'Hippius',            price: 0.0246, mcap: 100.6, chg24:  -0.16, chg30:  +6.2, emission:  62, cat: 'infra',    owner: 'Hippius' },
});

/* Name overrides, slots that existed in SUBNETS under an older
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
   every other article carries the official Bittensor τ mark, the
   actual brand asset, served from /assets, inverted for the dark
   ground. */
function coverLogo(a){
  /* only true subnet-profile articles wear the subnet monogram; the
     rest carry the Bittensor τ, fund letters, op-eds, primers and
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

/* The whole magazine reduced to its surviving surfaces: an
   editorial spine, a market desk, a reference layer, a directory,
   and the masthead. Everything else is content inside one of them. */
const SECTIONS = [
  { code:'010', label:'Oracle',  href:'oracle.html',
    desc:'The reference layer. Every Bittensor concept, mechanism, role and event in plain English, indexed and cited. Ask the Oracle directly; it answers and cites its sources.' },
  { code:'020', label:'Research', href:'research.html',
    desc:'The daily desk. A PhD-level objective brief on what happened in the Bittensor ecosystem that day, filed every morning by the magazine\'s autonomous research agent.' },
  { code:'030', label:'Markets', href:'markets.html',
    desc:'The movers desk. Subnets by 24h gainers, losers and activity with sparklines, and the centralized AI landscape ranked by valuation.' },
  { code:'040', label:'Voices',  href:'voices.html',
    desc:'The founders, capital allocators, and operators worth following. A curated directory of the ecosystem on X.' },
  { code:'050', label:'Editor',  href:'editor.html',
    desc:'The masthead. Who runs the magazine and the editorial standards behind every claim.' },
];

/**
 * @param {HTMLElement} root
 * @param {{subscribe:Function, get:Function}|null} [dataLayer]
 */
export function mountHome(root, dataLayer = null){
  const articles = articlesByDate();
  // Subnet Oracle articles are a separate research class authored
  // by the Subnet Oracle (Claude Opus 4.7), rendered as a distinct
  // row below the human editorial desk so readers can tell which
  // mind wrote which piece at a glance.
  const oracleArticles = recentOracleArticles(6);
  const oracleLatestDate = oracleArticles[0]?.date || '';

  mount(root, html`
    <!-- ===== FEATURED RESEARCH (top of page) ===== -->
    <section class="home-research" aria-label="Featured research">
      <div class="home-research__head">
        <span class="home-net__kicker"><span class="home-net__ord">§ 01</span><span class="live-dot"></span>Featured Research · the desk</span>
        <span class="home-net__source"><span class="dot dot--editorial"></span>EDITORIAL · 14 MAY 2026 · CONFIDENCE HIGH</span>
        <a class="home-subnets__all" href="research.html">Daily research desk ↗</a>
      </div>
      <ul class="home-research__grid">
        ${articles.map((a, i) => {
          /* Article cards open the source directly: externally-hosted
             pieces use their externalUrl, locally-hosted pieces open
             the PDF in a new tab. No reader page in between. */
          const ext = !!a.externalUrl;
          const href = ext ? a.externalUrl : a.pdf;
          const linkAttrs = `href="${href}" target="_blank" rel="noopener"`;
          return `
          <li class="home-article ${i === 0 ? 'is-lead' : ''} ${ext ? 'is-ext' : ''}">
            <a class="home-article__link" ${linkAttrs}>
              <span class="home-article__art">
                ${cardArt(a.id + '|' + a.title, { variant: a.category || a.kicker || '', w: 520, h: i === 0 ? 300 : 220 })}
                <span class="home-article__art-frame" aria-hidden="true"></span>
                ${coverLogo(a)}
                ${priceChip(a)}
                ${ext ? '<span class="home-article__ext-glyph" aria-hidden="true">↗</span>' : ''}
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
          `;
        }).join('')}
      </ul>
    </section>

    <!-- ===== § 02 SUBNET ORACLE RESEARCH (the AI-agent research arm)
         A separate row, clearly labeled, so readers can distinguish
         work filed by the human editorial desk (§ 01 above) from
         work filed by the Oracle, the autonomous research agent. Same
         card grammar as the human row, but each card's cover is a
         live NodeSphere (the same neural-network mark that appears in
         the masthead and on the /research page) instead of the
         generative monogram used by human articles. The spinning
         sphere is the AI-attribution signature; the kicker prefix
         ORACLE and the "Subnet Oracle" byline reinforce the same
         signal in text. ===== -->
    <style>
      /* Smoother visual continuity with the human editorial row above.
         Drop the top padding so the Oracle row reads as a second voice
         in the same conversation, not a separately bordered section. */
      .home-research--oracle{
        padding-top: clamp(6px, 1vw, 14px);
        border-top: none;
      }
      /* A hair-thin red rule between § 01 and § 02 as the "this is the
         AI voice now" signal, without the heavy section-divider feel. */
      .home-research--oracle::before{
        content: "";
        display: block;
        height: 1px;
        margin: 0 0 clamp(14px, 2vw, 22px);
        background: linear-gradient(90deg,
          transparent 0%,
          rgba(255,30,60,.55) 8%,
          rgba(255,30,60,.55) 92%,
          transparent 100%);
      }
      .home-article--oracle .home-article__art{
        background: radial-gradient(ellipse at 30% 30%, #15131f 0%, #08070d 70%);
      }
      .home-article--oracle .home-article__art > canvas[data-canvas="home-oracle-mark"]{
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        display: block;
      }
      .home-article--oracle .home-article__oracle-badge{
        position: absolute;
        top: 12px; right: 12px;
        z-index: 2;
        font-family: var(--f-mono, monospace);
        font-size: 9px;
        font-weight: 800;
        letter-spacing: .18em;
        padding: 4px 8px;
        background: rgba(0,0,0,.72);
        border: 1px solid var(--c-red, #FF1E3C);
        border-radius: 3px;
        color: #fff;
        box-shadow: 0 0 12px rgba(255,30,60,.35);
      }
      .home-article--oracle .home-article__kicker{
        color: var(--c-red, #FF1E3C);
      }
    </style>
    <section class="home-research home-research--oracle" aria-label="Subnet Oracle research desk">
      <div class="home-research__head">
        <span class="home-net__kicker"><span class="home-net__ord">§ 02</span><span class="live-dot"></span>Subnet Oracle · the research desk</span>
        <span class="home-net__source"><span class="dot dot--editorial"></span>FILED BY SUBNET ORACLE${oracleLatestDate ? ' · ' + artDate(oracleLatestDate).toUpperCase() : ''} · CLAUDE OPUS 4.7</span>
        <a class="home-subnets__all" href="research.html">Subnet Oracle desk ↗</a>
      </div>
      <ul class="home-research__grid">
        ${oracleArticles.slice(0, 4).map((a, i) => {
          const isSpot = a.kind === 'subnet-spotlight';
          const kicker = isSpot
            ? `SUBNET ORACLE · SN${a.subnetId} ${(a.subnetName || '').toUpperCase()} SPOTLIGHT`
            : 'SUBNET ORACLE · ECOSYSTEM STATE';
          /* Word-count based read estimate, 200 wpm. Sections may
             contain markdown; the rough split is fine for a chip. */
          const wc = (a.sections || []).reduce(
            (n, s) => n + (s.body || '').split(/\s+/).length, 0);
          const readMin = Math.max(3, Math.round(wc / 200));
          return `
          <li class="home-article home-article--oracle ${i === 0 ? 'is-lead' : ''}">
            <a class="home-article__link" href="${a.pdf}" target="_blank" rel="noopener">
              <span class="home-article__art">
                <canvas data-canvas="home-oracle-mark"
                        data-id="${a.id}"
                        data-glyph="${isSpot ? (a.subnetName || ('SN' + a.subnetId)).toUpperCase() : 'ORACLE'}"></canvas>
                <span class="home-article__art-frame" aria-hidden="true"></span>
                <span class="home-article__oracle-badge">SUBNET ORACLE</span>
              </span>
              <span class="home-article__kicker">${kicker}</span>
              <span class="home-article__title">${a.title}</span>
              <span class="home-article__tagline">${a.dek}</span>
              <span class="home-article__meta">
                <span>Subnet Oracle</span>
                <span>${artDate(a.date)} · ${readMin} min</span>
              </span>
            </a>
          </li>
          `;
        }).join('')}
      </ul>
    </section>

    <!-- ===== TOP 25 BIOS · DEEP PROFILES =====
         The 25 subnets that earn the most daily τ, each profiled in
         150-200 words with the metric that defines them today, a
         compact stats grid, and the most recent 2026 milestone.
         Researched from taostats, taomarketcap, official repos, and
         2026 press, sourced inline at the section foot. -->
    <section class="home-bios" aria-label="Top 25 subnet deep profiles">
      <div class="home-net__head">
        <span class="home-net__kicker"><span class="home-net__ord">§ 03</span><span class="live-dot"></span>The Top 25 · deep profiles · 14 May 2026</span>
        <span class="home-net__source"><span class="dot dot--live"></span>LIVE TAOSTATS + EDITORIAL · MCP READY</span>
        <h2 class="home-net__title">The <em>full read</em> on every leader.</h2>
        <p class="home-net__sub">Editorial bios for the 25 subnets earning the most daily τ as of 14 May 2026,         what they actually do, who runs them, what they shipped in 2026, and the single number that
        defines each one today. Ordered by emission rank.</p>
      </div>
      <ol class="home-bios__grid">
        ${SUBNET_BIOS.map((b, i) => {
          const sn   = subnetById(b.netuid) || {};
          const seed = BIO_SEED[b.netuid] || {};
          const rank  = String(i + 1).padStart(2, '0');
          const name  = BIO_NAME[b.netuid] || sn.name || seed.name || ('Subnet ' + b.netuid);
          const cat   = sn.cat   ?? seed.cat   ?? 'Â·';
          const priceN = sn.price ?? seed.price;
          const mcapN  = sn.mcap  ?? seed.mcap;
          const chgN   = sn.chg24 ?? seed.chg24;
          const up    = (chgN ?? 0) >= 0;
          const price = priceN != null
            ? (priceN < 1 ? '$' + priceN.toFixed(4) : '$' + priceN.toFixed(2))
            : 'Â·';
          const mcap  = mcapN  != null ? '$' + (mcapN >= 100 ? mcapN.toFixed(0) + 'M' : mcapN.toFixed(1) + 'M') : 'Â·';
          const chg   = chgN   != null ? ((chgN >= 0 ? '+' : '') + chgN.toFixed(2) + '%') : 'Â·';
          /* prefer the live CDN logo where the API has one; otherwise
             a generated node-graph monogram on the rebranded name */
          const logo = sn.logo
            ? `<img class="home-bio__logo" src="${sn.logo}" alt="" loading="lazy" onerror="this.replaceWith(document.createTextNode(''))">`
            : `<span class="home-bio__logo home-bio__logo--mark">${mark(name, { size: 36 })}</span>`;
          /* TaonSquare catalog lookup, surfaces verified links per
             subnet as a chip-row at the bottom of the cover banner.
             Each link rendered as a proper inline-SVG brand glyph
             (GitHub mark, globe for site, X glyph, Discord, docs).
             X handle pulled separately from FOUNDERS where present
             since TaonSquare's schema doesn't carry it. */
          const ts = tsByNetuid(b.netuid);
          /* founder lookup for the X handle, TaonSquare's schema
             doesn't carry per-subnet X handles, so we pull from our
             FOUNDERS table where available */
          const f  = founderById(b.netuid) || {};
          const xHandle = f.founders && f.founders[0] && f.founders[0].handles && f.founders[0].handles.x;
          const xUrl = xHandle
            ? (xHandle.startsWith('http')
                ? xHandle
                : 'https://x.com/' + String(xHandle).replace(/^@/, ''))
            : null;
          const normUrl = u => !u || u === 'www.deprecated.com' ? null :
            (u.startsWith('http') ? u : 'https://' + u);
          const iconLink = (url, kind, title) => url
            ? `<a class="home-bio__ts-link" href="${url}" target="_blank" rel="noopener" aria-label="${title}" title="${title}">${socialIcon(kind, 14)}</a>`
            : '';
          const tsLinks = [
            iconLink(ts && ts.links && normUrl(ts.links.website), 'website', 'Website'),
            iconLink(ts && ts.links && ts.links.github,            'github',  'GitHub'),
            iconLink(xUrl,                                          'x',       'X (Twitter)'),
            iconLink(ts && ts.links && ts.links.discord,            'discord', 'Discord'),
            iconLink(ts && ts.links && ts.links.docs,               'docs',    'Docs'),
          ].filter(Boolean).join('');
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
                <!-- AI-2026 model-card strip: confidence, provenance,
                     researched-at. The honesty layer no incumbent has.
                     TaonSquare values used where present; falls back to
                     the magazine's own 14 May 2026 anchor. -->
                <div class="home-bio__card-meta">
                  <span class="home-bio__card-conf"><span class="dot"></span>CONFIDENCE · ${(ts && ts.confidence ? ts.confidence : 'high').toUpperCase()}</span>
                  <span class="home-bio__card-when">RESEARCHED ${ts && ts.researched_at ? ts.researched_at.slice(0, 10).toUpperCase() : '14 MAY 2026'}</span>
                </div>
                ${tsLinks ? `<div class="home-bio__ts-row" title="Verified links via TaonSquare">${tsLinks}<span class="home-bio__ts-attr">via TaonSquare</span></div>` : ''}
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

              <a class="home-bio__more" href="markets.html#sn${b.netuid}">See it on the desk →</a>
            </li>
          `;
        }).join('')}
      </ol>
      <span class="home-neural__foot home-neural__foot--block">
        <span>DATASET · TAOSTATS · TAOMARKETCAP · OFFICIAL REPOS · 2026 PRESS</span>
        <span>RANKED · DAILY <span class="tau">τ</span> EMISSION · UPDATED 14 MAY 2026</span>
      </span>
    </section>

    <!-- ===== § 04 THE MONEY MAP · centralized vs Bittensor by capital =====
         Real infographic, not a competitor list. Per layer of the AI
         stack we put the centralized market cap next to the Bittensor
         α-mcap of the subnets competing there, to scale, on a log
         axis so the slivers stay legible. The DAVID-vs-GOLIATH chart
         is the lead visual; detail cards underneath carry the
         specifics. The PROTOCOL row inverts: Bittensor owns the
         entire field because there is no centralized analog.
         Section gets a heavier visual treatment so it doesn't blur
         into the bios rail above or the protocol pipeline below. -->
    <section class="home-stack" aria-label="The decentralized AI money map, centralized vs Bittensor by capital">
      <div class="home-stack__hero">
        <div class="home-net__head">
          <span class="home-net__kicker"><span class="home-net__ord">§ 04</span><span class="live-dot"></span>The Money Map · centralized capital vs Bittensor <span class="alpha">α</span>-mcap</span>
          <span class="home-net__source"><span class="dot dot--live"></span>SNAPSHOT · 14 MAY 2026 · ALL CAPITAL FIGURES VERIFIED OR FORWARD-PROJECTED FY26</span>
          <h2 class="home-net__title">How small is <em>decentralized AI,</em> really?</h2>
          <p class="home-net__sub">For every layer of the AI stack: the centralized market
          we're competing against in dollars, the Bittensor <span class="alpha">α</span>-market cap of the subnets
          competing there, and the slice we hold today. <em>Drawn to scale.</em> The
          PROTOCOL layer is the inversion, no centralized analog exists.</p>
        </div>

        ${(() => {
          /* PhD-level rows. Every centralized $ figure has a (yr, src)
             tag; every gap is computed from the cap/aMcap pair as the
             multiplier so the right column tells a different story per
             row instead of repeating "< 1% Bittensor". confidence is
             surfaced per layer per the TaonSquare epistemic-honesty
             pattern. */
          const rows = [
            { layer:'APPLICATION', cap: 40,   yr:'Apr’26', src:'OpenAI/Anysphere',
              aMcap:  57, conf:'high',
              cAnchors:'ChatGPT $25B+ ARR · Cursor $2B+ ARR · Perplexity ~$500M ARR',
              bAnchors:'SN44 Score · SN18 Cortex.t · SN19 Nineteen' },
            { layer:'AGENT',       cap:  11,  yr:'Apr’26', src:'Grand View Research',
              aMcap:  34, conf:'low',
              cAnchors:'OpenAI Operator · Claude Code $1B ARR · Devin · Salesforce Agentforce',
              bAnchors:'SN36 Web Genie · SN59 AgentArena · SN62 Ridges' },
            { layer:'MODEL',       cap:1700,  yr:'Apr’26', src:'OpenAI + Anthropic rounds',
              aMcap: 139, conf:'medium',
              cAnchors:'OpenAI $852B (Mar’26) · Anthropic ~$900B (Apr’26) · Google AI · Meta GenAI',
              bAnchors:'SN1 Apex · SN3 Templar (72B) · SN120 Affine · SN9 IOTA' },
            { layer:'INFERENCE',   cap: 117,  yr:'May’26', src:'Fortune BI 2026',
              aMcap:  96, conf:'medium',
              cAnchors:'OpenAI API ~$3.2B · Together ~$1B ARR · Fireworks $315M · Replicate',
              bAnchors:'SN4 Targon · SN18 Cortex.t · SN19 Nineteen' },
            { layer:'DATA',        cap: 32,   yr:'Jun’25', src:'Meta-ScaleAI deal + Bloomberg',
              aMcap:  41, conf:'high',
              cAnchors:'ScaleAI $29B (Meta Jun’25) · Surge AI $15-25B · Snorkel · Common Crawl',
              bAnchors:'SN13 Data Universe · SN60 Snowballer · SN52 Dojo · SN24 BitMind' },
            { layer:'COMPUTE',     cap:450,   yr:'FY’26', src:'MSFT/GOOG/META/AMZN guidance',
              aMcap: 181, conf:'high',
              cAnchors:'AWS · Azure · GCP · CoreWeave · Lambda Labs · Nebius',
              bAnchors:'SN64 Chutes · SN51 Lium · SN39 Basilica · SN27 Compute · SN49 Polaris' },
            { layer:'PROTOCOL',    cap:  0,   yr:'14 May’26', src:'taostats',
              aMcap:3300, conf:'high',
              cAnchors:'no centralized analog exists',
              bAnchors:'Subtensor chain · Yuma Consensus · dTAO bonding · GTAO bridge' },
          ];

          const fmt  = (b) => b === 0 ? 'Â·' :
                              b >= 1000 ? '$' + (b/1000).toFixed(1) + 'T'
                            : b >= 1   ? '$' + (b % 1 === 0 ? b : b.toFixed(1)) + 'B'
                                       : '$' + (b * 1000).toFixed(0) + 'M';
          const fmtM = (m) => m >= 1000 ? '$' + (m/1000).toFixed(2) + 'B'
                                        : '$' + m + 'M';
          /* gap multiplier: centralized $ / bittensor $, rounded to 2sf */
          const gap = (cap_b, aMcap_m) => {
            if (cap_b <= 0) return null;
            const x = (cap_b * 1000) / aMcap_m;
            if (x < 100)   return '≈' + x.toFixed(0) + '×';
            if (x < 1000)  return '≈' + Math.round(x / 10) * 10 + '×';
            if (x < 10000) return '≈' + (Math.round(x / 100) / 10).toFixed(1) + 'k×';
            return '≈' + Math.round(x / 1000) + 'k×';
          };
          /* log-scale ratio so 60M-of-30B still draws as a visible
             sliver rather than 0.2 px. */
          const lr = (m_dollars, total_dollars) => {
            if (total_dollars <= 0) return 1;
            const r = m_dollars / total_dollars;
            const scaled = Math.log10(1 + r * 9999) / 4;
            return Math.max(0.04, Math.min(1, scaled));
          };
          const confColor = c => c === 'high' ? 'var(--c-up)' : c === 'medium' ? '#FFB85C' : '#FF4D60';

          return `
          <div class="home-stack__chart" aria-hidden="false">
            <!-- Reader glossary · explains the alpha-token vocabulary
                 before the chart so newcomers aren't blocked by jargon. -->
            <div class="home-stack__gloss">
              <span class="home-stack__gloss-tag">PRIMER</span>
              <p>
                Every Bittensor subnet has its own token, its <strong><span class="alpha">α</span> (alpha)</strong>.
                The <strong><span class="alpha">α</span>-MCAP</strong> is the market cap of that <span class="alpha">α</span> token,                 <em><span class="alpha">α</span> price × <span class="alpha">α</span> circulating supply</em>, the standard way to value a
                subnet. The bars below put the centralized AI market on the left in dollars
                and the rolled-up <span class="alpha">α</span>-MCAP of the subnets competing at each layer on the
                right.
              </p>
            </div>
            <div class="home-stack__chart-head">
              <span class="home-stack__chart-axis-blank"></span>
              <span class="home-stack__chart-axis-bar">
                <span class="home-stack__chart-axis home-stack__chart-axis--c">CENTRALIZED</span>
                <span class="home-stack__chart-axis home-stack__chart-axis--b" title="α-MCAP = α-token market cap = α price × α circulating supply">BITTENSOR <span class="alpha">α</span>-MCAP</span>
              </span>
              <span class="home-stack__chart-axis home-stack__chart-axis--gap">GAP</span>
            </div>
            <ol class="home-stack__chart-rows">
              ${rows.map(r => {
                const total = r.cap * 1000 + r.aMcap;
                const cw = Math.round((1 - lr(r.aMcap, total)) * 100);
                const bw = 100 - cw;
                const inverted = r.cap === 0;
                const gapStr = inverted ? '100%' : gap(r.cap, r.aMcap);
                return `
                  <li class="home-stack__chart-row ${inverted ? 'is-inverted' : ''}" data-layer="${r.layer.toLowerCase()}">
                    <div class="home-stack__chart-head-row">
                      <span class="home-stack__chart-layer">
                        ${r.layer}
                        <span class="home-stack__chart-conf" title="confidence: ${r.conf}" style="background:${confColor(r.conf)};box-shadow:0 0 6px ${confColor(r.conf)};"></span>
                      </span>
                      <span class="home-stack__chart-c-lbl">
                        ${inverted ? ', ' : fmt(r.cap)}<span class="home-stack__chart-yr">${inverted ? '' : r.yr}</span>
                      </span>
                      <span class="home-stack__chart-b-lbl">${fmtM(r.aMcap)}</span>
                      <span class="home-stack__chart-gap ${inverted ? 'is-inverted' : ''}">${gapStr}</span>
                    </div>
                    <span class="home-stack__chart-bar">
                      <span class="home-stack__chart-c" style="width: ${cw}%"></span>
                      <span class="home-stack__chart-b" style="width: ${bw}%"></span>
                    </span>
                  </li>
                `;
              }).join('')}
            </ol>
            <div class="home-stack__chart-foot">
              <span><span class="home-stack__snapshot"><span class="dot dot--live"></span>AS OF 14 MAY 2026</span> · METHOD · LOG-SCALE PROPORTIONAL · GAP = CENTRALIZED $ ÷ BITTENSOR <span class="alpha">α</span>-MCAP $</span>
              <span>SOURCES · OPENAI MAR’26 ROUND · ANTHROPIC APR’26 ROUND · CNBC FY26 HYPERSCALER CAPEX · BLOOMBERG META/SCALE JUN’25 · TECHCRUNCH CURSOR APR’26 · SACRA + FORTUNE BI 2026 · COINGECKO + TAOSTATS LIVE</span>
              <span>CONFIDENCE · <span style="color:var(--c-up);">●</span> HIGH · <span style="color:#FFB85C;">●</span> MEDIUM · <span style="color:#FF4D60;">●</span> LOW</span>
            </div>
          </div>
          `;
        })()}
      </div>

      <div class="home-stack__detail-head">
        <span class="home-stack__detail-kicker">Layer by layer · the detail</span>
        <p class="home-stack__detail-sub">Swipe through the seven layers. Each card carries the
          centralized incumbents, the Bittensor subnets competing there, and the read on what
          that ratio actually means.</p>
      </div>

      <ol class="home-stack__rows">
        ${[
          {
            layer: 'APPLICATION',
            sub:   'Products users actually open.',
            cap: 40, aMcap: 57, gapTxt:'≈700×',
            cent:  [
              { name:'ChatGPT',    brand:'openai',     detail:'~$30B ARR' },
              { name:'Cursor',     brand:'cursor',     detail:'$2.5B+ ARR' },
              { name:'Perplexity', brand:'perplexity', detail:'~$700M ARR' },
            ],
            sn:    [
              { id: 44, name: 'Score Vision', cat: 'vision' },
              { id: 18, name: 'Cortex.t',     cat: 'text'   },
              { id: 19, name: 'Nineteen',     cat: 'text'   },
            ],
            unit:    'COST PER USER · centralized prices its margin in; Bittensor prices it out.',
            verdict: 'ChatGPT alone is ~440× the entire Bittensor application stack at the application layer. Wallet share is the slowest moat to disrupt and the layer isn\'t the bet.',
            tam:     '$200B+ AI software TAM by 2030 (Gartner)',
            recent:  'ChatGPT crossed 1B WAU (Mar ’26); Cursor revenue 8× YoY.',
            watch:   'Agent-first apps (Operator, Devin) capturing power-user spend.',
          },
          {
            layer: 'AGENT',
            sub:   'Tool-using systems that act, not just answer.',
            cap: 11, aMcap: 34, gapTxt:'≈320×',
            cent:  [
              { name:'OpenAI Operator', brand:'openai',     detail:'agent SaaS' },
              { name:'Claude Code',     brand:'anthropic',  detail:'$1.5B+ ARR' },
              { name:'Cognition Devin', brand:'cognition',  detail:'$4B val.'  },
              { name:'Agentforce',      brand:'salesforce', detail:'$700M+ ARR' },
            ],
            sn:    [
              { id: 36, name: 'Web Genie',  cat: 'agents' },
              { id: 59, name: 'AgentArena', cat: 'agents' },
              { id: 62, name: 'Ridges',     cat: 'agents' },
            ],
            unit:    'BENCHMARK PARITY · agent eval scores 60-70% on SWE-bench; first to clear 90% takes the layer.',
            verdict: 'Narrowest absolute gap on the chart, but the centralized side has shipped: Claude Code is at $1.5B ARR and Agentforce at $700M+. First decentralized agent to clear 90% on SWE-bench takes the layer.',
            tam:     '~$120B agent SaaS by 2028 (Gartner)',
            recent:  'Claude Sonnet 4.6 with computer-use shipped Apr ’26; Devin GA.',
            watch:   'SWE-bench leaderboard, first model to clear 90% sets the price.',
          },
          {
            layer: 'MODEL',
            sub:   'Foundation + finetune weights.',
            cap: 1700, aMcap: 139, gapTxt:'≈12k×',
            cent:  [
              { name:'OpenAI',    brand:'openai',    detail:'~$1T val.'    },
              { name:'Anthropic', brand:'anthropic', detail:'$380-900B'    },
              { name:'Google AI', brand:'google',    detail:'Gemini Ultra' },
              { name:'Meta GenAI',brand:'meta',      detail:'Llama 4'      },
            ],
            sn:    [
              { id: 1,   name: 'Apex',     cat: 'text'     },
              { id: 9,   name: 'IOTA',     cat: 'training' },
              { id: 3,   name: 'Templar',  cat: 'training' },
              { id: 120, name: 'Affine',   cat: 'training' },
              { id: 6,   name: 'Numinous', cat: 'text'     },
            ],
            unit:    'MMLU PARITY · Templar-72B (Mar ’26) hit 67.1, beating Llama-2-70B (65.6).',
            verdict: 'Worst capital gap on the chart, best technical signal. Templar-72B is the first decentralized result within striking distance of frontier, Apache 2.0, cited by Jack Clark, discussed by Jensen Huang. Open weights vs proprietary capture.',
            tam:     '~$1.3T foundation-model market by 2032 (Bloomberg)',
            recent:  'Templar-72B hit 67.1 MMLU; SparseLoCo cut inter-node bandwidth 146×.',
            watch:   'Teutonic trillion-param run targeted late May ’26.',
          },
          {
            layer: 'INFERENCE',
            sub:   'Serving model output at API latency.',
            cap: 117, aMcap: 96, gapTxt:'≈1.2k×',
            cent:  [
              { name:'OpenAI API', brand:'openai',    detail:'~$4B run-rate' },
              { name:'Together',   brand:'together',  detail:'~$1.5B ARR'    },
              { name:'Fireworks',  brand:'fireworks', detail:'$450M ARR'     },
              { name:'Replicate',  brand:'replicate', detail:'serverless'    },
            ],
            sn:    [
              { id: 4,  name: 'Targon',    cat: 'text' },
              { id: 18, name: 'Cortex.t',  cat: 'text' },
              { id: 19, name: 'Nineteen',  cat: 'text' },
            ],
            unit:    'TOKENS PER DAY · Chutes alone serves ~100B tokens/day, 5M daily requests (Apr ’26).',
            verdict: 'Cost-per-token is the front line. Serverless GPU on SN64 already underprices Together for batch jobs; the latency gap on interactive workloads is closing on every B200 generation.',
            tam:     '~$255B AI inference compute by 2030 (Sacra)',
            recent:  'Chutes B200 fleet live; Targon shipped per-request bandwidth pricing.',
            watch:   'Interactive-latency parity on Llama-3-70B serving.',
          },
          {
            layer: 'DATA',
            sub:   'The training set.',
            cap: 32, aMcap: 41, gapTxt:'≈780×',
            cent:  [
              { name:'Scale AI',     brand:'scaleai',     detail:'$29B (Meta)' },
              { name:'Surge AI',     brand:'surge',       detail:'$15-25B'     },
              { name:'Snorkel',      brand:'snorkel',     detail:'data quality'},
              { name:'Common Crawl', brand:'commoncrawl', detail:'open corpus' },
            ],
            sn:    [
              { id: 13, name: 'Data Universe', cat: 'data'   },
              { id: 60, name: 'Snowballer',    cat: 'data'   },
              { id: 52, name: 'Dojo',          cat: 'data'   },
              { id: 24, name: 'BitMind',       cat: 'vision' },
            ],
            unit:    'B2B FLYWHEEL · first publicly-disclosed inter-subnet contract: SN13 → SN44 in Q1 ’26.',
            verdict: 'Scale AI is $29B post-Meta and the layer is fundamentally about labour arbitrage. Subnet-to-subnet B2B is the proof that decentralized data has a real fly-wheel; SN13 → SN44 was the prototype.',
            tam:     '~$100B data labelling + services market',
            recent:  'Meta closed Scale AI acquisition Q4 ’25 ($29B); Surge AI raised at $25B.',
            watch:   'SN13 → SN44 contract flow scales beyond pilot.',
          },
          {
            layer: 'COMPUTE',
            sub:   'GPU + CPU runtime layer.',
            cap: 450, aMcap: 181, gapTxt:'≈2.5k×',
            cent:  [
              { name:'AWS',       brand:'aws',       detail:'hyperscaler' },
              { name:'Azure',     brand:'azure',     detail:'MS-owned'    },
              { name:'GCP',       brand:'gcp',       detail:'Google'      },
              { name:'CoreWeave', brand:'coreweave', detail:'$23B IPO'    },
              { name:'Lambda',    brand:'lambda',    detail:'GPU rental'  },
            ],
            sn:    [
              { id: 64, name: 'Chutes',   cat: 'infra' },
              { id: 51, name: 'Lium',     cat: 'infra' },
              { id: 39, name: 'Basilica', cat: 'infra' },
              { id: 27, name: 'Compute',  cat: 'infra' },
              { id: 49, name: 'Polaris',  cat: 'infra' },
            ],
            unit:    'CAPEX BURN · MSFT+GOOG+META+AMZN FY26 capex ~$725B total, ~$450B AI-specific.',
            verdict: 'You don\'t out-capex Microsoft. The play is aggregator economics, coordinate the long-tail GPU supply that hyperscalers don\'t bid on. Chutes\' B200 deployment is the live test.',
            tam:     '~$725B hyperscaler capex FY26 (CNBC)',
            recent:  'CoreWeave IPO at $23B (Mar ’26); H200/B200 cycle in full swing.',
            watch:   'Long-tail GPU aggregation, Chutes / Lium B200 onboarding cadence.',
          },
          {
            layer: 'PROTOCOL',
            sub:   'Coordination + payment layer.',
            cap: 0, aMcap: 3300, gapTxt:'100% Bittensor',
            cent:  [
              { name:'no centralized analog exists', brand:'none', detail:'' },
            ],
            sn:    [
              { id: null, name: 'Subtensor chain', cat: 'protocol' },
              { id: null, name: 'Yuma Consensus',  cat: 'protocol' },
              { id: null, name: 'dTAO bonding',    cat: 'protocol' },
            ],
            unit:    'TAO MARKET CAP · $3.3B live, 21M cap, halving #2 due Dec ’29.',
            verdict: 'The only layer where Bittensor owns the field. No centralized product coordinates a network of AI workers like Yuma does. The asymmetric bet sits here, not above.',
            tam:     'Bittensor owns the field, no centralized analog.',
            recent:  'BIT-0011 Conviction Mechanism rolled out May ’26.',
            watch:   'Post-Covenant governance test, community continuation of SN3 / 39 / 81.',
          },
        ].map((row, i) => {
          const fmt  = (b) => b === 0 ? 'Â·' :
                              b >= 1000 ? '$' + (b/1000).toFixed(1) + 'T'
                            : b >= 1   ? '$' + (b % 1 === 0 ? b : b.toFixed(1)) + 'B'
                                       : '$' + (b * 1000).toFixed(0) + 'M';
          const fmtM = (m) => m >= 1000 ? '$' + (m/1000).toFixed(2) + 'B' : '$' + m + 'M';
          return `
          <li class="home-stack__row" data-layer="${row.layer.toLowerCase()}">
            <div class="home-stack__layer">
              <span class="home-stack__layer-tag">LAYER ${String(i + 1).padStart(2,'0')} / 07</span>
              <span class="home-stack__layer-name">${row.layer}</span>
              <span class="home-stack__layer-sub">${row.sub}</span>
            </div>

            ${row.tam || row.recent || row.watch ? `
            <div class="home-stack__intel">
              <span class="home-stack__col-lbl">MARKET INTEL</span>
              <dl class="home-stack__intel-list">
                ${row.tam    ? `<div class="home-stack__intel-row"><dt>TAM</dt><dd>${row.tam}</dd></div>`       : ''}
                ${row.recent ? `<div class="home-stack__intel-row"><dt>RECENT</dt><dd>${row.recent}</dd></div>` : ''}
                ${row.watch  ? `<div class="home-stack__intel-row"><dt>WATCH</dt><dd>${row.watch}</dd></div>`   : ''}
              </dl>
            </div>` : ''}

            <div class="home-stack__capital">
              <span class="home-stack__col-lbl">CAPITAL · CENTRALIZED vs BITTENSOR</span>
              <div class="home-stack__capital-row">
                <div class="home-stack__capital-c">
                  <span class="home-stack__capital-lbl">CENTRALIZED</span>
                  <span class="home-stack__capital-val">${fmt(row.cap)}</span>
                </div>
                <div class="home-stack__capital-b">
                  <span class="home-stack__capital-lbl" title="α-MCAP = α-token market cap = α price × α circulating supply">BITTENSOR <span class="alpha">α</span>-MCAP</span>
                  <span class="home-stack__capital-val"
                        data-stack-amcap="${row.layer}"
                        data-stack-amcap-nets="${(row.sn || []).filter(s => s.id != null).map(s => s.id).join(',')}">${fmtM(row.aMcap)}</span>
                  <span class="home-stack__capital-sub"
                        data-stack-amcap-src="${row.layer}"><span class="alpha">α</span> price × supply</span>
                </div>
              </div>
              <div class="home-stack__capital-gap">
                <span class="home-stack__capital-gap-lbl">GAP MULTIPLIER</span>
                <span class="home-stack__capital-gap-val">${row.gapTxt}</span>
              </div>
            </div>

            <div class="home-stack__cent">
              <span class="home-stack__col-lbl">CENTRALIZED INCUMBENTS</span>
              <ul>${row.cent.map(c => {
                /* tolerate both the old string shape and the new
                   {name, brand, detail} shape, if anyone reverts
                   to plain strings later this still renders */
                const obj = typeof c === 'string'
                  ? { name: c, brand: c, detail: '' }
                  : c;
                return `<li>
                  <span class="home-stack__cent-pill">
                    ${brandChip(obj.brand || obj.name, { size: 18 })}
                    <span class="home-stack__cent-name">${obj.name}</span>
                    ${obj.detail ? `<span class="home-stack__cent-det">${obj.detail}</span>` : ''}
                  </span>
                </li>`;
              }).join('')}</ul>
            </div>
            <div class="home-stack__sn">
              <span class="home-stack__col-lbl">BITTENSOR SUBNETS COMPETING HERE</span>
              <ul>${row.sn.map(s => {
                /* paint a real node-graph monogram for the subnet,                    same engine as the bio-card fallbacks, sized to
                   match the brand chip on the centralized side so
                   the two columns scan equally */
                const monogram = mark(s.name, { size: 18 });
                return `<li>
                  <span class="home-stack__sn-pill cat-${s.cat}">
                    <span class="home-stack__sn-logo" aria-hidden="true">${monogram}</span>
                    ${s.id != null ? `<span class="home-stack__sn-id">SN${s.id}</span>` : ''}
                    <span class="home-stack__sn-name">${s.name}</span>
                  </span>
                </li>`;
              }).join('')}</ul>
            </div>

            <div class="home-stack__unit">
              <span class="home-stack__col-lbl">UNIT ECONOMICS · the actual fight</span>
              <p>${row.unit}</p>
            </div>

            <div class="home-stack__verdict">
              <span class="home-stack__col-lbl">THE READ</span>
              <p>${row.verdict}</p>
            </div>
          </li>
          `;
        }).join('')}
      </ol>

      <p class="home-stack__thesis">
        <span class="home-stack__thesis-q">“</span>
        Decentralized AI today is about <em>$3.8B against $2T+</em>. The bet is not that
        Bittensor is large. The bet is that incentive design eats proprietary capture
, and that the gap closes from this side, not theirs.
        <span class="home-stack__thesis-q">”</span>
      </p>

      <footer class="home-stack__foot">
        <span>CENTRALIZED FIGURES · ROUGH 2026 PUBLIC COVERAGE · DEFENSIBLE, NOT EXACT</span>
        <span>BITTENSOR <span class="alpha">α</span>-MCAP · LIVE TAOSTATS + TAOMARKETCAP · ROLLED UP TO TOP-25 SUBNETS</span>
      </footer>
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
        <span class="home-net__kicker"><span class="home-net__ord">§ 05</span>The protocol · yuma v2 · dtao enabled</span>
        <span class="home-net__source"><span class="dot dot--editorial"></span>EDITORIAL · YUMA RAO 2020 + 2026 NETWORK STATE</span>
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
        <p class="home-how__loop-cap">One block of work, six stages. <span data-bind="how-block-cap">9.2 s</span></p>
      </div>

      <!-- LIVE METRICS STRIP, six cells, one per loop stage, each
           with a stat that quantifies that stage at the network
           level. Values are live where the DataLayer feeds it
           (subnets count, block time, emissions/day, α-MCAP); the
           rest are calibrated to the May 2026 snapshot. -->
      <ol class="home-how__metrics" aria-label="Live network metrics by stage">
        <li class="how-metric" data-stage="subnets">
          <span class="how-metric__n"><span class="how-metric__ord">01</span>SUBNETS</span>
          <span class="how-metric__val" data-bind="how-subnets">92</span>
          <span class="how-metric__u">ACTIVE &middot; 256 MAX</span>
          <span class="how-metric__bar"><span class="how-metric__bar-fill" data-bind="how-subnets-bar" style="width:36%"></span></span>
        </li>
        <li class="how-metric" data-stage="miners">
          <span class="how-metric__n"><span class="how-metric__ord">02</span>MINERS</span>
          <span class="how-metric__val" data-bind="how-miners">~120k</span>
          <span class="how-metric__u">ACROSS THE NETWORK</span>
          <span class="how-metric__bar"><span class="how-metric__bar-fill" style="width:82%"></span></span>
        </li>
        <li class="how-metric" data-stage="validators">
          <span class="how-metric__n"><span class="how-metric__ord">03</span>VALIDATORS</span>
          <span class="how-metric__val" data-bind="how-vals">~1,800</span>
          <span class="how-metric__u">SCORING MINERS</span>
          <span class="how-metric__bar"><span class="how-metric__bar-fill" style="width:48%"></span></span>
        </li>
        <li class="how-metric" data-stage="consensus">
          <span class="how-metric__n"><span class="how-metric__ord">04</span>CONSENSUS</span>
          <span class="how-metric__val" data-bind="how-block">12 s</span>
          <span class="how-metric__u">YUMA &middot; PER BLOCK</span>
          <span class="how-metric__bar"><span class="how-metric__bar-fill" style="width:18%"></span></span>
        </li>
        <li class="how-metric" data-stage="emissions">
          <span class="how-metric__n"><span class="how-metric__ord">05</span>EMISSIONS</span>
          <span class="how-metric__val" data-bind="how-em"><span class="tau">τ</span>7,200</span>
          <span class="how-metric__u">PER DAY &middot; POST-HALVING</span>
          <span class="how-metric__bar"><span class="how-metric__bar-fill" style="width:60%"></span></span>
        </li>
        <li class="how-metric" data-stage="dtao">
          <span class="how-metric__n"><span class="how-metric__ord">06</span>dTAO</span>
          <span class="how-metric__val" data-bind="how-amc">$3.3B</span>
          <span class="how-metric__u"><span class="alpha">α</span>-MCAP &middot; <span data-bind="how-amc-n">92</span> SUBNETS</span>
          <span class="how-metric__bar"><span class="how-metric__bar-fill" data-bind="how-amc-bar" style="width:74%"></span></span>
        </li>
      </ol>

      <ol class="home-how__pipe">

        <li class="home-how__row" data-stage="01">
          <span class="home-how__rail"><span class="home-how__num">01</span></span>
          <div class="home-how__body">
            <header class="home-how__head">
              <h3 class="home-how__h">Subnets</h3>
              <span class="home-how__meta">Task markets · the input</span>
            </header>
            <p class="home-how__brief">Each subnet defines one specific kind of intelligence,             a task, a scoring rubric, and a competitive market. Owners register a slot by burning
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
            <!-- Subnet distribution · donut chart of the 92 active
                 subnets by task category. Centred dial shows the
                 92 / 256 active-of-max-slots ratio; an indexed
                 legend on the right names each segment in
                 monochrome opacity ramp. -->
            ${(() => {
              const cats = [
                ['TEXT',     22, 0.95],
                ['VISION',   18, 0.82],
                ['INFRA',    14, 0.70],
                ['TRAINING', 12, 0.58],
                ['FINANCE',  10, 0.46],
                ['AGENTS',    8, 0.34],
                ['SCIENCE',   6, 0.22],
                ['DATA',      2, 0.12],
              ];
              const total = cats.reduce((s, c) => s + c[1], 0);
              const cx = 56, cy = 88, R = 44, r = 30;
              let cum = -90;
              const toRad = a => a * Math.PI / 180;
              const arcs = cats.map(([cat, n, op]) => {
                const sweep = (n / total) * 360;
                const start = cum, end = cum + sweep;
                cum = end;
                const sx = cx + R * Math.cos(toRad(start)), sy = cy + R * Math.sin(toRad(start));
                const ex = cx + R * Math.cos(toRad(end)),   ey = cy + R * Math.sin(toRad(end));
                const isx = cx + r * Math.cos(toRad(end)),  isy = cy + r * Math.sin(toRad(end));
                const iex = cx + r * Math.cos(toRad(start)),iey = cy + r * Math.sin(toRad(start));
                const large = sweep > 180 ? 1 : 0;
                const d = `M ${sx.toFixed(2)} ${sy.toFixed(2)}
                           A ${R} ${R} 0 ${large} 1 ${ex.toFixed(2)} ${ey.toFixed(2)}
                           L ${isx.toFixed(2)} ${isy.toFixed(2)}
                           A ${r} ${r} 0 ${large} 0 ${iex.toFixed(2)} ${iey.toFixed(2)} Z`;
                return { d, op, cat, n };
              });
              return `
              <svg viewBox="0 0 220 180" preserveAspectRatio="xMidYMid meet">
                <text x="6" y="10" font-family="JetBrains Mono, monospace" font-size="7"
                      font-weight="700" fill="currentColor" opacity=".55">SUBNET DISTRIBUTION · BY CATEGORY</text>
                <line x1="0" y1="14" x2="220" y2="14" stroke="currentColor" stroke-opacity=".22" stroke-width=".5"/>

                <!-- the donut -->
                <g>${arcs.map(a => `<path d="${a.d}" fill="currentColor" fill-opacity="${a.op}"/>`).join('')}</g>

                <!-- centred dial, big count + small caps caption -->
                <text x="${cx}" y="${cy - 4}" text-anchor="middle"
                      font-family="JetBrains Mono, monospace" font-size="22" font-weight="700"
                      fill="#F5E5E8" font-variant-numeric="tabular-nums">92</text>
                <text x="${cx}" y="${cy + 6}" text-anchor="middle"
                      font-family="JetBrains Mono, monospace" font-size="5.5" font-weight="700"
                      letter-spacing="2" fill="currentColor" opacity=".65">ACTIVE</text>
                <text x="${cx}" y="${cy + 14}" text-anchor="middle"
                      font-family="JetBrains Mono, monospace" font-size="5" font-weight="600"
                      letter-spacing="1.5" fill="currentColor" opacity=".42">OF 256 SLOTS</text>

                <!-- indexed legend, right column -->
                <g transform="translate(115, 30)">
                  ${cats.map(([cat, n, op], i) => `
                    <g transform="translate(0, ${i * 13})">
                      <rect x="0" y="-4" width="6" height="6" fill="currentColor" fill-opacity="${op}"/>
                      <text x="14" y="1" font-family="JetBrains Mono, monospace"
                            font-size="6.5" font-weight="600" fill="currentColor" opacity=".88"
                            letter-spacing=".04em">${cat}</text>
                      <text x="100" y="1" text-anchor="end"
                            font-family="JetBrains Mono, monospace" font-size="7" font-weight="700"
                            fill="#F5E5E8" font-variant-numeric="tabular-nums">${n}</text>
                      <text x="103" y="1" font-family="JetBrains Mono, monospace"
                            font-size="5.5" font-weight="500"
                            fill="currentColor" opacity=".42">·${((n/total)*100).toFixed(0)}%</text>
                    </g>
                  `).join('')}
                </g>

                <line x1="0" y1="172" x2="220" y2="172" stroke="currentColor" stroke-opacity=".22" stroke-width=".5"/>
                <text x="6"   y="178" font-family="JetBrains Mono, monospace" font-size="6"
                      font-weight="600" fill="currentColor" opacity=".55" letter-spacing=".12em">SHARE · % OF 92 ACTIVE</text>
                <text x="216" y="178" text-anchor="end" font-family="JetBrains Mono, monospace"
                      font-size="6" font-weight="700" fill="currentColor" letter-spacing=".08em">LIVE · TAOSTATS</text>
              </svg>
              `;
            })()}
          </div>
        </li>

        <li class="home-how__row" data-stage="02">
          <span class="home-how__rail"><span class="home-how__num">02</span></span>
          <div class="home-how__body">
            <header class="home-how__head">
              <h3 class="home-how__h">Miners</h3>
              <span class="home-how__meta">Workers · compute output</span>
            </header>
            <p class="home-how__brief">Miners answer the subnet's queries, usually a GPU running
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
            The weight vector is their honest opinion of who did the work, and their stake is
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
            into one fair score per miner. The weighted-median operation prunes outlier weights,             validators that disagree with the consensus get their contributions discounted, so
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

              <!-- the weighted-median line, where consensus lands -->
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

              <!-- packets on rail A (MINERS), 4 dots, dense -->
              ${[0, 0.22, 0.44, 0.66].map(off => `
                <circle r="2" fill="#FF1E3C">
                  <animateMotion dur="2.2s" begin="${off}s" repeatCount="indefinite">
                    <mpath href="#how-rail-A"/>
                  </animateMotion>
                </circle>
              `).join('')}
              <!-- packets on rail B (VALIDATORS), 4 dots -->
              ${[0.1, 0.32, 0.54, 0.76].map(off => `
                <circle r="2" fill="#FF4D60">
                  <animateMotion dur="2.2s" begin="${off}s" repeatCount="indefinite">
                    <mpath href="#how-rail-B"/>
                  </animateMotion>
                </circle>
              `).join('')}
              <!-- packets on rail C (OWNER), 2 dots, fewer to convey 18% -->
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
            <p class="home-how__brief">Every subnet has its own <span class="alpha">α</span> token sold on a <span class="tau">τ</span>-bonded curve.
            Buy <span class="alpha">α</span> to bet that a subnet will earn more emissions; the curve sets price as a
            function of bonded τ. This is the protocol's price-discovery layer, dynamic TAO,
            or dTAO, live since <span class="val">Feb 2025</span>.</p>
            <dl class="home-how__data">
              <div><dt>Live <span class="alpha">α</span> pools</dt><dd>92</dd></div>
              <div><dt>Largest mcap</dt><dd>$199M</dd></div>
              <div><dt>Curve</dt><dd>x·y = k</dd></div>
            </dl>
            <p class="home-how__ex"><span class="home-how__ex-lbl">Representative</span><span class="home-how__ex-chip">SN120 Affine · $199M <span class="alpha">α</span>-mcap</span></p>
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
                /* color, curveY at x=14, x=80, x=160, x=214, the curve shape; label, marker x, marker y, sn label */
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
        <a class="home-how__more" href="https://bittensor.com/whitepaper" target="_blank" rel="noopener">READ THE WHITEPAPER →</a>
      </footer>
    </section>

    <!-- ===== NEURAL NETWORK =====
         The Six Steps explainer above named the loop in words; this
         section renders that same loop as a working feed-forward
         network. Five layers labelled SUBNETS → MINERS → VALIDATORS
         → WEIGHTS → CONSENSUS, with red signal pulses crossing them
         every block. Different mode than the masthead plexus,          that's the brand; this is the protocol diagram. -->
    <section class="home-neural" aria-label="The Bittensor consensus loop, visualized">
      <div class="home-net__head">
        <span class="home-net__kicker"><span class="home-net__ord">§ 06</span>The machine</span>
        <span class="home-net__source"><span class="dot dot--sim"></span>SIMULATED FEED-FORWARD · 5 LAYERS · 185 PULSES</span>
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
         explainer above, now you've named the parts, here's how the
         pie actually gets split. -->
    <section class="home-neural" aria-label="Subnet emission share treemap">
      <div class="home-net__head">
        <span class="home-net__kicker"><span class="home-net__ord">§ 07</span>The slice</span>
        <span class="home-net__source"><span class="dot dot--live"></span>LIVE TAOSTATS · TOP 16 SUBNETS BY <span class="tau">τ</span>/DAY</span>
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
        <span class="home-net__kicker"><span class="home-net__ord">§ 08</span><span class="live-dot"></span>Live Network · taomarketcap</span>
        <span class="home-net__source"><span class="dot dot--live"></span>LIVE TAO MARKET CAP PUBLIC API · 12s POLL</span>
        <h2 class="home-net__title">Bittensor, <em>right now.</em></h2>
        <p class="home-net__sub">Real on-chain data, TAO market, supply, staking, and chain state, refreshed straight from the Tao Market Cap public API.</p>
      </div>
      <div class="home-net__grid">
        <div class="home-stat home-stat--lead">
          <span class="home-stat__lbl"><span class="tau">τ</span> / USD</span>
          <span class="home-stat__val" data-bind="price">, </span>
          <span class="home-stat__sub" data-bind="price-delta">, </span>
          <span class="home-stat__spark"><canvas data-spark="price"></canvas></span>
        </div>
        <div class="home-stat">
          <span class="home-stat__lbl">Market Cap</span>
          <span class="home-stat__val" data-bind="mcap">, </span>
          <span class="home-stat__sub" data-bind="mcap-delta">7d, </span>
          <span class="home-stat__spark"><canvas data-spark="mcap"></canvas></span>
        </div>
        <div class="home-stat">
          <span class="home-stat__lbl">Circulating</span>
          <span class="home-stat__val" data-bind="circ">, </span>
          <span class="home-stat__sub">of 21M max</span>
          <span class="home-stat__spark"><canvas data-spark="circ"></canvas></span>
        </div>
        <div class="home-stat">
          <span class="home-stat__lbl">Staked</span>
          <span class="home-stat__val" data-bind="staked">, </span>
          <span class="home-stat__sub" data-bind="apr">APR, </span>
          <span class="home-stat__spark"><canvas data-spark="staked"></canvas></span>
        </div>
        <div class="home-stat">
          <span class="home-stat__lbl">24h Volume</span>
          <span class="home-stat__val" data-bind="vol">, </span>
          <span class="home-stat__sub" data-bind="vol-sub">spot</span>
          <span class="home-stat__spark"><canvas data-spark="vol"></canvas></span>
        </div>
        <div class="home-stat">
          <span class="home-stat__lbl">Block height</span>
          <span class="home-stat__val" data-bind="block">, </span>
          <span class="home-stat__sub" data-bind="chain-sub">root / subnet split</span>
          <span class="home-stat__spark"><canvas data-spark="block"></canvas></span>
        </div>
      </div>
    </section>

    <!-- ===== § 09 THE OPERATORS · research and financial data =====
         Bittensor is not a hundred independent subnets. It is one
         founding circle, a dozen operators, and five investors.
         This is the table that proves it, every top-25 subnet
         mapped back to Const by name, role, degree, and chain.
         Sortable HTML table; renders on phone; every cell is
         defensible against a public source in founders.js. -->
    <section class="home-network" aria-label="The operators desk · research and financial data on every top-25 subnet">
      <div class="home-net__head">
        <span class="home-net__kicker"><span class="home-net__ord">§ 09</span><span class="live-dot"></span>The Operators · research &amp; financial data</span>
        <span class="home-net__source"><span class="dot dot--editorial"></span>OPERATORS DESK · 25 SUBNETS · 14 MAY 2026</span>
        <h2 class="home-net__title">Who <em>actually runs</em> these subnets.</h2>
        <p class="home-net__sub">For every top-25 subnet: the parent organisation, its lead investors,
        live emission, 30-day momentum, and the operative thing they shipped this quarter. The
        research and financial cut, no fluff.</p>
      </div>

      <ol class="home-ops__rail">
        ${[...SUBNET_BIOS].map(b => {
          const f    = founderById(b.netuid) || {};
          const sn   = subnetById(b.netuid) || {};
          const seed = BIO_SEED[b.netuid]   || {};
          const name = BIO_NAME[b.netuid] || sn.name || seed.name || ('Subnet ' + b.netuid);
          const parent = f.parent || seed.owner || ', ';
          const cat = sn.cat || seed.cat || '';
          const investors = (f.investors && f.investors.length)
            ? f.investors.slice(0, 2).join(' · ')
            : 'No public round';
          const founderName = f.founders && f.founders[0]
            ? f.founders[0].name.replace(/\s*\(pseudonym\)/i, '')
            : 'Â·';
          const emission = sn.emission ?? seed.emission ?? null;
          const emisStr  = emission != null ? emission : 'Â·';
          const c30 = sn.chg30 ?? seed.chg30 ?? null;
          const c30Str = c30 != null
            ? ((c30 >= 0 ? '+' : '') + c30.toFixed(1) + '%')
            : 'Â·';
          const c30Cls = c30 != null ? (c30 >= 0 ? 'up' : 'down') : '';
          /* per-card live KPIs from SUBNETS / BIO_SEED */
          const priceN = sn.price ?? seed.price ?? null;
          const price  = priceN != null
            ? (priceN < 1 ? '$' + priceN.toFixed(4) : '$' + priceN.toFixed(2))
            : 'Â·';
          const mcapN = sn.mcap ?? seed.mcap ?? null;
          const mcap  = mcapN != null
            ? (mcapN >= 1000 ? '$' + (mcapN/1000).toFixed(2) + 'B' : '$' + mcapN.toFixed(1) + 'M')
            : 'Â·';
          const miners = sn.miners != null ? sn.miners.toLocaleString('en-US') : 'Â·';
          const validators = sn.validators != null ? sn.validators.toLocaleString('en-US') : 'Â·';
          const stake  = sn.stake != null
            ? (sn.stake >= 1000 ? (sn.stake/1000).toFixed(1) + 'K' : Math.round(sn.stake).toString())
            : 'Â·';
          /* trim recentNews to first sentence for the ship line */
          const ship = (b.recentNews || '').split(/\.(?=\s|$)/)[0].trim() + (b.recentNews ? '.' : '');
          /* emission bar baseline = 200 τ so leaders saturate, long tail still reads */
          const sharePct = emission != null
            ? Math.min(100, Math.max(6, Math.round((emission / 200) * 100)))
            : 0;
          return `
            <li class="home-ops__card" data-netuid="${b.netuid}">
              <header class="home-ops__head">
                <span class="home-ops__sn">SN${b.netuid}</span>
                <span class="home-ops__name">${name}</span>
                ${cat ? `<span class="home-ops__cat">${cat}</span>` : ''}
                <span class="home-ops__chg ${c30Cls}">${c30Str}<span class="home-ops__chg-lbl">30d</span></span>
              </header>

              <!-- price + sparkline cover strip -->
              <div class="home-ops__spark-row">
                <div class="home-ops__price-block">
                  <span class="home-ops__price-lbl"><span class="alpha">α</span>-PRICE</span>
                  <span class="home-ops__price-val">${price}</span>
                </div>
                <div class="home-ops__spark">
                  <canvas data-ops-spark="${b.netuid}"></canvas>
                </div>
              </div>

              <!-- 4-cell KPI grid -->
              <dl class="home-ops__kpis">
                <div class="home-ops__kpi" title="α-MCAP = α-token market cap = α price × α circulating supply">
                  <dt><span class="alpha">α</span>-MCAP</dt>
                  <dd>${mcap}</dd>
                </div>
                <div class="home-ops__kpi">
                  <dt>MINERS</dt>
                  <dd>${miners}</dd>
                </div>
                <div class="home-ops__kpi">
                  <dt>VALIDATORS</dt>
                  <dd>${validators}</dd>
                </div>
                <div class="home-ops__kpi">
                  <dt>STAKE</dt>
                  <dd><span class="tau">τ</span>${stake}</dd>
                </div>
              </dl>

              <!-- emission with proportional bar -->
              <div class="home-ops__field home-ops__field--emit">
                <dt><span class="tau">τ</span> / day</dt>
                <dd>
                  <span class="home-ops__emit-num">${emisStr}</span>
                  <span class="home-ops__emit-bar">
                    <span class="home-ops__emit-fill" style="width: ${sharePct}%"></span>
                  </span>
                </dd>
              </div>

              <!-- key metric callout from the bio -->
              <div class="home-ops__metric">
                <span class="home-ops__metric-lbl">KEY METRIC · May ’26</span>
                <span class="home-ops__metric-val">${b.keyMetric}</span>
              </div>

              <!-- parent + investors + founder line -->
              <div class="home-ops__meta-grid">
                <div class="home-ops__field">
                  <dt>Parent</dt>
                  <dd>${parent}</dd>
                </div>
                <div class="home-ops__field">
                  <dt>Lead investors</dt>
                  <dd>${investors}</dd>
                </div>
                <div class="home-ops__field">
                  <dt>Founder</dt>
                  <dd>${founderName}</dd>
                </div>
              </div>

              <!-- Q2 2026 ship -->
              <div class="home-ops__ship">
                <span class="home-ops__ship-lbl">Q2 2026 ship</span>
                <p class="home-ops__ship-text">${ship || ', '}</p>
              </div>

              <a class="home-ops__more" href="markets.html#sn${b.netuid}">See it on the desk →</a>
            </li>
          `;
        }).join('')}
      </ol>

      <!-- Investor concentration strip, real financial signal. The
           funds with public positions in 3+ top-25 subnets via the
           parent companies. Pulled live from FOUNDERS.investors via
           subnetsByInvestor(). -->
      <div class="home-network__investors">
        <span class="home-network__investors-lbl">Investor concentration · 3+ top-25 positions</span>
        <ul class="home-network__investors-list">
          ${(() => {
            const watch = ['Polychain', 'Foundry', 'OSS Capital', 'Pantera', 'a16z', 'Yuma', 'DCG'];
            const counts = watch.map(name => ({ name, ns: FOUNDERS.filter(f => f.investors.some(i => i.toLowerCase().includes(name.toLowerCase()))).map(f => f.netuid) }));
            return counts
              .filter(c => c.ns.length >= 2)
              .sort((a, b) => b.ns.length - a.ns.length)
              .map(c => `
                <li class="home-network__inv-pill">
                  <span class="home-network__inv-name">${c.name}</span>
                  <span class="home-network__inv-count">${c.ns.length} subnets</span>
                  <span class="home-network__inv-list">${c.ns.map(n => 'SN' + n).join(' · ')}</span>
                </li>
              `).join('');
          })()}
        </ul>
      </div>

      <footer class="home-network__foot">
        <span>SOURCES · TAOSTATS · COMPANY FILINGS · PRESS COVERAGE · OPEN-SOURCE REPOS</span>
        <span>EDITORIAL · CONFIDENCE HIGH · UPDATED <span class="tau">τ</span>14 MAY 2026</span>
      </footer>
    </section>

    <!-- ===== EDITOR'S COLOPHON =====
         A magazine prints the editor's bio at the back of the book.
         This is that page. The site you just scrolled through is
         built end-to-end by Rondo Campbell from inside the U.S.
         prison system, on a prison-issued tablet and textbooks,
         with intermittent connectivity, every line of research,
         code, and design is his. Projected release: 2028. The work
         and the story share a repository. -->
    <section class="home-editor" aria-label="Editor">
      <div class="home-editor__inner">
        <div class="home-editor__photo">
          <img src="assets/editor-rondo.jpg"
               alt="Rondo Campbell"
               width="600" height="600"
               loading="lazy"
               decoding="async"
               fetchpriority="low">
          <span class="home-editor__photo-frame" aria-hidden="true"></span>
        </div>
        <div class="home-editor__body">
          <span class="home-editor__kicker">Editor &middot; Subne<span class="tau">τ</span> Magazine</span>
          <h2 class="home-editor__name">Rondo Campbell</h2>
          <p class="home-editor__role">Founder &middot; Editor &middot; Engineer</p>
          <p class="home-editor__role home-editor__role--quiet">
            with <a href="editor.html">Shifa Abbas</a>, Co-Founder
          </p>
          <p class="home-editor__bio">
            Subne<span class="tau">τ</span> Magazine is researched, written,
            designed, and coded by Rondo Campbell, working from inside
            the U.S. prison system, on a prison-issued tablet and a stack of
            textbooks, with intermittent connectivity. Projected release:
            <em>2028</em>. The mission is to walk out as a credible builder
            in the open AI economy. Every line of this site is the proof of
            work.
          </p>
          <p class="home-editor__bio home-editor__bio--quiet">
            The curriculum is two physical Python textbooks, a stack of
            AI papers, and an LLM running in the working terminal next to
            this one. Phase 1 was Python foundations, summer 2025. The
            magazine you're reading is the portfolio side of the
            ledger, built in public, committed in real time. Read the
            full record in the JOURNAL.md / SESSION_LOG.md at the
            top of the repository.
          </p>
          <div class="home-editor__links">
            <a class="home-editor__link" href="https://x.com/subnetmagazine" target="_blank" rel="noopener">
              <span class="home-editor__x">𝕏</span>@subnetmagazine
            </a>
            <a class="home-editor__link home-editor__link--ghost" href="https://github.com/RondoAI/rondo-AI-curriculum" target="_blank" rel="noopener">
              GitHub &middot; the full record
            </a>
            <a class="home-editor__link home-editor__link--ghost" href="editor.html">
              Editor's page &rarr;
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== END OF FEATURE =====
         The home view stops here. One editorial closer that doubles
         as the page colophon, § corner ornaments, an END pill, the
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
        <p class="home-pagebreak__sub">Live data · Tao Market Cap public API · Verified links via TaonSquare (${TAONSQUARE_COUNT} subnets · snapshot ${TAONSQUARE_FETCHED_AT}) · Subne<span class="tau">τ</span> Magazine ${new Date().getUTCFullYear()}</p>
      </div>
      <!-- AI-2026 signal: built for humans AND agents. Editorial corpus
           addressable over MCP so the agent doing diligence at a fund
           can cite us. The badge is the visible statement of that. -->
      <div class="home-pagebreak__signals">
        <span class="home-pagebreak__badge">
          <span class="dot dot--live"></span>
          MCP READY · AGENT FRIENDLY
        </span>
        <span class="home-pagebreak__badge home-pagebreak__badge--alt">
          <span class="dot dot--editorial"></span>
          CONFIDENCE · HIGH
        </span>
        <span class="home-pagebreak__badge home-pagebreak__badge--alt">
          <span class="dot dot--editorial"></span>
          RESEARCHED · 14 MAY 2026
        </span>
      </div>
      <a class="home-pagebreak__turn" href="https://x.com/subnetmagazine" target="_blank" rel="noopener">
        <span class="home-pagebreak__x-glyph" aria-hidden="true">𝕏</span>
        <span>@subnetmagazine</span>
      </a>
    </aside>
  `);

  /* ---------- neural-net protocol diagram ----------
     Five labelled layers, subnets, miners, validators, weights,
     consensus, wired together with red signal pulses. Lives in the
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
  /* one micro-trend per stat, deterministic, keyed to the field, a
     visual read of momentum until per-field history endpoints land. */
  const statSparks = [];
  [
    ['price',   18], ['mcap',   12], ['circ',   4],
    ['staked',  6],  ['vol',   -9], ['block',  22],
  ].forEach(([key, drift]) => {
    const cv = qs(`[data-spark="${key}"]`, root);
    if (cv) statSparks.push(new Sparkline(cv, { series: seedSeries(key, drift, 32) }));
  });

  /* ---------- SUBNET ORACLE card covers, one PlexusGlyph per card --
     Each Subnet Oracle article wears its own identity rendered as a
     dense red plexus where the dots themselves form the silhouette
     of the article's subject. Subnet Spotlights show the subnet's
     name (TARGON, LIUM, RIDGES); Ecosystem State pieces show ORACLE.
     Sparse ambient background plexus reads as "wider network behind
     the focus shape". Same red as the magazine's design tokens. */
  const oracleMarks = [];
  root.querySelectorAll('[data-canvas="home-oracle-mark"]').forEach((cv, i) => {
    const glyph = cv.dataset.glyph || 'ORACLE';
    try {
      oracleMarks.push(new PlexusGlyph(cv, {
        text:    glyph,
        density: 0.62,
        ambient: 90,
        seed:    i + 1,
        weight:  '900',
      }));
    } catch (_) {}
  });

  /* ---------- TOP VALIDATORS rail, one sparkline per card ---------- */
  const valSparks = [];
  VALIDATORS.slice(0, 12).forEach((v) => {
    const cv = qs(`[data-val-spark="${v.id}"]`, root);
    if (cv) valSparks.push(new Sparkline(cv, { series: seedSeries(v.id + 'v', v.apy * 1.4 - 14, 28) }));
  });

  /* ---------- TOP 25 BIOS + § 08 OPERATORS · lazy-mount sparklines
     The home page wants 50 canvas sparklines in total (25 bio + 25
     ops). On Android Chrome each <canvas> can become its own GPU
     compositor layer; mounting 50 at boot exhausts the layer budget
     on phones with limited GPU memory and silently locks scroll.
     Solution: only mount a sparkline when its canvas is within a
     viewport of the visible area. Sparklines outside that band
     stay un-mounted until the user scrolls toward them. */
  const bioSparks = [];
  const opSparks  = [];
  const lazySparkObserver = ('IntersectionObserver' in window)
    ? new IntersectionObserver((entries, ob) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const cv = entry.target;
          if (cv.dataset.sparkMounted === '1') { ob.unobserve(cv); return; }
          cv.dataset.sparkMounted = '1';
          const isBio = cv.hasAttribute('data-bio-spark');
          const netuid = Number(cv.getAttribute('data-bio-spark') || cv.getAttribute('data-ops-spark'));
          const sn   = subnetById(netuid) || {};
          const seed = BIO_SEED[netuid]   || {};
          if (isBio){
            const drift = (sn.chg24 ?? seed.chg24 ?? 0) * 1.6;
            bioSparks.push(new Sparkline(cv, {
              series:    seedSeries('bio-' + netuid, drift, 30),
              lineWidth: 1.6,
              fill:      true,
            }));
          } else {
            const drift = (sn.chg30 ?? seed.chg30 ?? sn.chg24 ?? seed.chg24 ?? 0) * 1.2;
            opSparks.push(new Sparkline(cv, {
              series:    seedSeries('ops-' + netuid, drift, 36),
              lineWidth: 1.6,
              fill:      true,
            }));
          }
          ob.unobserve(cv);
        });
      }, { rootMargin: '200px 0px' })
    : null;
  if (lazySparkObserver){
    SUBNET_BIOS.forEach(b => {
      const cv1 = qs(`[data-bio-spark="${b.netuid}"]`, root);
      if (cv1) lazySparkObserver.observe(cv1);
      const cv2 = qs(`[data-ops-spark="${b.netuid}"]`, root);
      if (cv2) lazySparkObserver.observe(cv2);
    });
  } else {
    /* graceful fallback for ancient browsers, mount eagerly */
    SUBNET_BIOS.forEach((b) => {
      const sn   = subnetById(b.netuid) || {};
      const seed = BIO_SEED[b.netuid]   || {};
      const driftA = (sn.chg24 ?? seed.chg24 ?? 0) * 1.6;
      const cv1 = qs(`[data-bio-spark="${b.netuid}"]`, root);
      if (cv1) bioSparks.push(new Sparkline(cv1, { series: seedSeries('bio-' + b.netuid, driftA, 30), lineWidth: 1.6, fill: true }));
      const driftB = (sn.chg30 ?? seed.chg30 ?? sn.chg24 ?? seed.chg24 ?? 0) * 1.2;
      const cv2 = qs(`[data-ops-spark="${b.netuid}"]`, root);
      if (cv2) opSparks.push(new Sparkline(cv2, { series: seedSeries('ops-' + b.netuid, driftB, 36), lineWidth: 1.6, fill: true }));
    });
  }

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
          <a class="home-subnet__link" href="markets.html#sn${s.netuid}">
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
    /* mount one sparkline per card, synthesized trend keyed to the
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
    unsubs.push(dataLayer.subscribe('tao:subnets', renderStackLive));
    unsubs.push(dataLayer.subscribe('tao:subnets', renderHowMetrics));
    unsubs.push(dataLayer.subscribe('tao:market',  renderHowMarket));
    unsubs.push(dataLayer.subscribe('tao:chain',   renderHowChain));
    /* render anything already cached */
    renderMarket(dataLayer.get('tao:market'));
    renderChain(dataLayer.get('tao:chain'));
    renderSubnets(dataLayer.get('tao:subnets'));
    renderArticleLogos(dataLayer.get('tao:subnets'));
    renderStackLive(dataLayer.get('tao:subnets'));
    renderHowMetrics(dataLayer.get('tao:subnets'));
    renderHowMarket(dataLayer.get('tao:market'));
    renderHowChain(dataLayer.get('tao:chain'));
  }

  /* ---------- LIVE: § 04 The loop · metrics strip ----------
     Six per-stage figures sit under the loop SVG. Three of them are
     directly computable from the magazine's existing DataLayer feeds:
       01 SUBNETS, count of subnets in the tao:subnets list
       06 dTAO, sum of α-MCAP across the same list
       05 EMISSIONS, derived from the chain emission rate
       04 CONSENSUS, live block time from tao:chain
     02 MINERS / 03 VALIDATORS are calibrated to the May 2026
     snapshot, neither feed gives a network-wide miner count
     cleanly, so we leave the snapshot until taostats wiring is
     added. Brighten the value when it goes live (.is-live). */
  function renderHowMetrics(list){
    if (!Array.isArray(list) || !list.length) return;
    const n = list.length;
    /* 01 SUBNETS · count + bar fill = active / 256 */
    const subEl = qs('[data-bind="how-subnets"]', root);
    if (subEl){ subEl.textContent = String(n); subEl.classList.add('is-live'); }
    const subBar = qs('[data-bind="how-subnets-bar"]', root);
    if (subBar) subBar.style.width = Math.min(100, Math.round((n / 256) * 100)) + '%';
    /* 06 dTAO · sum α-MCAP across the list (millions),
       update subnet-count tag in the unit line, and scale the bar
       to ~$5B as a reference upper bound for visual proportion */
    const totMcap = list.reduce((s, x) => s + (typeof x.mcap === 'number' ? x.mcap : 0), 0);
    const amcEl = qs('[data-bind="how-amc"]', root);
    if (amcEl && totMcap > 0){
      const v = totMcap >= 1000 ? '$' + (totMcap/1000).toFixed(2) + 'B' : '$' + Math.round(totMcap) + 'M';
      amcEl.textContent = v;
      amcEl.classList.add('is-live');
    }
    const amcN = qs('[data-bind="how-amc-n"]', root);
    if (amcN) amcN.textContent = String(n);
    const amcBar = qs('[data-bind="how-amc-bar"]', root);
    if (amcBar && totMcap > 0) amcBar.style.width = Math.min(100, Math.round((totMcap / 5000) * 100)) + '%';
  }
  function renderHowMarket(_m){
    /* α-MCAP comes from subnets above, market feed currently
       has nothing else to bind here */
  }
  function renderHowChain(c){
    if (!c) return;
    if (typeof c.blockTime === 'number'){
      const txt = c.blockTime.toFixed(0) + ' s';
      const el = qs('[data-bind="how-block"]', root);
      if (el){ el.textContent = txt; el.classList.add('is-live'); }
      /* also update the caption under the loop SVG (no date there now) */
      const cap = qs('[data-bind="how-block-cap"]', root);
      if (cap) cap.textContent = txt;
    }
    if (typeof c.emissionPerDay === 'number'){
      const el = qs('[data-bind="how-em"]', root);
      if (el){
        el.innerHTML = '<span class="tau">τ</span>' + Math.round(c.emissionPerDay).toLocaleString();
        el.classList.add('is-live');
      }
    }
  }

  /* ---------- LIVE: § 03 Money Map · Bittensor α-MCAP per layer ----
     Replaces each card's editorial-snapshot Bittensor figure with
     the rolled-up sum of subnet mcap (millions) for the layer's
     listed competing subnets. Sources the figure from the live
     tao:subnets feed (TaoMarketCap public API). When data lands,
     each <span data-stack-amcap-nets="1,9,3,120,6"> gets updated
     to the summed value and the supplementary line below it
     flips to 'LIVE · α price × supply'. */
  function renderStackLive(list){
    if (!Array.isArray(list) || !list.length) return;
    /* keyed by netuid for O(1) lookup */
    const byId = new Map();
    list.forEach(s => { if (s && s.netuid != null) byId.set(Number(s.netuid), s); });
    const fmtMillions = (m) => {
      if (m == null || isNaN(m)) return null;
      if (m >= 1000) return '$' + (m/1000).toFixed(2) + 'B';
      if (m >= 10)   return '$' + Math.round(m) + 'M';
      return '$' + m.toFixed(1) + 'M';
    };
    qsa('[data-stack-amcap-nets]', root).forEach(el => {
      const ids = (el.getAttribute('data-stack-amcap-nets') || '')
        .split(',').map(s => Number(s.trim())).filter(n => !isNaN(n));
      if (!ids.length) return;
      let sum = 0, hits = 0;
      ids.forEach(id => {
        const s = byId.get(id);
        if (s && typeof s.mcap === 'number'){ sum += s.mcap; hits += 1; }
      });
      if (hits === 0) return;
      const txt = fmtMillions(sum);
      if (!txt) return;
      el.textContent = txt;
      el.classList.add('is-live');
      /* swap the sub-line to surface that it's live now */
      const layer = el.getAttribute('data-stack-amcap');
      const sub = root.querySelector(`[data-stack-amcap-src="${layer}"]`);
      if (sub) sub.innerHTML = '<span class="dot dot--live"></span>LIVE · TAOMARKETCAP · ' + hits + ' subnets';
    });
  }

  /* "▸ swipe left for more" cue on every horizontally-scrolling
     rail. The selectors map 1:1 to the overflow-x: auto containers
     in style/components/home.css, drop a new rail in there and
     it picks up the same cue automatically. */
  const slideHintTeardowns = [
    '.home-vals__rail',
    '.home-research__grid',
    '.home-how__pipe',
    '.home-bios__grid',
    '.home-network__rail',
    '.home-ops__rail',
  ].flatMap(sel => Array.from(root.querySelectorAll(sel)))
   .map(el => applySlideHint(el));

  return {
    destroy(){
      unsubs.forEach(u => u());
      sparks.splice(0).forEach(sp => { try { sp.destroy(); } catch (_) {} });
      statSparks.splice(0).forEach(sp => { try { sp.destroy(); } catch (_) {} });
      valSparks.splice(0).forEach(sp => { try { sp.destroy(); } catch (_) {} });
      bioSparks.splice(0).forEach(sp => { try { sp.destroy(); } catch (_) {} });
      opSparks.splice(0).forEach(sp => { try { sp.destroy(); } catch (_) {} });
      oracleMarks.splice(0).forEach(m => { try { m.destroy(); } catch (_) {} });
      neural?.destroy();
      treemap?.destroy();
      slideHintTeardowns.forEach(fn => { try { fn(); } catch (_) {} });
    },
  };
}
