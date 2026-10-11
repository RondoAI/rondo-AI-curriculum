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

- @TargonCompute (Targon, Wed, 30 Sep 2026): NEWS: @TargonCompute says NVIDIA B300 GPUs are now available on demand on Targon. This adds an on-demand Blackwell deployment option. Targon (@TargonCompute) NVIDIA B300s are now available on demand. Secure GPUs are selling out fast on Targon, Ready to deploy on Blackwell? Grab yours now at targon.com/inventory — http://shitter.thepixora.com/TargonCompute/status/2105325236639973561#m  
  http://shitter.thepixora.com/taodotcom/status/2105392902587249005#m
- @polychain (Polychain Capital, Wed, 30 Sep 2026): THE BLOCK: DogeOS launched a public testnet for its zero-knowledge rollup, bringing EVM smart contracts to Dogecoin, with dogecoin:native used for gas fees. "I've spent half a decade encouraging people to take a chance on Dogecoin and to build in its ecosystem," said Timothy Stebbing, director of the Dogecoin Foundation. "My hopes are that DogeOS becomes the springboard for a wave of new utility engineering."  
  http://shitter.thepixora.com/TheBlockCo/status/2105359920795394451#m
- @TargonCompute (Targon, Wed, 30 Sep 2026): NVIDIA B300s are now available on demand. Secure GPUs are selling out fast on Targon, Ready to deploy on Blackwell? Grab yours now at targon.com/inventory  
  http://shitter.thepixora.com/TargonCompute/status/2105325236639973561#m
- @PanteraCapital (Pantera Capital, Wed, 30 Sep 2026): The next evolution of tokenization is here. Pantera’s latest State of Tokenization report highlights Ondo Intelligent Portfolios as the next step beyond individual tokenized stocks. “An entire portfolio becomes a single transferable token.” What this delivers: → DeFi composability → Multiple assets in one holding → Scheduled rebalancing via smart contracts With its first three portfolios powered by BlackRock, Ondo Intelligent Portfolios brings institutional investment strategies onchain. The next chapter of tokenization will expand what investors can access, how they build portfolios, and how   
  http://shitter.thepixora.com/Ondo/status/2105305938945057014#m
- @polychain (Polychain Capital, Wed, 24 Jun 2026): EXCLUSIVE: a16z CSX-backed Cambrian raises $6 million seed to build blockchain data oracle network theblock.co/post/406028/a16z… Link a16z CSX-backed Cambrian raises $6 million seed to build blockchain data oracle network Cambrian’s new funding will expand its API and verifiable oracle network for institutions and AI agents, with Base and Solana already in production. theblock.co  
  http://shitter.thepixora.com/TheBlockCo/status/2069827932843909349#m
- @novogratz (Mike Novogratz, Wed, 23 Sep 2026): Thanks for making the trip to Lubbock, Mike — and for spending time with our Red Raider football team ahead of the game. Great to have you at @TexasTech, and even better to cap off the visit with a big win at the new @galaxyhq Stadium. This partnership is just getting started. #WreckEm! Mike Novogratz (@novogratz) Last Friday, I visited our flagship campus Helios in West Texas. Three years ago, this was still a bitcoin mining facility. Today Helios is a fully operational AI-ready campus with 133MW of critical IT capacity, and we’re just getting started! @galaxyhq is taking a big swing out here  
  http://nitter.pp.ua/CreightonForTX/status/2102869773776269419#m
- @novogratz (Mike Novogratz, Wed, 23 Sep 2026): Thanks for making the trip to Lubbock, Mike — and for spending time with our Red Raider football team ahead of the game. Great to have you at @TexasTech, and even better to cap off the visit with a big win at the new @galaxyhq Stadium. This partnership is just getting started. #WreckEm! Mike Novogratz (@novogratz) Last Friday, I visited our flagship campus Helios in West Texas. Three years ago, this was still a bitcoin mining facility. Today Helios is a fully operational AI-ready campus with 133MW of critical IT capacity, and we’re just getting started! @galaxyhq is taking a big swing out here  
  http://shitter.thepixora.com/CreightonForTX/status/2102869773776269419#m
- @foundrydigital (Foundry Digital, Wed, 11 Jan 2012): Expression Engine 2.0 review by the guys at Scriptiny bit.ly/w3Pg3R  
  http://nitter.pp.ua/foundrydigital/status/157243024848596993#m
- @nigescore (Nige, Wed, 09 Sep 2026): .@nigescore going to paris last time he went to nrf in dallas he got us our biggest client ever (not announced yet) i can’t go. got something bigger on the 15th, 16th and 17th (to be announced) Manako (@manakoai) Heading to @nrfeurope NRF Retail’s Big Show Europe in Paris next week (15–17 Sept) 🇫🇷 If you are attending and want to hear what Manako Labs have built for retail, please DM and let’s meet up. No new hardware, no engineers, no code just your existing cameras doing more. #NRFRetailsBigShowEurope — http://shitter.thepixora.com/manakoai/status/2097622722310242420#m  
  http://shitter.thepixora.com/MaxSebti/status/2097630699129827589#m
- @taomedia_ (TAO Media, Wed, 07 Oct 2026): ✏️ Story by @bart_hillerich Read about @actualinc on our website: tao.media/actual-computer-re… Link Actual Computer Releases toks Tokenizer With Claimed 13x to 151x Speedup Over Hugging Face The Bittensor Subnet 95 team says toks delivers exact Hugging Face token IDs while staying free for organizations below one quadrillion tokens a year. tao.media  
  http://nitter.pp.ua/taomedia_/status/2107956959928299813#m
- @taomedia_ (TAO Media, Wed, 07 Oct 2026): Article Actual Computer Releases toks Tokenizer With Claimed 13x to 151x Speedup Over Hugging Face The Bittensor Subnet 95 team says toks delivers exact Hugging Face token IDs while staying free for organizations below one quadrillion tokens a year. @actualinc, the team behind Bittensor  
  http://nitter.pp.ua/taomedia_/status/2107956816865116195#m
- @dylan522p (Dylan Patel, Wed, 07 Oct 2026): A $200 AI subscription can be worth $12,000 in tokens. Which plan delivers it is not close. "They're selling to willing buyers at the fair market price. This is capitalism." "You can pay $200 for a Claude plan and get $12,000 of Opus 5.5 tokens at API pricing. So that's obviously a good deal." "You have to say the $200 plan, when running a particular workload on a particular model, gives you some dollar amount. But then you also have 5.5, which is a beast. $6K or $5,000 worth of value." "And when you do that comparison, it's not even a question of who's providing more value. ChatGPT versus Ant  
  http://nitter.pp.ua/SemiAnalysis_/status/2107950798638354671#m
- @taomedia_ (TAO Media, Wed, 07 Oct 2026): Article Hark Launches Hark Pro as AI Personal Operating System for Web and Mobile 🤖 Hark Pro combines a memory layer, computer-use agent, proactive suggestions, and encrypted storage in a free app for web, iOS, and Android. Hark, the personal AI startup founded by  
  http://nitter.pp.ua/taomedia_/status/2107937708522058150#m
- @ridges_ai (Ridges, Wed, 07 Oct 2026): You shouldn’t have to solve every kind of problem to contribute to Ridges. Each Niche isolates a specialist skill, and challenges miners to optimize against it. Use what you’re good at. Keep improving. What can you bring to #SN62? @KibibyteMe on @VenturaLabs @exploitsummit Video  
  http://shitter.thepixora.com/ridges_ai/status/2107937543891439634#m
- @jtledore (Jean-Thomas Ledoré, Wed, 07 Oct 2026): They said Studio was too complex, a bit boring, and too much like the competition. So we’ve torn it apart to build the smartest Vision AI companion powered by Bittensor: Nokta. It will make old Vision AI tools look like what they are…old. Video TAO.com (@taodotcom) NEWS: @webuildscore is rebuilding Score Studio on Subnet 44 around early-user feedback, with a relaunch planned across main platforms. The team reports 143 individual free users and a 3% conversion rate, excluding B2B partners. — http://shitter.thepixora.com/taodotcom/status/2107850313877144029#m  
  http://shitter.thepixora.com/webuildscore/status/2107907430420037816#m
- @novogratz (Mike Novogratz, Wed, 07 Oct 2026): Proud son Army Football (@ArmyWP_Football) Alongside the @NFFNetwork, we are set to honor the late Bob Novogratz, a 2026 College Football Hall of Fame inductee, this Saturday with a National Football Foundation &amp; College Football Hall of Fame On-Campus salute! MORE → goarmywestpoint.com/news/202… #GoArmy — http://nitter.pp.ua/ArmyWP_Football/status/2107857478507778411#m  
  http://nitter.pp.ua/novogratz/status/2107898542325195167#m
- @novogratz (Mike Novogratz, Wed, 07 Oct 2026): Proud son Army Football (@ArmyWP_Football) Alongside the @NFFNetwork, we are set to honor the late Bob Novogratz, a 2026 College Football Hall of Fame inductee, this Saturday with a National Football Foundation &amp; College Football Hall of Fame On-Campus salute! MORE → goarmywestpoint.com/news/202… #GoArmy — http://shitter.thepixora.com/ArmyWP_Football/status/2107857478507778411#m  
  http://shitter.thepixora.com/novogratz/status/2107898542325195167#m
- @lium_io (Lium, Wed, 07 Oct 2026): dashboard here: grafana.lium.io/d/gpu-demand…  
  http://nitter.pp.ua/lium_io/status/2107896491008209332#m
- @lium_io (Lium, Wed, 07 Oct 2026): Utilization is at an all time high, we are fully rented out of most GPU types on our platform. This is a call for anyone with spare GPUs to rent them out through lium! The process is super simple and you get paid 95%+ of rental fees + payments even while unrented! The full setup is less than 10 minutes. start here: provider.lium.io/  
  http://nitter.pp.ua/lium_io/status/2107895913930768749#m
- @taomedia_ (TAO Media, Wed, 07 Oct 2026): Nous Research just raised a $90M Series B at a $1.5B valuation to turn its MIT-licensed Hermes Agent from a developer favorite into an enterprise-ready AI assistant. Full details ↓ tao.media/nous-research-rais… Link Nous Research Raises $90M Series B at $1.5B Valuation to Expand Hermes to Enterprise Robot Ventures-led round backs the open-source Hermes agent as Nous pushes enterprise controls while keeping the core MIT-licensed. tao.media  
  http://nitter.pp.ua/taomedia_/status/2107888082838294818#m
- @BarrySilbert (Barry Silbert, Wed, 07 Oct 2026): Mike built @FoundryServices into an industry leader, assembled a world-class team, and helped cement US leadership in Bitcoin mining. His impact on the industry is remarkable Grateful for everything @colyermike contributed over his 7 years and his support through the transition Foundry (@FoundryServices) Today we announced that @colyermike is stepping down as CEO of Foundry after 7 years. Mike built Foundry from 1 employee into the operator of the world's largest Bitcoin mining pool. He will remain with Foundry for six months as a strategic advisor to support the transition. — http://shitter.t  
  http://shitter.thepixora.com/BarrySilbert/status/2107871862823039077#m
- @const_reborn (Jacob Steeves, Wed, 07 Oct 2026): Proud to be a day-1 provider on @Architect_Fi. Inference need real markets and we're bringing capacity to help build them. Congrats @BrettHarrison and team. Architect (@Architect_Fi) Today we’re launching Liquid Inference, an OpenAI/Anthropic-compatible router where inference providers compete on price for every prompt. Buyers route across 700+ open- and closed-weight models at the lowest available marginal cost, providers onboard instantly to start serving models. Video — http://nitter.pp.ua/Architect_Fi/status/2107850513806958972#m  
  http://nitter.pp.ua/engyai/status/2107855228410401195#m
- @BarrySilbert (Barry Silbert, Wed, 07 Oct 2026): Yuma Large Cap Fund up 64.6% since launch, vs 48% for $TAO This fund has done particularly well in the last few months with the increasing concentration of emissions to the highest price (generally largest) subnets Yuma (@YumaGroup) The Yuma Large Cap Fund gained 29.0% in September on a USD basis, as its larger subnet holdings outperformed the broader subnet market. It was Yuma's strongest fund in Q3, up 64.6% vs. 48.0% for bittensor:native. The fund's composition is analogous to how the Mag 7 represent a concentrated allocation to dominant technology companies in public markets. Learn more ab  
  http://shitter.thepixora.com/GSchvey/status/2107838125187993700#m
- @BarrySilbert (Barry Silbert, Wed, 07 Oct 2026): The Yuma Large Cap Fund gained 29.0% in September on a USD basis, as its larger subnet holdings outperformed the broader subnet market. It was Yuma's strongest fund in Q3, up 64.6% vs. 48.0% for bittensor:native. The fund's composition is analogous to how the Mag 7 represent a concentrated allocation to dominant technology companies in public markets. Learn more about Yuma Asset Management funds at go.yumaai.com/utdUl Disclosure in thread.  
  http://shitter.thepixora.com/YumaGroup/status/2107825978659488218#m
- @PanteraCapital (Pantera Capital, Wed, 07 Oct 2026): Compliance can stay at issuance while tokenized assets become easier to trade, move across networks, and use in DeFi. That is where tokenized products improved in Q2, per @PanteraCapital, through changes in distribution, transferability, settlement, and composability.  
  http://shitter.thepixora.com/centrifuge/status/2107795631662391628#m
- @jtledore (Jean-Thomas Ledoré, Wed, 07 Oct 2026): We’re proud to unveil the new Taoswap, rebuilt from the ground up. Discover and trade subnets, track your portfolio in depth, and compare validator allocations in our most powerful and intuitive interface yet. Try it now: taoswap.org Video  
  http://shitter.thepixora.com/taoswap_org/status/2107782134798704836#m
- @TargonCompute (Targon, Tue, 29 Sep 2026): The Manifold team is enjoying Montreal at Exploit Summit, where we're announcing new features and roadmaps. As part of our new release rollout, we've launched Bare Metal and Sandboxes on Targon: a full physical machine when you need the whole box, and disposable Linux environments when you don't. Thanks for building with us.  
  http://shitter.thepixora.com/manifoldlabs/status/2105007116033409172#m
- @polychain (Polychain Capital, Tue, 15 Sep 2026): It's time for a new foundation. Not a new start. Legacy Mode is live on Passport, keep every account you already have, on code anyone can inspect. Switch to open source hardware and software while keeping your existing accounts for supported assets. Here’s how. 🧵 Video  
  http://shitter.thepixora.com/FoundationHQ/status/2099865846101180499#m
- @nigescore (Nige, Tue, 15 Sep 2026): The physical world still can’t talk to software. A billion cameras watch factories, stations, warehouses, and stores every second. Almost none of that footage becomes action. That’s what we build at Manako. Today we join F/ai at @joinstationf The program that put OpenAI, Anthropic, Google, Meta, Microsoft and top-tier VCs behind a handful of AI-native teams. Honoured. Focused. Shipping.  
  http://shitter.thepixora.com/manakoai/status/2099861562882203822#m
- @nigescore (Nige, Tue, 08 Sep 2026): Astra Ultra did not cook sports-grade vision AI. Gave it a 30s football clip from our subnet private track. Frame-level events, JSON, annotated video. Ground truth and the published scoring rules only after it committed. 22 predictions. 17 real events. 15 inside the action windows. 7 extras. 2 misses. Precision 68.18%. Recall 88.24%. F1 76.92%. Our Bittensor eval, SN44: 0%. Matches after timing decay: 16.538 False positives: −20.300 GT weight: 25.600 score = max(0, (16.538 − 20.300) / 25.600) = 0 Three extra take-ons and two extra tackles were 14.6 penalty points. It also misread the late inte  
  http://shitter.thepixora.com/webuildscore/status/2097261685358596399#m
- @resilabsai (RESI, Tue, 07 Apr 2026): The power of holding Bittensor $TAO subnet alpha Here is an example to illustrate the flywheel of $TAO Let's say you 1,000 alpha of @resilabsai which cost around 7 $TAO 7 $TAO at a price of $310 = $2,170 Current alpha price of Resi, subnet 46: .0066 $TAO Let's make some calculated assumptions. &gt; price of resi alpha stays the same for 3 years &gt; price of $TAO remains the same at $310 &gt; APY for holding Resi alpha is 40% for the first 2 years, then 30% in year 3 What is my total value in 3 years? Year 1 (40% APY) 1,060.6 × 1.4 = 1,484.8 alpha In $TAO: 1,484.8 × 0.0066 ≈ 9.80 $TAO In USD:   
  http://shitter.thepixora.com/Pop_Collapse/status/2041570023823528017#m
- @dylan522p (Dylan Patel, Tue, 06 Oct 2026): Mistral 4 is pretty good at lawyer bench and cyber security bench, but give it's European heritage, one can only assume it's also good at regulation bench Mistral AI (@MistralAI) Meet Mistral Large 4, aka Le Chonk. • 1T parameters, natively multimodal. 49B active. It is the best open weights model from US or Europe on aggregated benchmarks. • State-of-the-art on critical workloads, including cyber defense, manufacturing and finance and it surpasses closed frontier models on visual grounding. • Forged in Europe end-to-end and is deployable from Europe via our own Mistral Cloud infrastructure. •  
  http://nitter.pp.ua/dylan522p/status/2107602988911260012#m
- @TargonCompute (Targon, Tue, 06 Oct 2026): Had an awesome time last week representing @TargonCompute in Montreal for @ExploitSummit! I always leave any conference with Bittensor folks feeling even more bullish, the energy that this community has is contagious. Great seeing old friends and making some new ones, future is bright!  
  http://shitter.thepixora.com/the_mattyk/status/2107600206527369682#m
- @novogratz (Mike Novogratz, Tue, 06 Oct 2026): It is great to see the @CFTC and @ChairmanSelig moving on this. A federal path for crypto exchanges is a big step toward keeping America the crypto capital of the world. Thanks for your thoughtful work. CFTC (@CFTC) .@CFTC Seeks Public Comment on Advanced Notice of Proposed Rulemaking Relating to Regulation Crypto Asset Transactions and Regulation Crypto Asset Markets: cftc.gov/PressRoom/PressRele… Link CFTC Seeks Public Comment on Advanced Notice of Proposed Rulemaking Relating to Regulation Crypto... The Commodity Futures Trading Commission today published an Advanced Notice of Proposed Rule  
  http://nitter.pp.ua/novogratz/status/2107560308692979883#m
- @novogratz (Mike Novogratz, Tue, 06 Oct 2026): It is great to see the @CFTC and @ChairmanSelig moving on this. A federal path for crypto exchanges is a big step toward keeping America the crypto capital of the world. Thanks for your thoughtful work. CFTC (@CFTC) .@CFTC Seeks Public Comment on Advanced Notice of Proposed Rulemaking Relating to Regulation Crypto Asset Transactions and Regulation Crypto Asset Markets: cftc.gov/PressRoom/PressRele… Link CFTC Seeks Public Comment on Advanced Notice of Proposed Rulemaking Relating to Regulation Crypto... The Commodity Futures Trading Commission today published an Advanced Notice of Proposed Rule  
  http://shitter.thepixora.com/novogratz/status/2107560308692979883#m
- @PanteraCapital (Pantera Capital, Tue, 06 Oct 2026): Chinese vendors made up nearly all humanoid shipments in the first half of 2026. @BrookeDiPalma from @YahooFinance had OpenMind founder and CEO Jan Liphardt on to discuss this topic in a live segment earlier this week. @JanLiphardt says there’s “no question” China dominates the supply chain for advanced physical AI, and breaks down how the US can catch up in the global robotics race in the next 2 years. Read the post here: finance.yahoo.com/video/does… Video  
  http://shitter.thepixora.com/openmind_agi/status/2107560085539164379#m
- @BarrySilbert (Barry Silbert, Tue, 06 Oct 2026): Yuma CRO @EvanMalanga chats with @JesusMartinez on Bittensor's past and future, why @DCGco originally got involved with the ecosystem, and the distinct parallels among bittensor:native, zcash:native, and bitcoin:native Jesus Martinez (@JesusMartinez) I sat down w/ @YumaGroup, a DCG subsidiary to chat the institutional side of $TAO &amp; why they decided to enter the ecosystem: Video — http://shitter.thepixora.com/JesusMartinez/status/2107138753714098469#m  
  http://shitter.thepixora.com/YumaGroup/status/2107540195562193136#m
- @dylan522p (Dylan Patel, Tue, 06 Oct 2026): "And antisemitism will be dead in about 6 months once Sydney Sweeney converts so don't worry bout it" - @Chaimeisenberg Incredible things are happening in SemiAnalysis Slack  
  http://nitter.pp.ua/dylan522p/status/2107528182836646177#m
- @TargonCompute (Targon, Tue, 06 Oct 2026): Last week in Montreal, we sat down with a few of our fellow builders working to push the boundaries of permissionless intelligence on Bittensor. Innovation is happening rapidly, and we're proud to be shipping alongside such a talented group of passionate leaders. Thank you to everyone who joined us, we look forward to continue accelerating the growth and capabilities of decentralized AI.  
  http://shitter.thepixora.com/TargonCompute/status/2107495956795019424#m
- @manakoai (Manako, Tue, 06 Oct 2026): 124 unmanned forecourts. 5 minutes to deploy each. Manako Labs is rolling out across @Avia_France Thevenin & Ducrot unmanned stations in France. “It’s about turning what we see into meaningful action,” says Guillaume Boussaroque of Avia Thevenin & Ducrot. 👉 manako.ai/blog/bringing-phys…  
  http://shitter.thepixora.com/manakoai/status/2107463568962544029#m
- @BarrySilbert (Barry Silbert, Tue, 06 Oct 2026): What BitTorrent did for files, we want to do for AI inference. Antseed lets anyone buy and sell access to AI models, on their own terms. The Antseed Foundation has raised $2.4M in a token round led by Spark Capital to help make that happen. Video  
  http://shitter.thepixora.com/AmosMeiri/status/2107459165207593046#m
- @dippy_ai (Dippy AI, Thu, 30 Jul 2026): Excited to have helped @PrunaAI collect 1M+ votes for image preference data in a very short time :~) Pruna AI (@PrunaAI) P-Image-Ideogram dominate the speed-quality and price-quality Pareto frontiers for image generation. It is the result of a unique collaboration with @ideogram_ai. - Four modes (Very low, low, medium, high) for 1K-2K image generation. - Optimal quality-efficiency with 0.4s-7.5s latency, and $0.003-$0.03 price. - Structured JSON control & exact color control. Available via our inference partners @Replicate @inference_sh @scenario_gg @wavespeed_ai @wiroai @magnific @prodialabs   
  http://shitter.thepixora.com/datapointai/status/2082837314603032606#m
- @dippy_ai (Dippy AI, Thu, 27 Aug 2026): we have significantly upgraded both the basic and super models 🤩🤩 we have also made optimizations to improve response speeds by upto 5x can't wait for you all to experience and enjoy the new dippy 📯📯😸 rolling out to everyone today  
  http://shitter.thepixora.com/dippy_ai/status/2093089771824226802#m
- @polychain (Polychain Capital, Thu, 25 Jun 2026): Article The Missing AI Layer Is Not Security. It&apos;s Authority. AI agents are now computer users. They browse websites. They read files. They write code. They call APIs. They log in to accounts. They handle credentials, use tools, and take actions across software  
  http://shitter.thepixora.com/zherbert/status/2070178183333171395#m
- @Olaf (Olaf Carlson-Wee, Thu, 19 Aug 2010): lekker biertje drinken bij Dims!  
  http://shitter.thepixora.com/olaf/status/21602951308#m
- @Olaf (Olaf Carlson-Wee, Thu, 19 Aug 2010): lekker biertje drinken bij Dims!  
  http://nitter.pp.ua/olaf/status/21602951308#m
- @polychain (Polychain Capital, Thu, 13 Aug 2026): LBTC proved demand for yield-bearing Bitcoin. Today, we double down on that thesis. LBTC is moving to institutional yield. @Bitwise will manage a covered-call options strategy with a 4.5-year legacy track record, to generate LBTC's yield, targeting 2.5% net APY paid in Bitcoin.  
  http://shitter.thepixora.com/Lombard_Finance/status/2087887552300933626#m
- @ridges_ai (Ridges, Thu, 08 Oct 2026): $0.29. That’s the current inference budget for a Ridges problem. Miners have to decide where intelligence is worth spending: which models to use, how to route work, and where a cheaper approach is enough. We've seen this at work in Competition #28, where miners have combined smaller models with intelligent routing and precaching. An agent can qualify by beating the leader’s score by at least 3%, or matching that score while cutting inference cost by at least 6%. The search isn’t just for a stronger coding agent. It’s for a better way to use intelligence.  
  http://shitter.thepixora.com/ridges_ai/status/2108290090317619237#m
- @PanteraCapital (Pantera Capital, Thu, 08 Oct 2026): Today, we're announcing $37.5M in new funding, led by @BainCapCrypto, bringing our total capital raised to over $180M. This investment will help us expand Bitcoin-denominated life insurance to families across Asia, Europe, and the Middle East. Video  
  http://shitter.thepixora.com/meanwhile/status/2108252790451826702#m
- @manakoai (Manako, Thu, 08 Oct 2026): We partnered with @Founders_Forum for today’s event, usually hosted in Berlin, but this time bringing its community to Paris. Paris is increasingly becoming a place where ambitious founders, investors and AI leaders are coming together to build what’s next. Shoutout to Manako, one of our f/ai companies building vision AI for the physical world. Their expert models are reportedly 400x more efficient than generalist ones for narrow tasks like vehicle detection, already deployed across hundreds of thousands of retail and commercial sites in the US. A reminder that the next frontier of AI will be   
  http://shitter.thepixora.com/joinstationf/status/2108241431269654578#m


---
_Generated at 2026-10-11T17:13:12.817196+00:00 by scripts/intel/aggregate.py. Treat this digest as input context, not as ground truth. Verify before quoting._
