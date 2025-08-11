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
          <div className="absolute -top-10 -left-10 w-72 h-72 rounded-full bg-primary/25 blur-3xl"></div>
          <div className="absolute top-6 right-[10%] w-64 h-64 rounded-full bg-primary/20 blur-3xl"></div>
          <div className="absolute bottom-[-40px] left-[20%] w-56 h-56 rounded-full bg-primary/15 blur-2xl"></div>

          <div className="absolute left-[8%] top-1/3 w-14 h-14 rounded-xl border border-primary/30 bg-card/60 backdrop-blur-sm rotate-6 shadow-elegant"></div>
          <div className="absolute right-[12%] top-1/4 w-16 h-16 rounded-full border border-primary/30"></div>

          <MessageSquare className="absolute text-primary/30 w-10 h-10 left-[15%] top-[18%] rotate-[-12deg]" />
          <Braces className="absolute text-primary/30 w-10 h-10 right-[20%] top-[35%] rotate-12" />
          <Sparkles className="absolute text-primary/40 w-8 h-8 left-1/2 bottom-[22%]" />
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
