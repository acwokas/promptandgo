import SEO from "@/components/SEO";
import PageHero from "@/components/layout/PageHero";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Sparkles, Zap, BookOpen, Palette } from "lucide-react";

const MembershipSuccess = () => {
  const [isActivating, setIsActivating] = useState(true);
  const [membershipData, setMembershipData] = useState<{ tier?: string; end?: string } | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('check-subscription');
        if (error) {
          console.error('Membership check error:', error);
          toast({ title: 'Membership check failed', variant: 'destructive' });
        } else {
          if (data?.subscribed) {
            setMembershipData({
              tier: data.subscription_tier || 'Premium',
              end: data.subscription_end
            });
            toast({ 
              title: 'Membership activated successfully!', 
              description: 'Welcome to your premium AI prompt experience.' 
            });
          } else {
            toast({ 
              title: 'Membership activation pending', 
              description: 'Your subscription is being processed. Please refresh in a few moments.' 
            });
          }
        }
      } catch (error) {
        console.error('Membership check failed:', error);
        toast({ title: 'Membership check failed', variant: 'destructive' });
      } finally {
        setIsActivating(false);
      }
    };

    // Check immediately
    checkStatus();
    
    // Check again after 3 seconds for any delayed activation
    const timeout = setTimeout(checkStatus, 3000);
    
    return () => clearTimeout(timeout);
  }, []);

  const features = [
    {
      icon: <Sparkles className="h-5 w-5 text-primary" />,
      title: "Premium AI Prompts",
      description: "Access to our exclusive collection of advanced AI prompts",
      link: "/library"
    },
    {
      icon: <Zap className="h-5 w-5 text-primary" />,
      title: "AI Prompt Generator",
      description: "Create custom prompts with our intelligent AI generator",
      link: "/ai/generator"
    },
    {
      icon: <BookOpen className="h-5 w-5 text-primary" />,
      title: "Premium Prompt Packs",
      description: "Curated collections of prompts for specific industries",
      link: "/packs"
    },
    {
      icon: <Palette className="h-5 w-5 text-primary" />,
      title: "AI Assistant",
      description: "Get personalized help with your AI prompt needs",
      link: "/ai/assistant"
    }
  ];

  return (
    <>
      <SEO title="Membership Success" description="Your membership is now active. Explore premium AI prompts and tools." />
      <PageHero 
        title={
          <>
            Welcome to <span className="text-gradient-brand">Premium</span>
          </>
        } 
        subtitle={
          isActivating 
            ? <>Activating your membership and unlocking premium features...</>
            : membershipData?.tier 
              ? <>Your {membershipData.tier} membership is now active!</>
              : <>Almost there! Your membership is being processed...</>
        } 
        minHeightClass="min-h-[32svh]" 
      />
      
      <main className="container py-10">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Membership Success</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Status Card */}
        <Card className="mb-8 text-center">
          <CardContent className="pt-8 pb-6">
            {isActivating ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-lg font-medium">Activating your membership...</p>
                <p className="text-muted-foreground">This may take a few moments</p>
              </div>
            ) : membershipData?.tier ? (
              <div className="flex flex-col items-center space-y-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
                <div>
                  <Badge variant="secondary" className="mb-2">{membershipData.tier} Member</Badge>
                  <p className="text-xl font-semibold text-green-600">Membership Active!</p>
                  <p className="text-muted-foreground mt-2">
                    You now have access to all premium features and exclusive content.
                  </p>
                  {membershipData.end && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Next billing: {new Date(membershipData.end).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xl font-semibold text-yellow-600">Processing...</p>
                  <p className="text-muted-foreground mt-2">
                    Your membership is being activated. Please refresh the page in a few moments.
                  </p>
                  <Button 
                    onClick={() => window.location.reload()} 
                    variant="outline" 
                    className="mt-4"
                  >
                    Refresh Page
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Premium Features */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-center mb-6">Start Exploring Your Premium Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    {feature.icon}
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{feature.description}</CardDescription>
                  <Button asChild variant="outline" className="w-full">
                    <Link to={feature.link}>Explore Now</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button asChild size="lg" className="h-12">
                <Link to="/library">Browse Premium Prompts</Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="h-12">
                <Link to="/ai/generator">Generate Custom Prompts</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12">
                <Link to="/account">Manage Account</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
};

export default MembershipSuccess;