/* =================================================================
   SUBNET MAGAZINE, ATTR MODE (terminal mode)
   -----------------------------------------------------------------
   Standalone attribution surface — Brinson-Fachler decomposition
   on whichever portfolio preset the reader picks (paper / watchlist /
   top-10-emission / top-20-mcap / all). Distinct from DESK mode
   (which composes paper + attribution) by NOT requiring paper
   positions — useful for "what would the network rotation have
   done to a hypothetical book?"

   Tier: FREE for the default preset (top-10-emission), PRO to
   switch presets to your own watchlist / paper portfolio.
   ================================================================= */

import {
  renderAttribution,
  wireAttribution,
  defaultAttribState,
  computeAttribution,
} from '../dashboard/attribution.js';

const attribState = defaultAttribState();

export function mountAttrMode(root, ctx){
  root.innerHTML = `
    <div class="attr-mode" data-attr-root>
      <header class="attr-mode__head">
        <div>
          <div class="attr-mode__eyebrow">⊕ ATTR · Brinson-Fachler</div>
          <h2 class="attr-mode__h">Where did the alpha come from?</h2>
          <div class="attr-mode__sub">
            Active return decomposed into ALLOCATION effect (sector tilt) +
            SELECTION effect (within-sector picking skill). Pick a portfolio
            and benchmark above — the math recomputes live.
          </div>
        </div>
      </header>
      <div data-attr-headline>${renderHeadlineStrip()}</div>
      <div class="attr-mode__body" data-attr-body>
        ${renderAttribution(attribState)}
      </div>
    </div>`;

  /* The inner attribution panel re-renders itself via wireAttribution's
     onRepaint callback when controls change. We piggyback on that to
     also recompute the headline strip — the strip is derived from
     the exact same computeAttribution(state) the inner panel uses,
     so they always agree on the numbers. */
  function wireAttribPanel(){
    wireAttribution(root, attribState, () => {
      const headlineEl = root.querySelector('[data-attr-headline]');
      if (headlineEl) headlineEl.innerHTML = renderHeadlineStrip();
      wireAttribPanel();
    });
  }
  wireAttribPanel();

  return () => {};
}

/* ---------- headline strip ----------------------------- */
/* Four-up chips computed from computeAttribution(attribState):
   - ACTIVE RETURN (the bottom-line answer)
   - ALLOCATION EFFECT (sector tilt contribution)
   - SELECTION EFFECT (within-sector pick contribution)
   - LEAD CONTRIBUTOR (the single subnet driving the most active
     return — top5[0])
   The reader gets the BF decomposition's headline before
   scrolling into the donut + sector bars. Same compute path as
   the inner panel — no risk of disagreement. */
function renderHeadlineStrip(){
  let a;
  try { a = computeAttribution(attribState); } catch (_) { return ''; }
  if (!a) return '';

  /* fmtPct: returns aren't percents, they're ratios — multiply by
     100 only for the display. The inner panel does the same. */
  const fmtPctRatio = v => !Number.isFinite(v) ? '·' : (v >= 0 ? '+' : '') + (v * 100).toFixed(2) + '%';
  const sign        = v => !Number.isFinite(v) ? 'is-flat' : (v > 0.0001 ? 'is-up' : (v < -0.0001 ? 'is-down' : 'is-flat'));

  const lead = a.top5 && a.top5[0];
  const leadActive = lead ? lead.activeContr : null;
  const fallback = a.isFallback ? ' <em>(fallback preset)</em>' : '';

  return `
    <div class="attr-mode__stats" role="region" aria-label="Attribution headline">
      <div class="attr-mode__stat">
        <span class="attr-mode__stat-lbl">ACTIVE RETURN</span>
        <span class="attr-mode__stat-val ${sign(a.r_active)}">${fmtPctRatio(a.r_active)}</span>
        <span class="attr-mode__stat-sub">
          <em>portfolio − benchmark, the bottom line</em>
        </span>
      </div>
      <div class="attr-mode__stat">
        <span class="attr-mode__stat-lbl">ALLOCATION EFFECT</span>
        <span class="attr-mode__stat-val ${sign(a.allocEffect)}">${fmtPctRatio(a.allocEffect)}</span>
        <span class="attr-mode__stat-sub">
          <em>sector tilt vs benchmark${fallback}</em>
        </span>
      </div>
      <div class="attr-mode__stat">
        <span class="attr-mode__stat-lbl">SELECTION EFFECT</span>
        <span class="attr-mode__stat-val ${sign(a.selectEffect)}">${fmtPctRatio(a.selectEffect)}</span>
        <span class="attr-mode__stat-sub">
          <em>within-sector pick skill</em>
        </span>
      </div>
      <div class="attr-mode__stat">
        <span class="attr-mode__stat-lbl">LEAD CONTRIBUTOR</span>
        <span class="attr-mode__stat-val ${sign(leadActive)}">${lead ? 'SN' + lead.netuid : '·'}</span>
        <span class="attr-mode__stat-sub">
          ${lead
            ? `<em>${fmtPctRatio(leadActive)} · ${escapeSimple(lead.name)}</em>`
            : '<em>no positions in active set</em>'}
        </span>
      </div>
    </div>`;
}

/* Defensive tag-stripper for the lead-contributor name. The data
   comes from local SUBNETS.js so it's trusted — but per Code
   Quality Bar rule 5, validate at boundaries even when sources
   are trusted, since a future bad-edit slipping a < or & would
   break the markup silently otherwise. */
function escapeSimple(v){
  return String(v == null ? '' : v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
