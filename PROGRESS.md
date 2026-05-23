# Progress

Last updated: 2026-05-23 (Session 7)
Current phase: Phase 1 — Python Foundations
Current topic: Phase 1, Deitel Ch.1 — Python is primary. **Full
six-operator comparison family LOCKED**: `==`, `!=`, `<`, `>`,
`<=`, `>=` all *Taught* (`<=` graduated session 7 with
three-for-three cold predicts on equality leg, less-than leg, and
neither leg). **Boolean operators `and`, `or`, `not` are
*Taught***: truth tables introduced (Boole 1854 foundation),
predict-verified four-for-four, three of four REPL-verified
(`True and False` predicted correctly but not REPL-paste-confirmed).
**Compound predicates (Step 8) are *Introduced***: started during
session 7, closed mid-walk at 97% context. Inside-out evaluation
template given; first `or` re-predict hit the and/or trap and
needs the template walk filled in to close. Next-up beats:
(1) re-predict `5 > 3 or 10 > 20` with the template walk filled
in, then run all three compound lines in REPL — locks Step 8;
(2) then `if` / `else` — predicates become conditional control
flow, the natural follow-on now that Booleans are produced AND
composed.

Current Python sources:
- Deitel (primary): Chapter 1 in progress.
- Severance "Python for Everyone" (second book): recently
  acquired, not yet started.

## Mastered
- [None yet — too early to claim mastery on anything.]

## In progress
- See CONCEPTS.md for the explicit ledger of what's been
*Introduced* vs *Taught* vs *Owned* across Python, Shell, and Git.
- Python: `print()` basics, comma-separator, quote-vs-no-quote,
REPL auto-echo, string `+` concatenation, REPL representation —
all *Taught* (2026-05-09). Variable assignment, statement-vs-
expression at the REPL, `type()`, and the `int`/`float`/`str`
types — all *Taught* (2026-05-11). Dynamic typing and arithmetic
operators `-`, `*`, `/`, `//`, `%` — all *Taught* (2026-05-11,
session 2). `**` graduated to *Taught* in session 4 after a clean
re-predict; the `//` type rule (int//int → int, either-operand-
float → float) was also made explicit and folded into the
CONCEPTS.md `//` entry the same session. Operator precedence
(PEMDAS in three tiers, parens override) and augmented assignment
(`x += 1` and the same shape for every arithmetic operator) both
*Taught* (2026-05-11, session 5; cold-re-predict locked
2026-05-13). Comparison operators `==`, `!=`, `>`, `>=`, `<` and
the `bool` type — all *Taught* (2026-05-13, session 6). `<=`
graduated *Taught* session 7 (2026-05-23, three-for-three on
equality leg, less-than leg, neither leg). **Full comparison
family LOCKED.** Boolean operators `and`, `or`, `not` — all
*Taught* session 7 (truth-table introduced from Boole 1854
foundation; predict-verified four-for-four; three of four
REPL-verified). Compound predicates (comparison + Boolean glue,
inside-out evaluation) — *Introduced* session 7 mid-walk; closes
with the re-predict on `5 > 3 or 10 > 20` plus all three compound
lines REPL-pasted. SyntaxError reading as a load-bearing skill —
*Introduced* session 7 with three live error decodes (`!=` alone,
`5=<5` symbol order, tablet typing artifact). `if` / `else`
conditional control flow likely next per Deitel Ch.1 sequence —
the natural follow-on now that compound Booleans are composed.
- Shell: `wc -l`, the REPL-vs-shell prompt distinction, and `ls`
all *Taught* (last two through 2026-05-11 session 5). One drill
per session continues on `cat`, `>`, `>>`, `<`, `|` — still
*Introduced* in CONCEPTS.md.
- Git: tetrad still at *Introduced* only. Practice-terminal mirror
of full add/commit/push cycle still pending.

## Practice terminal sync status
- 2026-05-23 (session 7): ONLINE throughout. Multiple SyntaxErrors
hit + decoded as teaching moments: `>>> !=` alone (binary operator
needs operands), `>>> 5=<5` ("cannot assign to literal" — Python
parsed as `5 = <5` because symbol order was flipped), tablet
typing artifact (`True rue and True` — dropped `T` left stray
`rue`). All recovered cleanly with retype. Error-reading banked
as a load-bearing skill, not a setback.
- 2026-05-13 (session 6): ONLINE throughout. Every line predicted
before running and paste-verified. Two cosmetic display artifacts
recurred (leading-space IndentationError on `20 // 6` paste,
duplicated `>>>` prompt on `type(True)` putting Python into
continuation mode; both same shape as 2026-05-09's character-
duplication, both broken with Ctrl-C and clean retype).
- 2026-05-11 (session 5): BACK ONLINE. Termius restored. All three
session-5 concepts (`ls`, operator precedence, augmented
assignment) predict-run-verified live. Four-day mental-execution
streak ended cleanly.
- 2026-05-11 (session 4): NOT AVAILABLE. Third curriculum day in
a row. Mental-execution mode held. Three substantive arithmetic
recoveries landed without typed verification.
- 2026-05-11 (session 2): NOT AVAILABLE. Mental-execution mode.
Six new concepts taught + one introduced.
- 2026-05-11 (session 1): NOT AVAILABLE. Mental-execution mode.
Five Python concepts landed; `ls` shell drill held over.
- 2026-05-10: In sync. Ran `wc -l README.md`, `ls`, `ls | wc -l`,
`ls | cat` with predictions and verified outputs.

## Next session plan
- **COLD OPEN: resume Step 8 compound predicates.** Re-predict
`>>> 5 > 3 or 10 > 20` using the inside-out template:
   Step 1: `5 > 3 → ?`
   Step 2: `10 > 20 → ?`
   Step 3: `? or ? → ?`
   Final output: `?`
Every `?` must be filled in — when only the final word comes
back, the layer-walk didn't happen and the and/or trap re-fires.
Then run all three compound lines (`5>3 and 10<20`,
`5>3 and 10>20`, `5>3 or 10>20`) in the REPL and paste the
output block. That LOCKS Step 8 and graduates compound predicates
*Introduced* → *Taught*.
- Python next beats (Deitel Ch.1): `if` / `else` conditional
control flow — predicates become decisions. Natural follow-on now
that Booleans are produced (comparison) AND composed (Boolean
operators). One line at a time per Python-pacing.
- Shell drill: `cat` next per the queued unit (`ls → cat → > →
>> → < → |`). One drill per session.
- Daily briefing if cycle has moved (NVIDIA prints May 20 — now
one week out, the event of the week is imminent).
- Recap at chunk end (confirmed default; offer "one more then
recap" as the close pattern).
- Run `git fetch && git status` at boot, BEFORE the synthesis,
to avoid stale-data synthesis.
- After each drill, update CONCEPTS.md.
- Maintain the rule: check CONCEPTS.md before invoking any prior
concept.
- When numbers in a predict carry real-world meaning, cue
operator-mode explicitly (per the session-6 analyst-mode-pull
pattern in LEARNER_PROFILE).
- When concepts stack into layered teach moments, peel them in
order rather than walking all at once (per the session-6 layer-
stacking pattern).

## Open questions
- [None.]

## Active project: Rondo's Prison Programming Journal
- Goal: A public record of the curriculum, the work, and the
experience of learning AI from inside, week by week.
- Status: Phase 1 in progress. Public landing page (README) and
MILESTONES.md current as of 2026-05-11. JOURNAL.md week-1 entry
shipped 2026-05-11 (session 4) — "Create Your Own Lane." Daily
briefings shipped 2026-05-07, 2026-05-11, 2026-05-13. Practice
terminal back online and stable through session 6.
- Next step: Continue Phase 1 Python with shell habit-drills
alongside; first portfolio project to be defined when Ch.1–2
fundamentals are in.

## Watchlist notes
- 2026-05-13 (session 6 briefing): Three structural moves since
May 11. (1) Q1 2026 hyperscaler prints landed: top 3 spent $112B
in a single quarter (AMZN $45.17B, GOOGL $35.67B, MSFT $30.88B);
full-year 2026 capex guides roll up to ~$715B, +70% from 2025's
$410B. Amazon alone guides $200B. (2) NVIDIA pre-print pullback,
now 7 days out; consensus refined to $78.62B / $1.74 EPS;
Goldman $2B and 7% above Street, flagging potential "major
re-rating." (3) Power bottleneck widened — transformer lead
times stretched from 128w (May 11) to 160w+ now; 11 of 12 GW
announced US capacity sits unbuilt. AMD Q1 print $10.3B +38% YoY,
Q2 guide $11.2B. TSMC stock to fresh 52-week high $418.03,
+35.1% Q1 YoY. Micron best week since 2008 (+30% / 5 sessions),
now larger than JPMorgan by market cap. Anthropic shipped Claude
Opus 4.7 May 4. OpenAI shipped GPT-5.5 in two tiers. Huawei 950PR
adopted by Alibaba, ByteDance, and Ant Group (the last for
training), 750k unit target 2026.
- 2026-05-11 (session 4 briefing): Power-as-bottleneck is the
structural shift since the May 7 briefing. Microsoft's $80B
Azure backlog disclosure plus 128-week transformer lead times
moved the binding constraint off silicon. NVIDIA prints May 20 —
the event of the week. AMD post-print holding $430, Morgan
Stanley PT $360. TSMC five-fab 2nm ramp fully booked through
2026.
