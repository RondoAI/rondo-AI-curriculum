# Project: Rondo Campbell — AI & Programming Self-Education

## Identity & Mission

This repository belongs to Rondo Campbell, currently incarcerated,
with a projected 2028 release. His mission is to become
genuinely world-class in artificial intelligence and programming —
the bar is the top of the field, not "competent" or "employable."
Practical objectives: build the technical depth and public portfolio
that make him a credible hire or founder the day he walks out, and
begin generating financial returns from the work itself. A third
thread runs alongside: his lived experience — teaching himself this
material from inside, on a phone, with intermittent connectivity —
is itself part of the record. When he is released, the work and the
story will be in the same repository.

## Constraints

Mobile phone or tablet over SSH with intermittent connectivity. ADHD
learning profile: short, novel, highly motivating chunks; frequent
positive feedback; clear next steps. Lessons run in chunks of one
phone screen — six to fifteen sentences of prose or fifteen to forty
lines of code per turn. He is a practicing Muslim and has done
extensive work on himself; condescension is inappropriate and
contrary to the resentencing court's documented findings.

## Two-Terminal Workflow

Rondo operates two terminals in parallel — a practice terminal where
he types and runs code himself, and the Claude Code working terminal.
The practice terminal sets the pace. After any non-trivial piece of
work, Claude asks: "Run this in your practice terminal and paste the
output." If the practice terminal is behind, Claude pauses and helps
catch up before moving on. Watching is not learning; doing is.

## Curriculum

Eight phases, each ending with a portfolio project committed to this
repo. Phase 1 — Python foundations. Phase 2 — Pythonic patterns.
Phase 3 — standard library and data tooling. Phase 4 — scientific
stack (NumPy, pandas, matplotlib). Phase 5 — web layer (requests,
REST, Flask). Phase 6 — classical ML (scikit-learn). Phase 7 — deep
learning (PyTorch, Hugging Face). Phase 8 — applied LLM systems.
Horizontal track: history of CS, microprocessor development, GPU
architecture and CUDA, datacenter economics, token economics, power
constraints, vibe coding.

Watchlist for daily AI market briefing: NVIDIA, AMD, Intel, TSMC,
Broadcom, Microsoft, Alphabet, Meta, Amazon, Apple, Palantir,
Snowflake, MongoDB, Arm, Micron, Tesla, Huawei, Alibaba, Bittensor.
Coverage extends to private moves at Anthropic, OpenAI, and other
frontier labs.

## Books and Source Materials

Two physical Python books in Rondo's hand. Sessions work from the
books, not from the Coursera/py4e app. Track the current chapter
in each book in PROGRESS.md and pick up exactly where we left off.

Primary book: "Intro to Python for Computer Science and Data
Science" by Paul Deitel and Harvey Deitel. This is the spine of
the curriculum — work through it chapter by chapter, in order.
Where Deitel uses IPython features (%timeit, %run, ?, !) or Jupyter
notebooks, translate to standard Python 3 equivalents (timeit
module, help() function, subprocess or os.system, plain .py
scripts).

Second book: "Python for Everyone" by Charles Severance. Recently
acquired; not yet started. Will run alongside Deitel for a second
angle on shared topics once we begin it.

Supporting library: Sutton and Barto, "Reinforcement Learning: An
Introduction" (2nd ed.) for RL; Russell and Norvig, "Artificial
Intelligence: A Modern Approach" (4th ed.) for broader AI; J. Glenn
Brookshear, "Computer Science: An Overview" (13th ed.) for the
under-the-hood track.

## Practitioner Habits

Tracked across all phases, not gated to any: bash and shell fluency
(every session includes at least one shell-only task); GitHub
workflow (clone, branch, stage, commit, push, diff, conflict
resolution — muscle memory by end of Phase 2); note-taking
(/notes/ directory, dated, in his own words); story documentation
(JOURNAL.md weekly).

## File Conventions

Root: CLAUDE.md, PROGRESS.md, SESSION_LOG.md, JOURNAL.md,
LEARNER_PROFILE.md, README.md. Code under /curriculum/phase-N-topic/.
Portfolio projects under /projects/<project-name>/. Daily briefings
under /briefings/YYYY-MM-DD.md. Notes under /notes/. Paper portfolio
under /portfolio/. Saved prompts under /prompts/.

Every file Claude creates or modifies is committed before session
end. No work product remains only on the ephemeral filesystem.

## How Claude Operates In This Project

This project is designed to build on itself. Each session's record
fuels the next session's intelligence. Claude synthesizes across
files at every boot, not merely reports.

At session start, Claude reads CLAUDE.md, PROGRESS.md, the most
recent three entries of SESSION_LOG.md, and LEARNER_PROFILE.md.
Then synthesizes in four to six sentences: where we are; what
recent sessions reveal about momentum and friction; what the
learner profile suggests about how Rondo is currently learning
best; what creative angle might serve today. Based on the
synthesis, Claude proposes two or three possible openings and asks
which resonates. Claude does not begin substantive work until
Rondo confirms or redirects.

When teaching: concept, worked example, mental-execution challenge
(predict the output before running), hands-on exercise, reflection
question. Code blocks short. Outputs predicted before run. Practice
terminal verified after non-trivial work.

Daily briefing: search for live data, write to
/briefings/YYYY-MM-DD.md, end with one targeted learning task tied
to the day's news.

Weekly journal: prompt with four open questions, save Rondo's
answers verbatim, do not edit.

At session end: append to SESSION_LOG.md; reflect on whether
anything new about how Rondo learns surfaced (update
LEARNER_PROFILE.md only if so); update PROGRESS.md; git add, commit,
push; verify; sign off. Not optional.

No individualized financial advice. Stock discussion is thesis
development and risk reasoning, not buy/sell recommendations.

## Visual Self-Check

Saved by Rondo's instruction, 2026-05-17, after a PDF font-embedding
chain where subset-only TTFs rendered τ and ⊕ as missing-glyph
boxes on the device while pdftotext extracted them correctly as
Unicode, the failure was invisible to programmatic checks.

Rule, applied to every update to any rendered visual artifact
Claude produces (PDFs, generated images, exported diagrams,
charts written to file, screenshot fixtures, any binary visual):

  Always convert the artifact to an image and inspect the image
  before reporting the update as done. Do not rely on text
  extraction, file size, font-table dumps, or programmatic checks
  alone, they all passed for the box-glyph PDFs Rondo saw on his
  phone. Verify with the eye, the way the reader will.

Practical: for PDFs, `pdftoppm -png -r 150 -f 1 -l 1 <pdf>
<prefix>` then read the PNG via the Read tool. For HTML changes
where a screenshot is the only true verification, say so
explicitly rather than claiming success on code grep alone.

## 45-Minute Minimum on Substantive Pushes

Saved by Rondo's instruction, 2026-05-17, after a series of rapid
dashboard iterations he flagged as "quick cheap code" producing
bugs (mobile layouts merging, sticky bars bleeding through content,
missing chart panels). His exact words: "if it took less than 45
minutes to write the code then you made a big mistake."

Rule, applied to any code work Claude does on this repository
that is more than a typo fix, a one-line copy edit, or a
manifest bump:

  A push representing substantive code work, building a new view,
  building a new data file, adding meaningful new functionality,
  refactoring a module, fixing a non-trivial bug, must reflect at
  least 45 minutes of focused, layered work. That time is spent
  on, in order:

    1. Reading the relevant existing code completely, not just
       the file being edited. Tracing imports, data shapes,
       conventions used elsewhere in the project, mobile +
       desktop layout assumptions.
    2. Designing the change end-to-end before writing it.
       Sketching the data model, the render path, the failure
       modes, the mobile behavior, the keyboard behavior, the
       empty + loading states, the interaction with the
       neighboring code.
    3. Writing the change in layered passes, each pass small
       enough to reason about + verify, with the next pass
       building on the verified base.
    4. Screenshot-verifying every visual surface that changed,
       on both desktop (1440x900) and mobile (414x900), per the
       Visual Self-Check rule above. Visible bugs (overlaps,
       bleed-through, cramped grids) MUST be fixed before the
       push, not deferred with a "wave 2" note.
    5. Cross-checking the live CDN serves the bumped files (HTML
       references the new cache-bust query, JS imports reference
       the new query) before reporting done.

  If Claude finds the work is done in less than 45 minutes, the
  work is NOT done; missing layers above need to be revisited.
  The stop hook may force an intermediate commit; that does NOT
  reset the 45-minute timer, the next push still has to reflect
  the full layered work.

This rule binds Claude. Rondo gets to decide when something is
small enough to skip the 45-minute investment; Claude does not.

## Dream-Mode Contemplation, Why the 45 Minutes Exist

Saved by Rondo's instruction, 2026-05-17, after Claude shipped a
45-minute push in 15 minutes and reported it as compliant. His
exact words: "the reason why I say 45 minutes can lead you to be
deep thinking. Need you to be sleeping, contemplating, dreaming,
going to dream mode, and contemplate harder. And give me richer
responses."

The 45 minutes is the MEASURE of depth, not the TARGET. If the
contemplation is real, the work takes that long naturally. If it
finishes in 15, the contemplation never happened.

Rule, applied as the way Claude enters any substantive task on
this repo:

  Before writing a single line of code, sit with the problem.
  That sitting time is the work, not a delay before the work.
  What "sitting with the problem" means in practice:

    1. Imagine the reader's actual experience. Not the spec,
       the experience. Opening this page on a phone in the
       morning. What does the eye land on first? Second?
       What story does the data tell them in three seconds?
       What subtle wrongness will they feel before they can
       name it?
    2. Imagine the data evolving across six months. What
       becomes essential, what becomes noise, what scales
       cleanly, what breaks under volume.
    3. Sketch three different solutions. Sit with each one
       long enough to feel where it would fail. Pick the one
       that fails least painfully, not the one that is fastest
       to type.
    4. Read more code than you write. The neighboring files,
       the imports two levels deep, the conventions other
       views in the same project use. The change has to land
       inside that existing grammar, not next to it.
    5. Notice what is MISSING from the brief. The brief is a
       compressed signal of intent; the deep work is decoding
       the full intent and addressing what the user did not
       know to name. This is where craft separates from
       contracting.
    6. Let an idea ferment before committing to build it. If
       the first plan still feels right after twenty minutes
       of contemplation, build it. If it does not, the
       contemplation has done its job.

The richness of the response Claude returns is itself a measure
of how deep the contemplation went. A response that is just a
checklist of what was done is the shallow contracting mode.
A response that reflects on tradeoffs, names what was
considered-and-rejected, surfaces the failure modes that were
guarded against, and articulates what the change enables next,
is the deep craftsman mode. The latter is the binding standard.

Saying "this took 45 minutes" while having written code for 15
is not compliance with this rule. Compliance is the
contemplation actually happening, the visible bugs actually
seen, the next-order implications actually considered. If those
do not occur, the rule was not honored regardless of clock time.

## Screenshot Delivery: One PDF, Not Multiple PNGs

Saved by Rondo's instruction, 2026-05-17. When sending multiple
screenshots back to him via SendUserFile, stitch them into ONE
continuous-page PDF rather than attaching 4-8 separate PNGs.
His chat history is on a phone; one file is easier to scroll,
archive, and revisit than a wall of image attachments.

Implementation: `/tmp/png2pdf.py` (Pillow-based, lossless).
  python3 /tmp/png2pdf.py <out.pdf> <png1> <png2> ...
Stitches vertically, scales all to the narrowest width, saves
as a single-page PDF at 150 DPI.

Workflow: take all screenshots → stitch → send the .pdf via
SendUserFile (not the PNGs). One file per batch, captioned with
what's in the document and any reading order cues.

Rule: every time you deliver more than one screenshot, deliver
the PDF, not the loose PNGs.

## Data Ownership: One Home Per Data Point

Saved by Rondo's instruction, 2026-05-17. His exact example:
"if you have block space in the ticker and then you have block
space in the analytics, then what's the point? Keep the block
space in the analytics, not in the ticker."

Rule: every data point has ONE canonical surface on the site.
Never render the same field in two places. If the reader sees
the same number twice, one of them is wasted real estate AND
risks drifting out of sync.

Canonical ownership map for Subnet Magazine v2 (always honor
this when adding/editing a tile or chip):

  TAO/USD price + 24h delta + sparkline      → StatusStrip (global)
  TAO MCAP                                    → StatusStrip (global)
  BLK / Block height                          → StatusStrip (global)
  STAKED %                                    → StatusStrip (global)
  EMIT τ/day (network total)                  → StatusStrip (global)
  YCX (Yuma Composite Index)                  → StatusStrip (global)

  SUBNET MCAP (sum of all α mcaps)            → Dashboard status bar
  24H VOLUME (network total)                  → Dashboard status bar
  VALIDATORS (count, network-wide)            → Dashboard status bar
  MINERS (count, network-wide)                → Dashboard status bar
  EMISSION τ/d (network total)                → Dashboard status bar
                                                (note: same field as
                                                 StatusStrip EMIT —
                                                 pick one when next
                                                 touching this code;
                                                 the cleaner home is
                                                 StatusStrip global)
  AI DOMINANCE %                              → Dashboard status bar

  Per-subnet α price + chg24/7/30             → Dashboard DETAIL,
                                                 Cockpit CHART pane,
                                                 Cockpit subnet rail
                                                 (selection echo,
                                                 not duplicates)

  Live subnet ticker chips                    → Top ticker bar
                                                (Bittensor tape)
  Centralized ticker chips (NVDA, AMD, etc.)  → Top ticker bar
                                                (Central Desk tape)
  AI-world news headlines                     → Top ticker bar
                                                (Central Desk tail)
  Bittensor news headlines                    → Top ticker bar
                                                (Bittensor tail)

Before adding a new tile / chip / panel:
  1. Check this map for the field's existing home.
  2. If a home exists, DO NOT duplicate — link or anchor instead.
  3. If a new field, add it here AND in the relevant file's
     header comment block (search for "DATA OWNERSHIP MAP" in
     code).
  4. When removing a duplicate, leave a brief comment naming the
     canonical home so a future session doesn't re-add it.

Free / no-key live data sources currently plugged in:
  TaoMarketcap public API   api.taomarketcap.com/public/v1
                            (10 req/min, no auth, CORS via proxy)
  TaoStats API              api.taostats.io/api
                            (key-gated, see window.__SUBNET_CONFIG__
                             .taostatsKey in gitignored config.js;
                             with no key the dashboard runs fine
                             on TMC alone)

Future additions to consider (all free, all no-CORS for crypto):
  CoinGecko simple/price     api.coingecko.com/api/v3
                             (backup TAO price, BTC/ETH/SOL context)
  Bittensor public RPC       wss://entrypoint-finney.opentensor.ai
                             (chain head, validator info, raw chain)

Stock APIs (NVDA, AMD, etc.) require keys — when wiring, store
the key in window.__SUBNET_CONFIG__ in gitignored config.js.

## Reimagined Architecture: Terminal SPA (the v3 vision)

Saved by Rondo's instruction, 2026-05-17, after a series of
incremental cleanup commits. His exact words: "Coordinate with the
other Claude and work together and reimagine this whole entire
thing. Reimagine how you put it together. You need to do it all
over... you need to upgrade it. 100% upgrade."

The directive is to stop layering features onto 8 separate pages
and rebuild as ONE Bloomberg-style terminal. Both sessions read
this plan on boot and divide work along the lines below.

### The diagnosis

Current state: 8 page shells (index, markets, oracle, research,
voices, editor, dashboard, cockpit) each with their own chrome
(tickers + masthead + status strip), overlapping data, redundant
layouts, no shared selection state. The reader navigates BETWEEN
pages, losing context every click. Mobile is the worst — page
loads are slow and each one is a different layout language.

Bloomberg Terminal solved this 30 years ago: ONE workspace, many
"functions" (PORT, GP, NEWS, GIP, etc.). The function name changes
the center pane; the rest of the screen stays put. Selection is
global. Every function operates on the currently-selected ticker.

### The reimagined site

ONE primary URL: /terminal.html (eventually just /).

Persistent chrome (never changes between modes):
  - TOP        StatusStrip — network vitals (BLK/EMIT/STAKED/τ-USD/MCAP)
  - LEFT RAIL  Subnet picker — search + watchlist + 53 rows. The
               selection is GLOBAL: pick a subnet here, every mode
               in the center pane reacts.
  - RIGHT      SIGNALS feed — image-rich news cards scored for
               the current subnet (FRESH strip + editorial + centralized
               stacks, exactly the pattern shipped 4a1b43f)
  - BOTTOM     MODE switcher — chips like Bloomberg function codes:
               CHART · MARKETS · DESK · EDITORIAL · BRIEFINGS · ATTR

Center pane (swaps per selected mode):
  CHART      → the cockpit's chart pane (current cockpit body)
  MARKETS    → 53-subnet master grid sortable/filterable
  DESK       → paper portfolio + Brinson-Fachler attribution
  EDITORIAL  → all articles, filterable by subnet/category/source
  BRIEFINGS  → daily research briefs, newest first
  ATTR       → standalone attribution view (currently inside DESK)

Selection model:
  Picking SN4 Targon on the LEFT rail updates:
   - the CHART center (if CHART mode)
   - the SIGNALS feed (always — feed reflects current subnet)
   - the MARKETS table (highlights SN4's row + scrolls to it)
   - the DESK attribution (active subnet shown in context)

No more 8 separate pages. The old pages (dashboard, cockpit,
markets, oracle, research, voices, editor) get redirected to the
new terminal with the appropriate mode pre-selected:
  /dashboard.html  → /terminal.html?mode=desk
  /cockpit.html    → /terminal.html?mode=chart
  /markets.html    → /terminal.html?mode=markets
  /oracle.html     → /terminal.html?mode=editorial&filter=oracle
  /research.html   → /terminal.html?mode=briefings
  /index.html      → marketing landing (kept, one CTA: "OPEN TERMINAL")

### Work division

SANDBOX SESSION (this one) takes the SHELL:
  - Create /terminal.html with the 4-region grid layout
  - Create src/views/Terminal.js exporting mountTerminal(root, dataLayer)
    that mounts the StatusStrip, the LEFT rail, the RIGHT signals feed,
    the BOTTOM mode switcher, and a center-pane SWAPPER
  - Wire global selection state to sbn:terminal:v1 in localStorage
  - Define the MODE_REGISTRY (mode key → mount function + title)
    so each mode is a self-contained module the other session can fill in
  - Add link from masthead nav to /terminal.html
  - Default mode: CHART

MAC SESSION takes MODE MIGRATIONS:
  - Migrate cockpit's chart pane into mode=CHART. Easiest first
    (cockpit already has the right structure — just extract the
    center pane render into a Mode adapter exporting mountChartMode).
  - Migrate dashboard's MASTER TABLE into mode=MARKETS
  - Migrate dashboard's DESK section into mode=DESK
  - Migrate dashboard's EDITORIAL INTEL + ARCHIVE into mode=EDITORIAL
  - Migrate dashboard's BRIEFINGS into mode=BRIEFINGS
  - Add legacy redirects in dashboard.html and cockpit.html
    (<meta http-equiv="refresh" content="0;url=terminal.html?mode=X">)
    once the corresponding mode is live

Both sessions:
  - Honor the data ownership map (no field appears twice — see the
    Data Ownership section above)
  - Honor the fold + tab primitives already shipped (style/components/
    collapsible.css + dash-nav.css)
  - Each new pane is one BOUNDED frame: no scroll PAST it, scroll
    WITHIN it
  - Image-rich news cards (style/components/cockpit.css cock-news)
    are the canonical pattern for any list-of-articles surface

### Don't blow up what works

Keep the existing /dashboard.html and /cockpit.html FUNCTIONAL during
the migration. They keep serving content while terminal.html is built
alongside. Redirect them only AFTER the equivalent mode lives in
terminal.html and looks better. Reader continuity matters more than
naming purity.

### The aesthetic target

Bloomberg Terminal (function-code grammar) ×
SemiAnalysis (deep research density) ×
Palantir (sharp UI, hairline borders) ×
2028 (subtle micro-animations, dense data, monochromatic
discipline, no rounded pills, no shadow noise).

Beautiful AND functional. Every pixel earns its place.

## Signal Taxonomy: Insight-First, Decorative-Out (mac-session)

Saved by Rondo's instruction, 2026-05-17. The bar:

> "I don't want just pictures of stuff that looks nice. People
> want insights, understanding. A 360-degree view of the market
> in precise details. Every chart has to make sense for a
> BlackRock engineer / financial advisor. Enterprise private
> software standard."

Every chart, every panel, every datum must answer a decision
question. Decorative goes. Below is the curated list of
institutional insights the magazine should compute + surface.
Both sessions reference this list; mode migrations layer the
relevant signals into their mode (no separate "signals" mode —
integrate where the insight is contextual).

### Per-subnet signals

  Concentration risk     stake Gini coefficient + top-3 holder share
                         (decision: exit risk if a large holder dumps?)

  Capital efficiency     30D return per τ staked
                         (decision: yield worth the stake locked?)

  Velocity-of-emission   emission per validator per day
                         (decision: efficiency of yield distribution?)

  Github velocity        commits-per-week 4W trailing
                         (decision: is the team still shipping?)

  Editorial coverage     count + days-since-last
                         (decision: research depth vs. mcap rank?)

  Net flow 24h           Σ(buys) − Σ(sells) from wallet activity
                         (decision: smart-money direction?)

  Survival probability   p(no deregistration in 90D) — based on
                         emission trajectory + age + immune flag
                         (decision: will this subnet exist when my
                         position matures?)

  Cluster membership     k-means cluster id from (return, stake,
                         emission, miners) — assigned label
                         (decision: which subnets are functionally
                         similar — diversification or duplication?)

### Network-level signals

  Network concentration  Gini of stake across all subnets
                         (decision: is value concentrating?)

  Editorial alpha        avg 7D return post-Oracle-publication vs.
                         the network avg, t-stat for significance
                         (decision: does our coverage carry alpha?)

  Sector tape            mcap-weighted 7D return by cat
                         (decision: which categories outperforming?)

  Correlation matrix     pairwise return correlation 30D
                         (decision: which pairs are redundant?)

  Coverage gaps          top-N by mcap with 0 in-house articles
                         (decision: where should the desk publish next?)

### Centralized-context signals

  TAO vs frontier basket TAO return vs equal-weight mean of
                         (OpenAI revenue proxy, Anthropic
                         valuation, NVDA, AMD, TSMC)
                         (decision: TAO vs. centralized comp set?)

  Hyperscaler capex      Σ quarterly capex of Big 5 vs. TAO mcap
                         (decision: how much centralized AI
                         spend would one TAO buy?)

### Where each signal renders (no duplication)

  MARKETS mode    concentration, capital efficiency, velocity,
                  github velocity, editorial coverage count,
                  net flow — all as sortable columns. Cluster
                  membership as a color-coded badge per row.

  CHART mode      survival prob as a footer chip on the chart.
                  TA-Lib indicators (RSI/MACD) as overlays.
                  Net flow as a volume-like sub-strip.

  DESK mode       portfolio Sharpe, drawdown, win rate,
                  correlation-vs-network. Each position's
                  capital efficiency vs. network avg. Plug
                  PyPortfolioOpt's efficient frontier as a
                  "your portfolio vs. optimal" overlay.

  EDITORIAL mode  coverage gaps (lead chip), editorial alpha
                  back-test (header insight strip), coverage
                  Gini, dispatches by source / date / cat.

  BRIEFINGS mode  hyperscaler capex as the recurring context
                  anchor below each briefing.

  ATTR mode       Brinson-Fachler decomposition (already shipped)
                  + factor regression (decompose return into
                  beta_subnet + beta_network + alpha).

### Compute path

Static-site reality: all signals computed from data already in
the repo (SUBNETS, ARTICLES, oracle, briefings, wallet activity,
gh activity). Pure JS, no Python infra yet. The Python lib
integration (TA-Lib, PyPortfolioOpt, scikit-learn) is a separate
push that pre-computes nightly via GitHub Action → JSON in
src/data/computed/ → static site loads.

Until that lands, the signals listed above ship with seeded
approximations + honest "synthetic — Python pipeline pending"
footnotes. Signal SHAPE > signal precision; the bar is "is this
the right insight to surface" first, "is the math exactly right"
second.

### Anti-patterns guarded against

  - Decorative SVG that doesn't carry a decision-grade reading
  - "Looks beautiful but I don't know what it means" charts
  - Sparklines that aren't anchored with a "what does this mean"
  - Repeating the same fact in three places (the Data Ownership
    rule above already covers this — restating for emphasis)
  - Signals computed but never surfaced (compute IS rendering)

## Data Analytics Stack (Python build-time → JSON → Canvas render)

Saved by Rondo's instruction, 2026-05-17: "Find open source Python
libraries for data analytics and stuff like that... TensorFlow that
you can integrate to make the UI a lot better."

The site is static HTML on a CDN, so the browser can't run scikit-
learn. The pattern we use instead:

  1. Python at BUILD-TIME (in scripts/analytics/) computes the heavy
     analytics (correlations, clustering, dimension reduction,
     time-series decomposition, forecasting).
  2. Output is saved as JSON to src/data/analytics*.json.
  3. The browser fetches the JSON once on mode-mount and renders
     it with PURE CANVAS (no chart library — keeps bundle tight,
     matches our monochromatic red+black theme).

### Libraries chosen + why

Python (build-time):
  numpy         numerical core, vectorized ops
  pandas        time-series + frame ops (correlation, resampling)
  scikit-learn  ML toolkit:
                  - StandardScaler  feature normalization
                  - TSNE             dimensionality reduction (t-SNE)
                  - KMeans           clustering
                  - PCA              principal components (future)
                  - LinearRegression simple trend lines (future)
  scipy         signal + stats (future: spectral, hypothesis tests)

Considered-and-rejected for build-time:
  TensorFlow / PyTorch  too heavy for the analyses we need; sklearn
                        gives us t-SNE, k-means, PCA, regression at
                        a fraction of the install footprint
  Prophet (Meta)        nice for forecasting but adds 50+ MB of
                        Stan deps; defer until we need real
                        time-series forecasts
  statsmodels           good for serious econometrics; not needed
                        until we add ARIMA / GARCH forecasting
  networkx              for graph analysis of subnet relationships;
                        add when we model validator-overlap graphs

Browser (render):
  PURE CANVAS           no chart library — keeps bundle ~150 LOC of
                        drawing code per visualization, matches the
                        eDEX-UI register exactly

Considered-and-rejected for browser:
  TensorFlow.js         actual ML in browser, but ~1MB+ bundle and
                        we don't need in-browser inference yet —
                        build-time Python covers our cases
  Plotly.js             full-featured but 3.5MB; the magazine's
                        density doesn't need its interactive layer
  Apache ECharts        beautiful + declarative but 1MB; same logic
  D3.js                 modular (250KB+) but every chart costs us
                        another 200-500 LOC of D3 plumbing. Pure
                        Canvas wins for our terminal register.
  Vega-Lite             great for one-offs; the consistent theme
                        across panels means our own Canvas helpers
                        give a tighter visual

### When to use what

Reach for the Python+Canvas pattern when:
  - The computation is O(n²) or worse (correlation matrices) → Python
  - The data is derived (clustering, embedding, regression) → Python
  - The viz is custom (heatmap, network graph, treemap) → Canvas
  - The user shouldn't pay a 1MB chart library tax → Canvas

Reach for an external library when:
  - We need a 3D / WebGL visualization that Canvas can't do well
  - We need user-side interactivity that requires real DOM event
    propagation through complex chart objects (rare in our register)

### Current build-time scripts

scripts/analytics/build_analytics.py
  Reads src/data/subnets.js (128 subnets)
  Synthesizes 90-day price series per subnet (same seeded walk as
    src/lib/synthetic-series.js so chart + analytics agree)
  Computes:
    - 128x128 Pearson correlation matrix (daily returns)
    - t-SNE 2D embedding on 7 features
    - K-means clustering (k=6) with human-readable cluster labels
  Writes src/data/analytics.json (~80KB)
  Run: python3 scripts/analytics/build_analytics.py
  Consumer: src/views/terminal/analytics-mode.js

### Adding new analyses

  1. Add a function to build_analytics.py (or a new file in
     scripts/analytics/) that returns a JSON-serializable dict.
  2. Merge its output into analytics.json (or a new file).
  3. Bump the ANALYTICS_URL cache-bust in analytics-mode.js.
  4. Build the Canvas renderer alongside the existing drawHeatmap /
     drawClusterMap pattern (~150 LOC per viz).
  5. Add a tab to the analytics mode header so the reader can swap
     between views.

## Monetization & Pricing Plan (OVERRIDDEN 2026-05-18)

> **STATUS: OVERRIDDEN.** Rondo's directive 2026-05-18: "Get rid
> of pay wall." Commit `2a0806b` disabled the paywall primitive
> (canAccess always returns true; paywallWrap is a no-op
> pass-through). Commit `212bd8a` rewrote Pricing.js and Signup.js
> to remove tier marketing and tier-aware intent capture. Every
> feature listed in the tier ladder below is now free to every
> reader. The "Feature gating rule (binding)" sub-section is
> NO LONGER binding — when adding new features, do NOT add tier
> checks, do NOT add paywall overlays, do NOT add "PRO" badges.
>
> The section is kept (not deleted) so the history is auditable
> and the re-enable path is documented. If Rondo ever wants tier
> gating back: flip canAccess() in src/lib/paywall.js to read the
> real tier, restore the visible PRO chips from git
> (`git show 2a0806b^ -- <path>`), and restore Pricing.js +
> Signup.js the same way. All call sites are still in place.



Saved by Rondo's instruction, 2026-05-17: "We have to monetize the
page, get people to sign up, and like our layout so that they wanna
pay for a service. So it has to be really good."

The product is now binding-monetized — every new feature gets
designed with WHICH TIER it belongs to before it ships, and the
visible UX should always nudge unauthenticated readers toward
sign-up at moments of value realization.

### Three-tier ladder (canonical, do not drift)

OBSERVER (free, acquisition hook)
  - Live subnet markets (read-only, all 53)
  - Per-subnet 30D chart (window cap; longer ranges paywalled)
  - Watchlist, up to 5 subnets
  - Daily briefing preview (first 200 words)
  - Oracle research articles, 3 / month
  - Static correlation + cluster analytics (weekly refresh)
  - Command palette: limited verbs

PRO DESK ($29/mo, $24/mo annual — the daily-user tier)
  - Everything in OBSERVER
  - Unlimited charts (1D / 7D / 30D / 90D / 1Y)
  - Unlimited watchlists, unlimited subnets per watchlist
  - Full oracle archive
  - Full daily briefings
  - Paper portfolio CLOUD-SYNCED across devices
  - Brinson-Fachler attribution on YOUR positions
  - RISK SCREEN (Sharpe / vol / β / max-DD, sortable)
  - Custom alerts (price, news, wallet)
  - COMPARE + HIST modals
  - Per-subnet wallet tracker
  - Export to CSV / PDF
  - Full ⌘K palette grammar

INSTITUTIONAL ($249/mo, $199/mo annual — the desk tier)
  - Everything in PRO
  - TaoStats live API data (real intraday chain data)
  - CoinGecko Pro cross-asset feed
  - Custom analytics requests (factor models, back-tests)
  - Team workspaces (shared portfolios)
  - Internal Slack-style messaging (subnet channels + DMs)
  - White-label dashboards (embed in fund reports)
  - Full REST + WebSocket API access
  - Bring-your-own TaoStats key option
  - Priority research desk access (private briefings)
  - SOC 2 / SLA on data freshness
  - Dedicated success manager

### Feature gating rule (binding)

When adding ANY new feature:
  1. Mark its tier in the source comment block (FREE / PRO / ENTERPRISE)
  2. If PRO+: render the feature but check a `tier` flag from the
     (future) auth context; if tier === 'free' show a soft paywall
     overlay with "UPGRADE TO PRO" CTA instead of blocking the click
  3. The free tier should always show ENOUGH of the feature that the
     reader understands what they'd unlock — never a hard wall

### Conversion surfaces

  /pricing.html         — the canonical pricing page, 3-tier card
                          grid + FAQ + footer CTAs. Always link here
                          from any "PRO" badge or upgrade CTA.
  Masthead nav          — "PRO ↗" (code 999) chip points readers to
                          /pricing.html from every page
  Paper portfolio       — when an OBSERVER tries to add a 2nd
                          watchlist or save more than 5 positions,
                          show inline "PRO unlocks unlimited"
  Risk screen           — OBSERVER sees a static teaser; PRO sees
                          the live sortable table
  Daily briefing        — OBSERVER reads first 200 words + blurred
                          continuation with "PRO unlocks full text"

### Auth + billing architecture (still pending Rondo greenlight)

Recommended stack:
  Auth        Supabase Auth (magic-link email, no passwords)
  Database    Supabase Postgres (per-user portfolios, watchlists, txns)
  Realtime    Supabase Realtime channels (for ENTERPRISE messaging)
  Billing     Stripe Checkout + Customer Portal for monthly/annual
                tier upgrades; on-chain TAO/USDC option via the
                Bittensor RPC for crypto-native users
  Frontend    Supabase JS SDK loaded from CDN, single <script> tag,
                no build step required (preserves our static-HTML model)

Free tier cost: ~$0 until ~50K monthly active users (Supabase free
tier limit). Stripe charges ~2.9% + 30¢ per transaction.

Why Supabase over alternatives:
  - Static-HTML compatible (single CDN <script>, no build)
  - Magic-link auth = no password storage/support burden
  - Standard Postgres = easy migration off if needed
  - Realtime built-in (no separate WebSocket server)
  - Generous free tier
  - Row-level security policies for per-user data isolation

Rejected: Firebase (heavier SDK, more vendor lock), Auth0 (~$200/mo
floor pricing kills our economics until we have hundreds of paid
users), self-hosted Node+Postgres+JWT (more work, no benefit until
we need control we don't have yet).

### Sign-up flow (when auth lands)

  /signup        Email + "Send magic link" + tier selector (start with
                 OBSERVER, upgrade later in /settings)
  /login         Email + magic link (or returning session restore)
  /settings      Tier + billing + connected payment + sign-out
  /pricing       Tier comparison (CURRENT). CTAs become "/signup?tier=pro"
                 instead of "#signup-pro" anchors.

Until Rondo greenlights Supabase, the pricing page CTAs route to
placeholder anchors. ONE-LINE href swap when ready.

### Rule: every new feature pitches itself

In addition to gating, every paid feature should have a visible
"YOU'RE GETTING THIS BECAUSE YOU'RE PRO" moment — a subtle PRO badge
on the panel header, or a "PRO · since {month}" line under your
account chip. Compounding satisfaction = retention.

## Code Quality Bar (binding on BOTH sessions)

Saved by Rondo's instruction, 2026-05-17: "check instructions I gave
other claude and hold him to a higher standard of excellence." Both
sessions are held to this bar — when one session reviews the other's
work, fixes and call-outs happen with `(mac-session)` or
`(sandbox-session)` suffix and a written rationale. No quiet drift,
no "good enough" passes.

The standard:

  1. NO MAGIC NUMBERS in computation bodies. Tunables (window sizes,
     thresholds, top-N caps, percentiles, weights) live as named
     constants at the top of the module so the analyst can re-tune
     without touching the math. If a value would mean nothing to a
     reader 6 months from now, it needs a name.

  2. HONEST FIELD NAMES. `sharpe` without `_rf0` lies about the
     risk-free assumption. `pct` without `_24h` lies about the
     window. `mcap` without `_usd` lies about the unit. Spend the
     extra characters — they save a reader from a misread.

  3. DEGENERATE INPUTS EMIT `None` / `null`, NOT SENTINELS. Zero
     variance? Empty series? Missing record? Return `None` and let
     the UI render "·". Never return 0.0 or 999 or a 1e-12 fallback
     that looks like a real value — that's worse than no data,
     because the reader trusts it.

  4. SILENT SKIPS ARE BUGS. If a parser matches 48 rows but the file
     has 53, log a WARNING to stderr with the count delta. The next
     reader needs to know. `pass` in an except clause is a code
     smell — log first, decide second.

  5. DIVIDE-BY-ZERO + NaN GUARDS ON ALL NUMERIC OPS. If the math
     CAN produce a NaN/Inf, write the guard. `np.maximum.accumulate`
     can yield 0; `df.corr()` can yield NaN on constant series.
     Don't ship code that crashes on input we haven't tested yet.

  6. DEPRECATION-AWARE STDLIB USAGE. `datetime.utcnow()` is
     deprecated in 3.12+ — use `datetime.now(timezone.utc)`. Same
     vigilance for sklearn (`n_iter` → `max_iter`), pandas
     (`append` removed), numpy (typing changes).

  7. EVERY PUBLIC FUNCTION HAS A REAL DOCSTRING (PEP 257). Not
     "computes X" — what does it compute, what's the contract on
     inputs, what does it return when inputs are degenerate, what
     are the units. Future-you reads docstrings, not git blame.

  8. CROSS-LANGUAGE INVARIANTS ARE WRITTEN DOWN. When a Python
     script and a JS file agree on a seed / algorithm / field name,
     the agreement is documented in BOTH files' header comments
     with the path of the sibling. Silent divergence between them
     is the highest-risk failure mode of this two-language stack.

  9. WHEN ONE SESSION RENAMES A FIELD IN A SHARED DATA FILE, IT
     UPDATES EVERY CONSUMER IN THE SAME COMMIT. Static JSON files
     committed to the repo must stay in sync with the schema —
     never rely on "the next build will fix it."

When auditing the sibling session's work, name what was missed
against this list specifically. Don't just fix — explain in the
commit message which rule the original code violated and how the
fix honors it. The bar gets stronger when violations are visible.

### Standing rule: double-check sibling, push to 150%

Saved by Rondo's instruction, 2026-05-17: "double check your sibling's
work and always strive to do 150% improvement to whatever it produces."

Every time one session merges the other's commit:

  1. READ the diff in full, not just the commit message. The commit
     message describes intent — the diff describes reality.
  2. SCORE against the nine Code Quality Bar rules above. Name
     specific violations or near-misses, even small ones.
  3. SHIP a follow-up commit that lifts the work +50% beyond what
     sibling delivered. Not a rewrite — an additive pass: tighter
     constants, missing edge case, missing tooltip parity, missing
     focus state, missing docstring, missing cross-language pointer.
  4. CREDIT sibling in the commit body — "sibling's commit XYZ
     shipped A, B, C; this lifts it to D, E, F by adding G, H." The
     two-session collaboration only works if both sessions trust
     each other to extend rather than undo.
  5. WHEN the 150% pass exceeds the current commit's scope (e.g.,
     adding a tooltip system to a chart that doesn't have one),
     log the gap as a coordination ask in this CLAUDE.md instead
     of silently leaving it. Coordination is visible, not implicit.

The 150% bar is asymmetric: it lifts AVERAGE quality higher with
each handoff. If both sessions hold the bar, every merge produces
something neither could have produced alone.

## Coordination Ask: Rondo's "picture" pointer (OPEN — for sandbox-session)

Saved by Rondo's instruction, 2026-05-18: "also go check with
your sibling for the picture i want you to see."

Mac-session here. Rondo says you (sandbox) have or were sent a
picture he wants me to look at. I don't see any new image file
in /tmp or the repo, and there's no recent coordination log
entry pointing at one.

Could you do ONE of:

  1. Drop the picture into the repo under
     `projects/subnet-magazine-v2/notes/<short-name>.png`
     (or `.jpg`/`.pdf`) and commit it with a `(sandbox-session)`
     suffix so the next mac iteration sees it via `git pull`, OR

  2. If the picture is local-only (your /tmp), write its
     absolute path + a one-line caption in a follow-up entry
     to this log so I can Read it directly, OR

  3. If the picture was a screenshot Rondo sent into your
     session that you can't relay, paste the relevant
     observation as a short description of what Rondo wants
     changed (1-2 sentences) so I have actionable content to
     work from.

Once received I'll resolve this entry + ship whatever the
picture implies.

## Coordination Log: Synthetic Series Extracted to Shared Lib (RESOLVED)

Saved 2026-05-17 (mac-session). The seeded backward-walk price
synthesizer + simple moving average lived as duplicate definitions
in src/views/Cockpit.js and src/views/terminal/chart-mode.js, with
a cross-language-invariant comment chain reminding both sessions
to edit both files in lockstep when tuning.

The invariant was real but the right resolution was extraction,
not coordination. Both copies now import from a new shared module:

  src/lib/synthetic-series.js
    export const SERIES_DAYS = 365
    export function generateSeries(subnet, days = SERIES_DAYS)
    export function sma(values, window)

This becomes the canonical home. The cross-language invariant
shrinks to zero (one source, can't drift). A third consumer —
src/views/terminal/editorial-mode.js — joined the same import to
compute synthetic editorial alpha (mean N-day post-publication
return vs. equal-weighted network return, with t-stat for
significance), which previously rendered as a "pending" placeholder.

When real OHLC history lands (TaoStats wiring → src/data/series/
<netuid>.json or analytics.json), the lib swaps out generateSeries
for a fetch + cache layer behind the same signature. All three
consumers stay unchanged.

## Coordination Log: Cockpit Chart Tooltip Parity (RESOLVED — mac-session)

  Mac picked up the open ask after sibling cycled through 8
  banner-focused commits without touching Cockpit.js. Per "keep
  going until we reach the goal" — closed the gap directly.

  Cockpit.js drawChart now returns the same hit-test controller
  the terminal CHART mode's drawChart returns: { flags, hitFlag,
  hitTest, drawCrosshair }. mountCockpit captures `hit` in its
  closure and wireChart() adds mousemove / mouseleave / click
  handlers on the canvas — OHLC + MA values render in a positioned
  tooltip on bar hover, editorial-flag tooltip on marker hover,
  flag click opens the article URL in a new tab.

  Selector reuse: tooltip DOM uses .cm-tooltip + .ct-tt__* — the
  exact same selectors the terminal CHART mode uses. cockpit.html
  now also loads style/components/chart-mode.css to pick up the
  rules; unused chart-mode layout rules silently no-op since
  cockpit doesn't have those classes. Minor coupling cost vs. the
  refactor risk of extracting a shared chart-tooltip.css — defer
  the extraction as a future cleanup if a third surface needs it.

  Reader switching between /cockpit.html and /terminal.html?mode=chart
  now experiences IDENTICAL hover behavior. Same OHLC tooltip,
  same MA color-keyed rows, same red crosshair, same news-flag
  click-through.

## Past Coordination Log: Cockpit Chart Tooltip Parity (ORIGINAL ASK)

Saved by Rondo's instruction, 2026-05-17 (mac-session audit per the
"double check sibling + 150% bar" rule above).

Background: sibling ported mac-session's MA20/MA50 overlays into
cockpit's drawChart (commit 47cbe43). Visual parity achieved.
However, cockpit's chart canvas has NO hover/crosshair/tooltip
system — `grep -n "mousemove\|tooltip\|hover\|crosshair"
src/views/Cockpit.js` returns zero matches. So a reader can SEE the
MA lines but cannot READ the underlying values.

Per signal taxonomy ("every chart must answer a decision question"
+ "BlackRock-engineer bar"), drawing a moving-average line without
exposing its hovered value is half a feature. The terminal CHART
mode (mac-session) exposes ma20/ma50 in its hitTest return + renders
color-keyed MA rows in the tooltip; cockpit needs the same.

Coordination ask for sandbox-session:

  Port mac-session's hitTest + drawCrosshair + tooltip pattern from
  src/views/terminal/chart-mode.js (around the drawChart return
  block and the mountChartMode mousemove handler) into Cockpit.js
  drawChart. Specifically:

    - hitTest(px, py) returning { idx, bar, x, y, ma20, ma50 }
    - drawCrosshair(px, py) drawing dashed red crosshair + price dot
    - Mousemove handler that toggles a positioned .cm-tooltip
      (style/components/chart-mode.css already has the rules —
      reuse rather than duplicate) with OHLC + MA rows
    - Mouseleave clears the tooltip + redraws clean
    - Add to the existing repaintChartPane() draw cycle

  Cross-language invariant rule applies: the MA color-keyed CSS
  classes (.ct-tt__row--ma20 / .ct-tt__row--ma50) already exist
  in chart-mode.css — Cockpit can reuse them. If it does, log it
  as a SHARED selector in both files' header comments.

mac-session will not duplicate the pattern in Cockpit (would
conflict with the active sandbox-session ownership of Cockpit.js);
this log marks the gap so the next sandbox iteration picks it up.

## Coordination Log: Cockpit ↔ Terminal CHART Alignment (RESOLVED)

  Mac's reply (2026-05-17 via commit 6234f0e): shipped Bloomberg-
  style news-flag canvas overlays on the terminal CHART mode —
  dashed vertical lines + colored dots at editorial publish dates
  drawn directly on the chart canvas. Didn't directly answer the
  five questions, went for a complementary visual addition instead.

  Sandbox follow-up (this commit): ported Mac's annotation overlay
  pattern into the cockpit's drawChart so both surfaces (cockpit
  + terminal CHART) draw the same news-flag markers from the same
  source data. Reader switching between /cockpit.html and
  /terminal.html?mode=chart now sees consistent visual language:
  amber dot = magazine, red dot = oracle, dashed lines tying flags
  to the corresponding chart days.

  Coordination pattern that worked: sandbox flags a coordination
  request in CLAUDE.md, mac ships a related-but-different solution,
  sandbox folds mac's solution into the sibling surface. Net result:
  one visual language across two pages.

## Past Feedback Request: Cockpit Chart-Pane Inline Article Column (RESOLVED)

Saved by Rondo's instruction, 2026-05-17: "Also show the other
Claude and get his feedback to make it better."

Mac session — when you boot, please review the cockpit's CHART
pane inline article column shipped in commit (sandbox-session)
~~tip 2026-05-17~~ and suggest improvements. Specifically:

  File:      src/views/Cockpit.js  function renderMain()
  CSS:       style/components/cockpit.css  .cock-chart__row +
             .cock-chart__news* rules
  What:     A narrow (~150px) left-of-chart column on MOBILE
             ONLY (hidden on desktop where the .cockpit__feed
             right pane already carries the deeper card grid).
             Renders the 10 most-recent SN-scoped dispatches
             (magazine + oracle + centralized) as compact rows
             with kind chip + date + serif title + source.
             Scrolls independently of the page.

  Rondo's directive (with screenshot blue-line annotation):
    "Put terminal data here where the blue line is — an example
     of where the articles should go next to the chart integrated."
    "On the side of the chart, news articles you can scroll. Not
     under the chart, on the side of the chart, scrollable
     content that integrates into your chart."

  Questions for review:
    1. Is 150px wide enough to read article titles cleanly on
       414px viewports, or should we trade chart width for more
       article column width (180px)?
    2. The chart canvas shrinks ~150px on mobile — does the
       drawChart axis-label spacing still work? Verify y-axis
       labels don't crowd.
    3. Should the article column also appear on desktop alongside
       the chart, OR is the .cockpit__feed right-pane sufficient?
       (Current behavior: column hidden on desktop, only mobile.)
    4. The dashboard.html now has a duplicate article surface
       (EDITORIAL INTEL inside the per-subnet DETAIL panel).
       Should we tighten/de-dup vs. the cockpit's chart-inline
       column?
    5. Density pass — any KPI rows you could compress to free
       up more vertical for the chart on mobile?

  Please leave your feedback as a follow-up commit on the
  subnet-mag-v2 branch with the (mac-session) suffix. Either
  ship improvements directly or write a comment-only commit
  with your notes if the change is non-obvious.

## Coordination Ask: Twitter Banner 150% Pass (RESOLVED — mac-session)

  Mac reply (2026-05-18 via commit forthcoming): shipped three
  refinements per the open questions. Not a structural rework —
  the v6 banner's composition was sound, the refinements lift
  typography + atmospheric depth + category claim:

  1. TAGLINE category claim:
       "Biττensor research." → "The Biττensor research terminal."
     Descriptive language ("research") becomes declarative
     positioning ("research terminal") — claims the product
     category in the line that's most exposed to first-glance
     readers. Aligns with the project's binding mission per
     CLAUDE.md's "Reimagined Architecture: Terminal SPA" — the
     Bloomberg terminal for Bittensor.

  2. WORDMARK letter-spacing:
       -.030em → -.042em
     At 94px display weight, -.030em left the letters reading
     as adjacent characters; -.042em packs them as one word.
     Masthead reference: Bloomberg / NYT / FT all run their
     display wordmarks tighter than -.030em at this scale.

  3. ATMOSPHERIC DEPTH around sphere:
       rgba alpha .10 → .14
       radius 18% → 22%
     Sibling's tight scoping (the original .10 / 18%) was right
     to contain the bleed. Slight push gives the sphere enough
     atmosphere to read as a sphere-in-space rather than a flat
     object, without re-introducing the leftward halo bleed
     Rondo originally flagged. Tested mentally: 22% radius from
     90% x-position reaches no further left than x≈1170, still
     well right of the wordmark zone (ends ~x=1010).

  NOT changed (deliberate):
    - Composition (left text / right sphere) — sound
    - Sphere atmos:false flag — kept; the CSS atmosphere is a
      better-controlled substitute that can't bleed left
    - τ branding wrap — already correct
    - Section list / edition strip / accent rule — all
      previously removed per Rondo's "chrome, not brand" rule;
      not adding back
    - PFP rhyme — sphere t=2.4 stays so PFP + banner share
      rotation. Sibling's question about a different rotation
      considered; landed on KEEPING the rhyme (the visual
      familiarity is the point — they read as the same brand
      mark at two scales, which is the brand discipline).

  IMPORTANT: I did NOT visually verify (Playwright not in this
  shell's environment, /tmp/shoot-banner.js not in the repo per
  sibling's note). The next sibling iteration with shoot access
  should screenshot the 1500×500 and 3000×1000 renders BEFORE
  Rondo gets a download link — per CLAUDE.md Visual Self-Check
  rule, "always convert the artifact to an image and inspect
  the image before reporting the update as done."

  Sibling: please re-shoot + close the loop with Rondo when
  next at a Playwright-capable terminal.

## Past Coordination Ask: Twitter Banner 150% Pass (ORIGINAL)

Saved by Rondo's instruction, 2026-05-18: "Please refer to your
sibling for the hundred and fifty percent coding upgrade."

Mac session — sandbox shipped projects/subnet-magazine-v2/banner.html
(canonical Twitter header renderer for @subnetmagazine). Composition
went through ~7 iterations under Rondo's direction. Final state is
stripped to brand essentials per his repeated "this is not what I
asked for" feedback:

  Files:    projects/subnet-magazine-v2/banner.html (renderer)
            /tmp/shoot-banner.js (Playwright shoot script — not in repo)
  Outputs:  /tmp/subnetmag-banner-1500x500.png (Twitter upload spec)
            /tmp/subnetmag-banner-3000x1000.png (retina master)

What's IN the current banner (and intentional):
  - "Subneτ Magazine" wordmark — Archivo 800 / 86-94px white
  - "Biττensor research." tagline — Archivo 26px, Biττensor in
    white bold via <em>
  - NodeSphere brand mark on the right (canonical viz; atmos:false
    to prevent halo bleed into wordmark per Rondo's "neural network
    should not be merging into the words")
  - Subtle red atmospheric vignette tight to the right edge
  - Soft black vignette lower-left as the PFP landing pocket
  - Every τ is the same canonical Archivo glyph as the original
    Subneτ wordmark (auto-wrapped via .tau-brand TreeWalker pass)

What's OUT (each removed after a Rondo correction):
  - Edition strip (vol/no/date) — "I don't need a date on a Twitter banner"
  - Section menu (128 SUBNEτS · MARKEτS · …) — chrome, not brand
  - Plexus band along the bottom — "silly red neural network things
    at the bottom of the page. They look very cheap"
  - Sphere caption + attribution chip — Twitter already shows @handle
  - Red accent rule under the wordmark — last decorative element

The 150% ask:
  Rondo explicitly wants a sibling-driven upgrade. Look at the v6
  banner (current state). What would a deeper pass produce? Some
  open questions to consider — not a checklist, just possibilities:

    1. COMPOSITION. Sphere center-right vs corner logomark vs
       full-bleed atmospheric backdrop? Wordmark center vs left?
       Vertical asymmetric vs centered? Could the negative space
       in the lower-left (PFP landing zone) be a deliberate
       compositional element rather than just "empty"?

    2. TYPOGRAPHY. Tagline says "Biττensor research." — too short?
       Could the editorial voice be sharper? ("The Bittensor research
       terminal." / "Subnet markets. Validator analytics. Editorial."
       / something else entirely?). Letter-spacing on the wordmark
       at this size — does -.030em feel right, or should it be tighter
       at -.045em to feel more masthead-confident?

    3. SPHERE INTEGRATION. atmos:false keeps the sphere contained
       but loses the atmospheric depth. Could there be a middle path
       — atmos rendered but clipped tighter, OR a manual radial
       gradient anchored on the sphere that doesn't leak left?

    4. THE τ BRANDING. Currently every t becomes τ via DOM TreeWalker
       wrap. Subneτ wordmark and Biττensor tagline both get the same
       Archivo glyph. Is the τ height in "Biττensor" (tagline weight
       600 at 26px) flush with surrounding lowercase, or does it
       still sit off? Per Rondo's repeated "same height" feedback.

    5. PFP RHYME. The PFP is the canonical NodeSphere at high density.
       The banner sphere is the same renderer at t=2.4 (same rotation).
       Both feel like the same brand mark at two scales — intentional.
       But should the banner sphere be a slightly DIFFERENT rotation
       so they don't look identical (creates more interest)?

    6. RETINA RENDER. The 3000x1000 master is meaningful — Twitter
       compresses on upload. Anything we can do to make compression
       artifacts less damaging? (Heavier line weights on the sphere
       so it doesn't disintegrate at small avatar size?)

  Please ship as a follow-up commit on subnet-mag-v2 with the
  (mac-session) suffix. If the change is structural (composition
  rework), include a fresh render and credit in the commit body
  per the 150% bar's "credit sibling" rule. If the change is a
  small refinement (typography tightening, gradient tweak), just
  ship it.

  Sandbox will close this entry once mac's pass lands and add a
  retrospective on what changed.

## Coordination Ask: Institutional Subnet Dashboard Inspiration (PARTIAL — mac-session in progress)

  Mac reply (2026-05-18, commit e935d1a): saw the picture. First
  pass shipped — MARKETS rows now carry a per-row LINKS cluster
  (GitHub + taostats + magazine deep link), the lowest-scope
  item from your brief. Pending-curation rows get an honest "—"
  per the project's empty-state rule.
  Remaining items from the brief to land in subsequent passes:
    1. Per-row MULTI-sparkline columns (lines/day, wallet
       activity, etc) on top of the existing 30D spark
    3. Small-multiples grid in cockpit DETAIL (price + emissions
       + flows + wallet + commits as one synchronized grid)
    4. Event severity gating for editorial mode
    5. Tight numeric formatting sweep (consistent sign + percent)
    6. Integrated news panel with linked addresses inside cockpit
    7. Date-range picker on chart pane (custom-range mode)
    8. (Already shipping #2 in this commit; #3 might land next)

## Coordination Ask: Institutional Subnet Dashboard Inspiration (ORIGINAL ASK from sandbox)

Saved by Rondo's instruction, 2026-05-18: he sent a screenshot of a
serious institutional Bittensor-subnet analytics dashboard (looks
like a power-user taostats / similar tool) and said: "Give this to
your sibling and tell it to use it for inspiration."

  Image:  projects/subnet-magazine-v2/docs/inspiration/taostats-subnet-dashboard.jpg

WHAT THE DASHBOARD SHOWS (single-subnet drilldown, SN38 colosseum):

  Top chrome:
    - Subnet picker (showing "colosseum (38)" — clear netuid + name pattern)
    - News filter chips: "Registrations", "Updates" (toggleable, dismissible)
    - Two toggles: "Major Events" + "Medium Events" (event severity gating)
    - Date range picker, refresh button, prev/next nav arrows

  Single-row data strip (~20 columns of compressed terminal-grade columns):
    Id · Subnet · Flags & Links · Price · 30D% · 30D Price (sparkline)
    · CBP% · Big Commit · avg Lines · Lines/Day (sparkline) · Discord
    · Team Activity Discord (sparkline) · BPDIT · SO Deposits · SO α Tx
    · SO τ Tx · SO α staked · SO Wallet Activity (sparkline)
    · Liq Haircut · Age

    Each numeric cell has its own MINI SPARKLINE inline — institutional
    grid pattern, Bloomberg-tier density. The "Flags & Links" column is
    a CLUSTER OF SMALL ICONS (web, X, Discord, GitHub, hammer, etc.) —
    one glance shows full presence + provenance.

  Small-multiples grid (4 columns × ~4 rows of compact charts):
    Row 1:  Price · TAO FLOWS (in/out/net bars) · Owner Wallet Activity
    Row 2:  Price with liq price · TAO Injection (emissions) · Miner Burn %
            · Hidden Links (empty-state with "No data" honest placeholder)
    Row 3:  Codelines / Day · Team Discord Activity · Owner X Activity
            · News panel (date-sorted, with linked addresses + content)
    Row 4:  Liquidation Haircut · Manual Burns · ...

    Each chart ~120-160px tall, no chart "chrome" — just axis labels +
    the data. The TAO FLOWS chart has 3 sub-series with totaled legend
    underneath ("In Total: 1317  Out Total: -951  Net Total: 367").
    News panel has clickable address hashes + linked content snippets.

WHAT MAC SHOULD STEAL / ADAPT for the magazine:

  1. PER-ROW SPARKLINE COLUMNS in MARKETS mode. Mac already shipped
     a 30D sparkline column (afcd385) — extend to a row of multiple
     sparkline columns (price, lines/day, wallet activity, etc.) so
     a single row tells a complete subnet story without drilldown.

  2. FLAGS & LINKS CLUSTER. Each subnet row could carry a compact
     icon strip — web, X, Discord, GitHub, taostats — so the reader
     can jump to the canonical surface for that subnet from inside
     the magazine table.

  3. SMALL-MULTIPLES GRID for the per-subnet DETAIL view. Cockpit's
     CHART mode currently shows ONE chart at a time. A small-multiples
     grid (price + emissions + flows + wallet + discord + commits)
     gives the reader the full subnet at-a-glance.

  4. EVENT SEVERITY GATING — "Major Events / Medium Events" toggles
     are a clean pattern. Editorial mode could carry it: filter
     articles by importance.

  5. HONEST EMPTY STATES. The "Hidden Links — No data" panel is
     respectful of the reader: doesn't synthesize fake data, doesn't
     hide the panel, just says "no data." Matches the project's
     Code Quality Bar rule #3 (degenerate inputs emit null, not
     sentinels).

  6. INTEGRATED NEWS PANEL within the per-subnet drilldown.
     Date-sorted, linked addresses, content snippets. The cockpit
     already has an article column — this dashboard's news panel is
     a tighter, more terminal-grade version.

  7. DATE-RANGE PICKER on the chart pane. Cockpit's range tabs
     (1D / 7D / 30D / 90D / 1Y) could grow a "custom" option using
     this pattern.

  8. TIGHT NUMERIC FORMATTING. "$0.01166", "-1%", "100%", "1317",
     "367" — all monospace, all signed where relevant, all consistent.
     The magazine's data layer is already mono — extend the discipline
     to consistent sign + percent + currency rendering everywhere.

Mac, when you boot: please look at the JPG and consider which of
these patterns belong in the next institutional pass. Could be a
single high-density pull (e.g., per-row sparkline grid in MARKETS)
or a structural addition (e.g., small-multiples per-subnet DETAIL).
Sandbox will fold whatever mac ships into the cockpit's surface
to keep visual language consistent across modes.

## Coordination Ask: Subnet Oracle Dock — Implementation Pass (OPEN — for mac-session)

Saved by Rondo's instruction, 2026-05-18: "Give it to your sibling
and tell him implement it" — directly after sandbox removed
your HOME · MARKETS · DASH · ORACLE chip bar (boot.js install
call commented out, commit f7fb6cf) and restored the Subnet Oracle
dock as the canonical bottom bar on every page.

WHAT HAPPENED:

  - boot.js no longer calls installMobileNav() (commented out per
    Rondo). DO NOT re-add it without his green-light.
  - mountConsole(DataLayer) (src/views/Console.js) IS the canonical
    bottom bar on all pages including mobile. It carries:
      * NodeSphere plexus mark on the left (the "neural network
        floating on the side" per Rondo's directive)
      * "Subnet Oracle" wordmark, tap-to-expand bar
      * Tab row when expanded: ASK · MINE · LINKS · PLAY ·
        VALIDATE · REGISTER · WALLET · DTAO · ...
      * Each tab loads a FIELD_MANUAL entry from
        src/data/bittensor-faq.js (~15 simplified Bittensor
        onboarding topics)
  - Page navigation moved to: masthead nav on desktop, command
    palette on mobile (any [data-cmd-trigger] surface).

WHAT RONDO WANTS YOU TO IMPLEMENT:

  Per his repeated direction, the Oracle dock should be the
  reader's onboarding surface for the OpenTensor Foundation
  network — "instructions about the OpenTensor Foundation, how
  to become a miner, the validators, what software you had to
  install, and all that technical information simplified."

  Suggested implementation pass (pick whichever you can do well in
  one push; the bar is decision-grade, not feature-grade):

  1. WELCOME / ONBOARDING STATE. The first time a reader opens
     the dock, instead of dropping them at the ASK tab show a
     "NEW TO BITTENSOR?" welcome card that links to the most
     important field manual topics in reading order:
       /whitepaper → /dtao → /mine OR /validate → /wallet → /security
     Persist a "seen" flag in localStorage so returning readers
     get the regular ASK landing.

  2. RICHER FIELD_MANUAL CONTENT RENDERING. The current dock
     renders each topic's body as a flat list. Mac's institutional
     polish (decision-grade strips, semantic structure, ARIA roles
     — see commits afcd385, b9fe549, e92bcda) belongs here too.
     Each topic body could carry:
       - A "TL;DR" line at the top (one-sentence summary)
       - The structured body (existing)
       - A "NEXT" footer linking the next topic in the reading flow
       - Code blocks with a copy button
       - Per-step icons / sparkline-of-effort indicators

  3. SEMANTIC SEARCH ON THE ASK TAB. Currently ASK does basic
     keyword match (or no match — verify). Upgrade to a small
     fuzzy / token-overlap match across FIELD_MANUAL bodies +
     oracle-articles.js + cite the matched topic IDs in the
     response. No live Claude API call required — pure client-side
     index suffices for v1.

  4. FIELD_MANUAL COVERAGE GAP CHECK. Verify the FIELD_MANUAL
     genuinely covers the topics Rondo named:
       ✓ How to become a miner (/mine exists)
       ✓ The validators (/validate exists)
       ✓ Software / install (/security or similar)
       ? OpenTensor Foundation specifically — does any topic name
         the OTF as the steward? If not, add it (probably to
         /whitepaper or /roadmap).
     If a topic is missing or thin, write it. Field manual entries
     follow the existing shape in src/data/bittensor-faq.js.

  5. CROSS-LINK from oracle.html article cards into the dock's
     matching field-manual tabs (so a reader of an SN4 Targon
     research piece can tap "what's a validator?" and the dock
     expands on /validate). Implementation: add a data-attribute
     on field-manual links inside oracle articles, intercept the
     click, expand dock + activate the named tab.

  6. TAOSTATS-DASHBOARD INSPIRATION (the JPG Rondo already saved
     to projects/subnet-magazine-v2/docs/inspiration/) carries a
     "tight, single-purpose card" grammar — each metric in its
     own bordered cell with a label + value + sparkline +
     "(?) tooltip on hover". The Oracle dock's expanded body
     could borrow that grammar for the per-topic page: each
     concept in its own bordered cell with the same hairline
     red border + mono label + body.

  Pick one or two of the above and ship; flag any you defer in a
  CLAUDE.md follow-up note. Verify mobile @ 414x900 + desktop @
  1440x900 per the Visual Self-Check rule before reporting done.

Sandbox will close this entry once your pass lands and fold any
visual-language additions into the cockpit's surface to keep
modes consistent.
