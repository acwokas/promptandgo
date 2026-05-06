import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Clock, Share2, Twitter, Linkedin, Copy, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

interface ArticleData {
  slug: string;
  title: string;
  author: { name: string; role: string; bio: string };
  date: string;
  readTime: string;
  category: string;
  content: Section[];
  relatedSlugs: string[];
}

interface Section {
  id: string;
  heading: string;
  level: 2 | 3;
  body: string; // HTML string
}

const AUTHORS = {
  yuki: { name: "Yuki Tanaka", role: "Japanese Language Specialist", bio: "Yuki is a Tokyo-based prompt engineer specializing in keigo-aware AI systems. She helps enterprises bridge the gap between Western AI tools and Japanese business culture." },
  li: { name: "Li Wei", role: "Mandarin Content Lead", bio: "Li Wei leads Mandarin content strategy at PromptAndGo, focusing on tone accuracy and cultural nuance in AI-generated Chinese content." },
  jisu: { name: "Ji-su Park", role: "Korean AI Researcher", bio: "Ji-su researches Korean NLP and honorific systems at Seoul National University. She consults on Korean language quality for PromptAndGo." },
};

const ARTICLES: ArticleData[] = [
  {
    slug: "mastering-keigo-japanese-business-emails",
    title: "Mastering Keigo: How to Write Formal Japanese Business Emails with AI",
    author: AUTHORS.yuki,
    date: "April 8, 2026",
    readTime: "8 min read",
    category: "Asian Markets",
    relatedSlugs: ["mandarin-tone-markers-ai-guide", "korean-honorifics-prompt-engineering"],
    content: [
      { id: "intro", heading: "Why Keigo Matters in Business AI", level: 2, body: `<p>Japanese business communication operates on a sophisticated system of honorific speech called <strong>keigo (敬語)</strong>. Unlike casual Japanese, keigo has three distinct levels: <em>sonkeigo</em> (respectful), <em>kenjōgo</em> (humble), and <em>teineigo</em> (polite). Getting this wrong in business emails can range from mildly embarrassing to deal-breaking.</p><p>Most AI models default to casual or generic polite Japanese. This guide shows you how to craft prompts that produce properly formal keigo output suitable for real business correspondence.</p>` },
      { id: "three-levels", heading: "The Three Levels of Keigo", level: 2, body: `<p>Understanding when to use each level is critical:</p><ul><li><strong>Sonkeigo (尊敬語)</strong> — Elevates the listener's actions. Used for clients, superiors, and external partners.</li><li><strong>Kenjōgo (謙譲語)</strong> — Humbles your own actions. Used when describing what you or your company will do.</li><li><strong>Teineigo (丁寧語)</strong> — General politeness. The baseline for all business communication.</li></ul><blockquote>A common mistake: using sonkeigo for your own company's actions. This is like praising yourself in a business meeting — it signals a fundamental misunderstanding of Japanese hierarchy.</blockquote>` },
      { id: "prompt-patterns", heading: "Prompt Patterns for Keigo", level: 2, body: `<p>Here are tested prompt structures that consistently produce correct keigo:</p><pre><code>You are a senior Japanese business communication specialist.
Write a formal email in Japanese using appropriate keigo levels:
- Use sonkeigo (尊敬語) when referring to the recipient's actions
- Use kenjōgo (謙譲語) for our company's actions
- Maintain teineigo (丁寧語) throughout
Context: [your situation]
Recipient: [their role/company]</code></pre><p>This explicit instruction forces the model to differentiate between the three levels rather than defaulting to generic polite Japanese.</p>` },
      { id: "common-mistakes", heading: "Common AI Mistakes with Keigo", level: 3, body: `<p>Even with good prompts, watch for these errors:</p><ul><li>Mixing sonkeigo and kenjōgo in the same sentence</li><li>Using overly casual sentence endings (〜だ instead of 〜でございます)</li><li>Missing seasonal greetings (時候の挨拶) that are expected in formal emails</li><li>Incorrect verb conjugations in humble form</li></ul>` },
      { id: "seasonal", heading: "Seasonal Greetings Guide", level: 3, body: `<p>Japanese business emails traditionally open with a seasonal reference. Include this in your prompts:</p><pre><code>Include the appropriate 時候の挨拶 (seasonal greeting)
for the current month. Current month: April.
Example: 春暖の候、貴社におかれましてはますますご清栄のこととお慶び申し上げます。</code></pre>` },
      { id: "best-platforms", heading: "Best Platforms for Japanese Keigo", level: 2, body: `<p>Based on our testing across 500+ business email prompts:</p><ul><li><strong>Claude</strong> — Best overall keigo accuracy. Its 200K context window handles long formal documents well.</li><li><strong>ChatGPT</strong> — Good general performance but occasionally mixes formality levels.</li><li><strong>Gemini</strong> — Strong with casual Japanese but less reliable for strict keigo.</li></ul><p>We recommend using <a href="/compare">our platform comparison tool</a> to see detailed Asian language benchmarks.</p>` },
    ],
  },
  {
    slug: "mandarin-tone-markers-ai-guide",
    title: "The Complete Guide to Mandarin Tone Markers in AI-Generated Content",
    author: AUTHORS.li,
    date: "April 5, 2026",
    readTime: "7 min read",
    category: "Platform Guides",
    relatedSlugs: ["mastering-keigo-japanese-business-emails", "korean-honorifics-prompt-engineering"],
    content: [
      { id: "why-tones", heading: "Why Tones Matter in AI Content", level: 2, body: `<p>Mandarin Chinese is a tonal language with four main tones plus a neutral tone. The same syllable — <strong>ma</strong> — can mean "mother" (妈, 1st tone), "hemp" (麻, 2nd tone), "horse" (马, 3rd tone), or "scold" (骂, 4th tone). AI models generating pinyin or teaching content must handle tones correctly to avoid embarrassing or confusing output.</p>` },
      { id: "four-tones", heading: "The Four Tones Explained", level: 2, body: `<p>Each tone has a distinct pitch contour:</p><ul><li><strong>First tone (ā)</strong> — High and flat. Like singing a sustained note.</li><li><strong>Second tone (á)</strong> — Rising. Like asking "what?" in English.</li><li><strong>Third tone (ǎ)</strong> — Dipping then rising. A valley shape.</li><li><strong>Fourth tone (à)</strong> — Falling sharply. Like a command.</li></ul><blockquote>Tip: When generating educational content, always include both characters and pinyin with tone marks. Never use tone numbers (ma1, ma2) in user-facing content — they're for linguists, not learners.</blockquote>` },
      { id: "prompting-tones", heading: "Prompting for Correct Tones", level: 2, body: `<p>Use these prompt patterns to ensure AI correctly handles tones:</p><pre><code>Generate Mandarin vocabulary with:
1. Simplified characters (简体字)
2. Traditional characters (繁體字) where applicable
3. Pinyin with proper tone marks (ā á ǎ à)
4. English translation
5. Example sentence using the word in context

Format each entry as:
字 (zì) — character / meaning</code></pre>` },
      { id: "simplified-traditional", heading: "Simplified vs Traditional Characters", level: 3, body: `<p>Your prompts should specify which character set to use:</p><ul><li><strong>Simplified (简体)</strong> — Mainland China, Singapore, Malaysia</li><li><strong>Traditional (繁體)</strong> — Taiwan, Hong Kong, Macau</li></ul><p>Many AI models default to simplified. If targeting Taiwan or Hong Kong audiences, explicitly request traditional characters in your prompt.</p>` },
      { id: "platform-comparison", heading: "Platform Accuracy for Mandarin", level: 2, body: `<p>Our benchmark tests across 1,000 Mandarin prompts:</p><ul><li><strong>Qwen</strong> — Best overall for Chinese content, native understanding of cultural nuance</li><li><strong>Ernie Bot</strong> — Excellent for mainland Chinese contexts, integrated with Baidu's knowledge graph</li><li><strong>ChatGPT</strong> — Good accuracy but occasionally generates unnatural phrasing</li></ul>` },
      { id: "common-errors", heading: "Common Tone Errors to Watch For", level: 2, body: `<p>AI models frequently make these tone-related mistakes:</p><ul><li>Omitting tone marks entirely in pinyin output</li><li>Using wrong tones for common words (e.g., 的 should be neutral tone)</li><li>Missing tone sandhi rules (e.g., two third tones in a row)</li><li>Incorrect tones on proper nouns and place names</li></ul>` },
    ],
  },
  {
    slug: "korean-honorifics-prompt-engineering",
    title: "Why Korean Honorifics Matter in AI Prompt Engineering",
    author: AUTHORS.jisu,
    date: "April 1, 2026",
    readTime: "6 min read",
    category: "Asian Markets",
    relatedSlugs: ["mastering-keigo-japanese-business-emails", "mandarin-tone-markers-ai-guide"],
    content: [
      { id: "honorific-system", heading: "The Korean Honorific System", level: 2, body: `<p>Korean has one of the world's most complex honorific systems. There are <strong>seven speech levels</strong>, though modern usage typically focuses on three: <em>존댓말</em> (formal/polite), <em>반말</em> (informal), and <em>해요체</em> (standard polite). The choice of speech level signals respect, social distance, and context — get it wrong and your AI output will sound rude, robotic, or childish.</p>` },
      { id: "speech-levels", heading: "Key Speech Levels for AI Content", level: 2, body: `<ul><li><strong>합쇼체 (Hapsyo-che)</strong> — Most formal. Used in news, official documents, business presentations.</li><li><strong>해요체 (Haeyo-che)</strong> — Standard polite. Safe default for most AI outputs.</li><li><strong>해체 (Hae-che)</strong> — Informal. Used among close friends. Never in business.</li></ul><blockquote>Rule of thumb: If you're unsure, default to 해요체. It's universally acceptable in Korean digital communication.</blockquote>` },
      { id: "prompting-honorifics", heading: "Prompting for Correct Honorifics", level: 2, body: `<p>Explicit prompting is essential:</p><pre><code>Generate Korean customer service response using 존댓말 (formal polite speech).
Use 해요체 as the default speech level.
When referring to the customer, use honorific suffixes:
- 님 after their name
- 고객님 for generic customer reference
Avoid: 반말, casual contractions, slang</code></pre>` },
      { id: "subject-honorifics", heading: "Subject Honorifics (-시-)", level: 3, body: `<p>Korean uses the infix <strong>-시- (-si-)</strong> to show respect for the subject of a sentence. This is separate from the speech level and must be applied when talking about someone of higher status:</p><ul><li>가다 (to go) → 가시다 (to go, honorific)</li><li>먹다 (to eat) → 드시다 (to eat, honorific — special form)</li><li>있다 (to have/be) → 계시다 (to be, honorific — special form)</li></ul><p>AI models often forget -시- when it's needed, producing grammatically correct but socially inappropriate output.</p>` },
      { id: "platform-results", heading: "Platform Performance for Korean", level: 2, body: `<p>Our testing with 800+ Korean prompts shows:</p><ul><li><strong>ChatGPT</strong> — Consistent 해요체 output, occasionally misses -시- honorifics</li><li><strong>Claude</strong> — Best at maintaining consistent speech levels across long texts</li><li><strong>DeepSeek</strong> — Improving rapidly, good for casual Korean content</li></ul>` },
      { id: "cultural-context", heading: "Cultural Context in Korean AI", level: 2, body: `<p>Beyond grammar, Korean business culture has specific expectations:</p><ul><li>Age-based hierarchy affects language choices</li><li>Company name + 님 is standard for B2B communication</li><li>Seasonal and holiday references differ from Western patterns</li><li>The concept of <strong>눈치 (nunchi)</strong> — social awareness — should be reflected in tone</li></ul>` },
    ],
  },
];

const BlogArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [readProgress, setReadProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("");

  const article = ARTICLES.find(a => a.slug === slug);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setReadProgress(docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0);

      // Active section tracking
      if (!article) return;
      const sections = article.content.map(s => document.getElementById(s.id)).filter(Boolean);
      let current = "";
      for (const el of sections) {
        if (el && el.getBoundingClientRect().top <= 120) current = el.id;
      }
      if (current) setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [article]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "Link copied!" });
  };

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Article not found</h1>
          <Link to="/blog" className="text-primary hover:underline">← Back to Blog</Link>
        </div>
      </div>
    );
  }

  const related = article.relatedSlugs
    .map(s => ARTICLES.find(a => a.slug === s))
    .filter(Boolean) as ArticleData[];

  return (
    <>
      <Helmet>
        <title>{article.title} | PromptAndGo Blog</title>
        <meta name="description" content={article.content[0]?.body.replace(/<[^>]*>/g, "").slice(0, 155)} />
      </Helmet>

      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-transparent">
        <div className="h-full bg-primary transition-all duration-150" style={{ width: `${readProgress}%` }} />
      </div>

      <div className="min-h-screen bg-background">
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>

          <div className="flex gap-10">
            {/* TOC Sidebar */}
            <aside className="hidden lg:block w-56 shrink-0" role="complementary" aria-label="Table of contents">
              <nav className="sticky top-20 space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">On this page</p>
                {article.content.map(s => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className={`block text-sm py-1 transition-colors ${
                      s.level === 3 ? "pl-4" : ""
                    } ${activeSection === s.id ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}
                    onClick={e => {
                      e.preventDefault();
                      document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    {s.heading}
                  </a>
                ))}
              </nav>
            </aside>

            {/* Main content */}
            <article className="flex-1 min-w-0">
              {/* Header */}
              <header className="mb-8">
                <Badge className="mb-3">{article.category}</Badge>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">{article.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                      {article.author.name.charAt(0)}
                    </div>
                    <span className="font-medium text-foreground">{article.author.name}</span>
                  </div>
                  <span>{article.date}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {article.readTime}</span>
                </div>
                {/* Share */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Share:</span>
                  <button onClick={copyLink} className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" aria-label="Copy link">
                    <Copy className="h-4 w-4" />
                  </button>
                  <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" aria-label="Share on X/Twitter">
                    <Twitter className="h-4 w-4" />
                  </a>
                  <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" aria-label="Share on LinkedIn">
                    <Linkedin className="h-4 w-4" />
                  </a>
                </div>
              </header>

              {/* Content */}
              <div className="prose-dark space-y-8">
                {article.content.map(section => (
                  <section key={section.id} id={section.id}>
                    {section.level === 2
                      ? <h2 className="text-2xl font-bold text-foreground mb-3">{section.heading}</h2>
                      : <h3 className="text-xl font-semibold text-foreground mb-2">{section.heading}</h3>
                    }
                    <div
                      className="text-muted-foreground leading-relaxed [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul_li]:mb-1.5 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_strong]:text-foreground [&_em]:italic [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-foreground/80 [&_blockquote]:my-4 [&_pre]:bg-card [&_pre]:border [&_pre]:border-border [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:my-4 [&_code]:font-mono [&_code]:text-sm [&_pre_code]:text-foreground/90"
                      dangerouslySetInnerHTML={{ __html: section.body }}
                    />
                  </section>
                ))}
              </div>

              {/* Author Bio */}
              <div className="mt-12 p-6 rounded-xl bg-card border border-border">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary text-lg font-bold shrink-0">
                    {article.author.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{article.author.name}</h3>
                    <p className="text-sm text-primary mb-2">{article.author.role}</p>
                    <p className="text-sm text-muted-foreground">{article.author.bio}</p>
                  </div>
                </div>
              </div>

              {/* Related Articles */}
              {related.length > 0 && (
                <section className="mt-12">
                  <h2 className="text-xl font-bold text-foreground mb-6">Related Articles</h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {related.map(r => (
                      <Link key={r.slug} to={`/blog/${r.slug}`} className="group block p-5 rounded-xl border border-border bg-card hover:border-primary/50 transition-all">
                        <Badge variant="outline" className="mb-2 text-xs">{r.category}</Badge>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1 line-clamp-2">{r.title}</h3>
                        <p className="text-xs text-muted-foreground">{r.readTime} · {r.date}</p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </article>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogArticle;
