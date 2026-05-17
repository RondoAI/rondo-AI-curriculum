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

const ANALYTICS_URL = 'src/data/analytics.json?v=20260520o';

/* Cluster palette — 6 colors matching the magazine register.
   Reds + warm accents; cool colors only as accents. */
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

export function mountAnalyticsMode(root, ctx){
  let view = 'heatmap';   // 'heatmap' | 'cluster'
  let analytics = null;
  let hit = null;
  let resizeTick = 0;

  root.innerHTML = `
    <div class="analytics" data-analytics-root>
      <div class="analytics__head">
        <div class="analytics__title">
          <span class="analytics__eyebrow">⊕ ANALYTICS · numpy + sklearn (build-time) → Canvas (live)</span>
          <h2 class="analytics__h" data-analytics-title>SUBNET CORRELATION MATRIX · 90d</h2>
          <div class="analytics__sub" data-analytics-sub>Pearson r of daily returns across all 53 subnets. Mint = move together, red = move opposite, black = independent.</div>
        </div>
        <div class="analytics__tabs" role="tablist">
          <button type="button" class="analytics__tab is-on" data-view="heatmap">CORRELATION</button>
          <button type="button" class="analytics__tab" data-view="cluster">t-SNE CLUSTER</button>
        </div>
      </div>
      <div class="analytics__canvas-wrap">
        <canvas class="analytics__canvas" data-analytics-canvas></canvas>
        <div class="analytics__hover" data-analytics-hover style="display:none"></div>
      </div>
      <div class="analytics__footer">
        <span class="analytics__meta" data-analytics-meta>loading analytics.json…</span>
      </div>
    </div>`;

  const sec      = root.querySelector('[data-analytics-root]');
  const canvas   = root.querySelector('[data-analytics-canvas]');
  const title    = root.querySelector('[data-analytics-title]');
  const sub      = root.querySelector('[data-analytics-sub]');
  const hoverEl  = root.querySelector('[data-analytics-hover]');
  const metaEl   = root.querySelector('[data-analytics-meta]');

  const drawAndWire = () => {
    if (!analytics) return;
    if (view === 'heatmap'){
      title.textContent = 'SUBNET CORRELATION MATRIX · 90d';
      sub.textContent   = 'Pearson r of daily returns across all 53 subnets. Mint = move together, red = move opposite, black = independent.';
      hit = drawHeatmap(canvas, analytics);
    } else {
      title.textContent = 'BEHAVIORAL CLUSTER MAP · t-SNE';
      sub.textContent   = 'Each dot is a subnet, positioned by 7-feature similarity (chg24/7/30, log mcap/emission/validators/miners). Color = k-means cluster, size = market cap.';
      hit = drawClusterMap(canvas, analytics);
    }
    metaEl.textContent = `generated ${new Date(analytics.generated_at).toISOString().slice(0,10)} · ${analytics.subnets.length} subnets · ${Object.keys(analytics.cluster_labels).length} clusters`;
  };

  // Tab swap
  sec.querySelectorAll('[data-view]').forEach(b => {
    b.addEventListener('click', () => {
      view = b.dataset.view;
      sec.querySelectorAll('[data-view]').forEach(o => o.classList.toggle('is-on', o.dataset.view === view));
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
