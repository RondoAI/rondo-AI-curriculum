/* =================================================================
   SUBNET MAGAZINE, COMMAND PALETTE
   -----------------------------------------------------------------
   A Bloomberg-grade ⌘K launcher. Fuzzy-matches subnet IDs and
   names, parses verb-style function codes (GO, WATCH, SORT, CAT,
   RESEARCH, MAGAZINE, ORACLE, ECOSYSTEM, LANDSCAPE, LABS, ARCHIVE,
   DETAIL, MASTER, GAINERS, LOSERS, HIST, COMPARE, ALERT, LAYOUT,
   BACKDROP, BRIEFING, HELP), and dispatches a generic CustomEvent
   on the document so the dashboard, or any other view, can act on
   it without the palette knowing internals.

   Open via:
     ⌘K / Ctrl+K                                (any page)
     click any [data-cmd-trigger] element       (status-bar chip)
     openCommandPalette({ subnets, initial })   (programmatic)

   Action contract: the palette never mutates the dashboard. It
   emits CustomEvent('subnetmag:command', { detail: { fn, … } }) on
   the document. Listeners decide what to do. Unwired commands fall
   through to a "coming soon" toast so the catalog can advertise
   capability honestly without faking it.
   ================================================================= */

import { qs, qsa, escapeHtml } from './dom.js';
import { SUBNETS } from '../data/subnets.js';
import { openCompareModal, resolveCompareTokens } from './compare-modal.js';
import { openHistModal, resolveHistArgs } from './hist-modal.js';

let active = null;
let wired  = false;

/* ---------- command catalog ----------------------------------- */

const COMMANDS = [
  /* ---- Subnet navigation ---- */
  { fn: 'goto-subnet',      verb: 'GO',        args: '<id|name>',           desc: 'Jump to a subnet',                       kind: 'nav' },
  { fn: 'toggle-watch',     verb: 'WATCH',     args: '<id|name>',           desc: 'Toggle watchlist for a subnet',          kind: 'nav' },
  { fn: 'watched-only',     verb: 'WL',        args: '',                    desc: 'Show watchlist only',                    kind: 'nav' },

  /* ---- Sort / filter (command rail + master grid) ---- */
  { fn: 'set-sort',         verb: 'SORT',      args: 'MCAP|CHG|EM|NAME',    desc: 'Sort the command rail',                  kind: 'sort' },
  { fn: 'set-filter',       verb: 'CAT',       args: '<category|ALL>',      desc: 'Filter rail by category',                kind: 'sort' },
  { fn: 'top-gainers',      verb: 'GAINERS',   args: '',                    desc: 'Top 24h gainers in master grid',         kind: 'sort' },
  { fn: 'top-losers',       verb: 'LOSERS',    args: '',                    desc: 'Top 24h losers in master grid',          kind: 'sort' },

  /* ---- Editorial / archive ---- */
  { fn: 'set-archive',      verb: 'RESEARCH',  args: '[id]',                desc: 'Filter archive to a subnet',             kind: 'archive' },
  { fn: 'set-archive',      verb: 'MAGAZINE',  args: '',                    desc: 'Filter archive to magazine dispatches',  kind: 'archive' },
  { fn: 'set-archive',      verb: 'ORACLE',    args: '',                    desc: 'Filter archive to Oracle research',      kind: 'archive' },
  { fn: 'set-archive',      verb: 'ECOSYSTEM', args: '',                    desc: 'Filter archive to ecosystem pieces',     kind: 'archive' },

  /* ---- Section jumps (scroll to a panel) ---- */
  { fn: 'scroll-to',        verb: 'DETAIL',    args: '',                    desc: 'Scroll to the selected subnet detail',   kind: 'jump' },
  { fn: 'scroll-to',        verb: 'MASTER',    args: '',                    desc: 'Scroll to master grid (all subnets)',    kind: 'jump' },
  { fn: 'scroll-to',        verb: 'ARCHIVE',   args: '',                    desc: 'Scroll to research archive',             kind: 'jump' },
  { fn: 'scroll-to',        verb: 'LANDSCAPE', args: '',                    desc: 'Scroll to centralized AI landscape',     kind: 'jump' },
  { fn: 'scroll-to',        verb: 'LABS',      args: '',                    desc: 'Scroll to frontier-labs valuation',      kind: 'jump' },

  /* ---- Function tabs (next upgrade passes) ---- */
  { fn: 'open-hist',        verb: 'HIST',      args: '<id> [1D|7D|30D|90D]',desc: 'Historical OHLC candlestick chart',      kind: 'fn' },
  { fn: 'open-compare',     verb: 'COMPARE',   args: '<id> <id> …',         desc: 'Side-by-side compare (subnets + centralized players)', kind: 'fn' },
  { fn: 'open-alert',       verb: 'ALERT',     args: '',                    desc: 'Price / stake / emission alerts',        kind: 'fn',     wip: true },
  { fn: 'open-layout',      verb: 'LAYOUT',    args: '',                    desc: 'Customize panel layout',                 kind: 'fn',     wip: true },
  { fn: 'open-backdrop',    verb: 'BACKDROP',  args: '[id]',                desc: 'Centralized AI backdrop for selected subnet', kind: 'fn' },
  { fn: 'open-briefing',    verb: 'BRIEFING',  args: '[date]',              desc: 'Jump to the daily briefing strip',       kind: 'fn' },

  /* ---- Meta ---- */
  { fn: 'help',             verb: 'HELP',      args: '',                    desc: 'Keyboard shortcuts & syntax',            kind: 'meta' },
];

const KEYBOARD_HELP = [
  ['⌘K · Ctrl+K', 'Open command palette'],
  ['/',           'Focus rail search (when palette closed)'],
  ['j · ↓',       'Next subnet'],
  ['k · ↑',       'Previous subnet'],
  ['1 – 9',       'Jump to top N visible'],
  ['Enter',       'Run highlighted command'],
  ['Esc',         'Close palette / clear search'],
];

const SYNTAX_HELP = [
  ['GO 23 · GO targon',           'Jump by ID or name'],
  ['WATCH 4',                     'Toggle SN4 in watchlist'],
  ['SORT MCAP|CHG|EM|NAME',       'Sort the rail'],
  ['CAT TEXT · CAT ALL',          'Filter rail by category'],
  ['RESEARCH · RESEARCH 23',      'Archive: pieces about selected subnet'],
  ['MAGAZINE · ORACLE · ECO…',    'Archive filter shortcut'],
  ['LANDSCAPE · LABS',            'Jump to centralized AI rail'],
  ['GAINERS · LOSERS',            'Sort master grid by 24h move'],
];

/* ---------- public API ---------------------------------------- */

/**
 * Open the command palette. Idempotent, only one open at a time.
 * @param {{ subnets?: any[], initial?: string }} [opts]
 */
export function openCommandPalette(opts = {}){
  if (active) return;
  const subnets = opts.subnets || SUBNETS || [];
  active = mountPalette({ subnets, initial: opts.initial || '' });
}

export function closeCommandPalette(){
  if (active && typeof active.close === 'function') active.close();
}

/**
 * Wire global ⌘K / Ctrl+K + click on [data-cmd-trigger]. Idempotent.
 * @param {{ subnets?: any[] }} [opts]
 */
export function installCommandPalette(opts = {}){
  if (wired || typeof document === 'undefined') return;
  wired = true;
  const subnets = opts.subnets || SUBNETS;
  document.addEventListener('keydown', (e) => {
    /* Don't intercept ⌘K when the user is composing in an input
       UNLESS they explicitly hit the meta+K combination, that's
       the whole shortcut. Plain letter keys typed in inputs are
       untouched. */
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')){
      e.preventDefault();
      openCommandPalette({ subnets });
    }
  });
  document.addEventListener('click', (e) => {
    const t = e.target.closest && e.target.closest('[data-cmd-trigger]');
    if (!t) return;
    e.preventDefault();
    openCommandPalette({ subnets });
  });
}

/* ---------- mount / behavior ---------------------------------- */

function mountPalette({ subnets, initial }){
  const root = document.createElement('div');
  root.className = 'cmdpal';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-label', 'Command palette');
  root.innerHTML = template(initial);
  document.body.appendChild(root);
  const prevOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';

  const input  = qs('.cmdpal__input',  root);
  const list   = qs('.cmdpal__list',   root);
  const empty  = qs('.cmdpal__empty',  root);
  const status = qs('.cmdpal__status', root);

  let items  = [];
  let cursor = 0;

  function refresh(){
    const q = (input.value || '').trim();
    items  = match(q, subnets);
    cursor = 0;
    render();
  }

  function render(){
    if (!items.length){
      list.innerHTML = '';
      empty.style.display = '';
      status.textContent = 'No matches. Type HELP for the full syntax.';
      return;
    }
    empty.style.display = 'none';
    list.innerHTML = items.map((it, i) => itemHtml(it, i === cursor)).join('');
    status.textContent =
      `${items.length} match${items.length === 1 ? '' : 'es'} · ↵ run · ↑↓ move · ESC close`;
  }

  function move(d){
    if (!items.length) return;
    cursor = (cursor + d + items.length) % items.length;
    render();
    const sel = qs('.cmdpal__row.is-on', list);
    if (sel) sel.scrollIntoView({ block: 'nearest' });
  }

  function execute(it){
    if (!it) return;
    if (it.kind === 'help'){ showHelp(); return; }
    if (it.kind === 'subnet'){
      dispatch({ fn: 'goto-subnet', netuid: it.subnet.netuid });
      close();
      return;
    }
    if (it.kind === 'cmd'){
      const def = it.def;
      const parts = (it.parsed && it.parsed.parts) || [];

      /* COMPARE bypasses the command bus, the modal is self-
         contained (just needs SUBNETS + CENTRALIZED_PLAYERS, both
         imported by compare-modal.js itself), so we open it inline
         and skip the dispatch. Works from any page. */
      if (def.fn === 'open-compare'){
        const tokens = parts.filter(Boolean);
        const items  = resolveCompareTokens(tokens);
        openCompareModal({ items });
        close();
        return;
      }

      /* HIST is also self-contained — just needs SUBNETS + CandleChart.
         Opens the historical OHLC modal inline. Works from any page. */
      if (def.fn === 'open-hist'){
        const { netuid, range } = resolveHistArgs(parts);
        if (netuid == null){
          toast('HIST needs a subnet. Try HIST 4  or  HIST targon 7D');
          close();
          return;
        }
        openHistModal({ netuid, range });
        close();
        return;
      }

      /* RESEARCH/MAGAZINE/ORACLE/ECOSYSTEM all dispatch the same
         fn with a `mode` field. The verb itself is the mode unless
         it's RESEARCH, which means "the currently selected subnet". */
      let detail = { fn: def.fn, raw: it.parsed ? it.parsed.rest : '', parts, wip: !!def.wip };
      if (def.fn === 'set-archive'){
        detail.mode = def.verb === 'RESEARCH' ? 'selected' : def.verb.toLowerCase();
        /* RESEARCH with an explicit id arg also selects that subnet first. */
        if (def.verb === 'RESEARCH' && parts[0]){
          const id = parseSubnetArg(parts[0], subnets);
          if (id != null) detail.netuid = id;
        }
      }
      if (def.fn === 'scroll-to'){
        const map = {
          DETAIL:    '.dash-detail',
          MASTER:    '.dash-master',
          ARCHIVE:   '.dash-arc',
          LANDSCAPE: '.dash-comparator',
          LABS:      '.dash-comparator',
        };
        detail.target = map[def.verb] || '.dash-detail';
      }
      if (def.fn === 'set-sort')   detail.mode = (parts[0] || '').toLowerCase();
      if (def.fn === 'set-filter') detail.mode = (parts[0] || 'all').toLowerCase();
      dispatch(detail);
      if (def.wip){
        toast(`${def.verb} ships in the next upgrade pass. Tracked.`);
      }
      close();
      return;
    }
  }

  function dispatch(detail){
    document.dispatchEvent(new CustomEvent('subnetmag:command', { detail }));
  }

  function onKey(e){
    if (e.key === 'Escape')                                            { e.preventDefault(); close(); return; }
    if (e.key === 'ArrowDown' || (e.ctrlKey && e.key === 'n'))         { e.preventDefault(); move(+1); return; }
    if (e.key === 'ArrowUp'   || (e.ctrlKey && e.key === 'p'))         { e.preventDefault(); move(-1); return; }
    if (e.key === 'Enter')                                             { e.preventDefault(); execute(items[cursor]); return; }
  }

  function onListClick(e){
    const row = e.target.closest('.cmdpal__row');
    if (!row) return;
    const i = +row.dataset.i;
    if (!Number.isFinite(i)) return;
    cursor = i;
    execute(items[cursor]);
  }

  function onBackdrop(e){
    if (e.target.closest('[data-cmd-close]')) close();
  }

  input.addEventListener('input',  refresh);
  input.addEventListener('keydown', onKey);
  list.addEventListener('click',    onListClick);
  root.addEventListener('click',    onBackdrop);

  function showHelp(){
    const kbRows = KEYBOARD_HELP.map(([k, d]) =>
      `<div class="cmdpal__helprow"><kbd class="cmdpal__kbd">${escapeHtml(k)}</kbd><span>${escapeHtml(d)}</span></div>`
    ).join('');
    const synRows = SYNTAX_HELP.map(([k, d]) =>
      `<div class="cmdpal__helprow"><code class="cmdpal__code">${escapeHtml(k)}</code><span>${escapeHtml(d)}</span></div>`
    ).join('');
    list.innerHTML =
      `<div class="cmdpal__help">
         <div class="cmdpal__helphead">KEYBOARD</div>${kbRows}
         <div class="cmdpal__helphead">SYNTAX</div>${synRows}
       </div>`;
    empty.style.display = 'none';
    status.textContent = 'Press ESC to close · type anything to return to search';
    /* One-shot dismissal: any input clears help back to results. */
    const back = () => { input.value = ''; refresh(); input.focus(); };
    input.addEventListener('input', back, { once: true });
  }

  refresh();
  setTimeout(() => input.focus(), 0);

  function close(){
    document.body.style.overflow = prevOverflow;
    root.remove();
    active = null;
  }

  return { close };
}

/* ---------- templates ---------------------------------------- */

function template(initial){
  return `
    <div class="cmdpal__backdrop" data-cmd-close></div>
    <div class="cmdpal__panel" role="combobox" aria-haspopup="listbox" aria-expanded="true">
      <div class="cmdpal__inputwrap">
        <span class="cmdpal__chev">›</span>
        <input type="text" class="cmdpal__input"
               placeholder="GO 23 · WATCH targon · RESEARCH · LANDSCAPE · HELP …"
               value="${escapeHtml(initial)}"
               autocomplete="off" autocorrect="off" spellcheck="false"
               inputmode="search" aria-label="Command" />
        <kbd class="cmdpal__kbdhint" aria-label="Press Escape to close">ESC</kbd>
      </div>
      <div class="cmdpal__list" role="listbox" aria-label="Command results"></div>
      <div class="cmdpal__empty" style="display:none">
        No matches. Try <code>GO 4</code>, <code>RESEARCH</code>, or <code>HELP</code>.
      </div>
      <div class="cmdpal__foot">
        <span class="cmdpal__status"></span>
        <span class="cmdpal__brand">⌘ SUBNEτ COMMAND</span>
      </div>
    </div>
  `;
}

function itemHtml(it, on){
  const cls = 'cmdpal__row' + (on ? ' is-on' : '');
  if (it.kind === 'subnet'){
    const s = it.subnet;
    const chg = s.chg24;
    const chgCls = chg == null ? 'is-flat' : (chg > 0 ? 'is-up' : chg < 0 ? 'is-down' : 'is-flat');
    const chgStr = chg == null ? '·' : (chg >= 0 ? '+' : '') + (+chg).toFixed(2) + '%';
    return `
      <div class="${cls}" data-i="${it.i}">
        <span class="cmdpal__kind cmdpal__kind--nav">GO</span>
        <span class="cmdpal__sn">SN${s.netuid}</span>
        <span class="cmdpal__name">${escapeHtml(s.name)}</span>
        <span class="cmdpal__cat">${escapeHtml((s.cat || '').toUpperCase())}</span>
        <span class="cmdpal__chg ${chgCls}">${chgStr}</span>
      </div>`;
  }
  if (it.kind === 'cmd'){
    const wip = it.def.wip ? `<span class="cmdpal__wip">WIP</span>` : '';
    return `
      <div class="${cls}" data-i="${it.i}">
        <span class="cmdpal__kind cmdpal__kind--${it.def.kind}">${escapeHtml(it.def.verb)}</span>
        <span class="cmdpal__cmdname">${escapeHtml(it.def.verb)} <em>${escapeHtml(it.def.args || '')}</em></span>
        <span class="cmdpal__cmddesc">${escapeHtml(it.def.desc)}</span>
        ${wip}
      </div>`;
  }
  if (it.kind === 'help'){
    return `
      <div class="${cls}" data-i="${it.i}">
        <span class="cmdpal__kind cmdpal__kind--meta">?</span>
        <span class="cmdpal__cmdname">HELP</span>
        <span class="cmdpal__cmddesc">Keyboard shortcuts &amp; command syntax</span>
      </div>`;
  }
  return '';
}

/* ---------- matcher ------------------------------------------ */

function match(q, subnets){
  if (!q){
    /* Empty query: full command catalog + top-8 subnets by mcap. */
    const cmds = COMMANDS.map(def => ({ kind: 'cmd', def, parsed: { verb: def.verb, rest: '', parts: [] } }));
    const top = (subnets || [])
      .slice()
      .sort((a, b) => (b.mcap || 0) - (a.mcap || 0))
      .slice(0, 8)
      .map(s => ({ kind: 'subnet', subnet: s }));
    return reindex([...cmds, ...top]);
  }

  /* Try verb-prefix parse first: GO 23, WATCH targon, SORT MCAP, etc. */
  const parsed = parseVerb(q);
  const out = [];
  if (parsed){
    const def = COMMANDS.find(c => c.verb === parsed.verb);
    if (def){
      out.push({ kind: 'cmd', def, parsed });
      /* Verbs that take a subnet arg, also show matching subnets so
         the user can pick directly without typing the full id. */
      if (parsed.rest && ['GO','WATCH','HIST','COMPARE','BACKDROP','RESEARCH'].includes(parsed.verb)){
        addSubnetMatches(parsed.rest, subnets, out, /*max*/ 12);
      }
      return reindex(out);
    }
  }

  /* Otherwise fall back to: subnet fuzzy + verb-prefix-matching commands. */
  addSubnetMatches(q, subnets, out, /*max*/ 12);

  const ql = q.toLowerCase();
  COMMANDS.forEach(def => {
    if (def.verb.toLowerCase().startsWith(ql) ||
        (def.desc || '').toLowerCase().includes(ql)){
      out.push({ kind: 'cmd', def, parsed: { verb: def.verb, rest: '', parts: [] } });
    }
  });
  if (ql === 'help' || ql === '?') out.unshift({ kind: 'help' });

  return reindex(out);
}

function addSubnetMatches(q, subnets, out, max = 12){
  if (!subnets || !subnets.length) return;
  const ql = q.toLowerCase().trim();
  const num = parseInt(ql.replace(/^sn/i, ''), 10);
  const seen = new Set();
  let added = 0;

  if (Number.isFinite(num)){
    const exact = subnets.find(s => s.netuid === num);
    if (exact){ out.push({ kind: 'subnet', subnet: exact }); seen.add(exact.netuid); added++; }
  }
  for (const s of subnets){
    if (added >= max) break;
    if (seen.has(s.netuid)) continue;
    const name  = (s.name  || '').toLowerCase();
    const owner = (s.owner || '').toLowerCase();
    const tags  = ((s.tags || []).join(' ') || '').toLowerCase();
    if (name.includes(ql) || owner.includes(ql) || tags.includes(ql) ||
        ('sn' + s.netuid).includes(ql)){
      out.push({ kind: 'subnet', subnet: s });
      seen.add(s.netuid);
      added++;
    }
  }
}

function parseVerb(q){
  const parts = q.trim().split(/\s+/);
  const verb  = (parts[0] || '').toUpperCase();
  if (!COMMANDS.some(c => c.verb === verb)) return null;
  const rest = parts.slice(1).join(' ');
  return { verb, rest, parts: parts.slice(1) };
}

function reindex(items){
  return items.map((it, i) => ({ ...it, i }));
}

/* Exported because the dashboard listener uses the same parser for
   string args coming in over the event bus. */
export function parseSubnetArg(s, subnets){
  if (!s) return null;
  const num = parseInt(String(s).replace(/^sn/i, ''), 10);
  if (Number.isFinite(num)){
    return (subnets || SUBNETS).find(r => r.netuid === num) ? num : null;
  }
  const ql = String(s).toLowerCase();
  const src = subnets || SUBNETS;
  const hit = src.find(r => (r.name || '').toLowerCase() === ql)
           || src.find(r => (r.name || '').toLowerCase().startsWith(ql))
           || src.find(r => (r.name || '').toLowerCase().includes(ql));
  return hit ? hit.netuid : null;
}

/* ---------- toast ------------------------------------------- */

function toast(msg){
  const el = document.createElement('div');
  el.className = 'cmdpal-toast';
  el.textContent = msg;
  document.body.appendChild(el);
  /* requestAnimationFrame so the .is-vis class transition fires */
  requestAnimationFrame(() => el.classList.add('is-vis'));
  setTimeout(() => {
    el.classList.remove('is-vis');
    setTimeout(() => el.remove(), 250);
  }, 3200);
}
