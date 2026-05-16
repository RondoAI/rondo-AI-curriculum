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
  { handle:'opentensor',   name:'Opentensor Foundation', role:'Stewards of the Bittensor protocol', group:'core',
    brand:'opentensor', github:'opentensor', site:'https://opentensor.ai', subnets:[],
    bio:'The foundation that stewards the Bittensor protocol. Source of SDK, btcli, subtensor chain, and the subnet template.' },
  { handle:'mcjkula',      name:'mcjkula',        role:'Mechanism design, dTAO internals',      group:'core',
    subnets:[],
    bio:'Mechanism designer behind dTAO and the chain\'s deeper incentive math. Voice on dTAO bonding curves and weight aggregation.' },

  /* ---- funds & capital ---- */
  { handle:'BarrySilbert', name:'Barry Silbert',  role:'Founder, Digital Currency Group',       group:'capital',
    brand:'dcg', site:'https://dcg.co', subnets:[],
    bio:'Founder of Digital Currency Group. Backer of Yuma Holdings, the DCG-affiliated venture vehicle for Bittensor exposure. One of the earliest institutional voices on TAO.' },
  { handle:'markjeffrey',  name:'Mark Jeffrey',   role:'Co-founder, Stillcore Capital',         group:'capital',
    brand:'stillcore', site:'https://stillcorecapital.com', subnets:[64, 62, 75],
    bio:'Serial founder. Co-founder of Stillcore Capital, the first U.S. liquid venture fund dedicated to Bittensor. Host of Hash Rate. Public proponent of Chutes, Ridges, and Hippius.' },
  { handle:'rob_svrn',     name:'Rob Greer',      role:'Partner, Stillcore Capital',            group:'capital',
    brand:'stillcore', site:'https://stillcorecapital.com', subnets:[],
    bio:'Partner at Stillcore Capital. Runs fund operations and structure.' },
  { handle:'JosephJacks_', name:'Joseph Jacks',   role:'Founder, OSS Capital',                  group:'capital',
    brand:'osscapital', site:'https://osscapital.com', subnets:[14],
    bio:'Open-source-software investor (OSS Capital). Backs decentralized infrastructure including TAOHash (SN14) via Latent Holdings.' },
  { handle:'jaltucher',    name:'James Altucher', role:'Investor, writer, podcaster',           group:'capital',
    subnets:[],
    bio:'Investor, writer, and podcaster. Public commentary on TAO, decentralized AI, and the open-source thesis.' },

  /* ---- the desk ---- */
  { handle:'subnetmagazine',name:'Subneτ Magazine', role:'This publication',                    group:'magazine',
    brand:'bittensor', site:'https://www.youtube.com/@subnetmagazine', github:'RondoAI', subnets:[],
    bio:'You\'re reading it. Research and editorial coverage of the decentralized AI economy. Built in public; the curriculum and the magazine share a repository.' },
  { handle:'Rondo_ina_Condo',name:'Rondo Campbell', role:'Founder + Editor, Subneτ Magazine',   group:'magazine',
    github:'RondoAI', subnets:[],
    bio:'Founder, editor, and engineer of Subneτ Magazine. Building from inside the U.S. prison system on a tablet. Projected release 2028.' },
  { handle:'shifa_yyz',    name:'Shifa Abbas',    role:'Co-founder, Subneτ Magazine',           group:'magazine',
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
