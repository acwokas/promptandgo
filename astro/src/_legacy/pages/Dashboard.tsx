import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import {
  Sparkles, BookOpen, GraduationCap, BookMarked,
  DollarSign, Share2, Flame, Heart, Globe, Trophy,
  FileText, Eye, CheckCircle2, Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ───── helpers ───── */
function useCountUp(target: number, active: boolean): number {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!active) return;
    let frame: number;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / 1200, 1);
      setV(Math.round(target * p));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, active]);
  return v;
}

function useInView(ref: React.RefObject<HTMLElement | null>) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);
  return visible;
}

/* ───── data ───── */
const STATS = [
  { label: "Prompts Created", value: 127, icon: FileText, color: "from-blue-500 to-cyan-400" },
  { label: "Languages Used", value: 8, icon: Globe, color: "from-emerald-500 to-teal-400" },
  { label: "Favorites Saved", value: 34, icon: Heart, color: "from-rose-500 to-pink-400" },
  { label: "Streak Days", value: 12, icon: Flame, color: "from-amber-500 to-orange-400" },
];

const ACTIVITIES = [
  { icon: Eye, text: "Viewed Korean honorifics guide", time: "2 hours ago" },
  { icon: Star, text: "Saved Mandarin business email template", time: "3 hours ago" },
  { icon: CheckCircle2, text: "Completed Thai language tutorial", time: "5 hours ago" },
  { icon: FileText, text: "Created new Japanese keigo prompt", time: "Yesterday" },
  { icon: Heart, text: "Favorited Vietnamese formal tone pack", time: "Yesterday" },
  { icon: Trophy, text: "Earned 'Multilingual Explorer' badge", time: "2 days ago" },
  { icon: BookOpen, text: "Read 'Mandarin Tone Markers' article", time: "3 days ago" },
  { icon: GraduationCap, text: "Started Indonesian cultural adaptation course", time: "4 days ago" },
];

const LANG_BARS = [
  { lang: "Japanese", pct: 85, color: "bg-rose-500", flag: "🇯🇵" },
  { lang: "Korean", pct: 72, color: "bg-blue-500", flag: "🇰🇷" },
  { lang: "Mandarin", pct: 68, color: "bg-red-500", flag: "🇨🇳" },
  { lang: "Indonesian", pct: 52, color: "bg-cyan-500", flag: "🇮🇩" },
  { lang: "Thai", pct: 45, color: "bg-amber-500", flag: "🇹🇭" },
  { lang: "Vietnamese", pct: 38, color: "bg-emerald-500", flag: "🇻🇳" },
];

const QUICK_ACTIONS = [
  { label: "New Prompt", icon: Sparkles, to: "/optimize" },
  { label: "Browse Templates", icon: BookOpen, to: "/templates" },
  { label: "Continue Tutorial", icon: GraduationCap, to: "/tutorial" },
  { label: "View Glossary", icon: BookMarked, to: "/glossary" },
  { label: "Check Pricing", icon: DollarSign, to: "/pricing" },
  { label: "Share with Friend", icon: Share2, to: "/referral" },
];

const GOAL_MESSAGES = [
  "今週もがんばりましょう！", "이번 주도 파이팅!", "加油，继续努力！",
  "สู้ๆ นะ!", "Cố lên bạn nhé!", "Semangat terus!",
];

/* ───── component ───── */
const Dashboard = () => {
  const statsRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);
  const statsVisible = useInView(statsRef);
  const barsVisible = useInView(barsRef);

  const s0 = useCountUp(STATS[0].value, statsVisible);
  const s1 = useCountUp(STATS[1].value, statsVisible);
  const s2 = useCountUp(STATS[2].value, statsVisible);
  const s3 = useCountUp(STATS[3].value, statsVisible);
  const counts = [s0, s1, s2, s3];

  const [goalMsg, setGoalMsg] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setGoalMsg((p) => (p + 1) % GOAL_MESSAGES.length), 3000);
    return () => clearInterval(id);
  }, []);

  const settings = (() => {
    try { return JSON.parse(localStorage.getItem("pag_settings") || "{}"); } catch { return {}; }
  })();
  const displayName = settings.displayName || "Prompt Explorer";
  const now = new Date();
  const jpDate = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;

  const goalDone = 5;
  const goalTotal = 7;
  const goalPct = goalDone / goalTotal;

  return (
    <>
      <SEO title="Dashboard — PromptAndGo" description="Your personal PromptAndGo dashboard with stats, activity, and language progress." noindex />

      <main>
        <section className="relative overflow-hidden bg-hero">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px]" />
          </div>
          <div className="relative z-10 container max-w-5xl mx-auto px-4 pt-16 pb-8 md:pt-24 md:pb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-2">
              Welcome back, <span className="text-primary">{displayName}</span>
            </h1>
            <p className="text-white/50 text-sm">{jpDate} — Your PromptAndGo Dashboard</p>
          </div>
        </section>

        <section className="bg-background py-10 md:py-14">
          <div className="container max-w-6xl mx-auto px-4 space-y-12">

            {/* Stats */}
            <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {STATS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="rounded-xl border border-border bg-card p-5 relative overflow-hidden">
                    <div
                      aria-hidden
                      className="absolute bottom-0 left-0 right-0 h-10 opacity-10"
                      style={{
                        background: `linear-gradient(90deg, transparent 0%, hsl(var(--primary)) 30%, hsl(var(--accent)) 70%, transparent 100%)`,
                        clipPath: "polygon(0% 80%, 15% 40%, 30% 60%, 45% 20%, 60% 50%, 75% 10%, 90% 45%, 100% 30%, 100% 100%, 0% 100%)",
                      }}
                    />
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-3xl font-black text-foreground">{counts[i]}</p>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                  </div>
                );
              })}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Activity feed */}
              <div className="lg:col-span-2 space-y-1">
                <h2 className="text-xl font-bold text-foreground mb-4">Recent Activity</h2>
                <div className="space-y-2">
                  {ACTIVITIES.map((a, i) => {
                    const Icon = a.icon;
                    return (
                      <div key={i} className="flex items-start gap-3 rounded-lg border border-border bg-card p-3.5 hover:border-primary/30 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground">{a.text}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-6">
                {/* Weekly goal */}
                <div className="rounded-xl border border-border bg-card p-6 text-center">
                  <h3 className="font-bold text-foreground mb-4">Weekly Goal</h3>
                  <div className="relative w-28 h-28 mx-auto mb-4">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" opacity={0.2} />
                      <circle
                        cx="50" cy="50" r="42" fill="none"
                        stroke="hsl(var(--primary))"
                        strokeWidth="8" strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 42}`}
                        strokeDashoffset={`${2 * Math.PI * 42 * (1 - goalPct)}`}
                        className="transition-all duration-700"
                      />
                    </svg>
                    <span className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-black text-foreground">{goalDone}</span>
                      <span className="text-xs text-muted-foreground">of {goalTotal}</span>
                    </span>
                  </div>
                  <p className="text-sm text-primary font-medium h-6" key={goalMsg}>
                    {GOAL_MESSAGES[goalMsg]}
                  </p>
                </div>

                {/* Quick actions */}
                <div>
                  <h3 className="font-bold text-foreground mb-3">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {QUICK_ACTIONS.map((a) => {
                      const Icon = a.icon;
                      return (
                        <Button
                          key={a.to}
                          asChild
                          variant="outline"
                          className="h-auto py-3 flex-col gap-1.5 border-border hover:border-primary/30 text-foreground"
                        >
                          <Link to={a.to}>
                            <Icon className="h-5 w-5 text-muted-foreground" />
                            <span className="text-xs">{a.label}</span>
                          </Link>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Language proficiency */}
            <div ref={barsRef}>
              <h2 className="text-xl font-bold text-foreground mb-4">Language Proficiency</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {LANG_BARS.map((l) => (
                  <div key={l.lang} className="rounded-xl border border-border bg-card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">{l.flag} {l.lang}</span>
                      <span className="text-xs text-muted-foreground">{l.pct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full ${l.color} transition-all duration-1000 ease-out`}
                        style={{ width: barsVisible ? `${l.pct}%` : "0%" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>
      </main>
    </>
  );
};

export default Dashboard;
