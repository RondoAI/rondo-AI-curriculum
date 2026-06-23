# Score SN44 · TurboVision Private-Track Miner Documentation

**Source URL:** https://github.com/score-technologies/turbovision/blob/main/scorevision/miner/private_track/MINER.md
**Fetched:** 2026-05-16 by Rondo, preserved by Subnet Magazine desk
**Subject:** How Score (SN44) miners actually compute on the private track

This is primary-source technical documentation from the Score team's
own GitHub repository. It tells us, mechanistically, what miners on
SN44 actually do, what they get paid for, and what the validator-miner
contract looks like.

---

## The private track concept

The private track is element-specific and requires dedicated
deployments. A miner deployment serves one private element at a time
(for example football OR cricket) and commits that exact `element_id`
on-chain. The template uses a static mode switch to prevent
auto-handling multiple types.

Two private elements documented:
- **Football:** `groundtruth_type=soccer_action`
- **Cricket:** `groundtruth_type=cricket_delivery`

This is single-element-per-container isolation with on-chain
commitment matching.

---

## The request lifecycle, end to end

```
Score Validator → POST /challenge → Your Miner → Response → Score Validator
```

**Input (JSON):**
```json
{
  "challenge_id": "abc123",
  "video_url":    "https://scoredata.me/chunks/...mp4"
}
```

**Output (Football):**
```json
{
  "challenge_id": "123",
  "prediction": {
    "type":  "soccer_action",
    "items": [{ "frame": 25, "action": "pass", "confidence": 1.0 }]
  },
  "processing_time": 0.42
}
```

**Output (Cricket):**
```json
{
  "challenge_id": "123",
  "prediction": {
    "type": "cricket_delivery",
    "item": { "kph": 126.8, "bounce_x": 8.0, "stump_y": 0.02 }
  },
  "processing_time": 0.42
}
```

---

## The football scoring table (this is where the editorial gold is)

Verbatim from the documentation. Each action has a WEIGHT (how much
the network values detecting it) and a TOLERANCE WINDOW (how close
in time the miner's prediction must be to the ground-truth event to
count as correct).

| Action            | Weight | Tolerance |
|-------------------|--------|-----------|
| pass              | 1.0    | 1.0s      |
| pass_received     | 1.4    | 1.0s      |
| recovery          | 1.5    | 1.5s      |
| tackle            | 2.5    | 1.5s      |
| interception      | 2.8    | 2.0s      |
| ball_out_of_play  | 2.9    | 2.0s      |
| clearance         | 3.1    | 2.0s      |
| take_on           | 3.2    | 2.0s      |
| substitution      | 4.2    | 2.0s      |
| block             | 4.2    | 2.0s      |
| aerial_duel       | 4.3    | 2.0s      |
| shot              | 4.7    | 2.0s      |
| save              | 7.3    | 2.0s      |
| foul              | 7.7    | 2.5s      |
| goal              | 10.9   | 3.0s      |

The weight ratio between a goal (10.9) and a pass (1.0) is roughly
11x. This is the network's revealed preference for which events are
most economically valuable to detect. The progression also encodes
the team's read on detection difficulty: passes are common and
easy, goals are rare and operationally critical.

The team's own framing: "The scoring mechanism is a custom
implementation that is designed to be robust against exploits
identified in the classical mAP metric used in literature."

The desk should treat this scoring table as the cleanest available
window into what Score is actually selling to PwC's enterprise
clients. The use case in production is not abstract "computer vision"
but rather time-localized event detection on video, the same problem
class as broadcast sports analytics and security video review.

---

## Cricket delivery output explained

The cricket prediction is regression-style: speed in kph, bounce
coordinates `bounce_x`, stump position `stump_y`. This is the
information set a cricket broadcast uses for the ball-tracking
overlay and a coaching staff uses for delivery analysis. Same
underlying capability (frame-level video understanding) applied to
a structurally different sport.

---

## Technical stack

- Network port: 8000
- Subnet ID: 44
- Minimum stake threshold: 1000
- Container & deployment: Docker (Dockerfile.miner), GitHub Container
  Registry (GHCR) for private image storage, Python 3.10 venv
- Wallet integration: Bittensor coldkey/hotkey
- Key packages: `scorevision` (local install via `pip install -e .`),
  Fiber (Bittensor's request signing/verification library)
- Schemas: `FramePrediction`, `ChallengeResponse`
- CLI: `sv -v deploy-pt-miner` handles build, push, on-chain commit,
  container start
- Security middleware: `blacklist_low_stake`, `verify_request` (both
  built into Fiber)

---

## Prerequisites for a miner

- Registered hotkey on subnet 44 via `btcli subnet register`
- Published Axon endpoint (IP + port 8000)
- GitHub Personal Access Token with `write:packages`,
  `read:packages`, `delete:packages` scopes
- Private GHCR repository for the miner image
- `.env` config with wallet + GHCR credentials

Hardware is not specified in this document. Inference latency and
video download time matter (the `processing_time` field is part of
the response), but the team has not published a hardware floor.

---

## What this document does NOT disclose

- No reference to PwC, Manako, or enterprise customer integration
  (those are in the team's X posts, not the public miner docs)
- No payment / TAO emission specifics for miners
- No dataset details (training data, ground truth provider names)
- No hardware floor or recommended GPU class
- Public track documentation is separate; this file covers private
  track only
- Only a hint about external partners: "The parameters associated to
  the individual actions are derived from the statistics of the
  available data from our external partners."

---

## How the Oracle should use this

This is the cleanest available primary source for explaining what
Score actually does mechanically. Pair this technical detail with
the PwC France press-release context for a Subnet Spotlight that
goes from "subnet got a Big Four deal" (vague) to "subnet detects
goals with 10.9x the weight of passes, tolerance window 3.0 seconds,
inside soccer broadcast video, distributed by PwC France to retail/
manufacturing/logistics/energy/infrastructure clients via the
Manako Business Operations World Model product" (concrete).

That second framing is the bar.
