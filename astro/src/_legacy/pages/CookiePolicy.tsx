import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useState } from "react";

const SECTIONS = [
  { id: "what-are-cookies", title: "1. What Are Cookies" },
  { id: "how-we-use", title: "2. How We Use Cookies" },
  { id: "third-party", title: "3. Third-Party Cookies" },
  { id: "managing", title: "4. Managing Cookies" },
  { id: "cookie-table", title: "5. Cookie Duration Table" },
  { id: "asian-language", title: "6. Asian Language Data" },
  { id: "updates", title: "7. Updates to Policy" },
  { id: "contact", title: "8. Contact" },
];

const COOKIE_TABLE = [
  { name: "_pag_session", purpose: "Session management and authentication", duration: "Session", type: "Essential" },
  { name: "_pag_lang", purpose: "Stores preferred language setting (e.g., ja, ko, zh)", duration: "1 year", type: "Preference" },
  { name: "_pag_analytics", purpose: "Anonymous usage analytics and page views", duration: "90 days", type: "Analytics" },
  { name: "_pag_theme", purpose: "Stores dark/light theme preference", duration: "1 year", type: "Preference" },
  { name: "_pag_consent", purpose: "Records cookie consent decision", duration: "1 year", type: "Essential" },
];

const CookiePolicy = () => {
  const [activeSection, setActiveSection] = useState("");

  const scrollTo = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title="Cookie Policy | PromptAndGo" description="Learn how PromptAndGo uses cookies, including essential, analytics, and preference cookies for Asian language processing." canonical="/cookies" />

      <section className="py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Cookie Policy</h1>
        <p className="text-muted-foreground text-lg">クッキーポリシー | 쿠키 정책 | Cookie 政策 | นโยบายคุกกี้</p>
        <p className="text-sm text-muted-foreground mt-4">Last updated: April 1, 2026</p>
        <Button variant="outline" size="sm" className="mt-4 gap-2" onClick={() => window.print()}>
          <Printer className="h-4 w-4" /> Print
        </Button>
      </section>

      <div className="max-w-5xl mx-auto px-4 pb-16 flex gap-8">
        {/* TOC Sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <nav className="sticky top-24 space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Contents</p>
            {SECTIONS.map((s) => (
              <button key={s.id} onClick={() => scrollTo(s.id)} className={`block text-sm w-full text-left py-1.5 transition-colors ${activeSection === s.id ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}>{s.title}</button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 prose prose-invert max-w-none space-y-10">
          <section id="what-are-cookies">
            <h2 className="text-xl font-bold mb-4">1. What Are Cookies</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences, analyze usage patterns, and provide a better user experience. PromptAndGo uses cookies to ensure our Asian language prompt tools work correctly across all supported languages and scripts.</p>
          </section>

          <section id="how-we-use">
            <h2 className="text-xl font-bold mb-4">2. How We Use Cookies</h2>
            <div className="space-y-4">
              <div className="rounded-lg border border-border p-4">
                <h3 className="font-semibold text-sm mb-1">Essential Cookies</h3>
                <p className="text-sm text-muted-foreground">Required for authentication, session management, and core platform functionality. These cannot be disabled.</p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <h3 className="font-semibold text-sm mb-1">Analytics Cookies</h3>
                <p className="text-sm text-muted-foreground">Help us understand how users interact with our platform, which prompts are most popular, and which languages are most used. All data is anonymized.</p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <h3 className="font-semibold text-sm mb-1">Preference Cookies</h3>
                <p className="text-sm text-muted-foreground">Store your language selection, theme preference (dark/light), and display settings to provide a personalized experience.</p>
              </div>
            </div>
          </section>

          <section id="third-party">
            <h2 className="text-xl font-bold mb-4">3. Third-Party Cookies</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">We use limited third-party cookies from Google Analytics for anonymous usage statistics and Stripe for secure payment processing. These providers have their own privacy policies governing the use of cookies they set.</p>
          </section>

          <section id="managing">
            <h2 className="text-xl font-bold mb-4">4. Managing Cookies</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">You can control and delete cookies through your browser settings. Most browsers allow you to block or delete cookies from specific sites. Note that disabling essential cookies may prevent certain features from working properly, including language selection and prompt saving.</p>
          </section>

          <section id="cookie-table">
            <h2 className="text-xl font-bold mb-4">5. Cookie Duration Table</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
                <thead><tr className="bg-muted/50">
                  <th className="text-left p-3 font-semibold">Name</th>
                  <th className="text-left p-3 font-semibold">Purpose</th>
                  <th className="text-left p-3 font-semibold">Duration</th>
                  <th className="text-left p-3 font-semibold">Type</th>
                </tr></thead>
                <tbody>
                  {COOKIE_TABLE.map((c) => (
                    <tr key={c.name} className="border-t border-border">
                      <td className="p-3 font-mono text-xs">{c.name}</td>
                      <td className="p-3 text-muted-foreground">{c.purpose}</td>
                      <td className="p-3 text-muted-foreground">{c.duration}</td>
                      <td className="p-3"><span className={`text-xs px-2 py-0.5 rounded-full ${c.type === "Essential" ? "bg-green-500/10 text-green-500" : c.type === "Analytics" ? "bg-blue-500/10 text-blue-500" : "bg-yellow-500/10 text-yellow-500"}`}>{c.type}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="asian-language">
            <h2 className="text-xl font-bold mb-4">6. Asian Language Data</h2>
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-5">
              <p className="text-sm text-muted-foreground leading-relaxed">PromptAndGo processes CJK (Chinese, Japanese, Korean) characters and other Asian scripts during prompt optimization. Preference cookies store your selected language and script settings (e.g., Simplified vs Traditional Chinese, Japanese keigo level). These cookies contain only configuration identifiers, not the actual prompt content. Your prompt text is processed server-side and is never stored in cookies.</p>
            </div>
          </section>

          <section id="updates">
            <h2 className="text-xl font-bold mb-4">7. Updates to Policy</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">We may update this Cookie Policy to reflect changes in our practices or for regulatory compliance across Asian jurisdictions (PDPA Singapore, PDPA Thailand, APPI Japan, PIPA Korea). Changes will be posted on this page with an updated revision date.</p>
          </section>

          <section id="contact">
            <h2 className="text-xl font-bold mb-4">8. Contact</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">If you have questions about our use of cookies, please contact us at <a href="mailto:privacy@promptandgo.ai" className="text-primary hover:underline">privacy@promptandgo.ai</a> or visit our <a href="/contact" className="text-primary hover:underline">Contact page</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
