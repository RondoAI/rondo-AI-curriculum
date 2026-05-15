/* =================================================================
   MASTHEAD VIEW
   -----------------------------------------------------------------
   Renders the brand band: "Subneτ Magazine" wordmark, a rotating
   red NodeSphere mark, the function-code primary nav, and an
   AI-2026 live-block ticker (BLOCK NNN · T-9s until next) with a
   thin chain ribbon animating packets across the masthead.
   ================================================================= */

import { html, mount, qs, raw } from '../lib/dom.js';
import { NodeSphere } from '../charts/NodeSphere.js';
import { bbgDate } from '../lib/format.js';

const NAV_ITEMS = [
  { code: '001', label: 'MAGAZINE',  href: 'index.html'        },
  { code: '020', label: 'TERMINAL',  href: 'terminal.html'     },
  { code: '030', label: 'MARKETS',   href: 'markets.html'      },
  { code: '010', label: 'NETWORK',   href: 'network.html'      },
  { code: '025', label: 'COMPARE',   href: 'compare.html'      },
  { code: '026', label: 'CENTRAL',   href: 'centralized.html'  },
  { code: '060', label: 'RESEARCH',  href: 'articles.html'     },
  { code: '070', label: 'COMMUNITY', href: 'community.html'    },
  { code: '040', label: 'SUBNETS',   href: 'subnets.html'      },
  { code: '050', label: 'VALIDATORS',href: 'validators.html'   },
];

const X_URL = 'https://x.com/subnetmagazine';

/* Seed block-height around what taostats reports — bumped every 12s
   so the counter visibly ticks. When the substrate WebSocket lands
   we'll bind directly to chain.subscribe_finalized_heads instead. */
const BLOCK_SEED = 8_189_022;
const BLOCK_PERIOD_MS = 12_000;

/**
 * @param {HTMLElement} root
 * @returns {{destroy: () => void}}
 */
export function mountMasthead(root){
  const navHtml = NAV_ITEMS.map((n, i) => html`
    <a class="nav-tab ${i === 0 ? 'active' : ''}" href="${n.href}">
      <span class="nav-tab__code">&lt;${n.code}&gt;</span>
      <span>${n.label}</span>
    </a>
  `).join('');

  mount(root, html`
    <header class="masthead">
      <div class="masthead__inner">
        <a class="brand" href="#overview" aria-label="Subnet Magazine — home">
          <span class="brand__mark" aria-hidden="true">
            <canvas data-canvas="brand-mark"></canvas>
          </span>
          <span>
            <span class="brand__word">Subne<span class="tau">τ</span> Magazine</span>
            <span class="brand__sub">Subnet markets · validator analytics · editorial coverage</span>
          </span>
        </a>
        <div class="masthead__diag">
          <span><span class="val">${bbgDate()}</span></span>
          <span>BUILD <span class="val">v2.0.0</span></span>
          <span class="masthead__block">
            <span class="masthead__live"><span class="live-dot"></span>LIVE</span>
            <span class="masthead__block-label">BLOCK</span>
            <span class="masthead__block-num" data-block-num>${BLOCK_SEED.toLocaleString('en-US')}</span>
            <span class="masthead__block-tick" data-block-tick>T-12s</span>
          </span>
          <a class="masthead__x" href="${X_URL}" target="_blank" rel="noopener">
            <span class="masthead__x-glyph" aria-hidden="true">𝕏</span>@subnetmagazine
          </a>
        </div>
        <!-- AI-2026: a thin chain ribbon underneath the diag strip,
             animated packets traveling left-to-right at block cadence.
             Pure SVG animateMotion, no JS frame loop. -->
        <div class="masthead__chain" aria-hidden="true">
          <svg viewBox="0 0 1320 8" preserveAspectRatio="none">
            <defs>
              <path id="chain-track" d="M 0 4 L 1320 4" fill="none"/>
            </defs>
            <line x1="0" y1="4" x2="1320" y2="4" stroke="currentColor" stroke-opacity=".18" stroke-width=".6"/>
            ${[0, 0.13, 0.27, 0.41, 0.55, 0.69, 0.83].map(off => `
              <circle r="2.4" fill="#FF1E3C">
                <animateMotion dur="9s" begin="${off * 9}s" repeatCount="indefinite">
                  <mpath href="#chain-track"/>
                </animateMotion>
                <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.05;0.95;1" dur="9s" begin="${off * 9}s" repeatCount="indefinite"/>
              </circle>
            `).join('')}
          </svg>
        </div>
      </div>
      <nav class="primary-nav" aria-label="Primary">
        <div class="primary-nav__inner">${raw(navHtml)}</div>
      </nav>
    </header>
  `);

  // Mount the rotating brand mark — a compact NodeSphere, the same
  // dense plexus language as the hero piece, scaled to a logo.
  const markCanvas = qs('[data-canvas="brand-mark"]', root);
  const sphere = markCanvas ? new NodeSphere(markCanvas, {
    nodes:   52,
    K:       3,
    density: 0.5,
    speed:   0.42,
    atmos:   false,
  }) : null;

  /* live block ticker. Bumps the block number once per cadence
     and runs a 1Hz countdown between bumps so T-12s..T-1s is visible.
     Will swap to a real substrate WS subscription when wired. */
  const blockNumEl  = qs('[data-block-num]', root);
  const blockTickEl = qs('[data-block-tick]', root);
  let block = BLOCK_SEED;
  let nextAt = Date.now() + BLOCK_PERIOD_MS;
  const blockTimer = setInterval(() => {
    const now = Date.now();
    if (now >= nextAt){
      block += 1;
      nextAt = now + BLOCK_PERIOD_MS;
      if (blockNumEl){
        blockNumEl.textContent = block.toLocaleString('en-US');
        blockNumEl.classList.add('is-flash');
        setTimeout(() => blockNumEl.classList.remove('is-flash'), 400);
      }
    }
    if (blockTickEl){
      const left = Math.max(0, Math.ceil((nextAt - now) / 1000));
      blockTickEl.textContent = `T-${left}s`;
    }
  }, 1000);

  // Active-nav highlight on scroll. Only in-page anchors (#…) get
  // wired up; external links (terminal.html) are ignored here.
  const tabs = Array.from(root.querySelectorAll('.nav-tab'));
  const sections = tabs
    .map(t => {
      const href = t.getAttribute('href') || '';
      if (!href.startsWith('#')) return null;
      try { return { tab: t, el: document.querySelector(href) }; }
      catch (_) { return null; }
    })
    .filter(x => x && x.el);

  function onScroll(){
    const y = window.scrollY + 140;
    let current = sections[0];
    for (const s of sections) if (s.el.offsetTop <= y) current = s;
    if (!current) return;
    tabs.forEach(t => t.classList.remove('active'));
    current.tab.classList.add('active');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  return {
    destroy(){
      sphere?.destroy();
      clearInterval(blockTimer);
      window.removeEventListener('scroll', onScroll);
    }
  };
}
