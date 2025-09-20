import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Clock, Users, Zap, Target, CheckCircle } from "lucide-react";

const metrics = [
  {
    icon: TrendingUp,
    value: "10-15h",
    label: "Average Weekly Time Saved",
    description: "Users report saving 10-15 hours per week on content creation",
    color: "text-green-600"
  },
  {
    icon: Clock,
    value: "3 min",
    label: "Average Setup Time",
    description: "From browsing to copy-paste ready in under 3 minutes",
    color: "text-blue-600"
  },
  {
    icon: Target,
    value: "95%",
    label: "Success Rate",
    description: "95% of users get desired results on first try",
    color: "text-purple-600"
  },
  {
    icon: Users,
    value: "5,000+",
    label: "Active Professionals",
    description: "Growing community of marketers, creators, and entrepreneurs",
    color: "text-primary"
  }
];

const industries = [
  { name: "Marketing & Advertising", percentage: 35, users: "1,750+" },
  { name: "Content Creation", percentage: 28, users: "1,400+" },
  { name: "Sales & Business Development", percentage: 20, users: "1,000+" },
  { name: "Freelancers & Consultants", percentage: 17, users: "850+" }
];

const PerformanceMetrics = () => {
  return (
    <div className="space-y-12">
      {/* Main Metrics */}
      <div>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Real Performance Metrics</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Data from 5,000+ active users who've transformed their productivity with our prompts
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-full bg-background flex items-center justify-center mx-auto mb-4 ${metric.color}`}>
                  <metric.icon className="h-6 w-6" />
                </div>
                <div className="text-3xl font-bold mb-2">{metric.value}</div>
                <div className="font-semibold mb-2">{metric.label}</div>
                <p className="text-sm text-muted-foreground">{metric.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Industry Breakdown */}
      <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-semibold mb-4">Who Uses Our Prompts?</h3>
          <p className="text-muted-foreground">
            Professionals across industries trust our proven prompts
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          {industries.map((industry, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-background rounded-lg">
              <div className="flex-1">
                <div className="font-semibold mb-1">{industry.name}</div>
                <div className="text-sm text-muted-foreground">{industry.users} users</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-20 bg-muted rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-1000"
                    style={{ width: `${industry.percentage}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-10 text-right">{industry.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Benefits */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 dark:from-green-950 dark:border-green-800">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-4" />
            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Instant Results</h4>
            <p className="text-sm text-green-700 dark:text-green-300">
              No learning curve. Copy, paste, and get professional results immediately.
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 dark:from-blue-950 dark:border-blue-800">
          <CardContent className="p-6 text-center">
            <Zap className="h-8 w-8 text-blue-600 mx-auto mb-4" />
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Massive Time Savings</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              What used to take hours now takes minutes. Users save 10-15 hours weekly.
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 dark:from-purple-950 dark:border-purple-800">
          <CardContent className="p-6 text-center">
            <Target className="h-8 w-8 text-purple-600 mx-auto mb-4" />
            <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Proven Success</h4>
            <p className="text-sm text-purple-700 dark:text-purple-300">
              95% success rate. These aren't random prompts - they're battle-tested by professionals.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PerformanceMetrics;