/* =================================================================
   /api/ai — the Open-source AI vertical's data, server-side.
   HuggingFace + arXiv + GitHub are public, so there's no key to
   hide here — but routing through the server still keeps the
   browser off three cross-origin endpoints and lets us cache once
   for every panel. Falls through to seed.
   ================================================================= */

import { NextResponse } from "next/server";
import { getModels, getWire } from "@/lib/sources/ai";

export const dynamic = "force-dynamic";

export async function GET() {
  const [models, wire] = await Promise.all([getModels(), getWire()]);
  return NextResponse.json(
    {
      models: models.data,
      wire: wire.data,
      live: { models: models.live, wire: wire.live },
      asOf: Date.now(),
    },
    { headers: { "cache-control": "no-store" } }
  );
}
