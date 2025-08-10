import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

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
    <main className="container py-10">
      <SEO title="Contact PromptAndGo.ai" description="Send us a message — we'd love to hear from you." />
      <h1 className="text-3xl font-bold mb-2">Contact</h1>
      <p className="text-muted-foreground mb-6">We typically respond within 1–2 business days.</p>

      <form onSubmit={onSubmit} className="grid gap-4 max-w-xl">
        <Input required name="name" placeholder="Name" />
        <Input required type="email" name="email" placeholder="Email" />
        <Textarea required name="message" placeholder="Message" />

        {/* Honeypot field */}
        <input type="text" name="company" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

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
    </main>
  );
};

export default Contact;
