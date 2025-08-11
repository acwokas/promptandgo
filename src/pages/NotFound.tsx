import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";

const poems = [
  {
    title: "Mechanical Love",
    lines: [
      "Roses are red,",
      "Violets are blue,",
      "The link you clicked,",
      "Is nowhere in view.",
    ],
    primary: "Back to Prompts",
  },
  {
    title: "The Wandering Link",
    lines: [
      "I followed the link,",
      "I really did try,",
      "But it wandered away,",
      "And I’m not sure why.",
    ],
    primary: "Find Me Something That Exists",
  },
  {
    title: "The Lost Prompt",
    lines: [
      "A prompt was here,",
      "Then it was gone,",
      "Like a half-baked rhyme",
      "That just won’t go on.",
    ],
    primary: "Back to the Prompt Buffet",
  },
  {
    title: "Digital Hide-and-Seek",
    lines: [
      "We searched the web,",
      "From end to start,",
      "But this page is playing",
      "The hiding part.",
    ],
    primary: "End the Game and Show Me Prompts",
  },
  {
    title: "Quantum Glitch",
    lines: [
      "One second it’s there,",
      "The next it’s not,",
      "Maybe it’s stuck",
      "In a Schrödinger plot.",
    ],
    primary: "Collapse the Wave and Take Me Home",
  },
];

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [index, setIndex] = useState(0);
  const [seconds, setSeconds] = useState(20);
  const timerRef = useRef<number | null>(null);

  const poem = useMemo(() => poems[index], [index]);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  useEffect(() => {
    // reset countdown whenever poem changes
    setSeconds(20);

    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          if (timerRef.current) window.clearInterval(timerRef.current);
          navigate("/library", { replace: true });
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [index, navigate]);

  const handleAnother = () => {
    // pick a different poem index
    const next = Math.floor(Math.random() * poems.length);
    setIndex((prev) => (next === prev ? (prev + 1) % poems.length : next));
  };

  const canonical = typeof window !== "undefined" ? `${window.location.origin}${location.pathname}` : location.pathname;

  return (
    <>
      <Helmet>
        <title>404 - Page not found | Prompt Library</title>
        <meta
          name="description"
          content="404 page not found. Enjoy a playful AI poem while we guide you back to the Prompt Library."
        />
        <link rel="canonical" href={canonical} />
      </Helmet>

      <main className="min-h-screen bg-background">
        <section className="container mx-auto px-4 py-16 grid gap-10 md:grid-cols-2 items-center">
          <article className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">404 - Page not found</h1>
            <p className="text-muted-foreground">
              We asked our AI to find this page. It wrote a poem instead:
            </p>

            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-2">{poem.title}</h2>
              <div className="text-card-foreground leading-relaxed">
                {poem.lines.map((l, i) => (
                  <p key={i}>{l}</p>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("/library")}
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-primary-foreground shadow transition-colors hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {poem.primary} ({seconds})
                </button>
                <button
                  onClick={handleAnother}
                  className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Read Another Poem
                </button>
                <Link
                  to="/"
                  className="inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm text-muted-foreground underline-offset-4 hover:underline"
                >
                  Go to Home
                </Link>
              </div>
            </div>
          </article>

          <aside className="order-first md:order-last">
            <img
              src="/lovable-uploads/9de93cdf-39c1-4acd-b341-1c0540bd28d3.png"
              alt="Playful AI 404 illustration with whimsical style"
              loading="lazy"
              className="mx-auto max-h-[420px] w-auto object-contain drop-shadow"
            />
          </aside>
        </section>
      </main>
    </>
  );
};

export default NotFound;
