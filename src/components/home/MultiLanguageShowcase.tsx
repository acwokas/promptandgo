import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, ArrowRight, Copy, Check } from 'lucide-react';

interface LanguageExample {
  code: string;
  name: string;
  flag: string;
  original: string;
  optimized: string;
}

const languageExamples: LanguageExample[] = [
  {
    code: 'en',
    name: 'English',
    flag: '🇬🇧',
    original: 'Write a marketing email for my SaaS product targeting SMEs',
    optimized: 'Craft a compelling marketing email that persuades small and medium-sized enterprises to adopt our SaaS solution. Include a clear value proposition, key benefits tailored to SME pain points, a specific call-to-action, and professional formatting suitable for B2B outreach.',
  },
  {
    code: 'id',
    name: 'Bahasa Indonesia',
    flag: '🇮🇩',
    original: 'Tulis email pemasaran untuk produk SaaS saya yang menargetkan UKM',
    optimized: 'Buat email pemasaran yang menarik untuk meyakinkan usaha kecil dan menengah mengadopsi solusi SaaS kami. Sertakan proposisi nilai yang jelas, manfaat utama yang disesuaikan dengan tantangan UKM, ajakan bertindak yang spesifik, dan format profesional untuk jangkauan B2B.',
  },
  {
    code: 'vi',
    name: 'Vietnamese',
    flag: '🇻🇳',
    original: 'Viết email tiếp thị cho sản phẩm SaaS của tôi nhắm vào doanh nghiệp nhỏ',
    optimized: 'Soạn email tiếp thị hấp dẫn để thuyết phục các doanh nghiệp nhỏ và vừa áp dụng giải pháp SaaS của chúng tôi. Bao gồm đề xuất giá trị rõ ràng, lợi ích chính phù hợp với thách thức của SME, lời kêu gọi hành động cụ thể và định dạng chuyên nghiệp phù hợp cho tiếp cận B2B.',
  },
  {
    code: 'ms',
    name: 'Malay',
    flag: '🇲🇾',
    original: 'Tulis e-mel pemasaran untuk produk SaaS saya yang menyasarkan PKS',
    optimized: 'Cipta e-mel pemasaran yang menarik untuk meyakinkan perniagaan kecil dan sederhana mengadopsi solusi SaaS kami. Sertakan cadangan nilai yang jelas, manfaat utama yang disesuaikan dengan cabaran PKS, seruan tindakan yang spesifik, dan pemformatan profesional untuk jangkauan B2B.',
  },
  {
    code: 'zh',
    name: 'Mandarin Chinese',
    flag: '🇨🇳',
    original: '为我的SaaS产品撰写一封针对中小企业的营销邮件',
    optimized: '撰写一封引人注目的营销邮件，说服中小型企业采用我们的SaaS解决方案。包括清晰的价值主张、针对中小企业痛点量身定制的关键优势、具体的行动号召以及适合B2B推广的专业格式。',
  },
];

export function MultiLanguageShowcase() {
  const [activeLanguage, setActiveLanguage] = useState(0);
  const [showOptimized, setShowOptimized] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLanguage((prev) => (prev + 1) % languageExamples.length);
      setShowOptimized(false);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const currentExample = languageExamples[activeLanguage];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section className="container py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Globe className="h-6 w-6 text-primary" />
          <span className="text-sm font-semibold text-primary">MULTILINGUAL EXCELLENCE</span>
        </div>
        <h2 className="text-4xl font-bold mb-4">Prompts in Your Native Language</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
          Scout AI works flawlessly across Southeast Asian languages. <span className="font-semibold text-foreground">62.7% of APAC professionals</span> prompt in their native language—we make that seamless.
        </p>

        {/* Stats Callout */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">62.7%</div>
              <p className="text-xs text-muted-foreground">Non-English Searches</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-accent/10 to-primary/10 border-accent/20">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-accent">5</div>
              <p className="text-xs text-muted-foreground">SE Asia Languages</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-secondary/20 to-secondary/5 border-secondary/20">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">1.9M+</div>
              <p className="text-xs text-muted-foreground">APAC Professionals</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Interactive Showcase */}
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* Language Tabs */}
        <div className="space-y-6">
          <div className="flex gap-2 mb-6 flex-wrap">
            {languageExamples.map((lang, idx) => (
              <button
                key={lang.code}
                onClick={() => {
                  setActiveLanguage(idx);
                  setShowOptimized(false);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeLanguage === idx
                    ? 'bg-primary text-white shadow-lg scale-105'
                    : 'bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <span className="mr-2">{lang.flag}</span>
                {lang.name}
              </button>
            ))}
          </div>

          {/* Original Prompt */}
          <Card className="border-l-4 border-primary overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-semibold text-primary">ORIGINAL PROMPT</span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                  {currentExample.code.toUpperCase()}
                </span>
              </div>
              <p className="text-foreground leading-relaxed mb-4 text-base">
                "{currentExample.original}"
              </p>
              <button
                onClick={() => handleCopy(currentExample.original, 0)}
                className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
              >
                {copiedIndex === 0 ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Original
                  </>
                )}
              </button>
            </CardContent>
          </Card>

          {/* Optimized Prompt */}
          <Card className="border-l-4 border-accent overflow-hidden bg-gradient-to-br from-accent/5 to-transparent">
            <CardContent className="p-6">
              <button
                onClick={() => setShowOptimized(!showOptimized)}
                className="w-full text-left flex items-center justify-between mb-3 hover:text-accent transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-accent">SCOUT AI OPTIMIZED</span>
                  <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                    Enhanced
                  </span>
                </div>
                <svg
                  className={`h-5 w-5 text-accent transition-transform duration-300 ${
                    showOptimized ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </button>

              {showOptimized && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <p className="text-foreground leading-relaxed mb-4 text-sm">
                    {currentExample.optimized}
                  </p>
                  <button
                    onClick={() => handleCopy(currentExample.optimized, 1)}
                    className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent/80 font-medium transition-colors"
                  >
                    {copiedIndex === 1 ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy Optimized
                      </>
                    )}
                  </button>
                </div>
              )}

              {!showOptimized && (
                <p className="text-muted-foreground text-sm italic">
                  Click to reveal the Scout-optimized version with enhanced context, clarity, and platform-specific tailoring.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Visual Indicator - Animated Globe */}
        <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 rounded-2xl border border-primary/10 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl animate-pulse" />
          </div>

          {/* Content */}
          <div className="relative z-10 text-center">
            <div className="text-6xl mb-4 animate-bounce" style={{ animationDelay: '0s' }}>
              {currentExample.flag}
            </div>
            <h3 className="text-2xl font-bold mb-2">{currentExample.name}</h3>
            <p className="text-muted-foreground max-w-xs">
              Seamlessly optimize prompts for any AI platform, in any language your team speaks.
            </p>

            {/* Language counter */}
            <div className="mt-8 pt-8 border-t border-primary/20">
              <p className="text-sm text-muted-foreground mb-4">
                {activeLanguage + 1} of {languageExamples.length} languages
              </p>
              <div className="flex gap-2 justify-center flex-wrap">
                {languageExamples.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === activeLanguage
                        ? 'bg-primary w-8'
                        : idx < activeLanguage
                          ? 'bg-primary/30 w-2'
                          : 'bg-border w-2'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl p-8 text-center border border-primary/20">
        <h3 className="text-2xl font-bold mb-3">Ready to Optimize in Your Language?</h3>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Scout AI works in English, Bahasa Indonesia, Vietnamese, Malay, Mandarin, and more. Start optimizing prompts in the language your team speaks.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button asChild size="lg" className="bg-gradient-primary hover:bg-gradient-primary-hover">
            <Link to="/scout">
              Try Scout AI <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/library">Browse Multilingual Prompts</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
