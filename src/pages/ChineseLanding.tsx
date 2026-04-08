import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Globe, Sparkles, Shield, MessageSquare, Zap, BookOpen } from "lucide-react";

const BENEFITS = [
  { icon: Check, title: "精准翻译", desc: "AI理解语境，生成自然准确的中文提示词，避免机械翻译的生硬感。" },
  { icon: Shield, title: "文化敏感性", desc: "根据中国商务文化和社交礼仪，提供得体的表达方式。" },
  { icon: MessageSquare, title: "商务中文", desc: "邮件、报告、方案等商务场景的专业中文优化。" },
  { icon: Sparkles, title: "礼貌用语", desc: "精准使用敬语、谦辞和正式表达，适配不同商务场合。" },
  { icon: Globe, title: "自然表达", desc: "采用母语者常用的地道表达，消除翻译腔和不自然的用词。" },
  { icon: Zap, title: "即刻可用", desc: "一键发送至ChatGPT、Claude、Gemini等主流AI平台。" },
];

const USE_CASES = [
  { title: "小红书种草文案", desc: "针对中国社交电商平台，生成吸引眼球的产品推荐文案。" },
  { title: "商务邮件撰写", desc: "符合中国商务礼仪的正式邮件和商业函件自动生成。" },
  { title: "技术文档翻译", desc: "准确处理IT专业术语，生成高质量的技术文档。" },
  { title: "客户服务回复", desc: "专业、有温度的客服回复模板，提升客户满意度。" },
];

const ChineseLanding = () => (
  <div className="min-h-screen bg-background text-foreground">
    <SEO title="AI提示词优化 | PromptAndGo 中文版" description="专为中文打造的AI提示词优化工具。支持商务中文、礼貌用语、文化适配，一键优化至ChatGPT、Claude等平台。" canonical="/zh" />

    <section className="relative py-24 px-4 text-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
      <div className="relative max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">🇨🇳 中文版</div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">专为亚洲语言打造的<br /><span className="text-primary">AI提示词</span></h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">PromptAndGo是亚洲唯一理解中文礼貌用语、商务文化和语言细微差别的AI提示词优化平台。</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/optimize"><Button size="lg" className="gap-2 px-8">免费开始 <ArrowRight className="h-4 w-4" /></Button></Link>
          <Link to="/library"><Button size="lg" variant="outline" className="gap-2 px-8"><BookOpen className="h-4 w-4" /> 浏览提示词</Button></Link>
        </div>
      </div>
    </section>

    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-12">PromptAndGo的六大优势</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BENEFITS.map((b) => (
            <div key={b.title} className="rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4"><b.icon className="h-5 w-5 text-primary" /></div>
              <h3 className="font-semibold mb-2">{b.title}</h3>
              <p className="text-sm text-muted-foreground">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-16 px-4 bg-muted/20">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-12">中文使用案例</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {USE_CASES.map((uc) => (
            <div key={uc.title} className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-semibold mb-2">{uc.title}</h3>
              <p className="text-sm text-muted-foreground">{uc.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-16 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <blockquote className="text-lg italic mb-4">"使用PromptAndGo后，我们的营销内容创作效率提升了65%。中文表达自然地道，完全不像机器翻译。"</blockquote>
        <p className="font-semibold">李明</p>
        <p className="text-sm text-muted-foreground">上海数字营销经理</p>
      </div>
    </section>

    <section className="py-16 px-4 text-center">
      <h2 className="text-2xl font-bold mb-4">立即开始使用</h2>
      <p className="text-muted-foreground mb-6">无需注册，立即开始优化您的提示词。</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/optimize"><Button size="lg" className="gap-2">免费优化提示词 <Zap className="h-4 w-4" /></Button></Link>
        <Link to="/"><Button size="lg" variant="outline">返回English版</Button></Link>
      </div>
    </section>
  </div>
);

export default ChineseLanding;
