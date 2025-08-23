import { ReactNode } from "react";
import { MessageSquare, Braces, Sparkles } from "lucide-react";

interface PageHeroProps {
  title: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode; // actions
  minHeightClass?: string; // allow pages to tweak height
  variant?: "default" | "prompt" | "admin";
}

const PageHero = ({ title, subtitle, children, minHeightClass = "min-h-[25vh]", variant = "prompt" }: PageHeroProps) => {
  const bgClass = variant === "admin" ? "bg-hero-admin" : variant === "prompt" ? "bg-hero-prompt" : "bg-hero";
  return (
    <section className={`relative ${bgClass} hero-grid`}>
      {/* Decorative shapes for Prompt Library and Admin */}
      {(variant === "prompt" || variant === "admin") && (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* Soft gradient orbs */}
          <div className={`absolute -top-14 -left-16 w-80 h-80 rounded-full blur-3xl ${
            variant === "admin" ? "bg-red-500/40" : "bg-primary/25"
          }`}></div>
          <div className={`absolute top-10 right-[8%] w-72 h-72 rounded-full blur-3xl ${
            variant === "admin" ? "bg-red-600/35" : "bg-primary/20"
          }`}></div>
          <div className={`absolute bottom-[-60px] left-[18%] w-64 h-64 rounded-full blur-2xl ${
            variant === "admin" ? "bg-red-700/30" : "bg-primary/15"
          }`}></div>

          {/* Rotating ring */}
          <div
            className="absolute left-1/2 top-[10%] -translate-x-1/2 w-[520px] h-[520px] rounded-full opacity-50 animate-[spin_30s_linear_infinite]"
            style={{
              background: variant === "admin" 
                ? "conic-gradient(from 0deg, hsl(0 84% 60% / 0.0), hsl(0 84% 60% / 0.75), hsl(0 72% 51% / 0.0))"
                : "conic-gradient(from 0deg, hsl(var(--brand) / 0.0), hsl(var(--brand) / 0.75), hsl(var(--brand-2) / 0.0))",
              WebkitMask: "radial-gradient(closest-side, transparent 70%, black 71%)"
            }}
          />
          {/* Ribbon */}
          <div className={`absolute right-[-10%] top-[48%] w-[560px] h-24 rounded-full blur-2xl -skew-y-6 ${
            variant === "admin" 
              ? "bg-gradient-to-r from-red-500/40 via-red-600/25 to-transparent"
              : "bg-gradient-to-r from-primary/25 via-primary/10 to-transparent"
          }`}></div>

          {/* Minimal line icons */}
          <MessageSquare className={`absolute w-10 h-10 left-[12%] top-[18%] rotate-[-12deg] ${
            variant === "admin" ? "text-red-400/40" : "text-primary/30"
          }`} />
          <Braces className={`absolute w-10 h-10 right-[20%] top-[35%] rotate-12 ${
            variant === "admin" ? "text-red-400/40" : "text-primary/30"
          }`} />
          <Sparkles className={`absolute w-8 h-8 left-1/2 bottom-[20%] ${
            variant === "admin" ? "text-red-300/50" : "text-primary/40"
          }`} />
        </div>
      )}
      <div className={`relative z-10 container ${minHeightClass} flex flex-col items-center justify-center text-center py-12 text-primary-foreground`}>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight max-w-5xl leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-base md:text-lg text-primary-foreground/85 mt-4 max-w-3xl">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-6 flex flex-col sm:flex-row gap-3">{children}</div>}
      </div>
    </section>
  );
};

export default PageHero;
