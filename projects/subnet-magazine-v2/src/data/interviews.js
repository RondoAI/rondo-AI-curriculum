/* =================================================================
   SUBNET MAGAZINE, INTERVIEWS DATA
   -----------------------------------------------------------------
   Every video interview the magazine has published. Editorial,
   not algorithmic, each entry is a primary-source conversation
   with a builder, founder, operator, or capital allocator inside
   the decentralized-intelligence economy.

   How to add a new interview:
     1. Upload the video to the Subnet Magazine YouTube channel.
     2. Copy the 11-character YouTube ID from the share URL.
     3. Add a new entry to the array below following the shape
        of the existing rows. recordedAt is ISO date (YYYY-MM-DD).
        thumb auto-generates from the YouTube ID if omitted.
     4. Commit + push. The /interviews.html page picks it up
        automatically on next load, no view code to touch.

   YouTube thumbnail URL template (auto-used by the view):
     https://i.ytimg.com/vi/<ID>/hqdefault.jpg
   ================================================================= */

/**
 * @typedef {Object} InterviewRow
 * @property {string}   id            short editorial slug, used in deep-link anchors
 * @property {string}   title         video title (matches YouTube)
 * @property {string}   guest         name of the interviewee
 * @property {string}   guestRole     role + affiliation, one short line
 * @property {string}   recordedAt    ISO date YYYY-MM-DD
 * @property {string=}  duration      "MM:SS" or "HH:MM:SS", optional
 * @property {string}   dek           1–3 sentence editorial summary
 * @property {string}   youtubeId     11-char YouTube ID
 * @property {string=}  thumb         override thumbnail URL (defaults to YT auto)
 * @property {string[]} tags          short tags ("dTAO", "validator", "fund letter", etc.)
 */

/** @type {readonly InterviewRow[]} */
export const INTERVIEWS = Object.freeze([

  {
    id:         'brian-mccrindle',
    title:      'Interview with Brian McCrindle',
    guest:      'Brian McCrindle',
    guestRole:  'Bittensor operator',
    recordedAt: '2026-05-15',
    duration:   '',                  /* fill in once known */
    dek:        'A primary-source conversation on building inside the Bittensor network, operating subnets, evaluating validators, and what the decentralized-intelligence economy actually looks like from the inside.',
    youtubeId:  'OZACPOPNwJQ',
    tags:       ['operator', 'subnet'],
    /* Oracle concepts this conversation touches */
    oracleRefs: ['bittensor', 'subnet', 'miner', 'validator'],
  },

]);

/**
 * Construct the standard YouTube hqdefault thumbnail URL for an
 * interview entry. Falls back to the explicit `thumb` field if
 * the row provides one.
 * @param {InterviewRow} row
 * @returns {string}
 */
export function thumbFor(row){
  if (row.thumb) return row.thumb;
  return `https://i.ytimg.com/vi/${row.youtubeId}/hqdefault.jpg`;
}

/**
 * Construct the privacy-enhanced YouTube embed URL for an
 * interview. youtube-nocookie.com serves the same player but
 * doesn't set tracking cookies until the user actually plays.
 * @param {InterviewRow} row
 * @param {{autoplay?: boolean}} [opts]
 * @returns {string}
 */
export function embedFor(row, opts = {}){
  const auto = opts.autoplay ? '?autoplay=1' : '';
  return `https://www.youtube-nocookie.com/embed/${row.youtubeId}${auto}`;
}

/**
 * Lookup an interview by id.
 * @param {string} id
 * @returns {InterviewRow|null}
 */
export function interviewById(id){
  return INTERVIEWS.find(r => r.id === id) || null;
}
