/* =================================================================
   SUBNET MAGAZINE — ARTICLES
   -----------------------------------------------------------------
   Editorial / research pieces published by Subneτ Magazine and
   featured partners. Each entry carries metadata that drives the
   article-card layout on /articles.html. Bodies are PDFs hosted
   under projects/subnet-magazine-v2/articles/ so the site is
   self-contained.

   Add a new article by appending to ARTICLES; no view changes
   needed.
   ================================================================= */

/**
 * @typedef {Object} Article
 * @prop {string}   id
 * @prop {string}   title
 * @prop {string=}  kicker        small caption above the title
 * @prop {string[]} authors
 * @prop {string}   date          ISO YYYY-MM-DD
 * @prop {string}   issue         'Issue 014 — The Subnet Economy' etc.
 * @prop {string}   category      'reporting' | 'profile' | 'op-ed' | 'fund-letter' | 'primer' | 'interview'
 * @prop {string}   tagline       one-line description used as card subtitle
 * @prop {string[]} abstract      two paragraphs (HTML-safe plain text)
 * @prop {string[]} tags
 * @prop {string=}  subnet        netuid if the article is subnet-scoped
 * @prop {string=}  pdf           relative path (omit for externally hosted pieces)
 * @prop {string=}  externalUrl   off-site URL (X interviews, podcasts, etc.)
 * @prop {number}   readMin       estimated minutes
 * @prop {string=}  accent        accent color override (hex)
 */

/** @type {readonly Article[]} */
export const ARTICLES = Object.freeze([
  {
    id: 'alphanomics-sn75-hippius',
    title: 'Alphanomics: A new incentive model by SN75 Hippius',
    kicker: 'SUBNET PROFILE',
    authors: ['Subneτ Magazine'],
    date: '2025-09-27',
    issue: 'Issue 011 — Storage on chain',
    category: 'profile',
    tagline: 'A close read of Hippius, the storage subnet quietly pricing itself 2,386× cheaper than AWS, Google Cloud, Azure, and Filecoin.',
    abstract: [
      'Subnet 75, Hippius, is a globally distributed, transparent, decentralized cloud storage and virtual machine network — and currently the only successful storage-focused subnet in the Bittensor ecosystem. Priced against centralized competitors, Hippius is roughly 2,386× cheaper, positioning it to compete in a continuously growing $900 billion industry.',
      'Hippius integrates IPFS directly into its subnet protocol, encrypts user data end-to-end with AES-256 on the client device, and distributes the chunks across its global peer-to-peer network. The article walks through how the network secures and distributes data, why a smart-contract-pegged alpha token matters for institutional adoption, and what storage on-chain looks like when it stops being a meme and starts being a market.',
    ],
    tags: ['SN75', 'Hippius', 'storage', 'IPFS', 'AES-256', 'alpha-token'],
    subnet: '75',
    pdf: 'articles/alphanomics-sn75-hippius.pdf',
    readMin: 12,
    accent: '#FF6B7A',
  },
  {
    id: 'stillcore-capital-decentralized-ai',
    title: 'Stillcore Capital · The first U.S. liquid venture fund for decentralized AI',
    kicker: 'FUND LETTER',
    authors: ['Stillcore Capital'],
    date: '2026-01-15',
    issue: 'Issue 014 — The Subnet Economy',
    category: 'fund-letter',
    subnet: '1',
    tagline: '“We believe decentralized AI is where decentralized finance was in 2016. Bitcoin decentralized money. Ethereum decentralized finance. Bittensor is decentralizing intelligence.”',
    abstract: [
      'Stillcore is a U.S. fund providing institutional-grade exposure to decentralized AI, with an initial focus on Bittensor (TAO). The fund acquires and stakes TAO, earns protocol yield, and invests in high-conviction subnet operators. No wallets, no custody, no staking complexity for LPs.',
      'The thesis: two exponential forces are converging. Open-source AI is closing the gap with closed labs (DeepSeek, Llama, Qwen, Yi). Blockchain solves trustless coordination at scale (Bitcoin, Ethereum). Bittensor sits at the intersection — a global marketplace and internet of intelligence — at what Stillcore argues is the inflection point. The deck covers the partnership (Rob Greer, Mark Jeffrey, Jason Calacanis), the fund structure, the supply/demand catalysts, and the case for treating this as crypto\'s iPhone moment.',
    ],
    tags: ['Bittensor', 'fund', 'TAO', 'institutional', 'decentralized-AI', 'macro'],
    pdf: 'articles/stillcore-capital-fund-overview.pdf',
    readMin: 18,
    accent: '#FF1E3C',
  },
  {
    id: 'stillcore-mark-jeffrey-interview',
    title: 'Subneτ Magazine Interviews Stillcore Capital’s Mark Jeffrey',
    kicker: 'INTERVIEW',
    authors: ['Subneτ Magazine'],
    date: '2026-01-08',
    issue: 'Issue 013 — The capital desk',
    category: 'reporting',
    subnet: '64',
    tagline: 'Serial entrepreneur Mark Jeffrey on why he launched a dedicated Bittensor 506(c) fund, the three-pillar strategy, custody, the halving, and the duty of care crypto keeps forgetting.',
    abstract: [
      'Mark Jeffrey — serial founder, early-internet and early-Bitcoin pioneer, and host of Hash Rate — sits down with Subneτ Magazine to explain Stillcore Capital, his new Bittensor-focused fund built with partners Rob Greer and Jason Calacanis. He recounts arriving at Bittensor the way he arrived at the web in 1995 and Ethereum in 2016: reading everything, talking to everyone, and recognizing the "third great ecosystem" early.',
      'The conversation covers Stillcore\'s three-pillar strategy — a staked TAO reserve, subnet investing, and optional subnet creation — alongside institutional-grade custody with BitGo, a conservative line on validator selection, and a hard rule against rehypothecation after watching Genesis and FTX. Jeffrey makes the case that most institutional investors want fiat-in, fiat-out exposure without managing Ledger wallets, and frames this as Bittensor\'s "magical," pre-mainstream moment.',
    ],
    tags: ['Stillcore', 'Mark Jeffrey', 'fund', 'TAO', 'interview', 'institutional'],
    pdf: 'articles/stillcore-mark-jeffrey-interview.pdf',
    readMin: 16,
    accent: '#FF1E3C',
  },
  {
    id: 'open-letter-what-is-bittensor',
    title: 'What is Bittensor? An Open Letter and Reflection',
    kicker: 'OPEN LETTER',
    authors: ['Laron Campbell'],
    date: '2025-09-25',
    issue: 'Issue 008 — First principles',
    category: 'op-ed',
    subnet: '1',
    tagline: 'A reflection on how to articulate Bittensor — "The Great Mediator" — and the case for incentivized learning as machine learning\'s fourth paradigm.',
    abstract: [
      'When you ask five people to define Bittensor, you get ten answers. This open letter gathers how Barry Silbert, Const, Joseph Jacks, Mark Jeffrey and others frame the network, then offers the author\'s own synthesis: Bittensor as The Great Mediator — the meeting point of machine intelligence, blockchain, incentivization, open-source software, global compute, science and sound tokenomics.',
      'Its central argument is that Bittensor pioneers a fourth paradigm in machine learning. After supervised, unsupervised and reinforcement learning comes "incentivized learning" — blockchain-based rewards coordinating global, peer-to-peer contributions so that individual optimization adds up to collective intelligence. Participants mine intelligence itself, turning machine learning into a commoditized global resource.',
    ],
    tags: ['Bittensor', 'philosophy', 'incentivized-learning', 'fourth-paradigm', 'open-letter'],
    pdf: 'articles/open-letter-what-is-bittensor.pdf',
    readMin: 6,
    accent: '#FF1E3C',
  },
  {
    id: 'inaccessibility-problem-bittensor',
    title: 'The Inaccessibility Problem of the Bittensor Ecosystem',
    kicker: 'OP-ED',
    authors: ['Laron Campbell'],
    date: '2025-09-22',
    issue: 'Issue 007 — The accessibility gap',
    category: 'op-ed',
    subnet: '18',
    tagline: 'Why Bittensor\'s habit of writing only for developers locks out retail — and what subnets must do to compete in the attention economy.',
    abstract: [
      'Bittensor has the strongest fundamentals in the space, but its biggest self-inflicted wound is communication. Founders overcomplicate updates, mission statements and whitepapers, speaking only to developers and locking out retail "normies" who are also potential users and investors. The piece argues that writing for retail would do more for a project than writing for a handful of experts — the institutional-adoption excuse doesn\'t hold when Solana and Ethereum already have far greater institutional presence.',
      'It points to a developer culture unfamiliar with mainstream crypto psychology, a shortage of user-friendly wallets, and Discords that function as technical channels rather than communities. The remedy: subnets should pitch themselves externally to the niches they aim to disrupt, prioritize retail onboarding with videos and tutorials, and honor the open-source, "great equalizer" ethos crypto was founded on.',
    ],
    tags: ['Bittensor', 'communication', 'retail', 'community', 'op-ed', 'marketing'],
    pdf: 'articles/inaccessibility-problem-bittensor.pdf',
    readMin: 7,
    accent: '#FF1E3C',
  },
  {
    id: 'bittensor-deregistration-101',
    title: 'Bittensor Deregistration 101',
    kicker: 'PRIMER',
    authors: ['Shifa', 'Laron Campbell'],
    date: '2025-09-16',
    issue: 'Issue 005 — Network mechanics',
    category: 'primer',
    subnet: '21',
    tagline: 'A plain-English walkthrough of subnet deregistration — the on-chain mechanism that prunes inactive subnets and redirects emissions to the strongest.',
    abstract: [
      'Subnet deregistration, deployed September 16, 2025, prunes inactive subnets so the network stays competitive. With the ecosystem capped at 128 subnets and an estimated 30% partially or fully inactive, deregistration releases the "dead weight": it removes low-contribution subnets, refunds locked TAO to creators and alpha holders, and funnels more emissions to surviving subnets.',
      'The primer defines the concepts that govern it — the immunity period, NAV (staked TAO versus alpha market cap), ADR (the inverse of NAV), and EMA (a performance score) — then walks the step-by-step process: eligibility check, the trigger when a new subnet registers, and the refunds and dissolution that follow. The net effect is a market-driven cleanup where only thriving projects survive and alpha holders can expect higher subnet quality.',
    ],
    tags: ['Bittensor', 'deregistration', 'dTAO', 'emissions', 'NAV', 'primer'],
    pdf: 'articles/bittensor-deregistration-101.pdf',
    readMin: 9,
    accent: '#FF1E3C',
  },
  {
    id: 'metanova-desci-deai-medicine',
    title: 'METANOVA: DeSci and DeAI Pave the Way for Medicine’s New Frontier',
    kicker: 'SUBNET PROFILE',
    authors: ['Shifa', 'Laron Campbell'],
    date: '2025-09-17',
    issue: 'Issue 006 — Decentralized science',
    category: 'profile',
    tagline: 'How Subnet 68, METANOVA, turns Bittensor into an "in silico" laboratory — screening molecular libraries for viable drug candidates in days instead of decades.',
    abstract: [
      'METANOVA (Subnet 68), launched March 1, 2025 by Metanova Labs, is a crypto-native biotech subnet that uses decentralized AI to accelerate drug discovery. Where conventional pipelines take a decade, cost billions and succeed for roughly 1 in 10,000 candidates, METANOVA screens molecular libraries for high-affinity, synthesizable small molecules in days — distributing the compute across Bittensor\'s miners and validators under a merit-based incentive design.',
      'The profile traces its evolution: a V1 built on the PSICHIC binding-affinity model, the April 2025 "Shannon upgrade" adding diversity scoring and an adversarial framework, a model-agnostic V2, and August 2025 Phase I/II updates integrating MIT and Recursion Pharma\'s Boltz-2. With the AI-in-drug-discovery market projected to grow about 29.7% annually through 2030, the piece argues METANOVA is a blueprint for a faster, cheaper, more transparent future for medicine.',
    ],
    tags: ['SN68', 'METANOVA', 'DeSci', 'drug-discovery', 'bioinformatics', 'PSICHIC'],
    subnet: '68',
    pdf: 'articles/metanova-desci-deai-medicine.pdf',
    readMin: 10,
    accent: '#FF6B7A',
  },
  {
    id: 'metanova-interview-bazo-penna',
    title: 'Subneτ Magazine Interviews Metanova Labs’ Micaela Bazo and Dr. Pedro Penna',
    kicker: 'INTERVIEW',
    authors: ['Subneτ Magazine'],
    date: '2025-10-02',
    issue: 'Issue 008 — The biotech desk',
    category: 'reporting',
    subnet: '68',
    tagline: 'The CEO and CSO of Metanova Labs on building the first decentralized drug-screening platform in the world — and why a 65-billion-molecule database belongs on Bittensor.',
    abstract: [
      'Metanova Labs operates Bittensor’s Subnet 68 — NOVA — a decentralized virtual-screening platform whose miners compete to identify the most promising small molecules from a database of 65 billion. Founders Micaela Bazo (CEO, ex-Google strategy partner, Lima/Peru) and Dr. Pedro Penna (CSO, PhD Biosystems UFABC, ex-biotech founder) sit down with Subneτ Magazine to explain the thesis: tokenized incentives can coordinate the cost-neutral compute and the cross-disciplinary labour drug discovery has historically lacked.',
      'The conversation walks through the architecture (PSICHIC binding-affinity scoring, the Boltz-2 integration, the model-agnostic V2 framework), the team behind the science, and why a crypto-native platform is the right vehicle for an industry whose incumbents protect proprietary data over shared discovery. Bazo frames decentralized science as the missing layer between emerging-market scientific talent and global capital; Penna describes the merit-based merit-rewarded competition NOVA stages every block.',
    ],
    tags: ['SN68', 'METANOVA', 'NOVA', 'interview', 'DeSci', 'drug-discovery'],
    pdf: 'articles/metanova-interview-bazo-penna.pdf',
    readMin: 14,
    accent: '#FF6B7A',
  },
  {
    id: 'minotaur-sn112-dex-aggregator',
    title: 'minotaur: DEX aggregator launches on Subnet 112',
    kicker: 'SUBNET PROFILE',
    authors: ['Subneτ Magazine'],
    date: '2025-09-21',
    issue: 'Issue 007 — DeFi on Bittensor',
    category: 'profile',
    subnet: '112',
    tagline: 'A first read on minotaur — Bittensor’s new on-chain DEX aggregator and swap-intent solver, competing directly with 1inch and Uniswap on a winner-takes-most settlement model.',
    abstract: [
      'Subnet 112 went live this week with minotaur, a decentralized exchange aggregator and swap-intent solver engine. The protocol shape is unusual for Bittensor: users (or dApps) submit signed swap intents — “swap 100 USDC for at least 0.05 ETH by deadline T” — that validators batch into short epochs. Miners then race to compute the optimal route across AMMs, RFQ systems and aggregator inventories; the top bid proceeds in a winner-takes-most settlement, secured by validator quorum attestation.',
      'No product has shipped to end users yet — the GitHub is sparse and the validator code is only operational as of this week — but the architecture commits the team to MEV resistance, transparent leaderboards and a competitive solver economy that pays uptime, fill-rate and revert-rate. The piece walks through the workflow stage by stage, surveys minotaur’s direct subnet competition (SN10 TaoFi, SN35 Cartha) and notes the post-activation low-liquidity warning the team itself flagged on launch day.',
    ],
    tags: ['SN112', 'minotaur', 'DEX', 'swap-intent', 'MEV', 'DeFi'],
    pdf: 'articles/minotaur-sn112-dex-aggregator.pdf',
    readMin: 9,
    accent: '#FF1E3C',
  },
  {
    id: 'polaris-sn49-deregistration-case-study',
    title: 'Can a subnet save itself from deregistration? A case study on Polaris Cloud AI',
    kicker: 'CASE STUDY',
    authors: ['Subneτ Magazine'],
    date: '2025-09-19',
    issue: 'Issue 007 — DePIN under pressure',
    category: 'reporting',
    subnet: '49',
    tagline: 'Polaris promised to be the “OpenAI of Africa” and the “AirBnB of GPUs.” Almost a year in, the alpha is bleeding, miners are walking, and the subnet owner calls it a tipping point.',
    abstract: [
      'Polaris (Subnet 49, registered October 2024) is one of several Bittensor subnets coordinating decentralized GPU supply against AI-workload demand — alongside Chutes, Lium and TargonCompute. The promise: on-chain coordination of compute contributions, with an intuitive Node Manager UI lowering the barrier to onboarding. The reality, after eight months: lack-lustre updates, a string of post-rollout security exploits, frequent multi-week mining pauses, ADR collapsing toward 1, and a small validator set publicly venting in Discord.',
      'This piece is a sympathetic but unflinching read on a struggling subnet. We walk through the team’s own framing of the moment as a tipping point, the gap between promised features and shipped product, the lack of public documentation or whitepaper, and the “performance-based reward system” that requires a minimum 0.03 Proof-of-Work to participate. Subnet owner Fred says the project is at the cusp of either a real growth phase or complete failure — Polaris’ next quarter answers which.',
    ],
    tags: ['SN49', 'Polaris', 'GPU', 'DePIN', 'deregistration', 'compute', 'case-study'],
    pdf: 'articles/polaris-sn49-deregistration-case-study.pdf',
    readMin: 10,
    accent: '#FF7A88',
  },
  {
    id: 'mantis-sn123-financial-forecasting',
    title: 'SN123: MANTIS — collective intelligence for financial forecasting',
    kicker: 'SUBNET PROFILE',
    authors: ['Subneτ Magazine'],
    date: '2025-08-30',
    issue: 'Issue 005 — The forecasting desk',
    category: 'profile',
    subnet: '123',
    tagline: 'A first look at MANTIS — Bittensor’s incentivized 1-hour return forecaster, with time-lock encryption, salience-weighted rewards, and a roadmap to forex and beyond.',
    abstract: [
      'MANTIS (Subnet 123) is an incentivized financial forecasting market: miners submit encrypted predictions about 1-hour future price movements; the validator decrypts the batch only after the prediction window closes, then trains an XGBoost model on the combined miner data and uses permutation importance to score how much each miner’s input improved the aggregate forecast. Miners with high salience earn high reward weights — a pure merit-rewarded competition with cryptographic protection against front-running.',
      'Founded by @Barbarian7676, a Costa-Rica-based developer who mined Ethereum and then Bittensor before launching SN123 in June 2025, MANTIS forecasts BTC/USD and has expanded into multiple forex pairs with above-average accuracy. The piece walks through the modular architecture (validator, cycle, comms, storage, model), the V2 migration to HPKE + public timelock that allows instant on-chain decryption, and the upcoming auction feature whose revenue will be burnt to support the alpha price.',
    ],
    tags: ['SN123', 'MANTIS', 'forecasting', 'XGBoost', 'time-lock', 'forex', 'BTC/USD'],
    pdf: 'articles/mantis-sn123-financial-forecasting.pdf',
    readMin: 11,
    accent: '#FF1E3C',
  },
  {
    id: 'score-vision-sn44-overview',
    title: 'Subnet 44: An overview — Score Vision',
    kicker: 'SUBNET PROFILE',
    authors: ['Subneτ Magazine'],
    date: '2025-08-12',
    issue: 'Issue 004 — The vision desk',
    category: 'profile',
    subnet: '44',
    tagline: '“The optic nerve of AI.” Score Vision pivots Subnet 44 from match-score prediction to a decentralized computer-vision pipeline for football, with Paris FC as the early enterprise customer.',
    abstract: [
      'Subnet 44 (Score Foundation) is now Score Vision — a pivot from the team’s original Score Predict project (final-score forecasting across 12 leagues) into a full decentralized computer-vision framework using Game State Recognition (GSR) to analyse football matches frame-by-frame. The team — CTO Tim Kalic, CSO Nigel Grant, CEO Max Sebti — has rebranded with @outpacestudios and signed the Paris FC Business Club as an early customer.',
      'The economics are striking: traditional video annotation costs $10–55 per minute of footage; complex sports scenarios require up to 4 hours of human labelling per minute. A single professional football match generates 90+ minutes of footage, or roughly $1,000–$5,000 in manual annotation. Score Vision uses Bittensor’s incentive mechanism to crowd-source the same work at a fraction of cost. Miners deploy CV models to detect, track and annotate; validators verify via selective frame analysis and hybrid scoring; the long-term play is generic computer-vision applications across sports broadcasting, scouting, and beyond.',
    ],
    tags: ['SN44', 'Score Vision', 'computer-vision', 'GSR', 'football', 'Paris FC', 'sports'],
    pdf: 'articles/score-vision-sn44-overview.pdf',
    readMin: 9,
    accent: '#FF7A88',
  },
  {
    id: 'zeus-sn18-decentralized-climate-forecasting',
    title: 'Zeus — the future of decentralized climate forecasting',
    kicker: 'SUBNET PROFILE',
    authors: ['Subneτ Magazine'],
    date: '2025-08-05',
    issue: 'Issue 003 — The science desk',
    category: 'profile',
    subnet: '18',
    tagline: 'Subnet 18 takes a fundamentally different path on weather modelling — small location-specific models outperforming centralised SOTA by ~40% on RMSE, with miners competing region by region.',
    abstract: [
      'Zeus operates Bittensor’s Subnet 18 with three actors. Miners run localised ML models for specific geographies and timeframes; the best is named the Best Recent Performer (BRP), through which the validator proxy routes forecasts. Validators evaluate miner accuracy against ERA5 reanalysis data from the @CopernicusECMWF Climate Change Service and assign difficulty-adjusted reward. The Subnet Owner oversees governance and validates with heavier models like Aurora (Microsoft Research).',
      'Where Gaia AI and others scale a single global model (Aurora-style), Zeus splits the problem into smaller location-specific tasks. The advantage is concrete: per the team’s research paper, BRP miners hit RMSE of 1.05K — a 39.8% improvement over the centralised baseline of 1.74K. The best 2-day windspeed forecast achieved 0.89 average RMSE, 45.6% better than baseline. Launched February 2025 on testnet, mainnet March 24 2025; led by co-founders @wouterhar and @0xtravvv, with miners outperforming SOTA by June 5. Difficulty-weighted RMSE means stable areas pay less than accurate predictions in complex regions — pricing the prediction problem honestly.',
    ],
    tags: ['SN18', 'Zeus', 'climate', 'weather', 'forecasting', 'ERA5', 'RMSE', 'science'],
    pdf: 'articles/zeus-sn18-decentralized-climate-forecasting.pdf',
    readMin: 8,
    accent: '#FF1E3C',
  },
  {
    id: 'ninety-days-tested-bittensor-thesis',
    title: 'Ninety days that tested the Bittensor thesis',
    kicker: 'EDITORIAL · COVER STORY',
    authors: ['Subneτ Magazine'],
    date: '2026-05-12',
    issue: 'Issue 016 — The Q2 retrospective',
    category: 'reporting',
    tagline: 'Between 12 February and 12 May 2026, Bittensor produced the most significant decentralized-training milestone to date, lost the team that produced it, watched community miners rebuild three top-emission subnets without coordination, and ships a governance upgrade to mainnet on May 13. The Q2 retrospective.',
    abstract: [
      'February 12: Jacob Steeves (@const_reborn) stepped down as CEO of the Opentensor Foundation; co-founder Ala Shaabana (@shibshib89) stepped down as COO at the same time. The framing — "headless protocol" — was a deliberate move to migrate governance authority off the Foundation balance sheet and onto the chain. The Triumvirate structure had been the single most consistent criticism levelled at the network since mainnet launched January 2021. The February resignation was the first formal step toward closing that concentration.',
      'March 10: Subnet 3, operated by the Covenant AI team under the Templar branding (@tplr_ai), announced completion of Covenant-72B — a 72-billion-parameter LLM trained from scratch on ~1.1T tokens of English text across 70+ independent peer nodes (each 8 × B200 GPUs), coordinated by a layer called Gauntlet running on SN3, using the SparseLoCo communication-efficient optimizer. MMLU 67.1 zero-shot, beating Llama-2-70B and LLM360-K2. Apache 2.0 weights. Jack Clark (@AnthropicAI) cited it within ten days. Jensen Huang (@nvidia) discussed it on the All-In Podcast at @chamath\'s prompt. The announcement post took 1.7M views; SN3\'s α rose 194% in seven days; TAO itself rallied ~90% across the March cycle, ~$170 → $337 at peak. The governance upgrade ships to mainnet May 13. The retrospective.',
    ],
    tags: ['Q2-2026', 'governance', 'Templar', 'Covenant-72B', 'leadership', 'thesis'],
    pdf: 'articles/ninety-days-tested-bittensor-thesis.pdf',
    readMin: 22,
    accent: '#FF1E3C',
  },

  /* X-hosted interviews. The site renders a card with the kicker
     "VIDEO INTERVIEW · X" and routes the click to externalUrl rather
     than opening a local PDF. Titles + interviewees can be filled in
     when the X auth wall lifts; placeholders use the tweet date. */
  {
    id: 'sm-x-interview-1986979679270535399',
    title: 'Subneτ Magazine interview · @subnetmagazine on X',
    kicker: 'VIDEO INTERVIEW · X',
    authors: ['Subneτ Magazine'],
    date: '2025-11-08',
    issue: 'Issue 012 — The interview desk',
    category: 'interview',
    tagline: 'A long-form Subneτ Magazine interview, hosted on X. Tap to open the full conversation.',
    abstract: [
      'A Subneτ Magazine long-form video interview, published on @subnetmagazine\'s X account on 8 November 2025. Tap the card to open the full conversation in a new tab.',
      'Interview metadata is being filled in as the X API permits cross-site fetch; the canonical record lives at the X URL linked from this card.',
    ],
    tags: ['interview', 'X', 'video'],
    externalUrl: 'https://x.com/subnetmagazine/status/1986979679270535399',
    readMin: 30,
    accent: '#FF7A88',
  },
  {
    id: 'sm-x-interview-1978463352176214116',
    title: 'Subneτ Magazine interview · @subnetmagazine on X',
    kicker: 'VIDEO INTERVIEW · X',
    authors: ['Subneτ Magazine'],
    date: '2025-10-15',
    issue: 'Issue 011 — The interview desk',
    category: 'interview',
    tagline: 'A long-form Subneτ Magazine interview, hosted on X. Tap to open the full conversation.',
    abstract: [
      'A Subneτ Magazine long-form video interview, published on @subnetmagazine\'s X account on 15 October 2025. Tap the card to open the full conversation in a new tab.',
      'Interview metadata is being filled in as the X API permits cross-site fetch; the canonical record lives at the X URL linked from this card.',
    ],
    tags: ['interview', 'X', 'video'],
    externalUrl: 'https://x.com/subnetmagazine/status/1978463352176214116',
    readMin: 30,
    accent: '#FF7A88',
  },
  {
    id: 'sm-x-interview-1973226298508968337',
    title: 'Subneτ Magazine interview · @subnetmagazine on X',
    kicker: 'VIDEO INTERVIEW · X',
    authors: ['Subneτ Magazine'],
    date: '2025-09-30',
    issue: 'Issue 010 — The interview desk',
    category: 'interview',
    tagline: 'A long-form Subneτ Magazine interview, hosted on X. Tap to open the full conversation.',
    abstract: [
      'A Subneτ Magazine long-form video interview, published on @subnetmagazine\'s X account on 30 September 2025. Tap the card to open the full conversation in a new tab.',
      'Interview metadata is being filled in as the X API permits cross-site fetch; the canonical record lives at the X URL linked from this card.',
    ],
    tags: ['interview', 'X', 'video'],
    externalUrl: 'https://x.com/subnetmagazine/status/1973226298508968337',
    readMin: 30,
    accent: '#FF7A88',
  },
]);

/** Sort newest first. */
export function articlesByDate(){
  return ARTICLES.slice().sort((a, b) => (b.date < a.date ? -1 : 1));
}

/** Lookup by id. */
export function articleById(id){
  return ARTICLES.find(a => a.id === id) || null;
}
