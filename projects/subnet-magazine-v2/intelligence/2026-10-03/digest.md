# Intelligence Digest, 2026-10-03

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

- **Subtensor (chain)** (COMMIT `f87cada`, 2026-10-03 22:13) Merge pull request #3208 from RaoFoundation/release-473  
  https://github.com/RaoFoundation/subtensor/commit/f87cada631f81d11683e715a9f059f693992e64a
- **Subtensor (chain)** (COMMIT `fe45599`, 2026-10-03 21:20) fix clone fee fixture stability  
  https://github.com/RaoFoundation/subtensor/commit/fe4559927bf56c3365fe3e15442e3f255f47da5d
- **Subtensor (chain)** (COMMIT `11b663b`, 2026-10-03 20:58) fix clone EVM fixture fees  
  https://github.com/RaoFoundation/subtensor/commit/11b663b0f79a6371e898fefbd2c8b0eef1ac2762
- **Subtensor (chain)** (COMMIT `e385739`, 2026-10-03 20:19) fix docs preview audit gate  
  https://github.com/RaoFoundation/subtensor/commit/e385739fb8d47d56b182d123ec2ee5795ca273d3
- **Subtensor (chain)** (COMMIT `6675c84`, 2026-10-03 19:49) fix generated storage binding  
  https://github.com/RaoFoundation/subtensor/commit/6675c84efc9dfc1dbdc9f594c48c9e416140d753
- **Subtensor (chain)** (COMMIT `f5c3aaf`, 2026-10-03 00:32) fix cargo fmt and test fixtures  
  https://github.com/RaoFoundation/subtensor/commit/f5c3aaff4bd4215a211f4e8f69194893f73435a1
- **Subtensor (chain)** (COMMIT `fbe2195`, 2026-10-03 00:17) test: update registration fixture funding  
  https://github.com/RaoFoundation/subtensor/commit/fbe21953b5ccca01951cee7474f10361de1becda
- **Subtensor (chain)** (COMMIT `5d34bf9`, 2026-10-02 23:56) Merge pull request #3203 from RaoFoundation/automate-mainnet-release  
  https://github.com/RaoFoundation/subtensor/commit/5d34bf949ad4eb9d1a18620692bbe7c0e82d348b
- **Subtensor (chain)** (COMMIT `4e4329e`, 2026-10-02 23:55) Merge pull request #3209 from RaoFoundation/feat/cleanup-staking-hotkeys  
  https://github.com/RaoFoundation/subtensor/commit/4e4329e49130a140f4ff3f95767ea35330f031e2
- **Subtensor (chain)** (COMMIT `4774259`, 2026-10-02 22:46) Align registration accounting  
  https://github.com/RaoFoundation/subtensor/commit/47742598185b9adc900fe5fcae4da96902f19b6c

## ⊕ ECOSYSTEM BLOGS via RSS

_no new posts in the lookback window_

## ⊕ X via NITTER, voices we track

- @opentensor (Opentensor Foundation, Wed, 30 Sep 2026): Bitcoin used incentives to build the world’s largest specialized compute network. Bittensor is applying that same playbook to unite spare compute across the planet and build the world’s largest decentralized AI training network. Macrocosmos (@MacrocosmosAI) Just announced earlier today at @ExploitSummit in Montreal: the iota SDK and Liquid Compute. Liquid Compute is our disaggregated compute platform. It turns the long tail of global compute into capacity you can actually train on. The iota SDK powers any training workload across it, as if it were one cluster. We go to market in the coming wee  
  http://nitter.meowing.monster/opentensor/status/2105410895220220032#m
- @BarrySilbert (Barry Silbert, Wed, 30 Sep 2026): Excited for the great conversations to come at @token2049 in Singapore next week. Always great to catch up with our @DCGco backed founders and investors, and meet with new talent building in web3 and AI. We invest across the full stack and are always eager to learn, exchange views on the market and anything in between. Hit us up. DM’s open! cc: @aaronqfu @anna_brth @sterley_bird @notjk  
  http://shitter.thepixora.com/gustavo_xAM/status/2105410142191648866#m
- @rob_svrn (Rob Greer, Wed, 30 Sep 2026): Today, the Kusanagi team visited MIT’s @medialab to present Bittensor. We met with the lab’s leadership and researchers for initial discussions about a potential partnership between @MIT and the wider Bittensor ecosystem through @opentensor. Let’s make TAO win.  
  https://nitter.kareem.one/kusanagi_vntrs/status/2105398290107798012#m
- @TargonCompute (Targon, Wed, 30 Sep 2026): NEWS: @TargonCompute says NVIDIA B300 GPUs are now available on demand on Targon. This adds an on-demand Blackwell deployment option. Targon (@TargonCompute) NVIDIA B300s are now available on demand. Secure GPUs are selling out fast on Targon, Ready to deploy on Blackwell? Grab yours now at targon.com/inventory — http://shitter.thepixora.com/TargonCompute/status/2105325236639973561#m  
  http://shitter.thepixora.com/taodotcom/status/2105392902587249005#m
- @TargonCompute (Targon, Wed, 30 Sep 2026): NEWS: @TargonCompute says NVIDIA B300 GPUs are now available on demand on Targon. This adds an on-demand Blackwell deployment option. Targon (@TargonCompute) NVIDIA B300s are now available on demand. Secure GPUs are selling out fast on Targon, Ready to deploy on Blackwell? Grab yours now at targon.com/inventory — http://nitter.meowing.monster/TargonCompute/status/2105325236639973561#m  
  http://nitter.meowing.monster/taodotcom/status/2105392902587249005#m
- @a16zcrypto (a16z Crypto, Wed, 30 Sep 2026): New markets have changed what people can trade and how. In the last decade, blockchains have started lowering the cost of building markets, making it easier to experiment with net new ones.  
  http://nitter.meowing.monster/a16zcrypto/status/2105372522967708073#m
- @galaxyhq (Galaxy Digital, Wed, 30 Sep 2026): Galaxy is glad to have taken part in the inaugural Digital Assets Leadership Forum this week, hosted by Daman Virtual in partnership with the Dubai Department of Economy and Tourism. Managing Director, Bouchra Darwazah, who also serves as CEO of Galaxy Digital MENA, joined a panel alongside voices from government, regulation, banking and financial services to discuss where Dubai's digital asset ecosystem is heading next. We're looking forward to more of these conversations as the UAE’s digital asset market continues to scale.  
  https://nitter.kareem.one/galaxyhq/status/2105369944560972017#m
- @galaxyhq (Galaxy Digital, Wed, 30 Sep 2026): Galaxy is glad to have taken part in the inaugural Digital Assets Leadership Forum this week, hosted by Daman Virtual in partnership with the Dubai Department of Economy and Tourism. Managing Director, Bouchra Darwazah, who also serves as CEO of Galaxy Digital MENA, joined a panel alongside voices from government, regulation, banking and financial services to discuss where Dubai's digital asset ecosystem is heading next. We're looking forward to more of these conversations as the UAE’s digital asset market continues to scale.  
  http://nitter.meowing.monster/galaxyhq/status/2105369944560972017#m
- @dylan522p (Dylan Patel, Wed, 30 Sep 2026): A lot of people tell me they use agents to build xyz Thing is, some people have an accent or say it quickly And so I hear we use Asians to build xyz Which is like... Well ya that's been the global economy for the last few decades.  
  http://nitter.meowing.monster/dylan522p/status/2105367125611237551#m
- @jtledore (Jean-Thomas Ledoré, Wed, 30 Sep 2026): Demand for AI compute is growing far faster than the infrastructure being built to serve it. Sam Altman's stated goal for OpenAI is 250 GW by 2033, roughly a quarter of US generating capacity. If the trend holds, Epoch AI puts a single frontier training run at 4 to 16 GW.  
  http://shitter.thepixora.com/MacrocosmosAI/status/2105360787145667021#m
- @jtledore (Jean-Thomas Ledoré, Wed, 30 Sep 2026): Demand for AI compute is growing far faster than the infrastructure being built to serve it. Sam Altman's stated goal for OpenAI is 250 GW by 2033, roughly a quarter of US generating capacity. If the trend holds, Epoch AI puts a single frontier training run at 4 to 16 GW.  
  https://nitter.kareem.one/MacrocosmosAI/status/2105360787145667021#m
- @polychain (Polychain Capital, Wed, 30 Sep 2026): THE BLOCK: DogeOS launched a public testnet for its zero-knowledge rollup, bringing EVM smart contracts to Dogecoin, with dogecoin:native used for gas fees. "I've spent half a decade encouraging people to take a chance on Dogecoin and to build in its ecosystem," said Timothy Stebbing, director of the Dogecoin Foundation. "My hopes are that DogeOS becomes the springboard for a wave of new utility engineering."  
  https://nitter.kareem.one/TheBlockCo/status/2105359920795394451#m
- @polychain (Polychain Capital, Wed, 30 Sep 2026): THE BLOCK: DogeOS launched a public testnet for its zero-knowledge rollup, bringing EVM smart contracts to Dogecoin, with dogecoin:native used for gas fees. "I've spent half a decade encouraging people to take a chance on Dogecoin and to build in its ecosystem," said Timothy Stebbing, director of the Dogecoin Foundation. "My hopes are that DogeOS becomes the springboard for a wave of new utility engineering."  
  http://shitter.thepixora.com/TheBlockCo/status/2105359920795394451#m
- @polychain (Polychain Capital, Wed, 30 Sep 2026): THE BLOCK: DogeOS launched a public testnet for its zero-knowledge rollup, bringing EVM smart contracts to Dogecoin, with dogecoin:native used for gas fees. "I've spent half a decade encouraging people to take a chance on Dogecoin and to build in its ecosystem," said Timothy Stebbing, director of the Dogecoin Foundation. "My hopes are that DogeOS becomes the springboard for a wave of new utility engineering."  
  http://nitter.meowing.monster/TheBlockCo/status/2105359920795394451#m
- @opentensor (Opentensor Foundation, Wed, 30 Sep 2026): “We need to make the Linux of AI.” @jon_durbin of @chutes_ai presented an 8B model trained across distributed gaming GPUs for roughly $6,500 in GPU rental. It runs entirely on a phone’s CPU at nearly 60 tokens per second. His full @ExploitSummit keynote explains how open-source development and decentralized training could give people control over AI from its creation to its everyday use. Video  
  http://nitter.meowing.monster/opentensor/status/2105353248836362289#m
- @rob_svrn (Rob Greer, Wed, 30 Sep 2026): What neXt after Al? - Superintelligence - AGI-level humanoid robots - Affordable space tourism - Artificial wombs - Atomic-scale manufacturing - Abundant energy, food, and ATP - Personal superintelligent assistants (MAO) - Anti-aging and personalized treatments for every disease - Full automation of scientific and technological discoveries - Net-zero carbon emissions, clean air, and minimal pollution - BCIs and advanced brain-computer interfaces that can take action based on thoughts - Flying vehicles and autonomous cities and so much more... And eventually, technologies that today sound like   
  https://nitter.kareem.one/SciTechera/status/2105337896110821386#m
- @taomedia_ (TAO Media, Wed, 30 Sep 2026): tao.media/figure-decommissio… Link Figure Decommissions F.02 Fleet by Melting Robots in Finland With Arnold Schwarzenegger As F.03 scales, Figure retired its F.02 humanoids by melting them in a Finnish electric-arc furnace, with Arnold Schwarzenegger involved, and is machining the metal into limited commemorative... tao.media  
  https://nitter.kareem.one/taomedia_/status/2105334552319172678#m
- @dylan522p (Dylan Patel, Wed, 30 Sep 2026): Can't invest in Anthropic at 2 trillion because it could be a 0 and I'm fucked, or it could be 20 trillion, but at 20 trillion we are all fucked.  
  http://nitter.meowing.monster/dylan522p/status/2105334504726692035#m
- @rob_svrn (Rob Greer, Wed, 30 Sep 2026): Through our distributed compute market, we have just onboarded 10x B300 nodes We are making them available on demand to help give smaller teams access to the latest hardware without having to sign a multi-year contract You can rent as little as 1x node! Link to rent is below  
  https://nitter.kareem.one/jameswoodmanv/status/2105332561841099001#m
- @TargonCompute (Targon, Wed, 30 Sep 2026): NVIDIA B300s are now available on demand. Secure GPUs are selling out fast on Targon, Ready to deploy on Blackwell? Grab yours now at targon.com/inventory  
  http://shitter.thepixora.com/TargonCompute/status/2105325236639973561#m
- @TargonCompute (Targon, Wed, 30 Sep 2026): NVIDIA B300s are now available on demand. Secure GPUs are selling out fast on Targon, Ready to deploy on Blackwell? Grab yours now at targon.com/inventory  
  http://nitter.meowing.monster/TargonCompute/status/2105325236639973561#m
- @taomedia_ (TAO Media, Wed, 30 Sep 2026): JUST IN: @Figure_robot melts down humanoids @Schwarzenegger - "F.02 has been decommissioned" Video Figure (@Figure_robot) F.02 Decommission Video — http://shitter.thepixora.com/Figure_robot/status/2105316680251650555#m  
  http://shitter.thepixora.com/taomedia_/status/2105325043173707903#m
- @opentensor (Opentensor Foundation, Wed, 30 Sep 2026): This Thursday on Novelty Search :: Subnet 80 :: @openroboto OpenRoboto is building an open competition for robot intelligence on Bittensor, where miners improve shared base models and each champion becomes the next starting point. They are now expanding into real robot validation and Shift, their decentralized network for collecting real world robotics data, connecting model improvement with physical data and commercial demand. Thursday :: 5PM EDT / 9PM UTC Hosted by @const_reborn  
  http://nitter.meowing.monster/opentensor/status/2105322199787700284#m
- @jaltucher (James Altucher, Wed, 30 Sep 2026): MY TOP 10. I love TV. I worked at HBO (in the 90s). I've been an advisor for shows ("Billions"), I've pitched shows to every studio. Here's my top 10. I've watched each of these at least 4 times. BUT...what should #10 be?? 1) Breaking Bad 2) Mad Men 3) Lost 4) Carnevale 5) Battlestar Galactica 6) Better Call Saul 7) Arrested Devekooment 8) Sopranos 9) Curb Your Enthusiasm  
  http://nitter.meowing.monster/jaltucher/status/2105314083108974777#m
- @jaltucher (James Altucher, Wed, 30 Sep 2026): MY TOP 10. I love TV. I worked at HBO (in the 90s). I've been an advisor for shows ("Billions"), I've pitched shows to every studio. Here's my top 10. I've watched each of these at least 4 times. BUT...what should #10 be?? 1) Breaking Bad 2) Mad Men 3) Lost 4) Carnevale 5) Battlestar Galactica 6) Better Call Saul 7) Arrested Devekooment 8) Sopranos 9) Curb Your Enthusiasm  
  http://shitter.thepixora.com/jaltucher/status/2105314083108974777#m
- @PanteraCapital (Pantera Capital, Wed, 30 Sep 2026): The next evolution of tokenization is here. Pantera’s latest State of Tokenization report highlights Ondo Intelligent Portfolios as the next step beyond individual tokenized stocks. “An entire portfolio becomes a single transferable token.” What this delivers: → DeFi composability → Multiple assets in one holding → Scheduled rebalancing via smart contracts With its first three portfolios powered by BlackRock, Ondo Intelligent Portfolios brings institutional investment strategies onchain. The next chapter of tokenization will expand what investors can access, how they build portfolios, and how   
  http://nitter.meowing.monster/Ondo/status/2105305938945057014#m
- @PanteraCapital (Pantera Capital, Wed, 30 Sep 2026): The next evolution of tokenization is here. Pantera’s latest State of Tokenization report highlights Ondo Intelligent Portfolios as the next step beyond individual tokenized stocks. “An entire portfolio becomes a single transferable token.” What this delivers: → DeFi composability → Multiple assets in one holding → Scheduled rebalancing via smart contracts With its first three portfolios powered by BlackRock, Ondo Intelligent Portfolios brings institutional investment strategies onchain. The next chapter of tokenization will expand what investors can access, how they build portfolios, and how   
  http://shitter.thepixora.com/Ondo/status/2105305938945057014#m
- @PanteraCapital (Pantera Capital, Wed, 30 Sep 2026): Issuing tokens onchain is now straightforward. Building liquid, compliant markets is the next step. Our CEO @doctorfission argues once fund positions can be sold on demand and used as collateral, they become fundamentally more useful. Read his full take in the Pantera report. Pantera Capital (@PanteraCapital) Pantera's latest State of Tokenization report is out. We analyzed the $332bn tokenization market across 671 assets. Institutions entered in force this quarter. J.P. Morgan, HSBC and Fidelity launched onchain products. BlackRock's BUIDL moved $441mn onchain in June, runs a $1bn daily redem  
  http://nitter.meowing.monster/FissionXYZ/status/2105303373503418762#m
- @PanteraCapital (Pantera Capital, Wed, 30 Sep 2026): Issuing tokens onchain is now straightforward. Building liquid, compliant markets is the next step. Our CEO @doctorfission argues once fund positions can be sold on demand and used as collateral, they become fundamentally more useful. Read his full take in the Pantera report. Pantera Capital (@PanteraCapital) Pantera's latest State of Tokenization report is out. We analyzed the $332bn tokenization market across 671 assets. Institutions entered in force this quarter. J.P. Morgan, HSBC and Fidelity launched onchain products. BlackRock's BUIDL moved $441mn onchain in June, runs a $1bn daily redem  
  http://shitter.thepixora.com/FissionXYZ/status/2105303373503418762#m
- @galaxyhq (Galaxy Digital, Wed, 30 Sep 2026): NVIDIA Vera Rubin NVL72 is available on CoreWeave. @Cognition is running @devindevelopers in production on it, at up to 4.8x the total token throughput of GB200 NVL72. V100 in 2017. Vera Rubin today. Same platform, every generation. crwv.co/utcq5  
  https://nitter.kareem.one/CoreWeave/status/2105288849719194040#m
- @galaxyhq (Galaxy Digital, Wed, 30 Sep 2026): NVIDIA Vera Rubin NVL72 is available on CoreWeave. @Cognition is running @devindevelopers in production on it, at up to 4.8x the total token throughput of GB200 NVL72. V100 in 2017. Vera Rubin today. Same platform, every generation. crwv.co/utcq5  
  http://nitter.meowing.monster/CoreWeave/status/2105288849719194040#m
- @BarrySilbert (Barry Silbert, Wed, 30 Sep 2026): Excited to welcome Kimberly Pittman to Fortitude as our CLO. Kim is an experienced legal and strategic leader who we believe will be an important addition to our executive leadership team as we aim to continue to scale @FortitudeCrypto and prepare for our proposed business combination with HeartSciences Inc. (Nasdaq:HSCS). Welcome to the team Kim! Fortitude (@FortitudeCrypto) Fortitude is pleased to welcome Kimberly Pittman as Chief Legal Officer. Pittman joins Fortitude’s executive leadership team as the Company prepares for its previously announced proposed business combination with @HeartSc  
  http://shitter.thepixora.com/JaimeLeverton/status/2105282728811717025#m
- @dylan522p (Dylan Patel, Wed, 30 Sep 2026): AI is making papers cheaper to produce. ICLR submissions: 4,938 (2023), 7,262 (2024), 11,603 (2025), 19,525 (2026). Reported 2027 IDs exceed 62K, above roughly 56K paper submissions in all previous years COMBINED. Can reviewers keep up? (1/6)🧵  
  http://nitter.meowing.monster/SemiAnalysis_/status/2105130561530421342#m
- @polychain (Polychain Capital, Wed, 24 Jun 2026): EXCLUSIVE: a16z CSX-backed Cambrian raises $6 million seed to build blockchain data oracle network theblock.co/post/406028/a16z… Link a16z CSX-backed Cambrian raises $6 million seed to build blockchain data oracle network Cambrian’s new funding will expand its API and verifiable oracle network for institutions and AI agents, with Base and Solana already in production. theblock.co  
  https://nitter.kareem.one/TheBlockCo/status/2069827932843909349#m
- @polychain (Polychain Capital, Wed, 24 Jun 2026): EXCLUSIVE: a16z CSX-backed Cambrian raises $6 million seed to build blockchain data oracle network theblock.co/post/406028/a16z… Link a16z CSX-backed Cambrian raises $6 million seed to build blockchain data oracle network Cambrian’s new funding will expand its API and verifiable oracle network for institutions and AI agents, with Base and Solana already in production. theblock.co  
  http://shitter.thepixora.com/TheBlockCo/status/2069827932843909349#m
- @polychain (Polychain Capital, Wed, 24 Jun 2026): EXCLUSIVE: a16z CSX-backed Cambrian raises $6 million seed to build blockchain data oracle network theblock.co/post/406028/a16z… Link a16z CSX-backed Cambrian raises $6 million seed to build blockchain data oracle network Cambrian’s new funding will expand its API and verifiable oracle network for institutions and AI agents, with Base and Solana already in production. theblock.co  
  http://nitter.meowing.monster/TheBlockCo/status/2069827932843909349#m
- @novogratz (Mike Novogratz, Wed, 23 Sep 2026): Thanks for making the trip to Lubbock, Mike — and for spending time with our Red Raider football team ahead of the game. Great to have you at @TexasTech, and even better to cap off the visit with a big win at the new @galaxyhq Stadium. This partnership is just getting started. #WreckEm! Mike Novogratz (@novogratz) Last Friday, I visited our flagship campus Helios in West Texas. Three years ago, this was still a bitcoin mining facility. Today Helios is a fully operational AI-ready campus with 133MW of critical IT capacity, and we’re just getting started! @galaxyhq is taking a big swing out here  
  http://shitter.thepixora.com/CreightonForTX/status/2102869773776269419#m
- @novogratz (Mike Novogratz, Wed, 23 Sep 2026): Thanks for making the trip to Lubbock, Mike — and for spending time with our Red Raider football team ahead of the game. Great to have you at @TexasTech, and even better to cap off the visit with a big win at the new @galaxyhq Stadium. This partnership is just getting started. #WreckEm! Mike Novogratz (@novogratz) Last Friday, I visited our flagship campus Helios in West Texas. Three years ago, this was still a bitcoin mining facility. Today Helios is a fully operational AI-ready campus with 133MW of critical IT capacity, and we’re just getting started! @galaxyhq is taking a big swing out here  
  http://nitter.meowing.monster/CreightonForTX/status/2102869773776269419#m
- @manakoai (Manako, Wed, 23 Sep 2026): USA ⏭️ Max (@MaxSebti) just flashed the first few @manakoai boxes that will be deployed in the US — http://shitter.thepixora.com/MaxSebti/status/2102842552827412624#m  
  http://shitter.thepixora.com/manakoai/status/2102843727048024497#m
- @manakoai (Manako, Wed, 23 Sep 2026): USA ⏭️ Max (@MaxSebti) just flashed the first few @manakoai boxes that will be deployed in the US — https://nitter.kareem.one/MaxSebti/status/2102842552827412624#m  
  https://nitter.kareem.one/manakoai/status/2102843727048024497#m
- @tplr_ai (Templar, Wed, 23 Sep 2026): Video  
  http://shitter.thepixora.com/tplr_ai/status/2102792674118164542#m
- @tplr_ai (Templar, Wed, 23 Sep 2026): Read the blog: tplr.ai/publications/blog/sk… Link Fault tolerance in low-bandwidth model parallelism: exploring pipeline stage-skipping with boundary... We explore how the residual nature of the transformer architecture can be leveraged to mitigate hardware faults, and demonstrate that the compression-based implementation of low-bandwidth model... tplr.ai  
  http://shitter.thepixora.com/tplr_ai/status/2102792676676432160#m
- @novogratz (Mike Novogratz, Wed, 23 Sep 2026): Last Friday, I visited our flagship campus Helios in West Texas. Three years ago, this was still a bitcoin mining facility. Today Helios is a fully operational AI-ready campus with 133MW of critical IT capacity, and we’re just getting started! @galaxyhq is taking a big swing out here, and so is America. The move to build an AI future for this country is real, and none of it happens without the physical infrastructure. It starts with power, land, and hard-working people willing to put in the work to build a new future. Our partnership with @TechAthletics with Galaxy Stadium is part of investing  
  http://shitter.thepixora.com/novogratz/status/2102773522292428868#m
- @novogratz (Mike Novogratz, Wed, 23 Sep 2026): Last Friday, I visited our flagship campus Helios in West Texas. Three years ago, this was still a bitcoin mining facility. Today Helios is a fully operational AI-ready campus with 133MW of critical IT capacity, and we’re just getting started! @galaxyhq is taking a big swing out here, and so is America. The move to build an AI future for this country is real, and none of it happens without the physical infrastructure. It starts with power, land, and hard-working people willing to put in the work to build a new future. Our partnership with @TechAthletics with Galaxy Stadium is part of investing  
  http://nitter.meowing.monster/novogratz/status/2102773522292428868#m
- @covenant_ai (Covenant AI, Wed, 19 Aug 2026): RT @tplr_ai: ByteDance and Tencent each received 10,000 Nvidia H200 chips, the first big delivery after China eased import limits. Watch w…  
  http://nitter.meowing.monster/covenant_ai/status/2090092134036648101#m
- @covenant_ai (Covenant AI, Wed, 19 Aug 2026): ByteDance and Tencent each received 10,000 Nvidia H200 chips, the first big delivery after China eased import limits. Watch what this does to the map. New compute lands in new regions. Supply chains stretch across borders. One export policy shift decides who can train what. None of that touches how a run schedules across nodes. Templar treats heterogeneous, cross-geography compute as the normal case. Runs that adapt to whichever nodes are open still finish when the supply picture moves. Financial Times (@FT) China eases limits on Nvidia H200 chips as AI race escalates ft.trib.al/B7WRmPI Link C  
  https://nitter.kareem.one/tplr_ai/status/2090069281270608148#m
- @shibshib89 (Ala Shaabana, Wed, 16 Sep 2026): LFG! Crucible Labs (@CrucibleLabs) Crucible Wallet Extension v2.1.1 is LIVE. This isn’t just an update. We rebuilt the entire wallet experience from the ground up. A completely new UI. More control over your TAO. More Bittensor tools built directly into your wallet. What’s new in v2.1.1: ✔️Completely updated UI + light/dark mode ✔️Claim rewards directly in the wallet ✔️Unified balance across TAO + alpha ✔️Universal Swap ✔️Transfer TAO + alpha ✔️Subnet discovery + detailed subnet views ✔️Multi-address support for seed phrases ✔️12 and 24 word seed phrase support ✔️Updated Smart Account + Reward  
  http://shitter.thepixora.com/shibshib89/status/2100300168633761947#m
- @shibshib89 (Ala Shaabana, Wed, 16 Sep 2026): LFG! Crucible Labs (@CrucibleLabs) Crucible Wallet Extension v2.1.1 is LIVE. This isn’t just an update. We rebuilt the entire wallet experience from the ground up. A completely new UI. More control over your TAO. More Bittensor tools built directly into your wallet. What’s new in v2.1.1: ✔️Completely updated UI + light/dark mode ✔️Claim rewards directly in the wallet ✔️Unified balance across TAO + alpha ✔️Universal Swap ✔️Transfer TAO + alpha ✔️Subnet discovery + detailed subnet views ✔️Multi-address support for seed phrases ✔️12 and 24 word seed phrase support ✔️Updated Smart Account + Reward  
  http://nitter.meowing.monster/shibshib89/status/2100300168633761947#m
- @jaltucher (James Altucher, Wed, 16 Sep 2026): Working on an AI-powered end to end platform for designing optical and then quantum chips at $QCLS. More details and refinements later but you can check it out at VibeGDS.io - you just enter plain English for the chip you want and it will build it out, simulate, verify, etc. Of interest mostly to optical engineers.  
  http://nitter.meowing.monster/jaltucher/status/2100262449685364904#m
- @jaltucher (James Altucher, Wed, 16 Sep 2026): Working on an AI-powered end to end platform for designing optical and then quantum chips at $QCLS. More details and refinements later but you can check it out at VibeGDS.io - you just enter plain English for the chip you want and it will build it out, simulate, verify, etc. Of interest mostly to optical engineers.  
  http://shitter.thepixora.com/jaltucher/status/2100262449685364904#m


---
_Generated at 2026-10-03T22:37:42.325184+00:00 by scripts/intel/aggregate.py. Treat this digest as input context, not as ground truth. Verify before quoting._
