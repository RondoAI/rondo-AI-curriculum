/* =================================================================
   SUBNET MAGAZINE, TERMINAL · BRIEFINGS MODE
   -----------------------------------------------------------------
   First mode migration per the sibling-session REIMAGINE plan in
   CLAUDE.md. Replaces the stub in Terminal.js MODE_REGISTRY entry
   `briefings`.

   What this mode is: the desk's morning read. A serif column —
   not a card grid, not a table — leading with today's freshest
   briefing in full (kicker + title + dek + highlight bullets +
   the full set of category tags + the source PDF / GitHub link)
   and archiving older briefings underneath in compact form.

   Why serif column, not card grid: this is reading content. The
   user reads it top-to-bottom like a morning note. Cards work for
   scanning; the briefings deserve to be READ. Bloomberg's morning
   briefings have always been serif text columns, not card grids,
   for exactly this reason.

   Selection contract: BRIEFINGS are network-wide editorial, not
   per-subnet. The mode ignores ctx.selectedId. (If a future
   briefing is tagged to a specific subnet, we can filter then;
   none currently are.)

   Density discipline: matches the magazine's editorial register
   (Archivo serif body, JetBrains Mono kickers, hairline red
   dividers). No graphical decoration that doesn't carry meaning.
   ================================================================= */

import { qs, escapeHtml } from '../../lib/dom.js';
import { BRIEFINGS, latestBriefing, priorBriefings, currencyHeader, daysBetween } from '../../data/briefings.js';

/* Freshness tier thresholds for per-row age pips. Tunables here
   so the desk can re-tune what counts as "fresh" vs "stale" as
   the cadence settles. Per CLAUDE.md Code Quality Bar rule 1. */
const FRESH_DAYS_HOT  = 7;    // <= this: green pip, "live"
const FRESH_DAYS_WARM = 30;   // <= this: amber pip, "still in cycle"
                              // > this: red pip, "archive"

/**
 * Mount the BRIEFINGS mode into the terminal's center pane.
 * @param {HTMLElement} root  the center-pane container the
 *                            terminal shell hands us
 * @param {{selectedId:number,dataLayer:any,select:Function}} ctx
 * @returns {()=>void}        destroy callback
 */
export function mountBriefingsMode(root, _ctx){
  if (!root) return () => {};

  const todayIso = new Date().toISOString().slice(0, 10);
  const lead     = latestBriefing();
  const priors   = priorBriefings(Infinity);
  const headerTxt = lead ? currencyHeader(todayIso, lead.date) : 'NO BRIEFINGS INDEXED';
  const stats     = deriveBriefingStats(BRIEFINGS, todayIso);

  root.innerHTML = template({ lead, priors, headerTxt, stats, todayIso });

  /* No live timers, no event listeners — briefings.js is static
     data at module load and the mode is read-only. The destroy
     callback exists for symmetry with the other modes that DO
     install listeners. */
  return () => {};
}

/* ---------- desk signal stats ----------------------------- */
/* Derives lightweight signal-of-signal stats from the BRIEFINGS
   list. Used to densify the archive section header so the reader
   gets a one-line read of "what the desk has been covering and
   how often" without scrolling the archive.
   Per Signal Taxonomy: never decorative; each stat answers a
   decision question.
   Returns:
     { count, avgCadenceDays, catsCovered, totalHighlights }
   All null/0-safe — empty BRIEFINGS array returns coherent zeros. */
function deriveBriefingStats(briefings, todayIso){
  const total = briefings.length;
  const cats  = new Set();
  let hls = 0;
  for (const b of briefings){
    for (const c of (b.cats || [])) cats.add(c);
    hls += (b.highlights || []).length;
  }
  /* Avg cadence = mean gap between consecutive briefings. n < 2
     can't compute a gap, returns null so the UI emits "·" instead
     of a fake 0d (rule 3: degenerate inputs emit None). */
  let avg = null;
  if (total >= 2){
    const sorted = [...briefings].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
    let sumGaps = 0, gapN = 0;
    for (let i = 1; i < sorted.length; i++){
      const g = daysBetween(sorted[i - 1].date, sorted[i].date);
      if (Number.isFinite(g) && g > 0){ sumGaps += g; gapN++; }
    }
    avg = gapN > 0 ? sumGaps / gapN : null;
  }
  return {
    count:           total,
    avgCadenceDays:  avg,
    catsCovered:     cats.size,
    totalHighlights: hls,
  };
}

/* Map an age-in-days to a freshness CSS modifier. Tier breakpoints
   in FRESH_DAYS_HOT / FRESH_DAYS_WARM. Returns 'hot' / 'warm' /
   'cold' / 'unk'. */
function freshnessTier(ageDays){
  if (ageDays == null || !Number.isFinite(ageDays)) return 'unk';
  if (ageDays <= FRESH_DAYS_HOT)  return 'hot';
  if (ageDays <= FRESH_DAYS_WARM) return 'warm';
  return 'cold';
}

/* ---------- template -------------------------------------- */

function template({ lead, priors, headerTxt, stats, todayIso }){
  if (!lead){
    return `<div class="term-briefings__empty">
      <h2>No briefings indexed yet.</h2>
      <p>The desk hasn't filed a daily briefing in this repository's history. Once <code>briefings/YYYY-MM-DD.md</code> entries land + a row is added to <code>src/data/briefings.js</code>, this mode reads from that index.</p>
    </div>`;
  }

  return `
    <article class="term-briefings">
      <header class="term-briefings__head">
        <span class="term-briefings__kicker"><span class="term-briefings__dot"></span>${escapeHtml(headerTxt)}</span>
        <a class="term-briefings__arch" href="https://github.com/RondoAI/rondo-AI-curriculum/tree/main/briefings" target="_blank" rel="noopener">FULL ARCHIVE ↗</a>
      </header>

      <!-- LEAD briefing — full read, not summary -->
      ${renderLead(lead)}

      <!-- ARCHIVE — compact entries, newest-first -->
      ${priors.length ? `
        <section class="term-briefings__archive">
          <div class="term-briefings__arch-head">
            <span>PRIOR BRIEFINGS · ${priors.length} indexed</span>
            <span class="term-briefings__arch-meta">
              ${stats.avgCadenceDays != null ? `<em>avg ${stats.avgCadenceDays.toFixed(1)}d cadence</em>` : '<em>cadence ·</em>'}
              <em>${stats.catsCovered} cats covered</em>
              <em>${stats.totalHighlights} highlights</em>
            </span>
          </div>
          <ul class="term-briefings__list">
            ${priors.map(b => renderPriorRow(b, todayIso)).join('')}
          </ul>
        </section>
      ` : ''}

      <footer class="term-briefings__foot">
        <span>Briefings curated by the editorial desk · written by Rondo Campbell</span>
        <span class="term-briefings__brand">⌘ BRIEFINGS · DESK READ</span>
      </footer>
    </article>
  `;
}

function renderLead(b){
  const cats = (b.cats || []).map(c => `<span class="term-briefings__cat">${escapeHtml(c.toUpperCase())}</span>`).join('');
  const hl   = (b.highlights || []).map(h => `
    <li class="term-briefings__hl">
      <span class="term-briefings__hl-tag">${escapeHtml(h.tag)}</span>
      <span class="term-briefings__hl-txt">${escapeHtml(h.text)}</span>
    </li>
  `).join('');
  const isPdf = /\.pdf(\?|$|#)/i.test(b.href || '');
  const linkAttrs = isPdf
    ? ` data-pdf-href="${escapeHtml(b.href)}" data-pdf-title="${escapeHtml(b.title)}" data-pdf-kind="oracle" data-pdf-date="${escapeHtml(b.date)}" data-pdf-kicker="Daily Briefing"`
    : '';
  return `
    <section class="term-briefings__lead">
      <div class="term-briefings__lead-date">${escapeHtml(formatLong(b.date))} · ${escapeHtml(b.kicker || 'DAILY BRIEFING')}</div>
      <h1 class="term-briefings__lead-title">${escapeHtml(b.title)}</h1>
      <p class="term-briefings__lead-dek">${escapeHtml(b.dek)}</p>

      <div class="term-briefings__rule"></div>

      <ul class="term-briefings__hls">${hl}</ul>

      <div class="term-briefings__lead-foot">
        <div class="term-briefings__cats">${cats}</div>
        <a class="term-briefings__lead-link" href="${escapeHtml(b.href)}" target="_blank" rel="noopener"${linkAttrs}>READ THE FULL BRIEFING ↗</a>
      </div>
    </section>
  `;
}

function renderPriorRow(b, todayIso){
  const isPdf = /\.pdf(\?|$|#)/i.test(b.href || '');
  const linkAttrs = isPdf
    ? ` data-pdf-href="${escapeHtml(b.href)}" data-pdf-title="${escapeHtml(b.title)}" data-pdf-kind="oracle" data-pdf-date="${escapeHtml(b.date)}" data-pdf-kicker="Daily Briefing"`
    : '';
  const tagPreview = (b.highlights || []).slice(0, 3).map(h =>
    `<span class="term-briefings__row-tag">${escapeHtml(h.tag)}</span>`
  ).join(' ');
  /* Freshness pip — visual cue for "how stale is this archive
     row" so the eye can scan ages without reading every date.
     Hot ≤ 7d, warm ≤ 30d, cold beyond. */
  const ageDays = todayIso ? daysBetween(b.date, todayIso) : null;
  const tier    = freshnessTier(ageDays);
  return `
    <li class="term-briefings__row">
      <a class="term-briefings__row-link" href="${escapeHtml(b.href)}" target="_blank" rel="noopener"${linkAttrs}>
        <span class="term-briefings__row-pip term-briefings__row-pip--${tier}" title="${ageDays == null ? 'undated' : ageDays + 'd ago'}" aria-hidden="true"></span>
        <span class="term-briefings__row-date">${escapeHtml(formatShort(b.date))}</span>
        <span class="term-briefings__row-body">
          <span class="term-briefings__row-title">${escapeHtml(b.title)}</span>
          <span class="term-briefings__row-dek">${escapeHtml(b.dek)}</span>
        </span>
        <span class="term-briefings__row-tags">${tagPreview}</span>
      </a>
    </li>
  `;
}

/* ---------- date formatting ------------------------------ */
function formatLong(iso){
  if (!iso) return '·';
  const [y, m, d] = iso.split('-');
  const mo = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
  return `${parseInt(d, 10)} ${mo[parseInt(m, 10) - 1]} ${y}`;
}
function formatShort(iso){
  if (!iso) return '·';
  const [y, m, d] = iso.split('-');
  const mo = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  return `${parseInt(d, 10)} ${mo[parseInt(m, 10) - 1]} ${y.slice(2)}`;
}
