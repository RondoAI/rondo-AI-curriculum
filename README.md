# Rondo's Prison Programming Journal

My name is Rondo Campbell. I am currently incarcerated in
California. I have been incarcerated since I was a youth. I am a
former foster youth, originally sentenced to 49 years in prison
for burglary and robbery.

In November 2016, I made one of the worst decisions of my life. I
escaped from the Santa Clara County jail. I was captured days
later. The consequences of that night became part of the public
record, and part of what I have spent every year since trying to
outgrow.

Inside, I began to do the work. I completed Harvard's CS50x in
computer science. I earned a certificate in blockchain
fundamentals from UC Berkeley. I serve as an advisor to the
Decolonized Library Project. I was admitted to Ohio University's
Bachelor of Specialized Studies program.

Two successful appeals followed. In November 2025, the Santa Clara
County Superior Court resentenced me, striking the firearm
enhancement and reducing my term to 18 years and 8 months. The
judge said my record of education and conduct while incarcerated
"is rare, relatively unique, and speaks well for what Mr.
Campbell has done." My projected release is 2028.

This repository is my preparation for that day. It is also a
public record, updated in real time, of me teaching myself
artificial intelligence and programming, on a tablet, with Claude
Code as my assistant.

I am working through Python, phase by phase. The bar is the top
of the field. Not "competent." Not "employable." When I walk out
in 2028, I intend to walk out prepared to build something great,
prepared to be a productive member of society, and prepared to
help others coming behind me do the same.

## What this is

Three threads, equally weighted.

**The technical climb.** Eight phases leading to 2028: Python
foundations, Pythonic patterns, the standard library and data
tooling, the scientific stack (NumPy, pandas, matplotlib), the
web layer, classical machine learning (scikit-learn), deep
learning (PyTorch, Hugging Face), and applied LLM systems. Each
phase ends with a portfolio project committed to this repository.

**The financial threads.** Watching the AI market through equity
thesis work and a paper portfolio, daily briefings tied to live
news, open source contributions, and eventually shipped products.

**The historical record.** What it is to teach yourself this
material from inside, on a tablet, with intermittent
connectivity, over years. Every session is logged. The work and
the story will live in the same repository so that when I am
released, they can be read together.

If you are a developer, a recruiter, a teacher, a fellow
incarcerated person, or anyone who has ever wondered whether it
is possible to turn a life around, read what you find here. The
record is real, dated, and public.

## Story so far

The repository went up on 2026-05-07, and the same day saw the
very first line of Python typed: `print('Hello, world!')`. From
there, the work moved methodically through Python's fundamentals.
Not in lectures, but in short drills where I predict the output
of each line before running it, and verify the result before
moving on to the next concept.

By the end of the first week, ten concepts had moved from
"introduced" to "fully taught" in the concept ledger: how
`print()` actually behaves with all its quirks, how Python
distinguishes a piece of text from a piece of code, how the
interactive prompt automatically echoes the value of an
expression but stays silent on an assignment, what it means for
a single name to point to a value of any type at any time, and
the full set of arithmetic operators, including the subtle fact
that Python's regular division always returns a decimal, even
when the numbers divide evenly.

Every session is logged in real time. The work is dated, public,
and traceable line by line.

## Source materials

Two parallel primary Python sources: Charles Severance's "Python
for Everybody" (University of Michigan, free at py4e.com) as the
structured introduction; and Paul Deitel and Harvey Deitel's
"Intro to Python for Computer Science and Data Science" as the
conceptual spine.

Supporting library: Sutton and Barto's "Reinforcement Learning: An
Introduction" (2nd ed.); Russell and Norvig's "Artificial
Intelligence: A Modern Approach" (4th ed.); J. Glenn Brookshear's
"Computer Science: An Overview" (13th ed.).

## How this repository is organized

The repository has a working layer and a public storytelling
layer. Both live in the same git repository.

The working layer supports the daily study:
- CLAUDE.md, the standing brief for Claude Code sessions.
- PROGRESS.md, current state of the curriculum.
- SESSION_LOG.md, the append only technical history.
- JOURNAL.md, weekly private reflection in Rondo's voice.
- LEARNER_PROFILE.md, accumulated patterns about how Rondo
  learns.

The public storytelling layer documents the journey for an outside
reader:
- README.md, this file.
- CHRONICLE.md, a chronological historical record.
- MILESTONES.md, a public log of significant moments.
- /writings/, intentional public essays, written when there is
  something to say.

The directories: /curriculum/ (code by phase), /projects/
(portfolio projects), /briefings/ (daily AI market briefings),
/notes/ (study notes), /portfolio/ (paper portfolio equities),
/prompts/ (saved boot and close prompts).

## Recent milestones

- 2026-05-11 (Session 2): Locked the arithmetic operators
  (subtraction, multiplication, true division, integer division,
  modulo). Two arithmetic recoveries cleared: the difference
  between division as a fraction (`2.5`) and division with
  remainder (`2 remainder 2`). Exponentiation introduced; one
  more pass needed before it is locked.
- 2026-05-11 (Session 1): First session run entirely from memory
  and prediction, with no second terminal available that day.
  Five concepts taught: variable assignment, the difference
  between statements and expressions at the prompt, the `type()`
  function, and the three basic types: `int`, `float`, and `str`.
- 2026-05-10: Created a concept ledger (CONCEPTS.md) to track
  exactly what has been Introduced, Taught, and Owned across
  Python, shell, and git. Built in response to honest feedback
  that the curriculum had been assuming prior knowledge instead
  of verifying it.
- 2026-05-09: Public voice for the project finalized. Practice on
  the Python REPL caught up after a pacing reset from "one block
  of seven lines" to "one line at a time."
- 2026-05-07: Phase 1 (Python foundations) begun. Repository
  scaffold operational. First Python code ran successfully:
  `print('Hello, world!')`.

## How to read this

If you want the current state at a glance, read this file. If you
want the arc of the journey, read CHRONICLE.md. If you want
discrete moments, read MILESTONES.md. If you want polished essays
on what the work means, read /writings/. If you want technical
depth, read SESSION_LOG.md and the code under /curriculum/ and
/projects/. If you want the human voice, read JOURNAL.md.
