import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Brain, Shield, Code, ArrowRight, Building2, Briefcase, GraduationCap, Heart, Landmark, Factory, Scale, ShoppingBag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import SEO from '@/components/SEO';
import { toast } from 'sonner';

const FEATURES = [
  { icon: Users, title: 'Team Management', desc: 'Role-based access control, shared prompt libraries, and real-time usage analytics across your organization.', points: ['Unlimited team members', 'Shared prompt collections', 'Usage & ROI dashboards'] },
  { icon: Brain, title: 'Custom AI Models', desc: 'Fine-tuned models trained on your industry terminology, brand voice, and compliance requirements.', points: ['Industry-specific training', 'Brand voice calibration', 'Continuous learning'] },
  { icon: Shield, title: 'Compliance & Security', desc: 'SOC 2, GDPR, and PDPA compliant with data residency options in Singapore, Tokyo, and Mumbai.', points: ['Data residency options', 'SOC 2 Type II certified', 'End-to-end encryption'] },
  { icon: Code, title: 'API Integration', desc: 'RESTful API, webhooks, SSO (SAML/OIDC), and bulk processing for seamless workflow integration.', points: ['RESTful API access', 'SSO (SAML/OIDC)', 'Webhook integrations'] },
];

const LOGOS = [
  { icon: Landmark, label: 'Finance' },
  { icon: Code, label: 'Tech' },
  { icon: Heart, label: 'Healthcare' },
  { icon: GraduationCap, label: 'Education' },
  { icon: ShoppingBag, label: 'Retail' },
  { icon: Factory, label: 'Manufacturing' },
  { icon: Building2, label: 'Government' },
  { icon: Scale, label: 'Legal' },
];

const COMPARISON = [
  { feature: 'Team members', free: '1', pro: '5', enterprise: 'Unlimited' },
  { feature: 'Optimizations/day', free: '10', pro: 'Unlimited', enterprise: 'Unlimited' },
  { feature: 'Prompt templates', free: '50+', pro: '150+', enterprise: 'Custom' },
  { feature: 'Platform support', free: '3', pro: '12', enterprise: '12+ Custom' },
  { feature: 'API access', free: '—', pro: 'Basic', enterprise: 'Full' },
  { feature: 'SSO', free: '—', pro: '—', enterprise: '✓' },
  { feature: 'Dedicated support', free: '—', pro: 'Email', enterprise: '24/7 + Account Manager' },
  { feature: 'Data residency', free: '—', pro: '—', enterprise: 'SG / JP / IN' },
];

const Enterprise = () => {
  const [teamSize, setTeamSize] = useState(25);
  const [promptsPerDay, setPromptsPerDay] = useState(50);
  const timeSaved = Math.round(teamSize * promptsPerDay * 3.5 / 60); // hours/month
  const costSaved = Math.round(timeSaved * 45); // $45/hr avg

  const handleDemo = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Demo request submitted! We\'ll be in touch within 24 hours.');
  };

  return (
    <>
      <SEO title="Enterprise AI Prompting" description="Purpose-built AI prompting platform for Asian enterprises navigating multilingual AI adoption." />

      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-background to-accent/10" />
        <div className="container max-w-5xl mx-auto px-4 relative text-center">
          <Badge variant="secondary" className="mb-4">Enterprise</Badge>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">AI Prompting at Enterprise Scale</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Purpose-built for Asian enterprises navigating multilingual AI adoption
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild><a href="#demo"><ArrowRight className="h-4 w-4 mr-2" /> Schedule a Demo</a></Button>
            <Button size="lg" variant="outline" asChild><Link to="/pricing">View Pricing</Link></Button>
          </div>
        </div>
      </section>

      <div className="container max-w-6xl mx-auto px-4 pb-16 space-y-16">
        {/* Features */}
        <section>
          <h2 className="text-2xl font-bold text-center mb-8">Enterprise-Grade Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {FEATURES.map(f => (
              <Card key={f.title} className="hover:border-primary/30 transition-colors">
                <CardContent className="pt-6">
                  <f.icon className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{f.desc}</p>
                  <ul className="space-y-1">
                    {f.points.map(p => (
                      <li key={p} className="text-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" /> {p}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Trusted by */}
        <section className="text-center">
          <h2 className="text-2xl font-bold mb-8">Trusted by Leading Asian Enterprises</h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-6">
            {LOGOS.map(l => (
              <div key={l.label} className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center">
                  <l.icon className="h-6 w-6 text-muted-foreground" />
                </div>
                <span className="text-[10px] text-muted-foreground">{l.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ROI Calculator */}
        <section>
          <h2 className="text-2xl font-bold text-center mb-8">ROI Calculator</h2>
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6 space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Team Size</label>
                  <Input type="number" value={teamSize} onChange={e => setTeamSize(Number(e.target.value) || 1)} min={1} aria-label="Team size" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Prompts per Day</label>
                  <Input type="number" value={promptsPerDay} onChange={e => setPromptsPerDay(Number(e.target.value) || 1)} min={1} aria-label="Prompts per day" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-6 text-center">
                    <p className="text-3xl font-bold text-primary">{timeSaved.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Hours saved / month</p>
                  </CardContent>
                </Card>
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-6 text-center">
                    <p className="text-3xl font-bold text-primary">${costSaved.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Estimated savings / month</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Feature Comparison */}
        <section>
          <h2 className="text-2xl font-bold text-center mb-8">Plan Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-muted">
                  <th className="text-left p-3 font-semibold">Feature</th>
                  <th className="text-center p-3 font-semibold">Free</th>
                  <th className="text-center p-3 font-semibold">Pro</th>
                  <th className="text-center p-3 font-semibold text-primary">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map(row => (
                  <tr key={row.feature} className="border-t border-border">
                    <td className="p-3">{row.feature}</td>
                    <td className="p-3 text-center text-muted-foreground">{row.free}</td>
                    <td className="p-3 text-center">{row.pro}</td>
                    <td className="p-3 text-center font-medium text-primary">{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Demo Form */}
        <section id="demo" className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Schedule a Demo</h2>
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleDemo} className="space-y-4">
                <Input placeholder="Your Name" required aria-label="Name" />
                <Input placeholder="Company" required aria-label="Company" />
                <Input type="email" placeholder="Work Email" required aria-label="Email" />
                <select className="w-full bg-muted border border-border rounded-md px-3 py-2 text-sm" aria-label="Team size range">
                  <option>1-10 people</option>
                  <option>11-50 people</option>
                  <option>51-200 people</option>
                  <option>200+ people</option>
                </select>
                <Textarea placeholder="Tell us about your needs..." rows={3} aria-label="Message" />
                <Button type="submit" className="w-full">Request Demo</Button>
              </form>
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
};

export default Enterprise;
