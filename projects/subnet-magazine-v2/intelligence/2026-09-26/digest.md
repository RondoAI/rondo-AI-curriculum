# Intelligence Digest, 2026-09-26

_Single-file briefing for the daily research agent. Sources listed in trust order: human-curated notes first, then objective (github), then editorial (RSS), then volume (X via Nitter)._


## ⊕ HUMAN-CURATED NOTES, last 7 days

_no human notes in the window_

## ⊕ MACRO BACKDROP via SEMIANALYSIS, 12 most recent posts

_SemiAnalysis is the most-cited semiconductor and AI infrastructure publication in the industry. They do NOT cover Bittensor. The Oracle uses this corpus for any claim about hyperscaler compute, GPU economics, datacenter power, foundry capacity, memory pricing, lab unit economics. DO NOT cite SemiAnalysis for any Bittensor-specific claim. Full archive (289 posts, May 2020 onwards) lives at `intelligence/_external_sources/semianalysis/` with an `INDEX.md` table of contents. Paywalled posts show only subtitle + free preview; free posts have the full body extracted._

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

### 2026-09-09 · Where Does a Robot Think – On-Device vs Datacenter Inference
_The Embodiment Problem, Planning vs Action Layers, Glass-To-Glass Budgets, Wafers & DRAM Constraints, One B300 vs 56 Thors TCO, Factories To Caves_

- **Authors:** ["Ivan Chiam", "Zane Fong", "Bryan Shan", "Reyk Knuhtsen", "Myron Xie", "Gerald Wong", "Dylan Patel"]
- **Access:** paid-preview
- **URL:** https://newsletter.semianalysis.com/p/where-does-a-robot-think-on-device
- **Corpus file:** `intelligence/_external_sources/semianalysis/2026-09-09-where-does-a-robot-think-on-device.md`

> For most of its short history, AI lived behind a screen. That’s starting to change.  First came chatbots, good for answering a question or drafting an email. Then agentic AI, models that don’t just respond but do real work on a computer: navigating software, calling tools, finishing multi-step tasks on their own. Now the frontier is physical AI, intelligence that reaches past the screen to perceive the world and act on it. The biggest piece is robots, and it is still early: the hardware, the mod

### 2026-09-07 · TPU Inference Externalization Full Steam Ahead - InferenceX
_InferenceX, Up to 50% Better Performance per Dollar, Rapid Externalization of TPU stack, Growing Customer Base, Ironwood, TPUv8i, Reducing CUDA Moat_

- **Authors:** ["Alec Ibarra", "Cam Quilici", "Bryan Shan", "Wenyao Gao", "Daniel Nishball", "Zane Fong", "Dylan Patel"]
- **Access:** paid-preview
- **URL:** https://newsletter.semianalysis.com/p/tpu-inferencex-full-steam
- **Corpus file:** `intelligence/_external_sources/semianalysis/2026-09-07-tpu-inferencex-full-steam.md`

> For more than a decade, the industry has watched Google build an empire on its own silicon. Search, Ads, YouTube, and every generation of Gemini run on TPUs. Few accelerators have attracted as much architectural scrutiny or as much debate about what their performance and economics would look like outside the company that designed them. Anthropic being the biggest user of TPUs, surpassing Deepmind’s own use by 2029.  [![A fisheye view of a data center wall with rows of server racks, complex cabli


## ⊕ GITHUB COMMITS + RELEASES, last 24h

_no commits or releases in the lookback window_

## ⊕ ECOSYSTEM BLOGS via RSS

_no new posts in the lookback window_

## ⊕ X via NITTER, voices we track

- @BarrySilbert (Barry Silbert, Wed, 23 Sep 2026): Fortitude has amended its existing credit facility with @DCGco, increasing commitment by $24 million. Approximately $31 million of remaining availability is expected to be funded by DCG in $ZEC, which Fortitude expects to sell to fund Zcash mining machine purchases, mining facility acquisitions, greenfield construction and infrastructure expansion, as Fortitude advances toward its proposed business combination with HeartSciences Inc. (Nasdaq: $HSCS). Read the announcement: businesswire.com/news/home/2…. $ZEC $HSCS Link Fortitude Announces Amendment to Existing DCG Credit Facility, Increasing C  
  http://shitter.thepixora.com/FortitudeCrypto/status/2102874420780175866#m
- @dylan522p (Dylan Patel, Wed, 23 Sep 2026): ALERT ALERT ALERT 🚨 🚨 🚨 VLLM MAINTAINERS HAVE JUST SHOWN THAT TPUv7 CAN GET 700 tok/s/user, 56% BETTER PERFORMANCE THAN NVIDIA GB200 NVL72 THROUGH MEGAKERNEL OPTIMIZATION ON KIMI K3. As we said awhile ago, the TPU externalization of software is full steam ahead. This is ultra important to follow the progress of this.  
  http://shitter.thepixora.com/SemiAnalysis_/status/2102833399475879977#m
- @opentensor (Opentensor Foundation, Wed, 23 Sep 2026): The full Exploit lineup is now LIVE⚡ Two days of launches, live demos, adversarial debates, workshops + experiments across AI training, robotics, agents, compute, privacy and more. New products. Hard questions. Big bets. The pioneers of distributed AI, all in one place. See what’s coming ↓ exploitsummit.com/agenda/ Video  
  http://nitter.jaydenha.uk/ExploitSummit/status/2102820478067073344#m
- @tplr_ai (Templar, Wed, 23 Sep 2026): Video  
  http://nitter.jaydenha.uk/tplr_ai/status/2102792674118164542#m
- @tplr_ai (Templar, Wed, 23 Sep 2026): Read the blog: tplr.ai/publications/blog/sk… Link Fault tolerance in low-bandwidth model parallelism: exploring pipeline stage-skipping with boundary... We explore how the residual nature of the transformer architecture can be leveraged to mitigate hardware faults, and demonstrate that the compression-based implementation of low-bandwidth model... tplr.ai  
  http://nitter.jaydenha.uk/tplr_ai/status/2102792676676432160#m
- @const_reborn (Jacob Steeves, Wed, 23 Sep 2026): NOVA Blueprint: 678.5 Billion Possible Molecules Last week, we upgraded Blueprint to Boltz-2-based scoring. This week, we're expanding the chemical search space by more than 11×. Reactions: 5 → 44 Building blocks: 225K → 2.03M Enumerable chemical space: 61.1B → 678.5B molecules The implications are bigger than the numbers. Blueprint competitors now have to find the highest-scoring set within an 11× larger chemical space, using a substantially more computationally intensive scoring model than before. That makes deciding where to search and which molecules are worth spending inference on more im  
  http://shitter.thepixora.com/metanova_labs/status/2102759303421563262#m
- @_redteam_ (RedTeam / Innerworks, Wed, 19 Aug 2026): Listen in to @oscar_hayek discussing RedTeam on @YumaGroup's Subnet Spotlight. Origin, commercial and technical traction, and where we're headed. Yuma (@YumaGroup) How RedTeam (SN61) powers their cyberthreat immune system with Bittensor nitter.net/i/broadcasts/1dGYlazzp… Link Yuma How RedTeam (SN61) powers their cyberthreat immune system with Bittensor http://nitter.jaydenha.uk/i/broadcasts/1dGYlazzpnEKX — http://nitter.jaydenha.uk/YumaGroup/status/2090076390163095836#m  
  http://nitter.jaydenha.uk/_redteam_/status/2090091530920878293#m
- @tplr_ai (Templar, Wed, 16 Sep 2026): When using pipeline compression with fixed projections shared across layers, robustness improves further as seen in the figure below. This suggests that shared projectors align representations across stage boundaries, making bypasses less disruptive. 4/n  
  http://nitter.jaydenha.uk/tplr_ai/status/2100237714918367690#m
- @tplr_ai (Templar, Wed, 16 Sep 2026): These results point toward training on a broader pool of compute, including unreliable workers and spot instances, while keeping healthy stages productive. Blog: tplr.ai/publications/blog/sk… n/n Link Fault tolerance in low-bandwidth model parallelism: exploring pipeline stage-skipping with boundary... We explore how the residual nature of the transformer architecture can be leveraged to mitigate hardware faults, and demonstrate that the compression-based implementation of low-bandwidth model... tplr.ai  
  http://nitter.jaydenha.uk/tplr_ai/status/2100237717162303718#m
- @tplr_ai (Templar, Wed, 16 Sep 2026): We’ve been researching fault tolerance in Crucible, Templar’s pre-training platform. The goal: keep training through node failures and make better use of unreliable workers and spot instances, without idling an entire model replica when one stage goes down. 1/n Video  
  http://nitter.jaydenha.uk/tplr_ai/status/2100237708186550642#m
- @foundrydigital (Foundry Digital, Wed, 11 Jan 2012): Expression Engine 2.0 review by the guys at Scriptiny bit.ly/w3Pg3R  
  http://nitter.jaydenha.uk/foundrydigital/status/157243024848596993#m
- @YumaGroup (Yuma Holdings, Tue, 22 Sep 2026): In the past two weeks, Trishool joined the @OpenAI cyber program and launched its Output Guard product for model-output alignment, complementing its existing Input Guard. Since launch, Output Guard has already closed ~50% of the gap to the leading model's performance, powered by continuously improving intelligence produced on Bittensor. $TAO Trishool | SN23 (@trishoolai) Two weeks ago we shipped the first version of our output guard and showed you the starting number. 73.9% F1. We called it the floor, not the ceiling. Here is the floor already moving. The output guard is now at 78.53% F1. That  
  http://shitter.thepixora.com/YumaGroup/status/2102527344166465625#m
- @opentensor (Opentensor Foundation, Tue, 22 Sep 2026): .@openroboto just built a decentralized alternative to @Figure_robot’s Index for collecting robot training data, with real-world capture hardware. Open robotics on Bittensor now has its data network to challenge the industry’s biggest labs. Bittensor is coming for physical AI. OpenRoboto (@openroboto) Today we’re launching OpenRoboto Shift, opening a new chapter for OpenRoboto. Shift is a decentralized network for collecting egocentric robotics data: first-person video of real people doing real work. Only Possible on Bittensor. Explore Shift → shift.openroboto.ai/ Video — http://nitter.jaydenh  
  http://nitter.jaydenha.uk/opentensor/status/2102525497687285851#m
- @oroagents (Oro, Tue, 22 Sep 2026): Check out our latest article for how we are approaching benchmarks and evals as the incentive layer on Bittensor - ORO (@oroagents) The team has been hard at work building ORO Bench and we're excited to share this with the world today. Now powering SN15 on Bittensor. Article ORO Bench The ORO model: Eval as an Incentive Mechanism Subnet owners that are testing agent capabilities should be thinking about their validation as EVAL as an incentive mechanism (EAAIM). If you build a — http://nitter.jaydenha.uk/oroagents/status/2102473778509087203#m  
  http://nitter.jaydenha.uk/oroagents/status/2102477102453055786#m
- @oroagents (Oro, Tue, 22 Sep 2026): We're excited to announce ORO Bench today, a benchmark that's powered by a generator creating new synthetic shopping environments everyday. This is now powering our subnet on Bittensor, SN15. Video  
  http://nitter.jaydenha.uk/oroagents/status/2102475717367963815#m
- @oroagents (Oro, Tue, 22 Sep 2026): The team has been hard at work building ORO Bench and we're excited to share this with the world today. Now powering SN15 on Bittensor. Article ORO Bench The ORO model: Eval as an Incentive Mechanism Subnet owners that are testing agent capabilities should be thinking about their validation as EVAL as an incentive mechanism (EAAIM). If you build a  
  http://nitter.jaydenha.uk/oroagents/status/2102473778509087203#m
- @const_reborn (Jacob Steeves, Tue, 22 Sep 2026): Today Numinous is releasing its impact UI! Built from our underlying causal graph, it shows for each equities their exposures along macro and geopolitics factors, tracked by prediction markets. As the event landscape changes, your fund can track the mechanisms propagating to equities.  
  http://shitter.thepixora.com/numinous_ai/status/2102448310267019339#m
- @jtledore (Jean-Thomas Ledoré, Tue, 22 Sep 2026): Our latest research paper explores the growing connection between AI and digital assets and explains why broad AI adoption may drive new demand, utility and applications across the digital asset economy. blackrock.com/us/individual/…  
  http://nitter.jaydenha.uk/BlackRock/status/2102409739175141458#m
- @BarrySilbert (Barry Silbert, Tue, 22 Sep 2026): We're proud to be the pilot partner for @taostats' ads program and support one of the best pieces of free infrastructure in Bittensor. Soon these ad spaces will be available to subnets and other ecosystem participants as a new way to reach users, builders, and investors. For Bittensor and its subnets, growth starts with awareness. Nobody can use something they've never heard of. Taostats is our first ad campaign. It won't be our last, and soon we'll be advertising beyond the existing community to help new talent and capital discover Bittensor. $TAO  
  http://shitter.thepixora.com/YumaGroup/status/2102396817975529838#m
- @BarrySilbert (Barry Silbert, Tue, 22 Sep 2026): Grayscale AI Compute ETF (Ticker: $GCPU) is now trading. Why AI Compute? ⟶ AI's growth is constrained by physical compute. Data centers have just six months of capacity¹, and new ones take two to five years to build². ⟶ AI infrastructure capex is projected to exceed $1 trillion annually³. ⟶ $GCPU portfolio includes native data center businesses, plus operators repurposing existing power and land for AI, including Bitcoin miners. $GCPU offers exposure to AI’s physical layer, now accessible through brokerage or investment accounts. Learn more: etfs.grayscale.com/gcpu Video  
  http://shitter.thepixora.com/Grayscale/status/2102381328880832751#m
- @rob_svrn (Rob Greer, Tue, 22 Sep 2026): the ARR on @engyai is now 3.5m-4m usd, hoping to scale this beyond 8 figures before end of year. Demand for inference will be infinite, accelerate  
  http://shitter.thepixora.com/AlgodTrading/status/2102369904934686742#m
- @BarrySilbert (Barry Silbert, Tue, 22 Sep 2026): $GTAO 👀 Are you paying attention yet? $TAO  
  http://shitter.thepixora.com/Altcoin_Hero_/status/2102190155213770803#m
- @oroagents (Oro, Tue, 08 Sep 2026): We're excited to announce that we're going to be joining Y Combinator in Fall 2026. The team is super pumped to be working with @golda and co to continue on our journey of creating the best in class open source models for agentic commerce. Video  
  http://nitter.jaydenha.uk/oroagents/status/2097396633764032707#m
- @dippy_ai (Dippy AI, Thu, 30 Jul 2026): Excited to have helped @PrunaAI collect 1M+ votes for image preference data in a very short time :~) Pruna AI (@PrunaAI) P-Image-Ideogram dominate the speed-quality and price-quality Pareto frontiers for image generation. It is the result of a unique collaboration with @ideogram_ai. - Four modes (Very low, low, medium, high) for 1K-2K image generation. - Optimal quality-efficiency with 0.4s-7.5s latency, and $0.003-$0.03 price. - Structured JSON control & exact color control. Available via our inference partners @Replicate @inference_sh @scenario_gg @wavespeed_ai @wiroai @magnific @prodialabs   
  http://nitter.jaydenha.uk/datapointai/status/2082837314603032606#m
- @dippy_ai (Dippy AI, Thu, 27 Aug 2026): we have significantly upgraded both the basic and super models 🤩🤩 we have also made optimizations to improve response speeds by upto 5x can't wait for you all to experience and enjoy the new dippy 📯📯😸 rolling out to everyone today  
  http://nitter.jaydenha.uk/dippy_ai/status/2093089771824226802#m
- @_redteam_ (RedTeam / Innerworks, Thu, 27 Aug 2026): The Immune System for the Internet. Releasing next month. Oscar Hayek (@oscar_hayek) Defence in this era must be AI driven, the absolute baseline is adapting defences faster than attacks are being produced. Anything slower than this leaves you in a constant state of degradation. What we’ve built on @_redteam_ is an immune system for this problem. The attacks we ingest are evolved inside the system into complete novel vectors that cannot be produced anywhere else. Every one of these gets patched before an external attacker has the means/ability to create it, let alone release it. bittensor:nati  
  http://nitter.jaydenha.uk/_redteam_/status/2093081017145847826#m
- @KyleSamani (Kyle Samani, Thu, 24 Sep 2026): The litmus test for if an on-chain equity is a real equity: If *you* can transfer it back and forth to TradFi without incurring a taxable event Armani Ferrante (@armaniferrante) How to onramp stocks from Interactive Brokers into Backpack 👇 — http://nitter.jaydenha.uk/armaniferrante/status/2103075098471350498#m  
  http://nitter.jaydenha.uk/KyleSamani/status/2103246358908223738#m
- @KyleSamani (Kyle Samani, Thu, 24 Sep 2026): The litmus test for if an on-chain equity is a real equity: If *you* can transfer it back and forth to TradFi without incurring a taxable event Armani Ferrante (@armaniferrante) How to onramp stocks from Interactive Brokers into Backpack 👇 — http://shitter.thepixora.com/armaniferrante/status/2103075098471350498#m  
  http://shitter.thepixora.com/KyleSamani/status/2103246358908223738#m
- @PanteraCapital (Pantera Capital, Thu, 24 Sep 2026): The last closing bell is coming. Video  
  http://shitter.thepixora.com/Ondo/status/2103232283218247755#m
- @opentensor (Opentensor Foundation, Thu, 24 Sep 2026): Novelty Search :: Bittensor Subnet 114, SOMA :: Open, Competitive Context Compression nitter.net/i/broadcasts/1DGleVWkm… Link Openτensor Foundaτion Novelty Search :: Bittensor Subnet 114, SOMA :: Open, Competitive Context Compression http://nitter.jaydenha.uk/i/broadcasts/1DGleVWkmXoJL  
  http://nitter.jaydenha.uk/opentensor/status/2103229076056207404#m
- @dylan522p (Dylan Patel, Thu, 24 Sep 2026): Fentanyl Grade Compute: Why a GB300 Rack Will Out-Price Blow by Weight in 2030 A GB300 NVL72 weighs roughly 1,580 kg fully populated and recent purchase orders put it at $5M per rack. That is $3,165/kg. Strip out the 1.5 tons of busbar, manifold and coolant and the GPU packages alone are well into gold territory, but we're pricing the rack, because that's what you actually take delivery of. Where that sits on the illicit commodity curve today ($/kg): $2,400 Cannabis flower $3,165 GB300 NVL72 $3,500 Fentanyl $28,000 Cocaine $65,000 Heroin $138,000 Gold So today NVIDIA ships a product that is de  
  http://shitter.thepixora.com/dylan522p/status/2103225106512363902#m
- @a16zcrypto (a16z Crypto, Thu, 24 Sep 2026): “We can now be that regulated partner for all of the largest financial institutions in and outside of the U.S., who want to launch products here.” – @Bastion CEO Nassim Eddequiouaq Bastion (@Bastion) Bastion is the regulated stablecoin infrastructure provider behind global enterprises and financial institutions. As enterprises bring stablecoins into their products and payment flows, they need infrastructure that can support them at scale while meeting the standards their regulators, auditors, and risk committees expect. Our preliminary conditional approval from the OCC for a national trust ban  
  http://nitter.jaydenha.uk/a16zcrypto/status/2103212956259668294#m
- @a16zcrypto (a16z Crypto, Thu, 24 Sep 2026): Want to learn more about perps? Read below 👇 a16z crypto (@a16zcrypto) Article The rise of the $100-billion RWA perp market Trading in perpetual futures tied to stocks, gold, and other traditional assets is growing fast. And an increasing share of that activity is now happening onchain. These contracts, often referred to — http://nitter.jaydenha.uk/a16zcrypto/status/2102875903500197915#m  
  http://nitter.jaydenha.uk/a16zcrypto/status/2103210492210626834#m
- @a16zcrypto (a16z Crypto, Thu, 24 Sep 2026): Just going to leave this here. Open interest in perps tied to traditional assets grew from $161 million to $4.8 billion in 13 months.  
  http://nitter.jaydenha.uk/a16zcrypto/status/2103210350770356589#m
- @YumaGroup (Yuma Holdings, Thu, 24 Sep 2026): We'll tell you how Yuma sees the solution to this, next week on stage at @ExploitSummit. Tune-in Tuesday 9/29 at 11:45am ET Algod (@AlgodTrading) bittensor:native quality is higher past months and subnets finally start to have responsibility to deliver. But there is one point that needs attention asap, a lot of the older ‘OG’ subnets that also manipulated the IM buy buying up their own subnet to maximise incentives to eventually burn 100% for months are very hard to be dethroned due to the ADR The v2 pools need to be modified asap so that these subnets actually can properly dump as now they ar  
  http://shitter.thepixora.com/YumaGroup/status/2103202387401806096#m
- @PanteraCapital (Pantera Capital, Thu, 24 Sep 2026): &lt; 2 weeks after launch: - doing 1/4 traffic of Google search - #1 chain used by devs - inventing new metas (stock x meme pairing) @RobinhoodApp chain just getting started reinventing finance fun convo with @FranklinBi @JohannKerbrat about the 3 crypto megatrends, the Whatsapp Effect, and how @davehappyminion bought flowers and snitched Pantera Capital (@PanteraCapital) Robinhood Chain is three months old. In API calls it already runs at roughly a quarter the volume of Google search. @nikil (@Alchemy) and @JohannKerbrat (@RobinhoodCrypto) join Stateful, hosted by @FranklinBi, to talk tokeniz  
  http://shitter.thepixora.com/nikil/status/2103197255620841752#m
- @dylan522p (Dylan Patel, Thu, 24 Sep 2026): Everytime AI spend grows where I flirt with token budgeting, Anthropic + OpenAI save me Astra had a spike then settled down lower Opus 5.5 it looks like spend is lowered for current usecases Of course people figure out new things to do Spend goes up again ROI keeps increasing  
  http://shitter.thepixora.com/dylan522p/status/2103190377289363907#m
- @PanteraCapital (Pantera Capital, Thu, 24 Sep 2026): This one has been in the works for over a year. Tokenization is not about bringing existing assets onchain anymore - that problem has already been solved by Ondo Stocks. What's next is bringing asset management and wealth management onchain, starting with intelligent portfolios. People globally can invest in sophisticated portfolios, developed by Blackrock for Ondo, with a single click, and access products that were previously only available to the wealthy select few. Over the next few months, expect Ondo to launch more intelligent portfolios that combine stocks, commodities, ETFs, and even pr  
  http://shitter.thepixora.com/iandebode/status/2103183739824329188#m
- @zeussubnet (Zeus Subnet, Thu, 24 Sep 2026): 🤯 4 hours of latency advantage with a model that's more accurate than both EC's IFS ENS &amp; Google's new state-of-the-art model WeatherNext 3, on 100m wind in 0-48H window Zeus | SN 18 (@zeussubnet) An hour and a half. That's how fast Zeus delivers a new weather run. That's 4× faster than IFS (6h) and nearly 5× faster than Google's new WeatherNext 3 (7h). And it's not winning on speed alone. 👇 We’ve put WeatherNext 3 head-to-head with our Zeus Pro and the industry-standard IFS ENS. On 2m temperature, Zeus has been consistently more accurate than both throughout August. — http://nitter.jayden  
  http://nitter.jaydenha.uk/egillwx/status/2103159277405843965#m
- @PanteraCapital (Pantera Capital, Thu, 24 Sep 2026): We backed @OndoFinance to bring traditional finance onchain. Today the world's largest asset manager's portfolio strategies are live as single onchain tokens, three strategies developed by BlackRock for Ondo. Institutional allocation expertise is now an onchain product. ethereum:0xfaba6f8e4a5e8ab82f62fe7c39859fa577269be3 Ondo Finance (@Ondo) Introducing Ondo Intelligent Portfolios, the first three portfolios powered by BlackRock. Ondo Intelligent Portfolios introduces a new onchain product category: curated investment portfolios delivered as single onchain transferable tokens. The first three   
  http://shitter.thepixora.com/veradittakit/status/2103154400856609204#m
- @YumaGroup (Yuma Holdings, Thu, 24 Sep 2026): Choose your fighter. 21M supply. Fair launch. Open network. bittensor:native $ZEC $BTC  
  http://shitter.thepixora.com/YumaGroup/status/2103148514670989783#m
- @PanteraCapital (Pantera Capital, Thu, 24 Sep 2026): JUST IN: $ZAMA is now live on @solana via @sunrise Solana (@solana) BREAKING: $ZAMA from @zama is live on Solana via @sunrise — http://shitter.thepixora.com/solana/status/2103146074550718518#m  
  http://shitter.thepixora.com/zama/status/2103147073356882242#m
- @zeussubnet (Zeus Subnet, Thu, 24 Sep 2026): An hour and a half. That's how fast Zeus delivers a new weather run. That's 4× faster than IFS (6h) and nearly 5× faster than Google's new WeatherNext 3 (7h). And it's not winning on speed alone. 👇 We’ve put WeatherNext 3 head-to-head with our Zeus Pro and the industry-standard IFS ENS. On 2m temperature, Zeus has been consistently more accurate than both throughout August.  
  http://nitter.jaydenha.uk/zeussubnet/status/2103125660398981184#m
- @jtledore (Jean-Thomas Ledoré, Thu, 24 Sep 2026): Who gets to build the next generation of AI? That question matters for Canada. Competing with the largest US and Chinese AI labs on sheer scale requires enormous amounts of capital, computing infrastructure and talent. But there is another path: creating conditions where independent researchers and companies can build, test and improve useful AI systems. That requires more than access to open-source models. Teams also need compute, research infrastructure and sustainable ways to fund experimentation. In this op-ed for TheFutureEconomy.ca, Victor Valée, Co-Founder of Kusanagi Ventures, argues t  
  http://nitter.jaydenha.uk/FuturEconomy/status/2103110706275262959#m
- @BarrySilbert (Barry Silbert, Thu, 24 Sep 2026): We're proud to announce a new step in Malaysia's capital markets journey. At #LIDACKL 2026, Luno Malaysia signed an Intent to Collaborate with Kenanga Investors Berhad and @HalogenCapital to explore a Ringgit-pegged stablecoin as an on-chain settlement instrument for tokenised money market funds. Malaysia's capital markets are moving on-chain, and we're glad to help build the road. More to come as this partnership takes shape 🤝 Halogen Capital (@HalogenCapital) Today at LIDAC 2026, we signed an Intent to Collaborate (ItC) with @LunoGlobal and Kenanga Investors Berhad to explore UMYR, a Ringgit  
  http://shitter.thepixora.com/LunoGlobal/status/2103055574149542164#m
- @oroagents (Oro, Thu, 20 Aug 2026): Measuring the quality of the long-horizon data is a huge part of solving the AI consumer shopping problem. ORO-Distilled, a 4B model. 5x faster. 50x cheaper. Video  
  http://nitter.jaydenha.uk/oroagents/status/2090533835192893616#m
- @_redteam_ (RedTeam / Innerworks, Thu, 10 Sep 2026): I am pleased to announce that Stillcore Capital @stillcorecap has invested in Red Team @_redteam_ Bittensor $TAO Subnet 61.  
  http://nitter.jaydenha.uk/markjeffrey/status/2098171401152971021#m
- @dippy_ai (Dippy AI, Thu, 04 Jun 2026): Today, we’re opening up Datapoint AI for anyone to use. It is by far the fastest way to understand what your customers want. Type a question. Real people answer. You get a report back in ~10 minutes, not three weeks, and at a fraction of the cost. Video  
  http://nitter.jaydenha.uk/datapointai/status/2062563294880075837#m
- @dippy_ai (Dippy AI, Sun, 09 Aug 2026): We are experiencing an issue with our database provider @supabase , so the app &amp; website may be down for a few more hours. We’ll send a notification when we are able to recover and the app is back to normal! Apologies for the inconvenience 😿😿  
  http://nitter.jaydenha.uk/dippy_ai/status/2086595242422149540#m
- @jtledore (Jean-Thomas Ledoré, Sat, 28 Sep 2024): New Subnet Incoming: GPU Rental by @fish_datura. Offering scalable compute resources for validators &amp; users, payable in $TAO. + Watch our CTO demo the new CLI &amp; SDK in Bittensor v8.0.0. Catch it all on episode 20—available on Spotify and YouTube. piped.video/Xbf_h2bIjxA Video  
  http://nitter.jaydenha.uk/opentensor/status/1840034792764506122#m


---
_Generated at 2026-09-26T09:00:42.656966+00:00 by scripts/intel/aggregate.py. Treat this digest as input context, not as ground truth. Verify before quoting._
