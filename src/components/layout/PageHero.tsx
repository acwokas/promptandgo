import { ReactNode } from "react";

interface PageHeroProps {
  title: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode; // actions
  minHeightClass?: string; // allow pages to tweak height
}

const PageHero = ({ title, subtitle, children, minHeightClass = "min-h-[62vh]" }: PageHeroProps) => {
  return (
    <section className="relative bg-hero hero-grid">
      <div className={`container ${minHeightClass} flex flex-col items-center justify-center text-center py-20 text-primary-foreground`}>
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
