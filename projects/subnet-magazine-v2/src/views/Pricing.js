/* =================================================================
   SUBNET MAGAZINE, PRICING VIEW
   -----------------------------------------------------------------
   The conversion surface. Three-tier card grid: FREE / PRO / ENTERPRISE.
   Visual register matches the rest of the terminal — black + red,
   sharp 0-radius corners, hairline borders, no SaaS-default shadows,
   no rounded pills.

   What sells (besides the design):
     - Side-by-side feature matrix so the upgrade ladder is obvious
     - SOCIAL PROOF chips at the top ("trusted by N readers / desks")
     - PRO column visually pre-recommended (red accent + scale-up)
     - Annual toggle showing the 2-month-free saving
     - Footer FAQ for the high-friction questions
     - One CTA per tier, action-oriented copy

   Auth + checkout aren't wired yet (waiting on the Supabase decision
   — see CLAUDE.md "Monetization & Pricing Plan"). The CTAs route to
   placeholder #signup-pro / #signup-enterprise / #signup-free anchors
   so when auth lands the wiring is a one-line href swap.
   ================================================================= */

import { html, mount } from '../lib/dom.js';

const TIERS = [
  {
    key: 'free',
    name: 'OBSERVER',
    price: '$0',
    period: 'forever',
    pitch: 'Read the network. Daily briefings, top markets, a starter watchlist.',
    cta: { label: 'START FREE', href: 'signup.html?tier=free', kind: 'ghost' },
    features: [
      { lbl: 'Live subnet markets',                yes: true,  note: 'all 53, read-only' },
      { lbl: 'Per-subnet 30D chart',               yes: true,  note: '30D window cap' },
      { lbl: 'Watchlist',                          yes: true,  note: 'up to 5 subnets' },
      { lbl: 'Daily briefing preview',             yes: true,  note: 'first 200 words' },
      { lbl: 'Oracle research articles',           yes: true,  note: '3 / month' },
      { lbl: 'Correlation + cluster analytics',    yes: true,  note: 'static, weekly' },
      { lbl: 'Paper portfolio',                    yes: false, note: 'PRO' },
      { lbl: 'Risk screen (Sharpe, vol, β, DD)',   yes: false, note: 'PRO' },
      { lbl: 'Brinson-Fachler attribution',        yes: false, note: 'PRO' },
      { lbl: 'Custom alerts',                      yes: false, note: 'PRO' },
      { lbl: 'TaoStats live API data',             yes: false, note: 'ENTERPRISE' },
      { lbl: 'Team workspaces + messaging',        yes: false, note: 'ENTERPRISE' },
      { lbl: 'API access',                         yes: false, note: 'ENTERPRISE' },
    ],
  },
  {
    key: 'pro',
    name: 'PRO DESK',
    price: '$29',
    annualPrice: '$24',
    period: '/month',
    annualNote: '$288/yr · 2 months free',
    pitch: 'The full terminal. Unlimited charts, your paper portfolio synced, risk + attribution on your bets, real alerts.',
    cta: { label: 'UPGRADE TO PRO', href: 'signup.html?tier=pro', kind: 'primary' },
    badge: 'RECOMMENDED',
    features: [
      { lbl: 'Everything in OBSERVER',             yes: true,  bold: true },
      { lbl: 'Unlimited charts (1D → 1Y)',         yes: true },
      { lbl: 'Unlimited watchlists, unlimited subnets per watchlist', yes: true },
      { lbl: 'Full oracle research archive',       yes: true },
      { lbl: 'Daily briefings (full text)',        yes: true },
      { lbl: 'Paper portfolio · cloud-synced',     yes: true,  note: 'access from any device' },
      { lbl: 'Brinson-Fachler attribution on YOUR positions', yes: true },
      { lbl: 'Risk screen (Sharpe, vol, β, max-DD)', yes: true },
      { lbl: 'Custom alerts (price, news, wallet)', yes: true },
      { lbl: '⌘K command palette · full grammar',  yes: true },
      { lbl: 'COMPARE + HIST modals',              yes: true },
      { lbl: 'Per-subnet wallet tracker',          yes: true },
      { lbl: 'Export to CSV / PDF',                yes: true },
      { lbl: 'TaoStats live API data',             yes: false, note: 'ENTERPRISE' },
      { lbl: 'Team workspaces + messaging',        yes: false, note: 'ENTERPRISE' },
    ],
  },
  {
    key: 'enterprise',
    name: 'INSTITUTIONAL',
    price: '$249',
    annualPrice: '$199',
    period: '/month',
    annualNote: '$2,388/yr · 2 months free · or custom contract',
    pitch: 'For funds and trading desks. Live institutional data, team workspaces, programmatic access, white-label dashboards.',
    cta: { label: 'TALK TO US', href: 'signup.html?tier=enterprise', kind: 'ghost' },
    features: [
      { lbl: 'Everything in PRO DESK',             yes: true,  bold: true },
      { lbl: 'TaoStats live institutional API',    yes: true,  note: 'real chain data, intraday' },
      { lbl: 'CoinGecko Pro feed (cross-asset)',   yes: true },
      { lbl: 'Custom analytics requests',          yes: true,  note: 'factor models, back-tests' },
      { lbl: 'Team workspaces (shared portfolios)', yes: true },
      { lbl: 'Internal Slack-style messaging',     yes: true,  note: 'subnet channels + DMs' },
      { lbl: 'White-label dashboards',             yes: true,  note: 'embed in fund reports' },
      { lbl: 'Full REST + WebSocket API access',   yes: true },
      { lbl: 'Bring-your-own TaoStats key option', yes: true },
      { lbl: 'Priority research desk access',      yes: true,  note: 'private briefings' },
      { lbl: 'SOC 2 / SLA on data freshness',      yes: true },
      { lbl: 'Dedicated success manager',          yes: true },
    ],
  },
];

const FAQ = [
  {
    q: 'Why isn\'t this free?',
    a: 'Free terminals get free-tier data. Subnet Magazine pulls live chain feeds, runs Brinson-Fachler attribution, ships daily editorial, and keeps a real-time index of 53 subnets. The real cost is the data layer + the editorial desk — covering both takes paying readers.',
  },
  {
    q: 'What\'s in the OBSERVER free tier?',
    a: 'Enough to see if the magazine is for you: live markets read-only, 30-day charts on any subnet, a 5-slot watchlist, daily briefing previews, and the static weekly analytics. No paper portfolio, no risk screen, no alerts.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Monthly plans cancel at any time and you keep PRO until the period ends. Annual plans are refundable in the first 14 days, prorated after.',
  },
  {
    q: 'Do you take crypto?',
    a: 'Yes — TAO, USDC, USDT, ETH for any tier. Monthly via on-chain subscription contract; annual via single transfer with invoice.',
  },
  {
    q: 'What about the editorial archive?',
    a: 'Free readers get 3 articles per month and Oracle Research previews. PRO unlocks the full archive (currently 60+ pieces, growing weekly). ENTERPRISE adds private desk briefings filed for specific institutions.',
  },
  {
    q: 'Why ENTERPRISE for the live data?',
    a: 'The TaoStats API has rate-limits and per-seat licensing for institutional users. The ENTERPRISE plan bundles that license + the analytics on top. Smaller teams can use the bring-your-own-key option to start.',
  },
];

const checkSvg = `<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
  <path d="M2 7 L6 11 L12 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
const xSvg = `<svg width="11" height="11" viewBox="0 0 11 11" aria-hidden="true">
  <path d="M2 2 L9 9 M9 2 L2 9" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
</svg>`;

function renderTier(t){
  const isPro = t.key === 'pro';
  const featureRows = t.features.map(f => `
    <li class="pricing-feature ${f.yes ? 'is-yes' : 'is-no'}">
      <span class="pricing-feature__mark">${f.yes ? checkSvg : xSvg}</span>
      <span class="pricing-feature__lbl ${f.bold ? 'is-bold' : ''}">${f.lbl}</span>
      ${f.note ? `<span class="pricing-feature__note">${f.note}</span>` : ''}
    </li>`).join('');
  return `
    <article class="pricing-tier ${isPro ? 'pricing-tier--pro' : ''}" data-tier="${t.key}">
      ${t.badge ? `<div class="pricing-tier__badge">${t.badge}</div>` : ''}
      <header class="pricing-tier__head">
        <h2 class="pricing-tier__name">${t.name}</h2>
        <div class="pricing-tier__price-row">
          <span class="pricing-tier__price" data-monthly="${t.price}" data-annual="${t.annualPrice || t.price}">${t.price}</span>
          <span class="pricing-tier__period">${t.period}</span>
        </div>
        ${t.annualNote ? `<div class="pricing-tier__annual-note" data-annual-only style="display:none">${t.annualNote}</div>` : ''}
        <p class="pricing-tier__pitch">${t.pitch}</p>
        <a class="pricing-cta pricing-cta--${t.cta.kind}" href="${t.cta.href}">${t.cta.label}</a>
      </header>
      <ul class="pricing-features">${featureRows}</ul>
    </article>`;
}

export function mountPricing(root){
  mount(root, html`
    <section class="pricing" data-pricing-root>
      <header class="pricing__head">
        <div class="pricing__eyebrow">⊕ PRICING · subscribe to the magazine</div>
        <h1 class="pricing__h">A research terminal for decentralized AI.<br/>Three tiers. Cancel anytime.</h1>
        <div class="pricing__sub">
          Live Bittensor markets, Brinson-Fachler attribution on your paper book, image-rich news cards
          scored for every subnet, and a daily editorial desk. Same pixel discipline as Bloomberg, priced
          for the rest of us.
        </div>
        <div class="pricing__social">
          <span class="pricing__chip"><b>2,400+</b> readers tracking watchlists</span>
          <span class="pricing__chip"><b>53</b> subnets indexed live</span>
          <span class="pricing__chip"><b>67</b> dispatches in the archive</span>
          <span class="pricing__chip"><b>$3.42B</b> TAO market on the board</span>
        </div>
        <div class="pricing__toggle">
          <button type="button" class="pricing__toggle-btn is-on" data-period="monthly">MONTHLY</button>
          <button type="button" class="pricing__toggle-btn"        data-period="annual">ANNUAL <span class="pricing__toggle-save">SAVE 2 MO</span></button>
        </div>
      </header>

      <div class="pricing__grid">
        ${TIERS.map(renderTier).join('')}
      </div>

      <section class="pricing__faq">
        <h2 class="pricing__faq-h">⊕ FAQ</h2>
        <div class="pricing__faq-list">
          ${FAQ.map(f => `
            <details class="pricing__faq-item">
              <summary class="pricing__faq-q">${f.q}</summary>
              <div class="pricing__faq-a">${f.a}</div>
            </details>`).join('')}
        </div>
      </section>

      <footer class="pricing__foot">
        <div class="pricing__foot-h">Still deciding?</div>
        <div class="pricing__foot-sub">Open the live terminal. The OBSERVER tier doesn't need a sign-up.</div>
        <div class="pricing__foot-ctas">
          <a class="pricing-cta pricing-cta--primary" href="terminal.html">OPEN TERMINAL ↗</a>
          <a class="pricing-cta pricing-cta--ghost" href="dashboard.html">SEE DASHBOARD ↗</a>
        </div>
      </footer>
    </section>
  `);

  // Wire monthly / annual toggle
  const periodBtns = root.querySelectorAll('[data-period]');
  const priceEls   = root.querySelectorAll('[data-monthly]');
  const noteEls    = root.querySelectorAll('[data-annual-only]');
  periodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const period = btn.dataset.period;
      periodBtns.forEach(b => b.classList.toggle('is-on', b.dataset.period === period));
      priceEls.forEach(p => {
        p.textContent = period === 'annual'
          ? p.dataset.annual
          : p.dataset.monthly;
      });
      noteEls.forEach(n => {
        n.style.display = period === 'annual' ? '' : 'none';
      });
    });
  });

  return () => {};
}
