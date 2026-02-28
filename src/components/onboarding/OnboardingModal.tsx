import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

interface OnboardingPreferences {
  aiTool?: string;
  useCase?: string;
}

const AI_TOOLS = [
  { id: 'chatgpt', name: 'ChatGPT', color: '#10a37f' },
  { id: 'claude', name: 'Claude', color: '#E94560' },
  { id: 'gemini', name: 'Gemini', color: '#0F9B8E' },
  { id: 'midjourney', name: 'MidJourney', color: '#1A1A2E' },
  { id: 'perplexity', name: 'Perplexity', color: '#E94560' },
  { id: 'deepseek', name: 'DeepSeek', color: '#0F9B8E' },
  { id: 'other', name: 'Other', color: '#6b7280' },
];

const USE_CASES = [
  { id: 'marketing', name: 'Marketing & Growth', description: 'Campaigns, content, and customer acquisition' },
  { id: 'operations', name: 'Business & Productivity', description: 'Workflows, reporting, and daily operations' },
  { id: 'creative', name: 'Creative & Entrepreneurship', description: 'Design, branding, and building something new' },
  { id: 'learning', name: 'Learning & Upskilling', description: 'Education, research, and professional development' },
  { id: 'development', name: 'Software & Technical', description: 'Coding, automation, and technical writing' },
  { id: 'startup', name: 'Startup & Strategy', description: 'Planning, pitching, and scaling' },
];

interface RecommendedAction {
  title: string;
  description: string;
  link: string;
}

export const OnboardingModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [aiTool, setAiTool] = useState<string | null>(null);
  const [useCase, setUseCase] = useState<string | null>(null);
  const { user } = useSupabaseAuth();

  useEffect(() => {
    // Check if user has already onboarded
    const hasOnboarded = localStorage.getItem('pag_onboarded') === 'true';
    if (!hasOnboarded) {
      setIsOpen(true);
    }
  }, []);

  const handleNext = () => {
    if (step === 1 && aiTool) {
      setStep(2);
    } else if (step === 2 && useCase) {
      setStep(3);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep((step - 1) as 1 | 2 | 3);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('pag_onboarded', 'true');

    // Save preferences if user is logged in
    if (user && aiTool && useCase) {
      // This would typically be saved to the database via a hook or API call
      localStorage.setItem('pag_preferences', JSON.stringify({
        aiTool,
        useCase,
        timestamp: new Date().toISOString(),
      }));
    }

    setIsOpen(false);
  };

  const getRecommendedActions = (): RecommendedAction[] => {
    const actions: RecommendedAction[] = [];

    // Map use case to library category
    const categoryMap: Record<string, string> = {
      marketing: 'marketing',
      operations: 'business',
      creative: 'creative',
      learning: 'education',
      development: 'development',
      startup: 'startup',
    };

    const category = categoryMap[useCase || ''];
    if (category) {
      actions.push({
        title: `Browse ${USE_CASES.find(u => u.id === useCase)?.name} Prompts`,
        description: 'Find curated prompts for your use case',
        link: `/library?category=${category}`,
      });
    }

    actions.push({
      title: 'Try the Prompt Optimizer',
      description: 'Optimize your prompts with Scout AI',
      link: '/optimize',
    });

    actions.push({
      title: 'Explore Startup Resources',
      description: 'Discover resources for entrepreneurs',
      link: '/singapore-startups',
    });

    return actions;
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">What AI tool do you use most?</h2>
              <p className="text-muted-foreground">This helps us personalize your experience</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {AI_TOOLS.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setAiTool(tool.id)}
                  className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                    aiTool === tool.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50 bg-background'
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: tool.color }}
                  >
                    {tool.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium">{tool.name}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">What do you mainly use AI for?</h2>
              <p className="text-muted-foreground">We'll recommend relevant prompts</p>
            </div>
            <div className="space-y-2">
              {USE_CASES.map((usecase) => (
                <button
                  key={usecase.id}
                  onClick={() => setUseCase(usecase.id)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    useCase === usecase.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50 bg-background'
                  }`}
                >
                  <div className="font-medium text-foreground">{usecase.name}</div>
                  <div className="text-sm text-muted-foreground">{usecase.description}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        const recommendedActions = getRecommendedActions();
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-1">You're all set!</h2>
              <p className="text-sm text-muted-foreground">Jump in anywhere to get started:</p>
            </div>
            <div className="space-y-2">
              {recommendedActions.map((action, index) => (
                <a
                  key={index}
                  href={action.link}
                  className="block p-3 rounded-lg border border-border hover:border-primary/50 bg-background hover:bg-primary/5 transition-all text-left group"
                  onClick={(e) => {
                    e.preventDefault();
                    handleComplete();
                    setTimeout(() => {
                      window.location.href = action.link;
                    }, 100);
                  }}
                >
                  <div className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">{action.title}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </a>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) {
          localStorage.setItem('pag_onboarded', 'true');
        }
        setIsOpen(open);
      }}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center sr-only">Onboarding</DialogTitle>
        </DialogHeader>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-4">
          {[1, 2, 3].map((dot) => (
            <div
              key={dot}
              className={`h-2 rounded-full transition-all ${
                dot === step ? 'w-8 bg-primary' : 'w-2 bg-border'
              }`}
            />
          ))}
        </div>

        {/* Step content */}
        <div className="flex flex-col">
          <div className="flex-1">
            {renderStep()}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex gap-2 justify-between mt-8">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={step === 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="flex gap-2">
            {step < 3 ? (
              <Button
                onClick={handleNext}
                disabled={
                  (step === 1 && !aiTool) || (step === 2 && !useCase)
                }
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                className="flex items-center gap-2 px-6"
              >
                Let's Go!
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;
