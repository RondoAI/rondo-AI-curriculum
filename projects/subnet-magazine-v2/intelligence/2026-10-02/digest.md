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
- @opentensor (Opentensor Foundation, Wed, 30 Sep 2026): “We need to make the Linux of AI.” @jon_durbin of @chutes_ai presented an 8B model trained across distributed gaming GPUs for roughly $6,500 in GPU rental. It runs entirely on a phone’s CPU at nearly 60 tokens per second. His full @ExploitSummit keynote explains how open-source development and decentralized training could give people control over AI from its creation to its everyday use. Video  
  http://shitter.thepixora.com/opentensor/status/2105353248836362289#m
- @opentensor (Opentensor Foundation, Wed, 30 Sep 2026): This Thursday on Novelty Search :: Subnet 80 :: @openroboto OpenRoboto is building an open competition for robot intelligence on Bittensor, where miners improve shared base models and each champion becomes the next starting point. They are now expanding into real robot validation and Shift, their decentralized network for collecting real world robotics data, connecting model improvement with physical data and commercial demand. Thursday :: 5PM EDT / 9PM UTC Hosted by @const_reborn  
  http://shitter.thepixora.com/opentensor/status/2105322199787700284#m
- @const_reborn (Jacob Steeves, Wed, 30 Sep 2026): Thiel, who has cared for this problem more than any thinker believes the answer is the state (USA) or the state outside the state (Praxis). But only one thing, ever, ever in human history, has ever evaded the tendrils of power, and it’s not an address. It’s a network.  
  https://nitter.kareem.one/const_reborn/status/2105281085483479098#m
- @const_reborn (Jacob Steeves, Wed, 30 Sep 2026): The anti christ is this. Untethered power. The detachment between the machine and the natural world that birthed it.  
  https://nitter.kareem.one/const_reborn/status/2105280079320469684#m
- @const_reborn (Jacob Steeves, Wed, 30 Sep 2026): Make no mistake, we are witnessing the end of a ten thousand year civilization balance of power. There will be consequences to that.  
  https://nitter.kareem.one/const_reborn/status/2105279430247452774#m
- @const_reborn (Jacob Steeves, Wed, 30 Sep 2026): But now the monopoly on violence has captured capital and capital just eroded the value of labour. And it was labour which kept the state in check.  
  https://nitter.kareem.one/const_reborn/status/2105278930013864035#m
- @shibshib89 (Ala Shaabana, Wed, 16 Sep 2026): LFG! Crucible Labs (@CrucibleLabs) Crucible Wallet Extension v2.1.1 is LIVE. This isn’t just an update. We rebuilt the entire wallet experience from the ground up. A completely new UI. More control over your TAO. More Bittensor tools built directly into your wallet. What’s new in v2.1.1: ✔️Completely updated UI + light/dark mode ✔️Claim rewards directly in the wallet ✔️Unified balance across TAO + alpha ✔️Universal Swap ✔️Transfer TAO + alpha ✔️Subnet discovery + detailed subnet views ✔️Multi-address support for seed phrases ✔️12 and 24 word seed phrase support ✔️Updated Smart Account + Reward  
  http://shitter.thepixora.com/shibshib89/status/2100300168633761947#m
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
- @oroagents (Oro, Tue, 29 Sep 2026): Commerce is going to prove to be one of the largest opportunities in the agent world. Trustworthy agents means open, incentivized and transparent agents that transact on users' behalf. great article by @CrucibleLabs. Let's make this future happen the right way. Crucible Labs (@CrucibleLabs) Article a BIT of Joy: Issue 11 The Agent Era Is Here For the last few years, the AI industry has talked about agents as the next big thing. At this point, the more interesting question isn&apos;t when agents arrive. They&apos;re already — http://shitter.thepixora.com/CrucibleLabs/status/2103188134238564440#  
  http://shitter.thepixora.com/oroagents/status/2104794483745587425#m
- @oroagents (Oro, Tue, 22 Sep 2026): We're excited to announce ORO Bench today, a benchmark that's powered by a generator creating new synthetic shopping environments everyday. This is now powering our subnet on Bittensor, SN15. Video  
  http://shitter.thepixora.com/oroagents/status/2102475717367963815#m
- @VantaTrading (Vanta, Thu, 01 Oct 2026): boss man says we need instant funded accounts should we do it? let us know ⬇️ Arrash (@0xarrash) I think we need direct to funded, with the ability to grow to $1M on @VantaTrading. What do you guys think? 🤔 — https://nitter.kareem.one/0xarrash/status/2105788070826238175#m  
  https://nitter.kareem.one/VantaTrading/status/2105792854287388991#m
- @VantaTrading (Vanta, Thu, 01 Oct 2026): Here's the part people miss about a $1,000,000 Vanta Pro account: through Grow your rewards pay double. Your Pro return is applied to your Classic account size, then doubled. 1% on a $100,000 pays $2,000. vantatrading.io/pro  
  https://nitter.kareem.one/VantaTrading/status/2105757146617102550#m
- @const_reborn (Jacob Steeves, Thu, 01 Oct 2026): First, why it's possible at all. Most distributed training is data parallel, so every machine holds the whole model and size is capped by one machine. iota is pipeline parallel: each machine holds a slice, so model size scales with the network.  
  https://nitter.kareem.one/MacrocosmosAI/status/2105715636152492296#m
- @VantaTrading (Vanta, Thu, 01 Oct 2026): i think i see a $1,000,000 Vanta account @0xarrash pretty cool, and a great lesson in risk management maybe everyone should trade like this 👀 Arrash (@0xarrash) an update on my account. Currently up $22k but here's the thing, I never risked more than 20% of my account size on any position. Meaning, my max position size has been less than &lt;$200k. My max drawdown is 0.6%. My calmar is ~4. That is what Vanta provides. A way for you to not blow your account taking wild swings, show your ability to risk manage while getting paid handsomely. The entire prop model has moved to taking max risk hopi  
  https://nitter.kareem.one/VantaTrading/status/2105686376851337630#m
- @VantaTrading (Vanta, Thu, 01 Oct 2026): one of the coolest things i've learned about Vanta? we don't reduce your balance as you grow your funded account. that means you only really need to worry about the daily loss limit if you're profitable. static drawdown moves out of the picture pretty quickly. haven't seen any other firms do this.... - the VT intern  
  https://nitter.kareem.one/VantaTrading/status/2105677881850335674#m
- @shibshib89 (Ala Shaabana, Mon, 28 Sep 2026): Bittensor and Baguettes is ready for her interviews @ExploitSummit. See what subnets we’re chatting about soon!  
  http://shitter.thepixora.com/CrucibleLabs/status/2104684600291180752#m
- @oroagents (Oro, Mon, 28 Sep 2026): “Every day we are changing our incentive mechanism.” @oroagents keeps its miners facing fresh challenges. At Exploit, Shardul Bansal explained how a catalog of 11 million products becomes new tasks and evaluation environments every day, keeping the competition moving as AI models improve. Video  
  http://shitter.thepixora.com/ExploitSummit/status/2104667461517713663#m
- @oroagents (Oro, Mon, 28 Sep 2026): Accelerating development at ORO Seth Schilbe (@ironseth_s) PSA: Your CLAUDE.md is probably the problem, not the models. I audited my Claude Code memory after using it for 9 months since Opus 4.5. **49 of 260 entries contradicted our current code**. Memory had become a second copy of team knowledge outside our normal review process. So I ran ~270 tests to see what my config actually did. — http://shitter.thepixora.com/ironseth_s/status/2104645444169334831#m  
  http://shitter.thepixora.com/oroagents/status/2104656457237209371#m
- @VantaTrading (Vanta, Fri, 02 Oct 2026): Your split carries over, whatever the account grows to. Pick 100/0 on a Classic evaluation and that's the split you keep on a Vanta Pro account of up to $1,000,000. 100% of rewards by default, the whole way. vantatrading.io/pro  
  https://nitter.kareem.one/VantaTrading/status/2105841456011448759#m
- @oroagents (Oro, Fri, 02 Oct 2026): We're going to be dropping Assistant Eval tomorrow. More details coming, stay tuned. Video  
  http://shitter.thepixora.com/oroagents/status/2105836355238687025#m


---
_Generated at 2026-10-02T03:32:58.459992+00:00 by scripts/intel/aggregate.py. Treat this digest as input context, not as ground truth. Verify before quoting._
