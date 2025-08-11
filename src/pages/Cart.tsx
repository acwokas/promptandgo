import SEO from "@/components/SEO";
import PageHero from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCart, getCartTotalCents, removeFromCart, clearCart } from "@/lib/cart";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const centsToUSD = (cents: number) => `$${(cents / 100).toFixed(2)}`;

const CartPage = () => {
  const [items, setItems] = useState(getCart());
  const total = getCartTotalCents();

  useEffect(() => {
    const onChange = () => setItems(getCart());
    window.addEventListener('cart:change', onChange);
    window.addEventListener('storage', onChange);
    return () => {
      window.removeEventListener('cart:change', onChange);
      window.removeEventListener('storage', onChange);
    };
  }, []);

  const beginCheckout = async () => {
    // Placeholder checkout flow – will wire to Stripe edge function later
    // For now, prompt login and show toast if not logged-in
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = '/auth';
      return;
    }
    alert('Checkout will open Stripe soon. Total: ' + centsToUSD(getCartTotalCents()));
  };

  return (
    <>
      <SEO title="Your Cart" description="Review your selected prompts and packs before checkout." />
      <PageHero title={<><span className="text-gradient-brand">Your</span> Cart</>} subtitle={<>Complete your purchase securely. Subscription option available at checkout.</>} minHeightClass="min-h-[35vh]"/>
      <main className="container py-8">
        {items.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Your cart is empty.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-4">
              {items.map((i) => (
                <Card key={`${i.type}-${i.id}`}>
                  <CardHeader className="flex-row items-center justify-between">
                    <CardTitle className="text-lg">
                      {i.title} <span className="text-muted-foreground font-normal">({i.type})</span>
                    </CardTitle>
                    <div className="text-sm text-muted-foreground">x{i.quantity}</div>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between">
                    <div className="text-xl font-semibold">{centsToUSD(i.unitAmountCents)}</div>
                    <Button variant="outline" onClick={() => removeFromCart(i.id, i.type)}>Remove</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold">{centsToUSD(total)}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1" variant="hero" onClick={beginCheckout}>Checkout</Button>
                    <Button className="flex-1" variant="secondary" onClick={() => clearCart()}>Clear</Button>
                  </div>
                  <p className="text-sm text-muted-foreground">This month only: All PRO prompts $0.99 (was $1.99). Premium Packs $4.99 (was $9.99). Or subscribe for $9.99 (was $14.99).</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default CartPage;
