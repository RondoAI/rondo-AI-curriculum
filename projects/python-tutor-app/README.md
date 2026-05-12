# Python Tutor — Android App

A Pydroid 3-style Python IDE for Android, built around a game loop:
type Python, earn XP, build streaks, unlock badges. Claude sits in
the background watching every line you type but only responds when
you summon it with a `?command` (`?hint`, `?explain`, `?fix`,
`?quiz`, or `?ask <anything>`).

Built with **Kivy** (Python GUI) and packaged for the Play Store
with **Buildozer**. The Anthropic SDK is called directly from the
device using the user's own API key — no backend, no monthly cost
on your end.

## Status

v1 skeleton — runs, has REPL + Achievements + Settings screens,
game state and achievements ported from `tutor-terminal`. Not yet
packaged to APK.

## Project layout

```
python-tutor-app/
├── main.py            # Kivy App + ScreenManager + screens
├── state.py           # XP, streak, achievements, run_python()
├── claude.py          # Anthropic streaming wrapper (BYOK)
├── buildozer.spec     # APK / AAB packaging config
├── requirements.txt   # desktop dev deps
└── README.md
```

## Run on a desktop (development)

Easiest way to iterate. Mac, Linux, Windows all work.

```bash
cd projects/python-tutor-app
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python main.py
```

A window opens. Set your API key on the Settings screen, then go to
Practice.

## Run on Termux (your phone, no APK yet)

Kivy on Termux needs the Termux:X11 app to render. Once installed:

```bash
pkg install python clang make pkg-config libjpeg-turbo zlib
pip install kivy anthropic
termux-x11 :0 &
export DISPLAY=:0
python main.py
```

This is fiddly. The real plan is to ship an APK — see below.

## Build the APK

Buildozer needs a **Linux** host with Java, autotools, and the
Android SDK/NDK. Two practical paths:

### a) Linux box (or WSL on Windows)

```bash
pip install buildozer cython
sudo apt install -y openjdk-17-jdk autoconf automake libtool \
    pkg-config zlib1g-dev libffi-dev libssl-dev
buildozer android debug     # first run downloads SDK/NDK (~30 min)
```

The APK lands in `bin/`. Sideload it to your phone:

```bash
adb install bin/pythontutor-0.1.0-arm64-v8a-debug.apk
```

### b) GitHub Actions (build in the cloud, no Linux box needed)

Push the repo to GitHub and add `.github/workflows/build.yml` that
runs Buildozer on `ubuntu-latest`. The APK shows up as a workflow
artifact you download to your phone. (Workflow not yet committed —
v2.)

## Anthropic API — how it works

The app uses **BYOK** (Bring Your Own Key):

1. User signs up at console.anthropic.com and gets an `sk-ant-…` key.
2. User pastes it on the Settings screen.
3. The key is saved to `App.user_data_dir/tutor_state.json` on the
   device. On Android that's per-app sandboxed storage — only this
   app can read it.
4. When the user taps `?ask` or `?explain`, the app calls Anthropic
   directly from the device using that key. User pays Anthropic
   directly; you have zero backend and zero cost.

**v3 path** if you want users without their own keys to use the app:
stand up a small backend (Cloudflare Workers / Vercel), hold a single
Anthropic key there, charge users via Google Play subscription. Adds
billing/abuse/server work but unlocks a free tier.

## Play Store publishing

1. Google Play Console account: $25 one-time, identity verification.
2. Change `package.domain` in `buildozer.spec` to a domain you own
   (e.g. `app.yourname`).
3. Add an app icon (`assets/icon.png`, 512×512) and a presplash.
4. Build a release AAB: `buildozer android release`.
5. Sign it: see the Buildozer docs on `android.release.keystore`.
6. Upload to Play Console — first review is usually 3–7 days.

## What's next (roadmap)

- v1.1 — code editor screen with multi-line input, save/load files
- v1.2 — multi-line REPL (currently single-statement)
- v1.3 — `pip install` from inside the app (Pyodide or bundled wheels)
- v2.0 — missions / curated lessons for absolute beginners
- v3.0 — backend proxy + Play subscription for non-BYOK users
