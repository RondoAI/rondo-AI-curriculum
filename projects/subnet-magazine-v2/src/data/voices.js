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

/** @type {readonly {handle:string,name:string,role:string,group:VoiceGroup}[]} */
export const VOICES = Object.freeze([
  /* ---- founders & core ---- */
  { handle:'const_reborn', name:'Jacob Steeves',  role:'Bittensor co-founder (Const)',          group:'core' },
  { handle:'opentensor',   name:'Opentensor',     role:'The Opentensor Foundation',             group:'core' },
  { handle:'mcjkula',      name:'mcjkula',        role:'Mechanism design, dTAO internals',      group:'core' },

  /* ---- funds & capital ---- */
  { handle:'BarrySilbert', name:'Barry Silbert',  role:'DCG, long-time TAO advocate',          group:'capital' },
  { handle:'markjeffrey',  name:'Mark Jeffrey',   role:'Stillcore Capital · host of Hash Rate', group:'capital' },
  { handle:'StillcoreCap', name:'Stillcore Capital', role:'Liquid venture fund for decentralized AI', group:'capital' },
  { handle:'rob_svrn',     name:'Rob Greer',      role:'Stillcore Capital, fund operations',   group:'capital' },
  { handle:'JosephJacks_', name:'Joseph Jacks',   role:'OSS Capital, open-source thesis',      group:'capital' },
  { handle:'jaltucher',    name:'James Altucher', role:'Investor, writer, podcaster',           group:'capital' },

  /* ---- subnet teams ---- */
  { handle:'ridges_ai',    name:'Ridges AI',      role:'Autonomous software engineering subnet', group:'subnet' },
  { handle:'hobbleabbas',  name:'Shakeel Hussain',role:'Builder behind Ridges AI',              group:'subnet' },
  { handle:'MetaNOVA_labs',name:'Metanova Labs',  role:'SN68, decentralized drug discovery',   group:'subnet' },
  { handle:'sportstensor', name:'Sportstensor',   role:'Sports prediction subnet',              group:'subnet' },
  { handle:'zeussubnet',   name:'Zeus Subnet',    role:'Climate & weather modelling subnet',    group:'subnet' },
  { handle:'polariscloudai',name:'Polaris Cloud', role:'Distributed compute subnet',            group:'subnet' },

  /* ---- analysts & media ---- */
  { handle:'taostats',     name:'taostats',       role:'Bittensor analytics & explorer',        group:'media' },
  { handle:'Old_Samster',  name:'Sami Kassab',    role:'Messari, Bittensor research',          group:'media' },
  { handle:'TheTaoPod',    name:'The Tao Pod',    role:'Bittensor ecosystem podcast',           group:'media' },
  { handle:'TAOTemplar',   name:'TAO Templar',    role:'Ecosystem commentary & education',      group:'media' },
  { handle:'DreadBong0',   name:'DreadBong0',     role:'Subnet coverage & alpha',               group:'media' },
  { handle:'AltcoinMillie',name:'Altcoin Millie', role:'Crypto & decentralized-AI media',       group:'media' },

  /* ---- the desk ---- */
  { handle:'subnetmagazine',name:'Subneτ Magazine', role:'This publication, ecosystem research', group:'magazine' },
  { handle:'Rondo_ina_Condo',name:'Laron Campbell', role:'Subneτ Magazine, writer',             group:'magazine' },
  { handle:'shifa_yyz',    name:'Shifa',          role:'Subneτ Magazine, contributor',          group:'magazine' },
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
