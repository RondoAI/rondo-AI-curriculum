"""Probe APK — a 10-line "Hello World" to test whether Kivy itself
works on the target device. If this opens and shows the pink text,
the build pipeline is healthy and the bug is somewhere in main_full.py.
If even this won't open, Kivy/Buildozer isn't compatible with this
device and we need to adjust the build config (ndk_api, p4a branch).

The "real" app lives in main_full.py and will be swapped back in
once we've isolated the issue.
"""
from kivy.app import App
from kivy.core.window import Window
from kivy.uix.label import Label


class ProbeApp(App):
    title = "Rondo.py probe"

    def build(self):
        Window.clearcolor = (0.05, 0.05, 0.07, 1)
        return Label(
            text="rondo.py probe\n\nkivy works on this device\n\nif you see this, the build is healthy",
            color=(0.96, 0.56, 0.78, 1),
            font_size="22sp",
            halign="center",
            valign="middle",
        )


if __name__ == "__main__":
    ProbeApp().run()
