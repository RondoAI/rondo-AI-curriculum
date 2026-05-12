# Tutor Terminal

A Python REPL with Claude in the background. Termius-style, pink/dark
aesthetic. Claude watches every line you type but stays silent until
you summon it with a `?command`. The point: make mistakes, sit with
them, ask for help when you're ready.

## What it looks like

```
╭───────────────────────────────╮
│   Welcome back, Rondo         │
│   Opus 4.7 · python tutor     │
╰───────────────────────────────╯

  claude: ready  (silent until summoned)

> x = 5
> print(y)
Traceback (most recent call last):
  File "<console>", line 1, in <module>
NameError: name 'y' is not defined

> ?hint

  ─────────
  What variable did you just define, and
  what variable did you just try to print?
  ─────────

> print(x)
5
```

## Commands

| Command            | What it does                                  |
|--------------------|-----------------------------------------------|
| `?ask <question>`  | Ask anything                                  |
| `?explain`         | Explain the last error or output (Socratic)   |
| `?fix`             | Show the fix, with one-line why               |
| `?hint`            | One-sentence nudge — no spoilers              |
| `?quiz`            | Quiz you on what just happened                |
| `?clear`           | Clear Claude's view of the session            |
| `?help`            | Show commands                                 |
| `exit` / Ctrl-D    | Quit                                          |

## Install on Android (Termux)

1. Install [Termux](https://f-droid.org/en/packages/com.termux/) from
   F-Droid (the Play Store version is outdated).

2. In Termux:

```bash
pkg update && pkg upgrade
pkg install python git
git clone https://github.com/RondoAI/rondo-AI-curriculum
cd rondo-AI-curriculum/projects/tutor-terminal
pip install -r requirements.txt
```

3. Set your Anthropic API key (get one at console.anthropic.com):

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
```

Add that line to `~/.bashrc` so it persists across sessions.

4. Run it:

```bash
python tutor.py
```

## Install elsewhere

Anywhere with Python 3.10+ and an ANSI-capable terminal:

```bash
pip install -r requirements.txt
export ANTHROPIC_API_KEY="sk-ant-..."
python tutor.py
```

## How the tutor mode works

Every line you type is logged as one of three events: `input`,
`output`, `error`. Claude sees the last 20. When you summon it
with `?explain` or `?fix`, it gets that history plus the system
prompt — which tells it where you are in the curriculum (Phase
1, Deitel Ch.1) and how to teach (Socratic, short, no
hand-holding).

`?hint` is the strictest — one sentence, never the answer.
`?fix` is the most direct — gives the code with a one-line
explanation. `?explain` and `?quiz` sit in between.

## Why this exists

Most "AI coding assistants" answer the moment you hit enter. That
trains you to ask Claude before you've tried. This one stays out of
your way until you decide you want help. The friction is the
feature.
