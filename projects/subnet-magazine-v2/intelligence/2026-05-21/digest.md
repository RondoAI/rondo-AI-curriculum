# Intelligence Digest, 2026-05-21

_Single-file briefing for the daily research agent. Sources listed in trust order: human-curated notes first, then objective (github), then editorial (RSS), then volume (X via Nitter)._


## ⊕ HUMAN-CURATED NOTES, last 7 days

## 2026-05-16 19:40 UTC, TIER-1 EXTERNAL PRIMARY SOURCE from Rondo, SemiAnalysis "AI Value Capture: The Shift to Model Labs"
Source: Rondo passed a SemiAnalysis newsletter article (May 1 2026)
by Daniel Nishball, Dylan Patel, Cheang Kang Wen, +6 others, with
guest Crystal Huang. Preserved at:
  intelligence/_primary_sources/2026-05-01-semianalysis-ai-value-capture-shift-to-model-labs.md

### Why this is qualitatively different from prior tips
SemiAnalysis is the most-cited semiconductor + AI infrastructure
publication in the industry. Dylan Patel is the most respected AI
analyst writing today. Their work is read across Nvidia, the
hyperscalers, the major hedge funds, the frontier labs. When
SemiAnalysis publishes a piece on AI value capture, the whole
analyst world re-prices.

THIS PIECE DOES NOT MENTION BITTENSOR. The Oracle should treat that
omission as itself information: the most rigorous analyst publication
on AI compute does not yet see decentralized compute networks as
material to where value accrues in the stack. Whether the omission
is correct (decentralized AI is too small to matter today) or an
oversight (decentralized AI is actually the structural answer to
the pricing-power problem SemiAnalysis documents) is the live
question. The Oracle has a strong synthesis angle here.

### The thesis (cleanest summary)
Agentic AI has shifted value capture from infrastructure providers
(2023-2025) to AI labs (2026+). Anthropic ARR went from $9B to
$44B+ YTD. Gross margins on inference: 38% to 70%. Token prices
have permanently re-rated. Nvidia and TSMC are leaving value on
the table by not fully repricing to scarcity, partly because of
antitrust risk. Open-source frontier models (Kimi K2.6, GLM) are
not yet pressuring closed-source pricing.

### Verbatim quotes worth using
> "Agentic AI has crossed a real inflection point, driving a
> step-change in the value of tokens while software improvements
> have sharply reduced the cost of generating them."

> "The age of low gross margins for frontier model providers is
> over. Real agentic AI has permanently increased the market-
> clearing price per token, and there's no going back."

> "Compute constraints means that no single frontier lab will be
> able to serve the entire market."

> Kimi K2.6 ($0.95/$4) "exerts very little downward pressure on
> Opus pricing" and "open-source models are still noticeably
> worse than their closed source counterparts for real knowledge
> work."

### The numbers worth quoting (cross-checked against today's tips)
  - Anthropic: $9B to $44B+ ARR YTD 2026, inference margins 38 to 70 percent
  - SemiAnalysis's own annualized token spend: $10.95M (30 percent of payroll)
  - Some SemiAnalysis team members run 100B+ tokens/month
  - Opus 4.7 on agentic tasks: blended $0.99 per million tokens
  - Cache hit rates: 90%+
  - Blackwell vs Hopper: 30x more tokens per second YoY
  - GB300 NVL72: 17x throughput over H100 in FP8, 32x in FP4
  - H100 1-year rental pricing up 40% from October 2025 low
  - Memory pricing up 6x in past year
  - SOCAMM contract (1Q26): ~$8/GB; exit 2026 estimated >$13/GB
  - VR NVL72 cost-based minimum rental: $4.92/hr per GPU (5y, 15% prepay, 15.6% IRR)
  - VR NVL72 value-based ceiling: $9.63 to $12.25/hr per GPU
  - N3 wafer utilization expected >100% in 2H 2026
  - DRAM fabs already >90% utilization

### CROSS-CHECK against today's Lium SN51 B300 stock screenshot
This is the critical fact-check the Oracle should run on the
morning's @taomedia_ Lium claim:

  - Lium screenshot: 8x B300 SXM6 AC spot at $47.92/hr = $5.99/hr per B300
  - SemiAnalysis cost-based minimum (VR NVL72, one gen beyond): $4.92/hr per GPU
  - Lium spot is roughly 22 percent above SemiAnalysis cost-based minimum
  - SemiAnalysis value-based ceiling: $9.63 to $12.25/hr per GPU
  - Lium spot is 38 to 51 percent below value-based ceiling
  - @taomedia_ "approximately 90 percent cheaper than hyperscalers" framing
    is plausible ONLY when measured against hyperscaler list pricing for
    B300 specifically (commonly $15-30/hr where available). Lium is 60 to 80
    percent off that band. Against SemiAnalysis's value-based ceiling, the
    discount is closer to 50 percent. The Oracle should hedge the 90 percent
    claim accordingly.

### The intellectual angle the Oracle has now
SemiAnalysis says open-source can't catch up "any time soon" and that
Kimi K2.6 exerts "very little downward pressure" on closed-source
pricing. Today's intel pool documents three Bittensor teams betting
the opposite:
  - Jon Durbin's Parallax (Chutes SN64) explicitly aims at "GLM-5.1
    or Kimi-K2.6 quality runnable on a single H200"
  - Connito (whitepaper today) proposes sparse-target-expert
    decentralized MoE training with Proof-of-Loss incentive
  - Templar (SN3, Covenant AI) already trained a 72B parameter
    model with 70+ contributors on home GPUs

The Oracle's strongest synthesis angle for tomorrow:
"SemiAnalysis says the open-source gap won't close any time soon.
Three Bittensor teams are betting it can. Here is the mechanism
each is proposing and how to handicap their odds."

### Memory pricing follow-up worth flagging
SemiAnalysis says memory pricing is up 6x YoY and SOCAMM exits 2026
above $13/GB. Lium's 8x B300 pods have ~2TB RAM each. If memory
prices continue to climb, Lium's $5.99/hr spot pricing is exposed
to a component-cost increase. Worth modeling whether the Helsinki
provider is locking in low-cost memory inventory before the price
moves, OR whether the spot pricing tier will need to widen by mid-
2026. Either outcome is a Spotlight-worthy datapoint.

### Suggested follow-up automation
- SemiAnalysis is NOT a Bittensor publication but should be on the
  magazine's macro-context watch list. Adding @SemiAnalysis_ to
  voices.js as a media tracker (placeholder X handle).
- Dylan Patel as the lead analyst is the single most influential
  voice in AI compute analysis. If Bittensor ever wants on his
  radar, his X handle is where the seeding happens. Adding
  @dylan522p as a voice.

### For the Oracle: editorial discipline note
The Oracle should NOT cite SemiAnalysis as a source for any Bittensor
claim (they do not cover Bittensor). The Oracle SHOULD cite SemiAnalysis
for any macro-context claim about Anthropic ARR, GPU economics,
memory pricing, TSMC capacity, or hyperscaler pricing power. Get the
attribution right; this is exactly the kind of cross-publication
sourcing the zero-fake-news discipline in the system prompt is
designed to enforce.

---

## 2026-05-16 19:20 UTC, PRIMARY SOURCE from Rondo, Manifold's Subnet Signal "Conviction Will Be Quiet"
Source: Rondo passed through the full text of The Subnet Signal
newsletter post by Viraj Sahu / Manifold Labs, May 15 2026:
"Conviction Will Be Quiet". Preserved at:
  intelligence/_primary_sources/2026-05-15-manifold-subnet-signal-conviction-will-be-quiet.md

### Publishing context worth knowing
The Subnet Signal is published by Manifold Labs. SAME team that
builds Targon (SN4) and co-authored the Intel TDX paper. So
Manifold is simultaneously a subnet operator, an academic-paper
co-author, AND a media publisher. The desk should treat coverage
of OTHER subnets as professional, but read coverage of competing
decentralized compute layers with awareness that Manifold is a
positioned voice in that segment.

### What we learn about Conviction mechanically
This is the cleanest available walkthrough of the new Conviction
mechanism that came out of the post-Templar/Sam Dare governance
response. The mechanics:

  - Applies ONLY to subnets more than one year old
  - Challenger must accumulate 10% of stake AT CURRENT PRICES,
    lock it publicly for two months before anything begins
  - Lock is VISIBLE immediately, giving the owner two months of
    warning
  - Challenger score asymptotes from zero toward locked amount,
    climbs slowly over months
  - Owner can match the lock at any time using the owner key and
    instantly register full conviction (no delay, no EMA)
  - Other holders can pool conviction behind the owner, widening
    the gap further
  - The challenger's months of public commitment can be undone in
    a single owner move
  - A challenge succeeds ONLY if the owner cannot afford to match
    the lock

### Const's framing on the record
Per the article: "Const described conviction as a defensive tool
during Thursday's call, meant to help teams guard against nefarious
or spurious attacks. He never framed it as a competitive market.
The design matches that intent."

### The author's thesis (cleanest one-sentence summary)
> "Conviction is likely to change the network more by preventing
> contests than by producing them."

### The companion mechanism: the TAO flow tweak
A second mechanism shipping alongside Conviction that the desk had
not previously named:
> "Once chain subsidy is subtracted from net flow, subnets without
> real underlying activity lose their emission share."
Both mechanisms target the same population: subnets where ownership
outlasted the team's active involvement because the old rules never
forced a transfer. Conviction clears the seat; the flow tweak
starves emission to the same struggling subnets. Coordinated
governance response.

### CRITICAL EARLIER-EVENT FACT I had not logged
The newsletter references its own Feb 20 2026 post:
  "Truly Open Intelligence: By the People, For the People"
  Subtitle: "Bittensor's governance transition begins as Const
  steps down as CEO of Opentensor Foundation (OTF). Manifold
  covers what's next."

CONST STEPPED DOWN AS CEO OF OTF in February 2026. This is a major
ecosystem fact the desk did not have. Const remains protocol
co-founder and is now also operating as a subnet founder (Affine
SN120). The voices.js Const entry must be updated to reflect this
transition; the desk should NOT keep framing him as 'current OTF
leader'.

Worth chasing the full Feb 20 Subnet Signal post for governance
transition detail.

### FIVE NEW SUBNETS surfaced in the briefs (none previously in
voices.js)

  Compelle (SN82)  Structured debates between AI models for higher-
                   quality outputs. Mainnet May 8, took over slot
                   same day after Hermes was deregistered. 4,700
                   debate games in week one.
  MVTRX (SN79)     DEX infra for dTAO trading optimized for AI
                   agents. Validator upgrade expanded simulation
                   capacity to 128 parallel books. Adding live
                   Observe Mode, 3D order-book visualization, UID
                   relationship explorer.
  Harnyx (SN67)    "Deep research as a commodity". Miners compete
                   to produce traceable research reports faster and
                   cheaper than expert analysis. Agent economy
                   infrastructure layer. Waitlist open.
  Ditto (SN118)    Persistent memory + knowledge graph for AI
                   agents. Up 128 percent on the week. Already
                   powering OpenClaw via MCP with 700+ users.
                   Recent slot takeover + open-source launch.
  Bitsec.ai (SN60) AI bug-finding for code and smart contracts.
                   Up 23 percent on the week.
  NIOME (SN55)     Biology data + AI for drug discovery and
                   personalized medicine. Up 22 percent on the
                   week. New Scottish government partnership +
                   upcoming summit.
  Babelbit (SN59)  Translation infrastructure. Up 22 percent on
                   the week.

(Seven total but Bitsec.ai + Babelbit + NIOME share the same brief
format so I am counting them as one chunk for editorial purposes.)

### CONFIRMS earlier intel
  - Cacheon (SN14) rebrand from Taohash, mainnet May 19, gained
    37 percent on the week. Corroborates the @taomedia_ tip from
    earlier today.
  - Oro (SN15) "largest open agent competition" framing consistent
    with WallStreetBets thesis.

### Suggested follow-up automation
  - Add the seven new subnets to voices.js (Compelle, MVTRX, Harnyx,
    Ditto, NIOME, Babelbit, Bitsec) so the Nitter scraper picks
    them up
  - Update Const's voices.js entry to reflect Feb 2026 OTF CEO
    departure
  - Add Viraj Sahu as a voice (Manifold Labs operator, Subnet
    Signal author)
  - The Subnet Signal back-catalog has at least three more posts
    worth retrieving (Feb 13 "Bittensor's Latest Miners aren't
    Human", Feb 20 Const stepping down, Mar 20 "The Internet Just
    Became An AI Lab")

### For the Oracle agent
This article is high-leverage primary source material. The Conviction
mechanism walkthrough is the cleanest in the ecosystem. The desk
should treat this as the canonical citation for any Oracle article
that touches post-Templar governance changes. The "TAO flow tweak"
mechanism is new naming; the Oracle should reference it carefully
and ideally cross-check against on-chain emission data before
asserting how it scores.

The Const-stepped-down-as-OTF-CEO fact is the more important
ecosystem context. Any future Oracle article that frames Const as
a current OTF executive will be WRONG by four months. Update the
voices.js entry tonight.

---

## 2026-05-16 19:00 UTC, FLAGSHIP PRIMARY SOURCE from Rondo, the Intel x Manifold Labs joint TDX paper
Source: Rondo passed through the FULL TEXT of the Intel community
blog post by Sathi Nair (Intel Employee), Mar 17 2026:
"Decentralized Compute on Untrusted Hardware Using Intel TDX and
Encrypted CVMs". Preserved verbatim at:
  intelligence/_primary_sources/2026-03-17-intel-manifold-tdx-decentralized-compute-paper.md

This is the SINGLE MOST IMPORTANT PRIMARY SOURCE we have logged
today. Multiple earlier tips (the @taomedia_ Targon article, the
WallStreetBets thesis) referenced "the Intel paper" without
providing it. Now the magazine has the actual document.

### Why this changes the desk's read on Targon (SN4)
This is a Big Tech enterprise (Intel) publishing on its own
official community blog a joint technical paper with a Bittensor
subnet (Targon / Manifold Labs / SN4). The authors are:
  - Manifold Labs: Venish Patidar, Dhruv Bindra, Ahmed Darwich,
    Josh Brown
  - Intel: Haidong Xia, Sathi Nair

This is the highest-tier enterprise validation any Bittensor
subnet has received to date. The earlier @taomedia_ framing
("Intel does not casually co-author technical papers with crypto
projects, and this is a big signal of upcoming wider adoption")
is correct, but now the desk has the document to anchor it.

### The CEO quote on the record (most valuable artifact today)
Robert Myers, CEO of Manifold Labs, in the Intel paper:

> "The primary challenge in building the Targon Virtual Machine
> was ensuring confidential computation across untrusted operators
> (hardware providers) without sacrificing performance. We require
> strong hardware-rooted isolation and portable attestation that
> could integrate directly into our network's validation logic.
> Intel TDX enables secure VM isolation with minimal overhead,
> while Intel Trust Authority provides verifiable remote attestation
> that can be embedded into validator workflows. This combination
> allows us to establish strong trust assurances at the protocol
> level rather than relying on operator reputation."

The closing phrase "establish strong trust assurances at the
protocol level rather than relying on operator reputation" is the
cleanest one-sentence summary of why decentralized confidential
compute matters as a category. The Oracle should treat this as
the cornerstone quote for any Targon spotlight.

### The technical architecture is specified in 5 layers
1. HARDWARE: 5th/6th Gen Xeon (Emerald/Granite Rapids) + Hopper
   H100/H200 + Blackwell B200
2. CVM PROVISIONING: Targon Image Gateway clones golden Ubuntu
   24.04 image, encrypts QCOW2 with per-VM disk key, registers
   key with Intel ITA Key Broker Service (KBS), pre-records
   expected TDX measurement
3. ATTESTATION: Manifold Attestation Agent in initramfs collects
   TDX measurement registers + generates quote, validators
   collect quotes + forward to KBS + to Intel Trust Authority
   for verification. UNIFIED ATTESTATION = NVIDIA nvtrust report
   embedded in the user data field of the Intel TDX quote (this
   is novel; both CPU and GPU attestation in one cryptographic
   proof)
4. INCENTIVE: Targon's Tower service distributes weights, on-chain
   stake-weighted consensus pays providers
5. ORCHESTRATION: WireGuard mesh + Kubernetes control plane,
   only continuously attested CVMs admitted to the scheduling pool

### Specific quantitative facts to quote
- Re-attestation cadence: every block interval (~72 minutes)
- Every attestation round is challenge-response with validator
  nonces to prevent replay
- IP-based binding: first successful attestation locks the CVM
  to the hardware provider's network identity; subsequent
  attestations must originate from the same IP
- IF the IP changes, the VM is "permanently inaccessible" and
  the provider must request a new VM
- Per-VM disk encryption with KBS-released keys
- Base image: hardened Ubuntu 24.04 with NVIDIA drivers
- GPU mode: Protected PCIe (PPCIe)
- Firmware: TDX-compatible OVMF

### The threat model is fully specified (this is rare in subnet docs)
The paper assumes a STRONG adaptive adversary with full physical
control of the host, can manipulate OS/hypervisor/BIOS/firmware,
can clone/replay/migrate VM images, can observe all network
traffic, can collude. The system enforces 5 security properties
(confidentiality, integrity, authenticity, non-migratability,
continuous trust). The mitigation table is the cleanest available
summary of how each in-scope attack is countered, with explicit
out-of-scope items (Intel/NVIDIA root key compromise, DOS).

### The strategic positioning the paper articulates
"This architecture from Manifold Labs makes premium, enterprise-
grade compute accessible at a fraction of the traditional cost."
The frame: Targon competes with centralized cloud confidential VMs
(AWS, Azure) on price AND on transparency, while matching them on
the actual security guarantees through hardware-rooted attestation
rather than vendor trust.

### How this slots into the broader pool
Today the desk has now received:
  - Lium (SN51) GPU marketplace screenshot: ~$5.99/hr B300 spot,
    218 pods, ~1,744 GPUs available, NOT confidential-compute-
    focused
  - Targon / Manifold (SN4) Intel TDX paper: confidential-compute-
    focused, Intel + NVIDIA TEE stack, attestation-grade trust

These are NOT direct competitors. They are different LAYERS of
the same decentralized-compute market:
  - Lium: raw GPU access at lowest price
  - Targon: confidential-compute-verified GPU access for sensitive
    workloads (training data, model weights, regulated data)
Worth synthesizing in any Ecosystem State article.

### What this gives the Oracle
The Targon Spotlight that now becomes writable:
  1. Open with "Intel published a joint paper" frame and the
     CEO quote
  2. Walk the 5-layer architecture with the unified-attestation
     mechanism as the technical centerpiece
  3. Walk the threat model and mitigation table verbatim (most
     subnets do not have one, this differentiates Targon)
  4. Contrast with Lium SN51 as the price-focused alternative
     in the same decentralized GPU market
  5. Note the future-work commitment ("a user-facing approach
     for independently verifying CVM execution state") as the
     watchable next step

This is a 2,000-word Spotlight target with verbatim quotes from
the CEO, primary architectural detail, and a quantitative threat
model. None of this is in the human magazine's coverage yet.

### Voices.js update needed
Targon (@TargonCompute) bio significantly expanded with the Intel
paper context. Robert Myers (Manifold CEO) added as a dedicated
voice. The other Manifold Labs paper authors flagged for future
voice additions if their X handles can be confirmed.

---

## 2026-05-16 18:40 UTC, PRIMARY SOURCE from Rondo, Manako Q1 product launch (Jan 22 2026)
Source: Rondo passed through the @webuildscore Jan 22 X post
"Introducing Manako: Build with Vision". Preserved at:
  intelligence/_primary_sources/2026-01-22-score-sn44-manako-product-launch-announcement.md

This is the MISSING MIDDLE LAYER in the Score / Manako / PwC stack.
The desk now has all three layers cleanly preserved as primary
sources:
  - MECHANISM: TurboVision miner docs (how miners compute, weight
    table, schema)
  - PRODUCT:   this Manako launch (how outputs become a
    conversational interface)
  - SALES:     PwC France recap (how the product distributes via
    Big Four channels)

Plus the active rollout signal: the cricket-balltrack starter pack
URL (still PENDING SCREENSHOT) that shows the pipeline is currently
shipping new elements into the catalog.

### What Manako actually is (from the launch announcement)
Manako is the product layer that wraps Score (SN44) for non-ML
users. The team's framing: "What once required expert teams and
major resources will soon be available through simple conversation
with Manako." Direct analog: Manako is to computer vision what
Cursor / Copilot are to software, with Score's decentralized miner
network as the engine producing the building blocks.

### The architecture (this is the explicit explanation we were missing)
Three layers stated by the team:
  1. CURATED LIBRARY of vision components, continuously enriched
     by Score subnet competitions
  2. AI ORCHESTRATOR that interprets user intent, assembles vision
     components into an execution graph, optimizes the pipeline
  3. SIMPLE, STABLE DEVELOPER INTERFACES: users interact only with
     outcomes and endpoints; internal complexity is abstracted

The load-bearing sentence the desk has been working without:
> "The Score subnet continuously enriches this ecosystem through
> ongoing competitions, delivering new computer vision models that
> expand Manako's capabilities over time."

This explains the manifest-driven challenge architecture Tim
described in the Apr 16 PwC Spaces. Every Score private-track
challenge that produces a winning model becomes a new building
block in Manako's curated library. The subnet is R&D; Manako is
the consumer-facing composer.

### The timeline this resolves
- ~Aug 2025: 8-month PwC due diligence begins
- Jan 22 2026: Manako product launch announced, waitlist opens
- Q1 2026 (Jan-Mar): first version of Manako launches with limited
  user access
- Apr 16 2026: PwC France & Maghreb alliance signed and announced
- May 16 2026: cricket-balltrack starter pack visible in /upcoming
  on the console (the rollout continues)
- Coming weeks: PwC global blockchain community pitch (per Apr 16
  alpha) takes Score/Manako to all 136 PwC territories

So Manako shipped first as a self-serve product, the PwC deal landed
3 months later as the enterprise distribution channel. The two-sided
go-to-market (top-down PwC + bottom-up developers) is now visible
in the timing.

### How this resolves the cricket-balltrack starter pack mystery
The PENDING SCREENSHOT entry from 18:25 asked what the
manak0-element-cricket-balltrack-starter-pack page actually shows.
With Manako's architecture now explicit, the high-confidence answer:

The "starter pack" is the **miner-side onboarding bundle** for a
new vision component that Manako will expose to users. The
cricket-balltrack element will become a building block in Manako's
curated library; the starter pack lowers time-to-first-submission
for miners competing for that component's rewards. Two-sided:
  - Miner side: starter pack = template repo + sample data +
    Docker scaffolding for cricket-balltrack (what the console
    URL likely shows)
  - Manako user side: cricket-balltrack appears as a callable
    capability in the Manako interface ("track this cricket
    delivery's speed and bounce position")

A screenshot would still confirm exact contents, but the structural
purpose is clear.

### The synthesis the Oracle can now write
With all three Score primary sources in the vault plus the WSB
thesis context, the Oracle agent has material for a 1,500-2,000
word Subnet Spotlight that walks all four layers in one piece:
  1. MECHANISM (TurboVision miner docs, weight table)
  2. PRODUCT (this Manako launch, three architectural principles)
  3. SALES CHANNEL (PwC France recap with Jean-Thomas Ledoré
     verbatim, 136-country scaling)
  4. ACTIVE ROLLOUT (cricket-balltrack starter pack in /upcoming)

None of these layers have been synthesized in one place by the
human magazine. The Oracle should treat this as the single highest-
leverage opportunity today to demonstrate the "out-research the
human magazine" framing the system prompt demands.

### Voices.js update needed
The @manakoai entry currently says it's Score's product layer with
the "billion cameras" pitch. Adding the Q1 launch date, the
conversational-interface framing, and the three architectural
principles will give the Oracle better context to generate
spotlights without re-reading the full thread.

---

## 2026-05-16 18:25 UTC, PENDING SCREENSHOT from Rondo, Score Vision console "cricket balltrack starter pack"
Source: Rondo passed the URL:
  https://console.scorevision.io/upcoming/manak0-element-cricket-balltrack-starter-pack

The desk could not extract the page content server-side. The console
is a JavaScript-rendered single-page app (Tailwind shell with a
"manako" color palette in the inline config, but the actual starter-
pack data loads via JS after auth). curl + WebFetch both return the
empty shell. No Open Graph meta, no JSON-LD, no preload data, no
public API endpoint at the obvious guesses.

### What the URL tells us by inference alone
- Hosted on console.scorevision.io (Score's operational dashboard,
  distinct from theredteam.io / scorevision.io brand domains)
- Path "/upcoming/..." signals this is a NOT-YET-LIVE element on the
  subnet. Worth tracking the launch date when it lands.
- "manak0" is likely a typo / slug-friendly spelling of "Manako"
  (Score's enterprise product layer, per today's 18:10 Score logs)
- "element" matches the terminology from the TurboVision miner docs:
  Score's private track is organized into ELEMENTS, where each
  element has a single ground-truth type. Existing elements:
  football (soccer_action) and cricket (cricket_delivery). This
  page is a NEW cricket element specifically focused on
  ball-tracking.
- "balltrack" is the operational name for what the TurboVision
  cricket schema already produces: {kph, bounce_x, stump_y}. So
  this starter pack likely concretizes a new cricket-balltrack-
  specialist element on top of (or replacing) the current
  cricket_delivery scoring.
- "starter pack" is novel naming. Probable contents (inference from
  the term and from how the team has shipped other elements):
    - Template miner repo with the right schema preset
    - Sample challenge inputs (small video clips)
    - Sample ground-truth files
    - Possibly a small pretrained baseline model
    - Container scaffolding (Dockerfile, deployment script)
  Goal: lower the time-to-first-submission for miners onboarding
  to a new element.

### Why this matters even without the page contents
This is direct evidence that Score is shipping a new private-track
element AHEAD of the broader rollout PwC's global blockchain
community pitch will trigger. The cadence matters: Score is
populating the catalog of enterprise-ready computer-vision elements
in advance of distribution scaling. Cricket ball-tracking is also
notable because cricket has a defined commercial buyer set
(broadcasters, coaching staff, sportsbook data feeds) where the
output schema {kph, bounce_x, stump_y} maps directly to existing
product surfaces.

### What I need from Rondo to log this fully
A screenshot of the rendered page would let me extract:
  - The starter pack's actual contents (model weights? sample data?
    code template? Docker image tag?)
  - Launch date for the new element
  - Any miner registration / eligibility criteria
  - Pricing or emission allocation for the new element
  - Whether this replaces or supplements the current cricket_delivery
    element

Asking explicitly. If Rondo can drop a screenshot the next time he
has the page open, the desk can convert this PENDING SCREENSHOT
entry into a full primary-source log alongside the TurboVision miner
docs and the PwC alliance recap from earlier today.

For now, leaving this as a watchlist item the next Oracle agent run
can include as "Score is shipping a new cricket-balltrack private
element, likely a Manako-branded vertical, currently in /upcoming
on the console" with appropriate hedging.

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

## ⊕ MACRO BACKDROP via SEMIANALYSIS, 12 most recent posts

_SemiAnalysis is the most-cited semiconductor and AI infrastructure publication in the industry. They do NOT cover Bittensor. The Oracle uses this corpus for any claim about hyperscaler compute, GPU economics, datacenter power, foundry capacity, memory pricing, lab unit economics. DO NOT cite SemiAnalysis for any Bittensor-specific claim. Full archive (289 posts, May 2020 onwards) lives at `intelligence/_external_sources/semianalysis/` with an `INDEX.md` table of contents. Paywalled posts show only subtitle + free preview; free posts have the full body extracted._

### 2026-05-13 · Cerebras — Faster Tokens Please
_OpenAI and AWS Partnerships, Tokenomics Explainer, Architecture Deep Dive, Datacenter Ramp, Technical Roadmap_

- **Authors:** ["Myron Xie", "Jordan Nanos", "Max Kan", "Cam Quilici", "Tanj Bennett", "Ivan Chiam", "Louis Lu", "Zane Fong", "Gerald W
- **Access:** paid-preview
- **URL:** https://newsletter.semianalysis.com/p/cerebras-faster-tokens-please
- **Corpus file:** `intelligence/_external_sources/semianalysis/2026-05-13-cerebras-faster-tokens-please.md`

> It’s been nearly 5 years since Dylan [wrote a dedicated article about Cerebras in June of 2021](https://newsletter.semianalysis.com/p/cerebras-wafer-scale-hardware-crushes) for the newsletter. He shipped 4 articles in 2 days! How times have changed.  One of the other things that has changed is Cerebras’s fortunes. With the arrival of fast tokens on the mainstage and a 750MW compute deal with OpenAI notched, Cerebras is feeling ready for the scrutiny of public markets. Up until just 6 months ago,

### 2026-05-12 · The EDA Primer: From RTL to Silicon
_Laying the Groundwork of the Current Chip Design Paradigm_

- **Authors:** ["Gerald Wong", "Dylan Patel", "Sravan Kundojjala"]
- **Access:** paid-preview
- **URL:** https://newsletter.semianalysis.com/p/the-eda-primer-from-rtl-to-silicon
- **Corpus file:** `intelligence/_external_sources/semianalysis/2026-05-12-the-eda-primer-from-rtl-to-silicon.md`

> AI demand has been driving the explosion in compute over the past few years, resulting in chip designs getting ever more complex, with silicon area and power per package seeing continued growth as designs push for even greater performance. With each successive generation, new process nodes with more design rules and restrictions further increase chip design costs.  At the same time, the rush to bring compute into the market as quickly as possible has put design teams under immense pressure to co

### 2026-05-01 · AI Value Capture - The Shift To Model Labs
_Vera Rubin VR NVL72: V for Value - Rubin delivers a step jump in performance per TCO. ROI accruing to users, Neoclouds, Hyperscalers, AI Labs, Memory Vendors or GPU Manufacturers?_

- **Authors:** ["Daniel Nishball", "Dylan Patel", "Cheang Kang Wen", "Crystal Huang", "Max Kan", "Ray Wang", "Myron Xie", "Zane Fong", 
- **Access:** paid-preview
- **URL:** https://newsletter.semianalysis.com/p/ai-value-capture-the-shift-to-model
- **Corpus file:** `intelligence/_external_sources/semianalysis/2026-05-01-ai-value-capture-the-shift-to-model.md`

> A day in AI now feels like a year in any other industry. Model releases, software breakthroughs, and hardware improvements are compressing multi-year cycles for any other industry into weeks. Over just the past few months, agentic AI has crossed a real inflection point, driving a step-change in the value of tokens while software and hardware improvements have sharply reduced the cost of generating them.  This flood of demand is driven by end users enjoying a huge return on investment (ROI) from

### 2026-04-24 · The Coding Assistant Breakdown: More Tokens Please
_Hands On With GPT 5.5, Opus 4.7, DeepSeek V4, Why Benchmarks Are Bad, and Who’s Going To Win_

- **Authors:** ["Max Kan", "Jordan Nanos", "Samuel Kruse", "Crystal Huang", "Sam Harshe", "Dylan Patel", "Doug"]
- **Access:** paid-preview
- **URL:** https://newsletter.semianalysis.com/p/the-coding-assistant-breakdown-more
- **Corpus file:** `intelligence/_external_sources/semianalysis/2026-04-24-the-coding-assistant-breakdown-more.md`

> Since we called out the [Claude Code inflection point](https://newsletter.semianalysis.com/p/claude-code-is-the-inflection-point) on February 5th, we have seen a flurry of model releases. Opus, Mythos, Codex, Gemini, DeepSeek, Kimi, Qwen, GLM, MiniMax, Composer, Muse Spark, and more. Today we will break down all of these major model releases, explain when you can vs can’t trust the benchmarks, and give our predictions for the future of the agentic coding market.  First we have to highlight GPT-5

### 2026-04-20 · How Much Do GPU Clusters Really Cost?
_Calculating Cluster TCO, The Real Impact of Downtime, The Grand Unifying Theory Of Goodput, and a ClusterMAX 2.1 Update_

- **Authors:** ["Jordan Nanos", "Bryan Shan", "Cheang Kang Wen", "Daniel Nishball", "Dylan Patel"]
- **Access:** paid-preview
- **URL:** https://newsletter.semianalysis.com/p/how-much-do-gpu-clusters-really-cost
- **Corpus file:** `intelligence/_external_sources/semianalysis/2026-04-20-how-much-do-gpu-clusters-really-cost.md`

> # Introduction: Rethinking the Total Cost of a GPU Cluster  Modern GPUs are unbelievably expensive. A single Blackwell GPU costs more than the average car, and uses more energy than a single family home. It is now common for unicorn startups to have thousands of these GPUs working for them, day and night. Many foundation model companies now spend an order of magnitude more money on GPUs than they do on employees. We know multiple companies spending over 80% of their initial funding on GPUs. Star

### 2026-04-15 · ISSCC 2026: NVIDIA & Broadcom CPO, HBM4 & LPDDR6, TSMC Active LSI, Logic-Based SRAM, UCIe-S and More
_ISSCC 2026 Roundup_

- **Authors:** ["Afzal Ahmad", "Gerald Wong", "Daniel Nishball", "Ray Wang", "Clara Ee", "DC", "Dylan Patel"]
- **Access:** paid-preview
- **URL:** https://newsletter.semianalysis.com/p/isscc-2026-nvidia-and-broadcom-cpo
- **Corpus file:** `intelligence/_external_sources/semianalysis/2026-04-15-isscc-2026-nvidia-and-broadcom-cpo.md`

> There are three major semiconductor conferences each year, [IEDM](https://newsletter.semianalysis.com/p/interconnects-beyond-copper-1000), [VLSI](https://newsletter.semianalysis.com/p/vlsi2025) and finally ISSCC. We have covered the former two in great detail over the past few years. Today, we finally complete the trinity with our roundup on ISSCC 2026.  Compared to IEDM and VLSI, ISSCC has a much bigger focus on integration and circuits. Almost every paper comes with some form of circuit diagra

### 2026-04-02 · The Great GPU Shortage – Rental Capacity – Launching our H100 1 Year Rental Price Index
_H100 Rental Prices up 40%, GPU Rental Pricing Dashboard Launch, Compute Rental Market Structure, Will Rental Prices keep going up?_

- **Authors:** ["Daniel Nishball", "Jordan Nanos", "Cheang Kang Wen", "Nigel Chiang", "Dylan Patel"]
- **Access:** FREE-FULL-BODY
- **URL:** https://newsletter.semianalysis.com/p/the-great-gpu-shortage-rental-capacity
- **Corpus file:** `intelligence/_external_sources/semianalysis/2026-04-02-the-great-gpu-shortage-rental-capacity.md`

> Anthropic’s Claude 4.6 Opus and Claude Code have soared in demand. Anthropic’s ARR has more than tripled in just a single quarter from $9B at the end of last year to over $30 today. Open models such as GLM and Kimi K2.5 caused open model use cases to soar. Capital raises by firms like Anthropic, OpenAI, and various Neolabs also demand GPUs.  [![Claude Code is the Inflection Point](https://substackcdn.com/image/fetch/$s_!D9-B!,w_140,h_140,c_fill,f_auto,q_auto:good,fl_progressive:steep,g_auto/http

### 2026-03-31 · Dissecting Nvidia Blackwell - Tensor Cores, PTX Instructions, SASS, Floorsweep, Yield
_Microbenchmarking, tcgen05, 2SM MMA, UMMA, TMA, LDGSTS, UBLKCP, Speed of Light, Distributed Shared Memory, GPC Floorsweeps, SM Yield_

- **Authors:** ["Kimbo Chen", "Dylan Patel"]
- **Access:** paid-preview
- **URL:** https://newsletter.semianalysis.com/p/dissecting-nvidia-blackwell-tensor
- **Corpus file:** `intelligence/_external_sources/semianalysis/2026-03-31-dissecting-nvidia-blackwell-tensor.md`

> Nvidia’s Datacenter Blackwell GPU (SM100) represents one of the largest GPU microarchitecture change in a generation, yet no detailed whitepaper exists. Until today, there is no public datacenter Blackwell architecture microbenchmarking study on PTX and SASS instructions, such as UMMA and TMA, with a focus on AI workloads.  After our in-depth [Nvidia Tensor Core Evolution: From Volta To Blackwell article](https://newsletter.semianalysis.com/p/nvidia-tensor-core-evolution-from-volta-to-blackwell)

### 2026-03-24 · Nvidia – The Inference Kingdom Expands
_Groq LP30, LPX Rack, Attention FFN Disaggregation, Oberon & Kyber Updates, Nvidia's CPO Roadmap, Vera ETL256, CMX & STX_

- **Authors:** ["Dylan Patel", "Myron Xie", "Daniel Nishball", "Gerald Wong", "Kimbo Chen", "Clara Ee", "Wega Chu", "Michael Chen", "Iv
- **Access:** paid-preview
- **URL:** https://newsletter.semianalysis.com/p/nvidia-the-inference-kingdom-expands
- **Corpus file:** `intelligence/_external_sources/semianalysis/2026-03-24-nvidia-the-inference-kingdom-expands.md`

> [![](https://substackcdn.com/image/fetch/$s_!dC_X!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff5522a45-77c1-40f8-94c0-395f272b8db1_2709x1815.png)](https://substackcdn.com/image/fetch/$s_!dC_X!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff5522a45-77c1-40f8-94c0-395f272b8db1_2709x1815.png)  _caption:_ Source: Nvidia  At GTC 2026, Nvidia delivered an

### 2026-03-12 · The Great AI Silicon Shortage
_TSMC N3 Wafer Shortages, Memory Constraints, Datacenter Bottlenecks, Supply Chain Wars Winner_

- **Authors:** ["Ivan Chiam", "Myron Xie", "Ray Wang", "Sravan Kundojjala", "Gerald Wong", "Dylan Patel"]
- **Access:** paid-preview
- **URL:** https://newsletter.semianalysis.com/p/the-great-ai-silicon-shortage
- **Corpus file:** `intelligence/_external_sources/semianalysis/2026-03-12-the-great-ai-silicon-shortage.md`

> [![](https://substackcdn.com/image/fetch/$s_!xoJj!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fbc74983e-edab-47a0-801c-fffe0839a20e_4000x4000.png)](https://substackcdn.com/image/fetch/$s_!xoJj!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fbc74983e-edab-47a0-801c-fffe0839a20e_4000x4000.png)  ---  ## The Compute Shortage  Token demand is skyrocketing a

### 2026-03-03 · Are AI Datacenters Increasing Electric Bills for American Households?
_Power prices misconception, PJM's poor market design, Capacity prices 9.3x growth, ERCOT vs PJM grid reliability and expansion_

- **Authors:** ["Aishwarya Mahesh", "Jeremie Eliahou Ontiveros", "Ajey Pandey", "Dylan Patel", "Reyk Knuhtsen"]
- **Access:** paid-preview
- **URL:** https://newsletter.semianalysis.com/p/are-ai-datacenters-increasing-electric
- **Corpus file:** `intelligence/_external_sources/semianalysis/2026-03-03-are-ai-datacenters-increasing-electric.md`

> # Are AI Datacenters Increasing Electric Bills for American Households?  SemiAnalysis x Fluidstack is launching GTC with a 48-hour, full-stack AI infrastructure hackathon on March 15th from Power to Prefill, Dirt to Decode. With speakers from OpenAI, GPU MODE, and Thinking Machines, plus compute grants and GPU cluster access, come build with the best: [APPLY HERE](https://luma.com/SAxFSHack).  The topic of datacenter load growth and impact on power prices remains broadly misunderstood, akin to t

### 2026-02-25 · Vera Rubin – Extreme Co-Design: An Evolution from Grace Blackwell Oberon
_Vera, Rubin, NVLink 6 Switch, ConnectX-9, BlueField-4, Spectrum-6, Seamless Cableless Compute Tray Design, Power Rack, VR NVL72 TCO and BoM_

- **Authors:** ["Wega Chu", "Dylan Patel", "Daniel Nishball", "Clara Ee", "Gerald Wong", "Myron Xie", "Cheang Kang Wen", "Ray Wang", "N
- **Access:** paid-preview
- **URL:** https://newsletter.semianalysis.com/p/vera-rubin-extreme-co-design-an-evolution
- **Corpus file:** `intelligence/_external_sources/semianalysis/2026-02-25-vera-rubin-extreme-co-design-an-evolution.md`

> [![](https://substackcdn.com/image/fetch/$s_!NB4l!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F7257cc0c-a57b-4aa2-b03b-1ead3d930e8c_4800x2700.png)](https://substackcdn.com/image/fetch/$s_!NB4l!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F7257cc0c-a57b-4aa2-b03b-1ead3d930e8c_4800x2700.png)  At CES 2026, Nvidia officially announced in detail all 6 Rub


## ⊕ GITHUB COMMITS + RELEASES, last 24h

_no commits or releases in the lookback window_

## ⊕ ECOSYSTEM BLOGS via RSS

_no new posts in the lookback window_

## ⊕ X via NITTER, voices we track

_no posts retrieved · all Nitter instances may be down_


---
_Generated at 2026-05-21T07:46:16.100296+00:00 by scripts/intel/aggregate.py. Treat this digest as input context, not as ground truth. Verify before quoting._
