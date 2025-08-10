import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const SubmitPrompt = () => {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({ title: "Thanks!", description: "Submission received. We'll review it soon." });
    (e.currentTarget as HTMLFormElement).reset();
  };

  return (
    <main className="container py-10">
      <SEO title="Submit a Prompt" description="Share your best workflow prompts with the community." />
      <h1 className="text-3xl font-bold mb-2">Submit a Prompt</h1>
      <p className="text-muted-foreground mb-6">Have a great prompt? Share it and help others work smarter.</p>

      <form onSubmit={onSubmit} className="grid gap-4 max-w-2xl">
        <Input required name="title" placeholder="Title" />
        <Textarea required name="whatFor" placeholder="What it's for (short description)" />
        <Textarea required name="prompt" placeholder="Prompt (copyable block)" />
        <Textarea name="excerpt" placeholder="Excerpt (short summary)" />
        <p className="text-sm italic text-muted-foreground">
          PromptAndGo.ai reserves the right to use, edit and revise any portion of this prompt.
        </p>
        <Button variant="cta" className="w-fit">Submit Prompt</Button>
      </form>
    </main>
  );
};

export default SubmitPrompt;
