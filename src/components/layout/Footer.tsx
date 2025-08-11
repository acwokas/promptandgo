import { Link } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { User as UserIcon } from "lucide-react";

const Footer = () => {
  const { user } = useSupabaseAuth();
  return (
    <footer className="border-t mt-16">
      <div className="container py-10 grid gap-6 md:grid-cols-3 text-sm">
        <div>
          <Link to="/" className="inline-flex items-center mb-2" aria-label="PromptAndGo.ai home">
            <img
              src="/lovable-uploads/99652d74-cac3-4e8f-ad70-8d2b77303b54.png"
              alt="PromptAndGo.ai logo"
              className="h-36 w-auto object-contain"
              loading="lazy"
              decoding="async"
            />
          </Link>
          <p className="text-muted-foreground">Ready-to-use prompts for real-world work.</p>
        </div>
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          <nav className="flex flex-col gap-2">
            <Link to="/" className="text-muted-foreground hover:text-foreground">Welcome</Link>
            <Link to="/how-it-works" className="text-muted-foreground hover:text-foreground">How it Works</Link>
            <Link to="/library" className="text-muted-foreground hover:text-foreground">Prompt Library</Link>
            <Link to="/packs" className="text-muted-foreground hover:text-foreground">Premium Packs</Link>
            <Link to="/faqs" className="text-muted-foreground hover:text-foreground">FAQs</Link>
          </nav>
          <nav className="flex flex-col gap-2">
            <Link to="/blog" className="text-muted-foreground hover:text-foreground">Prompt Pulse</Link>
            <Link to="/submit" className="text-muted-foreground hover:text-foreground">Submit a Prompt</Link>
            <Link to="/contact" className="text-muted-foreground hover:text-foreground">Contact Us</Link>
            {user && (
              <Link to="/account" className="text-muted-foreground hover:text-foreground" title="My Account" aria-label="My Account">
                <span className="inline-flex items-center gap-2"><UserIcon className="h-4 w-4" aria-hidden="true" /> My Account</span>
              </Link>
            )}
          </nav>
        </div>
        <div className="md:col-span-3 col-span-full justify-self-end text-right text-muted-foreground">© 2025 PromptAndGo.ai  |  <Link to="/terms" className="hover:text-foreground">Terms & Conditions</Link>  |  <Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link></div>
      </div>
    </footer>
  );
};

export default Footer;
