import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, X, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LANGUAGES = [
  { id: "ja", name: "Japanese", flag: "🇯🇵", native: "日本語" },
  { id: "zh", name: "Mandarin", flag: "🇨🇳", native: "中文" },
  { id: "ko", name: "Korean", flag: "🇰🇷", native: "한국어" },
  { id: "hi", name: "Hindi", flag: "🇮🇳", native: "हिन्दी" },
  { id: "th", name: "Thai", flag: "🇹🇭", native: "ไทย" },
  { id: "vi", name: "Vietnamese", flag: "🇻🇳", native: "Tiếng Việt" },
  { id: "id", name: "Bahasa Indonesia", flag: "🇮🇩", native: "Bahasa" },
  { id: "ms", name: "Bahasa Malay", flag: "🇲🇾", native: "Melayu" },
  { id: "en", name: "English", flag: "🇬🇧", native: "English" },
];

const PLATFORMS = [
  { id: "chatgpt", name: "ChatGPT", color: "#10a37f" },
  { id: "claude", name: "Claude", color: "#E94560" },
  { id: "gemini", name: "Gemini", color: "#0F9B8E" },
  { id: "copilot", name: "Copilot", color: "#0078D4" },
  { id: "perplexity", name: "Perplexity", color: "#7C3AED" },
  { id: "deepseek", name: "DeepSeek", color: "#0D9488" },
  { id: "qwen", name: "Qwen", color: "#6366F1" },
  { id: "meta-ai", name: "Meta AI", color: "#0EA5E9" },
];

const INTERESTS = [
  { id: "business", name: "Business Writing", icon: "💼" },
  { id: "creative", name: "Creative Content", icon: "🎨" },
  { id: "technical", name: "Code & Technical", icon: "💻" },
  { id: "education", name: "Education", icon: "📚" },
  { id: "marketing", name: "Marketing", icon: "📈" },
  { id: "translation", name: "Translation", icon: "🌐" },
];

type Step = 1 | 2 | 3 | 4 | 5;

export const OnboardingModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>(1);
  const [selectedLangs, setSelectedLangs] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      if (localStorage.getItem("pag_onboarded") !== "true") {
        setIsOpen(true);
      }
    } catch { /* noop */ }
  }, []);

  const dismiss = () => {
    try { localStorage.setItem("pag_onboarded", "true"); } catch { /* noop */ }
    setIsOpen(false);
  };

  const toggle = (list: string[], id: string, setter: (v: string[]) => void) => {
    setter(list.includes(id) ? list.filter(x => x !== id) : [...list, id]);
  };

  const handleComplete = () => {
    try {
      localStorage.setItem("pag_onboarded", "true");
      localStorage.setItem("pag_preferences", JSON.stringify({
        languages: selectedLangs,
        platforms: selectedPlatforms,
        interests: selectedInterests,
        timestamp: new Date().toISOString(),
      }));
    } catch { /* noop */ }
    setIsOpen(false);
    navigate("/library");
  };

  const canProceed = (): boolean => {
    switch (step) {
      case 1: return true;
      case 2: return selectedLangs.length > 0;
      case 3: return selectedPlatforms.length > 0;
      case 4: return selectedInterests.length > 0;
      case 5: return true;
      default: return true;
    }
  };

  const nextStep = () => {
    if (step < 5) setStep((step + 1) as Step);
  };
  const prevStep = () => {
    if (step > 1) setStep((step - 1) as Step);
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => { if (!open) dismiss(); }}>
      <DialogContent className="max-w-[100vw] sm:max-w-lg max-h-[100dvh] sm:max-h-[90vh] overflow-y-auto relative p-0 rounded-none sm:rounded-lg">
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors z-10"
          aria-label="Close onboarding"
        >
          <X className="h-4 w-4" />
        </button>

        <DialogHeader className="sr-only">
          <DialogTitle>Welcome to PromptAndGo</DialogTitle>
        </DialogHeader>

        <div className="p-6">
          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-6" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={5} aria-label={`Step ${step} of 5`}>
            {[1, 2, 3, 4, 5].map(dot => (
              <div
                key={dot}
                className={`h-2 rounded-full transition-all ${dot === step ? "w-8 bg-primary" : dot < step ? "w-2 bg-primary/50" : "w-2 bg-border"}`}
              />
            ))}
          </div>

          {/* Step 1: Welcome */}
          {step === 1 && (
            <div className="text-center space-y-4 py-6">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Welcome to PromptAndGo</h2>
              <p className="text-primary font-medium">AI Prompts Built for Asia</p>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Let's personalize your experience in 30 seconds. We'll recommend the best prompts for your needs.
              </p>
            </div>
          )}

          {/* Step 2: Languages */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">Choose Your Languages</h2>
                <p className="text-sm text-muted-foreground">Select the languages you work with</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.id}
                    onClick={() => toggle(selectedLangs, lang.id, setSelectedLangs)}
                    className={`p-3 rounded-lg border-2 transition-all text-center ${
                      selectedLangs.includes(lang.id)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50 bg-card"
                    }`}
                    aria-pressed={selectedLangs.includes(lang.id)}
                  >
                    <span className="text-2xl block mb-1">{lang.flag}</span>
                    <span className="text-xs font-medium text-foreground block">{lang.name}</span>
                    <span className="text-[10px] text-muted-foreground">{lang.native}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Platforms */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">Pick Your Platforms</h2>
                <p className="text-sm text-muted-foreground">Which AI platforms do you use?</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PLATFORMS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => toggle(selectedPlatforms, p.id, setSelectedPlatforms)}
                    className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                      selectedPlatforms.includes(p.id)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50 bg-card"
                    }`}
                    aria-pressed={selectedPlatforms.includes(p.id)}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: p.color }}
                    >
                      {p.name.charAt(0)}
                    </div>
                    <span className="text-xs font-medium text-foreground">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Interests */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">What Do You Need?</h2>
                <p className="text-sm text-muted-foreground">Select your areas of interest</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {INTERESTS.map(interest => (
                  <button
                    key={interest.id}
                    onClick={() => toggle(selectedInterests, interest.id, setSelectedInterests)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedInterests.includes(interest.id)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50 bg-card"
                    }`}
                    aria-pressed={selectedInterests.includes(interest.id)}
                  >
                    <span className="text-2xl block mb-2">{interest.icon}</span>
                    <span className="text-sm font-medium text-foreground">{interest.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Summary */}
          {step === 5 && (
            <div className="space-y-4 py-2">
              <div className="text-center">
                <h2 className="text-xl font-bold text-foreground mb-1">You're All Set! 🎉</h2>
                <p className="text-sm text-muted-foreground">Here's your personalized setup</p>
              </div>
              <div className="space-y-3">
                {selectedLangs.length > 0 && (
                  <div className="p-3 rounded-lg bg-card border border-border">
                    <p className="text-xs text-muted-foreground mb-1.5">Languages</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedLangs.map(id => {
                        const l = LANGUAGES.find(x => x.id === id);
                        return l ? <span key={id} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">{l.flag} {l.name}</span> : null;
                      })}
                    </div>
                  </div>
                )}
                {selectedPlatforms.length > 0 && (
                  <div className="p-3 rounded-lg bg-card border border-border">
                    <p className="text-xs text-muted-foreground mb-1.5">Platforms</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedPlatforms.map(id => {
                        const p = PLATFORMS.find(x => x.id === id);
                        return p ? <span key={id} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">{p.name}</span> : null;
                      })}
                    </div>
                  </div>
                )}
                {selectedInterests.length > 0 && (
                  <div className="p-3 rounded-lg bg-card border border-border">
                    <p className="text-xs text-muted-foreground mb-1.5">Interests</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedInterests.map(id => {
                        const i = INTERESTS.find(x => x.id === id);
                        return i ? <span key={id} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">{i.icon} {i.name}</span> : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              {step > 1 && (
                <Button variant="ghost" size="sm" onClick={prevStep} className="flex items-center gap-1">
                  <ChevronLeft className="h-4 w-4" /> Back
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              {step < 5 && (
                <Button variant="ghost" size="sm" onClick={() => { setStep(5 as Step); }} className="text-muted-foreground">
                  Skip
                </Button>
              )}
              {step < 5 ? (
                <Button size="sm" onClick={nextStep} disabled={!canProceed()} className="flex items-center gap-1">
                  {step === 1 ? "Get Started" : "Next"} <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button size="sm" onClick={handleComplete} className="px-6">
                  Start Exploring
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;
