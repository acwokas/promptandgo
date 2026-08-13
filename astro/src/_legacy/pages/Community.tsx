import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Share2, Globe, Lightbulb, HelpCircle, MessageSquare, ChevronLeft, ChevronRight, Trophy } from "lucide-react";

interface Thread {
  id: number;
  username: string;
  avatar: string;
  title: string;
  preview: string;
  category: string;
  replies: number;
  timeAgo: string;
  flag: string;
  language: string;
}

const CATEGORIES = [
  { name: "All", icon: MessageSquare },
  { name: "Prompt Sharing", icon: Share2 },
  { name: "Language Tips", icon: Globe },
  { name: "Feature Requests", icon: Lightbulb },
  { name: "Help & Support", icon: HelpCircle },
];

const THREADS: Thread[] = [
  { id: 1, username: "Tanaka Yuki", avatar: "TY", title: "Best keigo prompts for business emails", preview: "I've compiled a set of 敬語 templates that work amazingly with GPT-5 for formal Japanese correspondence...", category: "Prompt Sharing", replies: 24, timeAgo: "2 hours ago", flag: "🇯🇵", language: "Japanese" },
  { id: 2, username: "Kim Soo-jin", avatar: "KS", title: "Korean 존댓말 templates collection", preview: "Sharing my collection of formal Korean honorific templates. These cover business meetings, emails...", category: "Prompt Sharing", replies: 18, timeAgo: "3 hours ago", flag: "🇰🇷", language: "Korean" },
  { id: 3, username: "Chen Wei", avatar: "CW", title: "Classical Chinese poetry prompt techniques", preview: "How to craft prompts that generate authentic 古诗 with proper tonal patterns and literary allusions...", category: "Language Tips", replies: 31, timeAgo: "5 hours ago", flag: "🇨🇳", language: "Mandarin" },
  { id: 4, username: "Somchai P.", avatar: "SP", title: "How to handle Thai tones in prompts", preview: "Thai tonal markers are tricky for AI. Here's my approach to preserving tonal accuracy in generated text...", category: "Language Tips", replies: 12, timeAgo: "Yesterday", flag: "🇹🇭", language: "Thai" },
  { id: 5, username: "Nguyen Thi Lan", avatar: "NL", title: "Vietnamese diacritical marks guide", preview: "A comprehensive guide to ensuring AI correctly handles Vietnamese diacriticals like ă, â, ơ, ư...", category: "Language Tips", replies: 15, timeAgo: "Yesterday", flag: "🇻🇳", language: "Vietnamese" },
  { id: 6, username: "Budi Santoso", avatar: "BS", title: "Bahasa formal vs informal toggle request", preview: "Would love a one-click toggle between formal Bahasa Indonesia and bahasa gaul in the prompt builder...", category: "Feature Requests", replies: 27, timeAgo: "2 days ago", flag: "🇮🇩", language: "Indonesian" },
  { id: 7, username: "Sato Haruki", avatar: "SH", title: "Trouble with katakana loan words in prompts", preview: "My prompts keep generating incorrect katakana for English loan words. Has anyone found a workaround?", category: "Help & Support", replies: 9, timeAgo: "2 days ago", flag: "🇯🇵", language: "Japanese" },
  { id: 8, username: "Park Ji-hoon", avatar: "PJ", title: "K-drama dialogue prompt templates", preview: "I've been creating prompts that generate natural K-drama style dialogue with proper speech levels...", category: "Prompt Sharing", replies: 42, timeAgo: "3 days ago", flag: "🇰🇷", language: "Korean" },
  { id: 9, username: "Lin Mei-ling", avatar: "LM", title: "Request: Traditional vs Simplified Chinese toggle", preview: "It would be great to have an option to switch between 繁體中文 and 简体中文 in prompt output...", category: "Feature Requests", replies: 19, timeAgo: "3 days ago", flag: "🇹🇼", language: "Mandarin" },
  { id: 10, username: "Priya Sharma", avatar: "PS", title: "Hindi Devanagari script rendering issues", preview: "Some conjunct characters aren't rendering correctly in the prompt preview. Screenshots attached...", category: "Help & Support", replies: 7, timeAgo: "4 days ago", flag: "🇮🇳", language: "Hindi" },
  { id: 11, username: "Tanaka Rina", avatar: "TR", title: "Prompt chain for Japanese document translation", preview: "A multi-step prompt chain that first identifies the formality level then translates accordingly...", category: "Prompt Sharing", replies: 33, timeAgo: "5 days ago", flag: "🇯🇵", language: "Japanese" },
  { id: 12, username: "Tran Van Duc", avatar: "TD", title: "Vietnamese business letter format guide", preview: "Standard Vietnamese business letter structure with AI prompts that generate culturally appropriate...", category: "Language Tips", replies: 11, timeAgo: "1 week ago", flag: "🇻🇳", language: "Vietnamese" },
];

const LEADERBOARD = [
  { name: "Tanaka Yuki", points: 2840, badge: "🥇", avatar: "TY" },
  { name: "Chen Wei", points: 2210, badge: "🥈", avatar: "CW" },
  { name: "Kim Soo-jin", points: 1980, badge: "🥉", avatar: "KS" },
  { name: "Park Ji-hoon", points: 1650, badge: "⭐", avatar: "PJ" },
  { name: "Nguyen Thi Lan", points: 1420, badge: "⭐", avatar: "NL" },
];

const CATEGORY_COLORS: Record<string, string> = {
  "Prompt Sharing": "bg-blue-500/20 text-blue-400",
  "Language Tips": "bg-emerald-500/20 text-emerald-400",
  "Feature Requests": "bg-amber-500/20 text-amber-400",
  "Help & Support": "bg-purple-500/20 text-purple-400",
};

const PAGE_SIZE = 6;

const Community = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return THREADS.filter((t) => {
      const matchCat = activeCategory === "All" || t.category === activeCategory;
      const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.preview.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, activeCategory]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-16 md:py-20 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">PromptAndGo Community</h1>
        <p className="text-primary/80 font-medium mb-2">コミュニティ | 커뮤니티 | 社区 | ชุมชน | Cộng đồng | Komunitas</p>
        <p className="text-muted-foreground max-w-lg mx-auto">Connect with prompt engineers across Asia. Share, learn, and build together.</p>
      </section>

      {/* Category tabs */}
      <div className="max-w-5xl mx-auto px-4 mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.name}
                onClick={() => { setActiveCategory(cat.name); setPage(1); }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  activeCategory === cat.name
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:border-primary/50"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {cat.name}
              </button>
            );
          })}
        </div>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text" placeholder="Search discussions..." value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>
          <Link to="/contact" className="h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2">
            <MessageSquare className="h-4 w-4" /> Start a Discussion
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-20 flex gap-8">
        {/* Threads */}
        <div className="flex-1 min-w-0 space-y-3">
          {paged.map((t) => (
            <div key={t.id} className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center flex-shrink-0">
                  {t.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-sm font-semibold text-foreground">{t.title}</h3>
                    <span className="text-sm">{t.flag}</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{t.preview}</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[t.category]}`}>{t.category}</span>
                    <span className="text-[10px] text-muted-foreground">{t.username}</span>
                    <span className="text-[10px] text-muted-foreground">💬 {t.replies} replies</span>
                    <span className="text-[10px] text-muted-foreground">{t.timeAgo}</span>
                    <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{t.language}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {paged.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No discussions found.</p>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Leaderboard sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-20 bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
              <Trophy className="h-4 w-4 text-primary" /> Top Contributors
            </h3>
            <div className="space-y-3">
              {LEADERBOARD.map((u, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">{u.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{u.name}</p>
                    <p className="text-[10px] text-muted-foreground">{u.points.toLocaleString()} pts</p>
                  </div>
                  <span className="text-sm">{u.badge}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Community;
