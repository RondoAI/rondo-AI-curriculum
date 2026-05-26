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

/* Site nav, consolidated 2026-05-18 per Rondo "way too many
   options on the top bar it needs to be consolidated."

   Was 9 items (MAGAZINE/ORACLE/RESEARCH/MARKETS/COCKPIT/
   DASHBOARD/TERMINAL/VOICES/EDITOR). Now 3, mapped to the three
   reading modes the magazine actually serves:

     COCKPIT  — the workspace. Chart + dashboard + markets all
                live here per the "unified cockpit" directive.
                Subsumes markets.html, dashboard.html, terminal.html.
     MAGAZINE — the editorial home. Articles, daily story, fresh
                dispatches. The reader-as-reader landing.
     ORACLE   — research. Long-form analytical pieces, briefings,
                interviews. Subsumes research.html, voices.html.

   Pages removed from nav but kept in the repo (still served at
   their URLs so existing bookmarks survive; not promoted):
     markets.html, dashboard.html, terminal.html → merged into
       cockpit.html as panes / collapsibles, but the standalone
       pages still render for direct-link readers.
     research.html, voices.html → reachable via the ORACLE page's
       internal nav, but not separately in the masthead.
     editor.html → staff-only; accessible by URL.
     pricing.html → removed 2026-05-18 ("Get rid of pay wall"),
       still in repo, no longer promoted. */
const NAV_ITEMS = [
  { code: '001', label: 'MAGAZINE',  href: 'index.html'    },
  { code: '010', label: 'ORACLE',    href: 'oracle.html'   },
  { code: '037', label: 'COCKPIT',   href: 'cockpit.html'  },
  { code: '061', label: 'AQUARIUM',  href: 'aquarium.html' },
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

  /* Markup order 2026-05-18: .primary-nav is now a SIBLING of
     <header class="masthead">, not a child. position:sticky pins
     within its NEAREST scrolling ancestor's containing block —
     when the nav lived inside the short masthead block, sticky
     stopped working as soon as the reader scrolled past the
     masthead's own bottom edge, leaving the page with no top
     tabs (Rondo 2026-05-18 hit this on /oracle.html: "ui not
     allowing to move through tab option after entering oracle
     top tab"). Hoisting the nav to body-level makes <body>
     the containing block, so the nav sticks for the entire
     page scroll. */
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
    </header>
    <nav class="primary-nav" aria-label="Primary">
      <div class="primary-nav__inner">${raw(navHtml)}</div>
    </nav>
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
