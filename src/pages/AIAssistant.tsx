import SEO from "@/components/SEO";
import AIAssistant from "@/components/ai/AIAssistant";

const AIAssistantPage = () => {
  return (
    <>
      <SEO 
        title="AI Assistant - Get Help with Prompts and AI"
        description="Chat with our AI assistant to find the perfect prompts, get prompt engineering tips, and improve your AI interactions."
      />
      <AIAssistant />
    </>
  );
};

export default AIAssistantPage;