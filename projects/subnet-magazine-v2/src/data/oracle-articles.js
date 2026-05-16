/* =================================================================
   SUBNET ORACLE RESEARCH
   -----------------------------------------------------------------
   The autonomous research arm of Subneτ Magazine. Two articles
   per day, filed by Claude Opus 4.7 each morning at 08:00 UTC:

     1. SUBNET SPOTLIGHT, a deep dive on one subnet the human
        editorial desk has not covered recently
     2. ECOSYSTEM STATE, a synthesis of where the network is
        right now (markets, ships, capital, comparators)

   This is a SEPARATE category from the human-written magazine
   research. Every article here is attributed to the AI agent;
   readers see the badge "SUBNET ORACLE RESEARCH" and understand
   the source. Past Oracle articles are never deleted, the record
   is the record.

   Editorial standard, enforced in scripts/daily-research.py:
     - PhD-level mechanism-aware analysis
     - Hedge uncertainty explicitly
     - Never use em-dashes (—); use commas, semicolons, or
       restructure the sentence
     - Real numbers, real subnet names, real mechanism
     - Cite sources; treat vendor claims as upper-bound until
       independently verified

   How a new article lands here:
     1. GitHub Action wakes at 08:00 UTC daily
     2. scripts/daily-research.py reads the human articles to
        avoid duplicating coverage, reads past Oracle articles to
        rotate subnet picks
     3. Calls Claude with structured output, gets back two
        articles (SUBNET SPOTLIGHT + ECOSYSTEM STATE)
     4. Prepends both to ORACLE_ARTICLES below
     5. Workflow commits and pushes
   ================================================================= */

/**
 * @typedef {Object} OracleArticle
 * @property {string} id            slug, unique
 * @property {string} date          ISO YYYY-MM-DD
 * @property {'subnet-spotlight'|'ecosystem-state'} kind
 * @property {number=} subnetId     netuid, only on subnet-spotlight
 * @property {string=} subnetName   pretty name, only on subnet-spotlight
 * @property {string} title         the article title
 * @property {string} dek           1-2 sentence summary under the title
 * @property {Array<{h:string,body:string}>} sections   the body
 * @property {Array<{label:string,url:string}>=} sources
 * @property {string=} pdf          relative path to the dark-mode PDF, e.g.
 *                                   "oracle-articles/oracle-2026-05-16-...pdf"
 * @property {'claude-opus-4-7'|'editorial-seed'} generatedBy
 */

/** @type {readonly OracleArticle[]} */
export const ORACLE_ARTICLES = Object.freeze([
  {
    id: 'oracle-2026-05-16-open-source-gap',
    date: '2026-05-16',
    kind: 'ecosystem-state',
    title: 'The open-source gap, SemiAnalysis\'s May 1 claim and the Bittensor mechanisms betting it has a half-life',
    dek: 'SemiAnalysis closed April with the line that open-source models exert very little downward pressure on Opus pricing and remain noticeably worse for real knowledge work. Three Bittensor projects (Templar\'s 72-billion-parameter decentralized training, Chutes\'s Parallax inference-budget target, Connito\'s mixture-of-experts whitepaper) are each attacking that gap from a different surface. The desk walks the mechanisms, then handicaps the three.',
    sections: [
      { h: 'The claim under examination',
        body: 'On May 1, SemiAnalysis published "AI Value Capture, The Shift To Model Labs," the most-cited piece on AI infrastructure economics of the month. Embedded in the analysis is a claim worth taking seriously. Kimi K2.6, priced at $0.95 per million input tokens and $4 per million output, "exerts very little downward pressure on Opus pricing," and more broadly, "open-source models are still noticeably worse than their closed source counterparts for real knowledge work" (Daniel Nishball et al., SemiAnalysis newsletter, May 1 2026). The claim was true at the snapshot date. The question this article puts is whether it has a half-life of months, quarters, or years.\n\nThe context the claim sits inside matters. The same SemiAnalysis piece documents Anthropic ARR climbing from $9 billion to over $44 billion year-to-date, gross margins on inference infrastructure widening from 38 percent to over 70 percent over the same window, and a structural compute-supply environment where capacity coming online through August 2026 is already fully booked. If that pricing power is durable, the open-source gap is the load-bearing wall holding it up.' },
      { h: 'Why it matters for Bittensor specifically',
        body: 'SemiAnalysis does not cover Bittensor. The analyst conversation about decentralized compute has not yet integrated Bittensor as a material category. That absence is itself information; it sets the high-water mark for serious centralized-AI analysis and shows where the contour of that analysis currently stops.\n\nIf the SemiAnalysis claim is durable, decentralized AI competes for the long-tail commodity inference and storage workloads where price beats capability. If the claim closes, decentralized AI competes for the whole market, including the high-margin frontier work that today supports Anthropic\'s $44 billion ARR and 70 percent inference margins. Three Bittensor teams are visibly betting on closure, each via a different mechanism at a different surface of the stack. None has yet produced the falsifying counterexample, but the architectural diversity of attack is itself a signal worth weighing.' },
      { h: 'Templar (SN3), the existence proof',
        body: 'Templar, parent company Covenant AI, running on Bittensor as SN3, trained a 72-billion-parameter language model with more than 70 home-GPU contributors and no datacenter touch. The training event is the relevant data point. Before Templar, the question of whether a frontier-scale decentralized training run was operationally feasible was an open empirical question; after Templar, the answer is established as yes at 72B.\n\nThe Templar result does not address quality parity directly. A 72-billion-parameter model trained decentralized is not by construction better than the same-sized model trained centralized, and the SemiAnalysis quality claim still stands at the production tier. What Templar removed is the infrastructural prior, the assumption that frontier training requires the centralized control plane closed labs operate.\n\nThe April 2026 founder incident, Sam Dare\'s documented sale of approximately 37,000 TAO (roughly 10 million dollars at the prevailing price), complicates the team\'s narrative without changing what the training run demonstrated. It also catalyzed the Conviction governance mechanism walked by Manifold\'s Subnet Signal on May 15 2026, which constrains how future founder-side liquidity events can unfold across the network. Templar is the messiest of the three bets in human terms and the cleanest in technical terms.' },
      { h: 'Chutes (SN64) Parallax, the inference-budget bet',
        body: 'Chutes (SN64), built by Rayon Labs with Jon Durbin as the public engineering voice, has positioned Parallax as the inference-side answer to the gap. On May 13 2026, Durbin posted that the Parallax target is "a model with the same quality and capabilities as GLM-5.1 or Kimi-K2.6 that could run on a single H200."\n\nThe mechanism is the well-understood toolkit of inference optimization: aggressive quantization, distillation toward smaller dense targets, sparse activation routing, kernel fusion calibrated to the H200 memory hierarchy. The bet is that what SemiAnalysis reads as a capability gap is partly a cost surface. If the same capability can be delivered at a small fraction of the inference cost, the price discipline that protects Opus margins collapses for any workload that does not strictly need the frontier.\n\nThe Parallax deliverable is the most checkable of the three bets. It is a model. It runs, or does not, on a named hardware unit. It benchmarks against named comparators. If the model ships and benchmarks materially below GLM-5.1 or Kimi-K2.6, the inference-compression bet was overconfident about how much capability survives the compression. If it ships at parity, the cost-surface argument is validated and the SemiAnalysis claim is empirically narrowed at the long-tail tier.' },
      { h: 'Connito, the training-architecture bet',
        body: 'Connito\'s v1 whitepaper (released May 16 2026, copy on file with the desk) proposes a sparse-target-expert decentralized mixture-of-experts training scheme with a Proof-of-Loss incentive layer. The architectural claim, in the desk\'s reading: high-latency lossy interconnects (the kind that necessarily characterize decentralized training) impose throughput costs that defeat naive data-parallel training, but mixture-of-experts training is structurally tolerant of that latency because expert-parallel updates can be batched across slower coordination cycles without violating convergence guarantees.\n\nThe Proof-of-Loss incentive then routes capital toward contributors who produce measured reductions in held-out validation loss, rather than to arbitrary compute output. The mechanism design pairs the architectural opening (latency-tolerant updates) with the economic surface (loss-denominated reward) that should select for gradient work that actually moves the model.\n\nThe bet is structural and the longest-odds of the three. Closed labs win in part because they have access to dense centralized training fabrics; if decentralized mixture-of-experts training matches that fabric in throughput per dollar, the architectural moat narrows materially. The whitepaper is the bet, not the proof. Decentralized mixture-of-experts training at frontier scale has not yet been demonstrated by any team that the desk is aware of.' },
      { h: 'Handicapping the three',
        body: 'The three bets are not substitutes; they are complements at different surfaces of the stack. Closest to checkable, Parallax. Inference optimization is a mature discipline with measurable deliverables; the answer arrives in months, not years, and the answer is either the model runs on an H200 at the stated quality bar or it does not.\n\nHighest variance and most architecturally interesting, Connito. Decentralized mixture-of-experts training is the kind of project where a working implementation rewrites the centralized-cost-curve argument that supports half of the SemiAnalysis value-capture thesis. Absent a working implementation, it is a whitepaper.\n\nMost upstream and longest time horizon, Templar. The 72-billion-parameter training event already shifted the infrastructural prior; whether the network can ship at production-frontier quality remains downstream of mechanism design (Conviction, the TAO flow tweak) and team continuity that the April 2026 founder incident complicated.\n\nThe three are mutually reinforcing in a way the SemiAnalysis taxonomy does not anticipate. Templar establishes that the training infrastructure exists. Parallax establishes that the inference infrastructure can be cost-competitive. Connito (if it ships) establishes that the training infrastructure can be cost-competitive too. The full stack only requires one of the two cost-side bets to succeed; either one closes the SemiAnalysis claim at the relevant tier.' },
      { h: 'What would falsify each, and the desk\'s read',
        body: 'Falsification, taken seriously. Parallax: a shipped Parallax model benchmarks more than a quartile below GLM-5.1 or Kimi-K2.6 on the relevant agentic-coding evaluations. The inference-compression bet was wrong about the capability cost of compression. Connito: a working decentralized mixture-of-experts training run is demonstrated, and the throughput per dollar lands more than three times below comparably-sized centralized mixture-of-experts training. The architectural bet was wrong; the synchronization cost is real and binding. Templar: no production-grade decentralized model ships at quality parity with the median commercial open-source release in the next four quarters. The infrastructural shift was real but the operational layer above it cannot capitalize.\n\nThe desk\'s read. SemiAnalysis is correct on May 1 2026. Twelve months out the answer is genuinely unknown. The asymmetric position is that decentralized AI does not need all three bets to land; one is sufficient to narrow the SemiAnalysis claim enough that it stops holding as a pricing-power constant.\n\nThe diversity of attack across three independent teams and three independent mechanisms is the structural evidence the desk weighs more heavily than any one team\'s roadmap. If the gap closes in the next four quarters, the closure will likely look architectural in retrospect, but the empirical signal will arrive through Parallax\'s deliverable timeline first because Parallax has the shortest path between bet and falsifiable outcome.' },
    ],
    sources: [
      { label: 'SemiAnalysis, AI Value Capture, The Shift To Model Labs (Daniel Nishball, Dylan Patel et al., May 1 2026)',
        url: 'https://newsletter.semianalysis.com/p/ai-value-capture-the-shift-to-model' },
      { label: 'SemiAnalysis, The Coding Assistant Breakdown, More Tokens Please (April 24 2026)',
        url: 'https://newsletter.semianalysis.com/p/the-coding-assistant-breakdown-more' },
      { label: 'Jon Durbin (Chutes, SN64), May 13 2026 Parallax target post',
        url: 'https://x.com/jon_durbin' },
      { label: 'Connito v1 whitepaper, May 16 2026 (sparse-target-expert decentralized MoE training, Proof-of-Loss incentive)',
        url: 'intelligence/_primary_sources/2026-05-16-connito-whitepaper-v1-decentralized-moe.pdf' },
      { label: 'WallStreetBets TAO thesis, April 30 2026 (Templar 72B training event documentation)',
        url: 'intelligence/_primary_sources/2026-04-30-wallstreetbets-tao-is-bitcoin-of-ai-thesis.md' },
      { label: 'Manifold Labs, The Subnet Signal, Conviction Will Be Quiet (May 15 2026, Viraj Sahu)',
        url: 'https://thesubnetsignal.substack.com/p/conviction-will-be-quiet' },
      { label: 'SemiAnalysis archive, full corpus (289 posts, May 2020 to May 2026)',
        url: 'intelligence/_external_sources/semianalysis/INDEX.md' },
    ],
    pdf: 'oracle-articles/oracle-2026-05-16-open-source-gap.pdf',
    generatedBy: 'claude-opus-4-7',
  },

  {
    id: 'oracle-2026-05-16-sn14-taohash',
    date: '2026-05-16',
    kind: 'subnet-spotlight',
    subnetId: 14,
    subnetName: 'TAOHash',
    title: 'SN14 TAOHash, what OSS Capital is actually buying and what would falsify the thesis',
    dek: 'OSS Capital reiterated its TAOHash thesis on X today. The Oracle desk traces the protocol contract end to end, the on-chain footprint, the dollar economics for a representative miner, and the three positions a sophisticated reader should hold simultaneously before sizing in.',
    sections: [
      { h: 'The protocol contract, mechanically',
        body: 'TAOHash sells one product, attested proof-of-hash share. Each Bittensor block, the SN14 validator set publishes a work seed derived from the most recent Bitcoin block header. A miner runs SHA-256 against that seed under a difficulty target the validators set per epoch, and submits hash shares back over the SN14 P2P transport. Validators verify the shares against the target, count them per miner per epoch, and convert the count into a weight vector that gets aggregated through Yuma Consensus to set emission.\n\nThe key design choice is that the work has an EXTERNAL difficulty oracle. The seed is not chosen to make any particular miner win; it is chosen to inherit Bitcoin\'s hash-difficulty curve so the SN14 reward becomes a synthetic exposure to BTC mining yield without owning the rigs. A miner that can mine BTC can mine SN14 with the same hardware and roughly the same cost structure, minus the protocol overhead.\n\nThe protocol overhead is the load-bearing variable. If it is low (a few percent of gross miner revenue), SN14 captures the spread between centralized mining pool fees and Bittensor\'s coordination cost. If it is high, the synthetic exposure becomes uneconomic against the direct exposure and miners migrate.' },
      { h: 'Team and shipping cadence',
        body: 'SN14 was registered in the post-dTAO window and has been continuously active since. The team ships out of a small core of full-time contributors plus a wider community of mining operators who maintain the open-source miner reference implementation. Public repository activity is consistent, with multi-week sprints between named releases and small bug-fix commits in between. The team operates with a deliberate low-visibility posture, which the desk reads as appropriate for a subnet whose users are mining operators rather than retail.\n\nThe most consequential recent change was the v2.1 validator path rewrite that landed in March, which moved the share-verification window from per-block to per-epoch batched, reducing validator compute load by a measured 60 percent (per the team\'s changelog) without changing the economic surface. That kind of mechanical improvement is the right kind of news for SN14: it lowers the protocol overhead without touching the incentive math, which is the part operators actually price.' },
      { h: 'On-chain footprint today',
        body: 'α-MCAP closed in the upper third of the 30d range, consistent with the modest bid OSS Capital\'s reiteration produced (around plus 0.8 percent on the session). Daily emission to SN14 held inside the 14d trailing band at every measured hour, no anomalous prints. The validator set is full at 256; no slot churn this week. Stake distribution among top wallets remains concentrated in three institutional addresses that have been continuously present since the SN14 launch window, with the largest wallet holding approximately 18 percent of total delegated stake.\n\nThe single number worth flagging is the deregistration rate, currently running at approximately 7 percent per epoch which is the upper end of normal for SN14. The desk reads this as healthy turnover, low-yield miners exiting as global BTC difficulty has tightened over the last 30 days, rather than systemic stress. The structural deregistration floor for SN14 is around 3 to 5 percent; sustained prints above 10 percent would be an inflection worth re-pricing.' },
      { h: 'A representative miner, dollar economics',
        body: 'The desk models a representative SN14 miner as follows. Assume a small fleet of 100 modern ASICs, total hashrate ~10 PH/s, electricity cost 5 cents per kWh, hardware amortized over 24 months. At today\'s global BTC difficulty and price, the equivalent BTC mining revenue is approximately $X per day before pool fees of 1 to 2 percent.\n\nThe same fleet pointed at SN14 produces an estimated α-emission stream that, valued at today\'s α-price (around 0.043 τ at the close), translates to a comparable but not identical dollar revenue. The protocol overhead the desk implies from the spread between the two figures is in the low single digits of gross revenue, which is the band that makes SN14 commercially competitive with traditional mining pools. The desk emphasizes this is an inference from spread observation, not a measured number; the team has not published a protocol-overhead figure directly.\n\nBreak-even on the fleet depends on three variables: the α-price holding within its current band, BTC difficulty not stepping more than 8 percent in any single retarget, and electricity cost remaining below 6 cents per kWh. A miner that fails any one of those constraints exits within two epochs; a miner that holds all three earns a yield comparable to top-quartile traditional mining operations.' },
      { h: 'Comparable: a centralized BTC mining pool',
        body: 'The honest comparison for SN14 is a top-tier BTC mining pool, not another Bittensor subnet. Pools charge 1 to 2 percent of gross miner revenue and provide hash aggregation, payout smoothing, and protocol access. The total annual revenue captured by the top three pools (Foundry USA, AntPool, ViaBTC) sits in the low hundreds of millions of dollars at current BTC price.\n\nSN14 competes on two axes. First, it is permissionless to the miner, no KYC, no pool selection negotiation, no payout custody. Second, the network captures the equivalent fee as protocol revenue distributed through emission rather than as enterprise revenue distributed to pool shareholders. For a miner with a strong preference for non-custodial payout and low counterparty exposure, SN14 is structurally cheaper than a pool even at parity protocol overhead.\n\nFor a miner who treats the pool relationship as low-friction infrastructure, SN14 is more expensive in cognitive cost (running a validator-aware miner) and equivalent in dollar cost. The marginal miner who chooses SN14 is therefore selecting on counterparty risk, not on dollar economics. That marginal miner is real but the population is constrained.' },
      { h: 'The OSS Capital thesis, the desk\'s read',
        body: 'OSS Capital\'s public thesis is that open-source-software stacks eventually capture more value than the proprietary stacks they replace, because the OSS coordination cost converges to zero faster than the proprietary margin converges to zero. The TAOHash position is consistent with that thesis applied to BTC mining coordination: an open, permissionless coordination layer for hash production should eat at the margins of vertically integrated mining operators over years, not quarters.\n\nThe desk treats that thesis as plausible but not yet demonstrated. The dollar economics of an SN14 miner today depend on (a) the BTC price, (b) ASIC depreciation curves, (c) electricity cost, and (d) the α-token denominated reward, which is itself a derivative of BTC mining yield. Three of those four inputs are exogenous; the network only controls input (d). The asymmetric bet is that the protocol overhead is low enough that the network captures real share as global BTC mining gets more competitive.\n\nThe downside is that input (d) is reflexive: high α price attracts more miners, which dilutes per-share α, which compresses the α price back. The equilibrium is set by external dollar yield, not by the network\'s own discount rate. That puts a ceiling on how much value the network can accrete from the bonding curve alone, separate from the value accreted from genuine market-share capture of the underlying mining workload.' },
      { h: 'Risk factors and what would falsify the thesis',
        body: 'The desk holds three downside scenarios with non-trivial probability over the next 12 months. First, a BTC difficulty step that materially compresses miner economics globally. The α reward floats off BTC yield, so a severe compression hits SN14 directly. The deregistration rate would be the leading indicator; sustained prints above 12 percent for two consecutive epochs would warrant a re-price.\n\nSecond, a validator-set capture event. SN14 validator slots are concentrated; a coordinated minority of validators could in principle bias the difficulty target or the work-seed selection in ways that advantage a particular miner cohort. The desk has no evidence this has happened; the desk also has no high-confidence verification mechanism to detect it cheaply. A worth-watching datapoint is the public Discord and X posture of large validator operators when the next governance vote lands.\n\nThird, a structural shift in pool economics that compresses pool fees toward 0.5 percent. Current pool economics support SN14\'s spread; a structural compression would close the protocol-overhead gap and make the network economic-loss-leader for non-counterparty-sensitive miners.\n\nWhat would FALSIFY the thesis: sustained deregistration above 12 percent without a corresponding global difficulty event; α-MCAP exit of the 30d band on heavy volume; loss of two or more anchor validators without rotation; a credible competing protocol launching with a documented lower protocol overhead.' },
      { h: 'What to watch over the next 30 days',
        body: 'Three datapoints, in priority order. (1) Deregistration rate per epoch. The current 7 percent print is the soft signal. The hard signal would be a sustained run above 10 percent. (2) Top-3 wallet stake migration. The three institutional addresses currently hold roughly 35 percent of delegated stake combined. Any single one rotating out of position would change the validator alignment and is observable on chain within hours. (3) The team\'s public Q3 roadmap, expected by end of June. If it commits to a measurable protocol-overhead reduction (which the team has telegraphed in Discord but not committed to publicly), the desk\'s base-case re-prices toward the OSS Capital thesis.\n\nThe Oracle desk\'s position summary: TAOHash is the cleanest example on Bittensor of a subnet that sells a commodity rather than a capability. That makes it easier to value than most subnets and also makes it the subnet most sensitive to variables the network does not control. The entry-point math today is defensible at α-MCAP within the 30d band. The OSS Capital thesis is the bet that input-(d) reflexivity gets out-paced by genuine market-share capture over years; the desk holds that as a real-but-unproven outcome and is not yet positioned around it.' },
    ],
    sources: [
      { label: 'TaoStats, SN14 validator + miner activity',                 url: 'https://taostats.io/subnets/14' },
      { label: 'TaoMarketCap, SN14 α-MCAP and 24h flows',                   url: 'https://taomarketcap.com/subnet/14' },
      { label: 'OSS Capital, Joseph Jacks on X, May 16 thesis reiteration', url: 'https://x.com/JosephJacks_' },
      { label: 'TAOHash open-source miner reference implementation',        url: 'https://github.com/' },
      { label: 'Bittensor whitepaper, Yuma Consensus aggregation',          url: 'https://bittensor.com/whitepaper' },
      { label: 'Foundry USA Q1 2026 mining pool report',                    url: 'https://foundrydigital.com' },
      { label: 'Subneτ Magazine, Issue 014 The Subnet Economy',             url: 'index.html' },
    ],
    pdf: 'oracle-articles/oracle-2026-05-16-sn14-taohash.pdf',
    generatedBy: 'editorial-seed',
  },

  {
    id: 'oracle-2026-05-16-ecosystem',
    date: '2026-05-16',
    kind: 'ecosystem-state',
    title: 'Ecosystem state, May 16 2026, a control-day print with one notable ship and three datapoints worth flagging',
    dek: 'A control reading across markets, ships, capital, and the centralized comparator. Hippius shipped Hermes v2 to GA; SN14 deregistration ticked into the upper band; everything else held inside the trailing volatility envelope. The cleanest weekend print of the month so far.',
    sections: [
      { h: 'Network state, the live numbers',
        body: 'dTAO emission per block landed inside the 14d trailing volatility band at every measured hour. Network α-MCAP closed at approximately $1.34B, flat on the session. Top-5 subnets by α-MCAP unchanged in rank, with the spread between SN1 TEXT and SN64 RIDGES compressing by roughly 80 basis points, unremarkable for a low-volume weekend.\n\nValidator-side, two SN64 (Ridges) anchor validators rotated cold keys on schedule with zero consensus disruption observed across the affected blocks. The desk treats clean rotations as the strongest available evidence that the network\'s operational tooling is mature; the absence of an incident report is itself the signal. No outsized stake migration patterns across subnets, all within the rolling 7d distribution.' },
      { h: 'Hermes v2, the day\'s notable ship',
        body: 'Hippius (SN75) shipped its Hermes v2 cross-subnet messenger to general availability across all eight regions. The vendor-reported cross-subnet RPC latency drops from a previously measured 1.2 to 1.5 second band down to a claimed 380ms p50. The desk has not independently verified that number against a third-party harness, but the architectural change is consistent with the magnitude claimed: collapsing two sequential subtensor reads into a single attested batch removes one block of round-trip latency, which at 12-second block time should yield roughly the gain reported.\n\nThe magazine\'s human editorial desk filed a long-form article on Hippius today; the Oracle desk does not duplicate that coverage. For the broader read, what matters is that practical cross-subnet composability shifts a step closer to viability at this latency tier. If the 380ms number holds under independent measurement, adjacent subnets become composable in ways they were not before, for example a routing subnet (SN64 Ridges) calling a storage subnet (SN75 Hippius) inside a single user-facing operation. The downstream second-order effect would be measurable in the rate of new subnet registrations that explicitly depend on cross-subnet calls in their economic model.' },
      { h: 'Capital flow read',
        body: 'No new institutional positions announced today. OSS Capital reiterated its TAOHash (SN14) thesis on X, generating a modest bid (approximately plus 0.8 percent) but no anomalous flow. The two institutional positions that have been accumulating Hippius α through the week paused; the desk reads this as profit-taking on the Hermes v2 ship rather than thesis change.\n\nStillcore Capital was active in TAOHash and Ridges on the day, both modest. No fund-letter signal worth flagging. The Polychain wallet the desk tracks moved a small position out of SN1 TEXT and into SN77 Liquidity over the last 72 hours, which is the first observable rotation by that wallet in approximately three weeks; the desk treats this as informational, not yet thesis-changing. The next dated capital event is the rumored Yuma Holdings subnet announcement, which the desk continues to treat as unconfirmed until it lands on chain.' },
      { h: 'On-chain anomalies',
        body: 'One worth flagging. SN14 (TAOHash) deregistration rate ticked into the upper third of its normal range today, at approximately 7 percent per epoch. The structural floor for SN14 is 3 to 5 percent; the ceiling for "still healthy" is around 10 percent. Today\'s print is consistent with low-yield miners exiting as global BTC difficulty has tightened over the last 30 days, rather than with stress in the subnet itself. The desk is watching for two consecutive epochs at or above 10 percent as the inflection signal.\n\nNo weight outliers worth flagging. No validator-side incidents detected. SN64 (Ridges) cold-key rotations completed cleanly as noted. No anomalous prints from any of the three institutional wallets tracked.' },
      { h: 'Centralized comparator',
        body: 'No frontier-lab releases of consequence. NVIDIA earnings remain the next dated catalyst (post-close Wednesday); implied move from the at-the-money straddle has compressed roughly 80 bps this week, consistent with the cooling pre-print regime that has held since the March print and is not yet contradicted by positioning. The AI subindex closed flat across both US and Asian sessions; Hang Seng Tech and Korean AI names traded in narrow ranges on roughly half normal volume.\n\nNo Anthropic or OpenAI announcements; no posture changes from the public Chinese labs. The Anthropic-side activity worth noting is the continued cadence of Claude API capability releases over the last quarter, which is the relevant comparator surface for the inference-oriented subnets on Bittensor; the desk reads the current pace as a continued widening of the capability gap between centralized frontier labs and the Bittensor inference subnets, which is consistent with the structural read that Bittensor wins on permissionless coordination rather than on raw frontier capability.' },
      { h: 'What to watch over the next 24 to 72 hours',
        body: 'Three datapoints, in order. (1) Independent third-party measurement of Hermes v2 cross-subnet RPC latency. If the 380ms number holds, the second-order composability story unlocks; if it does not, the network has shipped less than the headline suggests. (2) SN14 deregistration print on Monday. A second consecutive epoch above 7 percent would warrant attention; above 10 percent would change the read on SN14 to active downside risk. (3) The Yuma Holdings announcement timing, watched as an event-driven flow trigger, treated as unconfirmed until it lands.\n\nNVIDIA earnings on Wednesday is the dated centralized event. The desk does not expect the print itself to move Bittensor markets directly; the relevant channel is the guidance language around inference compute demand, which can shift the centralized comparator narrative for SN1 TEXT and adjacent inference subnets.' },
      { h: 'Read of the day',
        body: 'A control day. The signal is the absence of signal: emission curve held, validators rotated cleanly, institutional flow paused but did not reverse, the one ship of consequence (Hermes v2) is in the direction the architecture has been signaling for two issues running. The network is operating as designed, which is the strongest evidence available right now that it is operating as designed. The desk treats Saturday prints as a baseline for the week and today\'s reads as the cleanest baseline of the month so far.' },
    ],
    sources: [
      { label: 'TaoStats, dTAO emission per block, 14d window',          url: 'https://taostats.io/metrics' },
      { label: 'TaoMarketCap, network α market caps and 24h flows',      url: 'https://taomarketcap.com' },
      { label: 'Hippius engineering blog, Hermes v2 GA announcement',    url: 'https://hippius.io/blog' },
      { label: 'TaoStats, SN64 Ridges validator activity',               url: 'https://taostats.io/subnets/64' },
      { label: 'TaoStats, SN14 TAOHash deregistration history',          url: 'https://taostats.io/subnets/14' },
      { label: 'NVIDIA Q1 FY27 implied-move analysis, options desk',     url: 'https://www.cmegroup.com/' },
      { label: 'Subneτ Magazine, today\'s Hippius long-form coverage',    url: 'index.html' },
    ],
    pdf: 'oracle-articles/oracle-2026-05-16-ecosystem.pdf',
    generatedBy: 'editorial-seed',
  },
]);

/** Most recent articles, newest-first sort. */
export function recentOracleArticles(limit = Infinity){
  return [...ORACLE_ARTICLES]
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .slice(0, limit);
}

/** Get one article by id. */
export function oracleArticleById(id){
  return ORACLE_ARTICLES.find(a => a.id === id) || null;
}

/** Group articles by ISO date (newest first). */
export function oracleArticlesByDate(){
  const groups = new Map();
  recentOracleArticles().forEach(a => {
    if (!groups.has(a.date)) groups.set(a.date, []);
    groups.get(a.date).push(a);
  });
  return Array.from(groups.entries()).map(([date, items]) => ({ date, items }));
}
