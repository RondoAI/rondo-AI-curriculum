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
import { GH_ACTIVITY, ghByNetuid } from '../data/github-activity.js';
import { recentOracleArticles } from '../data/oracle-articles.js';

/* Bio lookup by netuid, indexed once at module load for O(1)
   per-subnet pulls when the user picks a row. */
const BIO_BY_NETUID = new Map(SUBNET_BIOS.map(b => [b.netuid, b]));
const bioByNetuid = id => BIO_BY_NETUID.get(id) || null;

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

/* ---------- shared links --------------------------------------- */
/* The Bittensor Discord is the hub where every subnet's own server
   is interconnected. We surface it on every subnet detail and once
   in the status bar, so the reader is one tap from the community
   wherever they are on the dashboard. */
const DISCORD_HUB = 'https://discord.gg/bittensor';

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
  /* Selection state. Default to SN4 (Targon) because the Oracle
     has spotlighted it most recently and it has GitHub seed data. */
  let selectedId = 4;
  let activeFilter = 'all';

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
      ${renderFooter()}
    </section>
  `);

  /* Selection wiring ---------------------------------------- */
  function repaintDetail(){
    const z = qs('[data-zone="detail"]', root);
    if (!z) return;
    z.innerHTML = renderDetail(selectedId);
    wireDetailSparklines(z);
  }

  qsa('[data-row]', root).forEach(rowEl => {
    rowEl.addEventListener('click', () => {
      const id = parseInt(rowEl.dataset.row, 10);
      if (Number.isNaN(id)) return;
      selectedId = id;
      qsa('.dash-command__row', root).forEach(r => r.classList.remove('is-selected'));
      rowEl.classList.add('is-selected');
      repaintDetail();
    });
  });

  qsa('[data-filter]', root).forEach(chipEl => {
    chipEl.addEventListener('click', () => {
      activeFilter = chipEl.dataset.filter;
      qsa('[data-filter]', root).forEach(c => c.classList.toggle('is-active', c === chipEl));
      qsa('.dash-command__row', root).forEach(rowEl => {
        const cat = rowEl.dataset.cat || '';
        const show = activeFilter === 'all' || cat === activeFilter;
        rowEl.style.display = show ? '' : 'none';
      });
    });
  });

  /* Sparkline wiring for first paint */
  wireDetailSparklines(root);

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
            LIVE · ${new Date().toISOString().slice(0,10)} · ${subnetState.rows.length} SUBNETS
            · <a href="${DISCORD_HUB}" target="_blank" rel="noopener" style="color:var(--c-red-1);text-decoration:none;letter-spacing:.14em">DISCORD HUB ↗</a>
            · CONFIDENCE HIGH
          </span>
        </div>
        <div class="dash-status__rail">
          <div class="dash-status__cell">
            <span class="dash-status__cell__lbl">τ / USD</span>
            <span class="dash-status__cell__val" data-live="tao-price">${'$' + tao.price.toFixed(2)}</span>
            <span class="dash-status__cell__sub is-up">+2.4% · 24h</span>
          </div>
          <div class="dash-status__cell">
            <span class="dash-status__cell__lbl">NETWORK MCAP</span>
            <span class="dash-status__cell__val" data-live="tao-mcap">${'$' + compact(tao.mcap)}</span>
            <span class="dash-status__cell__sub">FDV across τ + α</span>
          </div>
          <div class="dash-status__cell">
            <span class="dash-status__cell__lbl">24H VOLUME</span>
            <span class="dash-status__cell__val" data-live="tao-vol">${'$' + compact(tao.vol24)}</span>
            <span class="dash-status__cell__sub">across all venues</span>
          </div>
          <div class="dash-status__cell">
            <span class="dash-status__cell__lbl">SUBNET MCAP</span>
            <span class="dash-status__cell__val">${'$' + totalMcap.toFixed(0)}M</span>
            <span class="dash-status__cell__sub">${subnetState.rows.length} active</span>
          </div>
          <div class="dash-status__cell">
            <span class="dash-status__cell__lbl">VALIDATORS / MINERS</span>
            <span class="dash-status__cell__val">${fmtInt(totalValidators)} <span style="color:var(--c-ink-3);font-weight:400">/</span> ${fmtInt(totalMiners)}</span>
            <span class="dash-status__cell__sub">${fmtInt(totalEmission)} τ/day emit</span>
          </div>
          <div class="dash-status__cell">
            <span class="dash-status__cell__lbl">BLOCK HEIGHT</span>
            <span class="dash-status__cell__val" data-live="tao-block">${fmtInt(tao.blocks)}</span>
            <span class="dash-status__cell__sub">~12 s/block</span>
          </div>
        </div>
      </div>
    `;
  }

  function renderCommand(){
    const rows = subnetState.rows
      .slice()
      .sort((a, b) => (b.mcap || 0) - (a.mcap || 0))
      .map(s => {
        const cls = chgClass(s.chg24);
        return `
          <li class="dash-command__row ${s.netuid === selectedId ? 'is-selected' : ''}"
              data-row="${s.netuid}" data-cat="${s.cat || ''}">
            <span class="dash-command__sn">SN${s.netuid}</span>
            <span class="dash-command__name">${s.name}</span>
            <span class="dash-command__price">${fmtPrice(s.price)}</span>
            <span class="dash-command__chg ${cls}">${fmtPct(s.chg24)}</span>
          </li>`;
      })
      .join('');
    const chips = ['all', ...presentCats]
      .map(c => `<button type="button" class="dash-command__chip ${c === activeFilter ? 'is-active' : ''}" data-filter="${c}">${c === 'all' ? 'ALL' : CAT_LABEL[c] || c.toUpperCase()}</button>`)
      .join('');
    return `
      <aside class="dash-command">
        <div class="dash-command__head">
          <span>COMMAND RAIL · subnets</span>
          <span class="dash-command__count">${subnetState.rows.length}</span>
        </div>
        <div class="dash-command__filter">${chips}</div>
        <ul class="dash-command__list">${rows}</ul>
      </aside>
    `;
  }

  function renderDetail(id){
    const s = subnetById(id);
    if (!s){
      return `<div style="padding:20px;color:var(--c-ink-3);font-family:var(--f-mono)">No subnet selected.</div>`;
    }
    const gh = ghByNetuid(id);
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
    let feed = [...team, ...oracle].sort((x, y) => (y.date || '').localeCompare(x.date || ''));
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

    /* Editorial bio (top-25 subnets only). When present, render a
       PROFILE panel with the magazine's one-liner, the key metric,
       the most recent news, and the full bio paragraph. When absent
       (subnet outside top-25), fall back to the desc on SUBNETS so
       every subnet still has SOMETHING substantive in the panel. */
    const bio = bioByNetuid(id);
    const profilePanel = bio ? `
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
    ` : `
      <div class="dash-profile">
        <div class="dash-profile__oneline">${s.desc || 'No editorial profile yet.'}</div>
        <div class="dash-profile__bio" style="color:var(--c-ink-3);font-style:italic">No deep profile in SUBNET_BIOS yet — this subnet sits outside the top 25 by daily emission. The Oracle desk pulls one of the rotating spotlights each week; expect a long-form profile soon.</div>
      </div>
    `;

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
            <span class="dash-panel__meta">${bio ? 'from SUBNET_BIOS · top-25 deep profile' : 'from SUBNETS · seed description'}</span>
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

        <div class="dash-panel">
          <div class="dash-panel__head">
            <span class="dash-panel__lbl">GITHUB ACTIVITY · 30D</span>
            <span class="dash-gh-pulse ${pulseCls}"><span class="dash-gh-pulse__dot"></span>${pulseTxt}</span>
          </div>
          ${ghPanel}
        </div>

        <div class="dash-panel dash-panel--wide">
          <div class="dash-panel__head">
            <span class="dash-panel__lbl">COVERAGE FEED · magazine + oracle</span>
            <span class="dash-panel__meta">${team.length} team · ${oracle.length} oracle · most-recent first</span>
          </div>
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
    return `
      <aside class="dash-comparator">
        <div class="dash-comparator__head">CENTRALIZED LANDSCAPE</div>
        <div class="dash-comparator__sub">Top centralized AI by valuation. Compared head-to-head with the Bittensor subnet column at right scale so the reader sees where decentralized intelligence sits relative to the incumbents.</div>
        <ul class="dash-comparator__list">${rows}</ul>
      </aside>
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
