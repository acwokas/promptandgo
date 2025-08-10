import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t mt-16">
      <div className="container py-10 grid gap-6 md:grid-cols-3 text-sm">
        <div>
          <p className="font-semibold mb-2">PromptAndGo.ai</p>
          <p className="text-muted-foreground">Ready-to-use prompts for real-world work.</p>
        </div>
        <nav className="grid gap-2">
          <Link to="/terms" className="text-muted-foreground hover:text-foreground">Terms & Conditions</Link>
          <Link to="/privacy" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link>
          <Link to="/refunds" className="text-muted-foreground hover:text-foreground">Refunds Policy</Link>
        </nav>
        <div className="justify-self-end text-muted-foreground">© {new Date().getFullYear()} PromptAndGo.ai</div>
      </div>
    </footer>
  );
};

export default Footer;
