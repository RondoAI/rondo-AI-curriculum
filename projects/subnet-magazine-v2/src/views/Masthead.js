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
import { applySlideHint } from '../lib/slide-hint.js';

/* Site nav. COCKPIT is the canonical chart-first workspace (big
   live price chart with article sidebar scrolling beside it).
   DASHBOARD + TERMINAL remain as their own surfaces for the
   readers who prefer those layouts — kept per Rondo's directive
   to not delete what was working. */
const NAV_ITEMS = [
  { code: '001', label: 'MAGAZINE', href: 'index.html'     },
  { code: '010', label: 'ORACLE',   href: 'oracle.html'    },
  { code: '020', label: 'RESEARCH', href: 'research.html'  },
  { code: '030', label: 'MARKETS',  href: 'markets.html'   },
  { code: '037', label: 'COCKPIT',  href: 'cockpit.html'   },
  { code: '035', label: 'DASHBOARD',href: 'dashboard.html' },
  { code: '038', label: 'TERMINAL', href: 'terminal.html'  },
  { code: '050', label: 'VOICES',   href: 'voices.html'    },
  { code: '060', label: 'EDITOR',   href: 'editor.html'    },
  { code: '999', label: 'PRO ↗',    href: 'pricing.html'   },
];

const X_URL = 'https://x.com/subnetmagazine';

/**
 * @param {HTMLElement} root
 * @returns {{destroy: () => void}}
 */
export function mountMasthead(root){
  /* Highlight the nav item matching the current page (filename of
     the URL). Previously index 0 was hard-coded as 'active', so
     MAGAZINE looked selected on every page, tapping it from any
     other page felt like a content reset rather than a navigation. */
  const path = (window.location.pathname.split('/').pop() || 'index.html');
  const currentPage = path === '' ? 'index.html' : path;
  const navHtml = NAV_ITEMS.map(n => html`
    <a class="nav-tab ${n.href === currentPage ? 'active' : ''}" href="${n.href}">
      <span class="nav-tab__code">${n.code}</span>
      <span class="nav-tab__label">${n.label}</span>
    </a>
  `).join('');

  mount(root, html`
    <header class="masthead">
      <div class="masthead__inner">
        <a class="brand" href="#overview" aria-label="Subnet Magazine, home">
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
          <a class="masthead__x" href="${X_URL}" target="_blank" rel="noopener">
            <span class="masthead__x-glyph" aria-hidden="true">𝕏</span>@subnetmagazine
          </a>
        </div>
      </div>
      <nav class="primary-nav" aria-label="Primary">
        <div class="primary-nav__inner">${raw(navHtml)}</div>
      </nav>
    </header>
  `);

  // Surface the "▸ swipe left for more" cue on the nav strip, the
  // nav has 10+ items but the phone viewport shows ~3 of them, so
  // without a hint the rest of the magazine looks invisible.
  const navInner = qs('.primary-nav__inner', root);
  const teardownNavHint = navInner ? applySlideHint(navInner) : () => {};

  // Mount the rotating brand mark, a compact NodeSphere, the same
  // dense plexus language as the hero piece, scaled to a logo.
  const markCanvas = qs('[data-canvas="brand-mark"]', root);
  const sphere = markCanvas ? new NodeSphere(markCanvas, {
    nodes:   52,
    K:       3,
    density: 0.5,
    speed:   0.42,
    atmos:   false,
  }) : null;

  /* (block ticker moved to the status-strip / pulse bar, single
     canonical source of network state at the top of the page) */

  // Active-nav highlight on scroll. Only in-page anchors (#…) get
  // wired up; cross-page hrefs (oracle.html, read.html…) are ignored here.
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
      teardownNavHint();
      window.removeEventListener('scroll', onScroll);
    }
  };
}
