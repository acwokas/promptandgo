import CountryInsightLayout from "@/components/market/CountryInsightLayout";
import type { CountryData } from "@/components/market/CountryInsightLayout";
import { Briefcase, Palette, Code2, GraduationCap, Building2 } from "lucide-react";

const data: CountryData = {
  name: "Australia",
  flag: "\ud83c\udde6\ud83c\uddfa",
  slug: "australia",
  audience: "104,647",
  ageRange: "22-55 years",
  seoTitle: "Australia Market Insights - SQREEM Intelligence | PromptAndGo",
  seoDescription: "104,647 professionals in Australia are actively seeking better AI prompts. SQREEM data reveals five distinct personas across business, creative, technical, education, and public service sectors.",
  headline: "104,647 professionals, five distinct personas",
  subheadline: "Australia has the most diverse AI prompt market in APAC. Five clear segments span business, creative, technical, education, and public service - each with unique needs and engagement patterns.",
  personas: [
    {
      name: "Business & Corporate Professionals",
      pct: "43%",
      icon: Briefcase,
      color: "bg-primary",
      desc: "Driven by efficiency and competitive advantage. Focused on leadership development, strategic decision-making, and continuous learning. They blend professional growth with AI-powered productivity gains.",
      segments: ["Strategic planning", "Industry insights", "Leadership coaching", "Python for business"],
    },
    {
      name: "Creative & Content Individuals",
      pct: "41%",
      icon: Palette,
      color: "bg-accent",
      desc: "Passionate about refining creative processes and optimising content output. They blend artistic exploration with data-driven insights, with 58% engagement on creative writing prompts and 51% on influencer marketing.",
      segments: ["Creative writing (58%)", "Influencer marketing (51%)", "Social trends (48%)", "Social captions (48%)"],
    },
    {
      name: "Technical & Analytical Users",
      pct: "24%",
      icon: Code2,
      color: "bg-amber-500",
      desc: "Optimising AI prompts for workflow automation and extracting actionable insights from data. The highest-engagement segment with 77% interest in AI for business analysis and 53% on automating repetitive tasks.",
      segments: ["Business analysis (77%)", "Task automation (53%)", "Fraud detection (48%)", "Strategic planning (48%)"],
    },
    {
      name: "Education & Research",
      pct: "16%",
      icon: GraduationCap,
      color: "bg-foreground",
      desc: "Refining AI for research, teaching, and academic integrity. Focus on crafting effective prompts for classroom engagement, data analysis, and market research.",
      segments: ["Financial literacy (55%)", "Business analysis (41%)", "Data analysis (31%)", "Market research (29%)"],
    },
    {
      name: "Public Service & Nonprofit",
      pct: "4%",
      icon: Building2,
      color: "bg-primary/60",
      desc: "Finding ways to optimise AI prompts for workflow efficiency in public sector service delivery. Smallest but growing segment focused on professional development and business analysis.",
      segments: ["Professional development (36%)", "Business analysis (29%)", "Service delivery", "Innovation"],
    },
  ],
  whitespace: [
    {
      title: "Programming and coding prompts",
      desc: "20% unsaturated market opportunity. Technical users show high demand but current solutions don't adequately serve prompt optimisation for code-specific workflows.",
    },
    {
      title: "Creative writing AI tools",
      desc: "14% unsaturated and the second-largest whitespace gap. Australia's creative segment is nearly as large as its business segment but less well-served.",
    },
    {
      title: "Research and information gathering",
      desc: "6% unsaturated. Education and research professionals lack prompt templates designed for academic workflows and research methodology.",
    },
    {
      title: "Content creation infrastructure",
      desc: "7% unsaturated. Despite high engagement (48-58%) on content topics, dedicated prompt solutions for Australian content creators remain scarce.",
    },
  ],
  keyInsight: "Australia is the most balanced market in APAC, with no single persona dominating. The near-equal split between business (43%) and creative (41%) segments means any prompt solution must serve both analytical and artistic use cases, unlike the tech-heavy markets elsewhere in the region.",
  keyInsightAttribution: "- SQREEM behavioural analysis, Australia market, 2025",
};

const AustraliaInsights = () => <CountryInsightLayout data={data} />;
export default AustraliaInsights;
