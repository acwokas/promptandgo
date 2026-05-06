import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MapPin, Clock, ArrowRight, Wifi, BookOpen, Plane, Timer } from "lucide-react";

const JOBS = [
  { title: "Senior Prompt Engineer", location: "Tokyo, Japan 🇯🇵", type: "Full-time", desc: "Design and optimize AI prompts for Japanese and CJK languages. Deep expertise in keigo, NLP, and prompt engineering required. Work with our linguistics team to expand coverage." },
  { title: "Full-Stack Developer", location: "Remote — Asia", type: "Full-time", desc: "Build and scale our prompt optimization platform. React, TypeScript, Supabase stack. Experience with multilingual applications and CJK text processing preferred." },
  { title: "Content Strategist — Korean Market", location: "Seoul, South Korea 🇰🇷", type: "Full-time", desc: "Lead content strategy for the Korean market. Create prompt templates, marketing copy, and educational content in Korean. Native-level jondaetmal proficiency essential." },
  { title: "AI Research Intern", location: "Singapore 🇸🇬", type: "Intern (6 months)", desc: "Research multilingual NLP models for Asian language prompt optimization. Support the team with benchmarking, dataset curation, and model evaluation." },
];

const PERKS = [
  { icon: Wifi, title: "Remote-First", desc: "Work from anywhere in Asia. We have team members across 6 countries." },
  { icon: BookOpen, title: "Language Learning Budget", desc: "$1,500/year for language courses. Learn any Asian language on us." },
  { icon: Plane, title: "Conference Attendance", desc: "Annual budget for AI and NLP conferences across the Asia-Pacific region." },
  { icon: Timer, title: "Flexible Hours", desc: "We trust you to manage your time. Core hours overlap across Asian timezones." },
];

const Careers = () => (
  <div className="min-h-screen bg-background text-foreground">
    <SEO title="Careers at PromptAndGo | Join Our Team" description="Join PromptAndGo and help bridge AI and Asian languages. Open roles in Tokyo, Seoul, Singapore and remote across Asia." canonical="/careers" />

    {/* Hero */}
    <section className="py-20 px-4 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Join Our Team</h1>
        <p className="text-muted-foreground text-lg mb-2">チームに参加 · 팀에 합류하세요 · 加入我们的团队</p>
        <p className="text-muted-foreground max-w-2xl mx-auto mt-4">We're building the only AI prompt platform designed for Asia's languages, scripts, and cultural contexts. Join us in making AI work for everyone, not just English speakers.</p>
      </div>
    </section>

    {/* Open Roles */}
    <section className="px-4 pb-16">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-8">Open Positions</h2>
        <div className="space-y-4">
          {JOBS.map((job) => (
            <div key={job.title} className="rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{job.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {job.location}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {job.type}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">{job.desc}</p>
                </div>
                <Link to="/contact">
                  <Button className="gap-2 shrink-0">Apply Now <ArrowRight className="h-4 w-4" /></Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Benefits */}
    <section className="py-16 px-4 bg-muted/20">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-12">Why Work With Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PERKS.map((perk) => (
            <div key={perk.title} className="rounded-xl border border-border bg-card p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"><perk.icon className="h-6 w-6 text-primary" /></div>
              <h3 className="font-semibold mb-2">{perk.title}</h3>
              <p className="text-sm text-muted-foreground">{perk.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Open Application */}
    <section className="py-16 px-4 text-center">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Don't See Your Role?</h2>
        <p className="text-muted-foreground mb-6">We're always looking for talented people passionate about AI and Asian languages. Send us an open application.</p>
        <Link to="/contact"><Button size="lg" className="gap-2">Send Open Application <ArrowRight className="h-4 w-4" /></Button></Link>
      </div>
    </section>
  </div>
);

export default Careers;
