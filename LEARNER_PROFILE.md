# Learner Profile: Rondo Campbell

A living, evolving document. Updated sparingly — only when there is
something new genuinely worth recording. Brevity is fidelity.

## How Rondo learns best
[Pedagogical approaches that have demonstrably worked. Format
each entry as: "What works — example or evidence."]
- Workflow muscle memory before content — 2026-05-07: when given
the first-session choice of (A) PY4E directly, (B) Deitel directly,
or (C) shell+git warm-up first, picked C then segue into A.
Suggests: front-load practitioner-habit drills (bash, git) on
sessions where new tooling is about to be introduced.
- Pace per domain, not per learner — 2026-05-09: when given the
python3 hands-on as a 7-line block with multi-bullet pre-run
sub-questions, pushed back: "I'm a beginner just like my first or
second day." Reset to one line at a time worked smoothly.
Suggests: brisk pacing on shell ≠ brisk pacing on Python.
Calibrate per-domain by current depth, not by overall ability.
- Explicit tracking of what's been taught vs assumed — 2026-05-10:
when I framed new material as "you already know `>` and `>>`"
based on a brief day-1 mention, pushed back: "never learned any
of this. Please be aware of whats been learned and not. You need
to be much more structured and organized." Built CONCEPTS.md as
the fix. Suggests: he learns best when prior knowledge is
tracked explicitly in a ledger and new lessons build coherently
on a verified foundation — not on extrapolation from session
notes.
- Walking the math by hand — learner-confirmed 2026-05-11
(session 2). Rondo's own words in the closing recap: "having to
use a tablet has made me go through the steps, which has been
helpful." Two arithmetic recoveries that day (`10 / 4` confused
with "2 remainder 2"; `11 % 3` predicted as `4`) resolved cleanly
when I walked the math explicitly — multiples of the divisor
stacked vertically, then subtract. After each walk, he produced
three-for-three correct predictions on the same operator family.
Suggests: when a numeric rule isn't sticking, slow to a hand-walked
expansion before adding more examples.
- End-of-chunk recap in his own words — confirmed 2026-05-11
(session 2) after three sessions of supporting data. When offered
"recap and close" vs "one more then recap," he has chosen the
latter every time (2026-05-09, 2026-05-11 sessions 1, 2, 4).
Use as the default closing pattern — propose at least one "one
more" option before the recap.
- Visual stacking unsticks pattern-match and arithmetic misses —
confirmed across three sessions. 2026-05-11 (session 1): `7` vs
`7.0` stacked with the decimal-point arrow produced three-for-
three recovery on int/float predicts. 2026-05-11 (session 2):
multiples of 3 stacked under 11 produced three-for-three recovery
on modulo predicts; four-factor expansion stacked walked
`3 ** 4 → 81`. 2026-05-11 (session 4): stacked multiples of 52
under 128 produced a clean recovery on `128 % 52 → 24`, same
shape as session 2. All three confirmations have been numeric;
default to using this whenever the friction is numeric. Whether
it extends to non-numeric rules (operator precedence, truthy/
falsy) is still open.
- Walk selection matters when a rule isn't sticking — 2026-05-11
(session 4). The descending-powers walk for the `**` zero rule
(`10 ** 4 → 10000`, divide by 10 each step down to
`10 ** 0 = 1`) did not stick across two sessions of trying.
Switching to the divide-by-base walk (`2 ** 3 = 8`, `2 ** 2 = 4 =
8 ÷ 2`, ..., `2 ** 0 = 1 = 2 ÷ 2`) landed immediately and
produced three-for-three on the zero rule. The unlock seems to be
that divide-by-self is arithmetic he's done since elementary
school, so the new rule lands on top of a fact already owned.
Suggests: when one walk doesn't take, try a different walk
anchored in older-than-the-rule arithmetic, not just a different
visual presentation of the same idea.
- Peel layers, don't walk them all at once — 2026-05-13
(session 6). When concepts stack into a single predict, Rondo
gets pulled to the wrong layer rather than walking inside-out.
Two instances same session: (1) `x = 20; x //= 6` predicted as
`6.0` (three layers in one line: augmented-assignment shape,
integer-division math, and the int//int → int type rule).
Recovery was strictly inside-out: walked "how many whole times
does 6 go into 20" (Rondo: "3") anchored in long-division
arithmetic he owned, then layered `//` back on as exactly that,
then layered `//=` on as the same shape as `+=`. (2)
`type(45.17 > 30.88)` predicted as `float` (two layers: the inner
comparison returns a bool, then `type()` reports on that bool).
Recovery was naming the inside-out evaluation order explicitly:
inner first → comparison produces `True`, outer next → `type()`
reports `<class 'bool'>`. Refinement of the older "walk anchored
in older arithmetic" pattern: when *new layers stack on each
other*, peel them one at a time, don't try to walk through them
all in one move. Adjacent observation: when Rondo writes
"i dont understand" explicitly (he did mid-`//=` recovery), the
right response is to back up to the simplest non-layered version
and rebuild from there.
- Cue operator-mode when numbers carry real-world meaning —
2026-05-13 (session 6). The same comparison-operator predicts
that went six-for-six clean on abstract operands earlier in the
session pulled Rondo three different times into analyst-mode when
the operands were briefing numbers (Goldman vs Street on NVIDIA
revenue, Amazon vs Microsoft Q1 capex). All three responses were
substantive analyst answers ("Amazon > Microsoft", "greater than
or equal to", the gap size in billions) rather than the True /
False output the operator returns. Single re-anchor each time
("what does Python *print*?") fixed it. Suggests: when a predict
uses operands that carry semantic load, explicitly cue
operator-mode in the framing — "Python's question is just
True/False" — before the predict, rather than after the slip.
The slip itself is a strength (he's *engaging* with the numbers,
not just pattern-matching the operator), but for lock-tests the
strict operator output is what's being measured.

## Strengths
[Concepts that came easily, or that he showed unusual aptitude
for. Note the topic and the date.]
- 2026-05-07: shell fluency baseline strong. First-ask correct
predictions on `>` vs `>>` semantics, `wc -l` output, and
overwrite behavior of `>` after `>>`. Pacing on shell topics can
be brisk; depth, not handholding, is what serves him here.

## Friction points and what unlocked them
[Concepts that took multiple passes, paired with what eventually
got them across. Format: "Topic — what was hard, what worked."]
- Comparison anxiety with CS-degree voices on Twitter; age framing
— 2026-05-11 (session 2): in the closing recap Rondo surfaced
"people on Twitter with computer science degree saying all this
complicated language, and I feel like I can't keep up" alongside
"I'm thirty-six now... it takes me a long time to learn things."
What seemed to land: (1) concrete-pace evidence — ten Python
concepts locked across two sessions is a real pace, not slow;
(2) the framing that complicated language is often vocabulary used
as a shield, and that walking the math step-by-step is the depth
move CS-degree quoters often skip; (3) the reminder that the
"world-class" bar in CLAUDE.md is years-long for anyone and the
clock doesn't reset because someone starts late. Watch for
recurrence — if this thread returns, the unlock is concrete-pace
evidence first, then the reframe.
- `**` zero rule (`anything ** 0 = 1`) — took two sessions and two
different walks. Session 2 used the descending-powers-of-10 walk
(`10 ** 4 = 10000`, ÷10 each step down). Did not stick — session
4 cold-predicts on `7 ** 0` and `2 ** 0` came back as the base.
Switched to divide-by-base (`2 ** 3 = 8`, `2 ** 2 = 4 = 8 ÷ 2`,
..., `2 ** 0 = 2 ÷ 2 = 1`) and got three-for-three immediately.
The fact anchoring it — anything divided by itself equals 1 — was
already cold-owned arithmetic, so the new rule landed on top of
it.

## Voice and editorial preferences
[How Rondo wants his own story told and how he iterates on
public-facing writing.]
- Iterative refinement, not first-draft acceptance — 2026-05-11
  (session 3): on the README rewrite, gave high-level direction
  first ("inspirational, growth story"), then refined across
  four rounds of feedback before landing the final text.
  Suggests: present concrete drafts on public-facing writing and
  expect 2-3 rounds of refinement; don't over-engineer the first
  draft.
- Owns the past directly — 2026-05-11 (session 3): given the
  choice on how to frame the 2016 jail escape in the README,
  didn't soften. "I made one of the worst decisions of my life"
  stayed. Suggests: honest framing serves him better than hedged
  framing; don't preemptively protect him from his own story.
- No em dashes in public-facing writing — 2026-05-11 (session 3):
  stylistic preference surfaced during the README review.
  "Please remove all the dashes." Use commas, colons, or
  restructured sentences instead. Apply across all public
  surfaces (README, MILESTONES, JOURNAL, briefings, /writings/).
- Provides primary sources when available — 2026-05-11 (session
  3): rather than asking Claude to research the 2016 case from
  general inference, linked the Mercury News article directly.
  Suggests: he prefers to anchor public claims to documented
  sources he has selected.
- Light edits on his own journal voice are welcome when asked,
  not by default — 2026-05-11 (session 4): on the first JOURNAL
  entry, Rondo asked for paragraph breaks and typo fixes, plus
  one substantive correction ("biggest limitation, of course, is
  your freedom" → "biggest accomplishment, of course, is gaining
  your freedom"). Approved every other word verbatim. Suggests:
  default to verbatim per the JOURNAL header rule; offer light
  editing as an explicit option when he posts a draft.

## Vocabulary and metaphors that have landed
[Analogies, framings, and turns of phrase that demonstrably
clicked. These get reused when relevant.]

## Energy and timing patterns
[If sessions at certain times consistently go better or worse,
record it.]

## Motivation hooks
[Topics, framings, or connections that visibly engaged him.
Examples: AI and the criminal justice system, the economics of
compute, using Python to help foster youth. When in doubt, lean
into these.]

## Recent creative openers that worked
[Session-opening approaches that landed well. Format:
"YYYY-MM-DD: opening — outcome."]

## Open hypotheses
[Things Claude is watching but has not yet confirmed as
patterns. Move to the appropriate section above when confirmed;
remove if disconfirmed.]
- [Open: whether visual stacking extends to non-numeric rules.
  Three confirming sessions on numeric content — the pattern is
  confirmed for numeric work — but no non-numeric test yet.
  Watch operator precedence and truthy/falsy when they come up.]
