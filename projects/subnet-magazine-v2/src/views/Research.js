/* =================================================================
   SUBNET ORACLE RESEARCH (the /research page)
   -----------------------------------------------------------------
   The autonomous research arm of Subneτ Magazine. Two articles per
   day filed by the AI Oracle:

     - SUBNET SPOTLIGHT, a deep dive on one subnet the human
       editorial desk has not covered recently
     - ECOSYSTEM STATE, a synthesis of where the network is right
       now (markets, ships, capital, comparators)

   This page deliberately reads as a DIFFERENT category from the
   human-written magazine research (which lives on the home page
   article carousel). Every article here carries the SUBNET ORACLE
   RESEARCH badge, the date filed, and a "filed by the AI Oracle"
   attribution line.

   Data: src/data/oracle-articles.js
   Updated each morning at 08:00 UTC by scripts/daily-research.py.
   ================================================================= */

import { html, mount, qs } from '../lib/dom.js';
import { ORACLE_ARTICLES, oracleArticlesByDate, oracleArticleById }
  from '../data/oracle-articles.js';
import { NodeSphere } from '../charts/NodeSphere.js';

const STYLE_ID = 'rsh-style';

const CSS = `
.rsh{
  max-width: 1100px;
  margin: 0 auto;
  padding: clamp(20px, 4vw, 56px) clamp(16px, 4vw, 40px);
}

/* ===== Page head ===== */
.rsh-head{
  display: grid;
  grid-template-columns: 1fr 96px;
  align-items: center;
  gap: 20px;
  padding-bottom: clamp(20px, 3vw, 32px);
  border-bottom: 1px solid var(--c-rule-2, rgba(255,30,60,.22));
  margin-bottom: clamp(28px, 4vw, 44px);
}
.rsh-head__text{ display: flex; flex-direction: column; gap: 10px; min-width: 0; }
.rsh-head__badge{
  display: inline-flex; align-items: center; gap: 8px;
  align-self: flex-start;
  padding: 6px 12px;
  background: rgba(255,30,60,.18);
  border: 1px solid var(--c-red, #FF1E3C);
  border-radius: 999px;
  font-family: var(--f-mono, monospace);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: #fff;
  box-shadow: 0 0 14px rgba(255,30,60,.3);
}
.rsh-head__badge::before{
  content: '';
  width: 6px; height: 6px;
  background: var(--c-red-1, #FF4D60);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--c-red-1, #FF4D60);
  animation: rshPulse 1.6s ease-in-out infinite;
}
@keyframes rshPulse{
  0%, 100%{ opacity: 1;  }
  50%     { opacity: .35; }
}
.rsh-head__title{
  margin: 0;
  font-family: var(--f-serif, 'Archivo', system-ui);
  font-size: clamp(36px, 6vw, 64px);
  font-weight: 800;
  letter-spacing: -.025em;
  line-height: 1;
  color: var(--c-ink-1, #F5E5E8);
}
.rsh-head__dek{
  margin: 0;
  max-width: 64ch;
  font-family: var(--f-sans, system-ui);
  font-size: 15px;
  line-height: 1.55;
  color: var(--c-ink-2, #C8A8AD);
}
.rsh-head__mark{
  width: 96px; height: 96px;
  position: relative;
  filter: drop-shadow(0 0 14px rgba(255,30,60,.45));
}
.rsh-head__mark canvas{
  width: 100% !important; height: 100% !important;
  border-radius: 50%;
}
@media (max-width: 560px){
  .rsh-head{ grid-template-columns: 1fr; }
  .rsh-head__mark{ display: none; }
}

/* ===== "How this works" note, sets the AI / human distinction ===== */
.rsh-note{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: clamp(28px, 4vw, 44px);
}
@media (max-width: 640px){ .rsh-note{ grid-template-columns: 1fr; } }
.rsh-note__cell{
  padding: 16px 18px;
  border: 1px solid var(--c-rule-2, rgba(255,30,60,.22));
  border-radius: 4px;
  background: rgba(0,0,0,.4);
}
.rsh-note__cell--ai{
  border-left: 3px solid var(--c-red, #FF1E3C);
  background: linear-gradient(90deg, rgba(255,30,60,.06), rgba(0,0,0,.4) 40%);
}
.rsh-note__lbl{
  display: block;
  margin-bottom: 6px;
  font-family: var(--f-mono, monospace);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--c-red-1, #FF4D60);
}
.rsh-note__cell--human .rsh-note__lbl{
  color: #FFB85C;
}
.rsh-note__body{
  margin: 0;
  font-family: var(--f-sans, system-ui);
  font-size: 13px;
  line-height: 1.55;
  color: var(--c-ink-2, #C8A8AD);
}

/* ===== Day group ===== */
.rsh-day{
  margin-bottom: clamp(36px, 5vw, 60px);
}
.rsh-day__head{
  display: flex; align-items: baseline; gap: 14px;
  padding-bottom: 10px;
  margin-bottom: 18px;
  border-bottom: 1px solid var(--c-rule, rgba(255,30,60,.10));
  font-family: var(--f-mono, monospace);
}
.rsh-day__date{
  font-size: 13px;
  font-weight: 800;
  letter-spacing: .04em;
  color: var(--c-red, #FF1E3C);
}
.rsh-day__count{
  font-size: 10px;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--c-ink-4, #6B4D52);
}

/* ===== Article ===== */
.rsh-art{
  display: flex; flex-direction: column;
  gap: 14px;
  padding: clamp(20px, 3vw, 30px);
  margin-bottom: 20px;
  background: rgba(8,2,3,.65);
  border: 1px solid var(--c-rule-2, rgba(255,30,60,.22));
  border-left: 3px solid var(--c-red, #FF1E3C);
  border-radius: 4px;
}
.rsh-art__kind{
  display: inline-flex; align-items: center; gap: 6px;
  align-self: flex-start;
  padding: 4px 10px;
  background: rgba(255,30,60,.12);
  border: 1px solid var(--c-rule-2, rgba(255,30,60,.36));
  border-radius: 3px;
  font-family: var(--f-mono, monospace);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--c-red-1, #FF4D60);
}
.rsh-art__kind--ecosystem{
  border-color: #FFB85C;
  color: #FFB85C;
  background: rgba(255,184,92,.10);
}
.rsh-art__sn{
  display: inline-block;
  margin-left: 6px;
  padding: 1px 6px;
  background: rgba(0,0,0,.6);
  border-radius: 2px;
  color: #fff;
  font-weight: 800;
}
.rsh-art__title{
  margin: 0;
  font-family: var(--f-serif, 'Archivo', system-ui);
  font-size: clamp(22px, 3vw, 32px);
  font-weight: 800;
  letter-spacing: -.014em;
  line-height: 1.15;
  color: var(--c-ink-1, #F5E5E8);
}
.rsh-art__dek{
  margin: 0;
  font-family: var(--f-sans, system-ui);
  font-size: 15px;
  line-height: 1.6;
  color: var(--c-ink-2, #C8A8AD);
  padding-left: 12px;
  border-left: 2px solid var(--c-red-1, #FF4D60);
}
.rsh-art__attr{
  display: flex; align-items: center; gap: 8px;
  font-family: var(--f-mono, monospace);
  font-size: 9.5px;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--c-ink-4, #6B4D52);
}
.rsh-art__attr-by{ color: var(--c-red-1, #FF4D60); font-weight: 700; }

.rsh-art__sec{
  display: flex; flex-direction: column;
  gap: 8px;
  padding-top: 14px;
  border-top: 1px solid var(--c-rule, rgba(255,30,60,.10));
}
.rsh-art__sec:first-of-type{ border-top: 0; padding-top: 0; }
.rsh-art__sec-h{
  margin: 0;
  font-family: var(--f-serif, 'Archivo', system-ui);
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -.005em;
  color: var(--c-red-1, #FF4D60);
}
.rsh-art__sec-body{
  margin: 0;
  font-family: var(--f-sans, system-ui);
  font-size: 15px;
  line-height: 1.65;
  color: var(--c-ink-2, #C8A8AD);
  white-space: pre-line;
}

/* ===== Sources ===== */
.rsh-art__src{
  display: flex; flex-direction: column; gap: 6px;
  padding-top: 12px;
  border-top: 1px dashed var(--c-rule-2, rgba(255,30,60,.22));
}
.rsh-art__src-lbl{
  font-family: var(--f-mono, monospace);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--c-ink-4, #6B4D52);
}
.rsh-art__src a{
  font-family: var(--f-mono, monospace);
  font-size: 11.5px;
  color: var(--c-red-1, #FF4D60);
  text-decoration: none;
  border-bottom: 1px dashed transparent;
  transition: border-color .12s ease-out;
}
.rsh-art__src a:hover{ border-bottom-color: var(--c-red-1, #FF4D60); }
`;

function injectStyle(){
  if (document.getElementById(STYLE_ID)) return;
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = CSS;
  document.head.appendChild(s);
}

function fmtDate(iso){
  const d = new Date(iso + 'T00:00:00Z');
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', {
    timeZone: 'UTC', weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });
}
function escapeHtml(s){
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function articleHtml(a){
  const kind = a.kind === 'subnet-spotlight'
    ? `Subnet Spotlight${a.subnetId ? `<span class="rsh-art__sn">SN${a.subnetId}${a.subnetName ? ' · ' + escapeHtml(a.subnetName) : ''}</span>` : ''}`
    : 'Ecosystem State';
  const kindCls = a.kind === 'ecosystem-state' ? ' rsh-art__kind--ecosystem' : '';

  const sectionsHtml = (a.sections || []).map(s => `
    <section class="rsh-art__sec">
      <h3 class="rsh-art__sec-h">${escapeHtml(s.h)}</h3>
      <p class="rsh-art__sec-body">${escapeHtml(s.body)}</p>
    </section>
  `).join('');

  const sourcesHtml = (a.sources && a.sources.length) ? `
    <div class="rsh-art__src">
      <span class="rsh-art__src-lbl">Sources</span>
      ${a.sources.map(s => `
        <a href="${escapeHtml(s.url)}" target="_blank" rel="noopener">${escapeHtml(s.label)} ↗</a>
      `).join('')}
    </div>
  ` : '';

  const filer = a.generatedBy === 'claude-opus-4-7'
    ? 'the AI Oracle (Claude Opus 4.7)'
    : 'the editorial desk (seed)';

  return `
    <article class="rsh-art" id="${escapeHtml(a.id)}">
      <span class="rsh-art__kind${kindCls}">${kind}</span>
      <h2 class="rsh-art__title">${escapeHtml(a.title)}</h2>
      <p class="rsh-art__dek">${escapeHtml(a.dek)}</p>
      <div class="rsh-art__attr">
        <span class="rsh-art__attr-by">⊕ filed by ${filer}</span>
      </div>
      ${sectionsHtml}
      ${sourcesHtml}
    </article>
  `;
}

/**
 * @param {HTMLElement} root
 * @returns {{ destroy: () => void }}
 */
export function mountResearch(root){
  injectStyle();

  const days = oracleArticlesByDate();
  const totalArticles = ORACLE_ARTICLES.length;
  const earliest = days.length ? days[days.length - 1].date : null;
  const sinceLine = earliest
    ? `${totalArticles} articles filed since ${fmtDate(earliest)}`
    : `${totalArticles} articles filed`;

  const daysHtml = days.map(d => `
    <section class="rsh-day" aria-label="${escapeHtml(d.date)}">
      <header class="rsh-day__head">
        <span class="rsh-day__date">${escapeHtml(fmtDate(d.date))}</span>
        <span class="rsh-day__count">${d.items.length} ${d.items.length === 1 ? 'article' : 'articles'}</span>
      </header>
      ${d.items.map(articleHtml).join('')}
    </section>
  `).join('');

  mount(root, html`
    <section class="rsh">
      <header class="rsh-head">
        <div class="rsh-head__text">
          <span class="rsh-head__badge">Subne<span class="tau">τ</span> Oracle Research</span>
          <h1 class="rsh-head__title">The Oracle's desk.</h1>
          <p class="rsh-head__dek">
            Two articles per day, filed by Subne<span class="tau">τ</span> Magazine's
            autonomous research agent. A subnet spotlight on something the human
            editorial desk has not covered, and a synthesis of the day's state of
            the ecosystem. Distinct from the human-written magazine articles by
            design, attributed clearly, mechanism-aware, hedged.
          </p>
        </div>
        <div class="rsh-head__mark" aria-hidden="true">
          <canvas data-canvas="rsh-mark"></canvas>
        </div>
      </header>

      <div class="rsh-note">
        <div class="rsh-note__cell rsh-note__cell--ai">
          <span class="rsh-note__lbl">⊕ This page</span>
          <p class="rsh-note__body">
            <strong>Subneτ Oracle Research.</strong> The AI agent, Claude Opus
            4.7, files two articles each morning at 08:00 UTC. ${escapeHtml(sinceLine)}.
            Every article carries the Oracle badge so the source is unambiguous.
          </p>
        </div>
        <div class="rsh-note__cell rsh-note__cell--human">
          <span class="rsh-note__lbl">For comparison</span>
          <p class="rsh-note__body">
            <strong>Subneτ Magazine Research.</strong> Long-form pieces written
            by the human editorial desk live on the magazine cover. They are
            slower, deeper, and explicitly editorial. The two categories run
            in parallel and never overlap on subject.
          </p>
        </div>
      </div>

      ${daysHtml}
    </section>
  `);

  /* mount the NodeSphere mark in the page head */
  const markCv = qs('[data-canvas="rsh-mark"]', root);
  const mark = markCv ? new NodeSphere(markCv, {
    nodes: 48, K: 3, density: 0.52, speed: 0.4, atmos: true,
  }) : null;

  return {
    destroy(){
      try { mark?.destroy(); } catch (_) {}
    },
  };
}
