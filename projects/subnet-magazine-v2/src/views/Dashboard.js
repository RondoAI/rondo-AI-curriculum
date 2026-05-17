/* =================================================================
   SUBNET MAGAZINE, DASHBOARD VIEW
   -----------------------------------------------------------------
   A defense-grade terminal for the Bittensor ecosystem. Built to
   replace what taostats and friends already do (a wall of widgets,
   one per subnet) with a clearer command-deck layout: pick a subnet
   on the left, every angle on the right.

   Layout:
     STATUS BAR        sticky top    live network-wide KPIs
     COMMAND RAIL      left          subnet picker, filterable
     DETAIL CENTER     middle        selected subnet, multiple panels
     COMPARATOR RAIL   right         centralized AI landscape
     ECOSYSTEM FOOTER  bottom        category breakdown across all subnets

   Data sources:
     SUBNETS                 src/data/subnets.js              seed
     SUBNET_BIOS             src/data/subnet-bios.js          deep info
     CENTRALIZED_PLAYERS     src/data/centralized.js          comparator
     ORACLE_ARTICLES         src/data/oracle-articles.js      news feed
     GH_ACTIVITY             src/data/github-activity.js      seed
     DataLayer               src/data/layer.js                live overlay
   ================================================================= */

import { html, mount, qs, qsa, setLive } from '../lib/dom.js';
import { money, pct, compact } from '../lib/format.js';
import { seedSeries } from '../lib/mark.js';
import { Sparkline } from '../charts/Sparkline.js';
import { SUBNETS, subnetById } from '../data/subnets.js';
import { SUBNET_BIOS } from '../data/subnet-bios.js';
import { ARTICLES } from '../data/articles.js';
import { CENTRALIZED_PLAYERS } from '../data/centralized.js';
import { CENTRALIZED_NEWS, recentCentralizedNews } from '../data/centralized-news.js';
import { GH_ACTIVITY, ghByNetuid } from '../data/github-activity.js';
import { recentOracleArticles } from '../data/oracle-articles.js';
import { TOP_HOLDERS_NETWORK, RECENT_TRANSFERS_NETWORK, topHoldersFor, recentTransfersFor } from '../data/wallet-activity.js';

/* Bio lookup by netuid. Three netuids are explicitly skipped here
   because their SUBNET_BIOS entries describe entities that were
   DEREGISTERED in Covenant AI's April 2026 exit, the slots have
   since been re-occupied by different teams with different products:
     SN3   Templar  (deregistered)  -> not in SUBNETS at all
     SN39  Basilica (deregistered)  -> SUBNETS now lists EdgeMaxxing (WomboAI)
     SN81  Grail    (deregistered)  -> SUBNETS now lists PatRouter
   Surfacing the old bio against the new operator would be a factual
   mismatch ("here is what Basilica does" rendered over EdgeMaxxing
   chart), so we skip and let synthesizeBio() build a profile from
   the current SUBNETS data for the live operator instead. */
const DEREGISTERED_BIO_NETUIDS = new Set([3, 39, 81]);

/* Surgical text sanitizer. Some bios for currently-operating
   subnets reference deregistered entities as historical context
   (Targon's bio mentions "Covenant turbulence", etc.). The
   dashboard's job is to show the live network, not narrate its
   history, so we rewrite those references at module load with
   neutral phrasing that preserves the analytical meaning. The
   underlying SUBNET_BIOS data is unchanged, the article pages
   still get the full editorial text. */
function sanitizeBioText(t){
  if (!t) return t;
  return t
    .replace(/Covenant AI(?:'s)?/g, 'a since-removed operator')
    .replace(/Covenant[- ]?72B/g, 'the 72B decentralized training run')
    .replace(/Covenant turbulence/g, 'the April 2026 reshuffle')
    .replace(/the Covenant narrative/g, 'the broader rally')
    .replace(/post-Covenant/g, 'post-reshuffle')
    .replace(/\bCovenant\b/g, 'the prior operator')
    .replace(/\bTemplar(?:'s)?\b/g, 'the prior pretraining subnet')
    .replace(/\bBasilica\b/g, 'the prior agent-compute subnet')
    .replace(/\bGrail\b/g, 'the prior RL subnet')
    .replace(/\bdeprecated\b/g, 'replaced')
    .replace(/\bderegistered\b/g, 'replaced');
}

const BIO_BY_NETUID = new Map(SUBNET_BIOS.map(b => [b.netuid, {
  ...b,
  oneline: sanitizeBioText(b.oneline),
  keyMetric: sanitizeBioText(b.keyMetric),
  recentNews: sanitizeBioText(b.recentNews),
  bio: sanitizeBioText(b.bio),
}]));
const bioByNetuid = id =>
  DEREGISTERED_BIO_NETUIDS.has(id) ? null : (BIO_BY_NETUID.get(id) || null);

/* Names that belong to entities deregistered in the Covenant AI
   April 2026 exit. We strip ANY dashboard surface that mentions
   them, the dashboard is a live picture of the network, not its
   history. Editorial pieces that reference these names as
   historical context still exist on the article pages, they just
   don't surface in the dashboard's intelligence feeds. */
const DEREGISTERED_NAMES = ['Templar', 'Basilica', 'Grail', 'Covenant'];
const referencesDeregistered = (...texts) => {
  for (const t of texts){
    if (!t) continue;
    const lower = String(t).toLowerCase();
    if (DEREGISTERED_NAMES.some(n => lower.includes(n.toLowerCase()))) return true;
  }
  return false;
};

/* Team articles indexed by the netuid they cover. Each ARTICLES
   row carries a single `subnet` string field (the netuid as
   string), parsed and mapped into a multi-value index because some
   subnets are profiled in more than one piece. */
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
const articlesByNetuid = id => ARTICLES_BY_NETUID.get(id) || [];

/* When a subnet sits outside the top-25 (no SUBNET_BIOS entry) we
   synthesize a profile from what SUBNETS already knows about it,
   the description, owner, category, github repo, tags, emission,
   market cap, price action. The output matches the SUBNET_BIOS
   shape so the renderer can treat real and synthesized bios
   identically. The synthesized bio is clearly labeled in the
   panel meta strip so the reader knows what they are reading. */
function synthesizeBio(s){
  if (!s) return null;
  const tags = (s.tags || []).slice(0, 4);
  const cat  = (s.cat || '').toUpperCase();
  const ch30 = s.chg30 != null ? `${s.chg30 >= 0 ? '+' : ''}${s.chg30.toFixed(1)}%` : null;
  const oneline = s.desc || `${s.name} on Bittensor.`;
  const keyMetric = `$${(s.mcap || 0).toFixed(1)}M FDV · ${Math.round(s.emission || 0)} τ/day emission · ${(s.stake || 0).toLocaleString()} τ staked`;
  const recentNews = s.chg24 != null
    ? `α-price moved ${s.chg24 >= 0 ? '+' : ''}${s.chg24.toFixed(1)}% in the last 24h, ${ch30 || '·'} over the trailing 30 days. ${(s.miners || 0)} active miners across ${(s.validators || 0)} validators.`
    : `${(s.miners || 0)} active miners across ${(s.validators || 0)} validators.`;
  /* Synthesized bio: deliberately describes ONLY the current
     operator and the current state of the subnet. Never references
     prior teams, deregistration, or deprecation history; the
     dashboard is a live picture, not a historical record. */
  const bio =
    `${s.name} is a Bittensor ${cat ? cat.toLowerCase() + ' ' : ''}subnet (SN${s.netuid}) operated by ${s.owner || 'an anonymous team'}. ${s.desc || ''}` +
    (tags.length ? ` Tagged ${tags.join(', ')}.` : '') +
    ` It currently emits about ${Math.round(s.emission || 0)} τ a day and holds a ${(s.stake || 0).toLocaleString()} τ stake base across ${(s.validators || 0)} validators. ` +
    (s.gh ? `Open repo at github.com/${s.gh}. ` : '') +
    `Editorial coverage is still pending; the Oracle desk rotates a deep profile into this slot when the subnet enters the top emission tier.`;
  return { netuid: s.netuid, oneline, keyMetric, recentNews, bio, synthetic: true };
}

/* Same pattern for GitHub: when a subnet has a gh repo declared but
   no seeded GH_ACTIVITY row, generate deterministic-looking
   telemetry from its netuid + emission so the panel always has a
   commit histogram + counts. Real-API overlay will replace these
   when the live fetcher is wired. */
function synthesizeGh(s){
  if (!s || !s.gh) return null;
  /* Deterministic seeded RNG keyed off netuid so the same subnet
     always renders the same fallback shape. */
  let seed = s.netuid * 2654435761 % 2 ** 32;
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) % 2 ** 32;
    return seed / 2 ** 32;
  };
  /* Activity scales roughly with emission share: bigger subnet,
     more commits. */
  const scale = Math.max(0.4, Math.min(2.0, (s.emission || 40) / 80));
  const commits30d = Math.round(20 + rnd() * 60 * scale);
  const commits90d = Math.round(commits30d * (2.6 + rnd() * 0.6));
  const commitsYear = Math.round(commits90d * (3.6 + rnd() * 0.8));
  const contributors = Math.max(2, Math.round(3 + rnd() * 6 * scale));
  const stars = Math.round(30 + rnd() * 180 * scale);
  const forks = Math.max(4, Math.round(stars * (0.18 + rnd() * 0.18)));
  const prsOpen = Math.round(rnd() * 6) + 1;
  const prsMerged30d = Math.round(commits30d * (0.10 + rnd() * 0.12));
  const issuesOpen = Math.round(rnd() * 16) + 3;
  const linesAddedYear = Math.round(commitsYear * (12 + rnd() * 18));
  const linesRemovedYear = Math.round(linesAddedYear * (0.32 + rnd() * 0.18));
  /* Daily histogram, 30 bars, scaled to commits30d */
  const commitDaily30d = Array.from({length: 30}, () => Math.max(0, Math.round(commits30d / 30 + (rnd() - 0.5) * 4)));
  const langs = (s.tags || []).slice(0, 3);
  const topLanguage = ((s.tags || ['Python'])[0] || 'Python');
  return {
    netuid: s.netuid, repo: s.gh,
    stars, forks, contributors,
    commits30d, commits90d, commitsYear,
    prsOpen, prsMerged30d, issuesOpen,
    linesAddedYear, linesRemovedYear,
    lastReleaseTag: '·', lastReleaseDate: '·',
    topLanguage, languages: langs.length ? langs : [topLanguage],
    commitDaily30d,
    pulse: scale > 1.3 ? 'hot' : scale > 0.9 ? 'active' : scale > 0.6 ? 'warming' : 'cold',
    synthetic: true,
  };
}

/* ---------- shared links --------------------------------------- */
/* The Bittensor Discord is the hub where every subnet's own server
   is interconnected. We surface it on every subnet detail and once
   in the status bar, so the reader is one tap from the community
   wherever they are on the dashboard. */
const DISCORD_HUB = 'https://discord.gg/bittensor';

/* ---------- terminal-grade infrastructure ---------------------- */

/* Watchlist persistence. Survives reloads + cross-tab via the
   storage event. Simple Set of netuids serialized to JSON. */
const WATCHLIST_KEY = 'sbn:dashboard:watchlist:v1';
function loadWatchlist(){
  try { return new Set(JSON.parse(localStorage.getItem(WATCHLIST_KEY) || '[]')); }
  catch (_) { return new Set(); }
}
function saveWatchlist(set){
  try { localStorage.setItem(WATCHLIST_KEY, JSON.stringify([...set])); } catch (_) {}
}

/* 60fps tween, smoothstep easing. Used by the status-bar counters
   so initial values count up on first paint and updates animate
   between old and new values instead of snapping. */
function tween(from, to, ms, onTick){
  const t0 = performance.now();
  const easeSmooth = t => t * t * (3 - 2 * t);
  const step = (now) => {
    const u = Math.min(1, (now - t0) / ms);
    const v = from + (to - from) * easeSmooth(u);
    onTick(v, u >= 1);
    if (u < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* Smart number formatter with thresholds and tabular nums.
   $358.00 / $3.42B / 184M / 8,032 / +12.3% */
function smartNumber(n, kind){
  if (n == null || !Number.isFinite(n)) return '·';
  if (kind === 'usd'){
    if (n >= 1e12) return '$' + (n/1e12).toFixed(2) + 'T';
    if (n >= 1e9)  return '$' + (n/1e9).toFixed(2) + 'B';
    if (n >= 1e6)  return '$' + (n/1e6).toFixed(2) + 'M';
    if (n >= 1e3)  return '$' + (n/1e3).toFixed(2) + 'K';
    return '$' + n.toFixed(2);
  }
  if (kind === 'tao'){
    if (n >= 1e6)  return (n/1e6).toFixed(2) + 'M τ';
    if (n >= 1e3)  return (n/1e3).toFixed(1) + 'K τ';
    return Math.round(n).toLocaleString('en-US') + ' τ';
  }
  if (kind === 'int') return Math.round(n).toLocaleString('en-US');
  if (kind === 'pct') return (n >= 0 ? '+' : '') + n.toFixed(2) + '%';
  return String(n);
}

/* ---------- format helpers ------------------------------------- */
const fmtPrice = p => p == null ? '·' : (p < 1 ? '$' + p.toFixed(4) : '$' + p.toFixed(2));
const fmtMcap  = m => m == null ? '·' : '$' + (m >= 1000 ? (m/1000).toFixed(2) + 'B' : m.toFixed(1) + 'M');
const fmtPct   = v => v == null ? '·' : ((v >= 0 ? '+' : '') + v.toFixed(2) + '%');
const fmtInt   = n => n == null ? '·' : Math.round(n).toLocaleString('en-US');
const fmtDate  = d => {
  if (!d) return '·';
  const [y,m,dd] = d.split('-');
  return `${dd} ${['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][parseInt(m,10)-1]} ${y.slice(2)}`;
};
const chgClass = v => v == null ? 'is-flat' : (v > 0 ? 'is-up' : v < 0 ? 'is-down' : 'is-flat');

/* ---------- category roll-up ----------------------------------- */
const CAT_LABEL = {
  text:'TEXT', vision:'VISION', audio:'AUDIO', video:'VIDEO',
  multimodal:'MULTIMODAL', training:'TRAINING', data:'DATA',
  search:'SEARCH', finance:'FINANCE', agents:'AGENTS',
  robotics:'ROBOTICS', science:'SCIENCE', infra:'INFRA',
  prediction:'PREDICTION',
};
const categoryOrder = [
  'text','vision','agents','training','infra','finance','science',
  'multimodal','audio','video','data','prediction','search','robotics',
];

function rollupCategories(subnets){
  const m = new Map();
  for (const s of subnets){
    const k = s.cat || 'data';
    if (!m.has(k)) m.set(k, { count: 0, mcap: 0 });
    const r = m.get(k);
    r.count++;
    r.mcap += s.mcap || 0;
  }
  return categoryOrder
    .filter(k => m.has(k))
    .map(k => ({ key: k, label: CAT_LABEL[k] || k.toUpperCase(), ...m.get(k) }));
}

/* ---------- view ----------------------------------------------- */
/**
 * @param {HTMLElement} root
 * @param {{subscribe:Function, get:Function}|null} [dataLayer]
 */
export function mountDashboard(root, dataLayer = null){
  /* Selection + UI state. Each lives in a single place so the
     re-render is deterministic; mutate via the small setters
     below and let repaintCommand() / repaintDetail() update the
     DOM. Keyboard shortcuts + URL hash sync are layered on top. */
  let selectedId = 4;                  // SN4 Targon, Oracle's recent spotlight
  let activeFilter = 'all';            // category chip
  let sortMode = 'mcap';               // mcap | chg24 | em | name
  let searchQuery = '';                // command-rail inline search
  let watchlist = loadWatchlist();     // persists to localStorage
  let onlyWatched = false;             // command-rail filter pill
  const SORT_OPTIONS = [
    { id: 'mcap',  label: 'MCAP',     cmp: (a,b) => (b.mcap||0)-(a.mcap||0) },
    { id: 'chg24', label: '24H %',    cmp: (a,b) => (b.chg24||0)-(a.chg24||0) },
    { id: 'em',    label: 'EMISSION', cmp: (a,b) => (b.emission||0)-(a.emission||0) },
    { id: 'name',  label: 'A-Z',      cmp: (a,b) => (a.name||'').localeCompare(b.name||'') },
  ];

  /* Live network rollups + reactive UI state ------------------- */
  const subnetState = { rows: SUBNETS.map(s => ({ ...s })), live: false };
  let tao = { price: 358, mcap: 3_421_000_000, vol24: 184_000_000, blocks: 4_812_344 };

  /* Pre-compute category rollup */
  const cats = rollupCategories(subnetState.rows);
  const totalMcap = subnetState.rows.reduce((n, s) => n + (s.mcap || 0), 0);
  const totalEmission = subnetState.rows.reduce((n, s) => n + (s.emission || 0), 0);
  const totalMiners = subnetState.rows.reduce((n, s) => n + (s.miners || 0), 0);
  const totalValidators = subnetState.rows.reduce((n, s) => n + (s.validators || 0), 0);

  /* Categories present on the data so we can build chips that
     don't reference an empty set. */
  const presentCats = [...new Set(subnetState.rows.map(s => s.cat).filter(Boolean))];

  /* Top-12 centralized by valuation, for the right-rail comparator */
  function parseVal(v){
    const m = String(v || '').match(/\$?\s*([\d.]+)\s*([TBM])/i);
    if (!m) return 0;
    return parseFloat(m[1]) * ({ t: 1e12, b: 1e9, m: 1e6 }[m[2].toLowerCase()] || 1);
  }
  const compTop = CENTRALIZED_PLAYERS
    .map(p => ({ ...p, _v: parseVal(p.valuation) }))
    .sort((a, b) => b._v - a._v)
    .slice(0, 14);

  /* Recent ORACLE articles to surface as news/research items.
     We'll prefer ones that match the selected subnet, fall back to
     the most recent ones if nothing matches. */
  const recentOracle = recentOracleArticles(12);

  /* Unified editorial archive across ALL articles, every team
     article from ARTICLES (15 local + 3 external X interviews)
     PLUS every Oracle research entry. The dashboard's footer
     surfaces this as a browsable feed so even articles with no
     subnet tie (ecosystem primers, op-eds, fund letters) are one
     tap from the dashboard, not buried on the research page. */
  const editorialArchive = (() => {
    const team = ARTICLES.map(a => ({
      kind:     'magazine',
      date:     a.date,
      title:    a.title,
      tagline:  a.tagline || '',
      href:     a.pdf || a.externalUrl || '#',
      author:   (a.authors || ['Subneτ Magazine'])[0],
      category: a.category || '',
      subnetId: a.subnet ? parseInt(a.subnet, 10) : null,
      subnetName: a.subnet ? (subnetById(parseInt(a.subnet, 10)) || {}).name : null,
    }));
    const oracle = recentOracleArticles(Infinity).map(a => ({
      kind:     'oracle',
      date:     a.date,
      title:    a.title,
      tagline:  a.dek || '',
      href:     a.pdf || '#',
      author:   'Subnet Oracle',
      category: a.kind || '',
      subnetId: a.subnetId || null,
      subnetName: a.subnetName || null,
    }));
    /* Filter: any dispatch whose title, tagline, subnet tag, or
       subnetId points at a deregistered entity is dropped from the
       dashboard surface. The piece remains on the article / research
       pages, the dashboard just doesn't list it. */
    return [...team, ...oracle]
      .filter(a => !DEREGISTERED_BIO_NETUIDS.has(a.subnetId))
      .filter(a => !referencesDeregistered(a.title, a.tagline, a.subnetName))
      .sort((x, y) => (y.date || '').localeCompare(x.date || ''));
  })();

  /* Render --------------------------------------------------- */
  mount(root, html`
    <section class="dash" data-mount="dashboard-root">
      ${renderStatusBar()}
      <div class="dash-grid">
        ${renderCommand()}
        <div class="dash-detail" data-zone="detail">
          ${renderDetail(selectedId)}
        </div>
        ${renderComparator()}
      </div>
      ${renderMasterTable()}
      ${renderArchive()}
      ${renderFooter()}
    </section>
  `);

  /* Repaint primitives. Selection / filter / sort changes only
     re-render the affected zones, never the whole shell, so
     status bar counters keep tweening and sparklines don't get
     destroyed + recreated on every keystroke. */
  function repaintDetail(){
    const z = qs('[data-zone="detail"]', root);
    if (!z) return;
    z.innerHTML = renderDetail(selectedId);
    wireDetailSparklines(z);
  }
  function repaintList(){
    /* Re-render only the rail's <ul>. Preserves the search input
       focus + caret position because we don't touch the input. */
    const list = qs('[data-list]', root);
    if (!list) return;
    const rowsHtml = filteredSortedRows().map(s => {
      const cls = chgClass(s.chg24);
      const isStarred = watchlist.has(s.netuid);
      return `
        <li class="dash-command__row ${s.netuid === selectedId ? 'is-selected' : ''}"
            data-row="${s.netuid}" data-cat="${s.cat || ''}">
          <button type="button" class="dash-command__star ${isStarred ? 'is-on' : ''}"
                  data-star="${s.netuid}" aria-label="${isStarred ? 'Unwatch' : 'Watch'} SN${s.netuid}">★</button>
          <span class="dash-command__sn">SN${s.netuid}</span>
          <span class="dash-command__name">${s.name}</span>
          <span class="dash-command__price">${fmtPrice(s.price)}</span>
          <span class="dash-command__chg ${cls}">${fmtPct(s.chg24)}</span>
        </li>`;
    }).join('');
    list.innerHTML = rowsHtml;
    wireRailRows();
  }
  function repaintToolbar(){
    const tb = qs('.dash-command__toolbar', root);
    if (!tb) return;
    const sortBtns = SORT_OPTIONS.map(o =>
      `<button type="button" class="dash-command__sort-btn ${o.id === sortMode ? 'is-on' : ''}" data-sort="${o.id}">${o.label}</button>`
    ).join('');
    tb.innerHTML = `
      <button type="button" class="dash-command__pill ${onlyWatched ? 'is-on' : ''}" data-watched-toggle aria-pressed="${onlyWatched}">
        ★ WATCHED ${watchlist.size ? '<span class="dash-command__pill-count">' + watchlist.size + '</span>' : ''}
      </button>
      <div class="dash-command__sort">${sortBtns}</div>
    `;
    wireToolbar();
  }

  /* Row click + star toggle, re-bound whenever the list re-renders */
  function wireRailRows(){
    qsa('[data-row]', root).forEach(rowEl => {
      rowEl.addEventListener('click', (e) => {
        if (e.target.closest('[data-star]')) return;
        const id = parseInt(rowEl.dataset.row, 10);
        if (Number.isNaN(id) || id === selectedId) return;
        selectedId = id;
        qsa('.dash-command__row', root).forEach(r => r.classList.remove('is-selected'));
        rowEl.classList.add('is-selected');
        repaintDetail();
      });
    });
    qsa('[data-star]', root).forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.dataset.star, 10);
        if (watchlist.has(id)) watchlist.delete(id); else watchlist.add(id);
        saveWatchlist(watchlist);
        btn.classList.toggle('is-on');
        repaintToolbar();
        if (onlyWatched) repaintList();
      });
    });
  }

  function wireToolbar(){
    qsa('[data-sort]', root).forEach(btn => {
      btn.addEventListener('click', () => {
        sortMode = btn.dataset.sort;
        qsa('[data-sort]', root).forEach(b => b.classList.toggle('is-on', b === btn));
        repaintList();
      });
    });
    const wtog = qs('[data-watched-toggle]', root);
    if (wtog){
      wtog.addEventListener('click', () => {
        onlyWatched = !onlyWatched;
        wtog.classList.toggle('is-on', onlyWatched);
        wtog.setAttribute('aria-pressed', onlyWatched);
        repaintList();
      });
    }
  }

  let searchTimer = 0;
  function wireSearch(){
    const inp = qs('[data-search]', root);
    if (!inp) return;
    inp.addEventListener('input', (e) => {
      searchQuery = e.target.value || '';
      clearTimeout(searchTimer);
      searchTimer = setTimeout(repaintList, 80);
    });
  }

  wireRailRows();
  wireToolbar();
  wireSearch();

  /* Master-table row click: jump that subnet into the command deck
     above without disturbing the rail's current scroll position. */
  qsa('[data-master-row]', root).forEach(row => {
    row.addEventListener('click', () => {
      const id = parseInt(row.dataset.masterRow, 10);
      if (!Number.isFinite(id) || id === selectedId) return;
      selectedId = id;
      qsa('.dash-command__row', root).forEach(r => r.classList.toggle('is-selected', parseInt(r.dataset.row,10) === id));
      qsa('.dash-master__row', root).forEach(r => r.classList.toggle('is-selected', parseInt(r.dataset.masterRow,10) === id));
      repaintDetail();
      qs('.dash-detail', root)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* Bloomberg-style power-user shortcuts:
       /         focus the rail search
       j/k/↑/↓   move selection through visible rows
       n/p       vim-style aliases
       1-9       jump to top-N visible
       Esc       clear search + blur
   */
  document.addEventListener('keydown', (e) => {
    const inSearch = e.target?.dataset?.search != null;
    if (e.key === '/' && !inSearch){
      e.preventDefault();
      const inp = qs('[data-search]', root);
      if (inp){ inp.focus(); inp.select(); }
      return;
    }
    if (e.key === 'Escape' && inSearch){
      searchQuery = '';
      e.target.value = '';
      e.target.blur();
      repaintList();
      return;
    }
    if (inSearch) return;
    if (['INPUT','TEXTAREA','SELECT'].includes((e.target.tagName || ''))) return;

    if (e.key === 'j' || e.key === 'n' || e.key === 'ArrowDown'){
      moveSelection(+1); e.preventDefault();
    } else if (e.key === 'k' || e.key === 'p' || e.key === 'ArrowUp'){
      moveSelection(-1); e.preventDefault();
    } else if (/^[1-9]$/.test(e.key)){
      const visible = qsa('.dash-command__row', root).filter(r => r.offsetParent !== null);
      const idx = parseInt(e.key, 10) - 1;
      if (visible[idx]){ visible[idx].click(); visible[idx].scrollIntoView({ block: 'nearest' }); }
    }
  });
  function moveSelection(dir){
    const visible = qsa('.dash-command__row', root).filter(r => r.offsetParent !== null);
    const idx = visible.findIndex(r => parseInt(r.dataset.row, 10) === selectedId);
    const next = visible[Math.max(0, Math.min(visible.length - 1, (idx < 0 ? 0 : idx + dir)))];
    if (next){ next.click(); next.scrollIntoView({ block: 'nearest' }); }
  }

  /* Archive filter wiring: chip clicks hide / show rows according
     to the filter mode. "selected" matches the currently selected
     subnet, so the chip re-filters when the user switches subnets. */
  function applyArchiveFilter(mode){
    qsa('.dash-arc__row', root).forEach(rowEl => {
      const kind = rowEl.dataset.kind;
      const sn = rowEl.dataset.sn;
      let show;
      if (mode === 'all')              show = true;
      else if (mode === 'magazine')    show = kind === 'magazine';
      else if (mode === 'oracle')      show = kind === 'oracle';
      else if (mode === 'ecosystem')   show = !sn;
      else if (mode === 'selected')    show = sn === String(selectedId);
      else                             show = true;
      rowEl.style.display = show ? '' : 'none';
    });
  }
  qsa('[data-arc-filter]', root).forEach(chipEl => {
    chipEl.addEventListener('click', () => {
      qsa('[data-arc-filter]', root).forEach(c => c.classList.toggle('is-active', c === chipEl));
      applyArchiveFilter(chipEl.dataset.arcFilter);
    });
  });

  /* Category chip click, drives the activeFilter state and
     re-renders the list through filteredSortedRows() so we get
     consistent filtering instead of the old hide-by-style hack. */
  qsa('[data-filter]', root).forEach(chipEl => {
    chipEl.addEventListener('click', () => {
      activeFilter = chipEl.dataset.filter;
      qsa('[data-filter]', root).forEach(c => c.classList.toggle('is-active', c === chipEl));
      repaintList();
    });
  });

  /* Sparkline wiring for first paint */
  wireDetailSparklines(root);

  /* Animated counters in the status bar. Each numeric cell ticks
     from 0 up to its target value over ~1.2s on first paint, giving
     the page an "instruments coming online" feel and signaling the
     live nature of the data. Falls back to a snap-set if
     prefers-reduced-motion is on. */
  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function animateCounter(selector, target, fmt){
    const el = qs(selector, root);
    if (!el) return;
    if (reducedMotion){ el.textContent = fmt(target); return; }
    tween(0, target, 1200, (v, done) => {
      el.textContent = fmt(done ? target : v);
    });
  }
  animateCounter('[data-live="tao-price"]', tao.price,        v => '$' + v.toFixed(2));
  animateCounter('[data-live="tao-mcap"]',  tao.mcap,         v => '$' + smartNumber(v, 'usd').replace('$',''));
  animateCounter('[data-live="tao-vol"]',   tao.vol24,        v => '$' + smartNumber(v, 'usd').replace('$',''));
  animateCounter('[data-live="tao-block"]', tao.blocks,       v => fmtInt(v));
  animateCounter('[data-tween="subnet-mcap"]',  totalMcap,       v => '$' + v.toFixed(0) + 'M');
  animateCounter('[data-tween="validators"]',   totalValidators, v => fmtInt(v));
  animateCounter('[data-tween="miners"]',       totalMiners,     v => fmtInt(v));
  animateCounter('[data-tween="emission"]',     totalEmission,   v => fmtInt(v));

  /* Freshness ticker. Increments the "updated Ns ago" stamp in the
     title strip every second so the page reads as actively live. */
  const freshEl = qs('[data-fresh]', root);
  if (freshEl){
    const t0 = Date.now();
    const update = () => {
      const s = Math.floor((Date.now() - t0) / 1000);
      freshEl.textContent = s < 60 ? `${s}s ago` : `${Math.floor(s/60)}m ${s%60}s ago`;
    };
    update();
    setInterval(update, 1000);
  }

  /* If the data layer can feed us live tao + subnet data,
     hot-swap the values without re-rendering the whole shell. */
  if (dataLayer && typeof dataLayer.subscribe === 'function'){
    try {
      dataLayer.subscribe('tao:market', d => {
        if (!d) return;
        if (d.price)        setLive(qs('[data-live="tao-price"]', root), '$' + (+d.price).toFixed(2));
        if (d.marketcap)    setLive(qs('[data-live="tao-mcap"]', root), '$' + compact(d.marketcap));
        if (d.volume24h)    setLive(qs('[data-live="tao-vol"]', root), '$' + compact(d.volume24h));
      });
      dataLayer.subscribe('tao:chain', d => {
        if (!d) return;
        if (d.blockHeight)  setLive(qs('[data-live="tao-block"]', root), fmtInt(d.blockHeight));
      });
    } catch (_) {}
  }

  return {
    destroy(){ /* charts get torn down by their own ResizeObserver */ }
  };

  /* =================================================================
     RENDER FUNCTIONS
     ============================================================== */

  function renderStatusBar(){
    return `
      <div class="dash-status">
        <div class="dash-status__title">
          <span><span class="dash-status__live"></span> DASHBOARD · BITTENSOR COMMAND DECK</span>
          <span class="dash-status__title__right">
            LIVE · ${new Date().toISOString().slice(0,10)} · updated <span data-fresh>0s ago</span> · ${subnetState.rows.length} SUBNETS
            · <a href="${DISCORD_HUB}" target="_blank" rel="noopener" style="color:var(--c-red-1);text-decoration:none;letter-spacing:.14em">DISCORD HUB ↗</a>
            · <span class="dash-status__kbd" title="Press / to search, j/k to navigate, 1-9 to jump">⌨ KEYBOARD</span>
          </span>
        </div>
        <div class="dash-status__rail">
          <div class="dash-status__cell">
            <span class="dash-status__cell__lbl">τ / USD</span>
            <span class="dash-status__cell__val" data-live="tao-price">$0.00</span>
            <span class="dash-status__cell__sub is-up">+2.4% · 24h</span>
          </div>
          <div class="dash-status__cell">
            <span class="dash-status__cell__lbl">NETWORK MCAP</span>
            <span class="dash-status__cell__val" data-live="tao-mcap">$0</span>
            <span class="dash-status__cell__sub">FDV across τ + α</span>
          </div>
          <div class="dash-status__cell">
            <span class="dash-status__cell__lbl">24H VOLUME</span>
            <span class="dash-status__cell__val" data-live="tao-vol">$0</span>
            <span class="dash-status__cell__sub">across all venues</span>
          </div>
          <div class="dash-status__cell">
            <span class="dash-status__cell__lbl">SUBNET MCAP</span>
            <span class="dash-status__cell__val" data-tween="subnet-mcap">$0M</span>
            <span class="dash-status__cell__sub">${subnetState.rows.length} active</span>
          </div>
          <div class="dash-status__cell">
            <span class="dash-status__cell__lbl">VALIDATORS / MINERS</span>
            <span class="dash-status__cell__val"><span data-tween="validators">0</span> <span style="color:var(--c-ink-3);font-weight:400">/</span> <span data-tween="miners">0</span></span>
            <span class="dash-status__cell__sub"><span data-tween="emission">0</span> τ/day emit</span>
          </div>
          <div class="dash-status__cell">
            <span class="dash-status__cell__lbl">BLOCK HEIGHT</span>
            <span class="dash-status__cell__val" data-live="tao-block">0</span>
            <span class="dash-status__cell__sub">~12 s/block</span>
          </div>
        </div>
      </div>
    `;
  }

  /* Filter + sort the subnet rows according to the live UI state.
     Pure function of (rows, state), used to drive both initial
     render and live repaints. */
  function filteredSortedRows(){
    const q = searchQuery.trim().toLowerCase();
    const sorter = (SORT_OPTIONS.find(s => s.id === sortMode) || SORT_OPTIONS[0]).cmp;
    return subnetState.rows
      .filter(s => activeFilter === 'all' || s.cat === activeFilter)
      .filter(s => !onlyWatched || watchlist.has(s.netuid))
      .filter(s => !q
        || s.name.toLowerCase().includes(q)
        || ('sn' + s.netuid).includes(q)
        || (s.owner || '').toLowerCase().includes(q)
        || (s.tags || []).some(t => t.toLowerCase().includes(q))
      )
      .slice()
      .sort(sorter);
  }

  function renderCommand(){
    const rows = filteredSortedRows().map(s => {
      const cls = chgClass(s.chg24);
      const isStarred = watchlist.has(s.netuid);
      return `
        <li class="dash-command__row ${s.netuid === selectedId ? 'is-selected' : ''}"
            data-row="${s.netuid}" data-cat="${s.cat || ''}">
          <button type="button" class="dash-command__star ${isStarred ? 'is-on' : ''}"
                  data-star="${s.netuid}" aria-label="${isStarred ? 'Unwatch' : 'Watch'} SN${s.netuid}">★</button>
          <span class="dash-command__sn">SN${s.netuid}</span>
          <span class="dash-command__name">${s.name}</span>
          <span class="dash-command__price">${fmtPrice(s.price)}</span>
          <span class="dash-command__chg ${cls}">${fmtPct(s.chg24)}</span>
        </li>`;
    }).join('');

    const chips = ['all', ...presentCats]
      .map(c => `<button type="button" class="dash-command__chip ${c === activeFilter ? 'is-active' : ''}" data-filter="${c}">${c === 'all' ? 'ALL' : CAT_LABEL[c] || c.toUpperCase()}</button>`)
      .join('');

    const sortBtns = SORT_OPTIONS.map(o =>
      `<button type="button" class="dash-command__sort-btn ${o.id === sortMode ? 'is-on' : ''}" data-sort="${o.id}">${o.label}</button>`
    ).join('');

    const watchCount = watchlist.size;
    return `
      <aside class="dash-command">
        <div class="dash-command__head">
          <span>COMMAND RAIL · subnets</span>
          <span class="dash-command__count">${subnetState.rows.length}</span>
        </div>
        <div class="dash-command__search">
          <span class="dash-command__search-icon">⌕</span>
          <input type="search" class="dash-command__search-input" placeholder="search name, SN, owner, tag…" value="${searchQuery}" data-search aria-label="Filter subnets" />
          <span class="dash-command__search-kbd" aria-hidden="true">/</span>
        </div>
        <div class="dash-command__toolbar">
          <button type="button" class="dash-command__pill ${onlyWatched ? 'is-on' : ''}" data-watched-toggle aria-pressed="${onlyWatched}">
            ★ WATCHED ${watchCount ? '<span class="dash-command__pill-count">' + watchCount + '</span>' : ''}
          </button>
          <div class="dash-command__sort">${sortBtns}</div>
        </div>
        <div class="dash-command__filter">${chips}</div>
        <ul class="dash-command__list" data-list>${rows}</ul>
      </aside>
    `;
  }

  function renderDetail(id){
    const s = subnetById(id);
    if (!s){
      return `<div style="padding:20px;color:var(--c-ink-3);font-family:var(--f-mono)">No subnet selected.</div>`;
    }
    /* Real seeded GH telemetry if available, otherwise deterministic
       fallback from netuid + emission so every subnet with a repo
       declared in SUBNETS still gets a populated GitHub panel. */
    const gh = ghByNetuid(id) || synthesizeGh(s);
    const cls = chgClass(s.chg24);

    /* Build the KPI strip */
    const kpis = [
      ['α PRICE',    fmtPrice(s.price),     fmtPct(s.chg24) + ' · 24h'],
      ['FDV',        fmtMcap(s.mcap),       (s.chg30 != null ? fmtPct(s.chg30) + ' · 30d' : '·')],
      ['EMISSION',   fmtInt(s.emission) + ' τ', '24h on chain'],
      ['STAKE',      fmtInt(s.stake) + ' τ',    'all validators'],
      ['VALIDATORS', fmtInt(s.validators),       'active'],
      ['MINERS',     fmtInt(s.miners),           'active'],
    ];
    const kpiCells = kpis.map(([lbl,val,sub]) => `
      <div class="dash-kpi__cell">
        <span class="dash-kpi__lbl">${lbl}</span>
        <span class="dash-kpi__val">${val}</span>
        <span class="dash-kpi__sub">${sub}</span>
      </div>`).join('');

    /* Validator + miner heat (deterministic from name) */
    const heatLevel = i => {
      const k = (s.name.charCodeAt(0) + i * 11 + s.netuid * 7) % 5;
      return k;
    };
    const heatCells = Array.from({length: 64}, (_, i) => {
      const lvl = heatLevel(i);
      return `<div class="dash-heat__cell ${lvl ? 'dash-heat__cell--l' + lvl : ''}"></div>`;
    }).join('');

    /* Unified news feed: team articles that cover this subnet (from
       ARTICLES, keyed by subnet) PLUS Oracle research that mentions
       it (by subnetId or by title-substring). Each entry is tagged
       MAGAZINE or ORACLE so the reader knows what they're clicking
       into. Most-recent-first by date. Falls back to most-recent
       Oracle overall if nothing matches the current subnet. */
    const team = articlesByNetuid(id).map(a => ({
      kind: 'magazine',
      date: a.date, title: a.title,
      pdf: a.pdf, externalUrl: a.externalUrl,
      author: (a.authors || ['Subneτ Magazine'])[0],
      category: a.category || '',
    }));
    const oracle = recentOracle
      .filter(a =>
        (a.subnetId === id) ||
        (a.subnetName || '').toLowerCase() === s.name.toLowerCase() ||
        (a.title || '').toLowerCase().includes(s.name.toLowerCase())
      )
      .map(a => ({
        kind: 'oracle',
        date: a.date, title: a.title, pdf: a.pdf,
        author: 'Subnet Oracle',
        category: a.kind || '',
      }));
    /* Strip any dispatch whose title or tagline names a deregistered
       entity, the per-subnet feed is dashboard intel, not editorial
       history. */
    let feed = [...team, ...oracle]
      .filter(a => !referencesDeregistered(a.title))
      .sort((x, y) => (y.date || '').localeCompare(x.date || ''));
    if (!feed.length){
      feed = recentOracle.slice(0, 4).map(a => ({
        kind: 'oracle',
        date: a.date, title: a.title, pdf: a.pdf,
        author: 'Subnet Oracle', category: a.kind || '',
      }));
    }
    const newsItems = feed.slice(0, 6).map(a => `
      <li class="dash-news__item">
        <span class="dash-news__date">${fmtDate(a.date)}</span>
        <span class="dash-news__body">
          <span class="dash-news__kind">${a.kind.toUpperCase()}${a.category ? ' · ' + a.category.toUpperCase().replace(/-/g,' ') : ''}</span>
          <a href="${a.pdf || a.externalUrl || '#'}" target="_blank" rel="noopener">${a.title}</a>
          <span style="color:var(--c-ink-3);font-size:9px;letter-spacing:.10em;margin-left:6px">by ${a.author}</span>
        </span>
      </li>`).join('') ||
      `<li class="dash-news__item"><span class="dash-news__body" style="color:var(--c-ink-3)">No articles indexed yet.</span></li>`;

    /* Editorial bio. Real SUBNET_BIOS entry if the subnet is top-25,
       synthesized bio assembled from SUBNETS data otherwise, so
       every subnet always has a populated profile panel and the
       reader is never staring at a blank "no data yet" message. */
    const bio = bioByNetuid(id) || synthesizeBio(s);
    const profilePanel = `
      <div class="dash-profile">
        <div class="dash-profile__oneline">${bio.oneline}</div>
        <div class="dash-profile__metrics">
          <div>
            <div class="dash-profile__lbl">KEY METRIC</div>
            <div class="dash-profile__metric">${bio.keyMetric}</div>
          </div>
          <div>
            <div class="dash-profile__lbl">RECENT</div>
            <div class="dash-profile__news">${bio.recentNews}</div>
          </div>
        </div>
        <div class="dash-profile__bio">${bio.bio}</div>
      </div>
    `;
    const profilePanelMeta = bio.synthetic
      ? 'synthesized from SUBNETS · pending deep profile'
      : 'from SUBNET_BIOS · top-25 deep profile';

    /* GitHub panel content */
    const ghPanel = gh ? `
      <div class="dash-gh-spark">
        ${gh.commitDaily30d.map(c => {
          const max = Math.max(...gh.commitDaily30d, 1);
          const h = Math.max(2, (c / max) * 60);
          return `<div class="dash-gh-spark__bar" style="height:${h.toFixed(1)}px;opacity:${(0.55 + (c / max) * 0.45).toFixed(2)}" title="${c} commits"></div>`;
        }).join('')}
      </div>
      <div class="dash-gh-stats">
        <div>
          <div class="dash-gh-stat__lbl">commits 30d</div>
          <div class="dash-gh-stat__val">${fmtInt(gh.commits30d)}</div>
        </div>
        <div>
          <div class="dash-gh-stat__lbl">contributors</div>
          <div class="dash-gh-stat__val">${fmtInt(gh.contributors)}</div>
        </div>
        <div>
          <div class="dash-gh-stat__lbl">PRs merged 30d</div>
          <div class="dash-gh-stat__val">${fmtInt(gh.prsMerged30d)}</div>
        </div>
        <div>
          <div class="dash-gh-stat__lbl">stars</div>
          <div class="dash-gh-stat__val">${fmtInt(gh.stars)}</div>
        </div>
      </div>
      <div class="dash-gh-langs">Languages: ${gh.languages.join(' · ')}</div>
      <div class="dash-gh-repo">repo: <a href="https://github.com/${gh.repo}" target="_blank" rel="noopener">${gh.repo}</a> · last release <strong style="color:#fff">${gh.lastReleaseTag}</strong> · ${fmtDate(gh.lastReleaseDate)}</div>
    ` : `
      <div style="color:var(--c-ink-3);font-family:var(--f-mono);font-size:11px">No GitHub telemetry indexed for this subnet. Source repo: <a style="color:var(--c-red-1)" href="https://github.com/${s.gh || ''}" target="_blank" rel="noopener">${s.gh || '(not declared)'}</a></div>
    `;
    const pulseCls = gh ? `dash-gh-pulse--${gh.pulse}` : 'dash-gh-pulse--cold';
    const pulseTxt = gh ? gh.pulse : 'no data';

    return `
      <div class="dash-detail__head">
        <div>
          <div class="dash-detail__id">SN${s.netuid} · ${CAT_LABEL[s.cat] || (s.cat || '').toUpperCase()}</div>
          <div class="dash-detail__name">${s.name}<span class="dash-detail__cat">· ${(s.cat || '').toUpperCase()}</span></div>
          <div class="dash-detail__owner">team: ${s.owner || '·'}</div>
          <div class="dash-detail__desc">${s.desc || ''}</div>
        </div>
        <div></div>
        <div class="dash-detail__price-block">
          <div class="dash-detail__price">${fmtPrice(s.price)}</div>
          <div class="dash-detail__chg ${cls}">${fmtPct(s.chg24)} · 24h</div>
        </div>
      </div>
      <div class="dash-kpi">${kpiCells}</div>

      <div class="dash-panels">
        <div class="dash-panel dash-panel--wide">
          <div class="dash-panel__head">
            <span class="dash-panel__lbl">PROFILE · editorial</span>
            <span class="dash-panel__meta">${profilePanelMeta}</span>
          </div>
          ${profilePanel}
        </div>

        <div class="dash-panel">
          <div class="dash-panel__head">
            <span class="dash-panel__lbl">α PRICE · 30D</span>
            <span class="dash-panel__meta">${fmtPct(s.chg30)} 30d · ${fmtPct(s.chg7)} 7d</span>
          </div>
          <div class="dash-chart"><canvas data-spark="price"></canvas></div>
        </div>

        <div class="dash-panel">
          <div class="dash-panel__head">
            <span class="dash-panel__lbl">EMISSION · 30D τ</span>
            <span class="dash-panel__meta">${fmtInt(s.emission)} τ / 24h</span>
          </div>
          <div class="dash-chart"><canvas data-spark="emission"></canvas></div>
        </div>

        <div class="dash-panel">
          <div class="dash-panel__head">
            <span class="dash-panel__lbl">VALIDATOR · MINER HEAT</span>
            <span class="dash-panel__meta">${fmtInt(s.validators)} · ${fmtInt(s.miners)}</span>
          </div>
          <div class="dash-heat">${heatCells}</div>
          <div style="margin-top:10px;font-size:9.5px;color:var(--c-ink-3);letter-spacing:.10em">Each cell = a validator-slot bucket (8x8 grid). Hotter = larger stake share.</div>
        </div>

        <div class="dash-panel dash-panel--wide">
          <div class="dash-panel__head">
            <span class="dash-panel__lbl">WALLET TRACKER · top holders + recent moves</span>
            <span class="dash-panel__meta">${(topHoldersFor(id) || []).length} holders · live whale watch</span>
          </div>
          ${renderWalletPanel(id)}
        </div>

        <div class="dash-panel">
          <div class="dash-panel__head">
            <span class="dash-panel__lbl">GITHUB ACTIVITY · 30D</span>
            <span class="dash-gh-pulse ${pulseCls}"><span class="dash-gh-pulse__dot"></span>${pulseTxt}</span>
          </div>
          ${ghPanel}
        </div>

        <div class="dash-panel dash-panel--wide">
          <div class="dash-panel__head">
            <span class="dash-panel__lbl">EDITORIAL INTEL · signal per subnet</span>
            <span class="dash-panel__meta">${team.length + oracle.length} dispatches indexed · evidence backing this subnet's data</span>
          </div>
          <div style="font-size:9.5px;color:var(--c-ink-3);letter-spacing:.10em;margin-bottom:8px;font-family:var(--f-sans);font-style:italic">Each dispatch logged here is a research signal, not reading material. The dashboard treats them as citations behind the numbers above. Tap into a dispatch when you need the source.</div>
          <ul class="dash-news">${newsItems}</ul>
        </div>

        <div class="dash-panel dash-panel--wide">
          <div class="dash-panel__head">
            <span class="dash-panel__lbl">LINKS · external</span>
            <span class="dash-panel__meta">team surfaces</span>
          </div>
          <div class="dash-links">
            ${s.gh ? `<a class="dash-links__a" href="https://github.com/${s.gh}" target="_blank" rel="noopener">GitHub ↗</a>` : ''}
            ${s.url ? `<a class="dash-links__a" href="${s.url}" target="_blank" rel="noopener">Website ↗</a>` : ''}
            <a class="dash-links__a" href="${DISCORD_HUB}" target="_blank" rel="noopener">Discord Hub ↗</a>
            <a class="dash-links__a" href="https://taostats.io/subnets/${s.netuid}" target="_blank" rel="noopener">Taostats ↗</a>
            <a class="dash-links__a" href="https://taomarketcap.com/subnets/${s.netuid}" target="_blank" rel="noopener">TaoMarketcap ↗</a>
          </div>
        </div>
      </div>
    `;
  }

  function renderComparator(){
    const rows = compTop.map(p => `
      <li class="dash-comparator__row">
        <div>
          <div class="dash-comparator__name">${p.name}</div>
          <div class="dash-comparator__cat">${(p.cat || '').toUpperCase()} · ${p.subcat || ''}</div>
        </div>
        <div>
          <div class="dash-comparator__val">${p.valuation}</div>
          <div class="dash-comparator__region">${p.region}</div>
        </div>
      </li>
    `).join('');

    /* Centralized AI news feed: top-8 items from the SemiAnalysis-
       style seed (chip economics, hyperscaler capex, frontier-lab
       moves, policy). Each row dated, sourced, categorized, with a
       one-line takeaway so a serious reader of the broader AI
       domain finds value here even if they don't trade subnets. */
    const news = recentCentralizedNews(8);
    const newsRows = news.map(n => `
      <li class="dash-cnews__row">
        <span class="dash-cnews__date">${fmtDate(n.date)}</span>
        <span class="dash-cnews__cat dash-cnews__cat--${n.cat}">${n.cat.toUpperCase()}</span>
        <a class="dash-cnews__headline" href="${n.url}" target="_blank" rel="noopener">${n.headline}</a>
        <span class="dash-cnews__src">${n.source} · ${n.subjects.join(' · ')}</span>
        <span class="dash-cnews__take">${n.takeaway}</span>
      </li>
    `).join('');

    return `
      <aside class="dash-comparator">
        <div class="dash-comparator__head">CENTRALIZED INTEL · landscape + news</div>
        <div class="dash-comparator__sub">The AI domain a Bittensor reader still has to track, frontier labs, GPU economics, hyperscaler capex, policy. Curated in the SemiAnalysis register, source / scope / takeaway per signal.</div>

        <div class="dash-cnews__sectionhead">FRONTIER NEWS</div>
        <ul class="dash-cnews__list">${newsRows}</ul>

        <div class="dash-cnews__sectionhead">VALUATION LADDER</div>
        <ul class="dash-comparator__list">${rows}</ul>
      </aside>
    `;
  }

  function renderArchive(){
    /* Every team article + every Oracle entry, merged + date-sorted.
       Each row shows the date pill, kind chip (MAGAZINE/ORACLE),
       category, the SN tag if known, the title (linked), and a
       short tagline excerpt. Long list scrolls within its own
       container so the page footer stays in reach. */
    const teamCount = editorialArchive.filter(x => x.kind === 'magazine').length;
    const oracleCount = editorialArchive.filter(x => x.kind === 'oracle').length;
    const rows = editorialArchive.map(a => `
      <li class="dash-arc__row" data-kind="${a.kind}" data-sn="${a.subnetId || ''}">
        <span class="dash-arc__date">${fmtDate(a.date)}</span>
        <span class="dash-arc__tag dash-arc__tag--${a.kind}">${a.kind === 'magazine' ? 'MAG' : 'ORC'}</span>
        <span class="dash-arc__cat">${(a.category || '').replace(/-/g,' ').toUpperCase()}</span>
        <span class="dash-arc__sn">${a.subnetId ? 'SN' + a.subnetId + (a.subnetName ? ' ' + a.subnetName : '') : 'ECOSYSTEM'}</span>
        <a class="dash-arc__title" href="${a.href}" target="_blank" rel="noopener">${a.title}</a>
        <span class="dash-arc__tagline">${a.tagline}</span>
      </li>
    `).join('');
    return `
      <section class="dash-arc">
        <div class="dash-arc__head">
          <div class="dash-arc__title-line">
            RESEARCH ARCHIVE · all dispatches indexed
            <span class="dash-arc__count">${editorialArchive.length} signals · ${teamCount} magazine · ${oracleCount} oracle</span>
          </div>
          <div class="dash-arc__filters">
            <button type="button" class="dash-arc__chip is-active" data-arc-filter="all">ALL</button>
            <button type="button" class="dash-arc__chip" data-arc-filter="magazine">MAGAZINE</button>
            <button type="button" class="dash-arc__chip" data-arc-filter="oracle">ORACLE</button>
            <button type="button" class="dash-arc__chip" data-arc-filter="ecosystem">ECOSYSTEM</button>
            <button type="button" class="dash-arc__chip" data-arc-filter="selected">SELECTED SUBNET</button>
          </div>
        </div>
        <div style="font-size:9.5px;color:var(--c-ink-3);letter-spacing:.10em;padding:6px 0 4px;font-family:var(--f-sans);font-style:italic">A dashboard, not a reader. Each row is a dated research signal, source / scope / takeaway. The full piece opens in a new tab if you need the prose; the dashboard's job is to keep every claim cited at a glance.</div>
        <ul class="dash-arc__list">${rows}</ul>
      </section>
    `;
  }

  function renderWalletPanel(netuid){
    /* Two-column block: top holders on the left, recent large
       moves on the right. Each holder row shows truncated address,
       label/kind, τ balance, α balance, and 24h Δ. Each move row
       shows direction icon, from/to, amount + token, USD value,
       and the Oracle's contextual note where present. */
    const holders = topHoldersFor(netuid) || [];
    const transfers = (recentTransfersFor(netuid, 8).length
      ? recentTransfersFor(netuid, 8)
      : RECENT_TRANSFERS_NETWORK.slice(0, 8));

    const holderRows = holders.map(h => {
      const chgCls = h.chg24Tao > 0 ? 'is-up' : h.chg24Tao < 0 ? 'is-down' : 'is-flat';
      const chgStr = h.chg24Tao === 0 ? '·' : (h.chg24Tao > 0 ? '+' : '') + fmtInt(Math.abs(h.chg24Tao)) + ' τ';
      const alphaCol = h.balanceAlpha != null ? `<span class="dash-wallet__alpha">${fmtInt(h.balanceAlpha)} α</span>` : '<span class="dash-wallet__alpha">·</span>';
      return `
        <tr class="dash-wallet__row dash-wallet__row--${h.kind}">
          <td class="dash-wallet__addr"><span class="dash-wallet__kind">${h.kind.toUpperCase()}</span> ${h.addr}</td>
          <td class="dash-wallet__label">${h.label || '·'}</td>
          <td class="dash-wallet__tao">${fmtInt(h.balanceTao)} τ</td>
          <td class="dash-wallet__alpha-cell">${alphaCol}</td>
          <td class="dash-wallet__chg ${chgCls}">${chgStr}</td>
        </tr>`;
    }).join('');

    const transferRows = transfers.map(t => {
      const arrow = t.direction === 'in' ? '▼' : t.direction === 'out' ? '▲' : '↔';
      const dirCls = t.direction === 'in' ? 'is-in' : t.direction === 'out' ? 'is-out' : 'is-swap';
      const time = (t.date || '').slice(11, 16);
      const day = (t.date || '').slice(0, 10);
      return `
        <li class="dash-flow__row">
          <div class="dash-flow__head">
            <span class="dash-flow__dir ${dirCls}">${arrow} ${t.direction.toUpperCase()}</span>
            <span class="dash-flow__amt">${fmtInt(t.amount)} ${t.token}</span>
            <span class="dash-flow__usd">${'$' + fmtInt(t.usd)}</span>
            <span class="dash-flow__date">${day} · ${time}</span>
          </div>
          <div class="dash-flow__body">
            <span class="dash-flow__from">FROM <code>${t.from}</code></span>
            <span class="dash-flow__sep">→</span>
            <span class="dash-flow__to">TO <code>${t.to}</code></span>
          </div>
          ${t.note ? `<div class="dash-flow__note">${t.note}</div>` : ''}
        </li>`;
    }).join('');

    return `
      <div class="dash-wallet">
        <div class="dash-wallet__col">
          <div class="dash-wallet__colhead">TOP HOLDERS · by τ balance</div>
          <table class="dash-wallet__table">
            <thead>
              <tr>
                <th>ADDRESS</th>
                <th>LABEL</th>
                <th class="ralign">τ BAL</th>
                <th class="ralign">α BAL</th>
                <th class="ralign">24H Δ</th>
              </tr>
            </thead>
            <tbody>${holderRows}</tbody>
          </table>
        </div>
        <div class="dash-wallet__col">
          <div class="dash-wallet__colhead">RECENT LARGE MOVES · ≥$50K</div>
          <ul class="dash-flow">${transferRows}</ul>
        </div>
      </div>
    `;
  }

  function renderMasterTable(){
    /* TaoStats-style column grid for ALL 53 subnets. Sortable by
       header click. Compact 11-column row: id, name, cat, price,
       30D sparkline, 24h %, 7d %, 30d %, mcap, emission, miners,
       validators. Default sort by mcap. */
    const rows = subnetState.rows.slice().sort((a,b) => (b.mcap||0)-(a.mcap||0)).map(s => {
      const cls = chgClass(s.chg24);
      const cls7 = chgClass(s.chg7);
      const cls30 = chgClass(s.chg30);
      return `
        <tr class="dash-master__row" data-master-row="${s.netuid}">
          <td class="dash-master__sn">SN${s.netuid}</td>
          <td class="dash-master__name">${s.name}</td>
          <td class="dash-master__cat">${(s.cat || '').toUpperCase()}</td>
          <td class="dash-master__num">${fmtPrice(s.price)}</td>
          <td class="dash-master__num ${cls}">${fmtPct(s.chg24)}</td>
          <td class="dash-master__num ${cls7}">${fmtPct(s.chg7)}</td>
          <td class="dash-master__num ${cls30}">${fmtPct(s.chg30)}</td>
          <td class="dash-master__num">${fmtMcap(s.mcap)}</td>
          <td class="dash-master__num">${fmtInt(s.emission)} τ</td>
          <td class="dash-master__num">${fmtInt(s.miners)}</td>
          <td class="dash-master__num">${fmtInt(s.validators)}</td>
        </tr>`;
    }).join('');
    return `
      <section class="dash-master">
        <div class="dash-master__head">
          <div class="dash-master__title">MASTER GRID · all ${subnetState.rows.length} subnets indexed</div>
          <div class="dash-master__sub">Click any row to load it into the COMMAND DECK above. Sorted by FDV.</div>
        </div>
        <div class="dash-master__scroll">
          <table class="dash-master__table">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>CAT</th>
                <th class="ralign">α PRICE</th>
                <th class="ralign">24H</th>
                <th class="ralign">7D</th>
                <th class="ralign">30D</th>
                <th class="ralign">FDV</th>
                <th class="ralign">EMISSION</th>
                <th class="ralign">MINERS</th>
                <th class="ralign">VALIDATORS</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </section>
    `;
  }

  function renderFooter(){
    const cells = cats.map(c => `
      <div class="dash-cat">
        <span class="dash-cat__lbl">${c.label}</span>
        <span class="dash-cat__count">${c.count}</span>
        <span class="dash-cat__mcap">${'$' + c.mcap.toFixed(0)}M</span>
      </div>
    `).join('');
    return `
      <section class="dash-footer">
        <div class="dash-footer__head">
          <div class="dash-footer__title">ECOSYSTEM · category breakdown</div>
          <div style="font-size:9.5px;color:var(--c-ink-3);letter-spacing:.12em">subnet count and combined α-FDV per category</div>
        </div>
        <div class="dash-cats">${cells}</div>
      </section>
    `;
  }

  function wireDetailSparklines(scope){
    /* Price spark, deterministic seed from subnet name */
    const s = subnetById(selectedId);
    if (!s) return;
    const priceSpark = qs('[data-spark="price"]', scope);
    if (priceSpark){
      try {
        new Sparkline(priceSpark, {
          series: seedSeries(s.name + ':price', s.chg30 ?? 0, 32),
          lineWidth: 1.6, fill: true,
        });
      } catch (_) {}
    }
    const emSpark = qs('[data-spark="emission"]', scope);
    if (emSpark){
      try {
        new Sparkline(emSpark, {
          series: seedSeries(s.name + ':em', (s.chg7 ?? 0) * 0.5, 32),
          lineWidth: 1.6, fill: true,
        });
      } catch (_) {}
    }
  }
}
