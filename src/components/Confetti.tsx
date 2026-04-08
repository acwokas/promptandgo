import { useState, useEffect } from "react";

const COLORS = [
  "hsl(350 78% 59%)",
  "hsl(174 82% 33%)",
  "hsl(49 91% 78%)",
  "hsl(280 67% 55%)",
  "hsl(25 95% 53%)",
];

interface Particle {
  id: number;
  x: number;
  color: string;
  delay: number;
}

export const Confetti = ({ show }: { show: boolean }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (show) {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 0.5,
      }));
      setParticles(newParticles);
      const timer = setTimeout(() => setParticles([]), 1200);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((p) => (
        <div
          key={p.id}
          className="confetti-particle"
          style={{
            left: `${p.x}%`,
            top: "40%",
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
};
