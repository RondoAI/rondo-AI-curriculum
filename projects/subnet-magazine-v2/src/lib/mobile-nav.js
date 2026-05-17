/* =================================================================
   SUBNET MAGAZINE, MOBILE BOTTOM NAV
   -----------------------------------------------------------------
   A fixed-bottom navigation bar on phone-class viewports (≤720px).
   Five items, equal-width, monospace label + inline SVG icon:

     HOME · MARKETS · DASHBOARD · ORACLE · MENU

   Active page highlighted with a red top accent and white text;
   inactive items in dim ink. MENU opens the command palette
   (via [data-cmd-trigger] which command-palette.js already wires).

   Architecture: installed once from boot.js, lives in <body> as a
   fixed element. The CSS handles the desktop hide via media query —
   no JS toggle needed. Body padding-bottom is added inline so the
   sticky bar never covers page footer content.

   The current page is computed from window.location.pathname; an
   exact-match table maps each page to a nav slot. Pages outside
   the 4-item set (research, voices, editor) leave no item active
   so the bar reads as "you're somewhere in the magazine, tap any
   destination."
   ================================================================= */

let installed = false;

const NAV_ITEMS = [
  /* href, label, glyph, match (regex against pathname) */
  { href: 'index.html',     label: 'HOME',      glyph: 'home',  match: /(^|\/)(index\.html)?(\?.*)?$/i },
  { href: 'markets.html',   label: 'MARKETS',   glyph: 'mkt',   match: /\/markets\.html(\?.*)?$/i },
  { href: 'dashboard.html', label: 'DASH',      glyph: 'dash',  match: /\/dashboard\.html(\?.*)?$/i },
  { href: 'oracle.html',    label: 'ORACLE',    glyph: 'eye',   match: /\/oracle\.html(\?.*)?$/i },
];

/**
 * Install the bottom nav. Idempotent. Call once from boot.js after
 * DOMContentLoaded so it appends to <body>.
 */
export function installMobileNav(){
  if (installed || typeof document === 'undefined') return;
  installed = true;

  const path = window.location.pathname;
  const isActive = (item) => item.match.test(path);
  const anyActive = NAV_ITEMS.some(isActive);

  const items = NAV_ITEMS.map(it => `
    <a class="mnav__item ${isActive(it) ? 'is-on' : ''}" href="${it.href}" aria-label="${it.label}">
      <span class="mnav__icon" aria-hidden="true">${glyph(it.glyph)}</span>
      <span class="mnav__lbl">${it.label}</span>
    </a>
  `).join('');

  const menuBtn = `
    <button type="button" class="mnav__item mnav__item--menu" data-cmd-trigger aria-label="Open command palette">
      <span class="mnav__icon" aria-hidden="true">${glyph('menu')}</span>
      <span class="mnav__lbl">MENU</span>
    </button>
  `;

  const nav = document.createElement('nav');
  nav.className = 'mnav';
  nav.setAttribute('aria-label', 'Magazine sections');
  nav.innerHTML = items + menuBtn;
  document.body.appendChild(nav);

  /* Reserve space so the bar doesn't cover footer content. The
     value here matches the bar's height + a small breathing pad,
     and only kicks in at the same viewport breakpoint via inline
     style attribute the CSS conditionally honors. */
  document.body.style.setProperty('--mnav-pad', '68px');
  if (!anyActive){
    /* On non-mapped pages, dim all items uniformly so the bar
       still feels live without falsely signaling a current view. */
    nav.classList.add('mnav--no-active');
  }
}

/* ---------- inline SVG glyphs --------------------------------- */
/* HUD-style 1-stroke icons, currentColor so they tint with the
   active/inactive text color set in CSS. Sized 22x22 viewBox so a
   single `width="22"` in CSS gives consistent visual weight. */
function glyph(kind){
  switch (kind){
    case 'home':
      /* House outline, sharp roof. */
      return svg('<path d="M3 11 L12 4 L21 11 M5 10 L5 20 H10 V14 H14 V20 H19 V10" />');
    case 'mkt':
      /* Two candlesticks, up + down — the markets register. */
      return svg('<line x1="7"  y1="4"  x2="7"  y2="20" />'
              + '<rect x="5"  y="7"  width="4" height="8" fill="currentColor" stroke="none" />'
              + '<line x1="16" y1="4"  x2="16" y2="20" />'
              + '<rect x="14" y="10" width="4" height="6" fill="none" />');
    case 'dash':
      /* 4-square dashboard grid. */
      return svg('<rect x="4"  y="4"  width="7" height="7" />'
              + '<rect x="13" y="4"  width="7" height="7" />'
              + '<rect x="4"  y="13" width="7" height="7" />'
              + '<rect x="13" y="13" width="7" height="7" />');
    case 'eye':
      /* Oracle eye, almond + pupil. */
      return svg('<path d="M2 12 C5 6, 19 6, 22 12 C19 18, 5 18, 2 12 Z" />'
              + '<circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />');
    case 'menu':
      /* Three lines, eDEX register, slightly weighted. */
      return svg('<line x1="4" y1="6"  x2="20" y2="6"  />'
              + '<line x1="4" y1="12" x2="20" y2="12" />'
              + '<line x1="4" y1="18" x2="20" y2="18" />');
    default:
      return svg('<rect x="4" y="4" width="16" height="16" />');
  }
}
function svg(inner){
  return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square" stroke-linejoin="miter">${inner}</svg>`;
}
