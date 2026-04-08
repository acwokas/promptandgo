import React, { Fragment, useEffect, useState } from "react";
import SEO from "@/components/SEO";
import { PromptFilters } from "@/components/prompt/PromptFilters";
import { PromptCard } from "@/components/prompt/PromptCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PageHero from "@/components/layout/PageHero";
import CountdownTimer from "@/components/conversion/CountdownTimer";
import { Link } from "react-router-dom";
import { Search, Heart, Globe, Sparkles, Flame, Monitor, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { PromptStudioCTA } from "@/components/ui/prompt-studio-cta";
import { SearchUpsellPacks } from "@/components/library/SearchUpsellPacks";
import { useIsMobile } from "@/hooks/use-mobile";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import { usePromptLibrary, sortByComplexity } from "@/hooks/usePromptLibrary";
import { PopularCategories } from "@/components/library/PopularCategories";
import { QuickDiscoverySection } from "@/components/library/QuickDiscoverySection";

const PLATFORMS = [
  { id: "all", name: "All Platforms" },
  { id: "chatgpt", name: "ChatGPT", badge: "G", color: "bg-[hsl(160,82%,35%)]" },
  { id: "claude", name: "Claude", badge: "C", color: "bg-[hsl(348,76%,59%)]" },
  { id: "gemini", name: "Gemini", badge: "G", color: "bg-[hsl(174,82%,33%)]" },
  { id: "deepseek", name: "DeepSeek", badge: "D", color: "bg-[hsl(220,60%,50%)]" },
  { id: "qwen", name: "Qwen", badge: "Q", color: "bg-[hsl(260,50%,55%)]" },
  { id: "ernie", name: "Ernie", badge: "E", color: "bg-[hsl(210,80%,45%)]" },
  { id: "baidu", name: "Baidu", badge: "B", color: "bg-[hsl(210,90%,50%)]" },
  { id: "midjourney", name: "MidJourney", badge: "M", color: "bg-[hsl(240,20%,20%)]" },
  { id: "perplexity", name: "Perplexity", badge: "P", color: "bg-[hsl(200,60%,45%)]" },
];

const LANGUAGES = [
  { id: "all", name: "All Languages", flag: "🌐" },
  { id: "en", name: "English", flag: "🇬🇧" },
  { id: "zh", name: "Chinese", flag: "🇨🇳" },
  { id: "ja", name: "Japanese", flag: "🇯🇵" },
  { id: "ko", name: "Korean", flag: "🇰🇷" },
  { id: "th", name: "Thai", flag: "🇹🇭" },
  { id: "vi", name: "Vietnamese", flag: "🇻🇳" },
  { id: "id", name: "Indonesian", flag: "🇮🇩" },
  { id: "ms", name: "Malay", flag: "🇲🇾" },
  { id: "hi", name: "Hindi", flag: "🇮🇳" },
  { id: "ta", name: "Tamil", flag: "🇱🇰" },
  { id: "tl", name: "Tagalog", flag: "🇵🇭" },
  { id: "bn", name: "Bengali", flag: "🇧🇩" },
  { id: "km", name: "Khmer", flag: "🇰🇭" },
];

// Native-script prompt examples shown when a language filter is active
const NATIVE_PROMPTS: Record<string, Array<{ title: string; prompt: string; category: string }>> = {
  id: [
    { title: "Copywriting Iklan Instagram", prompt: "Buatkan copywriting iklan Instagram untuk peluncuran produk skincare lokal yang ramah lingkungan, termasuk caption dan hashtag yang sedang tren", category: "Marketing" },
    { title: "Email Proposal Bisnis", prompt: "Tulis email proposal kerjasama bisnis B2B kepada perusahaan distribusi FMCG di Jakarta, dengan nada profesional dan meyakinkan", category: "Business" },
    { title: "Deskripsi Produk Tokopedia", prompt: "Buat deskripsi produk yang menarik untuk tas kulit handmade di Tokopedia, sertakan keunggulan bahan dan cara perawatan", category: "E-commerce" },
  ],
  vi: [
    { title: "Email Đề Xuất Hợp Tác", prompt: "Soạn email chuyên nghiệp gửi đối tác về đề xuất hợp tác kinh doanh xuất nhập khẩu nông sản Việt Nam sang thị trường châu Âu", category: "Business" },
    { title: "Bài Đăng Mạng Xã Hội", prompt: "Viết bài đăng Facebook thu hút cho quán cà phê mới khai trương tại Sài Gòn, kèm kêu gọi check-in và chia sẻ", category: "Social Media" },
    { title: "Mô Tả Sản Phẩm Shopee", prompt: "Tạo mô tả sản phẩm hấp dẫn cho áo dài thiết kế bán trên Shopee, nhấn mạnh chất liệu lụa tơ tằm và tay nghề thủ công", category: "E-commerce" },
  ],
  zh: [
    { title: "小红书种草文案", prompt: "帮我写一条小红书种草文案，推荐一款适合亚洲肌肤的防晒霜，包含使用体验和适合的肤质说明", category: "Social Media" },
    { title: "产品发布会邀请函", prompt: "为科技公司新品发布会撰写一封正式的中文邀请函，面向行业媒体和合作伙伴", category: "Business" },
    { title: "淘宝商品描述", prompt: "为一款智能手表撰写淘宝详情页文案，突出健康监测功能和性价比优势", category: "E-commerce" },
  ],
  ja: [
    { title: "敬語お詫びメール", prompt: "取引先への敬語を使った納期延長のお詫びメールを作成してください。原因説明と改善策を含めてください", category: "Business" },
    { title: "商品レビュー依頼", prompt: "Amazonで購入した美容家電の詳細なレビューを書いてください。使用感、メリット・デメリットを含めて", category: "E-commerce" },
    { title: "採用ページ文面", prompt: "IT企業のエンジニア採用ページ用のキャッチコピーと職場環境紹介文を作成してください", category: "Business" },
  ],
  ko: [
    { title: "쿠팡 상품 리뷰", prompt: "신제품 블루투스 이어폰에 대한 상세한 쿠팡 리뷰를 작성해주세요. 음질, 배터리, 착용감을 포함해서", category: "E-commerce" },
    { title: "인스타그램 브랜드 소개", prompt: "한국 스킨케어 브랜드의 인스타그램 소개글을 작성해주세요. 브랜드 철학과 주요 성분을 강조해서", category: "Social Media" },
    { title: "비즈니스 제안서", prompt: "중소기업 대상 클라우드 서비스 도입 제안서의 핵심 내용을 작성해주세요", category: "Business" },
  ],
  th: [
    { title: "ตอบลูกค้าไม่พอใจ", prompt: "เขียนข้อความตอบลูกค้าที่ไม่พอใจสินค้าใน Shopee โดยใช้ภาษาสุภาพ เสนอทางแก้ไขและชดเชย", category: "Customer Service" },
    { title: "โพสต์ Facebook โปรโมชั่น", prompt: "เขียนโพสต์ Facebook สำหรับร้านอาหารที่มีโปรโมชั่นพิเศษวันเกิด ให้น่าสนใจและชวนแชร์", category: "Social Media" },
    { title: "รายละเอียดสินค้า Lazada", prompt: "เขียนรายละเอียดสินค้ากระเป๋าหนังแท้แฮนด์เมดสำหรับขายใน Lazada เน้นคุณภาพวัสดุและงานฝีมือ", category: "E-commerce" },
  ],
  hi: [
    { title: "ब्लॉग रूपरेखा", prompt: "डिजिटल मार्केटिंग पर एक विस्तृत ब्लॉग की रूपरेखा तैयार करें जो छोटे व्यवसायों के लिए हो, SEO और सोशल मीडिया रणनीति शामिल करें", category: "Content" },
    { title: "ग्राहक सेवा टेम्पलेट", prompt: "ई-कॉमर्स वेबसाइट के लिए हिंदी में ग्राहक शिकायत का जवाब देने का एक पेशेवर टेम्पलेट बनाएं", category: "Customer Service" },
    { title: "जॉब पोस्टिंग", prompt: "एक सॉफ्टवेयर डेवलपर पद के लिए LinkedIn पर हिंदी में नौकरी का विज्ञापन लिखें", category: "Business" },
  ],
  ta: [
    { title: "வேலை விளம்பரம்", prompt: "ஒரு மென்பொருள் நிறுவனத்திற்கான ஜூனியர் டெவலப்பர் வேலை விளம்பரம் எழுதுங்கள்", category: "Business" },
    { title: "தயாரிப்பு விளக்கம்", prompt: "இயற்கை அழகுசாதனப் பொருளின் விரிவான தயாரிப்பு விளக்கத்தை எழுதுங்கள்", category: "E-commerce" },
    { title: "வலைப்பதிவு அறிமுகம்", prompt: "சிறு தொழில் உரிமையாளர்களுக்கான டிஜிட்டல் மார்க்கெட்டிங் வலைப்பதிவு அறிமுகம் எழுதுங்கள்", category: "Content" },
  ],
  tl: [
    { title: "Product Description", prompt: "Gumawa ng product description para sa online shop ng handmade na bag na gawa sa abaca, i-highlight ang pagiging eco-friendly", category: "E-commerce" },
    { title: "Social Media Post", prompt: "Sumulat ng engaging Facebook post para sa bagong bukas na milk tea shop sa Makati, kasama ang promo para sa grand opening", category: "Social Media" },
    { title: "Customer Service Reply", prompt: "Gumawa ng magalang na reply sa customer na nagrereklamo tungkol sa late delivery sa Lazada", category: "Customer Service" },
  ],
  bn: [
    { title: "গ্রাহক সেবা টেমপ্লেট", prompt: "আমাদের ই-কমার্স সাইটের জন্য একটি গ্রাহক সেবা প্রতিক্রিয়া টেমপ্লেট তৈরি করুন যা বিলম্বিত ডেলিভারির জন্য ক্ষমা চায়", category: "Customer Service" },
    { title: "ব্লগ পরিচিতি", prompt: "ফ্রিল্যান্সিং নিয়ে বাংলায় একটি ব্লগ পোস্টের ভূমিকা লিখুন যা নতুনদের জন্য", category: "Content" },
    { title: "পণ্যের বিবরণ", prompt: "দারাজে বিক্রির জন্য হাতে বোনা শাড়ির একটি আকর্ষণীয় পণ্যের বিবরণ লিখুন", category: "E-commerce" },
  ],
  km: [
    { title: "ការពិពណ៌នាផលិតផល", prompt: "សរសេរការពិពណ៌នាផលិតផលសម្រាប់ហាងអនឡាញលក់សម្លៀកបំពាក់ ដែលផ្តោតលើគុណភាពក្រណាត់និងការរចនា", category: "E-commerce" },
    { title: "ការឆ្លើយតបអតិថិជន", prompt: "សរសេរសារឆ្លើយតបអតិថិជនដែលមិនពេញចិត្តនឹងសេវាកម្ម ដោយប្រើភាសាគួរសមនិងផ្តល់ដំណោះស្រាយ", category: "Customer Service" },
    { title: "ប្រកាសហ្វេសប៊ុក", prompt: "សរសេរប្រកាសហ្វេសប៊ុកសម្រាប់ភោជនីយដ្ឋានថ្មីក្នុងភ្នំពេញ ដើម្បីទាក់ទាញអតិថិជន", category: "Social Media" },
  ],
  ms: [
    { title: "Agenda Mesyuarat", prompt: "Sediakan agenda mesyuarat bulanan pasukan jualan termasuk KPI, pencapaian suku tahun dan sasaran akan datang", category: "Business" },
    { title: "Posting Media Sosial", prompt: "Tulis posting Instagram untuk kedai kopi artisan baru di Kuala Lumpur, sertakan hashtag popular Malaysia", category: "Social Media" },
    { title: "Deskripsi Produk Shopee", prompt: "Buat deskripsi produk untuk beg tangan kulit buatan tangan di Shopee Malaysia, tekankan kualiti dan ketahanan", category: "E-commerce" },
  ],
};

const ASIA_CATEGORIES = [
  { label: "E-commerce", query: "ecommerce", icon: "🛒" },
  { label: "Social Media", query: "social media", icon: "📱" },
  { label: "Education", query: "education", icon: "🎓" },
  { label: "Business", query: "business", icon: "💼" },
  { label: "Creative", query: "creative", icon: "🎨" },
  { label: "Marketing", query: "marketing", icon: "📣" },
];

const CATEGORY_FILTERS = [
  { label: "Business & Marketing", query: "business marketing", icon: "💼", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
  { label: "Customer Service", query: "customer service support", icon: "🎧", color: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20" },
  { label: "Content Creation", query: "content writing blog", icon: "✍️", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20" },
  { label: "Education & Training", query: "education training learning", icon: "🎓", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" },
  { label: "Technical & Dev", query: "technical development code", icon: "💻", color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20" },
  { label: "Creative Writing", query: "creative writing story", icon: "🎨", color: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20" },
  { label: "Data & Analytics", query: "data analytics analysis", icon: "📊", color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20" },
  { label: "Social Media", query: "social media instagram", icon: "📱", color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20" },
  { label: "E-commerce", query: "ecommerce product shopee", icon: "🛒", color: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20" },
  { label: "HR & Recruitment", query: "HR recruitment hiring job", icon: "👥", color: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20" },
];

const PromptLibrary = () => {
  const isMobile = useIsMobile();
  const [platform, setPlatform] = useState("all");
  const [language, setLanguage] = useState("all");
  const [asianContext, setAsianContext] = useState(false);

  const {
    user,
    categories,
    categoryId, setCategoryId,
    subcategoryId, setSubcategoryId,
    query, setQuery,
    selectedTag, setSelectedTag,
    searchParams, setSearchParams,
    location,
    includePro, setIncludePro,
    proOnly, setProOnly,
    ribbon, setRibbon,
    userExplicitlySelectedAll, setUserExplicitlySelectedAll,
    defaultAIProvider,
    page, setPage,
    items,
    hasMore,
    loading,
    listRef,
    personalizedPrompts,
    hasPersonalization,
    personalizationLoading,
    clearRandom,
    refresh,
    loadMore,
  } = usePromptLibrary();

  useEffect(() => {
    if (location.hash) {
      const timeoutId = setTimeout(() => {
        const element = document.getElementById(location.hash.slice(1));
        if (element) {
          const header = document.querySelector('header');
          const headerHeight = header ? (header as HTMLElement).getBoundingClientRect().height : 0;
          const y = element.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [location.hash]);

  const handleCategoryClick = (searchQuery: string) => {
    clearRandom();
    setQuery(searchQuery);
    setCategoryId(undefined);
    setSubcategoryId(undefined);
    setRibbon(undefined);
  };

  const handleFilterChange = (n: any) => {
    clearRandom();
    const newSearchParams = new URLSearchParams(searchParams);
    
    if ('categoryId' in n) {
      setCategoryId(n.categoryId || undefined);
      if (n.categoryId) newSearchParams.set('categoryId', n.categoryId);
      else newSearchParams.delete('categoryId');
      setSubcategoryId(undefined);
      newSearchParams.delete('subcategoryId');
      setRibbon(undefined);
      setUserExplicitlySelectedAll(false);
      newSearchParams.delete('ribbon');
    }
    
    if ('subcategoryId' in n) {
      setSubcategoryId(n.subcategoryId || undefined);
      if (n.subcategoryId) newSearchParams.set('subcategoryId', n.subcategoryId);
      else newSearchParams.delete('subcategoryId');
    }
    
    if (n.query !== undefined) {
      setQuery(n.query);
      setSelectedTag(undefined);
      if (n.query) newSearchParams.set('q', n.query);
      else newSearchParams.delete('q');
      setRibbon(undefined);
      setUserExplicitlySelectedAll(false);
      newSearchParams.delete('ribbon');
    }
    
    if (n.includePro !== undefined) setIncludePro(!!n.includePro);
    
    if ('ribbon' in n) {
      setRibbon(n.ribbon || undefined);
      if (!n.ribbon) setUserExplicitlySelectedAll(true);
      else setUserExplicitlySelectedAll(false);
      if (n.ribbon) newSearchParams.set('ribbon', n.ribbon);
      else newSearchParams.delete('ribbon');
    }
    
    setSearchParams(newSearchParams, { replace: true });
  };

  const handleClear = () => {
    clearRandom();
    setCategoryId(undefined);
    setSubcategoryId(undefined);
    setQuery("");
    setSelectedTag(undefined);
    setProOnly(false);
    setIncludePro(true);
    setPage(1);
    setUserExplicitlySelectedAll(true);
    setRibbon(undefined);
    setPlatform("all");
    setLanguage("all");
    setAsianContext(false);
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  const getTitleAndDescription = () => {
    switch (ribbon) {
      case "RECOMMENDED": return { title: "🎯 Recommended for You", description: "Based on your preferences and goals" };
      case "MOST_POPULAR": return { title: "🔥 Most Popular", description: "Top prompts loved by our community" };
      case "NEW_PROMPTS": return { title: "✨ New Prompts", description: "Fresh additions to our library" };
      case "TRENDING": return { title: "📈 Trending", description: "Gaining popularity right now" };
      case "HIGHEST_RATED": return { title: "⭐ Highest Rated", description: "Top-rated prompts by users" };
      case "MOST_COPIED": return { title: "📋 Most Copied", description: "Frequently used prompts" };
      default: return hasPersonalization && personalizedPrompts.length > 0 
        ? { title: "All Prompts", description: "Browse our complete collection" }
        : { title: "Browse All Prompts", description: "Discover our complete collection of AI prompts" };
    }
  };

  const libraryStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "AI Prompts Library",
    description: "Discover thousands of ready-to-use AI prompts for ChatGPT, Claude, and more.",
    numberOfItems: items.length,
  };

  return (
    <>
      <SEO
        title="Browse 3,000+ AI Prompts | Free for ChatGPT, Claude, Gemini | PromptAndGo"
        description="Explore 3,000+ free AI prompts organised by category. Optimised for ChatGPT, Claude, MidJourney, Gemini and more. Copy, customise, and get better results from any AI tool."
        canonical="https://promptandgo.ai/library"
        structuredData={libraryStructuredData}
      />
      <PageHero
        variant="prompt"
        title={<><span className="text-gradient-brand">Prompt</span> Library</>}
        subtitle={<>Find the perfect prompt fast: browse free prompts by category, save your favourites in <Link to="/account/favorites" className="text-accent hover:underline">My Prompts</Link>, or <Link to="/cart" className="text-accent hover:underline">subscribe</Link> to unlock all premium items.</>}
      >
        <Button asChild size="lg" variant="hero" className="px-6">
          <a href="#library-filters"><Search className="h-4 w-4 mr-2" />Browse Prompt Library</a>
        </Button>
        <Button asChild size="lg" variant="inverted"><Link to="/packs">⚡️Power Packs</Link></Button>
        {user ? (
          <Button asChild size="lg" variant="secondary"><Link to="/account/favorites"><Heart className="h-4 w-4 mr-2" />My Prompts</Link></Button>
        ) : (
          <Button asChild size="lg" variant="outline"><Link to="/auth">Login</Link></Button>
        )}
      </PageHero>

      {/* Multi-platform banner */}
      <section className="bg-hero border-b border-white/10">
        <div className="container max-w-6xl mx-auto px-4 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-accent" />
                <span className="text-sm font-semibold text-white">Every prompt optimized for any platform, any language.</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {PLATFORMS.filter(p => p.id !== "all").map((p) => (
                <div
                  key={p.id}
                  title={p.name}
                  className={`w-6 h-6 rounded ${p.color} flex items-center justify-center text-white text-[10px] font-bold opacity-70`}
                >
                  {p.badge}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main className="container py-10">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Browse Library</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Category filter badges */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-semibold text-foreground">Browse by Category</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_FILTERS.map((cat) => (
              <button
                key={cat.label}
                onClick={() => handleCategoryClick(cat.query)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border hover:opacity-80 transition-colors ${cat.color}`}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* Asian market category tags */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Flame className="h-4 w-4 text-accent" />
            <span className="text-sm font-semibold text-foreground">Popular in Asian markets</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {ASIA_CATEGORIES.map((cat) => (
              <button
                key={cat.query}
                onClick={() => handleCategoryClick(cat.query)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 hover:border-accent/40 transition-colors"
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* Platform, Language, Asian Context filters */}
        <section className="mb-6">
          <div className="rounded-xl bg-muted/30 border border-border p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
              {/* Platform filter */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Monitor className="h-3 w-3" />
                  Platform
                </Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger className="bg-background border-border h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        <span className="flex items-center gap-2">
                          {p.badge && (
                            <span className={`w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center text-white ${p.color}`}>
                              {p.badge}
                            </span>
                          )}
                          {p.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Language filter */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Globe className="h-3 w-3" />
                  Language
                </Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="bg-background border-border h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((l) => (
                      <SelectItem key={l.id} value={l.id}>
                        <span className="flex items-center gap-2">
                          <span>{l.flag}</span>
                          {l.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Asian Context toggle */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Asian Context</Label>
                <div className="flex items-center gap-2 h-9 px-3 rounded-md border border-border bg-background">
                  <Switch
                    checked={asianContext}
                    onCheckedChange={setAsianContext}
                    className="data-[state=checked]:bg-accent"
                  />
                  <span className="text-sm text-muted-foreground">
                    {asianContext ? "On" : "Off"}
                  </span>
                  {asianContext && (
                    <span className="ml-auto text-[10px] font-bold text-accent bg-accent/10 px-1.5 py-0.5 rounded">ASIA</span>
                  )}
                </div>
              </div>

              {/* Active filter summary */}
              <div className="flex items-end h-full">
                {(platform !== "all" || language !== "all" || asianContext) && (
                  <button
                    onClick={() => { setPlatform("all"); setLanguage("all"); setAsianContext(false); }}
                    className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 pb-2"
                  >
                    Clear platform filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Native-script prompt examples when a language is selected */}
        {language !== "all" && language !== "en" && NATIVE_PROMPTS[language] && (
          <section className="mb-6">
            <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">
                  {LANGUAGES.find(l => l.id === language)?.flag} Prompts in {LANGUAGES.find(l => l.id === language)?.name}
                </span>
                <Badge variant="outline" className="text-[10px]">Native Script</Badge>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {NATIVE_PROMPTS[language].map((np, idx) => (
                  <Card key={idx} className="bg-background border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-[10px]">{np.category}</Badge>
                      </div>
                      <h4 className="font-semibold text-sm mb-2">{np.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{np.prompt}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 h-7 text-xs text-primary"
                        onClick={() => {
                          navigator.clipboard.writeText(np.prompt);
                          toast({ title: "Copied!", description: "Prompt copied to clipboard" });
                        }}
                      >
                        <Copy className="h-3 w-3 mr-1" /> Copy
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}
        {/* Browse & Search Section */}
        <section className="mb-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <PopularCategories onCategoryClick={handleCategoryClick} />
            <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Can't find what you need?</h3>
                <p className="text-sm text-muted-foreground mb-3">Let Scout generate a custom prompt tailored to your specific needs.</p>
                <Button asChild size="sm" className="w-full"><Link to="/prompt-studio">Open Prompt Studio</Link></Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Filters */}
        <section id="library-filters" className="mb-6 scroll-mt-20">
          <div className="bg-muted/30 rounded-xl p-4 border">
            <PromptFilters
              categories={categories}
              categoryId={categoryId}
              subcategoryId={subcategoryId}
              query={query}
              includePro={includePro}
              proOnly={proOnly}
              ribbon={ribbon}
              onChange={handleFilterChange}
              onSearch={() => { clearRandom(); refresh(); }}
              onClear={handleClear}
            />
          </div>
        </section>

        {/* Personalized Recommendations */}
        {hasPersonalization && personalizedPrompts.length > 0 && !categoryId && !subcategoryId && !query && !selectedTag && !ribbon && (
          <section className="mt-8 mb-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-foreground">🎯 Recommended for You</h2>
              <p className="text-sm text-muted-foreground mt-1">Based on your preferences and goals</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sortByComplexity(personalizedPrompts).map((p) => (
                <PromptCard key={p.id} prompt={p as any} categories={categories} defaultAIProvider={defaultAIProvider} />
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                Want different recommendations? Update preferences in <Link to="/account/profile" className="text-primary hover:underline">Account → Profile</Link>
              </p>
            </div>
          </section>
        )}

        {/* Search Upsell */}
        {query.trim().length >= 2 && <div className="mb-6"><SearchUpsellPacks searchQuery={query} /></div>}

        {/* Results */}
        <section className="mt-0 pt-6">
          {(() => {
            const { title, description } = getTitleAndDescription();
            return (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">{title}</h2>
                <p className="text-muted-foreground text-sm">{description}</p>
              </div>
            );
          })()}

          <div id="library-results" ref={listRef} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 scroll-mt-40 md:scroll-mt-48">
            {ribbon === "RECOMMENDED" && hasPersonalization && personalizedPrompts.length > 0 ? (
              sortByComplexity(personalizedPrompts).map((p) => (
                <PromptCard key={p.id} prompt={p as any} categories={categories} defaultAIProvider={defaultAIProvider} />
              ))
            ) : (
              items.map((p, index) => (
                <Fragment key={p.id}>
                  <PromptCard prompt={p as any} categories={categories} defaultAIProvider={defaultAIProvider} />
                  {(index + 1) % 6 === 0 && index < items.length - 1 && (
                    <div className="sm:col-span-2 lg:col-span-3"><PromptStudioCTA variant="inline" /></div>
                  )}
                </Fragment>
              ))
            )}
          </div>
        </section>

        {hasMore && (
          <div className="flex justify-center mt-8 mb-4">
            <Button variant="secondary" onClick={loadMore} disabled={loading} className="sticky bottom-4 z-30 shadow-lg">
              {loading ? "Loading..." : "Load more"}
            </Button>
          </div>
        )}

        <QuickDiscoverySection onSearchClick={handleCategoryClick} />

        {/* Submit Prompt CTA */}
        <section className="mt-12 mb-8 text-center">
          <Card className="bg-gradient-to-br from-accent/10 to-primary/5 border-accent/20">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold mb-2">Have a great prompt to share?</h3>
              <p className="text-muted-foreground mb-4">Help the community by submitting your best prompts.</p>
              <Button asChild><Link to="/submit-prompt">Submit a Prompt</Link></Button>
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
};

export default PromptLibrary;
