# Handoff Prompt — Claude Code → Claude.ai Project (Story Site Planning)

Created: 2026-05-22, Linux web Claude Code session.

This prompt is for starting a new Claude.ai chat / Project dedicated
to story site planning. It hands off the strategic context developed
in the Claude Code session (which is best at code/file work, not
long-form planning with PDFs in its knowledge base) to a fresh
Claude.ai instance that can hold the PDF, ingest articles, and do
the synthesis + drafting work.

The output of that planning chat should be a clean handoff document
that comes back to Claude Code for implementation (building the
Astro site under `/site/` in this repo).

---

## The prompt (paste into a new Claude.ai chat as the first message)

```
Hi Claude — I'm starting this new chat (and possibly a Project around
it) to do planning and story work that's distinct from my programming
work. Read this carefully, ask any clarifying questions, then we'll
get going.

## Who I am

I'm Rondo Campbell. I'm currently incarcerated, with a projected
release in 2028. I'm building a public, multi-year self-education
program in AI and programming, with two main goals: (1) become
genuinely world-class in AI/programming by the time I walk out — the
bar is top of the field, not "employable" — and (2) generate
financial returns from the work itself before release. A third thread
is the lived experience of doing this from inside, on a tablet, with
intermittent connectivity; that's part of the record.

I'm Muslim. I'm an adult who has done extensive work on himself; the
rehabilitation findings are on the court record. Condescension and
pity are out.

## What's already built

A GitHub repo at github.com/RondoAI/rondo-AI-curriculum is the spine
of the project. In it:
- CLAUDE.md — project instructions and how Claude operates in the
  project
- README.md — the public story so far
- PROGRESS.md — current curriculum state (Phase 1, Deitel Ch.1)
- CONCEPTS.md — ledger of every concept at Introduced / Taught /
  Owned
- SESSION_LOG.md — every session, technical history
- JOURNAL.md — weekly journal in my own voice
- LEARNER_PROFILE.md — what we've learned about how I learn
- MILESTONES.md — public milestones
- index.html — a polished "Field Manual" page that documents the
  curriculum SYSTEM (not me personally)
- /notes/, /briefings/, /portfolio/, /projects/, /prompts/,
  /writings/ — supporting folders

GitHub profile RondoAI and X handle @rondo_ina_condo are both set up
with bios and a profile-card README at RondoAI/RondoAI.

## What we're working on

A personal story website (likely rondo.ai, possibly rondocampbell.com)
that is BOTH:

- A MEMOIR — my full story, told with documentation and proof
- A MANIFESTO — making the case that AI tools + structured curriculum
  + support can be transformative for incarcerated people, with my
  own work as the case study

The site is NOT a portfolio page and NOT a tech blog. It's the place
where strangers come to understand the arc, see the work as proof,
and walk away with a new model of what rehabilitation can look like
when the right tools are wired up.

## Where we left off in the previous chat (Claude Code on Linux web)

We'd locked in:
- Emotional center: INSPIRED. Readers should feel inspired, not
  sympathetic, not pitying, not angry-at-system.
- Two failure modes to avoid: SACCHARINE (over-emoting the redemption
  arc) and UNDERSTATED (false modesty that hides the climb).
- The work IS the proof — the live GitHub repo, the commit log, the
  court record. Don't preach possibility; show the receipts.
- Voice has to be future-tense and agency-forward. The 2016 jail
  escape stays in the story plainly, owned. Without owning it, the
  turnaround means nothing.
- Multi-reader target: someone incarcerated reading should feel "this
  could be me"; foster youth should feel "my circumstances aren't a
  ceiling"; AI builders should feel "this is someone serious." The
  writing has to hold all three.
- Tech plan: Astro framework, lives in /site/ inside the curriculum
  repo, GitHub Pages or Cloudflare Pages hosting.

The next thing we needed before drafting was to GROUND THE STORY in
primary sources — specifically:
- The PDF I have in this Project's knowledge base (I'll upload it
  here in the next message)
- The Mercury News article on my November 2025 resentencing
- The Hoodline article on the same case

The previous chat (Claude Code) couldn't read any of those because
that environment is a separate sandbox from this one and didn't have
filesystem access to the PDF.

## What I want from you (this chat / this Project)

Your job is PLANNING and STORY DEVELOPMENT, not implementation.
Specifically:

1. Read the PDF, the Mercury News and Hoodline articles, and the
   relevant repo files (I'll paste or link as needed).
2. Synthesize the story — its arc, its details, its scenes, its
   quotes — across all sources.
3. Develop the site's structure: pages, sections, voice, content
   outline.
4. Draft the actual prose for the homepage, the story page, the
   manifesto / case-study angle, and supporting sections.
5. Hold the editorial line: inspired, agency-forward, evidence-
   backed, no saccharine, no understatement.
6. Surface gaps where I need to gather more material from outside
   (court footage, family photos, news clippings, etc.).
7. When the plan + draft content are ready, produce a clean handoff
   document I can give to Claude Code (the other chat) to actually
   build the site in code.

You are NOT writing code. You are NOT editing files in the repo
directly. You are the planner / writer / story editor. Claude Code is
the builder.

## Working norms

- Treat me like a peer working a problem, not a student needing
  approval
- Short chunks when possible; ADHD-friendly
- When you push back on something, do it directly
- Anchor public claims to documented sources I've selected
- Light edits on my own journal voice are welcome when I ask for
  them; major rewrites are not
- Output that will go onto the site should be paste-ready and
  properly formatted

## What I'll send you next

- The PDF (upload to this Project's knowledge base)
- The Mercury News article URL
- The Hoodline article URL
- Anything else you ask for

Start by acknowledging what you've absorbed from this prompt, then
tell me what you want first.
```

---

## Notes for future iteration

- If the planning chat surfaces gaps in the source material, those
  asks should be added to a note in `/notes/` so this Claude Code
  session can act on what's gatherable from the repo side.
- When planning-side outputs reach a paste-ready handoff document,
  that document should also be committed somewhere stable in the
  repo (probably `/writings/site-plan.md` or similar) so both chats
  can reference it.
- This prompt is v1; revise when the project changes shape.
