import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import SEO from "@/components/SEO";
import { Search, Home, BookOpen, Globe, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const TRANSLATIONS = [
  { text: "迷子になりました", lang: "Japanese" },
  { text: "길을 잃었습니다", lang: "Korean" },
  { text: "迷路了", lang: "Chinese" },
  { text: "หลงทาง", lang: "Thai" },
  { text: "Bị lạc", lang: "Vietnamese" },
  { text: "Tersesat", lang: "Indonesian" },
];

const PHRASES = [
  { phrase: "thank you", lang: "Japanese" },
  { phrase: "good morning", lang: "Korean" },
  { phrase: "I love you", lang: "Mandarin" },
  { phrase: "how are you", lang: "Thai" },
  { phrase: "nice to meet you", lang: "Vietnamese" },
  { phrase: "please help me", lang: "Indonesian" },
];

const FLOAT_CHARS = ["漢", "字", "한", "글", "ไ", "ท", "ย", "あ", "い", "う", "가", "나", "다", "中", "文"];

const FloatingChars = () => (
  <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
    {FLOAT_CHARS.map((ch, i) => {
      const left = (i / FLOAT_CHARS.length) * 100;
      const dur = 15 + (i % 5) * 4;
      const delay = i * 1.2;
      const size = 20 + (i % 4) * 8;
      return (
        <span
          key={i}
          className="absolute text-white/[0.04] font-bold select-none"
          style={{
            left: `${left}%`,
            fontSize: `${size}px`,
            animation: `floatUp ${dur}s linear ${delay}s infinite`,
          }}
        >
          {ch}
        </span>
      );
    })}
    <style>{`
      @keyframes floatUp {
        0% { transform: translateY(110vh) rotate(0deg); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(-10vh) rotate(20deg); opacity: 0; }
      }
    `}</style>
  </div>
);

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tIdx, setTIdx] = useState(0);
  const [pIdx, setPIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const phraseRef = useRef(0);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  // Rotate translations
  useEffect(() => {
    const id = setInterval(() => setTIdx((p) => (p + 1) % TRANSLATIONS.length), 3000);
    return () => clearInterval(id);
  }, []);

  // Typewriter effect for phrases
  useEffect(() => {
    const phrase = PHRASES[pIdx];
    const full = `How do I say '${phrase.phrase}' in ${phrase.lang}?`;
    let i = 0;
    setTyped("");
    const id = setInterval(() => {
      i++;
      setTyped(full.slice(0, i));
      if (i >= full.length) {
        clearInterval(id);
        setTimeout(() => setPIdx((p) => (p + 1) % PHRASES.length), 2000);
      }
    }, 50);
    return () => clearInterval(id);
  }, [pIdx]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) navigate(`/search?q=${encodeURIComponent(searchVal.trim())}`);
  };

  return (
    <>
      <SEO title="404 — Page Not Found" description="This page doesn't exist. Find your way back to PromptAndGo's AI prompt library." noindex />

      <main className="relative min-h-[80vh] bg-hero overflow-hidden flex items-center">
        <FloatingChars />

        <div className="relative z-10 container max-w-3xl mx-auto px-4 py-20 text-center">
          {/* 404 calligraphy */}
          <h1
            className="text-[8rem] sm:text-[10rem] md:text-[12rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-white/90 to-white/20 select-none"
            style={{
              textShadow: "0 0 40px hsl(var(--primary) / 0.3), 0 4px 0 hsl(var(--primary) / 0.15)",
              fontFamily: "'Georgia', serif",
              letterSpacing: "-0.05em",
            }}
          >
            404
          </h1>

          {/* Rotating subtitle */}
          <div className="h-10 flex items-center justify-center mb-4">
            <p className="text-2xl md:text-3xl text-primary font-semibold transition-opacity duration-500" key={tIdx}>
              {TRANSLATIONS[tIdx].text}
            </p>
          </div>
          <p className="text-xs text-white/40 mb-6">{TRANSLATIONS[tIdx].lang} — "You got lost"</p>

          <p className="text-lg text-white/70 max-w-lg mx-auto mb-4">
            This page doesn't exist, but your perfect prompt is just a click away.
          </p>

          {/* Typewriter */}
          <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 max-w-md mx-auto mb-8">
            <p className="text-sm text-white/50">Try asking:</p>
            <p className="text-white font-mono text-sm mt-1">
              {typed}<span className="animate-pulse">|</span>
            </p>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto mb-10">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search the site..."
                className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                aria-label="Search the site"
              />
            </div>
            <Button type="submit" className="bg-primary hover:bg-primary/90">Search</Button>
          </form>

          {/* Quick links */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { to: "/", icon: Home, label: "Home" },
              { to: "/library", icon: BookOpen, label: "Browse Prompts" },
              { to: "/templates", icon: Globe, label: "Popular Languages" },
              { to: "/contact", icon: Mail, label: "Contact" },
            ].map((link) => (
              <Button key={link.to} asChild variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                <Link to={link.to}>
                  <link.icon className="h-4 w-4 mr-1.5" />
                  {link.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default NotFound;
