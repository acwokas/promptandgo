import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, useLocation, Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { validateEmailInput, sanitizeInput } from "@/lib/inputValidation";
import PostGoogleAuthForm from "@/components/auth/PostGoogleAuthForm";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session, user } = useSupabaseAuth();
  const [mode, setMode] = useState<"signin" | "signup">(searchParams.get("mode") === "signup" ? "signup" : "signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPostGoogleForm, setShowPostGoogleForm] = useState(false);
  const [isGoogleSignup, setIsGoogleSignup] = useState(false);
  
  // Optional context fields for better prompt personalization
  const [industry, setIndustry] = useState("");
  const [projectType, setProjectType] = useState("");
  const [preferredTone, setPreferredTone] = useState("");
  const [desiredOutcome, setDesiredOutcome] = useState("");
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  const industries = [
    "Technology", "Healthcare", "Finance", "Education", "Retail", "Manufacturing",
    "Marketing & Advertising", "Real Estate", "Legal Services", "Consulting",
    "Media & Entertainment", "Non-profit", "Other"
  ];

  const projectTypes = [
    "Content Creation", "Marketing Campaigns", "Business Strategy", "Customer Support",
    "Product Development", "Research & Analysis", "Educational Content", "Creative Writing",
    "Technical Documentation", "Sales & Outreach", "Other"
  ];

  const tones = [
    "Professional", "Casual", "Friendly", "Authoritative", "Conversational",
    "Formal", "Creative", "Direct", "Empathetic", "Persuasive"
  ];

  useEffect(() => {
    // Prefill email from navigation state (from newsletter form)
    const stateEmail = location.state?.email;
    if (stateEmail && !email) {
      setEmail(stateEmail);
      // Show a helpful message that they should log in
      toast({
        title: "Welcome back!",
        description: "Please enter your password to access your account and prompts.",
      });
    }

    if (session && user) {
      // Check if this is a Google signup that needs additional info
      const isNewUser = searchParams.get('new_user') === 'true';
      
      // Check for Google OAuth provider in multiple possible locations
      const providers = user.app_metadata?.providers || [];
      const provider = user.app_metadata?.provider;
      const isGoogleAuth = provider === 'google' || providers.includes('google') || 
                          user.user_metadata?.iss?.includes('accounts.google.com');
      
      console.log('Auth debug:', { isNewUser, provider, providers, isGoogleAuth, user: user.user_metadata });
      
      if (isNewUser && isGoogleAuth) {
        setIsGoogleSignup(true);
        setShowPostGoogleForm(true);
        return;
      }
      
      navigate("/", { replace: true });
    }
  }, [session, user, navigate, searchParams, location.state, email, toast]);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    
    // Validate email
    const emailValidation = validateEmailInput(email);
    if (!emailValidation.isValid) {
      setError(emailValidation.error);
      toast({ title: "Invalid Email", description: emailValidation.error, variant: "destructive" });
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    } else {
      // Check if they came from newsletter signup
      const fromNewsletter = location.state?.email;
      if (fromNewsletter) {
        toast({ 
          title: "Welcome back!", 
          description: "You're already signed up for our newsletter! Access your saved prompts below.",
        });
        // Show success state with redirect to favorites/prompts
        navigate("/account/favorites", { replace: true });
      } else {
        toast({ title: "Welcome back" });
        navigate("/", { replace: true });
      }
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    setError(null);
    
    // Validate email
    const emailValidation = validateEmailInput(email);
    if (!emailValidation.isValid) {
      setError(emailValidation.error);
      toast({ title: "Invalid Email", description: emailValidation.error, variant: "destructive" });
      setLoading(false);
      return;
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedIndustry = industry ? sanitizeInput(industry) : null;
    const sanitizedProjectType = projectType ? sanitizeInput(projectType) : null;
    const sanitizedPreferredTone = preferredTone ? sanitizeInput(preferredTone) : null;
    const sanitizedDesiredOutcome = desiredOutcome ? sanitizeInput(desiredOutcome) : null;

    const redirectUrl = `${window.location.origin}/`;
    
    // Check if any context fields are filled
    const hasContextFields = industry || projectType || preferredTone || desiredOutcome;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        emailRedirectTo: redirectUrl,
        data: { 
          display_name: sanitizedName,
          wants_power_pack: true, // Everyone gets PowerPack automatically
          industry: sanitizedIndustry,
          project_type: sanitizedProjectType,
          preferred_tone: sanitizedPreferredTone,
          desired_outcome: sanitizedDesiredOutcome,
          context_fields_completed: hasContextFields
        }
      },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      toast({ title: "Sign up error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Check your email", description: "Confirm your address to finish sign up and get your ⚡️Power Pack!" });
      
      // Send signup notification email for email signups
      try {
        await supabase.functions.invoke('send-signup-notification', {
          body: {
            user: {
              email,
              name: sanitizedName,
              signupMethod: 'email',
              industry: sanitizedIndustry,
              projectType: sanitizedProjectType,
              preferredTone: sanitizedPreferredTone,
              desiredOutcome: sanitizedDesiredOutcome,
            }
          }
        });
      } catch (emailError) {
        console.error("Failed to send signup notification:", emailError);
        // Don't block the user flow if email fails
      }
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate name for signup
    if (mode === "signup" && !name.trim()) {
      setError("Please enter your full name");
      toast({ title: "Name required", description: "Please enter your full name to create an account.", variant: "destructive" });
      return;
    }
    
    if (mode === "signin") handleSignIn();
    else handleSignUp();
  };

  const handleGoogle = async () => {
    try {
      const redirectTo = `${window.location.origin}/?new_user=true`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });
      if (error) throw error;
    } catch (err: any) {
      toast({ title: "Google sign-in failed", description: err?.message || String(err), variant: "destructive" });
    }
  };

  const handlePostGoogleFormComplete = () => {
    setShowPostGoogleForm(false);
    navigate("/", { replace: true });
  };

  return (
    <>
      <SEO
        title="Login or Sign Up | promptandgo"
        description="Access your promptandgo account to save prompts and personalize your experience. Log in or create a new account."
      />
      
      {showPostGoogleForm && isGoogleSignup && user && (
        <PostGoogleAuthForm
          onComplete={handlePostGoogleFormComplete}
          userEmail={user.email || ''}
          userName={user.user_metadata?.full_name || user.user_metadata?.name}
        />
      )}
      
      <main className="container py-12">
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
              <BreadcrumbPage>{mode === "signin" ? "Login" : "Sign Up"}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <section className="mx-auto max-w-md rounded-2xl border bg-card p-6 md:p-8">
          <h1 className="text-2xl font-semibold mb-6">{mode === "signin" ? "Log in" : "Create your account"}</h1>

          <div className="mb-6 inline-flex rounded-lg border p-1 bg-background">
            <Button variant={mode === "signin" ? "default" : "ghost"} onClick={() => setMode("signin")}>Log in</Button>
            <Button variant={mode === "signup" ? "default" : "ghost"} onClick={() => setMode("signup")}>Sign up</Button>
          </div>
          <div className="space-y-3 mb-6">
            <Button type="button" variant="secondary" className="w-full" onClick={handleGoogle}>Continue with Google</Button>
            <div className="text-center text-xs text-muted-foreground">or use email</div>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  placeholder="Your full name" 
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Your password" />
            </div>

            {mode === "signup" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    🎯 Optional: Help us personalize your prompts
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowOptionalFields(!showOptionalFields)}
                    className="text-xs"
                  >
                    {showOptionalFields ? "Hide" : "Show"} Options
                  </Button>
                </div>

                {showOptionalFields && (
                  <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                    <div className="space-y-2">
                      <Label htmlFor="industry" className="text-xs">Industry</Label>
                      <Select value={industry} onValueChange={setIndustry}>
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border shadow-lg z-50">
                          {industries.map((ind) => (
                            <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="projectType" className="text-xs">Main Use Case</Label>
                      <Select value={projectType} onValueChange={setProjectType}>
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="What do you mainly use AI for?" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border shadow-lg z-50">
                          {projectTypes.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="preferredTone" className="text-xs">Preferred Tone</Label>
                      <Select value={preferredTone} onValueChange={setPreferredTone}>
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border shadow-lg z-50">
                          {tones.map((tone) => (
                            <SelectItem key={tone} value={tone}>{tone}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="desiredOutcome" className="text-xs">Desired Outcome</Label>
                      <Input
                        id="desiredOutcome"
                        value={desiredOutcome}
                        onChange={(e) => setDesiredOutcome(e.target.value)}
                        placeholder="e.g., Increase engagement, Save time"
                        className="h-8"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {error && (
              <p className="text-sm text-destructive" role="alert">{error}</p>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Please wait..." : mode === "signin" ? "Log in" : "Create Account & Claim My FREE ⚡️Power Pack"}
            </Button>

            {mode === "signin" ? (
              <p className="text-xs text-muted-foreground text-center">
                Don't have an account? <button type="button" onClick={() => setMode("signup")} className="underline text-primary">Sign up</button>
              </p>
            ) : (
              <p className="text-xs text-muted-foreground text-center">
                Already have an account? <button type="button" onClick={() => setMode("signin")} className="underline text-primary">Log in</button>
              </p>
            )}
          </form>
        </section>
      </main>
    </>
  );
};

export default Auth;
