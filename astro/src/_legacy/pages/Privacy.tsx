import { useState } from "react";
import { Download, Globe, Printer, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface PolicySection {
  num: string;
  id: string;
  title: string;
  content: React.ReactNode;
}

const LANGS = ["English", "日本語", "한국어", "中文", "ไทย", "Tiếng Việt", "Bahasa"];

const Privacy = () => {
  const [activeSection, setActiveSection] = useState("intro");

  const scrollTo = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const SECTIONS: PolicySection[] = [
    { num: "1.0", id: "intro", title: "Introduction", content: (
      <p>Welcome to PromptAndGo ("we," "our," or "us"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform at promptandgo.ai and related services. We are committed to protecting the privacy of our users across Asia and worldwide, with particular attention to regional data protection requirements.</p>
    )},
    { num: "2.0", id: "collect", title: "Information We Collect", content: (
      <div className="space-y-3">
        <p><strong className="text-foreground">2.1 Personal Information:</strong> Name, email address, and account credentials when you register. Payment information processed securely via Stripe.</p>
        <p><strong className="text-foreground">2.2 Usage Data:</strong> Pages visited, prompts created, language preferences, session duration, and feature interactions.</p>
        <p><strong className="text-foreground">2.3 Device Information:</strong> Browser type, operating system, device type, IP address (hashed for anonymization), and screen resolution.</p>
        <p><strong className="text-foreground">2.4 Language Input Data:</strong> Text entered into prompt fields, including CJK characters, IME composition data, and language-specific formatting preferences.</p>
      </div>
    )},
    { num: "3.0", id: "use", title: "How We Use Your Information", content: (
      <div className="space-y-3">
        <p>We use collected information to: provide and maintain our service; personalize your prompt experience; improve Asian language processing accuracy; send transactional communications; analyze usage patterns; and ensure platform security.</p>
        <p>Your prompt content is used to improve our service quality but is never shared with third parties in identifiable form.</p>
      </div>
    )},
    { num: "4.0", id: "asian-data", title: "Asian Language Data Processing", content: (
      <div className="space-y-3">
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <p className="text-sm font-medium text-primary mb-2">Special Section: CJK & Asian Language Data</p>
          <p className="text-sm">This section addresses the unique data processing considerations for Asian language inputs.</p>
        </div>
        <p><strong className="text-foreground">4.1 CJK Text Input:</strong> Chinese, Japanese, and Korean character inputs are processed using specialized tokenization that respects character boundaries. We do not decompose CJK characters for analysis without user consent.</p>
        <p><strong className="text-foreground">4.2 IME Data:</strong> Input Method Editor composition data (e.g., Japanese romaji-to-kana conversion sequences) is processed locally and not stored on our servers. Only final submitted text is recorded.</p>
        <p><strong className="text-foreground">4.3 Language-Specific Prompts:</strong> Prompts containing honorific markers (Japanese keigo, Korean 존댓말), tonal notations (Thai, Vietnamese), and cultural context are processed with sensitivity to cultural norms.</p>
        <p><strong className="text-foreground">4.4 Script Detection:</strong> We automatically detect script types (kanji, hangul, Thai script, Devanagari, etc.) to optimize rendering and processing. This detection is performed client-side where possible.</p>
      </div>
    )},
    { num: "5.0", id: "storage", title: "Data Storage & Security", content: (
      <div className="space-y-3">
        <p>Your data is stored on secure servers managed by Supabase with encryption at rest (AES-256) and in transit (TLS 1.3). Personal identifiable information (PII) including emails is encrypted using application-level encryption before database storage.</p>
        <p>We implement rate limiting, input validation, and security monitoring to protect against unauthorized access.</p>
      </div>
    )},
    { num: "6.0", id: "cookies", title: "Cookies & Tracking", content: (
      <div className="space-y-3">
        <p><strong className="text-foreground">6.1 Essential Cookies:</strong> Required for authentication, session management, and security. These cannot be disabled.</p>
        <p><strong className="text-foreground">6.2 Analytics Cookies:</strong> Google Analytics and custom analytics to understand usage patterns. Can be opted out via our cookie consent banner.</p>
        <p><strong className="text-foreground">6.3 Preference Cookies:</strong> Store your language preferences, theme settings, and display options in localStorage.</p>
      </div>
    )},
    { num: "7.0", id: "third-party", title: "Third-Party Services", content: (
      <p>We use the following third-party services: Supabase (database & authentication), Stripe (payment processing), Google Analytics (usage analytics), and AI providers (prompt processing via API). Each service has its own privacy policy and data handling practices.</p>
    )},
    { num: "8.0", id: "transfers", title: "International Data Transfers", content: (
      <div className="space-y-3">
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
          <p className="text-sm font-medium text-amber-400 mb-2">Regional Compliance Notice</p>
          <p className="text-sm text-muted-foreground">We comply with the following Asian data protection regulations:</p>
        </div>
        <ul className="space-y-1.5 list-disc pl-5">
          <li><strong className="text-foreground">Singapore PDPA</strong> — Personal Data Protection Act 2012 (governing law)</li>
          <li><strong className="text-foreground">Japan APPI</strong> — Act on Protection of Personal Information</li>
          <li><strong className="text-foreground">Korea PIPA</strong> — Personal Information Protection Act</li>
          <li><strong className="text-foreground">China PIPL</strong> — Personal Information Protection Law</li>
          <li><strong className="text-foreground">Thailand PDPA</strong> — Personal Data Protection Act B.E. 2562</li>
          <li><strong className="text-foreground">India IT Act</strong> — Information Technology Act, 2000 & Digital Personal Data Protection Act</li>
        </ul>
      </div>
    )},
    { num: "9.0", id: "rights", title: "Your Rights", content: (
      <div className="space-y-3">
        <p>Depending on your jurisdiction, you may have the right to: access your personal data; request correction or deletion; withdraw consent; data portability; object to processing; and lodge a complaint with a supervisory authority.</p>
        <p>To exercise any of these rights, contact us at privacy@promptandgo.ai or through our <a href="/contact" className="text-primary hover:underline">Contact page</a>.</p>
      </div>
    )},
    { num: "10.0", id: "children", title: "Children's Privacy", content: (
      <p>PromptAndGo is not intended for children under the age of 13 (or the applicable age of consent in your jurisdiction). We do not knowingly collect personal information from children. If we become aware that we have collected data from a child, we will delete it promptly.</p>
    )},
    { num: "11.0", id: "changes", title: "Changes to This Policy", content: (
      <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Revised" date. Continued use of the platform after changes constitutes acceptance of the updated policy.</p>
    )},
    { num: "12.0", id: "contact", title: "Contact Us", content: (
      <div className="space-y-2">
        <p>If you have questions about this Privacy Policy, contact us at:</p>
        <p className="text-foreground">PromptAndGo Pte. Ltd.<br/>1 Raffles Place, #20-61 One Raffles Place<br/>Singapore 048616<br/>Email: privacy@promptandgo.ai</p>
      </div>
    )},
  ];

  return (
    <div className="min-h-screen bg-background">
      <style>{`@media print { header, footer, .no-print { display: none !important; } body { background: white !important; color: black !important; } .print-card { border: 1px solid #ddd !important; background: white !important; } }`}</style>

      {/* Hero */}
      <section className="py-16 md:py-20 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">Privacy Policy</h1>
        <p className="text-primary/80 font-medium mb-4">プライバシーポリシー | 개인정보 처리방침 | 隐私政策 | นโยบายความเป็นส่วนตัว</p>
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <span>Effective: January 1, 2025</span>
          <span>·</span>
          <span>Last Revised: April 1, 2026</span>
        </div>
        <div className="flex items-center justify-center gap-3 mt-4 no-print">
          <button onClick={() => toast.info("PDF download coming soon")} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Download className="h-3.5 w-3.5" /> Download PDF
          </button>
          <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Printer className="h-3.5 w-3.5" /> Print
          </button>
          <button onClick={() => toast.info("Translations coming soon — 翻訳は近日公開")} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Globe className="h-3.5 w-3.5" /> Language
          </button>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 pb-20 flex gap-8">
        {/* Sidebar TOC */}
        <nav className="hidden lg:block w-56 flex-shrink-0 no-print">
          <div className="sticky top-20 space-y-0.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-3">Table of Contents</h3>
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`w-full text-left text-xs px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                  activeSection === s.id ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="text-[10px] font-mono opacity-50 w-6">{s.num}</span>
                <span className="truncate">{s.title}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-6">
          {SECTIONS.map((section) => (
            <section key={section.id} id={section.id} className="print-card bg-card border border-border rounded-xl p-6 scroll-mt-20">
              <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="text-sm font-mono text-primary">{section.num}</span>
                {section.title}
              </h2>
              <div className="text-sm text-muted-foreground leading-relaxed">
                {section.content}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Privacy;
