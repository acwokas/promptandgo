import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, Copy, Clock } from "lucide-react";

interface PopularCategoriesProps {
  onCategoryClick: (query: string) => void;
}

const categories = [
  { query: "marketing", icon: TrendingUp, label: "Marketing", count: "850+", colorClass: "from-blue-50 to-transparent border-blue-200 dark:from-blue-950 dark:border-blue-800", iconColorClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  { query: "career", icon: Users, label: "Career", count: "420+", colorClass: "from-green-50 to-transparent border-green-200 dark:from-green-950 dark:border-green-800", iconColorClass: "bg-green-500/10 text-green-600 dark:text-green-400" },
  { query: "content", icon: Copy, label: "Content", count: "380+", colorClass: "from-purple-50 to-transparent border-purple-200 dark:from-purple-950 dark:border-purple-800", iconColorClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
  { query: "productivity", icon: Clock, label: "Productivity", count: "290+", colorClass: "from-orange-50 to-transparent border-orange-200 dark:from-orange-950 dark:border-orange-800", iconColorClass: "bg-orange-500/10 text-orange-600 dark:text-orange-400" },
];

export function PopularCategories({ onCategoryClick }: PopularCategoriesProps) {
  return (
    <div className="lg:col-span-2">
      <h2 className="text-xl font-semibold mb-3">Popular Categories</h2>
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        {categories.map((cat) => (
          <Card 
            key={cat.query}
            className={`group hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer bg-gradient-to-br ${cat.colorClass}`}
            onClick={() => onCategoryClick(cat.query)}
          >
            <CardContent className="p-4 text-center">
              <div className={`w-8 h-8 ${cat.iconColorClass} rounded-full flex items-center justify-center mx-auto mb-2`}>
                <cat.icon className="h-4 w-4" />
              </div>
              <h3 className="font-medium text-sm mb-1">{cat.label}</h3>
              <p className="text-xs text-muted-foreground">{cat.count}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
