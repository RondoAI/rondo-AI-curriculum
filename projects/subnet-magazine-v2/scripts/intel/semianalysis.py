#!/usr/bin/env python3
"""
SEMIANALYSIS ARCHIVE CRAWLER
-----------------------------------------------------------------
Pulls the full SemiAnalysis newsletter archive (Substack-hosted),
preserves each post as markdown, and builds a corpus the Oracle
agent uses as macro backdrop for AI hardware, compute, models,
power, and foundry coverage.

SemiAnalysis does not cover Bittensor. Its value to us is the
opposite: it documents the centralized-AI conditions (hyperscaler
pricing power, GPU scarcity, lab margin expansion, memory cycle,
TSMC capacity) that decentralized AI operates against. We mine
it for the macro half of the 360 view, never for a Bittensor claim.

Output layout:
  intelligence/_external_sources/semianalysis/
    INDEX.md                                ← title list, dates, audience
    .state.json                             ← last-seen post id (incremental)
    YYYY-MM-DD-<slug>.md                    ← one file per post
                                              frontmatter + body markdown

For paywalled posts (audience='only_paid'), only the free preview
plus subtitle is captured. The metadata is still useful.

CLI:
  python3 scripts/intel/semianalysis.py --backfill
  python3 scripts/intel/semianalysis.py --incremental    (default)
  python3 scripts/intel/semianalysis.py --limit 5        (testing)
  python3 scripts/intel/semianalysis.py --rebuild-index
"""

from __future__ import annotations

import argparse
import html
import json
import re
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = ROOT / "intelligence" / "_external_sources" / "semianalysis"
STATE_PATH = OUT_DIR / ".state.json"
INDEX_PATH = OUT_DIR / "INDEX.md"
COOKIE_PATH = OUT_DIR / ".cookies.json"   # gitignored, opt-in auth

ARCHIVE_API = "https://newsletter.semianalysis.com/api/v1/archive"
RSS_FEED = "https://newsletter.semianalysis.com/feed"
WAYBACK_AVAIL = "https://archive.org/wayback/available"
USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/120.0.0.0 Safari/537.36"
)
PAGE_SIZE = 12              # Substack caps at 12 per request
ARCHIVE_TAIL = 300          # observed depth as of May 2026
POLITE_SLEEP = 1.5          # seconds between post fetches
THIN_BODY_CHARS = 4000      # below this, escalate to RSS then Wayback


def load_cookie_header() -> str | None:
    """If a `.cookies.json` file exists in the corpus directory, build
    a Cookie header value from its `{name: value}` mapping. Lets the
    operator opt into authenticated crawling without committing
    credentials. The expected key for Substack is `substack.sid`."""
    if not COOKIE_PATH.exists():
        return None
    try:
        data = json.loads(COOKIE_PATH.read_text("utf-8"))
        if not isinstance(data, dict) or not data:
            return None
        return "; ".join(f"{k}={v}" for k, v in data.items())
    except Exception:
        return None


# ---------------------------------------------------------------- HTTP

def http_get(url: str, *, accept_json: bool = False, retries: int = 2,
             use_auth: bool = True) -> str | None:
    headers = {"User-Agent": USER_AGENT}
    if accept_json:
        headers["Accept"] = "application/json"
    if use_auth:
        cookie = load_cookie_header()
        if cookie:
            headers["Cookie"] = cookie
    for attempt in range(retries + 1):
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=20) as resp:
                return resp.read().decode("utf-8", errors="replace")
        except (urllib.error.URLError, TimeoutError, OSError) as e:
            if attempt == retries:
                print(f"  [http-miss] {url}: {e}", file=sys.stderr)
                return None
            time.sleep(1.0 * (attempt + 1))
    return None


# ---------------------------------------------------------------- ARCHIVE LISTING

def list_archive_page(offset: int) -> list[dict]:
    url = f"{ARCHIVE_API}?sort=new&search=&offset={offset}&limit={PAGE_SIZE}"
    body = http_get(url, accept_json=True)
    if not body:
        return []
    try:
        data = json.loads(body)
    except json.JSONDecodeError:
        return []
    if not isinstance(data, list):
        return []
    return data


def walk_archive(start_offset: int = 0, stop_at_id: int | None = None,
                 max_offset: int = ARCHIVE_TAIL) -> list[dict]:
    """Walk the archive from newest to oldest. If stop_at_id is given,
    halt as soon as we hit it (for incremental mode)."""
    out: list[dict] = []
    offset = start_offset
    while offset <= max_offset:
        page = list_archive_page(offset)
        if not page:
            break
        for post in page:
            if stop_at_id is not None and post.get("id") == stop_at_id:
                return out
            out.append(post)
        offset += PAGE_SIZE
        time.sleep(0.6)
    return out


# ---------------------------------------------------------------- HTML → MARKDOWN

# Minimal converter sufficient for Substack post bodies. Substack
# emits clean semantic HTML inside <div class="available-content">.
# We extract that div, then walk a regex-stripped, tag-aware reduction.

AVAILABLE_RE = re.compile(
    r'<div class="available-content"[^>]*>(.*?)</div>\s*(?:<div class="paywall|<footer|<div class="postBuiltUp)',
    re.DOTALL,
)
AVAILABLE_FALLBACK_RE = re.compile(
    r'<div class="available-content"[^>]*>(.*)', re.DOTALL,
)


def extract_available_content(page_html: str) -> str:
    m = AVAILABLE_RE.search(page_html)
    if m:
        return m.group(1)
    m = AVAILABLE_FALLBACK_RE.search(page_html)
    if m:
        # truncate at first close of body or trailing scripts
        chunk = m.group(1)
        cut = chunk.find('</article>')
        if cut > 0:
            chunk = chunk[:cut]
        return chunk
    return ""


def html_to_markdown(frag: str) -> str:
    """Reduce Substack HTML to readable markdown. Lossy but
    structure-preserving for headings, paragraphs, lists, quotes,
    inline emphasis, links, and images."""
    if not frag:
        return ""
    s = frag

    # Strip script/style
    s = re.sub(r"<script\b.*?</script>", "", s, flags=re.DOTALL | re.IGNORECASE)
    s = re.sub(r"<style\b.*?</style>", "", s, flags=re.DOTALL | re.IGNORECASE)

    # Substack image captions: <figcaption>...</figcaption>
    s = re.sub(
        r"<figcaption[^>]*>(.*?)</figcaption>",
        lambda m: f"\n\n_caption:_ {strip_inner(m.group(1))}\n\n",
        s, flags=re.DOTALL,
    )

    # <img src="..." alt="...">
    def img_repl(m: re.Match) -> str:
        tag = m.group(0)
        src = re.search(r'src="([^"]+)"', tag)
        alt = re.search(r'alt="([^"]*)"', tag)
        src_v = src.group(1) if src else ""
        alt_v = alt.group(1) if alt else ""
        return f"\n\n![{alt_v}]({src_v})\n\n"
    s = re.sub(r"<img\b[^>]*>", img_repl, s)

    # Anchors
    def link_repl(m: re.Match) -> str:
        href = re.search(r'href="([^"]+)"', m.group(0))
        text = strip_inner(m.group(1))
        return f"[{text}]({href.group(1)})" if href else text
    s = re.sub(r"<a\b[^>]*>(.*?)</a>", link_repl, s, flags=re.DOTALL)

    # Headings
    for level in range(1, 7):
        s = re.sub(
            rf"<h{level}\b[^>]*>(.*?)</h{level}>",
            lambda m, lv=level: f"\n\n{'#' * lv} {strip_inner(m.group(1))}\n\n",
            s, flags=re.DOTALL,
        )

    # Blockquotes
    s = re.sub(
        r"<blockquote\b[^>]*>(.*?)</blockquote>",
        lambda m: "\n\n" + "\n".join(
            f"> {line}" for line in strip_inner(m.group(1)).split("\n")
        ) + "\n\n",
        s, flags=re.DOTALL,
    )

    # Lists, items
    s = re.sub(
        r"<li\b[^>]*>(.*?)</li>",
        lambda m: f"\n- {strip_inner(m.group(1))}",
        s, flags=re.DOTALL,
    )
    s = re.sub(r"</?(ul|ol)\b[^>]*>", "\n", s, flags=re.IGNORECASE)

    # Paragraphs
    s = re.sub(
        r"<p\b[^>]*>(.*?)</p>",
        lambda m: f"\n\n{strip_inner(m.group(1))}\n\n",
        s, flags=re.DOTALL,
    )

    # Inline
    s = re.sub(r"<strong\b[^>]*>(.*?)</strong>", r"**\1**", s, flags=re.DOTALL)
    s = re.sub(r"<b\b[^>]*>(.*?)</b>", r"**\1**", s, flags=re.DOTALL)
    s = re.sub(r"<em\b[^>]*>(.*?)</em>", r"*\1*", s, flags=re.DOTALL)
    s = re.sub(r"<i\b[^>]*>(.*?)</i>", r"*\1*", s, flags=re.DOTALL)
    s = re.sub(r"<code\b[^>]*>(.*?)</code>", r"`\1`", s, flags=re.DOTALL)
    s = re.sub(
        r"<pre\b[^>]*>(.*?)</pre>",
        lambda m: f"\n\n```\n{strip_inner(m.group(1))}\n```\n\n",
        s, flags=re.DOTALL,
    )

    # Line breaks, horizontal rules
    s = re.sub(r"<br\s*/?>", "\n", s)
    s = re.sub(r"<hr\s*/?>", "\n\n---\n\n", s)

    # Remove all remaining tags
    s = re.sub(r"<[^>]+>", "", s)

    # Decode entities
    s = html.unescape(s)

    # Collapse whitespace
    s = re.sub(r"[ \t]+\n", "\n", s)
    s = re.sub(r"\n{3,}", "\n\n", s)
    s = s.strip()
    return s


def strip_inner(s: str) -> str:
    """Remove tags from an inline fragment without recursing."""
    s = re.sub(r"<[^>]+>", "", s)
    s = html.unescape(s)
    return re.sub(r"\s+", " ", s).strip()


# ---------------------------------------------------------------- POST FETCH

def fetch_post_body(canonical_url: str) -> str:
    page = http_get(canonical_url)
    if not page:
        return ""
    frag = extract_available_content(page)
    return html_to_markdown(frag)


# ---------------------------------------------------------------- RSS FEED CACHE

_RSS_CACHE: dict[str, str] | None = None


def load_rss_bodies() -> dict[str, str]:
    """One-shot fetch of the Substack RSS feed. Substack's RSS exposes
    `<content:encoded>` with the same public-preview body as the HTML
    page, but the whole most-recent ~20 posts ship in a single request.
    We cache by canonical URL and use as a redundancy layer."""
    global _RSS_CACHE
    if _RSS_CACHE is not None:
        return _RSS_CACHE
    _RSS_CACHE = {}
    xml = http_get(RSS_FEED, use_auth=False)
    if not xml:
        return _RSS_CACHE
    try:
        import xml.etree.ElementTree as ET
        root = ET.fromstring(xml)
    except Exception:
        return _RSS_CACHE
    ns = {"content": "http://purl.org/rss/1.0/modules/content/"}
    for item in root.iter("item"):
        link = (item.findtext("link") or "").strip()
        body_html = item.findtext("content:encoded", default="", namespaces=ns) or ""
        if link and body_html:
            _RSS_CACHE[link] = html_to_markdown(body_html)
    print(f"  [rss-cache] {len(_RSS_CACHE)} posts loaded from feed",
          file=sys.stderr)
    return _RSS_CACHE


# ---------------------------------------------------------------- WAYBACK FALLBACK

def wayback_snapshot_url(canonical_url: str) -> str | None:
    """Ask the Wayback Machine availability endpoint whether it has a
    snapshot for this URL. Returns the snapshot URL or None. Silently
    skips when egress is blocked (dev sandboxes can lose this; GitHub
    Actions runners have it)."""
    try:
        avail = http_get(
            f"{WAYBACK_AVAIL}?url={canonical_url}",
            accept_json=True, retries=1, use_auth=False,
        )
        if not avail:
            return None
        data = json.loads(avail)
        snap = (data.get("archived_snapshots") or {}).get("closest") or {}
        if snap.get("available") and snap.get("status") == "200":
            return snap.get("url")
    except Exception:
        return None
    return None


def fetch_wayback_body(canonical_url: str) -> str:
    snap = wayback_snapshot_url(canonical_url)
    if not snap:
        return ""
    # Wayback prefixes the snapshot URL with /web/<ts>/ — the page is
    # the original HTML, possibly with Wayback toolbar injection at top.
    page = http_get(snap, use_auth=False)
    if not page:
        return ""
    frag = extract_available_content(page)
    return html_to_markdown(frag)


def best_effort_body(canonical_url: str, rss_bodies: dict[str, str],
                     paywalled: bool) -> tuple[str, list[str]]:
    """Try every available channel, return the richest body plus a
    provenance trail. Order:
      1. Direct HTML page (uses auth cookie if available)
      2. Substack RSS content:encoded (for recent ~20 posts)
      3. Wayback Machine snapshot (catches posts that changed paywall
         enforcement after archival)
    """
    sources_tried = []
    candidates: list[tuple[str, str]] = []

    direct = fetch_post_body(canonical_url)
    sources_tried.append(f"html-page:{len(direct)}")
    if direct:
        candidates.append(("html-page", direct))

    rss = rss_bodies.get(canonical_url, "")
    sources_tried.append(f"rss-feed:{len(rss)}")
    if rss:
        candidates.append(("rss-feed", rss))

    # Only escalate to Wayback if everything else came back thin AND
    # the post is paywalled (free posts don't benefit; the public page
    # is already the canonical body).
    best_so_far = max((len(c[1]) for c in candidates), default=0)
    if paywalled and best_so_far < THIN_BODY_CHARS:
        way = fetch_wayback_body(canonical_url)
        sources_tried.append(f"wayback:{len(way)}")
        if way:
            candidates.append(("wayback", way))

    if not candidates:
        return "", sources_tried
    # Pick the longest body — usually the most complete capture.
    label, best = max(candidates, key=lambda c: len(c[1]))
    sources_tried.append(f"winner={label}")
    return best, sources_tried


# ---------------------------------------------------------------- WRITE

SLUG_SAFE = re.compile(r"[^a-z0-9\-]+")


def slug_safe(slug: str) -> str:
    s = (slug or "post").lower()
    s = SLUG_SAFE.sub("-", s)
    return s.strip("-") or "post"


def post_filename(post: dict) -> str:
    date = (post.get("post_date") or "")[:10] or "undated"
    slug = slug_safe(post.get("slug") or str(post.get("id", "x")))
    return f"{date}-{slug}.md"


def render_post_md(post: dict, body_md: str) -> str:
    authors = [b.get("name", "") for b in (post.get("publishedBylines") or []) if b.get("name")]
    audience = post.get("audience", "")
    paywalled = audience == "only_paid"
    title = post.get("title", "").strip()
    subtitle = (post.get("subtitle") or "").strip()
    url = post.get("canonical_url", "").strip()
    post_id = post.get("id", "")
    word_count = post.get("wordcount", 0)
    date = (post.get("post_date") or "")[:10]
    preview = (post.get("truncated_body_text") or "").strip()

    front = [
        "---",
        f'source: "SemiAnalysis"',
        f'title: "{title.replace(chr(34), chr(39))}"',
        f'subtitle: "{subtitle.replace(chr(34), chr(39))}"',
        f'date: "{date}"',
        f'authors: [{", ".join(json.dumps(a) for a in authors)}]',
        f'audience: "{audience}"',
        f'paywalled: {str(paywalled).lower()}',
        f'wordcount: {word_count}',
        f'url: "{url}"',
        f'post_id: {post_id}',
        f'captured_at: "{datetime.now(timezone.utc).isoformat()}"',
        "---",
        "",
        f"# {title}",
        "",
    ]
    if subtitle:
        front += [f"_{subtitle}_", ""]
    front += [
        f"**Authors:** {', '.join(authors) if authors else '(unattributed)'}  ",
        f"**Published:** {date}  ",
        f"**Audience:** {audience}  ",
        f"**URL:** {url}",
        "",
        "---",
        "",
    ]

    if paywalled:
        body_chars = len(body_md or "")
        front += [
            "> **Paywalled.** Captured below is the free preview "
            f"Substack renders publicly ({body_chars:,} chars of body "
            "markdown). For long-form analyses this is typically 70 to "
            "90 percent of the article, with the final deep-dive "
            "section paywalled. The Oracle may cite the captured "
            "content; do not assert claims that depend on the "
            "paywalled tail (look for a 'This post is for paid "
            "subscribers' marker at the end of the body).",
            "",
        ]
        # If our HTML extraction failed and we fell back to the short
        # API preview, that's already in body_md; no duplicate emit.

    if body_md:
        front += [body_md, ""]
    else:
        front += ["_body extraction returned empty; see canonical URL_", ""]

    return "\n".join(front).rstrip() + "\n"


def save_post(post: dict, body_md: str) -> Path:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    path = OUT_DIR / post_filename(post)
    path.write_text(render_post_md(post, body_md), encoding="utf-8")
    return path


# ---------------------------------------------------------------- STATE

def load_state() -> dict:
    if not STATE_PATH.exists():
        return {}
    try:
        return json.loads(STATE_PATH.read_text("utf-8"))
    except Exception:
        return {}


def save_state(state: dict) -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    STATE_PATH.write_text(json.dumps(state, indent=2), encoding="utf-8")


# ---------------------------------------------------------------- INDEX

def rebuild_index() -> Path:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    entries = []
    for fp in OUT_DIR.glob("*.md"):
        if fp.name == "INDEX.md":
            continue
        text = fp.read_text("utf-8", errors="replace")
        front = {}
        m = re.match(r"---\n(.*?)\n---", text, re.DOTALL)
        if m:
            for line in m.group(1).split("\n"):
                kv = re.match(r"([a-zA-Z_]+):\s*(.*)", line)
                if kv:
                    front[kv.group(1)] = kv.group(2).strip().strip('"')
        entries.append({
            "file": fp.name,
            "date": front.get("date", ""),
            "title": front.get("title", fp.stem),
            "audience": front.get("audience", ""),
            "paywalled": front.get("paywalled", ""),
            "url": front.get("url", ""),
            "authors": front.get("authors", ""),
            "wordcount": front.get("wordcount", ""),
        })
    entries.sort(key=lambda x: x["date"], reverse=True)

    lines = [
        "# SemiAnalysis Archive Index",
        "",
        f"_{len(entries)} posts captured. "
        f"Generated {datetime.now(timezone.utc).isoformat()}._",
        "",
        "Editorial policy: SemiAnalysis is the macro reference. The Oracle "
        "cites it for any claim about hyperscaler compute, GPU economics, "
        "datacenter power, foundry capacity, memory pricing, lab unit "
        "economics. The Oracle does NOT cite SemiAnalysis for any "
        "Bittensor-specific claim. SemiAnalysis does not cover Bittensor; "
        "treat that absence as itself information.",
        "",
        "| Date | Title | Audience | Authors | File |",
        "| --- | --- | --- | --- | --- |",
    ]
    for e in entries:
        title_short = e["title"][:80].replace("|", " ")
        authors_short = e["authors"][:60].replace("|", " ")
        lines.append(
            f"| {e['date']} | [{title_short}]({e['url']}) | "
            f"{e['audience']} | {authors_short} | `{e['file']}` |"
        )
    INDEX_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return INDEX_PATH


# ---------------------------------------------------------------- DRIVER

def run(mode: str, limit: int | None) -> int:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    state = load_state()
    last_id = state.get("last_post_id") if mode == "incremental" else None
    auth_active = load_cookie_header() is not None

    print(f"[start] semianalysis crawler, mode={mode}, last_id={last_id}, "
          f"auth={'ON' if auth_active else 'off'}", file=sys.stderr)
    posts = walk_archive(stop_at_id=last_id)
    if limit is not None:
        posts = posts[:limit]
    print(f"  [archive] {len(posts)} posts to process", file=sys.stderr)

    # Prime the RSS cache once. Covers ~20 most recent posts in a
    # single request; saves bandwidth and adds a redundancy channel.
    rss_bodies = load_rss_bodies()

    saved = 0
    skipped = 0
    newest_id = state.get("last_post_id")

    for i, post in enumerate(posts, 1):
        fname = post_filename(post)
        path = OUT_DIR / fname
        if path.exists() and mode == "incremental":
            skipped += 1
            continue
        if path.exists() and mode == "upgrade-thin":
            # Only re-fetch posts whose existing body is below the
            # thin threshold. Used to resume a partial backfill
            # without redoing the already-rich files.
            try:
                existing = path.read_text("utf-8", errors="replace")
                body_only = re.sub(r"^.*?\n---\n\n",
                                   "", existing, count=1, flags=re.DOTALL)
                body_only = re.sub(r"^>.*\n", "", body_only, flags=re.MULTILINE)
                if len(body_only.strip()) >= THIN_BODY_CHARS:
                    skipped += 1
                    continue
            except Exception:
                pass

        audience = post.get("audience", "")
        paywalled = audience == "only_paid"
        canonical = post.get("canonical_url", "")
        tag = "paid" if paywalled else "free"

        if canonical:
            body_md, trail = best_effort_body(canonical, rss_bodies, paywalled)
        else:
            body_md, trail = "", []
        if not body_md:
            body_md = (post.get("truncated_body_text") or "").strip()
            trail.append(f"api-truncated:{len(body_md)}")

        print(f"  [{i}/{len(posts)}] ({tag}) {fname} -> {','.join(trail)}",
              file=sys.stderr)
        save_post(post, body_md)
        saved += 1

        if newest_id is None or post.get("id", 0) > newest_id:
            newest_id = post.get("id")

        time.sleep(POLITE_SLEEP)

    if newest_id:
        save_state({
            "last_post_id": newest_id,
            "last_run_at": datetime.now(timezone.utc).isoformat(),
            "mode": mode,
            "auth_used": auth_active,
        })

    rebuild_index()
    print(f"[done] saved={saved} skipped={skipped} index={INDEX_PATH.name}",
          file=sys.stderr)
    return 0


def corpus_stats() -> dict:
    """Audit the current corpus: per-post body length, paywall coverage,
    thinnest/richest. Useful for verifying a backfill actually
    improved things."""
    stats = {
        "total": 0, "paywalled": 0, "free": 0,
        "rich": 0, "thin": 0, "empty": 0,
        "total_body_chars": 0,
        "thinnest_paywalled": [], "richest_paywalled": [],
    }
    paywalled_sizes: list[tuple[int, str]] = []
    for fp in OUT_DIR.glob("*.md"):
        if fp.name == "INDEX.md":
            continue
        stats["total"] += 1
        text = fp.read_text("utf-8", errors="replace")
        m = re.match(r"---\n(.*?)\n---\n(.*)", text, re.DOTALL)
        if not m:
            continue
        front_raw, body = m.group(1), m.group(2)
        paywalled = "paywalled: true" in front_raw
        body_only = re.sub(r"^.*?\n---\n", "", body, count=1, flags=re.DOTALL)
        body_only = re.sub(r"^>.*\n", "", body_only, flags=re.MULTILINE)
        n = len(body_only.strip())
        stats["total_body_chars"] += n
        if paywalled:
            stats["paywalled"] += 1
            paywalled_sizes.append((n, fp.name))
        else:
            stats["free"] += 1
        if n == 0:
            stats["empty"] += 1
        elif n < THIN_BODY_CHARS:
            stats["thin"] += 1
        else:
            stats["rich"] += 1
    paywalled_sizes.sort()
    stats["thinnest_paywalled"] = paywalled_sizes[:5]
    stats["richest_paywalled"] = paywalled_sizes[-5:][::-1]
    return stats


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    g = parser.add_mutually_exclusive_group()
    g.add_argument("--backfill", action="store_true",
                   help="Walk the full archive, overwrite existing files")
    g.add_argument("--incremental", action="store_true",
                   help="Default. Fetch only posts newer than last run")
    g.add_argument("--upgrade-thin", action="store_true",
                   help="Re-fetch only posts whose existing body is "
                        "below the thin threshold. Useful to resume a "
                        "partial backfill")
    g.add_argument("--rebuild-index", action="store_true",
                   help="Regenerate INDEX.md from existing files, fetch nothing")
    g.add_argument("--stats", action="store_true",
                   help="Audit corpus coverage, fetch nothing")
    parser.add_argument("--limit", type=int, default=None,
                        help="Stop after N posts (testing)")
    args = parser.parse_args()

    if args.rebuild_index:
        path = rebuild_index()
        print(f"[done] rebuilt {path.relative_to(ROOT)}", file=sys.stderr)
        return 0

    if args.stats:
        s = corpus_stats()
        print(json.dumps(s, indent=2))
        return 0

    if args.backfill:
        mode = "backfill"
    elif args.upgrade_thin:
        mode = "upgrade-thin"
    else:
        mode = "incremental"
    return run(mode, args.limit)


if __name__ == "__main__":
    sys.exit(main())
