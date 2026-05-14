/* =================================================================
   MASTHEAD VIEW
   -----------------------------------------------------------------
   Renders the brand band: "Subneτ Magazine" wordmark, a rotating
   red NodeSphere mark, and the function-code primary nav.
   ================================================================= */

import { html, mount, qs, raw } from '../lib/dom.js';
import { NodeSphere } from '../charts/NodeSphere.js';
import { bbgDate } from '../lib/format.js';

const NAV_ITEMS = [
  { code: '001', label: 'OVERVIEW',  href: '#overview'  },
  { code: '010', label: 'NETWORK',   href: '#netmap'    },
  { code: '020', label: 'TERMINAL',  href: '#terminal'  },
  { code: '030', label: 'MARKETS',   href: '#markets'   },
  { code: '040', label: 'SUBNETS',   href: '#directory' },
  { code: '050', label: 'LABS',      href: '#labs'      },
  { code: '060', label: 'EDITORIAL', href: '#editorial' },
  { code: '900', label: 'ARCHIVE',   href: '#archive'   },
];

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
        </div>
      </div>
      <nav class="primary-nav" aria-label="Primary">
        <div class="primary-nav__inner">${raw(navHtml)}</div>
      </nav>
    </header>
  `);

  // Mount the rotating node-sphere brand mark
  const markCanvas = qs('[data-canvas="brand-mark"]', root);
  const sphere = markCanvas ? new NodeSphere(markCanvas, { nodes: 60, edges: 140, speed: 0.45 }) : null;

  // Active-nav highlight on scroll
  const tabs = Array.from(root.querySelectorAll('.nav-tab'));
  const sections = tabs
    .map(t => ({ tab: t, el: document.querySelector(t.getAttribute('href')) }))
    .filter(x => x.el);

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
