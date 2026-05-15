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
/* The Oracle's "consciousness" mark — a simple red pulsing dot.
   Earlier I had this as a multi-layer plexus (rotating SVG spokes,
   halo ring, white-glowing core) with a filter: drop-shadow on the
   wrapper. That combination — filter + multiple transform anims on
   fixed-position chrome — overwhelmed the Android Chrome compositor
   and killed touch scroll on long pages. Reverted to a single
   opacity pulse (no transform, no filter, no box-shadow chain). */
.sbnt-console__nn{
  display: inline-block;
  width: 8px; height: 8px;
  flex: 0 0 8px;
  border-radius: 50%;
  background: var(--c-red, #FF1E3C);
  pointer-events: none;
  animation: sbntNNPulse 1.8s ease-in-out infinite;
}
@keyframes sbntNNPulse{
  0%, 100% { opacity: 1;   }
  50%      { opacity: .45; }
}
@media (prefers-reduced-motion: reduce){
  .sbnt-console__nn{ animation: none; }
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
/* "Bittensor" — set as the brand wordmark, same Archivo Black face
   as "Subnet Oracle" above. Lowercase so the τ glyphs sit at the
   same x-height as the surrounding Latin letters; previously caps
   pushed B/I/E/N/S/O/R to cap-height while τ stayed small, which
   read as a broken render. Now every letter sits on one line. */
.sbnt-console__net{
  color: var(--c-red-1, #FF4D60);
  font-family: var(--f-serif, 'Archivo', system-ui, sans-serif);
  font-weight: 800;
  font-size: 13px;
  letter-spacing: -.005em;
  text-transform: none;
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
   /play · TAO RUNNER · canvas arcade game pinned in the Oracle dock
   =================================================================== */
.sbnt-game{
  display: flex; flex-direction: column;
  gap: 10px;
  padding: 2px 0;
}
.sbnt-game__head{
  border: 1px solid var(--c-rule-2, rgba(255,30,60,.22));
  border-radius: 4px;
  padding: 8px 12px;
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
  margin-top: 3px;
  font-family: var(--f-mono, monospace);
  font-size: 10.5px;
  color: var(--c-ink-2, #C8A8AD);
}
.sbnt-game__canvas{
  display: block;
  width: 100%;
  height: 180px;
  border: 1px solid var(--c-rule-3, rgba(255,30,60,.36));
  border-radius: 4px;
  background:
    radial-gradient(80% 60% at 50% 0%, rgba(255,30,60,.08), transparent 70%),
    linear-gradient(180deg, var(--c-bg-1, #050203), var(--c-bg, #000));
  cursor: pointer;
  outline: none;
  touch-action: manipulation;
}
.sbnt-game__canvas:focus{ box-shadow: 0 0 0 2px var(--c-red, #FF1E3C); }
.sbnt-game__hud{
  display: flex; align-items: center; gap: 8px;
  padding: 6px 10px;
  background: rgba(255,30,60,.04);
  border: 1px solid var(--c-rule-2, rgba(255,30,60,.22));
  border-radius: 4px;
  font-family: var(--f-mono, monospace);
  font-size: 11px;
}
.sbnt-game__hud-lbl{
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--c-red-1, #FF4D60);
}
.sbnt-game__hud-val{
  color: var(--c-ink-1, #F5E5E8);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.sbnt-game__hud-sep{ color: var(--c-ink-4, #6B4D52); }
.sbnt-game__push{ margin-left: auto; }
.sbnt-game__btn{
  appearance: none;
  border: 1px solid var(--c-rule-2, rgba(255,30,60,.22));
  background: rgba(255,30,60,.06);
  color: var(--c-red-1, #FF4D60);
  padding: 4px 10px;
  border-radius: 999px;
  font-family: var(--f-mono, monospace);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background .12s ease-out, border-color .12s ease-out, color .12s ease-out;
}
.sbnt-game__btn:hover{
  background: rgba(255,30,60,.14);
  border-color: var(--c-red, #FF1E3C);
  color: var(--c-red, #FF1E3C);
}
.sbnt-game__btn--ghost{
  background: transparent;
  color: var(--c-ink-3, #8B6B70);
}
.sbnt-game__btn--ghost:hover{
  background: rgba(255,30,60,.06);
  color: var(--c-red-1, #FF4D60);
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
      <!-- The Oracle's "consciousness" — a simple red pulsing dot.
           Reverted from the multi-layer plexus + filter mark which
           was killing Android Chrome touch scroll on long pages. -->
      <span class="sbnt-console__nn" aria-hidden="true"></span>
      <span class="sbnt-console__brand">
        <span class="sbnt-console__name">Subnet Oracle</span>
        <span class="sbnt-console__sep">//</span>
        <span class="sbnt-console__net">Bi<span class="tau">ττ</span>ensor</span>
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

  /* ----- search · cross-topic full-text filter with tokenisation +
     stopword removal so natural-language questions like "what is
     bittensor?" still surface the right topics. ----- */
  const STOPWORDS = new Set([
    'a','an','and','are','as','at','be','but','by','can','do','does','for','from','have','how','i','in','is','it','its','just','like','me','my','no','not','of','on','or','show','that','the','then','this','to','was','what','when','where','which','while','who','why','will','with','you','your'
  ]);
  function escRe(s){ return String(s).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); }
  function tokenise(s){
    return String(s).toLowerCase()
      /* keep latin + Greek τ/α + digits + dash */
      .replace(/[^a-z0-9α-ωτ\s-]/gi, ' ')
      .split(/\s+/)
      .filter(w => w.length > 1 && !STOPWORDS.has(w));
  }
  function mark(text, tokens){
    if (!tokens || !tokens.length) return String(text).replace(/</g, '&lt;');
    let out = String(text).replace(/</g, '&lt;');
    /* highlight each token, longest first so substrings don't shadow */
    [...tokens].sort((a, b) => b.length - a.length).forEach(t => {
      const re = new RegExp('(' + escRe(t) + ')', 'gi');
      out = out.replace(re, '<mark>$1</mark>');
    });
    return out;
  }
  function searchAll(q){
    const tokens = tokenise(q);
    if (!tokens.length) return { tokens: [], hits: [] };
    const hits = [];
    FIELD_MANUAL.forEach(topic => {
      const titleLc = (topic.title || '').toLowerCase();
      const blurbLc = (topic.blurb || '').toLowerCase();
      const bodyLc = (topic.body || []).map(l => (l.text || '')).join(' ').toLowerCase();
      let score = 0;
      tokens.forEach(t => {
        if (topic.id.includes(t))                           score += 6;
        if (titleLc.includes(t))                            score += 4;
        if (blurbLc.includes(t))                            score += 2;
        if (bodyLc.includes(t))                             score += 1;
      });
      if (score > 0){
        /* snippet = first body line that contains any token, else blurb, else title */
        let snippet = topic.blurb || topic.title || '';
        for (const line of (topic.body || [])){
          const t = (line.text || '').toLowerCase();
          if (tokens.some(tok => t.includes(tok))) {
            snippet = line.text;
            break;
          }
        }
        hits.push({ topic, snippet, score });
      }
    });
    hits.sort((a, b) => b.score - a.score);
    return { tokens, hits: hits.slice(0, 8) };
  }

  function searchHtml(q){
    const { tokens, hits } = searchAll(q);
    if (!tokens.length){
      return `<p class="sbnt-search-empty">Type a topic, a command, or a question.</p>`;
    }
    if (!hits.length){
      return `<p class="sbnt-search-empty">No matches for "${String(q).replace(/</g, '&lt;')}". Try <em>mine</em>, <em>dtao</em>, <em>halving</em>, or <em>weights</em>.</p>`;
    }
    return `<ul class="sbnt-search-results">` +
      hits.map(h => `
        <li>
          <button type="button" class="sbnt-search-result" data-topic="${h.topic.id}">
            <span class="sbnt-search-result__topic">${h.topic.label}</span>
            <span class="sbnt-search-result__snippet">${mark(h.snippet, tokens)}</span>
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

  /* ======================================================================
     TAO RUNNER · a canvas arcade game built for the Oracle dock.
     -----------------------------------------------------------------------
     A miner sprint across the chain. Tap to jump. Catch the α tokens
     drifting overhead, dodge the deregistration sweeps rolling along
     the ground. Speed ramps with score. Game over on contact; best
     score persists in localStorage. The only Bittensor-native arcade
     game in the ecosystem. ====================================== */
  let gameRAF = null;
  let gameLastT = 0;

  /** TAO-Runner state. Survives across body re-renders so the user
   *  doesn't lose their score on a search/tab change. */
  const RUNNER = {
    canvas:   null,
    ctx:      null,
    dpr:      1,
    w:        0,
    h:        0,
    ground:   0,
    speed:    260,
    baseSpd:  260,
    maxSpd:   620,
    px:       70,          // player x (fixed)
    py:       0,           // player y offset (negative = airborne)
    vy:       0,
    grounded: true,
    hazards:  [],          // [{x, w, h}] dereg sweeps on the ground
    tokens:   [],          // [{x, y, r}] α tokens floating above
    score:    0,
    best:     0,
    alive:    false,        // not running yet — wait for first tap
    started:  false,
    accH:     1.2,
    accT:     0.6,
    bgOffset: 0,
  };

  function gameHtml(){
    return `
      <div class="sbnt-game">
        <div class="sbnt-game__head">
          <span class="sbnt-game__block-id">TAO RUNNER · BLOCK ${(Math.floor(8190000 + RUNNER.score * 2)).toLocaleString('en-US')}</span>
          <span class="sbnt-game__query">tap to jump · catch <span class="alpha">α</span> · dodge dereg sweeps · speed ramps with each block</span>
        </div>
        <canvas class="sbnt-game__canvas" data-game-canvas tabindex="0" aria-label="TAO Runner game"></canvas>
        <div class="sbnt-game__hud">
          <span class="sbnt-game__hud-lbl">SCORE</span>
          <span class="sbnt-game__hud-val" data-game-score>0</span>
          <span class="sbnt-game__hud-sep">·</span>
          <span class="sbnt-game__hud-lbl">BEST</span>
          <span class="sbnt-game__hud-val" data-game-best>0</span>
          <span class="sbnt-game__push"></span>
          <button type="button" class="sbnt-game__btn sbnt-game__btn--ghost" data-role="game-restart">RESET</button>
        </div>
      </div>
    `;
  }

  function wireGame(){
    const cv = body.querySelector('[data-game-canvas]');
    if (!cv) return;
    RUNNER.canvas = cv;
    RUNNER.ctx = cv.getContext('2d');
    RUNNER.dpr = Math.min(2, window.devicePixelRatio || 1);
    RUNNER.best = Number(localStorage.getItem('sbnt-game-best') || 0);
    const bestEl = body.querySelector('[data-game-best]');
    if (bestEl) bestEl.textContent = RUNNER.best;
    resizeCanvas();

    /* full reset for a clean intro state */
    RUNNER.score = 0; RUNNER.hazards = []; RUNNER.tokens = [];
    RUNNER.speed = RUNNER.baseSpd; RUNNER.alive = false; RUNNER.started = false;
    RUNNER.py = 0; RUNNER.vy = 0; RUNNER.grounded = true;

    const scoreEl = body.querySelector('[data-game-score]');
    if (scoreEl) scoreEl.textContent = 0;

    function jump(){
      if (!RUNNER.started){
        RUNNER.started = true;
        RUNNER.alive = true;
      }
      if (!RUNNER.alive){
        /* restart on tap after game over */
        RUNNER.score = 0; RUNNER.hazards = []; RUNNER.tokens = [];
        RUNNER.speed = RUNNER.baseSpd; RUNNER.alive = true;
        RUNNER.py = 0; RUNNER.vy = 0; RUNNER.grounded = true;
        if (scoreEl) scoreEl.textContent = 0;
        return;
      }
      if (RUNNER.grounded){
        RUNNER.vy = -520;
        RUNNER.grounded = false;
      }
    }

    cv.addEventListener('click',     jump);
    cv.addEventListener('touchstart', e => { e.preventDefault(); jump(); }, { passive: false });
    const keyHandler = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp'){
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', keyHandler);
    cv._sbntKeyHandler = keyHandler;

    const restart = body.querySelector('[data-role="game-restart"]');
    if (restart) restart.addEventListener('click', () => {
      RUNNER.score = 0; RUNNER.hazards = []; RUNNER.tokens = [];
      RUNNER.speed = RUNNER.baseSpd;
      RUNNER.alive = true; RUNNER.started = true;
      RUNNER.py = 0; RUNNER.vy = 0; RUNNER.grounded = true;
      if (scoreEl) scoreEl.textContent = 0;
    });

    const onResize = () => resizeCanvas();
    window.addEventListener('resize', onResize);
    cv._sbntResize = onResize;

    /* loop */
    cancelAnimationFrame(gameRAF);
    gameLastT = performance.now();
    gameRAF = requestAnimationFrame(loop);
  }

  function resizeCanvas(){
    const cv = RUNNER.canvas; if (!cv) return;
    const rect = cv.getBoundingClientRect();
    RUNNER.w = Math.max(280, rect.width);
    RUNNER.h = 180;
    cv.width  = RUNNER.w * RUNNER.dpr;
    cv.height = RUNNER.h * RUNNER.dpr;
    cv.style.height = RUNNER.h + 'px';
    RUNNER.ctx.setTransform(RUNNER.dpr, 0, 0, RUNNER.dpr, 0, 0);
    RUNNER.ground = RUNNER.h - 32;
  }

  function loop(t){
    if (!RUNNER.canvas){ gameRAF = null; return; }
    /* if the user navigated to a different topic, stop the loop */
    if (!body.contains(RUNNER.canvas)){
      gameRAF = null;
      return;
    }
    const dt = Math.min((t - gameLastT) / 1000, 1/30);
    gameLastT = t;

    if (RUNNER.alive && RUNNER.started){
      step(dt);
    }
    draw();
    gameRAF = requestAnimationFrame(loop);
  }

  function step(dt){
    RUNNER.speed = Math.min(RUNNER.maxSpd, RUNNER.baseSpd + RUNNER.score * 3.5);
    /* player physics */
    RUNNER.vy += 1500 * dt;
    RUNNER.py += RUNNER.vy * dt;
    if (RUNNER.py >= 0){
      RUNNER.py = 0;
      RUNNER.vy = 0;
      RUNNER.grounded = true;
    }
    /* spawn */
    RUNNER.accH -= dt;
    if (RUNNER.accH <= 0){
      RUNNER.hazards.push({ x: RUNNER.w + 30, w: 22, h: 16 });
      RUNNER.accH = 0.65 + Math.random() * 0.95 - Math.min(0.4, RUNNER.score * 0.0025);
    }
    RUNNER.accT -= dt;
    if (RUNNER.accT <= 0){
      RUNNER.tokens.push({
        x: RUNNER.w + 20,
        y: -40 - Math.random() * 60,
        r: 8,
      });
      RUNNER.accT = 0.45 + Math.random() * 0.75;
    }
    /* move */
    const dx = RUNNER.speed * dt;
    RUNNER.hazards.forEach(h => h.x -= dx);
    RUNNER.tokens.forEach(t => t.x -= dx);
    RUNNER.bgOffset = (RUNNER.bgOffset + dx) % 32;
    /* cull off-screen */
    RUNNER.hazards = RUNNER.hazards.filter(h => h.x > -40);
    RUNNER.tokens  = RUNNER.tokens.filter(t => t.x > -40);
    /* collide — player AABB vs hazard AABB */
    const pAABB = {
      x: RUNNER.px,
      y: RUNNER.ground - 26 + RUNNER.py,
      w: 22, h: 26,
    };
    for (const h of RUNNER.hazards){
      const hAABB = { x: h.x, y: RUNNER.ground - h.h, w: h.w, h: h.h };
      if (pAABB.x < hAABB.x + hAABB.w &&
          pAABB.x + pAABB.w > hAABB.x &&
          pAABB.y < hAABB.y + hAABB.h &&
          pAABB.y + pAABB.h > hAABB.y){
        gameOver();
        return;
      }
    }
    /* collect tokens — circle-vs-AABB */
    const cx = RUNNER.px + 11, cy = RUNNER.ground - 13 + RUNNER.py;
    RUNNER.tokens = RUNNER.tokens.filter(t => {
      const ay = RUNNER.ground + t.y;
      const dxD = cx - t.x, dyD = cy - ay;
      const d2 = dxD * dxD + dyD * dyD;
      if (d2 < (t.r + 14) * (t.r + 14)){
        RUNNER.score += 1;
        const scoreEl = body.querySelector('[data-game-score]');
        if (scoreEl) scoreEl.textContent = RUNNER.score;
        return false;
      }
      return true;
    });
  }

  function gameOver(){
    RUNNER.alive = false;
    if (RUNNER.score > RUNNER.best){
      RUNNER.best = RUNNER.score;
      try { localStorage.setItem('sbnt-game-best', String(RUNNER.best)); } catch (_){}
      const bestEl = body.querySelector('[data-game-best]');
      if (bestEl) bestEl.textContent = RUNNER.best;
    }
  }

  function draw(){
    const ctx = RUNNER.ctx;
    if (!ctx) return;
    ctx.clearRect(0, 0, RUNNER.w, RUNNER.h);
    /* background — faint dot grid */
    ctx.fillStyle = 'rgba(255,30,60,.18)';
    for (let x = -32 + RUNNER.bgOffset; x < RUNNER.w; x += 32){
      for (let y = 16; y < RUNNER.h - 16; y += 24){
        ctx.fillRect(x, y, 1.2, 1.2);
      }
    }
    /* ground rail */
    ctx.strokeStyle = '#FF1E3C';
    ctx.lineWidth = 1.2;
    ctx.globalAlpha = .55;
    ctx.beginPath();
    ctx.moveTo(0, RUNNER.ground + 2);
    ctx.lineTo(RUNNER.w, RUNNER.ground + 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
    /* hazards — red triangular sweeps */
    ctx.fillStyle = '#FF1E3C';
    RUNNER.hazards.forEach(h => {
      ctx.beginPath();
      ctx.moveTo(h.x, RUNNER.ground);
      ctx.lineTo(h.x + h.w / 2, RUNNER.ground - h.h);
      ctx.lineTo(h.x + h.w, RUNNER.ground);
      ctx.closePath();
      ctx.fill();
    });
    /* tokens — orange/red α circles */
    RUNNER.tokens.forEach(t => {
      const ay = RUNNER.ground + t.y;
      ctx.save();
      const grad = ctx.createRadialGradient(t.x, ay, 1, t.x, ay, t.r + 4);
      grad.addColorStop(0, '#FFB85C');
      grad.addColorStop(1, 'rgba(255,184,92,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(t.x, ay, t.r + 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFB85C';
      ctx.beginPath();
      ctx.arc(t.x, ay, t.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1F0A10';
      ctx.font = 'italic 700 12px "Archivo", serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('α', t.x, ay + 1);
      ctx.restore();
    });
    /* player — small chip with τ */
    const px = RUNNER.px, py = RUNNER.ground - 26 + RUNNER.py;
    ctx.fillStyle = RUNNER.alive ? '#FF1E3C' : '#8B0F20';
    ctx.fillRect(px, py, 22, 26);
    /* legs / pin tabs */
    ctx.fillStyle = '#FF4D60';
    ctx.fillRect(px - 3, py + 6, 3, 2);
    ctx.fillRect(px - 3, py + 14, 3, 2);
    ctx.fillRect(px + 22, py + 6, 3, 2);
    ctx.fillRect(px + 22, py + 14, 3, 2);
    /* τ glyph centred on the chip */
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 14px "JetBrains Mono", ui-monospace, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('τ', px + 11, py + 14);
    /* overlays */
    ctx.textAlign = 'center';
    ctx.font = '700 11px "JetBrains Mono", ui-monospace, monospace';
    if (!RUNNER.started){
      ctx.fillStyle = '#F5E5E8';
      ctx.fillText('TAP TO START · catch α · dodge dereg', RUNNER.w / 2, RUNNER.h / 2);
    } else if (!RUNNER.alive){
      ctx.fillStyle = '#FF1E3C';
      ctx.font = '800 16px "Archivo", system-ui';
      ctx.fillText('GAME OVER', RUNNER.w / 2, RUNNER.h / 2 - 8);
      ctx.font = '700 10px "JetBrains Mono", ui-monospace, monospace';
      ctx.fillStyle = '#C8A8AD';
      ctx.fillText('TAP TO RESPAWN', RUNNER.w / 2, RUNNER.h / 2 + 12);
    }
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
    destroy(){
      /* stop the game loop + tear down its listeners so the dock can
         be safely re-mounted */
      cancelAnimationFrame(gameRAF);
      gameRAF = null;
      if (RUNNER.canvas){
        if (RUNNER.canvas._sbntKeyHandler) window.removeEventListener('keydown', RUNNER.canvas._sbntKeyHandler);
        if (RUNNER.canvas._sbntResize)     window.removeEventListener('resize', RUNNER.canvas._sbntResize);
      }
      el.remove();
    },
  };
}
