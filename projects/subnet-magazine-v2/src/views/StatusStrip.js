/* =================================================================
   STATUS STRIP VIEW
   -----------------------------------------------------------------
   The persistent infographic band at the very top of the document,
   under the ticker tapes. A dense, Bloomberg-grade readout of the
   network: live state on the left, market on the right, with a
   micro-trend sparkline on the τ quote. Live where the data layer
   provides it (τ price, block height); a researched seed otherwise.
   ================================================================= */

import { html, mount, qs, setLive } from '../lib/dom.js';
import { bbgDate, money, pct, deltaClass } from '../lib/format.js';
import { taoLogo } from '../lib/tao-logo.js';
import { seedSeries } from '../lib/mark.js';
import { Sparkline } from '../charts/Sparkline.js';

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
          <span class="statusbar__label">BLK</span>
          <span class="statusbar__value mono" data-bind="block">—</span>
        </span>
        <span class="statusbar__sep">│</span>
        <span class="statusbar__field" title="Subnet epoch (360 blocks)">
          <span class="statusbar__label">EPOC</span>
          <span class="statusbar__value mono" data-bind="epoch">14,302</span>
        </span>
        <span class="statusbar__sep">│</span>
        <span class="statusbar__field" title="Network emission per day">
          <span class="statusbar__label">EMIT</span>
          <span class="statusbar__value mono">7,200<span class="statusbar__unit">τ/d</span></span>
        </span>
        <span class="statusbar__sep">│</span>
        <span class="statusbar__field" title="Active subnets">
          <span class="statusbar__label">SN</span>
          <span class="statusbar__value mono">92</span>
        </span>
        <span class="statusbar__sep">│</span>
        <span class="statusbar__field" title="Active validators">
          <span class="statusbar__label">VAL</span>
          <span class="statusbar__value mono">6,184</span>
        </span>
        <span class="statusbar__sep">│</span>
        <span class="statusbar__field" title="Share of supply staked">
          <span class="statusbar__label">STAKED</span>
          <span class="statusbar__value mono">63%</span>
          <span class="statusbar__bar" aria-hidden="true"><span style="width:63%"></span></span>
        </span>

        <span class="statusbar__push"></span>

        <span class="statusbar__quote" title="τ/USD (CoinGecko)">
          <span class="pair"><span class="tao-mark">${taoLogo({ size: 12 })}</span>/USD</span>
          <span class="price" data-bind="tao-price">—</span>
          <span class="statusbar__spark"><canvas data-spark="tao"></canvas></span>
          <span class="delta" data-bind="tao-delta">—</span>
        </span>
        <span class="statusbar__sep">│</span>
        <span class="statusbar__field" title="TAO market cap">
          <span class="statusbar__label">MCAP</span>
          <span class="statusbar__value mono">$3.29B</span>
        </span>
        <span class="statusbar__sep">│</span>
        <span class="statusbar__field" title="24h spot volume">
          <span class="statusbar__label">VOL</span>
          <span class="statusbar__value mono">$48.2M</span>
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

  // Date — set once; it only changes at UTC midnight
  const dateEl = bind('date');
  if (dateEl) dateEl.textContent = bbgDate();

  // τ/USD micro-trend sparkline
  const sparkCv = qs('[data-spark="tao"]', root);
  const spark = sparkCv
    ? new Sparkline(sparkCv, { series: seedSeries('statusbar-tao', 14, 28) })
    : null;

  // Block height — from data layer or synthetic
  const blockEl = bind('block');
  let block = 8_186_104;
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

  // TAO price — live from CoinGecko via data layer
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
    if (priceEl) priceEl.textContent = money(305.57);
    if (deltaEl){ deltaEl.textContent = '+3.08%'; deltaEl.classList.add('up'); }
  }

  return function destroy(){
    clearInterval(blockTimer);
    blockUnsub();
    priceUnsub();
    spark?.destroy();
  };
}
