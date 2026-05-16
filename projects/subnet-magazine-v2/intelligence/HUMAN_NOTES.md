# Human-curated intelligence, Subnet Magazine

Tips Rondo drops in chat land here. The daily research agent reads the
last 7 days of this file as part of its context.

Format: dated heading + a short note. Add new entries to the TOP.

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
