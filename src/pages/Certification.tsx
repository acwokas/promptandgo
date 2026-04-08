import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { X, Award, Globe, Zap, BookOpen, Users, ArrowRight, Check } from "lucide-react";
import { useUserXP } from "@/hooks/useUserXP";
import { WelcomeStep } from "@/components/certification/WelcomeStep";
import { HowItWorksStep } from "@/components/certification/HowItWorksStep";
import { RulesStep } from "@/components/certification/RulesStep";
import { PracticeStep } from "@/components/certification/PracticeStep";
import { PracticeStep2 } from "@/components/certification/PracticeStep2";
import { QuizStep } from "@/components/certification/QuizStep";
import { CertificateStep } from "@/components/certification/CertificateStep";
import { UpgradeStep } from "@/components/certification/UpgradeStep";
import SEO from "@/components/SEO";

const TOTAL_STEPS = 8;
const XP_PER_STEP = 20;

const progressMap: Record<number, number> = {
  0: 0,
  1: 12,
  2: 25,
  3: 38,
  4: 50,
  5: 62,
  6: 75,
  7: 100,
};

export default function Certification() {
  const { user } = useSupabaseAuth();
  const navigate = useNavigate();
  const { awardXP } = useUserXP();
  const [currentStep, setCurrentStep] = useState(-1); // -1 = landing page
  const [fullName, setFullName] = useState("");
  const [quizScore, setQuizScore] = useState(0);
  const [certificateId, setCertificateId] = useState("");
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNameSubmit = (name: string) => {
    setFullName(name);
    handleNext();
  };

  const handleQuizComplete = async (score: number) => {
    setQuizScore(score);

    if (score >= 4) {
      const certId = Math.random().toString(36).substring(2, 8).toUpperCase();
      setCertificateId(certId);

      if (user) {
        try {
          await supabase.from("certification_completions").insert({
            user_id: user.id,
            full_name: fullName,
            certificate_id: certId,
            quiz_score: score,
            total_xp: XP_PER_STEP * TOTAL_STEPS,
          });

          await supabase.from("profiles").update({
            is_certified: true,
          }).eq("id", user.id);

          awardXP({
            activityKey: 'certification_completed',
            description: 'Completed Prompt Like a Pro certification',
          });

          toast.success("Congratulations! You're now certified! 🎉");
        } catch (error) {
          console.error("Error saving certification:", error);
        }
      }
      handleNext();
    }
  };

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (waitlistEmail.trim()) {
      setWaitlistSubmitted(true);
      toast.success("You're on the waitlist! We'll notify you when the program launches.");
    }
  };

  const progress = progressMap[Math.max(currentStep, 0)];
  const stepNames = ["Welcome", "How It Works", "Rules", "Practice", "Practice", "Quiz", "Certificate", "Upgrade"];

  // Landing page view
  if (currentStep === -1) {
    return (
      <>
        <SEO
          title="AI Prompt Certification for APAC Professionals | PromptAndGo"
          description="Become a PromptAndGo Certified Prompt Engineer. Master AI prompting for Asian markets with our interactive certification program. Free 'Prompt Like a Pro' course available now."
          canonical="https://promptandgo.ai/certification"
        />

        {/* Hero */}
        <section className="bg-hero text-white py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[-20%] left-[10%] w-[400px] h-[400px] rounded-full bg-primary/20 blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[10%] w-[300px] h-[300px] rounded-full bg-accent/15 blur-[100px]" />
          </div>
          <div className="relative z-10 container max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/40 text-primary px-4 py-2 rounded-full text-sm font-bold mb-6">
              <Award className="h-4 w-4" />
              Certification Program
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6">
              Prove Your AI <span className="text-gradient-brand">Prompt Skills</span>
            </h1>
            <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-10">
              The only AI prompt certification designed for Asia-Pacific professionals. Master multi-platform, multilingual prompting — and earn credentials that matter.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="h-14 px-10 text-base font-semibold bg-white text-gray-900 hover:bg-white/95" onClick={() => setCurrentStep(0)}>
                <Zap className="h-5 w-5 mr-2" />
                Start Free Certification
              </Button>
            </div>
          </div>
        </section>

        <main className="container max-w-5xl mx-auto px-4 py-16 space-y-20">
          {/* Current course */}
          <section>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">Prompt Like a Pro</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Our free interactive certification course. Learn prompt engineering fundamentals, practice with real examples, and earn your certificate.
              </p>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { icon: BookOpen, title: "Learn", desc: "Interactive lessons covering prompt structure, context injection, and platform optimization." },
                { icon: Zap, title: "Practice", desc: "Hands-on exercises with real AI platforms. Test your skills before the quiz." },
                { icon: Award, title: "Certify", desc: "Pass the quiz, earn your certificate, and display your PromptAndGo badge." },
              ].map((s) => (
                <Card key={s.title} className="border-border/50 hover:border-primary/30 transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mx-auto mb-4">
                      <s.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-bold mb-2">{s.title}</h3>
                    <p className="text-sm text-muted-foreground">{s.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button size="lg" onClick={() => setCurrentStep(0)} className="gap-2">
                Start Course <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </section>

          {/* Coming Soon: Certified Prompt Engineer */}
          <section className="rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 px-2.5 py-0.5 rounded-full text-xs font-bold mb-1">
                  COMING SOON
                </div>
                <h2 className="text-2xl md:text-3xl font-black">Certified Prompt Engineer — APAC Edition</h2>
              </div>
            </div>

            <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
              A comprehensive certification program for professionals who want to master AI prompting across Asian markets. Covering advanced techniques for multilingual prompting, cultural context optimization, and enterprise-grade prompt engineering for 12+ AI platforms.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {[
                { icon: Globe, text: "Multilingual prompt mastery across 12+ Asian languages" },
                { icon: Zap, text: "Advanced platform-specific optimization techniques" },
                { icon: Users, text: "Enterprise prompt engineering for APAC teams" },
                { icon: Award, text: "Industry-recognized credential for AI professionals" },
              ].map((item) => (
                <div key={item.text} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-sm text-foreground">{item.text}</p>
                </div>
              ))}
            </div>

            {/* Waitlist form */}
            {waitlistSubmitted ? (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                <Check className="h-5 w-5 text-green-500" />
                <p className="text-sm font-semibold text-green-600 dark:text-green-400">You're on the waitlist! We'll email you when the program launches.</p>
              </div>
            ) : (
              <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg">
                <Input
                  type="email"
                  placeholder="Enter your email for early access"
                  value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  required
                  className="flex-1"
                />
                <Button type="submit" className="gap-2 whitespace-nowrap">
                  Join Waitlist <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            )}
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Prompt Like a Pro - Certification | PromptAndGo"
        description="Complete our interactive certification course and become a PromptAndGo Certified Creator. Learn how to write effective AI prompts and earn your certificate."
      />

      <div className="min-h-screen bg-background">
        {/* Enhanced Progress Bar */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">
                  ✓
                </div>
                <span className="text-sm font-semibold text-gradient-brand">Prompt Like a Pro</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{progress}% Complete</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-muted"
                  onClick={() => setCurrentStep(-1)}
                  aria-label="Back to certification overview"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Progress value={progress} className="h-1.5" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Step {currentStep + 1} of {TOTAL_STEPS}</span>
                <span className="font-medium text-foreground">{stepNames[currentStep]}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="pt-24 pb-12">
          <div className="container mx-auto px-4">
            {currentStep === 0 && (
              <WelcomeStep onNext={handleNameSubmit} />
            )}
            {currentStep === 1 && (
              <HowItWorksStep onNext={handleNext} onBack={handleBack} />
            )}
            {currentStep === 2 && (
              <RulesStep onNext={handleNext} onBack={handleBack} />
            )}
            {currentStep === 3 && (
              <PracticeStep onNext={handleNext} onBack={handleBack} />
            )}
            {currentStep === 4 && (
              <PracticeStep2 onNext={handleNext} onBack={handleBack} />
            )}
            {currentStep === 5 && (
              <QuizStep onComplete={handleQuizComplete} onBack={handleBack} />
            )}
            {currentStep === 6 && (
              <CertificateStep
                fullName={fullName}
                certificateId={certificateId}
                completionDate={new Date().toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
                onNext={handleNext}
              />
            )}
            {currentStep === 7 && (
              <UpgradeStep onExplore={() => navigate("/packs")} onHome={() => navigate("/")} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
