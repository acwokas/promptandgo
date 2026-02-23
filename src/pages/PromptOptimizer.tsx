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
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import {
  Wand2, Copy, Check, ChevronDown, Shield, Sparkles, RotateCcw,
  ArrowRight, BookOpen, Lightbulb, Settings2, Eye, Zap, Globe,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

const EXAMPLES = [
  {
    label: "Marketing Copy",
    original: "Write me a marketing email",
    optimized: `Write a 150-word marketing email for [product] targeting [audience]. Use a professional but friendly tone. Include: 1) attention-grabbing subject line, 2) one clear benefit, 3) social proof element, 4) specific call-to-action. Avoid: hype, jargon, multiple CTAs.`,
  },
  {
    label: "Data Analysis",
    original: "Analyse this data",
    optimized: `Analyse this sales data for trends. Specifically: 1) Identify top 3 performing products by revenue, 2) Note any seasonal patterns, 3) Flag anomalies or unexpected changes, 4) Suggest 2-3 actionable insights. Present findings in a table followed by 3 bullet points.`,
  },
  {
    label: "Image Generation",
    original: "Create an image of a sunset",
    optimized: `Create a photorealistic image of a sunset over the ocean. Style: dramatic lighting, vibrant oranges and purples, calm water with reflections. Composition: sun 1/3 from left edge, horizon at lower third. Include: silhouetted sailboat, wispy clouds. Exclude: people, buildings. Aspect ratio: 16:9.`,
  },
  {
    label: "Investor Pitch",
    original: "Help me pitch to investors",
    optimized: `Write a 3-minute investor pitch script for a [stage] startup in [industry]. Structure: Hook (10 sec) > Problem (30 sec) > Solution demo (45 sec) > Market size with TAM/SAM/SOM (30 sec) > Traction metrics (20 sec) > Ask (15 sec). Tone: confident, data-driven, founder-authentic. Regional context: Southeast Asia market.`,
  },
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

const PromptOptimizer = () => {
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [prompt, setPrompt] = useState("");
  const [aiTool, setAiTool] = useState("");
  const [goal, setGoal] = useState("");
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [contextOpen, setContextOpen] = useState(false);

  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showExample, setShowExample] = useState(false);
  const [exampleIdx, setExampleIdx] = useState(0);

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

  const optimize = async () => {
    if (!prompt.trim()) return;
    setResult("");
    setIsLoading(true);
    setLoadingStep(0);
    setShowExample(false);

    try {
      const resp = await fetch(
        `https://mncxspmtqvqgvtrxbxzb.supabase.co/functions/v1/optimize-prompt`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uY3hzcG10cXZxZ3Z0cnhieHpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4MjI0NjUsImV4cCI6MjA3MDM5ODQ2NX0.UjglB_MtyXQgsAHbdWKk_sn2hSyOX9iPWIU8EOayn2M`,
          },
          body: JSON.stringify({
            prompt: prompt.trim(),
            aiTool: aiTool.trim() || undefined,
            goal: goal.trim() || undefined,
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
    setAiTool("");
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
        title="AI Prompt Optimiser | Make Any Prompt Better | PromptAndGo"
        description="Paste any prompt and get it optimised for ChatGPT, Claude, Gemini, or MidJourney in seconds. Free AI prompt optimiser by Scout. Built for Asia-Pacific professionals."
        canonical="https://promptandgo.ai/optimize"
        keywords="prompt optimiser, AI prompt improvement, prompt engineering tool, optimise prompts, ChatGPT prompts, Claude prompts"
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-hero">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] rounded-full bg-violet-500/20 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] rounded-full bg-blue-500/15 blur-[100px]" />
        </div>
        <div className="relative z-10 container max-w-4xl mx-auto px-4 py-16 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 text-white/90 px-4 py-1.5 rounded-full text-sm mb-6">
            <Zap className="h-3.5 w-3.5 text-yellow-400" />
            Free. No signup required.
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
            Make any prompt
            <span className="text-gradient-brand block">dramatically better.</span>
          </h1>
          <p className="text-white/60 mt-5 text-lg max-w-xl mx-auto">
            Paste your prompt. Scout analyses it, rewrites it, and tailors it to your AI platform. Takes about 15 seconds.
          </p>
        </div>
      </section>

      <section className="container max-w-4xl mx-auto px-4 py-10 space-y-8">
        {/* Input */}
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
              <p className="text-xs text-muted-foreground mt-1">{prompt.length} characters</p>
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
                  <label className="block text-sm font-medium mb-1">Which AI tool?</label>
                  <Input
                    value={aiTool}
                    onChange={(e) => setAiTool(e.target.value)}
                    placeholder="e.g. ChatGPT, Claude, Gemini, MidJourney"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">What is your goal?</label>
                  <Textarea
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="e.g. Generate marketing copy, analyse data, create an image"
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

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Shield className="h-3.5 w-3.5" />
              Your prompts are analysed in real time and never stored.
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={optimize} disabled={!prompt.trim() || isLoading} size="lg" className="gap-2">
                <Sparkles className="h-4 w-4" />
                {isLoading ? "Optimising..." : "Optimise my prompt"}
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
                    <Sparkles className="h-4 w-4" /> Optimised
                  </h3>
                  <p className="text-sm whitespace-pre-wrap">{optimizedPrompt}</p>
                  <CopyBtn text={optimizedPrompt} id="opt" copiedId={copiedId} onCopy={copyText} label="Copy optimised prompt" variant="default" />
                </CardContent>
              </Card>
            </div>

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

            <div className="flex flex-wrap gap-3">
              <Button onClick={() => copyText(optimizedPrompt, "opt-bottom")} className="gap-2">
                {copiedId === "opt-bottom" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                Copy optimised prompt
              </Button>
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

        {/* Multilingual hint */}
        <Card className="bg-muted/50 border-muted">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <Globe className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Works in any language</h3>
                <p className="text-sm text-muted-foreground">
                  Write your prompt in English, Bahasa, Mandarin, Malay, Vietnamese, or any language. Scout will optimise it and keep it in your original language. Perfect for multilingual teams across Asia-Pacific.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

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
