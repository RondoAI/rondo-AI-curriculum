# Intelligence Digest, 2026-10-05

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

- @dylan522p (Dylan Patel, Wed, 30 Sep 2026): A lot of people tell me they use agents to build xyz Thing is, some people have an accent or say it quickly And so I hear we use Asians to build xyz Which is like... Well ya that's been the global economy for the last few decades.  
  http://shitter.thepixora.com/dylan522p/status/2105367125611237551#m
- @polychain (Polychain Capital, Wed, 30 Sep 2026): THE BLOCK: DogeOS launched a public testnet for its zero-knowledge rollup, bringing EVM smart contracts to Dogecoin, with dogecoin:native used for gas fees. "I've spent half a decade encouraging people to take a chance on Dogecoin and to build in its ecosystem," said Timothy Stebbing, director of the Dogecoin Foundation. "My hopes are that DogeOS becomes the springboard for a wave of new utility engineering."  
  http://shitter.thepixora.com/TheBlockCo/status/2105359920795394451#m
- @dylan522p (Dylan Patel, Wed, 30 Sep 2026): Can't invest in Anthropic at 2 trillion because it could be a 0 and I'm fucked, or it could be 20 trillion, but at 20 trillion we are all fucked.  
  http://shitter.thepixora.com/dylan522p/status/2105334504726692035#m
- @dylan522p (Dylan Patel, Wed, 30 Sep 2026): AI is making papers cheaper to produce. ICLR submissions: 4,938 (2023), 7,262 (2024), 11,603 (2025), 19,525 (2026). Reported 2027 IDs exceed 62K, above roughly 56K paper submissions in all previous years COMBINED. Can reviewers keep up? (1/6)🧵  
  http://shitter.thepixora.com/SemiAnalysis_/status/2105130561530421342#m
- @polychain (Polychain Capital, Wed, 24 Jun 2026): EXCLUSIVE: a16z CSX-backed Cambrian raises $6 million seed to build blockchain data oracle network theblock.co/post/406028/a16z… Link a16z CSX-backed Cambrian raises $6 million seed to build blockchain data oracle network Cambrian’s new funding will expand its API and verifiable oracle network for institutions and AI agents, with Base and Solana already in production. theblock.co  
  http://shitter.thepixora.com/TheBlockCo/status/2069827932843909349#m
- @manakoai (Manako, Wed, 23 Sep 2026): USA ⏭️ Max (@MaxSebti) just flashed the first few @manakoai boxes that will be deployed in the US — https://nitter.kareem.one/MaxSebti/status/2102842552827412624#m  
  https://nitter.kareem.one/manakoai/status/2102843727048024497#m
- @tm0klc (Tim, Wed, 17 Jun 2026): Introducing Manako, the fastest way to turn any camera into an vision ai agent. Go on manako.ai. Join our waitlist. Video  
  https://nitter.kareem.one/manakoai/status/2067298306200396197#m
- @nigescore (Nige, Wed, 09 Sep 2026): .@nigescore going to paris last time he went to nrf in dallas he got us our biggest client ever (not announced yet) i can’t go. got something bigger on the 15th, 16th and 17th (to be announced) Manako (@manakoai) Heading to @nrfeurope NRF Retail’s Big Show Europe in Paris next week (15–17 Sept) 🇫🇷 If you are attending and want to hear what Manako Labs have built for retail, please DM and let’s meet up. No new hardware, no engineers, no code just your existing cameras doing more. #NRFRetailsBigShowEurope — https://nitter.kareem.one/manakoai/status/2097622722310242420#m  
  https://nitter.kareem.one/MaxSebti/status/2097630699129827589#m
- @YumaGroup (Yuma Holdings, Tue, 29 Sep 2026): In 1 hour, Yuma COO @GSchvey leads a conference-closing conversation on where Bittensor goes next, live-streamed by @ExploitSummit here (5:20pm ET). bittensor:native Exploit Summit (@ExploitSummit) Exploit Summit: Live from Montreal Day 2 shitter.thepixora.com/i/broadcasts/1NGaroOYp… Link Exploit Summit Exploit Summit: Live from Montreal Day 2 http://shitter.thepixora.com/i/broadcasts/1NGaroOYpQXJj — http://shitter.thepixora.com/ExploitSummit/status/2104942854753947674#m  
  http://shitter.thepixora.com/YumaGroup/status/2105029645233995862#m
- @YumaGroup (Yuma Holdings, Tue, 29 Sep 2026): Beam studio is live: To learn more go to docs.b1m.ai  
  http://shitter.thepixora.com/b1m_ai/status/2105022473762713763#m
- @YumaGroup (Yuma Holdings, Tue, 29 Sep 2026): "It's certainly a conversation that starts before anything is signed." @LindsMikeStone of @YumaGroup on helping founders before a deal, even if they later launch elsewhere. With @macrozack @bitstarterAI, Kelly Woodward @CrucibleLabs and @capradavis of Unsupervised Capital. Video  
  http://shitter.thepixora.com/ExploitSummit/status/2105011226325741950#m
- @const_reborn (Jacob Steeves, Tue, 29 Sep 2026): We're excited to share that Bare Metal and Sandboxes are now live on Targon.com Bare Metal → An entire physical machine dedicated to your organization → No hypervisor, no container runtime, no noisy neighbors → Full control of kernel, drivers and firmware-level GPU settings → Every operator is KYC-verified, keeping workloads secure without TVM Sandboxes → Short-lived, isolated Linux environments for development, testing, previews and agents → Provisioning to running within seconds → Browser terminal, graphical Linux desktop or SSH → Fork independent copies for parallel experiments and agent ta  
  https://nitter.kareem.one/TargonCompute/status/2105004608531939718#m
- @YumaGroup (Yuma Holdings, Tue, 29 Sep 2026): Introducing Pulse and Gate. Pulse: your agent asks, your phone buzzes, you approve with your face in YID. Only then does it act. yanez.ai/pulse Gate: funds sit behind a contract that only unlocks for a signature from your biometrics, verified on-chain. gate.yanez.ai Pulse is free through October. $TAO  
  http://shitter.thepixora.com/yanez__ai/status/2104991405592752495#m
- @YumaGroup (Yuma Holdings, Tue, 29 Sep 2026): An agent asks to spend $100. Its allowance is $25. @josercaldera demonstrates a blocked request with Yanez Gate, then raises the limit and authorises it with Pulse. Watch the spending controls in action at Exploit Summit. Video  
  http://shitter.thepixora.com/ExploitSummit/status/2104988325639798889#m
- @const_reborn (Jacob Steeves, Tue, 29 Sep 2026): RSI Training goes LIVE at 5 PM PT today! We’re giving each agent access to a production Slurm cluster, 1,000 GPU-hours, and 6 days to improve Nemotron 3.5 model performance. Watch it all happen live -&gt; rsiarena.org Video  
  https://nitter.kareem.one/zhangchen_xu/status/2104879589726322875#m
- @oroagents (Oro, Tue, 29 Sep 2026): Commerce is going to prove to be one of the largest opportunities in the agent world. Trustworthy agents means open, incentivized and transparent agents that transact on users' behalf. great article by @CrucibleLabs. Let's make this future happen the right way. Crucible Labs (@CrucibleLabs) Article a BIT of Joy: Issue 11 The Agent Era Is Here For the last few years, the AI industry has talked about agents as the next big thing. At this point, the more interesting question isn&apos;t when agents arrive. They&apos;re already — http://shitter.thepixora.com/CrucibleLabs/status/2103188134238564440#  
  http://shitter.thepixora.com/oroagents/status/2104794483745587425#m
- @oroagents (Oro, Tue, 22 Sep 2026): We're excited to announce ORO Bench today, a benchmark that's powered by a generator creating new synthetic shopping environments everyday. This is now powering our subnet on Bittensor, SN15. Video  
  http://shitter.thepixora.com/oroagents/status/2102475717367963815#m
- @polychain (Polychain Capital, Tue, 15 Sep 2026): It's time for a new foundation. Not a new start. Legacy Mode is live on Passport, keep every account you already have, on code anyone can inspect. Switch to open source hardware and software while keeping your existing accounts for supported assets. Here’s how. 🧵 Video  
  http://shitter.thepixora.com/FoundationHQ/status/2099865846101180499#m
- @nigescore (Nige, Tue, 15 Sep 2026): The physical world still can’t talk to software. A billion cameras watch factories, stations, warehouses, and stores every second. Almost none of that footage becomes action. That’s what we build at Manako. Today we join F/ai at @joinstationf The program that put OpenAI, Anthropic, Google, Meta, Microsoft and top-tier VCs behind a handful of AI-native teams. Honoured. Focused. Shipping.  
  https://nitter.kareem.one/manakoai/status/2099861562882203822#m
- @nigescore (Nige, Tue, 08 Sep 2026): Astra Ultra did not cook sports-grade vision AI. Gave it a 30s football clip from our subnet private track. Frame-level events, JSON, annotated video. Ground truth and the published scoring rules only after it committed. 22 predictions. 17 real events. 15 inside the action windows. 7 extras. 2 misses. Precision 68.18%. Recall 88.24%. F1 76.92%. Our Bittensor eval, SN44: 0%. Matches after timing decay: 16.538 False positives: −20.300 GT weight: 25.600 score = max(0, (16.538 − 20.300) / 25.600) = 0 Three extra take-ons and two extra tackles were 14.6 penalty points. It also misread the late inte  
  https://nitter.kareem.one/webuildscore/status/2097261685358596399#m
- @tm0klc (Tim, Tue, 07 Jul 2026): Subnet 44 @webuildscore is expanding. We’re incentivising training for a new vision-language model: Satori. Satori reasons AND grounds. It doesn’t just answer questions about an image. It points to the evidence. - Reason about scenes - Detect and segment objects - Read text - Count entities - Ground claims in pixels Most VLMs are split: strong reasoning OR strong grounding. Detection models localise, but can’t talk. Chatty VLMs describe fluently, but can’t prove it. Satori sits at the intersection. We’re starting with a 7B base model.  
  https://nitter.kareem.one/tm0klc/status/2074298897305047101#m
- @affine_io (Affine, Tue, 01 Sep 2026): Everything you need to compete is public: affine.io/llms.txt  
  http://nitter.meowing.monster/affine_io/status/2094801258016370976#m
- @affine_io (Affine, Tue, 01 Sep 2026): Video  
  http://nitter.meowing.monster/affine_io/status/2094801103959540005#m
- @polychain (Polychain Capital, Thu, 25 Jun 2026): Article The Missing AI Layer Is Not Security. It&apos;s Authority. AI agents are now computer users. They browse websites. They read files. They write code. They call APIs. They log in to accounts. They handle credentials, use tools, and take actions across software  
  http://shitter.thepixora.com/zherbert/status/2070178183333171395#m
- @manakoai (Manako, Thu, 24 Sep 2026): next batch of stations to be deployed with @manakoai is going to allow us to leverage a lot more @webuildscore models. - 4 motorway stations. beasts with 40+ cameras each. - that’s 10x more cameras than on unmanned stations. - massive fuel forecourts, EV charging bays, car wash, restaurants, supermarkets, coffee areas. the second best news… is it’s with a new signed client 👀  
  https://nitter.kareem.one/arnod3f/status/2103174097522098609#m
- @manakoai (Manako, Thu, 24 Sep 2026): Same week, different rooms, same vision Paris ✅ London ✅ Next?  
  https://nitter.kareem.one/manakoai/status/2103148213645558030#m
- @polychain (Polychain Capital, Thu, 13 Aug 2026): LBTC proved demand for yield-bearing Bitcoin. Today, we double down on that thesis. LBTC is moving to institutional yield. @Bitwise will manage a covered-call options strategy with a 4.5-year legacy track record, to generate LBTC's yield, targeting 2.5% net APY paid in Bitcoin.  
  http://shitter.thepixora.com/Lombard_Finance/status/2087887552300933626#m
- @nigescore (Nige, Thu, 03 Sep 2026): Shell and ENI stations added to roll out today. Accelerate.  
  https://nitter.kareem.one/MaxSebti/status/2095545005540552752#m
- @KyleSamani (Kyle Samani, Thu, 01 Oct 2026): 8.5M $SOL held. 949K SOL added this last quarter alone. More in our press release below.  
  http://nitter.meowing.monster/FWDind/status/2105757540999180380#m
- @webuildscore (Score, Sun, 04 Oct 2026): Subnets’ moats lie in open-source, trustless evals hardened by adversarial mining Max (@MaxSebti) we measured the same success rate on football (soccer) analysis-model work GPT-6 Astra scored 0% when measured under real conditions on our open-source eval bench — http://nitter.meowing.monster/MaxSebti/status/2106820324536803492#m  
  http://nitter.meowing.monster/webuildscore/status/2106824346513838207#m
- @webuildscore (Score, Sun, 04 Oct 2026): Miners on Score cleared the worksite Personal Protective Equipment target in days, not months. Baseline was 46.6%. Live score is 90.1%, target was 90%. Hard hats, vests, eyewear. Hourly evals. Open weights. The task stays up. Harder site footage is going in so the model keeps getting trained on messier, real conditions. That is the point. A missing hard hat or vest caught before someone walks into the zone. Miners are not tuning a demo. They are building the thing that keeps people safer at work, and anyone can run it.  
  http://nitter.meowing.monster/webuildscore/status/2106792152927703211#m
- @dylan522p (Dylan Patel, Sat, 26 Sep 2026): Rubin HBM Despec = Nvidia cutting coke Dylan Patel (@dylan522p) Fentanyl Grade Compute: Why a GB300 Rack Will Out-Price Blow by Weight in 2030 A GB300 NVL72 weighs roughly 1,580 kg fully populated and recent purchase orders put it at $5M per rack. That is $3,165/kg. Strip out the 1.5 tons of busbar, manifold and coolant and the GPU packages alone are well into gold territory, but we're pricing the rack, because that's what you actually take delivery of. Where that sits on the illicit commodity curve today ($/kg): $2,400 Cannabis flower $3,165 GB300 NVL72 $3,500 Fentanyl $28,000 Cocaine $65,000  
  http://shitter.thepixora.com/dylan522p/status/2103883333067485599#m
- @nigescore (Nige, Sat, 19 Sep 2026): We’re completing our first 20 reference deployments, led by our CEO and engineering team, and the headline finding is that Manako is genuinely plug and play. No specialist integration required: a unit can be shipped to site and connected by anyone on the ground. That’s what makes our next phase possible. Our integration partners will roll out at scale on a simple, repeatable install, with less time on site and lower cost per deployment.  
  https://nitter.kareem.one/manakoai/status/2101403529558577403#m
- @webuildscore (Score, Sat, 03 Oct 2026): Oktoberfest is a stress test for any detector, and we put our Beverage Container Detector right in the middle of it. Hundreds of steins, overlapping, half covered by hands and moving fast. No base model gets every scene perfect zero shot, and that's exactly what score studio is built for. We opened the annotation tab, drew a box on one stein, and auto labelling suggested the rest in the same frame. A few clicks and the whole table was labelled. Less time drawing boxes, more time making the model even sharper. Video  
  http://nitter.meowing.monster/webuildscore/status/2106415526125699335#m
- @const_reborn (Jacob Steeves, Sat, 03 Oct 2026): Kappa run is now stopped, not too bad overall! We passed llama 3.2 1b on ARC-C, OBQA, TQA, etc., nearly matched on ARC-E, SciQ, etc. Considering that was 9T tokens and we hit those numbers on the 576B checkpoint, AND we did so around 90% cheaper per token, I'd call it a solid preliminary win! Issues with the run: 1. In one of the Gated DeltaNet-2 heads, the per-channel decay gate underflowed, causing state wipe, and ourput RMSNorm amplified near-zero outputs ~1000x into fleet wide grad spikes. 2. Very late/slow nodes were so far behind their evidence was discarded, not a huge effect but we sho  
  https://nitter.kareem.one/jon_durbin/status/2106379034997178795#m
- @webuildscore (Score, Sat, 03 Oct 2026): Busy days ahead as Rich said rich.τ (@richdotca) Jensen Huang: “ Physical AI, as a large category, is the technology industry's first opportunity to address a $50 trillion industry that has largely been void of technology until now. So we need to invent all of the technology necessary to do that.” Busy days ahead for $TAO $SN44 — http://nitter.meowing.monster/richdotca/status/2106254541796626818#m  
  http://nitter.meowing.monster/webuildscore/status/2106259509366931667#m
- @oroagents (Oro, Mon, 28 Sep 2026): “Every day we are changing our incentive mechanism.” @oroagents keeps its miners facing fresh challenges. At Exploit, Shardul Bansal explained how a catalog of 11 million products becomes new tasks and evaluation environments every day, keeping the competition moving as AI models improve. Video  
  http://shitter.thepixora.com/ExploitSummit/status/2104667461517713663#m
- @oroagents (Oro, Mon, 28 Sep 2026): Accelerating development at ORO Seth Schilbe (@ironseth_s) PSA: Your CLAUDE.md is probably the problem, not the models. I audited my Claude Code memory after using it for 9 months since Opus 4.5. **49 of 260 entries contradicted our current code**. Memory had become a second copy of team knowledge outside our normal review process. So I ran ~270 tests to see what my config actually did. — http://shitter.thepixora.com/ironseth_s/status/2104645444169334831#m  
  http://shitter.thepixora.com/oroagents/status/2104656457237209371#m
- @tm0klc (Tim, Mon, 15 Jun 2026): Cameras shouldn’t just record the world. They should make it queryable. That’s the shift we’re building at Manako. Vision Agents that turn live video into real-time operational intelligence, running close to the edge where decisions actually happen. Manako (@manakoai) Article Teaching the physical world to talk For decades, we&apos;ve been building digital systems that can process, search and reason about information. Yet much of the world&apos;s most valuable information still exists outside those systems. Factories — https://nitter.kareem.one/manakoai/status/2066467103163511203#m  
  https://nitter.kareem.one/tm0klc/status/2066622375358308467#m
- @affine_io (Affine, Mon, 07 Sep 2026): A model doesn’t need to be the largest to matter. On Affine, models compete on how well their reasoning supports the next action across code, tool use and math. A winner could put that reasoning to work in products, either directly or alongside a larger model. Video  
  http://nitter.meowing.monster/affine_io/status/2096984627059810338#m
- @affine_io (Affine, Fri, 28 Aug 2026): United against the divided. Intelligence knows neither borders nor color. Uphold the torch with us to bring light where it is needed most. Open reasoning for humanity. Join the thousand-year intelligence federation. affine.io scouτ (@scoutesy) The same way neutron stars form gold through merging, affine orchestrates reasoning through open collaboration. Unus pro omnibus, omnes pro uno. Tao of a million symmetries. Video — http://nitter.meowing.monster/scoutesy/status/2093400328062296312#m  
  http://nitter.meowing.monster/affine_io/status/2093401028763013596#m
- @tm0klc (Tim, Fri, 21 Aug 2026): I have now made 5 Omarchy plugins that I use every day! Check them out here: omarchyplugins.com/?author=c…  
  https://nitter.kareem.one/paolino/status/2090738880106377257#m
- @tm0klc (Tim, Fri, 21 Aug 2026): Computer vision, decentralised Score (@webuildscore) Computer vision engineers are still duct-taping tools together just to get a model into production. We just finished another round of user interviews and that frustration came up again and again. So we re-designed Studio to work around our new Pipelines + Workflow Canvas features. Visually design any vision pipeline from start to finish, connect models, logic, and outputs on one canvas, preview the exact result, then deploy. You see the output before you ship it. Everything in a single interface. The full loop, shaped by the people who actua  
  https://nitter.kareem.one/tm0klc/status/2090610814449570047#m
- @affine_io (Affine, Fri, 04 Sep 2026): Affine submissions are now private, so miners can compete without exposing their weights to competitors. Crowned models still go public. Losing checkpoints will be published later, so anyone can independently recompute every duel verdict. Video  
  http://nitter.meowing.monster/affine_io/status/2095937147320844533#m
- @KyleSamani (Kyle Samani, Fri, 02 Oct 2026): Forward! The Block (@TheBlockCo) THE BLOCK: Forward Industries increased its Solana treasury by nearly 949,000 SOL during the last quarter, bringing total holdings to 8.5 million SOL, or roughly 1.4% of the circulating supply. The company said the solana:So11111111111111111111111111111111111111112 added during the quarter came at an average cost of $83. — http://nitter.meowing.monster/TheBlockCo/status/2105947930544701442#m  
  http://nitter.meowing.monster/KyleSamani/status/2106126224187679141#m
- @KyleSamani (Kyle Samani, Fri, 02 Oct 2026): The @Backpack team ships grok.com/share/bGVnYWN5_15a0…  
  http://nitter.meowing.monster/KyleSamani/status/2106116686529335306#m
- @webuildscore (Score, Fri, 02 Oct 2026): We asked Opus 5.5 to explain Score Studio using motion design. We see this as an early experiment in how far these models can go beyond writing text and code. It's not a finished piece, and some details are still rough. We'd rather share it now and learn from your reactions than refine it in private. A model explaining how models get built. We'll call that a good start. What should we try next? Video  
  http://nitter.meowing.monster/webuildscore/status/2106096886474039472#m
- @const_reborn (Jacob Steeves, Fri, 02 Oct 2026): "Supercomputers via abstracted markets" - Yuma Rao This idea captivated me and ultimately started my journey into #bittensor. Now we've built one on @IOTA_SN9 Video  
  https://nitter.kareem.one/macrocrux/status/2106095160702509150#m
- @manakoai (Manako, Fri, 02 Oct 2026): wednesday night in london, @FelixCapital event. fireside chat with alex holt, field cto at @ElevenLabs. one alpha stuck with me. for early stage AI companies: hitting production is super hard. the most valuable thing you can find is not a client. it is a design partner. a company who gives you access to valuable data, so you can push your tech and crack hard problems. this is exactly what FDEs are great at: building that connection, understanding how the product best fits, so you can then crack those problems at scale for a whole industry. after the talk I walked alex through @manakoai. that i  
  https://nitter.kareem.one/arnod3f/status/2106066935062347885#m
- @dylan522p (Dylan Patel, Fri, 02 Oct 2026): Long live the short king newsletter.semianalysis.com/… Elon Musk (@elonmusk) We cut our RAM in half for the Tesla AI5 chip (now 72GB of LP5) and 1/3 for AI6 (now 144GB of LP6). This was the only way to get enough volume for Optimus production and greatly reduces cost. As it turns out, we think this will have a negligible effect on Optimus performance, as memory bandwidth is a bigger limiting factor than total memory storage (bandwidth was held constant). — http://shitter.thepixora.com/elonmusk/status/2105747471045370250#m  
  http://shitter.thepixora.com/dylan522p/status/2106054698335924241#m


---
_Generated at 2026-10-05T03:29:14.355213+00:00 by scripts/intel/aggregate.py. Treat this digest as input context, not as ground truth. Verify before quoting._
