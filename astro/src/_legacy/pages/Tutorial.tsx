import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  ChevronRight, ChevronLeft, Copy, Heart, Share2,
  RotateCcw, BookOpen, Sparkles,
} from "lucide-react";

/* ───── data ───── */
const LANGUAGES = [
  { id: "ja", label: "Japanese", flag: "🇯🇵", native: "日本語" },
  { id: "ko", label: "Korean", flag: "🇰🇷", native: "한국어" },
  { id: "zh", label: "Mandarin", flag: "🇨🇳", native: "中文" },
  { id: "th", label: "Thai", flag: "🇹🇭", native: "ภาษาไทย" },
  { id: "vi", label: "Vietnamese", flag: "🇻🇳", native: "Tiếng Việt" },
  { id: "id", label: "Indonesian", flag: "🇮🇩", native: "Bahasa Indonesia" },
  { id: "hi", label: "Hindi", flag: "🇮🇳", native: "हिन्दी" },
  { id: "ta", label: "Tamil", flag: "🇮🇳", native: "தமிழ்" },
  { id: "ms", label: "Bahasa Malay", flag: "🇲🇾", native: "Bahasa Melayu" },
  { id: "tl", label: "Tagalog", flag: "🇵🇭", native: "Tagalog" },
  { id: "km", label: "Khmer", flag: "🇰🇭", native: "ខ្មែរ" },
  { id: "my", label: "Burmese", flag: "🇲🇲", native: "ဗမာစာ" },
];

const CONTEXTS = ["Business", "Casual", "Academic", "Creative", "Technical"] as const;
type Context = (typeof CONTEXTS)[number];

const CONTEXT_EXAMPLES: Record<string, Record<Context, string>> = {
  ja: { Business: "お世話になっております。", Casual: "やっほー！元気？", Academic: "本研究では…", Creative: "月が綺麗ですね。", Technical: "このAPIは…" },
  ko: { Business: "안녕하세요, 담당자님.", Casual: "야, 뭐 해?", Academic: "본 논문에서는…", Creative: "달이 참 예쁘다.", Technical: "이 API는…" },
  zh: { Business: "您好，请问…", Casual: "嘿！最近怎么样？", Academic: "本文旨在…", Creative: "月色真美。", Technical: "该API支持…" },
  th: { Business: "สวัสดีครับ/ค่ะ", Casual: "ว่าไง!", Academic: "ในงานวิจัยนี้…", Creative: "คืนนี้พระจันทร์สวยมาก", Technical: "API นี้รองรับ…" },
  vi: { Business: "Kính gửi Quý khách,", Casual: "Ê, khỏe không?", Academic: "Nghiên cứu này…", Creative: "Đêm nay trăng đẹp quá.", Technical: "API này hỗ trợ…" },
  id: { Business: "Dengan hormat,", Casual: "Hei, apa kabar?", Academic: "Penelitian ini…", Creative: "Bulan malam ini indah.", Technical: "API ini mendukung…" },
  hi: { Business: "नमस्ते, महोदय।", Casual: "अरे! क्या हाल?", Academic: "इस शोध में…", Creative: "चाँद कितना सुंदर है।", Technical: "यह API…" },
  ta: { Business: "வணக்கம் ஐயா.", Casual: "டா, என்ன பண்ற?", Academic: "இந்த ஆராய்ச்சியில்…", Creative: "நிலவு அழகாக உள்ளது.", Technical: "இந்த API…" },
  ms: { Business: "Tuan/Puan yang dihormati,", Casual: "Eh, apa khabar?", Academic: "Kajian ini…", Creative: "Bulan malam ini cantik.", Technical: "API ini menyokong…" },
  tl: { Business: "Magandang araw po.", Casual: "Uy, kamusta?", Academic: "Sa pag-aaral na ito…", Creative: "Ang ganda ng buwan.", Technical: "Ang API na ito…" },
  km: { Business: "សូមគោរព", Casual: "សួស្តី! សុខសប្បាយទេ?", Academic: "ការស្រាវជ្រាវនេះ…", Creative: "ព្រះចន្ទស្អាតណាស់។", Technical: "API នេះ…" },
  my: { Business: "မင်္ဂလာပါ", Casual: "ဟေ့! ဘယ်လိုလဲ?", Academic: "ဤသုတေသနတွင်…", Creative: "လကလှလိုက်တာ။", Technical: "ဤ API သည်…" },
};

const TEMPLATES = [
  { id: "translate", label: "Translation", desc: "Translate text with cultural nuance" },
  { id: "tone", label: "Tone Adjustment", desc: "Switch formal/informal registers" },
  { id: "grammar", label: "Grammar Check", desc: "Fix grammar in Asian languages" },
  { id: "cultural", label: "Cultural Adaptation", desc: "Adapt content for local culture" },
  { id: "formal", label: "Formal/Informal Switch", desc: "Convert between politeness levels" },
  { id: "idiom", label: "Idiom Explanation", desc: "Explain Asian idioms in context" },
];

const CELEBRATIONS = [
  "おめでとう！", "축하합니다!", "恭喜你!", "ยินดีด้วย!", "Chúc mừng!", "Selamat!",
  "बधाई हो!", "வாழ்த்துக்கள்!", "Tahniah!", "Congratulations!",
];

const TOTAL_STEPS = 6;

/* ───── component ───── */
const Tutorial = () => {
  const [step, setStep] = useState(0);
  const [lang, setLang] = useState("ja");
  const [context, setContext] = useState<Context>("Business");
  const [template, setTemplate] = useState("translate");
  const [customPrompt, setCustomPrompt] = useState("");
  const [done, setDone] = useState(false);

  const selectedLang = LANGUAGES.find((l) => l.id === lang)!;

  const buildPrompt = useCallback(() => {
    const t = TEMPLATES.find((t) => t.id === template)!;
    return `[${t.label}] In ${selectedLang.label} (${context} tone):\n${customPrompt || `Please ${t.desc.toLowerCase()} for the following text…`}`;
  }, [lang, context, template, customPrompt, selectedLang]);

  const next = () => {
    if (step === TOTAL_STEPS - 1) {
      setDone(true);
      return;
    }
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const copyPrompt = () => {
    navigator.clipboard.writeText(buildPrompt());
    toast.success("Prompt copied!");
  };
  const savePrompt = () => {
    const saved = JSON.parse(localStorage.getItem("pag_tutorial_saved") || "[]") as string[];
    saved.push(buildPrompt());
    localStorage.setItem("pag_tutorial_saved", JSON.stringify(saved));
    toast.success("Saved to favorites!");
  };

  const restart = () => { setStep(0); setDone(false); };

  /* ───── render steps ───── */
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Step 1: Choose Your Language</h2>
            <p className="text-white/60 mb-6">Select the Asian language you want to work with.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {LANGUAGES.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLang(l.id)}
                  className={`rounded-xl border p-4 text-left transition-all ${
                    lang === l.id
                      ? "border-primary bg-primary/10 ring-2 ring-primary/50"
                      : "border-white/10 bg-white/5 hover:border-white/30"
                  }`}
                >
                  <span className="text-2xl">{l.flag}</span>
                  <p className="text-sm font-semibold text-white mt-2">{l.label}</p>
                  <p className="text-xs text-white/50">{l.native}</p>
                </button>
              ))}
            </div>
          </div>
        );
      case 1:
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Step 2: Set Your Context</h2>
            <p className="text-white/60 mb-6">What register or tone do you need?</p>
            <div className="space-y-3 max-w-md">
              {CONTEXTS.map((c) => (
                <label
                  key={c}
                  className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-all ${
                    context === c ? "border-primary bg-primary/10" : "border-white/10 bg-white/5 hover:border-white/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="context"
                    checked={context === c}
                    onChange={() => setContext(c)}
                    className="accent-primary"
                  />
                  <div>
                    <p className="text-white font-medium">{c}</p>
                    <p className="text-xs text-white/50 mt-0.5">
                      {CONTEXT_EXAMPLES[lang]?.[c] || "Example sentence…"}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Step 3: Pick a Template</h2>
            <p className="text-white/60 mb-6">Choose a prompt template to start with.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={`rounded-xl border p-5 text-left transition-all ${
                    template === t.id
                      ? "border-primary bg-primary/10 ring-2 ring-primary/50"
                      : "border-white/10 bg-white/5 hover:border-white/30"
                  }`}
                >
                  <p className="font-semibold text-white">{t.label}</p>
                  <p className="text-xs text-white/50 mt-1">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Step 4: Customize Your Prompt</h2>
            <p className="text-white/60 mb-6">Edit the prompt template or write your own.</p>
            <Textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder={`e.g. Translate this marketing copy into ${selectedLang.label} with a ${context.toLowerCase()} tone…`}
              rows={5}
              className="bg-white/5 border-white/20 text-white placeholder:text-white/30 mb-4"
            />
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-white/40 mb-1">Live preview</p>
              <pre className="text-sm text-white/80 whitespace-pre-wrap font-mono">{buildPrompt()}</pre>
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Step 5: Preview &amp; Refine</h2>
            <p className="text-white/60 mb-6">See your prompt and the expected AI output side by side.</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs text-primary font-semibold mb-2">Your Prompt</p>
                <pre className="text-sm text-white/80 whitespace-pre-wrap font-mono">{buildPrompt()}</pre>
              </div>
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
                <p className="text-xs text-primary font-semibold mb-2">Expected AI Output (mock)</p>
                <p className="text-sm text-white/70 leading-relaxed">
                  The AI would produce a {context.toLowerCase()}-register {selectedLang.label} output using the "{TEMPLATES.find((t) => t.id === template)?.label}" template with culturally appropriate phrasing and idioms…
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-xs text-white/40">Try variations:</span>
              {["More formal", "Shorter version", "Add examples"].map((v) => (
                <button
                  key={v}
                  onClick={() => toast.info(`Variation: "${v}" — coming soon!`)}
                  className="text-xs px-3 py-1 rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors"
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Step 6: Save &amp; Share</h2>
            <p className="text-white/60 mb-6">Your prompt is ready. Copy, save, or share it.</p>
            <div className="rounded-xl border border-white/10 bg-white/5 p-5 mb-6">
              <pre className="text-sm text-white/80 whitespace-pre-wrap font-mono">{buildPrompt()}</pre>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={copyPrompt} className="gap-2"><Copy className="h-4 w-4" /> Copy Prompt</Button>
              <Button onClick={savePrompt} variant="outline" className="gap-2 border-white/20 text-white hover:bg-white/10"><Heart className="h-4 w-4" /> Save to Favorites</Button>
              <Button
                variant="outline"
                className="gap-2 border-white/20 text-white hover:bg-white/10"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied!");
                }}
              >
                <Share2 className="h-4 w-4" /> Share Link
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  /* ───── done state ───── */
  if (done) {
    return (
      <>
        <SEO title="Tutorial Complete — PromptAndGo" description="You've mastered Asian language prompts!" noindex />
        <main className="min-h-[80vh] bg-hero flex items-center">
          <div className="container max-w-2xl mx-auto px-4 py-20 text-center">
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">You're now a Prompt Master!</h1>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {CELEBRATIONS.map((c, i) => (
                <span key={i} className="px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium">
                  {c}
                </span>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={restart} variant="outline" className="gap-2 border-white/20 text-white hover:bg-white/10">
                <RotateCcw className="h-4 w-4" /> Start Over
              </Button>
              <Button asChild className="gap-2">
                <Link to="/library"><BookOpen className="h-4 w-4" /> Explore Prompts</Link>
              </Button>
            </div>
          </div>
        </main>
      </>
    );
  }

  /* ───── main ───── */
  return (
    <>
      <SEO
        title="Interactive Prompt Tutorial — PromptAndGo"
        description="Master Asian language prompts in 5 minutes with our step-by-step interactive tutorial for Japanese, Korean, Mandarin, Thai, and more."
        canonical="https://promptandgo.ai/tutorial"
      />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-hero">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px]" />
          </div>
          <div className="relative z-10 container max-w-4xl mx-auto px-4 pt-16 pb-8 md:pt-24 md:pb-10 text-center">
            {/* Progress ring */}
            <div className="mx-auto w-20 h-20 mb-4 relative">
              <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                <circle cx="40" cy="40" r="34" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" opacity={0.2} />
                <circle
                  cx="40" cy="40" r="34" fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 34}`}
                  strokeDashoffset={`${2 * Math.PI * 34 * (1 - (step + 1) / TOTAL_STEPS)}`}
                  className="transition-all duration-500"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
                {step + 1}/{TOTAL_STEPS}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-2">
              Master Asian Language Prompts
            </h1>
            <p className="text-white/60">Complete this 5-minute interactive tutorial</p>
          </div>
        </section>

        {/* Progress bar */}
        <div className="bg-hero border-b border-white/10">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Step content */}
        <section className="bg-hero min-h-[50vh] py-10 md:py-14">
          <div className="container max-w-4xl mx-auto px-4">
            {renderStep()}

            {/* Nav */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/10">
              <Button
                onClick={back}
                disabled={step === 0}
                variant="outline"
                className="gap-1 border-white/20 text-white hover:bg-white/10 disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </Button>
              <button
                onClick={() => { setStep(TOTAL_STEPS - 1); }}
                className="text-xs text-white/40 hover:text-white/70 transition-colors"
              >
                Skip
              </button>
              <Button onClick={next} className="gap-1">
                {step === TOTAL_STEPS - 1 ? "Finish" : "Next"} <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Tutorial;
