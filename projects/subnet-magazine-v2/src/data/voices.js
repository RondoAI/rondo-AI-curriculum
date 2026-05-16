/* =================================================================
   SUBNET MAGAZINE, ECOSYSTEM VOICES
   -----------------------------------------------------------------
   The accounts that move the Bittensor conversation on X. Used by
   the Community page to build the "voices" directory and to point
   the embedded timelines at real, live sources.

   Every handle here is a real public X account. We curate WHO to
   surface; X's free embed widget renders the live tweets. Ranked
   "most popular tweets" needs the paid X API (Basic tier) or a
   curated X List, see X_LIST_URL below.

   Each voice:
     - handle  X handle, no '@'
     - name    display name
     - role    one-line description
     - group   'core' | 'capital' | 'subnet' | 'media' | 'magazine'
   ================================================================= */

/**
 * Optional: a curated X List of ecosystem accounts. Create one on X,
 * paste its URL here (or in config.js as window.__SUBNET_CONFIG__
 * .xListUrl), and the Community page embeds it as a live timeline.
 * @type {string|null}
 */
export const X_LIST_URL =
  (typeof window !== 'undefined' && window.__SUBNET_CONFIG__ && window.__SUBNET_CONFIG__.xListUrl) || null;

/** The publication's own account, the primary live timeline. */
export const X_PRIMARY = 'subnetmagazine';

/** @typedef {'core'|'capital'|'subnet'|'media'|'magazine'} VoiceGroup */

export const GROUP_LABEL = Object.freeze({
  core:     'Founders & core',
  capital:  'Funds & capital',
  subnet:   'Subnet teams',
  media:    'Analysts & media',
  magazine: 'Subneτ Magazine desk',
});

/**
 * @typedef {Object} Voice
 * @prop {string}     handle    X handle, no '@' (required)
 * @prop {string}     name      display name
 * @prop {string}     role      one-line description
 * @prop {VoiceGroup} group     bucket for the Community / Voices pages
 * @prop {string=}    brand     key from src/lib/brand-monograms.js
 *                              (paints a real brand logo on the card)
 * @prop {string=}    github    GitHub handle / org, no '@'
 * @prop {string=}    site      personal / company URL
 * @prop {number[]=}  subnets   netuids the voice is associated with
 * @prop {string=}    bio       1-2 sentence editorial summary for
 *                              the Voices page card
 */

/** @type {readonly Voice[]} */
export const VOICES = Object.freeze([
  /* =========================================================
     FOUNDERS & CORE — the people who wrote the protocol and
     the small inner ring of long-tenure technical voices.
     ========================================================= */
  { handle:'const_reborn', name:'Jacob Steeves',  role:'Bittensor co-founder (Const)',          group:'core',
    brand:'opentensor', github:'unconst', site:'https://opentensor.ai', subnets:[], expertise:['bittensor','subtensor','yuma-consensus','emission'],
    bio:'Known as Const. Co-founder of the Bittensor protocol and the Opentensor Foundation. Technical north star for Yuma Consensus and the network\'s incentive design.' },
  { handle:'shibshib89',   name:'Ala Shaabana',   role:'Bittensor co-founder',                  group:'core',
    brand:'opentensor', github:'shibshib', site:'https://opentensor.ai', subnets:[], expertise:['bittensor','tao','emission','dtao'],
    bio:'Co-founder of Bittensor. Authority on the protocol\'s economic design and the network\'s long-term incentive trajectory.' },
  { handle:'yuma_rao',     name:'Yuma Rao',       role:'Bittensor whitepaper co-author',        group:'core',
    brand:'opentensor', site:'https://opentensor.ai', subnets:[], expertise:['yuma-consensus','weight','validator'],
    bio:'Co-author of the Bittensor whitepaper. The "Yuma" in Yuma Consensus, the weight-aggregation mechanism that pays miners and validators.' },
  { handle:'opentensor',   name:'Opentensor Foundation', role:'Stewards of the Bittensor protocol', group:'core',
    brand:'opentensor', github:'opentensor', site:'https://opentensor.ai', subnets:[],
    bio:'The foundation that stewards the Bittensor protocol. Source of SDK, btcli, subtensor chain, and the subnet template.' },
  { handle:'mcjkula',      name:'mcjkula',        role:'Mechanism design, dTAO internals',      group:'core',
    subnets:[], expertise:['dtao','alpha','weight'],
    bio:'Mechanism designer behind dTAO and the chain\'s deeper incentive math. Voice on dTAO bonding curves and weight aggregation.' },

  /* =========================================================
     FUNDS & CAPITAL — institutional allocators with public
     positions in Bittensor, plus Bittensor-dedicated funds.
     ========================================================= */
  { handle:'BarrySilbert', name:'Barry Silbert',  role:'Founder · Digital Currency Group',      group:'capital',
    brand:'dcg', site:'https://dcg.co', subnets:[],
    bio:'Founder of Digital Currency Group. Backer of Yuma Holdings, the DCG-affiliated venture vehicle for Bittensor exposure. One of the earliest institutional voices on TAO.' },
  { handle:'YumaGroup',    name:'Yuma Holdings',  role:'DCG-affiliated · Bittensor venture',    group:'capital',
    brand:'yuma', site:'https://yumaai.com', subnets:[],
    bio:'The DCG-affiliated venture vehicle dedicated to building and investing in the Bittensor ecosystem. Direct institutional capital channel into the network.' },
  { handle:'markjeffrey',  name:'Mark Jeffrey',   role:'Co-founder · Stillcore Capital',        group:'capital',
    brand:'stillcore', site:'https://stillcorecapital.com', subnets:[64, 62, 75],
    bio:'Serial founder. Co-founder of Stillcore Capital, the first U.S. liquid venture fund dedicated to Bittensor. Host of Hash Rate. Public proponent of Chutes, Ridges, and Hippius.' },
  { handle:'rob_svrn',     name:'Rob Greer',      role:'Partner · Stillcore Capital',           group:'capital',
    brand:'stillcore', site:'https://stillcorecapital.com', subnets:[],
    bio:'Partner at Stillcore Capital. Runs fund operations and structure.' },
  { handle:'JosephJacks_', name:'Joseph Jacks',   role:'Founder · OSS Capital',                 group:'capital',
    brand:'osscapital', site:'https://osscapital.com', subnets:[14],
    bio:'Open-source-software investor (OSS Capital). Backs decentralized infrastructure including TAOHash (SN14) via Latent Holdings.' },
  { handle:'jaltucher',    name:'James Altucher', role:'Investor · writer · podcaster',         group:'capital',
    subnets:[],
    bio:'Investor, writer, and podcaster. Public commentary on TAO, decentralized AI, and the open-source thesis.' },

  /* — major institutional funds with on-chain Bittensor exposure — */
  { handle:'polychain',    name:'Polychain Capital', role:'Crypto venture · long TAO holder',   group:'capital',
    brand:'polychain', site:'https://polychain.capital', subnets:[],
    bio:'Crypto-native venture and hedge fund. Long-term TAO holder; visible institutional staker.' },
  { handle:'Olaf',         name:'Olaf Carlson-Wee', role:'Founder · Polychain Capital',         group:'capital',
    brand:'polychain', site:'https://polychain.capital', subnets:[],
    bio:'Founder of Polychain. First employee at Coinbase. Long-running institutional voice on permissionless networks.' },
  { handle:'galaxyhq',     name:'Galaxy Digital', role:'Crypto financial services · TAO exposure', group:'capital',
    brand:'galaxy', site:'https://galaxy.com', subnets:[],
    bio:'Crypto financial services firm with material TAO exposure and Bittensor research coverage.' },
  { handle:'novogratz',    name:'Mike Novogratz', role:'CEO · Galaxy Digital',                  group:'capital',
    brand:'galaxy', site:'https://galaxy.com', subnets:[],
    bio:'CEO of Galaxy Digital. Public commentator on crypto + AI convergence. Galaxy publishes Bittensor research.' },
  { handle:'multicoincap', name:'Multicoin Capital', role:'Crypto venture · TAO position',      group:'capital',
    brand:'multicoin', site:'https://multicoin.capital', subnets:[],
    bio:'Crypto-thesis-driven venture and hedge fund. Multiple cycles of conviction-driven positioning around emerging crypto networks.' },
  { handle:'KyleSamani',   name:'Kyle Samani',    role:'Co-founder · Multicoin Capital',        group:'capital',
    brand:'multicoin', site:'https://multicoin.capital', subnets:[],
    bio:'Co-founder of Multicoin. One of the loudest institutional voices on permissionless infrastructure and crypto market structure.' },
  { handle:'a16zcrypto',   name:'a16z Crypto',    role:'Andreessen Horowitz · crypto + AI',     group:'capital',
    brand:'a16z', site:'https://a16zcrypto.com', subnets:[],
    bio:'The crypto-dedicated arm of Andreessen Horowitz. Deep AI and decentralized-AI coverage; portfolio touches the deAI compute stack.' },
  { handle:'PanteraCapital', name:'Pantera Capital', role:'Crypto venture · institutional',     group:'capital',
    brand:'pantera', site:'https://panteracapital.com', subnets:[],
    bio:'One of the oldest crypto-native investment firms. Public coverage of decentralized AI as a thesis category.' },
  { handle:'CoinfundIO',   name:'CoinFund',       role:'Crypto venture',                        group:'capital',
    brand:'coinfund', site:'https://coinfund.io', subnets:[],
    bio:'Crypto-native venture firm. Public positions and research on decentralized-AI infrastructure.' },
  { handle:'borderlesscap',name:'Borderless Capital', role:'Crypto venture',                    group:'capital',
    brand:'borderless', site:'https://borderlesscapital.com', subnets:[],
    bio:'Crypto-native venture fund. Active on Bittensor and the broader deAI stack.' },
  { handle:'foundrydigital', name:'Foundry Digital', role:'Validator · institutional staking',  group:'capital',
    brand:'foundry', site:'https://foundrydigital.com', subnets:[],
    bio:'Major institutional staking operator. Runs Bittensor validators with material delegated stake. Long-running DCG portfolio company.' },
  { handle:'brevanhdigital', name:'Brevan Howard Digital', role:'Digital-asset hedge fund',     group:'capital',
    brand:'brevan', site:'https://brevanhowarddigital.com', subnets:[],
    bio:'The digital-asset arm of Brevan Howard. Institutional-grade exposure to permissionless networks including TAO.' },

  /* — analysts & media — */
  { handle:'taomedia_',  name:'TAO Media', role:'Bittensor-native research and editorial', group:'media',
    site:'https://www.tao.media', subnets:[],
    bio:'Self-described "The Bittensor media company". Files deep, primary-sourced research on subnets, ecosystem moves, and protocol governance. Added to Nitter rotation so the desk picks them up automatically.' },
  { handle:'lium_io',    name:'Lium', role:'GPU compute marketplace · Subnet 51', group:'subnet',
    site:'https://lium.io', subnets:[51], expertise:['subnet'],
    bio:'Permissionless decentralized GPU marketplace running as SN51. Per @taomedia_, ~$20K/day revenue, 21% of token supply already burned via revenue-funded buybacks, ~90% cheaper than hyperscaler GPU rentals.' },
]);

/** Voices bucketed by group, in GROUP_LABEL order. */
export function voicesByGroup(){
  const order = Object.keys(GROUP_LABEL);
  return order.map(g => ({
    group: g,
    label: GROUP_LABEL[g],
    voices: VOICES.filter(v => v.group === g),
  })).filter(b => b.voices.length);
}
