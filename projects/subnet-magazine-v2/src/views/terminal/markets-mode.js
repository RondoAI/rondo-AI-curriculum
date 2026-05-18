/* =================================================================
   SUBNET MAGAZINE, TERMINAL · MARKETS MODE
   -----------------------------------------------------------------
   The full subnet universe in a sortable, filterable master grid.
   Per the sibling's monetization plan (CLAUDE.md → Monetization &
   Pricing): MARKETS is the OBSERVER (free) tier acquisition hook —
   all 53 subnets read-only, no gating. The institutional analytics
   columns (concentration risk, capital efficiency, net flow) live
   in the PRO RISK SCREEN inside ANALYTICS mode; we render a
   compact set here.

   Per the Signal Taxonomy in CLAUDE.md, MARKETS owns these signals:
     - editorial coverage count (chip per row, from ARTICLES + oracle)
     - cluster membership (badge per row, from sibling's analytics.json)
     - basic market data (price, % change, mcap, emission, miners,
       validators — single home for these per the data-ownership rule)

   Click any row → ctx.select(netuid) updates the global terminal
   selection so every other mode reflects the pick. Sortable
   columns. Mobile collapses to cards (<880px) per the established
   anti-pattern guard (no horizontal-scroll-table inside a vertical-
   scroll page).
   ================================================================= */

import { qs, qsa, escapeHtml } from '../../lib/dom.js';
import { SUBNETS, subnetById } from '../../data/subnets.js';
import { ARTICLES } from '../../data/articles.js';
import { recentOracleArticles } from '../../data/oracle-articles.js';

const CAT_LABEL = {
  text:'TEXT', vision:'VISION', audio:'AUDIO', video:'VIDEO',
  multimodal:'MULTI', training:'TRAIN', data:'DATA',
  search:'SRCH', finance:'FIN', agents:'AGENT',
  robotics:'ROBO', science:'SCI', infra:'INFRA',
  prediction:'PRED',
};

/* Cluster palette — mirrors the analytics-mode CLUSTER_COLORS so a
   reader who's seen the cluster map in ANALYTICS recognizes the
   same color in the MARKETS row badge. If sibling's build script
   raises k beyond 6, both palettes must grow together. */
const CLUSTER_COLORS = [
  '#FF1E3C', '#FF8094', '#FFB85C',
  '#FF4D60', '#00E5A8', '#C8A8AD',
];

/* Pre-compute editorial coverage map at module load. The same
   articlesByNetuid + oracle index that Dashboard.js builds, but
   exposed once for the mode to reuse. */
const ARTICLES_BY_NETUID = (() => {
  const m = new Map();
  for (const a of ARTICLES){
    const id = a.subnet ? parseInt(a.subnet, 10) : null;
    if (!Number.isFinite(id)) continue;
    if (!m.has(id)) m.set(id, []);
    m.get(id).push(a);
  }
  return m;
})();
const ORACLE_BY_NETUID = (() => {
  const m = new Map();
  for (const a of recentOracleArticles(Infinity)){
    if (a.subnetId == null) continue;
    if (!m.has(a.subnetId)) m.set(a.subnetId, []);
    m.get(a.subnetId).push(a);
  }
  return m;
})();
const coverageCount = (id) =>
  (ARTICLES_BY_NETUID.get(id) || []).length +
  (ORACLE_BY_NETUID.get(id)   || []).length;

/* ---------- analytics loader (shared cache) ---------------- */
/* Same JSON the analytics-mode reads. Cached at module scope so
   both modes share the fetched payload during a session. */
let cachedAnalytics = null;
async function loadAnalytics(){
  if (cachedAnalytics) return cachedAnalytics;
  try {
    const res = await fetch('src/data/analytics.json', { cache: 'no-store' });
    if (!res.ok) throw new Error(`analytics: HTTP ${res.status}`);
    cachedAnalytics = await res.json();
    return cachedAnalytics;
  } catch (e){
    console.warn('[markets-mode] analytics.json unavailable:', e?.message);
    return null;
  }
}

/* ---------- public mount ----------------------------------- */

export function mountMarketsMode(root, ctx){
  if (!root) return () => {};

  const state = {
    sortKey:    'mcap',
    sortDir:    'desc',
    search:     '',
    cat:        'all',
    selectedId: ctx?.selectedId,
    analytics:  null,
  };

  /* First render with whatever subnet data is in hand. Analytics
     overlays (cluster badges) land asynchronously when the JSON
     resolves. */
  root.innerHTML = template(state);
  wire(root, state, ctx);

  loadAnalytics().then(a => {
    if (!a) return;
    state.analytics = a;
    /* Re-render the grid body in place — header + filter chips
       don't change. Row clicks continue working via the event-
       delegated listeners on the scroll + cards containers. */
    const tbody = qs('[data-markets-tbody]', root);
    const cards = qs('[data-markets-cards]', root);
    if (tbody) tbody.innerHTML = rowsHtml(state);
    if (cards) cards.innerHTML = cardsHtml(state);
  });

  return () => {};
}

/* ---------- template / render ----------------------------- */

const COLS = [
  { key: 'netuid',   label: 'ID',         align: 'left',  cmp: (a, b) => a.netuid - b.netuid },
  { key: 'name',     label: 'NAME',       align: 'left',  cmp: (a, b) => (a.name || '').localeCompare(b.name || '') },
  { key: 'cat',      label: 'CAT',        align: 'left',  cmp: (a, b) => (a.cat  || '').localeCompare(b.cat  || '') },
  { key: 'cluster',  label: 'CLUSTER',    align: 'left',  cmp: null },
  { key: 'cov',      label: 'PRESS',      align: 'right', cmp: (a, b) => coverageCount(a.netuid) - coverageCount(b.netuid) },
  { key: 'price',    label: 'α PRICE',    align: 'right', cmp: (a, b) => (a.price || 0) - (b.price || 0) },
  { key: 'chg24',    label: '24H',        align: 'right', cmp: (a, b) => (a.chg24 || 0) - (b.chg24 || 0) },
  { key: 'chg7',     label: '7D',         align: 'right', cmp: (a, b) => (a.chg7  || 0) - (b.chg7  || 0) },
  { key: 'chg30',    label: '30D',        align: 'right', cmp: (a, b) => (a.chg30 || 0) - (b.chg30 || 0) },
  { key: 'mcap',     label: 'FDV',        align: 'right', cmp: (a, b) => (a.mcap     || 0) - (b.mcap     || 0) },
  { key: 'emission', label: 'EMIT τ/d',   align: 'right', cmp: (a, b) => (a.emission || 0) - (b.emission || 0) },
  { key: 'miners',   label: 'MINERS',     align: 'right', cmp: (a, b) => (a.miners   || 0) - (b.miners   || 0) },
  { key: 'validators', label: 'VAL',      align: 'right', cmp: (a, b) => (a.validators || 0) - (b.validators || 0) },
];

function presentCats(){
  return [...new Set(SUBNETS.map(s => s.cat).filter(Boolean))];
}

/* ---------- market stats + heat helpers ---------------------- */
/* Decision-grade quick stats computed over the CURRENTLY FILTERED
   row set (not the full 53), so the stats reflect what the reader
   is actually looking at. Filtering by cat='vision' should show
   the avg-24h-of-vision, not the network avg.
   Per Signal Taxonomy: "every chart must answer a decision
   question." This strip answers: where is the network leaning
   today, who's the strongest mover, who's dragging, how many
   are running hot? */
const HOT_THRESHOLD_PCT = 5;   // chg24 above this = "running hot"

function marketStats(rows){
  const ch = rows.map(s => Number(s.chg24)).filter(Number.isFinite);
  if (!ch.length) return { mean: null, top: null, bottom: null, hotCount: 0, total: rows.length };
  const mean = ch.reduce((a, b) => a + b, 0) / ch.length;
  let topRow = rows[0], botRow = rows[0];
  for (const r of rows){
    if (Number.isFinite(r.chg24)){
      if (!Number.isFinite(topRow.chg24) || r.chg24 > topRow.chg24) topRow = r;
      if (!Number.isFinite(botRow.chg24) || r.chg24 < botRow.chg24) botRow = r;
    }
  }
  const hotCount = rows.filter(r => Number(r.chg24) > HOT_THRESHOLD_PCT).length;
  return { mean, top: topRow, bottom: botRow, hotCount, total: rows.length };
}

/* Percentile-rank heat wash on extreme cells. Top 10% gets a
   faint green background, bottom 10% faint red. Computed per
   column over the visible rows so the wash reflects the filtered
   set, not the network. Returns the suffix CSS class to append. */
const HEAT_HI_PCTL = 0.90;
const HEAT_LO_PCTL = 0.10;

function heatThresholds(rows, key){
  const vs = rows.map(r => Number(r[key])).filter(Number.isFinite).sort((a, b) => a - b);
  if (vs.length < 4) return { hi: Infinity, lo: -Infinity };
  const hiIdx = Math.floor(vs.length * HEAT_HI_PCTL);
  const loIdx = Math.floor(vs.length * HEAT_LO_PCTL);
  return { hi: vs[Math.min(hiIdx, vs.length - 1)], lo: vs[loIdx] };
}
function heatClass(v, t){
  if (!Number.isFinite(v)) return '';
  if (v >= t.hi) return 'is-heat-up';
  if (v <= t.lo) return 'is-heat-down';
  return '';
}

function filterAndSort(state){
  const q = (state.search || '').toLowerCase().trim();
  let rows = SUBNETS.slice();
  if (state.cat !== 'all') rows = rows.filter(s => s.cat === state.cat);
  if (q) rows = rows.filter(s =>
    (s.name || '').toLowerCase().includes(q) ||
    ('sn' + s.netuid).includes(q) ||
    (s.owner || '').toLowerCase().includes(q) ||
    (s.tags  || []).some(t => t.toLowerCase().includes(q))
  );
  const col = COLS.find(c => c.key === state.sortKey);
  if (col && col.cmp){
    rows.sort((a, b) => {
      const r = col.cmp(a, b);
      return state.sortDir === 'desc' ? -r : r;
    });
  }
  return rows;
}

function template(state){
  const total = SUBNETS.length;
  const cats  = ['all', ...presentCats()];
  const chips = cats.map(c => `
    <button type="button" class="term-mkts__chip ${c === state.cat ? 'is-on' : ''}" data-mkts-cat="${escapeHtml(c)}">
      ${escapeHtml(c === 'all' ? 'ALL' : (CAT_LABEL[c] || c.toUpperCase()))}
    </button>
  `).join('');

  const ths = COLS.map(c => {
    const isSort = c.key === state.sortKey;
    const arrow  = !c.cmp ? '' : (isSort ? (state.sortDir === 'desc' ? ' ▼' : ' ▲') : ' ⇕');
    const cls    = `term-mkts__th term-mkts__th--${c.align} ${isSort ? 'is-sort' : ''} ${c.cmp ? '' : 'is-static'}`;
    return `<th class="${cls}" data-mkts-sort="${c.key}">${escapeHtml(c.label)}<span class="term-mkts__sort">${arrow}</span></th>`;
  }).join('');

  return `
    <article class="term-mkts">
      <header class="term-mkts__head">
        <div class="term-mkts__head-left">
          <span class="term-mkts__kicker"><span class="term-mkts__dot"></span>MARKETS · ${total} SUBNETS · OBSERVER TIER</span>
          <span class="term-mkts__hint">Click any row to load it across the terminal · Sort any column · Filter by category</span>
        </div>
        <div class="term-mkts__head-right">
          <input type="search" class="term-mkts__search" data-mkts-search placeholder="search name, SN, owner, tag…" value="${escapeHtml(state.search)}" aria-label="Filter subnets" />
        </div>
      </header>

      <nav class="term-mkts__filters" aria-label="Category filter">
        <span class="term-mkts__filt-lbl">CATEGORY</span>
        ${chips}
      </nav>

      ${statsStripHtml(state)}

      <div class="term-mkts__scroll" data-markets-scroll>
        <table class="term-mkts__table" role="grid">
          <thead>
            <tr>${ths}</tr>
          </thead>
          <tbody data-markets-tbody>${rowsHtml(state)}</tbody>
        </table>
      </div>

      <div class="term-mkts__cards" data-markets-cards>${cardsHtml(state)}</div>

      <footer class="term-mkts__foot">
        <span class="term-mkts__meta" data-mkts-meta>${rowCountText(state)}</span>
        <span class="term-mkts__brand">⌘ MARKETS · OBSERVER</span>
      </footer>
    </article>
  `;
}

function statsStripHtml(state){
  const rows = filterAndSort(state);
  const s = marketStats(rows);
  if (!s.total) return '';
  const meanCls   = s.mean == null ? 'is-flat' : (s.mean > 0 ? 'is-up' : (s.mean < 0 ? 'is-down' : 'is-flat'));
  const topCls    = s.top    && s.top.chg24    > 0 ? 'is-up'   : (s.top    && s.top.chg24    < 0 ? 'is-down' : 'is-flat');
  const botCls    = s.bottom && s.bottom.chg24 > 0 ? 'is-up'   : (s.bottom && s.bottom.chg24 < 0 ? 'is-down' : 'is-flat');
  const meanTxt   = s.mean == null ? '·' : (s.mean >= 0 ? '+' : '') + s.mean.toFixed(2) + '%';
  const topTxt    = s.top    ? `SN${s.top.netuid}    ${(s.top.chg24    >= 0 ? '+' : '') + s.top.chg24.toFixed(2)}%`    : '·';
  const botTxt    = s.bottom ? `SN${s.bottom.netuid} ${(s.bottom.chg24 >= 0 ? '+' : '') + s.bottom.chg24.toFixed(2)}%` : '·';
  return `
    <div class="term-mkts__stats" data-markets-stats role="region" aria-label="Quick stats for filtered subnets">
      <div class="term-mkts__stat">
        <span class="term-mkts__stat-lbl">AVG 24H</span>
        <span class="term-mkts__stat-val ${meanCls}">${meanTxt}</span>
      </div>
      <div class="term-mkts__stat">
        <span class="term-mkts__stat-lbl">TOP MOVER</span>
        <span class="term-mkts__stat-val ${topCls}">${escapeHtml(topTxt)}</span>
      </div>
      <div class="term-mkts__stat">
        <span class="term-mkts__stat-lbl">WORST DRAG</span>
        <span class="term-mkts__stat-val ${botCls}">${escapeHtml(botTxt)}</span>
      </div>
      <div class="term-mkts__stat">
        <span class="term-mkts__stat-lbl">RUNNING HOT</span>
        <span class="term-mkts__stat-val ${s.hotCount > 0 ? 'is-up' : 'is-flat'}">${s.hotCount}/${s.total} <em>·24h&gt;${HOT_THRESHOLD_PCT}%</em></span>
      </div>
    </div>`;
}

function rowCountText(state){
  const filtered = filterAndSort(state);
  const total    = SUBNETS.length;
  if (state.cat === 'all' && !state.search) return `${total} subnets · sort: ${state.sortKey.toUpperCase()} ${state.sortDir === 'desc' ? '▼' : '▲'}`;
  return `${filtered.length} of ${total} subnets · sort: ${state.sortKey.toUpperCase()} ${state.sortDir === 'desc' ? '▼' : '▲'}`;
}

function rowsHtml(state){
  const rows = filterAndSort(state);
  if (!rows.length){
    return `<tr><td class="term-mkts__empty-row" colspan="${COLS.length}">No subnets match this filter.</td></tr>`;
  }
  /* Compute heat thresholds ONCE per render (not per row) over the
     filtered set so each chg column gets its own per-column scale
     — a -2% in a calm day stands out, a -2% in a -8% rout doesn't. */
  const heat = {
    chg24: heatThresholds(rows, 'chg24'),
    chg7:  heatThresholds(rows, 'chg7'),
    chg30: heatThresholds(rows, 'chg30'),
  };
  return rows.map(s => rowHtml(s, state, heat)).join('');
}

function rowHtml(s, state, heat){
  const id        = s.netuid;
  const isSel     = id === state.selectedId;
  const chg24Cls  = chgClass(s.chg24);
  const chg7Cls   = chgClass(s.chg7);
  const chg30Cls  = chgClass(s.chg30);
  const heat24    = heat ? heatClass(s.chg24, heat.chg24) : '';
  const heat7     = heat ? heatClass(s.chg7,  heat.chg7 ) : '';
  const heat30    = heat ? heatClass(s.chg30, heat.chg30) : '';
  const cluster   = state.analytics?.cluster?.[String(id)];
  const clusterCol = (cluster != null) ? CLUSTER_COLORS[cluster % CLUSTER_COLORS.length] : null;
  const clusterLbl = (cluster != null && state.analytics?.cluster_labels?.[String(cluster)]) || null;
  const cov        = coverageCount(id);

  return `
    <tr class="term-mkts__tr ${isSel ? 'is-selected' : ''}" data-mkts-row="${id}">
      <td class="term-mkts__td term-mkts__td--id">SN${id}</td>
      <td class="term-mkts__td term-mkts__td--name">${escapeHtml(s.name)}</td>
      <td class="term-mkts__td term-mkts__td--cat">${escapeHtml(CAT_LABEL[s.cat] || (s.cat || '').toUpperCase())}</td>
      <td class="term-mkts__td term-mkts__td--cluster">
        ${clusterCol ? `<span class="term-mkts__cluster" style="--ct:${clusterCol}" title="${escapeHtml(clusterLbl || ('cluster ' + cluster))}">${cluster}</span>` : '<span class="term-mkts__cluster term-mkts__cluster--na">·</span>'}
      </td>
      <td class="term-mkts__td term-mkts__td--cov">${cov > 0 ? `<span class="term-mkts__cov">·${cov}</span>` : '<span class="term-mkts__cov term-mkts__cov--zero">·</span>'}</td>
      <td class="term-mkts__td term-mkts__td--num">${fmtPrice(s.price)}</td>
      <td class="term-mkts__td term-mkts__td--num ${chg24Cls} ${heat24}">${fmtPct(s.chg24)}</td>
      <td class="term-mkts__td term-mkts__td--num ${chg7Cls} ${heat7}">${fmtPct(s.chg7)}</td>
      <td class="term-mkts__td term-mkts__td--num ${chg30Cls} ${heat30}">${fmtPct(s.chg30)}</td>
      <td class="term-mkts__td term-mkts__td--num">${fmtMcap(s.mcap)}</td>
      <td class="term-mkts__td term-mkts__td--num">${fmtInt(s.emission)}</td>
      <td class="term-mkts__td term-mkts__td--num">${fmtInt(s.miners)}</td>
      <td class="term-mkts__td term-mkts__td--num">${fmtInt(s.validators)}</td>
    </tr>
  `;
}

function cardsHtml(state){
  const rows = filterAndSort(state);
  if (!rows.length) return `<div class="term-mkts__empty">No subnets match this filter.</div>`;
  return rows.map(s => cardHtml(s, state)).join('');
}

function cardHtml(s, state){
  const id       = s.netuid;
  const isSel    = id === state.selectedId;
  const chg24Cls = chgClass(s.chg24);
  const accent   = s.chg24 > 2 ? 'is-strong-up'
                 : s.chg24 > 0 ? 'is-up'
                 : s.chg24 < -2 ? 'is-strong-down'
                 : s.chg24 < 0 ? 'is-down'
                 : 'is-flat';
  const cluster   = state.analytics?.cluster?.[String(id)];
  const clusterCol = (cluster != null) ? CLUSTER_COLORS[cluster % CLUSTER_COLORS.length] : null;
  const cov        = coverageCount(id);
  return `
    <div class="term-mkts__card ${accent} ${isSel ? 'is-selected' : ''}" data-mkts-row="${id}">
      <div class="term-mkts__card-accent"></div>
      <div class="term-mkts__card-body">
        <div class="term-mkts__card-head">
          <span class="term-mkts__card-sn">SN${id}</span>
          <span class="term-mkts__card-name">${escapeHtml(s.name)}</span>
          <span class="term-mkts__card-cat">${escapeHtml(CAT_LABEL[s.cat] || (s.cat || '').toUpperCase())}</span>
          ${clusterCol ? `<span class="term-mkts__cluster" style="--ct:${clusterCol}">${cluster}</span>` : ''}
          ${cov > 0 ? `<span class="term-mkts__cov">·${cov}</span>` : ''}
        </div>
        <div class="term-mkts__card-priceline">
          <span class="term-mkts__card-price">${fmtPrice(s.price)}</span>
          <span class="term-mkts__card-chg ${chg24Cls}">${fmtPct(s.chg24)} <em>24H</em></span>
        </div>
        <div class="term-mkts__card-stats">
          <span><label>FDV</label><strong>${fmtMcap(s.mcap)}</strong></span>
          <span><label>EMIT</label><strong>${fmtInt(s.emission)}τ</strong></span>
          <span><label>MIN</label><strong>${fmtInt(s.miners)}</strong></span>
          <span><label>VAL</label><strong>${fmtInt(s.validators)}</strong></span>
        </div>
      </div>
    </div>
  `;
}

/* ---------- wire interactions ----------------------------- */

function wire(root, state, ctx){
  /* Sort headers */
  qsa('[data-mkts-sort]', root).forEach(th => {
    if (th.classList.contains('is-static')) return;
    th.addEventListener('click', () => {
      const k = th.dataset.mktsSort;
      if (k === state.sortKey) state.sortDir = state.sortDir === 'desc' ? 'asc' : 'desc';
      else { state.sortKey = k; state.sortDir = (k === 'name' || k === 'cat' || k === 'netuid') ? 'asc' : 'desc'; }
      rerender(root, state);
    });
  });

  /* Category chips */
  qsa('[data-mkts-cat]', root).forEach(btn => {
    btn.addEventListener('click', () => {
      state.cat = btn.dataset.mktsCat;
      qsa('[data-mkts-cat]', root).forEach(b => b.classList.toggle('is-on', b === btn));
      rerender(root, state);
    });
  });

  /* Search */
  let searchTimer = 0;
  const inp = qs('[data-mkts-search]', root);
  if (inp){
    inp.addEventListener('input', () => {
      state.search = inp.value || '';
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => rerender(root, state), 100);
    });
  }

  /* Row clicks via event delegation on the scroll + cards
     containers. Single listener each, no rewiring after re-render —
     ctx stays in closure cleanly. */
  const onRowClick = (e) => {
    const row = e.target.closest('[data-mkts-row]');
    if (!row || !root.contains(row)) return;
    const id = parseInt(row.dataset.mktsRow, 10);
    if (!Number.isFinite(id)) return;
    state.selectedId = id;
    qsa('[data-mkts-row]', root).forEach(r =>
      r.classList.toggle('is-selected', parseInt(r.dataset.mktsRow, 10) === id));
    if (typeof ctx?.select === 'function') ctx.select(id);
  };
  const scroll = qs('[data-markets-scroll]', root);
  const cards  = qs('[data-markets-cards]', root);
  if (scroll) scroll.addEventListener('click', onRowClick);
  if (cards)  cards.addEventListener('click',  onRowClick);
}

function rerender(root, state){
  /* Re-render only the dynamic parts: header sort indicators, the
     tbody, the cards, and the meta line. The shell + filter chips
     keep their DOM (preserves search input focus + caret). */
  const tbody = qs('[data-markets-tbody]', root);
  const cards = qs('[data-markets-cards]', root);
  const meta  = qs('[data-mkts-meta]', root);
  const stats = qs('[data-markets-stats]', root);
  if (tbody) tbody.innerHTML = rowsHtml(state);
  if (cards) cards.innerHTML = cardsHtml(state);
  if (meta)  meta.textContent = rowCountText(state);
  /* Stats strip outerHTML swap — keep the inserted node in the same
     DOM position so cat/search/sort all repaint a consistent set. */
  if (stats) stats.outerHTML = statsStripHtml(state);
  /* Update sort indicators on the headers */
  qsa('[data-mkts-sort]', root).forEach(th => {
    const k = th.dataset.mktsSort;
    const isSort = k === state.sortKey;
    th.classList.toggle('is-sort', isSort);
    const sortEl = th.querySelector('.term-mkts__sort');
    if (sortEl){
      const col = COLS.find(c => c.key === k);
      if (!col?.cmp) { sortEl.textContent = ''; return; }
      sortEl.textContent = isSort ? (state.sortDir === 'desc' ? ' ▼' : ' ▲') : ' ⇕';
    }
  });
  /* No row-click re-wiring needed — the scroll + cards container
     delegations installed in wire() catch every row click forever,
     including rows inserted by this rerender. */
}

/* ---------- format helpers ------------------------------- */

const fmtPrice = p => p == null ? '·' : (p < 1 ? '$' + p.toFixed(4) : '$' + p.toFixed(2));
const fmtMcap  = m => m == null ? '·' : '$' + (m >= 1000 ? (m / 1000).toFixed(2) + 'B' : m.toFixed(1) + 'M');
const fmtPct   = v => v == null ? '·' : ((v >= 0 ? '+' : '') + v.toFixed(2) + '%');
const fmtInt   = n => n == null ? '·' : Math.round(n).toLocaleString('en-US');
const chgClass = v => v == null ? 'is-flat' : (v > 0 ? 'is-up' : v < 0 ? 'is-down' : 'is-flat');
