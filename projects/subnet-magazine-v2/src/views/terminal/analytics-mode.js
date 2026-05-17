/* =================================================================
   SUBNET MAGAZINE, ANALYTICS MODE (terminal mode)
   -----------------------------------------------------------------
   Pre-computed by scripts/analytics/build_analytics.py using numpy +
   pandas + scikit-learn, the analytics.json file carries:
     - 53x53 PRICE CORRELATION matrix (Pearson r of daily returns)
     - t-SNE 2D embedding of subnets by [chg24/7/30, log mcap/em/val/min]
     - K-MEANS cluster id per subnet (k=6) with human-readable labels

   This module RENDERS those analytics in pure Canvas (no library
   bloat — keeps load tight, matches the red/black neural-net theme).
   Two views, tap to switch:

     HEATMAP    53x53 correlation matrix. Hover any cell to see the
                pair + r. Black = independent, mint = correlated,
                red = anti-correlated. Tap a row label to jump that
                subnet to the global terminal selection.

     CLUSTER    t-SNE 2D scatter. Each subnet is a dot, sized by
                mcap, colored by k-means cluster. Hover for name +
                cluster label. Tap to select.

   Why Python build-time + Canvas render:
     - Static HTML site, no backend, browser can't run scikit-learn.
     - Doing it in Python keeps the analytics WORKFLOW reproducible
       (re-run the script when SUBNETS changes) without inflating
       the JS bundle with ML libraries.
     - Canvas is ~50 lines of drawing code vs a 1MB chart library.
   ================================================================= */

import { SUBNETS, subnetById } from '../../data/subnets.js';
import { escapeHtml } from '../../lib/dom.js';
import { paywallWrap, canAccess } from '../../lib/paywall.js';

/* Cache-bust URL — query stays current as long as the analytics.json
   file is regenerated; the leading `?v=` is just a hint for browser
   caches that the content can change. We deliberately do NOT pin a
   sibling-bumped version here because nightly Python regeneration
   means the file should be re-fetched any time the user opens the
   mode (cache:'no-store' below already enforces this; the query is
   just for shared CDN / proxy caches that ignore that header). */
const ANALYTICS_URL = 'src/data/analytics.json';

/* Cluster palette — 6 colors matching the magazine register.
   Reds + warm accents; cool colors only as accents.
   IMPORTANT: this array MUST be at least as long as the largest
   cluster id Python emits. Today the build script uses k=6 so 6
   colors is sufficient; if scripts/analytics/build_analytics.py
   raises k, this array must grow in lockstep or clusters 6+ will
   silently alias clusters 0+ via the modulo below. */
const CLUSTER_COLORS = [
  '#FF1E3C',  // 0 - red primary
  '#FF8094',  // 1 - red hot
  '#FFB85C',  // 2 - amber
  '#FF4D60',  // 3 - red soft
  '#00E5A8',  // 4 - mint (cool accent, sparingly)
  '#C8A8AD',  // 5 - rose ink
];

const CAT_LABEL = {
  text:'TEXT', vision:'VISION', audio:'AUDIO', video:'VIDEO',
  multimodal:'MULTI', training:'TRAIN', data:'DATA',
  search:'SRCH', finance:'FIN', agents:'AGENT',
  robotics:'ROBO', science:'SCI', infra:'INFRA',
  prediction:'PRED',
};

let cachedAnalytics = null;

async function loadAnalytics(){
  if (cachedAnalytics) return cachedAnalytics;
  try {
    const res = await fetch(ANALYTICS_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error(`analytics: HTTP ${res.status}`);
    cachedAnalytics = await res.json();
    return cachedAnalytics;
  } catch (e) {
    console.warn('[analytics-mode] failed to load:', e?.message);
    return null;
  }
}

/* ---------- HEATMAP drawing ---------------------------------- */
/* Draws a 53x53 grid; each cell = correlation between two subnets.
   Color: black at r=0, mint→bright-mint as r→+1, red→bright-red as
   r→-1. Diagonal is r=1 by construction (self).
   Returns { hitTest(x, y) -> {i, j, r, ai, bi} | null } so the caller
   can wire hover / click. */
function drawHeatmap(canvas, analytics){
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();
  const W = Math.max(280, rect.width);
  const H = Math.max(280, rect.height);
  canvas.width  = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);

  const ids = analytics.subnets;       // ordered list of netuids
  const corr = analytics.correlation;  // 53x53
  const N = ids.length;

  const PAD_L = 52, PAD_T = 52, PAD_R = 8, PAD_B = 8;
  const gridW = W - PAD_L - PAD_R;
  const gridH = H - PAD_T - PAD_B;
  const cellW = gridW / N;
  const cellH = gridH / N;

  // Color ramp for r in [-1, 1]
  const colorFor = (r) => {
    if (!Number.isFinite(r)) return 'rgba(20,5,9,1)';
    const a = Math.min(1, Math.abs(r));
    if (r >= 0){
      // mint, intensity = a
      const g = Math.round(229 * a);
      const c = Math.round(168 * a);
      return `rgb(${Math.round(0 + 5*(1-a))}, ${g + 5}, ${c + 3})`;
    } else {
      // red
      const r2 = Math.round(255 * a);
      return `rgb(${r2}, ${Math.round(30 * a)}, ${Math.round(60 * a)})`;
    }
  };

  // Cells
  for (let i = 0; i < N; i++){
    for (let j = 0; j < N; j++){
      const r = corr[i][j];
      ctx.fillStyle = colorFor(r);
      ctx.fillRect(PAD_L + j * cellW, PAD_T + i * cellH, Math.ceil(cellW), Math.ceil(cellH));
    }
  }

  // Hairline 1px grid every 10 cells for orientation
  ctx.strokeStyle = 'rgba(255,30,60,0.18)';
  ctx.lineWidth = 1;
  for (let k = 0; k <= N; k += 10){
    ctx.beginPath();
    ctx.moveTo(PAD_L + k * cellW + 0.5, PAD_T);
    ctx.lineTo(PAD_L + k * cellW + 0.5, PAD_T + gridH);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(PAD_L,            PAD_T + k * cellH + 0.5);
    ctx.lineTo(PAD_L + gridW,    PAD_T + k * cellH + 0.5);
    ctx.stroke();
  }

  // Row labels (left, vertical) + col labels (top, rotated)
  ctx.fillStyle = 'rgba(200,168,173,0.85)';
  ctx.font = '8.5px "JetBrains Mono", monospace';
  ctx.textBaseline = 'middle';
  const labelEvery = N > 30 ? 3 : 2;
  for (let i = 0; i < N; i++){
    if (i % labelEvery !== 0 && i !== N - 1) continue;
    ctx.textAlign = 'right';
    const y = PAD_T + i * cellH + cellH / 2;
    ctx.fillText('SN' + ids[i], PAD_L - 4, y);
  }
  for (let j = 0; j < N; j++){
    if (j % labelEvery !== 0 && j !== N - 1) continue;
    const x = PAD_L + j * cellW + cellW / 2;
    ctx.save();
    ctx.translate(x, PAD_T - 4);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'left';
    ctx.fillText('SN' + ids[j], 0, 0);
    ctx.restore();
  }

  // Corner label
  ctx.fillStyle = 'rgba(255,30,60,0.7)';
  ctx.font = '9px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('CORR · 90d', 4, 4);

  // Hit test for hover / click
  return {
    hitTest(px, py){
      const j = Math.floor((px - PAD_L) / cellW);
      const i = Math.floor((py - PAD_T) / cellH);
      if (i < 0 || i >= N || j < 0 || j >= N) return null;
      return { i, j, ai: ids[i], bi: ids[j], r: corr[i][j] };
    },
    grid: { PAD_L, PAD_T, cellW, cellH, N, ids },
  };
}

/* ---------- t-SNE CLUSTER MAP drawing ------------------------ */
/* Each subnet is a dot at its t-SNE 2D position, sized by mcap,
   colored by k-means cluster id. */
function drawClusterMap(canvas, analytics){
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();
  const W = Math.max(280, rect.width);
  const H = Math.max(280, rect.height);
  canvas.width  = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);

  const PAD = 30;
  const inner = { x: PAD, y: PAD, w: W - PAD * 2, h: H - PAD * 2 };

  // Background grid: subtle red, just for orientation
  ctx.strokeStyle = 'rgba(255,30,60,0.06)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 8; i++){
    const x = inner.x + (i / 8) * inner.w;
    const y = inner.y + (i / 8) * inner.h;
    ctx.beginPath(); ctx.moveTo(x, inner.y); ctx.lineTo(x, inner.y + inner.h); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(inner.x, y); ctx.lineTo(inner.x + inner.w, y); ctx.stroke();
  }

  // Axes (origin = center)
  ctx.strokeStyle = 'rgba(255,30,60,0.30)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(inner.x + inner.w/2, inner.y); ctx.lineTo(inner.x + inner.w/2, inner.y + inner.h); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(inner.x, inner.y + inner.h/2); ctx.lineTo(inner.x + inner.w, inner.y + inner.h/2); ctx.stroke();

  // Compute on-canvas positions + radii
  const dots = [];
  const mcaps = analytics.subnets.map(id => {
    const s = subnetById(id);
    return s ? Math.max(1, s.mcap) : 1;
  });
  const mcapMax = Math.max(...mcaps);
  for (const id of analytics.subnets){
    const tsne = analytics.tsne[String(id)];
    if (!tsne) continue;
    const x = inner.x + ((tsne[0] + 1) / 2) * inner.w;
    const y = inner.y + ((tsne[1] + 1) / 2) * inner.h;
    const s = subnetById(id) || { mcap: 1, name: 'SN'+id, cat: 'data' };
    const r = 4 + 10 * Math.sqrt(s.mcap / mcapMax);
    const cluster = analytics.cluster[String(id)] || 0;
    dots.push({ id, x, y, r, cluster, name: s.name, cat: s.cat });
  }

  // Draw dots (sort by size so big ones don't get hidden under small ones)
  dots.sort((a, b) => b.r - a.r);
  for (const d of dots){
    const color = CLUSTER_COLORS[d.cluster % CLUSTER_COLORS.length];
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.fillStyle = color + 'cc'; // ~80% alpha
    ctx.fill();
    ctx.strokeStyle = '#050203';
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }

  // SN# labels on the biggest 12 dots
  dots.slice(0, 12).forEach(d => {
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 9px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SN' + d.id, d.x, d.y);
  });

  // Cluster legend, bottom-left
  ctx.font = '9.5px "JetBrains Mono", monospace';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  Object.entries(analytics.cluster_labels).forEach(([cid, label], i) => {
    const x = inner.x + 4;
    const y = inner.y + inner.h - 12 - i * 14;
    const c = CLUSTER_COLORS[Number(cid) % CLUSTER_COLORS.length];
    ctx.fillStyle = c;
    ctx.fillRect(x, y - 4, 8, 8);
    ctx.fillStyle = 'rgba(245,229,232,0.85)';
    ctx.fillText(label, x + 14, y);
  });

  // Title corner
  ctx.fillStyle = 'rgba(255,30,60,0.7)';
  ctx.font = '9px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('t-SNE · clustered by behavior', inner.x + 4, inner.y + 4);

  return {
    hitTest(px, py){
      // Find closest dot within its radius
      let best = null, bestD = Infinity;
      for (const d of dots){
        const dx = px - d.x, dy = py - d.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist <= d.r + 4 && dist < bestD){
          bestD = dist;
          best = d;
        }
      }
      return best;
    },
  };
}

/* ---------- mode mount -------------------------------------- */

/* ---------- INSIGHT renderers (BlackRock-grade "so what") --- */
/* Each tab gets a paired insights panel that translates the chart
   into a portfolio decision. No chart in this terminal exists just
   for picture-value — each one needs an actionable read attached.
   Renderers return HTML strings the mode's right column consumes. */

function fmtR(r){
  const sign = r >= 0 ? '+' : '';
  return sign + r.toFixed(2);
}
function rClass(r){
  if (r >= 0.6)  return 'is-warn';
  if (r >= 0.3)  return 'is-info';
  if (r <= -0.2) return 'is-good';
  return 'is-flat';
}

function renderHeatmapInsights(analytics){
  const ins = analytics.insights || {};
  const conc = (ins.concentration || []).slice(0, 5);
  const div  = (ins.diversifiers  || []).slice(0, 5);

  const concRows = conc.length ? conc.map(p => `
    <li class="ins-pair">
      <span class="ins-pair__sn">SN${p.a}</span>
      <span class="ins-pair__name">${escapeHtml(p.aName)}</span>
      <span class="ins-pair__x">×</span>
      <span class="ins-pair__sn">SN${p.b}</span>
      <span class="ins-pair__name">${escapeHtml(p.bName)}</span>
      <span class="ins-pair__r ${rClass(p.r)}">r ${fmtR(p.r)}</span>
    </li>`).join('') : `<li class="ins-empty">No pairs above r=0.6.</li>`;

  const divRows = div.length ? div.map(p => `
    <li class="ins-pair">
      <span class="ins-pair__sn">SN${p.a}</span>
      <span class="ins-pair__name">${escapeHtml(p.aName)}</span>
      <span class="ins-pair__x">×</span>
      <span class="ins-pair__sn">SN${p.b}</span>
      <span class="ins-pair__name">${escapeHtml(p.bName)}</span>
      <span class="ins-pair__r ${rClass(p.r)}">r ${fmtR(p.r)}</span>
    </li>`).join('') : `<li class="ins-empty">No negative-r pairs in scope.</li>`;

  return `
    <div class="ins-section">
      <div class="ins-section__h">⊕ CONCENTRATION RISK</div>
      <div class="ins-section__sub">Pairs with r &gt; 0.6 — holding BOTH gives near-zero diversification. Pick one or hedge with a diversifier below.</div>
      <ul class="ins-list">${concRows}</ul>
    </div>
    <div class="ins-section">
      <div class="ins-section__h">⊕ DIVERSIFIERS</div>
      <div class="ins-section__sub">Lowest-correlation pairs in the network. Holding both reduces portfolio variance.</div>
      <ul class="ins-list">${divRows}</ul>
    </div>
    <div class="ins-section">
      <div class="ins-section__h">⊕ NETWORK CONCENTRATION</div>
      <div class="ins-kpi-row">
        <div class="ins-kpi">
          <div class="ins-kpi__lbl">HHI · emission</div>
          <div class="ins-kpi__val">${(ins.emission_hhi || 0).toFixed(3)}</div>
          <div class="ins-kpi__note">1/53 = 0.019 (perfect equal weight)</div>
        </div>
        <div class="ins-kpi">
          <div class="ins-kpi__lbl">EFFECTIVE N</div>
          <div class="ins-kpi__val">${(ins.effective_n || 0).toFixed(1)}</div>
          <div class="ins-kpi__note">of ${analytics.subnets.length} active subnets</div>
        </div>
      </div>
    </div>`;
}

function renderClusterInsights(analytics, ctx){
  const ins = analytics.insights || {};
  const labels = analytics.cluster_labels || {};
  const sel = ctx?.selectedId;
  const selCluster = sel != null ? analytics.cluster[String(sel)] : null;
  const selClusterLabel = selCluster != null ? labels[String(selCluster)] : null;
  const sub = subnetById(sel);

  // Cluster sizes
  const sizes = {};
  Object.entries(analytics.cluster || {}).forEach(([nid, cid]) => {
    sizes[cid] = (sizes[cid] || 0) + 1;
  });
  const clusterRows = Object.entries(labels).map(([cid, lab]) => `
    <li class="ins-row">
      <span class="ins-row__lbl">cluster ${escapeHtml(cid)}</span>
      <span class="ins-row__val">${escapeHtml(lab)}</span>
      <span class="ins-row__n">${sizes[cid] || 0} subnets</span>
    </li>`).join('');

  // Sharpe leaders inside selected cluster
  let sharpeInClusterHtml = '';
  if (selCluster != null){
    const members = analytics.subnets
      .filter(id => analytics.cluster[String(id)] === selCluster)
      .map(id => {
        const r = analytics.risk[String(id)];
        return r ? { id, name: analytics.names[String(id)], ...r } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.sharpe - a.sharpe)
      .slice(0, 5);
    sharpeInClusterHtml = `
      <div class="ins-section">
        <div class="ins-section__h">⊕ BEST SHARPE IN CLUSTER</div>
        <div class="ins-section__sub">Top risk-adjusted returns within &quot;${escapeHtml(selClusterLabel || '·')}&quot; — peer comparison for SN${sel} ${escapeHtml(sub?.name || '')}.</div>
        <ul class="ins-list">${members.map(m => `
          <li class="ins-pair">
            <span class="ins-pair__sn">SN${m.id}</span>
            <span class="ins-pair__name">${escapeHtml(m.name)}</span>
            <span class="ins-pair__r ${m.sharpe >= 5 ? 'is-good' : (m.sharpe >= 2 ? 'is-info' : 'is-flat')}">Sharpe ${Number.isFinite(m.sharpe) ? m.sharpe.toFixed(2) : '·'}</span>
          </li>`).join('')}</ul>
      </div>`;
  }

  return `
    <div class="ins-section">
      <div class="ins-section__h">⊕ CLUSTER MAP</div>
      <div class="ins-section__sub">k-means on 7 behavioral features. Subnets in the same cluster move together — useful for substitution analysis (swap one for another, similar exposure).</div>
      <ul class="ins-list">${clusterRows}</ul>
    </div>
    ${sharpeInClusterHtml}`;
}

function renderRiskScreen(analytics, sortKey, sortDir){
  const risk = analytics.risk || {};
  const rows = Object.entries(risk)
    .map(([nid, r]) => r ? { netuid: Number(nid), name: analytics.names[nid], ...r } : null)
    .filter(Boolean);
  rows.sort((a, b) => {
    const av = a[sortKey] ?? 0, bv = b[sortKey] ?? 0;
    return sortDir === 'asc' ? av - bv : bv - av;
  });

  const cols = [
    { key: 'name',    lbl: 'NAME',       align: 'left'  },
    { key: 'ann_ret', lbl: 'ANN RET %',  align: 'right' },
    { key: 'ann_vol', lbl: 'ANN VOL %',  align: 'right' },
    { key: 'sharpe',  lbl: 'SHARPE',     align: 'right' },
    { key: 'max_dd',  lbl: 'MAX DD %',   align: 'right' },
    { key: 'beta',    lbl: 'β vs NET',   align: 'right' },
  ];

  const head = cols.map(c => `
    <th class="risk-th risk-th--${c.align} ${c.key === sortKey ? 'is-sort' : ''}" data-sort-key="${c.key}">
      ${c.lbl}${c.key === sortKey ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''}
    </th>`).join('');

  const valCls = (k, v) => {
    if (k === 'ann_ret') return v >= 0 ? 'is-up' : 'is-down';
    if (k === 'max_dd')  return 'is-down';
    if (k === 'sharpe')  return v >= 2 ? 'is-up' : (v <= 0 ? 'is-down' : '');
    if (k === 'beta')    return Math.abs(v - 1) <= 0.3 ? '' : (v > 1 ? 'is-down' : 'is-up');
    return '';
  };

  /* Defensive number formatting: a missing or NaN metric should
     render '·', not crash the row. Without these guards, one stale
     analytics.json row with a partial record killed the whole
     table. */
  const num = (v, d = 0, prefix = '') =>
    Number.isFinite(v)
      ? prefix + (v >= 0 && prefix === '+' ? v.toFixed(d) : v.toFixed(d))
      : '·';

  const body = rows.map(r => `
    <tr class="risk-tr" data-risk-row="${r.netuid}">
      <td class="risk-td risk-td--name">
        <span class="risk-td__sn">SN${r.netuid}</span>
        <span class="risk-td__nm">${escapeHtml(r.name || ('SN' + r.netuid))}</span>
      </td>
      <td class="risk-td risk-td--num ${valCls('ann_ret', r.ann_ret)}">${Number.isFinite(r.ann_ret) ? ((r.ann_ret >= 0 ? '+' : '') + r.ann_ret.toFixed(0) + '%') : '·'}</td>
      <td class="risk-td risk-td--num">${num(r.ann_vol)}${Number.isFinite(r.ann_vol) ? '%' : ''}</td>
      <td class="risk-td risk-td--num ${valCls('sharpe', r.sharpe)}">${num(r.sharpe, 2)}</td>
      <td class="risk-td risk-td--num ${valCls('max_dd', r.max_dd)}">${num(r.max_dd)}${Number.isFinite(r.max_dd) ? '%' : ''}</td>
      <td class="risk-td risk-td--num ${valCls('beta', r.beta)}">${num(r.beta, 2)}</td>
    </tr>`).join('');

  return `
    <div class="risk-screen">
      <table class="risk-table">
        <thead>
          <tr>${head}</tr>
        </thead>
        <tbody>${body}</tbody>
      </table>
      <div class="risk-screen__legend">
        <span><b>Sharpe</b> — daily-return-based, annualized; risk-free assumed 0% (compares INSIDE the network, not vs treasuries)</span>
        <span><b>Max DD</b> — worst peak-to-trough drawdown over the 90-day window</span>
        <span><b>β vs NET</b> — beta to equal-weighted network index; 1.0 = moves with the network, &gt;1 = amplified, &lt;1 = damped</span>
      </div>
    </div>`;
}

/* ---------- mount ------------------------------------------- */

export function mountAnalyticsMode(root, ctx){
  let view = 'heatmap';   // 'heatmap' | 'cluster' | 'risk'
  let analytics = null;
  let hit = null;
  let resizeTick = 0;
  let riskSort = { key: 'sharpe', dir: 'desc' };

  root.innerHTML = `
    <div class="analytics" data-analytics-root>
      <div class="analytics__head">
        <div class="analytics__title">
          <span class="analytics__eyebrow">⊕ ANALYTICS · numpy + sklearn (build-time) → Canvas (live) · BlackRock-grade reads</span>
          <h2 class="analytics__h" data-analytics-title>SUBNET CORRELATION MATRIX · 90d</h2>
          <div class="analytics__sub" data-analytics-sub>Pearson r of daily returns across all 53 subnets. Mint = move together, red = move opposite, black = independent.</div>
        </div>
        <div class="analytics__tabs" role="tablist" aria-label="Analytics view">
          <button type="button" class="analytics__tab is-on" data-view="heatmap" role="tab" aria-selected="true"  aria-controls="analytics-body">CORRELATION</button>
          <button type="button" class="analytics__tab"        data-view="cluster" role="tab" aria-selected="false" aria-controls="analytics-body">t-SNE CLUSTER</button>
          <button type="button" class="analytics__tab"        data-view="risk"    role="tab" aria-selected="false" aria-controls="analytics-body">RISK SCREEN</button>
        </div>
      </div>
      <div class="analytics__body" data-analytics-body id="analytics-body" role="tabpanel">
        <div class="analytics__canvas-wrap" data-analytics-canvas-wrap>
          <canvas class="analytics__canvas" data-analytics-canvas></canvas>
          <div class="analytics__hover" data-analytics-hover style="display:none"></div>
        </div>
        <aside class="analytics__insights" data-analytics-insights>
          <div class="ins-empty">loading…</div>
        </aside>
      </div>
      <div class="analytics__footer">
        <span class="analytics__meta" data-analytics-meta>loading analytics.json…</span>
      </div>
    </div>`;

  const sec       = root.querySelector('[data-analytics-root]');
  const body      = root.querySelector('[data-analytics-body]');
  const canvasWrap= root.querySelector('[data-analytics-canvas-wrap]');
  const canvas    = root.querySelector('[data-analytics-canvas]');
  const title     = root.querySelector('[data-analytics-title]');
  const sub       = root.querySelector('[data-analytics-sub]');
  const hoverEl   = root.querySelector('[data-analytics-hover]');
  const metaEl    = root.querySelector('[data-analytics-meta]');
  const insightsEl= root.querySelector('[data-analytics-insights]');

  const renderRiskTable = () => {
    canvasWrap.style.display = 'none';
    insightsEl.style.display = 'none';
    body.classList.add('analytics__body--risk');
    /* Replace body content with the table; preserve canvas + insights
       elements in DOM (just hidden) so swapping tabs is fast.
       PRO-gated: OBSERVER readers see the table behind a soft paywall
       so they know what they'd unlock; PRO sees it fully interactive. */
    let oldTable = body.querySelector('.risk-screen');
    if (oldTable) oldTable.remove();
    let oldPaywall = body.querySelector('.paywall');
    if (oldPaywall) oldPaywall.remove();
    const tableHtml = renderRiskScreen(analytics, riskSort.key, riskSort.dir);
    const wrapped = paywallWrap(tableHtml, {
      requires: 'pro',
      feature:  'RISK SCREEN · all 53 subnets',
      pitch:    'Sortable annualized return, vol, Sharpe, max drawdown, and beta to network. The screen institutional desks run first.',
    });
    body.insertAdjacentHTML('beforeend', wrapped);
    if (!canAccess('pro')) return; // paywall in place; skip wiring interactions
    /* Wire column-header sort */
    body.querySelectorAll('.risk-th[data-sort-key]').forEach(th => {
      th.addEventListener('click', () => {
        const k = th.dataset.sortKey;
        if (k === riskSort.key) riskSort.dir = riskSort.dir === 'asc' ? 'desc' : 'asc';
        else { riskSort.key = k; riskSort.dir = (k === 'name' ? 'asc' : 'desc'); }
        renderRiskTable();
      });
    });
    /* Click row jumps to subnet across the terminal */
    body.querySelectorAll('[data-risk-row]').forEach(r => {
      r.addEventListener('click', () => {
        const id = parseInt(r.dataset.riskRow, 10);
        if (Number.isFinite(id) && typeof ctx?.select === 'function') ctx.select(id);
      });
    });
  };

  const drawAndWire = () => {
    if (!analytics) return;

    /* Tear down any prior risk-screen DOM */
    const stale = body.querySelector('.risk-screen');
    if (stale) stale.remove();
    body.classList.remove('analytics__body--risk');
    canvasWrap.style.display = '';
    insightsEl.style.display = '';

    if (view === 'heatmap'){
      title.textContent = 'SUBNET CORRELATION MATRIX · 90d';
      sub.textContent   = 'Pearson r of daily returns across all 53 subnets. Mint = move together, red = move opposite, black = independent.';
      hit = drawHeatmap(canvas, analytics);
      insightsEl.innerHTML = renderHeatmapInsights(analytics);
    } else if (view === 'cluster'){
      title.textContent = 'BEHAVIORAL CLUSTER MAP · t-SNE';
      sub.textContent   = 'Each dot is a subnet, positioned by 7-feature similarity (chg24/7/30, log mcap/emission/validators/miners). Color = k-means cluster, size = market cap.';
      hit = drawClusterMap(canvas, analytics);
      insightsEl.innerHTML = renderClusterInsights(analytics, ctx);
    } else if (view === 'risk'){
      title.textContent = 'RISK SCREEN · 90d';
      sub.textContent   = 'Per-subnet annualized return, vol, Sharpe, max drawdown, beta to network. Sort any column. Click a row to load that subnet across the terminal.';
      renderRiskTable();
    }
    metaEl.textContent = `generated ${new Date(analytics.generated_at).toISOString().slice(0,10)} · ${analytics.subnets.length} subnets · ${Object.keys(analytics.cluster_labels).length} clusters · risk metrics on 90d daily returns`;
  };

  // Tab swap — keep aria-selected in sync with .is-on so screen
  // readers know which view is current.
  sec.querySelectorAll('[data-view]').forEach(b => {
    b.addEventListener('click', () => {
      view = b.dataset.view;
      sec.querySelectorAll('[data-view]').forEach(o => {
        const on = o.dataset.view === view;
        o.classList.toggle('is-on', on);
        o.setAttribute('aria-selected', String(on));
      });
      drawAndWire();
    });
  });

  // Hover tooltip + click-to-select
  const onMove = (ev) => {
    if (!hit) return;
    const r = canvas.getBoundingClientRect();
    const x = ev.clientX - r.left, y = ev.clientY - r.top;
    const h = hit.hitTest(x, y);
    if (!h){ hoverEl.style.display = 'none'; return; }
    let text;
    if (view === 'heatmap'){
      const a = subnetById(h.ai), b = subnetById(h.bi);
      const sign = h.r >= 0 ? '+' : '';
      text = `SN${h.ai} ${a?.name || ''} × SN${h.bi} ${b?.name || ''} · r=${sign}${h.r.toFixed(2)}`;
    } else {
      const cluster = analytics.cluster_labels[String(h.cluster)] || '·';
      text = `SN${h.id} ${h.name} · ${CAT_LABEL[h.cat] || h.cat} · cluster: ${cluster}`;
    }
    hoverEl.textContent = text;
    hoverEl.style.display = 'block';
    /* Position above the cursor; clamp to canvas */
    const left = Math.max(4, Math.min(r.width - 280, x + 12));
    const top  = Math.max(4, y - 28);
    hoverEl.style.left = left + 'px';
    hoverEl.style.top  = top + 'px';
  };
  const onLeave = () => { hoverEl.style.display = 'none'; };
  const onClick = (ev) => {
    if (!hit) return;
    const r = canvas.getBoundingClientRect();
    const x = ev.clientX - r.left, y = ev.clientY - r.top;
    const h = hit.hitTest(x, y);
    if (!h) return;
    if (view === 'heatmap'){
      // Click a row jumps that subnet (i = row)
      if (typeof ctx?.select === 'function') ctx.select(h.ai);
    } else {
      if (typeof ctx?.select === 'function') ctx.select(h.id);
    }
  };
  canvas.addEventListener('mousemove', onMove);
  canvas.addEventListener('mouseleave', onLeave);
  canvas.addEventListener('click', onClick);

  // Redraw on resize
  const onResize = () => {
    if (resizeTick) return;
    resizeTick = requestAnimationFrame(() => { resizeTick = 0; drawAndWire(); });
  };
  window.addEventListener('resize', onResize);

  // Kick off async load
  loadAnalytics().then(a => {
    if (!a){
      metaEl.textContent = 'analytics.json not available — run scripts/analytics/build_analytics.py';
      return;
    }
    analytics = a;
    drawAndWire();
  });

  return () => {
    canvas.removeEventListener('mousemove', onMove);
    canvas.removeEventListener('mouseleave', onLeave);
    canvas.removeEventListener('click', onClick);
    window.removeEventListener('resize', onResize);
  };
}
