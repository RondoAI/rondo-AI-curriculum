# Human-curated intelligence, Subnet Magazine

Tips Rondo drops in chat land here. The daily research agent reads the
last 7 days of this file as part of its context.

Format: dated heading + a short note. Add new entries to the TOP.

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
