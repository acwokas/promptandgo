import SEO from "@/components/SEO";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { addToCart, getCart } from "@/lib/cart";
import { toast } from "@/hooks/use-toast";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import PageHero from "@/components/layout/PageHero";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Lock, Check, Heart, Search, Zap, Crown, Infinity, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import ShareButton from "@/components/ShareButton";
import { PackFilters } from "@/components/prompt/PackFilters";
import { PollCarousel } from "@/components/poll/PollCarousel";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { PromptStudioCTA } from "@/components/ui/prompt-studio-cta";

const PACK_ORIGINAL_CENTS = 999;
const PACK_DISCOUNT_CENTS = 499;
const LIFETIME_ORIGINAL_CENTS = 19900;
const LIFETIME_DISCOUNT_CENTS = 9950;
const SUB_DISCOUNT_CENTS = 1299;
const fmtUSD = (cents: number) => `$${(cents / 100).toFixed(2)}`;

type Pack = { id: string; name: string; description: string | null; tags: string[] };

type PromptLite = { id: string; title: string; is_pro: boolean; excerpt: string | null };

const PromptPacks = () => {
  // Component for displaying and managing prompt packs
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [highlight, setHighlight] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [contents, setContents] = useState<Record<string, PromptLite[]>>({});
  const [ownedPromptIds, setOwnedPromptIds] = useState<Set<string>>(new Set());
  const [ownedPackIds, setOwnedPackIds] = useState<Set<string>>(new Set());
  const [showPopularPacks, setShowPopularPacks] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      
      // Load packs and their tags separately
      const [packsResult, packTagsResult] = await Promise.all([
        supabase
          .from('packs')
          .select('id, name, description')
          .eq('is_active', true)
          .order('name'),
        supabase
          .from('pack_tags')
          .select('pack_id, tags(name)')
      ]);

      if (!cancelled) {
        if (!packsResult.error) {
          // Create a map of pack tags
          const tagsByPack = new Map<string, string[]>();
          if (!packTagsResult.error && packTagsResult.data) {
            packTagsResult.data.forEach((pt: any) => {
              if (!tagsByPack.has(pt.pack_id)) {
                tagsByPack.set(pt.pack_id, []);
              }
              if (pt.tags?.name) {
                tagsByPack.get(pt.pack_id)?.push(pt.tags.name);
              }
            });
          }
          
          // Transform the data to include tags as an array
          const transformedPacks = (packsResult.data || []).map((pack: any) => ({
            id: pack.id,
            name: pack.name,
            description: pack.description,
            tags: tagsByPack.get(pack.id) || []
          }));
          setPacks(transformedPacks);
        }
        setLoading(false);

        const hl = searchParams.get('highlight');
        setHighlight(hl);
        if (hl) {
          setTimeout(() => {
            const el = document.getElementById(`pack-${hl}`);
            el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 50);
        }

        const packIds = (packsResult.data || []).map((r) => r.id);
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
    const cart = getCart();
    const hasLifetime = cart.some((i) => i.type === 'lifetime');
    
    const exists = cart.some((i) => i.type === 'pack' && i.id === p.id);
    if (exists) {
      toast({ title: 'Already in cart', description: `${p.name} is already in your cart.` });
      return;
    }
    
    addToCart({ id: p.id, type: 'pack', title: p.name, unitAmountCents: PACK_DISCOUNT_CENTS, quantity: 1 }, !!user);
    
    if (hasLifetime) {
      toast({ 
        title: 'Pack added - FREE with Lifetime!', 
        description: `${p.name} is FREE with your Lifetime Access.` 
      });
    } else {
      toast({ title: 'Added to cart', description: `${p.name} — ${fmtUSD(PACK_DISCOUNT_CENTS)}` });
    }
  };
  const handleSubscribe = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    const cart = getCart();
    const exists = cart.some((i) => i.type === 'membership' && i.id === 'monthly');
    if (exists) {
      toast({ title: 'Already in cart', description: 'Monthly All-Access Membership is already in your cart.' });
      return;
    }
    addToCart({ id: 'monthly', type: 'membership', title: 'Monthly All-Access Membership', unitAmountCents: SUB_DISCOUNT_CENTS, quantity: 1 }, !!user);
    toast({ title: 'Membership added to cart', description: `Monthly All-Access Membership — ${fmtUSD(SUB_DISCOUNT_CENTS)}/mo` });
  };

  const handleSearch = () => {
    // Search functionality is handled by the query state change
  };

  const handleClear = () => {
    setQuery("");
    setFilter("all");
  };

  const normalize = (s: string) => s
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const filteredPacks = packs.filter((pk) => {
    // Apply filter first
    const items = contents[pk.id] || [];
    const packOwned = ownedPackIds.has(pk.id);
    
    if (filter === "my-packs" && !packOwned) return false;
    if (filter === "recommended") {
      // Add logic for recommended packs (for now, include bestsellers)
      const isBestseller = [
        'Social Media Power Pack',
        'Content Marketing Goldmine',
      ].some((n) => normalize(pk.name) === normalize(n));
      if (!isBestseller) return false;
    }
    
    // Then apply query filter
    if (!query.trim()) return true;
    
    const q = query.toLowerCase();
    const packNameMatch = pk.name.toLowerCase().includes(q);
    const packDescMatch = (pk.description || '').toLowerCase().includes(q);
    const packTagsMatch = pk.tags.some(tag => tag.toLowerCase().includes(q));
    const promptContentMatch = items.some((it) => 
      (it.title?.toLowerCase().includes(q) || (it.excerpt || '').toLowerCase().includes(q))
    );
    
    return packNameMatch || packDescMatch || packTagsMatch || promptContentMatch;
  });

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://promptandgo.ai';
  const productSchemas = useMemo(() => (
    packs.map((p) => ({
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.name,
      description: p.description || "Curated prompt pack",
      sku: p.id,
      url: `${origin}/packs#pack-${p.id}`,
      brand: { "@type": "Organization", name: "promptandgo" },
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
      <PageHero title={<>⚡️<span className="text-gradient-brand">Power</span> Packs</>} subtitle={<>Curated bundles built for specific goals, offering outcome-oriented prompt frameworks that deliver deep, high-value, structured results.</>} minHeightClass="min-h-[28svh]">
        <Button asChild variant="hero">
          <Link to="#pack-filters">
            <Sparkles className="h-4 w-4 mr-2" />
            Explore Power Packs
          </Link>
        </Button>
      </PageHero>
      
      <main className="container py-10">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>⚡️Power Packs</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <SEO
          title="⚡️Power Packs – Save 50%"
          description="Curated bundles built for specific goals, offering outcome-oriented prompt frameworks that deliver deep, high-value, structured results."
          structuredData={productSchemas}
        />
        

        {/* Mobile Toggle Buttons */}
        <div className="lg:hidden mb-4 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPopularPacks(!showPopularPacks)}
            className="flex-1"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Popular Packs
            {showPopularPacks ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex-1"
          >
            <Search className="h-4 w-4 mr-2" />
            Search & Filter
            {showFilters ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          {/* Popular Power Packs Section */}
          <section id="popular-power-packs" className={`lg:w-1/2 ${!showPopularPacks && 'hidden lg:block'}`}>
            <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
              <CardContent className="p-4">
                <div className="mb-3">
                  <h3 className="text-base font-semibold mb-1">⚡ Popular Power Packs</h3>
                  <p className="text-xs text-muted-foreground">Quick access to our most sought-after pack categories</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {[
                    "social media", "content marketing", "business", "career", 
                    "productivity", "writing", "automation", "strategy"
                  ].map((searchTerm) => (
                    <Button
                      key={searchTerm}
                      variant="outline"
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => setQuery(searchTerm)}
                    >
                      {searchTerm}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Pack Filters Section */}
          <section id="pack-filters" className={`lg:w-1/2 ${!showFilters && 'hidden lg:block'}`}>
            <PackFilters
              query={query}
              filter={filter}
              onChange={setQuery}
              onFilterChange={setFilter}
              onSearch={handleSearch}
              onClear={handleClear}
            />
          </section>
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
                    <div className="mb-2 flex gap-2 items-center flex-wrap">
                      <Badge variant="destructive">PRO</Badge>
                      <Badge variant="success">50% OFF</Badge>
                      {isBestseller && (
                        <Badge className="border-transparent bg-[hsl(var(--accent-4))] text-primary-foreground hover:bg-[hsl(var(--accent-4))]/90 animate-pulse">🔥 BESTSELLER</Badge>
                      )}
                      {isRisingStar && (
                        <Badge className="border-transparent bg-[hsl(var(--accent-3))] text-primary-foreground hover:bg-[hsl(var(--accent-3))]/90">⭐ POPULAR</Badge>
                      )}
                      {Math.random() > 0.7 && (
                        <Badge className="border-transparent bg-gradient-to-r from-primary to-accent text-primary-foreground animate-pulse">⏰ LIMITED TIME</Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl leading-tight">{p.name}</CardTitle>
                    {p.description && <p className="text-sm text-muted-foreground">{p.description}</p>}
                    
                    <div className="flex items-center gap-2 mt-2">
                      <ShareButton
                        url={`${origin}/packs#pack-${p.id}`}
                        contentType="pack"
                        contentId={p.id}
                        title={`Check out the ${p.name} - AI prompt pack from promptandgo.ai`}
                        variant="outline"
                        size="sm"
                      />
                    </div>
                    
                    {/* Display pack tags */}
                    {p.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {p.tags.map((tag, index) => (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className="text-xs cursor-pointer hover:bg-muted" 
                            onClick={() => setQuery(tag)}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
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

        {/* Poll and Call to Action Section */}
        <section className="py-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Call to Action Column */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-subtle py-12 rounded-lg">
                <div className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold mb-3">Unlock Premium AI Prompts</h2>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Choose how you want to access our premium content - buy individual packs or unlock everything with a membership.
                  </p>
                </div>
                
                <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
                  {/* Individual Packs */}
                  <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                    <div className="mb-4">
                      <Zap className="h-12 w-12 mx-auto text-yellow-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Individual Packs</h3>
                    <p className="text-muted-foreground mb-4">
                      Purchase specific Power Packs that match your needs. Perfect for targeted projects.
                    </p>
                    <div className="text-2xl font-bold text-primary mb-4">
                      ${(PACK_DISCOUNT_CENTS / 100).toFixed(2)} <span className="text-sm line-through text-muted-foreground">${(PACK_ORIGINAL_CENTS / 100).toFixed(2)}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        const element = document.getElementById("popular-power-packs");
                        element?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                    >
                      Browse Power Packs
                    </Button>
                  </Card>

                  {/* Monthly Membership */}
                  <Card className="text-center p-6 hover:shadow-lg transition-shadow border-primary">
                    <div className="mb-4">
                      <Crown className="h-12 w-12 mx-auto text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Monthly Member</h3>
                    <p className="text-muted-foreground mb-4">
                      Unlock ALL premium prompts and Power Packs and unlock additional AI Tools queries. Cancel anytime.
                    </p>
                    <div className="text-2xl font-bold text-primary mb-4">
                      ${(SUB_DISCOUNT_CENTS / 100).toFixed(2)}/mo
                    </div>
                    <Button 
                      variant="hero" 
                      className="w-full"
                      onClick={handleSubscribe}
                    >
                      Start Monthly Plan
                    </Button>
                  </Card>

                  {/* Lifetime Membership */}
                  <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                    <div className="mb-4">
                      <Infinity className="h-12 w-12 mx-auto text-gradient-brand" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Lifetime Access</h3>
                    <p className="text-muted-foreground mb-4">
                      One-time payment for permanent access to all current and future premium content.
                    </p>
                    <div className="text-2xl font-bold text-primary mb-4">
                      ${(LIFETIME_DISCOUNT_CENTS / 100).toFixed(2)} <span className="text-sm line-through text-muted-foreground">${(LIFETIME_ORIGINAL_CENTS / 100).toFixed(2)}</span>
                    </div>
                    <Button 
                      variant="secondary" 
                      className="w-full"
                      onClick={() => {
                        if (!user) {
                          navigate('/auth');
                          return;
                        }
                        const cart = getCart();
                        
                        const exists = cart.some((i) => i.type === 'lifetime' && i.id === 'lifetime');
                        if (exists) {
                          toast({ title: 'Already in cart', description: 'Lifetime Access is already in your cart.' });
                          return;
                        }
                        addToCart({ id: 'lifetime', type: 'lifetime', title: 'Lifetime All-Access', unitAmountCents: LIFETIME_DISCOUNT_CENTS, quantity: 1 }, !!user);
                        toast({ title: 'Lifetime access added to cart', description: `Lifetime All-Access — ${fmtUSD(LIFETIME_DISCOUNT_CENTS)}. All other items in your cart are now FREE!` });
                      }}
                    >
                      Get Lifetime Access
                    </Button>
                  </Card>
                </div>

                <div className="text-center mt-8">
                  <p className="text-sm text-muted-foreground">
                    All purchases include instant access • 30-day money-back guarantee • No hidden fees
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Poll */}
            <div className="lg:col-span-1">
              <PollCarousel currentPage="packs" />
            </div>
          </div>
        </section>

        {/* Prompt Studio CTA */}
        <section className="mt-8">
          <PromptStudioCTA variant="default" />
        </section>
      </main>
    </>
  );
};

export default PromptPacks;
