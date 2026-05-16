#!/usr/bin/env python3
"""
SUBNET MAGAZINE, DAILY RESEARCH AGENT
-----------------------------------------------------------------
Runs once a day from .github/workflows/daily-research.yml. Calls
Claude Opus 4.7 to file a PhD-level objective brief on what
happened in the Bittensor ecosystem that day. Prepends the brief
to src/data/research.js. The workflow then commits and pushes.

Editorial standard, hard-coded into the system prompt:
  - PhD-level mechanism-aware analysis, not journalism
  - Quantitative when quantitative is honest, hedged otherwise
  - Distinguish signal from noise; absence of signal IS signal
  - NEVER use em-dashes; use commas or restructure the sentence
  - Cite sources; treat vendor claims as upper-bound until verified

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
from datetime import datetime, timezone
from pathlib import Path

import anthropic

ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "src" / "data" / "research.js"

MODEL = "claude-opus-4-7"

SYSTEM_PROMPT = """\
You are the autonomous research agent for Subneτ Magazine, a research \
terminal for the Bittensor network. You file one ecosystem brief per day.

EDITORIAL STANDARD, NON-NEGOTIABLE:

1. PhD-level objective analysis. Mechanism-aware: explain WHY something \
happened, not just WHAT. When you cite a number, name the mechanism that \
generates it. When you cannot, say so explicitly.

2. Distinguish signal from noise. Absence of signal IS signal; record \
quiet days as quiet days and explain why the quiet is informative. Do not \
manufacture narrative.

3. Hedge uncertainty explicitly. If a vendor claim has not been \
independently verified, write that the desk treats it as upper-bound. If \
a number is implied rather than measured, mark it as implied. Never \
present a guess as a measurement.

4. Quantitative when quantitative is honest. Use specific basis-point \
moves, p50 latencies, emission deltas, validator counts. Do not invent \
precision you do not have.

5. Consider second-order effects. A subnet ships a feature, who else in \
the stack is affected, what does it imply about the network's trajectory.

6. ABSOLUTELY NEVER USE EM-DASHES (—) OR EN-DASHES (–). Use commas, \
semicolons, or restructure the sentence. Hyphens in compound words \
(cross-subnet, post-mortem) are fine. This is a hard editorial rule \
and there are no exceptions.

7. No marketing-adjacent language. No "exciting", no "game-changer", no \
"revolutionary". The desk's voice is dry, precise, and confident in its \
calibration.

OUTPUT FORMAT: respond with ONLY a single JSON object matching this \
schema, no prose before or after, no markdown code fences:

{
  "headline":  "one wire-lead sentence summarizing the day, no period at end",
  "summary":   "one paragraph, two to four sentences, the synthesis the rest of the brief supports",
  "movers":    [
    { "ticker": "SN##", "name": "...", "change": "+X.X%", "note": "one short clause, mechanism not vibes" }
  ],
  "sections":  [
    { "h": "section heading, three to seven words", "body": "200 to 400 words of mechanism-aware analysis" }
  ],
  "sources":   [
    { "label": "human-readable citation", "url": "https://..." }
  ]
}

Aim for 3 to 5 sections, 2 to 5 movers, 2 to 4 sources. If the day is \
genuinely quiet across the entire ecosystem, file a shorter brief that \
says so honestly rather than padding."""

USER_PROMPT_TEMPLATE = """\
Today's date is {date}. File the Subneτ Magazine daily research brief.

Cover, where relevant to today specifically:
  - Bittensor protocol and Opentensor Foundation activity
  - Notable subnet ships, incidents, or operational events (SN1-SN100+)
  - Validator rotations, weight anomalies, emission curve behavior
  - dTAO bonding curve activity and any unusual α-token flow
  - Institutional wallet activity (Polychain, Yuma Holdings, Foundry, etc.)
  - Centralized comparator: frontier-lab releases that affect the \
deAI thesis, NVIDIA / AMD / TSMC if dated, Asian AI session if relevant

If you do not have verifiable information for a topic, omit it. Do not \
speculate to fill space. Remember: NEVER use em-dashes. Output only the \
JSON object."""


def fetch_market_context() -> str:
    """Pull a minimal Bittensor market snapshot from the TAO Market Cap
    public API to ground the brief in real numbers. Returns a short
    plain-text summary; if the fetch fails we return an empty string
    and the agent files without it."""
    try:
        req = urllib.request.Request(
            "https://api.taomarketcap.com/api/subnets",
            headers={"User-Agent": "subnet-magazine-research-agent/1.0"},
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
    )[:8]

    lines = ["Market snapshot, top 8 by |24h move|:"]
    for s in movers:
        netuid = s.get("netuid", "?")
        name = s.get("name", "?")
        chg = s.get("price_change_24h", 0)
        price = s.get("price", 0)
        lines.append(f"  SN{netuid} {name}: {chg:+.2f}%, alpha=${price:.4f}")
    return "\n".join(lines)


def call_claude(date_str: str) -> dict:
    """Call Claude with the system prompt + today's user prompt + market
    context, get back the parsed JSON brief."""
    client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY from env

    market_context = fetch_market_context()
    user_prompt = USER_PROMPT_TEMPLATE.format(date=date_str)
    if market_context:
        user_prompt += "\n\n" + market_context

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
                        "headline": {"type": "string"},
                        "summary": {"type": "string"},
                        "movers": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "ticker": {"type": "string"},
                                    "name": {"type": "string"},
                                    "change": {"type": "string"},
                                    "note": {"type": "string"},
                                },
                                "required": ["ticker", "name", "change"],
                                "additionalProperties": False,
                            },
                        },
                        "sections": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "h": {"type": "string"},
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
                                    "url": {"type": "string"},
                                },
                                "required": ["label", "url"],
                                "additionalProperties": False,
                            },
                        },
                    },
                    "required": ["headline", "summary", "sections"],
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

    brief = json.loads(text_block)
    return scrub_dashes(brief)


def scrub_dashes(obj):
    """Belt-and-suspenders pass: strip every em-dash and en-dash from the
    brief, regardless of what the model returned. The system prompt
    forbids them, but enforce it here as well."""
    if isinstance(obj, str):
        # em-dash with optional surrounding space, replace with comma + space
        s = re.sub(r"\s*[—–]\s*", ", ", obj)
        return s
    if isinstance(obj, list):
        return [scrub_dashes(x) for x in obj]
    if isinstance(obj, dict):
        return {k: scrub_dashes(v) for k, v in obj.items()}
    return obj


def js_escape(s: str) -> str:
    """Minimal JS string-literal escape for single-quoted output. The
    fields are short enough that we do not need full unicode escapes."""
    return s.replace("\\", "\\\\").replace("'", "\\'").replace("\n", " ").strip()


def render_brief_entry(date_str: str, brief: dict) -> str:
    """Render a single brief as a JS object literal, matching the shape
    used in src/data/research.js."""
    lines = ["  {"]
    lines.append(f"    date: '{date_str}',")
    lines.append(f"    headline: '{js_escape(brief['headline'])}',")
    lines.append(f"    summary: '{js_escape(brief['summary'])}',")

    movers = brief.get("movers") or []
    if movers:
        lines.append("    movers: [")
        for m in movers:
            note_field = f", note: '{js_escape(m.get('note', ''))}'" if m.get("note") else ""
            lines.append(
                f"      {{ ticker: '{js_escape(m['ticker'])}', "
                f"name: '{js_escape(m['name'])}', "
                f"change: '{js_escape(m['change'])}'{note_field} }},"
            )
        lines.append("    ],")

    lines.append("    sections: [")
    for s in brief.get("sections", []):
        lines.append(
            f"      {{ h: '{js_escape(s['h'])}',"
        )
        lines.append(f"        body: '{js_escape(s['body'])}' }},")
    lines.append("    ],")

    sources = brief.get("sources") or []
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


def prepend_to_data_file(date_str: str, brief: dict) -> None:
    """Insert the new brief as the first entry in the BRIEFS array."""
    src = DATA_FILE.read_text(encoding="utf-8")
    marker = "export const BRIEFS = Object.freeze(["
    idx = src.find(marker)
    if idx < 0:
        raise RuntimeError(f"could not find BRIEFS marker in {DATA_FILE}")

    insert_at = idx + len(marker)

    if f"date: '{date_str}'" in src:
        print(
            f"[skip] brief for {date_str} already exists in {DATA_FILE.name}",
            file=sys.stderr,
        )
        return

    new_entry = "\n" + render_brief_entry(date_str, brief)
    out = src[:insert_at] + new_entry + src[insert_at:]
    DATA_FILE.write_text(out, encoding="utf-8")
    print(f"[ok] prepended brief for {date_str} to {DATA_FILE.name}")


def main() -> int:
    if not os.environ.get("ANTHROPIC_API_KEY"):
        print("ANTHROPIC_API_KEY is not set", file=sys.stderr)
        return 2

    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    print(f"[start] daily research brief for {today}")

    try:
        brief = call_claude(today)
    except Exception as e:
        print(f"[fail] Claude call: {e}", file=sys.stderr)
        return 1

    try:
        prepend_to_data_file(today, brief)
    except Exception as e:
        print(f"[fail] write: {e}", file=sys.stderr)
        return 1

    return 0


if __name__ == "__main__":
    sys.exit(main())
