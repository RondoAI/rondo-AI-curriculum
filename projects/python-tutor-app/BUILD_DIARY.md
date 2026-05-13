# Build Diary — Rondo.py APK, May 2026

A chronological record of trying to ship the first Android APK for
Rondo.py. We hit ten different failure modes in one evening. Each
one taught something. The diary stays in the repo so future-us (and
anyone else trying Buildozer + Kivy + a 2026-era Android phone)
knows the trail we cut.

Device: Samsung Galaxy A16 5G (SM-A166U), Android 14, arm64-v8a.
Build host: GitHub Actions `ubuntu-22.04` runner.
Tooling: Buildozer 1.6.0, python-for-android master, Kivy 2.3+,
Python 3.11.

## Goal

A `.apk` that installs from a phone and opens to the pink Rondo.py
home screen. Stretch goal: same flow ending in a Play Store upload.

## What's working (May 2026)

- **`tutor-terminal/`** — Python REPL game running in Termux on the
  phone. Same XP / streak / achievements / Claude integration as the
  Kivy version, just terminal UI. Production-ready today.
- **`python-tutor-app/` source code** — Kivy app builds a real APK
  artifact (39 MB, signed debug). Installs. Just doesn't open on
  Android 14.
- **CI pipeline** — `.github/workflows/build-apk.yml` produces an
  APK on every push that touches the project. Caches the Android
  SDK + NDK download, so post-first builds are ~10 min.

## The ten-build trail

Each row is a real failed CI run. Times are runner wall-clock.

| # | Commit | Duration | Failure | Lesson |
|---|--------|---|---|---|
| 1 | `70eab35` (rename + stdlib) | 1m 25s | apt install failed | First Buildozer cycle. Guessed it was `libtinfo5`. |
| 2 | `82005ee` (drop libtinfo5) | 1m 34s | Still apt-stage fail | The guess was right but not enough — needed the actual log. |
| 3 | `529378c` (`ArtemSBulgakov/buildozer-action@v1`) | 1m 12s | Action's own Dockerfile failed | The community action is unmaintained on modern runners. |
| 4 | `2889618` (manual + log tail) | 39s | `which libtool` exited non-zero, killed my diagnostic step | My own debug line crashed before Buildozer ran. Ubuntu 22.04 moved `libtool` binary into `libtool-bin`. |
| 5 | `6ae0fbc` (`libtool-bin` + tolerant `which`) | 55m 20s | `# Aidl not found, please install it.` | The build actually ran. Buildozer auto-requested `build-tools;37.0.0` (doesn't exist) → license unaccepted → install skipped → no aidl → crash. |
| 6 | `23fbbd6` (v0.2 EditorScreen added) | queued, never useful | superseded by #7 | Pushed feature work in parallel to debugging. Lesson: when CI is fighting you, don't add fuel. |
| 7 | `682a85c` (pin build-tools 34.0.0 + accept SDK licenses) | 16m 38s | `# sdkmanager path "...tools/bin/sdkmanager" does not exist` | Buildozer 1.6 expects the *deprecated* `tools/` SDK layout. Google retired that download. |
| 8 | `6a6d47b` (pre-install cmdline-tools + symlink) | — (built green!) | First successful APK | After 8 attempts, an APK fell out. 39.1 MB. |
| 9 | `ad755c1` (v0.1.1: file-write crash handler) | green | APK installed, app crashed silently | The Python crash handler wrote to `/sdcard/Download/rondopy-crash.txt`. Android 14 scoped storage blocked the write silently. No file. |
| 10 | `a041bcf` (v0.1.2: on-screen crash UI) | green | App still crashes with no UI at all | The crash is *below* the Python try/except — native crash in Kivy/SDL2 init. Python code never runs. |
| probe | `3c9f3ae` (10-line Kivy Hello World) | pending | TBD | If even this doesn't open, Kivy is incompatible with Android 14 on this device and we'd need a different stack (Chaquopy + Kotlin, BeeWare, or a Termux:GUI port). |

## The actual lessons

### CI debugging is iterative and slow on a phone

Every cycle was: push → 10–55 min build → download zip → extract →
uninstall old → install new → open → screenshot → repeat. On a
phone, that's a 20-minute round-trip per attempt. Ten attempts = a
whole evening burned.

**Lesson:** Build the most diagnostic version first. The log-tail
step we added in build #4 should have been there in build #1.

### Buildozer 1.6 has known issues with modern Android SDK

The deprecated `tools/bin/sdkmanager` path is hard-coded in older
Buildozer paths. The workaround (pre-install cmdline-tools, symlink
into the old path) is documented across a dozen GitHub issues but
not in the official Buildozer docs. We re-derived it the hard way.

### Android 14 scoped storage breaks "write to /sdcard"

`WRITE_EXTERNAL_STORAGE` in the manifest is a no-op on Android 14.
Apps cannot write to public folders (`/sdcard/`, `/Download/`,
`/Documents/`) without using the MediaStore API.

**Lesson:** App-private external storage
(`/storage/emulated/0/Android/data/<pkg>/files/`) is the only path
guaranteed writable from a Kivy app on Android 11+.

### Native crashes are invisible from Python

When Kivy fails to initialize SDL2/OpenGL, the OS kills the process
before Python's `sys.excepthook` runs. No traceback, no file write,
no UI. The diagnostic options are:

1. ADB + `logcat -d AndroidRuntime:E` (requires USB + dev mode)
2. Termux + `pm grant com.termux android.permission.READ_LOGS`
   (still requires ADB once)
3. A probe APK so simple it can't fail for non-trivial reasons — if
   it crashes too, the Kivy stack itself is broken on this device.

We went with the probe (build #11).

### When in doubt, ship the working version

Through this entire trail, `tutor-terminal/tutor.py` worked on the
phone in Termux. Same game, same Claude integration, same XP
system. We should have stayed on that for daily practice and
debugged the APK in parallel commits the learner doesn't have to
test by hand.

**Lesson for future-me:** never block the learner's daily work on
infrastructure that's still being shaken out. Two tracks: one for
practice (must work today), one for shipping (can take weeks).

## What we did right

- **One-commit-per-fix discipline.** Every commit names its
  hypothesis, its fix, and what the next failure mode would tell us.
  The diary above is basically `git log` translated to English.
- **CI artifact upload.** The full build.log uploads on every run,
  so even after a green build we can audit what Buildozer actually
  did.
- **Caches at the right grain.** SDK + NDK survive across commits;
  only changes to `buildozer.spec` bust them. Build #5 took 55
  minutes; builds #7+ took 10–17 minutes.

## What we'd do differently

- **Start with the diagnostic workflow.** `set -ex`, `tee build.log`,
  and "show tail on failure" should have been there in commit #1,
  not commit #4.
- **Probe before iterating.** A 10-line Hello World APK as the first
  build would have told us in 15 minutes whether Kivy works on this
  device. Instead we built the whole real app and tried to debug
  why it didn't open.
- **Don't pile features onto a broken pipeline.** EditorScreen
  (v0.2) landed during the CI fight and didn't help — it just made
  the diff harder to read.
- **Keep the working terminal version in front of the learner.**
  Twenty minutes of phone-based study a day matters more than any
  individual build.

## Open questions (for next session)

1. Does the 10-line probe APK open on the Galaxy A16? (Build is
   queued as of writing.)
2. If not — does Chaquopy (Kotlin + embedded Python) bypass the
   issue? It's a different toolchain entirely.
3. Should we standardise on `p4a.branch = develop` instead of
   `master`? p4a's master has lagged the Android API churn.
4. Once an APK *does* open, what's the smallest screen reproduction
   that crashes? That's the v1 launch checklist.

---

*Written 2026-05-13 after a long evening of build cycles. Filed
under "the story" — Rondo's lived experience teaching himself this
material from inside, on a phone, with intermittent connectivity,
is itself part of the record.*
