#!/usr/bin/env python3
"""
INTELLIGENCE AGGREGATOR
-----------------------------------------------------------------
Runs every scraper, merges results with the human-curated notes,
produces intelligence/{today}/digest.md, the single file the daily
research agent reads as context.

Order of operations:
  1. Run nitter, github, rss scrapers (each writes its own JSON)
  2. Read intelligence/HUMAN_NOTES.md (last 7 days of entries)
  3. Build digest.md with:
     - human notes at the TOP (highest trust)
     - github commits/releases (objective, verifiable)
     - blog posts via RSS
     - X posts via Nitter (volume, lower per-item signal)
"""

from __future__ import annotations

import json
import re
import subprocess
import sys
from datetime import datetime, timezone, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
INTEL_DIR = ROOT / "intelligence"
HUMAN_NOTES = INTEL_DIR / "HUMAN_NOTES.md"

SCRAPERS = [
    ("nitter",         "scripts/intel/nitter.py"),
    ("github_commits", "scripts/intel/github_commits.py"),
    ("rss_blogs",      "scripts/intel/rss_blogs.py"),
]


def run_scrapers() -> None:
    """Run every scraper in sequence. Failures are logged but do not
    abort the aggregation; partial intelligence beats none."""
    for name, script in SCRAPERS:
        print(f"\n[scraper] {name}", file=sys.stderr)
        try:
            subprocess.run(
                [sys.executable, str(ROOT / script)],
                cwd=ROOT,
                timeout=300,
                check=False,
            )
        except subprocess.TimeoutExpired:
            print(f"  [timeout] {name} exceeded 5 min", file=sys.stderr)
        except Exception as e:
            print(f"  [fail] {name}: {e}", file=sys.stderr)


def load_json(path: Path) -> list:
    if not path.exists():
        return []
    try:
        return json.loads(path.read_text("utf-8"))
    except Exception:
        return []


def recent_human_notes(days: int = 7) -> str:
    """Pull entries from HUMAN_NOTES.md that fall within the last N
    days. Entries are dated H2 headings (## YYYY-MM-DD ...). If we
    can't parse a date, include the entry anyway (better safe)."""
    if not HUMAN_NOTES.exists():
        return ""
    src = HUMAN_NOTES.read_text("utf-8")
    cutoff = datetime.now(timezone.utc) - timedelta(days=days)

    # Split into entries by H2 heading
    parts = re.split(r"^## ", src, flags=re.MULTILINE)
    keep = []
    for p in parts[1:]:  # part 0 is the file's intro, skip
        heading_line = p.split("\n", 1)[0]
        # Parse YYYY-MM-DD at the start
        m = re.match(r"(\d{4}-\d{2}-\d{2})", heading_line)
        include = True
        if m:
            try:
                when = datetime.strptime(m.group(1), "%Y-%m-%d").replace(tzinfo=timezone.utc)
                include = when >= cutoff
            except ValueError:
                pass
        if include:
            keep.append("## " + p.rstrip())

    return "\n\n".join(keep).strip()


def fmt_github(items: list) -> str:
    if not items:
        return "_no commits or releases in the lookback window_"
    lines = []
    for it in items[:30]:
        when = it.get("posted_at", "")[:16].replace("T", " ")
        kind = it.get("kind", "?").upper()
        repo = it.get("name") or it.get("repo", "?")
        msg = it.get("message", "")
        sha = it.get("sha", "")[:7]
        url = it.get("url", "")
        lines.append(f"- **{repo}** ({kind} `{sha}`, {when}) {msg}  \n  {url}")
    return "\n".join(lines)


def fmt_rss(items: list) -> str:
    if not items:
        return "_no new posts in the lookback window_"
    lines = []
    for it in items[:20]:
        when = it.get("posted_at", "")[:16].replace("T", " ")
        src = it.get("source", "?")
        title = it.get("title", "")
        summary = it.get("summary", "")
        url = it.get("url", "")
        lines.append(f"- **{src}** ({when}) [{title}]({url})  \n  {summary}")
    return "\n".join(lines)


def fmt_nitter(items: list) -> str:
    if not items:
        return "_no posts retrieved · all Nitter instances may be down_"
    lines = []
    for it in items[:50]:
        handle = it.get("handle", "?")
        name = it.get("name", "")
        when = it.get("posted_at", "")[:16]
        text = it.get("text", "").replace("\n", " ")
        url = it.get("url", "")
        lines.append(f"- @{handle} ({name}, {when}): {text}  \n  {url}")
    return "\n".join(lines)


def build_digest(today: str) -> str:
    day_dir = INTEL_DIR / today
    nitter_items = load_json(day_dir / "nitter.json")
    github_items = load_json(day_dir / "github.json")
    rss_items    = load_json(day_dir / "rss.json")
    human        = recent_human_notes(days=7)

    chunks = []
    chunks.append(f"# Intelligence Digest, {today}\n")
    chunks.append(
        "_Single-file briefing for the daily research agent. Sources "
        "listed in trust order: human-curated notes first, then "
        "objective (github), then editorial (RSS), then volume (X via "
        "Nitter)._\n"
    )

    chunks.append("\n## ⊕ HUMAN-CURATED NOTES, last 7 days\n")
    chunks.append(human if human else "_no human notes in the window_")

    chunks.append("\n## ⊕ GITHUB COMMITS + RELEASES, last 24h\n")
    chunks.append(fmt_github(github_items))

    chunks.append("\n## ⊕ ECOSYSTEM BLOGS via RSS\n")
    chunks.append(fmt_rss(rss_items))

    chunks.append("\n## ⊕ X via NITTER, voices we track\n")
    chunks.append(fmt_nitter(nitter_items))

    chunks.append(
        "\n\n---\n"
        f"_Generated at {datetime.now(timezone.utc).isoformat()} by "
        "scripts/intel/aggregate.py. Treat this digest as input "
        "context, not as ground truth. Verify before quoting._\n"
    )
    return "\n".join(chunks)


def main() -> int:
    print("[start] intelligence aggregator", file=sys.stderr)

    # Skip scrapers if invoked with --no-scrape (useful in dev)
    if "--no-scrape" not in sys.argv:
        run_scrapers()

    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    day_dir = INTEL_DIR / today
    day_dir.mkdir(parents=True, exist_ok=True)
    digest_path = day_dir / "digest.md"

    digest = build_digest(today)
    digest_path.write_text(digest, encoding="utf-8")
    print(f"\n[done] wrote {digest_path.relative_to(ROOT)}, "
          f"{len(digest)} chars", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
