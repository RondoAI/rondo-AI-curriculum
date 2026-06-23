#!/usr/bin/env python3
"""
NITTER SCRAPER
-----------------------------------------------------------------
Pulls recent X posts for every handle in src/data/voices.js via
public Nitter RSS instances. Free, no API key, ToS-grey but
practical for now.

Output: intelligence/{today}/nitter.json
        [{handle, name, posted_at, text, url, fetched_at, via_instance}]

Strategy: rotate through a list of known-working Nitter instances.
Each handle is tried against the first instance; if that returns 5xx
or non-RSS, we try the next instance, until we exhaust the list. We
keep going on failure (a bad instance is normal); we only fail the
whole script if every instance is down.

No new Python deps. Standard library only: urllib + xml.etree.
"""

from __future__ import annotations

import json
import os
import re
import sys
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
VOICES_FILE = ROOT / "src" / "data" / "voices.js"

# Known-working Nitter instances. List rotated periodically; check
# https://github.com/zedeus/nitter/wiki/Instances for current
# uptime. Order matters: we hit them in order, first responder wins.
NITTER_INSTANCES = [
    "https://nitter.poast.org",
    "https://nitter.privacydev.net",
    "https://nitter.cz",
    "https://nitter.kavin.rocks",
    "https://nitter.lacontrevoie.fr",
]

# Per-handle: how many recent items to keep
ITEMS_PER_HANDLE = 5

# Timeout per HTTP request. Some Nitter instances are slow; 12s is
# the sweet spot for "responsive instance" vs "down instance".
REQUEST_TIMEOUT = 12

USER_AGENT = (
    "Mozilla/5.0 (compatible; SubnetMagazineBot/1.0; "
    "+https://github.com/RondoAI/rondo-AI-curriculum)"
)


def extract_handles() -> list[dict]:
    """Parse src/data/voices.js for handle + name pairs."""
    if not VOICES_FILE.exists():
        return []
    src = VOICES_FILE.read_text(encoding="utf-8")
    out = []
    for m in re.finditer(
        r"handle:\s*'([^']+)'\s*,\s*name:\s*'([^']+)'",
        src,
    ):
        out.append({"handle": m.group(1), "name": m.group(2)})
    return out


def fetch_rss(url: str) -> str | None:
    """Fetch a URL, return text body or None on failure."""
    try:
        req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(req, timeout=REQUEST_TIMEOUT) as resp:
            body = resp.read()
            ctype = resp.headers.get("Content-Type", "")
            if "xml" not in ctype and "rss" not in ctype:
                # Got HTML or something else; instance is probably
                # rate-limiting or down.
                return None
            return body.decode("utf-8", errors="replace")
    except (urllib.error.URLError, TimeoutError, OSError):
        return None


def parse_feed(xml_text: str, handle: str, name: str, instance: str) -> list[dict]:
    """Extract recent items from a Nitter RSS feed."""
    try:
        root = ET.fromstring(xml_text)
    except ET.ParseError:
        return []
    items = []
    fetched_at = datetime.now(timezone.utc).isoformat()
    for item in root.iter("item"):
        title = (item.findtext("title") or "").strip()
        link = (item.findtext("link") or "").strip()
        pub = (item.findtext("pubDate") or "").strip()
        # Nitter puts the tweet text in <description> as HTML; strip
        # tags to get clean text.
        desc_raw = item.findtext("description") or ""
        text = re.sub(r"<[^>]+>", "", desc_raw).strip()
        text = re.sub(r"\s+", " ", text)
        if not link:
            continue
        items.append({
            "handle":       handle,
            "name":         name,
            "posted_at":    pub,
            "title":        title,
            "text":         text[:600],  # keep entries compact
            "url":          link,
            "fetched_at":   fetched_at,
            "via_instance": instance,
        })
        if len(items) >= ITEMS_PER_HANDLE:
            break
    return items


def fetch_handle(handle: str, name: str) -> list[dict]:
    """Try each Nitter instance in order until one works."""
    for instance in NITTER_INSTANCES:
        url = f"{instance}/{handle}/rss"
        body = fetch_rss(url)
        if body is None:
            continue
        items = parse_feed(body, handle, name, instance)
        if items:
            return items
    return []


def write_output(items: list[dict]) -> Path:
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    day_dir = ROOT / "intelligence" / today
    day_dir.mkdir(parents=True, exist_ok=True)
    out_path = day_dir / "nitter.json"

    # Merge with existing day file if present, dedupe by URL
    existing = []
    if out_path.exists():
        try:
            existing = json.loads(out_path.read_text("utf-8"))
        except Exception:
            existing = []
    by_url = {x["url"]: x for x in existing}
    for it in items:
        by_url.setdefault(it["url"], it)
    merged = list(by_url.values())
    merged.sort(key=lambda x: x.get("posted_at", ""), reverse=True)

    out_path.write_text(json.dumps(merged, indent=2, ensure_ascii=False))
    return out_path


def main() -> int:
    handles = extract_handles()
    if not handles:
        print("[warn] no handles found in voices.js", file=sys.stderr)
        return 0

    print(f"[start] nitter scrape, {len(handles)} handles", file=sys.stderr)

    all_items = []
    for h in handles:
        items = fetch_handle(h["handle"], h["name"])
        status = "ok" if items else "miss"
        print(f"  [{status}] @{h['handle']} ({len(items)} items)", file=sys.stderr)
        all_items.extend(items)

    if not all_items:
        print("[warn] all instances + handles came back empty", file=sys.stderr)
        return 0

    out = write_output(all_items)
    print(f"[done] wrote {len(all_items)} new items to {out.relative_to(ROOT)}",
          file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
