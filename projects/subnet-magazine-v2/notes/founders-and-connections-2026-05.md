# Founders + Connections · Bittensor Top 25 · May 2026

A research brief for Subnet Magazine v2. The thesis: every other site
treats subnets as standalone projects. They are not. Beneath the
public surface runs a tight founder graph, a small set of investors
quietly compounding positions, a recognizable diaspora from the
frontier labs, and a single founding circle from which most of the
network is two degrees of separation or fewer.

This document is the first defensible map of that graph.

---

## Methodology + caveats

Sources are public. WebSearch and WebFetch passes across founder
LinkedIns, parent-company sites, GitHub orgs, podcast appearances
(Bittensor Guru, Proof of Talk, blocmates, Ventura Labs, Bittensor
Journey), and reporting from The Block, Fortune, CoinDesk, Messari,
OAK Research, The Defiant, SiliconANGLE, BetaKit, TechCrunch, and the
Yuma "State of Bittensor Vol. 2" report. Where a single source is
the entire claim, the text says "reportedly" or "per the company's
own statement." Where I could not get a defensible second source for
a name, I say so and leave the slot blank rather than fabricate.

Specific cautions, by name:

- **Yuma Rao** is pseudonymous, listed as a 2021 whitepaper co-author
  alongside Steeves, Shaabana, Daniel Attevelt, and McAteer. I do
  not attempt to dox; I treat the handle as the handle.
- **"Const"** is Jacob Robert Steeves and has publicly confirmed
  this. "Unconst," "ShibShib"/"shibshib89" is Ala Shaabana, also
  publicly confirmed. "Teknium" remains pseudonymous and I respect
  the pseudonym.
- **Rayon Labs founders** publicly use the handles namoray, sangar,
  and carro. I have not surfaced full legal names from public
  sources; the text uses the handles.
- **Hippius / The Nerve Lab** team members beyond CTO Chris Hobel
  are not consistently named on public pages. Mog and Dubs are
  community contributors who present on podcasts; whether either is
  a founder is unclear.
- **Datura AI / Lium** is publicly led by "Fish" (handle
  @fish_datura, Medium @surcyf). Whether "Pierre" is the legal first
  name is referenced in one external post and not by the founder
  themself; I omit it.

Two corrections to the seed dataset, surfaced during research, that
the magazine should make:

1. The seed file's SN14 row reads `Palaidn` for "entity resolution."
   The live SN14 was acquired by Latent Holdings in April 2025 and
   re-launched as TAOHash, a Bitcoin hashrate-rental subnet. The
   bios file already reflects this; subnets.js does not yet.
2. The seed file's SN18 row reads `Cortex.t / Corcel`. The slot was
   sold by mogmachine and fish_datura to Ørpheus AI in early 2025
   and is now Zeus, a climate-forecasting subnet. The bios file
   already reflects this; subnets.js does not yet.

---

## Phase 1 · Founder profiles

Ordered to match the top-25 emission ranking in `subnet-bios.js`.

### SN64 · Chutes · Rayon Labs

The serverless inference layer. Rayon Labs is operated under the
handles **namoray** (lead, public face), **sangar**, and **carro**.
The team is anonymous-but-known: namoray has done long-form podcast
interviews (blocmates with Barry Silbert, OAK Research), runs the
@rayon_labs X account, and is widely treated by Messari and OAK as
the operating leader of the trio. Legal names are not publicly
attached to the handles, and the team has explicitly declined to
de-anonymize. Rayon was incubated as a Bittensor-native shop in
2024; per Messari and OAK Research, it now controls roughly 23.7%
of daily τ emissions across Chutes (SN64), Gradients (SN56), and
Nineteen (SN19) — the single most consequential operator group on
the network. Reported infrastructure: ~500 H100s under management,
~$3M/month inference revenue, 9.1T tokens served cumulatively
through Q1 2026. The "didn't see this before" hook: Rayon Labs has
no Series A. There is no traditional VC funding round on record for
the operator that controls almost a quarter of the entire network's
emissions; all of its capital is internal τ flow plus what Barry
Silbert/DCG and others stake into its subnets, which means the
operating economics are pure-protocol, not VC-subsidized.
*Confidence: high on operational scale; medium on team identity
because handles are intentional.*

### SN56 · Gradients · Rayon Labs

Same operator team — namoray, sangar, carro. Gradients is the
no-code finetuning layer that runs on Chutes for compute. Architecturally,
Rayon owns the inference layer (SN64), the training layer (SN56), and
the latency-critical serving layer (SN19) as a stack — that vertical
integration is the moat. The "didn't see this before" hook: Gradients
customers training 118B-parameter models for ~$5/hour aren't paying
that price because Rayon discovered free compute. They're paying that
price because the τ emission subsidy underwrites the marginal cost of
the underlying Chutes inference. SN56 is, in effect, a loss-led
acquisition channel for SN64.

### SN4 · Targon · Manifold Labs

CEO is **Robert "Rob" Myers**, founding Bittensor contributor and
former Senior Software Engineer at the Opentensor Foundation. Per his
LinkedIn and the Manifold company page, Myers is a "founding Bittensor
contributor, miner and subnet designer" who left Opentensor to start
Manifold. COO is **James Woodman**, formerly COO of the Opentensor
Foundation itself. Funding lineage is the cleanest in the network:
Manifold closed a $10.5M Series A in August 2025, led by **OSS Capital
(Joseph Jacks)** — the largest VC investment in any Bittensor subnet
to date. The "didn't see this before" hook: Manifold's two senior
leaders together represent the entire former senior operating bench
of the Opentensor Foundation outside Const and Shaabana — and their
Series A is led by the same Joseph Jacks who runs Latent Holdings,
which owns SN14 TAOHash. The intra-Bittensor capital cycle is more
concentrated than the public surface suggests.

### SN3 · Templar · Covenant AI / community-rebuilt

Founder is **Samuel "Sam" B. Dare**, who founded Covenant AI in
January 2024 and led the training of Covenant-72B (March 2026), the
largest decentralized LLM training run on record at the time. On
April 9, 2026 Dare publicly exited Bittensor citing "decentralization
theatre," accusing Const of suspending emissions and selling tokens
into the conflict; community miners rebuilt SN3 within days from the
open-source `tplr-ai` repo, now operating as Teutonic without central
operator coordination. The "didn't see this before" hook: Sam Dare's
LinkedIn lists his location as UAE; the founder of what was, until
April, Bittensor's flagship pretraining subnet has been geographically
detached from the Bay Area / NYC / London cluster that runs most of
the rest of the network. His public exit also reveals the
network's first major founder-vs-founder rupture, between Dare and
Const.

### SN51 · Lium · Datura AI

Founder is **"Fish" (@fish_datura on X, @surcyf on Medium)**, a
prolific Bittensor miner-turned-operator who previously held the SN18
slot (then "Cortex.t") and sold it to Ørpheus AI in early 2025 before
focusing Datura on what is now Lium (formerly Celium). Lium is
reported as the highest-revenue subnet on Bittensor at roughly
$432K/month in GPU rental fees as of April 2026, with paid rental
demand exceeding the τ emission subsidy — the rarest milestone in
the network. The "didn't see this before" hook: the same operator
who built and sold SN18 to a climate-forecasting team is now the
quiet revenue leader at SN51 — Fish/Datura has executed the only
clean subnet-to-subnet pivot in the network, and the new subnet is
the only one whose external revenue meaningfully exceeds its
emission subsidy.

### SN14 · TAOHash · Latent Holdings

CEO is **Joseph Jacks** ("JJ"), publicly identified as the operator
of Latent Holdings and the founder/GP of **OSS Capital**, the
open-source-focused VC firm he founded in 2018. Latent acquired the
SN14 slot in April 2025 and relaunched it as TAOHash — a BTC
hashrate-rental subnet whose payout system (TIDES, dual BTC + α)
ties Bitcoin miner economics directly to TAO. The "didn't see this
before" hook: Joseph Jacks is the most concentrated single
person-of-influence in Bittensor by a wide margin. He simultaneously
(a) operates SN14 via Latent, (b) led the largest Series A in any
subnet (Manifold's $10.5M for SN4 Targon) through OSS Capital,
(c) is an advisor to TAO Synergies (a public-company TAO treasury
play, ticker TAOX), and (d) reportedly holds personal TAO positions
through OSS. He is also publicly endorsing the SN3 Templar narrative
post-Covenant exit — he is a known supporter of Sam Dare's framing.
That puts JJ across operator, investor, advisor, and treasury seats
simultaneously — the network's quietest, broadest position.

### SN8 · PTN · Taoshi

Founder and CEO is **Arrash Yasavolian**, based in the SF Bay Area,
UC Davis biochem-to-tech transition, ~15 years in tech. He previously
founded TARVIS Labs, an algorithmic trading shop that was acquired
by Taoshi in 2024 — meaning he effectively acqui-hired himself into
the founder role. Taoshi launched Glitch Financial (consumer trading
platform) as a subsidiary in 2024, with Hyperscaled (Hyperliquid
integration) targeted for March 31, 2026. The "didn't see this
before" hook: Taoshi's $30M+ "rewards pool" is the largest
emission-funded prop-firm equivalent on Earth, and Yasavolian has
publicly stated he intends to outbid centralized firms like FTMO and
Topstep by paying out τ before any client capital is risked — a
funding model that exists nowhere else and is structurally only
possible inside Bittensor.

### SN5 · OpenKaito · Kaito AI

Founder/CEO is **Yu Hu**. Background is exceptionally clean and
external to crypto: Cambridge University, Deutsche Bank investment
banking analyst (2014-2017), then **Citadel** in London managing a
long/short European-and-US equities portfolio (2017-2022). Left
Citadel to start Kaito in 2022 from Seattle, now operating from
Singapore. The "didn't see this before" hook: Yu Hu is, by a wide
margin, the most TradFi-pedigreed founder in the entire Bittensor
top 25 — Citadel is the highest-prestige systematic hedge fund in
the world, and his presence in the network is the single strongest
signal that institutional quant talent considers decentralized AI a
real opportunity. KAITO has its own L1 token outside τ, which makes
Kaito the only top-25 operator whose primary equity isn't TAO —
SN5 is a wedge into Bittensor, not the company's home base.

### SN19 · Nineteen · Rayon Labs

Same Rayon Labs operator team — namoray (publicly the lead on SN19
specifically), sangar, carro. Nineteen holds the public world record
for fastest open-source LLM serving (originally set late 2024,
defended through 2026 against Groq, Cerebras, SambaNova on
equivalent hardware). The "didn't see this before" hook: namoray
has the longest individual operator track record on Bittensor in the
top emission cohort — they were a top miner before becoming a
subnet operator, and SN19's latency obsession comes directly from
miner-side experience optimizing inference for adversarial
validation. The miner-to-operator pipeline is a real career path on
Bittensor and namoray is its prototype.

### SN120 · Affine · Affine Foundation

Founder is **Jacob Robert Steeves ("Const")** — Bittensor co-founder,
former Opentensor CEO who stepped down in 2025 to "build in the
trenches again." Affine is Const's own subnet, a coordination layer
that runs RL competitions across program synthesis, math, code, and
structured-output tasks, pulling models from other subnets and
graduating improvements back. Sits in Project Rubicon's first
Base-chain liquid-staking cohort of 17 subnet tokens. The "didn't
see this before" hook: Const choosing to build Affine on top of the
network he founded is the single sharpest statement of his post-CEO
worldview — Affine is structurally parasitic on every other subnet
in a way no other subnet is, and Const built it deliberately to
become so. The network's founder is now also one of its operators.

### SN62 · Ridges · Ridges AI

Founder is **"Shak"** (Bittensor Guru S2E11 host name; full legal
name not consistently surfaced in public sources). Per podcast
appearances, prior experience at Twitter/X and at "Superbase" (likely
Supabase, per Bittensor123 profile). Ridges launched as "Agentao" and
rebranded in 2025; SWE-bench scores reportedly rose from 4% to 41%
in a single week of competitive miner pressure and reached 66.8%
through late 2025. The "didn't see this before" hook: Ridges is the
only top-25 subnet whose founder claims a Twitter engineering
background, which matters because the product target — Claude Code /
Cursor at $2-5/day instead of $50/seat — is a consumer-tooling play
that benefits directly from social-graph familiarity. Shak is also
unusually direct about commercial intent on podcasts in a network
that mostly hides revenue numbers.

### SN1 · Apex · Macrocosmos

Co-founders are **Will Squires** (CEO) and **Steffen Cruz** (CTO).
Squires's prior career is the outlier in the entire ecosystem —
infrastructure engineer who worked on Crossrail and HS2 (two of the
largest UK civil-engineering projects ever) and sat on the Mayor of
London's infrastructure advisory panel. Cruz holds a PhD in
subatomic physics from the University of British Columbia and was
the former **CTO of the Opentensor Foundation** and the original
architect of SN1's codebase. The "didn't see this before" hook:
Squires and Cruz are publicly "long-time friends" — Macrocosmos is
not a chance startup, it is a deliberate continuation of work Cruz
was already doing inside Opentensor, with a Crossrail-grade
infrastructure operator brought in as the business co-founder.
That combination — frontier-physics scientist plus megaproject
engineer — does not exist elsewhere in this network.

### SN44 · Score · Score Technologies

Co-founders are **Tim Kalic** (CTO, Bournemouth University, sports
tech / Web3 / ecommerce background per LinkedIn) and **Nigel Grant**
(CSO, listed as CRO/Co-founder of the affiliated SIRE betting-analysis
project per ICM Analytics). Score's commercial wedge is Reading FC
(UK Championship football club) plus a "newly signed deal with a
major European petroleum company" per the Macrocosmos/Score
partnership announcement. The "didn't see this before" hook: Score
signed a data partnership with SN13 Data Universe in Q1 2026 — the
first publicly disclosed customer relationship between two top-25
subnets (Macrocosmos selling, Score buying), which is the prototype
for the inter-subnet B2B economy. SIRE, ICM-Analytics's AI sports
betting brand, lists Nigel Grant on its team — meaning Score has a
direct line into the betting analytics market without owning the
betting brand outright.

### SN13 · Data Universe · Macrocosmos

Same Macrocosmos team — Squires (CEO), Cruz (CTO). Per Macrocosmos's
own substack, **Brian McCrindle** (MASc, McMaster Electrical and
Computer Engineering / Computer Vision; formerly ML Researcher at
Opentensor) is the founding engineer and subnet lead for both SN13
and SN25. Per Macrocosmos's team page on linkedin.com/company/macrocosmosai,
the team now numbers ~24 people. The "didn't see this before" hook:
the three Macrocosmos subnets (SN1, SN9, SN13, SN25) are operated
by the only team in the network where every senior person came out
of Opentensor itself — Cruz was CTO, McCrindle was an ML researcher,
and the cluster is effectively an Opentensor alumni shop running
four critical subnets in parallel.

### SN39 · Basilica · Covenant AI / community-rebuilt

Founded by **Sam Dare** as part of Covenant AI's three-subnet bet;
deprecated April 9, 2026 alongside SN3 and SN81; rebuilt by
community miners within days. The "didn't see this before" hook:
the Basilica architecture (agent-native ephemeral sandboxed compute)
is the most direct competitive overlap with Rayon's Chutes anywhere
on the network — and the operator who built it is the same one who
publicly attacked Const, while Const's own SN120 Affine implicitly
depends on Chutes for compute. The architecture and the politics
align: Basilica was the subnet Const had the strongest structural
reason to want suppressed.

### SN81 · Grail · Covenant AI / community-rebuilt

Same Sam Dare founder bench as SN3 and SN39; same April 9, 2026
deprecation; same community restart. Grail's RL post-training
counterpart structure to SN3 Templar makes the Covenant trio a
deliberate vertically-integrated pretraining → post-training → agent
stack, all under one founder, now all running without him.

### SN68 · NOVA · Metanova Labs

Founder and CEO is **Micaela Bazo**, self-described "crypto investor
since 2011" with a stated mission to "connect emerging scientific
talent south of the equator with global capital markets." Per the
Metanova Labs site, the technical co-founder is **Dr. Pedro Penna**
(referenced in Subnet Magazine's own October 2025 interview tweet —
the magazine has already done a primary-source interview with the
team). The "didn't see this before" hook: Bazo is the only top-25
founder whose stated investor-track record predates Bittensor by
more than a decade, and Metanova's deliberate "south of the equator"
framing positions it as the only top-25 subnet with an explicit
Global South research-talent thesis. The DiaGen AI joint venture
(announced 2025) is a B2B drug-discovery automation play with a
biotech partner outside crypto — one of the cleanest cross-industry
deals any subnet has signed.

### SN75 · Hippius · The Nerve Lab

CTO is **Chris Hobel** (Substrate / decentralized-storage background,
deep Bittensor community roots, per community.hippius.com and the
team page). The operating shop is "The Nerve Lab," GitHub org
`thenervelab`, original repo codename "The Brain." Mog and Dubs
(handles) are active podcast presenters but the founder/employee
distinction isn't clean on the public surface. The "didn't see this
before" hook: Hippius is the only top-25 subnet that runs its own
Substrate chain bridged to Bittensor rather than living purely on
Bittensor — architecturally it is a sibling-chain that pays through
the SN75 emission, which gives it dual-token economics no other
subnet has and lets the team build sovereign-cloud features (BABE
consensus, NPoS) that Bittensor itself doesn't support.

### SN10 · Sturdy · Sturdy Finance

Founder and CEO is **Sam Forman**, Stanford math + CS dropout (2021),
prior internships at McKinsey, TuSimple, Kasisto, and The College
Board, plus a Montclair State undergrad cryptography research role
from 2016-2018. The "didn't see this before" hook: Forman is the
only top-25 founder whose existing DeFi protocol (Sturdy Finance,
$125M+ allocated deposits) predates his Bittensor subnet — meaning
SN10 is the only top-25 subnet where the parent company already
had real on-chain TVL before the subnet launched. The Morpho /
Gauntlet integration plugs Bittensor-graded strategies into a top-3
EVM lending protocol, which is the most consequential DeFi-Bittensor
bridge in production. Forman is also publicly the founder of TaoFi,
which positions him at the intersection of DeFi lending and TAO
infrastructure unlike anyone else in the top 25.

### SN34 · BitMind · BitMind AI

Founder and CEO is **Ken Jon Miyachi**, UCSD CS, San Diego
Supercomputer Center research, then Amazon (SDE II), Polymer Labs,
and **NEAR Foundation** (senior tech lead / senior software engineer).
Currently based in Austin. Per Crowdfund Insider and Invezz, BitMind
raised $750K led by **Canonical Crypto** with **NEAR Foundation**
participating — the NEAR connection is direct, not coincidental.
The "didn't see this before" hook: Miyachi is the only top-25 founder
with a documented senior engineering history at a non-EVM L1
foundation (NEAR), and the BitMind deepfake-detection product is the
only top-25 subnet that won a Coinbase Developer Platform hackathon
prize (Best Infrastructure, Feb 2025) — meaning BitMind is the only
top-25 subnet with explicit cross-ecosystem validation from a major
US-listed crypto company. The GAS architecture (detector vs generator
adversarial loop) is also the only subnet design that strengthens
as the rest of the AI market produces better synthesis models.

### SN9 · IOTA · Macrocosmos

Same Macrocosmos team — Squires (CEO), Cruz (CTO), McCrindle
(founding engineer / subnet lead on the science side). IOTA is the
rebuild of the old SN9 from-scratch pretraining bake-off into a
cooperative pipeline-parallel training cluster. The "didn't see this
before" hook: IOTA and SN3 Templar are direct architectural rivals
on the same problem (decentralized internet-wide pretraining), and
the Templar-team founder (Sam Dare) publicly exited the network in
April 2026 — leaving Macrocosmos's IOTA as the only mainline
decentralized-pretraining program with operator continuity. Const's
SparseLoCo gradient-compression algorithm (used by Templar) and
Macrocosmos's IOTA orchestration architecture are now de facto
competitors with completely different governance situations.

### SN25 · Mainframe · Macrocosmos

Same Macrocosmos team; subnet lead is **Brian McCrindle**, who runs
both SN13 and SN25 per Macrocosmos's substack. SN25 is the original
DeSci subnet (formerly "Protein Folding"), now branded Mainframe,
and runs MD simulations into a partnership with **Rowan Scientific**
for next-generation neural network potentials (NNPs). The "didn't
see this before" hook: the Rowan partnership is the first commercial
ML-data sale from a Bittensor subnet into a non-crypto-native
scientific software vendor — Rowan is an established chemistry-ML
shop, not a crypto company, and they're buying Mainframe simulations
as NNP training data. That is the cleanest "decentralized HPC
sold into commercial ML" arrangement currently in production
anywhere in the network.

### SN18 · Zeus · Ørpheus AI B.V.

Per orpheus-ai.nl, Ørpheus AI is a Dutch B.V. registered in the
Netherlands. The team is described as "combining hands-on Bittensor
experience with deep domain expertise from leading academic
institutions" in climate science. Specific founder names are not
prominently listed on the public site — a gap in our research. The
slot was sold to Ørpheus AI by **mogmachine and fish_datura** (Datura
AI's Fish — same operator as SN51 Lium) in early 2025; that
acquisition is the single sale of a subnet slot between top-25
operators that we've been able to document. The "didn't see this
before" hook: Zeus benchmarks directly against **GraphCast** (Google
DeepMind), **Pangu-Weather** (Huawei), and **Aurora** (Microsoft) —
making it the only top-25 subnet whose listed competitors are
frontier-lab papers rather than other crypto products. The Copernicus
ERA5 dataset spine ties Zeus to EU public science infrastructure in
a way no other subnet does.

### SN6 · Nous (Numinous) · Nous Research

Co-founders are **Jeffrey Quesnelle**, **Karan Malhotra**, **Teknium**
(pseudonymous, ex-Stability AI), and **Shivani Mitra**. **Bowen Peng**
is a founding developer (YaRN paper, DeMo decoupled-momentum
optimization). Malhotra's prior role was Machine Learning Researcher
at the **Stanford Brain Stimulation Lab**, with an Emory religion /
philosophy undergrad. Nous Research closed a $50M Series A in April
2025 led by **Paradigm** (Fred Ehrsam + Matt Huang), valuing the
company at $1B with token alignment; prior backers include
**Distributed Global**, **Delphi Digital**, **Hack VC**, **North
Island Ventures**, plus angels including **Vipul Reddy (Together AI
CEO)**, **Raj Gokal (Solana co-founder)**, **Balaji Srinivasan**, and
**OSS Capital (Joseph Jacks again)**. The "didn't see this before"
hook: Nous Research is by far the most VC-backed operator in the
top 25, and Paradigm's involvement gives it the deepest non-crypto AI
credibility — Paradigm normally invests in Fred Ehrsam-shaped crypto
deals, not open-model labs, and the $1B valuation makes Nous the
single highest-valued company tied to a top-25 subnet, ahead of even
Manifold and Macrocosmos.

### SN2 · DSperse · Inference Labs

Co-founders are **Ronald Chan** and **Colin Gagich**, based in
**Hamilton, Ontario, Canada** (not Toronto as is sometimes reported).
**Dan and Hudson** are senior team members who appear publicly on
the Bittensor Guru podcast for SN2 episodes. Inference Labs raised
a reported **$2.3M pre-seed** per BetaKit. SN2 (formerly Omron, now
DSperse) is the largest decentralized zkML proving cluster in
production with 300M+ proofs generated through Q1 2026. The "didn't
see this before" hook: Inference Labs is the only top-25 operator
based in mid-sized Canada (Hamilton, ON), and the team has built a
parallel non-Bittensor product — Sertn AVS on EigenLayer — that
generates revenue outside the τ subsidy. That EigenLayer integration
makes Inference Labs the only top-25 operator with a direct
restaking-economy exposure in addition to Bittensor.

---

## Phase 2 · Cross-subnet patterns

### The shared-history graph

These are pairs of subnets whose founders worked together before
Bittensor, or where one founder previously held a slot the other now
owns. All edges below are publicly defensible.

1. **SN1 / SN9 / SN13 / SN25 (all Macrocosmos)** — same team, four
   subnets. Squires + Cruz co-founded the operator in March 2024.
   Cruz was CTO of the **Opentensor Foundation** and the original
   architect of SN1's codebase. McCrindle was an ML researcher at
   Opentensor and is the founding subnet engineer on SN13 and SN25.
   This is the network's only four-subnet operator cluster.

2. **SN4 Targon ↔ Opentensor Foundation** — Robert Myers (Manifold
   CEO) was Senior Software Engineer at Opentensor. James Woodman
   (Manifold COO) was COO of Opentensor. The entire senior bench of
   Manifold is ex-Opentensor.

3. **SN64 / SN56 / SN19 (Rayon Labs trio)** — same operator team
   (namoray, sangar, carro). No documented pre-Bittensor work
   history surfaced publicly; the trio is intentionally Bittensor-
   native.

4. **SN3 / SN39 / SN81 (former Covenant trio)** — same Sam Dare
   founder until April 9, 2026; all three deprecated simultaneously
   in the Covenant exit; all three restarted by community within
   days. Architectural lineage is now intact but operator continuity
   is broken — a unique configuration in the network.

5. **SN51 Lium ↔ SN18 Zeus** — the SN18 slot was sold by Datura's
   Fish (now operating SN51) to Ørpheus AI. This is the only
   publicly documented subnet-slot sale between top-25 operators.

6. **SN44 Score ↔ SN13 Data Universe** — Q1 2026 data partnership
   where Score is a paying downstream customer of Data Universe.
   The first publicly disclosed inter-top-25-subnet B2B contract.

7. **SN10 Sturdy ↔ SN10 (TaoFi)** — Sam Forman is also publicly the
   founder of TaoFi, a separate TAO-DeFi project, meaning the SN10
   operator runs adjacent DeFi infrastructure outside Bittensor.

8. **SN120 Affine ↔ Opentensor founding circle** — Const himself
   operates SN120. There is no closer founder relationship than
   "is the founder."

9. **SN1/9/13/25 Macrocosmos ↔ SN3 Templar (now community)** —
   architectural rivals on decentralized pretraining, both
   originally seeded by Opentensor alumni, now in different
   governance configurations.

10. **SN5 OpenKaito ↔ Kaito AI external product** — SN5 is a
    Bittensor wedge for an externally funded ($120M+ raised across
    multiple rounds per public coverage), centralized Kaito AI
    product. Unique in the top 25: the parent company is bigger
    than the subnet.

### The investor concentration map

I attempted to track every public position from each major crypto VC
into each top-25 parent company. Confidence is high only where a
funding round is publicly reported.

- **DCG / Yuma (Barry Silbert)** — accelerated subnets per yumaai.com
  include **Swap, Numinous (SN6 Nous), Score (SN44), Gopher, and
  Dippy** (Dippy AI runs SN11 + SN58, outside top 25 in pure
  emission but historically large). DCG is the single largest TAO
  treasury holder. **Five+ public Bittensor positions across the
  top 25 cohort.**
- **OSS Capital (Joseph Jacks)** — led Manifold's $10.5M Series A
  (SN4 Targon), participated in **Nous Research seed (SN6)**, and
  the OSS principal directly operates SN14 TAOHash via Latent
  Holdings. **Three top-25 positions plus operator role plus public
  Const-critic posture.** Quietest and broadest.
- **Polychain Capital (Olaf Carlson-Wee)** — incubated Bittensor
  itself in 2019, holds ~$200M in TAO directly. Per April 2026
  reporting, Polychain added another $200M of TAO exposure in Q1.
  Polychain's specific subnet positions are not publicly disclosed,
  but its TAO-level position is by far the largest.
- **Paradigm (Fred Ehrsam, Matt Huang)** — led Nous Research's $50M
  Series A in April 2025. **One top-25 position, but the highest-
  prestige round in the cohort.**
- **Distributed Global** — Nous Research seed and Series A.
  Reported as one of the early Bittensor-thesis funds. **At least
  one top-25 position confirmed; broader exposure likely but not
  publicly itemized.**
- **Delphi Digital** — Nous Research seed and Series A. Single
  public top-25 position.
- **Hack VC** — Nous Research Series A. Single public top-25
  position.
- **North Island Ventures** — Nous Research seed and Series A.
  Single public top-25 position.
- **Canonical Crypto** — led BitMind's $750K seed (SN34). Single
  public top-25 position.
- **NEAR Foundation** — participated in BitMind's seed. Strategic /
  not VC; relevant because Miyachi was NEAR senior tech lead.
- **dao5 (Tekin Salimi, ex-Polychain)** — reported ~$50M TAO
  position. Subnet-level positions not publicly disclosed.

**a16z crypto, Pantera, Variant, Foundry** — no top-25 subnet-parent
funding round under their names surfaced in this research pass.
Pantera is publicly described as an "early TAO backer" but specific
subnet positions are not disclosed. **If a16z, Variant, or Foundry
have subnet-parent positions, they are not public.**

### The frontier-lab diaspora

Researchers who left frontier AI labs to build on Bittensor. This
list is conservative.

- **Jacob Steeves (Const)** — ex-**Google** (software engineer, late
  2016 to April 2018; press coverage references Google Brain
  proximity; his own LinkedIn says "Software Engineer, Google"). SN120
  Affine; Bittensor co-founder.
- **Teknium (Nous Research, SN6)** — ex-**Stability AI**. Built much
  of the early Hermes line.
- **Karan Malhotra (Nous Research, SN6)** — ex-**Stanford Brain
  Stimulation Lab** (ML researcher). Academic adjacency to a
  Stanford lab rather than to a frontier industry lab.
- **Steffen Cruz (Macrocosmos, SN1/9/13/25)** — ex-**Opentensor
  Foundation CTO**. Cruz is the rare case where the "frontier lab"
  is Opentensor itself.
- **Robert Myers, James Woodman (Manifold, SN4)** — both ex-
  **Opentensor**, same caveat.
- **Brian McCrindle (Macrocosmos, SN13/SN25)** — ex-**Opentensor
  ML Researcher**.

**Notable absence:** I found no top-25 subnet founder with a
documented prior senior role at **OpenAI, Anthropic, DeepMind, Meta
FAIR, or Google Brain proper** (Const's Google role appears to have
been pre-Brain or adjacent). The frontier-lab diaspora into Bittensor
is, as of May 2026, predominantly an **Opentensor-internal
diaspora** rather than an external one. This is itself a finding —
the network has not yet attracted a wave of senior departures from
Anthropic/OpenAI/DeepMind.

### Academic clusters

- **University of British Columbia (physics)** — Steffen Cruz
  (Macrocosmos CTO). Singular.
- **Stanford (math/CS)** — Sam Forman (Sturdy, SN10). Dropout.
- **Stanford Brain Stimulation Lab** — Karan Malhotra (Nous, SN6).
  ML researcher role (not PhD).
- **UCSD CS + San Diego Supercomputer Center** — Ken Jon Miyachi
  (BitMind, SN34).
- **University of Cambridge** — Yu Hu (Kaito, SN5).
- **UC Davis (biochem to tech)** — Arrash Yasavolian (Taoshi, SN8).
- **Simon Fraser University (Vancouver, math/CS)** — Const (SN120,
  network founder).
- **McMaster University (Electrical and Computer Engineering /
  Computer Vision MASc)** — Brian McCrindle (Macrocosmos SN13/SN25).
- **Bournemouth University** — Tim Kalic (Score, SN44).
- **Emory University (religion/philosophy undergrad)** — Karan
  Malhotra.

There is **no PhD-advisor lineage cluster** visible in the top 25.
Unlike academic ML communities (Hinton/Bengio/LeCun lineages, the
Stanford NLP group, Tsinghua KEG, etc.), Bittensor's top operators
are predominantly bachelor's-level or self-taught-plus-industry,
not academic-trained. The exception is Cruz (subatomic physics PhD,
UBC) who is also the only ex-Opentensor-CTO.

### Geographic concentration

- **Austin, Texas** — Manifold Labs (Rob Myers, James Woodman),
  BitMind (Ken Miyachi). The single densest US cluster.
- **San Francisco Bay Area** — Taoshi (Arrash Yasavolian), Nous
  Research (per Paradigm reporting), Sturdy Finance (Sam Forman).
- **London / UK** — Macrocosmos (Squires's Crossrail/HS2 history
  ties him to London; Macrocosmos UK presence via LinkedIn).
- **Cambridge / UK academic spine** — Yu Hu (Kaito).
- **Singapore** — Yu Hu (Kaito, currently).
- **Netherlands** — Ørpheus AI (SN18 Zeus), registered as a B.V.
- **Hamilton, Ontario, Canada** — Inference Labs (SN2). The only
  Canadian operator in the top 25.
- **Peru** — Jacob Steeves (Const) per his IQ.wiki bio.
- **UAE** — Sam Dare (Templar founder, per LinkedIn).
- **Latin America (stated thesis)** — Metanova Labs (SN68), via
  Bazo's stated "south of the equator" mission.

The network's **center of gravity is the US Bay Area + Austin axis**,
with a meaningful London/Cambridge minority and notable individual
outliers in Peru, UAE, the Netherlands, and Singapore. The cluster
that doesn't yet exist visibly: **East Asia**. Despite Bittensor
reporting (ChainCatcher) noting Chinese teams in the top 3 of some
historical rankings, no top-25 subnet in the May 2026 emission
cohort is publicly operated by a China-based team.

### Two degrees from Yuma

By definition, **Yuma Rao is pseudonymous** and listed alongside
Steeves and Shaabana as a 2021 whitepaper co-author. I treat
"degrees from Yuma" as "degrees from the Steeves / Shaabana /
Opentensor founding circle" since that is the publicly verifiable
core.

**Zero degrees (operator is Const/Shaabana themselves or directly
ran Opentensor):**
- SN120 Affine — operated by Const directly.
- SN1 / SN9 / SN13 / SN25 Macrocosmos — Cruz was Opentensor CTO.
- SN4 Targon — Myers and Woodman are both ex-Opentensor.

**One degree (operator worked directly with the Opentensor
founding circle / Const):**
- SN64 / SN56 / SN19 Rayon Labs — namoray has appeared in podcasts
  with Const and is publicly aligned with the Opentensor governance
  bloc through the 2026 disputes.
- SN3 / SN39 / SN81 Covenant subnets — Sam Dare engaged in extended
  public dispute with Const, which is itself a documented
  relationship.
- SN51 Lium / Datura — Fish previously held the SN18 slot, sold it
  on, and has been a long-standing Bittensor miner / operator
  visible across the founding circle's communications.
- SN5 OpenKaito — Kaito's integration was negotiated with the
  Opentensor Foundation; Const has publicly acknowledged the
  partnership.

**Two degrees (separated through one operator who is themselves
within one degree):**
- SN8 PTN — Yasavolian engages publicly through Rayon-adjacent and
  Yuma channels.
- SN10 Sturdy — Sam Forman is in the Yuma-accelerated cohort.
- SN6 Nous — Yuma-accelerated as "Numinous"; Nous senior team has
  appeared with Const at conferences.
- SN44 Score — Yuma-accelerated; data-partnered with Macrocosmos.
- SN68 NOVA — Subnet Magazine's own October 2025 interview with
  Bazo demonstrates direct line; Yuma adjacency.
- SN34 BitMind — Yuma-accelerated cohort presence.
- SN75 Hippius — community-presented through Bittensor podcast
  network (Bittensor Guru, A Bittensor Journey).
- SN2 Inference Labs — Colin Gagich has done multiple Bittensor
  Guru episodes.
- SN18 Zeus — purchased the slot from a known Bittensor operator
  (Fish/Datura).
- SN14 TAOHash — JJ is publicly aligned through OSS Capital and
  Latent Holdings.
- SN62 Ridges — Shak presents through Bittensor Guru and Talking
  Tao podcasts.

**The defensible finding: every single top-25 subnet founder in
May 2026 is within two degrees of the original Steeves/Shaabana/
Opentensor founding circle.** There is no top-25 subnet operated by
a team that has no public connection to the founding circle.

### Quiet conflicts of interest

- **Joseph Jacks (Latent Holdings / OSS Capital)** is simultaneously
  (a) operator of SN14 TAOHash, (b) lead investor in SN4 Manifold,
  (c) seed investor in SN6 Nous, (d) advisor to TAO Synergies
  (NASDAQ:TAOX, a public-company TAO treasury), and (e) a publicly
  visible Const-critic supporter of Sam Dare. He is in operator,
  investor, advisor, and treasury seats simultaneously.
- **Const (Jacob Steeves)** is simultaneously (a) Bittensor
  co-founder, (b) operator of SN120 Affine, and (c) until 2025 the
  CEO of the Opentensor Foundation that sets the rules under which
  his own subnet operates. His structural position is unique in the
  network.
- **Barry Silbert / DCG / Yuma** is simultaneously (a) the largest
  institutional TAO treasury holder, (b) the operator of Yuma Asset
  Management's two flagship funds ($10M anchor) which include
  subnet-token exposure, (c) the accelerator of the Yuma-accelerated
  subnets (Numinous, Score, Dippy, Swap, Gopher), and (d) the
  publisher of "State of Bittensor" — the network's most-cited
  research artifact, written by an entity that holds the largest
  position in the network it covers.
- **Macrocosmos** operates four top-25 subnets (SN1, SN9, SN13,
  SN25) where SN13 sells data into SN44 Score, SN9 competes with
  SN3 Templar architecturally, and SN25 supplies an external NNP
  partner (Rowan). This is the network's largest single-team
  position by subnet count.
- **Fish / Datura** previously held SN18, sold it, now operates
  SN51 Lium — the only operator to have run two top-25 subnets
  sequentially via a slot sale.
- **Subnet Magazine itself** — disclosure: the magazine has done a
  primary-source interview with Metanova Labs (SN68). That access
  doesn't bias the data above but should be acknowledged when SN68
  is covered editorially.

---

## Phase 3 · Suggested "Connections" visualisation for the site

The story this data tells is **a graph of operators, investors,
and prior employers**, not a market of independent subnets. The
magazine should commit to a flagship visualization that exposes
this graph and lets the reader walk it. Three options, in order of
defensibility against the data we currently have:

### Recommendation 1 (ship now): "Six Degrees of Const" table

A single sortable HTML table, one row per top-25 subnet. Columns:
netuid, subnet, parent, founder(s), degrees-from-Const, the
specific chain (e.g., "Cruz was Opentensor CTO under Const →
Macrocosmos SN1"), key investor, notable hook.

Why first: it's the most legible artifact, exposes the central
claim ("every top-25 subnet is ≤2 degrees from the founding
circle") immediately, requires no graph engine, and renders on
mobile. Every cell is defensible against a public source listed in
`founders.js`.

### Recommendation 2 (Q3 2026): Force-directed graph at /network

Three node types: **subnets** (sized by daily emission), **operators**
(sized by total emission across all their subnets), **investors**
(sized by total dollar amount across all public Bittensor positions).
Edges: operator → subnet (operational), investor → operator
(funded), operator → operator (shared-history, e.g., Cruz/Myers ex-
Opentensor). Click any node to filter the rest of the network to its
neighborhood. Drag-to-rearrange supported.

Why second: defensible only once `FOUNDER_EDGES` has at least ~40
edges with high confidence, which it does as of this commit. The
graph engine (three.js or react-force-graph-3d, both already
discussed in the ecosystem-deep-dive) is real engineering work and
should follow Recommendation 1 ship.

### Recommendation 3 (Q4 2026): Investor concentration sankey

A full-width Sankey diagram, left to right: **investors → parent
companies → subnets → categories (text/vision/agents/...)**.
Width of each band proportional to dollars (where public) or to
emission share (where dollars aren't disclosed). This is the
clearest visual answer to the "who quietly owns Bittensor"
question.

Why third: it requires the most curation labor (every dollar
amount must be primary-sourced or omitted) and is more useful as
an annual / quarterly publishing artifact than as a live page —
it should live in the "State of dTAO" quarterly long-read pipeline
proposed in the ecosystem-deep-dive's Phase 3.

### Editorial wrapper

Every founder profile page should carry a small inline footer:
**"Two degrees from Const through: [chain]"**. The footer makes
the graph claim concrete on every subnet page, ties the magazine's
editorial voice to a single defensible thesis, and gives readers
a reason to click into adjacent subnet pages — the magazine's
internal-link graph reinforces the founder graph.

The thesis the magazine should defend, in one sentence: **Bittensor
is not a hundred independent subnets, it is one founding circle, a
dozen operators, and five investors.** Every other site renders the
market; only the magazine renders the network.
