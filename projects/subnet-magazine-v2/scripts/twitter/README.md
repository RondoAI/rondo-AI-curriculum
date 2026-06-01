# Twitter draft → post queue for @subnetmagazine

A two-file scaffold that lets Claude draft tweets during a Claude Code
session, commit them to the repo, and have a GitHub Action post them on
schedule. **No Claude API calls happen at post time — your Max plan
covers the drafting, and the Action just shells out to the Twitter API.**

## How it works

```
┌─ Claude Code session ──────────────────────────────────────┐
│  You ask Claude to draft tweets. Claude writes files into  │
│  drafts/twitter/ready/ with ISO-timestamped filenames.     │
│  You review, commit, push.                                  │
└────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─ GitHub Action (every 15 min) ─────────────────────────────┐
│  run_queue.py finds files in ready/ whose timestamp <= now,│
│  POSTs each to Twitter, moves to drafts/twitter/posted/    │
│  with the tweet id appended. Commits the moves.            │
└────────────────────────────────────────────────────────────┘
```

## One-time setup

### 1. Twitter Developer Account (free)

1. Go to https://developer.x.com, sign in with the @subnetmagazine
   account (not your personal one).
2. Create a new App. Name it something like "subnetmagazine-poster".
3. **Permissions → set to "Read and Write"** (the default is Read-only;
   you must change this BEFORE generating tokens).
4. Generate four keys:
   - Consumer Keys: API Key + API Key Secret
   - Authentication Tokens: Access Token + Access Token Secret

Free tier limits as of 2026: 1,500 posts/month, 17 posts/24h. Plenty
for an editorial cadence. If you outgrow it, Basic is $200/mo.

### 2. Local config

```bash
cd projects/subnet-magazine-v2/scripts/twitter
pip install -r requirements.txt
cp .env.example .env   # then fill in the four keys
```

Add this to your repo `.gitignore` if not already:
```
projects/subnet-magazine-v2/scripts/twitter/.env
```

### 3. Move the workflow into place

The workflow file is currently a TEMPLATE at
`twitter-post.workflow.yml`. GitHub Actions only reads from
`.github/workflows/` at repo root, so:

```bash
mkdir -p .github/workflows
cp projects/subnet-magazine-v2/scripts/twitter/twitter-post.workflow.yml \
   .github/workflows/twitter-post.yml
```

Then in the repo's web UI: Settings → Secrets and variables → Actions
→ add the four `TWITTER_*` secrets.

## Drafting tweets

Drafts live in `drafts/twitter/ready/`. Filename format (UTC):

```
YYYY-MM-DD_HHMMZ--<slug>.md
```

Example: `2026-05-29_1430Z--affine-7pct-1y.md`

Body is plain text. Whatever's in the file gets posted verbatim
(stripped). Twitter doesn't render markdown so keep it plain.

A Claude Code session can produce these directly — just ask:

> Draft three tweets for tomorrow about the cockpit launch. Schedule
> them at 09:00 UTC, 13:30 UTC, and 18:00 UTC. Save them in
> projects/subnet-magazine-v2/drafts/twitter/ready/.

Claude writes the files. You review the diff, commit, push. The next
time the cron runs (every 15 min), the Action posts whichever ones
are past their timestamp and moves them to `posted/`.

## Manual posting

To post one tweet right now without going through the queue:

```bash
cd projects/subnet-magazine-v2/scripts/twitter
python3 post.py "Today on @subnetmagazine: ..."
```

To dry-run the queue (see what WOULD post, without actually posting):

```bash
python3 run_queue.py --dry-run
```

Or in the GitHub UI: Actions tab → Twitter post-queue → Run workflow
→ check "Dry-run only" → Run.

## Safety patterns

- **Drafts live in PRs.** If you don't trust Claude to write tweets
  unsupervised, set up a `drafts-staging/` folder Claude writes to,
  and a manual `mv` to `drafts/twitter/ready/` is the human approval
  step.
- **Separate test account.** For first-time setup, point the API keys
  at a test account like `@subnetmag_test` until you're confident
  drafts post correctly.
- **Free-tier rate limits.** 17 posts/24h. The Action's concurrency
  group prevents stampedes, but if you queue 20 tweets at the same
  timestamp the 18th+ will fail. Stagger timestamps in drafts.
- **Auditability.** Every posted tweet has a file in
  `drafts/twitter/posted/` with the tweet URL — full git history of
  what was posted when and to which tweet id.

## Files in this scaffold

| File | Purpose |
|------|---------|
| `post.py` | CLI helper: post ONE tweet from arg or stdin. |
| `run_queue.py` | The queue drainer. Reads `ready/`, posts, moves to `posted/`. |
| `requirements.txt` | `tweepy` + `python-dotenv`. |
| `twitter-post.workflow.yml` | GitHub Actions template. Copy to `.github/workflows/twitter-post.yml`. |
| `README.md` | This file. |
| `../../drafts/twitter/ready/` | Where pending drafts live. |
| `../../drafts/twitter/posted/` | Where successfully-posted drafts move to. |
