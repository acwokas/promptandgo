import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const SECTIONS = [
  { id: "acceptance", label: "Acceptance of Terms" },
  { id: "description", label: "Description of Service" },
  { id: "accounts", label: "User Accounts" },
  { id: "acceptable-use", label: "Acceptable Use" },
  { id: "ip", label: "Intellectual Property" },
  { id: "billing", label: "Subscription & Billing" },
  { id: "api-usage", label: "API Usage" },
  { id: "liability", label: "Limitation of Liability" },
  { id: "governing-law", label: "Governing Law" },
  { id: "contact", label: "Contact" },
];

const Terms = () => {
  const [activeSection, setActiveSection] = useState("acceptance");

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
      <SEO title="Terms of Service | PromptAndGo" description="Terms of Service for PromptAndGo — usage rules, intellectual property, billing, liability, and governing law under Singapore jurisdiction." />

      {/* Hero */}
      <section className="bg-hero text-white py-16 md:py-24">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-3">Terms of Service</h1>
          <p className="text-white/60 text-sm mb-1">Last updated: April 9, 2026</p>
          <p className="text-white/50 text-base">Please read these terms carefully before using PromptAndGo</p>
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
            </div>
          </nav>

          {/* Content */}
          <article className="flex-1 min-w-0 prose prose-neutral dark:prose-invert max-w-none">
            <section id="acceptance">
              <h2>1. Acceptance of Terms</h2>
              <p>By accessing or using PromptAndGo ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service. We may update these terms at any time, and continued use constitutes acceptance of changes.</p>
            </section>

            <section id="description">
              <h2>2. Description of Service</h2>
              <p>PromptAndGo is an AI prompt optimization platform purpose-built for Asian markets. Our services include:</p>
              <ul>
                <li>Prompt optimization for multiple AI platforms (ChatGPT, Claude, Gemini, Qwen, DeepSeek, etc.)</li>
                <li>Multilingual prompt support across 12+ Asian languages</li>
                <li>Curated prompt library and marketplace</li>
                <li>AI-powered prompt generation and analysis tools</li>
                <li>API access for enterprise integration</li>
              </ul>
            </section>

            <section id="accounts">
              <h2>3. User Accounts</h2>
              <p>You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate, current, and complete registration information. You are liable for all activity under your account. Notify us immediately of any unauthorized access.</p>
            </section>

            <section id="acceptable-use">
              <h2>4. Acceptable Use</h2>
              <p>You agree not to:</p>
              <ul>
                <li>Use prompts to generate harmful, illegal, or discriminatory content</li>
                <li>Violate the terms of service of any connected AI platform</li>
                <li>Attempt to reverse-engineer our optimization algorithms</li>
                <li>Share or resell premium prompts or pack content without authorization</li>
                <li>Use automated tools to scrape or bulk-download content</li>
                <li>Impersonate other users or misrepresent your identity</li>
              </ul>
            </section>

            <section id="ip">
              <h2>5. Intellectual Property</h2>
              <p><strong>Your Content:</strong> You retain full ownership of prompts you create, input, or optimize through our platform.</p>
              <p><strong>Our Platform:</strong> The PromptAndGo platform, including its design, algorithms, curated prompt libraries, and branding, is our intellectual property protected under Singapore and international copyright laws.</p>
              <p><strong>Community Submissions:</strong> Prompts submitted to our public library are licensed under a Creative Commons Attribution license.</p>
            </section>

            <section id="billing">
              <h2>6. Subscription & Billing</h2>
              <p>PromptAndGo offers three tiers:</p>
              <div className="not-prose overflow-x-auto my-6">
                <table className="w-full text-sm border border-border rounded-lg">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left p-3 font-semibold text-foreground">Feature</th>
                      <th className="text-center p-3 font-semibold text-foreground">Free</th>
                      <th className="text-center p-3 font-semibold text-foreground">Pro</th>
                      <th className="text-center p-3 font-semibold text-foreground">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-t border-border"><td className="p-3">Daily Optimizations</td><td className="p-3 text-center">5</td><td className="p-3 text-center">Unlimited</td><td className="p-3 text-center">Unlimited</td></tr>
                    <tr className="border-t border-border"><td className="p-3">Prompt Library Access</td><td className="p-3 text-center">Basic</td><td className="p-3 text-center">Full</td><td className="p-3 text-center">Full + Custom</td></tr>
                    <tr className="border-t border-border"><td className="p-3">API Access</td><td className="p-3 text-center">—</td><td className="p-3 text-center">5,000/day</td><td className="p-3 text-center">Unlimited</td></tr>
                  </tbody>
                </table>
              </div>
              <p>Subscriptions are billed monthly or annually. Refunds follow our 14-day money-back guarantee for annual plans. Cancellation takes effect at the end of the current billing period.</p>
            </section>

            <section id="api-usage">
              <h2>7. API Usage</h2>
              <p>API access is subject to rate limits based on your subscription tier. Excessive usage beyond stated limits may result in throttling or temporary suspension. You must not share API keys or use them in applications that violate these terms.</p>
            </section>

            <section id="liability">
              <h2>8. Limitation of Liability</h2>
              <p>PromptAndGo is provided "as is" without warranty of any kind. We are not liable for:</p>
              <ul>
                <li>Outputs generated by third-party AI platforms using optimized prompts</li>
                <li>Business decisions made based on AI-generated content</li>
                <li>Service interruptions or data loss beyond our reasonable control</li>
                <li>Indirect, consequential, or incidental damages</li>
              </ul>
              <p>Our maximum liability shall not exceed the amount paid by you in the 12 months preceding the claim.</p>
            </section>

            <section id="governing-law">
              <h2>9. Governing Law</h2>
              <p>These Terms are governed by the laws of the <strong>Republic of Singapore</strong>. Any disputes shall be resolved through arbitration administered by the Singapore International Arbitration Centre (SIAC) in accordance with its rules.</p>
            </section>

            <section id="contact">
              <h2>10. Contact</h2>
              <p>For questions about these Terms:</p>
              <ul>
                <li>Email: <strong>legal@promptandgo.ai</strong></li>
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

export default Terms;
