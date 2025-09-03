import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LogIn, UserPlus, X, ChevronUp, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { validateEmailInput, sanitizeInput } from "@/lib/inputValidation";
import { useNavigate } from "react-router-dom";
import { useLoginWidget } from "@/hooks/useLoginWidget";
import { useIsMobile } from "@/hooks/use-mobile";

export const LoginWidget = () => {
  const isMobile = useIsMobile();
  const { isOpen: externalIsOpen, closeLoginWidget } = useLoginWidget();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Optional context fields for better prompt personalization
  const [industry, setIndustry] = useState("");
  const [projectType, setProjectType] = useState("");
  const [preferredTone, setPreferredTone] = useState("");
  const [desiredOutcome, setDesiredOutcome] = useState("");
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();

  // Sync external open state with internal state
  useEffect(() => {
    if (externalIsOpen && !isOpen) {
      // Ensure widget can always be reopened via global trigger
      setIsDismissed(false);
      setIsMinimized(false);
      setIsOpen(true);
    }
  }, [externalIsOpen, isOpen]);

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

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setIndustry("");
    setProjectType("");
    setPreferredTone("");
    setDesiredOutcome("");
    setError(null);
    setShowOptionalFields(false);
  };

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
      toast({ title: "Welcome back!" });
      resetForm();
      setIsOpen(false);
      closeLoginWidget();
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
      resetForm();
      setIsOpen(false);
      closeLoginWidget();
      
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

  
  // Don't render on mobile to prevent flickering
  if (isMobile || isDismissed) return null;

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsMinimized(false)}
            size="sm"
            className="shadow-lg"
            aria-label="Open login"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Login
            <ChevronUp className="h-4 w-4 ml-2" />
          </Button>
          <Button
            onClick={() => setIsDismissed(true)}
            variant="ghost"
            size="sm"
            className="shadow-lg bg-background/80 backdrop-blur-sm border"
            aria-label="Dismiss login widget"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsOpen(true)}
            size="lg"
            className="shadow-lg"
            aria-label="Open login form"
          >
            <LogIn className="h-5 w-5 mr-2" />
            Sign Up / Log In
          </Button>
          <Button
            onClick={() => setIsDismissed(true)}
            variant="ghost"
            size="sm"
            className="shadow-lg bg-background/80 backdrop-blur-sm border"
            aria-label="Dismiss login widget"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Card className="w-96 max-h-[80svh] overflow-y-auto shadow-xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <LogIn className="h-5 w-5" />
                {mode === "signup" ? "Create account" : "Log in"}
              </CardTitle>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(true)}
                  aria-label="Minimize login"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsOpen(false);
                      closeLoginWidget();
                    }}
                    aria-label="Close login"
                  >
                    <X className="h-4 w-4" />
                  </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 inline-flex rounded-lg border p-1 bg-background">
              <Button 
                variant={mode === "signup" ? "default" : "ghost"} 
                size="sm"
                onClick={() => setMode("signup")}
              >
                Sign up
              </Button>
              <Button 
                variant={mode === "signin" ? "default" : "ghost"} 
                size="sm"
                onClick={() => setMode("signin")}
              >
                Log in
              </Button>
            </div>

            <div className="space-y-3 mb-4">
              <Button type="button" variant="secondary" className="w-full" onClick={handleGoogle}>
                Continue with Google
              </Button>
              <div className="text-center text-xs text-muted-foreground">or use email</div>
            </div>

            <form onSubmit={onSubmit} className="space-y-3">
              {mode === "signup" && (
                <div className="space-y-1">
                  <Label htmlFor="name" className="text-sm">Full Name</Label>
                  <Input 
                    id="name" 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                    placeholder="Your full name"
                    className="h-9"
                  />
                </div>
              )}
              
              <div className="space-y-1">
                <Label htmlFor="email" className="text-sm">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  placeholder="you@example.com"
                  className="h-9"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="password" className="text-sm">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  placeholder="Your password"
                  className="h-9"
                />
              </div>

              {mode === "signup" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      🎯 Optional: Personalize your prompts
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowOptionalFields(!showOptionalFields)}
                      className="text-xs h-6 px-2"
                    >
                      {showOptionalFields ? "Hide" : "Show"}
                    </Button>
                  </div>

                  {showOptionalFields && (
                    <div className="space-y-2 p-3 bg-muted/30 rounded-lg">
                      <div className="space-y-1">
                        <Label htmlFor="industry" className="text-xs">Industry</Label>
                        <Select value={industry} onValueChange={setIndustry}>
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent className="bg-background border shadow-lg z-[60]">
                            {industries.map((ind) => (
                              <SelectItem key={ind} value={ind} className="text-xs">{ind}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="projectType" className="text-xs">Main Use Case</Label>
                        <Select value={projectType} onValueChange={setProjectType}>
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="What do you mainly use AI for?" />
                          </SelectTrigger>
                          <SelectContent className="bg-background border shadow-lg z-[60]">
                            {projectTypes.map((type) => (
                              <SelectItem key={type} value={type} className="text-xs">{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="preferredTone" className="text-xs">Preferred Tone</Label>
                        <Select value={preferredTone} onValueChange={setPreferredTone}>
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Select tone" />
                          </SelectTrigger>
                          <SelectContent className="bg-background border shadow-lg z-[60]">
                            {tones.map((tone) => (
                              <SelectItem key={tone} value={tone} className="text-xs">{tone}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="desiredOutcome" className="text-xs">Desired Outcome</Label>
                        <Input
                          id="desiredOutcome"
                          value={desiredOutcome}
                          onChange={(e) => setDesiredOutcome(e.target.value)}
                          placeholder="e.g., Increase engagement, Save time"
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {error && (
                <p className="text-xs text-destructive" role="alert">{error}</p>
              )}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Please wait..." : mode === "signup" ? "Create Account & Claim FREE ⚡️Power Pack" : "Log in"}
              </Button>

              {mode === "signup" ? (
                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setMode("signin")}
                    className="text-xs p-0 h-auto"
                  >
                    Already have an account? Log in
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setMode("signup")}
                    className="text-xs p-0 h-auto"
                  >
                    Don't have an account? Sign up
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};