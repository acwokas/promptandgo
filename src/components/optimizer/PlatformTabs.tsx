import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlatformTabsProps {
  originalPrompt: string;
  optimizedPrompt: string;
  copiedId: string | null;
  onCopy: (text: string, id: string) => void;
}

const PLATFORM_OPTIMIZATIONS = [
  {
    id: "chatgpt",
    label: "ChatGPT",
    color: "bg-emerald-500",
    badge: "System/User structure",
    transform: (original: string) =>
      `**System:** You are an expert assistant. Follow all instructions precisely and format your response clearly.\n\n**User:** ${original}\n\nPlease structure your response with:\n1. Clear numbered sections\n2. Bold key terms using **markdown**\n3. A brief summary at the end\n\nKeep the output focused, actionable, and under 500 words.`,
  },
  {
    id: "claude",
    label: "Claude",
    color: "bg-orange-500",
    badge: "XML tags & reasoning",
    transform: (original: string) =>
      `<context>\nYou are helping with the following task. Think carefully about the nuances and provide thoughtful analysis.\n</context>\n\n<task>\n${original}\n</task>\n\n<instructions>\n- Think through this step-by-step before responding\n- Consider multiple perspectives and edge cases\n- Provide specific, actionable recommendations\n- Be direct and concise while being thorough\n</instructions>\n\n<output_format>\nStructure your response with clear headers and bullet points. Include a "Key Takeaway" section at the end.\n</output_format>`,
  },
  {
    id: "gemini",
    label: "Gemini",
    color: "bg-blue-500",
    badge: "Google-style instructions",
    transform: (original: string) =>
      `Task: ${original}\n\nInstructions:\n• Be specific and factual in your response\n• Use data and examples where possible\n• Organize information in a clear hierarchy\n• Cross-reference with current knowledge\n• Provide actionable next steps\n\nFormat: Use headers, bullet points, and tables where appropriate. Keep the response comprehensive but scannable.\n\nConstraints: Ensure accuracy, cite reasoning, and flag any assumptions made.`,
  },
  {
    id: "qwen",
    label: "Qwen",
    color: "bg-indigo-500",
    badge: "Chinese context optimized",
    transform: (original: string) =>
      `任务说明 / Task Description:\n${original}\n\n优化要求 / Optimization Requirements:\n• 如果涉及中文内容，请使用地道的中文表达\n• Consider both Chinese and international market perspectives\n• 结合亚洲商业文化和惯例 / Apply Asian business context\n• Use appropriate formality level (适当的正式程度)\n• Provide bilingual key terms where helpful\n\n输出格式 / Output Format:\nStructured response with clear sections. Include practical examples relevant to Asian markets.`,
  },
  {
    id: "deepseek",
    label: "DeepSeek",
    color: "bg-teal-500",
    badge: "Technical & analytical",
    transform: (original: string) =>
      `<problem>\n${original}\n</problem>\n\n<approach>\nAnalyze this systematically:\n1. Break down the core requirements\n2. Identify key constraints and variables\n3. Apply logical reasoning chain\n4. Validate the solution approach\n</approach>\n\n<requirements>\n- Provide detailed technical analysis\n- Include code snippets or structured data where relevant\n- Show your reasoning process step-by-step\n- Highlight potential edge cases or failure modes\n- Suggest optimizations and alternatives\n</requirements>\n\n<output>\nStructured technical response with clear methodology.\n</output>`,
  },
  {
    id: "ernie",
    label: "Ernie Bot",
    color: "bg-red-500",
    badge: "Baidu AI / Chinese business",
    transform: (original: string) =>
      `【任务】\n${original}\n\n【要求】\n1. 请使用专业的中文商务语言回答\n2. 结合中国市场的实际情况和案例\n3. 考虑中国消费者的偏好和行为习惯\n4. 如涉及数据，请引用国内权威来源\n5. 提供可直接执行的建议方案\n\n【输出格式】\n• 概述（50字以内）\n• 详细分析（分点论述）\n• 执行建议（3-5条）\n• 注意事项\n\n【补充说明】\n请确保内容符合中国法规要求，适合在国内平台发布。`,
  },
];

export const PlatformTabs = ({ originalPrompt, optimizedPrompt, copiedId, onCopy }: PlatformTabsProps) => {
  const [activeTab, setActiveTab] = useState("chatgpt");
  const active = PLATFORM_OPTIMIZATIONS.find((p) => p.id === activeTab)!;
  const optimized = active.transform(originalPrompt);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold flex items-center gap-2">
        🔀 Platform-Specific Versions
      </h3>
      <p className="text-sm text-muted-foreground">
        See how the same prompt should be structured differently for each AI platform.
      </p>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5">
        {PLATFORM_OPTIMIZATIONS.map((p) => (
          <button
            key={p.id}
            onClick={() => setActiveTab(p.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === p.id
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
          >
            <div className={`w-4 h-4 rounded ${p.color} flex items-center justify-center`}>
              <span className="text-white text-[7px] font-black">{p.label.slice(0, 2).toUpperCase()}</span>
            </div>
            {p.label}
          </button>
        ))}
      </div>

      {/* Active tab content */}
      <div className="rounded-xl border border-primary/20 bg-card p-5 space-y-3 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-md ${active.color} flex items-center justify-center`}>
              <span className="text-white text-[9px] font-black">{active.label.slice(0, 2).toUpperCase()}</span>
            </div>
            <span className="font-bold text-sm">{active.label}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
              {active.badge}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => onCopy(optimized, `tab-${active.id}`)}
          >
            {copiedId === `tab-${active.id}` ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copiedId === `tab-${active.id}` ? "Copied!" : "Copy"}
          </Button>
        </div>
        <pre className="text-sm whitespace-pre-wrap text-muted-foreground leading-relaxed font-sans bg-muted/30 rounded-lg p-4 max-h-[400px] overflow-y-auto">
          {optimized}
        </pre>
      </div>
    </div>
  );
};
