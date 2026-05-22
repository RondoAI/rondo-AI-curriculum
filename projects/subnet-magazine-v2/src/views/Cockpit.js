/* =================================================================
   SUBNET MAGAZINE, COCKPIT VIEW
   -----------------------------------------------------------------
   Per Rondo 2026-05-20 ("perfect the cockpit. follow the example
   100%") the cockpit is one workspace built around the CMC-pattern
   interactive chart.

     1. ONE INTERACTIVE CHART (centerpiece)
          Mode chips:  [ SN<n> <name> ]   [ PORTFOLIO $<total> ]
          Square "+" add-position button (icon only)
          Range tabs:  1D · 7D · 30D · 90D · 1Y
          Live α price OR aggregate paper-portfolio value, same
          canvas, swap with one tap (state in localStorage).

     2. CHART SIDEBAR (right rail on desktop, stacks below the
        chart on mobile). Sections, top to bottom:
          ⊕ SIGNALS · SN<n>     Subneτ Magazine + Subnet Oracle +
                                centralized cards scored to the
                                active subnet. Compact rows: kind
                                chip + date + serif title + source.
                                All three editorial kinds carry
                                through here — they are the editorial
                                voice of the magazine on this chart.
          ⊕ NETWORK VITALS       TAO/USD ±%, MCAP, BLK, STAKED %,
                                EMIT τ/d, SUBNETS count. Live via
                                tao:market + tao:chain channels.
          ⊕ TODAY'S MOVERS       Top 3 ↑ / bottom 3 ↓ across SUBNETS
                                by 24h. Clickable rows retarget the
                                chart to that subnet.

     3. HOLDINGS TABLE BELOW
          Holdings / Allocation tabs (Allocation is a future-pass
          placeholder per the CMC spec).
          Asset · Qty · Entry · Current · Value · % Book · P&L
          (row-tap retargets chart + flips mode back to SUBNET).
          TOTAL BOOK row at the foot.

   Data sources by surface (Pass 4 audit, 2026-05-21):

     CHART HEADER PRICE BLOCK
       α price, 24h/7d/30d deltas, mcap, emission
         → SUBNETS row, MERGED LIVE via `tao:subnets` subscription
           (see onLiveSubnets in this file). Static seed in
           src/data/subnets.js is the floor.
       LIVE / SEED pill
         → `isLive` flag, flips TRUE when tao:subnets first emits.

     CHART CANVAS
       price line + volume bars + MA20/MA50
         → generateSeries(subnet) in src/lib/synthetic-series.js.
           SYNTHETIC random walk anchored on the live current
           price. Real historical data needs the planned
           `tao:history` channel (stub documented in layer.js).
           A "SEED HISTORY" disclaimer renders below the chart
           until that channel emits per [[feedback-high-coding-
           standards]].
       editorial flag dots (news markers on the price line)
         → annotationsFor() pulls from ARTICLES +
           recentOracleArticles. Static.

     CHART SIDEBAR — COMPETITORS section
       Subnet mcap τ in the VS anchor
         → SUBNETS.mcap (live via tao:subnets)
       Direct rivals (CoreWeave, Together AI, ...)
         → COMPETITORS + BY_NETUID in centralized-competitors.js.
           STATIC curated seed; future `tao:competitors` channel
           stubbed in layer.js will publish the same shape with
           live equities + private valuation feeds.
       Rival sparklines
         → competitorSparkSvg() — procedural seeded random walk
           biased toward delta24h. SYNTHETIC placeholder until
           tao:competitors carries real historical series.
       Rival 24h delta
         → delta24h field on each public competitor. STATIC
           SNAPSHOT, surfaced honestly with a "static snapshot,
           live feed pending" warn-tag inside each card.
       Per-rival articles
         → newsForCompetitor(c) filters CENTRALIZED_NEWS by
           subjects[] tag + headline/source substring. Static
           seed feed.
       Supply chain + constraints
         → BY_NETUID curated. Static.

     CHART SIDEBAR — NETWORK VITALS section
       TAO/USD, 24h chg, MCAP, BLOCK, STAKED %
         → tao:market channel (WIRED via onLiveMarket).
           Updates via setLive so cells flash on change.
       EMIT τ/d
         → tao:chain.totalIssuance (WIRED via onLiveChain).
       SUBNETS count
         → SUBNETS.length (static — accurate at chain level).

     CHART SIDEBAR — TODAY'S MOVERS section
       Top 3 / Bottom 3 by 24h
         → derived from SUBNETS array (live merge via tao:subnets).

     CHART SIDEBAR — SIGNALS section
       Magazine + Oracle + centralized cards
         → ARTICLES + recentOracleArticles + newsForSubnet.
           Static seed feeds; future RSS / curated fetcher
           merges live items by id (see briefings.js header for
           the same pattern).

     DASHBOARD FOLDS (below the chart)
       ⊕ DAILY BRIEFING       BRIEFINGS (static)
       ⊕ MARKETS ROSTER       SUBNETS (live merge via tao:subnets)
       ⊕ EDITORIAL ARCHIVE    ARTICLES + recentOracleArticles +
                              CENTRALIZED_NEWS (static)
       ⊕ ECOSYSTEM            derived from SUBNETS

   Future-pass plug-in seams: see layer.js's "PLANNED CHANNELS"
   block — tao:history (per-subnet OHLCV) + tao:competitors
   (live rival mcaps) are reserved. When each channel ships,
   views drop their static imports + subscribe to the channel.
   ================================================================= */

import { html, mount, qs, qsa, setLive } from '../lib/dom.js';
import { SUBNETS, subnetById } from '../data/subnets.js';
import { CENTRALIZED_NEWS, newsForSubnet } from '../data/centralized-news.js';
import { recentOracleArticles } from '../data/oracle-articles.js';
import { ARTICLES } from '../data/articles.js';
import { GH_ACTIVITY, ghByNetuid } from '../data/github-activity.js';
import { generateSeries, sma, SERIES_DAYS } from '../lib/synthetic-series.js';
/* Centralized competitor dataset — maps a subnet to its closest
   rivals in the non-decentralized world (OpenAI, Anthropic, Meta,
   NVIDIA, etc.). Drives the sidebar's VS CENTRALIZED comparison
   stat row so a reader sees their subnet's mcap τ side-by-side
   with the centralized competitor's mcap $. See the module's
   header for data-source provenance + future API integration
   seam. Per [[feedback-subnets-in-tao]]: subnet mcaps stay in TAO,
   competitor mcaps stay in $ — the row carries both. */
import { competitorsForSubnet, fmtCompetitorMcap, newsForCompetitor, competitorSparkSvg } from '../data/centralized-competitors.js';
/* Daily briefings + categories surface in the dashboard folds
   below the chart row (Phase B of the 2026-05-21 cockpit/
   dashboard consolidation — see [[feedback-cockpit-is-the-one-
   page]]). All four folds default-closed so they don't bloat
   the page's at-rest height. */
import { BRIEFINGS, latestBriefing, daysBetween } from '../data/briefings.js';
/* Paper-portfolio imports removed 2026-05-20 — the cockpit no
   longer surfaces paper-trading affordances (Rondo: "doht need
   another paper money chart" + "book measured has to be reimagined
   and may not be necessary at all" + "make sure it looks really
   cool looking for top traders"). The paper book + buy/sell flow
   still lives on dashboard.html's MY DESK fold for readers who
   want it; the cockpit is a pure research surface — chart +
   editorial signals + live market context. */

/* Per-subnet logo lookup — keyed by lowercased subnet name.
   Falls back to the Bittensor mark when no specific logo exists.
   Module-scope so the render template can reference during
   string-building (TDZ-safe). Mirror of the SUBNET_LOGOS map
   in Home.js — when a new logo file lands in assets/, add it
   here too. */
const SUBNET_LOGOS = {
  'hippius': 'assets/hippius-mark.png',
  'targon':  'assets/targon-mark.svg',
};
const FALLBACK_LOGO = 'assets/bittensor-mark.png';

const COCKPIT_KEY   = 'sbn:cockpit:v1';

const CAT_LABEL = {
  text:'TEXT', vision:'VISION', audio:'AUDIO', video:'VIDEO',
  multimodal:'MULTIMODAL', training:'TRAINING', data:'DATA',
  search:'SEARCH', finance:'FINANCE', agents:'AGENTS',
  robotics:'ROBOTICS', science:'SCIENCE', infra:'INFRA',
  prediction:'PREDICTION',
};
const catLabel = c => CAT_LABEL[c] || (c || '').toUpperCase();

const RANGES = [
  { key: '1D',  days: 1,   label: '1D'  },
  { key: '7D',  days: 7,   label: '7D'  },
  { key: '30D', days: 30,  label: '30D' },
  { key: '90D', days: 90,  label: '90D' },
  { key: '1Y',  days: 365, label: '1Y'  },
];

const PANES = [
  { key: 'subnets', label: 'SUBNETS' },
  { key: 'chart',   label: 'CHART'   },
  { key: 'feed',    label: 'FEED'    },
  /* DESK pane removed 2026-05-18 — paper money is the chart's
     PORTFOLIO mode toggle now, not a separate pane. */
];

/* ---------- formatters --------------------------------------- */
const fmtPrice = p => p == null ? '·' : (p < 1 ? '$' + p.toFixed(4) : '$' + p.toFixed(2));
const fmtPct   = v => v == null ? '·' : (v >= 0 ? '+' : '') + v.toFixed(2) + '%';
const fmtInt   = n => n == null ? '·' : Math.round(n).toLocaleString('en-US');
const fmtMcap  = m => m == null ? '·' : '$' + (m >= 1000 ? (m/1000).toFixed(2) + 'B' : m.toFixed(1) + 'M');
/* Subnets price in TAO, not dollars — per Rondo 2026-05-21
   ("Every subnet should be priced in TAO first, not dollars.
   Only centralized companies should be denominated in $. Subnets
   should be priced in TAO, the way taostats.io does it.") The
   dollar formatters above stay for centralized companies + the
   TAO/USD bridge pair itself; the TAO formatters below are for
   anything subnet-scoped.
     fmtTAO(0.0124)              → "0.0124 τ"
     fmtTAO(2.4, { compact:1 })  → "τ2.40"  (chart-axis-tight)
     fmtMcapTAO(12400000)        → "12.4M τ"
     fmtMcapTAO(12400)           → "12,400 τ"  */
const fmtTAO = (p, opts = {}) => {
  if (p == null) return '·';
  /* 4 decimals when sub-1, 2 decimals when ≥1 — same precision
     register taostats uses so traders read the same shape across
     surfaces. */
  const n = p < 1 ? p.toFixed(4) : p.toFixed(2);
  return opts.compact ? 'τ' + n : n + ' τ';
};
const fmtMcapTAO = m => {
  if (m == null) return '·';
  /* TAO mcap registers: M for millions, K for thousands. No B
     because subnet mcaps don't hit billion-TAO territory at
     current supply ceilings. */
  if (m >= 1_000_000) return (m / 1_000_000).toFixed(2) + 'M τ';
  if (m >= 1_000)     return (m / 1_000).toFixed(1) + 'K τ';
  return Math.round(m).toLocaleString('en-US') + ' τ';
};
const fmtDate  = d => {
  if (!d) return '·';
  const [y,m,dd] = String(d).split('-');
  return `${dd} ${['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][parseInt(m,10)-1]} ${y.slice(2)}`;
};
const cls   = v => v == null ? 'is-flat' : (v > 0 ? 'is-up' : v < 0 ? 'is-down' : 'is-flat');
const arrow = v => v == null ? '·' : (v > 0.001 ? '▲' : v < -0.001 ? '▼' : '—');

/* ---------- cockpit state ----------------------------------- */
function loadCockpitState(){
  /* Cockpit always leads with the CHART pane on fresh load.
     Selected subnet + range persist across visits via localStorage. */
  try {
    const raw = JSON.parse(localStorage.getItem(COCKPIT_KEY) || '{}');
    return {
      selectedId:  Number.isFinite(raw.selectedId)  ? raw.selectedId  : 4,
      range:       raw.range                        || '30D',
      pane:        'chart',
    };
  } catch (_) { return { selectedId: 4, range: '30D', pane: 'chart' }; }
}
function saveCockpitState(s){
  try { localStorage.setItem(COCKPIT_KEY, JSON.stringify(s)); } catch (_) {}
}

/* ---------- deterministic price + volume series -------------
   Walks backward from the subnet's current price, apportioning
   chg24 / chg7 / chg30 across their respective windows and adding
   a small random walk. Seeded per netuid so the series is stable
   across renders. Real time-series ships when DataLayer / TaoStats
   wiring lands; this gives the chart a credible shape today. */
/* ---------- chart-rendering tunables ------------------------- */
/* generateSeries() + sma() + SERIES_DAYS are imported from
   src/lib/synthetic-series.js — single source of truth shared
   with terminal/chart-mode.js and editorial-mode.js. The MA
   palette below is chart-rendering only (lines + legend swatches)
   and stays here. Same RGB lives in terminal/chart-mode.js. */
const MA_FAST_WINDOW      = 20;
const MA_SLOW_WINDOW      = 50;
/* MA overlay opacities bumped per Rondo 2026-05-21 chart review
   priority #4 ("MA20/MA50 overlays are nearly invisible"). MA20
   55% → 75%, MA50 45% → 70% so the overlays read as supporting
   register without dominating the price line. Line width
   bumped from 1 → 1.3 inside drawMA() for the same reason. */
const MA_FAST_LINE_RGBA   = 'rgba(156,230,204,0.75)';
const MA_FAST_SWATCH_RGBA = 'rgba(156,230,204,0.85)';
const MA_SLOW_LINE_RGBA   = 'rgba(232,192,103,0.70)';
const MA_SLOW_SWATCH_RGBA = 'rgba(232,192,103,0.85)';
const MA_SLOW_DASH        = [4, 3];

/* ---------- canvas chart drawing ---------------------------- */
/* No external chart lib — direct canvas2d. Reasons: keeps bundle
   tiny, gives us the exact terminal look (mint line + red volume
   bars, 1px hairlines, monospace tabular axis labels), no theming
   fight. Re-draws on resize + on range change via the wireChart
   loop. */
/* ---------- editorial annotation events --------------------- */
/* Coordinated with Mac's terminal CHART mode (commit 6234f0e) —
   same pattern, same data shape, so a reader switching between
   /cockpit.html and /terminal.html?mode=chart sees consistent
   news markers on the chart canvas. amber dot = magazine article
   published that day, red dot = oracle research published that day.
   Pulled from ARTICLES + recentOracleArticles by subnet match. */
function annotationsFor(netuid, subnetName){
  const out = [];
  for (const a of ARTICLES){
    const isThisSubnet =
      (a.subnet != null && (Number(a.subnet) === netuid ||
                            String(a.subnet) === String(subnetName)));
    if (!isThisSubnet || !a.date) continue;
    const t = Date.parse(a.date + 'T12:00:00Z');
    if (!Number.isFinite(t)) continue;
    out.push({ t, kind: 'mag', title: a.title, date: a.date });
  }
  for (const a of recentOracleArticles(Infinity)){
    const matchesSubnet =
      (a.subnetId === netuid) ||
      ((a.subnetName || '').toLowerCase() === (subnetName || '').toLowerCase()) ||
      ((a.title || '').toLowerCase().includes((subnetName || '').toLowerCase()));
    if (!matchesSubnet || !a.date) continue;
    const t = Date.parse(a.date + 'T12:00:00Z');
    if (!Number.isFinite(t)) continue;
    out.push({ t, kind: 'orc', title: a.title, date: a.date });
  }
  return out.sort((x, y) => x.t - y.t);
}

/* offset (in days back from today) lets the reader pan the chart
   into history without changing the window size. offset=0 means
   "window ending today"; offset=range.days shifts back one full
   window; etc. Clamped so slice never reads off the start of the
   synthesized series. */

/* ---------- main mount -------------------------------------- */
/**
 * @param {HTMLElement} root
 * @param {{subscribe:Function, get:Function}|null} [dataLayer]
 */
export function mountCockpit(root, dataLayer = null){
  const state    = loadCockpitState();
  /* Tab simplification 2026-05-18: dropped SUBNETS/FEED buttons.
     If a returning reader has state.pane saved as one of those,
     normalize to 'chart' so they don't land on an unreachable
     pane with no toggle back. */
  /* DESK pane removed 2026-05-18; chart is the only pane.
     Returning readers parked on 'desk' get normalized to 'chart'. */
  if (state.pane !== 'chart') state.pane = 'chart';
  let series     = generateSeries(subnetById(state.selectedId) || SUBNETS[0]);
  /* TradingView chart instance + series handles — declared at the
     top of the closure (TDZ-safe) so drawChartNow() (invoked
     during initial mount before mountTVChart's definition site)
     doesn't trip the temporal dead zone when reading them. */
  let tvChart = null;
  let tvAreaSeries = null;
  let tvMa20Series = null;
  let tvMa50Series = null;
  let tvVolumeSeries = null;
  let tvResizeObserver = null;
  /* Chart pan offset in DAYS BACK FROM TODAY. 0 = window ends today,
     positive shifts the window into history. Reset on subnet
     change + range change so the reader doesn't get stuck deep in
     history after picking a different subnet. */
  let chartOffset = 0;
  /* Live-data state — set true when 'tao:subnets' first emits a
     real batch, surfaces a pulsing red LIVE badge in the chart
     header. */
  let isLive = false;
  /* MARKETS ROSTER state (Pass: 2026-05-21 sort + filter + watchlist).
     Stored in localStorage so the reader's preferred sort + category
     filter + watchlist persists across sessions. The fold itself
     stays default-closed per [[feedback-cockpit-is-the-one-page]];
     these values only matter when the reader opens it.
       sort.key:   one of 'netuid' | 'name' | 'cat' | 'price' |
                   'chg24' | 'mcap' | 'emission' | 'miners' | 'validators'
       sort.dir:   'asc' | 'desc'
       cat:        null = ALL, or one of the CategoryKey values
       watchlist:  Set<number> of netuids the reader has starred
       onlyWatched: boolean — show only watchlisted rows. */
  const MARKETS_KEY = 'sbn:cockpit:markets:v1';
  const WATCHLIST_KEY = 'sbn:cockpit:watchlist:v1';
  let marketsView = (() => {
    try {
      const raw = JSON.parse(localStorage.getItem(MARKETS_KEY) || '{}');
      return {
        sortKey: raw.sortKey || 'mcap',
        sortDir: raw.sortDir === 'asc' ? 'asc' : 'desc',
        cat:     raw.cat || null,
        onlyWatched: !!raw.onlyWatched,
      };
    } catch (_) { return { sortKey: 'mcap', sortDir: 'desc', cat: null, onlyWatched: false }; }
  })();
  function saveMarketsView(){
    try { localStorage.setItem(MARKETS_KEY, JSON.stringify(marketsView)); } catch (_) {}
  }
  let watchlist = (() => {
    try { return new Set(JSON.parse(localStorage.getItem(WATCHLIST_KEY) || '[]')); }
    catch (_) { return new Set(); }
  })();
  function saveWatchlist(){
    try { localStorage.setItem(WATCHLIST_KEY, JSON.stringify([...watchlist])); } catch (_) {}
  }
  /* EDITORIAL ARCHIVE state — search query + kind filter, both
     persisted so the reader's view survives across sessions. */
  const ARCHIVE_KEY = 'sbn:cockpit:archive:v1';
  let archiveView = (() => {
    try {
      const raw = JSON.parse(localStorage.getItem(ARCHIVE_KEY) || '{}');
      const kind = raw.kind;
      return {
        search: typeof raw.search === 'string' ? raw.search : '',
        kind: (kind === 'mag' || kind === 'orc' || kind === 'cen') ? kind : 'all',
      };
    } catch (_) { return { search: '', kind: 'all' }; }
  })();
  function saveArchiveView(){
    try { localStorage.setItem(ARCHIVE_KEY, JSON.stringify(archiveView)); } catch (_) {}
  }
  /* No paper-money state here — the cockpit is now a pure subnet-
     research surface per Rondo 2026-05-20 ("doht need another
     paper money chart" / "make sure it looks really cool looking
     for top traders"). Earlier the cockpit had chartMode toggle
     + holdings table + add-position sheet — all stripped. The
     dashboard's MY DESK fold still owns paper-trade affordances
     for readers who want them. */

  /* Render the cockpit shell once; the chart pane repaints in
     place on subnet / range / mode changes. Everything inside
     the workspace lives in .cockpit__main — the chart on the
     left of its row, the SIGNALS + VITALS + MOVERS sidebar on
     the right, the HOLDINGS table directly below. No separate
     panes / no tab switcher: one workspace, one frame. */
  mount(root, html`
    <section class="cockpit" data-cockpit-root>
      ${renderTabs()}
      <div class="cockpit__grid">
        <section class="cockpit__main" data-pane="chart">
          ${renderMain()}
        </section>
      </div>
    </section>
  `);

  setActivePane(state.pane);
  drawChartNow();
  wireEverything();

  /* ---------- sub-renders ----------------------------------- */

  function renderTabs(){
    /* Simplified 2026-05-18 per Rondo "way too many panel options
       and panel options within panel options it's confusing."
       Drop the SUBNETS + FEED buttons — on desktop they don't
       swap anything (panes are pinned), on mobile the rail is
       always one tap away via the masthead's MAGAZINE/MARKETS
       links, and FEED was rarely tapped. Keep CHART · DESK as
       the two meaningful workflow toggles, plus the MARKETS
       jump pill. Three controls instead of five. */
    return `
      <nav class="cockpit-tabs" aria-label="Cockpit view">
        <button type="button" class="cockpit-tabs__btn" data-pane-btn="chart">CHART</button>
        <a class="cockpit-tabs__markets" href="markets.html" aria-label="Open markets page">⊕ MARKETS ↗</a>
      </nav>`;
  }

  function renderMain(){
    const s = subnetById(state.selectedId) || SUBNETS[0];
    const range = RANGES.find(r => r.key === state.range) || RANGES[2];

    const rangeBtns = RANGES.map(r => {
      const on = r.key === state.range;
      return `
      <button type="button" class="cock-range__btn ${on ? 'is-on' : ''}" data-range="${r.key}" role="tab" aria-selected="${on}" aria-label="${r.label}">${r.label}</button>`;
    }).join('');

    return `
      <!-- CHART HEADER — institutional register, no paper-money
           UI. Left side carries the picker, subnet identity, and
           the live/seed status pill. Right side carries the price
           block (big white display number + colored 24h delta +
           7d / 30d deltas + a compact MCAP / EMISSION readout). -->
      <header class="cock-chart__head cock-chart__head--trader">
        <div class="cock-chart__title">
          <!-- PICK SUBNET dropdown — the only navigation in the
               chart header. Wired to setSelected() via wireChart. -->
          <div class="cock-chart__picker cock-chart__picker--head">
            <label class="cock-chart__picker-lbl" for="cock-chart-picker">PICK</label>
            <select class="cock-chart__picker-sel" id="cock-chart-picker" data-chart-picker aria-label="Pick subnet">
              ${SUBNETS.slice().sort((a,b) => (b.mcap||0)-(a.mcap||0)).map(x =>
                /* Each option carries the subnet number, name, α
                   price (in TAO per [[feedback-subnets-in-tao]]),
                   and its 24h delta — the trader scrolls the
                   dropdown reading τ values, never $. */
                `<option value="${x.netuid}" ${x.netuid === s.netuid ? 'selected' : ''}>SN${x.netuid} · ${x.name} · ${(x.price||0).toFixed(x.price < 1 ? 4 : 2)} τ · ${x.chg24 >= 0 ? '+' : ''}${(x.chg24||0).toFixed(1)}%</option>`
              ).join('')}
            </select>
          </div>
          <!-- Subnet identity row: logo + SN# + name + category +
               live pill. The LIVE pill pulses red when tao:subnets
               has emitted a real payload; SEED while we're showing
               synthetic data. -->
          <h1 class="cock-chart__h">
            <span class="cock-chart__logo" aria-hidden="true">
              <img src="${SUBNET_LOGOS[(s.name || '').toLowerCase()] || FALLBACK_LOGO}" alt="" loading="lazy" onerror="this.src='${FALLBACK_LOGO}'">
            </span>
            <span class="cock-chart__sn">SN${s.netuid}</span>
            <span class="cock-chart__name">${s.name}</span>
            <span class="cock-chart__cat">${catLabel(s.cat)}</span>
            <!-- LIVE / SEED pill — three honest states:
                   LIVE · TMC      current price + 24h deltas live
                                    from TaoMarketcap (tao:subnets
                                    has emitted); historical line
                                    on the chart canvas remains
                                    synthetic until tao:history
                                    channel wires up.
                   SEED            tao:subnets hasn't emitted yet;
                                    everything is from the static
                                    SUBNETS seed.
                 The tooltip on hover spells out the partial-live
                 condition so readers don't infer that the whole
                 chart is live when only the current price is. -->
            <span class="cock-chart__live ${isLive ? 'is-live' : ''}" data-live-pill title="${isLive ? 'Current α price + 24h deltas live from TaoMarketcap. Historical chart series remains synthetic (taostats history feed pending).' : 'Seed data — tao:subnets channel has not emitted yet. Chart shows the static SUBNETS seed values.'}">
              <span class="cock-chart__live-dot"></span>${isLive ? 'LIVE · TMC' : 'SEED'}
            </span>
          </h1>
          <div class="cock-chart__sub">${s.desc || ''} · <span style="color:var(--c-ink-3)">team ${s.owner || '·'}</span></div>
        </div>
        <!-- Price block — the institutional register. Big white
             price (28px JetBrains Mono, tabular-nums so it doesn't
             jitter on updates), then the 24h delta in mint/red,
             then the 7d and 30d deltas dimmer below. A trader-
             grade meta row sits beneath: MCAP and 24h EMISSION.
             Each value carries a data-vital attribute so the
             tao:subnets live feed can flash it via setLive. -->
        <!-- Price block — subnets are priced in TAO (Rondo
             2026-05-21 / [[feedback-subnets-in-tao]]). The big
             headline number is α-in-TAO, deltas are %, and the
             meta row below shows TAO mcap + 24h emission so a
             trader can read the size + flow at a glance without
             leaving the chart. -->
        <div class="cock-chart__price-block">
          <div class="cock-chart__price" data-vital="sn-price">${fmtTAO(s.price)}</div>
          <div class="cock-chart__chg ${cls(s.chg24)}">${arrow(s.chg24)} ${fmtPct(s.chg24)} · 24h</div>
          <div class="cock-chart__chg2 ${cls(s.chg7)}">${fmtPct(s.chg7)} · 7d</div>
          <div class="cock-chart__chg2 ${cls(s.chg30)}">${fmtPct(s.chg30)} · 30d</div>
          <div class="cock-chart__meta">
            <span class="cock-chart__meta-row"><span class="cock-chart__meta-lbl">MCAP</span><span class="cock-chart__meta-val">${fmtMcapTAO(s.mcap)}</span></span>
            <span class="cock-chart__meta-row"><span class="cock-chart__meta-lbl">EMIT τ/d</span><span class="cock-chart__meta-val">${fmtInt(s.emission)}</span></span>
          </div>
        </div>
      </header>

      <!-- CHART ROW — canvas LEFT, sidebar RIGHT.
           The chart canvas is the centerpiece. The sidebar
           carries three stacked sections, top to bottom:
             SIGNALS    Magazine + Oracle + centralized cards
                        filtered to the active subnet.
             VITALS     Live network context (TAO/USD, MCAP, BLK,
                        STAKED %, EMIT τ/d, SUBNETS count).
             MOVERS     Top 3 ↑ / Bottom 3 ↓ by 24h, clickable
                        rows that retarget the chart.
           On mobile the row stacks: chart top, sidebar below. -->
      <div class="cock-chart__row">
        <div class="cock-chart__canvas-wrap">
          <!-- TradingView Lightweight Charts mounts inside this
               <div> (Rondo 2026-05-21 swap from custom canvas).
               The library creates its own canvases internally;
               this div is just the container. The custom OHLC
               tooltip + flag-preview slide-up overlay on top
               via absolute positioning per the existing CSS. -->
          <div class="cock-chart__canvas" data-chart-canvas
               role="img"
               aria-label="SN${s.netuid} ${s.name} price chart, ${state.range} window"></div>
          <div class="cm-tooltip" data-chart-tooltip style="display:none" role="tooltip" aria-live="polite"></div>
          <div class="cock-chart__flag-preview" data-flag-preview hidden></div>
        </div>
        <aside class="cock-chart__side" data-chart-side aria-label="Market context for SN${s.netuid} ${s.name}">
          ${renderMarketSidebar(s)}
        </aside>
      </div>

      <!-- Honest synthesis caption — the chart's HISTORICAL line
           comes from generateSeries() in synthetic-series.js, not
           a real on-chain history. Current α price + 24h deltas
           ARE live (tao:subnets channel). Until the planned
           tao:history channel lands, this caption surfaces the
           split inline so readers see the flag without hovering
           the LIVE pill. Per [[feedback-high-coding-standards]]:
           "Don't display approximate / synthetic on-chain values
           without flagging them as such." Goes away once
           tao:history publishes real OHLCV per subnet. -->
      <div class="cock-chart__synth-note" role="note" aria-label="Data provenance">
        <span class="cock-chart__synth-tag">SEED HISTORY</span>
        <span class="cock-chart__synth-text">
          Current α price + 24h deltas live from TaoMarketcap.
          Historical line synthesized via deterministic seed —
          <a href="https://github.com/RondoAI/rondo-AI-curriculum" target="_blank" rel="noopener">taostats history feed</a>
          wires in the next pass.
        </span>
      </div>

      <!-- Chart navigation: range tabs + pan history controls.
           Range tabs pick the visible window (1D / 7D / 30D / 90D /
           1Y); pan buttons walk that window backward/forward through
           history a window-at-a-time, with ⏵ TODAY snapping back to
           the most recent window. -->
      <div class="cock-chart__nav">
        <div class="cock-chart__range" role="tablist" aria-label="Time range">
          ${rangeBtns}
        </div>
        <div class="cock-chart__pan" role="group" aria-label="Chart history navigation">
          <button type="button" class="cock-pan__btn" data-pan="back" aria-label="Pan chart history backward by one window">◀ EARLIER</button>
          <span class="cock-pan__lbl" data-pan-lbl>now</span>
          <button type="button" class="cock-pan__btn" data-pan="fwd"  aria-label="Pan chart history forward by one window">LATER ▶</button>
          <button type="button" class="cock-pan__btn cock-pan__btn--today" data-pan="today" aria-label="Reset chart to current window">⏵ TODAY</button>
        </div>
      </div>

      <!-- DASHBOARD FOLDS — Phase B of the 2026-05-21 cockpit/
           dashboard consolidation (see [[feedback-cockpit-is-the-
           one-page]]). All four sections default-closed; expand
           to drill into the deeper data without leaving the page.
           Replaces the old "OPEN FULL DASHBOARD ↗" footer link —
           the dashboard's content lives HERE now. -->
      ${renderDashboardFolds()}
    `;
  }

  /* ---- DASHBOARD FOLDS (Phase B, 2026-05-21) -----------------
     Per [[feedback-cockpit-is-the-one-page]] the dashboard's
     deeper data surfaces fold INTO the cockpit as <details>
     blocks below the chart row. All four default-closed so the
     at-rest page is a single viewport-height — readers expand
     what they want to drill into. The closed-state summary
     always communicates the key signal (today's briefing kicker,
     count of subnets, count of articles, count of categories)
     so the reader can scan without expanding.

     What goes here (and what's deliberately NOT here):
       ⊕ DAILY BRIEFING   — latest editorial briefing
       ⊕ MARKETS ROSTER   — full 128-subnet table (τ-denominated)
       ⊕ EDITORIAL ARCHIVE — all mag + oracle + cen articles
       ⊕ ECOSYSTEM         — subnet count + emission per category

     Intentionally OMITTED from cockpit (lives on dashboard.html):
       - MY DESK / paper portfolio (Rondo stripped paper-money
         from the cockpit on 2026-05-20)
       - ATTRIBUTION (depends on a paper book that no longer
         lives here)
     ============================================================ */
  function renderDashboardFolds(){
    return `
      <section class="cock-folds" aria-label="Cockpit dashboard folds">
        ${renderBriefingFold()}
        ${renderMarketsFold()}
        ${renderEditorialFold()}
        ${renderEcosystemFold()}
      </section>
    `;
  }

  /* ⊕ DAILY BRIEFING — surfaces the latest editorial briefing
     with its kicker, title, dek, and a couple of highlights.
     Closed summary shows the date + kicker so readers scan
     briefing freshness at a glance. */
  function renderBriefingFold(){
    const latest = (typeof latestBriefing === 'function' ? latestBriefing() : null)
                || (BRIEFINGS && BRIEFINGS[0])
                || null;
    if (!latest){
      return `
        <details class="cock-fold">
          <summary class="cock-fold__summary">
            <span class="cock-fold__lbl">⊕ DAILY BRIEFING</span>
            <span class="cock-fold__count">no briefings indexed</span>
            <span class="cock-fold__chev" aria-hidden="true">›</span>
          </summary>
          <div class="cock-fold__body">
            <p class="cock-fold__empty">The desk hasn't published a briefing yet. Magazine + Oracle articles still surface above in the SIGNALS sidebar.</p>
          </div>
        </details>
      `;
    }
    /* Freshness eyebrow — "TODAY · BRIEFING" when the latest
       date matches today's, otherwise "Nd AGO · MOST RECENT".
       Honest about staleness so the reader trusts the surface. */
    const today = new Date().toISOString().slice(0, 10);
    const days  = (typeof daysBetween === 'function') ? daysBetween(latest.date, today) : 0;
    const freshness = days === 0 ? 'TODAY · BRIEFING'
                    : days === 1 ? '1d AGO · MOST RECENT'
                    : `${days}d AGO · MOST RECENT`;
    const highlights = (latest.highlights || []).slice(0, 3).map(h => `
      <li class="cock-fold-brief__hl">
        <span class="cock-fold-brief__hl-tag">${h.tag || '·'}</span>
        <span class="cock-fold-brief__hl-text">${h.text || ''}</span>
      </li>
    `).join('');
    return `
      <details class="cock-fold cock-fold--brief">
        <summary class="cock-fold__summary">
          <span class="cock-fold__lbl">⊕ DAILY BRIEFING</span>
          <span class="cock-fold__count">${freshness}</span>
          <span class="cock-fold__chev" aria-hidden="true">›</span>
        </summary>
        <div class="cock-fold__body cock-fold-brief">
          <div class="cock-fold-brief__head">
            <span class="cock-fold-brief__date">${latest.date || '·'}</span>
            <span class="cock-fold-brief__kicker">${latest.kicker || 'DAILY BRIEFING'}</span>
          </div>
          <h3 class="cock-fold-brief__title">${latest.title || '·'}</h3>
          ${latest.dek ? `<p class="cock-fold-brief__dek">${latest.dek}</p>` : ''}
          ${highlights ? `<ul class="cock-fold-brief__hls">${highlights}</ul>` : ''}
          ${latest.href ? `<a class="cock-fold-brief__read" href="${latest.href}" target="_blank" rel="noopener">READ FULL BRIEFING ↗</a>` : ''}
        </div>
      </details>
    `;
  }

  /* ⊕ MARKETS ROSTER — full 128-subnet sortable table with
     category filter + watchlist. Persistent across sessions
     via localStorage. The dashboard's primary data surface,
     folded into the cockpit per [[feedback-cockpit-is-the-one-
     page]]. Subnet rows tap → chart retarget. */
  function renderMarketsFold(){
    /* Build the unique category list ONCE so the filter chip
       row can render every category present in SUBNETS. */
    const cats = [...new Set(SUBNETS.map(s => s.cat).filter(Boolean))].sort();
    /* Filter + sort apply on every render. Filter first
       (cheaper), then sort the remaining set. */
    const filtered = applyMarketsFilters(SUBNETS);
    const sorted = applyMarketsSort(filtered);
    /* Filter-chip row: ALL + one chip per category + watchlist
       toggle. Active chip gets `.is-on`. */
    const chipAll = `
      <button type="button" class="cock-fold-mkt__chip ${marketsView.cat == null && !marketsView.onlyWatched ? 'is-on' : ''}" data-mkt-cat="">ALL ${SUBNETS.length}</button>
    `;
    const chipCats = cats.map(c => {
      const count = SUBNETS.filter(s => s.cat === c).length;
      const active = marketsView.cat === c && !marketsView.onlyWatched;
      return `<button type="button" class="cock-fold-mkt__chip ${active ? 'is-on' : ''}" data-mkt-cat="${c}">${c.toUpperCase()} ${count}</button>`;
    }).join('');
    const chipWatched = `
      <button type="button" class="cock-fold-mkt__chip cock-fold-mkt__chip--watch ${marketsView.onlyWatched ? 'is-on' : ''}" data-mkt-watched>★ WATCHED ${watchlist.size}</button>
    `;
    return `
      <details class="cock-fold cock-fold--mkt">
        <summary class="cock-fold__summary">
          <span class="cock-fold__lbl">⊕ MARKETS ROSTER</span>
          <span class="cock-fold__count" data-mkt-count>${sorted.length} of ${SUBNETS.length} subnets</span>
          <span class="cock-fold__chev" aria-hidden="true">›</span>
        </summary>
        <div class="cock-fold__body cock-fold-mkt">
          <!-- Filter chip row — ALL + per-category + watchlist
               toggle. Tap a chip to filter the table. Persists
               to localStorage so the reader's preferred view
               survives session restarts. -->
          <div class="cock-fold-mkt__chips" role="tablist" aria-label="Markets filter">
            ${chipAll}
            ${chipCats}
            ${chipWatched}
          </div>
          <div class="cock-fold-mkt__wrap">
            <table class="cock-fold-mkt__table">
              <thead>${renderMarketsHead()}</thead>
              <tbody data-roster-tbody>${renderMarketsRows(sorted)}</tbody>
            </table>
          </div>
          <div class="cock-fold-mkt__foot">Tap any row to retarget the chart. Tap a column header to sort. Star a row to watchlist.</div>
        </div>
      </details>
    `;
  }

  /* Sortable table head — column headers render with a sort
     indicator (▲/▼) on the active sort key. Click toggles dir
     (asc ↔ desc) when re-clicked, or sets new key + default desc
     for numerics / asc for alpha. */
  function renderMarketsHead(){
    const cols = [
      { key: 'star',     label: '',         numeric: false, sortable: false },
      { key: 'netuid',   label: 'SN',       numeric: true,  sortable: true  },
      { key: 'name',     label: 'NAME',     numeric: false, sortable: true  },
      { key: 'cat',      label: 'CAT',      numeric: false, sortable: true  },
      { key: 'price',    label: 'α PRICE (τ)', numeric: true, sortable: true },
      { key: 'chg24',    label: '24H',      numeric: true,  sortable: true  },
      { key: 'mcap',     label: 'MCAP (τ)', numeric: true,  sortable: true  },
      { key: 'emission', label: 'EMIT τ/d', numeric: true,  sortable: true  },
      { key: 'miners',   label: 'MIN',      numeric: true,  sortable: true  },
      { key: 'validators', label: 'VAL',    numeric: true,  sortable: true  },
    ];
    return '<tr>' + cols.map(c => {
      const onKey = c.key === marketsView.sortKey;
      const arrow = onKey ? (marketsView.sortDir === 'asc' ? ' ▲' : ' ▼') : '';
      const numClass = c.numeric ? 'cock-fold-mkt__num' : '';
      if (!c.sortable){
        return `<th class="${numClass} cock-fold-mkt__star-th">${c.label}</th>`;
      }
      return `<th class="${numClass} cock-fold-mkt__th-sort ${onKey ? 'is-on' : ''}" data-mkt-sort="${c.key}" role="button" tabindex="0" aria-label="Sort by ${c.label}">${c.label}${arrow}</th>`;
    }).join('') + '</tr>';
  }

  /* Filtered + sorted rows — built fresh on every fold render.
     Each row has a star button (left) + 9 data cells. Star tap
     stops propagation so it doesn't fire the row-tap retarget. */
  function renderMarketsRows(rows){
    return rows.map((x) => {
      const cls24 = x.chg24 == null ? 'is-flat' : (x.chg24 > 0 ? 'is-up' : x.chg24 < 0 ? 'is-down' : 'is-flat');
      const arr24 = x.chg24 == null ? '·' : (x.chg24 > 0.001 ? '▲' : x.chg24 < -0.001 ? '▼' : '—');
      const starred = watchlist.has(x.netuid);
      return `
        <tr class="cock-fold-mkt__row" data-roster-row="${x.netuid}" tabindex="0" role="button" aria-label="Open SN${x.netuid} ${x.name} chart">
          <td class="cock-fold-mkt__star-cell">
            <button type="button" class="cock-fold-mkt__star ${starred ? 'is-on' : ''}" data-mkt-star="${x.netuid}" aria-label="${starred ? 'Remove from watchlist' : 'Add to watchlist'}: SN${x.netuid} ${x.name}">★</button>
          </td>
          <td class="cock-fold-mkt__sn">SN${x.netuid}</td>
          <td class="cock-fold-mkt__name">${x.name}</td>
          <td class="cock-fold-mkt__cat">${x.cat || '·'}</td>
          <td class="cock-fold-mkt__num">${(x.price || 0).toFixed(x.price < 1 ? 4 : 2)} τ</td>
          <td class="cock-fold-mkt__num ${cls24}">${arr24} ${x.chg24 == null ? '·' : (x.chg24 >= 0 ? '+' : '') + x.chg24.toFixed(1) + '%'}</td>
          <td class="cock-fold-mkt__num">${fmtMcapTAO(x.mcap)}</td>
          <td class="cock-fold-mkt__num">${fmtInt(x.emission)} τ/d</td>
          <td class="cock-fold-mkt__num">${fmtInt(x.miners)}</td>
          <td class="cock-fold-mkt__num">${fmtInt(x.validators)}</td>
        </tr>
      `;
    }).join('') || '<tr><td colspan="10" class="cock-fold-mkt__empty">No subnets match the current filter.</td></tr>';
  }

  /* Filter pipeline — apply category filter and/or watchlist
     filter to the SUBNETS list. Returns a filtered copy; does
     not mutate. */
  function applyMarketsFilters(rows){
    let out = rows.slice();
    if (marketsView.onlyWatched){
      out = out.filter(s => watchlist.has(s.netuid));
    } else if (marketsView.cat){
      out = out.filter(s => s.cat === marketsView.cat);
    }
    return out;
  }

  /* Sort pipeline — sort the filtered set by the current sort
     key + direction. Numeric vs string compare handled inline.
     Stable secondary sort by netuid so ties don't shuffle. */
  function applyMarketsSort(rows){
    const k = marketsView.sortKey;
    const dir = marketsView.sortDir === 'asc' ? 1 : -1;
    return rows.slice().sort((a, b) => {
      const av = a[k]; const bv = b[k];
      if (typeof av === 'number' || typeof bv === 'number'){
        const an = Number.isFinite(av) ? av : -Infinity;
        const bn = Number.isFinite(bv) ? bv : -Infinity;
        if (an !== bn) return (an - bn) * dir;
      } else {
        const as = String(av || '').toLowerCase();
        const bs = String(bv || '').toLowerCase();
        if (as !== bs) return as.localeCompare(bs) * dir;
      }
      return a.netuid - b.netuid;
    });
  }

  /* Repaint just the markets-roster fold's contents — without
     closing the <details>. Re-renders the chip row + table head
     + table body in place, keeps the fold's `open` state, keeps
     the rest of the cockpit untouched. Called when the reader
     changes sort / filter / watchlist state. */
  function repaintMarketsRoster(){
    const fold = qs('.cock-fold--mkt', root);
    if (!fold) return;
    /* Rebuild + reinsert the entire fold body innerHTML. <details>
       remembers its open state across innerHTML swaps as long as
       the <details> element itself isn't replaced. */
    const body = qs('.cock-fold__body', fold);
    if (!body) return;
    /* Use the same renderMarketsFold output but extract just the
       body content — wrap to avoid duplicating <details>/<summary>. */
    const cats = [...new Set(SUBNETS.map(s => s.cat).filter(Boolean))].sort();
    const filtered = applyMarketsFilters(SUBNETS);
    const sorted = applyMarketsSort(filtered);
    const chipAll = `
      <button type="button" class="cock-fold-mkt__chip ${marketsView.cat == null && !marketsView.onlyWatched ? 'is-on' : ''}" data-mkt-cat="">ALL ${SUBNETS.length}</button>
    `;
    const chipCats = cats.map(c => {
      const count = SUBNETS.filter(s => s.cat === c).length;
      const active = marketsView.cat === c && !marketsView.onlyWatched;
      return `<button type="button" class="cock-fold-mkt__chip ${active ? 'is-on' : ''}" data-mkt-cat="${c}">${c.toUpperCase()} ${count}</button>`;
    }).join('');
    const chipWatched = `
      <button type="button" class="cock-fold-mkt__chip cock-fold-mkt__chip--watch ${marketsView.onlyWatched ? 'is-on' : ''}" data-mkt-watched>★ WATCHED ${watchlist.size}</button>
    `;
    body.innerHTML = `
      <div class="cock-fold-mkt__chips" role="tablist" aria-label="Markets filter">
        ${chipAll}${chipCats}${chipWatched}
      </div>
      <div class="cock-fold-mkt__wrap">
        <table class="cock-fold-mkt__table">
          <thead>${renderMarketsHead()}</thead>
          <tbody data-roster-tbody>${renderMarketsRows(sorted)}</tbody>
        </table>
      </div>
      <div class="cock-fold-mkt__foot">Tap any row to retarget the chart. Tap a column header to sort. Star a row to watchlist.</div>
    `;
    /* Update the summary count chip in the closed-state header. */
    const countEl = qs('[data-mkt-count]', root);
    if (countEl) countEl.textContent = `${sorted.length} of ${SUBNETS.length} subnets`;
    /* Re-wire the freshly-rendered controls. */
    wireMarketsRoster();
  }

  /* ⊕ EDITORIAL ARCHIVE — flat list of all Magazine + Oracle
     + centralized articles, sorted newest first. The sidebar's
     SIGNALS section pulls a compact subset; this fold carries
     the FULL depth so readers can scan editorial coverage across
     subnets without leaving the cockpit. Each row is a link out
     to the article PDF or web page. */
  /* Build the unified archive feed — Magazine + Oracle articles
     (unbounded) + the 30 most recent centralized news items, all
     normalized to one shape and sorted newest-first. Called from
     renderEditorialFold + repaintEditorialArchive so filter/search
     re-renders work against the same canonical list. */
  function archiveAllItems(){
    const team = ARTICLES.map(a => ({
      kind: 'mag', date: a.date, title: a.title,
      url:  a.pdf || a.externalUrl || '#',
      source: (a.authors && a.authors[0]) || 'Subneτ Magazine',
      subnet: a.subnet || null,
    }));
    const oracle = recentOracleArticles(Infinity).map(a => ({
      kind: 'orc', date: a.date, title: a.title,
      url:  a.pdf || '#',
      source: 'Subnet Oracle',
      subnet: a.subnetId || null,
    }));
    const central = (() => {
      try {
        return CENTRALIZED_NEWS.slice(0, 30).map(n => ({
          kind: 'cen', date: n.date, title: n.headline,
          url:  n.url || '#',
          source: n.source,
          subnet: null,
        }));
      } catch (_) { return []; }
    })();
    return [...team, ...oracle, ...central]
      .filter(a => a.date)
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  }

  /* Apply the active filter (kind chip) + search query to the
     archive's full item list. Search is case-insensitive
     substring match against title + source. */
  function applyArchiveFilters(items){
    const k = archiveView.kind;
    const q = (archiveView.search || '').trim().toLowerCase();
    let out = items.slice();
    if (k !== 'all') out = out.filter(a => a.kind === k);
    if (q) out = out.filter(a => {
      const hay = ((a.title || '') + ' ' + (a.source || '')).toLowerCase();
      return hay.includes(q);
    });
    return out;
  }

  /* Render the visible archive rows from a (pre-filtered) item
     list. Used by both the initial fold render + the in-place
     repaint after filter/search changes. */
  function renderArchiveRows(items){
    const kindLbl = (k) => k === 'mag' ? 'MAG' : k === 'orc' ? 'ORC' : 'CEN';
    if (!items.length){
      return '<div class="cock-fold-arch__empty">No articles match the current filter.</div>';
    }
    return items.map(a => `
      <a class="cock-fold-arch__row cock-fold-arch__row--${a.kind}" href="${a.url}" target="_blank" rel="noopener">
        <span class="cock-fold-arch__kind cock-fold-arch__kind--${a.kind}">${kindLbl(a.kind)}</span>
        <span class="cock-fold-arch__date">${a.date || '·'}</span>
        <span class="cock-fold-arch__title">${a.title || '·'}</span>
        <span class="cock-fold-arch__src">${a.source || ''}</span>
      </a>
    `).join('');
  }

  /* Editorial archive fold — searchable + kind-filterable list
     of every Magazine + Oracle article + the 30 most-recent
     centralized news items. Search + kind filter persist via
     localStorage; the fold itself defaults closed per
     [[feedback-cockpit-is-the-one-page]]. */
  function renderEditorialFold(){
    const all = archiveAllItems();
    const totalCounts = {
      all: all.length,
      mag: all.filter(a => a.kind === 'mag').length,
      orc: all.filter(a => a.kind === 'orc').length,
      cen: all.filter(a => a.kind === 'cen').length,
    };
    const filtered = applyArchiveFilters(all);
    const k = archiveView.kind;
    const q = archiveView.search || '';
    /* Kind chips — ALL + MAG + ORC + CEN. Active chip filled
       in the kind's accent color (mag = warn/amber, orc = red,
       cen = up/mint). */
    const chip = (id, label, count) => `
      <button type="button" class="cock-fold-arch__chip cock-fold-arch__chip--${id} ${k === id ? 'is-on' : ''}" data-arch-kind="${id}">${label} ${count}</button>
    `;
    return `
      <details class="cock-fold cock-fold--arch">
        <summary class="cock-fold__summary">
          <span class="cock-fold__lbl">⊕ EDITORIAL ARCHIVE</span>
          <span class="cock-fold__count" data-arch-count>${filtered.length} of ${all.length} articles</span>
          <span class="cock-fold__chev" aria-hidden="true">›</span>
        </summary>
        <div class="cock-fold__body cock-fold-arch">
          <!-- Toolbar — search input on the left, kind chips on
               the right. Both write directly to archiveView +
               trigger a partial re-render via
               repaintEditorialArchive(). -->
          <div class="cock-fold-arch__toolbar">
            <label class="cock-fold-arch__search-wrap">
              <span class="cock-fold-arch__search-lbl">SEARCH</span>
              <input type="search" class="cock-fold-arch__search" data-arch-search placeholder="title, source…" value="${q.replace(/"/g, '&quot;')}" aria-label="Search articles">
            </label>
            <div class="cock-fold-arch__chips" role="tablist" aria-label="Article kind">
              ${chip('all', 'ALL', totalCounts.all)}
              ${chip('mag', 'MAG', totalCounts.mag)}
              ${chip('orc', 'ORC', totalCounts.orc)}
              ${chip('cen', 'CEN', totalCounts.cen)}
            </div>
          </div>
          <div class="cock-fold-arch__wrap" data-arch-list>${renderArchiveRows(filtered)}</div>
        </div>
      </details>
    `;
  }

  /* In-place re-render of the archive list + summary count when
     the reader changes search query or kind chip. Keeps the
     <details> open + the rest of the cockpit untouched. */
  function repaintEditorialArchive(){
    const all = archiveAllItems();
    const filtered = applyArchiveFilters(all);
    const listEl = qs('[data-arch-list]', root);
    if (listEl) listEl.innerHTML = renderArchiveRows(filtered);
    const countEl = qs('[data-arch-count]', root);
    if (countEl) countEl.textContent = `${filtered.length} of ${all.length} articles`;
    /* Re-toggle the active chip class without rebuilding the
       chip row (preserves focus + input value). */
    qsa('[data-arch-kind]', root).forEach(c => {
      c.classList.toggle('is-on', c.dataset.archKind === archiveView.kind);
    });
  }

  /* ⊕ ECOSYSTEM — subnet count + emission per category. Compact
     visual register: each category gets a row with its name, the
     count of subnets that play in it, and a bar that scales with
     the category's aggregate emission. Readers see at a glance
     where the network's emission flow concentrates. */
  function renderEcosystemFold(){
    /* Aggregate SUBNETS by category. Each row gets: count, total
       mcap (τ), total daily emission (τ/d). */
    const buckets = new Map();
    for (const x of SUBNETS){
      const key = x.cat || 'unknown';
      const acc = buckets.get(key) || { cat: key, count: 0, mcap: 0, emission: 0 };
      acc.count += 1;
      acc.mcap += (x.mcap || 0);
      acc.emission += (x.emission || 0);
      buckets.set(key, acc);
    }
    const ranked = [...buckets.values()].sort((a, b) => b.emission - a.emission);
    const maxEmit = ranked.reduce((m, r) => Math.max(m, r.emission), 1);
    /* Each row is a <button> so the whole thing is one tap-target
       — clicking jumps the reader to the MARKETS ROSTER fold
       pre-filtered to that category. The data-eco-jump attribute
       carries the category key wireEcosystemFold reads on click. */
    const rows = ranked.map(r => `
      <button type="button" class="cock-fold-eco__row" data-eco-jump="${r.cat}" aria-label="Filter markets roster to ${r.cat} category">
        <span class="cock-fold-eco__cat">${r.cat}</span>
        <span class="cock-fold-eco__count">${r.count} subnet${r.count === 1 ? '' : 's'}</span>
        <div class="cock-fold-eco__bar-wrap">
          <span class="cock-fold-eco__bar" style="width:${((r.emission / maxEmit) * 100).toFixed(2)}%"></span>
        </div>
        <span class="cock-fold-eco__emit">${fmtInt(r.emission)} τ/d</span>
        <span class="cock-fold-eco__mcap">${fmtMcapTAO(r.mcap)}</span>
        <span class="cock-fold-eco__jump-chev" aria-hidden="true">›</span>
      </button>
    `).join('');
    return `
      <details class="cock-fold cock-fold--eco">
        <summary class="cock-fold__summary">
          <span class="cock-fold__lbl">⊕ ECOSYSTEM</span>
          <span class="cock-fold__count">${buckets.size} categories</span>
          <span class="cock-fold__chev" aria-hidden="true">›</span>
        </summary>
        <div class="cock-fold__body cock-fold-eco">
          ${rows}
          <div class="cock-fold-eco__foot">Bars scale with daily emission. Tap any category to jump to the MARKETS ROSTER pre-filtered to those subnets.</div>
        </div>
      </details>
    `;
  }

  /* ---- VS CENTRALIZED comparison block ------------------------
     Three-layer institutional register driven by
     competitorsForSubnet(s).profiled:

       DIRECT RIVALS (always visible) — the specific shops that
         produce / deliver what this subnet decentralizes. For
         Targon (inference): CoreWeave, Together AI, Fireworks AI,
         Lambda Labs. Not Microsoft (too generic per
         [[feedback-competitor-depth]] — the upstream platform
         belongs in supply chain instead).

       SUPPLY CHAIN (collapsible) — upstream entities all rivals
         depend on. NVIDIA, TSMC, HBM memory, hyperscale cloud,
         power grids. Surfacing this is the magazine's edge — the
         reader sees what physical-world constraints the
         centralized stack inherits and what the subnet routes
         around.

       CONSTRAINTS (collapsible) — physical-world bottlenecks
         specific to this subnet's work. H100 supply lock, power
         per GPU, capex per cluster, FY26 wait times, inference
         token economics. The asymmetry data a reader monetizes.

     If the subnet is unprofiled (no BY_NETUID entry), only
     rivals come back (sector-mcap fallback) and the supply chain
     + constraints sections render with a "desk-coverage" note.
     ============================================================ */
  function renderCompetitorCompare(s){
    const { rivals, supplyChain, constraints, profiled } = competitorsForSubnet(s, { limit: 4 });
    const subnetMcap = Number.isFinite(s.mcap) ? s.mcap : null;
    if (!rivals.length){
      return `
        <div class="cock-side-sig__compare cock-side-sig__compare--empty" role="note">
          <span class="cock-side-sig__compare-lbl">VS CENTRALIZED</span>
          <span class="cock-side-sig__compare-note">No centralized rivals indexed for the <b>${s.cat || '·'}</b> category yet. The desk profiles new sectors as subnets enter the top tier.</span>
        </div>
      `;
    }
    /* DIRECT RIVALS — each rival becomes its OWN collapsible
       card (Rondo 2026-05-21: "when I pull up Targon, next to the
       chart it should be all CoreWeave information, all the other
       competitor's information and articles with their ticker,
       price up or down").

       The card is a native <details name="cock-side-rivals">.
       Sharing the `name` makes them mutually-exclusive accordion-
       style — opening one auto-closes the others. Saves vertical
       space + matches [[feedback-dense-visualization]] (the
       sidebar can never explode into 4 simultaneously-open cards).

       Closed state (one tight row):
         [name] [ticker chip] [spark] [mcap] [Δ24h] [›]
       Open state (accordion body):
         - why-line (institutional rationale)
         - 2-3 articles about that specific company
         - tiny note: 'static snapshot, live feed pending'
            for the 24h delta on public companies; private
            companies show nothing (no daily delta source).

       Public companies get a mint left accent + mint ticker chip;
       private companies get red. Tap-and-hold a row name to open
       the company URL in a new tab (anchor inside the body, not
       the summary, so summary-click only toggles the fold). */
    const rivalRows = rivals.map(r => {
      const articles = newsForCompetitor(r, 3);
      const articleHtml = articles.length
        ? articles.map(a => `
            <a class="cock-side-vs__rival-art" href="${a.url || '#'}" target="_blank" rel="noopener">
              <span class="cock-side-vs__rival-art-date">${a.date || '·'}</span>
              <span class="cock-side-vs__rival-art-src">${a.source || ''}</span>
              <span class="cock-side-vs__rival-art-title">${a.headline || '·'}</span>
            </a>
          `).join('')
        : `<div class="cock-side-vs__rival-art-empty">No indexed centralized news mentions ${r.name} yet. The desk surfaces coverage as the feed scores it.</div>`;
      const sparkColor = Number.isFinite(r.delta24h)
        ? (r.delta24h >= 0 ? 'var(--c-up)' : 'var(--c-down)')
        : 'var(--c-ink-3)';
      const deltaHtml = Number.isFinite(r.delta24h)
        ? `<span class="cock-side-vs__rival-delta ${r.delta24h >= 0 ? 'is-up' : 'is-down'}">${r.delta24h >= 0 ? '+' : ''}${r.delta24h.toFixed(1)}%</span>`
        : `<span class="cock-side-vs__rival-delta is-flat" title="No daily delta — private company / live feed pending">—</span>`;
      return `
        <details class="cock-side-vs__rival" name="cock-side-rivals" data-source="${r.source}">
          <summary class="cock-side-vs__rival-summary">
            <span class="cock-side-vs__rival-name">${r.name}</span>
            <span class="cock-side-vs__ticker cock-side-vs__ticker--${r.source}">${r.ticker}</span>
            ${competitorSparkSvg(r, sparkColor)}
            <span class="cock-side-vs__rival-mcap">${fmtCompetitorMcap(r.mcap)}</span>
            ${deltaHtml}
            <span class="cock-side-vs__rival-chev" aria-hidden="true">›</span>
          </summary>
          <div class="cock-side-vs__rival-body">
            <p class="cock-side-vs__rival-why">${r.why || ''}</p>
            <a class="cock-side-vs__rival-link" href="${r.url}" target="_blank" rel="noopener">${r.url.replace(/^https?:\/\//, '').replace(/\/$/, '')} ↗</a>
            <div class="cock-side-vs__rival-news">${articleHtml}</div>
            ${Number.isFinite(r.delta24h) ? `<div class="cock-side-vs__rival-snapshot-note">Static snapshot — live equities feed pending.</div>` : ''}
          </div>
        </details>
      `;
    }).join('');

    /* SUPPLY CHAIN — when profiled, show each upstream entity
       with its role + ticker + mcap. Layer chips (silicon /
       memory / cloud / power) give the reader a fast frame for
       which kind of dependency it is. */
    const supplyRows = supplyChain.map(c => `
      <li class="cock-side-vs__supply" data-layer="${c.layer}">
        <span class="cock-side-vs__supply-layer cock-side-vs__supply-layer--${c.layer}">${c.layer.toUpperCase()}</span>
        <a class="cock-side-vs__co" href="${c.url}" target="_blank" rel="noopener">${c.name}</a>
        <span class="cock-side-vs__supply-role">${c.role}</span>
        <span class="cock-side-vs__mcap">${c.mcap == null ? '—' : fmtCompetitorMcap(c.mcap)}</span>
      </li>
    `).join('');

    /* CONSTRAINTS — physical-world bottleneck rows. Each carries
       a label (left), a value (right, headline number/string),
       and a short note (italic, beneath) that gives the reader
       the why. */
    const constraintRows = constraints.map(c => `
      <li class="cock-side-vs__constraint">
        <div class="cock-side-vs__constraint-head">
          <span class="cock-side-vs__constraint-lbl">${c.label}</span>
          <span class="cock-side-vs__constraint-val">${c.value}</span>
        </div>
        ${c.note ? `<div class="cock-side-vs__constraint-note">${c.note}</div>` : ''}
      </li>
    `).join('');

    return `
      <div class="cock-side-sig__compare cock-side-sig__compare--depth ${profiled ? 'is-profiled' : 'is-unprofiled'}" role="group" aria-label="Centralized rivals + supply chain + constraints">
        <div class="cock-side-sig__compare-head">
          <span class="cock-side-sig__compare-lbl">VS CENTRALIZED</span>
          <span class="cock-side-sig__compare-cat">${(s.cat || '·').toUpperCase()}</span>
        </div>
        <div class="cock-side-vs__grid">
          <!-- Subnet side: SN# name + TAO mcap, the trader's
               anchor for the entire comparison block. -->
          <div class="cock-side-vs__subnet">
            <span class="cock-side-vs__subnet-eyebrow">SN${s.netuid} · ${s.name}</span>
            <span class="cock-side-vs__subnet-mcap">${fmtMcapTAO(subnetMcap)}</span>
            <span class="cock-side-vs__subnet-lbl">mcap</span>
          </div>
          <!-- VS divider — vertical hairline + tick marks. -->
          <div class="cock-side-vs__divider" aria-hidden="true">VS</div>
          <!-- Rivals side — visible by default. -->
          <div class="cock-side-vs__rivals-wrap">
            <div class="cock-side-vs__layer-lbl">DIRECT RIVALS</div>
            <!-- Each rival is a <details name="cock-side-rivals">
                 — sharing the name attribute makes them accordion-
                 style (opening one auto-closes the others) per
                 [[feedback-dense-visualization]]. -->
            <div class="cock-side-vs__rivals">${rivalRows}</div>
          </div>
        </div>
        ${supplyChain.length ? `
          <!-- SUPPLY CHAIN — collapsible fold per
               [[feedback-collapsible-default]]. Defaults closed so
               the rivals stay the headline; reader expands for the
               deeper stack analysis. -->
          <details class="cock-side-vs__fold cock-side-vs__fold--supply">
            <summary class="cock-side-vs__fold-summary">
              <span class="cock-side-vs__fold-lbl">⊕ SUPPLY CHAIN</span>
              <span class="cock-side-vs__fold-n">${supplyChain.length}</span>
              <span class="cock-side-vs__fold-chev" aria-hidden="true">›</span>
            </summary>
            <ul class="cock-side-vs__supply-list">${supplyRows}</ul>
          </details>
        ` : ''}
        ${constraints.length ? `
          <!-- CONSTRAINTS — collapsible fold of the physical-
               world bottlenecks (H100 lock, power per GPU, capex
               per cluster). The asymmetry the reader monetizes. -->
          <details class="cock-side-vs__fold cock-side-vs__fold--constraints">
            <summary class="cock-side-vs__fold-summary">
              <span class="cock-side-vs__fold-lbl">⊕ CONSTRAINTS</span>
              <span class="cock-side-vs__fold-n">${constraints.length}</span>
              <span class="cock-side-vs__fold-chev" aria-hidden="true">›</span>
            </summary>
            <ul class="cock-side-vs__constraints-list">${constraintRows}</ul>
          </details>
        ` : ''}
        ${!profiled ? `
          <div class="cock-side-vs__unprofiled-note">
            Editorial desk hasn't profiled the supply-chain + constraint stack for SN${s.netuid} yet. Rivals shown by mcap fallback.
          </div>
        ` : ''}
      </div>
    `;
  }

  /* ---- chart sidebar (right rail) -----------------------------
     Three stacked sections — SIGNALS first (editorial leads),
     then NETWORK VITALS, then TODAY'S MOVERS. Re-renders fully
     when the active subnet changes (signals + vitals carry the
     subnet-relevant rows). Live data from tao:market + tao:chain
     updates VITALS via setLive on the value cells. */
  function renderMarketSidebar(s){
    /* SIGNALS — Magazine + Oracle + centralized cards filtered
       to the active subnet. Compact rows: small kind chip + date
       + serif title + source. All three editorial kinds carry
       through (Rondo flagged article-kind protection 2026-05-20). */
    /* SIGNALS data — sidebar now leads with CENTRALIZED COMPETITOR
       content per Rondo 2026-05-21: "when a person chooses a
       particular subnet chart to look at the articles in the side
       panels should be the centralized competitor articles or
       subjects. comparison data etc."

       Centralized news (cen kind, from newsForSubnet) scores
       third-party AI / hardware / capital news to the subnet's
       category — that's the competitor context. We pull up to 6
       of those, then 1 Magazine and 1 Oracle card as secondary
       (per [[feedback-articles-protected]] — all three kinds
       still need a home; competitor leads but the magazine voice
       still gets a foot in). 8 total.

       FUTURE PASS — proper "competitor data" needs a
         subnet ↔ centralized-rival mapping (e.g. SN4 Targon =
         vision space → OpenAI CLIP, Google Vision, Anthropic
         image API; SN1 = chat → ChatGPT, Claude, Gemini, ...).
       That mapping doesn't exist yet. When it lands, the
       sidebar can show a "VS" comparison stat row (subnet
       mcap τ vs competitor mcap $, subnet emission revenue
       vs competitor revenue, etc.) above the cards. Wiring
       seam: extend src/data/ with `centralized-competitors.js`
       that exports `competitorsForSubnet(s)` and surface its
       values on a tao:competitors DataLayer channel. */
    const team = ARTICLES.filter(a =>
      Number(a.subnet) === s.netuid ||
      String(a.subnet) === String(s.name)
    ).map(a => ({
      kind: 'mag', date: a.date, title: a.title,
      url:  a.pdf || a.externalUrl || '#',
      source: (a.authors && a.authors[0]) || 'Subneτ Magazine',
      dek:  a.tagline || a.dek || '',
    }));
    const oracle = recentOracleArticles(Infinity)
      .filter(a =>
        (a.subnetId === s.netuid) ||
        ((a.subnetName || '').toLowerCase() === s.name.toLowerCase()) ||
        ((a.title || '').toLowerCase().includes(s.name.toLowerCase()))
      )
      .map(a => ({
        kind: 'orc', date: a.date, title: a.title,
        url:  a.pdf || '#',
        source: 'Subnet Oracle',
        dek:  a.dek || '',
      }));
    let central = [];
    try {
      central = newsForSubnet(s, 8).map(n => ({
        kind: 'cen', date: n.date, title: n.headline,
        url:  n.url || '#',
        source: n.source,
        dek:  n.takeaway || '',
      }));
    } catch (_) {}
    /* Order: cen first (competitor context, up to 6), then 1
       freshest mag + 1 freshest orc so the magazine voice stays
       on the surface. The dashboard's editorial archive carries
       the full mag/orc depth for readers who want more. */
    const cenLeading = central
      .slice()
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
      .slice(0, 6);
    const magOne = team
      .slice()
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
      .slice(0, 1);
    const orcOne = oracle
      .slice()
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
      .slice(0, 1);
    /* Sidebar signal cap dropped 8 → 4 (Rondo 2026-05-21: "it
       should look smooth on mobile as well"). Eight cards at 72px
       each piled 500+px under the chart-pane sidebar, pushing the
       mobile page past 2700px. The four freshest are enough for
       "what just happened" context; the EDITORIAL ARCHIVE fold
       below the chart row carries the full backlog so readers
       who want depth tap and stay on this page. */
    const signals = [...cenLeading, ...magOne, ...orcOne].slice(0, 4);
    const overflowCount = (cenLeading.length + magOne.length + orcOne.length) - signals.length;
    const kindLbl = (k) => k === 'mag' ? 'MAG' : k === 'orc' ? 'ORC' : 'CEN';
    /* Each signal renders as a native <details> element — the
       summary IS the closed state (kind chip + date + title +
       chevron). Expanding reveals the dek paragraph + source +
       a READ link out to the article. Native <details> gives
       us free keyboard support, accessibility, and graceful
       no-JS behavior. The chevron rotates on open via CSS.
       Per [[feedback-collapsible-default]]: this is the
       magazine's preferred pattern for editorial surfaces. */
    const signalsHtml = signals.length
      ? signals.map(a => `
          <details class="cock-side-sig__card cock-side-sig__card--${a.kind}">
            <summary class="cock-side-sig__summary">
              <span class="cock-side-sig__head">
                <span class="cock-side-sig__kind cock-side-sig__kind--${a.kind}">${kindLbl(a.kind)}</span>
                <span class="cock-side-sig__date">${a.date || '·'}</span>
                <span class="cock-side-sig__chev" aria-hidden="true">›</span>
              </span>
              <span class="cock-side-sig__title">${a.title || '·'}</span>
            </summary>
            <div class="cock-side-sig__body">
              ${a.dek ? `<p class="cock-side-sig__dek">${a.dek}</p>` : ''}
              <div class="cock-side-sig__foot">
                <span class="cock-side-sig__src">${a.source || '·'}</span>
                <a class="cock-side-sig__read" href="${a.url}" target="_blank" rel="noopener" aria-label="Read full article: ${(a.title || '').replace(/"/g, '&quot;')}">READ ↗</a>
              </div>
            </div>
          </details>`).join('')
      : `<div class="cock-side-sig__empty">No dispatches indexed for SN${s.netuid} yet. The editorial desk rotates coverage as subnets enter the top emission tier.</div>`;

    /* NETWORK VITALS — live values are populated via the data-vital
       attributes the tao:market / tao:chain subscriptions update
       (so values flash on change via setLive). Initial values come
       from SUBNETS.length (subnets count) + placeholders for the
       live-fed fields until the first refresh lands. */
    const subnetCount = SUBNETS.length;
    /* TODAY'S MOVERS — top 3 ↑ / bottom 3 ↓ by 24h percent change
       across SUBNETS. Filtered to subnets with a real chg24 value
       so the row reflects real movement, not seed defaults. */
    const movers = SUBNETS.filter(x => Number.isFinite(x.chg24));
    const top = movers.slice().sort((a,b) => (b.chg24 || 0) - (a.chg24 || 0)).slice(0, 3);
    const bot = movers.slice().sort((a,b) => (a.chg24 || 0) - (b.chg24 || 0)).slice(0, 3);
    /* Each mover row gets a tiny procedural sparkline so the
       reader sees trend direction at a glance — same trader-
       grade density as the rival cards. The spark is colored
       to match the delta sign (mint for up, red for down) and
       biased toward that direction so the visual agrees with
       the headline ±%. Reuses competitorSparkSvg via the generic
       { id, delta24h } shape. */
    const moverRow = (x, dir) => {
      const sparkColor = dir === 'up' ? 'var(--c-up)' : 'var(--c-down)';
      const spark = competitorSparkSvg({ id: 'sn-' + x.netuid, delta24h: x.chg24 }, sparkColor);
      return `
      <button type="button" class="cock-side-mov__row cock-side-mov__row--${dir}" data-mover="${x.netuid}" aria-label="Switch chart to SN${x.netuid} ${x.name}">
        <span class="cock-side-mov__sn">SN${x.netuid}</span>
        <span class="cock-side-mov__name">${x.name}</span>
        <span class="cock-side-mov__spark">${spark}</span>
        <span class="cock-side-mov__pct ${cls(x.chg24)}">${arrow(x.chg24)} ${fmtPct(x.chg24)}</span>
      </button>`;
    };

    return `
      <section class="cock-side-sig" aria-label="Centralized competitor signals for SN${s.netuid} ${s.name}">
        <header class="cock-side__head">
          <span class="cock-side__h">⊕ COMPETITORS · SN${s.netuid} · ${s.name}</span>
          <span class="cock-side__n">${signals.length}</span>
        </header>
        ${renderCompetitorCompare(s)}
        <div class="cock-side-sig__list">${signalsHtml}</div>
        ${overflowCount > 0 ? `
          <!-- Overflow link to the EDITORIAL ARCHIVE fold below the
               chart row — the canonical home for the full backlog.
               Tap scrolls to + opens the fold so the reader stays
               on this page (no nested pages per
               [[feedback-no-nested-pages]]). -->
          <a class="cock-side-sig__more" href="#editorial" data-jump-archive aria-label="Open editorial archive fold for ${overflowCount} more dispatches">
            <span class="cock-side-sig__more-lbl">+ ${overflowCount} more in</span>
            <span class="cock-side-sig__more-target">EDITORIAL ARCHIVE ↓</span>
          </a>
        ` : ''}
      </section>

      <section class="cock-side-vit" aria-label="Bittensor network vitals">
        <header class="cock-side__head">
          <span class="cock-side__h">⊕ NETWORK VITALS</span>
          <span class="cock-side__n" data-vital-live aria-hidden="true">·</span>
        </header>
        <dl class="cock-side-vit__list">
          <div class="cock-side-vit__row">
            <dt>TAO / USD</dt>
            <dd><span data-vital="tao-price">·</span> <span class="cock-side-vit__delta" data-vital="tao-chg24">·</span></dd>
          </div>
          <div class="cock-side-vit__row">
            <dt>TAO MCAP</dt>
            <dd data-vital="tao-mcap">·</dd>
          </div>
          <div class="cock-side-vit__row">
            <dt>BLOCK</dt>
            <dd data-vital="tao-block">·</dd>
          </div>
          <div class="cock-side-vit__row">
            <dt>STAKED</dt>
            <dd data-vital="tao-staked">·</dd>
          </div>
          <div class="cock-side-vit__row">
            <dt>EMIT τ/d</dt>
            <dd data-vital="tao-emit">·</dd>
          </div>
          <div class="cock-side-vit__row">
            <dt>SUBNETS</dt>
            <dd>${subnetCount}</dd>
          </div>
        </dl>
      </section>

      <section class="cock-side-mov" aria-label="Today's movers across Bittensor subnets">
        <header class="cock-side__head">
          <span class="cock-side__h">⊕ TODAY'S MOVERS</span>
          <span class="cock-side__n">24H</span>
        </header>
        <div class="cock-side-mov__group" aria-label="Top 3 gainers">
          <div class="cock-side-mov__group-lbl cock-side-mov__group-lbl--up">↑ TOP 3</div>
          ${top.map(x => moverRow(x, 'up')).join('') || '<div class="cock-side-mov__empty">No data yet.</div>'}
        </div>
        <div class="cock-side-mov__group" aria-label="Bottom 3 losers">
          <div class="cock-side-mov__group-lbl cock-side-mov__group-lbl--down">↓ BOTTOM 3</div>
          ${bot.map(x => moverRow(x, 'down')).join('') || '<div class="cock-side-mov__empty">No data yet.</div>'}
        </div>
      </section>
    `;
  }

  /* ---------- selection helpers ------------------------------- */

  function setSelected(netuid){
    if (netuid === state.selectedId) return;
    state.selectedId = netuid;
    saveCockpitState(state);
    series = generateSeries(subnetById(netuid) || SUBNETS[0]);
    /* Subnet change resets pan so the reader lands on the new
       subnet's CURRENT window, not whatever historic offset the
       prior subnet was parked at. */
    chartOffset = 0;
    repaintMain();
  }

  function setRange(key){
    if (key === state.range) return;
    state.range = key;
    saveCockpitState(state);
    /* Keep visual is-on + aria-selected in lockstep so SR users
       hear the new range as the active tab. */
    qsa('[data-range]', root).forEach(b => {
      const on = b.dataset.range === key;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-selected', String(on));
    });
    /* Range change resets pan — the new window starts at "today"
       so the reader has a known anchor. */
    chartOffset = 0;
    drawChartNow();
  }

  function setActivePane(key){
    /* The cockpit is single-pane now; this hook stays as a no-op
       sink so existing state.pane persistence + the post-mount
       chart redraw still work. */
    state.pane = 'chart';
    saveCockpitState(state);
    if (key === 'chart') requestAnimationFrame(drawChartNow);
  }

  /* ---------- repaint primitive ------------------------------ */

  function repaintMain(){
    const m = qs('[data-pane="chart"]', root);
    if (!m) return;
    /* m.innerHTML wipes the [data-chart-canvas] div TradingView
       attached children to — leaving tvChart pointing at orphaned
       DOM. Tear down the chart instance + series refs FIRST so the
       drawChartNow() call below remounts cleanly into the fresh
       container. Without this teardown, setData runs on a dead
       chart and the new container stays visually empty. */
    if (tvResizeObserver){ try { tvResizeObserver.disconnect(); } catch (_) {} tvResizeObserver = null; }
    if (tvChart){ try { tvChart.remove(); } catch (_) {} tvChart = null; }
    tvAreaSeries = null;
    tvMa20Series = null;
    tvMa50Series = null;
    tvVolumeSeries = null;
    m.innerHTML = renderMain();
    wireChart();
    drawChartNow();
  }

  /* The tvChart / tvAreaSeries / tv*Series / tvResizeObserver
     variables are declared near the top of mountCockpit (TDZ-
     safe). mountTVChart initializes them on first call; updates
     reuse the same chart instance. */

  /* Initialize TradingView Lightweight Charts inside the
     [data-chart-canvas] container. Applies the magazine's
     locked theme (--c-bg / --c-ink-* / --c-red-grid). Creates
     four series:
       - Area (the headline price + gradient fill, color flips
         mint/red-pink based on direction)
       - MA20 + MA50 line series (overlay context)
       - Volume histogram on its own price scale
     Subscribes to crosshair-move (drives the custom OHLC
     tooltip) + click (opens flag-preview when a marker is hit).
     Returns silently if window.LightweightCharts hasn't loaded
     (degrades gracefully — chart just doesn't render). */
  function mountTVChart(){
    const container = qs('[data-chart-canvas]', root);
    if (!container) return;
    if (!window.LightweightCharts) return;
    try {
    if (tvChart){
      tvChart.remove();
      tvChart = null;
    }
    const LWC = window.LightweightCharts;
    tvChart = LWC.createChart(container, {
      width: container.clientWidth,
      height: container.clientHeight,
      layout: {
        background: { type: 'solid', color: '#050203' },
        textColor: 'rgba(200, 168, 173, 0.85)',
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 10,
      },
      grid: {
        vertLines: { color: 'rgba(255,30,60,0.06)' },
        horzLines: { color: 'rgba(255,30,60,0.06)' },
      },
      timeScale: {
        timeVisible: false,
        secondsVisible: false,
        borderColor: 'rgba(255,30,60,0.22)',
        rightOffset: 4,
      },
      rightPriceScale: {
        borderColor: 'rgba(255,30,60,0.22)',
        scaleMargins: { top: 0.08, bottom: 0.25 },
      },
      crosshair: {
        mode: LWC.CrosshairMode.Magnet,
        vertLine: { color: 'rgba(255,30,60,0.55)', style: LWC.LineStyle.Solid, width: 1, labelBackgroundColor: '#FF1E3C' },
        horzLine: { color: 'rgba(255,30,60,0.55)', style: LWC.LineStyle.Solid, width: 1, labelBackgroundColor: '#FF1E3C' },
      },
      handleScale: { axisPressedMouseMove: true, mouseWheel: true, pinch: true },
      handleScroll: { mouseWheel: false, pressedMouseMove: true, horzTouchDrag: true, vertTouchDrag: false },
      kineticScroll: { touch: true, mouse: false },
    });

    tvAreaSeries = tvChart.addAreaSeries({
      lineColor: '#00E5A8',
      topColor: 'rgba(0,229,168,0.55)',
      bottomColor: 'rgba(0,229,168,0.06)',
      lineWidth: 2,
      priceLineColor: '#00E5A8',
      priceLineWidth: 1,
      priceLineStyle: LWC.LineStyle.Dashed,
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 4,
      crosshairMarkerBorderColor: '#050203',
      crosshairMarkerBackgroundColor: '#00E5A8',
      lastValueVisible: true,
      priceFormat: { type: 'price', precision: 4, minMove: 0.0001 },
    });
    tvMa20Series = tvChart.addLineSeries({
      color: 'rgba(156,230,204,0.75)',
      lineWidth: 1,
      priceLineVisible: false,
      lastValueVisible: false,
      crosshairMarkerVisible: false,
    });
    tvMa50Series = tvChart.addLineSeries({
      color: 'rgba(232,192,103,0.70)',
      lineWidth: 1,
      lineStyle: LWC.LineStyle.Dashed,
      priceLineVisible: false,
      lastValueVisible: false,
      crosshairMarkerVisible: false,
    });
    tvVolumeSeries = tvChart.addHistogramSeries({
      color: 'rgba(0,229,168,0.40)',
      priceFormat: { type: 'volume' },
      priceScaleId: 'volume',
      priceLineVisible: false,
      lastValueVisible: false,
    });
    tvChart.priceScale('volume').applyOptions({
      scaleMargins: { top: 0.82, bottom: 0 },
    });

    /* Resize handling — container can change size on viewport
       resize or sidebar collapse. ResizeObserver fires whenever
       the container's content box changes. */
    if (tvResizeObserver) tvResizeObserver.disconnect();
    tvResizeObserver = new ResizeObserver(entries => {
      const rect = entries[0].contentRect;
      if (tvChart) tvChart.applyOptions({ width: rect.width, height: rect.height });
    });
    tvResizeObserver.observe(container);

    /* Crosshair move → custom OHLC tooltip. The library has its
       own minimal tooltip but the magazine wants the editorial
       register (serif headlines, kind chips). */
    tvChart.subscribeCrosshairMove(param => {
      const tooltipEl = qs('[data-chart-tooltip]', root);
      if (!tooltipEl) return;
      if (!param || !param.time || !param.point || !tvAreaSeries){
        tooltipEl.style.display = 'none';
        return;
      }
      const ts = (typeof param.time === 'number' ? param.time * 1000 : null);
      if (!Number.isFinite(ts)){
        tooltipEl.style.display = 'none';
        return;
      }
      /* Find the bar whose t matches param.time (with a 1-day
         tolerance — series is daily granularity). */
      const bar = series.find(b => Math.abs(b.t - ts) < 86400 * 500);
      if (!bar){
        tooltipEl.style.display = 'none';
        return;
      }
      const ma20Val = param.seriesData.get(tvMa20Series);
      const ma50Val = param.seriesData.get(tvMa50Series);
      const ma20Txt = (ma20Val && Number.isFinite(ma20Val.value)) ? (ma20Val.value < 1 ? '$' + ma20Val.value.toFixed(4) : '$' + ma20Val.value.toFixed(2)) : null;
      const ma50Txt = (ma50Val && Number.isFinite(ma50Val.value)) ? (ma50Val.value < 1 ? '$' + ma50Val.value.toFixed(4) : '$' + ma50Val.value.toFixed(2)) : null;
      const d = new Date(bar.t);
      const MON = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
      const date = `${MON[d.getMonth()]} ${d.getDate()} ${String(d.getFullYear()).slice(2)}`;
      const fmtP = p => p == null ? '·' : ((p < 1 ? p.toFixed(4) : p.toFixed(2)) + ' τ');
      const ohlcDelta = bar.close - bar.open;
      const ohlcCls = ohlcDelta >= 0 ? 'is-up' : 'is-down';
      tooltipEl.innerHTML = `
        <div class="ct-tt__head">
          <span class="ct-tt__date">${date}</span>
          <span class="ct-tt__sign ${ohlcCls}">${ohlcDelta >= 0 ? '▲' : '▼'}</span>
        </div>
        <div class="ct-tt__rows">
          <span class="ct-tt__row">O <b>${fmtP(bar.open)}</b></span>
          <span class="ct-tt__row">H <b>${fmtP(bar.high)}</b></span>
          <span class="ct-tt__row">L <b>${fmtP(bar.low)}</b></span>
          <span class="ct-tt__row">C <b>${fmtP(bar.close)}</b></span>
          ${ma20Txt ? `<span class="ct-tt__row ct-tt__row--ma20">MA20 <b>${ma20Txt}</b></span>` : ''}
          ${ma50Txt ? `<span class="ct-tt__row ct-tt__row--ma50">MA50 <b>${ma50Txt}</b></span>` : ''}
        </div>
      `;
      tooltipEl.style.display = 'block';
      const rect = container.getBoundingClientRect();
      const w = tooltipEl.offsetWidth || 180;
      const h = tooltipEl.offsetHeight || 100;
      let left = param.point.x + 14;
      let top  = param.point.y - h - 6;
      if (left + w > rect.width)  left = param.point.x - w - 14;
      if (top < 0)                top  = param.point.y + 14;
      tooltipEl.style.left = left + 'px';
      tooltipEl.style.top  = top + 'px';
    });

    /* Click → check if a marker was clicked (annotation flag).
       If so, open the flag-preview slide-up with the article. */
    tvChart.subscribeClick(param => {
      if (!param || !param.time) return;
      const ts = (typeof param.time === 'number' ? param.time * 1000 : null);
      if (!Number.isFinite(ts)) return;
      const s = subnetById(state.selectedId) || SUBNETS[0];
      const anns = annotationsFor(s.netuid, s.name);
      /* Find marker at this time (one-day tolerance). */
      const ann = anns.find(a => Math.abs(a.t - ts) < 86400 * 600);
      const previewEl = qs('[data-flag-preview]', root);
      if (!previewEl) return;
      if (!ann){
        previewEl.hidden = true;
        previewEl.innerHTML = '';
        return;
      }
      const a = ann;
      const href = a.url || a.href || '';
      const isPdf = /\.pdf(\?|$|#)/i.test(href);
      const kindLbl = a.kind === 'mag' ? 'MAGAZINE' : a.kind === 'orc' ? 'ORACLE' : 'EDITORIAL';
      const kindCls = a.kind === 'mag' ? 'is-mag' : (a.kind === 'orc' ? 'is-orc' : 'is-cen');
      const pdfAttrs = isPdf ? ` data-pdf-url="${escapeAttr(href)}"` : '';
      previewEl.innerHTML = `
        <div class="cock-chart__flag-preview-inner">
          <div class="cock-chart__flag-preview-head">
            <span class="cock-chart__flag-preview-kind ${kindCls}">${kindLbl}</span>
            <span class="cock-chart__flag-preview-date">${escapeAttr(a.date || '·')}</span>
            <button type="button" class="cock-chart__flag-preview-x" data-flag-close aria-label="Close article preview">×</button>
          </div>
          <h4 class="cock-chart__flag-preview-title">${escapeAttr(a.title || '·')}</h4>
          ${href ? `<a class="cock-chart__flag-preview-cta" href="${escapeAttr(href)}" target="_blank" rel="noopener"${pdfAttrs}>READ ${isPdf ? 'PDF' : 'ARTICLE'} ↗</a>` : ''}
        </div>`;
      previewEl.hidden = false;
    });
    } catch (_) {
      /* Library API mismatch or detached container — fail silent,
         the chart just doesn't render. drawChartNow's container-
         absent guard already covers the visible state. */
    }
  }

  function drawChartNow(){
    const c = qs('[data-chart-canvas]', root);
    if (!c) return;
    if (!tvChart) mountTVChart();
    if (!tvChart) return; // library not loaded
    const range = RANGES.find(r => r.key === state.range) || RANGES[2];
    const s = subnetById(state.selectedId) || SUBNETS[0];
    /* The cockpit chart renders one thing only: the active
       subnet's α price over `range.days` (Rondo 2026-05-20: no
       second paper-money chart). Annotations are editorial flags
       — magazine + oracle articles tied to this subnet, rendered
       as red/amber dots above the price line via TradingView's
       setMarkers API. */
    const chartSeries = series;
    const maxOffset = Math.max(0, chartSeries.length - range.days);
    if (chartOffset > maxOffset) chartOffset = maxOffset;
    if (chartOffset < 0)         chartOffset = 0;

    /* Translate our internal series shape to TradingView's:
       price bars → area series points {time, value}
       volume bars → histogram with up/down color per point
       MA arrays → line series points after sma() computes them. */
    const areaData = chartSeries.map(b => ({
      time: Math.floor(b.t / 1000),
      value: b.close,
    }));
    const volData = chartSeries.map((b, i) => {
      const up = i > 0 && b.close >= chartSeries[i - 1].close;
      return {
        time: Math.floor(b.t / 1000),
        value: b.volume || 0,
        color: up ? 'rgba(0,229,168,0.40)' : 'rgba(255,77,109,0.40)',
      };
    });
    const allCloses = chartSeries.map(b => b.close);
    const ma20Full = sma(allCloses, MA_FAST_WINDOW);
    const ma50Full = sma(allCloses, MA_SLOW_WINDOW);
    const ma20Data = chartSeries
      .map((b, i) => ({ time: Math.floor(b.t / 1000), value: ma20Full[i] }))
      .filter(d => Number.isFinite(d.value));
    const ma50Data = chartSeries
      .map((b, i) => ({ time: Math.floor(b.t / 1000), value: ma50Full[i] }))
      .filter(d => Number.isFinite(d.value));

    tvAreaSeries.setData(areaData);
    tvMa20Series.setData(ma20Data);
    tvMa50Series.setData(ma50Data);
    tvVolumeSeries.setData(volData);

    /* Flip area + price-line color based on overall direction
       (first close vs last close in the FULL series). */
    if (areaData.length > 1){
      const first = areaData[0].value;
      const last  = areaData[areaData.length - 1].value;
      const isUp  = last >= first;
      const lineColor = isUp ? '#00E5A8' : '#FF4D60';
      tvAreaSeries.applyOptions({
        lineColor,
        topColor: isUp ? 'rgba(0,229,168,0.55)' : 'rgba(255,77,109,0.55)',
        bottomColor: isUp ? 'rgba(0,229,168,0.06)' : 'rgba(255,77,109,0.06)',
        priceLineColor: lineColor,
        crosshairMarkerBackgroundColor: lineColor,
      });
    }

    /* Editorial flag markers on the price line — magazine = amber,
       oracle = red, centralized = mint. setMarkers replaces the
       prior marker set in one call. */
    const annotations = annotationsFor(s.netuid, s.name);
    const markers = annotations
      .filter(a => Number.isFinite(a.t))
      .map(a => ({
        time: Math.floor(a.t / 1000),
        position: 'aboveBar',
        color: a.kind === 'mag' ? '#FFB85C' : a.kind === 'orc' ? '#FF4D60' : '#00E5A8',
        shape: 'circle',
        size: 1,
      }))
      .sort((a, b) => a.time - b.time);
    tvAreaSeries.setMarkers(markers);

    /* Set the VISIBLE range based on range.days + chartOffset.
       lastT = today's timestamp; visible window ends at
       lastT - chartOffset days, spans range.days backward. */
    if (areaData.length){
      const lastT = areaData[areaData.length - 1].time;
      const dayS = 86400;
      const to   = lastT - chartOffset * dayS;
      const from = to - range.days * dayS;
      try {
        tvChart.timeScale().setVisibleRange({ from, to });
      } catch (_) {}
    }

    /* Pan-state label below the chart — the visible window's
       literal start → end dates ("01/19 → 02/18" style) plus
       the pan offset ("now" / "−30d") so the reader sees BOTH
       where they are in the chart's history AND the actual
       dates they're looking at. */
    const lbl = qs('[data-pan-lbl]', root);
    if (lbl && series && series.length){
      const sliceStart = Math.max(0, series.length - range.days - chartOffset);
      const sliceEnd   = Math.min(series.length, sliceStart + range.days);
      const startT = series[sliceStart]?.t;
      const endT   = series[sliceEnd - 1]?.t;
      const fmtDate = (t) => {
        if (!Number.isFinite(t)) return '·';
        const d = new Date(t);
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${m}/${dd}`;
      };
      const offsetTxt = chartOffset === 0 ? 'NOW' : `−${chartOffset}d`;
      lbl.innerHTML =
        `<span class="cock-pan__dates">${fmtDate(startT)} → ${fmtDate(endT)}</span>` +
        `<span class="cock-pan__offset">${offsetTxt}</span>`;
      lbl.classList.toggle('is-back', chartOffset > 0);
    }
    /* Refresh canvas aria-label so SR users hear the new subnet
       + range pair on every redraw. Synthesizes the headline read
       of the visible window (up X% / down Y% / last close N τ)
       from the price slice — last-close is in TAO per
       [[feedback-subnets-in-tao]], matching the visual axis. */
    if (c && series && series.length){
      const sliceStart = Math.max(0, series.length - range.days - chartOffset);
      const sliceEnd   = Math.min(series.length, sliceStart + range.days);
      const slice = series.slice(sliceStart, sliceEnd);
      if (slice.length >= 2){
        const first = slice[0].close;
        const last  = slice[slice.length - 1].close;
        const ret   = first > 0 ? ((last - first) / first) * 100 : 0;
        const dir   = ret >= 0 ? 'up' : 'down';
        const lastPriced = (last < 1 ? last.toFixed(4) : last.toFixed(2)) + ' tao';
        const histTag = chartOffset === 0 ? '' : `, ${chartOffset} days back`;
        c.setAttribute('aria-label',
          `SN${s.netuid} ${s.name || ''} price chart, ${range.label} window${histTag}, ${dir} ${Math.abs(ret).toFixed(2)} percent, last close ${lastPriced}`);
      }
    }
  }

  /* ---------- wiring --------------------------------------- */

  /* Markets-roster interactions — wire row taps (retarget chart),
     sort headers (cycle key + dir), filter chips (category +
     watchlist), star buttons (toggle watchlist). Re-callable from
     repaintMarketsRoster() after an in-place body re-render so
     fresh elements get listeners.

     Wire pattern: query all matching elements + attach handlers.
     The OLD listeners are dropped when the body innerHTML is
     replaced (they live on detached nodes that GC reclaims). */
  function wireMarketsRoster(){
    /* Row taps — same retarget path as the picker / movers.
       Smooth-scroll the chart canvas into view so the reader
       sees the result of their pick. Star-button clicks inside
       the row stopPropagation so they don't fire the row tap. */
    qsa('[data-roster-row]', root).forEach(r => {
      const handler = () => {
        const id = parseInt(r.dataset.rosterRow, 10);
        if (!Number.isFinite(id) || id === state.selectedId) return;
        setSelected(id);
        const canvas = qs('[data-chart-canvas]', root);
        if (canvas && typeof canvas.scrollIntoView === 'function'){
          canvas.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };
      r.addEventListener('click', handler);
      r.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); handler(); }
      });
    });

    /* Star toggles — clicking a star adds/removes the row's
       subnet from the watchlist, persists, and re-renders the
       fold so the watchlist count + star state update. */
    qsa('[data-mkt-star]', root).forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const id = parseInt(btn.dataset.mktStar, 10);
        if (!Number.isFinite(id)) return;
        if (watchlist.has(id)) watchlist.delete(id);
        else watchlist.add(id);
        saveWatchlist();
        repaintMarketsRoster();
      });
    });

    /* Sortable column headers — clicking the active sort header
       toggles direction (asc ↔ desc). Clicking a different
       header sets it as the new sort key (default desc for
       numerics so the biggest values come first; asc for alpha
       like name/cat). */
    qsa('[data-mkt-sort]', root).forEach(th => {
      const fire = () => {
        const key = th.dataset.mktSort;
        if (!key) return;
        if (marketsView.sortKey === key){
          marketsView.sortDir = marketsView.sortDir === 'asc' ? 'desc' : 'asc';
        } else {
          marketsView.sortKey = key;
          const alphaCols = new Set(['name', 'cat']);
          marketsView.sortDir = alphaCols.has(key) ? 'asc' : 'desc';
        }
        saveMarketsView();
        repaintMarketsRoster();
      };
      th.addEventListener('click', fire);
      th.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); fire(); }
      });
    });

    /* Category filter chips — tap "ALL" or a category chip to
       narrow the visible roster. The watchlist chip is mutex
       with category (turning on watchlist clears category). */
    qsa('[data-mkt-cat]', root).forEach(chip => {
      chip.addEventListener('click', () => {
        const cat = chip.dataset.mktCat || null;
        marketsView.cat = cat || null;
        marketsView.onlyWatched = false;
        saveMarketsView();
        repaintMarketsRoster();
      });
    });

    /* Watchlist filter toggle — single button that flips between
       "show all" and "show only starred subnets." Mutex with
       category filter so the reader isn't trapped in an
       intersection that returns zero rows. */
    const watchBtn = qs('[data-mkt-watched]', root);
    if (watchBtn){
      watchBtn.addEventListener('click', () => {
        marketsView.onlyWatched = !marketsView.onlyWatched;
        if (marketsView.onlyWatched) marketsView.cat = null;
        saveMarketsView();
        repaintMarketsRoster();
      });
    }
  }

  /* Editorial archive fold — search input + kind chips. Both
     write to archiveView + trigger a partial re-render. Search
     debounces ~120ms so each keystroke doesn't repaint. */
  function wireEditorialFold(){
    const searchEl = qs('[data-arch-search]', root);
    if (searchEl){
      let st = 0;
      searchEl.addEventListener('input', e => {
        const v = e.target.value || '';
        clearTimeout(st);
        st = setTimeout(() => {
          archiveView.search = v;
          saveArchiveView();
          repaintEditorialArchive();
        }, 120);
      });
    }
    qsa('[data-arch-kind]', root).forEach(chip => {
      chip.addEventListener('click', () => {
        const k = chip.dataset.archKind;
        if (!k || k === archiveView.kind) return;
        archiveView.kind = k;
        saveArchiveView();
        repaintEditorialArchive();
      });
    });
  }

  /* Ecosystem fold — clicking a category row jumps the reader to
     the MARKETS ROSTER fold pre-filtered to that category. The
     handler:
       1. Sets marketsView.cat + clears onlyWatched
       2. Saves the new state to localStorage
       3. Opens the MARKETS ROSTER <details>
       4. Closes the ECOSYSTEM <details> so the reader's eye
          follows the action toward the table
       5. Repaints the markets roster (chips/headers/body)
       6. Smooth-scrolls the markets roster into view
     This is the through-line per [[feedback-high-coding-
     standards]] — every data view connects to actionable next
     surface, not a dead-end list. */
  function wireEcosystemFold(){
    qsa('[data-eco-jump]', root).forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.ecoJump;
        if (!cat) return;
        marketsView.cat = cat;
        marketsView.onlyWatched = false;
        saveMarketsView();
        const mktFold = qs('.cock-fold--mkt', root);
        const ecoFold = qs('.cock-fold--eco', root);
        if (mktFold) mktFold.setAttribute('open', '');
        if (ecoFold) ecoFold.removeAttribute('open');
        repaintMarketsRoster();
        if (mktFold && typeof mktFold.scrollIntoView === 'function'){
          mktFold.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  function wireEverything(){
    wireChart();
    /* Window resize triggers a chart re-draw (canvas needs to
       recompute its pixel dimensions when the viewport changes). */
    let rTick = 0;
    window.addEventListener('resize', () => {
      if (rTick) return;
      rTick = requestAnimationFrame(() => { rTick = 0; drawChartNow(); });
    });
  }

  function wireChart(){
    /* Range tabs (1D / 7D / 30D / 90D / 1Y) below the chart. Tap
       to swap the visible window; setRange re-clamps the pan
       offset + redraws the canvas. */
    qsa('[data-range]', root).forEach(b => {
      b.addEventListener('click', () => setRange(b.dataset.range));
    });
    /* Subnet picker dropdown in the chart header — change event
       switches the whole cockpit's active subnet. Repaints chart
       + sidebar (signals filter to the new subnet, vitals stay
       network-wide). */
    const picker = qs('[data-chart-picker]', root);
    if (picker){
      picker.addEventListener('change', () => {
        const id = parseInt(picker.value, 10);
        if (Number.isFinite(id)) setSelected(id);
      });
    }
    /* Sidebar mover rows — tap → switch chart to that subnet
       (same selection path as the picker dropdown). */
    qsa('[data-mover]', root).forEach(b => {
      b.addEventListener('click', () => {
        const id = parseInt(b.dataset.mover, 10);
        if (!Number.isFinite(id) || id === state.selectedId) return;
        setSelected(id);
      });
    });

    /* Sidebar "+ N more in EDITORIAL ARCHIVE" jump — scrolls
       down to the archive fold + opens it, so the trimmed
       4-card sidebar still hands off to the full backlog
       without leaving the page. */
    qsa('[data-jump-archive]', root).forEach(b => {
      b.addEventListener('click', (ev) => {
        ev.preventDefault();
        const arch = qs('details.cock-fold--arch', root);
        if (!arch) return;
        arch.open = true;
        arch.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    /* MARKETS ROSTER (dashboard fold) — wire row taps, sort
       headers, filter chips, watchlist toggles. Factored out
       so repaintMarketsRoster() can re-wire after an in-place
       re-render without re-running ALL of wireChart. */
    wireMarketsRoster();
    /* ECOSYSTEM fold — tap a category row to jump to the
       MARKETS ROSTER pre-filtered to that category. */
    wireEcosystemFold();
    /* EDITORIAL ARCHIVE fold — search input + kind chips. */
    wireEditorialFold();


    /* Pan history controls — wired once. Each click recomputes
       offset relative to current range.days so the step matches
       the visible window. Bounded by drawChartNow's own clamp.
       Plus close-X on the flag preview panel. */
    const range_ = () => (RANGES.find(r => r.key === state.range) || RANGES[2]);
    root.addEventListener('click', (ev) => {
      const closeBtn = ev.target.closest('[data-flag-close]');
      if (closeBtn){
        const previewEl = qs('[data-flag-preview]', root);
        if (previewEl){ previewEl.hidden = true; previewEl.innerHTML = ''; }
        ev.preventDefault();
        return;
      }
      const panBtn = ev.target.closest('[data-pan]');
      if (!panBtn) return;
      const cmd = panBtn.dataset.pan;
      const step = range_().days;
      if      (cmd === 'back')  chartOffset += step;
      else if (cmd === 'fwd')   chartOffset = Math.max(0, chartOffset - step);
      else if (cmd === 'today') chartOffset = 0;
      drawChartNow();
    });
  }

  /* Minimal HTML-attribute escape for the tooltip strings. The
     annotation data comes from local SUBNETS-keyed files so it's
     trusted, but we escape at the boundary anyway per Code
     Quality Bar rule 5 (validate at boundaries even when sources
     are trusted). */
  function escapeAttr(v){
    return String(v == null ? '' : v)
      .replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
      .replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* Live data subscription (TaoMarketcap via DataLayer). When the
     'tao:subnets' channel emits a fresh batch, mutate matching
     SUBNETS rows in place so the per-subnet price / 24h % /
     mcap / miners / validators / emission update immediately.
     Repaint the chart pane to reflect the live numbers. The
     synthetic price series is also regenerated for the active
     subnet so the chart anchors on the latest mark.

     Rondo 2026-05-18: "pull api data from tao stats and tao
     marketcap." DataLayer.start() in boot.js already begins
     polling both APIs; this hook is the cockpit's read side. */
  const liveUnsubs = [];
  if (dataLayer && typeof dataLayer.subscribe === 'function'){
    const onLiveSubnets = (listRaw) => {
      if (!Array.isArray(listRaw) || !listRaw.length) return;
      isLive = true;
      let touched = false;
      listRaw.forEach(live => {
        if (live == null || live.netuid == null) return;
        const local = subnetById(live.netuid);
        if (!local) return;
        /* Map TMC live fields onto the SUBNETS row. Field names
           per layer.js mapping (refreshSubnets). */
        if (Number.isFinite(live.price))       { local.price = live.price; touched = true; }
        if (Number.isFinite(live.chg24h))      local.chg24 = live.chg24h;
        if (Number.isFinite(live.chg7d))       local.chg7  = live.chg7d;
        if (Number.isFinite(live.chg30d))      local.chg30 = live.chg30d;
        if (Number.isFinite(live.mcap_alpha))  local.mcap = live.mcap_alpha;
        if (Number.isFinite(live.emission))    local.emission = live.emission;
        if (Number.isFinite(live.miners))      local.miners = live.miners;
        if (Number.isFinite(live.validators))  local.validators = live.validators;
      });
      if (touched){
        const cur = subnetById(state.selectedId);
        if (cur) series = generateSeries(cur);
        repaintMain();
      }
    };
    liveUnsubs.push(dataLayer.subscribe('tao:subnets', onLiveSubnets));
    const cachedSubnets = dataLayer.get && dataLayer.get('tao:subnets');
    if (cachedSubnets) onLiveSubnets(cachedSubnets);

    /* CHART SIDEBAR — NETWORK VITALS live wiring. The vital cells
       render with "·" placeholders; setLive flashes the value on
       change so the column reads as a live ticker. tao:market
       carries TAO/USD price + delta + mcap + block height +
       stakedPct; tao:chain carries the network's emission rate. */
    const setVital = (key, text) => {
      const el = qs(`[data-vital="${key}"]`, root);
      if (!el) return;
      if (typeof setLive === 'function') setLive(el, text);
      else el.textContent = text;
    };
    const onLiveMarket = (m) => {
      if (!m || typeof m !== 'object') return;
      if (Number.isFinite(m.price))      setVital('tao-price', '$' + m.price.toFixed(2));
      if (Number.isFinite(m.change24h))  setVital('tao-chg24', (m.change24h >= 0 ? '+' : '') + m.change24h.toFixed(2) + '%');
      if (Number.isFinite(m.marketCap))  setVital('tao-mcap',  '$' + (m.marketCap >= 1e9 ? (m.marketCap/1e9).toFixed(2) + 'B' : (m.marketCap/1e6).toFixed(1) + 'M'));
      if (Number.isFinite(m.blockNumber)) setVital('tao-block', '#' + m.blockNumber.toLocaleString('en-US'));
      if (Number.isFinite(m.stakedPct))  setVital('tao-staked', m.stakedPct.toFixed(2) + '%');
      const chgEl = qs('[data-vital="tao-chg24"]', root);
      if (chgEl && Number.isFinite(m.change24h)){
        chgEl.classList.toggle('is-up',   m.change24h > 0);
        chgEl.classList.toggle('is-down', m.change24h < 0);
        chgEl.classList.toggle('is-flat', m.change24h === 0);
      }
    };
    liveUnsubs.push(dataLayer.subscribe('tao:market', onLiveMarket));
    const cachedMarket = dataLayer.get && dataLayer.get('tao:market');
    if (cachedMarket) onLiveMarket(cachedMarket);

    const onLiveChain = (c) => {
      if (!c || typeof c !== 'object') return;
      /* totalIssuance ~= daily-emission proxy across all subnets;
         layer.js exposes it on tao:chain. Round to nearest int
         for the τ/d display register. */
      if (Number.isFinite(c.totalIssuance)) setVital('tao-emit', Math.round(c.totalIssuance).toLocaleString('en-US'));
      if (Number.isFinite(c.blockNumber)  && !qs('[data-vital="tao-block"]', root)?.textContent?.startsWith('#')) {
        setVital('tao-block', '#' + c.blockNumber.toLocaleString('en-US'));
      }
    };
    liveUnsubs.push(dataLayer.subscribe('tao:chain', onLiveChain));
    const cachedChain = dataLayer.get && dataLayer.get('tao:chain');
    if (cachedChain) onLiveChain(cachedChain);
  }

  return () => {
    liveUnsubs.splice(0).forEach(u => { try { u(); } catch (_) {} });
    /* Tear down the TradingView chart instance + its ResizeObserver
       so a remount doesn't leak the prior chart. */
    if (tvResizeObserver) { try { tvResizeObserver.disconnect(); } catch (_) {} tvResizeObserver = null; }
    if (tvChart) { try { tvChart.remove(); } catch (_) {} tvChart = null; }
    tvAreaSeries = null;
    tvMa20Series = null;
    tvMa50Series = null;
    tvVolumeSeries = null;
  };
}
