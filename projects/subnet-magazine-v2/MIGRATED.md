# Subneτ Magazine has moved

**As of 2026-05-22**, the Subneτ Magazine project lives in its own dedicated repo:

  https://github.com/RondoAI/subnet-magazine

Per Rondo's instruction (2026-05-22): the Subneτ Magazine product and the
Python self-education curriculum are two different things with different
release cadences, audiences, and editorial rules. They should never have
been merged into one repo.

## What changed

- All 594 magazine-touching commits were extracted via `git subtree split`
  with full history preserved
- The dedicated repo's `main` branch is the magazine's new home
- This `projects/subnet-magazine-v2/` directory in `rondo-AI-curriculum`
  remains as a frozen snapshot at the state of commit `95b6d93`
- **Existing `raw.githack.com/RondoAI/rondo-AI-curriculum/<sha>/projects/subnet-magazine-v2/...`
  URLs continue to work** because every past commit still contains the
  magazine files — they were not deleted, just deprecated for future
  development

## Where to go now

| Goal | URL |
|---|---|
| Live cockpit (latest) | https://raw.githack.com/RondoAI/subnet-magazine/main/cockpit.html |
| GitHub repo | https://github.com/RondoAI/subnet-magazine |
| Commit-pinned cockpit | https://raw.githack.com/RondoAI/subnet-magazine/`<sha>`/cockpit.html |

## For Claude sessions / collaborators

- `subnet-mag-v2-upgrades` and `subnet-mag-v2` branches on
  `rondo-AI-curriculum` are frozen for new work as of 2026-05-22.
  All new magazine commits go to `RondoAI/subnet-magazine` `main`.
- The `scripts/build_subnets.py` regenerator + the
  `src/data/subnets-live-2026-05-22.json` snapshot moved with the
  magazine.
- The bound rules from CLAUDE.md (NodeSphere E8 lock, "don't mess
  up anything" pre-flight, const founder feedback, etc.) move with
  the magazine and now live in the new repo's CLAUDE.md.

## What stayed in rondo-AI-curriculum

- All Python study work (`/curriculum/`)
- Daily briefings (`/briefings/`)
- Learner notes (`/notes/`)
- Paper portfolio (`/portfolio/`)
- Saved prompts (`/prompts/`)
- Other writings (`/writings/`)
- Root-level files (`CLAUDE.md`, `JOURNAL.md`, `PROGRESS.md`,
  `LEARNER_PROFILE.md`, `SESSION_LOG.md`, `MILESTONES.md`,
  `CHRONICLE.md`, `CONCEPTS.md`, `README.md`)

That's the right split: this repo is now what its name says — the
curriculum / learning record. The magazine has its own house.
