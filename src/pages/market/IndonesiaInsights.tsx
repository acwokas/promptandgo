import CountryInsightLayout from "@/components/market/CountryInsightLayout";
import type { CountryData } from "@/components/market/CountryInsightLayout";
import { Briefcase, Code2 } from "lucide-react";

const data: CountryData = {
  name: "Indonesia",
  flag: "\ud83c\uddee\ud83c\udde9",
  slug: "indonesia",
  audience: "537,854",
  ageRange: "25-45 years",
  seoTitle: "Indonesia Market Insights - SQREEM Intelligence | PromptAndGo",
  seoDescription: "537,854 professionals in Indonesia are actively seeking better AI prompts. SQREEM data reveals a massive market split between business and tech professionals.",
  headline: "537,854 people want better prompts",
  subheadline: "Indonesia is the largest AI prompt market in APAC by volume. Nearly half a million business and technology professionals are actively seeking prompt optimisation solutions.",
  personas: [
    {
      name: "Business, Training & Marketing",
      pct: "51%",
      icon: Briefcase,
      color: "bg-primary",
      desc: "Digital customer service professionals, skills trainers, business consultants, and marketers. Focused on advanced AI integration, not basics. Data security and personalisation are top priorities, with 55% engagement on work efficiency through AI personalisation.",
      segments: ["Customer Service (17%)", "Skills Trainers (16%)", "Business Consultants (15%)", "Market Research (14%)", "HR Professionals (13%)", "Digital Marketing (12%)", "Corporate Training (12%)"],
    },
    {
      name: "Technology & Developers",
      pct: "49%",
      icon: Code2,
      color: "bg-accent",
      desc: "Startup entrepreneurs, software developers, product teams, and government technology workers. Driven by practical application, prompt skill development, and complex problem-solving. Strong community and collaboration orientation.",
      segments: ["Startup Entrepreneurs (26%)", "Software Developers (26%)", "Product Development (20%)", "Tech Company Employees (15%)", "Gov't Tech Sector (13%)"],
    },
  ],
  whitespace: [
    {
      title: "Advanced-only audience",
      desc: "Indonesia's business professionals show lowest interest in 'basic AI concepts', signalling they've moved past fundamentals and need advanced prompt engineering content.",
    },
    {
      title: "Data security as table stakes",
      desc: "43% engagement with AI platform security audits shows privacy isn't a feature, it's a prerequisite. Prompt tools must lead with trust.",
    },
    {
      title: "Startup prompt playbooks",
      desc: "37% of tech professionals engage with 'prompt discussion for startup' and 'AI prompt for new ideas'. Startup-specific prompt packs have clear demand.",
    },
    {
      title: "Ethical AI gap",
      desc: "Ethical AI has the lowest engagement among tech professionals (24%), suggesting an underserved educational opportunity for responsible prompt use.",
    },
  ],
  keyInsight: "Indonesia isn't learning about AI, it's already using it. This is an advanced market that has moved beyond basics and demands sophisticated, security-conscious prompt solutions. The 55% engagement rate on AI personalisation for work efficiency is the highest in APAC.",
  keyInsightAttribution: "- SQREEM behavioural analysis, Indonesia market, 2025",
};

const IndonesiaInsights = () => <CountryInsightLayout data={data} />;
export default IndonesiaInsights;
