/* =================================================================
   SUBNET MAGAZINE — BITTENSOR FIELD MANUAL CONSOLE
   -----------------------------------------------------------------
   A research-terminal-styled FAQ pinned to the bottom of every
   page. The site's "how to actually do this" companion: mining,
   validating, registering a subnet, wallets, dTAO, weights,
   deregistration, halving. Switch topic via the chip row at the
   top; the body re-renders.

   Fully self-contained: it injects its own scoped <style> once and
   appends its own fixed element to <body>, so it needs no mount
   point and no extra stylesheet link. Click the bar to collapse.
   ================================================================= */

import { FIELD_MANUAL } from '../data/bittensor-faq.js';

const STYLE_ID = 'sbnt-console-style';

const CSS = `
/* 2028-AI bottom dock. A pinned oracle agent that surfaces the
   field-manual content on demand, but signals its presence with a
   stronger red top-edge glow, a periodic scan-line, and a brand
   tag that reads as an addressable agent endpoint. */
.sbnt-console{
  position: fixed; left: 0; bottom: 0; z-index: 45;
  width: min(640px, 100vw);
  font-family: var(--f-mono, monospace);
  background:
    radial-gradient(120% 80% at 18% 0%, rgba(255,30,60,.18), transparent 60%),
    linear-gradient(180deg, rgba(20,5,9,.98), rgba(5,2,3,.98));
  border: 1px solid var(--c-rule-3, rgba(255,30,60,.36));
  border-left: 0; border-bottom: 0;
  border-top-right-radius: 4px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow:
    0 -2px 0 rgba(255,30,60,.18) inset,
    0 -16px 60px rgba(255,30,60,.18),
    0 -8px 40px rgba(0,0,0,.65);
  isolation: isolate;
  overflow: hidden;
}
/* a bright 1-px red rail at the very top edge — the bar declares
   itself before you read the text */
.sbnt-console__edge{
  position: absolute; top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg,
    transparent 0, var(--c-red, #FF1E3C) 8%,
    var(--c-red-1, #FF4D60) 30%,
    var(--c-red, #FF1E3C) 70%, transparent 100%);
  pointer-events: none;
  z-index: 2;
}
/* a slow horizontal scan-line sweeping across the bar every 6 s —
   the "live agent" signal without flashing chrome everywhere */
.sbnt-console__scan{
  position: absolute; top: 0; bottom: 0; left: -120px;
  width: 120px;
  background: linear-gradient(90deg,
    transparent, rgba(255,30,60,.16) 50%, transparent 100%);
  pointer-events: none;
  z-index: 1;
  animation: sbntScan 6s linear infinite;
}
@keyframes sbntScan{
  0%   { transform: translateX(0); }
  100% { transform: translateX(calc(100vw + 120px)); }
}
@media (prefers-reduced-motion: reduce){
  .sbnt-console__scan{ animation: none; }
}

.sbnt-console__bar{
  position: relative; z-index: 3;
  display: flex; align-items: center; gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  border-bottom: 1px solid var(--c-rule-2, rgba(255,30,60,.22));
  font-size: 12px; letter-spacing: .04em;
  color: var(--c-ink-2, #C8A8AD);
  user-select: none;
}
.sbnt-console__dot{
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--c-up, #00E5A8);
  box-shadow: 0 0 8px var(--c-up, #00E5A8), 0 0 14px rgba(0,229,168,.5);
  animation: sbntDotPulse 1.8s ease-in-out infinite;
}
@keyframes sbntDotPulse{
  0%, 100% { opacity: 1; transform: scale(1); }
  50%      { opacity: .55; transform: scale(.78); }
}
.sbnt-console__name{
  color: var(--c-ink-1, #F5E5E8);
  font-weight: 800;
  letter-spacing: .14em;
  text-transform: uppercase;
  font-size: 13px;
  text-shadow: 0 0 10px rgba(255,30,60,.45);
}
.sbnt-console__sep{ color: var(--c-red, #FF1E3C); font-weight: 700; }
.sbnt-console__net{
  color: var(--c-red-1, #FF4D60);
  font-weight: 700;
  letter-spacing: .04em;
}
.sbnt-console__title{ color: var(--c-ink-2, #C8A8AD); margin-left: 6px; font-weight: 500; }
.sbnt-console__push{ margin-left: auto; }
.sbnt-console__hint{
  font-size: 10px;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--c-ink-4, #6B4D52);
  margin-right: 6px;
}
.sbnt-console.is-collapsed .sbnt-console__hint{ display: inline; }
.sbnt-console:not(.is-collapsed) .sbnt-console__hint{ display: none; }
.sbnt-console__toggle{
  display: inline-grid; place-items: center;
  width: 24px; height: 24px;
  border: 1px solid var(--c-rule-2, rgba(255,30,60,.22));
  border-radius: 999px;
  color: var(--c-ink-2, #C8A8AD);
  background: rgba(255,30,60,.06);
  font-size: 14px;
  line-height: 1;
  transition: background .12s ease-out, color .12s ease-out, border-color .12s ease-out;
}
.sbnt-console:hover .sbnt-console__toggle{
  border-color: var(--c-red, #FF1E3C);
  color: var(--c-red-1, #FF4D60);
  background: rgba(255,30,60,.14);
}
.sbnt-console__tabs{
  display: flex; gap: 2px;
  padding: 4px 6px;
  border-bottom: 1px solid var(--c-rule, rgba(255,30,60,.10));
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--c-rule-2, rgba(255,30,60,.22)) transparent;
}
.sbnt-console__tabs::-webkit-scrollbar{ height: 4px; }
.sbnt-console__tabs::-webkit-scrollbar-thumb{ background: var(--c-rule-2, rgba(255,30,60,.22)); }
.sbnt-tab{
  flex: 0 0 auto;
  appearance: none; border: 0; background: transparent;
  padding: 4px 9px;
  font: inherit; font-size: 10.5px; letter-spacing: .04em;
  color: var(--c-ink-3, #8B6B70);
  cursor: pointer;
  border: 1px solid transparent;
  white-space: nowrap;
  transition: color .12s ease-out, background .12s ease-out, border-color .12s ease-out;
}
.sbnt-tab:hover{ color: var(--c-ink-1, #F5E5E8); }
.sbnt-tab.is-active{
  color: var(--c-bg, #000);
  background: var(--c-red, #FF1E3C);
  border-color: var(--c-red, #FF1E3C);
}
.sbnt-console__body{
  height: 248px;
  overflow-y: auto; overflow-x: hidden;
  padding: 10px 12px 14px;
  font-size: 11px; line-height: 1.6;
  scrollbar-width: thin;
  scrollbar-color: var(--c-rule-2, rgba(255,30,60,.22)) transparent;
}
.sbnt-console__body::-webkit-scrollbar{ width: 4px; }
.sbnt-console__body::-webkit-scrollbar-thumb{ background: var(--c-rule-2, rgba(255,30,60,.22)); }
.sbnt-console.is-collapsed .sbnt-console__tabs,
.sbnt-console.is-collapsed .sbnt-console__body{ display: none; }

.sbnt-blurb{
  display: block;
  color: var(--c-ink-3, #8B6B70);
  font-size: 10.5px; letter-spacing: .02em;
  padding-bottom: 8px;
  margin-bottom: 10px;
  border-bottom: 1px dashed var(--c-rule, rgba(255,30,60,.10));
}

.sbnt-h{
  display: block;
  color: var(--c-red-1, #FF4D60);
  font-size: 10.5px; font-weight: 700;
  letter-spacing: .08em; text-transform: uppercase;
  margin: 12px 0 6px;
}
.sbnt-h:first-child{ margin-top: 0; }
.sbnt-p{
  display: block;
  color: var(--c-ink-2, #C8A8AD);
  margin: 4px 0;
}
.sbnt-step{
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px;
  color: var(--c-ink-2, #C8A8AD);
  margin: 3px 0;
}
.sbnt-step__n{
  color: var(--c-red, #FF1E3C);
  font-weight: 700;
}
.sbnt-cmd{
  display: block;
  color: var(--c-ink-1, #F5E5E8);
  background: rgba(255,30,60,.06);
  border-left: 2px solid var(--c-red, #FF1E3C);
  padding: 5px 8px;
  margin: 4px 0;
  white-space: pre-wrap;
  word-break: break-word;
}
.sbnt-cmd::before{
  content: "$ ";
  color: var(--c-red-1, #FF4D60);
  font-weight: 700;
}
.sbnt-note{
  display: block;
  color: var(--c-ink-3, #8B6B70);
  padding-left: 14px;
  position: relative;
  margin: 2px 0;
}
.sbnt-note::before{
  content: "›";
  position: absolute; left: 0;
  color: var(--c-red-1, #FF4D60);
}
.sbnt-warn{
  display: block;
  color: var(--c-red-2, #FF7A88);
  padding-left: 14px;
  position: relative;
  margin: 2px 0;
}
.sbnt-warn::before{
  content: "!";
  position: absolute; left: 0;
  color: var(--c-red, #FF1E3C);
  font-weight: 700;
}

.sbnt-cursor{
  display: inline-block; width: 6px; height: 11px;
  background: var(--c-red, #FF1E3C);
  vertical-align: -1px; margin-left: 4px;
  animation: sbnt-blink 1.1s steps(1) infinite;
}
@keyframes sbnt-blink{ 0%,50%{ opacity: 1 } 50.01%,100%{ opacity: 0 } }

@media (max-width: 560px){
  .sbnt-console{ width: 100vw; border-right: 0; border-top-right-radius: 0; }
  .sbnt-console__body{ height: 210px; }
  .sbnt-console__title{ display: none; }
}
@media (prefers-reduced-motion: reduce){
  .sbnt-cursor{ animation: none; }
}
`;

function injectStyle(){
  if (document.getElementById(STYLE_ID)) return;
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = CSS;
  document.head.appendChild(s);
}

/** Render one body line into terminal-styled HTML. */
function lineHtml(line){
  const text = (line.text || '').replace(/</g, '&lt;');
  switch (line.kind){
    case 'h':    return `<span class="sbnt-h">▸ ${text}</span>`;
    case 'step': return `<span class="sbnt-step"><span class="sbnt-step__n">[${String(line.n ?? 0).padStart(2,'0')}]</span><span>${text}</span></span>`;
    case 'cmd':  return `<span class="sbnt-cmd">${text}</span>`;
    case 'note': return `<span class="sbnt-note">${text}</span>`;
    case 'warn': return `<span class="sbnt-warn">${text}</span>`;
    case 'p':
    default:     return `<span class="sbnt-p">${text}</span>`;
  }
}

/**
 * Mount the field-manual console. Self-injecting — no DOM mount
 * point needed. dataLayer is ignored; this console is content, not
 * a live event log.
 * @param {{subscribe:Function, get:Function}|null} [_dataLayer]
 * @returns {{destroy:()=>void}}
 */
export function mountConsole(_dataLayer = null){
  injectStyle();

  /* tab + body content sets render off the imported FAQ array */
  const tabsHtml = FIELD_MANUAL.map(t =>
    `<button type="button" class="sbnt-tab" data-id="${t.id}">${t.label}</button>`
  ).join('');

  /* Default state: expanded on desktop, collapsed on phone so the
     console doesn't overlap the page underneath. The user toggles it
     either way via the bar. */
  const startCollapsed = !!(window.matchMedia &&
    window.matchMedia('(max-width: 720px)').matches);

  const el = document.createElement('aside');
  el.className = 'sbnt-console' + (startCollapsed ? ' is-collapsed' : '');
  el.setAttribute('aria-label', 'Bittensor field manual');
  el.innerHTML = `
    <span class="sbnt-console__edge" aria-hidden="true"></span>
    <span class="sbnt-console__scan" aria-hidden="true"></span>
    <div class="sbnt-console__bar" data-role="bar">
      <span class="sbnt-console__dot"></span>
      <span class="sbnt-console__name">ORACLE</span>
      <span class="sbnt-console__sep">//</span>
      <span class="sbnt-console__net">bittensor</span>
      <span class="sbnt-console__title" data-role="title"></span>
      <span class="sbnt-console__push"></span>
      <span class="sbnt-console__hint">Tap to expand</span>
      <span class="sbnt-console__toggle" data-role="toggle">${startCollapsed ? '＋' : '−'}</span>
    </div>
    <div class="sbnt-console__tabs" role="tablist">${tabsHtml}</div>
    <div class="sbnt-console__body" data-role="body"></div>
  `;
  document.body.appendChild(el);

  const body    = el.querySelector('[data-role="body"]');
  const title   = el.querySelector('[data-role="title"]');
  const bar     = el.querySelector('[data-role="bar"]');
  const toggle  = el.querySelector('[data-role="toggle"]');
  const tabs    = Array.from(el.querySelectorAll('.sbnt-tab'));

  let activeId = FIELD_MANUAL[0]?.id || 'mine';

  function render(){
    const topic = FIELD_MANUAL.find(t => t.id === activeId) || FIELD_MANUAL[0];
    tabs.forEach(t => t.classList.toggle('is-active', t.dataset.id === activeId));
    if (title) title.textContent = '· ' + (topic.title || '');
    const blurb = topic.blurb
      ? `<span class="sbnt-blurb">${topic.blurb}</span>`
      : '';
    const lines = (topic.body || []).map(lineHtml).join('');
    body.innerHTML = blurb + lines
      + `<span class="sbnt-p" style="margin-top:10px">› select a topic above<span class="sbnt-cursor"></span></span>`;
    body.scrollTop = 0;
  }

  /* tab clicks → switch topic */
  tabs.forEach(t => {
    t.addEventListener('click', (e) => {
      e.stopPropagation();
      activeId = t.dataset.id;
      render();
    });
  });

  /* collapse / expand on bar click — but not when a child button was clicked */
  bar.addEventListener('click', (e) => {
    if (e.target.closest('.sbnt-tab')) return;
    const collapsed = el.classList.toggle('is-collapsed');
    toggle.textContent = collapsed ? '[ + ]' : '[ − ]';
  });

  render();

  return {
    destroy(){ el.remove(); },
  };
}
