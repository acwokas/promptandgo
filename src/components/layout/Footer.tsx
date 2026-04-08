import { Link } from "react-router-dom";
import { Bot } from "lucide-react";
import { useState } from "react";

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

const DISPLAY_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ja", label: "日本語" },
  { code: "zh", label: "中文" },
  { code: "ko", label: "한국어" },
  { code: "hi", label: "हिन्दी" },
  { code: "id", label: "Bahasa" },
];

const Footer = () => {
  const [selectedLang, setSelectedLang] = useState("en");

  return (
    <footer className="bg-hero text-white mt-16">
      {/* Main footer */}
      <div className="container max-w-6xl mx-auto px-4 pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 text-center sm:text-left">
          {/* Brand column */}
          <div className="sm:col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-3" aria-label="PromptandGo home">
              <img
                src="/lovable-uploads/9e8de25b-d91c-445a-b211-d156a28e4b33.png"
                alt="PromptandGo logo"
                className="h-7 w-auto object-contain max-w-[180px] brightness-0 invert"
                loading="lazy"
                decoding="async"
              />
            </Link>
            <p className="text-xs font-semibold text-white/70 mb-1">AI Prompts Built for Asia</p>
            <p className="text-sm text-white/50 leading-relaxed mb-5">
              The only prompt optimization tool built for Asia's languages, cultures, and platforms.
            </p>

            {/* Social icons */}
            <div className="flex items-center justify-center sm:justify-start gap-3 mb-6">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-11 h-11 md:w-8 md:h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white/90 hover:border-white/30 transition-all" aria-label="LinkedIn">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-11 h-11 md:w-8 md:h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white/90 hover:border-white/30 transition-all" aria-label="X / Twitter">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-11 h-11 md:w-8 md:h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white/90 hover:border-white/30 transition-all" aria-label="GitHub">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="w-11 h-11 md:w-8 md:h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white/90 hover:border-white/30 transition-all" aria-label="Discord">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/></svg>
              </a>
            </div>

            {/* Platform links */}
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

            {/* Language badges */}
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
            <Link to="/ask-scout" className="text-sm text-white/70 hover:text-white transition-colors inline-flex items-center gap-1.5">
              <Bot className="h-3.5 w-3.5 text-accent" />
              Ask Scout
            </Link>
            <Link to="/pricing" className="text-sm text-white/70 hover:text-white transition-colors">Pricing</Link>
            <Link to="/enterprise" className="text-sm text-white/70 hover:text-white transition-colors">Enterprise</Link>
            <Link to="/templates" className="text-sm text-white/70 hover:text-white transition-colors">Templates</Link>
            <Link to="/integrations" className="text-sm text-white/70 hover:text-white transition-colors">Integrations</Link>
            <Link to="/saved" className="text-sm text-white/70 hover:text-white transition-colors">Saved Prompts</Link>
          </nav>

          {/* Company */}
          <nav className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1">Company</span>
            <Link to="/about" className="text-sm text-white/70 hover:text-white transition-colors">About Us</Link>
            <Link to="/partners" className="text-sm text-white/70 hover:text-white transition-colors">Partners</Link>
            <Link to="/use-cases" className="text-sm text-white/70 hover:text-white transition-colors">Use Cases</Link>
            <Link to="/contact" className="text-sm text-white/70 hover:text-white transition-colors">Contact</Link>
            <Link to="/tips" className="text-sm text-white/70 hover:text-white transition-colors">Blog</Link>
            <Link to="/market-insights" className="text-sm text-white/70 hover:text-white transition-colors">Market Intelligence</Link>
          </nav>

          {/* Resources */}
          <nav className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1">Resources</span>
            <Link to="/help" className="text-sm text-white/70 hover:text-white transition-colors">Help Center</Link>
            <Link to="/faqs" className="text-sm text-white/70 hover:text-white transition-colors">FAQs</Link>
            <Link to="/certification" className="text-sm text-white/70 hover:text-white transition-colors">Certification</Link>
            <Link to="/how-it-works" className="text-sm text-white/70 hover:text-white transition-colors">How It Works</Link>
            <Link to="/language-learning" className="text-sm text-white/70 hover:text-white transition-colors">Language Learning</Link>
            <Link to="/api-docs" className="text-sm text-white/70 hover:text-white transition-colors">API</Link>
            <Link to="/changelog" className="text-sm text-white/70 hover:text-white transition-colors">Changelog</Link>
            <Link to="/community" className="text-sm text-white/70 hover:text-white transition-colors">Community</Link>
            <Link to="/referral" className="text-sm text-white/70 hover:text-white transition-colors">Refer &amp; Earn</Link>
            <Link to="/shortcuts" className="text-sm text-white/70 hover:text-white transition-colors">Shortcuts</Link>
          </nav>
        </div>
      </div>

      {/* Newsletter signup row */}
      <div className="border-t border-white/10">
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/60 text-center md:text-left">
              Stay updated with the latest AI prompt techniques for Asian markets
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Your email"
                className="h-10 px-4 rounded-lg bg-white/5 border border-white/15 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 transition-colors flex-1 md:w-64"
              />
              <button
                type="submit"
                className="h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/85 transition-colors shrink-0"
              >
                Subscribe
              </button>
            </form>
          </div>
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
          <span>© 2024-2026 PromptandGo. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="bg-transparent border border-white/10 rounded px-2 py-1 text-xs text-white/50 focus:outline-none cursor-pointer"
            >
              {DISPLAY_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="bg-[hsl(240,28%,7%)] text-white">{l.label}</option>
              ))}
            </select>
            <Link to="/privacy" className="hover:text-white/70 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white/70 transition-colors">Terms</Link>
            <Link to="/accessibility" className="hover:text-white/70 transition-colors">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
