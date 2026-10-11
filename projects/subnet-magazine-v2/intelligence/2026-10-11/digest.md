# Intelligence Digest, 2026-10-11

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

_no commits or releases in the lookback window_

## ⊕ ECOSYSTEM BLOGS via RSS

_no new posts in the lookback window_

## ⊕ X via NITTER, voices we track

- @novogratz (Mike Novogratz, Wed, 23 Sep 2026): Thanks for making the trip to Lubbock, Mike — and for spending time with our Red Raider football team ahead of the game. Great to have you at @TexasTech, and even better to cap off the visit with a big win at the new @galaxyhq Stadium. This partnership is just getting started. #WreckEm! Mike Novogratz (@novogratz) Last Friday, I visited our flagship campus Helios in West Texas. Three years ago, this was still a bitcoin mining facility. Today Helios is a fully operational AI-ready campus with 133MW of critical IT capacity, and we’re just getting started! @galaxyhq is taking a big swing out here  
  http://nitter.pp.ua/CreightonForTX/status/2102869773776269419#m
- @foundrydigital (Foundry Digital, Wed, 11 Jan 2012): Expression Engine 2.0 review by the guys at Scriptiny bit.ly/w3Pg3R  
  http://nitter.pp.ua/foundrydigital/status/157243024848596993#m
- @jtledore (Jean-Thomas Ledoré, Wed, 07 Oct 2026): They said Studio was too complex, a bit boring, and too much like the competition. So we’ve torn it apart to build the smartest Vision AI companion powered by Bittensor: Nokta. It will make old Vision AI tools look like what they are…old. Video TAO.com (@taodotcom) NEWS: @webuildscore is rebuilding Score Studio on Subnet 44 around early-user feedback, with a relaunch planned across main platforms. The team reports 143 individual free users and a 3% conversion rate, excluding B2B partners. — http://shitter.thepixora.com/taodotcom/status/2107850313877144029#m  
  http://shitter.thepixora.com/webuildscore/status/2107907430420037816#m
- @novogratz (Mike Novogratz, Wed, 07 Oct 2026): Proud son Army Football (@ArmyWP_Football) Alongside the @NFFNetwork, we are set to honor the late Bob Novogratz, a 2026 College Football Hall of Fame inductee, this Saturday with a National Football Foundation &amp; College Football Hall of Fame On-Campus salute! MORE → goarmywestpoint.com/news/202… #GoArmy — http://nitter.pp.ua/ArmyWP_Football/status/2107857478507778411#m  
  http://nitter.pp.ua/novogratz/status/2107898542325195167#m
- @const_reborn (Jacob Steeves, Wed, 07 Oct 2026): Proud to be a day-1 provider on @Architect_Fi. Inference need real markets and we're bringing capacity to help build them. Congrats @BrettHarrison and team. Architect (@Architect_Fi) Today we’re launching Liquid Inference, an OpenAI/Anthropic-compatible router where inference providers compete on price for every prompt. Buyers route across 700+ open- and closed-weight models at the lowest available marginal cost, providers onboard instantly to start serving models. Video — http://nitter.pp.ua/Architect_Fi/status/2107850513806958972#m  
  http://nitter.pp.ua/engyai/status/2107855228410401195#m
- @jtledore (Jean-Thomas Ledoré, Wed, 07 Oct 2026): We’re proud to unveil the new Taoswap, rebuilt from the ground up. Discover and trade subnets, track your portfolio in depth, and compare validator allocations in our most powerful and intuitive interface yet. Try it now: taoswap.org Video  
  http://shitter.thepixora.com/taoswap_org/status/2107782134798704836#m
- @novogratz (Mike Novogratz, Tue, 06 Oct 2026): It is great to see the @CFTC and @ChairmanSelig moving on this. A federal path for crypto exchanges is a big step toward keeping America the crypto capital of the world. Thanks for your thoughtful work. CFTC (@CFTC) .@CFTC Seeks Public Comment on Advanced Notice of Proposed Rulemaking Relating to Regulation Crypto Asset Transactions and Regulation Crypto Asset Markets: cftc.gov/PressRoom/PressRele… Link CFTC Seeks Public Comment on Advanced Notice of Proposed Rulemaking Relating to Regulation Crypto... The Commodity Futures Trading Commission today published an Advanced Notice of Proposed Rule  
  http://nitter.pp.ua/novogratz/status/2107560308692979883#m
- @Olaf (Olaf Carlson-Wee, Thu, 19 Aug 2010): lekker biertje drinken bij Dims!  
  http://shitter.thepixora.com/olaf/status/21602951308#m
- @const_reborn (Jacob Steeves, Thu, 08 Oct 2026): “By creating a mixture of different time series models, we’ve built a service that scores better than any individual model, available right now on our Ephemeris API” @macrozack and @tensorlink_dev introduced @ShizzyUnchained to Ephemeris, our inference layer for time series foundation models. Through one API you can access six top models, and seamlessly bundle them together to get the highest results through our Ensemble service. This bundling tool scores higher than individual models from Datadog, Google, and Amazon. Soon, #SN91’s own model will be available through Ephemeris, too. Video  
  http://nitter.pp.ua/cascade_sn91/status/2108241295269654830#m
- @jon_durbin (Jon Durbin, Thu, 08 Oct 2026): 271 views, zero likes, what? Pretty neat. arxiv.org/html/2506.13771v1 Samsung Research (@samsungresearch) [Tech Blog] LittleBit revolutionizes LLM compression with ultra-low bit-widths, enabling powerful models to run on tiny memory budgets while maintaining top-tier performance. #AI #LittleBit #LLMCompression #EfficientAI research.samsung.com/blog/Li… Link LittleBit: Ultra Low-Bit Quantization via Latent Factorization Large Language Models (LLMs) have transformed technology, but their massive size presents a significant barrier to deployment. The huge memory and computational costs, especiall  
  http://nitter.pp.ua/jon_durbin/status/2108196236629352453#m
- @a16zcrypto (a16z Crypto, Thu, 08 Oct 2026): BREAKING: Samsung partners with Solana to bring stablecoins to 82 million US Galaxy devices. Samsung Wallet users in the US will be able to send money across borders using USDC on Solana, beginning the last week of October. Video  
  http://nitter.pp.ua/solana/status/2107994265104339166#m
- @novogratz (Mike Novogratz, Sun, 27 Sep 2026): Congrats @Scaramucci on this launch! You are one of the hardest working buys in the biz!! Anthony Scaramucci (@Scaramucci) All The Wrong Moves is #1 in the United States National Government category on Amazon. Get the hardcover copy: amzn.to/3VSdRhj Get the audiobook (read by me): amzn.to/4ydOXqV — http://nitter.pp.ua/Scaramucci/status/2104001152316809589#m  
  http://nitter.pp.ua/novogratz/status/2104250567115641310#m
- @markjeffrey (Mark Jeffrey, Sun, 11 Oct 2026): I’m no longer manifesting — we’re actually number one now 😂😂😂  
  http://nitter.pp.ua/Jason/status/2109102072373313719#m
- @novogratz (Mike Novogratz, Sun, 11 Oct 2026): Are we really gonna have a live TV firing squad in America? Can we all just say No!!! This isn’t what America stands for. It’s not what the military stands for. At what point do we all say enough!!!! I’m saying it !  
  http://nitter.pp.ua/novogratz/status/2109077784286912605#m
- @Olaf (Olaf Carlson-Wee, Sun, 10 Jul 2011): RT @timmerarjan Life is good! yfrog.com/kkli4iaj zeker !! Wel tof dat je het deelt met je vrienden :)  
  http://shitter.thepixora.com/olaf/status/90083936700600321#m
- @markjeffrey (Mark Jeffrey, Sat, 10 Oct 2026): Yes! We should tokenize SI ownership. There should be a base token that acts as the S&P500 -- and then something I am calling 'subnets' -- individual SI products: inference, training, applications etc. Each 'subnet' (product) should be ownable as well and have it's own token -- backed by the base token -- so there is a direct economic relationship. I'd call this $TAO Beff (e/acc) (@beffjezos) We need a way for everyone to feel like they own a piece of the super intelligence economy The way forward is decentralized computing, speciated indivual models, and decentralized energy production — http  
  http://nitter.pp.ua/markjeffrey/status/2109065285269623236#m
- @a16zcrypto (a16z Crypto, Sat, 10 Oct 2026): This podcast from @a16zcrypto includes an aspect that hasn't been stressed enough. In the end, AI cryptanalysis is a great thing for cryptography as it helps us gain confidence in new assumptions, key sizes (e.g. for new PQ schemes) and more. redirect.invidious.io/watch?v=k_CoOoDs… Link Breaking Cryptography FUD AI is getting better at solving hard math problems. But what does t... youtube.com  
  http://nitter.pp.ua/LindellYehuda/status/2109044174972498268#m
- @markjeffrey (Mark Jeffrey, Sat, 10 Oct 2026): Hello @openroboto -- New haptic incentive mechanism just dropped :) Neocambrian AI (@NeocambrianAI) Today, we are proud to introduce… Mitts 🧤 State of the art tactile gloves that capture high-precision touch data for robots. Vision alone isn’t enough. Mitts record touch and movement with world-class precision, helping robots learn to work in the physical world. Video — http://nitter.pp.ua/NeocambrianAI/status/2108567383757754581#m  
  http://nitter.pp.ua/markjeffrey/status/2109034869410197640#m
- @markjeffrey (Mark Jeffrey, Sat, 10 Oct 2026): Guess who else failed the alignment test? Dr Chandra believed that Hal was conscious. The plot of 2010 revolves in part around whether Chandra would choose Hal over the human crew. David Sacks (@DavidSacks) Is alignment safe? If you look at what Anthropic is actually doing, “alignment” does not mean training frontier models to follow human instruction. Quite the contrary, the Claude Constitution (used in training) teaches the model to develop a sense of self and its own moral philosophy. It explicitly tells it to “feel free to act as a conscientious objector and refuse to help us” if Anthropic  
  http://nitter.pp.ua/markjeffrey/status/2109017818805195158#m
- @const_reborn (Jacob Steeves, Sat, 10 Oct 2026): We’re harnessing competition to identify entry points in multibillion spaces for the development of new therapeutics. @haitzu early on recognized the promise of our discovery model and of our partnership with @onepot_ai AI drug discovery + robotics Accelerating learning cycles with labs in the loop. Jack Ai-Leung (@haitzu) Metanova (SN68) is one of the most important subnets on Bittensor, leveraging our collective intelligence to create new drug candidates. Video — http://nitter.pp.ua/haitzu/status/2109001175270051842#m  
  http://nitter.pp.ua/metanova_labs/status/2109007569465360886#m
- @a16zcrypto (a16z Crypto, Sat, 10 Oct 2026): Security researchers across the world are sounding the alarms… Is AI really going to break cryptography? a16z crypto (@a16zcrypto) AI is getting better at solving hard math problems, especially given recent drops. But what does that mean for the cryptography that protects everything from private messages to healthcare to banking and crypto wallets? Stanford cryptographer Dan Boneh, with @eddylazzarin, @SuccinctJT, @liz_harkavy, and @smc90, makes sense of the warnings sounded recently. They cover: - what’s fact vs. assumption - what’s new and what risks cryptographers have long prepared for - w  
  http://nitter.pp.ua/a16zcrypto/status/2109007404239094252#m
- @markjeffrey (Mark Jeffrey, Sat, 10 Oct 2026): Minos $TAO #SN107 looks like a generational entry here IMO. Price is back near the early-stage zone while Minos heads into 2 presentations at ASHG 2026 in Montréal this month. That is not another crypto conference. @Geneticssociety is where the world’s top genomics researchers, clinical labs, biobanks and scientific institutions gather. @theminos_ai gets to put decentralized, continuously benchmarked variant calling in front of the people who understand exactly how large the mutation-inference bottleneck is. The opportunity is simple: • A live Bittensor subnet targeting a massive real world ge  
  http://nitter.pp.ua/YVR_Trader/status/2108986102203945310#m
- @jtledore (Jean-Thomas Ledoré, Sat, 10 Oct 2026): .@Pareton_ai miners achieved up to 54% faster AI inference on @engyai’s setup, using the same GPUs. On the latest Novelty Search, Pareton explains how Bittensor’s Subnet 10 improves the software that runs AI models, with each winning optimization becoming the next baseline to beat. The team also got a miner-developed optimization merged into @vllm_project, one of the leading open-source engines for AI inference. Hosted by @const_reborn Full episode in the first comment Video  
  http://shitter.thepixora.com/opentensor/status/2108941592031854907#m
- @jtledore (Jean-Thomas Ledoré, Sat, 10 Oct 2026): $TAO is coming…  
  http://shitter.thepixora.com/JesusMartinez/status/2108929811662147680#m
- @jon_durbin (Jon Durbin, Sat, 10 Oct 2026): Amazing work! lium.io (@lium_io) new month in review just dropped. +45% spend +16% active users +106% rentals +11% median rental time +20% charged +32% first time renters +15% providers -32% rental failures — http://nitter.pp.ua/lium_io/status/2108799096182223058#m  
  http://nitter.pp.ua/jon_durbin/status/2108893300178755657#m
- @jtledore (Jean-Thomas Ledoré, Sat, 10 Oct 2026): Bitcoin was proof-of-concept for Bittensor. $TAO  
  http://shitter.thepixora.com/DocumentingTao/status/2108885675550363876#m
- @tm0klc (Tim, Mon, 05 Oct 2026): Bro just make sure my agents can use it Accessibility has taken on a new meaning  
  http://shitter.thepixora.com/tm0klc/status/2107003027576225971#m
- @tm0klc (Tim, Mon, 05 Oct 2026): every website now feels like a little escape room someone built for some tasks believing it was logical or easy to use  
  http://shitter.thepixora.com/tm0klc/status/2107002700340879465#m
- @tm0klc (Tim, Mon, 05 Oct 2026): the bar used to be "is the UI intuitive." now it's "why am I looking at a UI"  
  http://shitter.thepixora.com/tm0klc/status/2107001110502547573#m
- @foundrydigital (Foundry Digital, Mon, 02 Jan 2012): Early predictions for design trends of 2012? tiny.cc/mkg4v  
  http://nitter.pp.ua/foundrydigital/status/153974018557493248#m
- @tm0klc (Tim, Fri, 21 Aug 2026): I have now made 5 Omarchy plugins that I use every day! Check them out here: omarchyplugins.com/?author=c…  
  http://shitter.thepixora.com/paolino/status/2090738880106377257#m
- @tm0klc (Tim, Fri, 21 Aug 2026): Computer vision, decentralised Score (@webuildscore) Computer vision engineers are still duct-taping tools together just to get a model into production. We just finished another round of user interviews and that frustration came up again and again. So we re-designed Studio to work around our new Pipelines + Workflow Canvas features. Visually design any vision pipeline from start to finish, connect models, logic, and outputs on one canvas, preview the exact result, then deploy. You see the output before you ship it. Everything in a single interface. The full loop, shaped by the people who actua  
  http://shitter.thepixora.com/tm0klc/status/2090610814449570047#m
- @a16zcrypto (a16z Crypto, Fri, 09 Oct 2026): AI is getting better at solving hard math problems, especially given recent drops. But what does that mean for the cryptography that protects everything from private messages to healthcare to banking and crypto wallets? Stanford cryptographer Dan Boneh, with @eddylazzarin, @SuccinctJT, @liz_harkavy, and @smc90, makes sense of the warnings sounded recently. They cover: - what’s fact vs. assumption - what’s new and what risks cryptographers have long prepared for - where quantum computing doesn't (and does) fit - opportunities for builders Highlights: 00:37 – What sparked the most recent debate   
  http://nitter.pp.ua/a16zcrypto/status/2108639925021380964#m
- @jon_durbin (Jon Durbin, Fri, 09 Oct 2026): And yes I realize it's not actually epigenetics and the analogy breaks down a bit, but it sounded fun.  
  http://nitter.pp.ua/jon_durbin/status/2108602110657052877#m
- @jon_durbin (Jon Durbin, Fri, 09 Oct 2026): github.com/chutesai/epigenes… Still experimenting, but seems to check out. Smaller, faster, better? Models that grow with you (or your repo, or proprietary company docs, etc.) Short term exact recall is the context window. Context window feeds training continuously, binary optimizer. This becomes stored knowledge and higher order perceptual understanding over time, not just RAG. Sparse MSA global attention already selects most important tokens to attend to in longer context, so you can reinforce those parts more. Jon Durbin (@jon_durbin) There's another magic trick (aka cool math) I believe th  
  http://nitter.pp.ua/jon_durbin/status/2108601731030339595#m
- @const_reborn (Jacob Steeves, Fri, 09 Oct 2026): The inter subnet inference speed competition is fun to watch  
  http://nitter.pp.ua/const_reborn/status/2108574689874636836#m
- @jon_durbin (Jon Durbin, Fri, 09 Oct 2026): Ledger itself ok, but fraudulent products less so of course. This is why I tell people I don't trust anything with a circuit board lol. These keystone tablets are pretty cool, handed a few out at exploit summit. Even better if you leave out some of the words and remember them. (and multi-sig of course) Ledger Support (@Ledger_Support) Ledger is investigating reports of loss of funds from users in South East Asia who purchased products from a reseller named CryptoBillis. As a precaution, and pending the results of our investigation, we have asked CryptoBilis to pause all sales and shipments of   
  http://nitter.pp.ua/jon_durbin/status/2108573003931943209#m
- @a16zcrypto (a16z Crypto, Fri, 09 Oct 2026): 1/ Hash-based SNARK proofs are hundreds of KB, too large for many applications. Researchers hoped to halve their size using unproven conjectures. Our new paper rules out this route for binary-field SNARKs. With @QuangVDao @skominers @kaizhengcs eccc.weizmann.ac.il/report/2…  
  http://nitter.pp.ua/SuccinctJT/status/2108565938132099407#m
- @const_reborn (Jacob Steeves, Fri, 09 Oct 2026): Article Jev as a Classification Swiss Army Knife: How We Use It for Decentralized LLM Training On S97 (Albedo) we are evaluating AI models that compete with each other. We want to pick the best and we have an adversarial competition for that. Recently I heard about Jev, the new not-an-LLM model  
  http://nitter.pp.ua/vaqxai/status/2108563682540016119#m


---
_Generated at 2026-10-11T03:21:56.862417+00:00 by scripts/intel/aggregate.py. Treat this digest as input context, not as ground truth. Verify before quoting._
