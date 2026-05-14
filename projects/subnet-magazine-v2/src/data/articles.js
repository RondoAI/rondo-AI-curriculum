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
 * @prop {string}   category      'reporting' | 'profile' | 'op-ed' | 'fund-letter' | 'primer'
 * @prop {string}   tagline       one-line description used as card subtitle
 * @prop {string[]} abstract      two paragraphs (HTML-safe plain text)
 * @prop {string[]} tags
 * @prop {string=}  subnet        netuid if the article is subnet-scoped
 * @prop {string}   pdf           relative path
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
]);

/** Sort newest first. */
export function articlesByDate(){
  return ARTICLES.slice().sort((a, b) => (b.date < a.date ? -1 : 1));
}

/** Lookup by id. */
export function articleById(id){
  return ARTICLES.find(a => a.id === id) || null;
}
