import type { GlossaryTerm } from "../types";

export const LanguageLocalisationTerms: GlossaryTerm[] = [
  {
    slug: "code-switching",
    term: "Code-Switching",
    aliases: ["Code-mixing", "Singlish", "Manglish", "Taglish"],
    category: "Language & Localisation",
    shortDefinition: "Code-switching is alternating between two or more languages within a single conversation, sentence, or even phrase, and it is the everyday norm rather than an exception across much of Southeast Asia.",
    body: [
      "Code-switching ranges from borrowing a single word from another language mid-sentence to alternating whole clauses, and it's a well-studied, ordinary feature of multilingual speech rather than a sign of incomplete fluency in either language. In Singapore, this shows up as Singlish, blending English with Mandarin, Malay, Tamil, and Hokkien elements; in Malaysia and neighbouring countries as Manglish, mixing Malay and English; and in the Philippines as Taglish, mixing Tagalog and English, now common enough to function as an everyday lingua franca in Philippine cities rather than a marker of poor English or poor Tagalog.",
      "For prompting, this matters directly if you're generating marketing copy, customer support replies, or social content for a Southeast Asian audience: a prompt asking for 'natural, conversational Singaporean English' will read very differently from one asking for 'formal English,' because natural everyday speech in that context genuinely does mix languages. Asking a model for pure, code-switch-free English where the target audience expects some Singlish or Manglish flavour can make copy read as stiff or foreign, while overdoing the mixing without local calibration can read as a caricature rather than authentic voice.",
      "The practical prompting move is the same across all three: name the register and audience precisely (formal English for an investor deck versus conversational Singlish for a WhatsApp-style promotion) rather than asking generically for 'English' and hoping the model picks the right level of mixing on its own.",
    ],
    sources: [
      { label: "Wikipedia: Code-switching", url: "https://en.wikipedia.org/wiki/Code-switching" },
    ],
    updated: "2026-09-07",
  },
  {
    slug: "keigo",
    term: "Keigo",
    aliases: ["敬語", "Japanese honorific speech"],
    category: "Language & Localisation",
    shortDefinition: "Keigo is the Japanese system of honorific language, made up of three forms (sonkeigo, kenjougo, teineigo) that mark respect, humility, and politeness depending on who is speaking to whom.",
    body: [
      "Keigo has three distinct forms that do different jobs. Sonkeigo (respectful language) elevates the person you're speaking to or about, typically your boss, a customer, or anyone of higher status, and is used when describing their actions. Kenjougo (humble language) does the opposite: it lowers your own actions or your in-group's actions when speaking to someone outside that group, as a form of deference. Teineigo (polite language), built around the -masu and -desu sentence endings, is the general-purpose politeness layer used across most everyday and professional interactions regardless of hierarchy.",
      "For prompting an AI model to write or translate Japanese business content, keigo matters because getting the wrong form reads as either presumptuous (using plain or humble forms where respect is expected) or oddly stiff (over-applying sonkeigo in casual contexts). A prompt asking for a customer email in Japanese benefits from specifying which register is wanted: teineigo for general politeness, or full keigo with sonkeigo/kenjougo for formal business correspondence, since a model given only 'write this in Japanese' will guess and often default to a generic polite register that doesn't match real business conventions.",
      "This is a case where the prompt itself needs the cultural specificity, not just the language: naming the register you want is closer to giving a style example than to a translation instruction.",
    ],
    sources: [
      { label: "Wikipedia: Honorific speech in Japanese", url: "https://en.wikipedia.org/wiki/Honorific_speech_in_Japanese" },
    ],
    updated: "2026-09-07",
  },
  {
    slug: "korean-honorifics",
    term: "Korean Honorifics and Speech Levels",
    aliases: ["Korean speech levels", "-습니다체", "-해요체"],
    category: "Language & Localisation",
    shortDefinition: "Korean speech levels are a set of verb-ending systems, roughly seven in total, that mark how formal or informal an utterance is toward the listener, separate from honorifics that show respect toward the person being talked about.",
    body: [
      "Korean distinguishes two related but different things: honorifics, which show respect toward whoever is being discussed in the sentence, and speech levels, which show respect or familiarity toward whoever is being spoken to, expressed through the verb ending. Linguists count seven traditional speech levels, though in current everyday and business use, two dominate: haeyoche (해요체), a polite but approachable form used with strangers, coworkers, and in most service or customer contexts, and hapsyoche (하십시오체), the more formal register used in official writing, news broadcasts, and higher-stakes business communication.",
      "This system traces to Confucian social structure, where clearly marking hierarchy and relationship in speech was, and still is, considered basic politeness rather than optional formality. For an AI prompt generating Korean content, the practical takeaway is that 'formal Korean' and 'polite Korean' are not the same request: asking for haeyoche gets friendly, professional, everyday Korean (a typical customer email), while asking for hapsyoche or specifying a genuinely formal context (a press release, a legal notice) shifts the verb endings and tone noticeably.",
      "As with keigo, the fix is specificity in the prompt: naming the audience and the situation (a coworker, a first-time customer, an official announcement) gives the model enough to choose the right speech level, where a bare 'translate to Korean' instruction leaves it guessing.",
    ],
    sources: [
      { label: "Wikipedia: Korean speech levels", url: "https://en.wikipedia.org/wiki/Korean_speech_levels" },
    ],
    updated: "2026-09-07",
  },
];
