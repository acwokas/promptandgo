import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Gift, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const EmailConfirmed = () => {
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name");
  const powerpack = searchParams.get("powerpack") === "true";

  return (
    <>
      <SEO 
        title="Email Confirmed - promptandgo"
        description="Your email has been confirmed successfully"
        canonical="https://promptandgo.ai/email-confirmed"
        noindex={true}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 py-16">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Email Confirmed</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="max-w-2xl mx-auto">
            <Card className="border-0 shadow-2xl bg-card/80 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <div className="mb-8">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                  <h1 className="text-4xl font-bold text-foreground mb-4">
                    Email Confirmed! ✅
                  </h1>
                  <p className="text-xl text-muted-foreground mb-6">
                    {name ? `Thank you ${name}! ` : "Thank you! "}
                    Your email has been confirmed and your message has been sent to our team.
                  </p>
                  
                  {powerpack && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-6">
                      <div className="flex items-center justify-center gap-3 mb-3">
                        <Gift className="w-6 h-6 text-green-600" />
                        <h3 className="text-lg font-semibold text-green-800">
                          Your Free PowerPack is Coming!
                        </h3>
                      </div>
                      <p className="text-green-700">
                        We'll be sending you our premium prompt collection to help supercharge your AI workflows. Keep an eye on your inbox!
                      </p>
                    </div>
                  )}
                  
                  <p className="text-muted-foreground mb-8">
                    We'll get back to you within 24 hours.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    While you wait, explore these resources:
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <Link to="/library">
                      <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary/20">
                        <CardContent className="p-6">
                          <div className="text-2xl mb-3">📚</div>
                          <h4 className="font-semibold text-foreground mb-2">Prompt Library</h4>
                          <p className="text-sm text-muted-foreground">Browse 1000+ AI prompts</p>
                        </CardContent>
                      </Card>
                    </Link>
                    
                    <Link to="/tips">
                      <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary/20">
                        <CardContent className="p-6">
                          <div className="text-2xl mb-3">✍️</div>
                          <h4 className="font-semibold text-foreground mb-2">Blog & Guides</h4>
                          <p className="text-sm text-muted-foreground">Learn AI best practices</p>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                    <Button asChild size="lg" className="group">
                      <Link to="/">
                        Return to promptandgo
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                    
                    <Button asChild variant="outline" size="lg">
                      <Link to="/library">
                        Browse Prompts
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmailConfirmed;