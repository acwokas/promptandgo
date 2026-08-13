import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Globe, Sparkles, Shield, MessageSquare, Zap, BookOpen } from "lucide-react";

const BENEFITS = [
  { icon: Check, title: "正確な翻訳", desc: "AIが文脈を理解し、自然で正確な日本語プロンプトを生成します。" },
  { icon: Shield, title: "文化的配慮", desc: "日本のビジネス文化やマナーに合わせた適切な表現を提案します。" },
  { icon: MessageSquare, title: "ビジネス日本語", desc: "メール、報告書、プレゼン資料など、ビジネスシーンに最適化。" },
  { icon: Sparkles, title: "敬語対応", desc: "丁寧語、尊敬語、謙譲語を正確に使い分けたプロンプト生成。" },
  { icon: Globe, title: "自然な表現", desc: "機械翻訳のような不自然さを排除し、ネイティブが使う表現を採用。" },
  { icon: Zap, title: "即座に使える", desc: "ChatGPT、Claude、Geminiなど主要AIプラットフォームにワンクリック。" },
];

const USE_CASES = [
  { title: "取引先への敬語メール", desc: "季節の挨拶、適切な敬語レベル、ビジネスマナーを踏まえたメール作成。" },
  { title: "マーケティングコピー", desc: "日本市場向けの広告文、SNS投稿、プレスリリースの最適化。" },
  { title: "技術文書の翻訳", desc: "IT用語、専門用語を正確に扱った技術ドキュメントの生成。" },
  { title: "カスタマーサポート", desc: "丁寧で共感的な日本語のカスタマーサポートテンプレート。" },
];

const JapaneseLanding = () => (
  <div className="min-h-screen bg-background text-foreground">
    <SEO title="AIプロンプト最適化 | PromptAndGo 日本語" description="日本語に特化したAIプロンプト最適化ツール。敬語、ビジネス日本語、文化的配慮を完全サポート。" canonical="/ja" />

    {/* Hero */}
    <section className="relative py-24 px-4 text-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
      <div className="relative max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">🇯🇵 日本語版</div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">アジア言語に特化した<br /><span className="text-primary">AIプロンプト</span></h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">PromptAndGoは、日本語の敬語、ビジネスマナー、文化的ニュアンスを理解するアジア唯一のAIプロンプト最適化プラットフォームです。</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/optimize"><Button size="lg" className="gap-2 px-8">無料で始める <ArrowRight className="h-4 w-4" /></Button></Link>
          <Link to="/library"><Button size="lg" variant="outline" className="gap-2 px-8"><BookOpen className="h-4 w-4" /> プロンプトを探す</Button></Link>
        </div>
      </div>
    </section>

    {/* Benefits */}
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-12">PromptAndGoの6つの強み</h2>
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

    {/* Use Cases */}
    <section className="py-16 px-4 bg-muted/20">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-12">日本語の活用事例</h2>
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

    {/* Testimonial */}
    <section className="py-16 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <blockquote className="text-lg italic mb-4">"PromptAndGoを使い始めてから、取引先へのメール作成時間が70%短縮されました。敬語の使い分けが完璧で、安心して使えます。"</blockquote>
        <p className="font-semibold">田中太郎</p>
        <p className="text-sm text-muted-foreground">東京のマーケティングマネージャー</p>
      </div>
    </section>

    {/* CTA */}
    <section className="py-16 px-4 text-center">
      <h2 className="text-2xl font-bold mb-4">今すぐ始めましょう</h2>
      <p className="text-muted-foreground mb-6">登録不要。すぐにプロンプトの最適化を開始できます。</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/optimize"><Button size="lg" className="gap-2">無料で最適化する <Zap className="h-4 w-4" /></Button></Link>
        <Link to="/"><Button size="lg" variant="outline">English版に戻る</Button></Link>
      </div>
    </section>
  </div>
);

export default JapaneseLanding;
