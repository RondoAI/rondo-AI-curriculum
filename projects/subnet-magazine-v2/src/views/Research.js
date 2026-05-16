/* =================================================================
   RESEARCH VIEW
   -----------------------------------------------------------------
   The daily ecosystem desk. Lead with today's brief; surface a
   sidebar of past briefs so readers can walk the timeline. Briefs
   come from src/data/research.js, which the daily GitHub Action
   prepends to each morning.

   No external deps; pure render off the imported array. Inline
   styles are scoped via a single <style> tag that injects once
   per page load.
   ================================================================= */

import { html, mount, qs } from '../lib/dom.js';
import { BRIEFS, latestBrief, briefByDate } from '../data/research.js';
import { CandleChart } from '../charts/CandleChart.js';
import { BarChart } from '../charts/BarChart.js';
import { NodeSphere } from '../charts/NodeSphere.js';

const STYLE_ID = 'rsh-style';

const CSS = `
.rsh{
  display: grid;
  grid-template-columns: 1fr min(280px, 32%);
  gap: clamp(20px, 4vw, 48px);
  padding: clamp(20px, 4vw, 56px) clamp(16px, 4vw, 40px);
  max-width: 1200px;
  margin: 0 auto;
}
@media (max-width: 720px){
  .rsh{ grid-template-columns: 1fr; }
}

.rsh-head{
  grid-column: 1 / -1;
  position: relative;
  display: grid;
  grid-template-columns: 1fr 88px;
  align-items: center;
  gap: 16px;
  padding-bottom: clamp(20px, 3vw, 32px);
  border-bottom: 1px solid var(--c-rule-2, rgba(255,30,60,.22));
  margin-bottom: clamp(20px, 3vw, 32px);
}
.rsh-head__text{ display: flex; flex-direction: column; gap: 8px; min-width: 0; }
.rsh-head__mark{
  width: 88px; height: 88px;
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
.rsh-head__kicker{
  font-family: var(--f-mono, monospace);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--c-red, #FF1E3C);
}
.rsh-head__title{
  margin: 0;
  font-family: var(--f-serif, 'Archivo', system-ui);
  font-size: clamp(40px, 6vw, 72px);
  font-weight: 800;
  letter-spacing: -.025em;
  line-height: 1;
  color: var(--c-ink-1, #F5E5E8);
}
.rsh-head__dek{
  margin: 8px 0 0;
  max-width: 64ch;
  font-family: var(--f-sans, system-ui);
  font-size: 15px;
  line-height: 1.55;
  color: var(--c-ink-2, #C8A8AD);
}

/* ===== Lead brief ===== */
.rsh-brief{
  display: flex; flex-direction: column;
  gap: clamp(20px, 3vw, 32px);
  min-width: 0;
}
.rsh-brief__date{
  display: flex; align-items: center; gap: 10px;
  font-family: var(--f-mono, monospace);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--c-red-1, #FF4D60);
}
.rsh-brief__live{
  display: inline-flex; align-items: center; gap: 5px;
  padding: 3px 7px;
  border: 1px solid rgba(0,229,168,.4);
  border-radius: 3px;
  color: var(--c-up, #00E5A8);
  font-size: 9.5px;
}
.rsh-brief__live::before{
  content: '';
  width: 5px; height: 5px;
  background: var(--c-up, #00E5A8);
  border-radius: 50%;
  box-shadow: 0 0 6px var(--c-up, #00E5A8);
  animation: rshPulse 1.6s ease-in-out infinite;
}
@keyframes rshPulse{
  0%, 100%{ opacity: 1; }
  50%     { opacity: .4; }
}
.rsh-brief__by{
  margin-left: auto;
  font-weight: 500;
  letter-spacing: .04em;
  color: var(--c-ink-4, #6B4D52);
  text-transform: none;
}

.rsh-brief__headline{
  margin: 0;
  font-family: var(--f-serif, 'Archivo', system-ui);
  font-size: clamp(28px, 4vw, 44px);
  font-weight: 800;
  letter-spacing: -.018em;
  line-height: 1.1;
  color: var(--c-ink-1, #F5E5E8);
}
.rsh-brief__summary{
  margin: 0;
  font-family: var(--f-sans, system-ui);
  font-size: 17px;
  line-height: 1.6;
  color: var(--c-ink-2, #C8A8AD);
  padding-left: 12px;
  border-left: 2px solid var(--c-red, #FF1E3C);
}

/* TAO price candle + movers bar chart, side by side on wide screens */
.rsh-viz{
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 14px;
  margin-bottom: 6px;
}
@media (max-width: 720px){
  .rsh-viz{ grid-template-columns: 1fr; }
}
.rsh-viz__block{
  display: flex; flex-direction: column;
  background: rgba(0,0,0,.35);
  border: 1px solid var(--c-rule-2, rgba(255,30,60,.22));
  border-radius: 4px;
  overflow: hidden;
}
.rsh-viz__bar{
  display: flex; align-items: center; gap: 8px;
  padding: 8px 12px;
  border-bottom: 1px solid var(--c-rule, rgba(255,30,60,.10));
  font-family: var(--f-mono, monospace);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--c-red-1, #FF4D60);
}
.rsh-viz__bar-sub{
  margin-left: auto;
  color: var(--c-ink-3, #8B6B70);
  font-weight: 600;
  letter-spacing: .04em;
  text-transform: none;
}
.rsh-viz__canvas{
  display: block;
  width: 100% !important;
  height: 240px !important;
}

/* movers strip */
.rsh-movers{
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 10px;
  padding: 14px;
  background: rgba(255,30,60,.04);
  border: 1px solid var(--c-rule-2, rgba(255,30,60,.22));
  border-radius: 4px;
}
.rsh-mover{
  display: flex; flex-direction: column; gap: 3px;
  padding: 8px 10px;
  background: rgba(0,0,0,.4);
  border-radius: 3px;
  border: 1px solid var(--c-rule, rgba(255,30,60,.10));
}
.rsh-mover__top{
  display: flex; align-items: baseline; gap: 8px;
  font-family: var(--f-mono, monospace);
  font-size: 11px;
}
.rsh-mover__tk{
  font-weight: 800;
  color: var(--c-ink-1, #F5E5E8);
  letter-spacing: .04em;
}
.rsh-mover__name{
  color: var(--c-ink-3, #8B6B70);
  font-size: 10.5px;
}
.rsh-mover__chg{
  margin-left: auto;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}
.rsh-mover__chg.up  { color: var(--c-up, #00E5A8); }
.rsh-mover__chg.down{ color: var(--c-red-1, #FF4D60); }
.rsh-mover__note{
  font-family: var(--f-sans, system-ui);
  font-size: 11px;
  color: var(--c-ink-3, #8B6B70);
  line-height: 1.4;
}

/* sections */
.rsh-sec{
  display: flex; flex-direction: column; gap: 8px;
  padding-top: 18px;
  border-top: 1px solid var(--c-rule, rgba(255,30,60,.10));
}
.rsh-sec__h{
  margin: 0;
  font-family: var(--f-serif, 'Archivo', system-ui);
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -.01em;
  color: var(--c-red-1, #FF4D60);
}
.rsh-sec__body{
  margin: 0;
  font-family: var(--f-sans, system-ui);
  font-size: 15px;
  line-height: 1.6;
  color: var(--c-ink-2, #C8A8AD);
}

/* sources */
.rsh-src{
  padding-top: 14px;
  border-top: 1px dashed var(--c-rule-2, rgba(255,30,60,.22));
  display: flex; flex-direction: column; gap: 6px;
}
.rsh-src__lbl{
  font-family: var(--f-mono, monospace);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--c-ink-4, #6B4D52);
}
.rsh-src a{
  font-family: var(--f-mono, monospace);
  font-size: 11.5px;
  color: var(--c-red-1, #FF4D60);
  text-decoration: none;
  border-bottom: 1px dashed transparent;
  transition: border-color .12s ease-out;
}
.rsh-src a:hover{ border-bottom-color: var(--c-red-1, #FF4D60); }

/* ===== Sidebar: archive ===== */
.rsh-aside{
  position: sticky;
  top: 16px;
  align-self: start;
  display: flex; flex-direction: column; gap: 10px;
  padding: 16px;
  background: rgba(0,0,0,.3);
  border: 1px solid var(--c-rule-2, rgba(255,30,60,.22));
  border-radius: 4px;
  font-family: var(--f-mono, monospace);
}
.rsh-aside__h{
  margin: 0;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--c-red, #FF1E3C);
  padding-bottom: 8px;
  border-bottom: 1px solid var(--c-rule, rgba(255,30,60,.10));
}
.rsh-arch{
  list-style: none;
  margin: 0; padding: 0;
  display: flex; flex-direction: column;
  gap: 2px;
}
.rsh-arch__a{
  display: flex; flex-direction: column; gap: 2px;
  padding: 8px 10px;
  border-radius: 3px;
  text-decoration: none;
  color: var(--c-ink-2, #C8A8AD);
  transition: background .12s ease-out;
}
.rsh-arch__a:hover{ background: rgba(255,30,60,.08); }
.rsh-arch__a.is-active{
  background: rgba(255,30,60,.12);
  border-left: 2px solid var(--c-red, #FF1E3C);
  padding-left: 8px;
}
.rsh-arch__date{
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: .04em;
  color: var(--c-red-1, #FF4D60);
}
.rsh-arch__title{
  font-family: var(--f-serif, 'Archivo', system-ui);
  font-size: 12.5px;
  line-height: 1.3;
  color: var(--c-ink-1, #F5E5E8);
}

.rsh-aside__note{
  margin: 10px 0 0;
  padding-top: 10px;
  border-top: 1px dashed var(--c-rule, rgba(255,30,60,.10));
  font-size: 10px;
  letter-spacing: .04em;
  color: var(--c-ink-4, #6B4D52);
  line-height: 1.5;
}
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
function shortDate(iso){
  const d = new Date(iso + 'T00:00:00Z');
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', {
    timeZone: 'UTC', month: 'short', day: 'numeric',
  }).toUpperCase();
}
function escapeHtml(s){
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * @param {HTMLElement} root
 * @returns {{ destroy: () => void }}
 */
export function mountResearch(root){
  injectStyle();

  /* deep-link via ?date=YYYY-MM-DD, fall back to latest */
  const params = new URLSearchParams(window.location.search);
  const wanted = params.get('date');
  const active = (wanted && briefByDate(wanted)) || latestBrief();

  const moversHtml = (active.movers || []).map(m => {
    const up = String(m.change || '').trim().startsWith('+');
    return `
      <li class="rsh-mover">
        <div class="rsh-mover__top">
          <span class="rsh-mover__tk">${escapeHtml(m.ticker)}</span>
          <span class="rsh-mover__name">${escapeHtml(m.name)}</span>
          <span class="rsh-mover__chg ${up ? 'up' : 'down'}">${escapeHtml(m.change)}</span>
        </div>
        ${m.note ? `<span class="rsh-mover__note">${escapeHtml(m.note)}</span>` : ''}
      </li>
    `;
  }).join('');

  const sectionsHtml = (active.sections || []).map(s => `
    <section class="rsh-sec">
      <h3 class="rsh-sec__h">${escapeHtml(s.h)}</h3>
      <p class="rsh-sec__body">${escapeHtml(s.body)}</p>
    </section>
  `).join('');

  const sourcesHtml = (active.sources && active.sources.length) ? `
    <div class="rsh-src">
      <span class="rsh-src__lbl">Sources</span>
      ${active.sources.map(s => `
        <a href="${escapeHtml(s.url)}" target="_blank" rel="noopener">${escapeHtml(s.label)} ↗</a>
      `).join('')}
    </div>
  ` : '';

  const archHtml = BRIEFS.map(b => `
    <li>
      <a class="rsh-arch__a ${b.date === active.date ? 'is-active' : ''}" href="?date=${b.date}">
        <span class="rsh-arch__date">${shortDate(b.date)}</span>
        <span class="rsh-arch__title">${escapeHtml(b.headline)}</span>
      </a>
    </li>
  `).join('');

  mount(root, html`
    <section class="rsh">
      <header class="rsh-head">
        <div class="rsh-head__text">
          <span class="rsh-head__kicker">Research &middot; Subne<span class="tau">τ</span> Magazine</span>
          <h1 class="rsh-head__title">The daily desk.</h1>
          <p class="rsh-head__dek">
            What happened in the Bittensor ecosystem today, distilled by the magazine's
            autonomous research agent. Published every morning at 08:00 UTC. The agent
            reads the chain, the social signal, and the partner subnets, then files
            the brief you see here. The record is the record, prior briefs are never
            deleted.
          </p>
        </div>
        <div class="rsh-head__mark" aria-hidden="true">
          <canvas data-canvas="rsh-mark"></canvas>
        </div>
      </header>

      <article class="rsh-brief">
        <div class="rsh-brief__date">
          ${active.date === latestBrief().date
            ? `<span class="rsh-brief__live">LIVE</span>` : ''}
          ${escapeHtml(fmtDate(active.date))}
          <span class="rsh-brief__by">filed by ${escapeHtml(active.generatedBy === 'claude-opus-4-7' ? 'the research agent' : 'the editorial desk')}</span>
        </div>
        <h2 class="rsh-brief__headline">${escapeHtml(active.headline)}</h2>
        <p class="rsh-brief__summary">${escapeHtml(active.summary)}</p>

        <!-- TAO price + movers visualization, side by side -->
        <div class="rsh-viz">
          <div class="rsh-viz__block">
            <div class="rsh-viz__bar">
              τ TAO · 60h synthetic
              <span class="rsh-viz__bar-sub">deterministic seed: ${active.date}</span>
            </div>
            <canvas class="rsh-viz__canvas" data-canvas="rsh-candle"></canvas>
          </div>
          <div class="rsh-viz__block">
            <div class="rsh-viz__bar">
              Today's movers
              <span class="rsh-viz__bar-sub">${(active.movers || []).length} rows</span>
            </div>
            <canvas class="rsh-viz__canvas" data-canvas="rsh-bars"></canvas>
          </div>
        </div>

        ${moversHtml ? `<ul class="rsh-movers" style="list-style:none;margin:0;padding:14px;">${moversHtml}</ul>` : ''}

        ${sectionsHtml}

        ${sourcesHtml}
      </article>

      <aside class="rsh-aside" aria-label="Past briefs">
        <h2 class="rsh-aside__h">Past briefs</h2>
        <ul class="rsh-arch">${archHtml}</ul>
        <p class="rsh-aside__note">
          Generated by the desk's research agent each morning. Source code:
          scripts/daily-research.py.
        </p>
      </aside>
    </section>
  `);

  /* ---------- mount the visualizations ---------- */
  /* NodeSphere mark in the page head, the magazine's signature
     "this is a working system" cue. */
  const markCv = qs('[data-canvas="rsh-mark"]', root);
  const mark = markCv ? new NodeSphere(markCv, {
    nodes: 42, K: 3, density: 0.5, speed: 0.4, atmos: true,
  }) : null;

  /* TAO candle chart, deterministic seed off the brief's date so
     each archived day shows a stable series rather than a roll-of-
     the-dice synthetic. Real ticker integration lands when there's
     a price feed plumbed through DataLayer. */
  const candleCv = qs('[data-canvas="rsh-candle"]', root);
  const dateSeed = active.date.split('-').reduce((a, p) => a * 31 + Number(p), 0);
  const candle = candleCv ? new CandleChart(candleCv, {
    bars:     60,
    baseline: 487,
    barMs:    60 * 60 * 1000,
    seed:     dateSeed,
  }) : null;

  /* Movers bar chart. Parses the brief's percentage strings into
     signed numbers, paints positives green, negatives red. */
  const barsCv = qs('[data-canvas="rsh-bars"]', root);
  let bars = null;
  if (barsCv && (active.movers || []).length){
    const rows = (active.movers || []).map(m => {
      const n = parseFloat(String(m.change).replace(/[+%]/g, '')) || 0;
      return {
        label: `${m.ticker} ${m.name}`,
        value: n,
        sub:   m.change,
        color: n >= 0 ? '#00E5A8' : '#FF4D60',
      };
    });
    bars = new BarChart(barsCv, {
      data: rows,
      orientation: 'horizontal',
      bipolar: true,
      formatValue: v => `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`,
    });
  }

  return {
    destroy(){
      try { mark?.destroy(); } catch (_) {}
      try { candle?.destroy(); } catch (_) {}
      try { bars?.destroy(); } catch (_) {}
    },
  };
}
