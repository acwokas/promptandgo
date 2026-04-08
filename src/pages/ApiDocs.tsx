import { useState } from 'react';
import { Copy, Check, Key, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const SECTIONS = ['Overview', 'Authentication', 'Endpoints', 'SDKs', 'Rate Limits', 'Errors'] as const;

const ENDPOINTS = [
  {
    method: 'POST' as const, path: '/api/optimize', desc: 'Optimize a prompt for a specific AI platform.',
    request: `{
  "prompt": "Write a product description",
  "platform": "chatgpt",
  "language": "ja",
  "tone": "professional"
}`,
    response: `{
  "optimized": "あなたはプロのコピーライターです...",
  "tokens": 142,
  "platform": "chatgpt",
  "language": "ja"
}`,
    params: [
      { name: 'prompt', type: 'string', required: true, desc: 'The prompt to optimize' },
      { name: 'platform', type: 'string', required: true, desc: 'Target AI platform' },
      { name: 'language', type: 'string', required: false, desc: 'Output language (ISO 639-1)' },
      { name: 'tone', type: 'string', required: false, desc: 'Desired tone' },
    ],
  },
  {
    method: 'POST' as const, path: '/api/compare', desc: 'Compare a prompt across multiple platforms.',
    request: `{
  "prompt": "Write a marketing email",
  "platforms": ["chatgpt", "claude", "gemini"]
}`,
    response: `{
  "comparisons": [
    { "platform": "chatgpt", "optimized": "...", "tokens": 142 },
    { "platform": "claude", "optimized": "...", "tokens": 158 },
    { "platform": "gemini", "optimized": "...", "tokens": 135 }
  ]
}`,
    params: [
      { name: 'prompt', type: 'string', required: true, desc: 'The prompt to compare' },
      { name: 'platforms', type: 'string[]', required: true, desc: 'Platforms to compare' },
    ],
  },
  {
    method: 'GET' as const, path: '/api/templates', desc: 'List available prompt templates.',
    request: `GET /api/templates?category=business&language=ja`,
    response: `{
  "templates": [
    { "id": "tpl_1", "title": "Japanese Business Email", "category": "business", "uses": 2400 }
  ],
  "total": 42
}`,
    params: [
      { name: 'category', type: 'string', required: false, desc: 'Filter by category' },
      { name: 'language', type: 'string', required: false, desc: 'Filter by language' },
    ],
  },
  {
    method: 'POST' as const, path: '/api/translate', desc: 'Translate and localize a prompt.',
    request: `{
  "prompt": "Write a customer service response",
  "source_language": "en",
  "target_language": "th",
  "context": "e-commerce"
}`,
    response: `{
  "translated": "เขียนข้อความตอบกลับลูกค้า...",
  "localization_notes": "Added ครับ/ค่ะ particles"
}`,
    params: [
      { name: 'prompt', type: 'string', required: true, desc: 'Prompt to translate' },
      { name: 'source_language', type: 'string', required: true, desc: 'Source language' },
      { name: 'target_language', type: 'string', required: true, desc: 'Target language' },
      { name: 'context', type: 'string', required: false, desc: 'Industry context' },
    ],
  },
];

const RATE_LIMITS = [
  { tier: 'Free', limit: '100/day', burst: '10/min' },
  { tier: 'Pro', limit: '5,000/day', burst: '100/min' },
  { tier: 'Enterprise', limit: 'Unlimited', burst: 'Custom' },
];

const ERRORS = [
  { code: 400, name: 'Bad Request', desc: 'Invalid request body or missing required fields.' },
  { code: 401, name: 'Unauthorized', desc: 'Missing or invalid API key.' },
  { code: 403, name: 'Forbidden', desc: 'API key lacks permission for this endpoint.' },
  { code: 404, name: 'Not Found', desc: 'The requested resource does not exist.' },
  { code: 429, name: 'Rate Limited', desc: 'You have exceeded your rate limit. Retry after the indicated time.' },
  { code: 500, name: 'Server Error', desc: 'An unexpected error occurred. Contact support if it persists.' },
];

const CodeBlock = ({ code, id }: { code: string; id: string }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Copied!');
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative group">
      <pre className="bg-muted/70 border border-border rounded-lg p-4 text-sm overflow-x-auto font-mono leading-relaxed whitespace-pre">{code}</pre>
      <button onClick={copy} className="absolute top-2 right-2 p-1.5 rounded bg-muted border border-border opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Copy code">
        {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
};

const MethodBadge = ({ method }: { method: 'GET' | 'POST' }) => (
  <Badge className={`text-[10px] font-mono ${method === 'GET' ? 'bg-green-500/20 text-green-500 border-green-500/30' : 'bg-blue-500/20 text-blue-500 border-blue-500/30'}`}>
    {method}
  </Badge>
);

const ApiDocs = () => {
  const [activeSection, setActiveSection] = useState<typeof SECTIONS[number]>('Overview');

  return (
    <>
      <SEO title="API Documentation" description="PromptAndGo REST API documentation for prompt optimization, comparison, and translation." />

      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <nav className="hidden md:block w-48 shrink-0 sticky top-20 self-start space-y-1" aria-label="API docs navigation">
            {SECTIONS.map(s => (
              <button
                key={s}
                onClick={() => setActiveSection(s)}
                className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${activeSection === s ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {s}
              </button>
            ))}
            <div className="pt-4">
              <Button size="sm" className="w-full" asChild><Link to="/auth"><Key className="h-3.5 w-3.5 mr-1" /> Get API Key</Link></Button>
            </div>
          </nav>

          {/* Mobile section pills */}
          <div className="md:hidden flex flex-wrap gap-2 mb-6 w-full">
            {SECTIONS.map(s => (
              <button key={s} onClick={() => setActiveSection(s)} className={`px-3 py-1 rounded-full text-xs font-medium border ${activeSection === s ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground'}`}>{s}</button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-12">
            {/* Overview */}
            {activeSection === 'Overview' && (
              <section>
                <h1 className="text-3xl font-bold mb-4">PromptAndGo API</h1>
                <p className="text-muted-foreground mb-6">Optimize, compare, and translate AI prompts programmatically. Built for Asian markets with support for 12+ languages and 12 AI platforms.</p>
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="py-4 flex items-center gap-3">
                    <Zap className="h-5 w-5 text-primary shrink-0" />
                    <p className="text-sm"><strong>Base URL:</strong> <code className="bg-muted px-2 py-0.5 rounded text-xs font-mono">https://api.promptandgo.com/v1</code></p>
                  </CardContent>
                </Card>
              </section>
            )}

            {/* Authentication */}
            {activeSection === 'Authentication' && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Authentication</h2>
                <p className="text-muted-foreground mb-4">Authenticate requests with a Bearer token in the Authorization header.</p>
                <CodeBlock id="auth" code={`curl -X POST https://api.promptandgo.com/v1/optimize \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"prompt": "Hello", "platform": "chatgpt"}'`} />
              </section>
            )}

            {/* Endpoints */}
            {activeSection === 'Endpoints' && (
              <section className="space-y-10">
                <h2 className="text-2xl font-bold mb-4">Endpoints</h2>
                {ENDPOINTS.map(ep => (
                  <div key={ep.path} className="space-y-4">
                    <div className="flex items-center gap-2">
                      <MethodBadge method={ep.method} />
                      <code className="font-mono text-sm font-semibold">{ep.path}</code>
                    </div>
                    <p className="text-sm text-muted-foreground">{ep.desc}</p>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border border-border rounded-lg">
                        <thead><tr className="bg-muted"><th className="text-left p-2">Param</th><th className="text-left p-2">Type</th><th className="text-left p-2">Required</th><th className="text-left p-2">Description</th></tr></thead>
                        <tbody>
                          {ep.params.map(p => (
                            <tr key={p.name} className="border-t border-border">
                              <td className="p-2 font-mono text-xs">{p.name}</td>
                              <td className="p-2 text-xs">{p.type}</td>
                              <td className="p-2 text-xs">{p.required ? '✓' : '—'}</td>
                              <td className="p-2 text-xs text-muted-foreground">{p.desc}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div><p className="text-xs font-medium text-muted-foreground mb-1">Request</p><CodeBlock id={`${ep.path}-req`} code={ep.request} /></div>
                      <div><p className="text-xs font-medium text-muted-foreground mb-1">Response</p><CodeBlock id={`${ep.path}-res`} code={ep.response} /></div>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* SDKs */}
            {activeSection === 'SDKs' && (
              <section className="space-y-6">
                <h2 className="text-2xl font-bold mb-4">SDKs</h2>
                <div>
                  <h3 className="font-semibold mb-2">JavaScript / TypeScript</h3>
                  <CodeBlock id="sdk-js-install" code="npm install @promptandgo/sdk" />
                  <div className="mt-3" />
                  <CodeBlock id="sdk-js-usage" code={`import { PromptAndGo } from '@promptandgo/sdk';

const pag = new PromptAndGo('YOUR_API_KEY');

const result = await pag.optimize({
  prompt: 'Write a marketing email',
  platform: 'chatgpt',
  language: 'ja',
});

console.log(result.optimized);`} />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Python</h3>
                  <CodeBlock id="sdk-py-install" code="pip install promptandgo" />
                  <div className="mt-3" />
                  <CodeBlock id="sdk-py-usage" code={`from promptandgo import PromptAndGo

pag = PromptAndGo("YOUR_API_KEY")

result = pag.optimize(
    prompt="Write a marketing email",
    platform="chatgpt",
    language="ja",
)

print(result.optimized)`} />
                </div>
              </section>
            )}

            {/* Rate Limits */}
            {activeSection === 'Rate Limits' && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Rate Limits</h2>
                <table className="w-full text-sm border border-border rounded-lg">
                  <thead><tr className="bg-muted"><th className="text-left p-3">Tier</th><th className="text-left p-3">Daily Limit</th><th className="text-left p-3">Burst</th></tr></thead>
                  <tbody>
                    {RATE_LIMITS.map(r => (
                      <tr key={r.tier} className="border-t border-border"><td className="p-3 font-medium">{r.tier}</td><td className="p-3">{r.limit}</td><td className="p-3">{r.burst}</td></tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}

            {/* Errors */}
            {activeSection === 'Errors' && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Error Codes</h2>
                <table className="w-full text-sm border border-border rounded-lg">
                  <thead><tr className="bg-muted"><th className="text-left p-3">Code</th><th className="text-left p-3">Name</th><th className="text-left p-3">Description</th></tr></thead>
                  <tbody>
                    {ERRORS.map(e => (
                      <tr key={e.code} className="border-t border-border"><td className="p-3 font-mono">{e.code}</td><td className="p-3 font-medium">{e.name}</td><td className="p-3 text-muted-foreground">{e.desc}</td></tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ApiDocs;
