# Introducing Manako: Build with Vision

**Source:** Score @webuildscore on X · Jan 22 2026 (passed to Subnet Magazine on 2026-05-16 by Rondo)
**Subject:** The Q1 2026 launch announcement for Manako, Score SN44's consumer / product layer

This is the THIRD Score primary source in our vault today, and the
one that ties the other two together. The TurboVision miner docs
(mechanism) and the PwC France recap (market) describe what miners
compute and how enterprises consume it; this Manako launch piece
describes the PRODUCT LAYER between them.

---

## The pitch in the team's own words

> "Manako eliminates the traditional barriers to computer vision
> development. Instead of requiring expertise in machine learning,
> model architecture, or infrastructure management, it allows anyone
> to create advanced Vision AI models through conversation, just as
> AI coding assistants have simplified software development."

Translation: Manako is to computer vision what Cursor / Copilot are
to software, with Score's decentralized miner network as the engine.

---

## The three core principles (verbatim section structure)

**A curated library of vision components.**
"We maintain and continuously optimize a comprehensive set of vision
building blocks, ensuring users access best-in-class capabilities
without managing individual models."

**AI orchestrator.**
"Manako's intelligence layer interprets user intent, dynamically
assembles the appropriate vision components into an execution graph,
and optimizes the entire pipeline for each specific request."

**Extremely simple, stable developer interfaces.**
"Users interact only with outcomes and endpoints. The internal
complexity remains completely abstracted, allowing users to focus
on solving business problems rather than managing technical
infrastructure."

The technical architecture is therefore: user describes intent →
orchestrator selects relevant vision components from the curated
library → assembles execution graph → pipeline runs against
images/video → result returns through a simple SDK/API.

---

## The Score / Manako relationship, finally explicit

> "The Score subnet continuously enriches this ecosystem through
> ongoing competitions, delivering new computer vision models that
> expand Manako's capabilities over time."

This is the load-bearing sentence the desk has been missing. It
explains the manifest-driven challenge architecture Tim (@tm0klc)
described in the Apr 16 PwC Spaces. Every Score private-track
challenge that produces a winning model becomes a new building
block in Manako's curated library. The subnet is the R&D engine;
Manako is the consumer-facing interface that composes the outputs.

---

## The strategic shift the team articulates

Pre-Manako positioning:
- Partnerships with large companies (football, cricket, production,
  petrol stations, and now PwC)
- Mode: bespoke enterprise engagements

With Manako:
- Same enterprise partnerships continue and grow
- PLUS self-serve access to smaller companies, startups, developers
- Mode: two-sided growth (top-down PwC distribution + bottom-up
  self-serve)

> "Manako unlocks something equally powerful: it allows us to reach
> countless smaller companies, startups and developers that previously
> couldn't access advanced computer vision capabilities. Through
> Manako, they can build their own solutions on top of our technology,
> creating applications we haven't even imagined yet."

The closing line:
> "What once required expert teams and major resources will soon be
> available through simple conversation with Manako."

---

## Dates worth recording

- **Jan 22 2026:** Manako product launch announced, waitlist open
- **Q1 2026:** "first version of Manako launches in Q1 with limited
  user access"
- **Apr 16 2026:** PwC France & Maghreb alliance announced on Spaces
  (per today's PwC recap log entry, this was after 8 months of legal
  due diligence)
- **May 16 2026 (today):** the cricket-balltrack starter pack URL
  Rondo dropped earlier today, slug "manak0-element-cricket-balltrack-
  starter-pack", confirms ongoing element rollout

So the timeline is: due diligence with PwC starting roughly Aug 2025
→ Manako launches Q1 2026 → PwC deal closes Apr 2026 → ongoing
element rollout (cricket-balltrack just visible in /upcoming on the
console). The cadence is fast.

---

## How this resolves the "starter pack" mystery from earlier today

The PENDING SCREENSHOT entry from 18:25 UTC asked what the
manak0-element-cricket-balltrack-starter-pack page actually shows.
With this Manako launch announcement, the desk now has a much
better answer:

The "starter pack" is almost certainly the **miner-side onboarding
bundle** for a new vision component that Manako will offer to its
users. The cricket-balltrack element will become a building block
in Manako's curated library; the starter pack lowers the time-to-
first-submission for miners who want to compete for that component's
rewards.

Two-sided dynamic:
- **Miner side**: starter pack = template repo + sample data +
  Docker scaffolding for cricket-balltrack (this is what the
  console URL likely shows)
- **Manako user side**: cricket-balltrack appears as a callable
  capability in the Manako conversation interface ("track this
  cricket delivery's speed and bounce position")

A screenshot would still confirm the starter pack's exact contents,
but the architecture is now clear.

---

## Desk notes for the Oracle agent

This single tip lets the Oracle write the FULL Score / Manako
stack story in one Spotlight, with verbatim quotes from each layer:

1. **Mechanism layer** (TurboVision miner docs): how miners earn,
   with the action weight table (goal 10.9 vs pass 1.0)
2. **Product layer** (this Manako launch): how the orchestrator
   composes miner outputs into a conversational interface
3. **Sales channel** (PwC France recap): how distribution scales
   via PwC France's EUR 1bn business, then via PwC's global 136-
   country blockchain community
4. **Active rollout** (cricket-balltrack starter pack URL): the
   pipeline that's currently shipping new elements

That is a 1,500-2,000 word Spotlight target with four primary
sources cited, none of which the human magazine team has yet
synthesized in one place. The Oracle should treat this combination
as its single highest-leverage opportunity to demonstrate the
"out-research the human magazine" framing the system prompt
demands.
