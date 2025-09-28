import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Star, 
  ChevronDown, 
  CheckCircle, 
  Tag, 
  FileText, 
  Bot, 
  Brain, 
  Sparkles,
  Search,
  Zap,
  Palette,
  Tornado,
  Rocket
} from "lucide-react";
import { AI_PROVIDERS } from "@/lib/promptRewriter";

interface PlatformOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

// Create icon mapping for the AI providers
const getProviderIcon = (providerId: string): React.ReactNode => {
  const iconMap: { [key: string]: React.ReactNode } = {
    chatgpt: <Bot className="h-4 w-4" />,
    claude: <Brain className="h-4 w-4" />,
    gemini: <Sparkles className="h-4 w-4" />,
    deepseek: <Search className="h-4 w-4" />,
    groq: <Zap className="h-4 w-4" />,
    mistral: <Tornado className="h-4 w-4" />,
    llama: <Bot className="h-4 w-4" />,
    perplexity: <Search className="h-4 w-4" />,
    zenochat: <Rocket className="h-4 w-4" />,
    midjourney: <Palette className="h-4 w-4" />,
    ideogram: <Palette className="h-4 w-4" />,
    nanobanana: <Palette className="h-4 w-4" />
  };
  return iconMap[providerId] || <Bot className="h-4 w-4" />;
};

// Create color mapping for providers
const getProviderColor = (category: string, index: number): string => {
  const textColors = [
    "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400", 
    "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400",
    "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400",
    "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
    "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400",
    "bg-teal-100 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400",
    "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400"
  ];
  
  const imageColors = [
    "bg-violet-100 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400",
    "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
    "bg-pink-100 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400"
  ];
  
  if (category === 'text') {
    return textColors[index % textColors.length];
  } else {
    return imageColors[index % imageColors.length];
  }
};

// Convert AI_PROVIDERS to platform options and organize
const convertedProviders = AI_PROVIDERS.map((provider, index) => ({
  id: provider.id,
  name: provider.name,
  description: provider.description,
  icon: getProviderIcon(provider.id),
  color: getProviderColor(provider.category, index),
  category: provider.category
}));

// Separate and sort providers
const textProviders = convertedProviders
  .filter(p => p.category === 'text')
  .sort((a, b) => a.name.localeCompare(b.name));

const imageProviders = convertedProviders
  .filter(p => p.category === 'image')
  .sort((a, b) => a.name.localeCompare(b.name));

// Original prompt option
const originalOption = {
  id: "original",
  name: "Core Prompt",
  description: "Original Version",
  icon: <FileText className="h-4 w-4" />,
  color: "bg-slate-100 text-slate-600 dark:bg-slate-900/20 dark:text-slate-400",
  category: "original"
};

const platformOptions: PlatformOption[] = [originalOption, ...textProviders, ...imageProviders];

interface PromptCardDemoProps {
  className?: string;
}

const PromptCardDemo = ({ className = "" }: PromptCardDemoProps) => {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformOption>(platformOptions[0]);

  const selectedOption = platformOptions.find(option => option.id === selectedPlatform.id) || platformOptions[0];

  // Get optimized prompt using AI_PROVIDERS rewrite patterns
  const getOptimizedPrompt = (platformId: string) => {
    const basePrompt = "Create a comprehensive neighbourhood guide that covers safety statistics, local services, schools, and amenities for potential homebuyers.";
    
    if (platformId === 'original') {
      return basePrompt;
    }
    
    const provider = AI_PROVIDERS.find(p => p.id === platformId);
    if (provider) {
      return provider.rewritePattern(basePrompt);
    }
    
    return basePrompt;
  };

  return (
    <div className={`${className} max-w-full`}>
      <h3 className="text-xl font-semibold mb-4 text-center">Prompt Template</h3>
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
                    className="w-full justify-start h-auto p-3 bg-background border hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-full ${selectedOption.color}`}>
                        {selectedOption.icon}
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-medium">{selectedOption.name}</div>
                        <div className="text-xs text-muted-foreground">{selectedOption.description}</div>
                      </div>
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent 
                  className="w-[280px] bg-background border shadow-lg z-50 p-0"
                  align="start"
                  side="bottom"
                  sideOffset={4}
                >
                  <ScrollArea className="h-80">
                    <div className="p-1">
                      <DropdownMenuItem
                        className="p-3 cursor-pointer hover:bg-muted/50 focus:bg-muted/50"
                        onClick={() => setSelectedPlatform(originalOption)}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className={`p-1.5 rounded-full ${originalOption.color}`}>
                            {originalOption.icon}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">{originalOption.name}</div>
                            <div className="text-xs text-muted-foreground">{originalOption.description}</div>
                          </div>
                          {selectedPlatform.id === originalOption.id && (
                            <CheckCircle className="h-4 w-4 text-primary" />
                          )}
                        </div>
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Text Generation</DropdownMenuLabel>
                      {textProviders.map((option) => (
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
                      
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Image Generation</DropdownMenuLabel>
                      {imageProviders.map((option) => (
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
                    </div>
                  </ScrollArea>
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