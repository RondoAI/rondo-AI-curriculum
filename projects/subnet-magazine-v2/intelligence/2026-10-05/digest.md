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

- @BarrySilbert (Barry Silbert, Wed, 30 Sep 2026): Excited for the great conversations to come at @token2049 in Singapore next week. Always great to catch up with our @DCGco backed founders and investors, and meet with new talent building in web3 and AI. We invest across the full stack and are always eager to learn, exchange views on the market and anything in between. Hit us up. DM’s open! cc: @aaronqfu @anna_brth @sterley_bird @notjk  
  http://shitter.thepixora.com/gustavo_xAM/status/2105410142191648866#m
- @a16zcrypto (a16z Crypto, Wed, 30 Sep 2026): New markets have changed what people can trade and how. In the last decade, blockchains have started lowering the cost of building markets, making it easier to experiment with net new ones.  
  http://nitter.meowing.monster/a16zcrypto/status/2105372522967708073#m
- @galaxyhq (Galaxy Digital, Wed, 30 Sep 2026): Galaxy is glad to have taken part in the inaugural Digital Assets Leadership Forum this week, hosted by Daman Virtual in partnership with the Dubai Department of Economy and Tourism. Managing Director, Bouchra Darwazah, who also serves as CEO of Galaxy Digital MENA, joined a panel alongside voices from government, regulation, banking and financial services to discuss where Dubai's digital asset ecosystem is heading next. We're looking forward to more of these conversations as the UAE’s digital asset market continues to scale.  
  http://nitter.meowing.monster/galaxyhq/status/2105369944560972017#m
- @dylan522p (Dylan Patel, Wed, 30 Sep 2026): A lot of people tell me they use agents to build xyz Thing is, some people have an accent or say it quickly And so I hear we use Asians to build xyz Which is like... Well ya that's been the global economy for the last few decades.  
  http://shitter.thepixora.com/dylan522p/status/2105367125611237551#m
- @dylan522p (Dylan Patel, Wed, 30 Sep 2026): A lot of people tell me they use agents to build xyz Thing is, some people have an accent or say it quickly And so I hear we use Asians to build xyz Which is like... Well ya that's been the global economy for the last few decades.  
  https://nitter.kareem.one/dylan522p/status/2105367125611237551#m
- @polychain (Polychain Capital, Wed, 30 Sep 2026): THE BLOCK: DogeOS launched a public testnet for its zero-knowledge rollup, bringing EVM smart contracts to Dogecoin, with dogecoin:native used for gas fees. "I've spent half a decade encouraging people to take a chance on Dogecoin and to build in its ecosystem," said Timothy Stebbing, director of the Dogecoin Foundation. "My hopes are that DogeOS becomes the springboard for a wave of new utility engineering."  
  http://shitter.thepixora.com/TheBlockCo/status/2105359920795394451#m
- @dylan522p (Dylan Patel, Wed, 30 Sep 2026): Can't invest in Anthropic at 2 trillion because it could be a 0 and I'm fucked, or it could be 20 trillion, but at 20 trillion we are all fucked.  
  http://shitter.thepixora.com/dylan522p/status/2105334504726692035#m
- @dylan522p (Dylan Patel, Wed, 30 Sep 2026): Can't invest in Anthropic at 2 trillion because it could be a 0 and I'm fucked, or it could be 20 trillion, but at 20 trillion we are all fucked.  
  https://nitter.kareem.one/dylan522p/status/2105334504726692035#m
- @PanteraCapital (Pantera Capital, Wed, 30 Sep 2026): The next evolution of tokenization is here. Pantera’s latest State of Tokenization report highlights Ondo Intelligent Portfolios as the next step beyond individual tokenized stocks. “An entire portfolio becomes a single transferable token.” What this delivers: → DeFi composability → Multiple assets in one holding → Scheduled rebalancing via smart contracts With its first three portfolios powered by BlackRock, Ondo Intelligent Portfolios brings institutional investment strategies onchain. The next chapter of tokenization will expand what investors can access, how they build portfolios, and how   
  https://nitter.kareem.one/Ondo/status/2105305938945057014#m
- @PanteraCapital (Pantera Capital, Wed, 30 Sep 2026): Issuing tokens onchain is now straightforward. Building liquid, compliant markets is the next step. Our CEO @doctorfission argues once fund positions can be sold on demand and used as collateral, they become fundamentally more useful. Read his full take in the Pantera report. Pantera Capital (@PanteraCapital) Pantera's latest State of Tokenization report is out. We analyzed the $332bn tokenization market across 671 assets. Institutions entered in force this quarter. J.P. Morgan, HSBC and Fidelity launched onchain products. BlackRock's BUIDL moved $441mn onchain in June, runs a $1bn daily redem  
  https://nitter.kareem.one/FissionXYZ/status/2105303373503418762#m
- @galaxyhq (Galaxy Digital, Wed, 30 Sep 2026): NVIDIA Vera Rubin NVL72 is available on CoreWeave. @Cognition is running @devindevelopers in production on it, at up to 4.8x the total token throughput of GB200 NVL72. V100 in 2017. Vera Rubin today. Same platform, every generation. crwv.co/utcq5  
  http://nitter.meowing.monster/CoreWeave/status/2105288849719194040#m
- @BarrySilbert (Barry Silbert, Wed, 30 Sep 2026): Excited to welcome Kimberly Pittman to Fortitude as our CLO. Kim is an experienced legal and strategic leader who we believe will be an important addition to our executive leadership team as we aim to continue to scale @FortitudeCrypto and prepare for our proposed business combination with HeartSciences Inc. (Nasdaq:HSCS). Welcome to the team Kim! Fortitude (@FortitudeCrypto) Fortitude is pleased to welcome Kimberly Pittman as Chief Legal Officer. Pittman joins Fortitude’s executive leadership team as the Company prepares for its previously announced proposed business combination with @HeartSc  
  http://shitter.thepixora.com/JaimeLeverton/status/2105282728811717025#m
- @dylan522p (Dylan Patel, Wed, 30 Sep 2026): AI is making papers cheaper to produce. ICLR submissions: 4,938 (2023), 7,262 (2024), 11,603 (2025), 19,525 (2026). Reported 2027 IDs exceed 62K, above roughly 56K paper submissions in all previous years COMBINED. Can reviewers keep up? (1/6)🧵  
  http://shitter.thepixora.com/SemiAnalysis_/status/2105130561530421342#m
- @dylan522p (Dylan Patel, Wed, 30 Sep 2026): AI is making papers cheaper to produce. ICLR submissions: 4,938 (2023), 7,262 (2024), 11,603 (2025), 19,525 (2026). Reported 2027 IDs exceed 62K, above roughly 56K paper submissions in all previous years COMBINED. Can reviewers keep up? (1/6)🧵  
  https://nitter.kareem.one/SemiAnalysis_/status/2105130561530421342#m
- @polychain (Polychain Capital, Wed, 24 Jun 2026): EXCLUSIVE: a16z CSX-backed Cambrian raises $6 million seed to build blockchain data oracle network theblock.co/post/406028/a16z… Link a16z CSX-backed Cambrian raises $6 million seed to build blockchain data oracle network Cambrian’s new funding will expand its API and verifiable oracle network for institutions and AI agents, with Base and Solana already in production. theblock.co  
  http://shitter.thepixora.com/TheBlockCo/status/2069827932843909349#m
- @novogratz (Mike Novogratz, Wed, 23 Sep 2026): Thanks for making the trip to Lubbock, Mike — and for spending time with our Red Raider football team ahead of the game. Great to have you at @TexasTech, and even better to cap off the visit with a big win at the new @galaxyhq Stadium. This partnership is just getting started. #WreckEm! Mike Novogratz (@novogratz) Last Friday, I visited our flagship campus Helios in West Texas. Three years ago, this was still a bitcoin mining facility. Today Helios is a fully operational AI-ready campus with 133MW of critical IT capacity, and we’re just getting started! @galaxyhq is taking a big swing out here  
  http://nitter.meowing.monster/CreightonForTX/status/2102869773776269419#m
- @manakoai (Manako, Wed, 23 Sep 2026): USA ⏭️ Max (@MaxSebti) just flashed the first few @manakoai boxes that will be deployed in the US — https://nitter.kareem.one/MaxSebti/status/2102842552827412624#m  
  https://nitter.kareem.one/manakoai/status/2102843727048024497#m
- @manakoai (Manako, Wed, 23 Sep 2026): USA ⏭️ Max (@MaxSebti) just flashed the first few @manakoai boxes that will be deployed in the US — http://shitter.thepixora.com/MaxSebti/status/2102842552827412624#m  
  http://shitter.thepixora.com/manakoai/status/2102843727048024497#m
- @tplr_ai (Templar, Wed, 23 Sep 2026): Video  
  http://nitter.meowing.monster/tplr_ai/status/2102792674118164542#m
- @tplr_ai (Templar, Wed, 23 Sep 2026): Read the blog: tplr.ai/publications/blog/sk… Link Fault tolerance in low-bandwidth model parallelism: exploring pipeline stage-skipping with boundary... We explore how the residual nature of the transformer architecture can be leveraged to mitigate hardware faults, and demonstrate that the compression-based implementation of low-bandwidth model... tplr.ai  
  http://nitter.meowing.monster/tplr_ai/status/2102792676676432160#m
- @novogratz (Mike Novogratz, Wed, 23 Sep 2026): Last Friday, I visited our flagship campus Helios in West Texas. Three years ago, this was still a bitcoin mining facility. Today Helios is a fully operational AI-ready campus with 133MW of critical IT capacity, and we’re just getting started! @galaxyhq is taking a big swing out here, and so is America. The move to build an AI future for this country is real, and none of it happens without the physical infrastructure. It starts with power, land, and hard-working people willing to put in the work to build a new future. Our partnership with @TechAthletics with Galaxy Stadium is part of investing  
  http://nitter.meowing.monster/novogratz/status/2102773522292428868#m
- @tm0klc (Tim, Wed, 17 Jun 2026): Introducing Manako, the fastest way to turn any camera into an vision ai agent. Go on manako.ai. Join our waitlist. Video  
  https://nitter.kareem.one/manakoai/status/2067298306200396197#m
- @tplr_ai (Templar, Wed, 16 Sep 2026): When using pipeline compression with fixed projections shared across layers, robustness improves further as seen in the figure below. This suggests that shared projectors align representations across stage boundaries, making bypasses less disruptive. 4/n  
  http://nitter.meowing.monster/tplr_ai/status/2100237714918367690#m
- @tplr_ai (Templar, Wed, 16 Sep 2026): We’ve been researching fault tolerance in Crucible, Templar’s pre-training platform. The goal: keep training through node failures and make better use of unreliable workers and spot instances, without idling an entire model replica when one stage goes down. 1/n Video  
  http://nitter.meowing.monster/tplr_ai/status/2100237708186550642#m
- @novogratz (Mike Novogratz, Wed, 16 Sep 2026): Our economy doesn’t work without immigration. We need at least 1.5-2mm new immigrants a year to create taxpayers and consumers to help us grow our way out of 40th in debt and to pay for an aging population. This isn’t political. It’s just math. We of course can decide what immigrants we take. From where, what educational level, wealth etc. that’s political. But the fact that we need them isn’t. Lisa Boothe (@LisaMarieBoothe) At this point, I am fine with shutting down all immigration, legal or not. It's a mess. — http://nitter.meowing.monster/LisaMarieBoothe/status/2099891080258875467#m  
  http://nitter.meowing.monster/novogratz/status/2100193741633929406#m
- @nigescore (Nige, Wed, 09 Sep 2026): .@nigescore going to paris last time he went to nrf in dallas he got us our biggest client ever (not announced yet) i can’t go. got something bigger on the 15th, 16th and 17th (to be announced) Manako (@manakoai) Heading to @nrfeurope NRF Retail’s Big Show Europe in Paris next week (15–17 Sept) 🇫🇷 If you are attending and want to hear what Manako Labs have built for retail, please DM and let’s meet up. No new hardware, no engineers, no code just your existing cameras doing more. #NRFRetailsBigShowEurope — https://nitter.kareem.one/manakoai/status/2097622722310242420#m  
  https://nitter.kareem.one/MaxSebti/status/2097630699129827589#m
- @nigescore (Nige, Wed, 09 Sep 2026): .@nigescore going to paris last time he went to nrf in dallas he got us our biggest client ever (not announced yet) i can’t go. got something bigger on the 15th, 16th and 17th (to be announced) Manako (@manakoai) Heading to @nrfeurope NRF Retail’s Big Show Europe in Paris next week (15–17 Sept) 🇫🇷 If you are attending and want to hear what Manako Labs have built for retail, please DM and let’s meet up. No new hardware, no engineers, no code just your existing cameras doing more. #NRFRetailsBigShowEurope — http://shitter.thepixora.com/manakoai/status/2097622722310242420#m  
  http://shitter.thepixora.com/MaxSebti/status/2097630699129827589#m
- @PanteraCapital (Pantera Capital, Tue, 29 Sep 2026): 📈 Tokenization is moving from simply putting assets onchain to building real, programmable capital markets. @PanteraCapital’s latest State of Tokenization report highlights several areas where @Ondo Finance is helping push that evolution forward: 📍Distribution: $USDY had the largest reported holder base among tokenized rates products, with nearly 18,000 addresses as of June 30. 📍Tokenized equities: @Ondo is highlighted across the report’s analysis of the rapidly growing onchain equity market which Ondo Finance continues to lead. 📍Perps: @OndoPerps launched in July with 24/7 exposure to stocks,  
  https://nitter.kareem.one/KatieAWheeler/status/2105057463666168136#m
- @YumaGroup (Yuma Holdings, Tue, 29 Sep 2026): In 1 hour, Yuma COO @GSchvey leads a conference-closing conversation on where Bittensor goes next, live-streamed by @ExploitSummit here (5:20pm ET). bittensor:native Exploit Summit (@ExploitSummit) Exploit Summit: Live from Montreal Day 2 shitter.thepixora.com/i/broadcasts/1NGaroOYp… Link Exploit Summit Exploit Summit: Live from Montreal Day 2 http://shitter.thepixora.com/i/broadcasts/1NGaroOYpQXJj — http://shitter.thepixora.com/ExploitSummit/status/2104942854753947674#m  
  http://shitter.thepixora.com/YumaGroup/status/2105029645233995862#m
- @PanteraCapital (Pantera Capital, Tue, 29 Sep 2026): New from @PanteraCapital's State of Tokenization: RWA distribution has broadened dramatically onchain. The leading chain’s share of tokenized value fell from 88% in 2023 to 45% today, as the market expanded across 24 chains. Pantera Capital (@PanteraCapital) Pantera's latest State of Tokenization report is out. We analyzed the $332bn tokenization market across 671 assets. Institutions entered in force this quarter. J.P. Morgan, HSBC and Fidelity launched onchain products. BlackRock's BUIDL moved $441mn onchain in June, runs a $1bn daily redemption facility, and is now accepted as collateral. O  
  https://nitter.kareem.one/AlliumLabs/status/2105026778221703235#m
- @YumaGroup (Yuma Holdings, Tue, 29 Sep 2026): Beam studio is live: To learn more go to docs.b1m.ai  
  http://shitter.thepixora.com/b1m_ai/status/2105022473762713763#m
- @YumaGroup (Yuma Holdings, Tue, 29 Sep 2026): "It's certainly a conversation that starts before anything is signed." @LindsMikeStone of @YumaGroup on helping founders before a deal, even if they later launch elsewhere. With @macrozack @bitstarterAI, Kelly Woodward @CrucibleLabs and @capradavis of Unsupervised Capital. Video  
  http://shitter.thepixora.com/ExploitSummit/status/2105011226325741950#m
- @const_reborn (Jacob Steeves, Tue, 29 Sep 2026): We're excited to share that Bare Metal and Sandboxes are now live on Targon.com Bare Metal → An entire physical machine dedicated to your organization → No hypervisor, no container runtime, no noisy neighbors → Full control of kernel, drivers and firmware-level GPU settings → Every operator is KYC-verified, keeping workloads secure without TVM Sandboxes → Short-lived, isolated Linux environments for development, testing, previews and agents → Provisioning to running within seconds → Browser terminal, graphical Linux desktop or SSH → Fork independent copies for parallel experiments and agent ta  
  https://nitter.kareem.one/TargonCompute/status/2105004608531939718#m
- @const_reborn (Jacob Steeves, Tue, 29 Sep 2026): We're excited to share that Bare Metal and Sandboxes are now live on Targon.com Bare Metal → An entire physical machine dedicated to your organization → No hypervisor, no container runtime, no noisy neighbors → Full control of kernel, drivers and firmware-level GPU settings → Every operator is KYC-verified, keeping workloads secure without TVM Sandboxes → Short-lived, isolated Linux environments for development, testing, previews and agents → Provisioning to running within seconds → Browser terminal, graphical Linux desktop or SSH → Fork independent copies for parallel experiments and agent ta  
  http://shitter.thepixora.com/TargonCompute/status/2105004608531939718#m
- @PanteraCapital (Pantera Capital, Tue, 29 Sep 2026): Tokenization is now a $332B market across 671 assets. Wall Street showed up in force this quarter: JPM, HSBC, Fidelity. Issuance is solved. Liquidity is the game now. Pantera Capital (@PanteraCapital) Pantera's latest State of Tokenization report is out. We analyzed the $332bn tokenization market across 671 assets. Institutions entered in force this quarter. J.P. Morgan, HSBC and Fidelity launched onchain products. BlackRock's BUIDL moved $441mn onchain in June, runs a $1bn daily redemption facility, and is now accepted as collateral. On the consumer side, Robinhood Chain hit $888mn in weekly   
  https://nitter.kareem.one/veradittakit/status/2104994809308180676#m
- @YumaGroup (Yuma Holdings, Tue, 29 Sep 2026): Introducing Pulse and Gate. Pulse: your agent asks, your phone buzzes, you approve with your face in YID. Only then does it act. yanez.ai/pulse Gate: funds sit behind a contract that only unlocks for a signature from your biometrics, verified on-chain. gate.yanez.ai Pulse is free through October. $TAO  
  http://shitter.thepixora.com/yanez__ai/status/2104991405592752495#m
- @YumaGroup (Yuma Holdings, Tue, 29 Sep 2026): An agent asks to spend $100. Its allowance is $25. @josercaldera demonstrates a blocked request with Yanez Gate, then raises the limit and authorises it with Pulse. Watch the spending controls in action at Exploit Summit. Video  
  http://shitter.thepixora.com/ExploitSummit/status/2104988325639798889#m
- @galaxyhq (Galaxy Digital, Tue, 29 Sep 2026): BTC tests $88K on $2.4B in ETF inflows as the market defies macro headwinds. @RockawaysX @Ryanconnor joins to discuss esoteric onchain RWAs, where crypto and AI actually intersect, and the shifting crypto investment landscape. We also break down @vitalikbuterin updated vision for Ethereum and why AI agents might trigger a bank run. Galaxy Grid is live now👇 Video  
  http://nitter.meowing.monster/glxyresearch/status/2104977509993287724#m
- @a16zcrypto (a16z Crypto, Tue, 29 Sep 2026): zk.money is back. A self-custodial wallet that lets you send and receive crypto privately. Your money, private by default. Reserve your unique tag to get started. launch.zk.money Link zk.money Join zk.money to send or receive crypto privately. Open source, self-custodial, built on Ethereum. zk.money  
  http://nitter.meowing.monster/zk_money/status/2104966293199945975#m
- @tplr_ai (Templar, Tue, 29 Sep 2026): The heads of the biggest AI labs want to agree among themselves on when everyone should slow down. @TheEconomist's piece on that push ends with Covenant-72B, the model we finished training in March on GPUs contributed over the internet, as a reason such agreements may be hard to enforce. What the piece doesn't say is that once training no longer requires one giant, tightly connected cluster, the power to build new models no longer has to sit with a few companies. Globally distributed training and open models are essential tools for keeping that power from concentrating in the frontier labs. Th  
  http://nitter.meowing.monster/tplr_ai/status/2104937831097352377#m
- @a16zcrypto (a16z Crypto, Tue, 29 Sep 2026): Article Blockchains create net new markets For most of financial history, the supply of new markets — not demand — was the bottleneck. Blockchains remove that bottleneck. I believe this will unlock an explosion of net new markets. Markets are  
  http://nitter.meowing.monster/robbiepetersen_/status/2104925872553709720#m
- @const_reborn (Jacob Steeves, Tue, 29 Sep 2026): RSI Training goes LIVE at 5 PM PT today! We’re giving each agent access to a production Slurm cluster, 1,000 GPU-hours, and 6 days to improve Nemotron 3.5 model performance. Watch it all happen live -&gt; rsiarena.org Video  
  https://nitter.kareem.one/zhangchen_xu/status/2104879589726322875#m
- @const_reborn (Jacob Steeves, Tue, 29 Sep 2026): RSI Training goes LIVE at 5 PM PT today! We’re giving each agent access to a production Slurm cluster, 1,000 GPU-hours, and 6 days to improve Nemotron 3.5 model performance. Watch it all happen live -&gt; rsiarena.org Video  
  http://shitter.thepixora.com/zhangchen_xu/status/2104879589726322875#m
- @oroagents (Oro, Tue, 29 Sep 2026): Commerce is going to prove to be one of the largest opportunities in the agent world. Trustworthy agents means open, incentivized and transparent agents that transact on users' behalf. great article by @CrucibleLabs. Let's make this future happen the right way. Crucible Labs (@CrucibleLabs) Article a BIT of Joy: Issue 11 The Agent Era Is Here For the last few years, the AI industry has talked about agents as the next big thing. At this point, the more interesting question isn&apos;t when agents arrive. They&apos;re already — http://shitter.thepixora.com/CrucibleLabs/status/2103188134238564440#  
  http://shitter.thepixora.com/oroagents/status/2104794483745587425#m
- @oroagents (Oro, Tue, 22 Sep 2026): We're excited to announce ORO Bench today, a benchmark that's powered by a generator creating new synthetic shopping environments everyday. This is now powering our subnet on Bittensor, SN15. Video  
  http://shitter.thepixora.com/oroagents/status/2102475717367963815#m
- @polychain (Polychain Capital, Tue, 15 Sep 2026): It's time for a new foundation. Not a new start. Legacy Mode is live on Passport, keep every account you already have, on code anyone can inspect. Switch to open source hardware and software while keeping your existing accounts for supported assets. Here’s how. 🧵 Video  
  http://shitter.thepixora.com/FoundationHQ/status/2099865846101180499#m
- @nigescore (Nige, Tue, 15 Sep 2026): The physical world still can’t talk to software. A billion cameras watch factories, stations, warehouses, and stores every second. Almost none of that footage becomes action. That’s what we build at Manako. Today we join F/ai at @joinstationf The program that put OpenAI, Anthropic, Google, Meta, Microsoft and top-tier VCs behind a handful of AI-native teams. Honoured. Focused. Shipping.  
  https://nitter.kareem.one/manakoai/status/2099861562882203822#m
- @nigescore (Nige, Tue, 15 Sep 2026): The physical world still can’t talk to software. A billion cameras watch factories, stations, warehouses, and stores every second. Almost none of that footage becomes action. That’s what we build at Manako. Today we join F/ai at @joinstationf The program that put OpenAI, Anthropic, Google, Meta, Microsoft and top-tier VCs behind a handful of AI-native teams. Honoured. Focused. Shipping.  
  http://shitter.thepixora.com/manakoai/status/2099861562882203822#m
- @nigescore (Nige, Tue, 08 Sep 2026): Astra Ultra did not cook sports-grade vision AI. Gave it a 30s football clip from our subnet private track. Frame-level events, JSON, annotated video. Ground truth and the published scoring rules only after it committed. 22 predictions. 17 real events. 15 inside the action windows. 7 extras. 2 misses. Precision 68.18%. Recall 88.24%. F1 76.92%. Our Bittensor eval, SN44: 0%. Matches after timing decay: 16.538 False positives: −20.300 GT weight: 25.600 score = max(0, (16.538 − 20.300) / 25.600) = 0 Three extra take-ons and two extra tackles were 14.6 penalty points. It also misread the late inte  
  https://nitter.kareem.one/webuildscore/status/2097261685358596399#m
- @nigescore (Nige, Tue, 08 Sep 2026): Astra Ultra did not cook sports-grade vision AI. Gave it a 30s football clip from our subnet private track. Frame-level events, JSON, annotated video. Ground truth and the published scoring rules only after it committed. 22 predictions. 17 real events. 15 inside the action windows. 7 extras. 2 misses. Precision 68.18%. Recall 88.24%. F1 76.92%. Our Bittensor eval, SN44: 0%. Matches after timing decay: 16.538 False positives: −20.300 GT weight: 25.600 score = max(0, (16.538 − 20.300) / 25.600) = 0 Three extra take-ons and two extra tackles were 14.6 penalty points. It also misread the late inte  
  http://shitter.thepixora.com/webuildscore/status/2097261685358596399#m


---
_Generated at 2026-10-05T11:06:21.569499+00:00 by scripts/intel/aggregate.py. Treat this digest as input context, not as ground truth. Verify before quoting._
