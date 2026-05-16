/* =================================================================
   SUBNET MAGAZINE, DAILY ECOSYSTEM RESEARCH
   -----------------------------------------------------------------
   One entry per day. The most recent goes first. Each entry is the
   distillation of what happened in the Bittensor ecosystem that
   day, written by the desk's autonomous research agent (Claude
   Opus 4.7, called from .github/workflows/daily-research.yml).

   How a new entry lands here:
     1. GitHub Action wakes at 08:00 UTC
     2. scripts/daily-research.py calls Claude with the day's
        market state + recent activity
     3. Claude returns a structured JSON brief
     4. The script prepends the brief to BRIEFS and commits

   Editorial rule: the desk does not delete prior briefs. The
   record is the record. Corrections go in a follow-up brief.

   Brief shape (every field required unless marked optional):
     { date:         'YYYY-MM-DD',
       headline:     one-sentence summary, the wire-lead voice,
       summary:      one paragraph, two or three sentences,
       movers:       [{ ticker, name, change, note }],  optional
       sections:     [{ h, body }],   the deep dive
       sources:      [{ label, url }] optional
       generatedBy:  'claude-opus-4-7' or 'editorial',
     }
   ================================================================= */

/**
 * @typedef {Object} ResearchBrief
 * @property {string} date         ISO YYYY-MM-DD
 * @property {string} headline
 * @property {string} summary
 * @property {Array<{ticker:string,name:string,change:string,note?:string}>=} movers
 * @property {Array<{h:string,body:string}>} sections
 * @property {Array<{label:string,url:string}>=} sources
 * @property {'claude-opus-4-7'|'editorial'} generatedBy
 */

/** @type {readonly ResearchBrief[]} */
export const BRIEFS = Object.freeze([
  {
    date: '2026-05-16',
    headline: 'Hippius ships Hermes v2, SN64 validator rotations land cleanly, dTAO emission curve unchanged at the 14d window',
    summary: 'Saturday session, thin globally, dense on chain. The marquee event was the general-availability ship of Hippius (SN75) Hermes v2, a routing-layer rewrite that pulls cross-subnet RPC p50 from the 1.2s to 1.5s band measured in the April issue down to a vendor-reported 380ms. The desk treats the vendor number as upper-bound until it can run an independent timing harness against the eight Hippius regions, but the architectural change (collapsing two sequential subtensor reads into a single attested batch) is consistent with the magnitude claimed. Validator-side, two of seven SN64 (Ridges) anchor validators rotated cold keys on schedule, no consensus stall, no incident report. dTAO emission per block held inside the 14d trailing band, which is the cleanest possible read for a Saturday: no announcement-driven distortion, no obvious flow from any of the three institutional wallets the desk tracks.',
    movers: [
      { ticker: 'SN75', name: 'Hippius',  change: '+4.2%', note: 'Hermes v2 GA, small bid into the ship' },
      { ticker: 'SN64', name: 'Ridges',   change: '-1.1%', note: 'Cold-key rotation, mechanically explained' },
      { ticker: 'SN14', name: 'TAOHash',  change: '+0.8%', note: 'OSS Capital reiterated thesis on X' },
    ],
    sections: [
      { h: 'Hermes v2, what actually changed',
        body: 'The Hippius team has been signalling the routing rewrite since the April issue. The shipped change replaces a two-phase commit across subtensor (one read to resolve the destination validator set, a second to submit the signed payload) with a single attested batch that piggybacks the destination resolution onto the same block as the payload. The theoretical floor on a single subtensor round-trip at current block time is roughly 200ms to 240ms wall-clock, depending on geographic placement of the caller. The vendor-reported 380ms p50 sits comfortably above that floor and is therefore not, on its face, implausible. The desk wants a third-party benchmark before treating it as the operating number, but the direction of travel is the relevant signal: cross-subnet composability becomes practical at this latency tier, and the Hippius pitch (data-plane for the network) gains a piece of mechanistic support it did not previously have.' },
      { h: 'SN64 validator rotation, why it matters even when nothing happened',
        body: 'Cold-key rotations on anchor validators are the kind of operational hygiene that gets undercounted until a rotation fails. Two of seven SN64 anchors rotated today with no observed effect on weights, no missed sets, no Discord incident channel activity. The desk notes this because the surviving evidence base for "Bittensor validator infrastructure is operationally mature" is, at this point in the network history, mostly an absence of public incidents rather than a presence of public post-mortems. Rotations that succeed quietly are the strongest available evidence for that maturity claim, and a magazine that does not record them ends up systematically biased toward the failure narrative.' },
      { h: 'dTAO emission, the cleanest read of the week',
        body: 'Daily emission landed inside the 14d trailing volatility band at every measured hour. No outsized prints from the three institutional wallets the desk tags as Polychain, Yuma Holdings, and Foundry. No anomalous flow into or out of the top five subnet liquidity pools beyond what would be expected from passive rebalancing. The honest reading: nothing in market structure today suggests a regime change, and the absence of signal is itself the signal. The desk treats weekends as a control day for the macro flow series, and today reads as a clean control.' },
      { h: 'Centralized comparator desk',
        body: 'No frontier-lab releases of consequence. NVIDIA earnings remain the next dated catalyst (post-close Wednesday); the implied move from the at-the-money straddle has compressed roughly 80 bps this week, which is consistent with the cooling pre-print regime that has held since the March print and is not yet contradicted by positioning. Asian session was thin. Hang Seng Tech and the AI subindex closed flat; Korean AI names traded in a narrow range on roughly half normal volume.' },
    ],
    sources: [
      { label: 'Hippius engineering blog, Hermes v2 GA announcement', url: 'https://hippius.io/blog' },
      { label: 'TaoStats, SN64 validator activity surface',          url: 'https://taostats.io/subnets/64' },
      { label: 'TaoStats, dTAO emission per block, 14d window',     url: 'https://taostats.io/metrics' },
    ],
    generatedBy: 'editorial',
  },
]);

/** Most recent brief, the one the page leads with. */
export function latestBrief(){
  return BRIEFS[0];
}

/** Brief by date (YYYY-MM-DD), or null. */
export function briefByDate(date){
  return BRIEFS.find(b => b.date === date) || null;
}
