"""Python Tutor — Kivy app.

Run on desktop / Termux:
    pip install -r requirements.txt
    python main.py

Build APK with Buildozer (Linux):
    pip install buildozer
    buildozer android debug
"""
from __future__ import annotations

import os

from kivy.app import App
from kivy.clock import Clock
from kivy.core.window import Window
from kivy.graphics import Color, Rectangle, RoundedRectangle
from kivy.metrics import dp
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.button import Button
from kivy.uix.gridlayout import GridLayout
from kivy.uix.label import Label
from kivy.uix.popup import Popup
from kivy.uix.progressbar import ProgressBar
from kivy.uix.screenmanager import FadeTransition, Screen, ScreenManager
from kivy.uix.scrollview import ScrollView
from kivy.uix.textinput import TextInput

from claude import COMMAND_PROMPTS, stream_response
from state import (
    ACHIEVEMENTS,
    award_ask,
    award_run,
    level_for_xp,
    load_state,
    run_python,
    save_state,
    update_streak,
    xp_for_level,
)


# ── palette ───────────────────────────────────────────────────────────
DARK_BG = (0.05, 0.05, 0.07, 1)
CARD_BG = (0.10, 0.10, 0.14, 1)
RAIL_BG = (0.07, 0.07, 0.10, 1)
PINK = (0.96, 0.56, 0.78, 1)
ROSE = (0.92, 0.52, 0.70, 1)
GOLD = (1.00, 0.78, 0.20, 1)
GREEN = (0.55, 0.92, 0.62, 1)
ORANGE = (0.97, 0.65, 0.27, 1)
RED = (0.92, 0.42, 0.42, 1)
GRAY = (0.62, 0.62, 0.66, 1)
DIM = (0.45, 0.45, 0.50, 1)
WHITE = (0.93, 0.93, 0.95, 1)

MONO = "RobotoMono-Regular" if os.path.exists("/system/fonts/RobotoMono-Regular.ttf") else "RobotoMono"


def state_path() -> str:
    return os.path.join(App.get_running_app().user_data_dir, "tutor_state.json")


# ── widgets ───────────────────────────────────────────────────────────
class Panel(BoxLayout):
    """BoxLayout with a rounded background. Cheap card."""

    def __init__(self, bg=CARD_BG, radius=12, **kwargs):
        super().__init__(**kwargs)
        self._bg = bg
        self._radius = radius
        with self.canvas.before:
            self._color = Color(*bg)
            self._rect = RoundedRectangle(pos=self.pos, size=self.size, radius=[radius])
        self.bind(pos=self._sync, size=self._sync)

    def _sync(self, *_):
        self._rect.pos = self.pos
        self._rect.size = self.size


def chip(text: str, on_press, bg=CARD_BG, color=PINK) -> Button:
    """Pink-bordered button styled like a Termius command chip."""
    btn = Button(
        text=text,
        background_normal="",
        background_color=bg,
        color=color,
        font_size="15sp",
        bold=True,
        size_hint_y=None,
        height=dp(44),
    )
    btn.bind(on_press=on_press)
    return btn


def primary_button(text: str, on_press) -> Button:
    btn = Button(
        text=text,
        background_normal="",
        background_color=PINK,
        color=DARK_BG,
        font_size="16sp",
        bold=True,
        size_hint_y=None,
        height=dp(52),
    )
    btn.bind(on_press=on_press)
    return btn


class StatusBar(BoxLayout):
    """Streak · level · xp · badges. Updates from app.state."""

    def __init__(self, **kwargs):
        super().__init__(orientation="vertical", size_hint_y=None, height=dp(72),
                         padding=[dp(12), dp(8)], spacing=dp(4), **kwargs)
        with self.canvas.before:
            Color(*RAIL_BG)
            self._rect = Rectangle(pos=self.pos, size=self.size)
        self.bind(pos=self._sync, size=self._sync)

        self.text = Label(text="", font_size="13sp", color=WHITE, halign="left",
                          valign="middle", markup=True, size_hint_y=None, height=dp(20))
        self.text.bind(size=lambda *_: setattr(self.text, "text_size", self.text.size))
        self.bar = ProgressBar(max=100, value=0, size_hint_y=None, height=dp(8))
        self.sub = Label(text="", font_size="11sp", color=DIM, halign="left",
                         valign="middle", size_hint_y=None, height=dp(16))
        self.sub.bind(size=lambda *_: setattr(self.sub, "text_size", self.sub.size))

        self.add_widget(self.text)
        self.add_widget(self.bar)
        self.add_widget(self.sub)

    def _sync(self, *_):
        self._rect.pos = self.pos
        self._rect.size = self.size

    def refresh(self, state):
        lv = level_for_xp(state.xp)
        floor = xp_for_level(lv)
        ceil = xp_for_level(lv + 1)
        into = state.xp - floor
        span = max(ceil - floor, 1)
        self.bar.max = span
        self.bar.value = into
        streak = f"[color=f7a64e]🔥 {state.streak}[/color]"
        lvl = f"[color=ffc742]★ lv {lv}[/color]"
        xp = f"[color=f5f5f5]{state.xp} xp[/color]"
        badges = f"[color=8bf09e]{len(state.achievements)}/{len(ACHIEVEMENTS)}[/color]"
        self.text.text = f"{streak}   {lvl}   {xp}   {badges}"
        self.sub.text = f"lv {lv} → lv {lv + 1}   ·   {into}/{span} xp"


class TopBar(BoxLayout):
    def __init__(self, title: str, on_back=None, **kwargs):
        super().__init__(orientation="horizontal", size_hint_y=None, height=dp(48),
                         padding=[dp(8), 0], spacing=dp(8), **kwargs)
        if on_back is not None:
            back = Button(text="<", size_hint_x=None, width=dp(48),
                          background_normal="", background_color=CARD_BG,
                          color=PINK, font_size="20sp", bold=True)
            back.bind(on_press=on_back)
            self.add_widget(back)
        else:
            self.add_widget(BoxLayout(size_hint_x=None, width=dp(48)))
        lbl = Label(text=title, color=WHITE, font_size="18sp", bold=True, halign="center")
        self.add_widget(lbl)
        self.add_widget(BoxLayout(size_hint_x=None, width=dp(48)))


# ── home screen ───────────────────────────────────────────────────────
class HomeScreen(Screen):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.root_box = BoxLayout(orientation="vertical")
        self.add_widget(self.root_box)

    def on_pre_enter(self, *_):
        self.root_box.clear_widgets()
        app = App.get_running_app()
        state = app.state

        self.root_box.add_widget(TopBar("rondo.py"))

        self.status = StatusBar()
        self.status.refresh(state)
        self.root_box.add_widget(self.status)

        greeting = Label(
            text=f"welcome back, {state.name or 'friend'}",
            color=WHITE, font_size="22sp", bold=True,
            size_hint_y=None, height=dp(44),
        )
        self.root_box.add_widget(greeting)

        sub = Label(
            text="haiku 4.5 · silent until summoned",
            color=DIM, font_size="13sp",
            size_hint_y=None, height=dp(20),
        )
        self.root_box.add_widget(sub)

        actions = BoxLayout(orientation="vertical", padding=[dp(16), dp(16)], spacing=dp(12))
        actions.add_widget(primary_button("practice  ›", lambda *_: self._go("repl")))
        actions.add_widget(chip("achievements", lambda *_: self._go("achievements"),
                                bg=CARD_BG, color=GOLD))
        actions.add_widget(chip("settings", lambda *_: self._go("settings"),
                                bg=CARD_BG, color=PINK))
        actions.add_widget(BoxLayout())  # spacer
        self.root_box.add_widget(actions)

        tagline = Label(
            text="type python · earn xp · unlock badges",
            color=DIM, font_size="12sp",
            size_hint_y=None, height=dp(20),
        )
        self.root_box.add_widget(tagline)

    def _go(self, name: str):
        self.manager.transition = FadeTransition(duration=0.15)
        self.manager.current = name


# ── repl screen ───────────────────────────────────────────────────────
class ReplScreen(Screen):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.console_locals: dict = {"__name__": "__main__"}
        self.events: list[dict] = []
        self._build()

    def _build(self):
        self.root_box = BoxLayout(orientation="vertical")
        self.add_widget(self.root_box)

        self.root_box.add_widget(
            TopBar("practice", on_back=lambda *_: self._back())
        )
        self.status = StatusBar()
        self.root_box.add_widget(self.status)

        # output area — scrollable
        self.output_box = BoxLayout(orientation="vertical", size_hint_y=None,
                                    spacing=dp(2), padding=[dp(12), dp(8)])
        self.output_box.bind(minimum_height=self.output_box.setter("height"))
        scroll = ScrollView(do_scroll_x=False)
        scroll.add_widget(self.output_box)
        self.root_box.add_widget(scroll)

        # quick ?command chips
        chips = GridLayout(cols=4, size_hint_y=None, height=dp(44),
                           padding=[dp(8), 0], spacing=dp(6))
        for label, cmd in [("?hint", "?hint"), ("?explain", "?explain"),
                           ("?fix", "?fix"), ("?quiz", "?quiz")]:
            chips.add_widget(chip(label, lambda _b, c=cmd: self._do_command(c)))
        self.root_box.add_widget(chips)

        # ?ask row
        ask_row = BoxLayout(orientation="horizontal", size_hint_y=None, height=dp(48),
                            padding=[dp(8), 0], spacing=dp(6))
        self.ask_input = TextInput(
            hint_text="?ask anything…",
            multiline=False, font_size="14sp",
            background_normal="", background_active="",
            background_color=CARD_BG, foreground_color=WHITE,
            cursor_color=PINK, size_hint_x=0.78,
        )
        ask_btn = Button(text="ask", background_normal="", background_color=PINK,
                         color=DARK_BG, bold=True, size_hint_x=0.22)
        ask_btn.bind(on_press=lambda *_: self._do_ask())
        ask_row.add_widget(self.ask_input)
        ask_row.add_widget(ask_btn)
        self.root_box.add_widget(ask_row)

        # python input row
        py_row = BoxLayout(orientation="horizontal", size_hint_y=None, height=dp(56),
                          padding=[dp(8), 0], spacing=dp(6))
        prompt = Label(text=">", color=PINK, font_size="22sp", bold=True,
                       size_hint_x=None, width=dp(20))
        self.code_input = TextInput(
            hint_text="type python and hit run",
            multiline=False, font_size="15sp",
            font_name=MONO,
            background_normal="", background_active="",
            background_color=CARD_BG, foreground_color=WHITE,
            cursor_color=PINK, size_hint_x=0.62,
        )
        self.code_input.bind(on_text_validate=lambda *_: self._run())
        run_btn = Button(text="run", background_normal="", background_color=GREEN,
                         color=DARK_BG, bold=True, size_hint_x=None, width=dp(76))
        run_btn.bind(on_press=lambda *_: self._run())
        py_row.add_widget(prompt)
        py_row.add_widget(self.code_input)
        py_row.add_widget(run_btn)
        self.root_box.add_widget(py_row)

    def on_pre_enter(self, *_):
        app = App.get_running_app()
        self.status.refresh(app.state)
        if not self.output_box.children:
            self._println("type python below. claude watches but stays silent.", DIM)
            self._println("tap ?hint or ?explain when you want help.", DIM)
            self._println("", WHITE)

    def _back(self):
        self.manager.transition = FadeTransition(duration=0.15)
        self.manager.current = "home"

    def _println(self, text: str, color=WHITE, bold=False):
        lbl = Label(
            text=text, color=color, font_size="14sp", bold=bold,
            font_name=MONO, halign="left", valign="top",
            size_hint_y=None, markup=False,
        )
        lbl.bind(size=lambda *_: setattr(lbl, "text_size", (lbl.width, None)))
        lbl.bind(texture_size=lambda inst, ts: setattr(inst, "height", max(ts[1], dp(18))))
        self.output_box.add_widget(lbl)

    def _run(self):
        stmt = self.code_input.text.strip()
        if not stmt:
            return
        self.code_input.text = ""
        app = App.get_running_app()
        state = app.state

        self._println(f"> {stmt}", PINK, bold=True)
        self.events.append({"kind": "input", "text": stmt})

        out, err = run_python(stmt, self.console_locals)
        had_error = bool(err)
        if out:
            for line in out.rstrip("\n").split("\n"):
                self._println(line, WHITE)
            self.events.append({"kind": "output", "text": out.rstrip()})
        if err:
            for line in err.rstrip("\n").split("\n"):
                self._println(line, RED)
            self.events.append({"kind": "error", "text": err.rstrip()})

        xp, unlocked = award_run(state, stmt, had_error)
        tag = "+5 xp" if not had_error else "+2 xp"
        if not had_error and state.self_heals > 0 and xp == 15:
            tag = "+15 xp · self-healed"
        elif not had_error and xp == 15:
            tag = "+15 xp"
        self._println(f"  {tag}", GREEN if not had_error else ORANGE)
        self._println("", WHITE)

        self.status.refresh(state)
        for ach in unlocked:
            self._show_achievement(ach)

        save_state(state, state_path())

    def _do_command(self, cmd: str):
        prompt_text = COMMAND_PROMPTS.get(cmd)
        if prompt_text is None:
            return
        self._invoke_claude(cmd, prompt_text)

    def _do_ask(self):
        q = self.ask_input.text.strip()
        if not q:
            return
        self.ask_input.text = ""
        self._invoke_claude(f"?ask {q[:24]}", q)

    def _invoke_claude(self, label: str, question: str):
        app = App.get_running_app()
        state = app.state
        if not state.api_key:
            self._println("  no API key — set it in Settings", ORANGE)
            self._println("", WHITE)
            return

        award_ask(state)
        self.status.refresh(state)

        self._println(f"  {label}", ROSE, bold=True)
        rule_top = Label(
            text="  ─────────", color=ROSE, font_size="14sp",
            font_name=MONO, halign="left", size_hint_y=None, height=dp(20),
        )
        self.output_box.add_widget(rule_top)
        self._reply_label = Label(
            text="  thinking…", color=DIM, font_size="14sp",
            font_name=MONO, halign="left", valign="top",
            size_hint_y=None,
        )
        self._reply_buffer = ""
        self._reply_label.bind(
            size=lambda *_: setattr(self._reply_label, "text_size",
                                    (self._reply_label.width, None))
        )
        self._reply_label.bind(
            texture_size=lambda inst, ts: setattr(inst, "height", max(ts[1], dp(20)))
        )
        self.output_box.add_widget(self._reply_label)

        stream_response(
            api_key=state.api_key,
            events=self.events,
            user_question=question,
            on_chunk=self._on_chunk,
            on_done=self._on_done,
        )

    def _on_chunk(self, chunk: str):
        def update(_dt):
            if self._reply_buffer == "":
                self._reply_label.text = "  "
            self._reply_buffer += chunk
            self._reply_label.text = "  " + self._reply_buffer.replace("\n", "\n  ")
            self._reply_label.color = WHITE
        Clock.schedule_once(update, 0)

    def _on_done(self, err):
        def finish(_dt):
            if err:
                self._reply_label.text = f"  {err}"
                self._reply_label.color = RED
            rule = Label(
                text="  ─────────", color=ROSE, font_size="14sp",
                font_name=MONO, halign="left", size_hint_y=None, height=dp(20),
            )
            self.output_box.add_widget(rule)
            self._println("", WHITE)
        Clock.schedule_once(finish, 0)

    def _show_achievement(self, ach):
        body = BoxLayout(orientation="vertical", padding=dp(16), spacing=dp(8))
        body.add_widget(Label(text="★  achievement unlocked", color=GOLD,
                              font_size="14sp", bold=True, size_hint_y=None, height=dp(24)))
        body.add_widget(Label(text=ach.name, color=WHITE, font_size="20sp",
                              bold=True, size_hint_y=None, height=dp(28)))
        body.add_widget(Label(text=ach.desc, color=DIM, font_size="13sp",
                              size_hint_y=None, height=dp(20)))
        body.add_widget(Label(text=f"+{ach.xp} xp", color=GREEN, font_size="15sp",
                              bold=True, size_hint_y=None, height=dp(22)))
        close = Button(text="continue", background_normal="", background_color=PINK,
                       color=DARK_BG, bold=True, size_hint_y=None, height=dp(44))
        body.add_widget(close)
        popup = Popup(title="", separator_height=0, background="",
                      background_color=CARD_BG, size_hint=(0.85, None),
                      height=dp(240), auto_dismiss=True, content=body)
        close.bind(on_press=popup.dismiss)
        popup.open()


# ── achievements screen ───────────────────────────────────────────────
class AchievementsScreen(Screen):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.root_box = BoxLayout(orientation="vertical")
        self.add_widget(self.root_box)

    def on_pre_enter(self, *_):
        self.root_box.clear_widgets()
        app = App.get_running_app()
        state = app.state

        self.root_box.add_widget(TopBar("achievements", on_back=lambda *_: self._back()))
        bar = StatusBar()
        bar.refresh(state)
        self.root_box.add_widget(bar)

        grid = GridLayout(cols=1, spacing=dp(8), padding=[dp(12), dp(12)],
                          size_hint_y=None)
        grid.bind(minimum_height=grid.setter("height"))
        have = set(state.achievements)
        for ach in ACHIEVEMENTS:
            row = Panel(orientation="vertical", padding=dp(12), spacing=dp(2),
                        size_hint_y=None, height=dp(72),
                        bg=CARD_BG if ach.key in have else RAIL_BG)
            unlocked = ach.key in have
            tick = "★" if unlocked else "○"
            title = Label(
                text=f"{tick}  {ach.name}",
                color=GOLD if unlocked else DIM,
                font_size="15sp", bold=True, halign="left", valign="middle",
                size_hint_y=None, height=dp(22),
            )
            title.bind(size=lambda *_, l=title: setattr(l, "text_size", l.size))
            desc = Label(
                text=ach.desc,
                color=WHITE if unlocked else DIM,
                font_size="12sp", halign="left", valign="middle",
                size_hint_y=None, height=dp(18),
            )
            desc.bind(size=lambda *_, l=desc: setattr(l, "text_size", l.size))
            xp = Label(
                text=f"+{ach.xp} xp", color=GREEN if unlocked else DIM,
                font_size="11sp", halign="left", valign="middle",
                size_hint_y=None, height=dp(16),
            )
            xp.bind(size=lambda *_, l=xp: setattr(l, "text_size", l.size))
            row.add_widget(title)
            row.add_widget(desc)
            row.add_widget(xp)
            grid.add_widget(row)
        scroll = ScrollView(do_scroll_x=False)
        scroll.add_widget(grid)
        self.root_box.add_widget(scroll)

    def _back(self):
        self.manager.transition = FadeTransition(duration=0.15)
        self.manager.current = "home"


# ── settings screen ───────────────────────────────────────────────────
class SettingsScreen(Screen):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self._build()

    def _build(self):
        self.root_box = BoxLayout(orientation="vertical")
        self.add_widget(self.root_box)
        self.root_box.add_widget(TopBar("settings", on_back=lambda *_: self._back()))

        body = BoxLayout(orientation="vertical", padding=dp(16), spacing=dp(14))

        body.add_widget(Label(
            text="anthropic api key (BYOK)", color=WHITE, font_size="14sp", bold=True,
            halign="left", valign="middle", size_hint_y=None, height=dp(22),
            text_size=(Window.width - dp(32), None),
        ))
        body.add_widget(Label(
            text="get a key at console.anthropic.com — stored on this device only.",
            color=DIM, font_size="11sp", halign="left", valign="middle",
            size_hint_y=None, height=dp(18),
            text_size=(Window.width - dp(32), None),
        ))
        self.key_input = TextInput(
            hint_text="sk-ant-…", multiline=False, font_size="13sp",
            password=True,
            background_normal="", background_active="",
            background_color=CARD_BG, foreground_color=WHITE,
            cursor_color=PINK, size_hint_y=None, height=dp(46),
        )
        body.add_widget(self.key_input)

        body.add_widget(Label(
            text="display name", color=WHITE, font_size="14sp", bold=True,
            halign="left", valign="middle", size_hint_y=None, height=dp(22),
            text_size=(Window.width - dp(32), None),
        ))
        self.name_input = TextInput(
            hint_text="your name", multiline=False, font_size="13sp",
            background_normal="", background_active="",
            background_color=CARD_BG, foreground_color=WHITE,
            cursor_color=PINK, size_hint_y=None, height=dp(46),
        )
        body.add_widget(self.name_input)

        save_btn = primary_button("save", lambda *_: self._save())
        body.add_widget(save_btn)

        self.feedback = Label(text="", color=GREEN, font_size="13sp",
                              size_hint_y=None, height=dp(20))
        body.add_widget(self.feedback)

        body.add_widget(BoxLayout())  # spacer
        self.root_box.add_widget(body)

    def on_pre_enter(self, *_):
        state = App.get_running_app().state
        self.key_input.text = state.api_key
        self.name_input.text = state.name

    def _save(self):
        app = App.get_running_app()
        app.state.api_key = self.key_input.text.strip()
        app.state.name = self.name_input.text.strip()
        save_state(app.state, state_path())
        self.feedback.text = "saved"
        Clock.schedule_once(lambda *_: setattr(self.feedback, "text", ""), 1.5)

    def _back(self):
        self.manager.transition = FadeTransition(duration=0.15)
        self.manager.current = "home"


# ── app ───────────────────────────────────────────────────────────────
class RondoPyApp(App):
    title = "Rondo.py"

    def build(self):
        Window.clearcolor = DARK_BG
        self.state = load_state(state_path())
        msg = update_streak(self.state)
        save_state(self.state, state_path())

        sm = ScreenManager(transition=FadeTransition(duration=0.15))
        sm.add_widget(HomeScreen(name="home"))
        sm.add_widget(ReplScreen(name="repl"))
        sm.add_widget(AchievementsScreen(name="achievements"))
        sm.add_widget(SettingsScreen(name="settings"))

        if msg:
            Clock.schedule_once(lambda *_: self._show_streak_toast(msg), 0.5)
        return sm

    def _show_streak_toast(self, msg: str):
        body = BoxLayout(orientation="vertical", padding=dp(16), spacing=dp(6))
        body.add_widget(Label(text=msg, color=ORANGE, font_size="16sp", bold=True,
                              size_hint_y=None, height=dp(28)))
        close = Button(text="ok", background_normal="", background_color=PINK,
                       color=DARK_BG, bold=True, size_hint_y=None, height=dp(40))
        body.add_widget(close)
        popup = Popup(title="", separator_height=0, content=body,
                      size_hint=(0.75, None), height=dp(140))
        close.bind(on_press=popup.dismiss)
        popup.open()

    def on_stop(self):
        save_state(self.state, state_path())


if __name__ == "__main__":
    RondoPyApp().run()
