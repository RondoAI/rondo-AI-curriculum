/* =================================================================
   SUBNET MAGAZINE, DAILY BRIEFINGS INDEX
   -----------------------------------------------------------------
   Curated index of the daily AI briefings the magazine publishes.
   The full briefings live as markdown under /briefings/ at the
   repo root, here we surface the headline + dek + 2-4 highlights
   per entry so the dashboard can render them as a hero strip
   without parsing markdown at runtime.

   Editorial standard for each entry:
     - date         ISO YYYY-MM-DD, matches the briefing file name
     - kicker       short label, normally "DAILY BRIEFING"
     - title        the briefing's analytical lead in a single line
     - dek          one-sentence summary of the day's structural story
     - highlights   2-4 anchored bullets, each with a TAG and 1-2 line
                    summary. The TAG is the entity or theme so readers
                    can scan the strip vertically in <2 seconds.
     - cats         centralized-news cats this briefing touches; feeds
                    the per-subnet backdrop logic in renderComparator
     - href         link to the full markdown on GitHub (opens in new tab)

   Adding a new briefing: write the markdown under /briefings/, add
   the entry here at the TOP of the array. The dashboard hero strip
   shows the first entry as today's lead and the next two as compact
   follow-ups.

   Currency rule: the strip header honestly reports how stale the
   most-recent briefing is. "TODAY · BRIEFING" only if the latest
   entry's date matches the user's local date; otherwise
   "Nd AGO · MOST RECENT BRIEFING" so the reader is never misled
   about whether the day's analysis is fresh.
   ================================================================= */

/**
 * @typedef {Object} BriefingHighlight
 * @prop {string} tag    short uppercase entity / theme tag (e.g. 'NVIDIA', 'HYPERSCALERS')
 * @prop {string} text   1-2 line analytical takeaway
 */

/**
 * @typedef {Object} Briefing
 * @prop {string}              date          ISO YYYY-MM-DD
 * @prop {string}              kicker        e.g. 'DAILY BRIEFING'
 * @prop {string}              title         analytical lead
 * @prop {string}              dek           one-sentence summary
 * @prop {BriefingHighlight[]} highlights    2-4 bullets
 * @prop {string[]}            cats          centralized-news cats touched
 * @prop {string}              href          link to full markdown
 */

/** @type {readonly Briefing[]} */
export const BRIEFINGS = Object.freeze([
  {
    date: '2026-05-13',
    kicker: 'DAILY BRIEFING',
    title: 'Hyperscalers, transformers, and the widening power story',
    dek: 'Top three hyperscalers spent $112B in a single quarter; transformer lead times now exceed 160 weeks; NVIDIA print May 20.',
    highlights: [
      { tag: 'NVIDIA',
        text: 'Print May 20, consensus $78.62B revenue (+78% YoY) and $1.74 EPS. Goldman $2B above the Street, flags potential "major re-rating."' },
      { tag: 'HYPERSCALERS',
        text: '$112B Q1 capex across Amazon, Alphabet, Microsoft. 2026 full-year guides roll up to ~$715B — 70%+ above 2025.' },
      { tag: 'POWER',
        text: 'Substation transformer lead times >160 weeks. 12 GW of 2026 US datacenter capacity announced, only 5 GW under construction. Electrical equipment is <10% of cost and 100% of the bottleneck.' },
      { tag: 'CHINA',
        text: 'Huawei 950PR testing well at Alibaba / ByteDance / Ant Group; targeting 750K units in 2026 as H200 stays in regulatory limbo.' },
    ],
    cats: ['chip', 'capex', 'lab', 'infra', 'policy'],
    href: 'https://github.com/RondoAI/rondo-AI-curriculum/blob/main/briefings/2026-05-13.md',
  },
  {
    date: '2026-05-11',
    kicker: 'DAILY BRIEFING',
    title: 'The bottleneck moves to power',
    dek: 'Microsoft\'s $80B Azure backlog cannot be fulfilled — not for lack of chips, for lack of electricity. The constraint has moved off silicon.',
    highlights: [
      { tag: 'MICROSOFT',
        text: '$80B Azure order backlog gated by power, not chip availability. Satya Nadella: GPUs sit idle in inventory because the company lacks the electricity to install them.' },
      { tag: 'HYPERSCALERS',
        text: '$725B combined 2026 capex (Google, Amazon, MSFT, Meta) — 77% above 2025, now consuming ~100% of operating cash flows vs. a 40% ten-year average. Buildout is debt-financed at scale.' },
      { tag: 'NVIDIA',
        text: 'Jensen raises envelope from "$500B Blackwell + Rubin orders through 2026" to "$1T opportunity through 2027." Print May 20, setup is high-expectation.' },
      { tag: 'TSMC',
        text: 'Five 2nm fabs ramping simultaneously — largest expansion in company history. 2026 wafers fully booked. Four consecutive years of advanced-node price increases ahead.' },
    ],
    cats: ['capex', 'infra', 'chip', 'lab'],
    href: 'https://github.com/RondoAI/rondo-AI-curriculum/blob/main/briefings/2026-05-11.md',
  },
  {
    date: '2026-05-07',
    kicker: 'DAILY BRIEFING',
    title: 'AMD reshapes the AI accelerator map',
    dek: 'AMD\'s Q1 beat ripped the stock 16% on the day; Meta signs a 6 GW deal; TSMC publicly named the 2026 bottleneck.',
    highlights: [
      { tag: 'AMD',
        text: 'Q1 EPS $1.37 vs $1.29 / revenue $10.25B vs $9.89B. Both OpenAI and Meta on Helios; Meta committed to 6 GW of AMD GPUs — larger than the peak load of many entire states.' },
      { tag: 'TSMC',
        text: 'Publicly named the 2026 bottleneck by Broadcom; wafers, HBM, and substrates locked through 2028. 2nm capacity at 70% CAGR through 2028 across five fabs.' },
      { tag: 'HYPERSCALERS',
        text: '2026 capex estimated at $660–690B (Microsoft, Alphabet, Amazon, Meta, Oracle) — roughly double 2025. ~75% is AI infrastructure, now financed by debt.' },
      { tag: 'FRONTIER LABS',
        text: '~1 new model every 11 days across Anthropic, OpenAI, Google since February. Mythos2 Preview "surpassing all but the most skilled humans" at vulnerability discovery.' },
    ],
    cats: ['chip', 'capex', 'lab', 'policy'],
    href: 'https://github.com/RondoAI/rondo-AI-curriculum/blob/main/briefings/2026-05-07.md',
  },
]);

/**
 * Latest briefing entry (date-sorted, most recent first).
 */
export function latestBriefing(){
  return BRIEFINGS[0] || null;
}

/**
 * Briefings other than the lead, optionally capped.
 * @param {number} [limit]
 */
export function priorBriefings(limit = Infinity){
  return BRIEFINGS.slice(1, 1 + limit);
}

/**
 * Find a briefing by ISO date. Returns null if not present.
 * @param {string} date  ISO YYYY-MM-DD
 */
export function briefingByDate(date){
  return BRIEFINGS.find(b => b.date === date) || null;
}

/**
 * Days between two ISO dates, treating both as UTC midnights.
 * Returns null if either input is unparseable. Negative if 'b' is in
 * the future relative to 'a'.
 * @param {string} a  ISO YYYY-MM-DD
 * @param {string} b  ISO YYYY-MM-DD
 */
export function daysBetween(a, b){
  const pa = Date.parse(a + 'T00:00:00Z');
  const pb = Date.parse(b + 'T00:00:00Z');
  if (!Number.isFinite(pa) || !Number.isFinite(pb)) return null;
  return Math.round((pb - pa) / 86_400_000);
}

/**
 * Honest currency header for the briefings strip. Tells the reader
 * exactly how stale the most-recent briefing is. Never fakes
 * "TODAY" when the lead is older than today.
 *
 *   same day        → 'TODAY · DAILY BRIEFING'
 *   yesterday       → 'YESTERDAY · DAILY BRIEFING'
 *   1 < N < 7 days  → 'N DAYS AGO · MOST RECENT BRIEFING'
 *   N >= 7          → 'NEW BRIEFING DUE · LATEST 13 MAY'
 *
 * @param {string} todayIso     ISO date for "today" (caller-supplied
 *                              so tests are deterministic)
 * @param {string} briefingIso  ISO date of the briefing
 */
export function currencyHeader(todayIso, briefingIso){
  const d = daysBetween(briefingIso, todayIso);
  if (d == null)                   return 'DAILY BRIEFING';
  if (d <= 0)                      return 'TODAY · DAILY BRIEFING';
  if (d === 1)                     return 'YESTERDAY · DAILY BRIEFING';
  if (d < 7)                       return `${d} DAYS AGO · MOST RECENT BRIEFING`;
  /* When we're a week or more behind, name the lead's date directly
     so the reader sees the gap rather than just a stale counter. */
  const [, m, dd] = briefingIso.split('-');
  const mo = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][parseInt(m,10)-1] || '';
  return `NEW BRIEFING DUE · LATEST ${parseInt(dd,10)} ${mo}`;
}
