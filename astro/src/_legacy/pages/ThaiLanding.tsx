import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Globe, Sparkles, Shield, MessageSquare, Zap, BookOpen } from "lucide-react";

const BENEFITS = [
  { icon: Check, title: "การแปลที่แม่นยำ", desc: "AI เข้าใจบริบทและสร้างพรอมต์ภาษาไทยที่เป็นธรรมชาติและแม่นยำ" },
  { icon: Shield, title: "ความเข้าใจวัฒนธรรม", desc: "เสนอการแสดงออกที่เหมาะสมกับวัฒนธรรมธุรกิจและมารยาทไทย" },
  { icon: MessageSquare, title: "ภาษาธุรกิจ", desc: "เหมาะสำหรับอีเมล รายงาน การนำเสนอ และเอกสารธุรกิจทุกประเภท" },
  { icon: Sparkles, title: "ระดับสุภาพ", desc: "แยกแยะระดับภาษาสุภาพ กึ่งทางการ และทางการได้อย่างถูกต้อง" },
  { icon: Globe, title: "สำนวนธรรมชาติ", desc: "ขจัดความไม่เป็นธรรมชาติของการแปลด้วยเครื่อง ใช้สำนวนที่คนไทยใช้จริง" },
  { icon: Zap, title: "ใช้งานได้ทันที", desc: "ส่งไปยัง ChatGPT, Claude, Gemini และแพลตฟอร์ม AI หลักได้ในคลิกเดียว" },
];

const USE_CASES = [
  { title: "อีเมลธุรกิจที่สุภาพ", desc: "สร้างอีเมลธุรกิจที่ใช้ภาษาสุภาพ มีคำทักทายและคำลงท้ายที่เหมาะสม" },
  { title: "คอนเทนต์โซเชียลมีเดีย", desc: "สร้างโพสต์โซเชียลมีเดียที่โดนใจคนไทย ใช้ภาษาที่เป็นกันเองแต่เหมาะสม" },
  { title: "เอกสารทางเทคนิค", desc: "จัดการคำศัพท์เทคนิคและคำทับศัพท์ภาษาไทยได้อย่างถูกต้อง" },
  { title: "บริการลูกค้า", desc: "เทมเพลตบริการลูกค้าที่สุภาพ เอาใจใส่ และเป็นมืออาชีพ" },
];

const ThaiLanding = () => (
  <div className="min-h-screen bg-background text-foreground">
    <SEO title="AI พรอมต์สำหรับภาษาไทย | PromptAndGo" description="เครื่องมือสร้างพรอมต์ AI สำหรับภาษาไทย รองรับระดับสุภาพ ภาษาธุรกิจ และวัฒนธรรมไทย" canonical="/th" />

    {/* Hero */}
    <section className="relative py-24 px-4 text-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
      <div className="relative max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">🇹🇭 ภาษาไทย</div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">เครื่องมือสร้างพรอมต์ AI<br /><span className="text-primary">สำหรับภาษาเอเชีย</span></h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">PromptAndGo เป็นแพลตฟอร์มเพิ่มประสิทธิภาพพรอมต์ AI ที่เข้าใจระดับสุภาพ มารยาทธุรกิจ และความละเอียดอ่อนทางวัฒนธรรมของภาษาไทย</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/optimize"><Button size="lg" className="gap-2 px-8">เริ่มต้นใช้งานฟรี <ArrowRight className="h-4 w-4" /></Button></Link>
          <Link to="/library"><Button size="lg" variant="outline" className="gap-2 px-8"><BookOpen className="h-4 w-4" /> ค้นหาพรอมต์</Button></Link>
        </div>
      </div>
    </section>

    {/* Benefits */}
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-12">จุดเด่น 6 ประการของ PromptAndGo</h2>
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
        <h2 className="text-2xl font-bold text-center mb-12">กรณีการใช้งานภาษาไทย</h2>
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
        <div className="rounded-xl border border-border bg-card p-8">
          <p className="text-lg italic text-muted-foreground mb-6">"PromptAndGo ช่วยให้ทีมของเราสร้างคอนเทนต์ภาษาไทยได้เร็วขึ้น 3 เท่า โดยยังคงรักษาระดับความสุภาพและน้ำเสียงที่เหมาะสมกับแบรนด์"</p>
          <div>
            <p className="font-semibold">สมชาย วิทยา</p>
            <p className="text-sm text-muted-foreground">ผู้จัดการฝ่ายการตลาดดิจิทัล กรุงเทพฯ</p>
          </div>
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-16 px-4 text-center">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">พร้อมเริ่มต้นแล้วหรือยัง?</h2>
        <p className="text-muted-foreground mb-8">เข้าร่วมผู้ใช้หลายพันคนทั่วเอเชียที่ใช้ PromptAndGo สร้างพรอมต์ AI ที่มีประสิทธิภาพ</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/auth?mode=signup"><Button size="lg" className="gap-2">สมัครฟรี <ArrowRight className="h-4 w-4" /></Button></Link>
          <Link to="/"><Button size="lg" variant="outline">กลับไปหน้าหลัก (English)</Button></Link>
        </div>
      </div>
    </section>
  </div>
);

export default ThaiLanding;
