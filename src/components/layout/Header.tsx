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
    <header className="w-full bg-white border-b" style={{ borderBottomColor: '#e5e7eb', position: 'sticky', top: '0', zIndex: '50' }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: '60px',
        boxSizing: 'border-box'
      }}>
        {/* Left side - Logo and Sidebar trigger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Button asChild variant="ghost" size="icon" className="lg:hidden">
            <button 
              onClick={() => {
                const trigger = document.querySelector('[data-sidebar-trigger]') as HTMLButtonElement;
                trigger?.click();
              }}
              aria-label="Toggle sidebar"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M1.5 3C1.22386 3 1 3.22386 1 3.5S1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5S13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5S13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5S13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z" fill="currentColor"/>
              </svg>
            </button>
          </Button>
          
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }} aria-label="promptandgo home">
            <img
              src="/lovable-uploads/99652d74-cac3-4e8f-ad70-8d2b77303b54.png"
              alt="promptandgo logo"
              style={{ 
                width: 'auto', 
                height: '28px', 
                maxWidth: '100px',
                objectFit: 'contain'
              }}
              loading="eager"
              decoding="async"
            />
          </Link>
        </div>
        
        {/* Right side - Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: '0' }}>
          {/* CTA Button */}
          {user ? (
            <Button asChild variant="hero" size="sm" style={{ whiteSpace: 'nowrap' }}>
              <Link to="/library?random=1">Inspire Me!</Link>
            </Button>
          ) : (
            <Button asChild variant="cta" size="sm" style={{ whiteSpace: 'nowrap' }}>
              <Link to="/auth?mode=signup">Get FREE Pack!</Link>
            </Button>
          )}
          
          {/* Cart Button */}
          <Button asChild variant="ghost" size="icon" className="relative" title="Cart" aria-label="Cart">
            <Link to="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingCart style={{ width: '20px', height: '20px' }} aria-hidden="true" />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  fontSize: '10px',
                  borderRadius: '50%',
                  minWidth: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '2px'
                }}>
                  {cartCount}
                </span>
              )}
            </Link>
          </Button>
          
          {/* User Account / Login */}
          {user ? (
            <Button asChild variant="ghost" size="icon" title="My Account" aria-label="My Account">
              <Link to="/account" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User style={{ width: '20px', height: '20px' }} aria-hidden="true" />
              </Link>
            </Button>
          ) : (
            <Button asChild variant="ghost" size="sm" style={{ whiteSpace: 'nowrap' }}>
              <Link to="/auth">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
