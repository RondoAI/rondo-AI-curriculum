# Intelligence Digest, 2026-10-06

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

- **Subtensor (chain)** (RELEASE `v473`, 2026-10-05 13:52) Runtime 473  
  https://github.com/RaoFoundation/subtensor/releases/tag/v473

## ⊕ ECOSYSTEM BLOGS via RSS

_no new posts in the lookback window_

## ⊕ X via NITTER, voices we track

- @dylan522p (Dylan Patel, Wed, 30 Sep 2026): A lot of people tell me they use agents to build xyz Thing is, some people have an accent or say it quickly And so I hear we use Asians to build xyz Which is like... Well ya that's been the global economy for the last few decades.  
  https://nitter.kareem.one/dylan522p/status/2105367125611237551#m
- @polychain (Polychain Capital, Wed, 30 Sep 2026): THE BLOCK: DogeOS launched a public testnet for its zero-knowledge rollup, bringing EVM smart contracts to Dogecoin, with dogecoin:native used for gas fees. "I've spent half a decade encouraging people to take a chance on Dogecoin and to build in its ecosystem," said Timothy Stebbing, director of the Dogecoin Foundation. "My hopes are that DogeOS becomes the springboard for a wave of new utility engineering."  
  https://nitter.kareem.one/TheBlockCo/status/2105359920795394451#m
- @dylan522p (Dylan Patel, Wed, 30 Sep 2026): Can't invest in Anthropic at 2 trillion because it could be a 0 and I'm fucked, or it could be 20 trillion, but at 20 trillion we are all fucked.  
  https://nitter.kareem.one/dylan522p/status/2105334504726692035#m
- @PanteraCapital (Pantera Capital, Wed, 30 Sep 2026): The next evolution of tokenization is here. Pantera’s latest State of Tokenization report highlights Ondo Intelligent Portfolios as the next step beyond individual tokenized stocks. “An entire portfolio becomes a single transferable token.” What this delivers: → DeFi composability → Multiple assets in one holding → Scheduled rebalancing via smart contracts With its first three portfolios powered by BlackRock, Ondo Intelligent Portfolios brings institutional investment strategies onchain. The next chapter of tokenization will expand what investors can access, how they build portfolios, and how   
  https://nitter.kareem.one/Ondo/status/2105305938945057014#m
- @PanteraCapital (Pantera Capital, Wed, 30 Sep 2026): Issuing tokens onchain is now straightforward. Building liquid, compliant markets is the next step. Our CEO @doctorfission argues once fund positions can be sold on demand and used as collateral, they become fundamentally more useful. Read his full take in the Pantera report. Pantera Capital (@PanteraCapital) Pantera's latest State of Tokenization report is out. We analyzed the $332bn tokenization market across 671 assets. Institutions entered in force this quarter. J.P. Morgan, HSBC and Fidelity launched onchain products. BlackRock's BUIDL moved $441mn onchain in June, runs a $1bn daily redem  
  https://nitter.kareem.one/FissionXYZ/status/2105303373503418762#m
- @dylan522p (Dylan Patel, Wed, 30 Sep 2026): AI is making papers cheaper to produce. ICLR submissions: 4,938 (2023), 7,262 (2024), 11,603 (2025), 19,525 (2026). Reported 2027 IDs exceed 62K, above roughly 56K paper submissions in all previous years COMBINED. Can reviewers keep up? (1/6)🧵  
  https://nitter.kareem.one/SemiAnalysis_/status/2105130561530421342#m
- @polychain (Polychain Capital, Wed, 24 Jun 2026): EXCLUSIVE: a16z CSX-backed Cambrian raises $6 million seed to build blockchain data oracle network theblock.co/post/406028/a16z… Link a16z CSX-backed Cambrian raises $6 million seed to build blockchain data oracle network Cambrian’s new funding will expand its API and verifiable oracle network for institutions and AI agents, with Base and Solana already in production. theblock.co  
  https://nitter.kareem.one/TheBlockCo/status/2069827932843909349#m
- @covenant_ai (Covenant AI, Wed, 19 Aug 2026): RT @tplr_ai: ByteDance and Tencent each received 10,000 Nvidia H200 chips, the first big delivery after China eased import limits. Watch w…  
  http://shitter.thepixora.com/covenant_ai/status/2090092134036648101#m
- @covenant_ai (Covenant AI, Wed, 16 Sep 2026): We’ve been researching fault tolerance in Crucible, Templar’s pre-training platform. The goal: keep training through node failures and make better use of unreliable workers and spot instances, without idling an entire model replica when one stage goes down. 1/n Video  
  http://shitter.thepixora.com/tplr_ai/status/2100237708186550642#m
- @lium_io (Lium, Wed, 09 Sep 2026): lium.io Month in review: $964k billed to 1187 renters (36% MoM growth). 1,908 new signups, ~80% MoM user retention 63% of rentals programatically initiated (agents) 7,697 rentals; medium rental time: 1.15 hours.  
  http://shitter.thepixora.com/lium_io/status/2097824624117473549#m
- @lium_io (Lium, Wed, 09 Sep 2026): Steadily building the most decentralized GPU cloud Lium now has capacity from 68 datacenters across 21 countries Have GPUs? Join now. Lium pays you even for idle minutes. Make your nodes rentable in 5 minutes -&gt; docs.lium.io/providers/quick…  
  http://shitter.thepixora.com/lium_io/status/2097803045362966828#m
- @PanteraCapital (Pantera Capital, Tue, 29 Sep 2026): 📈 Tokenization is moving from simply putting assets onchain to building real, programmable capital markets. @PanteraCapital’s latest State of Tokenization report highlights several areas where @Ondo Finance is helping push that evolution forward: 📍Distribution: $USDY had the largest reported holder base among tokenized rates products, with nearly 18,000 addresses as of June 30. 📍Tokenized equities: @Ondo is highlighted across the report’s analysis of the rapidly growing onchain equity market which Ondo Finance continues to lead. 📍Perps: @OndoPerps launched in July with 24/7 exposure to stocks,  
  https://nitter.kareem.one/KatieAWheeler/status/2105057463666168136#m
- @PanteraCapital (Pantera Capital, Tue, 29 Sep 2026): New from @PanteraCapital's State of Tokenization: RWA distribution has broadened dramatically onchain. The leading chain’s share of tokenized value fell from 88% in 2023 to 45% today, as the market expanded across 24 chains. Pantera Capital (@PanteraCapital) Pantera's latest State of Tokenization report is out. We analyzed the $332bn tokenization market across 671 assets. Institutions entered in force this quarter. J.P. Morgan, HSBC and Fidelity launched onchain products. BlackRock's BUIDL moved $441mn onchain in June, runs a $1bn daily redemption facility, and is now accepted as collateral. O  
  https://nitter.kareem.one/AlliumLabs/status/2105026778221703235#m
- @const_reborn (Jacob Steeves, Tue, 29 Sep 2026): We're excited to share that Bare Metal and Sandboxes are now live on Targon.com Bare Metal → An entire physical machine dedicated to your organization → No hypervisor, no container runtime, no noisy neighbors → Full control of kernel, drivers and firmware-level GPU settings → Every operator is KYC-verified, keeping workloads secure without TVM Sandboxes → Short-lived, isolated Linux environments for development, testing, previews and agents → Provisioning to running within seconds → Browser terminal, graphical Linux desktop or SSH → Fork independent copies for parallel experiments and agent ta  
  https://nitter.kareem.one/TargonCompute/status/2105004608531939718#m
- @const_reborn (Jacob Steeves, Tue, 29 Sep 2026): RSI Training goes LIVE at 5 PM PT today! We’re giving each agent access to a production Slurm cluster, 1,000 GPU-hours, and 6 days to improve Nemotron 3.5 model performance. Watch it all happen live -&gt; rsiarena.org Video  
  https://nitter.kareem.one/zhangchen_xu/status/2104879589726322875#m
- @oroagents (Oro, Tue, 29 Sep 2026): Commerce is going to prove to be one of the largest opportunities in the agent world. Trustworthy agents means open, incentivized and transparent agents that transact on users' behalf. great article by @CrucibleLabs. Let's make this future happen the right way. Crucible Labs (@CrucibleLabs) Article a BIT of Joy: Issue 11 The Agent Era Is Here For the last few years, the AI industry has talked about agents as the next big thing. At this point, the more interesting question isn&apos;t when agents arrive. They&apos;re already — http://nitter.meowing.monster/CrucibleLabs/status/2103188134238564440  
  http://nitter.meowing.monster/oroagents/status/2104794483745587425#m
- @covenant_ai (Covenant AI, Tue, 25 Aug 2026): Templar's work reduces to one question. How much of the machine-learning lifecycle can run across ordinary networks instead of a single datacentre? Pre-training answered first, with Covenant-72B as the proof at scale. Post-training followed through our communication-efficiency research. Serving open models on distributed hardware is the piece we are working on now, and it is the one that puts the whole arc in front of users. The internet is the datacentre.  
  http://shitter.thepixora.com/tplr_ai/status/2092267948765237743#m
- @oroagents (Oro, Tue, 22 Sep 2026): We're excited to announce ORO Bench today, a benchmark that's powered by a generator creating new synthetic shopping environments everyday. This is now powering our subnet on Bittensor, SN15. Video  
  http://nitter.meowing.monster/oroagents/status/2102475717367963815#m
- @polychain (Polychain Capital, Tue, 15 Sep 2026): It's time for a new foundation. Not a new start. Legacy Mode is live on Passport, keep every account you already have, on code anyone can inspect. Switch to open source hardware and software while keeping your existing accounts for supported assets. Here’s how. 🧵 Video  
  https://nitter.kareem.one/FoundationHQ/status/2099865846101180499#m
- @resilabsai (RESI, Tue, 07 Apr 2026): The power of holding Bittensor $TAO subnet alpha Here is an example to illustrate the flywheel of $TAO Let's say you 1,000 alpha of @resilabsai which cost around 7 $TAO 7 $TAO at a price of $310 = $2,170 Current alpha price of Resi, subnet 46: .0066 $TAO Let's make some calculated assumptions. &gt; price of resi alpha stays the same for 3 years &gt; price of $TAO remains the same at $310 &gt; APY for holding Resi alpha is 40% for the first 2 years, then 30% in year 3 What is my total value in 3 years? Year 1 (40% APY) 1,060.6 × 1.4 = 1,484.8 alpha In $TAO: 1,484.8 × 0.0066 ≈ 9.80 $TAO In USD:   
  https://nitter.kareem.one/Pop_Collapse/status/2041570023823528017#m
- @JosephJacks_ (Joseph Jacks, Tue, 06 Oct 2026): We give our d1 👁️👁️ in 1 week, time to have more fun 😉 Liquid AI (@liquidai) Announcing d1 with vision. 👁️👁️ Our first decision model now supports images, text or both as inputs. We tested d1 against GPT-6.1 Sol and Claude Opus 5.5 on six real applications, from filtering support tickets to inspecting circuit boards. d1 matches or beats GPT-6.1 Sol on four of them. It costs 19x to 200x less than both models and answers significantly faster on every task. &gt; probabilities for yes/no, choice, or score questions &gt; one forward pass, without generating tokens &gt; text decisions in 200 to 300   
  http://nitter.meowing.monster/justinli9527/status/2107297480711037420#m
- @VantaTrading (Vanta, Tue, 06 Oct 2026): From $129 to trading with $1,000,000. That's the only thing you ever buy. Pass it, get paid weekly, and Vanta can move a $50,000 or $100,000 up to a Pro account of up to $1,000,000 in capital at no additional cost. Get started today -&gt; app.vantatrading.io  
  http://shitter.thepixora.com/VantaTrading/status/2107289796582441332#m
- @covenant_ai (Covenant AI, Thu, 27 Aug 2026): A system designed around identical accelerators depends on a narrow hardware supply. Templar starts from a wider map. Accelerator generations vary, and network conditions change with location. The coordination layer has to treat both as design inputs.  
  http://shitter.thepixora.com/tplr_ai/status/2093022381660942660#m
- @polychain (Polychain Capital, Thu, 25 Jun 2026): Article The Missing AI Layer Is Not Security. It&apos;s Authority. AI agents are now computer users. They browse websites. They read files. They write code. They call APIs. They log in to accounts. They handle credentials, use tools, and take actions across software  
  https://nitter.kareem.one/zherbert/status/2070178183333171395#m
- @manakoai (Manako, Thu, 24 Sep 2026): next batch of stations to be deployed with @manakoai is going to allow us to leverage a lot more @webuildscore models. - 4 motorway stations. beasts with 40+ cameras each. - that’s 10x more cameras than on unmanned stations. - massive fuel forecourts, EV charging bays, car wash, restaurants, supermarkets, coffee areas. the second best news… is it’s with a new signed client 👀  
  http://nitter.meowing.monster/arnod3f/status/2103174097522098609#m
- @zeussubnet (Zeus Subnet, Thu, 24 Sep 2026): 🤯 4 hours of latency advantage with a model that's more accurate than both EC's IFS ENS &amp; Google's new state-of-the-art model WeatherNext 3, on 100m wind in 0-48H window Zeus | SN 18 (@zeussubnet) An hour and a half. That's how fast Zeus delivers a new weather run. That's 4× faster than IFS (6h) and nearly 5× faster than Google's new WeatherNext 3 (7h). And it's not winning on speed alone. 👇 We’ve put WeatherNext 3 head-to-head with our Zeus Pro and the industry-standard IFS ENS. On 2m temperature, Zeus has been consistently more accurate than both throughout August. — http://shitter.thepi  
  http://shitter.thepixora.com/egillwx/status/2103159277405843965#m
- @manakoai (Manako, Thu, 24 Sep 2026): Same week, different rooms, same vision Paris ✅ London ✅ Next?  
  http://nitter.meowing.monster/manakoai/status/2103148213645558030#m
- @zeussubnet (Zeus Subnet, Thu, 24 Sep 2026): An hour and a half. That's how fast Zeus delivers a new weather run. That's 4× faster than IFS (6h) and nearly 5× faster than Google's new WeatherNext 3 (7h). And it's not winning on speed alone. 👇 We’ve put WeatherNext 3 head-to-head with our Zeus Pro and the industry-standard IFS ENS. On 2m temperature, Zeus has been consistently more accurate than both throughout August.  
  http://shitter.thepixora.com/zeussubnet/status/2103125660398981184#m
- @polychain (Polychain Capital, Thu, 13 Aug 2026): LBTC proved demand for yield-bearing Bitcoin. Today, we double down on that thesis. LBTC is moving to institutional yield. @Bitwise will manage a covered-call options strategy with a 4.5-year legacy track record, to generate LBTC's yield, targeting 2.5% net APY paid in Bitcoin.  
  https://nitter.kareem.one/Lombard_Finance/status/2087887552300933626#m
- @covenant_ai (Covenant AI, Thu, 03 Sep 2026): Crucible, Templar's pre-training platform, has completed its first production end-to-end training runs. The latest trained an 8B model on 50.53B tokens across 48 distributed A100s, at an estimated $0.1202 per million tokens of GPU rental. The run reached 48.3% effective MFU. At AWS p4de Capacity Blocks pricing, a 48-A100 cluster operating at the literature-derived 65% compute ceiling comes to an estimated $0.1686 per million tokens. Crucible's measured $0.1202 was about 29% lower after its low-bandwidth overhead. The comparison excludes R2 storage and operations. The full writeup shows the met  
  http://shitter.thepixora.com/tplr_ai/status/2095580357626110111#m
- @lium_io (Lium, Sun, 06 Sep 2026): Cost: $5.60/h ÷ 52.2M output tok/h = $0.107 per million tokens. OpenRouter's cheapest FP8 provider lists the same model at $0.90/M  
  http://shitter.thepixora.com/lium_io/status/2096626336693375483#m
- @lium_io (Lium, Sun, 06 Sep 2026): We just ran Qwen3.6 35B at 14,499 tokens per second. on 1 lium GPU. 85% cheaper than Openrouter. how you can do it too ⬇️  
  http://shitter.thepixora.com/lium_io/status/2096626330808828216#m
- @const_reborn (Jacob Steeves, Sun, 04 Oct 2026): Closed source died in 2026. You either ship open source or it will be done to you by force. The future will be fully customizeable for all the same reasons. lostbutlucky (@lostbutlucky) Halo 3 has been fully decompiled — https://nitter.kareem.one/lostbutlucky/status/2105499810971439192#m  
  https://nitter.kareem.one/MiladyBonkle/status/2106869793383207300#m
- @rob_svrn (Rob Greer, Sun, 04 Oct 2026): I also believe by 2030.. $TAO will become a $1+ trillion ecosystem I completely agree with @rob_svrn You should probably start researching #bittensor subnets.. $TAO Rob Greer (@rob_svrn) i believe bittensor:native becomes a $1tn+ ecosystem by 2030 (yes, ~333x from current market cap, NFA) TAO's price is moving at the speed of bitcoin, but the innovation is moving at the speed of AI the exponential we'll witness from Bittensor will be shocking and my bet is unlike anything crypto has ever seen — http://shitter.thepixora.com/rob_svrn/status/2106826237599707537#m  
  http://shitter.thepixora.com/DreadBong0/status/2106868428724490549#m
- @rob_svrn (Rob Greer, Sun, 04 Oct 2026): i believe bittensor:native becomes a $1tn+ ecosystem by 2030 (yes, ~333x from current market cap, NFA) TAO's price is moving at the speed of bitcoin, but the innovation is moving at the speed of AI the exponential we'll witness from Bittensor will be shocking and my bet is unlike anything crypto has ever seen Stillcore Capital (@stillcorecap) Bitcoin decentralized money. Bittensor is decentralizing intelligence $TAO 2030 is our case for Bittensor becoming a $1tn+ ecosystem by 2030 Article TAO 2030: A $1tn+ Ecosystem A Stillcore Series “The relation of the Tao to all the world is like that of t  
  http://shitter.thepixora.com/rob_svrn/status/2106826237599707537#m
- @rob_svrn (Rob Greer, Sun, 04 Oct 2026): Bitcoin decentralized money. Bittensor is decentralizing intelligence $TAO 2030 is our case for Bittensor becoming a $1tn+ ecosystem by 2030 Article TAO 2030: A $1tn+ Ecosystem A Stillcore Series “The relation of the Tao to all the world is like that of the great rivers and seas to the streams from the valleys.” Tao Te Ching, chapter 32 Introduction The internet became the  
  http://shitter.thepixora.com/stillcorecap/status/2106821906414383270#m
- @resilabsai (RESI, Sat, 18 Apr 2026): Traditional centralized real estate data platforms are fundamentally flawed and often serve to extract wealth from users. @resilabsai (Subnet 46) is breaking this monopoly through decentralized AI technology that delivers up to 99% valuation accuracy. Skip the corporate intermediaries—this AI-powered home valuation tool provides the most reliable housing market forecasts for 2026 Video SEBY (gpu/acc) (@sebyrubino) The @resilabsai Portal is LIVE! Any agent or real estate professional can now easily access our SOTA remote appraisals. We built RESI as a compounding network that will naturally acc  
  https://nitter.kareem.one/3rdeye_rav3n/status/2045362275045753234#m
- @resilabsai (RESI, Sat, 08 Aug 2026): Attention Res Labs we have some really exciting news and updates to our project join our discord to stay up to date: discord.gg/TBj8q9vb2Q #bittensor #TAO bittensor:native #reslabs #reilabsai #crypto #subnet #subnet46 #reslabs_ai #reslabsai #opentensor #reptides  
  https://nitter.kareem.one/resilabsai/status/2085900662139744548#m
- @const_reborn (Jacob Steeves, Sat, 03 Oct 2026): Kappa run is now stopped, not too bad overall! We passed llama 3.2 1b on ARC-C, OBQA, TQA, etc., nearly matched on ARC-E, SciQ, etc. Considering that was 9T tokens and we hit those numbers on the 576B checkpoint, AND we did so around 90% cheaper per token, I'd call it a solid preliminary win! Issues with the run: 1. In one of the Gated DeltaNet-2 heads, the per-channel decay gate underflowed, causing state wipe, and ourput RMSNorm amplified near-zero outputs ~1000x into fleet wide grad spikes. 2. Very late/slow nodes were so far behind their evidence was discarded, not a huge effect but we sho  
  https://nitter.kareem.one/jon_durbin/status/2106379034997178795#m
- @taomedia_ (TAO Media, Sat, 03 Oct 2026): Why we built Mentat Lend. Our co-founder @AntoinePlancho3 on the early days of DeFi on Bittensor, from his conversation with @bart_hillerich on @taomedia_. Video  
  http://shitter.thepixora.com/MentatLend_/status/2106313125284696068#m
- @oroagents (Oro, Mon, 28 Sep 2026): “Every day we are changing our incentive mechanism.” @oroagents keeps its miners facing fresh challenges. At Exploit, Shardul Bansal explained how a catalog of 11 million products becomes new tasks and evaluation environments every day, keeping the competition moving as AI models improve. Video  
  http://nitter.meowing.monster/ExploitSummit/status/2104667461517713663#m
- @oroagents (Oro, Mon, 28 Sep 2026): Accelerating development at ORO Seth Schilbe (@ironseth_s) PSA: Your CLAUDE.md is probably the problem, not the models. I audited my Claude Code memory after using it for 9 months since Opus 4.5. **49 of 260 entries contradicted our current code**. Memory had become a second copy of team knowledge outside our normal review process. So I ran ~270 tests to see what my config actually did. — http://nitter.meowing.monster/ironseth_s/status/2104645444169334831#m  
  http://nitter.meowing.monster/oroagents/status/2104656457237209371#m
- @zeussubnet (Zeus Subnet, Mon, 21 Sep 2026): Remember when @zeussubnet beat Google LIVE? A few weeks ago, Google released a new MEGA model: WeatherNext 3 🔥 Zeus vs @Google round 2 soon Zeus | SN 18 (@zeussubnet) Yesterday, during @opentensor Novelty Search, @const_reborn asked us to demo Zeus live: “Max temperature in Seoul tomorrow?” 🇰🇷 Zeus: 26°C Google: 28°C Today? It was 26°C. Live, verified, beat @Google. No better validation than that. 🔥 Video — http://shitter.thepixora.com/zeussubnet/status/1971601638189379774#m  
  http://shitter.thepixora.com/egillwx/status/2102013020486394112#m
- @resilabsai (RESI, Mon, 20 Apr 2026): I am pleased to announce that Stillcore Capital @stillcorecap has invested in RESI @resilabsai (Bittensor Subnet 46).  
  https://nitter.kareem.one/markjeffrey/status/2046311512621670731#m
- @resilabsai (RESI, Mon, 06 Apr 2026): Chainlink gave DeFi price feeds. @resilabsai is doing the same for real estate. From static appraisals to dynamic, onchain pricing. It's already honing in on Zillow's pricing accuracy, and only a matter of weeks before it surpasses it!  
  https://nitter.kareem.one/gordonfrayne/status/2041152947925512465#m
- @dylan522p (Dylan Patel, Mon, 05 Oct 2026): The difference in what Anthropic and OpenAI as well as many others give you in value for a subscription is insane. We tested Meta, Minimax, Kimi, Grok, and Cursor subscriptions SemiAnalysis (@SemiAnalysis_) It doesn't make sense to say a subscription plan is worth $ X in isolation. The way to think about subscriptions is that your monthly payment grants you some numbers of “credits”. Each (model, token type) combo consumes a different amount of credits. Because credit cost ratios can differ dramatically from API price ratios, the “value” of the same plan changes depending on what model and wor  
  https://nitter.kareem.one/dylan522p/status/2107259067693748373#m
- @BarrySilbert (Barry Silbert, Mon, 05 Oct 2026): Fortitude Secures Priority Supply Allocation for @BITMAINtech's Next-Generation Zcash Mining Equipment, Announces $100 Million Non-Binding Purchase Commitment, and Additional Upsizing of DCG Credit Facility and Available $ZEC Funding from @DCGco. The announcement builds on Fortitude’s approximately 4.7 GSol/s of operating hashrate, more than 60 MW of contracted power capacity and previously announced 9,000-unit order of BITMAIN ANTMINER Z15 Pro miners. “Fortitude’s vision is to be the largest vertically-integrated Zcash mining platform,” said @JaimeLeverton, CEO of Fortitude. “Securing a prior  
  https://nitter.kareem.one/FortitudeCrypto/status/2107234434927981026#m
- @JosephJacks_ (Joseph Jacks, Mon, 05 Oct 2026): So happy to welcome my amazing creators to the Bay Area today.  
  http://nitter.meowing.monster/JosephJacks_/status/2107221547362726273#m
- @JosephJacks_ (Joseph Jacks, Mon, 05 Oct 2026): Liquid’s d1 beats GPT-6.1 Sol, Jev-style decisions, but on a photo or screenshot, on 4 of 6 real tasks, at 19x–200x lower cost and 200–300ms decisions. No token generation, Just probabilities. Camera in, decision out, d1 now reads images and hits 85–97% on VisA inspection tasks It uses the same decision interface (Noul, Choice, Score, one forward pass, no generated tokens) Liquid AI (@liquidai) Announcing d1 with vision. 👁️👁️ Our first decision model now supports images, text or both as inputs. We tested d1 against GPT-6.1 Sol and Claude Opus 5.5 on six real applications, from filtering suppor  
  http://nitter.meowing.monster/0x0SojalSec/status/2107218847413792844#m
- @manakoai (Manako, Mon, 05 Oct 2026): .@manakoai Rig builds custom harnesses and vision agents from natural language for our clients. to do this, it leverages SOTA open-source models from @webuildscore. the next step is for the miners to get annotated data from pseudo-real and real-world scenes and reconstruct them in 3D by training our own world model. the goal? understanding and predicting actions and their consequences in the real world, so we can operate real-world businesses autonomously. can't stop, won't stop. Video  
  http://nitter.meowing.monster/MaxSebti/status/2107211216628187594#m


---
_Generated at 2026-10-06T04:17:08.695014+00:00 by scripts/intel/aggregate.py. Treat this digest as input context, not as ground truth. Verify before quoting._
