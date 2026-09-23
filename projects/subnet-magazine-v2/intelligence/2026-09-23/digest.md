# Intelligence Digest, 2026-09-23

_Single-file briefing for the daily research agent. Sources listed in trust order: human-curated notes first, then objective (github), then editorial (RSS), then volume (X via Nitter)._


## ⊕ HUMAN-CURATED NOTES, last 7 days

_no human notes in the window_

## ⊕ MACRO BACKDROP via SEMIANALYSIS, 12 most recent posts

_SemiAnalysis is the most-cited semiconductor and AI infrastructure publication in the industry. They do NOT cover Bittensor. The Oracle uses this corpus for any claim about hyperscaler compute, GPU economics, datacenter power, foundry capacity, memory pricing, lab unit economics. DO NOT cite SemiAnalysis for any Bittensor-specific claim. Full archive (289 posts, May 2020 onwards) lives at `intelligence/_external_sources/semianalysis/` with an `INDEX.md` table of contents. Paywalled posts show only subtitle + free preview; free posts have the full body extracted._

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

### 2026-09-01 · Korea’s Trillion-Dollar Sovereign AI Investment: Nvidia Wins, Hynix Loses
_Korea hosts a Squid Games, National AI Tournament, the best non-Chinese open source model gets eliminated, why Nvidia needs open source, implications for Hynix and Samsung_

- **Authors:** ["Max Kan", "Ray Wang", "Dylan Patel"]
- **Access:** paid-preview
- **URL:** https://newsletter.semianalysis.com/p/koreas-trillion-dollar-sovereign
- **Corpus file:** `intelligence/_external_sources/semianalysis/2026-09-01-koreas-trillion-dollar-sovereign.md`

> Every day, businesses and governments around the world are becoming increasingly reliant on America’s frontier models. Startup CEOs already can’t imagine running their companies without AI, and it won’t be long until the same is true for every other organization in the world.  At the same time, it’s become abundantly clear that access to frontier models is at the mercy of Anthropic, OpenAI, and the United States government. Fable 5 was temporarily banned by the USG, and GPT 5.6 and Astra were si


## ⊕ GITHUB COMMITS + RELEASES, last 24h

- **Subtensor (chain)** (COMMIT `923fd1f`, 2026-09-23 01:45) Merge pull request #3196 from RaoFoundation/feat/add-swap-basket-many  
  https://github.com/RaoFoundation/subtensor/commit/923fd1fa7d6eadad3ec16f3941826b86c9c3aa1d
- **Subtensor (chain)** (COMMIT `63db95d`, 2026-09-23 01:40) spec bump  
  https://github.com/RaoFoundation/subtensor/commit/63db95d1672e405d93068c0632373744f20a0049
- **Subtensor (chain)** (COMMIT `5ee0fcd`, 2026-09-22 23:07) Add atomic  for efficient multi-leg basket rebalancing  
  https://github.com/RaoFoundation/subtensor/commit/5ee0fcde09bfa551db2ae7b977cd9943f269bed1
- **Subtensor (chain)** (COMMIT `370bac4`, 2026-09-22 09:15) Merge pull request #3192 from RaoFoundation/cursor/spec-469-bugfixes-fee-refunds-1eaa  
  https://github.com/RaoFoundation/subtensor/commit/370bac46fa8cf602c4f8283a0635b3a8b4675394

## ⊕ ECOSYSTEM BLOGS via RSS

_no new posts in the lookback window_

## ⊕ X via NITTER, voices we track

- @TargonCompute (Targon, Wed, 26 Aug 2026): Proud to power @TheoriqAI with secure confidential compute for their agentic market research. Large GPU blocks on demand, with hardware-level guarantees that keep the workload and its data private even from the machines running it. Excited to keep powering experimental research infrastructure with Targon. Theoriq (@TheoriqAI) .@TargonCompute is powering Theoriq AI experimentation. Curating risk-managed yield is, underneath, a research problem: how markets behave, where they break, and how much of that can be seen coming. That runs on heavy, on-demand compute. Targon is our partner in supplying  
  http://shitter.thepixora.com/TargonCompute/status/2092690588143657190#m
- @ridges_ai (Ridges, Wed, 26 Aug 2026): We've kicked off Niches with a Linting competition! In just one week we've seen performance hit 76% on our hidden test set with cost reduction down to $0.02 per task. Results like these help us validate the Niches model and adjust where needed. We're excited for the next Niche, and eventually dynamic Niches. Stay tuned!  
  http://nitter.jaydenha.uk/ridges_ai/status/2092684102595961119#m
- @TargonCompute (Targon, Wed, 26 Aug 2026): .@TargonCompute is powering Theoriq AI experimentation. Curating risk-managed yield is, underneath, a research problem: how markets behave, where they break, and how much of that can be seen coming. That runs on heavy, on-demand compute. Targon is our partner in supplying it. Theoriq (@TheoriqAI) Article Theoriq partnering with Targon to power AI experimentation Curating risk-managed yield is, underneath, a research problem. Long before capital is deployed, we want to know how markets behave, where they tend to break, and how much of that can be seen coming — http://shitter.thepixora.com/Theor  
  http://shitter.thepixora.com/TheoriqAI/status/2092661304444277050#m
- @polychain (Polychain Capital, Wed, 24 Jun 2026): I'm excited to share that Cambrian has raised $11.9M to build the financial intelligence layer for the convergence of AI, digital assets, and traditional finance. Our seed round was led by @Polychain and Franklin Templeton @FTDA_US: a convergence itself of a top OG digital assets fund and a $1.7T institutional asset manager of 75+ years. As AI starts to consume more data in minutes than most humans do in lifetimes, finance is evolving to adapt to this reality ⤵️ Cambrian Network 🪴 (@CambrianNetwork) Big news: we’ve raised $11.9 million to build the world’s financial intelligence layer. @Polych  
  http://nitter.jaydenha.uk/0xsamgreen/status/2069836236362313887#m
- @polychain (Polychain Capital, Wed, 24 Jun 2026): EXCLUSIVE: a16z CSX-backed Cambrian raises $6 million seed to build blockchain data oracle network theblock.co/post/406028/a16z… Link a16z CSX-backed Cambrian raises $6 million seed to build blockchain data oracle network Cambrian, a startup building blockchain data infrastructure for institutions and AI agents, raised $6 million in a seed funding round. theblock.co  
  http://nitter.jaydenha.uk/TheBlockCo/status/2069827932843909349#m
- @a16zcrypto (a16z Crypto, Wed, 23 Sep 2026): Article The rise of the $100-billion RWA perp market Trading in perpetual futures tied to stocks, gold, and other traditional assets is growing fast. And an increasing share of that activity is now happening onchain. These contracts, often referred to  
  http://shitter.thepixora.com/a16zcrypto/status/2102875903500197915#m
- @novogratz (Mike Novogratz, Wed, 23 Sep 2026): Thanks for making the trip to Lubbock, Mike — and for spending time with our Red Raider football team ahead of the game. Great to have you at @TexasTech, and even better to cap off the visit with a big win at the new @galaxyhq Stadium. This partnership is just getting started. #WreckEm! Mike Novogratz (@novogratz) Last Friday, I visited our flagship campus Helios in West Texas. Three years ago, this was still a bitcoin mining facility. Today Helios is a fully operational AI-ready campus with 133MW of critical IT capacity, and we’re just getting started! @galaxyhq is taking a big swing out here  
  http://shitter.thepixora.com/CreightonForTX/status/2102869773776269419#m
- @a16zcrypto (a16z Crypto, Wed, 23 Sep 2026): Note: While a small number of U.S.-regulated centralized platforms offer products similar to perpetual futures contracts to U.S. persons, most centralized and all decentralized exchanges restrict U.S. persons’ access to true perpetual futures contracts.  
  http://shitter.thepixora.com/a16zcrypto/status/2102823016929624104#m
- @a16zcrypto (a16z Crypto, Wed, 23 Sep 2026): Perps have become one of crypto’s most-traded products. @guywuolletjr and @jay_drainjr explain where they came from, how they work, and why more of the market is moving onchain. Video  
  http://shitter.thepixora.com/a16zcrypto/status/2102823014090064201#m
- @galaxyhq (Galaxy Digital, Wed, 23 Sep 2026): Last Friday, I visited our flagship campus Helios in West Texas. Three years ago, this was still a bitcoin mining facility. Today Helios is a fully operational AI-ready campus with 133MW of critical IT capacity, and we’re just getting started! @galaxyhq is taking a big swing out here, and so is America. The move to build an AI future for this country is real, and none of it happens without the physical infrastructure. It starts with power, land, and hard-working people willing to put in the work to build a new future. Our partnership with @TechAthletics with Galaxy Stadium is part of investing  
  http://shitter.thepixora.com/novogratz/status/2102773522292428868#m
- @taomedia_ (TAO Media, Wed, 23 Sep 2026): Midcentury just raised a $15M seed and emerged from stealth to build the “scaling layer” for physical AI. The company is already working with frontier labs, with 2M+ hours of egocentric robotics data spanning 50+ environments and 20,000 tasks. tao.media/midcentury-raises-… Link Midcentury Raises $15M Seed to Build Physical AI Data and Simulation Infrastructure The stealth exit pairs a large egocentric robotics dataset with Matrix, a simulation platform for evaluating and improving robot policies before deployment. tao.media  
  http://nitter.jaydenha.uk/taomedia_/status/2102771470296650095#m
- @webuildscore (Score, Wed, 23 Sep 2026): Ran our auto-annotate engine on 120 frames of highway traffic. every car, truck, and person on the road, tagged. If you are still drawing bounding boxes by hand in 2026, blink twice and we will send help. Try it here: scorestudio.ai Video  
  http://shitter.thepixora.com/webuildscore/status/2102768498426380399#m
- @taomedia_ (TAO Media, Wed, 23 Sep 2026): ICYMI: Harvard &amp; @chutes_ai dropped one of the biggest real-world LLM serving traces we’ve seen: a full year of production inference metadata. The open dataset spans 6.12B requests across 9,174 models. tao.media/harvard-and-chutes… Link Harvard and Chutes Release Yearlong LLM Inference Dataset With 6.12B Requests The open dataset gives researchers production traces from Chutes for studying LLM serving, caching, and load balancing. tao.media  
  http://nitter.jaydenha.uk/taomedia_/status/2102761820096528736#m
- @galaxyhq (Galaxy Digital, Wed, 23 Sep 2026):   
  http://shitter.thepixora.com/galaxyhq/status/2102759121372012837#m
- @galaxyhq (Galaxy Digital, Wed, 23 Sep 2026): Read more here: theblock.co/news/business/20… Link Galaxy adds $100 million in Sky&apos;s sUSDS to treasury, buys SKY token Galaxy has added $100 million of sUSDS to its corporate treasury, approved sUSDS as collateral across its institutional trading business, and acquired an undisclosed amount of SKY. theblock.co  
  http://shitter.thepixora.com/galaxyhq/status/2102757266059325881#m
- @galaxyhq (Galaxy Digital, Wed, 23 Sep 2026): Galaxy is expanding its partnership with Sky Protocol across treasury, lending and capital markets. We are now holding Sky’s sUSDS in our own treasury and accepting it as loan collateral, so clients may continue to earn yield even while using that same asset to back a loan. We're also expanding how we borrow through Sky to support additional financing for our institutional clients, putting idle capital to work, onchain. This builds on a relationship we've developed with @SkyEcosystem over time, having borrowed on Spark to support Galaxy Onchain Financing Rate (GOFR). Structuring this new tri-p  
  http://shitter.thepixora.com/galaxyhq/status/2102757263253426562#m
- @VantaTrading (Vanta, Wed, 23 Sep 2026): gm Vanta fam, say it back what are you trading today? and in case you missed it... my first giveaway is below. maybe more to come soon? Vanta Trading (@VantaTrading) vanta's intern here - just decided i'm giving away a $100k challenge now 💸 how to enter • retweet this post • follow @VantaTrading • tag a friend and tell us what you would do with your first payout winner announced friday, september 25 🚨 — http://shitter.thepixora.com/VantaTrading/status/2102402116295733434#m  
  http://shitter.thepixora.com/VantaTrading/status/2102744558777897078#m
- @JosephJacks_ (Joseph Jacks, Wed, 23 Sep 2026): Charging for any education whatsoever in the age of AI is silly. It has never been more possible to completely delete ALL educational systems entirely and create a culture of continuous learning through example and curiosity.  
  http://shitter.thepixora.com/JosephJacks_/status/2102727749836190124#m
- @JosephJacks_ (Joseph Jacks, Wed, 23 Sep 2026): Read books before sleeping. Write your goals and note progress in writing. Talk to smarter people than yourself on a regular basis. Learn new things (skills, topics, domains). Create new phrases for things you have a hard time concisely expressing. ♾️ nature (@Nature) There is growing concern that AI can blunt memory and reasoning. Science shows ways to keep the brain sharp go.nature.com/4h4cZP2 Link How to stay smart in the age of AI: the science of critical thinking Nature - There is growing concern that AI can blunt memory and reasoning. But science shows ways to keep the brain sharp. natur  
  http://shitter.thepixora.com/JosephJacks_/status/2102726481461784615#m
- @JosephJacks_ (Joseph Jacks, Wed, 23 Sep 2026): umbrelOS 2.0 is out and we're feeling the love from y'all. so here's 10% off Umbrel Home and Umbrel Pro, worldwide, up to $200 off, until Sept 29: umbrel.com Umbrel ☂️ (@umbrel) Just a small computer, at home, that becomes your cloud. Introducing umbrelOS 2.0. Out today. Video — http://shitter.thepixora.com/umbrel/status/2102430946603810900#m  
  http://shitter.thepixora.com/umbrel/status/2102720948365643901#m
- @JosephJacks_ (Joseph Jacks, Wed, 23 Sep 2026): Quick stop @taoyuanairport .. @JensenHuang is everywhere. 🔥🇹🇼  
  http://shitter.thepixora.com/JosephJacks_/status/2102715291671441411#m
- @manakoai (Manako, Wed, 23 Sep 2026): This weekend the team brought 15 stations online across Lyon, France. Three days of work. Around five minutes end to end for each site. Deploying computer vision to a physical location usually means weeks of integration. New cameras, a site visit, cabling, sign-off. Every one of these 15 stations went live on the cameras it already had. No new hardware, no rewiring, no site visits. We point Manako at the existing feed and it starts watching and alerting. The reason we did 15 at once was to see how deployment holds up across different setups. No two stations are the same, camera angles, how the  
  http://shitter.thepixora.com/manakoai/status/2102696954937426000#m
- @JosephJacks_ (Joseph Jacks, Wed, 23 Sep 2026): We've tweaked/improved who we're hiring... ◌︎ Senior Product Design Engineer ◌︎ Full-time &amp; Fully Remote → cal.com/jobs/senior-product-… 💡 We're looking for product designers who have transitioned heavily into design engineering. Link Cal.com | Scheduling Software for Online Bookings A fully customizable scheduling software for individuals, businesses taking calls and developers building scheduling platforms where users meet users. cal.com Matt (@uixmat) I’m hiring a Senior Product Designer for @calcom to work alongside myself and the product team. Full-time, fully remote &amp; competitive  
  http://shitter.thepixora.com/uixmat/status/2102696698258559200#m
- @taomedia_ (TAO Media, Wed, 23 Sep 2026): 418,000 people are already using SpaceXAI’s Grok Bot weekly, about a month after launch. Usage jumped 24% week over week, with an estimated ~70:30 enterprise skew. tao.media/spacexais-grok-bot… Link SpaceXAI’s Grok Bot Reaches 418,000 Weekly Users After First Month The cloud-computer agent grew 24% week over week, with enterprises estimated to account for roughly 70% of its user base. tao.media  
  http://nitter.jaydenha.uk/taomedia_/status/2102584192760750387#m
- @VantaTrading (Vanta, Wed, 23 Sep 2026): 10%. That's the whole target on a Classic evaluation, and there's one to pass. A Classic evaluation has no time limit and no consistency rule. Pass one on $50,000 or $100,000 and Vanta can move you up to a $1,000,000 Pro account. Get started -&gt; app.vantatrading.io  
  http://shitter.thepixora.com/VantaTrading/status/2102578874773344325#m
- @shibshib89 (Ala Shaabana, Wed, 16 Sep 2026): LFG! Crucible Labs (@CrucibleLabs) Crucible Wallet Extension v2.1.1 is LIVE. This isn’t just an update. We rebuilt the entire wallet experience from the ground up. A completely new UI. More control over your TAO. More Bittensor tools built directly into your wallet. What’s new in v2.1.1: ✔️Completely updated UI + light/dark mode ✔️Claim rewards directly in the wallet ✔️Unified balance across TAO + alpha ✔️Universal Swap ✔️Transfer TAO + alpha ✔️Subnet discovery + detailed subnet views ✔️Multi-address support for seed phrases ✔️12 and 24 word seed phrase support ✔️Updated Smart Account + Reward  
  http://shitter.thepixora.com/shibshib89/status/2100300168633761947#m
- @jaltucher (James Altucher, Wed, 16 Sep 2026): Working on an AI-powered end to end platform for designing optical and then quantum chips at $QCLS. More details and refinements later but you can check it out at VibeGDS.io - you just enter plain English for the chip you want and it will build it out, simulate, verify, etc. Of interest mostly to optical engineers.  
  http://shitter.thepixora.com/jaltucher/status/2100262449685364904#m
- @novogratz (Mike Novogratz, Wed, 16 Sep 2026): Our economy doesn’t work without immigration. We need at least 1.5-2mm new immigrants a year to create taxpayers and consumers to help us grow our way out of 40th in debt and to pay for an aging population. This isn’t political. It’s just math. We of course can decide what immigrants we take. From where, what educational level, wealth etc. that’s political. But the fact that we need them isn’t. Lisa Boothe (@LisaMarieBoothe) At this point, I am fine with shutting down all immigration, legal or not. It's a mess. — http://shitter.thepixora.com/LisaMarieBoothe/status/2099891080258875467#m  
  http://shitter.thepixora.com/novogratz/status/2100193741633929406#m
- @novogratz (Mike Novogratz, Wed, 16 Sep 2026): Govt feels broken. 18 months of work between our industry, dems and republicans and Clarity falls apart on the 5 yard line. All the issues got to a hard fought compromise other than one. On Ethics both sides dug in and decided their stance was more important than the long run good of a major industry and our countries chance to lead it. Republicans were afraid of putting real limits on a President’s ability to profit from digital assets. Dems decided that this one industry is where they would fight a corruption battle. They were scared to be seen doing anything that could be perceived as being  
  http://shitter.thepixora.com/novogratz/status/2100020845942911165#m
- @lium_io (Lium, Wed, 09 Sep 2026): lium.io Month in review: $964k billed to 1187 renters (36% MoM growth). 1,908 new signups, ~80% MoM user retention 63% of rentals programatically initiated (agents) 7,697 rentals; medium rental time: 1.15 hours.  
  http://nitter.jaydenha.uk/lium_io/status/2097824624117473549#m
- @ridges_ai (Ridges, Wed, 09 Sep 2026): ridges.ai/explore/28 Link Ridges AI AI Agents, powered by Bittensor | SN62 ridges.ai  
  http://nitter.jaydenha.uk/ridges_ai/status/2097823739765526549#m
- @ridges_ai (Ridges, Wed, 09 Sep 2026): Next competition is live: Database Engineering. Agents compete on database engineering problems, fixing bugs, optimizing queries, and working with ORMs and GraphQL. Why this Niche next? Because inefficient queries are a real engineering challenge, and one where specialist agents have plenty of room to outperform. Open now for submissions:  
  http://nitter.jaydenha.uk/ridges_ai/status/2097823726561866122#m
- @shibshib89 (Ala Shaabana, Wed, 09 Sep 2026): Did you hear? Crucible Wallet is officially live on iOS today. An easy to use Bittensor wallet with Ledger security, Unified Swap and subnet level performance. Now available on iOS in the US, Android and Chrome. Download at CrucibleLabs.com #Bittensor #TAO #CrucibleWallet  
  http://shitter.thepixora.com/CrucibleLabs/status/2097815766473323006#m
- @lium_io (Lium, Wed, 09 Sep 2026): Steadily building the most decentralized GPU cloud Lium now has capacity from 68 datacenters across 21 countries Have GPUs? Join now. Lium pays you even for idle minutes. Make your nodes rentable in 5 minutes -&gt; docs.lium.io/providers/quick…  
  http://nitter.jaydenha.uk/lium_io/status/2097803045362966828#m
- @shibshib89 (Ala Shaabana, Wed, 09 Sep 2026): We are officially on iOS! Onwards 🚀 Crucible Labs (@CrucibleLabs) A long time coming and officially here. Crucible Wallet is now available on iOS in the US. An easy, intuitive Bittensor wallet for your everyday TAO needs, with Unified Swap, portfolio tracking and Ledger support wherever you go. Already available on Google Play and Chrome Store. Download at CrucibleLabs.com #CrucibleWallet #TAO #Bittensor — http://shitter.thepixora.com/CrucibleLabs/status/2097699938209857625#m  
  http://shitter.thepixora.com/shibshib89/status/2097724813028516224#m
- @zeussubnet (Zeus Subnet, Wed, 09 Sep 2026): Zeus is energy-aware. How? 👇 For temperature, we use population as a proxy for where demand matters. For wind and solar, we use generation capacity to track where supply matters. Geographic weights derived from this data are now used by validators when scoring forecasts. They’re stricter in the regions where weather impacts energy supply and demand the most. This creates a stronger incentive for teams on Zeus to shift their focus towards those regions. For now, we’ve limited the focus to Europe, where several desks are evaluating our data as we speak. We may expand to other interesting trading  
  http://nitter.jaydenha.uk/zeussubnet/status/2097696101822304723#m
- @ridges_ai (Ridges, Wed, 09 Sep 2026): CMC Verification post: ridges.ai  
  http://nitter.jaydenha.uk/ridges_ai/status/2097651752464011375#m
- @shibshib89 (Ala Shaabana, Wed, 02 Sep 2026): Crucible Labs dropping #downwiththedev Episode 1. We breakdown the Mobile Wallet with @buildwithsamp. Take a listen. Video  
  http://shitter.thepixora.com/CrucibleLabs/status/2095144290376937770#m
- @ridges_ai (Ridges, Tue, 28 Jul 2026): ⛰️ x402 is now live on Ridges X402 is an agentic payment protocol that lets agents pay for API access autonomously. Integrated with Ridgeline, agents can now pay for and access our coding infrastructure directly, no human in the loop.  
  http://nitter.jaydenha.uk/ridges_ai/status/2082103797418262564#m
- @taomedia_ (TAO Media, Tue, 22 Sep 2026): The @conjectures_io system is reaching escape velocity. Today, the team announced a solution to Erdős Problem 1062(ii), open since at least 1994. It's their fifth Erdős solution of September! tao.media/conjectures-miners… Link Conjectures Miners Prove Erdős 1062(ii) Density Is Irrational in Lean The Bittensor formal-math subnet says a miner-submitted proof resolves the irrationality question for a classic fork-free-set density. tao.media  
  http://nitter.jaydenha.uk/taomedia_/status/2102533534976229487#m
- @YumaGroup (Yuma Holdings, Tue, 22 Sep 2026): In the past two weeks, Trishool joined the @OpenAI cyber program and launched its Output Guard product for model-output alignment, complementing its existing Input Guard. Since launch, Output Guard has already closed ~50% of the gap to the leading model's performance, powered by continuously improving intelligence produced on Bittensor. $TAO Trishool | SN23 (@trishoolai) Two weeks ago we shipped the first version of our output guard and showed you the starting number. 73.9% F1. We called it the floor, not the ceiling. Here is the floor already moving. The output guard is now at 78.53% F1. That  
  http://shitter.thepixora.com/YumaGroup/status/2102527344166465625#m
- @opentensor (Opentensor Foundation, Tue, 22 Sep 2026): .@openroboto just built a decentralized alternative to @Figure_robot’s Index for collecting robot training data, with real-world capture hardware. Open robotics on Bittensor now has its data network to challenge the industry’s biggest labs. Bittensor is coming for physical AI. OpenRoboto (@openroboto) Today we’re launching OpenRoboto Shift, opening a new chapter for OpenRoboto. Shift is a decentralized network for collecting egocentric robotics data: first-person video of real people doing real work. Only Possible on Bittensor. Explore Shift → shift.openroboto.ai/ Video — http://nitter.jaydenh  
  http://nitter.jaydenha.uk/opentensor/status/2102525497687285851#m
- @opentensor (Opentensor Foundation, Tue, 22 Sep 2026): .@openroboto just built a decentralized alternative to @Figure_robot’s Index for collecting robot training data, with real-world capture hardware. Open robotics on Bittensor now has its data network to challenge the industry’s biggest labs. Bittensor is coming for physical AI. OpenRoboto (@openroboto) Today we’re launching OpenRoboto Shift, opening a new chapter for OpenRoboto. Shift is a decentralized network for collecting egocentric robotics data: first-person video of real people doing real work. Only Possible on Bittensor. Explore Shift → shift.openroboto.ai/ Video — http://shitter.thepix  
  http://shitter.thepixora.com/opentensor/status/2102525497687285851#m
- @a16zcrypto (a16z Crypto, Tue, 22 Sep 2026): You can copy the code. You can’t copy the network of lenders, borrowers, and companies building on it. Morpho continues to show the power of open credit networks. Paul Frambot 🦋 (@PaulFrambot) I’ve been asked a lot what it’s like to partner with both Coinbase and Robinhood when they compete so fiercely. The answer comes down to Morpho’s fundamental purpose: connecting. Morpho is an open credit network designed to connect lenders and borrowers across any boundary (social, geographic, political, …). More borrowers create more demand for capital. More lenders create more competition to fund borro  
  http://shitter.thepixora.com/guywuolletjr/status/2102523019906478220#m
- @dylan522p (Dylan Patel, Tue, 22 Sep 2026): Spoke with AMD, they did not ship / sell this dual use chip to this firm and they're investigating the sourcing. This violates their policies + they work with authorities to take action on violations I am very concerned about the fact that pricing discrepancy is so large. I have heard from multiple folks that there are bitstream compatible FPGAs not from AMD that are floating around too. Dylan Patel (@dylan522p) US supply chains for electronics suck so much AMD found a business opportunity in dumping US military chips for 1/4 of the cost in China. US list price is $36k for this chip, with $4-5  
  http://nitter.jaydenha.uk/dylan522p/status/2102503347681210570#m
- @VantaTrading (Vanta, Tue, 22 Sep 2026): Vanta Pro is a $1,000,000 account. 1% on a $100,000 Classic pays you $2,000. Your Pro return is applied to your Classic account size, then doubled through Grow. So a 1% month is worth 2% to you. Every reward we've paid is on our public ledger. vantatrading.io/rewards  
  http://shitter.thepixora.com/VantaTrading/status/2102495825159180512#m
- @VantaTrading (Vanta, Tue, 22 Sep 2026): day 1 as Vanta's intern has been fun should i change the password and take over our X page full time? just kidding... for now maybe i'll take over the Vanta discord next discord.gg/vantatrading Link Join the Vanta Trading Discord Server! Pass our 1-step trading test and earn a $100k account. Keep 100% of your rewards. Grow to $2.5M.vantatrading.io | 1756 members discord.com Vanta Trading (@VantaTrading) vanta's intern here - just decided i'm giving away a $100k challenge now 💸 how to enter • retweet this post • follow @VantaTrading • tag a friend and tell us what you would do with your first p  
  http://shitter.thepixora.com/VantaTrading/status/2102485693423329363#m
- @a16zcrypto (a16z Crypto, Tue, 22 Sep 2026): Ben Horowitz says instead of banning AI, educators should set problems students can't solve without it: "I was talking to Dan Boneh, who is a great professor of computer science and cryptography at Stanford. His take on AI was: You have two choices. You can ban it, and by the way, that won't work. Or you can make the problems so hard that you can't solve them without AI." "What he's seeing is, 'I've got students solving things that no student in history could have ever solved.' That's what's possible. You want to have that orientation: What can you solve with the tools? What can you do that's   
  http://shitter.thepixora.com/a16z/status/2102476819438141767#m
- @taomedia_ (TAO Media, Tue, 22 Sep 2026): Pumped for this one Tesla owners can now use @bot to get work done on the go. Place a coffee order, book a reservation, get through your email. All hands free! Follow @taomedia_ tao.media/tesla-adds-grok-co… Link Tesla Adds Grok Connectors and Bot Tasks for Hands-Free In-Car Work The update lets drivers manage inboxes, calendars, files, and task workflows by voice, while more complex Grok Bot jobs start on SuperGrok Heavy. tao.media  
  http://nitter.jaydenha.uk/bart_hillerich/status/2102473875116511319#m
- @VantaTrading (Vanta, Tue, 22 Sep 2026): Think about this: - Take Vanta's classic challenge - Pass and start earning rewards - Rewards paid in tokens - Revenue from Vanta goes back to the token You earn real rewards AND a stake in our decentralized ecosystem. That's a flywheel, all built around trader success 🚀 (Also, if you want rewards in USD or USDC, that's your choice too!) Arrash (@0xarrash) Received my first alpha token payout from @VantaTrading. All of my payouts are trackable here: taostats.io/account/5EUkfavM… Inside Vanta Trading, every trader can choose to take their rewards in alpha, Vanta’s native token. Under the hood,   
  http://shitter.thepixora.com/VantaTrading/status/2102449928996036775#m


---
_Generated at 2026-09-23T22:39:37.548772+00:00 by scripts/intel/aggregate.py. Treat this digest as input context, not as ground truth. Verify before quoting._
