/* =================================================================
   SUBNEτ TERMINAL — Editorial seed
   The desk's research. Long-form argument tagged to the vertical it
   reasons about. These ship with the build; a CMS or markdown
   pipeline can replace the seed without touching the reader.
   ================================================================= */

import type { Article } from "@/lib/domain/editorial";

export const ARTICLE_SEED: Article[] = [
  {
    slug: "h100-spot-price-honest-number",
    title: "The H100 Spot Price Is the Most Honest Number in AI",
    deck: "Every other metric in this market is narrated. The hourly rate to rent a GPU is not.",
    author: "Subneτ Desk",
    date: "2026-05-12",
    vertical: "gpu",
    readMins: 6,
    body: [
      { kind: "p", text: "Model benchmarks are chosen. Funding rounds are announced. Capex guidance is a story a CFO tells about a future they would like you to believe in. The spot price of an H100-hour is none of those things. It is what a willing buyer paid a willing seller for a unit of compute, settled, this minute, with no press release attached." },
      { kind: "p", text: "That is why it belongs at the center of an AI research terminal and not in a footnote. When the H100 SXM spot rate on the independent clouds fell through two dollars an hour, it said something no earnings call did: the 2023 scarcity trade is over, and the 2026 trade is about who can turn cheap silicon into cheap tokens." },
      { kind: "h", text: "Price is a confession" },
      { kind: "p", text: "A falling rental rate is not bad news for the buildout — it is the buildout working. It means supply caught demand at that node of the stack. The interesting question is which node moves next. If H100s are liquid and B200s are not, the premium on the B200 line is the market pricing the exact width of the current bottleneck." },
      { kind: "quote", text: "The bottleneck is never gone. It only moves — from chips to power, from power to interconnect, from interconnect back to chips.", cite: "a recurring note from the desk" },
      { kind: "p", text: "Read the board on panel 070 that way. The spread between on-demand and spot is a measure of how nervous the seller is. The availability bar is a measure of how nervous the buyer should be. And the cheapest dollar-per-TFLOP row is, quietly, the most important line in the whole terminal: it is the floor under what any model — centralized or decentralized — can possibly cost to serve." },
      { kind: "h", text: "Why decentralized compute watches this hardest" },
      { kind: "p", text: "A Bittensor compute subnet does not get to narrate its way out of the spot price. It either serves inference below the going cloud rate or it does not earn. That discipline is the point. The same number that embarrasses a hyperscaler's margin story is the number a decentralized network is built to beat." },
    ],
  },
  {
    slug: "abilene-is-the-real-frontier-model",
    title: "Abilene, Texas Is the Real Frontier Model",
    deck: "The frontier of AI is not a checkpoint. It is a substation, an interconnect queue, and a county commission vote.",
    author: "Subneτ Desk",
    date: "2026-05-09",
    vertical: "power",
    readMins: 7,
    body: [
      { kind: "p", text: "There is a habit in this industry of treating the frontier as something that lives in a weights file. It does not. The frontier in 2026 is a question of whether ERCOT can energize a gigawatt of load in West Texas before the lease runs out, and whether the transformer to do it is on a boat or on back-order." },
      { kind: "h", text: "Follow the load, not the launch" },
      { kind: "p", text: "Panel 081 ranks the datacenter buildout by announced megawatts. Read it next to panel 080 — the ISO map — and a pattern resolves. The capacity is not going where the talent is. It is going where the power is cheap, the interconnect queue is short, and the grid operator says yes. That is why Abilene matters more than any single lab's roadmap." },
      { kind: "list", items: [
        "Cheap power is a moat that compounds — every token served there is structurally cheaper, forever.",
        "Interconnect queues are measured in years; a project in permitting today is a 2028 fact.",
        "The renewable share is not an ESG line — it is a hedge against the LMP volatility on the same panel.",
      ] },
      { kind: "p", text: "ERCOT's average hub LMP sitting in the low thirties while CAISO prints in the fifties is not trivia. It is a thirty-percent difference in the cost of the same compute, set by geography and regulation, not by engineering. No model architecture recovers that gap." },
      { kind: "quote", text: "You cannot prompt your way out of a grid constraint.", cite: "Subneτ Desk" },
      { kind: "p", text: "The decentralized angle is the sharpest one here. A network that can place compute wherever the LMP is lowest — instead of wherever a single company already poured concrete — has a structural answer to the one input nobody can scale on demand. The power map is not a side panel. For a decentralized compute thesis, it may be the main one." },
    ],
  },
  {
    slug: "open-weights-winning-the-argument",
    title: "Open Weights Are Winning the Argument They Were Losing",
    deck: "Two years ago the case for open models was ideological. Now it is on the leaderboard.",
    author: "Subneτ Desk",
    date: "2026-05-06",
    vertical: "ai",
    readMins: 5,
    body: [
      { kind: "p", text: "The release wire on panel 060 is not a curiosity feed. It is the clock speed of the open ecosystem, and that clock has gotten faster than the closed one. When a frontier-class open model ships and is quantized, fine-tuned, and serving on a decentralized subnet inside a week, the question is no longer whether open weights can compete. It is what the closed labs are still selling." },
      { kind: "h", text: "The leaderboard is the argument" },
      { kind: "p", text: "Panel 061 sorts by trailing-30-day downloads, which is the closest thing this field has to revealed preference. The models people actually pull and run are increasingly permissively licensed. That is not a values statement. It is a supply chain decision: a team that builds on weights it controls is not exposed to another company's pricing, deprecation schedule, or terms of service." },
      { kind: "p", text: "Pair that with the arXiv side of the wire and the loop closes. The paper proposes the method; the open checkpoint ships the method; the download count prices the method. Three feeds, one argument." },
      { kind: "quote", text: "A model you can download is a fact. A model you can only call is a relationship.", cite: "Subneτ Desk" },
      { kind: "p", text: "For Bittensor specifically this is existential good news. A decentralized network of miners is only as strong as the open model supply it can draw on. Every permissively licensed frontier release is raw material the network gets for free — and the wire is where you watch it arrive." },
    ],
  },
  {
    slug: "subnet-that-eats-its-emissions",
    title: "The Subnet That Has to Eat Its Own Emissions",
    deck: "Compute subnets are the only place in crypto where the token has to be cheaper than AWS to survive.",
    author: "Subneτ Desk",
    date: "2026-05-02",
    vertical: "bittensor",
    readMins: 6,
    body: [
      { kind: "p", text: "Most token economies are reflexive: the token funds the work, the work attracts holders, the holders bid the token. A Bittensor compute subnet does not get that luxury. Its miners sell a commodity — inference, training, GPU-time — into a market that already has a price, set by the clouds on panel 070. If the subnet's all-in cost of serving a token is above that line, no amount of narrative closes the gap." },
      { kind: "h", text: "Emissions are a subsidy with a deadline" },
      { kind: "p", text: "The τ emitted to a subnet is, functionally, a subsidy that lets miners undercut the cloud rate while the network bootstraps. That is fine — it is the point — but it means the honest metric for a compute subnet is not its market cap. It is the spread between its subsidized serving cost and the unsubsidized one. A subnet that still needs the full emission to clear the cloud price has not found product-market fit. It has found a faucet." },
      { kind: "list", items: [
        "Watch emissions share against real served volume, not against price.",
        "A healthy compute subnet's miners should be profitable at a fraction of emissions.",
        "The consensus Gini on panel 051 tells you whether that profit is broad or captured.",
      ] },
      { kind: "p", text: "This is why the four verticals in this terminal are one terminal. The subnet's viability is a GPU-price question and a power-price question wearing a token ticker. You cannot value the τ line without reading the cyan one and the lime one next to it." },
      { kind: "quote", text: "A compute subnet is a bet that decentralized coordination is cheaper than a hyperscaler's overhead. The terminal exists to check the math.", cite: "Subneτ Desk" },
    ],
  },
];

/** Most-recent-first, the order the panel and the reader want. */
export const ARTICLES = [...ARTICLE_SEED].sort((a, b) =>
  b.date.localeCompare(a.date)
);
