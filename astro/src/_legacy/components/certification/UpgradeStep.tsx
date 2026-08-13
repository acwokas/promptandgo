import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, ArrowRight, Home } from "lucide-react";

interface UpgradeStepProps {
  onExplore: () => void;
  onHome: () => void;
}

export function UpgradeStep({ onExplore, onHome }: UpgradeStepProps) {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <Sparkles className="h-20 w-20 text-[#F5A623] mx-auto mb-4 animate-pulse" />
      </div>

      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Level Up Your Prompt Skills
      </h2>

      <p className="text-xl text-muted-foreground mb-8">
        Now that you're certified, explore advanced prompt packs for your favourite category.
      </p>

      <Card className="p-8 mb-8 bg-gradient-to-br from-[#4A90E2]/5 to-[#6DD5FA]/5 border-[#4A90E2]/20">
        <h3 className="text-2xl font-semibold mb-4">What's Next?</h3>
        <ul className="text-left space-y-4 max-w-md mx-auto">
          <li className="flex gap-3">
            <span className="text-[#43B581] text-lg">✓</span>
            <span>Access exclusive prompt packs for your industry</span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#43B581] text-lg">✓</span>
            <span>Join our community of certified creators</span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#43B581] text-lg">✓</span>
            <span>Get early access to new features and prompts</span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#43B581] text-lg">✓</span>
            <span>Earn XP and unlock advanced certifications</span>
          </li>
        </ul>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={onExplore}
          size="lg"
          className="bg-[#4A90E2] hover:bg-[#4A90E2]/90"
        >
          Explore Prompt Packs
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
        <Button onClick={onHome} size="lg" variant="outline">
          <Home className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
      </div>
    </div>
  );
}
