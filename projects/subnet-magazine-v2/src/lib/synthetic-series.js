/* =================================================================
   SYNTHETIC PRICE SERIES — shared deterministic walk
   -----------------------------------------------------------------
   One canonical implementation for the seeded backwards-walk that
   synthesizes 365-day OHLCV data from a subnet's current (price,
   chg24, chg7, chg30) record. Replaces the duplicate definitions
   that previously lived in src/views/Cockpit.js and
   src/views/terminal/chart-mode.js — both files now import from
   here. The cross-language invariant (mac ↔ sandbox MA port) is
   now a SINGLE-language invariant — one source, can't drift.

   Why deterministic synthesis instead of an empty chart:
     The chart canvas needs a credible-shape time series to look
     like a real Bloomberg-style chart even before the DataLayer /
     TaoStats wiring is in place. Same seed per netuid → same
     series across renders → unit-test-stable.

   Real OHLC ships when the Python pipeline (scripts/analytics/)
   starts pulling TaoStats history and writes per-subnet series to
   src/data/series/<netuid>.json. Until then, this is the spine.

   Consumers (audit the call sites if you tune anything here):
     - src/views/Cockpit.js              (cockpit chart pane)
     - src/views/terminal/chart-mode.js  (terminal CHART mode)
     - src/views/terminal/editorial-mode.js (editorial alpha)
   ================================================================= */

/** Length of the synthesized series in days (walks backward from
 *  today). Long enough to support a 1Y range tab without re-keying
 *  the seed on each call. */
export const SERIES_DAYS = 365;

/** Generate a deterministic 365-bar OHLCV series for `subnet`.
 *  Walks backward from today's close (= subnet.price), apportioning
 *  the published 24h / 7d / 30d returns over their respective
 *  windows and applying seeded noise beyond. Same algorithm as the
 *  original Cockpit.generateSeries() — extracted unchanged.
 *
 *  Contract:
 *    subnet.netuid             keys the seeded PRNG
 *    subnet.price              current close (defaults to 1)
 *    subnet.chg24/7/30         published returns in % (defaults 0)
 *    subnet.emission           gates the synthesized volume
 *  Returns: Array of { t, open, high, low, close, volume }, length
 *  SERIES_DAYS, oldest first.
 */
export function generateSeries(subnet, days = SERIES_DAYS){
  const out  = new Array(days);
  let seed   = (subnet.netuid * 12345 + 67) >>> 0;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) >>> 0;
    return ((seed >>> 16) & 0x7FFF) / 0x7FFF;
  };

  const currentPrice = subnet.price || 1;
  const r24 = (subnet.chg24 || 0) / 100;
  const r7  = (subnet.chg7  || 0) / 100;
  const r30 = (subnet.chg30 || 0) / 100;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  out[days - 1] = {
    t:      today.getTime(),
    close:  currentPrice,
    open:   currentPrice / (1 + r24),
    high:   currentPrice * (1 + Math.abs(r24) * 0.4 + rand() * 0.01),
    low:    currentPrice * (1 - Math.abs(r24) * 0.4 - rand() * 0.01),
    volume: (subnet.emission || 100) * 24 * (subnet.price || 1) * (0.8 + rand() * 0.4),
  };

  for (let i = days - 2; i >= 0; i--){
    const dayAgo = days - 1 - i;
    let drift;
    if (dayAgo <= 1)       drift = -r24 / 1;
    else if (dayAgo <= 7)  drift = -r7  / 7;
    else if (dayAgo <= 30) drift = -r30 / 30;
    else                   drift = -0.0008 + (rand() - 0.5) * 0.001;
    const noise   = (rand() - 0.5) * 0.045;
    const tomorrow = out[i + 1];
    const close = tomorrow.close * (1 + drift + noise);
    const open  = close * (1 + (rand() - 0.5) * 0.012);
    const high  = Math.max(open, close) * (1 + rand() * 0.025);
    const low   = Math.min(open, close) * (1 - rand() * 0.025);
    const vol   = (subnet.emission || 100) * 24 * (subnet.price || 1) * (0.4 + rand() * 1.2);
    const t     = today.getTime() - (days - 1 - i) * 86400000;
    out[i] = { t, close, open, high: Math.max(low, high), low: Math.min(low, high), volume: vol };
  }
  return out;
}

/** Simple moving average — O(n) rolling window. Returns an array
 *  the same length as `values` with `null` at indices that don't
 *  have `window` preceding closes (the first window-1 entries).
 *  Caller is responsible for skipping nulls when drawing. */
export function sma(values, window){
  const out = new Array(values.length).fill(null);
  if (window <= 0 || values.length < window) return out;
  let sum = 0;
  for (let i = 0; i < window; i++) sum += values[i];
  out[window - 1] = sum / window;
  for (let i = window; i < values.length; i++){
    sum += values[i] - values[i - window];
    out[i] = sum / window;
  }
  return out;
}
