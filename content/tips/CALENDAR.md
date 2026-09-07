# Tips content calendar

Staggered at 2-3 pieces/week. Nothing here goes live until its migration is
applied with `supabase db push` (see `docs/CONTENT_PIPELINE.md`), and even
once applied, a piece stays hidden until a build runs on or after its
`published_date` (see the scheduling note in that doc).

## Queued (drafted, gated, migration generated)

| Date | Slug | Migration |
|---|---|---|
| 2026-08-31 | `how-to-use-system-prompts-for-consistent-ai-output` | `supabase/migrations/20260831090000_tip_how-to-use-system-prompts-for-consistent-ai-output.sql` |
| 2026-09-02 | `how-to-use-few-shot-examples-in-ai-prompts` | `supabase/migrations/20260902090000_tip_how-to-use-few-shot-examples-in-ai-prompts.sql` |

Both passed `gateTip()` against the `TIP_PROFILE` (1,000+ words, 3+ external
links, 5+ data points, 3+ headings, no stub phrases, no dashes/emoji). Every
external claim in the body is cited inline; the source list is also in the
migration file's header comment.

## Backlog (topic briefs only, not yet drafted)

Titles here are intentionally practical, single-idea "tips," not the
site's separate best-in-class guides. Draft each one the same way the two
above were built: hand a brief matching this shape to a research agent
(WebSearch/WebFetch for real citations, no invented figures), save the
result to `content/tips/drafts/<slug>.json`, run it through
`node scripts/content/build-tip-migration.mjs content/tips/drafts/<slug>.json`,
and only add a migration once it prints `PASS`. Existing published slugs are
listed at the bottom so a new topic doesn't duplicate one.

| Target week | Working title | Angle |
|---|---|---|
| 2026-09-07 | How to stop an AI model from making facts up in its answer | Practical hallucination-reduction techniques: grounding instructions, asking for citations, "say you don't know" framing |
| 2026-09-09 | Prompt chaining: breaking a big task into steps AI actually gets right | When one long prompt fails and a short sequence of smaller prompts succeeds, with a worked multi-step example |
| 2026-09-11 | Negative constraints: telling an AI model what not to do | Why "don't do X" often works better placed as a constraint than folded into positive instructions, with examples |
| 2026-09-14 | How temperature and top-p actually change your AI output | Plain-language explanation of the two settings most people never touch, with before/after examples |
| 2026-09-16 | How to debug a prompt that isn't working | A troubleshooting checklist: ambiguous instructions, missing context, conflicting constraints, no examples |
| 2026-09-18 | Prompting AI coding assistants without getting garbage code | Practical framing for non-developers using AI to write small scripts: scope, constraints, asking for tests |
| 2026-09-21 | Writing AI prompts for a team so everyone gets the same tone | Shared prompt templates and system prompts as a team consistency tool, not just a personal one |
| 2026-09-23 | How to prompt AI for spreadsheet and data cleanup work | Getting consistent, correctly-formatted output from AI on tabular data tasks |

## Already published (do not duplicate these topics)

`ai-prompts-for-business-strategy`, `ai-prompts-for-content-writers`,
`ai-prompts-for-customer-support`, `ai-prompts-for-marketing-campaigns`,
`ai-prompts-for-social-media-content`, `ai-prompts-in-asian-languages`,
`ai-prompts-that-save-you-hours`,
`asking-ai-better-questions-is-a-skill-heres-how-to-build-it`,
`beginner-vs-advanced-prompts-what-actually-changes`,
`beginners-guide-midjourney-prompts`,
`best-ai-prompts-for-small-business-2025`,
`how-to-turn-one-good-prompt-into-10-high-performing-variations`,
`how-to-write-ai-prompts`, `multi-platform-prompting-guide`,
`the-most-common-prompting-mistakes-and-how-to-fix-them-fast`,
`welcome-to-promptandgo-ai`, `why-most-ai-outputs-feel-fine-and-how-to-push-past-that`,
`why-most-prompts-fail-before-you-even-press-enter`.

(Confirmed live at promptandgo.ai/tips on 2026-08-27; several of these are
themselves thin by the new bar and are candidates for a rewrite pass later,
not duplication.)
