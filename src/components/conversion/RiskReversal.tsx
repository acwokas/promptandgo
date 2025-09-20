import { Shield, CheckCircle, Clock, Zap, ArrowRight, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export const MoneyBackGuarantee = () => (
  <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 dark:from-green-950 dark:to-emerald-950 dark:border-green-800">
    <CardContent className="p-8 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 dark:bg-green-800">
        <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
      </div>
      
      <h3 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-4">
        30-Day Money-Back Guarantee
      </h3>
      
      <p className="text-green-700 dark:text-green-300 mb-6 max-w-2xl mx-auto">
        Not completely satisfied with your results? Get a full refund within 30 days, no questions asked. 
        We're confident you'll love the time savings and results, but your satisfaction is guaranteed.
      </p>
      
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <div className="flex items-center gap-3 text-green-700 dark:text-green-300">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span className="text-sm">No questions asked</span>
        </div>
        <div className="flex items-center gap-3 text-green-700 dark:text-green-300">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span className="text-sm">Full refund</span>
        </div>
        <div className="flex items-center gap-3 text-green-700 dark:text-green-300">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span className="text-sm">Keep what you've saved</span>
        </div>
      </div>
      
      <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white">
        <Link to="/auth?mode=signup">
          Try Risk-Free Today <ArrowRight className="h-4 w-4 ml-2" />
        </Link>
      </Button>
    </CardContent>
  </Card>
);

export const ResultsGuarantee = () => (
  <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 dark:from-blue-950 dark:to-cyan-950 dark:border-blue-800">
    <CardContent className="p-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 dark:bg-blue-800">
          <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-2">
            Results Guarantee
          </h3>
          
          <p className="text-blue-700 dark:text-blue-300 mb-4">
            Save at least 5 hours per week in your first month, or we'll extend your access for free until you do. 
            Our prompts are proven to work – we guarantee it.
          </p>
          
          <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
            <Clock className="h-4 w-4" />
            <span>Average user saves 10-15 hours weekly</span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export const QualityAssurance = () => (
  <div className="space-y-6">
    <div className="text-center">
      <h3 className="text-2xl font-semibold mb-4">Why You Can Trust Our Prompts</h3>
      <p className="text-muted-foreground max-w-2xl mx-auto">
        Every prompt goes through our rigorous testing process before reaching you.
      </p>
    </div>
    
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="text-center p-6">
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-6 w-6 text-primary" />
        </div>
        <h4 className="font-semibold mb-2">Human Tested</h4>
        <p className="text-sm text-muted-foreground">
          Real professionals test every prompt before publication
        </p>
      </Card>
      
      <Card className="text-center p-6">
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
          <Star className="h-6 w-6 text-primary" />
        </div>
        <h4 className="font-semibold mb-2">Proven Results</h4>
        <p className="text-sm text-muted-foreground">
          Only prompts with documented success make it to our library
        </p>
      </Card>
      
      <Card className="text-center p-6">
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
          <Zap className="h-6 w-6 text-primary" />
        </div>
        <h4 className="font-semibold mb-2">AI Optimized</h4>
        <p className="text-sm text-muted-foreground">
          Crafted to work perfectly with ChatGPT, Claude, and more
        </p>
      </Card>
      
      <Card className="text-center p-6">
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
          <Clock className="h-6 w-6 text-primary" />
        </div>
        <h4 className="font-semibold mb-2">Always Updated</h4>
        <p className="text-sm text-muted-foreground">
          Regular updates ensure compatibility with latest AI models
        </p>
      </Card>
    </div>
  </div>
);

export const SupportGuarantee = () => (
  <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 dark:from-purple-950 dark:to-pink-950 dark:border-purple-800">
    <CardHeader>
      <CardTitle className="flex items-center gap-3 text-purple-800 dark:text-purple-200">
        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center dark:bg-purple-800">
          <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        </div>
        Unlimited Support Promise
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-purple-700 dark:text-purple-300 mb-4">
        Stuck with a prompt? Not getting the results you expected? Our team responds to every support 
        request within 24 hours with personalized help to get you back on track.
      </p>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
          <CheckCircle className="h-4 w-4" />
          <span>24-hour response guarantee</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
          <CheckCircle className="h-4 w-4" />
          <span>Personalized prompt optimization</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
          <CheckCircle className="h-4 w-4" />
          <span>Free strategy consultation calls</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

export const RiskFreeTrial = () => (
  <div className="bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 rounded-xl p-8 text-center">
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-4">Try Everything Risk-Free</h3>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Start with our free plan, upgrade when you're ready. Every paid plan comes with our 30-day money-back guarantee.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3 max-w-4xl mx-auto">
        <div className="bg-background rounded-lg border p-4">
          <Badge className="mb-3">Step 1</Badge>
          <h4 className="font-semibold mb-2">Start Free</h4>
          <p className="text-sm text-muted-foreground">
            Access 1,000+ prompts immediately. No credit card required.
          </p>
        </div>
        
        <div className="bg-background rounded-lg border p-4">
          <Badge className="mb-3">Step 2</Badge>
          <h4 className="font-semibold mb-2">See Results</h4>
          <p className="text-sm text-muted-foreground">
            Experience the time savings and quality improvements firsthand.
          </p>
        </div>
        
        <div className="bg-background rounded-lg border p-4">
          <Badge className="mb-3">Step 3</Badge>
          <h4 className="font-semibold mb-2">Upgrade When Ready</h4>
          <p className="text-sm text-muted-foreground">
            Unlock premium features with our 30-day money-back guarantee.
          </p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild size="lg" className="px-8">
          <Link to="/auth?mode=signup">
            Start Free Today <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link to="/faqs">Learn More</Link>
        </Button>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Join 5,000+ professionals who trust our proven prompts
      </p>
    </div>
  </div>
);