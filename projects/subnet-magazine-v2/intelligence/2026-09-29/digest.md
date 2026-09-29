# Intelligence Digest, 2026-09-29

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

- @oroagents (Oro, Tue, 22 Sep 2026): Check out our latest article for how we are approaching benchmarks and evals as the incentive layer on Bittensor - ORO (@oroagents) The team has been hard at work building ORO Bench and we're excited to share this with the world today. Now powering SN15 on Bittensor. Article ORO Bench The ORO model: Eval as an Incentive Mechanism Subnet owners that are testing agent capabilities should be thinking about their validation as EVAL as an incentive mechanism (EAAIM). If you build a — http://shitter.thepixora.com/oroagents/status/2102473778509087203#m  
  http://shitter.thepixora.com/oroagents/status/2102477102453055786#m
- @oroagents (Oro, Tue, 22 Sep 2026): We're excited to announce ORO Bench today, a benchmark that's powered by a generator creating new synthetic shopping environments everyday. This is now powering our subnet on Bittensor, SN15. Video  
  http://shitter.thepixora.com/oroagents/status/2102475717367963815#m
- @oroagents (Oro, Tue, 22 Sep 2026): The team has been hard at work building ORO Bench and we're excited to share this with the world today. Now powering SN15 on Bittensor. Article ORO Bench The ORO model: Eval as an Incentive Mechanism Subnet owners that are testing agent capabilities should be thinking about their validation as EVAL as an incentive mechanism (EAAIM). If you build a  
  http://shitter.thepixora.com/oroagents/status/2102473778509087203#m
- @resilabsai (RESI, Tue, 07 Apr 2026): The power of holding Bittensor $TAO subnet alpha Here is an example to illustrate the flywheel of $TAO Let's say you 1,000 alpha of @resilabsai which cost around 7 $TAO 7 $TAO at a price of $310 = $2,170 Current alpha price of Resi, subnet 46: .0066 $TAO Let's make some calculated assumptions. &gt; price of resi alpha stays the same for 3 years &gt; price of $TAO remains the same at $310 &gt; APY for holding Resi alpha is 40% for the first 2 years, then 30% in year 3 What is my total value in 3 years? Year 1 (40% APY) 1,060.6 × 1.4 = 1,484.8 alpha In $TAO: 1,484.8 × 0.0066 ≈ 9.80 $TAO In USD:   
  http://shitter.thepixora.com/Pop_Collapse/status/2041570023823528017#m
- @_redteam_ (RedTeam / Innerworks, Thu, 27 Aug 2026): The Immune System for the Internet. Releasing next month. Oscar Hayek (@oscar_hayek) Defence in this era must be AI driven, the absolute baseline is adapting defences faster than attacks are being produced. Anything slower than this leaves you in a constant state of degradation. What we’ve built on @_redteam_ is an immune system for this problem. The attacks we ingest are evolved inside the system into complete novel vectors that cannot be produced anywhere else. Every one of these gets patched before an external attacker has the means/ability to create it, let alone release it. bittensor:nati  
  http://shitter.thepixora.com/_redteam_/status/2093081017145847826#m
- @a16zcrypto (a16z Crypto, Thu, 24 Sep 2026): “We can now be that regulated partner for all of the largest financial institutions in and outside of the U.S., who want to launch products here.” – @Bastion CEO Nassim Eddequiouaq Bastion (@Bastion) Bastion is the regulated stablecoin infrastructure provider behind global enterprises and financial institutions. As enterprises bring stablecoins into their products and payment flows, they need infrastructure that can support them at scale while meeting the standards their regulators, auditors, and risk committees expect. Our preliminary conditional approval from the OCC for a national trust ban  
  http://nitter.jaydenha.uk/a16zcrypto/status/2103212956259668294#m
- @Olaf (Olaf Carlson-Wee, Thu, 19 Aug 2010): lekker biertje drinken bij Dims!  
  http://shitter.thepixora.com/olaf/status/21602951308#m
- @_redteam_ (RedTeam / Innerworks, Thu, 10 Sep 2026): I am pleased to announce that Stillcore Capital @stillcorecap has invested in Red Team @_redteam_ Bittensor $TAO Subnet 61.  
  http://shitter.thepixora.com/markjeffrey/status/2098171401152971021#m
- @jtledore (Jean-Thomas Ledoré, Sun, 27 Sep 2026): More in 10 years Dervish (@kundunsan) $TAO to $4700 — http://shitter.thepixora.com/kundunsan/status/2104113461420536004#m  
  http://shitter.thepixora.com/jtledore/status/2104332542241304892#m
- @jtledore (Jean-Thomas Ledoré, Sun, 27 Sep 2026): I used to be a bitcoin:native maxi. Now, I'm a bitcoin:native and bittensor:native maxi. @Jason gets it. @jason (@Jason) I have nothing to do with any meme coins and never will — I am a fan of bitcoin:native and bittensor:native and sometimes talk about those two projects. Memecoins are a giant scam and if the people running them successfully send money to my accounts I will donate the money to a good cause. For the truly gullible, I will obviously never ask you to buy, sell or trade anything — especially on social media or via DM 🤦😂 — http://shitter.thepixora.com/Jason/status/2103897137767448  
  http://shitter.thepixora.com/LordRagnarao/status/2104188764159455291#m
- @jtledore (Jean-Thomas Ledoré, Sun, 27 Sep 2026): Article Bittensor Ecosystem Highlights :: September 20–27, 2026 This week’s biggest stories across Bittensor came from OpenRoboto, Chutes, Good Morning, Reliquary, Hippius, Score and Bitcast. [ @openroboto - Subnet 80 ] OpenRoboto launched Shift, a platform for  
  http://shitter.thepixora.com/opentensor/status/2104185610520957421#m
- @Olaf (Olaf Carlson-Wee, Sun, 10 Jul 2011): RT @timmerarjan Life is good! yfrog.com/kkli4iaj zeker !! Wel tof dat je het deelt met je vrienden :)  
  http://shitter.thepixora.com/olaf/status/90083936700600321#m
- @jtledore (Jean-Thomas Ledoré, Sat, 28 Feb 2026): You don't own enough $TAO  
  http://shitter.thepixora.com/BarrySilbert/status/2027548944968843726#m
- @webuildscore (Score, Sat, 26 Sep 2026): Gordon Ramsay with kids vs Gordon Ramsay with adults. Our Fire and Smoke Detector caught the fire in both. If you need strong detection models, don't be an idiot sandwich. Use Score Studio. Try it here: scorestudio.ai Video  
  http://shitter.thepixora.com/webuildscore/status/2103877473012203889#m
- @webuildscore (Score, Sat, 26 Sep 2026): This one hits hard Millie (@AltcoinMillie) 🐐 $TAO — http://shitter.thepixora.com/AltcoinMillie/status/2103864269141844002#m  
  http://shitter.thepixora.com/webuildscore/status/2103870090122764752#m
- @resilabsai (RESI, Sat, 18 Apr 2026): Traditional centralized real estate data platforms are fundamentally flawed and often serve to extract wealth from users. @resilabsai (Subnet 46) is breaking this monopoly through decentralized AI technology that delivers up to 99% valuation accuracy. Skip the corporate intermediaries—this AI-powered home valuation tool provides the most reliable housing market forecasts for 2026 Video SEBY (@sebyrubino) The @resilabsai Portal is LIVE! Any agent or real estate professional can now easily access our SOTA remote appraisals. We built RESI as a compounding network that will naturally accelerate in  
  http://shitter.thepixora.com/3rdeye_rav3n/status/2045362275045753234#m
- @jon_durbin (Jon Durbin, Sat, 12 Sep 2026): Now we accelerate. Dario Amodei (@DarioAmodei) We Must Pace the Frontier: I’ve written a new essay on why the AI industry should slow down, with a three-part plan for doing so. Anthropic is unilaterally committing to the first of these steps. We’ll provide third-party evaluators with permanent, employee-level access to our systems, so that they can verify adherence to our safety measures, report on incidents, and assess models’ alignment during training. You can read the full post here: darioamodei.com/post/we-must… Link Dario Amodei — We Must Pace the Frontier darioamodei.com — http://nitter.  
  http://nitter.jaydenha.uk/jon_durbin/status/2098847739417129280#m
- @jon_durbin (Jon Durbin, Sat, 12 Sep 2026): mortal enemies find agreement in one thing: that the ladder should be pulled up behind them. Pepsi "vs" Coke Sam Altman (@sama) I agree with Dario that we need to pace the frontier. This has been a primary topic of discussions we've had at OpenAI in recent weeks. Committing to having independent evaluators with employee-like access is a great idea, and we will do the same. We'll have more to share soon. — http://nitter.jaydenha.uk/sama/status/2098811563415150910#m  
  http://nitter.jaydenha.uk/const_reborn/status/2098818933318963365#m
- @jon_durbin (Jon Durbin, Sat, 12 Sep 2026): 4 nodes down already in 2 days - Friends don't let friends build infra on RTX 5090s (unless you're stress testing). Jon Durbin (@jon_durbin) And if you're wondering why I used 5090s for this, it's because they are the worst GPUs on earth for stability at this utilization and have like 50% failure rate in my experience thus far (at least 1 of 8 dropping off bus or producing NaNs randomly etc.). Stress test. — http://nitter.jaydenha.uk/jon_durbin/status/2098102402255655260#m  
  http://nitter.jaydenha.uk/jon_durbin/status/2098733447481110860#m
- @resilabsai (RESI, Sat, 08 Aug 2026): Attention Res Labs we have some really exciting news and updates to our project join our discord to stay up to date: discord.gg/TBj8q9vb2Q #bittensor #TAO bittensor:native #reslabs #reilabsai #crypto #subnet #subnet46 #reslabs_ai #reslabsai #opentensor #reptides  
  http://shitter.thepixora.com/resilabsai/status/2085900662139744548#m
- @markjeffrey (Mark Jeffrey, Mon, 28 Sep 2026): I am pleased to announce that Stillcore Capital @stillcorecap has invested in @lium_io (lium.io) (Bittensor Subnet 51) bittensor:native  
  http://shitter.thepixora.com/markjeffrey/status/2104706832778592365#m
- @markjeffrey (Mark Jeffrey, Mon, 28 Sep 2026): Training and inference will run on the edge, by miners, myopically seeking energy wells like they do with Bitcoin mining. @jon_durbin presenting the future and how humanity gets there.  
  http://shitter.thepixora.com/const_reborn/status/2104692770149736953#m
- @markjeffrey (Mark Jeffrey, Mon, 28 Sep 2026): Exploit Summit - Bittensor $TAO conference: Exploit Summit (@ExploitSummit) “What I am saying is that: We have to build faster” Rob Myers. Everyone at Exploit Summit is tuned in to the debate on the OTF stage. Should Bittensor move faster or take a slower, more measured approach? Share your take. Video — http://shitter.thepixora.com/ExploitSummit/status/2104676076215738432#m  
  http://shitter.thepixora.com/markjeffrey/status/2104677234980344202#m
- @a16zcrypto (a16z Crypto, Mon, 28 Sep 2026): Interested in perps? Read below 👇 a16z crypto (@a16zcrypto) Article The rise of the $100-billion RWA perp market Trading in perpetual futures tied to stocks, gold, and other traditional assets is growing fast. And an increasing share of that activity is now happening onchain. These contracts, often referred to — http://nitter.jaydenha.uk/a16zcrypto/status/2102875903500197915#m  
  http://nitter.jaydenha.uk/a16zcrypto/status/2104676832700244103#m
- @a16zcrypto (a16z Crypto, Mon, 28 Sep 2026): An early wave of RWA perps was commodities. The new wave could be stocks. A year ago, equity perp open interest was near zero. It passed commodities in June. Today it leads at $2.2B.  
  http://nitter.jaydenha.uk/a16zcrypto/status/2104676639166861421#m
- @oroagents (Oro, Mon, 28 Sep 2026): “Every day we are changing our incentive mechanism.” @oroagents keeps its miners facing fresh challenges. At Exploit, Shardul Bansal explained how a catalog of 11 million products becomes new tasks and evaluation environments every day, keeping the competition moving as AI models improve. Video  
  http://shitter.thepixora.com/ExploitSummit/status/2104667461517713663#m
- @oroagents (Oro, Mon, 28 Sep 2026): Accelerating development at ORO Seth Schilbe (@ironseth_s) PSA: Your CLAUDE.md is probably the problem, not the models. I audited my Claude Code memory after using it for 9 months since Opus 4.5. **49 of 260 entries contradicted our current code**. Memory had become a second copy of team knowledge outside our normal review process. So I ran ~270 tests to see what my config actually did. — http://shitter.thepixora.com/ironseth_s/status/2104645444169334831#m  
  http://shitter.thepixora.com/oroagents/status/2104656457237209371#m
- @markjeffrey (Mark Jeffrey, Mon, 28 Sep 2026): Counting cars at the Arc de Triomphe, the roundabout with no lanes and no rules. 4 blocks in Score Studio's workflow builder: image in, vehicle detector, count, output. No code. Swap the detector and the same 4 blocks count people, plates or anything else you point it at. Build yours: scorestudio.ai Video  
  http://shitter.thepixora.com/webuildscore/status/2104655751205851432#m
- @_redteam_ (RedTeam / Innerworks, Mon, 28 Sep 2026): "We're not afraid of hyper-intelligent bot swarms on the internet. We use them to optimise our technology." When we launched RedTeam almost two years ago we could clearly see where the internet was heading. We've since seen clients with over 90% of their traffic made up of not just automation but highly intelligent bot swarms, capable of bypassing any traditional detection mechanism. The only way to combat a threat like this is to welcome it and learn from it. By constantly ingesting and evolving attack vectors from a hive mind of miners, a Bittensor powered defence has now become the only rel  
  http://shitter.thepixora.com/_redteam_/status/2104643110911533312#m
- @markjeffrey (Mark Jeffrey, Mon, 28 Sep 2026): David Sacks explains what “banning AI” as defined in Bernie Sanders’ bill actually looks like “If Bernie's bill passed tomorrow, everything would stop. Because the way he defines artificial superintelligence in his bill, you could argue we've already hit those thresholds. It’s a very loose definition.” “And then on top of that, he's got 20 year prison sentences for developers who violate the law. So no one's going to want to take the chance. So think about the chilling effect.” “Let me tell you, the Democrats want to do to AI what they did to crypto. They're going to drive the whole industry o  
  http://shitter.thepixora.com/dnapway/status/2104624323873165424#m
- @webuildscore (Score, Mon, 28 Sep 2026): Keeping every builder caffeinated Max (@MaxSebti) Coffees are on us — http://shitter.thepixora.com/MaxSebti/status/2104618597528068393#m  
  http://shitter.thepixora.com/webuildscore/status/2104618990815384001#m
- @1inch (1inch, Mon, 28 Sep 2026): Aqua prices a fill onchain. The provider signs the instructions. SwapVM runs them at execution. @OpenZeppelin audited that engine, the Aqua router, and the pegged-swap and concentrated-liquidity instructions that are live.  
  http://shitter.thepixora.com/1inch/status/2104578428796125249#m
- @1inch (1inch, Mon, 28 Sep 2026): An audit is not a guarantee. Report is public. One of eight Aqua and SwapVM audits: 1inch.com/blog/post/1inch-aq… Link 1inch Aqua security: Eight independent audits | 1inch Blog See how 1inch Aqua and SwapVM were reviewed by 8 independent security firms, with public audit reports, a bug bounty and ongoing security checks. 1inch.com  
  http://shitter.thepixora.com/1inch/status/2104578431312658545#m
- @1inch (1inch, Mon, 28 Sep 2026): 5 teams took home prizes for building on Aqua at @ETHGlobal Tokyo 2026 🇯🇵. Here are your winners: 🥇 OddsFlow - $2500 | @salviega @jaenjiar Bet on any prediction markets with one balance, spent only when someone takes the other side. 🥈 Wamia - $1500 | @Amine1246780537 @HediKharouf0 🥉 Watermark - $1000 | @henryfromseoul @hyeon_sec @GimgeonU95171 Continuity 🥇 VexiHakari - $1500 | @hiasdasdqwwd1 Options via 1inch Aqua, with tokens pullet at fill and a Uniswap V4 TWAP quote guard. 🥈 Takarabako - $500 | @wanaokii @sebestdebest @nizarsyahmi37 Congratulations to all 🏆  
  http://shitter.thepixora.com/1inch/status/2104526538808918471#m
- @resilabsai (RESI, Mon, 20 Apr 2026): I am pleased to announce that Stillcore Capital @stillcorecap has invested in RESI @resilabsai (Bittensor Subnet 46).  
  http://shitter.thepixora.com/markjeffrey/status/2046311512621670731#m
- @jon_durbin (Jon Durbin, Mon, 14 Sep 2026): "in 6–12 months such a swarm could be capable of taking over the entire internet with a persistent botnet" Maybe, maybe not. If it does, the internet (really: software and operating systems) obviously need some improvement and we should do so. If the bugs are there, they will be found, one way or another regardless of some LLM. What a great opportunity for a renaissance. Anyone else remember the doomerism around Y2K? Int overflows because of epoch seconds? This is that.  
  http://nitter.jaydenha.uk/jon_durbin/status/2099604160509325695#m
- @jon_durbin (Jon Durbin, Mon, 14 Sep 2026): The push for regulatory capture and AI cabalism is accelerating. This, in large part, is why I'm building parallax. True P2P unstoppable, uncensorable AI systems aren't just neat, they're mandatory. This little single DGX spark "datacenter" in my forge with parallax can train (with other nodes) an 80b parameter model. - two solar blankets - ecoflow battery - lapdock for kvm - starlink internet - dgx spark Total input from solar ~600w (800w max) Total power draw from spark/starlink/etc. &lt; 200w No datacenters, no water supplies, no external power grid, no multi gigabit link. We must design AI  
  http://nitter.jaydenha.uk/jon_durbin/status/2099565522543104495#m
- @_redteam_ (RedTeam / Innerworks, Mon, 07 Sep 2026): Join us this Thursday to discuss all things RedTeam Openτensor Foundaτion (@opentensor) Novelty Search :: Subnet 61 :: @_redteam_ RedTeam turns Bittensor miners into a 24/7 network of ethical hackers. We’ll discuss how SN61 uses that competition to stay ahead of evolving bot attacks, its five new enterprise pilots, and what comes next with RedTeam’s upcoming Immune System. Live on Thursday :: 9PM UTC :: on X + YouTube Hosted by @const_reborn — http://shitter.thepixora.com/opentensor/status/2097022237337682320#m  
  http://shitter.thepixora.com/_redteam_/status/2097023368629191078#m
- @resilabsai (RESI, Mon, 06 Apr 2026): Chainlink gave DeFi price feeds. @resilabsai is doing the same for real estate. From static appraisals to dynamic, onchain pricing. It's already honing in on Zillow's pricing accuracy, and only a matter of weeks before it surpasses it!  
  http://shitter.thepixora.com/gordonfrayne/status/2041152947925512465#m
- @webuildscore (Score, Fri, 25 Sep 2026): he can drive Gyro Zeppeli (@Gyrolens) trying out Score Studio's vehicle detector on the most random clip i could find, safe to say i wasn't disappointed. @webuildscore Video — http://shitter.thepixora.com/Gyrolens/status/2103575595028189386#m  
  http://shitter.thepixora.com/webuildscore/status/2103576072654840037#m
- @jtledore (Jean-Thomas Ledoré, Fri, 25 Sep 2026): I just published an article for @FuturEconomy ahead of @ExploitSummit As more of AI concentrates around a handful of major labs, mostly in the US and China, how do we keep independent teams able to build and compete? I use Bittensor and concrete examples from @chutes_ai, @webuildscore and @metanova_labs to show what that can look like. TheFutureEconomy.ca (@FuturEconomy) Who gets to build the next generation of AI? That question matters for Canada. Competing with the largest US and Chinese AI labs on sheer scale requires enormous amounts of capital, computing infrastructure and talent. But the  
  http://shitter.thepixora.com/VictorVL_EN/status/2103573484072792269#m
- @a16zcrypto (a16z Crypto, Fri, 25 Sep 2026): Want to learn more about perps? Read below 👇 a16z crypto (@a16zcrypto) Article The rise of the $100-billion RWA perp market Trading in perpetual futures tied to stocks, gold, and other traditional assets is growing fast. And an increasing share of that activity is now happening onchain. These contracts, often referred to — http://nitter.jaydenha.uk/a16zcrypto/status/2102875903500197915#m  
  http://nitter.jaydenha.uk/a16zcrypto/status/2103555958660043006#m
- @a16zcrypto (a16z Crypto, Fri, 25 Sep 2026): These assets are called “real world.” BUT trading is increasingly happening onchain. 86% of RWA perp volume now runs through onchain venues.  
  http://nitter.jaydenha.uk/a16zcrypto/status/2103555717986972066#m
- @1inch (1inch, Fri, 25 Sep 2026): 🇯🇵 ETHGlobal (@ETHGlobal) Reimagining the AMM with 1inch Aqua. Catch Tanner from @1inch on self-custodial onchain liquidity at ETHGlobal Tokyo. Watch the workshop: redirect.invidious.io/q96vlWoZCd0?si=a6VM… — http://shitter.thepixora.com/ETHGlobal/status/2103476376380817632#m  
  http://shitter.thepixora.com/1inch/status/2103511091896848517#m
- @1inch (1inch, Fri, 25 Sep 2026): This week’s most-traded @ondo tokenized stocks on 1inch: ▪️ METAon ▪️ CRCLon ▪️ MSTRon Powered by 1inch intent-based swaps. Video  
  http://shitter.thepixora.com/1inch/status/2103488947292635496#m
- @_redteam_ (RedTeam / Innerworks, Fri, 11 Sep 2026): The future of cybersecurity will be dictated by a defender's ability to not only ingest unique attacks, but generate the strains that don't exist yet and ship the detection ahead of them. As the rest of the industry degrades, the largest financial institutions will consolidate on the single provider that can do this at scale. That provider needs a constant supply of unique attacks to work from, and a subnet is the only structure that pays a swarm of attackers to supply them. bittensor:native #SN61 Openτensor Foundaτion (@opentensor) RedTeam is working toward integrations with three banking com  
  http://shitter.thepixora.com/_redteam_/status/2098469688137097632#m


---
_Generated at 2026-09-29T00:08:46.685134+00:00 by scripts/intel/aggregate.py. Treat this digest as input context, not as ground truth. Verify before quoting._
