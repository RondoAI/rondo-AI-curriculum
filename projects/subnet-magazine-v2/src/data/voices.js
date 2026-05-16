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
  /* ---- founders & core ---- */
  { handle:'const_reborn', name:'Jacob Steeves',  role:'Bittensor co-founder (Const)',          group:'core',
    brand:'opentensor', github:'unconst', site:'https://opentensor.ai', subnets:[],
    bio:'Known as Const. Co-founder of the Bittensor protocol and the Opentensor Foundation. Technical north star for Yuma Consensus and the network\'s incentive design.' },
  { handle:'opentensor',   name:'Opentensor',     role:'The Opentensor Foundation',             group:'core',
    brand:'opentensor', github:'opentensor', site:'https://opentensor.ai', subnets:[],
    bio:'The foundation that stewards the Bittensor protocol. Source of SDK, btcli, subtensor chain, and the subnet template.' },
  { handle:'mcjkula',      name:'mcjkula',        role:'Mechanism design, dTAO internals',      group:'core',
    subnets:[],
    bio:'Mechanism designer behind dTAO and the chain\'s deeper incentive math. Voice on dTAO bonding curves and weight aggregation.' },

  /* ---- funds & capital ---- */
  { handle:'BarrySilbert', name:'Barry Silbert',  role:'DCG, long-time TAO advocate',           group:'capital',
    brand:'dcg', site:'https://dcg.co', subnets:[],
    bio:'Founder of Digital Currency Group. Backer of Yuma Holdings, the DCG-affiliated venture vehicle for Bittensor exposure. One of the earliest institutional voices on TAO.' },
  { handle:'markjeffrey',  name:'Mark Jeffrey',   role:'Stillcore Capital · host of Hash Rate', group:'capital',
    brand:'stillcore', site:'https://stillcorecapital.com', subnets:[64, 62, 75],
    bio:'Serial founder. Co-founder of Stillcore Capital, the first U.S. liquid venture fund dedicated to Bittensor. Host of Hash Rate. Public proponent of Chutes, Ridges, and Hippius.' },
  { handle:'StillcoreCap', name:'Stillcore Capital', role:'Liquid venture fund for decentralized AI', group:'capital',
    brand:'stillcore', site:'https://stillcorecapital.com', subnets:[],
    bio:'U.S. liquid venture fund dedicated to Bittensor and the decentralized-AI economy. Three-pillar strategy: staked TAO reserve, subnet investing, optional subnet creation.' },
  { handle:'rob_svrn',     name:'Rob Greer',      role:'Stillcore Capital, fund operations',    group:'capital',
    brand:'stillcore', site:'https://stillcorecapital.com', subnets:[],
    bio:'Partner at Stillcore Capital. Runs fund operations and structure.' },
  { handle:'JosephJacks_', name:'Joseph Jacks',   role:'OSS Capital, open-source thesis',       group:'capital',
    brand:'osscapital', site:'https://osscapital.com', subnets:[14],
    bio:'Open-source-software investor (OSS Capital). Backs decentralized infrastructure including TAOHash (SN14) via Latent Holdings.' },
  { handle:'jaltucher',    name:'James Altucher', role:'Investor, writer, podcaster',           group:'capital',
    subnets:[],
    bio:'Investor, writer, and podcaster. Public commentary on TAO, decentralized AI, and the open-source thesis.' },

  /* ---- subnet teams ---- */
  { handle:'rayon_labs',   name:'Rayon Labs',     role:'Chutes · Gradients · Nineteen (SN64/56/19)', group:'subnet',
    brand:'rayonlabs', site:'https://rayonlabs.ai', subnets:[64, 56, 19],
    bio:'Operates Chutes (SN64, serverless GPU compute), Gradients (SN56, distributed training), and Nineteen (SN19, text inference). The most-cited operator team in the ecosystem by token throughput.' },
  { handle:'MacrocosmosAI',name:'Macrocosmos',    role:'Apex · IOTA · Data Universe (SN1/9/13)', group:'subnet',
    brand:'macrocosmos', site:'https://macrocosmos.ai', github:'macrocosmos-ai', subnets:[1, 9, 13],
    bio:'Multi-subnet operator running Apex (SN1, open-domain prompting), IOTA / Pretraining (SN9, from-scratch language-model training), Data Universe (SN13, open data curation), and Mainframe.' },
  { handle:'manifoldlabs', name:'Manifold Labs',  role:'Targon (SN4)',                          group:'subnet',
    brand:'manifold', site:'https://manifold.inc', github:'manifold-inc', subnets:[4],
    bio:'Operates Targon (SN4), the bandwidth-priced deterministic LLM inference subnet. Pricing model materially undercuts Together and Fireworks for batch workloads.' },
  { handle:'taoshiio',     name:'Taoshi',         role:'PTN / Vanta (SN8)',                     group:'subnet',
    brand:'taoshi', site:'https://taoshi.io', github:'taoshidev', subnets:[8],
    bio:'Operates PTN (SN8), the proprietary trading network where miners submit live trades scored on actual PnL. The clearest "real-world revenue from subnet output" story in the ecosystem.' },
  { handle:'NousResearch', name:'Nous Research',  role:'Nous / Finetuning (SN6)',               group:'subnet',
    brand:'nous', site:'https://nousresearch.com', github:'NousResearch', subnets:[6],
    bio:'Operates Nous (SN6, finetuning competitions). Long-standing open-source LLM research lab cited well outside the Bittensor ecosystem; one of the network\'s most credible research voices.' },
  { handle:'datura_ai',    name:'Datura',         role:'Lium (SN51) · Corcel · Zeus',           group:'subnet',
    brand:'datura', site:'https://datura.ai', subnets:[51, 18],
    bio:'Operates Lium (SN51), a long-tail GPU compute aggregator. Datura also builds Corcel and the Zeus / Cortex.t (SN18) ecosystem.' },
  { handle:'hippiuscloud', name:'Hippius (MogMachine + mast3rdubs)', role:'Hippius (SN75)',     group:'subnet',
    brand:'hippius', site:'https://hippius.com', subnets:[75],
    bio:'Co-founders of Hippius (SN75), the decentralized storage subnet that replaced IPFS with an in-house Arion engine and shipped the Hermes cross-subnet messenger in 2026. Featured in our May 2026 profile.' },
  { handle:'AffineFoundation', name:'Affine Foundation', role:'Affine (SN120)',                 group:'subnet',
    brand:'affine', github:'AffineFoundation', subnets:[120],
    bio:'Operates Affine (SN120), the winner-takes-all RL competitions subnet. Sits on top of Chutes, Gradients, and Lium, making it meta-infrastructure that compounds on the rest of the network.' },
  { handle:'tplr_ai',      name:'Templar / Teutonic', role:'Covenant-72B (SN3)',                group:'subnet',
    brand:'templar', site:'https://tplr.ai', subnets:[3],
    bio:'Original Templar team behind Covenant-72B, the first decentralized 72B-param model trained over the public internet (MMLU 67.1, March 2026). Community continuation operates as Teutonic post-Covenant.' },
  { handle:'ridges_ai',    name:'Ridges AI',      role:'Autonomous SWE-agent subnet (SN62)',    group:'subnet',
    brand:'ridges', site:'https://ridges.ai', github:'ridgesai', subnets:[62],
    bio:'SWE-agent subnet where miners ship autonomous coding agents scored on SWE-bench-style tasks. Highest mindshare ranking of any Bittensor subnet through 2026.' },
  { handle:'hobbleabbas',  name:'Shakeel Hussain', role:'Builder behind Ridges AI',             group:'subnet',
    subnets:[62],
    bio:'Builder and operator behind Ridges (SN62). One of the most visible technical voices in the agent-subnet space.' },
  { handle:'latent_holdings', name:'Latent Holdings', role:'TAOHash (SN14)',                    group:'subnet',
    brand:'latent', subnets:[14],
    bio:'Technology shop associated with Joseph Jacks. Operates TAOHash (SN14), the only subnet producing a non-AI commodity at scale: SHA-256 hashrate. Closed-loop BTC-to-TAO yield flywheel.' },
  { handle:'MetaNOVA_labs',name:'Metanova Labs',  role:'SN68, decentralized drug discovery',    group:'subnet',
    subnets:[68],
    bio:'Operates the decentralized drug-discovery subnet (SN68). One of the first deAI applications outside core LLM workloads.' },
  { handle:'sportstensor', name:'Sportstensor',   role:'Sports prediction subnet',              group:'subnet',
    subnets:[],
    bio:'Sports prediction subnet. Miners submit forecasts; validators score against real-world outcomes.' },
  { handle:'zeussubnet',   name:'Zeus Subnet',    role:'Climate & weather modelling subnet',    group:'subnet',
    subnets:[18],
    bio:'Climate and weather modelling subnet. Part of the Datura / Corcel ecosystem.' },
  { handle:'polariscloudai',name:'Polaris Cloud', role:'Distributed compute subnet',            group:'subnet',
    subnets:[49],
    bio:'Distributed compute subnet (SN49). Long-tail GPU aggregation, capacity-marketplace model.' },

  /* ---- analysts & media ---- */
  { handle:'taostats',     name:'taostats',       role:'Bittensor analytics & explorer',        group:'media',
    brand:'taostats', site:'https://taostats.io', subnets:[],
    bio:'The chain\'s most-used explorer and analytics. Public API powers a meaningful portion of the ecosystem\'s third-party dashboards, including this magazine\'s live numbers.' },
  { handle:'Old_Samster',  name:'Sami Kassab',    role:'Messari, Bittensor research',           group:'media',
    site:'https://messari.io', subnets:[],
    bio:'Bittensor research lead at Messari. Authoritative voice on subnet economics and on-chain metrics.' },
  { handle:'TheTaoPod',    name:'The Tao Pod',    role:'Bittensor ecosystem podcast',           group:'media',
    subnets:[],
    bio:'Ecosystem podcast. Regular conversations with subnet operators and the operator-investor capital stack.' },
  { handle:'TAOTemplar',   name:'TAO Templar',    role:'Ecosystem commentary & education',      group:'media',
    subnets:[],
    bio:'Educator and commentator on the Bittensor ecosystem. Long-form X threads on subnet mechanics and the protocol\'s incentive math.' },
  { handle:'DreadBong0',   name:'DreadBong0',     role:'Subnet coverage & alpha',               group:'media',
    subnets:[],
    bio:'Real-time subnet coverage. Independent voice on emission rotations, dereg windows, and operator drama.' },
  { handle:'AltcoinMillie',name:'Altcoin Millie', role:'Crypto & decentralized-AI media',       group:'media',
    subnets:[],
    bio:'Crypto and decentralized-AI media. Brings the Bittensor story to broader crypto audiences.' },

  /* ---- the desk ---- */
  { handle:'subnetmagazine',name:'Subneτ Magazine', role:'This publication, ecosystem research', group:'magazine',
    brand:'bittensor', site:'https://www.youtube.com/@subnetmagazine', github:'RondoAI', subnets:[],
    bio:'You\'re reading it. Research and editorial coverage of the decentralized AI economy. Built in public; the curriculum and the magazine share a repository.' },
  { handle:'Rondo_ina_Condo',name:'Rondo Campbell', role:'Subneτ Magazine, founder + editor',   group:'magazine',
    github:'RondoAI', subnets:[],
    bio:'Founder, editor, and sole engineer of Subneτ Magazine. Building from inside the U.S. prison system on a tablet. Projected release 2028.' },
  { handle:'shifa_yyz',    name:'Shifa Abbas',    role:'Subneτ Magazine, co-founder',           group:'magazine',
    site:'https://ca.linkedin.com/in/shifaabbas', subnets:[],
    bio:'Co-founder of Subneτ Magazine. The outside partner to the inside builder: founder relationships, interview sourcing, channel and distribution.' },
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
