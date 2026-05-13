# Tutor Terminal

A Python-learning game for Android terminals. Type Python, earn XP,
build a daily streak, unlock badges. Claude watches every line you
type but stays silent until you summon it with a `?command`. The
friction is the feature: errors stay on screen until you decide to
ask for help.

## What it looks like

```
  ╭───────────────────────────────╮
  │   Welcome back, friend        │
  │   Python · game mode          │
  ╰───────────────────────────────╯

  🔥 streak +1 — 3 days
  🔥 streak 3  ·  ★ lv 2  ·  47 xp  ·  4/18 badges

  type python · earn xp · unlock badges
  claude waits silently — summon with ?

  ?ask <q>  ?explain  ?fix  ?hint
  ?quiz  ?stats  ?achievements  ?help

  claude: ready  (haiku 4.5 · silent until summoned)

> x = 5
  +5 xp
> print(y)
Traceback (most recent call last):
  File "<console>", line 1, in <module>
NameError: name 'y' is not defined
  +2 xp
> ?hint

  ─────────
  What name did you just define, and what
  name did you just try to print?
  ─────────

> print(x)
5
  +15 xp · self-healed

  ────────────────────────────────
  ★  achievement unlocked
  Self Healed  fixed your own error without ?ask
  +25 xp
  ────────────────────────────────

 🔥 3  ★ lv 2  72 xp  5/18 badges
> _
```

## The game loop

- **Every line of Python earns XP.** +5 for a clean run, +2 for an
  error (trying counts), +15 if you fix your own error without
  asking Claude.
- **Daily streak** — open the app today and your streak ticks up. Skip
  a day and it resets. Streak milestones (3/7/30 days) award extra XP.
- **18 badges** — first `print()`, first error, first `for` loop, first
  function, used every arithmetic operator, 10 runs in a row, and so on.
  Unlock each one once.
- **Level up** — XP curves so it takes a bit longer each level. Level
  shows in the bottom status bar at all times.

## Commands

| Command            | What it does                                  |
|--------------------|-----------------------------------------------|
| `?ask <question>`  | Ask anything                                  |
| `?explain`         | Explain the last error or output (Socratic)   |
| `?fix`             | Show the fix, with one-line why               |
| `?hint`            | One-sentence nudge — no spoilers              |
| `?quiz`            | Quiz you on what just happened                |
| `?stats`           | XP, streak, totals                            |
| `?achievements`    | Badges (locked + unlocked)                    |
| `?clear`           | Clear Claude's view of the session            |
| `?help`            | Show commands                                 |
| `exit` / Ctrl-D    | Quit (state auto-saves)                       |

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

Optional — set your name so the banner uses it:

```bash
export TUTOR_NAME="YourName"
```

Add both lines to `~/.bashrc` so they persist.

4. Run it:

```bash
python tutor.py
```

## State

Progress saves to `~/.tutor_state.json` after every command. Delete
that file to start fresh. Command history saves to `~/.tutor_history`.

## How the help levels are tuned

`?hint` is the strictest — one sentence, never the answer. `?fix` is
the most direct — gives the code with a one-line why. `?explain` and
`?quiz` sit between. The model is `claude-haiku-4-5` so responses
stream in fast — usually under two seconds on a tablet.

## Why this exists

Most "AI coding assistants" answer the moment you hit enter. That
trains you to ask the AI before you've tried. This one stays out of
your way until you decide you want help — and it makes the trying
itself rewarding through XP and streaks. The terminal is the game.
