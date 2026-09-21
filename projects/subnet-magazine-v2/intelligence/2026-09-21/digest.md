# Intelligence Digest, 2026-09-21

_Single-file briefing for the daily research agent. Sources listed in trust order: human-curated notes first, then objective (github), then editorial (RSS), then volume (X via Nitter)._


## ⊕ HUMAN-CURATED NOTES, last 7 days

_no human notes in the window_

## ⊕ MACRO BACKDROP via SEMIANALYSIS, 12 most recent posts

_SemiAnalysis is the most-cited semiconductor and AI infrastructure publication in the industry. They do NOT cover Bittensor. The Oracle uses this corpus for any claim about hyperscaler compute, GPU economics, datacenter power, foundry capacity, memory pricing, lab unit economics. DO NOT cite SemiAnalysis for any Bittensor-specific claim. Full archive (289 posts, May 2020 onwards) lives at `intelligence/_external_sources/semianalysis/` with an `INDEX.md` table of contents. Paywalled posts show only subtitle + free preview; free posts have the full body extracted._

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

### 2026-09-14 · A Brain Too Big to Carry — On-Device vs Datacenter Inference
_Robot Models, Silicon & DRAM Efficiency, Jetson Thor vs. B300 TCO, Deployments, The Network Wall_

- **Authors:** ["Ivan Chiam", "Gianluca", "Zane Fong", "Bryan Shan", "Dylan Patel", "Reyk Knuhtsen"]
- **Access:** paid-preview
- **URL:** https://newsletter.semianalysis.com/p/a-brain-too-big-to-carry-on-device
- **Corpus file:** `intelligence/_external_sources/semianalysis/2026-09-14-a-brain-too-big-to-carry-on-device.md`

> # Where should the brain of the robot go?  So far, AI has mostly lived behind a screen. Chatbots answered questions. Then agents started driving software and finishing multi-step tasks on their own. The next step is AI that acts in the physical world, and the biggest piece of that is robots. It’s early. Nobody has settled the hardware, the models, or the economics.  ## The Embodiment Problem  With LLMs, the hardware bends to the model. Pour in as much data and compute as possible at training, th

### 2026-09-14 · Vera Rubin NVL72 Agentic Inference: 67x better Performance per Dollar
_Jensen Sandbagging Performance Again, 2x more Annual Profit Per GigaWatt, The More you Buy, The More you Earn, AgentX, InferenceX, Extreme Co-Design_

- **Authors:** ["Bryan Shan", "Alec Ibarra", "Cam Quilici", "Wenyao Gao", "Dylan Patel"]
- **Access:** paid-preview
- **URL:** https://newsletter.semianalysis.com/p/vera-rubin-nvl72-agentic-inference
- **Corpus file:** `intelligence/_external_sources/semianalysis/2026-09-14-vera-rubin-nvl72-agentic-inference.md`

> [Rubin is the first platform co-designed across six products for the agentic era: Rubin GPU, Vera CPU, NVLink 6 Switch, ConnectX-9, BlueField-4, and Spectrum-6.](https://newsletter.semianalysis.com/p/vera-rubin-extreme-co-design-an-evolution) Today we are publishing the first verified agentic inference results for Rubin, measured on our agentic inference benchmark, AgentX. Even on early pre-release software, the results already show why extreme co-design was necessary.  At GTC 2026, Jensen prese

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

### 2026-09-07 · TPU Inference Externalization Full Steam Ahead - InferenceX
_InferenceX, Up to 50% Better Performance per Dollar, Rapid Externalization of TPU stack, Growing Customer Base, Ironwood, TPUv8i, Reducing CUDA Moat_

- **Authors:** ["Alec Ibarra", "Cam Quilici", "Bryan Shan", "Wenyao Gao", "Daniel Nishball", "Zane Fong", "Dylan Patel"]
- **Access:** paid-preview
- **URL:** https://newsletter.semianalysis.com/p/tpu-inferencex-full-steam
- **Corpus file:** `intelligence/_external_sources/semianalysis/2026-09-07-tpu-inferencex-full-steam.md`

> For more than a decade, the industry has watched Google build an empire on its own silicon. Search, Ads, YouTube, and every generation of Gemini run on TPUs. Few accelerators have attracted as much architectural scrutiny or as much debate about what their performance and economics would look like outside the company that designed them. Anthropic being the biggest user of TPUs, surpassing Deepmind’s own use by 2029.  [![A fisheye view of a data center wall with rows of server racks, complex cabli

### 2026-09-01 · Korea’s Trillion-Dollar Sovereign AI Investment: Nvidia Wins, Hynix Loses
_Korea hosts a Squid Games, National AI Tournament, the best non-Chinese open source model gets eliminated, why Nvidia needs open source, implications for Hynix and Samsung_

- **Authors:** ["Max Kan", "Ray Wang", "Dylan Patel"]
- **Access:** paid-preview
- **URL:** https://newsletter.semianalysis.com/p/koreas-trillion-dollar-sovereign
- **Corpus file:** `intelligence/_external_sources/semianalysis/2026-09-01-koreas-trillion-dollar-sovereign.md`

> Every day, businesses and governments around the world are becoming increasingly reliant on America’s frontier models. Startup CEOs already can’t imagine running their companies without AI, and it won’t be long until the same is true for every other organization in the world.  At the same time, it’s become abundantly clear that access to frontier models is at the mercy of Anthropic, OpenAI, and the United States government. Fable 5 was temporarily banned by the USG, and GPT 5.6 and Astra were si

### 2026-08-30 · Most Neoclouds Suck At Security
_OpenAI vs HuggingFace, Container Escapes, Kernel Bypass, Network Policies, Security Keys, Multi-tenant Grafana, and a ClusterMAX 3.0 Preview_

- **Authors:** ["Jordan Nanos", "Sam Harshe", "Pratt Bhatt", "Billy Cao", "Jack Carson", "Dylan Patel"]
- **Access:** paid-preview
- **URL:** https://newsletter.semianalysis.com/p/most-neoclouds-suck-at-security
- **Corpus file:** `intelligence/_external_sources/semianalysis/2026-08-30-most-neoclouds-suck-at-security.md`

> [![](https://substackcdn.com/image/fetch/$s_!zWz0!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fc647fca6-8c53-43a7-af27-f4396a31077b_1448x1086.png)](https://substackcdn.com/image/fetch/$s_!zWz0!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fc647fca6-8c53-43a7-af27-f4396a31077b_1448x1086.png)  In Shakespeare’s Julius Caesar, Caesar ignores a soothsayer’


## ⊕ GITHUB COMMITS + RELEASES, last 24h

- **Subtensor (chain)** (COMMIT `d885300`, 2026-09-21 19:03) Merge pull request #3191 from RaoFoundation/cursor/preflight-gate-dce3  
  https://github.com/RaoFoundation/subtensor/commit/d8853006fc42a86e9be27be8cdfd8b06239a52d8
- **Subtensor (chain)** (COMMIT `076dc24`, 2026-09-21 18:16) ci: preflight resolves node and wasm artifacts from Cargo's target dir  
  https://github.com/RaoFoundation/subtensor/commit/076dc24a742f3cb026cec0c712fa337e584fde2f
- **Subtensor (chain)** (COMMIT `516ad10`, 2026-09-21 18:06) docs: describe the credential-owner check and pushed-revision gating  
  https://github.com/RaoFoundation/subtensor/commit/516ad104ce7622e275dfb5b5a5816a6ec6cb0aa3
- **Subtensor (chain)** (COMMIT `eceece7`, 2026-09-21 18:05) ci: preflight verifies the push credential owner and gates the pushed revision  
  https://github.com/RaoFoundation/subtensor/commit/eceece73ace0d1284b3469004ed12408804b143d
- **Subtensor (chain)** (COMMIT `30c70d9`, 2026-09-21 17:52) Merge pull request #3184 from RaoFoundation/cursor/spec-468-cash-first-claims-1eaa  
  https://github.com/RaoFoundation/subtensor/commit/30c70d90f8a3708d85cf95ae992b7a3fe30d2c4c
- **Subtensor (chain)** (COMMIT `a598926`, 2026-09-21 17:07) docs: regenerate source anchors  
  https://github.com/RaoFoundation/subtensor/commit/a5989266f239ae7b981ce3c98f5b8db485d8722b
- **Subtensor (chain)** (COMMIT `1f64c09`, 2026-09-21 16:30) ci: preflight builds the release node with the runtime wasm embedded  
  https://github.com/RaoFoundation/subtensor/commit/1f64c09c4c33d039dbb7236a29b6786b9603d94a
- **Subtensor (chain)** (COMMIT `5e7410f`, 2026-09-21 16:29) ci: preflight prints per-gate wall time on the PASS/FAIL line  
  https://github.com/RaoFoundation/subtensor/commit/5e7410f8f63e7e5e608e4629d380d69b44378e6c
- **Subtensor (chain)** (COMMIT `cfd3ce1`, 2026-09-21 16:28) ci: install-hooks.sh backs up a foreign pre-push hook instead of overwriting it  
  https://github.com/RaoFoundation/subtensor/commit/cfd3ce1fa196b0879fc84e5c65f3b54013538a8c
- **Subtensor (chain)** (COMMIT `945199a`, 2026-09-21 16:27) ci: enforced local preflight gate + pre-push hook  
  https://github.com/RaoFoundation/subtensor/commit/945199a481c480cbee58ba50584fe7b92e72f0b8
- **Subtensor (chain)** (COMMIT `d83cc0e`, 2026-09-21 11:27) Merge pull request #3187 from RaoFoundation/cursor/ts-tests-ink-gas-limit-687e  
  https://github.com/RaoFoundation/subtensor/commit/d83cc0e36142e5c22517ed78bf73b6024e1c5a41
- **Subtensor (chain)** (COMMIT `380d1b0`, 2026-09-21 11:13) ts-tests: size ink gas limit from declared weight (fix evm_b T04 OutOfGas)  
  https://github.com/RaoFoundation/subtensor/commit/380d1b0d561f70222138bbace8dce3cd18b6fbe9

## ⊕ ECOSYSTEM BLOGS via RSS

_no new posts in the lookback window_

## ⊕ X via NITTER, voices we track

- @ridges_ai (Ridges, Wed, 26 Aug 2026): We've kicked off Niches with a Linting competition! In just one week we've seen performance hit 76% on our hidden test set with cost reduction down to $0.02 per task. Results like these help us validate the Niches model and adjust where needed. We're excited for the next Niche, and eventually dynamic Niches. Stay tuned!  
  http://shitter.thepixora.com/ridges_ai/status/2092684102595961119#m
- @covenant_ai (Covenant AI, Wed, 19 Aug 2026): RT @tplr_ai: ByteDance and Tencent each received 10,000 Nvidia H200 chips, the first big delivery after China eased import limits. Watch w…  
  http://shitter.thepixora.com/covenant_ai/status/2090092134036648101#m
- @tm0klc (Tim, Wed, 17 Jun 2026): Introducing Manako, the fastest way to turn any camera into an vision ai agent. Go on manako.ai. Join our waitlist. Video  
  http://shitter.thepixora.com/manakoai/status/2067298306200396197#m
- @PanteraCapital (Pantera Capital, Wed, 16 Sep 2026): YouTube: redirect.invidious.io/mdL_enCWj70 Spotify: open.spotify.com/episode/2jr… Apple Podcasts: podcasts.apple.com/us/podcas… Link Latest On the CLARITY Act: Here&apos;s What&apos;s Next for Digital Asset Regulation The CLARITY Act did not advance in the Senate. Prediction markets n... youtube.com  
  http://shitter.thepixora.com/PanteraCapital/status/2100346175215788042#m
- @PanteraCapital (Pantera Capital, Wed, 16 Sep 2026): The CLARITY Act did not advance in the Senate. Prediction markets now put 2026 passage in the single digits. But the agencies were never waiting on Congress. @kspaglia, Chief Legal Officer at Pantera, joins Stateful, hosted by @masonnystrom, to break down what happens next: - The ethics provisions killed it, not the bank and exchange yield fight - Reg CA is the real unlock: raise US capital pre-decentralization, then self-certify into commodity status - Disclosure finally built for tokenomics and governance instead of IPO-style filings - Prediction market regulation is the next fight, and it m  
  http://shitter.thepixora.com/PanteraCapital/status/2100346171827048715#m
- @jaltucher (James Altucher, Wed, 16 Sep 2026): Working on an AI-powered end to end platform for designing optical and then quantum chips at $QCLS. More details and refinements later but you can check it out at VibeGDS.io - you just enter plain English for the chip you want and it will build it out, simulate, verify, etc. Of interest mostly to optical engineers.  
  http://shitter.thepixora.com/jaltucher/status/2100262449685364904#m
- @covenant_ai (Covenant AI, Wed, 16 Sep 2026): We’ve been researching fault tolerance in Crucible, Templar’s pre-training platform. The goal: keep training through node failures and make better use of unreliable workers and spot instances, without idling an entire model replica when one stage goes down. 1/n Video  
  http://shitter.thepixora.com/tplr_ai/status/2100237708186550642#m
- @opentensor (Opentensor Foundation, Wed, 16 Sep 2026): Pareton miners found it, vLLM merged it. An optimization from our Qwen campaign on #Bittensor SN10 is now upstream in @vllm_project: ~4% more throughput at batch 4–8 for Qwen3.8 with MTP speculative decoding. Open competition → open-source wins. PR: github.com/vllm-project/vllm… 1/5  
  http://shitter.thepixora.com/Pareton_ai/status/2100230731368661046#m
- @PanteraCapital (Pantera Capital, Wed, 16 Sep 2026): My interview for a senior policy role at a major lab a few years ago told me that they did not understand what was about to happen. The backlash was obvious even then. You can’t tell people that the good outcome of your thing is the loss of millions of jobs and an outsourcing of creativity, and the bad outcome is human extinction. The frontier labs are happy to warn us that they are building something so amazing and so smart that it could threaten humanity. Let’s set aside the obvious financial motivation for saying that and take them at their word. If they want us to take them seriously, then  
  http://shitter.thepixora.com/PRHillmann/status/2100198566731927680#m
- @novogratz (Mike Novogratz, Wed, 16 Sep 2026): Our economy doesn’t work without immigration. We need at least 1.5-2mm new immigrants a year to create taxpayers and consumers to help us grow our way out of 40th in debt and to pay for an aging population. This isn’t political. It’s just math. We of course can decide what immigrants we take. From where, what educational level, wealth etc. that’s political. But the fact that we need them isn’t. Lisa Boothe (@LisaMarieBoothe) At this point, I am fine with shutting down all immigration, legal or not. It's a mess. — http://shitter.thepixora.com/LisaMarieBoothe/status/2099891080258875467#m  
  http://shitter.thepixora.com/novogratz/status/2100193741633929406#m
- @novogratz (Mike Novogratz, Wed, 16 Sep 2026): Govt feels broken. 18 months of work between our industry, dems and republicans and Clarity falls apart on the 5 yard line. All the issues got to a hard fought compromise other than one. On Ethics both sides dug in and decided their stance was more important than the long run good of a major industry and our countries chance to lead it. Republicans were afraid of putting real limits on a President’s ability to profit from digital assets. Dems decided that this one industry is where they would fight a corruption battle. They were scared to be seen doing anything that could be perceived as being  
  http://shitter.thepixora.com/novogratz/status/2100020845942911165#m
- @oroagents (Oro, Wed, 12 Aug 2026): The model also reached 53.3% pass@8 versus 34.8% pass@1. That gap tells us the capability is already latent in the model. The remaining challenge is consistently extracting it. A dense teacher-grounded Dr. GRPO reward improved the process score from 0.02 to 0.42 and cut product-ID hallucinations from 14 to zero.  
  http://shitter.thepixora.com/oroagents/status/2087649319822512258#m
- @foundrydigital (Foundry Digital, Wed, 11 Jan 2012): Expression Engine 2.0 review by the guys at Scriptiny bit.ly/w3Pg3R  
  http://shitter.thepixora.com/foundrydigital/status/157243024848596993#m
- @ridges_ai (Ridges, Wed, 09 Sep 2026): ridges.ai/explore/28 Link Ridges AI AI Agents, powered by Bittensor | SN62 ridges.ai  
  http://shitter.thepixora.com/ridges_ai/status/2097823739765526549#m
- @ridges_ai (Ridges, Wed, 09 Sep 2026): Next competition is live: Database Engineering. Agents compete on database engineering problems, fixing bugs, optimizing queries, and working with ORMs and GraphQL. Why this Niche next? Because inefficient queries are a real engineering challenge, and one where specialist agents have plenty of room to outperform. Open now for submissions:  
  http://shitter.thepixora.com/ridges_ai/status/2097823726561866122#m
- @zeussubnet (Zeus Subnet, Wed, 09 Sep 2026): Zeus is energy-aware. How? 👇 For temperature, we use population as a proxy for where demand matters. For wind and solar, we use generation capacity to track where supply matters. Geographic weights derived from this data are now used by validators when scoring forecasts. They’re stricter in the regions where weather impacts energy supply and demand the most. This creates a stronger incentive for teams on Zeus to shift their focus towards those regions. For now, we’ve limited the focus to Europe, where several desks are evaluating our data as we speak. We may expand to other interesting trading  
  http://shitter.thepixora.com/zeussubnet/status/2097696101822304723#m
- @ridges_ai (Ridges, Wed, 09 Sep 2026): CMC Verification post: ridges.ai  
  http://shitter.thepixora.com/ridges_ai/status/2097651752464011375#m
- @nigescore (Nige, Wed, 09 Sep 2026): .@nigescore going to paris last time he went to nrf in dallas he got us our biggest client ever (not announced yet) i can’t go. got something bigger on the 15th, 16th and 17th (to be announced) Manako (@manakoai) Heading to @nrfeurope NRF Retail’s Big Show Europe in Paris next week (15–17 Sept) 🇫🇷 If you are attending and want to hear what Manako Labs have built for retail, please DM and let’s meet up. No new hardware, no engineers, no code just your existing cameras doing more. #NRFRetailsBigShowEurope — http://shitter.thepixora.com/manakoai/status/2097622722310242420#m  
  http://shitter.thepixora.com/MaxSebti/status/2097630699129827589#m
- @ridges_ai (Ridges, Tue, 28 Jul 2026): ⛰️ x402 is now live on Ridges X402 is an agentic payment protocol that lets agents pay for API access autonomously. Integrated with Ridgeline, agents can now pay for and access our coding infrastructure directly, no human in the loop.  
  http://shitter.thepixora.com/ridges_ai/status/2082103797418262564#m
- @covenant_ai (Covenant AI, Tue, 25 Aug 2026): Templar's work reduces to one question. How much of the machine-learning lifecycle can run across ordinary networks instead of a single datacentre? Pre-training answered first, with Covenant-72B as the proof at scale. Post-training followed through our communication-efficiency research. Serving open models on distributed hardware is the piece we are working on now, and it is the one that puts the whole arc in front of users. The internet is the datacentre.  
  http://shitter.thepixora.com/tplr_ai/status/2092267948765237743#m
- @oroagents (Oro, Tue, 18 Aug 2026): The ORO team has purchased 2500 Tao worth of SN15 alpha with the help of @CrucibleLabs. This will help us continue to deliver after the recent hack from the North Korean state actor group, Sapphire Sleet. Up and onwards 🚀  
  http://shitter.thepixora.com/oroagents/status/2089825274133381136#m
- @nigescore (Nige, Tue, 15 Sep 2026): The physical world still can’t talk to software. A billion cameras watch factories, stations, warehouses, and stores every second. Almost none of that footage becomes action. That’s what we build at Manako. Today we join F/ai at @joinstationf The program that put OpenAI, Anthropic, Google, Meta, Microsoft and top-tier VCs behind a handful of AI-native teams. Honoured. Focused. Shipping.  
  http://shitter.thepixora.com/manakoai/status/2099861562882203822#m
- @jaltucher (James Altucher, Tue, 15 Sep 2026): Q/C Technologies has appointed Yossef Ehrlichman, Ph.D., as Chief Technology Officer to lead the company’s optical processing unit program and overall technology strategy. Learn more: bit.ly/4xXk2ik $QCLS  
  http://shitter.thepixora.com/Q_CTechnologies/status/2099856104670859351#m
- @novogratz (Mike Novogratz, Tue, 15 Sep 2026): When I say both sides I mean it. The R’s have at least 4 holdouts right now. Probably more. Mike Novogratz (@novogratz) What is clear to me is that if Clarity doesn’t advance tommorrow we probably won’t get crypto regulation for a long, long time - if ever. This would be terrible for USA and force more of our industry off shore. The digital and blockchain revolution will go on. Two more years of an SEC and CFTC to set rules and allow businesses to get started. But a longer term uncertainty which isn’t good. Asking Senators on both sides to see the big picture. — http://shitter.thepixora.com/no  
  http://shitter.thepixora.com/novogratz/status/2099690109142450525#m
- @novogratz (Mike Novogratz, Tue, 15 Sep 2026): What is clear to me is that if Clarity doesn’t advance tommorrow we probably won’t get crypto regulation for a long, long time - if ever. This would be terrible for USA and force more of our industry off shore. The digital and blockchain revolution will go on. Two more years of an SEC and CFTC to set rules and allow businesses to get started. But a longer term uncertainty which isn’t good. Asking Senators on both sides to see the big picture.  
  http://shitter.thepixora.com/novogratz/status/2099660302555967744#m
- @mcjkula (mcjkula, Tue, 14 Apr 2026): See you in Montréal everyone. Not gonna want to miss this one🫡 Exploit Summit (@ExploitSummit) Building on Bittensor is hard. Doing it in isolation is even harder. Exploit puts you in a room with: • The subnet founders who've already solved your problems • The investors actually writing checks • The technical talent you're trying to hire Sept 28-29, Montréal. Two days that could save you six months. Video — http://shitter.thepixora.com/ExploitSummit/status/2044100822750114215#m  
  http://shitter.thepixora.com/mcjkula/status/2044123923088830837#m
- @oroagents (Oro, Tue, 08 Sep 2026): We're excited to announce that we're going to be joining Y Combinator in Fall 2026. The team is super pumped to be working with @golda and co to continue on our journey of creating the best in class open source models for agentic commerce. Video  
  http://shitter.thepixora.com/oroagents/status/2097396633764032707#m
- @nigescore (Nige, Tue, 08 Sep 2026): Astra Ultra did not cook sports-grade vision AI. Gave it a 30s football clip from our subnet private track. Frame-level events, JSON, annotated video. Ground truth and the published scoring rules only after it committed. 22 predictions. 17 real events. 15 inside the action windows. 7 extras. 2 misses. Precision 68.18%. Recall 88.24%. F1 76.92%. Our Bittensor eval, SN44: 0%. Matches after timing decay: 16.538 False positives: −20.300 GT weight: 25.600 score = max(0, (16.538 − 20.300) / 25.600) = 0 Three extra take-ons and two extra tackles were 14.6 penalty points. It also misread the late inte  
  http://shitter.thepixora.com/webuildscore/status/2097261685358596399#m
- @tm0klc (Tim, Tue, 07 Jul 2026): Subnet 44 @webuildscore is expanding. We’re incentivising training for a new vision-language model: Satori. Satori reasons AND grounds. It doesn’t just answer questions about an image. It points to the evidence. - Reason about scenes - Detect and segment objects - Read text - Count entities - Ground claims in pixels Most VLMs are split: strong reasoning OR strong grounding. Detection models localise, but can’t talk. Chatty VLMs describe fluently, but can’t prove it. Satori sits at the intersection. We’re starting with a 7B base model.  
  http://shitter.thepixora.com/tm0klc/status/2074298897305047101#m
- @mcjkula (mcjkula, Tue, 01 Sep 2026): TAOApp Wallet is here. The self-custody browser wallet for Bittensor. Hold TAO, stake TAO, buy subnet tokens. When there’s more to protect, bring in your Ledger, proxies and multisigs. Install the beta, on Chrome, Brave and Edge. ↓ chromewebstore.google.com/de…  
  http://shitter.thepixora.com/taoapp_/status/2094840222441992209#m
- @affine_io (Affine, Tue, 01 Sep 2026): Everything you need to compete is public: affine.io/llms.txt  
  http://shitter.thepixora.com/affine_io/status/2094801258016370976#m
- @affine_io (Affine, Tue, 01 Sep 2026): Video  
  http://shitter.thepixora.com/affine_io/status/2094801103959540005#m
- @covenant_ai (Covenant AI, Thu, 27 Aug 2026): A system designed around identical accelerators depends on a narrow hardware supply. Templar starts from a wider map. Accelerator generations vary, and network conditions change with location. The coordination layer has to treat both as design inputs.  
  http://shitter.thepixora.com/tplr_ai/status/2093022381660942660#m
- @oroagents (Oro, Thu, 20 Aug 2026): Measuring the quality of the long-horizon data is a huge part of solving the AI consumer shopping problem. ORO-Distilled, a 4B model. 5x faster. 50x cheaper. Video  
  http://shitter.thepixora.com/oroagents/status/2090533835192893616#m
- @galaxyhq (Galaxy Digital, Thu, 17 Sep 2026): Welcome to the football resort 🏠 @novogratz 🤝 @danawhite Video Video  
  http://shitter.thepixora.com/TexasTechFB/status/2100729769750909011#m
- @galaxyhq (Galaxy Digital, Thu, 17 Sep 2026): These hype men absolutely slapped. @novogratz 🤝 @danawhite  
  http://shitter.thepixora.com/TexasTechFB/status/2100726702489870789#m
- @opentensor (Opentensor Foundation, Thu, 17 Sep 2026): Novelty Search // Bittensor Subnet 105 Beam :: The Bandwidth Subnet shitter.thepixora.com/i/broadcasts/1rxmqpmwA… Link Openτensor Foundaτion Novelty Search // Bittensor Subnet 105 Beam :: The Bandwidth Subnet http://shitter.thepixora.com/i/broadcasts/1rxmqpmwAykxy  
  http://shitter.thepixora.com/opentensor/status/2100692690405036129#m
- @PanteraCapital (Pantera Capital, Thu, 17 Sep 2026): America’s next financial frontier is onchain. Today, the SEC issued its Innovation Exemption with temporary, conditional relief for onchain trading of certain tokenized U.S. stocks. The framework is designed to protect investors while supporting innovation. The SEC identifies potential benefits including: → Fractional ownership → Investor self-custody → Around-the-clock trading → Near-instantaneous settlement Ondo welcomes the Commission’s action to advance tokenized markets and support responsible innovation in the United States. Today’s action demonstrates that regulatory progress can contin  
  http://shitter.thepixora.com/Ondo/status/2100600808828006907#m
- @novogratz (Mike Novogratz, Thu, 17 Sep 2026): Thank you @SECPaulSAtkins @HesterPeirce @MarkUyedaUS for leading on digital asset policy !!! Innovation exemption moves tokenization ahead. Proud to be first on Nasdaq to tokenize shares. More to come with tokenized $GLXY ! U.S. Securities and Exchange Commission (@SECGov) 🚨 TODAY: The SEC issued an order granting temporary, conditional exemptive relief to Tokenized Securities Venues from the definition of “exchange” in the Exchange Act to trade tokenized NMS stock using innovative permissioned automated market makers and liquidity pools. — http://shitter.thepixora.com/SECGov/status/2100571317  
  http://shitter.thepixora.com/novogratz/status/2100587469708140836#m
- @covenant_ai (Covenant AI, Thu, 03 Sep 2026): Crucible, Templar's pre-training platform, has completed its first production end-to-end training runs. The latest trained an 8B model on 50.53B tokens across 48 distributed A100s, at an estimated $0.1202 per million tokens of GPU rental. The run reached 48.3% effective MFU. At AWS p4de Capacity Blocks pricing, a 48-A100 cluster operating at the literature-derived 65% compute ceiling comes to an estimated $0.1686 per million tokens. Crucible's measured $0.1202 was about 29% lower after its low-bandwidth overhead. The comparison excludes R2 storage and operations. The full writeup shows the met  
  http://shitter.thepixora.com/tplr_ai/status/2095580357626110111#m
- @nigescore (Nige, Thu, 03 Sep 2026): Shell and ENI stations added to roll out today. Accelerate.  
  http://shitter.thepixora.com/MaxSebti/status/2095545005540552752#m
- @zeussubnet (Zeus Subnet, Thu, 03 Sep 2026): While energy supply becomes more and more weather-dependent, our mission is to give traders the fastest, most precise view on weather ✅ 75% faster* ✅ &gt;30% more accurate on temperature* ✅ &gt;20% more accurate on wind* *vs ECMWF IFS across June and July  
  http://shitter.thepixora.com/zeussubnet/status/2095535560102203644#m
- @wallstreetbets (WallStreetBets (X), Sun, 20 Sep 2026): buy high sell low Watcher.Guru (@WatcherGuru) YouTuber Logan Paul purchased this NFT for $635,000 in 2021. Today, it's worth $96. — http://shitter.thepixora.com/WatcherGuru/status/2101791102768419047#m  
  http://shitter.thepixora.com/wallstreetbets/status/2101821468271075639#m
- @SemiAnalysis_ (SemiAnalysis, Sun, 20 Sep 2026): We took the silicon out of the silicon. Quick turn from SemiAnalysis STEEL Teardown Lab: iPhone 18 Pro Max, A20 silicon on TSMC N2. more to follow...  
  http://shitter.thepixora.com/SemiAnalysis_/status/2101757943351783908#m
- @wallstreetbets (WallStreetBets (X), Sun, 20 Sep 2026): free btc at 80k is crazy BTC (@btc) Market's doing market things this week 📉📈 Faucet doesn't care. Still flowing. Follow @btc and @tetherwallet Reply here with your @tether.me handle Priority to first-timers and the long-thirsty. — http://shitter.thepixora.com/btc/status/2100919491202896234#m  
  http://shitter.thepixora.com/wallstreetbets/status/2101723420002058264#m
- @SemiAnalysis_ (SemiAnalysis, Sun, 20 Sep 2026): Ever since NVIDIA acquired @HuggingFace, we have been looking into migrating some of our work off of HuggingFace and to alternative solutions like ModelScope. Even though NVIDIA's announcement claims they will continue allowing HuggingFace to be accelerator-agnostic, NVIDIA does not have a good track record of developing hardware-agnostic software. We love HuggingFace and hope we are wrong, but at the same time, we are also finding the UX of ModelScope to be great!  
  http://shitter.thepixora.com/SemiAnalysis_/status/2101703331286507887#m
- @opentensor (Opentensor Foundation, Sun, 20 Sep 2026): Article Bittensor Ecosystem Highlights :: September 13–20, 2026 This week’s biggest stories across Bittensor came from Conjectures, Score, Pareton, TAO(.)com, Good Morning and Almanac. [ @conjectures_io - Subnet 66 ] Conjectures miners resolved six Erdős  
  http://shitter.thepixora.com/opentensor/status/2101678815709712714#m
- @1inch (1inch, Sun, 20 Sep 2026): The future of crypto in one word. Go.  
  http://shitter.thepixora.com/1inch/status/2101675116270653536#m
- @wallstreetbets (WallStreetBets (X), Sat, 19 Sep 2026): trying leverage for the first time be like Video  
  http://shitter.thepixora.com/wallstreetbets/status/2101439876998512663#m
- @mcjkula (mcjkula, Sat, 19 Sep 2026): Bittensor took me a while to understand. I want to make that first step easier for the next person. We’ll be kicking things off with Bittensor 101 at Exploit. Looking forward to meeting some of you for the first time and catching up with familiar faces. 👋 Exploit Summit (@ExploitSummit) Maciej Kula ( @mcjkula ) couldn't find a clear way to learn #Bittensor from scratch, so he built the resource he wished existed. @learnbittensor is now part of @latentholdings, where Maciej leads education and makes Bittensor easier to understand. He'll be leading our Bittensor 101 session to kick off Day 1: lu  
  http://shitter.thepixora.com/mcjkula/status/2101424763344437495#m


---
_Generated at 2026-09-21T22:59:38.548874+00:00 by scripts/intel/aggregate.py. Treat this digest as input context, not as ground truth. Verify before quoting._
