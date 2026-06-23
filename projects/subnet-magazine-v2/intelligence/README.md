# Subnet Magazine, Intelligence Pool

This folder is the magazine's signal-gathering layer. Everything that
the daily research agent reads before writing lives here, organized by
date.

## How it works

```
intelligence/
├── README.md                  # this file
├── HUMAN_NOTES.md             # Rondo's running log of tips from chat
└── YYYY-MM-DD/                # one folder per day, auto-created
    ├── nitter.json            # X posts via public Nitter instances
    ├── github.json            # commits/releases from known subnet repos
    ├── rss.json               # blog posts via RSS
    ├── digest.md              # the unified daily brief for the agent
    └── *.md                   # ad-hoc human contributions
```

Each scraper writes its raw observations into the day folder. The
aggregator (`scripts/intel/aggregate.py`) reads them all and produces
`digest.md`, which is what `scripts/daily-research.py` pulls into the
Claude prompt as context.

## Sources, and what they cost

| Source              | Cost   | Cadence            | How                                          |
|---------------------|--------|--------------------|----------------------------------------------|
| Public Nitter (X)   | Free   | Every 4h via cron  | Hits public Nitter RSS instances, rotates    |
| GitHub public API   | Free   | Every 4h via cron  | 60 req/h unauthenticated, enough for ~20 repos |
| Public RSS blogs    | Free   | Every 4h via cron  | Standard RSS parsing                         |
| Human notes (Rondo) | Free   | Whenever           | Appended to HUMAN_NOTES.md from chat         |
| Discord bot        | Free*  | Future             | Requires a free bot token + invitations      |

`*` Discord is free in dollars but requires a bot account + each
subnet inviting it. Wired in `scripts/intel/discord.py` but disabled
until credentials land.

## How to contribute as a human

When you (Rondo) drop a tip in chat, the assistant appends it to
`intelligence/HUMAN_NOTES.md` with a timestamp. That note then gets
pulled into the next day's `digest.md` and shipped to the research
agent's prompt. The format is just dated markdown:

```
## 2026-05-16 14:30 UTC
Source: Discord screenshot from Hippius founder.
Note: Hermes v2 was actually shipping at 380ms p50 against a
synthetic load test, not against live cross-subnet traffic. The
live number is closer to 520ms.
```

The agent treats human notes as **higher trust than scraped data**
because you've already filtered them. The notes go near the top of
the digest.

## How the workflow runs

- `.github/workflows/intelligence-poll.yml` runs every 4 hours, calls
  `scripts/intel/aggregate.py`, commits whatever changed to
  `intelligence/{today}/`
- At 08:00 UTC, `.github/workflows/daily-research.yml` runs
  `scripts/daily-research.py`, which reads
  `intelligence/{today}/digest.md` and ships it as context to Claude

## Adding a new source

1. Drop a script in `scripts/intel/` that writes JSON or markdown into
   `intelligence/{today}/`
2. Add it to the dispatcher in `scripts/intel/aggregate.py`
3. The next cron run picks it up

That's it. The pool is intentionally append-only; the daily agent
sees one day at a time, the magazine keeps the historical record.
