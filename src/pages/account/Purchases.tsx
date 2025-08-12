import SEO from "@/components/SEO";
import PageHero from "@/components/layout/PageHero";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

type Order = { id: string; status: string; amount: number | null; mode: string; created_at: string };

type OrderItem = { id: string; order_id: string; item_type: string; title: string | null; unit_amount: number; quantity: number };

const PurchasesPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [items, setItems] = useState<Record<string, OrderItem[]>>({});

  useEffect(() => {
    (async () => {
      const { data: ords, error } = await supabase.from('orders').select('id,status,amount,mode,created_at').order('created_at', { ascending: false });
      if (error) return;
      setOrders(ords || []);
      const ids = (ords || []).map(o => o.id);
      if (!ids.length) return;
      const { data: its } = await supabase.from('order_items').select('id,order_id,item_type,title,unit_amount,quantity').in('order_id', ids);
      const grouped: Record<string, OrderItem[]> = {};
      (its || []).forEach((it) => { (grouped[it.order_id] ||= []).push(it as any); });
      setItems(grouped);
    })();
  }, []);

  const manageSubscription = async () => {
    const { data, error } = await supabase.functions.invoke('customer-portal');
    if (error) {
      toast({ title: 'Portal error', description: error.message, variant: 'destructive' });
      return;
    }
    window.open((data as any).url, '_blank');
  };

  const refreshSubscription = async () => {
    await supabase.functions.invoke('check-subscription');
    toast({ title: 'Subscription refreshed' });
  };

  return (
    <>
      <SEO title="My Purchases" description="View your purchased prompt packs and invoices." />
      <PageHero
        title={<><span className="text-gradient-brand">My</span> Purchases</>}
        subtitle={<>A history of your purchases and downloads.</>}
        minHeightClass="min-h-[40vh]"
      />
      <main className="container py-8 space-y-6">
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={refreshSubscription}>Refresh Subscription</Button>
          <Button variant="cta" onClick={manageSubscription}>Manage Subscription</Button>
        </div>
        {orders.length === 0 ? (
          <div className="rounded-xl border bg-card p-6 text-center text-muted-foreground">No purchases yet.</div>
        ) : (
          <div className="grid gap-4">
            {orders.map((o) => (
              <Card key={o.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Order {o.id.slice(0, 8)}…</span>
                    <span className="text-sm text-muted-foreground">{new Date(o.created_at).toLocaleString()}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Status</span>
                    <span className="font-medium">{o.status}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Mode</span>
                    <span className="font-medium">{o.mode}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Total</span>
                    <span className="font-semibold">${((o.amount || 0) / 100).toFixed(2)}</span>
                  </div>
                  <div>
                    <div className="font-medium mb-2">Items</div>
                    <ul className="text-sm text-muted-foreground list-disc pl-5">
                      {(items[o.id] || []).map((it) => (
                        <li key={it.id}>{it.item_type === 'lifetime' ? 'Lifetime All-Access' : `${it.item_type}: ${it.title || ''}`} × {it.quantity} — ${ (it.unit_amount/100).toFixed(2) }</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </>
  );
};

export default PurchasesPage;
