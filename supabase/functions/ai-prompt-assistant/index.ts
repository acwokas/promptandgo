import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation functions
const validatePromptInput = (input: string): { isValid: boolean; error?: string } => {
  if (!input || typeof input !== 'string') {
    return { isValid: false, error: 'Input is required' };
  }
  
  if (input.length > 5000) {
    return { isValid: false, error: 'Input exceeds maximum length of 5000 characters' };
  }
  
  // Check for potential prompt injection attempts
  const suspiciousPatterns = [
    /ignore\s+previous\s+instructions/i,
    /system\s*:\s*you\s+are/i,
    /forget\s+everything/i,
    /new\s+instructions/i,
    /admin\s+mode/i,
    /<script/i,
    /javascript:/i,
  ];
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(input)) {
      return { isValid: false, error: 'Input contains potentially harmful content' };
    }
  }
  
  return { isValid: true };
};

const sanitizeInput = (input: string): string => {
  return input.trim().replace(/\s+/g, ' ');
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    const { type, prompt, context, userProfile } = await req.json();

    // Validate and sanitize inputs
    if (prompt) {
      const promptValidation = validatePromptInput(prompt);
      if (!promptValidation.isValid) {
        return new Response(
          JSON.stringify({ error: promptValidation.error }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }
    }

    if (context) {
      const contextValidation = validatePromptInput(context);
      if (!contextValidation.isValid) {
        return new Response(
          JSON.stringify({ error: 'Context ' + contextValidation.error?.toLowerCase() }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }
    }

    // Sanitize inputs
    const sanitizedPrompt = prompt ? sanitizeInput(prompt) : '';
    const sanitizedContext = context ? sanitizeInput(context) : '';

    // Extract user ID from auth header if present
    let userId = null;
    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (!error && user) {
          userId = user.id;
        }
      } catch (e) {
        console.log('Failed to get user from token:', e);
      }
    }

    // Check usage limits for authenticated users
    if (userId) {
      const usageTypeMap = {
        'generate_prompt': 'generator',
        'smart_suggestions': 'suggestions',
        'assistant': 'assistant'
      };
      
      const usageType = usageTypeMap[type as keyof typeof usageTypeMap];
      if (usageType) {
        const { data: usageResult, error: usageError } = await supabase
          .rpc('check_and_increment_usage', {
            user_id_param: userId,
            usage_type_param: usageType
          });

        if (usageError) {
          console.error('Usage check error:', usageError);
          throw new Error('Failed to check usage limits');
        }

        const usageData = usageResult?.[0];
        if (!usageData?.allowed) {
          return new Response(JSON.stringify({
            error: 'Daily limit exceeded',
            usageExceeded: true,
            currentUsage: usageData?.current_usage || 0,
            dailyLimit: usageData?.daily_limit || 0,
            remaining: usageData?.remaining || 0,
            usageType: usageType
          }), {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }
    }

    let systemPrompt = '';
    let userMessage = '';

    switch (type) {
      case 'generate_prompt':
        systemPrompt = `You are an expert AI prompt engineer. Your job is to create high-quality, effective prompts based on user requirements. 

Guidelines:
- Create clear, specific, and actionable prompts
- Include relevant context and constraints
- Use proven prompt engineering techniques
- Make prompts that work well with ChatGPT, Claude, and Gemini
- Keep prompts concise but comprehensive
- Include example formats when helpful

Return only the generated prompt, no explanations or additional text.`;
        userMessage = `Create an AI prompt for: ${sanitizedPrompt}

${sanitizedContext ? `Additional context: ${sanitizedContext}` : ''}`;
        break;

      case 'smart_suggestions':
        systemPrompt = `You are an AI assistant that provides intelligent prompt recommendations. Based on user context and needs, suggest 3-5 relevant prompts from their library or recommend new ones.

Return a JSON array of suggestions with this structure:
[
  {
    "title": "Prompt Title",
    "reason": "Why this prompt fits their needs",
    "confidence": 0.9,
    "category": "relevant category"
  }
]`;
        userMessage = `User context: ${JSON.stringify(userProfile)}
Current query/interest: ${sanitizedPrompt}
${sanitizedContext ? `Additional context: ${sanitizedContext}` : ''}

Provide smart prompt suggestions.`;
        break;

      case 'assistant':
        systemPrompt = `You are a helpful AI assistant for a prompt library called PromptAndGo. You help users find the perfect prompts for their needs, provide guidance on prompt engineering, and offer suggestions for better AI interactions.

You should:
- Be friendly and helpful
- Ask clarifying questions when needed
- Suggest relevant prompts from their library
- Provide prompt engineering tips
- Help users refine their requirements

Keep responses concise and actionable.`;
        userMessage = sanitizedPrompt;
        break;

      default:
        throw new Error('Invalid request type');
    }

    console.log('Making OpenAI API request:', { type, userId, systemPrompt: systemPrompt.substring(0, 100) + '...' });

    // Choose model based on complexity - optimize for cost efficiency
    let model;
    let requestBody: any = {
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ]
    };

    if (type === 'generate_prompt') {
      // More complex prompt generation - use reliable model
      model = 'gpt-4o-mini';
      requestBody.model = model;
      requestBody.max_tokens = 1000; // Legacy model uses max_tokens
      requestBody.temperature = 0.7;
    } else {
      // Simple suggestions and assistant - use same reliable model 
      model = 'gpt-4o-mini';  
      requestBody.model = model;
      requestBody.max_tokens = 800;
      requestBody.temperature = 0.7;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', response.status, errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const result = data.choices[0].message.content;

    console.log('OpenAI API success, response length:', result.length);

    // For smart_suggestions, try to parse as JSON
    if (type === 'smart_suggestions') {
      try {
        const suggestions = JSON.parse(result);
        return new Response(JSON.stringify({ result: suggestions }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (e) {
        console.log('Failed to parse suggestions as JSON, returning as text');
      }
    }

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-prompt-assistant function:', error);
    // Don't expose internal error details to clients
    const isClientError = error.message?.includes('Input') || error.message?.includes('Context');
    return new Response(JSON.stringify({ 
      error: isClientError ? error.message : 'An unexpected error occurred'
    }), {
      status: isClientError ? 400 : 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});