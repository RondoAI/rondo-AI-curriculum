# Intelligence Digest, 2026-10-13

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

- **Subtensor (chain)** (COMMIT `850f275`, 2026-10-13 01:50) Merge pull request #3237 from RaoFoundation/release-478  
  https://github.com/RaoFoundation/subtensor/commit/850f2755bb05a3851f948489f0ab27b0645cebce
- **Subtensor (chain)** (COMMIT `4c96945`, 2026-10-13 01:13) Regenerate docs and ignore line-number drift in the docs check  
  https://github.com/RaoFoundation/subtensor/commit/4c9694528b968c8b9c292d3ac197ac68a9dfcc3a
- **Subtensor (chain)** (COMMIT `ed24d1d`, 2026-10-12 23:49) Merge pull request #3233 from RaoFoundation/precompile-stake-exit-gas-bound  
  https://github.com/RaoFoundation/subtensor/commit/ed24d1ded2fafc3b97c124f1385ad4b6e4357198
- **Subtensor (chain)** (COMMIT `78d3313`, 2026-10-12 23:48) Merge pull request #3235 from RaoFoundation/fix/staking-hotkeys-consistency  
  https://github.com/RaoFoundation/subtensor/commit/78d331380055ab6fff6f89ae624be59e9583fde5
- **Subtensor (chain)** (COMMIT `900bd9e`, 2026-10-12 22:56) Size unstake_all walks to the caller's list in the EVM and contract paths  
  https://github.com/RaoFoundation/subtensor/commit/900bd9e8f7969b053cc287215a712b0137843578
- **Subtensor (chain)** (COMMIT `3010d10`, 2026-10-12 18:57) Restore missing staking hotkey associations in bounded migration batches  
  https://github.com/RaoFoundation/subtensor/commit/3010d1099a4eb5e869bd9beeb69e1c5b1bd43096
- **Subtensor (chain)** (COMMIT `8677391`, 2026-10-12 14:37) Bump spec_version to 478  
  https://github.com/RaoFoundation/subtensor/commit/8677391fbf6143c2e727e3a6866aa8e5c960c487
- **Subtensor (chain)** (COMMIT `b5cbe84`, 2026-10-12 14:31) Add regression tests for the stake-exit gas reservation  
  https://github.com/RaoFoundation/subtensor/commit/b5cbe84a692eea819fcf86ab1a6cc0e64f962660
- **Subtensor (chain)** (COMMIT `41afc66`, 2026-10-12 14:09) Size the stake-exit walk to the caller's list in the EVM and contract paths  
  https://github.com/RaoFoundation/subtensor/commit/41afc661db0b4632e4b33746209cb5b4c4aaa589

## ⊕ ECOSYSTEM BLOGS via RSS

_no new posts in the lookback window_

## ⊕ X via NITTER, voices we track

- @PanteraCapital (Pantera Capital, Wed, 30 Sep 2026): The next evolution of tokenization is here. Pantera’s latest State of Tokenization report highlights Ondo Intelligent Portfolios as the next step beyond individual tokenized stocks. “An entire portfolio becomes a single transferable token.” What this delivers: → DeFi composability → Multiple assets in one holding → Scheduled rebalancing via smart contracts With its first three portfolios powered by BlackRock, Ondo Intelligent Portfolios brings institutional investment strategies onchain. The next chapter of tokenization will expand what investors can access, how they build portfolios, and how   
  http://nitter.meowing.monster/Ondo/status/2105305938945057014#m
- @tplr_ai (Templar, Wed, 23 Sep 2026): Read the blog: tplr.ai/publications/blog/sk… Link Fault tolerance in low-bandwidth model parallelism: exploring pipeline stage-skipping with boundary... We explore how the residual nature of the transformer architecture can be leveraged to mitigate hardware faults, and demonstrate that the compression-based implementation of low-bandwidth model... tplr.ai  
  https://nitter.kareem.one/tplr_ai/status/2102792676676432160#m
- @tplr_ai (Templar, Wed, 23 Sep 2026): Video  
  https://nitter.kareem.one/tplr_ai/status/2102792674118164542#m
- @tplr_ai (Templar, Wed, 16 Sep 2026): These results point toward training on a broader pool of compute, including unreliable workers and spot instances, while keeping healthy stages productive. Blog: tplr.ai/publications/blog/sk… n/n Link Fault tolerance in low-bandwidth model parallelism: exploring pipeline stage-skipping with boundary... We explore how the residual nature of the transformer architecture can be leveraged to mitigate hardware faults, and demonstrate that the compression-based implementation of low-bandwidth model... tplr.ai  
  https://nitter.kareem.one/tplr_ai/status/2100237717162303718#m
- @tplr_ai (Templar, Wed, 16 Sep 2026): When using pipeline compression with fixed projections shared across layers, robustness improves further as seen in the figure below. This suggests that shared projectors align representations across stage boundaries, making bypasses less disruptive. 4/n  
  https://nitter.kareem.one/tplr_ai/status/2100237714918367690#m
- @mcjkula (mcjkula, Wed, 07 Oct 2026): "The best person to solve your problem might be someone you’ve never met or considered hiring." Travis and I explain Bittensor, including examples from weather forecasting (@zeussubnet) and drug discovery (@metanova_labs). Here’s our "Bittensor 101" recording from @ExploitSummit Video  
  http://nitter.meowing.monster/mcjkula/status/2107803570699722943#m
- @PanteraCapital (Pantera Capital, Wed, 07 Oct 2026): Compliance can stay at issuance while tokenized assets become easier to trade, move across networks, and use in DeFi. That is where tokenized products improved in Q2, per @PanteraCapital, through changes in distribution, transferability, settlement, and composability.  
  http://nitter.meowing.monster/centrifuge/status/2107795631662391628#m
- @tplr_ai (Templar, Tue, 29 Sep 2026): The heads of the biggest AI labs want to agree among themselves on when everyone should slow down. @TheEconomist's piece on that push ends with Covenant-72B, the model we finished training in March on GPUs contributed over the internet, as a reason such agreements may be hard to enforce. What the piece doesn't say is that once training no longer requires one giant, tightly connected cluster, the power to build new models no longer has to sit with a few companies. Globally distributed training and open models are essential tools for keeping that power from concentrating in the frontier labs. Th  
  https://nitter.kareem.one/tplr_ai/status/2104937831097352377#m
- @jtledore (Jean-Thomas Ledoré, Tue, 13 Oct 2026): Missed a subnet pump and waiting for a pullback? Set a limit buy on Taoswap at your target price in just a few clicks. If the price comes back to your level, your order can execute automatically without you having to watch the chart. Video  
  http://nitter.meowing.monster/taoswap_org/status/2109960573530063147#m
- @PanteraCapital (Pantera Capital, Tue, 06 Oct 2026): Chinese vendors made up nearly all humanoid shipments in the first half of 2026. @BrookeDiPalma from @YahooFinance had OpenMind founder and CEO Jan Liphardt on to discuss this topic in a live segment earlier this week. @JanLiphardt says there’s “no question” China dominates the supply chain for advanced physical AI, and breaks down how the US can catch up in the global robotics race in the next 2 years. Read the post here: finance.yahoo.com/video/does… Video  
  http://nitter.meowing.monster/openmind_agi/status/2107560085539164379#m
- @mcjkula (mcjkula, Tue, 06 Oct 2026): A plain-English introduction to Bittensor: learnbittensor.org/get-start…  
  http://nitter.meowing.monster/mcjkula/status/2107475150841254343#m
- @mcjkula (mcjkula, Tue, 06 Oct 2026): Bitcoin rewards one kind of work. Bittensor has a very different idea of “work” Video  
  http://nitter.meowing.monster/mcjkula/status/2107441742199042204#m
- @affine_io (Affine, Tue, 01 Sep 2026): Everything you need to compete is public: affine.io/llms.txt  
  http://nitter.meowing.monster/affine_io/status/2094801258016370976#m
- @affine_io (Affine, Tue, 01 Sep 2026): Video  
  http://nitter.meowing.monster/affine_io/status/2094801103959540005#m
- @_redteam_ (RedTeam / Innerworks, Thu, 27 Aug 2026): The Immune System for the Internet. Releasing next month. Oscar Hayek (@oscar_hayek) Defence in this era must be AI driven, the absolute baseline is adapting defences faster than attacks are being produced. Anything slower than this leaves you in a constant state of degradation. What we’ve built on @_redteam_ is an immune system for this problem. The attacks we ingest are evolved inside the system into complete novel vectors that cannot be produced anywhere else. Every one of these gets patched before an external attacker has the means/ability to create it, let alone release it. bittensor:nati  
  http://nitter.meowing.monster/_redteam_/status/2093081017145847826#m
- @_redteam_ (RedTeam / Innerworks, Thu, 10 Sep 2026): I am pleased to announce that Stillcore Capital @stillcorecap has invested in Red Team @_redteam_ Bittensor $TAO Subnet 61.  
  http://nitter.meowing.monster/markjeffrey/status/2098171401152971021#m
- @oroagents (Oro, Thu, 08 Oct 2026): And to see what we are up to next at oroagents.com/  
  http://nitter.meowing.monster/oroagents/status/2108312282493329762#m
- @oroagents (Oro, Thu, 08 Oct 2026): As models and harnesses get more capable, the depth of our RL environments needs to stay ahead of the curve. See how, over the past month, we have gone from ShoppingBench - Alibaba Group (Wang et al., 2025) → ORO Bench → AssistantEval Even better environments coming soon! Video  
  http://nitter.meowing.monster/oroagents/status/2108311456345358818#m
- @PanteraCapital (Pantera Capital, Thu, 08 Oct 2026): Today, we're announcing $37.5M in new funding, led by @BainCapCrypto, bringing our total capital raised to over $180M. This investment will help us expand Bitcoin-denominated life insurance to families across Asia, Europe, and the Middle East. Video  
  http://nitter.meowing.monster/meanwhile/status/2108252790451826702#m
- @oroagents (Oro, Thu, 08 Oct 2026): huggingface.co/collections/o… Link AssistantEval - a oro-ai Collection AssistantEval by ORO. Published results and recorded trajectories. Website: assistanteval.com huggingface.co  
  http://nitter.meowing.monster/oroagents/status/2108083587845394791#m
- @oroagents (Oro, Thu, 08 Oct 2026): We're excited to open source all the tasks and the traces that we have access to from this benchmark. Link in 🧵 ORO (@oroagents) We're excited to drop AssistantEval today. Replayable environments for evaluating and improving AI assistants. — http://nitter.meowing.monster/oroagents/status/2107609637654823076#m  
  http://nitter.meowing.monster/oroagents/status/2108083567654060352#m
- @markjeffrey (Mark Jeffrey, Sun, 11 Oct 2026): Get your ENGY. Use my code: engy.ai/r/markjeffrey 30% cheaper than OpenRouter (or anywhere) for GLM 5.3 flash. Cheapest inference on planet earth - with no compromise on speed or quality. Engy (@engyai) GLM-5.3 is live on engy.ai at ~100 tps. $0.98 in / $3.08 out / $0.18 cache per 1M, 30% below OpenRouter and the official API ($1.40 / $4.40 / $0.26). — http://nitter.meowing.monster/engyai/status/2093681206114299916#m  
  http://nitter.meowing.monster/markjeffrey/status/2109404435072029121#m
- @a16zcrypto (a16z Crypto, Sun, 11 Oct 2026): Informative discussion by very knowledgeable experts about the threat to modern cryptography posed by AI models. The good news is that the models can vet cryptosystems much faster than the human mathematicians we've relied on in the past, building trust and allowing more rapid deployment. a16z crypto (@a16zcrypto) AI is getting better at solving hard math problems, especially given recent drops. But what does that mean for the cryptography that protects everything from private messages to healthcare to banking and crypto wallets? Stanford cryptographer Dan Boneh, with @eddylazzarin, @SuccinctJ  
  http://nitter.meowing.monster/preskill/status/2109349797035733061#m
- @jtledore (Jean-Thomas Ledoré, Sun, 11 Oct 2026): Introducing desktop-native limit orders on Taoswap Set your price and amount to place limit buys or sells, with the option to keep your orders out of the public order book. Shoutout to @taodotcom for building this technology, first launched on their mobile app and browser extension. Video  
  http://nitter.meowing.monster/taoswap_org/status/2109312793857962328#m
- @jtledore (Jean-Thomas Ledoré, Sun, 11 Oct 2026): Article Bittensor Ecosystem Highlights :: October 5–11, 2026 This week’s biggest stories across Bittensor came from Lium, Actual, Score, Reliquary, Engy, Beam and Almanac. [ @lium_io - Subnet 51 ] Lium’s GPU utilization reached an all-time high, with most GPU  
  http://nitter.meowing.monster/opentensor/status/2109285455208337754#m
- @KyleSamani (Kyle Samani, Sun, 11 Oct 2026): Role of a lifetime Armani Ferrante (@armaniferrante) Looking for a marketing + growth beast. Must live in USA. DMs open. — http://nitter.meowing.monster/armaniferrante/status/2109166594576556215#m  
  http://nitter.meowing.monster/KyleSamani/status/2109242980057936060#m
- @mcjkula (mcjkula, Sat, 19 Sep 2026): Maciej Kula ( @mcjkula ) couldn't find a clear way to learn #Bittensor from scratch, so he built the resource he wished existed. @learnbittensor is now part of @latentholdings, where Maciej leads education and makes Bittensor easier to understand. He'll be leading our Bittensor 101 session to kick off Day 1: luma.com/nqy2n5zi Video  
  http://nitter.meowing.monster/ExploitSummit/status/2101355676325007652#m
- @a16zcrypto (a16z Crypto, Sat, 10 Oct 2026): This podcast from @a16zcrypto includes an aspect that hasn't been stressed enough. In the end, AI cryptanalysis is a great thing for cryptography as it helps us gain confidence in new assumptions, key sizes (e.g. for new PQ schemes) and more. piped.video/watch?v=k_CoOoDs… Link Can AI Actually Break Cryptography? Experts Weigh In On the FUD AI is getting better at solving hard math problems. But what does t... youtube.com  
  http://nitter.meowing.monster/LindellYehuda/status/2109044174972498268#m
- @KyleSamani (Kyle Samani, Sat, 10 Oct 2026): I wrote my largest angel check ever into Backpack Santiago R Santos (@santiagoroel) Backpack is my highest conviction in crypto — http://nitter.meowing.monster/santiagoroel/status/2108465930397184305#m  
  http://nitter.meowing.monster/KyleSamani/status/2108904590280151392#m
- @jon_durbin (Jon Durbin, Sat, 10 Oct 2026): Amazing work! lium.io (@lium_io) new month in review just dropped. +45% spend +16% active users +106% rentals +11% median rental time +20% charged +32% first time renters +15% providers -32% rental failures — https://nitter.kareem.one/lium_io/status/2108799096182223058#m  
  https://nitter.kareem.one/jon_durbin/status/2108893300178755657#m
- @KyleSamani (Kyle Samani, Sat, 10 Oct 2026): One order book One risk engine Global Luc | Backpack 🎒 (@Luc100k) Backpack one regulated platform everywhere. Video — http://nitter.meowing.monster/Luc100k/status/2108569791359553994#m  
  http://nitter.meowing.monster/KyleSamani/status/2108736102828048405#m
- @KyleSamani (Kyle Samani, Sat, 10 Oct 2026): This ratio will approach infinity soon Luc | Backpack 🎒 (@Luc100k) Backpack Stocks on SOL 45x better execution vs Robinhood chain. Big pipe of liquidity is now flowing from NASDAQ onto Solana. Retweet if you love Backpack stocks on Solana Video — http://nitter.meowing.monster/Luc100k/status/2108211875548910064#m  
  http://nitter.meowing.monster/KyleSamani/status/2108734153604899304#m
- @_redteam_ (RedTeam / Innerworks, Mon, 28 Sep 2026): "We're not afraid of hyper-intelligent bot swarms on the internet. We use them to optimise our technology." When we launched RedTeam almost two years ago we could clearly see where the internet was heading. We've since seen clients with over 90% of their traffic made up of not just automation but highly intelligent bot swarms, capable of bypassing any traditional detection mechanism. The only way to combat a threat like this is to welcome it and learn from it. By constantly ingesting and evolving attack vectors from a hive mind of miners, a Bittensor powered defence has now become the only rel  
  http://nitter.meowing.monster/_redteam_/status/2104643110911533312#m
- @markjeffrey (Mark Jeffrey, Mon, 12 Oct 2026): Hoo boy. Polymarket (@Polymarket) JUST IN: Wall Street analysts warn Anthropic's planned $2 trillion IPO is an "unprecedented test of investor gullibility," claiming the company lacks a viable business model. — http://nitter.meowing.monster/Polymarket/status/2109784465161724277#m  
  http://nitter.meowing.monster/markjeffrey/status/2109791447037944022#m
- @markjeffrey (Mark Jeffrey, Mon, 12 Oct 2026): Powered by Bittensor Carbon (@carbonphysicsai) What is Carbon? A short explainer... (and more detail in the article below) Video — http://nitter.meowing.monster/carbonphysicsai/status/2109373470006001939#m  
  http://nitter.meowing.monster/markjeffrey/status/2109787211910750212#m
- @markjeffrey (Mark Jeffrey, Mon, 12 Oct 2026): Correct. @jason (@Jason) 99% of enterprises &amp; 100% of consumers have no need to solve esoteric math prizes… this is why open source models are going to win the day. — http://nitter.meowing.monster/Jason/status/2109786137531421045#m  
  http://nitter.meowing.monster/markjeffrey/status/2109786836847698043#m
- @markjeffrey (Mark Jeffrey, Mon, 12 Oct 2026): Bittensor subnet tokens are a good beta bet on a Bittensor rally. I'd only look at the ones that haven't pumped yet, with a legit team and real traction  
  http://nitter.meowing.monster/virtualbacon/status/2109774704215241114#m
- @a16zcrypto (a16z Crypto, Mon, 12 Oct 2026): Keeping cryptography research in the dark erodes exactly what makes it great. Our shared conviction in cryptography is earned by giving as many people as possible every opportunity to break it. a16z crypto (@a16zcrypto) The best way to make cryptography stronger is to try to break it. AI can actually build confidence in cryptography, argues Stanford cryptographer Dan Boneh. Video — http://nitter.meowing.monster/a16zcrypto/status/2109728924297220207#m  
  http://nitter.meowing.monster/eddylazzarin/status/2109759137273835580#m
- @a16zcrypto (a16z Crypto, Mon, 12 Oct 2026): full episode: a16z crypto (@a16zcrypto) AI is getting better at solving hard math problems, especially given recent drops. But what does that mean for the cryptography that protects everything from private messages to healthcare to banking and crypto wallets? Stanford cryptographer Dan Boneh, with @eddylazzarin, @SuccinctJT, @liz_harkavy, and @smc90, makes sense of the warnings sounded recently. They cover: - what’s fact vs. assumption - what’s new and what risks cryptographers have long prepared for - where quantum computing doesn't (and does) fit - opportunities for builders Highlights: 00:3  
  http://nitter.meowing.monster/a16zcrypto/status/2109730399186465203#m
- @a16zcrypto (a16z Crypto, Mon, 12 Oct 2026): The best way to make cryptography stronger is to try to break it. AI can actually build confidence in cryptography, argues Stanford cryptographer Dan Boneh. Video  
  http://nitter.meowing.monster/a16zcrypto/status/2109728924297220207#m
- @jtledore (Jean-Thomas Ledoré, Mon, 12 Oct 2026): Video Openτensor Foundaτion (@opentensor) Article Bittensor Ecosystem Highlights :: October 5–11, 2026 This week’s biggest stories across Bittensor came from Lium, Actual, Score, Reliquary, Engy, Beam and Almanac. [ @lium_io - Subnet 51 ] Lium’s GPU utilization reached an all-time high, with most GPU — http://nitter.meowing.monster/opentensor/status/2109285455208337754#m  
  http://nitter.meowing.monster/opentensor/status/2109692385693417656#m
- @jtledore (Jean-Thomas Ledoré, Mon, 12 Oct 2026): The intersection of crypto and AI: $NEAR → Cross-chain infrastructure for agentic commerce $TAO → Open ecosystem for AI Development $WLD → Proof of humanity, co-founded by @sama $VVV → Privacy-preserving AI inference  
  http://nitter.meowing.monster/Grayscale/status/2109680995137929442#m
- @KyleSamani (Kyle Samani, Mon, 12 Oct 2026): What are you favorite sources of finance and business analysis online? Please interpret this question as broadly as possible Examples can include Stratechery Semianalysis Above the crowd (bill gurley's blog) Berkshire letters Oaktree letters a16z and sequoia blogs Citrini Not Boring The Generalist Benedict evans asymco etc  
  http://nitter.meowing.monster/KyleSamani/status/2109655830840947059#m
- @jon_durbin (Jon Durbin, Mon, 12 Oct 2026): There are ~two economies: attention and revenue. Focus on whichever you like but if you only pick one, it probably eventually breaks. Free high intelligence = maximum attention (but probably financial/resource crisis), and conversely maximally expensive commodities restricting access rugs the attention eventually and likewise probably leads to collapse. Parallax and the new "living model" type system created out of it is perhaps a way to foster both by decreasing prices (run on phone, macbook, spark, whatever) rather than increasing them further (with larger and larger models), and ideally mai  
  https://nitter.kareem.one/jon_durbin/status/2109652105216561403#m
- @oroagents (Oro, Mon, 12 Oct 2026): github.com/ORO-AI/assistante… All in the open :) Link GitHub - ORO-AI/assistanteval: AssistantEval: a verifiable benchmark for personal AI assistants AssistantEval: a verifiable benchmark for personal AI assistants - ORO-AI/assistanteval github.com  
  http://nitter.meowing.monster/oroagents/status/2109503153242775934#m
- @_redteam_ (RedTeam / Innerworks, Mon, 07 Sep 2026): Join us this Thursday to discuss all things RedTeam Openτensor Foundaτion (@opentensor) Novelty Search :: Subnet 61 :: @_redteam_ RedTeam turns Bittensor miners into a 24/7 network of ethical hackers. We’ll discuss how SN61 uses that competition to stay ahead of evolving bot attacks, its five new enterprise pilots, and what comes next with RedTeam’s upcoming Immune System. Live on Thursday :: 9PM UTC :: on X + YouTube Hosted by @const_reborn — http://nitter.meowing.monster/opentensor/status/2097022237337682320#m  
  http://nitter.meowing.monster/_redteam_/status/2097023368629191078#m
- @affine_io (Affine, Mon, 07 Sep 2026): A model doesn’t need to be the largest to matter. On Affine, models compete on how well their reasoning supports the next action across code, tool use and math. A winner could put that reasoning to work in products, either directly or alongside a larger model. Video  
  http://nitter.meowing.monster/affine_io/status/2096984627059810338#m
- @PanteraCapital (Pantera Capital, Mon, 05 Oct 2026): Excited to announce I'm joining @PanteraCapital as a Junior Partner! I'll be backing founders building stablecoin payments, fintech x DeFi, and new markets for compute, energy, and more. Thank you to @dan_pantera, @veradittakit, @FranklinBi, @stutireal, Cosmo and the rest of the Pantera team for the trust and the opportunity. It's an honor to join a team that has backed the foundations of onchain finance for over a decade. Huge thank you to @nascent and @delitzer. Nacscent sharpened how I think about DeFi, market structure, and what it takes to build at the edge of finance. I'm grateful for th  
  http://nitter.meowing.monster/JackSimison/status/2107173455489892726#m
- @affine_io (Affine, Fri, 28 Aug 2026): United against the divided. Intelligence knows neither borders nor color. Uphold the torch with us to bring light where it is needed most. Open reasoning for humanity. Join the thousand-year intelligence federation. affine.io scouτ (@scoutesy) The same way neutron stars form gold through merging, affine orchestrates reasoning through open collaboration. Unus pro omnibus, omnes pro uno. Tao of a million symmetries. Video — http://nitter.meowing.monster/scoutesy/status/2093400328062296312#m  
  http://nitter.meowing.monster/affine_io/status/2093401028763013596#m
- @_redteam_ (RedTeam / Innerworks, Fri, 11 Sep 2026): The future of cybersecurity will be dictated by a defender's ability to not only ingest unique attacks, but generate the strains that don't exist yet and ship the detection ahead of them. As the rest of the industry degrades, the largest financial institutions will consolidate on the single provider that can do this at scale. That provider needs a constant supply of unique attacks to work from, and a subnet is the only structure that pays a swarm of attackers to supply them. bittensor:native #SN61 Openτensor Foundaτion (@opentensor) RedTeam is working toward integrations with three banking com  
  http://nitter.meowing.monster/_redteam_/status/2098469688137097632#m


---
_Generated at 2026-10-13T20:58:23.335491+00:00 by scripts/intel/aggregate.py. Treat this digest as input context, not as ground truth. Verify before quoting._
