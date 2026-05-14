/* =================================================================
   SUBNET MAGAZINE — VALIDATORS DATASET
   -----------------------------------------------------------------
   A curated roster of the largest and most-watched Bittensor
   validators ("hotkeys"). Used by the Validators leaderboard
   page and any cross-page validator references.

   Each row carries the public-facing operator name, the role
   ("Validator" or "Subnet owner+validator"), total τ delegated
   to the hotkey, the number of distinct nominators, a typical
   30-day nomination APY, and a short description.

   This roster is hand-authored from public Discord / X / blog
   activity in the Bittensor ecosystem. Numbers are best-effort
   May 2026 approximations; the live taostats API can replace
   this seed via DataLayer.tao:validators in the future.
   ================================================================= */

/**
 * @typedef {Object} Validator
 * @prop {string} id              slug (lowercase, no spaces)
 * @prop {string} name            display name
 * @prop {string} role            'Validator' | 'Subnet owner+validator' | 'Foundation' | 'Institutional'
 * @prop {string} hotkey          masked Substrate address, e.g. 5GrwvaEF...HEa
 * @prop {number} stake           τ delegated to this validator (rounded thousand)
 * @prop {number} nominators      distinct delegator coldkey count
 * @prop {number} apy             trailing 30-day nomination APY %
 * @prop {number} subnets         distinct subnets where this validator runs a validator hotkey
 * @prop {string} country         2-letter country code
 * @prop {string} since           ISO date validator registered on root
 * @prop {string} desc            one-line description
 * @prop {boolean=} foundation    is an Opentensor Foundation address
 */

/** @type {readonly Validator[]} */
export const VALIDATORS = Object.freeze([
  { id:'opentensor',     name:'Opentensor Foundation',          role:'Foundation',
    hotkey:'5F4tQyW...root', stake:286_400, nominators:1240, apy:13.4, subnets:64, country:'US',
    since:'2023-09-08', foundation:true,
    desc:'The foundation\'s root validators. Anchor of the network.' },
  { id:'datura',         name:'Datura',                         role:'Validator',
    hotkey:'5DAAnrj...PtVP', stake:128_600, nominators:842,  apy:14.2, subnets:48, country:'NL',
    since:'2023-11-04',
    desc:'Operator of high-uptime validators across most subnets. Builds the bittensor.com explorer.' },
  { id:'polychain',      name:'Polychain Capital',              role:'Institutional',
    hotkey:'5HpLdCv...vN9z', stake:118_200, nominators:412,  apy:11.8, subnets:38, country:'US',
    since:'2024-01-12',
    desc:'Largest institutional TAO delegator. Long thesis since 2021.' },
  { id:'taoyno',         name:'TAOYNO',                         role:'Validator',
    hotkey:'5GrwvaE...Cd6f', stake:104_800, nominators:1080, apy:14.6, subnets:42, country:'KR',
    since:'2024-02-08',
    desc:'Korean-led validator pool. Major early supporter of SN4 / SN18.' },
  { id:'rt21',           name:'RoundTable21',                   role:'Institutional',
    hotkey:'5Cqkxsi...mvgM', stake: 92_400, nominators:218,  apy:11.4, subnets:34, country:'CH',
    since:'2024-03-19',
    desc:'Institutional staking across Substrate ecosystems. Heavy on root.' },
  { id:'crucible',       name:'Crucible Capital',               role:'Institutional',
    hotkey:'5EYCAe5...EkPC', stake: 86_100, nominators:124,  apy:11.2, subnets:28, country:'US',
    since:'2024-04-02',
    desc:'TAO-focused fund. Big SN1 / SN9 / SN64 delegations.' },
  { id:'yumagroup',      name:'Yuma Group',                     role:'Subnet owner+validator',
    hotkey:'5HQDtia...3PYf', stake: 78_900, nominators:298,  apy:13.0, subnets:24, country:'US',
    since:'2024-05-15',
    desc:'YCX index + Subnet Composite Fund operator. Runs validator on every fund subnet.' },
  { id:'macrocosmos',    name:'Macrocosmos',                    role:'Subnet owner+validator',
    hotkey:'5FHneW4...UrnE', stake: 72_600, nominators:512,  apy:14.0, subnets:12, country:'US',
    since:'2023-12-04',
    desc:'Owner of SN1 Apex, SN9 Pretraining, SN25 Folding. Heavy validator on its own subnets.' },
  { id:'rayonlabs',      name:'Rayon Labs',                     role:'Subnet owner+validator',
    hotkey:'5DJzCM7...BkUz', stake: 64_200, nominators:466,  apy:13.8, subnets: 8, country:'US',
    since:'2024-08-11',
    desc:'Owner of SN56 Gradients + SN64 Chutes. Top-3 emitter as of Q2 2026.' },
  { id:'corcel',         name:'Corcel',                         role:'Subnet owner+validator',
    hotkey:'5FrgKfp...g8Lv', stake: 58_400, nominators:312,  apy:13.6, subnets:14, country:'UK',
    since:'2024-02-22',
    desc:'Owner of SN18 Cortex.t. Validator on most text inference subnets.' },
  { id:'taoshi',         name:'Taoshi',                         role:'Subnet owner+validator',
    hotkey:'5DkPdcv...rHbb', stake: 54_900, nominators:402,  apy:14.4, subnets: 6, country:'US',
    since:'2024-03-08',
    desc:'Owner of SN8 PTN proprietary trading network. Heavy SN50 Synth presence.' },
  { id:'nousresearch',   name:'Nous Research',                  role:'Subnet owner+validator',
    hotkey:'5DAkrxr...rzNa', stake: 48_700, nominators:608,  apy:14.2, subnets: 4, country:'US',
    since:'2024-06-04',
    desc:'Owner of SN6 Nous finetune competition. Open-source LLM research.' },
  { id:'manifoldlabs',   name:'Manifold Labs',                  role:'Subnet owner+validator',
    hotkey:'5HBVrFh...gKqM', stake: 42_100, nominators:284,  apy:13.4, subnets: 5, country:'US',
    since:'2024-05-20',
    desc:'Owner of SN4 Targon, SN13 Dataverse.' },
  { id:'kaito',          name:'Kaito',                          role:'Subnet owner+validator',
    hotkey:'5C8hKqr...DnL4', stake: 38_900, nominators:248,  apy:13.6, subnets: 3, country:'US',
    since:'2024-07-12',
    desc:'Owner of SN5 OpenKaito, SN69 KaitoFM. Decentralized search + feeds.' },
  { id:'bittensorguru',  name:'Bittensor Guru',                 role:'Validator',
    hotkey:'5HKEzc1...kBnp', stake: 35_400, nominators:1640, apy:15.2, subnets:42, country:'IE',
    since:'2024-01-30',
    desc:'Community-favorite validator pool. High nominator count thanks to a publicly run podcast.' },
  { id:'hashrate',       name:'The Hash Rate',                  role:'Validator',
    hotkey:'5G7n9Q1...3Yb6', stake: 32_800, nominators:902,  apy:14.8, subnets:36, country:'US',
    since:'2024-04-18',
    desc:'Mark Jeffrey\'s validator. Aligned with the largest Bittensor podcast.' },
  { id:'stillcore',      name:'Stillcore Capital',              role:'Institutional',
    hotkey:'5CExMM2...sgVy', stake: 28_600, nominators:140,  apy:11.6, subnets:18, country:'US',
    since:'2025-12-04',
    desc:'First U.S. liquid venture fund for decentralized AI. Custody-free LP staking.' },
  { id:'subvortex',      name:'SubVortex',                      role:'Subnet owner+validator',
    hotkey:'5CmZQ8C...HJgN', stake: 24_200, nominators:412,  apy:13.8, subnets:18, country:'FR',
    since:'2024-04-10',
    desc:'Owner of SN7 SubVortex (Validator-as-a-service infrastructure).' },
  { id:'taonode',        name:'TAOnode',                        role:'Validator',
    hotkey:'5HQ4mt5...VWxN', stake: 22_800, nominators:516,  apy:14.4, subnets:28, country:'DE',
    since:'2024-09-08',
    desc:'European validator pool. Strong uptime SLA.' },
  { id:'taoswap',        name:'TaoSwap',                        role:'Validator',
    hotkey:'5GBNeWR...ZTBN', stake: 19_600, nominators:344,  apy:14.0, subnets:22, country:'SG',
    since:'2024-08-22',
    desc:'APAC-focused validator. Operates one of the larger Singapore endpoints.' },
  { id:'foundry',        name:'Foundry Digital',                role:'Institutional',
    hotkey:'5CFG7w7...PqFb', stake: 18_400, nominators: 86,  apy:11.0, subnets:14, country:'US',
    since:'2024-10-30',
    desc:'Crypto-mining-native infrastructure firm. Bitcoin → TAO crossover.' },
  { id:'tao-pulse',      name:'TaoPulse',                       role:'Validator',
    hotkey:'5HnFw9V...QF5T', stake: 16_900, nominators:264,  apy:14.2, subnets:24, country:'BR',
    since:'2024-11-04',
    desc:'LATAM-focused validator. Sao Paulo node.' },
  { id:'thealpha',       name:'The Alpha',                      role:'Validator',
    hotkey:'5EJaKQF...zChU', stake: 14_200, nominators:412,  apy:14.6, subnets:26, country:'US',
    since:'2024-12-12',
    desc:'High-uptime US validator with a long-running newsletter.' },
  { id:'taototem',       name:'Tao Totem',                      role:'Validator',
    hotkey:'5GTbZqQ...8DfA', stake: 12_400, nominators:212,  apy:14.4, subnets:18, country:'CA',
    since:'2024-09-19',
    desc:'Canadian validator pool. Sustainable hosting.' },
  { id:'snake',          name:'Snake Validator',                role:'Validator',
    hotkey:'5FRJgL2...Vk1M', stake: 11_800, nominators:618,  apy:14.8, subnets:30, country:'AU',
    since:'2024-10-12',
    desc:'Sydney-based validator. Long-running operator.' },
  { id:'bittie',         name:'Bittie',                         role:'Validator',
    hotkey:'5HmRZk6...c2Lp', stake: 10_400, nominators:484,  apy:14.6, subnets:22, country:'JP',
    since:'2025-01-22',
    desc:'Tokyo validator with strong Japanese-community ties.' },
  { id:'kuro',           name:'Kuro Validator',                 role:'Validator',
    hotkey:'5GjAfRk...nWb2', stake:  9_800, nominators:312,  apy:14.4, subnets:18, country:'KR',
    since:'2024-11-26',
    desc:'Seoul-based validator. Active in the Korean Bittensor community.' },
  { id:'mosaic',         name:'Mosaic Capital',                 role:'Institutional',
    hotkey:'5Czhdj1...vqA8', stake:  8_900, nominators: 64,   apy:11.2, subnets:12, country:'KY',
    since:'2025-02-04',
    desc:'Offshore institutional fund with TAO exposure.' },
  { id:'taotrader',      name:'TaoTrader',                      role:'Validator',
    hotkey:'5DfRTQ4...x9pK', stake:  7_600, nominators:218,   apy:14.2, subnets:20, country:'US',
    since:'2024-12-20',
    desc:'Crypto-native trader-operator. Active across finance subnets.' },
  { id:'taoyield',       name:'TAO Yield',                      role:'Validator',
    hotkey:'5GhKQEz...M7Vs', stake:  6_400, nominators:412,   apy:14.8, subnets:24, country:'CH',
    since:'2025-01-08',
    desc:'Swiss validator pool. Yield-focused branding.' },
]);

/** Default sort: stake descending. */
export function validatorsByStake(){
  return VALIDATORS.slice().sort((a, b) => b.stake - a.stake);
}

export const VALIDATOR_TOTAL_STAKE   = VALIDATORS.reduce((a, v) => a + v.stake, 0);
export const VALIDATOR_TOTAL_NOMS    = VALIDATORS.reduce((a, v) => a + v.nominators, 0);
export const VALIDATOR_AVG_APY       = VALIDATORS.reduce((a, v) => a + v.apy, 0) / VALIDATORS.length;
