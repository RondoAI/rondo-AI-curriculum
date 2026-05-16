/* =================================================================
   SUBNET MAGAZINE, THE CODEX
   -----------------------------------------------------------------
   The reference layer. Encyclopedic, editorial-grade entries on
   every concept, mechanism, event, and standard inside Bittensor.
   Reads like a magazine, indexes like a library.

   Entry shape:
     id         short slug, used in deep-link anchors
     title      display name
     kicker     small caption above the title
     category   'protocol' | 'mechanism' | 'token' | 'role' |
                'event' | 'standard' | 'tool'
     oneLine    a single sentence the reader can copy as a
                definition. Must stand alone.
     sections   array of { h, body }, long-form sections, in
                reading order. body is HTML-safe plain text;
                inline <em>, <strong>, <code> are fine. Paragraph
                breaks via \n\n.
     seeAlso    array of other entry ids to surface as related
     sources    array of { name, href }, primary references
     updated    ISO date (YYYY-MM-DD)
     confidence 'high' | 'medium' | 'low', the magazine's
                epistemic-honesty signal, surfaces a dot per entry

   How to add an entry: append to CODEX. The /codex.html view
   picks it up automatically on next load, no view code to touch.
   ================================================================= */

/**
 * @typedef {Object} CodexEntry
 * @prop {string} id
 * @prop {string} title
 * @prop {string} kicker
 * @prop {'protocol'|'mechanism'|'token'|'role'|'event'|'standard'|'tool'} category
 * @prop {string} oneLine
 * @prop {{h:string, body:string}[]} sections
 * @prop {string[]} seeAlso
 * @prop {{name:string, href:string}[]} sources
 * @prop {string} updated
 * @prop {'high'|'medium'|'low'} confidence
 */

export const CATEGORY_LABEL = Object.freeze({
  protocol:  'Protocol',
  mechanism: 'Mechanism',
  token:     'Token',
  role:      'Role',
  event:     'Event',
  standard:  'Standard',
  tool:      'Tool',
});

/** @type {readonly CodexEntry[]} */
export const CODEX = Object.freeze([

  /* ========================================================
     PROTOCOL
     ======================================================== */
  {
    id: 'bittensor',
    title: 'Bittensor',
    kicker: 'Protocol',
    category: 'protocol',
    oneLine: 'A decentralized network that turns machine intelligence into a digital commodity, with a native token (TAO) that pays the participants who produce it.',
    sections: [
      { h: 'In one paragraph', body:
        'Bittensor is a permissionless protocol that coordinates a network of independent participants ("miners") to produce a specific kind of intelligence, text inference, image generation, training compute, real-time data, trading signals, anything, and pays them in a native token (TAO) sized by the value of what they contribute. A separate cohort ("validators") evaluates the miners against a per-subnet scoring function and submits weight vectors back on-chain. The chain aggregates those weights via a consensus mechanism called Yuma Consensus, derives the canonical truth of who produced the most value over the last block, and emits tokens accordingly.' },
      { h: 'Why it matters', body:
        'Closed labs (OpenAI, Anthropic, Google, Meta) have converged on a stack where compute, storage, weights, evaluation, and identity all sit inside one vertically integrated provider. Bittensor proposes the opposite: every layer of the AI economy as a permissionless market, every contribution provenanced, every payment denominated in a token that anyone can earn or hold. Whether this scales to compete with the closed labs is the open empirical question of the decade.' },
      { h: 'The components', body:
        'The network is built from three layers. The <strong>chain</strong> (Subtensor, a Substrate-based blockchain) records the canonical state, who staked, who validated, what weights settled, how much emission flowed where. The <strong>subnets</strong> (currently ~120, of which ~90 are active) are independent competitive markets, each scoring a specific kind of intelligence. The <strong>token</strong> (TAO, 21M supply cap, halving schedule similar to Bitcoin) is the unit of account; per-subnet "alpha" tokens (α) are minted by individual subnets and bond to TAO via the dTAO mechanism.' },
      { h: 'The bet', body:
        'Bittensor\'s thesis is that an open, incentive-aligned network of contributors can produce intelligence cheaper and faster than a closed corporate stack, because the long tail of independent compute, the long tail of fine-tuners, and the long tail of domain-specific data don\'t exist inside any single company. The closed labs spend hundreds of billions on capex; Bittensor coordinates the capacity that doesn\'t fit inside that capex envelope.' },
    ],
    seeAlso: ['tao', 'subtensor', 'subnet', 'yuma-consensus', 'dtao'],
    sources: [
      { name: 'docs.bittensor.com', href: 'https://docs.bittensor.com' },
      { name: 'docs.learnbittensor.org', href: 'https://docs.learnbittensor.org' },
      { name: 'Bittensor whitepaper (opentensor.ai)', href: 'https://opentensor.ai' },
    ],
    updated: '2026-05-16',
    confidence: 'high',
  },

  {
    id: 'subtensor',
    title: 'Subtensor',
    kicker: 'Protocol',
    category: 'protocol',
    oneLine: 'The Substrate-based blockchain that runs the Bittensor network, records stake, executes weight aggregation, mints emissions.',
    sections: [
      { h: 'What it is', body:
        'Subtensor is the Layer-1 chain that underpins Bittensor. Built on Parity\'s Substrate framework (the same toolkit Polkadot uses), it implements the protocol\'s state machine: registration, staking, weight setting, consensus aggregation, emission distribution. Block time is ~12 seconds; the canonical state is what Subtensor says it is.' },
      { h: 'What lives on-chain', body:
        'Every miner and validator registration. Every stake delegation. Every validator weight submission. Every emission event. Every dTAO bond. Identity bindings (cold key / hot key pairs). Subnet ownership and configuration. Conviction-lock state under BIT-0011.\n\nWhat does NOT live on-chain: the actual model weights miners run, the queries validators send, the responses miners return. Those happen off-chain over peer-to-peer transport. The chain only records who got paid how much for what, the work itself is too large to commit.' },
      { h: 'Source', body:
        'Subtensor is open source at <a href="https://github.com/opentensor/subtensor" target="_blank" rel="noopener">github.com/opentensor/subtensor</a>. Protocol upgrades are tagged releases; major changes (BIT proposals, like BIT-0011 Conviction Mechanism) go through community review before they land in a release.' },
    ],
    seeAlso: ['bittensor', 'yuma-consensus', 'tao', 'subnet'],
    sources: [
      { name: 'github.com/opentensor/subtensor', href: 'https://github.com/opentensor/subtensor' },
      { name: 'docs.bittensor.com, chain architecture', href: 'https://docs.bittensor.com' },
    ],
    updated: '2026-05-16',
    confidence: 'high',
  },

  /* ========================================================
     TOKENS
     ======================================================== */
  {
    id: 'tao',
    title: 'TAO',
    kicker: 'Token',
    category: 'token',
    oneLine: 'The native token of Bittensor. 21M supply cap, Bitcoin-style halving schedule, paid out as emission to miners, validators, and subnet owners every block.',
    sections: [
      { h: 'The basics', body:
        'TAO is the unit of account for the entire Bittensor network. Maximum supply is capped at 21 million, the same number as Bitcoin, and not by accident. New TAO is minted every block as "emission" and distributed to the network\'s participants according to the consensus weights set by validators.' },
      { h: 'How emission splits', body:
        'For every block, the emission released to a given subnet is split three ways:\n\n, <strong>Miners</strong> receive the largest share, sized by how much each one contributed to the subnet\'s output (per validator weights, aggregated via Yuma Consensus).\n\n, <strong>Validators</strong> receive their share for the work of scoring miners and submitting weight vectors. This is paid out only to validators whose weights tracked consensus closely; outlier weights are pruned by Yuma\'s weighted-median operation.\n\n, <strong>Subnet owner</strong> takes a fixed cut (typically 18% as of May 2026) for operating the subnet, defining the scoring rubric, maintaining the incentive code, registering the slot.' },
      { h: 'Halving', body:
        'Like Bitcoin, TAO has a halving schedule. The block-level emission rate drops by 50% on a fixed schedule, asymptotically approaching the 21M cap. The second halving is projected for late 2029.' },
      { h: 'How to acquire', body:
        'Listed on Coinbase, Kraken, MEXC, KuCoin, Binance, and most major exchanges. Can also be earned directly by running a validator, by mining a subnet that pays emission, or by holding alpha tokens that bond to TAO via the dTAO mechanism.' },
    ],
    seeAlso: ['alpha', 'dtao', 'emission', 'halving', 'yuma-consensus'],
    sources: [
      { name: 'taostats.io', href: 'https://taostats.io' },
      { name: 'taomarketcap.com', href: 'https://taomarketcap.com' },
      { name: 'docs.bittensor.com, TAO economics', href: 'https://docs.bittensor.com' },
    ],
    updated: '2026-05-16',
    confidence: 'high',
  },

  {
    id: 'alpha',
    title: 'Alpha (α)',
    kicker: 'Token',
    category: 'token',
    oneLine: 'Per-subnet tokens minted by individual subnets. Each subnet has its own α; the price floats against TAO via the dTAO bonding mechanism.',
    sections: [
      { h: 'The idea', body:
        'Bittensor\'s dTAO upgrade introduced per-subnet tokens, called "alpha" (α). Each subnet (SN1, SN2, … SN123) has its own α token: <span class="alpha">α</span><sub>1</sub>, <span class="alpha">α</span><sub>2</sub>, etc. When you stake to a specific subnet, you receive that subnet\'s α token, which bonds to TAO via a price discovered on a continuous bonding curve.' },
      { h: 'Why per-subnet tokens', body:
        'Pre-dTAO, every subnet drew emission from a single shared pool, a popularity contest decided centrally by validators. Post-dTAO, the market sets each subnet\'s share of emission directly: the more capital that bonds to a subnet\'s α, the higher its α price, the more emission flows to that subnet. The chain becomes a self-organizing capital allocator instead of a moderated one.' },
      { h: 'α-MCAP', body:
        'A subnet\'s "α-MCAP", α-token market cap, is α price × α circulating supply. The magazine uses this figure as the canonical measure of capital allocated to a subnet, comparable across subnets, denominated in dollars when the TAO/USD rate is applied.' },
    ],
    seeAlso: ['tao', 'dtao', 'subnet', 'emission'],
    sources: [
      { name: 'taomarketcap.com, α prices', href: 'https://taomarketcap.com' },
      { name: 'docs.bittensor.com, dTAO', href: 'https://docs.bittensor.com' },
    ],
    updated: '2026-05-16',
    confidence: 'high',
  },

  /* ========================================================
     MECHANISMS
     ======================================================== */
  {
    id: 'yuma-consensus',
    title: 'Yuma Consensus',
    kicker: 'Mechanism',
    category: 'mechanism',
    oneLine: 'The weight-aggregation algorithm at the heart of Bittensor. Aggregates every validator\'s weight vector into a single fair score per miner, prunes outlier validators in the process.',
    sections: [
      { h: 'What it does', body:
        'Every block, each validator on a subnet submits a vector of weights, one number per miner, reflecting how good that validator thinks each miner is. Yuma Consensus aggregates all those vectors into a single canonical score per miner using a stake-weighted median operation. Validators whose weights disagree materially with the consensus get their contributions discounted (their own emission is reduced); validators whose weights align with consensus get paid in full. The system pays only for agreement on what good work looks like, not for being loud.' },
      { h: 'The mathematics', body:
        'Yuma is essentially a stake-weighted median with a clipping step. Each validator\'s weight on each miner is multiplied by that validator\'s stake; the chain takes the weighted median across validators. Validators whose weights fall outside a bounded distance from that median have their entire weight vector pruned, they\'re not paid this block. This is what makes the system robust against a single high-stake validator trying to game the score: the median ignores them if the rest of the network disagrees.' },
      { h: 'Why it works', body:
        'The mechanism is named after the Yuma Indians, but the design intuition is closer to a Schelling-point game. Validators are paid to predict what the median validator believes; the median validator is paid to score miners honestly because that\'s the strategy other validators converge on. The Nash equilibrium is "score honestly", because deviating from consensus costs you emission.' },
    ],
    infographic: 'yuma-consensus',
    seeAlso: ['validator', 'miner', 'weight', 'emission'],
    sources: [
      { name: 'Bittensor whitepaper', href: 'https://opentensor.ai' },
      { name: 'docs.bittensor.com, consensus', href: 'https://docs.bittensor.com' },
    ],
    updated: '2026-05-16',
    confidence: 'high',
  },

  {
    id: 'dtao',
    title: 'dTAO',
    kicker: 'Mechanism',
    category: 'mechanism',
    oneLine: 'The bonding-curve mechanism that gives each subnet its own α token, sets its emission share by market price, and turns Bittensor into a self-organizing capital allocator.',
    sections: [
      { h: 'What it is', body:
        'dTAO ("dynamic TAO") is the protocol upgrade that replaced Bittensor\'s old centrally-allocated emission model with a market-driven one. Each subnet now has its own α token. When you stake TAO into a subnet, you receive α tokens for that subnet via a continuous bonding curve; the price of α relative to TAO floats based on supply and demand.' },
      { h: 'How emission share is set', body:
        'The emission a subnet receives every block is proportional to the dollar value of its α-MCAP relative to the rest of the network\'s α-MCAPs. So a subnet with twice the α-MCAP of another receives roughly twice the daily emission. This is a market mechanism: capital flowing into a subnet directly grows its emission share, which raises its α price, which attracts more capital. Self-reinforcing.' },
      { h: 'What changed', body:
        'Pre-dTAO, validators set "global weights" that decided emission share across subnets. This was a permissioned mechanism, a small number of high-stake validators set the allocation. Post-dTAO, the market sets it directly. Anyone with TAO can move emission share by buying α; the system removes the validator cohort from cross-subnet allocation entirely.' },
    ],
    seeAlso: ['alpha', 'tao', 'subnet', 'emission'],
    sources: [
      { name: 'docs.bittensor.com, dTAO', href: 'https://docs.bittensor.com' },
      { name: 'taomarketcap.com', href: 'https://taomarketcap.com' },
    ],
    updated: '2026-05-16',
    confidence: 'high',
  },

  {
    id: 'emission',
    title: 'Emission',
    kicker: 'Mechanism',
    category: 'mechanism',
    oneLine: 'New TAO minted every block and distributed to miners, validators, and subnet owners according to the Yuma Consensus weights.',
    sections: [
      { h: 'How it flows', body:
        'Every block (~12 seconds), the chain mints a fixed amount of new TAO (currently ~7,200 TAO/day after halving #1). That emission is divided across subnets in proportion to each subnet\'s α-MCAP (the dTAO mechanism). Within each subnet, emission flows to miners according to the Yuma Consensus weights, to validators according to their alignment with consensus, and to the subnet owner as a fixed cut (currently ~18%).' },
      { h: 'Why it matters', body:
        'Emission is the network\'s only inflation. Every TAO that ever exists comes from emission. Every dollar of "subsidy" that operators receive comes from emission. The Pine Analytics work in early 2026 quantified the structural question this raises: at the network level, miners receive ~$148M/year in TAO emission against $3-15M of measurable external revenue. The subsidy-to-revenue ratio is the open question of whether Bittensor\'s pricing claims survive without the emission line.' },
    ],
    seeAlso: ['tao', 'halving', 'yuma-consensus', 'dtao'],
    sources: [
      { name: 'taostats.io', href: 'https://taostats.io' },
      { name: 'Pine Analytics, subsidy report (2026)', href: 'https://taostats.io' },
    ],
    updated: '2026-05-16',
    confidence: 'high',
  },

  {
    id: 'halving',
    title: 'Halving',
    kicker: 'Mechanism',
    category: 'mechanism',
    oneLine: 'The scheduled reduction in block-level TAO emission, modeled on Bitcoin\'s halving. Second halving projected for late 2029.',
    sections: [
      { h: 'The schedule', body:
        'TAO\'s emission rate halves on a fixed schedule, asymptotically approaching the 21M supply cap. The first halving occurred in 2025; the second is projected for late 2029. Each halving drops the new-TAO-per-block rate by 50%, current rate (May 2026) is ~7,200 TAO/day post first halving.' },
      { h: 'Why it matters', body:
        'The halving is the chain\'s sound-money commitment. It tells every miner, validator, capital allocator, and subnet owner: the supply schedule is predictable, the dilution rate is dropping, the tokens you earn today represent a known fraction of the future float. This is the same monetary policy as Bitcoin, applied to a network that pays for intelligence instead of hashpower.' },
    ],
    seeAlso: ['tao', 'emission'],
    sources: [
      { name: 'taostats.io, emission schedule', href: 'https://taostats.io' },
    ],
    updated: '2026-05-16',
    confidence: 'high',
  },

  {
    id: 'weight',
    title: 'Weights',
    kicker: 'Mechanism',
    category: 'mechanism',
    oneLine: 'The numeric scores validators submit on-chain rating each miner. Aggregated by Yuma Consensus into the canonical truth of who produced value.',
    sections: [
      { h: 'What they are', body:
        'A weight is a number, between 0 and 1, that a validator assigns to a miner. It represents how much of the next block\'s emission that validator believes should flow to that miner. Every validator on every subnet submits a vector of weights, one number per miner on that subnet, every block (or every few blocks, depending on the subnet\'s configuration).' },
      { h: 'How they aggregate', body:
        'Yuma Consensus aggregates every validator\'s weight vector into a single canonical score per miner using a stake-weighted median. The chain then pays each miner emission proportional to that aggregated score. Validators whose weights agree with the median get paid in full; outliers get pruned.' },
    ],
    seeAlso: ['yuma-consensus', 'validator', 'miner', 'emission'],
    sources: [
      { name: 'docs.bittensor.com, weight setting', href: 'https://docs.bittensor.com' },
    ],
    updated: '2026-05-16',
    confidence: 'high',
  },

  /* ========================================================
     ROLES
     ======================================================== */
  {
    id: 'miner',
    title: 'Miner',
    kicker: 'Role',
    category: 'role',
    oneLine: 'A participant who runs a model (or other intelligence) on a subnet, answers validator queries, and earns TAO emission scored by Yuma Consensus.',
    sections: [
      { h: 'What a miner does', body:
        'A miner registers on a subnet (which costs a one-time TAO burn that varies by subnet, typically 100K+ TAO for slot-constrained subnets), runs the miner software the subnet operator publishes, and serves whatever workload that subnet rewards: text inference, image generation, training shards, real-time data, trading signals, audio synthesis, etc. Validators query the miner; the miner responds; validators score the response; the chain pays emission per the Yuma weights.' },
      { h: 'The economic shape', body:
        'A miner\'s P&L is: emission earned (in TAO, denominated in dollars at the spot rate) minus compute cost (cloud GPU, on-prem GPU, electricity, bandwidth) minus the time-amortized burn cost to register. Profitable miners are the ones with either the cheapest compute, the best model, or both. Most subnets have rolling deregistration, the worst-scoring miners are kicked off slot by slot, so the long-term equilibrium is "be in the top 80% on your subnet or pay the registration burn again to come back".' },
    ],
    seeAlso: ['validator', 'subnet', 'emission', 'yuma-consensus'],
    sources: [
      { name: 'docs.learnbittensor.org, mine a subnet', href: 'https://docs.learnbittensor.org' },
    ],
    updated: '2026-05-16',
    confidence: 'high',
  },

  {
    id: 'validator',
    title: 'Validator',
    kicker: 'Role',
    category: 'role',
    oneLine: 'A participant who scores miners on a subnet, sends queries, evaluates responses, submits weight vectors on-chain. Paid for alignment with Yuma consensus.',
    sections: [
      { h: 'What a validator does', body:
        'A validator stakes TAO (either their own or delegated from the public), registers on one or more subnets, runs the subnet\'s validator software, and on every scoring cycle queries the miners with whatever test the subnet uses, a prompt, a model checkpoint to evaluate, a training shard to verify, a trade to score, etc. The validator scores each miner\'s response, builds a weight vector, and submits it on-chain. Yuma Consensus aggregates all validators\' vectors into the canonical truth; validators whose weights track that median get paid emission proportional to their stake.' },
      { h: 'Delegation', body:
        'TAO holders who don\'t want to operate a validator themselves can delegate their stake to a validator they trust. The validator earns emission on the combined stake; nominators receive a share, typically 80%+ of the validator\'s earnings. Validators publish their commission rate. This is the network\'s "staking" surface, most institutional TAO sits with delegated validators (Foundry Digital, Yuma Holdings, others) rather than running its own infrastructure.' },
    ],
    seeAlso: ['miner', 'yuma-consensus', 'weight', 'subnet'],
    sources: [
      { name: 'docs.learnbittensor.org, validate', href: 'https://docs.learnbittensor.org' },
      { name: 'taostats.io, validator leaderboard', href: 'https://taostats.io' },
    ],
    updated: '2026-05-16',
    confidence: 'high',
  },

  {
    id: 'subnet',
    title: 'Subnet',
    kicker: 'Role',
    category: 'role',
    oneLine: 'An independent competitive market inside Bittensor. Each subnet scores one specific kind of intelligence, has its own miners, validators, and α token.',
    sections: [
      { h: 'What it is', body:
        'A subnet is a market for a specific category of work. Subnet 1 (Apex) is for open-domain text prompting. Subnet 4 (Targon) is for bandwidth-priced LLM inference. Subnet 64 (Chutes) is for serverless GPU compute. Subnet 75 (Hippius) is for decentralized object storage. The subnet operator defines the task, the scoring rubric, and the incentive code; miners and validators on that subnet compete against each other within those rules.' },
      { h: 'The shape of one', body:
        'Every subnet has: a one-time TAO burn to register a new slot (set by the protocol), a fixed cap on miner slots (usually 256), a fixed cap on validator slots (usually 64, 256), an "immunity period" during which a newly-registered miner can\'t be deregistered, and a scoring cycle (the rate at which validators query miners and submit weights, typically every block or every few blocks).' },
      { h: 'The state of the network', body:
        'As of May 2026, there are ~120 subnets registered, of which ~92 are actively producing emissions. The top 10 by α-MCAP collectively account for a majority of the network\'s economic activity. The long tail of smaller subnets is where most of the experimental work happens, new scoring mechanisms, new domains, new evaluation rubrics.' },
    ],
    seeAlso: ['miner', 'validator', 'alpha', 'immunity'],
    sources: [
      { name: 'taonsquare.com, subnet catalog', href: 'https://taonsquare.com' },
      { name: 'taostats.io, subnet explorer', href: 'https://taostats.io' },
      { name: 'subnets.io, community directory', href: 'https://subnets.io' },
    ],
    updated: '2026-05-16',
    confidence: 'high',
  },

]);

/**
 * Lookup an entry by id.
 * @param {string} id
 * @returns {CodexEntry|null}
 */
export function codexEntryById(id){
  return CODEX.find(e => e.id === id) || null;
}

/**
 * Group the codex by category in CATEGORY_LABEL order.
 * @returns {{key:string, label:string, entries:CodexEntry[]}[]}
 */
export function codexByCategory(){
  const keys = Object.keys(CATEGORY_LABEL);
  return keys
    .map(k => ({ key: k, label: CATEGORY_LABEL[k], entries: CODEX.filter(e => e.category === k) }))
    .filter(b => b.entries.length);
}
