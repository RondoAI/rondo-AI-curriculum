/* =================================================================
   SUBNET MAGAZINE, TERMINAL (v3 shell)
   -----------------------------------------------------------------
   Per the "Reimagined Architecture" plan in CLAUDE.md, the terminal
   is ONE workspace replacing the 8-page model. Persistent chrome
   on every edge; the CENTER pane swaps based on the selected MODE.

     ┌────────────────────────────────────────────────┐
     │  STATUS STRIP (global header, network vitals)  │  <- top
     ├────────┬───────────────────────────┬───────────┤
     │  LEFT  │ CENTER PANE (swaps per    │  SIGNALS  │
     │  RAIL  │ selected mode)            │   FEED    │
     │ subnet │                           │ image-rich│
     │ picker │   CHART  · MARKETS · DESK │   cards   │
     │ search │   EDITORIAL · BRIEFINGS   │   for the │
     │ ★ list │   ATTR                    │   active  │
     │        │                           │   subnet  │
     ├────────┴───────────────────────────┴───────────┤
     │  MODE SWITCHER (chips, bottom bar)             │  <- bottom
     └────────────────────────────────────────────────┘

   This SHELL is the sandbox-session deliverable. The CENTER MODES
   are mac-session deliverables, registered through MODE_REGISTRY
   below. Until a mode lands, the center pane shows a stub with
   the spec the mac session should fill in.

   Global selection state (saved to sbn:terminal:v1):
     mode        currently-active mode (default 'chart')
     selectedId  subnet netuid (default 4 = Targon)
     onlyWatched whether the left rail filters to ★ rows
     searchQ     current search filter on the left rail

   Modes register themselves via MODE_REGISTRY. Each mode is an
   object: { key, label, mount(root, ctx) -> destroy }. The ctx
   carries selectedId, dataLayer, and a `select(netuid)` callback
   so modes can drive the global subnet selection from within (e.g.
   the MARKETS mode lets the user click any row to switch SN).
   ================================================================= */

import { html, mount, qs, qsa } from '../lib/dom.js';
import { SUBNETS, subnetById } from '../data/subnets.js';
import { CENTRALIZED_NEWS, newsForSubnet } from '../data/centralized-news.js';
import { recentOracleArticles } from '../data/oracle-articles.js';
import { ARTICLES } from '../data/articles.js';
/* mac-session mode migrations — each new mode is its own module
   under src/views/terminal/. Registered in MODE_REGISTRY below. */
import { mountBriefingsMode } from './terminal/briefings-mode.js';
import { mountEditorialMode } from './terminal/editorial-mode.js';

const TERMINAL_KEY  = 'sbn:terminal:v1';
const WATCHLIST_KEY = 'sbn:dashboard:watchlist:v1';

/* ---------- mode registry ----------------------------------- */

/* Each mode is a function returning { label, mount, destroy }.
   The mac session fills in the meaty implementations (CHART comes
   from the existing cockpit, MARKETS from the dashboard master
   table, etc.); here we ship stubs so the shell renders the full
   nav from day one and feature work can land mode-by-mode without
   refactoring the shell. */

function stubMode(key, title, brief){
  return (root, _ctx) => {
    root.innerHTML = `
      <div class="term-mode-stub">
        <div class="term-mode-stub__eyebrow">⊕ MODE · ${key.toUpperCase()}</div>
        <h2 class="term-mode-stub__h">${title}</h2>
        <p class="term-mode-stub__sub">${brief}</p>
        <div class="term-mode-stub__owner">mac-session deliverable · see CLAUDE.md "Reimagined Architecture"</div>
      </div>`;
    return () => {};
  };
}

export const MODE_REGISTRY = Object.freeze({
  chart:     { label: 'CHART',     mount: stubMode('chart',     'Per-subnet price + emission + volume chart, with KPI strip and tool tray.',                'Migrate from src/views/Cockpit.js renderMain + drawChart + KPI strip. The whole cockpit center pane becomes this mode.') },
  markets:   { label: 'MARKETS',   mount: stubMode('markets',   'All 53 subnets in a sortable, filterable master grid. Click any row to load it across the terminal.', 'Migrate from src/views/Dashboard.js renderMasterTable. On row click: ctx.select(netuid) updates the global selection so every other mode reflects the pick.') },
  desk:      { label: 'DESK',      mount: stubMode('desk',      'Paper portfolio + Brinson-Fachler attribution running on your actual positions.',           'Compose src/views/dashboard/paper-portfolio.js + src/views/dashboard/attribution.js inside this mode. Keep their existing wiring.') },
  editorial: { label: 'EDITORIAL', mount: mountEditorialMode },
  briefings: { label: 'BRIEFINGS', mount: mountBriefingsMode },
  attr:      { label: 'ATTR',      mount: stubMode('attr',      'Attribution analytics on the active portfolio — Brinson-Fachler decomposition with controls.', 'Extract src/views/dashboard/attribution.js into its own mode. Standalone, not nested in DESK.') },
});

/* ---------- shared state ------------------------------------ */

function loadTerminalState(){
  try {
    const raw = JSON.parse(localStorage.getItem(TERMINAL_KEY) || '{}');
    return {
      mode:        raw.mode || 'chart',
      selectedId:  Number.isFinite(raw.selectedId) ? raw.selectedId : 4,
      onlyWatched: !!raw.onlyWatched,
      searchQ:     raw.searchQ || '',
    };
  } catch (_) {
    return { mode: 'chart', selectedId: 4, onlyWatched: false, searchQ: '' };
  }
}
function saveTerminalState(s){
  try { localStorage.setItem(TERMINAL_KEY, JSON.stringify(s)); } catch (_) {}
}
function loadWatchlist(){
  try { return new Set(JSON.parse(localStorage.getItem(WATCHLIST_KEY) || '[]')); }
  catch (_) { return new Set(); }
}
function saveWatchlist(set){
  try { localStorage.setItem(WATCHLIST_KEY, JSON.stringify([...set])); } catch (_) {}
}

/* ---------- formatters -------------------------------------- */
const fmtPct = v => v == null ? '·' : (v >= 0 ? '+' : '') + v.toFixed(2) + '%';
const cls   = v => v == null ? 'is-flat' : (v > 0 ? 'is-up' : v < 0 ? 'is-down' : 'is-flat');
const fmtDate  = d => {
  if (!d) return '·';
  const [y,m,dd] = String(d).split('-');
  return `${dd} ${['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][parseInt(m,10)-1]} ${y.slice(2)}`;
};

/* ---------- mount ------------------------------------------- */

/**
 * @param {HTMLElement} root
 * @param {object} [dataLayer]
 */
export function mountTerminal(root, dataLayer = null){
  const state    = loadTerminalState();
  let watchlist  = loadWatchlist();
  /* URL ?mode=X overrides saved mode so legacy redirects work */
  try {
    const url = new URL(window.location.href);
    const urlMode = url.searchParams.get('mode');
    if (urlMode && MODE_REGISTRY[urlMode]) state.mode = urlMode;
  } catch (_) {}
  let currentDestroy = () => {};

  mount(root, html`
    <section class="term" data-term-root>
      <div class="term__grid">
        <aside class="term__rail" data-region="rail">
          ${renderRail()}
        </aside>
        <section class="term__center" data-region="center">
          <header class="term-center__head">
            <div class="term-center__lbl" data-center-lbl>${MODE_REGISTRY[state.mode]?.label || 'MODE'}</div>
            <div class="term-center__sub" data-center-sub>${renderSelectedHeader()}</div>
          </header>
          <div class="term-center__body" data-center-body>
            <!-- mode mounts here -->
          </div>
        </section>
        <aside class="term__feed" data-region="feed">
          ${renderFeed()}
        </aside>
      </div>
      <nav class="term__modes" aria-label="Terminal modes">
        <span class="term__modes-lbl">MODE</span>
        <div class="term__modes-chips">
          ${Object.entries(MODE_REGISTRY).map(([key, m]) => `
            <button type="button" class="term-mode-chip ${key === state.mode ? 'is-on' : ''}" data-mode="${key}">${m.label}</button>
          `).join('')}
        </div>
        <span class="term__modes-meta">⌘K palette · / search · 1-9 jump</span>
      </nav>
    </section>
  `);

  mountActiveMode();
  wireRail();
  wireModes();

  /* ---------- renders --------------------------------------- */

  function renderRail(){
    const rows = filteredSubnets().map(s => {
      const isOn = s.netuid === state.selectedId;
      const star = watchlist.has(s.netuid);
      return `
        <button type="button" class="term-rail__row ${isOn ? 'is-on' : ''}" data-row="${s.netuid}">
          <span class="term-rail__star ${star ? 'is-on' : ''}" data-star="${s.netuid}">★</span>
          <span class="term-rail__sn">SN${s.netuid}</span>
          <span class="term-rail__name">${s.name}</span>
          <span class="term-rail__chg ${cls(s.chg24)}">${fmtPct(s.chg24)}</span>
        </button>`;
    }).join('');
    return `
      <header class="term-rail__head">
        <div class="term-rail__lbl">SUBNETS · ${filteredSubnets().length} of ${SUBNETS.length}</div>
        <input class="term-rail__search" type="search" data-rail-search placeholder="search SN, name, owner…" value="${state.searchQ}"/>
        <button type="button" class="term-rail__pill ${state.onlyWatched ? 'is-on' : ''}" data-rail-watched>★ WATCHED ${watchlist.size ? '<b>' + watchlist.size + '</b>' : ''}</button>
      </header>
      <div class="term-rail__list" data-rail-list>${rows}</div>`;
  }

  function renderSelectedHeader(){
    const s = subnetById(state.selectedId) || SUBNETS[0];
    return `<span class="term-center__sn">SN${s.netuid}</span> · <strong>${s.name}</strong> · <span class="${cls(s.chg24)}">${fmtPct(s.chg24)}</span>`;
  }

  function renderFeed(){
    const s = subnetById(state.selectedId) || SUBNETS[0];
    const news = newsForSubnet(s, 6);
    const items = news.length ? news.map(n => `
      <a class="term-feed__row" href="${n.url}" target="_blank" rel="noopener">
        <span class="term-feed__kind term-feed__kind--${n.cat}">${n.cat.toUpperCase()}</span>
        <span class="term-feed__date">${fmtDate(n.date)}</span>
        <div class="term-feed__title">${n.headline}</div>
        <span class="term-feed__src">${n.source}</span>
      </a>`).join('') : `<div class="term-feed__empty">No signals indexed for SN${s.netuid}.</div>`;
    return `
      <header class="term-feed__head">
        <div class="term-feed__lbl">SIGNALS · SN${s.netuid}</div>
        <div class="term-feed__sub">live feed scored for the active subnet</div>
      </header>
      <div class="term-feed__list">${items}</div>`;
  }

  /* ---------- helpers --------------------------------------- */

  function filteredSubnets(){
    let rows = SUBNETS.slice().sort((a,b) => (b.mcap || 0) - (a.mcap || 0));
    if (state.onlyWatched){
      rows = rows.filter(s => watchlist.has(s.netuid));
    }
    if (state.searchQ){
      const q = state.searchQ.toLowerCase();
      rows = rows.filter(s =>
        s.name.toLowerCase().includes(q) ||
        ('sn' + s.netuid).includes(q) ||
        String(s.netuid).includes(q) ||
        (s.owner || '').toLowerCase().includes(q) ||
        (s.cat || '').toLowerCase().includes(q));
    }
    return rows;
  }

  function mountActiveMode(){
    try { currentDestroy(); } catch (_) {}
    const body = qs('[data-center-body]', root);
    if (!body) return;
    body.innerHTML = '';
    const ctx = {
      dataLayer,
      selectedId: state.selectedId,
      subnet:     subnetById(state.selectedId) || SUBNETS[0],
      select:     (netuid) => setSelected(netuid),
    };
    const m = MODE_REGISTRY[state.mode] || MODE_REGISTRY.chart;
    const destroy = m.mount(body, ctx);
    currentDestroy = typeof destroy === 'function' ? destroy : () => {};
    const lbl = qs('[data-center-lbl]', root);
    if (lbl) lbl.textContent = m.label;
  }

  function setSelected(netuid){
    if (netuid === state.selectedId) return;
    state.selectedId = netuid;
    saveTerminalState(state);
    qsa('[data-row]', root).forEach(r => r.classList.toggle('is-on', parseInt(r.dataset.row, 10) === netuid));
    const sub = qs('[data-center-sub]', root);
    if (sub) sub.innerHTML = renderSelectedHeader();
    const feed = qs('[data-region="feed"]', root);
    if (feed) feed.innerHTML = renderFeed();
    mountActiveMode();
  }

  function setMode(key){
    if (key === state.mode || !MODE_REGISTRY[key]) return;
    state.mode = key;
    saveTerminalState(state);
    qsa('[data-mode]', root).forEach(b => b.classList.toggle('is-on', b.dataset.mode === key));
    mountActiveMode();
  }

  /* ---------- wiring ---------------------------------------- */

  function wireRail(){
    qsa('[data-row]', root).forEach(rowEl => {
      rowEl.addEventListener('click', (e) => {
        if (e.target.closest('[data-star]')) return;
        const id = parseInt(rowEl.dataset.row, 10);
        if (Number.isNaN(id)) return;
        setSelected(id);
      });
    });
    qsa('[data-star]', root).forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.dataset.star, 10);
        if (watchlist.has(id)) watchlist.delete(id); else watchlist.add(id);
        saveWatchlist(watchlist);
        const rail = qs('[data-region="rail"]', root);
        if (rail){ rail.innerHTML = renderRail(); wireRail(); }
      });
    });
    const search = qs('[data-rail-search]', root);
    if (search){
      let st = 0;
      search.addEventListener('input', (e) => {
        state.searchQ = e.target.value || '';
        saveTerminalState(state);
        clearTimeout(st);
        st = setTimeout(() => {
          const rail = qs('[data-region="rail"]', root);
          if (rail){ rail.innerHTML = renderRail(); wireRail(); search.focus(); search.setSelectionRange(search.value.length, search.value.length); }
        }, 90);
      });
    }
    const w = qs('[data-rail-watched]', root);
    if (w){
      w.addEventListener('click', () => {
        state.onlyWatched = !state.onlyWatched;
        saveTerminalState(state);
        const rail = qs('[data-region="rail"]', root);
        if (rail){ rail.innerHTML = renderRail(); wireRail(); }
      });
    }
  }

  function wireModes(){
    qsa('[data-mode]', root).forEach(btn => {
      btn.addEventListener('click', () => setMode(btn.dataset.mode));
    });
  }

  return () => { try { currentDestroy(); } catch (_) {} };
}
