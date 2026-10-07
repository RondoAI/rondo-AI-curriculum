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

- **Subtensor (chain)** (COMMIT `faaa14b`, 2026-10-06 18:58) Merge pull request #3213 from RaoFoundation/fix-opencl-c-char-arm64  
  https://github.com/RaoFoundation/subtensor/commit/faaa14bbcf11098e0ef8139f16115d5d07b4ac92
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
- @tplr_ai (Templar, Wed, 23 Sep 2026): Read the blog: tplr.ai/publications/blog/sk… Link Fault tolerance in low-bandwidth model parallelism: exploring pipeline stage-skipping with boundary... We explore how the residual nature of the transformer architecture can be leveraged to mitigate hardware faults, and demonstrate that the compression-based implementation of low-bandwidth model... tplr.ai  
  https://nitter.kareem.one/tplr_ai/status/2102792676676432160#m
- @tplr_ai (Templar, Wed, 23 Sep 2026): Video  
  https://nitter.kareem.one/tplr_ai/status/2102792674118164542#m
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
- @shibshib89 (Ala Shaabana, Wed, 09 Sep 2026): Did you hear? Crucible Wallet is officially live on iOS today. An easy to use Bittensor wallet with Ledger security, Unified Swap and subnet level performance. Now available on iOS in the US, Android and Chrome. Download at CrucibleLabs.com #Bittensor #TAO #CrucibleWallet  
  http://nitter.pp.ua/CrucibleLabs/status/2097815766473323006#m
- @shibshib89 (Ala Shaabana, Wed, 09 Sep 2026): We are officially on iOS! Onwards 🚀 Crucible Labs (@CrucibleLabs) A long time coming and officially here. Crucible Wallet is now available on iOS in the US. An easy, intuitive Bittensor wallet for your everyday TAO needs, with Unified Swap, portfolio tracking and Ledger support wherever you go. Already available on Google Play and Chrome Store. Download at CrucibleLabs.com #CrucibleWallet #TAO #Bittensor — http://nitter.pp.ua/CrucibleLabs/status/2097699938209857625#m  
  http://nitter.pp.ua/shibshib89/status/2097724813028516224#m
- @nigescore (Nige, Wed, 09 Sep 2026): .@nigescore going to paris last time he went to nrf in dallas he got us our biggest client ever (not announced yet) i can’t go. got something bigger on the 15th, 16th and 17th (to be announced) Manako (@manakoai) Heading to @nrfeurope NRF Retail’s Big Show Europe in Paris next week (15–17 Sept) 🇫🇷 If you are attending and want to hear what Manako Labs have built for retail, please DM and let’s meet up. No new hardware, no engineers, no code just your existing cameras doing more. #NRFRetailsBigShowEurope — http://nitter.pp.ua/manakoai/status/2097622722310242420#m  
  http://nitter.pp.ua/MaxSebti/status/2097630699129827589#m
- @webuildscore (Score, Wed, 07 Oct 2026): Score Studio update: 143 individual free users. 3% converted* Early users gave us a lot of feedback, so we’re rebuilding the product around it. The changes are big enough that we’ll relaunch across the main platforms. Goal: the smartest Vision AI companion on the market. *Individual users only. Does not include B2B partners paying for subnet outcomes.  
  http://nitter.pp.ua/webuildscore/status/2107780725260919131#m
- @1inch (1inch, Wed, 07 Oct 2026): Tokenization is happening. But how efficient is DeFi, really? Could we ever see price discovery happening on-chain? Post-Aqua, we sat down to talk liquidity with Bebop CEO @katiabanina, Curve founder Michael Egorov @newmichwill, @Dragonfly Partner @tomhschmidt and our very own CPTO Holly Atkinson @holdoesdev. Catch the full conversation tomorrow at 9AM ET on Youtube: piped.video/jgpWD-ONkcQ Link 2026: The State of DeFi Liquidity | Michael Egorov, Bebop, Dragonfly and 1inch Phil Ormrod talks to Michael Egorov (founder of Curve Finance, now ... youtube.com  
  http://nitter.meowing.monster/1inch/status/2107777753890144709#m
- @markjeffrey (Mark Jeffrey, Wed, 07 Oct 2026): The 'this is fine' meme in real life: Wall Street Mav (@WallStreetMav) This is basically how all liberals react as their society crashes around them. They ignore it and don't even consider reversing course. Open borders, illiterate economic policy or insane energy policy ... liberals will never admit their ideas just suck. Video — http://nitter.pp.ua/WallStreetMav/status/2107688227260031090#m  
  http://nitter.pp.ua/markjeffrey/status/2107712422765293685#m
- @markjeffrey (Mark Jeffrey, Wed, 07 Oct 2026): Native Bitcoin backed loans in USDC on Eth / whatever chain? Stani (@StaniKulechov) Bitcoin-backed loans directly on @circle Mint. Powered by @aave. — http://nitter.pp.ua/StaniKulechov/status/2107698068288364803#m  
  http://nitter.pp.ua/markjeffrey/status/2107711350139203809#m
- @markjeffrey (Mark Jeffrey, Wed, 07 Oct 2026): Wait. That's REAL??? Why is this not AI??? This one time, I want it to be AI and it's not and now I won't be able to sleep. Brian Roemmele (@BrianRoemmele) Walk This Way Rosy-Lipped Fish The red-lipped batfish or Galápagos batfish (Ogcocephalus darwini) is a fish of unusual morphology found around the Galápagos Islands at depths of 3 to 76 m (10 to 249 ft). Red-lipped batfish are closely related to rosy-lipped batfish (Ogcocephalus porrectus), which are found near Cocos Island off the Pacific coast of Costa Rica. Batfish (females in video) are not good swimmers; they use their highly adapted p  
  http://nitter.pp.ua/markjeffrey/status/2107701886900134236#m
- @KyleSamani (Kyle Samani, Wed, 07 Oct 2026): Got a new @Backpack  
  http://shitter.thepixora.com/KyleSamani/status/2107668464538386899#m
- @SemiAnalysis_ (SemiAnalysis, Wed, 07 Oct 2026): InferenceX, the leading open-source ML systems performance dashboard, now has a GTA theme, in addition to CSGO and Minecraft. What themes should we add next? (1/2)🧵  
  http://nitter.pp.ua/SemiAnalysis_/status/2107667373331218454#m
- @SemiAnalysis_ (SemiAnalysis, Wed, 07 Oct 2026): Check the dashboard out yourself👇️ (2/2) inferencex.com Link Open-Source Agentic Inference Benchmark | InferenceX Compare AgentX, InferenceX&apos;s long-context, multi-turn coding scenario, with fixed-sequence AI inference across chips and frameworks. Public NVIDIA and AMD runs update when configurations change. inferencex.semianalysis.com  
  http://nitter.pp.ua/SemiAnalysis_/status/2107667375306756585#m
- @markjeffrey (Mark Jeffrey, Wed, 07 Oct 2026): Hurry up, little red GrubHub car. Start moving on the map. I'm hungry,  
  http://nitter.pp.ua/markjeffrey/status/2107662595507601425#m
- @markjeffrey (Mark Jeffrey, Wed, 07 Oct 2026): When will you people learn that leverage is the Great Satan? ESPECIALLY with crypto??? The Kobeissi Letter (@KobeissiLetter) BREAKING: Bitcoin falls nearly -$2,000 in 20 minutes as $400 million worth of levered longs are liquidated in under one hour. — http://nitter.pp.ua/KobeissiLetter/status/2107654242794410383#m  
  http://nitter.pp.ua/markjeffrey/status/2107660984638935515#m
- @VantaTrading (Vanta, Wed, 07 Oct 2026): No minimum days. No consistency rule. No time limit. One 10% target and two 5% loss limits - that's every rule on a Vanta Classic evaluation. Read the whole rulebook before you pay: vantatrading.io/rules  
  http://shitter.thepixora.com/VantaTrading/status/2107652194430496852#m
- @JosephJacks_ (Joseph Jacks, Wed, 07 Oct 2026): Models are the last moat in software. AI can train on essays and rewrite them. AI can decompile software and recode it. AI can ingest art and recreate it. But AI itself doesn’t want to be “distilled.” Expect more software to retreat to the server and resist “distillation.” Eric S. Raymond (@esrtweet) This is the doom I predicted a few days ago, coming for Photoshop. A clean-room open-source reimplementation. No prizes for guessing that they decompiled Photoshop to source code, processed that to some kind of non-code specification language, then fed the spec to an LLM with an instruction to gen  
  http://shitter.thepixora.com/naval/status/2107648710918410670#m
- @shibshib89 (Ala Shaabana, Wed, 02 Sep 2026): Crucible Labs dropping #downwiththedev Episode 1. We breakdown the Mobile Wallet with @buildwithsamp. Take a listen. Video  
  http://nitter.pp.ua/CrucibleLabs/status/2095144290376937770#m
- @PanteraCapital (Pantera Capital, Tue, 29 Sep 2026): New from @PanteraCapital's State of Tokenization: RWA distribution has broadened dramatically onchain. The leading chain’s share of tokenized value fell from 88% in 2023 to 45% today, as the market expanded across 24 chains. Pantera Capital (@PanteraCapital) Pantera's latest State of Tokenization report is out. We analyzed the $332bn tokenization market across 671 assets. Institutions entered in force this quarter. J.P. Morgan, HSBC and Fidelity launched onchain products. BlackRock's BUIDL moved $441mn onchain in June, runs a $1bn daily redemption facility, and is now accepted as collateral. O  
  http://nitter.pp.ua/AlliumLabs/status/2105026778221703235#m
- @TargonCompute (Targon, Tue, 29 Sep 2026): The Manifold team is enjoying Montreal at Exploit Summit, where we're announcing new features and roadmaps. As part of our new release rollout, we've launched Bare Metal and Sandboxes on Targon: a full physical machine when you need the whole box, and disposable Linux environments when you don't. Thanks for building with us.  
  https://nitter.kareem.one/manifoldlabs/status/2105007116033409172#m
- @TargonCompute (Targon, Tue, 29 Sep 2026): Try Bare Metal &amp; Sandboxes now on Targon.com Link Targon Scale with Secure GPU &amp; CPU Rentals on a Lightning-Fast Cloud for Training and Deployment targon.com  
  https://nitter.kareem.one/TargonCompute/status/2105004611392160070#m
- @const_reborn (Jacob Steeves, Tue, 29 Sep 2026): We're excited to share that Bare Metal and Sandboxes are now live on Targon.com Bare Metal → An entire physical machine dedicated to your organization → No hypervisor, no container runtime, no noisy neighbors → Full control of kernel, drivers and firmware-level GPU settings → Every operator is KYC-verified, keeping workloads secure without TVM Sandboxes → Short-lived, isolated Linux environments for development, testing, previews and agents → Provisioning to running within seconds → Browser terminal, graphical Linux desktop or SSH → Fork independent copies for parallel experiments and agent ta  
  http://shitter.thepixora.com/TargonCompute/status/2105004608531939718#m
- @a16zcrypto (a16z Crypto, Tue, 29 Sep 2026): zk.money is back. A self-custodial wallet that lets you send and receive crypto privately. Your money, private by default. Reserve your unique tag to get started. launch.zk.money Link zk.money Join zk.money to send or receive crypto privately. Open source, self-custodial, built on Ethereum. zk.money  
  http://shitter.thepixora.com/zk_money/status/2104966293199945975#m
- @tplr_ai (Templar, Tue, 29 Sep 2026): The heads of the biggest AI labs want to agree among themselves on when everyone should slow down. @TheEconomist's piece on that push ends with Covenant-72B, the model we finished training in March on GPUs contributed over the internet, as a reason such agreements may be hard to enforce. What the piece doesn't say is that once training no longer requires one giant, tightly connected cluster, the power to build new models no longer has to sit with a few companies. Globally distributed training and open models are essential tools for keeping that power from concentrating in the frontier labs. Th  
  https://nitter.kareem.one/tplr_ai/status/2104937831097352377#m
- @const_reborn (Jacob Steeves, Tue, 29 Sep 2026): RSI Training goes LIVE at 5 PM PT today! We’re giving each agent access to a production Slurm cluster, 1,000 GPU-hours, and 6 days to improve Nemotron 3.5 model performance. Watch it all happen live -&gt; rsiarena.org Video  
  http://shitter.thepixora.com/zhangchen_xu/status/2104879589726322875#m
- @covenant_ai (Covenant AI, Tue, 25 Aug 2026): Templar's work reduces to one question. How much of the machine-learning lifecycle can run across ordinary networks instead of a single datacentre? Pre-training answered first, with Covenant-72B as the proof at scale. Post-training followed through our communication-efficiency research. Serving open models on distributed hardware is the piece we are working on now, and it is the one that puts the whole arc in front of users. The internet is the datacentre.  
  https://nitter.kareem.one/tplr_ai/status/2092267948765237743#m
- @covenant_ai (Covenant AI, Tue, 25 Aug 2026): Templar's work reduces to one question. How much of the machine-learning lifecycle can run across ordinary networks instead of a single datacentre? Pre-training answered first, with Covenant-72B as the proof at scale. Post-training followed through our communication-efficiency research. Serving open models on distributed hardware is the piece we are working on now, and it is the one that puts the whole arc in front of users. The internet is the datacentre.  
  http://shitter.thepixora.com/tplr_ai/status/2092267948765237743#m
- @jaltucher (James Altucher, Tue, 22 Sep 2026): Welcome to Bittensor. Here's why you should stay and diamond-hand $TAO.  
  http://nitter.pp.ua/taodaily_io/status/2102390629422567556#m


---
_Generated at 2026-10-07T10:47:56.422444+00:00 by scripts/intel/aggregate.py. Treat this digest as input context, not as ground truth. Verify before quoting._
