/* =================================================================
   SUBNET MAGAZINE, BITTENSOR FIELD MANUAL CONSOLE
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
import { CODEX } from '../data/codex.js';
import { NodeSphere } from '../charts/NodeSphere.js';
import { applySlideHint } from '../lib/slide-hint.js';

const STYLE_ID = 'sbnt-console-style';

const CSS = `
/* 2028-AI bottom dock. A pinned oracle agent that surfaces the
   field-manual content on demand, but signals its presence with a
   stronger red top-edge glow, a periodic scan-line, and a brand
   tag that reads as an addressable agent endpoint. */
.sbnt-console{
  position: fixed; left: 0; bottom: 0; z-index: 45;
  width: min(560px, 100vw);
  font-family: var(--f-mono, monospace);
  /* Transparent glass surface, the dock reads as floating chrome,
     not as a solid wall blocking content. backdrop-filter blur
     keeps the text crisp over whatever's behind. */
  background:
    radial-gradient(120% 80% at 18% 0%, rgba(255,30,60,.08), transparent 60%),
    linear-gradient(180deg, rgba(20,5,9,.45), rgba(5,2,3,.45));
  border: 1px solid var(--c-rule-3, rgba(255,30,60,.36));
  border-left: 0; border-bottom: 0;
  border-top-right-radius: 6px;
  /* Touch + scroll containment. overscroll-behavior alone is not
     enough: if the chat content fits its container and there is
     nothing to scroll, the gesture passes through to the page
     anyway. touch-action: pan-y CLAIMS every vertical touch for
     the dock whether or not there is internal scroll left to do,
     the page underneath physically can't move when the user is
     dragging inside this element. pinch-zoom is preserved. */
  touch-action: pan-y pinch-zoom;
  overscroll-behavior: contain;
  backdrop-filter: blur(14px) saturate(140%);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
  box-shadow:
    0 -1px 0 rgba(255,30,60,.18) inset,
    0 -8px 32px rgba(255,30,60,.10),
    0 -4px 20px rgba(0,0,0,.55);
  isolation: isolate;
  overflow: hidden;
  /* compact default, the page wins the scroll surface back */
  max-height: 38vh;
  display: flex;
  flex-direction: column;
  transition: max-height .22s ease-out, width .22s ease-out;
}
/* tall mode, user opted in via the expand button. Goes nearly
   full height and widens, so the chat actually breathes. */
.sbnt-console.is-tall{
  max-height: 90vh;
  width: min(640px, 100vw);
}
.sbnt-console.is-tall .sbnt-console__body{
  flex: 1 1 auto;
  height: auto;
  min-height: 0;
}
/* On mobile, "expand" must truly fill the viewport. Use inset: 0
   so the dock is pinned to all four viewport edges, not just the
   bottom, so the previous symptom (only goes "halfway" up the
   screen) cannot recur, the dock owns top, right, bottom, left
   regardless of any other layout math. Falls back to height/width
   100vh/100vw for browsers that don't honor inset on a fixed
   element with one edge anchor already set. Border-radius and
   the right/top borders are zeroed because there's no edge to
   draw against, the dock is the screen. */
@media (max-width: 720px){
  .sbnt-console.is-tall{
    inset: 0;
    left: 0; right: 0; top: 0; bottom: 0;
    width: 100vw;
    height: 100vh;
    max-height: 100vh;
    border: 0;
    border-radius: 0;
  }
  .sbnt-console.is-tall .sbnt-console__body{
    /* Body grows to fill all the new vertical space available, so
       the chat actually breathes when the user expands on a phone.
       248px hard height from default mode must NOT apply when
       expanded, override it. */
    height: auto;
    flex: 1 1 auto;
    min-height: 0;
  }
}
/* fully-dismissed state, the entire dock slides off-screen and
   only a tiny relaunch chip remains in the corner */
.sbnt-console.is-dismissed{
  transform: translateY(calc(100% + 8px));
  pointer-events: none;
}
.sbnt-console__relaunch{
  position: fixed;
  left: 8px; bottom: 8px;
  z-index: 46;
  display: none;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border: 1px solid var(--c-red);
  border-radius: 999px;
  background: rgba(10,3,6,.85);
  color: #fff;
  font-family: var(--f-mono);
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: var(--ls-label);
  text-transform: uppercase;
  cursor: pointer;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 0 0 1px rgba(255,30,60,.2), 0 6px 18px rgba(0,0,0,.5);
}
.sbnt-console.is-dismissed ~ .sbnt-console__relaunch{ display: inline-flex; }
/* a bright 1-px red rail at the very top edge, the bar declares
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
  display: flex; align-items: center; gap: 10px;
  padding: 11px 14px;
  cursor: pointer;
  border-bottom: 1px solid var(--c-rule-2, rgba(255,30,60,.22));
  font-size: 12px; letter-spacing: .04em;
  color: var(--c-ink-2, #C8A8AD);
  user-select: none;
  /* Brighter red top accent on the collapsed bar so the dock
     advertises itself instead of blending into the page bottom.
     Per Rondo 2026-05-18: "I don't see my subnet oracle bar." */
  box-shadow: inset 0 2px 0 var(--c-red, #FF1E3C),
              inset 0 3px 16px rgba(255, 30, 60, .14);
}
/* Tab-preview chips visible in the collapsed bar — readers see
   ASK · MINE · PLAY · LINKS at a glance + can tap directly into
   that tab. Hidden when the dock is expanded (the real tab row
   below takes over). */
.sbnt-console__chips{
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
}
.sbnt-console__chip{
  display: inline-block;
  padding: 3px 8px 2px;
  font-family: var(--f-mono, monospace);
  font-size: 9.5px;
  letter-spacing: .14em;
  font-weight: 800;
  color: var(--c-red-1, #FF4D60);
  border: 1px solid rgba(255, 30, 60, .35);
  background: rgba(255, 30, 60, .06);
  text-transform: uppercase;
  white-space: nowrap;
  cursor: pointer;
}
.sbnt-console__chip:hover{
  color: #fff;
  background: var(--c-red, #FF1E3C);
  border-color: var(--c-red, #FF1E3C);
}
.sbnt-console:not(.is-collapsed) .sbnt-console__chips{ display: none; }
/* On the narrowest viewports drop one chip to keep things from
   wrapping (mobile already shows ASK/MINE/PLAY/LINKS = 4 chips). */
@media (max-width: 380px){
  .sbnt-console__chip[data-id="links"]{ display: none; }
}
/* The Oracle's "consciousness" mark, PS5-grade neural net.
   Three layers stacked, painted back to front:
     1. canvas, real-time NodeSphere plexus (18 nodes, KNN
                        crossings, atmospheric glow, slow rotation)
     2. ::before, expanding broadcast halo (CSS, opacity fade)
     3. ::after, white pulsing core with red glow box-shadow
                        chain (the "thought firing")
   filter: drop-shadow on the wrapper paints the red glow halo
   that ties the whole assembly together.
   contain: layout style paint isolates the mark's render from
   the page compositor, the dock won't recomposite scrolling
   chrome under it. */
.sbnt-console__nn{
  position: relative;
  display: inline-block;
  width: 34px; height: 34px;
  flex: 0 0 34px;
  color: var(--c-red, #FF1E3C);
  filter: drop-shadow(0 0 8px rgba(255,30,60,.6));
  contain: layout style paint;
}
.sbnt-console__nn-canvas{
  display: block;
  width: 100%; height: 100%;
  border-radius: 50%;
}
.sbnt-console__nn::after{
  /* white pulsing core */
  content: "";
  position: absolute;
  top: 50%; left: 50%;
  width: 5px; height: 5px;
  margin: -2.5px 0 0 -2.5px;
  background: #FFFFFF;
  border-radius: 50%;
  box-shadow:
    0 0 4px #FFFFFF,
    0 0 10px var(--c-red, #FF1E3C),
    0 0 18px rgba(255,30,60,.45);
  pointer-events: none;
  animation: sbntNNCore 1.6s ease-in-out infinite;
  z-index: 2;
}
.sbnt-console__nn::before{
  /* broadcast halo */
  content: "";
  position: absolute;
  top: 50%; left: 50%;
  width: 12px; height: 12px;
  margin: -6px 0 0 -6px;
  border: 1px solid var(--c-red, #FF1E3C);
  border-radius: 50%;
  pointer-events: none;
  animation: sbntNNHalo 2.4s ease-out infinite;
  z-index: 1;
}
@keyframes sbntNNCore{
  0%, 100% { transform: scale(1);   opacity: 1;   }
  50%      { transform: scale(1.5); opacity: .65; }
}
@keyframes sbntNNHalo{
  0%   { transform: scale(.4); opacity: .9; }
  100% { transform: scale(2.4); opacity: 0; }
}
@media (prefers-reduced-motion: reduce){
  .sbnt-console__nn::after,
  .sbnt-console__nn::before{ animation: none; }
}
/* "Subnet Oracle", the bar's brand. Serif italic feels editorial,
   matches the hero wordmark family. Tight letter-spacing, no caps,    the brand reads like a magazine sub-imprint, not a CLI app. */
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
/* "Bittensor", set as the brand wordmark, same Archivo Black face
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
.sbnt-console__toggle,
.sbnt-console__close,
.sbnt-console__expand{
  display: inline-grid; place-items: center;
  width: 28px; height: 28px;
  border: 1px solid var(--c-rule-2, rgba(255,30,60,.36));
  /* Sharp HUD corner, matches the SUBNET ORACLE + ticker badges on
     the article cards, no rounded chat-widget look. */
  border-radius: 2px;
  color: var(--c-ink-2, #C8A8AD);
  background: rgba(255,30,60,.08);
  cursor: pointer;
  appearance: none;
  font-family: inherit;
  transition: background .12s ease-out, color .12s ease-out, border-color .12s ease-out, transform .12s ease-out;
}
.sbnt-console__toggle:hover,
.sbnt-console__close:hover,
.sbnt-console__expand:hover{
  border-color: var(--c-red, #FF1E3C);
  color: var(--c-red-1, #FF4D60);
  background: rgba(255,30,60,.18);
  transform: translateY(-1px);
}
.sbnt-console__expand{ margin-left: 2px; margin-right: 2px; }
/* in tall mode, the expand button rotates 180deg so the icon reads
   as "collapse back down" */
.sbnt-console.is-tall .sbnt-console__expand{
  background: rgba(255,30,60,.22);
  border-color: var(--c-red, #FF1E3C);
  color: var(--c-red-1, #FF4D60);
}
.sbnt-console.is-tall .sbnt-console__expand svg{
  transform: rotate(180deg);
}
.sbnt-console__expand svg{
  transition: transform .2s ease-out;
}
.sbnt-console__close{ margin-left: 6px; }
.sbnt-console__close:hover{
  background: var(--c-red, #FF1E3C);
  color: #fff;
  border-color: var(--c-red, #FF1E3C);
}
.sbnt-console__relaunch:hover{
  background: var(--c-red, #FF1E3C);
  color: #fff;
}
.sbnt-console__relaunch-dot{
  width: 6px; height: 6px;
  background: var(--c-red, #FF1E3C);
  border-radius: 50%;
  box-shadow: 0 0 6px var(--c-red, #FF1E3C);
  animation: sbntRelaunchPulse 1.6s ease-in-out infinite;
}
.sbnt-console__relaunch:hover .sbnt-console__relaunch-dot{
  background: #fff;
  box-shadow: 0 0 6px #fff;
}
@keyframes sbntRelaunchPulse{
  0%, 100%{ opacity: 1; }
  50%     { opacity: .4; }
}
.sbnt-console__tabs{
  display: flex; gap: 4px;
  padding: 6px 8px;
  border-bottom: 1px solid var(--c-rule-2, rgba(255,30,60,.22));
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--c-rule-2, rgba(255,30,60,.22)) transparent;
  /* fade the right edge so users know there is more content */
  mask-image: linear-gradient(to right, #000 calc(100% - 24px), transparent);
}
.sbnt-console__tabs::-webkit-scrollbar{ height: 3px; }
.sbnt-console__tabs::-webkit-scrollbar-thumb{ background: var(--c-rule-2, rgba(255,30,60,.22)); }
.sbnt-tab{
  flex: 0 0 auto;
  appearance: none;
  background: transparent;
  padding: 7px 12px;
  font: inherit;
  font-size: 10.5px;
  font-weight: 700;
  /* Match the SUBNET ORACLE/ticker HUD badge typography elsewhere
     on the site, .19em letter-spacing and sharp 1px corners. The
     row should read as one consistent terminal register. */
  letter-spacing: .19em;
  color: var(--c-ink-3, #8B6B70);
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: 1px;
  white-space: nowrap;
  transition: color .12s ease-out, background .12s ease-out, border-color .12s ease-out;
}
.sbnt-tab:hover{
  color: var(--c-ink-1, #F5E5E8);
  background: rgba(255,30,60,.06);
}
.sbnt-tab.is-active{
  color: #fff;
  background: var(--c-red, #FF1E3C);
  border-color: var(--c-red, #FF1E3C);
  box-shadow: 0 0 12px rgba(255,30,60,.4);
}
.sbnt-console__body{
  height: 248px;
  overflow-y: auto; overflow-x: hidden;
  padding: 10px 12px 14px;
  font-size: 11px; line-height: 1.6;
  scrollbar-width: thin;
  scrollbar-color: var(--c-rule-2, rgba(255,30,60,.22)) transparent;
  /* touch-action: pan-y on the body again so vertical pans are
     consumed here even when the content fits and there's no scroll
     left to do, prevents the gesture from ever reaching the page
     beneath the dock. overscroll-behavior: contain handles the
     end-of-content case. */
  touch-action: pan-y;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
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

/* link line, outbound URL with ↗ glyph + underline-on-hover */
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

/* cost line, amber chip-style callout used for "costs τ X" notes */
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

/* code line, multi-line code block */
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
   /ask · ORACLE CHAT · conversational Q&A pinned in the dock
   -----------------------------------------------------------------
   The Oracle's voice. Type a question, it scores against the codex +
   field-manual corpora and replies with a one-line answer + citation
   links that jump into the relevant entry on /codex.
   =================================================================== */
.sbnt-chat{
  display: flex; flex-direction: column;
  gap: 8px;
  padding: 2px 0;
  /* in tall mode the body is flex:1 so the chat fills its parent and
     the form sticks to the bottom. height:100% lets that propagate. */
  min-height: 100%;
}
.sbnt-chat__log{
  display: flex; flex-direction: column;
  gap: 8px;
  padding-bottom: 4px;
  /* in tall mode the log scrolls inside its allotted space, the
     input form below stays pinned at the bottom of the dock. */
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
}
.sbnt-chat__msg{
  display: flex; flex-direction: column;
  gap: 3px;
  padding: 8px 10px;
  border-radius: 4px;
  border: 1px solid var(--c-rule, rgba(255,30,60,.10));
  font-size: 11px; line-height: 1.55;
}
.sbnt-chat__msg--bot{
  background: rgba(255,30,60,.05);
  border-color: var(--c-rule-2, rgba(255,30,60,.22));
  color: var(--c-ink-1, #F5E5E8);
}
.sbnt-chat__msg--you{
  background: rgba(255,255,255,.03);
  color: var(--c-ink-2, #C8A8AD);
  align-self: flex-end;
  max-width: 90%;
}
.sbnt-chat__who{
  font-size: 9px;
  font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--c-red-1, #FF4D60);
}
.sbnt-chat__msg--you .sbnt-chat__who{ color: var(--c-ink-3, #8B6B70); }
.sbnt-chat__msg p{ margin: 0; }
.sbnt-chat__cite{
  margin-top: 4px;
  font-size: 10px;
  color: var(--c-ink-3, #8B6B70);
}
.sbnt-chat__cite a{
  color: var(--c-red-1, #FF4D60);
  text-decoration: none;
  border-bottom: 1px dashed transparent;
  transition: border-color .12s ease-out;
}
.sbnt-chat__cite a:hover{ border-bottom-color: var(--c-red, #FF1E3C); }
.sbnt-chat__dots{
  display: inline-flex; gap: 3px;
}
.sbnt-chat__dots span{
  width: 4px; height: 4px;
  border-radius: 50%;
  background: var(--c-red, #FF1E3C);
  animation: sbntChatDot 1s ease-in-out infinite;
}
.sbnt-chat__dots span:nth-child(2){ animation-delay: .15s; }
.sbnt-chat__dots span:nth-child(3){ animation-delay: .30s; }
@keyframes sbntChatDot{
  0%, 100%{ opacity: .25; transform: scale(.85); }
  50%     { opacity: 1;   transform: scale(1.15); }
}
.sbnt-chat__form{
  display: flex; gap: 6px;
  padding-top: 8px;
  border-top: 1px dashed var(--c-rule, rgba(255,30,60,.10));
}
.sbnt-chat__input{
  flex: 1;
  appearance: none;
  background: rgba(255,30,60,.06);
  border: 1px solid var(--c-rule-2, rgba(255,30,60,.22));
  border-radius: 999px;
  padding: 7px 12px;
  font-family: var(--f-mono, monospace);
  font-size: 11px;
  color: var(--c-ink-1, #F5E5E8);
  outline: none;
  min-width: 0;
}
.sbnt-chat__input::placeholder{ color: var(--c-ink-3, #8B6B70); }
.sbnt-chat__input:focus{
  border-color: var(--c-red, #FF1E3C);
  background: rgba(255,30,60,.10);
}
.sbnt-chat__send{
  appearance: none;
  border: 1px solid var(--c-red, #FF1E3C);
  background: var(--c-red, #FF1E3C);
  color: #fff;
  /* Sharp 2px corner instead of a full circle, matches the rest of
     the terminal HUD chrome (oracle/ticker badges, control buttons).
     The previous fully-round chat-app circle was the strongest visual
     mismatch on the panel. */
  border-radius: 2px;
  width: 32px; height: 32px;
  display: grid; place-items: center;
  cursor: pointer;
  flex: 0 0 32px;
  box-shadow:
    0 0 10px rgba(255,30,60,.45),
    inset 0 1px 0 rgba(255,150,170,.35);
}
.sbnt-chat__send:hover{ background: var(--c-red-1, #FF4D60); border-color: var(--c-red-1, #FF4D60); }
.sbnt-chat__send svg{ width: 14px; height: 14px; }
.sbnt-chat__note{
  margin: 6px 0 0;
  font-size: 9.5px;
  letter-spacing: .04em;
  color: var(--c-ink-4, #6B4D52);
  font-style: italic;
}

/* ===================================================================
   /play · TAO RUNNER · canvas arcade game pinned in the Subnet Oracle dock
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

/* ---------- WELCOME / ONBOARDING ---------- */
.sbnt-welcome{
  padding: 16px 18px 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.sbnt-welcome__head{ display: flex; flex-direction: column; gap: 6px; }
.sbnt-welcome__eyebrow{
  font-family: var(--f-mono, monospace);
  font-size: 9px;
  letter-spacing: .22em;
  font-weight: 800;
  color: var(--c-red, #FF1E3C);
  text-transform: uppercase;
}
.sbnt-welcome__h{
  font-family: var(--f-serif, Archivo);
  font-size: 18px;
  font-weight: 800;
  color: #fff;
  line-height: 1.25;
  letter-spacing: -.005em;
  margin: 0;
}
.sbnt-welcome__sub{
  font-family: var(--f-sans, Inter);
  font-size: 12.5px;
  line-height: 1.45;
  color: var(--c-ink-2, #C8A8AD);
  margin: 0;
}
.sbnt-welcome__steps{
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.sbnt-welcome__step{
  -webkit-appearance: none;
  appearance: none;
  display: grid;
  grid-template-columns: 32px 1fr auto;
  gap: 12px;
  align-items: center;
  text-align: left;
  padding: 10px 12px;
  background: var(--c-bg-1, #0A0306);
  border: 1px solid var(--c-rule-2, rgba(255, 30, 60, .22));
  cursor: pointer;
  color: inherit;
  font-family: inherit;
  transition: background 140ms ease, border-color 140ms ease;
}
.sbnt-welcome__step:hover,
.sbnt-welcome__step:focus-visible{
  background: rgba(255, 30, 60, .06);
  border-color: var(--c-red, #FF1E3C);
  outline: none;
}
.sbnt-welcome__step-n{
  font-family: var(--f-mono, monospace);
  font-size: 13px;
  letter-spacing: .08em;
  font-weight: 800;
  color: var(--c-red-1, #FF4D60);
  font-variant-numeric: tabular-nums;
}
.sbnt-welcome__step-body{
  display: flex; flex-direction: column; gap: 2px; min-width: 0;
}
.sbnt-welcome__step-label{
  font-family: var(--f-serif, Archivo);
  font-size: 13.5px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -.005em;
}
.sbnt-welcome__step-tease{
  font-family: var(--f-sans, Inter);
  font-size: 11.5px;
  line-height: 1.35;
  color: var(--c-ink-3, #8B6B70);
}
.sbnt-welcome__step-arrow{
  font-family: var(--f-mono, monospace);
  color: var(--c-ink-3, #8B6B70);
  font-size: 14px;
  transition: color 140ms ease, transform 140ms ease;
}
.sbnt-welcome__step:hover .sbnt-welcome__step-arrow{
  color: var(--c-red, #FF1E3C);
  transform: translateX(2px);
}
.sbnt-welcome__foot{
  display: flex;
  justify-content: flex-end;
  padding-top: 4px;
  border-top: 1px dashed var(--c-rule-2, rgba(255, 30, 60, .14));
}
.sbnt-welcome__skip{
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  border: 0;
  color: var(--c-ink-3, #8B6B70);
  font-family: var(--f-mono, monospace);
  font-size: 10px;
  letter-spacing: .08em;
  cursor: pointer;
  padding: 4px 6px;
  text-decoration: underline;
}
.sbnt-welcome__skip:hover{ color: var(--c-red-1, #FF4D60); }

/* ---------- TL;DR strip (per-topic read-first chip) ---------- */
.sbnt-tldr{
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 8px 12px;
  margin: 0 0 12px;
  background: rgba(255, 184, 92, .06);
  border: 1px solid rgba(255, 184, 92, .28);
  border-left: 2px solid var(--c-warn, #FFB85C);
}
.sbnt-tldr__lbl{
  font-family: var(--f-mono, monospace);
  font-size: 9px;
  letter-spacing: .18em;
  font-weight: 800;
  color: var(--c-warn, #FFB85C);
  text-transform: uppercase;
  flex-shrink: 0;
}
.sbnt-tldr__txt{
  font-family: var(--f-sans, Inter);
  font-size: 12.5px;
  line-height: 1.45;
  color: #fff;
}

/* ---------- NEXT footer (next topic in the reading flow) ---------- */
.sbnt-next{
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 14px 14px;
  margin: 16px 0 4px;
  background: rgba(255, 30, 60, .03);
  border-top: 1px dashed var(--c-rule-2, rgba(255, 30, 60, .22));
}
.sbnt-next__lbl{
  font-family: var(--f-mono, monospace);
  font-size: 8.5px;
  letter-spacing: .22em;
  font-weight: 800;
  color: var(--c-ink-3, #8B6B70);
  text-transform: uppercase;
}
.sbnt-next__btn{
  -webkit-appearance: none;
  appearance: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  background: var(--c-bg-1, #0A0306);
  border: 1px solid var(--c-rule-2, rgba(255, 30, 60, .22));
  color: inherit;
  font-family: inherit;
  cursor: pointer;
  transition: background 140ms ease, border-color 140ms ease;
}
.sbnt-next__btn:hover,
.sbnt-next__btn:focus-visible{
  background: rgba(255, 30, 60, .06);
  border-color: var(--c-red, #FF1E3C);
  outline: none;
}
.sbnt-next__label{
  font-family: var(--f-serif, Archivo);
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -.005em;
  text-align: left;
}
.sbnt-next__arrow{
  font-family: var(--f-mono, monospace);
  color: var(--c-red-1, #FF4D60);
  font-size: 16px;
  transition: transform 140ms ease;
}
.sbnt-next__btn:hover .sbnt-next__arrow{ transform: translateX(2px); }
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
 * Mount the field-manual console. Self-injecting, no DOM mount
 * point needed. dataLayer is ignored; this console is content, not
 * a live event log.
 * @param {{subscribe:Function, get:Function}|null} [_dataLayer]
 * @returns {{destroy:()=>void}}
 */
export function mountConsole(_dataLayer = null){
  injectStyle();

  /* tab + body content sets render off the imported FAQ array */
  /* Render tabs in display order. /ask is the chat surface (the
     Oracle "speaking"), pinned first; /play is the arcade game;
     /links is the off-site directory. The rest follow in their
     data-file order. */
  const ASK_TAB = { id: 'ask', label: 'ASK' };
  /* WELCOME tab: first-visit-only onboarding shown until the
     reader interacts with any other tab (then we set the seen
     flag and stop offering it). Per sibling's coordination ask
     (CLAUDE.md, item 1: "Welcome / Onboarding State"). */
  const ONBOARD_KEY = 'sbn:console-onboarded:v1';
  const hasOnboarded = (() => {
    try { return localStorage.getItem(ONBOARD_KEY) === '1'; }
    catch (_) { return false; }
  })();
  const markOnboarded = () => {
    try { localStorage.setItem(ONBOARD_KEY, '1'); } catch (_) {}
  };
  const START_TAB = { id: 'start', label: 'START' };
  const TAB_ORDER_FRONT = ['mine', 'links', 'play'];
  const orderedTabs = [
    ...(hasOnboarded ? [] : [START_TAB]),
    ASK_TAB,
    ...TAB_ORDER_FRONT
      .map(id => FIELD_MANUAL.find(t => t.id === id))
      .filter(Boolean),
    ...FIELD_MANUAL.filter(t => !TAB_ORDER_FRONT.includes(t.id)),
  ];
  /* tab labels read better without the `/` prefix that some come
     with in the data file, and uppercased so the row is one
     consistent typographic register */
  const cleanLabel = s => String(s || '').replace(/^\//, '').toUpperCase();
  const tabsHtml = orderedTabs.map(t =>
    `<button type="button" class="sbnt-tab" data-id="${t.id}">${cleanLabel(t.label)}</button>`
  ).join('');

  /* Default state: COLLAPSED on every screen so the console doesn't
     overlap the page underneath (Rondo 2026-05-18 — desktop cockpit
     was being visually swallowed by the open dock). The user expands
     it via the bar; the START tab + welcome card still surface on
     first expand so first-visit onboarding is preserved. */
  const startCollapsed = true;

  const el = document.createElement('aside');
  el.className = 'sbnt-console' + (startCollapsed ? ' is-collapsed' : '');
  el.setAttribute('aria-label', 'Subnet Oracle · Bittensor field manual');
  el.innerHTML = `
    <span class="sbnt-console__edge" aria-hidden="true"></span>
    <div class="sbnt-console__bar" data-role="bar">
      <!-- The Oracle's "consciousness", 8-node SVG plexus with
           staggered opacity pulses (signals cascading through the
           net), an expanding broadcast ring, and a breathing white
           core. Pure SVG + CSS transform/opacity animations on
           contained children, Android-compositor-safe. -->
      <!-- PS5-grade Oracle mark: NodeSphere canvas + CSS pseudo
           halo + breathing core overlay. Same engine as the
           masthead brand mark, scaled to 34 px. -->
      <span class="sbnt-console__nn" aria-hidden="true">
        <canvas class="sbnt-console__nn-canvas" data-role="nn-canvas"></canvas>
      </span>
      <span class="sbnt-console__brand">
        <span class="sbnt-console__name">Subnet Oracle</span>
        <span class="sbnt-console__title" data-role="title"></span>
      </span>
      <!-- Collapsed-only tab preview chips. Rondo 2026-05-18 said
           he couldn't see the dock; this puts ASK / MINE / PLAY /
           LINKS visible in the collapsed bar so the dock advertises
           its content + reads as a real toolbar instead of a thin
           "tap to expand" line. Tapping any chip expands the dock
           AND switches to that tab via the existing data-id click
           delegate. -->
      <span class="sbnt-console__chips" data-role="bar-chips" aria-hidden="true">
        <span class="sbnt-console__chip" data-id="ask">ASK</span>
        <span class="sbnt-console__chip" data-id="mine">MINE</span>
        <span class="sbnt-console__chip" data-id="play">PLAY</span>
        <span class="sbnt-console__chip" data-id="links">LINKS</span>
      </span>
      <span class="sbnt-console__push"></span>
      <span class="sbnt-console__hint">Tap to expand</span>
      <button type="button" class="sbnt-console__expand" data-role="expand"
              aria-label="Expand Subnet Oracle dock to full height" title="Expand tall">
        <svg viewBox="0 0 14 14" width="12" height="12" aria-hidden="true" data-role="expand-icon">
          <path d="M3 5 L 7 1 L 11 5 M 3 9 L 7 13 L 11 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </svg>
      </button>
      <button type="button" class="sbnt-console__toggle" data-role="toggle" aria-label="Collapse Subnet Oracle dock" title="Collapse">
        <svg viewBox="0 0 14 14" width="12" height="12" aria-hidden="true">
          <path d="M3 ${startCollapsed ? '7 L 11 7 M 7 3 L 7 11' : '7 L 11 7'}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" fill="none"/>
        </svg>
      </button>
      <button type="button" class="sbnt-console__close" data-role="close" aria-label="Dismiss Subnet Oracle dock" title="Dismiss">
        <svg viewBox="0 0 14 14" width="12" height="12" aria-hidden="true">
          <path d="M3 3 L 11 11 M 11 3 L 3 11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" fill="none"/>
        </svg>
      </button>
    </div>
    <div class="sbnt-console__tabs" role="tablist">${tabsHtml}</div>
    <div class="sbnt-console__body" data-role="body"></div>
  `;
  document.body.appendChild(el);

  /* relaunch chip, sibling of the dock, shown only when the dock is
     dismissed (via the CSS sibling combinator) */
  const relaunch = document.createElement('button');
  relaunch.type = 'button';
  relaunch.className = 'sbnt-console__relaunch';
  relaunch.setAttribute('aria-label', 'Reopen Subnet Oracle');
  relaunch.innerHTML = `<span class="sbnt-console__relaunch-dot" aria-hidden="true"></span>Subnet Oracle`;
  document.body.appendChild(relaunch);

  /* restore dismissed + tall state from localStorage so the user's
     choices persist across page loads */
  const DISMISS_KEY = 'sbnt-console-dismissed';
  const TALL_KEY    = 'sbnt-console-tall';
  try {
    if (localStorage.getItem(DISMISS_KEY) === '1'){
      el.classList.add('is-dismissed');
    }
    if (localStorage.getItem(TALL_KEY) === '1'){
      el.classList.add('is-tall');
    }
  } catch (_){}

  /* Mount the Oracle's PS5-grade plexus mark, a tiny NodeSphere
     on the bar's 34 px canvas. 18 nodes / K=3 / density .45 /
     speed .55 / atmos true gives the rotating 3D plexus feel
     without burning a meaningful frame budget. */
  const nnCanvas = el.querySelector('[data-role="nn-canvas"]');
  const nnSphere = nnCanvas ? new NodeSphere(nnCanvas, {
    nodes:   18,
    K:       3,
    density: 0.45,
    speed:   0.55,
    atmos:   true,
  }) : null;

  const body    = el.querySelector('[data-role="body"]');
  const title   = el.querySelector('[data-role="title"]');
  const bar     = el.querySelector('[data-role="bar"]');
  const toggle  = el.querySelector('[data-role="toggle"]');
  const closeBt = el.querySelector('[data-role="close"]');
  const expandBt= el.querySelector('[data-role="expand"]');
  const tabs    = Array.from(el.querySelectorAll('.sbnt-tab'));
  const tabRail = el.querySelector('.sbnt-console__tabs');
  /* slide-hint on the tab rail, there are 15 tabs and the phone
     viewport shows ~4, so the rest is invisible without the cue */
  const teardownTabHint = tabRail ? applySlideHint(tabRail) : () => {};

  /* First-time visitors land on the START welcome card; returning
     readers land on ASK. */
  let activeId = hasOnboarded ? 'ask' : 'start';
  let searchQuery = '';
  /* chat history survives across body re-renders (tab swap, search) */
  const chatLog = [{
    who: 'bot',
    text: "I'm the Subneτ Oracle. Ask me anything about Bittensor, what a concept means, how a mechanism works, who runs what. I cite my sources.",
  }];

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
        <input type="search" placeholder="Ask the Subnet Oracle · search topics, commands, terms…"
               data-role="search" value="${attrEscape(searchQuery)}" autocomplete="off">
      </div>
    `;
  }

  /* ----- ASK ORACLE · conversational chat ----- */
  /** scope a CODEX entry against query tokens, returns top 2 */
  function findCodex(q){
    const toks = tokenise(q);
    if (!toks.length) return [];
    const scored = (CODEX || []).map(e => {
      const titleLc = (e.title || '').toLowerCase();
      const oneLc   = (e.oneLine || '').toLowerCase();
      const headsLc = (e.sections || []).map(s => (s.h || '').toLowerCase()).join(' ');
      const bodyLc  = (e.sections || []).map(s => (s.body || '').toLowerCase()).join(' ');
      let score = 0;
      toks.forEach(t => {
        if (titleLc.includes(t)) score += 4;
        if (oneLc.includes(t))   score += 2;
        if (headsLc.includes(t)) score += 2;
        if (bodyLc.includes(t))  score += 1;
      });
      return { e, score };
    }).filter(r => r.score > 0).sort((a, b) => b.score - a.score);
    return scored.slice(0, 2).map(r => r.e);
  }
  function chatHtml(){
    return `
      <div class="sbnt-chat">
        <div class="sbnt-chat__log" data-role="chat-log">
          ${chatLog.map(m => msgHtml(m)).join('')}
        </div>
        <form class="sbnt-chat__form" data-role="chat-form" autocomplete="off">
          <input type="text" class="sbnt-chat__input" data-role="chat-input"
                 placeholder="Ask the Subnet Oracle, e.g. 'How does dTAO work?'"
                 spellcheck="false" autocomplete="off">
          <button type="submit" class="sbnt-chat__send" aria-label="Send">
            <svg viewBox="0 0 24 24"><path d="M4 12h14M14 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </form>
        <p class="sbnt-chat__note">Drawing from the Subnet Oracle entries and field manual on this site. A live Claude link arrives when a server key is plumbed through safely.</p>
      </div>
    `;
  }
  function msgHtml(m){
    if (m.thinking){
      return `<div class="sbnt-chat__msg sbnt-chat__msg--bot"><span class="sbnt-chat__who">Subnet Oracle</span><span class="sbnt-chat__dots"><span></span><span></span><span></span></span></div>`;
    }
    const safe = String(m.text || '').replace(/</g, '&lt;');
    const cite = (m.cites && m.cites.length)
      ? `<span class="sbnt-chat__cite">Cited: ${m.cites.map(c =>
          `<a href="oracle.html#${c.id}">${String(c.title).replace(/</g,'&lt;')}</a>`
        ).join(' · ')}</span>`
      : '';
    return `
      <div class="sbnt-chat__msg sbnt-chat__msg--${m.who === 'you' ? 'you' : 'bot'}">
        <span class="sbnt-chat__who">${m.who === 'you' ? 'You' : 'Subnet Oracle'}</span>
        <p>${safe}</p>
        ${cite}
      </div>
    `;
  }
  function answer(q){
    const hits = findCodex(q);
    if (!hits.length){
      /* fall back to the field-manual cross-topic scorer */
      const { hits: faqHits } = searchAll(q);
      if (faqHits.length){
        const top = faqHits[0].topic;
        return {
          who: 'bot',
          text: `${top.title}. ${top.blurb || faqHits[0].snippet}`,
          cites: [],
        };
      }
      return {
        who: 'bot',
        text: "I don't have an entry that matches that yet. Try a concept like Yuma Consensus, dTAO, α token, or a role like miner / validator.",
        cites: [],
      };
    }
    const top = hits[0];
    return {
      who: 'bot',
      text: `${top.title}. ${top.oneLine || ''}`,
      cites: hits.map(h => ({ id: h.id, title: h.title })),
    };
  }
  function wireChat(){
    const form  = body.querySelector('[data-role="chat-form"]');
    const input = body.querySelector('[data-role="chat-input"]');
    const log   = body.querySelector('[data-role="chat-log"]');
    if (!form || !input || !log) return;
    /* scroll the latest message into view + give the input focus */
    log.scrollTop = log.scrollHeight;
    setTimeout(() => input.focus(), 50);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = (input.value || '').trim();
      if (!q) return;
      chatLog.push({ who: 'you', text: q });
      chatLog.push({ who: 'bot', thinking: true });
      input.value = '';
      render();
      /* simulated thinking pause, then answer */
      setTimeout(() => {
        chatLog.pop();           // remove thinking
        chatLog.push(answer(q));
        render();
      }, 380);
    });
  }

  /* ---------- WELCOME / ONBOARDING ---------- */
  /* Reading flow for new Bittensor readers — sibling's
     coordination ask spelled out the path:
       /whitepaper → /dtao → /mine OR /validate → /wallet → /security
     Each step is a clickable card; tapping any one switches
     to that field-manual tab AND sets the onboarded flag so the
     welcome view doesn't return. */
  const WELCOME_STEPS = [
    { id: 'whitepaper', n: '01', label: 'The whitepaper',         tease: 'What Bittensor IS, in the founders’ own words.' },
    { id: 'dtao',       n: '02', label: 'dTAO · alpha tokens',    tease: 'How each subnet has its own market-priced token.' },
    { id: 'mine',       n: '03', label: 'Mine a subnet',          tease: 'Install → register → run → earn α.' },
    { id: 'validate',   n: '04', label: 'Run a validator',        tease: 'Earn by scoring miners, lock TAO as stake.' },
    { id: 'wallet',     n: '05', label: 'Wallets · keys',    tease: 'Coldkey vs hotkey — the safety contract.' },
    { id: 'security',   n: '06', label: 'Security · hygiene', tease: 'Survive a six-figure account on a phone.' },
  ].filter(step => FIELD_MANUAL.some(t => t.id === step.id));

  function welcomeHtml(){
    const stepsHtml = WELCOME_STEPS.map(s => `
      <button type="button" class="sbnt-welcome__step" data-welcome-step="${s.id}">
        <span class="sbnt-welcome__step-n">${s.n}</span>
        <span class="sbnt-welcome__step-body">
          <span class="sbnt-welcome__step-label">${s.label}</span>
          <span class="sbnt-welcome__step-tease">${s.tease}</span>
        </span>
        <span class="sbnt-welcome__step-arrow" aria-hidden="true">→</span>
      </button>
    `).join('');
    return `
      <section class="sbnt-welcome" aria-labelledby="sbnt-welcome-h">
        <header class="sbnt-welcome__head">
          <span class="sbnt-welcome__eyebrow">⊕ NEW TO BITTENSOR?</span>
          <h2 class="sbnt-welcome__h" id="sbnt-welcome-h">A reading path through the Subnet Oracle’s field manual.</h2>
          <p class="sbnt-welcome__sub">Six short topics in the order a new operator actually needs them — from "what is this thing?" through registering your first miner. Tap any step to jump in. Once you do, this welcome card stops appearing.</p>
        </header>
        <ol class="sbnt-welcome__steps">${stepsHtml}</ol>
        <footer class="sbnt-welcome__foot">
          <button type="button" class="sbnt-welcome__skip" data-welcome-skip>Skip — just open the chat</button>
        </footer>
      </section>`;
  }

  function wireWelcome(){
    body.querySelectorAll('[data-welcome-step]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.welcomeStep;
        markOnboarded();
        removeStartTab();
        activeId = id;
        render();
      });
    });
    const skip = body.querySelector('[data-welcome-skip]');
    if (skip){
      skip.addEventListener('click', () => {
        markOnboarded();
        removeStartTab();
        activeId = 'ask';
        render();
      });
    }
  }

  /* Once the reader interacts with the welcome card OR clicks any
     other tab while welcome is showing, drop the START tab from
     the DOM so the next render's tab row matches the onboarded
     state. Mirrors what we'd see on a fresh page load with the
     flag set. */
  function removeStartTab(){
    const startTab = el.querySelector('.sbnt-console__tabs [data-id="start"]');
    if (startTab) startTab.remove();
  }

  function render(){
    /* START is the first-visit onboarding card. Renders a
       reading-order flow (5 steps from whitepaper → security)
       so a new reader has a clear path into the field manual.
       Dismissing the card or tapping any step sets the
       onboarded flag — returning readers land on ASK instead. */
    if (activeId === 'start'){
      tabs.forEach(t => t.classList.toggle('is-active', t.dataset.id === 'start'));
      if (title) title.textContent = '· Welcome';
      body.innerHTML = welcomeHtml();
      wireWelcome();
      return;
    }
    /* ASK is a synthetic tab, not in FIELD_MANUAL. Render chat
       surface instead of topic content. */
    if (activeId === 'ask'){
      tabs.forEach(t => t.classList.toggle('is-active', t.dataset.id === 'ask'));
      if (title) title.textContent = '· Ask the Subnet Oracle';
      body.innerHTML = chatHtml();
      body.scrollTop = body.scrollHeight;
      wireChat();
      return;
    }

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

    /* TL;DR — sibling brief item 2: "A 'TL;DR' line at the top
       (one-sentence summary)." Built from topic.blurb (already
       a one-line description in the data file). Read-first
       chip-style strip so the reader knows what they're about
       to dive into. */
    const tldr = topic.blurb
      ? `<div class="sbnt-tldr"><span class="sbnt-tldr__lbl">TL;DR</span><span class="sbnt-tldr__txt">${topic.blurb}</span></div>`
      : '';

    /* Special topic: /play renders the interactive Yuma-consensus
       mini-game widget instead of static lines. */
    const content = topic.id === 'play'
      ? gameHtml()
      : (topic.body || []).map(lineHtml).join('');

    /* NEXT footer — sibling brief item 2: "A 'NEXT' footer linking
       the next topic in the reading flow." Uses WELCOME_STEPS as
       the canonical reading order (whitepaper → dtao → mine →
       validate → wallet → security). For topics outside that
       flow, fall back to the next adjacent FIELD_MANUAL entry. */
    const nextHtml = topic.id === 'play' ? '' : (() => {
      const idx = WELCOME_STEPS.findIndex(s => s.id === topic.id);
      let next = null;
      if (idx >= 0 && idx + 1 < WELCOME_STEPS.length){
        next = WELCOME_STEPS[idx + 1];
      } else {
        const fmIdx = FIELD_MANUAL.findIndex(t => t.id === topic.id);
        if (fmIdx >= 0 && fmIdx + 1 < FIELD_MANUAL.length){
          const n = FIELD_MANUAL[fmIdx + 1];
          next = { id: n.id, label: n.title || n.label };
        }
      }
      if (!next) return '';
      return `
        <footer class="sbnt-next">
          <span class="sbnt-next__lbl">NEXT IN THE FLOW</span>
          <button type="button" class="sbnt-next__btn" data-next-topic="${next.id}">
            <span class="sbnt-next__label">${next.label}</span>
            <span class="sbnt-next__arrow" aria-hidden="true">→</span>
          </button>
        </footer>`;
    })();

    body.innerHTML = searchBarHtml() + tldr + content + nextHtml
      + (topic.id === 'play' ? '' : `<span class="sbnt-p" style="margin-top:10px">› select a topic above<span class="sbnt-cursor"></span></span>`);
    body.scrollTop = 0;
    wireSearch();
    /* Wire NEXT button to switch active topic */
    const nextBtn = body.querySelector('[data-next-topic]');
    if (nextBtn){
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        activeId = nextBtn.dataset.nextTopic;
        render();
      });
    }
    if (topic.id === 'play') wireGame();
  }

  /* ======================================================================
     TAO RUNNER · a canvas arcade game built for the Subnet Oracle dock.
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
    alive:    false,        // not running yet, wait for first tap
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
    /* collide, player AABB vs hazard AABB */
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
    /* collect tokens, circle-vs-AABB */
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
    /* background, faint dot grid */
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
    /* hazards, red triangular sweeps */
    ctx.fillStyle = '#FF1E3C';
    RUNNER.hazards.forEach(h => {
      ctx.beginPath();
      ctx.moveTo(h.x, RUNNER.ground);
      ctx.lineTo(h.x + h.w / 2, RUNNER.ground - h.h);
      ctx.lineTo(h.x + h.w, RUNNER.ground);
      ctx.closePath();
      ctx.fill();
    });
    /* tokens, orange/red α circles */
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
    /* player, small chip with τ */
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

  /* tab clicks → switch topic. If the reader was on the welcome
     START tab and clicked anything else, set the onboarded flag
     + remove START from the row so the welcome doesn't re-appear. */
  tabs.forEach(t => {
    t.addEventListener('click', (e) => {
      e.stopPropagation();
      const nextId = t.dataset.id;
      if (activeId === 'start' && nextId !== 'start'){
        markOnboarded();
        removeStartTab();
      }
      activeId = nextId;
      render();
    });
  });

  /* collapse / expand on bar click, but not when a child button was clicked */
  bar.addEventListener('click', (e) => {
    /* Chip click in the collapsed bar = uncollapse AND jump to
       that tab. Handled FIRST so the bar's collapse-toggle below
       doesn't also fire on the same click. */
    const chip = e.target.closest('.sbnt-console__chip');
    if (chip){
      e.stopPropagation();
      const id = chip.dataset.id;
      if (id) activeId = id;
      el.classList.remove('is-collapsed');
      toggle.textContent = '−';
      render();
      return;
    }
    /* ignore clicks on the tabs, the search input, the game widget,
       the body content, the close button, and any anchor links,
       only bar-chrome clicks toggle the dock */
    if (e.target.closest('.sbnt-tab')) return;
    if (e.target.closest('.sbnt-console__tabs')) return;
    if (e.target.closest('.sbnt-console__body')) return;
    if (e.target.closest('.sbnt-console__close')) return;
    const collapsed = el.classList.toggle('is-collapsed');
    /* keep the toggle glyph the same family as the initial render,        single fullwidth ＋ or minus −, no brackets. Brackets wrap
       onto two lines inside the 24-px circular toggle and read as
       a broken UI. */
    toggle.textContent = collapsed ? '＋' : '−';
  });

  /* close button → fully dismiss the dock + persist the choice. The
     relaunch chip becomes visible automatically via CSS sibling
     selector. */
  if (closeBt){
    closeBt.addEventListener('click', (e) => {
      e.stopPropagation();
      el.classList.add('is-dismissed');
      try { localStorage.setItem(DISMISS_KEY, '1'); } catch (_){}
    });
  }

  /* expand button → toggle is-tall + persist. If the dock is
     collapsed when expand is hit, also uncollapse it so the user
     sees the result of their action. */
  if (expandBt){
    expandBt.addEventListener('click', (e) => {
      e.stopPropagation();
      const tall = el.classList.toggle('is-tall');
      if (tall && el.classList.contains('is-collapsed')){
        el.classList.remove('is-collapsed');
        toggle.innerHTML = `<svg viewBox="0 0 14 14" width="12" height="12" aria-hidden="true"><path d="M3 7 L 11 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" fill="none"/></svg>`;
      }
      try {
        if (tall) localStorage.setItem(TALL_KEY, '1');
        else      localStorage.removeItem(TALL_KEY);
      } catch (_){}
      expandBt.setAttribute('aria-label',
        tall ? 'Collapse Subnet Oracle dock to default height' : 'Expand Subnet Oracle dock to full height');
      expandBt.setAttribute('title', tall ? 'Collapse to default' : 'Expand tall');
    });
  }

  /* relaunch chip → bring the dock back + clear the persisted flag */
  relaunch.addEventListener('click', () => {
    el.classList.remove('is-dismissed');
    try { localStorage.removeItem(DISMISS_KEY); } catch (_){}
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
      nnSphere?.destroy();
      teardownTabHint();
      el.remove();
      relaunch.remove();
    },
  };
}
