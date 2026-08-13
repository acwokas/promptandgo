import { useScrollReveal } from "@/hooks/useScrollReveal";
import type { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const ScrollReveal = ({ children, className = "", delay = 0 }: ScrollRevealProps) => {
  const [ref, isVisible] = useScrollReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${isVisible ? "revealed" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};
