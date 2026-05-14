/* =================================================================
   SUBNET MAGAZINE — VALIDATORS PAGE
   -----------------------------------------------------------------
   The validator leaderboard. Runs on live taostats data when a key
   is configured (DataLayer 'tao:validators'); otherwise it renders
   the hand-authored seed roster so the page is never empty.

   Both sources are normalized into one row shape, so the table,
   sort, search and stat band don't care which is live. A pill in
   the header shows which source is currently driving the page.
   ================================================================= */

import { html, mount, qs, raw } from '../lib/dom.js';
import { VALIDATORS } from '../data/validators.js';

const COLS = [
  { id:'rank',       label:'#',          num:true  },
  { id:'name',       label:'Operator',   num:false },
  { id:'stake',      label:'Stake (τ)',  num:true  },
  { id:'nominators', label:'Nominators', num:true  },
  { id:'dominance',  label:'Dominance',  num:true  },
  { id:'apr',        label:'APR',        num:true  },
  { id:'take',       label:'Take',       num:true  },
  { id:'subnets',    label:'Subnets',    num:true  },
];

/** Mask a long Substrate address to head…tail. */
function maskKey(k){
  if (!k) return '—';
  return k.length > 16 ? `${k.slice(0, 6)}…${k.slice(-4)}` : k;
}

/** Seed roster → uniform row. */
function fromSeed(v, i){
  return {
    rank: i + 1, name: v.name, hotkey: v.hotkey, desc: v.desc,
    stake: v.stake, nominators: v.nominators, dominance: null,
    apr: v.apy, take: null, subnets: v.subnets, chg24: null,
  };
}
/** Live taostats row → uniform row. */
function fromLive(v){
  return {
    rank: v.rank, name: v.name, hotkey: v.hotkey, desc: '',
    stake: v.stake, nominators: v.nominators, dominance: v.dominance,
    apr: v.apr30d || v.apr, take: v.take, subnets: v.subnets,
    chg24: v.stakeChg24h,
  };
}

/**
 * @param {HTMLElement} root
 * @param {{subscribe:Function, get:Function}|null} [dataLayer]
 */
export function mountValidators(root, dataLayer = null){
  const state = { sort: 'stake', sortDir: -1, query: '' };
  /* start on the seed roster; swap to live the moment it lands */
  let rows = VALIDATORS.map(fromSeed);
  let live = false;

  mount(root, html`
    <section class="vlist">
      <header class="vlist__head">
        <a class="sd-back" href="terminal.html">‹ TERMINAL</a>
        <div class="vlist__head-main">
          <span class="vlist__kicker">&lt;050&gt;  VALIDATORS · LEADERBOARD</span>
          <h1 class="vlist__title">The hotkeys that <em>actually</em> run Bittensor.</h1>
          <p class="vlist__sub">
            Every major validator, ranked by stake — with nominators, network dominance,
            APR, take, and subnet participation. Live from the taostats API when a key is
            configured; otherwise the curated seed roster.
          </p>
        </div>
        <div class="vlist__head-meta">
          <span class="sd-pill" id="vlist-src"><span class="live-dot"></span>SEED ROSTER</span>
        </div>
      </header>

      <!-- Stat band -->
      <div class="vlist__stats" id="vlist-stats"></div>

      <!-- Toolbar -->
      <div class="vlist__toolbar">
        <label class="snlist__search">
          <span class="snlist__search-icon">⌕</span>
          <input id="vlist-q" type="text" placeholder="Search operator or hotkey (e.g. Datura, Yuma, 5GKH…)" autocomplete="off" spellcheck="false">
        </label>
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
  const statsEl = qs('#vlist-stats', root);
  const srcEl   = qs('#vlist-src', root);

  function renderStats(){
    const n = rows.length;
    const totalStake = rows.reduce((a, v) => a + (v.stake || 0), 0);
    const totalNoms  = rows.reduce((a, v) => a + (v.nominators || 0), 0);
    const avgApr     = n ? rows.reduce((a, v) => a + (v.apr || 0), 0) / n : 0;
    const top        = rows.slice().sort((a, b) => b.stake - a.stake)[0];
    statsEl.innerHTML = `
      <div class="vlist__stat">
        <span class="vlist__stat-lbl">Tracked operators</span>
        <span class="vlist__stat-val">${n}</span>
        <span class="vlist__stat-sub">${live ? 'live · taostats' : 'seed roster'}</span>
      </div>
      <div class="vlist__stat">
        <span class="vlist__stat-lbl">Combined stake</span>
        <span class="vlist__stat-val">τ ${(totalStake / 1000).toFixed(0)}K</span>
        <span class="vlist__stat-sub">across these ${n}</span>
      </div>
      <div class="vlist__stat">
        <span class="vlist__stat-lbl">Total nominators</span>
        <span class="vlist__stat-val">${totalNoms.toLocaleString('en-US')}</span>
        <span class="vlist__stat-sub">delegator coldkeys</span>
      </div>
      <div class="vlist__stat">
        <span class="vlist__stat-lbl">Average APR</span>
        <span class="vlist__stat-val up">${avgApr.toFixed(1)}%</span>
        <span class="vlist__stat-sub">${live ? 'trailing 30d' : 'best-effort'}</span>
      </div>
      <div class="vlist__stat">
        <span class="vlist__stat-lbl">Top operator</span>
        <span class="vlist__stat-val">${top ? top.name : '—'}</span>
        <span class="vlist__stat-sub">${top ? 'τ ' + Math.round(top.stake).toLocaleString('en-US') : ''}</span>
      </div>
    `;
  }

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
        else { state.sort = id; state.sortDir = (id === 'name' || id === 'rank') ? 1 : -1; }
        renderHead(); renderBody();
      });
    });
  }

  function renderBody(){
    let view = rows.slice();
    if (state.query){
      const q = state.query.toLowerCase();
      view = view.filter(v =>
        v.name.toLowerCase().includes(q) ||
        (v.hotkey || '').toLowerCase().includes(q) ||
        (v.desc || '').toLowerCase().includes(q)
      );
    }
    view.sort((a, b) => {
      const av = a[state.sort], bv = b[state.sort];
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * state.sortDir;
      return String(av ?? '').localeCompare(String(bv ?? '')) * state.sortDir;
    });

    if (countEl) countEl.textContent = `${view.length} ${view.length === 1 ? 'operator' : 'operators'}`;

    const maxStake = Math.max(1, ...view.map(r => r.stake || 0));
    body.innerHTML = view.map((v, i) => `
      <tr>
        <td class="num"><span class="vlist__rank">${String(i + 1).padStart(2, '0')}</span></td>
        <td>
          <div class="vlist__name">
            <span class="vlist__name-main">${v.name}</span>
            <span class="vlist__hotkey" title="${v.hotkey || ''}">${maskKey(v.hotkey)}</span>
            ${v.desc ? `<span class="vlist__desc">${v.desc}</span>` : ''}
          </div>
        </td>
        <td class="num vlist__stake">
          <span class="vlist__stake-val">${Math.round(v.stake).toLocaleString('en-US')}</span>
          <span class="vlist__stake-bar"><i style="width:${(v.stake / maxStake) * 100}%"></i></span>
        </td>
        <td class="num">${v.nominators.toLocaleString('en-US')}</td>
        <td class="num">${v.dominance != null ? v.dominance.toFixed(2) + '%' : '—'}</td>
        <td class="num up">${v.apr != null ? v.apr.toFixed(1) + '%' : '—'}</td>
        <td class="num">${v.take != null ? v.take.toFixed(1) + '%' : '—'}</td>
        <td class="num">${v.subnets}</td>
      </tr>
    `).join('');
  }

  function rerenderAll(){ renderStats(); renderHead(); renderBody(); }

  let searchT = 0;
  queryEl?.addEventListener('input', () => {
    clearTimeout(searchT);
    searchT = setTimeout(() => { state.query = queryEl.value.trim(); renderBody(); }, 120);
  });

  rerenderAll();

  /* ---------- go live when taostats data lands ---------- */
  let unsub = null;
  if (dataLayer){
    const onLive = list => {
      if (!Array.isArray(list) || !list.length) return;
      rows = list.map(fromLive);
      live = true;
      if (srcEl) srcEl.innerHTML = '<span class="live-dot"></span>LIVE · TAOSTATS';
      rerenderAll();
    };
    unsub = dataLayer.subscribe('tao:validators', onLive);
    onLive(dataLayer.get('tao:validators'));
  }

  return { destroy(){ clearTimeout(searchT); if (unsub) unsub(); } };
}

void raw;
