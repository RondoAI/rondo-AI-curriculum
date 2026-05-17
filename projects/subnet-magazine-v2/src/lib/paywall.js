/* =================================================================
   SUBNET MAGAZINE, SOFT PAYWALL PRIMITIVE
   -----------------------------------------------------------------
   Per the "Monetization & Pricing Plan" in CLAUDE.md: PRO+ features
   render but show a soft paywall overlay for OBSERVER-tier readers.
   They see ENOUGH of the feature to know what they'd unlock, but
   can't fully interact until they upgrade.

   This module gives us one consistent overlay across the magazine.
   Wrap any PRO surface with:

     <div class="paywall">
       <div class="paywall__content">...actual feature...</div>
       <div class="paywall__veil" data-paywall-veil>
         (auto-injected by wirePaywalls)
       </div>
     </div>

   Or programmatically via paywallWrap(htmlString, { tier, feature })
   for inline use.

   When auth lands (Supabase swap), getCurrentTier() reads the user
   record. Until then, getCurrentTier() returns 'free' for everyone
   so PRO overlays show universally — which is the right preview
   state for a launch demo.
   ================================================================= */

const TIER_KEY = 'sbn:tier:v1';

/* Get the current viewer's tier. Until Supabase lands, this reads
   localStorage so power users can toggle for testing.

   In the browser console:
     localStorage.setItem('sbn:tier:v1', 'pro')  // simulate PRO
     localStorage.setItem('sbn:tier:v1', 'enterprise')
     localStorage.removeItem('sbn:tier:v1')     // back to free
*/
export function getCurrentTier(){
  try {
    const t = localStorage.getItem(TIER_KEY);
    if (t === 'pro' || t === 'enterprise') return t;
  } catch (_) {}
  return 'free';
}

const TIER_LEVEL = { free: 0, pro: 1, enterprise: 2 };

/** Returns true if the current viewer can access a feature
 *  gated at `requires` tier or below. */
export function canAccess(requires){
  return TIER_LEVEL[getCurrentTier()] >= TIER_LEVEL[requires];
}

/** Wrap a feature's HTML in a paywall container. If the viewer
 *  already has access, returns the HTML unchanged. Otherwise wraps
 *  with a soft-veil overlay that previews the feature + offers
 *  an upgrade CTA.
 *
 *  @param {string} innerHtml     the PRO feature's rendered HTML
 *  @param {object} opts
 *  @param {'pro'|'enterprise'} opts.requires
 *  @param {string} opts.feature  human-readable name ("RISK SCREEN")
 *  @param {string} opts.pitch    one-liner ("All 53 subnets, sortable risk metrics")
 *  @returns {string} possibly-wrapped HTML
 */
export function paywallWrap(innerHtml, opts){
  if (canAccess(opts.requires)) return innerHtml;
  const tierLbl = opts.requires === 'enterprise' ? 'INSTITUTIONAL' : 'PRO DESK';
  const ctaLbl  = opts.requires === 'enterprise' ? 'TALK TO US' : 'UPGRADE TO PRO';
  return `
    <div class="paywall" data-paywall-root>
      <div class="paywall__content" data-paywall-content>
        ${innerHtml}
      </div>
      <div class="paywall__veil" data-paywall-veil>
        <div class="paywall__veil-inner">
          <div class="paywall__veil-eyebrow">⊕ ${tierLbl} · UPGRADE TO UNLOCK</div>
          <h3 class="paywall__veil-h">${opts.feature}</h3>
          <p class="paywall__veil-pitch">${opts.pitch || ''}</p>
          <a class="paywall__veil-cta" href="pricing.html">${ctaLbl}</a>
          <div class="paywall__veil-note">Free preview · what you see above is the live PRO surface, with interactions disabled.</div>
        </div>
      </div>
    </div>`;
}

/** Wire any [data-paywall-veil] elements found under `root` so the
 *  underlying content is non-interactive (pointer-events: none) and
 *  the CTA receives clicks. Idempotent — safe to call multiple times. */
export function wirePaywalls(root){
  const veils = root.querySelectorAll('[data-paywall-veil]');
  veils.forEach(v => {
    if (v.dataset.wired) return;
    v.dataset.wired = '1';
    /* The CTA is already an <a href>, browser handles navigation —
       nothing more to wire. The veil's pointer-events:auto inside
       its own .paywall__veil-cta lets the click through while
       blocking everything else. */
  });
}
