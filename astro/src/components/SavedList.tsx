import { useEffect, useState } from "react";
import { sb } from "@astro/lib/auth-client";

export default function SavedList() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [loggedIn, setLoggedIn] = useState(true);

  useEffect(() => {
    (async () => {
      const c = sb();
      const { data: { user } } = await c.auth.getUser();
      if (!user) { setLoggedIn(false); setLoading(false); return; }
      const { data } = await c
        .from("favorites")
        .select("created_at, prompts(id, slug, title, what_for, excerpt, is_pro, category_id, subcategory_id, categories(slug, name), subcategories(name))")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setItems((data ?? []).filter((x: any) => x.prompts));
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({length:6}).map((_,i) => <div key={i} className="rounded-xl border border-border bg-card p-6 h-40 animate-pulse"></div>)}</div>;

  if (!loggedIn) return (
    <div className="rounded-2xl border border-border bg-card p-10 text-center">
      <h2 className="text-xl font-bold">Sign in to view your saved prompts</h2>
      <p className="mt-2 text-foreground/70">Save prompts you like with one click. They'll be here when you come back.</p>
      <a href="/auth?action=signup&next=/account/saved" className="mt-5 inline-flex rounded-xl bg-primary text-primary-foreground px-5 h-11 leading-[2.75rem] font-semibold hover:bg-primary/90 transition-colors">Sign in / sign up</a>
    </div>
  );

  if (items.length === 0) return (
    <div className="rounded-2xl border border-border bg-card p-10 text-center">
      <h2 className="text-xl font-bold">Nothing saved yet</h2>
      <p className="mt-2 text-foreground/70">Browse the library and tap the heart on any prompt to save it.</p>
      <a href="/library" className="mt-5 inline-flex rounded-xl bg-primary text-primary-foreground px-5 h-11 leading-[2.75rem] font-semibold hover:bg-primary/90 transition-colors">Browse library</a>
    </div>
  );

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((row: any) => {
        const p = row.prompts;
        const c = p.categories;
        const s = p.subcategories;
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
  );
}
