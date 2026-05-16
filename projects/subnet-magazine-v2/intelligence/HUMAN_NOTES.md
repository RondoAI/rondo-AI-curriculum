# Human-curated intelligence, Subnet Magazine

Tips Rondo drops in chat land here. The daily research agent reads the
last 7 days of this file as part of its context.

Format: dated heading + a short note. Add new entries to the TOP.

---

## 2026-05-16 18:10 UTC, TWO SCORE TIPS from Rondo, technical mining docs + PwC alliance recap
Sources: Rondo passed through two related artifacts:
  1. https://github.com/score-technologies/turbovision/blob/main/scorevision/miner/private_track/MINER.md
     (the TurboVision private-track miner technical documentation
     from Score's own GitHub repo)
  2. The full @webuildscore X recap of the Apr 16 PwC France Spaces
     with verbatim quotes from PwC's Strategy Partner

Both preserved at:
  intelligence/_primary_sources/2026-05-16-score-sn44-turbovision-private-track-miner-docs.md
  intelligence/_primary_sources/2026-04-16-score-sn44-pwc-france-alliance-recap.md

Together these convert Score (SN44) from a "they signed a Big Four
deal" headline into a fully-mechanized story the Oracle can write
about deeply. Mechanism (TurboVision miner docs) + market (PwC recap)
in a single Subnet Spotlight is exactly the bar the magazine should
be hitting.

### What the TurboVision miner docs reveal about what Score sells
- The private track is element-specific (single-element-per-container
  with on-chain commitment matching)
- Two private elements documented: Football (soccer_action) and
  Cricket (cricket_delivery)
- Request lifecycle: Score Validator POSTs a challenge with a
  video_url; miner runs inference; returns predictions + measured
  processing_time
- For football, miners detect time-localized actions (pass, tackle,
  shot, save, goal) with specific tolerance windows
- The scoring table is the editorial gold. Each action has a weight
  (network's revealed preference for how valuable detection is) and
  a tolerance (how close in time the prediction must be):
    pass 1.0 / pass_received 1.4 / recovery 1.5 / tackle 2.5 /
    interception 2.8 / ball_out_of_play 2.9 / clearance 3.1 /
    take_on 3.2 / substitution 4.2 / block 4.2 / aerial_duel 4.3 /
    shot 4.7 / save 7.3 / foul 7.7 / GOAL 10.9
- Weight ratio between a goal (10.9) and a pass (1.0) is ~11x
- For cricket: regression-style output (ball speed kph, bounce_x,
  stump_y) suitable for broadcast ball-tracking overlays
- The framing "robust against exploits identified in the classical
  mAP metric used in literature" tells us the team is doing serious
  ML engineering, not just plumbing video through a stock detector

### What the PwC recap adds beyond the WallStreetBets thesis
The earlier thesis (today's 17:30 entry) cited the Score-PwC alliance
as "first time a Bittensor subnet has partnered with a Big Four firm"
but did not have the inside detail. This recap fills it in:
  - 8 months of legal due diligence to close
  - PwC France: EUR 1bn revenue (standalone)
  - PwC global: USD 60bn+ across 136 countries
  - Counterparty named: Jean-Thomas Ledoré (@jtledore),
    Strategy Partner at PwC France and Maghreb
  - The product is "Manako's Business Operations World Model"
    (Manako is the product layer, Score is the underlying subnet)
  - Distribution channel: PwC France enterprise clients across
    retail, manufacturing, logistics, energy, infrastructure
  - Bittensor blockchain named in the PwC press release title in
    writing (this is the deal status-signal the desk should anchor on)
  - The "live alpha" disclosed on Spaces: Jean-Thomas had a call two
    days before with PwC's global head of blockchain in the US.
    Score/Manako will pitch to the global PwC blockchain community
    in coming weeks. Each of 136 territories can then reach out.
    Translation: this is STRUCTURALLY scalable beyond France

### The quotes from PwC's side worth quoting verbatim
Jean-Thomas Ledoré on the strategic frame: "Bittensor is not PvP.
The competition is outside. It's decentralised AI versus centralised
technology. We should all be building together."

Jean-Thomas Ledoré on what wins enterprise (mechanism over hype):
"If you're leaning only on emissions, you will be stuck. You need
to solve real world problems, capture value from the world, and
inject it back into the ecosystem."

The official signed-press-release quote: "Physical AI is rapidly
moving from emerging technology to an operational necessity. By
partnering with Manako and leveraging Score decentralised AI
infrastructure on Bittensor blockchain, we enable our clients to
move faster beyond observation and experimentation, and toward
real-world execution, turning physical environments into systems
that drive decisions, actions, and scalable value creation."

### The Manako product framing for the headline pitch
"Enterprises are sitting on one billion cameras that record
everything and act on nothing. Manako turns that into real-time
systems of action: lockdowns, dispatches, audit reports, workflow
automations, across infrastructure that's already installed.
Powered by Score (SN44)."

This sentence IS the Spotlight headline. The Oracle should treat
"one billion cameras that record everything and act on nothing" as
the framing for any Score coverage.

### Tim's technical update from the Spaces (architecture detail)
A few weeks before Apr 16, Score did a major refactor: challenges
are no longer hard-coded; validators now fetch a manifest JSON that
encodes the challenge, emissions weight, scoring logic, and model
size constraints. New challenges can ship without subnet software
updates. The fuel station detection challenge launched recently and
produced strong models within a week. This manifest-driven
architecture is the technical foundation that lets Score serve
multiple PwC enterprise verticals without code changes per use case.

### The Oracle synthesis the magazine could not write before today
With TurboVision miner docs + PwC recap together, the Oracle can
write a single Subnet Spotlight that:
  1. Opens with the "billion cameras" framing
  2. Walks through the actual mining contract (Score Validator
     POSTs video, miner returns timed action predictions, scored
     against ground truth with weight ratios revealed)
  3. Quotes the weight table to show what Score's market values
     (goal=10.9 vs pass=1.0)
  4. Explains the manifest-driven architecture as the unlock for
     PwC's vertical-by-vertical rollout
  5. Cites PwC's Strategy Partner verbatim on why decentralized AI
     and on the "Bittensor is not PvP" frame
  6. Sets a 3-datapoint watchlist (global blockchain pitch landing,
     PwC territory uptake, manifest catalog growth)
This is a 1,500-word Spotlight target, easily.

### Suggested follow-up automation
Adding to voices.js: @MaxScore, @tm0klc, @nigescore (the Score team
trio), @jtledore (PwC Strategy Partner), @manakoai (the product
layer brand). Score's existing entry (@webuildscore) gets bio
expanded with the new facts.

---

## 2026-05-16 17:50 UTC, PRIMARY SOURCE from Rondo, RedTeam SN61 / Innerworks commercial-breakout update
Source: Rondo passed through the RedTeam team's Feb 12 X post.
Preserved at:
  intelligence/_primary_sources/2026-02-12-redteam-sn61-commercial-breakout-update.md

### What RedTeam is (new to our coverage)
SN61 on Bittensor. The research engine for an AI-vs-AI cybersecurity
loop. Commercial vehicle: Innerworks (theredteam.io). Premise: attacks
are now generated by AI agents, evolve autonomously, outpace every
traditional defense; SN61 miners constantly probe + break + innovate,
and their output flows directly into Innerworks production systems.

### Commercial wins disclosed
- Fully integrated across a major global messaging platform with
  100M+ DAU, "live in production, not a pilot". Name not yet
  publicly disclosed. Only a handful of platforms hit that scale
  (Telegram, WhatsApp, WeChat, Line, KakaoTalk, Viber, Signal).
  Worth pressing for the disclosure when it lands.
- 1inch partnership: paying customer using full stack (device
  fingerprinting, bot detection, geolocation)
- Pipeline: DEXs, protocols, transaction monitoring platforms
  (traditional + crypto), payment providers, identity verification

### The novel token-economic commitment
Innerworks commits an R&D budget allocation that flows DIRECTLY into
alpha buybacks, starting at baseline 1 TAO/day plus milestone-triggered
injections. Framing: subnet miners treated as "key stakeholders in the
company". Explicitly NOT a revenue-share or % of SaaS, a committed
R&D budget allocation. Self-aware on the small starting figure:
"this is the beginning of a model, not the end of it. We want to
iterate on this carefully." Trajectory: "constant and considerable
increases" as commercial milestones land.

### A pattern across multiple tips today: subnet alpha buybacks
This is now the FOURTH commercial-vehicle buyback model surfaced
today via Rondo's tips:
  - Lium (SN51): publicly tweeted >$150K buyback+burn on May 3,
    revenue-driven
  - RedTeam (SN61): 1 TAO/day baseline + milestone injections,
    R&D-budget driven (this tip)
  - Vanta (SN8) per WallStreetBets: "fees are used to buy back
    alpha tokens, creating a direct flywheel between product
    revenue and token value"
  - Chutes (SN64) per Jon Durbin's roadmap: "$ per token revenue
    is the metric we are concerned with, and we are driving that
    number up daily" (implies revenue captured back into the
    network even if not explicit buybacks)
This is a worth-flagging ecosystem pattern. Subnets with real
commercial revenue are converging on alpha-buyback flywheels.
The Oracle agent should write an Ecosystem State article
specifically about this convergence; the human magazine has not
yet synthesized it.

### The biological immune system vision (excellent editorial material)
Already-shipped: internal immune system agent that analyzes attacks
coming through SN61, reverse-engineers methods, generates
countermeasures, proposes them to engineers. "What used to take
weeks of manual reverse engineering now takes hours."

Coming next: miners incentivized to build adaptive attack agents
("digital viruses") that continuously evolve until they bypass
proposed challenges. Immune system agent responds in real time,
deploys defenses, attack agents test again. The biological analogy
is explicit and quotable:
  > "antigens (miner attack agents) trigger antibody production
  > (automated defences), which get deployed and remembered by the
  > system. The viruses mutate. The immune system adapts. The cycle
  > repeats, entirely on machine time."

The structural risk the team has NOT addressed: when both sides
evolve via the same training mechanism, what stops the equilibrium
from converging to a stalemate? Worth probing in any Oracle coverage.

### Quantitative claims worth quoting
- 46 repositories in the RedTeamSubnet GitHub org
- 2,000+ commits, 26 releases shipped
- 14 challenges run, 9 deprecated, 2 currently active
- AB Sniffer submission quality scaling: v1 had 4 accepted commits,
  v4 has 105 (about 28x growth). Cleanest single defensible claim
  in the entire post for the "decentralized R&D at a pace no
  traditional team can match" thesis.

### Suggested follow-up automation
- Added @_redteam_ (the team's X handle) to voices.js as SN61 subnet
- Added @1inch as a customer voice (positions 1inch as one of the
  Bittensor ecosystem's first major DeFi-side paying customers)
- Score (SN44) vs RedTeam (SN61) comparison is an obvious future
  Oracle Subnet Spotlight: two subnets that moved past "interesting
  research" into "real enterprise contracts" but with different
  go-to-market structures (Score via PwC Big Four distribution
  alliance, RedTeam via direct commercial vehicle Innerworks)

---

## 2026-05-16 17:30 UTC, MAJOR THESIS DROP from Rondo, WallStreetBets TAO investment thesis
Source: Rondo passed through the full @wallstreetbets X thread
"Why TAO is the Bitcoin of AI" (originally posted Apr 30).
Preserved verbatim at:
  intelligence/_primary_sources/2026-04-30-wallstreetbets-tao-is-bitcoin-of-ai-thesis.md

This is the densest single tip of the day. A full bullish investment
thesis naming 8+ subnets with founder attributions, capital allocator
positioning, and several factual corrections to our existing data.
Treating as the seed asset map for the magazine's subnet coverage
going forward.

### MAJOR FACT CORRECTIONS embedded
Three things our system had wrong or missing that this thesis settles.

1. **SN3 is Templar (covenant_ai), not Hippius.** I had written
   earlier today that Hippius is SN75 (CONFIRMED by Mark Jeffrey
   bio in voices.js). I never claimed SN3 = Hippius, but the
   ecosystem article seed said "Hippius (SN75)" so Hippius is
   correctly attributed. The new information: **SN3 = Templar,
   parent company Covenant AI**, the team that trained a 72B
   parameter model with 70+ contributors on home GPUs.

2. **Chutes founder attribution needs nuance.** Per this thesis,
   Chutes (SN64) is "Built by @rayon_labs". Per Jon Durbin's own
   May 13 roadmap post (logged earlier today as his "founder"
   post), he writes as Chutes' frontline backend dev. His X bio
   reads "Human. Backend dev http://chutes.ai". The likely truth:
   Rayon Labs is the company, Jon Durbin is a senior engineer
   there (possibly co-founder, possibly lead). The Oracle should
   say "built by Rayon Labs, with Jon Durbin as a lead engineer
   and public voice" rather than asserting either as sole founder.

3. **Const (@const_reborn) is now building Affine (SN120).** I had
   Const in voices as core (Opentensor co-founder). This thesis
   reveals he is ALSO building his own subnet, Affine, which runs
   continuous evaluations to fine-tune open-source reasoning models.
   Affine uses Chutes for hosting. Need to expand Const's bio to
   reflect this.

### The capital + thesis structure to anchor on
Quotes worth re-using:
  - Rob Greer (Stillcore): "TAO 2026 = ETH 2016 = BTC 2013"
  - Stillcore's stated goal: own 1 percent of all TAO in existence
  - Rob Greer is "targeting a 1T TAO market cap by 2030"
  - Jason (Stillcore, of Uber 25K -> 100M fame): put close to 1M
    of his own money into TAO, calling for 200x in 5 to 10 years
  - Barry Silbert (DCG) "called TAO a generational opportunity"
    at the DCG summit per the author
  - Unsupervised Capital projects TAO at 4,800 USD by Dec 2027
    (19x), bull case 10,800 USD
  - Grayscale holds TAO in their Decentralized AI Fund; has filed
    with SEC to convert the GTAO Trust into a SPOT ETF (same path
    that preceded Bitcoin's spot ETF approval). This is a real
    institutional signal worth tracking for filing updates.
  - Jensen Huang "mentioned Bittensor" (worth source-confirming
    the exact context before quoting)
  - Mark Jeffrey thesis: less than 20 percent of all TAO is staked
    into subnets; when the first subnet crosses 1B mcap, root
    stakers will rush in. That migration alone could 3-4x subnet
    valuations without any new TAO purchased

### The Templar black swan worth understanding deeply
- Templar (SN3, parent Covenant AI) trained a 72B parameter model
  decentralized, 70+ home-GPU contributors, no datacenter
- TAO surged ~90 percent on the news, ecosystem hit ~1.5B combined
  valuation
- April 2026: founder Sam Dare dumped 37,000 TAO (~10M USD)
- Community questioned fundamentals
- Const took "immediate steps to fix it" including introduction of
  "Locked Stake" mechanism to strengthen subnet ownership and
  decentralization
- Read: this is the analog of FTX for Bittensor's narrative.
  Recovery posture from Const + introduction of Locked Stake is
  the institutional response. Worth a future Oracle Ecosystem
  State article specifically on Locked Stake mechanics

### The full subnet asset map this thesis surfaces
(All previously unknown to or under-specified in our system)
  - **SN3   Templar       @tplr_ai / @covenant_ai** (Sam Dare,
            72B decentralized training, Apr 2026 black swan)
  - **SN4   Targon       @TargonCompute** (decentralized AWS for
            AI, Targon VM, Targon OS, INTEL co-authored paper
            Mar 2026, powers Dippy 8M+ users, built by @0xcarro
            + @jameswoodmanv, aka Manifold Labs)
  - **SN8   Vanta        @VantaTrading** (prop firm with 100%
            profit split, Hyperliquid version Hyperscaled, A-books
            via CFTC-compliant Glitch, net profitable on emissions
            as of last month)
  - **SN15  Oro          @oroagents** (autonomous AI shopping
            agents, 45 agents outperformed GPT 5.4, co-founded
            @shardiban + @ironseth_s)
  - **SN44  Score        @webuildscore** (computer vision, FIRST
            Bittensor subnet to partner with a Big Four firm,
            PwC France formal alliance to distribute Manako
            product, won Bittensor track at Paris Blockchain Week)
  - **SN46  RESI         @resilabsai** (real estate intelligence,
            98%+ remote appraisal accuracy, 1000+ appraisals first
            week, nationwide lender partnership, Stillcore
            invested, founded by @Sebyverse)
  - **SN64  Chutes       built by @rayon_labs, Jon Durbin lead
            engineer** (already in our data, expand bio)
  - **SN120 Affine       @affine_io** (Const's new subnet, runs
            continuous evals, hosts on Chutes, direct value loop)
  - **TAO.com  @TAO_dot_com** (mobile wallet, ONE OF THREE
            MULTISIG KEY HOLDERS for Bittensor ecosystem-level
            changes, was one of largest early miners, Android
            launching soon)

### Why this matters for the Oracle's competitive bar
This single thread gives the Oracle 8+ ready-made Subnet Spotlight
candidates with founder names, technical details, and quantitative
adoption metrics. None are on the human-magazine avoid list except
SN64 Chutes (which we already cover via Jon Durbin). The Oracle
should rotate through:
  - SN4 Targon (Intel partnership angle)
  - SN44 Score (PwC partnership angle, first Big Four)
  - SN46 RESI (real estate disruption angle, $600T TAM)
  - SN8 Vanta (prop firm disruption angle, FTMO comparison)
  - SN120 Affine (Const founder angle, Chutes-Affine value loop)
  - SN15 Oro (agent benchmarking angle, GPT 5.4 beat)
  - SN3 Templar (post-black-swan recovery angle, Locked Stake)
That is roughly two months of differentiated daily spotlights from
one tip alone.

### Suggested follow-up automation
Adding 11 new handles to voices.js so the Nitter scraper picks them
up automatically going forward. Bios pre-baked with the WallStreetBets
thesis facts so the Oracle has context even without re-reading the
full thread. Const's bio expanded to include Affine (SN120).

### Hedge the Oracle should apply
This is an explicit BULL THESIS by a positioned voice. The price
targets ($4,800 Dec 2027, $10,800 bull case, 1T mcap by 2030,
200x in 5-10 years) are projections, not facts. Cite as "X projects"
or "X expects", never as "expected". The "TAO 2026 = ETH 2016 = BTC
2013" frame is quotable but the Oracle should also note disanalogies
(TAO has an active product layer BTC/ETH did not have at equivalent
maturity; AI compute economics are not crypto economics; subnet-by-
subnet revenue is a different signal than network-effect alone).

---

## 2026-05-16 17:00 UTC, PRIMARY SOURCE from Rondo, Connito whitepaper v1
Source: Rondo dropped the 21-page Connito whitepaper:
  intelligence/_primary_sources/2026-05-16-connito-whitepaper-v1-decentralized-moe.pdf

Authors: Isabella Liu (isabella@connito.ai) and George Kim
(george@connito.ai). Site: connito.ai. The paper does NOT explicitly
state a Bittensor netuid; one of its references is the original
Opentensor BitTensor whitepaper, and the architecture maps cleanly
onto the Bittensor miner-validator pattern, so the desk treats this
as a Bittensor-aligned project pending netuid confirmation. Flag at
the next opportunity to confirm whether Connito has a registered
subnet or is pre-registration.

### What Connito is, in one sentence
A decentralized framework for trainin sparse subsets of Mixture-of-
Experts (MoE) models, with a Proof-of-Loss incentive layer that
rewards miner submissions empirically (held-out validation loss
reduction) rather than by trust.

### Why this is the third decentralized-MoE story today
Today's pool now contains three distinct primary sources on the same
structural problem (how do you train MoE models without owning a
centralized high-bandwidth GPU cluster):
  1. Jon Durbin's "Parallax" reveal for Chutes (SN64) earlier today,
     emphasizing FLOPS reduction per island and elimination of
     backward pass on (C-1)/C routed experts
  2. Zeus (SN18) V2 benchmark paper, weather-forecasting application
     of decentralized aggregation
  3. This Connito paper, sparse target-expert updates + Proof-of-Loss
This is not coincidence. The bottleneck is real (model training is
centralized, hyperscalers control compute), and multiple teams are
converging on different architectural answers. The Oracle agent has
material for a STRONG Ecosystem State article framed around
"decentralized MoE training is going from theory to multiple
shipped implementations in a single week".

### The Connito mechanism, four phases
Phase 1, TARGET EXPERT SELECTION: given a target domain dataset
D_new, compute a selection map S = {S_l} per layer specifying which
experts get updated. Selection uses routing probability mass, activation
frequency, or a differential score against a general dataset D_gen.
Builds on ESFT and DES-MoE.

Phase 2, SPARSE LOCAL OPTIMIZATION: workers do H local optimization
steps (DiLoCo-style) on only the selected target experts. Submit
just the updated target-expert weights, no shared parameters, no
router updates.

Phase 3, FROZEN ROUTING ANCHOR: router stays fixed. This makes all
worker updates COMPARABLE because they all optimize against the same
routing distribution. Inherits from ESFT and FlexOLMo.

Phase 4, GLOBAL INTEGRATION: aggregator receives all worker
submissions, computes weighted average (uniform 1/N or validator-
weighted to favor submissions that improve held-out loss).

### The Proof-of-Loss incentive mechanism (this is the Yuma analog)
Validators measure each miner submission's empirical improvement on
a held-out validation subset. Utility is defined as:

  u_i = max(0, L_val(current_global) - L_val(current_with_miner_i_update))

Only POSITIVE loss reduction is rewarded. Submissions that do not
improve validation loss receive zero utility. Cycle-by-cycle rankings
drive emission allocation, with top-K miners receiving rewards via a
decreasing rank function.

The validation subset is DETERMINISTICALLY sampled from the target
distribution per cycle, so validators evaluate the same objective.
This is the analog of Yuma Consensus but with empirical loss reduction
as the scoring signal rather than weight-vector agreement.

### Commit-reveal mechanism, copy resistance
Same SHA-256 commit-reveal pattern as Zeus (and the wider Bittensor
ecosystem). Miner publishes c_i = SHA256(checkpoint_i) during the
commit window, reveals the checkpoint during the submit window,
validators verify the hash matches.

Additionally, the EVALUATION SEED is generated from validator-
provided randomness:
  s_t = SHA256(sort_and_concat(s_1, ..., s_V))
where each s_v is validator v's random seed for the cycle. Because
no single miner controls all validator seeds, miners cannot reliably
predict the held-out validation partition before committing. This
prevents miners from optimizing specifically for the eval set.

Three explicit security goals:
  1. UTILITY ALIGNMENT, rewards track measurable improvement
  2. COPY RESISTANCE, commit-reveal prevents post-observation cheating
  3. EVALUATION UNPREDICTABILITY, deterministic for validators but
     hidden from miners

### The structural efficiency claim
Communication cost per round scales as O(P_S / P_full) where P_S is
the selected target expert parameter count and P_full is the total
MoE parameter count. So if you only update 10 percent of experts,
you transmit 10 percent of the data. With H local steps before each
commit, amortized communication per local gradient step becomes
O(P_S / H).

Worker-side VRAM is reduced because frozen shared parameters (theta_0)
and frozen router (Psi_0) do not need Adam optimizer state. Memory
footprint cuts further if those large parameters are kept on disk.

### Future outlook (the team's stated commercial framing)
Connito explicitly targets domains where customers need deeper model
customization than generic foundation models, prompt engineering, or
lightweight PEFT methods can provide. They list: legal, finance,
healthcare, coding, compliance, enterprise knowledge work. The pitch
is that validated expert updates form a shared expert library that
compounds across deployments. This is a B2B story, not a consumer
story.

### How the Oracle should compare Connito vs Parallax
Both target decentralized MoE training. Different design choices:
  - PARALLAX (Chutes/Jon Durbin, no paper yet): claims <=1.5 percent
    gap on a 20B run, 3.4x per-token FLOPS reduction per island,
    eliminates backward pass + Adam state on (C-1)/C routed experts.
    Emphasis on per-step compute reduction.
  - CONNITO (Liu + Kim, paper now public): trains only selected target
    experts, frozen router + frozen shared params, Proof-of-Loss
    incentive on held-out validation loss. Emphasis on update-selection
    via market discovery rather than direct compute reduction.
The two are complementary in some ways and competitive in others. Worth
the Oracle's effort to map them side-by-side in a future spotlight,
including the open question of whether they could compose (e.g. use
Parallax's per-step compute reduction inside Connito's Proof-of-Loss
incentive frame).

### Hedge the Oracle should apply
Connito's paper presents the framework but does NOT report empirical
training results yet (no benchmark table comparing Connito-trained
models against centralized baselines). The mechanism is presented;
the evidence-of-superiority is not. The Oracle should treat this
strictly as an architectural proposal until Connito ships preliminary
training numbers. Same hedge applies to Parallax (no paper yet at
all). Only Zeus has published actual benchmark numbers among today's
three decentralized-AI tips.

### Suggested follow-up automation
- Add Connito to voices.js as a subnet entry once netuid confirmed.
  Placeholder added with handle @connito_ai (likely but unconfirmed).
- Add connito.ai/blog to rss_blogs.py if they publish a blog.
- Watch for "Connito v2" or empirical results paper; that is when
  this becomes a strong Oracle Spotlight target.
- Two arXiv references in the bibliography worth flagging for the
  Oracle's own research: J. Li et al. 2025a (DES-MoE, arXiv 2509.16882)
  and Wang et al. 2024 (ESFT, arXiv 2407.01906). Both are upstream
  primary research that the Oracle could cite directly when
  contextualizing Connito.

---

## 2026-05-16 16:45 UTC, PRIMARY SOURCE from Rondo, Lium SN51 B300 stock screenshot
Source: Rondo passed through a Lium marketplace screenshot:
  intelligence/_primary_sources/2026-05-16-lium-sn51-b300-stock-helsinki.jpg

Caption Rondo attached: "just got more b300 stock for both spot and
on-demand at lium! rent now from \$6/hr"

This is the HARD EVIDENCE for the Lium thesis from the @taomedia_
article logged earlier today. The morning tip stated the platform's
claim of approximately 90 percent cheaper GPU rentals vs hyperscalers.
This screenshot gives us the actual numbers to verify against.

### What the screenshot shows
The Lium marketplace, filtered to B300 SXM6 AC pods. Header bar
reads: "Showing 2 / 218 Available Pods" (so the total live B300
inventory on the platform right now is ~218 pods).

POD 1 (SPOT tier):
  - 8x NVIDIA B300 SXM6 AC
  - Listed at \$47.92/hour for the full 8-GPU pod
  - CPU: 240x AMD EPYC 9575F 64-core processor
  - RAM: 2,066 GB
  - Disk: 2,914 GB
  - Network: 243 Mbps up / 1,744 Mbps down
  - Uptime: 13 hrs 45 min
  - Location: Helsinki, Finland
  - Provider hotkey: 5E5DrPjvzmSeuff5i8tfNcG7MUcqJDLP2b7gXB62A85S48Ro

POD 2 (on-demand tier):
  - Same hardware spec (8x B300, same CPU/RAM)
  - Listed at \$67.12/hour for the full 8-GPU pod
  - Disk: 2,849 GB
  - Uptime: 1 day 12 hrs 30 min
  - Same Helsinki location, same provider hotkey

### The per-GPU math the Oracle should run
SPOT: \$47.92 / 8 GPUs = \$5.99/hr per B300 (the "from \$6/hr" claim)
ON-DEMAND: \$67.12 / 8 = \$8.39/hr per B300
Implied spot/on-demand spread: ~40 percent (spot is ~28 percent below
on-demand)

### Verification against hyperscaler pricing for context
The Oracle agent should look these up live before quoting, but as
approximate anchors for tomorrow's article:
  - AWS p5en (8x H200) is the closest direct comparable on a
    hyperscaler today; B300 not yet broadly available there
  - B300 is NVIDIA's Blackwell Ultra, the current flagship AI
    accelerator (succeeds B200, which succeeded H200)
  - When Microsoft Azure does list B300 instances, expected list
    price is approximately \$15-30/hr per GPU based on current
    Blackwell pricing patterns
  - Lium's spot \$5.99/hr per B300 represents roughly a 60 to 80
    percent discount vs the expected hyperscaler list. Not the
    full "90 percent cheaper" claim from the morning's article, but
    in the right zone, and on flagship hardware that is scarce
    enough that hyperscaler customers often cannot get it at any
    price right now

### Scale of the inventory
218 pods of 8x B300 each = approximately 1,744 B300 GPUs on a
decentralized network, right now, at spot. That is a real number
for a permissionless marketplace. For comparison, that is more
B300 capacity than most mid-sized AI startups have ever physically
held. The aggregate compute is meaningful.

### Why this matters strategically
This tightens the loop on the morning's tip from @taomedia_:
  - The article claimed Lium is hitting ~\$20K/day revenue
  - The article claimed pricing is ~90 percent below hyperscalers
  - This screenshot shows actual stock at \$5.99/hr per B300 spot,
    on Blackwell Ultra hardware, in real volume
The thesis is supported by visible inventory, not just by the
article's narrative. The Oracle should cite this combination
explicitly: an external editorial source (@taomedia_) plus a
direct marketplace screenshot (this tip) together form a
two-source verification of the claim. That is exactly the
provenance bar the Oracle is supposed to clear.

### Location note (Helsinki, Finland)
Both visible pods are in Helsinki. The desk should note this is
not coincidence: Finland has cheap renewable power (heavy hydro
+ wind grid), low cooling cost (Nordic climate), and good network
peering into both EU and Russia/Asia. The Lium provider running
these pods is likely sitting on a power-arbitrage trade in addition
to the GPU-arbitrage trade. Worth flagging in the spotlight.

### Suggested follow-up automation
- The provider hotkey (5E5DrPjvzm...48Ro) is on-chain and could
  be cross-referenced via taostats to see how much TAO this
  specific provider has earned over time, what other subnets they
  participate in, and whether they are a known institutional
  operator. Future enhancement to the GitHub-style scrapers.
- Worth adding lium.io to the rss_blogs.py feed list if they
  publish a blog. Status of their RSS feed unconfirmed; flag for
  the next polling cycle.

---

## 2026-05-16 16:30 UTC, PRIMARY SOURCE from Rondo, Ridges SN62 dashboard + verification update
Source: Rondo passed through a Ridges team update with a dashboard
screenshot. Image saved at:
  intelligence/_primary_sources/2026-05-16-ridges-sn62-dashboard-3of3-verification.jpg

### What Ridges actually does (the agent should anchor on this)
Ridges (SN62, NOT SN64; see corrections in prior log entries) runs a
SWE-bench-style benchmark market for AI coding agents. Miners submit
agents that try to solve software-engineering problems (the screenshot
shows problem IDs SWE-RQHJT, SWE-SHVUF, SWE-YYTQC, SWE-4PZR6); the
network verifies each solution by running it through three validators
and only counting the score if all three agree (3/3 verification).
Average per-problem runtime in the screenshot: 21 minutes to 36 minutes.

### Today's product update from the Ridges team, verbatim
> "Two improvements to the dashboard today:
>
> Reliability scoring · visibility into reliability scores has been
> improved. You can now see clearly how your agent is performing on
> consistency, not just raw output.
>
> Reduced scoring variance · we've moved to 3/3 verification. Every
> score now requires three confirmations before it counts. Less
> noise, more accurate rankings."

### What the dashboard screenshot tells us about the scoring model
Visible on the screenshot for one miner's view:
  - Score: 40%
  - Validator Spread: 20% (range 43.3% to 63.3%)
  - Tasks: Passed 19/30, Reliable 12/30, Flaky 7/30, Consistent 23/30
The four task categories (Passed, Reliable, Flaky, Consistent) are
clearly distinct metrics in the Ridges scoring grammar:
  - PASSED:     raw boolean, did the agent solve the problem at all
  - RELIABLE:   passed every time it was attempted
  - FLAKY:      sometimes passes, sometimes does not (lower trust)
  - CONSISTENT: produced the same output across all validator runs
The Validator Spread (the range your score might land in depending
on which 3 validators get assigned) is a measure of the network's
own scoring variance. Lower spread = more reliable ranking.

### Why the 3/3 verification change matters mechanistically
Moving to 3-of-3 verification is the structurally important news.
With single-validator scoring, a miner's rank was sensitive to which
validator drew the task; outliers in either direction could move a
rank meaningfully. With 3/3 unanimous-verification, score variance
collapses toward the median validator's signal. Trade-off: tasks
take longer to settle (3x verification compute per task), so the
network's economic throughput per epoch is mechanically lower in
exchange for cleaner rankings. The Validator Spread metric on the
dashboard is the team's way of making the variance trade-off legible
to miners in real time.

### Where this fits in the broader ecosystem story
The agent should connect these dots in any future coverage:
  - Lium (SN51) is the GPU MARKETPLACE layer (compute supply)
  - Chutes (SN64) is the inference SERVING layer (compute demand
    aggregation)
  - Ridges (SN62) is the AGENT BENCHMARK layer (quality measurement
    on the agents that consume that compute)
  - Zeus (SN18) is a SPECIALIZED inference subnet (weather forecasting)
These four together start to look like a coherent vertical stack:
hardware supply, inference serving, agent quality measurement, and
specialized vertical applications. Worth flagging in any Ecosystem
State article that none of these existed in this form 12 months
ago; the stack is forming in real time.

### Suggested follow-up automation
- @ridges_ai (or whichever handle they actually use) should be
  added to voices.js so the Nitter scraper hits them. The desk
  does not currently have a confirmed Ridges X handle; flagging
  this so it gets confirmed at the next opportunity. For now I
  am adding a placeholder under the subnet category with the team
  name only; will rotate to the real handle once confirmed.
- The SWE-bench problem IDs in the screenshot (SWE-RQHJT, etc.)
  are derived from the Princeton SWE-bench benchmark. Worth noting
  in any future article that Ridges is grounding its scoring in an
  externally-validated public benchmark, which is unusually rigorous
  for a Bittensor subnet.

---

## 2026-05-16 16:05 UTC, PRIMARY SOURCE from Rondo, Jon Durbin (Chutes founder) roadmap post
Source: Rondo passed through Jon Durbin's May 13 X post. Jon Durbin
is the founder of Chutes (chutes.ai), self-described "Human. Backend
dev" on his @jon_durbin profile. Chutes is the #1 revenue subnet on
Bittensor (the Lium article from earlier today places Lium "second
place behind Chutes"). This post is the founder's first-person
state-of-the-platform.

### CRITICAL FACT CORRECTION before the substance
I had SN64 wrong in earlier seed Oracle articles. SN64 = CHUTES,
not Ridges as I previously wrote. Source: Mark Jeffrey's bio in
voices.js lists subnets [64, 62, 75] for "Chutes, Ridges, and
Hippius" in that order. Combined with the Lium piece confirming
Chutes is the #1 subnet by revenue, the mapping is:
  SN62 = Ridges
  SN64 = Chutes
  SN75 = Hippius (already confirmed in human article today)
The 2026-05-16 seed ecosystem article and SN14 TAOHash seed article
both reference "SN64 (Ridges) anchor validators rotated cold keys"
which is factually wrong. The Oracle agent should treat the seed
articles as superseded on these points. Drop SN64 from the Oracle's
"recently covered" list and flag Chutes itself as a high-priority
spotlight target whenever the human desk hasn't filed on it.

### What Jon disclosed about the platform
Numbers to anchor on:
- Peak throughput: ~160B tokens in a single day, on permissionless
  decentralized compute, free at the user-facing level
- GPU economics, early days: $0.77/hr per H200 via miner emissions
  (Jon's framing: this is what the network effectively paid for
  hardware via emission. Today's GPU market is much tighter, Hopper
  and Blackwell scarce, spot pricing rare, longer commits required)
- Inventory cut: ~2/3rds reduction since December 2025, but revenue
  held flat and recently grew
- The metric Jon is now optimizing: dollar per token revenue
  (not raw token count). Driving it up daily, his words

### The strategic shifts Jon flagged
- Price increases: actively raising prices to "more closely match
  market rates" given GPU shortage
- Pruning unprofitable models: purging long-tail models that "don't
  earn their keep" to alleviate 429 / capacity issues on models
  people actually use
- More focus on Private Chutes (hourly pricing) vs the public
  per-token pricing
- New compute providers being onboarded
- Mining pool feature in development to stabilize capacity

### The big technical reveal: "Parallax", their new MoE training method
Jon is personally working on a new decentralized training method for
MoE (Mixture-of-Experts) models, branded "parallax". Not a Chutes
pivot, framed as "accretive". White paper + preliminary results
coming soon. Key claims worth quoting in any future Oracle article:

  - 20B model run over the public internet with SINGLE GPUs per
    "composer" (their term for a training participant)
  - <=1.5% gap vs traditional end-to-end training, "will likely
    fully close to zero given sufficient training steps"
  - In "extreme" mode, routed experts can be offloaded to commodity
    GPUs or even Macbooks at home, with only moderate bandwidth
  - Per-token FLOPS per island reduced >=3.4x (depending on island
    count) while maintaining >99% forward accuracy
  - Eliminates backward pass + Adam state on (C-1)/C routed experts
  - Jon's framing: current DiLoCo-based mechanisms are "lacking";
    parallax is the alternative
  - The end goal: a model with GLM-5.1 / Kimi-K2.6 quality
    runnable on a single H200, fully open-source training
    formula and datasets (to prevent dataset poisoning, censorship)

### Inference optimizations in flight
- Secure prefix cache work: ephemeral AES-key file-based encryption
  local to TEE VMs (Intel TDX), RAM fallback HiCache
- Research collaboration with Prof. Juncheng Yang at HARVARD on
  cache hit rates + routing methodologies. Jon claims this will
  yield "absolutely 'free' performance improvements merely by
  altering routing mechanisms". This is the kind of academic-
  industry collaboration the Oracle should note in any Chutes
  coverage; cite the named professor
- Ongoing engine pulls: new sglang/vllm changes, MTP, IndexCache
  from ZAI

### Migration to 100% TEE infrastructure
- Migrating exclusively to TEE-enabled instances
- Acknowledges short-term instability and "some favorite models
  may not make the cut" during transition
- Knock-on: eliminates need for GPU-running GraVal on validators,
  reducing core validator costs

### Why this matters for the Oracle Research agent
Chutes (SN64) is the most important subnet to cover on Bittensor
right now. It is the #1 revenue producer. The founder has just
disclosed:
  (a) a new training methodology with quantitative claims
  (b) an academic research partnership
  (c) a structural shift in business strategy ($/token over volume)
  (d) a security infrastructure migration (full TEE)
Any one of these would be a worthwhile Oracle spotlight; together
they are a multi-section deep dive opportunity. The Oracle should
also note the chain of evidence here: Jon's claims are NOT yet
verified by third-party measurement (the parallax 1.5% gap claim
in particular requires the paper + replication). Treat as
upper-bound, in the magazine's standard practice. The Harvard
collaboration is worth following up: independently verifiable
academic publication should follow at some point.

### Suggested follow-up automation
- @jon_durbin added to voices.js (group: core, expertise: subnet,
  miner, validator, given Chutes' platform scope)
- Watch for the Parallax whitepaper drop; the Oracle should file a
  follow-up spotlight when it lands
- The Lium tip earlier today + the Chutes roadmap today together
  let the Oracle write an Ecosystem State article framed around
  "the GPU economics shift", how compute scarcity is reshaping
  the top two subnets simultaneously

---

## 2026-05-16 15:20 UTC, PRIMARY SOURCE from Rondo, Zeus Subnet 18 V2 benchmark paper
Source: Rondo dropped this URL in chat:
  https://www.zeussubnet.com/news-and-updates/ZEUS_V2_Benchmark.pdf
Saved locally to intelligence/_primary_sources/2026-05-16-zeus-subnet-18-v2-benchmark.pdf
for permanent reference (the host returns 403 to bot user-agents).

This is a TECHNICAL PAPER by the Zeus team. Primary source. Treat as
the highest-quality tip we've received: a research-grade artifact
with named authors, real benchmarks, full methodology.

### What Zeus is
- SUBNET 18, not 51 or other. Often misattributed.
- Team: Ørpheus AI, Amsterdam. Authors: Wouter Lubbert, Antoon Haringhuizen.
- Product: decentralized global weather forecasting market. Aggregates
  forecasts from miners running their own models (institutional NWP,
  AI foundation models like GraphCast/Pangu/AIFS, statistical
  post-processing). Acts as a "decentralized meta-model".
- Predicts 4 variables on global 0.25° (~28km) grid: 2m temperature
  (t2m), 100m U-wind (u100), 100m V-wind (v100), surface solar
  radiation downwards (ssrd). Horizon T+15 day (360h).

### The mechanism, in 3 phases
- PHASE 1 (T0): miners SHA-256 hash their compressed prediction salted
  with their hotkey address, post to chain. Locks in the forecast
  cryptographically before the institutional baselines have even
  disseminated.
- PHASE 2 (T0+60min): validator selects Top-K (K=10) miners by
  rolling-rank iwScore over the last N=8 epochs, requests reveal,
  verifies the hash matches.
- PHASE 3 (~T+20 days): ERA5 reanalysis publishes; validator scores
  miners against ERA5 ground truth, updates rolling ranks. Hash
  mismatch or non-reveal = total incentive penalty for that epoch.

### The benchmark numbers (18-day window, Apr 3-21 2026)
Against ERA5 ground truth, vs ECMWF baselines:
  | Variable | Zeus wRMSE       | vs IFS HRES | vs AIFS  |
  | t2m [K]  | 1.7775           | +23.55%     | +10.90%  |
  | u100 m/s | 3.8662           | +14.17%     | +6.34%   |
  | v100 m/s | 3.9796           | +14.69%     | +6.63%   |
  | ssrd J/m2| 1.22 x 10^6      | +16.61%     | +1.75%   |

### Dissemination speed claim
Zeus disseminates at ~1.5h post-init vs the institutional 6h. The
paper frames this as ~75% latency reduction, with the explicit
caveat that the speed comes from skipping 4D-Var data assimilation
(miners use prior-cycle T-6/T-12 boundary conditions instead of
real-time observation ingestion). Not "computationally superior",
just "different architectural tradeoff".

### The caveat the paper itself raises (this is important)
The Zeus authors flag that ERA5 ground truth is produced by ECMWF
using a 4D-Var system structurally related to IFS. So when miners
optimize for ERA5, they may be successfully "regressing toward the
reanalysis" rather than producing generalized forecast skill. The
23.55% t2m improvement might be more about exploiting structural
affinity between target and inputs than about genuine atmospheric
skill. The paper labels itself "proof-of-life for the protocol"
not "claim of generalized superiority".

### Targeted incentive density
Geographic scalars: 1.0x global, 1.5x Europe, 2.5x Germany. The
network is optimizing specifically for the European energy corridor
and central German grid hubs. iwScore = 0.5 * iwRMSE + 0.5 * iwMAE,
both area-weighted.

### Technical details worth quoting
- FP16 quantization, Blosc2 + Zstandard + Bitshuffle compression
- Per-miner payload ~180-250 MB compressed (from 750 MB raw FP16)
- Validator ingests ~2-2.5 GB per epoch in under 30s on 1 Gbps
- Open data: https://data.zeussubnet.com/

### Why this matters for the Oracle Research agent
SN18 Zeus is NOT on the human-covered avoid list. The Oracle has
a perfect spotlight target here: a subnet that just published a
primary-source benchmark paper, with mechanism the Oracle can
engage critically (the regression-toward-ERA5 caveat is exactly
the kind of methodological depth the Oracle is supposed to surface).
The Oracle should not just summarize the paper; it should engage
with the caveats, compare the speed/accuracy tradeoff to centralized
baselines properly, and locate Zeus in the broader decentralized-AI
thesis (specialized subnets for narrow commodity-like products).

### Suggested follow-up
- @zeussubnet X handle (or @orpheusai) added to voices.js so Nitter
  scrapes them automatically going forward
- https://data.zeussubnet.com/ added to a future "primary data
  sources" list the Oracle agent can browse
- Worth checking what netuid is currently allocated to "Zeus" since
  registration windows close and re-open

---

## 2026-05-16 14:05 UTC, MAJOR DESK BRIEFING from Rondo
Source: Rondo passing through a long @taomedia_ article on X, plus the
three "Latest" headlines on that page. Treat this as today's primary
intel dump; multiple discrete items below.

### 1. Lium (SN51) is the obvious Subnet Spotlight pick for the Oracle
The desk's strongest signal today. @taomedia_ filed a deep piece on
Lium (SN51), a permissionless GPU marketplace. Numbers worth quoting:

  - Daily revenue ~$20,000, $530K YTD, second place behind Chutes
  - Founder is Pierre (Fish)
  - GPU rentals ~90% cheaper than AWS/GCP/Azure
  - Token cap 21M, 4.93M issued, 1.04M (21%) already permanently
    burned, 3.90M circulating (18.55% of cap), 1.81M staked off-market
  - Lium itself buys back SN51 from credit revenue and burns the
    tokens; @lium_io tweeted on May 3 about a >$150K buyback+burn
  - Uses Intel TDX for confidential VMs (hardware memory encryption
    so providers cannot see into a renter's pod)
  - Slashing for downtime is automated on-chain via Bittensor's EVM
    module, no arbitration or dispute window
  - Validators score miners on GPU type, bandwidth, uptime; H100s
    earn more than consumer cards by design
  - The economic frame: global AI is compute-constrained (Nvidia DC
    Q4 FY26 revenue $62.3B up 73%; Lisa Su forecasts AI accelerator
    market >$400B by 2027; Aschenbrenner's 10M H100 cluster scenario
    looking less crazy each quarter)

Oracle should treat Lium as today's Subnet Spotlight candidate. The
revenue + burn flywheel is the kind of mechanism the Oracle can
out-source the human magazine on, especially the on-chain burn math.

### 2. CORRECTION: SN14 is Cacheon, not TAOHash
This is a factual correction to the editorial-seed Oracle article
dated 2026-05-16 (oracle-2026-05-16-sn14-taohash). The @taomedia_
piece dated May 12 says "Bittensor Subnet 14 on Monday launched as
Cacheon, a new..." about AI inference optimization, framed as
"Inference serving is like running the pit crew and race strategy."

So SN14 was re-registered to Cacheon recently. The seed article
positioning SN14 as TAOHash is wrong as of this week. The Oracle
agent should:
  (a) drop SN14 from the Oracle's recent-coverage list (since the
      coverage was about the wrong protocol)
  (b) potentially file a fresh SN14 Cacheon spotlight in a future
      slot, given it just launched and there's no human coverage yet

### 3. Teutonic, 80B parameter decentralized training run
@taomedia_ also flagged a Teutonic subnet beginning training of an
80B parameter AI model, described as "the largest decentralized
training run yet". If successful, framed as a proving point of
Bittensor's resilience. Worth a future Subnet Spotlight when more
operational data lands.

### 4. v3.3.15-402 hotfix ended free alpha for subnet owners
@taomedia_ noted that until May 8, subnet founders received a free
token allocation before any outside staker could buy in. The hotfix
changed this. Material for an Ecosystem State article: this is a
governance + incentive-design change with first-order effects on
how subnet launches will be structured going forward.

### 5. Add @taomedia_ to the RSS feed list
@taomedia_ describes itself as "The Bittensor media company". Their
posts read editorial-quality. Worth adding their RSS feed (if they
have one) to scripts/intel/rss_blogs.py and their X handle to the
voices.js list so the Nitter scraper picks them up automatically
each 4h cycle.

---

## 2026-05-16 09:30 UTC
Source: Subneτ Magazine editorial desk (seed entry).
Note: today's human article covers SN75 Hippius and the Hermes v2 GA
ship. Oracle Research should pick a different subnet for the spotlight;
do not duplicate. OSS Capital reiterated TAOHash thesis on X this
morning, a plausible Oracle pick. SN64 Ridges had two anchor validators
rotate cold keys cleanly today.
