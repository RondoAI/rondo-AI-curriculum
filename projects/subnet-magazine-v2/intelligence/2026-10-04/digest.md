# Intelligence Digest, 2026-10-04

_Single-file briefing for the daily research agent. Sources listed in trust order: human-curated notes first, then objective (github), then editorial (RSS), then volume (X via Nitter)._


## ⊕ HUMAN-CURATED NOTES, last 7 days

_no human notes in the window_

## ⊕ MACRO BACKDROP via SEMIANALYSIS, 12 most recent posts

_SemiAnalysis is the most-cited semiconductor and AI infrastructure publication in the industry. They do NOT cover Bittensor. The Oracle uses this corpus for any claim about hyperscaler compute, GPU economics, datacenter power, foundry capacity, memory pricing, lab unit economics. DO NOT cite SemiAnalysis for any Bittensor-specific claim. Full archive (289 posts, May 2020 onwards) lives at `intelligence/_external_sources/semianalysis/` with an `INDEX.md` table of contents. Paywalled posts show only subtitle + free preview; free posts have the full body extracted._

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

### 2026-09-10 · What is So Hard About Behind-The-Meter Power For Datacenters? Part 1
_Dumb Science Experiments vs. Money Printing Machines_

- **Authors:** ["Ellie Holbrook", "Robert Boswall", "Jeremie Eliahou Ontiveros", "Nicolas Bontigui", "Dylan Patel"]
- **Access:** paid-preview
- **URL:** https://newsletter.semianalysis.com/p/what-is-so-hard-about-behind-the
- **Corpus file:** `intelligence/_external_sources/semianalysis/2026-09-10-what-is-so-hard-about-behind-the.md`

> [![](https://substackcdn.com/image/fetch/$s_!xp5B!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F0fe650d6-cdda-4d26-a83d-1e793cf406c0_1672x941.png)](https://substackcdn.com/image/fetch/$s_!xp5B!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F0fe650d6-cdda-4d26-a83d-1e793cf406c0_1672x941.png)  Last year we were the first to call out [Onsite Gas Generation


## ⊕ GITHUB COMMITS + RELEASES, last 24h

- **Subtensor (chain)** (COMMIT `f87cada`, 2026-10-03 22:13) Merge pull request #3208 from RaoFoundation/release-473  
  https://github.com/RaoFoundation/subtensor/commit/f87cada631f81d11683e715a9f059f693992e64a
- **Subtensor (chain)** (COMMIT `fe45599`, 2026-10-03 21:20) fix clone fee fixture stability  
  https://github.com/RaoFoundation/subtensor/commit/fe4559927bf56c3365fe3e15442e3f255f47da5d
- **Subtensor (chain)** (COMMIT `11b663b`, 2026-10-03 20:58) fix clone EVM fixture fees  
  https://github.com/RaoFoundation/subtensor/commit/11b663b0f79a6371e898fefbd2c8b0eef1ac2762
- **Subtensor (chain)** (COMMIT `e385739`, 2026-10-03 20:19) fix docs preview audit gate  
  https://github.com/RaoFoundation/subtensor/commit/e385739fb8d47d56b182d123ec2ee5795ca273d3
- **Subtensor (chain)** (COMMIT `6675c84`, 2026-10-03 19:49) fix generated storage binding  
  https://github.com/RaoFoundation/subtensor/commit/6675c84efc9dfc1dbdc9f594c48c9e416140d753

## ⊕ ECOSYSTEM BLOGS via RSS

_no new posts in the lookback window_

## ⊕ X via NITTER, voices we track

- @opentensor (Opentensor Foundation, Wed, 30 Sep 2026): Bitcoin used incentives to build the world’s largest specialized compute network. Bittensor is applying that same playbook to unite spare compute across the planet and build the world’s largest decentralized AI training network. Macrocosmos (@MacrocosmosAI) Just announced earlier today at @ExploitSummit in Montreal: the iota SDK and Liquid Compute. Liquid Compute is our disaggregated compute platform. It turns the long tail of global compute into capacity you can actually train on. The iota SDK powers any training workload across it, as if it were one cluster. We go to market in the coming wee  
  http://nitter.meowing.monster/opentensor/status/2105410895220220032#m
- @galaxyhq (Galaxy Digital, Wed, 30 Sep 2026): Galaxy is glad to have taken part in the inaugural Digital Assets Leadership Forum this week, hosted by Daman Virtual in partnership with the Dubai Department of Economy and Tourism. Managing Director, Bouchra Darwazah, who also serves as CEO of Galaxy Digital MENA, joined a panel alongside voices from government, regulation, banking and financial services to discuss where Dubai's digital asset ecosystem is heading next. We're looking forward to more of these conversations as the UAE’s digital asset market continues to scale.  
  http://nitter.meowing.monster/galaxyhq/status/2105369944560972017#m
- @jtledore (Jean-Thomas Ledoré, Wed, 30 Sep 2026): Demand for AI compute is growing far faster than the infrastructure being built to serve it. Sam Altman's stated goal for OpenAI is 250 GW by 2033, roughly a quarter of US generating capacity. If the trend holds, Epoch AI puts a single frontier training run at 4 to 16 GW.  
  https://nitter.kareem.one/MacrocosmosAI/status/2105360787145667021#m
- @polychain (Polychain Capital, Wed, 30 Sep 2026): THE BLOCK: DogeOS launched a public testnet for its zero-knowledge rollup, bringing EVM smart contracts to Dogecoin, with dogecoin:native used for gas fees. "I've spent half a decade encouraging people to take a chance on Dogecoin and to build in its ecosystem," said Timothy Stebbing, director of the Dogecoin Foundation. "My hopes are that DogeOS becomes the springboard for a wave of new utility engineering."  
  http://shitter.thepixora.com/TheBlockCo/status/2105359920795394451#m
- @opentensor (Opentensor Foundation, Wed, 30 Sep 2026): “We need to make the Linux of AI.” @jon_durbin of @chutes_ai presented an 8B model trained across distributed gaming GPUs for roughly $6,500 in GPU rental. It runs entirely on a phone’s CPU at nearly 60 tokens per second. His full @ExploitSummit keynote explains how open-source development and decentralized training could give people control over AI from its creation to its everyday use. Video  
  http://nitter.meowing.monster/opentensor/status/2105353248836362289#m
- @opentensor (Opentensor Foundation, Wed, 30 Sep 2026): This Thursday on Novelty Search :: Subnet 80 :: @openroboto OpenRoboto is building an open competition for robot intelligence on Bittensor, where miners improve shared base models and each champion becomes the next starting point. They are now expanding into real robot validation and Shift, their decentralized network for collecting real world robotics data, connecting model improvement with physical data and commercial demand. Thursday :: 5PM EDT / 9PM UTC Hosted by @const_reborn  
  http://nitter.meowing.monster/opentensor/status/2105322199787700284#m
- @PanteraCapital (Pantera Capital, Wed, 30 Sep 2026): The next evolution of tokenization is here. Pantera’s latest State of Tokenization report highlights Ondo Intelligent Portfolios as the next step beyond individual tokenized stocks. “An entire portfolio becomes a single transferable token.” What this delivers: → DeFi composability → Multiple assets in one holding → Scheduled rebalancing via smart contracts With its first three portfolios powered by BlackRock, Ondo Intelligent Portfolios brings institutional investment strategies onchain. The next chapter of tokenization will expand what investors can access, how they build portfolios, and how   
  http://shitter.thepixora.com/Ondo/status/2105305938945057014#m
- @PanteraCapital (Pantera Capital, Wed, 30 Sep 2026): Issuing tokens onchain is now straightforward. Building liquid, compliant markets is the next step. Our CEO @doctorfission argues once fund positions can be sold on demand and used as collateral, they become fundamentally more useful. Read his full take in the Pantera report. Pantera Capital (@PanteraCapital) Pantera's latest State of Tokenization report is out. We analyzed the $332bn tokenization market across 671 assets. Institutions entered in force this quarter. J.P. Morgan, HSBC and Fidelity launched onchain products. BlackRock's BUIDL moved $441mn onchain in June, runs a $1bn daily redem  
  http://shitter.thepixora.com/FissionXYZ/status/2105303373503418762#m
- @galaxyhq (Galaxy Digital, Wed, 30 Sep 2026): NVIDIA Vera Rubin NVL72 is available on CoreWeave. @Cognition is running @devindevelopers in production on it, at up to 4.8x the total token throughput of GB200 NVL72. V100 in 2017. Vera Rubin today. Same platform, every generation. crwv.co/utcq5  
  http://nitter.meowing.monster/CoreWeave/status/2105288849719194040#m
- @polychain (Polychain Capital, Wed, 24 Jun 2026): EXCLUSIVE: a16z CSX-backed Cambrian raises $6 million seed to build blockchain data oracle network theblock.co/post/406028/a16z… Link a16z CSX-backed Cambrian raises $6 million seed to build blockchain data oracle network Cambrian’s new funding will expand its API and verifiable oracle network for institutions and AI agents, with Base and Solana already in production. theblock.co  
  http://shitter.thepixora.com/TheBlockCo/status/2069827932843909349#m
- @novogratz (Mike Novogratz, Wed, 23 Sep 2026): Thanks for making the trip to Lubbock, Mike — and for spending time with our Red Raider football team ahead of the game. Great to have you at @TexasTech, and even better to cap off the visit with a big win at the new @galaxyhq Stadium. This partnership is just getting started. #WreckEm! Mike Novogratz (@novogratz) Last Friday, I visited our flagship campus Helios in West Texas. Three years ago, this was still a bitcoin mining facility. Today Helios is a fully operational AI-ready campus with 133MW of critical IT capacity, and we’re just getting started! @galaxyhq is taking a big swing out here  
  https://nitter.kareem.one/CreightonForTX/status/2102869773776269419#m
- @tplr_ai (Templar, Wed, 23 Sep 2026): Read the blog: tplr.ai/publications/blog/sk… Link Fault tolerance in low-bandwidth model parallelism: exploring pipeline stage-skipping with boundary... We explore how the residual nature of the transformer architecture can be leveraged to mitigate hardware faults, and demonstrate that the compression-based implementation of low-bandwidth model... tplr.ai  
  https://nitter.kareem.one/tplr_ai/status/2102792676676432160#m
- @tplr_ai (Templar, Wed, 23 Sep 2026): Video  
  https://nitter.kareem.one/tplr_ai/status/2102792674118164542#m
- @novogratz (Mike Novogratz, Wed, 23 Sep 2026): Last Friday, I visited our flagship campus Helios in West Texas. Three years ago, this was still a bitcoin mining facility. Today Helios is a fully operational AI-ready campus with 133MW of critical IT capacity, and we’re just getting started! @galaxyhq is taking a big swing out here, and so is America. The move to build an AI future for this country is real, and none of it happens without the physical infrastructure. It starts with power, land, and hard-working people willing to put in the work to build a new future. Our partnership with @TechAthletics with Galaxy Stadium is part of investing  
  https://nitter.kareem.one/novogratz/status/2102773522292428868#m
- @tm0klc (Tim, Wed, 17 Jun 2026): Introducing Manako, the fastest way to turn any camera into an vision ai agent. Go on manako.ai. Join our waitlist. Video  
  http://nitter.meowing.monster/manakoai/status/2067298306200396197#m
- @tplr_ai (Templar, Wed, 16 Sep 2026): These results point toward training on a broader pool of compute, including unreliable workers and spot instances, while keeping healthy stages productive. Blog: tplr.ai/publications/blog/sk… n/n Link Fault tolerance in low-bandwidth model parallelism: exploring pipeline stage-skipping with boundary... We explore how the residual nature of the transformer architecture can be leveraged to mitigate hardware faults, and demonstrate that the compression-based implementation of low-bandwidth model... tplr.ai  
  https://nitter.kareem.one/tplr_ai/status/2100237717162303718#m
- @tplr_ai (Templar, Wed, 16 Sep 2026): When using pipeline compression with fixed projections shared across layers, robustness improves further as seen in the figure below. This suggests that shared projectors align representations across stage boundaries, making bypasses less disruptive. 4/n  
  https://nitter.kareem.one/tplr_ai/status/2100237714918367690#m
- @novogratz (Mike Novogratz, Wed, 16 Sep 2026): Our economy doesn’t work without immigration. We need at least 1.5-2mm new immigrants a year to create taxpayers and consumers to help us grow our way out of 40th in debt and to pay for an aging population. This isn’t political. It’s just math. We of course can decide what immigrants we take. From where, what educational level, wealth etc. that’s political. But the fact that we need them isn’t. Lisa Boothe (@LisaMarieBoothe) At this point, I am fine with shutting down all immigration, legal or not. It's a mess. — https://nitter.kareem.one/LisaMarieBoothe/status/2099891080258875467#m  
  https://nitter.kareem.one/novogratz/status/2100193741633929406#m
- @lium_io (Lium, Wed, 09 Sep 2026): lium.io Month in review: $964k billed to 1187 renters (36% MoM growth). 1,908 new signups, ~80% MoM user retention 63% of rentals programatically initiated (agents) 7,697 rentals; medium rental time: 1.15 hours.  
  http://nitter.meowing.monster/lium_io/status/2097824624117473549#m
- @lium_io (Lium, Wed, 09 Sep 2026): Steadily building the most decentralized GPU cloud Lium now has capacity from 68 datacenters across 21 countries Have GPUs? Join now. Lium pays you even for idle minutes. Make your nodes rentable in 5 minutes -&gt; docs.lium.io/providers/quick…  
  http://nitter.meowing.monster/lium_io/status/2097803045362966828#m
- @nigescore (Nige, Wed, 09 Sep 2026): .@nigescore going to paris last time he went to nrf in dallas he got us our biggest client ever (not announced yet) i can’t go. got something bigger on the 15th, 16th and 17th (to be announced) Manako (@manakoai) Heading to @nrfeurope NRF Retail’s Big Show Europe in Paris next week (15–17 Sept) 🇫🇷 If you are attending and want to hear what Manako Labs have built for retail, please DM and let’s meet up. No new hardware, no engineers, no code just your existing cameras doing more. #NRFRetailsBigShowEurope — https://nitter.kareem.one/manakoai/status/2097622722310242420#m  
  https://nitter.kareem.one/MaxSebti/status/2097630699129827589#m
- @PanteraCapital (Pantera Capital, Tue, 29 Sep 2026): 📈 Tokenization is moving from simply putting assets onchain to building real, programmable capital markets. @PanteraCapital’s latest State of Tokenization report highlights several areas where @Ondo Finance is helping push that evolution forward: 📍Distribution: $USDY had the largest reported holder base among tokenized rates products, with nearly 18,000 addresses as of June 30. 📍Tokenized equities: @Ondo is highlighted across the report’s analysis of the rapidly growing onchain equity market which Ondo Finance continues to lead. 📍Perps: @OndoPerps launched in July with 24/7 exposure to stocks,  
  http://shitter.thepixora.com/KatieAWheeler/status/2105057463666168136#m
- @PanteraCapital (Pantera Capital, Tue, 29 Sep 2026): New from @PanteraCapital's State of Tokenization: RWA distribution has broadened dramatically onchain. The leading chain’s share of tokenized value fell from 88% in 2023 to 45% today, as the market expanded across 24 chains. Pantera Capital (@PanteraCapital) Pantera's latest State of Tokenization report is out. We analyzed the $332bn tokenization market across 671 assets. Institutions entered in force this quarter. J.P. Morgan, HSBC and Fidelity launched onchain products. BlackRock's BUIDL moved $441mn onchain in June, runs a $1bn daily redemption facility, and is now accepted as collateral. O  
  http://shitter.thepixora.com/AlliumLabs/status/2105026778221703235#m
- @const_reborn (Jacob Steeves, Tue, 29 Sep 2026): We're excited to share that Bare Metal and Sandboxes are now live on Targon.com Bare Metal → An entire physical machine dedicated to your organization → No hypervisor, no container runtime, no noisy neighbors → Full control of kernel, drivers and firmware-level GPU settings → Every operator is KYC-verified, keeping workloads secure without TVM Sandboxes → Short-lived, isolated Linux environments for development, testing, previews and agents → Provisioning to running within seconds → Browser terminal, graphical Linux desktop or SSH → Fork independent copies for parallel experiments and agent ta  
  http://nitter.meowing.monster/TargonCompute/status/2105004608531939718#m
- @PanteraCapital (Pantera Capital, Tue, 29 Sep 2026): Tokenization is now a $332B market across 671 assets. Wall Street showed up in force this quarter: JPM, HSBC, Fidelity. Issuance is solved. Liquidity is the game now. Pantera Capital (@PanteraCapital) Pantera's latest State of Tokenization report is out. We analyzed the $332bn tokenization market across 671 assets. Institutions entered in force this quarter. J.P. Morgan, HSBC and Fidelity launched onchain products. BlackRock's BUIDL moved $441mn onchain in June, runs a $1bn daily redemption facility, and is now accepted as collateral. On the consumer side, Robinhood Chain hit $888mn in weekly   
  http://shitter.thepixora.com/veradittakit/status/2104994809308180676#m
- @galaxyhq (Galaxy Digital, Tue, 29 Sep 2026): BTC tests $88K on $2.4B in ETF inflows as the market defies macro headwinds. @RockawaysX @Ryanconnor joins to discuss esoteric onchain RWAs, where crypto and AI actually intersect, and the shifting crypto investment landscape. We also break down @vitalikbuterin updated vision for Ethereum and why AI agents might trigger a bank run. Galaxy Grid is live now👇 Video  
  http://nitter.meowing.monster/glxyresearch/status/2104977509993287724#m
- @tplr_ai (Templar, Tue, 29 Sep 2026): The heads of the biggest AI labs want to agree among themselves on when everyone should slow down. @TheEconomist's piece on that push ends with Covenant-72B, the model we finished training in March on GPUs contributed over the internet, as a reason such agreements may be hard to enforce. What the piece doesn't say is that once training no longer requires one giant, tightly connected cluster, the power to build new models no longer has to sit with a few companies. Globally distributed training and open models are essential tools for keeping that power from concentrating in the frontier labs. Th  
  https://nitter.kareem.one/tplr_ai/status/2104937831097352377#m
- @const_reborn (Jacob Steeves, Tue, 29 Sep 2026): RSI Training goes LIVE at 5 PM PT today! We’re giving each agent access to a production Slurm cluster, 1,000 GPU-hours, and 6 days to improve Nemotron 3.5 model performance. Watch it all happen live -&gt; rsiarena.org Video  
  http://nitter.meowing.monster/zhangchen_xu/status/2104879589726322875#m
- @polychain (Polychain Capital, Tue, 15 Sep 2026): It's time for a new foundation. Not a new start. Legacy Mode is live on Passport, keep every account you already have, on code anyone can inspect. Switch to open source hardware and software while keeping your existing accounts for supported assets. Here’s how. 🧵 Video  
  http://shitter.thepixora.com/FoundationHQ/status/2099865846101180499#m
- @nigescore (Nige, Tue, 15 Sep 2026): The physical world still can’t talk to software. A billion cameras watch factories, stations, warehouses, and stores every second. Almost none of that footage becomes action. That’s what we build at Manako. Today we join F/ai at @joinstationf The program that put OpenAI, Anthropic, Google, Meta, Microsoft and top-tier VCs behind a handful of AI-native teams. Honoured. Focused. Shipping.  
  https://nitter.kareem.one/manakoai/status/2099861562882203822#m
- @nigescore (Nige, Tue, 08 Sep 2026): Astra Ultra did not cook sports-grade vision AI. Gave it a 30s football clip from our subnet private track. Frame-level events, JSON, annotated video. Ground truth and the published scoring rules only after it committed. 22 predictions. 17 real events. 15 inside the action windows. 7 extras. 2 misses. Precision 68.18%. Recall 88.24%. F1 76.92%. Our Bittensor eval, SN44: 0%. Matches after timing decay: 16.538 False positives: −20.300 GT weight: 25.600 score = max(0, (16.538 − 20.300) / 25.600) = 0 Three extra take-ons and two extra tackles were 14.6 penalty points. It also misread the late inte  
  https://nitter.kareem.one/webuildscore/status/2097261685358596399#m
- @tm0klc (Tim, Tue, 07 Jul 2026): Subnet 44 @webuildscore is expanding. We’re incentivising training for a new vision-language model: Satori. Satori reasons AND grounds. It doesn’t just answer questions about an image. It points to the evidence. - Reason about scenes - Detect and segment objects - Read text - Count entities - Ground claims in pixels Most VLMs are split: strong reasoning OR strong grounding. Detection models localise, but can’t talk. Chatty VLMs describe fluently, but can’t prove it. Satori sits at the intersection. We’re starting with a 7B base model.  
  http://nitter.meowing.monster/tm0klc/status/2074298897305047101#m
- @dippy_ai (Dippy AI, Thu, 30 Jul 2026): Excited to have helped @PrunaAI collect 1M+ votes for image preference data in a very short time :~) Pruna AI (@PrunaAI) P-Image-Ideogram dominate the speed-quality and price-quality Pareto frontiers for image generation. It is the result of a unique collaboration with @ideogram_ai. - Four modes (Very low, low, medium, high) for 1K-2K image generation. - Optimal quality-efficiency with 0.4s-7.5s latency, and $0.003-$0.03 price. - Structured JSON control & exact color control. Available via our inference partners @Replicate @inference_sh @scenario_gg @wavespeed_ai @wiroai @magnific @prodialabs   
  https://nitter.kareem.one/datapointai/status/2082837314603032606#m
- @dippy_ai (Dippy AI, Thu, 27 Aug 2026): we have significantly upgraded both the basic and super models 🤩🤩 we have also made optimizations to improve response speeds by upto 5x can't wait for you all to experience and enjoy the new dippy 📯📯😸 rolling out to everyone today  
  https://nitter.kareem.one/dippy_ai/status/2093089771824226802#m
- @polychain (Polychain Capital, Thu, 25 Jun 2026): Article The Missing AI Layer Is Not Security. It&apos;s Authority. AI agents are now computer users. They browse websites. They read files. They write code. They call APIs. They log in to accounts. They handle credentials, use tools, and take actions across software  
  http://shitter.thepixora.com/zherbert/status/2070178183333171395#m
- @zeussubnet (Zeus Subnet, Thu, 24 Sep 2026): 🤯 4 hours of latency advantage with a model that's more accurate than both EC's IFS ENS &amp; Google's new state-of-the-art model WeatherNext 3, on 100m wind in 0-48H window Zeus | SN 18 (@zeussubnet) An hour and a half. That's how fast Zeus delivers a new weather run. That's 4× faster than IFS (6h) and nearly 5× faster than Google's new WeatherNext 3 (7h). And it's not winning on speed alone. 👇 We’ve put WeatherNext 3 head-to-head with our Zeus Pro and the industry-standard IFS ENS. On 2m temperature, Zeus has been consistently more accurate than both throughout August. — http://shitter.thepi  
  http://shitter.thepixora.com/egillwx/status/2103159277405843965#m
- @zeussubnet (Zeus Subnet, Thu, 24 Sep 2026): An hour and a half. That's how fast Zeus delivers a new weather run. That's 4× faster than IFS (6h) and nearly 5× faster than Google's new WeatherNext 3 (7h). And it's not winning on speed alone. 👇 We’ve put WeatherNext 3 head-to-head with our Zeus Pro and the industry-standard IFS ENS. On 2m temperature, Zeus has been consistently more accurate than both throughout August.  
  http://shitter.thepixora.com/zeussubnet/status/2103125660398981184#m
- @novogratz (Mike Novogratz, Thu, 17 Sep 2026): Thank you @SECPaulSAtkins @HesterPeirce @MarkUyedaUS for leading on digital asset policy !!! Innovation exemption moves tokenization ahead. Proud to be first on Nasdaq to tokenize shares. More to come with tokenized $GLXY ! U.S. Securities and Exchange Commission (@SECGov) 🚨 TODAY: The SEC issued an order granting temporary, conditional exemptive relief to Tokenized Securities Venues from the definition of “exchange” in the Exchange Act to trade tokenized NMS stock using innovative permissioned automated market makers and liquidity pools. — https://nitter.kareem.one/SECGov/status/2100571317128  
  https://nitter.kareem.one/novogratz/status/2100587469708140836#m
- @polychain (Polychain Capital, Thu, 13 Aug 2026): LBTC proved demand for yield-bearing Bitcoin. Today, we double down on that thesis. LBTC is moving to institutional yield. @Bitwise will manage a covered-call options strategy with a 4.5-year legacy track record, to generate LBTC's yield, targeting 2.5% net APY paid in Bitcoin.  
  http://shitter.thepixora.com/Lombard_Finance/status/2087887552300933626#m
- @dippy_ai (Dippy AI, Thu, 04 Jun 2026): Today, we’re opening up Datapoint AI for anyone to use. It is by far the fastest way to understand what your customers want. Type a question. Real people answer. You get a report back in ~10 minutes, not three weeks, and at a fraction of the cost. Video  
  https://nitter.kareem.one/datapointai/status/2062563294880075837#m
- @nigescore (Nige, Thu, 03 Sep 2026): Shell and ENI stations added to roll out today. Accelerate.  
  https://nitter.kareem.one/MaxSebti/status/2095545005540552752#m
- @jtledore (Jean-Thomas Ledoré, Thu, 01 Oct 2026): so it begins Score (@webuildscore) September was the first month we broke even. Two private track partners are now long-term paid clients. We’re converting clients faster than before, still in sports, and now in fuel retail and security via Manako. Details will be shared in separate posts. That was the signal we were waiting for. Buybacks (and burn this time) of sn44 have started from our owner address. First ones are in: 9 × 1,044 and 1 × 4,444. Not from Manako. Purely from the subnet. We will not talk about them. No schedules, no amounts, no marketing. A buyback today says nothing about tomo  
  https://nitter.kareem.one/MaxSebti/status/2105780064344490191#m
- @jtledore (Jean-Thomas Ledoré, Thu, 01 Oct 2026): September was the first month we broke even. Two private track partners are now long-term paid clients. We’re converting clients faster than before, still in sports, and now in fuel retail and security via Manako. Details will be shared in separate posts. That was the signal we were waiting for. Buybacks (and burn this time) of sn44 have started from our owner address. First ones are in: 9 × 1,044 and 1 × 4,444. Not from Manako. Purely from the subnet. We will not talk about them. No schedules, no amounts, no marketing. A buyback today says nothing about tomorrow. It could be $1,044 on day 1 a  
  https://nitter.kareem.one/webuildscore/status/2105779835591098873#m
- @galaxyhq (Galaxy Digital, Thu, 01 Oct 2026): Galaxy’s Head of Lending Max Bareiss (@Game_Set_Max) sat down with John Gillen and Greg Feibus (Global Head of Capital Markets, Sky Frontier Foundation) to talk through the Galaxy x Sky partnership and what it means for institutional DeFi. They get into why we're using sUSDS for treasury management, how yield-bearing assets could end up as institutional-grade collateral, and Sky's pitch for sUSDS as an "onchain Treasury bill" for crypto markets. Milk Road Crypto (@milkroaddaily) .@galaxyhq putting $100M into @SkyMoney's sUSDS matters for one reason: They’re not treating DeFi like a speculative  
  http://nitter.meowing.monster/galaxyhq/status/2105739618603995353#m
- @novogratz (Mike Novogratz, Sun, 27 Sep 2026): Congrats @Scaramucci on this launch! You are one of the hardest working buys in the biz!! Anthony Scaramucci (@Scaramucci) All The Wrong Moves is #1 in the United States National Government category on Amazon. Get the hardcover copy: amzn.to/3VSdRhj Get the audiobook (read by me): amzn.to/4ydOXqV — https://nitter.kareem.one/Scaramucci/status/2104001152316809589#m  
  https://nitter.kareem.one/novogratz/status/2104250567115641310#m
- @dippy_ai (Dippy AI, Sun, 09 Aug 2026): We are experiencing an issue with our database provider @supabase , so the app &amp; website may be down for a few more hours. We’ll send a notification when we are able to recover and the app is back to normal! Apologies for the inconvenience 😿😿  
  https://nitter.kareem.one/dippy_ai/status/2086595242422149540#m
- @lium_io (Lium, Sun, 06 Sep 2026): Cost: $5.60/h ÷ 52.2M output tok/h = $0.107 per million tokens. OpenRouter's cheapest FP8 provider lists the same model at $0.90/M  
  http://nitter.meowing.monster/lium_io/status/2096626336693375483#m
- @lium_io (Lium, Sun, 06 Sep 2026): We just ran Qwen3.6 35B at 14,499 tokens per second. on 1 lium GPU. 85% cheaper than Openrouter. how you can do it too ⬇️  
  http://nitter.meowing.monster/lium_io/status/2096626330808828216#m
- @wallstreetbets (WallStreetBets (X), Sun, 04 Oct 2026): still waiting btw  
  http://shitter.thepixora.com/wallstreetbets/status/2106555683067826400#m
- @nigescore (Nige, Sat, 19 Sep 2026): We’re completing our first 20 reference deployments, led by our CEO and engineering team, and the headline finding is that Manako is genuinely plug and play. No specialist integration required: a unit can be shipped to site and connected by anyone on the ground. That’s what makes our next phase possible. Our integration partners will roll out at scale on a simple, repeatable install, with less time on site and lower cost per deployment.  
  https://nitter.kareem.one/manakoai/status/2101403529558577403#m


---
_Generated at 2026-10-04T03:45:24.498329+00:00 by scripts/intel/aggregate.py. Treat this digest as input context, not as ground truth. Verify before quoting._
