import { useState, useRef, useEffect } from "react";

const PLATFORMS = [
  { id: "chatgpt",  label: "ChatGPT" },
  { id: "claude",   label: "Claude" },
  { id: "gemini",   label: "Gemini" },
  { id: "mistral",  label: "Mistral" },
  { id: "grok",     label: "Grok" },
  { id: "deepseek", label: "DeepSeek" },
  { id: "qwen",     label: "Qwen" },
  { id: "ernie",    label: "Ernie Bot" },
  { id: "midjourney", label: "MidJourney" },
];

const LANGS = [
  { code: "en", label: "English" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
  { code: "zh", label: "中文" },
  { code: "th", label: "ไทย" },
  { code: "vi", label: "Tiếng Việt" },
  { code: "id", label: "Bahasa Indonesia" },
];

// One-liner tips: "Best for [factual reason]" per platform per language.
// Kept short (≤90 chars) so it fits on one row above the button.
const MODEL_TIPS: Record<string, Record<string, string>> = {
  chatgpt: {
    en: "Best for everyday tasks, broad general knowledge, and natural conversation.",
    ja: "日常的なタスク、幅広い一般知識、自然な会話に最適です。",
    ko: "일상적인 작업, 폭넓은 일반 지식, 자연스러운 대화에 가장 적합합니다.",
    zh: "最适合日常任务、广泛的常识和自然对话。",
    th: "เหมาะที่สุดสำหรับงานทั่วไป ความรู้กว้าง และบทสนทนาเป็นธรรมชาติ",
    vi: "Tốt nhất cho công việc hàng ngày, kiến thức tổng quát rộng và trò chuyện tự nhiên.",
    id: "Terbaik untuk tugas sehari-hari, pengetahuan umum luas, dan percakapan natural.",
  },
  claude: {
    en: "Best for long-form writing, nuanced reasoning, and careful analysis.",
    ja: "長文ライティング、ニュアンスのある推論、慎重な分析に最適です。",
    ko: "장문 글쓰기, 섬세한 추론, 신중한 분석에 가장 적합합니다.",
    zh: "最适合长文写作、细致推理和深入分析。",
    th: "เหมาะที่สุดสำหรับการเขียนยาว การให้เหตุผลละเอียด และการวิเคราะห์รอบคอบ",
    vi: "Tốt nhất cho viết dài, lập luận tinh tế và phân tích cẩn thận.",
    id: "Terbaik untuk tulisan panjang, penalaran mendalam, dan analisis cermat.",
  },
  gemini: {
    en: "Best for multimodal tasks combining text, images, and Google ecosystem data.",
    ja: "テキスト、画像、Googleエコシステムを組み合わせたマルチモーダルタスクに最適です。",
    ko: "텍스트, 이미지, Google 생태계 데이터를 결합한 멀티모달 작업에 가장 적합합니다.",
    zh: "最适合结合文本、图像和 Google 生态数据的多模态任务。",
    th: "เหมาะที่สุดสำหรับงานหลายรูปแบบที่รวมข้อความ ภาพ และข้อมูลจาก Google",
    vi: "Tốt nhất cho tác vụ đa phương thức kết hợp văn bản, hình ảnh và dữ liệu Google.",
    id: "Terbaik untuk tugas multimodal menggabungkan teks, gambar, dan data ekosistem Google.",
  },
  mistral: {
    en: "Best for fast, cost-efficient European and multilingual tasks.",
    ja: "高速・低コストなヨーロッパ言語および多言語タスクに最適です。",
    ko: "빠르고 비용 효율적인 유럽 및 다국어 작업에 가장 적합합니다.",
    zh: "最适合快速、低成本的欧洲及多语言任务。",
    th: "เหมาะที่สุดสำหรับงานยุโรปและหลายภาษาที่รวดเร็วและคุ้มค่า",
    vi: "Tốt nhất cho các tác vụ châu Âu và đa ngôn ngữ nhanh, hiệu quả về chi phí.",
    id: "Terbaik untuk tugas Eropa dan multibahasa yang cepat dan hemat biaya.",
  },
  grok: {
    en: "Best for real-time X/Twitter context and current news with humour.",
    ja: "リアルタイムのX/Twitter情報や最新ニュースにユーモアを交えるのに最適です。",
    ko: "실시간 X/Twitter 맥락과 유머가 있는 최신 뉴스에 가장 적합합니다.",
    zh: "最适合实时 X/Twitter 上下文以及带幽默感的时事新闻。",
    th: "เหมาะที่สุดสำหรับบริบทจาก X/Twitter แบบเรียลไทม์และข่าวล่าสุดสไตล์ขำขัน",
    vi: "Tốt nhất cho ngữ cảnh X/Twitter thời gian thực và tin tức nóng có tính hài hước.",
    id: "Terbaik untuk konteks X/Twitter real-time dan berita terkini dengan humor.",
  },
  deepseek: {
    en: "Best for coding, math, and STEM reasoning at very low cost.",
    ja: "非常に低コストでコーディング、数学、STEM推論に最適です。",
    ko: "매우 저렴한 비용으로 코딩, 수학, STEM 추론에 가장 적합합니다.",
    zh: "最适合以极低成本完成编程、数学和理工推理任务。",
    th: "เหมาะที่สุดสำหรับการเขียนโค้ด คณิตศาสตร์ และการให้เหตุผล STEM ในต้นทุนต่ำมาก",
    vi: "Tốt nhất cho lập trình, toán học và lập luận STEM với chi phí rất thấp.",
    id: "Terbaik untuk koding, matematika, dan penalaran STEM dengan biaya sangat rendah.",
  },
  qwen: {
    en: "Best for Chinese-language tasks and broader Asian multilingual content.",
    ja: "中国語タスクおよびアジア圏の多言語コンテンツに最適です。",
    ko: "중국어 작업 및 아시아권 다국어 콘텐츠에 가장 적합합니다.",
    zh: "最适合中文任务以及亚洲多语言内容。",
    th: "เหมาะที่สุดสำหรับงานภาษาจีนและเนื้อหาเอเชียหลายภาษา",
    vi: "Tốt nhất cho tác vụ tiếng Trung và nội dung đa ngôn ngữ châu Á rộng hơn.",
    id: "Terbaik untuk tugas berbahasa Mandarin dan konten multibahasa Asia yang lebih luas.",
  },
  ernie: {
    en: "Best for Chinese-market business content with mainland compliance baked in.",
    ja: "中国本土の規制に準拠した中国市場向けビジネスコンテンツに最適です。",
    ko: "중국 본토 규정 준수가 내장된 중국 시장 비즈니스 콘텐츠에 가장 적합합니다.",
    zh: "最适合面向中国市场、内置大陆合规要求的商业内容。",
    th: "เหมาะที่สุดสำหรับเนื้อหาธุรกิจตลาดจีนที่ปฏิบัติตามข้อกำหนดของจีนแผ่นดินใหญ่",
    vi: "Tốt nhất cho nội dung kinh doanh thị trường Trung Quốc với tuân thủ đại lục tích hợp.",
    id: "Terbaik untuk konten bisnis pasar Tiongkok dengan kepatuhan daratan terintegrasi.",
  },
  midjourney: {
    en: "Best for high-quality image generation with cinematic, artistic style.",
    ja: "映画のような芸術的スタイルの高品質画像生成に最適です。",
    ko: "영화적이고 예술적인 스타일의 고품질 이미지 생성에 가장 적합합니다.",
    zh: "最适合具有电影般艺术风格的高质量图像生成。",
    th: "เหมาะที่สุดสำหรับการสร้างภาพคุณภาพสูงในสไตล์ภาพยนตร์และศิลปะ",
    vi: "Tốt nhất cho tạo ảnh chất lượng cao với phong cách điện ảnh và nghệ thuật.",
    id: "Terbaik untuk menghasilkan gambar berkualitas tinggi dengan gaya sinematik dan artistik.",
  },
};

const SUPABASE_URL = (import.meta as any).env?.PUBLIC_SUPABASE_URL || "https://dkdakwyrqyfdkyukqmqs.supabase.co";
const SUPABASE_ANON = (import.meta as any).env?.PUBLIC_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrZGFrd3lycXlmZGt5dWtxbXFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwMjI3ODEsImV4cCI6MjA5MzU5ODc4MX0.S-qUEvo5Xapb3h8CfEta0bDvYesAOTV_oUnnFpFb7Tc";

export default function OptimizerForm() {
  const [prompt, setPrompt] = useState("");
  const [tool, setTool] = useState("chatgpt");
  const [lang, setLang] = useState("en");
  const [goal, setGoal] = useState("");
  const [output, setOutput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // Pre-fill from URL params if user came from a prompt detail page
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const initialPrompt = params.get("prompt");
    const initialTitle = params.get("title");
    const initialCategory = params.get("category");
    if (initialPrompt) setPrompt(initialPrompt);
    if (initialTitle && initialCategory) {
      setGoal(`Optimise "${initialTitle}" (${initialCategory}) for the chosen platform.`);
    } else if (initialTitle) {
      setGoal(`Optimise: ${initialTitle}`);
    }
  }, []);

  async function optimize(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;
    setError(null);
    setOutput("");
    setBusy(true);
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    const langLabel = LANGS.find(l => l.code === lang)?.label || "English";
    const platformLabel = PLATFORMS.find(p => p.id === tool)?.label || tool;

    // Always force the output language by stuffing it into both targetLanguage AND goal,
    // so it works whether the edge function has been updated to read targetLanguage or not.
    const languageDirective = lang === "en"
      ? ""
      : `IMPORTANT: Write the entire optimised prompt and explanation in ${langLabel}. Only the section headings (## OPTIMIZED PROMPT etc.) stay in English.`;
    const combinedGoal = [goal.trim(), languageDirective].filter(Boolean).join(" ");

    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/optimize-prompt`, {
        method: "POST",
        signal: ac.signal,
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_ANON,
          "Authorization": `Bearer ${SUPABASE_ANON}`,
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          aiTool: platformLabel,
          targetLanguage: langLabel,
          goal: combinedGoal,
          focusAreas: [],
        }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `Request failed (${res.status})`);
      }
      if (!res.body) throw new Error("No response body");

      // Stream SSE
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;
          try {
            const j = JSON.parse(data);
            const tok = j?.choices?.[0]?.delta?.content;
            if (tok) setOutput(prev => prev + tok);
          } catch {}
        }
      }
    } catch (err: any) {
      if (err.name !== "AbortError") setError(err.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  function copyOutput() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  // The tip falls back to English if a translation is missing for that lang code.
  const tip = MODEL_TIPS[tool]?.[lang] || MODEL_TIPS[tool]?.en || "";

  return (
    <div className="rounded-3xl border border-border/60 bg-card overflow-hidden shadow-brand">
      <form onSubmit={optimize} className="p-5 md:p-7">
        <label htmlFor="prompt" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Your prompt
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Write a polite follow-up email to a Japanese client about a proposal."
          rows={5}
          className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm md:text-base resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
        />
        <div className="mt-1.5 flex items-center justify-between text-xs text-muted-foreground">
          <span>{prompt.length}/10,000</span>
          {prompt && <button type="button" onClick={() => setPrompt("")} className="hover:text-foreground">Clear</button>}
        </div>

        <div className="mt-5 grid sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">For platform</label>
            <select value={tool} onChange={(e) => setTool(e.target.value)} className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 h-11 text-sm">
              {PLATFORMS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">In language</label>
            <select value={lang} onChange={(e) => setLang(e.target.value)} className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 h-11 text-sm">
              {LANGS.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Goal (optional)</label>
            <input
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. respectful B2B email"
              className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 h-11 text-sm"
            />
          </div>
        </div>

        {tip && (
          <p className="mt-4 text-sm text-muted-foreground italic" aria-live="polite">
            <span className="not-italic">💡</span> {tip}
          </p>
        )}

        <div className="mt-4 flex items-center gap-3">
          <button
            type="submit"
            disabled={busy || !prompt.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-brand text-white px-6 h-12 font-semibold shadow-brand hover:shadow-brand-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {busy ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin"></span>
                Optimising…
              </>
            ) : (
              <>
                ✨ Optimise prompt
              </>
            )}
          </button>
          {busy && (
            <button type="button" onClick={() => abortRef.current?.abort()} className="text-sm text-muted-foreground hover:text-foreground">
              Cancel
            </button>
          )}
        </div>
      </form>

      {(output || error) && (
        <div className="border-t border-border/50 bg-gradient-brand-soft p-5 md:p-7">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {error ? "Error" : "Optimised"}
            </span>
            {output && !error && (
              <button onClick={copyOutput} className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
                {copied ? "✓ Copied" : "Copy"}
              </button>
            )}
          </div>
          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : (
            <pre className="text-sm md:text-base whitespace-pre-wrap font-sans leading-relaxed">{output}</pre>
          )}
        </div>
      )}
    </div>
  );
}
