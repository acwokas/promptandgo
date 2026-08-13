import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, ArrowRight, Copy, Check } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  sample: string;
}

interface Region {
  name: string;
  languages: Language[];
}

const REGIONS: Region[] = [
  {
    name: 'East Asia',
    languages: [
      { code: 'zh-CN', name: 'Simplified Chinese', nativeName: '简体中文', flag: '🇨🇳', sample: '帮我写一条小红书种草文案，推荐一款适合亚洲肌肤的防晒霜' },
      { code: 'zh-TW', name: 'Traditional Chinese', nativeName: '繁體中文', flag: '🇹🇼', sample: '為我的電商品牌撰寫一段吸引人的產品描述，強調台灣在地製造的優勢' },
      { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', sample: '取引先への敬語を使った納期延長のお詫びメールを作成してください' },
      { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', sample: '신제품 블루투스 이어폰에 대한 상세한 쿠팡 리뷰를 작성해주세요' },
    ],
  },
  {
    name: 'Southeast Asia',
    languages: [
      { code: 'id', name: 'Bahasa Indonesia', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', sample: 'Buatkan copywriting iklan Instagram untuk peluncuran produk skincare lokal yang ramah lingkungan' },
      { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾', sample: 'Sediakan agenda mesyuarat bulanan pasukan jualan termasuk KPI dan sasaran suku tahunan' },
      { code: 'th', name: 'Thai', nativeName: 'ภาษาไทย', flag: '🇹🇭', sample: 'เขียนข้อความตอบลูกค้าที่ไม่พอใจสินค้า โดยใช้ภาษาสุภาพและเสนอทางแก้ไข' },
      { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', sample: 'Soạn email chuyên nghiệp gửi đối tác về đề xuất hợp tác kinh doanh xuất nhập khẩu' },
      { code: 'tl', name: 'Filipino', nativeName: 'Tagalog', flag: '🇵🇭', sample: 'Gumawa ng product description para sa online shop ng handmade na bag' },
      { code: 'my', name: 'Burmese', nativeName: 'မြန်မာဘာသာ', flag: '🇲🇲', sample: 'SME များအတွက် ကျွန်ုပ်၏ SaaS ထုတ်ကုန်အတွက် စျေးကွက်ရှာဖွေရေး အီးမေးလ် ရေးပါ' },
      { code: 'km', name: 'Khmer', nativeName: 'ភាសាខ្មែរ', flag: '🇰🇭', sample: 'សរសេរការពិពណ៌នាផលិតផលសម្រាប់ហាងអនឡាញលក់សម្លៀកបំពាក់' },
      { code: 'lo', name: 'Lao', nativeName: 'ລາວ', flag: '🇱🇦', sample: 'ຂຽນອີເມວການຕະຫຼາດສຳລັບຜະລິດຕະພັນ SaaS ຂອງຂ້ອຍທີ່ແນໃສ່ SME' },
    ],
  },
  {
    name: 'South Asia',
    languages: [
      { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', sample: 'डिजिटल मार्केटिंग पर एक विस्तृत ब्लॉग की रूपरेखा तैयार करें जो छोटे व्यवसायों के लिए हो' },
      { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩', sample: 'আমাদের ই-কমার্স সাইটের জন্য একটি গ্রাহক সেবা প্রতিক্রিয়া টেমপ্লেট তৈরি করুন' },
      { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇱🇰', sample: 'ஒரு மென்பொருள் நிறுவனத்திற்கான வேலை விளம்பரம் எழுதுங்கள்' },
      { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', sample: 'SMEs کو ہدف بناتے ہوئے میری SaaS پروڈکٹ کے لیے مارکیٹنگ ای میل لکھیں' },
      { code: 'si', name: 'Sinhala', nativeName: 'සිංහල', flag: '🇱🇰', sample: 'SME ඉලක්ක කරගනිමින් මගේ SaaS නිෂ්පාදනය සඳහා අලෙවිකරණ ඊමේල් එකක් ලියන්න' },
      { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', flag: '🇳🇵', sample: 'SME लाई लक्षित गर्दै मेरो SaaS उत्पादनको लागि मार्केटिङ इमेल लेख्नुहोस्' },
    ],
  },
  {
    name: 'Central & West Asia',
    languages: [
      { code: 'kk', name: 'Kazakh', nativeName: 'Қазақ', flag: '🇰🇿', sample: 'Менің SaaS өнімім үшін шағын және орта бизнеске бағытталған маркетинг электрондық хатын жазыңыз' },
      { code: 'uz', name: 'Uzbek', nativeName: 'Oʻzbek', flag: '🇺🇿', sample: "Mening SaaS mahsulotim uchun KO'Blarni nishonga olgan marketing elektron pochta xabarini yozing" },
      { code: 'ka', name: 'Georgian', nativeName: 'ქართული', flag: '🇬🇪', sample: 'დაწერეთ მარკეტინგული ელ-ფოსტა ჩემი SaaS პროდუქტისთვის, რომელიც მიზნად ისახავს მცირე ბიზნესს' },
      { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇦🇪', sample: 'اكتب بريدًا إلكترونيًا تسويقيًا لمنتج SaaS الخاص بي يستهدف الشركات الصغيرة' },
      { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', sample: "SaaS ürünüm için KOBİ'leri hedefleyen bir pazarlama e-postası yazın" },
      { code: 'he', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', sample: 'כתוב אימייל שיווקי למוצר ה-SaaS שלי המיועד לעסקים קטנים ובינוניים' },
    ],
  },
];

const ALL_LANGUAGES = REGIONS.flatMap((r) => r.languages);

const HERO_STATS = [
  { value: '26', label: 'Asian Languages' },
  { value: '4.7B', label: 'People Across Asia' },
  { value: '6', label: 'Regional Zones' },
];

export function MultiLanguageShowcase() {
  const navigate = useNavigate();
  const [activeRegion, setActiveRegion] = useState(0);
  const [highlightedLang, setHighlightedLang] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [tickerIndex, setTickerIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % ALL_LANGUAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = (text: string, code: string) => {
    navigator.clipboard.writeText(text);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const tickerLang = ALL_LANGUAGES[tickerIndex];

  return (
    <section className="container py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Globe className="h-6 w-6 text-primary" />
          <span className="text-sm font-semibold tracking-widest text-primary uppercase">
            Every Language. Every Market.
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Prompt in <span className="text-primary">Your</span> Language
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
          From Tokyo to Istanbul, Mumbai to Manila. We support 20+ languages across every corner of Asia so your prompts carry the right context, tone, and cultural nuance.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto mb-10">
          {HERO_STATS.map((stat) => (
            <Card
              key={stat.label}
              className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20"
            >
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Live ticker */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-3 bg-muted/60 border border-border rounded-full px-6 py-3 transition-all duration-500">
          <span className="text-2xl">{tickerLang.flag}</span>
          <span className="font-semibold text-foreground">{tickerLang.nativeName}</span>
          <span className="text-muted-foreground hidden sm:inline">·</span>
          <span className="text-sm text-muted-foreground hidden sm:inline max-w-xs truncate">
            {tickerLang.sample}
          </span>
        </div>
      </div>

      {/* Region tabs */}
      <div className="flex gap-2 justify-center flex-wrap mb-8">
        {REGIONS.map((region, idx) => (
          <button
            key={region.name}
            onClick={() => {
              setActiveRegion(idx);
              setHighlightedLang(null);
            }}
            className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 ${
              activeRegion === idx
                ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                : 'bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
          >
            {region.name}
            <span className="ml-2 text-xs opacity-70">({region.languages.length})</span>
          </button>
        ))}
      </div>

      {/* Language grid for active region */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
        {REGIONS[activeRegion].languages.map((lang) => {
          const isHighlighted = highlightedLang === lang.code;
          return (
            <Card
              key={lang.code}
              onClick={() => setHighlightedLang(isHighlighted ? null : lang.code)}
              className={`cursor-pointer transition-all duration-300 group hover:shadow-lg ${
                isHighlighted
                  ? 'border-primary shadow-lg ring-1 ring-primary/30 scale-[1.02]'
                  : 'border-border hover:border-primary/40'
              }`}
            >
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{lang.flag}</span>
                  <div>
                    <p className="font-bold text-foreground leading-tight">{lang.name}</p>
                    <p className="text-sm text-primary font-medium">{lang.nativeName}</p>
                  </div>
                </div>

                {isHighlighted ? (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                      "{lang.sample}"
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(lang.sample, lang.code);
                        }}
                        className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                      >
                        {copied === lang.code ? (
                          <>
                            <Check className="h-3.5 w-3.5" /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" /> Copy sample
                          </>
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/optimize?lang=${lang.code}`);
                        }}
                        className="inline-flex items-center gap-1.5 text-xs text-accent hover:text-accent/80 font-medium transition-colors"
                      >
                        <ArrowRight className="h-3.5 w-3.5" /> Optimize in {lang.name}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    Tap to see a sample prompt
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Full language strip */}
      <div className="mb-12">
        <p className="text-center text-sm text-muted-foreground mb-4 font-medium uppercase tracking-wider">
          All supported languages
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {ALL_LANGUAGES.map((lang) => (
            <Link
              key={lang.code}
              to={`/optimize?lang=${lang.code}`}
              className="inline-flex items-center gap-1.5 bg-muted/50 border border-border rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-primary/5 transition-colors cursor-pointer"
            >
              <span>{lang.flag}</span>
              {lang.nativeName}
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl p-8 text-center border border-primary/20">
        <h3 className="text-2xl font-bold mb-3">
          Your Language. Your Market. Your Advantage.
        </h3>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          No other prompt tool covers Asia like this. From CJK to Southeast Asian scripts to South Asian languages, every optimization carries cultural context.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button asChild size="lg" className="bg-gradient-primary hover:bg-gradient-primary-hover">
            <Link to="/optimize">
              Start Optimizing <ArrowRight className="h-4 w-4 ml-2" />
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
