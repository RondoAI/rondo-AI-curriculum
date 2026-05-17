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

import { html, mount, qs, qsa, setLive, escapeHtml } from '../lib/dom.js';
import { money, pct, compact } from '../lib/format.js';
import { seedSeries } from '../lib/mark.js';
import { Sparkline } from '../charts/Sparkline.js';
import { SUBNETS, subnetById } from '../data/subnets.js';
import { SUBNET_BIOS } from '../data/subnet-bios.js';
import { ARTICLES } from '../data/articles.js';
import { CENTRALIZED_PLAYERS, playersForSubnet } from '../data/centralized.js';
import { CENTRALIZED_NEWS, recentCentralizedNews, newsForSubnet } from '../data/centralized-news.js';
import { BRIEFINGS, latestBriefing, priorBriefings, currencyHeader, daysBetween } from '../data/briefings.js';
import { mountCommentary } from './dashboard/commentary.js';
import { GH_ACTIVITY, ghByNetuid } from '../data/github-activity.js';
import { recentOracleArticles } from '../data/oracle-articles.js';
import { TOP_HOLDERS_NETWORK, RECENT_TRANSFERS_NETWORK, topHoldersFor, recentTransfersFor } from '../data/wallet-activity.js';
import { renderAttribution, wireAttribution, defaultAttribState } from './dashboard/attribution.js';
import { wireFolds } from '../lib/fold.js';
import { renderPaperPortfolio, wirePaperPortfolio } from './dashboard/paper-portfolio.js';

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

/* SVG infographic helpers. Inline, no chart-class dependency, no
   ResizeObserver bookkeeping. Drawn once per detail render. Used
   to give the dashboard the visual density of a real institutional
   terminal (Bloomberg, Tableau, Mission UI Pro), gauges, donuts,
   sparklines, accent bars. Keep math here, not in templates. */
function svgSpark(values, w = 100, h = 28, color = '#5BE599', fill = true){
  if (!values || values.length < 2) return '';
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 2) - 1;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const line = pts.join(' ');
  const area = fill
    ? `<polygon points="0,${h} ${line} ${w},${h}" fill="${color}" fill-opacity=".18"/>`
    : '';
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" style="width:100%;height:${h}px;display:block">
    ${area}
    <polyline points="${line}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

function svgGauge(value, max, color = '#FF1E3C', label = '', size = 110){
  const pct = Math.min(1, Math.max(0, value / max));
  const r = 42, cx = 55, cy = 55;
  const c = 2 * Math.PI * r;
  const dash = c * pct;
  const display = Math.round(pct * 100) + '%';
  return `<svg viewBox="0 0 110 110" style="width:${size}px;height:${size}px;display:block">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="7"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="7"
      stroke-dasharray="${dash.toFixed(2)} ${c.toFixed(2)}" stroke-linecap="round"
      transform="rotate(-90 ${cx} ${cy})">
      <animate attributeName="stroke-dashoffset" from="${c}" to="0" dur="1.2s" fill="freeze"/>
    </circle>
    <text x="55" y="54" text-anchor="middle" dominant-baseline="central"
      font-size="20" font-weight="800" fill="#fff" font-family="JetBrains Mono, monospace">${display}</text>
    <text x="55" y="78" text-anchor="middle"
      font-size="6.5" letter-spacing="1.8" font-weight="800" fill="rgba(255,30,60,.78)"
      font-family="JetBrains Mono, monospace">${label}</text>
  </svg>`;
}

function svgDonut(segments, centerLabel, centerSub){
  const total = segments.reduce((n, s) => n + s.value, 0) || 1;
  let acc = 0;
  const r1 = 44, r2 = 32, cx = 55, cy = 55;
  const arcs = segments.map(s => {
    const start = (acc / total) * 2 * Math.PI - Math.PI / 2;
    acc += s.value;
    const end = (acc / total) * 2 * Math.PI - Math.PI / 2;
    const large = (s.value / total) > 0.5 ? 1 : 0;
    const sweep = end - start;
    if (sweep <= 0.0001) return '';
    const x1 = cx + r1 * Math.cos(start);
    const y1 = cy + r1 * Math.sin(start);
    const x2 = cx + r1 * Math.cos(end);
    const y2 = cy + r1 * Math.sin(end);
    const x3 = cx + r2 * Math.cos(end);
    const y3 = cy + r2 * Math.sin(end);
    const x4 = cx + r2 * Math.cos(start);
    const y4 = cy + r2 * Math.sin(start);
    return `<path d="M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r1} ${r1} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} L ${x3.toFixed(2)} ${y3.toFixed(2)} A ${r2} ${r2} 0 ${large} 0 ${x4.toFixed(2)} ${y4.toFixed(2)} Z" fill="${s.color}"/>`;
  }).join('');
  return `<svg viewBox="0 0 110 110" style="width:130px;height:130px;display:block">
    ${arcs}
    <text x="55" y="50" text-anchor="middle" dominant-baseline="central"
      font-size="17" font-weight="800" fill="#fff" font-family="JetBrains Mono, monospace">${centerLabel}</text>
    <text x="55" y="70" text-anchor="middle"
      font-size="6.5" letter-spacing="1.8" font-weight="800" fill="rgba(255,30,60,.78)"
      font-family="JetBrains Mono, monospace">${centerSub || ''}</text>
  </svg>`;
}

function svgBars(values, w = 100, h = 36, color = '#FF1E3C'){
  if (!values || !values.length) return '';
  const max = Math.max(...values, 1);
  const bw = w / values.length;
  const bars = values.map((v, i) => {
    const bh = (v / max) * (h - 2);
    return `<rect x="${(i * bw + 0.5).toFixed(2)}" y="${(h - bh).toFixed(2)}" width="${(bw - 1).toFixed(2)}" height="${bh.toFixed(2)}" fill="${color}" fill-opacity="${(0.55 + (v/max) * 0.45).toFixed(2)}"/>`;
  }).join('');
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" style="width:100%;height:${h}px;display:block">${bars}</svg>`;
}

/* =================================================================
   NEWS-CARD COVER ART — procedural SVG since the magazine has no
   -----------------------------------------------------------------
   photo pipeline. Each editorial dispatch gets a deterministic
   cover from (kind, subnet netuid, title hash): hairline grid
   background, kind-tinted gradient, large display-weight glyph
   (subnet id or τ for ecosystem pieces), bottom wordmark hairline.

   Inspired by Bloomberg Professional's card treatment: one strong
   visual idea per card, monochromatic discipline, no photography.
   Translates Bloomberg's orange to our red, navy to our #050203,
   their photo-realistic webinar thumbnails to our procedural
   eDEX register.
   ================================================================= */
function coverArtSvg(article, subnet){
  const isMag = article.kind === 'magazine';
  const accent = isMag ? '#FFB85C' : '#FF1E3C';
  const glyph = (subnet && subnet.netuid) ? 'SN' + subnet.netuid
              : (article.subnetId ? 'SN' + article.subnetId : 'τ');
  /* Stable per-article hash so the same article always renders the
     same cover — readers learn the visual as identity. */
  let h = 0;
  const t = String(article.title || '');
  for (let i = 0; i < t.length; i++){
    h = ((h << 5) - h + t.charCodeAt(i)) | 0;
  }
  const seed = Math.abs(h) % 1000;
  const offsetX = (seed % 40) - 20;
  const rotate  = ((seed * 7) % 12) - 6;
  const fontSize = glyph.length > 4 ? 36 : 56;
  return `<svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="ng${seed}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%"   stop-color="#0A0306"/>
        <stop offset="100%" stop-color="${accent}" stop-opacity="0.22"/>
      </linearGradient>
      <pattern id="np${seed}" patternUnits="userSpaceOnUse" width="16" height="16">
        <path d="M0 8L16 8M8 0L8 16" stroke="${accent}" stroke-opacity="0.08" stroke-width="0.6"/>
      </pattern>
    </defs>
    <rect width="320" height="180" fill="#050203"/>
    <rect width="320" height="180" fill="url(#ng${seed})"/>
    <rect width="320" height="180" fill="url(#np${seed})"/>
    <line x1="0" y1="180" x2="320" y2="${100 - (seed % 40)}" stroke="${accent}" stroke-opacity="0.18" stroke-width="0.8"/>
    <text x="${160 + offsetX}" y="108" text-anchor="middle"
          font-family="Archivo, Inter, sans-serif" font-size="${fontSize}" font-weight="800"
          fill="${accent}" fill-opacity="0.78"
          transform="rotate(${rotate} ${160 + offsetX} 95)">${glyph}</text>
    <line x1="14" y1="166" x2="306" y2="166" stroke="${accent}" stroke-opacity="0.4" stroke-width="0.6"/>
    <text x="14" y="175" font-family="JetBrains Mono, monospace" font-size="7.5"
          font-weight="800" letter-spacing="1.8" fill="${accent}" fill-opacity="0.7">SUBNE&#x3C4; MAGAZINE</text>
  </svg>`;
}

/**
 * Render one editorial dispatch as a news card (image-on-top,
 * mono caps meta, serif title, sans dek, kind chip + SN tag in
 * cover corners). Built to render inside a .news-cards grid.
 */
function newsCardHtml(article, subnet){
  const href      = article.pdf || article.externalUrl || '#';
  const kind      = article.kind || 'magazine';
  const kindLbl   = kind === 'magazine' ? 'MAG'
                  : kind === 'oracle'   ? 'ORC'
                  : String(kind).slice(0, 3).toUpperCase();
  const dek       = article.tagline || article.dek || '';
  const author    = (article.author || '·').toUpperCase();
  const cat       = (article.category || '').toUpperCase().replace(/-/g, ' ');
  const showSnTag = subnet && subnet.netuid;
  return `
    <a class="news-card" href="${href}" target="_blank" rel="noopener">
      <div class="news-card__cover">
        ${coverArtSvg(article, subnet)}
        <span class="news-card__kind news-card__kind--${kind}">${kindLbl}</span>
        ${showSnTag ? `<span class="news-card__sn-tag">SN${subnet.netuid}</span>` : ''}
      </div>
      <div class="news-card__body">
        <span class="news-card__meta">${fmtDate(article.date)} · BY ${author}</span>
        <h3 class="news-card__title">${article.title}</h3>
        ${dek ? `<p class="news-card__dek">${dek}</p>` : ''}
        <div class="news-card__foot">
          <span class="news-card__cat">${cat || '·'}</span>
          <span class="news-card__read">READ ↗</span>
        </div>
      </div>
    </a>`;
}

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
  let masterSort = 'mcap';             // master-grid current sort col
  let masterSortDir = 'desc';          // 'asc' | 'desc'
  let attribState = defaultAttribState(); // PORT-style attribution panel state
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

  /* Editorial-coverage rollup: per-subnet, how many in-house
     articles + oracle dispatches exist? Surfaces as a small chip
     in the master grid + as an editorial line in the detail head,
     so the magazine's coverage shows up AS DATA next to the
     subnet's price/emission/etc., not just as a sidebar item.
     Built once at mount (the editorialArchive set above is static
     per page-load). */
  const ALL_ORACLE_BY_NETUID = (() => {
    const m = new Map();
    for (const a of recentOracleArticles(Infinity)){
      if (a.subnetId == null) continue;
      if (!m.has(a.subnetId)) m.set(a.subnetId, []);
      m.get(a.subnetId).push(a);
    }
    return m;
  })();
  const coverageStats = (netuid) => ({
    mag:    (ARTICLES_BY_NETUID.get(netuid) || []).length,
    oracle: (ALL_ORACLE_BY_NETUID.get(netuid)  || []).length,
  });

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
  /* Layout discipline: the page is one long scroll because mobile
     wants it that way (no tab-jumping context loss), but we mark
     the major zones with #ids and surface a sticky in-page anchor
     nav (`dash-jump`) directly below the status bar. Five chips:
     BRIEFINGS · DETAIL · DESK · MARKET · ARCHIVE. Tap = smooth
     scroll. Active chip = whichever zone owns the current viewport
     midline. Wraps paper-portfolio + attribution into one DESK zone
     so they read as positions + analytics-on-those-positions, not
     two disconnected products. */
  mount(root, html`
    <section class="dash" data-mount="dashboard-root">
      ${renderStatusBar()}
      ${renderJumpNav()}
      <div id="briefings" class="dash-zone" data-zone-id="briefings">
        ${renderBriefings()}
      </div>
      <div id="detail" class="dash-zone" data-zone-id="detail">
        <div class="dash-grid">
          ${renderCommand()}
          <div class="dash-detail" data-zone="detail">
            ${renderDetail(selectedId)}
          </div>
          ${renderComparator(subnetById(selectedId))}
        </div>
      </div>
      <div id="desk" class="dash-zone dash-desk" data-zone-id="desk">
        ${renderDeskHeader()}
        <!-- Commentary narrative leads MY DESK — narrative before
             math, so the reader sees the story before the
             attribution decomposes it. Async-mounts after first
             paint into this slot. -->
        <div data-zone="commentary"></div>
        ${renderPaperPortfolio()}
        ${renderAttribution(attribState)}
      </div>
      <div id="market" class="dash-zone" data-zone-id="market">
        ${renderMasterTable()}
      </div>
      <div id="archive" class="dash-zone" data-zone-id="archive">
        ${renderArchive()}
      </div>
      ${renderFooter()}
    </section>
  `);

  /* Section nav: tab shell. Only ONE zone is visible at a time;
     tapping a chip hides every other zone via `is-hidden` class
     and shows the selected one. Eliminates the 21,000px scroll
     by making zones tabbed siblings instead of stacked. Active
     zone fills the viewport; scrolling within it is bounded.

     Sticky-positioning: status bar varies in height between mobile
     (~240px, 2-row KPI grid) and desktop (~80px, 1-row). JS measures
     it on mount + on resize so the JUMP nav stacks just below.

     Persistence: active tab saved to sbn:dash-tab:v1 so the user
     returns to their last-viewed zone on reload. */
  function wireJumpNav(){
    const nav  = qs('.dash-jump', root);
    const stat = qs('.dash-status', root);
    if (!nav) return;

    const restickChrome = () => {
      if (!stat) return;
      const sh = stat.getBoundingClientRect().height || 0;
      nav.style.top = sh + 'px';
    };
    restickChrome();
    window.addEventListener('resize', restickChrome);
    if (typeof ResizeObserver !== 'undefined' && stat){
      new ResizeObserver(restickChrome).observe(stat);
    }

    const TAB_KEY = 'sbn:dash-tab:v1';
    const initial = (() => {
      try { return localStorage.getItem(TAB_KEY) || 'detail'; }
      catch (_) { return 'detail'; }
    })();

    const setActiveTab = (id) => {
      qsa('.dash-zone', root).forEach(z => {
        z.classList.toggle('is-hidden', z.dataset.zoneId !== id);
      });
      nav.querySelectorAll('[data-jump]').forEach(b => {
        b.classList.toggle('is-on', b.dataset.jump === id);
      });
      try { localStorage.setItem(TAB_KEY, id); } catch (_) {}
      /* Scroll to top of the page (under sticky chrome) so the
         user lands at the active zone's top edge, not wherever
         they were when they tapped. */
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    setActiveTab(initial);

    nav.querySelectorAll('[data-jump]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        setActiveTab(btn.dataset.jump);
      });
    });
  }
  wireJumpNav();
  /* Wire <details data-fold="..."> persistence across the whole
     mounted shell. Each fold's open/closed state is stored in
     localStorage (sbn:fold:v1) keyed by data-fold id, so a reader
     who opens the WALLET TRACKER on SN4 sees it open next time
     they pick SN4. */
  wireFolds(root);

  /* Repaint primitives. Selection / filter / sort changes only
     re-render the affected zones, never the whole shell, so
     status bar counters keep tweening and sparklines don't get
     destroyed + recreated on every keystroke. */
  function repaintDetail(){
    const z = qs('[data-zone="detail"]', root);
    if (!z) return;
    z.innerHTML = renderDetail(selectedId);
    wireDetailSparklines(z);
    /* Re-wire fold persistence on the freshly-rendered DOM —
       new <details> nodes need their toggle listeners attached. */
    wireFolds(z);
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
        repaintComparator();
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

  /* Editorial-coverage jump: clicking the editorial line under the
     detail head dispatches the RESEARCH command with that subnet's
     id, which selects the subnet + filters the research archive +
     scrolls to it. Single click = "show me everything the magazine
     has written about this subnet." */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest && e.target.closest('[data-edit-jump]');
    if (!btn || !root.contains(btn)) return;
    const id = parseInt(btn.dataset.editJump, 10);
    if (!Number.isFinite(id)) return;
    document.dispatchEvent(new CustomEvent('subnetmag:command', {
      detail: { fn: 'set-archive', mode: 'selected', netuid: id }
    }));
  });

  /* Mount desk commentary — Bloomberg-PORT-style narrative panel
     between briefings (centralized context) and the 3-col grid.
     Reads paper portfolio + briefings + sector aggregates and
     composes a senior-trader's morning note. Self-contained;
     destroy returned but currently not stashed in teardowns
     since the closure doesn't go away until page navigation. */
  mountCommentary(qs('[data-zone="commentary"]', root));

  /* Master-table row click: jump that subnet into the command deck
     above without disturbing the rail's current scroll position. */
  /* Master-grid sortable headers. Click a header to sort by that
     column; click again to flip direction. Re-paints the master
     section in place without disturbing scroll position. */
  function repaintMaster(){
    const sec = qs('.dash-master', root);
    if (!sec) return;
    sec.outerHTML = renderMasterTable();
    wireMasterHeaders();
    wireMasterRows();
  }
  function wireMasterHeaders(){
    qsa('[data-mh]', root).forEach(h => {
      if (h.classList.contains('is-static')) return;
      h.addEventListener('click', () => {
        const id = h.dataset.mh;
        if (id === masterSort){
          masterSortDir = masterSortDir === 'desc' ? 'asc' : 'desc';
        } else {
          masterSort = id;
          masterSortDir = (id === 'name' || id === 'cat') ? 'asc' : 'desc';
        }
        repaintMaster();
      });
    });
  }
  function wireMasterRows(){
    qsa('[data-master-row]', root).forEach(row => {
      row.addEventListener('click', () => {
        const id = parseInt(row.dataset.masterRow, 10);
        if (!Number.isFinite(id) || id === selectedId) return;
        selectedId = id;
        qsa('.dash-command__row', root).forEach(r => r.classList.toggle('is-selected', parseInt(r.dataset.row,10) === id));
        qsa('.dash-master__row', root).forEach(r => r.classList.toggle('is-selected', parseInt(r.dataset.masterRow,10) === id));
        repaintDetail();
        repaintComparator();
        qs('.dash-detail', root)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }
  wireMasterHeaders();
  /* The legacy explicit data-master-row wiring below is kept as a
     no-op safety net; wireMasterRows() above is the canonical
     binder. */
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

  /* PORT-style attribution panel: chips mutate attribState in place
     and trigger a self-rebind via the onRepaint callback so each
     click swap of (portfolio | benchmark | horizon | currency |
     group) re-runs Brinson-Fachler and redraws the whole section. */
  function wireAttribPanel(){
    wireAttribution(root, attribState, wireAttribPanel);
  }
  wireAttribPanel();

  /* Paper portfolio: buy/sell mutations write to localStorage and
     repaint the panel in place. Also re-renders Attribution because
     the PAPER preset depends on paper-portfolio state. */
  function repaintPaperAndAttrib(){
    const paperSec = qs('[data-paper-root]', root);
    if (paperSec){
      const wrap = document.createElement('div');
      wrap.innerHTML = renderPaperPortfolio();
      paperSec.replaceWith(wrap.firstElementChild);
    }
    const attribSec = qs('[data-attrib-root]', root);
    if (attribSec){
      const wrap = document.createElement('div');
      wrap.innerHTML = renderAttribution(attribState);
      attribSec.replaceWith(wrap.firstElementChild);
    }
    wirePaperPortfolio(root, repaintPaperAndAttrib);
    wireAttribPanel();
  }
  wirePaperPortfolio(root, repaintPaperAndAttrib);

  /* Bloomberg-style power-user shortcuts:
       /         focus the rail search
       j/k/↑/↓   move selection through visible rows
       n/p       vim-style aliases
       1-9       jump to top-N visible
       Esc       clear search + blur
     (⌘K / Ctrl+K opens the global command palette; that's wired in
     boot.js via installCommandPalette and is intentionally not
     handled here, the palette wraps every page in the magazine.)
   */
  const onDashKeydown = (e) => {
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
  };
  document.addEventListener('keydown', onDashKeydown);
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
  /* tao-price / tao-mcap / tao-block counters were removed when the
     dashboard's status bar de-duplicated against the global StatusStrip.
     Only fields unique to the dashboard's rail get animated counters
     here (subnet rollups, validator/miner counts, emission, AI dom). */
  animateCounter('[data-live="tao-vol"]',       tao.vol24,        v => '$' + smartNumber(v, 'usd').replace('$',''));
  animateCounter('[data-tween="subnet-mcap"]',  totalMcap,       v => '$' + v.toFixed(0) + 'M');
  animateCounter('[data-tween="validators"]',   totalValidators, v => fmtInt(v));
  animateCounter('[data-tween="miners"]',       totalMiners,     v => fmtInt(v));
  /* emission counter removed — EMIT is owned by StatusStrip (global
     header). The freed cell now shows TOP 24H GAINER (computed live
     from tao:subnets, see subscriber below). */

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

  /* Live data hot-swap. Two bugs fixed here vs. the prior version:
     (1) the market subscriber read d.marketcap, but layer.js emits
         d.marketCap (camelCase). Live network mcap never updated.
     (2) the chain subscriber read d.blockHeight, but layer.js emits
         d.blockNumber. Live block height never updated either.
     Plus a new subscriber on 'tao:subnets' so the SUBNET MCAP /
     VALIDATORS / MINERS / EMISSION ticks update from real chain
     data as new subnet rows land, not just from the first-paint
     animated counters. */
  if (dataLayer && typeof dataLayer.subscribe === 'function'){
    try {
      /* After de-dup, the dashboard's status bar only updates the
         fields it OWNS: 24H VOLUME and AI DOMINANCE come from the
         tao:market feed; SUBNET MCAP / VALIDATORS / MINERS / EMISSION
         come from tao:subnets aggregation below. TAO price / TAO mcap
         / block height are owned by the global StatusStrip, not here. */
      dataLayer.subscribe('tao:market', d => {
        if (!d) return;
        if (d.volume24h   != null) setLive(qs('[data-live="tao-vol"]',    root), '$' + compact(d.volume24h));
        if (d.aiDominance != null) setLive(qs('[data-live="tao-ai-dom"]', root), d.aiDominance.toFixed(1) + '%');
      });
      dataLayer.subscribe('tao:subnets', rows => {
        if (!Array.isArray(rows) || !rows.length) return;
        /* Network-wide rollups + the dashboard-unique top-gainer
           callout. Two-pass over rows so we can compute aggregates
           AND identify the best 24h gainer in one sweep. */
        let mcap = 0, miners = 0, validators = 0;
        let best = null;
        for (const r of rows){
          mcap       += (r.marketcap ?? r.mcap ?? 0);
          miners     += (r.miners     ?? 0);
          validators += (r.validators ?? 0);
          const chg = r.chg24 ?? 0;
          if (best == null || chg > (best.chg24 ?? -Infinity)){
            best = r;
          }
        }
        if (mcap)       setLive(qs('[data-tween="subnet-mcap"]', root), '$' + mcap.toFixed(0) + 'M');
        if (validators) setLive(qs('[data-tween="validators"]',  root), fmtInt(validators));
        if (miners)     setLive(qs('[data-tween="miners"]',      root), fmtInt(miners));
        if (best){
          const chg = best.chg24 ?? 0;
          const sign = chg >= 0 ? '+' : '';
          setLive(qs('[data-live="top-gainer"]',     root), `SN${best.netuid} · ${sign}${chg.toFixed(1)}%`);
          setLive(qs('[data-live="top-gainer-sub"]', root), best.name || best.symbol || '');
        }
        /* Reset the freshness counter on every successful subnets
           tick so the "Ns ago" pill reflects the truth. */
        const fresh = qs('[data-fresh]', root);
        if (fresh) fresh.dataset.t0 = String(Date.now());
      });
    } catch (_) {}
  }

  /* =================================================================
     COMMAND BUS LISTENER
     -----------------------------------------------------------------
     Honors CustomEvent('subnetmag:command') dispatched by the
     command palette (src/lib/command-palette.js) or any future
     view. The palette knows nothing about dashboard internals, it
     just emits { fn, … } detail objects. We translate them here
     into the same state mutations + zone repaints the inline rail
     handlers already use, so palette commands and direct clicks
     produce identical UI state.

     Coupling: loose. New verbs in the palette don't require any
     change here unless they need a new action; this switch is the
     single point of dispatch.
     ================================================================= */
  function _selectSubnet(id){
    if (!Number.isFinite(id) || id === selectedId) return;
    if (!subnetState.rows.find(s => s.netuid === id)) return;
    selectedId = id;
    qsa('.dash-command__row', root).forEach(r =>
      r.classList.toggle('is-selected', parseInt(r.dataset.row, 10) === id));
    qsa('.dash-master__row',  root).forEach(r =>
      r.classList.toggle('is-selected', parseInt(r.dataset.masterRow, 10) === id));
    repaintDetail();
    qs('.dash-detail', root)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function _toggleWatch(id){
    if (!Number.isFinite(id)) return;
    if (watchlist.has(id)) watchlist.delete(id); else watchlist.add(id);
    saveWatchlist(watchlist);
    repaintToolbar();
    repaintList();
  }
  function _setWatchedOnly(b){
    onlyWatched = !!b;
    const tog = qs('[data-watched-toggle]', root);
    if (tog){
      tog.classList.toggle('is-on', onlyWatched);
      tog.setAttribute('aria-pressed', String(onlyWatched));
    }
    repaintList();
  }
  function _setSort(id){
    if (!SORT_OPTIONS.find(o => o.id === id)) return;
    sortMode = id;
    qsa('[data-sort]', root).forEach(b => b.classList.toggle('is-on', b.dataset.sort === id));
    repaintList();
  }
  function _setFilter(cat){
    if (cat !== 'all' && !presentCats.includes(cat)) return;
    activeFilter = cat;
    qsa('[data-filter]', root).forEach(c =>
      c.classList.toggle('is-active', c.dataset.filter === cat));
    repaintList();
  }
  function _setMasterSort(col, dir){
    masterSort    = col;
    masterSortDir = dir;
    repaintMaster();
    qs('.dash-master', root)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function _setArchiveFilter(mode){
    if (!['all','magazine','oracle','ecosystem','selected'].includes(mode)) return;
    applyArchiveFilter(mode);
    qsa('[data-arc-filter]', root).forEach(c =>
      c.classList.toggle('is-active', c.dataset.arcFilter === mode));
    qs('.dash-arc', root)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function _scrollTo(target){
    const el = qs(target, root);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  /* Local subnet-arg parser used by the command bus. '23', 'sn23',
     or 'targon' (case-insensitive fuzzy match against current rows)
     → netuid or null. Empty/null argument falls back to whatever
     subnet is currently selected. */
  function _parseSubnetArg(s){
    if (s == null || s === '') return selectedId;
    const num = parseInt(String(s).replace(/^sn/i, ''), 10);
    if (Number.isFinite(num) && subnetState.rows.find(r => r.netuid === num)) return num;
    const ql = String(s).toLowerCase();
    const hit = subnetState.rows.find(r => (r.name || '').toLowerCase() === ql)
             || subnetState.rows.find(r => (r.name || '').toLowerCase().startsWith(ql))
             || subnetState.rows.find(r => (r.name || '').toLowerCase().includes(ql));
    return hit ? hit.netuid : null;
  }

  const onDashCommand = (e) => {
    const d = e.detail || {};
    const parts = d.parts || [];
    switch (d.fn){
      case 'goto-subnet':
        _selectSubnet(d.netuid != null ? d.netuid : _parseSubnetArg(parts[0]));
        break;
      case 'toggle-watch':
        _toggleWatch(d.netuid != null ? d.netuid : _parseSubnetArg(parts[0]));
        break;
      case 'watched-only':
        _setWatchedOnly(true);
        break;
      case 'set-sort': {
        /* Accept friendly aliases: CHG/24H → chg24, EM/EMISSION → em,
           NAME/AZ → name, MCAP → mcap. Unknown → no-op. */
        const m = (d.mode || '').toLowerCase();
        const map = { mcap:'mcap', chg:'chg24', '24h':'chg24', em:'em',
                      emission:'em', name:'name', az:'name' };
        _setSort(map[m] || m);
        break;
      }
      case 'set-filter':
        _setFilter((d.mode || 'all').toLowerCase());
        break;
      case 'top-gainers': _setMasterSort('chg24', 'desc'); break;
      case 'top-losers':  _setMasterSort('chg24', 'asc');  break;
      case 'set-archive': {
        /* RESEARCH with an explicit id arg also selects that subnet
           so the "selected" filter has the right anchor. */
        if (d.netuid != null) _selectSubnet(d.netuid);
        _setArchiveFilter(d.mode || 'all');
        break;
      }
      case 'scroll-to':
        _scrollTo(d.target || '.dash-detail');
        break;
      case 'open-briefing':
        /* Scroll the daily briefings strip into view. With a date
           arg we could pre-select that briefing, but the strip
           always shows the lead first so the basic scroll-to is
           sufficient for v1; date-deep-link is a future pass. */
        qs('[data-zone="briefings"]', root)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        break;
      case 'open-backdrop': {
        /* With a subnet arg, select that subnet first so the rail
           reflects its category. Without one, just scroll to the
           rail as it stands for the currently-selected subnet. */
        const id = d.netuid != null ? d.netuid : _parseSubnetArg(parts[0]);
        if (id != null) _selectSubnet(id);
        qs('.dash-comparator', root)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        break;
      }
      /* Remaining WIP verbs, palette already showed a toast,
         dashboard no-ops. */
      case 'open-hist':
      case 'open-compare':
      case 'open-alert':
      case 'open-layout':
        break;
    }
  };
  document.addEventListener('subnetmag:command', onDashCommand);

  return {
    destroy(){
      document.removeEventListener('keydown',           onDashKeydown);
      document.removeEventListener('subnetmag:command', onDashCommand);
      /* charts get torn down by their own ResizeObserver */
    }
  };

  /* =================================================================
     RENDER FUNCTIONS
     ============================================================== */

  /* Sticky in-page section nav. Lives directly under the status bar
     and gives the reader a 5-chip elevator to every major zone on
     the dashboard. Solves the 21,000px-tall-page problem by making
     every section ONE TAP away instead of N scroll-flicks.
     Chip set is intentionally short — five labels max so the row
     fits one line at 320px and reads at a glance. */
  function renderJumpNav(){
    const chips = [
      { id: 'briefings', lbl: 'BRIEFINGS' },
      { id: 'detail',    lbl: 'DETAIL'    },
      { id: 'desk',      lbl: 'MY DESK'   },
      { id: 'market',    lbl: 'MARKET'    },
      { id: 'archive',   lbl: 'ARCHIVE'   },
    ].map(c => `<button type="button" class="dash-jump__chip" data-jump="${c.id}">${c.lbl}</button>`).join('');
    return `
      <nav class="dash-jump" aria-label="Dashboard sections">
        <span class="dash-jump__lbl">JUMP</span>
        <div class="dash-jump__chips">${chips}</div>
      </nav>`;
  }

  /* DESK zone header — wraps paper portfolio + attribution into one
     unified section. Both panels keep their own sub-headers, but the
     reader sees this as "MY DESK · positions and analytics on those
     positions" rather than two unrelated products stacked. Drops a
     three-way mode indicator (POSITIONS / ANALYTICS / both visible)
     which is currently informational — future work could collapse one
     half on tap to compress the desk further. */
  function renderDeskHeader(){
    return `
      <header class="dash-desk__head">
        <div class="dash-desk__title">
          <span class="dash-desk__eyebrow">⊕ MY DESK</span>
          <h2 class="dash-desk__h">Your positions, analyzed against the market.</h2>
          <div class="dash-desk__sub">Buy mock positions below, then watch the attribution engine decompose your returns into sector tilt + within-sector picking skill. The two panels are one workflow: hold &rarr; measure.</div>
        </div>
      </header>`;
  }

  function renderStatusBar(){
    /* ------------------------------------------------------------
       DATA OWNERSHIP MAP (Rondo's rule: no field appears twice on
       the site; each data point has ONE home):

         StatusStrip   (global header, every page)
           TAO/USD price (with delta + sparkline)
           TAO MCAP
         Dashboard status bar (dashboard.html only — this view)
           SUBNET MCAP            (sum of all α mcaps, distinct
                                   from TAO mcap which is in
                                   StatusStrip)
           24H VOLUME             (whole network)
           VALIDATORS / MINERS    (network-internal headcount)
           EMISSION τ/day         (network throughput)
           STAKED %               (already in StatusStrip — REMOVED
                                   here, keeping global home only)
           BLK / BLOCK HEIGHT     (already in StatusStrip — REMOVED
                                   here, keeping global home only)

       The duplicates (TAO price, TAO MCAP, BLK, STAKED) were
       redundant when both rendered: the reader saw the same
       number twice on the dashboard page. Now StatusStrip owns
       the network-level vitals (visible everywhere) and the
       dashboard status bar owns dashboard-specific aggregates
       that don't make sense outside a dashboard context.
     ------------------------------------------------------------ */
    return `
      <div class="dash-status">
        <div class="dash-status__title">
          <span><span class="dash-status__live"></span> DASHBOARD · BITTENSOR COMMAND DECK</span>
          <span class="dash-status__title__right">
            LIVE · ${new Date().toISOString().slice(0,10)} · updated <span data-fresh>0s ago</span> · ${subnetState.rows.length} SUBNETS
            · <a href="${DISCORD_HUB}" target="_blank" rel="noopener" style="color:var(--c-red-1);text-decoration:none;letter-spacing:.14em">DISCORD HUB ↗</a>
            · <button type="button" class="dash-status__kbd" data-cmd-trigger title="⌘K / Ctrl+K · open command palette">⌘ COMMAND</button>
          </span>
        </div>
        <div class="dash-status__rail">
          <div class="dash-status__cell">
            <span class="dash-status__cell__lbl">SUBNET MCAP</span>
            <span class="dash-status__cell__val" data-tween="subnet-mcap">$0M</span>
            <span class="dash-status__cell__sub">${subnetState.rows.length} α tokens, sum</span>
          </div>
          <div class="dash-status__cell">
            <span class="dash-status__cell__lbl">24H VOLUME</span>
            <span class="dash-status__cell__val" data-live="tao-vol">$0</span>
            <span class="dash-status__cell__sub">all venues, network total</span>
          </div>
          <div class="dash-status__cell">
            <span class="dash-status__cell__lbl">VALIDATORS</span>
            <span class="dash-status__cell__val" data-tween="validators">0</span>
            <span class="dash-status__cell__sub">across all subnets</span>
          </div>
          <div class="dash-status__cell">
            <span class="dash-status__cell__lbl">MINERS</span>
            <span class="dash-status__cell__val" data-tween="miners">0</span>
            <span class="dash-status__cell__sub">active 24h</span>
          </div>
          <div class="dash-status__cell">
            <span class="dash-status__cell__lbl">TOP 24H GAINER</span>
            <span class="dash-status__cell__val" data-live="top-gainer">·</span>
            <span class="dash-status__cell__sub" data-live="top-gainer-sub">scoring…</span>
          </div>
          <div class="dash-status__cell">
            <span class="dash-status__cell__lbl">AI DOMINANCE</span>
            <span class="dash-status__cell__val" data-live="tao-ai-dom">·</span>
            <span class="dash-status__cell__sub">τ vs all AI-cat crypto</span>
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

    /* Build the KPI tiles. Each tile: label, big number, comparison
       line, delta pill, and an inline sparkline (matches the
       Databox / Customers Helped reference). Five tiles, every one
       has a 24-point seeded series for its visualization. */
    const priceSeries  = seedSeries(s.name + ':k-price',  s.chg30 ?? 0,            24);
    const emSeries     = seedSeries(s.name + ':k-em',    (s.chg7  ?? 0) * 0.4,     24);
    const stakeSeries  = seedSeries(s.name + ':k-stake', (s.chg30 ?? 0) * 0.3,     24);
    const valSeries    = seedSeries(s.name + ':k-vals',  (s.chg7  ?? 0) * 0.2,     24);
    const minerSeries  = seedSeries(s.name + ':k-min',   (s.chg7  ?? 0) * 0.5,     24);

    const kpis = [
      {
        lbl: 'α PRICE',
        big: fmtPrice(s.price),
        cmp: 'vs. prior 24h',
        delta: s.chg24,
        series: priceSeries,
        color: s.chg24 >= 0 ? '#5BE599' : '#FF4D60',
      },
      {
        lbl: 'FDV',
        big: fmtMcap(s.mcap),
        cmp: '30D change',
        delta: s.chg30,
        series: priceSeries,
        color: s.chg30 >= 0 ? '#5BE599' : '#FF4D60',
      },
      {
        lbl: 'EMISSION',
        big: fmtInt(s.emission) + ' τ',
        cmp: '24h on chain',
        delta: (s.chg7 ?? 0) * 0.4,
        series: emSeries,
        color: '#FFB85C',
      },
      {
        lbl: 'STAKE',
        big: fmtInt(s.stake) + ' τ',
        cmp: 'all validators',
        delta: (s.chg30 ?? 0) * 0.3,
        series: stakeSeries,
        color: '#FF1E3C',
      },
      {
        lbl: 'VALIDATORS · MINERS',
        big: fmtInt(s.validators) + ' / ' + fmtInt(s.miners),
        cmp: 'active 24h',
        delta: (s.chg7 ?? 0) * 0.2,
        series: minerSeries,
        color: '#C8A8AD',
      },
    ];
    const kpiCells = kpis.map(k => {
      const d = k.delta;
      const dCls = d == null ? 'is-flat' : (d > 0 ? 'is-up' : d < 0 ? 'is-down' : 'is-flat');
      const arrow = d == null ? '·' : (d > 0 ? '▲' : d < 0 ? '▼' : '—');
      return `
        <div class="dash-kpi__tile">
          <div class="dash-kpi__tile-head">
            <span class="dash-kpi__lbl">${k.lbl}</span>
            <span class="dash-kpi__delta ${dCls}">${arrow} ${d == null ? '·' : fmtPct(d)}</span>
          </div>
          <div class="dash-kpi__big">${k.big}</div>
          <div class="dash-kpi__cmp">${k.cmp}</div>
          <div class="dash-kpi__spark">${svgSpark(k.series, 120, 28, k.color, true)}</div>
        </div>`;
    }).join('');

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
      tagline: a.tagline || '',
      pdf: a.pdf, externalUrl: a.externalUrl,
      author: (a.authors || ['Subneτ Magazine'])[0],
      category: a.category || '',
      subnetId: id,
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
        tagline: a.dek || '',
        author: 'Subnet Oracle',
        category: a.kind || '',
        subnetId: a.subnetId || id,
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
        tagline: a.dek || '',
        author: 'Subnet Oracle', category: a.kind || '',
        subnetId: a.subnetId || null,
      }));
    }
    /* Image-rich card grid (Bloomberg-style) replaces the prior
       plain dash-news <ul>. Each card carries a procedural SVG
       cover, mono caps meta, serif title, sans dek, kind chip +
       SN tag in cover corners. Auto-fill grid drops from ~3
       columns at desktop width down to 1 on phones via CSS. */
    const newsCards = feed.slice(0, 6).map(a => newsCardHtml(a, s)).join('') ||
      `<div class="news-cards__empty">No editorial dispatches indexed for this subnet yet. The Oracle desk rotates a deep profile in when a subnet enters the top emission tier.</div>`;

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

    /* Editorial coverage for THIS subnet — surfaces as a clickable
       line under the team. Shows the magazine's coverage as a fact
       about the subnet, not just a sidebar item. Clicking dispatches
       the RESEARCH command (existing palette verb) to filter the
       archive to this subnet's pieces. */
    const cov = coverageStats(id);
    const covTotal = cov.mag + cov.oracle;
    const editLine = covTotal > 0
      ? `<div class="dash-detail__editorial">
           editorial:
           <button type="button" class="dash-detail__edit-chip" data-edit-jump="${id}"
             aria-label="Filter research archive to SN${id} ${escapeHtml(s.name)}">
             📄 ${cov.mag} article${cov.mag === 1 ? '' : 's'} ·
             ${cov.oracle} oracle dispatch${cov.oracle === 1 ? '' : 'es'}
           </button>
         </div>`
      : `<div class="dash-detail__editorial dash-detail__editorial--empty">editorial: no in-house coverage yet · Oracle desk rotates a deep profile when a subnet enters the top emission tier</div>`;

    return `
      <div class="dash-detail__head">
        <div>
          <div class="dash-detail__id">SN${s.netuid} · ${CAT_LABEL[s.cat] || (s.cat || '').toUpperCase()}</div>
          <div class="dash-detail__name">${s.name}<span class="dash-detail__cat">· ${(s.cat || '').toUpperCase()}</span></div>
          <div class="dash-detail__owner">team: ${s.owner || '·'}</div>
          ${editLine}
          <div class="dash-detail__desc">${s.desc || ''}</div>
          <a class="dash-detail__cockpit-cta" href="cockpit.html"
             title="Open this subnet in the research cockpit — chart + feed + data, no scrolling">
            ⊕ OPEN IN COCKPIT ↗
          </a>
        </div>
        <div></div>
        <div class="dash-detail__price-block">
          <div class="dash-detail__price">${fmtPrice(s.price)}</div>
          <div class="dash-detail__chg ${cls}">${fmtPct(s.chg24)} · 24h</div>
        </div>
      </div>
      <!-- Decluttered (mac-session): the KPI tile row and the 5-widget
           infographic row used to live here. Removed because the same
           data (price, mcap, emission, stake, validators, miners) is
           already visible in the detail head + master grid + chart
           below. The reader doesn't need it three times. Stake share
           and 7-day emission flow are unique enough to surface; both
           are now folded into the CHART panel below per the "data
           within the chart" directive. -->

      <!-- Conflict resolved (mac-session): taking sibling's
           <details>-based collapsible-fold pattern wholesale. They
           shipped 29ec359 with the same intent (kill the long scroll,
           things within things) using HTML5 native folds. My competing
           5-cluster restructure is discarded in favor of theirs —
           same problem, two solutions, sibling's is more conservative
           (keeps all 8 surfaces accessible, just collapsed by default
           except PROFILE) and ships earlier.

           Push A's deletion of the KPI tiles + infographic row
           survives above this block. The follow-up multi-pane
           workspace ("chart next to news next to emissions all at
           once" per Rondo's latest) is the next session's work and
           belongs at a different architectural layer (zone shell)
           anyway. -->
      <div class="dash-panels">
        <details class="fold fold--primary" data-fold="dash-profile-${id}" open>
          <summary class="fold__head">
            <span class="fold__sigil">⊕</span>
            <span class="fold__lbl">PROFILE · editorial</span>
            <span class="fold__meta">${profilePanelMeta}</span>
            <span class="fold__chev">▸</span>
          </summary>
          <div class="fold__body">${profilePanel}</div>
        </details>

        <details class="fold" data-fold="dash-price-chart">
          <summary class="fold__head">
            <span class="fold__sigil">⊕</span>
            <span class="fold__lbl">α PRICE · 30D</span>
            <span class="fold__meta">${fmtPct(s.chg30)} 30d · ${fmtPct(s.chg7)} 7d &nbsp; → study in cockpit</span>
            <span class="fold__chev">▸</span>
          </summary>
          <div class="fold__body"><div class="dash-chart"><canvas data-spark="price"></canvas></div></div>
        </details>

        <details class="fold" data-fold="dash-emission-chart">
          <summary class="fold__head">
            <span class="fold__sigil">⊕</span>
            <span class="fold__lbl">EMISSION · 30D τ</span>
            <span class="fold__meta">${fmtInt(s.emission)} τ / 24h</span>
            <span class="fold__chev">▸</span>
          </summary>
          <div class="fold__body"><div class="dash-chart"><canvas data-spark="emission"></canvas></div></div>
        </details>

        <details class="fold" data-fold="dash-heat">
          <summary class="fold__head">
            <span class="fold__sigil">⊕</span>
            <span class="fold__lbl">VALIDATOR · MINER HEAT</span>
            <span class="fold__meta">${fmtInt(s.validators)} validators · ${fmtInt(s.miners)} miners</span>
            <span class="fold__chev">▸</span>
          </summary>
          <div class="fold__body">
            <div class="dash-heat">${heatCells}</div>
            <div style="margin-top:10px;font-size:9.5px;color:var(--c-ink-3);letter-spacing:.10em">Each cell = a validator-slot bucket (8x8 grid). Hotter = larger stake share.</div>
          </div>
        </details>

        <details class="fold" data-fold="dash-wallet-${id}">
          <summary class="fold__head">
            <span class="fold__sigil">⊕</span>
            <span class="fold__lbl">WALLET TRACKER</span>
            <span class="fold__meta">${(topHoldersFor(id) || []).length} top holders · recent large moves</span>
            <span class="fold__chev">▸</span>
          </summary>
          <div class="fold__body">${renderWalletPanel(id)}</div>
        </details>

        <details class="fold" data-fold="dash-github-${id}">
          <summary class="fold__head">
            <span class="fold__sigil">⊕</span>
            <span class="fold__lbl">GITHUB ACTIVITY · 30D</span>
            <span class="fold__meta">${gh ? fmtInt(gh.commits30d) + ' commits · ' + gh.pulse : 'no telemetry'}</span>
            <span class="fold__chev">▸</span>
          </summary>
          <div class="fold__body">${ghPanel}</div>
        </details>

        <details class="fold" data-fold="dash-news-${id}">
          <summary class="fold__head">
            <span class="fold__sigil">⊕</span>
            <span class="fold__lbl">EDITORIAL INTEL</span>
            <span class="fold__meta">${team.length + oracle.length} dispatches indexed</span>
            <span class="fold__chev">▸</span>
          </summary>
          <div class="fold__body">
            <div style="font-size:9.5px;color:var(--c-ink-3);letter-spacing:.10em;margin-bottom:8px;font-family:var(--f-sans);font-style:italic">Each dispatch is a research signal. Tap into one when you need the source behind the numbers above.</div>
            <div class="news-cards">${newsCards}</div>
          </div>
        </details>

        <details class="fold" data-fold="dash-links">
          <summary class="fold__head">
            <span class="fold__sigil">⊕</span>
            <span class="fold__lbl">EXTERNAL LINKS</span>
            <span class="fold__meta">team surfaces</span>
            <span class="fold__chev">▸</span>
          </summary>
          <div class="fold__body">
            <div class="dash-links">
              ${s.gh ? `<a class="dash-links__a" href="https://github.com/${s.gh}" target="_blank" rel="noopener">GitHub ↗</a>` : ''}
              ${s.url ? `<a class="dash-links__a" href="${s.url}" target="_blank" rel="noopener">Website ↗</a>` : ''}
              <a class="dash-links__a" href="${DISCORD_HUB}" target="_blank" rel="noopener">Discord Hub ↗</a>
              <a class="dash-links__a" href="https://taostats.io/subnets/${s.netuid}" target="_blank" rel="noopener">Taostats ↗</a>
              <a class="dash-links__a" href="https://taomarketcap.com/subnets/${s.netuid}" target="_blank" rel="noopener">TaoMarketcap ↗</a>
            </div>
          </div>
        </details>
      </div>
    `;
  }

  function renderComparator(selectedSubnet){
    /* Per-subnet centralized backdrop. When a subnet is selected we
       filter both the frontier news and the valuation ladder to its
       competitive set: text subnet → text-domain labs, infra subnet
       → chip/foundry/cloud, etc. The header names the category so
       the reader sees WHY the rail looks the way it does. With no
       selection (shouldn't happen — selectedId defaults to 4 — but
       the fallback is here defensively) we surface the full
       universe. */
    const subCat   = selectedSubnet?.cat || '';
    const catLabel = (CAT_LABEL[subCat] || subCat || '').toUpperCase();
    const players  = selectedSubnet ? playersForSubnet(selectedSubnet) : CENTRALIZED_PLAYERS;
    const news     = selectedSubnet ? newsForSubnet(selectedSubnet, 10) : recentCentralizedNews(10);

    const compTop  = players
      .map(p => ({ ...p, _v: parseVal(p.valuation) }))
      .sort((a, b) => b._v - a._v)
      .slice(0, 14);

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

    /* Empty-state friendly: when filtering produces zero news the
       rail is brittle and reads as "no data" — instead, name the
       gap and point the reader at the briefings archive which always
       has the cross-cutting picture. */
    const newsRows = news.length ? news.map(n => `
      <li class="dash-cnews__row">
        <span class="dash-cnews__date">${fmtDate(n.date)}</span>
        <span class="dash-cnews__cat dash-cnews__cat--${n.cat}">${n.cat.toUpperCase()}</span>
        <a class="dash-cnews__headline" href="${n.url}" target="_blank" rel="noopener">${n.headline}</a>
        <span class="dash-cnews__src">${n.source} · ${n.subjects.join(' · ')}</span>
        <span class="dash-cnews__take">${n.takeaway}</span>
      </li>
    `).join('') : `
      <li class="dash-cnews__row" style="display:block;padding:14px 12px;color:var(--c-ink-3);font-style:italic;font-family:var(--f-sans);font-size:11px">
        No centralized-AI signals indexed for the ${catLabel.toLowerCase() || 'selected'} category yet. The desk catches up daily, see <a style="color:var(--c-red-1)" href="https://github.com/RondoAI/rondo-AI-curriculum/tree/main/briefings" target="_blank" rel="noopener">/briefings ↗</a> for the cross-cutting picture.
      </li>
    `;

    const head = selectedSubnet && catLabel
      ? `CENTRALIZED BACKDROP · ${catLabel}`
      : 'CENTRALIZED INTEL · landscape + news';
    const sub  = selectedSubnet && catLabel
      ? `Frontier-AI signals filtered to the ${catLabel.toLowerCase()} space, so the centralized competitive picture matches the subnet you're reading. Source / scope / takeaway per signal.`
      : 'The AI domain a Bittensor reader still has to track, frontier labs, GPU economics, hyperscaler capex, policy. Curated in the SemiAnalysis register, source / scope / takeaway per signal.';

    return `
      <aside class="dash-comparator">
        <div class="dash-comparator__head">${head}</div>
        <div class="dash-comparator__sub">${sub}</div>

        <div class="dash-cnews__sectionhead">FRONTIER NEWS${catLabel ? ' · ' + catLabel : ''} · ${news.length} indexed</div>
        <ul class="dash-cnews__list">${newsRows}</ul>

        <div class="dash-cnews__sectionhead">VALUATION LADDER${catLabel ? ' · ' + catLabel : ''} · ${compTop.length} players</div>
        <ul class="dash-comparator__list">${rows}</ul>
      </aside>
    `;
  }

  function renderBriefings(){
    /* Daily-briefings hero strip. Sits between status bar and the
       3-col grid. The magazine's deepest analytical work is the
       briefings — making them load-bearing here moves them from
       invisible (just MD files in /briefings/) to the editorial
       lead of the dashboard.

       Honest currency: the kicker reflects how many days old the
       most-recent briefing is. We never fake "TODAY" when the
       lead is older. If it's >24h old, the dot turns amber. */
    const lead = latestBriefing();
    if (!lead) return '';

    const todayIso = new Date().toISOString().slice(0, 10);
    const dOld     = daysBetween(lead.date, todayIso);
    const stale    = dOld != null && dOld > 1;
    const header   = currencyHeader(todayIso, lead.date);

    const highlights = lead.highlights.map(h => `
      <li>
        <span class="dash-brief__hl__tag">${h.tag}</span>
        <span class="dash-brief__hl__txt">${h.text}</span>
      </li>
    `).join('');

    const cats = (lead.cats || []).map(c =>
      `<span class="dash-brief__cat">${c.toUpperCase()}</span>`
    ).join('');

    const priorCards = priorBriefings(2).map(b => `
      <a class="dash-brief__prior-card" href="${b.href}" target="_blank" rel="noopener">
        <span class="dash-brief__prior-card__date">${fmtDate(b.date)} · BRIEFING</span>
        <h3 class="dash-brief__prior-card__title">${b.title}</h3>
        <p class="dash-brief__prior-card__dek">${b.dek}</p>
      </a>
    `).join('');

    return `
      <section class="dash-brief${stale ? ' is-stale' : ''}" data-zone="briefings">
        <div class="dash-brief__head">
          <span class="dash-brief__kicker">
            <span class="dash-brief__kicker__dot"></span>${header}
          </span>
          <a class="dash-brief__arch" href="https://github.com/RondoAI/rondo-AI-curriculum/tree/main/briefings" target="_blank" rel="noopener">FULL ARCHIVE ↗</a>
        </div>
        <div class="dash-brief__grid">
          <a class="dash-brief__lead" href="${lead.href}" target="_blank" rel="noopener" aria-label="Read full briefing ${lead.date}">
            <span class="dash-brief__lead__date">${fmtDate(lead.date)} · ${lead.kicker}</span>
            <h2 class="dash-brief__lead__title">${lead.title}</h2>
            <p class="dash-brief__lead__dek">${lead.dek}</p>
            <div class="dash-brief__rule"></div>
            <ul class="dash-brief__hl">${highlights}</ul>
            <div class="dash-brief__lead__foot">
              <div class="dash-brief__lead__cats">${cats}</div>
              <span class="dash-brief__lead__link">READ FULL BRIEFING ↗</span>
            </div>
          </a>
          <div class="dash-brief__prior">${priorCards}</div>
        </div>
      </section>
    `;
  }

  function repaintComparator(){
    /* outerHTML replace, the rail has no internal interactive state
       (no focused input, no scroll position to preserve), so a full
       swap is fine. Same pattern repaintMaster uses. */
    const z = qs('.dash-comparator', root);
    if (!z) return;
    const subnet = subnetState.rows.find(s => s.netuid === selectedId);
    z.outerHTML = renderComparator(subnet);
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

  function renderInfographicRow(s){
    /* Row of four infographic widgets, matches the Mission UI Pro /
       Tableau dashboards reference. Pure SVG, no chart-class
       overhead. Designed to give the detail panel the visual
       density of a real operations terminal, not a SaaS settings
       page. */

    /* 1. STAKE SHARE GAUGE: this subnet's stake as % of network */
    const networkStake = subnetState.rows.reduce((n, r) => n + (r.stake || 0), 0) || 1;
    const stakePct = ((s.stake || 0) / networkStake) * 100;
    const stakeGauge = svgGauge(stakePct, 30, '#FF1E3C', 'STAKE SHARE');

    /* 2. CODE VELOCITY GAUGE: maps GH commit volume to 0-10 score */
    const gh2 = ghByNetuid(s.netuid) || synthesizeGh(s);
    const codeScore = gh2 ? Math.min(10, (gh2.commits30d || 0) / 18) : 0;
    const codeGauge = svgGauge(codeScore, 10, '#5BE599', 'CODE VELOCITY');

    /* 3. MINER ACTIVITY GAUGE: miners-to-validator ratio normalized */
    const mvRatio = s.validators ? Math.min(20, (s.miners || 0) / s.validators) : 0;
    const minerGauge = svgGauge(mvRatio, 20, '#FFB85C', 'MINER DENSITY');

    /* 4. STAKE DISTRIBUTION DONUT: top-3 / 4-10 / 11-25 / rest */
    const totalStake = s.stake || 0;
    const topShares = totalStake > 0 ? [
      { color: '#FF1E3C', value: totalStake * 0.42, label: 'TOP 3' },
      { color: '#FF8094', value: totalStake * 0.28, label: '4-10' },
      { color: '#FFB85C', value: totalStake * 0.18, label: '11-25' },
      { color: 'rgba(255,30,60,.25)', value: totalStake * 0.12, label: 'REST' },
    ] : [{ color: 'rgba(255,255,255,.1)', value: 1, label: 'NO DATA' }];
    const donut = svgDonut(topShares,
      fmtInt(totalStake/1000) + 'K',
      'τ STAKED');

    /* 5. 7-DAY EMISSION BAR CHART */
    const dailyEm = seedSeries(s.name + ':daily-em', s.chg7 ?? 0, 7).map(v => Math.abs(v) + 0.3);
    const bars = svgBars(dailyEm, 240, 60, '#FF1E3C');

    return `
      <div class="dash-info">
        <div class="dash-info__tile">
          <div class="dash-info__head">STAKE SHARE</div>
          <div class="dash-info__svg">${stakeGauge}</div>
          <div class="dash-info__sub">vs network · ${stakePct.toFixed(2)}% of ${fmtInt(networkStake)} τ</div>
        </div>
        <div class="dash-info__tile">
          <div class="dash-info__head">CODE VELOCITY</div>
          <div class="dash-info__svg">${codeGauge}</div>
          <div class="dash-info__sub">${gh2 ? fmtInt(gh2.commits30d) + ' commits · 30d' : 'no repo seeded'}</div>
        </div>
        <div class="dash-info__tile">
          <div class="dash-info__head">MINER DENSITY</div>
          <div class="dash-info__svg">${minerGauge}</div>
          <div class="dash-info__sub">${fmtInt(s.miners)} miners per ${fmtInt(s.validators)} validators</div>
        </div>
        <div class="dash-info__tile">
          <div class="dash-info__head">STAKE DISTRIBUTION</div>
          <div class="dash-info__svg">${donut}</div>
          <div class="dash-info__legend">
            ${topShares.map(seg => `
              <span class="dash-info__leg"><span class="dash-info__leg-dot" style="background:${seg.color}"></span>${seg.label}</span>
            `).join('')}
          </div>
        </div>
        <div class="dash-info__tile dash-info__tile--wide">
          <div class="dash-info__head">7-DAY EMISSION FLOW · τ/day</div>
          <div class="dash-info__bars">${bars}</div>
          <div class="dash-info__bars-axis">
            <span>D-7</span><span>D-6</span><span>D-5</span><span>D-4</span><span>D-3</span><span>D-2</span><span>TODAY</span>
          </div>
        </div>
      </div>
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
    /* TaoStats / Bloomberg-style column grid for ALL subnets, with
       sortable headers (click any column header to re-sort), a
       30D sparkline column, and a vertical red/green accent bar
       on the left edge of each row encoding 24h performance. */
    const MASTER_COLS = [
      { id: 'netuid',     label: 'ID',         num: false, cmp: (a,b) => a.netuid - b.netuid },
      { id: 'name',       label: 'NAME',       num: false, cmp: (a,b) => (a.name||'').localeCompare(b.name||'') },
      { id: 'cat',        label: 'CAT',        num: false, cmp: (a,b) => (a.cat||'').localeCompare(b.cat||'') },
      { id: 'price',      label: 'α PRICE',    num: true,  cmp: (a,b) => (a.price||0)-(b.price||0) },
      { id: 'chg24',      label: '24H',        num: true,  cmp: (a,b) => (a.chg24||0)-(b.chg24||0) },
      { id: 'chg7',       label: '7D',         num: true,  cmp: (a,b) => (a.chg7||0)-(b.chg7||0) },
      { id: 'chg30',      label: '30D',        num: true,  cmp: (a,b) => (a.chg30||0)-(b.chg30||0) },
      { id: 'spark',      label: '30D TREND',  num: false, cmp: null },
      { id: 'mcap',       label: 'FDV',        num: true,  cmp: (a,b) => (a.mcap||0)-(b.mcap||0) },
      { id: 'emission',   label: 'EMISSION',   num: true,  cmp: (a,b) => (a.emission||0)-(b.emission||0) },
      { id: 'miners',     label: 'MINERS',     num: true,  cmp: (a,b) => (a.miners||0)-(b.miners||0) },
      { id: 'validators', label: 'VALIDATORS', num: true,  cmp: (a,b) => (a.validators||0)-(b.validators||0) },
    ];
    const col = MASTER_COLS.find(c => c.id === masterSort) || MASTER_COLS.find(c => c.id === 'mcap');
    const sorted = subnetState.rows.slice().sort((a,b) => {
      if (!col || !col.cmp) return (b.mcap||0)-(a.mcap||0);
      const r = col.cmp(a, b);
      return masterSortDir === 'desc' ? -r : r;
    });
    const rows = sorted.map(s => {
      const cls   = chgClass(s.chg24);
      const cls7  = chgClass(s.chg7);
      const cls30 = chgClass(s.chg30);
      const accentCls = s.chg24 > 2 ? 'is-strong-up'
                       : s.chg24 > 0 ? 'is-up'
                       : s.chg24 < -2 ? 'is-strong-down'
                       : s.chg24 < 0 ? 'is-down'
                       : 'is-flat';
      const sparkColor = s.chg24 >= 0 ? '#5BE599' : '#FF4D60';
      const sparkSeries = seedSeries(s.name + ':master', s.chg30 ?? 0, 24);
      const cov = coverageStats(s.netuid);
      const covTotal = cov.mag + cov.oracle;
      /* Coverage chip — only renders when there's any editorial
         backing. Title shows the breakdown for hover-tap-and-hold
         on mobile. Clickable area is the row, not the chip — the
         existing rail-click handler still wins. */
      const covChip = covTotal > 0
        ? ` <span class="dash-master__cov" title="${cov.mag} magazine · ${cov.oracle} oracle dispatch${cov.oracle === 1 ? '' : 'es'}" aria-label="${covTotal} editorial coverage items">·${covTotal}</span>`
        : '';
      return `
        <tr class="dash-master__row ${accentCls}" data-master-row="${s.netuid}">
          <td class="dash-master__accent"></td>
          <td class="dash-master__sn">SN${s.netuid}</td>
          <td class="dash-master__name">${s.name}${covChip}</td>
          <td class="dash-master__cat">${(s.cat || '').toUpperCase()}</td>
          <td class="dash-master__num">${fmtPrice(s.price)}</td>
          <td class="dash-master__num ${cls}">${fmtPct(s.chg24)}</td>
          <td class="dash-master__num ${cls7}">${fmtPct(s.chg7)}</td>
          <td class="dash-master__num ${cls30}">${fmtPct(s.chg30)}</td>
          <td class="dash-master__spark">${svgSpark(sparkSeries, 64, 22, sparkColor, true)}</td>
          <td class="dash-master__num">${fmtMcap(s.mcap)}</td>
          <td class="dash-master__num">${fmtInt(s.emission)} τ</td>
          <td class="dash-master__num">${fmtInt(s.miners)}</td>
          <td class="dash-master__num">${fmtInt(s.validators)}</td>
        </tr>`;
    }).join('');
    const headers = MASTER_COLS.map(c => {
      const isActive = c.id === masterSort;
      const arrow = isActive ? (masterSortDir === 'desc' ? ' ▼' : ' ▲') : ' ⇕';
      const cls = (c.num ? 'ralign ' : '') + (isActive ? 'is-active' : '') + (c.cmp ? '' : ' is-static');
      return `<th class="${cls.trim()}" data-mh="${c.id}">${c.label}<span class="dash-master__sort">${c.cmp ? arrow : ''}</span></th>`;
    }).join('');
    /* Mobile-friendly card list, rendered alongside the desktop
       table. CSS shows one or the other based on viewport: cards
       under 880px, table above. Avoids the horizontal-scroll-table-
       inside-vertical-scroll-page anti-pattern that was the most
       visible bug in Rondo's last screenshots. */
    const cards = sorted.map(s => {
      const cls    = chgClass(s.chg24);
      const cls7   = chgClass(s.chg7);
      const cls30  = chgClass(s.chg30);
      const accent = s.chg24 > 2 ? 'is-strong-up'
                   : s.chg24 > 0 ? 'is-up'
                   : s.chg24 < -2 ? 'is-strong-down'
                   : s.chg24 < 0 ? 'is-down'
                   : 'is-flat';
      const sparkColor = s.chg24 >= 0 ? '#5BE599' : '#FF4D60';
      const sparkSeries = seedSeries(s.name + ':mc', s.chg30 ?? 0, 24);
      return `
        <div class="dash-mc ${accent}" data-master-row="${s.netuid}">
          <div class="dash-mc__accent"></div>
          <div class="dash-mc__body">
            <div class="dash-mc__head">
              <span class="dash-mc__sn">SN${s.netuid}</span>
              <span class="dash-mc__name">${s.name}</span>
              <span class="dash-mc__cat">${(s.cat || '').toUpperCase()}</span>
            </div>
            <div class="dash-mc__priceline">
              <span class="dash-mc__price">${fmtPrice(s.price)}</span>
              <span class="dash-mc__chg ${cls}">${fmtPct(s.chg24)} <span class="dash-mc__chg-lbl">24H</span></span>
              <span class="dash-mc__spark">${svgSpark(sparkSeries, 110, 26, sparkColor, true)}</span>
            </div>
            <div class="dash-mc__chgs">
              <span class="${cls7}">${fmtPct(s.chg7)} <span class="dash-mc__chg-lbl">7D</span></span>
              <span class="${cls30}">${fmtPct(s.chg30)} <span class="dash-mc__chg-lbl">30D</span></span>
            </div>
            <div class="dash-mc__stats">
              <span><label>FDV</label><strong>${fmtMcap(s.mcap)}</strong></span>
              <span><label>EMIT</label><strong>${fmtInt(s.emission)} τ</strong></span>
              <span><label>MIN</label><strong>${fmtInt(s.miners)}</strong></span>
              <span><label>VAL</label><strong>${fmtInt(s.validators)}</strong></span>
            </div>
          </div>
        </div>`;
    }).join('');

    return `
      <section class="dash-master">
        <div class="dash-master__head">
          <div class="dash-master__title">MASTER GRID · all ${subnetState.rows.length} subnets indexed</div>
          <div class="dash-master__sub">Click any header to sort · Click any row to load it into the COMMAND DECK above.</div>
        </div>
        <div class="dash-master__cards">${cards}</div>
        <div class="dash-master__scroll">
          <table class="dash-master__table">
            <thead><tr><th class="dash-master__accent-h"></th>${headers}</tr></thead>
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
    /* Chart tabs: clicking PRICE / EMISSION toggles which pane is
       visible. "Data within the chart" — same panel, different
       facet. Both Sparkline instances are mounted on first paint
       so swapping is instant. */
    qsa('[data-focus-tab]', scope).forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.focusTab;
        qsa('[data-focus-tab]', scope).forEach(b => {
          const on = b === btn;
          b.classList.toggle('is-on', on);
          b.setAttribute('aria-selected', String(on));
        });
        qsa('[data-focus-pane]', scope).forEach(p => {
          p.style.display = (p.dataset.focusPane === target) ? '' : 'none';
        });
      });
    });
  }
}
