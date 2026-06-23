/* =================================================================
   SUBNET MAGAZINE, COMPARE MODAL
   -----------------------------------------------------------------
   Side-by-side comparison of 2-6 items. Items can be Bittensor
   subnets, centralized AI players, or any mix of the two — the
   magazine's unique angle is being able to put SN4 Targon next to
   OpenAI in a single visual frame.

   Opens via the command palette:
     COMPARE 4 19 27          three subnets
     COMPARE SN4 openai       one subnet vs one centralized lab
     COMPARE targon nous      two subnets by name
     COMPARE 4 19 anthropic   mix

   The palette parses the verb + args, resolves each token to either
   a Subnet record (via netuid or name) or a Player record (via id or
   name), then calls openCompareModal({ items }).

   Visual register: same eDEX-style red-on-black as the rest of the
   magazine. Each item is a column; rows are labeled facets (TYPE /
   CATEGORY / OPERATOR / PRICE / 24H / …). Numeric rows that are
   comparable across columns get color-coded: highest cell green,
   lowest red, middle neutral. Color is only applied when at least
   two columns have a value, so a column of N/A's stays clean.
   ================================================================= */

import { qs, qsa, escapeHtml } from './dom.js';
import { SUBNETS } from '../data/subnets.js';
import { CENTRALIZED_PLAYERS } from '../data/centralized.js';

let active = null;

/* ---------- public API --------------------------------------- */

/**
 * Parse a verb-arg string (e.g. "4 19 anthropic openai") into an
 * ordered array of {kind, data} items. Returns at most 6 items;
 * silently drops tokens that don't resolve to either a subnet or a
 * centralized player.
 * @param {string[]} tokens
 * @returns {Array<{kind:'subnet'|'player', data:any, token:string}>}
 */
export function resolveCompareTokens(tokens){
  const out = [];
  for (const raw of (tokens || [])){
    if (out.length >= 6) break;
    const t = String(raw || '').trim();
    if (!t) continue;
    const item = resolveOne(t);
    if (item) out.push({ ...item, token: t });
  }
  return out;
}

/**
 * Open the compare modal with a resolved item list. Idempotent;
 * only one modal at a time.
 * @param {{ items: Array<{kind:'subnet'|'player', data:any, token?:string}> }} opts
 */
export function openCompareModal({ items }){
  if (active) closeCompareModal();
  if (!Array.isArray(items) || items.length < 2){
    /* Toast a friendly hint instead of opening an empty modal —
       the palette will pass <2 items if the user typed COMPARE with
       only one arg. */
    toast('COMPARE needs 2+ items. Try: COMPARE 4 19  or  COMPARE targon openai');
    return;
  }
  active = mountModal({ items });
}

export function closeCompareModal(){
  if (active && typeof active.close === 'function') active.close();
}

/* ---------- token resolution -------------------------------- */

function resolveOne(token){
  /* Try subnet by id first: '4', 'sn4', 'SN23'. */
  const num = parseInt(token.replace(/^sn/i, ''), 10);
  if (Number.isFinite(num)){
    const s = SUBNETS.find(r => r.netuid === num);
    if (s) return { kind: 'subnet', data: s };
  }
  const tl = token.toLowerCase();
  /* Then subnet by exact / prefix / contains name match. */
  const sExact   = SUBNETS.find(r => (r.name || '').toLowerCase() === tl);
  const sPrefix  = SUBNETS.find(r => (r.name || '').toLowerCase().startsWith(tl));
  const sContain = SUBNETS.find(r => (r.name || '').toLowerCase().includes(tl));
  if (sExact)   return { kind: 'subnet', data: sExact };
  /* Player by id / name / contained name. Prefer exact id, then
     exact name, then prefix on lead segment ('Alibaba' from
     'Alibaba · Qwen'). */
  const pId      = CENTRALIZED_PLAYERS.find(p => p.id === tl);
  if (pId) return { kind: 'player', data: pId };
  const pExact   = CENTRALIZED_PLAYERS.find(p => (p.name || '').toLowerCase() === tl);
  if (pExact) return { kind: 'player', data: pExact };
  const pLead    = CENTRALIZED_PLAYERS.find(p =>
    (p.name || '').split(/\s*[·\.]\s*/)[0].toLowerCase() === tl);
  if (pLead) return { kind: 'player', data: pLead };
  /* Fall back to subnet name prefix / contains, then player name
     contains. The subnet space is smaller so prefix-matching there
     is less ambiguous than the player set. */
  if (sPrefix)   return { kind: 'subnet', data: sPrefix };
  if (sContain)  return { kind: 'subnet', data: sContain };
  const pContain = CENTRALIZED_PLAYERS.find(p => (p.name || '').toLowerCase().includes(tl));
  if (pContain)  return { kind: 'player', data: pContain };
  return null;
}

/* ---------- format helpers (local, no external deps) -------- */

const fmtPrice = p => p == null ? '·' : (p < 1 ? '$' + p.toFixed(4) : '$' + p.toFixed(2));
const fmtMcap  = m => m == null ? '·' : '$' + (m >= 1000 ? (m/1000).toFixed(2) + 'B' : m.toFixed(1) + 'M');
const fmtPct   = v => v == null ? '·' : ((v >= 0 ? '+' : '') + v.toFixed(2) + '%');
const fmtInt   = n => n == null ? '·' : Math.round(n).toLocaleString('en-US');

/* ---------- row spec ---------------------------------------- */

/**
 * Each row spec yields a value per item. `cmp` rows participate in
 * color-coding (highest green, lowest red); rows where the two
 * kinds aren't comparable are marked cmp:false to skip coloring.
 * `dir` says whether higher is better ('up') or lower is ('down'),
 * defaults to 'up'.
 */
const ROWS = [
  { lbl: 'TYPE',         cmp: false,
    get: it => it.kind === 'subnet' ? 'DECENTRALIZED' : 'CENTRALIZED' },
  { lbl: 'CATEGORY',     cmp: false,
    get: it => it.kind === 'subnet'
      ? (it.data.cat || '').toUpperCase()
      : `${(it.data.cat || '').toUpperCase()}${it.data.subcat ? ' · ' + it.data.subcat : ''}` },
  { lbl: 'OPERATOR',     cmp: false,
    get: it => it.kind === 'subnet' ? (it.data.owner || '·') : it.data.name },
  { lbl: 'PRICE / VAL',  cmp: false,
    get: it => it.kind === 'subnet' ? fmtPrice(it.data.price) : (it.data.valuation || '·') },
  { lbl: '24H',          cmp: true,  dir: 'up', key: 'chg24',
    get: it => it.kind === 'subnet' ? fmtPct(it.data.chg24) : '·',
    val: it => it.kind === 'subnet' ? it.data.chg24 : null },
  { lbl: '7D',           cmp: true,  dir: 'up', key: 'chg7',
    get: it => it.kind === 'subnet' ? fmtPct(it.data.chg7) : '·',
    val: it => it.kind === 'subnet' ? it.data.chg7 : null },
  { lbl: '30D',          cmp: true,  dir: 'up', key: 'chg30',
    get: it => it.kind === 'subnet' ? fmtPct(it.data.chg30) : '·',
    val: it => it.kind === 'subnet' ? it.data.chg30 : null },
  { lbl: 'MARKET CAP',   cmp: false,
    get: it => it.kind === 'subnet' ? fmtMcap(it.data.mcap) : (it.data.valuation || '·') },
  { lbl: 'EMISSION/DAY', cmp: true,  dir: 'up', key: 'emission',
    get: it => it.kind === 'subnet' ? (fmtInt(it.data.emission) + ' τ') : '·',
    val: it => it.kind === 'subnet' ? it.data.emission : null },
  { lbl: 'MINERS',       cmp: true,  dir: 'up', key: 'miners',
    get: it => it.kind === 'subnet' ? fmtInt(it.data.miners) : '·',
    val: it => it.kind === 'subnet' ? it.data.miners : null },
  { lbl: 'VALIDATORS',   cmp: true,  dir: 'up', key: 'validators',
    get: it => it.kind === 'subnet' ? fmtInt(it.data.validators) : '·',
    val: it => it.kind === 'subnet' ? it.data.validators : null },
  { lbl: 'STAKE',        cmp: true,  dir: 'up', key: 'stake',
    get: it => it.kind === 'subnet' ? (fmtInt(it.data.stake) + ' τ') : '·',
    val: it => it.kind === 'subnet' ? it.data.stake : null },
  { lbl: 'OPEN SOURCE',  cmp: false,
    get: it => it.kind === 'subnet'
      ? (it.data.gh ? 'YES' : '·')
      : (it.data.openSource ? 'YES' : 'NO') },
  { lbl: 'REGION',       cmp: false,
    get: it => it.kind === 'subnet' ? 'global' : (it.data.region || '·') },
  { lbl: 'EMPLOYEES',    cmp: true,  dir: 'up', key: 'employees',
    get: it => it.kind === 'player' && it.data.employees ? fmtInt(it.data.employees) : '·',
    val: it => it.kind === 'player' ? it.data.employees : null },
  { lbl: 'FOUNDED',      cmp: false,
    get: it => it.kind === 'player' && it.data.founded ? String(it.data.founded) : '·' },
];

/* ---------- mount ------------------------------------------- */

function mountModal({ items }){
  const root = document.createElement('div');
  root.className = 'cmpm';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-label', `Compare ${items.length} items`);
  root.innerHTML = template(items);
  document.body.appendChild(root);
  const prevOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';

  function onKey(e){ if (e.key === 'Escape'){ e.preventDefault(); close(); } }
  function onClick(e){
    if (e.target.closest('[data-cmpm-close]')) close();
  }
  document.addEventListener('keydown', onKey);
  root.addEventListener('click', onClick);

  /* focus the close button so screen readers / keyboard users land
     somewhere sensible. */
  setTimeout(() => qs('.cmpm__close', root)?.focus(), 0);

  function close(){
    document.removeEventListener('keydown', onKey);
    document.body.style.overflow = prevOverflow;
    root.remove();
    active = null;
  }
  return { close };
}

function template(items){
  /* Pre-compute per-row min/max across comparable cells so we can
     color-code in one pass. */
  const colorMap = new Map();   // key=row.key, value={min, max, vals: [val | null per item]}
  for (const row of ROWS){
    if (!row.cmp) continue;
    const vals = items.map(it => {
      const v = row.val ? row.val(it) : null;
      return (v == null || !Number.isFinite(v)) ? null : v;
    });
    const present = vals.filter(v => v != null);
    if (present.length < 2){
      colorMap.set(row.key, { vals });   // no coloring, all neutral
      continue;
    }
    colorMap.set(row.key, {
      min: Math.min(...present),
      max: Math.max(...present),
      vals,
    });
  }

  const headerCols = items.map((it, i) => {
    if (it.kind === 'subnet'){
      const s = it.data;
      return `
        <th class="cmpm__col cmpm__col--sub" data-i="${i}">
          <div class="cmpm__col-kind">DECENTRALIZED · SN${s.netuid}</div>
          <div class="cmpm__col-name">${escapeHtml(s.name)}</div>
          <div class="cmpm__col-cat">${escapeHtml((s.cat || '').toUpperCase())}</div>
        </th>`;
    }
    const p = it.data;
    return `
      <th class="cmpm__col cmpm__col--play" data-i="${i}">
        <div class="cmpm__col-kind">CENTRALIZED · ${escapeHtml(p.region || '·')}</div>
        <div class="cmpm__col-name">${escapeHtml(p.name)}</div>
        <div class="cmpm__col-cat">${escapeHtml((p.cat || '').toUpperCase())}${p.subcat ? ' · ' + escapeHtml(p.subcat) : ''}</div>
      </th>`;
  }).join('');

  const bodyRows = ROWS.map(row => {
    const cells = items.map((it, i) => {
      const txt = row.get(it);
      let cls = '';
      if (row.cmp){
        const cm = colorMap.get(row.key);
        const v  = cm?.vals?.[i];
        if (v != null && cm?.min != null && cm?.max != null && cm.min !== cm.max){
          const isHigh = v === cm.max;
          const isLow  = v === cm.min;
          /* row.dir: 'up' means higher is better (green for high, red
             for low); 'down' would flip if any row needs it (none
             currently). */
          const dir = row.dir || 'up';
          if (isHigh) cls = dir === 'up' ? 'is-best'  : 'is-worst';
          if (isLow)  cls = dir === 'up' ? 'is-worst' : 'is-best';
        }
      }
      return `<td class="cmpm__cell ${cls}" data-i="${i}">${escapeHtml(String(txt))}</td>`;
    }).join('');
    return `
      <tr class="cmpm__row">
        <th class="cmpm__lbl">${escapeHtml(row.lbl)}</th>
        ${cells}
      </tr>`;
  }).join('');

  /* Footer link block: per item, the most useful outbound links so
     the user can move from comparing to investigating. */
  const linkCells = items.map(it => {
    if (it.kind === 'subnet'){
      const s = it.data;
      const ghLink   = s.gh ? `<a href="https://github.com/${escapeHtml(s.gh)}" target="_blank" rel="noopener">GitHub ↗</a>` : '';
      const tsLink   = `<a href="https://taostats.io/subnets/${s.netuid}" target="_blank" rel="noopener">Taostats ↗</a>`;
      const tmcLink  = `<a href="https://taomarketcap.com/subnets/${s.netuid}" target="_blank" rel="noopener">TaoMarketcap ↗</a>`;
      return `<td class="cmpm__links" data-i="${it._i || 0}">${ghLink} ${tsLink} ${tmcLink}</td>`;
    }
    const p = it.data;
    return `<td class="cmpm__links">${p.url ? `<a href="${escapeHtml(p.url)}" target="_blank" rel="noopener">Site ↗</a>` : '·'}</td>`;
  }).join('');

  return `
    <div class="cmpm__backdrop" data-cmpm-close></div>
    <div class="cmpm__panel">
      <header class="cmpm__head">
        <span class="cmpm__title">
          <span class="cmpm__fcode">&lt;COMPARE&gt;</span>
          ${items.length} items
        </span>
        <span class="cmpm__sub">Decentralized subnets and centralized AI players in a single frame · ESC to close</span>
        <button type="button" class="cmpm__close" data-cmpm-close aria-label="Close compare">✕</button>
      </header>

      <div class="cmpm__scroll">
        <table class="cmpm__table">
          <thead>
            <tr>
              <th class="cmpm__lbl cmpm__lbl--head">FACET</th>
              ${headerCols}
            </tr>
          </thead>
          <tbody>
            ${bodyRows}
            <tr class="cmpm__row cmpm__row--links">
              <th class="cmpm__lbl">LINKS</th>
              ${linkCells}
            </tr>
          </tbody>
        </table>
      </div>

      <footer class="cmpm__foot">
        <span>↑↓ scroll · ESC close</span>
        <span class="cmpm__brand">⌘ COMPARE</span>
      </footer>
    </div>
  `;
}

/* ---------- toast (same as command-palette) ----------------- */
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
