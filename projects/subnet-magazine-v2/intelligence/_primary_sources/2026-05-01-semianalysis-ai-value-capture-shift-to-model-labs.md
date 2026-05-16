# SemiAnalysis · "AI Value Capture: The Shift to Model Labs"

**Source:** SemiAnalysis newsletter (Substack/newsletter.semianalysis.com), May 1 2026
**Authors:** Daniel Nishball, Dylan Patel, Cheang Kang Wen + 6 others, with a guest section by Crystal Huang
**Subject:** Where value accrues in the AI stack now that agentic AI has driven inflection-point demand for tokens
**Passed to Subnet Magazine on 2026-05-16 by Rondo, preserved with desk notes**

---

## Why this is a tier-1 primary source for the magazine

SemiAnalysis is the most-cited semiconductor and AI infrastructure analysis publication in the industry. Dylan Patel's work is read across Nvidia, the hyperscalers, the major hedge funds, and the labs. When SemiAnalysis publishes on AI value capture, the analyst conversation around the world re-prices accordingly.

This piece does NOT mention Bittensor. The Oracle should treat that absence as itself information: the most rigorous analyst publication on AI compute does not yet see decentralized compute networks as material to the question of where value accrues. Whether that omission is correct (decentralized AI really is too small to matter at the stack level today) or an oversight (decentralized AI is actually the structural answer to the pricing-power problem SemiAnalysis is documenting) is the question the magazine should ask.

---

## The thesis

Agentic AI has shifted value capture in the AI stack. Three eras:

- **2023 to 2025:** infrastructure layer captured everything. Nvidia, the memory vendors, the power vendors, TSMC. Model providers operated at thin margins.
- **2026 forward:** value shifts up the stack to the AI labs. The agentic-AI inflection has permanently raised the market-clearing price per token; software improvements have sharply reduced the cost of producing tokens. Frontier model labs are capturing the gap.
- **The puzzle:** Nvidia and TSMC, structural bottlenecks both, are NOT fully repricing to scarcity. They are "leaving substantial value on the table." The piece treats this as a strategic choice driven partly by antitrust risk.

---

## The quantitative claims worth preserving (verbatim numbers)

### Anthropic economics
- ARR grew from $9B to $44B+ YTD 2026
- Gross margins on inference infrastructure: 38% to 70%

### What sophisticated buyers spend on AI tokens
- SemiAnalysis itself: annualized token spend of $10.95 million
- That figure equals approximately 30% of employee compensation at SemiAnalysis
- ~5 billion tokens per month per SemiAnalysis employee (5.3x Meta's rate)
- Some individual team members run 100 billion+ tokens per month

### Anthropic pricing structure
- Opus 4.7 on agentic tasks: blended price $0.99 per million tokens (sticker $5/$25)
- Claude Code input-to-output ratio: ~300:1
- Cache hit rates: 90%+
- Cached input token cost: $0.50 per million
- Opus 4.5 launch (Nov 2025): $5 input / $25 output per million
- Previous Opus (4, 4.1): $15/$75 per million (3x higher than 4.5)
- Opus fast: 6x higher than regular Opus
- Mythos: $25/$125 per million (5x regular Opus)

### Hardware generation deltas
- Blackwell vs Hopper: 30x more tokens per second year-over-year
- GB300 NVL72 throughput: 17x over an optimized H100 in FP8
- FP4 advantage: 32x over Hopper (which lacks native FP4)
- GB300 TCO: 70% higher than H100
- Capex per watt: $37.4/W (GB300) to $38.1/W (VR NVL72)
- TDP: GB300 at 1400W; VR NVL72 at 2300W (roughly doubled)

### GPU rental economics for VR NVL72 (the Rubin generation)
- Cost-based minimum rental: $4.92/hour per GPU (5-year contract, 15% prepay, 15.6% IRR)
- Value-based ceiling, conservative: $9.63/hour per GPU
- Value-based ceiling, trend-based: $12.25/hour per GPU
- GB300 baseline: $0.70/PFLOP (training)
- VR NVL72 at cost-based pricing: $0.28/PFLOP (60% drop)
- Alternative pricing scenario: $8/hour yields 38% IRR and $0.46/PFLOP

### Hardware market conditions
- H100 1-year rental pricing: up 40% from the October 2025 low
- Memory pricing: up 6x in the past year
- Mobile LPDDR5X (1Q26): $6-7/GB
- SOCAMM contract pricing (1Q26): ~$8/GB
- Estimated exit 2026 SOCAMM pricing: >$13/GB

### Capacity and supply constraints
- N3 wafer utilization expected to exceed 100% in 2H 2026
- DRAM fabs already running above 90% utilization
- Neocloud networking cost premium: 94% higher vs hyperscalers
- Networking cost impact on total cluster capex: ~10% differential

### Adjacent stock performance (cited as analogous)
- Vistra (2024): +265%
- GE Vernova (2024): +146%
- SanDisk, Western Digital, Seagate, Micron (2025): 200%+ gains

---

## The key verbatim sentences (quotable for the Oracle)

> "The flood of demand is driven by end users enjoying a huge return on investment (ROI) from consuming tokens."

> "Agentic AI has crossed a real inflection point, driving a step-change in the value of tokens while software improvements have sharply reduced the cost of generating them."

> "The age of low gross margins for frontier model providers is over. Real agentic AI has permanently increased the market-clearing price per token, and there's no going back."

> "Compute constraints means that no single frontier lab will be able to serve the entire market."

> "The market has structurally shifted, with demand scaling faster than supply can respond."

> "Despite this structural advantage, Nvidia is not fully reflecting it in pricing."

> Kimi K2.6 ($0.95/$4) "exerts very little downward pressure on Opus pricing" and "open-source models are still noticeably worse than their closed source counterparts for real knowledge work."

---

## The framing that matters most for the magazine

### On where value accrues, the stack hierarchy SemiAnalysis lays out

1. **Model labs (AI labs):** top of the stack, capturing disproportionate share via token pricing power
2. **Inference providers:** margins widening as token production cost drops
3. **Neoclouds / hyperscalers:** extracting rental margins but constrained by demand for capacity
4. **Memory vendors:** prices up 6x, benefiting from SOCAMM scarcity
5. **Nvidia:** structural bottleneck but not fully repricing
6. **TSMC:** tightest constraint (N3 >100% utilization) but maintaining stable pricing
7. **End users:** enjoying "productivity bonanza" but paying for access

### The antitrust framing (Nvidia's strategic restraint)

> "Nvidia's position in the AI compute stack is already under increasing antitrust scrutiny, given its dominance across GPUs, interconnect, and software. In this environment, aggressively repricing systems to fully capture the value delivered risks drawing further attention, particularly if it results in outsized margin expansion while downstream AI labs are also generating significant profits."

The piece frames Nvidia as "the central bank of AI", balancing short-term margin extraction against long-term ecosystem stability and regulatory risk. TSMC is positioned as the historical precedent: "TSMC has historically taken a similar approach. Even while operating at full utilization and acting as the bottleneck for advanced-node supply, TSMC has generally avoided fully pricing to scarcity."

---

## The desk's read on cross-checking with today's Bittensor intel

### On Lium SN51 B300 pricing
The Lium marketplace screenshot from earlier today shows 8x B300 SXM6 AC at $47.92/hr spot, equating to $5.99/hr per B300. SemiAnalysis's cost-based minimum for VR NVL72 (Rubin generation, one step beyond Blackwell) is $4.92/hr per GPU at 15.6% IRR. So:
- Lium spot ($5.99/hr per B300) is approximately 22% above SemiAnalysis's cost-based minimum for the next-generation Rubin systems
- This is consistent with genuine cost-based pricing on Blackwell-class hardware, not predatory below-cost loss leadership
- The morning's @taomedia_ claim that Lium is "approximately 90% cheaper than hyperscalers" needs context. Measured against SemiAnalysis's value-based ceiling of $12.25/hr per GPU, Lium spot at $5.99 is 51% off, not 90%. Measured against hyperscaler list pricing for B300 specifically (commonly $15-30/hr when available), Lium is in the 60-80% off band. The "90% cheaper" framing is plausible only when compared to value-based hyperscaler ceiling pricing on flagship hardware at peak scarcity. The Oracle should hedge the claim accordingly.

### On the Bittensor pricing thesis broadly
SemiAnalysis is documenting the structural conditions (compute scarcity, hyperscaler pricing power, AI lab margin expansion) that make Bittensor's pitch coherent. They do not mention Bittensor, but the conditions they describe ARE the macro thesis Bittensor operates against. The Oracle should not treat the omission as a refutation; it is more accurately "Bittensor has not yet penetrated the analyst conversation but the macro setup favors its product category."

### On the open-source gap claim
SemiAnalysis says Kimi K2.6 "exerts very little downward pressure on Opus pricing" and "open-source models are still noticeably worse." Jon Durbin's Parallax goal (logged earlier today from his Chutes May 13 post) is explicitly "a model with the same quality and capabilities as GLM-5.1 or Kimi-K2.6 that could run on a single H200." If Parallax succeeds, it directly attacks the structural argument SemiAnalysis just made. The Connito whitepaper's decentralized-MoE-training thesis is the architectural mechanism for closing this gap. The Oracle has a genuine intellectual angle: "SemiAnalysis says the open-source gap won't close any time soon. Three Bittensor teams (Chutes, Connito, Templar) are betting it can. Here is the mechanism each is proposing and how to handicap their odds."

---

## Suggested follow-up for the magazine

1. **Add SemiAnalysis to the magazine's competitor watch list** alongside @taomedia_, @wallstreetbets, the Subnet Signal. They are an external publication that does NOT cover Bittensor but covers the macro conditions that DRIVE Bittensor. Worth tracking their releases as macro context.

2. **Dylan Patel** is the most famous AI infrastructure analyst in the world. If the magazine ever wants Bittensor on his radar, his X handle and the SemiAnalysis newsletter are the surface to seed. Add him to voices.js as a "macro voice the magazine tracks but does not yet cover us."

3. **The Oracle agent has a strong synthesis angle for tomorrow:** "What SemiAnalysis missed: decentralized compute is the structural answer to the pricing-power problem they just documented." This piece, paired with the Lium B300 stock screenshot, the Targon-Intel TDX paper, the Chutes Parallax reveal, and the Connito whitepaper, gives the agent material for the most ambitious Ecosystem State article it has yet been asked to write.

4. **A specific cross-check the Oracle should run** before publishing: SemiAnalysis says memory pricing is up 6x in the past year. If that holds, and if SOCAMM exits 2026 above $13/GB, then GPU pods like Lium's 8x B300 at ~2TB RAM are exposed to a meaningful component-cost increase. Worth modeling whether Lium's $5.99/hr spot pricing is sustainable through 2026, or whether the provider running those Helsinki pods is locking in low-cost memory inventory before the price moves.
