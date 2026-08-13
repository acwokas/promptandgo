import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Grid3X3, List, Copy, Pencil, Trash2, Share2, Heart, Search,
  FolderOpen, ArrowUpDown, Download, Upload, CheckSquare, Star, Bookmark
} from "lucide-react";
import { toast } from "sonner";

interface SavedPrompt {
  id: string;
  title: string;
  snippet: string;
  language: string;
  flag: string;
  category: string;
  folder: string;
  dateSaved: string;
  rating: number;
  charCount: number;
  isFavorite: boolean;
}

const MOCK_PROMPTS: SavedPrompt[] = [
  { id: "1", title: "Keigo Business Email Opener", snippet: "敬語を使用してビジネスメールの書き出しを作成してください。相手は取引先の部長で...", language: "Japanese", flag: "🇯🇵", category: "Business", folder: "Business", dateSaved: "2026-04-05", rating: 5, charCount: 245, isFavorite: true },
  { id: "2", title: "Korean Honorific Meeting Notes", snippet: "존댓말을 사용하여 회의록을 작성해 주세요. 참석자는 김 사장님, 이 부장님...", language: "Korean", flag: "🇰🇷", category: "Business", folder: "Business", dateSaved: "2026-04-03", rating: 4, charCount: 198, isFavorite: false },
  { id: "3", title: "Classical Chinese Poetry Generator", snippet: "请以唐诗风格创作一首关于月亮的五言绝句，注意平仄和押韵...", language: "Mandarin", flag: "🇨🇳", category: "Creative", folder: "Creative", dateSaved: "2026-04-01", rating: 5, charCount: 312, isFavorite: true },
  { id: "4", title: "Thai Cooking Recipe Translator", snippet: "แปลสูตรอาหารไทยต่อไปนี้เป็นภาษาอังกฤษ โดยคงชื่ออาหารเป็นภาษาไทย...", language: "Thai", flag: "🇹🇭", category: "Personal", folder: "Personal", dateSaved: "2026-03-28", rating: 4, charCount: 178, isFavorite: false },
  { id: "5", title: "Vietnamese Technical Documentation", snippet: "Hãy viết tài liệu kỹ thuật bằng tiếng Việt cho API endpoint sau đây...", language: "Vietnamese", flag: "🇻🇳", category: "Technical", folder: "Technical", dateSaved: "2026-03-25", rating: 5, charCount: 402, isFavorite: false },
  { id: "6", title: "Bahasa Indonesia Formal Letter", snippet: "Buatlah surat resmi dalam Bahasa Indonesia untuk mengajukan kerjasama bisnis...", language: "Indonesian", flag: "🇮🇩", category: "Business", folder: "Business", dateSaved: "2026-03-20", rating: 4, charCount: 267, isFavorite: true },
  { id: "7", title: "Japanese Anime Dialogue Writer", snippet: "アニメのキャラクターの台詞を作成してください。キャラクターは高校生の女の子で...", language: "Japanese", flag: "🇯🇵", category: "Creative", folder: "Creative", dateSaved: "2026-03-18", rating: 3, charCount: 189, isFavorite: false },
  { id: "8", title: "Korean Product Description", snippet: "다음 제품에 대한 한국어 마케팅 설명을 작성해 주세요. 톤은 친근하면서도 전문적으로...", language: "Korean", flag: "🇰🇷", category: "Business", folder: "Business", dateSaved: "2026-03-15", rating: 4, charCount: 223, isFavorite: false },
];

const FOLDERS = ["All", "Business", "Creative", "Technical", "Personal"];
const SORT_OPTIONS = ["Date", "Name", "Language", "Rating", "Characters"] as const;

const SavedPrompts = () => {
  const [prompts, setPrompts] = useState(MOCK_PROMPTS);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [activeFolder, setActiveFolder] = useState("All");
  const [sortBy, setSortBy] = useState<typeof SORT_OPTIONS[number]>("Date");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    let items = prompts.filter((p) => {
      const matchFolder = activeFolder === "All" || p.folder === activeFolder;
      const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.snippet.toLowerCase().includes(search.toLowerCase());
      return matchFolder && matchSearch;
    });
    items.sort((a, b) => {
      switch (sortBy) {
        case "Name": return a.title.localeCompare(b.title);
        case "Language": return a.language.localeCompare(b.language);
        case "Rating": return b.rating - a.rating;
        case "Characters": return b.charCount - a.charCount;
        default: return b.dateSaved.localeCompare(a.dateSaved);
      }
    });
    return items;
  }, [prompts, search, activeFolder, sortBy]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  const selectAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((p) => p.id)));
  };

  const deleteSelected = () => {
    setPrompts((prev) => prev.filter((p) => !selected.has(p.id)));
    toast.success(`Deleted ${selected.size} prompt(s)`);
    setSelected(new Set());
  };

  const toggleFavorite = (id: string) => {
    setPrompts((prev) => prev.map((p) => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const handleDelete = (id: string) => {
    setPrompts((prev) => prev.filter((p) => p.id !== id));
    toast.success("Prompt deleted");
  };

  const isEmpty = prompts.length === 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-12 md:py-16 text-center px-4">
        <Bookmark className="h-10 w-10 text-primary mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">Your Prompt Library</h1>
        <p className="text-primary/80 font-medium">あなたのプロンプト | 나의 프롬프트 | 我的提示 | พรอมต์ของฉัน</p>
      </section>

      {isEmpty ? (
        <div className="max-w-md mx-auto text-center px-4 pb-20">
          <div className="bg-card border border-border rounded-xl p-10">
            <p className="text-4xl mb-4">📝</p>
            <h2 className="text-lg font-bold text-foreground mb-2">No Saved Prompts Yet</h2>
            <p className="text-sm text-muted-foreground mb-2">まだプロンプトが保存されていません</p>
            <p className="text-sm text-muted-foreground mb-6">Start exploring and save prompts you love!</p>
            <Link to="/library" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
              Browse Prompts
            </Link>
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 pb-20 flex gap-6">
          {/* Folder sidebar */}
          <aside className="hidden md:block w-48 flex-shrink-0">
            <div className="sticky top-20 space-y-1">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-3">Folders</h3>
              {FOLDERS.map((f) => {
                const count = f === "All" ? prompts.length : prompts.filter((p) => p.folder === f).length;
                return (
                  <button
                    key={f}
                    onClick={() => { setActiveFolder(f); setSelected(new Set()); }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeFolder === f ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <FolderOpen className="h-3.5 w-3.5" />
                    {f}
                    <span className="ml-auto text-xs opacity-60">{count}</span>
                  </button>
                );
              })}

              <div className="border-t border-border my-4" />
              <button onClick={() => toast.info("Import coming soon")} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                <Upload className="h-3.5 w-3.5" /> Import
              </button>
              <button onClick={() => toast.info("Export coming soon")} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                <Download className="h-3.5 w-3.5" /> Export
              </button>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text" placeholder="Search saved prompts..." value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-lg bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof SORT_OPTIONS[number])}
                  className="h-10 px-3 rounded-lg bg-card border border-border text-foreground text-sm focus:outline-none cursor-pointer"
                >
                  {SORT_OPTIONS.map((s) => <option key={s} value={s}>Sort: {s}</option>)}
                </select>
                <button onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")} className="h-10 w-10 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                  {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Bulk actions */}
            {selected.size > 0 && (
              <div className="flex items-center gap-3 mb-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <span className="text-sm text-foreground font-medium">{selected.size} selected</span>
                <button onClick={selectAll} className="text-xs text-primary hover:underline">{selected.size === filtered.length ? "Deselect All" : "Select All"}</button>
                <button onClick={deleteSelected} className="text-xs text-destructive hover:underline ml-auto flex items-center gap-1"><Trash2 className="h-3 w-3" /> Delete Selected</button>
              </div>
            )}

            {/* Grid / List */}
            <div className={viewMode === "grid" ? "grid sm:grid-cols-2 gap-3" : "space-y-3"}>
              {filtered.map((p) => (
                <div
                  key={p.id}
                  className={`bg-card border rounded-xl p-4 transition-colors ${selected.has(p.id) ? "border-primary" : "border-border hover:border-primary/30"}`}
                >
                  <div className="flex items-start gap-3">
                    <button onClick={() => toggleSelect(p.id)} className="mt-0.5 flex-shrink-0">
                      <CheckSquare className={`h-4 w-4 ${selected.has(p.id) ? "text-primary" : "text-muted-foreground/40"}`} />
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-sm font-semibold text-foreground">{p.title}</h3>
                        <span className="text-sm">{p.flag}</span>
                        <button onClick={() => toggleFavorite(p.id)} className="ml-auto">
                          <Heart className={`h-4 w-4 ${p.isFavorite ? "fill-red-400 text-red-400" : "text-muted-foreground/40 hover:text-red-400"} transition-colors`} />
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{p.snippet}</p>
                      <div className="flex items-center gap-2 flex-wrap mb-3">
                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{p.language}</span>
                        <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded">{p.category}</span>
                        <span className="text-[10px] text-muted-foreground">{p.charCount} chars</span>
                        <span className="text-[10px] text-muted-foreground">{p.dateSaved}</span>
                        <span className="flex items-center gap-0.5 text-[10px] text-amber-400">
                          {Array.from({ length: p.rating }, (_, i) => <Star key={i} className="h-2.5 w-2.5 fill-current" />)}
                        </span>
                      </div>
                      <div className="flex gap-1.5">
                        <button onClick={() => handleCopy(p.snippet)} className="px-2 py-1 rounded text-[10px] bg-muted text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"><Copy className="h-3 w-3" /> Copy</button>
                        <button onClick={() => toast.info("Edit coming soon")} className="px-2 py-1 rounded text-[10px] bg-muted text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"><Pencil className="h-3 w-3" /> Edit</button>
                        <button onClick={() => toast.info("Share coming soon")} className="px-2 py-1 rounded text-[10px] bg-muted text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"><Share2 className="h-3 w-3" /> Share</button>
                        <button onClick={() => handleDelete(p.id)} className="px-2 py-1 rounded text-[10px] bg-muted text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-1"><Trash2 className="h-3 w-3" /> Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <p className="text-center text-muted-foreground py-12">No prompts match your search.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedPrompts;
