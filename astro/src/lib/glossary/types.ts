/**
 * Shared glossary types for the prompting glossary at /glossary.
 *
 * File-based by design, not a Supabase table: term definitions are stable
 * reference content, not a CMS workflow, and keeping them as git-reviewed
 * TypeScript files means every entry's sources are diffable and every claim
 * traces to a citation checked in alongside the code. This mirrors the
 * pattern used for UDO's and AIIN's glossaries in the wider ai-factory
 * estate (~/ai-factory/packages/site-ui/src/glossary/types.ts), adapted here
 * since promptandgo is a standalone repo outside that monorepo.
 */

export interface GlossarySource {
  /** Human-readable label, for example "Anthropic: Prompt engineering overview". */
  label: string;
  /** Absolute URL. Rendered with target="_blank" rel="noopener noreferrer". */
  url: string;
}

export interface GlossaryCrossLink {
  label: string;
  /** Site-relative path, for example "/tips/how-to-write-ai-prompts". */
  href: string;
}

export type GlossaryCategory =
  | "Fundamentals"
  | "Core Techniques"
  | "Parameters & Mechanics"
  | "Advanced & Current";

export interface GlossaryTerm {
  /** URL segment. Must be unique and stable; it is the permalink. */
  slug: string;
  /** Display name. */
  term: string;
  /** Alternate names and acronyms. Feeds schema.org alternateName and on-page search. */
  aliases?: string[];
  category: GlossaryCategory;
  /**
   * One or two sentences that stand alone with no surrounding context. Used
   * as the meta description, the schema.org description, and the index
   * card summary, so it must answer "what is this" on its own.
   */
  shortDefinition: string;
  /** Substantive body, one string per paragraph. */
  body: string[];
  /** Primary sources. At least one is required for every term. */
  sources: GlossarySource[];
  /** Slugs of other terms in the glossary. */
  related?: string[];
  /** Links to tips or other pages elsewhere on the site. */
  seeAlso?: GlossaryCrossLink[];
  /** ISO date the entry was last verified against its sources. */
  updated: string;
}

/** Stable slugifier shared by index anchors, permalinks and JSON-LD. */
export function glossarySlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
