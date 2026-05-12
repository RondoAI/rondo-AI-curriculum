# Rondo.py — Python Tutor for Android

A mobile Python IDE built around a game loop: type Python, earn XP,
build a daily streak, unlock badges. Claude sits in the background
watching every line you type but only responds when you summon it
with a `?command` (`?hint`, `?explain`, `?fix`, `?quiz`, or
`?ask <anything>`).

Built with **Kivy** (Python GUI), packaged for the Play Store with
**Buildozer**. The Anthropic Messages API is called directly from the
device via `urllib` (no SDK dependency, no Rust extensions) using the
user's own API key — no backend, no monthly cost.

## Status

**v0.1 skeleton.** REPL + Achievements + Settings screens. Game state
ported from the terminal version. CI build to APK wired up via GitHub
Actions.

## Project layout

```
python-tutor-app/
├── main.py            # Kivy App + ScreenManager + screens
├── state.py           # XP, streak, achievements, run_python()
├── claude.py          # Anthropic Messages API via stdlib urllib + SSE
├── buildozer.spec     # APK / AAB packaging config
├── requirements.txt   # desktop dev deps (kivy + certifi)
└── README.md
```

## Get the APK on your phone (the easy path)

The GitHub Actions workflow at `.github/workflows/build-apk.yml`
builds an APK every time a file under `projects/python-tutor-app/`
changes. You don't need a Linux box.

1. Push a change (or hit "Run workflow" manually in the **Actions**
   tab on github.com).
2. Wait ~20–30 min on the first run (downloading SDK + NDK). Cached
   builds after that take ~5–10 min.
3. Open the workflow run → **Artifacts** → download
   `rondo-py-debug-apk.zip`.
4. On the phone: unzip, tap the `.apk`, allow "Install unknown apps"
   for your file manager, install.
5. Open Rondo.py → Settings → paste your `sk-ant-…` key → Practice.

### If the CI build fails

The Actions tab will show a red ✗. Click into the run, expand the
"Build debug APK" step, and look at the bottom of the log. The
`buildozer-logs` artifact attached on failure contains the detailed
python-for-android log.

The most common first-build failure is a missing system package on
the Ubuntu runner — fix is usually to add the package name to the
"Install system dependencies" step in the workflow YAML.

## Run on a desktop (faster iteration)

```bash
cd projects/python-tutor-app
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python main.py
```

A window opens. Set your API key on the Settings screen, then go to
Practice.

## How the API key works (BYOK)

1. User signs up at console.anthropic.com and gets an `sk-ant-…` key.
2. User pastes it on the Settings screen.
3. The key is saved to `App.user_data_dir/tutor_state.json` on the
   device. On Android that's per-app sandboxed storage — only this
   app can read it.
4. When the user taps `?ask` or `?explain`, the app POSTs to
   `api.anthropic.com/v1/messages` directly using their key. The user
   pays Anthropic; you have zero backend and zero cost.

**v3 path** if you want users without their own keys to use the app:
small backend (Cloudflare Workers / Vercel) holds a single Anthropic
key, charges users via Google Play subscription. Adds billing / abuse
/ server work but unlocks a free tier.

## Play Store publishing checklist

1. Google Play Console account: $25 one-time, identity verification.
2. Change `package.domain` in `buildozer.spec` to a domain you own
   (e.g. `app.rondocampbell`).
3. Add an app icon (`assets/icon.png`, 512×512) and a presplash.
4. Switch the GitHub Actions workflow from `android debug` to
   `android release`.
5. Add signing keystore (see Buildozer `android.release.keystore`
   docs) — store the keystore + password in GitHub Secrets, not in
   the repo.
6. Upload the AAB to Play Console — first review is usually 3–7 days.

## Roadmap

- v0.2 — code editor screen with multi-line input, save/load files
- v0.3 — multi-line REPL (currently single-statement)
- v0.4 — pip-style package install from inside the app (bundled wheels)
- v0.5 — missions / curated lessons for absolute beginners
- v1.0 — Play Store launch
- v2.0 — backend proxy + Play subscription for users without their own key
