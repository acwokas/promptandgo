import type { GlossaryTerm, GlossaryCategory } from "./types";
import { FundamentalsTerms } from "./terms/terms.fundamentals";
import { CoreTechniquesTerms } from "./terms/terms.core-techniques";
import { ParametersTerms } from "./terms/terms.parameters";
import { AdvancedTerms } from "./terms/terms.advanced";
import { LanguageLocalisationTerms } from "./terms/terms.language-localisation";

export const ALL_TERMS: GlossaryTerm[] = [
  ...FundamentalsTerms,
  ...CoreTechniquesTerms,
  ...ParametersTerms,
  ...AdvancedTerms,
  ...LanguageLocalisationTerms,
];

export const CATEGORY_ORDER: GlossaryCategory[] = [
  "Fundamentals",
  "Core Techniques",
  "Parameters & Mechanics",
  "Advanced & Current",
  "Language & Localisation",
];

export const TERMS_BY_SLUG: Record<string, GlossaryTerm> = Object.fromEntries(
  ALL_TERMS.map((t) => [t.slug, t])
);

export function termsByCategory(category: GlossaryCategory): GlossaryTerm[] {
  return ALL_TERMS.filter((t) => t.category === category).sort((a, b) => a.term.localeCompare(b.term));
}
