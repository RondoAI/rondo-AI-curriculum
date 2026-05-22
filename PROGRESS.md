# Progress

Last updated: 2026-05-11 (Session 4)
Current phase: Phase 1 — Python Foundations
Current topic: Phase 1, Deitel Ch.1 — Python is primary. All
arithmetic operators introduced in Ch.1 are now *Taught*: `+`,
`-`, `*`, `/`, `//`, `%`, `**`. Exponentiation graduated session
4 after a clean re-predict (count-of-factors two-for-two; zero
rule three-for-three after switching from descending-powers to
divide-by-base walk). The `//` entry was also refined session 4
to make the int-vs-float return rule explicit. Shell habit-drill
alongside is still pending — `ls` predict-run-verify held over
four days running (Termius unavailable). Next-up Python beats:
operator precedence and possibly augmented assignment (`x += 1`).

Current Python sources:
- Deitel (primary): Chapter 1 in progress.
- Severance "Python for Everyone" / py4e Coursera (second source):
  first contact 2026-05-22 via the Coursera autograder. "Welcome
  Message" (Ch.2 — `input()` + variable + `print()` with variable)
  and "Pay Calculator" (Ch.2 — `float(input(...))` + arithmetic)
  both passed on the web autograder. Concepts are at *Introduced*
  in CONCEPTS.md, not *Taught* — they need a clean predict-run-
  verify pass in the REPL once Termius is back.

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
CONCEPTS.md `//` entry the same session. Operator precedence and
augmented assignment are next.
- Shell: `wc -l` and the REPL-vs-shell prompt distinction *Taught*
(2026-05-10). One drill per session continues on `ls`, `cat`,
`>`, `>>`, `<`, `|` — currently *Introduced* in CONCEPTS.md. `ls`
predict-run-verify held over four days (practice terminal
unavailable).
- Git: tetrad still at *Introduced* only. Practice-terminal mirror
of full add/commit/push cycle still pending.

## Practice terminal sync status
- 2026-05-11 (session 4): STILL NOT AVAILABLE. Third curriculum
day in a row. Mental-execution mode held. Three substantive
arithmetic recoveries landed without typed verification: `//` type
rule, `128 % 52` modulo, `**` zero rule.
- 2026-05-11 (session 2): NOT AVAILABLE. Mental-execution mode.
Six new concepts taught + one introduced.
- 2026-05-11 (session 1): NOT AVAILABLE. Mental-execution mode.
Five Python concepts landed; `ls` shell drill held over.
- 2026-05-10: In sync. Ran `wc -l README.md`, `ls`, `ls | wc -l`,
`ls | cat` with predictions and verified outputs.

## Next session plan
- If Termius is back: lead with the held-over `ls` predict-run-
verify, move it to *Taught*, then continue the shell unit toward
`cat`.
- Python next beats (Deitel Ch.1): operator precedence
(`2 + 3 * 4 = 14`, not `20` — multiplication binds tighter than
addition) and augmented-assignment operators (`x += 1` shorthand
for `x = x + 1`). One line at a time.
- Daily briefing if cycle has moved (NVIDIA prints May 20 — the
event of the week).
- Recap at chunk end (confirmed default).
- After each drill, update CONCEPTS.md.
- Maintain the rule: check CONCEPTS.md before invoking any prior
concept.

## Open questions
- [None.]

## Active project: Rondo's Prison Programming Journal
- Goal: A public record of the curriculum, the work, and the
experience of learning AI from inside, week by week.
- Status: Phase 1 in progress. Public landing page (README)
rewritten 2026-05-11 (session 3); MILESTONES.md refreshed same
day. JOURNAL.md week-1 entry shipped 2026-05-11 (session 4) —
"Create Your Own Lane." Daily briefing for 2026-05-11 also
shipped session 4 (power-as-new-bottleneck headline).
- Next step: Continue Phase 1 Python with shell habit-drills
alongside; first portfolio project to be defined when Ch.1–2
fundamentals are in.

## Watchlist notes
- 2026-05-11 (session 4 briefing): Power-as-bottleneck is the
structural shift since the May 7 briefing. Microsoft's $80B
Azure backlog disclosure plus 128-week transformer lead times
moved the binding constraint off silicon. NVIDIA prints May 20 —
the event of the week. AMD post-print holding $430, Morgan
Stanley PT $360. TSMC five-fab 2nm ramp fully booked through
2026.
