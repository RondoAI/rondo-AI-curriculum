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
  { handle:'const_reborn', name:'Jacob Steeves',  role:'Bittensor co-founder (Const) · Founder of Affine SN120', group:'core',
    brand:'opentensor', github:'unconst', site:'https://opentensor.ai', subnets:[120], expertise:['bittensor','subtensor','yuma-consensus','emission','subnet'],
    bio:'Known as Const. Co-founder of the Bittensor protocol and the Opentensor Foundation. Technical north star for Yuma Consensus and the network\'s incentive design. Now also founder of Affine (SN120), a subnet that runs continuous evaluations to fine-tune the best open-source reasoning models. Affine hosts via Chutes (SN64), creating a direct Affine-Chutes value loop. After the April 2026 Sam Dare / Templar incident, Const led the introduction of Locked Stake to strengthen subnet ownership and decentralization.' },
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

  /* — additional subnet founders + analysts/media — */
  { handle:'jon_durbin',  name:'Jon Durbin', role:'Founder · Chutes (SN64)', group:'subnet',
    site:'https://chutes.ai', subnets:[64], expertise:['subnet','miner','validator'],
    bio:'Founder + backend engineer at Chutes, the #1 revenue subnet on Bittensor. Per his own May 13 platform-state post: ~160B tokens/day at peak, inventory cut 2/3 since December but revenue held, now optimizing dollar-per-token. Personally building "Parallax", a new decentralized MoE training method with a claimed <=1.5% gap vs E2E training on a 20B run over the public internet. Research collaboration with Prof. Juncheng Yang at Harvard on cache + routing.' },
  { handle:'ridges_ai',   name:'Ridges', role:'SWE-bench-style agent benchmark · Subnet 62', group:'subnet',
    site:'https://ridges.ai', subnets:[62], expertise:['subnet','weight','yuma-consensus'],
    bio:'Runs a benchmark market for AI coding agents on Bittensor. Per the May 16 team update + dashboard screenshot, now uses 3/3 unanimous-validator verification per task (3x verification compute, much lower scoring variance). Visible scoring grammar: Passed, Reliable, Flaky, Consistent. Grounded in the Princeton SWE-bench problem set, which is externally validated. Average per-problem runtime ~21 to 36 minutes. X handle unconfirmed (placeholder), will rotate when verified.' },
  { handle:'connito_ai',  name:'Connito', role:'Decentralized composable MoE training', group:'subnet',
    site:'https://connito.ai', subnets:[], expertise:['subnet','weight','yuma-consensus'],
    bio:'Decentralized framework for sparse Mixture-of-Experts adaptation. Authors Isabella Liu and George Kim published the v1 whitepaper May 2026. Architecture: four-phase pipeline (target expert selection, sparse local optimization DiLoCo-style, frozen routing anchor, global integration) with a Proof-of-Loss incentive layer that rewards miner submissions empirically against held-out validation loss. SHA-256 commit-reveal with validator-randomness-seeded evaluation partition. Bittensor netuid unconfirmed pending registration check. Handle is a placeholder.' },

  /* — surfaced via WallStreetBets TAO thesis, 2026-04-30 — */
  { handle:'tplr_ai',      name:'Templar', role:'Decentralized 72B model training · Subnet 3', group:'subnet',
    site:'https://covenant.ai', subnets:[3], expertise:['subnet','miner','validator'],
    bio:'The "crown jewel" subnet at peak hype: 70+ contributors trained a 72B parameter model decentralized on home GPUs with no data center required. Parent company Covenant AI. The April 2026 Sam Dare incident (founder dumped 37,000 TAO ~ \$10M) tested the ecosystem; Const responded with the Locked Stake mechanism. The 72B training run remains the largest decentralized result on Bittensor to date. Subject to recovery + governance coverage going forward.' },
  { handle:'covenant_ai',  name:'Covenant AI', role:'Parent of Templar SN3', group:'subnet',
    site:'https://covenant.ai', subnets:[3], expertise:['subnet'],
    bio:'Parent company of Templar (SN3). Recovering institutional trust after the Apr 2026 Sam Dare incident.' },
  { handle:'TargonCompute',name:'Targon', role:'Decentralized AWS for AI · Subnet 4', group:'subnet',
    site:'https://targon.com', subnets:[4], expertise:['subnet','miner'],
    bio:'Aka Manifold Labs. Decentralized, lower-cost, more private alternative to AWS and Azure for running AI workloads. Targon Virtual Machine (TVM) provides hardware-backed encryption so untrusted hosts cannot access data or model weights. Targon OS launching soon to let millions of consumer GPUs (4090s, 3090s) join the network at a separate trust tier and lower pricing. Powers @dippy_ai backend (8M+ users). Co-authored a paper with Intel in March 2026, a major enterprise signal. Built by @0xcarro (Robert Myers, one of the first three people in the Bittensor Discord) and @jameswoodmanv (ex-GSR).' },
  { handle:'VantaTrading', name:'Vanta', role:'On-chain prop firm with 100% profit split · Subnet 8', group:'subnet',
    site:'https://vanta.trading', subnets:[8], expertise:['subnet','validator'],
    bio:'Brings the ~\$20B prop firm industry on-chain. Traders pass a single evaluation and keep 100% of profits (vs traditional 50-80%). Hyperliquid version Hyperscaled. A-books best traders via CFTC-compliant platform Glitch. Up 8% YTD vs 1% drawdown on the index model. As of Apr 2026, net profitable on revenue vs miner emissions. Fees buy back alpha tokens, creating a direct flywheel between product revenue and token value.' },
  { handle:'oroagents',    name:'Oro', role:'Autonomous AI shopping agent benchmarks · Subnet 15', group:'subnet',
    site:'https://oro.ai', subnets:[15], expertise:['subnet','validator'],
    bio:'Builds and benchmarks the world\'s best autonomous AI shopping agents through fully open, incentivized competition. 45 Oro agents have outperformed GPT 5.4 on one of the hardest online shopping evaluations. Daily race where the top agent earns emissions in real time, generating ~60K agent trajectories per day. Co-founded by @shardiban and @ironseth_s.' },
  { handle:'webuildscore', name:'Score', role:'Computer vision · Subnet 44', group:'subnet',
    site:'https://score.tech', subnets:[44], expertise:['subnet'],
    bio:'Bittensor computer vision subnet. The first to land a Big Four enterprise deal: PwC France & Maghreb signed a formal alliance after 8 months of legal due diligence, distributing Score\'s Manako "Business Operations World Model" to clients across retail, manufacturing, logistics, energy, infrastructure. PwC France ~EUR 1bn revenue, PwC global ~USD 60bn across 136 countries. Per the TurboVision miner docs, Score private-track miners do time-localized action detection in soccer / cricket video (action weights range 1.0 for pass to 10.9 for goal, tolerance windows 1.0-3.0s). Manifest-driven challenge architecture so new verticals can ship without subnet code updates. Won Bittensor track at Paris Blockchain Week the same morning as the PwC announcement.' },
  { handle:'MaxScore',     name:'Max', role:'Core team · Score (SN44)', group:'subnet',
    site:'https://score.tech', subnets:[44], expertise:['subnet'],
    bio:'Score core team. Opened the Apr 16 PwC Spaces. On the deal: "We\'re doing this for TAO. If you\'re running a subnet and think you can help PwC\'s clients, reach out. I\'m happy to be the bridge."' },
  { handle:'tm0klc',       name:'Tim', role:'Tech lead · Score (SN44)', group:'subnet',
    site:'https://score.tech', subnets:[44], expertise:['subnet'],
    bio:'Score tech lead. Drove the manifest-driven challenge architecture refactor (challenges no longer hard-coded in subnet software; validators fetch JSON manifests encoding challenge + scoring logic + emissions weight + model size constraints). New verticals can now ship without redeploying. Recent fuel-station-detection challenge produced strong models within a week.' },
  { handle:'nigescore',    name:'Nige', role:'Core team · Score (SN44)', group:'subnet',
    site:'https://score.tech', subnets:[44], expertise:['subnet'],
    bio:'Score core team. On the PwC partnership: "Once you have a product that can work in the real world, there\'s no better business to work with than PwC. They\'re going to open doors that nobody else can open."' },
  { handle:'jtledore',     name:'Jean-Thomas Ledoré', role:'Strategy Partner · PwC France & Maghreb', group:'capital',
    site:'https://www.pwc.fr', subnets:[44], expertise:[],
    bio:'Strategy Partner at PwC France & Maghreb. The PwC counterparty on the Score / Manako alliance. Took the mic at the Apr 16 Spaces. On Bittensor: "This is the beginning of the story about big companies leveraging decentralised AI technology." On winning enterprise: "If you\'re leaning only on emissions, you will be stuck. You need to solve real world problems, capture value from the world, and inject it back into the ecosystem." On the competitive frame: "Bittensor is not PvP. The competition is outside. It\'s decentralised AI versus centralised technology."' },
  { handle:'manakoai',     name:'Manako', role:'Conversational Vision AI on Score (SN44)', group:'subnet',
    site:'https://manako.ai', subnets:[44], expertise:['subnet'],
    bio:'Launched Q1 2026 (announced Jan 22). The product layer built on Score (SN44). Three architectural principles: (1) curated library of vision components continuously enriched by Score subnet competitions, (2) AI orchestrator that interprets user intent and assembles components into an execution graph, (3) simple stable SDK/API where users see only outcomes and endpoints. The team\'s framing: "What once required expert teams and major resources will soon be available through simple conversation with Manako." Analog: Cursor or Copilot for computer vision, with Score\'s decentralized miners as the engine. Distributed enterprise via the Apr 2026 PwC France & Maghreb alliance (the "Business Operations World Model" SKU); also available self-serve at manako.ai. Self-described pitch: "Enterprises are sitting on one billion cameras that record everything and act on nothing. Manako turns that into real-time systems of action."' },

  { handle:'_redteam_',    name:'RedTeam / Innerworks', role:'AI-vs-AI cybersecurity · Subnet 61', group:'subnet',
    site:'https://theredteam.io', subnets:[61], expertise:['subnet','miner','validator'],
    bio:'SN61. AI-vs-AI cybersecurity research engine; commercial vehicle is Innerworks. Per the team\'s Feb 12 update: integrated across a major global messaging platform with 100M+ DAU (name TBA), paying-customer alliance with 1inch, pipeline of DEXs and payment providers in PoC. Novel token-economic commitment: R&D budget allocated DIRECTLY to alpha buybacks, starting at 1 TAO/day baseline with milestone-triggered injections. 46 repos, 2000+ commits, 26 releases, on v4.0.0. Building toward "the internet\'s first immune system": antibody/antigen loop where miner attack agents and an internal immune-system agent co-evolve entirely on machine time.' },
  { handle:'1inch',        name:'1inch', role:'Leading DeFi ecosystem · Innerworks customer', group:'capital',
    site:'https://1inch.io', subnets:[61], expertise:[],
    bio:'Leading DeFi aggregator. As of early 2026, paying customer of Innerworks (SN61 RedTeam\'s commercial vehicle), using the full stack: device fingerprinting, bot detection, geolocation intelligence. Notable as one of the first major DeFi-side enterprise customers of a Bittensor subnet.' },
  { handle:'resilabsai',   name:'RESI', role:'Real-estate intelligence layer · Subnet 46', group:'subnet',
    site:'https://resilabs.ai', subnets:[46], expertise:['subnet'],
    bio:'Institutional-grade intelligence layer for the \$600T global real estate market. Models deliver state-of-the-art remote appraisals with 98%+ accuracy. First week: 120 portal users, 1000+ AI appraisals, nationwide lender partnership signed. Strategic investment from Stillcore Capital. Founded by @Sebyverse. Currently trades at ~\$10M FDV vs Figure Heloc at \$15B FDV.' },
  { handle:'Sebyverse',    name:'Seby', role:'Founder · RESI (SN46)', group:'subnet',
    site:'https://resilabs.ai', subnets:[46], expertise:['subnet'],
    bio:'Founder of RESI Labs (SN46). Featured on Jason Calacanis\'s "This Week in Startups" discussing real estate AI.' },
  { handle:'affine_io',    name:'Affine', role:'Open reasoning model evaluations · Subnet 120', group:'subnet',
    site:'https://affine.io', subnets:[120], expertise:['subnet','yuma-consensus'],
    bio:'Const\'s own subnet. Runs continuous evaluations to identify and fine-tune the best open-source reasoning models. Does NOT host its own models; leverages Chutes (SN64) for hosting, creating a direct value loop between SN120 and SN64. Every evaluation produces open-source intelligence that improves the broader Bittensor ecosystem.' },
  { handle:'rayon_labs',   name:'Rayon Labs', role:'Company behind Chutes (SN64)', group:'subnet',
    site:'https://rayonlabs.ai', subnets:[64], expertise:['subnet'],
    bio:'The company building Chutes (SN64), the decentralized AI serving platform. Jon Durbin (@jon_durbin) is the public-facing engineer.' },
  { handle:'TAO_dot_com',  name:'TAO.com', role:'Mobile wallet + ecosystem multisig key holder', group:'subnet',
    site:'https://tao.com', subnets:[], expertise:['bittensor','tao'],
    bio:'Mobile wallet for buying, holding, staking TAO and swapping into subnet alpha tokens. One of three multisig key holders that can make ecosystem-level changes to the Bittensor network. Was one of the largest early miners on the protocol. Android support launching soon.' },
  { handle:'dippy_ai',     name:'Dippy AI', role:'8M+ user AI chat platform on Targon', group:'media',
    site:'https://dippy.ai', subnets:[4], expertise:[],
    bio:'AI chat platform with 8M+ users. As of Nov 2025, all chat on Dippy is fully powered by Bittensor SN4 (Targon). Functions as the largest consumer-facing demand source for a Bittensor subnet.' },
  { handle:'wallstreetbets', name:'WallStreetBets (X)', role:'Bullish TAO thesis author', group:'media',
    site:'https://twitter.com/wallstreetbets', subnets:[], expertise:[],
    bio:'The X account (not the subreddit). Author of the Apr 30 2026 "Why TAO is the Bitcoin of AI" thesis that named 8+ subnets with founder attributions and quantitative adoption metrics. Treat as positioned voice (likely holds the assets discussed); cite as a perspective, not an oracle.' },
  { handle:'taomedia_',  name:'TAO Media', role:'Bittensor-native research and editorial', group:'media',
    site:'https://www.tao.media', subnets:[],
    bio:'Self-described "The Bittensor media company". Files deep, primary-sourced research on subnets, ecosystem moves, and protocol governance. Added to Nitter rotation so the desk picks them up automatically.' },
  { handle:'lium_io',    name:'Lium', role:'GPU compute marketplace · Subnet 51', group:'subnet',
    site:'https://lium.io', subnets:[51], expertise:['subnet'],
    bio:'Permissionless decentralized GPU marketplace running as SN51. Per @taomedia_, ~$20K/day revenue, 21% of token supply already burned via revenue-funded buybacks, ~90% cheaper than hyperscaler GPU rentals.' },
  { handle:'zeussubnet',  name:'Zeus Subnet', role:'Decentralized weather forecast aggregation · Subnet 18', group:'subnet',
    site:'https://www.zeussubnet.com', subnets:[18], expertise:['subnet','yuma-consensus'],
    bio:'Built by Ørpheus AI (Amsterdam). Runs a three-phase commit-reveal protocol that aggregates global weather forecasts from miners across a 0.25° grid. Per the V2 benchmark paper (Apr 3-21 2026, n=18), the network reports +23.55% wRMSE improvement on 2m temperature vs ECMWF IFS HRES and +10.90% vs AIFS, with the explicit caveat that gains may reflect regression toward the ERA5 reanalysis target. Primary-source paper saved at intelligence/_primary_sources/.' },
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
