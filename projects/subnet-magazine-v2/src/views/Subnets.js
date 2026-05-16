/* =================================================================
   SUBNET MAGAZINE, SUBNETS DIRECTORY PAGE
   -----------------------------------------------------------------
   Sortable, searchable, filterable table of every subnet on
   Bittensor. Runs on the live DataLayer 'tao:subnets' feed (real
   names, prices, market caps, logos, 24h/7d/30d change); the
   hand-authored seed dataset renders first so the page is never
   empty, and also serves as the category lookup for live rows
   (the live feed has prices but not editorial categories).

   Each row links to /subnet.html?id=N.
   ================================================================= */

import { html, mount, qs, raw } from '../lib/dom.js';
import { SUBNETS } from '../data/subnets.js';
import { CATEGORIES, catLabel, catColor } from '../data/categories.js';
import { mark } from '../lib/mark.js';

/* netuid → editorial category, from the seed dataset. */
const CAT_BY_NETUID = {};
for (const s of SUBNETS) CAT_BY_NETUID[s.netuid] = s.cat;

const COLS = [
  { id:'netuid',   label:'#',         num:true  },
  { id:'name',     label:'Subnet',    num:false },
  { id:'cat',      label:'Category',  num:false },
  { id:'price',    label:'α-Price',   num:true  },
  { id:'mcap',     label:'Mcap',      num:true  },
  { id:'volume',   label:'24h Vol',   num:true  },
  { id:'emission', label:'Emit/24h',  num:true  },
  { id:'chg24',    label:'24h',       num:true  },
  { id:'chg7',     label:'7d',        num:true  },
  { id:'chg30',    label:'30d',       num:true  },
];

function fmtPct(v){
  if (v == null) return '·';
  return `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`;
}
function pctClass(v){ return v == null ? '' : v >= 0 ? 'up' : 'down'; }
function fmtMoney(n){
  if (n == null) return '·';
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return '$' + (n / 1e3).toFixed(1) + 'K';
  return '$' + n.toFixed(2);
}
function fmtPrice(p){
  if (p == null) return '·';
  return p < 1 ? '$' + p.toFixed(4) : '$' + p.toFixed(2);
}

/** Seed dataset row → uniform shape. mcap is already in $M. */
function fromSeed(s){
  return {
    netuid: s.netuid, name: s.name, symbol: 'α', cat: s.cat,
    price: s.price ?? null, mcap: (s.mcap ?? 0) * 1e6, volume: null,
    emission: s.emission ?? 0, chg24: s.chg24 ?? null, chg7: s.chg7 ?? null,
    chg30: s.chg30 ?? null, logo: null, owner: s.owner ?? '', deregRisk: false,
  };
}
/** Live tao:subnets row → uniform shape. marketcap is raw USD. */
function fromLive(s){
  return {
    netuid: s.netuid, name: s.name, symbol: s.symbol || 'α',
    cat: CAT_BY_NETUID[s.netuid] || 'other',
    price: s.price ?? null, mcap: s.marketcap ?? null, volume: s.volume ?? null,
    emission: s.emission ?? 0, chg24: s.chg24 ?? null, chg7: s.chg7 ?? null,
    chg30: s.chg30 ?? null, logo: s.logo || null, owner: s.owner || '',
    deregRisk: !!s.deregRisk,
  };
}

/**
 * @param {HTMLElement} root
 * @param {{subscribe:Function, get:Function}|null} [dataLayer]
 */
export function mountSubnets(root, dataLayer = null){
  const state = { sort: 'mcap', sortDir: -1, filter: 'all', query: '' };
  let rows = SUBNETS.map(fromSeed);
  let live = false;

  mount(root, html`
    <section class="snlist">
      <header class="snlist__head">
        <a class="sd-back" href="terminal.html">‹ TERMINAL</a>
        <div class="snlist__head-main">
          <span class="snlist__kicker">&lt;040&gt;  SUBNETS · FULL DIRECTORY</span>
          <h1 class="snlist__title">Every subnet, <em>side by side.</em></h1>
          <p class="snlist__sub">
            The full Bittensor subnet directory, sortable, filterable, one click from
            each subnet's research page. Live names, prices, market caps and movement
            from the Tao Market Cap feed; editorial categories from the Subneτ Magazine desk.
          </p>
        </div>
        <div class="snlist__head-meta">
          <span class="sd-pill" id="snlist-src"><span class="live-dot"></span>SEED DATA</span>
        </div>
      </header>

      <div class="snlist__stats" id="snlist-stats"></div>

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

      <div class="snlist__table-wrap panel is-bracketed">
        <div class="snlist__count" id="snlist-count">, rows</div>
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
  const statsEl  = qs('#snlist-stats', root);
  const srcEl    = qs('#snlist-src',   root);

  function renderStats(){
    const n = rows.length;
    const totalMcap = rows.reduce((a, s) => a + (s.mcap || 0), 0);
    const totalVol  = rows.reduce((a, s) => a + (s.volume || 0), 0);
    const totalEmit = rows.reduce((a, s) => a + (s.emission || 0), 0);
    const top = rows.slice().sort((a, b) => (b.mcap || 0) - (a.mcap || 0))[0];
    statsEl.innerHTML = `
      <div class="snlist__stat">
        <span class="snlist__stat-lbl">Active subnets</span>
        <span class="snlist__stat-val">${n}</span>
        <span class="snlist__stat-sub">${live ? 'live · TMC' : 'seed dataset'}</span>
      </div>
      <div class="snlist__stat">
        <span class="snlist__stat-lbl">Total market cap</span>
        <span class="snlist__stat-val">${fmtMoney(totalMcap)}</span>
        <span class="snlist__stat-sub">all subnet α</span>
      </div>
      <div class="snlist__stat">
        <span class="snlist__stat-lbl">24h volume</span>
        <span class="snlist__stat-val">${totalVol ? fmtMoney(totalVol) : 'Â·'}</span>
        <span class="snlist__stat-sub">${live ? 'spot, all subnets' : 'live only'}</span>
      </div>
      <div class="snlist__stat">
        <span class="snlist__stat-lbl">Daily emission</span>
        <span class="snlist__stat-val">τ ${Math.round(totalEmit).toLocaleString('en-US')}</span>
        <span class="snlist__stat-sub">/ 24h network</span>
      </div>
      <div class="snlist__stat">
        <span class="snlist__stat-lbl">Largest subnet</span>
        <span class="snlist__stat-val">${top ? top.name : 'Â·'}</span>
        <span class="snlist__stat-sub">${top ? fmtMoney(top.mcap) : ''}</span>
      </div>
    `;
  }

  function renderHead(){
    headRow.innerHTML = COLS.map(c => `
      <th class="${c.num ? 'num' : ''} ${state.sort === c.id ? 'is-sorted' : ''}" data-col="${c.id}">
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
    let view = rows.slice();
    if (state.filter !== 'all') view = view.filter(s => s.cat === state.filter);
    if (state.query){
      const q = state.query.toLowerCase();
      view = view.filter(s =>
        String(s.netuid).includes(q) ||
        s.name.toLowerCase().includes(q) ||
        (s.owner || '').toLowerCase().includes(q)
      );
    }
    view.sort((a, b) => {
      const av = a[state.sort], bv = b[state.sort];
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * state.sortDir;
      return String(av ?? '').localeCompare(String(bv ?? '')) * state.sortDir;
    });

    if (countEl) countEl.textContent = `${view.length} ${view.length === 1 ? 'row' : 'rows'}`;

    bodyRoot.innerHTML = view.map(s => {
      const logo = s.logo
        ? `<img class="snlist__logo" src="${s.logo}" alt="" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='block'">
           <span class="snlist__logo-fb" style="display:none">${mark(s.name, { size: 24 })}</span>`
        : `<span class="snlist__logo-fb">${mark(s.name, { size: 24 })}</span>`;
      return `
      <tr data-id="${s.netuid}">
        <td class="num"><a class="snlist__id" href="subnet.html?id=${s.netuid}">SN${s.netuid}</a></td>
        <td>
          <a class="snlist__name" href="subnet.html?id=${s.netuid}">
            <span class="snlist__logo-wrap">${logo}</span>
            <span class="snlist__name-text">
              <span class="snlist__name-main">${s.name}${s.deregRisk ? ' <span class="snlist__dereg" title="Deregistration risk">⚠</span>' : ''}</span>
              <span class="snlist__name-owner">${s.owner || ''}</span>
            </span>
          </a>
        </td>
        <td><span class="snlist__cat" style="--accent:${catColor(s.cat) || 'var(--c-ink-3)'}"><i></i>${catLabel(s.cat) || s.cat}</span></td>
        <td class="num">${fmtPrice(s.price)}</td>
        <td class="num">${fmtMoney(s.mcap)}</td>
        <td class="num">${s.volume != null ? fmtMoney(s.volume) : 'Â·'}</td>
        <td class="num">τ ${Math.round(s.emission || 0).toLocaleString('en-US')}</td>
        <td class="num ${pctClass(s.chg24)}">${fmtPct(s.chg24)}</td>
        <td class="num ${pctClass(s.chg7)}">${fmtPct(s.chg7)}</td>
        <td class="num ${pctClass(s.chg30)}">${fmtPct(s.chg30)}</td>
      </tr>`;
    }).join('');
  }

  function rerenderAll(){ renderStats(); renderHead(); renderBody(); }

  filters.addEventListener('click', e => {
    const btn = e.target.closest('.snlist__filter');
    if (!btn) return;
    filters.querySelectorAll('.snlist__filter').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    state.filter = btn.dataset.filter;
    renderBody();
  });

  let searchT = 0;
  queryEl?.addEventListener('input', () => {
    clearTimeout(searchT);
    searchT = setTimeout(() => { state.query = queryEl.value.trim(); renderBody(); }, 120);
  });

  rerenderAll();

  /* ---------- go live when the TMC subnet feed lands ---------- */
  let unsub = null;
  if (dataLayer){
    const onLive = list => {
      if (!Array.isArray(list) || !list.length) return;
      rows = list.map(fromLive);
      live = true;
      if (srcEl) srcEl.innerHTML = '<span class="live-dot"></span>LIVE · TAO MARKET CAP';
      rerenderAll();
    };
    unsub = dataLayer.subscribe('tao:subnets', onLive);
    onLive(dataLayer.get('tao:subnets'));
  }

  return { destroy(){ clearTimeout(searchT); if (unsub) unsub(); } };
}

void raw;
