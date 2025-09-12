import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import AuthorBio from "@/components/blog/AuthorBio";
import PrevNextNav from "@/components/blog/PrevNextNav";
import { AUTHOR_MAIN } from "./authors";

const BeginnersGuideMidjourneyPrompts = () => {
  const publishDate = "2025-08-19";
  const lastModified = "2025-08-19";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Beginner's Guide: Creating Detailed Prompts for MidJourney",
    "description": "Mastering MidJourney starts with the right words. This beginner's guide breaks down how to create detailed prompts that deliver consistent, creative results: with examples, pro tips, and parameters you can use today.",
    "image": "/lovable-uploads/24c8f315-67e8-4022-abec-e096e61d0202.png",
    "datePublished": publishDate,
    "dateModified": lastModified,
    "author": {
      "@type": "Organization",
      "name": AUTHOR_MAIN.name,
      "url": "https://promptandgo.ai"
    },
    "publisher": {
      "@type": "Organization",
      "name": "PromptAndGo",
      "logo": {
        "@type": "ImageObject",
        "url": "https://promptandgo.ai/og-default.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://promptandgo.ai/tips/beginners-guide-midjourney-prompts"
    }
  };

  return (
    <>
      <SEO 
        title="Beginner's Guide: Creating Detailed Prompts for MidJourney"
        description="Mastering MidJourney starts with the right words. This beginner's guide breaks down how to create detailed prompts that deliver consistent, creative results: with examples, pro tips, and parameters you can use today."
        canonical="https://promptandgo.ai/tips/beginners-guide-midjourney-prompts"
        structuredData={structuredData}
        ogType="article"
        publishedTime={publishDate}
        modifiedTime={lastModified}
      />

      <main className="container mx-auto px-6 py-6 max-w-4xl">
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
              <BreadcrumbLink asChild>
                <Link to="/tips">Tips</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Beginner's Guide to MidJourney Prompts</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Back Button */}
        <Link 
          to="/tips" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tips
        </Link>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary">AI Tools</Badge>
            <Badge variant="secondary">MidJourney</Badge>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Beginner's Guide: Creating Detailed Prompts for MidJourney
          </h1>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
            <time dateTime={publishDate}>
              {new Date(publishDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </time>
            <span>•</span>
            <span>8 min read</span>
          </div>

          {/* Hero Image */}
          <div className="mb-8 static">
            <img 
              src="/lovable-uploads/24c8f315-67e8-4022-abec-e096e61d0202.png"
              alt="Beginner's guide to MidJourney prompts - steampunk character with blueprint"
            className="w-full rounded-lg shadow-lg"
            loading="eager"
            decoding="async"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            width="1200" height="675"
          />
          </div>

          <div className="text-lg text-muted-foreground static">
            Helping beginners understand how to craft detailed, effective prompts in MidJourney so they can consistently generate high-quality, creative images.
          </div>
        </header>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="font-bold">Why Prompting Matters in MidJourney</h2>
            
            <p>
              MidJourney is powerful, but it's only as good as the instructions you give it. A vague prompt like "dog in a park" might give you a generic image, while a detailed prompt like "Golden retriever puppy chasing butterflies in a spring meadow, cinematic lighting, ultra-realistic" creates a polished, vivid result.
            </p>
            
            <p>
              Learning how to build detailed prompts gives you more control, unlocks stylistic variety, and saves hours of trial and error.
            </p>
          </section>

          <section>
            <h3>The Core Structure of a MidJourney Prompt</h3>
            
            <p>
              Think of a MidJourney prompt as a recipe. The best ones usually follow this structure:
            </p>
            
            <div className="bg-muted p-4 rounded-lg my-6">
              <p className="font-mono text-sm mb-2">
                [Subject] with [Key Attributes], in [Style and Mood], featuring [Colors and Lighting], including [Optional Elements]. [Exclusions].
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Example:</strong> "Cyberpunk Tokyo street at night with neon reflections, in cinematic anime style, featuring glowing umbrellas and rainy atmosphere. Exclude people."
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-bold">Step-by-Step Prompt Building</h2>
            
            <div className="my-8">
              <img 
                src="/lovable-uploads/62fad3e0-9f93-4964-8448-ab0375c35a17.png"
                alt="Golden retriever puppy in flower field demonstrating detailed prompt results"
                className="w-full rounded-lg shadow-lg"
                loading="lazy"
                decoding="async"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
                width="800" height="450"
              />
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Example of detailed prompting: "Golden retriever puppy in flower field, ultra-realistic, soft focus, warm sunlight"
              </p>
            </div>
            
            <h3>Step 1: Define the Subject</h3>
            <ul>
              <li><strong>Be specific:</strong> "Victorian house" to "Weathered Victorian mansion with ivy-covered walls."</li>
              <li>Use nouns that set a clear focal point.</li>
            </ul>

            <h3>Step 2: Add Key Attributes</h3>
            <ul>
              <li>Describe size, texture, details, or uniqueness.</li>
              <li><strong>Example:</strong> "Futuristic race car with chrome plating and aerodynamic curves."</li>
            </ul>

            <h3>Step 3: Choose a Style and Mood</h3>
            <ul>
              <li>Reference art movements (Art Deco, Surrealism, Minimalism) or mediums (oil painting, digital art, clay model).</li>
              <li>Add mood descriptors (dreamy, ominous, playful).</li>
            </ul>

            <h3>Step 4: Layer in Colors and Lighting</h3>
            <ul>
              <li><strong>Colors:</strong> "Muted pastel tones," "high-contrast neon," "earthy palette."</li>
              <li><strong>Lighting:</strong> "Soft golden hour light," "dramatic shadows," "cinematic spotlight."</li>
            </ul>

            <h3>Step 5: Include Optional Elements</h3>
            <ul>
              <li>Secondary details like props, backgrounds, or ambience.</li>
              <li><strong>Example:</strong> "With floating lanterns in the sky, river reflections below."</li>
            </ul>

            <h3>Step 6: Use Exclusions (the '--no' tag)</h3>
            <ul>
              <li>Remove unwanted objects/styles: "--no text --no watermark --no blurry".</li>
            </ul>
          </section>

          <section>
            <h3>Useful MidJourney Parameters for Beginners</h3>
            
            <div className="bg-muted p-4 rounded-lg my-6">
              <ul className="space-y-2 mb-0">
                <li><code className="bg-background px-2 py-1 rounded">--ar 16:9</code> : Aspect ratio (e.g. widescreen)</li>
                <li><code className="bg-background px-2 py-1 rounded">--v 6</code> : Model version (newest one usually best)</li>
                <li><code className="bg-background px-2 py-1 rounded">--q 2</code> : Higher quality (uses more credits)</li>
                <li><code className="bg-background px-2 py-1 rounded">--stylize 1000</code> : Adds stronger artistic flair</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="font-bold">Example Beginner Prompts</h2>
            
            <ol className="space-y-2">
              <li>"Golden retriever puppy in a flower field, ultra-realistic, soft focus, warm sunlight, pastel tones."</li>
              <li>"Steampunk airship over London skyline, intricate brass details, cinematic lighting, in Jules Verne illustration style."</li>
              <li>"Futuristic cityscape at night, neon holograms, rainy streets, anime cyberpunk style, --no people."</li>
            </ol>
          </section>

          <div className="my-12">
            <img 
              src="/lovable-uploads/99bf0dfb-e060-4107-b99e-72ccd5ec5ad7.png"
              alt="Medieval knight with glowing lightsaber demonstrating creative prompt combinations"
              className="w-full rounded-lg shadow-lg"
              loading="lazy"
              decoding="async"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
              width="800" height="450"
            />
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Creative combinations like "Medieval knight with neon weapon" showcase MidJourney's ability to blend contrasting elements
            </p>
          </div>

          <section>
            <h2 className="font-bold">Pro Tips to Level Up</h2>
            
            <ul className="space-y-2">
              <li><strong>Combine opposites:</strong> "Medieval knight with a neon sword."</li>
              <li><strong>Reference artists:</strong> "In the style of Studio Ghibli."</li>
              <li><strong>Iterate:</strong> Run variations, upscale, then refine.</li>
              <li><strong>Keep a prompt log:</strong> Save your best ones to re-use and tweak.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold">Final Thoughts</h2>
            
            <p>
              Detailed prompts are the difference between random images and art you're proud of. Once you get comfortable layering subject, style, lighting, and mood, you'll find MidJourney isn't just an AI tool: it's a canvas for your imagination.
            </p>
            
            <p>
              Start with the basic structure, experiment with the examples provided, and don't be afraid to get creative with your combinations. The more specific and descriptive your prompts, the more impressive your results will be.
            </p>
          </section>
        </article>

        {/* Author Bio */}
        <div className="mt-12">
          <AuthorBio author={AUTHOR_MAIN} />
        </div>

        {/* Navigation */}
        <PrevNextNav />
      </main>
    </>
  );
};

export default BeginnersGuideMidjourneyPrompts;