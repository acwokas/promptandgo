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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    const { type, prompt, context, userProfile } = await req.json();

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
        userMessage = `Create an AI prompt for: ${prompt}

${context ? `Additional context: ${context}` : ''}`;
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
Current query/interest: ${prompt}
${context ? `Additional context: ${context}` : ''}

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
        userMessage = prompt;
        break;

      default:
        throw new Error('Invalid request type');
    }

    console.log('Making OpenAI API request:', { type, userId, systemPrompt: systemPrompt.substring(0, 100) + '...' });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
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
    return new Response(JSON.stringify({ 
      error: error.message || 'An unexpected error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});