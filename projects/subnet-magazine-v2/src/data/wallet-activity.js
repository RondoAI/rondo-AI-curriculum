/* =================================================================
   SUBNET MAGAZINE, WALLET ACTIVITY SEED
   -----------------------------------------------------------------
   Top-holder tables, large-transfer flow, and per-subnet wallet
   concentration. Modeled on what taostats + Arkham + Nansen surface
   for ETH/BTC, adapted to the Bittensor τ + α token model.

   Each wallet row carries:
     - addr (truncated for display)
     - label (known team / fund / exchange tag where identified)
     - kind ('team' | 'validator' | 'whale' | 'exchange' | 'fund' | 'unknown')
     - balanceTao
     - balanceAlpha   per-subnet α balance (in a subnet context)
     - chg24Tao       24h tau delta
     - lastMoveDate
     - lastMoveDelta

   Each transfer row carries:
     - id, date, direction ('in' | 'out')
     - from, to (truncated addresses)
     - amount, token ('τ' | 'α')
     - usd (rough USD value at time of move)
     - subnetId (if subnet-scoped)
     - note (Oracle-tagged context where known)

   This is the FLOOR. Future work: wire a chain-RPC fetcher that
   pulls the top-100 holders per netuid each hour and merges live
   moves above a $10K threshold onto this seed. Until then this
   gives the dashboard's WALLET TRACKER panel a realistic shape and
   exercise all the rendering paths.

   All addresses below are illustrative format-correct fakes; nothing
   here references a real on-chain identity.
   ================================================================= */

/**
 * @typedef {Object} TopHolder
 * @prop {string}  addr           truncated for display
 * @prop {string}  label          known-team label (or "")
 * @prop {'team'|'validator'|'whale'|'exchange'|'fund'|'unknown'} kind
 * @prop {number}  balanceTao
 * @prop {number=} balanceAlpha   for subnet-scoped tables
 * @prop {number}  chg24Tao       24h delta in τ
 * @prop {string=} lastMoveDate
 * @prop {number=} lastMoveDelta
 */

/** Network-wide top holders, ranked by τ balance.
 *  @type {readonly TopHolder[]} */
export const TOP_HOLDERS_NETWORK = Object.freeze([
  { addr: '5GrwvaEF…wPyXkVj', label: 'OpenTensor Foundation Treasury', kind: 'team',     balanceTao: 412_300, chg24Tao: +2_400,  lastMoveDate: '2026-05-17', lastMoveDelta: +2_400 },
  { addr: '5FHneW46…3R8nLBC', label: 'Binance · Hot Wallet 1',         kind: 'exchange', balanceTao: 188_400, chg24Tao: -18_200, lastMoveDate: '2026-05-17', lastMoveDelta: -18_200 },
  { addr: '5DAAnrj7…J3LP5fJ', label: 'Polychain Capital',              kind: 'fund',     balanceTao: 142_800, chg24Tao: +4_600,  lastMoveDate: '2026-05-16', lastMoveDelta: +4_600 },
  { addr: '5HpG9w8E…hcK4u8M', label: 'Stillcore Capital',              kind: 'fund',     balanceTao:  98_400, chg24Tao: +1_280,  lastMoveDate: '2026-05-16', lastMoveDelta: +1_280 },
  { addr: '5DhKZeY3…aF7n4Bp', label: 'Manifold Labs (SN4 Targon ops)', kind: 'team',     balanceTao:  86_900, chg24Tao: +840,    lastMoveDate: '2026-05-15', lastMoveDelta: +840 },
  { addr: '5ECEyXz4…vKR6tHj', label: 'Coinbase Custody',               kind: 'exchange', balanceTao:  78_600, chg24Tao: -3_400,  lastMoveDate: '2026-05-17', lastMoveDelta: -3_400 },
  { addr: '5FLSigC9…2qPB1mD', label: 'Rayon Labs (SN64 Chutes ops)',   kind: 'team',     balanceTao:  72_400, chg24Tao: +1_120,  lastMoveDate: '2026-05-17', lastMoveDelta: +1_120 },
  { addr: '5C5cMpY9…tQ4nRwL', label: 'Whale · Unknown',                 kind: 'whale',    balanceTao:  64_800, chg24Tao: +12_300, lastMoveDate: '2026-05-17', lastMoveDelta: +12_300 },
  { addr: '5DPxZuB2…hLM9aXp', label: 'OKX · Cold Storage',             kind: 'exchange', balanceTao:  61_200, chg24Tao: 0,       lastMoveDate: '2026-05-11', lastMoveDelta: 0 },
  { addr: '5Hgvm8x4…rT2kFwn', label: 'TaoSquare Validator',            kind: 'validator',balanceTao:  56_900, chg24Tao: +320,    lastMoveDate: '2026-05-17', lastMoveDelta: +320 },
  { addr: '5GduC9wA…3MzVnPq', label: 'Macrocosmos (SN1, SN9, SN25)',   kind: 'team',     balanceTao:  52_400, chg24Tao: +680,    lastMoveDate: '2026-05-17', lastMoveDelta: +680 },
  { addr: '5HdLqQB6…7mPxBcs', label: 'Whale · Unknown',                 kind: 'whale',    balanceTao:  48_700, chg24Tao: -2_100,  lastMoveDate: '2026-05-17', lastMoveDelta: -2_100 },
  { addr: '5DXr2Vp1…cN8nXzT', label: 'Kraken · Hot Wallet',            kind: 'exchange', balanceTao:  44_100, chg24Tao: -1_460,  lastMoveDate: '2026-05-17', lastMoveDelta: -1_460 },
  { addr: '5Fnz4kJ8…wQ2tRmK', label: 'YumaGroup Validator',            kind: 'validator',balanceTao:  41_800, chg24Tao: +210,    lastMoveDate: '2026-05-17', lastMoveDelta: +210 },
  { addr: '5GHpwLm2…vKj6BcF', label: 'Datura Validator',               kind: 'validator',balanceTao:  39_400, chg24Tao: +180,    lastMoveDate: '2026-05-17', lastMoveDelta: +180 },
]);

/**
 * @typedef {Object} WalletTransfer
 * @prop {string}  id
 * @prop {string}  date
 * @prop {'in'|'out'|'swap'} direction
 * @prop {string}  from
 * @prop {string}  to
 * @prop {number}  amount
 * @prop {'τ'|'α'} token
 * @prop {number}  usd
 * @prop {number=} subnetId
 * @prop {string=} subnetName
 * @prop {string}  note
 */

/** Recent network-wide large transfers, $50K+ threshold.
 *  Most-recent first. @type {readonly WalletTransfer[]} */
export const RECENT_TRANSFERS_NETWORK = Object.freeze([
  { id: 't0517-001', date: '2026-05-17T14:22Z', direction: 'out', from: '5FHneW46…3R8nLBC',  to: '5C5cMpY9…tQ4nRwL', amount: 12_300, token: 'τ', usd: 3_343_000, note: 'Binance hot → unknown whale; followed by 6h of network mcap +2.4%' },
  { id: 't0517-002', date: '2026-05-17T13:08Z', direction: 'in',  from: 'Coinbase Custody', to: '5DAAnrj7…J3LP5fJ', amount: 4_600,  token: 'τ', usd: 1_250_000, note: 'Polychain deposit, the 4th τ-add this month' },
  { id: 't0517-003', date: '2026-05-17T11:45Z', direction: 'out', from: '5HdLqQB6…7mPxBcs',  to: '5FHneW46…3R8nLBC', amount: 2_100,  token: 'τ', usd:   571_000, note: 'Whale → Binance, possible take-profit' },
  { id: 't0517-004', date: '2026-05-17T10:30Z', direction: 'in',  from: 'Emissions Pool',   to: '5GrwvaEF…wPyXkVj', amount: 2_400,  token: 'τ', usd:   652_000, subnetId: 64, subnetName: 'Chutes', note: 'Daily emission credit, the SN64 lion\'s share' },
  { id: 't0516-005', date: '2026-05-16T18:14Z', direction: 'swap',from: '5DhKZeY3…aF7n4Bp', to: 'AMM · SN4 α',     amount: 4_200,  token: 'α', usd:   840_000, subnetId: 4,  subnetName: 'Targon', note: 'Manifold ops added α-side liquidity ahead of the SN4 spotlight' },
  { id: 't0516-006', date: '2026-05-16T15:42Z', direction: 'in',  from: 'OTC Desk',          to: '5HpG9w8E…hcK4u8M', amount: 1_280,  token: 'τ', usd:   348_000, note: 'Stillcore τ-add; the fund\'s 3rd τ deposit since May 1' },
  { id: 't0516-007', date: '2026-05-16T12:08Z', direction: 'out', from: '5FLSigC9…2qPB1mD', to: 'Validator Pool',   amount: 1_120,  token: 'τ', usd:   305_000, subnetId: 64, subnetName: 'Chutes', note: 'Rayon ops rotation to validator stake' },
  { id: 't0515-008', date: '2026-05-15T22:30Z', direction: 'out', from: '5C5cMpY9…tQ4nRwL', to: 'AMM · α basket', amount: 3_400,  token: 'τ', usd:   924_000, note: 'Whale rotated τ into a basket of mid-cap α tokens (SN56, SN51, SN18)' },
  { id: 't0515-009', date: '2026-05-15T16:14Z', direction: 'in',  from: 'Emissions Pool',   to: '5DAAnrj7…J3LP5fJ', amount: 840,    token: 'τ', usd:   228_000, subnetId: 4,  subnetName: 'Targon', note: 'Polychain SN4 share, validator emissions' },
  { id: 't0515-010', date: '2026-05-15T11:42Z', direction: 'swap',from: 'AMM · SN56 α',     to: '5HpG9w8E…hcK4u8M', amount: 18_600, token: 'α', usd:   406_000, subnetId: 56, subnetName: 'Gradients', note: 'Stillcore α-add on Gradients, after the 118B finetune press' },
  { id: 't0515-011', date: '2026-05-15T08:30Z', direction: 'out', from: '5GHpwLm2…vKj6BcF', to: 'Validator Pool',   amount: 180,    token: 'τ', usd:    49_000, note: 'Datura validator restake' },
  { id: 't0514-012', date: '2026-05-14T19:14Z', direction: 'in',  from: 'OTC Desk',          to: '5C5cMpY9…tQ4nRwL', amount: 12_000, token: 'τ', usd: 3_264_000, note: 'Unknown whale, large τ accumulation 24h before the Binance outflow above' },
]);

/** Per-subnet top holders. Sparse coverage; netuids that have a row
 *  here render the in-detail table, others fall back to the network
 *  view. @type {Record<number, TopHolder[]>} */
export const TOP_HOLDERS_BY_SUBNET = Object.freeze({
  4: [  /* SN4 Targon */
    { addr: '5DhKZeY3…aF7n4Bp', label: 'Manifold Labs · ops',    kind: 'team',     balanceTao: 18_400, balanceAlpha: 142_300, chg24Tao: +120,   lastMoveDate: '2026-05-17' },
    { addr: '5DAAnrj7…J3LP5fJ', label: 'Polychain Capital',      kind: 'fund',     balanceTao:  9_200, balanceAlpha:  86_700, chg24Tao:  +60,   lastMoveDate: '2026-05-15' },
    { addr: '5Hgvm8x4…rT2kFwn', label: 'TaoSquare Validator',    kind: 'validator',balanceTao:  6_800, balanceAlpha:  62_400, chg24Tao:  +40,   lastMoveDate: '2026-05-17' },
    { addr: '5C5cMpY9…tQ4nRwL', label: 'Whale · Unknown',         kind: 'whale',    balanceTao:  5_400, balanceAlpha:  48_900, chg24Tao: +210,   lastMoveDate: '2026-05-17' },
    { addr: '5Fnz4kJ8…wQ2tRmK', label: 'YumaGroup Validator',    kind: 'validator',balanceTao:  4_900, balanceAlpha:  41_600, chg24Tao:  +30,   lastMoveDate: '2026-05-17' },
    { addr: '5GHpwLm2…vKj6BcF', label: 'Datura Validator',       kind: 'validator',balanceTao:  4_200, balanceAlpha:  38_200, chg24Tao:  +20,   lastMoveDate: '2026-05-17' },
    { addr: '5HpG9w8E…hcK4u8M', label: 'Stillcore Capital',      kind: 'fund',     balanceTao:  3_800, balanceAlpha:  32_400, chg24Tao:  +90,   lastMoveDate: '2026-05-14' },
    { addr: '5GrwvaEF…wPyXkVj', label: 'Foundation · operational',kind:'team',     balanceTao:  3_100, balanceAlpha:  28_600, chg24Tao:    0,   lastMoveDate: '2026-05-11' },
  ],
  64: [ /* SN64 Chutes */
    { addr: '5FLSigC9…2qPB1mD', label: 'Rayon Labs · ops',       kind: 'team',     balanceTao: 22_800, balanceAlpha: 218_400, chg24Tao: +180,   lastMoveDate: '2026-05-17' },
    { addr: '5DAAnrj7…J3LP5fJ', label: 'Polychain Capital',      kind: 'fund',     balanceTao: 12_400, balanceAlpha: 108_200, chg24Tao:  +90,   lastMoveDate: '2026-05-16' },
    { addr: '5C5cMpY9…tQ4nRwL', label: 'Whale · Unknown',         kind: 'whale',    balanceTao:  8_600, balanceAlpha:  78_400, chg24Tao: +420,   lastMoveDate: '2026-05-17' },
    { addr: '5Hgvm8x4…rT2kFwn', label: 'TaoSquare Validator',    kind: 'validator',balanceTao:  7_200, balanceAlpha:  64_300, chg24Tao:  +50,   lastMoveDate: '2026-05-17' },
    { addr: '5HpG9w8E…hcK4u8M', label: 'Stillcore Capital',      kind: 'fund',     balanceTao:  5_400, balanceAlpha:  48_600, chg24Tao: +120,   lastMoveDate: '2026-05-15' },
    { addr: '5Fnz4kJ8…wQ2tRmK', label: 'YumaGroup Validator',    kind: 'validator',balanceTao:  4_800, balanceAlpha:  42_100, chg24Tao:  +40,   lastMoveDate: '2026-05-17' },
  ],
  75: [ /* SN75 Hippius */
    { addr: '5HnVdEr8…cN3kPwT', label: 'Hippius · ops',          kind: 'team',     balanceTao: 11_400, balanceAlpha:  96_200, chg24Tao:  +60,   lastMoveDate: '2026-05-17' },
    { addr: '5HpG9w8E…hcK4u8M', label: 'Stillcore Capital',      kind: 'fund',     balanceTao:  6_800, balanceAlpha:  58_400, chg24Tao: +180,   lastMoveDate: '2026-05-16' },
    { addr: '5C5cMpY9…tQ4nRwL', label: 'Whale · Unknown',         kind: 'whale',    balanceTao:  5_200, balanceAlpha:  46_300, chg24Tao: +280,   lastMoveDate: '2026-05-17' },
    { addr: '5DAAnrj7…J3LP5fJ', label: 'Polychain Capital',      kind: 'fund',     balanceTao:  4_900, balanceAlpha:  41_800, chg24Tao:  +40,   lastMoveDate: '2026-05-14' },
    { addr: '5Hgvm8x4…rT2kFwn', label: 'TaoSquare Validator',    kind: 'validator',balanceTao:  3_400, balanceAlpha:  29_800, chg24Tao:  +20,   lastMoveDate: '2026-05-17' },
  ],
});

/** Get the per-subnet holders if seeded, else the network rollup. */
export function topHoldersFor(netuid){
  return TOP_HOLDERS_BY_SUBNET[netuid] || TOP_HOLDERS_NETWORK.slice(0, 8);
}

/** Recent transfers, optionally filtered by netuid. */
export function recentTransfersFor(netuid, limit = 8){
  const out = (typeof netuid === 'number')
    ? RECENT_TRANSFERS_NETWORK.filter(t => t.subnetId === netuid)
    : RECENT_TRANSFERS_NETWORK;
  return out.slice(0, limit);
}
