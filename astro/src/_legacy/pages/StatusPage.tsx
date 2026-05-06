import SEO from "@/components/SEO";
import { useState } from "react";

type Status = "operational" | "degraded" | "outage";

interface Service {
  name: string;
  status: Status;
  uptime: number;
  responseMs: number;
  history: Status[];
}

const SERVICES: Service[] = [
  { name: "API Gateway", status: "operational", uptime: 99.98, responseMs: 42, history: Array(30).fill("operational" as Status) },
  { name: "Prompt Engine", status: "operational", uptime: 99.95, responseMs: 128, history: [...Array(28).fill("operational" as Status), "degraded" as Status, "operational" as Status] },
  { name: "Language Processing", status: "operational", uptime: 99.92, responseMs: 215, history: [...Array(25).fill("operational" as Status), "degraded" as Status, ...Array(4).fill("operational" as Status)] },
  { name: "Translation Service", status: "operational", uptime: 99.89, responseMs: 310, history: [...Array(20).fill("operational" as Status), "outage" as Status, ...Array(9).fill("operational" as Status)] },
  { name: "User Authentication", status: "operational", uptime: 99.99, responseMs: 35, history: Array(30).fill("operational" as Status) },
  { name: "CDN & Static Assets", status: "operational", uptime: 99.97, responseMs: 18, history: Array(30).fill("operational" as Status) },
];

const INCIDENTS = [
  { date: "Mar 28, 2026", dateAsia: "2026年3月28日", title: "Japanese IME processing delay", duration: "23 min", status: "Resolved", desc: "Keigo detection pipeline experienced elevated latency due to upstream NLP model update." },
  { date: "Mar 15, 2026", dateAsia: "2026年3月15日", title: "Korean template API timeout", duration: "45 min", status: "Resolved", desc: "Jondaetmal template endpoint returned 504 errors during peak Seoul hours." },
  { date: "Feb 22, 2026", dateAsia: "2026年2月22日", title: "Chinese character rendering issue", duration: "12 min", status: "Resolved", desc: "Simplified Chinese characters displayed incorrectly in Safari browsers." },
  { date: "Jan 30, 2026", dateAsia: "2026年1月30日", title: "Thai tone-mark processing outage", duration: "1h 10m", status: "Resolved", desc: "Tone-mark-aware prompts failed to generate for ครับ/ค่ะ particle detection." },
  { date: "Jan 10, 2026", dateAsia: "2026年1月10日", title: "Scheduled maintenance — CDN migration", duration: "2h", status: "Completed", desc: "Planned migration to new APAC edge nodes for improved regional latency." },
];

const STATUS_COLORS: Record<Status, string> = {
  operational: "bg-green-500",
  degraded: "bg-yellow-500",
  outage: "bg-red-500",
};

const STATUS_TEXT: Record<Status, string> = {
  operational: "Operational",
  degraded: "Degraded",
  outage: "Outage",
};

function getTimezoneTime(tz: string): string {
  try {
    return new Date().toLocaleTimeString("en-US", { timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false });
  } catch {
    return "--:--";
  }
}

const TIMEZONES = [
  { label: "JST", tz: "Asia/Tokyo", flag: "🇯🇵" },
  { label: "KST", tz: "Asia/Seoul", flag: "🇰🇷" },
  { label: "CST", tz: "Asia/Shanghai", flag: "🇨🇳" },
  { label: "ICT", tz: "Asia/Bangkok", flag: "🇹🇭" },
];

const StatusPage = () => {
  const [email, setEmail] = useState("");
  const allOperational = SERVICES.every((s) => s.status === "operational");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title="System Status | PromptAndGo" description="Check real-time status of PromptAndGo services including API, prompt engine, and language processing." canonical="/status" />

      {/* Hero */}
      <section className="py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">System Status</h1>
        <p className="text-muted-foreground text-lg">システム状況 | 시스템 상태 | 系统状态 | สถานะระบบ</p>
      </section>

      {/* Overall Status */}
      <section className="px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className={`rounded-xl p-6 flex items-center gap-4 ${allOperational ? "bg-green-500/10 border border-green-500/30" : "bg-yellow-500/10 border border-yellow-500/30"}`}>
            <span className={`relative flex h-4 w-4`}>
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${allOperational ? "bg-green-500" : "bg-yellow-500"}`} />
              <span className={`relative inline-flex rounded-full h-4 w-4 ${allOperational ? "bg-green-500" : "bg-yellow-500"}`} />
            </span>
            <span className="text-lg font-semibold">{allOperational ? "All Systems Operational" : "Some Systems Degraded"}</span>
          </div>
        </div>
      </section>

      {/* Timezone bar */}
      <section className="px-4 pb-8">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-4">
          {TIMEZONES.map((tz) => (
            <div key={tz.label} className="flex items-center gap-2 bg-muted/50 rounded-lg px-4 py-2">
              <span>{tz.flag}</span>
              <span className="text-sm font-medium">{tz.label}</span>
              <span className="text-sm text-muted-foreground">{getTimezoneTime(tz.tz)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="px-4 pb-16">
        <div className="max-w-4xl mx-auto space-y-4">
          {SERVICES.map((svc) => (
            <div key={svc.name} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${STATUS_COLORS[svc.status]}`} />
                  <span className="font-medium">{svc.name}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{svc.uptime}% uptime</span>
                  <span>{svc.responseMs}ms</span>
                  <span className={`font-medium ${svc.status === "operational" ? "text-green-500" : svc.status === "degraded" ? "text-yellow-500" : "text-red-500"}`}>
                    {STATUS_TEXT[svc.status]}
                  </span>
                </div>
              </div>
              {/* 30-day bar */}
              <div className="flex gap-0.5">
                {svc.history.map((day, i) => (
                  <div key={i} className={`flex-1 h-6 rounded-sm ${STATUS_COLORS[day]} opacity-80 hover:opacity-100 transition-opacity`} title={`Day ${i + 1}: ${STATUS_TEXT[day]}`} />
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>30 days ago</span>
                <span>Today</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Incidents */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Incident History</h2>
          <div className="space-y-4">
            {INCIDENTS.map((inc, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">{inc.title}</h3>
                    <p className="text-xs text-muted-foreground">{inc.date} · {inc.dateAsia}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{inc.duration}</span>
                    <span className="text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full">{inc.status}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{inc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe */}
      <section className="py-16 px-4">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-xl font-bold mb-4">Subscribe to Updates</h2>
          <p className="text-sm text-muted-foreground mb-4">Get notified about system status changes</p>
          <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="flex-1 h-10 px-4 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:border-primary" />
            <button type="submit" className="h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default StatusPage;
