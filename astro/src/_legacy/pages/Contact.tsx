import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { validateEmailInput, validatePromptInput, sanitizeInput } from "@/lib/inputValidation";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MapPin, Clock, Mail, Phone, Send, Globe, ExternalLink } from "lucide-react";

/* ───── bilingual labels rotation ───── */
const BILINGUAL: { en: string; alt: string }[] = [
  { en: "Full Name", alt: "お名前" },
  { en: "Email Address", alt: "メールアドレス" },
  { en: "Subject", alt: "件名" },
  { en: "Message", alt: "メッセージ" },
  { en: "Preferred Language", alt: "ご希望の言語" },
];

const LANGUAGES = [
  "English", "Japanese 日本語", "Korean 한국어", "Mandarin 中文",
  "Thai ภาษาไทย", "Vietnamese Tiếng Việt", "Indonesian Bahasa Indonesia",
  "Malay Bahasa Melayu", "Hindi हिन्दी", "Tamil தமிழ்",
  "Tagalog", "Khmer ខ្មែរ", "Burmese ဗမာစာ",
];

const OFFICES = [
  {
    city: "Tokyo",
    native: "東京オフィス",
    flag: "🇯🇵",
    address: "Shibuya-ku, Dogenzaka 1-10-8",
    addressNative: "東京都渋谷区道玄坂1-10-8",
    tz: "JST (GMT+9)",
    email: "jp@promptandgo.ai",
  },
  {
    city: "Singapore",
    native: "新加坡办事处",
    flag: "🇸🇬",
    address: "71 Robinson Road, #14-01",
    addressNative: "罗敏申路71号 #14-01",
    tz: "SGT (GMT+8)",
    email: "sg@promptandgo.ai",
  },
  {
    city: "Seoul",
    native: "서울 사무소",
    flag: "🇰🇷",
    address: "Gangnam-gu, Teheran-ro 152",
    addressNative: "강남구 테헤란로 152",
    tz: "KST (GMT+9)",
    email: "kr@promptandgo.ai",
  },
];

const FAQS = [
  { id: "lang", q: "How do I switch languages?", a: "Go to Settings → Preferences and change your default language. You can also select a language per prompt in the optimizer." },
  { id: "password", q: "How do I reset my password?", a: "Click 'Forgot password' on the login page. We'll send a reset link to your registered email within minutes." },
  { id: "export", q: "Can I export my prompts?", a: "Pro users can export prompts as PDF or plain text from the Saved Prompts page. Enterprise users get CSV and API access." },
  { id: "translation", q: "How do I report a translation error?", a: "Use this contact form with subject 'Bug Report' and include the prompt ID and the incorrect translation. Our native-speaking team will review it." },
  { id: "upgrade", q: "How do I upgrade my plan?", a: "Visit the Pricing page and click 'Start Free Trial' on the Pro plan. Your current data and preferences will carry over automatically." },
  { id: "api", q: "How do I get API access?", a: "API access is available on Enterprise plans. Contact us with subject 'Enterprise' and we'll set up a demo and provide API credentials." },
];

const SOCIALS = [
  { name: "Twitter / X", url: "https://twitter.com", icon: "𝕏" },
  { name: "LinkedIn", url: "https://linkedin.com", icon: "in" },
  { name: "Discord", url: "https://discord.com", icon: "💬" },
  { name: "GitHub", url: "https://github.com", icon: "⌨" },
];

/* ───── globe animation ───── */
const AnimatedGlobe = () => (
  <div aria-hidden className="relative w-32 h-32 mx-auto mb-6">
    <div className="absolute inset-0 rounded-full border-2 border-white/10" />
    <div className="absolute inset-2 rounded-full border border-white/5" />
    <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/10" />
    {/* dots for Asian countries */}
    {[
      { top: "28%", left: "62%" }, // Japan
      { top: "35%", left: "55%" }, // Korea
      { top: "40%", left: "48%" }, // China
      { top: "55%", left: "50%" }, // Thailand
      { top: "58%", left: "52%" }, // Vietnam
      { top: "65%", left: "52%" }, // Singapore
    ].map((pos, i) => (
      <span
        key={i}
        className="absolute w-2 h-2 rounded-full bg-primary animate-pulse"
        style={{ top: pos.top, left: pos.left, animationDelay: `${i * 0.3}s` }}
      />
    ))}
    <Globe className="absolute inset-0 m-auto h-10 w-10 text-white/20" />
  </div>
);

/* ───── component ───── */
const Contact = () => {
  const { user } = useSupabaseAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showAccountCreation, setShowAccountCreation] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [accountEmail, setAccountEmail] = useState("");
  const [accountPassword, setAccountPassword] = useState("");
  const [userProfile, setUserProfile] = useState<{ display_name?: string } | null>(null);
  const [prefLang, setPrefLang] = useState("English");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const { data } = await supabase
          .from("profiles")
          .select("display_name")
          .eq("id", user.id)
          .maybeSingle();
        setUserProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, [user]);

  const handleAccountCreation = async (name: string, email: string, password: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: { display_name: name, wants_power_pack: true },
        },
      });
      if (error) {
        toast({ title: "Account creation failed", description: error.message, variant: "destructive" });
        return false;
      }
      toast({ title: "Account created!", description: "Check your email to confirm your account and get your ⚡️Power Pack!", duration: 8000 });
      return true;
    } catch {
      toast({ title: "Account creation failed", description: "Please try again.", variant: "destructive" });
      return false;
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    const notRobot = data.get("captcha") === "on";
    const honey = String(data.get("company") || "");

    if (honey) return;

    if (!name || !email || !message) {
      toast({ title: "Missing fields", description: "Please complete all required fields.", variant: "destructive" });
      return;
    }

    if (message.length < 20) {
      toast({ title: "Message too short", description: "Please write at least 20 characters.", variant: "destructive" });
      return;
    }

    const emailValidation = validateEmailInput(email);
    if (!emailValidation.isValid) {
      toast({ title: "Invalid Email", description: emailValidation.error, variant: "destructive" });
      return;
    }

    const messageValidation = validatePromptInput(message);
    if (!messageValidation.isValid) {
      toast({ title: "Invalid Message", description: messageValidation.error, variant: "destructive" });
      return;
    }

    const sanitizedName = sanitizeInput(name);
    const sanitizedMessage = sanitizeInput(message);

    if (!user && showAccountCreation && (!accountName || !accountEmail || !accountPassword)) {
      toast({ title: "Account details required", description: "Please fill in name, email and password for your account.", variant: "destructive" });
      return;
    }

    if (!notRobot) {
      toast({ title: "Captcha required", description: "Please confirm you are not a robot.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      if (!user && showAccountCreation && accountName && accountEmail && accountPassword) {
        const accountCreated = await handleAccountCreation(accountName, accountEmail, accountPassword);
        if (!accountCreated) { setIsLoading(false); return; }
      }

      const { error } = await supabase.functions.invoke("secure-contact-form", {
        body: { name: sanitizedName, email, message: sanitizedMessage, newsletter_opt_in: false },
      });

      if (error) {
        console.error("secure-contact-form error:", error);
        toast({ title: "Failed to send", description: "Please try again in a moment.", variant: "destructive" });
        return;
      }

      toast({ title: "Message sent securely!", description: "Thank you — we'll get back to you soon.", duration: 5000 });
      form.reset();
      setAccountName(""); setAccountEmail(""); setAccountPassword(""); setShowAccountCreation(false);
    } catch (error) {
      console.error("Contact form error:", error);
      toast({ title: "Failed to send", description: "Please try again in a moment.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Contact Us — PromptAndGo | We Speak Your Language"
        description="Get in touch with the PromptAndGo team. Support in Japanese, Korean, Mandarin, Thai, Vietnamese, and Indonesian."
        canonical="https://promptandgo.ai/contact"
      />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-hero">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px]" />
          </div>
          <div className="relative z-10 container max-w-4xl mx-auto px-4 pt-16 pb-10 md:pt-24 md:pb-14 text-center">
            <AnimatedGlobe />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight mb-3">
              Get in Touch
            </h1>
            <p className="text-lg text-white/60 max-w-lg mx-auto">
              We speak your language — support in 12+ Asian languages
            </p>
          </div>
        </section>

        {/* Main content */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container max-w-6xl mx-auto px-4">
            <Breadcrumb className="mb-8">
              <BreadcrumbList>
                <BreadcrumbItem><BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbPage>Contact</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="grid gap-10 lg:grid-cols-12">
              {/* Form */}
              <div className="lg:col-span-7">
                <h2 className="text-2xl font-bold text-foreground mb-6">Send us a message</h2>

                {user && (
                  <div className="mb-4 p-3 bg-muted/30 border border-border rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Logged in as <span className="font-medium text-foreground">{user.email}</span>
                    </p>
                  </div>
                )}

                <form onSubmit={onSubmit} className="grid gap-5 max-w-xl">
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-name">{BILINGUAL[0].en} <span className="text-xs text-muted-foreground ml-1">{BILINGUAL[0].alt}</span></Label>
                    <Input
                      id="contact-name"
                      required
                      name="name"
                      placeholder="Your full name"
                      defaultValue={user ? (userProfile?.display_name || user.email?.split("@")[0] || "") : ""}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contact-email">{BILINGUAL[1].en} <span className="text-xs text-muted-foreground ml-1">{BILINGUAL[1].alt}</span></Label>
                    <Input
                      id="contact-email"
                      required
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      defaultValue={user?.email || ""}
                      readOnly={!!user}
                      className={user ? "bg-muted/50" : ""}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contact-subject">{BILINGUAL[2].en} <span className="text-xs text-muted-foreground ml-1">{BILINGUAL[2].alt}</span></Label>
                    <select
                      id="contact-subject"
                      name="subject"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:border-2 focus-visible:border-ring transition-colors"
                      defaultValue=""
                    >
                      <option value="" disabled>Select a subject…</option>
                      <option value="general">General Inquiry</option>
                      <option value="bug">Bug Report</option>
                      <option value="feature">Feature Request</option>
                      <option value="partnership">Partnership</option>
                      <option value="translation">Translation Help</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contact-message">{BILINGUAL[3].en} <span className="text-xs text-muted-foreground ml-1">{BILINGUAL[3].alt}</span> <span className="text-xs text-muted-foreground">(min 20 chars)</span></Label>
                    <Textarea id="contact-message" required name="message" placeholder="Tell us how we can help…" rows={5} />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contact-lang">{BILINGUAL[4].en} <span className="text-xs text-muted-foreground ml-1">{BILINGUAL[4].alt}</span></Label>
                    <select
                      id="contact-lang"
                      value={prefLang}
                      onChange={(e) => setPrefLang(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:border-2 focus-visible:border-ring transition-colors"
                    >
                      {LANGUAGES.map((l) => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>

                  {/* Honeypot */}
                  <input type="text" name="company" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

                  {/* Account creation (existing logic preserved) */}
                  {!user && (
                    <>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="h-4 w-4" checked={showAccountCreation} onChange={(e) => setShowAccountCreation(e.target.checked)} />
                        Create a free account (optional)
                      </label>
                      {showAccountCreation && (
                        <div className="space-y-3 p-4 border border-border rounded-lg bg-muted/20">
                          <p className="text-sm font-medium text-foreground mb-2">Account Details</p>
                          <div className="space-y-2">
                            <Label htmlFor="account-name" className="text-xs">Full Name</Label>
                            <Input id="account-name" value={accountName} onChange={(e) => setAccountName(e.target.value)} placeholder="Your full name" className="h-9" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="account-email" className="text-xs">Email for account</Label>
                            <Input id="account-email" type="email" value={accountEmail} onChange={(e) => setAccountEmail(e.target.value)} placeholder="Account email" className="h-9" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="account-password" className="text-xs">Choose password</Label>
                            <Input id="account-password" type="password" value={accountPassword} onChange={(e) => setAccountPassword(e.target.value)} placeholder="Secure password" className="h-9" />
                          </div>
                          <p className="text-xs text-muted-foreground">Creating an account lets you save prompts and access premium features. You'll also get a FREE ⚡️Power Pack!</p>
                        </div>
                      )}
                    </>
                  )}

                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="captcha" className="h-4 w-4" />
                    I'm not a robot
                  </label>

                  <div className="pt-2">
                    <Button type="submit" disabled={isLoading} className="gap-2">
                      <Send className="h-4 w-4" />
                      {isLoading ? "Sending…" : (!user && showAccountCreation) ? "Create Account & Send" : "Send Message"}
                    </Button>
                  </div>
                </form>
              </div>

              {/* Sidebar */}
              <aside className="lg:col-span-5 space-y-6">
                {/* Response time */}
                <div className="rounded-xl border border-border bg-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary animate-pulse" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">We typically respond within 24 hours</p>
                      <p className="text-xs text-muted-foreground">Mon–Fri, across SGT / JST / KST timezones</p>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <Mail className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <p className="text-muted-foreground">Multilingual support in English, Japanese, Mandarin, and Korean</p>
                    </div>
                  </div>
                </div>

                {/* Social links */}
                <div className="rounded-xl border border-border bg-card p-6">
                  <h3 className="font-bold text-foreground mb-4">Connect With Us</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {SOCIALS.map((s) => (
                      <a
                        key={s.name}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-lg border border-border p-3 text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
                      >
                        <span className="text-lg">{s.icon}</span>
                        <span>{s.name}</span>
                        <ExternalLink className="h-3 w-3 ml-auto" />
                      </a>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* Offices */}
        <section className="py-12 md:py-16 bg-muted/30 border-y border-border">
          <div className="container max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Our Offices</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {OFFICES.map((o) => (
                <div key={o.city} className="rounded-xl border border-border bg-card overflow-hidden">
                  {/* Map placeholder */}
                  <div className="h-28 bg-gradient-to-br from-primary/10 to-accent/5 relative flex items-center justify-center">
                    <MapPin className="h-8 w-8 text-primary" />
                    <span className="absolute top-2 right-2 text-xl">{o.flag}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-foreground">{o.city}</h3>
                    <p className="text-sm text-primary mb-2">{o.native}</p>
                    <div className="space-y-1.5 text-sm text-muted-foreground">
                      <p>{o.address}</p>
                      <p className="text-xs">{o.addressNative}</p>
                      <div className="flex items-center gap-1.5 pt-1">
                        <Clock className="w-3 h-3" />
                        <span>{o.tz}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3 h-3" />
                        <span>{o.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Quick Help</h2>
            <Accordion type="single" collapsible className="space-y-3">
              {FAQS.map((f) => (
                <AccordionItem key={f.id} value={f.id} className="rounded-xl border border-border bg-card overflow-hidden">
                  <AccordionTrigger className="px-5 py-4 text-sm md:text-base font-semibold">{f.q}</AccordionTrigger>
                  <AccordionContent className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>
    </>
  );
};

export default Contact;
