# Content plan: tips and glossary

Written 7 Sept 2026, after the pipeline built 27 Aug sat uncommitted for
eleven days with no one able to see it. This is the document that should
have existed before any of that code was written. It's short on purpose.

## What publishes

**Tips** (`/tips/`), one narrow, actionable idea per piece: how to do one
thing with a prompt, not an exhaustive reference. "Best in class guides"
are a separate, longer content type on this site and are out of scope
here.

**Glossary** (`/glossary/`), plain-language, sourced definitions of
prompting terms. Reference content: it doesn't need a publishing cadence
the way tips do, just occasional additions as new terms become worth
covering.

## How often

**One new tip a week.** Not the 2-3/week originally scoped on 27 Aug:
Adrian has said the site isn't active, but that content still needs to
update regularly, and a verified cost audit on 2 Sept showed content
generation itself is cheap (about $1.33 of $164.83 spent across a whole
week on the wider estate; the real cost driver elsewhere is agent-tier
misuse, not article count). One a week is enough to keep the site visibly
maintained without manufacturing volume nobody reads. This number is a
starting judgement call, not a locked constraint: raise or lower it in
`docs/CONTENT_PIPELINE.md`'s scheduled task and this doc together if it
turns out wrong.

**Glossary**: ad hoc, not scheduled. Add a term when a tip or a real
gap in coverage calls for one.

## How topics are chosen

`content/tips/CALENDAR.md` holds a backlog of briefs, each checked
against every slug already live (listed at the bottom of that file) so
nothing gets duplicated. The scheduled generation task (see
`docs/CONTENT_PIPELINE.md`, "Automated generation") takes the next
undrafted entry each run. When the backlog runs low, extending it is a
five-minute manual pass: read what's live and what's queued, propose a
handful of new single-idea angles that aren't already covered, and append
them in the same table format.

## What the gates check

Nothing is written to a migration, let alone applied, without passing
`gateTip()` (tips) or `gateGlossaryTerm()` (glossary) in
`scripts/content/content-quality-gate.mjs`:

- **Tips**: 1,000+ words, 3+ external links inside the body, 5+ concrete
  data points, 3+ headings, a `sources` array with a real absolute URL
  for every citation, no banned stub/filler phrases, no em or en dashes,
  no emoji.
- **Glossary**: at least one real sourced citation, a self-contained
  definition, same house-style checks.

The gate runs at generation time, before anything is written, not at
publish time after the fact. See the file's own header comment for why
that distinction matters: a publish-time check that flags bad content
after it's live treats the defect as housekeeping; a gate that blocks the
draft treats it as what it is, a defect in the generator.

Every number, statistic, or specific claim in a tip must trace to a
source that was actually fetched and checked, not assumed or guessed. On
7 Sept, independent re-verification (not just trusting the drafting
agent's own report) caught one real error this way: a benchmark figure in
the "few-shot examples" tip was off by half a point from the actual
paper. That kind of check should keep happening on new drafts, not just
the two that already exist.

## What happens when something fails a gate

The gate does not get weakened to pass more content. If a draft fails:

1. Fix the specific thing that failed (add a citation, cut a restated
   passage, add a heading, replace a dash) and re-run the gate.
2. If a figure can't be verified, look for it from another source before
   dropping it. If it genuinely can't be sourced anywhere, drop the
   figure and keep the rest of the article rather than dropping the
   whole piece over one unverifiable number.
3. If a draft still can't pass after one repair attempt, the scheduled
   task stops and reports the failure (see `docs/CONTENT_PIPELINE.md`)
   rather than looping, retrying indefinitely, or shipping something
   thin.

## Publishing stays a separate, deliberate step

Generation writes a migration file and opens a small, reviewable pull
request. It does not apply the migration to the live database and does
not merge its own PR. That split is deliberate: this is a paid product
with real users, and auto-publishing AI-drafted content straight to
production without a human ever looking at it is a bigger decision than
this document is set up to make on Adrian's behalf. If that should
change, it's a one-line change to the scheduled task, not a redesign.
