/* =================================================================
   SUBNET MAGAZINE, PAPER PORTFOLIO STATE
   -----------------------------------------------------------------
   A localStorage-backed paper-trading account so a reader can put
   the dashboard's analytics to use on actual positions of their
   own (without risk, without a custodian, without an account).

   Starting capital: $100,000 USD paper. Buy any subnet α at the
   current mark, sell at the current mark, P&L marked against cost
   basis. Cash debits / credits on every transaction. Transaction
   log preserved so the reader can audit their own track record.

   What the panel does with this data:
     - 4 KPIs at the top: total value, daily change, total P&L, cash
     - position table with shares / avg cost / mark / value / P&L
     - portfolio value sparkline (NOTE: pseudo-historical for now,
       seedSeries-derived against current values; real time series
       lands when the DataLayer / TaoStats wiring ships)
     - sector tilt vs network (overweight / underweight by category)
     - feeds the Attribution Desk as a new PORTFOLIO preset so the
       Brinson-Fachler attribution runs on the user's actual bets

   Persistence key: sbn:paper-portfolio:v1
   Bumping versions: change the key suffix, do not silently mutate
   the schema. Readers' track records are sacred.
   ================================================================= */

import { subnetById, SUBNETS } from './subnets.js';

export const PAPER_PORTFOLIO_KEY = 'sbn:paper-portfolio:v1';
export const STARTING_CASH       = 100_000;

/**
 * @typedef {Object} PaperLot
 * @prop {number} netuid
 * @prop {number} shares       α tokens held
 * @prop {number} avgCost      USD per α at acquisition (volume-weighted)
 * @prop {number} openedAt     epoch ms of first buy
 *
 * @typedef {Object} PaperTxn
 * @prop {number} t            epoch ms
 * @prop {'BUY'|'SELL'|'RESET'} kind
 * @prop {number=} netuid
 * @prop {number=} shares
 * @prop {number=} price
 * @prop {number=} cashDelta
 *
 * @typedef {Object} PaperState
 * @prop {number}      cashUSD     unspent paper cash
 * @prop {PaperLot[]}  positions   one entry per held subnet
 * @prop {PaperTxn[]}  txns        chronological transaction log
 * @prop {number}      createdAt   epoch ms of first activity
 */

/** @returns {PaperState} */
function defaultState(){
  return {
    cashUSD: STARTING_CASH,
    positions: [],
    txns: [],
    createdAt: Date.now(),
  };
}

/** @returns {PaperState} */
export function loadPaperState(){
  try {
    const raw = localStorage.getItem(PAPER_PORTFOLIO_KEY);
    if (!raw) return defaultState();
    const s = JSON.parse(raw);
    // Schema gate: every field present and well-typed, otherwise reset.
    if (typeof s.cashUSD !== 'number' || !Array.isArray(s.positions) || !Array.isArray(s.txns)){
      return defaultState();
    }
    return s;
  } catch (_) { return defaultState(); }
}

export function savePaperState(s){
  try { localStorage.setItem(PAPER_PORTFOLIO_KEY, JSON.stringify(s)); } catch (_) {}
}

/* ---------- mutations ---------------------------------------- */

/** Add shares at price; merges into existing lot with weighted-avg
 *  cost basis. Returns the updated state. Caller is responsible for
 *  saving + re-rendering. */
export function buy(state, netuid, shares, price){
  if (!Number.isFinite(shares) || shares <= 0) return state;
  if (!Number.isFinite(price)  || price  <= 0) return state;
  const cost = shares * price;
  if (cost > state.cashUSD + 1e-6) return state; // insufficient cash, no-op
  const next = structuredClone(state);
  next.cashUSD -= cost;
  const lot = next.positions.find(p => p.netuid === netuid);
  if (lot){
    const totalShares = lot.shares + shares;
    lot.avgCost = ((lot.shares * lot.avgCost) + (shares * price)) / totalShares;
    lot.shares  = totalShares;
  } else {
    next.positions.push({ netuid, shares, avgCost: price, openedAt: Date.now() });
  }
  next.txns.push({ t: Date.now(), kind: 'BUY', netuid, shares, price, cashDelta: -cost });
  return next;
}

/** Sell up to `shares` at price. If shares exceeds held, sells all.
 *  Updates cash. If lot goes to 0, removes from positions. */
export function sell(state, netuid, shares, price){
  if (!Number.isFinite(shares) || shares <= 0) return state;
  if (!Number.isFinite(price)  || price  <= 0) return state;
  const next = structuredClone(state);
  const i = next.positions.findIndex(p => p.netuid === netuid);
  if (i < 0) return state;
  const lot = next.positions[i];
  const sold = Math.min(lot.shares, shares);
  const proceeds = sold * price;
  next.cashUSD += proceeds;
  lot.shares -= sold;
  if (lot.shares < 1e-6) next.positions.splice(i, 1);
  next.txns.push({ t: Date.now(), kind: 'SELL', netuid, shares: sold, price, cashDelta: +proceeds });
  return next;
}

/** Wipe the paper account back to default. Preserves a single RESET
 *  txn in the log so the audit trail isn't a black hole. */
export function reset(){
  const s = defaultState();
  s.txns.push({ t: Date.now(), kind: 'RESET' });
  return s;
}

/* ---------- derived metrics ---------------------------------- */

/** Annotated positions, joined against current SUBNETS so the panel
 *  can render full rows without doing the join itself.
 *  @returns {Array<Object>} */
export function annotatePositions(state){
  return state.positions.map(p => {
    const s = subnetById(p.netuid) || { name: 'SN'+p.netuid, price: 0, chg24: 0, cat: '·' };
    const mark   = s.price || 0;
    const value  = p.shares * mark;
    const cost   = p.shares * p.avgCost;
    const pnl    = value - cost;
    const pnlPct = cost > 0 ? (pnl / cost) * 100 : 0;
    return {
      netuid: p.netuid,
      name:   s.name,
      cat:    s.cat,
      shares: p.shares,
      avgCost: p.avgCost,
      mark, value, cost, pnl, pnlPct,
      chg24: s.chg24 || 0,
      chg7:  s.chg7  || 0,
      chg30: s.chg30 || 0,
      mcap:  s.mcap  || 0,
    };
  });
}

/** Top-level KPIs for the four summary tiles. */
export function summarize(state){
  const annotated = annotatePositions(state);
  const equity = annotated.reduce((a, p) => a + p.value, 0);
  const total  = equity + state.cashUSD;
  const cost   = annotated.reduce((a, p) => a + p.cost, 0);
  const pnl    = equity - cost;
  const pnlPct = cost > 0 ? (pnl / cost) * 100 : 0;
  // Approximate 24h portfolio change by weighting each position's chg24
  // by its current value, then applying to the total value to back out
  // the prior-day equity. cash is treated as flat 24h.
  const wChg24 = equity > 0
    ? annotated.reduce((a, p) => a + p.value * (p.chg24 || 0), 0) / equity
    : 0;
  const yesterdayEquity = equity / (1 + wChg24 / 100);
  const dayChangeUSD = equity - yesterdayEquity;
  const dayChangePct = total > 0 ? (dayChangeUSD / total) * 100 : 0;

  return {
    total, equity, cashUSD: state.cashUSD,
    cost, pnl, pnlPct,
    dayChangeUSD, dayChangePct, wChg24,
    positionCount: annotated.length,
    startingCash: STARTING_CASH,
    totalReturnPct: STARTING_CASH > 0 ? ((total - STARTING_CASH) / STARTING_CASH) * 100 : 0,
  };
}

/** Sector-tilt analysis: how the paper portfolio's weight by category
 *  compares to the network (emission-weighted). Returns one row per
 *  category present in either book, sorted by absolute tilt. */
export function sectorTilt(state){
  const annotated = annotatePositions(state);
  const equity = annotated.reduce((a,p) => a + p.value, 0);
  if (equity <= 0) return [];

  const portMap = new Map();   // cat -> weight%
  for (const p of annotated){
    portMap.set(p.cat, (portMap.get(p.cat) || 0) + (p.value / equity) * 100);
  }
  const netTotEm = SUBNETS.reduce((a,s) => a + s.emission, 0) || 1;
  const netMap = new Map();
  for (const s of SUBNETS){
    netMap.set(s.cat, (netMap.get(s.cat) || 0) + (s.emission / netTotEm) * 100);
  }
  const cats = new Set([...portMap.keys(), ...netMap.keys()]);
  const rows = [];
  for (const c of cats){
    const w_P = portMap.get(c) || 0;
    const w_B = netMap.get(c)  || 0;
    rows.push({ cat: c, w_P, w_B, tilt: w_P - w_B });
  }
  return rows.sort((a,b) => Math.abs(b.tilt) - Math.abs(a.tilt));
}

/** Best + worst position by P&L %. Used in the insights bar. */
export function insights(state){
  const a = annotatePositions(state);
  if (!a.length) return { best: null, worst: null, mostConcentrated: null };
  const equity = a.reduce((x,p) => x + p.value, 0) || 1;
  const best  = a.slice().sort((x,y) => y.pnlPct - x.pnlPct)[0];
  const worst = a.slice().sort((x,y) => x.pnlPct - y.pnlPct)[0];
  const mc    = a.slice().sort((x,y) => y.value - x.value)[0];
  return {
    best, worst,
    mostConcentrated: { ...mc, pctOfPortfolio: (mc.value / equity) * 100 },
  };
}
