/* =================================================================
   SUBNET MAGAZINE — SUBNETS DIRECTORY PAGE
   -----------------------------------------------------------------
   Sortable, searchable, filterable table of every subnet tracked
   by the platform. Closes the directory-feature gap against
   taostats.io while remaining easier on the eye.

   Header carries the stat band (subnets · stake · daily emission ·
   active miners · active validators) — the same shape taostats
   uses at the top of its Subnets page.

   Each row links to /subnet.html?id=N so the full per-subnet
   research view sits one click away.
   ================================================================= */

import { html, mount, qs, raw } from '../lib/dom.js';
import { SUBNETS } from '../data/subnets.js';
import { CATEGORIES, catLabel, catColor } from '../data/categories.js';

const TOTAL_STAKE      = SUBNETS.reduce((a, s) => a + (s.stake ?? 0), 0);
const TOTAL_EMIT       = SUBNETS.reduce((a, s) => a + s.emission, 0);
const TOTAL_MINERS     = SUBNETS.reduce((a, s) => a + (s.miners ?? 0), 0);
const TOTAL_VALIDATORS = SUBNETS.reduce((a, s) => a + (s.validators ?? 0), 0);

const COLS = [
  { id:'netuid',     label:'#',         num:true,  fmt: s => `SN${s.netuid}` },
  { id:'name',       label:'Subnet',    num:false, fmt: s => s.name },
  { id:'cat',        label:'Category',  num:false, fmt: s => s.cat },
  { id:'price',      label:'α-Price',   num:true,  fmt: s => `$${(s.price ?? 0).toFixed(2)}` },
  { id:'mcap',       label:'Mcap ($M)', num:true,  fmt: s => `$${(s.mcap ?? 0).toFixed(1)}M` },
  { id:'emission',   label:'Emit/24h',  num:true,  fmt: s => `τ ${(s.emission ?? 0).toLocaleString('en-US')}` },
  { id:'miners',     label:'Miners',    num:true,  fmt: s => (s.miners ?? 0).toLocaleString('en-US') },
  { id:'validators', label:'Vals',      num:true,  fmt: s => (s.validators ?? 0).toLocaleString('en-US') },
  { id:'stake',      label:'Stake (τ)', num:true,  fmt: s => (s.stake ?? 0).toLocaleString('en-US') },
  { id:'chg24',      label:'24h',       num:true,  fmt: s => fmtPct(s.chg24) },
  { id:'chg7',       label:'7d',        num:true,  fmt: s => fmtPct(s.chg7) },
  { id:'chg30',      label:'30d',       num:true,  fmt: s => fmtPct(s.chg30) },
];

function fmtPct(v){
  if (v == null) return '—';
  const sign = v >= 0 ? '+' : '';
  return `${sign}${v.toFixed(2)}%`;
}

export function mountSubnets(root){
  const state = {
    sort: 'emission',
    sortDir: -1,
    filter: 'all',
    query: '',
  };

  mount(root, html`
    <section class="snlist">
      <header class="snlist__head">
        <a class="sd-back" href="terminal.html">‹ TERMINAL</a>
        <div class="snlist__head-main">
          <span class="snlist__kicker">&lt;040&gt;  SUBNETS · FULL DIRECTORY</span>
          <h1 class="snlist__title">Every <em>${SUBNETS.length}</em> subnet, side by side.</h1>
          <p class="snlist__sub">
            Every active subnet on Bittensor in a single sortable, filterable table.
            Each row is one click from its full research page. Same data layer
            taostats publishes — paired with the editorial context and competitive
            landscape only Subneτ Magazine offers.
          </p>
        </div>
        <div class="snlist__head-meta">
          <span class="sd-pill"><span class="live-dot"></span>LIVE</span>
          <span class="sd-pill">v0.26</span>
        </div>
      </header>

      <!-- Stat band -->
      <div class="snlist__stats">
        <div class="snlist__stat">
          <span class="snlist__stat-lbl">Active subnets</span>
          <span class="snlist__stat-val">${SUBNETS.length}</span>
          <span class="snlist__stat-sub">tracked</span>
        </div>
        <div class="snlist__stat">
          <span class="snlist__stat-lbl">τ at stake</span>
          <span class="snlist__stat-val">τ ${(TOTAL_STAKE / 1000).toFixed(0)}K</span>
          <span class="snlist__stat-sub">across all subnets</span>
        </div>
        <div class="snlist__stat">
          <span class="snlist__stat-lbl">Daily emission</span>
          <span class="snlist__stat-val">τ ${TOTAL_EMIT.toLocaleString('en-US')}</span>
          <span class="snlist__stat-sub">/ 24h network total</span>
        </div>
        <div class="snlist__stat">
          <span class="snlist__stat-lbl">Active miners</span>
          <span class="snlist__stat-val">${TOTAL_MINERS.toLocaleString('en-US')}</span>
          <span class="snlist__stat-sub">hotkeys</span>
        </div>
        <div class="snlist__stat">
          <span class="snlist__stat-lbl">Active validators</span>
          <span class="snlist__stat-val">${TOTAL_VALIDATORS.toLocaleString('en-US')}</span>
          <span class="snlist__stat-sub">hotkeys</span>
        </div>
      </div>

      <!-- Toolbar: search + category filter -->
      <div class="snlist__toolbar">
        <label class="snlist__search">
          <span class="snlist__search-icon">⌕</span>
          <input id="snlist-q" type="text" placeholder="Search by name, owner, or netuid (e.g. SN9 or Chutes)…" autocomplete="off" spellcheck="false">
        </label>
        <div class="snlist__filters" id="snlist-filters">
          <button class="snlist__filter is-active" data-filter="all">All categories</button>
          ${Object.values(CATEGORIES).map(c => `
            <button class="snlist__filter" data-filter="${c.key}" style="--accent:${c.color}">
              <i></i>${c.label}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Table -->
      <div class="snlist__table-wrap panel is-bracketed">
        <div class="snlist__count" id="snlist-count">— rows</div>
        <div class="snlist__table-scroll">
          <table class="snlist__table">
            <thead><tr id="snlist-head"></tr></thead>
            <tbody id="snlist-body"></tbody>
          </table>
        </div>
      </div>
    </section>
  `);

  const headRow  = qs('#snlist-head',  root);
  const bodyRoot = qs('#snlist-body',  root);
  const countEl  = qs('#snlist-count', root);
  const queryEl  = qs('#snlist-q',     root);
  const filters  = qs('#snlist-filters', root);

  /* Sortable header */
  function renderHead(){
    headRow.innerHTML = COLS.map(c => `
      <th class="${c.num ? 'num' : ''} ${state.sort === c.id ? 'is-sorted' : ''} ${state.sort === c.id && state.sortDir === 1 ? 'asc' : 'desc'}" data-col="${c.id}">
        ${c.label}
        ${state.sort === c.id ? `<span class="snlist__arrow">${state.sortDir === 1 ? '▲' : '▼'}</span>` : ''}
      </th>
    `).join('');
    headRow.querySelectorAll('th').forEach(th => {
      th.addEventListener('click', () => {
        const id = th.dataset.col;
        if (state.sort === id) state.sortDir *= -1;
        else { state.sort = id; state.sortDir = COLS.find(c => c.id === id)?.num ? -1 : 1; }
        renderHead(); renderBody();
      });
    });
  }

  function renderBody(){
    let rows = SUBNETS.slice();
    if (state.filter !== 'all') rows = rows.filter(s => s.cat === state.filter);
    if (state.query){
      const q = state.query.toLowerCase();
      rows = rows.filter(s =>
        String(s.netuid).includes(q) ||
        s.name.toLowerCase().includes(q) ||
        (s.owner ?? '').toLowerCase().includes(q) ||
        (s.tags ?? []).some(t => t.toLowerCase().includes(q))
      );
    }
    rows.sort((a, b) => {
      const av = a[state.sort], bv = b[state.sort];
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * state.sortDir;
      return String(av).localeCompare(String(bv)) * state.sortDir;
    });

    if (countEl) countEl.textContent = `${rows.length} ${rows.length === 1 ? 'row' : 'rows'}`;

    bodyRoot.innerHTML = rows.map(s => `
      <tr data-id="${s.netuid}">
        <td class="num"><a class="snlist__id" href="subnet.html?id=${s.netuid}">SN${s.netuid}</a></td>
        <td>
          <a class="snlist__name" href="subnet.html?id=${s.netuid}">
            <span class="snlist__name-main">${s.name}</span>
            <span class="snlist__name-owner">${s.owner ?? ''}</span>
          </a>
        </td>
        <td><span class="snlist__cat" style="--accent:${catColor(s.cat)}"><i></i>${catLabel(s.cat)}</span></td>
        <td class="num">$${(s.price ?? 0).toFixed(2)}</td>
        <td class="num">$${(s.mcap ?? 0).toFixed(1)}M</td>
        <td class="num">τ ${(s.emission ?? 0).toLocaleString('en-US')}</td>
        <td class="num">${(s.miners ?? 0).toLocaleString('en-US')}</td>
        <td class="num">${(s.validators ?? 0).toLocaleString('en-US')}</td>
        <td class="num">${(s.stake ?? 0).toLocaleString('en-US')}</td>
        <td class="num ${pctClass(s.chg24)}">${fmtPct(s.chg24)}</td>
        <td class="num ${pctClass(s.chg7)}">${fmtPct(s.chg7)}</td>
        <td class="num ${pctClass(s.chg30)}">${fmtPct(s.chg30)}</td>
      </tr>
    `).join('');
  }

  function pctClass(v){ return v == null ? '' : v >= 0 ? 'up' : 'down'; }

  /* Filter buttons */
  filters.addEventListener('click', e => {
    const btn = e.target.closest('.snlist__filter');
    if (!btn) return;
    filters.querySelectorAll('.snlist__filter').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    state.filter = btn.dataset.filter;
    renderBody();
  });

  /* Search debounced */
  let searchT = 0;
  queryEl?.addEventListener('input', () => {
    clearTimeout(searchT);
    searchT = setTimeout(() => { state.query = queryEl.value.trim(); renderBody(); }, 120);
  });

  renderHead();
  renderBody();

  return { destroy(){ clearTimeout(searchT); } };
}

void raw;
