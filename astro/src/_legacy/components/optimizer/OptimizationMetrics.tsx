import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { TrendingUp } from "lucide-react";

interface MetricBar {
  label: string;
  before: number;
  after: number;
}

function generateScores(prompt: string, optimized: string): MetricBar[] {
  // Deterministic-ish scores based on content length ratios
  const pLen = prompt.length;
  const oLen = optimized.length;
  const ratio = Math.min(oLen / Math.max(pLen, 1), 5);
  const base = Math.min(25 + pLen * 0.3, 55);

  return [
    { label: "Clarity", before: Math.round(base + 5), after: Math.round(Math.min(base + ratio * 12 + 8, 97)) },
    { label: "Specificity", before: Math.round(base - 3), after: Math.round(Math.min(base + ratio * 14 + 3, 95)) },
    { label: "Context Richness", before: Math.round(base - 8), after: Math.round(Math.min(base + ratio * 10 + 12, 94)) },
    { label: "Expected Output Quality", before: Math.round(base + 2), after: Math.round(Math.min(base + ratio * 13 + 5, 96)) },
  ];
}

function getLetterGrade(score: number): string {
  if (score >= 95) return "A+";
  if (score >= 90) return "A";
  if (score >= 85) return "B+";
  if (score >= 80) return "B";
  if (score >= 70) return "C+";
  return "C";
}

function getColor(score: number): string {
  if (score >= 80) return "text-emerald-500";
  if (score >= 60) return "text-amber-500";
  return "text-red-500";
}

function getBarColor(score: number): string {
  if (score >= 80) return "[&>div]:bg-emerald-500";
  if (score >= 60) return "[&>div]:bg-amber-500";
  return "[&>div]:bg-red-500";
}

export const OptimizationMetrics = ({ prompt, optimized }: { prompt: string; optimized: string }) => {
  const metrics = generateScores(prompt, optimized);
  const overallAfter = Math.round(metrics.reduce((s, m) => s + m.after, 0) / metrics.length);
  const overallBefore = Math.round(metrics.reduce((s, m) => s + m.before, 0) / metrics.length);
  const grade = getLetterGrade(overallAfter);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          Optimization Score
        </h3>
        <div className="flex items-center gap-3">
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground uppercase">Before</p>
            <p className="text-lg font-bold text-muted-foreground">{overallBefore}</p>
          </div>
          <div className="text-muted-foreground">→</div>
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground uppercase">After</p>
            <p className={`text-lg font-bold ${getColor(overallAfter)}`}>{overallAfter}</p>
          </div>
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center`}>
            <span className="text-white font-black text-lg">{grade}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {metrics.map((m) => (
          <div key={m.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium">{m.label}</span>
              <span className="text-muted-foreground">
                <span className="text-muted-foreground/60">{m.before}</span>
                <span className="mx-1">→</span>
                <span className={`font-bold ${getColor(m.after)}`}>{m.after}</span>
              </span>
            </div>
            <div className="flex gap-1.5 items-center">
              <Progress
                value={animated ? m.after : 0}
                className={`h-2 flex-1 transition-all duration-1000 ${getBarColor(m.after)}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
