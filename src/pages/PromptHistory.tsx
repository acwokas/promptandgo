import SEO from "@/components/SEO";
import { useState, useMemo } from "react";
import { Search, Download, Clock, BarChart3, Globe, Cpu, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const LANG_COLORS: Record<string, string> = {
  JP: "bg-red-500/20 text-red-400",
  KO: "bg-blue-500/20 text-blue-400",
  ZH: "bg-amber-500/20 text-amber-400",
  TH: "bg-purple-500/20 text-purple-400",
  VI: "bg-emerald-500/20 text-emerald-400",
};

const PLATFORMS = ["ChatGPT", "Claude", "Gemini"] as const;

const MOCK_HISTORY = [
  { id: 1, prompt: "取引先への四半期報告メールを敬語で作成してください", lang: "JP", platform: "ChatGPT", chars: 142, date: "2026-04-08T09:30:00" },
  { id: 2, prompt: "고객 피드백에 대한 정중한 답변을 작성해 주세요", lang: "KO", platform: "Claude", chars: 98, date: "2026-04-07T14:15:00" },
  { id: 3, prompt: "请为新产品发布会撰写一份正式的邀请函", lang: "ZH", platform: "Gemini", chars: 76, date: "2026-04-07T11:00:00" },
  { id: 4, prompt: "เขียนอีเมลเชิญประชุมผู้บริหารอย่างเป็นทางการ", lang: "TH", platform: "ChatGPT", chars: 112, date: "2026-04-06T16:45:00" },
  { id: 5, prompt: "Viết email cảm ơn khách hàng sau cuộc họp quan trọng", lang: "VI", platform: "Claude", chars: 89, date: "2026-04-06T10:20:00" },
  { id: 6, prompt: "新入社員向けの研修ガイドラインを作成してください", lang: "JP", platform: "ChatGPT", chars: 156, date: "2026-04-05T08:30:00" },
  { id: 7, prompt: "마케팅 캠페인 보고서를 한국어로 작성해 주세요", lang: "KO", platform: "Gemini", chars: 134, date: "2026-04-04T13:00:00" },
  { id: 8, prompt: "为跨境电商平台撰写产品描述文案", lang: "ZH", platform: "ChatGPT", chars: 88, date: "2026-04-03T15:30:00" },
  { id: 9, prompt: "สร้างแคปชั่นโพสต์ Instagram สำหรับร้านกาแฟ", lang: "TH", platform: "Claude", chars: 95, date: "2026-04-02T09:15:00" },
  { id: 10, prompt: "Tạo nội dung quảng cáo Facebook cho sản phẩm mới", lang: "VI", platform: "Gemini", chars: 102, date: "2026-04-01T11:45:00" },
];

const WEEKLY_DATA = [18, 24, 31, 22, 38, 42, 35];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const PromptHistory = () => {
  const { toast } = useToast();
  const [searchVal, setSearchVal] = useState("");
  const [filterLang, setFilterLang] = useState<string>("all");
  const [filterPlatform, setFilterPlatform] = useState<string>("all");

  const filtered = useMemo(() => {
    return MOCK_HISTORY.filter((h) => {
      if (filterLang !== "all" && h.lang !== filterLang) return false;
      if (filterPlatform !== "all" && h.platform !== filterPlatform) return false;
      if (searchVal && !h.prompt.toLowerCase().includes(searchVal.toLowerCase())) return false;
      return true;
    });
  }, [searchVal, filterLang, filterPlatform]);

  const maxBar = Math.max(...WEEKLY_DATA);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title="Prompt History — PromptAndGo" description="View and manage your AI prompt history across languages and platforms." />

      {/* Hero */}
      <section className="relative py-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="relative max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Your Prompt History</h1>
          <p className="text-muted-foreground">プロンプト履歴 · 프롬프트 기록 · 提示词历史 · ประวัติพรอมต์</p>
        </div>
      </section>

      <div className="container max-w-6xl mx-auto px-4 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input value={searchVal} onChange={(e) => setSearchVal(e.target.value)} placeholder="Search prompts..." className="pl-9" />
              </div>
              <select value={filterLang} onChange={(e) => setFilterLang(e.target.value)} className="h-10 px-3 rounded-lg border border-border bg-card text-sm text-foreground">
                <option value="all">All Languages</option>
                {Object.keys(LANG_COLORS).map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
              <select value={filterPlatform} onChange={(e) => setFilterPlatform(e.target.value)} className="h-10 px-3 rounded-lg border border-border bg-card text-sm text-foreground">
                <option value="all">All Platforms</option>
                {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => toast({ title: "Export started", description: "Your history is being exported as CSV." })}>
                <Download className="h-4 w-4" /> Export
              </Button>
            </div>

            {/* Timeline */}
            <div className="space-y-0">
              {filtered.map((item, idx) => {
                const d = new Date(item.date);
                const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                const timeStr = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
                return (
                  <div key={item.id} className="flex gap-4 group">
                    {/* Timeline line */}
                    <div className="flex flex-col items-center w-10 shrink-0">
                      <div className="w-3 h-3 rounded-full bg-primary border-2 border-background mt-1.5" />
                      {idx < filtered.length - 1 && <div className="w-px flex-1 bg-border" />}
                    </div>
                    {/* Card */}
                    <div className="flex-1 rounded-xl border border-border bg-card p-4 mb-4 hover:border-primary/30 transition-colors">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={`text-xs font-mono px-2 py-0.5 rounded ${LANG_COLORS[item.lang]}`}>{item.lang}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1"><Cpu className="h-3 w-3" />{item.platform}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1"><FileText className="h-3 w-3" />{item.chars} chars</span>
                        <span className="ml-auto text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{dateStr} {timeStr}</span>
                      </div>
                      <p className="text-sm leading-relaxed">{item.prompt}</p>
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No prompts found matching your filters.</p>
                  <p className="text-sm mt-1">検索結果がありません</p>
                </div>
              )}
            </div>
          </div>

          {/* Stats sidebar */}
          <aside className="lg:w-72 shrink-0 space-y-6">
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" /> Usage Statistics</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { label: "Total Prompts", value: "247" },
                  { label: "Languages", value: "5" },
                  { label: "Most Active", value: "Friday" },
                  { label: "Top Platform", value: "ChatGPT" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-xl font-bold text-primary">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Mini bar chart */}
              <p className="text-xs font-medium text-muted-foreground mb-2">Weekly Activity</p>
              <div className="flex items-end gap-1.5 h-20">
                {WEEKLY_DATA.map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full rounded-sm bg-primary/80 transition-all" style={{ height: `${(val / maxBar) * 100}%` }} />
                    <span className="text-[10px] text-muted-foreground">{DAYS[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold mb-3 flex items-center gap-2"><Globe className="h-4 w-4 text-primary" /> Language Breakdown</h3>
              {[
                { lang: "JP", pct: 32, label: "Japanese" },
                { lang: "KO", pct: 24, label: "Korean" },
                { lang: "ZH", pct: 20, label: "Chinese" },
                { lang: "TH", pct: 14, label: "Thai" },
                { lang: "VI", pct: 10, label: "Vietnamese" },
              ].map((l) => (
                <div key={l.lang} className="mb-3 last:mb-0">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{l.label}</span>
                    <span className="font-mono text-muted-foreground">{l.pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary/70" style={{ width: `${l.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PromptHistory;
