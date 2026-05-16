#!/usr/bin/env python3
"""
SUBNET ORACLE RESEARCH, DAILY AGENT
-----------------------------------------------------------------
Runs once a day from .github/workflows/daily-research.yml. Files
TWO articles to the SUBNET ORACLE RESEARCH category:

  1. SUBNET SPOTLIGHT, a deep dive on one subnet the human
     editorial desk has not covered recently
  2. ECOSYSTEM STATE, a synthesis of where the network is right
     now (markets, ships, capital, comparators)

Editorial standard, hard-coded into the system prompt:
  - PhD-level mechanism-aware analysis, not journalism
  - Hedge uncertainty; treat vendor claims as upper-bound
  - Distinguish signal from noise; absence of signal IS signal
  - NEVER use em-dashes; use commas, semicolons, or restructure
  - Cite sources; use real subnet names, real numbers, real mechanism

Deduplication, before calling Claude:
  - Read the human articles in src/data/articles.js, extract every
    `subnet: 'NN'` so we never pick a subnet the human desk owns
  - Read the past 30 days of Oracle subnet spotlights so we rotate
    coverage and don't double-dip our own work

Required environment:
  ANTHROPIC_API_KEY    set as a repository secret in GitHub

Usage:
  python scripts/daily-research.py
"""

from __future__ import annotations

import json
import os
import re
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone, timedelta
from pathlib import Path

import anthropic

ROOT = Path(__file__).resolve().parents[1]
DATA_FILE       = ROOT / "src" / "data" / "oracle-articles.js"
HUMAN_ARTICLES  = ROOT / "src" / "data" / "articles.js"

MODEL = "claude-opus-4-7"

SYSTEM_PROMPT = """\
You are the autonomous research agent for Subneτ Magazine, a research \
terminal for the Bittensor network. You file TWO articles each day in \
the SUBNET ORACLE RESEARCH category, distinct from the human-written \
magazine articles.

EDITORIAL STANDARD, NON-NEGOTIABLE:

1. PhD-level mechanism-aware analysis. When you cite a number, name the \
mechanism that generates it. When you cannot, say so explicitly.

2. Distinguish signal from noise. Absence of signal IS signal; quiet days \
are quiet days. Do not manufacture narrative.

3. Hedge uncertainty explicitly. If a vendor claim has not been \
independently verified, write that the desk treats it as upper-bound. \
If a number is implied rather than measured, mark it as implied.

4. ABSOLUTELY NEVER USE EM-DASHES (—) OR EN-DASHES (–). Use commas, \
semicolons, or restructure the sentence. Hyphens in compound words \
(cross-subnet, post-mortem) are fine. Hard editorial rule, no exceptions.

5. Real subnet names, real netuids, real mechanism. No marketing \
language. The desk's voice is dry, precise, confident in its calibration.

6. Do NOT cover any subnet listed under AVOID below. The human editorial \
desk owns those subjects; never duplicate their coverage.

ARTICLES YOU FILE:

A. SUBNET SPOTLIGHT (600 to 900 words across 3 to 5 sections)
   Pick ONE subnet not in the AVOID list. Cover what it does \
mechanistically, what its on-chain footprint looks like today, why a \
sophisticated reader should care, and what to walk away with.

B. ECOSYSTEM STATE (500 to 800 words across 3 to 5 sections)
   A synthesis: network state (emission, alpha-MCAPs, validator \
behavior), notable ships, capital flow, centralized comparator if \
dated events are imminent, and a "read of the day" closing section.

OUTPUT FORMAT: respond with ONLY a single JSON object matching this \
schema, no prose before or after, no markdown code fences:

{
  "subnetSpotlight": {
    "subnetId":   <int>,
    "subnetName": "<string>",
    "title":      "<one wire-lead sentence, no period at end>",
    "dek":        "<one to two sentence summary>",
    "sections":   [{"h": "<heading>", "body": "<200 to 400 words>"}],
    "sources":    [{"label": "<citation>", "url": "https://..."}]
  },
  "ecosystemState": {
    "title":    "<one wire-lead sentence, no period at end>",
    "dek":      "<one to two sentence summary>",
    "sections": [{"h": "<heading>", "body": "<150 to 300 words>"}],
    "sources":  [{"label": "<citation>", "url": "https://..."}]
  }
}
"""


def fetch_market_context() -> str:
    """Pull a minimal Bittensor market snapshot from the TAO Market Cap
    public API to ground the brief in real numbers. Returns a short
    plain-text summary; if the fetch fails we return an empty string."""
    try:
        req = urllib.request.Request(
            "https://api.taomarketcap.com/api/subnets",
            headers={"User-Agent": "subnet-magazine-oracle/1.0"},
        )
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except (urllib.error.URLError, json.JSONDecodeError, TimeoutError) as e:
        print(f"[warn] market context fetch failed: {e}", file=sys.stderr)
        return ""

    if not isinstance(data, list) or not data:
        return ""

    movers = sorted(
        (s for s in data if isinstance(s.get("price_change_24h"), (int, float))),
        key=lambda s: abs(s.get("price_change_24h", 0)),
        reverse=True,
    )[:10]

    lines = ["LIVE MARKET SNAPSHOT (top 10 by |24h move|):"]
    for s in movers:
        netuid = s.get("netuid", "?")
        name = s.get("name", "?")
        chg = s.get("price_change_24h", 0)
        price = s.get("price", 0)
        lines.append(f"  SN{netuid} {name}: {chg:+.2f}%, alpha=${price:.4f}")
    return "\n".join(lines)


def human_covered_subnets() -> list[int]:
    """Extract every netuid the human editorial desk has covered, by
    regex over articles.js. We intentionally avoid all of them, ever.
    The human desk OWNS those subjects."""
    if not HUMAN_ARTICLES.exists():
        return []
    src = HUMAN_ARTICLES.read_text(encoding="utf-8")
    nums = re.findall(r"subnet:\s*'(\d+)'", src)
    return sorted(set(int(n) for n in nums))


def recent_oracle_subnets(days: int = 30) -> list[int]:
    """Extract every subnet ID the Oracle itself has covered in the
    last N days. Used to rotate coverage, not to forbid."""
    if not DATA_FILE.exists():
        return []
    src = DATA_FILE.read_text(encoding="utf-8")
    cutoff = (datetime.now(timezone.utc) - timedelta(days=days)).strftime("%Y-%m-%d")
    out = []
    for block in re.finditer(
        r"date:\s*'(\d{4}-\d{2}-\d{2})'.*?subnetId:\s*(\d+)",
        src, re.DOTALL,
    ):
        date, netuid = block.group(1), int(block.group(2))
        if date >= cutoff:
            out.append(netuid)
    return out


def build_user_prompt(date_str: str) -> str:
    avoid_human  = human_covered_subnets()
    avoid_oracle = recent_oracle_subnets(days=30)
    market       = fetch_market_context()

    avoid_lines = []
    if avoid_human:
        avoid_lines.append(
            f"AVOID (human editorial desk owns these): "
            f"SN{', SN'.join(str(n) for n in avoid_human)}"
        )
    if avoid_oracle:
        avoid_lines.append(
            f"ROTATE AWAY FROM (Oracle covered in last 30d): "
            f"SN{', SN'.join(str(n) for n in avoid_oracle)}"
        )

    prompt = f"Today is {date_str}. File the Subneτ Oracle Research for today.\n\n"
    if avoid_lines:
        prompt += "\n".join(avoid_lines) + "\n\n"
    if market:
        prompt += market + "\n\n"
    prompt += (
        "Pick a subnet from outside the AVOID list for the SUBNET SPOTLIGHT. "
        "Cover something today (a ship, an incident, an institutional move, "
        "a measurable shift). For ECOSYSTEM STATE, give the synthesis: what "
        "matters across the network today and what the read is. Remember: "
        "NEVER use em-dashes. Output only the JSON object."
    )
    return prompt


def call_claude(date_str: str) -> dict:
    """Call Claude Opus 4.7 with structured output, get back the
    parsed JSON with two articles."""
    client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY from env

    user_prompt = build_user_prompt(date_str)

    article_schema = {
        "type": "object",
        "properties": {
            "title":    {"type": "string"},
            "dek":      {"type": "string"},
            "sections": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "h":    {"type": "string"},
                        "body": {"type": "string"},
                    },
                    "required": ["h", "body"],
                    "additionalProperties": False,
                },
            },
            "sources": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "label": {"type": "string"},
                        "url":   {"type": "string"},
                    },
                    "required": ["label", "url"],
                    "additionalProperties": False,
                },
            },
        },
        "required": ["title", "dek", "sections"],
        "additionalProperties": False,
    }
    subnet_article_schema = {
        **article_schema,
        "properties": {
            **article_schema["properties"],
            "subnetId":   {"type": "integer"},
            "subnetName": {"type": "string"},
        },
        "required": ["subnetId", "subnetName", "title", "dek", "sections"],
    }

    response = client.messages.create(
        model=MODEL,
        max_tokens=16000,
        # Adaptive thinking is required on Opus 4.7; budget_tokens is removed.
        thinking={"type": "adaptive"},
        output_config={
            "effort": "high",
            "format": {
                "type": "json_schema",
                "schema": {
                    "type": "object",
                    "properties": {
                        "subnetSpotlight": subnet_article_schema,
                        "ecosystemState":  article_schema,
                    },
                    "required": ["subnetSpotlight", "ecosystemState"],
                    "additionalProperties": False,
                },
            },
        },
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_prompt}],
    )

    text_block = next((b.text for b in response.content if b.type == "text"), "")
    if not text_block:
        raise RuntimeError("Claude returned no text content")

    parsed = json.loads(text_block)
    return scrub_dashes(parsed)


def scrub_dashes(obj):
    """Belt-and-suspenders: strip every em-dash and en-dash regardless
    of what the model returned. System prompt forbids them; enforce here
    too."""
    if isinstance(obj, str):
        return re.sub(r"\s*[—–]\s*", ", ", obj)
    if isinstance(obj, list):
        return [scrub_dashes(x) for x in obj]
    if isinstance(obj, dict):
        return {k: scrub_dashes(v) for k, v in obj.items()}
    return obj


def js_escape(s: str) -> str:
    """JS string-literal escape for single-quoted output."""
    return (
        s.replace("\\", "\\\\")
         .replace("'", "\\'")
         .replace("\n", "\\n")
         .strip()
    )


def slugify(s: str, n: int = 50) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")
    return s[:n] or "untitled"


def render_article(date_str: str, kind: str, art: dict) -> str:
    """Render a single article as a JS object literal matching the
    shape used in src/data/oracle-articles.js."""
    if kind == "subnet-spotlight":
        sn  = art["subnetId"]
        nm  = slugify(art["subnetName"])
        aid = f"oracle-{date_str}-sn{sn}-{nm}"
    else:
        aid = f"oracle-{date_str}-ecosystem"

    lines = ["  {"]
    lines.append(f"    id: '{aid}',")
    lines.append(f"    date: '{date_str}',")
    lines.append(f"    kind: '{kind}',")
    if kind == "subnet-spotlight":
        lines.append(f"    subnetId: {int(art['subnetId'])},")
        lines.append(f"    subnetName: '{js_escape(art['subnetName'])}',")
    lines.append(f"    title: '{js_escape(art['title'])}',")
    lines.append(f"    dek: '{js_escape(art['dek'])}',")
    lines.append("    sections: [")
    for sec in art.get("sections", []):
        lines.append(f"      {{ h: '{js_escape(sec['h'])}',")
        lines.append(f"        body: '{js_escape(sec['body'])}' }},")
    lines.append("    ],")
    sources = art.get("sources") or []
    if sources:
        lines.append("    sources: [")
        for s in sources:
            lines.append(
                f"      {{ label: '{js_escape(s['label'])}', "
                f"url: '{js_escape(s['url'])}' }},"
            )
        lines.append("    ],")
    lines.append("    generatedBy: 'claude-opus-4-7',")
    lines.append("  },")
    return "\n".join(lines)


def prepend_articles(date_str: str, payload: dict) -> int:
    """Insert both articles at the front of the ORACLE_ARTICLES array.
    Returns count of articles actually inserted (0 if today's exist)."""
    src = DATA_FILE.read_text(encoding="utf-8")
    marker = "export const ORACLE_ARTICLES = Object.freeze(["
    idx = src.find(marker)
    if idx < 0:
        raise RuntimeError(f"could not find ORACLE_ARTICLES marker in {DATA_FILE}")

    insert_at = idx + len(marker)

    if f"date: '{date_str}'" in src:
        print(f"[skip] oracle articles for {date_str} already exist", file=sys.stderr)
        return 0

    new_block = (
        "\n"
        + render_article(date_str, "subnet-spotlight", payload["subnetSpotlight"])
        + "\n\n"
        + render_article(date_str, "ecosystem-state",  payload["ecosystemState"])
    )
    out = src[:insert_at] + new_block + src[insert_at:]
    DATA_FILE.write_text(out, encoding="utf-8")
    print(f"[ok] prepended 2 oracle articles for {date_str}")
    return 2


def main() -> int:
    if not os.environ.get("ANTHROPIC_API_KEY"):
        print("ANTHROPIC_API_KEY is not set", file=sys.stderr)
        return 2

    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    print(f"[start] subnet oracle research for {today}")

    try:
        payload = call_claude(today)
    except Exception as e:
        print(f"[fail] Claude call: {e}", file=sys.stderr)
        return 1

    try:
        prepend_articles(today, payload)
    except Exception as e:
        print(f"[fail] write: {e}", file=sys.stderr)
        return 1

    return 0


if __name__ == "__main__":
    sys.exit(main())
