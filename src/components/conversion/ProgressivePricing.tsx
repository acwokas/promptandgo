import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap, Users, ArrowRight, Star, Shield } from "lucide-react";
import { Link } from "react-router-dom";

interface ProgressivePricingProps {
  showFull?: boolean;
}

const ProgressivePricing = ({ showFull = false }: ProgressivePricingProps) => {
  const [currentStep, setCurrentStep] = useState<'free' | 'premium' | 'all'>(showFull ? 'all' : 'free');

  const handleNextStep = () => {
    if (currentStep === 'free') setCurrentStep('premium');
    else if (currentStep === 'premium') setCurrentStep('all');
  };

  const steps = {
    free: {
      title: "Start Free - No Credit Card Required",
      subtitle: "Join 5,000+ professionals already saving hours daily",
      cta: "Get Started FREE",
      features: [
        "3,000+ battle-tested AI prompts",
        "Copy & paste ready for any AI tool",
        "Works with ChatGPT, Claude, Gemini & more",
        "Instant platform optimization",
        "Community support"
      ]
    },
    premium: {
      title: "Ready for More? Unlock Premium Features",
      subtitle: "90% of users upgrade after seeing results",
      cta: "Upgrade to Premium",
      features: [
        "Everything in Free +",
        "5,000+ premium prompts",
        "Advanced Scout AI customization",
        "Industry-specific prompt packs",
        "Priority support",
        "Early access to new features"
      ]
    },
    all: {
      title: "Choose Your Perfect Plan",
      subtitle: "All plans include our proven prompts that save 10+ hours weekly"
    }
  };

  if (currentStep === 'all' || showFull) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start free, upgrade when you're ready. No surprises, no hidden fees.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {/* Free Plan */}
          <Card className="relative">
            <CardHeader className="text-center pb-2">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-xl">Free</CardTitle>
              <div className="text-3xl font-bold">$0</div>
              <p className="text-muted-foreground text-sm">Forever free</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>3,000+ proven AI prompts</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Platform optimization</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Basic Scout AI features</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Community support</span>
                </li>
              </ul>
              <Button asChild className="w-full" variant="outline">
                <Link to="/auth?mode=signup">Get Started FREE</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="relative border-primary shadow-lg">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground px-4 py-1">
                Most Popular
              </Badge>
            </div>
            <CardHeader className="text-center pb-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Premium</CardTitle>
              <div className="text-3xl font-bold">$12.99</div>
              <p className="text-muted-foreground text-sm">per month</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Everything in Free +</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>5,000+ premium prompts</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Advanced Scout AI</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Industry-specific packs</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Priority support</span>
                </li>
              </ul>
              <Button asChild className="w-full">
                <Link to="/auth?mode=signup&plan=premium">Start Premium Trial</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Annual Plan */}
          <Card className="relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-1">
                Best Value
              </Badge>
            </div>
            <CardHeader className="text-center pb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Annual</CardTitle>
              <div className="text-3xl font-bold">$99.50</div>
              <p className="text-muted-foreground text-sm">
                <span className="line-through">$199</span> One-time payment
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-purple-500" />
                  <span>Everything in Premium +</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-purple-500" />
                  <span>Annual updates</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-purple-500" />
                  <span>VIP community access</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-purple-500" />
                  <span>Early beta features</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-purple-500" />
                  <span>Direct founder access</span>
                </li>
              </ul>
              <Button asChild className="w-full" variant="default">
                <Link to="/auth?mode=signup&plan=annual">Get Annual Access</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Trust indicators */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span>30-day money back</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>4.9/5 user satisfaction</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span>5,000+ happy customers</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            No contracts. Cancel anytime. Your data is always yours.
          </p>
        </div>
      </div>
    );
  }

  const currentStepData = steps[currentStep];

  return (
    <div className="max-w-2xl mx-auto text-center space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-4">{currentStepData.title}</h2>
        <p className="text-lg text-muted-foreground">{currentStepData.subtitle}</p>
      </div>

      <Card className="p-8">
        <ul className="space-y-3 text-left mb-8">
          {currentStepData.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span className="text-lg">{feature}</span>
            </li>
          ))}
        </ul>

        <div className="space-y-4">
          <Button 
            size="lg" 
            className="w-full text-lg py-6"
            onClick={currentStep === 'free' ? handleNextStep : undefined}
            asChild={currentStep === 'premium'}
          >
            {currentStep === 'premium' ? (
              <Link to="/auth?mode=signup&plan=premium">
                {currentStepData.cta} <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            ) : (
              <>
                {currentStepData.cta} <ArrowRight className="h-5 w-5 ml-2" />
              </>
            )}
          </Button>
          
          {currentStep === 'free' && (
            <p className="text-sm text-muted-foreground">
              👆 Click to see what happens when you're ready for more
            </p>
          )}
          
          {currentStep === 'premium' && (
            <Button 
              variant="ghost" 
              onClick={() => setCurrentStep('all')}
              className="w-full"
            >
              Show All Plans
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ProgressivePricing;