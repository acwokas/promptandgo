import { useState, useRef, useCallback, useEffect } from "react";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Link, useSearchParams } from "react-router-dom";
import {
  Wand2, Copy, Check, ChevronDown, Shield, Sparkles, RotateCcw,
  ArrowRight, BookOpen, Lightbulb, Settings2, Eye, Zap, Globe,
  ShoppingCart, Utensils, Landmark, GraduationCap, TrendingUp, Languages, Share2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";
import { TemplateQuickStart } from "@/components/optimizer/TemplateQuickStart";
import { PlatformTabs } from "@/components/optimizer/PlatformTabs";
import { OptimizationMetrics } from "@/components/optimizer/OptimizationMetrics";
import { OptimizationHistory, type HistoryEntry } from "@/components/optimizer/OptimizationHistory";
import { AdvancedOptions } from "@/components/optimizer/AdvancedOptions";
import { PromptComparison } from "@/components/optimizer/PromptComparison";

/* ─── Constants ─── */

const AI_PLATFORMS = [
  { id: "chatgpt", label: "ChatGPT", color: "bg-emerald-500", tip: "Best with structured instructions, numbered steps, and explicit output formats. Responds well to role prompts." },
  { id: "claude", label: "Claude", color: "bg-orange-500", tip: "Excels at nuanced reasoning. Use natural language, provide context generously, and ask it to think step-by-step." },
  { id: "gemini", label: "Gemini", color: "bg-blue-500", tip: "Strong at multimodal tasks. Be explicit about desired format and leverage its knowledge of Google ecosystem." },
  { id: "copilot", label: "Copilot", color: "bg-cyan-500", tip: "Optimized for code and productivity tasks. Reference specific languages, frameworks, and coding conventions." },
  { id: "deepseek", label: "DeepSeek", color: "bg-teal-500", tip: "Strong at technical and analytical tasks. Works well with detailed chain-of-thought prompting." },
  { id: "perplexity", label: "Perplexity", color: "bg-violet-500", tip: "Research-focused. Ask specific questions, request sources, and use it for fact-checking and exploration." },
  { id: "midjourney", label: "MidJourney", color: "bg-pink-500", tip: "Image generation. Use descriptive adjectives, specify style/medium/lighting, and include aspect ratio parameters." },
  { id: "stable-diffusion", label: "Stable Diffusion", color: "bg-amber-500", tip: "Use comma-separated tags, weight important terms with (parentheses), specify negative prompts, and include model-specific tokens." },
  { id: "qwen", label: "Qwen", color: "bg-indigo-500", tip: "Alibaba's multilingual model. Excels at Chinese and Southeast Asian languages. Great for e-commerce, cross-border trade, and Asian market content." },
  { id: "meta-ai", label: "Meta AI", color: "bg-sky-500", tip: "Built on Llama open-source models. Strong at conversational tasks, multilingual content, and social media-oriented prompts." },
  { id: "ernie", label: "Ernie Bot", color: "bg-red-500", tip: "Baidu's AI model dominant in China. Best for Chinese-language content, Baidu SEO, and mainland China market context." },
  { id: "grok", label: "Grok", color: "bg-slate-500", tip: "xAI's model with real-time knowledge. Direct, witty style. Good for current events, analysis, and unfiltered responses." },
];

export const OPTIMIZER_LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "zh", label: "中文 (Chinese)", flag: "🇨🇳" },
  { code: "ja", label: "日本語 (Japanese)", flag: "🇯🇵" },
  { code: "ko", label: "한국어 (Korean)", flag: "🇰🇷" },
  { code: "id", label: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "ms", label: "Bahasa Melayu", flag: "🇲🇾" },
  { code: "th", label: "ไทย (Thai)", flag: "🇹🇭" },
  { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
  { code: "hi", label: "हिन्दी (Hindi)", flag: "🇮🇳" },
  { code: "tl", label: "Tagalog", flag: "🇵🇭" },
  { code: "ta", label: "தமிழ் (Tamil)", flag: "🇱🇰" },
  { code: "bn", label: "বাংলা (Bengali)", flag: "🇧🇩" },
  { code: "km", label: "ភាសាខ្មែរ (Khmer)", flag: "🇰🇭" },
];

const PLATFORM_COMPARISON = {
  prompt: "Write a product description for a bubble tea brand targeting Gen Z in Southeast Asia",
  results: [
    { platform: "ChatGPT", color: "bg-emerald-500", output: "Write a 120-word product description for [bubble tea brand] targeting Gen Z consumers (18-25) in Singapore, Malaysia, and Indonesia. Tone: playful, emoji-friendly, social-media-native. Include: 1) catchy opening hook, 2) flavour highlight with local twist (e.g. gula melaka, taro), 3) Instagram-worthy visual cue, 4) FOMO-inducing CTA. Use casual Southeast Asian English slang where natural." },
    { platform: "Claude", color: "bg-orange-500", output: "I'd like you to craft a product description for a bubble tea brand. Context: the audience is Gen Z in Southeast Asia — they value authenticity, local flavours, and social sharing. Please consider cultural nuances across Singapore, Malaysia, and Indonesia. Think about what makes bubble tea culturally significant in these markets (study culture, social gathering, treat culture). Write in an authentic voice that doesn't feel like a Western brand trying to sound Asian." },
    { platform: "MidJourney", color: "bg-pink-500", output: "Aesthetic flat-lay photo of artisanal bubble tea, tapioca pearls visible through clear cup, Southeast Asian street market background, neon signage in Chinese and Malay, tropical flowers, warm golden hour lighting, Gen Z lifestyle photography, Instagram aesthetic, shot on Sony A7III, 35mm lens --ar 4:5 --v 6 --style raw" },
  ],
};

const POPULAR_ASIA = [
  { icon: ShoppingCart, label: "E-Commerce", desc: "Shopee, Lazada, Tokopedia product listings and ad copy", gradient: "from-orange-500 to-red-500" },
  { icon: Utensils, label: "Food & Delivery", desc: "GrabFood, GoFood, Foodpanda menu descriptions and promos", gradient: "from-green-500 to-emerald-500" },
  { icon: Landmark, label: "Fintech", desc: "GCash, OVO, GoPay onboarding flows and financial content", gradient: "from-blue-500 to-cyan-500" },
  { icon: GraduationCap, label: "EdTech", desc: "Ruangguru, Byju's, tutoring prompts in local languages", gradient: "from-violet-500 to-purple-500" },
];

const EXAMPLES = [
  { label: "Marketing Copy", original: "Write me a marketing email", optimized: "Write a 150-word marketing email for [product] targeting [audience]. Use a professional but friendly tone. Include: 1) attention-grabbing subject line, 2) one clear benefit, 3) social proof element, 4) specific call-to-action. Avoid: hype, jargon, multiple CTAs." },
  { label: "Data Analysis", original: "Analyse this data", optimized: "Analyse this sales data for trends. Specifically: 1) Identify top 3 performing products by revenue, 2) Note any seasonal patterns, 3) Flag anomalies or unexpected changes, 4) Suggest 2-3 actionable insights. Present findings in a table followed by 3 bullet points." },
  { label: "Image Generation", original: "Create an image of a sunset", optimized: "Create a photorealistic image of a sunset over the ocean. Style: dramatic lighting, vibrant oranges and purples, calm water with reflections. Composition: sun 1/3 from left edge, horizon at lower third. Include: silhouetted sailboat, wispy clouds. Exclude: people, buildings. Aspect ratio: 16:9." },
  { label: "Investor Pitch", original: "Help me pitch to investors", optimized: "Write a 3-minute investor pitch script for a [stage] startup in [industry]. Structure: Hook (10 sec) > Problem (30 sec) > Solution demo (45 sec) > Market size with TAM/SAM/SOM (30 sec) > Traction metrics (20 sec) > Ask (15 sec). Tone: confident, data-driven, founder-authentic. Regional context: Southeast Asia market." },
];

const FOCUS_OPTIONS = [
  { id: "clarity", label: "Clarity", desc: "Make instructions clearer" },
  { id: "specificity", label: "Specificity", desc: "Add helpful constraints" },
  { id: "structure", label: "Structure", desc: "Improve organisation" },
  { id: "context", label: "Context", desc: "Add relevant background" },
  { id: "output_format", label: "Output format", desc: "Specify desired format" },
];

const LOADING_STEPS = [
  "Analysing your prompt...",
  "Identifying improvements...",
  "Generating optimised version...",
];

function parseOptimizedPrompt(md: string): string {
  const match = md.match(/## OPTIMIZED PROMPT\s*\n([\s\S]*?)(?=\n## |$)/i);
  return match ? match[1].trim() : "";
}

function parseSection(md: string, heading: string): string {
  const regex = new RegExp(`## ${heading}\\s*\\n([\\s\\S]*?)(?=\\n## |$)`, "i");
  const match = md.match(regex);
  return match ? match[1].trim() : "";
}

/* ─── Main Component ─── */

const PromptOptimizer = () => {
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [searchParams] = useSearchParams();

  // Read ?lang= and ?platform= params for pre-selection
  const langParam = searchParams.get("lang");
  const platformParam = searchParams.get("platform");
  const initialLang = OPTIMIZER_LANGUAGES.find((l) => l.code === langParam)?.code || "en";
  const initialPlatform = AI_PLATFORMS.find((p) => p.id === platformParam)?.id || "chatgpt";

  const [prompt, setPrompt] = useState("");
  const [aiTool, setAiTool] = useState("");
  const [goal, setGoal] = useState("");
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [contextOpen, setContextOpen] = useState(false);

  const [selectedPlatform, setSelectedPlatform] = useState(initialPlatform);
  const [selectedLanguage, setSelectedLanguage] = useState(initialLang);
  const [asianContext, setAsianContext] = useState(initialLang !== "en");

  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showExample, setShowExample] = useState(false);
  const [exampleIdx, setExampleIdx] = useState(0);

  // Advanced options state
  const [advTone, setAdvTone] = useState("professional");
  const [advLength, setAdvLength] = useState("detailed");
  const [advIndustry, setAdvIndustry] = useState("technology");
  const [advOpen, setAdvOpen] = useState(false);

  // History sidebar state
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);

  const activePlatform = AI_PLATFORMS.find((p) => p.id === selectedPlatform)!;
  const activeLanguageObj = OPTIMIZER_LANGUAGES.find((l) => l.code === selectedLanguage)!;

  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(el.scrollHeight, 160)}px`;
  }, []);

  useEffect(autoResize, [prompt, autoResize]);

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setLoadingStep((s) => (s < LOADING_STEPS.length - 1 ? s + 1 : s));
    }, 3000);
    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && prompt.trim() && !isLoading) {
        e.preventDefault();
        optimize();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prompt, isLoading]);

  // Sync selectedPlatform → aiTool text field for the API
  useEffect(() => {
    setAiTool(activePlatform.label);
  }, [selectedPlatform]);

  const optimize = async () => {
    if (!prompt.trim()) return;
    setResult("");
    setIsLoading(true);
    setLoadingStep(0);
    setShowExample(false);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token
        ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uY3hzcG10cXZxZ3Z0cnhieHpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4MjI0NjUsImV4cCI6MjA3MDM5ODQ2NX0.UjglB_MtyXQgsAHbdWKk_sn2hSyOX9iPWIU8EOayn2M";

      // Build enhanced goal with language and Asian context
      let enhancedGoal = goal.trim() || "";
      if (selectedLanguage !== "en") {
        enhancedGoal += ` Output language: ${activeLanguageObj.label}.`;
      }
      if (asianContext) {
        enhancedGoal += " Apply Asian cultural context awareness: appropriate formality levels, honorifics where relevant, local business conventions, and regional market understanding.";
      }

      const resp = await fetch(
        `https://mncxspmtqvqgvtrxbxzb.supabase.co/functions/v1/optimize-prompt`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            prompt: prompt.trim(),
            aiTool: activePlatform.label,
            goal: enhancedGoal || undefined,
            focusAreas: focusAreas.length ? focusAreas : undefined,
          }),
        }
      );

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Optimisation failed" }));
        throw new Error(err.error || "Optimisation failed");
      }

      const reader = resp.body?.getReader();
      if (!reader) throw new Error("No stream");
      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIdx: number;
        while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIdx);
          buffer = buffer.slice(newlineIdx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullText += content;
              setResult(fullText);
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (err: any) {
      toast({ title: "Optimisation failed", description: err.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  // Add to history after successful optimization
  useEffect(() => {
    const parsed = parseOptimizedPrompt(result);
    if (parsed && prompt.trim() && !isLoading) {
      const ratio = Math.min(parsed.length / Math.max(prompt.length, 1), 5);
      const avgScore = Math.round(70 + ratio * 5);
      const entry: HistoryEntry = {
        id: Date.now().toString(),
        originalPrompt: prompt,
        platform: activePlatform.label,
        score: Math.min(avgScore, 96),
        timestamp: Date.now(),
      };
      setHistory((prev) => {
        // Prevent duplicate entries for same result
        if (prev.length > 0 && prev[0].originalPrompt === prompt) return prev;
        return [entry, ...prev].slice(0, 5);
      });
    }
  }, [isLoading]); // trigger when loading finishes

  const copyText = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({ title: "Copied to clipboard" });
  };

  const toggleFocus = (id: string) =>
    setFocusAreas((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));

  const reset = () => {
    setPrompt("");
    setResult("");
    setGoal("");
    setFocusAreas([]);
    setShowExample(false);
  };

  const loadExample = () => {
    const ex = EXAMPLES[exampleIdx];
    setPrompt(ex.original);
    setShowExample(true);
    setExampleIdx((i) => (i + 1) % EXAMPLES.length);
  };

  const optimizedPrompt = parseOptimizedPrompt(result);
  const keyImprovements = parseSection(result, "KEY IMPROVEMENTS");
  const explanation = parseSection(result, "EXPLANATION");
  const enhancements = parseSection(result, "OPTIONAL ENHANCEMENTS");
  const hasResult = !!optimizedPrompt;

  return (
    <>
      <SEO
        title="Free AI Prompt Optimizer | 12 Platforms, 12+ Asian Languages | PromptAndGo"
        description="Optimize prompts for ChatGPT, Claude, Gemini, Qwen, DeepSeek & 7 more platforms in 12+ Asian languages. Cultural context awareness for Japanese, Mandarin, Bahasa & more."
        canonical="https://promptandgo.ai/optimize"
        keywords="prompt optimizer, AI prompt improvement, prompt engineering tool, ChatGPT prompts, Claude prompts, Gemini prompts, Qwen prompts, Asian language AI, multilingual prompt optimization"
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-hero">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] rounded-full bg-accent/20 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] rounded-full bg-primary/15 blur-[100px]" />
        </div>
        <div className="relative z-10 container max-w-4xl mx-auto px-4 py-16 md:py-24 text-center">
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-primary/30 text-primary px-4 py-1.5 rounded-full text-sm font-bold">
              <Zap className="h-3.5 w-3.5" />
              12 AI Platforms
            </div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-amber-400/30 text-amber-300 px-4 py-1.5 rounded-full text-sm font-bold">
              <Globe className="h-3.5 w-3.5" />
              12+ Languages
            </div>
            <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/10 text-white/80 px-4 py-1.5 rounded-full text-sm">
              Free · No signup
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
            Optimize for any platform.
            <span className="text-gradient-brand block">In any language.</span>
          </h1>
          <p className="text-white/60 mt-5 text-lg max-w-xl mx-auto">
            Select your AI platform, choose your language, enable Asian cultural context — and watch Scout transform your prompt.
          </p>
        </div>
      </section>

      {/* Optimization History Sidebar */}
      <OptimizationHistory
        entries={history}
        isOpen={historyOpen}
        onToggle={() => setHistoryOpen(!historyOpen)}
        onReuse={(p) => {
          setPrompt(p);
          setHistoryOpen(false);
        }}
      />

      <section className="container max-w-4xl mx-auto px-4 py-10 space-y-8">

        {/* ═══ Template Quick Start ═══ */}
        <TemplateQuickStart onSelect={(p) => setPrompt(p)} />

        {/* ═══ Platform Selector ═══ */}
        <div>
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            Select your AI platform
          </h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2">
            {AI_PLATFORMS.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPlatform(p.id)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 text-center ${
                  selectedPlatform === p.id
                    ? "border-primary bg-primary/10 shadow-md shadow-primary/10"
                    : "border-border/50 bg-card hover:border-border hover:bg-muted/50"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg ${p.color} flex items-center justify-center`}>
                  <span className="text-white text-xs font-black">{p.label.slice(0, 2).toUpperCase()}</span>
                </div>
                <span className="text-[11px] font-medium leading-tight">{p.label}</span>
              </button>
            ))}
          </div>
          {/* Platform tip */}
          <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/15 text-sm text-muted-foreground flex gap-2">
            <Lightbulb className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
            <span><strong className="text-foreground">{activePlatform.label} tip:</strong> {activePlatform.tip}</span>
          </div>
        </div>

        {/* ═══ Language & Asian Context Row ═══ */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Language selector */}
          <div>
            <label className="block text-sm font-semibold mb-1.5 flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              Output language
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {OPTIMIZER_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* Asian Context Toggle */}
          <div>
            <label className="block text-sm font-semibold mb-1.5">Asian Context</label>
            <div
              className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${
                asianContext ? "border-amber-500/50 bg-amber-500/5" : "border-border/50 bg-card"
              }`}
              onClick={() => setAsianContext(!asianContext)}
            >
              <Switch checked={asianContext} onCheckedChange={setAsianContext} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">🌏 Cultural awareness</p>
                <p className="text-xs text-muted-foreground">Formality, honorifics, local business context</p>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ Prompt Input ═══ */}
        <Card className="border-2 border-primary/20">
          <CardContent className="p-6 space-y-5">
            <div>
              <label htmlFor="prompt-input" className="block text-sm font-semibold mb-1.5">
                Your prompt
              </label>
              <Textarea
                id="prompt-input"
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Paste or type your prompt here. Scout will analyse it and suggest improvements."
                className="min-h-[160px] resize-none text-base"
                onInput={autoResize}
              />
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-muted-foreground">{prompt.length} characters</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{activePlatform.label}</span>
                  <span>·</span>
                  <span>{activeLanguageObj.flag} {activeLanguageObj.label}</span>
                  {asianContext && <><span>·</span><span>🌏 Asian context</span></>}
                </div>
              </div>
            </div>

            <Collapsible open={contextOpen} onOpenChange={setContextOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
                  <Settings2 className="h-4 w-4" />
                  Add context (optional)
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${contextOpen ? "rotate-180" : ""}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 pt-3">
                <div>
                  <label className="block text-sm font-medium mb-1">What is your goal?</label>
                  <Textarea
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="e.g. Generate marketing copy for Shopee, analyse fintech data, create social media content for Indonesian audience"
                    className="min-h-[80px]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Focus areas</label>
                  <div className="flex flex-wrap gap-3">
                    {FOCUS_OPTIONS.map((opt) => (
                      <label key={opt.id} className="flex items-center gap-2 text-sm cursor-pointer">
                        <Checkbox
                          checked={focusAreas.includes(opt.id)}
                          onCheckedChange={() => toggleFocus(opt.id)}
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Advanced Options */}
            <AdvancedOptions
              tone={advTone}
              setTone={setAdvTone}
              outputLength={advLength}
              setOutputLength={setAdvLength}
              industry={advIndustry}
              setIndustry={setAdvIndustry}
              isOpen={advOpen}
              setIsOpen={setAdvOpen}
            />

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Shield className="h-3.5 w-3.5" />
              Your prompts are analysed in real time and never stored.
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={optimize} disabled={!prompt.trim() || isLoading} size="lg" className="gap-2">
                <Sparkles className="h-4 w-4" />
                {isLoading ? "Optimising..." : `Optimise for ${activePlatform.label}`}
              </Button>
              <Button variant="outline" onClick={loadExample} disabled={isLoading}>
                <Eye className="h-4 w-4 mr-1.5" />
                See an example
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Tip: press <kbd className="border rounded px-1 py-0.5 text-[10px]">Ctrl</kbd>+<kbd className="border rounded px-1 py-0.5 text-[10px]">Enter</kbd> to optimise</p>
          </CardContent>
        </Card>

        {/* Loading */}
        {isLoading && !result && (
          <Card>
            <CardContent className="p-6 space-y-4">
              {LOADING_STEPS.map((step, i) => (
                <div key={i} className={`flex items-center gap-3 transition-opacity ${i <= loadingStep ? "opacity-100" : "opacity-30"}`}>
                  {i < loadingStep ? (
                    <Check className="h-4 w-4 text-primary" />
                  ) : i === loadingStep ? (
                    <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                  ) : (
                    <div className="h-4 w-4" />
                  )}
                  <span className="text-sm">{step}</span>
                </div>
              ))}
              <Skeleton className="h-24 w-full mt-4" />
            </CardContent>
          </Card>
        )}

        {/* Example */}
        {showExample && !result && (
          <ExampleComparison example={EXAMPLES[(exampleIdx - 1 + EXAMPLES.length) % EXAMPLES.length]} onCopy={copyText} copiedId={copiedId} />
        )}

        {/* Results */}
        {hasResult && (
          <div className="space-y-6">
            {/* Prominent Copy & Share bar */}
            <div className="flex flex-wrap gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
              <Button onClick={() => copyText(optimizedPrompt, "opt-hero")} size="lg" className="gap-2 flex-1 sm:flex-none">
                {copiedId === "opt-hero" ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                {copiedId === "opt-hero" ? "Copied!" : "Copy Optimized Prompt"}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="gap-2"
                onClick={async () => {
                  const shareUrl = `${window.location.origin}/optimize?platform=${selectedPlatform}&lang=${selectedLanguage}`;
                  try {
                    if (navigator.share) {
                      await navigator.share({ title: `Optimized prompt for ${activePlatform.label}`, text: optimizedPrompt.slice(0, 200) + "...", url: shareUrl });
                    } else {
                      await navigator.clipboard.writeText(shareUrl);
                      toast({ title: "Share link copied!" });
                    }
                  } catch (e) {
                    if ((e as Error).name !== "AbortError") {
                      await navigator.clipboard.writeText(shareUrl);
                      toast({ title: "Share link copied!" });
                    }
                  }
                }}
              >
                <Share2 className="h-4 w-4" /> Share
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border-muted">
                <CardContent className="p-5 space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Original</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{prompt}</p>
                  <CopyBtn text={prompt} id="orig" copiedId={copiedId} onCopy={copyText} label="Copy original" />
                </CardContent>
              </Card>
              <Card className="border-primary/40 ring-1 ring-primary/20">
                <CardContent className="p-5 space-y-3">
                  <h3 className="text-sm font-semibold text-primary uppercase tracking-wide flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4" /> Optimised for {activePlatform.label}
                  </h3>
                  <p className="text-sm whitespace-pre-wrap">{optimizedPrompt}</p>
                  <CopyBtn text={optimizedPrompt} id="opt" copiedId={copiedId} onCopy={copyText} label="Copy optimised prompt" variant="default" />
                </CardContent>
              </Card>
            </div>

            {/* Optimization Metrics */}
            <OptimizationMetrics prompt={prompt} optimized={optimizedPrompt} />

            {/* Platform-Specific Tabs */}
            <PlatformTabs
              originalPrompt={prompt}
              optimizedPrompt={optimizedPrompt}
              copiedId={copiedId}
              onCopy={copyText}
            />

            {/* Educational optimization insights */}
            <Card className="border-blue-500/20 bg-blue-500/5">
              <CardContent className="p-5 space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-blue-500" />
                  Why Scout Made These Changes
                </h3>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex gap-2 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground"><strong className="text-foreground">Structure added:</strong> {activePlatform.label} performs better with numbered steps and clear sections.</p>
                  </div>
                  <div className="flex gap-2 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground"><strong className="text-foreground">Audience targeting:</strong> Specific context helps the AI generate more relevant output.</p>
                  </div>
                  <div className="flex gap-2 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground"><strong className="text-foreground">Constraints defined:</strong> Word limits, tone, and format prevent vague, unusable responses.</p>
                  </div>
                  {asianContext && (
                    <div className="flex gap-2 items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                      <p className="text-muted-foreground"><strong className="text-foreground">Cultural context:</strong> Formality, honorifics, and local business norms adapted for Asian audience.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Accordion type="multiple" defaultValue={["improvements"]}>
              {keyImprovements && (
                <AccordionItem value="improvements">
                  <AccordionTrigger className="text-base font-semibold">
                    <span className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Key improvements</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="prose prose-sm max-w-none text-foreground"><ReactMarkdown>{keyImprovements}</ReactMarkdown></div>
                  </AccordionContent>
                </AccordionItem>
              )}
              {explanation && (
                <AccordionItem value="explanation">
                  <AccordionTrigger className="text-base font-semibold">
                    <span className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" /> Detailed explanation</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="prose prose-sm max-w-none text-foreground"><ReactMarkdown>{explanation}</ReactMarkdown></div>
                  </AccordionContent>
                </AccordionItem>
              )}
              {enhancements && (
                <AccordionItem value="enhancements">
                  <AccordionTrigger className="text-base font-semibold">
                    <span className="flex items-center gap-2"><Lightbulb className="h-4 w-4 text-primary" /> Optional enhancements</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="prose prose-sm max-w-none text-foreground"><ReactMarkdown>{enhancements}</ReactMarkdown></div>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>

            {/* Translate to... dropdown */}
            <Card className="border-accent/30 bg-accent/5">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Languages className="h-4 w-4 text-accent" />
                    Translate to...
                  </div>
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value) {
                        setSelectedLanguage(e.target.value);
                        setAsianContext(true);
                        setPrompt(optimizedPrompt);
                        setTimeout(() => optimize(), 100);
                      }
                    }}
                    className="h-9 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Select a language...</option>
                    {OPTIMIZER_LANGUAGES.filter((l) => l.code !== "en").map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.label}
                      </option>
                    ))}
                  </select>
                  <span className="text-xs text-muted-foreground">Re-optimizes your prompt in the selected language</span>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-3">
              <Button variant="outline" asChild>
                <Link to="/scout" className="gap-2">
                  <ArrowRight className="h-4 w-4" /> Try in Scout AI
                </Link>
              </Button>
              <Button variant="ghost" onClick={reset} className="gap-2">
                <RotateCcw className="h-4 w-4" /> Optimise another
              </Button>
            </div>
          </div>
        )}

        {/* ═══ Platform Comparison Section ═══ */}
        <div className="pt-8 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2">Same Prompt, Different Platforms</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">
              See how the same idea gets optimized differently for each AI platform's unique strengths.
            </p>
          </div>

          <Card className="border-border/50 bg-muted/30">
            <CardContent className="p-6">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Original prompt</p>
              <p className="text-sm font-medium text-foreground mb-6">"{PLATFORM_COMPARISON.prompt}"</p>

              <div className="grid gap-4">
                {PLATFORM_COMPARISON.results.map((r) => (
                  <div key={r.platform} className="rounded-xl border border-border/50 bg-card p-5 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-md ${r.color} flex items-center justify-center`}>
                        <span className="text-white text-[9px] font-black">{r.platform.slice(0, 2).toUpperCase()}</span>
                      </div>
                      <span className="text-sm font-bold">{r.platform}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{r.output}</p>
                    <CopyBtn text={r.output} id={`cmp-${r.platform}`} copiedId={copiedId} onCopy={copyText} label="Copy" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ═══ Popular in Asia ═══ */}
        <div className="pt-8 space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 px-3 py-1.5 rounded-full text-xs font-bold mb-3">
              <TrendingUp className="h-3.5 w-3.5" />
              TRENDING IN ASIA
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2">Popular in Asian Markets</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">
              Top prompt categories used by professionals across Southeast Asia, East Asia, and South Asia.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {POPULAR_ASIA.map((cat) => (
              <div
                key={cat.label}
                className="group flex gap-4 p-5 rounded-xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-lg transition-all"
              >
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <cat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-base mb-1 group-hover:text-primary transition-colors">{cat.label}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{cat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Multilingual hint */}
        <Card className="bg-muted/50 border-muted">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <Globe className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Works in any language</h3>
                <p className="text-sm text-muted-foreground">
                  Write your prompt in English, Bahasa, Mandarin, Japanese, Korean, Thai, Vietnamese, Hindi, Tagalog, or any language. Scout will optimise it and keep it in your chosen output language. Perfect for multilingual teams across Asia-Pacific.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Platform Comparison Tool */}
      <section className="container max-w-4xl mx-auto px-4 pb-16">
        <PromptComparison />
      </section>
    </>
  );
};

/* ─── Sub-components ─── */

function CopyBtn({
  text, id, copiedId, onCopy, label, variant = "outline",
}: {
  text: string; id: string; copiedId: string | null; onCopy: (t: string, id: string) => void; label: string; variant?: "outline" | "default";
}) {
  return (
    <Button variant={variant} size="sm" className="gap-1.5" onClick={() => onCopy(text, id)}>
      {copiedId === id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copiedId === id ? "Copied!" : label}
    </Button>
  );
}

function ExampleComparison({
  example, onCopy, copiedId,
}: {
  example: (typeof EXAMPLES)[number]; onCopy: (t: string, id: string) => void; copiedId: string | null;
}) {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h3 className="font-semibold">Example: {example.label}</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase">Before</p>
            <p className="text-sm bg-muted/50 rounded-md p-3 text-muted-foreground">{example.original}</p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium text-primary uppercase">After</p>
            <p className="text-sm bg-primary/5 rounded-md p-3 border border-primary/20">{example.optimized}</p>
            <CopyBtn text={example.optimized} id="ex" copiedId={copiedId} onCopy={onCopy} label="Copy example" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default PromptOptimizer;
