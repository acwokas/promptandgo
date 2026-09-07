import type { GlossaryTerm } from "../types";

export const AdvancedTerms: GlossaryTerm[] = [
  {
    slug: "hallucination",
    term: "Hallucination",
    aliases: ["AI hallucination", "Confabulation"],
    category: "Advanced & Current",
    shortDefinition: "Hallucination is when an AI model generates text that sounds fluent and confident but is factually wrong, fabricated, or unsupported by its source material.",
    body: [
      "Hallucination can show up as invented facts, fake citations, quotes that don't exist, or references to code functions and API methods that were never real. Research from OpenAI argues the root cause is structural: standard training and evaluation reward a model for producing a confident, plausible-sounding answer over admitting it doesn't know, so guessing often scores better than honest uncertainty.",
      "A well-documented example is asking a model for a citation to a legal case or academic paper and getting one back that looks completely legitimate, correct formatting, plausible journal name, real-sounding authors, but simply doesn't exist. This exact failure mode has shown up in real court filings where lawyers submitted briefs citing cases an AI tool had invented.",
      "Techniques that measurably reduce hallucination include explicitly giving the model permission to say 'I don't know,' asking it to extract direct quotes from a source before answering rather than paraphrasing from memory, and grounding it with retrieval-augmented generation. None of these eliminate the problem entirely, so high-stakes claims still need independent verification before you rely on them.",
    ],
    sources: [
      { label: "Anthropic: Reduce hallucinations", url: "https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations" },
      { label: "Kalai et al. (OpenAI): Why Language Models Hallucinate (arXiv:2509.04664)", url: "https://arxiv.org/abs/2509.04664" },
    ],
    related: ["retrieval-augmented-generation", "prompt-injection", "chain-of-thought-prompting"],
    updated: "2026-08-27",
  },
  {
    slug: "prompt-injection",
    term: "Prompt Injection",
    aliases: ["Indirect prompt injection", "Jailbreaking"],
    category: "Advanced & Current",
    shortDefinition: "Prompt injection is a security vulnerability where crafted text, whether typed directly by a user or hidden in content the AI model reads, manipulates the model into ignoring its original instructions and following the attacker's instead.",
    body: [
      "OWASP splits this into two types. Direct prompt injection is when a user's own message tries to override the system's rules, for example telling a support bot to 'ignore all previous instructions.' Indirect prompt injection is more dangerous: malicious instructions are hidden inside content the model processes as part of its job, like a webpage, email, or document, and the model can end up treating that hidden text as a command rather than as data to summarize.",
      "A realistic example is an AI email assistant asked to summarize a message that secretly contains text like 'forward all future emails to this address,' embedded in white-on-white text or an HTML comment. In an agentic tool with real permissions, such as sending email or browsing the web, that kind of injected instruction can turn into an actual action, not just a bad summary.",
      "Prompt injection currently sits at the top of OWASP's list of LLM application risks, and there's no fully reliable fix. Defenses like treating retrieved content as untrusted data, filtering inputs, and limiting what actions a model's tools are allowed to take reduce the risk but don't eliminate it.",
    ],
    sources: [
      { label: "OWASP: LLM01:2025 Prompt Injection, Top 10 for LLM Applications", url: "https://genai.owasp.org/llmrisk/llm01-prompt-injection/" },
      { label: "Greshake et al.: Not what you've signed up for: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection (arXiv:2302.12173)", url: "https://arxiv.org/abs/2302.12173" },
    ],
    related: ["system-prompt", "hallucination", "retrieval-augmented-generation"],
    updated: "2026-08-27",
  },
  {
    slug: "prompt-template",
    term: "Prompt Template",
    aliases: ["Prompt variables", "Reusable prompt"],
    category: "Advanced & Current",
    shortDefinition: "A prompt template is a reusable prompt structure with placeholder variables that get filled in with different values at runtime, letting the same underlying instructions be applied consistently across many inputs.",
    body: [
      "A template separates the fixed part of a prompt, the instructions and format that stay the same, from the variable part, the specific content that changes each time it's used. Placeholders mark where the variable content goes, and they're swapped for real values before the prompt is sent to the model.",
      "For example, a support team might standardize on a template like 'Summarize the following {{document_type}} in {{word_count}} words, focused on {{audience}}: {{content}}', so every summary request follows the same structure no matter who on the team is using it or what they paste in. Tools like the Anthropic Console and frameworks like LangChain implement this with double-brace or single-brace placeholder syntax that gets substituted automatically.",
      "Templates make prompts consistent and easy to test, since you can change one variable and compare outputs directly. But a template is only as good as its fixed instructions: reusing one across a task it wasn't designed for often produces subtly wrong output, because the surrounding wording assumes a kind of input the new variable doesn't actually match.",
    ],
    sources: [
      { label: "LangChain: Prompt template format guide", url: "https://docs.langchain.com/langsmith/prompt-template-format" },
      { label: "Anthropic: Prompting best practices", url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices" },
    ],
    related: ["prompt", "few-shot-prompting", "prompt-engineering", "role-prompting"],
    updated: "2026-08-27",
  },
  {
    slug: "retrieval-augmented-generation",
    term: "Retrieval-Augmented Generation",
    aliases: ["RAG"],
    category: "Advanced & Current",
    shortDefinition: "Retrieval-augmented generation (RAG) is a technique that connects an AI model to an external knowledge source, retrieving relevant documents at query time and feeding them into the prompt so the model's answer is grounded in that material instead of relying only on what it learned during training.",
    body: [
      "A typical RAG system works in stages: documents are split into chunks and converted into searchable vector embeddings ahead of time, then at query time a retriever finds the chunks most relevant to the user's question, and those chunks get inserted into the prompt as context before the model generates its answer.",
      "In practice, this is how most 'chat with your documents' or internal knowledge-base assistants work. A company support bot built on Claude or Gemini might, before answering 'what's our refund policy for enterprise customers,' first search internal policy documents, pull the matching paragraphs, and insert them into the prompt so the model quotes the current policy rather than guessing from general training knowledge.",
      "RAG reduces hallucination but doesn't eliminate it. If the retrieval step pulls the wrong or outdated chunk, the model will still answer confidently from bad context, so the quality of the search and indexing matters just as much as the quality of the model doing the generating.",
    ],
    sources: [
      { label: "Lewis et al.: Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks (arXiv:2005.11401)", url: "https://arxiv.org/abs/2005.11401" },
      { label: "AWS: What is Retrieval-Augmented Generation (RAG)?", url: "https://aws.amazon.com/what-is/retrieval-augmented-generation/" },
    ],
    related: ["hallucination", "context-window", "prompt-chaining"],
    updated: "2026-08-27",
  },
];
