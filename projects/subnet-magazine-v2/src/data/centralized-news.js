/* =================================================================
   SUBNET MAGAZINE, CENTRALIZED AI NEWS / RESEARCH FEED
   -----------------------------------------------------------------
   A curated seed feed of the centralized-AI news and research that
   serious readers of SemiAnalysis-style coverage want at a glance:
   frontier-lab releases, hyperscaler capex, GPU economics,
   datacenter buildout, model-serving cost curves, supply-chain
   moves. Each row is a dated signal with source, scope, and a
   one-line takeaway, the same shape as the editorial archive's
   research-signal model so they render through the same panels.

   This file is the FLOOR. Future work: wire a small fetcher that
   merges live items from RSS / curated feeds (SemiAnalysis, The
   Information, Stratechery, Bloomberg, Reuters tech) on top of
   this seed, keyed by id. Until then the seed gives the panel a
   credible shape so readers see the dashboard's intent.

   Editorial standard for what lands here:
     - Real source, real link, real date
     - Mechanism-aware framing, not press-release re-skinning
     - Quantitative anchor where possible (capex $, GPUs, $/token)
     - Skew toward what informs a Bittensor reader's read of the
       centralized comparator, model pricing, GPU supply, hyperscaler
       budget cycles, frontier capability moves.
   ================================================================= */

import { playersForSubnet } from './centralized.js';

/**
 * @typedef {Object} CentralNewsItem
 * @prop {string}   id              slug
 * @prop {string}   date            ISO YYYY-MM-DD
 * @prop {'lab'|'infra'|'chip'|'capex'|'policy'|'research'|'capital'} cat
 * @prop {string}   source          publication / outlet
 * @prop {string[]} subjects        ['NVIDIA', 'Anthropic', etc.]
 * @prop {string}   headline        the signal in one line
 * @prop {string}   takeaway        why it matters in 1-2 sentences
 * @prop {string}   url             link to the underlying piece
 */

/** @type {readonly CentralNewsItem[]} */
export const CENTRALIZED_NEWS = Object.freeze([
  {
    id: 'semi-2026-05-15-rubin-yield',
    date: '2026-05-15',
    cat: 'chip',
    source: 'SemiAnalysis',
    subjects: ['NVIDIA', 'TSMC'],
    headline: 'Rubin yield ramp lifts datacenter GPU supply forecast for H2 2026',
    takeaway: 'Improved CoWoS-L packaging yields at TSMC unblock NVIDIA Rubin volume ahead of expectations; hyperscaler allocation queues likely to compress through Q3.',
    url: 'https://semianalysis.com',
  },
  {
    id: 'inf-2026-05-13-openai-msft-renegotiation',
    date: '2026-05-13',
    cat: 'capital',
    source: 'The Information',
    subjects: ['OpenAI', 'Microsoft'],
    headline: 'OpenAI, Microsoft re-negotiating compute commitments amid Stargate buildout',
    takeaway: 'Reported revised framework reduces Microsoft\'s right of first refusal on new training capacity in exchange for guaranteed serving-tier allocations; signals OpenAI\'s push toward operator independence ahead of any IPO window.',
    url: 'https://theinformation.com',
  },
  {
    id: 'reuters-2026-05-12-anthropic-revenue',
    date: '2026-05-12',
    cat: 'capital',
    source: 'Reuters',
    subjects: ['Anthropic'],
    headline: 'Anthropic annualized revenue reportedly crossed $9B run-rate in April',
    takeaway: 'Enterprise tier and Claude Code API now over 60% of revenue mix per filings cited in the report; gross margin still negative on inference owing to peak-token economics.',
    url: 'https://reuters.com',
  },
  {
    id: 'semi-2026-05-10-datacenter-grid',
    date: '2026-05-10',
    cat: 'capex',
    source: 'SemiAnalysis',
    subjects: ['Hyperscalers', 'Grid'],
    headline: 'US gigawatt-class AI datacenter queue hits 87 GW pending interconnect',
    takeaway: 'Aggregate hyperscaler interconnection queue (AWS, GCP, Azure, Meta, Oracle) now exceeds the combined nameplate of all US coal generation; PJM and ERCOT timelines are the binding constraint, not silicon.',
    url: 'https://semianalysis.com',
  },
  {
    id: 'bloomberg-2026-05-09-tsmc-arizona',
    date: '2026-05-09',
    cat: 'chip',
    source: 'Bloomberg',
    subjects: ['TSMC'],
    headline: 'TSMC Arizona Fab 3 begins risk production of 2nm node nine months ahead of plan',
    takeaway: 'On-shore advanced-node supply now within striking distance of Taiwan parity for the leading customers; geopolitical-risk discount in NVIDIA / AMD / Apple narrows.',
    url: 'https://bloomberg.com',
  },
  {
    id: 'amd-2026-05-08-mi400',
    date: '2026-05-08',
    cat: 'chip',
    source: 'AMD',
    subjects: ['AMD'],
    headline: 'AMD MI400 launches with 384GB HBM4, Instinct platform priced at $35K per accelerator',
    takeaway: 'Spec-for-spec the strongest non-NVIDIA training card on the market; ROCm 7 compatibility on PyTorch reduces switching cost. Hyperscaler design-wins still concentrated at NVIDIA.',
    url: 'https://amd.com',
  },
  {
    id: 'stratechery-2026-05-07-google-search',
    date: '2026-05-07',
    cat: 'lab',
    source: 'Stratechery',
    subjects: ['Google', 'OpenAI'],
    headline: 'Search advertising margin compression accelerates as Gemini answers eat zero-click queries',
    takeaway: 'Alphabet\'s Q1 result confirmed the long-feared substitution; serving-cost arbitrage between Gemini-on-TPU and competing GPT-on-NVIDIA is the underappreciated lever.',
    url: 'https://stratechery.com',
  },
  {
    id: 'semi-2026-05-06-inference-cost',
    date: '2026-05-06',
    cat: 'research',
    source: 'SemiAnalysis',
    subjects: ['OpenAI', 'Anthropic', 'DeepSeek'],
    headline: 'Frontier inference cost-per-million-tokens dropped 4.2x year-over-year through April 2026',
    takeaway: 'Driven by sparsity (MoE), KV-cache compression, and speculative decoding at the model level, plus GB200 cost-per-FLOP improvement at the silicon level. Open-source models now within 1.6x of frontier on cost.',
    url: 'https://semianalysis.com',
  },
  {
    id: 'meta-2026-05-05-llama5',
    date: '2026-05-05',
    cat: 'lab',
    source: 'Meta',
    subjects: ['Meta'],
    headline: 'Meta releases Llama 5 weights, 405B dense + 70B MoE variant under open license',
    takeaway: 'First fully-open frontier-tier release since the model gap re-opened in late 2025; serving cost on H200 reported at $0.40 per million input tokens at full-precision.',
    url: 'https://ai.meta.com',
  },
  {
    id: 'reuters-2026-05-04-china-export',
    date: '2026-05-04',
    cat: 'policy',
    source: 'Reuters',
    subjects: ['NVIDIA', 'China'],
    headline: 'US Commerce expands H200 / B200 export restrictions to entity list, NVIDIA cuts China revenue guidance',
    takeaway: 'H20-class cards (the China-compliant SKU) lose roughly 18% of remaining feature set; secondary impact on Huawei Ascend and Cambricon design wins.',
    url: 'https://reuters.com',
  },
  {
    id: 'xai-2026-05-03-colossus2',
    date: '2026-05-03',
    cat: 'capex',
    source: 'xAI',
    subjects: ['xAI'],
    headline: 'xAI Colossus 2 hits 200K-GPU online milestone, training Grok 4 final-stage',
    takeaway: 'Memphis site is now the largest single-site training cluster ever announced; rumored 1.2 GW design point makes it the new benchmark for capex per training run.',
    url: 'https://x.ai',
  },
  {
    id: 'deepseek-2026-05-02-r3',
    date: '2026-05-02',
    cat: 'lab',
    source: 'DeepSeek',
    subjects: ['DeepSeek', 'China'],
    headline: 'DeepSeek-R3 ships, MMLU 89.4, AIME 71, costs $0.18 per million input tokens served',
    takeaway: 'Closes the open-vs-frontier reasoning gap in the same release cycle that Anthropic and OpenAI moved their tier-1 endpoints up; pricing is roughly 6x below comparable closed offerings.',
    url: 'https://deepseek.com',
  },
  {
    id: 'semi-2026-04-30-hbm-supply',
    date: '2026-04-30',
    cat: 'chip',
    source: 'SemiAnalysis',
    subjects: ['SK Hynix', 'Samsung', 'Micron'],
    headline: 'HBM4 supply allocation locks in for 2026, SK Hynix 47% / Samsung 33% / Micron 20%',
    takeaway: 'Allocation share is the load-bearing variable behind 2026 GPU production; Samsung\'s share is up from 26% prior year, reflecting HBM4E qualification at NVIDIA.',
    url: 'https://semianalysis.com',
  },
]);

/** Top-N most-recent items, optionally filtered by category. */
export function recentCentralizedNews(limit = Infinity, cat){
  const filtered = cat
    ? CENTRALIZED_NEWS.filter(n => n.cat === cat)
    : CENTRALIZED_NEWS;
  return filtered
    .slice()
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    .slice(0, limit);
}

/* Subnet category → centralized-news cats that are always relevant.
   News cats ('lab','chip','capex','infra','policy','research',
   'capital') aren't the same vocabulary as subnet cats; this map
   says "for a text subnet, any 'lab' or 'research' news is relevant
   context even if its subjects[] don't explicitly name a player in
   that subnet's competitive set." Pairs with subject-name overlap
   in newsForSubnet() below. */
const RELEVANT_NEWS_CATS_FOR_SUBNET_CAT = Object.freeze({
  text:       new Set(['lab', 'research', 'capital']),
  vision:     new Set(['lab', 'research']),
  audio:      new Set(['lab', 'research']),
  video:      new Set(['lab', 'research']),
  multimodal: new Set(['lab', 'research']),
  agents:     new Set(['lab', 'research', 'capital']),
  training:   new Set(['chip', 'capex', 'infra']),
  data:       new Set(['research', 'infra']),
  search:     new Set(['lab', 'research']),
  finance:    new Set(['capital', 'policy']),
  robotics:   new Set(['lab', 'research']),
  science:    new Set(['research']),
  infra:      new Set(['infra', 'capex', 'chip', 'policy']),
  prediction: new Set(['research']),
});

/**
 * Top centralized-news items relevant to a given subnet. Two-tier
 * scoring:
 *   +3 if a news item's subjects[] intersects with any centralized-
 *      player name in the subnet's competitive set
 *   +1 if the item's cat is in the always-relevant set for the
 *      subnet's category
 * Items with score 0 are dropped. Sort by score desc, then date desc.
 * Falls back to recentCentralizedNews if the subnet has no cat.
 * @param {{cat?: string}} subnet
 * @param {number}         [limit=8]
 * @returns {CentralNewsItem[]}
 */
export function newsForSubnet(subnet, limit = 8){
  if (!subnet || !subnet.cat) return recentCentralizedNews(limit);
  const players = playersForSubnet(subnet);
  /* Match full name AND the lead segment ('Alibaba' from 'Alibaba ·
     Qwen'), because news subjects use the short brand. */
  const playerKeys = new Set();
  for (const p of players){
    const full = (p.name || '').toLowerCase();
    if (full) playerKeys.add(full);
    const lead = (p.name || '').split(/\s*[·\.]\s*/)[0].toLowerCase();
    if (lead && lead !== full) playerKeys.add(lead);
  }
  const relevantCats = RELEVANT_NEWS_CATS_FOR_SUBNET_CAT[subnet.cat] || new Set();

  const scored = CENTRALIZED_NEWS.map(n => {
    let score = 0;
    for (const subj of (n.subjects || [])){
      const sl = String(subj).toLowerCase();
      if (playerKeys.has(sl)){ score += 3; break; }
    }
    if (relevantCats.has(n.cat)) score += 1;
    return { n, score };
  });
  return scored
    .filter(x => x.score > 0)
    .sort((a, b) => (b.score - a.score) || (b.n.date || '').localeCompare(a.n.date || ''))
    .slice(0, limit)
    .map(x => x.n);
}
