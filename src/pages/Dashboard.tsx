import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, Bookmark, Monitor, Flame, TrendingUp, TrendingDown,
  RotateCcw, FolderOpen, ArrowRight, Sparkles, MessageSquare,
  CreditCard, Library, Mail, Lock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import SEO from '@/components/SEO';

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const stats = [
  { label: 'Prompts Optimized', value: '247', icon: Zap, trend: '+12%', up: true },
  { label: 'Prompts Saved', value: '32', icon: Bookmark, trend: '+5', up: true },
  { label: 'Platforms Used', value: '8', icon: Monitor, trend: '0', up: true },
  { label: 'Streak Days', value: '14', icon: Flame, trend: '+3', up: true },
];

const recentActivity = [
  { prompt: 'Write a professional email to a Japanese client about project delays...', platform: 'Claude', language: 'Japanese', time: '2 hours ago' },
  { prompt: 'Create a product description for Shopee listing in Bahasa...', platform: 'ChatGPT', language: 'Bahasa', time: '5 hours ago' },
  { prompt: 'Generate a WeChat customer service response template...', platform: 'Qwen', language: 'Mandarin', time: 'Yesterday' },
  { prompt: 'Draft an investor pitch deck outline for a fintech startup...', platform: 'Gemini', language: 'English', time: '2 days ago' },
  { prompt: 'Create training materials for new employees in Korean...', platform: 'DeepSeek', language: 'Korean', time: '3 days ago' },
];

const collections = [
  { name: 'Marketing Prompts', count: 12, color: 'bg-primary/20 text-primary' },
  { name: 'Customer Service', count: 8, color: 'bg-accent/30 text-accent-foreground' },
  { name: 'Technical Writing', count: 5, color: 'bg-secondary text-secondary-foreground' },
];

const quickActions = [
  { label: 'Optimize New Prompt', icon: Zap, href: '/optimize', desc: 'AI-powered optimization' },
  { label: 'Browse Library', icon: Library, href: '/library', desc: '150+ expert prompts' },
  { label: 'Ask Scout', icon: MessageSquare, href: '/ask-scout', desc: 'AI chat assistant' },
  { label: 'View Pricing', icon: CreditCard, href: '/pricing', desc: 'Plans & billing' },
];

const weeklyData = [
  { day: 'Mon', value: 12 },
  { day: 'Tue', value: 18 },
  { day: 'Wed', value: 8 },
  { day: 'Thu', value: 24 },
  { day: 'Fri', value: 15 },
  { day: 'Sat', value: 6 },
  { day: 'Sun', value: 10 },
];

const recommended = [
  { title: 'Customer Feedback Analysis', category: 'Data & Analytics', platform: 'Claude' },
  { title: 'Social Media Calendar for LINE', category: 'Social Media', platform: 'ChatGPT' },
  { title: 'Technical API Documentation', category: 'Technical', platform: 'Gemini' },
];

const Dashboard = () => {
  const maxWeekly = useMemo(() => Math.max(...weeklyData.map(d => d.value)), []);

  return (
    <>
      <SEO title="Dashboard" description="Your personal AI prompt dashboard." noindex />

      <div className="container max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Login gate overlay */}
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex flex-col sm:flex-row items-center gap-4 py-6">
            <Lock className="h-8 w-8 text-primary shrink-0" />
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-lg font-semibold">Sign up to access your personal dashboard</h2>
              <p className="text-sm text-muted-foreground">Track your optimizations, manage collections, and unlock insights.</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Input placeholder="you@email.com" className="max-w-[220px]" aria-label="Email for signup" />
              <Button asChild><Link to="/auth">Get Started</Link></Button>
            </div>
          </CardContent>
        </Card>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{getGreeting()}, User</h1>
            <p className="text-muted-foreground">Here's your prompt engineering overview</p>
          </div>
          <Badge className="bg-primary/20 text-primary border-primary/30">Pro</Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <Card key={s.label}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <s.icon className="h-5 w-5 text-muted-foreground" />
                  <span className={`text-xs flex items-center gap-1 ${s.up ? 'text-green-600' : 'text-red-500'}`}>
                    {s.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {s.trend}
                  </span>
                </div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <section aria-label="Quick actions">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((a) => (
              <Link key={a.label} to={a.href}>
                <Card className="hover:border-primary/40 transition-colors h-full cursor-pointer">
                  <CardContent className="pt-6 text-center">
                    <a.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="font-medium text-sm">{a.label}</p>
                    <p className="text-xs text-muted-foreground">{a.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <section className="lg:col-span-2" aria-label="Recent activity">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {recentActivity.map((item, i) => (
                <Card key={i}>
                  <CardContent className="py-4 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{item.prompt}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-[10px]">{item.platform}</Badge>
                        <Badge variant="outline" className="text-[10px]">{item.language}</Badge>
                        <span className="text-xs text-muted-foreground">{item.time}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/optimize"><RotateCcw className="h-3.5 w-3.5 mr-1" /> Re-optimize</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Sidebar column */}
          <div className="space-y-6">
            {/* Weekly Progress */}
            <section aria-label="Weekly progress">
              <h2 className="text-lg font-semibold mb-4">Weekly Progress</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-end gap-2 h-32">
                    {weeklyData.map((d) => (
                      <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-[10px] text-muted-foreground">{d.value}</span>
                        <div
                          className="w-full rounded-sm bg-primary/80 transition-all"
                          style={{ height: `${(d.value / maxWeekly) * 100}%` }}
                        />
                        <span className="text-[10px] text-muted-foreground">{d.day}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Collections */}
            <section aria-label="Your collections">
              <h2 className="text-lg font-semibold mb-4">Your Collections</h2>
              <div className="space-y-3">
                {collections.map((c) => (
                  <Card key={c.name} className="hover:border-primary/30 transition-colors cursor-pointer">
                    <CardContent className="py-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-8 rounded-sm ${c.color.split(' ')[0]}`} />
                        <div>
                          <p className="text-sm font-medium">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.count} items</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm"><FolderOpen className="h-4 w-4" /></Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Recommended */}
        <section aria-label="Recommended for you">
          <h2 className="text-lg font-semibold mb-4">Recommended For You</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {recommended.map((r) => (
              <Card key={r.title} className="hover:border-primary/30 transition-colors">
                <CardContent className="pt-6">
                  <Badge variant="secondary" className="mb-2 text-[10px]">{r.category}</Badge>
                  <p className="font-medium text-sm mb-1">{r.title}</p>
                  <div className="flex items-center justify-between mt-3">
                    <Badge variant="outline" className="text-[10px]">{r.platform}</Badge>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/library"><ArrowRight className="h-3.5 w-3.5" /></Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default Dashboard;
