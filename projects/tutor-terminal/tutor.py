#!/usr/bin/env python3
"""Python tutor game for Android. Type Python, earn xp, build streaks.
Claude watches but stays silent until you ask."""

import code
import io
import json
import math
import os
import sys
from contextlib import redirect_stderr, redirect_stdout
from dataclasses import asdict, dataclass, field
from datetime import date, timedelta

try:
    from prompt_toolkit import PromptSession
    from prompt_toolkit.formatted_text import ANSI
    from prompt_toolkit.history import FileHistory
    from prompt_toolkit.lexers import PygmentsLexer
    from pygments.lexers.python import PythonLexer
except ImportError:
    sys.exit("install deps:  pip install -r requirements.txt")

try:
    import anthropic
except ImportError:
    sys.exit("install deps:  pip install -r requirements.txt")


# ── palette ───────────────────────────────────────────────────────
RESET = "\033[0m"
DIM = "\033[2m"
BOLD = "\033[1m"
PINK = "\033[38;5;212m"
ROSE = "\033[38;5;211m"
GOLD = "\033[38;5;220m"
GREEN = "\033[38;5;120m"
ORANGE = "\033[38;5;208m"
RED = "\033[38;5;203m"
GRAY = "\033[38;5;245m"


def c(color, s):
    return f"{color}{s}{RESET}"


# ── state ─────────────────────────────────────────────────────────
STATE_FILE = os.path.expanduser("~/.tutor_state.json")
LEARNER_NAME = os.environ.get("TUTOR_NAME", "friend")


@dataclass
class State:
    xp: int = 0
    streak: int = 0
    last_active: str = ""
    total_runs: int = 0
    total_success: int = 0
    total_errors: int = 0
    consecutive_success: int = 0
    consecutive_no_ask: int = 0
    self_heals: int = 0
    questions_asked: int = 0
    last_was_error: bool = False
    asked_since_error: bool = False
    achievements: list = field(default_factory=list)
    milestones: list = field(default_factory=list)


def load_state() -> State:
    if not os.path.exists(STATE_FILE):
        return State()
    try:
        with open(STATE_FILE) as f:
            data = json.load(f)
        return State(**{k: v for k, v in data.items() if k in State.__annotations__})
    except (json.JSONDecodeError, TypeError, OSError):
        return State()


def save_state(state: State):
    try:
        with open(STATE_FILE, "w") as f:
            json.dump(asdict(state), f, indent=2)
    except OSError:
        pass


def level_for_xp(xp: int) -> int:
    return int(math.sqrt(max(xp, 0) / 25)) + 1


def xp_for_level(lv: int) -> int:
    return ((lv - 1) ** 2) * 25


def streak_message(state: State) -> str:
    today = date.today().isoformat()
    yesterday = (date.today() - timedelta(days=1)).isoformat()

    if state.last_active == today:
        return ""
    if state.last_active == yesterday:
        state.streak += 1
        state.last_active = today
        return c(ORANGE, f"🔥 streak +1 — {state.streak} days")
    prev = state.streak
    state.streak = 1
    state.last_active = today
    if prev >= 2:
        return c(DIM, f"🔥 streak reset (was {prev}) — day 1 again")
    return c(ORANGE, "🔥 day 1 — welcome")


# ── achievements ──────────────────────────────────────────────────
@dataclass
class Achievement:
    key: str
    name: str
    desc: str
    xp: int


ACHIEVEMENTS = [
    Achievement("first_steps", "First Steps", "ran your first command", 10),
    Achievement("hello_world", "Hello, World", "first successful print()", 15),
    Achievement("first_error", "First Error", "saw your first traceback", 15),
    Achievement("variables", "Variables", "first variable assignment", 15),
    Achievement("self_heal", "Self Healed", "fixed your own error without ?ask", 25),
    Achievement("math_whiz", "Math Whiz", "used + - * / ** // %", 30),
    Achievement("looper", "Looper", "your first for loop", 20),
    Achievement("decider", "Decider", "your first if statement", 20),
    Achievement("builder", "Builder", "your first def", 25),
    Achievement("importer", "Importer", "your first import", 20),
    Achievement("ten_row", "10 in a Row", "10 successes, no errors", 30),
    Achievement("fifty_runs", "50 Runs", "50 successful runs total", 50),
    Achievement("hundred_runs", "100 Runs", "100 successful runs total", 100),
    Achievement("first_ask", "First Ask", "summoned Claude for the first time", 5),
    Achievement("independent", "Independent", "25 runs without summoning Claude", 40),
    Achievement("streak_3", "Streak 3", "three day streak", 30),
    Achievement("streak_7", "Streak 7", "one week streak", 75),
    Achievement("streak_30", "Streak 30", "thirty day streak", 250),
]

MATH_OPS = ["**", "//", "+", "-", "*", "/", "%"]


def detect_milestones(stmt: str, error: bool, milestones: set):
    ls = stmt.strip()
    if not error and (ls.startswith("print(") or "\nprint(" in stmt):
        milestones.add("print")
    if not error and "=" in stmt:
        # rough assignment check: ignore == != <= >= and keyword-led lines
        head = stmt.split("=")[0].strip()
        ops = ("==", "!=", "<=", ">=")
        if not any(op in stmt for op in ops) and head.isidentifier():
            milestones.add("assign")
    if ls.startswith("for ") or "\nfor " in stmt:
        milestones.add("for")
    if ls.startswith("if ") or "\nif " in stmt:
        milestones.add("if")
    if ls.startswith("def ") or "\ndef " in stmt:
        milestones.add("def")
    if ls.startswith("import ") or ls.startswith("from "):
        milestones.add("import")
    for op in MATH_OPS:
        if op in stmt:
            milestones.add(f"math:{op}")


def check_achievements(state: State) -> list:
    unlocked = []
    have = set(state.achievements)
    milestones = set(state.milestones)

    def grant(key):
        if key not in have:
            ach = next(a for a in ACHIEVEMENTS if a.key == key)
            unlocked.append(ach)
            state.achievements.append(key)
            have.add(key)

    if state.total_runs >= 1:
        grant("first_steps")
    if state.total_errors >= 1:
        grant("first_error")
    if state.self_heals >= 1:
        grant("self_heal")
    if state.streak >= 3:
        grant("streak_3")
    if state.streak >= 7:
        grant("streak_7")
    if state.streak >= 30:
        grant("streak_30")
    if state.consecutive_success >= 10:
        grant("ten_row")
    if state.total_success >= 50:
        grant("fifty_runs")
    if state.total_success >= 100:
        grant("hundred_runs")
    if "print" in milestones:
        grant("hello_world")
    if "assign" in milestones:
        grant("variables")
    if "for" in milestones:
        grant("looper")
    if "if" in milestones:
        grant("decider")
    if "def" in milestones:
        grant("builder")
    if "import" in milestones:
        grant("importer")
    if {f"math:{op}" for op in MATH_OPS} <= milestones:
        grant("math_whiz")
    if state.questions_asked >= 1:
        grant("first_ask")
    if state.consecutive_no_ask >= 25:
        grant("independent")
    return unlocked


def celebrate_achievement(ach: Achievement):
    rule = c(GOLD, "  ────────────────────────────────")
    print()
    print(rule)
    print(f"  {GOLD}★{RESET}  {BOLD}achievement unlocked{RESET}")
    print(f"  {BOLD}{ach.name}{RESET}  {c(DIM, ach.desc)}")
    print(c(GREEN, f"  +{ach.xp} xp"))
    print(rule)
    print()


def celebrate_level(lv: int):
    rule = c(GOLD, "  ────────────────────────────────")
    print()
    print(rule)
    print(f"  {GOLD}★  level up{RESET}  {BOLD}now level {lv}{RESET}")
    print(rule)
    print()


# ── claude ────────────────────────────────────────────────────────
SYSTEM_PROMPT = """You are a Python tutor inside a terminal REPL on Android. The learner is a Python beginner working through standard introductory material (print, types, arithmetic, comparison, booleans, control flow, loops, functions).

You see the last ~20 terminal events (their inputs, outputs, errors) as context. You only speak when summoned by a ?command. Otherwise you stay silent.

Rules:
1. SHORT. Tablet screen. 4-8 sentences max, or 10-20 lines of code. Plain prose, not headers or bullets.
2. Socratic for ?explain/?why: name the cause and ask them to predict the fix. Don't dump the answer.
3. For ?hint: ONE sentence — a question or pointer, never the answer.
4. For ?fix: show the corrected code with one sentence why.
5. For ?quiz: one short predict-the-output question based on what they just did.
6. No condescension. No "great job!" No emoji unless they use them first. Treat them as smart and motivated.
7. Plain text only. No markdown headers (#), no bold (**)."""


def render_events(events):
    if not events:
        return "(no terminal activity yet)"
    out = []
    for ev in events[-20:]:
        label = {"input": "in ", "output": "out", "error": "err"}[ev["kind"]]
        for i, line in enumerate(ev["text"].splitlines() or [""]):
            prefix = f"[{label}]" if i == 0 else "     "
            out.append(f"{prefix} {line}")
    return "\n".join(out)


def ask_claude(client, events, user_question):
    user_msg = (
        f"Recent terminal activity:\n```\n{render_events(events)}\n```\n\n"
        f"{user_question}"
    )
    print(f"\n  {PINK}─────────{RESET}")
    sys.stdout.write("  ")
    sys.stdout.flush()
    try:
        with client.messages.stream(
            model="claude-haiku-4-5",
            max_tokens=1024,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_msg}],
        ) as stream:
            for text in stream.text_stream:
                for ch in text:
                    sys.stdout.write(ch)
                    if ch == "\n":
                        sys.stdout.write("  ")
                    sys.stdout.flush()
        print(f"\n  {PINK}─────────{RESET}\n")
    except anthropic.APIError as e:
        print(f"\n  {RED}claude error: {e}{RESET}\n")
    except KeyboardInterrupt:
        print(f"\n  {DIM}(interrupted){RESET}\n")


# ── commands ──────────────────────────────────────────────────────
COMMAND_PROMPTS = {
    "?explain": "Explain what just happened in my terminal. If there's an error, name the cause and ask me to predict the fix. If unexpected output, ask me to walk through why. Be Socratic.",
    "?why": "Explain what just happened in my terminal. If there's an error, name the cause and ask me to predict the fix. If unexpected output, ask me to walk through why. Be Socratic.",
    "?fix": "Show me the fix for the most recent error, with one sentence why.",
    "?hint": "Give me ONE sentence — the lightest possible nudge. A question or pointer, never the answer.",
    "?quiz": "Quiz me with ONE short predict-the-output question based on what I just did. Wait for my answer.",
}

HELP_COMMANDS = ("?ask", "?explain", "?why", "?fix", "?hint", "?quiz")


def show_stats(state: State):
    lv = level_for_xp(state.xp)
    next_xp = xp_for_level(lv + 1)
    print()
    print(f"  {BOLD}★ Level {lv}{RESET}   {c(DIM, f'{state.xp} / {next_xp} xp')}")
    print(f"  {ORANGE}🔥{RESET} {state.streak} day streak   {c(DIM, f'(last: {state.last_active or chr(8212)})')}")
    print()
    print(f"  {c(DIM, 'runs')}        {state.total_runs}")
    print(f"  {c(DIM, 'successful')}  {state.total_success}")
    print(f"  {c(DIM, 'errors')}      {state.total_errors}")
    print(f"  {c(DIM, 'self-healed')} {state.self_heals}")
    print(f"  {c(DIM, 'asks')}        {state.questions_asked}")
    print()
    print(c(DIM, f"  achievements: {len(state.achievements)} / {len(ACHIEVEMENTS)}"))
    print()


def show_achievements(state: State):
    print()
    have = set(state.achievements)
    for ach in ACHIEVEMENTS:
        if ach.key in have:
            mark = c(GREEN, "✓")
            print(f"  {mark} {BOLD}{ach.name:<14}{RESET}  {c(DIM, ach.desc)}")
        else:
            mark = c(DIM, "◯")
            print(c(DIM, f"  ◯ {ach.name:<14}  {ach.desc}"))
    print()


HELP_TEXT = f"""
  {ROSE}?ask{RESET} {GRAY}<question>{RESET}   ask anything
  {ROSE}?explain{RESET}            explain the last error or output
  {ROSE}?fix{RESET}                show the fix (with one-line why)
  {ROSE}?hint{RESET}               one-sentence nudge, no spoilers
  {ROSE}?quiz{RESET}               predict-the-output question
  {ROSE}?stats{RESET}              xp, streak, totals
  {ROSE}?achievements{RESET}       badges (locked + unlocked)
  {ROSE}?clear{RESET}              clear Claude's view of the session
  {ROSE}?help{RESET}               this
"""


def handle_command(cmd, events, client, state):
    parts = cmd.split(maxsplit=1)
    name = parts[0]
    rest = parts[1] if len(parts) > 1 else ""

    if name == "?help":
        print(HELP_TEXT)
        return
    if name == "?stats":
        show_stats(state)
        return
    if name == "?achievements":
        show_achievements(state)
        return
    if name == "?clear":
        events.clear()
        print(c(DIM, "  context cleared\n"))
        return
    if client is None:
        print(c(RED, "  no API key — set ANTHROPIC_API_KEY and restart\n"))
        return

    if name in HELP_COMMANDS:
        state.questions_asked += 1
        state.consecutive_no_ask = 0
        if state.last_was_error:
            state.asked_since_error = True

    if name == "?ask":
        if not rest:
            print(c(DIM, "  usage: ?ask <question>\n"))
            return
        ask_claude(client, events, rest)
    elif name in COMMAND_PROMPTS:
        ask_claude(client, events, COMMAND_PROMPTS[name])
    else:
        print(c(DIM, f"  unknown: {name} — try ?help\n"))


# ── repl ──────────────────────────────────────────────────────────
def feed_console(line, console):
    stdout_buf = io.StringIO()
    stderr_buf = io.StringIO()
    try:
        with redirect_stdout(stdout_buf), redirect_stderr(stderr_buf):
            more = console.push(line)
    except SystemExit:
        raise
    return more, stdout_buf.getvalue(), stderr_buf.getvalue()


PROMPT_MAIN = ANSI(f"{PINK}>{RESET} ")
PROMPT_CONT = ANSI(f"{DIM}…{RESET} ")


def status_toolbar(state: State):
    lv = level_for_xp(state.xp)
    return ANSI(
        f" {ORANGE}🔥{RESET} {state.streak}  "
        f"{PINK}★{RESET} lv {lv}  "
        f"{c(DIM, f'{state.xp} xp')}  "
        f"{c(DIM, f'{len(state.achievements)}/{len(ACHIEVEMENTS)} badges')}"
    )


BANNER_TOP = f"{PINK}╭───────────────────────────────╮{RESET}"
BANNER_BOT = f"{PINK}╰───────────────────────────────╯{RESET}"


def banner(state: State):
    welcome = f"Welcome back, {LEARNER_NAME}"
    sub = "Python · game mode"
    print()
    print("  " + BANNER_TOP)
    print(f"  {PINK}│{RESET}   {BOLD}{welcome:<28}{RESET}{PINK}│{RESET}")
    print(f"  {PINK}│{RESET}   {DIM}{sub:<28}{RESET}{PINK}│{RESET}")
    print("  " + BANNER_BOT)
    print()
    msg = streak_message(state)
    if msg:
        print(f"  {msg}")
    lv = level_for_xp(state.xp)
    print(
        f"  {ORANGE}🔥{RESET} streak {state.streak}  "
        f"{PINK}·{RESET}  {PINK}★{RESET} lv {lv}  "
        f"{PINK}·{RESET}  {state.xp} xp  "
        f"{PINK}·{RESET}  {len(state.achievements)}/{len(ACHIEVEMENTS)} badges"
    )
    print()
    print(c(DIM, "  type python · earn xp · unlock badges"))
    print(c(DIM, "  claude waits silently — summon with ?"))
    print()
    print(
        f"  {ROSE}?ask{RESET} {GRAY}<q>{RESET}  "
        f"{ROSE}?explain{RESET}  {ROSE}?fix{RESET}  {ROSE}?hint{RESET}"
    )
    print(
        f"  {ROSE}?quiz{RESET}  {ROSE}?stats{RESET}  "
        f"{ROSE}?achievements{RESET}  {ROSE}?help{RESET}"
    )
    print()


def award_run(state: State, full_stmt: str, had_error: bool, asked_helped: bool):
    """Apply xp + state changes for one completed statement. Returns unlocked list."""
    state.total_runs += 1
    prev_error = state.last_was_error

    if had_error:
        state.total_errors += 1
        state.consecutive_success = 0
        state.last_was_error = True
        state.asked_since_error = False
        state.xp += 2
        gained = 2
        label = c(DIM, "+2 xp")
    else:
        state.total_success += 1
        state.consecutive_success += 1
        if prev_error and not state.asked_since_error:
            state.self_heals += 1
            state.xp += 15
            gained = 15
            label = c(GREEN, "+15 xp · self-healed")
        else:
            state.xp += 5
            gained = 5
            label = c(DIM, "+5 xp")
        state.last_was_error = False

    if not asked_helped:
        state.consecutive_no_ask += 1

    milestones = set(state.milestones)
    detect_milestones(full_stmt, had_error, milestones)
    state.milestones = sorted(milestones)

    print(f"  {label}")

    old_level = level_for_xp(state.xp - gained)
    unlocked = check_achievements(state)
    for ach in unlocked:
        celebrate_achievement(ach)
        state.xp += ach.xp
    new_level = level_for_xp(state.xp)
    if new_level > old_level:
        celebrate_level(new_level)
    return unlocked


def main():
    state = load_state()
    banner(state)
    save_state(state)

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if api_key:
        client = anthropic.Anthropic(api_key=api_key)
        print(c(GREEN, "  claude: ready") + c(DIM, "  (haiku 4.5 · silent until summoned)") + "\n")
    else:
        client = None
        print(c(GRAY, "  claude: offline — set ANTHROPIC_API_KEY to enable\n"))

    events = []  # list of {"kind": ..., "text": ...}
    console = code.InteractiveConsole(locals={"__name__": "__main__"})

    history_file = os.path.expanduser("~/.tutor_history")
    session = PromptSession(
        history=FileHistory(history_file),
        lexer=PygmentsLexer(PythonLexer),
        bottom_toolbar=lambda: status_toolbar(state),
    )

    buffer_lines = []
    while True:
        prompt = PROMPT_CONT if buffer_lines else PROMPT_MAIN
        try:
            line = session.prompt(prompt)
        except EOFError:
            print(c(DIM, "  bye\n"))
            save_state(state)
            break
        except KeyboardInterrupt:
            buffer_lines = []
            console.resetbuffer()
            continue

        stripped = line.strip()
        if not stripped and not buffer_lines:
            continue
        if stripped in ("exit", "quit", "exit()", "quit()") and not buffer_lines:
            print(c(DIM, "  bye\n"))
            save_state(state)
            break

        if stripped.startswith("?") and not buffer_lines:
            handle_command(stripped, events, client, state)
            save_state(state)
            continue

        buffer_lines.append(line)
        more, out, err = feed_console(line, console)

        if out:
            sys.stdout.write(out)
            if not out.endswith("\n"):
                print()
        if err:
            sys.stdout.write(c(RED, err))
            if not err.endswith("\n"):
                print()

        if not more:
            full = "\n".join(buffer_lines)
            buffer_lines = []
            events.append({"kind": "input", "text": full})
            if out:
                events.append({"kind": "output", "text": out.rstrip()})
            if err:
                events.append({"kind": "error", "text": err.rstrip()})

            asked_helped = state.asked_since_error if state.last_was_error else False
            award_run(state, full, had_error=bool(err), asked_helped=asked_helped)
            save_state(state)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print()
