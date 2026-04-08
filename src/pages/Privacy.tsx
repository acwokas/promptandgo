import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";

const SECTIONS = [
  { id: "collect", label: "Information We Collect" },
  { id: "use", label: "How We Use Your Information" },
  { id: "storage", label: "Data Storage & Security" },
  { id: "asian-compliance", label: "Asian Data Protection Compliance" },
  { id: "third-party", label: "Third-Party Services" },
  { id: "cookies", label: "Cookies & Tracking" },
  { id: "rights", label: "Your Rights" },
  { id: "children", label: "Children's Privacy" },
  { id: "changes", label: "Changes to This Policy" },
  { id: "contact", label: "Contact Us" },
];

const Privacy = () => {
  const [activeSection, setActiveSection] = useState("collect");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <SEO title="Privacy Policy | PromptAndGo" description="Learn how PromptAndGo collects, uses, and protects your data. Compliant with PDPA, APPI, PIPA, and other Asian data protection laws." />

      {/* Hero */}
      <section className="bg-hero text-white py-16 md:py-24">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-3">Privacy Policy</h1>
          <p className="text-white/60 text-sm mb-1">Last updated: April 9, 2026</p>
          <p className="text-white/50 text-base">Your privacy matters to us</p>
        </div>
      </section>

      <main className="container max-w-6xl mx-auto px-4 py-12">
        <div className="flex gap-10">
          {/* TOC Sidebar */}
          <nav className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-24 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Contents</p>
              {SECTIONS.map((s, i) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className={`block text-sm py-1.5 pl-3 border-l-2 transition-colors ${
                    activeSection === s.id
                      ? "border-primary text-primary font-medium"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {i + 1}. {s.label}
                </a>
              ))}
              <button
                onClick={() => toast("PDF download coming soon!")}
                className="mt-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors pl-3"
              >
                <Download className="h-4 w-4" /> Download PDF
              </button>
            </div>
          </nav>

          {/* Content */}
          <article className="flex-1 min-w-0 prose prose-neutral dark:prose-invert max-w-none">
            <section id="collect">
              <h2>1. Information We Collect</h2>
              <p>We collect the following types of information to provide and improve our services:</p>
              <ul>
                <li><strong>Account Information:</strong> Email address, display name, and authentication credentials when you register.</li>
                <li><strong>Usage Data:</strong> Prompts you optimize, platforms selected, language preferences, and interaction patterns.</li>
                <li><strong>Device & Technical Data:</strong> Browser type, operating system, IP address (hashed), and session duration.</li>
                <li><strong>Payment Information:</strong> Processed securely through Stripe — we never store card details.</li>
              </ul>
            </section>

            <section id="use">
              <h2>2. How We Use Your Information</h2>
              <ul>
                <li>Optimizing prompts for your selected AI platforms and languages</li>
                <li>Providing personalized recommendations based on usage patterns</li>
                <li>Improving our algorithms and platform features through anonymized analytics</li>
                <li>Sending service updates, security notifications, and (with consent) marketing communications</li>
                <li>Preventing fraud, abuse, and enforcing our Terms of Service</li>
              </ul>
            </section>

            <section id="storage">
              <h2>3. Data Storage & Security</h2>
              <p>Your data is encrypted at rest and in transit using industry-standard AES-256 encryption. Our infrastructure is SOC 2 Type II compliant. Primary data residency is in <strong>Singapore</strong>, with edge caching in Tokyo and Mumbai for low-latency access across Asia.</p>
              <p>We conduct regular security audits, penetration testing, and maintain an incident response plan reviewed quarterly.</p>
            </section>

            <section id="asian-compliance">
              <h2>4. Asian Data Protection Compliance</h2>
              <p>We comply with data protection regulations across the markets we serve:</p>
              <div className="not-prose grid gap-4 my-6">
                {[
                  { flag: "🇸🇬", law: "PDPA (Singapore)", desc: "Personal Data Protection Act — governs collection, use, and disclosure of personal data. We appoint a Data Protection Officer and honor data access/correction requests within 30 days." },
                  { flag: "🇯🇵", law: "APPI (Japan)", desc: "Act on the Protection of Personal Information — requires explicit consent for personal data handling and cross-border data transfers." },
                  { flag: "🇰🇷", law: "PIPA (South Korea)", desc: "Personal Information Protection Act — one of the strictest in Asia. We implement data minimization and purpose limitation principles." },
                  { flag: "🇮🇳", law: "IT Act & DPDP (India)", desc: "Information Technology Act and Digital Personal Data Protection Act — we implement reasonable security practices and process data lawfully." },
                  { flag: "🇹🇭", law: "PDPA (Thailand)", desc: "Personal Data Protection Act — similar to GDPR. We obtain consent before processing and provide data subject rights." },
                ].map((item) => (
                  <div key={item.law} className="bg-card border border-border rounded-lg p-4">
                    <p className="font-semibold text-foreground">{item.flag} {item.law}</p>
                    <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="third-party">
              <h2>5. Third-Party Services</h2>
              <p>When you use our platform to optimize prompts, your prompt text may be processed by third-party AI platforms (OpenAI, Anthropic, Google, etc.). Each provider has its own data handling policies. We do not store AI-generated responses beyond your active session unless you explicitly save them.</p>
              <p>We use Stripe for payment processing and Supabase for authentication and database services.</p>
            </section>

            <section id="cookies">
              <h2>6. Cookies & Tracking</h2>
              <p>We use minimal cookies:</p>
              <ul>
                <li><strong>Essential Cookies:</strong> Authentication session, preferences (theme, language)</li>
                <li><strong>Analytics:</strong> Anonymous usage metrics to improve the platform (no cross-site tracking)</li>
              </ul>
              <p>We do not use advertising cookies or sell your data to third parties.</p>
            </section>

            <section id="rights">
              <h2>7. Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li><strong>Access</strong> your personal data held by us</li>
                <li><strong>Correct</strong> inaccurate personal data</li>
                <li><strong>Delete</strong> your account and associated data</li>
                <li><strong>Export</strong> your data in a machine-readable format</li>
                <li><strong>Opt-out</strong> of marketing communications at any time</li>
                <li><strong>Withdraw consent</strong> for data processing</li>
              </ul>
              <p>To exercise these rights, contact us at <strong>privacy@promptandgo.ai</strong>.</p>
            </section>

            <section id="children">
              <h2>8. Children's Privacy</h2>
              <p>PromptAndGo is not directed at children under 13 years of age. We do not knowingly collect personal data from children. If you believe a child has provided us with personal information, please contact us immediately.</p>
            </section>

            <section id="changes">
              <h2>9. Changes to This Policy</h2>
              <p>We may update this Privacy Policy periodically. We will notify you of material changes via email or a prominent notice on our platform at least 14 days before the changes take effect.</p>
            </section>

            <section id="contact">
              <h2>10. Contact Us</h2>
              <p>For privacy-related inquiries:</p>
              <ul>
                <li>Email: <strong>privacy@promptandgo.ai</strong></li>
                <li>Data Protection Officer: Available upon request</li>
                <li>Address: Singapore</li>
              </ul>
              <p className="mt-4">
                <Link to="/contact" className="text-primary underline underline-offset-2">Contact form →</Link>
              </p>
            </section>
          </article>
        </div>
      </main>
    </>
  );
};

export default Privacy;
