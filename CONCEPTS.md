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
  dividend (`10 // 4 → 2`). When both operands are `int`, the
  result is `int` (no decimal point on the output). If either
  operand is `float`, the result is `float`. Confirmed via
  `type(10 // 4) → <class 'int'>` and
  `type(10.0 // 4) → <class 'float'>`. (2026-05-11; type rule
  made explicit session 4.)
- `%` (modulo) — returns the remainder after `//`. The `//` and
  `%` pair are the two halves of "divide and keep track of what's
  left over." Walked the math via "biggest multiple of the divisor
  that fits, then subtract." Same shape recovered session 4 on
  `128 % 52 → 24` (stacked multiples of 52 under 128). (2026-05-11)
- `**` (exponentiation) — `base ** exponent`. The exponent is a
  *count of factors*, not a multiplier
  (`3 ** 4 = 3 × 3 × 3 × 3 = 81`). Anything to the 0 equals 1.
  The divide-by-base walk (`2 ** 3 = 8`, `2 ** 2 = 4 = 8 ÷ 2`, ...,
  `2 ** 0 = 1 = 2 ÷ 2`) is what made the zero rule stick after the
  descending-powers walk hadn't. (2026-05-11; re-predicted clean
  in session 4 after session 2 misses.)
- Operator precedence (PEMDAS for arithmetic) — three tiers,
  highest binds tightest: (1) `**`; (2) `*` `/` `//` `%`;
  (3) `+` `-`. Within a tier, left-to-right (except `**`, which
  is right-to-left when stacked — deferred). Parentheses override
  the default order — wrap any sub-expression to force it first.
  Verified across four predicts in session 5:
  `2 + 3 * 4 → 14`, `10 - 6 / 2 → 7.0`, `2 * 3 ** 2 → 18`,
  `(2 + 3) * 4 → 20` (the parens predict slipped the first pass —
  correct rule named, but original no-parens result re-stated;
  walked stacked and re-predicted clean). Cold-re-predict locked
  session 6 on `4 + 3 * 2 ** 2 → 16` — all three tiers walked
  correctly with no prompt. (2026-05-11, locked 2026-05-13.)
- Augmented assignment — `x += 1` is shorthand for `x = x + 1`.
  Same shape works for every arithmetic operator (`-=`, `*=`,
  `/=`, `//=`, `%=`, `**=`). Pure typing convenience; Python
  compiles it to the same operation. Verified
  `n = 4; n *= 3; print(n) → 12` (session 5). Session 6
  generalized: `x = 20; x //= 6 → 3` (after a layer-stacking
  recovery — see SESSION_LOG) and `x = 14; x -= 5 → 9` clean
  cold. (2026-05-11, generalized 2026-05-13.)
- Comparison operators `==`, `!=`, `>`, `>=`, `<` — produce a
  `bool` result (`True` or `False`). `==` asks "are these equal?"
  (two equals signs because it's a question; one is assignment).
  `!=` is "are these different?" (the `!` reads as "not" in most
  programming languages). `>=` and `<=` are "or equal to" — equal
  values return `True`, not `False`. Order matters for `>=`/`<=`
  (`=<` and `=>` would error). Strict `<` and `>` return `False`
  on equal values (`4 < 4 → False`). Six cold predicts session 6:
  `5 == 5 → True`, `5 == 4 → False`, `7 > 3 → True`,
  `3 != 3 → False`, `5 >= 5 → True`, `4 < 4 → False`. **Key
  rule:** comparison operators always return `bool` regardless of
  operand type — `type(45.17 > 30.88) → <class 'bool'>`, not
  `float`. (2026-05-13)
- `bool` type — Python's fourth type after `int`, `float`, `str`.
  Two values only: `True` and `False`, both capitalized (lowercase
  `true`/`false` would error as undefined names). Returned by all
  comparison operators. Subclass wrinkle: under the hood `bool` is
  a subclass of `int` (so `True == 1`, `False == 0`, and `True + 1
  → 2` in arithmetic), but `type(True)` still reports the more
  specific class `<class 'bool'>`. (2026-05-13)

### Introduced (not yet Taught)
- Single vs double quotes are interchangeable — mentioned in
  passing 2026-05-09; not separately drilled.
- `IndentationError` when leading whitespace at `>>>` — encountered
  as a bug and debugged once 2026-05-09; recurred 2026-05-13 with
  the same shape (leading space before `20 // 6`). Cause was
  reconfirmed; not yet at *Taught* via a deliberate drill.
- `exit()` to leave the Python REPL — used 2026-05-09 and
  2026-05-10; not separately taught.
- Python is case-sensitive — `x` and `X` are different names.
  Flagged 2026-05-11 after Rondo typed `X=7` in a prediction; not
  separately drilled.
- `<=` (less-than-or-equal-to) — introduced session 6 paired with
  `>=`. Same shape as `>=`, opposite direction. Not separately
  cold-predicted (the strict `<` was; promote `<=` to *Taught*
  with a single cold predict next session). (2026-05-13)
- Numeric literal underscores — Python allows `_` inside numeric
  literals as a readability separator: `80_050_000_000` is the
  same number as `80050000000`. Python ignores the underscores.
  Used in the 2026-05-13 briefing learning task. (2026-05-13)
- Comment syntax `#` — anything after `#` on a line is ignored by
  Python. Used in passing in the 2026-05-13 briefing task; not
  separately taught. (2026-05-13)
- KeyboardInterrupt / Ctrl-C to cancel a stuck REPL line —
  encountered 2026-05-13 when a duplicated `>>>` prompt put Python
  into continuation mode (`...`). Ctrl-C broke out cleanly. Not
  separately taught. (2026-05-13)

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
- `ls` (no args) — lists names of files and directories in the
  current directory. Output is multi-column when there are many
  entries, filling column-major (read top-to-bottom of column 1
  first, then top-to-bottom of column 2, etc. — not row-by-row).
  Default sort is alphabetical case-insensitive, with digit-named
  entries before letter-named entries. Drilled session 5 in two
  contexts: home dir (found the renamed `rondo-AI-curriculum`
  directory) and inside the repo (16 root entries plus
  `index.html`). (2026-05-11)

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
- `cd <path>` — change directory. Used incidentally and as part
  of the session-5 drill (`cd rondo-AI-curriculum`); never
  explicitly taught with predict-run-verify.
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
