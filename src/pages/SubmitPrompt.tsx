import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import PageHero from "@/components/layout/PageHero";
import RelatedPrompts from "@/components/prompt/RelatedPrompts";
import { Link } from "react-router-dom";

const SubmitPrompt = () => {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const fd = new FormData(form);
    const title = String(fd.get("title") ?? "");
    const whatFor = String(fd.get("whatFor") ?? "");
    const promptText = String(fd.get("prompt") ?? "");
    const excerpt = String(fd.get("excerpt") ?? "");

    const subject = `New Prompt Submission: ${title}`;
    const bodyLines = [
      `Title: ${title}`,
      `What for: ${whatFor}`,
      `Prompt:\n${promptText}`,
      excerpt ? `Excerpt:\n${excerpt}` : undefined,
    ].filter(Boolean) as string[];
    const body = bodyLines.join("\n\n");

    const mailto = `mailto:newprompt@promptandgo.ai?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;

    toast({ title: "Compose email", description: "Your email client should open with the submission pre-filled." });
    form.reset();
  };

  return (
    <>
      <PageHero title={<>Submit a Prompt</>} subtitle={<>Have a great prompt? Share it and help others work smarter.</>} minHeightClass="min-h-[40vh]" />
      <main className="container py-10">
        <SEO title="Submit a Prompt" description="Share your best workflow prompts with the community." />

        <form onSubmit={onSubmit} className="grid gap-4 max-w-2xl">
          <Input required name="title" placeholder="Title" />
          <Textarea required name="whatFor" placeholder="What it's for (short description)" />
          <Textarea required name="prompt" placeholder="Prompt (copyable block)" />
          <Textarea name="excerpt" placeholder="Excerpt (short summary)" />
          <p className="text-sm italic text-muted-foreground">
            <strong>prompt</strong>andgo reserves the right to use, edit and revise any portion of this prompt.
          </p>
          <Button variant="cta" className="w-fit">Submit Prompt</Button>
        </form>

        {/* Helpful internal links for discovery */}
        <nav aria-labelledby="browse-links" className="mt-10">
          <h2 id="browse-links" className="text-xl md:text-2xl font-semibold tracking-tight mb-3">Explore more while you’re here</h2>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="secondary"><Link to="/library">Browse Prompt Library</Link></Button>
            <Button asChild variant="inverted"><Link to="/packs">Explore ⚡️Power Packs</Link></Button>
            <Button asChild variant="outline"><Link to="/how-it-works">How Prompting Works</Link></Button>
          </div>
        </nav>

        <RelatedPrompts />
      </main>
    </>
  );
};

export default SubmitPrompt;
