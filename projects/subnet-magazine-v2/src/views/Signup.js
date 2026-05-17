/* =================================================================
   SUBNET MAGAZINE, SIGN-UP VIEW
   -----------------------------------------------------------------
   The conversion catch — captures email + selected tier into
   localStorage as a "pending intent" until the Supabase auth +
   Stripe billing flow lands (see CLAUDE.md Monetization plan).

   When the user hits /signup?tier=pro from the pricing page, the
   tier comes pre-selected. They give an email + (eventually) magic-
   link verify. For now we capture intent locally and surface a
   "watch this space, we'll email you when sign-up opens" success
   message. The pending intents survive in localStorage so when
   real auth ships we can drain the queue.

   Marketing copy is tier-aware: PRO and ENTERPRISE see different
   pitches because their decision criteria differ (cost-justified
   research tool vs. team-procurement-grade software).
   ================================================================= */

import { html, mount } from '../lib/dom.js';

const PENDING_KEY = 'sbn:signup-pending:v1';

const COPY = {
  free: {
    h: 'Open OBSERVER · no payment',
    sub: 'Live markets, daily briefing previews, a 5-slot watchlist. Free, forever.',
    cta: 'OPEN OBSERVER',
    note: 'You\'ll get a magic link to verify your email — no password to remember.',
  },
  pro: {
    h: 'Open PRO DESK · the full terminal',
    sub: '$29/mo (or $24/mo annual). Unlimited charts, your paper portfolio synced, attribution on your bets, real alerts. Cancel anytime.',
    cta: 'START PRO',
    note: '14-day money-back on monthly. Annual prorated after.',
  },
  enterprise: {
    h: 'Talk to the desk · INSTITUTIONAL',
    sub: '$249/mo, custom contracts. Live institutional API data, team workspaces, white-label dashboards, programmatic access. We\'ll reach out to walk through the stack.',
    cta: 'REQUEST DEMO',
    note: 'We respond within one business day to demo requests.',
  },
};

function loadPending(){
  try { return JSON.parse(localStorage.getItem(PENDING_KEY) || '[]'); }
  catch (_) { return []; }
}
function savePending(arr){
  try { localStorage.setItem(PENDING_KEY, JSON.stringify(arr)); } catch (_) {}
}

function tierFromUrl(){
  try {
    const url = new URL(window.location.href);
    const t = (url.searchParams.get('tier') || 'pro').toLowerCase();
    if (t === 'free' || t === 'observer') return 'free';
    if (t === 'enterprise' || t === 'institutional') return 'enterprise';
    return 'pro';
  } catch (_) { return 'pro'; }
}

export function mountSignup(root){
  let tier = tierFromUrl();
  let mode = 'form';   // 'form' | 'success'
  let savedEmail = '';

  function copy(){ return COPY[tier] || COPY.pro; }

  function render(){
    const c = copy();
    mount(root, html`
      <section class="signup" data-signup-root>
        <header class="signup__head">
          <span class="signup__eyebrow">⊕ SUBNETT MAGAZINE · SIGN UP</span>
          <h1 class="signup__h">${mode === 'success' ? 'You&rsquo;re on the list.' : c.h}</h1>
          <p class="signup__sub">
            ${mode === 'success'
              ? 'We&rsquo;ll email <b>' + savedEmail + '</b> when sign-up opens — and you&rsquo;ll keep your selected tier. Until then, the OBSERVER tier is open and read-only at every page.'
              : c.sub}
          </p>
        </header>

        ${mode === 'success' ? `
          <div class="signup__success">
            <div class="signup__success-mark" aria-hidden="true">⊕</div>
            <div class="signup__success-h">${savedEmail}</div>
            <div class="signup__success-sub">tier: <b>${tier.toUpperCase()}</b> · saved locally · will sync when auth ships</div>
            <a class="signup__cta signup__cta--ghost" href="terminal.html">OPEN TERMINAL</a>
            <a class="signup__cta signup__cta--link" href="pricing.html">change tier</a>
          </div>
        ` : `
          <form class="signup__form" data-signup-form novalidate>
            <div class="signup__tier-row">
              <span class="signup__tier-lbl">TIER</span>
              <div class="signup__tier-chips">
                <button type="button" class="signup__tier-chip ${tier === 'free' ? 'is-on' : ''}"      data-tier="free">OBSERVER</button>
                <button type="button" class="signup__tier-chip ${tier === 'pro' ? 'is-on' : ''}"       data-tier="pro">PRO DESK</button>
                <button type="button" class="signup__tier-chip ${tier === 'enterprise' ? 'is-on' : ''}"data-tier="enterprise">INSTITUTIONAL</button>
              </div>
            </div>

            <label class="signup__field">
              <span class="signup__field-lbl">EMAIL</span>
              <input class="signup__input" type="email" name="email" inputmode="email"
                     autocomplete="email" placeholder="you@desk.com" data-signup-email required>
            </label>

            <button type="submit" class="signup__cta signup__cta--primary">${c.cta}</button>
            <p class="signup__note">${c.note}</p>

            <details class="signup__back">
              <summary>Backend status &amp; what happens to your email</summary>
              <div class="signup__back-body">
                Auth is not yet wired (CLAUDE.md "Monetization &amp; Pricing Plan" recommends
                Supabase + Stripe; pending Rondo green-light). For now your email is captured
                to localStorage under <code>sbn:signup-pending:v1</code> and never leaves your
                browser. When the real flow ships, the queue is drained and you'll get a
                magic-link to confirm.
              </div>
            </details>
          </form>
        `}

        <footer class="signup__foot">
          <span>Already on the list? <a class="signup__link" href="terminal.html">Open the terminal &rarr;</a></span>
          <span>Reading first? <a class="signup__link" href="pricing.html">See all tiers &rarr;</a></span>
        </footer>
      </section>
    `);

    /* Wire interactions (rebound on every render) */
    const sec = root.querySelector('[data-signup-root]');
    sec.querySelectorAll('[data-tier]').forEach(btn => {
      btn.addEventListener('click', () => {
        tier = btn.dataset.tier;
        try {
          const url = new URL(window.location.href);
          url.searchParams.set('tier', tier);
          window.history.replaceState({}, '', url);
        } catch (_) {}
        render();
      });
    });
    const form = sec.querySelector('[data-signup-form]');
    if (form){
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailEl = sec.querySelector('[data-signup-email]');
        const email = (emailEl?.value || '').trim().toLowerCase();
        /* Minimal email shape check — server-side validates fully
           when auth lands. */
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
          emailEl?.focus();
          emailEl?.classList.add('is-bad');
          return;
        }
        const pending = loadPending();
        pending.push({
          email, tier, ts: Date.now(),
          ua: navigator.userAgent,
          ref: document.referrer || null,
        });
        savePending(pending);
        savedEmail = email;
        mode = 'success';
        render();
      });
    }
  }

  render();
  return () => {};
}
