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
]);

/** Sort newest first. */
export function articlesByDate(){
  return ARTICLES.slice().sort((a, b) => (b.date < a.date ? -1 : 1));
}

/** Lookup by id. */
export function articleById(id){
  return ARTICLES.find(a => a.id === id) || null;
}
