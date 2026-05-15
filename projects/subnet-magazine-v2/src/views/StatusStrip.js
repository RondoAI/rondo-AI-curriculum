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
import { money, pct, deltaClass } from '../lib/format.js';
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
        <span class="statusbar__field" title="Chain block height · finalised">
          <span class="statusbar__label">BLK</span>
          <span class="statusbar__value mono" data-bind="block">—</span>
        </span>
        <span class="statusbar__field" title="Network emission per day">
          <span class="statusbar__label">EMIT</span>
          <span class="statusbar__value mono">3,600<span class="statusbar__unit"><span class="tau">τ</span>/d</span></span>
        </span>
        <span class="statusbar__field" title="Share of supply staked · live from TMC">
          <span class="statusbar__label">STAKED</span>
          <span class="statusbar__value mono" data-bind="staked">66.9%</span>
          <span class="statusbar__bar" aria-hidden="true"><span data-bind="staked-bar" style="width:67%"></span></span>
        </span>

        <span class="statusbar__push"></span>

        <span class="statusbar__quote" title="τ/USD · live from CoinGecko via TMC">
          <span class="pair"><span class="tao-mark">τ</span>/USD</span>
          <span class="price" data-bind="tao-price">—</span>
          <span class="statusbar__spark"><canvas data-spark="tao"></canvas></span>
          <span class="delta" data-bind="tao-delta">—</span>
        </span>
        <span class="statusbar__field" title="TAO market cap · live from TMC">
          <span class="statusbar__label">MCAP</span>
          <span class="statusbar__value mono" data-bind="mcap">—</span>
        </span>
        <span class="statusbar__quote" title="Yuma Composite Index">
          <span class="pair">YCX</span>
          <span class="price">1,004.89</span>
          <span class="delta up">+0.49%</span>
        </span>
      </div>
    </div>
  `);

  const bind = sel => qs(`[data-bind="${sel}"]`, root);

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

  /* TAO market — mcap, 24h vol, staked%, all live from TMC. The
     hardcoded fallbacks render until the first feed lands. */
  const mcapEl     = bind('mcap');
  const volEl      = bind('vol');
  const stakedEl   = bind('staked');
  const stakedBar  = bind('staked-bar');
  function compact(n){
    const a = Math.abs(n);
    if (a >= 1e12) return '$' + (n/1e12).toFixed(2) + 'T';
    if (a >= 1e9)  return '$' + (n/1e9).toFixed(2) + 'B';
    if (a >= 1e6)  return '$' + (n/1e6).toFixed(1) + 'M';
    if (a >= 1e3)  return '$' + (n/1e3).toFixed(1) + 'K';
    return '$' + n.toFixed(0);
  }
  let marketUnsub = () => {};
  if (dataLayer){
    marketUnsub = dataLayer.subscribe('tao:market', (d) => {
      if (!d) return;
      if (mcapEl   && d.marketCap   != null) setLive(mcapEl,   compact(d.marketCap));
      if (volEl    && d.volume24h   != null) setLive(volEl,    compact(d.volume24h));
      if (stakedEl && d.stakedPct   != null){
        setLive(stakedEl, d.stakedPct.toFixed(1) + '%');
        if (stakedBar) stakedBar.style.width = d.stakedPct.toFixed(1) + '%';
      }
    });
  } else {
    if (mcapEl)   mcapEl.textContent   = '$3.29B';
    if (volEl)    volEl.textContent    = '$48.2M';
    if (stakedEl) stakedEl.textContent = '63.0%';
  }

  return function destroy(){
    clearInterval(blockTimer);
    blockUnsub();
    priceUnsub();
    marketUnsub();
    spark?.destroy();
  };
}
