# Intelligence Digest, 2026-09-24

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

_no commits or releases in the lookback window_

## ⊕ ECOSYSTEM BLOGS via RSS

_no new posts in the lookback window_

## ⊕ X via NITTER, voices we track

- @TargonCompute (Targon, Wed, 26 Aug 2026): Proud to power @TheoriqAI with secure confidential compute for their agentic market research. Large GPU blocks on demand, with hardware-level guarantees that keep the workload and its data private even from the machines running it. Excited to keep powering experimental research infrastructure with Targon. Theoriq (@TheoriqAI) .@TargonCompute is powering Theoriq AI experimentation. Curating risk-managed yield is, underneath, a research problem: how markets behave, where they break, and how much of that can be seen coming. That runs on heavy, on-demand compute. Targon is our partner in supplying  
  http://shitter.thepixora.com/TargonCompute/status/2092690588143657190#m
- @ridges_ai (Ridges, Wed, 26 Aug 2026): We've kicked off Niches with a Linting competition! In just one week we've seen performance hit 76% on our hidden test set with cost reduction down to $0.02 per task. Results like these help us validate the Niches model and adjust where needed. We're excited for the next Niche, and eventually dynamic Niches. Stay tuned!  
  http://nitter.jaydenha.uk/ridges_ai/status/2092684102595961119#m
- @TargonCompute (Targon, Wed, 26 Aug 2026): .@TargonCompute is powering Theoriq AI experimentation. Curating risk-managed yield is, underneath, a research problem: how markets behave, where they break, and how much of that can be seen coming. That runs on heavy, on-demand compute. Targon is our partner in supplying it. Theoriq (@TheoriqAI) Article Theoriq partnering with Targon to power AI experimentation Curating risk-managed yield is, underneath, a research problem. Long before capital is deployed, we want to know how markets behave, where they tend to break, and how much of that can be seen coming — http://shitter.thepixora.com/Theor  
  http://shitter.thepixora.com/TheoriqAI/status/2092661304444277050#m
- @taomedia_ (TAO Media, Wed, 23 Sep 2026): ✏️ Story by @bart_hillerich Read about @oroagents on our website: tao.media/oro-launches-oro-b… Link ORO Launches ORO Bench With Daily Synthetic Shopping Environments on SN15 Bittensor Subnet 15 replaces static ShoppingBench evaluation with versioned EnvPacks, seven task families, and family-specific verifiers for agentic commerce. tao.media  
  http://nitter.jaydenha.uk/taomedia_/status/2102878389657014523#m
- @taomedia_ (TAO Media, Wed, 23 Sep 2026): Article ORO Launches ORO Bench With Daily Synthetic Shopping Environments on SN15 🛒 The move replaces static ShoppingBench evaluation with versioned EnvPacks, seven task families, and family-specific verifiers for agentic commerce. ORO has launched ORO Bench, a new  
  http://nitter.jaydenha.uk/taomedia_/status/2102878233498722574#m
- @a16zcrypto (a16z Crypto, Wed, 23 Sep 2026): Article The rise of the $100-billion RWA perp market Trading in perpetual futures tied to stocks, gold, and other traditional assets is growing fast. And an increasing share of that activity is now happening onchain. These contracts, often referred to  
  http://shitter.thepixora.com/a16zcrypto/status/2102875903500197915#m
- @BarrySilbert (Barry Silbert, Wed, 23 Sep 2026): Fortitude has amended its existing credit facility with @DCGco, increasing commitment by $24 million. Approximately $31 million of remaining availability is expected to be funded by DCG in $ZEC, which Fortitude expects to sell to fund Zcash mining machine purchases, mining facility acquisitions, greenfield construction and infrastructure expansion, as Fortitude advances toward its proposed business combination with HeartSciences Inc. (Nasdaq: $HSCS). Read the announcement: businesswire.com/news/home/2…. $ZEC $HSCS Link Fortitude Announces Amendment to Existing DCG Credit Facility, Increasing C  
  http://shitter.thepixora.com/FortitudeCrypto/status/2102874420780175866#m
- @manakoai (Manako, Wed, 23 Sep 2026): USA ⏭️ Max (@MaxSebti) just flashed the first few @manakoai boxes that will be deployed in the US — http://nitter.jaydenha.uk/MaxSebti/status/2102842552827412624#m  
  http://nitter.jaydenha.uk/manakoai/status/2102843727048024497#m
- @dylan522p (Dylan Patel, Wed, 23 Sep 2026): ALERT ALERT ALERT 🚨 🚨 🚨 VLLM MAINTAINERS HAVE JUST SHOWN THAT TPUv7 CAN GET 700 tok/s/user, 56% BETTER PERFORMANCE THAN NVIDIA GB200 NVL72 THROUGH MEGAKERNEL OPTIMIZATION ON KIMI K3. As we said awhile ago, the TPU externalization of software is full steam ahead. This is ultra important to follow the progress of this.  
  http://shitter.thepixora.com/SemiAnalysis_/status/2102833399475879977#m
- @a16zcrypto (a16z Crypto, Wed, 23 Sep 2026): Note: While a small number of U.S.-regulated centralized platforms offer products similar to perpetual futures contracts to U.S. persons, most centralized and all decentralized exchanges restrict U.S. persons’ access to true perpetual futures contracts.  
  http://shitter.thepixora.com/a16zcrypto/status/2102823016929624104#m
- @a16zcrypto (a16z Crypto, Wed, 23 Sep 2026): Perps have become one of crypto’s most-traded products. @guywuolletjr and @jay_drainjr explain where they came from, how they work, and why more of the market is moving onchain. Video  
  http://shitter.thepixora.com/a16zcrypto/status/2102823014090064201#m
- @KyleSamani (Kyle Samani, Wed, 23 Sep 2026): The most important thing to note about this capital markets activity is that it comes with 0 overhang or debt obligation Clean, straight forward transaction to scale the treasury Forward Ind. | NASDAQ-$FWDI (@FWDind) Forward Industries ( $FWDI ) is closing a $25M registered direct offering with an institutional investor to acquire SOL. We continue to scale our treasury while increasing SOL-per-share accretion for shareholders. Read more in the full press release below. — http://shitter.thepixora.com/FWDind/status/2102744116656558304#m  
  http://shitter.thepixora.com/KyleSamani/status/2102813785597640800#m
- @KyleSamani (Kyle Samani, Wed, 23 Sep 2026): Top 10 all time life product Matteo Franceschetti (@m_franceschetti) BREAKING: Pod 6 is live. The sixth generation of our intelligent sleep system, redesigned for every kind of bed. ✅ The new Hub is small enough to fit under your bed frame ✅ More powerful than ever ✅ With 9x more sensors for enhanced accuracy ✅ In new Solo sizes, at our lowest starting price yet This is our most significant hardware launch to date, and our most accessible. Available now at eightsleep.com Video — http://shitter.thepixora.com/m_franceschetti/status/2102761196805816776#m  
  http://shitter.thepixora.com/KyleSamani/status/2102812665122857282#m
- @taomedia_ (TAO Media, Wed, 23 Sep 2026): ✏️ Story by @bart_hillerich Read about @numinous_ai on our site: tao.media/numinous-opens-imp… Link Numinous Opens Impact UI to Map Equity Exposure to Macro and Geopolitical Events The SN6 forecasting team is turning its causal graph and LLM forecasters into a fund-facing interface for tracking how event risks may move through equities. tao.media  
  http://nitter.jaydenha.uk/taomedia_/status/2102794073752887475#m
- @taomedia_ (TAO Media, Wed, 23 Sep 2026): Article Numinous Opens Impact UI to Map Equity Exposure to Macro and Geopolitical Events 📈 The SN6 forecasting team is turning its causal graph and LLM forecasters into a fund-facing interface for tracking how event risks may move through equities. @numinous_ai, the Bittensor  
  http://nitter.jaydenha.uk/taomedia_/status/2102793909881410015#m
- @taomedia_ (TAO Media, Wed, 23 Sep 2026): Midcentury just raised a $15M seed and emerged from stealth to build the “scaling layer” for physical AI. The company is already working with frontier labs, with 2M+ hours of egocentric robotics data spanning 50+ environments and 20,000 tasks. tao.media/midcentury-raises-… Link Midcentury Raises $15M Seed to Build Physical AI Data and Simulation Infrastructure The stealth exit pairs a large egocentric robotics dataset with Matrix, a simulation platform for evaluating and improving robot policies before deployment. tao.media  
  http://nitter.jaydenha.uk/taomedia_/status/2102771470296650095#m
- @KyleSamani (Kyle Samani, Wed, 23 Sep 2026): BREAKING: Pod 6 is live. The sixth generation of our intelligent sleep system, redesigned for every kind of bed. ✅ The new Hub is small enough to fit under your bed frame ✅ More powerful than ever ✅ With 9x more sensors for enhanced accuracy ✅ In new Solo sizes, at our lowest starting price yet This is our most significant hardware launch to date, and our most accessible. Available now at eightsleep.com Video  
  http://shitter.thepixora.com/m_franceschetti/status/2102761196805816776#m
- @const_reborn (Jacob Steeves, Wed, 23 Sep 2026): NOVA Blueprint: 678.5 Billion Possible Molecules Last week, we upgraded Blueprint to Boltz-2-based scoring. This week, we're expanding the chemical search space by more than 11×. Reactions: 5 → 44 Building blocks: 225K → 2.03M Enumerable chemical space: 61.1B → 678.5B molecules The implications are bigger than the numbers. Blueprint competitors now have to find the highest-scoring set within an 11× larger chemical space, using a substantially more computationally intensive scoring model than before. That makes deciding where to search and which molecules are worth spending inference on more im  
  http://nitter.jaydenha.uk/metanova_labs/status/2102759303421563262#m
- @KyleSamani (Kyle Samani, Wed, 23 Sep 2026): Introducing Pod 6. The sixth generation of our award-winning sleep system. ✅ The new Hub is small enough to fit under your bed frame ✅ More powerful than ever ✅ With 9x more sensors for enhanced accuracy ✅ In new Solo sizes, at our lowest starting price yet Get yours today at eightsleep.com Video  
  http://shitter.thepixora.com/eightsleep/status/2102729393260855566#m
- @manakoai (Manako, Wed, 23 Sep 2026): This weekend the team brought 15 stations online across Lyon, France. Three days of work. Around five minutes end to end for each site. Deploying computer vision to a physical location usually means weeks of integration. New cameras, a site visit, cabling, sign-off. Every one of these 15 stations went live on the cameras it already had. No new hardware, no rewiring, no site visits. We point Manako at the existing feed and it starts watching and alerting. The reason we did 15 at once was to see how deployment holds up across different setups. No two stations are the same, camera angles, how the  
  http://nitter.jaydenha.uk/manakoai/status/2102696954937426000#m
- @_redteam_ (RedTeam / Innerworks, Wed, 19 Aug 2026): Listen in to @oscar_hayek discussing RedTeam on @YumaGroup's Subnet Spotlight. Origin, commercial and technical traction, and where we're headed. Yuma (@YumaGroup) How RedTeam (SN61) powers their cyberthreat immune system with Bittensor shitter.thepixora.com/i/broadcasts/1dGYlazzp… Link Yuma How RedTeam (SN61) powers their cyberthreat immune system with Bittensor http://shitter.thepixora.com/i/broadcasts/1dGYlazzpnEKX — http://shitter.thepixora.com/YumaGroup/status/2090076390163095836#m  
  http://shitter.thepixora.com/_redteam_/status/2090091530920878293#m
- @tm0klc (Tim, Wed, 17 Jun 2026): Introducing Manako, the fastest way to turn any camera into an vision ai agent. Go on manako.ai. Join our waitlist. Video  
  http://shitter.thepixora.com/manakoai/status/2067298306200396197#m
- @jaltucher (James Altucher, Wed, 16 Sep 2026): Working on an AI-powered end to end platform for designing optical and then quantum chips at $QCLS. More details and refinements later but you can check it out at VibeGDS.io - you just enter plain English for the chip you want and it will build it out, simulate, verify, etc. Of interest mostly to optical engineers.  
  http://shitter.thepixora.com/jaltucher/status/2100262449685364904#m
- @foundrydigital (Foundry Digital, Wed, 11 Jan 2012): Expression Engine 2.0 review by the guys at Scriptiny bit.ly/w3Pg3R  
  http://shitter.thepixora.com/foundrydigital/status/157243024848596993#m
- @ridges_ai (Ridges, Wed, 09 Sep 2026): ridges.ai/explore/28 Link Ridges AI AI Agents, powered by Bittensor | SN62 ridges.ai  
  http://nitter.jaydenha.uk/ridges_ai/status/2097823739765526549#m
- @ridges_ai (Ridges, Wed, 09 Sep 2026): Next competition is live: Database Engineering. Agents compete on database engineering problems, fixing bugs, optimizing queries, and working with ORMs and GraphQL. Why this Niche next? Because inefficient queries are a real engineering challenge, and one where specialist agents have plenty of room to outperform. Open now for submissions:  
  http://nitter.jaydenha.uk/ridges_ai/status/2097823726561866122#m
- @ridges_ai (Ridges, Wed, 09 Sep 2026): CMC Verification post: ridges.ai  
  http://nitter.jaydenha.uk/ridges_ai/status/2097651752464011375#m
- @nigescore (Nige, Wed, 09 Sep 2026): .@nigescore going to paris last time he went to nrf in dallas he got us our biggest client ever (not announced yet) i can’t go. got something bigger on the 15th, 16th and 17th (to be announced) Manako (@manakoai) Heading to @nrfeurope NRF Retail’s Big Show Europe in Paris next week (15–17 Sept) 🇫🇷 If you are attending and want to hear what Manako Labs have built for retail, please DM and let’s meet up. No new hardware, no engineers, no code just your existing cameras doing more. #NRFRetailsBigShowEurope — http://shitter.thepixora.com/manakoai/status/2097622722310242420#m  
  http://shitter.thepixora.com/MaxSebti/status/2097630699129827589#m
- @ridges_ai (Ridges, Tue, 28 Jul 2026): ⛰️ x402 is now live on Ridges X402 is an agentic payment protocol that lets agents pay for API access autonomously. Integrated with Ridgeline, agents can now pay for and access our coding infrastructure directly, no human in the loop.  
  http://nitter.jaydenha.uk/ridges_ai/status/2082103797418262564#m
- @jtledore (Jean-Thomas Ledoré, Tue, 22 Sep 2026): .@openroboto just built a decentralized alternative to @Figure_robot’s Index for collecting robot training data, with real-world capture hardware. Open robotics on Bittensor now has its data network to challenge the industry’s biggest labs. Bittensor is coming for physical AI. OpenRoboto (@openroboto) Today we’re launching OpenRoboto Shift, opening a new chapter for OpenRoboto. Shift is a decentralized network for collecting egocentric robotics data: first-person video of real people doing real work. Only Possible on Bittensor. Explore Shift → shift.openroboto.ai/ Video — http://nitter.jaydenh  
  http://nitter.jaydenha.uk/opentensor/status/2102525497687285851#m
- @a16zcrypto (a16z Crypto, Tue, 22 Sep 2026): You can copy the code. You can’t copy the network of lenders, borrowers, and companies building on it. Morpho continues to show the power of open credit networks. Paul Frambot 🦋 (@PaulFrambot) I’ve been asked a lot what it’s like to partner with both Coinbase and Robinhood when they compete so fiercely. The answer comes down to Morpho’s fundamental purpose: connecting. Morpho is an open credit network designed to connect lenders and borrowers across any boundary (social, geographic, political, …). More borrowers create more demand for capital. More lenders create more competition to fund borro  
  http://shitter.thepixora.com/guywuolletjr/status/2102523019906478220#m
- @dylan522p (Dylan Patel, Tue, 22 Sep 2026): Spoke with AMD, they did not ship / sell this dual use chip to this firm and they're investigating the sourcing. This violates their policies + they work with authorities to take action on violations I am very concerned about the fact that pricing discrepancy is so large. I have heard from multiple folks that there are bitstream compatible FPGAs not from AMD that are floating around too. Dylan Patel (@dylan522p) US supply chains for electronics suck so much AMD found a business opportunity in dumping US military chips for 1/4 of the cost in China. US list price is $36k for this chip, with $4-5  
  http://shitter.thepixora.com/dylan522p/status/2102503347681210570#m
- @a16zcrypto (a16z Crypto, Tue, 22 Sep 2026): Ben Horowitz says instead of banning AI, educators should set problems students can't solve without it: "I was talking to Dan Boneh, who is a great professor of computer science and cryptography at Stanford. His take on AI was: You have two choices. You can ban it, and by the way, that won't work. Or you can make the problems so hard that you can't solve them without AI." "What he's seeing is, 'I've got students solving things that no student in history could have ever solved.' That's what's possible. You want to have that orientation: What can you solve with the tools? What can you do that's   
  http://shitter.thepixora.com/a16z/status/2102476819438141767#m
- @const_reborn (Jacob Steeves, Tue, 22 Sep 2026): Today Numinous is releasing its impact UI! Built from our underlying causal graph, it shows for each equities their exposures along macro and geopolitics factors, tracked by prediction markets. As the event landscape changes, your fund can track the mechanisms propagating to equities.  
  http://nitter.jaydenha.uk/numinous_ai/status/2102448310267019339#m
- @KyleSamani (Kyle Samani, Tue, 22 Sep 2026): Autonomous agents need rails fast and cheap enough to transact constantly. That's consolidating in one place. @solana now handles 76% of all x402 transactions. 23.2M in four weeks. Solana (@solana) JUST IN: Solana handles 76% of all @x402 transactions. 23.2M in four weeks. The next-largest network did 3.39M. — http://shitter.thepixora.com/solana/status/2102285997304148088#m  
  http://shitter.thepixora.com/FWDind/status/2102422922845696103#m
- @jtledore (Jean-Thomas Ledoré, Tue, 22 Sep 2026): Our latest research paper explores the growing connection between AI and digital assets and explains why broad AI adoption may drive new demand, utility and applications across the digital asset economy. blackrock.com/us/individual/…  
  http://nitter.jaydenha.uk/BlackRock/status/2102409739175141458#m
- @BarrySilbert (Barry Silbert, Tue, 22 Sep 2026): We're proud to be the pilot partner for @taostats' ads program and support one of the best pieces of free infrastructure in Bittensor. Soon these ad spaces will be available to subnets and other ecosystem participants as a new way to reach users, builders, and investors. For Bittensor and its subnets, growth starts with awareness. Nobody can use something they've never heard of. Taostats is our first ad campaign. It won't be our last, and soon we'll be advertising beyond the existing community to help new talent and capital discover Bittensor. $TAO  
  http://shitter.thepixora.com/YumaGroup/status/2102396817975529838#m
- @jaltucher (James Altucher, Tue, 22 Sep 2026): Welcome to Bittensor. Here's why you should stay and diamond-hand $TAO.  
  http://shitter.thepixora.com/taodaily_io/status/2102390629422567556#m
- @BarrySilbert (Barry Silbert, Tue, 22 Sep 2026): Grayscale AI Compute ETF (Ticker: $GCPU) is now trading. Why AI Compute? ⟶ AI's growth is constrained by physical compute. Data centers have just six months of capacity¹, and new ones take two to five years to build². ⟶ AI infrastructure capex is projected to exceed $1 trillion annually³. ⟶ $GCPU portfolio includes native data center businesses, plus operators repurposing existing power and land for AI, including Bitcoin miners. $GCPU offers exposure to AI’s physical layer, now accessible through brokerage or investment accounts. Learn more: etfs.grayscale.com/gcpu Video  
  http://shitter.thepixora.com/Grayscale/status/2102381328880832751#m
- @rob_svrn (Rob Greer, Tue, 22 Sep 2026): the ARR on @engyai is now 3.5m-4m usd, hoping to scale this beyond 8 figures before end of year. Demand for inference will be infinite, accelerate  
  http://shitter.thepixora.com/AlgodTrading/status/2102369904934686742#m
- @BarrySilbert (Barry Silbert, Tue, 22 Sep 2026): Luno has acquired @GTXNGlobal to expand cross-border payments across its core markets. GTXN brings licensed collection and payout infrastructure into @LunoGlobal's existing regulatory and liquidity footprint, giving enterprise clients a more integrated way to move money between developed and emerging markets. Led by CEO Dan Kleinbaum, GTXN will operate as Luno’s cross-border payments capability. Read the full announcement: luno.com/newsroom/luno-acqui… Link Luno Newsroom - What Luno&apos;s acquisition of GTXN means for cross-border payments Luno has acquired GTXN, giving businesses a single li  
  http://shitter.thepixora.com/LunoGlobal/status/2102321078874095983#m
- @dylan522p (Dylan Patel, Tue, 22 Sep 2026): I wanted to use this photo because it's the actual package and looks way cooler. The black area above is the DRAM but not milled yet. Cross section from our Hitachi XTEM coming soon 🤫 SemiAnalysis (@SemiAnalysis_) We took the silicon out of the silicon. Quick turn from SemiAnalysis STEEL Teardown Lab: iPhone 18 Pro Max, A20 silicon on TSMC N2. more to follow... — http://shitter.thepixora.com/SemiAnalysis_/status/2101757943351783908#m  
  http://shitter.thepixora.com/dylan522p/status/2102208035225760191#m
- @BarrySilbert (Barry Silbert, Tue, 22 Sep 2026): $GTAO 👀 Are you paying attention yet? $TAO  
  http://shitter.thepixora.com/Altcoin_Hero_/status/2102190155213770803#m
- @nigescore (Nige, Tue, 15 Sep 2026): The physical world still can’t talk to software. A billion cameras watch factories, stations, warehouses, and stores every second. Almost none of that footage becomes action. That’s what we build at Manako. Today we join F/ai at @joinstationf The program that put OpenAI, Anthropic, Google, Meta, Microsoft and top-tier VCs behind a handful of AI-native teams. Honoured. Focused. Shipping.  
  http://shitter.thepixora.com/manakoai/status/2099861562882203822#m
- @jaltucher (James Altucher, Tue, 15 Sep 2026): Q/C Technologies has appointed Yossef Ehrlichman, Ph.D., as Chief Technology Officer to lead the company’s optical processing unit program and overall technology strategy. Learn more: bit.ly/4xXk2ik $QCLS  
  http://shitter.thepixora.com/Q_CTechnologies/status/2099856104670859351#m
- @nigescore (Nige, Tue, 08 Sep 2026): Astra Ultra did not cook sports-grade vision AI. Gave it a 30s football clip from our subnet private track. Frame-level events, JSON, annotated video. Ground truth and the published scoring rules only after it committed. 22 predictions. 17 real events. 15 inside the action windows. 7 extras. 2 misses. Precision 68.18%. Recall 88.24%. F1 76.92%. Our Bittensor eval, SN44: 0%. Matches after timing decay: 16.538 False positives: −20.300 GT weight: 25.600 score = max(0, (16.538 − 20.300) / 25.600) = 0 Three extra take-ons and two extra tackles were 14.6 penalty points. It also misread the late inte  
  http://shitter.thepixora.com/webuildscore/status/2097261685358596399#m
- @tm0klc (Tim, Tue, 07 Jul 2026): Subnet 44 @webuildscore is expanding. We’re incentivising training for a new vision-language model: Satori. Satori reasons AND grounds. It doesn’t just answer questions about an image. It points to the evidence. - Reason about scenes - Detect and segment objects - Read text - Count entities - Ground claims in pixels Most VLMs are split: strong reasoning OR strong grounding. Detection models localise, but can’t talk. Chatty VLMs describe fluently, but can’t prove it. Satori sits at the intersection. We’re starting with a 7B base model.  
  http://shitter.thepixora.com/tm0klc/status/2074298897305047101#m
- @resilabsai (RESI, Tue, 07 Apr 2026): The power of holding Bittensor $TAO subnet alpha Here is an example to illustrate the flywheel of $TAO Let's say you 1,000 alpha of @resilabsai which cost around 7 $TAO 7 $TAO at a price of $310 = $2,170 Current alpha price of Resi, subnet 46: .0066 $TAO Let's make some calculated assumptions. &gt; price of resi alpha stays the same for 3 years &gt; price of $TAO remains the same at $310 &gt; APY for holding Resi alpha is 40% for the first 2 years, then 30% in year 3 What is my total value in 3 years? Year 1 (40% APY) 1,060.6 × 1.4 = 1,484.8 alpha In $TAO: 1,484.8 × 0.0066 ≈ 9.80 $TAO In USD:   
  http://shitter.thepixora.com/Pop_Collapse/status/2041570023823528017#m
- @TargonCompute (Targon, Tue, 01 Sep 2026): Happy to help! Proud to be trusted with running critical workloads such as validators. Very excited to see the talented team at DeSci Labs join the Bittensor ecosystem, their research and expertise are sure to add long-lasting value to the network. 🔬 Claims - Subnet 111 (@DeSciClaims) Our validator for SN111 is running on hardware provided by @TargonCompute. We're super grateful for the fast, reliable setup and the team's amazing support. Thank you, guys! — http://shitter.thepixora.com/DeSciClaims/status/2094364807596036575#m  
  http://shitter.thepixora.com/TargonCompute/status/2094908006039236625#m
- @_redteam_ (RedTeam / Innerworks, Thu, 27 Aug 2026): The Immune System for the Internet. Releasing next month. Oscar Hayek (@oscar_hayek) Defence in this era must be AI driven, the absolute baseline is adapting defences faster than attacks are being produced. Anything slower than this leaves you in a constant state of degradation. What we’ve built on @_redteam_ is an immune system for this problem. The attacks we ingest are evolved inside the system into complete novel vectors that cannot be produced anywhere else. Every one of these gets patched before an external attacker has the means/ability to create it, let alone release it. bittensor:nati  
  http://shitter.thepixora.com/_redteam_/status/2093081017145847826#m


---
_Generated at 2026-09-24T16:20:14.162115+00:00 by scripts/intel/aggregate.py. Treat this digest as input context, not as ground truth. Verify before quoting._
