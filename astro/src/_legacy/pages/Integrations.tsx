import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { toast } from 'sonner';
import { Send } from 'lucide-react';

type Tab = 'ai' | 'productivity' | 'developer';
type Status = 'Connected' | 'Available' | 'Coming Soon';

interface Integration {
  name: string;
  desc: string;
  status: Status;
  color: string;
}

const STATUS_STYLE: Record<Status, string> = {
  Connected: 'bg-green-500/20 text-green-400 border-green-500/30',
  Available: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Coming Soon': 'bg-muted text-muted-foreground border-border',
};

const AI: Integration[] = [
  { name: 'ChatGPT', desc: 'OpenAI\'s flagship model. Full optimization and streaming support.', status: 'Connected', color: 'bg-emerald-500' },
  { name: 'Claude', desc: 'Anthropic\'s reasoning model. Nuanced, context-rich prompting.', status: 'Connected', color: 'bg-orange-500' },
  { name: 'Gemini', desc: 'Google\'s multimodal model. Strong at structured and data tasks.', status: 'Connected', color: 'bg-blue-500' },
  { name: 'Copilot', desc: 'Microsoft\'s AI assistant. Optimized for code and productivity.', status: 'Available', color: 'bg-cyan-500' },
  { name: 'Perplexity', desc: 'Research-focused AI. Great for sourced, factual content.', status: 'Available', color: 'bg-violet-500' },
  { name: 'MidJourney', desc: 'Image generation with descriptive prompt optimization.', status: 'Available', color: 'bg-pink-500' },
  { name: 'DeepSeek', desc: 'Technical and analytical focus with chain-of-thought.', status: 'Connected', color: 'bg-teal-500' },
  { name: 'Qwen', desc: 'Alibaba\'s model excelling at Chinese and SEA languages.', status: 'Connected', color: 'bg-indigo-500' },
  { name: 'Meta AI', desc: 'Built on Llama. Strong for social and multilingual content.', status: 'Available', color: 'bg-sky-500' },
  { name: 'Ernie Bot', desc: 'Baidu\'s model dominant for Chinese-language content.', status: 'Connected', color: 'bg-red-500' },
  { name: 'Grok', desc: 'xAI\'s model with real-time knowledge and analysis.', status: 'Available', color: 'bg-slate-500' },
  { name: 'Local Models', desc: 'Support for self-hosted LLMs via Ollama and vLLM.', status: 'Coming Soon', color: 'bg-gray-500' },
];

const PRODUCTIVITY: Integration[] = [
  { name: 'Notion', desc: 'Export optimized prompts directly to your Notion workspace.', status: 'Coming Soon', color: 'bg-neutral-700' },
  { name: 'Slack', desc: 'Optimize prompts from Slack with a /prompt command.', status: 'Coming Soon', color: 'bg-purple-600' },
  { name: 'Google Docs', desc: 'Insert optimized prompts into Google Docs.', status: 'Coming Soon', color: 'bg-blue-600' },
  { name: 'Microsoft Office', desc: 'Word and Outlook add-in for prompt optimization.', status: 'Coming Soon', color: 'bg-orange-600' },
  { name: 'Trello', desc: 'Add optimized prompts as Trello cards.', status: 'Coming Soon', color: 'bg-blue-500' },
  { name: 'Zapier', desc: 'Automate prompt workflows with 5,000+ app integrations.', status: 'Coming Soon', color: 'bg-orange-500' },
];

const DEVELOPER: Integration[] = [
  { name: 'VS Code', desc: 'Extension for in-editor prompt optimization.', status: 'Coming Soon', color: 'bg-blue-600' },
  { name: 'GitHub', desc: 'GitHub Action for prompt CI/CD pipelines.', status: 'Coming Soon', color: 'bg-neutral-700' },
  { name: 'Jupyter', desc: 'Notebook extension for data science prompt workflows.', status: 'Coming Soon', color: 'bg-orange-500' },
  { name: 'Postman', desc: 'Pre-built Postman collection for the PromptAndGo API.', status: 'Coming Soon', color: 'bg-orange-600' },
  { name: 'Docker', desc: 'Self-hosted optimizer container for air-gapped environments.', status: 'Coming Soon', color: 'bg-blue-500' },
  { name: 'Terraform', desc: 'Infrastructure-as-code module for enterprise deployments.', status: 'Coming Soon', color: 'bg-purple-600' },
];

const TABS: { key: Tab; label: string }[] = [
  { key: 'ai', label: 'AI Platforms' },
  { key: 'productivity', label: 'Productivity Tools' },
  { key: 'developer', label: 'Developer Tools' },
];

const DATA: Record<Tab, Integration[]> = { ai: AI, productivity: PRODUCTIVITY, developer: DEVELOPER };

const Integrations = () => {
  const [tab, setTab] = useState<Tab>('ai');

  return (
    <>
      <SEO title="Integrations & Partners" description="Connect PromptAndGo with your favorite AI platforms, productivity tools, and developer tools." />

      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="container max-w-5xl mx-auto px-4 relative text-center">
          <Badge variant="secondary" className="mb-4">Integrations</Badge>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Integrations & Partners</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Connect PromptAndGo with your favorite tools and platforms</p>
        </div>
      </section>

      <div className="container max-w-6xl mx-auto px-4 pb-16 space-y-10">
        {/* Tabs */}
        <div className="flex gap-2 justify-center">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${tab === t.key ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-muted-foreground border-border hover:border-primary/40'}`}
              aria-pressed={tab === t.key}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DATA[tab].map(item => (
            <Card key={item.name} className="hover:border-primary/30 transition-colors">
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center text-white text-xs font-bold`}>
                    {item.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm">{item.name}</h3>
                  </div>
                  <Badge className={`text-[10px] border shrink-0 ${STATUS_STYLE[item.status]}`}>{item.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
                <Button
                  size="sm" variant={item.status === 'Coming Soon' ? 'outline' : 'default'} className="w-full"
                  onClick={() => toast.info(item.status === 'Coming Soon' ? 'Coming soon!' : `${item.name} integration details`)}
                >
                  {item.status === 'Coming Soon' ? 'Notify Me' : item.status === 'Connected' ? 'Configure' : 'Connect'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Become a Partner */}
        <section className="text-center">
          <h2 className="text-2xl font-bold mb-3">Become a Partner</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6">
            Join our partner ecosystem and reach 10,000+ AI professionals across Asia. We offer co-marketing, technical integration support, and revenue sharing.
          </p>
          <Button size="lg" onClick={() => toast.info('Partnership applications open soon!')}>Apply Now</Button>
        </section>

        {/* Integration Request */}
        <Card className="max-w-lg mx-auto">
          <CardContent className="py-6">
            <h3 className="font-bold text-center mb-2">Don't see your tool?</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">Request an integration and we'll prioritize it.</p>
            <form onSubmit={e => { e.preventDefault(); toast.success('Integration request submitted!'); }} className="flex gap-2">
              <Input placeholder="Tool or platform name" required aria-label="Tool name" />
              <Button type="submit"><Send className="h-4 w-4" /></Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Integrations;
