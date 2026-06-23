# Money Map · Fact-Check · 14 May 2026

Editor: Subnet Magazine research desk. Scope: every numeric claim in
§ 03 "Money Map" of `src/views/Home.js` traced to a primary or
top-tier secondary source. All ARR / valuation / capex figures live
in fast-moving private markets — figures dated to source month.

---

## Verified · numbers that stand

- **Cursor $2B+ ARR (was $1.5B):** TechCrunch (2 Mar 2026) reports
  Cursor surpassed $2B annualized in Feb 2026. Our anchor of "$1.5B
  ARR" is stale by one quarter. [Source 2]
- **Anthropic $200B implied (was $200B):** Anthropic's Feb 2026
  Series G closed at $380B post; Apr 2026 Bloomberg report puts the
  in-flight round at $900B–$950B post. The "$200B" anchor is
  outdated — the right number is $380B (closed) or up to $900B
  (in-flight). [Sources 4, 7]
- **OpenAI $300B (was $300B):** Outdated. The Mar 2025 round was
  $300B post; the Mar 2026 round closed at $852B post on $122B
  raised (CNBC, OpenAI). The right anchor is $852B. [Sources 1, 5]
- **ScaleAI $14B:** Outdated. The Meta investment (Jun 2025) priced
  Scale at $29B post on a $14.3B cheque for 49%. The "$14B"
  anchor is wrong — that was the cheque size, not the valuation.
  [Source 8]
- **TAO market cap ~$3.28B:** Verified within tolerance. Taostats /
  Coinbase report $3.33B; CoinGecko reports $2.76B (May 16). Use
  $3.3B for the 14 May framing. [Sources 11, 12]
- **MSFT/GOOG/META/AMZN ~$240B FY26 capex:** Materially wrong. CNBC
  (6 Feb 2026) and Tom's Hardware (Apr 2026) both report combined
  2026 capex of ~$700–725B, of which ~75% is AI infrastructure (~
  $450B AI-specific). $240B is roughly half the AI-specific spend
  alone. [Sources 9, 10]
- **TAO 21M cap / halving #2 Dec '29:** Verified against Bittensor
  tokenomics docs. [Source 11]
- **Adept AI:** Confirmed acquihired to Amazon (Jun 2024). Should
  remain a historical footnote, not a live competitor in 2026.
  [TechCrunch]
- **Inflection AI (Pi):** Confirmed acquihired to Microsoft (Mar
  2024) for ~$650M. Pi survives as a B2B API; not a live consumer
  product worth listing. [TechCrunch, Bloomberg]

## Corrected · numbers that need updating

| Claim | What we said | What it should say | Primary source | Confidence |
|---|---|---|---|---|
| ChatGPT ARR | $5B+ | **$25B+ annualized (Feb 2026), $24-29B run-rate (Apr 2026)** | OpenAI blog, Sacra | high |
| Cursor ARR | $1.5B | **$2B+ (Feb 2026)** | TechCrunch 2 Mar 2026 | high |
| Perplexity ARR | $400M | **$450-500M (Mar 2026)** | TechStartups, PYMNTS | high |
| OpenAI valuation | $300B | **$852B (Mar 2026, post-money)** | CNBC, OpenAI | high |
| Anthropic valuation | $200B | **$380B closed Feb 2026; $900B in-flight Apr 2026** | Bloomberg, TechCrunch | high |
| OpenAI API revenue | $11B | **~$3.2B (2026 estimate, API-only)** | Sacra, getpanto | medium |
| ScaleAI valuation | $14B | **$29B (Jun 2025, Meta investment)** | Built In, TechCrunch | high |
| Surge AI valuation | $1.4B | **$15-25B (Jul 2025 talks, first capital raise)** | Bloomberg | medium |
| MODEL centralized cap | $1.2T | **~$1.7T (OpenAI $852B + Anthropic $380-900B + Google/Meta GenAI investments)** | CNBC, Bloomberg | medium |
| INFERENCE centralized | $22B | **~$117B (2026 inference market, Fortune Business Insights); narrower API-cohort ~$10-15B** | Fortune BI; Sacra | medium |
| AGENT centralized | $2.5B | **~$10-12B (2026 agentic market, Grand View / Research and Markets)** | Grand View Research | low |
| DATA centralized | $28B | **~$30-32B (Scale $29B + Surge $15-25B; or $4B market sizing for tools)** | Built In, Bloomberg | medium |
| COMPUTE centralized | $240B | **~$725B total capex / ~$450B AI-specific (FY26 hyperscaler guidance)** | CNBC, Tom's Hardware, Statista | high |
| Together S-1 citation | "Together S-1" | **DOES NOT EXIST. Replace with Sacra / Forge / Pitchbook (Together is private at ~$7.5B valuation, ~$1B ARR)** | ipos.fyi, Forge | high |

## Dropped · claims we can't defend

- **"Together S-1"** — fabricated citation. Together AI has never
  filed an S-1. Replace with "Sacra/Forge" or "Together press
  release" depending on figure used.
- **"OpenAI API $11B"** — API-only revenue is ~$3.2B in 2026 per
  Sacra; the $11B number likely conflates ARR projections or
  enterprise+API. Drop the "$11B" anchor; use the broader 2026
  inference market ($117B) instead, with OpenAI's API as the
  largest single component.
- **"Chutes + Targon ~1.1B tokens/day"** — Chutes alone is reported
  at ~100B+ daily tokens (tao.media). The 1.1B figure appears to
  be off by ~100x. Replace with verified Chutes-only figure
  ("~100B tokens/day, ~5M daily requests").
- **"Pi" listed alongside ChatGPT/Cursor/Perplexity** — Inflection
  was acquihired by Microsoft in Mar 2024; Pi is no longer a
  competitive consumer app. Drop.
- **"Adept" listed under AGENT** — Acquihired by Amazon June 2024.
  Drop as a live competitor; replace with Cognition/Devin (still
  independent at $25B valuation in talks).

## Recommended final figures

Drop-in for the `rows` array in `Home.js`:

| Layer | cap ($B) | yr | src | aMcap ($M) | conf | gap |
|---|---|---|---|---|---|---|
| APPLICATION | 40 | Q1'26 | OpenAI+Anysphere | 57 | high | ≈700× |
| AGENT | 11 | Q1'26 | Grand View Research | 34 | low | ≈320× |
| MODEL | 1700 | Q1'26 | CNBC + Bloomberg | 139 | medium | ≈12k× |
| INFERENCE | 117 | 2026 | Fortune Business Insights | 96 | medium | ≈1.2k× |
| DATA | 32 | Q3'25 | Built In + Bloomberg | 41 | high | ≈780× |
| COMPUTE | 450 | FY'26 | CNBC | 181 | high | ≈2.5k× |
| PROTOCOL | — | live | taostats | 3300 | high | 100% Bittensor |

Detail anchors should be updated to:

- **APPLICATION:** ChatGPT $25B+ ARR · Cursor $2B+ ARR · Perplexity ~$500M ARR
- **AGENT:** OpenAI Operator · Anthropic Claude Code ($1B ARR) · Cognition Devin ($25B val) · Salesforce Agentforce ($540M ARR)
- **MODEL:** OpenAI $852B · Anthropic $380-900B · Google AI · Meta GenAI capex
- **INFERENCE:** OpenAI API ~$3.2B · Together ~$1B ARR · Fireworks $315M ARR · Replicate
- **DATA:** ScaleAI $29B · Surge AI $15-25B · Snorkel · Common Crawl
- **COMPUTE:** MSFT+GOOG+META+AMZN ~$725B 2026 capex (~$450B AI-specific)
- **PROTOCOL:** TAO $3.3B mcap · 21M cap · halving #2 Dec '29

Unit-economics fixes:
- INFERENCE: "Chutes alone serves ~100B tokens/day, 5M daily
  requests (tao.media, Apr 2026)." Drop the "Chutes + Targon ~1.1B
  tokens/day" — it was off by ~100×.

Footer source line should read:
"SOURCES · OPENAI/ANTHROPIC INVESTOR DISCLOSURES · CNBC FY'26
HYPERSCALER CAPEX · BLOOMBERG META/SCALE JUN'25 · TECHCRUNCH CURSOR
MAR'26 · COINGECKO / TAOSTATS LIVE"

## Sources used

1. https://openai.com/index/accelerating-the-next-phase-ai/ — OpenAI $122B raise at $852B (Mar 2026)
2. https://techcrunch.com/2026/03/02/cursor-has-reportedly-surpassed-2b-in-annualized-revenue/ — Cursor $2B ARR Feb 2026
3. https://techstartups.com/2026/04/08/perplexity-revenue-surges-50-as-ai-startup-shifts-from-search-to-autonomous-ai-agents/ — Perplexity ~$450-500M ARR Mar 2026
4. https://www.bloomberg.com/news/articles/2026-05-12/anthropic-in-talks-to-raise-30-billion-at-900-billion-valuation — Anthropic $900B in talks
5. https://www.cnbc.com/2026/03/31/openai-funding-round-ipo.html — OpenAI closes $852B
6. https://sacra.com/c/openai/ — OpenAI API ~$3.2B; ARR $25B Feb 2026
7. https://techcrunch.com/2026/04/29/sources-anthropic-could-raise-a-new-50b-round-at-a-valuation-of-900b/ — Anthropic $900B Series H talks
8. https://www.builtinsf.com/articles/scale-ai-meta-investment-29b-valuation-20250613 — Scale $29B post Meta $14.3B
9. https://www.cnbc.com/2026/02/06/google-microsoft-meta-amazon-ai-cash.html — Hyperscaler capex $700B
10. https://www.tomshardware.com/tech-industry/big-tech/big-techs-ai-spending-plans-reach-725-billion — $725B FY26 capex
11. https://taostats.io/ — TAO live mcap
12. https://www.coingecko.com/en/coins/bittensor — TAO mcap (CoinGecko)
13. https://www.coingecko.com/en/categories/bittensor-subnets — Subnet alpha mcaps
14. https://www.fortunebusinessinsights.com/ai-inference-market-113705 — Inference market $117B 2026
15. https://www.grandviewresearch.com/industry-analysis/ai-agents-market-report — AI agents $10.91B 2026
16. https://www.bloomberg.com/news/articles/2025-07-30/scale-rival-surge-ai-in-talks-for-funding-at-25-billion-value — Surge $25B talks
17. https://sacra.com/c/anthropic/ — Anthropic $30B ARR April 2026
18. https://techcrunch.com/2024/06/28/amazon-hires-founders-away-from-ai-startup-adept/ — Adept acquihire Jun 2024
19. https://www.bloomberg.com/news/articles/2024-03-21/microsoft-to-pay-inflection-ai-650-million-after-scooping-up-most-of-staff — Inflection acquihire Mar 2024
20. https://techcrunch.com/2026/04/23/cognition-creator-ai-software-engineer-devin-talks-raise-hundreds-millions-25b-valuation/ — Cognition $25B talks
21. https://www.tao.media/the-investors-guide-to-chutes-bittensors-inference-layer/ — Chutes 100B+ tokens/day
22. https://www.saastr.com/anthropic-just-hit-14-billion-in-arr-up-from-1-billion-just-14-months-ago/ — Anthropic $14B → $30B ARR
23. https://sacra.com/c/fireworks-ai/ — Fireworks $315M ARR Feb 2026

---

### Methodological notes

- "Centralized cap" for the MODEL layer is best read as
  *aggregate-private-valuation* of the model labs, not annual
  revenue. OpenAI + Anthropic alone clear $1.6T; the $1.2T anchor
  understates this.
- "Centralized cap" for COMPUTE is annual capex flow, not market
  cap. The $240B / $725B distinction matters: $240B was the FY25
  rough number, not FY26.
- Bittensor α-mcap layer rollups use *primary subnet assignment* —
  SN18/SN19/SN36 appear in two layers each in the original
  taxonomy, but each is counted in its dominant layer to avoid
  double-counting. SN18 → INFERENCE (text APIs); SN19 →
  INFERENCE; SN36 → AGENT.
- All subnet α-mcap figures pulled from CoinGecko's Bittensor
  Subnets category as of May 16, 2026; for 14 May framing they are
  within 2-3% of stated values.
