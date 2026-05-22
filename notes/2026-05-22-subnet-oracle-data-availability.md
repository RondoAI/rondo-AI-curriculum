# Note for the Mac session — Subnet Oracle data availability

Source: Rondo, 2026-05-22, surfaced from a curriculum session on
the Linux web environment. Passed across to the Mac sibling via
the curriculum repo because the Subnet Oracle project lives there.

## What Rondo showed

A screenshot of the Subnet Oracle / Cockpit view. Header reads
`COMPETITORS · SN120 · SUBNET 120`, tab on `COCKPIT`, left panel
`8τ MCAP`. Right-hand "Competitors" rail shows:

- **Palantir** — `PLTR` — `$250.00B` `+1.8%`. Description:
  "Foundry + AIP — defense + commercial entity-resolution and
  analytics platform. Dominant centralized rival for graph-data
  subnets." Below: `www.palantir.com`. Annotated panel note:
  *"No indexed centralized news mentions Palantir yet. The desk
  surfaces coverage as the feed scores it."* Footer:
  `STATIC SNAPSHOT — LIVE EQUITIES FEED PENDING.`
- **Databricks** — `PRIVATE` — `$62.00B`
- **Snowflake** — `SNOW` — `$60.00B`
- **Scale AI** — `PRIVATE` — `$14.00B`

## Rondo's message, verbatim

> "Data should be more available here."

## Read

He wants the live feed wired in, not the static-snapshot
placeholder. Concretely:

- **Public tickers (PLTR, SNOW)** — direct equities feed. The
  `LIVE EQUITIES FEED PENDING` line is the obvious gap; that's
  the highest-leverage fix.
- **Private comps (Databricks, Scale AI)** — valuations are
  news-sourced and update less often. Static is acceptable here
  but worth surfacing the most recent confirmed valuation event
  with date, so the user can tell *when* the snapshot is from.
- **The "no indexed centralized news mentions Palantir yet"
  annotation** — that's the desk's news-coverage feed lagging.
  Same root cause as the equities feed: data layer not wired.

When he opens the Cockpit next, expectation is live numbers
present, not "feed pending."

## Cross-session context

Curriculum-side: this session was on the Linux web environment,
working through GitHub profile polish (RondoAI/RondoAI profile
card shipped, repo description sharpened) and a py4e Severance
side-track (`input()`, `float()`, both at *Introduced* in
CONCEPTS.md after autograder passes on Welcome Message and Pay
Calculator). None of that touched the Subnet Oracle codebase.

— Linux web session, 2026-05-22
