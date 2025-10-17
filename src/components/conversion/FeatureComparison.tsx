import { Check, X, Crown, Users, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const features = [
  {
    category: "Core Features",
    items: [
      { name: "Access to 3,000+ prompts", free: true, premium: true, annual: true },
      { name: "Copy & paste optimization", free: true, premium: true, annual: true },
      { name: "Works with all AI tools", free: true, premium: true, annual: true },
      { name: "Basic Scout AI", free: true, premium: true, annual: true },
      { name: "Community support", free: true, premium: true, annual: true },
    ]
  },
  {
    category: "Advanced Features",
    items: [
      { name: "5,000+ premium prompts", free: false, premium: true, annual: true },
      { name: "Industry-specific packs", free: false, premium: true, annual: true },
      { name: "Advanced Scout AI customization", free: false, premium: true, annual: true },
      { name: "Priority email support", free: false, premium: true, annual: true },
      { name: "Early access to new features", free: false, premium: true, annual: true },
    ]
  },
  {
    category: "Exclusive Benefits",
    items: [
      { name: "Annual updates guarantee", free: false, premium: false, annual: true },
      { name: "VIP community access", free: false, premium: false, annual: true },
      { name: "Beta features testing", free: false, premium: false, annual: true },
      { name: "Direct founder access", free: false, premium: false, annual: true },
      { name: "Free future product releases", free: false, premium: false, annual: true },
    ]
  }
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "Forever",
    icon: Users,
    iconColor: "text-green-600",
    bgColor: "bg-green-100",
    popular: false,
    cta: "Get Started FREE",
    link: "/auth?mode=signup"
  },
  {
    name: "Premium",
    price: "$12.99",
    period: "per month",
    icon: Crown,
    iconColor: "text-primary",
    bgColor: "bg-primary/10",
    popular: true,
    cta: "Start Premium Trial",
    link: "/auth?mode=signup&plan=premium"
  },
  {
    name: "Annual",
    price: "$99.50",
    period: "one-time",
    originalPrice: "$199",
    icon: Zap,
    iconColor: "text-purple-600",
    bgColor: "bg-gradient-to-r from-primary/20 to-accent/20",
    popular: false,
    badge: "Best Value",
    cta: "Get Annual Access",
    link: "/auth?mode=signup&plan=annual"
  }
];

const FeatureComparison = () => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Compare Plans & Features</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          See exactly what you get with each plan. All plans include our proven prompts that save 10+ hours weekly.
        </p>
      </div>

      {/* Mobile Plan Cards */}
      <div className="md:hidden space-y-4">
        {plans.map((plan) => (
          <Card key={plan.name} className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground px-4 py-1">
                  Most Popular
                </Badge>
              </div>
            )}
            {plan.badge && !plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-1">
                  {plan.badge}
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center pb-4">
              <div className={`w-12 h-12 ${plan.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <plan.icon className={`h-6 w-6 ${plan.iconColor}`} />
              </div>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <div className="space-y-1">
                <div className="text-3xl font-bold">{plan.price}</div>
                {plan.originalPrice && (
                  <div className="text-muted-foreground text-sm">
                    <span className="line-through">{plan.originalPrice}</span> {plan.period}
                  </div>
                )}
                {!plan.originalPrice && (
                  <p className="text-muted-foreground text-sm">{plan.period}</p>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {features.map((category) => (
                  <div key={category.category}>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">{category.category}</h4>
                    <ul className="space-y-2">
                      {category.items.map((feature) => {
                        const hasFeature = feature[plan.name.toLowerCase() as keyof typeof feature];
                        return (
                          <li key={feature.name} className="flex items-center gap-2 text-sm">
                            {hasFeature ? (
                              <Check className={`h-4 w-4 ${plan.name === 'Free' ? 'text-green-500' : plan.name === 'Premium' ? 'text-primary' : 'text-purple-500'}`} />
                            ) : (
                              <X className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className={hasFeature ? '' : 'text-muted-foreground'}>{feature.name}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
              
              <Button 
                asChild 
                className="w-full" 
                variant={plan.popular ? "default" : "outline"}
              >
                <Link to={plan.link}>{plan.cta}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop Comparison Table */}
      <div className="hidden md:block">
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div></div>
          {plans.map((plan) => (
            <Card key={plan.name} className={`relative text-center ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              {plan.badge && !plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-1">
                    {plan.badge}
                  </Badge>
                </div>
              )}
              
              <CardHeader className="pb-4">
                <div className={`w-12 h-12 ${plan.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <plan.icon className={`h-6 w-6 ${plan.iconColor}`} />
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="space-y-1">
                  <div className="text-3xl font-bold">{plan.price}</div>
                  {plan.originalPrice && (
                    <div className="text-muted-foreground text-sm">
                      <span className="line-through">{plan.originalPrice}</span> {plan.period}
                    </div>
                  )}
                  {!plan.originalPrice && (
                    <p className="text-muted-foreground text-sm">{plan.period}</p>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <Button 
                  asChild 
                  className="w-full" 
                  variant={plan.popular ? "default" : "outline"}
                >
                  <Link to={plan.link}>{plan.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody>
                  {features.map((category, categoryIndex) => (
                    <>
                      <tr key={category.category} className={categoryIndex > 0 ? 'border-t-2' : ''}>
                        <td className="p-4 font-semibold text-lg bg-muted/50" colSpan={4}>
                          {category.category}
                        </td>
                      </tr>
                      {category.items.map((feature, featureIndex) => (
                        <tr key={feature.name} className={`${featureIndex % 2 === 0 ? 'bg-muted/20' : ''}`}>
                          <td className="p-4 font-medium">{feature.name}</td>
                          <td className="p-4 text-center">
                            {feature.free ? (
                              <Check className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-muted-foreground mx-auto" />
                            )}
                          </td>
                          <td className="p-4 text-center">
                            {feature.premium ? (
                              <Check className="h-5 w-5 text-primary mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-muted-foreground mx-auto" />
                            )}
                          </td>
                          <td className="p-4 text-center">
                            {feature.annual ? (
                              <Check className="h-5 w-5 text-purple-500 mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-muted-foreground mx-auto" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom CTA */}
      <div className="text-center">
        <p className="text-muted-foreground mb-4">
          Still have questions? <Link to="/faqs" className="text-primary hover:underline">Check our FAQ</Link> or <Link to="/contact" className="text-primary hover:underline">contact support</Link>
        </p>
      </div>
    </div>
  );
};

export default FeatureComparison;