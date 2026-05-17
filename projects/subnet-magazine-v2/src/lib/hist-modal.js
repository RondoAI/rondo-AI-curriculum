/* =================================================================
   SUBNET MAGAZINE, HIST MODAL
   -----------------------------------------------------------------
   Historical OHLC candlestick view for a single subnet. Opens from
   the command palette:

     HIST 4              SN4, default 30D
     HIST targon 7D      Targon, 7D
     HIST SN23 1D        SN23, 1D
     HIST 4 90D          SN4, 90D

   The chart itself is CandleChart (src/charts/CandleChart.js), which
   already does the heavy lifting: DPR scaling, ResizeObserver,
   crosshair tooltip with OHLC readout, color-coded up/down candles,
   volume bars in the bottom 22%, current-price tag, dashed price
   line.

   Data, v1: synthetic seeded walk from the subnet's current price,
   deterministic per netuid so the chart is stable across opens.
   The CandleChart class supports setData(realRows) so when the TMC
   /subnets/{netuid}/line-chart adapter is wired (DataLayer already
   exposes fetchSubnetLineChart), we just convert {time, price} to
   OHLC buckets and call setData(). For v1, the synthetic walk is
   honest and labeled as such in the footer.
   ================================================================= */

import { qs, escapeHtml } from './dom.js';
import { SUBNETS } from '../data/subnets.js';
import { CandleChart } from '../charts/CandleChart.js';

let active = null;

const RANGES = [
  { id: '1D',  bars: 24, barMs:        60 * 60 * 1000, label: '1 day · hourly bars'   },
  { id: '7D',  bars: 28, barMs: 6 * 60 * 60 * 1000,    label: '7 days · 6-hour bars'  },
  { id: '30D', bars: 30, barMs: 24 * 60 * 60 * 1000,   label: '30 days · daily bars'  },
  { id: '90D', bars: 90, barMs: 24 * 60 * 60 * 1000,   label: '90 days · daily bars'  },
];

/* ---------- public API --------------------------------------- */

/**
 * Open the HIST modal for a subnet at a given range. Idempotent.
 * @param {{ netuid: number, range?: string }} opts
 */
export function openHistModal({ netuid, range = '30D' }){
  if (active) closeHistModal();
  const subnet = SUBNETS.find(s => s.netuid === netuid);
  if (!subnet){
    toast(`No subnet found for id ${netuid}. Try HIST 4 or HIST targon.`);
    return;
  }
  const r = RANGES.find(x => x.id === String(range).toUpperCase()) || RANGES[2];
  active = mount({ subnet, range: r });
}

export function closeHistModal(){
  if (active && typeof active.close === 'function') active.close();
}

/**
 * Resolve a HIST args list to {netuid, range}. Accepts the same
 * subnet-arg vocabulary the palette uses elsewhere (id, sn-id,
 * fuzzy name). Range is optional, default '30D'.
 * @param {string[]} parts
 * @returns {{netuid:number|null, range:string}}
 */
export function resolveHistArgs(parts){
  const tokens = (parts || []).filter(Boolean);
  if (!tokens.length) return { netuid: null, range: '30D' };
  /* The last token, if it matches a known range, is the range. */
  let range = '30D';
  let subTokens = tokens;
  const lastUp = (tokens[tokens.length - 1] || '').toUpperCase();
  if (RANGES.some(r => r.id === lastUp)){
    range = lastUp;
    subTokens = tokens.slice(0, -1);
  }
  /* Remaining tokens identify the subnet — usually just one. Try
     numeric / SN-id / name fuzzy in that order. */
  const t = subTokens.join(' ').trim();
  if (!t) return { netuid: null, range };
  const num = parseInt(String(t).replace(/^sn/i, ''), 10);
  if (Number.isFinite(num) && SUBNETS.find(s => s.netuid === num)){
    return { netuid: num, range };
  }
  const tl = t.toLowerCase();
  const hit = SUBNETS.find(s => (s.name || '').toLowerCase() === tl)
           || SUBNETS.find(s => (s.name || '').toLowerCase().startsWith(tl))
           || SUBNETS.find(s => (s.name || '').toLowerCase().includes(tl));
  return { netuid: hit ? hit.netuid : null, range };
}

/* ---------- mount ------------------------------------------- */

function mount({ subnet, range }){
  const root = document.createElement('div');
  root.className = 'histm';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-label', `Historical chart for SN${subnet.netuid} ${subnet.name}`);
  root.innerHTML = template(subnet, range);
  document.body.appendChild(root);
  const prevOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';

  let chart = null;
  function buildChart(r){
    if (chart && typeof chart.destroy === 'function') chart.destroy();
    const canvas = qs('.histm__canvas', root);
    if (!canvas) return;
    chart = new CandleChart(canvas, {
      bars: r.bars,
      baseline: subnet.price || 1,
      barMs: r.barMs,
      /* Deterministic per subnet so the chart is stable across
         opens — same shape every time, no flicker on reopen. */
      seed: subnet.netuid * 1009 + 7,
    });
    /* Update the footer sub-line with the new range label. */
    const sub = qs('.histm__sub', root);
    if (sub) sub.textContent = `${r.label} · synthetic seed walk from current price · live TMC line-chart adapter pending`;
  }
  buildChart(range);

  function onKey(e){
    if (e.key === 'Escape'){ e.preventDefault(); close(); return; }
    /* 1-4 quick-switch ranges */
    if (/^[1-4]$/.test(e.key)){
      const r = RANGES[parseInt(e.key, 10) - 1];
      if (r) switchTo(r.id);
    }
  }
  function onClick(e){
    if (e.target.closest('[data-histm-close]')){ close(); return; }
    const btn = e.target.closest('[data-histm-range]');
    if (btn){
      const id = btn.dataset.histmRange;
      switchTo(id);
    }
  }
  function switchTo(id){
    const next = RANGES.find(x => x.id === id);
    if (!next) return;
    root.querySelectorAll('[data-histm-range]').forEach(b =>
      b.classList.toggle('is-on', b.dataset.histmRange === id));
    buildChart(next);
  }

  document.addEventListener('keydown', onKey);
  root.addEventListener('click', onClick);
  setTimeout(() => qs('.histm__close', root)?.focus(), 0);

  function close(){
    if (chart && typeof chart.destroy === 'function') chart.destroy();
    document.removeEventListener('keydown', onKey);
    document.body.style.overflow = prevOverflow;
    root.remove();
    active = null;
  }
  return { close };
}

function template(s, r){
  const rangeBtns = RANGES.map(x =>
    `<button type="button" class="histm__range ${x.id === r.id ? 'is-on' : ''}" data-histm-range="${x.id}">${x.id}</button>`
  ).join('');
  const priceFmt = s.price == null ? '·'
    : (s.price < 1 ? '$' + s.price.toFixed(4) : '$' + s.price.toFixed(2));
  const chg24 = s.chg24;
  const chgCls = chg24 == null ? 'is-flat' : (chg24 > 0 ? 'is-up' : chg24 < 0 ? 'is-down' : 'is-flat');
  const chgStr = chg24 == null ? '·' : (chg24 >= 0 ? '+' : '') + chg24.toFixed(2) + '%';

  return `
    <div class="histm__backdrop" data-histm-close></div>
    <div class="histm__panel">
      <header class="histm__head">
        <div class="histm__title">
          <span class="histm__fcode">&lt;HIST&gt;</span>
          <span class="histm__sn">SN${s.netuid}</span>
          <span class="histm__name">${escapeHtml(s.name)}</span>
          <span class="histm__cat">${escapeHtml((s.cat || '').toUpperCase())}</span>
        </div>
        <div class="histm__price">
          <span class="histm__price-val">${priceFmt}</span>
          <span class="histm__price-chg ${chgCls}">${chgStr} 24H</span>
        </div>
        <div class="histm__ranges" role="tablist" aria-label="Range">${rangeBtns}</div>
        <button type="button" class="histm__close" data-histm-close aria-label="Close history">✕</button>
      </header>
      <div class="histm__chart-wrap">
        <canvas class="histm__canvas" aria-label="OHLC candlestick chart"></canvas>
      </div>
      <footer class="histm__foot">
        <span class="histm__sub">${escapeHtml(r.label)} · synthetic seed walk from current price · live TMC line-chart adapter pending</span>
        <span class="histm__brand">⌘ HISTORY</span>
      </footer>
    </div>
  `;
}

/* ---------- toast (matches command-palette / compare-modal) - */
function toast(msg){
  const el = document.createElement('div');
  el.className = 'cmdpal-toast';
  el.textContent = msg;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('is-vis'));
  setTimeout(() => {
    el.classList.remove('is-vis');
    setTimeout(() => el.remove(), 250);
  }, 3200);
}
