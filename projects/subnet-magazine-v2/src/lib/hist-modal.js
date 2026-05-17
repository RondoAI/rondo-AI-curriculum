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
import { ARTICLES } from '../data/articles.js';
import { recentOracleArticles } from '../data/oracle-articles.js';
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

  /* Editorial annotations for this subnet — drives the news-flag
     overlay on the chart. Built once per modal open; the overlay
     re-renders when range changes (different bars cover different
     date windows, so some markers may scroll out of view). */
  const annotations = annotationsForSubnet(subnet.netuid);

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
    /* News-flag overlay: amber vertical hairlines at article dates,
       hover for tooltip. Re-rendered on range change since each
       range covers a different date window. */
    renderAnnotations(root, annotations, r);
  }
  buildChart(range);

  /* Keep the overlay aligned on viewport resize. The candle chart
     itself handles ResizeObserver internally; we just re-position
     the markers when the canvas dimensions change. */
  const ro = new ResizeObserver(() => renderAnnotations(root, annotations, currentRange));
  const canvasEl = qs('.histm__canvas', root);
  if (canvasEl) ro.observe(canvasEl);
  let currentRange = range;

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
    currentRange = next;
    root.querySelectorAll('[data-histm-range]').forEach(b =>
      b.classList.toggle('is-on', b.dataset.histmRange === id));
    buildChart(next);
  }

  document.addEventListener('keydown', onKey);
  root.addEventListener('click', onClick);
  setTimeout(() => qs('.histm__close', root)?.focus(), 0);

  function close(){
    if (chart && typeof chart.destroy === 'function') chart.destroy();
    if (ro) ro.disconnect();
    document.removeEventListener('keydown', onKey);
    document.body.style.overflow = prevOverflow;
    root.remove();
    active = null;
  }
  return { close };
}

/* ---------- annotations ----------------------------------- */

/**
 * Build the editorial-event list for a subnet: every in-house
 * article + every oracle dispatch that names this subnet, each
 * carrying { date, title, kind, href }. Drives the news-flag
 * overlay on the chart.
 * @param {number} netuid
 */
function annotationsForSubnet(netuid){
  const out = [];
  for (const a of ARTICLES){
    const sn = parseInt(a.subnet, 10);
    if (sn === netuid){
      out.push({
        date: a.date,
        title: a.title,
        kind: 'mag',
        href: a.pdf || a.externalUrl || '',
      });
    }
  }
  for (const a of recentOracleArticles(Infinity)){
    if (a.subnetId === netuid){
      out.push({
        date: a.date,
        title: a.title,
        kind: 'oracle',
        href: a.pdf || '',
      });
    }
  }
  /* Sort by date ascending — left-to-right on the chart. */
  return out.sort((x, y) => (x.date || '').localeCompare(y.date || ''));
}

/**
 * Render or re-render the amber news-flag overlay. The overlay is
 * an SVG positioned absolutely over the canvas. Each annotation
 * becomes a vertical hairline + a clickable marker dot at top,
 * with a tooltip wired via title attribute (also a custom DOM
 * tooltip for richer content).
 *
 * We compute x positions from the chart's time range:
 *   x = ((annotationTime - chartStart) / (chartEnd - chartStart)) * canvasWidth
 * Annotations outside the visible window are filtered out.
 *
 * @param {HTMLElement} root         the modal root
 * @param {Array}       annotations  result of annotationsForSubnet()
 * @param {{bars:number,barMs:number}} range  active range spec
 */
function renderAnnotations(root, annotations, range){
  const overlay = qs('.histm__annot', root);
  const canvas  = qs('.histm__canvas', root);
  if (!overlay || !canvas) return;
  if (!annotations || !annotations.length){
    overlay.innerHTML = '';
    return;
  }

  /* Canvas client size (CSS px). The CandleChart class draws at
     device-pixel-ratio internally but the canvas element's CSS
     dimensions are what the overlay needs to align to. */
  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) { overlay.innerHTML = ''; return; }

  const now      = Date.now();
  const span     = range.bars * range.barMs;
  const chartT0  = now - span;
  /* Chart's own internal padding for axes — keep in sync with
     CandleChart.draw() (padL=56, padR=12, padT=26, padB=30).
     Annotations should sit inside the plot area, not over the
     axis labels. */
  const padL = 56, padR = 12, padT = 26, padB = 30;
  const plotL = padL;
  const plotR = rect.width  - padR;
  const plotT = padT;
  const plotB = rect.height - padB;
  const plotW = plotR - plotL;
  const plotH = plotB - plotT;

  const visible = annotations
    .map(a => {
      const t = Date.parse(a.date + 'T12:00:00Z');
      if (!Number.isFinite(t)) return null;
      const frac = (t - chartT0) / span;
      if (frac < 0 || frac > 1) return null;
      const x = plotL + frac * plotW;
      return { ...a, t, x };
    })
    .filter(Boolean);

  if (!visible.length){
    overlay.innerHTML = `<div class="histm__annot-empty">No editorial dispatches in this ${range.label.split(' ')[0]} window. Switch range to see longer history.</div>`;
    return;
  }

  /* Stagger overlapping flags vertically so adjacent dates don't
     collide. We don't reposition x (it has to mean date), but the
     marker dot pops up to a higher offset when its x is within 18px
     of a previous marker. */
  let lastX = -Infinity;
  let lane  = 0;
  const lanes = [];
  for (const v of visible){
    if (v.x - lastX < 18) lane = (lane + 1) % 3; else lane = 0;
    lanes.push(lane);
    lastX = v.x;
  }

  const markersSvg = visible.map((v, i) => {
    const dotY = plotT + 10 + lanes[i] * 12;
    const kindColor = v.kind === 'mag' ? '#FFB85C' : '#FF4D60';
    return `
      <g class="histm__annot-flag" data-annot-i="${i}">
        <line x1="${v.x.toFixed(1)}" y1="${plotT}" x2="${v.x.toFixed(1)}" y2="${plotB.toFixed(1)}"
              stroke="${kindColor}" stroke-opacity="0.42" stroke-width="0.8" stroke-dasharray="2 3" />
        <circle cx="${v.x.toFixed(1)}" cy="${dotY}" r="4" fill="${kindColor}" fill-opacity="0.9"
                stroke="#050203" stroke-width="1.4" />
        <rect x="${(v.x - 10).toFixed(1)}" y="${dotY - 8}" width="20" height="16" fill="transparent" />
      </g>`;
  }).join('');

  overlay.innerHTML = `
    <svg viewBox="0 0 ${rect.width} ${rect.height}" preserveAspectRatio="none"
         style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;">
      <g style="pointer-events:auto">${markersSvg}</g>
    </svg>
    <div class="histm__annot-tip" style="display:none" role="tooltip"></div>
  `;

  /* Hover handling — show the custom tooltip with the article title,
     date, kind, and a "READ ↗" link when hovering or focusing a
     flag. Uses the overlay's <svg> click area. */
  const tip = qs('.histm__annot-tip', overlay);
  overlay.querySelectorAll('[data-annot-i]').forEach(g => {
    const i = +g.dataset.annotI;
    const ann = visible[i];
    g.style.cursor = 'pointer';
    g.addEventListener('mouseenter', () => {
      if (!tip) return;
      tip.innerHTML = `
        <span class="histm__annot-tip__date">${escapeHtml(ann.date)} · ${ann.kind === 'mag' ? 'MAGAZINE' : 'ORACLE'}</span>
        <span class="histm__annot-tip__title">${escapeHtml(ann.title)}</span>
        ${ann.href ? `<a class="histm__annot-tip__link" href="${escapeHtml(ann.href)}" target="_blank" rel="noopener">READ ↗</a>` : ''}
      `;
      tip.style.display = '';
      /* Anchor near the marker, clamped to the overlay. */
      const ox = ann.x;
      const oy = plotT + 8 + lanes[i] * 12;
      tip.style.left = Math.max(10, Math.min(rect.width - 280, ox - 130)) + 'px';
      tip.style.top  = Math.max(2,  oy - 56) + 'px';
    });
    g.addEventListener('mouseleave', () => { if (tip) tip.style.display = 'none'; });
    g.addEventListener('click', () => {
      if (ann.href) window.open(ann.href, '_blank', 'noopener');
    });
  });
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
        <div class="histm__annot" aria-label="Editorial event annotations"></div>
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
