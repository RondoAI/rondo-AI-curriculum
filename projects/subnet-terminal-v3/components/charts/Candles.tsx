"use client";

import { useEffect, useRef } from "react";
import { useSize } from "@/lib/useSize";
import type { Candle } from "@/lib/domain/bittensor";

type Overlay = "none" | "emission" | "validators";

/** τ/USD candlestick on canvas with an optional second-series
    overlay (emissions/day or active validators) and a right-edge
    price scale. Crisp at any DPR, redraws on resize. */
export function Candles({
  data,
  overlay = "none",
  accent = "#FFB000",
}: {
  data: Candle[];
  overlay?: Overlay;
  accent?: string;
}) {
  const { ref, w, h } = useSize<HTMLDivElement>();
  const cv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = cv.current;
    if (!canvas || w < 8 || h < 8 || data.length < 2) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const padL = 6, padR = 54, padT = 8, padB = 18;
    const plotW = w - padL - padR;
    const plotH = h - padT - padB;

    let lo = Infinity, hi = -Infinity;
    for (const c of data) {
      if (c.l < lo) lo = c.l;
      if (c.h > hi) hi = c.h;
    }
    const pad = (hi - lo) * 0.08 || 1;
    lo -= pad; hi += pad;
    const x = (i: number) => padL + (i / (data.length - 1)) * plotW;
    const y = (p: number) => padT + plotH - ((p - lo) / (hi - lo)) * plotH;

    /* gridlines + right price scale */
    ctx.font = "10px var(--font-jbmono), monospace";
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    for (let i = 0; i <= 4; i++) {
      const p = lo + (i / 4) * (hi - lo);
      const yy = y(p);
      ctx.strokeStyle = "rgba(255,176,0,.06)";
      ctx.beginPath();
      ctx.moveTo(padL, yy);
      ctx.lineTo(padL + plotW, yy);
      ctx.stroke();
      ctx.fillStyle = "#57534E";
      ctx.fillText("$" + Math.round(p).toLocaleString("en-US"), padL + plotW + 6, yy);
    }

    /* overlay series behind the candles */
    if (overlay !== "none") {
      const vals = data.map((c) => (overlay === "emission" ? c.emission : c.validators));
      let omin = Math.min(...vals), omax = Math.max(...vals);
      if (omax === omin) omax = omin + 1;
      const oy = (v: number) => padT + plotH - ((v - omin) / (omax - omin)) * plotH;
      ctx.beginPath();
      data.forEach((c, i) => {
        const px = x(i), py = oy(vals[i]);
        i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
      });
      ctx.strokeStyle = "rgba(34,211,238,.55)";
      ctx.lineWidth = 1.25;
      ctx.stroke();
    }

    /* candles */
    const cw = Math.max(1, (plotW / data.length) * 0.62);
    data.forEach((c, i) => {
      const px = x(i);
      const up = c.c >= c.o;
      const col = up ? "#10B981" : "#EF4444";
      ctx.strokeStyle = col;
      ctx.fillStyle = col;
      ctx.lineWidth = 1;
      /* wick */
      ctx.beginPath();
      ctx.moveTo(px, y(c.h));
      ctx.lineTo(px, y(c.l));
      ctx.stroke();
      /* body */
      const yo = y(c.o), yc = y(c.c);
      const bh = Math.max(1, Math.abs(yc - yo));
      ctx.fillRect(px - cw / 2, Math.min(yo, yc), cw, bh);
    });

    /* last price marker */
    const last = data[data.length - 1];
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(x(data.length - 1), y(last.c), 2.5, 0, Math.PI * 2);
    ctx.fill();
  }, [data, overlay, accent, w, h]);

  const first = data[0];
  const last = data[data.length - 1];
  const summary =
    data.length > 1
      ? `Candlestick chart, ${data.length} periods, open ${first.o.toFixed(
          2
        )}, last close ${last.c.toFixed(2)}.`
      : "Candlestick chart.";

  return (
    <div ref={ref} className="absolute inset-0">
      <canvas
        ref={cv}
        role="img"
        aria-label={summary}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </div>
  );
}
