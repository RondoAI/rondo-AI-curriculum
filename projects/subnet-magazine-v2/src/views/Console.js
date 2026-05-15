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
   itself before you read the text. The only chrome on the bar; the
   prior horizontal scan-line was retired because it visually
   collided with the side borders and read as a UI bug. */
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
/* "Subnet Oracle" — the bar's brand. Serif italic feels editorial,
   matches the hero wordmark family. Tight letter-spacing, no caps —
   the brand reads like a magazine sub-imprint, not a CLI app. */
.sbnt-console__brand{
  display: inline-flex; align-items: baseline; gap: 7px;
  min-width: 0;
}
.sbnt-console__name{
  color: var(--c-ink-1, #F5E5E8);
  font-family: var(--f-serif, 'Archivo', system-ui, sans-serif);
  font-weight: 800;
  letter-spacing: -.005em;
  text-transform: none;
  font-size: 15px;
  line-height: 1;
}
.sbnt-console__sep{
  color: var(--c-red, #FF1E3C);
  font-weight: 700;
  font-size: 13px;
}
.sbnt-console__net{
  color: var(--c-red-1, #FF4D60);
  font-family: var(--f-mono, monospace);
  font-weight: 700;
  font-size: 11.5px;
  letter-spacing: .04em;
  text-transform: uppercase;
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

/* link line — outbound URL with ↗ glyph + underline-on-hover */
.sbnt-link{
  display: block;
  color: var(--c-red-1, #FF4D60);
  text-decoration: none;
  padding: 3px 0;
  border-bottom: 1px dashed transparent;
  transition: color .12s ease-out, border-color .12s ease-out;
  word-break: break-word;
}
.sbnt-link:hover{
  color: var(--c-red, #FF1E3C);
  border-bottom-color: var(--c-red, #FF1E3C);
}

/* cost line — amber chip-style callout used for "costs τ X" notes */
.sbnt-cost{
  display: inline-block;
  margin: 4px 0;
  padding: 2px 8px;
  background: rgba(255, 184, 92, .10);
  border: 1px solid rgba(255, 184, 92, .35);
  border-radius: 999px;
  color: #FFB85C;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: .02em;
}

/* code line — multi-line code block */
.sbnt-code{
  display: block;
  margin: 6px 0;
  padding: 8px 10px;
  background: rgba(255,30,60,.04);
  border: 1px solid var(--c-rule-2, rgba(255,30,60,.22));
  border-radius: 3px;
  font-size: 10.5px;
  line-height: 1.55;
  color: var(--c-ink-1, #F5E5E8);
  white-space: pre-wrap;
  overflow-x: auto;
}

/* search input at the top of the body. Filters all topics +
   their body lines in real time. */
.sbnt-console__search{
  position: relative;
  margin-bottom: 10px;
}
.sbnt-console__search input{
  width: 100%;
  appearance: none;
  background: rgba(255,30,60,.04);
  border: 1px solid var(--c-rule-2, rgba(255,30,60,.22));
  border-radius: 999px;
  padding: 7px 12px 7px 30px;
  font-family: var(--f-mono, monospace);
  font-size: 11px;
  color: var(--c-ink-1, #F5E5E8);
  outline: none;
  transition: border-color .12s ease-out, background .12s ease-out;
}
.sbnt-console__search input::placeholder{
  color: var(--c-ink-3, #8B6B70);
}
.sbnt-console__search input:focus{
  border-color: var(--c-red, #FF1E3C);
  background: rgba(255,30,60,.08);
}
.sbnt-console__search::before{
  content: "⌕";
  position: absolute;
  left: 11px; top: 50%;
  transform: translateY(-50%);
  color: var(--c-red-1, #FF4D60);
  font-size: 14px;
  pointer-events: none;
}

/* search results list (when input is non-empty) */
.sbnt-search-results{
  list-style: none;
  margin: 0 0 10px;
  padding: 0;
  display: flex; flex-direction: column;
  gap: 2px;
}
.sbnt-search-result{
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px;
  padding: 5px 10px;
  background: rgba(255,30,60,.04);
  border: 1px solid var(--c-rule, rgba(255,30,60,.10));
  border-radius: 3px;
  cursor: pointer;
  text-align: left;
  appearance: none;
  font: inherit;
  color: var(--c-ink-1, #F5E5E8);
  transition: background .12s ease-out, border-color .12s ease-out;
}
.sbnt-search-result:hover{
  background: rgba(255,30,60,.10);
  border-color: var(--c-rule-2, rgba(255,30,60,.22));
}
.sbnt-search-result__topic{
  font-family: var(--f-mono, monospace);
  font-size: 10px;
  letter-spacing: .04em;
  color: var(--c-red-1, #FF4D60);
}
.sbnt-search-result__snippet{
  font-size: 11px;
  color: var(--c-ink-2, #C8A8AD);
  line-height: 1.4;
}
.sbnt-search-result mark{
  background: rgba(255,30,60,.28);
  color: var(--c-ink-1, #F5E5E8);
  border-radius: 2px;
  padding: 0 2px;
}
.sbnt-search-empty{
  padding: 10px;
  text-align: center;
  color: var(--c-ink-4, #6B4D52);
  font-size: 10.5px;
  font-style: italic;
}

/* ===================================================================
   /play · interactive Yuma-consensus mini-game
   =================================================================== */
.sbnt-game{
  display: flex; flex-direction: column;
  gap: 14px;
  padding: 4px 0;
}
.sbnt-game__head{
  border: 1px solid var(--c-rule-2, rgba(255,30,60,.22));
  border-radius: 4px;
  padding: 10px 12px;
  background: rgba(255,30,60,.04);
}
.sbnt-game__block-id{
  font-family: var(--f-mono, monospace);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--c-red, #FF1E3C);
}
.sbnt-game__query{
  display: block;
  margin-top: 4px;
  font-family: var(--f-mono, monospace);
  font-size: 12px;
  color: var(--c-ink-1, #F5E5E8);
}
.sbnt-game__sub{
  display: block;
  margin-top: 6px;
  font-size: 10.5px;
  color: var(--c-ink-3, #8B6B70);
}

.sbnt-game__miners{ display: flex; flex-direction: column; gap: 6px; }
.sbnt-game__miner{
  display: grid;
  grid-template-columns: 60px 1fr 1fr 40px;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: var(--c-bg-2, #0A0306);
  border: 1px solid var(--c-rule, rgba(255,30,60,.10));
  border-radius: 3px;
  transition: border-color .15s ease-out, background .15s ease-out;
}
.sbnt-game__miner.is-truth{
  border-color: var(--c-up, #00E5A8);
  background: rgba(0, 229, 168, .04);
}
.sbnt-game__miner.is-bad{
  border-color: var(--c-red-blood, #8B0F20);
  opacity: .65;
}
.sbnt-game__miner-id{
  font-family: var(--f-mono, monospace);
  font-size: 11px;
  font-weight: 700;
  color: var(--c-red, #FF1E3C);
}
.sbnt-game__miner-answer{
  font-family: var(--f-mono, monospace);
  font-size: 11.5px;
  color: var(--c-ink-1, #F5E5E8);
}
.sbnt-game__slider{
  width: 100%;
  appearance: none;
  height: 4px;
  background: var(--c-bg-4, #1F0A10);
  border-radius: 999px;
  outline: none;
}
.sbnt-game__slider::-webkit-slider-thumb{
  appearance: none;
  width: 12px; height: 12px;
  background: var(--c-red, #FF1E3C);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 6px var(--c-red, #FF1E3C);
}
.sbnt-game__slider::-moz-range-thumb{
  width: 12px; height: 12px;
  background: var(--c-red, #FF1E3C);
  border-radius: 50%; border: 0;
  cursor: pointer;
  box-shadow: 0 0 6px var(--c-red, #FF1E3C);
}
.sbnt-game__weight{
  font-family: var(--f-mono, monospace);
  font-size: 10.5px;
  font-weight: 700;
  color: var(--c-ink-1, #F5E5E8);
  text-align: right;
}

.sbnt-game__cta{
  display: flex; gap: 8px;
  flex-wrap: wrap;
}
.sbnt-game__btn{
  appearance: none;
  border: 1px solid var(--c-red, #FF1E3C);
  background: var(--c-red, #FF1E3C);
  color: #050203;
  padding: 6px 14px;
  border-radius: 999px;
  font-family: var(--f-mono, monospace);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: filter .12s ease-out, transform .12s ease-out;
}
.sbnt-game__btn:hover{ filter: brightness(1.1); transform: translateY(-1px); }
.sbnt-game__btn--ghost{
  background: transparent;
  color: var(--c-red-1, #FF4D60);
}
.sbnt-game__btn--ghost:hover{ background: rgba(255,30,60,.08); }
.sbnt-game__btn:disabled{
  opacity: .4;
  cursor: not-allowed;
  transform: none;
}

.sbnt-game__result{
  margin-top: 6px;
  padding: 10px 12px;
  border: 1px solid var(--c-rule-3, rgba(255,30,60,.36));
  border-radius: 4px;
  background:
    linear-gradient(180deg, rgba(255,30,60,.06), transparent),
    var(--c-bg-1, #050203);
  display: none;
}
.sbnt-game__result.is-shown{ display: block; }
.sbnt-game__result-line{
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 8px;
  font-family: var(--f-mono, monospace);
  font-size: 11px;
  padding: 3px 0;
}
.sbnt-game__result-line dt{
  margin: 0;
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: var(--c-red-1, #FF4D60);
}
.sbnt-game__result-line dd{
  margin: 0;
  color: var(--c-ink-1, #F5E5E8);
  font-weight: 600;
}
.sbnt-game__result-line dd.up   { color: var(--c-up, #00E5A8); }
.sbnt-game__result-line dd.down { color: var(--c-down, #FF4D6D); }

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

/** Escape attribute strings for safe inclusion in href. */
function attrEscape(s){
  return String(s || '').replace(/"/g, '&quot;').replace(/&/g, '&amp;');
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
    case 'cost': return `<span class="sbnt-cost">⊕ ${text}</span>`;
    case 'code': return `<pre class="sbnt-code">${text}</pre>`;
    case 'link': return `<a class="sbnt-link" href="${attrEscape(line.href || '#')}" target="_blank" rel="noopener">↗ ${text}</a>`;
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
  el.setAttribute('aria-label', 'Subnet Oracle · Bittensor field manual');
  el.innerHTML = `
    <span class="sbnt-console__edge" aria-hidden="true"></span>
    <div class="sbnt-console__bar" data-role="bar">
      <span class="sbnt-console__dot"></span>
      <span class="sbnt-console__brand">
        <span class="sbnt-console__name">Subnet Oracle</span>
        <span class="sbnt-console__sep">//</span>
        <span class="sbnt-console__net">Bittensor</span>
      </span>
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
  let searchQuery = '';

  /* ----- search · cross-topic full-text filter ----- */
  function escRe(s){ return String(s).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); }
  function mark(text, q){
    if (!q) return text;
    const re = new RegExp('(' + escRe(q) + ')', 'gi');
    return String(text).replace(/</g, '&lt;').replace(re, '<mark>$1</mark>');
  }
  function searchAll(q){
    if (!q) return [];
    const needle = q.toLowerCase();
    const hits = [];
    FIELD_MANUAL.forEach(topic => {
      /* title / blurb match */
      const titleMatch = (topic.title || '').toLowerCase().includes(needle);
      const blurbMatch = (topic.blurb || '').toLowerCase().includes(needle);
      if (titleMatch || blurbMatch){
        hits.push({ topic, snippet: topic.blurb || topic.title });
      }
      /* line match — first matching line is the snippet */
      (topic.body || []).some(line => {
        const t = (line.text || '').toLowerCase();
        if (t.includes(needle)){
          hits.push({ topic, snippet: line.text });
          return true;
        }
        return false;
      });
    });
    /* dedupe by topic id, keep first hit */
    const seen = new Set();
    return hits.filter(h => {
      if (seen.has(h.topic.id)) return false;
      seen.add(h.topic.id);
      return true;
    }).slice(0, 8);
  }

  function searchHtml(q){
    const hits = searchAll(q);
    if (!hits.length) return `<p class="sbnt-search-empty">No matches for "${q.replace(/</g, '&lt;')}".</p>`;
    return `<ul class="sbnt-search-results">` +
      hits.map(h => `
        <li>
          <button type="button" class="sbnt-search-result" data-topic="${h.topic.id}">
            <span class="sbnt-search-result__topic">${h.topic.label}</span>
            <span class="sbnt-search-result__snippet">${mark(h.snippet, q)}</span>
          </button>
        </li>
      `).join('') +
      `</ul>`;
  }

  function searchBarHtml(){
    return `
      <div class="sbnt-console__search">
        <input type="search" placeholder="Ask the Oracle · search topics, commands, terms…"
               data-role="search" value="${attrEscape(searchQuery)}" autocomplete="off">
      </div>
    `;
  }

  function render(){
    const topic = FIELD_MANUAL.find(t => t.id === activeId) || FIELD_MANUAL[0];
    tabs.forEach(t => t.classList.toggle('is-active', t.dataset.id === activeId));
    if (title) title.textContent = '· ' + (topic.title || '');

    /* If the user is searching, replace the body with cross-topic
       results instead of the active-topic content. */
    if (searchQuery){
      body.innerHTML = searchBarHtml() + searchHtml(searchQuery);
      wireSearch();
      wireSearchResults();
      return;
    }

    const blurb = topic.blurb
      ? `<span class="sbnt-blurb">${topic.blurb}</span>`
      : '';

    /* Special topic: /play renders the interactive Yuma-consensus
       mini-game widget instead of static lines. */
    const content = topic.id === 'play'
      ? gameHtml()
      : (topic.body || []).map(lineHtml).join('');

    body.innerHTML = searchBarHtml() + blurb + content
      + (topic.id === 'play' ? '' : `<span class="sbnt-p" style="margin-top:10px">› select a topic above<span class="sbnt-cursor"></span></span>`);
    body.scrollTop = 0;
    wireSearch();
    if (topic.id === 'play') wireGame();
  }

  /* ----- game · interactive Yuma-consensus block ----- */
  /* Picks a random truth (which miner gave the right answer) per
     block and a query set so each "play" is a fresh micro-puzzle.
     The user (the validator) drags 5 weight sliders 0-100; Yuma
     computes the weighted median; payouts go to the top miner
     (41%), to validators whose weights matched the consensus (41%
     split via the user's vector), and to the subnet owner (18%). */
  const QUERIES = [
    { ask: 'Capital of France?',         answers: ['Paris', 'Lyon', 'Marseille', 'Nice', 'Bordeaux'],       truthIdx: 0 },
    { ask: 'sqrt(144) = ?',              answers: ['12', '14', '11', '12.0', '24'],                         truthIdx: 0 },
    { ask: 'Most-spoken native lang?',   answers: ['Mandarin', 'English', 'Spanish', 'Hindi', 'Arabic'],    truthIdx: 0 },
    { ask: 'TAO 21M cap reached when?',  answers: ['Apr 2063', '2032', 'Dec 2029', 'Aug 2031', '2055'],     truthIdx: 0 },
    { ask: 'Bittensor mainnet launch?',  answers: ['Jan 2021', '2020', 'Mar 2022', 'Q4 2020', '2023'],      truthIdx: 0 },
  ];
  let blockNum = 8_191_900;
  let gameState = null;
  function newBlock(){
    const q = QUERIES[Math.floor(Math.random() * QUERIES.length)];
    /* shuffle answer order so the truth isn't always miner 1 */
    const order = [0,1,2,3,4].sort(() => Math.random() - 0.5);
    gameState = {
      query: q.ask,
      miners: order.map(i => ({ answer: q.answers[i], isTruth: i === q.truthIdx })),
      weights: [50, 50, 50, 50, 50],
      settled: false,
      block: ++blockNum,
    };
  }
  newBlock();

  function gameHtml(){
    const s = gameState;
    const minersHtml = s.miners.map((m, i) => `
      <div class="sbnt-game__miner ${s.settled ? (m.isTruth ? 'is-truth' : 'is-bad') : ''}">
        <span class="sbnt-game__miner-id">M${String(i + 1).padStart(2, '0')}</span>
        <span class="sbnt-game__miner-answer">${(m.answer + '').replace(/</g, '&lt;')}</span>
        <input class="sbnt-game__slider" type="range" min="0" max="100"
               value="${s.weights[i]}" data-miner="${i}" ${s.settled ? 'disabled' : ''}>
        <span class="sbnt-game__weight" data-weight="${i}">${s.weights[i]}</span>
      </div>
    `).join('');
    return `
      <div class="sbnt-game">
        <div class="sbnt-game__head">
          <span class="sbnt-game__block-id">BLOCK ${s.block.toLocaleString('en-US')} · SUBNET 1 · APEX</span>
          <span class="sbnt-game__query">Q: ${s.query}</span>
          <span class="sbnt-game__sub">You are the validator. Five miners answered. Drag each slider to set your weight vote (0 = "ignore", 100 = "this is correct"). Hit Settle to compute Yuma consensus and the payout.</span>
        </div>
        <div class="sbnt-game__miners">${minersHtml}</div>
        <div class="sbnt-game__cta">
          <button type="button" class="sbnt-game__btn" data-role="game-settle" ${s.settled ? 'disabled' : ''}>SETTLE BLOCK</button>
          <button type="button" class="sbnt-game__btn sbnt-game__btn--ghost" data-role="game-next">NEW BLOCK ↻</button>
        </div>
        <div class="sbnt-game__result ${s.settled ? 'is-shown' : ''}" data-role="game-result">${s.settled ? gameResultHtml(s) : ''}</div>
      </div>
    `;
  }

  function gameResultHtml(s){
    const total = s.weights.reduce((a, w) => a + w, 0) || 1;
    const truthIdx = s.miners.findIndex(m => m.isTruth);
    const playerOnTruth = s.weights[truthIdx];
    const allCorrect = s.weights[truthIdx];
    const allWrong   = total - allCorrect;
    const consensus = playerOnTruth >= 60 ? 'You voted with consensus.' : playerOnTruth >= 30 ? 'You voted near consensus.' : 'You voted against consensus.';
    /* payouts: 41% miners (all to the top, here = the truth miner),
       41% validators (you, scaled by accuracy), 18% subnet owner */
    const blockReward = 0.5;     // τ per block at post-halving rate
    const minerPay    = blockReward * 0.41;
    const validatorPay = blockReward * 0.41 * (playerOnTruth / 100);
    const ownerPay     = blockReward * 0.18;
    const cls = playerOnTruth >= 60 ? 'up' : playerOnTruth >= 30 ? '' : 'down';
    return `
      <div class="sbnt-game__result-line">
        <dt>Truth</dt><dd>Miner M${String(truthIdx + 1).padStart(2, '0')} · "${(s.miners[truthIdx].answer + '').replace(/</g, '&lt;')}"</dd>
      </div>
      <div class="sbnt-game__result-line">
        <dt>Your weight on truth</dt><dd class="${cls}">${playerOnTruth} / 100</dd>
      </div>
      <div class="sbnt-game__result-line">
        <dt>Consensus</dt><dd class="${cls}">${consensus}</dd>
      </div>
      <div class="sbnt-game__result-line">
        <dt>Top miner pays</dt><dd>τ${minerPay.toFixed(3)}  (41% block)</dd>
      </div>
      <div class="sbnt-game__result-line">
        <dt>You earn (validator)</dt><dd class="${cls}">τ${validatorPay.toFixed(3)}  (41% × your accuracy)</dd>
      </div>
      <div class="sbnt-game__result-line">
        <dt>Subnet owner</dt><dd>τ${ownerPay.toFixed(3)}  (18%)</dd>
      </div>
    `;
  }

  function wireGame(){
    /* sliders update gameState.weights and the live readout */
    body.querySelectorAll('.sbnt-game__slider').forEach(sl => {
      sl.addEventListener('input', e => {
        const i = Number(e.target.dataset.miner);
        const v = Number(e.target.value);
        gameState.weights[i] = v;
        const out = body.querySelector(`[data-weight="${i}"]`);
        if (out) out.textContent = v;
      });
    });
    const settle = body.querySelector('[data-role="game-settle"]');
    if (settle) settle.addEventListener('click', () => {
      gameState.settled = true;
      render();
    });
    const next = body.querySelector('[data-role="game-next"]');
    if (next) next.addEventListener('click', () => {
      newBlock();
      render();
    });
  }

  function wireSearch(){
    const input = body.querySelector('[data-role="search"]');
    if (!input) return;
    input.addEventListener('input', e => {
      searchQuery = e.target.value;
      render();
      /* keep focus on the search input after re-render */
      const next = body.querySelector('[data-role="search"]');
      if (next){
        next.focus();
        next.setSelectionRange(searchQuery.length, searchQuery.length);
      }
    });
  }

  function wireSearchResults(){
    body.querySelectorAll('.sbnt-search-result').forEach(btn => {
      btn.addEventListener('click', () => {
        activeId = btn.dataset.topic;
        searchQuery = '';
        render();
      });
    });
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
    /* ignore clicks on the tabs, the search input, the game widget,
       the body content, and any anchor links — only bar-chrome
       clicks toggle the dock */
    if (e.target.closest('.sbnt-tab')) return;
    if (e.target.closest('.sbnt-console__tabs')) return;
    if (e.target.closest('.sbnt-console__body')) return;
    const collapsed = el.classList.toggle('is-collapsed');
    /* keep the toggle glyph the same family as the initial render —
       single fullwidth ＋ or minus −, no brackets. Brackets wrap
       onto two lines inside the 24-px circular toggle and read as
       a broken UI. */
    toggle.textContent = collapsed ? '＋' : '−';
  });

  render();

  return {
    destroy(){ el.remove(); },
  };
}
