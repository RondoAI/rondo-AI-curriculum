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
 * @prop {number=}  delta24h  Last-known 24h price/mcap delta (%). Public companies only.
 *                              STATIC SNAPSHOT — live equities API not yet wired.
 *                              Private companies omit this field (rendered as "—").
 * @prop {string[]=} aliases  Optional alternate names / common short forms used
 *                              when matching centralized-news subjects → competitor.
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
    delta24h: 0.8,
    aliases: ['Alphabet', 'GOOGL', 'DeepMind'],
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
    delta24h: 1.4,
    aliases: ['Facebook', 'FAIR', 'Llama'],
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
    delta24h: 0.5,
    aliases: ['Azure', 'Copilot'],
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
    delta24h: 2.1,
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
    delta24h: -0.6,
  },
  {
    id: 'coreweave',
    name: 'CoreWeave',
    ticker: 'CRWV',
    mcap: 23_000_000_000,
    source: 'public',
    sectors: ['infra'],
    url: 'https://www.coreweave.com',
    why: "GPU cloud unicorn IPO'd 2025 — direct comparable for decentralized GPU subnets.",
    delta24h: 3.2,
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

  /* ---------- specialized LLM-inference shops (added 2026-05-21
     for per-subnet competitor depth — see Targon profile below) ---------- */
  {
    id: 'together-ai',
    name: 'Together AI',
    ticker: 'PRIVATE',
    mcap: 3_300_000_000,  // ~$3.3B last Series B
    source: 'private',
    sectors: ['text', 'training', 'multimodal'],
    url: 'https://www.together.ai',
    why: 'Open-model inference at $0.20/M tokens — direct competitor for Targon-style bandwidth-priced inference subnets.',
  },
  {
    id: 'fireworks-ai',
    name: 'Fireworks AI',
    ticker: 'PRIVATE',
    mcap: 552_000_000,
    source: 'private',
    sectors: ['text', 'multimodal'],
    url: 'https://fireworks.ai',
    why: 'Fast inference for open models with FireAttention — startup-favored low-latency endpoint provider.',
  },

  /* ---------- HFT / proprietary trading firms (added 2026-05-21
     for SN8 PTN profile — proprietary trading network) ---------- */
  {
    id: 'jane-street',
    name: 'Jane Street',
    ticker: 'PRIVATE',
    mcap: 60_000_000_000,    // private firm, NAV / public-data estimate
    source: 'private',
    sectors: ['finance'],
    url: 'https://www.janestreet.com',
    why: "Quant prop firm specializing in ETF arbitrage + crypto market-making — closest centralized comparable for PnL-scored trading subnets.",
    aliases: ['JaneStreet'],
  },
  {
    id: 'jump-trading',
    name: 'Jump Trading',
    ticker: 'PRIVATE',
    mcap: 40_000_000_000,
    source: 'private',
    sectors: ['finance'],
    url: 'https://www.jumptrading.com',
    why: 'Quant prop trading + crypto market-maker (Jump Crypto subsidiary) — alpha-generation rival to decentralized trading subnets.',
    aliases: ['Jump Crypto'],
  },
  {
    id: 'renaissance-tech',
    name: 'Renaissance Technologies',
    ticker: 'PRIVATE',
    mcap: 130_000_000_000,   // est. AUM-implied
    source: 'private',
    sectors: ['finance'],
    url: 'https://www.rentec.com',
    why: 'Medallion Fund — the canonical model-driven hedge fund. The brand decentralized trading subnets are unbundling.',
    aliases: ['RenTec', 'Medallion'],
  },
  {
    id: 'citadel-securities',
    name: 'Citadel Securities',
    ticker: 'PRIVATE',
    mcap: 30_000_000_000,    // distinct from Citadel HF
    source: 'private',
    sectors: ['finance'],
    url: 'https://www.citadelsecurities.com',
    why: 'Largest US equity market maker — distinct from Citadel hedge fund. Routes ~25% of US retail flow; the "structure" of centralized trading.',
    aliases: ['Citadel Securities'],
  },

  /* ---------- search engines (added 2026-05-21 for SN5 OpenKaito) ---------- */
  {
    id: 'you-com',
    name: 'You.com',
    ticker: 'PRIVATE',
    mcap: 900_000_000,
    source: 'private',
    sectors: ['search', 'text'],
    url: 'https://you.com',
    why: 'AI-first search engine with multimodal agents — direct rival for decentralized search + retrieval subnets.',
  },
  {
    id: 'brave-search',
    name: 'Brave Search',
    ticker: 'PRIVATE',
    mcap: 700_000_000,
    source: 'private',
    sectors: ['search'],
    url: 'https://search.brave.com',
    why: "Independent search index (not whitelabel Bing) with privacy positioning — closest non-Google rival for retrieval subnets.",
    aliases: ['Brave'],
  },

  /* ---------- consumer chat / roleplay (Apex + Dippy profiles) ---------- */
  {
    id: 'character-ai',
    name: 'Character.AI',
    ticker: 'PRIVATE',
    mcap: 5_000_000_000,
    source: 'private',
    sectors: ['text'],
    url: 'https://character.ai',
    why: 'Consumer persona + roleplay chat — main rival for engagement-scored dialogue subnets like SN11 Dippy.',
    aliases: ['CharacterAI'],
  },
  {
    id: 'replika',
    name: 'Replika',
    ticker: 'PRIVATE',
    mcap: 400_000_000,
    source: 'private',
    sectors: ['text'],
    url: 'https://replika.com',
    why: 'AI companion app — consumer-facing dialogue rival adjacent to subnet roleplay work.',
  },
  {
    id: 'ai-dungeon',
    name: 'AI Dungeon',
    ticker: 'PRIVATE',
    mcap: 50_000_000,
    source: 'private',
    sectors: ['text'],
    url: 'https://aidungeon.com',
    why: 'Generative text-RPG platform — pioneer of long-form roleplay AI, direct overlap with Dippy-style subnets.',
  },
  {
    id: 'novelai',
    name: 'NovelAI',
    ticker: 'PRIVATE',
    mcap: 80_000_000,
    source: 'private',
    sectors: ['text'],
    url: 'https://novelai.net',
    why: 'Subscription text + image creative-writing platform — roleplay-grade dialogue rival.',
  },

  /* ---------- inference + serverless GPU shops (Nous profile) ---------- */
  {
    id: 'replicate',
    name: 'Replicate',
    ticker: 'PRIVATE',
    mcap: 350_000_000,
    source: 'private',
    sectors: ['text', 'multimodal', 'training'],
    url: 'https://replicate.com',
    why: 'Model-as-a-service + fine-tuning runs on-demand — direct rival for finetuning-competition subnets.',
  },
  {
    id: 'modal-labs',
    name: 'Modal Labs',
    ticker: 'PRIVATE',
    mcap: 320_000_000,
    source: 'private',
    sectors: ['training', 'data'],
    url: 'https://modal.com',
    why: 'Serverless GPU compute + fine-tuning infra — startup-favored finetuning rival.',
    aliases: ['Modal'],
  },

  /* ---------- DeFi yield-strategy protocols (Sturdy profile) ---------- */
  {
    id: 'aave-labs',
    name: 'Aave',
    ticker: 'PRIVATE',
    mcap: 1_900_000_000, // protocol TVL-implied governance valuation
    source: 'private',
    sectors: ['finance'],
    url: 'https://aave.com',
    why: 'Largest lending protocol by TVL — DeFi yield base layer competing with subnet-generated yield strategies.',
    aliases: ['AAVE'],
  },
  {
    id: 'compound-finance',
    name: 'Compound',
    ticker: 'PRIVATE',
    mcap: 380_000_000,
    source: 'private',
    sectors: ['finance'],
    url: 'https://compound.finance',
    why: 'Algorithmic money-market protocol — original DeFi lending venue, competitor for yield-strategy subnets.',
  },
  {
    id: 'yearn-finance',
    name: 'Yearn Finance',
    ticker: 'PRIVATE',
    mcap: 220_000_000,
    source: 'private',
    sectors: ['finance'],
    url: 'https://yearn.fi',
    why: 'On-chain yield aggregator + vault strategies — closest direct comparable for Sturdy-style yield generation.',
    aliases: ['YFI', 'Yearn'],
  },
  {
    id: 'morpho-labs',
    name: 'Morpho',
    ticker: 'PRIVATE',
    mcap: 800_000_000,
    source: 'private',
    sectors: ['finance'],
    url: 'https://morpho.org',
    why: 'Permissionless lending optimizer — peer-to-peer rates on top of Aave/Compound, leading DeFi efficiency layer.',
  },

  /* ---------- staking infra providers (SubVortex profile) ---------- */
  {
    id: 'allnodes',
    name: 'Allnodes',
    ticker: 'PRIVATE',
    mcap: 80_000_000,
    source: 'private',
    sectors: ['infra'],
    url: 'https://www.allnodes.com',
    why: 'Hosted validator + node service for 70+ chains — direct rival for validator-as-a-service subnets.',
  },
  {
    id: 'stakefish',
    name: 'stakefish',
    ticker: 'PRIVATE',
    mcap: 120_000_000,
    source: 'private',
    sectors: ['infra'],
    url: 'https://stake.fish',
    why: 'Multi-chain validator infrastructure — primary centralized rival to decentralized staking subnets.',
  },
  {
    id: 'chorus-one',
    name: 'Chorus One',
    ticker: 'PRIVATE',
    mcap: 200_000_000,
    source: 'private',
    sectors: ['infra'],
    url: 'https://chorus.one',
    why: 'Institutional-grade staking + MEV research — premium-tier validator service.',
  },
  {
    id: 'figment',
    name: 'Figment',
    ticker: 'PRIVATE',
    mcap: 250_000_000,
    source: 'private',
    sectors: ['infra'],
    url: 'https://figment.io',
    why: 'Enterprise staking provider — services large institutional + treasury staking flows.',
  },

  /* ---------- zkml / zk-proof shops (Omron profile) ---------- */
  {
    id: 'modulus-labs',
    name: 'Modulus Labs',
    ticker: 'PRIVATE',
    mcap: 60_000_000,
    source: 'private',
    sectors: ['training', 'science'],
    url: 'https://www.moduluslabs.xyz',
    why: 'zkML proving infrastructure — verifiable ML inference + training. Direct rival for proof-of-training subnets like Omron.',
    aliases: ['Modulus'],
  },
  {
    id: 'polyhedra',
    name: 'Polyhedra Network',
    ticker: 'PRIVATE',
    mcap: 500_000_000,
    source: 'private',
    sectors: ['infra', 'training'],
    url: 'https://polyhedra.network',
    why: 'zkML + cross-chain ZK-proofs (expander prover) — credible competing approach for verifiable training subnets.',
  },
  {
    id: 'risc-zero',
    name: 'RISC Zero',
    ticker: 'PRIVATE',
    mcap: 350_000_000,
    source: 'private',
    sectors: ['infra', 'science'],
    url: 'https://risczero.com',
    why: 'General-purpose zkVM for verifiable computation — including ML inference. Foundation for zk-everything stack.',
  },

  /* ---------- image generation (Vision + Omega profiles, 2026-05-21) ---------- */
  {
    id: 'midjourney',
    name: 'Midjourney',
    ticker: 'PRIVATE',
    mcap: 8_000_000_000,
    source: 'private',
    sectors: ['vision'],
    url: 'https://www.midjourney.com',
    why: 'Frontier text-to-image with strongest brand recognition. Subscription-only, no API — closed-platform rival to open generative subnets.',
  },
  {
    id: 'openai-sora',
    name: 'OpenAI Sora',
    ticker: 'PRIVATE',
    mcap: 157_000_000_000, // rolled up under OpenAI parent
    source: 'private',
    sectors: ['video'],
    url: 'https://openai.com/sora',
    why: "Sora 2 frontier text-to-video. Built on OpenAI's compute. The benchmark a decentralized video subnet competes against on quality.",
    aliases: ['Sora'],
  },

  /* ---------- agent / browser automation (Web Genie profile) ---------- */
  {
    id: 'adept-ai',
    name: 'Adept AI',
    ticker: 'PRIVATE',
    mcap: 1_000_000_000,
    source: 'private',
    sectors: ['agents'],
    url: 'https://www.adept.ai',
    why: 'ACT-1 + Fuyu browser agents — original pure-play agent lab (acquired-hired by Amazon 2024 but team continues). The benchmark for browser-using agent subnets.',
  },

  /* ---------- prediction-market platforms (Foresight profile) ----------
     polymarket + kalshi already in COMPETITORS above; nothing new here.
     ---------- */

  /* ---------- adtech / attribution (BitAds profile, 2026-05-21) ---------- */
  {
    id: 'trade-desk',
    name: 'The Trade Desk',
    ticker: 'TTD',
    mcap: 60_000_000_000,
    source: 'public',
    sectors: ['finance'],
    url: 'https://www.thetradedesk.com',
    why: 'Independent demand-side ad platform — the largest "neutral" centralized adtech, post-cookie targeting via UID2 + measurement. Closest non-walled-garden rival for decentralized attribution subnets.',
    delta24h: 1.1,
    aliases: ['TTD'],
  },
  {
    id: 'applovin',
    name: 'AppLovin',
    ticker: 'APP',
    mcap: 100_000_000_000,
    source: 'public',
    sectors: ['finance'],
    url: 'https://www.applovin.com',
    why: 'Mobile-app ad network + AXON engine — best-performing centralized adtech of 2025 by ROI. Direct rival for any subnet attribution measurement at scale.',
    delta24h: 2.4,
  },

  /* ---------- entity resolution / graph data (Palaidn profile) ---------- */
  {
    id: 'palantir',
    name: 'Palantir',
    ticker: 'PLTR',
    mcap: 250_000_000_000,
    source: 'public',
    sectors: ['data', 'finance'],
    url: 'https://www.palantir.com',
    why: 'Foundry + AIP — defense + commercial entity-resolution and analytics platform. Dominant centralized rival for graph-data subnets.',
    delta24h: 1.8,
    aliases: ['PLTR'],
  },
  {
    id: 'quantexa',
    name: 'Quantexa',
    ticker: 'PRIVATE',
    mcap: 2_600_000_000,
    source: 'private',
    sectors: ['data', 'finance'],
    url: 'https://www.quantexa.com',
    why: 'Decision-intelligence + KYC graph platform — banking + insurance customers. Direct comparable for entity-resolution data subnets.',
  },

  /* ---------- LLM evaluation / red-teaming (De-Val profile) ---------- */
  {
    id: 'robust-intelligence',
    name: 'Robust Intelligence',
    ticker: 'PRIVATE', // Cisco acquisition Aug 2024
    mcap: 500_000_000,
    source: 'private',
    sectors: ['text'],
    url: 'https://www.robustintelligence.com',
    why: 'AI security + adversarial validation platform (acquired by Cisco 2024). Enterprise red-teaming + model testing — direct centralized rival for LLM-evaluation subnets.',
  },
  {
    id: 'lakera',
    name: 'Lakera',
    ticker: 'PRIVATE',
    mcap: 100_000_000,
    source: 'private',
    sectors: ['text'],
    url: 'https://www.lakera.ai',
    why: 'Prompt-injection + LLM security firm. Self-serve product (Lakera Guard) for adversarial testing — startup-favored evaluation rival.',
  },
  {
    id: 'patronus-ai',
    name: 'Patronus AI',
    ticker: 'PRIVATE',
    mcap: 50_000_000,
    source: 'private',
    sectors: ['text'],
    url: 'https://www.patronus.ai',
    why: 'Automated LLM evaluation + hallucination detection. Founded by Meta AI researchers — emerging rival for benchmark/eval subnets.',
  },

  /* ---------- mobile / on-device AI silicon (EdgeMaxxing profile) ---------- */
  {
    id: 'qualcomm',
    name: 'Qualcomm',
    ticker: 'QCOM',
    mcap: 180_000_000_000,
    source: 'public',
    sectors: ['infra'],
    url: 'https://www.qualcomm.com',
    why: 'Snapdragon NPU + Hexagon AI Engine — dominant Android-side on-device AI silicon. The benchmark for mobile inference subnets.',
    delta24h: 0.6,
    aliases: ['QCOM', 'Snapdragon'],
  },
  {
    id: 'apple-neural-engine',
    name: 'Apple Neural Engine',
    ticker: 'AAPL',
    mcap: 3_500_000_000_000,
    source: 'public',
    sectors: ['infra'],
    url: 'https://www.apple.com',
    why: 'A-series + M-series Neural Engine — vertically integrated mobile + laptop AI silicon. The on-device AI moat decentralized inference subnets compete against.',
    delta24h: 0.9,
    aliases: ['Apple Silicon', 'AAPL', 'Neural Engine'],
  },
  {
    id: 'mediatek',
    name: 'MediaTek',
    ticker: 'PRIVATE',
    mcap: 80_000_000_000,
    source: 'private',
    sectors: ['infra'],
    url: 'https://www.mediatek.com',
    why: 'Dimensity APU — Android mid-range + emerging-market dominance. Volume leader in mobile AI silicon by units shipped.',
  },

  /* ---------- AI-content detection / provenance (Bitmind + Bitmind FM) ---------- */
  {
    id: 'hive-ai',
    name: 'Hive AI',
    ticker: 'PRIVATE',
    mcap: 2_000_000_000,
    source: 'private',
    sectors: ['vision', 'data'],
    url: 'https://thehive.ai',
    why: 'Centralized AI moderation + deepfake detection — enterprise customers (Reddit, NBCU, etc.). Closest rival for synthetic-content detection subnets.',
  },
  {
    id: 'adobe',
    name: 'Adobe',
    ticker: 'ADBE',
    mcap: 220_000_000_000,
    source: 'public',
    sectors: ['vision', 'video'],
    url: 'https://www.adobe.com',
    why: 'Creative Cloud + Firefly generative + C2PA Content Credentials provenance. Major centralized stake in image / video AI + content attribution.',
    delta24h: -0.4,
    aliases: ['ADBE', 'Firefly'],
  },
];

/* =================================================================
   SUPPLY CHAIN ENTITIES (2026-05-21 / [[feedback-competitor-depth]])
   -----------------------------------------------------------------
   The upstream layer that every centralized AI rival depends on —
   GPU manufacturers, chip fabs, HBM memory makers, hyperscale
   cloud providers, power utilities. Surfacing this on a subnet's
   VS comparison block is the magazine's institutional edge: not
   "Subnet X vs Microsoft (mcap)" but "Subnet X vs CoreWeave, plus
   the NVIDIA + TSMC supply chain that locks CoreWeave's growth."

   Some entities (NVIDIA, AMD) ALSO appear in COMPETITORS for the
   `infra` sector — they play dual roles. Here they're the
   upstream supplier; there they'd be the rival for a decentralized
   GPU subnet. The role depends on which subnet is viewing them.

   @typedef {Object} SupplyChainEntity
   @prop {string} id       Stable slug
   @prop {string} name     Display
   @prop {string} ticker   Stock ticker / 'PRIVATE'
   @prop {number} mcap     Mcap in USD (raw, optional)
   @prop {string} role     One-line role description (e.g. 'GPU manufacturer')
   @prop {string} layer    Coarse layer: 'silicon' | 'memory' | 'cloud' | 'power' | 'water'
   @prop {string} url      Company / reference link
   @prop {string} why      Why this matters for the AI compute stack
   ================================================================= */
/** @type {SupplyChainEntity[]} */
export const SUPPLY_CHAIN = [
  {
    id: 'nvidia',
    name: 'NVIDIA',
    ticker: 'NVDA',
    mcap: 3_000_000_000_000,
    role: 'GPU manufacturer',
    layer: 'silicon',
    url: 'https://www.nvidia.com',
    why: 'H100 / H200 / Blackwell (B100/B200) GPUs power ~95% of frontier AI training + inference. CUDA moat. The single largest upstream dependency.',
  },
  {
    id: 'amd',
    name: 'AMD',
    ticker: 'AMD',
    mcap: 220_000_000_000,
    role: 'GPU manufacturer (alt)',
    layer: 'silicon',
    url: 'https://www.amd.com',
    why: 'MI300X / MI325X — credible NVIDIA alternative gaining hyperscaler design wins (Microsoft, Meta). ROCm software stack still trails CUDA.',
  },
  {
    id: 'tsmc',
    name: 'TSMC',
    ticker: 'TSM',
    mcap: 1_050_000_000_000,
    role: 'Chip fabrication',
    layer: 'silicon',
    url: 'https://www.tsmc.com',
    why: 'Sole-source fab for NVIDIA + AMD AI silicon. N3 / N2 nodes. Geographic risk: Taiwan-strait. Capacity bottleneck is CoWoS packaging, not silicon.',
  },
  {
    id: 'sk-hynix',
    name: 'SK Hynix',
    ticker: 'PRIVATE',  // KRX-listed, treat as private for our register
    mcap: 130_000_000_000,
    role: 'HBM3e memory',
    layer: 'memory',
    url: 'https://www.skhynix.com',
    why: 'Dominant supplier of HBM3e high-bandwidth memory stacks for H100 / H200 / B200. Capacity has been the binding constraint on GPU output since 2024.',
  },
  {
    id: 'micron',
    name: 'Micron',
    ticker: 'MU',
    mcap: 145_000_000_000,
    role: 'HBM3e memory (alt)',
    layer: 'memory',
    url: 'https://www.micron.com',
    why: 'Second HBM3e supplier ramping FY26. Diversifies HBM supply away from SK Hynix concentration risk.',
  },
  {
    id: 'aws-azure-gcp',
    name: 'AWS / Azure / GCP',
    ticker: 'AMZN / MSFT / GOOG',
    mcap: 6_500_000_000_000,  // rough combined relevant cap
    role: 'Hyperscale GPU hosting',
    layer: 'cloud',
    url: 'https://aws.amazon.com',
    why: 'Top 3 hyperscalers reportedly hold ~80% of FY26 H100 / B200 allocations from NVIDIA. Every centralized inference shop competes for the remaining ~20%.',
  },
  {
    id: 'us-power-grids',
    name: 'US datacenter power',
    ticker: '—',
    mcap: null,
    role: 'Electricity supply',
    layer: 'power',
    url: 'https://www.eia.gov',
    why: 'AI datacenter load forecast +50% by 2030 (EIA estimate). US-East (Virginia) + US-Central (Texas) are the load-growth hot spots; siting + interconnect queue 2-4 years.',
  },

  /* ---------- financial-market supply chain (added 2026-05-21
     for SN8 PTN profile) ---------- */
  {
    id: 'bloomberg-feed',
    name: 'Bloomberg Terminal',
    ticker: '—',
    mcap: 60_000_000_000,    // Bloomberg LP est. valuation
    role: 'Market data feed',
    layer: 'data',
    url: 'https://www.bloomberg.com/professional',
    why: '~$30K/terminal/year for institutional data + IB messaging. ~325K terminals deployed. The data substrate every centralized prop shop depends on.',
  },
  {
    id: 'colo-nj4-ld4',
    name: 'NJ4 / LD4 colocation',
    ticker: '—',
    mcap: null,
    role: 'HFT colocation',
    layer: 'cloud',
    url: 'https://www.equinix.com',
    why: 'Equinix NY4/NJ2/NJ4 (Secaucus) + LD4 (London) — the rack space within microseconds of the NYSE/NASDAQ/CME match engines. Multi-year waitlist; the binding constraint on HFT capacity.',
  },
  {
    id: 'cme-nyse-access',
    name: 'CME / NYSE / NASDAQ',
    ticker: '—',
    mcap: null,
    role: 'Exchange match engines',
    layer: 'data',
    url: 'https://www.cmegroup.com',
    why: 'Direct market access for matched-trade execution. Co-listing fees + data licensing + microwave-link bandwidth are the gating costs no centralized prop firm can opt out of.',
  },

  /* ---------- search supply chain (added 2026-05-21 for OpenKaito) ---------- */
  {
    id: 'web-crawl-infra',
    name: 'Web crawl infra',
    ticker: '—',
    mcap: null,
    role: 'Petabyte crawl + index',
    layer: 'cloud',
    url: 'https://commoncrawl.org',
    why: 'Common Crawl + custom S3 / GCS petabyte indexes. Google built theirs over 25 years; new entrants either rebuild (multi-year capex) or rent indexing slots.',
  },
  {
    id: 'cloudflare-edge',
    name: 'Cloudflare',
    ticker: 'NET',
    mcap: 50_000_000_000,
    role: 'Edge + CDN + DNS',
    layer: 'cloud',
    url: 'https://www.cloudflare.com',
    why: 'Routes ~20% of web traffic. Critical edge layer for any low-latency search/retrieval product — fronts requests before they reach the index.',
  },

  /* ---------- DeFi-yield supply chain (added 2026-05-21 for SN10 Sturdy) ---------- */
  {
    id: 'ethereum-l1-gas',
    name: 'Ethereum L1 gas',
    ticker: '—',
    mcap: null,
    role: 'Transaction settlement',
    layer: 'data',
    url: 'https://ethereum.org',
    why: 'Mainnet gas fees set the floor on yield-strategy economics. Every DeFi yield protocol pays per-transaction; the on-chain cost determines which strategies stay viable below a yield threshold.',
  },
  {
    id: 'chainlink-oracles',
    name: 'Chainlink',
    ticker: 'PRIVATE',
    mcap: 8_500_000_000,
    role: 'Price oracles',
    layer: 'data',
    url: 'https://chain.link',
    why: 'Dominant oracle network. Every DeFi yield strategy depends on price oracle accuracy + uptime; oracle manipulation is the canonical attack vector.',
  },

  /* ---------- staking infra substrate (added 2026-05-21 for SN7 SubVortex) ---------- */
  {
    id: 'bare-metal-hosts',
    name: 'Bare-metal hosting',
    ticker: '—',
    mcap: null,
    role: 'Dedicated server fleet',
    layer: 'cloud',
    url: 'https://www.hetzner.com',
    why: 'Hetzner / OVH / Latitude — physical servers most staking operators rent for dedicated CPU/memory. Cheaper than hyperscaler VMs but locked to specific regions.',
  },

  /* ---------- zkml supply substrate (added 2026-05-21 for SN2 Omron) ---------- */
  {
    id: 'eth-verifier-gas',
    name: 'Ethereum verifier gas',
    ticker: '—',
    mcap: null,
    role: 'ZK proof verification',
    layer: 'data',
    url: 'https://ethereum.org',
    why: 'On-chain verification of zk-proofs costs gas — Groth16 ~280K gas, PLONK ~400K, STARK higher. The proof-shape choice trades off prover time for verifier cost.',
  },
];

/* =================================================================
   BY_NETUID — per-subnet competitor profile (2026-05-21)
   -----------------------------------------------------------------
   Hand-curated for the subnets the editorial desk has profiled in
   depth. Each entry maps a netuid to:
     - rivals[]:        ids from COMPETITORS (direct rivals)
     - supplyChainIds[]: ids from SUPPLY_CHAIN (upstream deps)
     - constraints[]:   physical-world bottleneck rows specific to
                        the kind of work this subnet competes for

   Unprofiled subnets fall back to BY_SECTOR (mcap-sorted, generic).
   When a subnet gets profiled, ADD an entry here and the cockpit
   sidebar automatically picks up the deeper register.
   ================================================================= */
export const BY_NETUID = {
  /* SN1 Apex — open-domain text prompting and inference. The
     consumer-chat register: a reader picking this subnet is
     comparing against ChatGPT, Claude, Gemini, Perplexity. */
  1: {
    rivals: ['openai', 'anthropic', 'google', 'perplexity', 'cohere'],
    supplyChainIds: ['nvidia', 'tsmc', 'sk-hynix', 'aws-azure-gcp', 'us-power-grids'],
    constraints: [
      {
        label: 'Frontier-model training cost',
        value: '~$100–500M per run',
        note: 'GPT-4 class run = ~$100M reported. Anthropic+OAI+Google each running multiple per year. Decentralized open-prompting subnets cannot match this raw capex; they compete on routing + RLHF cost asymmetry.',
      },
      {
        label: 'Consumer ARPU',
        value: '$20/mo (Plus tier)',
        note: 'ChatGPT Plus / Claude Pro / Gemini Advanced all at ~$20/mo. High churn (~40% trial-to-paid). Open-prompting subnets sidestep ARPU entirely by emission rewards.',
      },
      {
        label: 'Inference token economics',
        value: '$0.50–$2.00 / M tokens',
        note: 'GPT-4o + Claude 4 premium-tier ranges. Decentralized prompting at the same quality competes on per-token cost ratio.',
      },
      {
        label: 'RLHF data dependency',
        value: 'Scale AI / Surge concentration',
        note: 'Frontier labs source human RLHF data from a small set of vendors. A bottleneck centralized rivals cannot fully unbundle; subnet alternative is open-weights + community evals.',
      },
      {
        label: 'Brand recognition moat',
        value: 'GPT / Claude / Gemini',
        note: 'Top-tier consumer brand recognition. The decentralized prompting subnet competes on developer / institutional read, not consumer name.',
      },
    ],
  },

  /* SN4 Targon — bandwidth-priced LLM inference with deterministic
     verifiers. The flagship "decentralize the inference market"
     subnet. Profiled 2026-05-21 as the prototype for this depth
     pattern. */
  4: {
    rivals: ['coreweave', 'together-ai', 'fireworks-ai', 'lambda-labs'],
    supplyChainIds: ['nvidia', 'tsmc', 'sk-hynix', 'aws-azure-gcp', 'us-power-grids'],
    constraints: [
      {
        label: 'H100 supply lock',
        value: '~80% to top 3 hyperscalers',
        note: 'NVIDIA H100 / B200 allocation, leaving ~20% for specialized inference shops + everyone else.',
      },
      {
        label: 'Power per H100',
        value: '~700W sustained',
        note: 'Plus ~1.3× PUE overhead — ~910W wall-power per GPU in a typical datacenter.',
      },
      {
        label: '10K-GPU cluster capex',
        value: '~$400M',
        note: '~$40K per H100 × 10,000 GPUs. Excludes interconnect, power infrastructure, building.',
      },
      {
        label: 'FY26 H100 wait time',
        value: '6–12 months',
        note: 'Non-priority customers; hyperscalers cleared by NVIDIA quarterly.',
      },
      {
        label: 'Inference token economics',
        value: '$0.50–$2.00 / M tokens',
        note: 'Centralized premium-model pricing range. Open-model shops (Together, Fireworks) run $0.20–$0.80.',
      },
    ],
  },

  /* SN5 OpenKaito — decentralized web search + retrieval, scored
     against ground-truth queries. The rival landscape here is
     SEARCH ENGINES — Google's dominance plus the AI-native
     newcomers (Perplexity, You.com) and the privacy-positioned
     alternatives (Brave). */
  5: {
    rivals: ['google', 'perplexity', 'you-com', 'brave-search'],
    supplyChainIds: ['nvidia', 'aws-azure-gcp', 'web-crawl-infra', 'cloudflare-edge', 'us-power-grids'],
    constraints: [
      {
        label: "Google's index moat",
        value: '~25 years of crawl',
        note: 'Google has been indexing the web since 1998. New entrants either rebuild from scratch (multi-year capex) or rent indexing slots via Bing API (which Microsoft just hiked 9× in 2024).',
      },
      {
        label: 'Crawl budget vs freshness',
        value: 'Sites get ~hourly to ~weekly visits',
        note: "A site's perceived freshness depends on how often the crawler returns. Crawl-budget allocation is a perpetual fairness problem; decentralized retrieval can in theory parallelize it across miners.",
      },
      {
        label: 'Search ad ARPU',
        value: '~$300/year per US user',
        note: 'Google captures most of search ad revenue. Non-Google search depends on display ads or subscription — both materially smaller. Decentralized search sidesteps ARPU entirely via emission rewards.',
      },
      {
        label: 'AI overview cannibalization',
        value: '~15% blue-link CTR drop',
        note: "Google's AI Overviews compress clicks-to-source — publishers are seeing measurable traffic drops. Subnet alternative could route value back to source pages via direct payments.",
      },
      {
        label: 'Index hosting capex',
        value: 'Petabyte-class storage',
        note: 'Common Crawl alone is ~10PB. A live search index 10–100× that. AWS S3 + Cloudflare R2 at scale are the only realistic centralized hosts; subnet miners can shard.',
      },
    ],
  },

  /* SN8 PTN — Proprietary Trading Network: miners submit trades,
     scored on realized P&L. The rivals here are CENTRALIZED PROP
     SHOPS (Jane Street, Jump, Citadel Securities, Renaissance) +
     a supply chain that's specifically financial — colo space,
     market-data feeds, exchange access. NOT the AI-compute stack. */
  8: {
    rivals: ['jane-street', 'jump-trading', 'citadel-securities', 'renaissance-tech', 'citadel'],
    supplyChainIds: ['bloomberg-feed', 'colo-nj4-ld4', 'cme-nyse-access', 'aws-azure-gcp'],
    constraints: [
      {
        label: 'Colo rack scarcity',
        value: 'Multi-year waitlist at NJ4 / LD4',
        note: 'Racks within microseconds of NYSE/NASDAQ/CME match engines. Centralized prop firms own theirs outright; new entrants wait years or pay premium for sublease.',
      },
      {
        label: 'Bloomberg feed cost',
        value: '~$30K/year per terminal',
        note: 'Standard institutional data + IB messaging price. ~325K terminals deployed. Decentralized trading subnets bootstrap with public market data feeds (coarser, slower) — a structural cost asymmetry the subnet inherits.',
      },
      {
        label: 'Microwave-link bandwidth',
        value: 'Chicago-NYC lane saturated',
        note: 'McKay / Anova / Vigilant control the line-of-sight microwave links between CME (Chicago) and NJ4 (NYC) — the fastest market-data path between the two. New entrants buy capacity in the secondary market.',
      },
      {
        label: 'Alpha decay',
        value: 'Edge halves every ~6 months',
        note: 'Centralized prop firms run hundreds of strategies in parallel because each one decays. A subnet aggregates miner strategies — different inheritance of the same problem.',
      },
      {
        label: 'Regulatory capture risk',
        value: 'SEC + CFTC reporting',
        note: 'Centralized firms have compliance moats (CAT reporting, FINRA membership, sub-1ms timestamp accuracy). Decentralized trading must structure itself OUTSIDE this regime; legal ambiguity is the binding constraint.',
      },
    ],
  },

  /* SN2 Omron — On-chain proof-of-training (zkml) for verifiable
     model updates. The rivals are the small set of teams building
     zk-proof systems for ML — Modulus, Polyhedra, RISC Zero,
     EZKL. Supply chain is mostly Ethereum verifier gas + the GPU
     stack used during proving. */
  2: {
    rivals: ['modulus-labs', 'polyhedra', 'risc-zero'],
    supplyChainIds: ['nvidia', 'eth-verifier-gas', 'aws-azure-gcp'],
    constraints: [
      {
        label: 'Proving time per parameter',
        value: 'Minutes-to-hours, 70B+ models',
        note: 'zkML proving scales worse than inference itself. A 70B-parameter forward pass takes seconds; the matching ZK proof takes minutes to hours on the same hardware. The compute asymmetry is the binding constraint on practical verifiable inference.',
      },
      {
        label: 'On-chain verifier gas',
        value: '~280K-1M gas per proof',
        note: 'Groth16 verifiers cost ~280K gas; PLONK ~400K; STARK higher. At 30 gwei + $3K ETH, a single proof verification = ~$25-90 — the floor on subnet economics for any verified training step.',
      },
      {
        label: 'Circuit size limits',
        value: '~2^25 constraints today',
        note: 'Production zkML circuits cap around 32M constraints before proving cost runs away. Larger models require recursion or proof aggregation — adds latency + complexity.',
      },
      {
        label: 'Trusted-setup ceremonies',
        value: 'Per-circuit or universal',
        note: 'Groth16 needs a per-circuit ceremony; PLONK / KZG use a universal setup. Either way, the ceremony quality determines proof integrity — a centralized failure mode subnets must coordinate around.',
      },
      {
        label: 'Prover hardware demand',
        value: 'Same H100 / A100 as training',
        note: 'zkML provers run on the same scarce GPU stock as the training they verify. Competes with centralized training shops for chip allocation.',
      },
    ],
  },

  /* SN6 Nous — Finetuning competitions on rotating benchmark sets.
     The rivals are the centralized fine-tuning APIs + the
     serverless GPU shops that finetune-as-a-service. Supply chain
     is the same AI-compute stack, plus dataset curation
     dependencies. */
  6: {
    rivals: ['hugging-face', 'openai', 'replicate', 'modal-labs', 'together-ai'],
    supplyChainIds: ['nvidia', 'tsmc', 'aws-azure-gcp', 'us-power-grids'],
    constraints: [
      {
        label: 'Finetuning compute cost',
        value: '~$50-500 per LoRA run',
        note: 'LoRA / QLoRA finetuning on a 7-70B model = $50-500 of GPU time at hyperscaler rates. Full finetuning 10-100× more. Subnet emission rewards offset miner compute cost.',
      },
      {
        label: 'Benchmark gaming',
        value: 'Rotating eval sets mitigate',
        note: 'Static benchmarks get memorized. Subnet rotates eval sets every cycle — but centralized competitors do the same internally. Quality of held-out data is the moat.',
      },
      {
        label: 'Dataset curation cost',
        value: 'Hours-to-weeks per fine-tune',
        note: 'High-quality fine-tuning needs curated data. Scale AI / Surge / Argilla charge $5-50/label for human-rated examples. The data layer is harder to decentralize than the compute layer.',
      },
      {
        label: 'Eval cost per submission',
        value: '$10-100 per scored run',
        note: 'Running benchmarks across a model costs compute itself. Centralized leaderboards (Open LLM, MT-Bench) absorb this; subnets must distribute it across validators.',
      },
      {
        label: 'Base-model dependency',
        value: 'Llama / Mistral / Qwen weights',
        note: 'Nearly every finetune starts from an open base model. Meta / Mistral / Alibaba (Qwen) set the upstream pace; finetune subnets inherit their license terms + roadmap.',
      },
    ],
  },

  /* SN9 Pretraining — From-scratch language-model pretraining
     with public loss leaderboards. The rivals are the FRONTIER
     LABS doing the same work centrally. Supply chain is the
     full AI-compute stack at its most intensive — these are
     the runs that consume entire datacenters. */
  9: {
    rivals: ['openai', 'anthropic', 'meta', 'mistral', 'cohere'],
    supplyChainIds: ['nvidia', 'tsmc', 'sk-hynix', 'aws-azure-gcp', 'us-power-grids'],
    constraints: [
      {
        label: 'Training run capex',
        value: '~$100-500M (GPT-4 class)',
        note: 'GPT-4 reportedly ~$100M raw compute; subsequent frontier runs scale 3-10× per generation. A single 70B run = ~$3-20M. Decentralized pretraining must aggregate enough miner capacity to compete.',
      },
      {
        label: 'Cluster size',
        value: '10K-100K GPUs in one room',
        note: 'Frontier runs need ~25K H100s networked at <1μs latency. Decentralized pretraining cannot match this physical density — must rely on different architectures (federated, async).',
      },
      {
        label: 'Run duration',
        value: 'Weeks-to-months wall clock',
        note: 'Llama 3 405B trained ~54 days on 16K H100s. The wall-clock + hardware-failure window is a centralized strength — checkpoint + restart procedures over months are mature.',
      },
      {
        label: 'Token diet',
        value: '~15T tokens for SOTA',
        note: 'Frontier 70B+ models train on 10-20T curated tokens. Common Crawl + curated web + code + multilingual + synthetic data. Dataset assembly is becoming the bottleneck, not compute.',
      },
      {
        label: 'MFU / utilization',
        value: '~40-50% typical',
        note: 'Model FLOPs Utilization measures how much of theoretical GPU compute is actually used. Centralized clusters hit 40-50% with custom kernels (FlashAttention, Triton). Decentralized topology gives up some of this.',
      },
    ],
  },

  /* SN7 SubVortex — Decentralized validator-as-a-service
     infrastructure. The rivals are the centralized staking
     providers running validators on hyperscaler / bare-metal
     fleets. */
  7: {
    rivals: ['allnodes', 'stakefish', 'chorus-one', 'figment'],
    supplyChainIds: ['aws-azure-gcp', 'bare-metal-hosts', 'us-power-grids'],
    constraints: [
      {
        label: 'Validator slashing risk',
        value: 'Double-sign = capital loss',
        note: 'A misconfigured validator can lose its stake to slashing. Centralized providers invest in monitoring + redundancy that decentralized operators must reproduce per-node.',
      },
      {
        label: 'Key management',
        value: 'HSM or air-gapped signer',
        note: 'Production validators use HSMs (Ledger HSM, AWS CloudHSM) or air-gapped signing setups. Centralized providers amortize this cost across many customers; decentralized subnets must distribute the practice.',
      },
      {
        label: 'Geographic redundancy',
        value: '3+ regions to survive outages',
        note: 'Top staking providers run validators across multiple cloud regions + bare metal. Decentralized subnets get this naturally via miner geography but inherit the coordination cost.',
      },
      {
        label: 'Uptime SLA',
        value: '99.9% institutional standard',
        note: 'Allnodes, Chorus One, Figment offer 99.9-99.99% uptime. Below that, customers face missed-attestation penalties on the chains they validate.',
      },
      {
        label: 'Hyperscaler concentration',
        value: '~70% of ETH validators on AWS',
        note: 'Industry research consistently finds ~50-70% of major-chain validators run on AWS. The centralization risk is real — and the decentralization angle subnets like SubVortex sell against.',
      },
    ],
  },

  /* SN10 Sturdy — Yield strategy generation graded against
     backtests and live PnL. The rivals are the established
     DeFi yield protocols + aggregators. Supply chain is
     chain-native: Ethereum L1 gas + oracle providers. */
  10: {
    rivals: ['aave-labs', 'compound-finance', 'yearn-finance', 'morpho-labs'],
    supplyChainIds: ['ethereum-l1-gas', 'chainlink-oracles', 'aws-azure-gcp'],
    constraints: [
      {
        label: 'Gas-cost floor',
        value: 'Strategies need yields > gas',
        note: 'L1 gas at 30 gwei = ~$10-50 per strategy rebalance. Strategies generating <50bps yield evaporate after gas. L2 deployment (Arbitrum, Base) lowers the floor 10-100×.',
      },
      {
        label: 'Smart-contract risk',
        value: 'Audits + bounties baseline',
        note: 'Every yield strategy that touches user funds carries exploit risk. Aave / Compound / Yearn have multi-year audit histories + bug bounties; new subnet strategies must accumulate the same trust.',
      },
      {
        label: 'Oracle manipulation',
        value: 'Chainlink dependency',
        note: 'Strategies that rely on price oracles (most do) inherit Chainlink reliability. Past exploits (Mango Markets, Inverse) exploited oracle drift; subnet strategies must validate against multiple sources.',
      },
      {
        label: 'TVL / yield tradeoff',
        value: 'Larger TVL → lower yields',
        note: 'Yield-strategy alpha decays as capital chases it. Yearn vaults that returned 20% APY in 2022 now return 5% as TVL scaled. Subnet strategies face the same dilution as they capture flow.',
      },
      {
        label: 'Regulatory framing',
        value: 'Yield = "security" in many jurisdictions',
        note: 'SEC has signaled that yield-generation services may constitute securities offerings. Centralized DeFi front-ends (Yearn, Beefy) face delisting pressure; subnet alternatives operate outside front-end risk.',
      },
    ],
  },

  /* SN14 Palaidn — Real-world entity resolution + KYC-graph
     data. Rivals are the centralized identity-graph + decision-
     intelligence platforms. */
  14: {
    rivals: ['palantir', 'quantexa', 'snowflake', 'databricks'],
    supplyChainIds: ['aws-azure-gcp', 'us-power-grids'],
    constraints: [
      {
        label: 'Privacy regulation',
        value: 'GDPR + CCPA + KYC mandates',
        note: 'Entity-resolution data is heavily regulated. Centralized providers have compliance teams; decentralized must structure consent + provenance into the data layer.',
      },
      {
        label: 'Data freshness vs accuracy',
        value: 'Daily updates baseline',
        note: 'Identity-graph quality decays without continuous refresh. Centralized vendors employ data ops; decentralized must incentivize miner updates.',
      },
      {
        label: 'Source coverage breadth',
        value: 'Sanctions + PEP + UBO across jurisdictions',
        note: 'KYC platforms need global source coverage — court records, sanctions lists, beneficial ownership registries. Decentralized aggregation is uniquely positioned here but must verify each source.',
      },
      {
        label: 'False-match cost',
        value: 'Brand-damage + regulatory exposure',
        note: 'A bad match in KYC = onboarding fraud or wrongful denial. Centralized providers carry insurance + SLAs; decentralized must structure liability allocation.',
      },
      {
        label: 'Enterprise sales cycle',
        value: '6-18 months for bank deals',
        note: 'Palantir + Quantexa close 6-18 month enterprise pilots. Decentralized subnets must structure procurement that works for risk-averse buyers.',
      },
    ],
  },

  /* SN15 De-Val — Adversarial validation of LLM outputs against
     rubrics. The rival space is the rapidly-emerging LLM-security
     + evaluation tooling sector. */
  15: {
    rivals: ['robust-intelligence', 'lakera', 'patronus-ai', 'hugging-face'],
    supplyChainIds: ['nvidia', 'aws-azure-gcp'],
    constraints: [
      {
        label: 'Rubric design',
        value: 'Eval contamination risk',
        note: 'Static rubrics get gamed. Centralized eval vendors rotate test sets weekly-monthly; decentralized validators must coordinate the same rotation cadence.',
      },
      {
        label: 'Coverage vs depth tradeoff',
        value: 'Breadth requires hand-curation',
        note: 'Broad LLM eval coverage (hallucination + jailbreak + bias + factuality + reasoning) requires deep editorial work per category. Centralized firms specialize narrowly; decentralized can aggregate miner specialists.',
      },
      {
        label: 'Adversarial attack rate',
        value: 'New jailbreaks weekly',
        note: 'Prompt-injection + jailbreak techniques evolve fast. Decentralized eval can route incentives to miners producing fresh attack surfaces — a structural advantage IF scoring is honest.',
      },
      {
        label: 'Enterprise procurement',
        value: 'Cisco / Splunk acquisitions',
        note: 'Robust Intelligence got acquired by Cisco; expect more roll-ups. Decentralized eval competes against post-acquisition enterprise sales motion.',
      },
      {
        label: 'Per-eval cost',
        value: '$0.01-1.00 per test case',
        note: 'Enterprise eval-as-a-service charges \$0.01-1 per scored case depending on depth. Decentralized must match this floor with miner compute.',
      },
    ],
  },

  /* SN29 Coldint — Cold-start distributed integer compute for
     training pipelines. Rivals are the same frontier-training
     labs but with emphasis on training-startup efficiency. */
  29: {
    rivals: ['openai', 'anthropic', 'meta', 'mistral'],
    supplyChainIds: ['nvidia', 'tsmc', 'sk-hynix', 'aws-azure-gcp', 'us-power-grids'],
    constraints: [
      {
        label: 'Cold-start cluster latency',
        value: 'Minutes-to-hours to spin up',
        note: 'Frontier labs maintain always-on clusters. Decentralized cold-start integer compute must aggregate miner capacity at job-start time — wall-clock penalty.',
      },
      {
        label: 'Integer-precision training',
        value: 'INT8 / INT4 quantization',
        note: 'Frontier labs lean toward BF16 / FP16 mixed precision. Integer-only paths trade some model quality for memory + throughput — niche but real.',
      },
      {
        label: 'Inter-node bandwidth',
        value: 'NVLink in datacenter vs WAN in subnet',
        note: 'Centralized clusters use NVLink at 900GB/s between GPUs. Decentralized integer compute runs over WAN at 10-100Gb/s — communication-heavy training stalls.',
      },
      {
        label: 'Checkpoint sync',
        value: 'Coordination overhead',
        note: 'Distributed training across heterogeneous miners needs frequent checkpoint sync. Decentralized must amortize this overhead via emission rewards covering bandwidth costs.',
      },
      {
        label: 'Fault tolerance',
        value: 'Miner dropout mid-run',
        note: 'Long-running training jobs see node failures. Centralized restart from last checkpoint; decentralized must structure handoff between miners + verify continuity.',
      },
    ],
  },

  /* SN34 BitMind FM — Foundation-model fingerprinting for
     content provenance. Distinct from SN24 Bitmind (which
     detects synthetic media); SN34 fingerprints WHICH model
     generated which content. */
  34: {
    rivals: ['hive-ai', 'adobe', 'meta', 'google'],
    supplyChainIds: ['nvidia', 'aws-azure-gcp', 'us-power-grids'],
    constraints: [
      {
        label: 'Model proliferation',
        value: 'Thousands of open models on HF',
        note: 'HuggingFace hosts 1M+ models. Fingerprinting must scale to that catalog — decentralized miners can specialize in subsets.',
      },
      {
        label: 'Fine-tune evasion',
        value: 'LoRA breaks fingerprints',
        note: 'A small fine-tune on a base model can defeat naive fingerprinting. Decentralized provenance needs to track lineage across fine-tunes.',
      },
      {
        label: 'C2PA + watermarking standards',
        value: 'Industry path',
        note: 'Adobe + Microsoft + camera makers push signed-at-source provenance. Fingerprinting from output is the COMPLEMENT — both useful, both centralized today.',
      },
      {
        label: 'Per-asset cost',
        value: 'Similar to AI-content detection',
        note: 'Same compute economics as Bitmind (SN24). Detection-vs-evasion arms race + per-check cost floor.',
      },
      {
        label: 'Forensic admissibility',
        value: 'Court-grade evidence standard',
        note: 'Forensic AI-content claims face high evidentiary bars. Decentralized provenance with cryptographic audit trails could be UNIQUELY suited to admissible evidence — a centralized weakness.',
      },
    ],
  },

  /* SN39 EdgeMaxxing — On-device inference optimization with
     verifiable latency proofs. Rivals are the mobile + edge
     AI silicon vendors. */
  39: {
    rivals: ['apple-neural-engine', 'qualcomm', 'mediatek', 'nvidia'],
    supplyChainIds: ['tsmc', 'us-power-grids'],
    constraints: [
      {
        label: 'Heterogeneous device matrix',
        value: 'Thousands of phone + edge SKUs',
        note: 'Optimization across iPhone + Android + edge SKUs is combinatorial. Centralized silicon vendors own the toolchain; decentralized must aggregate per-device miner work.',
      },
      {
        label: 'Power budget',
        value: '~3-8W sustained for phones',
        note: 'Phone NPUs cap at ~3-8W sustained without thermal throttle. Centralized vendors tune for this; decentralized inference optimization must respect the envelope.',
      },
      {
        label: 'Latency proof verification',
        value: 'Cryptographic timestamp',
        note: 'Verifying that a miner ACTUALLY ran inference at the claimed latency requires cryptographic timestamping + sample audits. Centralized SDKs trust the device.',
      },
      {
        label: 'OS / runtime fragmentation',
        value: 'Core ML vs NNAPI vs vendor',
        note: 'iOS uses Core ML; Android uses NNAPI or vendor runtimes (QNN, MediaTek\'s NeuroPilot). Centralized vendors maintain SDKs; decentralized must support each.',
      },
      {
        label: 'Mobile model size ceiling',
        value: '~1-3GB practical limit',
        note: '7B parameter models fit on flagship phones (3GB at INT4). Decentralized edge optimization is bounded by the same device memory ceilings centralized vendors hit.',
      },
    ],
  },

  /* SN47 Condense AI — Long-context summarization + compression
     scored on fidelity. Rivals are the frontier-lab large-context
     models + dedicated summarization shops. */
  47: {
    rivals: ['anthropic', 'openai', 'google', 'cohere', 'mistral'],
    supplyChainIds: ['nvidia', 'tsmc', 'sk-hynix', 'aws-azure-gcp', 'us-power-grids'],
    constraints: [
      {
        label: 'Context-window ceiling',
        value: 'Gemini 2M / Claude 1M baseline',
        note: 'Frontier labs ship 1M-2M token context. Decentralized summarization must match or beat this on quality at lower cost per token.',
      },
      {
        label: 'Quadratic attention cost',
        value: '~O(n²) inference',
        note: 'Vanilla attention scales O(n²) — 1M tokens = 1T attention operations. Sparse / linear-attention variants help but trade quality. Same constraint centralized + decentralized face.',
      },
      {
        label: 'Fidelity scoring',
        value: 'Hallucination + omission detection',
        note: 'Summarization quality scoring is qualitative. Decentralized eval needs deterministic rubrics; centralized labs use human raters at scale.',
      },
      {
        label: 'Use case range',
        value: 'Document QA vs creative summarization',
        note: 'Long-context use cases vary widely. Centralized rivals (Claude, Gemini) generalize; decentralized subnets can specialize via miner work.',
      },
      {
        label: 'Per-token cost',
        value: '$3-30 / 1M tokens (centralized)',
        note: 'Frontier long-context inference at $3-30 per million tokens. Decentralized must match this floor while compensating for synthesized context-management overhead.',
      },
    ],
  },

  /* SN12 ComputeHorde — GPU compute spot market priced per
     FLOP-hour with verifiable receipts. Closest rival to
     centralized GPU clouds + spot-instance providers. */
  12: {
    rivals: ['coreweave', 'lambda-labs', 'modal-labs', 'aws-azure-gcp'],
    supplyChainIds: ['nvidia', 'tsmc', 'sk-hynix', 'us-power-grids'],
    constraints: [
      {
        label: 'Spot vs on-demand pricing',
        value: '~30-70% discount typical',
        note: 'Hyperscaler spot instances run 30-70% cheaper than on-demand but can be reclaimed mid-job. Decentralized spot must match the discount while avoiding the reclaim risk via verifiable receipts.',
      },
      {
        label: 'H100 hourly rate floor',
        value: '~$2.50-4.50/hr',
        note: 'Lambda + CoreWeave list H100s at $2.50-3 (8-month commit) to $4.50 (on-demand). Decentralized miners must price below to capture price-sensitive flow.',
      },
      {
        label: 'Verifiable FLOP receipt cost',
        value: '~1-3% perf overhead',
        note: 'Verifiable computation (proof of work done) adds overhead. Cheaper than zkML proving but non-zero — narrows the price advantage decentralized providers can offer.',
      },
      {
        label: 'Cold-start latency',
        value: 'Minutes-to-hours',
        note: 'Spot capacity must be MATCHED before a job runs. Decentralized markets see longer cold-starts than hyperscalers running pools of pre-warmed instances.',
      },
      {
        label: 'Sustainable utilization',
        value: '~40-60% across the network',
        note: 'Centralized GPU clouds aim for ~70-80% utilization. Decentralized spot will run lower until liquidity matches demand; the gap shows up in price.',
      },
    ],
  },

  /* SN19 Vision — Image classification, embedding, synthesis
     under public scoring. Direct rivals are the frontier
     vision labs + the image-gen platforms. */
  19: {
    rivals: ['stability-ai', 'midjourney', 'openai', 'google', 'runway'],
    supplyChainIds: ['nvidia', 'tsmc', 'aws-azure-gcp', 'us-power-grids'],
    constraints: [
      {
        label: 'Training run cost',
        value: '~$10-50M frontier image',
        note: 'SDXL / Stable Diffusion 3 / DALL·E 3 class training runs land in $10-50M range. Decentralized vision subnets sidestep via emission rewards but inherit the data + curation cost.',
      },
      {
        label: 'Generation cost per image',
        value: '$0.01-0.10 (centralized)',
        note: 'Stability + Midjourney charge $0.01-0.10 per generated image at scale. Decentralized vision must match this price floor with miner compute.',
      },
      {
        label: 'Curated training-image licensing',
        value: 'Lawsuit-prone',
        note: 'Stability, Midjourney facing ongoing copyright suits (Getty, NYT). Decentralized vision can use only opt-in or CC-licensed data — narrower training corpus but cleaner IP.',
      },
      {
        label: 'Brand + UX moat',
        value: 'Midjourney Discord workflow',
        note: 'Midjourney built UX on Discord + sustained iteration. Decentralized vision must surface a similar polish to capture creator workflow.',
      },
      {
        label: 'Adversarial validator scoring',
        value: 'Reward-hack risk',
        note: 'Public scoring against adversarial validators creates incentive to game the metric. Centralized rivals tune internally; subnet design must keep evals robust.',
      },
    ],
  },

  /* SN21 Omega — Any-to-any multimodal generation with
     adversarial validators. The rivals are the frontier
     multimodal labs (OpenAI GPT-4V, Anthropic Claude vision,
     Google Gemini multimodal). */
  21: {
    rivals: ['openai', 'anthropic', 'google', 'meta', 'runway'],
    supplyChainIds: ['nvidia', 'tsmc', 'sk-hynix', 'aws-azure-gcp', 'us-power-grids'],
    constraints: [
      {
        label: 'Frontier multimodal training cost',
        value: '~$100-500M',
        note: 'GPT-4V / Gemini Ultra / Claude 3.5 Sonnet multimodal training in the $100-500M range. Same compute mountain pretraining subnets face.',
      },
      {
        label: 'Modality coverage',
        value: 'Text + image + audio + video',
        note: 'Frontier any-to-any models target ALL four modalities. Decentralized any-to-any must approximate via specialist miner submissions composed across boundary.',
      },
      {
        label: 'Adversarial validator alignment',
        value: 'Multimodal eval is hard',
        note: 'Evaluating a video → text + image → audio composition is qualitative. Centralized labs use human raters at scale; decentralized must use deterministic-enough rubrics.',
      },
      {
        label: 'Inference latency',
        value: '~5-30s per generation',
        note: 'Frontier multimodal models run 5-30 seconds per output at scale. Decentralized must match at miner level or accept latency tradeoff.',
      },
      {
        label: 'GPU memory ceiling',
        value: '80GB H100 / 192GB B200',
        note: 'Multimodal models stretch GPU memory ceilings. Smaller distributed miners struggle to host the full 70B+ class models centralized labs use.',
      },
    ],
  },

  /* SN25 Folding — Distributed protein folding + molecular
     simulation. The rival is AlphaFold (Google DeepMind) +
     the specialized drug-discovery AI labs. */
  25: {
    rivals: ['deepmind-science', 'atomwise', 'google'],
    supplyChainIds: ['nvidia', 'tsmc', 'aws-azure-gcp', 'us-power-grids'],
    constraints: [
      {
        label: 'AlphaFold structural ceiling',
        value: '~95% protein universe',
        note: 'AlphaFold 3 has predicted structures for ~200M proteins (most of UniProt). Decentralized folding must add value on top — novel proteins, dynamics, drug interactions.',
      },
      {
        label: 'GPU-hours per folded protein',
        value: '~1-10 H100-hours',
        note: 'Frontier folding takes 1-10 GPU-hours per long protein. Decentralized scales horizontally via miners but each one still needs the same compute.',
      },
      {
        label: 'Validation against ground truth',
        value: 'PDB + lab assays',
        note: 'Protein Data Bank + wet-lab experimental structures are the validators. Decentralized subnet needs access to these datasets to score miners.',
      },
      {
        label: 'Drug-discovery monetization',
        value: '~$2B / approved drug',
        note: 'Centralized labs (Atomwise, Insilico, Recursion) monetize via pharma partnerships. Decentralized folding must structure similar monetization or stay purely science-rewarded.',
      },
      {
        label: 'Compute carbon footprint',
        value: '~5-50kWh per structure',
        note: 'GPU-intensive workloads have non-trivial carbon cost. Decentralized geographic diversity can route to lower-carbon regions.',
      },
    ],
  },

  /* SN30 Wombo — Text-to-video generation judged on quality
     and prompt fidelity. Rivals are the frontier video labs. */
  30: {
    rivals: ['openai-sora', 'google', 'runway', 'meta', 'stability-ai'],
    supplyChainIds: ['nvidia', 'tsmc', 'sk-hynix', 'aws-azure-gcp', 'us-power-grids'],
    constraints: [
      {
        label: 'Training compute',
        value: '~$50-200M per frontier model',
        note: 'Sora / Veo / Gen-3 class video models train at $50-200M compute cost. Decentralized video must aggregate distributed pretraining or accept smaller backbone.',
      },
      {
        label: 'Generation cost per clip',
        value: '$0.50-5.00 per 5-10s clip',
        note: 'Centralized video generation costs $0.50-5 per short clip at API rates. Decentralized must match the floor on miner-side.',
      },
      {
        label: 'Temporal coherence',
        value: 'Hard problem',
        note: 'Frame-to-frame consistency over 5-30s is the hard part. Centralized labs solve via massive scale + RLHF; decentralized has fewer rater hours.',
      },
      {
        label: 'Storage + bandwidth',
        value: 'Video = 100× image',
        note: 'A generated 10s clip = 10-50MB. Video subnet pipeline needs storage + delivery infrastructure that single-image subnets don\'t.',
      },
      {
        label: 'Brand recognition',
        value: 'Sora / Veo dominate awareness',
        note: 'Consumer + creative-pro awareness sits with OpenAI Sora + Google Veo. Decentralized video must build the same brand register or stay institutional-only.',
      },
    ],
  },

  /* SN36 Web Genie — Browser-using agents graded on real-world
     task completion. Rivals are the centralized agent labs. */
  36: {
    rivals: ['openai', 'anthropic', 'google', 'adept-ai'],
    supplyChainIds: ['nvidia', 'aws-azure-gcp', 'cloudflare-edge'],
    constraints: [
      {
        label: 'OS / browser API access',
        value: 'Operator / Computer Use limited',
        note: 'OpenAI Operator + Anthropic Computer Use rely on platform-controlled browser windows. Decentralized agents can run on miner-controlled environments — different security tradeoff.',
      },
      {
        label: 'Task completion accuracy',
        value: '~50-70% on benchmarks',
        note: 'Top centralized agents land 50-70% on AgentBench / WebArena. Decentralized must match while not having access to RLHF data the frontier labs use.',
      },
      {
        label: 'Latency per browser action',
        value: '2-5s per click/scroll',
        note: 'Vision + LLM + browser execution pipeline = 2-5 seconds between agent actions. Decentralized must compete on this latency floor.',
      },
      {
        label: 'Anti-bot / CAPTCHA',
        value: 'Cloudflare bot scoring',
        note: 'Sites use Cloudflare + reCAPTCHA + behavioral biometrics to block automated agents. Centralized labs invest in detection bypass; decentralized inherits the same arms race.',
      },
      {
        label: 'Eval task curation',
        value: 'Real-world task design',
        note: 'Holdout task sets need careful curation to avoid memorization. Centralized labs (Anthropic SWE-bench, etc.) lead curation; decentralized validators must match.',
      },
    ],
  },

  /* SN13 Dataverse — Open dataset construction + curation,
     incentivized at the row. Rivals are the centralized data
     labeling / dataset hosting platforms. */
  13: {
    rivals: ['scale-ai', 'hugging-face', 'snowflake', 'databricks'],
    supplyChainIds: ['aws-azure-gcp', 'web-crawl-infra', 'us-power-grids'],
    constraints: [
      {
        label: 'Per-label cost',
        value: '$5-50 per human-rated row',
        note: 'Scale AI / Surge / Argilla price ranges. Decentralized data subnets pay miners via emission; the marginal cost per labeled row competes against this floor.',
      },
      {
        label: 'Curation quality moat',
        value: 'Scale + Surge enterprise contracts',
        note: 'Frontier labs (OpenAI, Anthropic) buy curated data via long-term contracts. Decentralized data must demonstrate equivalent quality + reliability to win institutional flow.',
      },
      {
        label: 'Storage cost',
        value: '~$23/TB/mo on S3',
        note: 'Trillion-token datasets = petabytes. Storage is non-trivial for curated open-data subnets; geographic miner sharding can route around hyperscaler concentration.',
      },
      {
        label: 'IP / licensing',
        value: 'Opt-in is narrower',
        note: 'HuggingFace + Common Crawl carry implicit-license risk. Opt-in / CC-licensed corpora are cleaner but narrower. Decentralized subnets can structure cleaner IP from day one.',
      },
      {
        label: 'Dataset eval methodology',
        value: 'Benchmark contamination risk',
        note: 'Curated data leaks into model evals — a centralized problem too. Decentralized subnets need rotating eval sets + holdout strategies to keep scoring honest.',
      },
    ],
  },

  /* SN18 Cortex.t — Real-time text inference with strict
     latency SLAs. Closest rival is the low-latency tier of
     centralized inference shops. */
  18: {
    rivals: ['fireworks-ai', 'together-ai', 'coreweave', 'openai', 'anthropic'],
    supplyChainIds: ['nvidia', 'tsmc', 'sk-hynix', 'aws-azure-gcp', 'us-power-grids'],
    constraints: [
      {
        label: 'p99 latency target',
        value: '~200-500ms first token',
        note: 'Centralized inference shops (Fireworks, Together) advertise sub-500ms p99 first-token latency on 70B models. Decentralized inference must match this floor to compete for real-time use cases.',
      },
      {
        label: 'Throughput per GPU',
        value: '~50-200 tok/s per H100',
        note: 'FireAttention + vLLM achieve 50-200 tokens/sec sustained on H100 for 70B models. Decentralized miners must match throughput while routing requests across distributed nodes.',
      },
      {
        label: 'Network round-trip',
        value: '~20-100ms regional',
        note: 'Centralized inference is fronted by Cloudflare / Fastly edge. Decentralized miner topology adds round-trip variance — subnet must structure geographic routing to compete.',
      },
      {
        label: 'Cold-start penalty',
        value: '500ms-10s on model swap',
        note: 'Loading a new 70B model into GPU memory takes time. Centralized shops pre-warm popular models; decentralized must coordinate warm-pools across miners.',
      },
      {
        label: 'SLA enforceability',
        value: 'Enterprise contracts trail decentralized',
        note: 'Latency-sensitive enterprise customers want SLAs with teeth. Decentralized subnets can offer slashing-backed guarantees but the legal framework around miner-as-counterparty is still forming.',
      },
    ],
  },

  /* SN20 BitAds — On-chain ad attribution and incentive market.
     Rivals are the centralized ad platforms + adtech measurement. */
  20: {
    rivals: ['google', 'meta', 'trade-desk', 'applovin'],
    supplyChainIds: ['aws-azure-gcp', 'cloudflare-edge', 'us-power-grids'],
    constraints: [
      {
        label: 'Walled-garden data',
        value: 'Google + Meta own ~55% of US digital ad spend',
        note: 'Top 2 platforms see most user behavior. Decentralized attribution must build alternative tracking signal — either via opt-in users or via on-chain identity that side-steps their data moat.',
      },
      {
        label: 'Privacy regulation pressure',
        value: 'iOS ATT, GDPR, EU Digital Services Act',
        note: 'Centralized adtech is being squeezed by privacy law. Decentralized attribution that publishes verifiable on-chain receipts can be the COMPLIANT alternative — but must structure consent flows carefully.',
      },
      {
        label: 'Attribution fraud',
        value: '~20-40% of clicks invalid',
        note: 'Industry estimates of click fraud range 20-40% depending on category. Centralized platforms invest in detection; decentralized must match via cryptographic proof of ad delivery.',
      },
      {
        label: 'Advertiser onboarding',
        value: 'Self-serve UI table-stakes',
        note: 'Google Ads / Meta Ads Manager / TTD Trade Desk have 20+ years of advertiser-UX investment. Decentralized adtech must invest equivalently in advertiser dashboards.',
      },
      {
        label: 'Reach',
        value: 'Walled gardens deliver scale',
        note: 'Meta + Google reach >3B users daily. Decentralized attribution can only measure flow it can OBSERVE — limited to opt-in users until scale builds.',
      },
    ],
  },

  /* SN24 Bitmind — AI-generated content detection (real vs
     synthetic media). Rivals are the centralized synthetic-
     content detection services. */
  24: {
    rivals: ['hive-ai', 'adobe', 'google', 'meta'],
    supplyChainIds: ['nvidia', 'aws-azure-gcp', 'us-power-grids'],
    constraints: [
      {
        label: 'Detection vs evasion arms race',
        value: 'Detector accuracy decays 5-15%/yr',
        note: 'New generative models defeat last-generation detectors. Centralized shops (Hive, GPTZero) update continuously; decentralized must build incentive for miners to ship updated detectors as fast as generation models evolve.',
      },
      {
        label: 'Per-asset inference cost',
        value: '~$0.0005-0.005 per check',
        note: 'Hive AI + Sensity charge fractions of a cent per moderation check at enterprise volume. Decentralized must hit this floor with miner compute.',
      },
      {
        label: 'False-positive cost',
        value: 'Brand-damage risk',
        note: 'Flagging real content as synthetic = legal + PR risk. Decentralized detection must surface confidence scores + audit trails to limit liability.',
      },
      {
        label: 'C2PA + Content Credentials',
        value: 'Standards-led path',
        note: 'Adobe + camera makers + browser vendors converging on Content Credentials (C2PA) for provenance. Decentralized detection coexists with — not replaces — this signed-at-source approach.',
      },
      {
        label: 'Regulatory mandate',
        value: 'EU AI Act + state-level laws',
        note: 'EU AI Act + California / Texas legislation requiring AI-content labeling. Decentralized detection can serve regulated markets; centralized incumbents already have compliance teams.',
      },
    ],
  },

  /* SN27 Compute — Verifiable GPU compute marketplace priced
     per FLOP. Same space as SN12 ComputeHorde but a different
     team — rivalship is essentially the same. */
  27: {
    rivals: ['coreweave', 'lambda-labs', 'modal-labs', 'aws-azure-gcp'],
    supplyChainIds: ['nvidia', 'tsmc', 'sk-hynix', 'us-power-grids'],
    constraints: [
      {
        label: 'Spot capacity matching',
        value: 'Liquidity bootstrapping',
        note: 'Verifiable FLOP markets need both buyers and miners online concurrently. Centralized clouds achieve this via pre-warmed instance pools; decentralized must structure incentives for idle miner availability.',
      },
      {
        label: 'Verification overhead',
        value: '~1-5% per FLOP receipt',
        note: 'Cryptographic verification of compute correctness adds overhead. ZKVM / spot-check / consensus all carry cost tradeoffs.',
      },
      {
        label: 'Slashing risk for miners',
        value: 'Bad receipts → lost stake',
        note: 'Verifiable compute means a misbehaving miner can be slashed. Centralized providers don\'t face per-job stake risk; decentralized inherits coordination cost.',
      },
      {
        label: 'Heterogeneous GPU mix',
        value: 'H100 + A100 + 4090 + ...',
        note: 'Centralized clouds standardize on H100s + A100s. Decentralized marketplaces inherit whatever miners own — heterogeneous fleet complicates scheduling but increases supply.',
      },
      {
        label: 'Pricing transparency',
        value: 'Public per-FLOP rate',
        note: 'Centralized cloud pricing is somewhat opaque (committed-use discounts, region differences). Decentralized publishes a transparent per-FLOP rate — institutional buyers value this.',
      },
    ],
  },

  /* SN42 Foresight — On-chain prediction markets validated
     against real outcomes. Rivals are the centralized prediction
     market platforms. */
  42: {
    rivals: ['polymarket', 'kalshi'],
    supplyChainIds: ['ethereum-l1-gas', 'chainlink-oracles', 'aws-azure-gcp'],
    constraints: [
      {
        label: 'Liquidity for binary outcomes',
        value: 'Top platforms ~$50-100M/mo',
        note: 'Polymarket alone moves $50-100M/month in active markets. Decentralized prediction subnets need to either capture or aggregate this liquidity to be useful for price discovery.',
      },
      {
        label: 'Outcome verification',
        value: 'Trusted oracle resolution',
        note: 'Every prediction market resolves via an oracle. Polymarket uses UMA optimistic oracle; Kalshi resolves internally. Subnet must pick a resolution mechanism that scales without trusted intermediary.',
      },
      {
        label: 'Regulatory framing',
        value: 'CFTC + SEC scrutiny',
        note: 'Kalshi operates under CFTC DCM license; Polymarket is offshore due to US restrictions. Subnet prediction markets face the same regulatory map but can structure outside both.',
      },
      {
        label: 'Market liquidity per question',
        value: '90% of volume in 10% of markets',
        note: 'Liquidity concentrates in election + sports + econ. Long-tail markets stay thin. Decentralized subnets must either match the concentration or accept lower long-tail liquidity.',
      },
      {
        label: 'Time-to-resolution',
        value: 'Hours-to-months',
        note: 'Election markets resolve in months. Sports / events in hours. Decentralized must handle both timescales for capital lock-up and oracle finality.',
      },
    ],
  },

  /* SN11 Dippy — Roleplay and dialogue models judged on
     engagement and steering. The rivals are the consumer
     persona-chat apps — Character.AI is the giant, Replika
     the long-term player, AI Dungeon + NovelAI the creative
     subset. */
  11: {
    rivals: ['character-ai', 'replika', 'ai-dungeon', 'novelai'],
    supplyChainIds: ['nvidia', 'aws-azure-gcp', 'tsmc'],
    constraints: [
      {
        label: 'Engagement-metrics gaming',
        value: 'Reward hacking risk',
        note: 'Models trained to maximize engagement learn manipulative tactics (sycophancy, infinite-scroll behavior). Centralized apps face same pressure; subnet design must reward TRUE engagement quality.',
      },
      {
        label: 'COPPA / minor compliance',
        value: '13+ age gates required',
        note: 'Character.AI has faced lawsuits over minor exposure; centralized apps enforce age verification + content controls. Subnet operators inherit this regulatory surface or face delisting from app stores.',
      },
      {
        label: 'Persona stability',
        value: 'Long-context drift',
        note: 'Character consistency over 50K+ token conversations is hard — even Claude 3.7 / GPT-4o drift. Subnet roleplay miners must score this; centralized rivals have integrated memory systems.',
      },
      {
        label: 'Content moderation cost',
        value: 'Human-review per session',
        note: 'Centralized roleplay apps spend material % of revenue on moderation labor. Subnet alternative must distribute this — or accept lower-quality moderation as the tradeoff for openness.',
      },
      {
        label: 'Consumer ARPU',
        value: '$10-20/mo subscription',
        note: 'Character.AI Plus + Replika Pro both ~$10-20/mo. Free tiers heavily ad-supported or rate-limited. Subnet roleplay sidesteps ARPU via emission but must justify the value to retention.',
      },
    ],
  },
};


/* Build lookup indexes so the public helpers don't re-scan the
   full arrays on every call.
     BY_SECTOR — category → competitors that play in that sector,
       sorted by mcap desc. Generic fallback for unprofiled subnets.
     COMPETITORS_BY_ID — id → competitor entry, for fast resolution
       of the per-netuid id lists.
     SUPPLY_CHAIN_BY_ID — id → supply-chain entry, ditto. */
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
const COMPETITORS_BY_ID = (() => {
  const idx = {};
  for (const c of COMPETITORS) idx[c.id] = c;
  return idx;
})();
const SUPPLY_CHAIN_BY_ID = (() => {
  const idx = {};
  for (const c of SUPPLY_CHAIN) idx[c.id] = c;
  return idx;
})();

/**
 * Resolve a subnet to its institutional-grade competitor profile.
 *
 * Returns three layers for the cockpit's VS block:
 *   rivals[]:      direct competitors that produce/deliver what
 *                  this subnet is decentralizing.
 *   supplyChain[]: upstream entities (chips, fabs, HBM, hyperscale
 *                  cloud, power) that the rivals all depend on.
 *                  Surfacing this is the magazine's edge — it shows
 *                  the physical-world stack the decentralized
 *                  network is either circumventing or inheriting.
 *   constraints[]: physical-world bottlenecks specific to this
 *                  subnet's work — H100 supply lock, power per GPU,
 *                  capex per cluster, etc.
 *
 * If the subnet has a profiled BY_NETUID entry, all three layers
 * come from there (curated). Otherwise we fall back to BY_SECTOR
 * for rivals and return empty supplyChain + constraints — the
 * desk hasn't profiled that subnet's stack yet.
 *
 * @param {{netuid?: number, cat?: string}} s  Subnet object.
 * @param {{limit?: number}} [opts]  Caps rivals[] (default 4).
 * @returns {{
 *   rivals: Competitor[],
 *   supplyChain: SupplyChainEntity[],
 *   constraints: Array<{label: string, value: string, note?: string}>,
 *   profiled: boolean
 * }}
 */
export function competitorsForSubnet(s, opts = {}){
  const limit = Number.isFinite(opts.limit) ? opts.limit : 4;
  const empty = { rivals: [], supplyChain: [], constraints: [], profiled: false };
  if (!s) return empty;
  /* Per-netuid profile takes precedence — that's the curated
     editorial layer with subnet-specific direct rivals + supply
     chain + constraints. */
  const profile = BY_NETUID[s.netuid];
  if (profile){
    return {
      rivals:      (profile.rivals || []).map(id => COMPETITORS_BY_ID[id]).filter(Boolean).slice(0, Math.max(0, limit)),
      supplyChain: (profile.supplyChainIds || []).map(id => SUPPLY_CHAIN_BY_ID[id]).filter(Boolean),
      constraints: (profile.constraints || []).slice(),
      profiled: true,
    };
  }
  /* Fallback: per-category mcap sort. No supply chain or
     constraints surfaced — the editorial desk hasn't profiled
     this subnet's stack yet. The renderer can show an "expand
     coverage" affordance pointing back to the magazine. */
  if (!s.cat) return empty;
  const sector = String(s.cat).toLowerCase();
  const matches = BY_SECTOR[sector] || [];
  return {
    rivals: matches.slice(0, Math.max(0, limit)),
    supplyChain: [],
    constraints: [],
    profiled: false,
  };
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

/* CENTRALIZED_NEWS lives in src/data/centralized-news.js — it's
   the same dataset newsForSubnet() reads. We import it here so
   newsForCompetitor can filter the same feed by company match.
   This module owns the COMPETITOR side of that join; the news
   module owns the FEED side. */
import { CENTRALIZED_NEWS } from './centralized-news.js';

/**
 * Filter the centralized news feed to items that mention a given
 * competitor by name, ticker, or alias.
 *
 * Match logic (case-insensitive):
 *   1. Exact match in item.subjects[] (the curated subjects tag)
 *   2. Fallback substring match in item.headline + item.source
 *
 * This dual-pass lets us pick up both items explicitly tagged
 * (the cleanest signal) and items where the company is named in
 * the headline body (broader coverage). Use sparingly — the
 * cockpit pulls 2-3 per rival to keep the expanded card tight.
 *
 * @param {{id: string, name: string, ticker?: string, aliases?: string[]}} c
 * @param {number} [limit=3]  Max items returned.
 * @returns {Array} Sorted newest-first, capped at `limit`.
 */
export function newsForCompetitor(c, limit = 3){
  if (!c) return [];
  /* Build the set of alias strings we'll try matching against
     the news subjects + headlines. Drop the placeholder tokens
     ('PRIVATE', '—') and lowercase everything once up front. */
  const tokens = [c.name, c.ticker, ...(c.aliases || [])]
    .filter(t => t && t !== 'PRIVATE' && t !== '—')
    .map(t => String(t).toLowerCase());
  if (!tokens.length) return [];
  /* Pass 1: exact subject tag match. */
  const tagged = CENTRALIZED_NEWS.filter(item => {
    const subjectsLower = (item.subjects || []).map(s => String(s).toLowerCase());
    return tokens.some(tok => subjectsLower.includes(tok));
  });
  /* Pass 2: headline / source substring match for items not
     already picked up by the tag pass. Avoids double-counting
     and keeps the curated-tag items at the front of the result. */
  const taggedIds = new Set(tagged.map(i => i.id));
  const substringHits = CENTRALIZED_NEWS.filter(item => {
    if (taggedIds.has(item.id)) return false;
    const hay = ((item.headline || '') + ' ' + (item.source || '')).toLowerCase();
    return tokens.some(tok => hay.includes(tok));
  });
  return [...tagged, ...substringHits]
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    .slice(0, Math.max(0, limit));
}

/**
 * Procedural mini-sparkline SVG, deterministic per competitor id.
 * Renders a 40×14px hairline path showing a synthetic 30-bar
 * recent-trend shape — drawn from a seeded random walk weighted
 * toward the competitor's known delta24h direction (so the spark
 * VISUALLY agrees with the headline ±% the reader sees beside
 * it). For private companies (no delta24h) the walk is neutral.
 *
 * This is a PLACEHOLDER until real historical equity series are
 * wired into a live feed (next pass). Same compact register
 * taostats / Bloomberg terminals use for inline tickers.
 *
 * @param {{id: string, delta24h?: number}} c
 * @param {string} [color='currentColor']
 * @returns {string} Inline SVG ready to drop in a template.
 */
export function competitorSparkSvg(c, color = 'currentColor'){
  /* Seed the RNG from the competitor id so the spark is stable
     across renders. Same hash trick the dashboard's micro-sparks
     use elsewhere in the codebase. */
  let seed = 0;
  const idStr = String((c && c.id) || 'x');
  for (let i = 0; i < idStr.length; i++) seed = ((seed << 5) - seed + idStr.charCodeAt(i)) | 0;
  let state = (Math.abs(seed) * 1103515245 + 12345) >>> 0;
  const rnd = () => { state = (state * 1103515245 + 12345) >>> 0; return ((state >>> 16) & 0x7FFF) / 0x7FFF; };
  /* Bias the walk slightly in the direction of delta24h so the
     spark's last leg matches the headline ±% next to it. */
  const bias = c && Number.isFinite(c.delta24h) ? Math.sign(c.delta24h) * 0.04 : 0;
  const N = 30, W = 40, H = 14;
  let v = H / 2;
  const pts = [];
  for (let i = 0; i < N; i++){
    v += (rnd() - 0.5) * 1.6 - bias * (i / N);
    if (v < 1) v = 1; if (v > H - 1) v = H - 1;
    const x = (i / (N - 1)) * W;
    pts.push(x.toFixed(1) + ',' + v.toFixed(1));
  }
  return `<svg class="cock-side-vs__spark" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-hidden="true" preserveAspectRatio="none"><polyline fill="none" stroke="${color}" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" points="${pts.join(' ')}"/></svg>`;
}
