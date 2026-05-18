/* =================================================================
   SUBNET MAGAZINE — MULTI-PORTFOLIO LAYER (2026-05-18)
   -----------------------------------------------------------------
   Wraps the existing single-portfolio paper-portfolio.js with a
   multi-portfolio model. The reader can:
     - keep the original default portfolio (untouched)
     - create N additional portfolios, each with its own starting
       cash + positions + txns
     - switch the active portfolio
     - delete portfolios

   Storage strategy: backward-compatible LAYER on top, not a
   schema rewrite. Two new localStorage keys:
     sbn:paper-portfolios:v1 → Map<id, PaperState>  serialized
     sbn:paper-active:v1     → active portfolio id (string)

   The original sbn:paper-portfolio:v1 stays mapped to id='default'
   so existing readers' track records survive without migration.
   New portfolios live entirely in the new map.

   The paper-portfolio.js render/wire layer still uses
   loadPaperState() / savePaperState() — we hook those at the
   call site to read/write the ACTIVE portfolio's state.
   ================================================================= */

import {
  PAPER_PORTFOLIO_KEY,
  STARTING_CASH,
  loadPaperState,
  savePaperState,
} from '../data/paper-portfolio.js';

const PORTFOLIOS_KEY  = 'sbn:paper-portfolios:v1';
const ACTIVE_KEY      = 'sbn:paper-active:v1';
export const DEFAULT_PORTFOLIO_ID = 'default';

/** @typedef {{
 *   id: string,
 *   name: string,
 *   startingCash: number,
 *   cashUSD: number,
 *   positions: Array,
 *   txns: Array,
 *   createdAt: number
 * }} Portfolio
 */

/* Read the multi-portfolio map. The 'default' entry mirrors the
   classic single-portfolio state read from PAPER_PORTFOLIO_KEY,
   so existing readers see their original portfolio in the list
   without any migration step.  */
export function loadAllPortfolios(){
  let extras = {};
  try {
    const raw = localStorage.getItem(PORTFOLIOS_KEY);
    if (raw){
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') extras = parsed;
    }
  } catch (_) {}

  /* Default portfolio = original single-state, wrapped */
  const def = loadPaperState();
  const portfolios = {
    [DEFAULT_PORTFOLIO_ID]: {
      id: DEFAULT_PORTFOLIO_ID,
      name: 'Default · $100K',
      startingCash: STARTING_CASH,
      cashUSD: def.cashUSD,
      positions: def.positions || [],
      txns: def.txns || [],
      createdAt: def.createdAt || Date.now(),
    },
    ...extras,
  };
  return portfolios;
}

/** Save the EXTRAS map (not the default — the default lives at
 *  PAPER_PORTFOLIO_KEY and is updated via savePaperState).  */
function saveExtras(extras){
  try { localStorage.setItem(PORTFOLIOS_KEY, JSON.stringify(extras)); } catch (_) {}
}

export function loadActiveId(){
  try {
    const id = localStorage.getItem(ACTIVE_KEY);
    return id || DEFAULT_PORTFOLIO_ID;
  } catch (_) { return DEFAULT_PORTFOLIO_ID; }
}

export function saveActiveId(id){
  try { localStorage.setItem(ACTIVE_KEY, id || DEFAULT_PORTFOLIO_ID); } catch (_) {}
}

/** Get the currently-active portfolio's state (in the shape
 *  paper-portfolio.js operations expect). */
export function loadActivePortfolio(){
  const id = loadActiveId();
  const all = loadAllPortfolios();
  const p = all[id] || all[DEFAULT_PORTFOLIO_ID];
  return p;
}

/** Persist the active portfolio's state. Default routes to the
 *  original PAPER_PORTFOLIO_KEY (backwards compat); extras update
 *  the new map entry. */
export function saveActivePortfolio(state){
  const id = loadActiveId();
  if (id === DEFAULT_PORTFOLIO_ID){
    /* The savePaperState only persists cashUSD + positions + txns;
       it doesn't know about portfolio metadata. That's fine for
       default — name + startingCash are constants there. */
    savePaperState({
      cashUSD: state.cashUSD,
      positions: state.positions,
      txns: state.txns,
      createdAt: state.createdAt,
    });
  } else {
    const extras = readExtrasRaw();
    extras[id] = { ...state, id };
    saveExtras(extras);
  }
}

function readExtrasRaw(){
  try {
    const raw = localStorage.getItem(PORTFOLIOS_KEY);
    return raw ? (JSON.parse(raw) || {}) : {};
  } catch (_) { return {}; }
}

/** Create a new portfolio with the given name + starting cash.
 *  Returns the new portfolio object. */
export function createPortfolio(name, startingCash){
  const cash = Number(startingCash);
  if (!Number.isFinite(cash) || cash <= 0){
    throw new Error('starting cash must be a positive number');
  }
  const cleanName = String(name || '').trim() || ('Portfolio · ' + new Date().toISOString().slice(0, 10));
  const id = 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const p = {
    id,
    name: cleanName,
    startingCash: cash,
    cashUSD: cash,
    positions: [],
    txns: [{ t: Date.now(), kind: 'RESET', cashDelta: cash }],
    createdAt: Date.now(),
  };
  const extras = readExtrasRaw();
  extras[id] = p;
  saveExtras(extras);
  saveActiveId(id);     // newly-created portfolio becomes active
  return p;
}

/** Delete a portfolio. The default can't be deleted (it's the
 *  reader's original track record). If the active portfolio is
 *  deleted, falls back to default. */
export function deletePortfolio(id){
  if (id === DEFAULT_PORTFOLIO_ID) return false;
  const extras = readExtrasRaw();
  if (!extras[id]) return false;
  delete extras[id];
  saveExtras(extras);
  if (loadActiveId() === id) saveActiveId(DEFAULT_PORTFOLIO_ID);
  return true;
}

/** List of all portfolios as an array sorted by createdAt asc
 *  (default always first). */
export function listPortfolios(){
  const all = loadAllPortfolios();
  const arr = Object.values(all);
  arr.sort((a, b) => {
    if (a.id === DEFAULT_PORTFOLIO_ID) return -1;
    if (b.id === DEFAULT_PORTFOLIO_ID) return 1;
    return (a.createdAt || 0) - (b.createdAt || 0);
  });
  return arr;
}
