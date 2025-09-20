export interface AIProvider {
  id: string;
  name: string;
  icon: string;
  category: 'text' | 'image';
  description: string;
  rewritePattern: (prompt: string) => string;
}

export const AI_PROVIDERS: AIProvider[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    icon: '🤖',
    category: 'text',
    description: 'OpenAI GPT models',
    rewritePattern: (prompt: string) => {
      // Creative three-paragraph description for writing/content, or clear structured steps for tasks
      const sections = [
        `**Objective**: ${prompt.split('.')[0] || prompt.substring(0, 100)}...`,
        `**Approach**: Break this down into clear, actionable steps with specific examples and practical guidance.`,
        `**Output**: Provide detailed, well-structured content that directly addresses the request with creative flair and practical value.`
      ];
      return sections.join('\n\n');
    }
  },
  {
    id: 'claude',
    name: 'Claude',
    icon: '🧠',
    category: 'text',
    description: 'Anthropic Claude models',
    rewritePattern: (prompt: string) => {
      // Narrative flow, vivid details, and filmic style; concise, elegant paragraphs
      return `Create a response with narrative elegance and vivid detail. The approach should feel cinematic and flow naturally.\n\n${prompt}\n\nDevelop this with rich, descriptive language that paints a clear picture. Structure your response in concise, elegant paragraphs that build upon each other seamlessly.`;
    }
  },
  {
    id: 'gemini',
    name: 'Gemini',
    icon: '✨',
    category: 'text',
    description: 'Google Gemini models',
    rewritePattern: (prompt: string) => {
      // Analytical summary: bullet points for features, followed by concise summary paragraph
      const bulletPoints = [
        '• Core objective and key requirements',
        '• Specific deliverables and format expectations',
        '• Quality standards and success criteria',
        '• Additional considerations and context'
      ];
      return `**Analysis Request**: ${prompt}\n\n**Key Components**:\n${bulletPoints.join('\n')}\n\n**Summary**: Provide a comprehensive analysis addressing each component above with practical insights and actionable recommendations.`;
    }
  },
  {
    id: 'midjourney',
    name: 'MidJourney',
    icon: '🎨',
    category: 'image',
    description: 'MidJourney image generation',
    rewritePattern: (prompt: string) => {
      // Direct, image-oriented command using art tags, ratio, and rendering cues
      const cleanPrompt = prompt.replace(/create|generate|make|design/gi, '').trim();
      return `/imagine ${cleanPrompt}, professional photography, highly detailed, cinematic lighting, vibrant colors, ultra-realistic, 8k resolution --ar 16:9 --v 6`;
    }
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    icon: '🔍',
    category: 'text',
    description: 'DeepSeek models',
    rewritePattern: (prompt: string) => {
      // Fact-driven, logical breakdown; each feature described with rationale
      return `**Analytical Request**: ${prompt}\n\n**Logical Framework**:\n1. **Problem Definition**: Clearly identify the core challenge or objective\n2. **Reasoning Process**: Apply systematic analysis with supporting evidence\n3. **Technical Considerations**: Address implementation details and constraints\n4. **Validation Criteria**: Define measurable success indicators\n\n**Expected Output**: Provide a fact-driven response with logical reasoning supporting each conclusion.`;
    }
  },
  {
    id: 'ideogram',
    name: 'Ideogram',
    icon: '🎭',
    category: 'image',
    description: 'Ideogram AI image creation',
    rewritePattern: (prompt: string) => {
      // Artistic prompt for visual effect; fuse design intent with style cues
      const cleanPrompt = prompt.replace(/create|generate|make|design/gi, '').trim();
      return `${cleanPrompt}, artistic composition, bold visual impact, harmonious color palette, dynamic lighting, expressive mood, creative typography integration, modern aesthetic design`;
    }
  },
  {
    id: 'groq',
    name: 'GroqChat',
    icon: '⚡',
    category: 'text',
    description: 'Groq fast inference',
    rewritePattern: (prompt: string) => {
      // Ultra-concise, direct request; list 2-3 core features with clear language
      const coreFeatures = [
        'Primary objective',
        'Key deliverable',
        'Success criteria'
      ];
      return `**Direct Request**: ${prompt}\n\n**Core Requirements**:\n${coreFeatures.map((f, i) => `${i + 1}. ${f}`).join('\n')}\n\nProvide a concise, direct response focusing on these core elements.`;
    }
  },
  {
    id: 'mistral',
    name: 'Mistral',
    icon: '🌪️',
    category: 'text',
    description: 'Mistral AI models',
    rewritePattern: (prompt: string) => {
      // Stepwise logical sequence with each step's reasoning explained
      return `**Request**: ${prompt}\n\n**Logical Sequence**:\n\n**Step 1**: Initial analysis and understanding\n*Reasoning*: Establish clear comprehension of the request and its context\n\n**Step 2**: Strategic approach development\n*Reasoning*: Design a methodical approach based on best practices\n\n**Step 3**: Implementation and execution\n*Reasoning*: Apply the strategy with attention to detail and quality\n\n**Step 4**: Validation and refinement\n*Reasoning*: Ensure the output meets all specified requirements\n\nProvide a response following this logical progression.`;
    }
  },
  {
    id: 'llama',
    name: 'Llama-3',
    icon: '🦙',
    category: 'text',
    description: 'Meta Llama models',
    rewritePattern: (prompt: string) => {
      // Multi-role segment (system/user/assistant), clearly organized, with expert "voice"
      return `**System**: You are an expert assistant with specialized knowledge. Respond with authority and precision.\n\n**User**: ${prompt}\n\n**Assistant Instructions**: Provide a comprehensive response demonstrating deep expertise. Structure your answer with:\n- Expert analysis of the request\n- Professional recommendations\n- Practical implementation guidance\n- Quality assurance considerations\n\nMaintain an authoritative yet accessible tone throughout.`;
    }
  },
  {
    id: 'zenochat',
    name: 'ZenoChat',
    icon: '🚀',
    category: 'text',
    description: 'ZenoChat AI assistant',
    rewritePattern: (prompt: string) => {
      // Idea or feature expansion in bullets, each with one-sentence practical use/benefit
      return `**Request**: ${prompt}\n\n**Feature Expansion**:\n• **Core Functionality** - Primary capability that directly addresses the main objective\n• **Enhanced Features** - Additional elements that improve user experience and outcomes\n• **Practical Applications** - Real-world use cases that demonstrate immediate value\n• **Implementation Benefits** - Specific advantages and positive impacts for users\n• **Future Potential** - Scalability and long-term value proposition\n\nDevelop each point with practical insights and actionable recommendations.`;
    }
  }
];

export const rewritePromptForProvider = (originalPrompt: string, providerId: string): string => {
  const provider = AI_PROVIDERS.find(p => p.id === providerId);
  if (!provider) {
    return originalPrompt;
  }
  
  return provider.rewritePattern(originalPrompt);
};

export const getProvidersByCategory = (category: 'text' | 'image' | 'all' = 'all') => {
  if (category === 'all') return AI_PROVIDERS;
  return AI_PROVIDERS.filter(p => p.category === category);
};