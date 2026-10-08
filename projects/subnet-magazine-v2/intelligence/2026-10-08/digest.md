# Intelligence Digest, 2026-10-08

_Single-file briefing for the daily research agent. Sources listed in trust order: human-curated notes first, then objective (github), then editorial (RSS), then volume (X via Nitter)._


## ⊕ HUMAN-CURATED NOTES, last 7 days

_no human notes in the window_

## ⊕ MACRO BACKDROP via SEMIANALYSIS, 12 most recent posts

_SemiAnalysis is the most-cited semiconductor and AI infrastructure publication in the industry. They do NOT cover Bittensor. The Oracle uses this corpus for any claim about hyperscaler compute, GPU economics, datacenter power, foundry capacity, memory pricing, lab unit economics. DO NOT cite SemiAnalysis for any Bittensor-specific claim. Full archive (289 posts, May 2020 onwards) lives at `intelligence/_external_sources/semianalysis/` with an `INDEX.md` table of contents. Paywalled posts show only subtitle + free preview; free posts have the full body extracted._

### 2026-10-05 · Anthropic Subscriptions Offer 5x+ More Value Than OpenAI
_Limit testing every AI subscription plan from Anthropic, OpenAI, Meta, SpaceXAI, MiniMax, Moonshot, Z.ai, Cursor, and Cognition_

- **Authors:** ["Andrew Megalaa", "Max Kan", "Dylan Patel"]
- **Access:** paid-preview
- **URL:** https://newsletter.semianalysis.com/p/anthropic-subscriptions-offer-5x
- **Corpus file:** `intelligence/_external_sources/semianalysis/2026-10-05-anthropic-subscriptions-offer-5x.md`

> Subscription plans are still the primary way consumers and small businesses pay for AI. These plans are highly subsidized—as we previously explained in [June](https://semianalysis.com/institutional/a-200-claude-plan-can-consume-8000-worth-of-tokens/)—but can still make economic sense as powerful customer acquisition and marketing tools. For example, the goodwill engendered by [OpenAI’s](https://x.com/thsottiaux/status/2102463847714247142) [generous](https://x.com/thsottiaux/status/21036374777603

### 2026-09-28 · How GLM5.3 Sparse Attention Affects HBM Memory Usage
_GLM-5.3, KV Cache Offloading, HiSparse, AgentX TileRT, InferenceX DeepSeek Sparse Attention, IndexShare, Single-rollout Asynchronous Optimization, Cybersecurity_

- **Authors:** ["Kimbo Chen", "Alec Ibarra", "Wenyao Gao", "Pratt Bhatt", "Bryan Shan", "Dylan Patel"]
- **Access:** paid-preview
- **URL:** https://newsletter.semianalysis.com/p/sparse-savings-persistent-demand-inside-glm53
- **Corpus file:** `intelligence/_external_sources/semianalysis/2026-09-28-sparse-savings-persistent-demand-inside-glm53.md`

> # How Sparse Attention Affects DRAM/NAND Memory  How does sparse attention affect the TAM of memory, including HBM and NAND? Sparse attention selects top-k most relevant tokens to attend to, reducing the memory consumption and bandwidth requirements during the core Scaled Dot-Production Attention (SDPA) operation. However, the efficiency improvement doesn’t directly translate to overall memory savings in practice. Concretely, the top-k selection operation typically requires the full context to b

### 2026-09-26 · Intel Panther Lake Teardown
_Taking a look inside Intel’s latest consumer chip and 18A process node_

- **Authors:** ["Adith Shankar", "Daniel Sanchez", "Allison Elliott", "Sarah Lawrence", "Afzal Ahmad", "Andrew Wagner", "STEEL Team", "
- **Access:** paid-preview
- **URL:** https://newsletter.semianalysis.com/p/intel-panther-lake-teardown
- **Corpus file:** `intelligence/_external_sources/semianalysis/2026-09-26-intel-panther-lake-teardown.md`

> Panther Lake debuts the first commercial implementation of backside power delivery (BSPDN), introduces Intel’s first iteration of gate-all-around (GAA) transistors, and showcases their advanced packaging capabilities with its Foveros-S assembly. With Panther Lake, Intel’s manufacturing arc has shifted from nebulous roadmaps to shipped silicon, a significant milestone on their long road back to competitive semiconductor manufacturing. To evaluate the extent of Intel’s comeback, we tore down Panth

### 2026-09-25 · The Chinese AI Infrastructure Boom: Introducing the SemiAnalysis China Datacenter Model
_1,000+ facilities across 60+ operators mapped, built retail-first and flipped by AI, largest hyperscaler leases 1/5 national capacity, 100MW in 12 months, Eastern Data Western Compute_

- **Authors:** ["Everlyn", "Dylan Patel", "Patrick Schaabi"]
- **Access:** paid-preview
- **URL:** https://newsletter.semianalysis.com/p/the-chinese-ai-infrastructure-boom
- **Corpus file:** `intelligence/_external_sources/semianalysis/2026-09-25-the-chinese-ai-infrastructure-boom.md`

> China sits at the frontier of the global model race. GLM 5.3 and Kimi K3 are the latest in a run of striking open-weights releases. ByteDance's Doubao serves 345M monthly users as China's ChatGPT, and Seedance is the State-Of-The-Art video generation model.  Every one of those models runs on a datacenter, and China has been building them at a pace that has gone largely unmeasured outside the country. The biggest tenant files no 10-K. Several of the largest landlords have never listed. Most of th

### 2026-09-23 · ClusterMAX 3.0: The Industry Standard GPU Cloud Rating System Returns
_In gory detail: reliability, performance, support, pricing—and, of course, security—in our most thorough analysis of GPU cloud providers globally._

- **Authors:** ["Jordan Nanos", "Sam Harshe", "Samuel Kruse", "Pratt Bhatt", "Billy Cao", "Jack Carson", "Dylan Patel"]
- **Access:** paid-preview
- **URL:** https://newsletter.semianalysis.com/p/clustermax-30-the-industry-standard
- **Corpus file:** `intelligence/_external_sources/semianalysis/2026-09-23-clustermax-30-the-industry-standard.md`

> This post has bonus content for paid subscribers. Upgrade to get full access.  Subscribe  In 8 months since our last major release of ClusterMAX, slavering investors have just about run out of pockets to stuff checks into. GPU supply has gone to zero. Meanwhile, we have been hard at work putting clusters through the ringer.  Weeks ago, we teased this report with some R-rated anecdotes from our experiences probing the security practices of neoclouds, eliciting a PSA from a neocloud customer that

### 2026-09-21 · Computation and Data Movement for Inference
_Mapping MoE models onto inference hardware: structure, flow, and efficient serving_

- **Authors:** ["Tanj Bennett"]
- **Access:** paid-preview
- **URL:** https://newsletter.semianalysis.com/p/computation-and-data-movement-for
- **Corpus file:** `intelligence/_external_sources/semianalysis/2026-09-21-computation-and-data-movement-for.md`

> Mixture of Experts, now widely used in frontier models, has changed both the structure of serving and the economics of useful inference. It did more than increase parameter count. It changed which tensors are active for each token, what must remain close together, which transfers need strong local bandwidth, which can tolerate a weaker network link, and how memory movement, storage, and scheduling contribute to useful throughput.  The best place to begin is the service as a whole. Inference runs

### 2026-09-18 · Engrams Embedding Entendre: Codesign for Efficient DRAM/SSD Offloading
_New Model Architecture Implications for TAM of DRAM/NVMe, DeepSeek V4.1 Flash, AgentX, InferenceX, NVMe experiments_

- **Authors:** ["Bryan Shan", "Cam Quilici", "Alec Ibarra", "Kimbo Chen", "Myron Xie", "Dylan Patel"]
- **Access:** paid-preview
- **URL:** https://newsletter.semianalysis.com/p/engrams-embedding-entendre-codesign
- **Corpus file:** `intelligence/_external_sources/semianalysis/2026-09-18-engrams-embedding-entendre-codesign.md`

> Engram extends standard token embeddings with learned multi-token lookups. Recurring local patterns retrieve vectors directly, reducing the need to reconstruct them through attention and feed-forward layers.  With Engram model architecture optimization, it allows for lower HBM capacity to be needed for models at the same quality. [This does not mean there won’t be an insane demand for HBM but it just means that model architecture will continue to innovate around constraints.](https://semianalysi

### 2026-09-15 · Everyone Says Datacenter Moratoriums Are Killing the US Buildout. We disagree
_300+ moratoriums mapped, 20GW sits inside a restricted local boundary, 1,525MW actually slips, 2.3GW nationwide including New York_

- **Authors:** ["Maya Barkin", "Reyk Knuhtsen", "Jeremie Eliahou Ontiveros", "Dylan Patel"]
- **Access:** paid-preview
- **URL:** https://newsletter.semianalysis.com/p/everyone-says-datacenter-moratoriums
- **Corpus file:** `intelligence/_external_sources/semianalysis/2026-09-15-everyone-says-datacenter-moratoriums.md`

> The debate on US datacenters has never been so politically charged. Four states have acted in under two months. New York has stopped issuing environmental permits for datacenters, Texas has paused the next step in its massive ERCOT interconnection queue, Pennsylvania has pulled datacenters out of fast-track permitting and made state permits conditional on new guardrails, and Oregon has frozen datacenter deals on state-owned land.  Beyond the state level, more than 300 towns, cities and counties

### 2026-09-14 · Vera Rubin NVL72 Agentic Inference: 67x better Performance per Dollar
_Jensen Sandbagging Performance Again, 2x more Annual Profit Per GigaWatt, The More you Buy, The More you Earn, AgentX, InferenceX, Extreme Co-Design_

- **Authors:** ["Bryan Shan", "Alec Ibarra", "Cam Quilici", "Wenyao Gao", "Dylan Patel"]
- **Access:** paid-preview
- **URL:** https://newsletter.semianalysis.com/p/vera-rubin-nvl72-agentic-inference
- **Corpus file:** `intelligence/_external_sources/semianalysis/2026-09-14-vera-rubin-nvl72-agentic-inference.md`

> [Rubin is the first platform co-designed across six products for the agentic era: Rubin GPU, Vera CPU, NVLink 6 Switch, ConnectX-9, BlueField-4, and Spectrum-6.](https://newsletter.semianalysis.com/p/vera-rubin-extreme-co-design-an-evolution) Today we are publishing the first verified agentic inference results for Rubin, measured on our agentic inference benchmark, AgentX. Even on early pre-release software, the results already show why extreme co-design was necessary.  At GTC 2026, Jensen prese

### 2026-09-14 · A Brain Too Big to Carry — On-Device vs Datacenter Inference
_Robot Models, Silicon & DRAM Efficiency, Jetson Thor vs. B300 TCO, Deployments, The Network Wall_

- **Authors:** ["Ivan Chiam", "Gianluca", "Zane Fong", "Bryan Shan", "Dylan Patel", "Reyk Knuhtsen"]
- **Access:** paid-preview
- **URL:** https://newsletter.semianalysis.com/p/a-brain-too-big-to-carry-on-device
- **Corpus file:** `intelligence/_external_sources/semianalysis/2026-09-14-a-brain-too-big-to-carry-on-device.md`

> # Where should the brain of the robot go?  So far, AI has mostly lived behind a screen. Chatbots answered questions. Then agents started driving software and finishing multi-step tasks on their own. The next step is AI that acts in the physical world, and the biggest piece of that is robots. It’s early. Nobody has settled the hardware, the models, or the economics.  ## The Embodiment Problem  With LLMs, the hardware bends to the model. Pour in as much data and compute as possible at training, th

### 2026-09-13 · Long Live the Short King: Why 4-hi HBM Wins
_Same Bandwidth, Fewer Dies: How 4-hi HBM Cuts Inference Costs and Makes Scarce DRAM Go Further_

- **Authors:** ["Myron Xie", "Bryan Shan", "Harrison Barclay", "Minjae Kang", "Dylan Patel"]
- **Access:** paid-preview
- **URL:** https://newsletter.semianalysis.com/p/long-live-the-short-king-why-4-hi
- **Corpus file:** `intelligence/_external_sources/semianalysis/2026-09-13-long-live-the-short-king-why-4-hi.md`

> High Bandwidth Memory has been a key technology enabling the AI revolution. Despite HBM’s high costs relative to other forms of memory, chip designers have packaged more and more HBM into AI accelerators. Customers push to design in newer generation HBM whilst also increasing capacity per XPU by adding more cubes, and with denser and higher stacks. This has led to HBM consuming an increasing share of total DRAM wafer capacity, resulting in the extreme DRAM shortage we see ourselves in today.  We

### 2026-09-11 · Nvidia’s Backstop Universe – Heads I Win, Tails Who Loses?
_The $11T AI Buildout, Nvidia’s Backstop Economics, and the Limits of Nvidia’s Balance Sheet_

- **Authors:** ["Daniel Nishball", "Oliver Kennon", "Terence Ong"]
- **Access:** paid-preview
- **URL:** https://newsletter.semianalysis.com/p/nvidias-backstop-universe-heads-i
- **Corpus file:** `intelligence/_external_sources/semianalysis/2026-09-11-nvidias-backstop-universe-heads-i.md`

> Follow the money behind the AI buildout with our [AI Compute, Capital and Markets Model](https://semianalysis.com/capital-and-markets/) - understand who is funding the expansion, how deals are structured, and where the risks sit. Contact our team [here](https://semianalysis.com/capital-and-markets/) to find out more.  We’re also hiring for SemiAnalysis’s Compute, Capital & Markets team. We have four openings across New York and Singapore:  - Senior Credit Markets Specialist - New York: 5-7 years


## ⊕ GITHUB COMMITS + RELEASES, last 24h

- **Subtensor (chain)** (COMMIT `d6dd557`, 2026-10-08 04:38) Allow subnet owners to configure PoW difficulty (#3217)  
  https://github.com/RaoFoundation/subtensor/commit/d6dd557a7e425701c8237d7e0e0cae84c25b682b
- **Subtensor (chain)** (RELEASE `v475`, 2026-10-07 20:40) Runtime 475  
  https://github.com/RaoFoundation/subtensor/releases/tag/v475
- **Subtensor (chain)** (COMMIT `d1718c9`, 2026-10-07 16:08) Merge pull request #3214 from RaoFoundation/basket-min-trade-sudo  
  https://github.com/RaoFoundation/subtensor/commit/d1718c99c34cf96abbf2bf09c0e9e48b945c76f5
- **Subtensor (chain)** (COMMIT `ba274b9`, 2026-10-07 15:52) bump spec  
  https://github.com/RaoFoundation/subtensor/commit/ba274b9fbe17b7248b991366192bdb081a1c02bc
- **Subtensor (chain)** (COMMIT `bf8fbed`, 2026-10-07 15:52) Merge branch 'main' into basket-min-trade-sudo  
  https://github.com/RaoFoundation/subtensor/commit/bf8fbed6b21cfde40e829e39426a1cfc5d2badef
- **Subtensor (chain)** (COMMIT `e8e410f`, 2026-10-07 15:38) fix ci  
  https://github.com/RaoFoundation/subtensor/commit/e8e410f2fc78edc2258a1a075863fcc5f6286a76

## ⊕ ECOSYSTEM BLOGS via RSS

_no new posts in the lookback window_

## ⊕ X via NITTER, voices we track

- @opentensor (Opentensor Foundation, Wed, 30 Sep 2026): Bitcoin used incentives to build the world’s largest specialized compute network. Bittensor is applying that same playbook to unite spare compute across the planet and build the world’s largest decentralized AI training network. Macrocosmos (@MacrocosmosAI) Just announced earlier today at @ExploitSummit in Montreal: the iota SDK and Liquid Compute. Liquid Compute is our disaggregated compute platform. It turns the long tail of global compute into capacity you can actually train on. The iota SDK powers any training workload across it, as if it were one cluster. We go to market in the coming wee  
  http://shitter.thepixora.com/opentensor/status/2105410895220220032#m
- @jaltucher (James Altucher, Wed, 30 Sep 2026): MY TOP 10. I love TV. I worked at HBO (in the 90s). I've been an advisor for shows ("Billions"), I've pitched shows to every studio. Here's my top 10. I've watched each of these at least 4 times. BUT...what should #10 be?? 1) Breaking Bad 2) Mad Men 3) Lost 4) Carnevale 5) Battlestar Galactica 6) Better Call Saul 7) Arrested Devekooment 8) Sopranos 9) Curb Your Enthusiasm  
  http://nitter.pp.ua/jaltucher/status/2105314083108974777#m
- @novogratz (Mike Novogratz, Wed, 23 Sep 2026): Thanks for making the trip to Lubbock, Mike — and for spending time with our Red Raider football team ahead of the game. Great to have you at @TexasTech, and even better to cap off the visit with a big win at the new @galaxyhq Stadium. This partnership is just getting started. #WreckEm! Mike Novogratz (@novogratz) Last Friday, I visited our flagship campus Helios in West Texas. Three years ago, this was still a bitcoin mining facility. Today Helios is a fully operational AI-ready campus with 133MW of critical IT capacity, and we’re just getting started! @galaxyhq is taking a big swing out here  
  http://nitter.pp.ua/CreightonForTX/status/2102869773776269419#m
- @tplr_ai (Templar, Wed, 23 Sep 2026): Video  
  http://nitter.meowing.monster/tplr_ai/status/2102792674118164542#m
- @tplr_ai (Templar, Wed, 23 Sep 2026): Read the blog: tplr.ai/publications/blog/sk… Link Fault tolerance in low-bandwidth model parallelism: exploring pipeline stage-skipping with boundary... We explore how the residual nature of the transformer architecture can be leveraged to mitigate hardware faults, and demonstrate that the compression-based implementation of low-bandwidth model... tplr.ai  
  http://nitter.meowing.monster/tplr_ai/status/2102792676676432160#m
- @tplr_ai (Templar, Wed, 23 Sep 2026): Video  
  http://shitter.thepixora.com/tplr_ai/status/2102792674118164542#m
- @tplr_ai (Templar, Wed, 23 Sep 2026): Read the blog: tplr.ai/publications/blog/sk… Link Fault tolerance in low-bandwidth model parallelism: exploring pipeline stage-skipping with boundary... We explore how the residual nature of the transformer architecture can be leveraged to mitigate hardware faults, and demonstrate that the compression-based implementation of low-bandwidth model... tplr.ai  
  http://shitter.thepixora.com/tplr_ai/status/2102792676676432160#m
- @novogratz (Mike Novogratz, Wed, 23 Sep 2026): Last Friday, I visited our flagship campus Helios in West Texas. Three years ago, this was still a bitcoin mining facility. Today Helios is a fully operational AI-ready campus with 133MW of critical IT capacity, and we’re just getting started! @galaxyhq is taking a big swing out here, and so is America. The move to build an AI future for this country is real, and none of it happens without the physical infrastructure. It starts with power, land, and hard-working people willing to put in the work to build a new future. Our partnership with @TechAthletics with Galaxy Stadium is part of investing  
  http://nitter.pp.ua/novogratz/status/2102773522292428868#m
- @covenant_ai (Covenant AI, Wed, 19 Aug 2026): RT @tplr_ai: ByteDance and Tencent each received 10,000 Nvidia H200 chips, the first big delivery after China eased import limits. Watch w…  
  http://nitter.pp.ua/covenant_ai/status/2090092134036648101#m
- @covenant_ai (Covenant AI, Wed, 19 Aug 2026): ByteDance and Tencent each received 10,000 Nvidia H200 chips, the first big delivery after China eased import limits. Watch what this does to the map. New compute lands in new regions. Supply chains stretch across borders. One export policy shift decides who can train what. None of that touches how a run schedules across nodes. Templar treats heterogeneous, cross-geography compute as the normal case. Runs that adapt to whichever nodes are open still finish when the supply picture moves. Financial Times (@FT) China eases limits on Nvidia H200 chips as AI race escalates ft.trib.al/B7WRmPI Link C  
  https://nitter.kareem.one/tplr_ai/status/2090069281270608148#m
- @shibshib89 (Ala Shaabana, Wed, 16 Sep 2026): LFG! Crucible Labs (@CrucibleLabs) Crucible Wallet Extension v2.1.1 is LIVE. This isn’t just an update. We rebuilt the entire wallet experience from the ground up. A completely new UI. More control over your TAO. More Bittensor tools built directly into your wallet. What’s new in v2.1.1: ✔️Completely updated UI + light/dark mode ✔️Claim rewards directly in the wallet ✔️Unified balance across TAO + alpha ✔️Universal Swap ✔️Transfer TAO + alpha ✔️Subnet discovery + detailed subnet views ✔️Multi-address support for seed phrases ✔️12 and 24 word seed phrase support ✔️Updated Smart Account + Reward  
  https://nitter.kareem.one/shibshib89/status/2100300168633761947#m
- @jaltucher (James Altucher, Wed, 16 Sep 2026): Working on an AI-powered end to end platform for designing optical and then quantum chips at $QCLS. More details and refinements later but you can check it out at VibeGDS.io - you just enter plain English for the chip you want and it will build it out, simulate, verify, etc. Of interest mostly to optical engineers.  
  http://nitter.pp.ua/jaltucher/status/2100262449685364904#m
- @tplr_ai (Templar, Wed, 16 Sep 2026): When using pipeline compression with fixed projections shared across layers, robustness improves further as seen in the figure below. This suggests that shared projectors align representations across stage boundaries, making bypasses less disruptive. 4/n  
  http://nitter.meowing.monster/tplr_ai/status/2100237714918367690#m
- @tplr_ai (Templar, Wed, 16 Sep 2026): When using pipeline compression with fixed projections shared across layers, robustness improves further as seen in the figure below. This suggests that shared projectors align representations across stage boundaries, making bypasses less disruptive. 4/n  
  http://shitter.thepixora.com/tplr_ai/status/2100237714918367690#m
- @tplr_ai (Templar, Wed, 16 Sep 2026): We’ve been researching fault tolerance in Crucible, Templar’s pre-training platform. The goal: keep training through node failures and make better use of unreliable workers and spot instances, without idling an entire model replica when one stage goes down. 1/n Video  
  http://nitter.meowing.monster/tplr_ai/status/2100237708186550642#m
- @covenant_ai (Covenant AI, Wed, 16 Sep 2026): We’ve been researching fault tolerance in Crucible, Templar’s pre-training platform. The goal: keep training through node failures and make better use of unreliable workers and spot instances, without idling an entire model replica when one stage goes down. 1/n Video  
  http://nitter.pp.ua/tplr_ai/status/2100237708186550642#m
- @tplr_ai (Templar, Wed, 16 Sep 2026): We’ve been researching fault tolerance in Crucible, Templar’s pre-training platform. The goal: keep training through node failures and make better use of unreliable workers and spot instances, without idling an entire model replica when one stage goes down. 1/n Video  
  http://shitter.thepixora.com/tplr_ai/status/2100237708186550642#m
- @covenant_ai (Covenant AI, Wed, 16 Sep 2026): We’ve been researching fault tolerance in Crucible, Templar’s pre-training platform. The goal: keep training through node failures and make better use of unreliable workers and spot instances, without idling an entire model replica when one stage goes down. 1/n Video  
  https://nitter.kareem.one/tplr_ai/status/2100237708186550642#m
- @lium_io (Lium, Wed, 09 Sep 2026): lium.io Month in review: $964k billed to 1187 renters (36% MoM growth). 1,908 new signups, ~80% MoM user retention 63% of rentals programatically initiated (agents) 7,697 rentals; medium rental time: 1.15 hours.  
  http://nitter.pp.ua/lium_io/status/2097824624117473549#m
- @lium_io (Lium, Wed, 09 Sep 2026): lium.io Month in review: $964k billed to 1187 renters (36% MoM growth). 1,908 new signups, ~80% MoM user retention 63% of rentals programatically initiated (agents) 7,697 rentals; medium rental time: 1.15 hours.  
  http://shitter.thepixora.com/lium_io/status/2097824624117473549#m
- @shibshib89 (Ala Shaabana, Wed, 09 Sep 2026): Did you hear? Crucible Wallet is officially live on iOS today. An easy to use Bittensor wallet with Ledger security, Unified Swap and subnet level performance. Now available on iOS in the US, Android and Chrome. Download at CrucibleLabs.com #Bittensor #TAO #CrucibleWallet  
  https://nitter.kareem.one/CrucibleLabs/status/2097815766473323006#m
- @shibshib89 (Ala Shaabana, Wed, 09 Sep 2026): We are officially on iOS! Onwards 🚀 Crucible Labs (@CrucibleLabs) A long time coming and officially here. Crucible Wallet is now available on iOS in the US. An easy, intuitive Bittensor wallet for your everyday TAO needs, with Unified Swap, portfolio tracking and Ledger support wherever you go. Already available on Google Play and Chrome Store. Download at CrucibleLabs.com #CrucibleWallet #TAO #Bittensor — https://nitter.kareem.one/CrucibleLabs/status/2097699938209857625#m  
  https://nitter.kareem.one/shibshib89/status/2097724813028516224#m
- @wallstreetbets (WallStreetBets (X), Wed, 07 Oct 2026): the black swan might be closer than we thought Justin Drake (@drakefjustin) Today I call upon the blockchain industry to calmly begin planning for "bunker mode". My personal recommendation is to set in motion a controlled mass migration of assets to fresh addresses, i.e. addresses whose pubkeys remain hidden behind a hash. Holders, starting with large and sophisticated ones, should consider moving the bulk of their funds to addresses that have never signed a transaction. And when they do sign one, they should also move remaining funds to a new address (possibly generated from the same seed phr  
  http://nitter.meowing.monster/wallstreetbets/status/2107973890857128279#m
- @wallstreetbets (WallStreetBets (X), Wed, 07 Oct 2026): privacy feels way more relevant with where everything is going $ZEC feels like BTC 10 years ago quantum bitcoin makes sense to me too... hearing some things around $NEAR and $QTC in Singapore 👀 WallStreetBets (@wallstreetbets) Article Crypto &amp; AI Privacy Is Inevitable Onchain privacy is being repriced. YTD, we’ve seen the narrative dominate industry discussions, with $ZEC (+159%), $VVV (+1,693%), $NEAR (+237%), and $ARX (+122%) becoming standout performers in — http://nitter.meowing.monster/wallstreetbets/status/2107184527663640722#m  
  http://nitter.meowing.monster/wallstreetbets/status/2107964955307979240#m
- @SemiAnalysis_ (SemiAnalysis, Wed, 07 Oct 2026): Watch Now: redirect.invidious.io/2NviLP2SwZI?si=DHQX… Link Ep. 036 - $200 Buys $12,000 of Opus Tokens, We Bought Every Plan (Tokenomics) Pay Anthropic $200 a month and you can pull $12,000 of Opus 5.5 tok... youtube.com  
  http://shitter.thepixora.com/SemiAnalysis_/status/2107950799783411948#m
- @dylan522p (Dylan Patel, Wed, 07 Oct 2026): A $200 AI subscription can be worth $12,000 in tokens. Which plan delivers it is not close. "They're selling to willing buyers at the fair market price. This is capitalism." "You can pay $200 for a Claude plan and get $12,000 of Opus 5.5 tokens at API pricing. So that's obviously a good deal." "You have to say the $200 plan, when running a particular workload on a particular model, gives you some dollar amount. But then you also have 5.5, which is a beast. $6K or $5,000 worth of value." "And when you do that comparison, it's not even a question of who's providing more value. ChatGPT versus Ant  
  http://nitter.meowing.monster/SemiAnalysis_/status/2107950798638354671#m
- @dylan522p (Dylan Patel, Wed, 07 Oct 2026): A $200 AI subscription can be worth $12,000 in tokens. Which plan delivers it is not close. "They're selling to willing buyers at the fair market price. This is capitalism." "You can pay $200 for a Claude plan and get $12,000 of Opus 5.5 tokens at API pricing. So that's obviously a good deal." "You have to say the $200 plan, when running a particular workload on a particular model, gives you some dollar amount. But then you also have 5.5, which is a beast. $6K or $5,000 worth of value." "And when you do that comparison, it's not even a question of who's providing more value. ChatGPT versus Ant  
  http://shitter.thepixora.com/SemiAnalysis_/status/2107950798638354671#m
- @JosephJacks_ (Joseph Jacks, Wed, 07 Oct 2026): We’ve lost an icon. Margaret Hamilton, a computer science pioneer best known for her work at MIT leading development of the flight software for the Apollo missions to the moon, has died at 90. Read about her legacy via MIT News: news.mit.edu/2026/margaret-h…  
  http://nitter.pp.ua/MIT/status/2107945104321208752#m
- @JosephJacks_ (Joseph Jacks, Wed, 07 Oct 2026): Good illustration of what people mean by saying, "the closed frontier is 3-6 months ahead of open-weight" Older example of when these two labs became agentic (Anthropic Dec 2025, DeepSeek May 2026) Seems like closed keeps opening new capabilities that open then saturates.  
  http://nitter.pp.ua/PeterJ_Walker/status/2107940066211582298#m
- @SemiAnalysis_ (SemiAnalysis, Wed, 07 Oct 2026): 1/ Three weeks from day 0, DeepSeek-V4.1-Flash on vLLM runs 1.9× faster at low concurrency and delivers 5.3× the throughput at 150 TPS per user on @SemiAnalysis_ AgentX. Here is how, with interactive figures you can step through 🧵 vllm.ai/blog/2026-10-07-deep… Link DeepSeek-V4.1-Flash on vLLM: 5x Agentic Throughput Since Day 0 Within three weeks of release, vLLM made DeepSeek-V4.1-Flash 1.9x faster at low concurrency and lifted its throughput 5x on SemiAnalysis AgentX, with SWA bounde vllm.ai  
  http://shitter.thepixora.com/vllm_project/status/2107934535749140841#m
- @VantaTrading (Vanta, Wed, 07 Oct 2026): Which prop firm actually pays? Here's our answer: $857,337 paid to traders so far. 303 rewards to 116 traders, and every one is on a public ledger anyone can open. Watch it move: app.vantatrading.io/rewards  
  http://nitter.pp.ua/VantaTrading/status/2107931543721349197#m
- @VantaTrading (Vanta, Wed, 07 Oct 2026): Which prop firm actually pays? Here's our answer: $857,337 paid to traders so far. 303 rewards to 116 traders, and every one is on a public ledger anyone can open. Watch it move: app.vantatrading.io/rewards  
  https://nitter.kareem.one/VantaTrading/status/2107931543721349197#m
- @SemiAnalysis_ (SemiAnalysis, Wed, 07 Oct 2026): From our testing, it seems like a lot of the National Compute Public Research GPUs are located at Crusoe's Denver data center. (2/2)  
  http://shitter.thepixora.com/SemiAnalysis_/status/2107910453774971249#m
- @a16zcrypto (a16z Crypto, Wed, 07 Oct 2026): Wall Street runs on Excel... But what if you had an Excel sheet that anyone could access and everyone agreed on? Video  
  http://nitter.meowing.monster/a16zcrypto/status/2107903725826388057#m
- @novogratz (Mike Novogratz, Wed, 07 Oct 2026): Proud son Army Football (@ArmyWP_Football) Alongside the @NFFNetwork, we are set to honor the late Bob Novogratz, a 2026 College Football Hall of Fame inductee, this Saturday with a National Football Foundation &amp; College Football Hall of Fame On-Campus salute! MORE → goarmywestpoint.com/news/202… #GoArmy — http://nitter.pp.ua/ArmyWP_Football/status/2107857478507778411#m  
  http://nitter.pp.ua/novogratz/status/2107898542325195167#m
- @lium_io (Lium, Wed, 07 Oct 2026): dashboard here: grafana.lium.io/d/gpu-demand…  
  http://nitter.pp.ua/lium_io/status/2107896491008209332#m
- @lium_io (Lium, Wed, 07 Oct 2026): dashboard here: grafana.lium.io/d/gpu-demand…  
  http://shitter.thepixora.com/lium_io/status/2107896491008209332#m
- @lium_io (Lium, Wed, 07 Oct 2026): Utilization is at an all time high, we are fully rented out of most GPU types on our platform. This is a call for anyone with spare GPUs to rent them out through lium! The process is super simple and you get paid 95%+ of rental fees + payments even while unrented! The full setup is less than 10 minutes. start here: provider.lium.io/  
  http://nitter.pp.ua/lium_io/status/2107895913930768749#m
- @lium_io (Lium, Wed, 07 Oct 2026): Utilization is at an all time high, we are fully rented out of most GPU types on our platform. This is a call for anyone with spare GPUs to rent them out through lium! The process is super simple and you get paid 95%+ of rental fees + payments even while unrented! The full setup is less than 10 minutes. start here: provider.lium.io/  
  http://shitter.thepixora.com/lium_io/status/2107895913930768749#m
- @VantaTrading (Vanta, Wed, 07 Oct 2026): thinking about launching a trading competition with a $5,000 bonus pool paid out in the Vanta Network token... just need my boss to let me do it 🤔 can you guys help me out and blow up @0xarrash's notifications? - the VT intern  
  http://nitter.pp.ua/VantaTrading/status/2107891205375770727#m
- @VantaTrading (Vanta, Wed, 07 Oct 2026): thinking about launching a trading competition with a $5,000 bonus pool paid out in the Vanta Network token... just need my boss to let me do it 🤔 can you guys help me out and blow up @0xarrash's notifications? - the VT intern  
  https://nitter.kareem.one/VantaTrading/status/2107891205375770727#m
- @JosephJacks_ (Joseph Jacks, Wed, 07 Oct 2026): Liquid 🤝 @nvidia @NVIDIARobotics ✨ NVIDIA Robotics (@NVIDIARobotics) Congratulations to Liquid AI on Open d1. 👏 Two open-weight decision models deliver answers in a single forward pass on NVIDIA Jetson Thor, Jetson AGX Orin and Orin Nano. Visit Jetson AI Lab to learn how to run these models on Jetson: d1-3B🔗 jetson-ai-lab.com/models/d1-… d1-omni-600M🔗 jetson-ai-lab.com/models/d1-… — http://nitter.pp.ua/NVIDIARobotics/status/2107888685173903527#m  
  http://nitter.pp.ua/liquidai/status/2107889074292084861#m
- @wallstreetbets (WallStreetBets (X), Wed, 07 Oct 2026): sorry babe, im too locked in  
  http://nitter.meowing.monster/wallstreetbets/status/2107886172085071993#m
- @wallstreetbets (WallStreetBets (X), Wed, 07 Oct 2026): are you in?  
  http://nitter.meowing.monster/wallstreetbets/status/2107876568269980011#m
- @wallstreetbets (WallStreetBets (X), Wed, 07 Oct 2026): your wallet remembers all your decisions might be time to get wicked Wick (@wick_xyz) Rug pulls. Liquidations. Tops bought. Bottoms sold. You survived it all. That history counts on Wick. Join before the waitlist closes: wick.xyz/waitlist Video — http://nitter.meowing.monster/wick_xyz/status/2107848895233753487#m  
  http://nitter.meowing.monster/wallstreetbets/status/2107854166161011003#m
- @SemiAnalysis_ (SemiAnalysis, Wed, 07 Oct 2026): IREN continues to come up in our conversations with neocloud customers, and usually for the wrong reasons. In Prince George and Mackenzie in Northern BC, Canada, we’ve heard the stories: multi-day power outages, network upgrades, storage failures, air quality controls leading to link flaps, XIDs everywhere. The #1 worst site in the industry, according to users. And we are some of their users, as we’ve gotten to test IREN GPUs from multiple providers that resell their capacity. A lot of our users we are hearing from who aren’t having a good time aren’t renting from IREN resellers, but from IREN  
  http://shitter.thepixora.com/SemiAnalysis_/status/2107848521638416506#m
- @YumaGroup (Yuma Holdings, Wed, 07 Oct 2026): The Yuma Large Cap Fund gained 29.0% in September on a USD basis, as its larger subnet holdings outperformed the broader subnet market. It was Yuma's strongest fund in Q3, up 64.6% vs. 48.0% for bittensor:native. The fund's composition is analogous to how the Mag 7 represent a concentrated allocation to dominant technology companies in public markets. Learn more about Yuma Asset Management funds at go.yumaai.com/utdUl Disclosure in thread.  
  http://nitter.meowing.monster/YumaGroup/status/2107825978659488218#m
- @YumaGroup (Yuma Holdings, Wed, 07 Oct 2026): For informational purposes only. Not an offer or solicitation. Not investment advice. Do your own research. Past performance ≠ future results.  
  http://nitter.meowing.monster/YumaGroup/status/2107825980601414060#m
- @JosephJacks_ (Joseph Jacks, Wed, 07 Oct 2026): btw the local AI setup on umbrelOS 2.0: - install Ollama - install Open WebUI - that's it it finds your GPU on its own (NVIDIA, AMD, Intel, even Thunderbolt eGPUs) and you're chatting with your local AI model in seconds Video  
  http://nitter.pp.ua/umbrel/status/2107793792288055651#m
- @lium_io (Lium, Wed, 07 Oct 2026): We just integrated @lium_io TPN Bench now sources GPUs from Lium (Subnet 51) alongside @runpod Every benchmark request checks price and availability across both, choosing the most cost efficient hardware to run on. Part of the compute behind TPN Bench now comes from Bittensor itself. bittensor:native  
  http://nitter.pp.ua/TPN_Labs/status/2107784017596534989#m


---
_Generated at 2026-10-08T04:49:38.040355+00:00 by scripts/intel/aggregate.py. Treat this digest as input context, not as ground truth. Verify before quoting._
