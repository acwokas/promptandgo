import { useState } from "react";
import { Copy, Check, Play, Lock, Zap, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

type CodeLang = "javascript" | "python" | "curl";

interface Endpoint {
  method: "GET" | "POST";
  path: string;
  description: string;
  descriptionAsian: string;
  headers: string[];
  requestBody?: string;
  responseBody: string;
  category: string;
}

const ENDPOINTS: Endpoint[] = [
  {
    method: "GET", path: "/prompts", description: "List all available prompts with optional filters", descriptionAsian: "プロンプト一覧を取得",
    category: "Prompts", headers: ["Authorization: Bearer {api_key}", "Accept-Language: ja"],
    responseBody: `{
  "data": [
    { "id": "p_01", "title": "Keigo Business Email", "language": "ja", "category": "business" }
  ],
  "total": 523,
  "page": 1
}`,
  },
  {
    method: "POST", path: "/prompts/generate", description: "Generate a new prompt from parameters", descriptionAsian: "パラメータからプロンプト生成",
    category: "Prompts", headers: ["Authorization: Bearer {api_key}", "Content-Type: application/json"],
    requestBody: `{
  "language": "ko",
  "context": "business",
  "template": "honorific",
  "tone": "formal"
}`,
    responseBody: `{
  "prompt": "존댓말을 사용하여 비즈니스 이메일을 작성해 주세요...",
  "tokens": 42,
  "model": "gpt-5"
}`,
  },
  {
    method: "GET", path: "/languages", description: "List all supported Asian languages", descriptionAsian: "対応言語一覧",
    category: "Languages", headers: ["Authorization: Bearer {api_key}"],
    responseBody: `{
  "languages": [
    { "code": "ja", "name": "Japanese", "native": "日本語", "scripts": ["kanji", "hiragana", "katakana"] },
    { "code": "ko", "name": "Korean", "native": "한국어", "scripts": ["hangul"] }
  ]
}`,
  },
  {
    method: "POST", path: "/translate", description: "Translate prompt text between Asian languages", descriptionAsian: "プロンプトの翻訳",
    category: "Languages", headers: ["Authorization: Bearer {api_key}", "Content-Type: application/json"],
    requestBody: `{
  "text": "Please write a formal business proposal",
  "source": "en",
  "target": "ja",
  "formality": "keigo"
}`,
    responseBody: `{
  "translation": "敬語を使用してビジネス提案書を作成してください",
  "confidence": 0.96,
  "formality_level": "sonkeigo"
}`,
  },
  {
    method: "GET", path: "/templates/{lang}", description: "Get prompt templates for a specific language", descriptionAsian: "言語別テンプレート取得",
    category: "Templates", headers: ["Authorization: Bearer {api_key}"],
    responseBody: `{
  "language": "th",
  "templates": [
    { "id": "t_01", "name": "Thai Formal Letter", "tone": "formal", "uses": 1240 }
  ]
}`,
  },
  {
    method: "POST", path: "/prompts/optimize", description: "Optimize an existing prompt for a target platform", descriptionAsian: "プロンプト最適化",
    category: "Prompts", headers: ["Authorization: Bearer {api_key}", "Content-Type: application/json"],
    requestBody: `{
  "prompt": "Write a poem in Vietnamese about spring",
  "platform": "claude",
  "optimize_for": ["clarity", "cultural_context"]
}`,
    responseBody: `{
  "optimized": "Hãy viết một bài thơ về mùa xuân...",
  "improvements": ["Added tonal markers", "Cultural context enhanced"],
  "score_before": 72,
  "score_after": 94
}`,
  },
  {
    method: "GET", path: "/usage/stats", description: "Get API usage statistics for your account", descriptionAsian: "使用量統計",
    category: "Account", headers: ["Authorization: Bearer {api_key}"],
    responseBody: `{
  "period": "2026-04",
  "requests": 1847,
  "limit": 5000,
  "top_languages": ["ja", "ko", "zh"],
  "avg_response_ms": 230
}`,
  },
  {
    method: "POST", path: "/feedback", description: "Submit feedback on a prompt or translation", descriptionAsian: "フィードバック送信",
    category: "Account", headers: ["Authorization: Bearer {api_key}", "Content-Type: application/json"],
    requestBody: `{
  "prompt_id": "p_01",
  "rating": 5,
  "comment": "Excellent keigo accuracy"
}`,
    responseBody: `{
  "success": true,
  "message": "Thank you for your feedback"
}`,
  },
];

const RATE_LIMITS = [
  { tier: "Free", requests: "100/day", burst: "10/min", languages: 3 },
  { tier: "Pro", requests: "5,000/day", burst: "60/min", languages: 12 },
  { tier: "Enterprise", requests: "Unlimited", burst: "Custom", languages: 12 },
];

const METHOD_COLORS: Record<string, string> = {
  GET: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  POST: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

const SIDEBAR_SECTIONS = ["Authentication", "Endpoints", "Rate Limits"];

function codeFor(lang: CodeLang, ep: Endpoint): string {
  const base = "https://api.promptandgo.ai/v1";
  if (lang === "curl") {
    const d = ep.requestBody ? `\\\n  -d '${ep.requestBody.replace(/\n/g, "").replace(/\s{2,}/g, " ")}' ` : "";
    return `curl -X ${ep.method} "${base}${ep.path}" \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -H "Accept-Language: ja" ${d}`;
  }
  if (lang === "python") {
    if (ep.method === "GET") return `import requests\n\nr = requests.get("${base}${ep.path}",\n    headers={"Authorization": "Bearer YOUR_API_KEY"})\nprint(r.json())`;
    return `import requests\n\nr = requests.post("${base}${ep.path}",\n    headers={"Authorization": "Bearer YOUR_API_KEY"},\n    json=${ep.requestBody?.replace(/"/g, "'") ?? "{}"})\nprint(r.json())`;
  }
  if (ep.method === "GET") return `const res = await fetch("${base}${ep.path}", {\n  headers: { "Authorization": "Bearer YOUR_API_KEY" }\n});\nconst data = await res.json();`;
  return `const res = await fetch("${base}${ep.path}", {\n  method: "POST",\n  headers: {\n    "Authorization": "Bearer YOUR_API_KEY",\n    "Content-Type": "application/json"\n  },\n  body: JSON.stringify(${ep.requestBody ?? "{}"})\n});\nconst data = await res.json();`;
}

const ApiDocs = () => {
  const [openEndpoint, setOpenEndpoint] = useState<number | null>(0);
  const [codeLang, setCodeLang] = useState<CodeLang>("javascript");
  const [tryResults, setTryResults] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
    toast.success("Copied to clipboard");
  };

  const handleTry = (idx: number) => {
    setTryResults((p) => ({ ...p, [idx]: true }));
    toast.success("Request simulated successfully");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-16 md:py-20 text-center px-4">
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
          <Zap className="h-4 w-4 text-primary" />
          <span className="text-sm text-primary font-medium">REST API v1</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">PromptAndGo Developer API</h1>
        <p className="text-primary/80 font-medium mb-2">開発者向けAPI | 개발자 API | 开发者API | API สำหรับนักพัฒนา</p>
        <p className="text-muted-foreground max-w-xl mx-auto">Build Asian-language prompt workflows into your apps with our RESTful API.</p>
      </section>

      <div className="max-w-6xl mx-auto px-4 pb-20 flex gap-8">
        {/* Sidebar */}
        <nav className="hidden lg:block w-48 flex-shrink-0">
          <div className="sticky top-20 space-y-1">
            {SIDEBAR_SECTIONS.map((s) => (
              <a key={s} href={`#${s.toLowerCase().replace(/ /g, "-")}`} className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-1.5 px-3 rounded-md hover:bg-muted/50">
                {s}
              </a>
            ))}
            <div className="border-t border-border my-2" />
            {ENDPOINTS.map((ep, i) => (
              <a key={i} href={`#endpoint-${i}`} className="block text-xs text-muted-foreground hover:text-foreground transition-colors py-1 px-3 truncate">
                <span className={`text-[10px] font-mono font-bold mr-1 ${ep.method === "GET" ? "text-emerald-400" : "text-blue-400"}`}>{ep.method}</span>
                {ep.path}
              </a>
            ))}
          </div>
        </nav>

        {/* Main */}
        <div className="flex-1 min-w-0 space-y-12">
          {/* Auth */}
          <section id="authentication">
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2"><Lock className="h-5 w-5 text-primary" /> Authentication</h2>
            <div className="bg-card border border-border rounded-xl p-5">
              <p className="text-sm text-muted-foreground mb-3">All requests require a Bearer token in the <code className="bg-muted px-1.5 py-0.5 rounded text-xs text-foreground">Authorization</code> header.</p>
              <pre className="bg-muted/50 rounded-lg p-4 text-sm text-foreground overflow-x-auto font-mono">
                Authorization: Bearer pag_sk_live_xxxxxxxxxxxx
              </pre>
              <p className="text-xs text-muted-foreground mt-3">Generate API keys from your <a href="/settings" className="text-primary hover:underline">Settings</a> page.</p>
            </div>
          </section>

          {/* Endpoints */}
          <section id="endpoints">
            <h2 className="text-2xl font-bold text-foreground mb-6">Endpoints</h2>
            <div className="space-y-4">
              {ENDPOINTS.map((ep, idx) => {
                const isOpen = openEndpoint === idx;
                return (
                  <div key={idx} id={`endpoint-${idx}`} className="bg-card border border-border rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenEndpoint(isOpen ? null : idx)}
                      className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/30 transition-colors"
                    >
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${METHOD_COLORS[ep.method]}`}>{ep.method}</span>
                      <code className="text-sm font-mono text-foreground">{ep.path}</code>
                      <span className="text-xs text-muted-foreground hidden sm:inline ml-2">— {ep.description}</span>
                      {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground ml-auto" /> : <ChevronDown className="h-4 w-4 text-muted-foreground ml-auto" />}
                    </button>

                    {isOpen && (
                      <div className="border-t border-border p-5 space-y-5 animate-fade-in">
                        <p className="text-sm text-muted-foreground">{ep.description} <span className="text-primary/70">({ep.descriptionAsian})</span></p>

                        {/* Headers */}
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Headers</h4>
                          <div className="space-y-1">
                            {ep.headers.map((h, hi) => (
                              <code key={hi} className="block text-xs font-mono bg-muted/50 px-3 py-1.5 rounded text-foreground">{h}</code>
                            ))}
                          </div>
                        </div>

                        {/* Request */}
                        {ep.requestBody && (
                          <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Request Body</h4>
                            <pre className="bg-muted/50 rounded-lg p-4 text-xs font-mono text-foreground overflow-x-auto">{ep.requestBody}</pre>
                          </div>
                        )}

                        {/* Response */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Response</h4>
                            <button onClick={() => handleCopy(ep.responseBody, `resp-${idx}`)} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                              {copied === `resp-${idx}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                              Copy
                            </button>
                          </div>
                          <pre className="bg-muted/50 rounded-lg p-4 text-xs font-mono text-foreground overflow-x-auto">{ep.responseBody}</pre>
                        </div>

                        {/* Code Examples */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Code Example</h4>
                            <div className="flex gap-1 ml-auto">
                              {(["javascript", "python", "curl"] as CodeLang[]).map((l) => (
                                <button
                                  key={l}
                                  onClick={() => setCodeLang(l)}
                                  className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${codeLang === l ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
                                >
                                  {l === "javascript" ? "JS" : l === "python" ? "Python" : "cURL"}
                                </button>
                              ))}
                            </div>
                          </div>
                          <pre className="bg-muted/50 rounded-lg p-4 text-xs font-mono text-foreground overflow-x-auto whitespace-pre-wrap">{codeFor(codeLang, ep)}</pre>
                        </div>

                        {/* Try It */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleTry(idx)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                          >
                            <Play className="h-3.5 w-3.5" /> Try It
                          </button>
                          {tryResults[idx] && (
                            <span className="text-xs text-emerald-400 flex items-center gap-1"><Check className="h-3 w-3" /> 200 OK — simulated</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Rate Limits */}
          <section id="rate-limits">
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2"><Zap className="h-5 w-5 text-primary" /> Rate Limits</h2>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left p-3 text-xs font-semibold uppercase text-muted-foreground">Tier</th>
                    <th className="text-left p-3 text-xs font-semibold uppercase text-muted-foreground">Requests</th>
                    <th className="text-left p-3 text-xs font-semibold uppercase text-muted-foreground">Burst</th>
                    <th className="text-left p-3 text-xs font-semibold uppercase text-muted-foreground">Languages</th>
                  </tr>
                </thead>
                <tbody>
                  {RATE_LIMITS.map((r) => (
                    <tr key={r.tier} className="border-b border-border/50 last:border-0">
                      <td className="p-3 font-medium text-foreground">{r.tier}</td>
                      <td className="p-3 text-muted-foreground">{r.requests}</td>
                      <td className="p-3 text-muted-foreground">{r.burst}</td>
                      <td className="p-3 text-muted-foreground">{r.languages}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ApiDocs;
