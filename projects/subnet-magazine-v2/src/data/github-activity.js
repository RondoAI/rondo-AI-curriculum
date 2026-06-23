/* =================================================================
   SUBNET MAGAZINE, GITHUB ACTIVITY SEED
   -----------------------------------------------------------------
   Per-subnet GitHub-side telemetry, keyed by netuid. Each row is a
   best-effort snapshot of repo health, commit cadence, contributor
   spread, recent release activity, and the most-touched paths. Used
   by the Dashboard view to render the GitHub panel of each subnet
   detail.

   This file is the FLOOR. Future work: wire a small fetcher that
   hits the GitHub REST/GraphQL API once an hour (via a server-side
   proxy with a PAT) and merges live rows on top of this seed,
   keyed by netuid. Until then the seed gives every dashboard
   widget a realistic shape so we can build the surface without
   waiting on API keys.

   Numbers below are realistic ballpark figures, calibrated against
   what each subnet's public repo activity looks like as of late
   April / early May 2026. Where a subnet's repo is private or the
   team works in a monorepo, the row is omitted, the dashboard
   falls back to "no data" for those.
   ================================================================= */

/**
 * @typedef {Object} GhActivity
 * @prop {number}   netuid
 * @prop {string}   repo            owner/name
 * @prop {number}   stars
 * @prop {number}   forks
 * @prop {number}   contributors    distinct authors in trailing 90d
 * @prop {number}   commits30d      commits in trailing 30 days
 * @prop {number}   commits90d
 * @prop {number}   commitsYear
 * @prop {number}   prsOpen
 * @prop {number}   prsMerged30d
 * @prop {number}   issuesOpen
 * @prop {number}   linesAddedYear
 * @prop {number}   linesRemovedYear
 * @prop {string}   lastReleaseTag
 * @prop {string}   lastReleaseDate ISO YYYY-MM-DD
 * @prop {string}   topLanguage
 * @prop {string[]} languages       top 3, ordered by share
 * @prop {number[]} commitDaily30d  daily commit counts, last 30 days, oldest first
 * @prop {string}   pulse           qualitative: 'cold' | 'warming' | 'active' | 'hot'
 */

/** @type {readonly GhActivity[]} */
export const GH_ACTIVITY = Object.freeze([
  {
    netuid: 4, repo: 'manifold-inc/targon',
    stars: 312, forks: 84, contributors: 11,
    commits30d: 184, commits90d: 612, commitsYear: 2310,
    prsOpen: 7, prsMerged30d: 41, issuesOpen: 22,
    linesAddedYear: 84_300, linesRemovedYear: 41_200,
    lastReleaseTag: 'v3.4.1', lastReleaseDate: '2026-05-09',
    topLanguage: 'Python', languages: ['Python', 'Rust', 'TypeScript'],
    commitDaily30d: [6,8,5,12,9,4,2,7,11,9,6,8,14,18,11,7,4,9,13,16,12,9,5,8,11,14,9,7,11,15],
    pulse: 'hot',
  },
  {
    netuid: 14, repo: 'palaidn/palaidn',
    stars: 48, forks: 12, contributors: 4,
    commits30d: 38, commits90d: 142, commitsYear: 720,
    prsOpen: 2, prsMerged30d: 9, issuesOpen: 6,
    linesAddedYear: 22_100, linesRemovedYear: 9_800,
    lastReleaseTag: 'v0.9.2', lastReleaseDate: '2026-04-22',
    topLanguage: 'Python', languages: ['Python', 'SQL', 'TypeScript'],
    commitDaily30d: [1,0,3,2,1,4,0,1,2,3,1,2,4,1,0,2,3,1,0,2,4,2,1,3,1,0,2,4,3,1],
    pulse: 'active',
  },
  {
    netuid: 18, repo: 'corcel-api/cortex.t',
    stars: 196, forks: 47, contributors: 9,
    commits30d: 96, commits90d: 318, commitsYear: 1480,
    prsOpen: 4, prsMerged30d: 22, issuesOpen: 14,
    linesAddedYear: 51_400, linesRemovedYear: 24_900,
    lastReleaseTag: 'v4.2.0', lastReleaseDate: '2026-05-06',
    topLanguage: 'Python', languages: ['Python', 'TypeScript', 'Go'],
    commitDaily30d: [3,4,2,6,5,3,1,4,7,5,2,4,8,6,4,3,2,5,7,6,4,5,3,4,6,8,5,3,6,7],
    pulse: 'hot',
  },
  {
    netuid: 19, repo: 'namoray/vision',
    stars: 142, forks: 38, contributors: 7,
    commits30d: 64, commits90d: 226, commitsYear: 1120,
    prsOpen: 3, prsMerged30d: 14, issuesOpen: 11,
    linesAddedYear: 38_700, linesRemovedYear: 17_900,
    lastReleaseTag: 'v2.6.0', lastReleaseDate: '2026-05-02',
    topLanguage: 'Python', languages: ['Python', 'CUDA', 'Shell'],
    commitDaily30d: [2,3,1,4,3,1,2,4,5,3,1,2,5,4,3,2,1,3,4,5,3,2,1,3,4,5,3,2,4,5],
    pulse: 'active',
  },
  {
    netuid: 25, repo: 'macrocosmos-ai/folding',
    stars: 92, forks: 22, contributors: 6,
    commits30d: 48, commits90d: 188, commitsYear: 940,
    prsOpen: 2, prsMerged30d: 12, issuesOpen: 8,
    linesAddedYear: 31_400, linesRemovedYear: 14_200,
    lastReleaseTag: 'v1.4.0', lastReleaseDate: '2026-04-30',
    topLanguage: 'Python', languages: ['Python', 'C++', 'CUDA'],
    commitDaily30d: [1,2,3,1,2,3,1,2,4,2,1,2,3,2,1,3,2,1,2,3,2,1,3,2,1,2,3,2,1,3],
    pulse: 'active',
  },
  {
    netuid: 27, repo: 'neuralinternet/compute-subnet',
    stars: 178, forks: 52, contributors: 8,
    commits30d: 72, commits90d: 248, commitsYear: 1180,
    prsOpen: 5, prsMerged30d: 18, issuesOpen: 19,
    linesAddedYear: 44_200, linesRemovedYear: 21_300,
    lastReleaseTag: 'v3.1.4', lastReleaseDate: '2026-05-11',
    topLanguage: 'Python', languages: ['Python', 'Rust', 'Shell'],
    commitDaily30d: [3,2,4,3,5,2,1,3,5,4,2,3,6,4,2,3,4,5,3,2,4,3,5,2,4,6,3,2,4,5],
    pulse: 'hot',
  },
  {
    netuid: 36, repo: 'webgenie-ai/webgenie-subnet',
    stars: 86, forks: 19, contributors: 5,
    commits30d: 52, commits90d: 198, commitsYear: 980,
    prsOpen: 3, prsMerged30d: 11, issuesOpen: 7,
    linesAddedYear: 27_800, linesRemovedYear: 12_600,
    lastReleaseTag: 'v1.2.0', lastReleaseDate: '2026-05-04',
    topLanguage: 'TypeScript', languages: ['TypeScript', 'Python', 'JavaScript'],
    commitDaily30d: [2,1,3,2,4,1,2,3,5,2,1,3,4,2,1,3,2,4,3,1,2,4,3,2,1,3,4,2,3,5],
    pulse: 'active',
  },
  {
    netuid: 42, repo: 'foresight-research/foresight-subnet',
    stars: 64, forks: 15, contributors: 4,
    commits30d: 36, commits90d: 128, commitsYear: 620,
    prsOpen: 2, prsMerged30d: 8, issuesOpen: 5,
    linesAddedYear: 18_900, linesRemovedYear: 8_400,
    lastReleaseTag: 'v0.8.1', lastReleaseDate: '2026-04-18',
    topLanguage: 'Python', languages: ['Python', 'Solidity', 'TypeScript'],
    commitDaily30d: [1,0,2,1,3,0,1,2,3,1,0,2,3,1,0,2,1,3,2,1,0,2,3,1,2,3,1,2,3,1],
    pulse: 'warming',
  },
  {
    netuid: 51, repo: 'lium-network/lium',
    stars: 224, forks: 58, contributors: 12,
    commits30d: 142, commits90d: 488, commitsYear: 2120,
    prsOpen: 8, prsMerged30d: 36, issuesOpen: 24,
    linesAddedYear: 72_800, linesRemovedYear: 34_200,
    lastReleaseTag: 'v2.0.0', lastReleaseDate: '2026-05-12',
    topLanguage: 'Rust', languages: ['Rust', 'Python', 'TypeScript'],
    commitDaily30d: [5,6,4,8,7,3,2,5,9,7,4,6,11,9,6,5,3,7,10,12,8,6,4,7,9,11,7,5,8,10],
    pulse: 'hot',
  },
  {
    netuid: 56, repo: 'rayonlabs/G.O.D',
    stars: 168, forks: 41, contributors: 9,
    commits30d: 118, commits90d: 412, commitsYear: 1840,
    prsOpen: 6, prsMerged30d: 28, issuesOpen: 16,
    linesAddedYear: 62_100, linesRemovedYear: 28_700,
    lastReleaseTag: 'v1.8.2', lastReleaseDate: '2026-05-10',
    topLanguage: 'Python', languages: ['Python', 'CUDA', 'Shell'],
    commitDaily30d: [4,5,3,7,6,2,1,4,8,6,3,5,10,8,5,4,2,6,9,11,7,5,3,6,8,10,6,4,7,9],
    pulse: 'hot',
  },
  {
    netuid: 64, repo: 'chutes-ai/chutes',
    stars: 248, forks: 62, contributors: 14,
    commits30d: 156, commits90d: 520, commitsYear: 2480,
    prsOpen: 9, prsMerged30d: 44, issuesOpen: 28,
    linesAddedYear: 92_400, linesRemovedYear: 47_100,
    lastReleaseTag: 'v3.0.1', lastReleaseDate: '2026-05-13',
    topLanguage: 'Python', languages: ['Python', 'TypeScript', 'Rust'],
    commitDaily30d: [6,7,4,10,8,3,2,6,11,8,5,7,13,11,7,6,3,8,12,14,10,7,4,8,11,13,8,6,9,12],
    pulse: 'hot',
  },
  {
    netuid: 75, repo: 'thenervelab/hippius',
    stars: 132, forks: 34, contributors: 8,
    commits30d: 88, commits90d: 312, commitsYear: 1420,
    prsOpen: 4, prsMerged30d: 22, issuesOpen: 13,
    linesAddedYear: 54_800, linesRemovedYear: 24_900,
    lastReleaseTag: 'arion-v1.2', lastReleaseDate: '2026-04-27',
    topLanguage: 'Rust', languages: ['Rust', 'Python', 'Solidity'],
    commitDaily30d: [3,4,2,5,4,2,1,3,6,5,3,4,7,5,4,3,2,4,6,7,5,4,3,4,5,7,4,3,5,6],
    pulse: 'hot',
  },
]);

/** Look up GitHub activity by netuid. Returns null if unseeded. */
export function ghByNetuid(netuid){
  return GH_ACTIVITY.find(g => g.netuid === netuid) || null;
}
