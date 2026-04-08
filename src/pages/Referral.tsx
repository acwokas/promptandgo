import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import { Copy, Gift, Trophy, Users, Star, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const generateCode = (): string => {
  try {
    const saved = localStorage.getItem("pag_referral_code");
    if (saved) return saved;
  } catch { /* noop */ }
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const code = `PAG-ASIA-${Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")}`;
  try { localStorage.setItem("pag_referral_code", code); } catch { /* noop */ }
  return code;
};

const TIERS = [
  { name: "Bronze", min: 0, max: 2, badge: "Free Starter", color: "text-orange-400", bg: "bg-orange-400/10", icon: "🥉" },
  { name: "Silver", min: 3, max: 9, badge: "Asia Explorer", color: "text-slate-300", bg: "bg-slate-300/10", icon: "🥈", perk: "+ 10 bonus templates" },
  { name: "Gold", min: 10, max: 24, badge: "Prompt Master", color: "text-primary", bg: "bg-primary/10", icon: "🥇", perk: "+ priority support" },
  { name: "Diamond", min: 25, max: Infinity, badge: "Community Legend", color: "text-cyan-400", bg: "bg-cyan-400/10", icon: "💎", perk: "+ early access to features" },
];

const LEADERBOARD = [
  { name: "Tanaka Y.", country: "🇯🇵", referrals: 47, tier: "Diamond" },
  { name: "Li W.", country: "🇨🇳", referrals: 31, tier: "Diamond" },
  { name: "Park J.", country: "🇰🇷", referrals: 22, tier: "Gold" },
  { name: "Nguyen T.", country: "🇻🇳", referrals: 15, tier: "Gold" },
  { name: "Sharma R.", country: "🇮🇳", referrals: 11, tier: "Gold" },
];

const FAQS = [
  { q: "How does the referral program work?", a: "Share your unique referral link with friends. When they sign up using your link, both you and your friend earn rewards. The more people you refer, the higher your tier." },
  { q: "When do I receive my rewards?", a: "Rewards are credited instantly when your referral completes their sign-up. Bonus templates appear in your library within 24 hours." },
  { q: "Is there a limit to how many people I can refer?", a: "No! There's no limit. The more you refer, the higher your tier and the better your rewards." },
  { q: "Can I refer people from any country?", a: "Yes, the referral program is available globally. We especially welcome referrals from Asian markets." },
  { q: "What happens if someone unsubscribes after signing up?", a: "Your referral count and tier status are permanent. Once earned, rewards are not revoked." },
];

const MOCK_REFERRALS = 7;

const ReferralPage = () => {
  const code = useMemo(generateCode, []);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const currentTier = TIERS.find(t => MOCK_REFERRALS >= t.min && MOCK_REFERRALS <= t.max) ?? TIERS[0];
  const nextTier = TIERS[TIERS.indexOf(currentTier) + 1];

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success("Referral code copied!");
  };

  const shareUrl = `https://promptandgo.lovable.app/?ref=${code}`;

  const shareLinks = [
    { name: "WhatsApp", url: `https://wa.me/?text=${encodeURIComponent(`Check out PromptAndGo — AI prompts built for Asia! Use my referral: ${shareUrl}`)}`, icon: "💬" },
    { name: "Telegram", url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent("AI prompts built for Asia!")}`, icon: "✈️" },
    { name: "LINE", url: `https://line.me/R/share?text=${encodeURIComponent(`PromptAndGo — AI prompts built for Asia! ${shareUrl}`)}`, icon: "🟢" },
    { name: "WeChat", url: "#", icon: "🟩" },
    { name: "Email", url: `mailto:?subject=${encodeURIComponent("Check out PromptAndGo")}&body=${encodeURIComponent(`I've been using PromptAndGo for AI prompts optimized for Asian languages. Try it: ${shareUrl}`)}`, icon: "📧" },
  ];

  const progressPercent = nextTier
    ? ((MOCK_REFERRALS - currentTier.min) / (nextTier.min - currentTier.min)) * 100
    : 100;

  return (
    <>
      <Helmet>
        <title>Refer & Earn Rewards | PromptAndGo</title>
        <meta name="description" content="Share PromptAndGo with friends and earn rewards. Climb tiers from Bronze to Diamond." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero */}
        <section className="relative bg-gradient-to-b from-card to-background border-b border-border/50 py-14 md:py-20 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-10 left-[10%] text-4xl animate-[fade-in_2s_ease-out_infinite_alternate] opacity-20">🎁</div>
            <div className="absolute top-20 right-[15%] text-3xl animate-[fade-in_3s_ease-out_infinite_alternate] opacity-15">⭐</div>
            <div className="absolute bottom-10 left-[20%] text-3xl animate-[fade-in_2.5s_ease-out_infinite_alternate] opacity-20">🚀</div>
            <div className="absolute bottom-20 right-[25%] text-4xl animate-[fade-in_1.5s_ease-out_infinite_alternate] opacity-15">💎</div>
          </div>
          <div className="container max-w-4xl mx-auto px-4 text-center relative z-10">
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Share PromptAndGo, Earn Rewards</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">Invite friends to the #1 AI prompt platform for Asia and unlock exclusive perks</p>
          </div>
        </section>

        <div className="container max-w-4xl mx-auto px-4 py-10 space-y-12">
          {/* Referral Code */}
          <section className="text-center">
            <h2 className="text-lg font-semibold text-foreground mb-4">Your Referral Code</h2>
            <div className="inline-flex items-center gap-3 bg-card border border-border rounded-xl px-6 py-4">
              <span className="text-xl md:text-2xl font-mono font-bold text-primary tracking-wider">{code}</span>
              <Button variant="outline" size="sm" onClick={copyCode} className="flex items-center gap-1"><Copy className="h-4 w-4" /> Copy</Button>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {shareLinks.map(s => (
                <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-card border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors" onClick={s.name === "WeChat" ? (e) => { e.preventDefault(); toast("Copy code and share via WeChat manually"); } : undefined}>
                  <span>{s.icon}</span> {s.name}
                </a>
              ))}
            </div>
          </section>

          {/* Progress */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{currentTier.icon}</span>
                <div>
                  <p className={`font-semibold ${currentTier.color}`}>{currentTier.name} Tier</p>
                  <p className="text-xs text-muted-foreground">{currentTier.badge}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground"><strong className="text-foreground">{MOCK_REFERRALS}</strong> referrals</p>
            </div>
            <div className="h-3 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.min(progressPercent, 100)}%` }} />
            </div>
            {nextTier && (
              <p className="text-xs text-muted-foreground mt-2">{nextTier.min - MOCK_REFERRALS} more referrals to reach <strong className={nextTier.color}>{nextTier.name}</strong></p>
            )}
          </section>

          {/* Tiers */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-6 text-center">Reward Tiers</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {TIERS.map(tier => (
                <div key={tier.name} className={`p-5 rounded-xl border ${currentTier.name === tier.name ? "border-primary bg-primary/5" : "border-border bg-card"} text-center`}>
                  <span className="text-3xl block mb-2">{tier.icon}</span>
                  <h3 className={`font-bold ${tier.color}`}>{tier.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{tier.min}{tier.max === Infinity ? "+" : `-${tier.max}`} referrals</p>
                  <Badge variant="outline" className="mt-2 text-xs">{tier.badge}</Badge>
                  {tier.perk && <p className="text-xs text-primary mt-2">{tier.perk}</p>}
                </div>
              ))}
            </div>
          </section>

          {/* Leaderboard */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-6 text-center">Top Referrers</h2>
            <div className="space-y-2">
              {LEADERBOARD.map((user, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
                  <span className="text-lg font-bold text-muted-foreground w-6 text-center">{i + 1}</span>
                  <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">{user.name.charAt(0)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{user.name} {user.country}</p>
                    <p className="text-xs text-muted-foreground">{user.referrals} referrals · {user.tier}</p>
                  </div>
                  {i === 0 && <Trophy className="h-5 w-5 text-primary" />}
                </div>
              ))}
            </div>
          </section>

          {/* How it works */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-6 text-center">How It Works</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { step: "1", title: "Share Your Link", desc: "Send your unique referral code via WhatsApp, Telegram, LINE, or email." },
                { step: "2", title: "Friend Signs Up", desc: "When your friend creates a PromptAndGo account using your link." },
                { step: "3", title: "Both Earn Rewards", desc: "You climb tiers and unlock perks. Your friend gets bonus templates." },
              ].map(s => (
                <div key={s.step} className="p-5 rounded-xl bg-card border border-border text-center">
                  <div className="w-10 h-10 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center mx-auto mb-3 text-lg">{s.step}</div>
                  <h3 className="font-semibold text-foreground mb-1">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-6 text-center">Frequently Asked Questions</h2>
            <div className="space-y-2">
              {FAQS.map((faq, i) => (
                <div key={i} className="border border-border rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
                    aria-expanded={expandedFaq === i}
                  >
                    {faq.q}
                    {expandedFaq === i ? <ChevronUp className="h-4 w-4 shrink-0" /> : <ChevronDown className="h-4 w-4 shrink-0" />}
                  </button>
                  {expandedFaq === i && (
                    <div className="px-4 pb-4 text-sm text-muted-foreground animate-fade-in">{faq.a}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default ReferralPage;
