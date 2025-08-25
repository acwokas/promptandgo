import SEO from "@/components/SEO";
import AIPromptGenerator from "@/components/ai/AIPromptGenerator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";

const AIPromptGeneratorPage = () => {
  return (
    <>
      <SEO 
        title="Scout AI Prompt Generator - Create Perfect Prompts"
        description="Let Scout generate custom AI prompts tailored to your needs. Describe what you want and get professionally crafted prompts for ChatGPT, Claude, and Gemini."
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
                <Link to="/scout">Interactive</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Scout Prompt Generator</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <AIPromptGenerator />
    </>
  );
};

export default AIPromptGeneratorPage;