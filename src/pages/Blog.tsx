import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { BookOpen, Clock, ArrowRight } from "lucide-react";

const CATEGORIES = ["All", "Prompt Engineering", "Platform Guides", "Asian Markets", "Tutorials", "Case Studies"];

interface Article {
  title: string;
  slug: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  excerpt: string;
  image?: string;
}

const FEATURED: Article = {
  title: "The State of AI Prompting in Asia: 2025 Report",
  slug: "ai-prompts-in-asian-languages",
  author: "PromptAndGo Team",
  date: "Mar 15, 2025",
  readTime: "3 min read",
  category: "Industry Report",
  excerpt: "Our comprehensive analysis of AI adoption, prompt engineering practices, and language-specific optimization trends across 12 Asian markets. From Japan's keigo-aware prompting to Indonesia's rapid ChatGPT adoption, this report covers the state of play.",
};

const ARTICLES: Article[] = [
  {
    title: "Why Japanese Business Emails Need Different Prompt Structures",
    slug: "ai-prompts-in-asian-languages",
    author: "Yuki Tanaka",
    date: "Mar 10, 2025",
    readTime: "5 min read",
    category: "Asian Markets",
    excerpt: "Japanese business communication relies on keigo formality levels that most AI tools ignore. Learn how to structure prompts that produce naturally polite output.",
  },
  {
    title: "Optimizing Prompts for Baidu's Ernie Bot",
    slug: "multi-platform-prompting-guide",
    author: "Wei Chen",
    date: "Mar 5, 2025",
    readTime: "4 min read",
    category: "Platform Guides",
    excerpt: "Ernie Bot excels with Chinese-first prompts structured around Baidu's unique training data. Here's how to get the best results.",
  },
  {
    title: "WeChat Customer Service: An AI Prompt Template Guide",
    slug: "ai-prompts-for-customer-support",
    author: "Rina Wijaya",
    date: "Feb 28, 2025",
    readTime: "6 min read",
    category: "Tutorials",
    excerpt: "WeChat CS requires short, warm messages with the right 亲 tone. These ready-to-use prompt templates will transform your support workflow.",
  },
  {
    title: "Cross-Cultural Prompt Design: India vs Southeast Asia",
    slug: "ai-prompts-for-business-strategy",
    author: "Priya Sharma",
    date: "Feb 20, 2025",
    readTime: "7 min read",
    category: "Asian Markets",
    excerpt: "The same prompt generates wildly different results when optimized for Indian enterprise vs SEA startup contexts. Here's how to adapt.",
  },
  {
    title: "Getting the Most Out of Qwen for Mandarin Content",
    slug: "multi-platform-prompting-guide",
    author: "David Chen",
    date: "Feb 15, 2025",
    readTime: "5 min read",
    category: "Platform Guides",
    excerpt: "Alibaba's Qwen model has unique strengths for Chinese e-commerce and social content. Learn the prompting patterns that unlock its full potential.",
  },
  {
    title: "How Korean Startups Are Using AI Prompts for Growth",
    slug: "best-ai-prompts-for-small-business-2025",
    author: "Somchai Patel",
    date: "Feb 10, 2025",
    readTime: "4 min read",
    category: "Case Studies",
    excerpt: "Seoul's startup scene is leveraging AI prompts for everything from Coupang listings to KakaoTalk campaigns. Real case studies inside.",
  },
];

const BLOG_ARTICLES: Article[] = [
  { title: "Mastering Keigo: How to Write Formal Japanese Business Emails with AI", slug: "mastering-keigo-japanese-business-emails", author: "Yuki Tanaka", date: "Apr 8, 2026", readTime: "8 min read", category: "Asian Markets", excerpt: "Japanese business communication relies on keigo — learn how to prompt AI for correct sonkeigo, kenjōgo, and teineigo output." },
  { title: "The Complete Guide to Mandarin Tone Markers in AI-Generated Content", slug: "mandarin-tone-markers-ai-guide", author: "Li Wei", date: "Apr 5, 2026", readTime: "7 min read", category: "Platform Guides", excerpt: "Ensure your AI outputs handle Mandarin's four tones correctly with pinyin markers and proper character sets." },
  { title: "Why Korean Honorifics Matter in AI Prompt Engineering", slug: "korean-honorifics-prompt-engineering", author: "Ji-su Park", date: "Apr 1, 2026", readTime: "6 min read", category: "Asian Markets", excerpt: "Korean's complex honorific system has seven speech levels. Here's how to prompt AI for correct 존댓말 output." },
];

const EXISTING_ARTICLES: Article[] = [
  { title: "How to Write AI Prompts in Asian Languages", slug: "ai-prompts-in-asian-languages", author: "PromptAndGo Team", date: "Jan 2025", readTime: "6 min", category: "Prompt Engineering", excerpt: "Prompting in your native Asian language works better than English. Learn techniques for Chinese, Japanese, Korean, Thai, Hindi, and more." },
  { title: "Multi-Platform Prompting Guide for 2026", slug: "multi-platform-prompting-guide", author: "PromptAndGo Team", date: "Jan 2025", readTime: "8 min", category: "Platform Guides", excerpt: "ChatGPT, Claude, DeepSeek, Qwen, and more all respond differently. Learn how to tailor prompts for each platform." },
  { title: "How to Write AI Prompts That Actually Work", slug: "how-to-write-ai-prompts", author: "PromptAndGo Team", date: "Dec 2024", readTime: "5 min", category: "Tutorials", excerpt: "Follow five proven rules to craft prompts that deliver accurate, useful and consistent results." },
  { title: "AI Prompts That Save You Hours Every Week", slug: "ai-prompts-that-save-you-hours", author: "PromptAndGo Team", date: "Dec 2024", readTime: "4 min", category: "Prompt Engineering", excerpt: "Automate routine tasks and boost productivity with proven prompts for busy teams." },
  { title: "AI Prompts for Marketing Campaigns That Convert", slug: "ai-prompts-for-marketing-campaigns", author: "PromptAndGo Team", date: "Nov 2024", readTime: "5 min", category: "Tutorials", excerpt: "From ad copy to social captions, use these prompts to boost engagement and sales." },
  { title: "AI Prompts for Business Strategy and Planning", slug: "ai-prompts-for-business-strategy", author: "PromptAndGo Team", date: "Nov 2024", readTime: "6 min", category: "Case Studies", excerpt: "Plan smarter with AI prompts for strategy: SWOTs, growth roadmaps, market insights, and more." },
];

const Blog = () => {
  const { user } = useSupabaseAuth();
  const [activeCategory, setActiveCategory] = useState("All");
  const [showMore, setShowMore] = useState(false);
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const canonical = origin ? `${origin}/tips` : undefined;

  const allArticles = [...BLOG_ARTICLES, ...ARTICLES, ...(showMore ? EXISTING_ARTICLES : [])];
  const filtered = activeCategory === "All" ? allArticles : allArticles.filter((a) => a.category === activeCategory);

  const getArticleLink = (slug: string): string => {
    const blogSlugs = BLOG_ARTICLES.map(a => a.slug);
    return blogSlugs.includes(slug) ? `/blog/${slug}` : `/tips/${slug}`;
  };

  return (
    <>
      <SEO title="AI Prompting Insights for Asia | PromptAndGo Blog" description="Expert tips, industry analysis, and prompt engineering guides for Asian markets. Learn to optimize prompts across platforms and languages." canonical={canonical} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-hero">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute bottom-[-30%] right-[-5%] w-[400px] h-[400px] rounded-full bg-accent/15 blur-[100px]" />
        </div>
        <div className="relative z-10 container max-w-5xl mx-auto px-4 pt-20 pb-12 md:pt-28 md:pb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 text-white/80 px-4 py-1.5 rounded-full text-sm mb-6">
            <BookOpen className="h-3.5 w-3.5" />
            Expert Insights
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1.1] mb-4">
            AI Prompting Insights for Asia
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Expert tips, industry analysis, and prompt engineering guides for Asian markets
          </p>
        </div>
      </section>

      <main className="container max-w-5xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Blog</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Featured article */}
        <Link to={`/tips/${FEATURED.slug}`} className="group block mb-12">
          <Card className="overflow-hidden border-primary/20 hover:border-primary/40 transition-colors">
            <CardContent className="p-8 md:p-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">{FEATURED.category}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {FEATURED.readTime}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition-colors">{FEATURED.title}</h2>
              <p className="text-muted-foreground leading-relaxed mb-4 max-w-3xl">{FEATURED.excerpt}</p>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{FEATURED.author} · {FEATURED.date}</p>
                <span className="text-sm font-semibold text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all">Read More <ArrowRight className="h-4 w-4" /></span>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-sm px-4 py-2 rounded-full border transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border bg-card hover:border-primary/30 text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Article grid */}
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {filtered.map((article, idx) => (
            <article key={`${article.slug}-${idx}`}>
              <Link to={`/tips/${article.slug}`} className="group block h-full">
                <Card className="h-full overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full">{article.category}</span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {article.readTime}</span>
                    </div>
                    <h3 className="font-bold text-base mb-2 leading-snug group-hover:text-primary transition-colors line-clamp-2">{article.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">{article.excerpt}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <p className="text-xs text-muted-foreground">{article.author}</p>
                      <p className="text-xs text-muted-foreground">{article.date}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </article>
          ))}
        </section>

        {/* Load more */}
        {!showMore && (
          <div className="text-center mb-16">
            <Button variant="outline" size="lg" onClick={() => setShowMore(true)}>
              Load More Articles
            </Button>
            <p className="text-xs text-muted-foreground mt-2">Showing {filtered.length} of {ARTICLES.length + EXISTING_ARTICLES.length}+ articles</p>
          </div>
        )}

        {/* Bottom CTA */}
        <section className="relative bg-hero rounded-2xl overflow-hidden">
          <div className="p-8 md:p-12 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">Ready to start prompting smarter?</h2>
            <p className="text-white/70 mb-6">Try your first prompt or explore a Power Pack, no sign-up required.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild variant="hero" className="px-6">
                <Link to="/library">Browse Prompt Library</Link>
              </Button>
              <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Link to="/packs">Explore Power Packs</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Blog;
