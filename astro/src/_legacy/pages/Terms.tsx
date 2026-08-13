import { useState } from "react";
import { Printer, ChevronUp } from "lucide-react";
import { toast } from "sonner";

interface TermsSection {
  num: string;
  id: string;
  title: string;
  content: React.ReactNode;
  highlight?: boolean;
}

const Terms = () => {
  const [activeSection, setActiveSection] = useState("acceptance");
  const [showBackToTop, setShowBackToTop] = useState(false);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => setShowBackToTop(window.scrollY > 600), { passive: true });
  }

  const SECTIONS: TermsSection[] = [
    { num: "1.0", id: "acceptance", title: "Acceptance of Terms", content: (
      <p>By accessing or using PromptAndGo ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service. These terms apply to all users, including visitors, registered users, and API consumers.</p>
    )},
    { num: "2.0", id: "description", title: "Description of Service", content: (
      <p>PromptAndGo provides an AI prompt optimization and library platform specializing in Asian languages including Japanese, Korean, Mandarin Chinese, Thai, Vietnamese, Indonesian, Hindi, Tamil, Tagalog, Bahasa Malay, Khmer, and Burmese. The Service includes prompt browsing, creation, optimization, and sharing features.</p>
    )},
    { num: "3.0", id: "registration", title: "Account Registration", content: (
      <div className="space-y-3">
        <p>To access certain features, you must create an account. You agree to provide accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>
        <p>You must be at least 13 years old (or the age of digital consent in your jurisdiction) to create an account.</p>
      </div>
    )},
    { num: "4.0", id: "acceptable-use", title: "Acceptable Use Policy", content: (
      <div className="space-y-3">
        <p>You agree not to: use the Service for unlawful purposes; generate harmful, discriminatory, or misleading content; attempt to circumvent rate limits or security measures; scrape, crawl, or reverse-engineer the platform; impersonate others; or distribute malware.</p>
        <p>Violation of this policy may result in immediate account termination without notice.</p>
      </div>
    ), highlight: true },
    { num: "5.0", id: "asian-content", title: "Asian Language Content Guidelines", content: (
      <div className="space-y-3">
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <p className="text-sm font-medium text-primary mb-2">Cultural Sensitivity Notice</p>
          <p className="text-sm">This section addresses responsible use of language-specific AI prompts.</p>
        </div>
        <p><strong className="text-foreground">5.1 Honorific Systems:</strong> When using prompts that generate content with Japanese keigo (敬語), Korean 존댓말/반말, or other honorific systems, users are responsible for verifying the appropriate formality level for their context.</p>
        <p><strong className="text-foreground">5.2 Cultural Context:</strong> AI-generated content in Asian languages may not always reflect cultural nuances accurately. Users should review generated content for cultural appropriateness before use in professional or public-facing communications.</p>
        <p><strong className="text-foreground">5.3 Script Accuracy:</strong> While we strive for accuracy in CJK character generation, Thai tonal markers, Vietnamese diacriticals, and other script-specific features, users should verify critical text outputs.</p>
        <p><strong className="text-foreground">5.4 Prohibited Use:</strong> You may not use the Service to generate content that disparages, stereotypes, or misrepresents any Asian culture, language, or community.</p>
      </div>
    )},
    { num: "6.0", id: "ip", title: "Intellectual Property", content: (
      <p>The Service, including its design, features, content, and underlying technology, is owned by PromptAndGo Pte. Ltd. and protected by intellectual property laws. The PromptAndGo name, logo, and branding are registered trademarks. You may not use our trademarks without prior written consent.</p>
    )},
    { num: "7.0", id: "ugc", title: "User-Generated Content", content: (
      <p>You retain ownership of prompts and content you create using the Service. By submitting content to public areas (community forums, shared prompts), you grant PromptAndGo a non-exclusive, worldwide, royalty-free license to display and distribute that content within the platform.</p>
    )},
    { num: "8.0", id: "prompt-ownership", title: "Prompt Ownership", content: (
      <div className="space-y-3">
        <p>Prompts you create and save to your account are your intellectual property. We do not claim ownership of your custom prompts. However, anonymized and aggregated prompt patterns may be used to improve our service quality.</p>
        <p>Pre-built prompt templates provided by PromptAndGo are licensed for personal and commercial use within the platform but may not be redistributed as a standalone product.</p>
      </div>
    )},
    { num: "9.0", id: "api-terms", title: "API Usage Terms", content: (
      <div className="space-y-3">
        <p>API access is subject to rate limits based on your subscription tier. You agree not to exceed your allocated request limits, share API keys, or use the API to build a competing service.</p>
        <p>We reserve the right to throttle or suspend API access for accounts that consistently exceed usage limits or violate these terms.</p>
      </div>
    )},
    { num: "10.0", id: "payment", title: "Payment Terms", content: (
      <div className="space-y-3">
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
          <p className="text-sm font-medium text-amber-400 mb-2">Pricing Information</p>
          <p className="text-sm text-muted-foreground">All prices are shown in USD with JPY equivalents. Current tiers: Free ($0), Pro ($9.99/mo · ¥1,500/月), Enterprise (custom pricing).</p>
        </div>
        <p>Payments are processed securely via Stripe. Subscriptions renew automatically unless cancelled before the renewal date. Refunds are handled on a case-by-case basis within 14 days of purchase.</p>
      </div>
    ), highlight: true },
    { num: "11.0", id: "liability", title: "Limitation of Liability", content: (
      <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, PROMPTANDGO SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE OF THE SERVICE. Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.</p>
    ), highlight: true },
    { num: "12.0", id: "disclaimers", title: "Disclaimers", content: (
      <p>The Service is provided "AS IS" without warranties of any kind. We do not guarantee the accuracy, completeness, or reliability of AI-generated content, particularly in the context of Asian language translations, honorific usage, or cultural adaptations. Users should independently verify critical outputs.</p>
    )},
    { num: "13.0", id: "governing-law", title: "Governing Law", content: (
      <div className="space-y-3">
        <p>These Terms shall be governed by and construed in accordance with the laws of the Republic of Singapore. Any disputes shall be subject to the exclusive jurisdiction of the courts of Singapore.</p>
        <p>For users in Japan, disputes may alternatively be resolved through arbitration administered by the Japan Commercial Arbitration Association (JCAA) in Tokyo, conducted in English or Japanese at the parties' election.</p>
      </div>
    )},
    { num: "14.0", id: "termination", title: "Termination", content: (
      <p>We may terminate or suspend your account at any time for violation of these Terms, with or without notice. Upon termination, your right to use the Service ceases immediately. You may export your data within 30 days of account termination by contacting support.</p>
    )},
    { num: "15.0", id: "contact-info", title: "Contact Information", content: (
      <div className="space-y-2">
        <p>For questions about these Terms, contact us at:</p>
        <p className="text-foreground">PromptAndGo Pte. Ltd.<br/>1 Raffles Place, #20-61 One Raffles Place<br/>Singapore 048616<br/>Email: legal@promptandgo.ai</p>
      </div>
    )},
  ];

  return (
    <div className="min-h-screen bg-background">
      <style>{`@media print { header, footer, .no-print { display: none !important; } body { background: white !important; color: black !important; } .print-card { border: 1px solid #ddd !important; background: white !important; } }`}</style>

      {/* Hero */}
      <section className="py-16 md:py-20 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">Terms of Service</h1>
        <p className="text-primary/80 font-medium mb-4">利用規約 | 이용약관 | 服务条款 | ข้อกำหนดการใช้งาน</p>
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <span>Effective: January 1, 2025</span>
          <span>·</span>
          <span>Last Revised: April 1, 2026</span>
        </div>
        <div className="flex items-center justify-center gap-3 mt-4 no-print">
          <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Printer className="h-3.5 w-3.5" /> Print
          </button>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 pb-20 flex gap-8">
        {/* Sidebar TOC */}
        <nav className="hidden lg:block w-56 flex-shrink-0 no-print">
          <div className="sticky top-20 space-y-0.5 max-h-[calc(100vh-6rem)] overflow-y-auto">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-3">Table of Contents</h3>
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`w-full text-left text-xs px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                  activeSection === s.id ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="text-[10px] font-mono opacity-50 w-7">{s.num}</span>
                <span className="truncate">{s.title}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-6">
          {SECTIONS.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className={`print-card rounded-xl p-6 scroll-mt-20 ${
                section.highlight
                  ? "bg-card border-2 border-amber-500/30"
                  : "bg-card border border-border"
              }`}
            >
              <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="text-sm font-mono text-primary">{section.num}</span>
                {section.title}
              </h2>
              <div className="text-sm text-muted-foreground leading-relaxed">
                {section.content}
              </div>
            </section>
          ))}

          {/* Accept Button */}
          <div className="text-center pt-4 no-print">
            <button
              onClick={() => toast.success("Terms accepted — ご利用規約に同意しました")}
              className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              I Accept These Terms
            </button>
          </div>
        </div>
      </div>

      {/* Back to top */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="no-print fixed bottom-6 right-6 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors z-50"
          aria-label="Back to top"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default Terms;
