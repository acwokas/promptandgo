import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, ArrowRight, BookOpen, Sparkles, Languages, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';

interface LangData {
  id: string;
  flag: string;
  name: string;
  native: string;
  prompts: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  bestPlatform: string;
  formality: string;
  culturalTips: string[];
  examples: { prompt: string; english: string }[];
}

const LANGUAGES: LangData[] = [
  {
    id: 'ja', flag: '🇯🇵', name: 'Japanese', native: '日本語', prompts: 24, difficulty: 'Advanced',
    bestPlatform: 'Claude',
    formality: 'Japanese uses keigo (敬語) — three formality levels: casual (タメ口), polite (丁寧語), and honorific (尊敬語/謙譲語). AI prompts for business should use polite form at minimum.',
    culturalTips: [
      'Always specify the desired formality level in your prompt — Japanese AI output defaults to polite but may not match your exact business context.',
      'When requesting email drafts, mention the relationship hierarchy (部下→上司, 社内→社外) so the AI uses appropriate keigo.',
      'Include seasonal greetings (時候の挨拶) context for formal business correspondence.',
    ],
    examples: [
      { prompt: 'お客様への謝罪メールを丁寧語で作成してください。納品遅延の理由と今後の対策を含めてください。', english: 'Please create a polite apology email to a customer. Include the reason for delivery delay and future countermeasures.' },
      { prompt: '新製品のプレスリリースを書いてください。ターゲットは30代のビジネスパーソンです。', english: 'Write a press release for a new product. The target audience is business professionals in their 30s.' },
      { prompt: 'チームミーティングのアジェンダを作成してください。プロジェクトの進捗報告を含めてください。', english: 'Create a team meeting agenda. Include project progress reports.' },
      { prompt: '日本市場向けのSNSキャンペーン企画書を作成してください。', english: 'Create a social media campaign proposal for the Japanese market.' },
    ],
  },
  {
    id: 'zh', flag: '🇨🇳', name: 'Mandarin Chinese', native: '中文', prompts: 28, difficulty: 'Advanced',
    bestPlatform: 'Qwen',
    formality: 'Chinese formality varies between 书面语 (written/formal) and 口语 (spoken/casual). Business contexts require 正式 (formal) register with appropriate 称谓 (forms of address).',
    culturalTips: [
      'Specify simplified (简体) or traditional (繁體) characters based on your target market (Mainland vs Taiwan/HK).',
      'For e-commerce prompts, reference specific platforms (淘宝, 京东, 拼多多) for relevant output.',
      'Include 成语 (idioms) usage preference — some business contexts welcome them, others prefer plain language.',
    ],
    examples: [
      { prompt: '请为我们的电商产品写一段淘宝详情页描述，突出产品的独特卖点。', english: 'Write a Taobao product detail page description highlighting unique selling points.' },
      { prompt: '写一封正式的商务合作邀请函，对象是一家科技公司的CEO。', english: 'Write a formal business partnership invitation letter to a tech company CEO.' },
      { prompt: '为小红书平台创作一篇种草文案，推广一款护肤产品。', english: 'Create a Xiaohongshu recommendation post promoting a skincare product.' },
      { prompt: '撰写一份季度业务报告摘要，包含关键数据和趋势分析。', english: 'Write a quarterly business report summary with key data and trend analysis.' },
    ],
  },
  {
    id: 'ko', flag: '🇰🇷', name: 'Korean', native: '한국어', prompts: 20, difficulty: 'Intermediate',
    bestPlatform: 'ChatGPT',
    formality: 'Korean has seven speech levels. Business prompts typically use 합쇼체 (formal polite) or 해요체 (informal polite). Always specify which level you need.',
    culturalTips: [
      'Korean business culture emphasizes 위계질서 (hierarchy) — specify the reader\'s position relative to the writer.',
      'For marketing content, Korean consumers respond well to emotional storytelling (감성 마케팅).',
      'Include context about whether content is for 네이버 (Naver), 카카오 (Kakao), or other Korean platforms.',
    ],
    examples: [
      { prompt: '신제품 런칭을 위한 보도자료를 작성해 주세요. 합쇼체를 사용해 주세요.', english: 'Please write a press release for a new product launch. Use formal polite speech.' },
      { prompt: '카카오톡 채널용 고객 응대 메시지 템플릿을 만들어 주세요.', english: 'Create customer response message templates for KakaoTalk channel.' },
      { prompt: '한국 시장을 위한 인스타그램 마케팅 전략을 제안해 주세요.', english: 'Please suggest an Instagram marketing strategy for the Korean market.' },
      { prompt: '스타트업 투자 유치를 위한 피치덱 내용을 작성해 주세요.', english: 'Write pitch deck content for startup investment fundraising.' },
    ],
  },
  {
    id: 'hi', flag: '🇮🇳', name: 'Hindi', native: 'हिन्दी', prompts: 18, difficulty: 'Intermediate',
    bestPlatform: 'Gemini',
    formality: 'Hindi uses तू (intimate), तुम (informal), and आप (formal). Business prompts should specify आप form. Hinglish (Hindi-English mix) is common in modern business.',
    culturalTips: [
      'Specify whether you want pure Hindi (शुद्ध हिन्दी) or Hinglish for business contexts — modern Indian business often prefers Hinglish.',
      'For customer service prompts targeting India, consider regional language preferences across states.',
      'Indian business emails often start with respectful greetings — include this expectation in prompts.',
    ],
    examples: [
      { prompt: 'कृपया एक पेशेवर ईमेल लिखें जिसमें नए प्रोजेक्ट की प्रगति रिपोर्ट हो। आप शैली में लिखें।', english: 'Please write a professional email with a new project progress report. Use formal "aap" style.' },
      { prompt: 'हमारे ई-कॉमर्स प्लेटफॉर्म के लिए एक ग्राहक सेवा FAQ तैयार करें।', english: 'Prepare a customer service FAQ for our e-commerce platform.' },
      { prompt: 'स्टार्टअप पिच के लिए एक एलिवेटर पिच तैयार करें, Hinglish में।', english: 'Prepare an elevator pitch for a startup, in Hinglish.' },
      { prompt: 'सोशल मीडिया पर ब्रांड जागरूकता बढ़ाने के लिए एक योजना बनाएं।', english: 'Create a plan to increase brand awareness on social media.' },
    ],
  },
  {
    id: 'th', flag: '🇹🇭', name: 'Thai', native: 'ไทย', prompts: 15, difficulty: 'Intermediate',
    bestPlatform: 'ChatGPT',
    formality: 'Thai uses ครับ/ค่ะ particles for politeness. Business Thai uses ราชาศัพท์ (royal/formal vocabulary) in certain contexts. Specify the desired level of formality.',
    culturalTips: [
      'Thai prompts should specify gender-appropriate particles (ครับ for male, ค่ะ for female speakers).',
      'For LINE-based marketing (Thailand\'s dominant messaging platform), tailor prompts to LINE\'s informal style.',
      'Thai consumers value สุภาพ (politeness) — ensure customer-facing content maintains respectful tone.',
    ],
    examples: [
      { prompt: 'กรุณาเขียนอีเมลธุรกิจสำหรับติดต่อลูกค้าใหม่ ใช้ภาษาสุภาพครับ', english: 'Please write a business email for contacting new customers, use polite language.' },
      { prompt: 'สร้างเนื้อหาโปรโมชั่นสำหรับ LINE Official Account ของร้านอาหาร', english: 'Create promotional content for a restaurant\'s LINE Official Account.' },
      { prompt: 'เขียนข้อความโฆษณา Facebook สำหรับแคมเปญลดราคาสิ้นปี', english: 'Write Facebook ad copy for a year-end discount campaign.' },
      { prompt: 'จัดทำ FAQ สำหรับเว็บไซต์อีคอมเมิร์ซเป็นภาษาไทย', english: 'Create FAQ for an e-commerce website in Thai.' },
    ],
  },
  {
    id: 'vi', flag: '🇻🇳', name: 'Vietnamese', native: 'Tiếng Việt', prompts: 14, difficulty: 'Intermediate',
    bestPlatform: 'ChatGPT',
    formality: 'Vietnamese pronouns encode relationships (anh/chị for older, em for younger, quý khách for customers). Business context requires appropriate pronoun selection.',
    culturalTips: [
      'Vietnamese business culture is relationship-focused — prompts for outreach should include warm, personal openings.',
      'Zalo is the dominant messaging platform in Vietnam; tailor customer service prompts for Zalo-style communication.',
      'For e-commerce content, reference Shopee and Tiki as primary platforms.',
    ],
    examples: [
      { prompt: 'Viết email giới thiệu sản phẩm mới cho khách hàng doanh nghiệp, sử dụng ngôn ngữ lịch sự.', english: 'Write a product introduction email for business customers, using polite language.' },
      { prompt: 'Tạo nội dung quảng cáo cho Shopee, sản phẩm là mỹ phẩm Hàn Quốc.', english: 'Create advertising content for Shopee, the product is Korean cosmetics.' },
      { prompt: 'Soạn kịch bản chăm sóc khách hàng qua Zalo cho cửa hàng thời trang.', english: 'Draft a customer care script via Zalo for a fashion store.' },
      { prompt: 'Viết bài blog về xu hướng công nghệ AI tại Việt Nam năm 2025.', english: 'Write a blog post about AI technology trends in Vietnam in 2025.' },
    ],
  },
  {
    id: 'id', flag: '🇮🇩', name: 'Bahasa Indonesia', native: 'Bahasa Indonesia', prompts: 16, difficulty: 'Beginner',
    bestPlatform: 'ChatGPT',
    formality: 'Indonesian has formal (Anda) and informal (kamu) registers. Business Indonesian uses baku (standard) form. For customer-facing content, use Anda with polite expressions.',
    culturalTips: [
      'Indonesian business culture values sopan santun (polite manners) — prompts should reflect this in tone.',
      'Tokopedia, Bukalapak, and Shopee are key e-commerce platforms to reference in commercial prompts.',
      'Bahasa Indonesia is highly regular grammatically, making it one of the easier Asian languages for AI optimization.',
    ],
    examples: [
      { prompt: 'Tuliskan email penawaran kerjasama bisnis yang formal kepada direktur perusahaan teknologi.', english: 'Write a formal business collaboration offer email to a technology company director.' },
      { prompt: 'Buat deskripsi produk untuk listing Tokopedia, produk elektronik rumah tangga.', english: 'Create a product description for a Tokopedia listing, home electronics.' },
      { prompt: 'Susun rencana konten media sosial untuk brand fashion lokal selama satu bulan.', english: 'Develop a one-month social media content plan for a local fashion brand.' },
      { prompt: 'Tulis artikel blog tentang tips produktivitas menggunakan AI untuk UKM Indonesia.', english: 'Write a blog article about productivity tips using AI for Indonesian SMEs.' },
    ],
  },
  {
    id: 'tl', flag: '🇵🇭', name: 'Tagalog', native: 'Tagalog', prompts: 12, difficulty: 'Beginner',
    bestPlatform: 'ChatGPT',
    formality: 'Filipino uses po/opo particles for respect. Business communications often mix English and Filipino (Taglish). Specify language preference clearly.',
    culturalTips: [
      'Taglish (Tagalog-English) is the default business register in the Philippines — specify if you want pure Filipino or Taglish.',
      'Philippine business culture is warm and relationship-driven — prompts for outreach should be friendly yet professional.',
      'For digital marketing, reference Facebook and TikTok as dominant platforms in the Philippines.',
    ],
    examples: [
      { prompt: 'Sumulat ng professional na email para sa business proposal, gamitin ang Taglish po.', english: 'Write a professional email for a business proposal, use Taglish please.' },
      { prompt: 'Gumawa ng Facebook ad copy para sa bagong restaurant sa Makati.', english: 'Create Facebook ad copy for a new restaurant in Makati.' },
      { prompt: 'Isulat ang customer service script para sa online store, polite at friendly po.', english: 'Write a customer service script for an online store, polite and friendly please.' },
      { prompt: 'Mag-draft ng blog post tungkol sa benefits ng AI para sa Filipino freelancers.', english: 'Draft a blog post about the benefits of AI for Filipino freelancers.' },
    ],
  },
];

const LanguageLearning = () => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [compareA, setCompareA] = useState<string>('ja');
  const [compareB, setCompareB] = useState<string>('ko');

  const langA = LANGUAGES.find(l => l.id === compareA);
  const langB = LANGUAGES.find(l => l.id === compareB);

  return (
    <>
      <SEO
        title="Language Learning Prompts | AI Prompting in Asian Languages"
        description="Master AI prompting in Japanese, Chinese, Korean, Hindi, Thai, Vietnamese, Bahasa, and Tagalog with expert guides and examples."
      />

      {/* Hero */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="container max-w-5xl mx-auto px-4 relative text-center">
          <Badge variant="secondary" className="mb-4">8 Asian Languages</Badge>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Master AI Prompting in{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Any Asian Language</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Cultural context, formality guides, and real-world prompt examples across 8 major Asian languages.
          </p>
        </div>
      </section>

      <div className="container max-w-6xl mx-auto px-4 pb-16 space-y-12">
        {/* Language Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {LANGUAGES.map(lang => (
            <div key={lang.id}>
              <Card
                className={`cursor-pointer transition-all hover:border-primary/40 ${expanded === lang.id ? 'border-primary ring-1 ring-primary/20' : ''}`}
                onClick={() => setExpanded(expanded === lang.id ? null : lang.id)}
              >
                <CardContent className="pt-6 text-center">
                  <span className="text-4xl mb-2 block">{lang.flag}</span>
                  <h2 className="font-bold">{lang.name}</h2>
                  <p className="text-sm text-muted-foreground">{lang.native}</p>
                  <div className="flex justify-center gap-2 mt-3">
                    <Badge variant="secondary" className="text-[10px]">{lang.prompts} prompts</Badge>
                    <Badge variant="outline" className="text-[10px]">{lang.difficulty}</Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="mt-3 w-full" aria-label={`Explore ${lang.name}`}>
                    {expanded === lang.id ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
                    {expanded === lang.id ? 'Collapse' : 'Explore'}
                  </Button>
                </CardContent>
              </Card>

              {/* Expanded detail (inline on mobile, below card) */}
              {expanded === lang.id && (
                <Card className="mt-3 border-primary/20">
                  <CardContent className="pt-6 space-y-5">
                    <div>
                      <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" /> Formality Guide
                      </h3>
                      <p className="text-sm text-muted-foreground">{lang.formality}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" /> Cultural Tips
                      </h3>
                      <ul className="space-y-2">
                        {lang.culturalTips.map((tip, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex gap-2">
                            <span className="text-primary font-bold shrink-0">{i + 1}.</span> {tip}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <Globe className="h-4 w-4 text-primary" /> Best Platform: {lang.bestPlatform}
                      </h3>
                    </div>

                    <div>
                      <h3 className="font-semibold text-sm mb-3">Example Prompts</h3>
                      <div className="space-y-3">
                        {lang.examples.map((ex, i) => (
                          <div key={i} className="bg-muted/50 rounded-lg p-3 border border-border">
                            <p className="text-sm font-medium mb-1">{ex.prompt}</p>
                            <p className="text-xs text-muted-foreground italic">→ {ex.english}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button asChild size="sm" className="w-full">
                      <Link to={`/optimize?lang=${lang.id}`}>
                        Optimize in {lang.name} <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          ))}
        </div>

        {/* Language Comparison */}
        <section aria-label="Language comparison">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Languages className="h-6 w-6 text-primary" /> Language Comparison
          </h2>
          <div className="flex flex-wrap gap-3 mb-6">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Language A</label>
              <select
                value={compareA}
                onChange={e => setCompareA(e.target.value)}
                className="bg-muted border border-border rounded-md px-3 py-2 text-sm"
                aria-label="Select first language"
              >
                {LANGUAGES.map(l => <option key={l.id} value={l.id}>{l.flag} {l.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Language B</label>
              <select
                value={compareB}
                onChange={e => setCompareB(e.target.value)}
                className="bg-muted border border-border rounded-md px-3 py-2 text-sm"
                aria-label="Select second language"
              >
                {LANGUAGES.map(l => <option key={l.id} value={l.id}>{l.flag} {l.name}</option>)}
              </select>
            </div>
          </div>

          {langA && langB && (
            <div className="grid md:grid-cols-2 gap-4">
              {[langA, langB].map(lang => (
                <Card key={lang.id}>
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{lang.flag}</span>
                      <div>
                        <h3 className="font-bold">{lang.name}</h3>
                        <p className="text-xs text-muted-foreground">{lang.native} · {lang.difficulty}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Formality</p>
                      <p className="text-sm">{lang.formality.slice(0, 150)}...</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Best Platform</p>
                      <Badge variant="secondary">{lang.bestPlatform}</Badge>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Sample Prompt</p>
                      <p className="text-sm bg-muted/50 rounded p-2 border border-border">{lang.examples[0].prompt}</p>
                      <p className="text-xs text-muted-foreground mt-1 italic">→ {lang.examples[0].english}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default LanguageLearning;
