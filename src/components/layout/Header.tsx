import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, ShoppingCart, Sparkles, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useToast } from "@/components/ui/use-toast";
import { useEnsureProfile } from "@/hooks/useEnsureProfile";
import { useEffect, useState } from "react";
import { getCartCount, clearCartOnLogout } from "@/lib/cart";
import { SeoOptimizedImage } from "@/components/seo/SeoOptimizedImage";
import { XPDisplay } from "../xp/XPDisplay";
import { useIsCertified } from "@/hooks/useIsCertified";

// Component to safely render SidebarTrigger only when context is available
const SafeSidebarTrigger = () => {
  try {
    const sidebar = useSidebar();
    return <SidebarTrigger />;
  } catch {
    // If no SidebarProvider context, don't render anything
    return null;
  }
};

const Header = () => {
  const { user, logout } = useSupabaseAuth();
  const { toast } = useToast();
  useEnsureProfile();
  const { isCertified } = useIsCertified();

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
    <header className="w-full bg-background border-b border-border sticky top-0 z-50">
      <div className="w-full max-w-7xl mx-auto px-4 flex items-center justify-between min-h-14 box-border">
        {/* Hamburger Menu - All Devices */}
        <div className="flex flex-shrink-0">
          <SafeSidebarTrigger />
        </div>
        
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center flex-shrink-0 max-w-40 md:max-w-64"
        >
        <img
          src="/lovable-uploads/99652d74-cac3-4e8f-ad70-8d2b77303b54.png"
          alt="PromptandGo - AI Prompt Library"
          width="256"
          height="80"
          loading="eager"
          className="h-16 md:h-20 w-auto max-w-40 md:max-w-64 object-contain"
        />
        </Link>
        
        {/* Desktop Navigation with Search */}
        <nav className="hidden lg:flex items-center gap-6 flex-1 justify-center md:ml-8">
          <Link 
            to="/library" 
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Browse Prompts
          </Link>
          <Link 
            to="/scout" 
            className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            <Sparkles className="h-3 w-3" />
            Ask Scout
          </Link>
          {!isCertified && (
            <Link 
              to="/certification" 
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Get Certified
            </Link>
          )}
          <Link 
            to="/packs" 
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Power Packs
          </Link>
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-sm ml-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Find your perfect prompt..."
              className="pl-10 pr-4 py-2 text-sm bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const target = e.target as HTMLInputElement;
                  if (target.value.trim()) {
                    window.location.href = `/library?q=${encodeURIComponent(target.value.trim())}`;
                  }
                }
              }}
            />
          </div>
        </nav>
        
        {/* Right Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* XP Display for logged-in users */}
          {user && <XPDisplay />}
          
          {/* CTA */}
          {!user && (
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