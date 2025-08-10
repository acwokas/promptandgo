import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t mt-16">
      <div className="container py-10 grid gap-6 md:grid-cols-3 text-sm">
        <div>
          <p className="font-semibold mb-2">PromptAndGo.ai</p>
          <p className="text-muted-foreground">Ready-to-use prompts for real-world work.</p>
        </div>
        <div className="md:col-span-2">
          <nav className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            <Link to="/" className="text-muted-foreground hover:text-foreground">Welcome</Link>
            <Link to="/how-it-works" className="text-muted-foreground hover:text-foreground">How it Works</Link>
            <Link to="/library" className="text-muted-foreground hover:text-foreground">Free Library</Link>
            <Link to="/packs" className="text-muted-foreground hover:text-foreground">Premium Packs</Link>
            <Link to="/blog" className="text-muted-foreground hover:text-foreground">Blog</Link>
            <Link to="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link>
            <Link to="/submit" className="text-muted-foreground hover:text-foreground">Submit a Prompt</Link>
            <Link to="/terms" className="text-muted-foreground hover:text-foreground">Terms & Conditions</Link>
            <Link to="/privacy" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link>
            <Link to="/refunds" className="text-muted-foreground hover:text-foreground">Refunds Policy</Link>
          </nav>
        </div>
        <div className="md:col-span-3 justify-self-end text-muted-foreground">© {new Date().getFullYear()} PromptAndGo.ai</div>
      </div>
    </footer>
  );
};

export default Footer;
