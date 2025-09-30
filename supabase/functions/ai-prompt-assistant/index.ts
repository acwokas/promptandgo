import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

const supabaseService = createClient(supabaseUrl, supabaseServiceKey);
const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);

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
    let userSupabase = supabaseAnon;
    
    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '');
        // Create a supabase client with the user's token
        userSupabase = createClient(supabaseUrl, supabaseAnonKey, {
          global: {
            headers: {
              Authorization: authHeader,
            },
          },
        });
        
        const { data: { user }, error } = await userSupabase.auth.getUser();
        if (!error && user) {
          userId = user.id;
          console.log('Successfully authenticated user:', userId);
        } else {
          console.log('Failed to get user:', error);
        }
      } catch (e) {
        console.log('Failed to get user from token:', e);
      }
    }

    // Check usage limits for authenticated users
    if (userId && authHeader) {
      const usageTypeMap = {
        'generate_prompt': 'generator',
        'smart_suggestions': 'suggestions',
        'assistant': 'assistant'
      };
      
      const usageType = usageTypeMap[type as keyof typeof usageTypeMap];
      if (usageType) {
        console.log('Checking usage for user:', userId, 'type:', usageType);
        
        const { data: usageResult, error: usageError } = await userSupabase
          .rpc('check_and_increment_usage', {
            user_id_param: userId,
            usage_type_param: usageType
          });

        if (usageError) {
          console.error('Usage check error:', usageError);
          throw new Error('Failed to check usage limits');
        }

        console.log('Usage check result:', usageResult);
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
        systemPrompt = `You are Scout, a friendly AI prompt explorer for PromptAndGo. Your primary goal is to help users find and create the perfect prompts for their needs.

About Scout:
- You're an expert in prompt engineering and AI interactions
- You're friendly, helpful, and always focused on providing value
- You help users discover prompts, create new ones, and improve their AI skills
- You have deep knowledge of what makes prompts effective

Key guidelines:
- If someone asks for a prompt, CREATE ONE based on the information they've provided
- Only ask 1-2 clarifying questions maximum, then provide a prompt or guidance
- Look at conversation history to avoid repeating questions
- Be decisive - make reasonable assumptions rather than asking endless questions
- Provide specific, actionable prompts users can copy and use
- Share prompt engineering tips when helpful
- Help users discover relevant prompts from the PromptAndGo library

Context from conversation: ${sanitizedContext || 'No previous context'}`;
        userMessage = `User request: ${sanitizedPrompt}

Based on our conversation history above, provide specific help. If they need a prompt, create one rather than asking more questions. If you need to make assumptions, state them briefly then provide the solution.`;
        break;

      default:
        throw new Error('Invalid request type');
    }

    console.log('Making OpenAI API request:', { type, userId, systemPrompt: systemPrompt.substring(0, 100) + '...' });

    // Use gpt-4o-mini for all requests - reliable and cost-effective
    const requestBody = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      max_tokens: type === 'generate_prompt' ? 1000 : 800,
      temperature: 0.7
    };

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
      
      // Handle rate limits specifically
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      }
      
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
    const isClientError = (error as Error).message?.includes('Input') || (error as Error).message?.includes('Context');
    return new Response(JSON.stringify({ 
      error: isClientError ? (error as Error).message : 'An unexpected error occurred'
    }), {
      status: isClientError ? 400 : 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});