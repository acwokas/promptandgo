import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, ShoppingCart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useToast } from "@/components/ui/use-toast";
import { useEnsureProfile } from "@/hooks/useEnsureProfile";
import { useEffect, useState } from "react";
import { getCartCount, clearCartOnLogout } from "@/lib/cart";

const Header = () => {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  useEnsureProfile();

  const [cartCount, setCartCount] = useState<number>(getCartCount(!!user));
  useEffect(() => {
    const onChange = () => setCartCount(getCartCount(!!user));
    window.addEventListener('cart:change', onChange);
    window.addEventListener('storage', onChange);
    return () => {
      window.removeEventListener('cart:change', onChange);
      window.removeEventListener('storage', onChange);
    };
  }, [user]);

  const handleLogout = async () => {
    try {
      // Try to sign out normally first
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        // If normal signout fails (e.g., session expired), force local signout
        console.warn("Normal signout failed, forcing local signout:", error.message);
        await supabase.auth.signOut({ scope: 'local' });
      }
      
      clearCartOnLogout(); // Clear cart when user logs out
      toast({ title: "Signed out successfully" });
    } catch (err: any) {
      // Fallback: force local signout even if everything fails
      console.error("All signout methods failed, clearing local state:", err);
      await supabase.auth.signOut({ scope: 'local' });
      clearCartOnLogout();
      toast({ title: "Signed out" });
    }
  };

  // Clear cart when user logs out (detect auth state change)
  useEffect(() => {
    if (!user) {
      clearCartOnLogout();
    }
  }, [user]);
  return (
    <header className="w-full bg-background border-b border-border">
      <div className="w-full max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between w-full">
          <Link to="/" className="flex items-center flex-shrink-0" aria-label="promptandgo home">
            <img
              src="/lovable-uploads/99652d74-cac3-4e8f-ad70-8d2b77303b54.png"
              alt="promptandgo logo"
              width="100"
              height="57"
              style={{ 
                width: 'auto', 
                height: '32px', 
                maxWidth: '120px',
                objectFit: 'contain' 
              }}
              loading="eager"
              decoding="async"
            />
          </Link>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* CTA Button */}
            {user ? (
              <Button asChild variant="hero" size="sm" className="whitespace-nowrap">
                <Link to="/library?random=1">Inspire Me!</Link>
              </Button>
            ) : (
              <Button asChild variant="cta" size="sm" className="whitespace-nowrap">
                <Link to="/auth?mode=signup">Get FREE Pack!</Link>
              </Button>
            )}
            
            {/* Cart Button */}
            <Button asChild variant="ghost" size="icon" className="relative flex-shrink-0" title="Cart" aria-label="Cart">
              <Link to="/cart" className="relative">
                <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                    {cartCount}
                  </span>
                )}
              </Link>
            </Button>
            
            {/* User Account / Login */}
            {user ? (
              <Button asChild variant="ghost" size="icon" className="flex-shrink-0" title="My Account" aria-label="My Account">
                <Link to="/account">
                  <User className="h-5 w-5" aria-hidden="true" />
                </Link>
              </Button>
            ) : (
              <Button asChild variant="ghost" size="sm" className="whitespace-nowrap">
                <Link to="/auth">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
