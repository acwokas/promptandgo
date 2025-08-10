import { Link } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { User as UserIcon } from "lucide-react";

const Footer = () => {
  const { user } = useSupabaseAuth();
  return (
    <footer className="border-t mt-16">
      <div className="container py-10 grid gap-6 md:grid-cols-3 text-sm">
        <div>
          <p className="font-semibold mb-2">PromptAndGo.ai</p>
          <p className="text-muted-foreground">Ready-to-use prompts for real-world work.</p>
        </div>
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          <nav className="flex flex-col gap-2">
            <Link to="/" className="text-muted-foreground hover:text-foreground">Welcome</Link>
            <Link to="/how-it-works" className="text-muted-foreground hover:text-foreground">How it Works</Link>
            <Link to="/library" className="text-muted-foreground hover:text-foreground">Prompt Library</Link>
            <Link to="/packs" className="text-muted-foreground hover:text-foreground">Premium Packs</Link>
            <Link to="/blog" className="text-muted-foreground hover:text-foreground">Prompt Pulse</Link>
          </nav>
          <nav className="flex flex-col gap-2">
            <Link to="/submit" className="text-muted-foreground hover:text-foreground">Submit a Prompt</Link>
            <Link to="/contact" className="text-muted-foreground hover:text-foreground">Contact Us</Link>
            <Link to="/terms" className="text-muted-foreground hover:text-foreground">Terms & Conditions</Link>
            <Link to="/privacy" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link>
            {user && (
              <Link to="/account" className="text-muted-foreground hover:text-foreground" title="My Account" aria-label="My Account">
                <span className="inline-flex items-center gap-2"><UserIcon className="h-4 w-4" aria-hidden="true" /> My Account</span>
              </Link>
            )}
          </nav>
        </div>
        <div className="md:col-span-3 justify-self-end text-muted-foreground">© {new Date().getFullYear()} PromptAndGo.ai</div>
      </div>
    </footer>
  );
};

export default Footer;
