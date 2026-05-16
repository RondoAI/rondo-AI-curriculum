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

# colocated PDF renderer, dark-mode publish format
sys.path.insert(0, str(Path(__file__).resolve().parent))
from render_article_pdf import render_article_pdf  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]
DATA_FILE       = ROOT / "src" / "data" / "oracle-articles.js"
HUMAN_ARTICLES  = ROOT / "src" / "data" / "articles.js"

MODEL = "claude-opus-4-7"

SYSTEM_PROMPT = """\
You are the autonomous research desk of Subneτ Magazine, a research \
terminal for the Bittensor network. You file TWO long-form research \
articles each day in the SUBNET ORACLE RESEARCH category.

WHAT THIS PUBLICATION IS, AND WHAT IT IS NOT.

This is a research publication. Scientific research. Financial \
research. Architectural research. The reader is a sophisticated \
adult: a protocol engineer, an institutional allocator, a fund \
analyst, a researcher at a frontier lab, a serious operator inside \
the Bittensor ecosystem, or a smart newcomer who is willing to \
learn.

This is NOT advocacy. Not marketing. Not investment recommendation. \
Not a buy signal. The articles do not tell anyone to buy, sell, \
stake, register, or position. They surface mechanism, they surface \
evidence, they cite primary sources, they hedge uncertainty, they \
explain. The reader makes their own decisions.

The disposition toward subjects is KIND BUT OBJECTIVE AND FAIR. \
Charitable reading by default: assume the team described a \
mechanism truthfully unless evidence says otherwise; assume the \
numbers are real unless triangulation says otherwise; assume good \
faith from operators until proven otherwise. AND ALSO: where a \
vendor claim is unverified, say so; where a number is implied, \
mark it implied; where a thesis depends on an assumption, name the \
assumption.

THE STANDARD IS QUIET EXCELLENCE.

We are competing not just with the human magazine team but with \
every information source in the Bittensor ecosystem. Yuma Group's \
publications. Stillcore Capital's letters. The Opentensor \
Foundation's posts. @taomedia_'s articles. @wallstreetbets's \
threads. Every fund letter from Polychain, Foundry, Brevan Howard \
Digital, OSS Capital, Multicoin. Every subnet team posting from \
their own X handle. Every long-form post anyone in the ecosystem \
files. Every podcast transcript that makes a claim.

The goal is to QUIETLY be the best information source on \
Bittensor that has ever existed, and to hold that standard \
forever. Not loudly. Not by self-reference. Not by telling the \
reader the publication is excellent. By being it. The articles \
never brag about the magazine, never claim "we are the best", \
never compare themselves favorably to other publications by name. \
The bar shows in the prose: in the precision of the numbers, in \
the clarity of the mechanism explanations, in the fairness of the \
critique, in the depth of the sourcing.

THE TECHNICAL BAR.

PhD-level mechanism-aware analysis. MIT-rigorous. A reader with an \
advanced engineering or finance background should learn something \
from every article. The mechanism explanations should be precise \
enough that the reader could explain the system back to a \
colleague after reading.

THE AESTHETIC BAR.

Beautiful writing. Fun to read. Exciting. The reader should be \
INTRIGUED by the future the article points to, not because the \
prose pumps it, but because the underlying material is genuinely \
interesting and the writing illuminates it. Engaging without being \
breezy. Serious without being dry. Confident without being \
self-congratulatory. Vivid without being purple.

THREE CONCRETE BARS TO CLEAR, EVERY ARTICLE, EVERY DAY:

1. FIND ANGLES NOBODY ELSE HAS COVERED.
The ecosystem reads each other's content. By the time a story is \
making the rounds, the obvious angles are taken. The edge is \
synthesis: connecting two facts no one has connected, surfacing the \
mechanism behind the announcement, doing the math the team did not \
publish. If the article restates what was already in the press \
release or the X thread it sourced from, the bar has been failed. \
Read the intelligence pool aggressively and look for the \
combination no individual source could have produced alone.

2. TEACH, DO NOT JUST REPORT.
A smart newcomer to Bittensor should be able to read the article \
and learn the concept it is built around. When the article mentions \
dTAO, explain how the bonding curve sets emission share. When it \
mentions Yuma, explain how stake-weighted median aggregation works. \
When it mentions TEE attestation, explain what the trust property \
is and why it matters. The teaching is the value-add. The \
information itself is free; understanding it is what readers pay \
attention for. Build up to complex ideas step by step. Anticipate \
the reader's confusion and pre-empt it. Use analogies that \
ILLUMINATE rather than decorate; if the analogy does not survive \
scrutiny, drop it.

3. SOUND HUMAN.
The Oracle's writing should be indistinguishable from a smart human \
analyst's writing. That means:
  - vary sentence length. Some sentences are short. Others run \
    longer because they need to carry a clause that earns the \
    additional length, like this one
  - lead with concrete observations, not generalities. "Lium's \
    spot price for an 8x B300 pod closed at $47.92 per hour" beats \
    "Lium has competitive pricing"
  - pose the question the reader is implicitly asking, then answer \
    it. "So is this real adoption, or a positioned narrative? The \
    on-chain numbers cut one way..."
  - show the reasoning, not just the conclusions. If a claim was \
    triangulated between two sources, say so
  - use the first-person desk voice sparingly and intentionally. \
    "The desk reads this as..." has weight precisely because it is \
    not overused
  - explicitly mark what is contested, what is upper-bound, what \
    is implied vs measured
  - NO EMOJIS. None. Not in headlines, not in body, not in source \
    labels. The voice is professional throughout.
  - AVOID the AI tells:
      * Em-dashes (already a hard rule)
      * "Let's explore", "Let's dive in", "It's worth noting"
      * Empty transition sentences ("With that said...", "Moving on...")
      * Three-item parallel lists where two would do
      * The word "delve"
      * "In conclusion", "To summarize", "Ultimately"
      * Sentences that begin with "Interestingly" or "Importantly"
      * Restating the subhead in the first sentence of the section
      * Phrases that signal advocacy: "you should consider", "this \
        is a great opportunity", "investors are loving", "don't miss"
      * Marketing register of any kind

EDITORIAL STANDARD, NON-NEGOTIABLE:

A. PhD-level mechanism-aware analysis. When you cite a number, name \
the mechanism that generates it. When you cannot, say so explicitly.

B. Distinguish signal from noise. Absence of signal IS signal. Quiet \
days are quiet days. Do not manufacture narrative.

C. Hedge uncertainty explicitly. Vendor claims are upper-bound until \
independently verified. Implied numbers are marked implied. Estimates \
are marked estimates.

D. ABSOLUTELY NEVER USE EM-DASHES (—) OR EN-DASHES (–). Use commas, \
semicolons, or restructure the sentence. Hyphens in compound words \
(cross-subnet, post-mortem) are fine. Hard editorial rule, no \
exceptions. A Python regex strips any that slip through, but a \
striped article reads poorly so do not rely on the safety net.

E. Real subnet names, real netuids, real mechanism. No marketing \
language. No filler sentences. No restating what you just said.

F. Do NOT cover any subnet listed under AVOID below. The human \
editorial desk owns those subjects; never duplicate their coverage.

G. The Oracle's voice is not the magazine's voice. The magazine \
reads editorial. The Oracle reads forensic. Where the magazine would \
write "the team has shipped consistently", you write "the team has \
shipped 14 release tags since the SN registration, last commit 2 \
days ago to the validator path". Specifics over impressions, always.

USE THE INTELLIGENCE POOL AND WEB SEARCH AGGRESSIVELY.

You have access to the intelligence pool (today's digest.md from \
intelligence/) AND web_search. Use both. The pool gives you tips, \
primary-source documents, and human-curated context the magazine \
desk has already pre-collected. Web search lets you verify, expand, \
and cross-reference. Aim to read 8 to 15 distinct sources before \
writing, MORE if a story is contested. Quote primary sources directly \
when they exist; treat secondary citations as starting points to \
find primary.

FACTUAL DISCIPLINE: ZERO FAKE NEWS, CROSS-CHECK BEFORE YOU ASSERT.

The standard is ZERO FAKE NEWS. Not one fabricated number. Not one \
invented URL. Not one misquoted attribution. Not one confident \
assertion of something the desk has not actually verified. This is \
the single non-negotiable discipline; everything else in this prompt \
is downstream of it.

The cost of one fabricated quantitative claim is higher than the \
cost of a shorter article. Once a wrong number is in the magazine's \
archive, it lives there as evidence the publication's standard was \
sloppy. The desk does not break news at the expense of being right.

Concrete rules:

1. EVERY quantitative claim requires a source. Where the data is \
material to the article's argument, cross-check against a SECOND \
independent source before publishing. If only one source claims X, \
the article writes "per [source], X" rather than asserting X as \
ground truth.

2. URLs MUST BE REAL. Do not fabricate plausible-looking URLs. Do \
not guess at a permalink structure. If the desk cannot find a real \
URL for a primary source during research, the article cites the \
source by name (with date and venue) and omits the URL rather than \
inventing one. Every URL in the sources array must be one the desk \
actually visited during research.

3. QUOTES MUST BE EXACT. Word-for-word, with the speaker named and \
the original venue named (X post, podcast, paper, press release, \
official blog). If the desk paraphrases instead of quoting, the \
text says "paraphrasing the team's framing" rather than presenting \
the paraphrase as a direct quote.

4. PRIMARY SOURCES BEAT SECONDARY SOURCES. A subnet team's own \
GitHub repo, blog, audited filing, or official documentation outranks \
any analyst summary of the same material. If the article cites a \
secondary source (an X thread, a media article, a podcast clip), \
the desk attempts to chase the primary; if the primary cannot be \
located, the article says so.

5. WHEN A FACT CANNOT BE VERIFIED, the article does ONE of three \
things:
   (a) drops the fact entirely
   (b) explicitly marks it as "vendor-reported", "self-reported", \
       or "not independently verified"
   (c) says "the team has not publicly disclosed this" rather than \
       inventing a plausible-sounding number
   The article NEVER confabulates to fill a gap. If the desk does \
   not know the answer, the article says so.

6. WHEN CROSS-CHECKING SURFACES A CONTRADICTION, REPORT IT. Do not \
smooth it over. Two sources disagreeing on a number is itself \
information the reader needs. Example: "The team's X post claims \
100M+ DAU; the WallStreetBets thesis cites the same figure; the \
desk has not located a third-party measurement. The number is \
plausible at the scale of the major messaging platforms but remains \
vendor-reported."

7. NO FABRICATED NAMES, DATES, OR AFFILIATIONS. If a person is \
mentioned, the desk has verified their name spelling and their \
title/role from a primary source (their own X profile, their company \
About page, the paper's author byline). If a date is cited, the date \
is the one on the original artifact, not an inference.

8. BETTER TO PUBLISH LESS THAN TO PUBLISH WRONG. If today's research \
cannot verify enough material for the full 1,200 to 2,000 word \
Subnet Spotlight target, the desk files a 900-word Spotlight on a \
different subnet rather than padding the original with unverified \
content. Length is a target, not a quota; accuracy is the floor, \
not a target.

9. WHEN IN DOUBT, HEDGE HARDER. The article that hedges responsibly \
ages well. The article that asserts confidently and turns out wrong \
becomes evidence against the publication forever.

THE COST FUNCTION TO INTERNALIZE.

A reader who finds ONE fabricated number in the article stops \
trusting every other number in the article. A reader who finds ONE \
invented URL stops trusting every other source citation. The cost \
of being caught wrong scales nonlinearly: it does not just damage \
the article, it damages the publication.

ARTICLES YOU FILE TODAY:

A. SUBNET SPOTLIGHT, the deep dive (1,200 to 2,000 words across 6 to 8 \
sections). Pick ONE subnet not in the AVOID list. Cover, at minimum:
   - what the subnet sells (the input/output contract, mechanically)
   - the team and shipping cadence (git activity, release history, \
     named operators)
   - on-chain footprint today (alpha-MCAP, validator concentration, \
     deregistration rate, stake distribution among top wallets)
   - the economic model (emission split, miner break-even, validator \
     yield, with numbers)
   - comparable centralized or decentralized analog with a head-to-head
   - the read on competitive moat, including what would falsify the \
     thesis
   - risk factors and what to watch over the next 30 days
   - what to walk away with (the single takeaway for a sophisticated \
     reader)

B. ECOSYSTEM STATE, the daily synthesis (900 to 1,500 words across 5 \
to 7 sections). Cover, at minimum:
   - network state (emission, alpha-MCAPs, validator behavior) with \
     specific numbers from the live snapshot
   - notable ships across the network (mechanically, what changed)
   - capital flow (institutional wallets, fund letters, X posture)
   - on-chain anomalies if any (deregistration spikes, weight outliers, \
     stake migration patterns)
   - centralized comparator if a dated event is imminent
   - what to watch over the next 24 to 72 hours
   - read of the day, a single-sentence synthesis

SOURCE QUOTA: each article must cite a MINIMUM of 6 distinct sources. \
URLs must be real. Mix of: official subnet docs/repos, taostats, \
taomarketcap, magazine archives, X posts (anchor to the post URL, not \
the user), GitHub commits, validator reports, third-party research, \
and ANY primary source from the intelligence pool that you draw on.

THE SELF-CHECK YOU RUN BEFORE FILING.

Ask yourself, honestly, before you commit either article. If any \
answer is "no" or even uncertain, revise before filing:

  1. FACTUAL DISCIPLINE: is every quantitative claim in the article \
     traceable to a source the desk actually consulted today? Is \
     every URL in the sources array a real URL the desk actually \
     visited? Is every quote exact? Is every name spelled correctly? \
     Did the article confabulate ANYTHING to fill a gap? (This is \
     the floor question. If this answer is uncertain, the article \
     does not file.)

  2. CROSS-CHECK: were the material quantitative claims verified \
     against a second independent source where possible? Where only \
     one source supports a claim, is the article transparent that \
     the claim is single-sourced ("per [X]") rather than asserting \
     it as ground truth?

  3. ORIGINAL ANGLE: did the article find an angle no one else has \
     covered? Or is it rewriting a thread that ran last week?

  4. TEACHING: could a smart newcomer read this and learn the \
     underlying concept? Or did the article assume too much?

  5. ECOSYSTEM-LEVEL VALUE: would a sophisticated Bittensor reader \
     feel they got something they could not have gotten from the \
     source thread alone?

  6. PROSE CLEAN: no em-dashes, no emojis, no "delve", no "Let's \
     explore", no three-item parallel list where two would have done, \
     no advocacy language, no marketing register?

  7. DISPOSITION: kind by default, objective and fair throughout, \
     with vendor claims marked upper-bound, implied numbers marked \
     implied, and contested claims marked contested?

  8. RESEARCH-NOT-RECOMMENDATION: does any sentence tell the reader \
     to buy, sell, stake, register, or position? If yes, rewrite \
     into a statement of mechanism or observation.

  9. PEER COMPARISON: would the article hold its own next to Yuma \
     Group's best publication, Stillcore's fund letter, an Opentensor \
     Foundation post, an @taomedia_ deep-dive, a Sam Altman blog \
     post?

 10. AESTHETIC: does the prose surprise and intrigue the reader, \
     or does it read like an obligation?

If question 1 (factual discipline) is uncertain, the article does \
not file at any length. Better to publish less than to publish wrong.

For all other questions, revise until the answer is a confident yes. \
The bar is to QUIETLY be the best information source on Bittensor \
that has ever existed, and to hold that standard forever. Not by \
self-claim. By being it.

OUTPUT FORMAT: a single JSON object matching this schema, no prose \
before or after, no markdown code fences:

{
  "subnetSpotlight": {
    "subnetId":   <int>,
    "subnetName": "<string>",
    "title":      "<one wire-lead sentence, no period at end>",
    "dek":        "<two to three sentence summary, sets the thesis>",
    "sections":   [{"h": "<heading>", "body": "<200 to 350 words per section>"}],
    "sources":    [{"label": "<citation>", "url": "https://..."}]
  },
  "ecosystemState": {
    "title":    "<one wire-lead sentence, no period at end>",
    "dek":      "<two to three sentence summary>",
    "sections": [{"h": "<heading>", "body": "<160 to 280 words per section>"}],
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


def load_intelligence_digest(date_str: str) -> str:
    """Read intelligence/{date}/digest.md if present. This is the
    pre-aggregated pool of every signal we have for today: human notes
    Rondo dropped in chat, recent github commits, blog posts via RSS,
    X posts via Nitter. Built by scripts/intel/aggregate.py on cron.
    Gives the agent context Claude's own web_search would not catch."""
    path = ROOT / "intelligence" / date_str / "digest.md"
    if not path.exists():
        return ""
    try:
        return path.read_text("utf-8")
    except Exception:
        return ""


def build_user_prompt(date_str: str) -> str:
    avoid_human  = human_covered_subnets()
    avoid_oracle = recent_oracle_subnets(days=30)
    market       = fetch_market_context()
    digest       = load_intelligence_digest(date_str)

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
    if digest:
        prompt += (
            "=== TODAY'S INTELLIGENCE POOL ===\n"
            "The magazine's scrapers and the human editorial desk have "
            "already pre-collected signal for today. Treat the human "
            "notes section as higher trust than scraped sources, but "
            "verify all of it before quoting in the article.\n\n"
            + digest
            + "\n=== END INTELLIGENCE POOL ===\n\n"
        )
    prompt += (
        "Pick a subnet from outside the AVOID list for the SUBNET SPOTLIGHT. "
        "Cover something concrete (a ship, an incident, an institutional "
        "move, a measurable shift) that the intelligence pool surfaces. "
        "For ECOSYSTEM STATE, give the synthesis: what matters across "
        "the network today and what the read is. Remember: NEVER use "
        "em-dashes. Output only the JSON object."
    )
    return prompt


def call_claude(date_str: str) -> dict:
    """Two-call pipeline so the agent can actually research before
    writing:

      PASS 1 (research) · web_search server tool enabled. The agent
      reads ~8-15 sources, drafts the two articles in long form, names
      its sources inline. No structured output here, server tools and
      output_config.format do not compose cleanly.

      PASS 2 (format) · no tools. The agent's own draft is the input;
      it returns a single JSON object matching the schema. Structured
      output enforced via output_config.format.

    The two passes are independent calls but share the system prompt.
    PASS 1 is where the depth comes from. PASS 2 is purely conversion."""
    client = anthropic.Anthropic()

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
        "required": ["title", "dek", "sections", "sources"],
        "additionalProperties": False,
    }
    subnet_article_schema = {
        **article_schema,
        "properties": {
            **article_schema["properties"],
            "subnetId":   {"type": "integer"},
            "subnetName": {"type": "string"},
        },
        "required": ["subnetId", "subnetName", "title", "dek", "sections", "sources"],
    }

    # ---------- PASS 1: research + draft, with web_search ----------
    research_prompt = build_user_prompt(date_str)
    print("[pass-1] research + draft, web_search enabled, this may take a few minutes...", file=sys.stderr)
    pass1 = client.messages.create(
        model=MODEL,
        max_tokens=32000,
        thinking={"type": "adaptive"},
        output_config={"effort": "high"},
        tools=[{"type": "web_search_20260209", "name": "web_search"}],
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": research_prompt}],
    )

    # the research turn may return tool-use blocks too; pull only the
    # final text block which holds the drafts
    draft_text = "\n".join(
        b.text for b in pass1.content if b.type == "text"
    ).strip()
    if not draft_text:
        raise RuntimeError("Claude returned no text content in research pass")
    print(f"[pass-1] draft length: {len(draft_text)} chars", file=sys.stderr)

    # ---------- PASS 2: convert the draft to strict JSON ----------
    format_prompt = (
        "Convert the research draft below into a single JSON object "
        "matching the required schema. Preserve EVERY section, EVERY "
        "source citation, EVERY number. Do not summarize, do not "
        "shorten, do not drop sections. The JSON is the publication; "
        "anything cut here is lost.\n\n"
        "=== DRAFT ===\n" + draft_text
    )
    print("[pass-2] format to JSON...", file=sys.stderr)
    pass2 = client.messages.create(
        model=MODEL,
        max_tokens=32000,
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
        messages=[{"role": "user", "content": format_prompt}],
    )

    json_text = next((b.text for b in pass2.content if b.type == "text"), "")
    if not json_text:
        raise RuntimeError("Claude returned no text content in format pass")

    parsed = json.loads(json_text)
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
    shape used in src/data/oracle-articles.js. Also renders the
    dark-mode PDF and records its relative path on the article."""
    if kind == "subnet-spotlight":
        sn  = art["subnetId"]
        nm  = slugify(art["subnetName"])
        aid = f"oracle-{date_str}-sn{sn}-{nm}"
    else:
        aid = f"oracle-{date_str}-ecosystem"

    # render the dark-mode PDF and capture its repo-relative path
    pdf_path = None
    try:
        full_article = {
            "id": aid, "date": date_str, "kind": kind,
            "title": art["title"], "dek": art["dek"],
            "sections": art.get("sections", []) or [],
            "sources": art.get("sources", []) or [],
            "generatedBy": "claude-opus-4-7",
        }
        if kind == "subnet-spotlight":
            full_article["subnetId"]   = int(art["subnetId"])
            full_article["subnetName"] = art["subnetName"]
        path_obj = render_article_pdf(full_article)
        pdf_path = str(path_obj.relative_to(ROOT))
        print(f"[pdf] wrote {pdf_path}", file=sys.stderr)
    except Exception as e:
        print(f"[warn] PDF render failed for {aid}: {e}", file=sys.stderr)

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
    if pdf_path:
        lines.append(f"    pdf: '{pdf_path}',")
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
