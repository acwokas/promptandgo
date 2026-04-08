import { Link } from "react-router-dom";
import { Bot, MessageSquare, Sparkles } from "lucide-react";

const PLATFORMS = [
  { name: "ChatGPT", slug: "chatgpt" },
  { name: "Claude", slug: "claude" },
  { name: "Gemini", slug: "gemini" },
  { name: "DeepSeek", slug: "deepseek" },
  { name: "Qwen", slug: "qwen" },
  { name: "Ernie Bot", slug: "ernie" },
  { name: "Copilot", slug: "copilot" },
  { name: "Meta AI", slug: "meta" },
  { name: "Grok", slug: "grok" },
  { name: "MidJourney", slug: "midjourney" },
  { name: "Perplexity", slug: "perplexity" },
];

const FOOTER_LANGUAGES = [
  { code: "zh", flag: "🇨🇳", label: "中文" },
  { code: "ja", flag: "🇯🇵", label: "日本語" },
  { code: "ko", flag: "🇰🇷", label: "한국어" },
  { code: "id", flag: "🇮🇩", label: "Bahasa" },
  { code: "vi", flag: "🇻🇳", label: "Tiếng Việt" },
  { code: "th", flag: "🇹🇭", label: "ไทย" },
  { code: "hi", flag: "🇮🇳", label: "हिन्दी" },
  { code: "ta", flag: "🇱🇰", label: "தமிழ்" },
  { code: "tl", flag: "🇵🇭", label: "Tagalog" },
  { code: "bn", flag: "🇧🇩", label: "বাংলা" },
  { code: "km", flag: "🇰🇭", label: "ខ្មែរ" },
  { code: "ms", flag: "🇲🇾", label: "Melayu" },
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

            {/* Platform links — text labels */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {PLATFORMS.map((p) => (
                <Link
                  key={p.name}
                  to={`/optimize?platform=${p.slug}`}
                  title={`Optimize for ${p.name}`}
                  className="text-[10px] font-semibold text-white/50 bg-white/5 border border-white/10 rounded-full px-2.5 py-1 hover:text-white/90 hover:border-white/30 hover:bg-white/10 transition-all"
                >
                  {p.name}
                </Link>
              ))}
            </div>

            {/* Language badges - clickable */}
            <div className="flex flex-wrap gap-1.5">
              {FOOTER_LANGUAGES.map((lang) => (
                <Link
                  key={lang.code}
                  to={`/optimize?lang=${lang.code}`}
                  title={`Optimize prompts in ${lang.label}`}
                  className="inline-flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-2 py-1 text-[10px] text-white/50 hover:text-white/80 hover:border-white/30 hover:bg-white/10 transition-all"
                >
                  <span>{lang.flag}</span>
                  {lang.label}
                </Link>
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
