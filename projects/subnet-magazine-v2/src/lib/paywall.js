/* =================================================================
   SUBNET MAGAZINE, PAYWALL PRIMITIVE — DISABLED (2026-05-18)
   -----------------------------------------------------------------
   Per Rondo's directive ("Get rid of pay wall"), the paywall is
   torn out of the user-facing experience. All features that were
   previously PRO/INSTITUTIONAL-gated are now accessible to every
   reader.

   The module is KEPT (not deleted) so existing call sites
   (paywallWrap(...) / canAccess(...)) continue to work without
   churning every consumer file. canAccess() now returns true
   unconditionally, which makes paywallWrap() a no-op pass-through
   that returns the inner HTML as-is — same behavior as if the
   reader was already on the highest tier.

   If we ever want to re-introduce tier gating, the only function
   that needs to change is canAccess(). All call sites stay intact.
   ================================================================= */

const TIER_KEY = 'sbn:tier:v1';

/* Retained for compatibility — readers without a stored tier are
   reported as 'enterprise' so any downstream logic that branches
   on tier reads the most-permissive state. localStorage override
   still respected for diagnostic purposes. */
export function getCurrentTier(){
  try {
    const t = localStorage.getItem(TIER_KEY);
    if (t === 'pro' || t === 'enterprise' || t === 'free') return t;
  } catch (_) {}
  return 'enterprise';
}

const TIER_LEVEL = { free: 0, pro: 1, enterprise: 2 };

/** Always true after the 2026-05-18 paywall removal. Kept on the
 *  public API so existing call sites compile without churn. */
export function canAccess(_requires){
  return true;
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
          <a class="paywall__veil-cta" href="signup.html?tier=${opts.requires}">${ctaLbl}</a>
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
