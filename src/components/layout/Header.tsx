import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, ShoppingCart } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
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
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.warn("Normal signout failed, forcing local signout:", error.message);
        await supabase.auth.signOut({ scope: 'local' });
      }
      clearCartOnLogout();
      toast({ title: "Signed out successfully" });
    } catch (err: any) {
      console.error("All signout methods failed, clearing local state:", err);
      await supabase.auth.signOut({ scope: 'local' });
      clearCartOnLogout();
      toast({ title: "Signed out" });
    }
  };

  useEffect(() => {
    if (!user) {
      clearCartOnLogout();
    }
  }, [user]);

  return (
    <header className="w-full bg-background border-b border-border sticky top-0 z-50">
      <div className="w-full max-w-7xl mx-auto px-4 flex items-center justify-between min-h-14 box-border">
        {/* Hamburger Menu */}
        <SidebarTrigger />
        
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center flex-shrink-0"
        >
          <img
            src="/lovable-uploads/99652d74-cac3-4e8f-ad70-8d2b77303b54.png"
            alt="promptandgo"
            className="h-20 w-auto max-w-64 object-contain"
          />
        </Link>
        
        {/* Desktop Navigation - Hidden on mobile */}
        <nav className="hidden lg:flex items-center gap-6 flex-1 justify-center">
          <Link 
            to="/library" 
            className="text-sm text-foreground hover:text-primary transition-colors"
          >
            Browse Library
          </Link>
          <Link 
            to="/packs" 
            className="text-sm text-foreground hover:text-primary transition-colors"
          >
            Power Packs
          </Link>
          <Link 
            to="/scout" 
            className="text-sm text-foreground hover:text-primary transition-colors"
          >
            Scout AI
          </Link>
          <Link 
            to="/how-it-works" 
            className="text-sm text-foreground hover:text-primary transition-colors"
          >
            How it Works
          </Link>
          <Link 
            to="/tips" 
            className="text-sm text-foreground hover:text-primary transition-colors"
          >
            Tips
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