import { Link } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { User as UserIcon, Bot, Search, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const { user } = useSupabaseAuth();
  return (
    <footer className="border-t mt-16">
      <div className="container py-10 grid gap-6 md:grid-cols-3 text-sm">
        <div>
          <Link to="/" className="inline-flex items-center mb-1" aria-label="PromptandGo home">
            <img
              src="/lovable-uploads/9e8de25b-d91c-445a-b211-d156a28e4b33.png"
              alt="PromptandGo logo"
              className="h-8 w-auto object-contain -mt-1 max-w-[200px]"
              loading="lazy"
              decoding="async"
            />
          </Link>
          <div className="ml-1.5 mt-3">
            {user ? (
              <Button asChild variant="hero" size="sm" aria-label="Inspire Me!">
                <Link to="/library?random=1">Inspire Me!</Link>
              </Button>
            ) : (
              <Button asChild variant="cta" size="sm" aria-label="Get 1 FREE ⚡️Power Pack!">
                <Link to="/auth?mode=signup">Get 1 FREE ⚡️Power Pack!</Link>
              </Button>
            )}
          </div>
        </div>
        <div className="md:col-span-2 grid grid-cols-3 gap-4">
          <nav className="flex flex-col gap-2">
            <span className="text-foreground font-medium">Popular categories</span>
            <Link to="/library?q=marketing" className="text-muted-foreground hover:text-foreground">Marketing prompts</Link>
            <Link to="/library?q=productivity" className="text-muted-foreground hover:text-foreground">Productivity prompts</Link>
            <Link to="/library?q=sales" className="text-muted-foreground hover:text-foreground">Sales prompts</Link>
            <Link to="/library?q=seo" className="text-muted-foreground hover:text-foreground">SEO prompts</Link>
            <Link to="/library?q=content" className="text-muted-foreground hover:text-foreground">Content creation prompts</Link>
            <Link to="/library?q=social%20media" className="text-muted-foreground hover:text-foreground">Social media prompts</Link>
            <Link to="/library?q=business" className="text-muted-foreground hover:text-foreground">Business strategy prompts</Link>
            <Link to="/library?q=writing" className="text-muted-foreground hover:text-foreground">Writing prompts</Link>
            <Link to="/library?q=customer%20service" className="text-muted-foreground hover:text-foreground">Customer service prompts</Link>
            <Link to="/library?q=creative" className="text-muted-foreground hover:text-foreground">Creative prompts</Link>
          </nav>
          <nav className="flex flex-col gap-2">
            <span className="text-foreground font-medium">Main sections</span>
            <Link to="/" className="text-muted-foreground hover:text-foreground">👋 Welcome</Link>
            <Link to="/library" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
              <Search className="h-3 w-3" />
              Browse Library
            </Link>
            <Link to="/packs" className="text-muted-foreground hover:text-foreground">⚡️ Power Packs</Link>
            <Link to="/scout" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
              <Bot className="h-3 w-3 text-blue-500" />
              Scout AI
            </Link>
            <Link to="/how-it-works" className="text-muted-foreground hover:text-foreground">🤓 How it Works</Link>
            <Link to="/tips" className="text-muted-foreground hover:text-foreground">💡 Tips</Link>
            <Link to="/faqs" className="text-muted-foreground hover:text-foreground">❓ FAQs</Link>
          </nav>
          <nav className="flex flex-col gap-2">
            <span className="text-foreground font-medium">Tools</span>
            <Link to="/ai/generator" className="text-muted-foreground hover:text-foreground">Scout AI Prompt Generator</Link>
            <Link to="/ai/assistant" className="text-muted-foreground hover:text-foreground">Scout AI Assistant</Link>
            <Link to="/library" className="text-muted-foreground hover:text-foreground">Prompt Library</Link>
            <Link to="/submit" className="text-muted-foreground hover:text-foreground">Submit a Prompt</Link>
            <Link to="/contact" className="text-muted-foreground hover:text-foreground">Contact Us</Link>
            {user && (
              <Link to="/account" className="text-muted-foreground hover:text-foreground" title="My Account" aria-label="My Account">
                <span className="inline-flex items-center gap-2"><UserIcon className="h-4 w-4" aria-hidden="true" /> My Account</span>
              </Link>
            )}
            <Link to={user ? "/account/favorites" : "/auth"} className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
              <Heart className="h-3 w-3 text-red-500" />
              My Prompts
            </Link>
          </nav>
        </div>
        <div className="md:col-span-3 col-span-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-muted-foreground">
          <div>
            Explore AI insights and stories at <a href="http://www.aiinasia.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground underline font-bold">AIinASIA.com</a>
          </div>
          <div className="text-right">
            © 2025 PromptandGo  |  <Link to="/terms" className="hover:text-foreground">Terms & Conditions</Link>  |  <Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
