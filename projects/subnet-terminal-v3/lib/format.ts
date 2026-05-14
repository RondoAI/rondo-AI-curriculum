/* =================================================================
   SUBNEτ TERMINAL — formatters
   Single source of truth for number / price / percent / date
   rendering. Precision rules per the spec: TAO 4dp, alphas 6dp,
   USD 2dp, MW integer, $/MWh 2dp.
   ================================================================= */

const NF = (min: number, max: number) =>
  new Intl.NumberFormat("en-US", { minimumFractionDigits: min, maximumFractionDigits: max });

export const usd = (n: number) => "$" + NF(2, 2).format(n);
export const tao = (n: number) => "τ" + NF(4, 4).format(n);
export const alpha = (n: number) => NF(6, 6).format(n);
export const mw = (n: number) => NF(0, 0).format(Math.round(n)) + " MW";
export const mwh = (n: number) => "$" + NF(2, 2).format(n) + "/MWh";
export const int = (n: number) => NF(0, 0).format(Math.round(n));

/** signed percent, always shows sign */
export const pct = (n: number) => (n >= 0 ? "+" : "") + NF(2, 2).format(n) + "%";

/** compact: 1.2K · 6.24M · 1.04B · 3.3T */
export function compact(n: number): string {
  const a = Math.abs(n);
  if (a >= 1e12) return (n / 1e12).toFixed(2) + "T";
  if (a >= 1e9) return (n / 1e9).toFixed(2) + "B";
  if (a >= 1e6) return (n / 1e6).toFixed(2) + "M";
  if (a >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return NF(0, 0).format(Math.round(n));
}
export const usdCompact = (n: number) => "$" + compact(n);

/** up / down / flat semantic class for a delta */
export const deltaClass = (n: number) =>
  n > 0 ? "text-up" : n < 0 ? "text-down" : "text-ink-3";

/** HH:MM:SS in a given timezone (UTC by default) */
export function clock(d = new Date(), utc = true): string {
  const z = (x: number) => String(x).padStart(2, "0");
  return utc
    ? `${z(d.getUTCHours())}:${z(d.getUTCMinutes())}:${z(d.getUTCSeconds())}`
    : `${z(d.getHours())}:${z(d.getMinutes())}:${z(d.getSeconds())}`;
}
