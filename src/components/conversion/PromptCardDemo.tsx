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
    icon: <FileText className="h-5 w-5" />,
    color: "bg-blue-100 text-blue-600"
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    description: "OpenAI - Most Popular",
    icon: <Bot className="h-5 w-5" />,
    color: "bg-green-100 text-green-600"
  },
  {
    id: "claude",
    name: "Claude",
    description: "Anthropic - Great for Analysis",
    icon: <Brain className="h-5 w-5" />,
    color: "bg-purple-100 text-purple-600"
  },
  {
    id: "gemini",
    name: "Gemini",
    description: "Google - Multimodal",
    icon: <Sparkles className="h-5 w-5" />,
    color: "bg-yellow-100 text-yellow-600"
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
      <Card className="border-2 border-primary/20 shadow-lg hover:shadow-xl transition-shadow max-w-full overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between mb-3">
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
              <CheckCircle className="h-3 w-3 mr-1" />
              FREE
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <Tag className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">AI in Real Estate</span>
          </div>
          
          <h3 className="text-xl font-bold text-foreground mb-2">
            Neighbourhood Guide: Safety & Services Overview
          </h3>
          
          <p className="text-muted-foreground text-sm mb-3">
            Helping professionals excel in AI in real estate with AI-driven systems.
          </p>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[1, 2, 3, 4].map((star) => (
                <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
              <Star className="h-4 w-4 text-gray-300" />
            </div>
            <span className="font-semibold">4.4</span>
            <span className="text-muted-foreground text-sm">(318)</span>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="font-medium text-foreground mb-3">
                Platform-optimized prompt:
              </p>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-between h-auto p-4 bg-background border-2 hover:bg-muted/50 mb-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${selectedOption.color}`}>
                        {selectedOption.icon}
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">{selectedOption.name}</div>
                        <div className="text-sm text-muted-foreground">{selectedOption.description}</div>
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent 
                  className="w-[calc(100vw-2rem)] max-w-[320px] bg-background border-2 shadow-lg z-50"
                  align="start"
                >
                  {platformOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.id}
                      className="p-4 cursor-pointer hover:bg-muted/50 focus:bg-muted/50"
                      onClick={() => setSelectedPlatform(option)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className={`p-2 rounded-full ${option.color}`}>
                          {option.icon}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold">{option.name}</div>
                          <div className="text-sm text-muted-foreground">{option.description}</div>
                        </div>
                        {selectedPlatform.id === option.id && (
                          <CheckCircle className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Show the optimized prompt */}
              <div className="bg-muted/30 rounded-lg p-4 border-2 border-dashed border-primary/20 min-h-[120px]">
                <div className="flex items-center gap-2 mb-3">
                  <Bot className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Scout Optimized</span>
                </div>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                  {getOptimizedPrompt(selectedPlatform.id)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Demo explanation */}
      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          ↑ Try selecting different AI platforms to see Scout optimize the same prompt
        </p>
      </div>
    </div>
  );
};

export default PromptCardDemo;