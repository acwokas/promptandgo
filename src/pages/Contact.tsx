import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import PageHero from "@/components/layout/PageHero";
import { Link } from "react-router-dom";

const Contact = () => {
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    const notRobot = data.get("captcha") === "on";
    const honey = String(data.get("company") || ""); // honeypot

    if (honey) return; // silently drop bots

    if (!name || !email || !message) {
      toast({ title: "Missing fields", description: "Please complete all fields.", variant: "destructive" });
      return;
    }

    if (!notRobot) {
      toast({ title: "Captcha required", description: "Please confirm you are not a robot.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const subject = `Contact from ${name}`;
      const body = [
        `Name: ${name}`,
        `Email: ${email}`,
        "",
        "Message:",
        message,
      ].join("\n");

      const mailto = `mailto:hey@promptandgo.ai?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
      toast({ title: "Compose email", description: "Your email client should open with your message pre-filled." });
      form.reset();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageHero
        title={<><span className="text-brand">Got something</span> to share?</>}
        subtitle={<>We’d love to hear from you, whether it’s a fresh idea, feedback, a request for more of a certain prompt type, or a challenge you would like us to tackle. Drop us a message, and remember to subscribe to our newsletter for new prompts, tips, and inspiration straight to your inbox.</>}
        minHeightClass="min-h-[40vh]"
      />
      <main className="container py-10">
        <SEO title="Contact PromptAndGo.ai" description="Send us a message — we'd love to hear from you." />

        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <form onSubmit={onSubmit} className="grid gap-4 max-w-xl">
              <Input required name="name" placeholder="Name" />
              <Input required type="email" name="email" placeholder="Email" />
              <Textarea required name="message" placeholder="Message" />

              {/* Honeypot field */}
              <input type="text" name="company" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

              {/* Newsletter opt-in */}
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="newsletter_opt_in" className="h-4 w-4" />
                Get 1 FREE ⚡️PowerPack, and regular prompting tips
              </label>

              {/* Simple captcha */}
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="captcha" className="h-4 w-4" />
                I'm not a robot
              </label>

              <div className="pt-2">
                <Button type="submit" variant="cta" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Message"}
                </Button>
              </div>
            </form>
          </div>
          <aside className="lg:col-span-5">
            <div className="sticky top-24">
              <Link
                to="/submit"
                aria-label="Submit a Prompt"
                className="group relative block aspect-square w-full max-w-sm rounded-lg overflow-hidden shadow-elegant mx-auto transition-transform duration-200 hover:scale-105 hover:shadow-glow"
              >
                <img
                  src="/lovable-uploads/48df9644-8012-4209-b92b-e0e694b2a2f7.png"
                  alt="Submit a prompt illustration"
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent transition-colors group-hover:from-foreground/80" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="inline-block rounded-md bg-background/80 backdrop-blur-sm px-4 py-3 shadow-elegant">
                    <p className="text-foreground text-lg md:text-xl font-semibold leading-snug">
                      Send us your best prompt and help inspire the community.
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
};

export default Contact;
