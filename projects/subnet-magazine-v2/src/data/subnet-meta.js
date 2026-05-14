/* =================================================================
   SUBNET MAGAZINE — SUBNET METADATA OVERLAY
   -----------------------------------------------------------------
   Per-subnet extras (website, twitter, longer description). Kept in
   a separate file so the core subnets.js dataset stays compact and
   easy to refresh from the canonical source.

   Anything missing here gracefully falls back to the github repo
   URL from subnets.js.
   ================================================================= */

/**
 * @typedef {Object} SubnetUpdate
 * @prop {string} date         ISO 'YYYY-MM-DD'
 * @prop {'release'|'docs'|'announce'|'governance'|'eval'} type
 * @prop {string} title
 *
 * @typedef {Object} SubnetSpecs
 * @prop {string}   [founded]    ISO date when the subnet first registered
 * @prop {string}   [version]    current shipping version
 * @prop {string}   [chain]      'Subtensor mainnet' typically
 * @prop {string}   [model]      Yuma scoring model summary
 * @prop {string}   [epochBlocks]how many blocks per epoch (typically 360)
 * @prop {string}   [reqMiner]   miner hardware / stake requirement
 * @prop {string}   [reqVal]     validator hardware / stake requirement
 *
 * @typedef {Object} SubnetMeta
 * @prop {string}   [website]
 * @prop {string}   [twitter]    handle without the @
 * @prop {string}   [longDesc]   2–3 sentence research summary
 * @prop {string[]} [reads]      recommended reading / blog posts
 * @prop {SubnetUpdate[]} [updates]  curated recent update history
 * @prop {SubnetSpecs}    [specs]    protocol-level fields
 */

/* Common spec defaults — same Substrate chain, same Yuma cycle for
   most subnets. Per-subnet overrides supplement these. */
const DEFAULT_SPECS = {
  chain:       'Subtensor mainnet',
  epochBlocks: '360',
  model:       'Yuma Consensus · weight-based',
};

/** @type {Record<number, SubnetMeta>} */
export const SUBNET_META = {
  1: {
    website: 'https://macrocosmos.ai/sn1',
    twitter: 'macrocosmos_ai',
    longDesc: 'Open-domain text prompting is the original Bittensor miner battleground. Miners ship LLM inference; validators score responses against rubric-graded prompts. SN1 set the template every text subnet has iterated on since.',
    specs: {
      founded:  '2023-09-08',
      version:  'v6.2 (Apex)',
      reqMiner: 'GPU inference node · ≤ 800ms response time',
      reqVal:   '32 GB RAM · ≥ 2.5k τ stake',
    },
    updates: [
      { date: '2026-05-12', type: 'announce', title: 'SN1 still #1 emitter — τ 412/day average' },
      { date: '2026-04-28', type: 'release',  title: 'Apex v6.2 — adversarial validator pool expanded' },
      { date: '2026-03-30', type: 'eval',     title: 'New rubric set: GPQA-flavored hard reasoning' },
    ],
  },
  2: {
    website: 'https://omron.ai',
    twitter: 'inferencelabs',
    longDesc: 'Omron uses zero-knowledge ML proofs to verify on-chain that miners actually ran the model they claim to have run. The work matters wherever training or inference receipts need to be auditable.',
  },
  4: {
    website: 'https://targon.com',
    twitter: 'manifoldlabsinc',
    longDesc: 'Targon is bandwidth-priced LLM inference with deterministic verifiers. Miners compete on cost-per-token; validators confirm correct output via a deterministic sampling protocol.',
  },
  5: {
    website: 'https://openkaito.ai',
    twitter: 'kaitoai',
    longDesc: 'OpenKaito is decentralized web search. Miners crawl, embed, and retrieve; validators measure recall and precision against ground-truth queries. Goes head-to-head with Perplexity and Google.',
  },
  6: {
    website: 'https://nousresearch.com',
    twitter: 'nousresearch',
    longDesc: 'Nous Research runs rotating finetuning competitions on the Bittensor surface. Miners train adapters or full finetunes; validators score on held-out benchmark sets. A great place to see open-source LLM work in real time.',
  },
  7: {
    website: 'https://subvortex.io',
    longDesc: 'Validator-as-a-service infrastructure. SubVortex provides high-uptime validator nodes for delegators who want exposure to subnet emissions without operating their own validators.',
  },
  8: {
    website: 'https://taoshi.io',
    twitter: 'taoshiio',
    longDesc: 'Taoshi PTN is a proprietary trading network — miners submit live trading signals, validators score them on real PnL with risk-adjusted metrics. Closest thing on Bittensor to a quant hedge fund.',
  },
  9: {
    website: 'https://macrocosmos.ai/sn9',
    twitter: 'macrocosmos_ai',
    longDesc: 'From-scratch language-model pretraining with public loss leaderboards. Macrocosmos runs the competition; miners train ever-better tiny models. The frontier of decentralized training research.',
    specs: {
      founded:  '2024-02-04',
      version:  'v3.1',
      reqMiner: '8× A100 / 4× H100 minimum · public model weights',
      reqVal:   '64 GB RAM · ≥ 4k τ stake',
    },
    updates: [
      { date: '2026-05-11', type: 'eval',     title: 'New eval set: subset of FineWeb-Edu Q4 2025' },
      { date: '2026-04-30', type: 'announce', title: 'SN9 leader 0xA3 hits 4.18 PPL — new ATL' },
      { date: '2026-04-12', type: 'release',  title: 'v3.1 — lift parameter cap to 1.7B' },
      { date: '2026-03-18', type: 'governance',title:'Per-checkpoint weight averaging window doubled' },
    ],
  },
  10: {
    website: 'https://sturdy.finance',
    twitter: 'sturdyfinance',
    longDesc: 'Yield-strategy generation graded against backtests and live PnL. Miners ship DeFi strategies; validators score them against real market data.',
  },
  11: {
    website: 'https://dippy.ai',
    twitter: 'dippy_ai',
    longDesc: 'Roleplay and dialogue model competition. Miners ship character LLMs; validators score on engagement, character consistency, and steerability.',
  },
  12: {
    website: 'https://computehorde.ai',
    twitter: 'computehorde',
    longDesc: 'GPU compute spot market priced per FLOP-hour with verifiable receipts. Direct decentralized competitor to RunPod, vast.ai, CoreWeave.',
  },
  13: {
    website: 'https://manifold.inc',
    twitter: 'manifoldlabsinc',
    longDesc: 'Open dataset construction and curation. Miners contribute, clean, and label rows; validators score for quality and uniqueness. Goes after the same surface as Scale AI and Surge.',
  },
  15: {
    website: 'https://agentartificial.com',
    longDesc: 'Adversarial validation of LLM outputs. Each prompt is judged against rubrics by independent validator agents — a meta-layer for quality control across the broader Bittensor LLM stack.',
  },
  17: {
    website: 'https://404gen.com',
    twitter: '404_gen',
    longDesc: '3D asset generation from text prompts. Miners ship text-to-3D models; validators score on geometric fidelity and prompt adherence.',
  },
  18: {
    website: 'https://corcel.io',
    twitter: 'corcel_io',
    longDesc: 'Real-time text inference with strict latency SLAs. Cortex.t is the subnet you ping when you need a token answer in <800ms.',
  },
  19: {
    website: 'https://vision.taonet.ai',
    longDesc: 'Image classification, embedding, and synthesis under public scoring. The most general-purpose vision subnet — a competitor to centralized image-gen and vision-model providers.',
  },
  21: {
    website: 'https://omegalabs.ai',
    twitter: 'omegalabsai',
    longDesc: 'Any-to-any multimodal generation: text → image, image → video, audio → text, etc. Adversarial validators score quality and faithfulness.',
  },
  23: {
    website: 'https://nicheimage.io',
    longDesc: 'Long-tail image generation in specialized domains where Midjourney and Stable Diffusion overfit. Anime, vector art, scientific illustration, etc.',
  },
  24: {
    website: 'https://bitmind.ai',
    twitter: 'bitmindai',
    longDesc: 'AI-generated content detection. Classifies real vs synthetic media (image, video, eventually audio) — the deepfake forensics arm of the Bittensor stack.',
  },
  25: {
    website: 'https://macrocosmos.ai/sn25',
    twitter: 'macrocosmos_ai',
    longDesc: 'Distributed protein folding and molecular simulation. The Folding@home spiritual successor — incentivized this time.',
  },
  27: {
    website: 'https://neuralinternet.ai',
    twitter: 'neuralinternet',
    longDesc: 'Verifiable GPU compute marketplace priced per FLOP. Verifies what was computed via signed receipts.',
  },
  28: {
    website: 'https://tensoralchemy.com',
    longDesc: 'Image generation tournament with style and prompt fidelity scoring. Constant adversarial competition between miners.',
  },
  29: {
    website: 'https://coldint.io',
    longDesc: 'Cold-start distributed integer compute for training pipelines. Volunteer compute pooled and verified.',
  },
  30: {
    website: 'https://wombo.ai',
    twitter: 'WomboAI',
    longDesc: 'Text-to-video generation. Miners ship short clip generators; validators score on quality and prompt fidelity. Direct competitor to Runway and Pika.',
  },
  34: {
    website: 'https://bitmind.ai/fm',
    twitter: 'bitmindai',
    longDesc: 'Foundation-model fingerprinting for content provenance. Identifies which base model produced a given image.',
  },
  36: {
    website: 'https://webgenie.ai',
    twitter: 'webgenieai',
    longDesc: 'Browser-using agents graded on real-world task completion: book a flight, fill a form, scrape a site, etc. Direct competitor to Anthropic Claude Computer Use and OpenAI Operator.',
  },
  39: {
    website: 'https://edgemaxxing.womboai.com',
    twitter: 'WomboAI',
    longDesc: 'On-device inference optimization with verifiable latency proofs. Pushes inference to the edge — competitor to Cloudflare Workers AI and Akamai EdgeWorkers.',
  },
  42: {
    website: 'https://foresight.gg',
    longDesc: 'On-chain prediction markets validated against real outcomes. Miners forecast; validators settle against verifiable events.',
  },
  43: {
    website: 'https://graphite-ai.com',
    longDesc: 'Combinatorial optimization on hard graph problems. TSP, scheduling, supply chain — the kind of NP-hard work big consultancies sell at five-figure day rates.',
  },
  47: {
    website: 'https://condense.ai',
    longDesc: 'Long-context summarization and compression scored on fidelity. The benchmark of "did the summary keep the parts that matter."',
  },
  48: {
    website: 'https://nextplace.ai',
    longDesc: 'Real-estate price prediction graded against transaction outcomes. A specialized prediction-market subnet.',
  },
  50: {
    website: 'https://synth.mode.network',
    longDesc: 'Synthetic-data generation for finance with downstream-task scoring. Synthetic candles, order books, returns — for backtest-resistant strategy development.',
  },
  52: {
    website: 'https://tensorplex.ai',
    twitter: 'tensorplex_labs',
    longDesc: 'Human-in-the-loop labeling marketplace with anti-collusion validators. Bittensor\'s answer to Scale AI and Surge.',
  },
  55: {
    website: 'https://precog.ai',
    longDesc: 'Crypto-price short-horizon forecasting with continuous scoring. CoinMetrics builds the validator.',
  },
  56: {
    website: 'https://gradients.io',
    twitter: 'rayon_labs',
    longDesc: 'No-code finetuning service. Upload a dataset, miners auto-train models with various configurations, validators score on held-out eval loss. Compete with Together AI and Fireworks for the finetuning surface.',
    specs: {
      founded:  '2024-11-08',
      version:  'v2.4',
      reqMiner: '1+ GPU node · Python 3.11 · ≥ 200 GB SSD',
      reqVal:   '32 GB RAM · ≥ 2k τ stake',
    },
    updates: [
      { date: '2026-05-09', type: 'release',  title: 'v2.4 — DoRA + QLoRA recipes added' },
      { date: '2026-04-19', type: 'announce', title: 'SN56 surpasses τ 150/day, second-largest emitter' },
      { date: '2026-04-05', type: 'docs',     title: 'New tutorial: finetuning Llama 5 8B on a 4090' },
      { date: '2026-03-24', type: 'eval',     title: 'Eval set rotated to MMLU-Pro + IFEval mix' },
    ],
  },
  57: {
    website: 'https://nimbus.gg',
    longDesc: 'Geospatial intelligence and climate modeling with satellite-data validators. Forest cover, fire prediction, ag yield — work normally done by Planet Labs and Maxar.',
  },
  58: {
    website: 'https://dippy.ai/speech',
    twitter: 'dippy_ai',
    longDesc: 'Voice clone and TTS quality competition with adversarial listening. Direct ElevenLabs competitor on the open-source side.',
  },
  59: {
    website: 'https://agentarena.ai',
    longDesc: 'Agent-vs-agent benchmark arena. LLM agents face off on tool use, planning, and dialogue tasks — pairwise scoring like a Bittensor-native AgentBench.',
  },
  60: {
    website: 'https://snowballer.ai',
    longDesc: 'Iterative dataset bootstrapping with active-learning validators. Each round picks the labels that maximize information gain.',
  },
  61: {
    website: 'https://redteam.ai',
    longDesc: 'Continuous red-teaming of frontier models for jailbreak discovery. Miners attack; validators verify the jailbreak actually works. A live, public adversarial robustness leaderboard.',
  },
  64: {
    website: 'https://chutes.ai',
    twitter: 'rayon_labs',
    longDesc: 'Verifiable serverless function execution for AI workloads. Chutes is the decentralized answer to AWS Lambda + Modal — deploy a Python function, get it run on miner compute, get a signed receipt of execution.',
    reads: ['https://chutes.ai/docs', 'https://rayonlabs.ai'],
    specs: {
      founded:  '2025-03-12',
      version:  'v0.8.2',
      reqMiner: 'GPU node · ≥ 24 GB VRAM · static IP',
      reqVal:   '32 GB RAM · 200 GB SSD · ≥ 1k τ stake',
    },
    updates: [
      { date: '2026-05-08', type: 'release',  title: 'v0.8 — multi-region GPU pool, Hopper class added' },
      { date: '2026-04-22', type: 'docs',     title: 'Provider docs updated for Ampere / Hopper / Blackwell' },
      { date: '2026-04-03', type: 'announce', title: 'Chutes crosses τ 100/day in emissions, top-5 by validator count' },
      { date: '2026-03-15', type: 'release',  title: 'v0.7 — verifiable receipts moved on-chain' },
      { date: '2026-02-26', type: 'governance',title:'Validator weight cap raised to 18% per coldkey' },
    ],
  },
  67: {
    website: 'https://bitmint.io',
    longDesc: 'On-chain minting/burning of synthetic assets with validator-priced spreads. Bittensor-native synthetics — like Synthetix on Substrate.',
  },
  69: {
    website: 'https://kaito.ai/fm',
    twitter: 'kaitoai',
    longDesc: 'Personalized AI feed/news ranking scored on engagement. The recommender-system arm of OpenKaito.',
  },
  73: {
    website: 'https://merit.ai',
    longDesc: 'Reward-model training data marketplace with provenance receipts. Useful for any team needing high-quality RLHF data with auditable origin.',
  },
  75: {
    website: 'https://pollenlabs.ai',
    longDesc: 'On-chain knowledge graph construction with citation validation. Builds a verifiable graph of human knowledge with sources — the substrate a future open-source Perplexity might run on.',
  },
  77: {
    website: 'https://liquiditylabs.ai',
    longDesc: 'AMM liquidity-provision strategy market judged on impermanent-loss-adjusted PnL. Optimizes LP positions across Uniswap, Curve, Balancer, etc.',
  },
  79: {
    website: 'https://polaris-ai.io',
    longDesc: 'Sim-to-real robotics policy training with shared evaluation harness. Bittensor takes on the same surface Figure / 1X / Boston Dynamics work on, but for open policy weights.',
  },
  81: {
    website: 'https://patrouter.ai',
    longDesc: 'Routing agent — picks best model + price per prompt across all subnets. A meta-layer that lets users hit "the cheapest subnet that meets quality bar X."',
  },
  83: {
    website: 'https://anchor.gg',
    longDesc: 'On-chain document hashing and integrity attestation. Validators sign attestations that a document existed at time T — useful wherever notarization is required.',
  },
  86: {
    website: 'https://audiomind.ai',
    longDesc: 'Speech recognition and diarization with WER-graded validators. ASR competition open to anyone — direct competitor to OpenAI Whisper, AssemblyAI, Deepgram.',
  },
  88: {
    website: 'https://bitcurrent.io',
    longDesc: 'Cross-exchange order routing for spot crypto with execution-quality scoring. Smart-order-router as a subnet.',
  },
  92: {
    website: 'https://atomverse.ai',
    longDesc: 'Materials-science property prediction (DFT proxy) with experimental validators. The subnet most adjacent to the work Isomorphic Labs and Google Materials do.',
  },
};

/** Get website for a subnet, falling back to its github repo URL. */
export function subnetWebsite(s){
  const m = SUBNET_META[s.netuid];
  if (m?.website) return m.website;
  if (s.gh) return `https://github.com/${s.gh}`;
  return null;
}

/** Twitter URL for a subnet, if known. */
export function subnetTwitter(s){
  const m = SUBNET_META[s.netuid];
  if (!m?.twitter) return null;
  return `https://twitter.com/${m.twitter}`;
}

/** Long-form research summary. */
export function subnetLongDesc(s){
  return SUBNET_META[s.netuid]?.longDesc || s.desc;
}

/**
 * Resolve protocol-level spec fields, merging defaults with overrides.
 * Always returns a usable object so the SubnetDetail page never has
 * to handle missing data.
 */
export function subnetSpecs(s){
  return {
    ...DEFAULT_SPECS,
    ...(SUBNET_META[s.netuid]?.specs ?? {}),
    netuid: s.netuid,
    owner: s.owner,
  };
}

/** Recent update history, newest first. */
export function subnetUpdates(s){
  const arr = SUBNET_META[s.netuid]?.updates ?? [];
  return arr.slice().sort((a, b) => (b.date < a.date ? -1 : 1));
}
