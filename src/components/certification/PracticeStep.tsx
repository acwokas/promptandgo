import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Lightbulb, CheckCircle2 } from "lucide-react";

interface PracticeStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function PracticeStep({ onNext, onBack }: PracticeStepProps) {
  const [prompt, setPrompt] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    const wordCount = prompt.trim().split(/\s+/).length;
    const hasKeywords = /\b(tone|format|for|audience|budget|style)\b/i.test(prompt);

    if (wordCount < 10) {
      setFeedback("Try adding more detail so your AI can understand better.");
    } else if (hasKeywords) {
      setFeedback("Nice! You're already thinking like a pro.");
    } else {
      setFeedback("Good start! Try including tone, format, or audience to make it even better.");
    }

    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
        Your First Prompt Challenge
      </h2>

      <Card className="p-6 mb-6 bg-[#4A90E2]/5 border-[#4A90E2]/20">
        <p className="text-lg font-medium mb-2">
          Write a prompt that helps someone plan a 3-day weekend trip.
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
        <Card className="p-4 mb-6 bg-[#F5A623]/5 border-[#F5A623]/20">
          <p className="text-sm text-muted-foreground">
            Think about goal, audience, tone, and constraints (budget, time, weather).
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
            "Plan a 3-day weekend trip to a coastal town for a couple who love food and culture. Use a friendly tone, include daily itineraries, and keep it under a £1,000 budget."
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
            className="bg-[#4A90E2] hover:bg-[#4A90E2]/90"
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
