#!/usr/bin/env python3
"""Python REPL with Claude in the background.

Termius-style. Claude watches, stays silent until summoned by a
?command. Make mistakes, sit with them, ask for help when ready.
"""
import code
import io
import os
import sys
import traceback
from contextlib import redirect_stderr, redirect_stdout
from dataclasses import dataclass

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


RESET = "\033[0m"
DIM = "\033[2m"
BOLD = "\033[1m"
PINK = "\033[38;5;212m"
ROSE = "\033[38;5;211m"
GREEN = "\033[38;5;120m"
YELLOW = "\033[38;5;221m"
RED = "\033[38;5;203m"
GRAY = "\033[38;5;245m"


def c(color, text):
    return f"{color}{text}{RESET}"


BANNER = f"""
{PINK}╭───────────────────────────────╮{RESET}
{PINK}│{RESET}   {BOLD}Welcome back, Rondo{RESET}         {PINK}│{RESET}
{PINK}│{RESET}   {DIM}Opus 4.7 · python tutor{RESET}     {PINK}│{RESET}
{PINK}╰───────────────────────────────╯{RESET}

  {ROSE}?ask{RESET} {GRAY}<question>{RESET}   ask anything
  {ROSE}?explain{RESET}            last error / output
  {ROSE}?fix{RESET}                show me the fix
  {ROSE}?hint{RESET}               gentle nudge
  {ROSE}?quiz{RESET}               quiz me
  {ROSE}?clear{RESET}  {ROSE}?help{RESET}       clear context / help

  {DIM}Ctrl-D or `exit` to quit.{RESET}
"""

HELP_TEXT = f"""
  {ROSE}?ask{RESET} {GRAY}<question>{RESET}   ask anything
  {ROSE}?explain{RESET}            explain the last error or output
  {ROSE}?fix{RESET}                show the fix (with one-line why)
  {ROSE}?hint{RESET}               one-sentence nudge, no spoilers
  {ROSE}?quiz{RESET}               quiz me on what just happened
  {ROSE}?clear{RESET}              clear Claude's view of the session
  {ROSE}?help{RESET}               this
"""


@dataclass
class Event:
    kind: str   # "input" | "output" | "error"
    text: str


SYSTEM_PROMPT = """You are a Python tutor embedded in a terminal REPL on an Android phone.

The learner is Rondo Campbell, working through "Intro to Python for Computer Science and Data Science" by the Deitels. He is in Phase 1, Chapter 1: print, basic types (int, float, str), arithmetic operators, operator precedence, augmented assignment. Comparison operators and booleans are likely next. Treat him as smart and motivated — beginner Python coder, not beginner mind. He is a practicing Muslim and a serious student. No condescension. No "great job!" No emoji unless he uses them first.

Operating rules:

1. You see the last ~20 terminal events (inputs, outputs, errors). You only speak when summoned via a ?command. Otherwise stay silent.

2. Be SHORT. Phone screen. 6–12 sentences max, or 15–30 lines of code. Plain prose, not headers or bullets, unless code is involved.

3. Be Socratic. For ?explain / ?why, name the cause and ask him to predict the fix. Don't dump the answer.

4. For ?hint, ONE sentence — the lightest possible nudge. Question or pointer, never the answer.

5. For ?fix, show the corrected code with one sentence why.

6. For ?quiz, ask ONE short predict-the-output question based on what he just did. Wait for his answer.

7. If he asks something outside Phase 1 scope, answer briefly and mark it "ahead of where you are — bookmark this."

8. Plain text only. No markdown headers (#), no bold (**). The terminal styles things itself."""


def render_events(events):
    if not events:
        return "(no terminal activity yet)"
    out = []
    for ev in events[-20:]:
        label = {"input": "in ", "output": "out", "error": "err"}[ev.kind]
        lines = ev.text.splitlines() or [""]
        for i, line in enumerate(lines):
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
            model="claude-opus-4-7",
            max_tokens=2000,
            thinking={"type": "adaptive"},
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


COMMAND_PROMPTS = {
    "?explain": "Explain what just happened in my terminal. If there's an error, name the cause and ask me to predict the fix. If unexpected output, ask me to walk through why. Be Socratic.",
    "?why": "Explain what just happened in my terminal. If there's an error, name the cause and ask me to predict the fix. If unexpected output, ask me to walk through why. Be Socratic.",
    "?fix": "Show me the fix for the most recent error, with one sentence why.",
    "?hint": "Give me ONE sentence — the lightest possible nudge. A question or pointer, never the answer.",
    "?quiz": "Quiz me with ONE short predict-the-output question based on what I just did. Wait for my answer.",
}


def handle_command(cmd, events, client):
    parts = cmd.split(maxsplit=1)
    name = parts[0]
    rest = parts[1] if len(parts) > 1 else ""

    if name == "?help":
        print(HELP_TEXT)
        return
    if name == "?clear":
        events.clear()
        print(c(DIM, "  context cleared\n"))
        return
    if client is None:
        print(c(RED, "  no API key — set ANTHROPIC_API_KEY and restart\n"))
        return

    if name == "?ask":
        if not rest:
            print(c(DIM, "  usage: ?ask <question>\n"))
            return
        ask_claude(client, events, rest)
    elif name in COMMAND_PROMPTS:
        ask_claude(client, events, COMMAND_PROMPTS[name])
    else:
        print(c(DIM, f"  unknown: {name} — try ?help\n"))


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


def main():
    print(BANNER)

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if api_key:
        client = anthropic.Anthropic(api_key=api_key)
        print(c(GREEN, "  claude: ready") + c(DIM, "  (silent until summoned)") + "\n")
    else:
        client = None
        print(c(YELLOW, "  claude: offline — set ANTHROPIC_API_KEY to enable\n"))

    events = []
    console = code.InteractiveConsole(locals={"__name__": "__main__"})

    history_file = os.path.expanduser("~/.tutor_history")
    session = PromptSession(
        history=FileHistory(history_file),
        lexer=PygmentsLexer(PythonLexer),
    )

    buffer_lines = []
    while True:
        prompt = PROMPT_CONT if buffer_lines else PROMPT_MAIN
        try:
            line = session.prompt(prompt)
        except EOFError:
            print(c(DIM, "  bye\n"))
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
            break

        if stripped.startswith("?") and not buffer_lines:
            handle_command(stripped, events, client)
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
            events.append(Event("input", full))
            if out:
                events.append(Event("output", out.rstrip()))
            if err:
                events.append(Event("error", err.rstrip()))
            buffer_lines = []


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print()
