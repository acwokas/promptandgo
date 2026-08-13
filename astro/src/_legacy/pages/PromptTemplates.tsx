import { useState, useMemo } from 'react';
import { Star, Bookmark, ArrowUpDown, Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { toast } from 'sonner';

type SortKey = 'popular' | 'newest' | 'rating' | 'uses';

interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  languages: string[];
  platforms: string[];
  uses: number;
  rating: number;
}

const CATEGORIES = ['All', 'Business', 'Marketing', 'Education', 'Creative', 'Technical', 'Legal', 'Healthcare'];
const LANG_OPTIONS = ['All Languages', 'Japanese', 'Mandarin', 'Korean', 'Hindi', 'Thai', 'Bahasa', 'Vietnamese', 'Tagalog'];
const PLAT_OPTIONS = ['All Platforms', 'ChatGPT', 'Claude', 'Gemini', 'Qwen', 'DeepSeek', 'Ernie Bot'];

const CAT_COLORS: Record<string, string> = {
  Business: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Marketing: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  Education: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Creative: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Technical: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  Legal: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  Healthcare: 'bg-green-500/20 text-green-400 border-green-500/30',
};

const TEMPLATES: Template[] = [
  { id: '1', title: 'Japanese Business Email', description: 'Formal keigo-compliant business email templates with proper seasonal greetings and hierarchical language.', category: 'Business', languages: ['Japanese'], platforms: ['Claude', 'ChatGPT'], uses: 2400, rating: 4.9 },
  { id: '2', title: 'Mandarin Marketing Copy', description: 'Conversion-optimized ad copy for Xiaohongshu, WeChat, and Douyin with native tone and cultural hooks.', category: 'Marketing', languages: ['Mandarin'], platforms: ['Qwen', 'ChatGPT'], uses: 3100, rating: 4.8 },
  { id: '3', title: 'Korean Customer Service', description: 'KakaoTalk and Naver customer response templates with appropriate honorific levels.', category: 'Business', languages: ['Korean'], platforms: ['ChatGPT', 'Claude'], uses: 1800, rating: 4.7 },
  { id: '4', title: 'Hindi Legal Document', description: 'Legal notice and contract clause templates in formal Hindi with Devanagari script precision.', category: 'Legal', languages: ['Hindi'], platforms: ['Gemini', 'ChatGPT'], uses: 950, rating: 4.6 },
  { id: '5', title: 'Thai Social Media', description: 'LINE and Facebook engagement content with proper politeness particles and trending Thai hashtag formats.', category: 'Marketing', languages: ['Thai'], platforms: ['ChatGPT'], uses: 1500, rating: 4.5 },
  { id: '6', title: 'Vietnamese Product Description', description: 'Shopee and Tiki listing copy optimized for Vietnamese search behavior and purchase triggers.', category: 'Marketing', languages: ['Vietnamese'], platforms: ['ChatGPT', 'Gemini'], uses: 2100, rating: 4.7 },
  { id: '7', title: 'Cross-Platform SEO Content', description: 'Multilingual SEO article templates optimized for Baidu, Naver, Google, and Yahoo Japan simultaneously.', category: 'Technical', languages: ['Mandarin', 'Korean', 'Japanese'], platforms: ['ChatGPT', 'Claude', 'Qwen'], uses: 3500, rating: 4.9 },
  { id: '8', title: 'Multilingual Meeting Notes', description: 'Auto-structured meeting minutes with action items, formatted for cross-cultural teams across Asian offices.', category: 'Business', languages: ['Japanese', 'Mandarin', 'Korean'], platforms: ['Claude', 'ChatGPT'], uses: 2800, rating: 4.8 },
  { id: '9', title: 'Asian Market Research', description: 'Comprehensive market analysis prompt covering consumer behavior, regulations, and trends in APAC markets.', category: 'Business', languages: ['Mandarin', 'Hindi', 'Bahasa'], platforms: ['ChatGPT', 'Gemini', 'DeepSeek'], uses: 1600, rating: 4.6 },
  { id: '10', title: 'Cultural Sensitivity Check', description: 'Review content for cultural appropriateness across Asian markets before publication or campaign launch.', category: 'Creative', languages: ['Japanese', 'Mandarin', 'Korean', 'Hindi', 'Thai'], platforms: ['Claude', 'ChatGPT'], uses: 1200, rating: 4.8 },
  { id: '11', title: 'Bahasa E-commerce Listing', description: 'Tokopedia and Shopee product listing copy with Indonesian SEO keywords and local payment references.', category: 'Marketing', languages: ['Bahasa'], platforms: ['ChatGPT', 'Qwen'], uses: 1900, rating: 4.5 },
  { id: '12', title: 'Tagalog Customer Support', description: 'Taglish customer support scripts for Philippine market with warm, relationship-focused messaging.', category: 'Healthcare', languages: ['Tagalog'], platforms: ['ChatGPT', 'Gemini'], uses: 800, rating: 4.4 },
];

const formatUses = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

const PromptTemplates = () => {
  const [category, setCategory] = useState('All');
  const [language, setLanguage] = useState('All Languages');
  const [platform, setPlatform] = useState('All Platforms');
  const [sortBy, setSortBy] = useState<SortKey>('popular');
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    let items = [...TEMPLATES];
    if (category !== 'All') items = items.filter(t => t.category === category);
    if (language !== 'All Languages') items = items.filter(t => t.languages.includes(language));
    if (platform !== 'All Platforms') items = items.filter(t => t.platforms.includes(platform));
    switch (sortBy) {
      case 'rating': items.sort((a, b) => b.rating - a.rating); break;
      case 'uses': items.sort((a, b) => b.uses - a.uses); break;
      case 'newest': items.reverse(); break;
      default: items.sort((a, b) => b.uses - a.uses);
    }
    return items;
  }, [category, language, platform, sortBy]);

  const toggleSave = (id: string) => {
    setSaved(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); toast.info('Removed from saved'); }
      else { next.add(id); toast.success('Saved!'); }
      return next;
    });
  };

  return (
    <>
      <SEO title="Prompt Templates Marketplace" description="Ready-to-use AI prompt templates crafted for Asian markets, languages, and platforms." />

      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="container max-w-5xl mx-auto px-4 relative text-center">
          <Badge variant="secondary" className="mb-4">12 Templates</Badge>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Prompt Templates Marketplace</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ready-to-use prompts crafted for Asian markets, languages, and platforms
          </p>
        </div>
      </section>

      <div className="container max-w-6xl mx-auto px-4 pb-16 space-y-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${category === c ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-muted-foreground border-border hover:border-primary/40'}`}
              aria-pressed={category === c}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <select value={language} onChange={e => setLanguage(e.target.value)} className="bg-muted border border-border rounded-md px-3 py-2 text-sm" aria-label="Filter by language">
            {LANG_OPTIONS.map(l => <option key={l}>{l}</option>)}
          </select>
          <select value={platform} onChange={e => setPlatform(e.target.value)} className="bg-muted border border-border rounded-md px-3 py-2 text-sm" aria-label="Filter by platform">
            {PLAT_OPTIONS.map(p => <option key={p}>{p}</option>)}
          </select>
          <Button variant="outline" size="sm" onClick={() => setSortBy(s => s === 'popular' ? 'rating' : s === 'rating' ? 'uses' : s === 'uses' ? 'newest' : 'popular')} aria-label="Change sort">
            <ArrowUpDown className="h-4 w-4 mr-1" />
            {sortBy === 'popular' ? 'Popular' : sortBy === 'rating' ? 'Highest Rated' : sortBy === 'uses' ? 'Most Used' : 'Newest'}
          </Button>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(t => (
            <Card key={t.id} className="hover:border-primary/30 transition-colors group">
              <CardContent className="pt-6 space-y-3">
                <Badge className={`text-[10px] border ${CAT_COLORS[t.category] || ''}`}>{t.category}</Badge>
                <h3 className="font-bold">{t.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{t.description}</p>

                <div className="flex flex-wrap gap-1">
                  {t.languages.map(l => <Badge key={l} variant="outline" className="text-[10px]">{l}</Badge>)}
                </div>
                <div className="flex flex-wrap gap-1">
                  {t.platforms.map(p => <Badge key={p} variant="secondary" className="text-[10px]">{p}</Badge>)}
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatUses(t.uses)} uses</span>
                  <span className="flex items-center gap-0.5">
                    <Star className="h-3 w-3 fill-primary text-primary" /> {t.rating}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1" onClick={() => toast.success('Template copied!')}>Use Template</Button>
                  <Button variant="ghost" size="icon" onClick={() => toggleSave(t.id)} aria-label="Save template">
                    <Bookmark className={`h-4 w-4 ${saved.has(t.id) ? 'fill-primary text-primary' : ''}`} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && <p className="text-center text-muted-foreground py-12">No templates match your filters.</p>}

        <div className="text-center pt-8">
          <Button variant="outline" size="lg" onClick={() => toast.info('Template submission coming soon!')} aria-label="Submit your template">
            <Send className="h-4 w-4 mr-2" /> Submit Your Template
          </Button>
        </div>
      </div>
    </>
  );
};

export default PromptTemplates;
