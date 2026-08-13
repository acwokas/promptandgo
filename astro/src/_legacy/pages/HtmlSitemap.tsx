import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

interface SitemapSection {
  id: string;
  title: string;
  links: { label: string; to: string }[];
}

const SECTIONS: SitemapSection[] = [
  {
    id: "main",
    title: "Main Pages",
    links: [
      { label: "Home", to: "/" },
      { label: "About", to: "/about" },
      { label: "Pricing", to: "/pricing" },
      { label: "Contact", to: "/contact" },
      { label: "Testimonials", to: "/testimonials" },
    ],
  },
  {
    id: "tools",
    title: "Tools & Features",
    links: [
      { label: "Browse Prompts", to: "/library" },
      { label: "Prompt Optimizer", to: "/optimize" },
      { label: "Power Packs", to: "/packs" },
      { label: "Prompt Studio", to: "/ai/studio" },
      { label: "AI Assistant", to: "/ai/assistant" },
      { label: "Ask Scout", to: "/ask-scout" },
      { label: "Platform Comparison", to: "/compare" },
      { label: "Advanced Search", to: "/search" },
      { label: "Interactive Tutorial", to: "/tutorial" },
      { label: "Prompt Templates", to: "/templates" },
    ],
  },
  {
    id: "resources",
    title: "Resources",
    links: [
      { label: "Blog", to: "/blog" },
      { label: "AI Glossary", to: "/glossary" },
      { label: "Newsletter Archive", to: "/newsletter" },
      { label: "FAQ", to: "/faqs" },
      { label: "How It Works", to: "/how-it-works" },
      { label: "Tips & Articles", to: "/tips" },
      { label: "Changelog", to: "/changelog" },
      { label: "API Documentation", to: "/api-docs" },
      { label: "Help Center", to: "/help" },
    ],
  },
  {
    id: "community",
    title: "Community & Growth",
    links: [
      { label: "Community Hub", to: "/community" },
      { label: "Certification", to: "/certification" },
      { label: "Referral Program", to: "/referral" },
      { label: "Submit a Prompt", to: "/submit" },
      { label: "Language Learning", to: "/language-learning" },
      { label: "Integrations", to: "/integrations" },
    ],
  },
  {
    id: "user",
    title: "User Account",
    links: [
      { label: "Dashboard", to: "/dashboard" },
      { label: "Settings", to: "/settings" },
      { label: "Saved Prompts", to: "/saved" },
      { label: "Profile", to: "/account/profile" },
      { label: "Notifications", to: "/account/notifications" },
      { label: "Purchases", to: "/account/purchases" },
      { label: "XP Dashboard", to: "/account/xp" },
    ],
  },
  {
    id: "markets",
    title: "Market Insights",
    links: [
      { label: "Market Insights Hub", to: "/market-insights" },
      { label: "Malaysia", to: "/market-insights/malaysia" },
      { label: "Indonesia", to: "/market-insights/indonesia" },
      { label: "Vietnam", to: "/market-insights/vietnam" },
      { label: "Australia", to: "/market-insights/australia" },
      { label: "Singapore Startups", to: "/singapore-startups" },
      { label: "Small Business", to: "/small-business" },
    ],
  },
  {
    id: "enterprise",
    title: "Enterprise",
    links: [
      { label: "Enterprise Plans", to: "/enterprise" },
      { label: "Contact Sales", to: "/contact" },
    ],
  },
  {
    id: "legal",
    title: "Legal",
    links: [
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Service", to: "/terms" },
    ],
  },
];

const HtmlSitemap = () => {
  return (
    <>
      <SEO
        title="Sitemap — PromptAndGo"
        description="Find every page on PromptAndGo. Complete sitemap covering tools, resources, blog, community, and more."
        canonical="https://promptandgo.ai/sitemap"
      />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-hero">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-primary/15 blur-[100px]" />
          </div>
          <div className="relative z-10 container max-w-4xl mx-auto px-4 pt-16 pb-8 md:pt-24 md:pb-10">
            <Breadcrumb className="mb-4">
              <BreadcrumbList>
                <BreadcrumbItem><BreadcrumbLink asChild><Link to="/" className="text-white/60 hover:text-white">Home</Link></BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator className="text-white/30" />
                <BreadcrumbItem><BreadcrumbPage className="text-white">Sitemap</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-2">
              Sitemap
            </h1>
            <p className="text-white/60">Find everything on PromptAndGo</p>
          </div>
        </section>

        {/* Jump nav */}
        <section className="bg-background border-b border-border py-3">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="flex gap-2 flex-wrap">
              {SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#section-${s.id}`}
                  className="text-xs px-3 py-1 rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
                >
                  {s.title} ({s.links.length})
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Sections */}
        <section className="py-10 md:py-16 bg-background">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-10">
              {SECTIONS.map((s) => (
                <div key={s.id} id={`section-${s.id}`} className="scroll-mt-20">
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-lg font-bold text-foreground">{s.title}</h2>
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{s.links.length}</span>
                  </div>
                  <ul className="space-y-1.5">
                    {s.links.map((link) => (
                      <li key={link.to}>
                        <Link
                          to={link.to}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                        >
                          <span className="text-primary/40">→</span> {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-16 pt-8 border-t border-border text-center">
              <p className="text-xs text-muted-foreground">Last updated: April 8, 2026</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default HtmlSitemap;
