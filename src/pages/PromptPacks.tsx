import SEO from "@/components/SEO";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { addToCart } from "@/lib/cart";
import { toast } from "@/hooks/use-toast";

const PACK_ORIGINAL_CENTS = 999;
const PACK_DISCOUNT_CENTS = 499;
const fmtUSD = (cents: number) => `$${(cents / 100).toFixed(2)}`;

type Pack = { id: string; name: string; description: string | null };

const PromptPacks = () => {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const { data, error } = await supabase.from('packs').select('id,name,description').eq('is_active', true).order('name');
      if (!cancelled && !error) setPacks(data || []);
      setLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const handleAdd = (p: Pack) => {
    addToCart({ id: p.id, type: 'pack', title: p.name, unitAmountCents: PACK_DISCOUNT_CENTS, quantity: 1 });
    toast({ title: 'Added to cart', description: `${p.name} — ${fmtUSD(PACK_DISCOUNT_CENTS)}` });
  };

  return (
    <main className="container py-10">
      <SEO title="Prompt Packs – Save 50%" description="Unlock themed prompt bundles. Launch special: $9.99 → $4.99." />
      <h1 className="text-3xl font-bold mb-2">Prompt Packs</h1>
      <p className="text-muted-foreground mb-6">Curated bundles for specific goals. Limited-time launch pricing.</p>

      {loading ? (
        <div className="text-muted-foreground">Loading packs…</div>
      ) : packs.length === 0 ? (
        <div className="text-muted-foreground">No packs available yet.</div>
      ) : (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packs.map((p) => (
            <Card key={p.id} className="relative">
              <div className="absolute top-3 right-3 z-10 flex gap-2">
                <Badge variant="destructive">PRO</Badge>
                <Badge variant="secondary">SALE</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-xl leading-tight">{p.name}</CardTitle>
                {p.description && <p className="text-sm text-muted-foreground">{p.description}</p>}
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground line-through">{fmtUSD(PACK_ORIGINAL_CENTS)}</span>
                  <span className="text-2xl font-semibold">{fmtUSD(PACK_DISCOUNT_CENTS)}</span>
                </div>
                <Button variant="hero" onClick={() => handleAdd(p)}>Add to cart</Button>
              </CardContent>
            </Card>
          ))}
        </section>
      )}
    </main>
  );
};

export default PromptPacks;
