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

  /* ---------- LLM routing / aggregator (PatRouter profile) ---------- */
  {
    id: 'openrouter',
    name: 'OpenRouter',
    ticker: 'PRIVATE',
    mcap: 180_000_000,
    source: 'private',
    sectors: ['agents', 'text'],
    url: 'https://openrouter.ai',
    why: 'The dominant LLM routing layer — picks model + price per prompt across 300+ models from every major provider. THE direct centralized rival for any subnet routing across model marketplaces; readers comparing decentralized routers should know OpenRouter is the price-floor they have to beat.',
    aliases: ['OpenRouter.ai'],
  },

  /* ---------- AI cybersecurity / model security (RedTeam + Bitsec profiles) ----------
     The centralized AI-security stack that decentralized red-team
     + exploit-finding subnets compete with. Three sub-segments:
       1. Model-security platforms (HiddenLayer, Protect AI) —
          detect adversarial inputs, model theft, training-data
          poisoning at the MLOps layer.
       2. AI red-team-as-a-service (Adversa AI) — paid pen-test
          for LLMs + computer-vision systems.
       3. Autonomous vuln-discovery models (XBOW Mythos2) — AI
          agents that find software exploits the way a security
          researcher would. The 2026 benchmark moved here:
          "surpassing all but the most skilled humans" per the
          desk's daily briefing.
     Frontier labs (Anthropic, OpenAI, Google DeepMind) also run
     internal red-team practices — those entries already exist in
     the catalog and surface alongside these for security subnets. */
  {
    id: 'hiddenlayer',
    name: 'HiddenLayer',
    ticker: 'PRIVATE',
    mcap: 750_000_000,
    source: 'private',
    sectors: ['agents', 'data'],
    url: 'https://hiddenlayer.com',
    why: 'Self-styled "first AI security company" — detects model theft, adversarial inputs, prompt injection at the MLOps layer. ~$70M raised across A + B. Direct centralized rival for any subnet validating model integrity or surfacing AI attack surface.',
    aliases: ['Hidden Layer'],
  },
  {
    id: 'adversa-ai',
    name: 'Adversa AI',
    ticker: 'PRIVATE',
    mcap: 60_000_000,
    source: 'private',
    sectors: ['agents'],
    url: 'https://adversa.ai',
    why: 'AI red-team-as-a-service — Tel Aviv shop running paid pen-tests against LLMs, vision systems, biometrics. Authors of the "LLM Security Top 10" reference. Decentralized red-team subnets have to either match the depth of their attack catalog or accept second-tier engagements.',
  },
  {
    id: 'xbow',
    name: 'XBOW',
    ticker: 'PRIVATE',
    mcap: 200_000_000,
    source: 'private',
    sectors: ['agents'],
    url: 'https://xbow.com',
    why: 'Autonomous vulnerability-discovery AI — the Mythos2 model "surpassing all but the most skilled humans" at exploit-finding per the desk\'s daily briefing. THE direct rival for any subnet incentivizing AI-driven security research; readers comparing decentralized vuln-discovery should know XBOW is the benchmark to beat.',
    aliases: ['Mythos', 'Mythos2'],
  },
  {
    id: 'protect-ai',
    name: 'Protect AI',
    ticker: 'PRIVATE',
    mcap: 350_000_000,
    source: 'private',
    sectors: ['agents', 'data'],
    url: 'https://protectai.com',
    why: 'MLSecOps platform — scans model artifacts (HuggingFace, OCI, ONNX) for embedded backdoors + license violations + vulnerable dependencies. Closes the supply-chain attack surface for enterprise AI deployments. Decentralized model-distribution subnets carry the same attack surface without Protect AI\'s static-analysis depth.',
  },
  {
    id: 'mithril-security',
    name: 'Mithril Security',
    ticker: 'PRIVATE',
    mcap: 35_000_000,
    source: 'private',
    sectors: ['agents', 'data'],
    url: 'https://mithrilsecurity.io',
    why: 'Confidential AI inference — runs LLMs inside Intel TDX / NVIDIA H100 confidential-compute enclaves so prompts + model weights stay sealed from the operator. Rival for any decentralized inference subnet making privacy claims; trusts a different chain of custody than miner-attested compute.',
  },

  /* ---------- LLM-driven agent benchmarks / arenas (AgentArena profile) ---------- */
  {
    id: 'lmsys-chatbot-arena',
    name: 'LMSYS Chatbot Arena',
    ticker: 'NONPROFIT',
    mcap: null,
    source: 'private',
    sectors: ['agents', 'text'],
    url: 'https://chat.lmsys.org',
    why: 'Human-vote LLM ranking arena from UC Berkeley LMSYS — the de facto industry leaderboard most labs cite. Decentralized agent-vs-agent benchmarks have to either match its sample size (~1M votes) or differentiate on task realism / tool-use depth.',
    aliases: ['LMSYS', 'Chatbot Arena'],
  },
  {
    id: 'evidently-ai',
    name: 'Evidently AI',
    ticker: 'PRIVATE',
    mcap: 90_000_000,
    source: 'private',
    sectors: ['agents'],
    url: 'https://evidentlyai.com',
    why: 'Open-source LLM observability + eval toolkit, ~25K GitHub stars. Strong rival in the offline-eval space — subnet benchmark arenas have to surface signal Evidently can\'t (live competitive matchups, head-to-head ranking).',
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
  /* ============================================================
     STRIPPED ON 2026-05-22 (Rondo "B" cleanup path):
       SN 2, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 18, 19, 20, 21,
          24, 25, 27, 30, 36, 42, 47
     These netuids had been profiled against the LOCAL
     subnets.js identity (Omron, OpenKaito, Nous, SubVortex, ...)
     but live taomarketcap.com on-chain identity_v3 records
     show the netuids re-registered to different teams (DSperse,
     Hone, Numinous, Allways, ...). Per the editorial rule
     ("don\'t make same mistake — make sure deregistered subnets
     are not talked about"), the wrong-identity rival comparisons
     came out. Cockpit falls back to sector-default rivals
     (BY_SECTOR table) for these netuids until each gets rebuilt
     from live identity. Reference: subnets-live-2026-05-22.json.
     ============================================================ */

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

  /* SN39 — DEPRECATED on chain as of 2026-05-22 (subnetName +
     description both "deprecated"). Profile removed per the
     editorial rule: never surface rival comparisons for a
     subnet that no longer exists. The local subnets.js still
     carries the stale "EdgeMaxxing" identity and is queued for
     correction. */
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
  /* SN56 Gradients — No-code finetuning service, miners auto-
     train, validators score eval loss. The Rayon Labs "G.O.D"
     codebase. Rivals are the hosted finetuning markets where
     a customer pastes a dataset + clicks "finetune" and a
     model URL comes back. Hugging Face AutoTrain is the free
     anchor; Together AI + Replicate + Modal are the paid
     finetune-as-a-service tier; Databricks (post-Mosaic
     acquisition) is the enterprise tier. */
  56: {
    rivals: ['hugging-face', 'together-ai', 'replicate', 'modal-labs', 'databricks'],
    supplyChainIds: ['nvidia', 'tsmc', 'sk-hynix', 'aws-azure-gcp'],
    constraints: [
      {
        label: 'GPU $/finetune-hour',
        value: 'H100 ≈ $2-4/hr · A100 ≈ $1-2/hr',
        note: 'Finetuning markets are GPU-cost-bound — every $0.10 spread between providers compresses the subnet\'s reward margin. CoreWeave + Lambda set the floor; subnet miners have to undercut it on amortized cost or beat on eval-loss quality.',
      },
      {
        label: 'Eval-loss objective gaming',
        value: 'Reward-hacking surface',
        note: 'Miners optimize what validators score. If the eval metric is loss on a held-out set, miners overfit to that set\'s distribution; if it\'s MMLU/HELM, contamination during pretraining hides the cheat. Validator score function design IS the subnet\'s defense.',
      },
      {
        label: 'Customer dataset privacy',
        value: 'Tenant-isolation hard on shared GPUs',
        note: 'Centralized rivals run dedicated tenancy + signed BAAs for HIPAA / finance customers. A decentralized subnet has miners on commodity hardware — proving dataset doesn\'t leak between finetune jobs is an unsolved trust problem.',
      },
      {
        label: 'Base-model licensing',
        value: 'Llama / Mistral / Qwen ToS',
        note: 'Most finetune jobs start from a base model with a license (Llama 3 forbids competitive use against Meta; Mistral has commercial gates). Subnet miners inherit these licenses — and customers using the output do too.',
      },
      {
        label: 'Time-to-first-checkpoint',
        value: 'Centralized: minutes · Subnet: hours-days',
        note: 'AutoTrain / Together return a checkpoint in 10-60 minutes for typical LoRA jobs. Subnet finetune competitions run for 12-48 hours by design (multi-miner training rounds). That latency gap is the centralized rival\'s primary moat.',
      },
    ],
  },

  /* SN59 Babelbit — Decentralized translation LLMs (live
     identity per taostats subnet_identities_v3 2026-05-22;
     local subnets.js still carried the stale "AgentArena"
     name and is queued for correction). Rivals are the
     translation-grade LLMs + the long-tail translation
     services that enterprise readers benchmark against.
     DeepL still leads on European-pair quality + privacy;
     Google Translate is the consumer floor; OpenAI/Anthropic
     dominate code-switched / cultural-context translation;
     Meta No Language Left Behind (NLLB-200) is the low-resource
     language anchor. */
  59: {
    rivals: ['openai', 'anthropic', 'google', 'meta', 'cohere'],
    supplyChainIds: ['nvidia', 'aws-azure-gcp', 'tsmc', 'sk-hynix'],
    constraints: [
      {
        label: 'Low-resource language gap',
        value: '50+ languages with <1M training tokens',
        note: 'Meta NLLB-200 covers 200 languages but quality below the top 30 falls off a cliff. Frontier LLMs (GPT-4o, Claude 3.7) cover ~50 well. Subnet has to either match the frontier on the common pairs or chase the long tail where centralized rivals don\'t care enough to invest.',
      },
      {
        label: 'BLEU / COMET score gaming',
        value: 'Reward hacks the reference text',
        note: 'Translation scoring uses BLEU (n-gram overlap with reference) or COMET (learned metric). Both can be hacked — miners learn to produce reference-like output rather than meaning-faithful translation. Subnet validator design has to mix automated scoring with human / LLM-as-judge eval.',
      },
      {
        label: 'Privacy & data residency',
        value: 'GDPR / China data laws bite hard',
        note: 'Enterprise translation customers (legal, medical, finance) can\'t send documents to OpenAI / Google due to data-residency rules. DeepL Pro markets exactly this gap. Subnet has the SAME compliance surface — miner-side data leaks kill enterprise revenue.',
      },
      {
        label: 'Latency for real-time translation',
        value: '200-400ms p95 for chat / video',
        note: 'Live translation (subtitling, chat, calls) needs sub-400ms p95 latency. Frontier API providers hit this; subnet inference adds miner-validator round trips. Cuts subnet out of the highest-margin live-translation segment unless inference is co-located.',
      },
      {
        label: 'Cultural-context evaluation',
        value: 'No standard metric for cultural fidelity',
        note: 'Translation isn\'t just word-mapping — idiom, register, cultural reference, gender systems all matter. No automated metric catches this. Centralized rivals invest in human eval at scale; subnet has to crowdsource native-speaker validators or accept that BLEU misses the hard part.',
      },
    ],
  },

  /* SN61 RedTeam by Innerworks — Cybersecurity competitive
     programming (live identity per taostats 2026-05-22;
     local subnets.js had the stale "Red-Team Labs" + science
     cat). The platform incentivizes miners to develop and
     submit security solutions to technical challenges.
     Rival pool spans three layers: (1) the dedicated AI-security
     companies (XBOW Mythos2, HiddenLayer, Adversa AI, Protect
     AI, Mithril, Robust Intelligence, Lakera) that customers
     would otherwise pay for an audit; (2) the frontier labs
     (Anthropic, OpenAI, Google) that run internal red-team
     practices and publish safety research; (3) the broader
     eval / data shops (Patronus, Scale) that ship adjacent
     security evals. XBOW leads — its Mythos2 surpasses
     skilled humans at vuln discovery per the desk's briefing. */
  61: {
    rivals: ['xbow', 'hiddenlayer', 'adversa-ai', 'protect-ai', 'mithril-security', 'anthropic', 'openai', 'robust-intelligence', 'lakera', 'patronus-ai'],
    supplyChainIds: ['nvidia', 'aws-azure-gcp', 'cloudflare-edge'],
    constraints: [
      {
        label: 'Vuln-disclosure ethics',
        value: 'CVE coordination + 90-day windows',
        note: 'Bug-bounty programs run coordinated disclosure — find a vuln, file with vendor, public CVE after fix. Subnet incentivizes finding + submitting — but premature on-chain publication of an unpatched vuln is a real-world legal + ethical surface. Validator scoring has to gate disclosure.',
      },
      {
        label: 'Bug-bounty $ vs subnet emission',
        value: 'HackerOne payouts: $500-$50K per crit',
        note: 'Top white-hats earn six figures from HackerOne / Bugcrowd / Immunefi. Subnet emission has to either match cash rates for top-tier vulns or accept second-tier hunters. The talent-attraction math is brutal at the top end of the security stack.',
      },
      {
        label: 'Code-execution sandbox cost',
        value: 'Isolated VM per submitted challenge',
        note: 'Running miner-submitted security code against test challenges needs proper isolation — escape-proof sandboxes, ephemeral compute. Centralized rivals (Robust Intelligence) own this infra. Subnet validators have to either run sandboxes themselves (cost) or trust miner-attested execution (security regress).',
      },
      {
        label: 'AI-generated exploit risk',
        value: 'Dual-use weaponization concern',
        note: 'A subnet that competitively trains models to find exploits ALSO trains them to write exploits at scale. Centralized rivals navigate this via internal-use policies + employee NDAs. Decentralized subnet — by definition open — has to address the dual-use surface in validator rules or face regulatory pressure.',
      },
      {
        label: 'Challenge-set freshness',
        value: 'Public CVE feed staleness',
        note: 'Training on yesterday\'s CVEs teaches yesterday\'s patterns. Real attackers find tomorrow\'s. Subnet must rotate challenge sets faster than the public CVE feed — which means a curation team that\'s itself a security org, with its own talent cost.',
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
