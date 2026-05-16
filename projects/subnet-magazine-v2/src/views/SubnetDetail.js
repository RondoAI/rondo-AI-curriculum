/* =================================================================
   SUBNET MAGAZINE, SUBNET DETAIL VIEW
   -----------------------------------------------------------------
   The per-subnet research page. Mounted by subnet.html which reads
   the netuid from `?id=N`. Renders:

     · Hero card  : category swatch, name, owner, links (website,
                    GitHub, Twitter), research note
     · Key metrics: α-price, 24h emission, miners, validators,
                    stake, 30-day change
     · Performance: 90-day α-price line chart (Timeline reused)
     · Emission share donut (this subnet's % of total daily emit)
     · Miner/validator composition
     · Live activity feed (subnet-scoped)
     · Competitive landscape, side-by-side cards comparing this
                    subnet to its centralized competitors
     · Latest AI benchmarks relevant to this subnet's category
     · Asian competitors spotlight (CN / KR / JP / TW / IN)

   Goal: every section is a visual, not a paragraph. The reader
   should leave the page understanding what this subnet does,
   where it stands in the network, and how it stacks up against
   the centralized world it's competing with.
   ================================================================= */

import { html, mount, qs, raw } from '../lib/dom.js';
import { Timeline } from '../charts/Timeline.js';
import { DonutChart } from '../charts/DonutChart.js';
import { BarChart } from '../charts/BarChart.js';
import { SUBNETS, subnetById } from '../data/subnets.js';
import { CATEGORIES, catColor, catLabel } from '../data/categories.js';
import { BENCHMARKS, benchmarksFor } from '../data/benchmarks.js';
import {
  CENTRALIZED_PLAYERS, REGIONS, ASIAN_REGIONS,
  competitorsForCategory, asianCompetitorsForCategory,
} from '../data/centralized.js';
import {
  SUBNET_META, subnetWebsite, subnetTwitter, subnetLongDesc,
  subnetSpecs, subnetUpdates,
} from '../data/subnet-meta.js';
import { WorkflowDiagram } from '../charts/WorkflowDiagram.js';
import { workflowFor } from '../data/workflows.js';
import { openChartModal } from '../lib/chart-modal.js';

/* ---------- Synthesize a 90-day α-price walk for the subnet ---------- */
function rng(seed){ let s = seed >>> 0; return () => (s = (s * 9301 + 49297) >>> 0, (s % 233280) / 233280); }
function buildSubnetHistory(subnet, days = 90){
  const r = rng((subnet.netuid + 13) * 1009);
  const today = Date.now();
  const dayMs = 86_400_000;
  /* Reverse-engineer a start price from current price and 30d change. */
  const target = subnet.price ?? 1;
  const startMonth = target / (1 + (subnet.chg30 ?? 0) / 100);
  const startThree = startMonth * (1 - 0.4 * (r() - 0.5));   // 90d slightly different from 30d
  const out = [];
  let p = startThree;
  for (let i = days - 1; i >= 0; i--){
    const u = (days - 1 - i) / (days - 1);
    const eased = u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
    const base  = startThree + (target - startThree) * eased;
    const noise = (r() - 0.5) * Math.max(0.05, base * 0.08);
    p = Math.max(0.01, base + noise);
    out.push({ t: today - i * dayMs, p });
  }
  return out;
}

/* ---------- Live activity action types (subnet-scoped) ---------- */
const ACTIONS = [
  { code: 'STAKE',    weight: 18 },
  { code: 'UNSTAKE',  weight:  8 },
  { code: 'EMIT',     weight: 14 },
  { code: 'REGISTER', weight:  6 },
  { code: 'WEIGHT',   weight: 10 },
  { code: 'BURN',     weight:  4 },
  { code: 'INFER',    weight: 12 },
];
const ACTION_TOTAL = ACTIONS.reduce((a, x) => a + x.weight, 0);
function pickAction(){
  let r = Math.random() * ACTION_TOTAL;
  for (const a of ACTIONS){ r -= a.weight; if (r <= 0) return a; }
  return ACTIONS[0];
}
function nowStamp(){
  const d = new Date();
  const z = n => String(n).padStart(2, '0');
  return `${z(d.getUTCHours())}:${z(d.getUTCMinutes())}:${z(d.getUTCSeconds())}`;
}

/* ---------- Headline keywords per category (drives news filtering) ---------- */
const NEWS_KEYWORDS = {
  text:       ['LLM','GPT','Claude','Gemini','Llama','DeepSeek','Qwen','open-source','reasoning'],
  vision:     ['image generation','FLUX','Midjourney','DALL-E','SD','Stable Diffusion','Hunyuan'],
  audio:      ['TTS','ElevenLabs','Whisper','voice','speech'],
  video:      ['Sora','Veo','Runway','Kling','Hailuo','Pika','video generation'],
  multimodal: ['multimodal','VLM','any-to-any','MMMU'],
  training:   ['pretraining','finetune','RLHF','DPO','training run'],
  data:       ['Scale AI','RLHF','labeling','dataset','data quality'],
  search:     ['Perplexity','Baidu','answer engine','search'],
  finance:    ['Numerai','quant','trading','DeFi','yield'],
  agents:     ['SWE-bench','GAIA','tool use','agent','Computer Use','Operator'],
  robotics:   ['Figure','1X','Unitree','humanoid','robotics','Optimus'],
  science:    ['AlphaFold','Isomorphic','protein','materials','drug discovery'],
  infra:      ['NVIDIA','Blackwell','Rubin','GPU','TSMC','HBM','datacenter','Ascend','Biren'],
  prediction: ['prediction market','forecast'],
};

/* =================================================================
   Mount
   ================================================================= */

export function mountSubnetDetail(root, dataLayer = null){
  /* parse ?id from URL */
  const params  = new URLSearchParams(window.location.search);
  const wanted  = Number(params.get('id')) || (SUBNETS[0]?.netuid ?? 1);
  const subnet  = subnetById(wanted) ?? SUBNETS[0];
  if (!subnet){ mount(root, '<p class="sd-error">Subnet not found.</p>'); return { destroy(){} }; }

  const cat       = CATEGORIES[subnet.cat] ?? { label: subnet.cat, color: '#FF1E3C', desc: '' };
  const website   = subnetWebsite(subnet);
  const twitter   = subnetTwitter(subnet);
  const longDesc  = subnetLongDesc(subnet);
  const totalEmit = SUBNETS.reduce((a, s) => a + s.emission, 0);
  const sharePct  = (subnet.emission / totalEmit) * 100;
  const competitors    = competitorsForCategory(subnet.cat);
  const asian          = asianCompetitorsForCategory(subnet.cat);
  const bench          = benchmarksFor(subnet.cat).length ? benchmarksFor(subnet.cat) : BENCHMARKS.slice(0, 4);

  /* Other subnets in the same category, internal "see also" */
  const peers = SUBNETS.filter(s => s.cat === subnet.cat && s.netuid !== subnet.netuid)
                       .sort((a, b) => b.emission - a.emission).slice(0, 6);

  mount(root, html`
    <article class="subnet-detail">
      <!-- ========== Header ========== -->
      <header class="sd-head">
        <a class="sd-back" href="terminal.html">‹ TERMINAL</a>
        <div class="sd-head__main">
          <span class="sd-cat" style="--cat:${cat.color}">${cat.label}</span>
          <h1 class="sd-title">
            <span class="sd-id">SN${subnet.netuid}</span>
            <span class="sd-name" data-sd="name">${subnet.name}</span>
          </h1>
          <p class="sd-tagline">${subnet.desc}</p>
          <div class="sd-owner">
            <span class="sd-owner__label">Owner</span>
            <span class="sd-owner__value">${subnet.owner ?? 'Â·'}</span>
          </div>
          <div class="sd-links">
            ${website ? `<a class="sd-link" href="${website}" target="_blank" rel="noopener">Website ↗</a>` : ''}
            ${subnet.gh ? `<a class="sd-link" href="https://github.com/${subnet.gh}" target="_blank" rel="noopener">GitHub ↗</a>` : ''}
            ${twitter ? `<a class="sd-link" href="${twitter}" target="_blank" rel="noopener">Twitter ↗</a>` : ''}
          </div>
        </div>
        <aside class="sd-head__meta">
          <span class="sd-pill"><span class="live-dot"></span>STREAMING</span>
          <span class="sd-pill">v0.22</span>
        </aside>
      </header>

      <!-- ========== Key metrics strip ========== -->
      <section class="sd-metrics">
        <div class="metric">
          <span class="metric__label">α-Price (USD)</span>
          <span class="metric__value" data-sd="price">$${(subnet.price ?? 0).toFixed(2)}</span>
          <span class="metric__sub ${(subnet.chg24 ?? 0) >= 0 ? 'up' : 'down'}" data-sd="chg24">${(subnet.chg24 ?? 0) >= 0 ? '+' : ''}${(subnet.chg24 ?? 0).toFixed(2)}% 24h</span>
        </div>
        <div class="metric">
          <span class="metric__label">Emission · 24h</span>
          <span class="metric__value" data-sd="emission">τ ${(subnet.emission ?? 0).toLocaleString('en-US')}</span>
          <span class="metric__sub">${sharePct.toFixed(2)}% of network</span>
        </div>
        <div class="metric">
          <span class="metric__label">Miners</span>
          <span class="metric__value">${(subnet.miners ?? 0).toLocaleString('en-US')}</span>
          <span class="metric__sub">active hotkeys</span>
        </div>
        <div class="metric">
          <span class="metric__label">Validators</span>
          <span class="metric__value">${(subnet.validators ?? 0).toLocaleString('en-US')}</span>
          <span class="metric__sub">root + subnet</span>
        </div>
        <div class="metric">
          <span class="metric__label">Stake</span>
          <span class="metric__value">τ ${((subnet.stake ?? 0) / 1000).toFixed(1)}K</span>
          <span class="metric__sub">total τ at stake</span>
        </div>
        <div class="metric">
          <span class="metric__label">30d Change</span>
          <span class="metric__value ${(subnet.chg30 ?? 0) >= 0 ? 'up' : 'down'}" data-sd="chg30">${(subnet.chg30 ?? 0) >= 0 ? '+' : ''}${(subnet.chg30 ?? 0).toFixed(2)}%</span>
          <span class="metric__sub">α-price</span>
        </div>
      </section>

      <!-- ========== Research note ========== -->
      <section class="sd-research panel is-bracketed">
        <div class="panel__head">
          <span class="panel__title">
            <span class="panel__fcode">&lt;000&gt;</span>
            RESEARCH NOTE
            <span class="panel__go">&lt;GO&gt;</span>
          </span>
        </div>
        <div class="panel__body sd-research__body">
          <p>${longDesc}</p>
          ${subnet.tags ? `<div class="sd-tags">${subnet.tags.map(t => `<span class="sd-tag">${t}</span>`).join('')}</div>` : ''}
        </div>
      </section>

      <!-- ========== How this subnet works (workflow viz) ========== -->
      <section class="sd-workflow panel is-bracketed">
        <div class="panel__head">
          <span class="panel__title">
            <span class="panel__fcode">&lt;050&gt;</span>
            HOW SN${subnet.netuid} ACTUALLY WORKS
            <span class="panel__go">&lt;GO&gt;</span>
          </span>
          <span class="panel__meta">
            <span class="panel__pill">${cat.label}</span>
          </span>
        </div>
        <div class="panel__caption">
          Each box is a stage in one epoch on this subnet. Particles flow left-to-right between
          stages as work moves through the network. The miner / validator counts are live.
        </div>
        <div class="panel__body panel__body--pad-0 sd-workflow__viz">
          <canvas data-canvas="workflow" aria-label="${subnet.name} workflow diagram"></canvas>
        </div>
        <div class="panel__foot">
          <span>EPOCH · 360 BLOCKS · ~72 MIN</span>
          <span>SCORING · YUMA CONSENSUS</span>
        </div>
      </section>

      <!-- ========== Tech specs + recent updates ========== -->
      <section class="sd-tech">
        <article class="panel is-bracketed sd-cell--specs">
          <div class="panel__head">
            <span class="panel__title">
              <span class="panel__fcode">&lt;060&gt;</span>
              TECH SPECS
              <span class="panel__go">&lt;GO&gt;</span>
            </span>
          </div>
          <div class="panel__caption">Protocol-level fields the operator should know.</div>
          <div class="panel__body">
            <dl class="sd-specs" id="sd-specs"></dl>
          </div>
          <div class="panel__foot">
            <span>SOURCED · operator docs + on-chain</span>
            <span>SN${subnet.netuid}</span>
          </div>
        </article>

        <article class="panel is-bracketed sd-cell--updates">
          <div class="panel__head">
            <span class="panel__title">
              <span class="panel__fcode">&lt;070&gt;</span>
              RECENT UPDATES · SN${subnet.netuid}
              <span class="panel__go">&lt;GO&gt;</span>
            </span>
            <span class="panel__meta">
              <span class="panel__pill panel__pill--live"><span class="live-dot"></span>TRACKED</span>
            </span>
          </div>
          <div class="panel__caption">Releases, eval changes, governance, announcements, curated changelog.</div>
          <div class="panel__body panel__body--pad-0">
            <ul class="sd-updates" id="sd-updates"></ul>
          </div>
          <div class="panel__foot">
            <span>NEWEST FIRST</span>
            <span>SOURCE · subnet-meta.js</span>
          </div>
        </article>
      </section>

      <!-- ========== Performance + share ========== -->
      <section class="sd-charts">
        <article class="panel is-bracketed sd-cell--perf">
          <div class="panel__head">
            <span class="panel__title">
              <span class="panel__fcode">&lt;100&gt;</span>
              α-PRICE · LAST 90 DAYS
              <span class="panel__go">&lt;GO&gt;</span>
            </span>
            <span class="panel__meta">
              <button class="panel__expand" data-expand="perf" aria-label="Expand">⛶ EXPAND</button>
            </span>
          </div>
          <div class="panel__caption">
            How the α-token has traded over the past 90 days. The curve folds in 30-day momentum
            and the broader subnet category's direction. Hover for date + price.
          </div>
          <div class="panel__body panel__body--pad-0 sd-perf">
            <canvas data-canvas="perf" aria-label="Subnet 90-day price"></canvas>
          </div>
          <div class="panel__foot">
            <span>BACK-CAST · SIM</span>
            <span>30d ${(subnet.chg30 ?? 0) >= 0 ? '+' : ''}${(subnet.chg30 ?? 0).toFixed(2)}%</span>
          </div>
        </article>

        <article class="panel is-bracketed sd-cell--share">
          <div class="panel__head">
            <span class="panel__title">
              <span class="panel__fcode">&lt;101&gt;</span>
              SHARE OF NETWORK EMISSION
              <span class="panel__go">&lt;GO&gt;</span>
            </span>
            <span class="panel__meta">
              <span class="panel__pill">${SUBNETS.length} SUBNETS</span>
            </span>
          </div>
          <div class="panel__caption">
            How much of every τ the network mints goes to <strong>SN${subnet.netuid}</strong> in
            the latest 24h. The total emission across the network is <strong>τ ${totalEmit.toLocaleString('en-US')} / 24h</strong>.
          </div>
          <div class="panel__body panel__body--pad-0 sd-share">
            <canvas data-canvas="share" aria-label="Share of network emission"></canvas>
          </div>
          <div class="panel__foot">
            <span>τ ${(subnet.emission ?? 0).toLocaleString('en-US')} / τ ${totalEmit.toLocaleString('en-US')}</span>
            <span>RANK ${[...SUBNETS].sort((a, b) => b.emission - a.emission).findIndex(s => s.netuid === subnet.netuid) + 1} / ${SUBNETS.length}</span>
          </div>
        </article>
      </section>

      <!-- ========== Miner / Validator composition ========== -->
      <section class="sd-mv">
        <article class="panel is-bracketed sd-cell--mv">
          <div class="panel__head">
            <span class="panel__title">
              <span class="panel__fcode">&lt;110&gt;</span>
              MINERS &amp; VALIDATORS
              <span class="panel__go">&lt;GO&gt;</span>
            </span>
          </div>
          <div class="panel__caption">
            Active participants on this subnet today. Miners compete on output; validators score and
            distribute emissions. Stake-weighted root votes anchor the whole system.
          </div>
          <div class="panel__body">
            <div class="mv-row">
              <span class="mv-row__label">Miners</span>
              <span class="mv-row__bar mv-row__bar--miners"><i style="width:100%"></i></span>
              <span class="mv-row__value">${(subnet.miners ?? 0).toLocaleString('en-US')}</span>
            </div>
            <div class="mv-row">
              <span class="mv-row__label">Validators</span>
              <span class="mv-row__bar mv-row__bar--vals"><i style="width:${Math.min(100, ((subnet.validators ?? 0) / Math.max(1, subnet.miners ?? 1)) * 200)}%"></i></span>
              <span class="mv-row__value">${(subnet.validators ?? 0).toLocaleString('en-US')}</span>
            </div>
            <div class="mv-row">
              <span class="mv-row__label">Miner / Validator ratio</span>
              <span class="mv-row__bar mv-row__bar--ratio"><i style="width:${Math.min(100, ((subnet.miners ?? 0) / Math.max(1, subnet.validators ?? 1)) * 5)}%"></i></span>
              <span class="mv-row__value">${((subnet.miners ?? 0) / Math.max(1, subnet.validators ?? 1)).toFixed(1)} : 1</span>
            </div>
            <div class="mv-row">
              <span class="mv-row__label">Total stake</span>
              <span class="mv-row__bar mv-row__bar--stake"><i style="width:${Math.min(100, ((subnet.stake ?? 0) / 200_000) * 100)}%"></i></span>
              <span class="mv-row__value">τ ${(subnet.stake ?? 0).toLocaleString('en-US')}</span>
            </div>
          </div>
          <div class="panel__foot">
            <span>RATIO BAR SCALED · OVERVIEW</span>
            <span>EPOCH 14,302</span>
          </div>
        </article>

        <article class="panel is-bracketed sd-cell--activity">
          <div class="panel__head">
            <span class="panel__title">
              <span class="panel__fcode">&lt;111&gt;</span>
              LIVE ACTIVITY · SN${subnet.netuid}
              <span class="panel__go">&lt;GO&gt;</span>
            </span>
            <span class="panel__meta"><span class="panel__pill panel__pill--live"><span class="live-dot"></span>STREAMING</span></span>
          </div>
          <div class="panel__caption">
            On-chain events scoped to this subnet. Every row is a real-time action: stake moves,
            registrations, weight updates, inference receipts, emissions.
          </div>
          <div class="panel__body panel__body--pad-0">
            <ul class="sd-activity" id="sd-activity"></ul>
          </div>
          <div class="panel__foot">
            <span>SIM · SUBNET-SCOPED</span>
            <span>NEWEST FIRST</span>
          </div>
        </article>
      </section>

      <!-- ========== Competitive landscape ========== -->
      <section class="sd-vs">
        <header class="sd-vs__head">
          <span class="sd-vs__kicker">&lt;200&gt;  ${subnet.name} vs the centralized world</span>
          <h2>How <em>${subnet.name}</em> stacks against the centralized incumbents.</h2>
          <p>Decentralized on the left. Centralized on the right. Both ship in the
            <strong>${cat.label}</strong> category. Read across to see how the open-source +
            on-chain stack compares to the names dominating the same surface today.</p>
          <div class="sd-vs__filters">
            <button class="vs-tab active" data-region="ALL">All regions</button>
            <button class="vs-tab" data-region="US">US / West</button>
            <button class="vs-tab" data-region="ASIA">Asia</button>
            <button class="vs-tab" data-region="OS">Open-weight only</button>
          </div>
        </header>
        <div class="sd-vs__grid">
          <article class="sd-vs__decentralized">
            <div class="sd-vs__chip">DECENTRALIZED · BITTENSOR</div>
            <h3>SN${subnet.netuid} · ${subnet.name}</h3>
            <p>${subnet.desc}</p>
            <dl class="sd-vs__stats">
              <div><dt>Token</dt><dd>α subnet token + τ</dd></div>
              <div><dt>Stake</dt><dd>τ ${(subnet.stake ?? 0).toLocaleString('en-US')}</dd></div>
              <div><dt>Miners</dt><dd>${(subnet.miners ?? 0).toLocaleString('en-US')}</dd></div>
              <div><dt>Validators</dt><dd>${(subnet.validators ?? 0).toLocaleString('en-US')}</dd></div>
              <div><dt>Daily emission</dt><dd>τ ${(subnet.emission ?? 0).toLocaleString('en-US')}</dd></div>
              <div><dt>Source</dt><dd>${subnet.gh ? 'Open' : 'Â·'}</dd></div>
            </dl>
          </article>
          <article class="sd-vs__centralized">
            <div class="sd-vs__chip">CENTRALIZED · INCUMBENTS</div>
            <ul class="sd-vs__list" id="sd-vs-list"></ul>
          </article>
        </div>
      </section>

      <!-- ========== Latest benchmarks ========== -->
      <section class="sd-bench panel is-bracketed">
        <div class="panel__head">
          <span class="panel__title">
            <span class="panel__fcode">&lt;300&gt;</span>
            LATEST AI BENCHMARKS · ${cat.label}
            <span class="panel__go">&lt;GO&gt;</span>
          </span>
          <span class="panel__meta">
            <span class="panel__pill">${bench.length} BENCHMARKS</span>
          </span>
        </div>
        <div class="panel__caption">
          The benchmarks that define the state of the art in this category as of May 2026.
          Open-weight models are flagged so you can see exactly where Bittensor's training and
          inference subnets are competing.
        </div>
        <div class="panel__body sd-bench__body" id="sd-bench-body"></div>
        <div class="panel__foot">
          <span>SOURCES · LMSYS / OpenLLM / HELM / paper releases</span>
          <span>UPDATED MAY 2026</span>
        </div>
      </section>

      <!-- ========== Asian competitors ========== -->
      ${asian.length ? `
      <section class="sd-asia panel is-bracketed">
        <div class="panel__head">
          <span class="panel__title">
            <span class="panel__fcode">&lt;400&gt;</span>
            ASIAN COMPETITORS · ${cat.label}
            <span class="panel__go">&lt;GO&gt;</span>
          </span>
          <span class="panel__meta">
            <span class="panel__pill">${asian.length} PLAYERS</span>
          </span>
        </div>
        <div class="panel__caption">
          The Asian half of the field SN${subnet.netuid} is competing against,           China, Korea, Japan, Taiwan, India. Open-weight + sovereign-compute heavy.
        </div>
        <div class="panel__body panel__body--pad-0">
          <ul class="asia-list">
            ${asian.map(p => `
              <li class="asia-row">
                <span class="asia-row__region flag flag--region flag--${p.region.toLowerCase()}">${p.region}</span>
                <span class="asia-row__main">
                  <a class="asia-row__name" href="${p.url}" target="_blank" rel="noopener">${p.name}</a>
                  <span class="asia-row__focus">${p.focus}</span>
                </span>
                <span class="asia-row__cat">${(CATEGORIES[p.cat]?.label || p.cat)}</span>
                <span class="asia-row__flags">
                  ${p.openSource ? '<span class="flag flag--open">OPEN</span>' : ''}
                  <span class="flag flag--val">${p.valuation}</span>
                </span>
              </li>
            `).join('')}
          </ul>
        </div>
        <div class="panel__foot">
          <span>${asian.filter(p => p.openSource).length} OPEN-WEIGHT · ${asian.length - asian.filter(p => p.openSource).length} CLOSED</span>
          <span>SOURCE · centralized.js</span>
        </div>
      </section>` : ''}

      <!-- ========== Peer subnets in same category ========== -->
      ${peers.length ? `
      <section class="sd-peers panel is-bracketed">
        <div class="panel__head">
          <span class="panel__title">
            <span class="panel__fcode">&lt;500&gt;</span>
            OTHER ${cat.label.toUpperCase()} SUBNETS
            <span class="panel__go">&lt;GO&gt;</span>
          </span>
        </div>
        <div class="panel__caption">Subnets in the same category, pivot the analysis to a peer.</div>
        <div class="panel__body">
          <ul class="sd-peers__list">
            ${peers.map(p => `
              <li class="sd-peer">
                <a href="subnet.html?id=${p.netuid}" class="sd-peer__link">
                  <span class="sd-peer__id">SN${p.netuid}</span>
                  <span class="sd-peer__name">${p.name}</span>
                  <span class="sd-peer__desc">${p.desc}</span>
                  <span class="sd-peer__emit">τ ${p.emission}</span>
                </a>
              </li>
            `).join('')}
          </ul>
        </div>
      </section>` : ''}

    </article>
  `);

  /* ===== Workflow diagram ===== */
  const wfCanvas = qs('[data-canvas="workflow"]', root);
  const wfChart  = wfCanvas ? new WorkflowDiagram(wfCanvas, {
    steps: workflowFor(subnet.cat, subnet),
  }) : null;

  /* ===== Tech specs ===== */
  const specs = subnetSpecs(subnet);
  const specsDl = qs('#sd-specs', root);
  if (specsDl){
    const rows = [
      ['Netuid',         `SN${subnet.netuid}`],
      ['Owner',          subnet.owner ?? 'Â·'],
      ['Founded',        specs.founded ?? 'Â·'],
      ['Version',        specs.version ?? 'Â·'],
      ['Chain',          specs.chain],
      ['Epoch length',   `${specs.epochBlocks} blocks · ~72 min`],
      ['Scoring',        specs.model],
      ['Miner reqs',     specs.reqMiner ?? 'Â·'],
      ['Validator reqs', specs.reqVal ?? 'Â·'],
    ];
    specsDl.innerHTML = rows.map(([k, v]) => `
      <div class="sd-spec">
        <dt>${k}</dt>
        <dd>${v}</dd>
      </div>
    `).join('');
  }

  /* ===== Recent updates list ===== */
  const upUl    = qs('#sd-updates', root);
  const updates = subnetUpdates(subnet);
  if (upUl){
    if (!updates.length){
      upUl.innerHTML = `
        <li class="sd-update sd-update--empty">
          No tracked updates yet for this subnet. Curated history coming.
        </li>`;
    } else {
      upUl.innerHTML = updates.map(u => {
        const d = new Date(u.date + 'T00:00:00Z');
        const day   = String(d.getUTCDate()).padStart(2, '0');
        const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
        const year  = d.getUTCFullYear();
        return `
          <li class="sd-update">
            <span class="sd-update__date">${day} ${month} ${year}</span>
            <span class="sd-update__type" data-type="${u.type}">${u.type.toUpperCase()}</span>
            <span class="sd-update__title">${u.title}</span>
          </li>
        `;
      }).join('');
    }
  }

  /* ===== Performance line chart (re-uses Timeline) ===== */
  const perfCanvas = qs('[data-canvas="perf"]', root);
  const perfData   = buildSubnetHistory(subnet, 90);
  const perfChart  = perfCanvas ? new Timeline(perfCanvas, { priceData: perfData }) : null;

  /* ===== Emission share donut ===== */
  const shareCanvas = qs('[data-canvas="share"]', root);
  const shareChart  = shareCanvas ? new DonutChart(shareCanvas, {
    value: subnet.emission ?? 0,
    total: totalEmit,
    color: cat.color,
    label: `${sharePct.toFixed(2)}%`,
    sub:   `τ ${(subnet.emission ?? 0).toLocaleString('en-US')} / 24h`,
  }) : null;

  /* ===== Live activity stream (subnet-scoped) ===== */
  const feed = qs('#sd-activity', root);
  const MAX_ROWS = 14;
  function pushActivity(){
    if (!feed) return;
    const action = pickAction();
    const amt = ['REGISTER','WEIGHT','CHILDKEY'].includes(action.code)
      ? null
      : (40 + Math.random() * 3_400);
    const minerId = '0x' + Math.random().toString(16).slice(2, 6).toUpperCase();
    const li = document.createElement('li');
    li.className = 'sd-act is-new';
    li.innerHTML = `
      <span class="sd-act__ts">${nowStamp()}</span>
      <span class="sd-act__code" data-action="${action.code}">${action.code}</span>
      <span class="sd-act__subject">
        <span class="sd-act__net">SN${subnet.netuid}</span>
        <span class="sd-act__miner">miner ${minerId}</span>
      </span>
      ${amt != null ? `<span class="sd-act__amt">τ ${amt.toLocaleString('en-US', { maximumFractionDigits: 1 })}</span>` : '<span class="sd-act__amt"></span>'}
    `;
    feed.prepend(li);
    while (feed.children.length > MAX_ROWS) feed.lastElementChild.remove();
    requestAnimationFrame(() => requestAnimationFrame(() => li.classList.remove('is-new')));
  }
  for (let i = 0; i < 8; i++) pushActivity();
  const feedTimer = setInterval(pushActivity, 1_200);

  /* ===== Competitor list with region filter ===== */
  const vsList = qs('#sd-vs-list', root);
  let vsRegion = 'ALL';
  function renderVs(){
    if (!vsList) return;
    let arr = competitors.slice();
    if (vsRegion === 'ASIA')      arr = arr.filter(p => ASIAN_REGIONS.has(p.region));
    else if (vsRegion === 'US')   arr = arr.filter(p => !ASIAN_REGIONS.has(p.region));
    else if (vsRegion === 'OS')   arr = arr.filter(p => p.openSource);
    vsList.innerHTML = arr.map(p => `
      <li class="sd-vs__row">
        <span class="flag flag--region flag--${p.region.toLowerCase()}">${p.region}</span>
        <span class="sd-vs__name">
          <a href="${p.url}" target="_blank" rel="noopener">${p.name}</a>
          <span class="sd-vs__focus">${p.focus}</span>
        </span>
        <span class="sd-vs__val">${p.valuation}</span>
        ${p.openSource ? '<span class="flag flag--open">OPEN</span>' : '<span class="flag flag--val">closed</span>'}
      </li>
    `).join('') || '<li class="sd-vs__empty">No tracked centralized competitors match this filter.</li>';
  }
  renderVs();
  root.querySelectorAll('.vs-tab').forEach(t => t.addEventListener('click', () => {
    root.querySelectorAll('.vs-tab').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    vsRegion = t.dataset.region;
    renderVs();
  }));

  /* ===== Benchmarks leaderboard (category-relevant) ===== */
  const benchBody = qs('#sd-bench-body', root);
  let activeBench = bench[0];
  function renderBench(){
    if (!benchBody) return;
    const tabs = bench.map(b => `
      <button class="bench-tab ${b.id === activeBench.id ? 'active' : ''}" data-bench="${b.id}">
        ${b.name}
      </button>
    `).join('');
    const top = activeBench.leaders.slice(0, 8);
    const maxScore = Math.max(...top.map(l => l.score));
    const rows = top.map((l, i) => {
      const w = (l.score / maxScore) * 100;
      return `
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
          <span class="bench-row__bar"><i style="width:${w}%"></i></span>
          <span class="bench-row__score">${l.score.toLocaleString('en-US')}${activeBench.unit === '%' ? '%' : ''}</span>
        </li>
      `;
    }).join('');
    benchBody.innerHTML = `
      <div class="bench-tabs">${tabs}</div>
      <div class="bench-desc">
        <strong>${activeBench.full}</strong> · <span>${activeBench.description}</span>
      </div>
      <ol class="bench-list">${rows}</ol>
    `;
    benchBody.querySelectorAll('.bench-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const id = tab.dataset.bench;
        activeBench = bench.find(b => b.id === id) || bench[0];
        renderBench();
      });
    });
  }
  renderBench();

  /* ===== Expand button, opens the 90-day chart fullscreen ===== */
  root.querySelectorAll('[data-expand="perf"]').forEach(btn => {
    btn.addEventListener('click', () => openChartModal({
      ChartClass: Timeline,
      opts: { priceData: perfData },
      title: `${subnet.name} · α-PRICE 90 DAYS`,
      subtitle: `SN${subnet.netuid} · ${cat.label}`,
      fcode: '100',
    }));
  });

  /* ===== live overlay: refresh the header metrics from tao:subnets =====
     The static seed still drives the structural sections (workflow,
     specs, peers); this just swaps the market-data values for the
     real ones the moment the live feed lands. */
  let liveUnsub = null;
  if (dataLayer){
    const set = (key, txt, cls) => {
      const el = qs(`[data-sd="${key}"]`, root);
      if (!el) return;
      el.textContent = txt;
      if (cls){ el.classList.remove('up', 'down'); el.classList.add(cls); }
    };
    const applyLive = list => {
      if (!Array.isArray(list)) return;
      const L = list.find(s => s.netuid === subnet.netuid);
      if (!L) return;
      if (L.name) set('name', L.name);
      if (L.price != null) set('price', L.price < 1 ? '$' + L.price.toFixed(4) : '$' + L.price.toFixed(2));
      if (L.chg24 != null) set('chg24', `${L.chg24 >= 0 ? '+' : ''}${L.chg24.toFixed(2)}% 24h`, L.chg24 >= 0 ? 'up' : 'down');
      if (L.emission != null) set('emission', 'τ ' + Math.round(L.emission).toLocaleString('en-US'));
      if (L.chg30 != null) set('chg30', `${L.chg30 >= 0 ? '+' : ''}${L.chg30.toFixed(2)}%`, L.chg30 >= 0 ? 'up' : 'down');
    };
    liveUnsub = dataLayer.subscribe('tao:subnets', applyLive);
    applyLive(dataLayer.get('tao:subnets'));
  }

  return {
    destroy(){
      perfChart?.destroy();
      shareChart?.destroy();
      wfChart?.destroy();
      clearInterval(feedTimer);
      if (liveUnsub) liveUnsub();
    },
  };
}

void raw; void BarChart; void NEWS_KEYWORDS; void REGIONS; void SUBNET_META;
