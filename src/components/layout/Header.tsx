import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <nav className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2" aria-label="PromptAndGo.ai home">
          <img
            src="/lovable-uploads/00a8a6c7-da53-4583-8f5d-f1ee4a899501.png"
            alt="PromptAndGo.ai logo"
            className="h-10 md:h-12 w-auto"
            width={192}
            height={48}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </Link>
        <ul className="hidden md:flex items-center gap-6 text-sm">
          <li><NavLink to="/" className={({isActive})=> isActive?"text-primary":"text-foreground/80 hover:text-foreground"}>Welcome</NavLink></li>
          <li><NavLink to="/library" className={({isActive})=> isActive?"text-primary":"text-foreground/80 hover:text-foreground"}>Prompt Library</NavLink></li>
          <li><NavLink to="/packs" className={({isActive})=> isActive?"text-primary":"text-foreground/80 hover:text-foreground"}>Prompt Packs</NavLink></li>
          <li><NavLink to="/how-it-works" className={({isActive})=> isActive?"text-primary":"text-foreground/80 hover:text-foreground"}>How it Works</NavLink></li>
          <li><NavLink to="/submit" className={({isActive})=> isActive?"text-primary":"text-foreground/80 hover:text-foreground"}>Submit a Prompt</NavLink></li>
          <li><NavLink to="/blog" className={({isActive})=> isActive?"text-primary":"text-foreground/80 hover:text-foreground"}>Blog</NavLink></li>
          <li><NavLink to="/contact" className={({isActive})=> isActive?"text-primary":"text-foreground/80 hover:text-foreground"}>Contact</NavLink></li>
        </ul>
        <div className="flex gap-2">
          <Button asChild variant="hero" className="px-5">
            <Link to="#cta">Get 3 Free Prompts Weekly</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
