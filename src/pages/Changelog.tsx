import { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import SEO from '@/components/SEO';
import { toast } from 'sonner';

type EntryType = 'Feature' | 'Improvement' | 'Fix';

interface Entry {
  version: string;
  date: string;
  title: string;
  type: EntryType;
  changes: string[];
}

const TYPE_COLORS: Record<EntryType, string> = {
  Feature: 'bg-green-500/20 text-green-400 border-green-500/30',
  Improvement: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Fix: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
};

const ENTRIES: Entry[] = [
  { version: 'v2.4.0', date: 'Apr 9, 2026', title: 'Prompt Comparison Tool & Language Learning', type: 'Feature', changes: ['Side-by-side platform comparison for optimized prompts', 'Language Learning page with 8 Asian languages', 'Cultural tips and formality guides per language', 'Language comparison tool'] },
  { version: 'v2.3.0', date: 'Apr 8, 2026', title: 'Enterprise Page & API Documentation', type: 'Feature', changes: ['Enterprise landing page with ROI calculator', 'Full API documentation with code examples', 'Prompt Templates Marketplace with 12 templates', 'JavaScript and Python SDK documentation'] },
  { version: 'v2.2.0', date: 'Apr 5, 2026', title: 'Enhanced Dashboard & Saved Prompts', type: 'Feature', changes: ['User dashboard with stats, activity feed, and weekly chart', 'Saved Prompts page with search, sort, and grid/list views', 'Star ratings for saved prompts', 'Accessibility improvements site-wide'] },
  { version: 'v2.1.0', date: 'Apr 1, 2026', title: 'Ask Scout AI Chat Upgrade', type: 'Feature', changes: ['Full-height chat interface with typing animation', 'Context-aware mock responses', 'Clickable starter question cards', 'Character counter and "Powered by AI" badge'] },
  { version: 'v2.0.0', date: 'Mar 25, 2026', title: 'Platform 2.0 – Complete Redesign', type: 'Feature', changes: ['New dark theme design system', 'Redesigned homepage with testimonials and stats', 'Professional pricing page with billing toggle', 'About and Contact pages with office details'] },
  { version: 'v1.5.0', date: 'Mar 15, 2026', title: 'Multilingual Typing Animation', type: 'Improvement', changes: ['Hero section typing animation across Asian languages', 'Improved mobile responsiveness', 'Performance optimizations for image loading'] },
  { version: 'v1.4.0', date: 'Mar 5, 2026', title: '12 Asian Language Support', type: 'Feature', changes: ['Added support for 12+ Asian languages in optimizer', 'Asian Context toggle for cultural awareness', 'URL parameter support for pre-selecting language/platform'] },
  { version: 'v1.3.0', date: 'Feb 20, 2026', title: 'Bug Fixes & Performance', type: 'Fix', changes: ['Fixed optimizer streaming on slow connections', 'Resolved mobile overflow issues', 'Improved SEO metadata across all pages', 'Fixed dark mode contrast issues'] },
];

const Changelog = () => {
  const [filter, setFilter] = useState<'All' | EntryType>('All');
  const filtered = useMemo(() => filter === 'All' ? ENTRIES : ENTRIES.filter(e => e.type === filter), [filter]);

  return (
    <>
      <SEO title="Changelog" description="Track every improvement to PromptAndGo. New features, improvements, and fixes." />

      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="container max-w-5xl mx-auto px-4 relative text-center">
          <Badge variant="secondary" className="mb-4">Changelog</Badge>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">What's New</h1>
          <p className="text-lg text-muted-foreground">Track every improvement to PromptAndGo</p>
        </div>
      </section>

      <div className="container max-w-3xl mx-auto px-4 pb-16 space-y-8">
        {/* Filters */}
        <div className="flex gap-2">
          {(['All', 'Feature', 'Improvement', 'Fix'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${filter === f ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-muted-foreground border-border hover:border-primary/40'}`}
              aria-pressed={filter === f}
            >
              {f === 'All' ? 'All' : `${f}s`}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative space-y-0">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
          {filtered.map(entry => (
            <div key={entry.version} className="relative pl-12 pb-10">
              <div className="absolute left-2.5 top-1 w-3 h-3 rounded-full bg-primary border-2 border-background" />
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="outline" className="font-mono text-xs">{entry.version}</Badge>
                <Badge className={`text-[10px] border ${TYPE_COLORS[entry.type]}`}>{entry.type}</Badge>
                <span className="text-xs text-muted-foreground">{entry.date}</span>
              </div>
              <h3 className="font-bold mb-2">{entry.title}</h3>
              <ul className="space-y-1">
                {entry.changes.map((c, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex gap-2">
                    <span className="text-primary shrink-0">•</span> {c}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Subscribe */}
        <Card>
          <CardContent className="py-6 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1">
              <p className="font-semibold">Subscribe to Updates</p>
              <p className="text-sm text-muted-foreground">Get notified about new features and improvements.</p>
            </div>
            <form onSubmit={e => { e.preventDefault(); toast.success('Subscribed!'); }} className="flex gap-2 w-full sm:w-auto">
              <Input placeholder="you@email.com" type="email" required className="max-w-[220px]" aria-label="Email for changelog updates" />
              <Button type="submit">Subscribe</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Changelog;
