import { Link } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { User as UserIcon, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const { user } = useSupabaseAuth();
  return (
    <footer className="border-t mt-16">
      <div className="container py-10 grid gap-6 md:grid-cols-3 text-sm">
        <div>
          <Link to="/" className="inline-flex items-center mb-1" aria-label="promptandgo home">
            <img
              src="/lovable-uploads/9e8de25b-d91c-445a-b211-d156a28e4b33.png"
              alt="promptandgo logo"
              className="w-[40ch] max-w-full h-auto object-contain -mt-1"
              loading="lazy"
              decoding="async"
            />
          </Link>
          <div className="ml-1.5 mt-3">
            <Button asChild variant="cta" size="sm" aria-label="Get 1 FREE ⚡️Power Pack!">
              <Link to="/auth?mode=signup">Get 1 FREE ⚡️Power Pack!</Link>
            </Button>
          </div>
        </div>
        <div className="md:col-span-2 grid grid-cols-3 gap-4">
          <nav className="flex flex-col gap-2">
            <span className="text-foreground font-medium">Popular categories</span>
            <Link to="/library?q=marketing" className="text-muted-foreground hover:text-foreground">Marketing prompts</Link>
            <Link to="/library?q=productivity" className="text-muted-foreground hover:text-foreground">Productivity prompts</Link>
            <Link to="/library?q=sales" className="text-muted-foreground hover:text-foreground">Sales prompts</Link>
            <Link to="/library?q=seo" className="text-muted-foreground hover:text-foreground">SEO prompts</Link>
          </nav>
          <nav className="flex flex-col gap-2">
            <span className="text-foreground font-medium">Main sections</span>
            <Link to="/" className="text-muted-foreground hover:text-foreground">Welcome</Link>
            <Link to="/how-it-works" className="text-muted-foreground hover:text-foreground">How it Works</Link>
            <Link to="/library" className="text-muted-foreground hover:text-foreground">Library</Link>
            <Link to="/packs" className="text-muted-foreground hover:text-foreground">⚡️Power Packs</Link>
            <Link to="/toolkit" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
              <Bot className="h-3 w-3 text-blue-500" />
              AI Tools
            </Link>
            <Link to="/blog" className="text-muted-foreground hover:text-foreground">Tips</Link>
            <Link to="/faqs" className="text-muted-foreground hover:text-foreground">FAQs</Link>
          </nav>
          <nav className="flex flex-col gap-2">
            <span className="text-foreground font-medium">AI Tools</span>
            <Link to="/ai/generator" className="text-muted-foreground hover:text-foreground">AI Prompt Generator</Link>
            
            <Link to="/ai/assistant" className="text-muted-foreground hover:text-foreground">AI Assistant</Link>
            <Link to="/submit" className="text-muted-foreground hover:text-foreground">Submit a Prompt</Link>
            <Link to="/contact" className="text-muted-foreground hover:text-foreground">Contact Us</Link>
            {user && (
              <Link to="/account" className="text-muted-foreground hover:text-foreground" title="My Account" aria-label="My Account">
                <span className="inline-flex items-center gap-2"><UserIcon className="h-4 w-4" aria-hidden="true" /> My Account</span>
              </Link>
            )}
          </nav>
        </div>
        <div className="md:col-span-3 col-span-full justify-self-end text-right text-muted-foreground">© 2025 <strong>prompt</strong>andgo  |  <Link to="/terms" className="hover:text-foreground">Terms & Conditions</Link>  |  <Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link></div>
      </div>
    </footer>
  );
};

export default Footer;
