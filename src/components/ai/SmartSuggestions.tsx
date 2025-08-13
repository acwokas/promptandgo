import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useSmartSuggestions } from "@/hooks/useSmartSuggestions";
import { Brain, Search, Loader2, Lightbulb, TrendingUp } from "lucide-react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useToast } from "@/hooks/use-toast";

const SmartSuggestions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  
  // Mock user context for demo - in real app, this would come from user profile
  const userContext = {
    industry: 'Technology',
    project_type: 'Content Creation',
    preferred_tone: 'Professional',
    desired_outcome: 'Engagement'
  };
  
  const { 
    smartSuggestions, 
    isLoadingSuggestions, 
    generateSmartSuggestions 
  } = useSmartSuggestions(userContext);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      generateSmartSuggestions(searchQuery);
    } else {
      toast({
        title: "Search query required",
        description: "Please enter what you're looking for.",
        variant: "destructive"
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-600 bg-green-50";
    if (confidence >= 0.6) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return "High Match";
    if (confidence >= 0.6) return "Good Match";
    return "Partial Match";
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Smart Suggestions</h1>
        </div>
        <p className="text-muted-foreground">
          AI-powered recommendations tailored to your needs and context
        </p>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            What are you looking for?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="e.g., marketing copy for social media, email templates for sales..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button onClick={handleSearch} disabled={isLoadingSuggestions}>
              {isLoadingSuggestions ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* User Context Display */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Context</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">
              <TrendingUp className="h-3 w-3 mr-1" />
              {userContext.industry}
            </Badge>
            <Badge variant="outline">{userContext.project_type}</Badge>
            <Badge variant="outline">{userContext.preferred_tone} tone</Badge>
            <Badge variant="outline">Goal: {userContext.desired_outcome}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Suggestions are personalized based on your preferences and context.
          </p>
        </CardContent>
      </Card>

      {/* Suggestions Results */}
      {isLoadingSuggestions ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-lg font-medium">Analyzing your needs...</p>
              <p className="text-muted-foreground">AI is finding the perfect prompts for you</p>
            </div>
          </CardContent>
        </Card>
      ) : smartSuggestions.length > 0 ? (
        <div className="grid gap-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-primary" />
            AI Recommendations
          </h2>
          
          {smartSuggestions.map((suggestion, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold">{suggestion.title}</h3>
                  <div className="flex items-center gap-2">
                    <Badge 
                      className={`${getConfidenceColor(suggestion.confidence)} text-xs`}
                    >
                      {getConfidenceLabel(suggestion.confidence)}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {suggestion.category}
                    </Badge>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-4">
                  {suggestion.reason}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-muted-foreground">
                      Confidence: {Math.round(suggestion.confidence * 100)}%
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Prompt
                    </Button>
                    <Button size="sm">
                      Try This
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <Brain className="h-16 w-16 mx-auto text-muted-foreground/50" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Ready to help!</h3>
                <p className="text-muted-foreground">
                  Enter what you're looking for above to get personalized AI recommendations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">💡 Tips for Better Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Be Specific</h4>
              <p className="text-muted-foreground">
                "Email templates for B2B sales" vs just "emails"
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Include Context</h4>
              <p className="text-muted-foreground">
                Mention your industry, audience, or goal
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Use Natural Language</h4>
              <p className="text-muted-foreground">
                Describe what you need like you're asking a colleague
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Iterate</h4>
              <p className="text-muted-foreground">
                Try different searches to discover new possibilities
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartSuggestions;