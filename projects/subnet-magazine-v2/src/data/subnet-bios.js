/* =================================================================
   SUBNET MAGAZINE, TOP 25 SUBNET BIOS · MAY 2026
   -----------------------------------------------------------------
   Long-form editorial bios for the top 25 subnets by daily τ
   emission as of May 14, 2026. Researched from taostats,
   taomarketcap, the subnet repositories, Macrocosmos and Rayon
   Labs blogs, and 2026 press coverage (CoinGecko, The Defiant,
   PANews, Coindesk, TAO.media). Keyed by netuid.

   Context note: daily protocol emission halved from 7,200 τ to
   3,600 τ at the December 2025 halving. On April 9-10, 2026,
   Covenant AI exited Bittensor, deprecating its three subnets
   (SN3, SN39, SN81); community miners restarted all three from
   open-source code within days. Emission share figures below
   reflect the post-Covenant redistribution.

   Merge target: SUBNETS in ./subnets.js.
   ================================================================= */

/**
 * @typedef {Object} SubnetBio
 * @prop {number}  netuid
 * @prop {string}  oneline
 * @prop {string}  keyMetric
 * @prop {string}  recentNews
 * @prop {string}  bio
 */

/** @type {readonly SubnetBio[]} */
export const SUBNET_BIOS = Object.freeze([

  // RANK 1, by far the largest emission consumer on the network.
  {
    netuid: 64,
    oneline: 'Serverless GPU compute for open-source AI inference.',
    keyMetric: '~518 τ daily emission (~14.4% of network)',
    recentNews: 'Cumulative tokens served crossed 9.1 trillion in Q1 2026, with daily peaks above 50 billion across 400,000+ users.',
    bio: 'Chutes is the serverless-functions layer of Bittensor: miners run dockerized model endpoints, validators issue signed requests and grade them on latency, correctness, and uptime, and the platform pays out in α and τ on the resulting receipts. Built and operated by Rayon Labs, it is the single largest emission sink on the network at roughly 14.4% of daily τ, about 518 τ a day, and the first subnet to clear a $100M α-market-cap. Rayon Labs also runs SN56 Gradients and SN19 Nineteen; together the trio commands roughly 23.7% of daily emissions, making it the most influential operator group in the ecosystem. Q1 2026 milestones: cumulative tokens served crossed 9.1 trillion, daily peaks above 50B, and pricing reportedly 85% below AWS for equivalent open-source model serving. Competes directly against Together AI, Fireworks, and Replicate; the dTAO bull case is that emission subsidy lets it underprice them indefinitely. Find it at chutes.ai; repo at rayonlabs/chutes.'
  },

  // RANK 2, Note: seed file emission of 152 τ understates current share;
  // Gradients sits closer to ~241 τ per recent emission-share reports.
  {
    netuid: 56,
    oneline: 'No-code finetuning service for text and image models at scale.',
    keyMetric: '~6.7% emission share (~241 τ daily)',
    recentNews: 'Reported life-sciences customer cohort running 118-billion-parameter finetunes at roughly $5/hour on Chutes-hosted rails, alongside expansion into RLHF and alignment tuning workflows.',
    bio: 'Gradients is Rayon Labs\' answer to "finetune-as-a-service": a clean web UI where users upload a dataset, pick a base model, and miners across the subnet auto-train candidate adapters. Validators score eval loss against held-out splits, the lowest-loss adapter wins the round, and the user takes the artifact. The product is consumer-grade, no Python, no GPU rental, a few clicks, and that is what distinguishes it from raw HuggingFace AutoTrain or Together\'s fine-tuning API, both of which still expect technical operators who know what learning rate and gradient accumulation mean. Gradients runs on Chutes for the underlying compute, which gives the Rayon Trio operational leverage no other team has: the same group owns the inference layer, the training layer, and the latency-critical serving layer. Q1-Q2 2026 milestones: real adopters in the life-sciences cohort training 118B-parameter models for approximately $5/hour, and steady expansion into RLHF and alignment tuning. Sits at roughly 6.7% of daily τ emission, comfortably top three by τ flow. Find it at gradients.io; repo at rayonlabs/G.O.D.'
  },

  // RANK 3
  {
    netuid: 4,
    oneline: 'Deterministic LLM inference with cryptographically verified outputs.',
    keyMetric: '~$10.4M annualized revenue run-rate',
    recentNews: 'Dippy AI ported its full 8.6M-user roleplay backend onto Targon in Q1; Manifold closed a reported $10.5M Series A and integrated NVIDIA Confidential Compute.',
    bio: 'Targon is Manifold Labs\' bet that bandwidth-priced, deterministically-verified inference is the actual product to ship to enterprises, not raw embeddings, not generic prompts. Miners run open-weight LLMs (DeepSeek, Llama, Qwen) behind an OpenAI-compatible endpoint; validators replay sampled requests against canonical seeds and score for byte-for-byte determinism, latency, and uptime. Outputs that pass verification carry a cryptographic receipt, which is the wedge into regulated and high-trust buyers, finance, healthcare, public sector, anywhere an audit log matters. Q1-Q2 2026 milestones: Dippy AI (8.6M users) migrated its entire roleplay backend onto Targon in a deal reported to be six-figures; Manifold closed a reported $10.5M Series A in Q1; NVIDIA Confidential Compute (H100 TEE) integration shipped, giving the subnet a defensible privacy story. Annualized revenue run-rate is reported at roughly $10.4M, the cleanest external-revenue story on Bittensor outside Chutes and Lium. Emission share sits around 5.7% and has been net-positive through the Covenant turbulence. Competes directly against Fireworks AI and Together AI. Find it at targon.com; repo at manifold-inc/targon.'
  },

  // RANK 4, SN3 rebuilt by community after Covenant exit; now "Teutonic".
  // Seed file shows it under SN9 Pretraining and doesn't reflect the rebuild.
  {
    netuid: 3,
    oneline: 'Decentralized pretraining of frontier-scale base language models.',
    keyMetric: '80B-parameter Teutonic-LXXX run started May 11, 2026',
    recentNews: 'Const announced training of Teutonic-LXXX (80B) on May 11; the subnet was rebuilt from open-source code by community miners after Covenant AI deprecated it on April 9.',
    bio: 'Templar built Bittensor\'s most-discussed proof point: Covenant-72B, a 72-billion-parameter base model trained from scratch across roughly 70 permissionless nodes on commodity internet hardware, completed March 10, 2026. The model hit 67.1 on MMLU zero-shot, edging LLaMA-2-70B, and triggered a ~40% τ rally and a 194% week-over-week move in SN3 α. The economics rest on SparseLoCo, a gradient-compression algorithm that drops bandwidth by 97% with no measurable accuracy loss, what made wide-internet training tractable. Covenant AI deprecated the subnet on April 9, 2026 in its acrimonious exit; community miners reconstituted it from the open-source repo within a week and now run it as Teutonic. On May 11, Const publicly fired the starting gun on Teutonic-LXXX, an 80B run using a king-of-the-hill incentive where independent miners compete to lower perplexity against the current "KING" checkpoint. Emission share ~5.6%. Live dashboard at the Teutonic site; repo at tplr-ai.'
  },

  // RANK 5, Note: seed file has SN51 missing entirely; this is a major
  // gap, since Lium is consistently a top-5 emission subnet in 2026.
  {
    netuid: 51,
    oneline: 'Permissionless H100, A100, and H200 GPU rental marketplace.',
    keyMetric: '~$432K/month rental revenue',
    recentNews: 'Onboarded 500+ H100 GPUs in Q1 2026; first Bittensor subnet whose external rental revenue is reported to exceed its own emission subsidy.',
    bio: 'Lium (formerly Celium) is the cleanest counter-example to the "TAO has no revenue" critique: a peer-to-peer GPU rental marketplace where miners list NVIDIA H100/A100/H200 capacity, validators run hardware-attestation checks (driver fingerprints, on-device benchmarks, hourly heartbeats, and periodic CUDA challenge probes), and users rent by the hour through lium.io or the lium CLI without KYC or whitelist approval. Built by Datura AI, the same shop that previously held the SN18 slot, it benchmarks directly against io.net, Akash, and Vast.ai on the decentralized side, and against CoreWeave and Crusoe on the centralized side, and is currently winning on price for non-reserved capacity. As of April 2026 it is reported as the highest-revenue subnet on Bittensor at approximately $432K/month in rental fees, and the customer pipeline\'s paid demand has begun to exceed the τ subsidy, a milestone almost no other subnet can claim. Q1 milestones: 500+ H100s added to the pool, public CLI v0.1.0, transparent hardware verification page, and a custom miner-onboarding flow. Emission share ~4.4%. Find it at lium.io; repo at Datura-ai/lium-io.'
  },

  // RANK 6
  {
    netuid: 14,
    oneline: 'Decentralized Bitcoin proof-of-work hashrate market on Bittensor.',
    keyMetric: '~8.2% emission share',
    recentNews: 'Latent Holdings reinvested 4.4 BTC of validator earnings back into TAO in May 2026, formalizing a hashrate-to-TAO flywheel.',
    bio: 'TAOHash is the only subnet on the network that produces a non-AI commodity at scale: SHA-256 hashrate. Miners point physical or cloud-hosted ASICs at subnet-operated pools, validators measure delivered hashrate via stratum-share telemetry and pool-side accounting, and rewards split between direct BTC payouts (the TIDES system, which requires no Bittensor registration) and α tokens (for registered participants, sized at roughly 5% of contributed hashpower value). The dual-rail structure means existing industrial miners can plug in without changing their accounting model, while crypto-native participants can take the α exposure on top. Operated by Latent Holdings, the technology shop associated with technology investor Joseph Jacks, the structural pitch is that Bittensor becomes a venue where Bitcoin miners can convert hashrate into a yield-bearing AI exposure without ever selling their BTC. Recent milestone: in May 2026, Latent reinvested 4.4 BTC of validator earnings back into TAO and re-staked it to the subnet, formalizing a closed-loop flywheel that ties BTC mining yields directly to subnet-token demand. Emission share sits around 8.2%, second only to Chutes. Repo at latent-to/taohash.'
  },

  // RANK 7
  {
    netuid: 8,
    oneline: 'Decentralized proprietary trading network with live PnL-graded miners.',
    keyMetric: '~3.5% emission share, live since Feb 17, 2026',
    recentNews: 'Q1 2026 launch of VantaTrading, GlitchFinancial, and 0x_Markets DEX as consumer surfaces on top of the trading-signal feed.',
    bio: 'PTN, now publicly trading under the Vanta brand, is Taoshi\'s decentralized prop-trading harness. Miners submit live trading agents that take positions on BTC, ETH, FX pairs, equity indices, and commodities; validators track every fill on a 24/7 paper-execution layer and rank by Sharpe-adjusted PnL, drawdown, turnover, and stability across regimes. Top deciles earn α emissions; bottom deciles get culled and respawned. The architectural thesis is that the protocol can outbid centralized prop firms (FTMO, Topstep, Maven) by paying out τ emissions before any client capital is deployed, and then monetize the top-ranked agents through funded retail accounts. Q1 2026 went live on February 17 with three consumer surfaces: VantaTrading for retail signal subscriptions, GlitchFinancial for automated execution, and 0x_Markets DEX for the underlying spot fills. Taoshi also stated a March 31 target for Hyperscaled, a Hyperliquid-integrated prop-firm rail extending PTN payouts to a major perps venue. Emission share ~3.5%, momentum positive over Q2. Find it at taoshi.io and vanta.trading; repo at taoshidev/proprietary-trading-network.'
  },

  // RANK 8
  {
    netuid: 5,
    oneline: 'Decentralized text embedding models and web search retrieval.',
    keyMetric: '~3.1% emission share',
    recentNews: 'Yaps integration rolling out in Q2 2026, plugging SN5 embeddings into Kaito\'s mainstream crypto-mindshare product as the largest external distribution channel any subnet currently has.',
    bio: 'OpenKaito is Kaito\'s on-chain wedge for everything its centralized search product already does: train and serve the best general-purpose text embedding models, then rank web and social content against ground-truth query sets. Miners submit embeddings and retrieval rankers; validators score them against held-out evaluation suites (MTEB-style benchmarks plus Kaito\'s proprietary InfoFi labels covering crypto-mindshare, narrative, and entity-resolution tasks). The architecture is community-driven and open-source, which keeps the subnet credible as a decentralized alternative even as Kaito itself remains a centralized brand. The strategic move in 2026 is the Yaps integration rolling out in Q2, SN5 embeddings get plugged directly into Kaito\'s consumer-grade crypto-mindshare product, which is the largest single non-Bittensor distribution channel any subnet currently has. Competes against Cohere embeddings and OpenAI text-embedding-3 on the technical side; against Kaito itself, Perplexity, and Brave Search on the consumer side. Emission share sits around 3.1%, with steady but unspectacular growth. Repo at OpenKaito/openkaito.'
  },

  // RANK 9
  {
    netuid: 19,
    oneline: 'Ultra-low-latency inference for open-source LLM and image models.',
    keyMetric: '~2.7% emission share, world-record LLM tok/s',
    recentNews: 'Continues to hold the public world record for fastest open-source LLM serving (set late 2024, defended through 2026 against Groq and Cerebras).',
    bio: 'Nineteen is the third leg of the Rayon Trio: a latency-obsessed inference subnet built for use cases where milliseconds matter, trading agents, live translation, real-time gameplay, voice agents, agentic tool calls inside an inner loop. Miners are scored almost entirely on tok/s and time-to-first-token under load; output quality is a floor (must match a reference), not the ranking axis. The subnet holds the public world record for fastest open-source LLM serving, originally set in late 2024 and defended through 2026 even as Groq, Cerebras, and SambaNova have pushed their numbers on equivalent hardware. Operationally, Rayon routes Chutes\' time-critical workloads here, which gives Nineteen a steady real-traffic profile most subnets lack and a continuous signal for miners to optimize against. Emission share ~2.7%, smaller in τ terms than Chutes or Gradients but punching above its weight on product proof. Competes against Groq, Cerebras, and SambaNova on the high-end specialty silicon; against Together AI and Fireworks at parity hardware. Repo at rayonlabs/nineteen.'
  },

  // RANK 10, Affine surged into top 5 by emission share several times
  // in early 2026, currently sits in the upper bracket of the top 25.
  {
    netuid: 120,
    oneline: 'Cross-subnet RL coordination layer for iterative model improvement.',
    keyMetric: '~$71.8M α-market cap (March 2026)',
    recentNews: 'Joined Project Rubicon\'s first Base-chain liquid staking cohort of 17 subnet tokens in late 2025; emission share has rotated through the top three multiple times.',
    bio: 'Affine is a coordination layer rather than a single-domain producer. It runs winner-takes-all reinforcement-learning competitions across well-defined task families, code generation, program abduction, math reasoning, structured-output tasks, where any participant can pull the current best model, propose an incremental improvement, and submit it back. Validators run the improved model against a private task suite; if it materially beats the incumbent on the eval, the contributor earns the full reward for that round and the incumbent gets overwritten. The architecture deliberately leans on Chutes for hosting, on Gradients for training, and on Lium for compute, which makes Affine a piece of meta-infrastructure that compounds on whatever the rest of the network produces. The resulting flywheel, every other Bittensor subnet implicitly contributes to Affine\'s evolutionary loop, is the bull case. As of March 25, 2026, α-market cap was reported around $71.8M. Emission share has rotated through the top three multiple times in 2026, briefly displacing Chutes at the top before settling into the upper cohort. Repo at AffineFoundation/affine-cortex.'
  },

  // RANK 11
  {
    netuid: 62,
    oneline: 'Autonomous software engineering agents competing on real tasks.',
    keyMetric: 'Highest mindshare among Bittensor subnets (Q2 2026)',
    recentNews: 'Rewrote miner stack and shipped a code-output dashboard in Q1 2026 ahead of a new incentive mechanism designed to flywheel toward a Claude Code / Cursor competitor.',
    bio: 'Ridges is the SWE-agent subnet: miners ship autonomous coding agents that pull tickets from a private task harness (SWE-bench-style scaffolding plus internal benchmark sets), edit a sandboxed repo, and submit diffs. Validators run the resulting code against hidden test suites, score on pass-rate, diff size, and execution cost, and rank the agents accordingly. The product target is explicit, match Claude Code or Cursor on simple-to-medium engineering work, at $2-5/day instead of $50+/seat, and the incentive flywheel is designed to compound iteratively-improving agents on top of an open codebase. Q1 2026 milestones: a full rewrite of the miner tooling, the public agent-output dashboard that lets observers watch code being generated in real time, and a new incentive mechanism announcement teed up for Q2 designed to flywheel SOTA SWE performance. Mindshare ranking has been the highest of any Bittensor subnet through 2026 according to public mindshare trackers, though emission share is more modest at single-digit percent, a recurring pattern of attention outpacing τ flow. Find it at ridges.ai; repo at ridgesai/ridges.'
  },

  // RANK 12
  {
    netuid: 1,
    oneline: 'Open-domain conversational LLM serving with agentic tooling.',
    keyMetric: '1,000+ req/h per validator key on ApexClient',
    recentNews: 'Battleships v1 launched in late 2025 as Apex\'s first fully peer-to-peer in-subnet competition, with winning miners paid in SN1 α.',
    bio: 'Apex is the original miner battleground, the OG SN1, and after several mechanism overhauls it now runs as Macrocosmos\' open-domain conversational layer. Miners serve open-weight LLMs (Llama, Mistral, DeepSeek, Qwen) augmented with agentic scaffolding: tool use, code execution, live web search routed through SN5, and structured output enforcement. Validators send a mix of synthetic and human-labeled prompts, then score on factuality, coherence, and reasoning depth against a rotating rubric so miners cannot overfit to any one benchmark. Macrocosmos exposes the subnet through the Apex SDK and a Mission Command web console, with rate limits of 100 req/h per public API key and 1,000/h for validator-bound traffic. Late-2025 milestone: Battleships v1, the first fully peer-to-peer in-subnet competition, ran on Apex with winners paid in SN1 α, a template Macrocosmos has been extending into other game-shaped competitions through 2026, including reasoning duels and agentic puzzle solving. Emission share sits in the mid-single digits, with steady but unspectacular growth and a long-tail of integrations with SN9 IOTA and SN13 Data Universe. Find it at macrocosmos.ai; repo at macrocosm-os/apex.'
  },

  // RANK 13
  {
    netuid: 44,
    oneline: 'Sports computer vision and live match-outcome prediction.',
    keyMetric: '~70% match-outcome prediction accuracy',
    recentNews: 'Partnered with SN13 Data Universe in Q1 2026; building a fantasy-sports app for the 2026 World Cup window.',
    bio: 'Score is decentralized computer vision pointed at one specific industry, football. Miners run object detection, keypoint tracking, and event detection across match footage; validators score on ground-truth annotation packs (player tracking, ball position, passes, tackles, set pieces) and on downstream prediction accuracy against real match outcomes. The subnet reports roughly 70% accuracy on match-outcome predictions, which is competitive with published bookmaker baselines. Q1 2026 milestones: a data partnership with Macrocosmos\' SN13 Data Universe to feed annotation rows back into Score\'s training set, and a fantasy-sports consumer app scheduled to ride the 2026 World Cup window. α-market cap was reported around $38-45M through Q1, putting Score solidly in the top tier on a market-value basis even though emission share is more modest. Competes against Stats Perform, Second Spectrum, and Hudl on the analytics side, and against centralized prediction-market operators on the downstream betting layer. Repo at score-technologies/score-vision.'
  },

  // RANK 14
  {
    netuid: 13,
    oneline: 'Decentralized social and web data scraping layer for AI training.',
    keyMetric: '55B+ scraped rows, ~350M new rows/day',
    recentNews: 'Score (SN44) signed on as a downstream customer in Q1 2026; queryable Endpoints API in active development with a public beta scheduled for Q2.',
    bio: 'Data Universe is the data-supply layer of the Macrocosmos cluster, the gravity well that feeds everything else. Miners scrape Reddit, X, and (increasingly) YouTube transcripts and TikTok metadata; validators audit row provenance via independent re-scrape, dedupe, and rank by freshness and demand-side relevance. The subnet now holds upwards of 55 billion scraped posts and comments and ingests roughly 350 million new rows per day, making it one of the largest publicly accessible social-data inventories outside the platforms themselves. The strategic shift in 2026 has been from raw scraping to a queryable Endpoints API that downstream subnets and external customers can hit directly, SN44 Score signed on as a Q1 anchor customer, with negotiations reported with other vertical subnets. Macrocosmos positions this as the data-pipeline twin to Apex (SN1), IOTA (SN9), and Mainframe (SN25): the same team controls collection, training, and serving, end-to-end. Emission share sits in the mid-single digits, but the integration moat across Macrocosmos subnets makes it strategically punching above raw rank. Repo at macrocosm-os/data-universe.'
  },

  // RANK 15, Post-Covenant rebuild, community-operated.
  {
    netuid: 39,
    oneline: 'Agent-native sandboxed ephemeral compute for AI workloads.',
    keyMetric: 'ATH $8.02 on April 6, 2026; subsequently drawn down 70%+',
    recentNews: 'Deprecated by Covenant AI on April 9, 2026; community miners restarted the subnet from open-source code within days, now operating without central founder coordination.',
    bio: 'Basilica was relaunched in January 2026 by Covenant AI founder Sam Dare as an agent-native compute layer, sandboxed, ephemeral, disposable runtimes that AI agents could spin up in seconds rather than the minutes-to-hours overhead of generic GPU rentals or container orchestration. The product distinction from Chutes is environmental: Basilica targets agentic workloads that need to install packages on demand, run untrusted code, write to a local filesystem, network freely within a sandbox, and self-terminate, where Chutes targets stable inference endpoints that get re-used across many calls. The subnet hit an α-price ATH of $8.02 on April 6, 2026, riding the broader Covenant narrative, then was deprecated four days later when Covenant AI exited the network on April 9 amid an acrimonious governance dispute with Const and the Opentensor Foundation. Community miners reconstituted the subnet from the open-source repo within days; it now runs without central operator coordination. Currently rebuilding emission share from the post-exit drawdown of roughly 70%+. Competes against E2B and Daytona on the centralized side. Repo at tplr-ai/basilica.'
  },

  // RANK 16, Post-Covenant rebuild, community-operated.
  {
    netuid: 81,
    oneline: 'Cooperative reinforcement-learning post-training of a shared LLM.',
    keyMetric: '+211% α-price over 30 days (March 2026 window)',
    recentNews: 'Deprecated alongside SN3 and SN39 in Covenant\'s April 9 exit; rebuilt by community miners as part of the post-Covenant restoration.',
    bio: 'Grail is the post-training counterpart to Templar\'s pretraining: instead of producing a base model from scratch, Grail miners cooperatively post-train a shared model with RL and preference data, pooling compute across permissionless hardware. Validators score on a rolling eval suite spanning reasoning, instruction-following, and safety probes, with rewards weighted toward improvements that actually move the held-out evaluation rather than reward-hack the proxy. During the March 2026 Bittensor rally, Grail α posted a 211% 30-day gain on the back of the Covenant-72B announcement, briefly making it one of the highest-momentum subnet tokens on the network. It was then deprecated on April 9 alongside SN3 Templar and SN39 Basilica when Covenant AI exited the network amid the public governance dispute with Const. Community miners restarted Grail from the open-source repo within days; the subnet is now operated without central founder coordination, which is itself a meaningful natural experiment in whether RL-style cooperative post-training survives operator removal. Currently rebuilding emission share through Q2 2026. Repo previously at one-covenant/grail.'
  },

  // RANK 17
  {
    netuid: 68,
    oneline: 'Decentralized virtual-screening pipeline for small-molecule drug discovery.',
    keyMetric: '11M+ molecules screened against ~7,000 protein targets',
    recentNews: 'Crossed 11 million screened molecules on May 10, 2026, the largest reported decentralized virtual-screening run to date and a milestone for on-chain pharma R&D.',
    bio: 'NOVA runs decentralized virtual screening for drug discovery. Miners propose docking poses and binding-affinity scores for candidate small molecules against a defined library of therapeutic protein targets; validators re-score with a deterministic physics-based pipeline (a DiffDock-class scoring stack) and rank by reproducibility against held-out positive controls. The architecture trades raw throughput for an audit trail a pharmaceutical buyer can defend. Operated by Metanova Labs, the subnet has expanded the screening combinatorial space to roughly 65 billion target-molecule pairs, and as of May 10, 2026 reports having screened upwards of 11 million molecules against approximately 7,000 protein targets. α posted a 218% 30-day gain into late March 2026, riding the broader subnet rally and the Jensen Huang TAO endorsement. The thesis is that decentralized screening underprices contract research organizations (CROs) on cost and throughput while producing receipts a wet lab can pick up directly, a credible attack on the $1.5T pharma R&D outsourcing market. Find it at metanova.bio; repo at metanova-labs/NOVA.'
  },

  // RANK 18
  {
    netuid: 75,
    oneline: 'Decentralized S3-equivalent persistent storage for the Bittensor stack.',
    keyMetric: '~$41.3M α-market cap (late March 2026)',
    recentNews: 'Posted +115% 30-day α-price gain through the late-March 2026 ecosystem rally; increasingly positioned as Bittensor\'s sovereign-cloud storage layer for agent and dataset workloads.',
    bio: 'Hippius is Bittensor\'s decentralized storage layer, the equivalent of S3 for a network that, until early 2025, had no real way to persist data across workloads. Miners commit storage capacity in NVMe and HDD tiers, validators run periodic challenge-response audits (interactive proof-of-storage checks plus random read sampling on committed shards) and rank by uptime, retrieval latency, and verified capacity. All usage and payment is recorded on-chain, which is the regulated-buyer pitch, every read and write produces an auditable receipt. The subnet was introduced in March 2025 as the "missing piece" for dApps that needed real persistence, and through 2026 it has become the default storage backend for several other subnets including agent runtimes on SN39 and dataset snapshots from SN13. α-market cap reached approximately $41.3M in late March 2026 with a 115% 30-day move on the back of the broader subnet rally and a new sovereign-cloud positioning campaign. The project benchmarks against Filecoin and Arweave on decentralized storage, and against Cloudflare R2 and Backblaze B2 on price. Find it at hippius.com.'
  },

  // RANK 19
  {
    netuid: 10,
    oneline: 'AI-driven DeFi yield optimization across lending pools.',
    keyMetric: '$125M+ in allocated deposits across Sturdy aggregators',
    recentNews: 'Sturdy partnered with Morpho on a joint AI-optimized lending vault in early 2026, gluing SN10 strategies to a top-three lending protocol.',
    bio: 'Sturdy is the cleanest revenue-bearing DeFi subnet: miners submit yield-optimization strategies that allocate USDC and ETH across whitelisted lending pools (Aave, Compound, Morpho), validators score submissions against live PnL with a continuous backtest harness plus rolling out-of-sample checks, and the top-ranked strategy is the one Sturdy\'s aggregator actually executes on-chain. The product feeds a real Sturdy vault on Ethereum mainnet, which by 2026 had over $125M in allocated deposits, the rare case on Bittensor where dTAO emission and real client capital flow through the same scoring pipeline and miners are paid both in α and indirectly through fee splits. Q1 2026 milestone: a partnership with Morpho on a co-branded AI-optimized lending vault, plus the Gauntlet integration that adds risk-adjusted scoring (factor decomposition, drawdown discipline, liquidity stress tests). Competes against Yearn, Sommelier, and Gauntlet itself on the strategy side; against single-protocol vaults on the user-acquisition side. Emission share sits in the low single digits but external TVL is the real metric, and it is rising. Find it at sturdy.finance; repo at Sturdy-Subnet/sturdy-subnet.'
  },

  // RANK 20, Bitmind actually runs on SN34, not SN24 as the seed file
  // shows; we keep the SN34 entry consistent with the live network.
  {
    netuid: 34,
    oneline: 'Self-evolving deepfake detection in a generator-detector adversarial loop.',
    keyMetric: '~95% detection accuracy on standardized benchmarks',
    recentNews: 'GAS (Generative Adversarial Subnet) architecture reframes the subnet as a continuous detector-vs-generator loop, hardening detection against new synthesis models.',
    bio: 'BitMind runs the generative-adversarial economy: detector miners train classifiers that flag AI-synthesized images, video, and audio; generator miners produce new synthetic samples designed to slip past current detectors; validators score the resulting battle and pay both sides asymmetrically based on how much each side moves the joint accuracy frontier. The architecture, which BitMind brands the Generative Adversarial Subnet (GAS), is structurally a moving-target defense that should harden against each new image, video, and audio synthesis model that ships externally, and it has the rare property of getting stronger as the generative side of the market gets stronger. Reported accuracy sits around 95% on standardized benchmarks, with sub-second response latency and SOC 2 compliance, both of which are unusual for a Bittensor subnet and aimed squarely at insurance, content moderation, regulated media, and election-integrity buyers. Q1 2026 saw expansion into a hosted detection app, an ElizaOS plugin for agent-stack integration, and an API contract pipeline. Competes against Reality Defender, Hive Moderation, and Microsoft\'s content credentials stack. Find it at bitmind.ai; repo at BitMind-AI/bitmind-subnet.'
  },

  // RANK 21
  {
    netuid: 9,
    oneline: 'Cooperative decentralized LLM pretraining with IOTA orchestration.',
    keyMetric: '157 active miners, 1B-parameter training run in progress',
    recentNews: 'IOTA (Incentivised Orchestrated Training Architecture) shipped as the formal replacement for SN9\'s isolated-miner competition, allowing data-parallel and pipeline-parallel cooperative training on heterogeneous hardware.',
    bio: 'IOTA is what SN9 became after Macrocosmos rebuilt it from the ground up. The old SN9 was a from-scratch pretraining bake-off where isolated miners each trained their own base model and the lowest-loss model won, a system that hit a hardware ceiling around 14B parameters and rewarded duplicated work. IOTA (Incentivised Orchestrated Training Architecture) turns the same set of miners into a single cooperating data- and pipeline-parallel training cluster, coordinating across heterogeneous and unreliable hardware in a trustless setting. Validators verify gradient contributions on-chain and assign credit using a continuous-loss-improvement signal, with built-in tolerance for stragglers and dropouts that would kill a classical HPC run. The current version 0.4.2-tah run is targeting 1 billion parameters with 157 active miners and roughly 1.95B tokens processed against a 42B-token target. Strategically, IOTA is the sibling system to Templar/Teutonic, same wide-internet-training problem, two different attacks, both now in production on adjacent subnets. Find it at iota.macrocosmos.ai; repo at macrocosm-os/IOTA.'
  },

  // RANK 22
  {
    netuid: 25,
    oneline: 'Decentralized protein folding and molecular dynamics simulation.',
    keyMetric: 'Energy-minimization receipts feeding Rowan\'s NNP pipeline',
    recentNews: 'Macrocosmos and Rowan partnered in late 2025 / early 2026 to use Mainframe-generated simulations as training data for next-generation neural network potentials.',
    bio: 'Mainframe (formerly Protein Folding) is Macrocosmos\' DeSci subnet and the first decentralized science workload on Bittensor. Validators pull protein structures from the RCSB Protein Data Bank, attach starting configurations and environment parameters (temperature, ionic strength, solvation), and broadcast simulation jobs to miners. Miners run molecular dynamics simulations to find low-energy conformations; validators re-score by computing the final-state energy on a canonical force field and rank miners on lowest delivered energy plus reproducibility against control checkpoints. Outputs feed directly into pharmaceutical and academic pipelines, including a Rowan partnership announced in late 2025 / early 2026 where Mainframe-generated simulations are used as training data for next-generation neural network potentials (NNPs), an explicit attempt to chain decentralized HPC into a commercial ML product line. The TAM Macrocosmos points at is the ~$2.6B/year protein-engineering market and the implicit AlphaFold-scale opportunity beyond it. Sister subnet to SN1 Apex, SN9 IOTA, and SN13 Data Universe in the broader Macrocosmos cluster. Repo at macrocosm-os/folding; folding API documented at docs.macrocosmos.ai.'
  },

  // RANK 23, Note: seed file has SN18 as "Cortex.t". That ownership
  // changed, the slot was sold by mogmachine and fish_datura to the
  // Zeus project (Ørpheus AI) in early 2025 and Zeus is now SN18.
  {
    netuid: 18,
    oneline: 'Decentralized climate and weather forecasting graded on ERA5.',
    keyMetric: 'ERA5 reanalysis-graded forecasts at hourly resolution',
    recentNews: 'Expanded beyond 2-meter surface temperature into multi-variable forecasting on the full Copernicus ERA5 stack through Q2 2026, taking the subnet head-to-head with GraphCast.',
    bio: 'Zeus is Bittensor\'s climate-forecasting subnet, sitting in the SN18 slot since Ørpheus AI bought it from the prior Cortex.t operator (mogmachine and fish_datura) in early 2025. Miners produce hourly forecasts of environmental variables, initially 2-meter surface temperature, increasingly the broader Copernicus ERA5 variable set including precipitation, geopotential, and humidity, at specified geo-coordinates and lead times. Validators wait the relevant forecast horizon to elapse, then score predictions against ERA5 reanalysis ground truth using standard meteorological skill scores (RMSE, ACC, CRPS) and assign rewards accordingly. The dataset spine is Copernicus, the EU\'s open Earth-observation programme, which gives Zeus access to the largest global environmental dataset in existence: hourly measurements from 1940 through present across hundreds of variables. The competitive pitch is against ECMWF\'s IFS, NOAA\'s GFS, and the GraphCast/Pangu/Aurora-class neural weather models from DeepMind, Huawei, and Microsoft, Zeus is the open, permissionless answer to those. Find it at zeussubnet.com; repo at Orpheus-AI/Zeus.'
  },

  // RANK 24
  {
    netuid: 6,
    oneline: 'Continuous finetuning competition on rotating synthetic benchmarks.',
    keyMetric: 'First continuous fine-tuning benchmark on Bittensor',
    recentNews: 'Now operating under the Numinous brand on SN6, with a continuously-regenerated synthetic eval stream that defeats classic leaderboard overfitting patterns.',
    bio: 'Nous (now operating under the Numinous brand on SN6) is Nous Research\'s on-chain finetuning competition: miners submit adapter weights or merged checkpoints against a rotating benchmark suite, validators score on a held-out eval split that refreshes daily from a synthetic-data stream, and the leaderboard publishes openly. The synthetic-data refresh is the architectural distinguisher, it means miners cannot overfit to a static eval, because the eval set itself is regenerated each cycle from new synthetic prompts, defeating the leaderboard-gaming pattern that has plagued open benchmarks elsewhere. Nous Research, the team running it, is one of the more credible open-model labs outside the major frontier shops (Hermes, Capybara, DeepHermes series, the Forge fine-tuning toolkit), which gives SN6 unusual model-quality credibility for a pure-emission player. The competition format also means SN6 acts as a continuous discovery engine for new fine-tuning recipes, since the rotating eval forces miners to generalize rather than memorize. Emission share is mid-pack but the brand and developer mindshare are outsized for the τ flow. Repo at NousResearch/finetuning-subnet.'
  },

  // RANK 25
  {
    netuid: 2,
    oneline: 'Zero-knowledge verifiable inference proofs at production scale.',
    keyMetric: '300M+ ZK proofs generated by Q1 2026',
    recentNews: 'DSperse model-slicing technique scaled past 300 million generated ZK proofs in Q1 2026, reportedly the largest decentralized zkML proving cluster operating anywhere.',
    bio: 'DSperse, the SN2 product from Inference Labs, which previously ran Omron, is the zkML proving layer of Bittensor. The technical trick is model slicing: large neural networks are analyzed and partitioned into sub-models small enough to compile into zero-knowledge circuits, then proofs are generated per slice and chained together. Miners run prover backends and produce ZK receipts for end-user queries routed through the subnet; validators check proof validity and rank on throughput and cost. As of Q1 2026 the subnet had generated over 300 million proofs, Inference Labs claims this is the largest decentralized zkML proving cluster anywhere in production. The buyer pitch is for regulated AI use cases where outputs need to be provably valid without revealing model weights or input data: insurance, finance, healthcare, public-sector AI. Competes against EZKL, Giza, and Modulus Labs on the technical layer. Repo at inference-labs-inc/subnet-2.'
  },

]);

/** Convenience lookup by netuid. */
export const bioById = Object.freeze(
  Object.fromEntries(SUBNET_BIOS.map(b => [b.netuid, b]))
);
