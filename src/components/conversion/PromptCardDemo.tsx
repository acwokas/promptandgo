import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Star, 
  ChevronDown, 
  CheckCircle, 
  Tag, 
  FileText, 
  Bot, 
  Brain, 
  Sparkles 
} from "lucide-react";

interface PlatformOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const platformOptions: PlatformOption[] = [
  {
    id: "original",
    name: "Core Prompt",
    description: "Original Version",
    icon: <FileText className="h-4 w-4" />,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    description: "OpenAI - Most Popular",
    icon: <Bot className="h-4 w-4" />,
    color: "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
  },
  {
    id: "claude",
    name: "Claude",
    description: "Anthropic - Great for Analysis",
    icon: <Brain className="h-4 w-4" />,
    color: "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
  },
  {
    id: "gemini",
    name: "Gemini",
    description: "Google - Multimodal",
    icon: <Sparkles className="h-4 w-4" />,
    color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400"
  }
];

interface PromptCardDemoProps {
  className?: string;
}

const PromptCardDemo = ({ className = "" }: PromptCardDemoProps) => {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformOption>(platformOptions[0]);

  const selectedOption = platformOptions.find(option => option.id === selectedPlatform.id) || platformOptions[0];

  // Different prompt versions for each platform
  const getOptimizedPrompt = (platformId: string) => {
    switch (platformId) {
      case 'original':
        return "Create a comprehensive neighbourhood guide that covers safety statistics, local services, schools, and amenities for potential homebuyers.";
      case 'chatgpt':
        return "Act as a real estate expert. Create a comprehensive neighbourhood guide for [NEIGHBOURHOOD NAME] that includes: 1) Safety statistics and crime rates 2) Local services (hospitals, banks, shopping) 3) School ratings and educational facilities 4) Amenities and recreational areas 5) Transportation options. Format as a buyer-friendly report with clear sections and actionable insights.";
      case 'claude':
        return "I need you to analyze and compile a neighbourhood assessment report. Please structure your response as a professional real estate guide covering: \n\n<safety_analysis>\n- Crime statistics and trends\n- Police response times\n- Community safety measures\n</safety_analysis>\n\n<services_infrastructure>\n- Healthcare facilities within 5km\n- Banking and postal services\n- Shopping centers and grocery stores\n</services_infrastructure>\n\n<education>\n- Public and private school options\n- School performance ratings\n- Distance from residential areas\n</education>\n\n<lifestyle_amenities>\n- Parks and recreational facilities\n- Public transportation access\n- Community centers and cultural venues\n</lifestyle_amenities>\n\nProvide data-driven insights for [NEIGHBOURHOOD NAME].";
      case 'gemini':
        return "🏘️ NEIGHBOURHOOD ANALYSIS REQUEST\n\nGenerate a detailed neighbourhood profile for real estate purposes. Include:\n\n📊 SAFETY METRICS:\n→ Crime rates vs city average\n→ Safety rankings and trends\n\n🏥 ESSENTIAL SERVICES:\n→ Medical facilities (distance + quality)\n→ Banking, postal, emergency services\n\n🎓 EDUCATION LANDSCAPE:\n→ School performance data\n→ Special programs available\n\n🎯 LIFESTYLE FACTORS:\n→ Parks, recreation, dining\n→ Transit connectivity\n→ Future development plans\n\nTarget audience: First-time homebuyers\nFormat: Easy-to-scan bullet points with key highlights\nFocus: Practical decision-making information";
      default:
        return "Create a comprehensive neighbourhood guide that covers safety statistics, local services, schools, and amenities for potential homebuyers.";
    }
  };

  return (
    <div className={`${className} max-w-full`}>
      <Card className="group relative border-border/50 bg-card hover:shadow-md hover:border-primary/30 transition-all duration-300 cursor-pointer overflow-hidden">
        <CardHeader className="pb-3">
          {/* Top badges and category */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Tag className="h-3.5 w-3.5 text-primary" />
              <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-0 hover:bg-primary/10">
                AI in Real Estate
              </Badge>
            </div>
            <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/10 border-0 dark:bg-green-900/20 dark:text-green-400">
              <CheckCircle className="h-3 w-3 mr-1" />
              FREE
            </Badge>
          </div>
          
          {/* Title */}
          <h3 className="text-lg font-bold leading-tight text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
            Neighbourhood Guide: Safety & Services Overview
          </h3>
          
          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">
            Helping professionals excel in AI in real estate with AI-driven systems and comprehensive neighbourhood analysis.
          </p>
          
          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4].map((star) => (
                <Star key={star} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              ))}
              <Star className="h-3.5 w-3.5 text-muted-foreground/30" />
            </div>
            <span className="text-sm font-semibold text-foreground">4.4</span>
            <span className="text-xs text-muted-foreground">(318 reviews)</span>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          {/* Platform selector */}
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-foreground mb-3">
                Platform-optimized prompt:
              </p>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-between h-auto p-3 bg-background border hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-full ${selectedOption.color}`}>
                        {selectedOption.icon}
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-medium">{selectedOption.name}</div>
                        <div className="text-xs text-muted-foreground">{selectedOption.description}</div>
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent 
                  className="w-[280px] bg-background border shadow-lg z-50"
                  align="start"
                  side="bottom"
                  sideOffset={4}
                >
                  {platformOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.id}
                      className="p-3 cursor-pointer hover:bg-muted/50 focus:bg-muted/50"
                      onClick={() => setSelectedPlatform(option)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className={`p-1.5 rounded-full ${option.color}`}>
                          {option.icon}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{option.name}</div>
                          <div className="text-xs text-muted-foreground">{option.description}</div>
                        </div>
                        {selectedPlatform.id === option.id && (
                          <CheckCircle className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Demo explanation */}
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                ↑ Try selecting different AI platforms to see Scout optimize the same prompt below
              </p>
            </div>

            {/* Optimized prompt display */}
            <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <Bot className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium text-primary">Scout Optimized</span>
              </div>
              <div className="text-sm text-foreground leading-relaxed max-h-32 overflow-y-auto">
                {getOptimizedPrompt(selectedPlatform.id)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PromptCardDemo;