import { useState, useRef } from "react";

const PLATFORMS = [
  { id: "chatgpt",  label: "ChatGPT" },
  { id: "claude",   label: "Claude" },
  { id: "gemini",   label: "Gemini" },
  { id: "mistral",  label: "Mistral" },
  { id: "grok",     label: "Grok" },
  { id: "deepseek", label: "DeepSeek" },
  { id: "qwen",     label: "Qwen" },
  { id: "ernie",    label: "Ernie Bot" },
  { id: "midjourney", label: "MidJourney" },
];

const LANGS = [
  { code: "en", label: "English" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
  { code: "zh", label: "中文" },
  { code: "th", label: "ไทย" },
  { code: "vi", label: "Tiếng Việt" },
  { code: "id", label: "Bahasa Indonesia" },
];

const SUPABASE_URL = (import.meta as any).env?.PUBLIC_SUPABASE_URL || "https://dkdakwyrqyfdkyukqmqs.supabase.co";
const SUPABASE_ANON = (import.meta as any).env?.PUBLIC_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrZGFrd3lycXlmZGt5dWtxbXFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwMjI3ODEsImV4cCI6MjA5MzU5ODc4MX0.S-qUEvo5Xapb3h8CfEta0bDvYesAOTV_oUnnFpFb7Tc";

export default function OptimizerForm() {
  const [prompt, setPrompt] = useState("");
  const [tool, setTool] = useState("chatgpt");
  const [lang, setLang] = useState("en");
  const [goal, setGoal] = useState("");
  const [output, setOutput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  async function optimize(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;
    setError(null);
    setOutput("");
    setBusy(true);
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/optimize-prompt`, {
        method: "POST",
        signal: ac.signal,
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_ANON,
          "Authorization": `Bearer ${SUPABASE_ANON}`,
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          aiTool: PLATFORMS.find(p => p.id === tool)?.label,
          goal: goal || `Output should be in ${LANGS.find(l => l.code === lang)?.label}`,
          focusAreas: [],
        }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `Request failed (${res.status})`);
      }
      if (!res.body) throw new Error("No response body");

      // Stream SSE
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;
          try {
            const j = JSON.parse(data);
            const tok = j?.choices?.[0]?.delta?.content;
            if (tok) setOutput(prev => prev + tok);
          } catch {}
        }
      }
    } catch (err: any) {
      if (err.name !== "AbortError") setError(err.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  function copyOutput() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="rounded-3xl border border-border/60 bg-card overflow-hidden shadow-brand">
      <form onSubmit={optimize} className="p-5 md:p-7">
        <label htmlFor="prompt" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Your prompt
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Write a polite follow-up email to a Japanese client about a proposal."
          rows={5}
          className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm md:text-base resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
        />
        <div className="mt-1.5 flex items-center justify-between text-xs text-muted-foreground">
          <span>{prompt.length}/10,000</span>
          {prompt && <button type="button" onClick={() => setPrompt("")} className="hover:text-foreground">Clear</button>}
        </div>

        <div className="mt-5 grid sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">For platform</label>
            <select value={tool} onChange={(e) => setTool(e.target.value)} className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 h-11 text-sm">
              {PLATFORMS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">In language</label>
            <select value={lang} onChange={(e) => setLang(e.target.value)} className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 h-11 text-sm">
              {LANGS.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Goal (optional)</label>
            <input
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. respectful B2B email"
              className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 h-11 text-sm"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="submit"
            disabled={busy || !prompt.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-brand text-white px-6 h-12 font-semibold shadow-brand hover:shadow-brand-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {busy ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin"></span>
                Optimising…
              </>
            ) : (
              <>
                ✨ Optimise prompt
              </>
            )}
          </button>
          {busy && (
            <button type="button" onClick={() => abortRef.current?.abort()} className="text-sm text-muted-foreground hover:text-foreground">
              Cancel
            </button>
          )}
        </div>
      </form>

      {(output || error) && (
        <div className="border-t border-border/50 bg-gradient-brand-soft p-5 md:p-7">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {error ? "Error" : "Optimised"}
            </span>
            {output && !error && (
              <button onClick={copyOutput} className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
                {copied ? "✓ Copied" : "Copy"}
              </button>
            )}
          </div>
          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : (
            <pre className="text-sm md:text-base whitespace-pre-wrap font-sans leading-relaxed">{output}</pre>
          )}
        </div>
      )}
    </div>
  );
}
