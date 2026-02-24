import CountryInsightLayout from "@/components/market/CountryInsightLayout";
import type { CountryData } from "@/components/market/CountryInsightLayout";
import { Palette, Monitor } from "lucide-react";

const data: CountryData = {
  name: "Vietnam",
  flag: "\ud83c\uddfb\ud83c\uddf3",
  slug: "vietnam",
  audience: "425,343",
  ageRange: "24-40 years",
  seoTitle: "Vietnam Market Insights - SQREEM Intelligence | PromptAndGo",
  seoDescription: "425,343 professionals in Vietnam are actively seeking better AI prompts. SQREEM data reveals a creative-first market with high engagement in academic and content use cases.",
  headline: "425,343 creatives and professionals",
  subheadline: "Vietnam's AI prompt market is uniquely creative-driven. Freelance writers, content creators, graphic designers, and journalists make up the largest segment, all seeking to enhance their output with AI.",
  personas: [
    {
      name: "Creative & Content Professionals",
      pct: "61%",
      icon: Palette,
      color: "bg-primary",
      desc: "Freelance writers, content creators, graphic designers, and journalists constantly refining AI prompts for academic, journalistic, and digital content. They span education, social media, and creative industries with 76% engagement on academic article evaluation.",
      segments: ["Freelance Writers (30%)", "Content Creators (25%)", "Graphic Designers (23%)", "Journalists (22%)"],
    },
    {
      name: "Office & Online Learning Users",
      pct: "39%",
      icon: Monitor,
      color: "bg-accent",
      desc: "Customer service specialists, office workers, and adult online learners using AI to automate daily processes, manage digital workspaces, and upskill. Focus on productivity, health and wellness support, and task automation.",
      segments: ["Customer Service (52%)", "Office Workers (27%)", "Adult Online Learners (21%)"],
    },
  ],
  whitespace: [
    {
      title: "Academic and research prompts",
      desc: "76% engagement on evaluating academic articles and 73% on formulating research hypotheses - Vietnam's market heavily skews towards educational AI use cases.",
    },
    {
      title: "Vietnamese-language prompt templates",
      desc: "No competitor offers prompt templates tailored for Vietnamese creative professionals working across bilingual content environments.",
    },
    {
      title: "Task automation for office roles",
      desc: "41% of office users engage with message automation, suggesting demand for productivity-focused prompt packs for non-technical workers.",
    },
    {
      title: "Content creation workflows",
      desc: "Creative professionals show 37% engagement on social media content creation, yet lack structured prompt workflows designed for Southeast Asian platforms.",
    },
  ],
  keyInsight: "Vietnam's market is the most creative-leaning in APAC. While other countries skew technical or business-focused, Vietnam's prompt seekers are predominantly writers, designers, and content creators. This is an underserved audience that no competitor is specifically targeting.",
  keyInsightAttribution: "- SQREEM behavioural analysis, Vietnam market, 2025",
};

const VietnamInsights = () => <CountryInsightLayout data={data} />;
export default VietnamInsights;
