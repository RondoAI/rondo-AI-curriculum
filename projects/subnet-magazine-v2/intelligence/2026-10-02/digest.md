# Intelligence Digest, 2026-10-02

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

- @opentensor (Opentensor Foundation, Wed, 30 Sep 2026): Bitcoin used incentives to build the world’s largest specialized compute network. Bittensor is applying that same playbook to unite spare compute across the planet and build the world’s largest decentralized AI training network. Macrocosmos (@MacrocosmosAI) Just announced earlier today at @ExploitSummit in Montreal: the iota SDK and Liquid Compute. Liquid Compute is our disaggregated compute platform. It turns the long tail of global compute into capacity you can actually train on. The iota SDK powers any training workload across it, as if it were one cluster. We go to market in the coming wee  
  http://shitter.thepixora.com/opentensor/status/2105410895220220032#m
- @rob_svrn (Rob Greer, Wed, 30 Sep 2026): Today, the Kusanagi team visited MIT’s @medialab to present Bittensor. We met with the lab’s leadership and researchers for initial discussions about a potential partnership between @MIT and the wider Bittensor ecosystem through @opentensor. Let’s make TAO win.  
  http://shitter.thepixora.com/kusanagi_vntrs/status/2105398290107798012#m
- @rob_svrn (Rob Greer, Wed, 30 Sep 2026): Fantastic keynote address from @const_reborn highlighting the incredible progress Bittensor has made over the last year and where it stands in the context of the broader AI landscape. sun runner (@0xSunRun) Bittensor State of the Union feat. @const_reborn. A must watch/listen. No one is bullish enough on what is being built here. Video — http://shitter.thepixora.com/0xSunRun/status/2104648112963047425#m  
  http://shitter.thepixora.com/stillcorecap/status/2105376853254906260#m
- @opentensor (Opentensor Foundation, Wed, 30 Sep 2026): “We need to make the Linux of AI.” @jon_durbin of @chutes_ai presented an 8B model trained across distributed gaming GPUs for roughly $6,500 in GPU rental. It runs entirely on a phone’s CPU at nearly 60 tokens per second. His full @ExploitSummit keynote explains how open-source development and decentralized training could give people control over AI from its creation to its everyday use. Video  
  http://shitter.thepixora.com/opentensor/status/2105353248836362289#m
- @rob_svrn (Rob Greer, Wed, 30 Sep 2026): What neXt after Al? - Superintelligence - AGI-level humanoid robots - Affordable space tourism - Artificial wombs - Atomic-scale manufacturing - Abundant energy, food, and ATP - Personal superintelligent assistants (MAO) - Anti-aging and personalized treatments for every disease - Full automation of scientific and technological discoveries - Net-zero carbon emissions, clean air, and minimal pollution - BCIs and advanced brain-computer interfaces that can take action based on thoughts - Flying vehicles and autonomous cities and so much more... And eventually, technologies that today sound like   
  http://shitter.thepixora.com/SciTechera/status/2105337896110821386#m
- @rob_svrn (Rob Greer, Wed, 30 Sep 2026): Through our distributed compute market, we have just onboarded 10x B300 nodes We are making them available on demand to help give smaller teams access to the latest hardware without having to sign a multi-year contract You can rent as little as 1x node! Link to rent is below  
  http://shitter.thepixora.com/jameswoodmanv/status/2105332561841099001#m
- @opentensor (Opentensor Foundation, Wed, 30 Sep 2026): This Thursday on Novelty Search :: Subnet 80 :: @openroboto OpenRoboto is building an open competition for robot intelligence on Bittensor, where miners improve shared base models and each champion becomes the next starting point. They are now expanding into real robot validation and Shift, their decentralized network for collecting real world robotics data, connecting model improvement with physical data and commercial demand. Thursday :: 5PM EDT / 9PM UTC Hosted by @const_reborn  
  http://shitter.thepixora.com/opentensor/status/2105322199787700284#m
- @jaltucher (James Altucher, Wed, 30 Sep 2026): MY TOP 10. I love TV. I worked at HBO (in the 90s). I've been an advisor for shows ("Billions"), I've pitched shows to every studio. Here's my top 10. I've watched each of these at least 4 times. BUT...what should #10 be?? 1) Breaking Bad 2) Mad Men 3) Lost 4) Carnevale 5) Battlestar Galactica 6) Better Call Saul 7) Arrested Devekooment 8) Sopranos 9) Curb Your Enthusiasm  
  http://shitter.thepixora.com/jaltucher/status/2105314083108974777#m
- @1inch (1inch, Wed, 30 Sep 2026): Swap USDG for tokenized Apple on @RobinhoodCrypto Chain. Same chain, one swap. Video  
  http://shitter.thepixora.com/1inch/status/2105289057903182213#m
- @1inch (1inch, Wed, 30 Sep 2026):   
  http://shitter.thepixora.com/1inch/status/2105289058280747354#m
- @const_reborn (Jacob Steeves, Wed, 30 Sep 2026): Thiel, who has cared for this problem more than any thinker believes the answer is the state (USA) or the state outside the state (Praxis). But only one thing, ever, ever in human history, has ever evaded the tendrils of power, and it’s not an address. It’s a network.  
  https://nitter.kareem.one/const_reborn/status/2105281085483479098#m
- @const_reborn (Jacob Steeves, Wed, 30 Sep 2026): The anti christ is this. Untethered power. The detachment between the machine and the natural world that birthed it.  
  https://nitter.kareem.one/const_reborn/status/2105280079320469684#m
- @const_reborn (Jacob Steeves, Wed, 30 Sep 2026): Make no mistake, we are witnessing the end of a ten thousand year civilization balance of power. There will be consequences to that.  
  https://nitter.kareem.one/const_reborn/status/2105279430247452774#m
- @const_reborn (Jacob Steeves, Wed, 30 Sep 2026): But now the monopoly on violence has captured capital and capital just eroded the value of labour. And it was labour which kept the state in check.  
  https://nitter.kareem.one/const_reborn/status/2105278930013864035#m
- @manakoai (Manako, Wed, 23 Sep 2026): USA ⏭️ Max (@MaxSebti) just flashed the first few @manakoai boxes that will be deployed in the US — http://shitter.thepixora.com/MaxSebti/status/2102842552827412624#m  
  http://shitter.thepixora.com/manakoai/status/2102843727048024497#m
- @manakoai (Manako, Wed, 23 Sep 2026): This weekend the team brought 15 stations online across Lyon, France. Three days of work. Around five minutes end to end for each site. Deploying computer vision to a physical location usually means weeks of integration. New cameras, a site visit, cabling, sign-off. Every one of these 15 stations went live on the cameras it already had. No new hardware, no rewiring, no site visits. We point Manako at the existing feed and it starts watching and alerting. The reason we did 15 at once was to see how deployment holds up across different setups. No two stations are the same, camera angles, how the  
  http://shitter.thepixora.com/manakoai/status/2102696954937426000#m
- @shibshib89 (Ala Shaabana, Wed, 16 Sep 2026): LFG! Crucible Labs (@CrucibleLabs) Crucible Wallet Extension v2.1.1 is LIVE. This isn’t just an update. We rebuilt the entire wallet experience from the ground up. A completely new UI. More control over your TAO. More Bittensor tools built directly into your wallet. What’s new in v2.1.1: ✔️Completely updated UI + light/dark mode ✔️Claim rewards directly in the wallet ✔️Unified balance across TAO + alpha ✔️Universal Swap ✔️Transfer TAO + alpha ✔️Subnet discovery + detailed subnet views ✔️Multi-address support for seed phrases ✔️12 and 24 word seed phrase support ✔️Updated Smart Account + Reward  
  http://shitter.thepixora.com/shibshib89/status/2100300168633761947#m
- @jaltucher (James Altucher, Wed, 16 Sep 2026): Working on an AI-powered end to end platform for designing optical and then quantum chips at $QCLS. More details and refinements later but you can check it out at VibeGDS.io - you just enter plain English for the chip you want and it will build it out, simulate, verify, etc. Of interest mostly to optical engineers.  
  http://shitter.thepixora.com/jaltucher/status/2100262449685364904#m
- @shibshib89 (Ala Shaabana, Wed, 09 Sep 2026): Did you hear? Crucible Wallet is officially live on iOS today. An easy to use Bittensor wallet with Ledger security, Unified Swap and subnet level performance. Now available on iOS in the US, Android and Chrome. Download at CrucibleLabs.com #Bittensor #TAO #CrucibleWallet  
  http://shitter.thepixora.com/CrucibleLabs/status/2097815766473323006#m
- @shibshib89 (Ala Shaabana, Wed, 09 Sep 2026): We are officially on iOS! Onwards 🚀 Crucible Labs (@CrucibleLabs) A long time coming and officially here. Crucible Wallet is now available on iOS in the US. An easy, intuitive Bittensor wallet for your everyday TAO needs, with Unified Swap, portfolio tracking and Ledger support wherever you go. Already available on Google Play and Chrome Store. Download at CrucibleLabs.com #CrucibleWallet #TAO #Bittensor — http://shitter.thepixora.com/CrucibleLabs/status/2097699938209857625#m  
  http://shitter.thepixora.com/shibshib89/status/2097724813028516224#m
- @shibshib89 (Ala Shaabana, Wed, 02 Sep 2026): Crucible Labs dropping #downwiththedev Episode 1. We breakdown the Mobile Wallet with @buildwithsamp. Take a listen. Video  
  http://shitter.thepixora.com/CrucibleLabs/status/2095144290376937770#m
- @opentensor (Opentensor Foundation, Tue, 29 Sep 2026): Bittensor is building toward a full-stack intelligence network that no single company or country can control. In his @ExploitSummit keynote, @const_reborn lays out the next steps towards that end state. Video  
  http://shitter.thepixora.com/opentensor/status/2104969028364329181#m
- @opentensor (Opentensor Foundation, Tue, 29 Sep 2026): Exploit Summit: Live from Montreal Day 2 shitter.thepixora.com/i/broadcasts/1NGaroOYp… Link Exploit Summit Exploit Summit: Live from Montreal Day 2 http://shitter.thepixora.com/i/broadcasts/1NGaroOYpQXJj  
  http://shitter.thepixora.com/ExploitSummit/status/2104942854753947674#m
- @rob_svrn (Rob Greer, Tue, 29 Sep 2026): Very excited crowd at Exploit. For those that missed, here is a break down of what I announced on stage.  
  http://shitter.thepixora.com/const_reborn/status/2104904084054777917#m
- @oroagents (Oro, Tue, 29 Sep 2026): Commerce is going to prove to be one of the largest opportunities in the agent world. Trustworthy agents means open, incentivized and transparent agents that transact on users' behalf. great article by @CrucibleLabs. Let's make this future happen the right way. Crucible Labs (@CrucibleLabs) Article a BIT of Joy: Issue 11 The Agent Era Is Here For the last few years, the AI industry has talked about agents as the next big thing. At this point, the more interesting question isn&apos;t when agents arrive. They&apos;re already — http://shitter.thepixora.com/CrucibleLabs/status/2103188134238564440#  
  http://shitter.thepixora.com/oroagents/status/2104794483745587425#m
- @oroagents (Oro, Tue, 22 Sep 2026): We're excited to announce ORO Bench today, a benchmark that's powered by a generator creating new synthetic shopping environments everyday. This is now powering our subnet on Bittensor, SN15. Video  
  http://shitter.thepixora.com/oroagents/status/2102475717367963815#m
- @jaltucher (James Altucher, Tue, 22 Sep 2026): Welcome to Bittensor. Here's why you should stay and diamond-hand $TAO.  
  http://shitter.thepixora.com/taodaily_io/status/2102390629422567556#m
- @mcjkula (mcjkula, Tue, 14 Apr 2026): See you in Montréal everyone. Not gonna want to miss this one🫡 Exploit Summit (@ExploitSummit) Building on Bittensor is hard. Doing it in isolation is even harder. Exploit puts you in a room with: • The subnet founders who've already solved your problems • The investors actually writing checks • The technical talent you're trying to hire Sept 28-29, Montréal. Two days that could save you six months. Video — http://shitter.thepixora.com/ExploitSummit/status/2044100822750114215#m  
  http://shitter.thepixora.com/mcjkula/status/2044123923088830837#m
- @mcjkula (mcjkula, Tue, 01 Sep 2026): TAOApp Wallet is here. The self-custody browser wallet for Bittensor. Hold TAO, stake TAO, buy subnet tokens. When there’s more to protect, bring in your Ledger, proxies and multisigs. Install the beta, on Chrome, Brave and Edge. ↓ chromewebstore.google.com/de…  
  http://shitter.thepixora.com/taoapp_/status/2094840222441992209#m
- @_redteam_ (RedTeam / Innerworks, Thu, 27 Aug 2026): The Immune System for the Internet. Releasing next month. Oscar Hayek (@oscar_hayek) Defence in this era must be AI driven, the absolute baseline is adapting defences faster than attacks are being produced. Anything slower than this leaves you in a constant state of degradation. What we’ve built on @_redteam_ is an immune system for this problem. The attacks we ingest are evolved inside the system into complete novel vectors that cannot be produced anywhere else. Every one of these gets patched before an external attacker has the means/ability to create it, let alone release it. bittensor:nati  
  https://nitter.kareem.one/_redteam_/status/2093081017145847826#m
- @manakoai (Manako, Thu, 24 Sep 2026): next batch of stations to be deployed with @manakoai is going to allow us to leverage a lot more @webuildscore models. - 4 motorway stations. beasts with 40+ cameras each. - that’s 10x more cameras than on unmanned stations. - massive fuel forecourts, EV charging bays, car wash, restaurants, supermarkets, coffee areas. the second best news… is it’s with a new signed client 👀  
  http://shitter.thepixora.com/arnod3f/status/2103174097522098609#m
- @manakoai (Manako, Thu, 24 Sep 2026): Same week, different rooms, same vision Paris ✅ London ✅ Next?  
  http://shitter.thepixora.com/manakoai/status/2103148213645558030#m
- @_redteam_ (RedTeam / Innerworks, Thu, 10 Sep 2026): I am pleased to announce that Stillcore Capital @stillcorecap has invested in Red Team @_redteam_ Bittensor $TAO Subnet 61.  
  https://nitter.kareem.one/markjeffrey/status/2098171401152971021#m
- @VantaTrading (Vanta, Thu, 01 Oct 2026): boss man says we need instant funded accounts should we do it? let us know ⬇️ Arrash (@0xarrash) I think we need direct to funded, with the ability to grow to $1M on @VantaTrading. What do you guys think? 🤔 — https://nitter.kareem.one/0xarrash/status/2105788070826238175#m  
  https://nitter.kareem.one/VantaTrading/status/2105792854287388991#m
- @VantaTrading (Vanta, Thu, 01 Oct 2026): Here's the part people miss about a $1,000,000 Vanta Pro account: through Grow your rewards pay double. Your Pro return is applied to your Classic account size, then doubled. 1% on a $100,000 pays $2,000. vantatrading.io/pro  
  https://nitter.kareem.one/VantaTrading/status/2105757146617102550#m
- @const_reborn (Jacob Steeves, Thu, 01 Oct 2026): First, why it's possible at all. Most distributed training is data parallel, so every machine holds the whole model and size is capped by one machine. iota is pipeline parallel: each machine holds a slice, so model size scales with the network.  
  https://nitter.kareem.one/MacrocosmosAI/status/2105715636152492296#m
- @jaltucher (James Altucher, Thu, 01 Oct 2026): JAS: @jaltucher x @BillOReilly on Brokering a Trump-Biden Hostage Discussion, Media Bias, and Confronting America . 00:00 Hostage Deal Setup 00:57 Health Check and New Book 02:40 Behind the Scenes Gaza Talks 04:48 Iran Strategy and Midterms 07:04 Why Media Skews Negative 09:56 Opinion TV and Press Power 12:49 Blackballed Authors and CNN 14:47 NYC Politics and Populism 17:31 Sponsor Break PrizePicks 18:53 Totalitarian History Lessons 22:02 Mamdani Economics Breakdown 24:10 Soros and Soft on Crime DAs 25:49 Life After Fox No Spin News 28:44 Legacy Drive and Farewell Video  
  http://shitter.thepixora.com/jay_yow07/status/2105699964726792421#m
- @1inch (1inch, Thu, 01 Oct 2026): September round up ⬇️ Tokenization: → Passed $7B in total tokenized asset volume → Day 1 support of Ondo Intelligent Portfolios. Institutional strategies powered by BlackRock. New Chains: →@Monad, HyperEVM, and @CronosNetwork launched in two days → Live on @arc from day 1 Aqua: → Crossed $3B in volume. October’s looking pretty big too 👀 Video  
  http://shitter.thepixora.com/1inch/status/2105693650965451030#m
- @VantaTrading (Vanta, Thu, 01 Oct 2026): i think i see a $1,000,000 Vanta account @0xarrash pretty cool, and a great lesson in risk management maybe everyone should trade like this 👀 Arrash (@0xarrash) an update on my account. Currently up $22k but here's the thing, I never risked more than 20% of my account size on any position. Meaning, my max position size has been less than &lt;$200k. My max drawdown is 0.6%. My calmar is ~4. That is what Vanta provides. A way for you to not blow your account taking wild swings, show your ability to risk manage while getting paid handsomely. The entire prop model has moved to taking max risk hopi  
  https://nitter.kareem.one/VantaTrading/status/2105686376851337630#m
- @VantaTrading (Vanta, Thu, 01 Oct 2026): one of the coolest things i've learned about Vanta? we don't reduce your balance as you grow your funded account. that means you only really need to worry about the daily loss limit if you're profitable. static drawdown moves out of the picture pretty quickly. haven't seen any other firms do this.... - the VT intern  
  https://nitter.kareem.one/VantaTrading/status/2105677881850335674#m
- @1inch (1inch, Thu, 01 Oct 2026): Live now: Beyond the Chart at EASYCON Seoul 🧡 Suzanne Pace (@SantimentData) moderates Sarah Kwon (@babylonlabs_io), Cecilia Zhang (@aomi_labs) and Olaf Kudin (@1inch). What makes a Web3 product easier to understand, trust and use?  
  http://shitter.thepixora.com/Coiniseasy/status/2105596480002363598#m
- @1inch (1inch, Thu, 01 Oct 2026): Beyond the Chart, today in Seoul. A conversation on products, trust and community with @SantimentData, @babylonlabs_io, @aomi_labs and @1inch. Oct 1 · 18:30–19:00 KST Cafe en Travel, Gangnam RSVP: luma.com/EASYSeoul2026  
  http://shitter.thepixora.com/Coiniseasy/status/2105533522333368829#m
- @jaltucher (James Altucher, Sat, 26 Sep 2026): bittensor:native will change your life. 🫶  
  http://shitter.thepixora.com/taodaily_io/status/2103816843806879925#m
- @mcjkula (mcjkula, Sat, 19 Sep 2026): Bittensor took me a while to understand. I want to make that first step easier for the next person. We’ll be kicking things off with Bittensor 101 at Exploit. Looking forward to meeting some of you for the first time and catching up with familiar faces. 👋 Exploit Summit (@ExploitSummit) Maciej Kula ( @mcjkula ) couldn't find a clear way to learn #Bittensor from scratch, so he built the resource he wished existed. @learnbittensor is now part of @latentholdings, where Maciej leads education and makes Bittensor easier to understand. He'll be leading our Bittensor 101 session to kick off Day 1: lu  
  http://shitter.thepixora.com/mcjkula/status/2101424763344437495#m
- @mcjkula (mcjkula, Sat, 19 Sep 2026): Maciej Kula ( @mcjkula ) couldn't find a clear way to learn #Bittensor from scratch, so he built the resource he wished existed. @learnbittensor is now part of @latentholdings, where Maciej leads education and makes Bittensor easier to understand. He'll be leading our Bittensor 101 session to kick off Day 1: luma.com/nqy2n5zi Video  
  http://shitter.thepixora.com/ExploitSummit/status/2101355676325007652#m
- @shibshib89 (Ala Shaabana, Mon, 28 Sep 2026): Bittensor and Baguettes is ready for her interviews @ExploitSummit. See what subnets we’re chatting about soon!  
  http://shitter.thepixora.com/CrucibleLabs/status/2104684600291180752#m
- @oroagents (Oro, Mon, 28 Sep 2026): “Every day we are changing our incentive mechanism.” @oroagents keeps its miners facing fresh challenges. At Exploit, Shardul Bansal explained how a catalog of 11 million products becomes new tasks and evaluation environments every day, keeping the competition moving as AI models improve. Video  
  http://shitter.thepixora.com/ExploitSummit/status/2104667461517713663#m
- @oroagents (Oro, Mon, 28 Sep 2026): Accelerating development at ORO Seth Schilbe (@ironseth_s) PSA: Your CLAUDE.md is probably the problem, not the models. I audited my Claude Code memory after using it for 9 months since Opus 4.5. **49 of 260 entries contradicted our current code**. Memory had become a second copy of team knowledge outside our normal review process. So I ran ~270 tests to see what my config actually did. — http://shitter.thepixora.com/ironseth_s/status/2104645444169334831#m  
  http://shitter.thepixora.com/oroagents/status/2104656457237209371#m
- @_redteam_ (RedTeam / Innerworks, Mon, 28 Sep 2026): "We're not afraid of hyper-intelligent bot swarms on the internet. We use them to optimise our technology." When we launched RedTeam almost two years ago we could clearly see where the internet was heading. We've since seen clients with over 90% of their traffic made up of not just automation but highly intelligent bot swarms, capable of bypassing any traditional detection mechanism. The only way to combat a threat like this is to welcome it and learn from it. By constantly ingesting and evolving attack vectors from a hive mind of miners, a Bittensor powered defence has now become the only rel  
  https://nitter.kareem.one/_redteam_/status/2104643110911533312#m
- @manakoai (Manako, Mon, 21 Sep 2026): And this, ladies and gentlemen, is our Head of Forward Deployed Engineering Arno (@arnod3f) just got back home after deploying @manakoai on 15 stations alongside @MaxSebti these last 3 days. I’m now convinced of three things: 1. our team is outstanding. elite people in all departments, constantly delivering, week in, week out. 2. our founders, the three of them, are delusional ambitious hard core operators. some of the toughest mfers, and, at the same time, most beautiful human beings you’ll meet. 3. our window of opportunity is exceptional. we have a shot at bringing to market a technology ca  
  http://shitter.thepixora.com/manakoai/status/2102106546532462654#m


---
_Generated at 2026-10-02T10:15:20.181520+00:00 by scripts/intel/aggregate.py. Treat this digest as input context, not as ground truth. Verify before quoting._
