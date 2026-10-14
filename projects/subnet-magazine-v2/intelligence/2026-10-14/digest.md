# Intelligence Digest, 2026-10-14

_Single-file briefing for the daily research agent. Sources listed in trust order: human-curated notes first, then objective (github), then editorial (RSS), then volume (X via Nitter)._


## ⊕ HUMAN-CURATED NOTES, last 7 days

_no human notes in the window_

## ⊕ MACRO BACKDROP via SEMIANALYSIS, 12 most recent posts

_SemiAnalysis is the most-cited semiconductor and AI infrastructure publication in the industry. They do NOT cover Bittensor. The Oracle uses this corpus for any claim about hyperscaler compute, GPU economics, datacenter power, foundry capacity, memory pricing, lab unit economics. DO NOT cite SemiAnalysis for any Bittensor-specific claim. Full archive (289 posts, May 2020 onwards) lives at `intelligence/_external_sources/semianalysis/` with an `INDEX.md` table of contents. Paywalled posts show only subtitle + free preview; free posts have the full body extracted._

### 2026-10-08 · Beijing Will Not Pace the Frontier: China’s Speed-First AI Safety Regime
__

- **Authors:** ["Mark Chen", "Doug", "Dylan Patel"]
- **Access:** paid-preview
- **URL:** https://newsletter.semianalysis.com/p/beijing-will-not-pace-the-frontier
- **Corpus file:** `intelligence/_external_sources/semianalysis/2026-10-08-beijing-will-not-pace-the-frontier.md`

> AI safety is on fire. On 12 September 2026, Dario Amodei published an essay arguing that frontier labs must deliberately slow the pace at which they improve model capabilities. China was central to his geopolitical argument: export controls and tighter security could preserve America’s lead, creating room to slow down and leverage for a future agreement with Beijing. Within a day, Sam Altman and Elon Musk supported Dario’s call. However, President Trump scoffed. On 14 September 2026, he wrote th

### 2026-10-05 · Anthropic Subscriptions Offer 5x+ More Value Than OpenAI
_Limit testing every AI subscription plan from Anthropic, OpenAI, Meta, SpaceXAI, MiniMax, Moonshot, Z.ai, Cursor, and Cognition_

- **Authors:** ["Andrew Megalaa", "Max Kan", "Dylan Patel"]
- **Access:** paid-preview
- **URL:** https://newsletter.semianalysis.com/p/anthropic-subscriptions-offer-5x
- **Corpus file:** `intelligence/_external_sources/semianalysis/2026-10-05-anthropic-subscriptions-offer-5x.md`

> Subscription plans are still the primary way consumers and small businesses pay for AI. These plans are highly subsidized—as we previously explained in [June](https://semianalysis.com/institutional/a-200-claude-plan-can-consume-8000-worth-of-tokens/)—but can still make economic sense as powerful customer acquisition and marketing tools. For example, the goodwill engendered by [OpenAI’s](https://x.com/thsottiaux/status/2102463847714247142) [generous](https://x.com/thsottiaux/status/21036374777603

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


## ⊕ GITHUB COMMITS + RELEASES, last 24h

- **Subtensor (chain)** (RELEASE `v478`, 2026-10-13 20:05) Runtime 478  
  https://github.com/RaoFoundation/subtensor/releases/tag/v478

## ⊕ ECOSYSTEM BLOGS via RSS

_no new posts in the lookback window_

## ⊕ X via NITTER, voices we track

- @BarrySilbert (Barry Silbert, Wed, 07 Oct 2026): Mike built @FoundryServices into an industry leader, assembled a world-class team, and helped cement US leadership in Bitcoin mining. His impact on the industry is remarkable Grateful for everything @colyermike contributed over his 7 years and his support through the transition Foundry (@FoundryServices) Today we announced that @colyermike is stepping down as CEO of Foundry after 7 years. Mike built Foundry from 1 employee into the operator of the world's largest Bitcoin mining pool. He will remain with Foundry for six months as a strategic advisor to support the transition. — http://nitter.me  
  http://nitter.meowing.monster/BarrySilbert/status/2107871862823039077#m
- @BarrySilbert (Barry Silbert, Wed, 07 Oct 2026): Yuma Large Cap Fund up 64.6% since launch, vs 48% for $TAO This fund has done particularly well in the last few months with the increasing concentration of emissions to the highest price (generally largest) subnets Yuma (@YumaGroup) The Yuma Large Cap Fund gained 29.0% in September on a USD basis, as its larger subnet holdings outperformed the broader subnet market. It was Yuma's strongest fund in Q3, up 64.6% vs. 48.0% for bittensor:native. The fund's composition is analogous to how the Mag 7 represent a concentrated allocation to dominant technology companies in public markets. Learn more ab  
  http://nitter.meowing.monster/GSchvey/status/2107838125187993700#m
- @zeussubnet (Zeus Subnet, Wed, 07 Oct 2026): Bittensor 101, featuring Zeus @mcjkula &amp; @TAOTemplar break it down at @ExploitSummit A great intro to Bittensor, and to what can be built on it 👇 Maciej Kula (@mcjkula) "The best person to solve your problem might be someone you’ve never met or considered hiring." Travis and I explain Bittensor, including examples from weather forecasting (@zeussubnet) and drug discovery (@metanova_labs). Here’s our "Bittensor 101" recording from @ExploitSummit Video — http://nitter.meowing.monster/mcjkula/status/2107803570699722943#m  
  http://nitter.meowing.monster/zeussubnet/status/2107830973811597696#m
- @BarrySilbert (Barry Silbert, Wed, 07 Oct 2026): The Yuma Large Cap Fund gained 29.0% in September on a USD basis, as its larger subnet holdings outperformed the broader subnet market. It was Yuma's strongest fund in Q3, up 64.6% vs. 48.0% for bittensor:native. The fund's composition is analogous to how the Mag 7 represent a concentrated allocation to dominant technology companies in public markets. Learn more about Yuma Asset Management funds at go.yumaai.com/utdUl Disclosure in thread.  
  http://nitter.meowing.monster/YumaGroup/status/2107825978659488218#m
- @PanteraCapital (Pantera Capital, Wed, 07 Oct 2026): Compliance can stay at issuance while tokenized assets become easier to trade, move across networks, and use in DeFi. That is where tokenized products improved in Q2, per @PanteraCapital, through changes in distribution, transferability, settlement, and composability.  
  http://nitter.meowing.monster/centrifuge/status/2107795631662391628#m
- @zeussubnet (Zeus Subnet, Wed, 07 Oct 2026): Google WeatherNext3 vs ZEUS? We're better. Took a while but we benchmarked and we're better. simple statement big impact. On to the next. $TAO zeussubnet.com/benchmarks  
  http://nitter.meowing.monster/wouterhar/status/2107784734571204848#m
- @VantaTrading (Vanta, Tue, 13 Oct 2026): Skip the evaluation. Instant Funded gets you a $25,000 account with weekly rewards from the day you register, at 80/20. Want more size? Add the Pro challenge and trade at up to $250,000 from the start. 100 slots, 20% off with code OCT20: vantatrading.io/instant-fund…  
  http://nitter.meowing.monster/VantaTrading/status/2110143685161816422#m
- @VantaTrading (Vanta, Tue, 13 Oct 2026): CPI is tomorrow at 8:30am ET. News trading is allowed on every Vanta account, and so are your own bots, EAs and weekend holds. Trade your plan: vantatrading.io/rules  
  http://nitter.meowing.monster/VantaTrading/status/2110105936593600818#m
- @VantaTrading (Vanta, Tue, 13 Oct 2026): The Vanta Difference 🙌 Vivian | Nitroxenon capital (@nitroxn_capital) Thank you! @VantaTrading payout received without any issue. Rewards are sent every Monday so you can swing there as welly @tryferm I am still waiting for my payout, stop the delay and send my payout. Been 2 days since i am going to and fro with you guys and it’s not funny anymore. @TheScrog — http://nitter.meowing.monster/nitroxn_capital/status/2110058480769851741#m  
  http://nitter.meowing.monster/VantaTrading/status/2110063960393204079#m
- @VantaTrading (Vanta, Tue, 13 Oct 2026): should we give away an instant funded account? let me know so i can go ask my boss 👀 - the VT intern Vanta Trading (@VantaTrading) Instant funded accounts: LIVE NOW on Vanta! 🚨 • Only 100 available • $25k account - no evaluation • Realize profits, get paid weekly Even better? They're on sale. Use code OCT20 for 20% off. Get one before they're gone 👇 vantatrading.io/instant-fund… — http://nitter.meowing.monster/VantaTrading/status/2108682548255526924#m  
  http://nitter.meowing.monster/VantaTrading/status/2110055586343825553#m
- @PanteraCapital (Pantera Capital, Tue, 13 Oct 2026): New milestone: $3 billion in tokenized U.S. Treasuries. Ondo ranks #1 among tokenized U.S. Treasury platforms on RWA․xyz, with $3 billion across USDY, OUSG and tokenized Treasury ETFs. Leading that growth is USDY, with over $2.3 billion in TVL, larger than BlackRock’s BUIDL. With USDY, holders can: → Earn yield directly in their wallets → Trade permissionlessly onchain → Use USDY as collateral across DeFi apps This milestone reflects how quickly tokenization is growing and how early we still are in bringing the world’s financial markets onchain. Billions today. Trillions tomorrow.  
  http://nitter.meowing.monster/Ondo/status/2110049625721758048#m
- @VantaTrading (Vanta, Tue, 13 Oct 2026): gm gm traders markets have been a bit turbulent lately, how are you guys navigating? let me know 👇 - the VT intern  
  http://nitter.meowing.monster/VantaTrading/status/2110016873626480899#m
- @KyleSamani (Kyle Samani, Tue, 13 Oct 2026): There is an answer to this question Soon! Kaiz 🐂🀄️ (@Kaiz_294) Arthur Hayes questions where the real money in tokenization comes from, arguing that moving traditional assets onchain still leaves a major unanswered question about profitability “How much money are you actually going to make” “I transferred the stock that was sitting in DTCC, and now it's sitting on some blockchain, whatever it is, doesn't really matter” “How much money can you actually make doing that” “You're doing better bookkeeping. Thank you. But where are you actually going to make money in tokenization” “I think that has b  
  http://nitter.meowing.monster/KyleSamani/status/2109972190519275682#m
- @BarrySilbert (Barry Silbert, Tue, 13 Oct 2026): More ways to grow your portfolio: $HYPE, $BNB, and $DOGE are now available on Luno Malaysia 🇲🇾 Three well-known assets from different sectors of the crypto market, now available alongside the assets already on Luno. Whether you are looking to tap into top-tier DeFi infrastructure or a widely recognised digital asset, new market opportunities have arrived on Luno in Malaysia. Ready to make your move? Open your Luno app and start exploring HYPE, BNB, and DOGE today on Luno: bit.ly/4ySqmbG  
  http://nitter.meowing.monster/LunoGlobal/status/2109947291771490627#m
- @BarrySilbert (Barry Silbert, Tue, 13 Oct 2026): On 24 September, 600 delegates gathered at M Resort & Hotel, Kuala Lumpur, making #LIDAC26KL as the largest Luno Institutional Digital Asset Conference yet, with strong representation across banking, regulators, asset management, and Web3 in the region. From deep conversations on institutional adoption, tokenisation, and stablecoins, to our announcement of a collaboration with Kenanga Investors and @HalogenCapital to explore UMYR, a Ringgit-pegged stablecoin designed for tokenised fund settlement, it was a day packed with milestones for Malaysia's digital asset journey. We can't thank our este  
  http://nitter.meowing.monster/LunoGlobal/status/2109877010461794732#m
- @PanteraCapital (Pantera Capital, Tue, 06 Oct 2026): Chinese vendors made up nearly all humanoid shipments in the first half of 2026. @BrookeDiPalma from @YahooFinance had OpenMind founder and CEO Jan Liphardt on to discuss this topic in a live segment earlier this week. @JanLiphardt says there’s “no question” China dominates the supply chain for advanced physical AI, and breaks down how the US can catch up in the global robotics race in the next 2 years. Read the post here: finance.yahoo.com/video/does… Video  
  http://nitter.meowing.monster/openmind_agi/status/2107560085539164379#m
- @PanteraCapital (Pantera Capital, Thu, 08 Oct 2026): Today, we're announcing $37.5M in new funding, led by @BainCapCrypto, bringing our total capital raised to over $180M. This investment will help us expand Bitcoin-denominated life insurance to families across Asia, Europe, and the Middle East. Video  
  http://nitter.meowing.monster/meanwhile/status/2108252790451826702#m
- @zeussubnet (Zeus Subnet, Thu, 08 Oct 2026): For a 00Z model run, Zeus disseminates in around 1.5 hours. That’s a 4.5 hour time advantage for energy traders to position before others trading with industry-standard models. This is our strongest differentiator.  
  http://nitter.meowing.monster/zeussubnet/status/2108184384985805221#m
- @KyleSamani (Kyle Samani, Sun, 11 Oct 2026): Role of a lifetime Armani Ferrante (@armaniferrante) Looking for a marketing + growth beast. Must live in USA. DMs open. — http://nitter.meowing.monster/armaniferrante/status/2109166594576556215#m  
  http://nitter.meowing.monster/KyleSamani/status/2109242980057936060#m
- @KyleSamani (Kyle Samani, Sat, 10 Oct 2026): I wrote my largest angel check ever into Backpack Santiago R Santos (@santiagoroel) Backpack is my highest conviction in crypto — http://nitter.meowing.monster/santiagoroel/status/2108465930397184305#m  
  http://nitter.meowing.monster/KyleSamani/status/2108904590280151392#m
- @KyleSamani (Kyle Samani, Sat, 10 Oct 2026): One order book One risk engine Global Luc | Backpack 🎒 (@Luc100k) Backpack one regulated platform everywhere. Video — http://nitter.meowing.monster/Luc100k/status/2108569791359553994#m  
  http://nitter.meowing.monster/KyleSamani/status/2108736102828048405#m
- @zeussubnet (Zeus Subnet, Mon, 12 Oct 2026): US natural gas traders are betting on a mild winter, with net-short positions exceeding 140K contracts. ❄️ But unexpected cold snaps will turn the market upside down. This winter, it's about the next 10 days of weather. Zeus temperature forecasts as population-weighted HDD/CDD output. Soon directly usable in natural gas trading setups.  
  http://nitter.meowing.monster/zeussubnet/status/2109676376160690225#m
- @KyleSamani (Kyle Samani, Mon, 12 Oct 2026): What are you favorite sources of finance and business analysis online? Please interpret this question as broadly as possible Examples can include Stratechery Semianalysis Above the crowd (bill gurley's blog) Berkshire letters Oaktree letters a16z and sequoia blogs Citrini Not Boring The Generalist Benedict evans asymco etc  
  http://nitter.meowing.monster/KyleSamani/status/2109655830840947059#m
- @PanteraCapital (Pantera Capital, Mon, 05 Oct 2026): Excited to announce I'm joining @PanteraCapital as a Junior Partner! I'll be backing founders building stablecoin payments, fintech x DeFi, and new markets for compute, energy, and more. Thank you to @dan_pantera, @veradittakit, @FranklinBi, @stutireal, Cosmo and the rest of the Pantera team for the trust and the opportunity. It's an honor to join a team that has backed the foundations of onchain finance for over a decade. Huge thank you to @nascent and @delitzer. Nacscent sharpened how I think about DeFi, market structure, and what it takes to build at the edge of finance. I'm grateful for th  
  http://nitter.meowing.monster/JackSimison/status/2107173455489892726#m
- @zeussubnet (Zeus Subnet, Fri, 18 Sep 2026): NEW! Full-on benchmarking environment to see how Zeus performs, where and when. Zeus vs ECMWF’s IFS &amp; AIFS singles and ensembles, across regions, lead times and variables. 🔗 zeussubnet.com/benchmarks  
  http://nitter.meowing.monster/zeussubnet/status/2100977402302054430#m


---
_Generated at 2026-10-14T03:04:20.584704+00:00 by scripts/intel/aggregate.py. Treat this digest as input context, not as ground truth. Verify before quoting._
