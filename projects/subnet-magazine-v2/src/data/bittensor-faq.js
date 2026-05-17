/* =================================================================
   SUBNET MAGAZINE, BITTENSOR FIELD MANUAL
   -----------------------------------------------------------------
   Verified · enriched · against May 2026 sources.
   Last research pass: 2026-05-15.

   Each topic is an array of "lines" rendered into the terminal.
   Line kinds drive colour and layout:
     h     section heading        (red, uppercased)
     step  numbered instruction   (mono, with [01] prefix)
     cmd   shell command          (mono, $-prompted, ink-1)
     code  multi-line code block  (mono, no prompt, Python / TOML)
     note  parenthetical note     (dim, prefixed >)
     warn  warning                (red, prefixed !)
     cost  cost callout           (amber, prefixed τ)
     link  external link          (ink-1 underline)
     p     paragraph              (ink-2 prose)

   SOURCE-OF-TRUTH NOTES
   ---------------------
   · btcli current release: 9.21.2 (15 May 2026, opentensor/btcli)
   · btcli 9.x prefers hyphenated flags (--wallet-name) but the
     legacy dotted form (--wallet.name) and underscored subcommand
     aliases (new_coldkey) still resolve. Hyphen form is shown.
   · First halving executed 14 Dec 2025 at block 10.5M. Block reward
     is now 0.5 TAO (~3,600 TAO/day). Next halving ~Dec 2029.
   · Subnet cap is 128. Immunity for new subnets is 4 months
     (864,000 blocks), restored 17 Sept 2025 with the dereg restart.
   · dTAO went live 13 Feb 2025. Per-subnet alpha tokens trade in
     constant-product (x·y=k) pools.
   · Subnet creation lock cost is dynamic (recycled, not burned),
     halves over a recycling window, doubles on each new subnet.
     As of mid-May 2026 it sits in the low thousands of TAO; check
     `btcli subnet burn-cost` before you trust any printed number.
   ================================================================= */

/**
 * @typedef {Object} ManualLine
 * @prop {'h'|'step'|'cmd'|'code'|'note'|'warn'|'cost'|'link'|'p'} kind
 * @prop {string} text
 * @prop {number} [n]   step number for step lines
 * @prop {string} [href] target URL for link lines
 */

/**
 * @typedef {Object} ManualTopic
 * @prop {string} id
 * @prop {string} label                   short label / command
 * @prop {string} title
 * @prop {string} blurb                   one-line summary
 * @prop {'easy'|'medium'|'hard'} difficulty
 * @prop {string} timeRequired            e.g. '30 min', 'ongoing', '1-2 days'
 * @prop {string} cost                    e.g. '~τ1.2 + GPU rental', 'free (read-only)'
 * @prop {string[]} prerequisites
 * @prop {string} whatYouGet              outcome statement, 1-2 sentences
 * @prop {'high'|'medium'|'low'} confidence
 * @prop {string} researched              ISO date string
 * @prop {string[]} sources               authoritative URLs
 * @prop {ManualLine[]} body
 */

/** @type {readonly ManualTopic[]} */
export const FIELD_MANUAL = Object.freeze([

  /* ===================================================================== */
  { id: 'mine', label: '/mine', title: 'Mine a subnet',
    blurb: 'Install · wallets · register · run the miner · survive immunity · earn α.',
    difficulty: 'medium',
    timeRequired: '2-4 hours setup · ongoing operations',
    cost: 'recycled registration fee (varies per subnet) + compute · current burn ≈ τ1-30 on most subnets',
    prerequisites: [
      'Linux box or WSL2',
      'Python 3.10+ and git',
      'TAO in a coldkey (registration fee + ~τ1 buffer)',
      'GPU recommended for ML subnets · CPU is fine for many others',
      'A second machine for the coldkey (NEVER on the miner box)',
    ],
    whatYouGet: 'A registered miner UID on a chosen subnet, scored each tempo (~72 min) by validators, paid in that subnet\'s alpha token in proportion to the validator weight you earn.',
    confidence: 'high',
    researched: '2026-05-15',
    sources: [
      'https://docs.learnbittensor.org/btcli',
      'https://docs.learnbittensor.org/miners',
      'https://github.com/opentensor/btcli',
      'https://github.com/opentensor/bittensor-subnet-template',
    ],
    body: [
      { kind:'h',    text:'PREREQUISITES' },
      { kind:'p',    text:'Linux box or WSL2 · Python 3.10+ · git. A modest GPU helps for ML subnets, but plenty of subnets run on CPU. You will need TAO in a coldkey wallet to pay the recycled registration fee.' },
      { kind:'cost', text:'registration fee is dynamic per-subnet · cheap subnets ≈ τ1 · hot subnets can spike to τ30+ · always check before you sign' },

      { kind:'h',    text:'01 · INSTALL THE CLI + SDK' },
      { kind:'cmd',  text:'pip install bittensor-cli  # btcli 9.21.2 (May 2026)' },
      { kind:'cmd',  text:'pip install bittensor       # SDK (for subnet code)' },
      { kind:'cmd',  text:'btcli --version' },
      { kind:'note', text:'btcli 9.x prefers hyphen flags (--wallet-name) · the legacy dotted form (--wallet.name) still works' },

      { kind:'h',    text:'02 · CREATE WALLETS' },
      { kind:'p',    text:'A "coldkey" holds TAO and signs registration. A "hotkey" runs the miner. They are separate keys for a reason, never co-locate them on the same machine.' },
      { kind:'cmd',  text:'btcli wallet new-coldkey --wallet-name miner --n-words 24' },
      { kind:'cmd',  text:'btcli wallet new-hotkey  --wallet-name miner --hotkey default' },
      { kind:'note', text:'write the mnemonic on paper · store offline · the coldkey is the only thing that matters' },
      { kind:'warn', text:'never paste the mnemonic into a chat box, an LLM, or any cloud-synced note' },

      { kind:'h',    text:'03 · FUND THE COLDKEY' },
      { kind:'cmd',  text:'btcli wallet balance --wallet-name miner' },
      { kind:'p',    text:'Send TAO from an exchange (Kraken, MEXC, KuCoin, Coinbase) to the printed coldkey ss58 address. Wait for at least 1 confirmation before signing anything.' },

      { kind:'h',    text:'04 · PICK A SUBNET' },
      { kind:'p',    text:'Browse this site\'s Subnets table to see what each one does. Match the workload to your hardware: text-LLM subnets need GPUs, prediction-market subnets need data feeds, compute subnets host other people\'s inference.' },
      { kind:'cmd',  text:'btcli subnets list' },
      { kind:'cmd',  text:'btcli subnets show --netuid 1' },
      { kind:'note', text:'cheaper subnets have lower competition and lower α-prices · expensive subnets pay more but are harder to crack' },

      { kind:'h',    text:'05 · CLONE THE MINER CODE' },
      { kind:'p',    text:'Every serious subnet publishes its miner code on GitHub. Find the link on the subnet\'s row in the Subnets page, clone, install dependencies.' },
      { kind:'cmd',  text:'git clone https://github.com/<owner>/<subnet-repo>' },
      { kind:'cmd',  text:'cd <subnet-repo> && pip install -r requirements.txt' },

      { kind:'h',    text:'06 · REGISTER ON THE SUBNET' },
      { kind:'warn', text:'this is the only command that costs TAO · do not run it twice without intent' },
      { kind:'cmd',  text:'btcli subnets register --netuid 1 \\\n  --wallet-name miner --hotkey default' },
      { kind:'p',    text:'A successful registration prints something like:' },
      { kind:'code', text:'✓ Registered on netuid 1\n  uid:           184\n  hotkey ss58:   5GrwvaEF...xH8wY\n  recycled:      τ1.0234\n  immunity end:  block 5,184,210 (~7d 0h)' },

      { kind:'h',    text:'07 · RUN THE MINER' },
      { kind:'p',    text:'Each subnet\'s repo has a neurons/miner.py or equivalent. The generic shape:' },
      { kind:'cmd',  text:'python neurons/miner.py \\\n  --netuid 1 --subtensor.network finney \\\n  --wallet.name miner --wallet.hotkey default \\\n  --logging.debug' },
      { kind:'note', text:'subnet repos still use the SDK\'s dotted flag style (--wallet.name), that is correct here' },

      { kind:'h',    text:'08 · SURVIVE NEURON IMMUNITY' },
      { kind:'p',    text:'Each subnet sets a per-neuron immunity period (a hyperparameter, typically a few thousand blocks ≈ a handful of hours, distinct from the 4-month subnet-level immunity). Use this window to confirm your miner is producing valid responses, watch the logs, watch your incentive score climb.' },

      { kind:'h',    text:'09 · EARN' },
      { kind:'p',    text:'Validators score your output and set weights. Your share of the subnet\'s emission slice is your share of total weight. Miner emissions are paid in that subnet\'s α token. Read /weights for the consensus math and /dtao for what α actually is.' },

      { kind:'h',    text:'WARNINGS' },
      { kind:'warn', text:'never expose the coldkey on the box your miner runs from' },
      { kind:'warn', text:'use systemd / pm2 / docker so the miner survives reboots' },
      { kind:'warn', text:'if you are consistently producing zero output the next dereg sweep is coming · check the subnet\'s discord' },

      { kind:'h',    text:'CANONICAL SOURCES' },
      { kind:'link', text:'docs.learnbittensor.org/miners', href:'https://docs.learnbittensor.org/miners' },
      { kind:'link', text:'github.com/opentensor/btcli', href:'https://github.com/opentensor/btcli' },
      { kind:'link', text:'github.com/opentensor/bittensor-subnet-template', href:'https://github.com/opentensor/bittensor-subnet-template' },
    ] },

  /* ===================================================================== */
  { id: 'validate', label: '/validate', title: 'Run a validator',
    blurb: 'Stake the permit cutoff · score honestly · earn dividends in α.',
    difficulty: 'hard',
    timeRequired: '1-2 days setup · 24/7 operations',
    cost: 'enough α-stake to crack the subnet\'s permit cutoff (varies by subnet, hundreds to many thousands of α) + reliable infra',
    prerequisites: [
      'Everything in /mine',
      'A reliable always-on box · datacentre or cloud, not a laptop',
      'Monitoring (Grafana / Prometheus or equivalent)',
      'Enough α-stake on the target subnet to make the validator-permit cutoff',
      'A delegation pitch if you want nominators to stake to you',
    ],
    whatYouGet: 'A validator-permitted hotkey on the subnet, setting weights every tempo, earning the validator share of emissions plus delegated-stake "take" from any nominators.',
    confidence: 'high',
    researched: '2026-05-15',
    sources: [
      'https://docs.learnbittensor.org/validators',
      'https://docs.learnbittensor.org/staking-and-delegation/managing-stake-btcli',
      'https://docs.learnbittensor.org/btcli',
    ],
    body: [
      { kind:'h',    text:'PREREQUISITES' },
      { kind:'p',    text:'Real α-stake, enough to crack the subnet\'s validator permit threshold. The chain admits the top N hotkeys by α-stake on each subnet (max-allowed-validators is a per-subnet hyperparameter, typically 64). A reliable box; validators that go offline lose vTrust fast.' },

      { kind:'h',    text:'01 · INSTALL + WALLETS' },
      { kind:'p',    text:'Same as /mine, install bittensor-cli, make a coldkey, make a hotkey. Then come back here.' },

      { kind:'h',    text:'02 · STAKE ON THE SUBNET' },
      { kind:'p',    text:'Buy α on the target subnet by staking TAO into its bonding-curve pool. Stake enough to crack the permit cutoff. Safe-staking is on by default with a 5% rate-tolerance, a slippage guard.' },
      { kind:'cmd',  text:'btcli stake add --wallet-name val --hotkey default \\\n  --netuid 1 --amount 1000' },
      { kind:'note', text:'add --tolerance 0.05 to override default slippage protection · or --unsafe to disable' },

      { kind:'h',    text:'03 · CONFIRM YOUR PERMIT' },
      { kind:'cmd',  text:'btcli wallet inspect --wallet-name val' },
      { kind:'cmd',  text:'btcli stake list --wallet-name val' },
      { kind:'note', text:'look for "validator permit: True" on the subnet row' },

      { kind:'h',    text:'04 · RUN THE VALIDATOR' },
      { kind:'cmd',  text:'python neurons/validator.py \\\n  --netuid 1 --wallet.name val --wallet.hotkey default \\\n  --logging.debug' },

      { kind:'h',    text:'05 · SET WEIGHTS HONESTLY' },
      { kind:'p',    text:'Yuma Consensus runs every tempo (360 blocks ≈ 72 min). If your weight vector diverges from the cluster you get clipped (kappa-clipping) and your dividends drop. Do not weight-copy blindly. Your honest scoring is the network\'s trust signal.' },

      { kind:'h',    text:'06 · PAY YOUR DELEGATORS' },
      { kind:'p',    text:'Nominators stake α to your hotkey expecting yield. Your "take" is the share you keep. Industry standard sits in the 10–18% band.' },
      { kind:'cmd',  text:'btcli sudo set-take --wallet-name val --hotkey default --take 0.12' },

      { kind:'h',    text:'07 · CHILD HOTKEYS (OPTIONAL)' },
      { kind:'p',    text:'A validator can split its weight-setting authority across multiple "child" hotkeys without splitting its α-stake. Useful for redundancy, multi-region, or team setups.' },
      { kind:'cmd',  text:'btcli stake child set --netuid 1 \\\n  --children 5HEXVAH...ei,5Gx1CZ...4s \\\n  --proportions 0.5,0.5 \\\n  --hotkey 5DqJdDL...9Y --wallet-name val' },
      { kind:'note', text:'proportions must sum to 1.0' },

      { kind:'h',    text:'WARNINGS' },
      { kind:'warn', text:'two months offline and you are functionally a dead hotkey · trust decays fast' },
      { kind:'warn', text:'never co-locate cold + hot keys on the same box · use a Ledger or proxy for the coldkey' },
      { kind:'warn', text:'changing your take erodes nominator trust · set it once, honour it forever' },

      { kind:'h',    text:'CANONICAL SOURCES' },
      { kind:'link', text:'docs.learnbittensor.org/validators', href:'https://docs.learnbittensor.org/validators' },
      { kind:'link', text:'docs.learnbittensor.org/subnets/child-hotkeys', href:'https://docs.learnbittensor.org/subnets/child-hotkeys/' },
    ] },

  /* ===================================================================== */
  { id: 'register', label: '/register', title: 'Register a new subnet',
    blurb: 'Define the task · pay the lock cost · seed validators · survive 4 months.',
    difficulty: 'hard',
    timeRequired: '2-8 weeks build · 4-month immunity runway · ongoing',
    cost: 'lock cost is dynamic, confirm with `btcli subnet burn-cost` before you sign · spent more often in the low thousands of TAO than the early-2025 multi-thousand-TAO peaks · post-Oct 2025 registrations are NOT refunded on dereg',
    prerequisites: [
      'A working miner template · a working validator template · a scoring rule that resists weight-copying',
      'Public GitHub repo with docs',
      'Coldkey funded with the lock cost + buffer for early-validator subsidies',
      'A team or community committed to the next 4 months',
    ],
    whatYouGet: 'A new subnet UID with its own α-token bonding-curve pool, 4 months of dereg-immunity runway, and an 18% cut of the subnet\'s emissions for as long as it stays alive (the default, many owners now reduce this).',
    confidence: 'high',
    researched: '2026-05-15',
    sources: [
      'https://docs.learnbittensor.org/subnets/create-a-subnet',
      'https://docs.learnbittensor.org/subnets/subnet-deregistration',
      'https://docs.learnbittensor.org/learn/announcements',
    ],
    body: [
      { kind:'h',    text:'WHAT YOU ARE BUYING' },
      { kind:'p',    text:'A subnet is a market. You define the task; miners compete to solve it; you take up to 18% of the subnet\'s emissions for as long as it stays alive. The chain charges a "lock cost" up front. For subnets registered after 1 Oct 2025 the lock cost is NOT refunded on deregistration, it is the price of admission.' },

      { kind:'h',    text:'01 · KNOW THE COST' },
      { kind:'p',    text:'Subnet creation lock cost is dynamic, it lowers gradually and doubles on every new subnet creation. Always check the live number before signing.' },
      { kind:'cmd',  text:'btcli subnet burn-cost --network finney' },
      { kind:'cost', text:'as of mid-May 2026 burn cost has trended in the low thousands of TAO · spikes possible · never trust a cached figure' },

      { kind:'h',    text:'02 · BUILD THE TASK FIRST' },
      { kind:'p',    text:'Before you spend TAO, your codebase has to exist: a miner template (what to compute), a validator template (how to score), and a scoring rule that resists weight-copying. Fork the template:' },
      { kind:'cmd',  text:'git clone https://github.com/opentensor/bittensor-subnet-template' },
      { kind:'note', text:'the template abstracts the wire-protocol (template/protocol.py) and gives you starter neurons/miner.py and neurons/validator.py' },

      { kind:'h',    text:'03 · CREATE THE SUBNET' },
      { kind:'cmd',  text:'btcli subnet create --wallet-name owner --hotkey default' },
      { kind:'cmd',  text:'btcli subnet start  --netuid <new-id> --wallet-name owner' },
      { kind:'note', text:'subnet creation is rate-limited to 1 every 14,400 blocks (~2 days) network-wide' },
      { kind:'note', text:'newly created subnets are inactive · `subnet start` activates them' },

      { kind:'h',    text:'04 · SEED VALIDATORS' },
      { kind:'p',    text:'A new subnet starts with zero scoring. Recruit 2–3 honest validators to run your validator code in the first 24 hours. Without scoring, miners cannot earn and your α-pool will not attract liquidity.' },

      { kind:'h',    text:'05 · ANNOUNCE' },
      { kind:'p',    text:'The first 4 months are your immunity window, the dereg sweep cannot touch you. Use them. Discord, X, Subneτ Magazine, say what your subnet does in one sentence and where to read the docs. Your job in immunity is to bid α-pool liquidity high enough that the EMA price clears the bottom of the table by month 4.' },

      { kind:'h',    text:'06 · KEEP IT ALIVE PAST IMMUNITY' },
      { kind:'p',    text:'After 864,000 blocks (~4 months) you are a dereg candidate. The lowest-EMA-α-price non-immune subnet is pruned every time a new subnet registers and the cap is full. Read /dereg.' },

      { kind:'h',    text:'CANONICAL SOURCES' },
      { kind:'link', text:'docs.learnbittensor.org/subnets/create-a-subnet', href:'https://docs.learnbittensor.org/subnets/create-a-subnet' },
      { kind:'link', text:'github.com/opentensor/bittensor-subnet-template', href:'https://github.com/opentensor/bittensor-subnet-template' },
    ] },

  /* ===================================================================== */
  { id: 'wallet', label: '/wallet', title: 'Wallets · cold + hot keys',
    blurb: 'Coldkey holds funds · hotkey runs the work · never the same box.',
    difficulty: 'easy',
    timeRequired: '15-30 min',
    cost: 'free (the keys themselves) · 0.1 TAO if you ever need to swap a coldkey',
    prerequisites: [
      'btcli installed (pip install bittensor-cli)',
      'A pen and a piece of paper for the mnemonic',
    ],
    whatYouGet: 'A coldkey + hotkey pair you control on-chain, with the mnemonics safely offline and the right operational separation between funds and work.',
    confidence: 'high',
    researched: '2026-05-15',
    sources: [
      'https://docs.learnbittensor.org/keys/working-with-keys',
      'https://docs.learnbittensor.org/keys/wallets',
      'https://docs.learnbittensor.org/keys/coldkey-hotkey-security',
    ],
    body: [
      { kind:'h',    text:'COLDKEY · the bank account' },
      { kind:'p',    text:'Holds TAO and α. Signs transfers, staking, registration, subnet ownership. Never lives on the box that runs the miner or validator. The mnemonic is full control, write it on paper, store it offline.' },

      { kind:'h',    text:'HOTKEY · the worker' },
      { kind:'p',    text:'Signs the operational stuff: weight-setting, response submission. Compromise is annoying but recoverable, the coldkey controls the funds and can swap the hotkey out.' },

      { kind:'h',    text:'CREATE' },
      { kind:'cmd',  text:'btcli wallet new-coldkey --wallet-name <name> --n-words 24' },
      { kind:'cmd',  text:'btcli wallet new-hotkey  --wallet-name <name> --hotkey default' },
      { kind:'note', text:'or one-shot both: btcli wallet create --wallet-name <name> --hotkey default' },

      { kind:'h',    text:'INSPECT' },
      { kind:'cmd',  text:'btcli wallet balance --wallet-name <name>' },
      { kind:'cmd',  text:'btcli wallet inspect --wallet-name <name>' },
      { kind:'cmd',  text:'btcli wallet list' },

      { kind:'h',    text:'MOVE FUNDS' },
      { kind:'cmd',  text:'btcli wallet transfer --wallet-name <name> \\\n  --destination 5xxx... --amount 10' },

      { kind:'h',    text:'REGENERATE FROM MNEMONIC' },
      { kind:'cmd',  text:'btcli wallet regen-coldkey --wallet-name recovered \\\n  --mnemonic "word1 word2 word3 ..."' },
      { kind:'cmd',  text:'btcli wallet regen-hotkey --wallet-name recovered \\\n  --hotkey default --mnemonic "word1 word2 ..."' },

      { kind:'h',    text:'IF SOMETHING GOES WRONG' },
      { kind:'p',    text:'Coldkey leaked: schedule a swap (5-day waiting period, 0.1 TAO fee), see /security. Hotkey leaked: rotate it immediately with `btcli wallet swap-hotkey` (1 TAO recycle fee, instant).' },

      { kind:'h',    text:'CANONICAL SOURCES' },
      { kind:'link', text:'docs.learnbittensor.org/keys/working-with-keys', href:'https://docs.learnbittensor.org/keys/working-with-keys' },
      { kind:'link', text:'docs.learnbittensor.org/keys/coldkey-hotkey-security', href:'https://docs.learnbittensor.org/keys/coldkey-hotkey-security' },
    ] },

  /* ===================================================================== */
  { id: 'dtao', label: '/dtao', title: 'dTAO · alpha tokens',
    blurb: 'Every subnet has its own token · TAO/α pool prices it · α-mcap = emission share.',
    difficulty: 'medium',
    timeRequired: '30-45 min to read · ongoing to follow',
    cost: 'free (read-only)',
    prerequisites: [
      'Mental model of constant-product AMMs (Uniswap-style)',
      'Familiarity with /wallet and /weights helps',
    ],
    whatYouGet: 'A working understanding of how every subnet has its own α token, how the bonding-curve pool prices it, and why α market cap (not validator votes) now drives emissions.',
    confidence: 'high',
    researched: '2026-05-15',
    sources: [
      'https://docs.learnbittensor.org/dynamic-tao/dtao-faq',
      'https://www.bittensor.ai/what-is-dtao',
      'https://docs.taostats.io/docs/alpha-tokens',
      'https://www.coingecko.com/learn/top-bittensor-subnets-dtao',
    ],
    body: [
      { kind:'h',    text:'THE OLD WAY (pre-Feb 2025)' },
      { kind:'p',    text:'All τ was the same. Validators voted "root weights" that decided how the chain split emissions across subnets, a small group of stakers chose the winners every block.' },

      { kind:'h',    text:'THE NEW WAY · dTAO (live 13 Feb 2025)' },
      { kind:'p',    text:'Every subnet has its own alpha token (α₁, α₂, …, α₁₂₈). TAO and α trade in a per-subnet bonding-curve pool. α-price = TAO reserve / α reserve. The market chooses the winners now, not a small group of voters.' },

      { kind:'h',    text:'THE BONDING CURVE' },
      { kind:'p',    text:'Each subnet pool holds TAO reserves and α reserves and prices α off a constant-product curve (x · y = k). Add TAO → α-price rises and you receive α at the new marginal rate. Remove α → α-price falls. No oracle, no admin keys, no privileged listing.' },

      { kind:'h',    text:'EMISSION SHARE' },
      { kind:'p',    text:'A subnet\'s emission share ≈ its α market cap / sum of all α market caps. Bigger pool, bigger share. The chain itself does not have to choose what is "useful", the market does, by where it parks TAO.' },

      { kind:'h',    text:'TOP 5 SUBNETS BY α-MCAP (per CoinGecko, March 2026 snapshot)' },
      { kind:'note', text:'SN3  · τemplar       · ~$134.9M α-mcap · large-scale LLM training' },
      { kind:'note', text:'SN64 · Chutes        · ~$132.9M α-mcap · serverless AI inference (Rayon Labs)' },
      { kind:'note', text:'SN4  · Targon        · ~$91.8M  α-mcap · confidential GPU compute' },
      { kind:'note', text:'SN120 · Affine       · ~$71.8M  α-mcap · RL reasoning' },
      { kind:'note', text:'SN51 · Lium          · ~$52.1M  α-mcap · P2P GPU marketplace' },
      { kind:'p',    text:'Combined top-10 α-mcap reached ~$712M, against total α-mcap ~$1.12B, so the top-10 is roughly 64% of the alpha economy. Verify the live numbers on taostats.io before trading off them.' },

      { kind:'h',    text:'WORKED EXAMPLE · BOND τ100 TO SN64' },
      { kind:'p',    text:'Suppose SN64 pool depth is 14,200 τ TAO + 412,000 α. Constant-product k = 14,200 × 412,000 = 5.85B. Pre-trade α-price = 14,200 / 412,000 = 0.0345 τ/α. You add τ100. New TAO reserve = 14,300. New α reserve = k / 14,300 = 408,917. You receive 412,000 − 408,917 ≈ 3,083 α. Your effective entry price = 100 / 3,083 ≈ 0.0324 τ/α, about 6% better than the post-trade marginal price (0.0349 τ/α) because of the curve shape. Round-tripping that same τ100 immediately would lose to the slippage.' },
      { kind:'note', text:'arithmetic example only · live SN64 pool numbers move every block · check taostats before sizing real trades' },

      { kind:'h',    text:'STAKE OPTIONS' },
      { kind:'note', text:'stake TAO → root subnet · roughly equal share across the network · paid in TAO' },
      { kind:'note', text:'stake α   → that subnet · leveraged on its success · paid in α' },
      { kind:'note', text:'α-yield depends on the subnet actually earning emissions through real validator activity, not just on α-price moving up' },

      { kind:'h',    text:'SLIPPAGE · LIQUIDITY' },
      { kind:'p',    text:'Thin pools cost more to enter and exit. As a rule of thumb, a trade size = 1% of pool depth → ~1% price impact; 10% of pool → ~11% impact. A high α-yield in a shallow pool can vanish on the way out, always check pool depth before staking large into a subnet.' },

      { kind:'h',    text:'WHAT TO LOOK FOR' },
      { kind:'note', text:'α-price 30d chart · live demand for the subnet' },
      { kind:'note', text:'TAO in pool · the liquidity that backs every entry and exit' },
      { kind:'note', text:'α-staked vs floating · who is leaving and who is compounding' },
      { kind:'note', text:'α-mcap vs the subnet\'s real validator activity · sniff out empty pumps' },

      { kind:'h',    text:'CANONICAL SOURCES' },
      { kind:'link', text:'docs.learnbittensor.org/dynamic-tao/dtao-faq', href:'https://docs.learnbittensor.org/dynamic-tao/dtao-faq' },
      { kind:'link', text:'taostats.io', href:'https://taostats.io' },
    ] },

  /* ===================================================================== */
  { id: 'dtao-trade', label: '/dtao-trade', title: 'How to trade α tokens',
    blurb: 'Buy and sell subnet alpha · slippage · the bonding-curve guards.',
    difficulty: 'easy',
    timeRequired: '20 min',
    cost: 'gas-equivalent on-chain fee + slippage on the bonding curve · safe-staking default tolerance is 5%',
    prerequisites: [
      'A funded coldkey (TAO)',
      'btcli installed OR a TAO wallet UI (Crucible, Talisman, Bitget Wallet, Bittensor.com)',
      'Read /dtao first',
    ],
    whatYouGet: 'The ability to swap TAO ↔ subnet-α with a known maximum slippage, knowing the price-protection knobs and the trading-UI options.',
    confidence: 'high',
    researched: '2026-05-15',
    sources: [
      'https://docs.learnbittensor.org/learn/price-protection/',
      'https://docs.learnbittensor.org/staking-and-delegation/managing-stake-btcli',
      'https://docs.taostats.io/docs/alpha-tokens',
      'https://www.bittensor.ai/what-is-dtao',
    ],
    body: [
      { kind:'h',    text:'THE TWO ROUTES' },
      { kind:'p',    text:'Route A · btcli, sign with your local coldkey, scriptable, no front-end risk. Route B · a wallet UI (Bittensor.com, Taostats.io, Crucible, Talisman, Bitget Wallet), friendlier for one-off trades, especially with Ledger.' },

      { kind:'h',    text:'BUY α (TAO → α) · BTCLI' },
      { kind:'cmd',  text:'btcli stake add --wallet-name <name> --hotkey default \\\n  --netuid 64 --amount 100' },
      { kind:'note', text:'safe-staking is ON by default · default tolerance 5% · trade reverts if slippage exceeds it' },
      { kind:'cmd',  text:'btcli stake add --netuid 64 --amount 100 --tolerance 0.02   # tighter' },
      { kind:'cmd',  text:'btcli stake add --netuid 64 --amount 100 --unsafe          # disable guard' },

      { kind:'h',    text:'SELL α (α → TAO) · BTCLI' },
      { kind:'cmd',  text:'btcli stake remove --wallet-name <name> --hotkey default \\\n  --netuid 64 --amount 50' },
      { kind:'cmd',  text:'btcli stake remove --netuid 64 --all     # exit the position entirely' },

      { kind:'h',    text:'MOVE α BETWEEN SUBNETS' },
      { kind:'cmd',  text:'btcli stake move --wallet-name <name> \\\n  --origin-netuid 64 --destination-netuid 56 --amount 25' },
      { kind:'note', text:'`stake move` is two pool swaps · fees apply on both legs' },

      { kind:'h',    text:'BUY α · WALLET UI' },
      { kind:'step', n:1, text:'Open Taostats.io → Subnets → pick the subnet → "Stake" panel.' },
      { kind:'step', n:2, text:'Connect wallet (Crucible, Talisman, Bitget Wallet, Polkadot.js + Ledger).' },
      { kind:'step', n:3, text:'Enter τ amount, set slippage tolerance, review the quoted α and price impact.' },
      { kind:'step', n:4, text:'Sign on device (Ledger users: confirm on-screen).' },

      { kind:'h',    text:'BONDING CURVE · WHAT YOU ARE TRADING AGAINST' },
      { kind:'p',    text:'Every TAO → α buy moves α-price up · every α → TAO sell moves it down. There is no order book. Your effective price is the area under the curve between your start point and end point, strictly worse than the marginal pre-trade price for any non-zero size.' },

      { kind:'h',    text:'PRICE-IMPACT RULE OF THUMB' },
      { kind:'note', text:'trade ≈ 1% of pool depth → ~1% price impact' },
      { kind:'note', text:'trade ≈ 5% of pool depth → ~5.3% price impact' },
      { kind:'note', text:'trade ≈ 10% of pool depth → ~11% price impact' },
      { kind:'note', text:'trade > 20% of pool depth → consider splitting across blocks' },

      { kind:'h',    text:'WARNINGS' },
      { kind:'warn', text:'thin α-pools can swing 30%+ on a single retail-size order · ALWAYS check pool depth first' },
      { kind:'warn', text:'a high-yield subnet with a shallow pool can be a one-way trap · the entry slippage + the exit slippage is the round-trip fee' },
      { kind:'warn', text:'never sign a slippage-tolerance >10% on a real trade · safe-staking exists for a reason' },

      { kind:'h',    text:'CANONICAL SOURCES' },
      { kind:'link', text:'docs.learnbittensor.org/learn/price-protection', href:'https://docs.learnbittensor.org/learn/price-protection/' },
      { kind:'link', text:'docs.learnbittensor.org/staking-and-delegation/managing-stake-btcli', href:'https://docs.learnbittensor.org/staking-and-delegation/managing-stake-btcli' },
    ] },

  /* ===================================================================== */
  { id: 'subnet-build', label: '/subnet-build', title: 'Launch a new subnet from zero',
    blurb: 'SDK skeleton · incentive code · validator code · cost · timeline.',
    difficulty: 'hard',
    timeRequired: '4-12 weeks build · 4-month immunity window after launch',
    cost: 'lock cost (dynamic, low thousands of τ in mid-2026) + dev time + early-validator/miner subsidies · post-Oct 2025 launches do not get the lock cost back',
    prerequisites: [
      'A real, defensible task, one with a scoring rule that resists weight-copying',
      'Senior Python · async · networking · Substrate-friendly mindset',
      'GitHub repo · Discord · documentation',
      'Coldkey funded with the lock cost + buffer',
    ],
    whatYouGet: 'A live subnet with a UID, an α-pool, miner and validator codepaths, and 4 months of dereg-immunity to bid up the EMA price.',
    confidence: 'medium',
    researched: '2026-05-15',
    sources: [
      'https://docs.learnbittensor.org/subnets/create-a-subnet',
      'https://github.com/opentensor/bittensor-subnet-template',
      'https://github.com/opentensor/ocr_subnet',
    ],
    body: [
      { kind:'h',    text:'PHASE 0 · DECIDE THE TASK' },
      { kind:'p',    text:'Before any code: write down (a) what miners produce, (b) how validators score it, (c) why the score cannot be cheaply gamed by copying. If you cannot answer (c) the subnet will be a weight-copy farm and you will lose the lock cost.' },

      { kind:'h',    text:'PHASE 1 · FORK THE TEMPLATE' },
      { kind:'cmd',  text:'git clone https://github.com/opentensor/bittensor-subnet-template' },
      { kind:'cmd',  text:'cd bittensor-subnet-template && pip install -e .' },
      { kind:'p',    text:'The template gives you the scaffolding · template/protocol.py defines the wire-format, neurons/miner.py and neurons/validator.py are starting points.' },

      { kind:'h',    text:'PHASE 2 · DEFINE THE PROTOCOL' },
      { kind:'p',    text:'Edit template/protocol.py to define the request/response schema. Bittensor uses Pydantic-typed Synapse classes.' },
      { kind:'code', text:'import bittensor as bt\n\nclass MyTask(bt.Synapse):\n    # what the validator sends\n    prompt: str\n\n    # what the miner returns (filled by deserialize)\n    response: str | None = None\n\n    def deserialize(self) -> str:\n        return self.response or ""' },

      { kind:'h',    text:'PHASE 3 · MINER CODE' },
      { kind:'p',    text:'Implement the forward function, given a Synapse, populate the response.' },
      { kind:'code', text:'async def forward(synapse: MyTask) -> MyTask:\n    synapse.response = my_model(synapse.prompt)\n    return synapse' },

      { kind:'h',    text:'PHASE 4 · VALIDATOR CODE · SCORING' },
      { kind:'p',    text:'The validator queries miners, scores responses, normalises into a weight vector, and submits via set_weights. Yuma Consensus aggregates across validators.' },
      { kind:'code', text:'rewards = score_responses(responses, ground_truth)  # your scoring rule\nweights = rewards / rewards.sum()\nsubtensor.set_weights(\n    netuid=NETUID,\n    uids=miner_uids,\n    weights=weights,\n    wallet=wallet,\n)' },
      { kind:'warn', text:'a scoring rule that is easy to reverse-engineer is a scoring rule miners will reverse-engineer · invest here' },

      { kind:'h',    text:'PHASE 5 · TEST ON LOCAL CHAIN, THEN TESTNET' },
      { kind:'cmd',  text:'btcli subnet create --network test --wallet-name owner-test' },
      { kind:'cmd',  text:'btcli subnet start  --network test --netuid <id> --wallet-name owner-test' },
      { kind:'p',    text:'Run miner + validator + at least one extra miner · prove the scoring discriminates · prove a copy-attacker scores worse than an honest miner. Only THEN move to mainnet.' },

      { kind:'h',    text:'PHASE 6 · MAINNET LAUNCH' },
      { kind:'cmd',  text:'btcli subnet burn-cost --network finney   # always check first' },
      { kind:'cmd',  text:'btcli subnet create  --wallet-name owner --hotkey default' },
      { kind:'cmd',  text:'btcli subnet start   --netuid <new-id> --wallet-name owner' },
      { kind:'cost', text:'lock cost is dynamic · NOT refunded on dereg for post-1-Oct-2025 subnets · sign with your eyes open' },

      { kind:'h',    text:'PHASE 7 · SEED + ANNOUNCE' },
      { kind:'p',    text:'Recruit 2–3 honest validators in the first 24 hours. Announce on Discord, X, Subneτ Magazine. Your immunity clock is 4 months, every block is runway.' },

      { kind:'h',    text:'PHASE 8 · BUILD α-LIQUIDITY' },
      { kind:'p',    text:'EMA-of-α-price is the dereg metric. Bid up your pool, your own treasury, partner stake, real users buying α to access the subnet\'s outputs. Without α-pool depth you will dereg the moment immunity ends.' },

      { kind:'h',    text:'CANONICAL SOURCES' },
      { kind:'link', text:'docs.learnbittensor.org/subnets/create-a-subnet', href:'https://docs.learnbittensor.org/subnets/create-a-subnet' },
      { kind:'link', text:'github.com/opentensor/bittensor-subnet-template', href:'https://github.com/opentensor/bittensor-subnet-template' },
      { kind:'link', text:'github.com/opentensor/ocr_subnet  (worked example)', href:'https://github.com/opentensor/ocr_subnet' },
    ] },

  /* ===================================================================== */
  { id: 'weights', label: '/weights', title: 'Weights · Yuma Consensus',
    blurb: 'Validators score · the chain aggregates · honesty earns dividends.',
    difficulty: 'medium',
    timeRequired: '30 min to read · the math rewards re-reading',
    cost: 'free (read-only)',
    prerequisites: [
      'Mental model of weighted-median aggregation',
      'Familiarity with /mine and /validate helps',
    ],
    whatYouGet: 'A working understanding of how miner scores roll up into chain emissions, why kappa-clipping punishes outliers, and what bonds and trust actually do.',
    confidence: 'high',
    researched: '2026-05-15',
    sources: [
      'https://docs.learnbittensor.org/yuma-consensus',
      'https://arxiv.org/abs/2003.03917',
      'https://docs.learnbittensor.org/subnets/child-hotkeys/',
    ],
    body: [
      { kind:'h',    text:'THE LOOP' },
      { kind:'step', n:1, text:'Each block, miners submit responses to the subnet\'s task.' },
      { kind:'step', n:2, text:'Validators score those responses and assign a weight to each miner.' },
      { kind:'step', n:3, text:'Every tempo (360 blocks ≈ 72 min) the chain runs Yuma Consensus on every validator\'s weight vector.' },
      { kind:'step', n:4, text:'Final scores split the subnet\'s emission slice for the next tempo.' },

      { kind:'h',    text:'YUMA CONSENSUS · the simple version' },
      { kind:'p',    text:'Aggregate every validator\'s weight vector for miners using a stake-weighted median, then discount validators whose weights diverge from the consensus (kappa-clipping). The output is the consensus rank of every miner on the subnet, that\'s the share split.' },

      { kind:'h',    text:'EMISSION SPLIT · DEFAULT' },
      { kind:'note', text:'41% to miners (the work)' },
      { kind:'note', text:'41% to validators + their nominators (the scoring)' },
      { kind:'note', text:'18% to the subnet owner (the market)' },
      { kind:'p',    text:'Subnet owners can reduce their share. The split is per-block, per-subnet, paid in that subnet\'s α token.' },

      { kind:'h',    text:'BONDS · TRUST' },
      { kind:'p',    text:'Bonds are a validator\'s persistent vote for a miner, slow to move, prevents cartel flips. Trust is how many other stake-weighted validators agree with you; low trust → less weight in consensus → smaller dividends.' },

      { kind:'h',    text:'CHILD HOTKEYS' },
      { kind:'p',    text:'A validator can delegate weight-setting to multiple "child" hotkeys without splitting its α-stake. Useful for redundancy and team setups. See /validate step 07.' },

      { kind:'h',    text:'WHY THIS MATTERS' },
      { kind:'p',    text:'Validators that copy other validators are useless to the network and the network learns to discount them. Honest scoring earns trust; trust earns dividends.' },

      { kind:'h',    text:'CANONICAL SOURCES' },
      { kind:'link', text:'docs.learnbittensor.org/yuma-consensus', href:'https://docs.learnbittensor.org/yuma-consensus' },
      { kind:'link', text:'arxiv.org/abs/2003.03917  (Rao et al., 2020)', href:'https://arxiv.org/abs/2003.03917' },
    ] },

  /* ===================================================================== */
  { id: 'dereg', label: '/dereg', title: 'Deregistration mechanics',
    blurb: 'The 128 cap · 4-month immunity · lowest-EMA-α-price loses on every new register.',
    difficulty: 'medium',
    timeRequired: '20 min',
    cost: 'free (read-only) · but the dereg event itself is permanent',
    prerequisites: [
      'Read /dtao first (the EMA is on α-price)',
    ],
    whatYouGet: 'A precise picture of how the 128-cap is enforced, what the 4-month immunity gives you, and what happens to α-holders and the subnet owner when the sweep hits.',
    confidence: 'high',
    researched: '2026-05-15',
    sources: [
      'https://docs.learnbittensor.org/subnets/subnet-deregistration',
      'https://docs.learnbittensor.org/learn/announcements',
      'https://x.com/opentensor/status/1978637991276126453',
    ],
    body: [
      { kind:'h',    text:'WHY IT EXISTS' },
      { kind:'p',    text:'The chain caps the network at 128 active subnets. Without pruning, dead or low-value subnets would bleed emissions from the strongest. The dereg + reg mechanism was restored on 17 Sept 2025 after a long pause.' },

      { kind:'h',    text:'THE TRIGGER' },
      { kind:'p',    text:'When a new subnet registers and the network is at 128, the chain selects the non-immune subnet with the lowest EMA-α-price for dereg. Dereg can occur at most once every ~2 days (one per subnet creation, which is itself rate-limited to one per 14,400 blocks).' },

      { kind:'h',    text:'IMMUNITY · 4 MONTHS' },
      { kind:'note', text:'new subnets get 864,000 blocks (~4 months at 12s/block) of full immunity from the dereg sweep' },
      { kind:'note', text:'this is the SUBNET-level immunity · distinct from per-neuron immunity inside a subnet' },

      { kind:'h',    text:'THE METRIC · EMA OF α-PRICE' },
      { kind:'p',    text:'Not stake, not emissions earned, the exponentially-weighted moving average of the subnet\'s α token price. The EMA uses a dynamic alpha that adjusts with subnet age (base ~0.0003 on mainnet), so brand-new subnets have noisier reads early on. Defending α-price = defending your subnet\'s life.' },

      { kind:'h',    text:'ON DEREG' },
      { kind:'p',    text:'The subnet ceases · miners stop earning · all alpha is converted to TAO and added to the subnet\'s TAO reserve · α-holders receive proportional distributions from that pool: (your α / total α) × pool TAO.' },
      { kind:'p',    text:'Lock-cost refund: pre-dTAO subnets get nothing (already compensated). Subnets registered before 1 Oct 2025 get `lock_cost − owner_emissions_received_in_TAO`. Subnets registered after 1 Oct 2025 get NO lock refund.' },

      { kind:'h',    text:'WHAT TO WATCH' },
      { kind:'note', text:'your subnet\'s 7d EMA-α-price trend · falling is the warning' },
      { kind:'note', text:'the bottom 5 in the dereg-pruning list on taostats · these get culled first' },
      { kind:'note', text:'new subnet announcements · they are the trigger' },

      { kind:'h',    text:'HISTORY' },
      { kind:'p',    text:'Mechanism redeployed 17 Sept 2025 with a 7-day delay before the first dereg could fire. Several borderline subnets have cycled out since. The mechanism is working as designed, and the OF community has openly discussed raising the cap to 256 in a future upgrade.' },

      { kind:'h',    text:'CANONICAL SOURCES' },
      { kind:'link', text:'docs.learnbittensor.org/subnets/subnet-deregistration', href:'https://docs.learnbittensor.org/subnets/subnet-deregistration' },
      { kind:'link', text:'taostats.io/subnets  (live dereg list)', href:'https://taostats.io/subnets' },
    ] },

  /* ===================================================================== */
  { id: 'halving', label: '/halving', title: 'Halving · supply schedule',
    blurb: 'First halving fired 14 Dec 2025 · block reward is 0.5 τ · next ~Dec 2029.',
    difficulty: 'easy',
    timeRequired: '10 min',
    cost: 'free (read-only)',
    prerequisites: [
      'Mental model of Bitcoin\'s halving (TAO is shaped the same way)',
    ],
    whatYouGet: 'A precise, sourced picture of where TAO supply is, when the next halving fires, and what changes (and does not change) at each event.',
    confidence: 'high',
    researched: '2026-05-15',
    sources: [
      'https://www.bittensor-halving.com/',
      'https://bittensorhalving.com/',
      'https://crypto.com/us/market-updates/bittensor-halving-all-you-need-to-know',
      'https://research.grayscale.com/reports/bittensor-on-the-eve-of-the-first-halving-research',
    ],
    body: [
      { kind:'h',    text:'THE SCHEDULE' },
      { kind:'note', text:'block reward = 1 TAO at genesis (3 Nov 2023 mainnet)' },
      { kind:'note', text:'halves every 10.5M blocks (≈ 4 years on 12s blocks)' },
      { kind:'note', text:'halving #1 · executed 14 Dec 2025 · block reward → 0.5 TAO' },
      { kind:'note', text:'halving #2 · ~Dec 2029 · block reward → 0.25 TAO' },
      { kind:'note', text:'max supply · 21M TAO (capped, Bitcoin-shaped emission)' },

      { kind:'h',    text:'WHERE WE ARE TODAY (15 May 2026)' },
      { kind:'note', text:'circulating supply ≈ 10.9M TAO · ~52% of cap (CoinMarketCap, taostats)' },
      { kind:'note', text:'current daily emission ≈ 3,600 TAO/day (was 7,200 pre-halving)' },
      { kind:'note', text:'days since first halving ≈ 152' },
      { kind:'note', text:'days to estimated next halving ≈ ~1,310 (target ~Dec 2029, drifts with block production)' },

      { kind:'h',    text:'WHAT HAPPENS AT A HALVING' },
      { kind:'p',    text:'All subnet emissions halve in TAO terms, the chain literally mints half as much per block. Validator dividends and miner rewards both halve in TAO (and in α, since α-emission per subnet is denominated against the global TAO emission). Subnet relative shares are unchanged. α-prices typically reprice in the days after to find a new fee equilibrium.' },

      { kind:'h',    text:'WHAT IT DOES NOT HALVE' },
      { kind:'note', text:'network compute throughput · the work continues' },
      { kind:'note', text:'validator permit thresholds (denominated in α-stake, not TAO)' },
      { kind:'note', text:'demand for the work · only the chain\'s payment for it' },

      { kind:'h',    text:'WHY THIS MATTERS' },
      { kind:'p',    text:'A halving is a 50% supply-side shock with zero corresponding demand-side change. Whether it pushes price up or breaks marginal miners depends on what happens to demand, and on dTAO, demand is per-subnet, not network-wide. Some α-pools strengthen through halvings, others bleed.' },

      { kind:'h',    text:'CANONICAL SOURCES' },
      { kind:'link', text:'bittensor-halving.com  (live tracker)', href:'https://www.bittensor-halving.com/' },
      { kind:'link', text:'Grayscale: Bittensor on the Eve of the First Halving', href:'https://research.grayscale.com/reports/bittensor-on-the-eve-of-the-first-halving-research' },
    ] },

  /* ===================================================================== */
  { id: 'security', label: '/security', title: 'Wallet security',
    blurb: 'Coldkey hygiene · hardware wallets · what to do if a key is compromised.',
    difficulty: 'medium',
    timeRequired: '45 min to set up properly · ongoing discipline',
    cost: 'Ledger Nano X ~$150 · 0.1 TAO if you ever swap a coldkey · 1 TAO if you swap a hotkey',
    prerequisites: [
      'A coldkey + hotkey pair (see /wallet)',
      'A second physical machine for coldkey operations',
      'Ideally: a Ledger or other hardware wallet',
    ],
    whatYouGet: 'A defensible operational setup where the coldkey lives on hardware (or air-gapped paper), the hotkey runs the work, and you have a tested response plan for compromise.',
    confidence: 'high',
    researched: '2026-05-15',
    sources: [
      'https://docs.learnbittensor.org/keys/coldkey-hotkey-security',
      'https://docs.learnbittensor.org/staking-and-delegation/using-ledger-hw-wallet',
      'https://docs.learnbittensor.org/keys/schedule-coldkey-swap/',
      'https://support.ledger.com/article/11228984669085-zd',
    ],
    body: [
      { kind:'h',    text:'THE THREAT MODEL' },
      { kind:'p',    text:'Coldkey leaked → all TAO, α-stake, subnet ownership, and hotkey ownership can be moved. Hotkey leaked → bad weight-setting + responses, but funds are safe. Defend the coldkey at any cost.' },

      { kind:'h',    text:'COLD STORAGE · THE GOLD STANDARD' },
      { kind:'note', text:'Ledger Nano X (Polkadot app) → Talisman / Subwallet / Crucible / Nova → Bittensor network' },
      { kind:'note', text:'coldkey private key never touches an internet-connected machine' },
      { kind:'note', text:'sign every transfer / stake on the device screen' },
      { kind:'p',    text:'What Ledger CAN do: hold the coldkey, sign transfers, sign stake-add / stake-remove. What it CANNOT do (yet): hotkey management, subnet creation, on-chain governance votes, those still need btcli with a software coldkey or a proxy.' },

      { kind:'h',    text:'PROXY WALLETS · THE NEXT-BEST SETUP' },
      { kind:'p',    text:'If you cannot use a hardware wallet for everything, give a proxy wallet narrowly-scoped, time-delayed permissions to act on behalf of your coldkey. The proxy lives on the operational box; the coldkey lives offline.' },

      { kind:'h',    text:'IF YOUR HOTKEY IS COMPROMISED' },
      { kind:'cmd',  text:'btcli wallet swap-hotkey --wallet-name <name> \\\n  --wallet-hotkey <old> --new-hotkey <new>' },
      { kind:'note', text:'1 TAO recycle fee · instant · keeps registration + delegated stakes on the same coldkey' },

      { kind:'h',    text:'IF YOUR COLDKEY IS COMPROMISED' },
      { kind:'p',    text:'Use the Announce-and-Execute coldkey swap (the schedule-based version was retired in Jan 2026). 5-day waiting period, 0.1 TAO fee, source coldkey is locked the moment you announce.' },
      { kind:'cmd',  text:'btcli wallet schedule-coldkey-swap --wallet-name <old> \\\n  --new-coldkey-ss58 5xxx...' },
      { kind:'cmd',  text:'btcli wallet check-coldkey-swap --wallet-name <old>' },
      { kind:'warn', text:'if an attacker also has your coldkey they can race you · the 5-day window is the bottleneck' },
      { kind:'warn', text:'the swap is final · once executed, all TAO + α + subnet ownership + hotkey ownership move to the new coldkey' },

      { kind:'h',    text:'COMMON PHISHING VECTORS' },
      { kind:'note', text:'fake "btcli" packages on PyPI · always pip install bittensor-cli (verify the publisher)' },
      { kind:'note', text:'fake Discord support DMs offering to "fix" your wallet · OF staff never DM first' },
      { kind:'note', text:'malicious subnet repos that import from your local ~/.bittensor on miner.py startup' },
      { kind:'note', text:'browser-extension wallets impersonating Talisman or Crucible · install only from official sites' },
      { kind:'note', text:'Telegram "validator-as-a-service" offers asking for your coldkey mnemonic · this is theft' },

      { kind:'h',    text:'OPERATIONAL HYGIENE' },
      { kind:'note', text:'separate machines for coldkey ops vs miner/validator ops · no exceptions' },
      { kind:'note', text:'never paste a mnemonic into an LLM, a cloud note, a chat, or a clipboard manager' },
      { kind:'note', text:'OS updates current · network services that are not needed disabled · activity logged' },
      { kind:'note', text:'CI/CD secrets via Vault / AWS Secrets Manager / GCP Secret Manager · ephemeral injection only' },
      { kind:'note', text:'a periodic dry-run of your recovery procedure · the time to test backup is not at 3am after a breach' },

      { kind:'h',    text:'CANONICAL SOURCES' },
      { kind:'link', text:'docs.learnbittensor.org/keys/coldkey-hotkey-security', href:'https://docs.learnbittensor.org/keys/coldkey-hotkey-security' },
      { kind:'link', text:'docs.learnbittensor.org/staking-and-delegation/using-ledger-hw-wallet', href:'https://docs.learnbittensor.org/staking-and-delegation/using-ledger-hw-wallet' },
      { kind:'link', text:'docs.learnbittensor.org/keys/schedule-coldkey-swap', href:'https://docs.learnbittensor.org/keys/schedule-coldkey-swap/' },
    ] },

  /* ===================================================================== */
  { id: 'whitepaper', label: '/whitepaper', title: 'The Bittensor whitepaper',
    blurb: 'Rao et al · 2020 · a peer-to-peer market for machine intelligence.',
    difficulty: 'medium',
    timeRequired: '2-3 hours to read carefully',
    cost: 'free (arXiv)',
    prerequisites: [
      'Comfort with weighted-median consensus and basic game theory',
      'Optional: read /dtao first to see how the architecture has evolved',
    ],
    whatYouGet: 'The original thesis behind Bittensor, a peer-to-peer intelligence market with a Byzantine-tolerant scoring algorithm, and the framing the protocol still operates inside.',
    confidence: 'high',
    researched: '2026-05-15',
    sources: [
      'https://arxiv.org/abs/2003.03917',
      'https://bittensor.com/whitepaper',
      'https://github.com/opentensor/subtensor',
    ],
    body: [
      { kind:'h',    text:'THE PAPER' },
      { kind:'p',    text:'"BitTensor: A Peer-to-Peer Intelligence Market", Yuma Rao, Jacob Steeves, Ala Shaabana, Daniel Attevelt, Matthew McAteer. Published on arXiv (2003.03917) in March 2020, revised March 2021. Yuma is the same Yuma the consensus algorithm is named for. The architecture has evolved (subnets, dTAO) but the thesis is unchanged.' },

      { kind:'h',    text:'CORE THESIS' },
      { kind:'p',    text:'AI is centralizing: a few labs with massive compute. The proposal: a token-incentivized market where anyone can run a model, anyone can validate, and the chain rewards whichever model produces the most useful intelligence, measured by peer scoring, not by who owns the inference.' },

      { kind:'h',    text:'KEY CONTRIBUTIONS' },
      { kind:'note', text:'YUMA CONSENSUS · a Byzantine-fault-tolerant scoring algorithm, clip the dissenters, reward the cluster' },
      { kind:'note', text:'STAKE-WEIGHTED SCORING · validator vote scales with delegated stake, so reputation backs voice' },
      { kind:'note', text:'MINER-VALIDATOR INTERPLAY · miners produce, validators score, the chain settles in the network token' },
      { kind:'note', text:'SUBNETS · each subnet defines its own task and scoring rule, like specialized markets (post-paper, but in the spirit)' },
      { kind:'note', text:'TOKENOMICS · Bitcoin-shaped emission · halving · 21M cap' },

      { kind:'h',    text:'THE INTELLIGENCE COMMODITY' },
      { kind:'p',    text:'The radical claim: machine intelligence can be priced like any other commodity if you can score it. Bittensor\'s answer to "how do you score?" is recursive, validators score miners, the network scores validators on their scoring quality. Honesty pays because dishonesty is detectable.' },

      { kind:'h',    text:'V2 · DTAO (live 13 Feb 2025)' },
      { kind:'p',    text:'The dTAO upgrade split monolithic TAO into per-subnet alpha tokens and replaced root-weight voting with bonding-curve markets. Now markets, not validator votes, decide which subnets get emissions. See /dtao for the mechanics.' },

      { kind:'h',    text:'WHERE TO READ' },
      { kind:'link', text:'arxiv.org/abs/2003.03917  (canonical)', href:'https://arxiv.org/abs/2003.03917' },
      { kind:'link', text:'bittensor.com/whitepaper', href:'https://bittensor.com/whitepaper' },
      { kind:'link', text:'github.com/opentensor/subtensor  (the runtime)', href:'https://github.com/opentensor/subtensor' },
      { kind:'note', text:'the chain logic lives in pallets/subtensor, the canonical source for what the chain actually does' },
    ] },

  /* ===================================================================== */
  { id: 'roadmap', label: '/roadmap', title: 'Network updates · 2026',
    blurb: 'What the chain and the subnets have actually shipped this year.',
    difficulty: 'easy',
    timeRequired: '15 min',
    cost: 'free (read-only)',
    prerequisites: [
      'Read /dtao and /dereg first for context on what these upgrades are touching',
    ],
    whatYouGet: 'A sourced snapshot of the actually-shipped 2026 protocol changes and ecosystem milestones, not speculation, not internal politics.',
    confidence: 'medium',
    researched: '2026-05-15',
    sources: [
      'https://docs.learnbittensor.org/learn/announcements',
      'https://coinmarketcap.com/cmc-ai/bittensor/latest-updates/',
      'https://taonsquare.com/',
      'https://x.com/opentensor',
    ],
    body: [
      { kind:'h',    text:'HONESTY NOTE' },
      { kind:'p',    text:'Opentensor Foundation does not publish a monolithic dated public roadmap. The list below is what has actually shipped or been formally announced through the OF docs, OF Twitter, and credible third-party reporting. Items not on this list are speculation until OF says otherwise.' },

      { kind:'h',    text:'JAN 2026 · COLDKEY SWAP REWORK · SHIPPED' },
      { kind:'p',    text:'The coldkey-swap workflow moved from a schedule-based system to "Announce-and-Execute" with a mandatory 36,000-block (~5-day) delay. The source coldkey is locked the moment you announce. See /security for the operational impact.' },
      { kind:'note', text:'source · docs.learnbittensor.org/learn/announcements' },

      { kind:'h',    text:'FEB 2026 · SUBNET STAKE BURN · SHIPPED' },
      { kind:'p',    text:'Subnet owners can permanently remove α from circulation by combining stake and burn through the `add_stake_burn` extrinsic. A new lever for owners to defend their α-price ahead of dereg sweeps.' },
      { kind:'note', text:'source · docs.learnbittensor.org/learn/announcements' },

      { kind:'h',    text:'FEB 2026 · MAX SUBNET MECHANISMS · SHIPPED' },
      { kind:'p',    text:'A 256-UID hard cap is enforced across all mechanisms within a subnet. Owners running multi-mechanism subnets must trim UIDs before adding new mechanisms.' },
      { kind:'note', text:'source · docs.learnbittensor.org/learn/announcements' },

      { kind:'h',    text:'APR 2026 · NEURON REGISTRATION REWORK · SHIPPED' },
      { kind:'p',    text:'Non-root neuron (UID) registration moved to a continuous TAO-burn model, replacing the old adjustment-interval mechanics and registration rate limits. Smoother price action on busy subnets.' },
      { kind:'note', text:'source · docs.learnbittensor.org/learn/announcements' },

      { kind:'h',    text:'MAY 2026 · TAONSQUARE · LIVE (8 May)' },
      { kind:'p',    text:'OF launched TaonSquare, a directory aggregating AI tools and apps built on Bittensor subnets. End-user surface for what the network actually outputs, with capability and pricing detail.' },
      { kind:'note', text:'source · taonsquare.com · KuCoin / OF announcements' },

      { kind:'h',    text:'MAY 2026 · GRAYSCALE GTAO REOPENS · 9 MAY' },
      { kind:'p',    text:'Grayscale reopened private placements for the Grayscale Bittensor Trust (GTAO) for accredited investors. Coincides with TAO bridging to Solana via Wormhole.' },
      { kind:'note', text:'source · Grayscale press · third-party reporting' },

      { kind:'h',    text:'COMMUNITY DISCUSSION · 128 → 256 SUBNET CAP' },
      { kind:'p',    text:'Raising the network subnet cap from 128 to 256 is an active community discussion theme in the OF/community 2026 vision but has NOT been formally scheduled to mainnet as of 15 May 2026. Treat as direction, not commitment.' },
      { kind:'note', text:'source · community / abittensorjourney / commentary, not OF runtime announcement' },
      { kind:'warn', text:'this item is reportedly under discussion · do not bet capital on a date' },

      { kind:'h',    text:'IF YOU WANT THE SOURCE FEED' },
      { kind:'link', text:'docs.learnbittensor.org/learn/announcements', href:'https://docs.learnbittensor.org/learn/announcements' },
      { kind:'link', text:'x.com/opentensor', href:'https://x.com/opentensor' },
      { kind:'link', text:'github.com/opentensor/subtensor/releases', href:'https://github.com/opentensor/subtensor/releases' },
      { kind:'link', text:'taonsquare.com', href:'https://taonsquare.com/' },
    ] },

  /* ===================================================================== */
  { id: 'play', label: '/play', title: 'TAO Runner · play the chain',
    difficulty: 'easy', timeRequired: '60 s', cost: 'free', confidence: 'high',
    researched: '2026-05-15',
    blurb: 'A real game. You\'re a miner running across the chain. Tap to jump, catch α tokens, dodge the deregistration sweeps. Speed ramps with every block. First arcade game built for Bittensor, anywhere.',
    body: [
      /* Rendered as an interactive canvas widget by Console.js, body
         is a placeholder; the renderer dispatches on topic.id === 'play'. */
    ],
    prerequisites: ['thumb'],
    whatYouGet: 'A reflex-game intuition for what a miner actually does, collect rewards, survive churn, push through halvings. Your high score persists locally.',
    sources: [],
  },

  /* ===================================================================== */
  { id: 'links', label: '/links', title: 'Every link · the full stack',
    difficulty: 'easy', timeRequired: 'browse',  cost: 'free', confidence: 'high',
    researched: '2026-05-15',
    blurb: 'Every URL you need to actually do this. Docs, source, governance, wallets, exchanges, the dashboards, and the people. All current as of May 2026.',
    body: [
      { kind:'h',    text:'OFFICIAL · OPENTENSOR' },
      { kind:'link', text:'bittensor.com  ·  the network', href:'https://bittensor.com' },
      { kind:'link', text:'docs.bittensor.com  ·  protocol docs', href:'https://docs.bittensor.com' },
      { kind:'link', text:'docs.learnbittensor.org  ·  hands-on tutorials', href:'https://docs.learnbittensor.org' },
      { kind:'link', text:'opentensor.ai  ·  the foundation', href:'https://opentensor.ai' },
      { kind:'link', text:'x.com/opentensor  ·  official feed', href:'https://x.com/opentensor' },
      { kind:'link', text:'discord.gg/bittensor  ·  community', href:'https://discord.gg/bittensor' },

      { kind:'h',    text:'CODE · THE SOURCE' },
      { kind:'link', text:'github.com/opentensor/bittensor  ·  SDK', href:'https://github.com/opentensor/bittensor' },
      { kind:'link', text:'github.com/opentensor/btcli  ·  CLI', href:'https://github.com/opentensor/btcli' },
      { kind:'link', text:'github.com/opentensor/subtensor  ·  chain', href:'https://github.com/opentensor/subtensor' },
      { kind:'link', text:'github.com/opentensor/bittensor-subnet-template  ·  start a subnet', href:'https://github.com/opentensor/bittensor-subnet-template' },

      { kind:'h',    text:'DATA · WHERE THE NUMBERS LIVE' },
      { kind:'link', text:'taostats.io  ·  full chain explorer + analytics', href:'https://taostats.io' },
      { kind:'link', text:'taomarketcap.com  ·  α-market caps + price', href:'https://taomarketcap.com' },
      { kind:'link', text:'tao.app  ·  live trade interface', href:'https://tao.app' },
      { kind:'link', text:'taonsquare.com  ·  MCP-readable subnet catalog', href:'https://taonsquare.com/' },
      { kind:'link', text:'subnets.io  ·  community directory', href:'https://subnets.io' },

      { kind:'h',    text:'GOVERNANCE · WHAT\'S BEING DECIDED' },
      { kind:'link', text:'docs.learnbittensor.org/learn/announcements', href:'https://docs.learnbittensor.org/learn/announcements' },
      { kind:'link', text:'github.com/opentensor/subtensor/releases', href:'https://github.com/opentensor/subtensor/releases' },

      { kind:'h',    text:'EXCHANGES · BUY TAO' },
      { kind:'link', text:'Coinbase', href:'https://coinbase.com/price/bittensor' },
      { kind:'link', text:'Kraken', href:'https://kraken.com/learn/what-is-bittensor-tao' },
      { kind:'link', text:'MEXC', href:'https://mexc.com/exchange/TAO_USDT' },
      { kind:'link', text:'KuCoin', href:'https://kucoin.com/trade/TAO-USDT' },
      { kind:'link', text:'Binance', href:'https://binance.com/en/trade/TAO_USDT' },

      { kind:'h',    text:'WALLETS · KEYS + SIGNING' },
      { kind:'link', text:'docs.learnbittensor.org/keys', href:'https://docs.learnbittensor.org/keys' },
      { kind:'link', text:'polkadot.js extension  ·  browser wallet for Substrate', href:'https://polkadot.js.org/extension/' },
      { kind:'link', text:'Ledger  ·  hardware wallet', href:'https://ledger.com' },

      { kind:'h',    text:'TOP OPERATORS · THEIR HOMES' },
      { kind:'link', text:'rayonlabs.ai  ·  Chutes, Gradients, Nineteen', href:'https://rayonlabs.ai' },
      { kind:'link', text:'macrocosmos.ai  ·  Apex, IOTA, Data Universe, Mainframe', href:'https://macrocosmos.ai' },
      { kind:'link', text:'manifold.inc  ·  Targon', href:'https://manifold.inc' },
      { kind:'link', text:'taoshi.io  ·  Vanta (PTN)', href:'https://taoshi.io' },
      { kind:'link', text:'nousresearch.com  ·  Numinous', href:'https://nousresearch.com' },
      { kind:'link', text:'datura.ai  ·  Lium', href:'https://datura.ai' },
      { kind:'link', text:'corcel.io  ·  Zeus (Cortex.t)', href:'https://corcel.io' },
      { kind:'link', text:'tplr.ai  ·  Templar', href:'https://tplr.ai' },
      { kind:'link', text:'hippius.com', href:'https://hippius.com' },

      { kind:'h',    text:'INSTITUTIONAL · CAPITAL' },
      { kind:'link', text:'foundrydigital.com  ·  Foundry Digital', href:'https://foundrydigital.com' },
      { kind:'link', text:'yumaai.com  ·  Yuma (DCG-affiliated)', href:'https://yumaai.com' },
      { kind:'link', text:'polychain.capital', href:'https://polychain.capital' },
      { kind:'link', text:'dcg.co  ·  Digital Currency Group', href:'https://dcg.co' },
      { kind:'link', text:'osscapital.com  ·  Joseph Jacks / OSS', href:'https://osscapital.com' },

      { kind:'h',    text:'EDITORIAL · WHO WRITES ABOUT THIS' },
      { kind:'link', text:'x.com/subnetmagazine  ·  this magazine', href:'https://x.com/subnetmagazine' },
      { kind:'link', text:'oakresearch.io  ·  long-form research', href:'https://oakresearch.io' },
      { kind:'link', text:'messari.io/research  ·  institutional reports', href:'https://messari.io/research' },
    ],
    prerequisites: [],
    whatYouGet: 'A single page with every authoritative URL you need to set up, mine, validate, trade, and follow Bittensor, keyed to May 2026, no dead links.',
    sources: [],
  },

]);
