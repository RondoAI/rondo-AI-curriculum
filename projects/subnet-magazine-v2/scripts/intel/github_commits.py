#!/usr/bin/env python3
"""
GITHUB COMMITS SCRAPER
-----------------------------------------------------------------
Tracks recent commits and releases on a curated list of subnet and
Bittensor-core public repositories. Free, no auth required for
public reads (60 req/h limit, enough for ~20 repos polled every 4h).

Output: intelligence/{today}/github.json
        [{repo, kind, sha, message, author, posted_at, url, fetched_at}]

If GITHUB_TOKEN is set in env (the workflow's default), we use it
for authenticated requests, raising the rate limit to 5000 req/h.
"""

from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

# Curated subnet + core repositories. Add to this list as the
# magazine's coverage expands. Format: (owner, repo, friendly-name).
REPOS = [
    # Bittensor core
    ("opentensor", "subtensor",   "Subtensor (chain)"),
    ("opentensor", "bittensor",   "Bittensor SDK"),
    ("opentensor", "btcli",       "btcli"),
    # Notable subnets with active public repos
    ("ifrit98",                  "subnet-template", "Subnet template"),
    ("eclipsevortex",            "bittensor-subnet-template", "Subnet template alt"),
    # Add subnet team repos here as they come online publicly
]

LOOKBACK_HOURS = 24
USER_AGENT = "SubnetMagazineBot/1.0"


def gh_request(url: str) -> list | dict | None:
    """Fetch a GitHub API endpoint; return parsed JSON or None."""
    headers = {
        "User-Agent": USER_AGENT,
        "Accept":     "application/vnd.github+json",
    }
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except (urllib.error.URLError, json.JSONDecodeError, TimeoutError, OSError):
        return None


def fetch_commits(owner: str, repo: str, friendly: str) -> list[dict]:
    """Recent commits on the default branch within the lookback window."""
    since = (datetime.now(timezone.utc) - timedelta(hours=LOOKBACK_HOURS)).isoformat()
    url = f"https://api.github.com/repos/{owner}/{repo}/commits?since={since}&per_page=10"
    data = gh_request(url)
    if not isinstance(data, list):
        return []
    out = []
    fetched_at = datetime.now(timezone.utc).isoformat()
    for c in data:
        commit = c.get("commit") or {}
        author = (commit.get("author") or {}).get("name", "?")
        date = (commit.get("author") or {}).get("date", "")
        msg = commit.get("message", "").split("\n", 1)[0][:240]
        sha = c.get("sha", "")[:7]
        out.append({
            "repo":       f"{owner}/{repo}",
            "name":       friendly,
            "kind":       "commit",
            "sha":        sha,
            "message":    msg,
            "author":     author,
            "posted_at":  date,
            "url":        c.get("html_url", ""),
            "fetched_at": fetched_at,
        })
    return out


def fetch_releases(owner: str, repo: str, friendly: str) -> list[dict]:
    """Most recent release (if any). Use this to catch tagged versions."""
    url = f"https://api.github.com/repos/{owner}/{repo}/releases/latest"
    data = gh_request(url)
    if not isinstance(data, dict) or "tag_name" not in data:
        return []
    published = data.get("published_at", "")
    cutoff = datetime.now(timezone.utc) - timedelta(hours=LOOKBACK_HOURS)
    try:
        when = datetime.fromisoformat(published.replace("Z", "+00:00"))
    except Exception:
        return []
    if when < cutoff:
        return []
    fetched_at = datetime.now(timezone.utc).isoformat()
    return [{
        "repo":       f"{owner}/{repo}",
        "name":       friendly,
        "kind":       "release",
        "sha":        data.get("tag_name", ""),
        "message":    (data.get("name") or data.get("tag_name", ""))[:240],
        "author":     (data.get("author") or {}).get("login", "?"),
        "posted_at":  published,
        "url":        data.get("html_url", ""),
        "fetched_at": fetched_at,
    }]


def write_output(items: list[dict]) -> Path:
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    day_dir = ROOT / "intelligence" / today
    day_dir.mkdir(parents=True, exist_ok=True)
    out_path = day_dir / "github.json"

    existing = []
    if out_path.exists():
        try:
            existing = json.loads(out_path.read_text("utf-8"))
        except Exception:
            existing = []
    by_key = {(x["repo"], x["kind"], x["sha"]): x for x in existing}
    for it in items:
        by_key.setdefault((it["repo"], it["kind"], it["sha"]), it)
    merged = list(by_key.values())
    merged.sort(key=lambda x: x.get("posted_at", ""), reverse=True)

    out_path.write_text(json.dumps(merged, indent=2, ensure_ascii=False))
    return out_path


def main() -> int:
    print(f"[start] github scrape, {len(REPOS)} repos", file=sys.stderr)
    all_items = []
    for owner, repo, friendly in REPOS:
        commits  = fetch_commits(owner, repo, friendly)
        releases = fetch_releases(owner, repo, friendly)
        items = commits + releases
        status = "ok" if items else "quiet"
        print(f"  [{status}] {owner}/{repo} ({len(items)} items)", file=sys.stderr)
        all_items.extend(items)

    if not all_items:
        print("[done] no new commits or releases in window", file=sys.stderr)
        # still write empty file so downstream tools see "scraped today"
        write_output([])
        return 0

    out = write_output(all_items)
    print(f"[done] wrote {len(all_items)} items to {out.relative_to(ROOT)}",
          file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
