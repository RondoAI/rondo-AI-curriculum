/* =================================================================
   SUBNET MAGAZINE, TERMINAL · EDITORIAL MODE
   -----------------------------------------------------------------
   Insight-first card grid for editorial dispatches. Per the
   Signal Taxonomy in CLAUDE.md: "every chart has to make sense
   for a BlackRock engineer." For editorial content that means
   answering the questions a research head actually asks:

     - How concentrated is our coverage? (Coverage Gini)
     - Which top-mcap subnets are dark? (Coverage gaps)
     - Where's the alpha — do our pieces precede outperformance?
       (Editorial alpha back-test, deferred until real OHLC
       history lands; placeholder reading honest about the gap)
     - Then: the cards, filterable, image-rich.

   The lead insight strip is the difference between a card grid
   (decorative) and a research surface (decision-grade). Same
   underlying data, decision-oriented framing.
   ================================================================= */

import { qs, qsa, escapeHtml } from '../../lib/dom.js';
import { SUBNETS, subnetById } from '../../data/subnets.js';
import { ARTICLES } from '../../data/articles.js';
import { recentOracleArticles } from '../../data/oracle-articles.js';

/* ---------- public mount ----------------------------------- */

export function mountEditorialMode(root, ctx){
  if (!root) return () => {};

  const all = composeDispatches();
  const insights = computeInsights(all);
  const state = { source: 'all', cat: 'all', sn: null };

  root.innerHTML = template({ insights, state, all });
  wireFilters(root, state, all);

  return () => {};
}

/* ---------- compose unified dispatch list ----------------- */

function composeDispatches(){
  const team = ARTICLES.map(a => ({
    kind:       'magazine',
    date:       a.date,
    title:      a.title,
    tagline:    a.tagline || '',
    href:       a.pdf || a.externalUrl || '',
    author:     (a.authors || ['Subneτ Magazine'])[0],
    category:   a.category || '',
    subnetId:   a.subnet ? parseInt(a.subnet, 10) : null,
    isExternal: !!a.externalUrl,
  }));
  const oracle = recentOracleArticles(Infinity).map(a => ({
    kind:       'oracle',
    date:       a.date,
    title:      a.title,
    tagline:    a.dek || '',
    href:       a.pdf || '',
    author:     'Subnet Oracle',
    category:   a.kind || 'research',
    subnetId:   a.subnetId || null,
    isExternal: false,
  }));
  return [...team, ...oracle].sort((a, b) =>
    (b.date || '').localeCompare(a.date || ''));
}

/* ---------- compute the insight strip --------------------- */
/* The decision-grade reading layer. Each insight here answers
   a specific question a research head would ask. */

function computeInsights(all){
  /* 1. Coverage volume by source. */
  const counts = { magazine: 0, oracle: 0, external: 0 };
  for (const a of all){
    if (a.isExternal)             counts.external++;
    else if (a.kind === 'oracle') counts.oracle++;
    else                          counts.magazine++;
  }

  /* 2. Per-subnet coverage count. */
  const perSubnet = new Map();
  for (const a of all){
    if (a.subnetId == null) continue;
    perSubnet.set(a.subnetId, (perSubnet.get(a.subnetId) || 0) + 1);
  }

  /* 3. Top-5 covered subnets. */
  const topCovered = [...perSubnet.entries()]
    .map(([netuid, n]) => ({ netuid, n, subnet: subnetById(netuid) }))
    .filter(x => x.subnet)
    .sort((a, b) => b.n - a.n)
    .slice(0, 5);

  /* 4. Coverage gaps: top-N by mcap with zero coverage.
     Excludes deregistered seed-mismatches (subnet id without a
     SUBNETS row). The reading is "where the desk should publish
     next to fill the institutional view." */
  const gaps = SUBNETS
    .filter(s => !perSubnet.has(s.netuid))
    .slice()
    .sort((a, b) => (b.mcap || 0) - (a.mcap || 0))
    .slice(0, 6);

  /* 5. Coverage Gini coefficient — how concentrated is the
     desk's attention? 0 = uniform, 1 = one subnet owns all
     coverage. Computed on the per-subnet count distribution. */
  const gini = giniCoefficient([...perSubnet.values()]);

  /* 6. Recency — when did the desk last file? */
  const sorted = all.filter(a => a.date).sort((a, b) =>
    (b.date || '').localeCompare(a.date || ''));
  const latest = sorted[0]?.date || null;
  const daysSince = latest ? daysBetween(latest, new Date().toISOString().slice(0, 10)) : null;

  /* 7. Last-30-day cadence. */
  const todayMs = Date.now();
  const ms30   = 30 * 86_400_000;
  const last30 = all.filter(a => {
    const t = Date.parse((a.date || '') + 'T12:00:00Z');
    return Number.isFinite(t) && (todayMs - t) < ms30;
  }).length;

  return {
    total: all.length,
    counts,
    perSubnetCount: perSubnet.size,
    topCovered,
    gaps,
    gini,
    latest,
    daysSince,
    last30,
  };
}

function giniCoefficient(values){
  if (!values || values.length < 2) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  let sumOfDifferences = 0;
  let sumOfValues      = 0;
  for (let i = 0; i < sorted.length; i++){
    sumOfValues += sorted[i];
    for (let j = 0; j < sorted.length; j++){
      sumOfDifferences += Math.abs(sorted[i] - sorted[j]);
    }
  }
  if (sumOfValues === 0) return 0;
  return sumOfDifferences / (2 * sorted.length * sumOfValues);
}

function daysBetween(a, b){
  const pa = Date.parse(a + 'T00:00:00Z');
  const pb = Date.parse(b + 'T00:00:00Z');
  if (!Number.isFinite(pa) || !Number.isFinite(pb)) return null;
  return Math.round((pb - pa) / 86_400_000);
}

/* ---------- render --------------------------------------- */

function template({ insights, state, all }){
  return `
    <article class="term-edit">
      ${renderInsightStrip(insights)}
      ${renderFilters(insights, state)}
      <div class="term-edit__grid" data-grid>${renderGrid(all, state)}</div>
      <footer class="term-edit__foot">
        <span>Editorial signal · ${insights.total} dispatches indexed across ${insights.perSubnetCount} subnets</span>
        <span class="term-edit__brand">⌘ EDITORIAL · DESK READ</span>
      </footer>
    </article>
  `;
}

function renderInsightStrip(insights){
  const giniReading = insights.gini < 0.3 ? 'BROAD'
                    : insights.gini < 0.5 ? 'BALANCED'
                    : insights.gini < 0.7 ? 'CONCENTRATED'
                    : 'HIGHLY CONCENTRATED';
  const recencyTxt  = insights.daysSince == null ? '·'
                    : insights.daysSince === 0 ? 'today'
                    : insights.daysSince === 1 ? 'yesterday'
                    : `${insights.daysSince}d ago`;

  const topRows = insights.topCovered.map(t => `
    <li class="term-edit__top-row">
      <span class="term-edit__top-sn">SN${t.netuid}</span>
      <span class="term-edit__top-name">${escapeHtml(t.subnet.name)}</span>
      <span class="term-edit__top-n">${t.n}</span>
    </li>
  `).join('') || `<li class="term-edit__top-row term-edit__top-row--empty">No coverage indexed.</li>`;

  const gapRows = insights.gaps.map(g => `
    <li class="term-edit__gap-row">
      <span class="term-edit__gap-sn">SN${g.netuid}</span>
      <span class="term-edit__gap-name">${escapeHtml(g.name)}</span>
      <span class="term-edit__gap-mcap">$${g.mcap.toFixed(1)}M</span>
    </li>
  `).join('') || `<li class="term-edit__gap-row term-edit__gap-row--empty">No gaps — every subnet has coverage.</li>`;

  return `
    <section class="term-edit__insights">
      <header class="term-edit__insights-head">
        <span class="term-edit__kicker"><span class="term-edit__dot"></span>EDITORIAL DESK · INSIGHT VIEW</span>
        <span class="term-edit__last">last filed: ${escapeHtml(recencyTxt)} · ${insights.last30} dispatches last 30 days</span>
      </header>

      <div class="term-edit__insight-grid">

        <!-- INSIGHT 1: Volume by source -->
        <div class="term-edit__insight">
          <div class="term-edit__insight-lbl">VOLUME BY SOURCE</div>
          <div class="term-edit__insight-big">${insights.total}</div>
          <div class="term-edit__insight-sub">
            <span><strong>${insights.counts.magazine}</strong> magazine</span>
            <span><strong>${insights.counts.oracle}</strong> oracle</span>
            <span><strong>${insights.counts.external}</strong> external</span>
          </div>
        </div>

        <!-- INSIGHT 2: Coverage concentration -->
        <div class="term-edit__insight">
          <div class="term-edit__insight-lbl">COVERAGE CONCENTRATION</div>
          <div class="term-edit__insight-big">${insights.gini.toFixed(2)}</div>
          <div class="term-edit__insight-sub">
            <span class="term-edit__reading term-edit__reading--${giniReading.toLowerCase().replace(/ /g, '-')}">${giniReading}</span>
            <span>Gini across ${insights.perSubnetCount} subnets</span>
          </div>
        </div>

        <!-- INSIGHT 3: Editorial alpha (placeholder — needs OHLC) -->
        <div class="term-edit__insight">
          <div class="term-edit__insight-lbl">EDITORIAL ALPHA · 7D POST-PUB</div>
          <div class="term-edit__insight-big term-edit__insight-big--pending">·</div>
          <div class="term-edit__insight-sub term-edit__insight-sub--pending">
            <em>pending real OHLC history — see Signal Taxonomy in CLAUDE.md.</em>
          </div>
        </div>

        <!-- INSIGHT 4: Top covered subnets -->
        <div class="term-edit__insight term-edit__insight--list">
          <div class="term-edit__insight-lbl">MOST-COVERED SUBNETS</div>
          <ul class="term-edit__top">${topRows}</ul>
        </div>

        <!-- INSIGHT 5: Coverage gaps -->
        <div class="term-edit__insight term-edit__insight--list">
          <div class="term-edit__insight-lbl">COVERAGE GAPS · top-mcap, zero in-house</div>
          <ul class="term-edit__gaps">${gapRows}</ul>
        </div>

      </div>
    </section>
  `;
}

function renderFilters(insights, state){
  const sources = [
    { id: 'all',      label: 'ALL',       n: insights.total },
    { id: 'magazine', label: 'MAGAZINE',  n: insights.counts.magazine },
    { id: 'oracle',   label: 'ORACLE',    n: insights.counts.oracle },
    { id: 'external', label: 'EXTERNAL',  n: insights.counts.external },
  ];
  return `
    <nav class="term-edit__filters" aria-label="Editorial filters">
      <span class="term-edit__filt-lbl">SOURCE</span>
      ${sources.map(s => `
        <button type="button" class="term-edit__chip ${s.id === state.source ? 'is-on' : ''}" data-edit-source="${s.id}">
          ${s.label}<span class="term-edit__chip-n">${s.n}</span>
        </button>
      `).join('')}
    </nav>
  `;
}

function renderGrid(all, state){
  const filtered = all.filter(a => {
    if (state.source === 'all')      return true;
    if (state.source === 'magazine') return a.kind === 'magazine' && !a.isExternal;
    if (state.source === 'oracle')   return a.kind === 'oracle';
    if (state.source === 'external') return a.isExternal;
    return true;
  });
  if (!filtered.length){
    return `<div class="term-edit__empty">No dispatches match this filter.</div>`;
  }
  return `<div class="term-edit__cards">${filtered.map(cardHtml).join('')}</div>`;
}

function cardHtml(a){
  const isPdf = /\.pdf(\?|$|#)/i.test(a.href || '');
  const pdfAttrs = isPdf
    ? ` data-pdf-href="${escapeHtml(a.href)}" data-pdf-title="${escapeHtml(a.title)}" data-pdf-kind="${escapeHtml(a.kind)}" data-pdf-date="${escapeHtml(a.date || '')}" data-pdf-kicker="${escapeHtml(a.author)}"`
    : '';
  const subnet = a.subnetId ? subnetById(a.subnetId) : null;
  const snBadge = subnet ? `<span class="term-edit__card-sn">SN${a.subnetId} · ${escapeHtml(subnet.name)}</span>` : '';
  const kindCls = a.isExternal ? 'ext' : a.kind;
  const kindLbl = a.isExternal ? 'EXT' : (a.kind === 'magazine' ? 'MAG' : 'ORC');
  const cat     = (a.category || '').toUpperCase().replace(/-/g, ' ');
  return `
    <a class="term-edit__card" href="${escapeHtml(a.href || '#')}" target="_blank" rel="noopener"${pdfAttrs}>
      <header class="term-edit__card-head">
        <span class="term-edit__card-kind term-edit__card-kind--${kindCls}">${kindLbl}</span>
        <span class="term-edit__card-date">${escapeHtml(a.date || '·')}</span>
      </header>
      <h3 class="term-edit__card-title">${escapeHtml(a.title)}</h3>
      ${a.tagline ? `<p class="term-edit__card-dek">${escapeHtml(a.tagline)}</p>` : ''}
      <footer class="term-edit__card-foot">
        <span class="term-edit__card-author">${escapeHtml(a.author)}</span>
        ${snBadge}
        ${cat ? `<span class="term-edit__card-cat">${cat}</span>` : ''}
      </footer>
    </a>
  `;
}

function wireFilters(root, state, all){
  qsa('[data-edit-source]', root).forEach(btn => {
    btn.addEventListener('click', () => {
      state.source = btn.dataset.editSource;
      qsa('[data-edit-source]', root).forEach(b => b.classList.toggle('is-on', b === btn));
      const g = qs('[data-grid]', root);
      if (g) g.innerHTML = renderGrid(all, state);
    });
  });
}
