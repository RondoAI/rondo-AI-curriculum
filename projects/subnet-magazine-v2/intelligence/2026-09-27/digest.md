# Intelligence Digest, 2026-09-27

_Single-file briefing for the daily research agent. Sources listed in trust order: human-curated notes first, then objective (github), then editorial (RSS), then volume (X via Nitter)._


## ⊕ HUMAN-CURATED NOTES, last 7 days

_no human notes in the window_

## ⊕ MACRO BACKDROP via SEMIANALYSIS, 12 most recent posts

_SemiAnalysis is the most-cited semiconductor and AI infrastructure publication in the industry. They do NOT cover Bittensor. The Oracle uses this corpus for any claim about hyperscaler compute, GPU economics, datacenter power, foundry capacity, memory pricing, lab unit economics. DO NOT cite SemiAnalysis for any Bittensor-specific claim. Full archive (289 posts, May 2020 onwards) lives at `intelligence/_external_sources/semianalysis/` with an `INDEX.md` table of contents. Paywalled posts show only subtitle + free preview; free posts have the full body extracted._

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

### 2026-09-09 · Where Does a Robot Think – On-Device vs Datacenter Inference
_The Embodiment Problem, Planning vs Action Layers, Glass-To-Glass Budgets, Wafers & DRAM Constraints, One B300 vs 56 Thors TCO, Factories To Caves_

- **Authors:** ["Ivan Chiam", "Zane Fong", "Bryan Shan", "Reyk Knuhtsen", "Myron Xie", "Gerald Wong", "Dylan Patel"]
- **Access:** paid-preview
- **URL:** https://newsletter.semianalysis.com/p/where-does-a-robot-think-on-device
- **Corpus file:** `intelligence/_external_sources/semianalysis/2026-09-09-where-does-a-robot-think-on-device.md`

> For most of its short history, AI lived behind a screen. That’s starting to change.  First came chatbots, good for answering a question or drafting an email. Then agentic AI, models that don’t just respond but do real work on a computer: navigating software, calling tools, finishing multi-step tasks on their own. Now the frontier is physical AI, intelligence that reaches past the screen to perceive the world and act on it. The biggest piece is robots, and it is still early: the hardware, the mod


## ⊕ GITHUB COMMITS + RELEASES, last 24h

_no commits or releases in the lookback window_

## ⊕ ECOSYSTEM BLOGS via RSS

_no new posts in the lookback window_

## ⊕ X via NITTER, voices we track

- @TargonCompute (Targon, Wed, 26 Aug 2026): Proud to power @TheoriqAI with secure confidential compute for their agentic market research. Large GPU blocks on demand, with hardware-level guarantees that keep the workload and its data private even from the machines running it. Excited to keep powering experimental research infrastructure with Targon. Theoriq (@TheoriqAI) .@TargonCompute is powering Theoriq AI experimentation. Curating risk-managed yield is, underneath, a research problem: how markets behave, where they break, and how much of that can be seen coming. That runs on heavy, on-demand compute. Targon is our partner in supplying  
  http://shitter.thepixora.com/TargonCompute/status/2092690588143657190#m
- @TargonCompute (Targon, Wed, 26 Aug 2026): .@TargonCompute is powering Theoriq AI experimentation. Curating risk-managed yield is, underneath, a research problem: how markets behave, where they break, and how much of that can be seen coming. That runs on heavy, on-demand compute. Targon is our partner in supplying it. Theoriq (@TheoriqAI) Article Theoriq partnering with Targon to power AI experimentation Curating risk-managed yield is, underneath, a research problem. Long before capital is deployed, we want to know how markets behave, where they tend to break, and how much of that can be seen coming — http://shitter.thepixora.com/Theor  
  http://shitter.thepixora.com/TheoriqAI/status/2092661304444277050#m
- @galaxyhq (Galaxy Digital, Wed, 23 Sep 2026): Thanks for making the trip to Lubbock, Mike — and for spending time with our Red Raider football team ahead of the game. Great to have you at @TexasTech, and even better to cap off the visit with a big win at the new @galaxyhq Stadium. This partnership is just getting started. #WreckEm! Mike Novogratz (@novogratz) Last Friday, I visited our flagship campus Helios in West Texas. Three years ago, this was still a bitcoin mining facility. Today Helios is a fully operational AI-ready campus with 133MW of critical IT capacity, and we’re just getting started! @galaxyhq is taking a big swing out here  
  http://shitter.thepixora.com/CreightonForTX/status/2102869773776269419#m
- @galaxyhq (Galaxy Digital, Wed, 23 Sep 2026): Last Friday, I visited our flagship campus Helios in West Texas. Three years ago, this was still a bitcoin mining facility. Today Helios is a fully operational AI-ready campus with 133MW of critical IT capacity, and we’re just getting started! @galaxyhq is taking a big swing out here, and so is America. The move to build an AI future for this country is real, and none of it happens without the physical infrastructure. It starts with power, land, and hard-working people willing to put in the work to build a new future. Our partnership with @TechAthletics with Galaxy Stadium is part of investing  
  http://shitter.thepixora.com/novogratz/status/2102773522292428868#m
- @webuildscore (Score, Wed, 23 Sep 2026): Ran our auto-annotate engine on 120 frames of highway traffic. every car, truck, and person on the road, tagged. If you are still drawing bounding boxes by hand in 2026, blink twice and we will send help. Try it here: scorestudio.ai Video  
  http://nitter.jaydenha.uk/webuildscore/status/2102768498426380399#m
- @galaxyhq (Galaxy Digital, Wed, 23 Sep 2026):   
  http://shitter.thepixora.com/galaxyhq/status/2102759121372012837#m
- @covenant_ai (Covenant AI, Wed, 19 Aug 2026): RT @tplr_ai: ByteDance and Tencent each received 10,000 Nvidia H200 chips, the first big delivery after China eased import limits. Watch w…  
  http://shitter.thepixora.com/covenant_ai/status/2090092134036648101#m
- @jaltucher (James Altucher, Wed, 16 Sep 2026): Working on an AI-powered end to end platform for designing optical and then quantum chips at $QCLS. More details and refinements later but you can check it out at VibeGDS.io - you just enter plain English for the chip you want and it will build it out, simulate, verify, etc. Of interest mostly to optical engineers.  
  http://shitter.thepixora.com/jaltucher/status/2100262449685364904#m
- @covenant_ai (Covenant AI, Wed, 16 Sep 2026): We’ve been researching fault tolerance in Crucible, Templar’s pre-training platform. The goal: keep training through node failures and make better use of unreliable workers and spot instances, without idling an entire model replica when one stage goes down. 1/n Video  
  http://shitter.thepixora.com/tplr_ai/status/2100237708186550642#m
- @novogratz (Mike Novogratz, Wed, 16 Sep 2026): Our economy doesn’t work without immigration. We need at least 1.5-2mm new immigrants a year to create taxpayers and consumers to help us grow our way out of 40th in debt and to pay for an aging population. This isn’t political. It’s just math. We of course can decide what immigrants we take. From where, what educational level, wealth etc. that’s political. But the fact that we need them isn’t. Lisa Boothe (@LisaMarieBoothe) At this point, I am fine with shutting down all immigration, legal or not. It's a mess. — http://shitter.thepixora.com/LisaMarieBoothe/status/2099891080258875467#m  
  http://shitter.thepixora.com/novogratz/status/2100193741633929406#m
- @novogratz (Mike Novogratz, Wed, 16 Sep 2026): Govt feels broken. 18 months of work between our industry, dems and republicans and Clarity falls apart on the 5 yard line. All the issues got to a hard fought compromise other than one. On Ethics both sides dug in and decided their stance was more important than the long run good of a major industry and our countries chance to lead it. Republicans were afraid of putting real limits on a President’s ability to profit from digital assets. Dems decided that this one industry is where they would fight a corruption battle. They were scared to be seen doing anything that could be perceived as being  
  http://shitter.thepixora.com/novogratz/status/2100020845942911165#m
- @nigescore (Nige, Wed, 09 Sep 2026): .@nigescore going to paris last time he went to nrf in dallas he got us our biggest client ever (not announced yet) i can’t go. got something bigger on the 15th, 16th and 17th (to be announced) Manako (@manakoai) Heading to @nrfeurope NRF Retail’s Big Show Europe in Paris next week (15–17 Sept) 🇫🇷 If you are attending and want to hear what Manako Labs have built for retail, please DM and let’s meet up. No new hardware, no engineers, no code just your existing cameras doing more. #NRFRetailsBigShowEurope — http://nitter.jaydenha.uk/manakoai/status/2097622722310242420#m  
  http://nitter.jaydenha.uk/MaxSebti/status/2097630699129827589#m
- @covenant_ai (Covenant AI, Tue, 25 Aug 2026): Templar's work reduces to one question. How much of the machine-learning lifecycle can run across ordinary networks instead of a single datacentre? Pre-training answered first, with Covenant-72B as the proof at scale. Post-training followed through our communication-efficiency research. Serving open models on distributed hardware is the piece we are working on now, and it is the one that puts the whole arc in front of users. The internet is the datacentre.  
  http://shitter.thepixora.com/tplr_ai/status/2092267948765237743#m
- @jaltucher (James Altucher, Tue, 22 Sep 2026): Welcome to Bittensor. Here's why you should stay and diamond-hand $TAO.  
  http://shitter.thepixora.com/taodaily_io/status/2102390629422567556#m
- @nigescore (Nige, Tue, 15 Sep 2026): The physical world still can’t talk to software. A billion cameras watch factories, stations, warehouses, and stores every second. Almost none of that footage becomes action. That’s what we build at Manako. Today we join F/ai at @joinstationf The program that put OpenAI, Anthropic, Google, Meta, Microsoft and top-tier VCs behind a handful of AI-native teams. Honoured. Focused. Shipping.  
  http://nitter.jaydenha.uk/manakoai/status/2099861562882203822#m
- @jaltucher (James Altucher, Tue, 15 Sep 2026): Q/C Technologies has appointed Yossef Ehrlichman, Ph.D., as Chief Technology Officer to lead the company’s optical processing unit program and overall technology strategy. Learn more: bit.ly/4xXk2ik $QCLS  
  http://shitter.thepixora.com/Q_CTechnologies/status/2099856104670859351#m
- @mcjkula (mcjkula, Tue, 14 Apr 2026): See you in Montréal everyone. Not gonna want to miss this one🫡 Exploit Summit (@ExploitSummit) Building on Bittensor is hard. Doing it in isolation is even harder. Exploit puts you in a room with: • The subnet founders who've already solved your problems • The investors actually writing checks • The technical talent you're trying to hire Sept 28-29, Montréal. Two days that could save you six months. Video — http://nitter.jaydenha.uk/ExploitSummit/status/2044100822750114215#m  
  http://nitter.jaydenha.uk/mcjkula/status/2044123923088830837#m
- @nigescore (Nige, Tue, 08 Sep 2026): Astra Ultra did not cook sports-grade vision AI. Gave it a 30s football clip from our subnet private track. Frame-level events, JSON, annotated video. Ground truth and the published scoring rules only after it committed. 22 predictions. 17 real events. 15 inside the action windows. 7 extras. 2 misses. Precision 68.18%. Recall 88.24%. F1 76.92%. Our Bittensor eval, SN44: 0%. Matches after timing decay: 16.538 False positives: −20.300 GT weight: 25.600 score = max(0, (16.538 − 20.300) / 25.600) = 0 Three extra take-ons and two extra tackles were 14.6 penalty points. It also misread the late inte  
  http://nitter.jaydenha.uk/webuildscore/status/2097261685358596399#m
- @resilabsai (RESI, Tue, 07 Apr 2026): The power of holding Bittensor $TAO subnet alpha Here is an example to illustrate the flywheel of $TAO Let's say you 1,000 alpha of @resilabsai which cost around 7 $TAO 7 $TAO at a price of $310 = $2,170 Current alpha price of Resi, subnet 46: .0066 $TAO Let's make some calculated assumptions. &gt; price of resi alpha stays the same for 3 years &gt; price of $TAO remains the same at $310 &gt; APY for holding Resi alpha is 40% for the first 2 years, then 30% in year 3 What is my total value in 3 years? Year 1 (40% APY) 1,060.6 × 1.4 = 1,484.8 alpha In $TAO: 1,484.8 × 0.0066 ≈ 9.80 $TAO In USD:   
  http://shitter.thepixora.com/Pop_Collapse/status/2041570023823528017#m
- @TargonCompute (Targon, Tue, 01 Sep 2026): Happy to help! Proud to be trusted with running critical workloads such as validators. Very excited to see the talented team at DeSci Labs join the Bittensor ecosystem, their research and expertise are sure to add long-lasting value to the network. 🔬 Claims - Subnet 111 (@DeSciClaims) Our validator for SN111 is running on hardware provided by @TargonCompute. We're super grateful for the fast, reliable setup and the team's amazing support. Thank you, guys! — http://shitter.thepixora.com/DeSciClaims/status/2094364807596036575#m  
  http://shitter.thepixora.com/TargonCompute/status/2094908006039236625#m
- @mcjkula (mcjkula, Tue, 01 Sep 2026): TAOApp Wallet is here. The self-custody browser wallet for Bittensor. Hold TAO, stake TAO, buy subnet tokens. When there’s more to protect, bring in your Ledger, proxies and multisigs. Install the beta, on Chrome, Brave and Edge. ↓ chromewebstore.google.com/de…  
  http://nitter.jaydenha.uk/taoapp_/status/2094840222441992209#m
- @dippy_ai (Dippy AI, Thu, 30 Jul 2026): Excited to have helped @PrunaAI collect 1M+ votes for image preference data in a very short time :~) Pruna AI (@PrunaAI) P-Image-Ideogram dominate the speed-quality and price-quality Pareto frontiers for image generation. It is the result of a unique collaboration with @ideogram_ai. - Four modes (Very low, low, medium, high) for 1K-2K image generation. - Optimal quality-efficiency with 0.4s-7.5s latency, and $0.003-$0.03 price. - Structured JSON control & exact color control. Available via our inference partners @Replicate @inference_sh @scenario_gg @wavespeed_ai @wiroai @magnific @prodialabs   
  http://shitter.thepixora.com/datapointai/status/2082837314603032606#m
- @dippy_ai (Dippy AI, Thu, 27 Aug 2026): we have significantly upgraded both the basic and super models 🤩🤩 we have also made optimizations to improve response speeds by upto 5x can't wait for you all to experience and enjoy the new dippy 📯📯😸 rolling out to everyone today  
  http://shitter.thepixora.com/dippy_ai/status/2093089771824226802#m
- @covenant_ai (Covenant AI, Thu, 27 Aug 2026): A system designed around identical accelerators depends on a narrow hardware supply. Templar starts from a wider map. Accelerator generations vary, and network conditions change with location. The coordination layer has to treat both as design inputs.  
  http://shitter.thepixora.com/tplr_ai/status/2093022381660942660#m
- @PanteraCapital (Pantera Capital, Thu, 24 Sep 2026): The last closing bell is coming. Video  
  http://nitter.jaydenha.uk/Ondo/status/2103232283218247755#m
- @PanteraCapital (Pantera Capital, Thu, 24 Sep 2026): &lt; 2 weeks after launch: - doing 1/4 traffic of Google search - #1 chain used by devs - inventing new metas (stock x meme pairing) @RobinhoodApp chain just getting started reinventing finance fun convo with @FranklinBi @JohannKerbrat about the 3 crypto megatrends, the Whatsapp Effect, and how @davehappyminion bought flowers and snitched Pantera Capital (@PanteraCapital) Robinhood Chain is three months old. In API calls it already runs at roughly a quarter the volume of Google search. @nikil (@Alchemy) and @JohannKerbrat (@RobinhoodCrypto) join Stateful, hosted by @FranklinBi, to talk tokeniz  
  http://nitter.jaydenha.uk/nikil/status/2103197255620841752#m
- @PanteraCapital (Pantera Capital, Thu, 24 Sep 2026): This one has been in the works for over a year. Tokenization is not about bringing existing assets onchain anymore - that problem has already been solved by Ondo Stocks. What's next is bringing asset management and wealth management onchain, starting with intelligent portfolios. People globally can invest in sophisticated portfolios, developed by Blackrock for Ondo, with a single click, and access products that were previously only available to the wealthy select few. Over the next few months, expect Ondo to launch more intelligent portfolios that combine stocks, commodities, ETFs, and even pr  
  http://nitter.jaydenha.uk/iandebode/status/2103183739824329188#m
- @webuildscore (Score, Thu, 24 Sep 2026): "We're slowing down AI development" they said  
  http://nitter.jaydenha.uk/webuildscore/status/2103168539217523018#m
- @PanteraCapital (Pantera Capital, Thu, 24 Sep 2026): We backed @OndoFinance to bring traditional finance onchain. Today the world's largest asset manager's portfolio strategies are live as single onchain tokens, three strategies developed by BlackRock for Ondo. Institutional allocation expertise is now an onchain product. ethereum:0xfaba6f8e4a5e8ab82f62fe7c39859fa577269be3 Ondo Finance (@Ondo) Introducing Ondo Intelligent Portfolios, the first three portfolios powered by BlackRock. Ondo Intelligent Portfolios introduces a new onchain product category: curated investment portfolios delivered as single onchain transferable tokens. The first three   
  http://nitter.jaydenha.uk/veradittakit/status/2103154400856609204#m
- @PanteraCapital (Pantera Capital, Thu, 24 Sep 2026): JUST IN: $ZAMA is now live on @solana via @sunrise Solana (@solana) BREAKING: $ZAMA from @zama is live on Solana via @sunrise — http://nitter.jaydenha.uk/solana/status/2103146074550718518#m  
  http://nitter.jaydenha.uk/zama/status/2103147073356882242#m
- @galaxyhq (Galaxy Digital, Thu, 24 Sep 2026): Galaxy bought $100M of sUSDS and approved it as collateral across our institutional lending book. It's the latest step in a deepening relationship with @SkyEcosystem — from Grove's $500M warehouse facility to Spark-backed financing for GOFR.  
  http://shitter.thepixora.com/galaxyhq/status/2103130450738716905#m
- @novogratz (Mike Novogratz, Thu, 17 Sep 2026): Thank you @SECPaulSAtkins @HesterPeirce @MarkUyedaUS for leading on digital asset policy !!! Innovation exemption moves tokenization ahead. Proud to be first on Nasdaq to tokenize shares. More to come with tokenized $GLXY ! U.S. Securities and Exchange Commission (@SECGov) 🚨 TODAY: The SEC issued an order granting temporary, conditional exemptive relief to Tokenized Securities Venues from the definition of “exchange” in the Exchange Act to trade tokenized NMS stock using innovative permissioned automated market makers and liquidity pools. — http://shitter.thepixora.com/SECGov/status/2100571317  
  http://shitter.thepixora.com/novogratz/status/2100587469708140836#m
- @dippy_ai (Dippy AI, Thu, 04 Jun 2026): Today, we’re opening up Datapoint AI for anyone to use. It is by far the fastest way to understand what your customers want. Type a question. Real people answer. You get a report back in ~10 minutes, not three weeks, and at a fraction of the cost. Video  
  http://shitter.thepixora.com/datapointai/status/2062563294880075837#m
- @covenant_ai (Covenant AI, Thu, 03 Sep 2026): Crucible, Templar's pre-training platform, has completed its first production end-to-end training runs. The latest trained an 8B model on 50.53B tokens across 48 distributed A100s, at an estimated $0.1202 per million tokens of GPU rental. The run reached 48.3% effective MFU. At AWS p4de Capacity Blocks pricing, a 48-A100 cluster operating at the literature-derived 65% compute ceiling comes to an estimated $0.1686 per million tokens. Crucible's measured $0.1202 was about 29% lower after its low-bandwidth overhead. The comparison excludes R2 storage and operations. The full writeup shows the met  
  http://shitter.thepixora.com/tplr_ai/status/2095580357626110111#m
- @nigescore (Nige, Thu, 03 Sep 2026): Shell and ENI stations added to roll out today. Accelerate.  
  http://nitter.jaydenha.uk/MaxSebti/status/2095545005540552752#m
- @wallstreetbets (WallStreetBets (X), Sun, 27 Sep 2026): it's time  
  http://nitter.jaydenha.uk/wallstreetbets/status/2104058452075069621#m
- @wallstreetbets (WallStreetBets (X), Sun, 27 Sep 2026): what the fuck is risk management? Video  
  http://nitter.jaydenha.uk/wallstreetbets/status/2104028251102359674#m
- @wallstreetbets (WallStreetBets (X), Sun, 27 Sep 2026): looks good $ZEC been looking at NY real estate WallStreetBets (@wallstreetbets) feels good to hold zcash $ZEC — http://nitter.jaydenha.uk/wallstreetbets/status/2102538143362617782#m  
  http://nitter.jaydenha.uk/wallstreetbets/status/2103998079049609437#m
- @dippy_ai (Dippy AI, Sun, 09 Aug 2026): We are experiencing an issue with our database provider @supabase , so the app &amp; website may be down for a few more hours. We’ll send a notification when we are able to recover and the app is back to normal! Apologies for the inconvenience 😿😿  
  http://shitter.thepixora.com/dippy_ai/status/2086595242422149540#m
- @wallstreetbets (WallStreetBets (X), Sat, 26 Sep 2026): this is not the mass adoption we wanted 😭 Emperor.SOL (@Solana_Emperor) ⚠️ Live Crypto Drainer Spotted In Warsaw A live crypto drainer was seen in Warsaw, Poland, promoting 100 USDC with a QR code. Scanning the code led to a website showing signs of a drainer. This incident highlights ongoing threats in the crypto space. 📰 Telegram: UnbiasedCryptoNews Video — http://nitter.jaydenha.uk/Solana_Emperor/status/2103951917449711965#m  
  http://nitter.jaydenha.uk/wallstreetbets/status/2103990069577052254#m
- @webuildscore (Score, Sat, 26 Sep 2026): Gordon Ramsay with kids vs Gordon Ramsay with adults. Our Fire and Smoke Detector caught the fire in both. If you need strong detection models, don't be an idiot sandwich. Use Score Studio. Try it here: scorestudio.ai Video  
  http://nitter.jaydenha.uk/webuildscore/status/2103877473012203889#m
- @webuildscore (Score, Sat, 26 Sep 2026): This one hits hard Millie (@AltcoinMillie) 🐐 $TAO — http://nitter.jaydenha.uk/AltcoinMillie/status/2103864269141844002#m  
  http://nitter.jaydenha.uk/webuildscore/status/2103870090122764752#m
- @KyleSamani (Kyle Samani, Sat, 26 Sep 2026): 👀 Tokens on Solana (@tokens) INSIGHT: @Backpack CEO @armaniferrante says they want to bring the full US stock market to Solana (10,000 symbols) via one API. Video — http://shitter.thepixora.com/tokens/status/2103811956495007859#m  
  http://shitter.thepixora.com/KyleSamani/status/2103839815879758314#m
- @wallstreetbets (WallStreetBets (X), Sat, 26 Sep 2026): until all of wall street is onchain, we're still early  
  http://nitter.jaydenha.uk/wallstreetbets/status/2103824409991532849#m
- @jaltucher (James Altucher, Sat, 26 Sep 2026): bittensor:native will change your life. 🫶  
  http://shitter.thepixora.com/taodaily_io/status/2103816843806879925#m
- @KyleSamani (Kyle Samani, Sat, 26 Sep 2026): 👀 Solana (@solana) Armani Ferrante, CEO of Backpack, on what comes next for tokenized stocks. "Not 10 stocks, not 100 stocks. We want to bring the entire stock market to Solana. One API where a real share, by any definition of the term, moves back and forth between your brokerage account and DeFi. Going from 200 symbols to 10,000 is the next leap." @armaniferrante @Backpack Video — http://shitter.thepixora.com/solana/status/2103741358842470537#m  
  http://shitter.thepixora.com/KyleSamani/status/2103806894322446599#m
- @mcjkula (mcjkula, Sat, 19 Sep 2026): Bittensor took me a while to understand. I want to make that first step easier for the next person. We’ll be kicking things off with Bittensor 101 at Exploit. Looking forward to meeting some of you for the first time and catching up with familiar faces. 👋 Exploit Summit (@ExploitSummit) Maciej Kula ( @mcjkula ) couldn't find a clear way to learn #Bittensor from scratch, so he built the resource he wished existed. @learnbittensor is now part of @latentholdings, where Maciej leads education and makes Bittensor easier to understand. He'll be leading our Bittensor 101 session to kick off Day 1: lu  
  http://nitter.jaydenha.uk/mcjkula/status/2101424763344437495#m
- @nigescore (Nige, Sat, 19 Sep 2026): We’re completing our first 20 reference deployments, led by our CEO and engineering team, and the headline finding is that Manako is genuinely plug and play. No specialist integration required: a unit can be shipped to site and connected by anyone on the ground. That’s what makes our next phase possible. Our integration partners will roll out at scale on a simple, repeatable install, with less time on site and lower cost per deployment.  
  http://nitter.jaydenha.uk/manakoai/status/2101403529558577403#m
- @mcjkula (mcjkula, Sat, 19 Sep 2026): Maciej Kula ( @mcjkula ) couldn't find a clear way to learn #Bittensor from scratch, so he built the resource he wished existed. @learnbittensor is now part of @latentholdings, where Maciej leads education and makes Bittensor easier to understand. He'll be leading our Bittensor 101 session to kick off Day 1: luma.com/nqy2n5zi Video  
  http://nitter.jaydenha.uk/ExploitSummit/status/2101355676325007652#m
- @resilabsai (RESI, Sat, 18 Apr 2026): Traditional centralized real estate data platforms are fundamentally flawed and often serve to extract wealth from users. @resilabsai (Subnet 46) is breaking this monopoly through decentralized AI technology that delivers up to 99% valuation accuracy. Skip the corporate intermediaries—this AI-powered home valuation tool provides the most reliable housing market forecasts for 2026 Video SEBY (@sebyrubino) The @resilabsai Portal is LIVE! Any agent or real estate professional can now easily access our SOTA remote appraisals. We built RESI as a compounding network that will naturally accelerate in  
  http://shitter.thepixora.com/3rdeye_rav3n/status/2045362275045753234#m


---
_Generated at 2026-09-27T09:44:46.173270+00:00 by scripts/intel/aggregate.py. Treat this digest as input context, not as ground truth. Verify before quoting._
