# Concepts Ledger

A living record of what has actually been taught — not just covered
or mentioned in passing. Updated at session close.

## Levels

- **Introduced** — concept named or shown briefly; not internalized.
- **Taught** — explained + worked example + practice-terminal
  verification with prediction.
- **Owned** — used confidently across multiple sessions without
  prompting.

Before invoking any concept ("you already know X"), check this file.
If it's not at *Taught* or higher, treat it as new and teach it
cleanly.

---

## Python

### Owned
- (None yet — too early.)

### Taught
- `print('text')` — print a literal string. (2026-05-09)
- `print('a', 'b')` — comma-separated arguments to `print()` are
  output with a single space between them. (2026-05-09)
- Quote-vs-no-quote distinction — quoted = literal text Python
  won't touch; unquoted = code Python evaluates. (2026-05-09)
- `print(2 + 3)` — `print()` can take an arithmetic expression;
  Python evaluates first, then prints the result. (2026-05-09)
- REPL auto-echo — bare expressions at `>>>` automatically display
  their value; only happens at the interactive prompt, not in
  scripts. (2026-05-09)
- String `+` concatenation — `'a' + 'b'` produces `'ab'`.
  (2026-05-09)
- REPL representation vs `print()`'s friendly display — REPL shows
  strings with quotes (`'AI & programming'`); `print()` strips
  them. (2026-05-09)
- Variable assignment with `=` — name on the left, value on the
  right; binds the name to the value. (2026-05-11)
- Statement vs expression at the REPL — assignment is a statement
  and produces no output; bare names/values are expressions and
  auto-echo. (2026-05-11)
- `type()` built-in — returns the type of a value as
  `<class '…'>`. Returns the type only; the original value is not
  repeated in the output. (2026-05-11)
- `int` type — whole numbers, no decimal point: `7`, `-3`, `0`.
  (2026-05-11)
- `float` type — numbers with a decimal point, even when the value
  equals an integer (`7.0`, `0.0`). The decimal point is the
  dividing line between `int` and `float`. (2026-05-11)
- `str` type — Python's three-letter name for the quoted-text
  category. (2026-05-11)
- Dynamic typing — the same name can be rebound to a value of a
  different type; the latest assignment wins. Types belong to
  values, not names. (2026-05-11)
- Arithmetic operators `-` and `*` — standard subtraction and
  multiplication of int operands. (2026-05-11)
- `/` (true division) — always returns a `float` in Python 3, even
  when the operands divide evenly (`6 / 2 → 3.0`). One consistent
  behavior, no surprises. (2026-05-11)
- `//` (integer division / floor division) — returns the whole-
  number count of how many times the divisor fits into the
  dividend (`10 // 4 → 2`). (2026-05-11)
- `%` (modulo) — returns the remainder after `//`. The `//` and
  `%` pair are the two halves of "divide and keep track of what's
  left over." Walked the math via "biggest multiple of the divisor
  that fits, then subtract." (2026-05-11)

### Introduced (not yet Taught)
- Single vs double quotes are interchangeable — mentioned in
  passing 2026-05-09; not separately drilled.
- `IndentationError` when leading whitespace at `>>>` — encountered
  as a bug and debugged once 2026-05-09.
- `exit()` to leave the Python REPL — used 2026-05-09 and
  2026-05-10; not separately taught.
- Python is case-sensitive — `x` and `X` are different names.
  Flagged 2026-05-11 after Rondo typed `X=7` in a prediction; not
  separately drilled.
- `**` (exponentiation) — two asterisks; `base ** exponent`.
  Introduced 2026-05-11 with two missed predicts: `3 ** 4`
  (treated the exponent as a single multiplier rather than a count
  of factors) and `10 ** 0` (the anything-to-the-0 = 1 rule was
  new). Re-predict next session to promote.

---

## Shell

### Owned
- (None yet.)

### Taught
- `wc -l <filename>` — counts lines in a file. The flag tells `wc`
  what to count (`-l` lines, `-w` words, `-c` characters).
  (2026-05-10)
- `>>>` prompt vs shell prompt distinction — `>>>` means you're in
  Python and only Python code works; `rondo@RondoMac …%` means
  you're in the shell and shell commands work. (2026-05-10)

### Introduced (not yet Taught)
- `>` (redirect command output to a file, overwrite) — drilled
  briefly 2026-05-07 with `/tmp/scratch.txt`. Rondo confirmed
  2026-05-10 this is not owned; re-teach as part of next shell
  unit.
- `>>` (append output to a file) — same status as `>`.
- `|` (pipe — feed left command's output as input to right
  command) — introduced 2026-05-10 with `ls | wc -l`. One drill
  done; not yet at *Taught* level.
- `<` (stdin redirection — feed file contents into a command's
  input) — introduced 2026-05-10 but not completed (session
  reset before drill ran).
- `ls | cat` — demonstrated the "ls switches to one-per-line in
  pipes" behavior 2026-05-10.
- `ls` — list directory contents. Used incidentally many times;
  never explicitly taught.
- `cd <path>` — change directory. Used incidentally; never
  explicitly taught.
- `cat <filename>` — print file contents to terminal. Used
  incidentally; never explicitly taught.
- Unknown command → `command not found` — observed 2026-05-10
  when Rondo typed `pls`. Mentioned as a useful failure mode.
- Shell tolerates leading whitespace before commands; Python REPL
  does not — observed and called out 2026-05-10.

---

## Git

### Owned
- (None yet.)

### Taught
- (None yet.)

### Introduced (not yet Taught)
- Git tetrad (`add`, `commit`, `push`, `pull`) — walked through
  live in working terminal 2026-05-07. Practice-terminal mirror
  still pending.
- `git status` — used in the live walkthrough 2026-05-07.
- "Git is offline by default" framing — mentioned 2026-05-07 to
  explain why local `git status` can show in-sync against a stale
  view of origin.

---

## Maintenance

This file is updated at every session close. Movement between
levels:
- *Introduced* → *Taught*: when a clean teaching pass is done with
  practice-terminal predict-run-verify.
- *Taught* → *Owned*: when Rondo uses the concept across multiple
  later sessions without prompting.
- *Owned* → demoted: if a future session reveals the concept isn't
  actually owned.
