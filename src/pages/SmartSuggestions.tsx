import SEO from "@/components/SEO";
import SmartSuggestions from "@/components/ai/SmartSuggestions";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";

const SmartSuggestionsPage = () => {
  return (
    <>
      <SEO 
        title="Smart Suggestions - AI-Powered Prompt Recommendations"
        description="Get personalized AI prompt suggestions tailored to your preferences, industry, and project needs. Discover the perfect prompts for your use case."
      />
      <div className="container mx-auto px-6 py-6">
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
                <Link to="/toolkit">Interactive</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Smart Suggestions</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <SmartSuggestions />
    </>
  );
};

export default SmartSuggestionsPage;