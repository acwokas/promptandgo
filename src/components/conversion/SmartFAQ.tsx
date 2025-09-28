import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, MessageCircle, Sparkles } from "lucide-react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'getting-started' | 'pricing' | 'features' | 'technical';
  priority: number;
}

const faqs: FAQ[] = [
  {
    id: '1',
    question: "How quickly can I start saving time with AI prompts?",
    answer: "You can start immediately! Browse our library of 3,000+ proven prompts, copy what you need, and start using them right away. Most users save 2-3 hours in their first week.",
    category: 'getting-started',
    priority: 1
  },
  {
    id: '2',
    question: "Do I need technical skills to use these prompts?",
    answer: "Not at all! Our prompts are designed for everyone. Simply copy, paste into your preferred AI tool (ChatGPT, Claude, etc.), and customize as needed. No coding required.",
    category: 'getting-started',
    priority: 2
  },
  {
    id: '3',
    question: "What's included in the free plan?",
    answer: "Free users get access to 50+ high-quality prompts, basic Scout AI assistance, and our getting started guide. Perfect for trying out our system.",
    category: 'pricing',
    priority: 3
  },
  {
    id: '4',
    question: "How is this different from writing my own prompts?",
    answer: "Our prompts are battle-tested by thousands of users and optimized for specific results. They include advanced techniques like role-playing, context setting, and output formatting that most people don't know.",
    category: 'features',
    priority: 4
  }
];

interface SmartFAQProps {
  maxItems?: number;
  showCategory?: boolean;
}

const SmartFAQ = ({ maxItems = 4, showCategory = false }: SmartFAQProps) => {
  const { user } = useSupabaseAuth();
  const [openItems, setOpenItems] = useState<string[]>([]);
  
  // Personalize FAQ based on user status
  const getPersonalizedFAQs = () => {
    if (!user) {
      // Show getting-started FAQs for non-users
      return faqs.filter(faq => faq.category === 'getting-started').slice(0, maxItems);
    }
    
    // Show mixed content for logged-in users
    return faqs.slice(0, maxItems);
  };

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const personalizedFAQs = getPersonalizedFAQs();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          Quick Answers
          {!user && <Sparkles className="h-4 w-4 text-primary animate-pulse" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {personalizedFAQs.map((faq) => (
          <Collapsible
            key={faq.id}
            open={openItems.includes(faq.id)}
            onOpenChange={() => toggleItem(faq.id)}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between text-left h-auto p-4 border rounded-lg hover:bg-muted/50"
              >
                <span className="font-medium">{faq.question}</span>
                <ChevronDown 
                  className={`h-4 w-4 transition-transform ${
                    openItems.includes(faq.id) ? 'transform rotate-180' : ''
                  }`} 
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4 pt-2">
              <p className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </p>
              {showCategory && (
                <span className="inline-block mt-2 px-2 py-1 text-xs bg-primary/10 text-primary rounded">
                  {faq.category.replace('-', ' ')}
                </span>
              )}
            </CollapsibleContent>
          </Collapsible>
        ))}
        
        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground text-center">
            Need more help? {' '}
            <Button variant="link" className="h-auto p-0" asChild>
              <a href="/contact">Contact our team</a>
            </Button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartFAQ;