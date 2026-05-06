import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Heart, ArrowRight, Zap, CheckCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const samplePrompts = {
  marketing: {
    title: "Email Marketing Campaign",
    category: "Marketing",
    difficulty: "Easy",
    timeToComplete: "2 minutes",
    prompt: "Create a 5-email welcome series for [BUSINESS TYPE] targeting [AUDIENCE]. Each email should:\n\n1. Welcome & set expectations\n2. Share your story/mission\n3. Provide valuable tips/insights\n4. Introduce products/services\n5. Call-to-action with special offer\n\nTone: [professional/friendly/casual]\nGoal: Build trust and drive [SPECIFIC ACTION]",
    preview: "📧 Welcome to [Business Name]!\n\nHi [First Name],\n\nWelcome to our community of [audience description]! I'm thrilled you've joined us.\n\nOver the next few days, I'll be sharing:\n✅ Insider tips that have helped 3,000+ businesses\n✅ Our proven [specific strategy] framework\n✅ An exclusive offer just for new subscribers\n\n[Continue reading...]",
    results: ["45% higher open rates", "3x more engagement", "25% conversion increase"]
  },
  content: {
    title: "Blog Post Outline",
    category: "Content Creation",
    difficulty: "Easy", 
    timeToComplete: "3 minutes",
    prompt: "Create a comprehensive blog post outline for: \"[BLOG TOPIC]\"\n\nTarget audience: [AUDIENCE]\nPrimary keyword: [KEYWORD]\nWord count goal: [NUMBER] words\n\nInclude:\n- Compelling headline options (3)\n- Introduction hook\n- 5-7 main sections with subpoints\n- Key takeaways box\n- Call-to-action\n- SEO optimization notes",
    preview: "# 7 Proven Strategies That Will Transform Your [Topic] in 30 Days\n\n## Introduction\nAre you struggling with [problem]? You're not alone. 73% of [audience] face this challenge...\n\n## Strategy #1: The Foundation Method\n• Why this works\n• Step-by-step implementation\n• Common mistakes to avoid\n\n[Continue with 6 more strategies...]",
    results: ["10x faster content creation", "Better SEO rankings", "Higher engagement rates"]
  },
  sales: {
    title: "Cold Email Outreach",
    category: "Sales",
    difficulty: "Medium",
    timeToComplete: "5 minutes", 
    prompt: "Write a cold email sequence for [PRODUCT/SERVICE] targeting [SPECIFIC ROLE] at [COMPANY TYPE].\n\nSequence:\n1. Initial contact (problem-focused)\n2. Value demonstration (case study)\n3. Social proof (testimonials)\n4. Final follow-up (scarcity)\n\nPersonalization points:\n- Company research\n- Recent company news/achievements\n- Mutual connections\n- Industry-specific pain points",
    preview: "Subject: Quick question about [Company]'s [specific challenge]\n\nHi [Name],\n\nI noticed [Company] recently [specific achievement/news]. Congratulations!\n\nI'm reaching out because many [role] at [company type] are facing [specific challenge]. We helped [Similar Company] increase [metric] by 40% in just 3 months.\n\nWould a 15-minute call to discuss [specific benefit] be valuable?\n\nBest regards,\n[Your name]",
    results: ["68% higher response rates", "3x more meetings booked", "45% shorter sales cycles"]
  }
};

const ContentPreview = () => {
  const [activeTab, setActiveTab] = useState("marketing");
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);

  const handleCopyPrompt = async (promptKey: string) => {
    const prompt = samplePrompts[promptKey as keyof typeof samplePrompts].prompt;
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedPrompt(promptKey);
      setTimeout(() => setCopiedPrompt(null), 2000);
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      console.log("Copy fallback needed");
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">See Our Prompts in Action</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Experience the quality and effectiveness of our prompts before you commit. 
          These are real examples from our library that users love.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="marketing" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Marketing
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <Copy className="h-4 w-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="sales" className="flex items-center gap-2">
            <ArrowRight className="h-4 w-4" />
            Sales
          </TabsTrigger>
        </TabsList>

        {Object.entries(samplePrompts).map(([key, data]) => (
          <TabsContent key={key} value={key} className="mt-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Prompt Card */}
              <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{data.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{data.category}</Badge>
                        <Badge variant={data.difficulty === 'Easy' ? 'default' : 'secondary'}>
                          {data.difficulty}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {data.timeToComplete}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="shrink-0"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-background rounded-lg border p-4">
                    <div className="text-xs text-muted-foreground mb-2">PROMPT:</div>
                    <p className="text-sm font-mono leading-relaxed whitespace-pre-wrap">
                      {data.prompt}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleCopyPrompt(key)}
                      variant="outline" 
                      size="sm"
                      className="flex-1"
                    >
                      {copiedPrompt === key ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Prompt
                        </>
                      )}
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link to="/library">
                        View Full Library
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Preview & Results Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">AI Output Preview</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    See what this prompt generates in ChatGPT
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/50 rounded-lg border p-4">
                    <div className="text-xs text-muted-foreground mb-2">SAMPLE OUTPUT:</div>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {data.preview}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Typical Results:</h4>
                    <div className="space-y-2">
                      {data.results.map((result, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span>{result}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Button asChild className="w-full">
                      <Link to="/auth?mode=signup">
                        Get Access to 3,000+ More Prompts
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Bottom CTA */}
      <div className="text-center space-y-4 pt-8 border-t">
        <h3 className="text-xl font-semibold">
          Ready to 10x Your Productivity?
        </h3>
        <p className="text-muted-foreground max-w-xl mx-auto">
          These are just 3 examples from our library of 3,000+ tested prompts. 
          Start with our free plan and discover what works for you.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg" className="px-8">
            <Link to="/library">
              Browse Free Prompts <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/packs">View Power Packs</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContentPreview;