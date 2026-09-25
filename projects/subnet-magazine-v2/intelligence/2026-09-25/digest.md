# Intelligence Digest, 2026-09-25

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

- **Subtensor (chain)** (COMMIT `c004ceb`, 2026-09-24 20:32) Merge pull request #3198 from RaoFoundation/fix/basket-fee-drain  
  https://github.com/RaoFoundation/subtensor/commit/c004cebf360f4088187ee49d851dfb1a1eaaf710
- **Subtensor (chain)** (COMMIT `a8664c1`, 2026-09-24 19:52) fix(basket): restore runtime validation checks  
  https://github.com/RaoFoundation/subtensor/commit/a8664c169b81d5b06ce0b45ba0bab321742d3eb2
- **Subtensor (chain)** (COMMIT `e0722cb`, 2026-09-24 19:00) ts-tests: split the slowest Shield shard  
  https://github.com/RaoFoundation/subtensor/commit/e0722cbf6f578088bdf7f0bf2eb65b29d9991a1c
- **Subtensor (chain)** (COMMIT `b0771b7`, 2026-09-24 18:54) ci: run the Docker check only for node and image inputs  
  https://github.com/RaoFoundation/subtensor/commit/b0771b738a95e101ff33196b1fe86bea31aa09e5
- **Subtensor (chain)** (COMMIT `061105e`, 2026-09-24 18:54) ci: use the reader cache environment for pull-request-only jobs  
  https://github.com/RaoFoundation/subtensor/commit/061105e8e1c81335a3d8e9212570afc385b85bf9
- **Subtensor (chain)** (COMMIT `e7155a3`, 2026-09-24 18:36) clones: overlap SDK environment sync with clone regressions  
  https://github.com/RaoFoundation/subtensor/commit/e7155a3059d22377c43ce2232b19c69878e43b35
- **Subtensor (chain)** (COMMIT `22a0ee7`, 2026-09-24 18:09) sdk: stop stamping spec_version into generated bindings  
  https://github.com/RaoFoundation/subtensor/commit/22a0ee7951eb3f310d67e7cade1b608c9c87671c
- **Subtensor (chain)** (COMMIT `9e18e40`, 2026-09-24 16:37) clones: widen warp-sync peer search and retry wedged syncs  
  https://github.com/RaoFoundation/subtensor/commit/9e18e409bfd03d376d59dba300ca102144005d82
- **Subtensor (chain)** (COMMIT `7151896`, 2026-09-24 16:37) ci: persist trusted sccache writes and warm localnet builds  
  https://github.com/RaoFoundation/subtensor/commit/7151896dbaadc8955123dfca8870f844895c7311
- **Subtensor (chain)** (COMMIT `59a8706`, 2026-09-22 23:01) ci: assert Files API fail-closed branch structurally  
  https://github.com/RaoFoundation/subtensor/commit/59a8706af3ba606c42c10e43c37ecd0e44028c22

## ⊕ ECOSYSTEM BLOGS via RSS

_no new posts in the lookback window_

## ⊕ X via NITTER, voices we track

- @polychain (Polychain Capital, Wed, 24 Jun 2026): I'm excited to share that Cambrian has raised $11.9M to build the financial intelligence layer for the convergence of AI, digital assets, and traditional finance. Our seed round was led by @Polychain and Franklin Templeton @FTDA_US: a convergence itself of a top OG digital assets fund and a $1.7T institutional asset manager of 75+ years. As AI starts to consume more data in minutes than most humans do in lifetimes, finance is evolving to adapt to this reality ⤵️ Cambrian Network 🪴 (@CambrianNetwork) Big news: we’ve raised $11.9 million to build the world’s financial intelligence layer. @Polych  
  http://nitter.jaydenha.uk/0xsamgreen/status/2069836236362313887#m
- @polychain (Polychain Capital, Wed, 24 Jun 2026): EXCLUSIVE: a16z CSX-backed Cambrian raises $6 million seed to build blockchain data oracle network theblock.co/post/406028/a16z… Link a16z CSX-backed Cambrian raises $6 million seed to build blockchain data oracle network Cambrian’s new funding will expand its API and verifiable oracle network for institutions and AI agents, with Base and Solana already in production. theblock.co  
  http://nitter.jaydenha.uk/TheBlockCo/status/2069827932843909349#m
- @BarrySilbert (Barry Silbert, Wed, 23 Sep 2026): Fortitude has amended its existing credit facility with @DCGco, increasing commitment by $24 million. Approximately $31 million of remaining availability is expected to be funded by DCG in $ZEC, which Fortitude expects to sell to fund Zcash mining machine purchases, mining facility acquisitions, greenfield construction and infrastructure expansion, as Fortitude advances toward its proposed business combination with HeartSciences Inc. (Nasdaq: $HSCS). Read the announcement: businesswire.com/news/home/2…. $ZEC $HSCS Link Fortitude Announces Amendment to Existing DCG Credit Facility, Increasing C  
  http://nitter.jaydenha.uk/FortitudeCrypto/status/2102874420780175866#m
- @galaxyhq (Galaxy Digital, Wed, 23 Sep 2026): Thanks for making the trip to Lubbock, Mike — and for spending time with our Red Raider football team ahead of the game. Great to have you at @TexasTech, and even better to cap off the visit with a big win at the new @galaxyhq Stadium. This partnership is just getting started. #WreckEm! Mike Novogratz (@novogratz) Last Friday, I visited our flagship campus Helios in West Texas. Three years ago, this was still a bitcoin mining facility. Today Helios is a fully operational AI-ready campus with 133MW of critical IT capacity, and we’re just getting started! @galaxyhq is taking a big swing out here  
  http://nitter.jaydenha.uk/CreightonForTX/status/2102869773776269419#m
- @novogratz (Mike Novogratz, Wed, 23 Sep 2026): Thanks for making the trip to Lubbock, Mike — and for spending time with our Red Raider football team ahead of the game. Great to have you at @TexasTech, and even better to cap off the visit with a big win at the new @galaxyhq Stadium. This partnership is just getting started. #WreckEm! Mike Novogratz (@novogratz) Last Friday, I visited our flagship campus Helios in West Texas. Three years ago, this was still a bitcoin mining facility. Today Helios is a fully operational AI-ready campus with 133MW of critical IT capacity, and we’re just getting started! @galaxyhq is taking a big swing out here  
  http://shitter.thepixora.com/CreightonForTX/status/2102869773776269419#m
- @manakoai (Manako, Wed, 23 Sep 2026): USA ⏭️ Max (@MaxSebti) just flashed the first few @manakoai boxes that will be deployed in the US — http://nitter.jaydenha.uk/MaxSebti/status/2102842552827412624#m  
  http://nitter.jaydenha.uk/manakoai/status/2102843727048024497#m
- @manakoai (Manako, Wed, 23 Sep 2026): USA ⏭️ Max (@MaxSebti) just flashed the first few @manakoai boxes that will be deployed in the US — http://shitter.thepixora.com/MaxSebti/status/2102842552827412624#m  
  http://shitter.thepixora.com/manakoai/status/2102843727048024497#m
- @KyleSamani (Kyle Samani, Wed, 23 Sep 2026): The most important thing to note about this capital markets activity is that it comes with 0 overhang or debt obligation Clean, straight forward transaction to scale the treasury Forward Ind. | NASDAQ-$FWDI (@FWDind) Forward Industries ( $FWDI ) is closing a $25M registered direct offering with an institutional investor to acquire SOL. We continue to scale our treasury while increasing SOL-per-share accretion for shareholders. Read more in the full press release below. — http://nitter.jaydenha.uk/FWDind/status/2102744116656558304#m  
  http://nitter.jaydenha.uk/KyleSamani/status/2102813785597640800#m
- @KyleSamani (Kyle Samani, Wed, 23 Sep 2026): Top 10 all time life product Matteo Franceschetti (@m_franceschetti) BREAKING: Pod 6 is live. The sixth generation of our intelligent sleep system, redesigned for every kind of bed. ✅ The new Hub is small enough to fit under your bed frame ✅ More powerful than ever ✅ With 9x more sensors for enhanced accuracy ✅ In new Solo sizes, at our lowest starting price yet This is our most significant hardware launch to date, and our most accessible. Available now at eightsleep.com Video — http://nitter.jaydenha.uk/m_franceschetti/status/2102761196805816776#m  
  http://nitter.jaydenha.uk/KyleSamani/status/2102812665122857282#m
- @tplr_ai (Templar, Wed, 23 Sep 2026): Video  
  http://nitter.jaydenha.uk/tplr_ai/status/2102792674118164542#m
- @tplr_ai (Templar, Wed, 23 Sep 2026): Read the blog: tplr.ai/publications/blog/sk… Link Fault tolerance in low-bandwidth model parallelism: exploring pipeline stage-skipping with boundary... We explore how the residual nature of the transformer architecture can be leveraged to mitigate hardware faults, and demonstrate that the compression-based implementation of low-bandwidth model... tplr.ai  
  http://nitter.jaydenha.uk/tplr_ai/status/2102792676676432160#m
- @galaxyhq (Galaxy Digital, Wed, 23 Sep 2026): Last Friday, I visited our flagship campus Helios in West Texas. Three years ago, this was still a bitcoin mining facility. Today Helios is a fully operational AI-ready campus with 133MW of critical IT capacity, and we’re just getting started! @galaxyhq is taking a big swing out here, and so is America. The move to build an AI future for this country is real, and none of it happens without the physical infrastructure. It starts with power, land, and hard-working people willing to put in the work to build a new future. Our partnership with @TechAthletics with Galaxy Stadium is part of investing  
  http://nitter.jaydenha.uk/novogratz/status/2102773522292428868#m
- @novogratz (Mike Novogratz, Wed, 23 Sep 2026): Last Friday, I visited our flagship campus Helios in West Texas. Three years ago, this was still a bitcoin mining facility. Today Helios is a fully operational AI-ready campus with 133MW of critical IT capacity, and we’re just getting started! @galaxyhq is taking a big swing out here, and so is America. The move to build an AI future for this country is real, and none of it happens without the physical infrastructure. It starts with power, land, and hard-working people willing to put in the work to build a new future. Our partnership with @TechAthletics with Galaxy Stadium is part of investing  
  http://shitter.thepixora.com/novogratz/status/2102773522292428868#m
- @KyleSamani (Kyle Samani, Wed, 23 Sep 2026): BREAKING: Pod 6 is live. The sixth generation of our intelligent sleep system, redesigned for every kind of bed. ✅ The new Hub is small enough to fit under your bed frame ✅ More powerful than ever ✅ With 9x more sensors for enhanced accuracy ✅ In new Solo sizes, at our lowest starting price yet This is our most significant hardware launch to date, and our most accessible. Available now at eightsleep.com Video  
  http://nitter.jaydenha.uk/m_franceschetti/status/2102761196805816776#m
- @galaxyhq (Galaxy Digital, Wed, 23 Sep 2026):   
  http://nitter.jaydenha.uk/galaxyhq/status/2102759121372012837#m
- @galaxyhq (Galaxy Digital, Wed, 23 Sep 2026): Read more here: theblock.co/news/business/20… Link Galaxy adds $100 million in Sky&apos;s sUSDS to treasury, buys SKY token Galaxy has added $100 million of sUSDS to its corporate treasury, approved sUSDS as collateral across its institutional trading business, and acquired an undisclosed amount of SKY. theblock.co  
  http://nitter.jaydenha.uk/galaxyhq/status/2102757266059325881#m
- @manakoai (Manako, Wed, 23 Sep 2026): This weekend the team brought 15 stations online across Lyon, France. Three days of work. Around five minutes end to end for each site. Deploying computer vision to a physical location usually means weeks of integration. New cameras, a site visit, cabling, sign-off. Every one of these 15 stations went live on the cameras it already had. No new hardware, no rewiring, no site visits. We point Manako at the existing feed and it starts watching and alerting. The reason we did 15 at once was to see how deployment holds up across different setups. No two stations are the same, camera angles, how the  
  http://nitter.jaydenha.uk/manakoai/status/2102696954937426000#m
- @manakoai (Manako, Wed, 23 Sep 2026): This weekend the team brought 15 stations online across Lyon, France. Three days of work. Around five minutes end to end for each site. Deploying computer vision to a physical location usually means weeks of integration. New cameras, a site visit, cabling, sign-off. Every one of these 15 stations went live on the cameras it already had. No new hardware, no rewiring, no site visits. We point Manako at the existing feed and it starts watching and alerting. The reason we did 15 at once was to see how deployment holds up across different setups. No two stations are the same, camera angles, how the  
  http://shitter.thepixora.com/manakoai/status/2102696954937426000#m
- @_redteam_ (RedTeam / Innerworks, Wed, 19 Aug 2026): Listen in to @oscar_hayek discussing RedTeam on @YumaGroup's Subnet Spotlight. Origin, commercial and technical traction, and where we're headed. Yuma (@YumaGroup) How RedTeam (SN61) powers their cyberthreat immune system with Bittensor shitter.thepixora.com/i/broadcasts/1dGYlazzp… Link Yuma How RedTeam (SN61) powers their cyberthreat immune system with Bittensor http://shitter.thepixora.com/i/broadcasts/1dGYlazzpnEKX — http://shitter.thepixora.com/YumaGroup/status/2090076390163095836#m  
  http://shitter.thepixora.com/_redteam_/status/2090091530920878293#m
- @tm0klc (Tim, Wed, 17 Jun 2026): Introducing Manako, the fastest way to turn any camera into an vision ai agent. Go on manako.ai. Join our waitlist. Video  
  http://nitter.jaydenha.uk/manakoai/status/2067298306200396197#m
- @jaltucher (James Altucher, Wed, 16 Sep 2026): Working on an AI-powered end to end platform for designing optical and then quantum chips at $QCLS. More details and refinements later but you can check it out at VibeGDS.io - you just enter plain English for the chip you want and it will build it out, simulate, verify, etc. Of interest mostly to optical engineers.  
  http://nitter.jaydenha.uk/jaltucher/status/2100262449685364904#m
- @tplr_ai (Templar, Wed, 16 Sep 2026): When using pipeline compression with fixed projections shared across layers, robustness improves further as seen in the figure below. This suggests that shared projectors align representations across stage boundaries, making bypasses less disruptive. 4/n  
  http://nitter.jaydenha.uk/tplr_ai/status/2100237714918367690#m
- @tplr_ai (Templar, Wed, 16 Sep 2026): These results point toward training on a broader pool of compute, including unreliable workers and spot instances, while keeping healthy stages productive. Blog: tplr.ai/publications/blog/sk… n/n Link Fault tolerance in low-bandwidth model parallelism: exploring pipeline stage-skipping with boundary... We explore how the residual nature of the transformer architecture can be leveraged to mitigate hardware faults, and demonstrate that the compression-based implementation of low-bandwidth model... tplr.ai  
  http://nitter.jaydenha.uk/tplr_ai/status/2100237717162303718#m
- @tplr_ai (Templar, Wed, 16 Sep 2026): We’ve been researching fault tolerance in Crucible, Templar’s pre-training platform. The goal: keep training through node failures and make better use of unreliable workers and spot instances, without idling an entire model replica when one stage goes down. 1/n Video  
  http://nitter.jaydenha.uk/tplr_ai/status/2100237708186550642#m
- @novogratz (Mike Novogratz, Wed, 16 Sep 2026): Our economy doesn’t work without immigration. We need at least 1.5-2mm new immigrants a year to create taxpayers and consumers to help us grow our way out of 40th in debt and to pay for an aging population. This isn’t political. It’s just math. We of course can decide what immigrants we take. From where, what educational level, wealth etc. that’s political. But the fact that we need them isn’t. Lisa Boothe (@LisaMarieBoothe) At this point, I am fine with shutting down all immigration, legal or not. It's a mess. — http://shitter.thepixora.com/LisaMarieBoothe/status/2099891080258875467#m  
  http://shitter.thepixora.com/novogratz/status/2100193741633929406#m
- @novogratz (Mike Novogratz, Wed, 16 Sep 2026): Govt feels broken. 18 months of work between our industry, dems and republicans and Clarity falls apart on the 5 yard line. All the issues got to a hard fought compromise other than one. On Ethics both sides dug in and decided their stance was more important than the long run good of a major industry and our countries chance to lead it. Republicans were afraid of putting real limits on a President’s ability to profit from digital assets. Dems decided that this one industry is where they would fight a corruption battle. They were scared to be seen doing anything that could be perceived as being  
  http://shitter.thepixora.com/novogratz/status/2100020845942911165#m
- @foundrydigital (Foundry Digital, Wed, 11 Jan 2012): Expression Engine 2.0 review by the guys at Scriptiny bit.ly/w3Pg3R  
  http://shitter.thepixora.com/foundrydigital/status/157243024848596993#m
- @lium_io (Lium, Wed, 09 Sep 2026): lium.io Month in review: $964k billed to 1187 renters (36% MoM growth). 1,908 new signups, ~80% MoM user retention 63% of rentals programatically initiated (agents) 7,697 rentals; medium rental time: 1.15 hours.  
  http://shitter.thepixora.com/lium_io/status/2097824624117473549#m
- @ridges_ai (Ridges, Wed, 09 Sep 2026): Next competition is live: Database Engineering. Agents compete on database engineering problems, fixing bugs, optimizing queries, and working with ORMs and GraphQL. Why this Niche next? Because inefficient queries are a real engineering challenge, and one where specialist agents have plenty of room to outperform. Open now for submissions:  
  http://shitter.thepixora.com/ridges_ai/status/2097823726561866122#m
- @lium_io (Lium, Wed, 09 Sep 2026): Steadily building the most decentralized GPU cloud Lium now has capacity from 68 datacenters across 21 countries Have GPUs? Join now. Lium pays you even for idle minutes. Make your nodes rentable in 5 minutes -&gt; docs.lium.io/providers/quick…  
  http://shitter.thepixora.com/lium_io/status/2097803045362966828#m
- @jtledore (Jean-Thomas Ledoré, Tue, 22 Sep 2026): .@openroboto just built a decentralized alternative to @Figure_robot’s Index for collecting robot training data, with real-world capture hardware. Open robotics on Bittensor now has its data network to challenge the industry’s biggest labs. Bittensor is coming for physical AI. OpenRoboto (@openroboto) Today we’re launching OpenRoboto Shift, opening a new chapter for OpenRoboto. Shift is a decentralized network for collecting egocentric robotics data: first-person video of real people doing real work. Only Possible on Bittensor. Explore Shift → shift.openroboto.ai/ Video — http://nitter.jaydenh  
  http://nitter.jaydenha.uk/opentensor/status/2102525497687285851#m
- @jtledore (Jean-Thomas Ledoré, Tue, 22 Sep 2026): Our latest research paper explores the growing connection between AI and digital assets and explains why broad AI adoption may drive new demand, utility and applications across the digital asset economy. blackrock.com/us/individual/…  
  http://nitter.jaydenha.uk/BlackRock/status/2102409739175141458#m
- @BarrySilbert (Barry Silbert, Tue, 22 Sep 2026): We're proud to be the pilot partner for @taostats' ads program and support one of the best pieces of free infrastructure in Bittensor. Soon these ad spaces will be available to subnets and other ecosystem participants as a new way to reach users, builders, and investors. For Bittensor and its subnets, growth starts with awareness. Nobody can use something they've never heard of. Taostats is our first ad campaign. It won't be our last, and soon we'll be advertising beyond the existing community to help new talent and capital discover Bittensor. $TAO  
  http://nitter.jaydenha.uk/YumaGroup/status/2102396817975529838#m
- @jaltucher (James Altucher, Tue, 22 Sep 2026): Welcome to Bittensor. Here's why you should stay and diamond-hand $TAO.  
  http://nitter.jaydenha.uk/taodaily_io/status/2102390629422567556#m
- @BarrySilbert (Barry Silbert, Tue, 22 Sep 2026): Grayscale AI Compute ETF (Ticker: $GCPU) is now trading. Why AI Compute? ⟶ AI's growth is constrained by physical compute. Data centers have just six months of capacity¹, and new ones take two to five years to build². ⟶ AI infrastructure capex is projected to exceed $1 trillion annually³. ⟶ $GCPU portfolio includes native data center businesses, plus operators repurposing existing power and land for AI, including Bitcoin miners. $GCPU offers exposure to AI’s physical layer, now accessible through brokerage or investment accounts. Learn more: etfs.grayscale.com/gcpu Video  
  http://nitter.jaydenha.uk/Grayscale/status/2102381328880832751#m
- @BarrySilbert (Barry Silbert, Tue, 22 Sep 2026): $GTAO 👀 Are you paying attention yet? $TAO  
  http://nitter.jaydenha.uk/Altcoin_Hero_/status/2102190155213770803#m
- @polychain (Polychain Capital, Tue, 15 Sep 2026): It's time for a new foundation. Not a new start. Legacy Mode is live on Passport, keep every account you already have, on code anyone can inspect. Switch to open source hardware and software while keeping your existing accounts for supported assets. Here’s how. 🧵 Video  
  http://nitter.jaydenha.uk/FoundationHQ/status/2099865846101180499#m
- @jaltucher (James Altucher, Tue, 15 Sep 2026): Q/C Technologies has appointed Yossef Ehrlichman, Ph.D., as Chief Technology Officer to lead the company’s optical processing unit program and overall technology strategy. Learn more: bit.ly/4xXk2ik $QCLS  
  http://nitter.jaydenha.uk/Q_CTechnologies/status/2099856104670859351#m
- @mcjkula (mcjkula, Tue, 14 Apr 2026): See you in Montréal everyone. Not gonna want to miss this one🫡 Exploit Summit (@ExploitSummit) Building on Bittensor is hard. Doing it in isolation is even harder. Exploit puts you in a room with: • The subnet founders who've already solved your problems • The investors actually writing checks • The technical talent you're trying to hire Sept 28-29, Montréal. Two days that could save you six months. Video — http://nitter.jaydenha.uk/ExploitSummit/status/2044100822750114215#m  
  http://nitter.jaydenha.uk/mcjkula/status/2044123923088830837#m
- @tm0klc (Tim, Tue, 07 Jul 2026): Subnet 44 @webuildscore is expanding. We’re incentivising training for a new vision-language model: Satori. Satori reasons AND grounds. It doesn’t just answer questions about an image. It points to the evidence. - Reason about scenes - Detect and segment objects - Read text - Count entities - Ground claims in pixels Most VLMs are split: strong reasoning OR strong grounding. Detection models localise, but can’t talk. Chatty VLMs describe fluently, but can’t prove it. Satori sits at the intersection. We’re starting with a 7B base model.  
  http://nitter.jaydenha.uk/tm0klc/status/2074298897305047101#m
- @mcjkula (mcjkula, Tue, 01 Sep 2026): TAOApp Wallet is here. The self-custody browser wallet for Bittensor. Hold TAO, stake TAO, buy subnet tokens. When there’s more to protect, bring in your Ledger, proxies and multisigs. Install the beta, on Chrome, Brave and Edge. ↓ chromewebstore.google.com/de…  
  http://nitter.jaydenha.uk/taoapp_/status/2094840222441992209#m
- @_redteam_ (RedTeam / Innerworks, Thu, 27 Aug 2026): The Immune System for the Internet. Releasing next month. Oscar Hayek (@oscar_hayek) Defence in this era must be AI driven, the absolute baseline is adapting defences faster than attacks are being produced. Anything slower than this leaves you in a constant state of degradation. What we’ve built on @_redteam_ is an immune system for this problem. The attacks we ingest are evolved inside the system into complete novel vectors that cannot be produced anywhere else. Every one of these gets patched before an external attacker has the means/ability to create it, let alone release it. bittensor:nati  
  http://shitter.thepixora.com/_redteam_/status/2093081017145847826#m
- @polychain (Polychain Capital, Thu, 25 Jun 2026): Article The Missing AI Layer Is Not Security. It&apos;s Authority. AI agents are now computer users. They browse websites. They read files. They write code. They call APIs. They log in to accounts. They handle credentials, use tools, and take actions across software  
  http://nitter.jaydenha.uk/zherbert/status/2070178183333171395#m
- @SemiAnalysis_ (SemiAnalysis, Thu, 24 Sep 2026): AMD MI355X becomes the first official TileRT result no AgentX! This configuration achieves an astounding 470 TPS on GLM 5.3 (FP8). This is over 40% faster than GB300 TRTLLM using FP4! Great work to the TileRT x AMD team! (1/3)🧵  
  http://shitter.thepixora.com/SemiAnalysis_/status/2103267188278698055#m
- @SemiAnalysis_ (SemiAnalysis, Thu, 24 Sep 2026): This is a disaggregated config: the prefill engine runs vLLM and the decode engine TileRT. TileRT is an ultra-low latency-focused inference engine that runs model decoding in a persistent GPU kernel to deliver faster tokens to each user. (2/3) github.com/tile-ai/tilert  
  http://shitter.thepixora.com/SemiAnalysis_/status/2103267190686232614#m
- @KyleSamani (Kyle Samani, Thu, 24 Sep 2026): The litmus test for if an on-chain equity is a real equity: If *you* can transfer it back and forth to TradFi without incurring a taxable event Armani Ferrante (@armaniferrante) How to onramp stocks from Interactive Brokers into Backpack 👇 — http://nitter.jaydenha.uk/armaniferrante/status/2103075098471350498#m  
  http://nitter.jaydenha.uk/KyleSamani/status/2103246358908223738#m
- @KyleSamani (Kyle Samani, Thu, 24 Sep 2026): Slowly, then quickly MartyParty (@martypartymusic) Liquidity: Everything has changed as Tether sends Binance 500m new dollars on @solana, no longer using Ethereum. — http://nitter.jaydenha.uk/martypartymusic/status/2103221006278259049#m  
  http://nitter.jaydenha.uk/KyleSamani/status/2103239619223683412#m
- @PanteraCapital (Pantera Capital, Thu, 24 Sep 2026): The last closing bell is coming. Video  
  http://shitter.thepixora.com/Ondo/status/2103232283218247755#m
- @ridges_ai (Ridges, Thu, 24 Sep 2026): Aurora v6 is currently top of the leaderboard. It matches blueberry v2's 30% score while completing the challenges at 23.2% lower cost. Will the top spot change hands once again?  
  http://shitter.thepixora.com/ridges_ai/status/2103205701917229438#m
- @ridges_ai (Ridges, Thu, 24 Sep 2026): 2,401 agent submissions from 583 miners in 15 days. Submissions pass through multiple screening and validation stages, with just eight agents approved for emissions so far. The competition is still open. There's more progress to be made.  
  http://shitter.thepixora.com/ridges_ai/status/2103205687820177506#m


---
_Generated at 2026-09-25T23:02:23.253375+00:00 by scripts/intel/aggregate.py. Treat this digest as input context, not as ground truth. Verify before quoting._
