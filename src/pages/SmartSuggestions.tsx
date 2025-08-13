import SEO from "@/components/SEO";
import SmartSuggestions from "@/components/ai/SmartSuggestions";

const SmartSuggestionsPage = () => {
  return (
    <>
      <SEO 
        title="Smart AI Suggestions - Personalized Prompt Recommendations"
        description="Get AI-powered prompt recommendations tailored to your industry, goals, and context. Discover the perfect prompts for your specific needs."
      />
      <SmartSuggestions />
    </>
  );
};

export default SmartSuggestionsPage;