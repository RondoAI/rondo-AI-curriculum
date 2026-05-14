/* =================================================================
   SUBNET MAGAZINE — CHART MODAL
   -----------------------------------------------------------------
   Open any Chart subclass at full screen. Pure DOM — no framework.
   Usage:
     openChartModal({ ChartClass, opts, title, subtitle })
   The modal creates its own canvas at 90vw × ~80vh, instantiates a
   fresh chart against it, and tears it down cleanly on close.

   Keyboard: ESC closes. Click backdrop closes. Inert focus trap
   keeps tab on the close button.
   ================================================================= */

import { html, frag, qs } from './dom.js';

let activeModal = null;

/**
 * Open a chart in a fullscreen modal.
 * @param {{
 *   ChartClass: any,
 *   opts?: any,
 *   title?: string,
 *   subtitle?: string,
 *   fcode?: string,
 * }} arg
 */
export function openChartModal({ ChartClass, opts = {}, title = '', subtitle = '', fcode = '' }){
  closeChartModal();   // ensure only one open at a time

  const tpl = html`
    <div class="chart-modal" role="dialog" aria-modal="true" aria-label="${title}">
      <div class="chart-modal__backdrop" data-close></div>
      <div class="chart-modal__inner panel is-bracketed">
        <header class="chart-modal__head">
          <span class="chart-modal__title">
            ${fcode ? `<span class="chart-modal__fcode">&lt;${fcode}&gt;</span>` : ''}
            ${title}
            <span class="chart-modal__go">&lt;GO&gt;</span>
          </span>
          ${subtitle ? `<span class="chart-modal__sub">${subtitle}</span>` : ''}
          <button class="chart-modal__close" data-close aria-label="Close">✕</button>
        </header>
        <div class="chart-modal__viz">
          <canvas data-canvas="modal"></canvas>
        </div>
        <footer class="chart-modal__foot">
          <span>EXPANDED VIEW</span>
          <span>ESC or tap backdrop to close</span>
        </footer>
      </div>
    </div>
  `;
  const f = frag(tpl);
  const root = f.firstElementChild;
  document.body.appendChild(root);
  document.body.style.overflow = 'hidden';

  const canvas = qs('[data-canvas="modal"]', root);
  /* Instantiate a fresh chart against the modal canvas. */
  const chart = canvas ? new ChartClass(canvas, opts) : null;

  function close(){
    if (chart && typeof chart.destroy === 'function') chart.destroy();
    document.removeEventListener('keydown', onKey);
    root.remove();
    document.body.style.overflow = '';
    activeModal = null;
  }
  function onKey(e){ if (e.key === 'Escape') close(); }
  root.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', close));
  document.addEventListener('keydown', onKey);
  /* focus the close button so screen readers / keyboards land here */
  setTimeout(() => qs('.chart-modal__close', root)?.focus(), 0);

  activeModal = { root, close };
}

export function closeChartModal(){
  if (activeModal && typeof activeModal.close === 'function') activeModal.close();
}
