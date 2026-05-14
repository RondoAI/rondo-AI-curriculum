/** Inline SVG sparkline — tiny trend line for leaderboard cells.
    Pure + deterministic; renders on the server too. */
export function Sparkline({
  data,
  width = 60,
  height = 18,
  up,
}: {
  data: number[];
  width?: number;
  height?: number;
  up?: boolean;
}) {
  if (data.length < 2) return <svg width={width} height={height} aria-hidden="true" />;
  let lo = Infinity, hi = -Infinity;
  for (const v of data) {
    if (v < lo) lo = v;
    if (v > hi) hi = v;
  }
  const span = hi - lo || 1;
  const dir = up ?? data[data.length - 1] >= data[0];
  const color = dir ? "#00E5A8" : "#FF4D6D";
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (width - 2) + 1;
    const y = height - 1 - ((v - lo) / span) * (height - 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return (
    <svg width={width} height={height} className="block" aria-hidden="true">
      <polyline
        points={`1,${height} ${pts.join(" ")} ${width - 1},${height}`}
        fill={color}
        fillOpacity={0.12}
        stroke="none"
      />
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth={1.25}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Deterministic pseudo-series keyed to a string + a drift target.
    Stable across reloads — for sparklines where we have a 24h % but
    not real intraday history yet. */
export function seedSeries(key: string, drift: number, n = 20): number[] {
  let s = 0;
  for (let i = 0; i < key.length; i++) s = (s * 31 + key.charCodeAt(i)) >>> 0;
  const rng = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 0xffffffff);
  const out: number[] = [];
  let v = 100;
  for (let i = 0; i < n; i++) {
    v = Math.max(1, v + (rng() - 0.5) * 6 + (drift / n) * 1.4);
    out.push(v);
  }
  const first = out[0];
  const target = first * (1 + drift / 100);
  const last = out[n - 1];
  if (last !== first) {
    const k = (target - first) / (last - first);
    for (let i = 0; i < n; i++) out[i] = first + (out[i] - first) * k;
  }
  return out;
}
