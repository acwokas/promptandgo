import type { GlossaryTerm } from "../types";

export const CoreTechniquesTerms: GlossaryTerm[] = [
  {
    slug: "chain-of-thought-prompting",
    term: "Chain-of-Thought Prompting",
    aliases: ["CoT prompting", "Step-by-step prompting"],
    category: "Core Techniques",
    shortDefinition: "Chain-of-thought prompting asks an AI model to work through a problem in explicit, step-by-step reasoning before giving its final answer, which tends to improve accuracy on tasks with multiple steps.",
    body: [
      "Rather than jumping straight to a conclusion, the model is prompted, either directly ('think step by step') or through worked examples, to lay out the intermediate reasoning first. Breaking a hard problem into smaller steps reduces the chance the model skips a step or jumps to an unsupported conclusion.",
      "A practical example is a multi-step business or math question in ChatGPT: 'A client wants a 15% discount on a $4,200 order but only if they order two more units at full price. Work through this step by step, then give the final total.' Some current models, including newer Claude and OpenAI reasoning-focused models, now do a version of this internally by default through built-in thinking modes, rather than requiring you to ask for it explicitly.",
      "It's worth knowing that visible reasoning isn't proof of correctness. A model can produce a chain of steps that looks logical while still landing on the wrong answer, so treat the reasoning as something to sanity-check, not as a guarantee.",
    ],
    sources: [
      { label: "Wei et al.: Chain-of-Thought Prompting Elicits Reasoning in Large Language Models (arXiv:2201.11903)", url: "https://arxiv.org/abs/2201.11903" },
      { label: "Google: Machine Learning Glossary, definition of chain-of-thought prompting", url: "https://developers.google.com/machine-learning/glossary/generative" },
    ],
    related: ["prompt-engineering", "hallucination", "role-prompting", "few-shot-prompting"],
    updated: "2026-08-27",
  },
  {
    slug: "few-shot-prompting",
    term: "Few-Shot Prompting",
    aliases: ["Few-shot learning", "In-context learning", "Multishot prompting"],
    category: "Core Techniques",
    shortDefinition: "Few-shot prompting means including a handful of example input-output pairs directly in the prompt so the model can infer the pattern and apply it to a new case, without any retraining.",
    body: [
      "Instead of describing a task abstractly, you show the model a few worked examples and let it infer the rule from the pattern. This is often called in-context learning: the model isn't being fine-tuned, it's picking up the pattern purely from what's sitting in the prompt for that one request.",
      "A typical use: in Claude or ChatGPT, giving two or three examples of turning a rough meeting note into a formatted action item ('Note: John needs to send the contract by Friday -> Action: John, send contract, due Fri') before asking it to convert a new note, so the output matches your exact format instead of whatever format the model happens to default to.",
      "More examples generally help, but only to a point, and consistency matters more than quantity. If one of your examples is slightly off in style or contains a mistake, the model will often faithfully copy that inconsistency into its answers, so it's worth double-checking the examples as carefully as the instructions.",
    ],
    sources: [
      { label: "Brown et al.: Language Models are Few-Shot Learners (arXiv:2005.14165)", url: "https://arxiv.org/abs/2005.14165" },
      { label: "OpenAI: Prompt engineering guide (few-shot learning)", url: "https://developers.openai.com/api/docs/guides/prompt-engineering" },
    ],
    related: ["zero-shot-prompting", "prompt-engineering", "prompt-template", "chain-of-thought-prompting"],
    updated: "2026-08-27",
  },
  {
    slug: "prompt-chaining",
    term: "Prompt Chaining",
    aliases: ["Sequential prompting", "Prompt pipelines"],
    category: "Core Techniques",
    shortDefinition: "Prompt chaining is the technique of breaking a complex task into a sequence of smaller prompts, where the output of one becomes the input to the next, instead of trying to solve everything in a single request.",
    body: [
      "Each step in a chain is a separate call to the model, which means you can inspect, log, or correct the result at any point along the way, rather than only seeing a single all-at-once answer that might have gone wrong somewhere in the middle.",
      "A common pattern is draft, review, refine: one prompt asks Claude or ChatGPT to draft a blog outline, a second feeds that outline back in and asks for a full draft, a third critiques the draft against a style guide, and a fourth applies the fixes. Building this as four small, checkable steps tends to produce more reliable output than one giant prompt asking for all of it at once.",
      "Chaining adds latency and cost, since it multiplies the number of calls, and increasingly capable agentic and reasoning models can handle some multistep tasks internally in a single request. Chaining is most worth the overhead when you specifically need to inspect, evaluate, or branch on an intermediate result.",
    ],
    sources: [
      { label: "Anthropic: Prompting best practices (chain prompts)", url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices" },
      { label: "Google: Gemini API prompting strategies (sequential prompting)", url: "https://ai.google.dev/gemini-api/docs/prompting-strategies" },
    ],
    related: ["prompt-engineering", "context-window", "chain-of-thought-prompting"],
    updated: "2026-08-27",
  },
  {
    slug: "role-prompting",
    term: "Role Prompting",
    aliases: ["Persona prompting", "Persona pattern"],
    category: "Core Techniques",
    shortDefinition: "Role prompting, also called persona prompting, means instructing an AI model to answer as if it were a specific character or professional, such as 'an experienced tax accountant,' to shape its tone, vocabulary, and focus.",
    body: [
      "The role is usually set in the system prompt or the first line of instructions, and even a single sentence can noticeably change how the model responds, what it prioritizes, and how confident or cautious it sounds.",
      "For example, telling Claude 'You are a blunt, senior copy editor. Point out every weak sentence' before pasting a draft tends to produce terser, more opinionated feedback than pasting the same draft with no role assigned. The same technique works through ChatGPT's custom instructions or a Gemini system instruction.",
      "A role changes style and framing, not underlying knowledge. Assigning a persona doesn't give the model verified expertise or access to facts it didn't already have, so a model 'acting as a doctor' can still be wrong, just wrong in a more confident, in-character way. Treat role prompting as a tone control, not a credential.",
    ],
    sources: [
      { label: "Anthropic: Prompting best practices (give Claude a role)", url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices" },
    ],
    related: ["system-prompt", "prompt-engineering", "prompt-template"],
    updated: "2026-08-27",
  },
  {
    slug: "zero-shot-prompting",
    term: "Zero-Shot Prompting",
    aliases: ["Zero-shot learning"],
    category: "Core Techniques",
    shortDefinition: "Zero-shot prompting means asking an AI model to do a task using only an instruction, with no worked examples of the desired output included in the prompt.",
    body: [
      "In a zero-shot prompt, the model has to figure out what you want purely from its own pretrained knowledge and however clearly you've described the task. There's no demonstration to imitate, it just has to interpret the instruction directly.",
      "For example, asking Gemini 'Classify this review as positive, negative, or neutral: \"The delivery was late but the product itself works great\"' with no sample classifications given is zero-shot. Compare that with few-shot prompting, where you'd first show a couple of reviews already labeled the way you want.",
      "Zero-shot is fast to write and works well for common, well-understood tasks. But for anything with an unusual format, an ambiguous definition of success, or strict output rules, it often underperforms compared to giving even one or two examples, since the model has nothing concrete to match its output against.",
    ],
    sources: [
      { label: "Google: Machine Learning Glossary, definition of zero-shot prompting", url: "https://developers.google.com/machine-learning/glossary/generative" },
      { label: "Google: Gemini API prompting strategies", url: "https://ai.google.dev/gemini-api/docs/prompting-strategies" },
    ],
    related: ["few-shot-prompting", "prompt-engineering", "chain-of-thought-prompting"],
    updated: "2026-08-27",
  },
];
