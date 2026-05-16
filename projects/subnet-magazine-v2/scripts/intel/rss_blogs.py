#!/usr/bin/env python3
"""
RSS BLOG SCRAPER
-----------------------------------------------------------------
Pulls recent posts from a curated list of Bittensor-ecosystem
blogs and newsletters. Free, standard RSS.

Output: intelligence/{today}/rss.json
        [{source, title, summary, url, posted_at, fetched_at}]
"""

from __future__ import annotations

import json
import re
import sys
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

# Friendly-name + feed URL pairs. Add as discovered. Verify the
# feed returns valid RSS or Atom before adding here.
FEEDS = [
    ("Bittensor official blog",  "https://bittensor.com/feed"),
    ("Opentensor Foundation",    "https://opentensor.ai/feed"),
    ("TaoStats blog",            "https://taostats.io/feed"),
    # Add subnet team blogs as discovered:
    # ("Hippius engineering",      "https://hippius.io/blog/rss"),
    # ("Ridges blog",              "https://ridges.ai/feed"),
]

USER_AGENT = (
    "Mozilla/5.0 (compatible; SubnetMagazineBot/1.0; "
    "+https://github.com/RondoAI/rondo-AI-curriculum)"
)


def fetch(url: str) -> str | None:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(req, timeout=12) as resp:
            return resp.read().decode("utf-8", errors="replace")
    except (urllib.error.URLError, TimeoutError, OSError):
        return None


def parse_feed(xml_text: str, source: str) -> list[dict]:
    """Parse an RSS or Atom feed, return normalized items."""
    try:
        root = ET.fromstring(xml_text)
    except ET.ParseError:
        return []
    items = []
    fetched_at = datetime.now(timezone.utc).isoformat()

    # RSS 2.0
    for item in root.iter("item"):
        title = (item.findtext("title") or "").strip()
        link = (item.findtext("link") or "").strip()
        pub = (item.findtext("pubDate") or "").strip()
        desc = (item.findtext("description") or "").strip()
        desc_clean = re.sub(r"<[^>]+>", "", desc)[:400].strip()
        if link:
            items.append({
                "source":     source,
                "title":      title,
                "summary":    desc_clean,
                "url":        link,
                "posted_at":  pub,
                "fetched_at": fetched_at,
            })

    # Atom
    ns = {"atom": "http://www.w3.org/2005/Atom"}
    for entry in root.iter("{http://www.w3.org/2005/Atom}entry"):
        title = (entry.findtext("atom:title", default="", namespaces=ns) or "").strip()
        link_el = entry.find("atom:link", namespaces=ns)
        link = link_el.get("href") if link_el is not None else ""
        pub = (entry.findtext("atom:updated", default="", namespaces=ns)
               or entry.findtext("atom:published", default="", namespaces=ns)).strip()
        summary = (entry.findtext("atom:summary", default="", namespaces=ns)
                   or entry.findtext("atom:content", default="", namespaces=ns) or "")
        summary_clean = re.sub(r"<[^>]+>", "", summary)[:400].strip()
        if link:
            items.append({
                "source":     source,
                "title":      title,
                "summary":    summary_clean,
                "url":        link,
                "posted_at":  pub,
                "fetched_at": fetched_at,
            })

    return items[:10]  # cap per feed


def write_output(items: list[dict]) -> Path:
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    day_dir = ROOT / "intelligence" / today
    day_dir.mkdir(parents=True, exist_ok=True)
    out_path = day_dir / "rss.json"

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
    print(f"[start] rss scrape, {len(FEEDS)} feeds", file=sys.stderr)
    all_items = []
    for source, url in FEEDS:
        body = fetch(url)
        if body is None:
            print(f"  [miss] {source}", file=sys.stderr)
            continue
        items = parse_feed(body, source)
        print(f"  [{'ok' if items else 'empty'}] {source} ({len(items)} items)", file=sys.stderr)
        all_items.extend(items)

    out = write_output(all_items)
    print(f"[done] wrote {len(all_items)} items to {out.relative_to(ROOT)}",
          file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
