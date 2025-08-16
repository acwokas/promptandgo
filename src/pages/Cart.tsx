import SEO from "@/components/SEO";
import PageHero from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCartForUser, getCartTotalCents, removeFromCart, clearCart, type CartItem } from "@/lib/cart";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

const centsToUSD = (cents: number) => `$${(cents / 100).toFixed(2)}`;

const CartPage = () => {
  const { user } = useSupabaseAuth();
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const updateItems = () => setItems(getCartForUser(!!user));
    updateItems(); // Initial load
    
    window.addEventListener('cart:change', updateItems);
    window.addEventListener('storage', updateItems);
    return () => {
      window.removeEventListener('cart:change', updateItems);
      window.removeEventListener('storage', updateItems);
    };
  }, [user]);

  const originalUnitCents = (i: CartItem) => {
    switch (i.type) {
      case 'pack': return 999;
      case 'membership': return 2499;
      case 'lifetime': return 9499;
      case 'prompt': return 199;
      default: return i.unitAmountCents;
    }
  };

  const hasMembership = items.some((i) => i.type === 'membership');

  const total = items.reduce((sum, i) => {
    const unit = hasMembership && (i.type === 'prompt' || i.type === 'pack') ? 0 : i.unitAmountCents;
    return sum + unit * i.quantity;
  }, 0);
  const originalTotal = items.reduce((sum, i) => sum + originalUnitCents(i) * i.quantity, 0);
  const savings = Math.max(0, originalTotal - total);

  const beginCheckout = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = '/auth';
      return;
    }

    const cartItems = getCartForUser(!!user);
    if (cartItems.length === 0) return;

    const hasMembership = cartItems.some((i) => i.type === 'membership');
    const hasLifetime = cartItems.some((i) => i.type === 'lifetime');

    try {
      if (hasMembership) {
        const { data, error } = await supabase.functions.invoke('create-checkout');
        if (error) throw error;
        window.open((data as any).url, '_blank');
        return;
      }

      if (hasLifetime && cartItems.length > 1) {
        alert('Lifetime purchase must be the only item in the cart.');
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-payment', { body: { items: cartItems } });
      if (error) throw error;
      window.open((data as any).url, '_blank');
    } catch (e: any) {
      alert('Checkout error: ' + (e?.message || String(e)));
    }
  };

  return (
    <>
      <SEO title="Your Cart" description="Review your selected prompts and packs before checkout." />
      <PageHero title={<><span className="text-gradient-brand">Your</span> Cart</>} subtitle={<>Complete your purchase securely. Membership option available at checkout.</>} minHeightClass="min-h-[25vh]"/>
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
                  <div className="flex items-center gap-3">
                    {hasMembership && (i.type === 'prompt' || i.type === 'pack') ? (
                      <>
                        <span className="text-muted-foreground line-through">{centsToUSD(originalUnitCents(i))}</span>
                        <span className="text-xl font-semibold">{centsToUSD(0)}</span>
                      </>
                    ) : originalUnitCents(i) > i.unitAmountCents ? (
                      <>
                        <span className="text-muted-foreground line-through">{centsToUSD(originalUnitCents(i))}</span>
                        <span className="text-xl font-semibold">{centsToUSD(i.unitAmountCents)}</span>
                      </>
                    ) : (
                      <span className="text-xl font-semibold">{centsToUSD(i.unitAmountCents)}</span>
                    )}
                  </div>
                  <Button variant="outline" onClick={() => removeFromCart(i.id, i.type, !!user)}>Remove</Button>
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
                  {savings > 0 && (
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>You save</span>
                      <span className="font-medium text-primary">{centsToUSD(savings)}</span>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button className="flex-1" variant="hero" onClick={beginCheckout}>Checkout</Button>
                    <Button className="flex-1" variant="secondary" onClick={() => clearCart()}>Clear</Button>
                  </div>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Summer Sale for a limited time only:<br/>
                      🏷️ All PRO prompts $0.99 (was $1.99).<br/>
                      ⚡️Power Packs $4.99 (was $9.99).
                    </p>
                    <div className="text-center text-sm text-muted-foreground">or</div>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-between text-sm">
                        <span>Subscribe for $12.99 (was $24.99)</span>
                        <span className="text-xs">(p/mo)</span>
                      </Button>
                      <Button variant="outline" className="w-full justify-between text-sm">
                        <span>Lifetime Access $47.85 (was $94.99)</span>
                        <span className="text-xs">(one off)</span>
                      </Button>
                    </div>
                  </div>
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
