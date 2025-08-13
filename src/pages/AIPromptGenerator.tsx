import SEO from "@/components/SEO";
import AIPromptGenerator from "@/components/ai/AIPromptGenerator";

const AIPromptGeneratorPage = () => {
  return (
    <>
      <SEO 
        title="AI Prompt Generator - Create Perfect Prompts"
        description="Generate custom AI prompts tailored to your needs. Describe what you want and get professionally crafted prompts for ChatGPT, Claude, and Gemini."
      />
      <AIPromptGenerator />
    </>
  );
};

export default AIPromptGeneratorPage;