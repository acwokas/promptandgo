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
    <header className="flex-1">
      <nav className="container flex items-center justify-between h-14 px-4">
        <Link to="/" className="flex items-center gap-2" aria-label="promptandgo home">
          <img
            src="/lovable-uploads/99652d74-cac3-4e8f-ad70-8d2b77303b54.png"
            alt="promptandgo logo"
            className="h-8 w-auto align-middle object-contain"
            loading="eager"
            decoding="async"
            width="149"
            height="84"
            sizes="149px"
          />
        </Link>
        
        <div className="flex items-center gap-2">
          {/* CTA Button */}
          {user ? (
            <Button asChild variant="hero" size="sm">
              <Link to="/library?random=1">Inspire Me!</Link>
            </Button>
          ) : (
            <Button asChild variant="cta" size="sm">
              <Link to="/auth?mode=signup">Get FREE Pack!</Link>
            </Button>
          )}
          
          {/* Cart Button */}
          <Button asChild variant="ghost" size="icon" className="relative" title="Cart" aria-label="Cart">
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5" aria-hidden="true" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] px-1">
                  {cartCount}
                </span>
              )}
            </Link>
          </Button>
          
          {/* User Account / Login */}
          {user ? (
            <Button asChild variant="ghost" size="icon" title="My Account" aria-label="My Account">
              <Link to="/account">
                <User className="h-5 w-5" aria-hidden="true" />
              </Link>
            </Button>
          ) : (
            <Button asChild variant="ghost" size="sm">
              <Link to="/auth">Login</Link>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
