import { Link } from "react-router-dom";
import { Bot, MessageSquare, Sparkles } from "lucide-react";

const PLATFORMS = [
  { name: "ChatGPT", letter: "G", bg: "bg-[hsl(160,82%,35%)]" },
  { name: "Claude", letter: "C", bg: "bg-[hsl(348,76%,59%)]" },
  { name: "Gemini", letter: "G", bg: "bg-[hsl(174,82%,33%)]" },
  { name: "DeepSeek", letter: "D", bg: "bg-[hsl(220,60%,50%)]" },
  { name: "Qwen", letter: "Q", bg: "bg-[hsl(260,50%,55%)]" },
  { name: "Ernie", letter: "E", bg: "bg-[hsl(210,80%,45%)]" },
];

const Footer = () => {
  return (
    <footer className="bg-hero text-white mt-16">
      {/* Main footer */}
      <div className="container max-w-6xl mx-auto px-4 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-4" aria-label="PromptandGo home">
              <img
                src="/lovable-uploads/9e8de25b-d91c-445a-b211-d156a28e4b33.png"
                alt="PromptandGo logo"
                className="h-7 w-auto object-contain max-w-[180px] brightness-0 invert"
                loading="lazy"
                decoding="async"
              />
            </Link>
            <p className="text-sm text-white/60 leading-relaxed mb-6">
              The only prompt optimization tool built for Asia.
            </p>

            {/* Platform logos */}
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => (
                <div
                  key={p.name}
                  title={p.name}
                  className={`w-7 h-7 rounded-md ${p.bg} flex items-center justify-center text-white text-xs font-bold opacity-80 hover:opacity-100 transition-opacity`}
                >
                  {p.letter}
                </div>
              ))}
            </div>
          </div>

          {/* Product */}
          <nav className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1">Product</span>
            <Link to="/optimize" className="text-sm text-white/70 hover:text-white transition-colors">Optimize</Link>
            <Link to="/library" className="text-sm text-white/70 hover:text-white transition-colors">Browse Prompts</Link>
            <Link to="/packs" className="text-sm text-white/70 hover:text-white transition-colors">Power Packs</Link>
            <Link to="/scout" className="text-sm text-white/70 hover:text-white transition-colors inline-flex items-center gap-1.5">
              <Bot className="h-3.5 w-3.5 text-accent" />
              Ask Scout
            </Link>
            <Link to="/market-insights" className="text-sm text-white/70 hover:text-white transition-colors">Market Intelligence</Link>
          </nav>

          {/* Company */}
          <nav className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1">Company</span>
            <Link to="/about" className="text-sm text-white/70 hover:text-white transition-colors">About</Link>
            <Link to="/tips" className="text-sm text-white/70 hover:text-white transition-colors">Blog</Link>
            <Link to="/contact" className="text-sm text-white/70 hover:text-white transition-colors">Contact</Link>
          </nav>

          {/* Resources */}
          <nav className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1">Resources</span>
            <Link to="/how-it-works" className="text-sm text-white/70 hover:text-white transition-colors">Help Center</Link>
            <Link to="/faqs" className="text-sm text-white/70 hover:text-white transition-colors">FAQs</Link>
            <Link to="/certification" className="text-sm text-white/70 hover:text-white transition-colors">Certification</Link>
          </nav>
        </div>
      </div>

      {/* Ecosystem postscript */}
      <div className="border-t border-white/10">
        <div className="container max-w-6xl mx-auto px-4 py-6 text-center">
          <p className="text-[11px] text-white/30 mb-1">
            Part of the You.WithThePowerOf.AI ecosystem
          </p>
          <p className="text-[11px] text-white/40">
            Shaping an idea?{" "}
            <a
              href="https://businessinabyte.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-white/70 underline underline-offset-2"
            >
              BusinessInAByte
            </a>
            {" "}helps structure it.{" "}
            <a
              href="https://you.withthepowerof.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-white/70 underline underline-offset-2"
            >
              Learn more →
            </a>
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container max-w-6xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <span>© 2026 PromptandGo. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-white/70 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white/70 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
