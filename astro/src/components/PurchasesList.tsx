import { useEffect, useState } from "react";
import { sb, getEntitlement, type Entitlement } from "../lib/auth-client";

type Item = {
  id: string;
  type: "prompt" | "pack";
  title: string;
  url: string;
  excerpt?: string;
  acquired_at?: string;
};

export default function PurchasesList() {
  const [loading, setLoading] = useState(true);
  const [ent, setEnt] = useState<Entitlement | null>(null);
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    (async () => {
      const e = await getEntitlement();
      setEnt(e);
      if (!e.loggedIn) { setLoading(false); return; }
      const c = sb();
      const promptIds = Array.from(e.ownedPromptIds);
      const packIds = Array.from(e.ownedPackIds);
      const out: Item[] = [];

      if (packIds.length) {
        const { data: packs } = await c.from("packs")
          .select("id,name,slug,description")
          .in("id", packIds);
        for (const p of packs ?? []) {
          out.push({ id: p.id, type: "pack", title: p.name, url: `/packs/${p.slug}/`, excerpt: p.description });
        }
      }
      if (promptIds.length) {
        const { data: prompts } = await c.from("prompts")
          .select("id,title,slug,excerpt,subcategory:subcategories(category:categories(slug))")
          .in("id", promptIds);
        for (const p of prompts ?? []) {
          const catSlug = (p as any).subcategory?.category?.slug ?? "all";
          out.push({ id: p.id, type: "prompt", title: p.title, url: `/library/${catSlug}/${p.slug}/`, excerpt: p.excerpt });
        }
      }
      setItems(out);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">Loading your purchases…</div>;
  }
  if (!ent?.loggedIn) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">Sign in to see your purchases.</p>
        <a href="/auth?next=/account/purchases" className="mt-4 inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground px-6 h-11 font-semibold">Sign in</a>
      </div>
    );
  }

  const subscriberLine = ent.isSubscribed
    ? <p className="text-sm text-primary font-semibold">You have an active subscription — every premium prompt is unlocked.</p>
    : null;

  if (items.length === 0 && !ent.isSubscribed) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">You haven't purchased any prompts or packs yet.</p>
        <a href="/packs" className="mt-4 inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground px-6 h-11 font-semibold">Browse Power Packs</a>
      </div>
    );
  }

  const packs = items.filter(i => i.type === "pack");
  const prompts = items.filter(i => i.type === "prompt");

  return (
    <div className="space-y-8">
      {subscriberLine}
      {packs.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Owned packs</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {packs.map(p => (
              <a key={p.id} href={p.url} className="rounded-xl border border-border bg-card p-5 hover:border-primary/40 transition-colors">
                <div className="text-base font-bold">{p.title}</div>
                {p.excerpt && <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{p.excerpt}</p>}
              </a>
            ))}
          </div>
        </section>
      )}
      {prompts.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Single prompts</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {prompts.map(p => (
              <a key={p.id} href={p.url} className="rounded-xl border border-border bg-card p-5 hover:border-primary/40 transition-colors">
                <div className="text-base font-bold">{p.title}</div>
                {p.excerpt && <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{p.excerpt}</p>}
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
