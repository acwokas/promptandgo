import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Lightbulb, CheckCircle2 } from "lucide-react";

interface PracticeStep2Props {
  onNext: () => void;
  onBack: () => void;
}

export function PracticeStep2({ onNext, onBack }: PracticeStep2Props) {
  const [prompt, setPrompt] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    const wordCount = prompt.trim().split(/\s+/).length;
    const hasRole = /\b(act as|you are|as a|like a)\b/i.test(prompt);
    const hasContext = /\b(tone|style|audience|format|platform)\b/i.test(prompt);

    if (wordCount < 15) {
      setFeedback("Try adding more context and specificity to guide your AI partner.");
    } else if (hasRole && hasContext) {
      setFeedback("Excellent! You're treating the AI like a creative partner with clear direction.");
    } else if (hasRole || hasContext) {
      setFeedback("Good! Try adding both a role AND specific context for even better results.");
    } else {
      setFeedback("Nice effort! Remember to give the AI a role and include tone, format, or audience.");
    }

    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
        Prompt Challenge #2
      </h2>

      <Card className="p-6 mb-6 bg-[#F5A623]/5 border-[#F5A623]/20">
        <p className="text-lg font-medium mb-2">
          Write a prompt to create an engaging social media post announcing a new eco-friendly product launch.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Remember: Give your AI a role, specify the platform, tone, and audience.
        </p>
      </Card>

      <div className="mb-6">
        <Textarea
          placeholder="Write your prompt here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-32 text-base"
          disabled={submitted}
        />
      </div>

      {!submitted && (
        <Button
          onClick={() => setShowHint(!showHint)}
          variant="ghost"
          className="mb-4"
        >
          <Lightbulb className="h-4 w-4 mr-2" />
          {showHint ? "Hide" : "Show"} Hint
        </Button>
      )}

      {showHint && !submitted && (
        <Card className="p-4 mb-6 bg-[#6DD5FA]/5 border-[#6DD5FA]/20">
          <p className="text-sm text-muted-foreground">
            Think about: What role should the AI take? (copywriter, marketer, etc.) What platform? 
            (Instagram, LinkedIn, Twitter) What tone? (exciting, professional, casual) Who's the audience?
          </p>
        </Card>
      )}

      {feedback && (
        <Card className="p-4 mb-6 bg-[#43B581]/5 border-[#43B581]/20">
          <div className="flex gap-3">
            <CheckCircle2 className="h-5 w-5 text-[#43B581] flex-shrink-0 mt-0.5" />
            <p className="font-medium">{feedback}</p>
          </div>
        </Card>
      )}

      {submitted && (
        <Card className="p-6 mb-6 bg-muted/50">
          <p className="font-semibold mb-3">Example of a great prompt:</p>
          <p className="text-sm leading-relaxed">
            "Act as an enthusiastic social media manager. Write an Instagram caption (150 characters max) 
            announcing our new bamboo water bottle launch. Use an upbeat, eco-conscious tone that 
            appeals to millennials who care about sustainability. Include a call-to-action and relevant hashtags."
          </p>
        </Card>
      )}

      <div className="flex justify-between">
        <Button onClick={onBack} variant="outline" disabled={submitted}>
          Back
        </Button>
        {!submitted ? (
          <Button
            onClick={handleSubmit}
            className="bg-[#F5A623] hover:bg-[#F5A623]/90"
            disabled={prompt.trim().length < 5}
          >
            Submit
          </Button>
        ) : (
          <Button onClick={onNext} className="bg-[#4A90E2] hover:bg-[#4A90E2]/90">
            Next: Quick Quiz
          </Button>
        )}
      </div>
    </div>
  );
}
