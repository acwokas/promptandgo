import SEO from "@/components/SEO";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { addToCart, getCart } from "@/lib/cart";
import { toast } from "@/hooks/use-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageHero from "@/components/layout/PageHero";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Lock, Check } from "lucide-react";

const PACK_ORIGINAL_CENTS = 999;
const PACK_DISCOUNT_CENTS = 499;
const LIFETIME_ORIGINAL_CENTS = 9499;
const LIFETIME_DISCOUNT_CENTS = 4785;
const SUB_DISCOUNT_CENTS = 1299;
const fmtUSD = (cents: number) => `$${(cents / 100).toFixed(2)}`;

type Pack = { id: string; name: string; description: string | null };

type PromptLite = { id: string; title: string; is_pro: boolean; excerpt: string | null };

const PromptPacks = () => {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [highlight, setHighlight] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [contents, setContents] = useState<Record<string, PromptLite[]>>({});
  const [ownedPromptIds, setOwnedPromptIds] = useState<Set<string>>(new Set());
  const [ownedPackIds, setOwnedPackIds] = useState<Set<string>>(new Set());
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const { data: packRows, error } = await supabase
        .from('packs')
        .select('id,name,description')
        .eq('is_active', true)
        .order('name');

      if (!cancelled) {
        if (!error) setPacks(packRows || []);
        setLoading(false);

        const hl = searchParams.get('highlight');
        setHighlight(hl);
        if (hl) {
          setTimeout(() => {
            const el = document.getElementById(`pack-${hl}`);
            el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 50);
        }

        const packIds = (packRows || []).map((r) => r.id);
        if (packIds.length) {
          const { data: joins } = await supabase
            .from('pack_prompts')
            .select('pack_id,prompt_id')
            .in('pack_id', packIds);

          const promptIds = Array.from(new Set((joins || []).map((j) => j.prompt_id)));
          if (promptIds.length) {
            const { data: promptsData } = await supabase
              .from('prompts')
              .select('id,title,is_pro,excerpt')
              .in('id', promptIds);

            const pMap = new Map((promptsData || []).map((p) => [p.id as string, p]));
            const grouped: Record<string, PromptLite[]> = {};
            (joins || []).forEach((j) => {
              const pr = pMap.get(j.prompt_id as string);
              if (pr) {
                (grouped[j.pack_id as string] ||= []).push({
                  id: pr.id as string,
                  title: (pr as any).title,
                  is_pro: (pr as any).is_pro,
                  excerpt: ((pr as any).excerpt ?? null) as string | null,
                });
              }
            });
            if (!cancelled) setContents(grouped);
          } else {
            if (!cancelled) setContents({});
          }

          if (user) {
            const [{ data: pAccess }, { data: pkAccess }] = await Promise.all([
              supabase.from('prompt_access').select('prompt_id'),
              supabase.from('pack_access').select('pack_id').in('pack_id', packIds),
            ]);
            if (!cancelled) {
              setOwnedPromptIds(new Set((pAccess || []).map((r: any) => r.prompt_id as string)));
              setOwnedPackIds(new Set((pkAccess || []).map((r: any) => r.pack_id as string)));
            }
          } else {
            if (!cancelled) {
              setOwnedPromptIds(new Set());
              setOwnedPackIds(new Set());
            }
          }
        } else {
          if (!cancelled) {
            setContents({});
            setOwnedPromptIds(new Set());
            setOwnedPackIds(new Set());
          }
        }
      }
    };
    load();
    return () => { cancelled = true; };
  }, [searchParams, user]);

  const handleAdd = (p: Pack) => {
    if (ownedPackIds.has(p.id)) {
      toast({ title: 'Already owned', description: `${p.name} is already in your library.` });
      return;
    }
    const exists = getCart().some((i) => i.type === 'pack' && i.id === p.id);
    if (exists) {
      toast({ title: 'Already in cart', description: `${p.name} is already in your cart.` });
      return;
    }
    addToCart({ id: p.id, type: 'pack', title: p.name, unitAmountCents: PACK_DISCOUNT_CENTS, quantity: 1 }, !!user);
    toast({ title: 'Added to cart', description: `${p.name} — ${fmtUSD(PACK_DISCOUNT_CENTS)}` });
  };
  const handleSubscribe = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    const exists = getCart().some((i) => i.type === 'subscription' && i.id === 'monthly');
    if (exists) {
      toast({ title: 'Already in cart', description: 'Monthly All-Access Subscription is already in your cart.' });
      return;
    }
    addToCart({ id: 'monthly', type: 'subscription', title: 'Monthly All-Access Subscription', unitAmountCents: SUB_DISCOUNT_CENTS, quantity: 1 }, !!user);
    toast({ title: 'Subscription added to cart', description: `Monthly All-Access Subscription — ${fmtUSD(SUB_DISCOUNT_CENTS)}/mo` });
  };

  const normalize = (s: string) => s
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const filteredPacks = query.trim()
    ? packs.filter((pk) => {
        const items = contents[pk.id] || [];
        const q = query.toLowerCase();
        return items.some((it) => (it.title?.toLowerCase().includes(q) || (it.excerpt || '').toLowerCase().includes(q)));
      })
    : packs;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://promptandgo.ai';
  const productSchemas = useMemo(() => (
    packs.map((p) => ({
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.name,
      description: p.description || "Curated prompt pack",
      sku: p.id,
      url: `${origin}/packs#pack-${p.id}`,
      brand: { "@type": "Organization", name: "PromptAndGo" },
      offers: {
        "@type": "Offer",
        priceCurrency: "USD",
        price: (PACK_DISCOUNT_CENTS / 100).toFixed(2),
        availability: "https://schema.org/InStock",
        url: `${origin}/packs#pack-${p.id}`,
      },
      itemCondition: "https://schema.org/NewCondition",
    }))
  ), [packs, origin]);

  return (
    <>
      <PageHero title={<>⚡️<span className="text-gradient-brand">Power</span> Packs</>} subtitle={<>Curated bundles built for specific goals, offering outcome-oriented prompt frameworks that deliver deep, high-value, structured results.</>} minHeightClass="min-h-[40vh]" />
      <main className="container py-10">
        <SEO
          title="⚡️Power Packs – Save 50%"
          description="Curated bundles built for specific goals, offering outcome-oriented prompt frameworks that deliver deep, high-value, structured results."
          structuredData={productSchemas}
        />
        <div className="mb-6 max-w-xl">
          <Input
            placeholder="Search within pack contents..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-muted-foreground">Loading packs…</div>
        ) : filteredPacks.length === 0 ? (
          <div className="text-muted-foreground">No packs match your search.</div>
        ) : (
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPacks.map((p) => {
              const items = contents[p.id] || [];
              const packOwned = ownedPackIds.has(p.id);
              const ownedCount = packOwned ? items.length : items.filter((it) => ownedPromptIds.has(it.id)).length;
              const freeCount = items.filter((it) => !it.is_pro).length;
              const proCount = items.filter((it) => it.is_pro).length;
              const isBestseller = [
                'Social Media Power Pack',
                'Content Marketing Goldmine',
              ].some((n) => normalize(p.name) === normalize(n));
              const isRisingStar = normalize(p.name) === normalize('Career Accelerator Pack');

              return (
                <Card key={p.id} id={`pack-${p.id}`} className={`relative ${highlight === p.id ? 'ring-2 ring-primary' : ''}`}>
                  <CardHeader>
                    <div className="mb-2 flex gap-2 items-center">
                      <Badge variant="destructive">PRO</Badge>
                      <Badge variant="success">SALE</Badge>
                      {isBestseller && (
                        <Badge className="border-transparent bg-[hsl(var(--accent-4))] text-primary-foreground hover:bg-[hsl(var(--accent-4))]/90">BESTSELLER</Badge>
                      )}
                      {isRisingStar && (
                        <Badge className="border-transparent bg-[hsl(var(--accent-3))] text-primary-foreground hover:bg-[hsl(var(--accent-3))]/90">POPULAR</Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl leading-tight">{p.name}</CardTitle>
                    {p.description && <p className="text-sm text-muted-foreground">{p.description}</p>}
                    <div className="text-sm text-muted-foreground">
                      {packOwned ? 'You own this pack.' : `You own ${ownedCount}/${items.length} items`} • {freeCount} free, {proCount} PRO
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="contents">
                        <AccordionTrigger>View contents ({items.length})</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2">
                            {items.map((it) => {
                              const owned = packOwned || ownedPromptIds.has(it.id);
                              const locked = it.is_pro && !owned;
                              return (
                                <li key={it.id} className="flex items-start justify-between">
                                  <div className={`text-sm ${locked ? 'text-muted-foreground' : ''}`}>
                                    <div className={locked ? 'blur-[1px] select-none' : ''}>{it.title}</div>
                                    {!locked && it.excerpt && (
                                      <p className="text-xs text-muted-foreground mt-0.5">{it.excerpt}</p>
                                    )}
                                  </div>
                                  <div className="ml-3 shrink-0 flex gap-1 items-center">
                                    {it.is_pro ? <Badge variant="secondary">PRO</Badge> : <Badge>Free</Badge>}
                                    {owned && (
                                      <Badge variant="outline" className="flex items-center gap-1">
                                        <Check className="h-3 w-3" /> Owned
                                      </Badge>
                                    )}
                                    {locked && <Lock className="h-4 w-4 text-muted-foreground" />}
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

                    <div className="pt-2">
                      <div className="text-right">
                        <div className="text-muted-foreground line-through">{fmtUSD(PACK_ORIGINAL_CENTS)}</div>
                        <div className="text-2xl font-semibold">{fmtUSD(PACK_DISCOUNT_CENTS)}</div>
                      </div>
                      <div className="mt-3 flex gap-2 justify-end">
                        <Button variant="hero" onClick={() => handleAdd(p)}>Get Pack</Button>
                        <Button variant="cta" onClick={handleSubscribe}>Subscribe</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </section>
        )}
      </main>
    </>
  );
};

export default PromptPacks;
