import { useState, useMemo } from "react";
import { Search, Printer } from "lucide-react";

interface Shortcut {
  keys: string[];
  action: string;
  actionAsian: string;
  category: string;
}

const SHORTCUTS: Shortcut[] = [
  // Navigation
  { keys: ["G", "H"], action: "Go to Home", actionAsian: "ホームへ移動", category: "Navigation" },
  { keys: ["G", "L"], action: "Go to Library", actionAsian: "ライブラリへ", category: "Navigation" },
  { keys: ["G", "D"], action: "Go to Dashboard", actionAsian: "대시보드로 이동", category: "Navigation" },
  { keys: ["G", "P"], action: "Go to Pricing", actionAsian: "价格页面", category: "Navigation" },
  { keys: ["G", "S"], action: "Go to Settings", actionAsian: "設定へ", category: "Navigation" },
  { keys: ["G", "B"], action: "Go to Blog", actionAsian: "블로그로", category: "Navigation" },
  // Editing
  { keys: ["Ctrl", "C"], action: "Copy prompt to clipboard", actionAsian: "プロンプトをコピー", category: "Editing" },
  { keys: ["Ctrl", "S"], action: "Save current prompt", actionAsian: "프롬프트 저장", category: "Editing" },
  { keys: ["Ctrl", "Z"], action: "Undo last edit", actionAsian: "撤销编辑", category: "Editing" },
  { keys: ["Ctrl", "Shift", "V"], action: "Paste as plain text", actionAsian: "テキストとして貼り付け", category: "Editing" },
  { keys: ["Tab"], action: "Accept autocomplete suggestion", actionAsian: "자동완성 수락", category: "Editing" },
  // Search
  { keys: ["Ctrl", "K"], action: "Open global search", actionAsian: "グローバル検索を開く", category: "Search" },
  { keys: ["/"], action: "Focus search bar", actionAsian: "검색창 포커스", category: "Search" },
  { keys: ["Esc"], action: "Close search / modal", actionAsian: "关闭搜索", category: "Search" },
  { keys: ["Ctrl", "F"], action: "Search within page", actionAsian: "ページ内検索", category: "Search" },
  // Language Tools
  { keys: ["Alt", "J"], action: "Switch to Japanese IME", actionAsian: "日本語入力に切替", category: "Language Tools" },
  { keys: ["Alt", "K"], action: "Toggle Korean Hangul", actionAsian: "한글 전환", category: "Language Tools" },
  { keys: ["Alt", "C"], action: "Pinyin input mode", actionAsian: "拼音输入模式", category: "Language Tools" },
  { keys: ["Alt", "T"], action: "Thai keyboard layout", actionAsian: "แป้นพิมพ์ไทย", category: "Language Tools" },
  { keys: ["Alt", "V"], action: "Vietnamese TELEX mode", actionAsian: "Chế độ TELEX", category: "Language Tools" },
  { keys: ["Alt", "I"], action: "Bahasa Indonesia mode", actionAsian: "Mode Bahasa", category: "Language Tools" },
  { keys: ["Ctrl", "Shift", "L"], action: "Toggle language picker", actionAsian: "言語選択を表示", category: "Language Tools" },
];

const CATEGORIES = ["Navigation", "Editing", "Search", "Language Tools"];

const KeyboardShortcuts = () => {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return SHORTCUTS;
    const q = search.toLowerCase();
    return SHORTCUTS.filter(
      (s) => s.action.toLowerCase().includes(q) || s.actionAsian.includes(q) || s.keys.join(" ").toLowerCase().includes(q)
    );
  }, [search]);

  const grouped = useMemo(() => {
    const map: Record<string, Shortcut[]> = {};
    for (const cat of CATEGORIES) {
      const items = filtered.filter((s) => s.category === cat);
      if (items.length) map[cat] = items;
    }
    return map;
  }, [filtered]);

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-background">
      <style>{`
        @media print {
          header, footer, .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          .print-card { border: 1px solid #ccc !important; background: white !important; break-inside: avoid; }
          .print-card kbd { background: #eee !important; color: #333 !important; border: 1px solid #ccc !important; }
        }
      `}</style>

      {/* Hero */}
      <section className="py-16 md:py-20 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
          ⌨️ Keyboard Shortcuts
        </h1>
        <p className="text-lg text-muted-foreground mb-2">
          Power-user reference for PromptAndGo
        </p>
        <p className="text-sm text-primary/80">キーボードショートカット | 키보드 단축키 | 快捷键</p>
      </section>

      {/* Toolbar */}
      <div className="max-w-4xl mx-auto px-4 mb-10 no-print">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Filter shortcuts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>
          <button
            onClick={handlePrint}
            className="h-10 px-5 rounded-lg bg-card border border-border text-foreground text-sm font-medium hover:border-primary/50 transition-colors flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            Print Reference
          </button>
        </div>
      </div>

      {/* Shortcuts Grid */}
      <div className="max-w-4xl mx-auto px-4 pb-20 space-y-10">
        {Object.entries(grouped).map(([category, items]) => (
          <section key={category}>
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              {category}
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {items.map((shortcut, i) => (
                <div
                  key={i}
                  className="print-card bg-card border border-border rounded-lg p-4 flex items-start justify-between gap-3 hover:border-primary/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{shortcut.action}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{shortcut.actionAsian}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {shortcut.keys.map((key, ki) => (
                      <span key={ki} className="flex items-center gap-1">
                        {ki > 0 && <span className="text-xs text-muted-foreground">+</span>}
                        <kbd className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-md bg-muted border border-border text-xs font-mono font-semibold text-foreground shadow-[0_2px_0_0_hsl(var(--border))]">
                          {key}
                        </kbd>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {Object.keys(grouped).length === 0 && (
          <p className="text-center text-muted-foreground py-12">No shortcuts match your filter.</p>
        )}
      </div>
    </div>
  );
};

export default KeyboardShortcuts;
