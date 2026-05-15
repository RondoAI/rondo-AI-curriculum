/* =================================================================
   SUBNET MAGAZINE — BITTENSOR FIELD MANUAL
   -----------------------------------------------------------------
   The content of the fixed-bottom console. A research-terminal-
   styled FAQ covering the operations side of Bittensor: how to
   mine, validate, register a subnet, manage wallets, dTAO, weights,
   deregistration, halving.

   Each topic is an array of "lines" rendered into the terminal.
   Line kinds drive colour and layout:
     h     section heading        (red, uppercased)
     step  numbered instruction   (mono, with [01] prefix)
     cmd   shell command          (mono, $-prompted, ink-1)
     note  parenthetical note     (dim, prefixed >)
     warn  warning                (red, prefixed !)
     p     paragraph              (ink-2 prose)
   ================================================================= */

/**
 * @typedef {Object} ManualLine
 * @prop {'h'|'step'|'cmd'|'note'|'warn'|'p'} kind
 * @prop {string} text
 * @prop {number} [n]   step number for step lines
 */

/**
 * @typedef {Object} ManualTopic
 * @prop {string} id
 * @prop {string} label    short label / command
 * @prop {string} title
 * @prop {string} blurb    one-line summary
 * @prop {ManualLine[]} body
 */

/** @type {readonly ManualTopic[]} */
export const FIELD_MANUAL = Object.freeze([

  /* ===================================================================== */
  { id: 'mine', label: '/mine', title: 'Mine a subnet',
    blurb: 'Install · wallets · register · run the miner · survive immunity · earn.',
    body: [
      { kind:'h',    text:'PREREQUISITES' },
      { kind:'p',    text:'Linux box or WSL2 · Python 3.10+ · git. A modest GPU helps for ML subnets, but plenty of subnets run on CPU. You will need TAO in a coldkey wallet to pay registration.' },

      { kind:'h',    text:'01 · INSTALL THE SDK' },
      { kind:'cmd',  text:'pip install bittensor' },
      { kind:'cmd',  text:'btcli --version' },

      { kind:'h',    text:'02 · CREATE WALLETS' },
      { kind:'p',    text:'A "coldkey" holds TAO and signs registration. A "hotkey" runs the miner. They are separate keys for a reason — never co-locate them.' },
      { kind:'cmd',  text:'btcli wallet new_coldkey --wallet.name miner' },
      { kind:'cmd',  text:'btcli wallet new_hotkey  --wallet.name miner --wallet.hotkey default' },
      { kind:'note', text:'write the mnemonic down · store offline · the cold key is the only thing that matters' },

      { kind:'h',    text:'03 · FUND THE COLDKEY' },
      { kind:'cmd',  text:'btcli wallet balance --wallet.name miner' },
      { kind:'p',    text:'Send TAO from an exchange (Kraken, MEXC, KuCoin) to the printed coldkey address. Wait for confirmations.' },

      { kind:'h',    text:'04 · PICK A SUBNET' },
      { kind:'p',    text:'Browse this site\'s Subnets table to see what each one does. Match your hardware: vision subnets need GPUs, finance subnets need market data, compute subnets host other people\'s inference.' },
      { kind:'cmd',  text:'btcli subnet list' },
      { kind:'cmd',  text:'btcli subnet info --netuid 1' },
      { kind:'note', text:'registration cost recycles every ~3 hours · cheaper subnets have lower competition but also lower rewards' },

      { kind:'h',    text:'05 · CLONE THE MINER CODE' },
      { kind:'p',    text:'Every subnet publishes its miner code on GitHub. Find it on the subnet\'s row in the Subnets page, clone, install dependencies.' },
      { kind:'cmd',  text:'git clone https://github.com/<owner>/<subnet-repo>' },
      { kind:'cmd',  text:'cd <subnet-repo> && pip install -r requirements.txt' },

      { kind:'h',    text:'06 · REGISTER ON THE SUBNET' },
      { kind:'warn', text:'this is the only command that costs TAO · do not run it twice without intent' },
      { kind:'cmd',  text:'btcli subnet register --netuid 1 \\\n  --wallet.name miner --wallet.hotkey default' },

      { kind:'h',    text:'07 · RUN THE MINER' },
      { kind:'p',    text:'Each subnet\'s repo has a neurons/miner.py or equivalent. The generic shape:' },
      { kind:'cmd',  text:'python neurons/miner.py \\\n  --netuid 1 --subtensor.network finney \\\n  --wallet.name miner --wallet.hotkey default \\\n  --logging.debug' },

      { kind:'h',    text:'08 · SURVIVE IMMUNITY' },
      { kind:'p',    text:'For ~30 minutes after registration you cannot be deregistered. Use this window to confirm your miner is producing valid responses — watch the logs, watch your stake, watch your incentive score climb.' },

      { kind:'h',    text:'09 · EARN' },
      { kind:'p',    text:'Validators score your output and set weights. Your share of subnet emissions is your share of validator weight. Read the WEIGHTS topic for the consensus math.' },

      { kind:'h',    text:'WARNINGS' },
      { kind:'warn', text:'never expose the coldkey on the box your miner runs from' },
      { kind:'warn', text:'use systemd / pm2 / docker so the miner survives reboots' },
      { kind:'warn', text:'if you are consistently producing zero output, deregistration is coming — check the subnet\'s discord' },
    ] },

  /* ===================================================================== */
  { id: 'validate', label: '/validate', title: 'Run a validator',
    blurb: 'Stake the permit cutoff · score honestly · earn dividends.',
    body: [
      { kind:'h',    text:'PREREQUISITES' },
      { kind:'p',    text:'Real TAO — enough to crack the subnet\'s validator permit threshold (it varies by subnet, often hundreds to thousands of TAO). A reliable box. Validators that go offline lose vTrust fast.' },

      { kind:'h',    text:'01 · INSTALL + WALLETS' },
      { kind:'p',    text:'Same as /mine — install bittensor, make a coldkey, make a hotkey. Then come back here.' },

      { kind:'h',    text:'02 · STAKE ON THE SUBNET' },
      { kind:'p',    text:'The chain admits the top N hotkeys by stake as validators. Stake enough to crack the cutoff for the subnet you are targeting.' },
      { kind:'cmd',  text:'btcli stake add --wallet.name val --wallet.hotkey default \\\n  --netuid 1 --amount 1000' },

      { kind:'h',    text:'03 · CONFIRM YOUR PERMIT' },
      { kind:'cmd',  text:'btcli wallet inspect --wallet.name val' },
      { kind:'note', text:'look for "validator permit: True" on the subnet row' },

      { kind:'h',    text:'04 · RUN THE VALIDATOR' },
      { kind:'cmd',  text:'python neurons/validator.py \\\n  --netuid 1 --wallet.name val --wallet.hotkey default \\\n  --logging.debug' },

      { kind:'h',    text:'05 · SET WEIGHTS HONESTLY' },
      { kind:'p',    text:'Yuma Consensus runs every epoch. If your weights diverge from the cluster you get clipped — and your dividends drop. Don\'t weight-copy blindly. Your reputation is the network\'s trust score.' },

      { kind:'h',    text:'06 · PAY YOUR DELEGATORS' },
      { kind:'p',    text:'Nominators stake to your hotkey expecting yield. The "take" is the share you keep. Standard is 10–18%. Set it once, honour it forever.' },
      { kind:'cmd',  text:'btcli root set_delegate_take --take 0.12' },

      { kind:'h',    text:'WARNINGS' },
      { kind:'warn', text:'two months offline and you are functionally a dead hotkey' },
      { kind:'warn', text:'child hotkeys split your weight-setting across staff hotkeys — read /weights' },
      { kind:'warn', text:'never co-locate cold + hot keys on the same box' },
    ] },

  /* ===================================================================== */
  { id: 'register', label: '/register', title: 'Register a new subnet',
    blurb: 'Define the task · pay the lock cost · seed validators · survive 48h.',
    body: [
      { kind:'h',    text:'WHAT YOU ARE BUYING' },
      { kind:'p',    text:'A subnet is a market. You define the task; miners compete to solve it; you take 18% of the subnet\'s emissions for as long as it stays alive. The chain charges a "lock cost" up front, refunded if the subnet later deregisters.' },

      { kind:'h',    text:'01 · KNOW THE COST' },
      { kind:'p',    text:'Subnet registration is a Dutch auction. The lock cost halves over the recycling window. Long-tail averages 100–800 TAO.' },
      { kind:'cmd',  text:'btcli subnet lock_cost' },

      { kind:'h',    text:'02 · BUILD THE TASK FIRST' },
      { kind:'p',    text:'Before you spend TAO, your codebase has to exist: a miner template (what to compute), a validator template (how to score), and a scoring rule that resists weight-copying. Publish on GitHub.' },

      { kind:'h',    text:'03 · CREATE THE SUBNET' },
      { kind:'cmd',  text:'btcli subnet create --wallet.name owner --wallet.hotkey default' },
      { kind:'note', text:'the chain charges lock_cost TAO · refunds it on deregistration' },

      { kind:'h',    text:'04 · SEED VALIDATORS' },
      { kind:'p',    text:'The subnet starts with zero scoring. Recruit 2–3 honest validators to run your validator code early. Without scoring, miners cannot earn.' },

      { kind:'h',    text:'05 · ANNOUNCE' },
      { kind:'p',    text:'The first 48 hours decide whether you survive deregistration. Discord, X, Subneτ Magazine — say what your subnet does in one sentence and where to read the docs.' },

      { kind:'h',    text:'06 · KEEP IT ALIVE' },
      { kind:'p',    text:'Every new subnet registered after yours threatens you. Read /dereg. A subnet that drops out of the top 124 by EMA gets pruned.' },
    ] },

  /* ===================================================================== */
  { id: 'wallet', label: '/wallet', title: 'Wallets · cold + hot keys',
    blurb: 'Coldkey holds funds · hotkey runs the work · never the same box.',
    body: [
      { kind:'h',    text:'COLDKEY · the bank account' },
      { kind:'p',    text:'Holds TAO. Signs transfers, staking, registration. Never lives on the box that runs the miner or validator. The mnemonic is full control — write it on paper, store it offline.' },

      { kind:'h',    text:'HOTKEY · the worker' },
      { kind:'p',    text:'Signs the operational stuff: weight-setting, response submission. Compromise is annoying but recoverable — the coldkey controls the funds.' },

      { kind:'h',    text:'CREATE' },
      { kind:'cmd',  text:'btcli wallet new_coldkey --wallet.name <name>' },
      { kind:'cmd',  text:'btcli wallet new_hotkey  --wallet.name <name> --wallet.hotkey default' },

      { kind:'h',    text:'INSPECT' },
      { kind:'cmd',  text:'btcli wallet balance --wallet.name <name>' },
      { kind:'cmd',  text:'btcli wallet inspect --wallet.name <name>' },

      { kind:'h',    text:'MOVE FUNDS' },
      { kind:'cmd',  text:'btcli wallet transfer --amount 10 --dest 5xxx...' },

      { kind:'h',    text:'REGENERATE FROM MNEMONIC' },
      { kind:'cmd',  text:'btcli wallet regen_coldkey --wallet.name recovered \\\n  --mnemonic "word1 word2 word3 ..."' },
    ] },

  /* ===================================================================== */
  { id: 'dtao', label: '/dtao', title: 'dTAO · alpha tokens',
    blurb: 'Every subnet has its own token · TAO/α pool prices it · α-cap = emission share.',
    body: [
      { kind:'h',    text:'THE OLD WAY (pre-Feb 2025)' },
      { kind:'p',    text:'All τ was the same. Validators voted "root weights" that decided how the chain split emissions across subnets — a small group of stakers chose the winners every block.' },

      { kind:'h',    text:'THE NEW WAY · dTAO' },
      { kind:'p',    text:'Every subnet has its own alpha token (α₁, α₂, … α₁₂₈). TAO and α trade in a per-subnet bonding-curve pool. α-price = TAO reserve / α reserve. The market chooses the winners now, not a small group of voters.' },

      { kind:'h',    text:'THE BONDING CURVE' },
      { kind:'p',    text:'Each subnet pool holds TAO reserves and α reserves and prices α off a constant-product curve (x · y = k). Add TAO → α-price rises and you receive α at the new marginal rate. Remove α → α-price falls. No oracle, no admin keys, no privileged listing.' },

      { kind:'h',    text:'EMISSION SHARE' },
      { kind:'p',    text:'A subnet\'s emission share = its α market cap / sum of all α market caps. Bigger pool, bigger share. The chain itself does not have to choose what is "useful" — the market does, by where it parks TAO.' },

      { kind:'h',    text:'WORKED EXAMPLE' },
      { kind:'p',    text:'Subnet 64 pool: 14,200 TAO + 412,000 α. α-price = 14,200 / 412,000 = 0.0345 TAO/α. α market cap = 412,000 × 0.0345 = 14,200 TAO. The subnet\'s emission share is 14,200 / Σ-α-mcap of all 128 subnets — about 4.8% of the network\'s daily emissions at current network state.' },

      { kind:'h',    text:'STAKE OPTIONS' },
      { kind:'note', text:'stake TAO → root subnet · ~equal share across the network · paid in TAO' },
      { kind:'note', text:'stake α   → that subnet · leveraged on its success · paid in α' },
      { kind:'note', text:'α-yield depends on the subnet actually earning emissions through real validator activity — not just on α-price' },

      { kind:'h',    text:'SLIPPAGE · LIQUIDITY' },
      { kind:'p',    text:'Thin pools cost more to enter and exit. A high α-yield in a shallow pool can vanish on the way out — always check pool depth before staking large into a subnet. The slippage is the true round-trip fee.' },

      { kind:'h',    text:'WHAT TO LOOK FOR' },
      { kind:'note', text:'α-price 30d chart · live demand for the subnet' },
      { kind:'note', text:'TAO in pool · the liquidity that backs every entry and exit' },
      { kind:'note', text:'α-staked vs floating · who is leaving and who is compounding' },
      { kind:'note', text:'α market cap vs the subnet\'s real validator activity · sniff out empty pumps' },
    ] },

  /* ===================================================================== */
  { id: 'whitepaper', label: '/whitepaper', title: 'The Bittensor whitepaper',
    blurb: 'Yuma Rao · 2020 · a peer-to-peer market for machine intelligence.',
    body: [
      { kind:'h',    text:'THE PAPER' },
      { kind:'p',    text:'The original Bittensor whitepaper was published in 2020 by Yuma Rao — the same Yuma the consensus algorithm is named for. It described a peer-to-peer market where machine intelligence is the commodity and a consensus mechanism prices it. The architecture has evolved (subnets, dTAO) but the thesis is unchanged.' },

      { kind:'h',    text:'CORE THESIS' },
      { kind:'p',    text:'AI is centralizing: a few labs with massive compute. The proposal: a token-incentivized market where anyone can run a model, anyone can validate, and the chain rewards whichever model produces the most useful intelligence — measured by peer scoring, not by who owns the inference.' },

      { kind:'h',    text:'KEY CONTRIBUTIONS' },
      { kind:'note', text:'YUMA CONSENSUS · a Byzantine-fault-tolerant scoring algorithm — clip the dissenters, reward the cluster' },
      { kind:'note', text:'STAKE-WEIGHTED SCORING · validator vote scales with delegated TAO, so reputation backs voice' },
      { kind:'note', text:'MINER-VALIDATOR INTERPLAY · miners produce, validators score, the chain settles in TAO' },
      { kind:'note', text:'SUBNETS · each subnet defines its own task and its own scoring rule, like specialized markets' },
      { kind:'note', text:'TOKENOMICS · Bitcoin-shaped emission · halving · 21M cap' },

      { kind:'h',    text:'THE INTELLIGENCE COMMODITY' },
      { kind:'p',    text:'The radical claim: machine intelligence can be priced like any other commodity if you can score it. Bittensor\'s answer to "how do you score?" is recursive — validators score miners, the network scores validators on their scoring quality. Honesty pays because dishonesty is detectable.' },

      { kind:'h',    text:'V2 · DTAO (Feb 2025)' },
      { kind:'p',    text:'The 2025 update split monolithic TAO into per-subnet alpha tokens and replaced root-weight voting with bonding-curve markets. Now markets, not validator votes, decide which subnets get emissions. See /dtao for the mechanics.' },

      { kind:'h',    text:'WHERE TO READ' },
      { kind:'cmd',  text:'https://bittensor.com/whitepaper' },
      { kind:'cmd',  text:'https://github.com/opentensor/subtensor' },
      { kind:'note', text:'the runtime spec is in pallets/subtensor — the canonical source for what the chain actually does' },
      { kind:'note', text:'Yuma\'s original arXiv preprint is also worth reading for the proof sketches' },
    ] },

  /* ===================================================================== */
  { id: 'roadmap', label: '/roadmap', title: 'Network updates · this month',
    blurb: 'What the chain and the subnets are shipping right now (May 2026).',
    body: [
      { kind:'h',    text:'IN FLIGHT THIS MONTH' },
      { kind:'p',    text:'Snapshot of what Opentensor Foundation and subnet teams have announced or have on the immediate ship list. Read each entry on the source\'s feed for canonical detail.' },

      { kind:'h',    text:'ROOT WEIGHT ALGORITHM V3 · RFC OPEN' },
      { kind:'p',    text:'Opentensor Senate opened a public RFC on the algorithm that allocates emissions across the root subnet. V3 reweights toward subnets with active validator participation, not just stake. Comment window closes end of May.' },
      { kind:'note', text:'source · Opentensor Foundation' },

      { kind:'h',    text:'CHILD HOTKEY V2' },
      { kind:'p',    text:'Extends child-hotkey delegation to support per-subnet take splits. Validators can pay different rates per subnet they validate. Substrate runtime patch lands mid-month.' },
      { kind:'note', text:'source · Opentensor Foundation core' },

      { kind:'h',    text:'CROSS-SUBNET ALPHA MIGRATION' },
      { kind:'p',    text:'Native atomic swap of α₁ → TAO → α₂ in a single signed extrinsic, with bounded slippage. Removes the two-tx liquidity exposure when moving stake between subnets.' },
      { kind:'note', text:'source · Opentensor Foundation core' },

      { kind:'h',    text:'SN64 CHUTES · B200 CAPACITY · GA' },
      { kind:'p',    text:'Chutes opens Blackwell B200 inference capacity to all hotkeys on the subnet (was waitlisted). Expect TTFT to drop another 20–30% on the long-context tier.' },
      { kind:'note', text:'source · Chutes / Rayon Labs' },

      { kind:'h',    text:'SN9 PRETRAINING · COHORT 4 OPEN' },
      { kind:'p',    text:'Macrocosmos opens registration for the next pretraining cohort — ~16 outside teams admitted, eight-week run, shared compute pool. Applications close May 18.' },
      { kind:'note', text:'source · Macrocosmos' },

      { kind:'h',    text:'TAOSTATS API V2 · BETA' },
      { kind:'p',    text:'Public API v2 enters beta — per-subnet alpha-pool snapshots, validator weight history, slippage simulator. Same auth as v1.' },
      { kind:'note', text:'source · TaoStats' },

      { kind:'h',    text:'WALLET UX · BTCLI 7.0' },
      { kind:'p',    text:'btcli 7.0 collapses the cold/hot workflow for first-time miners into a single guided command. Reduces the "I lost my coldkey" support burden the foundation has been carrying for two years.' },
      { kind:'note', text:'source · Opentensor Foundation' },

      { kind:'h',    text:'SENATE PROPOSAL S-014' },
      { kind:'p',    text:'Vote scheduled for May 22 on tightening the deregistration EMA window from 14 days to 21. Aimed at giving brand-new subnets more runway, costing borderline subnets fewer second chances.' },
      { kind:'note', text:'source · Bittensor Senate' },
    ] },

  /* ===================================================================== */
  { id: 'weights', label: '/weights', title: 'Weights · Yuma Consensus',
    blurb: 'Validators score · the chain aggregates · honesty earns dividends.',
    body: [
      { kind:'h',    text:'THE LOOP' },
      { kind:'step', n:1, text:'Each block, miners submit responses to the subnet\'s task.' },
      { kind:'step', n:2, text:'Validators score those responses and assign a weight to each miner.' },
      { kind:'step', n:3, text:'The chain runs Yuma Consensus on every validator\'s weight vector.' },
      { kind:'step', n:4, text:'Final scores split the subnet\'s emission slice for the next cycle.' },

      { kind:'h',    text:'YUMA CONSENSUS · the simple version' },
      { kind:'p',    text:'Aggregate every validator\'s weight vector for miners, but discount validators whose weights diverge from the consensus (the kappa-clipping). The output is the consensus rank of every miner on the subnet — that\'s the share split.' },

      { kind:'h',    text:'BONDS · TRUST' },
      { kind:'p',    text:'Bonds are a validator\'s persistent vote for a miner — slow to move, prevents cartel flips. Trust is how many other validators agree with you; low trust → less weight in consensus.' },

      { kind:'h',    text:'CHILD HOTKEYS' },
      { kind:'p',    text:'A validator can delegate weight-setting to multiple "child" hotkeys without splitting its stake. Useful for redundancy and team setups.' },

      { kind:'h',    text:'WHY THIS MATTERS' },
      { kind:'p',    text:'Validators that copy other validators are useless to the network and the network learns to discount them. Honest scoring earns trust; trust earns dividends.' },
    ] },

  /* ===================================================================== */
  { id: 'dereg', label: '/dereg', title: 'Deregistration mechanics',
    blurb: 'The 128 cap · NAV + EMA · the worst subnet is pruned on every new register.',
    body: [
      { kind:'h',    text:'WHY IT EXISTS' },
      { kind:'p',    text:'The chain caps the network at 128 active subnets. Without pruning, dead or low-value subnets would bleed emissions from the strongest.' },

      { kind:'h',    text:'THE TRIGGER' },
      { kind:'p',    text:'When a new subnet registers and the network is at the cap, the chain evaluates every existing subnet for dereg. The subnet with the worst combined score loses.' },

      { kind:'h',    text:'THE SCORE' },
      { kind:'note', text:'IMMUNITY · brand-new subnets get a grace window (~7 days)' },
      { kind:'note', text:'NAV · staked TAO vs α market cap — pricing below NAV looks fragile' },
      { kind:'note', text:'EMA · exponentially-weighted average of emissions earned, alpha activity, validator count' },

      { kind:'h',    text:'ON DEREG' },
      { kind:'p',    text:'The subnet ceases · miners stop earning · locked TAO refunded to the owner (proportional to lock cost paid) · α-holders\' positions wind down as the alpha pool drains back to TAO.' },

      { kind:'h',    text:'WHAT TO WATCH' },
      { kind:'note', text:'your subnet\'s EMA trend · falling is the warning' },
      { kind:'note', text:'the bottom 5 in subnet rank · these get culled first' },
      { kind:'note', text:'new subnet announcements · they are the trigger' },

      { kind:'h',    text:'HISTORY' },
      { kind:'p',    text:'Deployed Sept 16 2025. ~30% of subnets active at launch were rated borderline. Several have cycled since. The mechanism is working as designed.' },
    ] },

  /* ===================================================================== */
  { id: 'halving', label: '/halving', title: 'Halving · supply schedule',
    blurb: 'Block reward halves every ~4 years · 21M TAO max · Bitcoin-shaped.',
    body: [
      { kind:'h',    text:'THE SCHEDULE' },
      { kind:'note', text:'block reward = 1 TAO at genesis (Sept 2023)' },
      { kind:'note', text:'halves every 10.5M blocks (≈ 4 years on 12s blocks)' },
      { kind:'note', text:'halving #1 · Sept 2024 · block reward → 0.5 TAO' },
      { kind:'note', text:'halving #2 · ~Sept 2028 · block reward → 0.25 TAO' },
      { kind:'note', text:'max supply · 21M TAO (capped, Bitcoin-shaped emission)' },

      { kind:'h',    text:'WHAT HAPPENS AT A HALVING' },
      { kind:'p',    text:'All subnet emissions halve in TAO terms; the relative split among subnets is unchanged. Validator dividends and miner rewards both halve in TAO. α-prices typically reprice to find a new fee equilibrium.' },

      { kind:'h',    text:'WHAT IT DOES NOT HALVE' },
      { kind:'note', text:'network compute throughput' },
      { kind:'note', text:'validator permit thresholds (stake-denominated)' },
      { kind:'note', text:'demand for the work · only the chain\'s payment for it' },
    ] },

]);
