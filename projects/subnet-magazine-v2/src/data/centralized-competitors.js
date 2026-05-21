/* =================================================================
   SUBNET MAGAZINE — CENTRALIZED COMPETITORS DATASET
   -----------------------------------------------------------------
   Per Rondo 2026-05-21: "when a person chooses a particular subnet
   chart to look at the articles in the side panels should be the
   centralized competitor articles or subjects. comparison data
   etc."

   This module maps every Bittensor SUBNET CATEGORY (text, vision,
   audio, video, multimodal, training, data, search, finance,
   agents, robotics, science, infra, prediction) to the centralized
   AI / hardware / finance / infra companies that compete in the
   same problem space. The cockpit's chart sidebar uses
   `competitorsForSubnet(s)` to render the VS COMPARISON stat row
   alongside the editorial cards — readers see the subnet's mcap
   in τ side-by-side with its closest centralized rivals' mcap in
   $, framing the subnet's competitive position the way an
   institutional analyst would.

   PRICING CONVENTION
   ------------------
   - Centralized companies → dollars ($) — per [[feedback-subnets-
     in-tao]] this is the correct register for non-subnet entities.
   - Mcaps are stored as a number of DOLLARS (not B/M units) so
     the renderer can format consistently (e.g. $157B, $3.4T).
   - Public-market caps + private-round valuations both qualify;
     the `source` field distinguishes them for the reader.

   DATA SOURCE + REFRESH STRATEGY
   ------------------------------
   This file is currently HAND-CURATED with mid-2026 valuations.
   Numbers are approximate but reflect publicly-reported figures
   from S&P (public companies) and last-known funding rounds
   (private companies). For high coding standards per
   [[feedback-high-coding-standards]], the architecture is built
   so a live data source (e.g. an equities API + a private-market
   valuation feed) can replace the static `COMPETITORS` map by
   publishing to a future `tao:competitors` DataLayer channel.
   When that channel ships, views subscribe to it instead of
   importing this module directly. Until then, this static seed
   is the floor.

   ADDING / UPDATING COMPETITORS
   -----------------------------
   1. Add a row to `COMPETITORS` with: id (kebab-case slug), name
      (display), ticker ('PRIVATE' or stock ticker), mcap (in $,
      not abbreviated), source ('public' | 'private'), sectors
      (array of CategoryKey values from subnets.js), url, why
      (short reason this is a competitor for that sector).
   2. The sectors array drives matching — a subnet of `cat: 'text'`
      pulls every competitor that has 'text' in its sectors list.
   3. If a competitor spans many sectors (Microsoft, Google), list
      ALL relevant ones — the picker prioritizes by mcap when
      multiple match.

   USAGE
   -----
   In a view that knows the active subnet `s`:

     import { competitorsForSubnet } from '../data/centralized-competitors.js';
     const rivals = competitorsForSubnet(s);            // top 3
     const rivals = competitorsForSubnet(s, { limit: 1 }); // top 1

   Returns an array of competitor objects sorted by mcap desc,
   already filtered to those matching the subnet's `cat`. Empty
   array if no match — render an empty-state.
   ================================================================= */

/**
 * @typedef {Object} Competitor
 * @prop {string}   id        Stable kebab-case slug (e.g. 'openai').
 * @prop {string}   name      Display name (e.g. 'OpenAI').
 * @prop {string}   ticker    Stock ticker OR 'PRIVATE' for unlisted.
 * @prop {number}   mcap      Market cap / latest valuation in USD (raw, e.g. 157_000_000_000).
 * @prop {('public'|'private')} source  Where the mcap comes from.
 * @prop {string[]} sectors   CategoryKey values this competitor plays in.
 * @prop {string}   url       Link to the company / news search.
 * @prop {string}   why       Short reason this is a competitor in those sectors.
 */

/** @type {Competitor[]} */
export const COMPETITORS = [
  /* ---------- chat / LLM / reasoning ---------- */
  {
    id: 'openai',
    name: 'OpenAI',
    ticker: 'PRIVATE',
    mcap: 157_000_000_000,   // $157B last reported round
    source: 'private',
    sectors: ['text', 'multimodal', 'training', 'agents', 'search', 'audio', 'video', 'science'],
    url: 'https://openai.com',
    why: 'GPT-4o, o1, o3-mini reasoning, Operator agents, Sora video, Whisper audio — the closest competitor to nearly every Bittensor subnet building general-purpose AI.',
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    ticker: 'PRIVATE',
    mcap: 60_000_000_000,    // $60B last reported
    source: 'private',
    sectors: ['text', 'multimodal', 'agents', 'training', 'science'],
    url: 'https://www.anthropic.com',
    why: 'Claude 3.7/4 family, Computer Use agents — a frontier-lab competitor for any reasoning / agent subnet.',
  },
  {
    id: 'google',
    name: 'Google (Alphabet)',
    ticker: 'GOOG',
    mcap: 2_100_000_000_000, // $2.1T
    source: 'public',
    sectors: ['text', 'multimodal', 'search', 'training', 'vision', 'video', 'agents', 'science', 'infra'],
    url: 'https://abc.xyz',
    why: 'Gemini, AlphaFold, Search, Cloud TPU, DeepMind — the broadest centralized competitor across nearly every subnet space.',
  },
  {
    id: 'meta',
    name: 'Meta',
    ticker: 'META',
    mcap: 1_700_000_000_000, // $1.7T
    source: 'public',
    sectors: ['text', 'multimodal', 'training', 'vision', 'video', 'agents'],
    url: 'https://about.meta.com',
    why: 'Llama 3/4 open weights, FAIR research, AI Studio, Reality Labs — direct competitor for open-source training + multimodal subnets.',
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    ticker: 'MSFT',
    mcap: 3_400_000_000_000, // $3.4T
    source: 'public',
    sectors: ['text', 'multimodal', 'infra', 'agents', 'training'],
    url: 'https://www.microsoft.com',
    why: 'Azure compute, Copilot, deep OpenAI partnership — main centralized rival in infra + reasoning.',
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    ticker: 'PRIVATE',
    mcap: 6_000_000_000,
    source: 'private',
    sectors: ['text', 'training'],
    url: 'https://mistral.ai',
    why: 'Open-weights European LLM lab — competitor for any pretraining / fine-tuning subnet.',
  },
  {
    id: 'cohere',
    name: 'Cohere',
    ticker: 'PRIVATE',
    mcap: 5_500_000_000,
    source: 'private',
    sectors: ['text', 'multimodal', 'agents'],
    url: 'https://cohere.com',
    why: 'Enterprise LLM + Command R reasoning — overlaps with text + agent subnets.',
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    ticker: 'PRIVATE',
    mcap: 9_000_000_000,
    source: 'private',
    sectors: ['search', 'text', 'agents'],
    url: 'https://www.perplexity.ai',
    why: 'AI-native search engine, sourced answers — direct competitor for search + retrieval subnets.',
  },

  /* ---------- vision / image / video ---------- */
  {
    id: 'stability-ai',
    name: 'Stability AI',
    ticker: 'PRIVATE',
    mcap: 1_000_000_000,
    source: 'private',
    sectors: ['vision', 'video'],
    url: 'https://stability.ai',
    why: 'Stable Diffusion family, open-weights image generation — competitor for vision subnets.',
  },
  {
    id: 'runway',
    name: 'Runway',
    ticker: 'PRIVATE',
    mcap: 3_000_000_000,
    source: 'private',
    sectors: ['video', 'vision'],
    url: 'https://runwayml.com',
    why: 'Gen-3 video model, creator-tools — competitor for video generation subnets.',
  },

  /* ---------- audio / voice ---------- */
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    ticker: 'PRIVATE',
    mcap: 3_000_000_000,
    source: 'private',
    sectors: ['audio'],
    url: 'https://elevenlabs.io',
    why: 'Frontier text-to-speech + voice cloning — main rival for voice / audio subnets.',
  },
  {
    id: 'suno',
    name: 'Suno',
    ticker: 'PRIVATE',
    mcap: 500_000_000,
    source: 'private',
    sectors: ['audio'],
    url: 'https://suno.com',
    why: 'AI music generation — overlap with creative audio subnets.',
  },

  /* ---------- infra / compute / GPU ---------- */
  {
    id: 'nvidia',
    name: 'NVIDIA',
    ticker: 'NVDA',
    mcap: 3_000_000_000_000, // $3.0T
    source: 'public',
    sectors: ['infra', 'training'],
    url: 'https://www.nvidia.com',
    why: 'GPU monopoly + CUDA — the centralized compute giant every decentralized compute subnet is unbundling.',
  },
  {
    id: 'amd',
    name: 'AMD',
    ticker: 'AMD',
    mcap: 220_000_000_000,
    source: 'public',
    sectors: ['infra', 'training'],
    url: 'https://www.amd.com',
    why: "MI300X + ROCm, NVIDIA's closest centralized rival — relevant for compute subnets.",
  },
  {
    id: 'coreweave',
    name: 'CoreWeave',
    ticker: 'CRWV',
    mcap: 23_000_000_000,
    source: 'public',
    sectors: ['infra'],
    url: 'https://www.coreweave.com',
    why: 'GPU cloud unicorn IPO\'d 2025 — direct comparable for decentralized GPU subnets.',
  },
  {
    id: 'lambda-labs',
    name: 'Lambda Labs',
    ticker: 'PRIVATE',
    mcap: 1_500_000_000,
    source: 'private',
    sectors: ['infra'],
    url: 'https://lambdalabs.com',
    why: 'On-demand GPU cluster — competitor for compute / training subnets.',
  },

  /* ---------- data / labeling / RAG ---------- */
  {
    id: 'scale-ai',
    name: 'Scale AI',
    ticker: 'PRIVATE',
    mcap: 14_000_000_000,
    source: 'private',
    sectors: ['data', 'training'],
    url: 'https://scale.com',
    why: 'Human data labeling at scale — competitor for data + RLHF subnets.',
  },
  {
    id: 'hugging-face',
    name: 'Hugging Face',
    ticker: 'PRIVATE',
    mcap: 4_500_000_000,
    source: 'private',
    sectors: ['data', 'training', 'text', 'multimodal'],
    url: 'https://huggingface.co',
    why: 'Model + dataset hub — competitor for any subnet distributing weights / data.',
  },
  {
    id: 'snowflake',
    name: 'Snowflake',
    ticker: 'SNOW',
    mcap: 60_000_000_000,
    source: 'public',
    sectors: ['data'],
    url: 'https://www.snowflake.com',
    why: 'Cloud data warehouse — adjacent competitor for data subnets.',
  },
  {
    id: 'databricks',
    name: 'Databricks',
    ticker: 'PRIVATE',
    mcap: 62_000_000_000,
    source: 'private',
    sectors: ['data', 'training'],
    url: 'https://www.databricks.com',
    why: 'Lakehouse + Mosaic ML — competitor for data and training subnets.',
  },

  /* ---------- robotics / embodied ---------- */
  {
    id: 'tesla',
    name: 'Tesla (Optimus)',
    ticker: 'TSLA',
    mcap: 700_000_000_000,
    source: 'public',
    sectors: ['robotics'],
    url: 'https://www.tesla.com/AI',
    why: 'Optimus humanoid + FSD — broadest centralized robotics program.',
  },
  {
    id: 'figure-ai',
    name: 'Figure AI',
    ticker: 'PRIVATE',
    mcap: 2_600_000_000,
    source: 'private',
    sectors: ['robotics'],
    url: 'https://www.figure.ai',
    why: 'Humanoid robot startup — direct rival for robotics subnets.',
  },
  {
    id: 'boston-dynamics',
    name: 'Boston Dynamics',
    ticker: 'PRIVATE', // under Hyundai
    mcap: 1_100_000_000,
    source: 'private',
    sectors: ['robotics'],
    url: 'https://www.bostondynamics.com',
    why: 'Atlas + Spot — the canonical centralized robotics shop.',
  },

  /* ---------- science / bio ---------- */
  {
    id: 'deepmind-science',
    name: 'Google DeepMind',
    ticker: 'GOOG',   // rolled up under Alphabet
    mcap: 2_100_000_000_000,
    source: 'public',
    sectors: ['science', 'training'],
    url: 'https://deepmind.google',
    why: 'AlphaFold, AlphaGenome — main centralized scientific-AI rival.',
  },
  {
    id: 'atomwise',
    name: 'Atomwise',
    ticker: 'PRIVATE',
    mcap: 300_000_000,
    source: 'private',
    sectors: ['science'],
    url: 'https://www.atomwise.com',
    why: 'Centralized AI drug discovery — competitor for science subnets.',
  },

  /* ---------- finance / trading ---------- */
  {
    id: 'citadel',
    name: 'Citadel',
    ticker: 'PRIVATE',
    mcap: 70_000_000_000,
    source: 'private',
    sectors: ['finance'],
    url: 'https://www.citadel.com',
    why: 'Hedge fund + market maker, AI-driven alpha — competitor for trading subnets.',
  },
  {
    id: 'coinbase',
    name: 'Coinbase',
    ticker: 'COIN',
    mcap: 60_000_000_000,
    source: 'public',
    sectors: ['finance'],
    url: 'https://www.coinbase.com',
    why: 'Centralized crypto exchange — relevant for finance / trading subnets bridging DeFi.',
  },
  {
    id: 'binance',
    name: 'Binance',
    ticker: 'PRIVATE',
    mcap: 65_000_000_000,
    source: 'private',
    sectors: ['finance'],
    url: 'https://www.binance.com',
    why: 'Largest centralized crypto exchange — comparable for trading subnets.',
  },

  /* ---------- prediction markets ---------- */
  {
    id: 'polymarket',
    name: 'Polymarket',
    ticker: 'PRIVATE',
    mcap: 1_000_000_000,
    source: 'private',
    sectors: ['prediction'],
    url: 'https://polymarket.com',
    why: 'Onchain prediction market — closest comparable for prediction subnets.',
  },
  {
    id: 'kalshi',
    name: 'Kalshi',
    ticker: 'PRIVATE',
    mcap: 300_000_000,
    source: 'private',
    sectors: ['prediction'],
    url: 'https://kalshi.com',
    why: 'Regulated US event-contract exchange — competitor for prediction subnets.',
  },
];

/* Build a lookup index so competitorsForSubnet doesn't re-scan
   the full array on every call. Keyed by sector name → array
   of competitors that play in that sector, sorted by mcap desc
   so the highest-conviction comparables come out first. */
const BY_SECTOR = (() => {
  const idx = {};
  for (const c of COMPETITORS){
    for (const sector of c.sectors){
      (idx[sector] = idx[sector] || []).push(c);
    }
  }
  for (const sector in idx){
    idx[sector].sort((a, b) => b.mcap - a.mcap);
  }
  return idx;
})();

/**
 * Return the top centralized competitors for a given subnet.
 *
 * Matches by subnet.cat → competitors whose sectors include that
 * category, sorted by mcap descending. The caller's `limit` (default 3)
 * caps how many come back. Empty array if the subnet has no `cat`
 * field or no competitors are mapped to its sector.
 *
 * @param {{cat?: string}} s  Subnet object (or anything with `.cat`).
 * @param {{limit?: number}} [opts]  Caller options. `limit` defaults to 3.
 * @returns {Competitor[]} Up to `limit` competitors, sorted by mcap desc.
 */
export function competitorsForSubnet(s, opts = {}){
  const limit = Number.isFinite(opts.limit) ? opts.limit : 3;
  if (!s || !s.cat) return [];
  const sector = String(s.cat).toLowerCase();
  const matches = BY_SECTOR[sector];
  if (!matches || matches.length === 0) return [];
  return matches.slice(0, Math.max(0, limit));
}

/**
 * Format a competitor mcap for display — institutional register.
 * Trillions in $T, billions in $B, millions in $M, raw otherwise.
 * Always dollar-denominated because centralized companies aren't
 * priced in TAO (per [[feedback-subnets-in-tao]]).
 *
 * @param {number} m  Market cap in dollars (raw, not abbreviated).
 * @returns {string} Formatted display string.
 */
export function fmtCompetitorMcap(m){
  if (m == null || !Number.isFinite(m)) return '·';
  if (m >= 1e12) return '$' + (m / 1e12).toFixed(2) + 'T';
  if (m >= 1e9)  return '$' + (m / 1e9).toFixed(2)  + 'B';
  if (m >= 1e6)  return '$' + (m / 1e6).toFixed(1)  + 'M';
  return '$' + Math.round(m).toLocaleString('en-US');
}
