/* =================================================================
   SUBNET MAGAZINE — VALIDATORS PAGE
   -----------------------------------------------------------------
   The leaderboard taostats has at /validators, rebuilt with a
   stronger visual identity. Header carries the system-wide stat
   band; the table below is searchable + sortable, every row
   shows the operator name, role, hotkey (masked), country flag,
   stake (with proportional bar), nominators, APY, and subnet
   participation count.
   ================================================================= */

import { html, mount, qs, raw } from '../lib/dom.js';
import {
  VALIDATORS, validatorsByStake,
  VALIDATOR_TOTAL_STAKE, VALIDATOR_TOTAL_NOMS, VALIDATOR_AVG_APY,
} from '../data/validators.js';

const ROLE_COLOR = {
  'Foundation':              '#FFD166',
  'Validator':               '#FF6B7A',
  'Subnet owner+validator':  '#FF1E3C',
  'Institutional':           '#00C2FF',
};

const COLS = [
  { id:'rank',       label:'#',           num:true },
  { id:'name',       label:'Operator',    num:false },
  { id:'role',       label:'Role',        num:false },
  { id:'country',    label:'Region',      num:false },
  { id:'stake',      label:'Stake (τ)',   num:true },
  { id:'nominators', label:'Nominators',  num:true },
  { id:'apy',        label:'APY · 30d',   num:true },
  { id:'subnets',    label:'Subnets',     num:true },
  { id:'since',      label:'Registered',  num:false },
];

const FLAG = c => ({
  'US':'🇺🇸','NL':'🇳🇱','UK':'🇬🇧','DE':'🇩🇪','FR':'🇫🇷','CH':'🇨🇭','SG':'🇸🇬',
  'KR':'🇰🇷','JP':'🇯🇵','CN':'🇨🇳','BR':'🇧🇷','AU':'🇦🇺','CA':'🇨🇦','IE':'🇮🇪','KY':'🇰🇾',
}[c] || c);

export function mountValidators(root){
  const state = { sort: 'stake', sortDir: -1, query: '', role: 'all' };

  mount(root, html`
    <section class="vlist">
      <header class="vlist__head">
        <a class="sd-back" href="terminal.html">‹ TERMINAL</a>
        <div class="vlist__head-main">
          <span class="vlist__kicker">&lt;050&gt;  VALIDATORS · LEADERBOARD</span>
          <h1 class="vlist__title">The hotkeys that <em>actually</em> run Bittensor.</h1>
          <p class="vlist__sub">
            Every major validator in one place — Opentensor Foundation, Datura, Polychain,
            TAOYNO, RoundTable21, Yuma Group, Macrocosmos, Rayon Labs, Corcel, Taoshi,
            Nous Research, Bittensor Guru, The Hash Rate, Stillcore, and more.
            Sortable by stake, nominators, APY, or registration date.
          </p>
        </div>
        <div class="vlist__head-meta">
          <span class="sd-pill"><span class="live-dot"></span>LIVE</span>
          <span class="sd-pill">v0.26</span>
        </div>
      </header>

      <!-- Stat band -->
      <div class="vlist__stats">
        <div class="vlist__stat">
          <span class="vlist__stat-lbl">Tracked operators</span>
          <span class="vlist__stat-val">${VALIDATORS.length}</span>
          <span class="vlist__stat-sub">top hotkeys</span>
        </div>
        <div class="vlist__stat">
          <span class="vlist__stat-lbl">Combined stake</span>
          <span class="vlist__stat-val">τ ${(VALIDATOR_TOTAL_STAKE / 1000).toFixed(0)}K</span>
          <span class="vlist__stat-sub">across these ${VALIDATORS.length}</span>
        </div>
        <div class="vlist__stat">
          <span class="vlist__stat-lbl">Total nominators</span>
          <span class="vlist__stat-val">${VALIDATOR_TOTAL_NOMS.toLocaleString('en-US')}</span>
          <span class="vlist__stat-sub">distinct coldkeys</span>
        </div>
        <div class="vlist__stat">
          <span class="vlist__stat-lbl">Average APY</span>
          <span class="vlist__stat-val up">${VALIDATOR_AVG_APY.toFixed(1)}%</span>
          <span class="vlist__stat-sub">trailing 30d</span>
        </div>
        <div class="vlist__stat">
          <span class="vlist__stat-lbl">Top operator</span>
          <span class="vlist__stat-val">${validatorsByStake()[0].name}</span>
          <span class="vlist__stat-sub">τ ${validatorsByStake()[0].stake.toLocaleString('en-US')}</span>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="vlist__toolbar">
        <label class="snlist__search">
          <span class="snlist__search-icon">⌕</span>
          <input id="vlist-q" type="text" placeholder="Search operator, hotkey, or country (e.g. Datura, KR, 5DA…)" autocomplete="off" spellcheck="false">
        </label>
        <div class="vlist__filters" id="vlist-filters">
          <button class="vlist__filter is-active" data-role="all">All roles</button>
          <button class="vlist__filter" data-role="Foundation"            style="--accent:${ROLE_COLOR.Foundation}"            ><i></i>Foundation</button>
          <button class="vlist__filter" data-role="Validator"             style="--accent:${ROLE_COLOR.Validator}"             ><i></i>Validator</button>
          <button class="vlist__filter" data-role="Subnet owner+validator"style="--accent:${ROLE_COLOR['Subnet owner+validator']}"><i></i>Subnet owner+validator</button>
          <button class="vlist__filter" data-role="Institutional"         style="--accent:${ROLE_COLOR.Institutional}"         ><i></i>Institutional</button>
        </div>
      </div>

      <!-- Table -->
      <div class="snlist__table-wrap panel is-bracketed">
        <div class="snlist__count" id="vlist-count">— operators</div>
        <div class="snlist__table-scroll">
          <table class="snlist__table vlist__table">
            <thead><tr id="vlist-head"></tr></thead>
            <tbody id="vlist-body"></tbody>
          </table>
        </div>
      </div>
    </section>
  `);

  const head    = qs('#vlist-head', root);
  const body    = qs('#vlist-body', root);
  const countEl = qs('#vlist-count', root);
  const queryEl = qs('#vlist-q', root);
  const filters = qs('#vlist-filters', root);

  function renderHead(){
    head.innerHTML = COLS.map(c => `
      <th class="${c.num ? 'num' : ''} ${state.sort === c.id ? 'is-sorted' : ''}" data-col="${c.id}">
        ${c.label}
        ${state.sort === c.id ? `<span class="snlist__arrow">${state.sortDir === 1 ? '▲' : '▼'}</span>` : ''}
      </th>
    `).join('');
    head.querySelectorAll('th').forEach(th => {
      th.addEventListener('click', () => {
        const id = th.dataset.col;
        if (state.sort === id) state.sortDir *= -1;
        else { state.sort = id; state.sortDir = (id === 'stake' || id === 'nominators' || id === 'apy' || id === 'subnets') ? -1 : 1; }
        renderHead(); renderBody();
      });
    });
  }

  function renderBody(){
    let rows = VALIDATORS.slice();
    if (state.role !== 'all') rows = rows.filter(v => v.role === state.role);
    if (state.query){
      const q = state.query.toLowerCase();
      rows = rows.filter(v =>
        v.name.toLowerCase().includes(q) ||
        v.hotkey.toLowerCase().includes(q) ||
        v.country.toLowerCase().includes(q) ||
        v.desc.toLowerCase().includes(q)
      );
    }
    rows.sort((a, b) => {
      let av, bv;
      if (state.sort === 'rank'){
        av = VALIDATOR_TOTAL_STAKE - a.stake; bv = VALIDATOR_TOTAL_STAKE - b.stake;
      } else { av = a[state.sort]; bv = b[state.sort]; }
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * state.sortDir;
      return String(av).localeCompare(String(bv)) * state.sortDir;
    });

    if (countEl) countEl.textContent = `${rows.length} ${rows.length === 1 ? 'operator' : 'operators'}`;

    const maxStake = Math.max(1, ...rows.map(r => r.stake));
    body.innerHTML = rows.map((v, i) => `
      <tr>
        <td class="num"><span class="vlist__rank">${String(i + 1).padStart(2, '0')}</span></td>
        <td>
          <div class="vlist__name">
            <span class="vlist__name-main">${v.name}</span>
            <span class="vlist__hotkey" title="${v.hotkey}">${v.hotkey}</span>
            <span class="vlist__desc">${v.desc}</span>
          </div>
        </td>
        <td><span class="vlist__role" style="--accent:${ROLE_COLOR[v.role] || '#FF6B7A'}"><i></i>${v.role}</span></td>
        <td><span class="vlist__country"><span class="vlist__flag">${FLAG(v.country)}</span>${v.country}</span></td>
        <td class="num vlist__stake">
          <span class="vlist__stake-val">${v.stake.toLocaleString('en-US')}</span>
          <span class="vlist__stake-bar"><i style="width:${(v.stake / maxStake) * 100}%"></i></span>
        </td>
        <td class="num">${v.nominators.toLocaleString('en-US')}</td>
        <td class="num up">${v.apy.toFixed(1)}%</td>
        <td class="num">${v.subnets}</td>
        <td>${formatRegistered(v.since)}</td>
      </tr>
    `).join('');
  }

  function formatRegistered(iso){
    const d = new Date(iso + 'T00:00:00Z');
    const m = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    return `${m} ${d.getUTCFullYear()}`;
  }

  filters.addEventListener('click', e => {
    const btn = e.target.closest('.vlist__filter');
    if (!btn) return;
    filters.querySelectorAll('.vlist__filter').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    state.role = btn.dataset.role;
    renderBody();
  });
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
