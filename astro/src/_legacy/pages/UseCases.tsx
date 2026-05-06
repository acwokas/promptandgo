import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Mail, GraduationCap, ShoppingCart, Headphones, Globe, FileText, Code, Users, ArrowRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const INDUSTRIES = ["All", "Business", "Education", "E-commerce", "Government", "Technology", "Creative"] as const;

interface UseCase {
  icon: React.ElementType;
  title: string;
  tags: string[];
  industry: string;
  before: string;
  after: string;
  desc: string;
}

const USE_CASES: UseCase[] = [
  { icon: Mail, title: "Japanese Business Emails (Keigo)", tags: ["🇯🇵 Japanese"], industry: "Business", desc: "Generate perfectly formal Japanese business correspondence with proper keigo honorifics and seasonal greetings.", before: "Write a business email to a client about a project delay", after: "プロジェクト遅延に関する取引先へのビジネスメールを作成してください。敬語を使用し、季節の挨拶を含め、丁寧な謝罪と今後のスケジュールを提示してください。" },
  { icon: GraduationCap, title: "Korean Academic Papers (Formal)", tags: ["🇰🇷 Korean"], industry: "Education", desc: "Craft academic Korean writing with proper 존댓말 formal register and scholarly conventions.", before: "Write an abstract for a research paper about AI ethics", after: "AI 윤리에 관한 연구 논문 초록을 작성해 주십시오. 학술적 문체와 존댓말을 사용하며, 연구 목적, 방법론, 주요 발견을 포함해 주십시오." },
  { icon: ShoppingCart, title: "Chinese Social Media Marketing", tags: ["🇨🇳 Mandarin"], industry: "E-commerce", desc: "Create engaging Chinese social media content optimized for WeChat, Xiaohongshu, and Douyin.", before: "Write a social media post for a skincare product launch", after: "为新款护肤品发布撰写小红书种草文案。使用年轻化语言风格，包含产品功效、使用体验和互动话题标签。" },
  { icon: Headphones, title: "Thai Customer Service Chatbots", tags: ["🇹🇭 Thai"], industry: "Technology", desc: "Build Thai chatbot responses with proper tone marks and polite particles (ครับ/ค่ะ).", before: "Create a chatbot response for a refund request", after: "สร้างข้อความตอบกลับแชทบอทสำหรับคำขอคืนเงิน ใช้ภาษาสุภาพ มีคำลงท้าย ครับ/ค่ะ อธิบายขั้นตอนและระยะเวลาดำเนินการ" },
  { icon: Globe, title: "Vietnamese E-commerce Listings", tags: ["🇻🇳 Vietnamese"], industry: "E-commerce", desc: "Optimize product listings for Vietnamese marketplaces with proper diacritical marks.", before: "Write a product description for a laptop", after: "Viết mô tả sản phẩm laptop cho sàn thương mại điện tử Việt Nam. Sử dụng ngôn ngữ hấp dẫn, bao gồm thông số kỹ thuật, ưu điểm nổi bật và lời kêu gọi hành động." },
  { icon: FileText, title: "Indonesian Government Documents", tags: ["🇮🇩 Indonesian"], industry: "Government", desc: "Draft formal Indonesian government correspondence using Bahasa Indonesia resmi.", before: "Write an official government notice about new regulations", after: "Buatlah surat resmi pemerintah tentang peraturan baru. Gunakan Bahasa Indonesia formal, struktur surat dinas yang tepat, dan terminologi hukum yang sesuai." },
  { icon: Code, title: "Hindi Technical Documentation", tags: ["🇮🇳 Hindi"], industry: "Technology", desc: "Create technical documentation in Hindi with proper Devanagari script and technical terminology.", before: "Write API documentation for a payment gateway", after: "भुगतान गेटवे के लिए API दस्तावेज़ीकरण लिखें। देवनागरी लिपि में तकनीकी शब्दावली का उपयोग करें, कोड उदाहरण और एकीकरण चरण शामिल करें।" },
  { icon: Users, title: "Multilingual Meeting Summaries", tags: ["🌏 Multi"], industry: "Business", desc: "Generate meeting summaries in multiple Asian languages simultaneously for cross-border teams.", before: "Summarize this meeting about Q4 targets for regional teams", after: "Q4目標に関する会議要約を作成: 日本語(敬語)、한국어(존댓말)、中文(简体) の3言語で、各地域チーム向けにカスタマイズしてください。" },
];

const METRICS = [
  { label: "Time Saved", value: 89 },
  { label: "Cultural Accuracy", value: 95 },
  { label: "Languages Supported", value: 100, display: "12" },
];

function AnimatedBar({ value, label, display }: { value: number; label: string; display?: string }) {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setWidth(value);
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl font-bold text-primary mb-1">{display || `${value}%`}</div>
      <div className="w-full bg-border rounded-full h-2 mb-2">
        <div className="bg-primary h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: `${width}%` }} />
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

const UseCases = () => {
  const [filter, setFilter] = useState<string>("All");

  const filtered = filter === "All" ? USE_CASES : USE_CASES.filter((u) => u.industry === filter);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title="Use Cases | PromptAndGo" description="Discover how businesses across Asia use PromptAndGo for AI prompts in Japanese, Korean, Chinese, Thai and more." canonical="/use-cases" />

      {/* Hero */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">How Asia Uses PromptAndGo</h1>
          <p className="text-muted-foreground text-lg">活用事例 | 사용 사례 | 使用案例 | กรณีใช้งาน</p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="px-4 pb-8">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-2">
          {INDUSTRIES.map((ind) => (
            <button
              key={ind}
              onClick={() => setFilter(ind)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === ind ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
            >
              {ind}
            </button>
          ))}
        </div>
      </section>

      {/* Use Case Cards */}
      <section className="px-4 pb-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((uc) => (
            <div key={uc.title} className="rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-colors">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <uc.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{uc.title}</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {uc.tags.map((tag) => <span key={tag} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{tag}</span>)}
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{uc.industry}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{uc.desc}</p>
              <div className="space-y-3">
                <div>
                  <span className="text-xs font-medium text-destructive">Before (English):</span>
                  <p className="text-xs bg-destructive/10 rounded-lg p-3 mt-1 text-muted-foreground">{uc.before}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-green-500">After (Culturally Adapted):</span>
                  <p className="text-xs bg-green-500/10 rounded-lg p-3 mt-1 text-muted-foreground">{uc.after}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="mt-4 gap-1">
                Try It <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Case Study */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Featured Case Study</h2>
          <div className="rounded-xl border border-border bg-card p-8">
            <h3 className="text-xl font-semibold mb-2">Japanese Enterprise Email Automation</h3>
            <p className="text-muted-foreground text-sm mb-6">How a Tokyo fintech company reduced email drafting time by 85% while maintaining perfect keigo accuracy.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["Step 1: Input English intent", "Step 2: Select keigo level", "Step 3: Review & send"].map((step, i) => (
                <div key={i} className="rounded-lg bg-primary/5 border border-border p-4">
                  <div className="w-full h-24 rounded bg-primary/10 mb-3 flex items-center justify-center text-muted-foreground text-xs">Screenshot {i + 1}</div>
                  <p className="text-sm font-medium">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Success Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {METRICS.map((m) => <AnimatedBar key={m.label} {...m} />)}
          </div>
        </div>
      </section>
    </div>
  );
};

export default UseCases;
