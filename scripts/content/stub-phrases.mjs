/**
 * stub-phrases.mjs - banned placeholder phrases for promptandgo.ai content.
 *
 * Adapted from the same list used across the ai-factory estate
 * (~/ai-factory/packages/dev-gates/stub-phrases.mjs), which exists because a
 * per-site copy of a phrase list reproduces drift by construction: some sites
 * had the list, some didn't, and the phrases that caused an actual incident
 * weren't on it. One list, reused, is the fix.
 *
 * HARD_PHRASES fail on sight, anywhere in headline, dek, or body.
 * SOFT_PHRASES are ambiguous in isolation (see ai-factory's version for the
 * "in the meantime" / "work in progress" false-positive history) so they are
 * flagged as warnings, not hard failures, until this site accumulates its own
 * exception list.
 */

export const HARD_PHRASES = [
  // building / expanding
  "we are building", "we're building", "we have been building", "building out",
  "expanding our", "we're expanding", "we are expanding",
  "under construction", "under development", "still growing", "growing this",
  // waiting
  "coming soon", "check back soon", "check back later", "check back in",
  "stay tuned", "watch this space",
  // apology / absence
  "sorry, there's nothing here yet", "nothing to see here yet",
  "nothing here yet", "not yet available", "not available yet",
  "we don't yet have", "we do not yet have", "we haven't yet",
  "we're working on", "we are working on",
  // meta-directory
  "our directory is", "the directory is being", "as we grow",
  "more listings soon", "more to come", "more articles soon", "more tips soon",
  // AI-writing tells that read as filler, not stubs, but ship as thin as one
  "in today's fast-paced world", "in today's digital age", "in the ever-evolving landscape",
  "unlock the power of", "unleash the power of", "in the world of ai",
  // classic placeholder tells
  "lorem ipsum", "fixme",
];

export const SOFT_PHRASES = [
  "in the meantime", "work in progress",
  "in development", "for now", "for the moment", "for the time being",
  "we don't have", "we do not have", "placeholder", "tbd", "todo", "tk",
];

export const ALL_PHRASES = [...HARD_PHRASES, ...SOFT_PHRASES];

/**
 * Compile a phrase to a regex tolerant of the variance real prose and
 * rendered HTML produce: straight vs curly apostrophes and their entities,
 * and any run of whitespace wherever the phrase has a space.
 */
export function compilePhrase(phrase) {
  const body = phrase
    .split(/\s+/)
    .map((word) =>
      word
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        .replace(/'/g, "(?:['‘’]|&apos;|&#0?39;|&rsquo;)"),
    )
    .join('\\s+');
  return new RegExp(`(?<![a-z0-9])${body}(?![a-z0-9])`, 'i');
}
