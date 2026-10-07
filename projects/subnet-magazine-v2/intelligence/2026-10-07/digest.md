# Intelligence Digest, 2026-10-07

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

- **Subtensor (chain)** (COMMIT `d1718c9`, 2026-10-07 16:08) Merge pull request #3214 from RaoFoundation/basket-min-trade-sudo  
  https://github.com/RaoFoundation/subtensor/commit/d1718c99c34cf96abbf2bf09c0e9e48b945c76f5
- **Subtensor (chain)** (COMMIT `ba274b9`, 2026-10-07 15:52) bump spec  
  https://github.com/RaoFoundation/subtensor/commit/ba274b9fbe17b7248b991366192bdb081a1c02bc
- **Subtensor (chain)** (COMMIT `bf8fbed`, 2026-10-07 15:52) Merge branch 'main' into basket-min-trade-sudo  
  https://github.com/RaoFoundation/subtensor/commit/bf8fbed6b21cfde40e829e39426a1cfc5d2badef
- **Subtensor (chain)** (COMMIT `e8e410f`, 2026-10-07 15:38) fix ci  
  https://github.com/RaoFoundation/subtensor/commit/e8e410f2fc78edc2258a1a075863fcc5f6286a76
- **Subtensor (chain)** (COMMIT `faaa14b`, 2026-10-06 18:58) Merge pull request #3213 from RaoFoundation/fix-opencl-c-char-arm64  
  https://github.com/RaoFoundation/subtensor/commit/faaa14bbcf11098e0ef8139f16115d5d07b4ac92
- **Subtensor (chain)** (COMMIT `d1c4cbf`, 2026-10-06 16:42) fix CI  
  https://github.com/RaoFoundation/subtensor/commit/d1c4cbf3491076bfc672c09a0dd9456ea4de1626
- **Subtensor (chain)** (COMMIT `f220f86`, 2026-10-06 16:26) make basket minimum trade amount sudo-adjustable  
  https://github.com/RaoFoundation/subtensor/commit/f220f869d274bee2a26fdd836c06bac7548984d3
- **Subtensor (chain)** (COMMIT `55aacb1`, 2026-10-06 14:06) Check SDK crates on Linux arm64 in PR CI  
  https://github.com/RaoFoundation/subtensor/commit/55aacb179c0095f7ece95f1391b2ec032d2ff282
- **Subtensor (chain)** (COMMIT `431ecac`, 2026-10-06 14:06) Fix bittensor-core OpenCL build on aarch64 Linux  
  https://github.com/RaoFoundation/subtensor/commit/431ecac52956126bee27ecc8f5f2bf12227e72b9
- **Subtensor (chain)** (COMMIT `0221412`, 2026-10-06 12:18) Merge pull request #3206 from RaoFoundation/feat/null-consensus-v2  
  https://github.com/RaoFoundation/subtensor/commit/02214123eb6d1aae01812fe515f0e0535c9b9da0

## ⊕ ECOSYSTEM BLOGS via RSS

_no new posts in the lookback window_

## ⊕ X via NITTER, voices we track

- @TargonCompute (Targon, Wed, 30 Sep 2026): NEWS: @TargonCompute says NVIDIA B300 GPUs are now available on demand on Targon. This adds an on-demand Blackwell deployment option. Targon (@TargonCompute) NVIDIA B300s are now available on demand. Secure GPUs are selling out fast on Targon, Ready to deploy on Blackwell? Grab yours now at targon.com/inventory — https://nitter.kareem.one/TargonCompute/status/2105325236639973561#m  
  https://nitter.kareem.one/taodotcom/status/2105392902587249005#m
- @a16zcrypto (a16z Crypto, Wed, 30 Sep 2026): New markets have changed what people can trade and how. In the last decade, blockchains have started lowering the cost of building markets, making it easier to experiment with net new ones.  
  http://shitter.thepixora.com/a16zcrypto/status/2105372522967708073#m
- @a16zcrypto (a16z Crypto, Wed, 30 Sep 2026): New markets have changed what people can trade and how. In the last decade, blockchains have started lowering the cost of building markets, making it easier to experiment with net new ones.  
  http://nitter.meowing.monster/a16zcrypto/status/2105372522967708073#m
- @dylan522p (Dylan Patel, Wed, 30 Sep 2026): A lot of people tell me they use agents to build xyz Thing is, some people have an accent or say it quickly And so I hear we use Asians to build xyz Which is like... Well ya that's been the global economy for the last few decades.  
  http://nitter.meowing.monster/dylan522p/status/2105367125611237551#m
- @polychain (Polychain Capital, Wed, 30 Sep 2026): THE BLOCK: DogeOS launched a public testnet for its zero-knowledge rollup, bringing EVM smart contracts to Dogecoin, with dogecoin:native used for gas fees. "I've spent half a decade encouraging people to take a chance on Dogecoin and to build in its ecosystem," said Timothy Stebbing, director of the Dogecoin Foundation. "My hopes are that DogeOS becomes the springboard for a wave of new utility engineering."  
  http://nitter.pp.ua/TheBlockCo/status/2105359920795394451#m
- @polychain (Polychain Capital, Wed, 30 Sep 2026): THE BLOCK: DogeOS launched a public testnet for its zero-knowledge rollup, bringing EVM smart contracts to Dogecoin, with dogecoin:native used for gas fees. "I've spent half a decade encouraging people to take a chance on Dogecoin and to build in its ecosystem," said Timothy Stebbing, director of the Dogecoin Foundation. "My hopes are that DogeOS becomes the springboard for a wave of new utility engineering."  
  http://nitter.meowing.monster/TheBlockCo/status/2105359920795394451#m
- @TargonCompute (Targon, Wed, 30 Sep 2026): NVIDIA B300s are now available on demand. Secure GPUs are selling out fast on Targon, Ready to deploy on Blackwell? Grab yours now at targon.com/inventory  
  https://nitter.kareem.one/TargonCompute/status/2105325236639973561#m
- @jaltucher (James Altucher, Wed, 30 Sep 2026): MY TOP 10. I love TV. I worked at HBO (in the 90s). I've been an advisor for shows ("Billions"), I've pitched shows to every studio. Here's my top 10. I've watched each of these at least 4 times. BUT...what should #10 be?? 1) Breaking Bad 2) Mad Men 3) Lost 4) Carnevale 5) Battlestar Galactica 6) Better Call Saul 7) Arrested Devekooment 8) Sopranos 9) Curb Your Enthusiasm  
  http://nitter.pp.ua/jaltucher/status/2105314083108974777#m
- @jaltucher (James Altucher, Wed, 30 Sep 2026): MY TOP 10. I love TV. I worked at HBO (in the 90s). I've been an advisor for shows ("Billions"), I've pitched shows to every studio. Here's my top 10. I've watched each of these at least 4 times. BUT...what should #10 be?? 1) Breaking Bad 2) Mad Men 3) Lost 4) Carnevale 5) Battlestar Galactica 6) Better Call Saul 7) Arrested Devekooment 8) Sopranos 9) Curb Your Enthusiasm  
  http://nitter.meowing.monster/jaltucher/status/2105314083108974777#m
- @PanteraCapital (Pantera Capital, Wed, 30 Sep 2026): The next evolution of tokenization is here. Pantera’s latest State of Tokenization report highlights Ondo Intelligent Portfolios as the next step beyond individual tokenized stocks. “An entire portfolio becomes a single transferable token.” What this delivers: → DeFi composability → Multiple assets in one holding → Scheduled rebalancing via smart contracts With its first three portfolios powered by BlackRock, Ondo Intelligent Portfolios brings institutional investment strategies onchain. The next chapter of tokenization will expand what investors can access, how they build portfolios, and how   
  http://nitter.pp.ua/Ondo/status/2105305938945057014#m
- @PanteraCapital (Pantera Capital, Wed, 30 Sep 2026): Issuing tokens onchain is now straightforward. Building liquid, compliant markets is the next step. Our CEO @doctorfission argues once fund positions can be sold on demand and used as collateral, they become fundamentally more useful. Read his full take in the Pantera report. Pantera Capital (@PanteraCapital) Pantera's latest State of Tokenization report is out. We analyzed the $332bn tokenization market across 671 assets. Institutions entered in force this quarter. J.P. Morgan, HSBC and Fidelity launched onchain products. BlackRock's BUIDL moved $441mn onchain in June, runs a $1bn daily redem  
  http://nitter.pp.ua/FissionXYZ/status/2105303373503418762#m
- @polychain (Polychain Capital, Wed, 24 Jun 2026): EXCLUSIVE: a16z CSX-backed Cambrian raises $6 million seed to build blockchain data oracle network theblock.co/post/406028/a16z… Link a16z CSX-backed Cambrian raises $6 million seed to build blockchain data oracle network Cambrian’s new funding will expand its API and verifiable oracle network for institutions and AI agents, with Base and Solana already in production. theblock.co  
  http://nitter.pp.ua/TheBlockCo/status/2069827932843909349#m
- @polychain (Polychain Capital, Wed, 24 Jun 2026): EXCLUSIVE: a16z CSX-backed Cambrian raises $6 million seed to build blockchain data oracle network theblock.co/post/406028/a16z… Link a16z CSX-backed Cambrian raises $6 million seed to build blockchain data oracle network Cambrian’s new funding will expand its API and verifiable oracle network for institutions and AI agents, with Base and Solana already in production. theblock.co  
  http://nitter.meowing.monster/TheBlockCo/status/2069827932843909349#m
- @novogratz (Mike Novogratz, Wed, 23 Sep 2026): Thanks for making the trip to Lubbock, Mike — and for spending time with our Red Raider football team ahead of the game. Great to have you at @TexasTech, and even better to cap off the visit with a big win at the new @galaxyhq Stadium. This partnership is just getting started. #WreckEm! Mike Novogratz (@novogratz) Last Friday, I visited our flagship campus Helios in West Texas. Three years ago, this was still a bitcoin mining facility. Today Helios is a fully operational AI-ready campus with 133MW of critical IT capacity, and we’re just getting started! @galaxyhq is taking a big swing out here  
  https://nitter.kareem.one/CreightonForTX/status/2102869773776269419#m
- @tplr_ai (Templar, Wed, 23 Sep 2026): Read the blog: tplr.ai/publications/blog/sk… Link Fault tolerance in low-bandwidth model parallelism: exploring pipeline stage-skipping with boundary... We explore how the residual nature of the transformer architecture can be leveraged to mitigate hardware faults, and demonstrate that the compression-based implementation of low-bandwidth model... tplr.ai  
  https://nitter.kareem.one/tplr_ai/status/2102792676676432160#m
- @tplr_ai (Templar, Wed, 23 Sep 2026): Video  
  https://nitter.kareem.one/tplr_ai/status/2102792674118164542#m
- @novogratz (Mike Novogratz, Wed, 23 Sep 2026): Last Friday, I visited our flagship campus Helios in West Texas. Three years ago, this was still a bitcoin mining facility. Today Helios is a fully operational AI-ready campus with 133MW of critical IT capacity, and we’re just getting started! @galaxyhq is taking a big swing out here, and so is America. The move to build an AI future for this country is real, and none of it happens without the physical infrastructure. It starts with power, land, and hard-working people willing to put in the work to build a new future. Our partnership with @TechAthletics with Galaxy Stadium is part of investing  
  https://nitter.kareem.one/novogratz/status/2102773522292428868#m
- @covenant_ai (Covenant AI, Wed, 19 Aug 2026): RT @tplr_ai: ByteDance and Tencent each received 10,000 Nvidia H200 chips, the first big delivery after China eased import limits. Watch w…  
  http://shitter.thepixora.com/covenant_ai/status/2090092134036648101#m
- @covenant_ai (Covenant AI, Wed, 19 Aug 2026): ByteDance and Tencent each received 10,000 Nvidia H200 chips, the first big delivery after China eased import limits. Watch what this does to the map. New compute lands in new regions. Supply chains stretch across borders. One export policy shift decides who can train what. None of that touches how a run schedules across nodes. Templar treats heterogeneous, cross-geography compute as the normal case. Runs that adapt to whichever nodes are open still finish when the supply picture moves. Financial Times (@FT) China eases limits on Nvidia H200 chips as AI race escalates ft.trib.al/B7WRmPI Link C  
  https://nitter.kareem.one/tplr_ai/status/2090069281270608148#m
- @shibshib89 (Ala Shaabana, Wed, 16 Sep 2026): LFG! Crucible Labs (@CrucibleLabs) Crucible Wallet Extension v2.1.1 is LIVE. This isn’t just an update. We rebuilt the entire wallet experience from the ground up. A completely new UI. More control over your TAO. More Bittensor tools built directly into your wallet. What’s new in v2.1.1: ✔️Completely updated UI + light/dark mode ✔️Claim rewards directly in the wallet ✔️Unified balance across TAO + alpha ✔️Universal Swap ✔️Transfer TAO + alpha ✔️Subnet discovery + detailed subnet views ✔️Multi-address support for seed phrases ✔️12 and 24 word seed phrase support ✔️Updated Smart Account + Reward  
  http://nitter.pp.ua/shibshib89/status/2100300168633761947#m
- @jaltucher (James Altucher, Wed, 16 Sep 2026): Working on an AI-powered end to end platform for designing optical and then quantum chips at $QCLS. More details and refinements later but you can check it out at VibeGDS.io - you just enter plain English for the chip you want and it will build it out, simulate, verify, etc. Of interest mostly to optical engineers.  
  http://nitter.pp.ua/jaltucher/status/2100262449685364904#m
- @jaltucher (James Altucher, Wed, 16 Sep 2026): Working on an AI-powered end to end platform for designing optical and then quantum chips at $QCLS. More details and refinements later but you can check it out at VibeGDS.io - you just enter plain English for the chip you want and it will build it out, simulate, verify, etc. Of interest mostly to optical engineers.  
  http://nitter.meowing.monster/jaltucher/status/2100262449685364904#m
- @tplr_ai (Templar, Wed, 16 Sep 2026): These results point toward training on a broader pool of compute, including unreliable workers and spot instances, while keeping healthy stages productive. Blog: tplr.ai/publications/blog/sk… n/n Link Fault tolerance in low-bandwidth model parallelism: exploring pipeline stage-skipping with boundary... We explore how the residual nature of the transformer architecture can be leveraged to mitigate hardware faults, and demonstrate that the compression-based implementation of low-bandwidth model... tplr.ai  
  https://nitter.kareem.one/tplr_ai/status/2100237717162303718#m
- @tplr_ai (Templar, Wed, 16 Sep 2026): When using pipeline compression with fixed projections shared across layers, robustness improves further as seen in the figure below. This suggests that shared projectors align representations across stage boundaries, making bypasses less disruptive. 4/n  
  https://nitter.kareem.one/tplr_ai/status/2100237714918367690#m
- @covenant_ai (Covenant AI, Wed, 16 Sep 2026): We’ve been researching fault tolerance in Crucible, Templar’s pre-training platform. The goal: keep training through node failures and make better use of unreliable workers and spot instances, without idling an entire model replica when one stage goes down. 1/n Video  
  https://nitter.kareem.one/tplr_ai/status/2100237708186550642#m
- @covenant_ai (Covenant AI, Wed, 16 Sep 2026): We’ve been researching fault tolerance in Crucible, Templar’s pre-training platform. The goal: keep training through node failures and make better use of unreliable workers and spot instances, without idling an entire model replica when one stage goes down. 1/n Video  
  http://shitter.thepixora.com/tplr_ai/status/2100237708186550642#m
- @foundrydigital (Foundry Digital, Wed, 11 Jan 2012): Expression Engine 2.0 review by the guys at Scriptiny bit.ly/w3Pg3R  
  http://nitter.meowing.monster/foundrydigital/status/157243024848596993#m
- @lium_io (Lium, Wed, 09 Sep 2026): lium.io Month in review: $964k billed to 1187 renters (36% MoM growth). 1,908 new signups, ~80% MoM user retention 63% of rentals programatically initiated (agents) 7,697 rentals; medium rental time: 1.15 hours.  
  http://nitter.pp.ua/lium_io/status/2097824624117473549#m
- @shibshib89 (Ala Shaabana, Wed, 09 Sep 2026): Did you hear? Crucible Wallet is officially live on iOS today. An easy to use Bittensor wallet with Ledger security, Unified Swap and subnet level performance. Now available on iOS in the US, Android and Chrome. Download at CrucibleLabs.com #Bittensor #TAO #CrucibleWallet  
  http://nitter.pp.ua/CrucibleLabs/status/2097815766473323006#m
- @shibshib89 (Ala Shaabana, Wed, 09 Sep 2026): We are officially on iOS! Onwards 🚀 Crucible Labs (@CrucibleLabs) A long time coming and officially here. Crucible Wallet is now available on iOS in the US. An easy, intuitive Bittensor wallet for your everyday TAO needs, with Unified Swap, portfolio tracking and Ledger support wherever you go. Already available on Google Play and Chrome Store. Download at CrucibleLabs.com #CrucibleWallet #TAO #Bittensor — http://nitter.pp.ua/CrucibleLabs/status/2097699938209857625#m  
  http://nitter.pp.ua/shibshib89/status/2097724813028516224#m
- @nigescore (Nige, Wed, 09 Sep 2026): .@nigescore going to paris last time he went to nrf in dallas he got us our biggest client ever (not announced yet) i can’t go. got something bigger on the 15th, 16th and 17th (to be announced) Manako (@manakoai) Heading to @nrfeurope NRF Retail’s Big Show Europe in Paris next week (15–17 Sept) 🇫🇷 If you are attending and want to hear what Manako Labs have built for retail, please DM and let’s meet up. No new hardware, no engineers, no code just your existing cameras doing more. #NRFRetailsBigShowEurope — http://nitter.pp.ua/manakoai/status/2097622722310242420#m  
  http://nitter.pp.ua/MaxSebti/status/2097630699129827589#m
- @nigescore (Nige, Wed, 09 Sep 2026): .@nigescore going to paris last time he went to nrf in dallas he got us our biggest client ever (not announced yet) i can’t go. got something bigger on the 15th, 16th and 17th (to be announced) Manako (@manakoai) Heading to @nrfeurope NRF Retail’s Big Show Europe in Paris next week (15–17 Sept) 🇫🇷 If you are attending and want to hear what Manako Labs have built for retail, please DM and let’s meet up. No new hardware, no engineers, no code just your existing cameras doing more. #NRFRetailsBigShowEurope — http://nitter.meowing.monster/manakoai/status/2097622722310242420#m  
  http://nitter.meowing.monster/MaxSebti/status/2097630699129827589#m
- @lium_io (Lium, Wed, 07 Oct 2026): dashboard here: grafana.lium.io/d/gpu-demand…  
  http://nitter.pp.ua/lium_io/status/2107896491008209332#m
- @lium_io (Lium, Wed, 07 Oct 2026): Utilization is at an all time high, we are fully rented out of most GPU types on our platform. This is a call for anyone with spare GPUs to rent them out through lium! The process is super simple and you get paid 95%+ of rental fees + payments even while unrented! The full setup is less than 10 minutes. start here: provider.lium.io/  
  http://nitter.pp.ua/lium_io/status/2107895913930768749#m
- @JosephJacks_ (Joseph Jacks, Wed, 07 Oct 2026): Congratulations to Liquid AI on Open d1. 👏 Two open-weight decision models deliver answers in a single forward pass on NVIDIA Jetson Thor, Jetson AGX Orin and Orin Nano. Visit Jetson AI Lab to learn how to run these models on Jetson: d1-3B🔗 jetson-ai-lab.com/models/d1-… d1-omni-600M🔗 jetson-ai-lab.com/models/d1-… Liquid AI (@liquidai) Today we release Open d1: two open-weight multimodal models in our d1 decision model family. &gt; d1-3B: text + vision &gt; d1-omni-600M: text + image or text + audio &gt; Real-time decision making anywhere, from data centers such as @nvidia DGX to RTX workstatio  
  http://nitter.pp.ua/NVIDIARobotics/status/2107888685173903527#m
- @webuildscore (Score, Wed, 07 Oct 2026): Can confirm the Vehicle Detector works on Rocket League. Can also confirm this is not what it was built for. Back to work. Gyro Zeppeli (@Gyrolens) Opened my laptop to work. Ended up running the Vehicle Detector from @webuildscore on every Rocket League replay I have. Send help, or more replays. Video — http://nitter.meowing.monster/Gyrolens/status/2107883451072286879#m  
  http://nitter.meowing.monster/webuildscore/status/2107886946219442675#m
- @JosephJacks_ (Joseph Jacks, Wed, 07 Oct 2026): Open-weight Jev is here: Meet our open-d1 decision models. Available on @huggingface Liquid AI (@liquidai) Today we release Open d1: two open-weight multimodal models in our d1 decision model family. &gt; d1-3B: text + vision &gt; d1-omni-600M: text + image or text + audio &gt; Real-time decision making anywhere, from data centers such as @nvidia DGX to RTX workstations to Jetson at the edge. 1/ — http://nitter.pp.ua/liquidai/status/2107878924831379676#m  
  http://nitter.pp.ua/mlech26l/status/2107882048476397615#m
- @markjeffrey (Mark Jeffrey, Wed, 07 Oct 2026): I had wondered when 'using Jev to mine Bittensor' was going to happen -- here we are. SOMA (@SomaSubnet) Jev is now available for all SOMA miners. Giving miners access to a decision model creates room for smarter, context-aware choices about what should be compressed and how aggressively. Upgrade your compressors for current competition! Video — https://nitter.kareem.one/SomaSubnet/status/2107879871720665090#m  
  https://nitter.kareem.one/markjeffrey/status/2107882001261109402#m
- @JosephJacks_ (Joseph Jacks, Wed, 07 Oct 2026): Most decisions don't need a big model. They need a fast one. Today we're open sourcing d1-3B, a vision-language decision model, and d1-omni-600M, which takes text, images and audio. Liquid AI (@liquidai) Today we release Open d1: two open-weight multimodal models in our d1 decision model family. &gt; d1-3B: text + vision &gt; d1-omni-600M: text + image or text + audio &gt; Real-time decision making anywhere, from data centers such as @nvidia DGX to RTX workstations to Jetson at the edge. 1/ — http://nitter.pp.ua/liquidai/status/2107878924831379676#m  
  http://nitter.pp.ua/Aurelien_L_/status/2107881969661153403#m
- @JosephJacks_ (Joseph Jacks, Wed, 07 Oct 2026): If you liked d1, here are its smaller siblings ;) Open weight, you can run them at 10ms end-to-end on-device. Liquid AI (@liquidai) Today we release Open d1: two open-weight multimodal models in our d1 decision model family. &gt; d1-3B: text + vision &gt; d1-omni-600M: text + image or text + audio &gt; Real-time decision making anywhere, from data centers such as @nvidia DGX to RTX workstations to Jetson at the edge. 1/ — http://nitter.pp.ua/liquidai/status/2107878924831379676#m  
  http://nitter.pp.ua/EdoardMosca/status/2107879782838940022#m
- @JosephJacks_ (Joseph Jacks, Wed, 07 Oct 2026): Tiny decision models you can run everywhere: &gt; d1-3B has impeccable performance in text and vision &gt; d1-omni-600M supports text, vision, and audio! Try our @huggingface space with interactive games today Liquid AI (@liquidai) Today we release Open d1: two open-weight multimodal models in our d1 decision model family. &gt; d1-3B: text + vision &gt; d1-omni-600M: text + image or text + audio &gt; Real-time decision making anywhere, from data centers such as @nvidia DGX to RTX workstations to Jetson at the edge. 1/ — http://nitter.pp.ua/liquidai/status/2107878924831379676#m  
  http://nitter.pp.ua/maximelabonne/status/2107879730116792620#m
- @1inch (1inch, Wed, 07 Oct 2026): RT @rsquare: @1inch has helped scale self custody for users since 2019! I remember using it during the early MVP days. They are now build…  
  http://nitter.meowing.monster/1inch/status/2107848933947089230#m
- @markjeffrey (Mark Jeffrey, Wed, 07 Oct 2026): How did our police get to behave in a way contrary to traditional British values MAGA Storm 47 (@MAGAStorm47) You’re allowed to wave Hamas flags. Hezbollah flags. Flags of the USSR. IRGC flags. ISIS flags. Gay pride flags. But don’t you dare wave the British flag or a police officer will confiscate it and arrest you for incitement and racism. Welcome to the UK. Video — https://nitter.kareem.one/MAGAStorm47/status/2107583679744667919#m  
  https://nitter.kareem.one/JohnCleese/status/2107837841015554328#m
- @1inch (1inch, Wed, 07 Oct 2026): 1inch is an early partner of Safe Pro 🤝 We’ve been working with the @SafeLabs_ team to shape it around how we run onchain ops. More structure, better visibility across accounts, while keeping control of our assets. Safe Labs (@SafeLabs_) Safe Pro is live: the most professional way to self-custody. If self-custody has become critical for your team, @Safe Pro was built for you. ❇️ Oversee all your Safe accounts in one Workspace ❇️ Monitor transactions continuously with Security Hub ❇️ Implement policy controls on every transaction. Your assets never leave your custody. Check out our new website   
  http://nitter.meowing.monster/1inch/status/2107834618544083037#m
- @zeussubnet (Zeus Subnet, Wed, 07 Oct 2026): Bittensor 101, featuring Zeus @mcjkula &amp; @TAOTemplar break it down at @ExploitSummit A great intro to Bittensor, and to what can be built on it 👇 Maciej Kula (@mcjkula) "The best person to solve your problem might be someone you’ve never met or considered hiring." Travis and I explain Bittensor, including examples from weather forecasting (@zeussubnet) and drug discovery (@metanova_labs). Here’s our "Bittensor 101" recording from @ExploitSummit Video — http://nitter.pp.ua/mcjkula/status/2107803570699722943#m  
  http://nitter.pp.ua/zeussubnet/status/2107830973811597696#m
- @YumaGroup (Yuma Holdings, Wed, 07 Oct 2026): For informational purposes only. Not an offer or solicitation. Not investment advice. Do your own research. Past performance ≠ future results.  
  https://nitter.kareem.one/YumaGroup/status/2107825980601414060#m
- @YumaGroup (Yuma Holdings, Wed, 07 Oct 2026): The Yuma Large Cap Fund gained 29.0% in September on a USD basis, as its larger subnet holdings outperformed the broader subnet market. It was Yuma's strongest fund in Q3, up 64.6% vs. 48.0% for bittensor:native. The fund's composition is analogous to how the Mag 7 represent a concentrated allocation to dominant technology companies in public markets. Learn more about Yuma Asset Management funds at go.yumaai.com/utdUl Disclosure in thread.  
  https://nitter.kareem.one/YumaGroup/status/2107825978659488218#m
- @1inch (1inch, Wed, 07 Oct 2026): Physics → banking → shipping 1inch Aqua. Our CPTO @holdoesdev is built different. Her full interview is in Drofa Comms Women Leading the Way 2026. 👇 holly (@holdoesdev) From physics and banking, to full-stack engineering in my thirties, and now as a CPTO in DeFi, most of my career has been spent in male-dominated environments. This experience has taught me to hyperfixate on contribution, rather than belonging. However, this does not mean ignoring systemic barriers: it means addressing the issues head on, while producing at the same time. I spoke with @DrofaComms for their "Women Leading the Wa  
  http://nitter.meowing.monster/1inch/status/2107806935722402098#m
- @mcjkula (mcjkula, Wed, 07 Oct 2026): "The best person to solve your problem might be someone you’ve never met or considered hiring." Travis and I explain Bittensor, including examples from weather forecasting (@zeussubnet) and drug discovery (@metanova_labs). Here’s our "Bittensor 101" recording from @ExploitSummit Video  
  http://nitter.pp.ua/mcjkula/status/2107803570699722943#m
- @1inch (1inch, Wed, 07 Oct 2026): Tokenized RWA market cap by 2030. Call it. Poll 39% — $1T to $10T 23% — $10T to $20T 38% — $30T+ 104 votes • 17 hours  
  http://nitter.meowing.monster/1inch/status/2107796256902816075#m


---
_Generated at 2026-10-07T18:17:27.058341+00:00 by scripts/intel/aggregate.py. Treat this digest as input context, not as ground truth. Verify before quoting._
