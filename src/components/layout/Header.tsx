import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, ShoppingCart, Sparkles } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useToast } from "@/components/ui/use-toast";
import { useEnsureProfile } from "@/hooks/useEnsureProfile";
import { useEffect, useState } from "react";
import { getCartCount, clearCartOnLogout } from "@/lib/cart";

const Header = () => {
  const { user, logout } = useSupabaseAuth();
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
    clearCartOnLogout();
    toast({ title: "Signed out successfully" });
    // Use the enhanced logout from the hook
    if (logout) {
      await logout();
    }
  };

  useEffect(() => {
    if (!user) {
      clearCartOnLogout();
    }
  }, [user]);

  return (
    <header className="w-full bg-background border-b border-border sticky top-0 z-50 overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 flex items-center justify-between min-h-14 box-border overflow-hidden max-w-full">
        {/* Hamburger Menu - Desktop Only */}
        <div className="hidden md:flex flex-shrink-0">
          <SidebarTrigger />
        </div>
        
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center flex-shrink-0 max-w-48 md:max-w-64 md:ml-0 ml-0"
        >
        <img
          src="/lovable-uploads/99652d74-cac3-4e8f-ad70-8d2b77303b54.png"
          alt="promptandgo"
          className="h-16 md:h-20 w-auto max-w-40 md:max-w-64 object-contain"
        />
        </Link>
        
        {/* Desktop Navigation - Simplified for maximum conversion */}
        <nav className="hidden lg:flex items-center gap-8 flex-1 justify-center md:ml-8">
          <Link 
            to="/library" 
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Browse Prompts
          </Link>
          <Link 
            to="/ai/studio" 
            className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            <Sparkles className="h-3 w-3" />
            Scout AI
          </Link>
          <Link 
            to="/packs" 
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Premium Packs
          </Link>
        </nav>
        
        {/* Right Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* CTA */}
          {user ? (
            <Link 
              to="/library?random=1"
              className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-sm whitespace-nowrap inline-block hover:bg-primary/90 transition-colors"
            >
              Inspire Me!
            </Link>
          ) : (
            <Link 
              to="/auth?mode=signup"
              className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-sm whitespace-nowrap inline-block hover:bg-primary/90 transition-colors"
            >
              Get FREE Pack!
            </Link>
          )}
          
          {/* Cart */}
          <Link 
            to="/cart"
            className="relative p-2 flex items-center justify-center text-foreground hover:text-primary transition-colors"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-0 -right-0 bg-destructive text-destructive-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          
          {/* User/Login */}
          {user ? (
            <Link 
              to="/account"
              className="p-2 flex items-center justify-center text-foreground hover:text-primary transition-colors"
            >
              <User size={20} />
            </Link>
          ) : (
            <Link 
              to="/auth"
              className="px-3 py-1.5 text-sm text-foreground whitespace-nowrap hover:text-primary transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;