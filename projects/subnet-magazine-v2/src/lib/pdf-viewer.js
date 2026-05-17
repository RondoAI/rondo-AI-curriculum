/* =================================================================
   SUBNET MAGAZINE, INLINE PDF VIEWER
   -----------------------------------------------------------------
   Bloomberg's research-panel pattern: when a reader taps a news
   card, instead of yanking them to a new tab, slide a drawer in
   from the right with the PDF embedded inline. The dashboard
   stays visible behind/beside (desktop = 40% width × full height;
   mobile = full-screen overlay). The reader keeps context.

   Rondo asked for this directly: "put the PDF in the news. Make
   it do a side scroll or put it within the window within the
   window."

   Architecture:
     openPdfViewer({ href, title, kicker, date, kind })
       - Idempotent; only one open at a time
       - Animates in from the right via CSS transform
       - Body scroll locks while open
       - ESC + backdrop click close it cleanly
       - "Open in new tab" link as a fallback for browsers that
         block embedded PDFs (some corporate sandboxes do)

   PDF rendering: native <embed type="application/pdf">. Every
   major desktop + iOS Safari + Android Chrome handles this. No
   PDF.js dependency, no async load.

   Wiring: news cards (src/views/Dashboard.js + commentary.js) get
   a data-pdf-href attribute. A document-level click handler in
   this module intercepts taps on [data-pdf-href] elements and
   opens the viewer instead of letting the link navigate. The
   underlying <a href> stays as-is so middle-click and "open in
   new tab" still work for power users.
   ================================================================= */

import { qs, escapeHtml } from './dom.js';

let active   = null;
let wired    = false;

/* ---------- public API ----------------------------------- */

export function openPdfViewer({ href, title, kicker, date, kind }){
  if (active) closePdfViewer();
  if (!href){
    /* No PDF — quietly no-op rather than open an empty drawer.
       Caller should fall back to its normal link behavior. */
    return false;
  }
  active = mount({ href, title, kicker, date, kind });
  return true;
}

export function closePdfViewer(){
  if (active && typeof active.close === 'function') active.close();
}

/**
 * Install the global click interceptor. Idempotent. Call once
 * from boot.js. Any element with [data-pdf-href] (or a child
 * inside such an element) will open in the inline viewer when
 * clicked, instead of navigating.
 *
 * Power-user escape hatches preserved:
 *   - middle-click / ctrl-click / cmd-click → open in new tab
 *     (the underlying <a href> handles this)
 *   - shift-click → open in new window (browser default)
 *   - the "Open in new tab" button inside the viewer
 */
export function installPdfViewer(){
  if (wired || typeof document === 'undefined') return;
  wired = true;
  document.addEventListener('click', (e) => {
    /* Bail on modifier-key clicks so power users keep their
       new-tab / new-window behavior. */
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (e.button !== 0) return;
    const a = e.target.closest && e.target.closest('[data-pdf-href]');
    if (!a) return;
    const href = a.getAttribute('data-pdf-href') || a.getAttribute('href');
    if (!href) return;
    /* Only intercept .pdf URLs — external links (twitter, github,
       semianalysis) should still open in new tab as normal. */
    if (!/\.pdf(\?|$|#)/i.test(href)) return;
    e.preventDefault();
    openPdfViewer({
      href,
      title:  a.getAttribute('data-pdf-title')  || a.textContent.trim(),
      kicker: a.getAttribute('data-pdf-kicker') || '',
      date:   a.getAttribute('data-pdf-date')   || '',
      kind:   a.getAttribute('data-pdf-kind')   || '',
    });
  });
}

/* ---------- mount / behavior ----------------------------- */

function mount({ href, title, kicker, date, kind }){
  const root = document.createElement('div');
  root.className = 'pdfv';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-label', `Article viewer: ${title || 'PDF'}`);
  root.innerHTML = template({ href, title, kicker, date, kind });
  document.body.appendChild(root);
  const prevOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';

  /* Animate the panel in on next frame — sets the .is-open class
     after the initial CSS transform/opacity has had a chance to
     paint, so the transition runs (rather than the element
     appearing instantly in its final position). */
  requestAnimationFrame(() => {
    requestAnimationFrame(() => root.classList.add('is-open'));
  });

  function onKey(e){ if (e.key === 'Escape'){ e.preventDefault(); close(); } }
  function onClick(e){ if (e.target.closest('[data-pdfv-close]')) close(); }
  document.addEventListener('keydown', onKey);
  root.addEventListener('click', onClick);

  setTimeout(() => qs('.pdfv__close', root)?.focus(), 60);

  function close(){
    document.removeEventListener('keydown', onKey);
    /* Reverse the animation. Wait for it to settle before removing
       so the closing motion is visible. */
    root.classList.remove('is-open');
    setTimeout(() => {
      document.body.style.overflow = prevOverflow;
      root.remove();
      active = null;
    }, 260);
  }
  return { close };
}

function template({ href, title, kicker, date, kind }){
  const kindCls   = kind === 'magazine' ? 'pdfv__kind--mag'
                  : kind === 'oracle'   ? 'pdfv__kind--oracle'
                  : 'pdfv__kind--ext';
  const kindLabel = kind === 'magazine' ? 'MAGAZINE'
                  : kind === 'oracle'   ? 'ORACLE'
                  : (kind || '').toUpperCase();
  return `
    <div class="pdfv__backdrop" data-pdfv-close></div>
    <aside class="pdfv__panel" aria-label="Article viewer">
      <header class="pdfv__head">
        <div class="pdfv__head-meta">
          ${kindLabel ? `<span class="pdfv__kind ${kindCls}">${escapeHtml(kindLabel)}</span>` : ''}
          ${date ? `<span class="pdfv__date">${escapeHtml(date)}</span>` : ''}
          ${kicker ? `<span class="pdfv__kicker">${escapeHtml(kicker)}</span>` : ''}
        </div>
        <h2 class="pdfv__title">${escapeHtml(title || 'Article')}</h2>
        <div class="pdfv__actions">
          <a class="pdfv__newtab" href="${escapeHtml(href)}" target="_blank" rel="noopener" aria-label="Open PDF in a new tab">OPEN ↗</a>
          <button type="button" class="pdfv__close" data-pdfv-close aria-label="Close viewer">✕</button>
        </div>
      </header>
      <div class="pdfv__body">
        <embed class="pdfv__embed" src="${escapeHtml(href)}#view=FitH" type="application/pdf" aria-label="PDF document" />
        <div class="pdfv__fallback">
          PDF preview unavailable in this browser.
          <a href="${escapeHtml(href)}" target="_blank" rel="noopener">Open in a new tab ↗</a>
        </div>
      </div>
      <footer class="pdfv__foot">
        <span>ESC to close · tap backdrop to dismiss</span>
        <span class="pdfv__brand">⌘ RESEARCH</span>
      </footer>
    </aside>
  `;
}
