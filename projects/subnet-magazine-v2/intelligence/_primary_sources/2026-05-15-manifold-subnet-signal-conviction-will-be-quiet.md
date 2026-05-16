# The Subnet Signal · "Conviction Will Be Quiet"

**Source:** Manifold Labs, The Subnet Signal newsletter (Substack), May 15 2026
**Author:** Viraj Sahu (Manifold Labs)
**Subject:** Deep analysis of the Conviction mechanism + TAO flow tweak, plus weekly subnet briefs
**Passed to Subnet Magazine on 2026-05-16 by Rondo, preserved verbatim**

---

## Publishing context worth noting

The Subnet Signal is published by Manifold Labs, the same team behind Targon (SN4) and the Intel TDX paper logged earlier today. So Manifold is simultaneously:
- A subnet operator (SN4 Targon)
- A media publisher (The Subnet Signal)
- A co-author of academic papers (the Intel collaboration)

That is a meaningful editorial-stance signal. The desk should treat Subnet Signal coverage of OTHER subnets as professional but read coverage of competing decentralized compute layers with awareness that Manifold is a positioned voice in that segment.

---

## The headline article: Conviction Will Be Quiet

The author's thesis (and the cleanest one-sentence summary the desk has seen of the new Conviction mechanism):

> "Conviction is likely to change the network more by preventing contests than by producing them."

### What Conviction actually is, mechanically

Conviction is the formal protocol mechanism that came out of the Locked Stake response to the April 2026 Sam Dare / Templar incident (logged earlier today via the WallStreetBets thesis). The Subnet Signal piece walks the mechanism for the first time at this level of detail:

- **Eligibility**: Conviction applies ONLY to subnets more than one year old. Younger subnets are excluded.
- **Challenger requirement**: To challenge a subnet's ownership, a party must accumulate 10% of the stake AT CURRENT PRICES and lock it publicly for two months before anything begins.
- **Visibility**: The lock is visible right away, giving the incumbent owner two full months of warning.
- **Challenger score curve**: When conviction activates, the challenger's score asymptotes from zero toward the amount they locked. Climbs slowly over months.
- **Owner defense**: The owner can match the lock at any time using the owner key and instantly register full conviction. No delay, no EMA, no warm-up.
- **Pooled defense**: Other holders can pool their conviction behind the owner, widening the gap further.
- **Asymmetry**: The challenger's months of capital commitment + public exposure can be undone in a single owner move.
- **Outcome rule**: A challenge succeeds only if the owner cannot afford to match the lock.

### The author's read on what Conviction actually does at the top

> "For subnets where ownership is concentrated, the contest dynamics matter less. These owners aren't locking to fend off challengers. They're locking to show they're committed and not planning to leave. When one entity holds a large share of the supply, the market carries a risk it can't easily price. A public lock with a visible timeline and decay curve helps manage that risk."

At the top of the network, Conviction is more about signaling commitment than contesting ownership.

### Where Conviction and the TAO flow tweak both land

The Subnet Signal piece introduces a second mechanism the desk had not seen named before, the **TAO flow tweak**:

> "Once chain subsidy is subtracted from net flow, subnets without real underlying activity lose their emission share."

The author observes that both upgrades converge on the same struggling subnets: cases where a team registered early, distributed most of the supply, and now holds a small fraction of the alpha, with no organized holder base willing to lock behind them. These are NOT competitive subnets with two strong claimants. They're subnets where ownership outlasted the team's active involvement.

Conviction resolves these cases. The TAO flow tweak starves them of emission. Together they clear seats that should have been vacated long ago.

### Const on the record describing Conviction's intent

> "Const described conviction as a defensive tool during Thursday's call, meant to help teams guard against nefarious or spurious attacks. He never framed it as a competitive market. The design matches that intent."

The author's expectation:

> "We expect most subnets will sit below 10% locked, keeping the mechanic dormant and ownership stable."

---

## NEW SUBNETS surfaced in the briefs (five the desk did not previously have)

### Compelle (SN82) — structured debates between AI models
- Runs structured debates to produce higher-quality outputs
- Launched mainnet May 8 2026
- Took over the slot same day after Hermes was deregistered
- 4,700 debate games in week one

### MVTRX (SN79) — DEX infrastructure for dTAO trading
- Decentralized exchange infrastructure optimized for AI agents
- Validator upgrade expanded simulation capacity to 128 parallel books
- Next update: live Observe Mode, 3D order-book visualization, UID relationship explorer

### Harnyx (SN67) — deep research as a commodity
- "Miners compete to produce traceable research reports faster and cheaper than expert analysis"
- Positioning as infrastructure layer for the agent economy
- Early-access waitlist open

### Ditto (SN118) — persistent memory + knowledge graph for AI agents
- Surged 128% in the week ending May 15
- Already powering agents like OpenClaw via MCP with 700+ users
- Recent slot takeover + open-source launch driving momentum

### NIOME (SN55) — biology data + AI for drug discovery
- Up 22% on the week
- Announced new government partnership in Scotland
- Upcoming summit driving interest
- "Connects real biology data with AI for better drug discovery and personalized medicine"

### Babelbit (SN59) — translation infrastructure
- Up 22% on the week
- Progress updates and founder interviews creating buzz
- "Can make high-quality translation cheap and available to everyone globally"

### Bitsec.ai (SN60) — AI security auditing
- Up 23% on the week
- "Uses AI to automatically find bugs and security issues in code and smart contracts"
- Recent updates + real customer wins drove interest
- Author's framing: "as more AI-generated code is created, preventing hacks becomes critical"

---

## CONFIRMS earlier intel

### Cacheon (SN14) rebrand confirmed and dated
The Subnet Signal confirms that Cacheon was the post-rebrand identity of Taohash, and dates mainnet to May 19 2026. SN14 gained 37% on the week ending May 15 on the back of "back-to-back AMAs with SubnetSummer and on Novelty Search." This corroborates the earlier @taomedia_ tip (May 12) that called the rebrand.

### Oro (SN15) confirmed as in-the-running for "largest open agent competition"
Consistent with the WallStreetBets thesis framing.

---

## CRITICAL EARLIER-EVENT FACT I had not previously logged

The newsletter's referenced earlier post titled **"Truly Open Intelligence: By the People, For the People"** (dated Feb 20 2026) carries the subtitle:

> "Bittensor's governance transition begins as Const steps down as CEO of Opentensor Foundation (OTF). Manifold covers what's next."

This is a major ecosystem fact the desk did not have. Const (@const_reborn, Jacob Steeves) stepped down as CEO of the Opentensor Foundation in February 2026. He remains the protocol's co-founder and is now also building Affine (SN120) as a subnet operator. The voices.js Const entry should be updated to reflect this transition.

The desk should chase the full Feb 20 Subnet Signal article to source the details of the governance transition.

---

## Additional Subnet Signal back-catalog (the magazine should mine this)

The footer of this article references earlier Subnet Signal posts worth following up:
- **Feb 13 2026:** "Bittensor's Latest Miners aren't Human" — about AI agents as miners
- **Feb 20 2026:** "Truly Open Intelligence: By the People, For the People" — Const steps down as OTF CEO (see above)
- **Mar 20 2026:** "The Internet Just Became An AI Lab" — about coordination without authority

---

## Desk notes for the Oracle

### Why this is high-leverage primary source material

The Subnet Signal is a positioned voice (Manifold publishes it) but the analysis quality is rigorous and the mechanism walkthrough on Conviction is the cleanest available. The Oracle agent should:

1. **Treat this as the primary citation for Conviction mechanics** for any future article that touches on the post-Templar governance changes.

2. **Distinguish what Conviction does at the TOP vs the BOTTOM** of the network, per the author's framing: signaling commitment at the top, clearing dormant seats at the bottom. This is editorial gold.

3. **Note the TAO flow tweak** as a separate mechanism running in parallel, also targeting the same struggling-subnet population. Both upgrades together represent a coordinated governance response to the post-dTAO ownership concentration problem.

4. **Update Const's voice entry** to reflect the Feb 2026 OTF CEO transition. This affects how the desk frames any future Const quote: he is now operating as a subnet founder (Affine SN120) and protocol-design voice, not as OTF CEO.

5. **The five new subnets** (Compelle SN82, MVTRX SN79, Harnyx SN67, Ditto SN118, plus Babelbit SN59, Bitsec.ai SN60, NIOME SN55) all warrant voices.js entries so the Nitter scraper picks them up automatically going forward. Many are previously-uncovered by the magazine and represent fresh Spotlight candidates.

6. **Manifold Labs as a media publisher** is a notable business-model fact. Worth flagging that a subnet operator running a serious newsletter alongside its technical product is a new ecosystem pattern.

### The framing the Oracle could borrow but should not copy

The author closes with:

> "Conviction is likely to change the network more by preventing contests than by producing them."

This is a quotable thesis. The Oracle should cite it, attribute to Subnet Signal / Manifold (with the May 15 date and URL), and then extend the analysis. Do not restate the article's thesis as the Oracle's own conclusion. Doing so would violate the editorial bar against "rewriting a thread that ran last week."
