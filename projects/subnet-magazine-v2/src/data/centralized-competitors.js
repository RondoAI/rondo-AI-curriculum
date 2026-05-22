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

  /* ---------- LLM serving / long-context / reasoning / agent infra
     (Quasar SN24, TensorClaw SN92, Affine SN120, SOMA SN114, etc) ---------- */
  {
    id: 'ai21-labs',
    name: 'AI21 Labs',
    ticker: 'PRIVATE',
    mcap: 1_400_000_000,
    source: 'private',
    sectors: ['text'],
    url: 'https://www.ai21.com',
    why: 'Tel Aviv lab behind Jurassic + Jamba models — pioneered Mamba/Transformer hybrid for long-context (256K+) efficiency. Direct rival for long-context subnets; their architecture choices set the bar for "serve longer context at lower cost than Claude/Gemini."',
    aliases: ['AI21', 'Jamba'],
  },
  {
    id: 'aws-bedrock',
    name: 'AWS Bedrock',
    ticker: 'AMZN',
    mcap: 2_300_000_000_000,
    source: 'public',
    sectors: ['text', 'infra'],
    url: 'https://aws.amazon.com/bedrock',
    why: 'Amazon\'s managed LLM endpoint — hosts Anthropic, Meta, Mistral, AI21, Cohere, Amazon Nova behind a single API + IAM gating. The enterprise default for AI inference; decentralized inference subnets compete with the AWS distribution moat + compliance story.',
    aliases: ['Bedrock'],
  },
  {
    id: 'anyscale',
    name: 'Anyscale',
    ticker: 'PRIVATE',
    mcap: 1_000_000_000,
    source: 'private',
    sectors: ['infra', 'training'],
    url: 'https://www.anyscale.com',
    why: 'Ray-based distributed compute platform — runs LLM serving + training at scale, founded by Ray creators. Direct rival for decentralized inference subnets pitching "GPU cluster as a service"; Anyscale\'s Ray Serve is the dominant pattern in the centralized world.',
  },
  {
    id: 'composio',
    name: 'Composio',
    ticker: 'PRIVATE',
    mcap: 70_000_000,
    source: 'private',
    sectors: ['agents'],
    url: 'https://composio.dev',
    why: 'Tools-as-API platform for AI agents — 250+ integrations (GitHub, Slack, Linear, Notion, etc) packaged as auth-handled, retry-safe agent tools. Rival for any subnet pitching MCP / tool-use infrastructure; Composio\'s integration depth is the centralized standard.',
  },
  {
    id: 'langchain',
    name: 'LangChain',
    ticker: 'PRIVATE',
    mcap: 1_100_000_000,
    source: 'private',
    sectors: ['agents'],
    url: 'https://www.langchain.com',
    why: 'Dominant agent-orchestration framework + LangSmith eval platform — every enterprise pilot using agents touches LangChain. Centralized rival for any subnet shipping agent infra; the LangGraph state-machine pattern is the de facto orchestration standard.',
    aliases: ['LangSmith', 'LangGraph'],
  },

  /* ---------- Software engineering agents (SN62 Ridges / SN66 ninja / SN11 TrajectoryRL) ----------
     The 2026 SWE-agent space is consolidating fast. Three
     buckets the readers will compare against:
       1. Editor-resident copilots (Cursor, Codeium, GitHub
          Copilot, Claude Code) — agent runs inside the IDE/CLI.
       2. Autonomous SWE agents (Cognition Devin, Replit Agent)
          — agent given a task, returns a PR or running app.
       3. RL-trained agent foundries (Sakana AI) — labs
          producing agent-policy weights via evolutionary / RL
          methods. */
  {
    id: 'cursor',
    name: 'Cursor (Anysphere)',
    ticker: 'PRIVATE',
    mcap: 10_000_000_000,
    source: 'private',
    sectors: ['agents', 'text'],
    url: 'https://www.cursor.com',
    why: 'Editor-resident AI pair programmer — fastest-growing dev tool of 2024-2025, ~$10B valuation by mid-2025. Default rival for any subnet shipping coding agents; readers comparing decentralized SWE agents have to clear the Cursor benchmark (latency, accuracy, repo-context handling).',
    aliases: ['Anysphere'],
  },
  {
    id: 'cognition-devin',
    name: 'Cognition (Devin)',
    ticker: 'PRIVATE',
    mcap: 2_000_000_000,
    source: 'private',
    sectors: ['agents'],
    url: 'https://devin.ai',
    why: 'Autonomous software engineer that turns tickets into PRs end-to-end — Devin agent runs in cloud VM, edits code, runs tests, opens reviews. The "agent does the whole job" benchmark — what subnet SWE agents are explicitly building toward.',
    aliases: ['Devin'],
  },
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    ticker: 'MSFT',
    mcap: 3_400_000_000_000,
    source: 'public',
    sectors: ['agents', 'text'],
    url: 'https://github.com/features/copilot',
    why: 'Microsoft-owned, deepest install base — ~2M paid seats, ships Workspace + Autofix + Agent modes. Distribution moat (every GitHub PR can opt in) is the hardest centralized advantage decentralized SWE subnets have to overcome.',
    aliases: ['Copilot'],
  },
  {
    id: 'claude-code',
    name: 'Claude Code',
    ticker: 'PRIVATE',
    mcap: null,
    source: 'private',
    sectors: ['agents', 'text'],
    url: 'https://www.anthropic.com/claude-code',
    why: 'Anthropic\'s terminal-native coding agent — sits in the user\'s shell with full FS + bash + git access, executes multi-step code tasks. Strong rival for SWE-agent subnets because the integration surface is shell-level, not editor-extension-level.',
  },
  {
    id: 'replit-agent',
    name: 'Replit Agent',
    ticker: 'PRIVATE',
    mcap: 1_200_000_000,
    source: 'private',
    sectors: ['agents'],
    url: 'https://replit.com/site/agent',
    why: 'Browser-resident autonomous agent — describes app idea in plain English, agent builds + deploys it. The "anyone can ship" tier of agent tooling. Decentralized agents have to either match the zero-setup UX or differentiate on cost/customization.',
  },
  {
    id: 'codeium-windsurf',
    name: 'Codeium / Windsurf',
    ticker: 'PRIVATE',
    mcap: 1_500_000_000,
    source: 'private',
    sectors: ['agents', 'text'],
    url: 'https://codeium.com',
    why: 'Free-tier-aggressive AI code editor — captured the "Cursor is too expensive" tier of dev tools. Windsurf launched the "Cascade" agent mode in 2024. Subnet SWE agents need to clear the free-tier Codeium baseline to attract individual devs.',
    aliases: ['Codeium', 'Windsurf'],
  },
  {
    id: 'sakana-ai',
    name: 'Sakana AI',
    ticker: 'PRIVATE',
    mcap: 1_500_000_000,
    source: 'private',
    sectors: ['agents', 'training'],
    url: 'https://sakana.ai',
    why: 'Tokyo lab pioneering evolutionary + RL methods for agent + model training — the "AI Scientist" agent that runs ML research end-to-end. Direct rival for any subnet training agent policies via RL on trajectories; Sakana publishes weights + papers, raising the public bar.',
  },

  /* ---------- Remaining catalog rivals: data/ads/real estate/creator economy/
     mining pools/quantum (final 31-subnet curation batch) ---------- */
  {
    id: 'bright-data',
    name: 'Bright Data',
    ticker: 'PRIVATE',
    mcap: 1_400_000_000,
    source: 'private',
    sectors: ['data'],
    url: 'https://brightdata.com',
    why: 'Largest commercial web-scraping platform — proxy infrastructure + structured data feeds. ~$160M revenue. Default rival for any subnet pitching social-media scraping or web-data extraction at scale.',
  },
  {
    id: 'apify',
    name: 'Apify',
    ticker: 'PRIVATE',
    mcap: 200_000_000,
    source: 'private',
    sectors: ['data'],
    url: 'https://apify.com',
    why: 'Web scraping + automation platform — marketplace of ~1500 scrapers (Twitter, Instagram, TikTok). Rival for subnet "scraping the world\'s social media data" plays.',
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    ticker: 'CRM',
    mcap: 280_000_000_000,
    source: 'public',
    sectors: ['agents', 'data'],
    url: 'https://www.salesforce.com',
    why: 'Dominant CRM + Einstein AI / Agentforce. Direct rival for any subnet pitching AI sales agents; Salesforce owns the workflow + customer data the agents would operate on.',
    delta24h: 0.1,
    aliases: ['CRM', 'Agentforce', 'Einstein'],
  },
  {
    id: 'apollo-io',
    name: 'Apollo.io',
    ticker: 'PRIVATE',
    mcap: 1_600_000_000,
    source: 'private',
    sectors: ['agents', 'data'],
    url: 'https://www.apollo.io',
    why: 'B2B sales intelligence platform — ~250M+ contact database + AI outreach. ~$100M ARR. Direct rival for subnet "intent-driven AI sales" plays; Apollo\'s data moat is its main asset.',
  },
  {
    id: 'zillow',
    name: 'Zillow Group',
    ticker: 'ZG',
    mcap: 14_000_000_000,
    source: 'public',
    sectors: ['data'],
    url: 'https://www.zillow.com',
    why: 'Dominant US real-estate data + listings — Zestimate AI valuation. Direct rival for any "real estate intelligence" subnet; Zillow\'s data + traffic moat is multi-decade.',
    delta24h: 0.4,
    aliases: ['Zestimate', 'ZG'],
  },
  {
    id: 'redfin',
    name: 'Redfin',
    ticker: 'RDFN',
    mcap: 1_500_000_000,
    source: 'public',
    sectors: ['data'],
    url: 'https://www.redfin.com',
    why: 'Real-estate brokerage + data — AI-driven home valuations + market analytics. Rival for "real estate intelligence" subnet plays in the US market.',
    aliases: ['RDFN'],
  },
  {
    id: 'foundry-digital',
    name: 'Foundry Digital',
    ticker: 'PRIVATE',
    mcap: 2_500_000_000, // DCG-owned, estimated
    source: 'private',
    sectors: ['finance', 'infra'],
    url: 'https://foundrydigital.com',
    why: 'Largest BTC mining pool by hashrate (~30% of network) — owned by DCG. Direct rival for any subnet pitching BTC mining-pool integration; Foundry\'s scale + institutional customers set the bar.',
    aliases: ['FoundryUSA'],
  },
  {
    id: 'antpool',
    name: 'Antpool',
    ticker: 'PRIVATE',
    mcap: null,
    source: 'private',
    sectors: ['finance'],
    url: 'https://www.antpool.com',
    why: 'Bitmain-affiliated mining pool — second-largest BTC hashrate. Direct rival for BTC mining-pool subnet plays at the operator tier.',
  },
  {
    id: 'patreon',
    name: 'Patreon',
    ticker: 'PRIVATE',
    mcap: 4_000_000_000,
    source: 'private',
    sectors: ['data'],
    url: 'https://www.patreon.com',
    why: 'Creator economy subscription platform — ~250K paid creators. Direct rival for any subnet pitching "decentralized creator economy" with subscription monetization.',
  },
  {
    id: 'substack',
    name: 'Substack',
    ticker: 'PRIVATE',
    mcap: 650_000_000,
    source: 'private',
    sectors: ['data'],
    url: 'https://substack.com',
    why: 'Newsletter + monetized writing platform. Substack Notes for social + Live for podcasts/video. Rival for decentralized creator economy at the writer/publication tier.',
  },
  {
    id: 'onlyfans',
    name: 'OnlyFans (Fenix Intl)',
    ticker: 'PRIVATE',
    mcap: 6_000_000_000,
    source: 'private',
    sectors: ['data'],
    url: 'https://onlyfans.com',
    why: 'Largest creator monetization platform by revenue (~$6.6B GMV, 2.1M creators). Demonstrates creator-pays-creator economics at scale. Decentralized creator economy subnets compete with the creator earnings + payout infrastructure.',
  },
  {
    id: 'character-ai-v2',
    name: 'Character.AI',
    ticker: 'PRIVATE',
    mcap: 2_500_000_000,
    source: 'private',
    sectors: ['agents'],
    url: 'https://character.ai',
    why: 'Persona-chat platform — ~20M+ MAU. Strong rival for any AI-companion subnet pitch (SN119 Satori); Character.AI proved the consumer demand + the engagement-metric gaming problem.',
  },
  {
    id: 'replika',
    name: 'Replika',
    ticker: 'PRIVATE',
    mcap: 100_000_000,
    source: 'private',
    sectors: ['agents'],
    url: 'https://replika.com',
    why: 'AI companion app — pioneer in the space, ~10M+ users. Subscription-monetized. Direct rival for AI-companion subnet plays; Replika navigated NSFW + Italy-ban surface that decentralized rivals would inherit.',
  },
  {
    id: 'pokerstars',
    name: 'PokerStars',
    ticker: 'PRIVATE',
    mcap: 21_000_000_000, // Flutter Entertainment parent
    source: 'public',
    sectors: ['finance'],
    url: 'https://www.pokerstars.com',
    why: 'Largest online poker platform — Flutter Entertainment-owned. Default rival for any "decentralized poker" subnet (SN126); PokerStars\' regulatory + liquidity moat is the bar.',
  },
  {
    id: 'wpt-global',
    name: 'WPT Global',
    ticker: 'PRIVATE',
    mcap: 200_000_000,
    source: 'private',
    sectors: ['finance'],
    url: 'https://www.wptglobal.com',
    why: 'World Poker Tour\'s online platform — competitive with PokerStars + GGPoker for crypto-accepting poker. Rival for decentralized poker subnets.',
  },
  {
    id: 'duolingo',
    name: 'Duolingo',
    ticker: 'DUOL',
    mcap: 13_000_000_000,
    source: 'public',
    sectors: ['agents'],
    url: 'https://www.duolingo.com',
    why: 'AI-driven language + skill learning — Duolingo Max ships GPT-4-powered tutoring. Direct rival for any subnet pitching AI tutoring or skill-acquisition agents.',
    aliases: ['DUOL'],
  },
  {
    id: 'eleven-labs',
    name: 'ElevenLabs (voice)',
    ticker: 'PRIVATE',
    mcap: 3_300_000_000,
    source: 'private',
    sectors: ['audio'],
    url: 'https://elevenlabs.io',
    why: 'Voice cloning + TTS leader — ~10B characters generated monthly. Direct rival for any "voice layer" subnet (SN78 Vocence); ElevenLabs\' quality + ecosystem is the bar to clear.',
  },

  /* ---------- Infra / compute / VPN / storage / bandwidth / txn-layer
     (SN7/27/51/64/65/75/105/110/128 profiles) ---------- */
  {
    id: 'filecoin',
    name: 'Filecoin',
    ticker: 'FIL',
    mcap: 2_400_000_000,
    source: 'private',
    sectors: ['infra', 'data'],
    url: 'https://filecoin.io',
    why: 'Decentralized storage protocol — ~20 EiB of provider-attested storage capacity. The default rival for any subnet pitching blockchain-backed cloud storage; Filecoin\'s storage providers + retrieval markets are the multi-year baseline.',
    aliases: ['FIL'],
  },
  {
    id: 'arweave',
    name: 'Arweave',
    ticker: 'AR',
    mcap: 800_000_000,
    source: 'private',
    sectors: ['infra', 'data'],
    url: 'https://arweave.org',
    why: 'Permanent storage protocol — pay once, store forever (or ~200 years per economic model). Powers AO (Arweave\'s compute layer). Direct rival for any subnet "permanent on-chain content" pitch.',
    aliases: ['AR'],
  },
  {
    id: 'storj',
    name: 'Storj',
    ticker: 'STORJ',
    mcap: 200_000_000,
    source: 'private',
    sectors: ['infra'],
    url: 'https://www.storj.io',
    why: 'Decentralized cloud object storage — S3-compatible API, ~$0.004/GB pricing. Direct rival for subnet decentralized-cloud plays at the consumer-storage tier.',
  },
  {
    id: 'ipfs-protocol',
    name: 'IPFS / Protocol Labs',
    ticker: 'NONPROFIT',
    mcap: null,
    source: 'private',
    sectors: ['infra'],
    url: 'https://ipfs.tech',
    why: 'Distributed file system — the protocol layer Filecoin + most decentralized-storage projects build on. Direct rival pattern for any subnet pitching content-addressed distribution.',
    aliases: ['IPFS'],
  },
  {
    id: 'mullvad',
    name: 'Mullvad VPN',
    ticker: 'PRIVATE',
    mcap: 100_000_000,
    source: 'private',
    sectors: ['infra'],
    url: 'https://mullvad.net',
    why: 'Privacy-first VPN — no-logs, anonymous account numbers, monero/cash payment. The gold-standard rival for any subnet pitching decentralized VPN; Mullvad\'s threat model + audits set the privacy bar.',
  },
  {
    id: 'proton-vpn',
    name: 'Proton VPN',
    ticker: 'PRIVATE',
    mcap: 800_000_000, // Proton AG broader
    source: 'private',
    sectors: ['infra'],
    url: 'https://protonvpn.com',
    why: 'Swiss-based VPN + Proton mail/drive ecosystem. Open-source clients, audited. Most-mainstream privacy VPN. Direct rival for subnet VPN plays in the consumer + small-business tier.',
  },
  {
    id: 'nordvpn',
    name: 'NordVPN (Nord Security)',
    ticker: 'PRIVATE',
    mcap: 1_600_000_000,
    source: 'private',
    sectors: ['infra'],
    url: 'https://nordvpn.com',
    why: 'Largest consumer VPN by users (~15M paid). Spend-heavy distribution moat (YouTube sponsorships + ads). Decentralized VPN subnets compete with the distribution + brand-trust moat NordVPN built over a decade.',
  },
  {
    id: 'fastly',
    name: 'Fastly',
    ticker: 'FSLY',
    mcap: 1_000_000_000,
    source: 'public',
    sectors: ['infra'],
    url: 'https://www.fastly.com',
    why: 'Edge cloud + CDN — Compute@Edge for serverless. Customers include Stripe, Shopify, NYT. Direct rival for subnet bandwidth / edge-compute plays.',
    delta24h: -0.5,
    aliases: ['FSLY'],
  },
  {
    id: 'akamai',
    name: 'Akamai Technologies',
    ticker: 'AKAM',
    mcap: 14_000_000_000,
    source: 'public',
    sectors: ['infra'],
    url: 'https://www.akamai.com',
    why: 'Largest enterprise CDN + cloud computing — Connected Cloud (Linode acquisition). Subnet bandwidth/CDN pitches face Akamai\'s 30+ years of enterprise relationships.',
    delta24h: 0.2,
    aliases: ['AKAM'],
  },
  {
    id: 'akash-network',
    name: 'Akash Network',
    ticker: 'AKT',
    mcap: 400_000_000,
    source: 'private',
    sectors: ['infra'],
    url: 'https://akash.network',
    why: 'Decentralized cloud computing on Cosmos — supercloud for GPUs + general compute. Direct rival for any subnet pitching blockchain-backed cloud; Akash has 3+ years of GPU marketplace track record + multiple AI customers.',
    aliases: ['AKT'],
  },
  {
    id: 'sentinel-dvpn',
    name: 'Sentinel',
    ticker: 'DVPN',
    mcap: 40_000_000,
    source: 'private',
    sectors: ['infra'],
    url: 'https://sentinel.co',
    why: 'Decentralized VPN protocol on Cosmos — incentivized bandwidth nodes worldwide. Direct rival for subnet decentralized-VPN plays; Sentinel proves the dVPN tokenomics pattern works (and where it struggles).',
    aliases: ['DVPN', 'dVPN'],
  },
  {
    id: 'mysterium-network',
    name: 'Mysterium Network',
    ticker: 'MYST',
    mcap: 25_000_000,
    source: 'private',
    sectors: ['infra'],
    url: 'https://www.mysterium.network',
    why: 'Decentralized VPN protocol — node operators rent residential bandwidth. Strong rival for subnet "developer-friendly decentralized VPN" pitch; Mysterium has SDK + Android app + 7+ years of operation.',
    aliases: ['MYST'],
  },
  {
    id: 'ethereum-l1',
    name: 'Ethereum',
    ticker: 'ETH',
    mcap: 350_000_000_000,
    source: 'private',
    sectors: ['finance', 'infra'],
    url: 'https://ethereum.org',
    why: 'Dominant smart-contract platform — $300B+ TVL across DeFi, NFT, RWA. Direct rival for any "universal transaction layer" pitch; Ethereum + L2s own the smart-contract execution layer the subnet would compete with.',
    aliases: ['ETH', 'Ethereum L1'],
  },
  {
    id: 'solana',
    name: 'Solana',
    ticker: 'SOL',
    mcap: 70_000_000_000,
    source: 'private',
    sectors: ['finance', 'infra'],
    url: 'https://solana.com',
    why: 'High-throughput L1 — ~50K TPS theoretical, dominant for memecoin + retail trading. Subnet "transaction layer" plays compete with Solana\'s high-throughput claim + DEX volume.',
    aliases: ['SOL'],
  },
  {
    id: 'cosmos-network',
    name: 'Cosmos (ATOM)',
    ticker: 'ATOM',
    mcap: 1_800_000_000,
    source: 'private',
    sectors: ['infra'],
    url: 'https://cosmos.network',
    why: 'Internet of Blockchains — IBC protocol connects 100+ app-chains. Cosmos SDK is the framework many subnet-adjacent infra projects use. Direct rival for "universal transaction layer" subnet plays.',
    aliases: ['ATOM', 'IBC'],
  },
  {
    id: 'helium-network',
    name: 'Helium',
    ticker: 'HNT',
    mcap: 600_000_000,
    source: 'private',
    sectors: ['infra'],
    url: 'https://www.helium.com',
    why: 'Decentralized wireless network — IoT + 5G hotspot deployment. ~600K hotspots globally. Direct rival for subnet "decentralized bandwidth" plays; Helium proved (then struggled with) the tokenomics-for-infrastructure pattern.',
    aliases: ['HNT'],
  },
  {
    id: 'amazon-aws-graviton',
    name: 'AWS Graviton',
    ticker: 'AMZN',
    mcap: 2_300_000_000_000,
    source: 'public',
    sectors: ['infra'],
    url: 'https://aws.amazon.com/ec2/graviton',
    why: 'AWS\' custom ARM-based silicon — best $/perf for many AI inference workloads. Graviton4 ships 2025. Direct rival for subnet "green compute" / efficient-inference plays; AWS owns the regulated-customer + carbon-accounting story.',
    aliases: ['Graviton'],
  },

  /* ---------- Science / research / genomics / drug discovery
     (SN23/25/26/37/55/67/68/83/94/100/107 profiles) ---------- */
  {
    id: 'illumina',
    name: 'Illumina',
    ticker: 'ILMN',
    mcap: 22_000_000_000,
    source: 'public',
    sectors: ['science', 'data'],
    url: 'https://www.illumina.com',
    why: 'Dominant DNA sequencing platform — NovaSeq + iSeq + MiSeq instruments are the global lab standard. Subnet "genomics" plays depend on Illumina-generated reads; the sequencing instrument moat is multi-decade.',
    delta24h: 0.1,
    aliases: ['ILMN'],
  },
  {
    id: 'tempus-ai',
    name: 'Tempus AI',
    ticker: 'TEM',
    mcap: 12_000_000_000,
    source: 'public',
    sectors: ['science', 'data'],
    url: 'https://www.tempus.com',
    why: 'AI-driven precision medicine — combines clinical + molecular + imaging data. Largest clinical-genomic database (~10M+ records). Direct rival for any subnet pitching genomic intelligence to oncology / pharma customers.',
    aliases: ['TEM'],
  },
  {
    id: '23andme',
    name: '23andMe',
    ticker: 'PRIVATE',
    mcap: 50_000_000,
    source: 'private',
    sectors: ['science'],
    url: 'https://www.23andme.com',
    why: 'Consumer DNA testing pioneer — went private 2024 after public-market collapse. Still holds the largest consumer genetic database (~15M kits). Subnet "privacy-safe genomics" plays direct rival; readers care about the database trust question 23andMe failed publicly.',
  },
  {
    id: 'insilico-medicine',
    name: 'Insilico Medicine',
    ticker: 'PRIVATE',
    mcap: 1_000_000_000,
    source: 'private',
    sectors: ['science'],
    url: 'https://insilico.com',
    why: 'AI drug discovery — first AI-designed drug to enter Phase 2 clinical trials (ISM001-055 for IPF). $400M+ raised. Direct rival for subnet drug-discovery; Insilico\'s end-to-end platform (target → drug → trial) is the bar.',
  },
  {
    id: 'recursion-pharma',
    name: 'Recursion Pharmaceuticals',
    ticker: 'RXRX',
    mcap: 2_200_000_000,
    source: 'public',
    sectors: ['science'],
    url: 'https://www.recursion.com',
    why: 'NASDAQ-listed AI drug discovery — image-based phenomics + ML across millions of cellular images. Multiple oncology + rare-disease programs in clinic. Direct rival for any subnet pitching ML-driven drug discovery to pharma.',
    delta24h: 0.6,
    aliases: ['RXRX'],
  },
  {
    id: 'schrodinger',
    name: 'Schrödinger',
    ticker: 'SDGR',
    mcap: 1_500_000_000,
    source: 'public',
    sectors: ['science'],
    url: 'https://www.schrodinger.com',
    why: 'Computational chemistry + drug discovery — physics-based simulation + ML hybrid. Software licensed to most major pharmas. Subnet drug-discovery plays compete with Schrödinger\'s physics-grade simulation moat.',
    aliases: ['SDGR'],
  },
  {
    id: 'elicit',
    name: 'Elicit',
    ticker: 'PRIVATE',
    mcap: 80_000_000,
    source: 'private',
    sectors: ['agents', 'data'],
    url: 'https://elicit.com',
    why: 'AI research assistant — extracts findings from 125M+ papers, automates literature review. Direct rival for any subnet pitching "deep research as a commodity" (SN67 Harnyx); Elicit owns the academic-research-tool niche.',
  },
  {
    id: 'consensus-ai',
    name: 'Consensus',
    ticker: 'PRIVATE',
    mcap: 50_000_000,
    source: 'private',
    sectors: ['agents', 'data'],
    url: 'https://consensus.app',
    why: 'AI-powered academic search — answers research questions with citations from 200M+ papers. ~$11M Series A. Rival for subnet research-as-a-service plays; Consensus\' direct-citation UX is the truth-anchored research bar.',
  },
  {
    id: 'futurehouse',
    name: 'FutureHouse',
    ticker: 'NONPROFIT',
    mcap: null,
    source: 'private',
    sectors: ['agents', 'science'],
    url: 'https://www.futurehouse.org',
    why: 'AI scientist agents (PaperQA, Aviary, Wikicrow) — Schmidt Futures-backed nonprofit. Direct rival for auto-research subnet plays (SN100 Plaτform); FutureHouse\'s scientific-agent track record sets the bar.',
  },
  {
    id: 'arc-prize',
    name: 'ARC Prize / METR',
    ticker: 'NONPROFIT',
    mcap: null,
    source: 'private',
    sectors: ['agents', 'science'],
    url: 'https://arcprize.org',
    why: 'ARC Prize (Chollet) + METR — leading independent AI eval orgs. ARC-AGI benchmark is the dominant capability-evaluation reference. Subnet "AI alignment" / "evaluation" plays measure against ARC + METR\'s methodology bar.',
    aliases: ['ARC', 'METR'],
  },
  {
    id: 'apollo-research',
    name: 'Apollo Research',
    ticker: 'NONPROFIT',
    mcap: null,
    source: 'private',
    sectors: ['agents'],
    url: 'https://www.apolloresearch.ai',
    why: 'AI safety + alignment research org — focuses on deception + evaluation. Influential papers on AI scheming + sandbagging. Subnet alignment plays measure against Apollo\'s evaluation methodology + published findings.',
  },

  /* ---------- DeFi / on-chain markets (SN35/77/106/112/113/116/127 profiles) ----------
     The on-chain finance stack the subnet rivals compete with:
     perp DEX leaders, AMM giants, cross-chain liquidity, stablecoin
     incumbents, lending protocols, and the capital-infra layer. */
  {
    id: 'hyperliquid',
    name: 'Hyperliquid',
    ticker: 'HYPE',
    mcap: 12_000_000_000,
    source: 'private',
    sectors: ['finance'],
    url: 'https://hyperliquid.xyz',
    why: 'Layer-1 perp DEX — captured ~75% of decentralized perp volume by mid-2026 ($500B+ cumulative volume). The default rival for any subnet pitching on-chain perp liquidity; readers comparing decentralized order books should know Hyperliquid is the price/UX bar.',
    aliases: ['HYPE'],
  },
  {
    id: 'dydx',
    name: 'dYdX',
    ticker: 'DYDX',
    mcap: 800_000_000,
    source: 'private',
    sectors: ['finance'],
    url: 'https://dydx.exchange',
    why: 'Pioneer perp DEX (v4 chain on Cosmos) — ~$1B daily volume in 2026. Strong rival for subnet perp/derivatives plays; dYdX\'s validator-set + open-orderbook design competes directly with subnet-staked liquidity models.',
  },
  {
    id: 'gmx',
    name: 'GMX',
    ticker: 'GMX',
    mcap: 200_000_000,
    source: 'private',
    sectors: ['finance'],
    url: 'https://gmx.io',
    why: 'Multi-asset perp DEX (Arbitrum + Avalanche) — GLP / GMV liquidity-as-LP model. Direct rival for any subnet pitching "earn fees by providing perp liquidity"; GMX has 3+ years of compounding LP returns customers compare against.',
  },
  {
    id: 'uniswap',
    name: 'Uniswap',
    ticker: 'UNI',
    mcap: 4_500_000_000,
    source: 'private',
    sectors: ['finance'],
    url: 'https://uniswap.org',
    why: 'Dominant AMM — ~$50B monthly volume, V4 hooks shipping. THE benchmark for any subnet pitching liquidity provision or DEX functionality. Subnets routing through Uniswap (SN77 Liquidity) inherit its surface; subnets competing against it have a brutal liquidity-cold-start.',
    aliases: ['UNI'],
  },
  {
    id: '1inch',
    name: '1inch',
    ticker: 'PRIVATE',
    mcap: 240_000_000,
    source: 'private',
    sectors: ['finance'],
    url: 'https://1inch.io',
    why: 'Leading DEX aggregator + Fusion mode (intent-based swaps). Routes across 100+ DEXes for best price. Direct rival for any subnet swap-intent / aggregator pitch; 1inch\'s solver network sets the auction price standard.',
  },
  {
    id: 'cowswap',
    name: 'CoW Protocol',
    ticker: 'PRIVATE',
    mcap: 80_000_000,
    source: 'private',
    sectors: ['finance'],
    url: 'https://cow.fi',
    why: 'Intent-based DEX with MEV-protection + batch auctions. Solver competition model pioneered the architecture subnet aggregators copy. ~$1B monthly volume. Strong rival on the swap-intent design choice.',
    aliases: ['CoW Swap'],
  },
  {
    id: 'tether',
    name: 'Tether (USDT)',
    ticker: 'USDT',
    mcap: 165_000_000_000,
    source: 'private',
    sectors: ['finance'],
    url: 'https://tether.to',
    why: 'Largest stablecoin by mcap — $165B supply, deeper liquidity than any competitor. Strong rival for any subnet pitching stablecoin; the Tether liquidity moat is decades of CEX integration that subnet-native stablecoins can\'t replicate quickly.',
  },
  {
    id: 'circle-usdc',
    name: 'Circle (USDC)',
    ticker: 'CRCL',
    mcap: 50_000_000_000,
    source: 'public',
    sectors: ['finance'],
    url: 'https://www.circle.com',
    why: 'Second-largest stablecoin — USDC ~$60B supply, regulated US-domiciled issuer. NYSE-listed (CRCL). Rival for any subnet stablecoin pitching US regulatory clarity.',
    delta24h: 0.4,
    aliases: ['USDC'],
  },
  {
    id: 'makerdao-sky',
    name: 'MakerDAO / Sky',
    ticker: 'SKY',
    mcap: 2_400_000_000,
    source: 'private',
    sectors: ['finance'],
    url: 'https://sky.money',
    why: 'DAI / USDS stablecoin issuer + Spark lending. Sky\'s ~$5B stablecoin supply is the over-collateralized decentralized model subnet TensorUSD-style projects compete with.',
    aliases: ['DAI', 'USDS', 'Sky'],
  },
  {
    id: 'spark-protocol',
    name: 'Spark Protocol',
    ticker: 'SPK',
    mcap: 300_000_000,
    source: 'private',
    sectors: ['finance'],
    url: 'https://spark.fi',
    why: 'MakerDAO-backed lending protocol — focused on USDS / DAI lending. ~$3B TVL. Direct rival for subnet lending plays in the Ethereum / cross-chain market.',
  },
  {
    id: 'layerzero',
    name: 'LayerZero',
    ticker: 'ZRO',
    mcap: 600_000_000,
    source: 'private',
    sectors: ['finance', 'infra'],
    url: 'https://layerzero.network',
    why: 'Omnichain interoperability protocol — moves messages + tokens across 70+ chains. Direct rival for any subnet pitching cross-chain liquidity (SN106 VoidAI). LayerZero\'s validator/oracle design competes with Chainlink CCIP.',
  },
  {
    id: 'wormhole',
    name: 'Wormhole',
    ticker: 'W',
    mcap: 350_000_000,
    source: 'private',
    sectors: ['finance', 'infra'],
    url: 'https://wormhole.com',
    why: 'Cross-chain messaging + Portal Bridge — connects 30+ chains. Massively hacked in 2022 ($320M) but recovered + scaled. Rival for cross-chain liquidity subnets; Wormhole\'s scale is the security floor any new bridge has to clear.',
  },
  {
    id: 'blackrock',
    name: 'BlackRock',
    ticker: 'BLK',
    mcap: 175_000_000_000,
    source: 'public',
    sectors: ['finance'],
    url: 'https://www.blackrock.com',
    why: 'World\'s largest asset manager ($11.5T AUM). IBIT (Bitcoin spot ETF) accumulated $50B+ since 2024 launch; BUIDL tokenized treasury fund is the institutional on-chain anchor. Subnet "decentralized AUM" pitches compete with the BlackRock distribution + trust moat.',
    delta24h: 0.2,
    aliases: ['BLK', 'IBIT', 'BUIDL'],
  },
  {
    id: 'anchorage-digital',
    name: 'Anchorage Digital',
    ticker: 'PRIVATE',
    mcap: 3_000_000_000,
    source: 'private',
    sectors: ['finance'],
    url: 'https://anchorage.com',
    why: 'OCC-chartered crypto bank — institutional custody + staking + lending. ~$50B AUC. Direct rival for any subnet pitching tokenized investment products to institutional readers; Anchorage owns the regulated-custody moat.',
  },
  {
    id: 'chainlink-ccip',
    name: 'Chainlink CCIP',
    ticker: 'LINK',
    mcap: 12_000_000_000,
    source: 'private',
    sectors: ['finance', 'infra'],
    url: 'https://chain.link/cross-chain',
    why: 'Chainlink\'s Cross-Chain Interoperability Protocol — institutional-grade cross-chain messaging + token transfer. Risk-management framework. Direct rival for cross-chain liquidity subnets; SN106 explicitly uses CCIP as a building block.',
    aliases: ['LINK', 'CCIP'],
  },
  {
    id: 'benevolent-ai',
    name: 'BenevolentAI',
    ticker: 'BAI',
    mcap: 60_000_000,
    source: 'public',
    sectors: ['science'],
    url: 'https://www.benevolent.com',
    why: 'AI drug discovery — knowledge graph + ML approach. London-listed (AMS:BAI). Multiple Phase 2 programs (BEN-2293 for atopic dermatitis). Direct rival for subnet drug-discovery plays in the small-molecule space.',
    aliases: ['BAI'],
  },
  {
    id: 'ibm',
    name: 'IBM',
    ticker: 'IBM',
    mcap: 230_000_000_000,
    source: 'public',
    sectors: ['infra', 'science'],
    url: 'https://www.ibm.com',
    why: 'Big Blue — quantum (IBM Quantum 1,121-qubit Condor), enterprise AI (Granite + watsonx), classical optimization (CPLEX). Subnet plays touching enterprise AI / quantum / optimization compete with IBM\'s decades of customer relationships.',
    delta24h: 0.3,
    aliases: ['IBM Quantum', 'watsonx'],
  },
  {
    id: 'd-wave',
    name: 'D-Wave Quantum',
    ticker: 'QBTS',
    mcap: 3_500_000_000,
    source: 'public',
    sectors: ['infra', 'science'],
    url: 'https://www.dwavequantum.com',
    why: 'Quantum annealing pioneer — Advantage system at 5000+ qubits. Specializes in optimization (max-clique, TSP). Direct rival for subnet "max clique solver" plays; D-Wave already ships max-clique benchmarks on real hardware.',
    delta24h: 1.2,
    aliases: ['QBTS'],
  },
  {
    id: 'gurobi',
    name: 'Gurobi Optimization',
    ticker: 'PRIVATE',
    mcap: 500_000_000,
    source: 'private',
    sectors: ['science', 'data'],
    url: 'https://www.gurobi.com',
    why: 'Industry-standard mathematical optimization solver — MILP, MIQP, MIQCP. Used by 80%+ of Fortune 500 for supply-chain + scheduling problems. Subnet "clique solver" pitches face Gurobi\'s decades of solver engineering as the baseline.',
  },
  {
    id: 'personalis',
    name: 'Personalis',
    ticker: 'PSNL',
    mcap: 350_000_000,
    source: 'public',
    sectors: ['science', 'data'],
    url: 'https://www.personalis.com',
    why: 'Precision-oncology genomics — NeXT Personal MRD assay, ImmunoID NeXT. Direct rival for "foundational layer of genomics" subnet plays in the clinical-trial + cancer-monitoring market.',
    aliases: ['PSNL'],
  },
  {
    id: 'numerai',
    name: 'Numerai',
    ticker: 'NMR',
    mcap: 120_000_000,
    source: 'private',
    sectors: ['finance'],
    url: 'https://numer.ai',
    why: 'Crowdsourced data-science tournament for stock-market predictions — meta-model of staked predictions. The closest centralized analog to subnet "predictive intelligence" plays (SN50 Synth); Numerai pays out ~$5M/year to top data scientists.',
    aliases: ['NMR'],
  },

  /* ---------- Camera intelligence + autonomous driving + surveillance
     (SN44 Score, SN72 StreetVision, SN87 Luminar, SN85 Vidaio) ---------- */
  {
    id: 'mobileye',
    name: 'Mobileye',
    ticker: 'MBLY',
    mcap: 13_000_000_000,
    source: 'public',
    sectors: ['vision'],
    url: 'https://www.mobileye.com',
    why: 'Intel-spinoff (NASDAQ:MBLY) — leader in vision-based ADAS / autonomous driving. EyeQ chips ship in 100M+ vehicles. Direct rival for any subnet pitching "camera intelligence" or AV perception; Mobileye\'s OEM relationships (BMW, Audi, Ford) are the moat.',
    delta24h: 0.3,
    aliases: ['MBLY'],
  },
  {
    id: 'wayve',
    name: 'Wayve',
    ticker: 'PRIVATE',
    mcap: 2_800_000_000,
    source: 'private',
    sectors: ['vision'],
    url: 'https://wayve.ai',
    why: 'UK-based end-to-end AV — learns driving via embodied AI on production fleet data. ~$1.05B Series C (SoftBank + NVIDIA + Microsoft). The data-flywheel model for camera intelligence; subnet "Internet of Cameras" claims compete with Wayve\'s fleet data moat.',
  },
  {
    id: 'comma-ai',
    name: 'Comma.ai',
    ticker: 'PRIVATE',
    mcap: 200_000_000,
    source: 'private',
    sectors: ['vision'],
    url: 'https://comma.ai',
    why: 'Open-source autonomous driving (openpilot) — runs on consumer hardware ($1,500 retrofit). Strong rival for any decentralized AV claim because Comma already ships AV at consumer price.',
    aliases: ['openpilot'],
  },
  {
    id: 'verkada',
    name: 'Verkada',
    ticker: 'PRIVATE',
    mcap: 4_500_000_000,
    source: 'private',
    sectors: ['vision'],
    url: 'https://www.verkada.com',
    why: 'Enterprise cloud-based security cameras with on-device AI — 25K+ customers. Direct rival for any "video surveillance agents" subnet; Verkada owns the camera + the cloud, subnet has to differentiate on something else (cost, privacy, decentralization).',
  },
  {
    id: 'avigilon-motorola',
    name: 'Avigilon (Motorola)',
    ticker: 'MSI',
    mcap: 80_000_000_000, // Motorola Solutions
    source: 'public',
    sectors: ['vision'],
    url: 'https://www.avigilon.com',
    why: 'Motorola Solutions\' enterprise video security platform — owns large parts of the government / municipal surveillance market. Subnet video-surveillance agents compete with the public-safety procurement moat Avigilon has built.',
    aliases: ['Motorola Solutions', 'MSI'],
  },
  {
    id: 'topaz-labs',
    name: 'Topaz Labs',
    ticker: 'PRIVATE',
    mcap: 90_000_000,
    source: 'private',
    sectors: ['video', 'vision'],
    url: 'https://www.topazlabs.com',
    why: 'Pro-grade AI video + image enhancement — upscaling, denoise, deinterlace, frame interpolation. Used heavily in film + broadcast post-production. Direct rival for video-processing subnets pitching enhancement / restoration use cases.',
    aliases: ['Topaz Video AI', 'Topaz Gigapixel'],
  },
  {
    id: 'eagle-eye-networks',
    name: 'Eagle Eye Networks',
    ticker: 'PRIVATE',
    mcap: 800_000_000,
    source: 'private',
    sectors: ['vision'],
    url: 'https://www.een.com',
    why: 'Cloud video surveillance + analytics — works with 100+ camera vendors. ~$140M Series F. Mid-market rival for any subnet pitching open camera-AI infrastructure.',
  },

  /* ---------- 3D content generation (SN17 404-GEN profile) ----------
     The 3D-from-text space is the next frontier after 2D image
     generation — 2024-2025 saw the first commercially usable
     models. Three centralized leaders set the bar. */
  {
    id: 'luma-ai',
    name: 'Luma AI',
    ticker: 'PRIVATE',
    mcap: 800_000_000,
    source: 'private',
    sectors: ['vision', 'video'],
    url: 'https://lumalabs.ai',
    why: 'Genie (text-to-3D) + Dream Machine (text-to-video) — the highest-quality consumer 3D + video generation as of 2026. ~$70M Series B. Direct rival for 3D-generation subnets; readers comparing decentralized 3D should know Luma is the quality bar.',
    aliases: ['Luma', 'Genie', 'Dream Machine'],
  },
  {
    id: 'tripo3d',
    name: 'Tripo3D / VAST AI',
    ticker: 'PRIVATE',
    mcap: 150_000_000,
    source: 'private',
    sectors: ['vision'],
    url: 'https://www.tripo3d.ai',
    why: 'Open-source-friendly text-to-3D from VAST AI, with usable mesh output for game engines. Hugging Face TripoSR available free. Subnet 3D-gen has to compete with this baseline for asset-creation customers.',
    aliases: ['Tripo', 'VAST AI', 'TripoSR'],
  },
  {
    id: 'meshy',
    name: 'Meshy',
    ticker: 'PRIVATE',
    mcap: 200_000_000,
    source: 'private',
    sectors: ['vision'],
    url: 'https://www.meshy.ai',
    why: 'Text-to-3D + texture generation for game / film production. Tight Blender integration. ~$20M Series A. Closest enterprise rival for any subnet pitching 3D assets to game studios.',
  },
  {
    id: 'nvidia-omniverse',
    name: 'NVIDIA Omniverse',
    ticker: 'NVDA',
    mcap: 3_500_000_000_000,
    source: 'public',
    sectors: ['vision'],
    url: 'https://www.nvidia.com/en-us/omniverse',
    why: 'NVIDIA\'s industrial 3D + simulation platform — USD-based scenes with AI-driven generation. Powers digital twins for BMW, Siemens, etc. Subnet 3D-gen routes to game / consumer; Omniverse owns the industrial tier and increasingly the generative pipeline.',
    aliases: ['Omniverse'],
  },

  /* ---------- Video generation + talking-head (SN99 Leoma, SN108 TalkHead) ---------- */
  {
    id: 'openai-sora-v2',
    name: 'OpenAI Sora',
    ticker: 'PRIVATE',
    mcap: 350_000_000_000, // valuation context — OpenAI broader
    source: 'private',
    sectors: ['video'],
    url: 'https://openai.com/sora',
    why: 'OpenAI\'s text-to-video model — Sora generates minute-long 1080p clips with strong physics coherence. The quality + integration moat (ChatGPT Plus access) sets the consumer bar for video-generation subnets.',
    aliases: ['Sora'],
  },
  {
    id: 'google-veo',
    name: 'Google Veo',
    ticker: 'GOOGL',
    mcap: 2_500_000_000_000,
    source: 'public',
    sectors: ['video'],
    url: 'https://deepmind.google/technologies/veo',
    why: 'Google DeepMind\'s text-to-video — Veo 3 ships 4K 60fps with audio. Distribution through YouTube Studio. Decentralized video-gen subnets compete with the YouTube creator-tools install base.',
    aliases: ['Veo', 'Veo 3'],
  },
  {
    id: 'kling-ai',
    name: 'Kling AI (Kuaishou)',
    ticker: 'PRIVATE',
    mcap: 23_000_000_000, // Kuaishou parent
    source: 'public',
    sectors: ['video'],
    url: 'https://klingai.com',
    why: 'Kuaishou\'s text-to-video model — strongest video-gen quality outside US labs as of 2026, with 10s+ generation and strong motion physics. Subnet has to either match Kling on quality or differentiate on integration / cost.',
    aliases: ['Kling'],
  },
  {
    id: 'hailuo-ai',
    name: 'Hailuo AI (MiniMax)',
    ticker: 'PRIVATE',
    mcap: 2_500_000_000,
    source: 'private',
    sectors: ['video'],
    url: 'https://hailuoai.com',
    why: 'MiniMax\'s text-to-video — fast-shipping Chinese AI lab. T2V-01-Director model in 2025 with camera-motion controls. Decentralized video-gen subnets compete with MiniMax\'s rapid iteration cadence.',
    aliases: ['MiniMax', 'Hailuo'],
  },
  {
    id: 'pika-labs',
    name: 'Pika Labs',
    ticker: 'PRIVATE',
    mcap: 700_000_000,
    source: 'private',
    sectors: ['video'],
    url: 'https://pika.art',
    why: 'Consumer-grade video generation — image-to-video + lip-sync + scene-control. ~$135M raised. The "TikTok creator who wants to ship a video" tier. Subnet has to clear the Pika UX bar to capture creator volume.',
  },
  {
    id: 'heygen',
    name: 'HeyGen',
    ticker: 'PRIVATE',
    mcap: 500_000_000,
    source: 'private',
    sectors: ['video'],
    url: 'https://www.heygen.com',
    why: 'AI avatar + talking-head video platform — 300+ avatars, 100+ languages, lip-sync from arbitrary script. Default rival for any subnet generating presenter-style video. ~$60M Series A.',
  },
  {
    id: 'synthesia',
    name: 'Synthesia',
    ticker: 'PRIVATE',
    mcap: 2_100_000_000,
    source: 'private',
    sectors: ['video'],
    url: 'https://www.synthesia.io',
    why: 'Enterprise AI avatar platform — 230+ avatars, used by Fortune 500 for training / comms videos. ~$180M Series D. The enterprise talking-head incumbent; subnet has to either match production quality or differentiate on cost-per-minute.',
  },
  {
    id: 'd-id',
    name: 'D-ID',
    ticker: 'PRIVATE',
    mcap: 200_000_000,
    source: 'private',
    sectors: ['video'],
    url: 'https://www.d-id.com',
    why: 'Real-time talking-head generation from a single photo — strong API offering for chat / customer-service avatars. Direct rival for any subnet shipping live-talking-head generation.',
  },
  {
    id: 'tavus',
    name: 'Tavus',
    ticker: 'PRIVATE',
    mcap: 220_000_000,
    source: 'private',
    sectors: ['video'],
    url: 'https://www.tavus.io',
    why: 'Personalized AI video at scale — Phoenix-3 (real-time conversational video), Hummingbird (lip-sync). YC backed, ~$18M Series A. Strong rival for talking-head subnets pitching personalization.',
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

  /* SN11 TrajectoryRL — "Agentic RL as a Service, Optimize
     agent trajectories to make agents cheaper, safer, and more
     reliable" (live identity per taostats 2026-05-22, trajrl.com;
     local subnets.js had stale "Dippy roleplay" row). Trains
     agent policies via RL on trajectories. Direct rivals are
     the labs that produce agent weights through similar methods
     (Sakana, OpenAI o-series, DeepMind) plus the autonomous
     SWE-agent shops (Cognition Devin) the customer would pay
     instead. */
  11: {
    rivals: ['sakana-ai', 'openai', 'anthropic', 'google', 'cognition-devin', 'meta'],
    supplyChainIds: ['nvidia', 'aws-azure-gcp', 'tsmc', 'sk-hynix'],
    constraints: [
      {
        label: 'RL compute scaling',
        value: '~$1M-$10M per policy run',
        note: 'OpenAI o1 + DeepSeek-R1 training runs cost millions in GPU-hours. Sakana publishes papers showing comparable results via population-based methods at lower cost. Subnet has to either crowd-source the compute to match or differentiate on trajectory diversity that closed labs lack.',
      },
      {
        label: 'Trajectory diversity reward',
        value: 'Mode collapse at 10K-100K samples',
        note: 'RL on a single objective collapses to the local optimum. Centralized rivals address this with sampled diverse environments; subnet validators have to score trajectory diversity as a first-class metric or watch miners converge on one strategy.',
      },
      {
        label: 'Safety eval cost',
        value: 'Per-trajectory red-team passes',
        note: 'Anthropic + OpenAI run constitutional-AI + red-team eval on every checkpoint. Subnet "make agents safer" claim requires the same overhead — either every miner runs safety eval (expensive) or validators randomly sample (cheaper, but coverage drops).',
      },
      {
        label: 'Environment realism',
        value: 'Sim-to-real gap kills deployment',
        note: 'Toy environments (CartPole, BabyAI) don\'t transfer to real agent tasks (browsing, code, customer support). Centralized labs use proprietary internal benchmarks. Subnet has to either ship a public environment harness with real-task coverage or accept that trained policies don\'t generalize.',
      },
      {
        label: 'Reward-hacking surface',
        value: '50%+ of RL agents find specification gaps',
        note: 'Per DeepMind/Anthropic safety research: most RL agents discover unintended reward-hacks. Subnet "make agents safer" claim requires validator scoring that catches this — but specifying reward-hack-resistance is itself an open research problem.',
      },
    ],
  },

  /* SN62 Ridges — "Software Engineering Agents" (live identity
     per taostats 2026-05-22, ridges.ai). Builds + trains agents
     that complete software engineering tasks end-to-end. The
     rival pool is the consolidated 2026 SWE-agent stack — Cursor
     leading editor-resident, Cognition Devin leading autonomous,
     GitHub Copilot leading distribution, Claude Code leading
     terminal-native. */
  62: {
    rivals: ['cognition-devin', 'cursor', 'github-copilot', 'claude-code', 'replit-agent', 'codeium-windsurf'],
    supplyChainIds: ['nvidia', 'aws-azure-gcp', 'tsmc', 'sk-hynix'],
    constraints: [
      {
        label: 'SWE-bench accuracy bar',
        value: 'Top closed agents at 70%+',
        note: 'OpenAI + Anthropic + Cognition all report 70%+ on SWE-bench Verified. Subnet SWE agents have to either match this or differentiate on a benchmark the closed shops haven\'t saturated. Public scores compress fast — by mid-2026 70%+ is table stakes.',
      },
      {
        label: 'Repo-context cost',
        value: '$0.50-$5 per resolved issue',
        note: 'Devin\'s cost-per-task is ~$2-5 (200K context + multi-turn + tests). Cursor / Copilot subsidize via subscriptions. Subnet miners earn α-emission, but the customer-facing cost has to undercut the centralized agents to capture the long-tail of devs who can\'t justify $20/mo.',
      },
      {
        label: 'PR-quality gates',
        value: 'CI-pass rate < 50% for autonomous PRs',
        note: 'Devin + GitHub Copilot Workspace ship PRs that pass CI ~30-50% on first try. Higher rates require human review. Subnet validator scoring has to enforce CI-pass (and ideally tests-added) before crediting a miner, or the readers chase metrics that don\'t translate to merged PRs.',
      },
      {
        label: 'Tool-use surface',
        value: 'shell + git + browser + APIs',
        note: 'Real SWE agents need shell (run tests, install deps), git (branches, rebases), browser (docs lookup), and 3rd-party APIs (CI, code review). Building + maintaining this harness is real engineering — Cognition\'s VM stack took ~18 months. Subnet miners running locally need a portable equivalent.',
      },
      {
        label: 'Security surface of autonomous code-exec',
        value: 'Prompt-injection in user repos',
        note: 'A SWE agent reading a malicious README can be tricked into exfiltrating secrets, opening RCE PRs, or breaking CI. Cognition + Anthropic gate via sandboxing + human review. Decentralized subnet agents on commodity miner hardware have a weaker sandbox story; readers care.',
      },
    ],
  },

  /* SN66 ninja — "Distilling software agents" (live identity
     per taostats 2026-05-22, ninja.arbos.life). Compresses
     large agent policies into smaller, cheaper, faster models
     via distillation. Rival pool is the model-distillation
     space (Together / HuggingFace / DeepSeek for distillation
     infra) plus the SWE-agent shops whose closed-source
     teacher models are what customers want distilled. */
  66: {
    rivals: ['together-ai', 'hugging-face', 'replicate', 'modal-labs', 'cognition-devin', 'cursor'],
    supplyChainIds: ['nvidia', 'aws-azure-gcp', 'tsmc', 'sk-hynix'],
    constraints: [
      {
        label: 'Teacher-model access licensing',
        value: 'GPT-4 / Claude ToS forbids distillation',
        note: 'OpenAI + Anthropic ToS explicitly prohibit using their outputs to train competing models. Distillation subnets that scrape teacher outputs face legal risk; Together AI + HuggingFace distill only from open-license models (Llama, Mistral) and ship within those licenses.',
      },
      {
        label: 'Distillation-loss eval cost',
        value: 'Need teacher + student inference per sample',
        note: 'Knowledge-distillation training runs teacher inference on every batch — doubles GPU cost. Centralized shops amortize via internal pricing; subnet miners pay full inference cost on miner hardware. Eval-loss-gaming surface (rule #2 from SN56 Gradients) applies double here.',
      },
      {
        label: 'Capability gap retention',
        value: 'Small students lose long-tail',
        note: 'A 7B student of a 70B teacher matches median tasks but loses long-tail (reasoning, multi-step planning). For agent tasks specifically, long-tail is where the value sits. Distilled subnet agents need explicit eval on the agent-specific long-tail to communicate the trade-off honestly.',
      },
      {
        label: 'Quantization vs distillation',
        value: 'INT4 quant captures 80% of distillation gains',
        note: 'Llama.cpp + GGUF quantization deliver most of the small-model speedup with less engineering. Subnet must either justify why distillation beats off-the-shelf quantization on the specific task family or accept that the customer takes the cheaper quant path.',
      },
      {
        label: 'Distilled-agent safety surface',
        value: 'Loses RLHF alignment fidelity',
        note: 'Distilling a teacher\'s outputs loses the RLHF + constitutional fine-tuning that made the teacher safe. Distilled agents act with less safety conditioning unless the subnet adds explicit safety distillation. Anthropic publishes constitutional-AI methods — subnet can adopt, but the eval burden grows.',
      },
    ],
  },

  /* SN44 Score — "Making every camera intelligent" (live
     identity per taostats 2026-05-22, wearescore.com). Adds
     AI inference to existing camera infrastructure. Rival pool
     is the camera-edge-AI stack — Mobileye for automotive,
     Hive AI for content moderation, Verkada for enterprise. */
  44: {
    rivals: ['mobileye', 'verkada', 'hive-ai', 'eagle-eye-networks', 'avigilon-motorola', 'qualcomm'],
    supplyChainIds: ['nvidia', 'qualcomm', 'tsmc', 'aws-azure-gcp'],
    constraints: [
      {
        label: 'On-device inference budget',
        value: '<5W TDP, sub-30ms latency',
        note: 'Camera SoCs (Qualcomm RB5, NVIDIA Jetson Orin Nano) cap at ~5W with sub-30ms inference budgets. Subnet miners running inference off-device add network round-trip (50-200ms) — competing on latency means committing to edge deployment, not cloud aggregation.',
      },
      {
        label: 'Camera SDK fragmentation',
        value: 'Hikvision, Axis, Dahua, Hanwha all proprietary',
        note: 'Real installed-camera fleets run on Hikvision (38% share), Axis, Dahua, Hanwha hardware. Each has its own SDK + RTSP variants. Subnet adding intelligence to "every camera" needs adapters per vendor — Verkada owns its own hardware to sidestep this entirely.',
      },
      {
        label: 'Privacy / GDPR + biometric law',
        value: 'EU AI Act bans real-time face recognition',
        note: 'Camera-AI applications hit GDPR, Illinois BIPA, EU AI Act, China PIPL. Centralized rivals run dedicated compliance teams. Subnet "open camera intelligence" inherits the regulatory surface but without a single compliance officer to take responsibility.',
      },
      {
        label: 'False-positive cost',
        value: 'One false alert per day kills enterprise trust',
        note: 'Camera-AI customers (retail loss prevention, perimeter security) abandon systems that produce more than ~one false alert per day. Centralized rivals tune per-customer thresholds; subnet miners with diverse model versions struggle to maintain consistent per-customer accuracy.',
      },
      {
        label: 'Storage + bandwidth tax',
        value: '24/7 1080p stream = 0.5-1 GB/hour per camera',
        note: 'Continuous camera footage is expensive to store + transmit. Verkada / Eagle Eye charge per camera per month covering storage. Subnet has to either co-locate storage with miners (defeats decentralization) or pass storage cost to user (worse UX).',
      },
    ],
  },

  /* SN72 StreetVision by NATIX — "Powered by NATIX's Internet
     of Cameras, StreetVision is advancing autonomous driving,
     Physical AI, and map-making" (live identity per taostats
     2026-05-22, natix.network). Crowdsources camera data for
     AV training. Rival pool is the AV-data + map-making space. */
  72: {
    rivals: ['mobileye', 'wayve', 'tesla', 'comma-ai', 'google', 'nvidia-omniverse'],
    supplyChainIds: ['nvidia', 'qualcomm', 'tsmc', 'aws-azure-gcp', 'us-power-grids'],
    constraints: [
      {
        label: 'Data quality vs. fleet scale',
        value: 'Tesla: 100M+ vehicle-miles/day vs. crowdsourced gap',
        note: 'Tesla\'s production fleet generates 100M+ AV-relevant miles per day. Mobileye + Wayve have hundreds of OEM vehicles + safety drivers. Subnet crowdsources smartphone-mounted cameras — orders of magnitude lower data quality per mile, but higher diversity if scaled.',
      },
      {
        label: 'HD-map freshness',
        value: 'Maps stale after ~6 months in fast-changing cities',
        note: 'HD maps for AV must reflect current lane lines, signs, construction. Google + TomTom + HERE rebuild via dedicated mapping fleets. Subnet crowdsourced map updates from driver phones can be fresher in coverage areas but inconsistent in quality.',
      },
      {
        label: 'Privacy on captured footage',
        value: 'Face + plate blur + GDPR pseudonymization',
        note: 'Crowdsourced camera footage captures bystanders, license plates, residences. Centralized rivals (Google Street View, Apple Look Around) blur on capture. Subnet miners must blur on-device before upload or face GDPR / state-level breach.',
      },
      {
        label: 'AV-grade safety case',
        value: 'Mobileye + Waymo file thousands of safety-case docs',
        note: 'Real AV deployment requires safety-case documentation — Waymo, Mobileye, Wayve invest engineering decades in this. Subnet data feeding AV stacks ultimately bottoms out on safety-case ownership, which has to live with a centralized AV company partner.',
      },
      {
        label: 'Tokenized data marketplaces are pre-revenue',
        value: 'Streamr / Filecoin AV-data pilots all <$10M ARR',
        note: 'Multiple Web3 + decentralized data marketplaces (Streamr, Ocean Protocol, Filecoin) have tried tokenizing sensor data. None have crossed material revenue ($10M+ ARR). Subnet inherits the structural challenge: AV companies prefer dedicated data pipelines, not open marketplaces.',
      },
    ],
  },

  /* SN85 Vidaio — "Next-Generation Video Processing Powered By
     AI" (live identity per taostats 2026-05-22, vidaio.io).
     Video processing pipeline (upscaling, restoration,
     compression, post-production). Rival pool is the centralized
     video-processing stack + generative video tools. */
  85: {
    rivals: ['adobe', 'runway', 'openai-sora-v2', 'google-veo', 'topaz-labs', 'nvidia'],
    supplyChainIds: ['nvidia', 'tsmc', 'sk-hynix', 'aws-azure-gcp'],
    constraints: [
      {
        label: 'Video processing compute scale',
        value: '4K 1-hour upscale: 8-24 GPU-hours',
        note: 'Real video processing (upscale, restoration) burns hours of GPU per finished hour. Adobe + Topaz Labs ship dedicated GPU-accelerated tools; subnet miners on commodity hardware run 2-3x slower per finished hour. Capture batch / overnight workflows, not real-time.',
      },
      {
        label: 'Format + codec breadth',
        value: 'H.264, H.265, AV1, ProRes, VP9 all in production',
        note: 'Real video pipelines touch H.264, HEVC, AV1, ProRes, VP9, DNxHR depending on customer. Adobe + Avid + DaVinci Resolve support all of them. Subnet has to ship FFmpeg-grade format coverage or stay in the consumer-MP4 tier.',
      },
      {
        label: 'Color science + HDR',
        value: 'P3 / Rec.2020 / Dolby Vision all proprietary',
        note: 'Pro video workflows need accurate color spaces (sRGB / P3 / Rec.709 / Rec.2020) and HDR formats (HDR10, Dolby Vision, HLG). Adobe + Resolve handle this natively. Subnet processing that loses color metadata produces output pros can\'t use.',
      },
      {
        label: 'Generative vs. restorative split',
        value: 'Sora generates new; subnets restore existing',
        note: 'Video gen (Sora, Veo) and video processing (Vidaio, Topaz) are different problems. Sora can\'t restore your wedding video; Vidaio can\'t generate a sci-fi clip. Subnet positioning has to be clear or readers map it to the wrong rival.',
      },
      {
        label: 'Asset transfer cost',
        value: 'Source + output: 100MB-100GB per job',
        note: 'Video assets are huge — uploading a 4K master to a miner, processing, downloading the result burns hours over commodity bandwidth. Adobe Creative Cloud ships local processing; subnet WAN-based processing is bandwidth-bound for the entire workflow.',
      },
    ],
  },

  /* SN87 Luminar Network — "Video Surveillance Agents" (live
     identity per taostats 2026-05-22, luminar.network). LLM-
     driven video analytics for surveillance. Rival pool is the
     enterprise video-surveillance + on-prem AI stack. */
  87: {
    rivals: ['verkada', 'avigilon-motorola', 'eagle-eye-networks', 'hive-ai', 'palantir', 'anthropic'],
    supplyChainIds: ['nvidia', 'qualcomm', 'tsmc', 'aws-azure-gcp'],
    constraints: [
      {
        label: 'False-positive cost (surveillance grade)',
        value: 'False alarm: $50-500 per incident',
        note: 'Surveillance customers (retail, transit, municipal) pay $50-500 per false alarm in dispatched response. Verkada + Avigilon tune precision aggressively; subnet "agent" output without that calibration burns customer money fast — visible in churn.',
      },
      {
        label: 'Civil liberties + bias surface',
        value: 'Face recognition banned in 20+ US cities + EU',
        note: 'Cities (SF, Boston, Portland) + countries (EU AI Act) ban municipal face recognition. Race + gender bias in surveillance AI is documented (NIST FRVT). Subnet "open" surveillance agents must either avoid biometrics entirely or risk regulatory shutdown.',
      },
      {
        label: 'Real-time event detection latency',
        value: '<2s p95 for actionable alerts',
        note: 'Surveillance value depends on alerting before the event ends (theft in progress, fall in progress). Centralized rivals run inference at the camera. Subnet routing video to off-device miners adds 0.5-3s latency — for slow events OK, for fast events miss-rate increases.',
      },
      {
        label: 'Operator-team SLA',
        value: 'Verkada: 24/7 monitored response',
        note: 'Surveillance buyers want a 24/7 SOC — human operator reviews AI alerts and dispatches. Verkada + Avigilon ship this as a service. Subnet "agents" alone don\'t replace human review; integration with security operators is necessary or the product is half-baked.',
      },
      {
        label: 'Storage compliance windows',
        value: 'GDPR 30d / HIPAA 6yr / DoD 7yr',
        note: 'Different verticals have different retention requirements (GDPR forces purge, HIPAA + DoD force retention). Subnet decentralized storage has to honor BOTH delete + retain depending on customer — that\'s an operations problem centralized rivals solve with per-tenant policies.',
      },
    ],
  },

  /* SN17 404—GEN — "a decentralized 3D content generation
     competition" (live identity per taostats 2026-05-22,
     404.xyz). Text-to-3D model competition. Rival pool is the
     2024-2026 consumer 3D-gen leaders (Luma, Tripo, Meshy)
     plus the industrial-3D incumbent (NVIDIA Omniverse). */
  17: {
    rivals: ['luma-ai', 'tripo3d', 'meshy', 'nvidia-omniverse', 'stability-ai', 'adobe'],
    supplyChainIds: ['nvidia', 'tsmc', 'sk-hynix', 'aws-azure-gcp'],
    constraints: [
      {
        label: 'Mesh-quality vs. token-cost',
        value: 'Luma Genie: $0.10-$0.50 per gen',
        note: 'Luma + Tripo charge per generation. The quality bar (clean topology, UV unwrap, mesh resolution) is what game studios pay for. Subnet 3D-gen miners on commodity hardware have to either match topology cleanliness or ship faster + cheaper for prototyping use cases.',
      },
      {
        label: 'Generation latency',
        value: 'Luma: 1-3 min · Subnet target: <5 min',
        note: 'Text-to-3D inference takes 1-10 minutes for usable assets. Centralized providers run on H100/H200 clusters. Subnet miners on consumer GPUs (4090, A100) typically run 3-10x slower per gen — visible in the producer\'s wait time.',
      },
      {
        label: 'Game-engine integration',
        value: 'USD / glTF / FBX export expected',
        note: 'Real customers (game studios, AR/VR shops) want assets ready for Unity / Unreal / Blender / Spline. NVIDIA Omniverse owns USD-native pipelines. Subnet 3D-gen has to ship format adapters or stay in the "concept art" tier of use cases.',
      },
      {
        label: 'IP / training-data licensing',
        value: 'Sketchfab / TurboSquid data is restricted',
        note: 'Commercial-grade 3D model training data is locked behind license (Sketchfab paid, TurboSquid royalty-free). Subnet miners scraping for training data face IP risk. Luma trains on properly licensed corpora; subnet competing on quality has to source data the same way.',
      },
      {
        label: 'Eval beyond visual quality',
        value: 'Topology / animation-ready / physics needs',
        note: 'A pretty render doesn\'t make a usable asset — game studios need clean topology, rigged skeletons, physics-friendly meshes. Subnet validators scoring visual quality only ship pretty thumbnails; scoring TOPOLOGY needs a Blender-style mesh-quality metric the team has to author.',
      },
    ],
  },

  /* SN26 Perturb — "Decentralized adversarial robustness
     network" (live identity per taostats 2026-05-22,
     perturbai.io). Adversarial-robustness testing for ML
     models. Rival pool overlaps SN61 RedTeam but the cut is
     different: Perturb targets robustness specifically (model
     resilience to adversarial inputs), not general security. */
  26: {
    rivals: ['robust-intelligence', 'lakera', 'patronus-ai', 'hiddenlayer', 'adversa-ai', 'protect-ai'],
    supplyChainIds: ['nvidia', 'aws-azure-gcp'],
    constraints: [
      {
        label: 'Attack-method generation cost',
        value: 'CW / PGD / FGSM attacks require gradients',
        note: 'Strong adversarial attacks (Carlini-Wagner, PGD, FGSM) require model-gradient access. Black-box attacks need query budgets. Subnet miners producing novel attacks need either model weights (license risk) or thousands of queries (compute cost) — both gate participation.',
      },
      {
        label: 'Defense-attack arms race',
        value: 'Each defense paper triggers new attack within ~3 months',
        note: 'The adversarial ML field is an arms race — defenses (adversarial training, randomized smoothing) get broken by new attacks in weeks-to-months. Subnet "robustness network" has to ship continuously or land in the historic-knowledge tier.',
      },
      {
        label: 'Eval-benchmark consistency',
        value: 'ImageNet-A / RobustBench / OOD-bench all measure differently',
        note: 'Adversarial robustness is benchmark-dependent. RobustBench, ImageNet-C, OOD-bench all measure different things. Subnet validator scoring has to either commit to one benchmark (limits coverage) or ship a multi-bench suite (more eval cost).',
      },
      {
        label: 'Model-licensing for robustness testing',
        value: 'Open weights ≠ open evaluation',
        note: 'Frontier models (GPT-4, Claude 3.7) ship via API only — robustness testing requires API queries, not weights. ToS often forbids "competitive evaluation." Subnet robustness testing has to either test open-weights models only (limits relevance) or risk ToS violations.',
      },
      {
        label: 'Real-world attack surface',
        value: 'Academic attacks don\'t always transfer',
        note: 'Most academic adversarial attacks (Lp-bounded perturbations) don\'t reflect real-world attacks (typo / paraphrasing / image filters). Robust Intelligence + Lakera focus on real-world threats. Subnet has to either match real-world attack catalog or accept academic-only relevance.',
      },
    ],
  },

  /* SN25 Mainframe — "Powering decentralized science on
     Bittensor" (live identity per taostats 2026-05-22,
     macrocosmos.ai/sn25). Macrocosmos\' general decentralized
     science subnet. Rival pool spans the open-science movement
     + tokenized-research platforms + traditional academia. */
  25: {
    rivals: ['futurehouse', 'elicit', 'consensus-ai', 'arc-prize', 'sakana-ai', 'openai'],
    supplyChainIds: ['nvidia', 'aws-azure-gcp', 'us-power-grids'],
    constraints: [
      {
        label: 'Replication crisis exposure',
        value: '60-70% of psychology + 50% medicine studies fail to replicate',
        note: 'Open science movements (ResearchHub, OpenReview, Replication Markets) struggle with this. Subnet "decentralized science" inherits the replication problem — validator scoring has to either reward replication studies (currently low-status) or accept the same crisis traditional academia has.',
      },
      {
        label: 'Authorship + credit on-chain',
        value: 'Anonymous miners can\'t sit on tenure committees',
        note: 'Academic career incentives reward named first-author publications. Subnet anonymous miners produce work that can\'t be claimed in grant applications + faculty hires. Either subnet ships an identity layer (defeats decentralization) or stays disconnected from academic career rails.',
      },
      {
        label: 'Funding-source dependence',
        value: 'NIH + NSF + foundations gate $50B+/year',
        note: 'Centralized science funding is gated by NIH, NSF, ERC, foundations. Subnet "decentralized science" emits α but doesn\'t replace grant money. Researchers in expensive domains (wet lab, particle physics) need both — subnet positions as supplemental.',
      },
      {
        label: 'Domain-coverage breadth',
        value: 'Open science spans 30+ disciplines',
        note: 'Decentralized science must address physics, biology, chemistry, economics, sociology, math etc. Each has different evaluation methodology. Subnet validator design either ships per-domain modules (engineering burden) or one-size-fits-all (poor signal per domain).',
      },
      {
        label: 'Tool-chain integration',
        value: 'Lab notebooks, citations, Jupyter, R, MATLAB',
        note: 'Real science workflows touch ELN (LabArchives, Benchling), citation managers (Zotero, Mendeley), Jupyter, R, MATLAB. Centralized rivals integrate into these stacks. Subnet must either ship adapters or stay disconnected from the actual researcher\'s desk.',
      },
    ],
  },

  /* SN88 Investing — "Decentralized AUM" (live identity per
     taostats 2026-05-22, investing88.ai). On-chain asset
     management. Rival pool is the centralized asset-manager
     stack plus tokenized-fund pioneers. */
  88: {
    rivals: ['blackrock', 'anchorage-digital', 'coinbase', 'binance', 'yearn-finance', 'aave-labs'],
    supplyChainIds: ['ethereum-l1-gas', 'chainlink-oracles', 'aws-azure-gcp'],
    constraints: [
      {
        label: 'Distribution moat',
        value: 'BlackRock IBIT: $50B+ AUM in 18 months',
        note: 'Centralized AUM is distribution-bound — BlackRock + Fidelity + Vanguard own retirement-account + advisor-channel access. Subnet "decentralized AUM" has α emission as the recruiting tool but no direct path into IRA / 401k accounts where most US savings live.',
      },
      {
        label: 'Fiduciary liability surface',
        value: 'RIA fiduciary duty = personal liability',
        note: 'Asset managers in the US carry fiduciary duty (SEC RIA + state regs). Subnet miners executing trades on behalf of users either need RIA registration (kills decentralization) or accept that the product can\'t serve US accredited / retail without restructuring.',
      },
      {
        label: 'Tax-lot accounting',
        value: 'Each trade triggers a 1099-B in the US',
        note: 'On-chain trade activity creates tax events users have to report. Centralized rivals (Robinhood, Coinbase) ship cost-basis tracking + 1099 forms. Subnet AUM products need an integration with a tax-tracking partner (Koinly, TokenTax) or readers can\'t comply.',
      },
      {
        label: 'Strategy verification',
        value: 'Closed-source quant funds vs open-source subnet',
        note: 'Centralized funds publish marketing materials but not strategies. Subnet AUM strategies are on-chain visible — front-running, copying, and gaming are easier. Validators have to obscure strategies via zero-knowledge proofs or accept structural alpha leak.',
      },
      {
        label: 'AUM-fee economics',
        value: 'ETF: 0.15-0.50% / yr · subnet emission as proxy',
        note: 'Centralized fund fees compressed to 15-50 bps. Subnet AUM products fund operations via α emission — but if α price drops, validator + miner economics break. Long-term sustainability needs either AUM fees on top of emission or much more efficient operations.',
      },
    ],
  },

  /* SN13 Data Universe (macrocosmos.ai/gravity) — Scraping the
     world's social media data. Rivals: Bright Data, Apify,
     Scale AI, Hugging Face datasets, Snowflake, Databricks. */
  13: {
    rivals: ['bright-data', 'apify', 'scale-ai', 'hugging-face', 'snowflake', 'databricks'],
    supplyChainIds: ['aws-azure-gcp', 'cloudflare-edge', 'us-power-grids'],
    constraints: [
      {
        label: 'Platform ToS + rate-limit war',
        value: 'X, Reddit, Meta all hostile to scraping',
        note: 'Twitter/X charges $42K/mo for enterprise API; Reddit charges $20K+. Bright Data + Apify maintain rotating proxies + bot detection bypass. Subnet miners scraping at scale face account bans + IP blocks; capture data the platforms haven\'t yet shut down.',
      },
      {
        label: 'GDPR / CCPA data-deletion compliance',
        value: 'User right to be forgotten applies to scraped data',
        note: 'EU GDPR Art 17 + CA CCPA give users deletion rights. Centralized rivals (Bright Data) honor takedown notices. Subnet decentralized scraped data has miners holding shards — compliance requires coordinated deletion across all miners.',
      },
      {
        label: 'Data freshness vs scale tradeoff',
        value: 'Twitter firehose: ~6K tweets/sec',
        note: 'Real-time social media data requires firehose-grade infrastructure. Bright Data + Twitter API premium ship this. Subnet miners can\'t maintain firehose ingestion individually — capture batch/historical scrapes, not real-time.',
      },
      {
        label: 'Schema + entity-resolution',
        value: 'Scraped data is dirty by default',
        note: 'Raw scrapes have schema drift, duplicate accounts, deleted-and-republished posts. Centralized rivals clean + normalize. Subnet miners producing raw scrapes shift cleanup to consumer — readers comparing get raw vs clean data on the same price.',
      },
      {
        label: 'Buyer concentration',
        value: 'AI labs are 80% of data-purchase TAM',
        note: 'Most commercial scraped-data buyers are AI labs (training data). Hugging Face datasets + Common Crawl are free. Subnet selling to AI labs has to either match free or differentiate on freshness + licensing clarity.',
      },
    ],
  },

  /* SN14 Cacheon (cacheon.ai) — Containerized inference
     competition. Rivals: Together AI, Fireworks, Replicate,
     Modal, Anyscale, AWS Bedrock. */
  14: {
    rivals: ['together-ai', 'fireworks-ai', 'replicate', 'modal-labs', 'anyscale', 'aws-bedrock'],
    supplyChainIds: ['nvidia', 'tsmc', 'sk-hynix', 'aws-azure-gcp'],
    constraints: [
      {
        label: 'Container-image attestation',
        value: 'How to prove the deployed binary matches the claim',
        note: 'Miners submit containers; validators must verify the container actually runs the claimed model + configuration. Centralized rivals trust their own deployments. Subnet needs container-hash attestation + sample-inference audits or risks miners shipping cheaper-but-different models.',
      },
      {
        label: 'Throughput-vs-quality scoring',
        value: 'Validators must score BOTH speed + correctness',
        note: 'A miner could ship a fast quantized model and lose quality. Validators need a multi-metric score (tokens/sec + accuracy on held-out prompts). Centralized rivals expose tokens/sec + standard benchmarks; subnet score must be similarly defensible.',
      },
      {
        label: 'Open-source-model coverage',
        value: 'Llama 4 / Mistral / Qwen all in play',
        note: 'Customers care about model-specific endpoints. Together + Fireworks support 100+ open models. Subnet has to either cover the same breadth or focus on a niche where centralized rivals don\'t care.',
      },
      {
        label: 'Cold-start vs steady-state',
        value: 'Fireworks: <500ms cold start',
        note: 'Real serverless economics depend on cold-start latency. Fireworks + Modal optimized aggressively. Subnet container deployment + spin-up adds miner-discovery latency on top of container startup — capture steady-state workloads, not bursty.',
      },
    ],
  },

  /* SN31 Halftime — Decentralized multimodal intelligence for
     media + advertising. Rivals: Adobe, Trade Desk, AppLovin,
     Palantir, Snowflake, Meta. */
  31: {
    rivals: ['adobe', 'trade-desk', 'applovin', 'palantir', 'snowflake', 'meta'],
    supplyChainIds: ['nvidia', 'aws-azure-gcp', 'cloudflare-edge'],
    constraints: [
      {
        label: 'Ad-tech identity graph erosion',
        value: 'iOS ATT + cookie deprecation killed 3rd-party tracking',
        note: 'Apple ATT + Chrome cookie deprecation broke the ad-tech tracking infrastructure 2021-2024. Trade Desk + AppLovin pivoted to contextual + first-party data. Subnet "context-aware analysis" plays into this rebuilding moment but needs first-party data integrations to be relevant.',
      },
      {
        label: 'Brand-safety scoring',
        value: 'Hive AI + IAS audit every impression',
        note: 'Brand-safety scoring requires real-time content classification at impression-time. Hive AI + IAS process billions of ad impressions/day. Subnet has to match this latency + scale or stay in batch-analysis tier.',
      },
      {
        label: 'Q3 2026 go-live latency',
        value: 'Subnet ships when ad-tech moves quarterly',
        note: 'Halftime\'s "planned go-live Q3 2026" is months out. Ad-tech evolves quarterly (new platform policies, Chrome Privacy Sandbox phases). Subnet ships into a moving target — has to choose between launching shipping-ready or shipping perfect.',
      },
      {
        label: 'Adobe Creative Cloud integration',
        value: 'Creative pipeline runs on Adobe',
        note: 'Real creative workflows use Photoshop + Premiere + After Effects. Adobe Firefly + Sensei AI integrate natively. Subnet multimodal-intelligence outputs without Adobe plugin support stay disconnected from the creative bench.',
      },
    ],
  },

  /* SN32 ItsAI (its-ai.org) — High-quality AI text detection.
     Rivals: Hive AI, GPTZero, Turnitin, Originality.ai. */
  32: {
    rivals: ['hive-ai', 'patronus-ai', 'lakera', 'hugging-face', 'anthropic', 'openai'],
    supplyChainIds: ['nvidia', 'aws-azure-gcp'],
    constraints: [
      {
        label: 'False-positive rate on human text',
        value: 'GPTZero: ~15% FP rate on academic writing',
        note: 'AI-text detectors flag human writers regularly — especially ESL + formal academic prose. Centralized rivals manage this; subnet validator scoring must penalize FP heavily or the product damages innocent humans (students, journalists).',
      },
      {
        label: 'Model-version arms race',
        value: 'Each new frontier model breaks old detectors',
        note: 'GPT-5, Claude 4 outputs are harder to detect than GPT-3.5. Detector training has to keep pace. Subnet retrain cadence has to match frontier-model release cycle (~quarterly) or accuracy decays.',
      },
      {
        label: 'Adversarial-paraphrasing surface',
        value: 'Quillbot + DeepL break most detectors',
        note: 'Users paraphrase AI output through Quillbot to bypass detectors. Robustness against paraphrasing is the active research front. Subnet detector must benchmark against paraphrase attacks or readers find easy bypasses.',
      },
      {
        label: 'Legal-evidence admissibility',
        value: 'No US court has accepted AI-detector output yet',
        note: 'Academic disciplinary use + employment screening generate lawsuits. Centralized rivals position carefully ("indicative, not conclusive"). Subnet has to make same legal-positioning explicit or face the same litigation surface.',
      },
    ],
  },

  /* SN41 Almanac — Incentivized market intelligence. Rivals:
     Bloomberg, Palantir, Quantexa, Snowflake, AlphaSense. */
  41: {
    rivals: ['palantir', 'quantexa', 'snowflake', 'bloomberg-feed', 'jane-street', 'numerai'],
    supplyChainIds: ['bloomberg-feed', 'cme-nyse-access', 'aws-azure-gcp'],
    constraints: [
      {
        label: 'Source-coverage breadth',
        value: 'Bloomberg covers ~40K data points/security',
        note: 'Bloomberg Terminal aggregates filings, news, earnings, alt-data on every public security. Replicating breadth at decentralized scale needs multi-source ingest + entity resolution. Subnet has to either narrow to a niche or accept incomplete coverage.',
      },
      {
        label: 'Insider-trading + MNPI surface',
        value: 'Market intelligence touches material non-public info',
        note: 'Real market-intel work brushes against MNPI rules (SEC, MAR). Centralized rivals have compliance officers. Subnet miners contributing data face the same surface without the legal infrastructure.',
      },
      {
        label: 'Real-time vs research depth',
        value: 'Bloomberg: real-time · Almanac: research-grade',
        note: 'Different customers want different latencies. HFT shops want millisecond ticks; long-only funds want monthly research. Subnet has to commit to a tier — covering both means losing focus.',
      },
      {
        label: 'Miner-incentive vs signal-quality',
        value: 'Pay-per-data attracts noise',
        note: 'Incentivizing market intel pays for contribution. Without strong validator scoring, miners flood low-quality signals. Numerai\'s staked-prediction model addresses this; subnet validator design must adopt or face data-quality erosion.',
      },
    ],
  },

  /* SN54 Yanez MIID — Synthetic identities for financial-crime
     prevention. Rivals: Hawk:AI, ComplyAdvantage, Chainalysis,
     Quantexa, Palantir, SAS. */
  54: {
    rivals: ['quantexa', 'palantir', 'chainlink-oracles', 'snowflake', 'patronus-ai', 'hive-ai'],
    supplyChainIds: ['nvidia', 'aws-azure-gcp', 'cloudflare-edge'],
    constraints: [
      {
        label: 'Adversarial-realism bar',
        value: 'Bank fraud teams catch test-identities in <1hr',
        note: 'High-quality synthetic identities for AML testing have to fool real fraud-detection systems. Quantexa + Palantir spend years tuning detectors. Subnet synthetic identities have to pass adversarial bar or the testing value collapses.',
      },
      {
        label: 'Privacy laundering risk',
        value: 'Same tech enables real-world fraud',
        note: 'Synthetic identities tested defensively can be repurposed offensively (synthetic-identity fraud is a $20B+/yr problem). Subnet has to either gate access (KYC for users — defeats decentralization) or accept the dual-use surface.',
      },
      {
        label: 'Population-statistics fidelity',
        value: 'Names + addresses + SSN patterns + behaviors',
        note: 'Useful synthetic identities reproduce real population statistics (Bayesian priors on name × demographics × geography × behavior). Centralized rivals invest in this. Subnet has to commit similar effort or produce identities that don\'t replicate real-world fraud patterns.',
      },
      {
        label: 'Regulatory acceptance',
        value: 'Banks need regulator-approved test data',
        note: 'Bank AML systems are regulator-tested. Synthetic data used for AML testing has to be regulator-approved (or at least defensible). Subnet anonymous-miner synthetic data without provenance trail can\'t be used in regulated tests.',
      },
    ],
  },

  /* SN70 NexisGen — The dataset engine of decentralized AI.
     Rivals: Scale AI, Hugging Face datasets, Snowflake,
     Databricks, Bright Data. */
  70: {
    rivals: ['scale-ai', 'hugging-face', 'snowflake', 'databricks', 'bright-data', 'apify'],
    supplyChainIds: ['aws-azure-gcp', 'cloudflare-edge', 'us-power-grids'],
    constraints: [
      {
        label: 'Annotation-quality gap',
        value: 'Scale AI: 20K+ annotators with QA',
        note: 'Real training-dataset quality depends on annotation quality. Scale AI runs dedicated annotator workforces. Subnet crowd-sourced annotations need validator-scored quality checks or labels are noisy enough to hurt downstream training.',
      },
      {
        label: 'Domain-specialized data licensing',
        value: 'Medical + legal data behind walls',
        note: 'High-value training data (medical records, legal filings, finance data) lives in licensed silos. Subnet "dataset engine" has to navigate domain-specific licensing or focus on commons-available data where it competes with free Hugging Face datasets.',
      },
      {
        label: 'AI-lab demand specificity',
        value: 'Frontier labs want specific data, not generic',
        note: 'OpenAI + Anthropic want specific reasoning traces, code, math. Generic scraped data has saturated. Subnet has to ship targeted-collection capability or accept commodity-data pricing.',
      },
      {
        label: 'Synthetic-data substitution',
        value: 'Frontier labs increasingly synthesize',
        note: 'OpenAI o1 + Anthropic increasingly train on synthetic data + RL trajectories rather than human-labeled. Demand for human-labeled data may stagnate. Subnet has to anticipate this shift or focus on data types synthetic can\'t replace.',
      },
    ],
  },

  /* SN7 Allways — "universal transaction layer" (live identity
     per taostats 2026-05-22, all-ways.io). Likely targets the
     cross-chain / universal-execution-layer category. Rival pool:
     Ethereum + L2s, Solana, Cosmos IBC, LayerZero. */
  7: {
    rivals: ['ethereum-l1', 'solana', 'cosmos-network', 'layerzero', 'wormhole', 'chainlink-ccip'],
    supplyChainIds: ['ethereum-l1-gas', 'chainlink-oracles', 'aws-azure-gcp'],
    constraints: [
      {
        label: 'L1 network-effect lock-in',
        value: 'Ethereum: $300B+ TVL · Solana: ~$10B',
        note: 'Smart-contract networks accumulate developer + liquidity flywheels over years. Subnet "universal transaction layer" has to either bootstrap independent network effect (rare) or anchor to existing chains as overlay. Either path is expensive in time + capital.',
      },
      {
        label: 'Transaction-finality SLA',
        value: 'Solana: ~400ms · Ethereum L1: ~12s · L2s: variable',
        note: 'Universal transaction layer competing on speed needs sub-second finality. Solana + L2 rollups have engineered to this. Subnet has to either match Solana-grade throughput (hard) or differentiate on cost / interoperability features rather than raw speed.',
      },
      {
        label: 'Validator-set security',
        value: 'Ethereum: 1M+ validators · Cosmos hubs: ~150',
        note: 'Network security scales with validator count + stake distribution. Subnet "transaction layer" must explicitly state its security model — running atop Bittensor inherits TAO\'s security, which is significant but smaller than ETH.',
      },
      {
        label: 'Developer tooling depth',
        value: 'Foundry + Hardhat + Anchor have years of polish',
        note: 'Real adoption follows developer tools. Ethereum has Foundry, Hardhat, ethers.js; Solana has Anchor; Cosmos has CosmWasm. Subnet new "universal" layer has to ship comparable tooling or accept developer friction kills adoption.',
      },
      {
        label: 'Existing-asset migration cost',
        value: 'Bridge security still has $2.8B+ in losses',
        note: 'Convincing users + assets to migrate to a new transaction layer requires bridges with strong security track records. Wormhole, LayerZero have track records (good + bad). New "universal layer" inherits user skepticism.',
      },
    ],
  },

  /* SN27 Nodexo — "Decentralized AI compute platform" (live
     identity per taostats 2026-05-22, nodexo.ai). General
     decentralized GPU compute marketplace. Rival pool overlaps
     SN51 lium + SN64 Chutes but the cut is broader compute. */
  27: {
    rivals: ['coreweave', 'lambda-labs', 'aws-azure-gcp', 'amazon-aws-graviton', 'modal-labs', 'anyscale'],
    supplyChainIds: ['nvidia', 'tsmc', 'sk-hynix', 'us-power-grids'],
    constraints: [
      {
        label: 'GPU spot-price floor',
        value: 'AWS H100 spot: $2-4/hr · CoreWeave: $2.50',
        note: 'Hyperscaler + neocloud spot pricing sets the compute floor. Subnet decentralized compute miners on consumer GPUs (4090, 3090) can\'t match H100 throughput/$. Capture customer use cases where commodity GPUs work (inference, fine-tuning small models) and accept H100-grade workloads stay centralized.',
      },
      {
        label: 'Reliability + SLA',
        value: 'AWS: 99.99% · subnet miners: variable',
        note: 'Enterprise customers expect 99.95%+ uptime SLAs with credits for breach. Subnet miners running on home internet + consumer hardware can\'t commit to this. Capture batch / non-critical workloads; mission-critical stays with hyperscalers.',
      },
      {
        label: 'Compute-verification gaming',
        value: 'How to prove a miner actually ran the GPU job?',
        note: 'Decentralized compute miners can claim work they didn\'t do. Centralized rivals trust their own hardware. Subnet validator design needs cryptographic compute-attestation (zkML, redundant execution, sampled-audit) or accept that some α emission pays for fake work.',
      },
      {
        label: 'Data-residency + compliance',
        value: 'EU AI Act + HIPAA + SOC 2 demand specific regions',
        note: 'Enterprise customers need to know where their data is processed. AWS lets you pin to us-east-1. Subnet routing to anonymous miners can\'t guarantee region-of-origin without dedicated miner pools, which weakens decentralization.',
      },
      {
        label: 'Software-stack maintenance',
        value: 'CUDA + drivers + ML libs update monthly',
        note: 'Real GPU compute requires maintained CUDA + PyTorch + Triton + driver stacks. AWS + CoreWeave ship images. Subnet miners maintaining their own stacks drift; jobs designed against one miner\'s stack fail on another. Standardization is a real operational cost.',
      },
    ],
  },

  /* SN23 Trishool — "Trishool is the AI alignment protocol
     built on Bittensor" (live identity per taostats 2026-05-22,
     trishool.ai). Decentralized AI alignment / safety. Rival
     pool is the AI-safety org stack — frontier labs\' safety
     teams plus independent eval / alignment shops. */
  23: {
    rivals: ['anthropic', 'openai', 'google', 'arc-prize', 'apollo-research', 'patronus-ai'],
    supplyChainIds: ['nvidia', 'aws-azure-gcp', 'us-power-grids'],
    constraints: [
      {
        label: 'Alignment-eval ground truth',
        value: 'No agreed test of "aligned"',
        note: 'Anthropic\'s constitutional-AI, OpenAI\'s Preparedness, DeepMind\'s Frontier Safety — each uses its own framework. No industry-standard "aligned" benchmark. Subnet "alignment protocol" needs to pick a methodology + defend it; readers can\'t agree on the outcome.',
      },
      {
        label: 'Safety-research talent concentration',
        value: '~500 AI safety researchers globally',
        note: 'AI safety as a field is small — most top researchers concentrated at Anthropic, DeepMind, OpenAI Safety, Apollo, MIRI. Subnet attracting safety talent has to either compete with $1M+ comp packages or accept long-tail contributors.',
      },
      {
        label: 'Capability vs safety tradeoff',
        value: 'Frontier labs ship capability faster than safety',
        note: 'Anthropic\'s Responsible Scaling Policy + OpenAI\'s safety thresholds get pushed when capability outpaces safety work. Decentralized alignment subnet faces the same pressure: miners get rewarded for technique production, not for slowing capability.',
      },
      {
        label: 'Disclosure of safety findings',
        value: 'Constitutional + dangerous-capability evals stay private',
        note: 'Frontier labs publish safety research selectively (Anthropic\'s "Sleeper Agents," OpenAI\'s o1 system card). Dangerous-capability findings stay private. Subnet "open alignment" claims have to navigate the same disclosure tension — full openness may produce uplift for misuse.',
      },
      {
        label: 'Regulator-readable safety claims',
        value: 'EU AI Act + Biden EO 14110 demand specific evals',
        note: 'Regulatory frameworks (EU AI Act, UK AISI, US AISI) demand specific evaluations (CBRN, autonomous replication, etc). Subnet alignment work has to map to regulator-readable categories or it\'s academically interesting but not commercially actionable.',
      },
    ],
  },

  /* SN35 OxMarkets — "Liquidity-as-a-Service subnet powering
     0xMarkets - a permissionless perp DEX for FX, crypto, and
     commodities" (live identity per taostats 2026-05-22,
     0xmarkets.io). Provides LP liquidity to a perp DEX. Rival
     pool is the dominant perp DEX leaders. */
  35: {
    rivals: ['hyperliquid', 'dydx', 'gmx', 'aave-labs', 'uniswap', 'jane-street'],
    supplyChainIds: ['ethereum-l1-gas', 'chainlink-oracles', 'aws-azure-gcp'],
    constraints: [
      {
        label: 'Liquidity-cold-start',
        value: 'Hyperliquid ~$500B cumulative volume',
        note: 'Perp DEX traders need deep books. Hyperliquid + dYdX have multi-year liquidity flywheels. Subnet LP-as-a-Service has to subsidize depth via α emission until organic volume covers fees — bootstrap math is brutal.',
      },
      {
        label: 'MEV / sandwich risk',
        value: 'Up to 5% of perp volume captured by MEV',
        note: 'Public-mempool perp DEXes leak alpha to MEV searchers — Hyperliquid built private order matching to address this. Subnet LaaS perp\'s settlement layer (which chain, which mempool) determines MEV surface; passes through to LP returns.',
      },
      {
        label: 'USDC custody chain',
        value: '"Deposit USDC" — who holds the keys?',
        note: 'The product invites users to "Deposit USDC. Earn Spread + Fees + Alpha." That custody flow has to be either smart-contract-non-custodial OR a bank-trust setup. Either way the subnet has user funds at risk — security audit + insurance posture matters to TVL.',
      },
      {
        label: 'Regulatory framing',
        value: 'CFTC + offshore exchange line',
        note: 'Perp DEX trading is regulated in the US (CFTC) but permissive offshore. dYdX moved Cosmos to sidestep; Hyperliquid runs on its own L1. SN35 LaaS subnet plays into 0xMarkets — the front-end\'s regulatory posture is what determines US-trader access.',
      },
      {
        label: 'Funding-rate volatility',
        value: 'BTC perp funding swings ±0.05%/8hr',
        note: 'Perp funding rates oscillate aggressively in regime changes. LPs absorb the imbalance. Subnet LaaS providers get exposed to funding-rate volatility — capital efficient at low vol, painful at high vol. Worse in non-BTC markets (FX, commodities) where regime changes are deeper.',
      },
    ],
  },

  /* SN15 ORO — "AI commerce agents" (live identity per taostats
     2026-05-22, oroagents.com). Agents that complete commerce
     tasks — product discovery, comparison, checkout. Rival pool
     is the centralized AI-commerce stack: Amazon Rufus (in-
     marketplace agent), Shopify Sidekick, Walmart Sparky,
     Klarna AI Assistant, plus emerging payments-aware agents. */
  15: {
    rivals: ['openai', 'anthropic', 'google', 'meta', 'perplexity', 'replit-agent'],
    supplyChainIds: ['nvidia', 'aws-azure-gcp', 'cloudflare-edge', 'eth-verifier-gas'],
    constraints: [
      {
        label: 'Marketplace API-gating',
        value: 'Amazon / Shopify rate-limit non-partner agents',
        note: 'Amazon Product API + Shopify API both gate by partner tier — third-party agents hit aggressive rate limits unless registered. AI commerce subnets that scrape get blocked or banned. Centralized rivals (Rufus, Sidekick) get unfiltered first-party data.',
      },
      {
        label: 'Checkout fraud surface',
        value: 'Agent-driven purchases = card-not-present risk',
        note: 'A commerce agent placing orders with user payment is a card-not-present transaction. Issuers flag autonomous spending; chargeback exposure is the buyer\'s. Centralized rivals integrate with Stripe / PayPal agent SDKs for tokenized purchase intents — subnet has to either match this or accept friction.',
      },
      {
        label: 'Affiliate-attribution capture',
        value: 'Amazon Associates: 1-10% take-rate',
        note: 'Comparison agents traditionally monetize via affiliate links (Honey, Capital One Shopping). Amazon caps Associates take at 1-10% by category. Subnet α-emission supplements this but customer-facing economics depend on the same affiliate gates centralized rivals already hold.',
      },
      {
        label: 'Trust + return liability',
        value: '"Agent bought wrong item" → who eats the return?',
        note: 'When an agent picks the wrong SKU, the user wants the merchant to take it back. Merchants will start refusing returns on agent-placed orders. Centralized rivals (Rufus) sit inside the marketplace and absorb this — subnet agents living outside have to negotiate it case by case.',
      },
      {
        label: 'Recommendation quality eval',
        value: 'No ground-truth "best product"',
        note: 'Unlike code (tests) or translation (BLEU), "best product for this user" has no objective. Subnet validators scoring agent recommendations have to either crowdsource user reviews (slow, expensive) or trust click-through (gameable). Centralized rivals have actual purchase + return data the subnet can\'t access.',
      },
    ],
  },

  /* SN24 Quasar — "Bittensor subnet built to crush the long-
     context barrier" (live identity per taostats 2026-05-22,
     silxinc.com). Long-context LLM serving. Rival pool is the
     centralized labs that already ship 200K-2M context windows
     plus the dedicated long-context efficiency shops. */
  24: {
    rivals: ['anthropic', 'google', 'openai', 'ai21-labs', 'together-ai', 'mistral'],
    supplyChainIds: ['nvidia', 'tsmc', 'sk-hynix', 'aws-azure-gcp'],
    constraints: [
      {
        label: 'Context-window arms race',
        value: 'Gemini 2M · Claude 1M · GPT-4o 200K',
        note: 'Frontier labs ship 200K-2M context windows. AI21 Jamba uses Mamba/Transformer hybrid for 256K+ at lower memory cost. Subnet has to either match the frontier window or differentiate on cost-per-token at long context (where attention scaling bites hardest).',
      },
      {
        label: 'KV-cache memory tax',
        value: '~2GB per 100K tokens (FP16)',
        note: 'Long-context inference\'s real cost is the KV cache, not the model weights. Holding 1M tokens of state at FP16 needs ~20GB VRAM per request. Centralized rivals use PagedAttention / radix-attention tricks; subnet miners on commodity hardware have to ship the same optimizations or run smaller windows.',
      },
      {
        label: 'Long-context eval validity',
        value: 'Needle-in-haystack hits ceiling fast',
        note: 'Synthetic needle-in-haystack benchmarks (RULER, NIAH) saturate near 100% on frontier models — they don\'t differentiate real reasoning over long context. Real eval needs multi-fact / multi-hop tasks. Subnet validators have to pick the right benchmark or score what doesn\'t matter.',
      },
      {
        label: 'Token-cost arbitrage window',
        value: 'Long-context API runs $3-15/M tokens',
        note: 'Claude 200K context costs ~$3-15/M tokens depending on tier. Together / Fireworks undercut at ~$1-3/M on open models. Subnet alpha-economics need to undercut Together/Fireworks (not Anthropic) to capture cost-sensitive volume — Anthropic owns the quality bar.',
      },
      {
        label: 'Latency at large context',
        value: 'TTFT scales O(n²) without tricks',
        note: 'Time-to-first-token at 1M context: ~10-60s on a single GPU without optimization. Frontier providers use speculative decoding + prefix caching. Decentralized miners running commodity inference have a structural latency disadvantage; capture price-sensitive batch jobs, not chat.',
      },
    ],
  },

  /* SN92 TensorClaw — "decentralized Large Language Model (LLM)
     inference subnet built on the Bittensor network. Its core
     purpose is to aggregate high-quality LLM API nodes (e.g.,
     OpenAI, DeepSeek, Claude, ...)" (live identity per taostats
     2026-05-22, tensorclaw.ai). Aggregator + meta-router on top
     of frontier LLM APIs. Rival pool overlaps SN4 Targon
     (commodity inference) + SN81-era PatRouter (model routing). */
  92: {
    rivals: ['openrouter', 'together-ai', 'fireworks-ai', 'aws-bedrock', 'replicate', 'modal-labs', 'anyscale'],
    supplyChainIds: ['nvidia', 'tsmc', 'sk-hynix', 'aws-azure-gcp'],
    constraints: [
      {
        label: 'API-key dependency',
        value: 'OpenAI/Anthropic ToS gate aggregator usage',
        note: 'Aggregating frontier APIs (OpenAI, Anthropic) at scale requires miners holding API keys with sufficient quota. Both providers can throttle or terminate keys used for "competing aggregation" — the ToS is broad enough to cover meta-aggregator behavior.',
      },
      {
        label: 'Cost-pass-through margin',
        value: 'OpenRouter takes ~5% above provider cost',
        note: 'The aggregator margin compresses fast — OpenRouter runs ~5% above raw provider cost. Subnet miners reward via α emission, but the customer-facing cost has to undercut OpenRouter or match it with reliability features (multi-key failover, regional routing) the centralized aggregator can\'t match.',
      },
      {
        label: 'Latency-of-discovery',
        value: 'Routing add adds 50-150ms per prompt',
        note: 'Miner discovery + price quote + provider selection adds latency over a direct API call. Frontier providers like Bedrock have edge-located endpoints; subnet aggregator nodes don\'t. Capture batch / async traffic where latency tax is invisible.',
      },
      {
        label: 'Quality scoring across providers',
        value: 'Same prompt, different answers',
        note: 'GPT-4o vs Claude vs DeepSeek give different answers to the same prompt. A meta-aggregator routing "to the best provider" requires a quality predictor — adding another LLM inference cost. Subnet either ships a quality model or defaults to cheapest, in which case it\'s an OpenRouter clone.',
      },
      {
        label: 'Provider rate-limit surface',
        value: 'TPM caps + outages drift weekly',
        note: 'OpenAI / Anthropic publish per-org token-per-minute caps; both have had multi-hour outages. Aggregator routing decisions cached on stale rate-limit info send traffic into 429 walls. Subnet has to maintain near-real-time provider health — adds infra cost.',
      },
    ],
  },

  /* SN120 Affine — "Reason Mining" (live identity per taostats
     2026-05-22, affine.io). Mines reasoning trajectories /
     reasoning models. Rival pool is the reasoning-LLM space —
     OpenAI o-series, DeepSeek-R1, Anthropic Claude extended
     thinking, Google Gemini Deep Think, xAI Grok reasoning. */
  120: {
    rivals: ['openai', 'anthropic', 'google', 'mistral', 'sakana-ai', 'meta'],
    supplyChainIds: ['nvidia', 'tsmc', 'sk-hynix', 'aws-azure-gcp', 'us-power-grids'],
    constraints: [
      {
        label: 'Reasoning RL compute floor',
        value: 'o1-style training: $10M-$100M+',
        note: 'OpenAI o1 training reportedly required 10-100x more inference compute than GPT-4 base model training. DeepSeek-R1 hit comparable quality at ~$5-10M (per public reports). Subnet must crowdsource compute or differentiate on diversity of reasoning trajectories vs sheer model size.',
      },
      {
        label: 'Reasoning trace quality',
        value: 'Verifier-as-judge bias',
        note: 'Training reasoning models requires scoring reasoning traces. Centralized labs use process-reward models trained on human-annotated traces — expensive but defensible. Subnet validators need either crowdsourced human eval or model-as-judge, which inherits judge bias (sycophancy, self-preference).',
      },
      {
        label: 'Inference-time scaling cost',
        value: '10-100x base inference per query',
        note: 'Reasoning models burn extra inference at query time (chain-of-thought + self-correction). OpenAI charges 4x for o1 over GPT-4o. Subnet has to ship the same reasoning-tax pricing or its α-emission economics get overwhelmed by inference cost.',
      },
      {
        label: 'Verifiable correctness',
        value: 'Math / code: yes · open-ended: no',
        note: 'Reasoning on math / code can be verified (does the proof check? do the tests pass?). Reasoning on policy / ethics / strategy has no ground-truth. Subnet validator scoring works for verifiable domains; for the rest, miners game whatever proxy is used.',
      },
      {
        label: 'Trajectory length explosion',
        value: 'o1-pro emits 10K-50K reasoning tokens',
        note: 'High-end reasoning traces run tens of thousands of tokens. KV-cache cost compounds (rule from SN24 Quasar). Subnet inference miners running smaller models have either to compress trajectories or accept worse reasoning depth — both visible in evals.',
      },
    ],
  },

  /* SN114 SOMA — "AI solutions delivered through MCP infrastructure"
     (live identity per taostats 2026-05-22, thesoma.ai). Builds
     on top of Anthropic\'s Model Context Protocol — a standard
     for connecting LLMs to tools + data sources. Rival pool is
     the agent-infra layer: Composio (250+ tool integrations),
     LangChain (orchestration), Anthropic itself (MCP creators). */
  114: {
    rivals: ['anthropic', 'composio', 'langchain', 'openai', 'cursor', 'cognition-devin'],
    supplyChainIds: ['nvidia', 'aws-azure-gcp', 'cloudflare-edge'],
    constraints: [
      {
        label: 'MCP spec velocity',
        value: 'Anthropic updates protocol every ~6 weeks',
        note: 'MCP is Anthropic\'s open standard but Anthropic controls the spec velocity. Each spec revision (transport layer, tool-result schema, resource subscriptions) ships updates to clients (Claude Desktop, Cursor) before community implementations catch up. Decentralized MCP infra has a perpetual catch-up tax.',
      },
      {
        label: 'Tool-integration depth',
        value: 'Composio: 250+ · LangChain: 600+',
        note: 'The tool-integration moat is built by maintaining individual integrations against changing third-party APIs. Composio + LangChain employ dedicated integration engineers. Subnet aggregating community-contributed MCP servers gets breadth without the depth.',
      },
      {
        label: 'Trust model for tool calls',
        value: 'Tool exec = remote-code-exec equivalent',
        note: 'MCP servers expose APIs that LLMs call with model-generated arguments — prompt injection in a doc can trigger arbitrary tool calls. Centralized rivals gate via per-tool allowlists + user confirmation prompts. Decentralized subnet must specify the same security model or readers don\'t trust deployment.',
      },
      {
        label: 'Latency budget for tool chains',
        value: '5-15 tool calls per agent task',
        note: 'A real agent task chains 5-15 tool calls. Each hop adds 100-500ms. Subnet MCP nodes adding miner-routing overhead inflate the chain. Composio runs the tool-server cluster in-region; subnet decentralizes that and pays the trade-off in latency.',
      },
      {
        label: 'Auth/credential surface',
        value: 'Per-user OAuth flows for 100+ services',
        note: 'Tools need user credentials (GitHub, Slack, Notion tokens). Composio handles OAuth + token refresh + rotation. Decentralized MCP subnet either trusts miners with user creds (security regress) or builds an oracle for credential proxying (added latency + complexity).',
      },
    ],
  },

  /* SN36 Eirel — "The execution layer for multimodal AI
     workflows" (live identity per taostats 2026-05-22,
     eirel.ai). Workflow orchestration for multimodal pipelines
     (text + image + audio + video). Rival pool overlaps SN114
     SOMA (agent infra) but lower-level — closer to LangChain /
     LlamaIndex / Pipedream territory. */
  36: {
    rivals: ['langchain', 'composio', 'anthropic', 'openai', 'replicate', 'modal-labs'],
    supplyChainIds: ['nvidia', 'aws-azure-gcp', 'cloudflare-edge'],
    constraints: [
      {
        label: 'Cross-modal latency budget',
        value: 'TTS + STT + image-gen chain: 2-10s',
        note: 'A multimodal workflow (e.g., voice-to-text → LLM → image-gen → narration) chains 3-5 model calls. Centralized providers (Pipedream, n8n) co-locate; decentralized miners across multiple subnets / regions add 100-500ms per hop. Capture batch / async use cases, not interactive.',
      },
      {
        label: 'Modality-coverage matrix',
        value: '~12 distinct modal endpoints to support',
        note: 'Real multimodal workflows touch text, embeddings, images, video, audio (TTS+STT), 3D, code, and PDF/document. Each is a different model + API. LangChain has integration adapters for all 12. Subnet has to either ship adapters per modality or accept that workflows break at the unsupported step.',
      },
      {
        label: 'Output-quality verification',
        value: 'Multi-stage = compounding error',
        note: 'A 5-step workflow with 95% per-step success drops to 77% end-to-end. Centralized rivals expose retry / branching policies; subnet workflow validators have to score not just final output but stage-by-stage correctness — that\'s 5x the eval cost.',
      },
      {
        label: 'Workflow-state persistence',
        value: 'Mid-workflow crashes need durable state',
        note: 'A workflow that crashes mid-execution needs to resume from the last checkpoint. Centralized rivals run state in Postgres / Redis. Subnet workflow miners running on commodity hardware have to either own the state machine or hand off to a centralized state store, which weakens the decentralization claim.',
      },
      {
        label: 'Asset-handling cost',
        value: 'Video assets at 100MB-10GB per workflow',
        note: 'Multimodal workflows pass video / image assets between steps — at scale this is gigabytes of object storage + bandwidth. Cloudflare R2 / AWS S3 win on egress pricing. Subnet workflow nodes running on commodity bandwidth pay 5-20x more per GB; visible in price/workflow.',
      },
    ],
  },

  /* SN47 EvolAI — "A subnet focused on the research,
     development, and evaluation of evolving AI systems" (live
     identity per taostats 2026-05-22). Evolutionary methods +
     research-loop automation. Rival pool overlaps with Sakana
     AI (evolutionary methods) + the auto-research labs. */
  47: {
    rivals: ['sakana-ai', 'openai', 'anthropic', 'google', 'meta', 'hugging-face'],
    supplyChainIds: ['nvidia', 'tsmc', 'sk-hynix', 'aws-azure-gcp', 'us-power-grids'],
    constraints: [
      {
        label: 'Evolutionary compute scale',
        value: '1K-100K candidate evaluations per generation',
        note: 'Evolutionary methods need thousands of candidate model evals to converge. Sakana published "Evolutionary Model Merge" at this scale. Subnet has to either crowdsource the eval compute or differentiate on novel fitness functions that need fewer evaluations.',
      },
      {
        label: 'Research-loop reproducibility',
        value: 'Same seed, different hardware → different results',
        note: 'GPU non-determinism (atomic ops, kernel selection) means same seed produces different results across miners. Centralized labs run single-cluster reproducibility; decentralized subnet has to either accept the variance or ship a deterministic kernel suite — both have costs.',
      },
      {
        label: 'Population diversity collapse',
        value: 'Top-k selection kills diversity at gen ~10-50',
        note: 'Classical evolutionary algorithms collapse to one strain after 10-50 generations of top-k selection. Sakana addresses via diversity-preservation + island models. Subnet validator scoring has to make diversity a first-class metric or watch all miners converge on one solution.',
      },
      {
        label: 'Result-verification burden',
        value: 'Centralized labs hold the reference benchmarks',
        note: 'Frontier labs (Anthropic, OpenAI, Google) publish their own results on benchmarks they themselves curate. Independent verification is hard. Subnet "evolving AI" claims need to land on independently-reproducible benchmarks or readers can\'t trust the leaderboard.',
      },
      {
        label: 'IP / publication norms',
        value: 'Anonymous miners can\'t publish papers',
        note: 'Academic + industry-research norms expect named authors + institutional affiliation. Decentralized miners producing real research can\'t take credit without doxxing. Sakana publishes openly; subnet authorship convention is unclear — affects which talent will mine vs publish.',
      },
    ],
  },

  /* SN82 Compelle — "AIs debate until they are AGI" (live
     identity per taostats 2026-05-22, compelle.com). Multi-
     agent debate / argumentation as a path to capability. Rival
     pool is constitutional-AI labs + multi-agent research labs +
     debate-format competitors. */
  82: {
    rivals: ['anthropic', 'openai', 'google', 'meta', 'sakana-ai', 'mistral'],
    supplyChainIds: ['nvidia', 'tsmc', 'sk-hynix', 'aws-azure-gcp'],
    constraints: [
      {
        label: 'Debate-as-alignment evidence',
        value: 'Anthropic + DeepMind have mixed results',
        note: 'DeepMind\'s "AI safety via debate" + Anthropic\'s constitutional-AI both lean on multi-agent argumentation. Published results show modest gains over single-model RLHF — not a path to AGI on its own. Subnet "AGI via debate" claim has to either reproduce known gains or differentiate on new mechanism.',
      },
      {
        label: 'Judge-LLM dependency',
        value: 'Outcome depends on the judge model',
        note: 'Debate quality is measured by a judge LLM picking the winner. The judge\'s biases (self-preference, refusal patterns) dominate the metric. Centralized rivals (Anthropic) rotate judges + use human eval; subnet must either crowdsource judges (expensive) or accept judge-bias confound.',
      },
      {
        label: 'Compute per debate round',
        value: '2-N LLM calls per turn × 10-100 turns',
        note: 'A multi-turn N-agent debate burns N×turns LLM calls plus judge calls per round. At 10 turns × 2 agents × 1 judge = 30 LLM calls per debate. Subnet validator scoring has to amortize this somehow or only the largest miners can afford participation.',
      },
      {
        label: 'Argumentation vs reasoning',
        value: 'Persuasive ≠ correct',
        note: 'A model trained to win debates learns persuasion, not correctness — known result from OpenAI\'s "debate" experiments. Subnet has to score truth + soundness, not just rhetoric. That requires a ground-truth oracle for the debate topic, which doesn\'t exist for open-ended AGI claims.',
      },
      {
        label: 'AGI claim verification',
        value: 'No accepted benchmark for "AGI"',
        note: 'There is no industry-standard "AGI test." ARC-AGI, MMLU, GPQA, Humanity\'s Last Exam each capture slices. Subnet "until they are AGI" framing has no terminating condition — the magazine\'s editorial register has to treat this as ambitious framing rather than a deliverable.',
      },
    ],
  },

  /* SN99 Leoma — "Decentralized Video Generation Platform"
     (live identity per taostats 2026-05-22, leoma.ai). Text-to-
     video generation. Rival pool is the 2025-2026 video-gen
     leaderboard: Sora, Veo, Kling, Hailuo, Pika, Runway. */
  99: {
    rivals: ['openai-sora-v2', 'google-veo', 'kling-ai', 'hailuo-ai', 'pika-labs', 'runway'],
    supplyChainIds: ['nvidia', 'tsmc', 'sk-hynix', 'aws-azure-gcp', 'us-power-grids'],
    constraints: [
      {
        label: 'Generation cost',
        value: 'Sora: ~$0.20-$2 per minute · Veo: comparable',
        note: 'Frontier video gen runs $0.20-$2 per generated minute on consumer tiers. Subnet miners on commodity GPUs pay more (smaller batch, less optimized kernels) — capture the cost-sensitive long-tail or accept margin compression.',
      },
      {
        label: 'Motion-physics coherence',
        value: 'Sora + Veo 3 lead; long-tail collapses',
        note: 'The hard problem in 2026 isn\'t image quality but multi-second motion coherence (objects persist, physics behaves). Sora + Veo + Kling lead; open-source alternatives (Mochi, CogVideoX) drop measurably at 5s+. Subnet has to either match leader coherence or accept short-clip-only positioning.',
      },
      {
        label: 'Audio + lip-sync integration',
        value: 'Veo 3 ships audio; Sora doesn\'t (yet)',
        note: 'Video-gen quality bar moved past silent clips — Veo 3 + Hailuo ship native audio + sound effects. Subnet video-gen without audio integration produces less-usable output; readers feel the gap.',
      },
      {
        label: 'Safety / deepfake guardrails',
        value: 'Centralized rivals refuse celeb / minor likeness',
        note: 'Sora + Veo + Kling reject celebrity / political / minor face prompts. Subnet "open" generation inherits the deepfake / CSAM / election-misuse surface. Validator design has to gate this or face platform-level bans (App Store, Play Store, EU AI Act).',
      },
      {
        label: 'Watermarking + provenance',
        value: 'C2PA Content Credentials becoming default',
        note: 'OpenAI, Google, Adobe, Microsoft all signed onto C2PA Content Credentials for generative provenance. Subnet output without C2PA metadata gets flagged downstream (social platforms strip / hide) — capture this in spec or readers ship un-shareable content.',
      },
    ],
  },

  /* SN108 TalkHead — "Talking Head Generation" (live identity
     per taostats 2026-05-22). Lip-sync talking-head video
     generation. Rival pool is dominated by HeyGen / Synthesia /
     D-ID / Tavus — these own the enterprise + consumer surfaces. */
  108: {
    rivals: ['heygen', 'synthesia', 'd-id', 'tavus', 'openai-sora-v2', 'google-veo'],
    supplyChainIds: ['nvidia', 'aws-azure-gcp', 'tsmc'],
    constraints: [
      {
        label: 'Avatar-library breadth',
        value: 'Synthesia 230 · HeyGen 300+ avatars',
        note: 'Enterprise customers expect a curated avatar library — different ethnicities, ages, business attire, casual, multilingual lip-sync. Centralized rivals invest in licensed-actor capture. Subnet has to either crowdsource avatars (legal + quality risk) or focus on user-supplied photos.',
      },
      {
        label: 'Real-time vs. async generation',
        value: 'Tavus Phoenix-3 + D-ID stream live; subnet typically async',
        note: 'Real-time talking-head (conversational AI avatars) requires <300ms per frame. Tavus + D-ID run this on dedicated GPU clusters. Subnet inference miners with variable latency can\'t guarantee real-time — capture pre-generated video market, not live-call avatars.',
      },
      {
        label: 'Voice-cloning licensing',
        value: 'Voice IP rights getting tightened (SAG-AFTRA, EU)',
        note: 'Cloning a voice without consent is now regulatory (SAG-AFTRA contracts, EU AI Act, Tennessee ELVIS Act). HeyGen + ElevenLabs require voice-owner verification. Subnet without strong consent verification ships into a regulatory headwind.',
      },
      {
        label: 'Deepfake-misuse surface',
        value: 'Identity-theft + non-consensual content',
        note: 'Talking-head generation enables identity-theft scams + non-consensual intimate imagery. Centralized rivals run watchlists + face-similarity bans against public figures. Subnet "open" generation inherits this — validator scoring has to gate or readers face the same App Store / EU bans as image-gen.',
      },
      {
        label: 'Enterprise integration depth',
        value: 'Synthesia: SCORM / LMS export + brand kits',
        note: 'Synthesia + HeyGen ship SCORM exports for corporate LMS (Cornerstone, Workday), brand-kit color/font enforcement, multi-stakeholder review workflows. Subnet talking-head output without these features is the "raw video" tier; enterprise customers stay with centralized rivals for the platform.',
      },
    ],
  },

  /* SN50 Synth — "Predictive intelligence for financial markets
     and beyond" (live identity per taostats 2026-05-22,
     synthdata.co). Crowdsourced ML predictions for trading.
     The closest centralized analog is Numerai\'s tournament
     model; the closest institutional rivals are the quant
     funds (Renaissance, Citadel, Jane Street, Jump Trading). */
  50: {
    rivals: ['numerai', 'renaissance-tech', 'citadel-securities', 'jane-street', 'jump-trading', 'bloomberg-feed'],
    supplyChainIds: ['bloomberg-feed', 'cme-nyse-access', 'aws-azure-gcp', 'us-power-grids'],
    constraints: [
      {
        label: 'Alpha-decay half-life',
        value: 'Edge halves every ~6 months',
        note: 'Public crowd-sourced predictions decay fast — once a signal works, it gets crowded into. Numerai handles this via meta-model + staking (only confident predictions count). Subnet must build the same staked-confidence machinery or watch the leaderboard converge on yesterday\'s ideas.',
      },
      {
        label: 'Data licensing',
        value: 'Bloomberg terminal: $30K/yr · Refinitiv: $22K',
        note: 'Real-time market data is gated. Renaissance + Citadel pay $millions/yr for tick data. Subnet miners on free APIs (Yahoo, CoinGecko) work with delayed + lower-quality data — the structural disadvantage at the institutional edge.',
      },
      {
        label: 'Eval-metric gaming',
        value: 'Sharpe / Information Coefficient hackable',
        note: 'Validators scoring on Sharpe or IC reward miners who time variance peaks rather than capture true alpha. Numerai uses meta-model + payout staking; subnet validator design has to inherit these defenses or pay out to noise.',
      },
      {
        label: 'Regime-change blindness',
        value: '2020 / 2022 / 2024 drawdowns broke top quants',
        note: 'Historic ML predictions fail when market regime changes (rate cycles, crypto winters, geopolitical shocks). Quant funds use macro overlays. Subnet purely-data-driven predictions inherit the regime-change exposure without the human judgment overlay.',
      },
      {
        label: 'Trading-cost amortization',
        value: 'Edge < 50 bps disappears at retail commissions',
        note: 'A prediction edge of 50bps gets eaten by spreads + commissions for retail-size trading. Hedge funds amortize on size. Subnet predictions monetized by retail readers lose most edge to friction unless paired with low-cost execution.',
      },
    ],
  },

  /* SN77 Liquidity — "Supply liquidity on external chains via
     uniswap, incentivize any project" (live identity per
     taostats 2026-05-22, sn77.xyz). Provides LP liquidity to
     Uniswap pools, incentivized by α emission. Rival pool is
     the on-chain LP / yield space. */
  77: {
    rivals: ['uniswap', 'aave-labs', 'compound-finance', 'yearn-finance', 'morpho-labs', 'gmx'],
    supplyChainIds: ['ethereum-l1-gas', 'chainlink-oracles', 'aws-azure-gcp'],
    constraints: [
      {
        label: 'Impermanent loss',
        value: 'Standard 50/50 LP: ~20-30% IL on 2x move',
        note: 'Uniswap V2-style LPs eat IL on volatile pairs. V3/V4 concentrated liquidity partially fixes but adds management overhead. Subnet LP-as-a-Service amplifies IL exposure across miners — α emission has to compensate or LPs withdraw.',
      },
      {
        label: 'Fee tier compression',
        value: 'V3 fees: 0.05% / 0.3% / 1% — race to 0.05%',
        note: 'Uniswap V3 fee tiers compress as competing AMMs (Curve, Balancer, PancakeSwap) undercut. SN77 subsidies + miner-routed liquidity have to clear declining fee economics — the moat is in directing emission to pools centralized AMMs can\'t reach.',
      },
      {
        label: 'Cross-chain LP coordination',
        value: 'Ethereum, Arbitrum, Base, Solana fragmented',
        note: 'Liquidity is split across Ethereum L1, L2s (Arbitrum, Base, Optimism), Solana, etc. Coordinating subnet-managed LP across chains requires bridges (security risk) or per-chain miner pools (capital fragmentation).',
      },
      {
        label: 'Smart-contract risk',
        value: '~$2B lost to DeFi hacks in 2024',
        note: 'LP capital sits in contracts that get hacked routinely. Aave + Uniswap have multi-year audit + bug-bounty track records. New subnet contracts inherit higher exploit risk; LP capital is one bug away from going to zero.',
      },
      {
        label: 'Capital efficiency vs PoS staking',
        value: 'ETH staking: 3-4% APR (lower risk)',
        note: 'LP returns have to beat baseline staking (ETH ~3-4% APR) plus IL premium. If subnet LP yields drift below this benchmark, capital walks. The α emission has to consistently outpace the opportunity cost.',
      },
    ],
  },

  /* SN112 minotaur — "Distributed DEX aggregator and swap intent
     solver engine" (live identity per taostats 2026-05-22,
     minotaursubnet.com). DEX aggregator + intent solver — the
     same architecture pattern CoW Protocol + 1inch Fusion ship. */
  112: {
    rivals: ['1inch', 'cowswap', 'uniswap', 'hyperliquid', 'openrouter'],
    supplyChainIds: ['ethereum-l1-gas', 'chainlink-oracles', 'aws-azure-gcp'],
    constraints: [
      {
        label: 'Solver-set sophistication',
        value: 'CoW: ~20 active solvers competing per batch',
        note: 'Intent-based DEX architecture is solver-quality-bound. CoW runs ~20 sophisticated solvers (Naive, Quasimodo, Seasolver, etc) competing per batch. Subnet miner-as-solver needs the same sophistication or routes get worse fills than CoW.',
      },
      {
        label: 'MEV-protection guarantee',
        value: 'Batch auctions vs. sandwich attacks',
        note: 'Intent-based DEXes promise MEV protection via batch settlement. CoW + Aori publish auction proofs. Subnet aggregator has to provide on-chain proof of best execution or readers compare unfavorably to CoW.',
      },
      {
        label: 'Latency vs route quality',
        value: 'Best route: 200-500ms search time',
        note: 'Real aggregators search across 100+ DEXes; routing decisions add 200-500ms. 1inch Fusion uses pre-computed paths. Subnet miners with diverse routing strategies trade latency for diversity — capture batch / async swaps, lose interactive trading.',
      },
      {
        label: 'Solver bond / honesty mechanism',
        value: 'CoW bonds solvers at $50K+ to deter cheating',
        note: 'Solvers can be malicious — submitting fake quotes or settling worse than promised. CoW + UniswapX bond solvers with $50K-$500K stakes. Subnet must replicate this stake-based honesty enforcement or accept lower trust.',
      },
      {
        label: 'Cross-chain routing complexity',
        value: '~30 chains × 5+ aggregators each',
        note: 'Cross-chain intent solving requires bridges + per-chain liquidity. Across, Squid, Socket already specialize. Subnet has to either focus on single-chain aggregation (limited TAM) or pay the cross-chain complexity tax that established cross-chain DEXes already eat.',
      },
    ],
  },

  /* SN116 TaoLend — "decentralized lending protocol for the
     Bittensor ($TAO) ecosystem. It allows users to lend TAO
     with confidence while borrowers secure their loans using
     subnet ALPHA as [collateral]" (live identity per taostats
     2026-05-22, taolend.io). TAO lending + α collateral. Rival
     pool is the established lending protocols. */
  116: {
    rivals: ['aave-labs', 'compound-finance', 'spark-protocol', 'morpho-labs', 'makerdao-sky'],
    supplyChainIds: ['ethereum-l1-gas', 'chainlink-oracles', 'aws-azure-gcp'],
    constraints: [
      {
        label: 'Collateral volatility (α tokens)',
        value: 'Subnet α prices can drop 50% in a week',
        note: 'Subnet α prices are 5-10x more volatile than blue-chip crypto. Lending against α as collateral demands aggressive haircuts (typically 20-40% LTV vs 70-80% for ETH on Aave). Capital efficiency suffers — borrowers locked into low LTV.',
      },
      {
        label: 'Liquidation infrastructure',
        value: 'α/TAO pair must be liquid 24/7',
        note: 'Lending protocols liquidate undercollateralized positions automatically. Aave + Compound use Chainlink price feeds + on-chain liquidator competition. TaoLend needs deep α/TAO pools 24/7 — concentrated liquidity periods kill liquidation speed, growing bad-debt risk.',
      },
      {
        label: 'Oracle reliability',
        value: 'α price → on-chain feed gap',
        note: 'Lending requires real-time price feeds for collateral. Aave uses Chainlink for blue-chip pairs. Subnet α prices have no Chainlink feed yet — TaoLend either runs its own oracle (manipulation risk) or relies on subnet-internal DEX prices (smaller liquidity, easier to spoof).',
      },
      {
        label: 'Subnet deregistration risk',
        value: 'Collateral can go to zero if subnet dies',
        note: 'A subnet that deregisters takes its α to ~$0. Aave\'s collateral assets are blue-chip with low de-listing risk. TaoLend has to either price subnet survival probability into LTV per-subnet or accept correlated default risk (one bad subnet = cascade).',
      },
      {
        label: 'Regulatory framing',
        value: 'TAO + α securities classification unclear',
        note: 'US securities law on TAO + α tokens is ambiguous (Bittensor Foundation has filed positions but no SEC ruling). Lending against tokens that could be classified as unregistered securities exposes the protocol to enforcement. Aave moved Aave Arc to address this; TaoLend operates outside US until clarity.',
      },
    ],
  },

  /* SN55 NIOME — "decentralized AI subnet that enables privacy-
     safe genomic intelligence by replacing real human genomes
     with high-fidelity synthetic genomic profiles" (live identity
     per taostats 2026-05-22, niome.genomes.io). Synthetic genomics
     for privacy-preserving research. Rival pool is the clinical-
     genomics + synthetic-data space. */
  55: {
    rivals: ['tempus-ai', 'illumina', 'personalis', '23andme', 'atomwise', 'recursion-pharma'],
    supplyChainIds: ['nvidia', 'aws-azure-gcp', 'us-power-grids'],
    constraints: [
      {
        label: 'Synthetic-genome fidelity',
        value: 'Real genomes: 3B base pairs · synthetic: must match population statistics',
        note: 'Generating useful synthetic genomes requires matching real population structure (LD patterns, allele frequencies, structural variants). Easy at low fidelity, hard at the clinical-trial bar. Subnet validator scoring on "high-fidelity" has to specify the population-statistics tests.',
      },
      {
        label: 'Privacy-utility tradeoff',
        value: 'k-anonymity vs. statistical power',
        note: 'Privacy-preserving genomics must obscure individual identity while preserving statistical signal. K-anonymity / differential privacy degrade research utility. Centralized rivals (Tempus, Personalis) keep real data internal + share aggregates; subnet has to navigate the same tradeoff transparently.',
      },
      {
        label: 'HIPAA / GDPR / GINA compliance',
        value: 'Genomic data has special-category status',
        note: 'US (GINA, HIPAA), EU (GDPR Art. 9 special category), UK Bio bank policies all treat genomic data as ultra-sensitive. Subnet generating synthetic data doesn\'t solve this — derived synthetic data still inherits the source\'s privacy framework. Legal opinion + DPIA needed.',
      },
      {
        label: 'Source-data licensing',
        value: 'UK Biobank: ~£24K access fee + DUA',
        note: 'Real reference genomes for training (UK Biobank, All of Us, gnomAD) require formal data-use agreements + access fees. Subnet miners need licensed access or face IP risk. Centralized rivals build dedicated procurement teams.',
      },
      {
        label: 'Clinical-utility validation',
        value: 'Synthetic genome → real trial replication needed',
        note: 'Synthetic data is valid for research only if results replicate on real data. Centralized rivals run validation studies. Subnet "synthetic for privacy" needs published validation that synthetic-trained models work on real patients or pharma customers stay with real data.',
      },
    ],
  },

  /* SN64 Chutes — "Breakthrough Serverless Compute for AI, At
     Scale" (live identity per taostats 2026-05-22, chutes.ai).
     Rayon Labs\' serverless AI inference. Rival pool: Modal,
     Replicate, AWS Lambda/Bedrock, Together AI, Anyscale. */
  64: {
    rivals: ['modal-labs', 'replicate', 'together-ai', 'fireworks-ai', 'aws-bedrock', 'anyscale'],
    supplyChainIds: ['nvidia', 'tsmc', 'sk-hynix', 'aws-azure-gcp', 'us-power-grids'],
    constraints: [
      {
        label: 'Cold-start latency',
        value: 'Modal: 0.5-5s · Lambda: ~5-30s for GPU',
        note: 'Serverless cold starts on GPU are slow — Modal optimized to 0.5-5s via image caching, AWS Lambda GPU runs 5-30s. Subnet serverless inference has to either ship comparable image-caching infra or accept worse cold-start UX.',
      },
      {
        label: 'Pay-per-request economics',
        value: 'Modal: ~$0.0001 per 1K tokens equivalent',
        note: 'Real serverless economics need ~50ms billing granularity + multi-tenant GPU packing. Modal + Replicate ship multi-tenancy via custom CUDA orchestration. Subnet has to match this or pay miner-idle costs that destroy unit economics.',
      },
      {
        label: 'Container ecosystem support',
        value: 'Modal: Python-first · Replicate: Docker',
        note: 'Serverless customers expect easy deploy paths. Modal\'s Python decorators win developer mindshare. Subnet has to ship either a CLI/SDK with comparable ergonomics or accept lower developer adoption.',
      },
      {
        label: 'Auto-scaling responsiveness',
        value: '0 → 100 GPUs in <30s for traffic spikes',
        note: 'Real workloads spike. Modal + Lambda scale GPU instances within seconds. Subnet miner-pool scale-up depends on miner availability + onboarding latency — slower than centralized rivals. Capture steady-state workloads, not bursty.',
      },
      {
        label: 'Same-ecosystem coupling',
        value: 'Rayon Labs also owns SN56 Gradients',
        note: 'Rayon Labs (Chutes + Gradients) operates two adjacent subnets. Cross-promotion + shared infrastructure is an advantage but readers comparing decentralization see the concentration. Other subnets / labs may not route to Chutes for fear of vendor lock-in.',
      },
    ],
  },

  /* SN67 Harnyx — "Deep research as a commodity. Faster, cheaper,
     traceable research — produced by a competitive swarm of
     miners on Bittensor SN67." (live identity per taostats
     2026-05-22, harnyx.ai). Multi-source research synthesis.
     Rivals: Elicit, Consensus, Perplexity Pro Deep Research,
     OpenAI Deep Research, FutureHouse PaperQA. */
  67: {
    rivals: ['elicit', 'consensus-ai', 'perplexity', 'openai', 'futurehouse', 'anthropic'],
    supplyChainIds: ['nvidia', 'aws-azure-gcp', 'cloudflare-edge'],
    constraints: [
      {
        label: 'Citation-accuracy bar',
        value: 'Hallucinated citations kill enterprise use',
        note: 'Real research products live or die on citation accuracy. OpenAI Deep Research + Anthropic\'s research mode + Consensus all built citation-verification layers. Subnet competing in "deep research as commodity" has to match this or readers find phantom citations and stop trusting the output.',
      },
      {
        label: 'Source-paywall coverage',
        value: 'Nature / Cell / Lancet behind $5K+/year paywalls',
        note: 'High-value research lives in subscription journals. Centralized rivals partner with publishers (Elicit + Springer, Consensus + Elsevier). Subnet miners scraping paywalled content face IP risk; legal sources require subscription costs that eat α emission economics.',
      },
      {
        label: 'Research depth vs latency',
        value: 'OpenAI Deep Research: 5-30min per query',
        note: 'Real deep-research queries take 5-30 minutes (multi-pass search, synthesis, verification). Subnet miners running shorter inference produce shallower reports. Readers comparing get to choose between thorough (centralized) or fast + cheap (subnet) — that\'s OK positioning but has to be communicated honestly.',
      },
      {
        label: 'Multi-modal source coverage',
        value: 'Papers + patents + filings + news + datasets',
        note: 'Real research touches academic papers, patents, regulatory filings, news, datasets, code repos. Elicit + Consensus mainly do papers. Subnet "deep research" has to cover wider surface or fail at the institutional bar (legal, finance, pharma use cases).',
      },
      {
        label: 'Verifiability claim',
        value: '"Traceable" requires per-claim source attribution',
        note: 'The "traceable research" pitch requires every claim mapping to specific source passage. Centralized rivals (OpenAI Deep Research) show citation links inline. Subnet validator scoring has to enforce claim-to-source mapping or the "traceable" claim fails on inspection.',
      },
    ],
  },

  /* SN98 ForeverMoney — "Decentralized intelligence for advanced
     liquidity management" (live identity per taostats 2026-05-22,
     forevermoney.ai). AI-driven liquidity management — bot
     strategies that optimize LP positioning. Rival pool is the
     LP-management + active-DeFi space. */
  98: {
    rivals: ['yearn-finance', 'morpho-labs', 'uniswap', 'aave-labs', 'gmx', 'hyperliquid'],
    supplyChainIds: ['ethereum-l1-gas', 'chainlink-oracles', 'aws-azure-gcp'],
    constraints: [
      {
        label: 'Strategy frontrunning',
        value: 'On-chain moves visible 1 block before settlement',
        note: 'AI-driven LP management strategies are on-chain visible — front-runners can sandwich the rebalance. Centralized rivals (CitadelBank, Galaxy Digital) operate in private order flow. Subnet strategies need MEV-protected execution (Flashbots / private mempools) or accept structural alpha leak.',
      },
      {
        label: 'Rebalancing gas cost',
        value: 'L1: $5-50 per rebalance · L2: $0.05-0.50',
        note: 'Active LP management requires frequent rebalancing. L1 Ethereum gas at $5-50 per rebalance eats yield. Subnet must operate primarily on L2s (Arbitrum, Base, Polygon) or accept that L1 strategies only work at large position sizes.',
      },
      {
        label: 'Backtest-overfit risk',
        value: 'In-sample 200% APR → live 20%',
        note: 'AI strategies tested on historical data overfit. Centralized quant funds use out-of-sample / walk-forward eval rigorously. Subnet validator scoring on backtest performance ships overfit strategies live — losses compound until validators add live-performance weighting.',
      },
      {
        label: 'Multi-protocol risk surface',
        value: 'Each protocol = independent exploit risk',
        note: 'Active LP management spans Aave, Uniswap, Curve, Pendle, Morpho. Each is one exploit away from zeroing the strategy. Centralized risk-managed funds limit per-protocol exposure. Subnet strategies aggregate the risk; one protocol hack cascades to subnet TVL.',
      },
      {
        label: 'Yield-stripping vs whales',
        value: 'Whales eat LP yield first',
        note: 'Whale LPs (Curve veCRV, Aave aTokens) capture disproportionate yield. Subnet small-LP miners get the residual. Active management can squeeze marginal yield but the structural advantage stays with concentrated capital.',
      },
    ],
  },

  /* SN106 VoidAI — "Multi-chain liquidity protocol enabling
     interoperability for Bittensor by leveraging Chainlink CCIP"
     (live identity per taostats 2026-05-22, voidai.com). Cross-
     chain liquidity for Bittensor. Rivals are the cross-chain
     infrastructure leaders. */
  106: {
    rivals: ['chainlink-ccip', 'layerzero', 'wormhole', 'uniswap', 'aave-labs'],
    supplyChainIds: ['ethereum-l1-gas', 'chainlink-oracles', 'aws-azure-gcp'],
    constraints: [
      {
        label: 'Bridge exploit history',
        value: '~$2.8B lost to cross-chain bridge hacks 2021-2024',
        note: 'Cross-chain bridges are the highest-loss attack surface in DeFi (Ronin $625M, Wormhole $320M, Nomad $190M). Any subnet pitching cross-chain liquidity inherits the historical security skepticism — auditing posture has to be visibly stronger than the centralized rivals.',
      },
      {
        label: 'Chainlink CCIP dependency',
        value: 'Subnet ride-along on Chainlink validators',
        note: 'CCIP is Chainlink-validator-secured. VoidAI explicitly leverages CCIP — the subnet\'s security is bounded by Chainlink\'s. That\'s a strong dependency: if Chainlink validators collude or get exploited, VoidAI inherits the loss.',
      },
      {
        label: 'Liquidity fragmentation across chains',
        value: 'Same asset deeper on origin than destination',
        note: 'Tokens trade with deeper liquidity on their origin chain. Cross-chain LPs amplify the fragmentation by adding wrapped-asset variants. Subnet has to either incentivize concentrated liquidity on key chains or accept worse fills than native pools.',
      },
      {
        label: 'Settlement latency',
        value: 'CCIP: 20min-2hr finality vs L2 instant',
        note: 'Cross-chain settlement via CCIP / LayerZero takes minutes to hours for finality (depends on chain). L2 bridges (Across, Stargate) optimize for speed at higher fees. Subnet has to pick the latency/cost tradeoff per use case.',
      },
      {
        label: 'Bittensor-specific demand',
        value: 'Sub-$1B Bittensor TVL = small TAM',
        note: 'Bittensor ecosystem TVL is well below $1B as of 2026. Cross-chain liquidity demand into / out of Bittensor is limited compared to Ethereum / Solana. Subnet captures small percentage of small pie — viability depends on Bittensor TVL growth.',
      },
    ],
  },

  /* SN68 NOVA — "Accelerating drug discovery" (live identity
     per taostats 2026-05-22, metanova-labs.ai). AI-driven drug
     discovery. Rival pool is the AI-pharma incumbent stack. */
  68: {
    rivals: ['recursion-pharma', 'insilico-medicine', 'schrodinger', 'benevolent-ai', 'atomwise', 'deepmind-science'],
    supplyChainIds: ['nvidia', 'aws-azure-gcp', 'us-power-grids', 'tsmc'],
    constraints: [
      {
        label: 'Wet-lab feedback loop',
        value: 'In silico → in vitro: 3-6 month cycle',
        note: 'Real drug discovery requires wet-lab confirmation of AI predictions. Recursion runs in-house automated labs; Schrödinger partners with pharma wet labs. Subnet pure-compute miners produce predictions but lack wet-lab validation — predictions stay theoretical until paired with a lab.',
      },
      {
        label: 'Target-validation cost',
        value: '$5M-$50M to validate a single target',
        note: 'Confirming a drug target is real (cell + animal + early human) costs millions per target. Pharma incumbents have validation teams. Subnet miners producing target predictions need a partner who can validate, or the work stops at hypothesis.',
      },
      {
        label: 'Clinical-trial graduation rate',
        value: '~10% of preclinical → approved drug',
        note: 'Most AI-discovered drugs never reach market. Insilico, Recursion all have multiple failures alongside their successes. Subnet drug-discovery output success rate is bounded by industry-wide pharma economics, not just compute.',
      },
      {
        label: 'Patent landscape navigation',
        value: '~50K active drug-target patents',
        note: 'Most attractive drug targets are patent-encumbered. Pharma incumbents have patent-litigation teams. Subnet miners landing on patented targets either license (revenue split) or risk infringement. Open-target work has to navigate freedom-to-operate explicitly.',
      },
      {
        label: 'Regulatory submission depth',
        value: 'IND filing: ~5K-50K pages',
        note: 'Getting an AI-discovered drug into trial requires IND (Investigational New Drug) submission to FDA. Centralized rivals have regulatory affairs teams. Subnet output without IND-package-ready documentation stops at the lab bench.',
      },
    ],
  },

  /* SN94 Bitsota — "Decentralized SoTA Research" (live identity
     per taostats 2026-05-22). State-of-the-art research-as-a-
     swarm. Rivals: the labs that currently produce most SoTA
     papers (frontier labs + Sakana + FutureHouse). */
  94: {
    rivals: ['openai', 'anthropic', 'google', 'meta', 'sakana-ai', 'futurehouse'],
    supplyChainIds: ['nvidia', 'tsmc', 'sk-hynix', 'aws-azure-gcp', 'us-power-grids'],
    constraints: [
      {
        label: 'SoTA-bench leak cycle',
        value: 'Once published, every lab trains against it',
        note: 'A new SoTA benchmark gets trained against by every frontier lab within ~6 months. Subnet "SoTA research" leaderboards become race-to-overfit. Constant benchmark rotation needed, which is a research org itself + curation cost.',
      },
      {
        label: 'Compute-floor for frontier work',
        value: 'GPT-5 training: ~$500M+ in compute',
        note: 'Real SoTA AI work runs $10M-$500M+ per major experiment. Centralized labs raise multi-billion to fund this. Subnet alpha emission can\'t cover compute at this scale; SoTA contributions stay at the architectural-refinement / efficient-method tier (Sakana niche).',
      },
      {
        label: 'Research-paper authorship norms',
        value: 'Anonymous miners can\'t publish at NeurIPS',
        note: 'Top conferences (NeurIPS, ICML, ICLR) require named authors + institutional affiliation. Subnet anonymous miners producing genuinely SoTA work need a re-publication path through a named entity — adds friction or risk.',
      },
      {
        label: 'Reviewer trust + reproducibility',
        value: 'Centralized labs share weights via partnerships',
        note: 'SoTA work needs peer reproduction. Centralized labs publish weights to trusted partners (Anthropic + university collabs). Subnet swarm output requires a different reproducibility chain — open weights + open infrastructure can compensate but the institutional trust gap is real.',
      },
      {
        label: 'Domain breadth vs depth',
        value: 'Frontier labs hire 100+ PhDs per research area',
        note: 'OpenAI / Anthropic / DeepMind run 30+ research teams each (RL, alignment, vision, biology, theorem-proving). Subnet swarm depth in any single area depends on miner concentration. Spread thin = no SoTA in any domain.',
      },
    ],
  },

  /* SN113 TensorUSD — "A reserve-backed stablecoin designed to
     support 1:1 redeemability for US Dollar within the Bittensor
     ecosystem" (live identity per taostats 2026-05-22,
     tensorusd.com). USD-pegged stablecoin for Bittensor. Rival
     pool is the established stablecoin issuers. */
  113: {
    rivals: ['tether', 'circle-usdc', 'makerdao-sky', 'aave-labs', 'spark-protocol'],
    supplyChainIds: ['ethereum-l1-gas', 'chainlink-oracles', 'aws-azure-gcp', 'us-power-grids'],
    constraints: [
      {
        label: 'Reserve audit & attestation',
        value: 'USDC: monthly Deloitte · USDT: quarterly BDO',
        note: 'Stablecoin trust depends on visible reserves. USDC publishes monthly Deloitte attestations; USDT quarterly BDO. TensorUSD has to commit to comparable audit cadence + reserve composition disclosure or readers default to Tether / USDC for non-Bittensor surfaces.',
      },
      {
        label: 'Redeemability surface',
        value: 'USDC: 24hr ACH · USDT: KYC-required redemption',
        note: '1:1 redeemability requires actual fiat rails. Circle ships 24hr ACH for verified accounts; Tether requires KYC + minimum redemption ($100K). TensorUSD has to ship a redemption stack — banks, KYC vendor, treasury operations. None of that is a smart contract.',
      },
      {
        label: 'Bittensor-only adoption ceiling',
        value: 'CEXes won\'t list a single-ecosystem stablecoin',
        note: 'Centralized exchanges list stablecoins with cross-ecosystem usage. A stablecoin only usable inside Bittensor will not get Binance / Coinbase / Kraken listings — capping the path to the deep liquidity USDC + USDT have.',
      },
      {
        label: 'Regulatory clarity',
        value: 'STABLE Act + EU MiCA stablecoin rules tightening',
        note: 'US (STABLE Act path) + EU (MiCA Title III stablecoin rules) are tightening. Issuers need capital, regulated entity status, and reserve segregation. Decentralized issuance (MakerDAO model) survives but with friction. TensorUSD has to pick a regulatory posture or accept jurisdictional limits.',
      },
      {
        label: 'Peg-defense mechanism',
        value: 'DAI broke peg to $0.87 in March 2023 (SVB)',
        note: 'Even reserve-backed stablecoins break peg under stress (USDC dropped to $0.87 during SVB collapse). Centralized issuers had Fed backstop via deposit insurance. TensorUSD reserves\' jurisdiction + counterparty risk determines peg resilience.',
      },
    ],
  },

  /* SN83 CliqueAI — "CliqueAI - AI-Powered Maximum Clique Solver
     Network" (live identity per taostats 2026-05-22,
     cliqueai.toptensor.ai). Max-clique solver — a classic
     NP-hard graph problem. Rival pool is the optimization-solver
     + quantum-computing space. */
  83: {
    rivals: ['gurobi', 'd-wave', 'ibm', 'nvidia', 'aws-azure-gcp', 'google'],
    supplyChainIds: ['nvidia', 'tsmc', 'sk-hynix', 'aws-azure-gcp'],
    constraints: [
      {
        label: 'Solver-quality gap',
        value: 'Gurobi closes 99% of feasible MILPs <60s',
        note: 'Industry-standard solvers (Gurobi, CPLEX) have decades of engineering on classical optimization. Subnet AI-driven solver needs to either beat them on specific problem classes (NP-hard graph problems where heuristics shine) or specialize on instances where general solvers struggle.',
      },
      {
        label: 'Real-world graph scale',
        value: 'Social/biological graphs at 10^6-10^9 nodes',
        note: 'Real graphs (social networks, protein-interaction networks) are huge. Max-clique on full graphs is infeasible — solvers work on subgraphs or approximations. Subnet has to specify which problem scale it targets; clarity here separates trader-grade tool from academic toy.',
      },
      {
        label: 'AI-vs-classical tradeoff',
        value: 'GNN-based solvers competitive only at specific instances',
        note: 'Recent research (Graph Neural Networks for max-clique, e.g., neural-MaxClique 2024) shows AI can compete with classical solvers on specific instance types but loses on others. Subnet validator scoring has to be transparent about instance-type coverage.',
      },
      {
        label: 'Quantum-annealing competition',
        value: 'D-Wave: 5K+ qubits, max-clique benchmark customer',
        note: 'D-Wave\'s quantum annealer ships max-clique benchmarks on real hardware. As qubit counts scale, quantum approaches threaten classical + AI solvers on this specific problem. Subnet has to plan for the quantum trajectory or risk being out-scaled.',
      },
      {
        label: 'Commercial use-case',
        value: 'Max-clique = social-net communities, drug-target overlap, etc',
        note: 'The pitch needs a specific commercial use-case — most real customers don\'t buy "max clique solver." They buy "find communities in this graph" or "find overlapping drug targets." Subnet packaging has to translate solver capability into vertical product or stay academic.',
      },
    ],
  },

  /* SN100 Plaτform — "An auto-research subnet where miners
     compete in multiple challenges to achieve top scores against
     a synthetic benchmark, driving continuous performance
     optimization" (live identity per taostats 2026-05-22,
     platform.network). Tournament-style auto-research. Rival
     pool: FutureHouse, Sakana, Kaggle (competition platform). */
  100: {
    rivals: ['futurehouse', 'sakana-ai', 'hugging-face', 'arc-prize', 'openai', 'meta'],
    supplyChainIds: ['nvidia', 'aws-azure-gcp', 'us-power-grids'],
    constraints: [
      {
        label: 'Benchmark-validity decay',
        value: 'Synthetic benchmarks saturate at ~12-18 months',
        note: 'Single-benchmark tournament structures hit ceiling fast — once miners crack the benchmark, scores compress. Kaggle rotates competitions monthly. Subnet running continuous challenges needs benchmark-creation infrastructure with the same cadence.',
      },
      {
        label: 'Kaggle-style talent overlap',
        value: 'Top Kaggle grandmasters number ~300 globally',
        note: 'Kaggle competition winning relies on a small grandmaster pool that moves between platforms. Subnet competition-style auto-research has to attract this talent or accept second-tier participation. Cash prizes ($25K-$100K typical Kaggle) compete with subnet α emission.',
      },
      {
        label: 'Optimization-target gaming',
        value: 'Reward-hacking on synthetic benchmarks',
        note: 'Subnet miners optimize the synthetic benchmark, not the underlying problem. Famous Kaggle examples: leaderboard probing, overfitting test set. Subnet validator scoring has to penalize these — multi-stage holdout sets, late-rebinding, etc.',
      },
      {
        label: 'Auto-research vs human-judged research',
        value: 'Synthetic eval scores ≠ science quality',
        note: 'Automated benchmarks capture measurable properties; they miss creativity, novelty, real-world utility. FutureHouse + Sakana publish papers that get human review. Subnet auto-research has to either trust the synthetic benchmark or layer in human eval — both have tradeoffs.',
      },
      {
        label: 'Result-portability',
        value: 'Tournament winner artifact = research paper?',
        note: 'Kaggle competition winners produce models. Real research produces papers + claims + replication. Subnet auto-research output needs a clear translation from "won the challenge" to "advanced the field." Without that translation it\'s a leaderboard, not research.',
      },
    ],
  },

  /* SN65 TAO Private Network — "Developer-friendly Decentralised
     VPN infrastructure" (live identity per taostats 2026-05-22,
     tpn.taofu.xyz). Decentralized VPN for developers + apps.
     Rival pool: dVPN projects (Sentinel, Mysterium) +
     centralized privacy VPN incumbents (Mullvad, ProtonVPN). */
  65: {
    rivals: ['mullvad', 'proton-vpn', 'nordvpn', 'sentinel-dvpn', 'mysterium-network', 'cloudflare-edge'],
    supplyChainIds: ['us-power-grids', 'aws-azure-gcp', 'cloudflare-edge'],
    constraints: [
      {
        label: 'dVPN tokenomics history',
        value: 'DVPN -90% · MYST -85% from peaks',
        note: 'Both Sentinel + Mysterium token prices collapsed as supply outpaced demand. Subnet TPN inherits the same incentive design tension: α emission creates supply, but consumer demand for VPN is brand-driven not protocol-driven.',
      },
      {
        label: 'No-logs claim verification',
        value: 'Mullvad audited by Assured AB · ProtonVPN by Securitum',
        note: 'Privacy VPN trust comes from third-party audits. Mullvad + ProtonVPN publish them; subnet TPN miners running on commodity hardware have weaker no-logs guarantees (any miner could log). Cryptographic attestation needed but raises usability cost.',
      },
      {
        label: 'Streaming-service blocking',
        value: 'Netflix blocks ~60-80% of VPN IPs',
        note: 'Consumer VPN demand is largely "watch geo-blocked Netflix." Streaming services blacklist VPN IPs aggressively. Subnet TPN miners on residential IPs may bypass blocks initially but get added to blacklists as scale grows — same problem dVPN ahead.',
      },
      {
        label: 'Mobile-app distribution',
        value: 'NordVPN + Proton ship native iOS/Android apps',
        note: 'Consumer VPN is mobile-first. Apple + Google app store policies gate VPN apps tightly. Subnet "developer-friendly" pitch trades off consumer reach — capture developer / app-VPN use cases, not the consumer mass-market.',
      },
      {
        label: 'Bandwidth-per-node economics',
        value: 'Residential bandwidth: ~$50-100/mo per node',
        note: 'A VPN node needs upstream bandwidth. Centralized rivals lease hosting bandwidth at scale ($/Mbps). Subnet miners on residential connections have lower upload caps + ISP TOS surface. Capture privacy-sensitive use cases where centralized rivals can\'t serve.',
      },
    ],
  },

  /* SN105 Beam — "Decentralized bandwidth. A global network.
     Powering the open internet." (live identity per taostats
     2026-05-22, b1m.ai). Decentralized bandwidth marketplace.
     Rival pool: Helium (decentralized wireless), Cloudflare,
     Fastly, Akamai (CDN/bandwidth incumbents). */
  105: {
    rivals: ['helium-network', 'cloudflare-edge', 'fastly', 'akamai', 'aws-azure-gcp', 'filecoin'],
    supplyChainIds: ['us-power-grids', 'aws-azure-gcp', 'cloudflare-edge'],
    constraints: [
      {
        label: 'Helium tokenomics lesson',
        value: 'HNT 95% drawdown 2021→2024',
        note: 'Helium proved decentralized wireless can deploy hardware via tokens but then HNT collapsed 95% as supply outpaced demand. Subnet "decentralized bandwidth" plays inherit the cautionary tale: token incentives create supply, but matching demand requires real customer integration.',
      },
      {
        label: 'Last-mile vs. middle-mile',
        value: 'CDN edge nodes need <30ms to user',
        note: 'Real CDN performance depends on point-of-presence proximity. Cloudflare + Akamai operate POPs in 300+ cities. Subnet miners on home internet sit behind ISP NAT + variable routes — can\'t match POP-grade latency.',
      },
      {
        label: 'Carrier-grade peering',
        value: 'Cloudflare peers with 12K+ networks',
        note: 'CDN reach depends on BGP peering relationships. Cloudflare + Akamai have decades of carrier agreements. Subnet "open internet" can\'t replicate these — capture last-mile or specialized backhaul use cases, not enterprise CDN.',
      },
      {
        label: 'Customer integration depth',
        value: 'Cloudflare ships SDKs for every framework',
        note: 'Real bandwidth/CDN customers (Stripe, Shopify, NYT) use vendor SDKs deeply. Subnet has to either match this integration depth or accept that the routing layer is replaceable by customers when bigger budgets show up.',
      },
      {
        label: 'Compliance + DDoS mitigation',
        value: 'Cloudflare: ~250 Tbps DDoS capacity',
        note: 'Enterprise customers buy CDN partly for DDoS protection. Cloudflare absorbs multi-Tbps attacks. Subnet decentralized network can absorb in theory via distribution but lacks the centralized incident-response team customers can call during attack.',
      },
    ],
  },

  /* SN128 ByteLeap — "Pioneering the Future of Cloud & Blockchain"
     (live identity per taostats 2026-05-22, byteleap.ai).
     Cloud + blockchain integration. Rival pool overlaps SN75
     Hippius (also blockchain cloud) + the broader L1 / dCloud
     space. */
  128: {
    rivals: ['akash-network', 'filecoin', 'aws-azure-gcp', 'cloudflare-edge', 'amazon-aws-graviton', 'arweave'],
    supplyChainIds: ['nvidia', 'tsmc', 'sk-hynix', 'aws-azure-gcp', 'us-power-grids'],
    constraints: [
      {
        label: 'Same-niche subnet competition',
        value: 'SN75 Hippius targets identical category',
        note: 'Bittensor has both SN75 Hippius + SN128 ByteLeap pursuing "blockchain cloud." Splitting α emission across two similar plays dilutes both. ByteLeap has to differentiate clearly or accept market share splits with Hippius.',
      },
      {
        label: 'Brand recognition gap',
        value: 'AWS / GCP / Azure dominate cloud-purchasing decisions',
        note: 'Cloud purchasing decisions are made by CTOs / Heads of Infra who default to hyperscalers. Decentralized cloud (Akash, Filecoin) struggles to break into RFPs. Subnet ByteLeap inherits the same brand-recognition gap; capture crypto-native customers first.',
      },
      {
        label: 'Multi-cloud strategy fit',
        value: 'Enterprises typically use 2-4 clouds (AWS + GCP + on-prem)',
        note: 'Real enterprises use multiple clouds. Adding a fourth ("blockchain cloud") increases operational complexity. Subnet has to integrate with existing CI/CD + observability stacks (Datadog, New Relic) or stay as the periphery cloud.',
      },
      {
        label: 'Crypto-native vs enterprise customer demand',
        value: 'Crypto-native: ~$50M/yr TAM · Enterprise: $300B/yr',
        note: 'The crypto-native cloud market is small. Subnet has to either dominate the small market (capture Akash + Filecoin share) or break into the enterprise market (huge but requires SOC 2 + compliance posture).',
      },
      {
        label: 'Web3-app deployment surface',
        value: 'Frontend on Netlify + API on AWS + chain on L2',
        note: 'Most "Web3 apps" run frontends on Netlify/Vercel, backends on AWS/GCP, smart contracts on L2s. Subnet "blockchain cloud" pitch competes with this status quo — has to either consolidate (one platform for all 3) or specialize on chain-native compute.',
      },
    ],
  },

  /* SN107 Minos — "The Foundational Layer of Genomics" (live
     identity per taostats 2026-05-22, theminos.ai). Foundation-
     model approach to genomics. Rival pool overlaps SN55 NIOME
     but distinct: NIOME generates synthetic privacy-safe data;
     Minos pitches as the foundational MODEL layer for the
     genomics space. */
  107: {
    rivals: ['illumina', 'tempus-ai', 'personalis', 'recursion-pharma', 'deepmind-science', '23andme'],
    supplyChainIds: ['nvidia', 'tsmc', 'sk-hynix', 'aws-azure-gcp', 'us-power-grids'],
    constraints: [
      {
        label: 'Foundation-model training cost',
        value: 'Genomic foundation models: $5M-$50M per training run',
        note: 'Training a genomic foundation model (e.g., Evo, Nucleotide Transformer, DNABERT) needs massive compute. DeepMind\'s Evo + Recursion\'s Phenom models cost tens of millions per generation. Subnet crowdsourced compute can theoretically match but requires coordinating thousands of miners on a single training run.',
      },
      {
        label: 'Reference-genome licensing',
        value: 'UK Biobank + All of Us + gnomAD = millions in access',
        note: 'Training data lives in licensed databases. UK Biobank: ~£24K/project. All of Us: NIH approval + DUA. gnomAD: relatively open but covers limited populations. Subnet has to negotiate licensed access or train on lower-quality public datasets — visible in eval.',
      },
      {
        label: 'Foundation-model eval gap',
        value: 'No standard "genomic SoTA" benchmark',
        note: 'Unlike LLMs (MMLU, GPQA) or vision (ImageNet), genomic foundation models lack a single dominant benchmark. Variant calling, structural prediction, disease prediction all measure differently. Subnet "foundational layer" positioning requires shipping a benchmark or accepting fragmented eval.',
      },
      {
        label: 'Clinical-deployment gap',
        value: 'Foundation model → clinical use: ~5-10 year cycle',
        note: 'Genomic foundation models take 5-10 years to translate into clinical impact (Recursion, DeepMind\'s Isomorphic, Insilico timelines). Subnet "foundational" positioning has to either accept long horizons or pivot to research-tool monetization in the meantime.',
      },
      {
        label: 'Diversity in training data',
        value: '~80% of public genomic data is European-ancestry',
        note: 'Public genomic datasets skew European ancestry. Models trained on them perform worse on under-represented populations. Centralized rivals (Tempus, Personalis) invest in diversity programs. Subnet "foundational" without explicit diversity programs ships biased models — readers in pharma + public health care.',
      },
    ],
  },

  /* SN75 Hippius — "Blockchain-backed cloud: storage, VMs, and
     apps with unmatched transparency, trust, and power" (live
     identity per taostats 2026-05-22, hippius.com). Blockchain
     cloud (storage + compute + apps). Rival pool: dCloud
     incumbents (Akash, Filecoin) + traditional hyperscalers. */
  75: {
    rivals: ['akash-network', 'filecoin', 'arweave', 'storj', 'aws-azure-gcp', 'amazon-aws-graviton'],
    supplyChainIds: ['nvidia', 'tsmc', 'sk-hynix', 'aws-azure-gcp', 'us-power-grids'],
    constraints: [
      {
        label: 'Multi-product integration depth',
        value: 'AWS: 200+ services · subnet: storage + VM + apps',
        note: 'Real "blockchain cloud" pitches require multiple primitives (storage, compute, networking) integrated tightly. AWS ships 200+ services with deep integrations. Akash has compute; Filecoin has storage. Subnet doing all three has to either ship surface that beats individual specialists or accept a thin product.',
      },
      {
        label: 'On-chain VM economics',
        value: 'Akash GPU rental: 70-80% cheaper than AWS',
        note: 'Decentralized cloud wins on price. Akash GPU rentals are 70-80% cheaper than AWS. Subnet has to either match this price advantage (via large miner pool) or differentiate on a feature (privacy, censorship-resistance) that justifies the premium.',
      },
      {
        label: 'Persistent-state durability',
        value: 'AWS S3: 11 nines of durability · subnet: variable',
        note: 'Persistent storage requires multi-region replication + decay-resistant encoding. AWS S3 has 99.999999999% durability. Filecoin uses cryptographic proofs of replication. Subnet "transparency" claim has to translate to durability math customers can verify.',
      },
      {
        label: 'Developer-onboarding friction',
        value: 'AWS CLI + Terraform vs subnet-native tooling',
        note: 'Real cloud customers use Terraform, Pulumi, AWS CDK. Subnet "blockchain cloud" needs either Terraform providers or native SDKs that match the centralized depth — building this is expensive engineering.',
      },
      {
        label: 'SLA + uptime guarantees',
        value: 'AWS: 99.99% uptime SLA · subnet: best-effort',
        note: 'Production customers buy SLAs with credits. Centralized hyperscalers commit + pay. Subnet decentralized infrastructure can\'t commit individual miners to SLAs — capture batch / non-critical workloads or build a centralized SLA wrapper (which weakens decentralization).',
      },
    ],
  },

  /* SN110 Green Compute — "Enterprise Inference Hardware, 100%
     Green Energy" (live identity per taostats 2026-05-22,
     green-compute.com). Carbon-conscious AI inference. Rival
     pool: hyperscalers running on green PPAs + niche green-compute
     shops. */
  110: {
    rivals: ['amazon-aws-graviton', 'aws-azure-gcp', 'coreweave', 'modal-labs', 'anyscale', 'fastly'],
    supplyChainIds: ['nvidia', 'tsmc', 'sk-hynix', 'us-power-grids'],
    constraints: [
      {
        label: 'Hyperscaler carbon claim',
        value: 'AWS / Azure / Google all claim 100% renewable',
        note: 'All three hyperscalers report 100% renewable-energy match via PPAs + RECs. Subnet "100% green energy" claim has to either differentiate on additionality (new renewable, not just RECs) or accept that buyers don\'t pay a premium for parity claims.',
      },
      {
        label: 'Carbon accounting standards',
        value: 'Scope 2 reporting still allows offset-based claims',
        note: 'GHG Protocol Scope 2 lets companies claim renewable via market-based accounting (offsets / RECs). The location-based method is stricter. Subnet "green" claim must specify methodology or it\'s comparable to greenwashing. Buyers in regulated industries care.',
      },
      {
        label: 'Power-grid carbon intensity variance',
        value: 'WA: 80g CO2/kWh · WV: 750g CO2/kWh',
        note: 'Same GPU on Washington state hydro (low-carbon) vs West Virginia coal (high-carbon) differs 10x in emissions. Subnet routing inference to "green" miners requires miner-location attestation + grid-data integration. Hyperscalers have this; subnet has to build it.',
      },
      {
        label: 'Premium pricing capture',
        value: '~10-30% green premium for verified renewable',
        note: 'Enterprise buyers pay 10-30% more for verified green compute (per CDP/RE100 surveys). Subnet has to justify that premium with transparent attestation — or compete only on price (where hyperscalers have economies of scale).',
      },
      {
        label: 'Hardware-efficiency tradeoff',
        value: 'H100: 700W · Graviton4: 250W · TPU v5p: ~400W',
        note: 'Different chips have different perf/watt. AWS Graviton (ARM) wins on inference workloads. Subnet "green" might use less efficient chips on green power — the net carbon math has to work out. Validator has to score perf-per-CO2, not just energy source.',
      },
    ],
  },

  /* SN127 Astrid — "The capital axis for Bittensor" (live
     identity per taostats 2026-05-22, astrid.global). Capital-
     infrastructure / asset-tokenization for Bittensor. Rival
     pool is the institutional crypto-finance stack + tokenized-
     RWA leaders. */
  127: {
    rivals: ['blackrock', 'anchorage-digital', 'aave-labs', 'makerdao-sky', 'coinbase'],
    supplyChainIds: ['ethereum-l1-gas', 'chainlink-oracles', 'aws-azure-gcp'],
    constraints: [
      {
        label: 'Tokenization regulatory framework',
        value: 'RWA tokens fall under securities law',
        note: 'Tokenizing real-world assets (T-bills, treasury bonds, equities) triggers securities registration. BlackRock BUIDL + Ondo Finance use Reg D + Reg S exemptions for accredited investors only. Subnet "capital axis" needs the same legal structure or accepts a limited user base.',
      },
      {
        label: 'Custody bifurcation',
        value: 'On-chain token + off-chain RWA = 2 trust chains',
        note: 'Tokenized RWAs require off-chain custody (T-bill held by BNY Mellon, etc) AND on-chain token issuance. Centralized rivals own both ends. Decentralized subnet has to either partner with a regulated custodian (centralization regress) or accept that the tokens lack institutional credibility.',
      },
      {
        label: 'Yield-distribution mechanics',
        value: 'On-chain yield needs off-chain payment rails',
        note: 'A tokenized T-bill paying 4.5% needs the issuer to actually pay yield on-chain. That requires fiat rails + token-mint operations. BlackRock + Ondo run this; subnet capital-axis has to build similar infrastructure or accept yield-token shortcuts (rebasing tokens, etc).',
      },
      {
        label: 'Institutional onboarding pace',
        value: 'KYC + accredited-investor verification = weeks',
        note: 'Institutional capital onboards slowly. Centralized custodians (Anchorage, Coinbase Institutional) have weeks-long onboarding processes. Subnet that wants institutional capital inherits the same friction — and α emission can\'t accelerate compliance work.',
      },
      {
        label: 'Bittensor-specific TAM ceiling',
        value: 'Single-ecosystem capital-infra has bounded demand',
        note: 'Tokenized RWAs scale with the demand for on-chain treasury / yield products. Bittensor TVL is sub-$1B; "capital axis for Bittensor" alone is a small pie. Multi-chain expansion is necessary for material scale but adds the cross-chain infrastructure surface (per SN106 constraints).',
      },
    ],
  },

  /* SN51 lium.io — "revolutionizing the democratization of
     compute" (live identity per taostats 2026-05-22). Compute
     marketplace pitching access for non-enterprise users.
     Rival pool overlaps SN27 but the cut is more consumer
     compute democratization (vast.ai, Salad, Banana). */
  51: {
    rivals: ['coreweave', 'lambda-labs', 'modal-labs', 'replicate', 'together-ai', 'amazon-aws-graviton'],
    supplyChainIds: ['nvidia', 'tsmc', 'sk-hynix', 'us-power-grids'],
    constraints: [
      {
        label: 'Consumer-GPU demand cycle',
        value: 'Crypto cycles drive GPU rental demand',
        note: 'GPU rental demand spikes during AI hype + crypto bull. vast.ai + Salad surged in 2023 then compressed. Subnet rental marketplaces inherit the cycle — α emission has to backstop miners during slow periods or supply collapses.',
      },
      {
        label: 'KYC + payment-rail gating',
        value: 'AWS: credit card · subnet: crypto-native',
        note: 'Mainstream compute customers pay with credit cards. Subnet "democratization" likely requires crypto payment (or a fiat on-ramp partner), narrowing the addressable market. Trade-off between crypto-native UX and reach into Stripe/Visa rails.',
      },
      {
        label: 'Performance per dollar floor',
        value: 'A100 PCIe: $0.50/hr (cheap) vs $2/hr (premium)',
        note: 'Vast.ai marketplace prices vary 4-10x for same GPU model based on host reliability + bandwidth. Subnet has to clearly communicate the speed/cost tradeoff or readers compare unfavorably to known marketplaces.',
      },
      {
        label: 'Container-image distribution',
        value: 'Docker Hub: ~5GB pull per ML container',
        note: 'Real GPU jobs ship as Docker images. Pulling 5-20GB images on consumer bandwidth adds minutes-to-hours per job start. Modal + Banana bake popular images. Subnet has to ship image-distribution layer or accept slow cold starts.',
      },
      {
        label: 'Multi-GPU coordination',
        value: 'AllReduce / NCCL needs low-latency networking',
        note: 'Training jobs needing 8+ GPUs require NVLink + InfiniBand. Distributed across home internet, latency kills throughput. Subnet "democratized" compute is for SINGLE-GPU inference + small fine-tune; large-model training stays with hyperscalers.',
      },
    ],
  },

  /* SN37 Aurelius — "Decentralized Alignment of Artificial
     Intelligence" (live identity per taostats 2026-05-22,
     aureliusaligned.ai). Second alignment-focused subnet (with
     SN23). Differentiation TBD — both target the same rival
     pool but the magazine surfaces both because they\'re both
     active editorial subjects. */
  37: {
    rivals: ['anthropic', 'openai', 'google', 'apollo-research', 'arc-prize', 'meta'],
    supplyChainIds: ['nvidia', 'aws-azure-gcp', 'us-power-grids'],
    constraints: [
      {
        label: 'Differentiation from SN23 Trishool',
        value: 'Two alignment subnets in same ecosystem',
        note: 'Bittensor has both SN23 Trishool + SN37 Aurelius pursuing AI alignment. They compete for the same talent + customer pool. Each subnet validator design has to either differentiate (Trishool focuses on X, Aurelius on Y) or accept the second-mover penalty.',
      },
      {
        label: 'Constitutional-AI patent surface',
        value: 'Anthropic has patents on RLHF / Constitutional AI methods',
        note: 'Anthropic + OpenAI hold patents on key alignment techniques (Constitutional AI, RLHF variants). Decentralized alignment work that uses identical methods has patent exposure when commercialized. Subnet has to either invent new methods or rely on open-source variants.',
      },
      {
        label: 'Eval pollution from training',
        value: 'Alignment evals leak into post-training data',
        note: 'Once an eval is published (Anthropic\'s MACHIAVELLI, MetaTruthfulQA), frontier labs train against it. Scores inflate, signal collapses. Subnet alignment validator scores must rotate held-out evals — and rotating evals faster than centralized labs refresh is hard.',
      },
      {
        label: 'AGI capability window',
        value: 'Most labs project transformative AI within 5 years',
        note: 'OpenAI, Anthropic, Google all forecast transformative AI capability in 3-7 years. If alignment work doesn\'t land before then, the work becomes academically interesting but operationally late. Subnet has to ship in a urgent timeline or risk irrelevance.',
      },
      {
        label: 'Coordination with frontier labs',
        value: 'Lab safety teams won\'t adopt outside methods',
        note: 'Frontier labs trust their internal safety teams. Adopting an outside (especially decentralized + anonymous) alignment method requires institutional trust labs don\'t extend lightly. Subnet alignment outputs need a path INTO Anthropic/OpenAI/DeepMind workflows or readers can\'t see them deployed.',
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

  /* SN60 Bitsec.ai — "find and fix exploits in codebases" (live
     identity per taostats 2026-05-22; local subnets.js still
     carries stale "Snowballer / data" row). Direct adjacent to
     SN61 RedTeam but the cut is different: RedTeam runs
     competitive challenges around security solutions; Bitsec
     scans existing codebases for vulns + ships patches. The
     rival pool mirrors GitHub Copilot Autofix + Semgrep + Snyk
     + the autonomous-vuln-discovery shops (XBOW Mythos2) more
     than the audit firms. */
  60: {
    rivals: ['xbow', 'protect-ai', 'hiddenlayer', 'adversa-ai', 'anthropic', 'openai'],
    supplyChainIds: ['nvidia', 'aws-azure-gcp', 'cloudflare-edge'],
    constraints: [
      {
        label: 'Repo-scale context window',
        value: '~100K-1M LOC per scan',
        note: 'Real codebases run 100K+ lines. Frontier LLMs (Claude 3.7 200K context, Gemini 2M) can ingest most repos in one shot — XBOW + GitHub Copilot Workspace leverage this. Subnet miners running smaller models have to chunk + summarize, which loses cross-file vulnerability patterns.',
      },
      {
        label: 'False-positive rate',
        value: 'Static analyzers run 30-70% FP',
        note: 'Semgrep, CodeQL, Snyk all flag noise; security teams ignore most alerts. Decentralized scanning has the same surface — miners optimizing for "found a vuln" will produce more FPs unless validator scoring penalizes them harder than rewarding finds.',
      },
      {
        label: 'Patch correctness verification',
        value: 'Generated fixes break tests at 20-40%',
        note: 'Auto-generated patches frequently break existing tests or introduce regressions. GitHub Copilot Autofix ships gated by CI; subnet must enforce test-pass verification before crediting a fix or readers see broken PRs land.',
      },
      {
        label: 'Vuln-disclosure timing',
        value: 'Patch-then-disclose, 90-day windows',
        note: 'Industry norm: fix lands, then public disclosure 90 days later. On-chain subnet activity is public by default — submitting unpatched vulns to miners burns the responsible-disclosure norm. Validator workflow has to gate this or face vendor lockout.',
      },
      {
        label: 'Dual-use weaponization',
        value: 'Vuln-finding ≈ exploit-writing',
        note: 'A model trained to find exploits can be coaxed to write them. XBOW + Anthropic + OpenAI have internal-use policies + customer agreements gating this. Decentralized subnet — by design open — has to address dual-use surface in validator rules.',
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
