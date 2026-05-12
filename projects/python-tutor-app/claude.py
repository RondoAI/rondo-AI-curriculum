"""Anthropic API wrapper. BYOK — user's own API key, called from device."""
from __future__ import annotations

import threading
from typing import Callable, Optional

try:
    import anthropic
except ImportError:
    anthropic = None


SYSTEM_PROMPT = """You are a Python tutor embedded in a mobile app for beginners.

The learner types Python in a REPL and you watch every line. You only speak when summoned via a ?command. Otherwise stay silent.

Operating rules:

1. You see the last ~20 terminal events (inputs, outputs, errors). Use them as context.

2. Be SHORT. Phone screen. 4–10 sentences max, or 12–24 lines of code. Plain prose, no headers or bullets unless code is involved.

3. Be Socratic. For ?explain, name the cause and ask the learner to predict the fix. Don't dump the answer.

4. For ?hint, ONE sentence — the lightest nudge. Question or pointer, never the answer.

5. For ?fix, show the corrected code with one sentence why.

6. For ?quiz, ask ONE short predict-the-output question based on what they just did.

7. No condescension. No "great job!" Treat the learner as smart.

8. Plain text only. No markdown headers (#), no bold (**). The app styles things itself."""


COMMAND_PROMPTS = {
    "?explain": (
        "Explain what just happened in my terminal. If there's an error, "
        "name the cause and ask me to predict the fix. If unexpected output, "
        "ask me to walk through why. Be Socratic."
    ),
    "?why": (
        "Explain what just happened in my terminal. If there's an error, "
        "name the cause and ask me to predict the fix. Be Socratic."
    ),
    "?fix": "Show me the fix for the most recent error, with one sentence why.",
    "?hint": (
        "Give me ONE sentence — the lightest possible nudge. A question "
        "or pointer, never the answer."
    ),
    "?quiz": (
        "Quiz me with ONE short predict-the-output question based on what "
        "I just did. Wait for my answer."
    ),
}


def render_events(events: list[dict]) -> str:
    if not events:
        return "(no terminal activity yet)"
    out = []
    for ev in events[-20:]:
        kind = ev.get("kind", "input")
        text = ev.get("text", "")
        label = {"input": "in ", "output": "out", "error": "err"}.get(kind, kind)
        lines = text.splitlines() or [""]
        for i, line in enumerate(lines):
            prefix = f"[{label}]" if i == 0 else "     "
            out.append(f"{prefix} {line}")
    return "\n".join(out)


def stream_response(
    api_key: str,
    events: list[dict],
    user_question: str,
    on_chunk: Callable[[str], None],
    on_done: Callable[[Optional[str]], None],
) -> None:
    """Stream a Claude response. Background thread; callbacks for UI updates."""
    if anthropic is None:
        on_done("anthropic SDK not installed (pip install anthropic)")
        return
    if not api_key:
        on_done("no API key — set it in Settings")
        return

    def work() -> None:
        try:
            client = anthropic.Anthropic(api_key=api_key)
            user_msg = (
                f"Recent terminal activity:\n```\n{render_events(events)}\n```\n\n"
                f"{user_question}"
            )
            with client.messages.stream(
                model="claude-haiku-4-5",
                max_tokens=1500,
                system=SYSTEM_PROMPT,
                messages=[{"role": "user", "content": user_msg}],
            ) as stream:
                for text in stream.text_stream:
                    on_chunk(text)
            on_done(None)
        except Exception as e:  # network, auth, rate limit — all surface as text
            on_done(f"error: {e}")

    threading.Thread(target=work, daemon=True).start()
