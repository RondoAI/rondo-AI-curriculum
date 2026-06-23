# Ecosystem Deep Dive · 14 May 2026

A site-by-site competitive scan of the Bittensor ecosystem for Subnet
Magazine v2, followed by gap analysis and a concrete idea bank. All
findings come from WebFetch and WebSearch passes against live pages
in May 2026. Where a site refused, timed out, or returned a placeholder
the report says so explicitly.

---

## Phase 1 · Site-by-site reports

### bittensor.com (Opentensor)
Minimalist marketing page that reads more like a directory of outbound
links than a homepage. The top nav exposes only About, Whitepaper, Docs
(at docs.learnbittensor.org), Discord, and Wallet. No live data, no
subnet directory, no charts, no editorial hub. The About page is a
text-only essay attributed to Const. The one notable long-form piece —
"The Bittensor Standard" at /content/the-bittensor-standard — is a
~4,000-word philosophical essay with embedded schematics that reads
like a stand-alone manifesto rather than part of an ongoing publication.
What they do well: the writing, when it appears, is genuinely
high-quality and intellectually serious. What they don't bother with:
everything operational. The protocol's official homepage carries zero
live network state, no subnet bios, no validator listings, no developer
on-ramp beyond a docs link. The hidden gap is shocking — the project
that invented "decentralized AI" has no public-facing newsroom and no
contemporary research output on its own domain. opentensor.ai is a
near-identical shell pointing at the same five destinations.

### taostats.io
The de facto Bloomberg of Bittensor and the incumbent we must beat.
Self-positioned as "the official block explorer since 2022, deepest
historical on-chain data anywhere." Dense data: TAO price ticker,
subnet table (price, mcap, emission, 7-day change), validator
leaderboard (weight, 24h delta, nominators, take, dominance), live
transaction feed, block production stream. The Analytics hub is
genuinely strong: Staking vs Price, Hotkey×Netuid Heatmap, Miner Age
vs Incentive, Subnet Emissions vs Recycled TAO, Subnet Growth, TAO
Staked Over Time, Daily Registration Recycle. A Pro tier gates
portfolio tracking, tax reports, miner analytics, and API keys. What
they do well: completeness of raw data, freshness, CSV export, depth
of historical series. What they don't do: editorial. Zero long-form
research, zero subnet bios beyond a name and ticker, no founder info,
no roadmap field, no "what is this thing actually doing" prose. The
subnet directory page (/subnets) defaults to a deregistration view
with five columns and placeholder icons — it functions as a market
microstructure tool, not a discovery surface. There is no
learn-bittensor section on the domain (404). Mobile is functional but
table-dense and joyless.

### taomarketcap.com
The CoinMarketCap clone for the Bittensor stack. Dark theme, ranked
subnet table with Emission, Price, 1h / 1d / 7d %, Chain Buys, Market
Cap, 24h Volume, Circulating Supply. Trending and Bookmarked tabs and
a "BubblesHeatmap" toggle exist. A swap widget and exchange links
(Binance, Kucoin, Kraken) make it the closest thing to a retail
trading entry point. On the day fetched, hero metrics rendered as
placeholder zeros, which is its own commentary on data plumbing
fragility. What they do well: trader-readable price layout, bubble
heatmap that taostats lacks. What's missing: editorial, deep
analytics, comparison tools, any prose at all. It is a screen for
people who already know what they're looking at.

### subnets.io
Connection refused on the fetch attempt. Either dead, geo-blocked,
or domain-parked at the time of research. Treat as nonexistent for
competitive purposes; the namespace is unclaimed and ours to take.

### macrocosmos.ai
A polished operator site — high-contrast hero imagery, full-color and
black-and-white team portraits, a Gravity data-collection chart on
the homepage. They run SN1 (Apex), SN9 (Pretraining), SN13 (Data
Universe/Gravity) and surface three product cards: IOTA Dashboard,
Apex Dashboard, Gravity ("55B rows scraped, largest open-source social
media data repository"). Strong design polish, philosophical copy
("decentralizing AI"), and Substack link in the footer. What's
missing: the homepage has no embedded live metrics, the /blog and
/our-team paths returned 404, technical depth on the subnets sits
behind dashboard logins, and there's no public research catalog
despite being the most academic-feeling operator in the network.

### chutes.ai (Rayon Labs SN64)
The strongest product-marketing site in the ecosystem. Sharp serverless
positioning ("Breakthrough Serverless Compute for AI, At Scale"),
clean model catalog with sort/filter, tiered pricing ($3 Base, $10
Plus, $20 Pro, Enterprise custom), and a model-availability claim
("permanently hot, production-ready"). Mentions Chutes Chat, Chutes
Studio, Batch (Soon), TEE Secure Compute (Soon). Partnerships called
out: OpenRouter, Cline, Kilo. What they do well: it reads like a real
SaaS product, not a crypto experiment. What's missing for our purposes:
Bittensor is reduced to a logo in a "Chutes Global" partner row. SN64
emission data, miner counts, validator weights — none of it surfaces.
This is a product page, not a subnet page.

### rayonlabs.com / rayonlabs.ai
Parent site for Chutes, Gradients (SN56), Nineteen (SN19). Both
domains returned 503 on direct fetch. Per OAK Research and Messari
coverage, the three subnets together control approximately 23.7% of
daily TAO emissions, making this the single most consequential operator
team in the network. The fact that their parent-company homepage was
unreachable during the scan is itself a gap — the most influential
team in Bittensor lacks a reliable, content-rich public face.

### manifold.inc
Targon, Sybil, Tao.xyz. Self-described as a "frontier AI lab in
Austin Texas." Three product cards covering Nvidia confidential
computing on H200 / 4090, ultra-fast inference over InfiniBand/RoCE,
and 1,000+ H200 ecosystem access. Hardware-credible — the page name-drops
TPM attestation, encrypted VMs, TargonOS as "a hardened Linux distro
for decentralized compute on untrusted hardware." Polish is high.
What's missing: no blog, no technical writeups beyond release notes,
no public benchmarks against AWS / Lambda Labs / CoreWeave despite
that being the obvious comparison. Heavy marketing, thin substance.

### taoshi.io (SN8 / PTN)
Trading-platform positioning with a $30M+ annualized rewards pool
headline. Dashboard and Documentation links exist but the dashboard
itself returned 404 on fetch. Two press releases featured (April 2025
competition, October 2024 Glitch Financial launch). What's missing
is the entire reason a trading subnet should exist publicly: no
leaderboard, no historical Sharpe / Sortino / max drawdown, no
trader-by-trader performance, no risk metrics. For a subnet that
sells itself on "advanced financial analytics for scoring," the
public face is shockingly opaque.

### nousresearch.com
The most prestigious brand in the SN6 / open-source-LLM corner.
Minimalist design, tagline "Artificial Intelligence Made Human."
Three pillars: open-source models (Hermes line, including Hermes 4),
applied research (architecture / data synthesis / fine-tuning /
reasoning), and infrastructure (Psyche, distributed training). Active
on HuggingFace, GitHub, Discord. Research papers are referenced but
the /research path 404s and the /blog path was not reachable directly
in this scan. Prestige comes from output (Hermes models, distributed
training papers) more than from on-site curation.

### datura.ai (Lium / SN51)
Dark theme, slogan "Bold in our belief. Dangerous in our disruption."
Logos for Lium and TaoMarketCap shown as partners. The homepage gives
almost nothing — no product detail, no SN51 mention, no docs link
visible from the surface. Per external coverage, Lium is the GPU
compute marketplace formerly known as Celium, hit ~$432K/month
rental revenue, burns 60% of miner emissions, and runs ~500 H100s.
None of that lives on the public homepage. docs.lium.io exists but
returned an empty body to WebFetch.

### corcel.io (SN18 Cortex.t)
The homepage and /chat path both returned 404. Per external sources,
Corcel as a product has been sunset, though Cortex.t (SN18) itself
continues as a synthetic-data subnet. cortex-t.ai is the live site:
clean, model catalog (OpenAI GPT-4o / 4 / 3.5, Anthropic Claude
Opus/Sonnet/Haiku, DALL-E, legacy Davinci/Babbage), links to Weights
& Biases datasets and taostats, dual pitch to "app developers and AI
innovators." Functional, not luxurious.

### hippius.com (SN75)
Decentralized storage with Arion Storage and S3-compatible endpoints,
a desktop app, console access, referral program, fiat and TAO payment.
Hipstats subdomain provides indexer-style analytics for the subnet.
Pricing page has an interactive calculator. Docs at docs.hippius.com.
Good developer-tier polish. What's missing on the marketing surface:
benchmarks against Filecoin / Arweave / Sia, no editorial.

### tplr.ai (Templar / SN3)
Clean, developer-facing site. Nav: Home, Chat, Dashboard (Training
Runs / Crusades), Research, Docs (docs.tplr.ai). Tagline:
"Incentivized Internet-wide AI training." The "Training Runs"
dashboard and the "Crusades" tournament concept are genuinely
distinctive — the only operator in the network selling live training
runs as a spectator product. Templar.tech returned empty; tplr.ai is
the canonical domain. What's missing: actual on-site narrative around
who's training what, how big the runs are, who's winning crusades.
The structure is there; the storytelling isn't.

### scorevision.io (Score / SN44)
Returned 503 on multiple attempts. Per Yuma's State of Bittensor Vol.
2, Score is the SN44 computer-vision subnet now selling its Manako
video product to Reading FC and pitching into the $600B football
industry. score.foundation (the URL we were given) refused the
connection. The team has a real customer story to tell and a broken
public surface to tell it on.

### affine.foundation (Affine / SN120)
Connection refused. Per CoinGecko, TAO.app and external commentary,
Affine is a reinforcement-learning environment for program synthesis
and code generation, led by Const (Bittensor co-founder), included in
Project Rubicon's first liquid-staking cohort on Base. The
.foundation domain being unreachable means the most pedigreed
new-launch subnet has no functioning public homepage.

### dcg.co
Clean institutional crypto-investor site. 200+ equity investments,
50+ fund investments, 30+ token positions, since 2012. Owned
businesses: Genesis, Grayscale, CoinDesk, Foundry, Luno, HQ,
TradeBlock. Zero AI / Bittensor / Yuma content on the homepage
surface, no blog, no thesis writing. DCG owns the largest
Bittensor-focused fund in existence (Yuma) and you would never know
it from their own site.

### yumaai.com (Yuma — DCG's Bittensor arm)
Gradient-heavy design, hero imagery, navigation across services,
subnets, investment. Five accelerated subnets shown: Swap, Numinous,
Score, Gopher, Dippy. Three service pillars: subnet acceleration,
validator operations, mining services. The flagship public artifact is
the "State of Bittensor" report, now in Volume 2 (per Yuma's X feed),
which covers token dynamics, the "Tipping Point" thesis, subnet
highlights, halving mechanics, and governance plans. The /report
page itself rendered as a shell with navigation only — the substantive
PDF lives elsewhere. Asset management arm launched October 2025 with
two funds (Composite, Large Cap) anchored by a $10M DCG commitment,
plus a Yuma Composite Index (YCX). What they do well: report cadence,
institutional framing, real fund product. What's missing: the reports
aren't natively web-rendered, the index has no live page, the
portfolio breakdown isn't public, and there is no editorial cadence
between report drops.

### foundry.fund / foundrydigital.com
Bitcoin and Zcash mining pool operator under DCG. No Bittensor
content surfaced on the homepage. They reportedly operate one of
the larger Bittensor validators, but you'd never know it from their
public site. The fund landing page (foundry.fund) returned an empty
body; foundrydigital.com loads but covers only mining pools. Total
disconnect between operational footprint and public surface.

### polychain.capital
A single-page placeholder. Company description, legal disclaimer,
contact details. No portfolio, no thesis, no Bittensor mention, no
writing. Treats LPs as the only audience and the open web as a
liability surface. Standard for top-tier crypto VCs and notable only
as confirmation that the venture class will not be the source of
public-facing intelligence.

---

## Phase 2 · Cross-cutting gaps

1. **No one renders subnets as bios.** Every site renders subnets as
   rows in a table or cards in a marketing grid. Nobody writes a
   1,000-word "what this thing actually does, who built it, how it
   makes money, where it's heading" profile per subnet. Yuma's State
   of Bittensor reports touch this once or twice a year; nothing
   continuous exists.

2. **Editorial is wide open.** Taostats has none. Taomarketcap has
   none. Bittensor.com has one essay. Yuma has two reports a year.
   Macrocosmos's blog 404s. Nous's research index 404s. There is no
   weekly publication, no daily desk, no analyst notes, no anything
   that resembles a Bloomberg terminal's news pane attached to live
   tickers.

3. **"Live" is mostly a lie.** Most sites refresh on hard reload.
   Real WebSocket streaming of price, blocks, weights, emissions, and
   transactions is absent on every consumer surface checked.
   Taostats refreshes feeds but the homepage charts don't truly
   stream. Nobody pushes block-by-block animation.

4. **Comparison against centralized AI is missing entirely.**
   Decentralized AI's only honest comparison is against OpenAI,
   Anthropic, Google. Not one site in the scan builds a side-by-side
   benchmark for cost-per-token, latency, model quality, or uptime
   between Chutes / Targon / Nineteen and the closed labs. This is
   the most important visual the ecosystem doesn't have.

5. **Newcomer discovery is brutal.** A novice arrives at any of these
   sites and is shown either marketing fluff or institutional-grade
   tables. There is no "If you're new, read this," no guided tour, no
   onboarding rail, no quiz, no curated five-minute primer with
   sparklines.

6. **Validator transparency is shallow.** Taostats gives raw weights;
   nobody profiles a validator like an analyst — uptime, stake
   trajectory, slashing history, who they delegate to, how their
   weight has drifted on contentious subnets, whether they actually
   run public infrastructure.

7. **Subnet founder pages don't exist.** No "meet the team" rendering
   exists for ~99% of subnets. The State of Bittensor report names
   founders; nothing else does. For a network that lives or dies on
   operator quality, this is malpractice.

8. **Visualizations are stuck in 2014.** Line charts, bar charts,
   tables, one bubble heatmap. The Yuma Consensus convergence animation
   in our §03 is already unique in the ecosystem. Nobody else has
   built a weight-matrix heatmap, an emission flow Sankey, a neural-net
   canvas, or a 3D network map. Visual asymmetry is our biggest moat.

9. **Mobile is mostly afterthought.** Taostats works on mobile but is
   unreadable in the table-dense views. Taomarketcap is similar.
   Operator marketing sites scale but pack no live information.
   Nothing in this ecosystem is designed mobile-first despite
   significant traders living on phones.

10. **Brand polish ranges from rough to amateur for analytical
    products.** Taostats is functional-ugly. Taomarketcap is dated.
    The operator sites (Chutes, Manifold, Macrocosmos, Yuma) have
    real polish but only inside their own product. No analytical
    surface in the entire ecosystem has Stripe / Linear / Bloomberg
    Terminal-grade design.

11. **No public alpha-discovery surface.** Wallet-level flows,
    insider unstaking, validator weight shifts, subnet token
    accumulation by treasuries — none of this is rendered. Taostats
    Pro hints at portfolio tracking but doesn't surface alpha
    publicly. A "What's the smart money doing this week" page would
    have no competition.

12. **No dTAO market microstructure tools.** Subnet token order books,
    liquidity depth, alpha pool drift, registration cost
    arbitrage windows, halving-impact calculators — all absent
    publicly. dTAO went live; the analytics layer for it didn't.

---

## Phase 3 · Idea bank for Subnet Magazine

### Live data plumbing

1. **True WebSocket terminal heartbeat.** Idea: every numeric chip
   on the homepage subscribes to a real block-by-block stream rather
   than polling. Why: "live" becomes verifiable; the page visibly
   pulses with the chain. Implementation: extend §06 Live Network
   band with a single shared WebSocket gateway in front of the
   taostats Pro API and the chain endpoint; render a heartbeat ring
   around each chip that flashes on new block. Effort: MEDIUM. Risk:
   API rate limits on free tier; cost of WS gateway under load.

2. **Block-by-block animated chain ribbon.** Idea: a thin ribbon
   across the top of every page that scrolls finalized blocks left to
   right with extrinsic count and tx volume per block. Why: instant
   "alive" cue, no competitor has it. Implementation: SVG canvas tied
   to the same WS gateway. Effort: SMALL.

3. **Latency-honest stale-data badges.** Idea: every metric carries
   a "fresh / 30s / 5min / stale" pill that shows true source latency.
   Why: trust through honesty; every other site lies by omission.
   Implementation: middleware annotates payloads with fetched_at.
   Effort: SMALL.

### Novel visualizations

4. **Weight-matrix replay scrubber.** Idea: a date scrubber on the
   §03 Yuma weight-matrix heatmap that lets the reader scrub
   validator-by-subnet weights across the last 90 days like a film.
   Why: nobody has ever rendered consensus drift as time-series video.
   Implementation: cache daily weight snapshots; D3 + Canvas. Effort:
   LARGE. Risk: storage cost; UX complexity on mobile.

5. **Emission Sankey, full network.** Idea: a full-screen Sankey of
   TAO emission from validators through subnets through miners through
   recycle. Why: explains the protocol's economy at a glance, taught
   nowhere. Implementation: D3-Sankey + cached snapshots. Effort:
   MEDIUM. Risk: legibility at 100+ subnets — needs aggressive
   grouping rules.

6. **Subnet token relative-strength quilt.** Idea: a calendar
   heatmap showing every subnet token's daily return vs TAO over the
   last quarter. Why: there is no equivalent of stock relative-strength
   quilts in this ecosystem, and traders want it. Implementation:
   pandas-on-the-server, render as SVG. Effort: SMALL.

7. **3D weight-stake force graph.** Idea: extend our existing 3D
   network map to show validators as nodes weighted by stake, subnets
   as nodes weighted by emission, edges as weight vectors. Allow
   "drag a node" to see who supports whom. Why: every other map is
   geographical; only ours would be topological. Implementation:
   three.js, react-force-graph-3d. Effort: LARGE.

8. **dTAO liquidity depth charts per subnet.** Idea: TradingView-style
   order-book depth for each subnet token's alpha pool. Why: dTAO is
   live, no one shows pool depth visually. Implementation: pull pool
   reserves on chain; render with lightweight-charts. Effort: MEDIUM.

### Editorial formats

9. **Subnet bio pages with cover art and prose.** Idea: a 600-1,500
   word standalone page per subnet — what it does, who built it,
   the moat, the risks, the latest numbers, the next milestone — with
   bespoke cover art per subnet. Why: literally no one in the network
   does this; we already have the §02 horizontal swipe scaffolding.
   Implementation: extend the existing /subnet template; commission
   cover art per subnet; AI-assist the first drafts, human edit. Effort:
   LARGE. Risk: writing 120+ bios is real labor; needs cadence.

10. **Weekly research drop, Friday 4pm UTC.** Idea: one long-form
    piece per week pinned to §01, archived to /articles, RSS-published.
    Why: nobody has a regular publication schedule; readers will
    return for the rhythm. Implementation: editorial calendar, MDX
    pipeline, AI drafting + human editing. Effort: MEDIUM ongoing.

11. **Daily morning brief, before US open.** Idea: a 250-word
    market-color note at the top of /markets every weekday by 13:00 UTC
    covering overnight TAO action, top subnet movers, watchlist
    headlines. Why: the discipline of "first read of the day" is what
    makes a terminal sticky; no Bittensor site does it. Implementation:
    LLM-drafted from chain + watchlist news, human approve and ship.
    Effort: MEDIUM ongoing.

12. **Quarterly State of dTAO long-read.** Idea: own the calendar
    against Yuma's biannual report by going quarterly with deeper
    statistical content. Why: cadence kills incumbents; quarterly beats
    biannual. Implementation: extend the Field Manual pipeline.
    Effort: LARGE per drop.

### On-chain interactions

13. **Wallet-aware subnet pages.** Idea: connect a Polkadot wallet
    and every subnet page lights up showing stake, alpha-pool LP
    position, claimed rewards. Why: turns the magazine into a portfolio
    surface without becoming taostats Pro. Implementation:
    @polkadot/api in browser, no server custody. Effort: MEDIUM. Risk:
    wallet UX is brittle on mobile.

14. **One-click stake from a subnet bio.** Idea: a "stake from this
    page" button at the end of every subnet bio that opens a
    pre-filled extrinsic to a default validator we recommend per
    subnet. Why: editorial that ends in action is rare and powerful.
    Implementation: extrinsic builder, wallet signer. Effort: MEDIUM.
    Risk: regulatory framing; must be a tool, not a recommendation.

### Social proof and discovery

15. **"What the desk reads" sidebar.** Idea: a rolling list of the
    last 20 external links read by the editorial team, dated and
    annotated in one sentence. Why: a magazine signals taste; nobody
    in this ecosystem signals taste. Implementation: simple JSON,
    edit by hand. Effort: SMALL.

16. **Subnet leaderboard by reader vote.** Idea: a "100 readers ranked
    SN51 #3 this week" rail. Why: introduces qualitative judgment
    next to quantitative ranking. Implementation: lightweight rating
    backed by Cloudflare KV; no auth needed. Effort: SMALL. Risk:
    brigading — needs throttling.

### Validator tooling

17. **Validator analyst card per validator.** Idea: extend the
    Validators page from a ranking into a per-validator profile —
    7-day weight drift heatmap, top supported subnets, stake
    trajectory, public infrastructure address, slashing record,
    operator-published commitments. Why: nobody profiles validators;
    delegating capital chooses them blindly. Implementation: extend
    /validators with a /validator/<hotkey> route. Effort: LARGE.

18. **Delegate recommender, transparent algorithm.** Idea: a single
    page that asks the reader four questions (risk appetite, subnet
    bias, lock preference, fee tolerance) and outputs three validator
    candidates with the math shown. Why: explicit recommendation is a
    moat; nobody else does it. Implementation: simple ranking on
    public data. Effort: MEDIUM. Risk: must be framed as research
    output, not investment advice.

### Subnet builder onboarding

19. **"Build a subnet" interactive walkthrough.** Idea: a six-step
    web tutorial that scaffolds an actual subnet repo, explains the
    Yuma scoring loop, and ends with a working local miner / validator
    pair. Why: bittensor.com only links to docs; nobody hand-holds a
    new builder. Implementation: WebContainers + a guided MDX
    pipeline. Effort: LARGE.

### Comparison tools

20. **Subnet vs OpenAI cost-per-1k-tokens calculator.** Idea: a
    side-by-side calculator that pits Chutes / Targon / Nineteen
    against GPT-4o / Claude / Gemini on cost, latency, and recent
    benchmark scores for a given workload. Why: the central thesis of
    decentralized AI never gets a public scoreboard. Implementation:
    we set up nightly automated benchmarks against public endpoints;
    publish the table. Effort: LARGE. Risk: methodology disputes.

21. **dTAO market vs centralized AI mcap mirror.** Idea: a
    full-screen comparison overlaying aggregate Bittensor subnet
    mcap, validator stake, and tokens-served against OpenAI revenue
    runrate and Anthropic revenue runrate. Why: the macro frame for
    "DeAI vs cAI" doesn't exist visually anywhere. Implementation:
    monthly hand-curated dataset, automated chart. Effort: MEDIUM.

### Alpha discovery

22. **Smart-money flow page.** Idea: track top-50 staked hotkeys by
    label, expose net stake changes by subnet by day, highlight the
    largest moves. Why: alpha discovery surface that taostats Pro
    hints at but does not publish. Implementation: chain queries +
    label registry that we maintain in repo. Effort: MEDIUM. Risk:
    label accuracy.

23. **Registration window watch.** Idea: a live page that flags
    profitable subnet registration cost windows and shows historical
    cost vs reward — when has it been cheap to register and
    well-rewarded? Why: market microstructure tool nobody publishes.
    Implementation: chain query, simple charting. Effort: MEDIUM.

24. **Halving countdown with revenue model.** Idea: a single-page
    "TAO halving impact" surface counting down to the next halving with
    miner economics, recycle rates, and per-subnet emission sensitivity.
    Why: the first halving happened, the next one matters even more;
    no public revenue-model lives anywhere. Implementation: Python
    notebook backend, public JSON, D3 frontend. Effort: MEDIUM.

### Brand polish and mobile

25. **A real brand kit.** Idea: typography pair (one display, one
    mono), three-color accent system per content domain (markets red,
    research blue, protocol green, community amber), commissioned
    cover art per subnet bio and per long-form article, an
    iconographic system for emission / stake / weight / yield. Why:
    no analytical site in the ecosystem looks like a Bloomberg
    Terminal; ours can. Implementation: commission designer for
    two weeks of focused brand work; codify in /style. Effort:
    MEDIUM. Risk: design debt if not enforced.

26. **Mobile-first reading mode.** Idea: a true reader view on
    every page that strips chrome, reflows to single column, swipes
    horizontally between sections, and keeps one live ticker pinned
    bottom. Why: the only site in the network that prioritizes phones
    will own the trader-on-the-go segment. Implementation: alt route
    /m/* with separate layout, shared data. Effort: MEDIUM.

27. **Audio briefings.** Idea: a 90-second daily audio briefing
    generated from the morning brief, available on the homepage and
    via a podcast feed. Why: nobody in this ecosystem ships audio;
    commute and gym time is free attention. Implementation: TTS via
    ElevenLabs from the morning-brief markdown. Effort: SMALL.

### dTAO market tools

28. **Subnet alpha pool simulator.** Idea: a calculator where the
    reader enters a stake size and target subnet, and the page
    simulates expected alpha-pool LP yield over 30 / 90 / 365 days
    given current emission and pool depth. Why: the most basic dTAO
    primitive and nobody has the calculator. Implementation: closed-form
    math, no chain writes. Effort: SMALL. Risk: needs an explicit
    "this is not financial advice" frame.

29. **Project Rubicon liquid-staking dashboard.** Idea: a tracking
    page for the 17 subnets in Rubicon's first cohort with liquid
    staking on Base — TVL, fee accrual, price relative to native
    alpha. Why: the bridge story is happening and no one is rendering
    it. Implementation: combine Base subgraph data with chain queries.
    Effort: MEDIUM.

30. **Subnet-token correlation matrix.** Idea: a 30-day correlation
    matrix across the top-25 subnet tokens against TAO and against
    each other. Why: portfolio construction in this ecosystem is
    blind; correlation is the first lens. Implementation: nightly job
    + heatmap. Effort: SMALL.

---

## Phase 4 · 12-month positioning

Subnet Magazine in twelve months should be the answer to one question:
"Where does a serious crypto-AI investor look first in the morning?"
Today that answer is taostats for data, X/Twitter for narrative, the
Yuma report twice a year for synthesis, and nothing for a daily read.
We can become the daily read.

Editorial voice is the moat, because the data moat is already taken.
Taostats will always have the deepest archive and the institutional
endpoint. We do not beat them on rows of data. We beat them on
interpretation: a desk that watches the chain, names what's happening,
and renders it as prose with visuals. The voice should be plain, dense,
literate, unshowy — the voice of a senior analyst who respects the
reader's time. No emojis, no shilling, no hype. The model is the FT
Lex column or Matt Levine's "Money Stuff" — fast, opinionated, sourced,
willing to mock when something is silly. The cadence is daily morning
brief, weekly long-read on Friday, quarterly State of dTAO. Discipline
of cadence will eat incumbents alive.

The visualization moat is real and defensible. Our §03 bespoke SVGs —
weight matrix, Yuma convergence, emission flow, bonding curves — already
exceed everything in the scan. Twelve months of compounding that
advantage (Sankey, force graph, weight replay scrubber, subnet token
quilt, dTAO depth charts) gives us a visual library that an incumbent
cannot copy without rebuilding their entire frontend.

The discovery moat is the under-attacked surface. The newcomer journey
across this ecosystem is awful. A "/start" page that takes a literate
adult from "what is Bittensor" to "here are five subnets to watch and
why" in fifteen minutes, with our visualizations as the scaffolding,
gives us the SEO and the word-of-mouth that converts curious traders
into daily readers.

What makes Yuma's audience read us instead of Yuma's own report? Yuma
publishes twice a year, is conflicted (they own the funds), and is
hosted on a marketing site. We publish daily, are not conflicted, and
are a research terminal. Same data, more truth, more frequency, better
design.

What makes Foundry's or Polychain's analysts read us? They have no
public face, no editorial output, and no daily product. We will be
the public face they didn't build.

Twelve months in, the test is simple: does a partner at Polychain
have our tab open before their first meeting? Does a Yuma analyst
quote our chart in a deck? Does a new subnet founder send their
launch link to us before they send it to taostats? If yes on all
three, the ten-million-dollar product is real.
