import type { NextConfig } from "next";

/* Two build modes from one source tree:
   - default: the full server app (next dev, Vercel) with /api routes.
   - STATIC_EXPORT=1: a flat, file-only build for raw.githack — no
     server, seed data only. The build script (scripts/build-static.sh)
     stashes /api + the dynamic detail routes before running this;
     ASSET_PREFIX points the bundle's asset URLs at wherever the
     out/ folder is served from. */
const isExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = isExport
  ? {
      output: "export",
      trailingSlash: true,
      images: { unoptimized: true },
      assetPrefix: process.env.ASSET_PREFIX || undefined,
    }
  : {};

export default nextConfig;
