/* =================================================================
   SUBNET ORACLE, fresh v2 (clean, mobile-first, GPU-light)
   -----------------------------------------------------------------
   A complete rebuild of the bottom dock. The original module
   (preserved as Console.legacy.js) accumulated nine months of
   features, search, an arcade game, /play commands, a multi-layer
   PS5 neural-net mark, and somewhere in the chrome layering the
   Android Chrome compositor stopped letting the home page scroll.

   This rebuild is the minimum viable Oracle:
     1. self-injecting fixed dock at the bottom
     2. tap to expand / collapse
     3. tab row from FIELD_MANUAL data module
     4. body that re-renders on tab change
     5. a small SVG plexus mark, the "agent endpoint"

   Deliberate omissions vs the legacy:
     - no backdrop-filter, no multi-layer box-shadow, no compound
       gradient backgrounds (Android compositor pathology)
     - no canvas, no requestAnimationFrame loops in the dock
     - no filter on animated elements
     - no search bar, no TAO Runner, no /play commands (port back
       in future if needed; orthogonal to the core dock function)
     - no max-height: 70vh, no display: flex column on the dock
       (these tripped iOS Safari scroll in earlier debug rounds)

   Same export contract as the legacy: mountConsole(dataLayer) →
   { destroy }. Boot.js does not need to know which Console is
   running. Switch back to the legacy by renaming files.
   ================================================================= */

import { FIELD_MANUAL } from '../data/bittensor-faq.js';
import { NodeSphere } from '../charts/NodeSphere.js';

const STYLE_ID = 'sbnt-oracle-style';

const CSS = `
/* ---- dock surface ---- */
.sbnt-oracle{
  position: fixed;
  left: 0; right: 0; bottom: 0;
  z-index: 45;
  width: 100%;
  font-family: var(--f-mono, ui-monospace, monospace);
  color: var(--c-ink-1, #F5E5E8);
  background: #0a0306;
  border-top: 1px solid rgba(255,30,60,.45);
  /* Single solid colour, single 1-px top rule. No backdrop-filter,
     no multi-layer gradient, no box-shadow. This is the chrome
     that was killing Android scroll when stacked over a long page. */
  contain: layout style paint;
  will-change: transform;
}
@media (min-width: 720px){
  .sbnt-oracle{
    left: auto;
    right: auto;
    width: min(640px, 100vw);
    border-right: 1px solid rgba(255,30,60,.45);
    border-top-right-radius: 4px;
  }
}

/* ---- top bar ---- */
.sbnt-oracle__bar{
  display: flex; align-items: center; gap: 10px;
  padding: 10px 14px;
  cursor: pointer;
  user-select: none;
  font-size: 12px;
  letter-spacing: .04em;
  color: var(--c-ink-2, #C8A8AD);
}
.sbnt-oracle__bar:hover{ color: var(--c-ink-1, #F5E5E8); }

/* ---- PS5-grade neural-net mark ----
   Real-time NodeSphere plexus rendered on canvas + CSS pseudo-
   element overlays for the breathing core and broadcast halo.
   Three painted layers, ordered behind → front:
     1. canvas, rotating 3D plexus, atmospheric glow, KNN edges
     2. ::before, expanding broadcast halo ring (CSS)
     3. ::after, white-glowing pulsing core (CSS)
   Compositor cost is contained: contain: layout style paint isolates
   the mark from the page compositor; the canvas runs at 30 px so
   the rasterised texture is tiny. */
.sbnt-oracle__mark{
  position: relative;
  display: inline-block;
  width: 30px; height: 30px;
  flex: 0 0 30px;
  color: var(--c-red, #FF1E3C);
  filter: drop-shadow(0 0 6px rgba(255,30,60,.55));
  contain: layout style paint;
}
.sbnt-oracle__mark-canvas{
  display: block;
  width: 100%; height: 100%;
  border-radius: 50%;
}
.sbnt-oracle__mark::after{
  /* white pulsing core, "the thought firing" */
  content: "";
  position: absolute;
  top: 50%; left: 50%;
  width: 4px; height: 4px;
  margin: -2px 0 0 -2px;
  background: #FFFFFF;
  border-radius: 50%;
  box-shadow:
    0 0 3px #FFFFFF,
    0 0 8px var(--c-red, #FF1E3C),
    0 0 14px rgba(255,30,60,.4);
  pointer-events: none;
  animation: sbntOracleCore 1.6s ease-in-out infinite;
  z-index: 2;
}
.sbnt-oracle__mark::before{
  /* expanding broadcast halo, "the agent broadcasting" */
  content: "";
  position: absolute;
  top: 50%; left: 50%;
  width: 10px; height: 10px;
  margin: -5px 0 0 -5px;
  border: 1px solid var(--c-red, #FF1E3C);
  border-radius: 50%;
  pointer-events: none;
  animation: sbntOracleHalo 2.4s ease-out infinite;
  z-index: 1;
}
@keyframes sbntOracleCore{
  0%, 100% { transform: scale(1);   opacity: 1;   }
  50%      { transform: scale(1.5); opacity: .65; }
}
@keyframes sbntOracleHalo{
  0%   { transform: scale(.4); opacity: .9; }
  100% { transform: scale(2.4); opacity: 0; }
}
@media (prefers-reduced-motion: reduce){
  .sbnt-oracle__mark::after,
  .sbnt-oracle__mark::before{ animation: none; }
}

/* ---- brand block ---- */
.sbnt-oracle__brand{
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
  min-width: 0;
}
.sbnt-oracle__name{
  color: var(--c-ink-1, #F5E5E8);
  font-family: var(--f-serif, 'Archivo', system-ui, sans-serif);
  font-weight: 800;
  font-size: 14px;
  letter-spacing: -.005em;
  line-height: 1;
}
.sbnt-oracle__sep{ color: var(--c-red, #FF1E3C); font-weight: 700; }
.sbnt-oracle__net{
  color: var(--c-red-1, #FF4D60);
  font-family: var(--f-serif, 'Archivo', system-ui, sans-serif);
  font-weight: 800;
  font-size: 12px;
  letter-spacing: -.005em;
  line-height: 1;
  text-transform: none;
}
.sbnt-oracle__push{ margin-left: auto; }
.sbnt-oracle__hint{
  font-size: 10px;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: var(--c-ink-4, #6B4D52);
  margin-right: 6px;
}
.sbnt-oracle.is-open .sbnt-oracle__hint{ display: none; }
.sbnt-oracle__toggle{
  display: inline-grid; place-items: center;
  width: 24px; height: 24px;
  border: 1px solid rgba(255,30,60,.3);
  border-radius: 999px;
  color: var(--c-ink-2, #C8A8AD);
  background: rgba(255,30,60,.06);
  font-size: 14px; line-height: 1;
}

/* ---- tabs + body, only visible when open ---- */
.sbnt-oracle__tabs,
.sbnt-oracle__body{ display: none; }
.sbnt-oracle.is-open .sbnt-oracle__tabs,
.sbnt-oracle.is-open .sbnt-oracle__body{ display: block; }

.sbnt-oracle__tabs{
  display: none;
  gap: 4px;
  padding: 6px 10px;
  border-top: 1px solid rgba(255,30,60,.18);
  overflow-x: auto;
  scrollbar-width: none;
  white-space: nowrap;
}
.sbnt-oracle.is-open .sbnt-oracle__tabs{ display: flex; }
.sbnt-oracle__tabs::-webkit-scrollbar{ display: none; }
.sbnt-oracle__tab{
  flex: 0 0 auto;
  appearance: none; border: 1px solid transparent;
  background: transparent;
  padding: 5px 10px;
  font: inherit;
  font-size: 11px;
  color: var(--c-ink-3, #8B6B70);
  letter-spacing: .04em;
  cursor: pointer;
}
.sbnt-oracle__tab.is-active{
  color: var(--c-bg, #000);
  background: var(--c-red, #FF1E3C);
  border-color: var(--c-red, #FF1E3C);
}
.sbnt-oracle__body{
  height: 220px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px 14px;
  font-size: 11px; line-height: 1.6;
  border-top: 1px solid rgba(255,30,60,.18);
  background: #050203;
  /* keep our scroll inside, never chain to the page */
  overscroll-behavior: contain;
}
.sbnt-oracle__body::-webkit-scrollbar{ width: 4px; }
.sbnt-oracle__body::-webkit-scrollbar-thumb{ background: rgba(255,30,60,.25); }

/* ---- content typography ---- */
.sbnt-line{ display: block; margin: 4px 0; color: var(--c-ink-2, #C8A8AD); }
.sbnt-line--h{
  color: var(--c-red-1, #FF4D60);
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
  font-size: 10.5px;
  margin: 12px 0 6px;
}
.sbnt-line--h:first-child{ margin-top: 0; }
.sbnt-line--cmd{
  color: var(--c-ink-1, #F5E5E8);
  background: rgba(255,30,60,.06);
  border-left: 2px solid var(--c-red, #FF1E3C);
  padding: 4px 8px;
  white-space: pre-wrap;
  word-break: break-word;
}
.sbnt-line--cmd::before{ content: "$ "; color: var(--c-red-1, #FF4D60); font-weight: 700; }
.sbnt-line--note{ color: var(--c-ink-3, #8B6B70); padding-left: 12px; }
.sbnt-line--note::before{ content: "› "; color: var(--c-red, #FF1E3C); }
.sbnt-line--warn{ color: #FFBE5C; }
.sbnt-line--warn::before{ content: "! "; }
.sbnt-line--cost{ color: var(--c-red-1, #FF4D60); }
.sbnt-line--code{
  background: rgba(255,30,60,.04);
  border-left: 1px dashed rgba(255,30,60,.3);
  padding: 6px 8px;
  white-space: pre-wrap;
  overflow-x: auto;
  font-size: 10.5px;
}
.sbnt-line--link{ color: var(--c-red-1, #FF4D60); text-decoration: underline; }
.sbnt-line--link::before{ content: "↗ "; }
.sbnt-line--step{
  display: grid; grid-template-columns: auto 1fr; gap: 8px;
}
.sbnt-line--step .step-n{ color: var(--c-red, #FF1E3C); font-weight: 700; }

.sbnt-blurb{
  display: block;
  color: var(--c-ink-3, #8B6B70);
  font-size: 10.5px;
  padding-bottom: 8px;
  margin-bottom: 10px;
  border-bottom: 1px dashed rgba(255,30,60,.15);
}
`;

function injectStyle(){
  if (document.getElementById(STYLE_ID)) return;
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = CSS;
  document.head.appendChild(s);
}

/** Escape strings for safe inclusion in HTML text content. */
function escapeText(s){
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function escapeAttr(s){
  return String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

/** Render one FIELD_MANUAL line into terminal-styled HTML. */
function lineHtml(line){
  const text = escapeText(line.text);
  switch (line.kind){
    case 'h':    return `<span class="sbnt-line sbnt-line--h">${text}</span>`;
    case 'step': return `<span class="sbnt-line sbnt-line--step"><span class="step-n">[${String(line.n ?? 0).padStart(2,'0')}]</span><span>${text}</span></span>`;
    case 'cmd':  return `<span class="sbnt-line sbnt-line--cmd">${text}</span>`;
    case 'note': return `<span class="sbnt-line sbnt-line--note">${text}</span>`;
    case 'warn': return `<span class="sbnt-line sbnt-line--warn">${text}</span>`;
    case 'cost': return `<span class="sbnt-line sbnt-line--cost">⊕ ${text}</span>`;
    case 'code': return `<pre class="sbnt-line sbnt-line--code">${text}</pre>`;
    case 'link': return `<a class="sbnt-line sbnt-line--link" href="${escapeAttr(line.href || '#')}" target="_blank" rel="noopener">${text}</a>`;
    case 'p':
    default:     return `<span class="sbnt-line">${text}</span>`;
  }
}

/**
 * Mount the Subnet Oracle dock. Self-injecting, appends its own
 * fixed element to <body>. Returns a destroy() that fully tears
 * down its DOM and listeners. dataLayer is unused, the Oracle is
 * static content, not a live feed.
 *
 * @param {*} [_dataLayer]
 * @returns {{ destroy: () => void }}
 */
export function mountConsole(_dataLayer = null){
  injectStyle();

  const startOpen = !!(window.matchMedia && window.matchMedia('(min-width: 720px)').matches);

  const el = document.createElement('aside');
  el.className = 'sbnt-oracle' + (startOpen ? ' is-open' : '');
  el.setAttribute('aria-label', 'Subnet Oracle · Bittensor field manual');

  const tabsHtml = FIELD_MANUAL.map(t =>
    `<button type="button" class="sbnt-oracle__tab" data-id="${escapeAttr(t.id)}">${escapeText(t.label)}</button>`
  ).join('');

  el.innerHTML = `
    <div class="sbnt-oracle__bar" data-role="bar">
      <!-- PS5-grade Oracle mark, NodeSphere canvas plexus +
           CSS-pseudo halo + breathing core overlay -->
      <span class="sbnt-oracle__mark" aria-hidden="true">
        <canvas class="sbnt-oracle__mark-canvas" data-role="mark-canvas"></canvas>
      </span>
      <span class="sbnt-oracle__brand">
        <span class="sbnt-oracle__name">Subnet Oracle</span>
        <span class="sbnt-oracle__sep">//</span>
        <span class="sbnt-oracle__net">Bi<span class="tau">ττ</span>ensor</span>
      </span>
      <span class="sbnt-oracle__push"></span>
      <span class="sbnt-oracle__hint">Tap to open</span>
      <span class="sbnt-oracle__toggle" data-role="toggle">${startOpen ? '−' : '+'}</span>
    </div>
    <div class="sbnt-oracle__tabs" role="tablist">${tabsHtml}</div>
    <div class="sbnt-oracle__body" data-role="body" tabindex="0"></div>
  `;
  document.body.appendChild(el);

  /* Mount the Oracle's PS5-grade plexus mark, a tiny NodeSphere
     on the 30 px canvas. 18 nodes is dense enough to read as a
     3D plexus without looking sparse; atmospheric glow + KNN
     crossings give the live-agent feel. */
  const markCanvas = el.querySelector('[data-role="mark-canvas"]');
  const markSphere = markCanvas ? new NodeSphere(markCanvas, {
    nodes:   18,
    K:       3,
    density: 0.45,
    speed:   0.55,
    atmos:   true,
  }) : null;

  const bar    = el.querySelector('[data-role="bar"]');
  const body   = el.querySelector('[data-role="body"]');
  const toggle = el.querySelector('[data-role="toggle"]');
  const tabs   = Array.from(el.querySelectorAll('.sbnt-oracle__tab'));

  let activeId = FIELD_MANUAL[0]?.id || '';

  function render(){
    const topic = FIELD_MANUAL.find(t => t.id === activeId);
    if (!topic){ body.innerHTML = ''; return; }
    const blurb = topic.blurb ? `<span class="sbnt-blurb">${escapeText(topic.blurb)}</span>` : '';
    const lines = (topic.lines || []).map(lineHtml).join('');
    body.innerHTML = blurb + lines;
    tabs.forEach(t => t.classList.toggle('is-active', t.dataset.id === activeId));
  }

  function setOpen(open){
    el.classList.toggle('is-open', !!open);
    toggle.textContent = open ? '−' : '+';
  }

  /* clicking the bar toggles open/closed, except when the click is
     inside the body itself (the user is trying to scroll or read) */
  function onBarClick(e){
    if (e.target.closest('.sbnt-oracle__body')) return;
    if (e.target.closest('.sbnt-oracle__tab'))  return;
    setOpen(!el.classList.contains('is-open'));
  }

  function onTabClick(e){
    const t = e.target.closest('.sbnt-oracle__tab');
    if (!t) return;
    activeId = t.dataset.id;
    if (!el.classList.contains('is-open')) setOpen(true);
    render();
  }

  bar.addEventListener('click', onBarClick);
  el.querySelector('.sbnt-oracle__tabs').addEventListener('click', onTabClick);

  render();

  return {
    destroy(){
      bar.removeEventListener('click', onBarClick);
      markSphere?.destroy();
      el.remove();
    },
  };
}
