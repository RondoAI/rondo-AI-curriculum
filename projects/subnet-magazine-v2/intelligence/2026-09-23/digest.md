# Intelligence Digest, 2026-09-23

_Single-file briefing for the daily research agent. Sources listed in trust order: human-curated notes first, then objective (github), then editorial (RSS), then volume (X via Nitter)._


## ⊕ HUMAN-CURATED NOTES, last 7 days

_no human notes in the window_

## ⊕ MACRO BACKDROP via SEMIANALYSIS, 12 most recent posts

_SemiAnalysis is the most-cited semiconductor and AI infrastructure publication in the industry. They do NOT cover Bittensor. The Oracle uses this corpus for any claim about hyperscaler compute, GPU economics, datacenter power, foundry capacity, memory pricing, lab unit economics. DO NOT cite SemiAnalysis for any Bittensor-specific claim. Full archive (289 posts, May 2020 onwards) lives at `intelligence/_external_sources/semianalysis/` with an `INDEX.md` table of contents. Paywalled posts show only subtitle + free preview; free posts have the full body extracted._

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

### 2026-09-14 · A Brain Too Big to Carry — On-Device vs Datacenter Inference
_Robot Models, Silicon & DRAM Efficiency, Jetson Thor vs. B300 TCO, Deployments, The Network Wall_

- **Authors:** ["Ivan Chiam", "Gianluca", "Zane Fong", "Bryan Shan", "Dylan Patel", "Reyk Knuhtsen"]
- **Access:** paid-preview
- **URL:** https://newsletter.semianalysis.com/p/a-brain-too-big-to-carry-on-device
- **Corpus file:** `intelligence/_external_sources/semianalysis/2026-09-14-a-brain-too-big-to-carry-on-device.md`

> # Where should the brain of the robot go?  So far, AI has mostly lived behind a screen. Chatbots answered questions. Then agents started driving software and finishing multi-step tasks on their own. The next step is AI that acts in the physical world, and the biggest piece of that is robots. It’s early. Nobody has settled the hardware, the models, or the economics.  ## The Embodiment Problem  With LLMs, the hardware bends to the model. Pour in as much data and compute as possible at training, th

### 2026-09-14 · Vera Rubin NVL72 Agentic Inference: 67x better Performance per Dollar
_Jensen Sandbagging Performance Again, 2x more Annual Profit Per GigaWatt, The More you Buy, The More you Earn, AgentX, InferenceX, Extreme Co-Design_

- **Authors:** ["Bryan Shan", "Alec Ibarra", "Cam Quilici", "Wenyao Gao", "Dylan Patel"]
- **Access:** paid-preview
- **URL:** https://newsletter.semianalysis.com/p/vera-rubin-nvl72-agentic-inference
- **Corpus file:** `intelligence/_external_sources/semianalysis/2026-09-14-vera-rubin-nvl72-agentic-inference.md`

> [Rubin is the first platform co-designed across six products for the agentic era: Rubin GPU, Vera CPU, NVLink 6 Switch, ConnectX-9, BlueField-4, and Spectrum-6.](https://newsletter.semianalysis.com/p/vera-rubin-extreme-co-design-an-evolution) Today we are publishing the first verified agentic inference results for Rubin, measured on our agentic inference benchmark, AgentX. Even on early pre-release software, the results already show why extreme co-design was necessary.  At GTC 2026, Jensen prese

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

### 2026-08-30 · Most Neoclouds Suck At Security
_OpenAI vs HuggingFace, Container Escapes, Kernel Bypass, Network Policies, Security Keys, Multi-tenant Grafana, and a ClusterMAX 3.0 Preview_

- **Authors:** ["Jordan Nanos", "Sam Harshe", "Pratt Bhatt", "Billy Cao", "Jack Carson", "Dylan Patel"]
- **Access:** paid-preview
- **URL:** https://newsletter.semianalysis.com/p/most-neoclouds-suck-at-security
- **Corpus file:** `intelligence/_external_sources/semianalysis/2026-08-30-most-neoclouds-suck-at-security.md`

> [![](https://substackcdn.com/image/fetch/$s_!zWz0!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fc647fca6-8c53-43a7-af27-f4396a31077b_1448x1086.png)](https://substackcdn.com/image/fetch/$s_!zWz0!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fc647fca6-8c53-43a7-af27-f4396a31077b_1448x1086.png)  In Shakespeare’s Julius Caesar, Caesar ignores a soothsayer’


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

- @shibshib89 (Ala Shaabana, Wed, 16 Sep 2026): LFG! Crucible Labs (@CrucibleLabs) Crucible Wallet Extension v2.1.1 is LIVE. This isn’t just an update. We rebuilt the entire wallet experience from the ground up. A completely new UI. More control over your TAO. More Bittensor tools built directly into your wallet. What’s new in v2.1.1: ✔️Completely updated UI + light/dark mode ✔️Claim rewards directly in the wallet ✔️Unified balance across TAO + alpha ✔️Universal Swap ✔️Transfer TAO + alpha ✔️Subnet discovery + detailed subnet views ✔️Multi-address support for seed phrases ✔️12 and 24 word seed phrase support ✔️Updated Smart Account + Reward  
  http://shitter.thepixora.com/shibshib89/status/2100300168633761947#m
- @shibshib89 (Ala Shaabana, Wed, 09 Sep 2026): Did you hear? Crucible Wallet is officially live on iOS today. An easy to use Bittensor wallet with Ledger security, Unified Swap and subnet level performance. Now available on iOS in the US, Android and Chrome. Download at CrucibleLabs.com #Bittensor #TAO #CrucibleWallet  
  http://shitter.thepixora.com/CrucibleLabs/status/2097815766473323006#m
- @shibshib89 (Ala Shaabana, Wed, 09 Sep 2026): We are officially on iOS! Onwards 🚀 Crucible Labs (@CrucibleLabs) A long time coming and officially here. Crucible Wallet is now available on iOS in the US. An easy, intuitive Bittensor wallet for your everyday TAO needs, with Unified Swap, portfolio tracking and Ledger support wherever you go. Already available on Google Play and Chrome Store. Download at CrucibleLabs.com #CrucibleWallet #TAO #Bittensor — http://shitter.thepixora.com/CrucibleLabs/status/2097699938209857625#m  
  http://shitter.thepixora.com/shibshib89/status/2097724813028516224#m
- @shibshib89 (Ala Shaabana, Wed, 02 Sep 2026): Crucible Labs dropping #downwiththedev Episode 1. We breakdown the Mobile Wallet with @buildwithsamp. Take a listen. Video  
  http://shitter.thepixora.com/CrucibleLabs/status/2095144290376937770#m
- @YumaGroup (Yuma Holdings, Tue, 22 Sep 2026): In the past two weeks, Trishool joined the @OpenAI cyber program and launched its Output Guard product for model-output alignment, complementing its existing Input Guard. Since launch, Output Guard has already closed ~50% of the gap to the leading model's performance, powered by continuously improving intelligence produced on Bittensor. $TAO Trishool | SN23 (@trishoolai) Two weeks ago we shipped the first version of our output guard and showed you the starting number. 73.9% F1. We called it the floor, not the ceiling. Here is the floor already moving. The output guard is now at 78.53% F1. That  
  http://shitter.thepixora.com/YumaGroup/status/2102527344166465625#m
- @KyleSamani (Kyle Samani, Tue, 22 Sep 2026): Autonomous agents need rails fast and cheap enough to transact constantly. That's consolidating in one place. @solana now handles 76% of all x402 transactions. 23.2M in four weeks. Solana (@solana) JUST IN: Solana handles 76% of all @x402 transactions. 23.2M in four weeks. The next-largest network did 3.39M. — http://shitter.thepixora.com/solana/status/2102285997304148088#m  
  http://shitter.thepixora.com/FWDind/status/2102422922845696103#m
- @YumaGroup (Yuma Holdings, Tue, 22 Sep 2026): We're proud to be the pilot partner for @taostats' ads program and support one of the best pieces of free infrastructure in Bittensor. Soon these ad spaces will be available to subnets and other ecosystem participants as a new way to reach users, builders, and investors. For Bittensor and its subnets, growth starts with awareness. Nobody can use something they've never heard of. Taostats is our first ad campaign. It won't be our last, and soon we'll be advertising beyond the existing community to help new talent and capital discover Bittensor. $TAO  
  http://shitter.thepixora.com/YumaGroup/status/2102396817975529838#m
- @rob_svrn (Rob Greer, Tue, 22 Sep 2026): the ARR on @engyai is now 3.5m-4m usd, hoping to scale this beyond 8 figures before end of year. Demand for inference will be infinite, accelerate  
  http://shitter.thepixora.com/AlgodTrading/status/2102369904934686742#m
- @jtledore (Jean-Thomas Ledoré, Tue, 22 Sep 2026): Proud of you @MaxSebti your pitch was great. One of the firsts talking about Decentralized Ai in front of this kind of audience. This is necessary to be game changers. @kusanagi_vntrs @opentensor bittensor:native Max (@MaxSebti) onto the next one — http://shitter.thepixora.com/MaxSebti/status/2102320219603492969#m  
  http://shitter.thepixora.com/jtledore/status/2102341730792018380#m
- @jtledore (Jean-Thomas Ledoré, Tue, 22 Sep 2026): preached decentralised AI in front of the largest French PE and VC funds (hundreds of billions under management in the room). main takeaways from the COO of a multi-billion-dollar manufacturing company: - efficiency is the ultimate goal. - all big-data LLM pilots have been cancelled across all verticals: no clear use cases, no productivity spikes. - vision is the only vertical where he and his industry counterparts know value can be created, so they want to double down on it.  
  http://shitter.thepixora.com/MaxSebti/status/2102328200751649276#m
- @mcjkula (mcjkula, Tue, 14 Apr 2026): See you in Montréal everyone. Not gonna want to miss this one🫡 Exploit Summit (@ExploitSummit) Building on Bittensor is hard. Doing it in isolation is even harder. Exploit puts you in a room with: • The subnet founders who've already solved your problems • The investors actually writing checks • The technical talent you're trying to hire Sept 28-29, Montréal. Two days that could save you six months. Video — http://shitter.thepixora.com/ExploitSummit/status/2044100822750114215#m  
  http://shitter.thepixora.com/mcjkula/status/2044123923088830837#m
- @mcjkula (mcjkula, Tue, 01 Sep 2026): TAOApp Wallet is here. The self-custody browser wallet for Bittensor. Hold TAO, stake TAO, buy subnet tokens. When there’s more to protect, bring in your Ledger, proxies and multisigs. Install the beta, on Chrome, Brave and Edge. ↓ chromewebstore.google.com/de…  
  http://shitter.thepixora.com/taoapp_/status/2094840222441992209#m
- @Olaf (Olaf Carlson-Wee, Thu, 19 Aug 2010): lekker biertje drinken bij Dims!  
  http://shitter.thepixora.com/olaf/status/21602951308#m
- @jtledore (Jean-Thomas Ledoré, Thu, 17 Sep 2026): Manako charges recurring fees that grow as customers deploy Score’s technology across more cameras and sites. In European fuel retail, Manako charges €15 per camera per month plus €150 per site for the VLM layer. A site with 10 cameras therefore costs around €300 a month, and revenue scales as the customer expands to more locations. Score Studio creates another revenue stream for the subnet. Score plans to use its profits for SN44 buybacks and burns.  
  http://shitter.thepixora.com/opentensor/status/2100497406047719483#m
- @rob_svrn (Rob Greer, Sun, 20 Sep 2026): ⚡️The strongest people are not the ones with the strongest beliefs. They are the ones who can hold a belief with enormous force and still kill it the moment reality kills it. So to me, conviction is one of the highest forms of leverage because it lets you stay in the game long enough for an asymmetric truth to compound. But only when paired with surrender to reality. The deepest line is: Conviction is the strength to remain unmoved by noise without becoming immovable to truth.  
  http://shitter.thepixora.com/_The_Prophet__/status/2101753669414989910#m
- @Olaf (Olaf Carlson-Wee, Sun, 10 Jul 2011): RT @timmerarjan Life is good! yfrog.com/kkli4iaj zeker !! Wel tof dat je het deelt met je vrienden :)  
  http://shitter.thepixora.com/olaf/status/90083936700600321#m
- @mcjkula (mcjkula, Sat, 19 Sep 2026): Bittensor took me a while to understand. I want to make that first step easier for the next person. We’ll be kicking things off with Bittensor 101 at Exploit. Looking forward to meeting some of you for the first time and catching up with familiar faces. 👋 Exploit Summit (@ExploitSummit) Maciej Kula ( @mcjkula ) couldn't find a clear way to learn #Bittensor from scratch, so he built the resource he wished existed. @learnbittensor is now part of @latentholdings, where Maciej leads education and makes Bittensor easier to understand. He'll be leading our Bittensor 101 session to kick off Day 1: lu  
  http://shitter.thepixora.com/mcjkula/status/2101424763344437495#m
- @rob_svrn (Rob Greer, Sat, 19 Sep 2026): "I think a Bittensor $TAO can go up 500x" @BarrySilbert redirect.invidious.io/kVos-jFyEpw?si=fNfG… Link &quot;I think a Bittensor $TAO can go up 500x&quot; &quot;I think a Bittensor $TAO can go up 500x. And so our portfolio is a... youtube.com  
  http://shitter.thepixora.com/SubnetSummerT/status/2101287520453435644#m
- @shibshib89 (Ala Shaabana, Mon, 31 Aug 2026): Get ready, a new TAO-inspired podcast with @CrucibleLabs own @buildwithsamp and Kelly. Coming soon! Video  
  http://shitter.thepixora.com/CrucibleLabs/status/2094445795848446011#m
- @rob_svrn (Rob Greer, Mon, 21 Sep 2026): Bittensor Bungalow $TAO shitter.thepixora.com/i/spaces/1RJjpbrVrlBKw Link Twitter Space Click to view Space http://shitter.thepixora.com/i/spaces/1RJjpbrVrlBKw  
  http://shitter.thepixora.com/markjeffrey/status/2102185950566826375#m
- @jtledore (Jean-Thomas Ledoré, Mon, 21 Sep 2026): A Harvard research team and @chutes_ai just released a public dataset covering one year of real-world LLM inference on Chutes: 6.12B requests across 9,174 models. Technical usage data from a Bittensor subnet is now open to the wider AI research community. Juncheng Yang (@1a1a11a) Announcing one year of LLM inference metadata traces, with 6.12 billion requests. We hope this dataset can support research on real-world LLM serving workload understanding, system design and infrastructure optimization. Explore the dataset and learn more: data.agentic-system.org Driven by our great graduate student W  
  http://shitter.thepixora.com/opentensor/status/2102149456401408309#m
- @rob_svrn (Rob Greer, Mon, 21 Sep 2026): A simple intro to Bittensor $TAO for the new people: pill.taobubbles.net Link Intro To Bittensor explained for normal people A plain English guide to the Bittensor network TAO token and its decentralized AI subnets. pill.taobubbles.net  
  http://shitter.thepixora.com/markjeffrey/status/2102149366308057553#m
- @YumaGroup (Yuma Holdings, Mon, 21 Sep 2026): Beam already has the network, the fast transfers, the Rooms and the Streams. Rooms can already support far more than simple file movement. On-demand distributed training is the next piece of the bigger picture. More at Exploit Summit.  
  http://shitter.thepixora.com/b1m_ai/status/2102140450026950749#m
- @KyleSamani (Kyle Samani, Mon, 21 Sep 2026): +357,000 solana:So11111111111111111111111111111111111111112 Between August 4th and September 21, @FWDind 's treasury has grown by approx. 357K SOL to a total of 8.16M SOL at an average cost of $78.26 per SOL.  
  http://shitter.thepixora.com/FWDind/status/2102126181336350866#m
- @jtledore (Jean-Thomas Ledoré, Mon, 21 Sep 2026): We are very happy to have been a part of this achievement. Thank you again to all those who participated and made it possible. Juncheng Yang (@1a1a11a) Announcing one year of LLM inference metadata traces, with 6.12 billion requests. We hope this dataset can support research on real-world LLM serving workload understanding, system design and infrastructure optimization. Explore the dataset and learn more: data.agentic-system.org Driven by our great graduate student William Nixon and in collab with @jon_durbin @airesearch12 @chutes_ai Link Open Data · A dataset hub for LLM serving research A da  
  http://shitter.thepixora.com/chutes_ai/status/2102122804548182404#m
- @KyleSamani (Kyle Samani, Mon, 21 Sep 2026): We are live! Improved opsec. Contracts re-audited from scratch. I know this has been a long time coming for those of you impacted by the exploit. Every day the exchange was offline was revenue that could have been directed to the recovery fund. I personally appreciate your patience. In the wake of the incident, the last thing I wanted to do was rush security for the sake of earlier revenue, so we took our time and did things properly. This is the biggest step towards recovery. More announcements coming on the DFX launch and recovery pool. For now, the protocol is collecting fees which will be   
  http://shitter.thepixora.com/redacted_noah/status/2102080518103965880#m
- @KyleSamani (Kyle Samani, Mon, 21 Sep 2026): Faster Anza (@anza_xyz) 🚨 Mainnet-beta validators: Agave v4.3 is the recommended version for all validators, upgrade now. — http://shitter.thepixora.com/anza_xyz/status/2102059660664512968#m  
  http://shitter.thepixora.com/KyleSamani/status/2102068157594673222#m
- @KyleSamani (Kyle Samani, Mon, 21 Sep 2026): Hey everyone, I'll be in Singapore for the full week of Token. Would love to see a lot of y'all, so hit me up if you'd like to connect.  
  http://shitter.thepixora.com/KyleSamani/status/2102067170981056635#m
- @mcjkula (mcjkula, Mon, 21 Sep 2026): New to #Bittensor? Start here. In exactly one week, Exploit opens with Bittensor 101, led by @TAOTemplar + @mcjkula of @learnbittensor - a high-level map of how the network works, where subnets fit + how to navigate the ecosystem. Get the foundations in place before two days of big conversations. 📅 Monday 28 September · 9–9:45am Register here → luma.com/nqy2n5zi (free to Exploit guests)  
  http://shitter.thepixora.com/ExploitSummit/status/2102029192284283120#m
- @mcjkula (mcjkula, Mon, 13 Apr 2026): For anyone that wants to get an idea of what the discussion will be about on this week with Const, this one is worth to read and form opinions/prepare questions about 🫡 Learn Bittensor (@learnbittensor) 🔒Locked Stake & Conviction are Being Proposed for Bittensor Subnet ownership may be about to change. BIT-0011 proposes that anyone can challenge for ownership of a subnet by locking their ALPHA stake and building "conviction." Right now, inactive subnet owners can hold onto subnets indefinitely. 'Locked Stake' would make ownership a contest of commitment, giving motivated participants a path to  
  http://shitter.thepixora.com/mcjkula/status/2043630114567491654#m
- @YumaGroup (Yuma Holdings, Fri, 18 Sep 2026): Bittensor is on the move. bittensor:native is back above $250, up 36% from its 60-day low of $184. Momentum building in crypto markets after a volatile summer.  
  http://shitter.thepixora.com/YumaGroup/status/2100947985169342622#m
- @YumaGroup (Yuma Holdings, Fri, 18 Sep 2026): For informational purposes only. Not an offer or solicitation. Not investment advice. Do your own research. Past performance ≠ future results.  
  http://shitter.thepixora.com/YumaGroup/status/2100947987048415686#m


---
_Generated at 2026-09-23T09:01:17.128122+00:00 by scripts/intel/aggregate.py. Treat this digest as input context, not as ground truth. Verify before quoting._
