/* =================================================================
   SUBNET MAGAZINE — FORMATTERS
   -----------------------------------------------------------------
   Pure functions for turning numbers and dates into terminal-grade
   strings. Single source of truth so every panel formats data the
   same way. All locale-aware via Intl.* APIs.
   ================================================================= */

const NF_INT   = new Intl.NumberFormat('en-US');
const NF_USD   = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const NF_PCT2  = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const NF_FX4   = new Intl.NumberFormat('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 });

/** Comma-grouped integer.  @param {number} n */
export const int   = n => NF_INT.format(Math.round(n));

/** Dollar value to 2dp, no symbol prefix added by Intl. @param {number} n */
export const money = n => '$' + NF_USD.format(n);

/** TAO formatted with the τ glyph. @param {number} n */
export const tao   = n => 'τ ' + NF_INT.format(Math.round(n));

/** 2-dp percent change with explicit sign. @param {number} n */
export const pct   = n => (n >= 0 ? '+' : '') + NF_PCT2.format(n) + '%';

/** 4-dp fixed for small fractional prices. @param {number} n */
export const fx4   = n => NF_FX4.format(n);

/**
 * Compact human-readable representation: 1.2K, 6.24M, 1.04B.
 * @param {number} n
 */
export function compact(n){
  if (n == null || isNaN(n)) return '—';
  const abs = Math.abs(n);
  if (abs >= 1e12) return (n / 1e12).toFixed(2) + 'T';
  if (abs >= 1e9)  return (n / 1e9 ).toFixed(2) + 'B';
  if (abs >= 1e6)  return (n / 1e6 ).toFixed(2) + 'M';
  if (abs >= 1e3)  return (n / 1e3 ).toFixed(1) + 'K';
  return Math.round(n).toString();
}

/** HH:MM:SS in UTC. @param {Date} [d] */
export function clock(d = new Date()){
  const z = x => String(x).padStart(2, '0');
  return `${z(d.getUTCHours())}:${z(d.getUTCMinutes())}:${z(d.getUTCSeconds())}`;
}

/** Bloomberg-style date: WED 14 MAY 2026. @param {Date} [d] */
export function bbgDate(d = new Date()){
  const w = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  const day = String(d.getDate()).padStart(2, '0');
  const m = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  return `${w} ${day} ${m} ${d.getFullYear()}`;
}

/** Short HH:MM time. @param {Date|number} d */
export function hhmm(d){
  const date = d instanceof Date ? d : new Date(d);
  const z = x => String(x).padStart(2, '0');
  return `${z(date.getUTCHours())}:${z(date.getUTCMinutes())}`;
}

/**
 * CSS class for an up/down delta.
 * @param {number} n
 * @returns {'up'|'down'|'flat'}
 */
export function deltaClass(n){
  if (n > 0) return 'up';
  if (n < 0) return 'down';
  return 'flat';
}

/** Δ-arrow glyph by sign. @param {number} n */
export const deltaArrow = n => n > 0 ? '▲' : n < 0 ? '▼' : '–';
