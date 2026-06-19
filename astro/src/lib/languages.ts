// Canonical local-language set for PromptAndGo.
// Source of truth for the homepage language hero, the /languages page, the
// /models coverage page, and each /<tag> landing. Each entry maps to a real
// landing page under src/pages/<tag>.astro. Keep this list aligned with the
// footer "By Market" column and the dedicated landing pages.

export interface ModelEntry {
  /** Display name / wordmark */
  name: string;
  /** Vendor, shown as small caption where space allows */
  vendor?: string;
  /** true = local Asian model (the wedge); false = Western frontier model */
  local: boolean;
  /** Logo slug if /public/brand/ai/<slug>.svg exists; otherwise text badge */
  slug?: string;
}

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
  /** Local + frontier AI models we test this market's prompts against.
      Local models lead; logos render only where a wordmark file exists. */
  models: ModelEntry[];
  /** Optional honesty note rendered under the model row (e.g. mainland China) */
  modelsNote?: string;
}

// Market-to-models map. Accurate as of 2026-06-19 (provided, research-backed).
// Logos exist only for: chatgpt, claude, gemini, qwen, ernie, deepseek.
export const LANGUAGES: LanguageEntry[] = [
  {
    tag: "ja",
    native: "日本語",
    english: "Japanese",
    market: "Japan",
    angle: "Keigo and business register, calibrated for real Japanese workplaces.",
    models: [
      { name: "Karakuri", vendor: "Karakuri", local: true },
      { name: "Stockmark", vendor: "Stockmark", local: true },
      { name: "ELYZA", vendor: "ELYZA", local: true },
      { name: "Rakuten AI", vendor: "Rakuten", local: true },
      { name: "ChatGPT", vendor: "OpenAI", local: false, slug: "chatgpt" },
      { name: "Claude", vendor: "Anthropic", local: false, slug: "claude" },
      { name: "Gemini", vendor: "Google", local: false, slug: "gemini" },
    ],
  },
  {
    tag: "ko",
    native: "한국어",
    english: "Korean",
    market: "Korea",
    angle: "Honorifics and speech levels that match who you are writing to.",
    models: [
      { name: "HyperCLOVA X", vendor: "Naver", local: true },
      { name: "Solar", vendor: "Upstage", local: true },
      { name: "EXAONE", vendor: "LG AI", local: true },
      { name: "ChatGPT", vendor: "OpenAI", local: false, slug: "chatgpt" },
      { name: "Claude", vendor: "Anthropic", local: false, slug: "claude" },
    ],
  },
  {
    tag: "zh",
    native: "中文",
    english: "Chinese",
    market: "China",
    angle: "Simplified and Traditional, with tone tuned for WeChat and the mainland.",
    models: [
      { name: "Qwen", vendor: "Alibaba", local: true, slug: "qwen" },
      { name: "Ernie", vendor: "Baidu", local: true, slug: "ernie" },
      { name: "DeepSeek", vendor: "DeepSeek", local: true, slug: "deepseek" },
      { name: "Kimi", vendor: "Moonshot", local: true },
      { name: "Yi", vendor: "01.AI", local: true },
      { name: "GLM", vendor: "Zhipu", local: true },
    ],
    modelsNote: "ChatGPT, Claude and Gemini are not officially available in mainland China, so we test Mandarin prompts on the models your market actually uses.",
  },
  {
    tag: "th",
    native: "ไทย",
    english: "Thai",
    market: "Thailand",
    angle: "Politeness particles and formal register handled out of the box.",
    models: [
      { name: "Typhoon", vendor: "SCB 10X", local: true },
      { name: "OpenThaiGPT", vendor: "OpenThaiGPT", local: true },
      { name: "ChatGPT", vendor: "OpenAI", local: false, slug: "chatgpt" },
      { name: "Claude", vendor: "Anthropic", local: false, slug: "claude" },
    ],
  },
  {
    tag: "vi",
    native: "Tiếng Việt",
    english: "Vietnamese",
    market: "Vietnam",
    angle: "The pronoun system and regional tone, kept natural.",
    models: [
      { name: "PhoGPT", vendor: "VinAI", local: true },
      { name: "VinaLLaMA", vendor: "VinAI", local: true },
      { name: "ChatGPT", vendor: "OpenAI", local: false, slug: "chatgpt" },
      { name: "Claude", vendor: "Anthropic", local: false, slug: "claude" },
    ],
  },
  {
    tag: "id",
    native: "Bahasa",
    english: "Indonesia & Malaysia",
    market: "SE Asia",
    angle: "Bapak/Ibu register and marketplace copy that reads like a local wrote it.",
    models: [
      { name: "Sahabat-AI", vendor: "GoTo / Indosat", local: true },
      { name: "Merak", vendor: "Merak", local: true },
      { name: "Komodo-7B", vendor: "Yellow.ai", local: true },
      { name: "ChatGPT", vendor: "OpenAI", local: false, slug: "chatgpt" },
      { name: "Claude", vendor: "Anthropic", local: false, slug: "claude" },
    ],
  },
];

export function getLanguage(tag: string): LanguageEntry | undefined {
  return LANGUAGES.find((l) => l.tag === tag);
}
