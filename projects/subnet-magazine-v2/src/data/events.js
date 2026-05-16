/* =================================================================
   SUBNET MAGAZINE, ECOSYSTEM EVENT TIMELINE
   -----------------------------------------------------------------
   Major events that moved the Bittensor + decentralized-AI story
   from mainnet launch (Sept 2023) through May 2026. Used by the
   Timeline chart to overlay context on the τ/USD price line.

   Categories drive color:
     - 'network'   protocol upgrades, halvings, dTAO, mainnet
     - 'subnet'    notable subnet launches / restructures
     - 'model'     centralized AI model releases that shaped the
                   conversation (Claude, GPT, Gemini, Llama,
                   DeepSeek, Qwen, Grok, etc.)
     - 'market'    listings, ATHs, big regulatory moves
   ================================================================= */

/** @typedef {'network'|'subnet'|'model'|'market'} EventCategory */

/**
 * @typedef {Object} EcosystemEvent
 * @prop {string} date      ISO 'YYYY-MM-DD'
 * @prop {string} title
 * @prop {EventCategory} cat
 * @prop {string} [body]    one-sentence description
 */

/** Chronological. Anything added in the future just appends. */
export const EVENTS = Object.freeze([
  /* ===== 2023 ===== */
  { date:'2023-09-08', cat:'network', title:'τ Mainnet launches',
    body:'Bittensor genesis block. SN1 is the original miner battleground.' },
  { date:'2023-11-30', cat:'model',   title:'ChatGPT one year',
    body:'OpenAI marks year one. The shape of the centralized race is set.' },
  { date:'2023-12-06', cat:'model',   title:'Gemini 1.0',
    body:'Google DeepMind ships its first frontier flagship.' },

  /* ===== 2024 ===== */
  { date:'2024-01-22', cat:'market',  title:'τ first major listings',
    body:'Bittensor lands on tier-1 exchanges; institutional access opens.' },
  { date:'2024-03-04', cat:'model',   title:'Claude 3 family',
    body:'Anthropic ships Opus, Sonnet, Haiku, the first multi-tier flagship line.' },
  { date:'2024-04-18', cat:'model',   title:'Llama 3 ships',
    body:'Meta open-weights wave, sets the bar every subnet text miner trains against.' },
  { date:'2024-05-13', cat:'model',   title:'GPT-4o',
    body:'OpenAI ships the omnimodal default, voice, vision, text, in one model.' },
  { date:'2024-06-20', cat:'model',   title:'Claude 3.5 Sonnet',
    body:'Anthropic pushes the mid-tier higher than most flagships.' },
  { date:'2024-09-19', cat:'network', title:'τ halving #1',
    body:'Block reward halves. Every subnet feels the squeeze; emissions reshape.' },
  { date:'2024-12-26', cat:'model',   title:'DeepSeek-V3',
    body:'$6M Chinese open-weight 671B-MoE matches frontier. The center of gravity tilts.' },

  /* ===== 2025 ===== */
  { date:'2025-01-20', cat:'model',   title:'DeepSeek-R1',
    body:'Open reasoning model rattles US frontier labs. The "DeepSeek moment".' },
  { date:'2025-02-19', cat:'network', title:'dTAO goes live',
    body:'Every subnet gets its own α-token with its own price. Markets-within-markets.' },
  { date:'2025-03-12', cat:'subnet',  title:'SN64 Chutes launches',
    body:'Rayon Labs ships verifiable serverless functions on Bittensor.' },
  { date:'2025-05-22', cat:'model',   title:'Claude 4 family',
    body:'Anthropic Opus / Sonnet 4, the first models with the new long-horizon agent benchmarks.' },
  { date:'2025-08-07', cat:'model',   title:'GPT-5',
    body:'OpenAI ships the reasoning-by-default flagship.' },
  { date:'2025-09-19', cat:'network', title:'τ halving #2',
    body:'Second halving lands; emissions per subnet recalculate.' },
  { date:'2025-11-04', cat:'subnet',  title:'SN56 Gradients passes τ150/day',
    body:'No-code finetune subnet becomes the second-largest emitter after Apex.' },

  /* ===== 2026 ===== */
  { date:'2026-01-15', cat:'model',   title:'Gemini 3 Pro',
    body:'Google DeepMind closes the gap on Claude/GPT with the integrated stack.' },
  { date:'2026-02-04', cat:'model',   title:'GPT-5.1',
    body:'OpenAI iterates on reasoning, ships the agent tier.' },
  { date:'2026-03-11', cat:'model',   title:'Claude Opus 4.7',
    body:'Anthropic ships the current frontier flagship, top of LMSYS Arena.' },
  { date:'2026-03-28', cat:'model',   title:'DeepSeek-R3',
    body:'Open-weight reasoning narrows the closed-source lead again.' },
  { date:'2026-04-08', cat:'model',   title:'Llama 5 · 405B',
    body:'Meta ships the largest open-weight foundation model to date.' },
  { date:'2026-04-22', cat:'subnet',  title:'92 active subnets',
    body:'Network passes a milestone, most active subnets in Bittensor history.' },
  { date:'2026-05-13', cat:'network', title:'Today',
    body:'You are here. Issue 014 of Subneτ Magazine is live.' },
]);

/** Numeric epoch ms for an event, derived from its ISO date. */
export function eventMs(e){ return Date.parse(e.date + 'T00:00:00Z'); }

/** Brand color for each category, used by the Timeline chart. */
export const EVENT_COLORS = Object.freeze({
  network: '#FF1E3C',     // primary red
  subnet:  '#FF8C42',     // amber
  model:   '#00C2FF',     // cyan (the "centralized world")
  market:  '#FFD166',     // gold
});

/** Plain-English category label. */
export const EVENT_LABELS = Object.freeze({
  network: 'Network',
  subnet:  'Subnet',
  model:   'Frontier Model',
  market:  'Market',
});
