# Intelligence Digest, 2026-09-28

_Single-file briefing for the daily research agent. Sources listed in trust order: human-curated notes first, then objective (github), then editorial (RSS), then volume (X via Nitter)._


## ⊕ HUMAN-CURATED NOTES, last 7 days

_no human notes in the window_

## ⊕ MACRO BACKDROP via SEMIANALYSIS, 12 most recent posts

_SemiAnalysis is the most-cited semiconductor and AI infrastructure publication in the industry. They do NOT cover Bittensor. The Oracle uses this corpus for any claim about hyperscaler compute, GPU economics, datacenter power, foundry capacity, memory pricing, lab unit economics. DO NOT cite SemiAnalysis for any Bittensor-specific claim. Full archive (289 posts, May 2020 onwards) lives at `intelligence/_external_sources/semianalysis/` with an `INDEX.md` table of contents. Paywalled posts show only subtitle + free preview; free posts have the full body extracted._

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

### 2026-09-09 · Where Does a Robot Think – On-Device vs Datacenter Inference
_The Embodiment Problem, Planning vs Action Layers, Glass-To-Glass Budgets, Wafers & DRAM Constraints, One B300 vs 56 Thors TCO, Factories To Caves_

- **Authors:** ["Ivan Chiam", "Zane Fong", "Bryan Shan", "Reyk Knuhtsen", "Myron Xie", "Gerald Wong", "Dylan Patel"]
- **Access:** paid-preview
- **URL:** https://newsletter.semianalysis.com/p/where-does-a-robot-think-on-device
- **Corpus file:** `intelligence/_external_sources/semianalysis/2026-09-09-where-does-a-robot-think-on-device.md`

> For most of its short history, AI lived behind a screen. That’s starting to change.  First came chatbots, good for answering a question or drafting an email. Then agentic AI, models that don’t just respond but do real work on a computer: navigating software, calling tools, finishing multi-step tasks on their own. Now the frontier is physical AI, intelligence that reaches past the screen to perceive the world and act on it. The biggest piece is robots, and it is still early: the hardware, the mod


## ⊕ GITHUB COMMITS + RELEASES, last 24h

_no commits or releases in the lookback window_

## ⊕ ECOSYSTEM BLOGS via RSS

_no new posts in the lookback window_

## ⊕ X via NITTER, voices we track

- @TargonCompute (Targon, Wed, 26 Aug 2026): Proud to power @TheoriqAI with secure confidential compute for their agentic market research. Large GPU blocks on demand, with hardware-level guarantees that keep the workload and its data private even from the machines running it. Excited to keep powering experimental research infrastructure with Targon. Theoriq (@TheoriqAI) .@TargonCompute is powering Theoriq AI experimentation. Curating risk-managed yield is, underneath, a research problem: how markets behave, where they break, and how much of that can be seen coming. That runs on heavy, on-demand compute. Targon is our partner in supplying  
  http://shitter.thepixora.com/TargonCompute/status/2092690588143657190#m
- @TargonCompute (Targon, Wed, 26 Aug 2026): Proud to power @TheoriqAI with secure confidential compute for their agentic market research. Large GPU blocks on demand, with hardware-level guarantees that keep the workload and its data private even from the machines running it. Excited to keep powering experimental research infrastructure with Targon. Theoriq (@TheoriqAI) .@TargonCompute is powering Theoriq AI experimentation. Curating risk-managed yield is, underneath, a research problem: how markets behave, where they break, and how much of that can be seen coming. That runs on heavy, on-demand compute. Targon is our partner in supplying  
  http://nitter.jaydenha.uk/TargonCompute/status/2092690588143657190#m
- @TargonCompute (Targon, Wed, 26 Aug 2026): .@TargonCompute is powering Theoriq AI experimentation. Curating risk-managed yield is, underneath, a research problem: how markets behave, where they break, and how much of that can be seen coming. That runs on heavy, on-demand compute. Targon is our partner in supplying it. Theoriq (@TheoriqAI) Article Theoriq partnering with Targon to power AI experimentation Curating risk-managed yield is, underneath, a research problem. Long before capital is deployed, we want to know how markets behave, where they tend to break, and how much of that can be seen coming — http://shitter.thepixora.com/Theor  
  http://shitter.thepixora.com/TheoriqAI/status/2092661304444277050#m
- @TargonCompute (Targon, Wed, 26 Aug 2026): .@TargonCompute is powering Theoriq AI experimentation. Curating risk-managed yield is, underneath, a research problem: how markets behave, where they break, and how much of that can be seen coming. That runs on heavy, on-demand compute. Targon is our partner in supplying it. Theoriq (@TheoriqAI) Article Theoriq partnering with Targon to power AI experimentation Curating risk-managed yield is, underneath, a research problem. Long before capital is deployed, we want to know how markets behave, where they tend to break, and how much of that can be seen coming — http://nitter.jaydenha.uk/TheoriqA  
  http://nitter.jaydenha.uk/TheoriqAI/status/2092661304444277050#m
- @polychain (Polychain Capital, Wed, 24 Jun 2026): I'm excited to share that Cambrian has raised $11.9M to build the financial intelligence layer for the convergence of AI, digital assets, and traditional finance. Our seed round was led by @Polychain and Franklin Templeton @FTDA_US: a convergence itself of a top OG digital assets fund and a $1.7T institutional asset manager of 75+ years. As AI starts to consume more data in minutes than most humans do in lifetimes, finance is evolving to adapt to this reality ⤵️ Cambrian Network 🪴 (@CambrianNetwork) Big news: we’ve raised $11.9 million to build the world’s financial intelligence layer. @Polych  
  http://shitter.thepixora.com/0xsamgreen/status/2069836236362313887#m
- @polychain (Polychain Capital, Wed, 24 Jun 2026): EXCLUSIVE: a16z CSX-backed Cambrian raises $6 million seed to build blockchain data oracle network theblock.co/post/406028/a16z… Link a16z CSX-backed Cambrian raises $6 million seed to build blockchain data oracle network Cambrian’s new funding will expand its API and verifiable oracle network for institutions and AI agents, with Base and Solana already in production. theblock.co  
  http://shitter.thepixora.com/TheBlockCo/status/2069827932843909349#m
- @novogratz (Mike Novogratz, Wed, 23 Sep 2026): Thanks for making the trip to Lubbock, Mike — and for spending time with our Red Raider football team ahead of the game. Great to have you at @TexasTech, and even better to cap off the visit with a big win at the new @galaxyhq Stadium. This partnership is just getting started. #WreckEm! Mike Novogratz (@novogratz) Last Friday, I visited our flagship campus Helios in West Texas. Three years ago, this was still a bitcoin mining facility. Today Helios is a fully operational AI-ready campus with 133MW of critical IT capacity, and we’re just getting started! @galaxyhq is taking a big swing out here  
  http://shitter.thepixora.com/CreightonForTX/status/2102869773776269419#m
- @galaxyhq (Galaxy Digital, Wed, 23 Sep 2026): Thanks for making the trip to Lubbock, Mike — and for spending time with our Red Raider football team ahead of the game. Great to have you at @TexasTech, and even better to cap off the visit with a big win at the new @galaxyhq Stadium. This partnership is just getting started. #WreckEm! Mike Novogratz (@novogratz) Last Friday, I visited our flagship campus Helios in West Texas. Three years ago, this was still a bitcoin mining facility. Today Helios is a fully operational AI-ready campus with 133MW of critical IT capacity, and we’re just getting started! @galaxyhq is taking a big swing out here  
  http://nitter.jaydenha.uk/CreightonForTX/status/2102869773776269419#m
- @opentensor (Opentensor Foundation, Wed, 23 Sep 2026): The full Exploit lineup is now LIVE⚡ Two days of launches, live demos, adversarial debates, workshops + experiments across AI training, robotics, agents, compute, privacy and more. New products. Hard questions. Big bets. The pioneers of distributed AI, all in one place. See what’s coming ↓ exploitsummit.com/agenda/ Video  
  http://shitter.thepixora.com/ExploitSummit/status/2102820478067073344#m
- @novogratz (Mike Novogratz, Wed, 23 Sep 2026): Last Friday, I visited our flagship campus Helios in West Texas. Three years ago, this was still a bitcoin mining facility. Today Helios is a fully operational AI-ready campus with 133MW of critical IT capacity, and we’re just getting started! @galaxyhq is taking a big swing out here, and so is America. The move to build an AI future for this country is real, and none of it happens without the physical infrastructure. It starts with power, land, and hard-working people willing to put in the work to build a new future. Our partnership with @TechAthletics with Galaxy Stadium is part of investing  
  http://shitter.thepixora.com/novogratz/status/2102773522292428868#m
- @galaxyhq (Galaxy Digital, Wed, 23 Sep 2026): Last Friday, I visited our flagship campus Helios in West Texas. Three years ago, this was still a bitcoin mining facility. Today Helios is a fully operational AI-ready campus with 133MW of critical IT capacity, and we’re just getting started! @galaxyhq is taking a big swing out here, and so is America. The move to build an AI future for this country is real, and none of it happens without the physical infrastructure. It starts with power, land, and hard-working people willing to put in the work to build a new future. Our partnership with @TechAthletics with Galaxy Stadium is part of investing  
  http://nitter.jaydenha.uk/novogratz/status/2102773522292428868#m
- @webuildscore (Score, Wed, 23 Sep 2026): Ran our auto-annotate engine on 120 frames of highway traffic. every car, truck, and person on the road, tagged. If you are still drawing bounding boxes by hand in 2026, blink twice and we will send help. Try it here: scorestudio.ai Video  
  http://shitter.thepixora.com/webuildscore/status/2102768498426380399#m
- @const_reborn (Jacob Steeves, Wed, 23 Sep 2026): NOVA Blueprint: 678.5 Billion Possible Molecules Last week, we upgraded Blueprint to Boltz-2-based scoring. This week, we're expanding the chemical search space by more than 11×. Reactions: 5 → 44 Building blocks: 225K → 2.03M Enumerable chemical space: 61.1B → 678.5B molecules The implications are bigger than the numbers. Blueprint competitors now have to find the highest-scoring set within an 11× larger chemical space, using a substantially more computationally intensive scoring model than before. That makes deciding where to search and which molecules are worth spending inference on more im  
  http://shitter.thepixora.com/metanova_labs/status/2102759303421563262#m
- @covenant_ai (Covenant AI, Wed, 19 Aug 2026): RT @tplr_ai: ByteDance and Tencent each received 10,000 Nvidia H200 chips, the first big delivery after China eased import limits. Watch w…  
  http://shitter.thepixora.com/covenant_ai/status/2090092134036648101#m
- @tm0klc (Tim, Wed, 17 Jun 2026): Introducing Manako, the fastest way to turn any camera into an vision ai agent. Go on manako.ai. Join our waitlist. Video  
  http://nitter.jaydenha.uk/manakoai/status/2067298306200396197#m
- @covenant_ai (Covenant AI, Wed, 16 Sep 2026): We’ve been researching fault tolerance in Crucible, Templar’s pre-training platform. The goal: keep training through node failures and make better use of unreliable workers and spot instances, without idling an entire model replica when one stage goes down. 1/n Video  
  http://shitter.thepixora.com/tplr_ai/status/2100237708186550642#m
- @novogratz (Mike Novogratz, Wed, 16 Sep 2026): Our economy doesn’t work without immigration. We need at least 1.5-2mm new immigrants a year to create taxpayers and consumers to help us grow our way out of 40th in debt and to pay for an aging population. This isn’t political. It’s just math. We of course can decide what immigrants we take. From where, what educational level, wealth etc. that’s political. But the fact that we need them isn’t. Lisa Boothe (@LisaMarieBoothe) At this point, I am fine with shutting down all immigration, legal or not. It's a mess. — http://shitter.thepixora.com/LisaMarieBoothe/status/2099891080258875467#m  
  http://shitter.thepixora.com/novogratz/status/2100193741633929406#m
- @foundrydigital (Foundry Digital, Wed, 11 Jan 2012): Expression Engine 2.0 review by the guys at Scriptiny bit.ly/w3Pg3R  
  http://shitter.thepixora.com/foundrydigital/status/157243024848596993#m
- @covenant_ai (Covenant AI, Tue, 25 Aug 2026): Templar's work reduces to one question. How much of the machine-learning lifecycle can run across ordinary networks instead of a single datacentre? Pre-training answered first, with Covenant-72B as the proof at scale. Post-training followed through our communication-efficiency research. Serving open models on distributed hardware is the piece we are working on now, and it is the one that puts the whole arc in front of users. The internet is the datacentre.  
  http://shitter.thepixora.com/tplr_ai/status/2092267948765237743#m
- @const_reborn (Jacob Steeves, Tue, 22 Sep 2026): Today Numinous is releasing its impact UI! Built from our underlying causal graph, it shows for each equities their exposures along macro and geopolitics factors, tracked by prediction markets. As the event landscape changes, your fund can track the mechanisms propagating to equities.  
  http://shitter.thepixora.com/numinous_ai/status/2102448310267019339#m
- @polychain (Polychain Capital, Tue, 15 Sep 2026): It's time for a new foundation. Not a new start. Legacy Mode is live on Passport, keep every account you already have, on code anyone can inspect. Switch to open source hardware and software while keeping your existing accounts for supported assets. Here’s how. 🧵 Video  
  http://shitter.thepixora.com/FoundationHQ/status/2099865846101180499#m
- @mcjkula (mcjkula, Tue, 14 Apr 2026): See you in Montréal everyone. Not gonna want to miss this one🫡 Exploit Summit (@ExploitSummit) Building on Bittensor is hard. Doing it in isolation is even harder. Exploit puts you in a room with: • The subnet founders who've already solved your problems • The investors actually writing checks • The technical talent you're trying to hire Sept 28-29, Montréal. Two days that could save you six months. Video — http://shitter.thepixora.com/ExploitSummit/status/2044100822750114215#m  
  http://shitter.thepixora.com/mcjkula/status/2044123923088830837#m
- @tm0klc (Tim, Tue, 07 Jul 2026): Subnet 44 @webuildscore is expanding. We’re incentivising training for a new vision-language model: Satori. Satori reasons AND grounds. It doesn’t just answer questions about an image. It points to the evidence. - Reason about scenes - Detect and segment objects - Read text - Count entities - Ground claims in pixels Most VLMs are split: strong reasoning OR strong grounding. Detection models localise, but can’t talk. Chatty VLMs describe fluently, but can’t prove it. Satori sits at the intersection. We’re starting with a 7B base model.  
  http://nitter.jaydenha.uk/tm0klc/status/2074298897305047101#m
- @resilabsai (RESI, Tue, 07 Apr 2026): The power of holding Bittensor $TAO subnet alpha Here is an example to illustrate the flywheel of $TAO Let's say you 1,000 alpha of @resilabsai which cost around 7 $TAO 7 $TAO at a price of $310 = $2,170 Current alpha price of Resi, subnet 46: .0066 $TAO Let's make some calculated assumptions. &gt; price of resi alpha stays the same for 3 years &gt; price of $TAO remains the same at $310 &gt; APY for holding Resi alpha is 40% for the first 2 years, then 30% in year 3 What is my total value in 3 years? Year 1 (40% APY) 1,060.6 × 1.4 = 1,484.8 alpha In $TAO: 1,484.8 × 0.0066 ≈ 9.80 $TAO In USD:   
  http://shitter.thepixora.com/Pop_Collapse/status/2041570023823528017#m
- @TargonCompute (Targon, Tue, 01 Sep 2026): Happy to help! Proud to be trusted with running critical workloads such as validators. Very excited to see the talented team at DeSci Labs join the Bittensor ecosystem, their research and expertise are sure to add long-lasting value to the network. 🔬 Claims - Subnet 111 (@DeSciClaims) Our validator for SN111 is running on hardware provided by @TargonCompute. We're super grateful for the fast, reliable setup and the team's amazing support. Thank you, guys! — http://shitter.thepixora.com/DeSciClaims/status/2094364807596036575#m  
  http://shitter.thepixora.com/TargonCompute/status/2094908006039236625#m
- @TargonCompute (Targon, Tue, 01 Sep 2026): Happy to help! Proud to be trusted with running critical workloads such as validators. Very excited to see the talented team at DeSci Labs join the Bittensor ecosystem, their research and expertise are sure to add long-lasting value to the network. 🔬 Claims - Subnet 111 (@DeSciClaims) Our validator for SN111 is running on hardware provided by @TargonCompute. We're super grateful for the fast, reliable setup and the team's amazing support. Thank you, guys! — http://nitter.jaydenha.uk/DeSciClaims/status/2094364807596036575#m  
  http://nitter.jaydenha.uk/TargonCompute/status/2094908006039236625#m
- @mcjkula (mcjkula, Tue, 01 Sep 2026): TAOApp Wallet is here. The self-custody browser wallet for Bittensor. Hold TAO, stake TAO, buy subnet tokens. When there’s more to protect, bring in your Ledger, proxies and multisigs. Install the beta, on Chrome, Brave and Edge. ↓ chromewebstore.google.com/de…  
  http://shitter.thepixora.com/taoapp_/status/2094840222441992209#m
- @affine_io (Affine, Tue, 01 Sep 2026): Everything you need to compete is public: affine.io/llms.txt  
  http://shitter.thepixora.com/affine_io/status/2094801258016370976#m
- @affine_io (Affine, Tue, 01 Sep 2026): Video  
  http://shitter.thepixora.com/affine_io/status/2094801103959540005#m
- @dippy_ai (Dippy AI, Thu, 30 Jul 2026): Excited to have helped @PrunaAI collect 1M+ votes for image preference data in a very short time :~) Pruna AI (@PrunaAI) P-Image-Ideogram dominate the speed-quality and price-quality Pareto frontiers for image generation. It is the result of a unique collaboration with @ideogram_ai. - Four modes (Very low, low, medium, high) for 1K-2K image generation. - Optimal quality-efficiency with 0.4s-7.5s latency, and $0.003-$0.03 price. - Structured JSON control & exact color control. Available via our inference partners @Replicate @inference_sh @scenario_gg @wavespeed_ai @wiroai @magnific @prodialabs   
  http://shitter.thepixora.com/datapointai/status/2082837314603032606#m
- @dippy_ai (Dippy AI, Thu, 27 Aug 2026): we have significantly upgraded both the basic and super models 🤩🤩 we have also made optimizations to improve response speeds by upto 5x can't wait for you all to experience and enjoy the new dippy 📯📯😸 rolling out to everyone today  
  http://shitter.thepixora.com/dippy_ai/status/2093089771824226802#m
- @covenant_ai (Covenant AI, Thu, 27 Aug 2026): A system designed around identical accelerators depends on a narrow hardware supply. Templar starts from a wider map. Accelerator generations vary, and network conditions change with location. The coordination layer has to treat both as design inputs.  
  http://shitter.thepixora.com/tplr_ai/status/2093022381660942660#m
- @polychain (Polychain Capital, Thu, 25 Jun 2026): Article The Missing AI Layer Is Not Security. It&apos;s Authority. AI agents are now computer users. They browse websites. They read files. They write code. They call APIs. They log in to accounts. They handle credentials, use tools, and take actions across software  
  http://shitter.thepixora.com/zherbert/status/2070178183333171395#m
- @PanteraCapital (Pantera Capital, Thu, 24 Sep 2026): The last closing bell is coming. Video  
  http://nitter.jaydenha.uk/Ondo/status/2103232283218247755#m
- @opentensor (Opentensor Foundation, Thu, 24 Sep 2026): Novelty Search :: Bittensor Subnet 114, SOMA :: Open, Competitive Context Compression shitter.thepixora.com/i/broadcasts/1DGleVWkm… Link Openτensor Foundaτion Novelty Search :: Bittensor Subnet 114, SOMA :: Open, Competitive Context Compression http://shitter.thepixora.com/i/broadcasts/1DGleVWkmXoJL  
  http://shitter.thepixora.com/opentensor/status/2103229076056207404#m
- @a16zcrypto (a16z Crypto, Thu, 24 Sep 2026): “We can now be that regulated partner for all of the largest financial institutions in and outside of the U.S., who want to launch products here.” – @Bastion CEO Nassim Eddequiouaq Bastion (@Bastion) Bastion is the regulated stablecoin infrastructure provider behind global enterprises and financial institutions. As enterprises bring stablecoins into their products and payment flows, they need infrastructure that can support them at scale while meeting the standards their regulators, auditors, and risk committees expect. Our preliminary conditional approval from the OCC for a national trust ban  
  http://nitter.jaydenha.uk/a16zcrypto/status/2103212956259668294#m
- @a16zcrypto (a16z Crypto, Thu, 24 Sep 2026): “We can now be that regulated partner for all of the largest financial institutions in and outside of the U.S., who want to launch products here.” – @Bastion CEO Nassim Eddequiouaq Bastion (@Bastion) Bastion is the regulated stablecoin infrastructure provider behind global enterprises and financial institutions. As enterprises bring stablecoins into their products and payment flows, they need infrastructure that can support them at scale while meeting the standards their regulators, auditors, and risk committees expect. Our preliminary conditional approval from the OCC for a national trust ban  
  http://shitter.thepixora.com/a16zcrypto/status/2103212956259668294#m
- @a16zcrypto (a16z Crypto, Thu, 24 Sep 2026): Want to learn more about perps? Read below 👇 a16z crypto (@a16zcrypto) Article The rise of the $100-billion RWA perp market Trading in perpetual futures tied to stocks, gold, and other traditional assets is growing fast. And an increasing share of that activity is now happening onchain. These contracts, often referred to — http://nitter.jaydenha.uk/a16zcrypto/status/2102875903500197915#m  
  http://nitter.jaydenha.uk/a16zcrypto/status/2103210492210626834#m
- @a16zcrypto (a16z Crypto, Thu, 24 Sep 2026): Want to learn more about perps? Read below 👇 a16z crypto (@a16zcrypto) Article The rise of the $100-billion RWA perp market Trading in perpetual futures tied to stocks, gold, and other traditional assets is growing fast. And an increasing share of that activity is now happening onchain. These contracts, often referred to — http://shitter.thepixora.com/a16zcrypto/status/2102875903500197915#m  
  http://shitter.thepixora.com/a16zcrypto/status/2103210492210626834#m
- @a16zcrypto (a16z Crypto, Thu, 24 Sep 2026): Just going to leave this here. Open interest in perps tied to traditional assets grew from $161 million to $4.8 billion in 13 months.  
  http://nitter.jaydenha.uk/a16zcrypto/status/2103210350770356589#m
- @a16zcrypto (a16z Crypto, Thu, 24 Sep 2026): Just going to leave this here. Open interest in perps tied to traditional assets grew from $161 million to $4.8 billion in 13 months.  
  http://shitter.thepixora.com/a16zcrypto/status/2103210350770356589#m
- @PanteraCapital (Pantera Capital, Thu, 24 Sep 2026): &lt; 2 weeks after launch: - doing 1/4 traffic of Google search - #1 chain used by devs - inventing new metas (stock x meme pairing) @RobinhoodApp chain just getting started reinventing finance fun convo with @FranklinBi @JohannKerbrat about the 3 crypto megatrends, the Whatsapp Effect, and how @davehappyminion bought flowers and snitched Pantera Capital (@PanteraCapital) Robinhood Chain is three months old. In API calls it already runs at roughly a quarter the volume of Google search. @nikil (@Alchemy) and @JohannKerbrat (@RobinhoodCrypto) join Stateful, hosted by @FranklinBi, to talk tokeniz  
  http://nitter.jaydenha.uk/nikil/status/2103197255620841752#m
- @PanteraCapital (Pantera Capital, Thu, 24 Sep 2026): This one has been in the works for over a year. Tokenization is not about bringing existing assets onchain anymore - that problem has already been solved by Ondo Stocks. What's next is bringing asset management and wealth management onchain, starting with intelligent portfolios. People globally can invest in sophisticated portfolios, developed by Blackrock for Ondo, with a single click, and access products that were previously only available to the wealthy select few. Over the next few months, expect Ondo to launch more intelligent portfolios that combine stocks, commodities, ETFs, and even pr  
  http://nitter.jaydenha.uk/iandebode/status/2103183739824329188#m
- @webuildscore (Score, Thu, 24 Sep 2026): "We're slowing down AI development" they said  
  http://shitter.thepixora.com/webuildscore/status/2103168539217523018#m
- @zeussubnet (Zeus Subnet, Thu, 24 Sep 2026): 🤯 4 hours of latency advantage with a model that's more accurate than both EC's IFS ENS &amp; Google's new state-of-the-art model WeatherNext 3, on 100m wind in 0-48H window Zeus | SN 18 (@zeussubnet) An hour and a half. That's how fast Zeus delivers a new weather run. That's 4× faster than IFS (6h) and nearly 5× faster than Google's new WeatherNext 3 (7h). And it's not winning on speed alone. 👇 We’ve put WeatherNext 3 head-to-head with our Zeus Pro and the industry-standard IFS ENS. On 2m temperature, Zeus has been consistently more accurate than both throughout August. — http://shitter.thepi  
  http://shitter.thepixora.com/egillwx/status/2103159277405843965#m
- @PanteraCapital (Pantera Capital, Thu, 24 Sep 2026): We backed @OndoFinance to bring traditional finance onchain. Today the world's largest asset manager's portfolio strategies are live as single onchain tokens, three strategies developed by BlackRock for Ondo. Institutional allocation expertise is now an onchain product. ethereum:0xfaba6f8e4a5e8ab82f62fe7c39859fa577269be3 Ondo Finance (@Ondo) Introducing Ondo Intelligent Portfolios, the first three portfolios powered by BlackRock. Ondo Intelligent Portfolios introduces a new onchain product category: curated investment portfolios delivered as single onchain transferable tokens. The first three   
  http://nitter.jaydenha.uk/veradittakit/status/2103154400856609204#m
- @PanteraCapital (Pantera Capital, Thu, 24 Sep 2026): JUST IN: $ZAMA is now live on @solana via @sunrise Solana (@solana) BREAKING: $ZAMA from @zama is live on Solana via @sunrise — http://nitter.jaydenha.uk/solana/status/2103146074550718518#m  
  http://nitter.jaydenha.uk/zama/status/2103147073356882242#m
- @galaxyhq (Galaxy Digital, Thu, 24 Sep 2026): Galaxy bought $100M of sUSDS and approved it as collateral across our institutional lending book. It's the latest step in a deepening relationship with @SkyEcosystem — from Grove's $500M warehouse facility to Spark-backed financing for GOFR.  
  http://nitter.jaydenha.uk/galaxyhq/status/2103130450738716905#m
- @zeussubnet (Zeus Subnet, Thu, 24 Sep 2026): An hour and a half. That's how fast Zeus delivers a new weather run. That's 4× faster than IFS (6h) and nearly 5× faster than Google's new WeatherNext 3 (7h). And it's not winning on speed alone. 👇 We’ve put WeatherNext 3 head-to-head with our Zeus Pro and the industry-standard IFS ENS. On 2m temperature, Zeus has been consistently more accurate than both throughout August.  
  http://shitter.thepixora.com/zeussubnet/status/2103125660398981184#m
- @Olaf (Olaf Carlson-Wee, Thu, 19 Aug 2010): lekker biertje drinken bij Dims!  
  http://shitter.thepixora.com/olaf/status/21602951308#m


---
_Generated at 2026-09-28T19:08:08.731970+00:00 by scripts/intel/aggregate.py. Treat this digest as input context, not as ground truth. Verify before quoting._
