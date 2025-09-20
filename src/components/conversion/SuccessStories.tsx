import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Quote, ArrowRight, Clock, TrendingUp, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

const successStories = [
  {
    name: "Sarah Chen",
    role: "Marketing Manager",
    company: "TechStartup Inc.",
    avatar: "SC",
    story: "I was spending 4-5 hours daily creating content for our social media and email campaigns. After finding promptandgo, I now complete the same work in 90 minutes.",
    results: [
      "Saved 25+ hours weekly",
      "Increased engagement by 300%",
      "Generated $50K in additional revenue"
    ],
    timeToResults: "Within first week",
    favoritePrompt: "Social Media Content Calendar",
    quote: "The ROI was immediate. I got my first month's subscription cost back in increased productivity on day one."
  },
  {
    name: "Marcus Rodriguez",
    role: "Freelance Writer",
    company: "Self-employed",
    avatar: "MR",
    story: "As a freelancer, every hour counts. I was struggling with writer's block and spending too much time on research. The research and writing prompts have been game-changers.",
    results: [
      "Doubled client output",
      "Reduced research time by 70%",
      "Increased hourly rate by 40%"
    ],
    timeToResults: "3 days",
    favoritePrompt: "Research & Analysis Pack",
    quote: "I went from 2 articles per day to 4-5, and the quality actually improved. My clients love the structured approach."
  },
  {
    name: "Jennifer Park",
    role: "Small Business Owner",
    company: "Park's Bakery",
    avatar: "JP",
    story: "Running a bakery means wearing many hats. I needed help with marketing emails, social posts, and customer service responses. These prompts gave me professional-level copy without hiring an agency.",
    results: [
      "Saved $2,000/month on marketing",
      "Email open rates increased 45%",
      "Customer retention up 60%"
    ],
    timeToResults: "2 weeks",
    favoritePrompt: "Small Business Marketing Pack",
    quote: "For less than the cost of one freelancer article, I get unlimited professional copywriting. It's incredible."
  },
  {
    name: "David Kim",
    role: "Sales Director",
    company: "CloudSoft Solutions",
    avatar: "DK",
    story: "Our sales team was struggling with personalized outreach at scale. The sales email prompts helped us create targeted messages that actually get responses.",
    results: [
      "Response rates up 180%",
      "Qualified leads increased 250%",
      "Team productivity up 40%"
    ],
    timeToResults: "1 week",
    favoritePrompt: "Sales Email Sequences",
    quote: "These aren't just templates – they're frameworks that help us think strategically about each prospect."
  },
  {
    name: "Lisa Thompson",
    role: "Content Creator",
    company: "YouTube & Blog",
    avatar: "LT",
    story: "Creating consistent, engaging content was exhausting. I was spending entire days brainstorming and writing. Now I plan a month's content in 2 hours.",
    results: [
      "10x faster content creation",
      "Audience growth of 400%",
      "Monetization increased 300%"
    ],
    timeToResults: "5 days",
    favoritePrompt: "Content Creation Goldmine",
    quote: "The content quality is actually better now because the prompts help me think from my audience's perspective."
  },
  {
    name: "Ahmed Hassan",
    role: "Career Changer",
    company: "From Retail to Tech",
    avatar: "AH",
    story: "I was transitioning from retail to a tech career and needed help with my resume, cover letters, and interview prep. The career prompts guided me through the entire process.",
    results: [
      "3 job offers in 2 months",
      "Salary increase of 85%",
      "Confidence in interviews"
    ],
    timeToResults: "6 weeks",
    favoritePrompt: "Career Accelerator Pack",
    quote: "These prompts didn't just help me write better applications – they helped me understand what employers actually want."
  }
];

const SuccessStoriesSection = () => {
  return (
    <section className="space-y-12">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Real Results from Real Users</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          See how professionals across industries are saving hours daily and achieving better results with our proven prompts.
        </p>
      </div>

      {/* Featured Success Story */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardContent className="p-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-start gap-4">
                <Quote className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="text-xl font-medium leading-relaxed mb-4">
                    "{successStories[0].quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {successStories[0].avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{successStories[0].name}</div>
                      <div className="text-sm text-muted-foreground">
                        {successStories[0].role} at {successStories[0].company}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="text-center p-4 bg-background rounded-lg border">
                <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="font-semibold">Time to Results</div>
                <div className="text-sm text-muted-foreground">{successStories[0].timeToResults}</div>
              </div>
              <div className="space-y-2">
                {successStories[0].results.map((result, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span>{result}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Success Stories Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {successStories.slice(1).map((story, index) => (
          <Card key={index} className="group hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                    {story.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-sm">{story.name}</div>
                  <div className="text-xs text-muted-foreground">{story.role}</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {story.story}
                </p>
                
                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">Key Results:</div>
                  {story.results.slice(0, 2).map((result, resultIndex) => (
                    <div key={resultIndex} className="flex items-center gap-2 text-xs">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span>{result}</span>
                    </div>
                  ))}
                </div>
                
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Results in:</span>
                    <Badge variant="outline" className="text-xs">
                      {story.timeToResults}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Industry Breakdown */}
      <Card className="bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold mb-4">Success Across Industries</h3>
            <p className="text-muted-foreground">
              Our prompts work for professionals in every field
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { industry: "Marketing", users: "1,200+", avgSavings: "15 hrs/week" },
              { industry: "Sales", users: "800+", avgSavings: "12 hrs/week" },
              { industry: "Content", users: "900+", avgSavings: "20 hrs/week" },
              { industry: "Freelance", users: "1,500+", avgSavings: "18 hrs/week" }
            ].map((stat, index) => (
              <div key={index} className="text-center p-4 bg-background rounded-lg border">
                <div className="text-2xl font-bold text-primary mb-1">{stat.users}</div>
                <div className="font-medium mb-1">{stat.industry}</div>
                <div className="text-sm text-muted-foreground">Avg. {stat.avgSavings} saved</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <div className="text-center space-y-6">
        <div>
          <h3 className="text-2xl font-semibold mb-4">Ready to Write Your Success Story?</h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of professionals who've transformed their productivity with our proven prompts.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="px-8">
            <Link to="/library">
              Start Free Today <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/packs">View Premium Packs</Link>
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground">
          No credit card required • Results in days, not months
        </p>
      </div>
    </section>
  );
};

export default SuccessStoriesSection;