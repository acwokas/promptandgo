import type { GlossaryTerm } from "../types";

export const FundamentalsTerms: GlossaryTerm[] = [
  {
    slug: "context-window",
    term: "Context Window",
    aliases: ["Context length", "Token limit"],
    category: "Fundamentals",
    shortDefinition: "The context window is the total amount of text, measured in tokens, that an AI model can take into account at once: the prompt, the conversation so far, and its own response combined.",
    body: [
      "Think of the context window as a model's working memory for the current task, not its permanent knowledge. Everything the model needs to reason about, your instructions, any pasted documents, prior chat turns, and the answer it's writing, has to fit inside this budget. It's separate from the enormous dataset the model was trained on.",
      "A practical example: pasting a long PDF into Claude or Gemini and asking questions about it only works if the document's token count fits inside that model's window. Some current models support windows up to roughly 1 million tokens, others are capped around 128k to 200k, so the same document might work fine in one tool and get rejected or truncated in another.",
      "A common misconception is that a bigger context window is always better. Model accuracy tends to degrade as a window fills up, a pattern often called context rot, so stuffing in irrelevant material can make answers worse even when it technically fits, because the model still has to sort through the noise.",
    ],
    sources: [
      { label: "Anthropic: Context windows", url: "https://platform.claude.com/docs/en/build-with-claude/context-windows" },
      { label: "Google: Machine Learning Glossary, definition of context window", url: "https://developers.google.com/machine-learning/glossary/generative" },
    ],
    related: ["token", "prompt", "prompt-chaining", "retrieval-augmented-generation"],
    updated: "2026-08-27",
  },
  {
    slug: "prompt",
    term: "Prompt",
    aliases: ["AI prompt", "Query"],
    category: "Fundamentals",
    shortDefinition: "A prompt is the text you give an AI model, questions, instructions, context, or examples, that tells it what to do and shapes the response it generates.",
    body: [
      "A prompt is the input side of every exchange with a language model. It can be a single-line question, or it can be an elaborate set of instructions that specifies the task, the audience, the format, and the tone you want. The model reads the whole prompt before producing anything, so every detail you include (or leave out) has a chance to change the output.",
      "In practice, the difference between a vague prompt and a well-built one is the difference between a mediocre answer and a useful one. Typing 'summarize this' into ChatGPT, Claude, or Gemini gets a generic summary; typing 'summarize this article in three bullet points, written for a 10-year-old, no jargon' gets something you can actually use without editing.",
      "A common mix-up is treating the prompt as only the text visible in the chat box. In most apps, what the model actually receives also includes a system prompt, prior conversation turns, and sometimes retrieved documents, so identical wording typed into two different tools can produce very different answers because of what's silently attached to it.",
    ],
    sources: [
      { label: "Google: Machine Learning Glossary, Generative AI terms", url: "https://developers.google.com/machine-learning/glossary/generative" },
      { label: "Anthropic: Prompt engineering overview", url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview" },
    ],
    related: ["prompt-engineering", "system-prompt", "context-window", "prompt-template"],
    updated: "2026-08-27",
  },
  {
    slug: "prompt-engineering",
    term: "Prompt Engineering",
    aliases: ["Prompt design", "Prompt writing"],
    category: "Fundamentals",
    shortDefinition: "Prompt engineering is the practice of designing, testing, and refining the wording and structure of a prompt so an AI model reliably produces the output you actually want.",
    body: [
      "Prompt engineering treats getting good output from a model as a craft with feedback, not a one-shot guess. It covers things like being specific about the task, giving examples, specifying output format, and breaking a big ask into smaller steps, then checking whether the results actually meet a defined bar.",
      "As an example: instead of asking ChatGPT to 'write a product description,' a prompt engineer would test something like 'write a 60-word description for a wireless earbuds listing, emphasizing battery life, confident but not salesy, output only the description with no preamble,' then run it against a batch of real products to see where it breaks.",
      "The most common mistake is skipping the testing step: writing one prompt, liking the first answer, and shipping it. OpenAI's own guidance recommends starting from clear success criteria and a way to check against them before you start tuning the wording, since a prompt that looks good on one example can fail badly on the next.",
    ],
    sources: [
      { label: "Google: Machine Learning Glossary, definition of prompt engineering", url: "https://developers.google.com/machine-learning/glossary/generative" },
      { label: "OpenAI: Prompt engineering guide", url: "https://developers.openai.com/api/docs/guides/prompt-engineering" },
    ],
    related: ["prompt", "zero-shot-prompting", "few-shot-prompting", "chain-of-thought-prompting"],
    updated: "2026-08-27",
  },
  {
    slug: "system-prompt",
    term: "System Prompt",
    aliases: ["System instructions", "Custom instructions"],
    category: "Fundamentals",
    shortDefinition: "A system prompt is a standing instruction set placed before the conversation that defines an AI model's role, tone, and rules of behavior, kept separate from the user's own messages.",
    body: [
      "Most chat-based AI systems process at least two kinds of input: the system prompt, which sets up how the model should behave for the whole session, and the user's turns, which are the actual requests. Developers set this through an API parameter; everyday users sometimes get a lighter version of it through features like custom instructions.",
      "For example, an app built on the Claude API might set a system prompt like 'You are a careful legal research assistant. Only cite sources found in the documents provided, and say so plainly if you cannot find an answer.' Every user message in that session is then read against that framing. ChatGPT's custom instructions and Gemini's system instructions serve the same purpose in consumer-facing form.",
      "A common mistake is assuming the system prompt is invisible or unbreakable. It isn't tamper-proof: sufficiently crafted user input can sometimes get a model to ignore or reveal it, which is part of why prompt injection is treated as a real security concern. Don't put anything in a system prompt that would be a problem if a user eventually saw it.",
    ],
    sources: [
      { label: "Anthropic: Prompting best practices (system prompts and roles)", url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices" },
      { label: "OpenAI: Prompt engineering guide (message roles)", url: "https://developers.openai.com/api/docs/guides/prompt-engineering" },
    ],
    related: ["prompt", "role-prompting", "prompt-injection", "prompt-engineering"],
    updated: "2026-08-27",
  },
  {
    slug: "token",
    term: "Token",
    aliases: ["Tokenization"],
    category: "Fundamentals",
    shortDefinition: "A token is the small chunk of text, roughly a word, part of a word, or punctuation mark, that an AI language model actually reads and generates, and it's the unit used to measure prompt length, response length, and API cost.",
    body: [
      "Before a model processes any text, a tokenizer splits it into these pieces. Tokens aren't the same as words or characters: in English, a token is roughly four characters or about three-quarters of a word on average, though this varies by language and by which model's tokenizer is being used.",
      "In practice, this matters most when you're building on an API rather than chatting casually. OpenAI's tokenizer tool and Anthropic's token counting endpoint let you check how many tokens a prompt will use before sending it, which helps you stay under a model's context window and estimate cost, since most providers bill per million tokens processed.",
      "One nuance worth knowing: token counts aren't directly comparable across model families, or even across versions of the same family. Anthropic notes that its newer tokenizer produces roughly 30 percent more tokens for the same text than earlier Claude models did, so a count measured against one model can be misleading if reused for another.",
    ],
    sources: [
      { label: "Anthropic: Token counting", url: "https://platform.claude.com/docs/en/build-with-claude/token-counting" },
      { label: "OpenAI Cookbook: How to count tokens with tiktoken", url: "https://github.com/openai/openai-cookbook/blob/main/examples/How_to_count_tokens_with_tiktoken.ipynb" },
    ],
    related: ["context-window", "max-tokens", "prompt"],
    updated: "2026-08-27",
  },
];
