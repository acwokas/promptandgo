import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session } = useSupabaseAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      navigate("/", { replace: true });
    }
  }, [session, navigate]);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Welcome back" });
      navigate("/", { replace: true });
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    setError(null);
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectUrl },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      toast({ title: "Sign up error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Check your email", description: "Confirm your address to finish sign up." });
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signin") handleSignIn();
    else handleSignUp();
  };

  const handleGoogle = async () => {
    try {
      const redirectTo = `${window.location.origin}/`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });
      if (error) throw error;
    } catch (err: any) {
      toast({ title: "Google sign-in failed", description: err?.message || String(err), variant: "destructive" });
    }
  };

  return (
    <>
      <SEO
        title="Login or Sign Up | PromptAndGo.ai"
        description="Access your PromptAndGo.ai account to save prompts and personalize your experience. Log in or create a new account."
      />
      <main className="container py-12">
        <section className="mx-auto max-w-md rounded-2xl border bg-card p-6 md:p-8">
          <h1 className="text-2xl font-semibold mb-6">{mode === "signin" ? "Log in" : "Create your account"}</h1>

          <div className="mb-6 inline-flex rounded-lg border p-1 bg-background">
            <Button variant={mode === "signin" ? "default" : "ghost"} onClick={() => setMode("signin")}>Log in</Button>
            <Button variant={mode === "signup" ? "default" : "ghost"} onClick={() => setMode("signup")}>Sign up</Button>
          </div>
          <div className="space-y-3 mb-6">
            <Button type="button" variant="secondary" className="w-full" disabled aria-disabled="true" title="Coming soon">Continue with Google (coming soon)</Button>
            <div className="text-center text-xs text-muted-foreground">or use email</div>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Your password" />
            </div>

            {error && (
              <p className="text-sm text-destructive" role="alert">{error}</p>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Please wait..." : mode === "signin" ? "Log in" : "Create account"}
            </Button>

            {mode === "signin" ? (
              <p className="text-xs text-muted-foreground text-center">
                Don’t have an account? <button type="button" onClick={() => setMode("signup")} className="underline text-primary">Sign up</button>
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
