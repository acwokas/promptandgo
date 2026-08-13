import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvatarUpload } from "./AvatarUpload";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Bot, Send, User, Loader2, Lightbulb, Search } from "lucide-react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useAIUsage } from "@/hooks/useAIUsage";
import UsageDisplay from "@/components/ai/UsageDisplay";
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import { validateSecureInput } from "@/lib/securityUtils";
import { AI_PERSONA } from "@/lib/aiPersona";


interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: AI_PERSONA.greetings.assistant,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useSupabaseAuth();
  const { refreshUsage } = useAIUsage();
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string>(user?.user_metadata?.avatar_url || "");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setCurrentAvatarUrl(user?.user_metadata?.avatar_url || "");
  }, [user]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Validate input for security
    const validation = validateSecureInput(inputMessage);
    if (!validation.isValid) {
      toast({
        title: "Invalid input",
        description: validation.error,
        variant: "destructive"
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-prompt-assistant', {
        body: {
          type: 'assistant',
          prompt: inputMessage,
          context: `User is ${user ? 'logged in' : 'not logged in'}. Previous conversation: ${JSON.stringify(messages.slice(-3))}`
        }
      });

      if (error) {
        // Handle usage limit exceeded
        if (error.message?.includes('Daily limit exceeded') || data?.usageExceeded) {
          window.location.href = `/ai-credits-exhausted?type=assistant&usage=${data?.currentUsage || 0}&limit=${data?.dailyLimit || 0}`;
          return;
        }
        throw error;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.result,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Refresh usage display after successful response
      refreshUsage();
    } catch (error: any) {
      console.error('Error getting AI response:', error);
      
      // Check if it's a usage limit error
      if (error.message?.includes('Daily limit exceeded')) {
        window.location.href = '/ai-credits-exhausted?type=assistant';
        return;
      }

      toast({
        title: "Assistant unavailable",
        description: "Failed to get response from Scout. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = AI_PERSONA.quickActions.map(action => ({
    label: action.label,
    icon: action.icon === "Search" ? Search : Lightbulb
  }));

  const handleQuickAction = (action: string) => {
    setInputMessage(action);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center space-y-4 mb-6">
        {/* Scout's Avatar */}
        <div className="flex justify-center">
          <div className="relative overflow-hidden rounded-full">
            <video 
              src="/scout-animation-v2.mp4" 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-primary/20 shadow-lg hover-scale overflow-hidden"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full border-2 border-background flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-3xl font-bold">{AI_PERSONA.name}</h1>
          <Badge variant="secondary" className="text-xs">{AI_PERSONA.tagline}</Badge>
        </div>
        <p className="text-muted-foreground">
          {AI_PERSONA.ui.assistantSubtitle}
        </p>
      </div>

      {/* Usage Display for logged-in users */}
      {user && (
        <UsageDisplay usageType="assistant" compact />
      )}

      {user && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">Your Chat Avatar</h3>
                <p className="text-sm text-muted-foreground">
                  This avatar appears in your chat messages below
                </p>
              </div>
              <AvatarUpload onAvatarUpdate={setCurrentAvatarUrl} />
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="h-[700px] flex flex-col">
        <CardHeader className="pb-3 flex-shrink-0">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bot className="h-5 w-5" />
            {AI_PERSONA.ui.assistantTitle}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0 min-h-0">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarFallback className="bg-primary/10">
                        <Bot className="h-4 w-4 text-primary" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="text-sm">
                      {message.role === 'assistant' ? (
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap">{message.content}</div>
                      )}
                    </div>
                    <div className={`text-xs mt-2 opacity-70`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  {message.role === 'user' && (
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarImage src={currentAvatarUrl} />
                      <AvatarFallback className="bg-muted">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className="bg-primary/10">
                      <Bot className="h-4 w-4 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      AI is thinking...
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="px-6 py-3 flex-shrink-0 border-t">
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction(action.label)}
                  className="text-xs"
                >
                  <action.icon className="h-3 w-3 mr-1" />
                  {action.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="px-6 py-4 flex-shrink-0 border-t">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask Scout anything about prompts..."
                disabled={isLoading}
              />
              <Button 
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistant;