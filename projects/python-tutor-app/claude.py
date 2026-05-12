"""Anthropic Messages API — stdlib only.

The official `anthropic` SDK pulls in pydantic_core (Rust), which
python-for-android cannot easily cross-compile. This module talks to
the API directly with urllib + manual SSE parsing, so the same code
runs on desktop, Termux, and the Android APK build.
"""
from __future__ import annotations

import json
import os
import ssl
import threading
import urllib.error
import urllib.request
from typing import Callable, Optional

# Bundle a CA cert store with the app — Android's bundled Python may not
# pick up the system trust store reliably.
try:
    import certifi
    os.environ.setdefault("SSL_CERT_FILE", certifi.where())
    _SSL_CTX = ssl.create_default_context(cafile=certifi.where())
except ImportError:
    _SSL_CTX = ssl.create_default_context()


API_URL = "https://api.anthropic.com/v1/messages"
MODEL = "claude-haiku-4-5"
ANTHROPIC_VERSION = "2023-06-01"


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


def _parse_sse(resp, on_chunk: Callable[[str], None]) -> None:
    """Read Server-Sent Events from the response stream."""
    event_type: Optional[str] = None
    for raw in resp:
        line = raw.decode("utf-8", errors="replace").rstrip("\r\n")
        if not line:
            event_type = None
            continue
        if line.startswith(":"):
            continue  # comment / heartbeat
        if line.startswith("event:"):
            event_type = line[6:].strip()
        elif line.startswith("data:"):
            data = line[5:].strip()
            if event_type == "content_block_delta":
                try:
                    obj = json.loads(data)
                except json.JSONDecodeError:
                    continue
                delta = obj.get("delta") or {}
                if delta.get("type") == "text_delta":
                    text = delta.get("text") or ""
                    if text:
                        on_chunk(text)


def stream_response(
    api_key: str,
    events: list[dict],
    user_question: str,
    on_chunk: Callable[[str], None],
    on_done: Callable[[Optional[str]], None],
) -> None:
    """Stream a Claude response. Runs in a daemon thread."""
    if not api_key:
        on_done("no API key — set it in Settings")
        return

    def work() -> None:
        try:
            user_msg = (
                f"Recent terminal activity:\n```\n{render_events(events)}\n```\n\n"
                f"{user_question}"
            )
            payload = {
                "model": MODEL,
                "max_tokens": 1500,
                "stream": True,
                "system": SYSTEM_PROMPT,
                "messages": [{"role": "user", "content": user_msg}],
            }
            req = urllib.request.Request(
                API_URL,
                data=json.dumps(payload).encode("utf-8"),
                headers={
                    "x-api-key": api_key,
                    "anthropic-version": ANTHROPIC_VERSION,
                    "content-type": "application/json",
                    "accept": "text/event-stream",
                },
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=60, context=_SSL_CTX) as resp:
                _parse_sse(resp, on_chunk)
            on_done(None)
        except urllib.error.HTTPError as e:
            try:
                body = e.read().decode("utf-8", errors="replace")
                msg = json.loads(body).get("error", {}).get("message") or body[:200]
            except Exception:
                msg = f"HTTP {e.code}"
            on_done(f"api error: {msg}")
        except urllib.error.URLError as e:
            on_done(f"network: {e.reason}")
        except Exception as e:
            on_done(f"error: {e}")

    threading.Thread(target=work, daemon=True).start()
