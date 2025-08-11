import { ReactNode } from "react";
import { MessageSquare, Braces, Sparkles } from "lucide-react";

interface PageHeroProps {
  title: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode; // actions
  minHeightClass?: string; // allow pages to tweak height
  variant?: "default" | "prompt";
}

const PageHero = ({ title, subtitle, children, minHeightClass = "min-h-[62vh]", variant = "default" }: PageHeroProps) => {
  const bgClass = variant === "prompt" ? "bg-hero-prompt" : "bg-hero";
  return (
    <section className={`relative ${bgClass} hero-grid`}>
      {/* Decorative shapes for Prompt Library */}
      {variant === "prompt" && (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* Soft gradient orbs */}
          <div className="absolute -top-14 -left-16 w-80 h-80 rounded-full bg-primary/25 blur-3xl"></div>
          <div className="absolute top-10 right-[8%] w-72 h-72 rounded-full bg-primary/20 blur-3xl"></div>
          <div className="absolute bottom-[-60px] left-[18%] w-64 h-64 rounded-full bg-primary/15 blur-2xl"></div>

          {/* Rotating ring */}
          <div
            className="absolute left-1/2 top-[10%] -translate-x-1/2 w-[520px] h-[520px] rounded-full opacity-50 animate-[spin_30s_linear_infinite]"
            style={{
              background: "conic-gradient(from 0deg, hsl(var(--brand) / 0.0), hsl(var(--brand) / 0.75), hsl(var(--brand-2) / 0.0))",
              WebkitMask: "radial-gradient(closest-side, transparent 70%, black 71%)"
            }}
          />
          {/* Ribbon */}
          <div className="absolute right-[-10%] top-[48%] w-[560px] h-24 bg-gradient-to-r from-primary/25 via-primary/10 to-transparent rounded-full blur-2xl -skew-y-6"></div>

          {/* Prompt tokens */}
          <div className="absolute left-[14%] top-[26%] px-3 py-1 rounded-full text-xs bg-card/70 border border-primary/20 shadow backdrop-blur-sm animate-fade-in">/imagine</div>
          <div className="absolute right-[14%] top-[32%] px-3 py-1 rounded-full text-xs bg-card/70 border border-primary/20 shadow backdrop-blur-sm animate-fade-in delay-100">{`{topic}`}</div>
          <div className="absolute left-[48%] bottom-[26%] px-3 py-1 rounded-full text-xs bg-card/70 border border-primary/20 shadow backdrop-blur-sm animate-fade-in delay-200">#prompt</div>

          {/* Minimal line icons */}
          <MessageSquare className="absolute text-primary/30 w-10 h-10 left-[12%] top-[18%] rotate-[-12deg]" />
          <Braces className="absolute text-primary/30 w-10 h-10 right-[20%] top-[35%] rotate-12" />
          <Sparkles className="absolute text-primary/40 w-8 h-8 left-1/2 bottom-[20%]" />
        </div>
      )}
      <div className={`relative z-10 container ${minHeightClass} flex flex-col items-center justify-center text-center py-20 text-primary-foreground`}>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-5xl leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-xl text-primary-foreground/85 mt-5 max-w-3xl">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-8 flex flex-col sm:flex-row gap-3">{children}</div>}
      </div>
    </section>
  );
};

export default PageHero;
