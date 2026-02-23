import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import PageHero from "@/components/layout/PageHero";
import CountdownTimer from "@/components/conversion/CountdownTimer";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { validateEmailInput, validatePromptInput, sanitizeInput } from "@/lib/inputValidation";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

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
      <CountdownTimer variant="banner" />
      <PageHero
        title={<><span className="text-brand">Got something</span> to share?</>}
        subtitle={<>We'd love to hear from you, whether it's a fresh idea, feedback, a request for more of a certain prompt type, or a challenge you would like us to tackle. Drop us a message, and remember to subscribe to our newsletter for new prompts, tips, and inspiration straight to your inbox.</>}
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

        <SEO title="Contact PromptandGo" description="Send us a message - we'd love to hear from you." />

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
                placeholder="Name" 
                defaultValue={user ? (userProfile?.display_name || user.email?.split("@")[0] || "") : ""}
              />
              <Input 
                required 
                type="email" 
                name="email" 
                placeholder="Email" 
                defaultValue={user?.email || ""}
                readOnly={!!user}
                className={user ? "bg-muted/50" : ""}
              />
              <Textarea required name="message" placeholder="Message" />

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
          <aside className="lg:col-span-5">
            <div className="sticky top-24">
              <Link
                to="/submit"
                aria-label="Submit a Prompt"
                className="group relative block aspect-square w-full max-w-sm rounded-lg overflow-hidden shadow-elegant mx-auto transition-transform duration-200 hover:scale-105 hover:shadow-glow"
              >
                <img
                  src="/lovable-uploads/48df9644-8012-4209-b92b-e0e694b2a2f7.png"
                  alt="Submit a prompt illustration"
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent transition-colors group-hover:from-foreground/80" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="inline-block rounded-md bg-background/80 backdrop-blur-sm px-4 py-3 shadow-elegant">
                    <p className="text-foreground text-lg md:text-xl font-semibold leading-snug">
                      Send us your best prompt and help inspire the community.
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
};

export default Contact;