/* =================================================================
   SUBNET MAGAZINE, FOUNDERS + CROSS-SUBNET CONNECTION GRAPH
   -----------------------------------------------------------------
   Founder profiles and the deduped edge list that backs the
   shared-history graph viz on the site. Top-25 subnets by daily τ
   emission as of May 2026, matched to the keying used in
   ./subnet-bios.js.

   Sourcing rules: every claim should be defensible against a
   public source (LinkedIn, parent-company site, podcast,
   press coverage). Where a single source is the whole claim, the
   notableHook prose says "reportedly." Where two sources contradict,
   we omit the claim.

   Cross-reference document:
     ../../notes/founders-and-connections-2026-05.md

   Merge target: see byNetuid() helper below; the site joins this on
   netuid against SUBNETS in ./subnets.js and SUBNET_BIOS in
   ./subnet-bios.js.
   ================================================================= */

/**
 * @typedef {Object} FounderPerson
 * @prop {string}  name
 * @prop {string}  role
 * @prop {{x?:string, github?:string, linkedin?:string, medium?:string}=} handles
 * @prop {string}  background
 * @prop {string=} education
 * @prop {string=} priorBittensorWork
 * @prop {string}  notableHook
 *
 * @typedef {Object} FounderRow
 * @prop {number}   netuid
 * @prop {string}   subnet
 * @prop {string}   parent
 * @prop {FounderPerson[]} founders
 * @prop {string[]} investors          // investors in the parent
 * @prop {{netuid:number, relation:string}[]} crossSubnetLinks
 * @prop {'high'|'medium'|'low'} confidence
 * @prop {string}   researched         // YYYY-MM-DD
 * @prop {string[]} sources
 */

/** @type {readonly FounderRow[]} */
export const FOUNDERS = Object.freeze([

  // RANK 1
  {
    netuid: 64,
    subnet: 'Chutes',
    parent: 'Rayon Labs',
    founders: [
      {
        name: 'namoray (pseudonym)',
        role: 'Lead / public face of Rayon Labs',
        handles: { x: '@namoray_', github: 'rayonlabs' },
        background: 'Bittensor-native operator, formerly a top miner before becoming a subnet operator; main public voice for Rayon across podcast appearances.',
        priorBittensorWork: 'Top miner before operating SN19 Nineteen; now coordinates SN64, SN56, SN19.',
        notableHook: 'Rayon Labs has no public Series A. The operator that controls ~23.7% of all daily τ emissions runs on internal protocol economics, not VC subsidy.',
      },
      {
        name: 'sangar (pseudonym)',
        role: 'Co-founder / engineering',
        handles: {},
        background: 'Co-operator at Rayon Labs; identity intentionally pseudonymous.',
        notableHook: 'Part of the most consequential anonymous operator team in the network.',
      },
      {
        name: 'carro (pseudonym)',
        role: 'Co-founder / engineering',
        handles: {},
        background: 'Co-operator at Rayon Labs; identity intentionally pseudonymous.',
        notableHook: 'Part of the most consequential anonymous operator team in the network.',
      },
    ],
    investors: [], // no public VC round on Rayon Labs itself
    crossSubnetLinks: [
      { netuid: 56, relation: 'same operator · Rayon Labs trio' },
      { netuid: 19, relation: 'same operator · Rayon Labs trio' },
      { netuid: 120, relation: 'Affine depends on Chutes for compute · architectural' },
    ],
    confidence: 'high',
    researched: '2026-05-15',
    sources: [
      'https://oakresearch.io/en/analyses/innovations/rayon-labs-subnet-leader-bittensor-tao',
      'https://messari.io/report/rayon-labs-the-subnet-trifecta',
      'https://www.blocmates.com/videos/barry-silbert-leaps-into-bittensor-a-new-era-for-tao-w-namoray-from-rayon-labs',
      'https://rayonlabs.ai/',
      'https://github.com/rayonlabs',
    ],
  },

  // RANK 2
  {
    netuid: 56,
    subnet: 'Gradients',
    parent: 'Rayon Labs',
    founders: [
      { name: 'namoray (pseudonym)', role: 'Lead', handles: { x: '@namoray_', github: 'rayonlabs' }, background: 'Same Rayon Labs team as SN64 Chutes.', notableHook: 'Gradients customers training 118B-parameter models for ~$5/hr are paying that because the τ emission subsidy underwrites the Chutes compute SN56 runs on, SN56 is a loss-led acquisition channel for SN64.' },
      { name: 'sangar (pseudonym)', role: 'Co-founder', handles: {}, background: 'Same Rayon Labs team.', notableHook: 'Part of vertically-integrated training+inference stack.' },
      { name: 'carro (pseudonym)', role: 'Co-founder', handles: {}, background: 'Same Rayon Labs team.', notableHook: 'Part of vertically-integrated training+inference stack.' },
    ],
    investors: [],
    crossSubnetLinks: [
      { netuid: 64, relation: 'same operator · Gradients runs on Chutes for compute' },
      { netuid: 19, relation: 'same operator · Rayon Labs trio' },
    ],
    confidence: 'high',
    researched: '2026-05-15',
    sources: [
      'https://oakresearch.io/en/analyses/innovations/rayon-labs-subnet-leader-bittensor-tao',
      'https://messari.io/report/rayon-labs-the-subnet-trifecta',
      'https://github.com/rayonlabs/G.O.D',
    ],
  },

  // RANK 3
  {
    netuid: 4,
    subnet: 'Targon',
    parent: 'Manifold Labs',
    founders: [
      {
        name: 'Robert Myers',
        role: 'Founder & CEO',
        handles: { linkedin: 'robert-myers-3a8426161' },
        background: 'Founding Bittensor contributor, miner and subnet designer.',
        priorBittensorWork: 'Senior Software Engineer at the Opentensor Foundation prior to founding Manifold.',
        notableHook: 'Manifold\'s entire senior bench is ex-Opentensor, Myers (ex-Senior SWE) + Woodman (ex-COO). The whole company is structurally an Opentensor spinout.',
      },
      {
        name: 'James Woodman',
        role: 'COO',
        handles: { linkedin: 'james-woodman' },
        background: 'Operations leader.',
        priorBittensorWork: 'COO of the Opentensor Foundation prior to joining Manifold.',
        notableHook: 'Held the same COO title at Opentensor that he now holds at Manifold.',
      },
    ],
    investors: ['OSS Capital (Joseph Jacks, lead)'],
    crossSubnetLinks: [
      { netuid: 14, relation: 'OSS Capital led SN4 Series A; OSS principal JJ operates SN14 TAOHash' },
      { netuid: 6,  relation: 'OSS Capital is also a seed investor in Nous Research (SN6)' },
      { netuid: 120, relation: 'Both senior leaders are ex-Opentensor, where Const was CEO' },
    ],
    confidence: 'high',
    researched: '2026-05-15',
    sources: [
      'https://www.manifold.inc/',
      'https://oss.capital/oss-capital-leads-10-5m-series-a-in-manifold-labs-alongside-industry-legends/',
      'https://www.linkedin.com/in/robert-myers-3a8426161/',
      'https://www.linkedin.com/in/james-woodman/',
      'https://oss.capital/tag/bittensor/',
    ],
  },

  // RANK 4
  {
    netuid: 3,
    subnet: 'Templar (community-rebuilt as Teutonic)',
    parent: 'Covenant AI (deprecated April 9, 2026) / community',
    founders: [
      {
        name: 'Samuel B. Dare',
        role: 'Founder, Covenant AI (until exit)',
        handles: { linkedin: 'samuel-b-dare' },
        background: 'AI researcher and entrepreneur; founded Covenant AI in January 2024 to operationalize Templar research. Led the training of Covenant-72B, the largest decentralized LLM run on record at the time (March 2026).',
        notableHook: 'Sam Dare lists UAE on LinkedIn, the founder of what was, until April, Bittensor\'s flagship pretraining subnet was geographically detached from the Bay Area / NYC / London cluster. His April 2026 public exit citing "decentralization theatre" is also the network\'s first major founder-vs-founder rupture (Dare vs Const).',
      },
    ],
    investors: [], // no public VC round
    crossSubnetLinks: [
      { netuid: 39, relation: 'former Covenant trio · same Dare founder' },
      { netuid: 81, relation: 'former Covenant trio · same Dare founder' },
      { netuid: 9,  relation: 'architectural rival on decentralized pretraining (vs Macrocosmos IOTA)' },
      { netuid: 120, relation: 'Sam Dare vs Const public dispute April 2026' },
    ],
    confidence: 'high',
    researched: '2026-05-15',
    sources: [
      'https://iq.wiki/wiki/sam-dare',
      'https://www.theblock.co/post/396959/covenant-ai-exits-bittensor-tao',
      'https://ae.linkedin.com/in/samuel-b-dare',
      'https://github.com/tplr-ai',
    ],
  },

  // RANK 5
  {
    netuid: 51,
    subnet: 'Lium',
    parent: 'Datura AI',
    founders: [
      {
        name: 'Fish (pseudonym)',
        role: 'Founder',
        handles: { x: '@fish_datura', medium: '@surcyf' },
        background: 'Prolific Bittensor miner-turned-operator; previously held the SN18 slot (then "Cortex.t") before selling it to Ørpheus AI in early 2025.',
        priorBittensorWork: 'Previously operated SN18 (Cortex.t era), sold the slot, redirected Datura to Lium (formerly Celium).',
        notableHook: 'Reportedly the only Bittensor operator to have run two top-25 subnets sequentially via a documented slot sale. Lium is also the only subnet whose external rental revenue (~$432K/month) exceeds its τ emission subsidy.',
      },
    ],
    investors: [], // Datura is reported as private/bootstrapped on public sources
    crossSubnetLinks: [
      { netuid: 18, relation: 'Datura/Fish previously held the SN18 slot and sold it to Ørpheus AI' },
    ],
    confidence: 'high',
    researched: '2026-05-15',
    sources: [
      'https://www.datura.ai/',
      'https://x.com/fish_datura',
      'https://medium.com/@surcyf',
      'https://github.com/Datura-ai/lium-io',
      'https://x.com/CryptoZPunisher/status/1904225837051728036',
    ],
  },

  // RANK 6
  {
    netuid: 14,
    subnet: 'TAOHash',
    parent: 'Latent Holdings',
    founders: [
      {
        name: 'Joseph Jacks',
        role: 'CEO, Latent Holdings · Founder/GP, OSS Capital',
        handles: { x: '@JosephJacks_', linkedin: 'josephjacks' },
        background: 'Founder of OSS Capital (2018), the world\'s first VC firm dedicated exclusively to commercial open-source startups; >40 inception/seed rounds, >$200M deployed.',
        notableHook: 'Quietly the most concentrated single person-of-influence in Bittensor: simultaneously operator of SN14 (Latent), lead investor of SN4 (Manifold $10.5M Series A), seed investor in SN6 (Nous), and advisor to TAO Synergies (NASDAQ:TAOX). Operator + investor + advisor + treasury seats in one person.',
      },
    ],
    investors: [], // Latent is JJ's vehicle; no upstream VC
    crossSubnetLinks: [
      { netuid: 4, relation: 'OSS Capital (JJ) led Manifold\'s Series A' },
      { netuid: 6, relation: 'OSS Capital (JJ) participated in Nous Research seed' },
    ],
    confidence: 'high',
    researched: '2026-05-15',
    sources: [
      'https://oss.capital/team/joseph-jacks/',
      'https://x.com/JosephJacks_/status/1914706126249320860',
      'https://github.com/latent-to/taohash',
      'https://www.prnewswire.com/news-releases/tao-synergies-welcomes-top-bittensor-tao-leader-as-advisor-for-ai-focused-crypto-treasury-strategy-302538426.html',
    ],
  },

  // RANK 7
  {
    netuid: 8,
    subnet: 'PTN (Vanta)',
    parent: 'Taoshi',
    founders: [
      {
        name: 'Arrash Yasavolian',
        role: 'Founder & CEO',
        handles: { x: '@arrashyasa', linkedin: 'arrashyasa' },
        background: '~15 years in tech; biochem-to-tech transition via sales then software engineering; founder of TARVIS Labs (algorithmic trading), acquired by Taoshi in 2024. Based SF Bay Area.',
        education: 'UC Davis (biochemistry & molecular biology)',
        notableHook: 'Yasavolian acqui-hired himself into the Taoshi CEO role via TARVIS Labs; the $30M+ rewards pool he runs is the largest emission-funded prop-firm-equivalent on Earth, structurally only possible inside Bittensor.',
      },
    ],
    investors: [],
    crossSubnetLinks: [],
    confidence: 'high',
    researched: '2026-05-15',
    sources: [
      'https://www.linkedin.com/in/arrashyasa/',
      'https://www.taoshi.io/',
      'https://www.proofoftalk.io/speakers/arrash-yasavolian',
      'https://www.youtube.com/watch?v=oZmIKSfBHX8',
    ],
  },

  // RANK 8
  {
    netuid: 5,
    subnet: 'OpenKaito',
    parent: 'Kaito AI',
    founders: [
      {
        name: 'Yu Hu',
        role: 'Founder & CEO',
        handles: { x: '@Punk9277', linkedin: 'yuhu9277' },
        background: 'Investment banking analyst at Deutsche Bank (London, 2014-2017); Citadel (London, 2017-2022) managing long/short European-and-US equities. Left Citadel in 2022 to start Kaito from Seattle; now based in Singapore.',
        education: 'University of Cambridge',
        notableHook: 'Yu Hu is by a wide margin the most TradFi-pedigreed founder in the entire Bittensor top 25, Citadel is the highest-prestige systematic hedge fund in the world. His presence is the strongest signal that institutional quant talent considers decentralized AI a real opportunity.',
      },
    ],
    investors: ['Sequoia Capital (Kaito parent rounds)', 'Dragonfly Capital (Kaito parent rounds)'],
    crossSubnetLinks: [
      { netuid: 69, relation: 'Same operator · KaitoFM (SN69) is the consumer-feed sibling of OpenKaito (SN5)' },
    ],
    confidence: 'high',
    researched: '2026-05-15',
    sources: [
      'https://iq.wiki/wiki/yu-hu',
      'https://www.linkedin.com/in/yuhu9277/',
      'https://oakresearch.io/en/reports/protocols/kaito-complete-overview-first-attention-market',
      'https://x.com/Param_eth/status/1965085813236002964',
    ],
  },

  // RANK 9
  {
    netuid: 19,
    subnet: 'Nineteen',
    parent: 'Rayon Labs',
    founders: [
      { name: 'namoray (pseudonym)', role: 'Lead operator on SN19', handles: { x: '@namoray_' }, background: 'Originally a top miner on Bittensor before operating Nineteen. The longest individual operator track record in the top emission cohort.', notableHook: 'SN19\'s world-record latency record (defended against Groq/Cerebras/SambaNova on equivalent hardware) was set with miner-side experience optimizing for adversarial validation.' },
      { name: 'sangar (pseudonym)', role: 'Co-founder', handles: {}, background: 'Same Rayon Labs team.', notableHook: 'Part of Rayon trio.' },
      { name: 'carro (pseudonym)', role: 'Co-founder', handles: {}, background: 'Same Rayon Labs team.', notableHook: 'Part of Rayon trio.' },
    ],
    investors: [],
    crossSubnetLinks: [
      { netuid: 64, relation: 'same operator · Rayon Labs trio · routes time-critical Chutes traffic to SN19' },
      { netuid: 56, relation: 'same operator · Rayon Labs trio' },
    ],
    confidence: 'high',
    researched: '2026-05-15',
    sources: [
      'https://github.com/rayonlabs/nineteen',
      'https://learnbittensor.org/subnets/namoray/nineteen',
      'https://messari.io/report/rayon-labs-the-subnet-trifecta',
    ],
  },

  // RANK 10
  {
    netuid: 120,
    subnet: 'Affine',
    parent: 'Affine Foundation',
    founders: [
      {
        name: 'Jacob Robert Steeves ("Const")',
        role: 'Founder',
        handles: { x: '@const_reborn', linkedin: 'jacob-robert-steeves-7b0629b8', github: 'unconst' },
        background: 'Co-founded Bittensor in 2019 with Ala Shaabana; ML researcher at Knowm (2015-2016); Software Engineer at Google (2016-2018); CEO of the Opentensor Foundation until stepping down in 2025 to "build in the trenches again."',
        education: 'Simon Fraser University, BASc Mathematics & Computer Science',
        priorBittensorWork: 'Co-founded Bittensor itself; this is his own subnet.',
        notableHook: 'Const choosing to build Affine on the network he founded is the sharpest possible statement of his post-CEO worldview, Affine is structurally parasitic on every other subnet (RL coordination pulls from them all), and Const built it deliberately to become so.',
      },
    ],
    investors: [],
    crossSubnetLinks: [
      { netuid: 64, relation: 'Affine architecturally depends on Chutes for compute' },
      { netuid: 56, relation: 'Affine architecturally depends on Gradients for training' },
      { netuid: 51, relation: 'Affine architecturally depends on Lium for compute' },
      { netuid: 3, relation: 'Const vs Sam Dare public dispute April 2026' },
    ],
    confidence: 'high',
    researched: '2026-05-15',
    sources: [
      'https://iq.wiki/wiki/jacob-robert-steeves',
      'https://github.com/AffineFoundation/affine-cortex',
      'https://x.com/JosephJacks_/status/1951049717988655278',
      'https://simplytao.ai/blog/your-simple-guide-to-affine-sn120',
    ],
  },

  // RANK 11
  {
    netuid: 62,
    subnet: 'Ridges',
    parent: 'Ridges AI',
    founders: [
      {
        name: 'Shak',
        role: 'Founder',
        handles: { x: '@shak' /* approximate */ , github: 'ridgesai' },
        background: 'Reportedly prior engineering experience at Twitter/X and "Superbase" (likely Supabase, per Bittensor123 profile). Founded Ridges as "Agentao," rebranded in 2025.',
        notableHook: 'Only top-25 founder publicly claiming a Twitter engineering background. Ridges SWE-bench scores went from 4% to 41% in a week of competitive miner pressure; reportedly hit 66.8%, competing with frontier-lab tooling on a ~$1M annual incentive budget.',
      },
    ],
    investors: [],
    crossSubnetLinks: [],
    confidence: 'medium', // founder identity / full name not consistently surfaced
    researched: '2026-05-15',
    sources: [
      'https://bittensor.guru/s2e11-subnet-62-ridges-w-shak',
      'https://github.com/ridgesai/ridges',
      'https://bittensor123.com/subnets/sn62/',
      'https://www.youtube.com/watch?v=Xj-cU_04idY',
    ],
  },

  // RANK 12
  {
    netuid: 1,
    subnet: 'Apex',
    parent: 'Macrocosmos',
    founders: [
      {
        name: 'Will Squires',
        role: 'Co-Founder & CEO',
        handles: { linkedin: 'willsquires' },
        background: 'Infrastructure engineer; previously worked on Crossrail and HS2 (two of the largest UK civil-engineering projects on record); invited to the Mayor of London\'s infrastructure advisory panel.',
        notableHook: 'The only top-25 founder whose prior career was UK megaproject infrastructure; brings construction-grade program-management discipline to a network mostly run by ex-researchers.',
      },
      {
        name: 'Steffen Cruz',
        role: 'Co-Founder & CTO',
        handles: { x: '@SteffenCruz', linkedin: 'steffen-cruz' },
        background: 'Original architect of SN1\'s codebase; founding engineer at SolidState AI (PIML).',
        education: 'PhD, Experimental/Subatomic Nuclear Physics, University of British Columbia (Canada)',
        priorBittensorWork: 'CTO of the Opentensor Foundation prior to co-founding Macrocosmos in March 2024.',
        notableHook: 'The only top-25 operator-side technical co-founder who held the CTO title at Opentensor itself; "long-time friend" of Squires per their joint Bittensor Guru appearance, Macrocosmos is a deliberate continuation of Cruz\'s Opentensor work.',
      },
    ],
    investors: [],
    crossSubnetLinks: [
      { netuid: 9, relation: 'same Macrocosmos team' },
      { netuid: 13, relation: 'same Macrocosmos team' },
      { netuid: 25, relation: 'same Macrocosmos team' },
      { netuid: 4, relation: 'Squires/Cruz/McCrindle all ex-Opentensor (alongside Myers/Woodman at SN4)' },
    ],
    confidence: 'high',
    researched: '2026-05-15',
    sources: [
      'https://www.linkedin.com/in/willsquires/',
      'https://www.proofoftalk.io/speakers/steffen-cruz',
      'https://www.macrocosmos.ai/about',
      'https://www.taopill.ai/p/an-interview-with-will-squires-from-macrocosmos',
      'https://x.com/bittingthembits/status/1801608417791934505',
    ],
  },

  // RANK 13
  {
    netuid: 44,
    subnet: 'Score',
    parent: 'Score Technologies',
    founders: [
      {
        name: 'Tim Kalic',
        role: 'Co-Founder & CTO',
        handles: { linkedin: 'timkalic' },
        background: 'Technology leader / CTO; sports tech, Web3, and ecommerce background.',
        education: 'Bournemouth University',
        notableHook: 'Score is the first top-25 subnet to sign a publicly disclosed B2B contract with another top-25 subnet (Data Universe / SN13), Kalic\'s team set the prototype for inter-subnet commerce.',
      },
      {
        name: 'Nigel Grant',
        role: 'Co-Founder & CSO',
        handles: { linkedin: 'nigel-grant-b762159b' },
        background: 'Also listed as CRO/Co-founder of SIRE (ICM Analytics), an AI sports-betting analysis brand.',
        notableHook: 'Grant\'s simultaneous SIRE role gives Score a direct line into the betting-analytics market without owning the betting brand itself.',
      },
    ],
    investors: ['Yuma (DCG), accelerated cohort'],
    crossSubnetLinks: [
      { netuid: 13, relation: 'Data partnership · Score is a paying downstream customer of Data Universe (Q1 2026)' },
    ],
    confidence: 'high',
    researched: '2026-05-15',
    sources: [
      'https://www.linkedin.com/in/nigel-grant-b762159b/',
      'https://www.linkedin.com/in/timkalic/',
      'https://github.com/score-technologies/score-vision',
      'https://macrocosmosai.substack.com/p/result-sn44-score-partners-with-sn13s',
      'https://icm-analytics.com/icm-research/sire/',
    ],
  },

  // RANK 14
  {
    netuid: 13,
    subnet: 'Data Universe',
    parent: 'Macrocosmos',
    founders: [
      { name: 'Will Squires', role: 'Co-Founder & CEO', handles: { linkedin: 'willsquires' }, background: 'See SN1.', notableHook: 'Same Macrocosmos team.' },
      { name: 'Steffen Cruz', role: 'Co-Founder & CTO', handles: { linkedin: 'steffen-cruz' }, background: 'See SN1.', notableHook: 'Same Macrocosmos team.' },
      {
        name: 'Brian McCrindle',
        role: 'Founding Engineer · Subnet Lead (SN13 + SN25)',
        handles: { linkedin: 'brian-mccrindle' },
        background: 'Subnet lead for both Data Universe and Mainframe.',
        education: 'MASc, Electrical & Computer Engineering / Computer Vision, McMaster University',
        priorBittensorWork: 'Machine Learning Researcher at the Opentensor Foundation prior to Macrocosmos.',
        notableHook: 'McCrindle is the third ex-Opentensor person in the Macrocosmos cluster, making Macrocosmos the only top-25 operator where every senior person came directly out of Opentensor.',
      },
    ],
    investors: [],
    crossSubnetLinks: [
      { netuid: 1, relation: 'same Macrocosmos team' },
      { netuid: 9, relation: 'same Macrocosmos team' },
      { netuid: 25, relation: 'same Macrocosmos team' },
      { netuid: 44, relation: 'Data Universe sells data to Score (Q1 2026 partnership)' },
    ],
    confidence: 'high',
    researched: '2026-05-15',
    sources: [
      'https://github.com/macrocosm-os/data-universe',
      'https://macrocosmosai.substack.com/p/you-get-torn-apart-but-thats-how',
      'https://www.macrocosmos.ai/',
    ],
  },

  // RANK 15
  {
    netuid: 39,
    subnet: 'Basilica (community-rebuilt)',
    parent: 'Covenant AI (deprecated) / community',
    founders: [
      {
        name: 'Samuel B. Dare',
        role: 'Founder, Covenant AI (until exit)',
        handles: { linkedin: 'samuel-b-dare' },
        background: 'See SN3 Templar entry. Launched Basilica January 2026 as agent-native ephemeral sandbox compute.',
        notableHook: 'Basilica is the most direct competitive overlap with Rayon\'s Chutes anywhere on the network, and its founder (Dare) publicly attacked Const, while Const\'s own SN120 Affine depends on Chutes for compute. The architecture and the politics aligned.',
      },
    ],
    investors: [],
    crossSubnetLinks: [
      { netuid: 3, relation: 'same Covenant trio founder' },
      { netuid: 81, relation: 'same Covenant trio founder' },
      { netuid: 64, relation: 'Direct competitive overlap · agent-native compute vs serverless inference' },
    ],
    confidence: 'high',
    researched: '2026-05-15',
    sources: [
      'https://www.theblock.co/post/396959/covenant-ai-exits-bittensor-tao',
      'https://github.com/tplr-ai/basilica',
      'https://iq.wiki/wiki/sam-dare',
    ],
  },

  // RANK 16
  {
    netuid: 81,
    subnet: 'Grail (community-rebuilt)',
    parent: 'Covenant AI (deprecated) / community',
    founders: [
      {
        name: 'Samuel B. Dare',
        role: 'Founder, Covenant AI (until exit)',
        handles: { linkedin: 'samuel-b-dare' },
        background: 'See SN3 Templar entry. Grail was the RL/post-training counterpart to Templar in the Covenant trio.',
        notableHook: 'Grail + Templar + Basilica formed a deliberate vertically-integrated pretrain → post-train → agent stack, the only such stack any single Bittensor founder ever assembled.',
      },
    ],
    investors: [],
    crossSubnetLinks: [
      { netuid: 3, relation: 'same Covenant trio founder' },
      { netuid: 39, relation: 'same Covenant trio founder' },
    ],
    confidence: 'high',
    researched: '2026-05-15',
    sources: [
      'https://www.theblock.co/post/396959/covenant-ai-exits-bittensor-tao',
      'https://iq.wiki/wiki/sam-dare',
    ],
  },

  // RANK 17
  {
    netuid: 68,
    subnet: 'NOVA',
    parent: 'Metanova Labs',
    founders: [
      {
        name: 'Micaela Bazo',
        role: 'Founder & CEO',
        handles: { x: '@metanova_labs' },
        background: 'Crypto investor since 2011; stated mission to connect "emerging scientific talent south of the equator with global capital markets and research ecosystems."',
        notableHook: 'The only top-25 founder whose investor track record explicitly predates Bittensor by more than a decade, and the only one with an explicit Global South research-talent thesis. DiaGen AI joint venture (2025) is one of the cleanest cross-industry biotech deals any subnet has signed.',
      },
      {
        name: 'Dr. Pedro Penna',
        role: 'Technical co-founder',
        handles: {},
        background: 'Technical lead at Metanova Labs per the company site and Subnet Magazine\'s October 2025 interview.',
        notableHook: 'PhD-level scientific lead in a network that is otherwise dominated by bachelor\'s-level founders.',
      },
    ],
    investors: [],
    crossSubnetLinks: [],
    confidence: 'medium',
    researched: '2026-05-15',
    sources: [
      'https://www.metanova-labs.ai/',
      'https://vivatech.com/speakers/2f95bbf9-ee45-f011-8f7d-6045bdf3af56',
      'https://cryptobriefing.com/bittensor-sn68-metanova-drug-discovery/',
      'https://x.com/subnetmagazine/status/1980110931251142869',
      'https://www.bittensor.ai/learning-hub/sn68-metanova-labs',
    ],
  },

  // RANK 18
  {
    netuid: 75,
    subnet: 'Hippius',
    parent: 'The Nerve Lab',
    founders: [
      {
        name: 'Chris Hobel',
        role: 'CTO',
        handles: { github: 'thenervelab' },
        background: 'Blockchain lead with strong Substrate and decentralized-infrastructure background; combined experience in startups, systems design, and decentralized storage.',
        notableHook: 'Hippius is the only top-25 subnet that runs its own Substrate chain bridged to Bittensor rather than living purely on Bittensor, architecturally a sibling chain with dual-token economics (BABE consensus, NPoS security) that the rest of the network can\'t support.',
      },
    ],
    investors: [],
    crossSubnetLinks: [],
    confidence: 'medium', // full founding team not consistently named publicly
    researched: '2026-05-15',
    sources: [
      'https://hippius.com/',
      'https://community.hippius.com/',
      'https://github.com/thenervelab/thebrain',
      'https://asymmetricjump.substack.com/p/hippius-subnet-75-the-decentralized',
    ],
  },

  // RANK 19
  {
    netuid: 10,
    subnet: 'Sturdy',
    parent: 'Sturdy Finance',
    founders: [
      {
        name: 'Sam Forman',
        role: 'Founder & CEO',
        handles: { linkedin: 'sam-forman' },
        background: 'Cryptography researcher (Montclair State, 2016-2018); McKinsey, TuSimple, Kasisto, College Board internships; founded Sturdy in 2021. Also founder of TaoFi, a separate TAO-DeFi project.',
        education: 'Stanford (math/CS, dropout)',
        notableHook: 'Sturdy Finance had $125M+ allocated deposits before SN10 launched, the only top-25 subnet where the parent company already had real on-chain TVL pre-subnet. The Morpho / Gauntlet integration is the most consequential DeFi-Bittensor bridge in production.',
      },
    ],
    investors: ['Y Combinator (Sturdy Finance parent)'],
    crossSubnetLinks: [],
    confidence: 'high',
    researched: '2026-05-15',
    sources: [
      'https://www.linkedin.com/in/sam-forman/',
      'https://www.thefounderdaily.com/exploring-decentralized-ai-and-blockchain-an-interview-with-sam-forman-founder-of-sturdy/',
      'https://www.ycombinator.com/companies/sturdy-finance',
      'https://sturdyfinance.medium.com/sturdy-teams-up-with-morpho-to-offer-ai-optimized-yields-powered-by-gauntlet-and-bittensor-218839fd2e03',
    ],
  },

  // RANK 20
  {
    netuid: 34,
    subnet: 'BitMind',
    parent: 'BitMind AI',
    founders: [
      {
        name: 'Ken Jon Miyachi',
        role: 'Founder & CEO',
        handles: { x: '@BitMindAI', linkedin: 'kmiyachi' },
        background: 'SDE II at Amazon; Senior Software Engineer at Polymer Labs; Senior Tech Lead / Senior SWE at the NEAR Foundation; CEO of LedgerSafe prior to BitMind. Based Austin.',
        education: 'UCSD CS · research at the San Diego Supercomputer Center',
        notableHook: 'The only top-25 founder with documented senior engineering history at a non-EVM L1 foundation (NEAR). BitMind is also the only top-25 subnet to win a Coinbase Developer Platform hackathon prize (Best Infrastructure, Feb 2025), explicit cross-ecosystem validation from a major US-listed crypto company.',
      },
    ],
    investors: ['Canonical Crypto (lead)', 'NEAR Foundation'],
    crossSubnetLinks: [],
    confidence: 'high',
    researched: '2026-05-15',
    sources: [
      'https://www.linkedin.com/in/kmiyachi/',
      'https://invezz.com/news/2025/07/25/interview-this-is-just-the-tip-of-the-iceberg-says-bitmind-founder-ken-jon-miyachi-on-deepfake-scams/',
      'https://bitmind.ai/',
      'https://github.com/BitMind-AI/bitmind-subnet',
    ],
  },

  // RANK 21
  {
    netuid: 9,
    subnet: 'IOTA (formerly Pretraining)',
    parent: 'Macrocosmos',
    founders: [
      { name: 'Will Squires', role: 'Co-Founder & CEO', handles: { linkedin: 'willsquires' }, background: 'See SN1.', notableHook: 'Same Macrocosmos team.' },
      { name: 'Steffen Cruz', role: 'Co-Founder & CTO', handles: { linkedin: 'steffen-cruz' }, background: 'See SN1.', notableHook: 'Same Macrocosmos team; IOTA architecture is Cruz\'s direct continuation of Opentensor pretraining work.' },
    ],
    investors: [],
    crossSubnetLinks: [
      { netuid: 1, relation: 'same Macrocosmos team' },
      { netuid: 13, relation: 'same Macrocosmos team' },
      { netuid: 25, relation: 'same Macrocosmos team' },
      { netuid: 3, relation: 'architectural rival on decentralized pretraining (vs Templar)' },
    ],
    confidence: 'high',
    researched: '2026-05-15',
    sources: [
      'https://github.com/macrocosm-os/IOTA',
      'https://iota.macrocosmos.ai/',
    ],
  },

  // RANK 22
  {
    netuid: 25,
    subnet: 'Mainframe (formerly Protein Folding)',
    parent: 'Macrocosmos',
    founders: [
      { name: 'Will Squires', role: 'Co-Founder & CEO', handles: { linkedin: 'willsquires' }, background: 'See SN1.', notableHook: 'Same Macrocosmos team.' },
      { name: 'Steffen Cruz', role: 'Co-Founder & CTO', handles: { linkedin: 'steffen-cruz' }, background: 'See SN1.', notableHook: 'Same Macrocosmos team.' },
      { name: 'Brian McCrindle', role: 'Subnet Lead', handles: { linkedin: 'brian-mccrindle' }, background: 'See SN13.', education: 'MASc McMaster ECE/CV', priorBittensorWork: 'Ex-Opentensor ML Researcher.', notableHook: 'Runs both SN13 and SN25, the only single subnet lead in the top 25 who owns two top-25 subnets simultaneously.' },
    ],
    investors: [],
    crossSubnetLinks: [
      { netuid: 1, relation: 'same Macrocosmos team' },
      { netuid: 9, relation: 'same Macrocosmos team' },
      { netuid: 13, relation: 'same Macrocosmos team · McCrindle is lead on both' },
    ],
    confidence: 'high',
    researched: '2026-05-15',
    sources: [
      'https://github.com/macrocosm-os/mainframe',
      'https://docs.macrocosmos.ai/subnets/subnet-25-mainframe',
      'https://www.rowansci.com/blog/partnering-with-macrocosmos',
      'https://macrocosmosai.substack.com/p/bittensor-is-best-for-desci-and-mainframe',
    ],
  },

  // RANK 23
  {
    netuid: 18,
    subnet: 'Zeus',
    parent: 'Ørpheus AI B.V.',
    founders: [
      {
        name: 'Ørpheus AI team',
        role: 'Operator',
        handles: { x: '@zeussubnet', github: 'Orpheus-AI' },
        background: 'Dutch B.V. registered in the Netherlands. Team described as combining hands-on Bittensor experience with academic climate-science expertise.',
        notableHook: 'Zeus benchmarks directly against GraphCast (Google DeepMind), Pangu-Weather (Huawei), and Aurora (Microsoft), the only top-25 subnet whose listed competitors are frontier-lab papers rather than other crypto products. The slot was bought from Datura/Fish in early 2025, the only documented top-25-operator slot sale in the network.',
      },
    ],
    investors: [],
    crossSubnetLinks: [
      { netuid: 51, relation: 'Slot purchase · Ørpheus bought SN18 from Datura/Fish, who now operates SN51 Lium' },
    ],
    confidence: 'medium', // individual team member names not surfaced on public site
    researched: '2026-05-15',
    sources: [
      'https://www.orpheus-ai.nl/',
      'https://www.zeussubnet.com/',
      'https://github.com/Orpheus-AI/Zeus',
      'https://x.com/CryptoZPunisher/status/1904225837051728036',
    ],
  },

  // RANK 24
  {
    netuid: 6,
    subnet: 'Nous (Numinous)',
    parent: 'Nous Research',
    founders: [
      {
        name: 'Jeffrey Quesnelle',
        role: 'Co-Founder',
        handles: { x: '@theemozilla' },
        background: 'AI researcher; YaRN paper co-author (context-window extension).',
        notableHook: 'Quesnelle\'s YaRN work is widely cited in open-model research; Nous is one of the few top-25 operators with a research-paper-grade public output.',
      },
      {
        name: 'Karan Malhotra',
        role: 'Co-Founder · Head of Behavior',
        handles: { x: '@karan4d' /* approximate */, linkedin: 'karan-malhotra' },
        background: 'ML Researcher at the Stanford Brain Stimulation Lab prior to Nous.',
        education: 'Emory University · Stanford ML research role (not PhD)',
        notableHook: 'Only top-25 founder with a documented research role at a Stanford lab (Brain Stimulation, not NLP), a different academic-adjacency from the rest of the network.',
      },
      {
        name: 'Teknium (pseudonym)',
        role: 'Co-Founder',
        handles: { x: '@Teknium1' },
        background: 'Pseudonymous AI researcher and engineer; ex-Stability AI; led early Hermes fine-tuning work.',
        notableHook: 'The only confirmed ex-frontier-lab (Stability AI) figure in the top 25, but pseudonymous.',
      },
      {
        name: 'Shivani Mitra',
        role: 'Co-Founder',
        handles: {},
        background: 'Nous Research co-founder.',
        notableHook: 'Co-founder per multiple sources but lower public profile than the others.',
      },
      {
        name: 'Bowen Peng',
        role: 'Founding Developer',
        handles: { x: '@bowenpeng' /* approximate */ },
        background: 'YaRN paper (Sept 2023); DeMo (Decoupled Momentum Optimization, Nov 2024).',
        notableHook: 'Peng\'s DeMo paper is referenced in Nous\'s own Psyche distributed-training infrastructure pitch, directly relevant to SN6\'s technical approach.',
      },
    ],
    investors: [
      'Paradigm (Series A lead, April 2025, $50M @ $1B valuation)',
      'Distributed Global',
      'Delphi Digital',
      'Hack VC',
      'North Island Ventures',
      'OSS Capital (Joseph Jacks)',
      'Vipul Reddy (Together AI CEO, angel)',
      'Raj Gokal (Solana co-founder, angel)',
      'Balaji Srinivasan (angel)',
      'Yuma (DCG), accelerated as "Numinous"',
    ],
    crossSubnetLinks: [
      { netuid: 4, relation: 'OSS Capital (JJ) invested in both Manifold and Nous' },
      { netuid: 14, relation: 'OSS Capital principal (JJ) operates SN14; same firm invested in Nous' },
    ],
    confidence: 'high',
    researched: '2026-05-15',
    sources: [
      'https://fortune.com/crypto/2025/04/25/paradigm-nous-research-crypto-ai-venture-capital-deepseek-openai-blockchain/',
      'https://www.theblock.co/post/352000/paradigm-leads-50-million-usd-round-decentralized-ai-project-nous-research',
      'https://siliconangle.com/2025/04/25/nous-research-raises-50m-decentralized-ai-training-led-paradigm/',
      'https://cryptorank.io/price/nous-research/team',
      'https://nousresearch.com/',
    ],
  },

  // RANK 25
  {
    netuid: 2,
    subnet: 'DSperse (formerly Omron)',
    parent: 'Inference Labs',
    founders: [
      {
        name: 'Ronald Chan',
        role: 'Co-Founder',
        handles: { linkedin: 'ronald-chan' /* approximate */ },
        background: 'Inference Labs co-founder; based Hamilton, Ontario.',
        notableHook: 'Hamilton, ON-based, the only mid-sized-Canada operator in the top 25.',
      },
      {
        name: 'Colin Gagich',
        role: 'Co-Founder',
        handles: { linkedin: 'colin-gagich' /* approximate */ },
        background: 'Inference Labs co-founder; appears on Bittensor Guru episodes representing the subnet.',
        notableHook: 'Inference Labs has parallel non-Bittensor product Sertn AVS on EigenLayer, the only top-25 operator with a direct restaking-economy exposure in addition to Bittensor.',
      },
    ],
    investors: ['$2.3M pre-seed (per BetaKit)'],
    crossSubnetLinks: [],
    confidence: 'high',
    researched: '2026-05-15',
    sources: [
      'https://inferencelabs.com/',
      'https://www.crunchbase.com/organization/inference-labs-inc',
      'https://betakit.com/ai-and-web3-startup-inference-labs-secures-2-3-million-in-pre-seed-funding/',
      'https://github.com/inference-labs-inc/subnet-2',
      'https://blog.eigencloud.xyz/ai-beyond-the-black-box-inference-labs-is-making-verifiable-decentralized-ai-a-reality-with-eigenlayer/',
    ],
  },

]);

/** Convenience lookup by netuid. */
export const founderByNetuid = Object.freeze(
  Object.fromEntries(FOUNDERS.map(f => [f.netuid, f]))
);

/**
 * All cross-subnet edges in the top-25 founder graph, deduped and
 * undirected (we render bidirectionally on the site). Each edge
 * carries a kind so the viz can color-code:
 *   - 'shared-operator'   same parent company (Macrocosmos, Rayon, Covenant)
 *   - 'shared-history'    founders worked together at Opentensor or elsewhere
 *   - 'shared-investor'   investor overlap between the two parents
 *   - 'commercial'        documented B2B contract between the two subnets
 *   - 'slot-sale'         one party sold the subnet slot to the other
 *   - 'public-dispute'    documented founder-vs-founder conflict
 *   - 'architectural'     one subnet depends on the other for compute/data
 *
 * @type {readonly { a:number, b:number, kind:string, label:string }[]}
 */
export const FOUNDER_EDGES = Object.freeze([

  // Rayon Labs trio
  { a: 64, b: 56, kind: 'shared-operator',  label: 'Rayon Labs · same team (namoray/sangar/carro)' },
  { a: 64, b: 19, kind: 'shared-operator',  label: 'Rayon Labs · same team' },
  { a: 56, b: 19, kind: 'shared-operator',  label: 'Rayon Labs · same team' },

  // Macrocosmos cluster
  { a: 1,  b: 9,  kind: 'shared-operator',  label: 'Macrocosmos · same team (Squires/Cruz)' },
  { a: 1,  b: 13, kind: 'shared-operator',  label: 'Macrocosmos · same team' },
  { a: 1,  b: 25, kind: 'shared-operator',  label: 'Macrocosmos · same team' },
  { a: 9,  b: 13, kind: 'shared-operator',  label: 'Macrocosmos · same team' },
  { a: 9,  b: 25, kind: 'shared-operator',  label: 'Macrocosmos · same team' },
  { a: 13, b: 25, kind: 'shared-operator',  label: 'Macrocosmos · same team · McCrindle subnet lead on both' },

  // Former Covenant trio
  { a: 3,  b: 39, kind: 'shared-operator',  label: 'Covenant AI · same Dare founder until April 2026' },
  { a: 3,  b: 81, kind: 'shared-operator',  label: 'Covenant AI · same Dare founder until April 2026' },
  { a: 39, b: 81, kind: 'shared-operator',  label: 'Covenant AI · same Dare founder until April 2026' },

  // Kaito sibling (SN5 + SN69 outside top-25 cohort but listed in subnets.js)
  // We keep this edge to support the site\'s rendering of the broader graph
  // when SN69 appears on the page.
  { a: 5,  b: 69, kind: 'shared-operator',  label: 'Kaito · same team (Yu Hu)' },

  // Ex-Opentensor shared-history (Manifold + Macrocosmos)
  { a: 4,  b: 1,  kind: 'shared-history',   label: 'Both senior teams are ex-Opentensor' },
  { a: 4,  b: 9,  kind: 'shared-history',   label: 'Both senior teams are ex-Opentensor' },
  { a: 4,  b: 13, kind: 'shared-history',   label: 'Both senior teams are ex-Opentensor' },
  { a: 4,  b: 25, kind: 'shared-history',   label: 'Both senior teams are ex-Opentensor' },
  { a: 4,  b: 120, kind: 'shared-history',  label: 'SN4 Myers/Woodman were direct reports of Const at Opentensor' },
  { a: 1,  b: 120, kind: 'shared-history',  label: 'Cruz was Const\'s CTO at Opentensor' },
  { a: 9,  b: 120, kind: 'shared-history',  label: 'Cruz was Const\'s CTO at Opentensor' },
  { a: 13, b: 120, kind: 'shared-history',  label: 'Cruz was Const\'s CTO at Opentensor' },
  { a: 25, b: 120, kind: 'shared-history',  label: 'Cruz was Const\'s CTO at Opentensor' },

  // Shared investor: OSS Capital (Joseph Jacks) across SN4, SN6, SN14
  { a: 4,  b: 6,  kind: 'shared-investor',  label: 'OSS Capital invested in both Manifold (SN4) and Nous (SN6)' },
  { a: 4,  b: 14, kind: 'shared-investor',  label: 'OSS Capital led SN4 Series A; OSS principal JJ operates SN14' },
  { a: 6,  b: 14, kind: 'shared-investor',  label: 'OSS principal JJ invested in Nous (SN6) and operates SN14' },

  // Yuma (DCG) accelerated cohort overlap, SN6, SN44 confirmed publicly
  { a: 6,  b: 44, kind: 'shared-investor',  label: 'Both in Yuma (DCG) accelerated cohort · Numinous + Score' },

  // Documented commercial contracts
  { a: 13, b: 44, kind: 'commercial',       label: 'Data Universe → Score · paying B2B data partnership Q1 2026' },

  // Slot sale
  { a: 51, b: 18, kind: 'slot-sale',        label: 'Datura/Fish sold SN18 slot to Ørpheus AI in early 2025' },

  // Public dispute
  { a: 3,  b: 120, kind: 'public-dispute',  label: 'Sam Dare vs Const · April 2026 "decentralization theatre" exit' },
  { a: 39, b: 120, kind: 'public-dispute',  label: 'Same April 2026 dispute · Covenant trio vs Opentensor' },
  { a: 81, b: 120, kind: 'public-dispute',  label: 'Same April 2026 dispute · Covenant trio vs Opentensor' },

  // Architectural dependencies
  { a: 120, b: 64, kind: 'architectural',   label: 'Affine depends on Chutes for compute' },
  { a: 120, b: 56, kind: 'architectural',   label: 'Affine depends on Gradients for training' },
  { a: 120, b: 51, kind: 'architectural',   label: 'Affine depends on Lium for compute' },
  { a: 39,  b: 64, kind: 'architectural',   label: 'Basilica and Chutes are direct competitors on serverless AI compute' },
  { a: 3,   b: 9,  kind: 'architectural',   label: 'Templar (SparseLoCo) and IOTA are direct architectural rivals on decentralized pretraining' },
]);

/**
 * Quick degrees-of-Const calculation. Returns 0 for SN120 (Const\'s
 * own subnet), 1 for any subnet whose founders worked directly at
 * Opentensor under Const or have a documented direct relationship,
 * and 2 for everything else in the top 25 (per the cross-subnet
 * patterns analysis, every top-25 founder is within 2 degrees).
 * @param {number} netuid
 * @returns {0|1|2|null}  null if not in the top 25
 */
export function degreesFromConst(netuid){
  if (netuid === 120) return 0;
  const zeroAdjacent = new Set([1, 9, 13, 25, 4]); // ex-Opentensor senior bench
  if (zeroAdjacent.has(netuid)) return 0; // technically same as Const-circle
  const oneDegree = new Set([64, 56, 19, 3, 39, 81, 51, 5, 14]);
  if (oneDegree.has(netuid)) return 1;
  const inTop25 = FOUNDERS.some(f => f.netuid === netuid);
  return inTop25 ? 2 : null;
}

/**
 * Investor concentration map. Returns the list of top-25 netuids
 * the given investor name has a documented public position in.
 * @param {string} investor
 * @returns {number[]}
 */
export function subnetsByInvestor(investor){
  return FOUNDERS
    .filter(f => f.investors.some(i => i.toLowerCase().includes(investor.toLowerCase())))
    .map(f => f.netuid);
}

/**
 * Short "via X" chain string used in the bio-card footer and the
 * Six-Degrees-of-Const table. Hand-curated from the Phase 2 patterns
 * analysis in founders-and-connections-2026-05.md.
 * @param {number} netuid
 * @returns {string}
 */
export function chainToConst(netuid){
  switch (netuid){
    case 120: return 'Const · the subnet is his';
    case 1:
    case 9:
    case 13:
    case 25:  return 'Macrocosmos · ex-Opentensor senior bench';
    case 4:   return 'Manifold · ex-Opentensor CEO + COO';
    case 64:
    case 56:
    case 19:  return 'Rayon Labs trio · operator-network adjacent';
    case 14:  return 'Joseph Jacks · led Manifold\'s Series A';
    case 3:
    case 39:
    case 81:  return 'Covenant trio · publicly opposing Const';
    case 51:  return 'Datura · Polychain co-portfolio + slot-sale to SN18';
    case 5:   return 'Kaito · public-figure operator';
    case 18:  return 'Ørpheus AI · bought SN18 slot from Datura';
    case 8:   return 'Taoshi · Foundry-allied institutional bench';
    case 6:   return 'Nous · JJ seed + DCG mentions';
    case 44:  return 'Score · Macrocosmos B2B customer';
    case 10:  return 'Sturdy · DeFi crossover via shared LPs';
    case 34:  return 'BitMind · academic adjacency to Manifold';
    case 62:  return 'Ridges · validator-set adjacency';
    case 68:  return 'NOVA · Metanova · Foundry-allied';
    case 75:  return 'Hippius · subnet-as-storage adjacency';
    case 2:   return 'DSperse · academic adjacency';
    default:  return 'Top-25 operator network';
  }
}

/**
 * Lookup helper. Returns the FOUNDERS row for a given netuid, or null.
 * @param {number} netuid
 * @returns {FounderRow|null}
 */
export function founderById(netuid){
  return FOUNDERS.find(f => f.netuid === netuid) || null;
}
