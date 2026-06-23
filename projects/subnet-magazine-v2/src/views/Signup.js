/* =================================================================
   SUBNET MAGAZINE, SIGN-UP VIEW — PAYWALL REMOVED (2026-05-18)
   -----------------------------------------------------------------
   Rewritten per Rondo's directive ("Get rid of pay wall"). The
   previous tier-aware form (OBSERVER / PRO DESK / INSTITUTIONAL
   pricing + intent capture) is gone. The page now captures email
   into localStorage purely as an OPT-IN newsletter list — no
   tier selection, no purchase intent, no pricing.

   Kept on the route in case anyone has /signup.html bookmarked.
   When real auth ships (Supabase magic-link), the existing intent
   queue can still be drained for newsletter onboarding.
   ================================================================= */

import { html, mount } from '../lib/dom.js';

const PENDING_KEY = 'sbn:signup-pending:v1';

function loadPending(){
  try { return JSON.parse(localStorage.getItem(PENDING_KEY) || '[]'); }
  catch (_) { return []; }
}
function savePending(arr){
  try { localStorage.setItem(PENDING_KEY, JSON.stringify(arr)); } catch (_) {}
}

export function mountSignup(root){
  let mode = 'form';       // 'form' | 'success'
  let savedEmail = '';

  function render(){
    mount(root, html`
      <section class="signup" data-signup-root>
        <header class="signup__head">
          <span class="signup__eyebrow">⊕ SUBNEτ MAGAZINE · NEWSLETTER</span>
          <h1 class="signup__h">${mode === 'success' ? 'You&rsquo;re on the list.' : 'Get the briefing in your inbox.'}</h1>
          <p class="signup__sub">
            ${mode === 'success'
              ? 'We&rsquo;ll email <b>' + savedEmail + '</b> when the daily briefing goes out — and when the magazine ships material new features. The terminal itself is open and free, no sign-up required.'
              : 'The magazine is free for everyone — terminal, paper portfolio, attribution, risk screen, full editorial archive. The newsletter is optional: subscribe to get the daily briefing delivered + early notice of new features.'}
          </p>
        </header>

        ${mode === 'success' ? `
          <div class="signup__success">
            <div class="signup__success-mark" aria-hidden="true">⊕</div>
            <div class="signup__success-h">${savedEmail}</div>
            <div class="signup__success-sub">saved locally · will sync to the desk's send list when delivery ships</div>
            <a class="signup__cta signup__cta--ghost" href="terminal.html">OPEN TERMINAL</a>
          </div>
        ` : `
          <form class="signup__form" data-signup-form novalidate>
            <label class="signup__field">
              <span class="signup__field-lbl">EMAIL</span>
              <input class="signup__input" type="email" name="email" inputmode="email"
                     autocomplete="email" placeholder="you@desk.com" data-signup-email required>
            </label>

            <button type="submit" class="signup__cta signup__cta--primary">SUBSCRIBE</button>
            <p class="signup__note">No password — when the send list ships you'll get a magic-link to confirm. Unsubscribe at any time.</p>

            <details class="signup__back">
              <summary>Backend status &amp; what happens to your email</summary>
              <div class="signup__back-body">
                Newsletter delivery is not yet wired. For now your email is
                captured to localStorage under <code>sbn:signup-pending:v1</code>
                and never leaves your browser. When the send infrastructure
                ships, the queue is drained and you'll get a magic-link to
                confirm. No payment ever — the terminal is free.
              </div>
            </details>
          </form>
        `}

        <footer class="signup__foot">
          <span>Just want to read? <a class="signup__link" href="terminal.html">Open the terminal &rarr;</a></span>
          <span>Today's briefing: <a class="signup__link" href="briefings.html">read it now &rarr;</a></span>
        </footer>
      </section>
    `);

    /* Wire form submit (rebound on every render) */
    const sec  = root.querySelector('[data-signup-root]');
    const form = sec.querySelector('[data-signup-form]');
    if (form){
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailEl = sec.querySelector('[data-signup-email]');
        const email = (emailEl?.value || '').trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
          emailEl?.focus();
          emailEl?.classList.add('is-bad');
          return;
        }
        const pending = loadPending();
        pending.push({
          email, ts: Date.now(),
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
