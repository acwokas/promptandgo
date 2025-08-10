import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useToast } from "@/components/ui/use-toast";
import { useEnsureProfile } from "@/hooks/useEnsureProfile";


const Header = () => {
  const { user } = useSupabaseAuth();
  
  const { toast } = useToast();
  useEnsureProfile();
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({ title: "Logout failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Signed out" });
    }
  };
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <nav className="container flex items-center justify-between h-24">
        <Link to="/" className="flex items-center gap-2" aria-label="PromptAndGo.ai home">
          <img
            src="/lovable-uploads/00a8a6c7-da53-4583-8f5d-f1ee4a899501.png"
            alt="PromptAndGo.ai logo"
            className="h-[4.5rem] md:h-[5.25rem] w-auto align-middle"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </Link>
        <ul className="hidden md:flex items-center gap-6 text-sm">
          <li><NavLink to="/" className={({isActive})=> isActive?"text-primary":"text-foreground/80 hover:text-foreground"}>Welcome</NavLink></li>
          <li><NavLink to="/how-it-works" className={({isActive})=> isActive?"text-primary":"text-foreground/80 hover:text-foreground"}>How it Works</NavLink></li>
          <li><NavLink to="/library" className={({isActive})=> isActive?"text-primary":"text-foreground/80 hover:text-foreground"}>Prompt Library</NavLink></li>
          <li><NavLink to="/packs" className={({isActive})=> isActive?"text-primary":"text-foreground/80 hover:text-foreground"}>Premium Packs</NavLink></li>
          
          <li><NavLink to="/blog" className={({isActive})=> isActive?"text-primary":"text-foreground/80 hover:text-foreground"}>Prompt Pulse</NavLink></li>
          
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
                  <NavLink to="/library" className={({isActive})=> isActive?"text-primary":"text-foreground/80 hover:text-foreground"}>Prompt Library</NavLink>
                  <NavLink to="/packs" className={({isActive})=> isActive?"text-primary":"text-foreground/80 hover:text-foreground"}>Premium Packs</NavLink>
                  <NavLink to="/blog" className={({isActive})=> isActive?"text-primary":"text-foreground/80 hover:text-foreground"}>Prompt Pulse</NavLink>
                  
                  {user && (
                    <NavLink to="/account" className={({isActive})=> isActive?"text-primary":"text-foreground/80 hover:text-foreground"}>My Account</NavLink>
                  )}
                  {user ? (
                    <Button variant="secondary" onClick={handleLogout} className="mt-2">Log out</Button>
                  ) : (
                    <NavLink to="/auth" className={({isActive})=> isActive?"text-primary":"text-foreground/80 hover:text-foreground"}>Log in</NavLink>
                  )}
                  <Button asChild variant="hero" className="mt-4">
                    <Link to="#cta">Try a Prompt</Link>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
          {/* Desktop CTA */}
          <Button asChild variant="hero" className="px-5 hidden md:inline-flex">
            <Link to="#cta">Try a Prompt</Link>
          </Button>
          {!user && (
            <Button asChild variant="ghost" className="hidden md:inline-flex">
              <Link to="/auth">Log in</Link>
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
