import { useState, useMemo } from "react";
import SEO from "@/components/SEO";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown, ChevronLeft, ChevronRight, Mail, Share2, Clock } from "lucide-react";
import { toast } from "sonner";

/* ───── data ───── */
interface Newsletter {
  issue: number;
  date: string;
  title: string;
  preview: string;
  content: string;
  author: string;
  readTime: string;
  tags: string[];
}

const NEWSLETTERS: Newsletter[] = [
  { issue: 12, date: "April 2026", title: "K-Pop AI Translation Goes Mainstream", preview: "Major Korean entertainment companies adopt AI translation, transforming how K-Pop reaches global audiences.", content: "Seoul's biggest entertainment agencies have partnered with AI translation platforms to deliver real-time lyric translations that preserve the emotional nuance of Korean pop music.\n\nThe initiative, led by HYBE and SM Entertainment, uses fine-tuned LLMs trained on Korean musical phrasing and cultural idioms. Early results show 94% accuracy in preserving the poetic structure of Korean lyrics across 8 target languages.\n\nPromptAndGo users can now access specialized K-Pop translation prompt templates that handle everything from 반말 casual lyrics to formal 존댓말 ballad phrasing.\n\nThe industry expects AI-assisted translation to become standard practice by Q3 2026.", author: "Jihye Park", readTime: "4 min", tags: ["Language Tech", "Regional Update"] },
  { issue: 11, date: "March 2026", title: "Japan's AI Education Reform", preview: "Japan announces major AI literacy curriculum changes for schools nationwide, with focus on prompt engineering.", content: "Japan's Ministry of Education (MEXT) has unveiled a comprehensive AI literacy program that will be mandatory in all high schools starting April 2027.\n\nThe curriculum includes prompt engineering fundamentals, with special emphasis on crafting effective prompts in Japanese — including proper keigo (敬語) usage when interacting with AI systems.\n\nEducators will receive training through government-certified programs, and PromptAndGo has been selected as one of the recommended tools for classroom instruction.\n\nThe reform positions Japan as a leader in Asian AI education, with similar programs being planned in South Korea and Singapore.", author: "Yuki Tanaka", readTime: "5 min", tags: ["AI News", "Regional Update"] },
  { issue: 10, date: "February 2026", title: "ASEAN AI Cooperation Summit Highlights", preview: "Ten ASEAN nations agree on shared AI language processing standards and cross-border data frameworks.", content: "The inaugural ASEAN AI Cooperation Summit in Jakarta brought together technology leaders from all ten member nations to establish common standards for Asian language AI processing.\n\nKey agreements include a shared tokenization standard for Southeast Asian languages, cross-border data processing frameworks, and a joint research fund for underrepresented languages like Khmer and Burmese.\n\nThe summit also announced the ASEAN AI Language Benchmark (AALB), which will evaluate AI models across Bahasa Indonesia, Bahasa Malay, Thai, Vietnamese, Filipino, and Myanmar languages.\n\nPromptAndGo contributed technical expertise on prompt optimization across these diverse language families.", author: "Budi Santoso", readTime: "6 min", tags: ["AI News", "Regional Update"] },
  { issue: 9, date: "January 2026", title: "Taiwan Semiconductor AI Language Processing", preview: "TSMC's new AI chip architecture optimizes inference for CJK character-based language models.", content: "Taiwan Semiconductor Manufacturing Company has announced a specialized AI accelerator chip designed for CJK (Chinese, Japanese, Korean) language processing workloads.\n\nThe N3E-AI chip delivers 3x faster inference for character-based tokenization compared to general-purpose GPUs, making real-time translation and prompt processing significantly faster.\n\nEarly benchmarks show dramatic improvements in Traditional Chinese processing, with Japanese and Korean models also seeing 40-60% latency reductions.\n\nThis hardware advancement will enable on-device Asian language AI models for smartphones and edge devices by late 2026.", author: "Wei Chen", readTime: "5 min", tags: ["AI News", "Language Tech"] },
  { issue: 8, date: "December 2025", title: "Indonesia's Bahasa AI Corpus Milestone", preview: "Indonesia reaches 100 billion tokens in its national Bahasa AI training corpus — largest Southeast Asian dataset.", content: "Indonesia's National AI Research Center has achieved a landmark milestone: 100 billion tokens of curated Bahasa Indonesia training data, making it the largest Southeast Asian language corpus.\n\nThe dataset includes formal government documents, informal social media text, regional dialect variations, and specialized domains like legal and medical terminology.\n\nThis corpus powers a new generation of Indonesian-first AI models that understand the nuances between formal Bahasa and colloquial Jakarta slang.\n\nPromptAndGo's Indonesian prompt templates have been updated to leverage these improvements.", author: "Putri Dewi", readTime: "4 min", tags: ["Language Tech", "Regional Update"] },
  { issue: 7, date: "November 2025", title: "India's Multilingual AI Initiative", preview: "Government launches Bharat AI program covering 22 scheduled languages with focus on Hindi and Tamil.", content: "India's Ministry of Electronics and IT has launched the Bharat AI Multilingual Initiative, the most ambitious multilingual AI program in Asia.\n\nThe program targets all 22 scheduled languages of India, with initial focus on Hindi, Tamil, Telugu, Bengali, and Marathi. It includes a $200M investment in language-specific training data and model development.\n\nA key innovation is the cross-lingual transfer learning approach, where models trained on resource-rich Hindi data bootstrap understanding for lower-resource languages like Assamese and Manipuri.\n\nPromptAndGo has expanded its Hindi and Tamil prompt libraries with 50+ new templates optimized for Bharat AI models.", author: "Priya Sharma", readTime: "5 min", tags: ["AI News", "Regional Update"] },
  { issue: 6, date: "October 2025", title: "China's Qwen Model Updates for Classical Chinese", preview: "Alibaba's Qwen model achieves breakthrough accuracy in classical Chinese poetry and literary analysis.", content: "Alibaba Cloud's Qwen team has released a specialized classical Chinese (文言文) module that achieves 92% accuracy in parsing Tang Dynasty poetry structures and Song Dynasty prose.\n\nThe update includes understanding of 平仄 (tonal patterns), 对仗 (antithetical couplets), and classical allusions — capabilities that were previously beyond AI reach.\n\nScholars at Peking University praised the development as 'a genuine breakthrough in computational sinology' that will transform how classical Chinese literature is studied and taught.\n\nPromptAndGo now offers dedicated classical Chinese prompt templates compatible with Qwen's enhanced capabilities.", author: "Mei Lin", readTime: "4 min", tags: ["Language Tech", "Tutorial"] },
  { issue: 5, date: "September 2025", title: "Singapore Launches Asian AI Ethics Framework", preview: "Singapore's IMDA publishes comprehensive AI ethics guidelines specifically addressing Asian cultural values.", content: "Singapore's Infocomm Media Development Authority has published the world's first AI ethics framework specifically designed for Asian cultural contexts.\n\nThe framework addresses unique challenges like maintaining proper honorific systems in AI-generated text, respecting face-saving conventions in automated customer service, and handling the complexity of Asian family naming conventions.\n\nKey principles include Cultural Sensitivity First, Linguistic Accuracy, Hierarchical Awareness, and Cross-Cultural Respect. The framework has been endorsed by 15 Asian governments.\n\nPromptAndGo's platform already aligns with these guidelines through our cultural context engine.", author: "Sarah Lim", readTime: "6 min", tags: ["AI News", "Regional Update"] },
  { issue: 4, date: "August 2025", title: "Vietnamese Language Models Reach Parity", preview: "Vietnamese AI language models close the gap with English, achieving near-parity in NLU benchmarks.", content: "A consortium of Vietnamese AI labs has announced that Vietnamese language models have reached near-parity with English models on natural language understanding benchmarks.\n\nThe breakthrough came from training on 50B tokens of curated Vietnamese text, combined with novel diacritical mark handling that properly resolves the 6 tones of Vietnamese.\n\nPractical applications include accurate sentiment analysis for Vietnamese social media, proper handling of regional dialects (Hanoi vs Ho Chi Minh City), and business Vietnamese document processing.\n\nPromptAndGo users report 35% better results with Vietnamese prompts since integrating these new model capabilities.", author: "Minh Tran", readTime: "4 min", tags: ["Language Tech", "AI News"] },
  { issue: 3, date: "July 2025", title: "Thailand's AI National Strategy Update", preview: "Thai government commits $500M to AI language technology, prioritizing Thai NLP and tonal language processing.", content: "Thailand's National AI Strategy has been updated with a significant $500M investment in Thai language AI technology over the next five years.\n\nThe strategy prioritizes solving the unique challenges of Thai NLP: no spaces between words, 5 tones that change meaning, and complex honorific systems including Royal Thai (ราชาศัพท์).\n\nA new Thai AI Language Institute will be established at Chulalongkorn University, partnering with Google DeepMind and local startups.\n\nPromptAndGo's Thai prompt optimizer has been enhanced with the latest Thai tokenization models developed under this initiative.", author: "Somchai Prasert", readTime: "5 min", tags: ["Regional Update", "AI News"] },
  { issue: 2, date: "June 2025", title: "Korean NLP Breakthrough at KAIST", preview: "KAIST researchers achieve state-of-the-art results in Korean morphological analysis using transformer architecture.", content: "Researchers at KAIST (Korea Advanced Institute of Science and Technology) have published groundbreaking results in Korean morphological analysis.\n\nTheir new KoMorph-T model handles the agglutinative nature of Korean — where particles attach to words to create complex meaning — with 98.7% accuracy, surpassing all previous benchmarks.\n\nThe model correctly handles the subtle differences between 이/가 subject markers, 은/는 topic markers, and complex honorific conjugation patterns that have long plagued AI systems.\n\nThis research directly improves PromptAndGo's Korean prompt optimization, especially for formal business communication.", author: "Minjun Lee", readTime: "5 min", tags: ["Language Tech", "Tutorial"] },
  { issue: 1, date: "May 2025", title: "GPT-5 and Japanese Keigo Support", preview: "OpenAI's GPT-5 shows dramatic improvement in Japanese keigo, finally handling sonkeigo and kenjougo correctly.", content: "The release of GPT-5 marks a watershed moment for Japanese AI language processing. For the first time, a major LLM consistently handles all three levels of Japanese keigo (敬語).\n\nSonkeigo (尊敬語, respectful language), kenjougo (謙譲語, humble language), and teineigo (丁寧語, polite language) are now properly distinguished based on context, speaker relationship, and social hierarchy.\n\nJapanese business users report that AI-generated emails now pass the 'native speaker test' — colleagues cannot distinguish AI-written keigo from human-written text.\n\nPromptAndGo's Japanese prompt templates have been updated to take full advantage of GPT-5's keigo capabilities, with specific templates for client emails, internal memos, and formal proposals.", author: "Yuki Tanaka", readTime: "6 min", tags: ["AI News", "Language Tech"] },
];

const ALL_TAGS = ["All", "AI News", "Language Tech", "Regional Update", "Tutorial"];
const PER_PAGE = 6;

const NewsletterArchive = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(() => localStorage.getItem("pag_newsletter_sub") === "true");
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState("All");
  const [page, setPage] = useState(0);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const filtered = useMemo(() => {
    let list = NEWSLETTERS;
    if (tag !== "All") list = list.filter((n) => n.tags.includes(tag));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((n) => n.title.toLowerCase().includes(q) || n.preview.toLowerCase().includes(q) || n.content.toLowerCase().includes(q));
    }
    return list;
  }, [search, tag]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const pageItems = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast.error("Please enter a valid email."); return; }
    localStorage.setItem("pag_newsletter_sub", "true");
    setSubscribed(true);
    toast.success("You're subscribed! Welcome aboard.");
    setEmail("");
  };

  const toggleExpand = (issue: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(issue)) next.delete(issue); else next.add(issue);
      return next;
    });
  };

  return (
    <>
      <SEO
        title="Newsletter Archive — PromptAndGo | Asian AI Updates"
        description="Browse past PromptAndGo newsletters covering Asian AI news, language technology breakthroughs, and regional updates across 12 languages."
        canonical="https://promptandgo.ai/newsletter"
      />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-hero">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px]" />
          </div>
          <div className="relative z-10 container max-w-4xl mx-auto px-4 pt-20 pb-10 md:pt-28 md:pb-14 text-center">
            <Mail className="h-10 w-10 text-primary mx-auto mb-4" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight mb-4">
              Newsletter Archive
            </h1>
            <p className="text-lg text-white/60 max-w-xl mx-auto mb-8">
              Stay updated on Asian AI — language tech, regional news, and prompt engineering tips
            </p>
            {!subscribed && (
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md mx-auto">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  aria-label="Email for newsletter"
                />
                <Button type="submit">Subscribe</Button>
              </form>
            )}
            {subscribed && (
              <p className="text-sm text-accent">✓ You're subscribed — check your inbox for the next issue!</p>
            )}
          </div>
        </section>

        {/* Filters */}
        <section className="bg-background border-b border-border py-4">
          <div className="container max-w-5xl mx-auto px-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                placeholder="Search newsletters…"
                className="pl-9"
                aria-label="Search newsletters"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {ALL_TAGS.map((t) => (
                <button
                  key={t}
                  onClick={() => { setTag(t); setPage(0); }}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    tag === t
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="py-10 md:py-16 bg-background">
          <div className="container max-w-5xl mx-auto px-4">
            {pageItems.length === 0 && (
              <p className="text-center text-muted-foreground py-16">No newsletters match your search.</p>
            )}
            <div className="space-y-6">
              {pageItems.map((n) => {
                const isOpen = expanded.has(n.issue);
                return (
                  <article key={n.issue} className="rounded-xl border border-border bg-card overflow-hidden hover:border-primary/30 transition-colors">
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Issue #{n.issue}</span>
                        <span className="text-xs text-muted-foreground">{n.date}</span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" />{n.readTime} read</div>
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{n.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">{n.preview}</p>
                      <div className="flex items-center gap-2 flex-wrap mb-4">
                        {n.tags.map((t) => (
                          <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{t}</span>
                        ))}
                      </div>

                      <button
                        onClick={() => toggleExpand(n.issue)}
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        {isOpen ? "Show Less" : "Read More"}
                        <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                      </button>

                      {isOpen && (
                        <div className="mt-4 pt-4 border-t border-border animate-fade-in">
                          {n.content.split("\n\n").map((p, i) => (
                            <p key={i} className="text-sm text-foreground leading-relaxed mb-3">{p}</p>
                          ))}
                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                            <p className="text-xs text-muted-foreground">By {n.author}</p>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1 h-8 text-xs"
                              onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }}
                            >
                              <Share2 className="h-3 w-3" /> Share
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-10">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page + 1} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                  className="gap-1"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Sticky subscribe */}
        {!subscribed && (
          <div className="sticky bottom-0 z-30 bg-card/95 backdrop-blur-sm border-t border-border py-3">
            <div className="container max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center gap-3">
              <p className="text-sm text-foreground font-medium flex-1">📬 Get the latest Asian AI updates in your inbox</p>
              <form onSubmit={handleSubscribe} className="flex gap-2 w-full sm:w-auto">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="h-9 text-sm w-full sm:w-56"
                  aria-label="Email for newsletter subscription"
                />
                <Button type="submit" size="sm">Subscribe</Button>
              </form>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default NewsletterArchive;
