import SEO from "@/components/SEO";
import PageHero from "@/components/layout/PageHero";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";

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

  const manageMembership = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      if (error) {
        // Check if this is a "no customer found" error
        if (error.message?.includes('No membership found') || error.message?.includes('No Stripe customer found')) {
          toast({ 
            title: 'No membership found', 
            description: 'You need to purchase a membership first. Redirecting to Power Packs...', 
            variant: 'default' 
          });
          // Redirect to packs page after a short delay
          setTimeout(() => {
            window.location.href = '/packs';
          }, 1500);
          return;
        }
        toast({ title: 'Portal error', description: error.message, variant: 'destructive' });
        return;
      }
      window.open((data as any).url, '_blank');
    } catch (err: any) {
      console.error('Manage membership error:', err);
      toast({ title: 'Portal error', description: 'Failed to access customer portal', variant: 'destructive' });
    }
  };

  const refreshMembership = async () => {
    await supabase.functions.invoke('check-subscription');
    toast({ title: 'Membership refreshed' });
  };

  return (
    <>
      <SEO title="My Purchases" description="View your purchased prompt packs and invoices." />
      <PageHero
        title={<><span className="text-gradient-brand">My</span> Purchases</>}
        subtitle={<>A history of your purchases and downloads.</>}
        minHeightClass="min-h-[28vh]"
      />
      <main className="container py-8 space-y-6">
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
              <BreadcrumbLink asChild>
                <Link to="/account">My Account</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>My Purchases</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={refreshMembership}>Refresh Membership</Button>
          <Button variant="cta" onClick={manageMembership}>Manage Membership</Button>
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
