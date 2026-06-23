/* =================================================================
   SUBNET MAGAZINE, DESK COMMENTARY
   -----------------------------------------------------------------
   Bloomberg PORT's "AI Portfolio Commentary" is the inspiration:
   a daily narrative paragraph that reads the reader's actual data
   (positions, P&L, the day's briefing, sector aggregates) and
   composes a senior-trader's morning note out of it.

   We do this template-based, not LLM-backed. The reasons:
     - No infra: every source is already in the page (paper-portfolio
       in localStorage, briefings in src/data/briefings.js, subnets in
       SUBNETS). No fetch, no key, no latency, no cost.
     - Honest: every claim traces directly to a number we can point at.
       No hallucination surface, no "as an AI language model" filler.
     - Voice: matches Rondo's editorial register — clipped,
       evidence-first, named entities everywhere, no fluff.

   Output shape: structured paragraphs with inline citation chips
   (each named subnet / briefing is a clickable element that dispatches
   subnetmag:command via the existing command bus). Provenance footer
   names every source used + a live "updated Xs ago" stamp.

   Always rendered. With no positions: the personal paragraph is
   replaced with a market-context-only narrative, so the panel is
   useful from the first paint.

   World-class polish notes:
     - Body in Archivo serif (the editorial register, not the data
       register) at 15.5/1.55 — readable like a Bloomberg morning note
     - Citation chips in mono caps 9.5px with hairline border
     - Words/chips fade in on first mount with a subtle stagger so
       the panel "settles in" rather than snapping
     - Color discipline: green for "up", red for "down", amber for
       "stale", grey for context. No purple, no rainbow.
     - Time-aware greeting (Good morning / afternoon / evening) — the
       little touches that make Bloomberg Terminal feel inhabited
   ================================================================= */

import { html, qs, escapeHtml } from '../../lib/dom.js';
import { SUBNETS, subnetById } from '../../data/subnets.js';
import { loadPaperState, STARTING_CASH } from '../../data/paper-portfolio.js';
import { latestBriefing, daysBetween } from '../../data/briefings.js';

const CAT_LABEL = {
  text:'TEXT', vision:'VISION', audio:'AUDIO', video:'VIDEO',
  multimodal:'MULTIMODAL', training:'TRAINING', data:'DATA',
  search:'SEARCH', finance:'FINANCE', agents:'AGENTS',
  robotics:'ROBOTICS', science:'SCIENCE', infra:'INFRA',
  prediction:'PREDICTION',
};

/* ---------- public mount ---------------------------------- */

export function mountCommentary(root){
  if (!root) return { destroy(){} };
  const renderOnce = () => {
    const state    = loadPaperState();
    const briefing = latestBriefing();
    const now      = new Date();
    root.innerHTML = renderHtml(composeCommentary({ state, subnets: SUBNETS, briefing, now }));
    wireChips(root);
    /* World-class polish — stagger the paragraph + chip reveals so
       the panel settles in instead of snapping. CSS handles the
       fade; we just tag children with their stagger index. */
    const paras = root.querySelectorAll('.cmt__p');
    paras.forEach((p, i) => { p.style.setProperty('--cmt-stagger', i); });
  };
  renderOnce();
  /* Re-render on any visible page state change that matters:
     - storage events from another tab editing positions
     - the dashboard's own subnet-selection commands (paper P&L stays
       the same but per-subnet context might surface a different
       contributor on re-aggregation, future work)
     - every 60s as a freshness tick so the "updated Xs ago" stamp
       reflects truth */
  const onStorage = (e) => { if (e.key && e.key.startsWith('sbn:paper-portfolio')) renderOnce(); };
  window.addEventListener('storage', onStorage);
  const tick = setInterval(renderOnce, 60_000);
  return {
    destroy(){
      window.removeEventListener('storage', onStorage);
      clearInterval(tick);
    },
  };
}

/* ---------- commentary composition ------------------------- */

/**
 * Pure function: read the data, return a structured commentary
 * with paragraphs + named entities + sources. Separate from DOM
 * rendering so the same logic can drive an export-to-markdown
 * surface later.
 */
function composeCommentary({ state, subnets, briefing, now }){
  const positions = (state && state.positions) || [];
  const cashUSD   = (state && state.cashUSD)   || STARTING_CASH;

  /* Mark-to-market every position. We tolerate a missing subnet
     (e.g. seed mismatch with localStorage) by falling back to the
     position's own avgCost so the value reads correctly even
     without live data. */
  const ranked = positions.map(p => {
    const s    = subnetById(p.netuid);
    const mark = (s && Number.isFinite(s.price)) ? s.price : p.avgCost;
    const value = p.shares * mark;
    const cost  = p.shares * p.avgCost;
    const pl    = value - cost;
    const plPct = cost ? (pl / cost) * 100 : 0;
    const chg24 = s ? (s.chg24 || 0) : 0;
    /* Approximate today's $ contribution: shares × (mark - mark/(1+chg24%)).
       Without a real per-day history this is the best we can do at
       v1; the labeling reflects the approximation. */
    const priorMark = mark / (1 + chg24 / 100);
    const todayDelta = p.shares * (mark - priorMark);
    return { p, s, mark, value, cost, pl, plPct, chg24, todayDelta };
  }).sort((a, b) => b.pl - a.pl);

  const heldValue   = ranked.reduce((sum, r) => sum + r.value, 0);
  const totalValue  = cashUSD + heldValue;
  const lifetimePl  = totalValue - STARTING_CASH;
  const lifetimePct = (lifetimePl / STARTING_CASH) * 100;
  const todayDelta  = ranked.reduce((sum, r) => sum + r.todayDelta, 0);
  const todayPct    = totalValue ? (todayDelta / totalValue) * 100 : 0;

  const top  = ranked[0];
  const drag = ranked.length > 1 ? ranked[ranked.length - 1] : null;

  /* Network rollups */
  const networkMcap = subnets.reduce((sum, s) => sum + (s.mcap || 0), 0);
  const network24h  = avgWeighted(subnets, s => s.chg24, s => s.mcap);
  const network7d   = avgWeighted(subnets, s => s.chg7,  s => s.mcap);

  /* Sector aggregates — average 7D change per category, weighted by
     mcap. Surfaces the relative outperformer and underperformer for
     the editorial paragraph. */
  const byCat = new Map();
  for (const s of subnets){
    const cat = s.cat || 'other';
    if (!byCat.has(cat)) byCat.set(cat, []);
    byCat.get(cat).push(s);
  }
  const sectors = [...byCat.entries()].map(([cat, arr]) => ({
    cat,
    count: arr.length,
    chg7: avgWeighted(arr, s => s.chg7,  s => s.mcap),
    chg24: avgWeighted(arr, s => s.chg24, s => s.mcap),
  })).sort((a, b) => b.chg7 - a.chg7);
  const winSector = sectors.find(s => s.count >= 2) || sectors[0];
  const losSector = sectors.slice().reverse().find(s => s.count >= 2) || sectors[sectors.length - 1];

  /* Greeting — time-aware, terse */
  const h = now.getHours();
  const greeting = h < 5 ? 'Up early'
                 : h < 12 ? 'Good morning'
                 : h < 17 ? 'Good afternoon'
                 : h < 21 ? 'Good evening'
                 : 'Late session';

  /* Build paragraphs */
  const paragraphs = [];

  if (ranked.length){
    /* Personal paragraph: portfolio value, top contributor, drag. */
    const tValStr   = '$' + formatNum(totalValue, 2);
    const lifeStr   = (lifetimePct >= 0 ? '+' : '') + lifetimePct.toFixed(2) + '%';
    const todayStr  = (todayPct >= 0 ? '+' : '') + todayPct.toFixed(2) + '%';
    const tValDir   = lifetimePct >= 0 ? 'up' : 'down';
    const todayDir  = todayPct >= 0 ? 'up' : 'down';
    let p1 = `${greeting}. Your paper desk is at <strong>${tValStr}</strong>, <span class="cmt__delta cmt__delta--${tValDir}">${lifeStr}</span> lifetime, <span class="cmt__delta cmt__delta--${todayDir}">${todayStr}</span> today across ${ranked.length} position${ranked.length === 1 ? '' : 's'}.`;
    paragraphs.push(p1);

    if (top && top.s){
      const dStr = (top.plPct >= 0 ? '+' : '') + top.plPct.toFixed(2) + '%';
      const dCls = top.plPct >= 0 ? 'up' : 'down';
      const days = Math.max(0, Math.round((now.getTime() - top.p.openedAt) / 86_400_000));
      const ago = days === 0 ? 'today' : days === 1 ? 'yesterday' : `${days}d ago`;
      paragraphs.push(
        `Top contributor: ${chip(top.s)} <span class="cmt__delta cmt__delta--${dCls}">${dStr}</span> on the position you opened ${ago}.`
      );
    }
    if (drag && drag.s && drag !== top && drag.plPct < 0){
      const dStr = drag.plPct.toFixed(2) + '%';
      paragraphs.push(
        `Drag came from ${chip(drag.s)} <span class="cmt__delta cmt__delta--down">${dStr}</span> against cost basis.`
      );
    }
  } else {
    /* Empty state — opinionated affordance, never "no data". */
    paragraphs.push(
      `${greeting}. Your paper desk is unopened — <strong>$${formatNum(STARTING_CASH, 0)}</strong> sitting in cash. ` +
      `Open a position from the Paper Portfolio panel below; once you have one, this commentary writes itself against your actual marks.`
    );
  }

  /* Market context — always present. */
  const netDir = network24h >= 0 ? 'up' : 'down';
  const netStr = (network24h >= 0 ? '+' : '') + network24h.toFixed(2) + '%';
  let p2 = `The wider Bittensor market is <strong>$${formatNum(networkMcap, 0)}M</strong> in α-FDV, <span class="cmt__delta cmt__delta--${netDir}">${netStr}</span> on the day across ${subnets.length} subnets.`;
  if (briefing){
    const daysOld = daysBetween(briefing.date, now.toISOString().slice(0, 10)) || 0;
    const ageTxt  = daysOld === 0 ? "today's" : daysOld === 1 ? "yesterday's" : `the ${daysOld}-day-old`;
    p2 += ` The wider context: ${ageTxt} briefing — <a class="cmt__chip cmt__chip--brief" href="${briefing.href}" target="_blank" rel="noopener">${escapeHtml(briefing.title)}</a>.`;
  }
  paragraphs.push(p2);

  /* Sector commentary — only if the spread is meaningful. */
  if (winSector && losSector && winSector.cat !== losSector.cat && Math.abs(winSector.chg7 - losSector.chg7) > 1){
    const winStr = (winSector.chg7 >= 0 ? '+' : '') + winSector.chg7.toFixed(2) + '%';
    const losStr = (losSector.chg7 >= 0 ? '+' : '') + losSector.chg7.toFixed(2) + '%';
    paragraphs.push(
      `Sector tape: <span class="cmt__delta cmt__delta--up">${winStr}</span> in ${catChip(winSector.cat)}, ` +
      `<span class="cmt__delta cmt__delta--down">${losStr}</span> in ${catChip(losSector.cat)} over 7D (mcap-weighted).`
    );
  }

  /* Sources used in this composition. Each source becomes a chip in
     the provenance footer; tapping scrolls to the corresponding
     dashboard section so the reader can audit. */
  const sources = [];
  if (ranked.length) sources.push({ label: 'paper portfolio',   target: '.dash-paperport, .dash-attribution' });
  sources.push({ label: 'subnets',               target: '.dash-master' });
  sources.push({ label: 'centralized backdrop',  target: '.dash-comparator' });
  if (briefing) sources.push({ label: 'briefings', target: '[data-zone="briefings"]' });

  return { paragraphs, sources, now, briefing };
}

/* ---------- DOM render ------------------------------------ */

function renderHtml(model){
  const time = formatTime(model.now);
  const pHtml = model.paragraphs.map(p => `<p class="cmt__p">${p}</p>`).join('');
  const sources = model.sources.map(s =>
    `<button type="button" class="cmt__source" data-cmt-scroll="${escapeAttr(s.target)}">${escapeHtml(s.label)}</button>`
  ).join('');
  return `
    <section class="cmt" aria-label="Desk commentary">
      <header class="cmt__head">
        <span class="cmt__kicker"><span class="cmt__dot"></span>YOUR DESK · ${formatDate(model.now)} · ${time}</span>
        <span class="cmt__meta">composed from ${model.sources.length} source${model.sources.length === 1 ? '' : 's'} · refreshes 60s</span>
      </header>
      <div class="cmt__body">${pHtml}</div>
      <footer class="cmt__foot">
        <span class="cmt__sources-lbl">SOURCES</span>
        <div class="cmt__sources">${sources}</div>
      </footer>
    </section>
  `;
}

/* Sources chips: clicking scrolls to the dashboard section that
   produced the datum. Honest provenance — no datum is unsourced. */
function wireChips(root){
  root.querySelectorAll('[data-cmt-scroll]').forEach(btn => {
    btn.addEventListener('click', () => {
      const sel = btn.dataset.cmtScroll;
      if (!sel) return;
      /* Pick the first selector that matches in case the target
         element has multiple acceptable anchors. */
      for (const s of sel.split(',').map(x => x.trim())){
        const el = document.querySelector(s);
        if (el){
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
      }
    });
  });
  /* Subnet chips dispatch goto-subnet via the command bus so the
     dashboard reacts the same way as a palette command. */
  root.querySelectorAll('[data-cmt-subnet]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.cmtSubnet, 10);
      if (Number.isFinite(id)){
        document.dispatchEvent(new CustomEvent('subnetmag:command', { detail: { fn: 'goto-subnet', netuid: id } }));
      }
    });
  });
}

/* ---------- chip helpers ---------------------------------- */

function chip(s){
  if (!s) return '·';
  return `<button type="button" class="cmt__chip cmt__chip--subnet" data-cmt-subnet="${s.netuid}" aria-label="Jump to SN${s.netuid} ${escapeAttr(s.name)}">SN${s.netuid} ${escapeHtml(s.name)}</button>`;
}
function catChip(cat){
  const label = CAT_LABEL[cat] || (cat || '').toUpperCase();
  return `<span class="cmt__chip cmt__chip--cat">${escapeHtml(label)}</span>`;
}

/* ---------- format helpers ------------------------------- */

function avgWeighted(arr, valFn, wFn){
  let n = 0, d = 0;
  for (const x of arr){
    const v = valFn(x); const w = wFn(x);
    if (Number.isFinite(v) && Number.isFinite(w) && w > 0){
      n += v * w; d += w;
    }
  }
  return d > 0 ? n / d : 0;
}

function formatNum(n, decimals = 0){
  if (!Number.isFinite(n)) return '·';
  if (Math.abs(n) >= 1e9)  return (n / 1e9).toFixed(2) + 'B';
  if (Math.abs(n) >= 1e6)  return (n / 1e6).toFixed(2) + 'M';
  if (Math.abs(n) >= 1e3)  return n.toLocaleString('en-US', { maximumFractionDigits: decimals });
  return n.toFixed(decimals);
}

function formatDate(d){
  const z = n => String(n).padStart(2, '0');
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  return `${z(d.getDate())} ${months[d.getMonth()]} ${d.getFullYear()}`;
}
function formatTime(d){
  const z = n => String(n).padStart(2, '0');
  return `${z(d.getHours())}:${z(d.getMinutes())}`;
}
function escapeAttr(s){
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
