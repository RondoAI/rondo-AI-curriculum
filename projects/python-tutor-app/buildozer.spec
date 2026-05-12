[app]

# (str) Title of your application
title = Rondo.py

# (str) Package name
package.name = rondopy

# (str) Package domain (reverse-DNS — change to a domain you own before Play Store upload)
package.domain = ai.rondo

# (str) Source code where the main.py live
source.dir = .

# (list) Source files to include (let empty to include all the files)
source.include_exts = py,png,jpg,kv,atlas,ttf

# (list) List of inclusions using pattern matching
source.include_patterns = assets/*

# (str) Application versioning (method 1)
version = 0.1.0

# (list) Application requirements
# Stdlib-only API calls — no anthropic SDK, no pydantic. Just kivy + certifi.
requirements = python3,kivy,certifi

# (str) Presplash of the application
# presplash.filename = %(source.dir)s/assets/presplash.png

# (str) Icon of the application
# icon.filename = %(source.dir)s/assets/icon.png

# (str) Supported orientation (portrait | landscape | all)
orientation = portrait

# (list) Permissions
android.permissions = INTERNET

# (int) Android API to use
android.api = 34

# (int) Minimum API your APK / AAB will support
android.minapi = 24

# (int) Android SDK version to use
android.ndk_api = 24

# (list) The Android archs to build for (Play Store requires 64-bit)
android.archs = arm64-v8a, armeabi-v7a

# (bool) enables Android auto backup feature (Android API >=23)
android.allow_backup = True

# (str) Format used to package the app for release mode (aab or apk).
# Play Store now requires .aab for new uploads.
android.release_artifact = aab
android.debug_artifact = apk

# (bool) Indicate if the screen should stay on
android.wakelock = False

# (str) Bootstrap to use for android builds
p4a.bootstrap = sdl2

# (str) python-for-android branch to use
p4a.branch = master


[buildozer]

# (int) Log level (0 = error only, 1 = info, 2 = debug (with command output))
log_level = 2

# (int) Display warning if buildozer is run as root (0 = False, 1 = True)
warn_on_root = 1
