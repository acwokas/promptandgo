import CountryInsightLayout from "@/components/market/CountryInsightLayout";
import type { CountryData } from "@/components/market/CountryInsightLayout";
import { Briefcase, Code2, Building2 } from "lucide-react";

const data: CountryData = {
  name: "Malaysia",
  flag: "\ud83c\uddf2\ud83c\uddfe",
  slug: "malaysia",
  audience: "10,969",
  ageRange: "27-55 years",
  seoTitle: "Malaysia Market Insights - SQREEM Intelligence | PromptAndGo",
  seoDescription: "10,969 professionals in Malaysia are actively seeking better AI prompts. SQREEM behavioural data reveals two distinct personas and untapped market whitespace.",
  headline: "10,969 professionals seeking better prompts",
  subheadline: "Malaysia's AI prompt market is dominated by technical professionals hungry for workflow automation, prompt engineering mastery, and career advancement through AI skills.",
  personas: [
    {
      name: "Technical & Data Professionals",
      pct: "83%",
      icon: Code2,
      color: "bg-primary",
      desc: "IT professionals, data analysts, engineers, and consultants seeking to optimise workflows through advanced AI tools. They focus on prompt engineering, automating reports, and ensuring data privacy compliance. Driven by career advancement and competitive edge.",
      segments: ["IT Professionals (41%)", "Data Analysts (28%)", "Engineers (18%)", "Consultants (12%)"],
    },
    {
      name: "Public Service & Regulated Sector",
      pct: "17%",
      icon: Building2,
      color: "bg-accent",
      desc: "Nonprofit and community workers alongside technical professionals in regulated industries. Focused on volunteer management, safeguarding sensitive data, and automating compliance reporting with AI assistance.",
      segments: ["Nonprofit & Community (66%)", "Technical & Engineering (34%)"],
    },
  ],
  whitespace: [
    {
      title: "Prompt engineering for non-tech roles",
      desc: "83% of the market is technical, but the 17% in public service and nonprofit roles lack specialised AI prompt training designed for their workflows.",
    },
    {
      title: "Compliance-focused AI tooling",
      desc: "Strong interest in data privacy (PDPA) compliance automation suggests demand for prompt templates specifically built for regulatory workflows.",
    },
    {
      title: "Career advancement through AI skills",
      desc: "Nearly 20% of technical professionals express 'I want a promotion' as a key motivator. AI skill certification presents a clear opportunity.",
    },
    {
      title: "Grammar and language capabilities",
      desc: "The highest engagement topic (38%) relates to AI grammar explanation, suggesting demand for bilingual prompt templates bridging Malay and English.",
    },
  ],
  keyInsight: "Malaysia's AI prompt market is heavily skewed towards technical professionals who see prompt engineering not as a nice-to-have, but as a career differentiator. The 20% who explicitly link AI skills to promotion prospects represent the most conversion-ready segment.",
  keyInsightAttribution: "- SQREEM behavioural analysis, Malaysia market, 2025",
};

const MalaysiaInsights = () => <CountryInsightLayout data={data} />;
export default MalaysiaInsights;
