# Content pipeline: tips and glossary

Set up 2026-08-27. Covers how new `/tips/` articles and `/glossary/` entries
get written, gated, and published on promptandgo.ai.

## Why this exists

Audited on 2026-08-27: the articles already live at `/tips/` run 34 to 673
words (the site's own quality bar asks for 1,000+), ship no external
citations as inline links, and carry zero structured data. The seed
migration that created most of them held under 1,000 words total across six
full articles. Nothing checked a draft before it became a published row.

The gate in `scripts/content/content-quality-gate.mjs` is adapted from the
proven one at `~/ai-factory/packages/dev-gates/content-quality-gate.mjs`,
built from real incidents across UDO/UCO/AIIN (unworked backlog rows, wrong
content shipped to a sibling site, missing stub-phrase coverage). The
principle carries over unchanged: **a publish-time check that flags bad
content after it's live treats the defect as housekeeping. A gate that
blocks the draft before it becomes a row treats it as what it is: a defect
in the generator.**

## The two content types

### Tips (`/tips/`), database-backed

Tips are rows in the Supabase `public.articles` table, fetched at Astro
build time by `astro/src/pages/tips.astro` and
`astro/src/pages/tips/[slug].astro` (`output: 'static'`, so this only runs
at build, not per-request). This was already the architecture; the pipeline
here writes into it, it doesn't replace it.

**Quality bar** (`TIP_PROFILE` in the gate): 1,000+ words, 3+ external
links inside the body, 5+ concrete data points, 3+ headings, no stub
phrases, no em/en dashes or emoji (house style, per `/Users/adrian/CLAUDE.md`),
a `sources` array with a real absolute URL for every citation. "Best in
class guides" are a separate, longer content type on this site; tips stay
narrow: one actionable idea per piece, not an exhaustive reference.

### Glossary (`/glossary/`), file-based

Terms live as TypeScript literals in `astro/src/lib/glossary/terms/*.ts`,
aggregated by `astro/src/lib/glossary/index.ts`, and rendered by
`astro/src/pages/glossary/index.astro` and `[slug].astro`. This mirrors the
pattern used for UDO's and AIIN's glossaries in the wider ai-factory estate
(file-based term arrays, not a CMS table), adapted here because
promptandgo is a standalone repo outside that monorepo. File-based means
every entry's sources are diffable in a PR and there's no DB round trip for
content that rarely changes.

**Quality bar** (`GLOSSARY_PROFILE` in the gate): at least one real,
absolute-URL source per term, a self-contained one-to-two-sentence
definition (used as the meta description and schema.org description), no
stub phrases, no dashes/emoji. No word-count floor to speak of (80 words):
glossary entries are definitions, not articles.

## The pipeline, step by step

### 1. Draft

There is no API call in this repo that generates a draft; drafting is done
by an LLM (a Claude Code session or an `Agent` subagent) given a brief that
specifies the topic, the hard requirements from the gate, and an instruction
to use WebSearch/WebFetch to find and confirm real sources rather than
inventing figures. See `content/tips/CALENDAR.md` for the brief format and
the current backlog. A tip draft is saved as JSON to
`content/tips/drafts/<slug>.json` matching this shape:

```json
{
  "slug": "kebab-case-slug",
  "title": "...", "meta_title": "...", "meta_description": "...",
  "synopsis": "...", "focus_keyword": "...", "keyphrases": ["...", "..."],
  "body_html": "<p>...</p><h2>...</h2>...",
  "sources": [{"label": "...", "url": "https://...", "accessed": "YYYY-MM-DD"}],
  "published_date": "YYYY-MM-DDT09:00:00Z",
  "thumbnail_url": null
}
```

A glossary draft matches the `GlossaryTerm` interface in
`astro/src/lib/glossary/types.ts`.

### 2. Gate

```
node scripts/content/build-tip-migration.mjs content/tips/drafts/<slug>.json
```

Runs `gateTip()`. On failure it prints every failing check's code and
detail and writes nothing. Fix the draft (add citations, cut restatement,
add a heading, replace a dash) and re-run. It never lowers the bar to let a
draft through; there is no override flag.

Glossary terms are gated the same way with `gateGlossaryTerm()`, currently
called ad hoc (see `scripts/content/content-quality-gate.selftest.mjs` for
usage examples) since new entries are added far less often than tips.

### 3. Migration (tips only)

On a pass, `build-tip-migration.mjs` writes a timestamped file to
`supabase/migrations/`, e.g.
`20260831090000_tip_how-to-use-system-prompts-for-consistent-ai-output.sql`,
containing a single `INSERT INTO public.articles (...) ... ON CONFLICT
(slug) DO NOTHING` plus a comment block listing every cited source and its
access date, for auditability.

**This machine has no production Supabase service-role key**, and writing
straight to a production database from a generation script is exactly the
kind of hard-to-reverse, shared-system action that should stop for a human
first regardless. So the script never writes to the database: it writes a
normal, diffable, git-reviewable migration file, following the same
convention the original seed content already used
(`supabase/migrations/20250911082436_..._insert-existing-blog-articles.sql`).
**Nothing goes live until you run `supabase db push` yourself.**

### 4. Staggered publishing

Because the site is `output: 'static'`, a page only reflects the database
as of the last build; there is no per-request freshness. Both
`tips.astro` and `tips/[slug].astro` now filter on
`is_published=eq.true AND published_date<=<build time>`, so a row can be
inserted (migration applied) with `is_published = true` and a
**future** `published_date`, and it simply won't appear until a build runs
on or after that date. That's what "staggered, not all at once" means
mechanically here: apply migrations whenever you like, dates control when
each one actually surfaces.

`.github/workflows/scheduled-rebuild.yml` triggers a rebuild three times a
week (Mon/Wed/Fri) via a Cloudflare Pages deploy hook, so a queued piece
goes live automatically on schedule rather than waiting for the next
unrelated push. **Setup needed, one-time and manual**: add a repository
secret `CLOUDFLARE_DEPLOY_HOOK_URL` (Cloudflare Pages > project > Settings >
Builds & deployments > Deploy hooks). The workflow fails loudly with an
explanatory error if that secret is missing; nothing was set up here that
could touch the live site without that key existing first.

## Automated generation

Added 7 Sept 2026. Until this point every draft in the pipeline had been
produced by hand, one Agent dispatch at a time, in an interactive Claude
Code session. That's the gap the 27 Aug work left open: a working gate and
a working migration builder, but nothing that ran itself.

**Generation must never call the metered Anthropic API directly.** That
key is dead by design on this machine; anything that calls it fails
silently rather than billing per token. All drafting happens through the
subscription OAuth route instead, which in practice means: a scheduled
Claude Code task dispatches an `Agent` (model `claude-sonnet-5`, the
default tier per the estate's model-choice policy; content generation is
ordinary multi-file feature work, not a case for Opus) to research and
draft, exactly the way the two existing tips were produced on 27 Aug.

A scheduled task named `promptandgo-weekly-tip` runs this every week (see
`docs/CONTENT_PLAN.md` for the cadence reasoning). Each run:

1. Fetches `origin/astro` fresh (the task has no memory of prior runs).
2. Reads `content/tips/CALENDAR.md`, takes the next undrafted backlog
   entry, and checks it against every already-published slug listed at
   the bottom of that file.
3. Dispatches one `Agent` (model `claude-sonnet-5`) with a brief matching
   the shape used for the first two tips: the topic, the hard gate
   requirements verbatim, and an explicit instruction to use
   WebSearch/WebFetch for real citations rather than inventing figures.
4. Saves the result to `content/tips/drafts/<slug>.json`, runs
   `node scripts/content/build-tip-migration.mjs` against it.
5. On a gate failure, attempts exactly one repair pass addressing the
   specific failing checks, then re-gates. A second failure stops the
   run; it does not retry indefinitely or loosen anything.
6. On success: creates a branch off the freshly-fetched `astro`
   (`content/tip-<date>`), commits the draft, the migration, and the
   updated `CALENDAR.md` (entry moved from backlog to queued), pushes it,
   and opens a pull request against `astro`. It does not merge its own
   PR and does not run `supabase db push` — see "Publishing stays a
   separate, deliberate step" in `docs/CONTENT_PLAN.md`.
7. Writes a one-line result (pass and PR link, or the specific failure)
   to `content/tips/generation-log.md` in the same commit, so the outcome
   is visible in the repo rather than only in a chat transcript that may
   not survive a crashed session.

To change the cadence, edit the scheduled task directly (list it with
`mcp__scheduled-tasks__list_scheduled_tasks`, or from a fresh Claude Code
session ask to see/update the `promptandgo-weekly-tip` task) and update
the reasoning in `docs/CONTENT_PLAN.md` to match.

## Files

```
scripts/content/
  stub-phrases.mjs                   banned placeholder phrases, shared list
  content-quality-gate.mjs           gateTip(), gateGlossaryTerm(), profiles
  content-quality-gate.selftest.mjs  run with: node scripts/content/content-quality-gate.selftest.mjs
  build-tip-migration.mjs            draft JSON -> gated -> migration SQL

content/tips/
  CALENDAR.md                        staggered schedule: queued + backlog briefs
  drafts/*.json                      gated drafts, one per tip

astro/src/lib/glossary/
  types.ts                           GlossaryTerm, GlossarySource, etc.
  terms/*.ts                         term data, grouped by category
  index.ts                           ALL_TERMS, TERMS_BY_SLUG, termsByCategory()

astro/src/pages/glossary/
  index.astro                        term index, grouped by category, DefinedTermSet JSON-LD
  [slug].astro                       one term, DefinedTerm JSON-LD

supabase/migrations/*_tip_*.sql      generated, reviewable, not yet applied
.github/workflows/scheduled-rebuild.yml
```

## Running it yourself

```
# gate + self-test
node scripts/content/content-quality-gate.selftest.mjs

# turn a gated draft into a migration
node scripts/content/build-tip-migration.mjs content/tips/drafts/some-slug.json

# review, then apply for real (this touches production)
supabase db push
```
