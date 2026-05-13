# Subnet Magazine

A prototype editorial site for a magazine covering Bittensor — the
subnets, the validators, the miners, the markets, and the
architecture of an emerging decentralized intelligence economy.

Built as portfolio work alongside the Python curriculum.
Hands-on track: design, semantic HTML, dense CSS systems,
vanilla-JS canvas + DOM animation. No build step, no frameworks,
no dependencies beyond Google Fonts.

## Brief

The visual quality bar was set at solana.com. The aesthetic
direction is dark, sleek web3 × Bloomberg-terminal — mono-heavy
data density, amber and cyan and mint deltas, a faint grid behind
everything, serif reserved for headlines and pull quotes.

## What's in the prototype

- **Live status strip** — UTC clock, block height (ticking every
  ~12 s in the Bittensor block-time rhythm), TAO/USD, YCX.
- **Masthead and sticky primary nav** with active-section
  highlighting on scroll.
- **Cover story** with animated canvas network (60 nodes, edges
  that fade by distance, gentle pulse).
- **Scrolling subnet ticker** — pure CSS marquee, seamless loop.
- **At a glance** — six counter-up stats (active subnets, TAO
  staked, daily emissions, miners, validators, uptime).
- **Features grid** — one lead story + four supporting features.
- **Subnet of the Week** — line chart (leader vs median vs 30-day
  best) on a real `<canvas>`, with a stats sidebar and pull
  quote.
- **The Directory** — filterable, sortable card grid of 18
  representative subnets (text, vision, training, data, search,
  finance).
- **The Board** — Bloomberg-style quote board: α-price, 24h
  emission, miners, 24h and 7d change, and a live sparkline per
  row. Updates every 1.4 s with row flashes.
- **Markets & Emissions** — squarified-treemap canvas of top
  emitters, with a YCX (Yuma Composite Index) callout and a
  top-emitters list.
- **Voices** — four pull-quote op-ed teasers.
- **Research** — four primer / paper / data items.
- **Long Read** — the opening four paragraphs of the cover story.
- **Subscribe** — newsletter form (demo only — does not store
  anything).
- **Colophon** — masthead, about, archive, contact.

## Data and references

All subnet metrics in this prototype are simulated. The two
external entities the markup credits as real ecosystem fixtures:

- [taostats](https://taostats.io/) — the official Bittensor block
  explorer; the reference data layer we cite in the emissions
  section.
- [Yuma AI](https://www.yumaai.com/asset-management) — operator
  of the **YCX (Yuma Composite Index)**, a market-cap-weighted
  benchmark of the Bittensor subnet universe. The YCX value
  shown (1,004.89, +0.49%, May 13 2026) is the value Yuma was
  surfacing at time of build.

No affiliation is implied. The credits are honest pointers, not
endorsements in either direction.

## Files

```
projects/subnet-magazine/
├── index.html      semantic structure, all content
├── style.css       full design system (~900 lines)
├── app.js          canvas, counters, ticker, quote board, clock
└── README.md       this file
```

## Viewing it

It's a flat static site. From this directory:

```
python3 -m http.server 8000
```

…then open `http://localhost:8000/projects/subnet-magazine/`.

Or just open `index.html` directly — most things work over
`file://` (the directory `python3 -m http.server` route is only
needed if a browser blocks something).

## What I'd want to do next

- Pull live data from a real Bittensor endpoint or taostats
  proxy and replace the simulator.
- Build an MDX-style article pipeline for actual long-form pieces.
- Wire up an RSS feed and an IPFS mirror, both gestured at in the
  colophon.
- Real type system — drop Google Fonts and self-host Fraunces /
  Inter / JetBrains Mono.
- A11y audit, keyboard-only walkthrough, prefers-contrast pass.
- Print stylesheet for the long read.

## Notes on the build

Built on the `claude/build-solana-website-A0LDy` branch from a
prompt that started "make a website 10x better than solana.com",
re-aimed once at *Subnet Magazine* covering Bittensor subnets.
The branch name is a fossil of the original framing.

Respects `prefers-reduced-motion`. No tracking. No analytics. No
service worker. No fonts loaded if you block Google Fonts — the
fallbacks (Iowan Old Style, system sans, ui-monospace) hold up.
