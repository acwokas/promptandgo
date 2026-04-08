import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Globe, Sparkles, Shield, MessageSquare, Zap, BookOpen } from "lucide-react";

const BENEFITS = [
  { icon: Check, title: "정확한 번역", desc: "AI가 문맥을 이해하고 자연스럽고 정확한 한국어 프롬프트를 생성합니다." },
  { icon: Shield, title: "문화적 배려", desc: "한국의 비즈니스 문화와 예절에 맞는 적절한 표현을 제안합니다." },
  { icon: MessageSquare, title: "비즈니스 한국어", desc: "이메일, 보고서, 프레젠테이션 등 비즈니스 상황에 최적화합니다." },
  { icon: Sparkles, title: "존댓말 지원", desc: "격식체와 비격식체를 정확하게 구분하여 프롬프트를 생성합니다." },
  { icon: Globe, title: "자연스러운 표현", desc: "기계 번역의 어색함 없이 원어민이 사용하는 자연스러운 표현을 채택합니다." },
  { icon: Zap, title: "바로 사용 가능", desc: "ChatGPT, Claude, Gemini 등 주요 AI 플랫폼에 원클릭으로 전송합니다." },
];

const USE_CASES = [
  { title: "비즈니스 이메일 작성", desc: "존댓말과 적절한 격식을 갖춘 비즈니스 이메일을 자동으로 생성합니다." },
  { title: "마케팅 카피 최적화", desc: "한국 시장에 맞는 광고 문구, SNS 게시물, 보도자료를 최적화합니다." },
  { title: "학술 논문 작성", desc: "학술적 문체와 전문 용어를 정확하게 사용한 논문 초록 및 본문 생성." },
  { title: "고객 서비스 템플릿", desc: "정중하고 공감적인 한국어 고객 서비스 응대 템플릿을 제공합니다." },
];

const KoreanLanding = () => (
  <div className="min-h-screen bg-background text-foreground">
    <SEO title="AI 프롬프트 최적화 | PromptAndGo 한국어" description="한국어에 특화된 AI 프롬프트 최적화 도구. 존댓말, 비즈니스 한국어, 문화적 배려를 완벽 지원합니다." canonical="/ko" />

    <section className="relative py-24 px-4 text-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
      <div className="relative max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">🇰🇷 한국어판</div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">아시아 언어를 위한<br /><span className="text-primary">AI 프롬프트</span></h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">PromptAndGo는 한국어의 존댓말, 비즈니스 매너, 문화적 뉘앙스를 이해하는 아시아 유일의 AI 프롬프트 최적화 플랫폼입니다.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/optimize"><Button size="lg" className="gap-2 px-8">무료로 시작하기 <ArrowRight className="h-4 w-4" /></Button></Link>
          <Link to="/library"><Button size="lg" variant="outline" className="gap-2 px-8"><BookOpen className="h-4 w-4" /> 프롬프트 탐색</Button></Link>
        </div>
      </div>
    </section>

    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-12">PromptAndGo의 6가지 장점</h2>
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
        <h2 className="text-2xl font-bold text-center mb-12">한국어 활용 사례</h2>
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
        <blockquote className="text-lg italic mb-4">"PromptAndGo를 사용한 후 콘텐츠 제작 시간이 60% 단축되었습니다. 존댓말 처리가 완벽하고, 한국 시장에 맞는 표현을 정확하게 제안해줍니다."</blockquote>
        <p className="font-semibold">김민수</p>
        <p className="text-sm text-muted-foreground">서울의 콘텐츠 디렉터</p>
      </div>
    </section>

    <section className="py-16 px-4 text-center">
      <h2 className="text-2xl font-bold mb-4">지금 바로 시작하세요</h2>
      <p className="text-muted-foreground mb-6">가입 없이 바로 프롬프트 최적화를 시작할 수 있습니다.</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/optimize"><Button size="lg" className="gap-2">무료로 최적화하기 <Zap className="h-4 w-4" /></Button></Link>
        <Link to="/"><Button size="lg" variant="outline">English 버전으로 돌아가기</Button></Link>
      </div>
    </section>
  </div>
);

export default KoreanLanding;
