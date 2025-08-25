import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import PageHero from "@/components/layout/PageHero";
import RelatedPrompts from "@/components/prompt/RelatedPrompts";
import { Link } from "react-router-dom";
import { validatePromptInput, sanitizeInput, validateEmailInput } from "@/lib/inputValidation";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const SubmitPrompt = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const fd = new FormData(form);
    const title = String(fd.get("title") ?? "");
    const whatFor = String(fd.get("whatFor") ?? "");
    const promptText = String(fd.get("prompt") ?? "");
    const excerpt = String(fd.get("excerpt") ?? "");
    const submitterEmail = String(fd.get("email") ?? "");
    const submitterName = String(fd.get("name") ?? "");

    // Validate inputs
    const titleValidation = validatePromptInput(title);
    const whatForValidation = validatePromptInput(whatFor);
    const promptValidation = validatePromptInput(promptText);
    const emailValidation = validateEmailInput(submitterEmail);

    if (!titleValidation.isValid) {
      toast({
        title: "Invalid Title",
        description: titleValidation.error,
        variant: "destructive"
      });
      return;
    }

    if (!whatForValidation.isValid) {
      toast({
        title: "Invalid Description", 
        description: whatForValidation.error,
        variant: "destructive"
      });
      return;
    }

    if (!promptValidation.isValid) {
      toast({
        title: "Invalid Prompt",
        description: promptValidation.error,
        variant: "destructive"
      });
      return;
    }

    if (!emailValidation.isValid) {
      toast({
        title: "Invalid Email",
        description: emailValidation.error,
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Sanitize inputs
      const sanitizedTitle = sanitizeInput(title);
      const sanitizedWhatFor = sanitizeInput(whatFor);
      const sanitizedPromptText = sanitizeInput(promptText);
      const sanitizedExcerpt = excerpt ? sanitizeInput(excerpt) : "";

      const { error } = await supabase.functions.invoke('submit-prompt', {
        body: {
          title: sanitizedTitle,
          whatFor: sanitizedWhatFor,
          prompt: sanitizedPromptText,
          excerpt: sanitizedExcerpt,
          submitterEmail,
          submitterName: submitterName || undefined,
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      toast({ 
        title: "Submission sent!", 
        description: "Thank you! We'll review your prompt and get back to you soon." 
      });
      form.reset();
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission failed",
        description: "Please try again or contact us directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHero title={<>Submit a Prompt</>} subtitle={<>Have a great prompt? Share it and help others work smarter.</>} minHeightClass="min-h-[28vh]" />
      <main className="container py-10">
        <SEO title="Submit a Prompt" description="Share your best workflow prompts with the community." />

        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Submit a Prompt</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <form onSubmit={onSubmit} className="grid gap-4 max-w-2xl">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-primary mb-2">🎉 Win 1 Month Free Premium!</h3>
            <p className="text-sm text-muted-foreground">
              Successfully submitted prompts that get added to our library earn you a free month of premium membership!
            </p>
          </div>
          
          <Input required name="title" placeholder="Title" />
          <Textarea required name="whatFor" placeholder="What it's for (short description)" />
          <Textarea required name="prompt" placeholder="Prompt (copyable block)" />
          <Textarea name="excerpt" placeholder="Excerpt (short summary)" />
          
          <div className="grid gap-2">
            <Label htmlFor="email">Your Email (required) *</Label>
            <Input required name="email" type="email" placeholder="your@email.com" />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="name">Your Name (optional)</Label>
            <Input name="name" placeholder="John Doe" />
          </div>
          
          <p className="text-sm italic text-muted-foreground">
            * <strong>prompt</strong>andgo reserves the right to use, edit and revise any portion of this prompt. 
            We'll reach out if your prompt is added to the website.
          </p>
          <Button variant="cta" className="w-fit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Prompt"}
          </Button>
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
