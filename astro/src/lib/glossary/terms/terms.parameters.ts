import type { GlossaryTerm } from "../types";

export const ParametersTerms: GlossaryTerm[] = [
  {
    slug: "max-tokens",
    term: "Max Tokens",
    aliases: ["max_tokens", "Max output tokens"],
    category: "Parameters & Mechanics",
    shortDefinition: "Max tokens is an API parameter that sets the upper limit on how many tokens an AI model is allowed to generate in a single response, used to control response length, latency, and cost.",
    body: [
      "Max tokens is a ceiling, not a target: the model can and often does stop earlier on its own once it finishes its answer. It exists to prevent a response from running longer, and costing more, than you intended.",
      "A practical example: setting max_tokens to 300 on an API call powering a short-summary feature keeps a runaway or overly verbose response from generating pages of text. If the model hasn't finished its thought by the time it hits that limit, the response comes back cut off mid-sentence rather than wrapped up cleanly.",
      "Max tokens applies only to the output, not the prompt, but the two interact: input tokens plus max_tokens generally can't exceed a model's total context window. Setting max_tokens too high on an already long prompt can trigger an error on some models rather than simply getting ignored, so it's worth checking a model's limits before assuming a large value is always safe.",
    ],
    sources: [
      { label: "Anthropic: API reference, Messages, max_tokens parameter", url: "https://platform.claude.com/docs/en/api/messages" },
      { label: "OpenAI: API reference, chat completions parameters", url: "https://developers.openai.com/api/docs/api-reference/chat/create" },
    ],
    related: ["token", "context-window", "stop-sequence"],
    updated: "2026-08-27",
  },
  {
    slug: "stop-sequence",
    term: "Stop Sequence",
    aliases: ["Stop token", "stop parameter"],
    category: "Parameters & Mechanics",
    shortDefinition: "A stop sequence is a specific string of text you configure an AI model to watch for while generating; as soon as it produces that exact string, generation halts immediately.",
    body: [
      "Stop sequences give you a hard, exact-match way to enforce structure in a model's output, ending generation right at a boundary you define rather than relying on the model to naturally know when to stop.",
      "A common use is programmatic Q&A: setting the stop sequence to something like '\\nUser:' so a model completing a single turn doesn't drift into hallucinating the next turn of the conversation itself, or stopping code generation at a closing code fence so it doesn't wander into extra commentary after the code block. OpenAI's API accepts up to four stop sequences per call, and the matched text itself is excluded from what's returned.",
      "Because matching is exact, a stop sequence only works if the model phrases the boundary exactly the way you specified. It's a blunt tool best suited to predictable, structured output, not free-form writing where the model might end a section differently each time.",
    ],
    sources: [
      { label: "Anthropic: API reference, Messages, stop_sequences parameter", url: "https://platform.claude.com/docs/en/api/messages" },
      { label: "OpenAI: API reference, chat completions parameters (stop)", url: "https://developers.openai.com/api/docs/api-reference/chat/create" },
    ],
    related: ["max-tokens", "prompt-template"],
    updated: "2026-08-27",
  },
  {
    slug: "temperature",
    term: "Temperature",
    aliases: ["Sampling temperature"],
    category: "Parameters & Mechanics",
    shortDefinition: "Temperature is an API setting that controls how random or predictable an AI model's output is: low values produce focused, repeatable answers, and high values produce more varied, creative ones.",
    body: [
      "Temperature adjusts how sharply the model favors its single most likely next word versus spreading probability across less likely alternatives. Lower values push the model toward its most probable, safest continuation each step; higher values let less likely words through more often, which reads as more varied or creative but also less predictable.",
      "In the OpenAI or Anthropic API, a customer-support bot that should answer the same question the same way every time is typically set near 0, while a brainstorming tool generating ad taglines might be set closer to 1 (OpenAI allows up to 2) to encourage variety. Consumer apps like ChatGPT and Claude.ai generally don't expose this slider; it mainly matters when calling the API directly.",
      "Even at temperature 0, output usually isn't perfectly identical every time, due to other factors in how the model runs. It's also worth knowing that Anthropic has deprecated the temperature parameter on Claude models released after Opus 4.6, a sign that providers are moving some of this control into other mechanisms, like adaptive reasoning settings, rather than keeping it universal.",
    ],
    sources: [
      { label: "OpenAI: API reference, chat completions parameters", url: "https://developers.openai.com/api/docs/api-reference/chat/create" },
      { label: "Google: Machine Learning Glossary, definition of temperature", url: "https://developers.google.com/machine-learning/glossary/generative" },
      { label: "Anthropic: Messages API reference (temperature and top_p parameters)", url: "https://platform.claude.com/docs/en/api/messages" },
    ],
    related: ["top-p", "max-tokens", "prompt-engineering"],
    updated: "2026-08-27",
  },
  {
    slug: "top-p",
    term: "Top-p (Nucleus Sampling)",
    aliases: ["Nucleus sampling", "Top-p sampling"],
    category: "Parameters & Mechanics",
    shortDefinition: "Top-p, or nucleus sampling, is an AI model setting that limits word choice at each step to the smallest set of most likely next tokens whose combined probability reaches a target percentage, cutting off unlikely options entirely.",
    body: [
      "Where temperature reshapes randomness across the whole vocabulary, top-p narrows the candidate pool itself before any randomness is applied. It computes a running total of probability across the most likely next tokens and stops including new candidates once that total crosses the threshold you set.",
      "In the OpenAI or Google API, setting top_p to 0.9 means the model only samples from the smallest group of next-word options that together account for 90 percent of the probability mass, excluding the long tail of implausible words entirely. Most provider guidance recommends adjusting either temperature or top-p, not both at once, since combining them makes the effect harder to predict.",
      "It's worth knowing why this was introduced: the technique comes from research into 'neural text degeneration,' the tendency of models to produce repetitive or bland text when they always pick the single most probable word. Nucleus sampling keeps some controlled randomness while still excluding clearly bad options, striking a middle ground between pure randomness and always picking the top choice.",
    ],
    sources: [
      { label: "Holtzman et al.: The Curious Case of Neural Text Degeneration (arXiv:1904.09751)", url: "https://arxiv.org/abs/1904.09751" },
      { label: "OpenAI: API reference, chat completions parameters", url: "https://developers.openai.com/api/docs/api-reference/chat/create" },
      { label: "Anthropic: Messages API reference (temperature and top_p parameters)", url: "https://platform.claude.com/docs/en/api/messages" },
    ],
    related: ["temperature", "max-tokens"],
    updated: "2026-08-27",
  },
];
