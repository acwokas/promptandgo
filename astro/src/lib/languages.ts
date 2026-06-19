// Canonical local-language set for PromptAndGo.
// Source of truth for the homepage language hero, the /languages page, and
// any future language nav. Each entry maps to a real landing page that exists
// under src/pages/<tag>.astro. Keep this list aligned with the footer
// "By Market" column and the dedicated landing pages.

export interface LanguageEntry {
  /** BCP-47-ish tag, also the landing route: /ja, /ko, /zh, /th, /vi, /id */
  tag: string;
  /** Native-script name, shown large as the focal point */
  native: string;
  /** English name */
  english: string;
  /** Market sub-label */
  market: string;
  /** One-line local-language angle, plain voice */
  angle: string;
}

export const LANGUAGES: LanguageEntry[] = [
  {
    tag: "ja",
    native: "日本語",
    english: "Japanese",
    market: "Japan",
    angle: "Keigo and business register, calibrated for real Japanese workplaces.",
  },
  {
    tag: "ko",
    native: "한국어",
    english: "Korean",
    market: "Korea",
    angle: "Honorifics and speech levels that match who you are writing to.",
  },
  {
    tag: "zh",
    native: "中文",
    english: "Chinese",
    market: "China",
    angle: "Simplified and Traditional, with tone tuned for WeChat and the mainland.",
  },
  {
    tag: "th",
    native: "ไทย",
    english: "Thai",
    market: "Thailand",
    angle: "Politeness particles and formal register handled out of the box.",
  },
  {
    tag: "vi",
    native: "Tiếng Việt",
    english: "Vietnamese",
    market: "Vietnam",
    angle: "The pronoun system and regional tone, kept natural.",
  },
  {
    tag: "id",
    native: "Bahasa",
    english: "Indonesia & Malaysia",
    market: "SE Asia",
    angle: "Bapak/Ibu register and marketplace copy that reads like a local wrote it.",
  },
];
