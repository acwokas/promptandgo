import { useState, useMemo, useRef, useEffect } from "react";
import SEO from "@/components/SEO";
import { Search, ChevronDown, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

/* ───── types ───── */
interface GlossaryEntry {
  term: string;
  category: string;
  pronunciation: string;
  translations: { ja: string; ko: string; zh: string; th: string; vi: string; id: string };
  example: string;
  related: string[];
}

/* ───── data ───── */
const CATEGORIES = ["All", "Core Concepts", "Training", "Architecture", "Safety", "Prompting"] as const;

const ENTRIES: GlossaryEntry[] = [
  { term: "Prompt", category: "Prompting", pronunciation: "/prɒmpt/", translations: { ja: "プロンプト", ko: "프롬프트", zh: "提示词", th: "พรอมต์", vi: "Lời nhắc", id: "Prompt" }, example: "Write a clear prompt to get better AI output.", related: ["Token", "Context Window"] },
  { term: "Token", category: "Core Concepts", pronunciation: "/ˈtoʊkən/", translations: { ja: "トークン", ko: "토큰", zh: "令牌", th: "โทเคน", vi: "Token", id: "Token" }, example: "GPT-4 supports up to 128K tokens.", related: ["Tokenizer", "Context Window"] },
  { term: "Model", category: "Core Concepts", pronunciation: "/ˈmɒdəl/", translations: { ja: "モデル", ko: "모델", zh: "模型", th: "โมเดล", vi: "Mô hình", id: "Model" }, example: "The model was trained on multilingual data.", related: ["Parameter", "Transformer"] },
  { term: "Fine-tuning", category: "Training", pronunciation: "/faɪn ˈtjuːnɪŋ/", translations: { ja: "ファインチューニング", ko: "파인튜닝", zh: "微调", th: "การปรับแต่ง", vi: "Tinh chỉnh", id: "Penyesuaian halus" }, example: "Fine-tuning on Japanese data improved keigo accuracy.", related: ["RLHF", "Overfitting"] },
  { term: "Embedding", category: "Architecture", pronunciation: "/ɪmˈbɛdɪŋ/", translations: { ja: "埋め込み", ko: "임베딩", zh: "嵌入", th: "เอ็มเบดดิง", vi: "Nhúng", id: "Embedding" }, example: "Embeddings capture semantic meaning of CJK characters.", related: ["Vector", "Latent Space"] },
  { term: "Hallucination", category: "Safety", pronunciation: "/həˌluːsɪˈneɪʃən/", translations: { ja: "ハルシネーション", ko: "환각", zh: "幻觉", th: "อาการหลอน", vi: "Ảo giác", id: "Halusinasi" }, example: "The model hallucinated a non-existent Japanese proverb.", related: ["Alignment", "Bias"] },
  { term: "Context Window", category: "Core Concepts", pronunciation: "/ˈkɒntekst ˈwɪndoʊ/", translations: { ja: "コンテキストウィンドウ", ko: "컨텍스트 윈도우", zh: "上下文窗口", th: "หน้าต่างบริบท", vi: "Cửa sổ ngữ cảnh", id: "Jendela konteks" }, example: "Longer context windows help with document translation.", related: ["Token", "Prompt"] },
  { term: "Temperature", category: "Prompting", pronunciation: "/ˈtɛmpərətʃər/", translations: { ja: "温度", ko: "온도", zh: "温度", th: "อุณหภูมิ", vi: "Nhiệt độ", id: "Temperatur" }, example: "Lower temperature gives more predictable Korean output.", related: ["Inference", "Zero-shot"] },
  { term: "Chain of Thought", category: "Prompting", pronunciation: "/tʃeɪn əv θɔːt/", translations: { ja: "思考の連鎖", ko: "사고의 연쇄", zh: "思维链", th: "ห่วงโซ่ความคิด", vi: "Chuỗi tư duy", id: "Rantai pemikiran" }, example: "Chain of thought prompting improved reasoning in Mandarin.", related: ["Prompt", "Zero-shot"] },
  { term: "RAG", category: "Architecture", pronunciation: "/ræɡ/", translations: { ja: "検索拡張生成", ko: "검색 증강 생성", zh: "检索增强生成", th: "RAG", vi: "Tạo tăng cường truy xuất", id: "Generasi diperkuat pencarian" }, example: "RAG grounds answers in verified multilingual sources.", related: ["Embedding", "Vector"] },
  { term: "Agent", category: "Core Concepts", pronunciation: "/ˈeɪdʒənt/", translations: { ja: "エージェント", ko: "에이전트", zh: "智能体", th: "เอเจนต์", vi: "Tác nhân", id: "Agen" }, example: "AI agents can book flights in multiple Asian languages.", related: ["Model", "Inference"] },
  { term: "Transformer", category: "Architecture", pronunciation: "/trænsˈfɔːrmər/", translations: { ja: "トランスフォーマー", ko: "트랜스포머", zh: "转换器", th: "ทรานส์ฟอร์เมอร์", vi: "Bộ biến đổi", id: "Transformer" }, example: "Transformers revolutionized CJK language processing.", related: ["Attention", "Encoder"] },
  { term: "Attention", category: "Architecture", pronunciation: "/əˈtɛnʃən/", translations: { ja: "注意機構", ko: "어텐션", zh: "注意力", th: "แอตเทนชัน", vi: "Cơ chế chú ý", id: "Perhatian" }, example: "Self-attention helps capture long-range dependencies in Thai.", related: ["Transformer", "Encoder"] },
  { term: "RLHF", category: "Training", pronunciation: "/ɑːr ɛl eɪtʃ ɛf/", translations: { ja: "人間のフィードバックによる強化学習", ko: "인간 피드백 강화학습", zh: "基于人类反馈的强化学习", th: "RLHF", vi: "Học tăng cường từ phản hồi con người", id: "RLHF" }, example: "RLHF aligned the model with Japanese cultural norms.", related: ["Fine-tuning", "Alignment"] },
  { term: "Inference", category: "Core Concepts", pronunciation: "/ˈɪnfərəns/", translations: { ja: "推論", ko: "추론", zh: "推理", th: "การอนุมาน", vi: "Suy luận", id: "Inferensi" }, example: "Inference latency affects real-time translation quality.", related: ["Model", "Quantization"] },
  { term: "Latent Space", category: "Architecture", pronunciation: "/ˈleɪtənt speɪs/", translations: { ja: "潜在空間", ko: "잠재 공간", zh: "潜在空间", th: "ปริภูมิแฝง", vi: "Không gian tiềm ẩn", id: "Ruang laten" }, example: "Similar Asian scripts cluster together in latent space.", related: ["Embedding", "Vector"] },
  { term: "Tokenizer", category: "Core Concepts", pronunciation: "/ˈtoʊkənaɪzər/", translations: { ja: "トークナイザー", ko: "토크나이저", zh: "分词器", th: "ตัวแบ่งโทเคน", vi: "Bộ mã hóa token", id: "Tokenizer" }, example: "CJK tokenizers handle character-level segmentation.", related: ["Token", "Encoder"] },
  { term: "Benchmark", category: "Training", pronunciation: "/ˈbɛntʃmɑːrk/", translations: { ja: "ベンチマーク", ko: "벤치마크", zh: "基准测试", th: "เกณฑ์มาตรฐาน", vi: "Điểm chuẩn", id: "Tolok ukur" }, example: "MMLU-JP is a key benchmark for Japanese AI models.", related: ["Model", "Parameter"] },
  { term: "Multimodal", category: "Core Concepts", pronunciation: "/ˌmʌltiˈmoʊdəl/", translations: { ja: "マルチモーダル", ko: "멀티모달", zh: "多模态", th: "มัลติโมดัล", vi: "Đa phương thức", id: "Multimodal" }, example: "Multimodal models can read Asian calligraphy from images.", related: ["Model", "Diffusion"] },
  { term: "Alignment", category: "Safety", pronunciation: "/əˈlaɪnmənt/", translations: { ja: "アラインメント", ko: "정렬", zh: "对齐", th: "การจัดตำแหน่ง", vi: "Sự liên kết", id: "Penyelarasan" }, example: "Alignment ensures culturally appropriate responses.", related: ["RLHF", "Bias"] },
  { term: "Bias", category: "Safety", pronunciation: "/baɪəs/", translations: { ja: "バイアス", ko: "편향", zh: "偏见", th: "อคติ", vi: "Thiên lệch", id: "Bias" }, example: "Western-centric bias can affect Asian language outputs.", related: ["Alignment", "Hallucination"] },
  { term: "Diffusion", category: "Architecture", pronunciation: "/dɪˈfjuːʒən/", translations: { ja: "拡散", ko: "확산", zh: "扩散", th: "การแพร่", vi: "Khuếch tán", id: "Difusi" }, example: "Diffusion models generate Asian calligraphy art.", related: ["Multimodal", "Encoder"] },
  { term: "Encoder", category: "Architecture", pronunciation: "/ɪnˈkoʊdər/", translations: { ja: "エンコーダー", ko: "인코더", zh: "编码器", th: "ตัวเข้ารหัส", vi: "Bộ mã hóa", id: "Encoder" }, example: "The encoder processes input text into representations.", related: ["Decoder", "Transformer"] },
  { term: "Decoder", category: "Architecture", pronunciation: "/diːˈkoʊdər/", translations: { ja: "デコーダー", ko: "디코더", zh: "解码器", th: "ตัวถอดรหัส", vi: "Bộ giải mã", id: "Decoder" }, example: "The decoder generates Korean text token by token.", related: ["Encoder", "Transformer"] },
  { term: "Gradient", category: "Training", pronunciation: "/ˈɡreɪdiənt/", translations: { ja: "勾配", ko: "기울기", zh: "梯度", th: "เกรเดียนต์", vi: "Gradient", id: "Gradien" }, example: "Gradient descent optimizes multilingual model weights.", related: ["Overfitting", "Parameter"] },
  { term: "Overfitting", category: "Training", pronunciation: "/ˌoʊvərˈfɪtɪŋ/", translations: { ja: "過学習", ko: "과적합", zh: "过拟合", th: "การเรียนรู้เกิน", vi: "Quá khớp", id: "Overfitting" }, example: "Overfitting on Japanese data reduced Korean accuracy.", related: ["Fine-tuning", "Gradient"] },
  { term: "Parameter", category: "Core Concepts", pronunciation: "/pəˈræmɪtər/", translations: { ja: "パラメータ", ko: "파라미터", zh: "参数", th: "พารามิเตอร์", vi: "Tham số", id: "Parameter" }, example: "Qwen has 72 billion parameters.", related: ["Model", "Quantization"] },
  { term: "Quantization", category: "Architecture", pronunciation: "/ˌkwɒntɪˈzeɪʃən/", translations: { ja: "量子化", ko: "양자화", zh: "量化", th: "การควอนไทซ์", vi: "Lượng tử hóa", id: "Kuantisasi" }, example: "Quantization makes large Asian language models run on edge devices.", related: ["Parameter", "Inference"] },
  { term: "Vector", category: "Architecture", pronunciation: "/ˈvɛktər/", translations: { ja: "ベクトル", ko: "벡터", zh: "向量", th: "เวกเตอร์", vi: "Vector", id: "Vektor" }, example: "Semantic vectors capture meaning across Asian languages.", related: ["Embedding", "Latent Space"] },
  { term: "Zero-shot", category: "Prompting", pronunciation: "/ˈzɪroʊ ʃɒt/", translations: { ja: "ゼロショット", ko: "제로샷", zh: "零样本", th: "ซีโร่ช็อต", vi: "Zero-shot", id: "Zero-shot" }, example: "Zero-shot translation works surprisingly well for Thai.", related: ["Chain of Thought", "Prompt"] },
];

const LANG_LABELS: Record<string, string> = { ja: "日本語", ko: "한국어", zh: "中文", th: "ไทย", vi: "Tiếng Việt", id: "Bahasa" };

const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

/* ───── component ───── */
const Glossary = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [suggestTerm, setSuggestTerm] = useState("");
  const stickyRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    let list = ENTRIES;
    if (category !== "All") list = list.filter((e) => e.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.term.toLowerCase().includes(q) ||
          Object.values(e.translations).some((t) => t.toLowerCase().includes(q))
      );
    }
    return list.sort((a, b) => a.term.localeCompare(b.term));
  }, [search, category]);

  const toggle = (term: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(term)) next.delete(term); else next.add(term);
      return next;
    });
  };

  const jumpTo = (letter: string) => {
    const el = document.getElementById(`glossary-${letter}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // group filtered by first letter
  const grouped = useMemo(() => {
    const map = new Map<string, GlossaryEntry[]>();
    for (const e of filtered) {
      const letter = e.term[0].toUpperCase();
      if (!map.has(letter)) map.set(letter, []);
      map.get(letter)!.push(e);
    }
    return map;
  }, [filtered]);

  return (
    <>
      <SEO
        title="AI Glossary — Every Term in Every Asian Language | PromptAndGo"
        description="Comprehensive glossary of 30 AI and machine learning terms with translations in Japanese, Korean, Mandarin, Thai, Vietnamese, and Indonesian."
        canonical="https://promptandgo.ai/glossary"
      />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-hero">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px]" />
          </div>
          <div className="relative z-10 container max-w-4xl mx-auto px-4 pt-20 pb-10 md:pt-28 md:pb-14 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight mb-4">
              AI Glossary
            </h1>
            <p className="text-lg text-white/60 max-w-xl mx-auto mb-8">
              Every term, every Asian language — from Prompt to Zero-shot
            </p>
            <div className="max-w-md mx-auto relative" ref={stickyRef}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search terms in any language…"
                className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/40 h-12 text-base"
                aria-label="Search glossary"
              />
            </div>
          </div>
        </section>

        {/* Jump nav + category filters */}
        <section className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border py-3">
          <div className="container max-w-5xl mx-auto px-4">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {ALPHA.map((l) => (
                <button
                  key={l}
                  onClick={() => jumpTo(l)}
                  className="w-7 h-7 rounded text-xs font-bold text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                >
                  {l}
                </button>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    category === c
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Entries */}
        <section className="py-10 md:py-16 bg-background">
          <div className="container max-w-5xl mx-auto px-4">
            {filtered.length === 0 && (
              <p className="text-center text-muted-foreground py-12">No terms found. Try a different search.</p>
            )}
            {ALPHA.map((letter) => {
              const group = grouped.get(letter);
              if (!group) return null;
              return (
                <div key={letter} id={`glossary-${letter}`} className="mb-8">
                  <h2 className="text-2xl font-black text-primary mb-4 sticky top-[88px] bg-background/95 backdrop-blur-sm py-1 z-10">
                    {letter}
                  </h2>
                  <div className="space-y-3">
                    {group.map((entry) => {
                      const isOpen = expanded.has(entry.term);
                      return (
                        <div key={entry.term} className="rounded-xl border border-border bg-card overflow-hidden">
                          <button
                            onClick={() => toggle(entry.term)}
                            aria-expanded={isOpen}
                            className="w-full flex items-center justify-between gap-4 p-4 md:p-5 text-left"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-foreground">{entry.term}</span>
                                <span className="text-xs text-muted-foreground font-mono">{entry.pronunciation}</span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{entry.category}</span>
                              </div>
                            </div>
                            <ChevronDown className={`h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                          </button>
                          {isOpen && (
                            <div className="px-4 pb-5 md:px-5 space-y-4 animate-fade-in">
                              {/* Translations */}
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {(Object.entries(entry.translations) as [string, string][]).map(([k, v]) => (
                                  <div key={k} className="rounded-lg bg-muted/30 px-3 py-2">
                                    <p className="text-[10px] text-muted-foreground">{LANG_LABELS[k]}</p>
                                    <p className="text-sm font-medium text-foreground">{v}</p>
                                  </div>
                                ))}
                              </div>
                              {/* Example */}
                              <div className="rounded-lg bg-primary/5 border border-primary/10 px-4 py-3">
                                <p className="text-xs text-primary font-semibold mb-1">Example</p>
                                <p className="text-sm text-foreground">{entry.example}</p>
                              </div>
                              {/* Related */}
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs text-muted-foreground">Related:</span>
                                {entry.related.map((r) => (
                                  <button
                                    key={r}
                                    onClick={() => { setSearch(r); setExpanded(new Set([r])); }}
                                    className="text-xs px-2 py-0.5 rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
                                  >
                                    {r}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Suggest a term */}
        <section className="bg-hero py-16 md:py-20">
          <div className="container max-w-xl mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Suggest a Term</h2>
            <p className="text-white/60 mb-6 text-sm">Missing an AI term? Let us know and we'll add it with Asian translations.</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (suggestTerm.trim().length < 2) { toast.error("Please enter a term."); return; }
                toast.success(`Thank you! "${suggestTerm}" has been submitted.`);
                setSuggestTerm("");
              }}
              className="flex gap-2"
            >
              <Input
                value={suggestTerm}
                onChange={(e) => setSuggestTerm(e.target.value)}
                placeholder="Enter an AI term…"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                aria-label="Suggest a glossary term"
              />
              <Button type="submit" className="gap-1"><Send className="h-4 w-4" /> Submit</Button>
            </form>
          </div>
        </section>
      </main>
    </>
  );
};

export default Glossary;
