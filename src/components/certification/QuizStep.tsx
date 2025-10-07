import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle } from "lucide-react";

interface QuizStepProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

const questions = [
  {
    question: "What makes a strong prompt?",
    options: [
      "Length",
      "Clarity and context",
      "Random emojis",
      "AI jargon",
    ],
    correctIndex: 1,
  },
  {
    question: "What's the best way to control tone?",
    options: [
      "Include mood words like 'friendly, formal, witty.'",
      "Add more adjectives",
      "Ask the AI to guess your mood",
      "Use capitals",
    ],
    correctIndex: 0,
  },
  {
    question: "What's the biggest mistake people make when prompting?",
    options: [
      "Being too vague",
      "Being too creative",
      "Using too many line breaks",
      "Asking ChatGPT for coffee",
    ],
    correctIndex: 0,
  },
  {
    question: "What does a good prompt always include?",
    options: [
      "Clear task, tone, and format",
      "Fancy words",
      "Hidden meaning",
      "Code snippets",
    ],
    correctIndex: 0,
  },
  {
    question: "What's the goal of PromptAndGo?",
    options: [
      "Help you write prompts that actually work",
      "Sell typewriters",
      "Confuse AI",
      "Make toast",
    ],
    correctIndex: 0,
  },
];

export function QuizStep({ onComplete, onBack }: QuizStepProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    Array(questions.length).fill(null)
  );
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateScore();
    }
  };

  const calculateScore = () => {
    const correctCount = selectedAnswers.reduce((count, answer, index) => {
      return count + (answer === questions[index].correctIndex ? 1 : 0);
    }, 0);
    setScore(correctCount);
    setShowResults(true);
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswers(Array(questions.length).fill(null));
    setShowResults(false);
    setScore(0);
  };

  if (showResults) {
    const passed = score >= 4;

    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          {passed ? (
            <CheckCircle2 className="h-24 w-24 text-[#43B581] mx-auto mb-4" />
          ) : (
            <XCircle className="h-24 w-24 text-destructive mx-auto mb-4" />
          )}
          <h2 className="text-3xl font-bold mb-4">
            {passed ? "Congratulations!" : "Not quite there yet"}
          </h2>
          <p className="text-xl text-muted-foreground mb-2">
            You scored {score} out of {questions.length}
          </p>
        </div>

        <Card className="p-6 mb-8">
          {passed ? (
            <p className="text-lg">
              You've passed the quiz! You're ready to receive your certification.
            </p>
          ) : (
            <p className="text-lg">
              Not bad! Try again to earn your badge — you're one step away from certification.
            </p>
          )}
        </Card>

        <div className="flex justify-center gap-4">
          {!passed && (
            <Button onClick={handleRetry} variant="outline" size="lg">
              Retry Quiz
            </Button>
          )}
          {passed && (
            <Button
              onClick={() => onComplete(score)}
              className="bg-[#43B581] hover:bg-[#43B581]/90"
              size="lg"
            >
              Get My Certificate
            </Button>
          )}
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const selectedAnswer = selectedAnswers[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
        Are You Prompt-Ready?
      </h2>
      <p className="text-center text-muted-foreground mb-8">
        Answer a few quick questions to test your skills
      </p>

      <div className="mb-8">
        <div className="flex justify-between text-sm text-muted-foreground mb-4">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>{selectedAnswers.filter(a => a !== null).length} answered</span>
        </div>
      </div>

      <Card className="p-6 mb-8">
        <h3 className="text-xl font-semibold mb-6">{question.question}</h3>

        <RadioGroup value={selectedAnswer !== null ? selectedAnswer.toString() : undefined} onValueChange={(value) => handleAnswerSelect(parseInt(value))}>
          <div className="space-y-4">
            {question.options.map((option, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </Card>

      <div className="flex justify-between">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <Button
          onClick={handleNext}
          className="bg-[#4A90E2] hover:bg-[#4A90E2]/90"
          disabled={selectedAnswer === null}
        >
          {currentQuestion < questions.length - 1 ? "Next Question" : "Submit Quiz"}
        </Button>
      </div>
    </div>
  );
}
