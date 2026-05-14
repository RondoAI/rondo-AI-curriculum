#!/usr/bin/env bash
# Build a flat, file-only export of the terminal for raw.githack.
#
# next's `output: export` can't ship Route Handlers that read the
# request, nor dynamic routes without generateStaticParams — so we
# stash app/api and the dynamic detail routes, build the static
# pages (terminal + /about + /wire, seed data), then restore them.
# The full server app (next dev / Vercel) is never modified.
set -euo pipefail
cd "$(dirname "$0")/.."

STASH=".static-stash"
MOVED=(app/api app/s app/v app/m app/g app/iso app/editorial)

cleanup() {
  for d in "${MOVED[@]}"; do
    [ -d "$STASH/$d" ] && { mkdir -p "$(dirname "$d")"; rm -rf "$d"; mv "$STASH/$d" "$d"; }
  done
  rm -rf "$STASH"
}
trap cleanup EXIT

rm -rf "$STASH" out
for d in "${MOVED[@]}"; do
  if [ -d "$d" ]; then
    mkdir -p "$STASH/$(dirname "$d")"
    mv "$d" "$STASH/$d"
  fi
done

STATIC_EXPORT=1 \
ASSET_PREFIX="${ASSET_PREFIX:-}" \
npx next build

echo "static export ready in ./out"
