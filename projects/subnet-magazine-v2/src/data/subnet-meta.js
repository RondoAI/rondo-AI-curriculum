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
 * @typedef {Object} SubnetMeta
 * @prop {string} [website]
 * @prop {string} [twitter]      handle without the @
 * @prop {string} [longDesc]     2–3 sentence research summary
 * @prop {string[]} [reads]      recommended reading / blog posts
 */

/** @type {Record<number, SubnetMeta>} */
export const SUBNET_META = {
  1: {
    website: 'https://macrocosmos.ai/sn1',
    twitter: 'macrocosmos_ai',
    longDesc: 'Open-domain text prompting is the original Bittensor miner battleground. Miners ship LLM inference; validators score responses against rubric-graded prompts. SN1 set the template every text subnet has iterated on since.',
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
