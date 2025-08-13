import SEO from "@/components/SEO";
import AIAssistant from "@/components/ai/AIAssistant";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";

const AIAssistantPage = () => {
  return (
    <>
      <SEO 
        title="AI Assistant - Get Help with Prompts and AI"
        description="Chat with our AI assistant to find the perfect prompts, get prompt engineering tips, and improve your AI interactions."
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
              <BreadcrumbPage>AI Assistant</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <AIAssistant />
    </>
  );
};

export default AIAssistantPage;