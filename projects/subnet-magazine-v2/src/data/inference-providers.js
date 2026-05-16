/* =================================================================
   SUBNET MAGAZINE, INFERENCE PROVIDERS
   -----------------------------------------------------------------
   Catalogue of inference providers benchmarked on the Compare
   page. Mirrors the SemiAnalysis InferenceX field set so the
   numbers are directly comparable to their dashboard:

     - TTFT       Time-to-first-token in ms (TTFT)
     - ITL        Inter-token latency in ms (ITL)
     - tps        Steady-state output tokens per second
     - tpsGpu     Output tokens/sec PER GPU (where disclosed)
     - priceIn    $ / 1M input tokens
     - priceOut   $ / 1M output tokens
     - precision  Native precision the production stack runs at
     - gpu        Hardware class the model runs on for that price tier
     - contextK   Context window in thousands

   Bittensor subnets are heterogeneous, different miners run on
   different GPUs, so tpsGpu is reported as the median across
   active miners for that subnet.

   All figures are public best-effort approximations for May 2026.
   ================================================================= */

/** @typedef {'subnet'|'frontier'|'open'} ProviderKind */

/**
 * @typedef {Object} InferenceProvider
 * @prop {string}       id
 * @prop {string}       name
 * @prop {string}       org
 * @prop {ProviderKind} kind
 * @prop {'US'|'CN'|'KR'|'JP'|'EU'|'UK'|'DE'|'IN'|'NO'|'CA'|'DECENTRAL'} region
 * @prop {number}       priceIn        $ / 1M input tokens
 * @prop {number}       priceOut       $ / 1M output tokens
 * @prop {number}       ttft           time-to-first-token in ms
 * @prop {number}       itl            inter-token latency in ms
 * @prop {number}       tps            steady-state output tokens / sec
 * @prop {number}       tpsGpu         tokens / sec / GPU
 * @prop {'FP4'|'FP8'|'FP16'|'mixed'} precision
 * @prop {string}       gpu
 * @prop {number}       contextK
 * @prop {boolean}      open
 * @prop {string}       desc
 * @prop {string=}      subnetId
 */

/** @type {readonly InferenceProvider[]} */
export const PROVIDERS = Object.freeze([
  /* ===== Bittensor subnets, the decentralized compute / GPU class ===== */
  { id:'sn64',    name:'SN64 Chutes',     org:'Rayon Labs',      kind:'subnet',   region:'DECENTRAL',
    priceIn:0.10, priceOut:0.10,  ttft:300, itl:8,  tps:124, tpsGpu:104,
    precision:'mixed', gpu:'Heterogeneous (H200 / H100 / 4090)', contextK:128, open:true,
    desc:'Serverless decentralized inference, the largest compute subnet, undercuts the centralized APIs on price.', subnetId:'64' },
  { id:'sn4',     name:'SN4 Targon',      org:'Manifold Labs',   kind:'subnet',   region:'DECENTRAL',
    priceIn:0.14, priceOut:0.14,  ttft:380, itl:10, tps:96,  tpsGpu:84,
    precision:'mixed', gpu:'Heterogeneous (H100 / A100)', contextK:128, open:true,
    desc:'Bandwidth-priced LLM inference with deterministic verifiers.',       subnetId:'4'  },
  { id:'sn51',    name:'SN51 Celium',     org:'Datura',          kind:'subnet',   region:'DECENTRAL',
    priceIn:0.12, priceOut:0.12,  ttft:340, itl:9,  tps:110, tpsGpu:92,
    precision:'mixed', gpu:'Rented GPU marketplace (H200 / H100)', contextK:128, open:true,
    desc:'Decentralized GPU marketplace, raw rented compute, inference served on top.', subnetId:'51' },
  { id:'sn1',     name:'SN1 Apex',        org:'Macrocosmos',     kind:'subnet',   region:'DECENTRAL',
    priceIn:0.18, priceOut:0.18,  ttft:420, itl:12, tps:84,  tpsGpu:70,
    precision:'mixed', gpu:'Heterogeneous (H100 / 4090)', contextK:128, open:true,
    desc:'Open-domain text prompting. Rubric-graded miner outputs.',          subnetId:'1'  },
  { id:'sn18',    name:'SN18 Cortex.t',   org:'Corcel',          kind:'subnet',   region:'DECENTRAL',
    priceIn:0.22, priceOut:0.22,  ttft:280, itl:9,  tps:110, tpsGpu:96,
    precision:'mixed', gpu:'Heterogeneous (H100 / H200)', contextK:128, open:true,
    desc:'Real-time text inference with strict latency SLAs.',                 subnetId:'18' },
  { id:'sn6',     name:'SN6 Nous',        org:'Nous Research',   kind:'subnet',   region:'DECENTRAL',
    priceIn:0.20, priceOut:0.20,  ttft:450, itl:14, tps:72,  tpsGpu:64,
    precision:'mixed', gpu:'Heterogeneous (H100 / A100)', contextK:32,  open:true,
    desc:'Finetune competitions, best community model wins the epoch.',       subnetId:'6'  },
  { id:'sn11',    name:'SN11 Dippy',      org:'Dippy AI',        kind:'subnet',   region:'DECENTRAL',
    priceIn:0.18, priceOut:0.18,  ttft:520, itl:16, tps:64,  tpsGpu:56,
    precision:'mixed', gpu:'Heterogeneous (4090 / A100)', contextK:32,  open:true,
    desc:'Roleplay / dialogue-tuned models.',                                  subnetId:'11' },

  /* ===== Frontier (closed, first-party hosted) ===== */
  { id:'opus47',  name:'Claude Opus 4.7', org:'Anthropic',       kind:'frontier', region:'US',
    priceIn:15.00, priceOut:75.00, ttft:1200, itl:18, tps:54,  tpsGpu:0,
    precision:'FP8',  gpu:'GB200 NVL72 (undisclosed)', contextK:1000, open:false,
    desc:'Anthropic flagship. Top LMSYS Arena ELO Apr 2026.' },
  { id:'sonnet46',name:'Claude Sonnet 4.6', org:'Anthropic',     kind:'frontier', region:'US',
    priceIn:3.00,  priceOut:15.00, ttft:700,  itl:11, tps:88,  tpsGpu:0,
    precision:'FP8',  gpu:'GB200 NVL72 (undisclosed)', contextK:1000, open:false,
    desc:'Workhorse tier, most enterprise traffic.' },
  { id:'gpt51',   name:'GPT-5.1',         org:'OpenAI',          kind:'frontier', region:'US',
    priceIn:12.50, priceOut:50.00, ttft:980,  itl:15, tps:68,  tpsGpu:0,
    precision:'FP4',  gpu:'B200 NVL72',                contextK:256,  open:false,
    desc:'OpenAI flagship. Strong on tool-use + agents.' },
  { id:'gpt51m',  name:'GPT-5.1 Mini',    org:'OpenAI',          kind:'frontier', region:'US',
    priceIn:1.50,  priceOut:6.00,  ttft:480,  itl:9,  tps:120, tpsGpu:0,
    precision:'FP4',  gpu:'B200',                      contextK:256,  open:false,
    desc:'Efficient frontier tier.' },
  { id:'gemini3', name:'Gemini 3 Pro',    org:'Google DeepMind', kind:'frontier', region:'US',
    priceIn:7.50,  priceOut:30.00, ttft:720,  itl:12, tps:92,  tpsGpu:0,
    precision:'mixed',gpu:'TPU v6 (Trillium)',         contextK:2000, open:false,
    desc:'Native multimodal. Search-integrated.' },
  { id:'grok4',   name:'Grok 4',          org:'xAI',             kind:'frontier', region:'US',
    priceIn:5.00,  priceOut:25.00, ttft:850,  itl:13, tps:78,  tpsGpu:0,
    precision:'FP8',  gpu:'H200 / Colossus 2',         contextK:200,  open:false,
    desc:'X-native context. Heavy compute backing.' },
  { id:'kimi',    name:'Kimi K2',         org:'Moonshot',        kind:'frontier', region:'CN',
    priceIn:0.40,  priceOut:1.60,  ttft:520,  itl:10, tps:96,  tpsGpu:84,
    precision:'FP8',  gpu:'H100 / H800',               contextK:2000, open:false,
    desc:'Long-context Chinese-first LLM. 2M context.' },

  /* ===== Open-weights (served on Together / Fireworks / DeepInfra / native) ===== */
  { id:'llama5',  name:'Llama 5 405B',    org:'Meta · open',     kind:'open',     region:'US',
    priceIn:2.00,  priceOut:6.00,  ttft:620,  itl:11, tps:90,  tpsGpu:72,
    precision:'FP8',  gpu:'H200 / B200',               contextK:256,  open:true,
    desc:'Meta open-weights flagship.' },
  { id:'dsr3',    name:'DeepSeek-R3',     org:'DeepSeek · open', kind:'open',     region:'CN',
    priceIn:0.55,  priceOut:2.20,  ttft:540,  itl:10, tps:96,  tpsGpu:80,
    precision:'FP8',  gpu:'H800 / H100',               contextK:128,  open:true,
    desc:'Open reasoning. Cheapest frontier-tier.' },
  { id:'qwen3',   name:'Qwen 3 Max',      org:'Alibaba · open',  kind:'open',     region:'CN',
    priceIn:0.80,  priceOut:3.00,  ttft:580,  itl:11, tps:92,  tpsGpu:76,
    precision:'FP8',  gpu:'H800',                      contextK:128,  open:true,
    desc:'Alibaba open-weights flagship. Strong multimodal.' },
  { id:'yi',      name:'Yi-Large 2',      org:'01.AI · open',    kind:'open',     region:'CN',
    priceIn:0.30,  priceOut:1.20,  ttft:460,  itl:9,  tps:88,  tpsGpu:72,
    precision:'FP8',  gpu:'H800',                      contextK:64,   open:true,
    desc:'Kai-Fu Lee\'s open-weights line. Excellent value tier.' },
  { id:'mistral2',name:'Mistral Large 2', org:'Mistral · open',  kind:'open',     region:'EU',
    priceIn:2.40,  priceOut:6.00,  ttft:580,  itl:11, tps:84,  tpsGpu:68,
    precision:'FP8',  gpu:'H100 / MI300X',             contextK:128,  open:true,
    desc:'European frontier-tier open weights.' },
  { id:'glm5',    name:'GLM-5',           org:'Zhipu · open',    kind:'open',     region:'CN',
    priceIn:0.45,  priceOut:1.80,  ttft:480,  itl:10, tps:92,  tpsGpu:76,
    precision:'FP8',  gpu:'H800',                      contextK:128,  open:true,
    desc:'Open + enterprise from Zhipu AI.' },
]);

/** @type {readonly string[]} */
export const METRICS = Object.freeze([
  { id:'blended',  label:'Blended $ / 1M',     fmt: v => `$${v.toFixed(2)}`, lower:true,  pick: p => p.priceIn + p.priceOut },
  { id:'priceOut', label:'$ / 1M Output',      fmt: v => `$${v.toFixed(2)}`, lower:true,  pick: p => p.priceOut },
  { id:'ttft',     label:'TTFT (ms)',          fmt: v => `${Math.round(v)} ms`, lower:true,pick: p => p.ttft },
  { id:'itl',      label:'ITL (ms / token)',   fmt: v => `${v.toFixed(1)} ms`,  lower:true,pick: p => p.itl },
  { id:'tps',      label:'Tokens / sec',       fmt: v => `${Math.round(v)} t/s`, lower:false, pick: p => p.tps },
  { id:'tpsGpu',   label:'Tokens / sec / GPU', fmt: v => v ? `${Math.round(v)} t/s` : 'Â·', lower:false, pick: p => p.tpsGpu },
  { id:'context',  label:'Context (K tokens)', fmt: v => `${v}K`, lower:false, pick: p => p.contextK },
]);

/** GPU specs catalog for the GPU Specs tab. */
export const GPUS = Object.freeze([
  { name:'NVIDIA GB300 NVL72', vendor:'NVIDIA', tier:'flagship', fp4: 1440, fp8: 720,  fp16: 360, hbm: '288 GB HBM3e',   power: '1400W', year: 2025 },
  { name:'NVIDIA GB200 NVL72', vendor:'NVIDIA', tier:'flagship', fp4: 1100, fp8: 550,  fp16: 275, hbm: '192 GB HBM3e',   power: '1200W', year: 2024 },
  { name:'NVIDIA B200',        vendor:'NVIDIA', tier:'flagship', fp4: 1100, fp8: 550,  fp16: 275, hbm: '192 GB HBM3e',   power: '1000W', year: 2024 },
  { name:'NVIDIA H200',        vendor:'NVIDIA', tier:'previous', fp4: 0,    fp8: 285,  fp16: 142, hbm: '141 GB HBM3e',   power: '700W',  year: 2024 },
  { name:'NVIDIA H100',        vendor:'NVIDIA', tier:'previous', fp4: 0,    fp8: 198,  fp16: 99,  hbm: '80 GB HBM3',     power: '700W',  year: 2022 },
  { name:'NVIDIA H800',        vendor:'NVIDIA', tier:'previous', fp4: 0,    fp8: 198,  fp16: 99,  hbm: '80 GB HBM3',     power: '700W',  year: 2023 },
  { name:'AMD MI355X',         vendor:'AMD',    tier:'flagship', fp4: 0,    fp8: 600,  fp16: 300, hbm: '288 GB HBM3e',   power: '1000W', year: 2025 },
  { name:'AMD MI325X',         vendor:'AMD',    tier:'flagship', fp4: 0,    fp8: 525,  fp16: 263, hbm: '256 GB HBM3e',   power: '750W',  year: 2024 },
  { name:'AMD MI300X',         vendor:'AMD',    tier:'previous', fp4: 0,    fp8: 525,  fp16: 263, hbm: '192 GB HBM3',    power: '750W',  year: 2023 },
  { name:'Google TPU v6 (Trillium)', vendor:'Google', tier:'flagship', fp4: 0, fp8: 0, fp16: 459, hbm: '32 GB HBM',     power: 'n/a',   year: 2024 },
]);

/** Preset comparison shortcuts. */
export const PRESETS = Object.freeze([
  { id:'cheapest-open',    label:'Cheapest open-weights',     ids:['dsr3','yi','glm5','qwen3','llama5'] },
  { id:'fastest-decentral',label:'Fastest decentralized',     ids:['sn18','sn4','sn1','sn6','sn11'] },
  { id:'frontier-only',    label:'Frontier only',             ids:['opus47','sonnet46','gpt51','gemini3','grok4','kimi'] },
  { id:'asia-only',        label:'Asia only',                 ids:['dsr3','qwen3','yi','glm5','kimi'] },
  { id:'open-vs-closed',   label:'Open-weights vs frontier',  ids:['llama5','dsr3','qwen3','opus47','gpt51','gemini3'] },
  { id:'subnet-spotlight', label:'Bittensor spotlight',       ids:['sn1','sn4','sn18','sn6','sn11'] },
  { id:'all',              label:'Everything',                ids:null },
]);

/** Index by id for lookups. */
export function providerById(id){ return PROVIDERS.find(p => p.id === id) || null; }

/** Pick the lowest cost-per-1M (blended) of any kind. */
export function cheapestBlended(){
  return PROVIDERS.slice().sort((a, b) => (a.priceIn + a.priceOut) - (b.priceIn + b.priceOut));
}
