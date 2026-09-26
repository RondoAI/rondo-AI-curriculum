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

- @YumaGroup (Yuma Holdings, Tue, 22 Sep 2026): In the past two weeks, Trishool joined the @OpenAI cyber program and launched its Output Guard product for model-output alignment, complementing its existing Input Guard. Since launch, Output Guard has already closed ~50% of the gap to the leading model's performance, powered by continuously improving intelligence produced on Bittensor. $TAO Trishool | SN23 (@trishoolai) Two weeks ago we shipped the first version of our output guard and showed you the starting number. 73.9% F1. We called it the floor, not the ceiling. Here is the floor already moving. The output guard is now at 78.53% F1. That  
  http://shitter.thepixora.com/YumaGroup/status/2102527344166465625#m
- @oroagents (Oro, Tue, 22 Sep 2026): Check out our latest article for how we are approaching benchmarks and evals as the incentive layer on Bittensor - ORO (@oroagents) The team has been hard at work building ORO Bench and we're excited to share this with the world today. Now powering SN15 on Bittensor. Article ORO Bench The ORO model: Eval as an Incentive Mechanism Subnet owners that are testing agent capabilities should be thinking about their validation as EVAL as an incentive mechanism (EAAIM). If you build a — http://nitter.jaydenha.uk/oroagents/status/2102473778509087203#m  
  http://nitter.jaydenha.uk/oroagents/status/2102477102453055786#m
- @oroagents (Oro, Tue, 22 Sep 2026): We're excited to announce ORO Bench today, a benchmark that's powered by a generator creating new synthetic shopping environments everyday. This is now powering our subnet on Bittensor, SN15. Video  
  http://nitter.jaydenha.uk/oroagents/status/2102475717367963815#m
- @oroagents (Oro, Tue, 22 Sep 2026): The team has been hard at work building ORO Bench and we're excited to share this with the world today. Now powering SN15 on Bittensor. Article ORO Bench The ORO model: Eval as an Incentive Mechanism Subnet owners that are testing agent capabilities should be thinking about their validation as EVAL as an incentive mechanism (EAAIM). If you build a  
  http://nitter.jaydenha.uk/oroagents/status/2102473778509087203#m
- @oroagents (Oro, Tue, 08 Sep 2026): We're excited to announce that we're going to be joining Y Combinator in Fall 2026. The team is super pumped to be working with @golda and co to continue on our journey of creating the best in class open source models for agentic commerce. Video  
  http://nitter.jaydenha.uk/oroagents/status/2097396633764032707#m
- @dippy_ai (Dippy AI, Thu, 30 Jul 2026): Excited to have helped @PrunaAI collect 1M+ votes for image preference data in a very short time :~) Pruna AI (@PrunaAI) P-Image-Ideogram dominate the speed-quality and price-quality Pareto frontiers for image generation. It is the result of a unique collaboration with @ideogram_ai. - Four modes (Very low, low, medium, high) for 1K-2K image generation. - Optimal quality-efficiency with 0.4s-7.5s latency, and $0.003-$0.03 price. - Structured JSON control & exact color control. Available via our inference partners @Replicate @inference_sh @scenario_gg @wavespeed_ai @wiroai @magnific @prodialabs   
  http://nitter.jaydenha.uk/datapointai/status/2082837314603032606#m
- @dippy_ai (Dippy AI, Thu, 27 Aug 2026): we have significantly upgraded both the basic and super models 🤩🤩 we have also made optimizations to improve response speeds by upto 5x can't wait for you all to experience and enjoy the new dippy 📯📯😸 rolling out to everyone today  
  http://nitter.jaydenha.uk/dippy_ai/status/2093089771824226802#m
- @KyleSamani (Kyle Samani, Thu, 24 Sep 2026): The litmus test for if an on-chain equity is a real equity: If *you* can transfer it back and forth to TradFi without incurring a taxable event Armani Ferrante (@armaniferrante) How to onramp stocks from Interactive Brokers into Backpack 👇 — http://nitter.jaydenha.uk/armaniferrante/status/2103075098471350498#m  
  http://nitter.jaydenha.uk/KyleSamani/status/2103246358908223738#m
- @a16zcrypto (a16z Crypto, Thu, 24 Sep 2026): “We can now be that regulated partner for all of the largest financial institutions in and outside of the U.S., who want to launch products here.” – @Bastion CEO Nassim Eddequiouaq Bastion (@Bastion) Bastion is the regulated stablecoin infrastructure provider behind global enterprises and financial institutions. As enterprises bring stablecoins into their products and payment flows, they need infrastructure that can support them at scale while meeting the standards their regulators, auditors, and risk committees expect. Our preliminary conditional approval from the OCC for a national trust ban  
  http://nitter.jaydenha.uk/a16zcrypto/status/2103212956259668294#m
- @a16zcrypto (a16z Crypto, Thu, 24 Sep 2026): Want to learn more about perps? Read below 👇 a16z crypto (@a16zcrypto) Article The rise of the $100-billion RWA perp market Trading in perpetual futures tied to stocks, gold, and other traditional assets is growing fast. And an increasing share of that activity is now happening onchain. These contracts, often referred to — http://nitter.jaydenha.uk/a16zcrypto/status/2102875903500197915#m  
  http://nitter.jaydenha.uk/a16zcrypto/status/2103210492210626834#m
- @a16zcrypto (a16z Crypto, Thu, 24 Sep 2026): Just going to leave this here. Open interest in perps tied to traditional assets grew from $161 million to $4.8 billion in 13 months.  
  http://nitter.jaydenha.uk/a16zcrypto/status/2103210350770356589#m
- @YumaGroup (Yuma Holdings, Thu, 24 Sep 2026): We'll tell you how Yuma sees the solution to this, next week on stage at @ExploitSummit. Tune-in Tuesday 9/29 at 11:45am ET Algod (@AlgodTrading) bittensor:native quality is higher past months and subnets finally start to have responsibility to deliver. But there is one point that needs attention asap, a lot of the older ‘OG’ subnets that also manipulated the IM buy buying up their own subnet to maximise incentives to eventually burn 100% for months are very hard to be dethroned due to the ADR The v2 pools need to be modified asap so that these subnets actually can properly dump as now they ar  
  http://shitter.thepixora.com/YumaGroup/status/2103202387401806096#m
- @YumaGroup (Yuma Holdings, Thu, 24 Sep 2026): Choose your fighter. 21M supply. Fair launch. Open network. bittensor:native $ZEC $BTC  
  http://shitter.thepixora.com/YumaGroup/status/2103148514670989783#m
- @oroagents (Oro, Thu, 20 Aug 2026): Measuring the quality of the long-horizon data is a huge part of solving the AI consumer shopping problem. ORO-Distilled, a 4B model. 5x faster. 50x cheaper. Video  
  http://nitter.jaydenha.uk/oroagents/status/2090533835192893616#m
- @dippy_ai (Dippy AI, Thu, 04 Jun 2026): Today, we’re opening up Datapoint AI for anyone to use. It is by far the fastest way to understand what your customers want. Type a question. Real people answer. You get a report back in ~10 minutes, not three weeks, and at a fraction of the cost. Video  
  http://nitter.jaydenha.uk/datapointai/status/2062563294880075837#m
- @dippy_ai (Dippy AI, Sun, 09 Aug 2026): We are experiencing an issue with our database provider @supabase , so the app &amp; website may be down for a few more hours. We’ll send a notification when we are able to recover and the app is back to normal! Apologies for the inconvenience 😿😿  
  http://nitter.jaydenha.uk/dippy_ai/status/2086595242422149540#m
- @SemiAnalysis_ (SemiAnalysis, Sat, 26 Sep 2026): SemiAnalysis STEEL teardown lab has created something big. We're tearing down advanced datacenter and AI hardware and for fun we're sharing consumer teardowns for free! To learn more about our pipeline or to commission a teardown, contact sales@semianalysis.com (2/3)  
  http://shitter.thepixora.com/SemiAnalysis_/status/2103657997146710170#m
- @SemiAnalysis_ (SemiAnalysis, Sat, 26 Sep 2026): The SemiAnalysis STEEL teardown lab is hiring! Are you driven to explore the technical depths and nuances of advanced semiconductor manufacturing and design? Love a good floorplan and understand how it all goes together? Join a killer team. Apply today at (3/3) semianalysis.com/semianalysi… Link Careers at SemiAnalysis Open roles at SemiAnalysis: research analysts, engineers, consultants, and operations across the semiconductor and AI supply chain. Global team, 284k+ newsletter readers, four institutional product... semianalysis.com  
  http://shitter.thepixora.com/SemiAnalysis_/status/2103657998115602843#m
- @SemiAnalysis_ (SemiAnalysis, Sat, 26 Sep 2026): Tearing down Apple M6 and TSMC N2. We're sharing it all here, free. TSMC makes three (GAAFET foundries), scaling, optimization, and a few surprises. Stay tuned! (1/3) 🧵  
  http://shitter.thepixora.com/SemiAnalysis_/status/2103657995850707172#m
- @SemiAnalysis_ (SemiAnalysis, Sat, 26 Sep 2026): This is our most critical test. Providers where we hear a bunch of customer complaints about reliability generally do not have health checks, monitoring dashboards, and autoremediation in place. Reliability is the #1 most important criteria to many of the biggest customers in the world, as we discussed in great detail in our article. (6/7) newsletter.semianalysis.com/… Link How Much Do GPU Clusters Really Cost? Calculating Cluster TCO, The Real Impact of Downtime, The Grand Unifying Theory Of Goodput, and a ClusterMAX 2.1 Update newsletter.semianalysis.com  
  http://shitter.thepixora.com/SemiAnalysis_/status/2103635759450214573#m
- @SemiAnalysis_ (SemiAnalysis, Sat, 26 Sep 2026): In our testing for ClusterMAX 3.0, one of the biggest things that we tested was reliability. we built on previous research to determine which providers can drive solid goodput by 1. identifying failures occurred, and 2. recovering from those failures. (1/7)🧵  
  http://shitter.thepixora.com/SemiAnalysis_/status/2103635753259405599#m
- @dippy_ai (Dippy AI, Mon, 10 Aug 2026): We are FINALLY back online! We deeply apologize for this issue extending nearly 24 hours 🥲 As a token of thanks for your patience, we are REMOVING CHAT LIMITS for the remainder of this month 😻😻 P.S: don't worry, we'll also reinstate your streaks :~)  
  http://nitter.jaydenha.uk/dippy_ai/status/2086838981627420847#m
- @robmyers (Robert Myers, Fri, 26 Mar 2021): Try @rheaplex instead.  
  http://nitter.jaydenha.uk/robmyers/status/1375288994989101059#m
- @KyleSamani (Kyle Samani, Fri, 25 Sep 2026): Thoughts on the Shielded Bitcoin work: - It’s more than a proof of concept. The @allocinitxyz team has done a clever job of designing this system — kudos! - There are valid concerns from people like @robin_linus that the cryptography needed for this is still experimental at best. Further, the consensus rules aren't enforced by L1 (an outside layer reads Bitcoin L1 to construct 2nd-layer consensus, much like our work on virtualchains back in 2017). - The Bitcoin community tends to support such “Bitcoin extension” projects which require no change to Bitcoin. However, having support from Bitcoin   
  http://nitter.jaydenha.uk/muneeb/status/2103585562452226175#m
- @a16zcrypto (a16z Crypto, Fri, 25 Sep 2026): Want to learn more about perps? Read below 👇 a16z crypto (@a16zcrypto) Article The rise of the $100-billion RWA perp market Trading in perpetual futures tied to stocks, gold, and other traditional assets is growing fast. And an increasing share of that activity is now happening onchain. These contracts, often referred to — http://nitter.jaydenha.uk/a16zcrypto/status/2102875903500197915#m  
  http://nitter.jaydenha.uk/a16zcrypto/status/2103555958660043006#m
- @a16zcrypto (a16z Crypto, Fri, 25 Sep 2026): These assets are called “real world.” BUT trading is increasingly happening onchain. 86% of RWA perp volume now runs through onchain venues.  
  http://nitter.jaydenha.uk/a16zcrypto/status/2103555717986972066#m
- @KyleSamani (Kyle Samani, Fri, 25 Sep 2026): Slowly, then quickly SolanaFloor (@SolanaFloor) 🚨JUST IN: @Solana has overtaken @Coinbase in daily spot trading volume, ranking No. 2 across blockchains and centralized exchanges, behind only Binance. — http://nitter.jaydenha.uk/SolanaFloor/status/2103455978570281013#m  
  http://nitter.jaydenha.uk/KyleSamani/status/2103483591875535143#m
- @YumaGroup (Yuma Holdings, Fri, 25 Sep 2026): For informational purposes only. Not an offer or solicitation. Not investment advice. Do your own research. Past performance ≠ future results.  
  http://shitter.thepixora.com/YumaGroup/status/2103477136275263922#m
- @YumaGroup (Yuma Holdings, Fri, 25 Sep 2026): $250 TAO is old news. Bittensor traded above $325 this week, up 39% over the prior 7 days and +73% from its 90-day low. Yuma Asset Management provides access to bittensor:native and the broader Bittensor subnet economy in a single vehicle, giving allocators exposure to one of the most active ecosystems in decentralized AI. Learn more about Yuma Asset Management here: yumaai.com/asset-management?…  
  http://shitter.thepixora.com/YumaGroup/status/2103477131023954420#m
- @KyleSamani (Kyle Samani, Fri, 25 Sep 2026): Former Microsoft CEO Steve Ballmer was asked by Charlie Munger, in front of a whole golf club, why he held his Microsoft stock when his partners sold. Then Munger added: "I know you're not that smart." Ballmer's comeback: "No, but I'm that loyal." Video  
  http://nitter.jaydenha.uk/BigBrainBizness/status/2103424397516415329#m
- @KyleSamani (Kyle Samani, Fri, 25 Sep 2026): Has anyone built any really good real-time live visualizations of an agent trading? For example, you've got your agent running, and it puts on some spot trades, some perp trades, whatever. You can see some sort of timeline, position sizes, PNLs, those kinds of things in some sort of beautiful moving system  
  http://nitter.jaydenha.uk/KyleSamani/status/2103336166158188570#m


---
_Generated at 2026-09-26T03:00:04.088982+00:00 by scripts/intel/aggregate.py. Treat this digest as input context, not as ground truth. Verify before quoting._
