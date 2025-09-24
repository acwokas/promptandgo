import React, { useState, useEffect } from 'react';
import { DollarSign, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface FinanceInvestmentData {
  category: string;
  usageText: string;
  link: string;
}

const FinanceInvestmentSection = () => {
  const [financeData, setFinanceData] = useState<FinanceInvestmentData | null>(null);

  useEffect(() => {
    // Allowed search queries as specified by the user
    const allowedQueries = [
      'Marketing',
      'Career', 
      'Content',
      'Productivity',
      'Ecommerce',
      'Health and Wellness',
      'Lifestyle and Hobbies'
    ];

    // Generate random data on component mount
    const generateRandomData = () => {
      // Randomly select one of the allowed queries
      const randomCategory = allowedQueries[Math.floor(Math.random() * allowedQueries.length)];
      
      // Generate random usage between 1x and 4x (never above 4x as requested)
      const randomUsage = Math.floor(Math.random() * 4) + 1;
      
      // Create the search link for the selected category
      const searchLink = `/library?search=${encodeURIComponent(randomCategory)}`;
      
      return {
        category: randomCategory,
        usageText: `${randomUsage}x usage today`,
        link: searchLink
      };
    };

    setFinanceData(generateRandomData());
  }, []);

  if (!financeData) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center">
          <DollarSign className="h-6 w-6 text-white" />
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse border-2 border-background" />
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-lg">Finance & Investment</h3>
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-primary/10 px-2 py-0.5 rounded-full text-xs font-medium">
            🔥 {financeData.usageText}
          </span>
          <Button asChild variant="ghost" size="sm" className="h-6 px-2 text-xs text-primary hover:text-primary">
            <Link to={financeData.link}>
              Explore {financeData.category} prompts <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </p>
      </div>
    </div>
  );
};

export default FinanceInvestmentSection;