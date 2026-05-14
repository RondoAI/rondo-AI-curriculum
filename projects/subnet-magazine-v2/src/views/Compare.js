/* =================================================================
   SUBNET MAGAZINE — COMPARE PAGE
   -----------------------------------------------------------------
   Test Bittensor subnets vs centralized models side-by-side.

     · Prompt input + sample prompts as chips
     · Provider selector grid — pick which to compare
     · Side-by-side response cards with latency / token rate /
       blended $ / 1M / quality score / region + open flag
     · "Run" button simulates each selected provider's response
       with a realistic per-provider delay so the experience reads
       as live
     · Cost calculator at the bottom — sliders for input length,
       output length, requests/day → estimated monthly bill per
       provider, ranked cheapest first

   The page is intentionally honest: every response is marked as
   simulated. Wiring real Bittensor / OpenAI / Anthropic APIs is
   a follow-up that swaps the response generator.
   ================================================================= */

import { html, mount, qs, raw } from '../lib/dom.js';
import { PROVIDERS, providerById, cheapestBlended } from '../data/inference-providers.js';
import { SAMPLE_PROMPTS, QUALITY_BASELINE, placeholderFor } from '../data/inference-prompts.js';
import { catColor } from '../data/categories.js';

const REGION_LABEL = {
  US:'United States', UK:'United Kingdom', EU:'EU', DE:'Germany',
  CN:'China', KR:'South Korea', JP:'Japan', TW:'Taiwan', IN:'India',
  NO:'Norway', CA:'Canada', DECENTRAL: 'Decentralized',
};

/**
 * @param {HTMLElement} root
 */
export function mountCompare(root){
  /* default selected providers — a mix of subnets, frontier, and open */
  const defaultSelected = new Set(['sn1', 'sn4', 'opus47', 'gpt51', 'dsr3', 'qwen3']);

  mount(root, html`
    <section class="cmp">
      <!-- ===== Page header ===== -->
      <header class="cmp__head">
        <a class="sd-back" href="terminal.html">‹ TERMINAL</a>
        <div class="cmp__head-main">
          <span class="cmp__kicker">&lt;700&gt;  COMPARE</span>
          <h1 class="cmp__title">Bittensor <em>versus</em> the centralized world.</h1>
          <p class="cmp__sub">
            Submit a prompt, pick providers, watch them respond side-by-side.
            Every metric — latency, output rate, blended cost per million tokens,
            quality score — is comparable head-to-head. Decentralized subnets sit
            next to Claude, GPT-5, Gemini, DeepSeek, Llama, and Qwen so you can
            see exactly what you give up and what you gain by going on-chain.
          </p>
        </div>
        <div class="cmp__head-meta">
          <span class="sd-pill"><span class="live-dot"></span>SIMULATED</span>
          <span class="sd-pill">v0.24</span>
        </div>
      </header>

      <!-- ===== Prompt input + sample chips ===== -->
      <section class="cmp-input panel is-bracketed">
        <div class="panel__head">
          <span class="panel__title">
            <span class="panel__fcode">&lt;701&gt;</span>
            PROMPT
            <span class="panel__go">&lt;GO&gt;</span>
          </span>
          <span class="panel__meta">
            <span class="panel__pill">CTRL + ENTER · RUN</span>
          </span>
        </div>
        <div class="panel__body">
          <textarea id="cmp-prompt" class="cmp-prompt" rows="3"
            placeholder="Type a prompt to test against every selected provider…">${SAMPLE_PROMPTS[0].prompt}</textarea>
          <div class="cmp-samples">
            <span class="cmp-samples__lbl">Try</span>
            ${SAMPLE_PROMPTS.map((s, i) => `
              <button class="cmp-chip" data-sample="${i}">${s.prompt.slice(0, 48)}${s.prompt.length > 48 ? '…' : ''}</button>
            `).join('')}
          </div>
          <div class="cmp-actions">
            <button class="cmp-run" id="cmp-run">▶ RUN  &lt;GO&gt;</button>
            <button class="cmp-clear" id="cmp-clear">Clear</button>
            <span class="cmp-actions__hint">${defaultSelected.size} providers selected</span>
          </div>
        </div>
      </section>

      <!-- ===== Provider selection grid ===== -->
      <section class="cmp-select panel is-bracketed">
        <div class="panel__head">
          <span class="panel__title">
            <span class="panel__fcode">&lt;710&gt;</span>
            PROVIDERS · SELECT TO COMPARE
            <span class="panel__go">&lt;GO&gt;</span>
          </span>
          <span class="panel__meta">
            <span class="panel__pill">${PROVIDERS.length} TRACKED</span>
          </span>
        </div>
        <div class="panel__body cmp-grid">
          ${PROVIDERS.map(p => `
            <label class="cmp-card ${defaultSelected.has(p.id) ? 'is-selected' : ''}" data-prov="${p.id}">
              <input type="checkbox" ${defaultSelected.has(p.id) ? 'checked' : ''}>
              <span class="cmp-card__head">
                <span class="cmp-card__name">${p.name}</span>
                <span class="cmp-card__kind cmp-card__kind--${p.kind}">${p.kind === 'subnet' ? 'DECENTRAL' : p.kind === 'open' ? 'OPEN' : 'FRONTIER'}</span>
              </span>
              <span class="cmp-card__org">${p.org}</span>
              <span class="cmp-card__desc">${p.desc}</span>
              <span class="cmp-card__metrics">
                <span><b>$${(p.priceIn + p.priceOut).toFixed(2)}</b>/1M</span>
                <span><b>${p.latencyMs}</b>ms</span>
                <span><b>${p.tokenPerSec}</b> t/s</span>
                <span><b>${p.contextK}k</b> ctx</span>
              </span>
              <span class="cmp-card__flags">
                <span class="flag flag--region flag--${p.region.toLowerCase().replace('decentral','red')}">${p.region === 'DECENTRAL' ? 'τ' : p.region}</span>
                ${p.open ? '<span class="flag flag--open">OPEN</span>' : ''}
              </span>
            </label>
          `).join('')}
        </div>
        <div class="panel__foot">
          <span>SELECT 2–8 PROVIDERS</span>
          <span>SUBNETS · FRONTIER · OPEN-WEIGHTS</span>
        </div>
      </section>

      <!-- ===== Results ===== -->
      <section class="cmp-results panel is-bracketed">
        <div class="panel__head">
          <span class="panel__title">
            <span class="panel__fcode">&lt;720&gt;</span>
            RESULTS · SIDE-BY-SIDE
            <span class="panel__go">&lt;GO&gt;</span>
          </span>
          <span class="panel__meta">
            <span class="panel__pill panel__pill--live"><span class="live-dot"></span>SIM</span>
          </span>
        </div>
        <div class="panel__body cmp-results__body" id="cmp-results">
          <div class="cmp-empty">Hit ▶ RUN to compare responses.</div>
        </div>
        <div class="panel__foot">
          <span>METRICS · LATENCY · OUTPUT RATE · BLENDED $/1M · QUALITY</span>
          <span id="cmp-results-count">— PROVIDERS</span>
        </div>
      </section>

      <!-- ===== Cost calculator ===== -->
      <section class="cmp-calc panel is-bracketed">
        <div class="panel__head">
          <span class="panel__title">
            <span class="panel__fcode">&lt;730&gt;</span>
            INFERENCE COST CALCULATOR
            <span class="panel__go">&lt;GO&gt;</span>
          </span>
          <span class="panel__meta">
            <span class="panel__pill">PER MONTH</span>
          </span>
        </div>
        <div class="panel__caption">
          Estimate what your monthly inference bill would look like across every provider at a
          given workload. Sliders set input tokens, output tokens, and requests per day.
          Results are ranked cheapest-first. Bittensor subnets are flagged so you can see how
          much running the same workload on-chain costs.
        </div>
        <div class="panel__body cmp-calc__body">
          <div class="cmp-calc__inputs">
            <label class="cmp-slider">
              <span class="cmp-slider__lbl">Input tokens / request</span>
              <input type="range" id="calc-in"  min="200" max="32000" step="100" value="2000">
              <span class="cmp-slider__val" id="calc-in-val">2,000</span>
            </label>
            <label class="cmp-slider">
              <span class="cmp-slider__lbl">Output tokens / request</span>
              <input type="range" id="calc-out" min="100" max="8000"  step="50"  value="800">
              <span class="cmp-slider__val" id="calc-out-val">800</span>
            </label>
            <label class="cmp-slider">
              <span class="cmp-slider__lbl">Requests / day</span>
              <input type="range" id="calc-rps" min="100" max="1000000" step="100" value="10000">
              <span class="cmp-slider__val" id="calc-rps-val">10,000</span>
            </label>
          </div>
          <ol class="cmp-calc__list" id="cmp-calc-list"></ol>
        </div>
        <div class="panel__foot">
          <span>BLENDED COST = (in × priceIn + out × priceOut) × requests × 30 / 1M</span>
          <span>SIMULATED · NO LIVE BILLING</span>
        </div>
      </section>
    </section>
  `);

  /* ---------- State ---------- */
  const selected = new Set(defaultSelected);
  let currentSampleIdx = 0;
  const promptEl     = qs('#cmp-prompt',         root);
  const hintEl       = qs('.cmp-actions__hint',  root);
  const resultsRoot  = qs('#cmp-results',        root);
  const resultsCount = qs('#cmp-results-count',  root);

  /* ---------- Sample chip handlers ---------- */
  root.querySelectorAll('.cmp-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      currentSampleIdx = Number(chip.dataset.sample);
      promptEl.value = SAMPLE_PROMPTS[currentSampleIdx].prompt;
    });
  });

  /* ---------- Provider selection ---------- */
  function updateHint(){
    if (hintEl) hintEl.textContent = `${selected.size} providers selected`;
  }
  updateHint();

  root.querySelectorAll('.cmp-card').forEach(card => {
    const id = card.dataset.prov;
    const cb = card.querySelector('input[type=checkbox]');
    card.addEventListener('click', e => {
      /* clicking the card toggles the checkbox (preventing event from
         firing the native click on the input + the label twice) */
      if (e.target === cb) return;
      cb.checked = !cb.checked;
      if (cb.checked) selected.add(id); else selected.delete(id);
      card.classList.toggle('is-selected', cb.checked);
      updateHint();
    });
    cb.addEventListener('change', () => {
      if (cb.checked) selected.add(id); else selected.delete(id);
      card.classList.toggle('is-selected', cb.checked);
      updateHint();
    });
  });

  /* ---------- Response renderer ---------- */
  function escapeHtml(s){
    return s.replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }
  function formatResponse(raw){
    /* turn ``` code fences into <pre>. naive but enough for prototype */
    let out = ''; let inCode = false; const lines = raw.split('\n');
    for (const ln of lines){
      const codeMark = ln.match(/^```/);
      if (codeMark){
        out += inCode ? '</code></pre>' : '<pre><code>';
        inCode = !inCode; continue;
      }
      out += inCode ? escapeHtml(ln) + '\n' : escapeHtml(ln) + '<br>';
    }
    if (inCode) out += '</code></pre>';
    return out;
  }

  function runOne(prov, prompt){
    const card = SAMPLE_PROMPTS[currentSampleIdx];
    let txt;
    if (card && prompt.trim() === card.prompt.trim() && card.responses[prov.id]){
      txt = card.responses[prov.id];
    } else {
      txt = placeholderFor(prov, prompt);
    }
    /* derive per-provider quality + cost figures for this run */
    const qual = QUALITY_BASELINE[prov.id] ?? 70;
    /* estimate token counts: prompt words → tokens (~1.3) and response → tokens (~chars/4) */
    const inTok = Math.round(prompt.split(/\s+/).length * 1.3);
    const outTok = Math.round(txt.length / 4);
    const cost = (inTok * prov.priceIn + outTok * prov.priceOut) / 1_000_000;
    return { txt, qual, inTok, outTok, cost };
  }

  /* ---------- Run ---------- */
  const runBtn = qs('#cmp-run', root);
  const clearBtn = qs('#cmp-clear', root);
  let runToken = 0;

  async function run(){
    const prompt = promptEl.value.trim();
    if (!prompt){ promptEl.focus(); return; }
    const ids = Array.from(selected).slice(0, 8);    // cap at 8 to keep the page sane
    if (!ids.length){
      resultsRoot.innerHTML = '<div class="cmp-empty">Pick at least one provider in the panel above.</div>';
      return;
    }
    runToken += 1;
    const myRun = runToken;

    /* paint loading skeletons */
    resultsRoot.innerHTML = ids.map(id => {
      const p = providerById(id);
      return `
        <article class="cmp-out is-loading" data-prov="${id}">
          <header class="cmp-out__head">
            <span class="cmp-out__name">${p.name}</span>
            <span class="cmp-out__org">${p.org}</span>
            <span class="cmp-out__kind cmp-out__kind--${p.kind}">${p.kind === 'subnet' ? 'DECENTRAL' : p.kind === 'open' ? 'OPEN' : 'FRONTIER'}</span>
          </header>
          <div class="cmp-out__metrics">
            <span class="cmp-out__metric"><b>—</b><i>latency</i></span>
            <span class="cmp-out__metric"><b>—</b><i>output rate</i></span>
            <span class="cmp-out__metric"><b>—</b><i>cost</i></span>
            <span class="cmp-out__metric"><b>—</b><i>quality</i></span>
          </div>
          <div class="cmp-out__body">
            <div class="cmp-out__spinner">
              <span></span><span></span><span></span>
              <em>${p.name} is thinking…</em>
            </div>
          </div>
        </article>
      `;
    }).join('');
    if (resultsCount) resultsCount.textContent = `${ids.length} PROVIDERS · RUNNING`;

    /* "stream" each response with a realistic latency */
    for (const id of ids){
      const p = providerById(id);
      /* per-provider delay: half the actual ms for a snappier UX */
      const delay = Math.max(180, p.latencyMs * 0.5 + Math.random() * 200);
      // eslint-disable-next-line no-await-in-loop
      await new Promise(r => setTimeout(r, delay));
      if (myRun !== runToken) return;   // a newer run started
      const { txt, qual, inTok, outTok, cost } = runOne(p, prompt);
      const el = resultsRoot.querySelector(`.cmp-out[data-prov="${id}"]`);
      if (!el) continue;
      el.classList.remove('is-loading');
      el.innerHTML = `
        <header class="cmp-out__head">
          <span class="cmp-out__name">${p.name}</span>
          <span class="cmp-out__org">${p.org}</span>
          <span class="cmp-out__kind cmp-out__kind--${p.kind}">${p.kind === 'subnet' ? 'DECENTRAL' : p.kind === 'open' ? 'OPEN' : 'FRONTIER'}</span>
          <span class="cmp-out__flags">
            ${p.open ? '<span class="flag flag--open">OPEN</span>' : ''}
            <span class="flag flag--region flag--${p.region.toLowerCase().replace('decentral','red')}">${p.region === 'DECENTRAL' ? 'τ' : p.region}</span>
          </span>
        </header>
        <div class="cmp-out__metrics">
          <span class="cmp-out__metric"><b>${p.latencyMs}<i>ms</i></b><i>latency</i></span>
          <span class="cmp-out__metric"><b>${p.tokenPerSec}<i>t/s</i></b><i>output rate</i></span>
          <span class="cmp-out__metric"><b>$${cost.toFixed(5)}</b><i>this run</i></span>
          <span class="cmp-out__metric">
            <b>${qual}/100</b>
            <i>quality (baseline)</i>
            <span class="cmp-out__qbar"><i style="width:${qual}%"></i></span>
          </span>
        </div>
        <div class="cmp-out__body">${formatResponse(txt)}</div>
        <footer class="cmp-out__foot">
          <span>in ${inTok} · out ${outTok} tokens</span>
          <span>$${(p.priceIn + p.priceOut).toFixed(2)} / 1M blended</span>
        </footer>
      `;
    }
    if (resultsCount) resultsCount.textContent = `${ids.length} PROVIDERS · DONE`;
  }

  runBtn?.addEventListener('click', run);
  clearBtn?.addEventListener('click', () => {
    resultsRoot.innerHTML = '<div class="cmp-empty">Hit ▶ RUN to compare responses.</div>';
    if (resultsCount) resultsCount.textContent = '— PROVIDERS';
  });
  promptEl?.addEventListener('keydown', e => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)){ e.preventDefault(); run(); }
  });

  /* ---------- Cost calculator ---------- */
  const calcIn   = qs('#calc-in',  root);
  const calcOut  = qs('#calc-out', root);
  const calcRps  = qs('#calc-rps', root);
  const calcInV  = qs('#calc-in-val',  root);
  const calcOutV = qs('#calc-out-val', root);
  const calcRpsV = qs('#calc-rps-val', root);
  const calcList = qs('#cmp-calc-list', root);

  function renderCalc(){
    const inTok  = Number(calcIn.value);
    const outTok = Number(calcOut.value);
    const rps    = Number(calcRps.value);
    if (calcInV)  calcInV.textContent  = inTok.toLocaleString('en-US');
    if (calcOutV) calcOutV.textContent = outTok.toLocaleString('en-US');
    if (calcRpsV) calcRpsV.textContent = rps.toLocaleString('en-US');

    const rows = PROVIDERS.map(p => {
      const perReq = (inTok * p.priceIn + outTok * p.priceOut) / 1_000_000;
      const monthly = perReq * rps * 30;
      return { p, perReq, monthly };
    }).sort((a, b) => a.monthly - b.monthly);

    const max = rows[rows.length - 1].monthly;
    if (calcList){
      calcList.innerHTML = rows.map((r, i) => {
        const p = r.p;
        const w = Math.max(2, (r.monthly / max) * 100);
        return `
          <li class="cmp-calc__row">
            <span class="cmp-calc__rank">${String(i + 1).padStart(2, '0')}</span>
            <span class="cmp-calc__name">
              <span class="cmp-calc__pname">${p.name}</span>
              <span class="cmp-calc__pkind cmp-card__kind--${p.kind}">${p.kind === 'subnet' ? 'DECENTRAL' : p.kind === 'open' ? 'OPEN' : 'FRONTIER'}</span>
            </span>
            <span class="cmp-calc__bar"><i style="width:${w}%"></i></span>
            <span class="cmp-calc__cost"><b>$${r.monthly.toLocaleString('en-US', { maximumFractionDigits: 0 })}</b>/mo</span>
          </li>
        `;
      }).join('');
    }
  }
  [calcIn, calcOut, calcRps].forEach(el => el?.addEventListener('input', renderCalc));
  renderCalc();

  /* run the first sample on load so the page isn't empty */
  setTimeout(run, 100);

  return {
    destroy(){
      runToken += 1;        // cancel any in-flight loop
    },
  };
}

void raw; void cheapestBlended; void catColor; void REGION_LABEL;
