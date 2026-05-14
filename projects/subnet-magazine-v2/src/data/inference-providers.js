/* =================================================================
   SUBNET MAGAZINE — INFERENCE PROVIDERS
   -----------------------------------------------------------------
   Catalogue of inference providers the Compare page benchmarks
   against each other. Three classes:

     - 'subnet'      a Bittensor subnet (decentralized)
     - 'frontier'    a centralized frontier lab / closed model
     - 'open'        an open-weights model served via a known host

   Each entry carries pricing, typical latency, model context, and
   an Asian-market flag so the Compare page can show "open · Asia"
   in the result card chrome.

   Pricing follows standard $/1M-token conventions for input+output
   combined when published as a single rate, otherwise we pick the
   blended figure from public rate cards.
   ================================================================= */

/** @typedef {'subnet'|'frontier'|'open'} ProviderKind */

/**
 * @typedef {Object} InferenceProvider
 * @prop {string}       id           slug used in URLs and result keys
 * @prop {string}       name         display name
 * @prop {string}       org          who runs it
 * @prop {ProviderKind} kind
 * @prop {'US'|'CN'|'KR'|'JP'|'EU'|'UK'|'DE'|'IN'|'NO'|'CA'|'DECENTRAL'} region
 * @prop {number}       priceIn      $ per 1M input tokens
 * @prop {number}       priceOut     $ per 1M output tokens
 * @prop {number}       latencyMs    typical first-token latency (ms)
 * @prop {number}       tokenPerSec  steady-state output tokens / sec
 * @prop {number}       contextK     context window in thousands of tokens
 * @prop {boolean}      open         open-weights model
 * @prop {string}       desc         one-line description
 * @prop {string=}      subnetId     for kind === 'subnet'
 */

/** @type {readonly InferenceProvider[]} */
export const PROVIDERS = Object.freeze([
  /* ===== Bittensor subnets (decentralized) ===== */
  { id:'sn1',     name:'SN1 Apex',           org:'Macrocosmos',     kind:'subnet',   region:'DECENTRAL', priceIn:0.18, priceOut:0.18, latencyMs:420, tokenPerSec:84,  contextK:128, open:true,  desc:'Original Bittensor text battleground. Rubric-graded miner outputs.', subnetId:'1' },
  { id:'sn4',     name:'SN4 Targon',         org:'Manifold Labs',   kind:'subnet',   region:'DECENTRAL', priceIn:0.14, priceOut:0.14, latencyMs:380, tokenPerSec:96,  contextK:128, open:true,  desc:'Bandwidth-priced LLM inference with deterministic verifiers.',       subnetId:'4' },
  { id:'sn18',    name:'SN18 Cortex.t',      org:'Corcel',          kind:'subnet',   region:'DECENTRAL', priceIn:0.22, priceOut:0.22, latencyMs:280, tokenPerSec:110, contextK:128, open:true,  desc:'Real-time inference with strict latency SLAs.',                       subnetId:'18' },
  { id:'sn6',     name:'SN6 Nous',           org:'Nous Research',   kind:'subnet',   region:'DECENTRAL', priceIn:0.20, priceOut:0.20, latencyMs:450, tokenPerSec:72,  contextK:32,  open:true,  desc:'Finetune competitions — best community model wins the epoch.',        subnetId:'6' },
  { id:'sn11',    name:'SN11 Dippy',         org:'Dippy AI',        kind:'subnet',   region:'DECENTRAL', priceIn:0.18, priceOut:0.18, latencyMs:520, tokenPerSec:64,  contextK:32,  open:true,  desc:'Roleplay / dialogue-tuned models.',                                   subnetId:'11' },

  /* ===== Frontier / centralized ===== */
  { id:'opus47',  name:'Claude Opus 4.7',    org:'Anthropic',       kind:'frontier', region:'US',        priceIn:15.00, priceOut:75.00, latencyMs:1200, tokenPerSec:54, contextK:1000, open:false, desc:'Anthropic flagship. Top LMSYS Arena ELO as of Apr 2026.' },
  { id:'sonnet46',name:'Claude Sonnet 4.6',  org:'Anthropic',       kind:'frontier', region:'US',        priceIn:3.00,  priceOut:15.00, latencyMs: 700, tokenPerSec:88, contextK:1000, open:false, desc:'Workhorse tier — most enterprise traffic.' },
  { id:'gpt51',   name:'GPT-5.1',            org:'OpenAI',          kind:'frontier', region:'US',        priceIn:12.50, priceOut:50.00, latencyMs: 980, tokenPerSec:68, contextK: 256, open:false, desc:'OpenAI flagship. Strong on tool-use + agents.' },
  { id:'gpt51m',  name:'GPT-5.1 Mini',       org:'OpenAI',          kind:'frontier', region:'US',        priceIn:1.50,  priceOut:6.00,  latencyMs: 480, tokenPerSec:120,contextK: 256, open:false, desc:'Efficient frontier tier.' },
  { id:'gemini3', name:'Gemini 3 Pro',       org:'Google DeepMind', kind:'frontier', region:'US',        priceIn:7.50,  priceOut:30.00, latencyMs: 720, tokenPerSec:92, contextK:2000, open:false, desc:'Multimodal-by-default. Native search integration.' },
  { id:'grok4',   name:'Grok 4',             org:'xAI',             kind:'frontier', region:'US',        priceIn:5.00,  priceOut:25.00, latencyMs: 850, tokenPerSec:78, contextK: 200, open:false, desc:'X-native context. Heavy compute backing.' },

  /* ===== Open-weights served via known hosts ===== */
  { id:'llama5',  name:'Llama 5 405B',       org:'Meta · open',     kind:'open',     region:'US',        priceIn:2.00,  priceOut:6.00,  latencyMs: 620, tokenPerSec:90, contextK: 256, open:true,  desc:'Meta open-weights flagship — runs anywhere with a GPU.' },
  { id:'dsr3',    name:'DeepSeek-R3',        org:'DeepSeek · open', kind:'open',     region:'CN',        priceIn:0.55,  priceOut:2.20,  latencyMs: 540, tokenPerSec:96, contextK: 128, open:true,  desc:'Open reasoning model from China. Cheapest frontier-tier.' },
  { id:'qwen3',   name:'Qwen 3 Max',         org:'Alibaba · open',  kind:'open',     region:'CN',        priceIn:0.80,  priceOut:3.00,  latencyMs: 580, tokenPerSec:92, contextK: 128, open:true,  desc:'Alibaba open-weights flagship. Strong multimodal.' },
  { id:'yi',      name:'Yi-Large 2',         org:'01.AI · open',    kind:'open',     region:'CN',        priceIn:0.30,  priceOut:1.20,  latencyMs: 460, tokenPerSec:88, contextK:  64, open:true,  desc:'Kai-Fu Lee\'s open-weights line. Excellent value tier.' },
  { id:'mistral2',name:'Mistral Large 2',    org:'Mistral · open',  kind:'open',     region:'EU',        priceIn:2.40,  priceOut:6.00,  latencyMs: 580, tokenPerSec:84, contextK: 128, open:true,  desc:'European frontier-tier open weights.' },
  { id:'kimi',    name:'Kimi K2',            org:'Moonshot',        kind:'frontier', region:'CN',        priceIn:0.40,  priceOut:1.60,  latencyMs: 520, tokenPerSec:96, contextK:2000, open:false, desc:'Long-context Chinese-first LLM. 2M context window.' },
  { id:'glm5',    name:'GLM-5',              org:'Zhipu · open',    kind:'open',     region:'CN',        priceIn:0.45,  priceOut:1.80,  latencyMs: 480, tokenPerSec:92, contextK: 128, open:true,  desc:'Open + enterprise from Zhipu AI.' },
]);

/** Index by id for lookups. */
export function providerById(id){ return PROVIDERS.find(p => p.id === id) || null; }

/** Pick the lowest cost-per-1M (blended) of any kind. */
export function cheapestBlended(){
  return PROVIDERS.slice().sort((a, b) => (a.priceIn + a.priceOut) - (b.priceIn + b.priceOut));
}
