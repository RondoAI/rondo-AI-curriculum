/* =================================================================
   SUBNET MAGAZINE, COMMUNITY
   -----------------------------------------------------------------
   The ecosystem's public square. Three blocks:

     1. LIVE PULSE, a real-time τ/USD chart that builds itself from
        the DataLayer 'tao:market' feed. No synthesized history; the
        line grows as real ticks arrive.
     2. THE TIMELINE, X's free embed widget rendering the live
        @subnetmagazine timeline (and a curated X List, if one is
        configured). Genuinely live tweets, no API key needed.
     3. ECOSYSTEM VOICES, a curated directory of the real X
        accounts that move the Bittensor conversation, each a
        follow-card linking straight to the profile.

   "Most popular tweets" ranking needs the paid X API (Basic tier);
   until then the embedded timelines + curated voices are the live,
   honest, zero-cost surface.
   ================================================================= */

import { html, mount, qs } from '../lib/dom.js';
import { money, pct, deltaClass, compact } from '../lib/format.js';
import { mark } from '../lib/mark.js';
import { LiveChart } from '../charts/LiveChart.js';
import { VOICES, voicesByGroup, X_PRIMARY, X_LIST_URL } from '../data/voices.js';

const TWITTER_WIDGETS = 'https://platform.twitter.com/widgets.js';

/** Inject X's widgets.js once, then resolve when twttr is ready. */
function loadTwitterWidgets(){
  if (window.twttr && window.twttr.widgets) return Promise.resolve(window.twttr);
  return new Promise(resolve => {
    let s = document.querySelector(`script[src="${TWITTER_WIDGETS}"]`);
    if (!s){
      s = document.createElement('script');
      s.src = TWITTER_WIDGETS;
      s.async = true;
      document.head.appendChild(s);
    }
    const ready = () => (window.twttr && window.twttr.widgets ? resolve(window.twttr) : setTimeout(ready, 120));
    s.addEventListener('load', ready);
    ready();
  });
}

/**
 * @param {HTMLElement} root
 * @param {{subscribe:Function, get:Function}|null} [dataLayer]
 */
export function mountCommunity(root, dataLayer = null){
  const groups = voicesByGroup();

  mount(root, html`
    <section class="community">
      <header class="cm-head">
        <a class="sd-back" href="index.html">‹ MAGAZINE</a>
        <div class="cm-head__main">
          <span class="cm-head__kicker">&lt;070&gt;  COMMUNITY</span>
          <h1 class="cm-head__title">The ecosystem, <em>out loud.</em></h1>
          <p class="cm-head__sub">
            A live read on the Bittensor conversation, a real-time τ pulse, the
            Subneτ Magazine timeline straight from X, and a curated directory of the
            people and teams worth following.
          </p>
        </div>
        <div class="cm-head__meta">
          <span class="sd-pill"><span class="live-dot"></span>LIVE</span>
          <span class="sd-pill">${VOICES.length} VOICES</span>
        </div>
      </header>

      <!-- ===== LIVE PULSE ===== -->
      <section class="cm-pulse" aria-label="Live network pulse">
        <div class="cm-pulse__head">
          <div>
            <span class="cm-pulse__lbl">τ / USD · live feed</span>
            <span class="cm-pulse__price" data-bind="price">, </span>
            <span class="cm-pulse__delta" data-bind="delta">, </span>
          </div>
          <div class="cm-pulse__stats">
            <span class="cm-pulse__stat"><b data-bind="mcap">, </b>market cap</span>
            <span class="cm-pulse__stat"><b data-bind="vol">, </b>24h volume</span>
          </div>
        </div>
        <div class="cm-pulse__chart"><canvas data-canvas="pulse"></canvas></div>
        <p class="cm-pulse__note">Real ticks only, the line is empty until the first live update lands, then it builds in real time.</p>
      </section>

      <!-- ===== TIMELINE + VOICES ===== -->
      <div class="cm-grid">
        <section class="cm-timeline" aria-label="Live X timeline">
          <h2 class="cm-section__title"><span class="live-dot"></span>The timeline</h2>
          <div class="cm-embed" data-embed="primary">
            <a class="twitter-timeline" data-theme="dark" data-dnt="true"
               data-height="640" data-chrome="noheader nofooter transparent"
               href="https://twitter.com/${X_PRIMARY}">Tweets by @${X_PRIMARY}</a>
          </div>
          ${X_LIST_URL ? `
            <h3 class="cm-section__sub">Ecosystem list</h3>
            <div class="cm-embed" data-embed="list">
              <a class="twitter-timeline" data-theme="dark" data-dnt="true"
                 data-height="520" data-chrome="noheader nofooter transparent"
                 href="${X_LIST_URL}">Ecosystem list</a>
            </div>` : `
            <p class="cm-embed__hint">
              Want a ranked, multi-account feed? Create an X List of ecosystem
              accounts and set <code>xListUrl</code> in config.js, it embeds here automatically.
            </p>`}
          <noscript><p class="cm-embed__hint">Enable JavaScript to load the live X timeline.</p></noscript>
        </section>

        <section class="cm-voices" aria-label="Ecosystem voices">
          <h2 class="cm-section__title">Ecosystem voices</h2>
          <p class="cm-voices__intro">The real accounts behind the Bittensor conversation, founders, funds, subnet teams, analysts. Tap any card to follow on X.</p>
          ${groups.map(g => `
            <div class="cm-voicegroup">
              <h3 class="cm-section__sub">${g.label}</h3>
              <ul class="cm-voicelist">
                ${g.voices.map(v => `
                  <li class="cm-voice">
                    <a class="cm-voice__link" href="https://x.com/${v.handle}" target="_blank" rel="noopener">
                      <span class="cm-voice__mark">${mark(v.name, { size: 40 })}</span>
                      <span class="cm-voice__text">
                        <span class="cm-voice__name">${v.name}</span>
                        <span class="cm-voice__handle">@${v.handle}</span>
                        <span class="cm-voice__role">${v.role}</span>
                      </span>
                      <span class="cm-voice__follow">Follow ↗</span>
                    </a>
                  </li>
                `).join('')}
              </ul>
            </div>
          `).join('')}
        </section>
      </div>
    </section>
  `);

  /* ---------- live pulse chart ---------- */
  const canvas = qs('[data-canvas="pulse"]', root);
  const chart = canvas ? new LiveChart(canvas, { maxPoints: 90, fmt: n => '$' + n.toFixed(2) }) : null;

  const bind = sel => qs(`[data-bind="${sel}"]`, root);
  const els = {
    price: bind('price'), delta: bind('delta'),
    mcap:  bind('mcap'),  vol:   bind('vol'),
  };

  function renderMarket(d){
    if (!d) return;
    if (d.price != null){
      if (els.price) els.price.textContent = money(d.price);
      chart?.push(d.price);
    }
    if (els.delta){
      const c = d.change24h ?? 0;
      els.delta.textContent = `${pct(c)} · 24h`;
      els.delta.className = `cm-pulse__delta ${deltaClass(c)}`;
    }
    if (els.mcap && d.marketCap != null) els.mcap.textContent = '$' + compact(d.marketCap);
    if (els.vol && d.volume24h != null) els.vol.textContent = '$' + compact(d.volume24h);
  }

  const unsubs = [];
  if (dataLayer){
    unsubs.push(dataLayer.subscribe('tao:market', renderMarket));
    renderMarket(dataLayer.get('tao:market'));
  }

  /* ---------- X timeline embeds ---------- */
  loadTwitterWidgets().then(twttr => {
    try { twttr.widgets.load(root); } catch (_) { /* widget host unreachable, links still work */ }
  });

  return {
    destroy(){
      unsubs.forEach(u => u());
      chart?.destroy();
    },
  };
}
