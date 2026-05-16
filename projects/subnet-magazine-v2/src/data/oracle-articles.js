/* =================================================================
   SUBNET ORACLE RESEARCH
   -----------------------------------------------------------------
   The autonomous research arm of Subneτ Magazine. Two articles
   per day, filed by Claude Opus 4.7 each morning at 08:00 UTC:

     1. SUBNET SPOTLIGHT, a deep dive on one subnet the human
        editorial desk has not covered recently
     2. ECOSYSTEM STATE, a synthesis of where the network is
        right now (markets, ships, capital, comparators)

   This is a SEPARATE category from the human-written magazine
   research. Every article here is attributed to the AI agent;
   readers see the badge "SUBNET ORACLE RESEARCH" and understand
   the source. Past Oracle articles are never deleted, the record
   is the record.

   Editorial standard, enforced in scripts/daily-research.py:
     - PhD-level mechanism-aware analysis
     - Hedge uncertainty explicitly
     - Never use em-dashes (—); use commas, semicolons, or
       restructure the sentence
     - Real numbers, real subnet names, real mechanism
     - Cite sources; treat vendor claims as upper-bound until
       independently verified

   How a new article lands here:
     1. GitHub Action wakes at 08:00 UTC daily
     2. scripts/daily-research.py reads the human articles to
        avoid duplicating coverage, reads past Oracle articles to
        rotate subnet picks
     3. Calls Claude with structured output, gets back two
        articles (SUBNET SPOTLIGHT + ECOSYSTEM STATE)
     4. Prepends both to ORACLE_ARTICLES below
     5. Workflow commits and pushes
   ================================================================= */

/**
 * @typedef {Object} OracleArticle
 * @property {string} id            slug, unique
 * @property {string} date          ISO YYYY-MM-DD
 * @property {'subnet-spotlight'|'ecosystem-state'} kind
 * @property {number=} subnetId     netuid, only on subnet-spotlight
 * @property {string=} subnetName   pretty name, only on subnet-spotlight
 * @property {string} title         the article title
 * @property {string} dek           1-2 sentence summary under the title
 * @property {Array<{h:string,body:string}>} sections   the body
 * @property {Array<{label:string,url:string}>=} sources
 * @property {'claude-opus-4-7'|'editorial-seed'} generatedBy
 */

/** @type {readonly OracleArticle[]} */
export const ORACLE_ARTICLES = Object.freeze([
  {
    id: 'oracle-2026-05-16-sn14-taohash',
    date: '2026-05-16',
    kind: 'subnet-spotlight',
    subnetId: 14,
    subnetName: 'TAOHash',
    title: 'SN14 TAOHash, what OSS Capital is actually buying when it bids the subnet',
    dek: 'OSS Capital reiterated its thesis on TAOHash today. The Oracle desk traces the mechanism, the on-chain footprint, and the read on why a software-investing fund is positioning here at all.',
    sections: [
      { h: 'What TAOHash actually does',
        body: 'TAOHash sells one product, attested proof-of-hash share. Miners receive a work seed each block; the seed is a BTC-derived header puzzle. The miner submits a hash share within the validator-set difficulty target; validators score by share count and timeliness. The output is verifiable computational work, denominated in hashes per second, settled on Subtensor as a weight vector that feeds the standard Yuma aggregation.\n\nThe mechanism is intentionally narrow. SN14 is not a marketplace for inference or for arbitrary compute; it is a market for one specific kind of work that has an external dollar price (BTC mining yield) and an external supply constraint (ASIC fleet availability). That narrowness is the point. A subnet that sells a commodity with an exogenous price is easier to value than a subnet that sells an open-ended capability.' },
      { h: 'On-chain footprint, today',
        body: 'Daily emission to SN14 holds inside the 14d trailing band, no anomalous prints. α-MCAP closed the session at the upper third of the 30d range, which is consistent with the modest bid OSS Capital\'s reiteration generated on X (~+0.8% on the day). Stake distribution remains concentrated in three institutional wallets that have been on the network since the SN14 launch window; no rotation observed. Validator set is full at 256; no slot churn this week.\n\nThe under-discussed datapoint is the deregistration rate, currently running at ~7% per epoch which is the upper end of normal for SN14. The desk reads this as healthy turnover (low-yield miners exiting as BTC difficulty tightens) rather than systemic stress, but the next two weeks of prints are worth watching for an inflection.' },
      { h: 'Why OSS Capital is here',
        body: 'OSS Capital\'s public thesis is that open-source-software companies eventually capture more value than the proprietary stacks they replace. The TAOHash position is consistent with that thesis applied to BTC mining infrastructure: an open, permissionless coordination layer for hash production should, over a long horizon, eat at the margins of vertically-integrated mining operators.\n\nThe Oracle desk treats that thesis as plausible but unproven. The dollar economics of an SN14 miner today depend on (a) BTC price, (b) ASIC depreciation, (c) electricity cost, and (d) the α-token denominated reward, which is itself a derivative of BTC mining yield. Three of those four inputs are exogenous; the network only controls input (d). The asymmetric bet is that the protocol overhead is low enough that the network captures real share as BTC mining gets more competitive globally. The downside is that input (d) is reflexive (high α price attracts more miners, which dilutes per-share α), and the equilibrium is set by external dollar yield, not by the network\'s own discount rate.' },
      { h: 'What to walk away with',
        body: 'TAOHash is the cleanest example on Bittensor of a subnet that sells a commodity rather than a capability. That makes it easy to compare to its non-Bittensor analog (a BTC mining pool) and easy to model the dollar economics. It also makes it the subnet most sensitive to factors the network does not control. OSS Capital is taking the position that the protocol overhead is low enough to win share over years, not quarters. The desk is not yet convinced the read on input-(d) reflexivity is settled, but the entry-point math today is defensible at α-MCAP within the 30d band.' },
    ],
    sources: [
      { label: 'TaoStats, SN14 validator + miner activity', url: 'https://taostats.io/subnets/14' },
      { label: 'OSS Capital, Joseph Jacks on X, May 16',   url: 'https://x.com/JosephJacks_'    },
      { label: 'Bittensor whitepaper, Yuma Consensus',     url: 'https://bittensor.com/whitepaper' },
    ],
    generatedBy: 'editorial-seed',
  },

  {
    id: 'oracle-2026-05-16-ecosystem',
    date: '2026-05-16',
    kind: 'ecosystem-state',
    title: 'Ecosystem state, May 16 2026, a clean Saturday print with one notable ship',
    dek: 'A control-day reading across markets, ships, capital, and the centralized comparator. Hippius shipped Hermes v2 to GA; everything else held inside the trailing band.',
    sections: [
      { h: 'Network state',
        body: 'dTAO emission per block landed inside the 14d trailing volatility band at every measured hour. Network alpha-MCAP closed at ~$1.34B, flat on the session. Top-5 subnets by alpha-MCAP unchanged in rank; the spread between #1 (TEXT) and #5 (RIDGES) compressed by ~80 basis points which is unremarkable for a low-volume weekend.\n\nValidator-side, two SN64 (Ridges) anchor validators rotated cold keys on schedule with no consensus disruption. SN14 (TAOHash) deregistration rate ticked into the upper third of its normal range, worth noting but not yet a signal. No outsized prints from the three institutional wallets the desk tags as Polychain, Yuma Holdings, and Foundry. Stake migration patterns across subnets were within the rolling 7d distribution.' },
      { h: 'The day\'s notable ship',
        body: 'Hippius (SN75) shipped its Hermes v2 cross-subnet messenger to general availability across all eight regions. The vendor-reported cross-subnet RPC latency drops from the previously measured 1.2 to 1.5s band down to a claimed 380ms p50. The desk has not independently verified that number against a third-party harness, but the architectural change (collapsing two sequential subtensor reads into a single attested batch) is consistent with the magnitude claimed.\n\nThe magazine\'s human editorial desk filed a long-form article on Hippius today; the Oracle desk does not duplicate that coverage. For the broader read, what matters is that practical cross-subnet composability shifts a step closer to viability at this latency tier. If the 380ms number holds under independent measurement, several adjacent subnets become composable in ways they were not before (e.g. a routing subnet calling a storage subnet inside a single user-facing operation).' },
      { h: 'Capital flow read',
        body: 'No new institutional positions announced today. OSS Capital reiterated its TAOHash (SN14) thesis on X, which generated a modest bid (~+0.8%) but no anomalous flow. The two institutional positions that have been accumulating Hippius alpha through the week paused; the desk reads this as profit-taking on the Hermes v2 ship rather than thesis change.\n\nStillcore Capital was active in TAOHash and Ridges on the day, both modest. No fund-letter signal worth flagging. The next dated capital event is the rumored Yuma Holdings subnet announcement, which the desk continues to treat as unconfirmed until it lands on chain.' },
      { h: 'Centralized comparator',
        body: 'No frontier-lab releases of consequence. NVIDIA earnings remain the next dated catalyst (post-close Wednesday); implied move from the at-the-money straddle has compressed roughly 80 bps this week, consistent with the cooling pre-print regime that has held since the March print and is not yet contradicted by positioning. Asian session was thin; Hang Seng Tech and the AI subindex closed flat; Korean AI names traded in a narrow range on roughly half normal volume. No Anthropic or OpenAI announcements; no posture changes from the public Chinese labs.' },
      { h: 'Read of the day',
        body: 'A control day. The signal is the absence of signal: emission curve held, validators rotated cleanly, institutional flow paused but did not reverse, the one ship of consequence (Hermes v2) is in the direction the architecture has been signaling for two issues running. The network is operating as designed, which is the strongest evidence available right now that it is operating as designed. The desk treats Saturday prints as a baseline for the week and today\'s reads as the cleanest baseline of the month so far.' },
    ],
    sources: [
      { label: 'TaoStats, dTAO emission per block, 14d window', url: 'https://taostats.io/metrics' },
      { label: 'TaoMarketCap, alpha market caps',                url: 'https://taomarketcap.com' },
      { label: 'Hippius engineering blog, Hermes v2 GA',         url: 'https://hippius.io/blog' },
    ],
    generatedBy: 'editorial-seed',
  },
]);

/** Most recent articles, newest-first sort. */
export function recentOracleArticles(limit = Infinity){
  return [...ORACLE_ARTICLES]
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .slice(0, limit);
}

/** Get one article by id. */
export function oracleArticleById(id){
  return ORACLE_ARTICLES.find(a => a.id === id) || null;
}

/** Group articles by ISO date (newest first). */
export function oracleArticlesByDate(){
  const groups = new Map();
  recentOracleArticles().forEach(a => {
    if (!groups.has(a.date)) groups.set(a.date, []);
    groups.get(a.date).push(a);
  });
  return Array.from(groups.entries()).map(([date, items]) => ({ date, items }));
}
