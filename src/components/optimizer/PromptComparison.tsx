import { useState, useMemo } from 'react';
import { Copy, Check, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PlatformData {
  id: string;
  label: string;
  color: string;
  tokens: number;
  prompt: string;
  highlights: string[];
}

const PLATFORMS: PlatformData[] = [
  {
    id: 'chatgpt', label: 'ChatGPT', color: 'bg-emerald-500', tokens: 142,
    prompt: `You are a senior marketing strategist specializing in Asian markets.\n\n**Task:** Analyze the following product launch strategy and provide actionable recommendations.\n\n**Context:** The product targets millennials in Southeast Asia, specifically Singapore and Thailand.\n\n**Output format:**\n1. SWOT analysis (table format)\n2. Three campaign concepts with KPIs\n3. Budget allocation recommendations\n\nBe specific and data-driven.`,
    highlights: ['Role prompting', 'Structured output', 'Numbered steps'],
  },
  {
    id: 'claude', label: 'Claude', color: 'bg-orange-500', tokens: 158,
    prompt: `I need help analyzing a product launch strategy for the Southeast Asian market (Singapore & Thailand), targeting millennials.\n\nPlease think through this step by step:\n- First, consider the cultural nuances of these specific markets\n- Then, analyze strengths, weaknesses, opportunities, and threats\n- Finally, suggest three creative campaign concepts\n\nI'd appreciate specific, actionable recommendations rather than generic advice. Feel free to ask clarifying questions if needed.`,
    highlights: ['Natural language', 'Chain-of-thought', 'Nuanced context'],
  },
  {
    id: 'gemini', label: 'Gemini', color: 'bg-blue-500', tokens: 135,
    prompt: `Analyze this product launch strategy for Southeast Asian millennials (SG & TH markets).\n\nProvide:\n• SWOT analysis in a clear table\n• 3 campaign concepts with measurable KPIs\n• Budget allocation by channel\n\nUse data from recent Southeast Asian consumer trends. Focus on mobile-first engagement strategies and social commerce platforms popular in the region (Shopee, Lazada, TikTok Shop).`,
    highlights: ['Concise directives', 'Data references', 'Platform-specific'],
  },
  {
    id: 'qwen', label: 'Qwen', color: 'bg-indigo-500', tokens: 151,
    prompt: `作为亚洲市场营销专家，请分析以下面向东南亚千禧一代（新加坡和泰国市场）的产品发布策略。\n\nPlease provide your analysis in English with the following structure:\n1. Market-specific SWOT analysis\n2. Three campaign concepts optimized for Asian social platforms (Xiaohongshu, LINE, Shopee)\n3. Budget recommendations considering regional pricing\n\nIncorporate cross-border e-commerce considerations and local payment preferences.`,
    highlights: ['Bilingual context', 'Asian platforms', 'Regional specifics'],
  },
  {
    id: 'deepseek', label: 'DeepSeek', color: 'bg-teal-500', tokens: 148,
    prompt: `<task>Product Launch Strategy Analysis</task>\n<market>Southeast Asia (Singapore, Thailand)</market>\n<audience>Millennials (25-40)</audience>\n\nPerform a comprehensive analysis:\n\nStep 1: Evaluate market conditions and competitive landscape\nStep 2: Conduct SWOT analysis with supporting data points\nStep 3: Propose 3 differentiated campaign strategies\nStep 4: Recommend budget allocation with ROI projections\n\nPrioritize analytical rigor and quantitative reasoning.`,
    highlights: ['XML-style tags', 'Step-by-step', 'Analytical focus'],
  },
];

export const PromptComparison = () => {
  const [selected, setSelected] = useState<string[]>(['chatgpt', 'claude']);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setSelected(prev => {
      if (prev.includes(id)) return prev.length > 1 ? prev.filter(p => p !== id) : prev;
      return prev.length >= 3 ? [...prev.slice(1), id] : [...prev, id];
    });
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const activePlatforms = useMemo(
    () => PLATFORMS.filter(p => selected.includes(p.id)),
    [selected]
  );

  const bestPlatform = useMemo(() => {
    const best = activePlatforms.reduce((a, b) => a.tokens < b.tokens ? a : b, activePlatforms[0]);
    return best;
  }, [activePlatforms]);

  return (
    <section className="space-y-6" aria-label="Platform comparison">
      <div className="flex items-center gap-3 mb-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold">Compare Platforms</h2>
        <Badge variant="secondary" className="text-[10px]">Select 2-3</Badge>
      </div>

      {/* Platform pills */}
      <div className="flex flex-wrap gap-2">
        {PLATFORMS.map(p => (
          <button
            key={p.id}
            onClick={() => toggle(p.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
              selected.includes(p.id)
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-muted text-muted-foreground border-border hover:border-primary/40'
            }`}
            aria-pressed={selected.includes(p.id)}
            aria-label={`Compare ${p.label}`}
          >
            <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${p.color}`} />
            {p.label}
          </button>
        ))}
      </div>

      {/* Side-by-side comparison */}
      <div className={`grid gap-4 ${activePlatforms.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
        {activePlatforms.map(p => (
          <Card key={p.id} className="border-border">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${p.color}`} />
                  <span className="font-semibold">{p.label}</span>
                </div>
                <Badge variant="outline" className="text-[10px]">~{p.tokens} tokens</Badge>
              </div>

              <pre className="text-sm whitespace-pre-wrap bg-muted/50 rounded-lg p-4 border border-border max-h-64 overflow-y-auto font-mono leading-relaxed">
                {p.prompt}
              </pre>

              <div className="flex flex-wrap gap-1.5">
                {p.highlights.map(h => (
                  <Badge key={h} variant="secondary" className="text-[10px]">{h}</Badge>
                ))}
              </div>

              <Button
                variant="outline" size="sm" className="w-full"
                onClick={() => handleCopy(p.prompt, p.id)}
                aria-label={`Copy ${p.label} prompt`}
              >
                {copiedId === p.id ? <Check className="h-3.5 w-3.5 mr-1.5" /> : <Copy className="h-3.5 w-3.5 mr-1.5" />}
                {copiedId === p.id ? 'Copied!' : 'Copy Prompt'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recommendation */}
      {bestPlatform && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="py-4 flex items-start gap-3">
            <Zap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Recommendation: {bestPlatform.label}</p>
              <p className="text-sm text-muted-foreground">
                For this prompt type, <strong>{bestPlatform.label}</strong> uses the fewest tokens (~{bestPlatform.tokens}) while maintaining clarity.
                Its strengths in {bestPlatform.highlights.join(', ').toLowerCase()} make it ideal for structured marketing analysis tasks.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
};
