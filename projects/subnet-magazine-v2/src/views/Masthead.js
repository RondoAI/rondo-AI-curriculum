/* =================================================================
   MASTHEAD VIEW
   -----------------------------------------------------------------
   Renders the brand band: "Subneτ Magazine" wordmark, a rotating
   red NodeSphere mark, and the function-code primary nav.
   ================================================================= */

import { html, mount, qs, raw } from '../lib/dom.js';
import { Icosphere } from '../charts/Icosphere.js';
import { bbgDate } from '../lib/format.js';

const NAV_ITEMS = [
  { code: '001', label: 'MAGAZINE',  href: 'index.html'        },
  { code: '020', label: 'TERMINAL',  href: 'terminal.html'     },
  { code: '010', label: 'NETWORK',   href: 'network.html'      },
  { code: '025', label: 'COMPARE',   href: 'compare.html'      },
  { code: '026', label: 'CENTRAL',   href: 'centralized.html'  },
  { code: '060', label: 'RESEARCH',  href: 'articles.html'     },
  { code: '070', label: 'COMMUNITY', href: 'community.html'    },
  { code: '040', label: 'SUBNETS',   href: 'subnets.html'      },
  { code: '050', label: 'VALIDATORS',href: 'validators.html'   },
];

const X_URL = 'https://x.com/subnetmagazine';

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
            <span class="brand__word">Subne${raw('<span class="tau">τ</span>')} Magazine</span>
            <span class="brand__sub">A research terminal for decentralized intelligence</span>
          </span>
        </a>
        <div class="masthead__diag">
          <span><span class="val">${bbgDate()}</span></span>
          <span>BUILD <span class="val">v2.0.0</span></span>
          <span>FEED <span class="val">streaming</span></span>
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

  // Mount the rotating brand mark — Icosphere (regular polyhedron
  // with complete-graph chord connectivity) matches the hero piece
  // for a unified visual language.
  const markCanvas = qs('[data-canvas="brand-mark"]', root);
  const sphere = markCanvas ? new Icosphere(markCanvas, {
    radius:    0.45,
    speed:     0.45,
    packets:   8,
    thickEdges:true,
  }) : null;

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
      window.removeEventListener('scroll', onScroll);
    }
  };
}
