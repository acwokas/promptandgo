import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import PageHero from "@/components/layout/PageHero";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { validateEmailInput, validatePromptInput, sanitizeInput } from "@/lib/inputValidation";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MapPin, Clock, Mail, Phone } from "lucide-react";

const Contact = () => {
  const { user } = useSupabaseAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showAccountCreation, setShowAccountCreation] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [accountEmail, setAccountEmail] = useState("");
  const [accountPassword, setAccountPassword] = useState("");
  const [userProfile, setUserProfile] = useState<{ display_name?: string } | null>(null);

  // Fetch user profile data when user is available
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
          data: { 
            display_name: name,
            wants_power_pack: true // Everyone gets PowerPack automatically
          }
        },
      });
      
      if (error) {
        toast({ 
          title: "Account creation failed", 
          description: error.message, 
          variant: "destructive" 
        });
        return false;
      } else {
        toast({ 
          title: "Account created!", 
          description: "Check your email to confirm your account and get your ⚡️Power Pack!", 
          duration: 8000
        });
        return true;
      }
    } catch (err) {
      toast({ 
        title: "Account creation failed", 
        description: "Please try again.", 
        variant: "destructive" 
      });
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
    const honey = String(data.get("company") || ""); // honeypot

    if (honey) return; // silently drop bots

    if (!name || !email || !message) {
      toast({ title: "Missing fields", description: "Please complete all fields.", variant: "destructive" });
      return;
    }

    // Validate email
    const emailValidation = validateEmailInput(email);
    if (!emailValidation.isValid) {
      toast({ title: "Invalid Email", description: emailValidation.error, variant: "destructive" });
      return;
    }

    // Validate message content
    const messageValidation = validatePromptInput(message);
    if (!messageValidation.isValid) {
      toast({ title: "Invalid Message", description: messageValidation.error, variant: "destructive" });
      return;
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedMessage = sanitizeInput(message);

    // Only validate account creation fields if user is not logged in and wants to create account
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
      // Handle account creation if requested and user is not logged in
      if (!user && showAccountCreation && accountName && accountEmail && accountPassword) {
        const accountCreated = await handleAccountCreation(accountName, accountEmail, accountPassword);
        if (!accountCreated) {
          setIsLoading(false);
          return; // Stop if account creation failed
        }
      }

      // SECURITY FIX: Send contact through secure encrypted system  
      const { data: response, error } = await supabase.functions.invoke("secure-contact-form", {
        body: { 
          name: sanitizedName, 
          email, 
          message: sanitizedMessage,
          newsletter_opt_in: false // Contact form doesn't have newsletter opt-in currently
        },
      });

      if (error) {
        console.error("secure-contact-form error:", error);
        toast({ title: "Failed to send", description: "Please try again in a moment.", variant: "destructive" });
        return;
      }

      // Contact message sent and stored securely
      toast({ 
        title: "Message sent securely!", 
        description: "Thank you for your message. We'll get back to you soon.",
        duration: 5000
      });
      form.reset();
      // Also reset account creation fields
      setAccountName("");
      setAccountEmail("");
      setAccountPassword("");
      setShowAccountCreation(false);
    } catch (error) {
      console.error("Contact form error:", error);
      toast({ title: "Failed to send", description: "Please try again in a moment.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageHero
        title={<><span className="text-brand">Get in Touch</span></>}
        subtitle={<>We'd love to hear from you — whether you're in Tokyo, Mumbai, or anywhere in between. Drop us a message and we'll get back to you promptly.</>}
        minHeightClass="min-h-[28svh]"
      />
      <main className="container py-10">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Contact</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <SEO title="Contact Us | PromptAndGo" description="Get in touch with the PromptAndGo team. Questions about AI prompts, Scout optimizer, Power Packs, or partnerships? We'd love to hear from you." canonical="https://promptandgo.ai/contact" />

        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {user && (
              <div className="mb-4 p-3 bg-muted/30 border border-border rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Logged in as <span className="font-medium text-foreground">{user.email}</span>
                </p>
              </div>
            )}
            
            <form onSubmit={onSubmit} className="grid gap-4 max-w-xl">
              <Input 
                required 
                name="name" 
                placeholder="Full Name" 
                defaultValue={user ? (userProfile?.display_name || user.email?.split("@")[0] || "") : ""}
              />
              <Input 
                required 
                type="email" 
                name="email" 
                placeholder="Email Address" 
                defaultValue={user?.email || ""}
                readOnly={!!user}
                className={user ? "bg-muted/50" : ""}
              />
              <Input 
                name="company_name" 
                placeholder="Company (optional)" 
              />
              <select
                name="country"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                defaultValue=""
              >
                <option value="" disabled>Select country...</option>
                <optgroup label="Asia-Pacific">
                  <option value="SG">Singapore</option>
                  <option value="JP">Japan</option>
                  <option value="KR">South Korea</option>
                  <option value="CN">China</option>
                  <option value="IN">India</option>
                  <option value="TH">Thailand</option>
                  <option value="VN">Vietnam</option>
                  <option value="ID">Indonesia</option>
                  <option value="MY">Malaysia</option>
                  <option value="PH">Philippines</option>
                  <option value="TW">Taiwan</option>
                  <option value="HK">Hong Kong</option>
                  <option value="AU">Australia</option>
                </optgroup>
                <optgroup label="Other">
                  <option value="US">United States</option>
                  <option value="GB">United Kingdom</option>
                  <option value="other">Other</option>
                </optgroup>
              </select>
              <select
                name="subject"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                defaultValue=""
              >
                <option value="" disabled>Select a subject...</option>
                <option value="general">General Inquiry</option>
                <option value="enterprise">Enterprise Plans</option>
                <option value="partnership">Partnership</option>
                <option value="bug">Bug Report</option>
                <option value="feature">Feature Request</option>
              </select>
              <Textarea required name="message" placeholder="Your message..." rows={5} />

              {/* Honeypot field */}
              <input type="text" name="company" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

              {/* Create account option - only show if not logged in */}
              {!user && (
                <>
                  <label className="flex items-center gap-2 text-sm">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4" 
                      checked={showAccountCreation}
                      onChange={(e) => setShowAccountCreation(e.target.checked)}
                    />
                    Create a free account (optional)
                  </label>

                  {/* Account creation form */}
                  {showAccountCreation && (
                    <div className="space-y-3 p-4 border border-border rounded-lg bg-muted/20">
                      <div className="text-sm font-medium text-foreground mb-2">
                        Account Details
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="account-name" className="text-xs">Full Name</Label>
                        <Input 
                          id="account-name"
                          type="text" 
                          value={accountName}
                          onChange={(e) => setAccountName(e.target.value)}
                          placeholder="Your full name"
                          className="h-9"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="account-email" className="text-xs">Email for account</Label>
                        <Input 
                          id="account-email"
                          type="email" 
                          value={accountEmail}
                          onChange={(e) => setAccountEmail(e.target.value)}
                          placeholder="Account email (can be same as above)"
                          className="h-9"
                          onFocus={(e) => {
                            // Auto-fill with contact email if empty
                            if (!accountEmail) {
                              const contactEmailInput = document.querySelector('input[name="email"]') as HTMLInputElement;
                              if (contactEmailInput?.value) {
                                setAccountEmail(contactEmailInput.value);
                              }
                            }
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="account-password" className="text-xs">Choose password</Label>
                        <Input 
                          id="account-password"
                          type="password" 
                          value={accountPassword}
                          onChange={(e) => setAccountPassword(e.target.value)}
                          placeholder="Create a secure password"
                          className="h-9"
                        />
                      </div>
                      
                      <p className="text-xs text-muted-foreground">
                        Creating an account lets you save favorite prompts and access premium features. You'll also get a FREE ⚡️Power Pack!
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Simple captcha */}
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="captcha" className="h-4 w-4" />
                I'm not a robot
              </label>

              <div className="pt-2">
                <Button type="submit" variant="cta" disabled={isLoading}>
                  {isLoading ? "Sending..." : (!user && showAccountCreation) ? "Create Account & Claim My FREE ⚡️Power Pack" : "Send Message"}
                </Button>
              </div>
            </form>
          </div>
          <aside className="lg:col-span-5 space-y-8">
            {/* We're here to help */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-bold text-lg mb-4">We're here to help</h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Response Time</p>
                    <p className="text-muted-foreground">We typically respond within 24 hours during business days (SGT, GMT+8).</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium">Asia-Pacific Based</p>
                    <p className="text-muted-foreground">Our team is based in Singapore with members across ASEAN, Japan, and India.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Multilingual Support</p>
                    <p className="text-muted-foreground">We can respond in English, Mandarin, Bahasa, and Japanese.</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">Follow us</p>
                <div className="flex gap-3">
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary transition-colors">LinkedIn</a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary transition-colors">X / Twitter</a>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary transition-colors">GitHub</a>
                  <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary transition-colors">Discord</a>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Our Offices */}
        <section className="mt-16 mb-12">
          <h2 className="text-2xl font-bold mb-8">Our Offices</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { city: "Singapore", label: "HQ", address: "71 Robinson Road, #14-01", phone: "+65 6123 4567", email: "sg@promptandgo.ai", hours: "Mon-Fri 9am-6pm SGT" },
              { city: "Tokyo", label: "Japan", address: "Shibuya-ku, Dogenzaka 1-10-8", phone: "+81 3-1234-5678", email: "jp@promptandgo.ai", hours: "Mon-Fri 9am-6pm JST" },
              { city: "Mumbai", label: "India", address: "Bandra Kurla Complex, Unit 402", phone: "+91 22 1234 5678", email: "in@promptandgo.ai", hours: "Mon-Fri 9:30am-6:30pm IST" },
              { city: "Seoul", label: "Korea", address: "Gangnam-gu, Teheran-ro 152", phone: "+82 2-1234-5678", email: "kr@promptandgo.ai", hours: "Mon-Fri 9am-6pm KST" },
            ].map((office) => (
              <div key={office.city} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-primary" />
                  <h3 className="font-bold">{office.city}</h3>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{office.label}</span>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>{office.address}</p>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3" />
                    <span>{office.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3 h-3" />
                    <span>{office.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    <span>{office.hours}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="max-w-2xl">
            <AccordionItem value="free">
              <AccordionTrigger>Is PromptAndGo free?</AccordionTrigger>
              <AccordionContent>
                Yes! PromptAndGo offers a generous free tier that includes access to the prompt library, the optimizer tool, and Ask Scout. Power Packs and Pro features are available for users who want deeper capabilities.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="platforms">
              <AccordionTrigger>Which AI platforms do you support?</AccordionTrigger>
              <AccordionContent>
                We support 12 major platforms including ChatGPT, Claude, Gemini, Qwen, DeepSeek, Ernie Bot, Copilot, Meta AI, Grok, MidJourney, Perplexity, and Stable Diffusion. Each prompt is optimized for the specific strengths of each platform.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="enterprise">
              <AccordionTrigger>Do you offer enterprise plans?</AccordionTrigger>
              <AccordionContent>
                Yes, we offer custom enterprise plans for teams and organizations. Contact us with the Enterprise Plans subject to learn more about volume pricing, custom prompt libraries, and dedicated support.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="optimizer">
              <AccordionTrigger>How does the prompt optimizer work?</AccordionTrigger>
              <AccordionContent>
                Our optimizer analyzes your prompt for clarity, specificity, and context, then restructures it using platform-specific best practices. It considers language nuances, cultural context, and the target AI platform to produce optimized results.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="contribute">
              <AccordionTrigger>Can I contribute prompts?</AccordionTrigger>
              <AccordionContent>
                Absolutely! We welcome community contributions. Visit the Submit Prompt page to share your best prompts with the community and earn XP rewards.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="language">
              <AccordionTrigger>Do you support my language?</AccordionTrigger>
              <AccordionContent>
                We currently support 12+ Asian languages including Mandarin, Japanese, Korean, Thai, Vietnamese, Bahasa Indonesia, Bahasa Melayu, Hindi, Tamil, Tagalog, Bengali, and Khmer, plus English. More languages are being added regularly.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </main>
    </>
  );
};

export default Contact;