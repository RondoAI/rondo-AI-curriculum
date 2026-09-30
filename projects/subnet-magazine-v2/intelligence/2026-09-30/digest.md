# Intelligence Digest, 2026-09-30

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

_no commits or releases in the lookback window_

## ⊕ ECOSYSTEM BLOGS via RSS

_no new posts in the lookback window_

## ⊕ X via NITTER, voices we track

- @markjeffrey (Mark Jeffrey, Wed, 30 Sep 2026): Boom &gt; Doom Beff (e/acc) (@beffjezos) Never doom. Always accelerate. e/acc — http://shitter.thepixora.com/beffjezos/status/2105399255779488202#m  
  http://shitter.thepixora.com/markjeffrey/status/2105429376905216481#m
- @markjeffrey (Mark Jeffrey, Wed, 30 Sep 2026): Looking forward to the Strange New Worlds episode where the crew gets stuck in a Road Runner cartoon. Watcher.Guru (@WatcherGuru) JUST IN: 🇺🇸 Judge officially approves Paramount's acquisition of Warner Bros for $110,000,000,000 — http://shitter.thepixora.com/WatcherGuru/status/2105385372444442786#m  
  http://shitter.thepixora.com/markjeffrey/status/2105423685545009400#m
- @markjeffrey (Mark Jeffrey, Wed, 30 Sep 2026): Did you miss any of the great presentations at @ExploitSummit ? Or do you have any talks you’d like to watch again? Great news. Our LIVESTREAM website has them all. stream.vidaio.io/vod.html Video On Demand (VOD) allows you to watch all the action. At the top of the page, look for the “Watch again” tab. Filter by Day 1 or 2, and which stage the talk was given. Optionally, use the search bar on the right to search by speaker, subnet, or talk title. Every talk will have subtitles in English, French, Spanish, Chinese, German, and Italian, prepared after the event with our most accurate models, pl  
  http://shitter.thepixora.com/vidaio_/status/2105411694688399582#m
- @markjeffrey (Mark Jeffrey, Wed, 30 Sep 2026): Today, the Kusanagi team visited MIT’s @medialab to present Bittensor. We met with the lab’s leadership and researchers for initial discussions about a potential partnership between @MIT and the wider Bittensor ecosystem through @opentensor. Let’s make TAO win.  
  http://shitter.thepixora.com/kusanagi_vntrs/status/2105398290107798012#m
- @markjeffrey (Mark Jeffrey, Wed, 30 Sep 2026): Fantastic keynote address from @const_reborn highlighting the incredible progress Bittensor has made over the last year and where it stands in the context of the broader AI landscape. sun runner (@0xSunRun) Bittensor State of the Union feat. @const_reborn. A must watch/listen. No one is bullish enough on what is being built here. Video — http://shitter.thepixora.com/0xSunRun/status/2104648112963047425#m  
  http://shitter.thepixora.com/stillcorecap/status/2105376853254906260#m
- @webuildscore (Score, Wed, 30 Sep 2026): Substance over style Max (@MaxSebti) how do you get strangers to build better vision models than you, without trusting any of them? adversarial vision ai delivered to you by opus 5.5 max Video — http://shitter.thepixora.com/MaxSebti/status/2105340056827314278#m  
  http://shitter.thepixora.com/webuildscore/status/2105340200759222397#m
- @opentensor (Opentensor Foundation, Wed, 30 Sep 2026): This Thursday on Novelty Search :: Subnet 80 :: @openroboto OpenRoboto is building an open competition for robot intelligence on Bittensor, where miners improve shared base models and each champion becomes the next starting point. They are now expanding into real robot validation and Shift, their decentralized network for collecting real world robotics data, connecting model improvement with physical data and commercial demand. Thursday :: 5PM EDT / 9PM UTC Hosted by @const_reborn  
  http://shitter.thepixora.com/opentensor/status/2105322199787700284#m
- @webuildscore (Score, Wed, 30 Sep 2026): 256 vision AI research teams competing to build the best models on the planet. Different tasks, different approaches, different ways to win. Models are judged on results through transparent, independent validation running 24/7. We’re building a vision lab where today’s best is tomorrow’s target. There’s always someone hungry enough to push it further, and an incentive to do exactly that. It’s more than automated research or recursive self-improvement. It’s the human need to evolve and win, distilled into an incentive mechanism. That’s Score. That’s SN44. That’s what building on Bittensor with   
  http://shitter.thepixora.com/webuildscore/status/2105306037943144483#m
- @1inch (1inch, Wed, 30 Sep 2026): Swap USDG for tokenized Apple on @RobinhoodCrypto Chain. Same chain, one swap. Video  
  http://shitter.thepixora.com/1inch/status/2105289057903182213#m
- @1inch (1inch, Wed, 30 Sep 2026):   
  http://shitter.thepixora.com/1inch/status/2105289058280747354#m
- @1inch (1inch, Wed, 30 Sep 2026): Grab the book here: written.app/stack/35  
  http://shitter.thepixora.com/1inch/status/2105254252235157588#m
- @1inch (1inch, Wed, 30 Sep 2026): The digital edition of reDeFine Money is live. The history of DeFi, told by the people who built it. One line from @newmichwill, founder of @CurveFinance, stuck with us: ‘'If it is real DeFi, no one can take your funds, not even the project you have them in.’' When we started Aqua, that was the question. Should a protocol ever hold your tokens? We decided no. Aqua contracts hold zero tokens. Your funds stay in your wallet and only move when a swap needs them. One wallet can back many positions at once. Video  
  http://shitter.thepixora.com/1inch/status/2105254248971653311#m
- @polychain (Polychain Capital, Wed, 24 Jun 2026): I'm excited to share that Cambrian has raised $11.9M to build the financial intelligence layer for the convergence of AI, digital assets, and traditional finance. Our seed round was led by @Polychain and Franklin Templeton @FTDA_US: a convergence itself of a top OG digital assets fund and a $1.7T institutional asset manager of 75+ years. As AI starts to consume more data in minutes than most humans do in lifetimes, finance is evolving to adapt to this reality ⤵️ Cambrian Network 🪴 (@CambrianNetwork) Big news: we’ve raised $11.9 million to build the world’s financial intelligence layer. @Polych  
  http://shitter.thepixora.com/0xsamgreen/status/2069836236362313887#m
- @polychain (Polychain Capital, Wed, 24 Jun 2026): EXCLUSIVE: a16z CSX-backed Cambrian raises $6 million seed to build blockchain data oracle network theblock.co/post/406028/a16z… Link a16z CSX-backed Cambrian raises $6 million seed to build blockchain data oracle network Cambrian’s new funding will expand its API and verifiable oracle network for institutions and AI agents, with Base and Solana already in production. theblock.co  
  http://shitter.thepixora.com/TheBlockCo/status/2069827932843909349#m
- @novogratz (Mike Novogratz, Wed, 23 Sep 2026): Thanks for making the trip to Lubbock, Mike — and for spending time with our Red Raider football team ahead of the game. Great to have you at @TexasTech, and even better to cap off the visit with a big win at the new @galaxyhq Stadium. This partnership is just getting started. #WreckEm! Mike Novogratz (@novogratz) Last Friday, I visited our flagship campus Helios in West Texas. Three years ago, this was still a bitcoin mining facility. Today Helios is a fully operational AI-ready campus with 133MW of critical IT capacity, and we’re just getting started! @galaxyhq is taking a big swing out here  
  http://shitter.thepixora.com/CreightonForTX/status/2102869773776269419#m
- @manakoai (Manako, Wed, 23 Sep 2026): USA ⏭️ Max (@MaxSebti) just flashed the first few @manakoai boxes that will be deployed in the US — http://shitter.thepixora.com/MaxSebti/status/2102842552827412624#m  
  http://shitter.thepixora.com/manakoai/status/2102843727048024497#m
- @novogratz (Mike Novogratz, Wed, 23 Sep 2026): Last Friday, I visited our flagship campus Helios in West Texas. Three years ago, this was still a bitcoin mining facility. Today Helios is a fully operational AI-ready campus with 133MW of critical IT capacity, and we’re just getting started! @galaxyhq is taking a big swing out here, and so is America. The move to build an AI future for this country is real, and none of it happens without the physical infrastructure. It starts with power, land, and hard-working people willing to put in the work to build a new future. Our partnership with @TechAthletics with Galaxy Stadium is part of investing  
  http://shitter.thepixora.com/novogratz/status/2102773522292428868#m
- @manakoai (Manako, Wed, 23 Sep 2026): This weekend the team brought 15 stations online across Lyon, France. Three days of work. Around five minutes end to end for each site. Deploying computer vision to a physical location usually means weeks of integration. New cameras, a site visit, cabling, sign-off. Every one of these 15 stations went live on the cameras it already had. No new hardware, no rewiring, no site visits. We point Manako at the existing feed and it starts watching and alerting. The reason we did 15 at once was to see how deployment holds up across different setups. No two stations are the same, camera angles, how the  
  http://shitter.thepixora.com/manakoai/status/2102696954937426000#m
- @tm0klc (Tim, Wed, 17 Jun 2026): Introducing Manako, the fastest way to turn any camera into an vision ai agent. Go on manako.ai. Join our waitlist. Video  
  http://shitter.thepixora.com/manakoai/status/2067298306200396197#m
- @shibshib89 (Ala Shaabana, Wed, 16 Sep 2026): LFG! Crucible Labs (@CrucibleLabs) Crucible Wallet Extension v2.1.1 is LIVE. This isn’t just an update. We rebuilt the entire wallet experience from the ground up. A completely new UI. More control over your TAO. More Bittensor tools built directly into your wallet. What’s new in v2.1.1: ✔️Completely updated UI + light/dark mode ✔️Claim rewards directly in the wallet ✔️Unified balance across TAO + alpha ✔️Universal Swap ✔️Transfer TAO + alpha ✔️Subnet discovery + detailed subnet views ✔️Multi-address support for seed phrases ✔️12 and 24 word seed phrase support ✔️Updated Smart Account + Reward  
  http://shitter.thepixora.com/shibshib89/status/2100300168633761947#m
- @novogratz (Mike Novogratz, Wed, 16 Sep 2026): Our economy doesn’t work without immigration. We need at least 1.5-2mm new immigrants a year to create taxpayers and consumers to help us grow our way out of 40th in debt and to pay for an aging population. This isn’t political. It’s just math. We of course can decide what immigrants we take. From where, what educational level, wealth etc. that’s political. But the fact that we need them isn’t. Lisa Boothe (@LisaMarieBoothe) At this point, I am fine with shutting down all immigration, legal or not. It's a mess. — http://shitter.thepixora.com/LisaMarieBoothe/status/2099891080258875467#m  
  http://shitter.thepixora.com/novogratz/status/2100193741633929406#m
- @lium_io (Lium, Wed, 09 Sep 2026): lium.io Month in review: $964k billed to 1187 renters (36% MoM growth). 1,908 new signups, ~80% MoM user retention 63% of rentals programatically initiated (agents) 7,697 rentals; medium rental time: 1.15 hours.  
  http://shitter.thepixora.com/lium_io/status/2097824624117473549#m
- @shibshib89 (Ala Shaabana, Wed, 09 Sep 2026): Did you hear? Crucible Wallet is officially live on iOS today. An easy to use Bittensor wallet with Ledger security, Unified Swap and subnet level performance. Now available on iOS in the US, Android and Chrome. Download at CrucibleLabs.com #Bittensor #TAO #CrucibleWallet  
  http://shitter.thepixora.com/CrucibleLabs/status/2097815766473323006#m
- @lium_io (Lium, Wed, 09 Sep 2026): Steadily building the most decentralized GPU cloud Lium now has capacity from 68 datacenters across 21 countries Have GPUs? Join now. Lium pays you even for idle minutes. Make your nodes rentable in 5 minutes -&gt; docs.lium.io/providers/quick…  
  http://shitter.thepixora.com/lium_io/status/2097803045362966828#m
- @shibshib89 (Ala Shaabana, Wed, 09 Sep 2026): We are officially on iOS! Onwards 🚀 Crucible Labs (@CrucibleLabs) A long time coming and officially here. Crucible Wallet is now available on iOS in the US. An easy, intuitive Bittensor wallet for your everyday TAO needs, with Unified Swap, portfolio tracking and Ledger support wherever you go. Already available on Google Play and Chrome Store. Download at CrucibleLabs.com #CrucibleWallet #TAO #Bittensor — http://shitter.thepixora.com/CrucibleLabs/status/2097699938209857625#m  
  http://shitter.thepixora.com/shibshib89/status/2097724813028516224#m
- @shibshib89 (Ala Shaabana, Wed, 02 Sep 2026): Crucible Labs dropping #downwiththedev Episode 1. We breakdown the Mobile Wallet with @buildwithsamp. Take a listen. Video  
  http://shitter.thepixora.com/CrucibleLabs/status/2095144290376937770#m
- @webuildscore (Score, Tue, 29 Sep 2026): Score Studio, explained by our little friend Claude Opus 5.5 Max Max (@MaxSebti) asked opus 5.5 to describe scorestudio.ai zero shot and it did this Video — http://shitter.thepixora.com/MaxSebti/status/2105066556552007876#m  
  http://shitter.thepixora.com/webuildscore/status/2105067553613586558#m
- @webuildscore (Score, Tue, 29 Sep 2026): Gun labeled. Rocket launcher, minigun and the rest of the weapon wheel next.  
  http://shitter.thepixora.com/webuildscore/status/2105024223269868015#m
- @webuildscore (Score, Tue, 29 Sep 2026): Preparing our Security Risk Indicator model for the GTA 6 release on November 19. We're already teaching it what a robbery looks like. Draw a box, Score Studio suggests the class, confirm, next frame. And yes, we know it's a bandana. Try it at scorestudio.ai  
  http://shitter.thepixora.com/webuildscore/status/2105023016014844353#m
- @opentensor (Opentensor Foundation, Tue, 29 Sep 2026): Watch @ExploitSummit Day 2 Live Lineup: - Enterprise-ready Bittensor :: @webuildscore × PwC France - Agentic world models on SN17 :: @404gen. The legal reality of subnet slots and validators :: Renno Law Firm. - Research vs Revenue :: @taostats × @MacrocosmosAI. - Reward hacking subnets :: Bitsec live demonstration. - Sovereignty in the age of AI :: SPUR × BTLabs. - OpenDev: Gamma deep dive :: @const_reborn - Pitchtensor :: live machine learning crowdfund - Synthetic genomes at scale :: @theminos_ai. - Where do we go from here? :: @chutes_ai, @metanova_labs, @taodotcom, @latentholdings @YumaGr  
  http://shitter.thepixora.com/opentensor/status/2105014802246418456#m
- @opentensor (Opentensor Foundation, Tue, 29 Sep 2026): 00:38 - Intro to Bittensor as Incentive computing 03:30 - Harnessing the exploit 06:00 - From Bitcoin → 128 Bittensor Subnets 09:00 - Revenue generating subnets 12:00 - Full stack model training on Bittensor. 19:20 - Bittensor Governance: Root → dTAO → Root Reborn 23:00 - External revenue flow becoming inputs to emissions. 24:04 - Gamma tokens 25:30 - Subnet-to-subnet economics 27:50 - Full stack products built entirely on Bittensor 33:40 - A “mind outside the state” Watch the full talk on YouTube redirect.invidious.io/G2GsHun38qM Link The State and Future of Bittensor :: Jacob Steeves Opening  
  http://shitter.thepixora.com/opentensor/status/2104969032508031485#m
- @opentensor (Opentensor Foundation, Tue, 29 Sep 2026): Bittensor is building toward a full-stack intelligence network that no single company or country can control. In his @ExploitSummit keynote, @const_reborn lays out the next steps towards that end state. Video  
  http://shitter.thepixora.com/opentensor/status/2104969028364329181#m
- @jtledore (Jean-Thomas Ledoré, Tue, 29 Sep 2026): was a pleasure to share the stage with Kelly and JT Crucible Labs (@CrucibleLabs) A great kickoff to day 2. Fun talking to @MaxSebti and @jtledore on how to extract value out of your subnet for Enterprises. — http://shitter.thepixora.com/CrucibleLabs/status/2104959199897698524#m  
  http://shitter.thepixora.com/MaxSebti/status/2104968626331893807#m
- @a16zcrypto (a16z Crypto, Tue, 29 Sep 2026): zk.money is back. A self-custodial wallet that lets you send and receive crypto privately. Your money, private by default. Reserve your unique tag to get started. launch.zk.money  
  http://shitter.thepixora.com/zk_money/status/2104966293199945975#m
- @jtledore (Jean-Thomas Ledoré, Tue, 29 Sep 2026): A great kickoff to day 2. Fun talking to @MaxSebti and @jtledore on how to extract value out of your subnet for Enterprises. Exploit Summit (@ExploitSummit) What does it take for a business to trust decentralized AI? On the OTF stage: @MaxSebti of Score and @jtledore of PwC France, with Kelly Woodward of @CrucibleLabs, for ‘What It Takes to Be Enterprise-Ready.’ A practical question for Bittensor’s next wave of adoption. — http://shitter.thepixora.com/ExploitSummit/status/2104945910736163076#m  
  http://shitter.thepixora.com/CrucibleLabs/status/2104959199897698524#m
- @jtledore (Jean-Thomas Ledoré, Tue, 29 Sep 2026): One of the reasons we built Kusanagi is to help other subnets turn strong technology into real enterprise adoption, just like we’re already doing with @webuildscore At @ExploitSummit, our co-founder @jtledore and close advisor @MaxSebti talked about what it takes for subnets to become enterprise-ready and win real customers.  
  http://shitter.thepixora.com/kusanagi_vntrs/status/2104958154777764233#m
- @jtledore (Jean-Thomas Ledoré, Tue, 29 Sep 2026): @jtledore on stage representing @kusanagi_vntrs Huge milestones achieved with @MaxSebti and @webuildscore 🔥  
  http://shitter.thepixora.com/Rapido_ai/status/2104944054853423414#m
- @opentensor (Opentensor Foundation, Tue, 29 Sep 2026): Exploit Summit: Live from Montreal Day 2 shitter.thepixora.com/i/broadcasts/1NGaroOYp… Link Exploit Summit Exploit Summit: Live from Montreal Day 2 http://shitter.thepixora.com/i/broadcasts/1NGaroOYpQXJj  
  http://shitter.thepixora.com/ExploitSummit/status/2104942854753947674#m
- @a16zcrypto (a16z Crypto, Tue, 29 Sep 2026): Article Blockchains create net new markets For most of financial history, the supply of new markets — not demand — was the bottleneck. Blockchains remove that bottleneck. I believe this will unlock an explosion of net new markets. Markets are  
  http://shitter.thepixora.com/robbiepetersen_/status/2104925872553709720#m
- @1inch (1inch, Tue, 29 Sep 2026): You open an Aqua position and your tokens stay in your wallet until someone takes the other side. Who that someone is, what happens at the moment of a fill and why taker access is gated at launch. Article Who actually fills your 1inch Aqua orders You open an Aqua position, set your pair, price range and fee, and your tokens stay in your wallet. Then you wait for someone to swap against that liquidity. In Aqua terminology you are the maker; the  
  http://shitter.thepixora.com/1inch/status/2104913312542564360#m
- @opentensor (Opentensor Foundation, Tue, 29 Sep 2026): Very excited crowd at Exploit. For those that missed, here is a break down of what I announced on stage.  
  http://shitter.thepixora.com/const_reborn/status/2104904084054777917#m
- @oroagents (Oro, Tue, 29 Sep 2026): Commerce is going to prove to be one of the largest opportunities in the agent world. Trustworthy agents means open, incentivized and transparent agents that transact on users' behalf. great article by @CrucibleLabs. Let's make this future happen the right way. Crucible Labs (@CrucibleLabs) Article a BIT of Joy: Issue 11 The Agent Era Is Here For the last few years, the AI industry has talked about agents as the next big thing. At this point, the more interesting question isn&apos;t when agents arrive. They&apos;re already — http://shitter.thepixora.com/CrucibleLabs/status/2103188134238564440#  
  http://shitter.thepixora.com/oroagents/status/2104794483745587425#m
- @oroagents (Oro, Tue, 22 Sep 2026): Check out our latest article for how we are approaching benchmarks and evals as the incentive layer on Bittensor - ORO (@oroagents) The team has been hard at work building ORO Bench and we're excited to share this with the world today. Now powering SN15 on Bittensor. Article ORO Bench The ORO model: Eval as an Incentive Mechanism Subnet owners that are testing agent capabilities should be thinking about their validation as EVAL as an incentive mechanism (EAAIM). If you build a — http://shitter.thepixora.com/oroagents/status/2102473778509087203#m  
  http://shitter.thepixora.com/oroagents/status/2102477102453055786#m
- @oroagents (Oro, Tue, 22 Sep 2026): We're excited to announce ORO Bench today, a benchmark that's powered by a generator creating new synthetic shopping environments everyday. This is now powering our subnet on Bittensor, SN15. Video  
  http://shitter.thepixora.com/oroagents/status/2102475717367963815#m
- @polychain (Polychain Capital, Tue, 15 Sep 2026): It's time for a new foundation. Not a new start. Legacy Mode is live on Passport, keep every account you already have, on code anyone can inspect. Switch to open source hardware and software while keeping your existing accounts for supported assets. Here’s how. 🧵 Video  
  http://shitter.thepixora.com/FoundationHQ/status/2099865846101180499#m
- @tm0klc (Tim, Tue, 07 Jul 2026): Subnet 44 @webuildscore is expanding. We’re incentivising training for a new vision-language model: Satori. Satori reasons AND grounds. It doesn’t just answer questions about an image. It points to the evidence. - Reason about scenes - Detect and segment objects - Read text - Count entities - Ground claims in pixels Most VLMs are split: strong reasoning OR strong grounding. Detection models localise, but can’t talk. Chatty VLMs describe fluently, but can’t prove it. Satori sits at the intersection. We’re starting with a 7B base model.  
  http://shitter.thepixora.com/tm0klc/status/2074298897305047101#m
- @_redteam_ (RedTeam / Innerworks, Thu, 27 Aug 2026): The Immune System for the Internet. Releasing next month. Oscar Hayek (@oscar_hayek) Defence in this era must be AI driven, the absolute baseline is adapting defences faster than attacks are being produced. Anything slower than this leaves you in a constant state of degradation. What we’ve built on @_redteam_ is an immune system for this problem. The attacks we ingest are evolved inside the system into complete novel vectors that cannot be produced anywhere else. Every one of these gets patched before an external attacker has the means/ability to create it, let alone release it. bittensor:nati  
  http://shitter.thepixora.com/_redteam_/status/2093081017145847826#m
- @polychain (Polychain Capital, Thu, 25 Jun 2026): Article The Missing AI Layer Is Not Security. It&apos;s Authority. AI agents are now computer users. They browse websites. They read files. They write code. They call APIs. They log in to accounts. They handle credentials, use tools, and take actions across software  
  http://shitter.thepixora.com/zherbert/status/2070178183333171395#m
- @manakoai (Manako, Thu, 24 Sep 2026): next batch of stations to be deployed with @manakoai is going to allow us to leverage a lot more @webuildscore models. - 4 motorway stations. beasts with 40+ cameras each. - that’s 10x more cameras than on unmanned stations. - massive fuel forecourts, EV charging bays, car wash, restaurants, supermarkets, coffee areas. the second best news… is it’s with a new signed client 👀  
  http://shitter.thepixora.com/arnod3f/status/2103174097522098609#m
- @manakoai (Manako, Thu, 24 Sep 2026): Same week, different rooms, same vision Paris ✅ London ✅ Next?  
  http://shitter.thepixora.com/manakoai/status/2103148213645558030#m


---
_Generated at 2026-09-30T23:24:37.180495+00:00 by scripts/intel/aggregate.py. Treat this digest as input context, not as ground truth. Verify before quoting._
