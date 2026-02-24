import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
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
  const [currentStep, setCurrentStep] = useState(0);
  const [fullName, setFullName] = useState("");
  const [quizScore, setQuizScore] = useState(0);
  const [certificateId, setCertificateId] = useState("");

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
      // Generate certificate ID
      const certId = Math.random().toString(36).substring(2, 8).toUpperCase();
      setCertificateId(certId);

      // Save certification completion
      if (user) {
        try {
          await supabase.from("certification_completions").insert({
            user_id: user.id,
            full_name: fullName,
            certificate_id: certId,
            quiz_score: score,
            total_xp: XP_PER_STEP * TOTAL_STEPS,
          });

          // Update profile
          await supabase.from("profiles").update({
            is_certified: true,
          }).eq("id", user.id);

          // Award XP for certification completion
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

  const progress = progressMap[currentStep];

  const stepNames = ["Welcome", "How It Works", "Rules", "Practice", "Practice", "Quiz", "Certificate", "Upgrade"];

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
                  onClick={() => navigate("/")}
                  aria-label="Close certification"
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
