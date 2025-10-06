import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { WelcomeStep } from "@/components/certification/WelcomeStep";
import { HowItWorksStep } from "@/components/certification/HowItWorksStep";
import { RulesStep } from "@/components/certification/RulesStep";
import { PracticeStep } from "@/components/certification/PracticeStep";
import { QuizStep } from "@/components/certification/QuizStep";
import { CertificateStep } from "@/components/certification/CertificateStep";
import { UpgradeStep } from "@/components/certification/UpgradeStep";
import SEO from "@/components/SEO";

const TOTAL_STEPS = 7;
const XP_PER_STEP = 20;

const progressMap: Record<number, number> = {
  0: 0,
  1: 15,
  2: 30,
  3: 45,
  4: 65,
  5: 85,
  6: 100,
};

export default function Certification() {
  const { user } = useSupabaseAuth();
  const navigate = useNavigate();
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

          toast.success("Congratulations! You're now certified! 🎉");
        } catch (error) {
          console.error("Error saving certification:", error);
        }
      }
      handleNext();
    }
  };

  const progress = progressMap[currentStep];

  return (
    <>
      <SEO
        title="Prompt Like a Pro - Certification | PromptAndGo"
        description="Complete our interactive certification course and become a PromptAndGo Certified Creator. Learn how to write effective AI prompts and earn your certificate."
      />
      
      <div className="min-h-screen bg-background">
        {/* Progress Bar */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-card border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Prompt Like a Pro</span>
              <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
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
              <QuizStep onComplete={handleQuizComplete} onBack={handleBack} />
            )}
            {currentStep === 5 && (
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
            {currentStep === 6 && (
              <UpgradeStep onExplore={() => navigate("/packs")} onHome={() => navigate("/")} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
