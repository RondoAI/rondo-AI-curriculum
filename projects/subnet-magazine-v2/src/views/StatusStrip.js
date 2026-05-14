/* =================================================================
   STATUS STRIP VIEW
   -----------------------------------------------------------------
   Mounts the persistent top status bar (it sits just under the
   ticker tapes). Subscribes to the data layer for TAO price and
   block height. Returns a teardown function.
   ================================================================= */

import { html, mount, qs, setLive } from '../lib/dom.js';
import { bbgDate, money, pct, deltaClass } from '../lib/format.js';

/**
 * @param {HTMLElement} root
 * @param {{subscribe: (channel: string, fn: Function) => Function} | null} [dataLayer]
 * @returns {() => void}  teardown
 */
export function mountStatusStrip(root, dataLayer = null){
  mount(root, html`
    <div class="statusbar">
      <div class="statusbar__inner" role="region" aria-label="Network status">
        <span class="statusbar__live"><span class="live-dot"></span>LIVE</span>
        <span class="statusbar__sep">│</span>
        <span class="statusbar__field" data-field="date">
          <span class="statusbar__value" data-bind="date">${bbgDate()}</span>
        </span>
        <span class="statusbar__sep">│</span>
        <span class="statusbar__field" title="Chain block height">
          <span class="statusbar__label">BLOCK</span>
          <span class="statusbar__value mono" data-bind="block">—</span>
        </span>
        <span class="statusbar__sep">│</span>
        <span class="statusbar__field" title="Subnet epoch (360 blocks)">
          <span class="statusbar__label">EPOC</span>
          <span class="statusbar__value mono" data-bind="epoch">14,302</span>
        </span>

        <span class="statusbar__push"></span>

        <span class="statusbar__quote" title="τ/USD (CoinGecko)">
          <span class="pair">τ/USD</span>
          <span class="price" data-bind="tao-price">—</span>
          <span class="delta" data-bind="tao-delta">—</span>
        </span>
        <span class="statusbar__sep">│</span>
        <span class="statusbar__quote" title="Yuma Composite Index">
          <span class="pair">YCX</span>
          <span class="price">1,004.89</span>
          <span class="delta up">+0.49%</span>
        </span>
      </div>
    </div>
  `);

  const bind = sel => qs(`[data-bind="${sel}"]`, root);

  // 1) Date — set once; it only changes at UTC midnight
  const dateEl = bind('date');
  if (dateEl) dateEl.textContent = bbgDate();

  // 2) Block height — from data layer or synthetic
  const blockEl = bind('block');
  let block = 4_812_047;
  const renderBlock = (h) => setLive(blockEl, (h ?? block).toLocaleString('en-US'));
  renderBlock();
  let blockUnsub = () => {};
  if (dataLayer){
    blockUnsub = dataLayer.subscribe('tao:block', (d) => {
      if (d && typeof d.height === 'number'){
        block = d.height;
        renderBlock(d.height);
      }
    });
  }
  // simulate block tick (12s) — overwritten the moment live data arrives
  const blockTimer = setInterval(() => {
    block += 1;
    renderBlock(block);
  }, 12_000);

  // 3) TAO price — live from CoinGecko via data layer
  const priceEl = bind('tao-price');
  const deltaEl = bind('tao-delta');
  let priceUnsub = () => {};
  if (dataLayer){
    priceUnsub = dataLayer.subscribe('tao:price', (d) => {
      if (!d || typeof d.price !== 'number') return;
      setLive(priceEl, money(d.price));
      if (deltaEl){
        deltaEl.textContent = pct(d.change24 ?? 0);
        deltaEl.classList.remove('up', 'down', 'flat');
        deltaEl.classList.add(deltaClass(d.change24 ?? 0));
      }
    });
  } else {
    if (priceEl) priceEl.textContent = money(487.12);
    if (deltaEl){ deltaEl.textContent = '+3.24%'; deltaEl.classList.add('up'); }
  }

  return function destroy(){
    clearInterval(blockTimer);
    blockUnsub();
    priceUnsub();
  };
}
