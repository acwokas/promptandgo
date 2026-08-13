import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Globe, Sparkles, Shield, MessageSquare, Zap, BookOpen } from "lucide-react";

const BENEFITS = [
  { icon: Check, title: "Dịch chính xác", desc: "AI hiểu ngữ cảnh và tạo prompt tiếng Việt tự nhiên, chính xác." },
  { icon: Shield, title: "Nhạy cảm văn hóa", desc: "Đề xuất cách diễn đạt phù hợp với văn hóa kinh doanh và phong tục Việt Nam." },
  { icon: MessageSquare, title: "Tiếng Việt thương mại", desc: "Tối ưu cho email, báo cáo, thuyết trình và mọi tài liệu doanh nghiệp." },
  { icon: Sparkles, title: "Kính ngữ phù hợp", desc: "Phân biệt chính xác các mức độ trang trọng: anh/chị, quý khách, thưa ông/bà." },
  { icon: Globe, title: "Diễn đạt tự nhiên", desc: "Loại bỏ sự thiếu tự nhiên của dịch máy, sử dụng cách nói người Việt thực sự dùng." },
  { icon: Zap, title: "Sẵn sàng sử dụng", desc: "Gửi đến ChatGPT, Claude, Gemini và các nền tảng AI lớn chỉ trong một cú nhấp." },
];

const USE_CASES = [
  { title: "Email doanh nghiệp lịch sự", desc: "Tạo email chuyên nghiệp với lời chào và kết thúc phù hợp theo phong cách Việt Nam." },
  { title: "Nội dung mạng xã hội", desc: "Tạo bài đăng trên Zalo, Facebook phù hợp với người dùng Việt Nam." },
  { title: "Tài liệu kỹ thuật", desc: "Xử lý thuật ngữ chuyên ngành và từ mượn tiếng Anh trong văn bản tiếng Việt chính xác." },
  { title: "Chăm sóc khách hàng", desc: "Mẫu phản hồi khách hàng lịch sự, chu đáo và chuyên nghiệp." },
];

const VietnameseLanding = () => (
  <div className="min-h-screen bg-background text-foreground">
    <SEO title="Prompt AI cho tiếng Việt | PromptAndGo" description="Công cụ tạo prompt AI cho tiếng Việt. Hỗ trợ kính ngữ, tiếng Việt thương mại và nhạy cảm văn hóa." canonical="/vi" />

    {/* Hero */}
    <section className="relative py-24 px-4 text-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
      <div className="relative max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">🇻🇳 Tiếng Việt</div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">Công cụ tạo prompt AI<br /><span className="text-primary">cho ngôn ngữ châu Á</span></h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">PromptAndGo là nền tảng tối ưu hóa prompt AI duy nhất hiểu được kính ngữ, phong cách kinh doanh và sắc thái văn hóa của tiếng Việt.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/optimize"><Button size="lg" className="gap-2 px-8">Bắt đầu miễn phí <ArrowRight className="h-4 w-4" /></Button></Link>
          <Link to="/library"><Button size="lg" variant="outline" className="gap-2 px-8"><BookOpen className="h-4 w-4" /> Khám phá prompt</Button></Link>
        </div>
      </div>
    </section>

    {/* Benefits */}
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-12">6 điểm mạnh của PromptAndGo</h2>
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
        <h2 className="text-2xl font-bold text-center mb-12">Trường hợp sử dụng tiếng Việt</h2>
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
          <p className="text-lg italic text-muted-foreground mb-6">"PromptAndGo giúp đội ngũ chúng tôi tạo nội dung tiếng Việt nhanh hơn gấp 3 lần mà vẫn giữ được giọng điệu chuyên nghiệp và phù hợp với thương hiệu."</p>
          <div>
            <p className="font-semibold">Nguyễn Minh Tuấn</p>
            <p className="text-sm text-muted-foreground">Giám đốc Nội dung, TP.HCM</p>
          </div>
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-16 px-4 text-center">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Bạn đã sẵn sàng chưa?</h2>
        <p className="text-muted-foreground mb-8">Tham gia cùng hàng nghìn người dùng khắp châu Á đang sử dụng PromptAndGo để tạo prompt AI hiệu quả.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/auth?mode=signup"><Button size="lg" className="gap-2">Đăng ký miễn phí <ArrowRight className="h-4 w-4" /></Button></Link>
          <Link to="/"><Button size="lg" variant="outline">Quay lại trang chủ (English)</Button></Link>
        </div>
      </div>
    </section>
  </div>
);

export default VietnameseLanding;
