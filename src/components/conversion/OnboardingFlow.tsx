import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, Zap, Clock, Target, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { supabase } from "@/integrations/supabase/client";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  timeEstimate: string;
  difficulty: "Easy" | "Medium" | "Advanced";
  benefits: string[];
}

const steps: OnboardingStep[] = [
  {
    id: "beginner",
    title: "New to AI Prompts?",
    description: "Perfect starting point for AI beginners. Learn the basics with prompts that work every time.",
    icon: Target,
    category: "Getting Started",
    timeEstimate: "5 minutes",
    difficulty: "Easy",
    benefits: [
      "Copy-paste ready prompts",
      "Works with free AI tools",
      "Instant results guaranteed",
      "No technical knowledge needed"
    ]
  },
  {
    id: "content-creator",
    title: "Creating Content?",
    description: "Streamline your content creation process with prompts for blogs, social media, and more.",
    icon: Zap,
    category: "Content Creation",
    timeEstimate: "2 minutes",
    difficulty: "Easy",
    benefits: [
      "Social media post templates",
      "Blog outline generators",
      "Email subject lines",
      "Video script frameworks"
    ]
  },
  {
    id: "business-pro",
    title: "Growing Your Business?",
    description: "Professional prompts for marketing, sales, strategy, and customer communication.",
    icon: Users,
    category: "Business Growth",
    timeEstimate: "3 minutes",
    difficulty: "Medium",
    benefits: [
      "Sales email sequences",
      "Marketing campaign ideas",
      "Customer service responses",
      "Business strategy frameworks"
    ]
  },
  {
    id: "advanced-user",
    title: "Already Using AI?",
    description: "Advanced prompts and power packs for experienced users looking to optimize their workflow.",
    icon: Clock,
    category: "Advanced Optimization",
    timeEstimate: "1 minute",
    difficulty: "Advanced",
    benefits: [
      "Complex workflow automation",
      "Industry-specific prompts",
      "Custom prompt engineering",
      "Advanced Scout AI features"
    ]
  }
];

const OnboardingFlow = () => {
  const { user } = useSupabaseAuth();
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'selection' | 'selected'>('selection');

  const handleStepSelect = async (stepId: string) => {
    setSelectedStep(stepId);
    setCurrentView('selected');
    
    // Award XP for completing onboarding
    if (user) {
      try {
        await supabase.functions.invoke('award-xp', {
          body: {
            userId: user.id,
            activityKey: 'complete_onboarding',
            description: `Completed onboarding: ${stepId}`,
          },
        });
      } catch (error) {
        console.error('Failed to award onboarding XP:', error);
      }
    }
  };

  const handleBack = () => {
    setCurrentView('selection');
    setSelectedStep(null);
  };

  const selectedStepData = steps.find(step => step.id === selectedStep);

  if (currentView === 'selected' && selectedStepData) {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <img 
            src="/lovable-uploads/99652d74-cac3-4e8f-ad70-8d2b77303b54.png" 
            alt="PromptAndGo Logo" 
            className="h-16 w-auto mx-auto mb-4"
          />
          <Button variant="ghost" onClick={handleBack} className="mb-4">
            ← Back to options
          </Button>
          <h2 className="text-3xl font-bold mb-4">Perfect! Let's Get You Started</h2>
          <p className="text-lg text-muted-foreground">
            Based on your selection, here's your personalized quick-start guide
          </p>
        </div>

        <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <selectedStepData.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">{selectedStepData.title}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">{selectedStepData.category}</Badge>
                  <Badge variant="outline">{selectedStepData.timeEstimate}</Badge>
                  <Badge variant={selectedStepData.difficulty === 'Easy' ? 'default' : selectedStepData.difficulty === 'Medium' ? 'secondary' : 'destructive'}>
                    {selectedStepData.difficulty}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">{selectedStepData.description}</p>
            
            <div>
              <h4 className="font-semibold mb-3">What you'll get:</h4>
              <ul className="space-y-2">
                {selectedStepData.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-background rounded-lg border p-4">
              <h4 className="font-semibold mb-2">Your Next Steps:</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                  <div>
                    <p className="font-medium">Browse recommended prompts</p>
                    <p className="text-sm text-muted-foreground">Start with our curated selection for your use case</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                  <div>
                    <p className="font-medium">Copy and paste into your AI tool</p>
                    <p className="text-sm text-muted-foreground">Works with ChatGPT, Claude, Gemini, and more</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                  <div>
                    <p className="font-medium">Save favorites for quick access</p>
                    <p className="text-sm text-muted-foreground">Build your personal prompt library</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="flex-1">
                <Link to="/library">
                  Get Started Now <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="flex-1">
                <Link to="/how-it-works">See How It Works</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick tip based on selection */}
        <Card className="bg-gradient-to-r from-accent/5 to-primary/5 border-accent/20">
          <CardContent className="p-6">
            <h4 className="font-semibold mb-2">💡 Pro Tip for {selectedStepData.category}:</h4>
            <p className="text-sm text-muted-foreground">
              {selectedStep === 'beginner' && "Start with our 'Email Marketing' prompts - they're simple but powerful and show immediate results."}
              {selectedStep === 'content-creator' && "Try the 'Content Calendar' prompt first - it'll give you a month's worth of ideas in minutes."}
              {selectedStep === 'business-pro' && "The 'Sales Email Sequence' prompt has the highest success rate among business users."}
              {selectedStep === 'advanced-user' && "Check out Scout AI for custom prompt optimization and advanced workflow automation."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center">
        <img 
          src="/lovable-uploads/99652d74-cac3-4e8f-ad70-8d2b77303b54.png" 
          alt="PromptAndGo Logo" 
          className="h-16 w-auto mx-auto mb-6"
        />
        <h2 className="text-3xl font-bold mb-4">What Brings You Here Today?</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose your path for a personalized experience. Don't worry - you'll have access to everything regardless of your choice.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {steps.map((step) => (
          <Card 
            key={step.id} 
            className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 group"
            onClick={() => handleStepSelect(step.id)}
          >
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {step.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">{step.timeEstimate}</Badge>
                    <Badge 
                      variant={step.difficulty === 'Easy' ? 'default' : step.difficulty === 'Medium' ? 'secondary' : 'destructive'}
                      className="text-xs"
                    >
                      {step.difficulty}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{step.description}</p>
              <ul className="space-y-1">
                {step.benefits.slice(0, 3).map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
                {step.benefits.length > 3 && (
                  <li className="text-xs text-muted-foreground ml-5">
                    +{step.benefits.length - 3} more benefits
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <p className="text-muted-foreground mb-4">
          Not sure? Start with our most popular prompts
        </p>
        <Button asChild variant="outline" size="lg">
          <Link to="/library">Browse All Prompts</Link>
        </Button>
      </div>
    </div>
  );
};

export default OnboardingFlow;