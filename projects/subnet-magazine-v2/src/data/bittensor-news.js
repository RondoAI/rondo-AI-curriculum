/* =================================================================
   SUBNET MAGAZINE, BITTENSOR NEWSWIRE
   -----------------------------------------------------------------
   Source-attributed announcements from the Bittensor ecosystem,    Opentensor Foundation, subnet teams (Chutes, Targon, Macrocosmos,
   Kaito, Taoshi, Nous, Cortex.t…), validators and research desks.
   Rendered as chips on the Bittensor ticker tape alongside the
   live subnet price chips.

   Each entry: source · headline · date · impact (up | down | flat).
   ================================================================= */

/**
 * @typedef {Object} BittensorNewsItem
 * @prop {string} source
 * @prop {string} sourceId
 * @prop {string} headline
 * @prop {string} date           ISO 'YYYY-MM-DD'
 * @prop {'up'|'down'|'flat'} impact
 */

/** @type {readonly BittensorNewsItem[]} */
export const BITTENSOR_NEWS = Object.freeze([
  { source: 'Opentensor Foundation', sourceId: 'opentensor',
    headline: 'dTAO interest rates recalibrate after the second halving, subnet emissions reshape',
    date: '2026-05-10', impact: 'up' },

  { source: 'Chutes',                sourceId: 'chutes',
    headline: 'SN64 brings B200 capacity online across US-East and EU-North',
    date: '2026-05-08', impact: 'up' },

  { source: 'Targon',                sourceId: 'targon',
    headline: 'SN4 ships speculative decoding to every miner endpoint, TTFT down 38%',
    date: '2026-05-05', impact: 'up' },

  { source: 'Macrocosmos',           sourceId: 'macrocosmos',
    headline: 'SN9 Pretraining opens its compute cohort to outside teams',
    date: '2026-05-02', impact: 'up' },

  { source: 'Rayon Labs',            sourceId: 'rayon',
    headline: 'Rayon Labs closes $24M Series A, leads on SN56 Gradients and SN64 Chutes',
    date: '2026-04-29', impact: 'up' },

  { source: 'Datura',                sourceId: 'datura',
    headline: 'Celium API standardizes, one client, every GPU cloud',
    date: '2026-04-27', impact: 'up' },

  { source: 'OpenKaito',             sourceId: 'kaito',
    headline: 'SN5 surfaces 2.6M new sources into the open-data tier this week',
    date: '2026-04-24', impact: 'up' },

  { source: 'Taoshi',                sourceId: 'taoshi',
    headline: 'SN8 PTN locks in 38 prop-trading desks as paying clients',
    date: '2026-04-22', impact: 'up' },

  { source: 'Nous Research',         sourceId: 'nous',
    headline: 'SN6 ships Hermes-4 70B, MIT-licensed weights, day-zero on Chutes',
    date: '2026-04-19', impact: 'up' },

  { source: 'Score',                 sourceId: 'score',
    headline: 'Score launches a subnet-performance scoring desk, public weekly reports',
    date: '2026-04-17', impact: 'up' },

  { source: 'Cortex.t',              sourceId: 'cortex',
    headline: 'SN18 SDK 4.0, typed Python client, OpenAI-compatible endpoints',
    date: '2026-04-15', impact: 'up' },

  { source: 'Polychain Capital',     sourceId: 'polychain',
    headline: 'Adds SN64 Chutes and SN5 OpenKaito to its validator slate',
    date: '2026-04-12', impact: 'flat' },

  { source: 'Yuma Group',            sourceId: 'yuma',
    headline: '100MW datacenter opens in Quebec, all-renewable, validator-priced',
    date: '2026-04-10', impact: 'up' },

  { source: 'Foundry',               sourceId: 'foundry',
    headline: 'Adds child-hotkey delegation to its validator suite',
    date: '2026-04-08', impact: 'up' },

  { source: 'Crucible Capital',      sourceId: 'crucible',
    headline: 'Q1 deregistration analysis: 9 subnets cleared, 4 borderline',
    date: '2026-04-05', impact: 'down' },

  { source: 'Opentensor Foundation', sourceId: 'opentensor',
    headline: 'Senate opens public RFC on root-weight algorithm v3',
    date: '2026-04-02', impact: 'flat' },

  { source: 'Chutes',                sourceId: 'chutes',
    headline: 'Aggregate inference throughput crosses 1.2M tok/s across the subnet',
    date: '2026-03-29', impact: 'up' },

  { source: 'TAOYNO',                sourceId: 'taoyno',
    headline: 'Validator opens a Korean-language nominator dashboard',
    date: '2026-03-26', impact: 'up' },
]);
