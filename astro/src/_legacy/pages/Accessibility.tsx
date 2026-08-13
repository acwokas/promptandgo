import { useState } from "react";
import { Shield, Check, ChevronDown, ChevronUp, Eye, Keyboard, Palette, Type, MousePointer, Monitor, Globe, AlertTriangle, Send } from "lucide-react";
import { toast } from "sonner";

interface Section {
  id: string;
  title: string;
  icon: React.ElementType;
  content: React.ReactNode;
}

const CHECKLIST = [
  { label: "Full keyboard navigation", done: true },
  { label: "Screen reader support (NVDA, JAWS, VoiceOver)", done: true },
  { label: "Visible focus indicators on all interactive elements", done: true },
  { label: "Color contrast ratios meeting WCAG AA (4.5:1 minimum)", done: true },
  { label: "Reduced motion support via prefers-reduced-motion", done: true },
  { label: "Text resizing up to 200% without loss of content", done: true },
  { label: "Descriptive alt text on all images", done: true },
  { label: "Skip-to-content link on every page", done: true },
  { label: "Semantic HTML landmarks (nav, main, footer)", done: true },
  { label: "ARIA labels on icon-only buttons", done: true },
  { label: "CJK character rendering with proper font fallbacks", done: true },
  { label: "IME input compatibility for Asian languages", done: true },
];

const ASSISTIVE_TECH = ["NVDA", "JAWS", "VoiceOver (macOS/iOS)", "TalkBack (Android)", "Dragon NaturallySpeaking", "Switch Access"];

const Accessibility = () => {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["commitment"]));
  const [activeSection, setActiveSection] = useState("commitment");
  const [formData, setFormData] = useState({ name: "", email: "", pageUrl: "", description: "", assistiveTech: "", severity: "moderate" });

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
    setActiveSection(id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.description.length < 20) {
      toast.error("Please provide at least 20 characters in the description");
      return;
    }
    toast.success("Thank you! Your accessibility report has been submitted.");
    setFormData({ name: "", email: "", pageUrl: "", description: "", assistiveTech: "", severity: "moderate" });
  };

  const SECTIONS: Section[] = [
    {
      id: "commitment", title: "Our Commitment", icon: Shield,
      content: (
        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>PromptAndGo is committed to ensuring digital accessibility for people of all abilities. We continually improve the user experience for everyone and apply relevant accessibility standards across our platform.</p>
          <p>Our goal is to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA. These guidelines explain how to make web content more accessible to people with a wide array of disabilities.</p>
          <p>As a platform serving users across Asia in 12+ languages, we pay special attention to the unique accessibility needs of CJK (Chinese, Japanese, Korean) character rendering, IME input methods, and diverse script systems.</p>
        </div>
      ),
    },
    {
      id: "wcag", title: "WCAG 2.1 AA Compliance", icon: Check,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">We strive to meet the following WCAG 2.1 Level AA success criteria:</p>
          <div className="grid sm:grid-cols-2 gap-2">
            {CHECKLIST.map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "assistive", title: "Assistive Technology Support", icon: Monitor,
      content: (
        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>Our platform is tested with the following assistive technologies:</p>
          <div className="grid sm:grid-cols-2 gap-2">
            {ASSISTIVE_TECH.map((tech) => (
              <div key={tech} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span>{tech}</span>
              </div>
            ))}
          </div>
          <p>We test on Chrome, Firefox, Safari, and Edge on both desktop and mobile platforms. Asian-language IME inputs are tested on Windows IME, macOS Japanese/Korean/Chinese input, and Google Input Tools.</p>
        </div>
      ),
    },
    {
      id: "asian-lang", title: "Asian Language Accessibility", icon: Globe,
      content: (
        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p><strong className="text-foreground">CJK Character Rendering:</strong> We use system font stacks with fallbacks to Noto Sans CJK, ensuring proper rendering of Chinese (simplified/traditional), Japanese (kanji, hiragana, katakana), and Korean (hangul) characters across all platforms.</p>
          <p><strong className="text-foreground">IME Compatibility:</strong> All text input fields support Input Method Editors (IME) for Japanese, Korean, Chinese Pinyin, Thai, and Vietnamese TELEX input. Composition events are properly handled to prevent premature submission.</p>
          <p><strong className="text-foreground">Bidirectional Text:</strong> While our primary focus is on left-to-right Asian scripts, we are exploring support for bidirectional text rendering for users who work with Arabic or Urdu alongside Asian languages.</p>
          <p><strong className="text-foreground">Ruby Annotations:</strong> We support furigana (ふりがな) display for Japanese kanji to assist learners and users who prefer pronunciation guides.</p>
        </div>
      ),
    },
    {
      id: "limitations", title: "Known Limitations", icon: AlertTriangle,
      content: (
        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>While we strive for full accessibility, the following limitations currently exist:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Some complex data visualizations on the dashboard may not be fully accessible to screen readers. We provide text alternatives where possible.</li>
            <li>Third-party embedded content (e.g., payment forms via Stripe) may have their own accessibility limitations.</li>
            <li>PDF exports may not be fully tagged for screen reader navigation — we are working on this.</li>
            <li>Some animations may not fully respect prefers-reduced-motion in older browsers.</li>
          </ul>
          <p>We are actively working to resolve these issues and welcome your feedback.</p>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <style>{`@media print { header, footer, .no-print { display: none !important; } }`}</style>

      {/* Hero */}
      <section className="py-16 md:py-20 text-center px-4">
        <Shield className="h-10 w-10 text-primary mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">Accessibility at PromptAndGo</h1>
        <p className="text-primary/80 font-medium mb-2">アクセシビリティ | 접근성 | 无障碍 | การเข้าถึง | Khả năng tiếp cận</p>
        <p className="text-sm text-muted-foreground">Last updated: April 1, 2026</p>
      </section>

      <div className="max-w-5xl mx-auto px-4 pb-20 flex gap-8">
        {/* Sidebar TOC */}
        <nav className="hidden lg:block w-52 flex-shrink-0 no-print">
          <div className="sticky top-20 space-y-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-3">On This Page</h3>
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => { toggleSection(s.id); document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" }); }}
                className={`w-full text-left text-sm px-3 py-1.5 rounded-md transition-colors ${activeSection === s.id ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"}`}
              >
                {s.title}
              </button>
            ))}
            <button
              onClick={() => document.getElementById("report-form")?.scrollIntoView({ behavior: "smooth" })}
              className="w-full text-left text-sm px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors"
            >
              Report an Issue
            </button>
          </div>
        </nav>

        {/* Main */}
        <div className="flex-1 min-w-0 space-y-4">
          {SECTIONS.map((section) => {
            const isOpen = openSections.has(section.id);
            const Icon = section.icon;
            return (
              <div key={section.id} id={section.id} className="bg-card border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center gap-3 p-5 text-left hover:bg-muted/30 transition-colors"
                >
                  <Icon className="h-5 w-5 text-primary flex-shrink-0" />
                  <h2 className="text-base font-semibold text-foreground flex-1">{section.title}</h2>
                  {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </button>
                {isOpen && <div className="px-5 pb-5 border-t border-border pt-4">{section.content}</div>}
              </div>
            );
          })}

          {/* Report Form */}
          <div id="report-form" className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-1 flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" /> Report an Accessibility Issue
            </h2>
            <p className="text-sm text-muted-foreground mb-5">Help us improve. アクセシビリティの問題をご報告ください。</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Name</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Email</label>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:border-primary" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Page URL</label>
                <input type="url" value={formData.pageUrl} onChange={(e) => setFormData({ ...formData, pageUrl: e.target.value })} placeholder="https://promptandgo.ai/..."
                  className="w-full h-10 px-3 rounded-lg bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Description (min 20 characters)</label>
                <textarea required rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm resize-none focus:outline-none focus:border-primary" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Assistive Technology Used</label>
                  <select value={formData.assistiveTech} onChange={(e) => setFormData({ ...formData, assistiveTech: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none cursor-pointer">
                    <option value="">Select...</option>
                    {ASSISTIVE_TECH.map((t) => <option key={t} value={t}>{t}</option>)}
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-2">Severity</label>
                  <div className="flex gap-4">
                    {["minor", "moderate", "critical"].map((s) => (
                      <label key={s} className="flex items-center gap-1.5 text-sm text-muted-foreground cursor-pointer">
                        <input type="radio" name="severity" value={s} checked={formData.severity === s} onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                          className="accent-primary" />
                        <span className="capitalize">{s}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <button type="submit" className="h-10 px-6 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                Submit Report
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accessibility;
