import { useEffect, useMemo, useState } from "react";

interface Prompt {
  id: string;
  slug: string;
  title: string;
  what_for: string | null;
  excerpt: string | null;
  is_pro: boolean;
  category_id: string;
  subcategory_id: string | null;
}
interface Cat { id: string; name: string; slug: string }
interface Sub { id: string; name: string; slug: string; category_id: string }

interface Props {
  prompts: Prompt[];
  categories: Cat[];
  subcategories: Sub[];
}

export default function LibrarySearch({ prompts, categories, subcategories }: Props) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("");
  const [premiumOnly, setPremiumOnly] = useState(false);
  const [show, setShow] = useState(24);

  // Read URL params on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const initialQ = params.get("q");
    const initialCat = params.get("category");
    if (initialQ) setQ(initialQ);
    if (initialCat) setCat(initialCat);
  }, []);

  const catById = useMemo(() => Object.fromEntries(categories.map(c => [c.id, c])), [categories]);
  const subById = useMemo(() => Object.fromEntries(subcategories.map(s => [s.id, s])), [subcategories]);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return prompts.filter(p => {
      if (premiumOnly && !p.is_pro) return false;
      if (cat && catById[p.category_id]?.slug !== cat) return false;
      if (!needle) return true;
      const hay = [p.title, p.what_for || "", p.excerpt || ""].join(" ").toLowerCase();
      return hay.includes(needle);
    });
  }, [prompts, q, cat, premiumOnly, catById]);

  const visible = results.slice(0, show);

  return (
    <div>
      <div className="rounded-2xl border border-border bg-card p-4 md:p-5 mb-6">
        <div className="grid md:grid-cols-[1fr_auto_auto] gap-3 items-center">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search 986 prompts..."
              className="w-full pl-10 pr-4 h-11 rounded-xl border border-border bg-background text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            className="h-11 rounded-xl border border-border bg-background px-3 text-sm">
            <option value="">All categories</option>
            {categories.filter(c => c.slug !== "user-generated").map(c => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
          <label className="inline-flex items-center gap-2 text-sm whitespace-nowrap">
            <input type="checkbox" checked={premiumOnly} onChange={(e) => setPremiumOnly(e.target.checked)}
              className="rounded border-border" />
            Premium only
          </label>
        </div>
        <div className="mt-3 text-sm text-foreground/60">
          {results.length === prompts.length ? `Showing all ${prompts.length} prompts` : `${results.length} of ${prompts.length} prompts`}
        </div>
      </div>

      {results.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center text-foreground/60">No prompts match.</div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visible.map(p => {
              const c = catById[p.category_id];
              const s = p.subcategory_id ? subById[p.subcategory_id] : null;
              const blurb = p.excerpt || p.what_for || "";
              return (
                <a key={p.id} href={`/library/${c?.slug}/${p.slug}`}
                   className="group rounded-xl border border-border bg-card p-5 md:p-6 flex flex-col h-full hover:border-primary/40 transition-colors">
                  <div className="flex flex-wrap items-center gap-1.5 text-xs mb-3">
                    {c && <span className="rounded-md bg-primary/10 text-primary px-2 py-0.5 font-medium">{c.name}</span>}
                    {s && <span className="text-foreground/55">{s.name}</span>}
                    {p.is_pro && <span className="rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">Premium</span>}
                  </div>
                  <h3 className="text-base md:text-lg font-bold tracking-tight text-foreground leading-snug">{p.title}</h3>
                  {blurb && <p className="mt-2 text-sm text-foreground/70 leading-relaxed flex-1 line-clamp-3">{blurb}</p>}
                  <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    Open
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="transition-transform group-hover:translate-x-0.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                  </div>
                </a>
              );
            })}
          </div>
          {show < results.length && (
            <div className="text-center mt-8">
              <button onClick={() => setShow(s => s + 24)}
                className="inline-flex items-center justify-center rounded-xl border-2 border-border bg-background hover:bg-secondary px-6 h-11 font-semibold transition-colors">
                Show more ({results.length - show} left)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
