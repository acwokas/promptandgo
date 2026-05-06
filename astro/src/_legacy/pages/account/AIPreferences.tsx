import SEO from "@/components/SEO";
import PageHero from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { AIPreferencesSelector } from "@/components/ai/AIPreferencesSelector";
import { ArrowLeft } from "lucide-react";

const AIPreferencesPage = () => {
  return (
    <>
      <SEO title="AI Preferences" description="Customize which AI providers appear in your prompt rewriter dropdown." />
      <PageHero
        title={<>
          <span className="text-gradient-brand">AI</span> Preferences
        </>}
        subtitle={<>Choose which AI providers appear in your prompt rewriter dropdown.</>}
        minHeightClass="min-h-[28svh]"
      >
        <Button asChild variant="outline">
          <Link to="/account">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Account
          </Link>
        </Button>
      </PageHero>

      <main className="container py-8">
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
              <BreadcrumbLink asChild>
                <Link to="/account">Account</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>AI Preferences</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="max-w-2xl">
          <AIPreferencesSelector />
        </div>
      </main>
    </>
  );
};

export default AIPreferencesPage;