# Intelligence Digest, 2026-09-25

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

- @galaxyhq (Galaxy Digital, Wed, 23 Sep 2026): Thanks for making the trip to Lubbock, Mike — and for spending time with our Red Raider football team ahead of the game. Great to have you at @TexasTech, and even better to cap off the visit with a big win at the new @galaxyhq Stadium. This partnership is just getting started. #WreckEm! Mike Novogratz (@novogratz) Last Friday, I visited our flagship campus Helios in West Texas. Three years ago, this was still a bitcoin mining facility. Today Helios is a fully operational AI-ready campus with 133MW of critical IT capacity, and we’re just getting started! @galaxyhq is taking a big swing out here  
  http://nitter.jaydenha.uk/CreightonForTX/status/2102869773776269419#m
- @manakoai (Manako, Wed, 23 Sep 2026): USA ⏭️ Max (@MaxSebti) just flashed the first few @manakoai boxes that will be deployed in the US — http://nitter.jaydenha.uk/MaxSebti/status/2102842552827412624#m  
  http://nitter.jaydenha.uk/manakoai/status/2102843727048024497#m
- @KyleSamani (Kyle Samani, Wed, 23 Sep 2026): The most important thing to note about this capital markets activity is that it comes with 0 overhang or debt obligation Clean, straight forward transaction to scale the treasury Forward Ind. | NASDAQ-$FWDI (@FWDind) Forward Industries ( $FWDI ) is closing a $25M registered direct offering with an institutional investor to acquire SOL. We continue to scale our treasury while increasing SOL-per-share accretion for shareholders. Read more in the full press release below. — http://nitter.jaydenha.uk/FWDind/status/2102744116656558304#m  
  http://nitter.jaydenha.uk/KyleSamani/status/2102813785597640800#m
- @KyleSamani (Kyle Samani, Wed, 23 Sep 2026): Top 10 all time life product Matteo Franceschetti (@m_franceschetti) BREAKING: Pod 6 is live. The sixth generation of our intelligent sleep system, redesigned for every kind of bed. ✅ The new Hub is small enough to fit under your bed frame ✅ More powerful than ever ✅ With 9x more sensors for enhanced accuracy ✅ In new Solo sizes, at our lowest starting price yet This is our most significant hardware launch to date, and our most accessible. Available now at eightsleep.com Video — http://nitter.jaydenha.uk/m_franceschetti/status/2102761196805816776#m  
  http://nitter.jaydenha.uk/KyleSamani/status/2102812665122857282#m
- @galaxyhq (Galaxy Digital, Wed, 23 Sep 2026): Last Friday, I visited our flagship campus Helios in West Texas. Three years ago, this was still a bitcoin mining facility. Today Helios is a fully operational AI-ready campus with 133MW of critical IT capacity, and we’re just getting started! @galaxyhq is taking a big swing out here, and so is America. The move to build an AI future for this country is real, and none of it happens without the physical infrastructure. It starts with power, land, and hard-working people willing to put in the work to build a new future. Our partnership with @TechAthletics with Galaxy Stadium is part of investing  
  http://nitter.jaydenha.uk/novogratz/status/2102773522292428868#m
- @KyleSamani (Kyle Samani, Wed, 23 Sep 2026): BREAKING: Pod 6 is live. The sixth generation of our intelligent sleep system, redesigned for every kind of bed. ✅ The new Hub is small enough to fit under your bed frame ✅ More powerful than ever ✅ With 9x more sensors for enhanced accuracy ✅ In new Solo sizes, at our lowest starting price yet This is our most significant hardware launch to date, and our most accessible. Available now at eightsleep.com Video  
  http://nitter.jaydenha.uk/m_franceschetti/status/2102761196805816776#m
- @galaxyhq (Galaxy Digital, Wed, 23 Sep 2026):   
  http://nitter.jaydenha.uk/galaxyhq/status/2102759121372012837#m
- @galaxyhq (Galaxy Digital, Wed, 23 Sep 2026): Read more here: theblock.co/news/business/20… Link Galaxy adds $100 million in Sky&apos;s sUSDS to treasury, buys SKY token Galaxy has added $100 million of sUSDS to its corporate treasury, approved sUSDS as collateral across its institutional trading business, and acquired an undisclosed amount of SKY. theblock.co  
  http://nitter.jaydenha.uk/galaxyhq/status/2102757266059325881#m
- @manakoai (Manako, Wed, 23 Sep 2026): This weekend the team brought 15 stations online across Lyon, France. Three days of work. Around five minutes end to end for each site. Deploying computer vision to a physical location usually means weeks of integration. New cameras, a site visit, cabling, sign-off. Every one of these 15 stations went live on the cameras it already had. No new hardware, no rewiring, no site visits. We point Manako at the existing feed and it starts watching and alerting. The reason we did 15 at once was to see how deployment holds up across different setups. No two stations are the same, camera angles, how the  
  http://nitter.jaydenha.uk/manakoai/status/2102696954937426000#m
- @jaltucher (James Altucher, Wed, 16 Sep 2026): Working on an AI-powered end to end platform for designing optical and then quantum chips at $QCLS. More details and refinements later but you can check it out at VibeGDS.io - you just enter plain English for the chip you want and it will build it out, simulate, verify, etc. Of interest mostly to optical engineers.  
  http://nitter.jaydenha.uk/jaltucher/status/2100262449685364904#m
- @foundrydigital (Foundry Digital, Wed, 11 Jan 2012): Expression Engine 2.0 review by the guys at Scriptiny bit.ly/w3Pg3R  
  http://shitter.thepixora.com/foundrydigital/status/157243024848596993#m
- @jtledore (Jean-Thomas Ledoré, Tue, 22 Sep 2026): .@openroboto just built a decentralized alternative to @Figure_robot’s Index for collecting robot training data, with real-world capture hardware. Open robotics on Bittensor now has its data network to challenge the industry’s biggest labs. Bittensor is coming for physical AI. OpenRoboto (@openroboto) Today we’re launching OpenRoboto Shift, opening a new chapter for OpenRoboto. Shift is a decentralized network for collecting egocentric robotics data: first-person video of real people doing real work. Only Possible on Bittensor. Explore Shift → shift.openroboto.ai/ Video — http://nitter.jaydenh  
  http://nitter.jaydenha.uk/opentensor/status/2102525497687285851#m
- @jtledore (Jean-Thomas Ledoré, Tue, 22 Sep 2026): Our latest research paper explores the growing connection between AI and digital assets and explains why broad AI adoption may drive new demand, utility and applications across the digital asset economy. blackrock.com/us/individual/…  
  http://nitter.jaydenha.uk/BlackRock/status/2102409739175141458#m
- @jaltucher (James Altucher, Tue, 22 Sep 2026): Welcome to Bittensor. Here's why you should stay and diamond-hand $TAO.  
  http://nitter.jaydenha.uk/taodaily_io/status/2102390629422567556#m
- @jaltucher (James Altucher, Tue, 15 Sep 2026): Q/C Technologies has appointed Yossef Ehrlichman, Ph.D., as Chief Technology Officer to lead the company’s optical processing unit program and overall technology strategy. Learn more: bit.ly/4xXk2ik $QCLS  
  http://nitter.jaydenha.uk/Q_CTechnologies/status/2099856104670859351#m
- @mcjkula (mcjkula, Tue, 14 Apr 2026): See you in Montréal everyone. Not gonna want to miss this one🫡 Exploit Summit (@ExploitSummit) Building on Bittensor is hard. Doing it in isolation is even harder. Exploit puts you in a room with: • The subnet founders who've already solved your problems • The investors actually writing checks • The technical talent you're trying to hire Sept 28-29, Montréal. Two days that could save you six months. Video — http://nitter.jaydenha.uk/ExploitSummit/status/2044100822750114215#m  
  http://nitter.jaydenha.uk/mcjkula/status/2044123923088830837#m
- @mcjkula (mcjkula, Tue, 01 Sep 2026): TAOApp Wallet is here. The self-custody browser wallet for Bittensor. Hold TAO, stake TAO, buy subnet tokens. When there’s more to protect, bring in your Ledger, proxies and multisigs. Install the beta, on Chrome, Brave and Edge. ↓ chromewebstore.google.com/de…  
  http://nitter.jaydenha.uk/taoapp_/status/2094840222441992209#m
- @KyleSamani (Kyle Samani, Thu, 24 Sep 2026): The litmus test for if an on-chain equity is a real equity: If *you* can transfer it back and forth to TradFi without incurring a taxable event Armani Ferrante (@armaniferrante) How to onramp stocks from Interactive Brokers into Backpack 👇 — http://nitter.jaydenha.uk/armaniferrante/status/2103075098471350498#m  
  http://nitter.jaydenha.uk/KyleSamani/status/2103246358908223738#m
- @KyleSamani (Kyle Samani, Thu, 24 Sep 2026): Slowly, then quickly MartyParty (@martypartymusic) Liquidity: Everything has changed as Tether sends Binance 500m new dollars on @solana, no longer using Ethereum. — http://nitter.jaydenha.uk/martypartymusic/status/2103221006278259049#m  
  http://nitter.jaydenha.uk/KyleSamani/status/2103239619223683412#m
- @wallstreetbets (WallStreetBets (X), Thu, 24 Sep 2026): AI supercycleeeee 0G Labs (@0G_labs) Introducing Compute Finance (ComFi). A financial layer for AI where digital assets don't just sit idle. They can pay for AI compute you actually use, in 0G Private Computer (100+ models) and the 0G App. Ascend is live. Infinite AI is scheduled for Sept 29. Video — http://shitter.thepixora.com/0G_labs/status/2103109837999735262#m  
  http://shitter.thepixora.com/wallstreetbets/status/2103192883817783453#m
- @manakoai (Manako, Thu, 24 Sep 2026): next batch of stations to be deployed with @manakoai is going to allow us to leverage a lot more @webuildscore models. - 4 motorway stations. beasts with 40+ cameras each. - that’s 10x more cameras than on unmanned stations. - massive fuel forecourts, EV charging bays, car wash, restaurants, supermarkets, coffee areas. the second best news… is it’s with a new signed client 👀  
  http://nitter.jaydenha.uk/arnod3f/status/2103174097522098609#m
- @wallstreetbets (WallStreetBets (X), Thu, 24 Sep 2026): DoubleHyperliquid. DoubleZero (@doublezero) DoubleZero Edge now carries data from @HyperliquidX. Streams are entirely uncapped, every market, every order, the full L4 book including HIP-3. Introducing the first-class path to Hyperliquid’s order book, and the fastest commercially available feed on the market. Video — http://shitter.thepixora.com/doublezero/status/2103122298253492244#m  
  http://shitter.thepixora.com/wallstreetbets/status/2103156310082556397#m
- @manakoai (Manako, Thu, 24 Sep 2026): Same week, different rooms, same vision Paris ✅ London ✅ Next?  
  http://nitter.jaydenha.uk/manakoai/status/2103148213645558030#m
- @wallstreetbets (WallStreetBets (X), Thu, 24 Sep 2026): institutions adding tokenized gold into their strategy the supercycle has already begun Henry McPhie ( 🪨 , ⛏️ ) (@henrymcphie_) An institutional manager has now built GLDY into a delta-neutral gold strategy, starting with a $1M allocation and room to scale as the strategy demonstrates performance. We are unlocking new ways to deploy strategies across markets by giving institutions a yield-bearing gold asset that can plug directly into their existing frameworks. Converting institutional allocations into GLDY was at the top of the 90-day commitments we made in August. Everyone at Streamex has be  
  http://shitter.thepixora.com/wallstreetbets/status/2103134760042455346#m
- @galaxyhq (Galaxy Digital, Thu, 24 Sep 2026): Galaxy bought $100M of sUSDS and approved it as collateral across our institutional lending book. It's the latest step in a deepening relationship with @SkyEcosystem — from Grove's $500M warehouse facility to Spark-backed financing for GOFR.  
  http://nitter.jaydenha.uk/galaxyhq/status/2103130450738716905#m
- @jtledore (Jean-Thomas Ledoré, Thu, 17 Sep 2026): Manako charges recurring fees that grow as customers deploy Score’s technology across more cameras and sites. In European fuel retail, Manako charges €15 per camera per month plus €150 per site for the VLM layer. A site with 10 cameras therefore costs around €300 a month, and revenue scales as the customer expands to more locations. Score Studio creates another revenue stream for the subnet. Score plans to use its profits for SN44 buybacks and burns.  
  http://nitter.jaydenha.uk/opentensor/status/2100497406047719483#m
- @mcjkula (mcjkula, Sat, 19 Sep 2026): Bittensor took me a while to understand. I want to make that first step easier for the next person. We’ll be kicking things off with Bittensor 101 at Exploit. Looking forward to meeting some of you for the first time and catching up with familiar faces. 👋 Exploit Summit (@ExploitSummit) Maciej Kula ( @mcjkula ) couldn't find a clear way to learn #Bittensor from scratch, so he built the resource he wished existed. @learnbittensor is now part of @latentholdings, where Maciej leads education and makes Bittensor easier to understand. He'll be leading our Bittensor 101 session to kick off Day 1: lu  
  http://nitter.jaydenha.uk/mcjkula/status/2101424763344437495#m
- @jon_durbin (Jon Durbin, Sat, 12 Sep 2026): Now we accelerate. Dario Amodei (@DarioAmodei) We Must Pace the Frontier: I’ve written a new essay on why the AI industry should slow down, with a three-part plan for doing so. Anthropic is unilaterally committing to the first of these steps. We’ll provide third-party evaluators with permanent, employee-level access to our systems, so that they can verify adherence to our safety measures, report on incidents, and assess models’ alignment during training. You can read the full post here: darioamodei.com/post/we-must… Link Dario Amodei — We Must Pace the Frontier darioamodei.com — http://shitter  
  http://shitter.thepixora.com/jon_durbin/status/2098847739417129280#m
- @jon_durbin (Jon Durbin, Sat, 12 Sep 2026): mortal enemies find agreement in one thing: that the ladder should be pulled up behind them. Pepsi "vs" Coke Sam Altman (@sama) I agree with Dario that we need to pace the frontier. This has been a primary topic of discussions we've had at OpenAI in recent weeks. Committing to having independent evaluators with employee-like access is a great idea, and we will do the same. We'll have more to share soon. — http://shitter.thepixora.com/sama/status/2098811563415150910#m  
  http://shitter.thepixora.com/const_reborn/status/2098818933318963365#m
- @jon_durbin (Jon Durbin, Sat, 12 Sep 2026): 4 nodes down already in 2 days - Friends don't let friends build infra on RTX 5090s (unless you're stress testing). Jon Durbin (@jon_durbin) And if you're wondering why I used 5090s for this, it's because they are the worst GPUs on earth for stability at this utilization and have like 50% failure rate in my experience thus far (at least 1 of 8 dropping off bus or producing NaNs randomly etc.). Stress test. — http://shitter.thepixora.com/jon_durbin/status/2098102402255655260#m  
  http://shitter.thepixora.com/jon_durbin/status/2098733447481110860#m
- @jtledore (Jean-Thomas Ledoré, Mon, 21 Sep 2026): We are very happy to have been a part of this achievement. Thank you again to all those who participated and made it possible. Juncheng Yang (@1a1a11a) Announcing one year of LLM inference metadata traces, with 6.12 billion requests. We hope this dataset can support research on real-world LLM serving workload understanding, system design and infrastructure optimization. Explore the dataset and learn more: data.agentic-system.org Driven by our great graduate student William Nixon and in collab with @jon_durbin @airesearch12 @chutes_ai Link Open Data · A dataset hub for LLM serving research A da  
  http://nitter.jaydenha.uk/chutes_ai/status/2102122804548182404#m
- @manakoai (Manako, Mon, 21 Sep 2026): And this, ladies and gentlemen, is our Head of Forward Deployed Engineering Arno (@arnod3f) just got back home after deploying @manakoai on 15 stations alongside @MaxSebti these last 3 days. I’m now convinced of three things: 1. our team is outstanding. elite people in all departments, constantly delivering, week in, week out. 2. our founders, the three of them, are delusional ambitious hard core operators. some of the toughest mfers, and, at the same time, most beautiful human beings you’ll meet. 3. our window of opportunity is exceptional. we have a shot at bringing to market a technology ca  
  http://nitter.jaydenha.uk/manakoai/status/2102106546532462654#m
- @mcjkula (mcjkula, Mon, 21 Sep 2026): New to #Bittensor? Start here. In exactly one week, Exploit opens with Bittensor 101, led by @TAOTemplar + @mcjkula of @learnbittensor - a high-level map of how the network works, where subnets fit + how to navigate the ecosystem. Get the foundations in place before two days of big conversations. 📅 Monday 28 September · 9–9:45am Register here → luma.com/nqy2n5zi (free to Exploit guests)  
  http://nitter.jaydenha.uk/ExploitSummit/status/2102029192284283120#m
- @jon_durbin (Jon Durbin, Mon, 14 Sep 2026): "in 6–12 months such a swarm could be capable of taking over the entire internet with a persistent botnet" Maybe, maybe not. If it does, the internet (really: software and operating systems) obviously need some improvement and we should do so. If the bugs are there, they will be found, one way or another regardless of some LLM. What a great opportunity for a renaissance. Anyone else remember the doomerism around Y2K? Int overflows because of epoch seconds? This is that.  
  http://shitter.thepixora.com/jon_durbin/status/2099604160509325695#m
- @jaltucher (James Altucher, Mon, 14 Sep 2026): All of this is so surreal and most of the global population isn’t even fully aware of it. James Altucher (@jaltucher) Inspired by @ashe’s Exploding Human Body, I set up a site to ExplodeAnything.com. Put in any object (“an Iphone”, “a data center”, “an Ozempic pill”, “the soul”. etc), and it will “explode it” and teach you what each component does AND, tell you which public companies make each component, with links to their Yahoo Finance page. Video — http://nitter.jaydenha.uk/jaltucher/status/2099550542515110239#m  
  http://nitter.jaydenha.uk/ReneSellmann/status/2099588988017299496#m
- @jon_durbin (Jon Durbin, Mon, 14 Sep 2026): The push for regulatory capture and AI cabalism is accelerating. This, in large part, is why I'm building parallax. True P2P unstoppable, uncensorable AI systems aren't just neat, they're mandatory. This little single DGX spark "datacenter" in my forge with parallax can train (with other nodes) an 80b parameter model. - two solar blankets - ecoflow battery - lapdock for kvm - starlink internet - dgx spark Total input from solar ~600w (800w max) Total power draw from spark/starlink/etc. &lt; 200w No datacenters, no water supplies, no external power grid, no multi gigabit link. We must design AI  
  http://shitter.thepixora.com/jon_durbin/status/2099565522543104495#m
- @jaltucher (James Altucher, Mon, 14 Sep 2026): Inspired by @ashe’s Exploding Human Body, I set up a site to ExplodeAnything.com. Put in any object (“an Iphone”, “a data center”, “an Ozempic pill”, “the soul”. etc), and it will “explode it” and teach you what each component does AND, tell you which public companies make each component, with links to their Yahoo Finance page. Video  
  http://nitter.jaydenha.uk/jaltucher/status/2099550542515110239#m
- @mcjkula (mcjkula, Mon, 13 Apr 2026): For anyone that wants to get an idea of what the discussion will be about on this week with Const, this one is worth to read and form opinions/prepare questions about 🫡 Learn Bittensor (@learnbittensor) 🔒Locked Stake & Conviction are Being Proposed for Bittensor Subnet ownership may be about to change. BIT-0011 proposes that anyone can challenge for ownership of a subnet by locking their ALPHA stake and building "conviction." Right now, inactive subnet owners can hold onto subnets indefinitely. 'Locked Stake' would make ownership a contest of commitment, giving motivated participants a path to  
  http://nitter.jaydenha.uk/mcjkula/status/2043630114567491654#m
- @foundrydigital (Foundry Digital, Mon, 02 Jan 2012): Early predictions for design trends of 2012? tiny.cc/mkg4v  
  http://shitter.thepixora.com/foundrydigital/status/153974018557493248#m
- @jtledore (Jean-Thomas Ledoré, Fri, 28 Jun 2024): You're building an AI company. We're building a 1000 year Intelligence Federation. We are not the same.  
  http://nitter.jaydenha.uk/const_reborn/status/1806721647241802062#m
- @wallstreetbets (WallStreetBets (X), Fri, 25 Sep 2026): options layer on hyperliquid with a potential DAT on the horizon gonna be an interesting stream Hypercall (by $SYN) (@SynapseProtocol) Hypercall Spaces: SP500 Options, Builder Codes and what it means to build options on Hyperliquid shitter.thepixora.com/i/broadcasts/1XxygwYoj… Link Hypercall (by $SYN) Hypercall Spaces: SP500 Options, Builder Codes and what it means to build options on Hyperliquid http://shitter.thepixora.com/i/broadcasts/1XxygwYojaYGM — http://shitter.thepixora.com/SynapseProtocol/status/2103300132951437681#m  
  http://shitter.thepixora.com/wallstreetbets/status/2103302628117545062#m
- @wallstreetbets (WallStreetBets (X), Fri, 25 Sep 2026): Hypercall will be hosting an X Spaces in 30 minutes to talk: - @sonic_strategy and what DATs mean for options flows - The SP500 trade: what delta hedging on @tradexyz means for $HYPE - Builder codes projects including @Scenarios_fi - Combo books - New assets: crypto &amp; rwas  
  http://shitter.thepixora.com/SynapseProtocol/status/2103281470240690656#m


---
_Generated at 2026-09-25T02:55:19.557007+00:00 by scripts/intel/aggregate.py. Treat this digest as input context, not as ground truth. Verify before quoting._
