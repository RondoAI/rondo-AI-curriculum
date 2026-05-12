"""Game state: xp, streaks, achievements, level math. Pure logic — no UI."""
from __future__ import annotations

import io
import json
import math
import os
import traceback
from contextlib import redirect_stderr, redirect_stdout
from dataclasses import asdict, dataclass, field
from datetime import date, timedelta


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
    api_key: str = ""
    name: str = ""


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


def level_for_xp(xp: int) -> int:
    return int(math.sqrt(max(xp, 0) / 25)) + 1


def xp_for_level(lv: int) -> int:
    return ((lv - 1) ** 2) * 25


def load_state(path: str) -> State:
    if not os.path.exists(path):
        return State()
    try:
        with open(path) as f:
            data = json.load(f)
        return State(**{k: v for k, v in data.items() if k in State.__annotations__})
    except (json.JSONDecodeError, TypeError, OSError):
        return State()


def save_state(state: State, path: str) -> None:
    try:
        parent = os.path.dirname(path)
        if parent:
            os.makedirs(parent, exist_ok=True)
        with open(path, "w") as f:
            json.dump(asdict(state), f, indent=2)
    except OSError:
        pass


def update_streak(state: State) -> str:
    today = date.today().isoformat()
    yesterday = (date.today() - timedelta(days=1)).isoformat()
    if state.last_active == today:
        return ""
    if state.last_active == yesterday:
        state.streak += 1
        state.last_active = today
        return f"streak +1 — {state.streak} days"
    prev = state.streak
    state.streak = 1
    state.last_active = today
    if prev >= 2:
        return f"streak reset (was {prev})"
    return "day 1 — welcome"


def detect_milestones(stmt: str, error: bool, milestones: set) -> None:
    ls = stmt.strip()
    if not error and (ls.startswith("print(") or "\nprint(" in stmt):
        milestones.add("print")
    if not error and "=" in stmt:
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


def check_achievements(state: State) -> list[Achievement]:
    unlocked: list[Achievement] = []
    have = set(state.achievements)
    milestones = set(state.milestones)

    def grant(key: str) -> None:
        if key in have:
            return
        ach = next(a for a in ACHIEVEMENTS if a.key == key)
        unlocked.append(ach)
        state.achievements.append(key)
        have.add(key)
        state.xp += ach.xp

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


def run_python(stmt: str, console_locals: dict) -> tuple[str, str]:
    """Run a Python statement. Returns (stdout, stderr)."""
    out = io.StringIO()
    err = io.StringIO()
    try:
        with redirect_stdout(out), redirect_stderr(err):
            try:
                code_obj = compile(stmt, "<repl>", "eval")
                value = eval(code_obj, console_locals)
                if value is not None:
                    print(repr(value))
            except SyntaxError:
                code_obj = compile(stmt, "<repl>", "exec")
                exec(code_obj, console_locals)
    except SystemExit:
        raise
    except BaseException:
        err.write(traceback.format_exc())
    return out.getvalue(), err.getvalue()


def award_run(state: State, stmt: str, error: bool) -> tuple[int, list[Achievement]]:
    """Update state for a single Python run. Returns (xp_awarded, newly_unlocked)."""
    state.total_runs += 1
    milestones = set(state.milestones)
    detect_milestones(stmt, error, milestones)
    state.milestones = sorted(milestones)

    if error:
        state.total_errors += 1
        state.consecutive_success = 0
        state.last_was_error = True
        state.asked_since_error = False
        xp = 2
    else:
        state.total_success += 1
        state.consecutive_success += 1
        xp = 5
        if state.last_was_error and not state.asked_since_error:
            state.self_heals += 1
            xp += 10
        state.last_was_error = False
        state.asked_since_error = False

    state.consecutive_no_ask += 1
    state.xp += xp
    unlocked = check_achievements(state)
    return xp, unlocked


def award_ask(state: State) -> None:
    state.questions_asked += 1
    state.consecutive_no_ask = 0
    state.asked_since_error = True
