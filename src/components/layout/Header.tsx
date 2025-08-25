import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, ShoppingCart, Bot, Heart, Search } from "lucide-react";
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
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <nav className="container flex items-center justify-between h-24">
        <Link to="/" className="flex items-center gap-2" aria-label="promptandgo home">
          <img
            src="/lovable-uploads/99652d74-cac3-4e8f-ad70-8d2b77303b54.png"
            alt="promptandgo logo"
            className="h-[4.5rem] md:h-[5.25rem] w-auto align-middle object-contain"
            loading="eager"
            decoding="async"
          />
        </Link>
        <ul className="hidden md:flex items-center gap-6 text-sm">
          <li><NavLink to="/" className={({isActive})=> isActive?"text-primary":"text-foreground/80 hover:text-foreground"}>Welcome</NavLink></li>
          <li><NavLink to="/how-it-works" className={({isActive})=> isActive?"text-primary":"text-foreground/80 hover:text-foreground"}>How it Works</NavLink></li>
          <li><NavLink to="/library" className={({isActive})=> isActive?"text-primary":"text-foreground/80 hover:text-foreground"}><Search className="h-4 w-4 inline mr-1" />Browse Library</NavLink></li>
          <li><NavLink to="/packs" className={({isActive})=> isActive?"text-primary":"text-foreground/80 hover:text-foreground"}>⚡️Power Packs</NavLink></li>
          <li>
            <NavLink to="/scout" className={({isActive})=> isActive?"text-primary":"text-foreground/80 hover:text-foreground"}>
              <Bot className="h-4 w-4 inline mr-1 text-blue-500" />
              Scout AI
            </NavLink>
          </li>
          <li><NavLink to="/blog" className={({isActive})=> isActive?"text-primary":"text-foreground/80 hover:text-foreground"}>Tips</NavLink></li>
          <li><NavLink to="/faqs" className={({isActive})=> isActive?"text-primary":"text-foreground/80 hover:text-foreground"}>FAQs</NavLink></li>
          {user && (
            <li>
              <NavLink to="/account/favorites" className={({isActive})=> isActive?"text-primary":"text-foreground/80 hover:text-foreground"}>
                <Heart className="h-4 w-4 inline mr-1 text-red-500" />
                My Prompts
              </NavLink>
            </li>
          )}
        </ul>
        <div className="flex items-center gap-2">
          {/* Mobile menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-6 w-6" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="mt-8 grid gap-3 text-base">
                  <NavLink to="/" className={({isActive})=> isActive?"text-primary":"text-foreground/80 hover:text-foreground"}>Welcome</NavLink>
                  <NavLink to="/how-it-works" className={({isActive})=> isActive?"text-primary":"text-foreground/80 hover:text-foreground"}>How it Works</NavLink>
                  <NavLink to="/library" className={({isActive})=> isActive?"text-primary":"text-foreground/80 hover:text-foreground"}><Search className="h-4 w-4 inline mr-1" />Browse Library</NavLink>
                  <NavLink to="/packs" className={({isActive})=> isActive?"text-primary":"text-foreground/80 hover:text-foreground"}>⚡️Power Packs</NavLink>
                  <NavLink to="/scout" className={({isActive})=> isActive?"text-primary":"text-foreground/80 hover:text-foreground"}>
                    <Bot className="h-4 w-4 inline mr-1 text-blue-500" />
                    Scout AI
                  </NavLink>
                  <NavLink to="/cart" className={({isActive})=> isActive?"text-primary":"text-foreground/80 hover:text-foreground"}>Cart</NavLink>
                  <NavLink to="/blog" className={({isActive})=> isActive?"text-primary":"text-foreground/80 hover:text-foreground"}>Tips</NavLink>
                  <NavLink to="/faqs" className={({isActive})=> isActive?"text-primary":"text-foreground/80 hover:text-foreground"}>FAQs</NavLink>
                  
                  {user && (
                    <>
                      <NavLink to="/account/favorites" className={({isActive})=> isActive?"text-primary":"text-foreground/80 hover:text-foreground"}>
                        <Heart className="h-4 w-4 inline mr-1 text-red-500" />
                        My Prompts
                      </NavLink>
                      <NavLink to="/account" className={({isActive})=> isActive?"text-primary":"text-foreground/80 hover:text-foreground"}>My Account</NavLink>
                    </>
                  )}
                  {user ? (
                    <Button variant="secondary" onClick={handleLogout} className="mt-2">Log out</Button>
                  ) : (
                    <NavLink to="/auth" className={({isActive})=> isActive?"text-primary":"text-foreground/80 hover:text-foreground"}>Login / Sign up</NavLink>
                  )}
                  {user ? (
                    <Button asChild variant="hero" className="mt-4">
                      <Link to="/library?random=1">Inspire Me!</Link>
                    </Button>
                  ) : (
                    <Button asChild variant="cta" className="mt-4">
                      <Link to="/auth?mode=signup">Get 1 FREE ⚡️Power Pack!</Link>
                    </Button>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
          {/* Desktop CTA */}
          {user ? (
            <Button asChild variant="hero" className="px-5 hidden md:inline-flex">
              <Link to="/library?random=1">Inspire Me!</Link>
            </Button>
          ) : (
            <Button asChild variant="cta" className="px-5 hidden md:inline-flex">
              <Link to="/auth?mode=signup">Get 1 FREE ⚡️Power Pack!</Link>
            </Button>
          )}
          <Button asChild variant="ghost" size="icon" className="hidden md:inline-flex relative" title="Cart" aria-label="Cart">
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5" aria-hidden="true" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] px-1">
                  {cartCount}
                </span>
              )}
            </Link>
          </Button>
          {!user && (
            <Button asChild variant="ghost" className="hidden md:inline-flex">
              <Link to="/auth">Login / Sign up</Link>
            </Button>
          )}
          {user && (
            <Button asChild variant="ghost" size="icon" className="hidden md:inline-flex" title="My Account" aria-label="My Account">
              <Link to="/account">
                <User className="h-5 w-5" aria-hidden="true" />
              </Link>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
