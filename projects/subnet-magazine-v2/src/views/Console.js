/* =================================================================
   SUBNET MAGAZINE — SYSTEM CONSOLE
   -----------------------------------------------------------------
   A command-line readout pinned bottom-left of every page. It is
   the site staying true to its "research terminal" identity:
   instead of silent background fetches, the data layer narrates
   itself — boot sequence, then a live log line every time a real
   feed lands (tao:market, tao:subnets, tao:chain, tao:validators).

   Fully self-contained: it injects its own scoped <style> once and
   appends its own fixed element to <body>, so it needs no mount
   point and no extra stylesheet link. Click the header to
   collapse / expand. Honest by construction — every line is a real
   event, never a fake one.
   ================================================================= */

import { money } from '../lib/format.js';

const STYLE_ID = 'sbnt-console-style';
const MAX_LINES = 60;

const CSS = `
.sbnt-console{
  position: fixed; left: 0; bottom: 0; z-index: 45;
  width: min(360px, 92vw);
  font-family: var(--f-mono, monospace);
  background: rgba(5,2,3,.94);
  border: 1px solid var(--c-rule-2, rgba(255,30,60,.22));
  border-left: 0; border-bottom: 0;
  border-top-right-radius: 3px;
  backdrop-filter: blur(6px);
  box-shadow: 0 -8px 40px rgba(0,0,0,.55);
  user-select: none;
}
.sbnt-console__bar{
  display: flex; align-items: center; gap: 8px;
  padding: 5px 10px;
  cursor: pointer;
  border-bottom: 1px solid var(--c-rule, rgba(255,30,60,.10));
  font-size: 10.5px; letter-spacing: .04em;
  color: var(--c-ink-2, #C8A8AD);
}
.sbnt-console__dot{
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--c-up, #00E5A8);
  box-shadow: 0 0 6px var(--c-up, #00E5A8);
}
.sbnt-console__name{ color: var(--c-red-1, #FF4D60); }
.sbnt-console__push{ margin-left: auto; }
.sbnt-console__toggle{
  color: var(--c-ink-3, #8B6B70);
  font-size: 11px; line-height: 1;
}
.sbnt-console__body{
  height: 132px; overflow-y: auto; overflow-x: hidden;
  padding: 6px 10px 8px;
  font-size: 10.5px; line-height: 1.55;
  scrollbar-width: thin;
}
.sbnt-console.is-collapsed .sbnt-console__body{ display: none; }
.sbnt-console.is-collapsed{ border-top-right-radius: 3px; }
.sbnt-cl{ display: flex; gap: 7px; white-space: nowrap; }
.sbnt-cl__t{ color: var(--c-ink-4, #4A2A30); }
.sbnt-cl__p{ color: var(--c-red, #FF1E3C); }
.sbnt-cl__m{ color: var(--c-ink-2, #C8A8AD); overflow: hidden; text-overflow: ellipsis; }
.sbnt-cl--ok   .sbnt-cl__m b{ color: var(--c-up, #00E5A8); font-weight: 600; }
.sbnt-cl--warn .sbnt-cl__m{ color: var(--c-warn, #FF8C42); }
.sbnt-cl--sys  .sbnt-cl__m{ color: var(--c-red-2, #FF7A88); }
.sbnt-console__cursor{
  display: inline-block; width: 6px; height: 11px;
  background: var(--c-red, #FF1E3C);
  vertical-align: -1px; margin-left: 2px;
  animation: sbnt-blink 1.1s steps(1) infinite;
}
@keyframes sbnt-blink{ 0%,50%{ opacity: 1 } 50.01%,100%{ opacity: 0 } }
@media (max-width: 560px){
  .sbnt-console{ width: 100vw; border-right: 0; border-top-right-radius: 0; }
  .sbnt-console__body{ height: 104px; }
}
@media (prefers-reduced-motion: reduce){
  .sbnt-console__cursor{ animation: none; }
}
`;

function injectStyle(){
  if (document.getElementById(STYLE_ID)) return;
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = CSS;
  document.head.appendChild(s);
}

function stamp(){
  const d = new Date();
  const z = n => String(n).padStart(2, '0');
  return `${z(d.getUTCHours())}:${z(d.getUTCMinutes())}:${z(d.getUTCSeconds())}`;
}

/**
 * Mount the system console. Self-injecting — no DOM mount point
 * needed.
 * @param {{subscribe:Function, get:Function}|null} [dataLayer]
 * @returns {{destroy:()=>void}}
 */
export function mountConsole(dataLayer = null){
  injectStyle();

  const el = document.createElement('aside');
  el.className = 'sbnt-console';
  el.setAttribute('aria-label', 'System console');
  el.innerHTML = `
    <div class="sbnt-console__bar" data-role="bar">
      <span class="sbnt-console__dot"></span>
      <span class="sbnt-console__name">SBNT</span>
      <span>://console</span>
      <span class="sbnt-console__push"></span>
      <span class="sbnt-console__toggle" data-role="toggle">[ − ]</span>
    </div>
    <div class="sbnt-console__body" data-role="body"></div>
  `;
  document.body.appendChild(el);

  const body   = el.querySelector('[data-role="body"]');
  const bar    = el.querySelector('[data-role="bar"]');
  const toggle = el.querySelector('[data-role="toggle"]');
  let cursor   = null;

  function log(msg, kind = ''){
    if (!body) return;
    if (cursor && cursor.parentElement) cursor.parentElement.remove();
    const line = document.createElement('div');
    line.className = 'sbnt-cl' + (kind ? ` sbnt-cl--${kind}` : '');
    line.innerHTML = `<span class="sbnt-cl__t">${stamp()}</span>`
                   + `<span class="sbnt-cl__p">›</span>`
                   + `<span class="sbnt-cl__m">${msg}</span>`;
    body.appendChild(line);
    /* re-attach the blinking cursor on the freshest line */
    cursor = document.createElement('span');
    cursor.className = 'sbnt-console__cursor';
    line.querySelector('.sbnt-cl__m').appendChild(cursor);
    while (body.children.length > MAX_LINES) body.firstElementChild.remove();
    body.scrollTop = body.scrollHeight;
  }

  /* ---------- collapse / expand ---------- */
  bar.addEventListener('click', () => {
    const collapsed = el.classList.toggle('is-collapsed');
    toggle.textContent = collapsed ? '[ + ]' : '[ − ]';
  });

  /* ---------- boot sequence ---------- */
  const boot = [
    ['SBNT terminal · v2.0.0', 'sys'],
    ['session open · research desk', 'sys'],
    ['data layer ▸ tao market cap + taostats', ''],
    ['awaiting live feeds …', ''],
  ];
  let bi = 0;
  const bootTimer = setInterval(() => {
    if (bi >= boot.length){ clearInterval(bootTimer); return; }
    log(boot[bi][0], boot[bi][1]);
    bi++;
  }, 260);

  /* ---------- live feed narration ---------- */
  const unsubs = [];
  if (dataLayer){
    const seen = {};
    const once = (ch, fn) => {
      unsubs.push(dataLayer.subscribe(ch, d => {
        const first = !seen[ch];
        seen[ch] = true;
        fn(d, first);
      }));
    };
    once('tao:market', (d, first) => {
      if (!d || d.price == null) return;
      log(`tao:market <b>✓</b> τ ${money(d.price)}`, 'ok');
      if (first) log('feed online · market', '');
    });
    once('tao:subnets', d => {
      if (!Array.isArray(d)) return;
      log(`tao:subnets <b>✓</b> ${d.length} subnets synced`, 'ok');
    });
    once('tao:chain', d => {
      if (!d || d.blockNumber == null) return;
      log(`tao:chain <b>✓</b> block ${d.blockNumber.toLocaleString('en-US')}`, 'ok');
    });
    once('tao:validators', d => {
      if (!Array.isArray(d)) return;
      log(`tao:validators <b>✓</b> ${d.length} hotkeys`, 'ok');
    });
    /* surface anything already cached at mount */
    setTimeout(() => {
      if (dataLayer.get && !dataLayer.get('tao:market')){
        log('feeds quiet — running on seed + proxy retry', 'warn');
      }
    }, 6000);
  }

  return {
    destroy(){
      clearInterval(bootTimer);
      unsubs.forEach(u => { try { u(); } catch (_) {} });
      el.remove();
    },
  };
}
