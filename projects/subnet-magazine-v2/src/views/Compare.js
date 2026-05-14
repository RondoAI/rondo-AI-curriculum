/* =================================================================
   SUBNET MAGAZINE — COMPARE PAGE
   -----------------------------------------------------------------
   Rebuilt to mirror SemiAnalysis InferenceX. Five tabs share one
   header + filter bar:

     PERFORMANCE  · main chart + sortable table, metric switcher
     PROMPT TEST  · prompt input → side-by-side responses
     ACCURACY     · benchmark leaderboards
     TCO          · monthly inference cost calculator
     GPU SPECS    · hardware reference table

   Filter bar (top of every tab):
     - Preset chip strip (Cheapest open-weights · Fastest decentral
       · Frontier only · Asia only · Open-vs-closed · Bittensor
       spotlight · Everything)
     - Y-axis metric:  Blended $/1M · $/1M Output · TTFT · ITL ·
                       Tokens/sec · Tokens/sec/GPU · Context
     - Precision filter:  Any · FP4 · FP8 · FP16
     - Kind filter:       Any · Decentralized · Frontier · Open
   ================================================================= */

import { html, mount, qs, raw } from '../lib/dom.js';
import { PROVIDERS, providerById, METRICS, GPUS, PRESETS } from '../data/inference-providers.js';
import { SAMPLE_PROMPTS, QUALITY_BASELINE, placeholderFor } from '../data/inference-prompts.js';
import { BENCHMARKS } from '../data/benchmarks.js';

/* ----------------- helpers ----------------- */

function kindLabel(k){ return k === 'subnet' ? 'DECENTRAL' : k === 'open' ? 'OPEN' : 'FRONTIER'; }
function regionLabel(r){ return r === 'DECENTRAL' ? 'τ' : r; }

/* color a provider's kind chip + bar */
const KIND_COLOR = {
  subnet:   '#FF1E3C',
  frontier: '#FFB0BA',
  open:     '#00E5A8',
};

/* =================================================================
   Mount
   ================================================================= */

export function mountCompare(root){
  /* ---------- view state ---------- */
  const state = {
    tab:        'performance',   // performance | prompt | accuracy | tco | gpu
    preset:     'open-vs-closed',
    metric:     'blended',
    precision:  'any',
    kind:       'any',
    selected:   new Set(PRESETS.find(p => p.id === 'open-vs-closed').ids),
    promptIdx:  0,
  };

  /* ---------- skeleton ---------- */
  mount(root, html`
    <section class="cmp">
      <header class="cmp__head">
        <a class="sd-back" href="terminal.html">‹ TERMINAL</a>
        <div class="cmp__head-main">
          <span class="cmp__kicker">&lt;700&gt;  COMPARE · INFERENCEX-STYLE</span>
          <h1 class="cmp__title">Bittensor <em>versus</em> the centralized world.</h1>
          <p class="cmp__sub">
            Same metric set as SemiAnalysis InferenceX — TTFT, ITL, tokens/sec, tokens/sec/GPU,
            $/1M, precision, GPU class. Bittensor subnets sit next to Claude, GPT, Gemini,
            DeepSeek, Qwen, Llama, Mistral, Yi, Kimi, and Zhipu. Pick a preset, pick a metric,
            see the ranking.
          </p>
        </div>
        <div class="cmp__head-meta">
          <span class="sd-pill"><span class="live-dot"></span>SIMULATED</span>
          <span class="sd-pill">v0.25</span>
        </div>
      </header>

      <!-- Tabs -->
      <nav class="cmp-tabs" role="tablist">
        <button class="cmp-tab is-active" data-tab="performance">PERFORMANCE</button>
        <button class="cmp-tab"           data-tab="prompt">PROMPT TEST</button>
        <button class="cmp-tab"           data-tab="accuracy">ACCURACY</button>
        <button class="cmp-tab"           data-tab="tco">TCO</button>
        <button class="cmp-tab"           data-tab="gpu">GPU SPECS</button>
      </nav>

      <!-- Filter bar (visible on Performance, Accuracy, TCO) -->
      <div class="cmp-filterbar" data-bind="filterbar">
        <div class="cmp-presets">
          <span class="cmp-fb__lbl">Preset</span>
          ${PRESETS.map(p => `<button class="cmp-preset ${p.id === state.preset ? 'is-active' : ''}" data-preset="${p.id}">${p.label}</button>`).join('')}
        </div>
        <div class="cmp-fb">
          <label class="cmp-fb__field">
            <span class="cmp-fb__lbl">Y-axis</span>
            <select data-bind="metric">
              ${METRICS.map(m => `<option value="${m.id}" ${m.id === state.metric ? 'selected' : ''}>${m.label}</option>`).join('')}
            </select>
          </label>
          <label class="cmp-fb__field">
            <span class="cmp-fb__lbl">Precision</span>
            <select data-bind="precision">
              <option value="any">Any</option>
              <option value="FP4">FP4</option>
              <option value="FP8">FP8</option>
              <option value="FP16">FP16</option>
              <option value="mixed">Mixed</option>
            </select>
          </label>
          <label class="cmp-fb__field">
            <span class="cmp-fb__lbl">Kind</span>
            <select data-bind="kind">
              <option value="any">Any</option>
              <option value="subnet">Decentralized</option>
              <option value="frontier">Frontier (closed)</option>
              <option value="open">Open-weights</option>
            </select>
          </label>
        </div>
      </div>

      <!-- Tab content slots -->
      <div data-bind="tab-perf"     class="cmp-pane is-active"></div>
      <div data-bind="tab-prompt"   class="cmp-pane"></div>
      <div data-bind="tab-accuracy" class="cmp-pane"></div>
      <div data-bind="tab-tco"      class="cmp-pane"></div>
      <div data-bind="tab-gpu"      class="cmp-pane"></div>
    </section>
  `);

  /* ---------- Element refs ---------- */
  const filterbar    = qs('[data-bind="filterbar"]', root);
  const metricSel    = qs('[data-bind="metric"]', root);
  const precisionSel = qs('[data-bind="precision"]', root);
  const kindSel      = qs('[data-bind="kind"]', root);
  const paneRefs = {
    performance: qs('[data-bind="tab-perf"]',     root),
    prompt:      qs('[data-bind="tab-prompt"]',   root),
    accuracy:    qs('[data-bind="tab-accuracy"]', root),
    tco:         qs('[data-bind="tab-tco"]',      root),
    gpu:         qs('[data-bind="tab-gpu"]',      root),
  };

  /* =================== filtering =================== */
  function filteredProviders(){
    let arr = PROVIDERS.slice();
    /* preset filter (if not "Everything") */
    const preset = PRESETS.find(p => p.id === state.preset);
    if (preset && preset.ids) arr = arr.filter(p => preset.ids.includes(p.id));
    /* precision */
    if (state.precision !== 'any') arr = arr.filter(p => p.precision === state.precision);
    /* kind */
    if (state.kind !== 'any') arr = arr.filter(p => p.kind === state.kind);
    return arr;
  }

  /* =================== TAB: Performance =================== */
  function renderPerformance(){
    const arr = filteredProviders();
    const metric = METRICS.find(m => m.id === state.metric) || METRICS[0];
    const values = arr.map(p => ({ p, v: metric.pick(p) || 0 }));
    const maxV = Math.max(0.001, ...values.map(r => r.v));
    /* sort: lower-is-better metrics ascending, else descending */
    values.sort((a, b) => metric.lower ? a.v - b.v : b.v - a.v);

    paneRefs.performance.innerHTML = `
      <article class="cmp-perf panel is-bracketed">
        <div class="panel__head">
          <span class="panel__title">
            <span class="panel__fcode">&lt;702&gt;</span>
            PROVIDERS · ${metric.label.toUpperCase()}
            <span class="panel__go">&lt;GO&gt;</span>
          </span>
          <span class="panel__meta">
            <span class="panel__pill">${arr.length} PROVIDERS</span>
            <span class="panel__pill">${metric.lower ? 'LOWER = BETTER' : 'HIGHER = BETTER'}</span>
          </span>
        </div>
        <div class="panel__body cmp-perf__body">
          <ol class="cmp-perf__list">
            ${values.map((r, i) => {
              const p = r.p;
              const w = Math.max(1, (r.v / maxV) * 100);
              const color = KIND_COLOR[p.kind];
              return `
                <li class="cmp-bar">
                  <span class="cmp-bar__rank">${String(i + 1).padStart(2, '0')}</span>
                  <span class="cmp-bar__name">
                    <span class="cmp-bar__pname">${p.name}</span>
                    <span class="cmp-bar__porg">${p.org}</span>
                  </span>
                  <span class="cmp-bar__flags">
                    <span class="cmp-bar__kind" style="background:${color}22; color:${color}">${kindLabel(p.kind)}</span>
                    ${p.open ? '<span class="flag flag--open">OPEN</span>' : ''}
                    <span class="flag flag--region flag--${p.region.toLowerCase().replace('decentral','red')}">${regionLabel(p.region)}</span>
                  </span>
                  <span class="cmp-bar__track">
                    <i style="width:${w}%; background:linear-gradient(90deg, ${color}, ${color}99)"></i>
                  </span>
                  <span class="cmp-bar__val">${metric.fmt(r.v)}</span>
                </li>
              `;
            }).join('')}
          </ol>
        </div>
        <div class="panel__foot">
          <span>SORTED ${metric.lower ? 'ASCENDING' : 'DESCENDING'} · ${metric.lower ? 'LOWER' : 'HIGHER'} = BETTER</span>
          <span>SOURCES · operator rate cards + SemiAnalysis InferenceX (May 2026)</span>
        </div>
      </article>

      <article class="cmp-table panel is-bracketed">
        <div class="panel__head">
          <span class="panel__title">
            <span class="panel__fcode">&lt;703&gt;</span>
            FULL METRICS TABLE
            <span class="panel__go">&lt;GO&gt;</span>
          </span>
        </div>
        <div class="panel__body cmp-table__body">
          <div class="cmp-table__scroll">
            <table class="cmp-data">
              <thead>
                <tr>
                  <th class="left">Provider</th>
                  <th class="left">Kind</th>
                  <th class="left">Region</th>
                  <th class="num">$/1M in</th>
                  <th class="num">$/1M out</th>
                  <th class="num">TTFT</th>
                  <th class="num">ITL</th>
                  <th class="num">t/s</th>
                  <th class="num">t/s/GPU</th>
                  <th class="left">Precision</th>
                  <th class="left">GPU</th>
                  <th class="num">Context</th>
                </tr>
              </thead>
              <tbody>
                ${arr.map(p => `
                  <tr>
                    <td class="left">
                      <strong>${p.name}</strong>
                      <span class="cmp-data__org">${p.org}</span>
                    </td>
                    <td class="left"><span class="cmp-bar__kind" style="background:${KIND_COLOR[p.kind]}22; color:${KIND_COLOR[p.kind]}">${kindLabel(p.kind)}</span></td>
                    <td class="left">${regionLabel(p.region)}</td>
                    <td class="num">$${p.priceIn.toFixed(2)}</td>
                    <td class="num">$${p.priceOut.toFixed(2)}</td>
                    <td class="num">${p.ttft} ms</td>
                    <td class="num">${p.itl} ms</td>
                    <td class="num">${p.tps}</td>
                    <td class="num">${p.tpsGpu || '—'}</td>
                    <td class="left">${p.precision}</td>
                    <td class="left cmp-data__gpu">${p.gpu}</td>
                    <td class="num">${p.contextK}K</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
        <div class="panel__foot">
          <span>${arr.length} ROWS</span>
          <span>HORIZONTAL SCROLL ON NARROW SCREENS</span>
        </div>
      </article>
    `;
  }

  /* =================== TAB: Prompt Test =================== */
  function renderPrompt(){
    const sel = new Set(filteredProviders().slice(0, 8).map(p => p.id));
    paneRefs.prompt.innerHTML = `
      <article class="cmp-input panel is-bracketed">
        <div class="panel__head">
          <span class="panel__title">
            <span class="panel__fcode">&lt;711&gt;</span>
            PROMPT
            <span class="panel__go">&lt;GO&gt;</span>
          </span>
          <span class="panel__meta">
            <span class="panel__pill">CTRL + ENTER · RUN</span>
          </span>
        </div>
        <div class="panel__body">
          <textarea id="cmp-prompt" class="cmp-prompt" rows="3">${SAMPLE_PROMPTS[0].prompt}</textarea>
          <div class="cmp-samples">
            <span class="cmp-samples__lbl">Try</span>
            ${SAMPLE_PROMPTS.map((s, i) => `<button class="cmp-chip" data-sample="${i}">${s.prompt.slice(0, 48)}${s.prompt.length > 48 ? '…' : ''}</button>`).join('')}
          </div>
          <div class="cmp-actions">
            <button class="cmp-run" id="cmp-run">▶ RUN  &lt;GO&gt;</button>
            <button class="cmp-clear" id="cmp-clear">Clear</button>
            <span class="cmp-actions__hint">running against current preset · ${sel.size} providers</span>
          </div>
        </div>
      </article>
      <article class="cmp-results panel is-bracketed">
        <div class="panel__head">
          <span class="panel__title">
            <span class="panel__fcode">&lt;712&gt;</span>
            RESULTS · SIDE-BY-SIDE
            <span class="panel__go">&lt;GO&gt;</span>
          </span>
          <span class="panel__meta">
            <span class="panel__pill panel__pill--live"><span class="live-dot"></span>SIM</span>
          </span>
        </div>
        <div class="panel__body cmp-results__body" id="cmp-results">
          <div class="cmp-empty">Hit ▶ RUN to compare responses across the current preset.</div>
        </div>
        <div class="panel__foot">
          <span>METRICS · TTFT · TOKENS/SEC · COST/RUN · QUALITY</span>
          <span id="cmp-results-count">— PROVIDERS</span>
        </div>
      </article>
    `;
    wirePromptTab(sel);
  }

  /* =================== TAB: Accuracy =================== */
  function renderAccuracy(){
    paneRefs.accuracy.innerHTML = `
      <article class="cmp-accuracy panel is-bracketed">
        <div class="panel__head">
          <span class="panel__title">
            <span class="panel__fcode">&lt;720&gt;</span>
            ACCURACY · FRONTIER BENCHMARKS
            <span class="panel__go">&lt;GO&gt;</span>
          </span>
          <span class="panel__meta">
            <span class="panel__pill">${BENCHMARKS.length} BENCHMARKS</span>
          </span>
        </div>
        <div class="panel__caption">
          Where the leading models actually score on the standard benchmarks. Open-weight models
          are flagged so you can see how close the open frontier (DeepSeek, Qwen, Llama) is to
          the closed labs (Anthropic, OpenAI, Google).
        </div>
        <div class="panel__body cmp-acc__body">
          <div class="cmp-acc__tabs" id="cmp-acc-tabs"></div>
          <div class="cmp-acc__desc" id="cmp-acc-desc"></div>
          <ol class="cmp-acc__list" id="cmp-acc-list"></ol>
        </div>
        <div class="panel__foot">
          <span>SOURCES · LMSYS / OpenLLM-Leaderboard / HELM / paper releases</span>
          <span>UPDATED MAY 2026</span>
        </div>
      </article>
    `;
    let active = BENCHMARKS[0];
    const tabs = qs('#cmp-acc-tabs', paneRefs.accuracy);
    const desc = qs('#cmp-acc-desc', paneRefs.accuracy);
    const list = qs('#cmp-acc-list', paneRefs.accuracy);
    function paint(){
      tabs.innerHTML = BENCHMARKS.map(b => `<button class="bench-tab ${b.id === active.id ? 'active' : ''}" data-bench="${b.id}">${b.name}</button>`).join('');
      desc.innerHTML = `<strong>${active.full}</strong> · <span>${active.description}</span>`;
      const top = active.leaders.slice(0, 10);
      const maxScore = Math.max(...top.map(l => l.score));
      list.innerHTML = top.map((l, i) => `
        <li class="bench-row">
          <span class="bench-row__rank">${String(i + 1).padStart(2, '0')}</span>
          <span class="bench-row__model">
            <span class="bench-row__name">${l.model}</span>
            <span class="bench-row__org">${l.org}</span>
          </span>
          <span class="bench-row__flags">
            ${l.open ? '<span class="flag flag--open">OPEN</span>' : ''}
            <span class="flag flag--region flag--${l.region.toLowerCase()}">${l.region}</span>
          </span>
          <span class="bench-row__bar"><i style="width:${(l.score / maxScore) * 100}%"></i></span>
          <span class="bench-row__score">${l.score.toLocaleString('en-US')}${active.unit === '%' ? '%' : ''}</span>
        </li>
      `).join('');
      tabs.querySelectorAll('.bench-tab').forEach(t => t.addEventListener('click', () => {
        active = BENCHMARKS.find(b => b.id === t.dataset.bench) || BENCHMARKS[0]; paint();
      }));
    }
    paint();
  }

  /* =================== TAB: TCO =================== */
  function renderTco(){
    paneRefs.tco.innerHTML = `
      <article class="cmp-calc panel is-bracketed">
        <div class="panel__head">
          <span class="panel__title">
            <span class="panel__fcode">&lt;730&gt;</span>
            INFERENCE COST CALCULATOR · MONTHLY
            <span class="panel__go">&lt;GO&gt;</span>
          </span>
          <span class="panel__meta"><span class="panel__pill">PER MONTH</span></span>
        </div>
        <div class="panel__caption">
          Three sliders set your workload. The page ranks all selected providers by projected
          monthly inference bill. Bittensor subnets land near the cheapest end at almost any
          workload — exactly the value proposition decentralized AI has against the centralized
          alternative.
        </div>
        <div class="panel__body cmp-calc__body">
          <div class="cmp-calc__inputs">
            <label class="cmp-slider"><span class="cmp-slider__lbl">Input tokens / request</span>
              <input type="range" id="calc-in"  min="200" max="32000" step="100" value="2000">
              <span class="cmp-slider__val" id="calc-in-val">2,000</span></label>
            <label class="cmp-slider"><span class="cmp-slider__lbl">Output tokens / request</span>
              <input type="range" id="calc-out" min="100" max="8000"  step="50"  value="800">
              <span class="cmp-slider__val" id="calc-out-val">800</span></label>
            <label class="cmp-slider"><span class="cmp-slider__lbl">Requests / day</span>
              <input type="range" id="calc-rps" min="100" max="1000000" step="100" value="10000">
              <span class="cmp-slider__val" id="calc-rps-val">10,000</span></label>
          </div>
          <ol class="cmp-calc__list" id="cmp-calc-list"></ol>
        </div>
        <div class="panel__foot">
          <span>BLENDED = (in × priceIn + out × priceOut) × requests × 30 / 1M</span>
          <span>SIMULATED · NO LIVE BILLING</span>
        </div>
      </article>
    `;
    wireTcoTab();
  }

  /* =================== TAB: GPU Specs =================== */
  function renderGpu(){
    paneRefs.gpu.innerHTML = `
      <article class="cmp-gpu panel is-bracketed">
        <div class="panel__head">
          <span class="panel__title">
            <span class="panel__fcode">&lt;740&gt;</span>
            GPU SPECS · TFLOPS PER PRECISION
            <span class="panel__go">&lt;GO&gt;</span>
          </span>
          <span class="panel__meta">
            <span class="panel__pill">${GPUS.length} CHIPS</span>
          </span>
        </div>
        <div class="panel__caption">
          The silicon every inference provider on this page actually runs on. Throughput is
          listed by precision so you can directly compare FP4 vs FP8 vs FP16 numbers.
        </div>
        <div class="panel__body cmp-table__body">
          <div class="cmp-table__scroll">
            <table class="cmp-data">
              <thead>
                <tr>
                  <th class="left">Chip</th>
                  <th class="left">Vendor</th>
                  <th class="left">Tier</th>
                  <th class="num">FP4 TFLOPS</th>
                  <th class="num">FP8 TFLOPS</th>
                  <th class="num">FP16 TFLOPS</th>
                  <th class="left">HBM</th>
                  <th class="left">Power</th>
                  <th class="num">Year</th>
                </tr>
              </thead>
              <tbody>
                ${GPUS.map(g => `
                  <tr>
                    <td class="left"><strong>${g.name}</strong></td>
                    <td class="left">${g.vendor}</td>
                    <td class="left">${g.tier}</td>
                    <td class="num">${g.fp4 ? g.fp4.toLocaleString('en-US') : '—'}</td>
                    <td class="num">${g.fp8 ? g.fp8.toLocaleString('en-US') : '—'}</td>
                    <td class="num">${g.fp16 ? g.fp16.toLocaleString('en-US') : '—'}</td>
                    <td class="left">${g.hbm}</td>
                    <td class="left">${g.power}</td>
                    <td class="num">${g.year}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
        <div class="panel__foot">
          <span>SOURCES · vendor datasheets, SemiAnalysis aggregate</span>
          <span>TFLOPS PER CHIP · TENSOR / MATRIX CORE</span>
        </div>
      </article>
    `;
  }

  /* ====== prompt tab handlers ====== */
  function wirePromptTab(currentSelected){
    const promptEl     = qs('#cmp-prompt', paneRefs.prompt);
    const resultsRoot  = qs('#cmp-results', paneRefs.prompt);
    const resultsCount = qs('#cmp-results-count', paneRefs.prompt);
    paneRefs.prompt.querySelectorAll('.cmp-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        state.promptIdx = Number(chip.dataset.sample);
        promptEl.value = SAMPLE_PROMPTS[state.promptIdx].prompt;
      });
    });

    function escapeHtml(s){
      return s.replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
    }
    function formatResponse(rawText){
      let out = ''; let inCode = false;
      for (const ln of rawText.split('\n')){
        if (ln.startsWith('```')){ out += inCode ? '</code></pre>' : '<pre><code>'; inCode = !inCode; continue; }
        out += inCode ? escapeHtml(ln) + '\n' : escapeHtml(ln) + '<br>';
      }
      if (inCode) out += '</code></pre>';
      return out;
    }

    let runToken = 0;
    async function run(){
      const prompt = promptEl.value.trim();
      if (!prompt){ promptEl.focus(); return; }
      const ids = Array.from(currentSelected).slice(0, 8);
      if (!ids.length){ resultsRoot.innerHTML = '<div class="cmp-empty">No providers in the current preset.</div>'; return; }
      runToken += 1;
      const myRun = runToken;
      resultsRoot.innerHTML = ids.map(id => {
        const p = providerById(id);
        const color = KIND_COLOR[p.kind];
        return `
          <article class="cmp-out is-loading" data-prov="${id}">
            <header class="cmp-out__head">
              <span class="cmp-out__name">${p.name}</span>
              <span class="cmp-out__org">${p.org}</span>
              <span class="cmp-out__kind" style="background:${color}22; color:${color}">${kindLabel(p.kind)}</span>
            </header>
            <div class="cmp-out__metrics">
              <span class="cmp-out__metric"><b>—</b><i>TTFT</i></span>
              <span class="cmp-out__metric"><b>—</b><i>tokens/sec</i></span>
              <span class="cmp-out__metric"><b>—</b><i>cost / run</i></span>
              <span class="cmp-out__metric"><b>—</b><i>quality</i></span>
            </div>
            <div class="cmp-out__body">
              <div class="cmp-out__spinner"><span></span><span></span><span></span><em>${p.name} is thinking…</em></div>
            </div>
          </article>`;
      }).join('');
      if (resultsCount) resultsCount.textContent = `${ids.length} PROVIDERS · RUNNING`;

      for (const id of ids){
        const p = providerById(id);
        const delay = Math.max(180, p.ttft * 0.5 + Math.random() * 200);
        // eslint-disable-next-line no-await-in-loop
        await new Promise(r => setTimeout(r, delay));
        if (myRun !== runToken) return;
        const card = SAMPLE_PROMPTS[state.promptIdx];
        const txt = (card && prompt.trim() === card.prompt.trim() && card.responses[p.id])
          ? card.responses[p.id]
          : placeholderFor(p, prompt);
        const qual = QUALITY_BASELINE[p.id] ?? 70;
        const inTok = Math.round(prompt.split(/\s+/).length * 1.3);
        const outTok = Math.round(txt.length / 4);
        const cost = (inTok * p.priceIn + outTok * p.priceOut) / 1_000_000;
        const el = resultsRoot.querySelector(`.cmp-out[data-prov="${id}"]`);
        if (!el) continue;
        const color = KIND_COLOR[p.kind];
        el.classList.remove('is-loading');
        el.innerHTML = `
          <header class="cmp-out__head">
            <span class="cmp-out__name">${p.name}</span>
            <span class="cmp-out__org">${p.org}</span>
            <span class="cmp-out__kind" style="background:${color}22; color:${color}">${kindLabel(p.kind)}</span>
            <span class="cmp-out__flags">
              ${p.open ? '<span class="flag flag--open">OPEN</span>' : ''}
              <span class="flag flag--region flag--${p.region.toLowerCase().replace('decentral','red')}">${regionLabel(p.region)}</span>
            </span>
          </header>
          <div class="cmp-out__metrics">
            <span class="cmp-out__metric"><b>${p.ttft}<i>ms</i></b><i>TTFT</i></span>
            <span class="cmp-out__metric"><b>${p.tps}<i>t/s</i></b><i>tokens/sec</i></span>
            <span class="cmp-out__metric"><b>$${cost.toFixed(5)}</b><i>cost / run</i></span>
            <span class="cmp-out__metric">
              <b>${qual}/100</b>
              <i>quality</i>
              <span class="cmp-out__qbar"><i style="width:${qual}%"></i></span>
            </span>
          </div>
          <div class="cmp-out__body">${formatResponse(txt)}</div>
          <footer class="cmp-out__foot">
            <span>in ${inTok} · out ${outTok} tokens</span>
            <span>$${(p.priceIn + p.priceOut).toFixed(2)} / 1M blended · ${p.precision} · ${p.gpu}</span>
          </footer>
        `;
      }
      if (resultsCount) resultsCount.textContent = `${ids.length} PROVIDERS · DONE`;
    }
    qs('#cmp-run', paneRefs.prompt)?.addEventListener('click', run);
    qs('#cmp-clear', paneRefs.prompt)?.addEventListener('click', () => {
      resultsRoot.innerHTML = '<div class="cmp-empty">Hit ▶ RUN to compare responses across the current preset.</div>';
      if (resultsCount) resultsCount.textContent = '— PROVIDERS';
    });
    promptEl?.addEventListener('keydown', e => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)){ e.preventDefault(); run(); }
    });
    /* auto-run once on first paint */
    setTimeout(run, 120);
  }

  /* ====== TCO tab handlers ====== */
  function wireTcoTab(){
    const calcIn   = qs('#calc-in',  paneRefs.tco);
    const calcOut  = qs('#calc-out', paneRefs.tco);
    const calcRps  = qs('#calc-rps', paneRefs.tco);
    const calcInV  = qs('#calc-in-val',  paneRefs.tco);
    const calcOutV = qs('#calc-out-val', paneRefs.tco);
    const calcRpsV = qs('#calc-rps-val', paneRefs.tco);
    const calcList = qs('#cmp-calc-list', paneRefs.tco);
    function paint(){
      const inTok  = Number(calcIn.value);
      const outTok = Number(calcOut.value);
      const rps    = Number(calcRps.value);
      if (calcInV)  calcInV.textContent  = inTok.toLocaleString('en-US');
      if (calcOutV) calcOutV.textContent = outTok.toLocaleString('en-US');
      if (calcRpsV) calcRpsV.textContent = rps.toLocaleString('en-US');
      const arr = filteredProviders();
      const rows = arr.map(p => {
        const perReq = (inTok * p.priceIn + outTok * p.priceOut) / 1_000_000;
        const monthly = perReq * rps * 30;
        return { p, monthly };
      }).sort((a, b) => a.monthly - b.monthly);
      const max = rows.length ? rows[rows.length - 1].monthly : 1;
      if (calcList){
        calcList.innerHTML = rows.map((r, i) => {
          const p = r.p;
          const w = Math.max(2, (r.monthly / max) * 100);
          const color = KIND_COLOR[p.kind];
          return `
            <li class="cmp-calc__row">
              <span class="cmp-calc__rank">${String(i + 1).padStart(2, '0')}</span>
              <span class="cmp-calc__name">
                <span class="cmp-calc__pname">${p.name}</span>
                <span class="cmp-calc__pkind" style="background:${color}22; color:${color}">${kindLabel(p.kind)}</span>
              </span>
              <span class="cmp-calc__bar"><i style="width:${w}%; background:linear-gradient(90deg, ${color}, ${color}99)"></i></span>
              <span class="cmp-calc__cost"><b>$${r.monthly.toLocaleString('en-US', { maximumFractionDigits: 0 })}</b>/mo</span>
            </li>
          `;
        }).join('');
      }
    }
    [calcIn, calcOut, calcRps].forEach(el => el?.addEventListener('input', paint));
    paint();
  }

  /* ====== tab switching + filter wiring ====== */
  function showTab(tab){
    state.tab = tab;
    root.querySelectorAll('.cmp-tab').forEach(t => t.classList.toggle('is-active', t.dataset.tab === tab));
    Object.entries(paneRefs).forEach(([k, el]) => el.classList.toggle('is-active', k === tab));
    /* filter bar visible only on tabs that use it */
    filterbar.style.display = (tab === 'gpu' || tab === 'prompt') ? 'none' : '';
    /* render the active tab fresh */
    if (tab === 'performance') renderPerformance();
    else if (tab === 'prompt') renderPrompt();
    else if (tab === 'accuracy') renderAccuracy();
    else if (tab === 'tco')      renderTco();
    else                          renderGpu();
  }
  root.querySelectorAll('.cmp-tab').forEach(t => t.addEventListener('click', () => showTab(t.dataset.tab)));

  /* presets */
  root.addEventListener('click', e => {
    const btn = e.target.closest('.cmp-preset');
    if (!btn) return;
    state.preset = btn.dataset.preset;
    root.querySelectorAll('.cmp-preset').forEach(b => b.classList.toggle('is-active', b.dataset.preset === state.preset));
    const preset = PRESETS.find(p => p.id === state.preset);
    state.selected = new Set(preset.ids || PROVIDERS.map(p => p.id));
    if (state.tab === 'performance') renderPerformance();
    else if (state.tab === 'tco')    renderTco();
    else if (state.tab === 'prompt') renderPrompt();
  });

  /* filter selects */
  metricSel?.addEventListener('change', () => { state.metric = metricSel.value; renderPerformance(); });
  precisionSel?.addEventListener('change', () => {
    state.precision = precisionSel.value;
    if (state.tab === 'performance') renderPerformance();
    else if (state.tab === 'tco')    renderTco();
    else if (state.tab === 'prompt') renderPrompt();
  });
  kindSel?.addEventListener('change', () => {
    state.kind = kindSel.value;
    if (state.tab === 'performance') renderPerformance();
    else if (state.tab === 'tco')    renderTco();
    else if (state.tab === 'prompt') renderPrompt();
  });

  /* first paint */
  showTab('performance');

  return { destroy(){ /* no long-running resources */ } };
}

void raw;
