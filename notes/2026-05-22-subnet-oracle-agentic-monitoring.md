# Note for the Mac session — Subnet Oracle: bring Messari-style Agentic Monitoring to the Cockpit

Source: Rondo, 2026-05-22 (same session as the earlier
`subnet-oracle-data-availability.md` note). Linked to that one;
read both together.

## What Rondo showed

A screenshot of **Messari's "Create Monitoring View"** product,
specifically the **Agentic Monitoring** tab. The three-section
form:

1. *What Do You Want To Monitor?* (collapsed)
2. *What Type Of Events Matter To You?* — two sub-tabs:
   - **Refine from Options** ("Use filters to define what you
     monitor")
   - **Agentic Monitoring** ("Tell us what to monitor. AI
     configures the rest") — currently selected
   - Free-text prompt box, populated with:
     *"Monitor fundraising data and token unlocks for the latest
     Solana ecosystem coins"*
   - Toggle: **"Only Show Messari Verified Events" — These events
     have been manually verified by the Messari team**
   - Buttons: *Preview Events*, *Continue*
3. *Alerts & Access* (collapsed)
4. Right panel: **Configuration Preview** — empty placeholder
   reading "Enter an AI prompt to see a preview of recent events"

Plus a YouTube link Rondo dropped:
`https://youtu.be/wpBQAQy7F40` (likely the Messari walkthrough of
this feature). Couldn't fetch it from this environment (Google
CAPTCHA wall on YouTube), so the screenshot is the canonical
reference.

## Rondo's verbatim message

> "Let's create something like this for the Oracle maybe we need
> some type of api"

## The pattern, decomposed

Three layers Messari built, each of which the Oracle would need:

### 1. Data layer

Messari's moat is their curated event stream: fundraising,
token unlocks, listings, hacks, governance, partnerships, etc.,
spanning the whole crypto market. Their API exposes it on tiered
pricing (Pro / Enterprise).

For the Subnet Oracle, the equivalent would be a **composed** data
layer, not a single API:

| Source | Covers | Cost |
|---|---|---|
| TAOstats / Bittensor RPC | Subnet emissions, validator/miner activity, TAO price, weights | Free |
| Messari API | Fundraising, token unlocks, market data, asset profiles for crypto + select equities comps | Paid (Pro tier starts ~$25/mo last we checked; Enterprise much higher) |
| Equities feed (Polygon / Alpaca / yfinance) | Live prices for PLTR, SNOW, etc. | Free tier exists |
| News aggregation | Headlines on Palantir, Snowflake, Databricks, Scale AI, Bittensor itself | Free if scraped; paid if licensed |

The earlier note (`subnet-oracle-data-availability.md`) already
flagged the `LIVE EQUITIES FEED PENDING` gap. This is the same
problem at a higher level: the Cockpit needs a real data layer
before it can host an Agentic Monitoring product on top.

### 2. Query translation layer

The clever bit isn't the data — it's the natural-language → query
translation. User types "alert me when SN120 emission changes by
>5% vs last week," LLM outputs a structured query:

```json
{
  "subnet": "SN120",
  "metric": "emission_rate",
  "operator": "delta_pct",
  "threshold": 5.0,
  "window": "7d",
  "direction": "any"
}
```

Then the runtime evaluates that query against the data layer on a
schedule. **Anthropic tool-use is purpose-built for this** — small
prompt, JSON schema for the query, near-zero cost per translation.

### 3. Verification toggle (the trust play)

The "Only Show Messari Verified Events" toggle is what makes the
product defensible. Auto-ingested events have noise; manually
verified events are the curated signal. Even one verified event
per day on something nobody else verifies (a particular subnet's
governance moves, say) is a moat.

For the Oracle: a small editorial layer where Rondo (or a desk)
flags events as **verified**. Two visual states in the UI: yellow
dot for auto, green check for verified.

## Rondo's API question — read

He flagged that this needs "some type of API." That's right but the
shape isn't "pick one." It's **compose multiple free sources first,
add Messari only when product traction justifies the price tag.**

### Suggested MVP order

1. **Equities feed wired in** (already flagged; un-blocks the
   static-snapshot rail in `subnet-oracle-data-availability.md`)
2. **Free Bittensor RPC data wired in** for SN120 metrics
3. **A simple Agentic Monitoring prompt box** on the Cockpit:
   natural language → structured query (Anthropic tool-use,
   `claude-haiku-4-5-20251001` for cost, ~$.25 per million input
   tokens), evaluate against current data, show matched events in
   a Configuration Preview rail.
4. **Verification UI** — start manual, one button per event.
5. **News aggregation** — last layer, requires either scraping
   discipline or a paid feed.
6. **Messari API** — only if a specific event type isn't covered
   by the free stack and there's user demand.

## Notes on Anthropic tool-use for the query translator

Use the latest Haiku (`claude-haiku-4-5-20251001`) — fast enough
for live preview. System prompt locks the structured-query schema.
Cache the system prompt with prompt caching (the schema doesn't
change between requests). Estimated cost: well under $0.001 per
prompt translation at current pricing. Don't use Opus for this —
overkill.

— Linux web session, 2026-05-22
