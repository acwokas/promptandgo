import SEO from "@/components/SEO";
import { Bot, Send, Sparkles } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";

interface ChatMessage {
  id: string;
  role: "user" | "scout";
  content: string;
}

const STARTER_QUESTIONS = [
  "How do I write better prompts for Claude?",
  "What's the best way to translate prompts to Japanese?",
  "Help me create a customer service prompt for WeChat",
  "How do I optimize prompts for Qwen?",
];

const MOCK_RESPONSES: Record<string, string> = {
  claude: `**Great question!** Claude responds best to structured, clear prompts. Here are key tips:

1. **Use XML tags** to separate sections: \`<context>\`, \`<instructions>\`, \`<output_format>\`
2. **Be explicit about tone** — Claude respects detailed style guidance
3. **Provide examples** — Claude excels at few-shot learning
4. **Set constraints clearly** — word limits, format requirements, audience

For Asian language prompts, Claude handles Japanese keigo (敬語) well if you specify the formality level explicitly. Try: *"Respond in formal Japanese using です/ます form suitable for business correspondence."*`,

  japanese: `**Translating prompts to Japanese requires more than language conversion.** Here's what works:

1. **Specify formality level** — Japanese has distinct registers:
   - 敬語 (keigo): formal/business
   - 丁寧語 (teineigo): polite
   - タメ口 (tameguchi): casual

2. **Cultural context matters** — A marketing prompt for Tokyo audiences needs different tone than Osaka
3. **Use native sentence structures** — Don't just translate English syntax
4. **Include context clues** — Japanese AI models perform better with explicit situational framing

**Pro tip:** Always test your Japanese prompts on both ChatGPT and Qwen — they handle CJK differently.`,

  wechat: `**Customer service on WeChat has unique requirements.** Here's a prompt framework:

1. **Start with the platform context**: "You are a customer service agent on WeChat (微信) for [brand]"
2. **Set the tone**: Chinese CS culture values warmth and rapid resolution. Use phrases like 亲 (qīn) for friendly e-commerce tone
3. **Include common scenarios**: returns, shipping inquiries, product questions
4. **Format for WeChat**: Keep responses short (WeChat messages are typically brief), use emojis appropriately (🎉✨), avoid long paragraphs

**Example prompt:**
> "Act as a friendly WeChat customer service agent for a skincare brand targeting 25-35 year old women in Tier 1 Chinese cities. Respond warmly using 亲 tone. Keep messages under 100 characters."`,

  qwen: `**Qwen (通义千问) is Alibaba's flagship model** and excels in Chinese-language tasks. Key optimization tips:

1. **Write prompts in Chinese when possible** — Qwen's Chinese comprehension outperforms its English in many tasks
2. **Leverage e-commerce context** — Qwen is trained on Alibaba data, so it understands Taobao/Tmall product descriptions, 小红书 (Xiaohongshu) marketing, and Alipay flows
3. **Use structured Chinese prompts** — 角色 (role), 任务 (task), 要求 (requirements), 格式 (format)
4. **Specify output length** — Qwen tends to be verbose; set explicit character limits

**Best for:** Product descriptions, Chinese marketing copy, Taobao SEO, and Mandarin business communication.`,
};

const GENERIC_RESPONSES = [
  `**Here are some universal prompt engineering tips for Asian markets:**

1. **Always specify the target language AND culture** — "Write in Thai for Bangkok office workers" is much better than just "Write in Thai"
2. **Consider formality hierarchies** — Japanese, Korean, and Thai all have complex honorific systems
3. **Reference local platforms** — Mention Shopee, Lazada, LINE, KakaoTalk by name for better context
4. **Test across models** — ChatGPT, Claude, and Gemini handle Asian languages differently

The key insight: AI models default to Western contexts. Your job is to provide enough Asian context to override that default.`,

  `**Platform-specific advice:**

- **ChatGPT**: Best all-rounder for Asian languages. Use system messages to set cultural context
- **Claude**: Excellent for long-form Japanese and Korean content. Use XML tags for structure
- **Gemini**: Strong in Southeast Asian languages. Good for Bahasa and Thai
- **DeepSeek**: Best for technical/coding prompts. Chinese-first architecture
- **Ernie Bot**: Optimized for Chinese business contexts. Understands Baidu ecosystem

Each platform has unique strengths — the best results come from matching your use case to the right model.`,

  `**Common mistakes in Asian prompt engineering:**

1. ❌ Translating English prompts word-for-word
2. ❌ Ignoring formality levels (huge issue for JP/KR/TH)
3. ❌ Using Western examples (mention local brands instead)
4. ❌ Assuming one prompt works for all Asian markets
5. ❌ Not specifying character encoding or script preferences

✅ **Instead:** Build prompts natively in the target language, reference local context, and always specify the desired tone and formality.`,

  `**Let me help you think about prompt structure.** A well-optimized prompt for Asian markets follows this framework:

**🎯 ROLE** → Who is the AI acting as? (e.g., "You are a bilingual marketing specialist for the Singapore market")
**📋 TASK** → What specific output do you need?
**🌏 CONTEXT** → Cultural and market context (platforms, audience, region)
**📐 FORMAT** → Output structure, length, language mix
**⚡ CONSTRAINTS** → Tone, formality, things to avoid

This framework works across ChatGPT, Claude, Gemini, and Asian-specific platforms like Qwen and DeepSeek.`,

  `**Multilingual prompting is one of our specialties!** Here's how to handle mixed-language prompts:

1. **Code-switching is OK** — Many Asian professionals naturally mix English with their native language. Your prompts can too
2. **Specify the output language explicitly** — "Respond in Bahasa Indonesia with English technical terms"
3. **Use romanization guides** — For Thai, Japanese, or Korean, specify whether you want native script or romanized output
4. **Test with examples** — Provide a sample of your desired output in the target language

Languages we optimize for: English, 中文, 日本語, 한국어, ไทย, Tiếng Việt, Bahasa Indonesia, Bahasa Melayu, हिन्दी, Tagalog, বাংলা, and ខ្មែរ.`,
];

function getResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  if (lower.includes("claude")) return MOCK_RESPONSES.claude;
  if (lower.includes("japanese") || lower.includes("日本")) return MOCK_RESPONSES.japanese;
  if (lower.includes("wechat") || lower.includes("微信") || lower.includes("customer service")) return MOCK_RESPONSES.wechat;
  if (lower.includes("qwen") || lower.includes("通义")) return MOCK_RESPONSES.qwen;
  return GENERIC_RESPONSES[Math.floor(Math.random() * GENERIC_RESPONSES.length)];
}

const AskScout = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getResponse(text);
      const scoutMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "scout",
        content: response,
      };
      setMessages((prev) => [...prev, scoutMsg]);
      setIsTyping(false);
    }, 1500);
  }, [isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 57px)" }}>
      <SEO
        title="Ask Scout — AI Prompting Assistant | PromptAndGo"
        description="Ask Scout anything about AI prompting in Asian languages. Get expert advice on platforms, cultural context, and multilingual prompt optimization."
        canonical="/ask-scout"
      />

      {/* Header bar */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-sm">Scout</p>
            <p className="text-xs text-muted-foreground">AI Prompt Assistant for Asia</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
          <Sparkles className="w-3 h-3 text-accent" />
          <span className="text-xs text-accent font-medium">Powered by AI</span>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {!hasMessages && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6">
                <Bot className="w-9 h-9 text-white" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Hi! I'm Scout, your AI prompt assistant</h1>
              <p className="text-muted-foreground max-w-md mb-10">
                I specialize in prompt engineering for Asian languages, platforms, and cultural contexts. Ask me anything!
              </p>
              <div className="grid sm:grid-cols-2 gap-3 w-full max-w-lg">
                {STARTER_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-left text-sm p-4 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-primary/5 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 mb-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "scout" && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-muted rounded-bl-sm"
                }`}
              >
                {msg.content.split(/(\*\*.*?\*\*)/g).map((part, i) => {
                  if (part.startsWith("**") && part.endsWith("**")) {
                    return <strong key={i}>{part.slice(2, -2)}</strong>;
                  }
                  if (part.startsWith("*") && part.endsWith("*") && !part.startsWith("**")) {
                    return <em key={i}>{part.slice(1, -1)}</em>;
                  }
                  return <span key={i}>{part}</span>;
                })}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 mb-4">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-border bg-card/50 backdrop-blur-sm px-4 py-3 shrink-0">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Scout anything about prompts..."
              className="flex-1 h-11 rounded-xl border border-border bg-background px-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              disabled={isTyping}
              maxLength={500}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="h-11 w-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/85 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center justify-between mt-1.5 px-1">
            <p className="text-[11px] text-muted-foreground">Scout is an AI assistant. Responses are for guidance only.</p>
            <span className="text-[11px] text-muted-foreground">{input.length}/500</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AskScout;
