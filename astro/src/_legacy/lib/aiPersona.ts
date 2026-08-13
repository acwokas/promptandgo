// Scout AI Persona - Consistent branding across all AI tools
export const AI_PERSONA = {
  name: "Scout",
  tagline: "Your AI Prompt Explorer",
  description: "Scout is your friendly AI companion who helps you discover and create the perfect prompts for any task.",
  
  // Greetings and messages
  greetings: {
    assistant: "Hi! I'm Scout, your AI prompt explorer. I'm here to help you find the perfect prompts, provide prompt engineering tips, and guide you to better AI results. What would you like to explore today?",
    generator: "Created by Scout",
    generatingMessage: "Scout is crafting your prompt...",
    successMessage: "Scout has created your perfect prompt!"
  },
  
  // Quick actions for the assistant
  quickActions: [
    { label: "Find prompts for marketing", icon: "Search" },
    { label: "How to write better prompts?", icon: "Lightbulb" },
    { label: "Best prompts for writing", icon: "Search" },
    { label: "Prompt engineering tips", icon: "Lightbulb" },
  ],
  
  // UI text
  ui: {
    assistantTitle: "Chat with Scout",
    assistantSubtitle: "Get personalised help finding and creating the perfect prompts",
    generatorTitle: "Scout AI Prompt Generator",
    generatorSubtitle: "Let Scout create custom AI prompts tailored to your needs. Scout understands what makes prompts effective for ChatGPT, Claude, Gemini, and more.",
    upsellTitle: "Need Help Getting Started?",
    upsellDescription: "Not sure what to create? Chat with Scout for personalised recommendations and expert guidance.",
    upsellButton: "Chat with Scout",
    generateButton: "Ask Scout to Generate",
    generatingButton: "Scout is Working...",
    placeholderText: "Tell Scout what you want the AI to do...",
    contextPlaceholder: "Any additional context for Scout..."
  }
} as const;