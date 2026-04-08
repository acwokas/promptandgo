import { Link } from "react-router-dom";
import { useState } from "react";

const COLUMNS = [
  {
    title: "Product",
    subtitle: "製品",
    links: [
      { label: "Home", to: "/" },
      { label: "Pricing", to: "/pricing" },
      { label: "Integrations", to: "/integrations" },
      { label: "API Docs", to: "/api-docs" },
      { label: "Templates", to: "/templates" },
    ],
  },
  {
    title: "Learn",
    subtitle: "学ぶ",
    links: [
      { label: "Tutorial", to: "/tutorial" },
      { label: "Glossary", to: "/glossary" },
      { label: "Blog", to: "/blog" },
      { label: "Use Cases", to: "/use-cases" },
      { label: "Help Center", to: "/help" },
    ],
  },
  {
    title: "Community",
    subtitle: "コミュニティ",
    links: [
      { label: "Forum", to: "/community" },
      { label: "Testimonials", to: "/testimonials" },
      { label: "Partners", to: "/partners" },
      { label: "Referral Program", to: "/referral" },
      { label: "Changelog", to: "/changelog" },
    ],
  },
  {
    title: "Company",
    subtitle: "会社",
    links: [
      { label: "About", to: "/about" },
      { label: "Contact", to: "/contact" },
      { label: "Status", to: "/status" },
      { label: "Careers", to: "/careers" },
    ],
  },
  {
    title: "Legal",
    subtitle: "法的",
    links: [
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Service", to: "/terms" },
      { label: "Accessibility", to: "/accessibility" },
      { label: "Cookie Policy", to: "/cookies" },
    ],
  },
];

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
  { code: "zh", label: "中文" },
  { code: "th", label: "ไทย" },
  { code: "vi", label: "Tiếng Việt" },
  { code: "id", label: "Bahasa" },
];

const SocialIcon = ({ label, children, href }: { label: string; children: React.ReactNode; href: string }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-all" aria-label={label}>
    {children}
  </a>
);

const Footer = () => {
  const [selectedLang, setSelectedLang] = useState("en");
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const handleLangChange = (code: string) => {
    setSelectedLang(code);
    const langRoutes: Record<string, string> = { ja: "/ja", ko: "/ko", zh: "/zh" };
    if (langRoutes[code]) {
      window.location.href = langRoutes[code];
    }
  };

  return (
    <footer className="bg-hero text-white mt-16">
      {/* Newsletter strip */}
      <div className="border-b border-white/10">
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white/80 text-center md:text-left">Stay Updated</p>
              <p className="text-xs text-white/40 text-center md:text-left">最新情報を受け取る · 최신 소식 받기</p>
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 w-full md:w-auto">
              <input type="email" placeholder="Your email" className="h-10 px-4 rounded-lg bg-white/5 border border-white/15 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 transition-colors flex-1 md:w-64" />
              <button type="submit" className="h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/85 transition-colors shrink-0">Subscribe</button>
            </form>
          </div>
        </div>
      </div>

      {/* Main columns */}
      <div className="container max-w-6xl mx-auto px-4 pt-12 pb-10">
        {/* Desktop: 5 columns */}
        <div className="hidden md:grid md:grid-cols-5 gap-8">
          {COLUMNS.map((col) => (
            <nav key={col.title} className="flex flex-col gap-2.5">
              <div className="mb-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-white/60">{col.title}</span>
                <span className="block text-[10px] text-white/30">{col.subtitle}</span>
              </div>
              {col.links.map((link) => (
                <Link key={link.label} to={link.to} className="text-sm text-white/60 hover:text-white transition-colors">{link.label}</Link>
              ))}
            </nav>
          ))}
        </div>

        {/* Mobile: accordion */}
        <div className="md:hidden space-y-0">
          {COLUMNS.map((col) => {
            const isOpen = openAccordion === col.title;
            return (
              <div key={col.title} className="border-b border-white/10">
                <button onClick={() => setOpenAccordion(isOpen ? null : col.title)} className="w-full flex items-center justify-between py-4">
                  <div>
                    <span className="text-sm font-semibold text-white/80">{col.title}</span>
                    <span className="ml-2 text-[10px] text-white/30">{col.subtitle}</span>
                  </div>
                  <svg className={`w-4 h-4 text-white/40 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {isOpen && (
                  <div className="pb-4 flex flex-col gap-2.5 pl-2">
                    {col.links.map((link) => (
                      <Link key={link.label} to={link.to} className="text-sm text-white/60 hover:text-white transition-colors">{link.label}</Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Ecosystem postscript */}
      <div className="border-t border-white/10">
        <div className="container max-w-6xl mx-auto px-4 py-4 text-center">
          <p className="text-[11px] text-white/30">
            Part of the You.WithThePowerOf.AI ecosystem ·{" "}
            <a href="https://businessinabyte.com/" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white/60 underline underline-offset-2">BusinessInAByte</a>
            {" · "}
            <a href="https://you.withthepowerof.ai" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white/60 underline underline-offset-2">Learn more →</a>
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container max-w-6xl mx-auto px-4 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Left: copyright + tagline */}
            <div className="flex flex-col sm:flex-row items-center gap-2 text-xs text-white/40">
              <span>© 2026 PromptAndGo. All rights reserved.</span>
              <span className="hidden sm:inline">·</span>
              <span>Made with ❤️ in Asia</span>
            </div>

            {/* Right: lang + social */}
            <div className="flex items-center gap-3">
              <select value={selectedLang} onChange={(e) => handleLangChange(e.target.value)} className="bg-transparent border border-white/10 rounded px-2 py-1 text-xs text-white/50 focus:outline-none cursor-pointer">
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="bg-[hsl(240,28%,7%)] text-white">{l.label}</option>
                ))}
              </select>
              <div className="flex items-center gap-2">
                <SocialIcon label="X / Twitter" href="https://twitter.com">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </SocialIcon>
                <SocialIcon label="GitHub" href="https://github.com">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                </SocialIcon>
                <SocialIcon label="Discord" href="https://discord.com">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/></svg>
                </SocialIcon>
                <SocialIcon label="LINE" href="https://line.me">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>
                </SocialIcon>
                <SocialIcon label="LinkedIn" href="https://linkedin.com">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </SocialIcon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
