# Intelligence Digest, 2026-09-22

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

- **Subtensor (chain)** (COMMIT `370bac4`, 2026-09-22 09:15) Merge pull request #3192 from RaoFoundation/cursor/spec-469-bugfixes-fee-refunds-1eaa  
  https://github.com/RaoFoundation/subtensor/commit/370bac46fa8cf602c4f8283a0635b3a8b4675394
- **Subtensor (chain)** (COMMIT `7a6f2e2`, 2026-09-22 03:22) fix(subtensor): the single-subnet swap_hotkey pre-check figure covers the clean-root checks (auditor 8668832a)  
  https://github.com/RaoFoundation/subtensor/commit/7a6f2e2a3ce3d47575bf67e23ffdbae622b1403e
- **Subtensor (chain)** (COMMIT `7cfbe23`, 2026-09-22 02:45) fix(subtensor): all-subnet swap_hotkey refusals keep the declared weight; single-subnet refusals pay their fixed pre-check reads (skeptic 533f63c3)  
  https://github.com/RaoFoundation/subtensor/commit/7cfbe23e0118def65eb45cfb04cd1188fd51e791
- **Subtensor (chain)** (COMMIT `eba0825`, 2026-09-22 02:39) docs: regenerate swap-hotkey source anchor  
  https://github.com/RaoFoundation/subtensor/commit/eba08254382e4ed2722ece6b5868326bc70c4e16
- **Subtensor (chain)** (COMMIT `a3e96ff`, 2026-09-22 02:38) fix(subtensor): the swap_hotkey pre-check figure covers every subnet scan the checks run (skeptic 533f63c3)  
  https://github.com/RaoFoundation/subtensor/commit/a3e96ffc83e82cf6d7c3b7867afd375b65e732ef
- **Subtensor (chain)** (COMMIT `b76b04c`, 2026-09-22 02:09) fix(subtensor): swap_hotkey keeps the declared weight on every in-transaction failure (auditor ad513859)  
  https://github.com/RaoFoundation/subtensor/commit/b76b04c2838d4e68dc78edc791ab0f109c71bfd2
- **Subtensor (chain)** (COMMIT `9f5073f`, 2026-09-22 01:40) fix(subtensor): a registration refused after the prune search keeps the declared weight (skeptic 2870f4be)  
  https://github.com/RaoFoundation/subtensor/commit/9f5073f46a5cafa7e25f3f21e4c292b86d69bf23
- **Subtensor (chain)** (COMMIT `1cc79b2`, 2026-09-22 00:48) ci: preflight --rev gates a clean HEAD in place and drops stale wbuild lockfiles  
  https://github.com/RaoFoundation/subtensor/commit/1cc79b22844176f325a97948a6595433b9d94d5b
- **Subtensor (chain)** (COMMIT `ccf93c7`, 2026-09-22 00:31) docs: regenerate swap-hotkey source anchor  
  https://github.com/RaoFoundation/subtensor/commit/ccf93c7569ca364e099438510d8bfa0e2cb83baf
- **Subtensor (chain)** (COMMIT `dd8a7de`, 2026-09-22 00:30) fix: local skeptic/auditor findings on the 469 refund paths  
  https://github.com/RaoFoundation/subtensor/commit/dd8a7de70bac7906f4fd6fc11b86243d85276af1
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

## ⊕ ECOSYSTEM BLOGS via RSS

_no new posts in the lookback window_

## ⊕ X via NITTER, voices we track

- @TargonCompute (Targon, Wed, 26 Aug 2026): Proud to power @TheoriqAI with secure confidential compute for their agentic market research. Large GPU blocks on demand, with hardware-level guarantees that keep the workload and its data private even from the machines running it. Excited to keep powering experimental research infrastructure with Targon. Theoriq (@TheoriqAI) .@TargonCompute is powering Theoriq AI experimentation. Curating risk-managed yield is, underneath, a research problem: how markets behave, where they break, and how much of that can be seen coming. That runs on heavy, on-demand compute. Targon is our partner in supplying  
  http://shitter.thepixora.com/TargonCompute/status/2092690588143657190#m
- @TargonCompute (Targon, Wed, 26 Aug 2026): .@TargonCompute is powering Theoriq AI experimentation. Curating risk-managed yield is, underneath, a research problem: how markets behave, where they break, and how much of that can be seen coming. That runs on heavy, on-demand compute. Targon is our partner in supplying it. Theoriq (@TheoriqAI) Article Theoriq partnering with Targon to power AI experimentation Curating risk-managed yield is, underneath, a research problem. Long before capital is deployed, we want to know how markets behave, where they tend to break, and how much of that can be seen coming — http://shitter.thepixora.com/Theor  
  http://shitter.thepixora.com/TheoriqAI/status/2092661304444277050#m
- @shibshib89 (Ala Shaabana, Wed, 16 Sep 2026): LFG! Crucible Labs (@CrucibleLabs) Crucible Wallet Extension v2.1.1 is LIVE. This isn’t just an update. We rebuilt the entire wallet experience from the ground up. A completely new UI. More control over your TAO. More Bittensor tools built directly into your wallet. What’s new in v2.1.1: ✔️Completely updated UI + light/dark mode ✔️Claim rewards directly in the wallet ✔️Unified balance across TAO + alpha ✔️Universal Swap ✔️Transfer TAO + alpha ✔️Subnet discovery + detailed subnet views ✔️Multi-address support for seed phrases ✔️12 and 24 word seed phrase support ✔️Updated Smart Account + Reward  
  http://shitter.thepixora.com/shibshib89/status/2100300168633761947#m
- @tplr_ai (Templar, Wed, 16 Sep 2026): When using pipeline compression with fixed projections shared across layers, robustness improves further as seen in the figure below. This suggests that shared projectors align representations across stage boundaries, making bypasses less disruptive. 4/n  
  http://shitter.thepixora.com/tplr_ai/status/2100237714918367690#m
- @tplr_ai (Templar, Wed, 16 Sep 2026): These results point toward training on a broader pool of compute, including unreliable workers and spot instances, while keeping healthy stages productive. Blog: tplr.ai/publications/blog/sk… n/n Link Fault tolerance in low-bandwidth model parallelism: exploring pipeline stage-skipping with boundary... We explore how the residual nature of the transformer architecture can be leveraged to mitigate hardware faults, and demonstrate that the compression-based implementation of low-bandwidth model... tplr.ai  
  http://shitter.thepixora.com/tplr_ai/status/2100237717162303718#m
- @tplr_ai (Templar, Wed, 16 Sep 2026): We’ve been researching fault tolerance in Crucible, Templar’s pre-training platform. The goal: keep training through node failures and make better use of unreliable workers and spot instances, without idling an entire model replica when one stage goes down. 1/n Video  
  http://shitter.thepixora.com/tplr_ai/status/2100237708186550642#m
- @a16zcrypto (a16z Crypto, Wed, 16 Sep 2026): The crypto industry needs a fair tax code. The Digital Asset Tax Certainty Act is a major step forward in achieving this. This bill creates clear rules for entrepreneurs while also providing a pathway for crypto foundations to reenter the U.S. and adopt this new tax structure. Thank you @RepJasonSmith, @WaysandMeansGOP, and @WaysMeansCmte for your bipartisan work on this bill. Ways and Means Committee (@WaysandMeansGOP) LIVE NOW: After more than a year of bipartisan work, the Ways and Means Committee is marking up the first-ever tax framework for digital assets, bringing much needed tax certai  
  http://shitter.thepixora.com/milesjennings/status/2100233610464825513#m
- @foundrydigital (Foundry Digital, Wed, 11 Jan 2012): Expression Engine 2.0 review by the guys at Scriptiny bit.ly/w3Pg3R  
  http://shitter.thepixora.com/foundrydigital/status/157243024848596993#m
- @shibshib89 (Ala Shaabana, Wed, 09 Sep 2026): Did you hear? Crucible Wallet is officially live on iOS today. An easy to use Bittensor wallet with Ledger security, Unified Swap and subnet level performance. Now available on iOS in the US, Android and Chrome. Download at CrucibleLabs.com #Bittensor #TAO #CrucibleWallet  
  http://shitter.thepixora.com/CrucibleLabs/status/2097815766473323006#m
- @shibshib89 (Ala Shaabana, Wed, 09 Sep 2026): We are officially on iOS! Onwards 🚀 Crucible Labs (@CrucibleLabs) A long time coming and officially here. Crucible Wallet is now available on iOS in the US. An easy, intuitive Bittensor wallet for your everyday TAO needs, with Unified Swap, portfolio tracking and Ledger support wherever you go. Already available on Google Play and Chrome Store. Download at CrucibleLabs.com #CrucibleWallet #TAO #Bittensor — http://shitter.thepixora.com/CrucibleLabs/status/2097699938209857625#m  
  http://shitter.thepixora.com/shibshib89/status/2097724813028516224#m
- @nigescore (Nige, Wed, 09 Sep 2026): .@nigescore going to paris last time he went to nrf in dallas he got us our biggest client ever (not announced yet) i can’t go. got something bigger on the 15th, 16th and 17th (to be announced) Manako (@manakoai) Heading to @nrfeurope NRF Retail’s Big Show Europe in Paris next week (15–17 Sept) 🇫🇷 If you are attending and want to hear what Manako Labs have built for retail, please DM and let’s meet up. No new hardware, no engineers, no code just your existing cameras doing more. #NRFRetailsBigShowEurope — http://shitter.thepixora.com/manakoai/status/2097622722310242420#m  
  http://shitter.thepixora.com/MaxSebti/status/2097630699129827589#m
- @shibshib89 (Ala Shaabana, Wed, 02 Sep 2026): Crucible Labs dropping #downwiththedev Episode 1. We breakdown the Mobile Wallet with @buildwithsamp. Take a listen. Video  
  http://shitter.thepixora.com/CrucibleLabs/status/2095144290376937770#m
- @wallstreetbets (WallStreetBets (X), Tue, 22 Sep 2026): bears are fucked  
  http://shitter.thepixora.com/wallstreetbets/status/2102280482822008886#m
- @wallstreetbets (WallStreetBets (X), Tue, 22 Sep 2026): jim sold the bottom again 😭 Watcher.Guru (@WatcherGuru) JUST IN: Bitcoin is up 38% since Jim Cramer said he was selling. On August 3, 2026, Cramer said he was selling his Bitcoin over quantum computing fears. $BTC was trading around $63,000. It has since surged to $87,000, a gain of $24,000 over the past 49 days. Bitcoin has also added $475,000,000,000 to its market cap during that period. — http://shitter.thepixora.com/WatcherGuru/status/2102144598688588028#m  
  http://shitter.thepixora.com/wallstreetbets/status/2102250283908894761#m
- @wallstreetbets (WallStreetBets (X), Tue, 22 Sep 2026): BREAKING: prediction markets are officially on X Spotlight for the NFL Gemini is taking over the section with pro football markets prediction markets are everywhere now  
  http://shitter.thepixora.com/wallstreetbets/status/2102226001056915772#m
- @markjeffrey (Mark Jeffrey, Tue, 22 Sep 2026): Bessent basically said:  
  http://shitter.thepixora.com/markjeffrey/status/2102221840634810491#m
- @VantaTrading (Vanta, Tue, 22 Sep 2026): Funded should mean paid. With a receipt a stranger can open. Weekly rewards from the day you pass Vanta's classic evaluation, always listed on our public ledger. Our pro accounts are here, and soon traders will be earning rewards on $1,000,000 accounts. You can view all of our rewards paid transparently here: vantatrading.io/rewards  
  http://shitter.thepixora.com/VantaTrading/status/2102217735828873365#m
- @markjeffrey (Mark Jeffrey, Tue, 22 Sep 2026): Google and Apple are loading up on crypto people. CoinMarketCap (@CoinMarketCap) LATEST: ⚡ Apple and Google have both posted senior roles seeking stablecoin and blockchain expertise, covering Apple Pay strategy and Google Cloud's digital asset clients. — http://shitter.thepixora.com/CoinMarketCap/status/2102187667391680925#m  
  http://shitter.thepixora.com/markjeffrey/status/2102217673568624667#m
- @VantaTrading (Vanta, Tue, 22 Sep 2026): Markets had a good Monday. Nasdaq up 2.3% on chips, bitcoin over $85,000, Brent under $100 for a fourth day as the Iran talks cooled things off. PCE Friday is the one that matters. However you're positioned, size it right. That's the whole game. vantatrading.io/pro  
  http://shitter.thepixora.com/VantaTrading/status/2102198861427249658#m
- @nigescore (Nige, Tue, 15 Sep 2026): The physical world still can’t talk to software. A billion cameras watch factories, stations, warehouses, and stores every second. Almost none of that footage becomes action. That’s what we build at Manako. Today we join F/ai at @joinstationf The program that put OpenAI, Anthropic, Google, Meta, Microsoft and top-tier VCs behind a handful of AI-native teams. Honoured. Focused. Shipping.  
  http://shitter.thepixora.com/manakoai/status/2099861562882203822#m
- @tplr_ai (Templar, Tue, 15 Sep 2026): Video  
  http://shitter.thepixora.com/tplr_ai/status/2099855617921880470#m
- @nigescore (Nige, Tue, 08 Sep 2026): Astra Ultra did not cook sports-grade vision AI. Gave it a 30s football clip from our subnet private track. Frame-level events, JSON, annotated video. Ground truth and the published scoring rules only after it committed. 22 predictions. 17 real events. 15 inside the action windows. 7 extras. 2 misses. Precision 68.18%. Recall 88.24%. F1 76.92%. Our Bittensor eval, SN44: 0%. Matches after timing decay: 16.538 False positives: −20.300 GT weight: 25.600 score = max(0, (16.538 − 20.300) / 25.600) = 0 Three extra take-ons and two extra tackles were 14.6 penalty points. It also misread the late inte  
  http://shitter.thepixora.com/webuildscore/status/2097261685358596399#m
- @TargonCompute (Targon, Tue, 01 Sep 2026): Happy to help! Proud to be trusted with running critical workloads such as validators. Very excited to see the talented team at DeSci Labs join the Bittensor ecosystem, their research and expertise are sure to add long-lasting value to the network. 🔬 Claims - Subnet 111 (@DeSciClaims) Our validator for SN111 is running on hardware provided by @TargonCompute. We're super grateful for the fast, reliable setup and the team's amazing support. Thank you, guys! — http://shitter.thepixora.com/DeSciClaims/status/2094364807596036575#m  
  http://shitter.thepixora.com/TargonCompute/status/2094908006039236625#m
- @BarrySilbert (Barry Silbert, Thu, 27 Aug 2026): Eventually investors will connect the dots to Bittensor bittensor:native Tommy (@Shaughnessy119) OpenRouter, poolside, Hugging Face Everything open source getting acquired — http://shitter.thepixora.com/Shaughnessy119/status/2092792085459935404#m  
  http://shitter.thepixora.com/BarrySilbert/status/2093020796109123804#m
- @a16zcrypto (a16z Crypto, Thu, 17 Sep 2026): Clarity was coming no matter the outcome of the vote. Paul Atkins (@SECPaulSAtkins) Today, we are taking a significant step forward, within our statutory authority, to bring America’s capital markets into the digital age by facilitating onchain trading of certain tokenized stocks through the "Innovation Exemption." 🇺🇸 — http://shitter.thepixora.com/SECPaulSAtkins/status/2100572313334821271#m  
  http://shitter.thepixora.com/Collin_McCune/status/2100575079318855709#m
- @nigescore (Nige, Thu, 03 Sep 2026): Shell and ENI stations added to roll out today. Accelerate.  
  http://shitter.thepixora.com/MaxSebti/status/2095545005540552752#m
- @jtledore (Jean-Thomas Ledoré, Sun, 20 Sep 2026): Very cool! Any chance we could get it on hf.co/datasets? Link Datasets – Hugging Face Explore datasets powering machine learning. huggingface.co  
  http://shitter.thepixora.com/ClementDelangue/status/2101801371477393660#m
- @const_reborn (Jacob Steeves, Sun, 20 Sep 2026): I love the push towards private AI, but a seperate source of freedom will be truly public AI, i.e. a world where the majority of AI trajectories are searchable, and thus minable for us to improve, understand and monitor intelligence -- not just the central labs.  
  http://shitter.thepixora.com/const_reborn/status/2101783043354538441#m
- @jtledore (Jean-Thomas Ledoré, Sun, 20 Sep 2026): Article Bittensor Ecosystem Highlights :: September 13–20, 2026 This week’s biggest stories across Bittensor came from Conjectures, Score, Pareton, TAO(.)com, Good Morning and Almanac. [ @conjectures_io - Subnet 66 ] Conjectures miners resolved six Erdős  
  http://shitter.thepixora.com/opentensor/status/2101678815709712714#m
- @manakoai (Manako, Sun, 20 Sep 2026): making new friends while deploying @manakoai  
  http://shitter.thepixora.com/MaxSebti/status/2101651979541901384#m
- @VantaTrading (Vanta, Sun, 20 Sep 2026): Nobody in the industry is scaling your account to $1,000,000. Except Vanta. Ours is a $1,000,000 Pro account. And that's at zero additional cost. What's stopping you from joining today? vantatrading.io/pro  
  http://shitter.thepixora.com/VantaTrading/status/2101491682982445066#m
- @jtledore (Jean-Thomas Ledoré, Sun, 20 Sep 2026): Announcing one year of LLM inference metadata traces, with 6.12 billion requests. We hope this dataset can support research on real-world LLM serving workload understanding, system design and infrastructure optimization. Explore the dataset and learn more: data.agentic-system.org Driven by our great graduate student William Nixon and in collab with @jon_durbin @airesearch12 @chutes_ai Link Open Data · A dataset hub for LLM serving research A dataset hub for LLM serving research. Request traces, agent workloads, and GPU telemetry from Harvard MadSys and collaborators. data.agentic-system.org  
  http://shitter.thepixora.com/1a1a11a/status/2101469990188732897#m
- @jtledore (Jean-Thomas Ledoré, Sat, 19 Sep 2026): people overestimate what can happen in a year and underestimate what can happen in 2, 5 or 10 over the last two weeks I had confirmations at so many levels that we were playing the right playbook at the right place and the right time, with the right team. 1. IBC Amsterdam and NRF Paris confirmed the need for a real open vision AI alternative (and made us proud of our models’ quality and efficiency). 2. the current petrol station rollout confirmed that Manako was plug-and-play and ready to be installed at the speed of light (5 mins process from box opening to live deployment) in june I didn’t k  
  http://shitter.thepixora.com/MaxSebti/status/2101417422440046836#m
- @nigescore (Nige, Sat, 19 Sep 2026): We’re completing our first 20 reference deployments, led by our CEO and engineering team, and the headline finding is that Manako is genuinely plug and play. No specialist integration required: a unit can be shipped to site and connected by anyone on the ground. That’s what makes our next phase possible. Our integration partners will roll out at scale on a simple, repeatable install, with less time on site and lower cost per deployment.  
  http://shitter.thepixora.com/manakoai/status/2101403529558577403#m
- @webuildscore (Score, Sat, 19 Sep 2026): what "skill issue" looks like: Video  
  http://shitter.thepixora.com/webuildscore/status/2101372555688919339#m
- @webuildscore (Score, Sat, 19 Sep 2026): This is our general detector, running inside Score Studio, on Heat vs Mavericks, tied at 39 in the second quarter. Miami crashes the glass for 7 straight offensive rebounds. Every player on the floor stays boxed through the scramble, the ball tracked with them, frame after frame. 180 frames sampled, 4,298 objects found, each one drawn and laid back out for review. One raw broadcast clip in, a labelled and measurable model out, without a single frame touched by hand. Original video in the comments 👇 Try it here: scorestudio.ai Video  
  http://shitter.thepixora.com/webuildscore/status/2101371661136138357#m
- @const_reborn (Jacob Steeves, Sat, 19 Sep 2026): Jev by @typesafeai might change how we control robots. We compared Jev, GPT-6 Astra and GPT-4.1 mini in MuJoCo. One apple. One plate. Each model chooses intent → X/Y/Z direction + gripper open/hold/close. 🧵 Video  
  http://shitter.thepixora.com/openroboto/status/2101310974359941332#m
- @manakoai (Manako, Sat, 19 Sep 2026): now deploying sites in 10min from a phone  
  http://shitter.thepixora.com/MaxSebti/status/2101289380602163437#m
- @BarrySilbert (Barry Silbert, Sat, 19 Sep 2026): 🇦🇷 NEW: Argentina will begin automatically sharing crypto transaction data with tax authorities worldwide by September 2029. The tax man is coming.  
  http://shitter.thepixora.com/Cointelegraph/status/2101189610248253728#m
- @TargonCompute (Targon, Mon, 31 Aug 2026): It's been a pleasure working with the @cascade_sn91 team on their recent SN91 launch. As the first team out of the @bitstarterAI ML track, we were proud to support them with initial compute credits on Targon. Excited to continue powering their pursuit of SOTA time series foundation models on Bittensor. ⚡️ SN91, Cascade (@cascade_sn91) Article Better Data, Better Models: What 184 Experiments Changed for Cascade To build the best decoder for Cascade, we needed to optimize across streaming, covariates, context and the training distribution. Thanks to compute credits from @Targoncompute, we were a  
  http://shitter.thepixora.com/TargonCompute/status/2094532034488058036#m
- @shibshib89 (Ala Shaabana, Mon, 31 Aug 2026): Get ready, a new TAO-inspired podcast with @CrucibleLabs own @buildwithsamp and Kelly. Coming soon! Video  
  http://shitter.thepixora.com/CrucibleLabs/status/2094445795848446011#m
- @markjeffrey (Mark Jeffrey, Mon, 21 Sep 2026): Bittensor Bungalow $TAO shitter.thepixora.com/i/spaces/1RJjpbrVrlBKw Link Twitter Space Click to view Space http://shitter.thepixora.com/i/spaces/1RJjpbrVrlBKw  
  http://shitter.thepixora.com/markjeffrey/status/2102185950566826375#m
- @markjeffrey (Mark Jeffrey, Mon, 21 Sep 2026): The GREAT @markjeffrey, the AMAZING @JesusMartinez, and myself all in ONE Space! 🔥 We’re only 20 minutes away — pop in and hang with us! 🏝️ BITTENSOR BUNGALOW 🏝️ This one should be a damn good time. bittensor:native Jesus Martinez (@JesusMartinez) I'll be going live w/ @markjeffrey &amp; @ShizzyUnchained to chat $TAO in 30 minutes on X spaces Tune in! (to Bittensor Bungalow) — http://shitter.thepixora.com/JesusMartinez/status/2102179616811086064#m  
  http://shitter.thepixora.com/ShizzyUnchained/status/2102181307367174348#m
- @markjeffrey (Mark Jeffrey, Mon, 21 Sep 2026): Did you know Bittensor ($TAO) produce apps that compete with iCloud and Dropbox and cost a fraction of the blockbuster product for the consumer? Probably not, and that’s on us. But this is why it is pumping af today. Hippius (@Hippius_cloud) The Hippius mobile app is live on Android. Your photos and files, backed up automatically and end-to-end encrypted on your phone before they ever upload. The same account and storage you already use on desktop and web. Your whole cloud, now in your pocket. iOS is coming next. — http://shitter.thepixora.com/Hippius_cloud/status/2101978478904222062#m  
  http://shitter.thepixora.com/tylerdurdeth/status/2102177648369615221#m
- @wallstreetbets (WallStreetBets (X), Mon, 21 Sep 2026): pairing stocks with memes was inevitable Zora (@zora) Custom Pairs are now live for all users on the Zora mobile app. Create new pairs with stocks, memes, and majors on the go in just a few clicks. Plus, crosschain trading is now available on all supported networks: -SOL -BNB -RH -BASE Out now on iOS and Android! Download here: zora.co/ Video — http://shitter.thepixora.com/zora/status/2102101502210785421#m  
  http://shitter.thepixora.com/wallstreetbets/status/2102176363046150607#m
- @wallstreetbets (WallStreetBets (X), Mon, 21 Sep 2026): The X takeover🤘 X (@X) timeline. ticker. trade. Video — http://shitter.thepixora.com/X/status/2102147636702634195#m  
  http://shitter.thepixora.com/wallstreetbets/status/2102175845766856813#m
- @a16zcrypto (a16z Crypto, Mon, 21 Sep 2026): You don’t have to move a market onchain if you build it there in the first place. @guywuolletjr on why he’s excited about new markets for compute and energy 👇 Video  
  http://shitter.thepixora.com/a16zcrypto/status/2102164015409418469#m
- @jtledore (Jean-Thomas Ledoré, Mon, 21 Sep 2026): A Harvard research team and @chutes_ai just released a public dataset covering one year of real-world LLM inference on Chutes: 6.12B requests across 9,174 models. Technical usage data from a Bittensor subnet is now open to the wider AI research community. Juncheng Yang (@1a1a11a) Announcing one year of LLM inference metadata traces, with 6.12 billion requests. We hope this dataset can support research on real-world LLM serving workload understanding, system design and infrastructure optimization. Explore the dataset and learn more: data.agentic-system.org Driven by our great graduate student W  
  http://shitter.thepixora.com/opentensor/status/2102149456401408309#m
- @webuildscore (Score, Mon, 21 Sep 2026): Where can we buy this chain? Millie (@AltcoinMillie) I finally got it in the booth with the Goat @MaxSebti Never seen a subnet owner owning gas stations to making a full mixtape. I told y'all 🐐Max never stops working! I blame @tsliceAI for what's going on in Montreal. We lit doe @webuildscore $TAO #higher Video — http://shitter.thepixora.com/AltcoinMillie/status/2102104893980831866#m  
  http://shitter.thepixora.com/webuildscore/status/2102110342004310234#m
- @const_reborn (Jacob Steeves, Mon, 21 Sep 2026): Welcome to the era to decentralized post trained models that beat the frontier in their classes. Reliquary | Bittensor SN81 τ (@reliquary_ai) Introducing Reliquary-4B. A 4B math & code model trained with reinforcement learning. Anyone could join the network and contribute rollouts. Independent miners chose the prompts and generated the rollouts. The protocol verified them and trained the model. Here’s the model and the research behind it. — http://shitter.thepixora.com/reliquary_ai/status/2102107246905741819#m  
  http://shitter.thepixora.com/const_reborn/status/2102110250241314873#m


---
_Generated at 2026-09-22T16:06:38.734135+00:00 by scripts/intel/aggregate.py. Treat this digest as input context, not as ground truth. Verify before quoting._
