"""
Drain the Twitter draft queue.

Reads every file in `drafts/twitter/ready/` whose ISO-timestamped filename
is <= now (UTC), posts each one as a tweet, and moves successfully-posted
files into `drafts/twitter/posted/` with the tweet id appended to the
filename so the audit trail is complete and re-posting is impossible.

Draft filename format (UTC):
    YYYY-MM-DD_HHMMZ--<slug>.md

  e.g. 2026-05-29_1430Z--affine-7pct-1y.md
       2026-05-29_1800Z--validator-set-expands.md

Body: plain text or markdown. Whatever's in the file gets posted verbatim
(stripped of leading/trailing whitespace). Markdown formatting doesn't
render on Twitter so keep it simple.

Used by .github/workflows/twitter-post.yml on a cron. Run locally with:
    python3 run_queue.py            # post anything ready right now
    python3 run_queue.py --dry-run  # just report what WOULD be posted
"""
from __future__ import annotations
import os
import sys
import re
import json
import argparse
from datetime import datetime, timezone
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent                                # projects/subnet-magazine-v2/
READY_DIR  = ROOT / "drafts" / "twitter" / "ready"
POSTED_DIR = ROOT / "drafts" / "twitter" / "posted"
FNAME_RE   = re.compile(r"^(\d{4})-(\d{2})-(\d{2})_(\d{2})(\d{2})Z--([a-z0-9-]+)\.md$")


def parse_filename(name: str):
    """Returns (datetime UTC, slug) if name matches the format, else None."""
    m = FNAME_RE.match(name)
    if not m:
        return None
    y, mo, d, h, mi, slug = m.groups()
    try:
        when = datetime(int(y), int(mo), int(d), int(h), int(mi), tzinfo=timezone.utc)
    except ValueError:
        return None
    return when, slug


def collect_due(now: datetime):
    """List all drafts whose timestamp is <= now, oldest-first."""
    due = []
    if not READY_DIR.exists():
        return due
    for f in sorted(READY_DIR.iterdir()):
        if not f.is_file() or f.name.startswith("."):
            continue
        parsed = parse_filename(f.name)
        if parsed is None:
            sys.stderr.write(f"  skip (bad name): {f.name}\n")
            continue
        when, slug = parsed
        if when <= now:
            due.append((when, slug, f))
    return due


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--dry-run", action="store_true",
                   help="show what would be posted, don't actually POST")
    args = p.parse_args()

    POSTED_DIR.mkdir(parents=True, exist_ok=True)

    now = datetime.now(timezone.utc)
    due = collect_due(now)
    if not due:
        print(f"[{now.isoformat()}] queue empty — nothing due")
        return 0

    print(f"[{now.isoformat()}] {len(due)} tweet(s) due:")
    for when, slug, path in due:
        print(f"  - {when.isoformat()}  {slug}  ({path.name})")

    if args.dry_run:
        print("DRY-RUN: not actually posting")
        return 0

    # Lazy-import post.py so dry-run doesn't fail on missing creds
    sys.path.insert(0, str(HERE))
    from post import post as post_tweet

    posted, failed = 0, 0
    for when, slug, path in due:
        body = path.read_text(encoding="utf-8").strip()
        try:
            result = post_tweet(body)
        except Exception as exc:
            sys.stderr.write(f"FAIL {path.name}: {exc}\n")
            failed += 1
            continue
        new_name = path.stem + f"--posted-{result['id']}.md"
        new_path = POSTED_DIR / new_name
        # Write the body + a small footer with the live URL for the audit trail
        new_path.write_text(body + f"\n\n---\nPOSTED: {result['url']}\n", encoding="utf-8")
        path.unlink()
        print(f"OK   {path.name}  ->  {result['url']}")
        posted += 1

    print(f"summary: posted={posted} failed={failed}")
    return 0 if failed == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
