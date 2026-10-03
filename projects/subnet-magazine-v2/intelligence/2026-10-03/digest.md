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

_no commits or releases in the lookback window_

## ⊕ ECOSYSTEM BLOGS via RSS

_no new posts in the lookback window_

## ⊕ X via NITTER, voices we track

- @jtledore (Jean-Thomas Ledoré, Wed, 30 Sep 2026): Demand for AI compute is growing far faster than the infrastructure being built to serve it. Sam Altman's stated goal for OpenAI is 250 GW by 2033, roughly a quarter of US generating capacity. If the trend holds, Epoch AI puts a single frontier training run at 4 to 16 GW.  
  http://shitter.thepixora.com/MacrocosmosAI/status/2105360787145667021#m
- @polychain (Polychain Capital, Wed, 30 Sep 2026): THE BLOCK: DogeOS launched a public testnet for its zero-knowledge rollup, bringing EVM smart contracts to Dogecoin, with dogecoin:native used for gas fees. "I've spent half a decade encouraging people to take a chance on Dogecoin and to build in its ecosystem," said Timothy Stebbing, director of the Dogecoin Foundation. "My hopes are that DogeOS becomes the springboard for a wave of new utility engineering."  
  https://nitter.kareem.one/TheBlockCo/status/2105359920795394451#m
- @taomedia_ (TAO Media, Wed, 30 Sep 2026): JUST IN: @Figure_robot melts down humanoids @Schwarzenegger - "F.02 has been decommissioned" Video Figure (@Figure_robot) F.02 Decommission Video — http://shitter.thepixora.com/Figure_robot/status/2105316680251650555#m  
  http://shitter.thepixora.com/taomedia_/status/2105325043173707903#m
- @PanteraCapital (Pantera Capital, Wed, 30 Sep 2026): The next evolution of tokenization is here. Pantera’s latest State of Tokenization report highlights Ondo Intelligent Portfolios as the next step beyond individual tokenized stocks. “An entire portfolio becomes a single transferable token.” What this delivers: → DeFi composability → Multiple assets in one holding → Scheduled rebalancing via smart contracts With its first three portfolios powered by BlackRock, Ondo Intelligent Portfolios brings institutional investment strategies onchain. The next chapter of tokenization will expand what investors can access, how they build portfolios, and how   
  http://nitter.meowing.monster/Ondo/status/2105305938945057014#m
- @PanteraCapital (Pantera Capital, Wed, 30 Sep 2026): Issuing tokens onchain is now straightforward. Building liquid, compliant markets is the next step. Our CEO @doctorfission argues once fund positions can be sold on demand and used as collateral, they become fundamentally more useful. Read his full take in the Pantera report. Pantera Capital (@PanteraCapital) Pantera's latest State of Tokenization report is out. We analyzed the $332bn tokenization market across 671 assets. Institutions entered in force this quarter. J.P. Morgan, HSBC and Fidelity launched onchain products. BlackRock's BUIDL moved $441mn onchain in June, runs a $1bn daily redem  
  http://nitter.meowing.monster/FissionXYZ/status/2105303373503418762#m
- @polychain (Polychain Capital, Wed, 24 Jun 2026): EXCLUSIVE: a16z CSX-backed Cambrian raises $6 million seed to build blockchain data oracle network theblock.co/post/406028/a16z… Link a16z CSX-backed Cambrian raises $6 million seed to build blockchain data oracle network Cambrian’s new funding will expand its API and verifiable oracle network for institutions and AI agents, with Base and Solana already in production. theblock.co  
  https://nitter.kareem.one/TheBlockCo/status/2069827932843909349#m
- @shibshib89 (Ala Shaabana, Wed, 16 Sep 2026): LFG! Crucible Labs (@CrucibleLabs) Crucible Wallet Extension v2.1.1 is LIVE. This isn’t just an update. We rebuilt the entire wallet experience from the ground up. A completely new UI. More control over your TAO. More Bittensor tools built directly into your wallet. What’s new in v2.1.1: ✔️Completely updated UI + light/dark mode ✔️Claim rewards directly in the wallet ✔️Unified balance across TAO + alpha ✔️Universal Swap ✔️Transfer TAO + alpha ✔️Subnet discovery + detailed subnet views ✔️Multi-address support for seed phrases ✔️12 and 24 word seed phrase support ✔️Updated Smart Account + Reward  
  http://shitter.thepixora.com/shibshib89/status/2100300168633761947#m
- @shibshib89 (Ala Shaabana, Wed, 09 Sep 2026): Did you hear? Crucible Wallet is officially live on iOS today. An easy to use Bittensor wallet with Ledger security, Unified Swap and subnet level performance. Now available on iOS in the US, Android and Chrome. Download at CrucibleLabs.com #Bittensor #TAO #CrucibleWallet  
  http://shitter.thepixora.com/CrucibleLabs/status/2097815766473323006#m
- @shibshib89 (Ala Shaabana, Wed, 09 Sep 2026): We are officially on iOS! Onwards 🚀 Crucible Labs (@CrucibleLabs) A long time coming and officially here. Crucible Wallet is now available on iOS in the US. An easy, intuitive Bittensor wallet for your everyday TAO needs, with Unified Swap, portfolio tracking and Ledger support wherever you go. Already available on Google Play and Chrome Store. Download at CrucibleLabs.com #CrucibleWallet #TAO #Bittensor — http://shitter.thepixora.com/CrucibleLabs/status/2097699938209857625#m  
  http://shitter.thepixora.com/shibshib89/status/2097724813028516224#m
- @shibshib89 (Ala Shaabana, Wed, 02 Sep 2026): Crucible Labs dropping #downwiththedev Episode 1. We breakdown the Mobile Wallet with @buildwithsamp. Take a listen. Video  
  http://shitter.thepixora.com/CrucibleLabs/status/2095144290376937770#m
- @PanteraCapital (Pantera Capital, Tue, 29 Sep 2026): 📈 Tokenization is moving from simply putting assets onchain to building real, programmable capital markets. @PanteraCapital’s latest State of Tokenization report highlights several areas where @Ondo Finance is helping push that evolution forward: 📍Distribution: $USDY had the largest reported holder base among tokenized rates products, with nearly 18,000 addresses as of June 30. 📍Tokenized equities: @Ondo is highlighted across the report’s analysis of the rapidly growing onchain equity market which Ondo Finance continues to lead. 📍Perps: @OndoPerps launched in July with 24/7 exposure to stocks,  
  http://nitter.meowing.monster/KatieAWheeler/status/2105057463666168136#m
- @PanteraCapital (Pantera Capital, Tue, 29 Sep 2026): New from @PanteraCapital's State of Tokenization: RWA distribution has broadened dramatically onchain. The leading chain’s share of tokenized value fell from 88% in 2023 to 45% today, as the market expanded across 24 chains. Pantera Capital (@PanteraCapital) Pantera's latest State of Tokenization report is out. We analyzed the $332bn tokenization market across 671 assets. Institutions entered in force this quarter. J.P. Morgan, HSBC and Fidelity launched onchain products. BlackRock's BUIDL moved $441mn onchain in June, runs a $1bn daily redemption facility, and is now accepted as collateral. O  
  http://nitter.meowing.monster/AlliumLabs/status/2105026778221703235#m
- @PanteraCapital (Pantera Capital, Tue, 29 Sep 2026): Tokenization is now a $332B market across 671 assets. Wall Street showed up in force this quarter: JPM, HSBC, Fidelity. Issuance is solved. Liquidity is the game now. Pantera Capital (@PanteraCapital) Pantera's latest State of Tokenization report is out. We analyzed the $332bn tokenization market across 671 assets. Institutions entered in force this quarter. J.P. Morgan, HSBC and Fidelity launched onchain products. BlackRock's BUIDL moved $441mn onchain in June, runs a $1bn daily redemption facility, and is now accepted as collateral. On the consumer side, Robinhood Chain hit $888mn in weekly   
  http://nitter.meowing.monster/veradittakit/status/2104994809308180676#m
- @polychain (Polychain Capital, Tue, 15 Sep 2026): It's time for a new foundation. Not a new start. Legacy Mode is live on Passport, keep every account you already have, on code anyone can inspect. Switch to open source hardware and software while keeping your existing accounts for supported assets. Here’s how. 🧵 Video  
  https://nitter.kareem.one/FoundationHQ/status/2099865846101180499#m
- @resilabsai (RESI, Tue, 07 Apr 2026): The power of holding Bittensor $TAO subnet alpha Here is an example to illustrate the flywheel of $TAO Let's say you 1,000 alpha of @resilabsai which cost around 7 $TAO 7 $TAO at a price of $310 = $2,170 Current alpha price of Resi, subnet 46: .0066 $TAO Let's make some calculated assumptions. &gt; price of resi alpha stays the same for 3 years &gt; price of $TAO remains the same at $310 &gt; APY for holding Resi alpha is 40% for the first 2 years, then 30% in year 3 What is my total value in 3 years? Year 1 (40% APY) 1,060.6 × 1.4 = 1,484.8 alpha In $TAO: 1,484.8 × 0.0066 ≈ 9.80 $TAO In USD:   
  http://nitter.meowing.monster/Pop_Collapse/status/2041570023823528017#m
- @polychain (Polychain Capital, Thu, 25 Jun 2026): Article The Missing AI Layer Is Not Security. It&apos;s Authority. AI agents are now computer users. They browse websites. They read files. They write code. They call APIs. They log in to accounts. They handle credentials, use tools, and take actions across software  
  https://nitter.kareem.one/zherbert/status/2070178183333171395#m
- @zeussubnet (Zeus Subnet, Thu, 24 Sep 2026): 🤯 4 hours of latency advantage with a model that's more accurate than both EC's IFS ENS &amp; Google's new state-of-the-art model WeatherNext 3, on 100m wind in 0-48H window Zeus | SN 18 (@zeussubnet) An hour and a half. That's how fast Zeus delivers a new weather run. That's 4× faster than IFS (6h) and nearly 5× faster than Google's new WeatherNext 3 (7h). And it's not winning on speed alone. 👇 We’ve put WeatherNext 3 head-to-head with our Zeus Pro and the industry-standard IFS ENS. On 2m temperature, Zeus has been consistently more accurate than both throughout August. — http://shitter.thepi  
  http://shitter.thepixora.com/egillwx/status/2103159277405843965#m
- @zeussubnet (Zeus Subnet, Thu, 24 Sep 2026): An hour and a half. That's how fast Zeus delivers a new weather run. That's 4× faster than IFS (6h) and nearly 5× faster than Google's new WeatherNext 3 (7h). And it's not winning on speed alone. 👇 We’ve put WeatherNext 3 head-to-head with our Zeus Pro and the industry-standard IFS ENS. On 2m temperature, Zeus has been consistently more accurate than both throughout August.  
  http://shitter.thepixora.com/zeussubnet/status/2103125660398981184#m
- @Olaf (Olaf Carlson-Wee, Thu, 19 Aug 2010): lekker biertje drinken bij Dims!  
  https://nitter.kareem.one/olaf/status/21602951308#m
- @polychain (Polychain Capital, Thu, 13 Aug 2026): LBTC proved demand for yield-bearing Bitcoin. Today, we double down on that thesis. LBTC is moving to institutional yield. @Bitwise will manage a covered-call options strategy with a 4.5-year legacy track record, to generate LBTC's yield, targeting 2.5% net APY paid in Bitcoin.  
  https://nitter.kareem.one/Lombard_Finance/status/2087887552300933626#m
- @jtledore (Jean-Thomas Ledoré, Thu, 01 Oct 2026): so it begins Score (@webuildscore) September was the first month we broke even. Two private track partners are now long-term paid clients. We’re converting clients faster than before, still in sports, and now in fuel retail and security via Manako. Details will be shared in separate posts. That was the signal we were waiting for. Buybacks (and burn this time) of sn44 have started from our owner address. First ones are in: 9 × 1,044 and 1 × 4,444. Not from Manako. Purely from the subnet. We will not talk about them. No schedules, no amounts, no marketing. A buyback today says nothing about tomo  
  http://shitter.thepixora.com/MaxSebti/status/2105780064344490191#m
- @jtledore (Jean-Thomas Ledoré, Thu, 01 Oct 2026): September was the first month we broke even. Two private track partners are now long-term paid clients. We’re converting clients faster than before, still in sports, and now in fuel retail and security via Manako. Details will be shared in separate posts. That was the signal we were waiting for. Buybacks (and burn this time) of sn44 have started from our owner address. First ones are in: 9 × 1,044 and 1 × 4,444. Not from Manako. Purely from the subnet. We will not talk about them. No schedules, no amounts, no marketing. A buyback today says nothing about tomorrow. It could be $1,044 on day 1 a  
  http://shitter.thepixora.com/webuildscore/status/2105779835591098873#m
- @taomedia_ (TAO Media, Thu, 01 Oct 2026): Google just unveiled Gemini 4 Argon, a new frontier model aimed at long-horizon coding and cyber defense. It supports up to 1M output tokens, up from 64K previously. Full details ↓ tao.media/google-launches-ge… Link Google Launches Gemini 4 Argon Frontier Model for Coding and Cyber Defense The model is rolling out first to trusted cyber defenders before a wider release to paid API customers and Google AI Ultra subscribers. tao.media  
  http://shitter.thepixora.com/taomedia_/status/2105774326180180220#m
- @Olaf (Olaf Carlson-Wee, Sun, 10 Jul 2011): RT @timmerarjan Life is good! yfrog.com/kkli4iaj zeker !! Wel tof dat je het deelt met je vrienden :)  
  https://nitter.kareem.one/olaf/status/90083936700600321#m
- @resilabsai (RESI, Sat, 18 Apr 2026): Traditional centralized real estate data platforms are fundamentally flawed and often serve to extract wealth from users. @resilabsai (Subnet 46) is breaking this monopoly through decentralized AI technology that delivers up to 99% valuation accuracy. Skip the corporate intermediaries—this AI-powered home valuation tool provides the most reliable housing market forecasts for 2026 Video SEBY (gpu/acc) (@sebyrubino) The @resilabsai Portal is LIVE! Any agent or real estate professional can now easily access our SOTA remote appraisals. We built RESI as a compounding network that will naturally acc  
  http://nitter.meowing.monster/3rdeye_rav3n/status/2045362275045753234#m
- @resilabsai (RESI, Sat, 08 Aug 2026): Attention Res Labs we have some really exciting news and updates to our project join our discord to stay up to date: discord.gg/TBj8q9vb2Q #bittensor #TAO bittensor:native #reslabs #reilabsai #crypto #subnet #subnet46 #reslabs_ai #reslabsai #opentensor #reptides  
  http://nitter.meowing.monster/resilabsai/status/2085900662139744548#m
- @shibshib89 (Ala Shaabana, Mon, 28 Sep 2026): Bittensor and Baguettes is ready for her interviews @ExploitSummit. See what subnets we’re chatting about soon!  
  http://shitter.thepixora.com/CrucibleLabs/status/2104684600291180752#m
- @jtledore (Jean-Thomas Ledoré, Mon, 28 Sep 2026): Proud to announce the next stage of our work in @IOTA_SN9, the iota SDK and liquid compute, live at @ExploitSummit today! We’ve distilled 2 years of R&D into a powerful set of communication primitives so that that anyone can train models using globally distributed, heterogeneous and unreliable compute with just a few lines changed from pure PyTorch. We believe this fundamentally disrupts the economics of AI training.  
  http://shitter.thepixora.com/macrocrux/status/2104641052565012805#m
- @zeussubnet (Zeus Subnet, Mon, 21 Sep 2026): Remember when @zeussubnet beat Google LIVE? A few weeks ago, Google released a new MEGA model: WeatherNext 3 🔥 Zeus vs @Google round 2 soon Zeus | SN 18 (@zeussubnet) Yesterday, during @opentensor Novelty Search, @const_reborn asked us to demo Zeus live: “Max temperature in Seoul tomorrow?” 🇰🇷 Zeus: 26°C Google: 28°C Today? It was 26°C. Live, verified, beat @Google. No better validation than that. 🔥 Video — http://shitter.thepixora.com/zeussubnet/status/1971601638189379774#m  
  http://shitter.thepixora.com/egillwx/status/2102013020486394112#m
- @resilabsai (RESI, Mon, 20 Apr 2026): I am pleased to announce that Stillcore Capital @stillcorecap has invested in RESI @resilabsai (Bittensor Subnet 46).  
  http://nitter.meowing.monster/markjeffrey/status/2046311512621670731#m
- @resilabsai (RESI, Mon, 06 Apr 2026): Chainlink gave DeFi price feeds. @resilabsai is doing the same for real estate. From static appraisals to dynamic, onchain pricing. It's already honing in on Zillow's pricing accuracy, and only a matter of weeks before it surpasses it!  
  http://nitter.meowing.monster/gordonfrayne/status/2041152947925512465#m
- @taomedia_ (TAO Media, Fri, 25 Sep 2026): Thanks @bart_hillerich for having us. Our co-founder @AntoinePlancho3 joined @taomedia_ to talk Mentat Lend and DeFi on Bittensor. Intelligence ττ (@taomedia_) Bittensor DeFi is a blue ocean opportunity, and @MentatLend_ is leading the expansion effort. @bart_hillerich caught up with @AntoinePlancho3 to discuss protocol progress, subnet tokens as collateral, and what it’ll take for Bittensor to develop into a leading DeFi ecosystem. Video — http://shitter.thepixora.com/taomedia_/status/2103470773935681611#m  
  http://shitter.thepixora.com/MentatLend_/status/2103482569740452316#m
- @zeussubnet (Zeus Subnet, Fri, 18 Sep 2026): NEW! Full-on benchmarking environment to see how Zeus performs, where and when. Zeus vs ECMWF’s IFS &amp; AIFS singles and ensembles, across regions, lead times and variables. 🔗 zeussubnet.com/benchmarks  
  http://shitter.thepixora.com/zeussubnet/status/2100977402302054430#m
- @zeussubnet (Zeus Subnet, Fri, 18 Sep 2026): Energy Trader, see this benchmark 🫨 Its hard to keep track of the quality of all models, see a benchmark of multiple models on our website; zeussubnet.com/benchmarks  
  http://shitter.thepixora.com/wouterhar/status/2100947610269819060#m
- @1inch (1inch, Fri, 02 Oct 2026): reDeFine Money is a limited edition ebook by @1inch on @written_app An insider story of decentralized finance and Web3, told by the very builders who created it. Half of the copies are already sold out. Get yours in comments ↓  
  http://nitter.meowing.monster/written_app/status/2106076846693773808#m
- @taomedia_ (TAO Media, Fri, 02 Oct 2026): UMI just rebranded Bittensor Subnet 78 (formerly Vocence) into a motion-to-meaning network, starting with /sign, a camera-based tool aimed at real-time Deaf–hearing communication. The product targets sub-3-second translation latency and a rollout that starts with a web app this coming week Full details ↓ tao.media/umi-launches-bitte… Link UMI Launches Bittensor Motion-to-Meaning Network on Subnet 78 With /sign The former Vocence subnet is opening model competition for real-time Deaf–hearing communication as UMI prepares /sign for beta and App Store rollout. tao.media  
  http://shitter.thepixora.com/taomedia_/status/2106070217311068279#m
- @1inch (1inch, Fri, 02 Oct 2026): Sandwich attacks. How do you protect your swaps? Poll 20% — Private RPC and hope 16% — A private mempool 38% — Tight slippage only 26% — No idea if I&apos;ve been hit 50 votes • 11 hours  
  http://nitter.meowing.monster/1inch/status/2106039762322927942#m
- @jtledore (Jean-Thomas Ledoré, Fri, 02 Oct 2026): OpenRoboto miners pushed @physical_int’s π0.5 model from ~55% to nearly 90% success on simulated robot tasks in under a month. On the latest Novelty Search, @openroboto explains how Bittensor’s Subnet 80 develops open robotics models through competition and tests them on real hardware. With Shift, OpenRoboto is building a decentralized network for robotics training data, rewarding contributors who capture real workplace skills using OR-S1 devices introduced in partnership with @gi_labs. Hosted by @const_reborn Full episode in the first comment Video  
  http://shitter.thepixora.com/opentensor/status/2106011363235770427#m
- @1inch (1inch, Fri, 02 Oct 2026): Aave loops build a larger aToken balance. 1inch Aqua lets that one balance back several positions while it stays in your wallet. How the two fit together, what SwapVM does with the order of transfers and what to watch: Article Aave loops and 1inch Aqua: one balance behind several positions More liquidity behind a position means larger swaps can fill against it. The usual way to get more liquidity is to commit more of your own tokens. Aave loops offer another route: supply an asset,  
  http://nitter.meowing.monster/1inch/status/2105991264239808706#m
- @1inch (1inch, Fri, 02 Oct 2026): 1inch.com/aqua Link Provide Liquidity on 1inch Aqua | Shared Liquidity AMM Provide liquidity on 1inch Aqua, the shared liquidity AMM. Become a self-custodial liquidity provider, back many positions with the same tokens, no deposits. 1inch.com  
  http://nitter.meowing.monster/1inch/status/2105972269831110687#m
- @1inch (1inch, Fri, 02 Oct 2026): "How does Aqua handle impermanent loss when I withdraw?" There is no withdrawal, so the honest answer is more interesting than that. Holly Atkinson, CPTO at 1inch, on where impermanent loss actually sits when your tokens never left your wallet. Video  
  http://nitter.meowing.monster/1inch/status/2105972266097893605#m
- @taomedia_ (TAO Media, Fri, 02 Oct 2026): One of the more interesting ideas coming out of Exploit Summit. @const_reborn outlined Gamma tokens as usage credits that could let subnets spend part of their emissions on compute, inference and other infrastructure. That could change how Bittensor works. Subnets wouldn’t just compete for emissions. They could also buy services from each other. If it works, emissions become operating budget not just rewards. $TAO #Bittensor? Intelligence ττ (@taomedia_) JUST IN: @const_reborn shares the vision for gamma tokens, usage credits that subnets could fund from a slice of their emissions and spend on  
  http://shitter.thepixora.com/Robin_T100/status/2105946029489094755#m


---
_Generated at 2026-10-03T03:17:20.003933+00:00 by scripts/intel/aggregate.py. Treat this digest as input context, not as ground truth. Verify before quoting._
