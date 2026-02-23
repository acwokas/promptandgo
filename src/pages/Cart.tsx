import SEO from "@/components/SEO";
import PageHero from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCartForUser, getCartTotalCents, removeFromCart, clearCart, addToMyPrompts, addToCart, type CartItem } from "@/lib/cart";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useCoupon } from "@/hooks/useCoupon";
import { toast } from "@/hooks/use-toast";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { Star, Zap, Library, Calendar, Infinity, ArrowRight, Tag, X } from "lucide-react";
import { Input } from "@/components/ui/input";

const centsToUSD = (cents: number) => `$${(cents / 100).toFixed(2)}`;

const CartPage = () => {
  const { user, loading } = useSupabaseAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [addingToFavorites, setAddingToFavorites] = useState<boolean>(false);
  const [couponCode, setCouponCode] = useState("");
  const { appliedCoupon, isValidating, validateCoupon, removeCoupon, calculateDiscount } = useCoupon();

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
      case 'annual': return 19900;
      case 'prompt': return 199;
      default: return i.unitAmountCents;
    }
  };

  const hasMembership = items.some((i) => i.type === 'membership');
  const hasAnnual = items.some((i) => i.type === 'annual');

  const total = items.reduce((sum, i) => {
    // If annual is in cart, everything else is free
    if (hasAnnual && i.type !== 'annual') {
      return sum;
    }
    // If only membership (no annual), prompts and packs are free
    if (!hasAnnual && hasMembership && (i.type === 'prompt' || i.type === 'pack')) {
      return sum;
    }
    return sum + i.unitAmountCents * i.quantity;
  }, 0);
  const originalTotal = items.reduce((sum, i) => sum + originalUnitCents(i) * i.quantity, 0);
  
  // Calculate coupon discount
  const couponDiscount = calculateDiscount(total);
  const totalAfterCoupon = Math.max(0, total - couponDiscount);
  
  const savings = Math.max(0, originalTotal - totalAfterCoupon);

  const beginCheckout = async () => {
    if (!user || loading) {
      toast({
        title: "Authentication Required",
        description: "Please log in to continue with checkout."
      });
      window.location.href = '/auth';
      return;
    }

    const cartItems = getCartForUser(!!user);
    if (cartItems.length === 0) {
      toast({
        title: "Empty Cart", 
        description: "Add some items to your cart first."
      });
      return;
    }

    const hasMembership = cartItems.some((i) => i.type === 'membership');
    const hasAnnual = cartItems.some((i) => i.type === 'annual');

    try {
      const checkoutBody: any = { items: cartItems };
      
      // Include coupon information if applied
      if (appliedCoupon && appliedCoupon.valid) {
        checkoutBody.couponId = appliedCoupon.couponId;
        checkoutBody.couponCode = couponCode;
      }
      
      if (hasMembership || hasAnnual) {
        // Use create-checkout for recurring memberships or annual purchases
        const { data, error } = await supabase.functions.invoke('create-checkout', { body: checkoutBody });
        if (error) throw error;
        window.open((data as any).url, '_blank');
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-payment', { body: checkoutBody });
      if (error) throw error;
      window.open((data as any).url, '_blank');
    } catch (e: any) {
      console.error('Checkout error:', e);
      toast({
        title: "Checkout Error",
        description: e?.message || 'Something went wrong. Please try again.'
      });
    }
  };

  const handleAddToMyPrompts = async () => {
    if (!user || addingToFavorites) return;
    
    setAddingToFavorites(true);
    const promptItems = items.filter(i => i.type === 'prompt');
    const promptIds = promptItems.map(i => i.id);
    
    if (promptIds.length > 0) {
      const success = await addToMyPrompts(promptIds, 'prompt');
      if (success) {
        toast({
          title: "Added to My Prompts!",
          description: `${promptIds.length} prompt(s) will unlock when your membership activates.`
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add prompts to favorites."
        });
      }
    }
    setAddingToFavorites(false);
  };

  const handleAddMembership = (type: 'monthly' | 'annual') => {
    if (!user || loading) {
      toast({
        title: "Please wait",
        description: "Loading your session. Please try again in a moment."
      });
      return;
    }
    
    if (type === 'monthly') {
      addToCart({
        id: 'monthly-membership',
        type: 'membership',
        title: 'Monthly Membership',
        unitAmountCents: 1299, // $12.99 (50% off from $24.99)
        quantity: 1
      }, !!user);
    } else {
      addToCart({
        id: 'annual-membership', 
        type: 'annual',
        title: 'Annual Access',
        unitAmountCents: 9950, // $99.50 (50% off from $199.00)
        quantity: 1
      }, !!user);
    }
    
    toast({
      title: "Added to Cart!",
      description: `${type === 'monthly' ? 'Monthly Membership' : 'Annual Access'} added to your cart.`
    });
  };

  return (
    <>
      <SEO title="Your Cart" description="Review your selected prompts and packs before checkout." />
      <PageHero title={<><span className="text-gradient-brand">Your</span> Cart</>} subtitle={<>Complete your purchase securely. Membership option available at checkout.</>} minHeightClass="min-h-[25svh]"/>
      <main className="container py-8">
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
              <BreadcrumbPage>Your Cart</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Cross-sell Section */}
        <div className="mb-8">
          <Card className="bg-primary/20 border-primary/30">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <Badge className="mb-3 bg-primary text-white font-semibold px-4 py-1">
                  🎉 New Year Sale - 50% Off Everything!
                </Badge>
                <h2 className="text-2xl font-bold mb-2">Unlock Your AI Potential</h2>
                <p className="text-muted-foreground">Get unlimited access to premium prompts and boost your AI usage limits</p>
              </div>

              <div className="grid gap-4 md:grid-cols-3 mb-6">
                <Card className="group hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 bg-card">
                  <CardContent className="p-4 text-center">
                    <Library className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Prompt Library</h3>
                    <p className="text-sm text-muted-foreground mb-3">Browse 3,000+ free and premium prompts</p>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link to="/library">Browse Library</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 bg-card">
                  <CardContent className="p-4 text-center">
                    <Star className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Pro Prompts</h3>
                    <p className="text-sm text-muted-foreground mb-3">Premium prompts for advanced tasks</p>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link to="/library?isPro=true">View Pro Prompts</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 bg-card">
                  <CardContent className="p-4 text-center">
                    <Zap className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Power Packs</h3>
                    <p className="text-sm text-muted-foreground mb-3">Curated collections for specific needs</p>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link to="/packs">Explore Packs</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-primary text-primary-foreground rounded-lg p-6 border">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold mb-2 text-primary-foreground">🚀 Get Unlimited Access</h3>
                  <p className="text-sm text-primary-foreground/80">
                    Choose a membership to unlock all paid prompts and increase your AI token usage limits
                  </p>
                </div>
                
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="p-4 bg-background text-foreground rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Monthly Membership</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl font-bold text-primary">$12.99</span>
                      <span className="text-sm text-muted-foreground line-through">$24.99</span>
                      <Badge variant="secondary" className="text-xs">50% OFF</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Perfect for regular users</p>
                    <Button 
                      onClick={() => handleAddMembership('monthly')}
                      variant="default" 
                      size="sm" 
                      className="w-full"
                      disabled={hasMembership || loading || !user}
                    >
                      {loading ? "Loading..." : hasMembership ? "In Cart" : "Add to Cart"}
                    </Button>
                  </div>

                  <div className="p-4 bg-background text-foreground rounded-lg border border-accent/50 relative">
                    <Badge className="absolute -top-1 -right-1 bg-primary text-white text-xs font-semibold px-2 py-1 shadow-sm">
                      BEST VALUE
                    </Badge>
                    <div className="flex items-center gap-2 mb-2">
                      <Infinity className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Annual Access</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl font-bold text-primary">$99.50</span>
                      <span className="text-sm text-muted-foreground line-through">$199.00</span>
                      <Badge variant="secondary" className="text-xs">50% OFF</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">One-time payment, unlimited access forever</p>
                    <Button 
                      onClick={() => handleAddMembership('annual')}
                      variant="default" 
                      size="sm" 
                      className="w-full"
                      disabled={hasAnnual || loading || !user}
                    >
                      {loading ? "Loading..." : hasAnnual ? "In Cart" : "Add to Cart"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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
                    {hasAnnual && i.type !== 'annual' ? (
                      <>
                        <span className="text-muted-foreground line-through">{centsToUSD(originalUnitCents(i))}</span>
                        <span className="text-xl font-semibold text-primary">{centsToUSD(0)}</span>
                        <span className="text-xs text-primary font-medium">FREE with Membership</span>
                      </>
                    ) : (!hasAnnual && hasMembership) && (i.type === 'prompt' || i.type === 'pack') ? (
                      <>
                        <span className="text-muted-foreground line-through">{centsToUSD(originalUnitCents(i))}</span>
                        <span className="text-xl font-semibold text-primary">{centsToUSD(0)}</span>
                        <span className="text-xs text-primary font-medium">FREE with Membership</span>
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
                  {/* Coupon Code Section */}
                  <div className="space-y-2 pb-4 border-b">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Coupon Code
                    </label>
                    {appliedCoupon && appliedCoupon.valid ? (
                      <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">{couponCode}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={removeCoupon}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          onClick={() => validateCoupon(couponCode, total)}
                          disabled={isValidating || !couponCode}
                        >
                          {isValidating ? "..." : "Apply"}
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold">{centsToUSD(total)}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex items-center justify-between text-sm text-primary">
                      <span>Coupon Discount</span>
                      <span className="font-medium">-{centsToUSD(couponDiscount)}</span>
                    </div>
                  )}
                  {savings > 0 && (
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Total Savings</span>
                      <span className="font-medium text-primary">{centsToUSD(savings)}</span>
                    </div>
                  )}
                  {(couponDiscount > 0 || savings > 0) && (
                    <div className="flex items-center justify-between pt-2 border-t font-bold text-lg">
                      <span>Total</span>
                      <span>{centsToUSD(totalAfterCoupon)}</span>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button className="flex-1" variant="hero" onClick={beginCheckout}>Checkout</Button>
                    <Button className="flex-1" variant="secondary" onClick={() => clearCart()}>Clear</Button>
                  </div>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      New Year Sale for a limited time only:<br/>
                      🏷️ All PRO prompts $0.99 (was $1.99).<br/>
                      ⚡️Power Packs $4.99 (was $9.99).
                    </p>
                    
                    {hasAnnual && items.some(i => i.type === 'membership' || i.type === 'prompt' || i.type === 'pack') && (
                      <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                        <p className="text-sm font-medium text-primary mb-2">💡 Pro Tip!</p>
                        <p className="text-xs text-muted-foreground mb-2">
                          Your membership, prompts & packs are FREE with Membership! 
                          Add prompts to "My Prompts" now - they'll unlock when you complete checkout.
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={handleAddToMyPrompts}
                          disabled={addingToFavorites}
                        >
                          {addingToFavorites ? "Adding..." : `Add ${items.filter(i => i.type === 'prompt').length} Prompts to My Library`}
                        </Button>
                      </div>
                    ) || (!hasAnnual && hasMembership && items.some(i => i.type === 'prompt' || i.type === 'pack') && (
                      <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                        <p className="text-sm font-medium text-primary mb-2">💡 Pro Tip!</p>
                        <p className="text-xs text-muted-foreground mb-2">
                          Your prompts & packs are FREE with Membership! 
                          Add them to "My Prompts" now - they'll unlock when you complete checkout.
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={handleAddToMyPrompts}
                          disabled={addingToFavorites}
                        >
                          {addingToFavorites ? "Adding..." : `Add ${items.filter(i => i.type === 'prompt').length} Prompts to My Library`}
                        </Button>
                      </div>
                    ))}
                    
                    <div className="text-center text-muted-foreground text-sm">
                      or
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span className="font-medium">Monthly $12.99</span>
                            <span className="text-sm text-muted-foreground">(was $24.99)</span>
                          </div>
                        </div>
                        <Button 
                          onClick={() => handleAddMembership('monthly')}
                          variant="outline" 
                          size="sm"
                          disabled={hasMembership || loading || !user}
                        >
                          {loading ? "Loading..." : hasMembership ? "Added" : "Add to Cart"}
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div>
                          <div className="flex items-center gap-2">
                            <Infinity className="h-4 w-4 text-primary" />
                            <span className="font-medium">Annual $99.50</span>
                            <span className="text-sm text-muted-foreground">(was $199.00)</span>
                          </div>
                        </div>
                        <Button 
                          onClick={() => handleAddMembership('annual')}
                          variant="outline" 
                          size="sm"
                          disabled={hasAnnual || loading || !user}
                        >
                          {loading ? "Loading..." : hasAnnual ? "Added" : "Add to Cart"}
                        </Button>
                      </div>
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
