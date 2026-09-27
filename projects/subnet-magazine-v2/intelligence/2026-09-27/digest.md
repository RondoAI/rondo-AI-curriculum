# Intelligence Digest, 2026-09-27

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
- @TargonCompute (Targon, Wed, 26 Aug 2026): .@TargonCompute is powering Theoriq AI experimentation. Curating risk-managed yield is, underneath, a research problem: how markets behave, where they break, and how much of that can be seen coming. That runs on heavy, on-demand compute. Targon is our partner in supplying it. Theoriq (@TheoriqAI) Article Theoriq partnering with Targon to power AI experimentation Curating risk-managed yield is, underneath, a research problem. Long before capital is deployed, we want to know how markets behave, where they tend to break, and how much of that can be seen coming — http://shitter.thepixora.com/Theor  
  http://shitter.thepixora.com/TheoriqAI/status/2092661304444277050#m
- @galaxyhq (Galaxy Digital, Wed, 23 Sep 2026): Thanks for making the trip to Lubbock, Mike — and for spending time with our Red Raider football team ahead of the game. Great to have you at @TexasTech, and even better to cap off the visit with a big win at the new @galaxyhq Stadium. This partnership is just getting started. #WreckEm! Mike Novogratz (@novogratz) Last Friday, I visited our flagship campus Helios in West Texas. Three years ago, this was still a bitcoin mining facility. Today Helios is a fully operational AI-ready campus with 133MW of critical IT capacity, and we’re just getting started! @galaxyhq is taking a big swing out here  
  http://shitter.thepixora.com/CreightonForTX/status/2102869773776269419#m
- @galaxyhq (Galaxy Digital, Wed, 23 Sep 2026): Last Friday, I visited our flagship campus Helios in West Texas. Three years ago, this was still a bitcoin mining facility. Today Helios is a fully operational AI-ready campus with 133MW of critical IT capacity, and we’re just getting started! @galaxyhq is taking a big swing out here, and so is America. The move to build an AI future for this country is real, and none of it happens without the physical infrastructure. It starts with power, land, and hard-working people willing to put in the work to build a new future. Our partnership with @TechAthletics with Galaxy Stadium is part of investing  
  http://shitter.thepixora.com/novogratz/status/2102773522292428868#m
- @webuildscore (Score, Wed, 23 Sep 2026): Ran our auto-annotate engine on 120 frames of highway traffic. every car, truck, and person on the road, tagged. If you are still drawing bounding boxes by hand in 2026, blink twice and we will send help. Try it here: scorestudio.ai Video  
  http://nitter.jaydenha.uk/webuildscore/status/2102768498426380399#m
- @galaxyhq (Galaxy Digital, Wed, 23 Sep 2026):   
  http://shitter.thepixora.com/galaxyhq/status/2102759121372012837#m
- @jaltucher (James Altucher, Wed, 16 Sep 2026): Working on an AI-powered end to end platform for designing optical and then quantum chips at $QCLS. More details and refinements later but you can check it out at VibeGDS.io - you just enter plain English for the chip you want and it will build it out, simulate, verify, etc. Of interest mostly to optical engineers.  
  http://shitter.thepixora.com/jaltucher/status/2100262449685364904#m
- @jaltucher (James Altucher, Tue, 22 Sep 2026): Welcome to Bittensor. Here's why you should stay and diamond-hand $TAO.  
  http://shitter.thepixora.com/taodaily_io/status/2102390629422567556#m
- @jaltucher (James Altucher, Tue, 15 Sep 2026): Q/C Technologies has appointed Yossef Ehrlichman, Ph.D., as Chief Technology Officer to lead the company’s optical processing unit program and overall technology strategy. Learn more: bit.ly/4xXk2ik $QCLS  
  http://shitter.thepixora.com/Q_CTechnologies/status/2099856104670859351#m
- @TargonCompute (Targon, Tue, 01 Sep 2026): Happy to help! Proud to be trusted with running critical workloads such as validators. Very excited to see the talented team at DeSci Labs join the Bittensor ecosystem, their research and expertise are sure to add long-lasting value to the network. 🔬 Claims - Subnet 111 (@DeSciClaims) Our validator for SN111 is running on hardware provided by @TargonCompute. We're super grateful for the fast, reliable setup and the team's amazing support. Thank you, guys! — http://shitter.thepixora.com/DeSciClaims/status/2094364807596036575#m  
  http://shitter.thepixora.com/TargonCompute/status/2094908006039236625#m
- @dippy_ai (Dippy AI, Thu, 30 Jul 2026): Excited to have helped @PrunaAI collect 1M+ votes for image preference data in a very short time :~) Pruna AI (@PrunaAI) P-Image-Ideogram dominate the speed-quality and price-quality Pareto frontiers for image generation. It is the result of a unique collaboration with @ideogram_ai. - Four modes (Very low, low, medium, high) for 1K-2K image generation. - Optimal quality-efficiency with 0.4s-7.5s latency, and $0.003-$0.03 price. - Structured JSON control & exact color control. Available via our inference partners @Replicate @inference_sh @scenario_gg @wavespeed_ai @wiroai @magnific @prodialabs   
  http://shitter.thepixora.com/datapointai/status/2082837314603032606#m
- @dippy_ai (Dippy AI, Thu, 27 Aug 2026): we have significantly upgraded both the basic and super models 🤩🤩 we have also made optimizations to improve response speeds by upto 5x can't wait for you all to experience and enjoy the new dippy 📯📯😸 rolling out to everyone today  
  http://shitter.thepixora.com/dippy_ai/status/2093089771824226802#m
- @webuildscore (Score, Thu, 24 Sep 2026): "We're slowing down AI development" they said  
  http://nitter.jaydenha.uk/webuildscore/status/2103168539217523018#m
- @galaxyhq (Galaxy Digital, Thu, 24 Sep 2026): Galaxy bought $100M of sUSDS and approved it as collateral across our institutional lending book. It's the latest step in a deepening relationship with @SkyEcosystem — from Grove's $500M warehouse facility to Spark-backed financing for GOFR.  
  http://shitter.thepixora.com/galaxyhq/status/2103130450738716905#m
- @dippy_ai (Dippy AI, Thu, 04 Jun 2026): Today, we’re opening up Datapoint AI for anyone to use. It is by far the fastest way to understand what your customers want. Type a question. Real people answer. You get a report back in ~10 minutes, not three weeks, and at a fraction of the cost. Video  
  http://shitter.thepixora.com/datapointai/status/2062563294880075837#m
- @dippy_ai (Dippy AI, Sun, 09 Aug 2026): We are experiencing an issue with our database provider @supabase , so the app &amp; website may be down for a few more hours. We’ll send a notification when we are able to recover and the app is back to normal! Apologies for the inconvenience 😿😿  
  http://shitter.thepixora.com/dippy_ai/status/2086595242422149540#m
- @webuildscore (Score, Sat, 26 Sep 2026): Gordon Ramsay with kids vs Gordon Ramsay with adults. Our Fire and Smoke Detector caught the fire in both. If you need strong detection models, don't be an idiot sandwich. Use Score Studio. Try it here: scorestudio.ai Video  
  http://nitter.jaydenha.uk/webuildscore/status/2103877473012203889#m
- @webuildscore (Score, Sat, 26 Sep 2026): This one hits hard Millie (@AltcoinMillie) 🐐 $TAO — http://nitter.jaydenha.uk/AltcoinMillie/status/2103864269141844002#m  
  http://nitter.jaydenha.uk/webuildscore/status/2103870090122764752#m
- @KyleSamani (Kyle Samani, Sat, 26 Sep 2026): 👀 Tokens on Solana (@tokens) INSIGHT: @Backpack CEO @armaniferrante says they want to bring the full US stock market to Solana (10,000 symbols) via one API. Video — http://shitter.thepixora.com/tokens/status/2103811956495007859#m  
  http://shitter.thepixora.com/KyleSamani/status/2103839815879758314#m
- @jaltucher (James Altucher, Sat, 26 Sep 2026): bittensor:native will change your life. 🫶  
  http://shitter.thepixora.com/taodaily_io/status/2103816843806879925#m
- @KyleSamani (Kyle Samani, Sat, 26 Sep 2026): 👀 Solana (@solana) Armani Ferrante, CEO of Backpack, on what comes next for tokenized stocks. "Not 10 stocks, not 100 stocks. We want to bring the entire stock market to Solana. One API where a real share, by any definition of the term, moves back and forth between your brokerage account and DeFi. Going from 200 symbols to 10,000 is the next leap." @armaniferrante @Backpack Video — http://shitter.thepixora.com/solana/status/2103741358842470537#m  
  http://shitter.thepixora.com/KyleSamani/status/2103806894322446599#m
- @TargonCompute (Targon, Mon, 31 Aug 2026): It's been a pleasure working with the @cascade_sn91 team on their recent SN91 launch. As the first team out of the @bitstarterAI ML track, we were proud to support them with initial compute credits on Targon. Excited to continue powering their pursuit of SOTA time series foundation models on Bittensor. ⚡️ SN91, Cascade (@cascade_sn91) Article Better Data, Better Models: What 184 Experiments Changed for Cascade To build the best decoder for Cascade, we needed to optimize across streaming, covariates, context and the training distribution. Thanks to compute credits from @Targoncompute, we were a  
  http://shitter.thepixora.com/TargonCompute/status/2094532034488058036#m
- @jaltucher (James Altucher, Mon, 14 Sep 2026): All of this is so surreal and most of the global population isn’t even fully aware of it. James Altucher (@jaltucher) Inspired by @ashe’s Exploding Human Body, I set up a site to ExplodeAnything.com. Put in any object (“an Iphone”, “a data center”, “an Ozempic pill”, “the soul”. etc), and it will “explode it” and teach you what each component does AND, tell you which public companies make each component, with links to their Yahoo Finance page. Video — http://shitter.thepixora.com/jaltucher/status/2099550542515110239#m  
  http://shitter.thepixora.com/ReneSellmann/status/2099588988017299496#m
- @dippy_ai (Dippy AI, Mon, 10 Aug 2026): We are FINALLY back online! We deeply apologize for this issue extending nearly 24 hours 🥲 As a token of thanks for your patience, we are REMOVING CHAT LIMITS for the remainder of this month 😻😻 P.S: don't worry, we'll also reinstate your streaks :~)  
  http://shitter.thepixora.com/dippy_ai/status/2086838981627420847#m
- @KyleSamani (Kyle Samani, Fri, 25 Sep 2026): Thoughts on the Shielded Bitcoin work: - It’s more than a proof of concept. The @allocinitxyz team has done a clever job of designing this system — kudos! - There are valid concerns from people like @robin_linus that the cryptography needed for this is still experimental at best. Further, the consensus rules aren't enforced by L1 (an outside layer reads Bitcoin L1 to construct 2nd-layer consensus, much like our work on virtualchains back in 2017). - The Bitcoin community tends to support such “Bitcoin extension” projects which require no change to Bitcoin. However, having support from Bitcoin   
  http://shitter.thepixora.com/muneeb/status/2103585562452226175#m
- @webuildscore (Score, Fri, 25 Sep 2026): he can drive Gyro Zeppeli (@Gyrolens) trying out Score Studio's vehicle detector on the most random clip i could find, safe to say i wasn't disappointed. @webuildscore Video — http://nitter.jaydenha.uk/Gyrolens/status/2103575595028189386#m  
  http://nitter.jaydenha.uk/webuildscore/status/2103576072654840037#m
- @galaxyhq (Galaxy Digital, Fri, 25 Sep 2026): Last week, Galaxy Ventures + @raincards kicked off the first Wake-Up Series in NYC. 30 leaders across payments & digital assets. The question: how do we put onchain value to work in payments? Stablecoins are one piece. Tokenized deposits are another. Grateful to everyone who showed up for our first session. We will host another event with Rain during Money 20/20 in Las Vegas. Check out galaxy.com/events for updates.  
  http://shitter.thepixora.com/galaxyhq/status/2103530202601255278#m
- @1inch (1inch, Fri, 25 Sep 2026): 🇯🇵 ETHGlobal (@ETHGlobal) Reimagining the AMM with 1inch Aqua. Catch Tanner from @1inch on self-custodial onchain liquidity at ETHGlobal Tokyo. Watch the workshop: redirect.invidious.io/q96vlWoZCd0?si=a6VM… — http://shitter.thepixora.com/ETHGlobal/status/2103476376380817632#m  
  http://shitter.thepixora.com/1inch/status/2103511091896848517#m
- @1inch (1inch, Fri, 25 Sep 2026): This week’s most-traded @ondo tokenized stocks on 1inch: ▪️ METAon ▪️ CRCLon ▪️ MSTRon Powered by 1inch intent-based swaps. Video  
  http://shitter.thepixora.com/1inch/status/2103488947292635496#m
- @1inch (1inch, Fri, 25 Sep 2026):   
  http://shitter.thepixora.com/1inch/status/2103488947695272174#m
- @KyleSamani (Kyle Samani, Fri, 25 Sep 2026): Slowly, then quickly SolanaFloor (@SolanaFloor) 🚨JUST IN: @Solana has overtaken @Coinbase in daily spot trading volume, ranking No. 2 across blockchains and centralized exchanges, behind only Binance. — http://shitter.thepixora.com/SolanaFloor/status/2103455978570281013#m  
  http://shitter.thepixora.com/KyleSamani/status/2103483591875535143#m
- @1inch (1inch, Fri, 25 Sep 2026): Ask your agent: what is my current Aqua margin? 1inch MCP sends back wallet balance, open positions, quoted liquidity, and fees. Works in Claude, ChatGPT, or Cursor. Video  
  http://shitter.thepixora.com/1inch/status/2103442012683002357#m
- @1inch (1inch, Fri, 25 Sep 2026): Heading to @KBW2026 next week? 🇰🇷 We’re bringing ETHGlobal Happy Hour to Seoul on Sep 29 from 6–9PM! Special thanks to our partners: @ensdomains @ethconf @0G_labs @UniswapFND @1inch @hedera @Yellow @worldnetwork @jumperapp RSVP: luma.com/ethglobal-happyhour…  
  http://shitter.thepixora.com/ETHGlobal/status/2103432926939734201#m
- @KyleSamani (Kyle Samani, Fri, 25 Sep 2026): Former Microsoft CEO Steve Ballmer was asked by Charlie Munger, in front of a whole golf club, why he held his Microsoft stock when his partners sold. Then Munger added: "I know you're not that smart." Ballmer's comeback: "No, but I'm that loyal." Video  
  http://shitter.thepixora.com/BigBrainBizness/status/2103424397516415329#m
- @TargonCompute (Targon, Fri, 21 Aug 2026): The Manifold team has had our heads down building, and we are excited to be making an apperance at @ExploitSummit very soon! We are looking forward to connecting with the community in Canada, and sharing the latest innovations in open stack inference and permissionless compute. Hope to see you all September 28-29th in Montreal 🍁 Exploit Summit (@ExploitSummit) Decentralization doesn't remove trust. It relocates it. @manifoldlabs took that head-on. @TargonCompute turned untrusted GPUs into confidential compute you can actually verify - and put the architecture in a paper co-authored with @intel  
  http://shitter.thepixora.com/manifoldlabs/status/2090871513616433547#m


---
_Generated at 2026-09-27T03:02:39.798815+00:00 by scripts/intel/aggregate.py. Treat this digest as input context, not as ground truth. Verify before quoting._
