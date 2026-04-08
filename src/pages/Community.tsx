import { useState } from 'react';
import { Users, MessageSquare, Globe, Calendar, ChevronDown, ChevronUp, Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import SEO from '@/components/SEO';
import { toast } from 'sonner';

const STATS = [
  { label: '15,000+ Members', icon: Users },
  { label: '500+ Daily Discussions', icon: MessageSquare },
  { label: '50+ Countries', icon: Globe },
];

const TOPICS = [
  { title: 'Japanese Business Prompts', desc: 'Keigo, business emails, and formal Japanese AI interactions.', discussions: 234, members: '1.2k', color: 'bg-red-500' },
  { title: 'Mandarin Content Creation', desc: 'WeChat, Xiaohongshu, and Douyin content optimization.', discussions: 189, members: '980', color: 'bg-amber-500' },
  { title: 'Korean Marketing AI', desc: 'Naver, KakaoTalk, and Korean digital marketing prompts.', discussions: 156, members: '750', color: 'bg-blue-500' },
  { title: 'Hindi Technical Writing', desc: 'Technical documentation and Hinglish business content.', discussions: 142, members: '680', color: 'bg-orange-500' },
  { title: 'Southeast Asian E-commerce', desc: 'Shopee, Lazada, Tokopedia listing and ad optimization.', discussions: 198, members: '890', color: 'bg-green-500' },
  { title: 'Cross-Platform Tips', desc: 'Strategies for optimizing prompts across multiple AI platforms.', discussions: 312, members: '1.5k', color: 'bg-purple-500' },
];

const CONTRIBUTORS = [
  { name: 'Yuki T.', initials: 'YT', flag: '🇯🇵', contributions: 87, badge: 'Gold', color: 'bg-amber-500' },
  { name: 'Wei C.', initials: 'WC', flag: '🇸🇬', contributions: 64, badge: 'Gold', color: 'bg-amber-500' },
  { name: 'Priya S.', initials: 'PS', flag: '🇮🇳', contributions: 52, badge: 'Silver', color: 'bg-slate-400' },
  { name: 'Min-jun K.', initials: 'MK', flag: '🇰🇷', contributions: 41, badge: 'Silver', color: 'bg-slate-400' },
  { name: 'Andi R.', initials: 'AR', flag: '🇮🇩', contributions: 35, badge: 'Bronze', color: 'bg-orange-700' },
];

const EVENTS = [
  { date: 'Apr 15, 2026', title: 'Mastering Japanese Keigo in AI Prompts', type: 'Webinar', desc: 'Learn how to craft prompts that produce proper keigo-level Japanese output for business contexts.' },
  { date: 'Apr 22, 2026', title: 'Building Multilingual Chatbots Workshop', type: 'Workshop', desc: 'Hands-on session building customer service chatbots that handle Thai, Vietnamese, and Bahasa.' },
  { date: 'Apr 30, 2026', title: 'AMA with PromptAndGo Founders', type: 'AMA', desc: 'Ask our founders anything about the future of AI prompting in Asia and our product roadmap.' },
];

const EVENT_COLORS: Record<string, string> = {
  Webinar: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Workshop: 'bg-green-500/20 text-green-400 border-green-500/30',
  AMA: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

const Community = () => (
  <>
    <SEO title="Community Hub" description="Join 15,000+ prompt engineers across Asia in the PromptAndGo community." />

    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
      <div className="container max-w-5xl mx-auto px-4 relative text-center">
        <Badge variant="secondary" className="mb-4">Community</Badge>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Join the PromptAndGo Community</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Connect with 10,000+ prompt engineers across Asia</p>
      </div>
    </section>

    <div className="container max-w-6xl mx-auto px-4 pb-16 space-y-16">
      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        {STATS.map(s => (
          <Card key={s.label}>
            <CardContent className="pt-6 text-center">
              <s.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-xl font-bold">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Discussion Topics */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Discussion Topics</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOPICS.map(t => (
            <Card key={t.title} className="hover:border-primary/30 transition-colors">
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${t.color}`} />
                  <h3 className="font-bold text-sm">{t.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{t.desc}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{t.discussions} discussions</span>
                  <span>{t.members} members</span>
                </div>
                <Button size="sm" variant="outline" className="w-full" onClick={() => toast.success(`Joined "${t.title}"!`)}>Join Topic</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Top Contributors */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Top Contributors This Month</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {CONTRIBUTORS.map((c, i) => (
            <Card key={c.name}>
              <CardContent className="pt-6 text-center space-y-2">
                <div className={`w-12 h-12 rounded-full ${c.color} mx-auto flex items-center justify-center text-white font-bold`}>{c.initials}</div>
                <p className="font-semibold text-sm">{c.name} {c.flag}</p>
                <p className="text-xs text-muted-foreground">{c.contributions} contributions</p>
                <Badge variant="outline" className="text-[10px]">{c.badge}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {EVENTS.map(e => (
            <Card key={e.title} className="hover:border-primary/30 transition-colors">
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{e.date}</span>
                  <Badge className={`text-[10px] border ${EVENT_COLORS[e.type]}`}>{e.type}</Badge>
                </div>
                <h3 className="font-bold text-sm">{e.title}</h3>
                <p className="text-sm text-muted-foreground">{e.desc}</p>
                <Button size="sm" className="w-full" onClick={() => toast.success('Registered!')}>Register</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Community Guidelines */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Community Guidelines</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="1"><AccordionTrigger>Be respectful and inclusive</AccordionTrigger><AccordionContent className="text-muted-foreground">Treat all members with respect regardless of language, nationality, or experience level. Our community spans 50+ countries.</AccordionContent></AccordionItem>
          <AccordionItem value="2"><AccordionTrigger>Share knowledge generously</AccordionTrigger><AccordionContent className="text-muted-foreground">Post your prompt discoveries, tips, and techniques. The community grows stronger when we share openly.</AccordionContent></AccordionItem>
          <AccordionItem value="3"><AccordionTrigger>Keep discussions on topic</AccordionTrigger><AccordionContent className="text-muted-foreground">Stay focused on AI prompting, language optimization, and related topics. Off-topic posts may be moved or removed.</AccordionContent></AccordionItem>
          <AccordionItem value="4"><AccordionTrigger>No spam or self-promotion</AccordionTrigger><AccordionContent className="text-muted-foreground">Avoid excessive promotion of products or services. Share genuinely useful resources instead.</AccordionContent></AccordionItem>
        </Accordion>
      </section>

      <div className="text-center">
        <Button size="lg" onClick={() => toast.info('Discussion forum coming soon!')}>
          <Send className="h-4 w-4 mr-2" /> Start a Discussion
        </Button>
      </div>
    </div>
  </>
);

export default Community;
