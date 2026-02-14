import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, aiTool, goal, focusAreas } = await req.json();

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (prompt.length > 10000) {
      return new Response(JSON.stringify({ error: 'Prompt exceeds maximum length' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const focusInstruction = focusAreas?.length
      ? `Prioritize these optimization areas: ${focusAreas.join(', ')}`
      : 'Optimize all aspects equally.';

    const toolInstruction = aiTool ? `Optimize specifically for ${aiTool}.` : '';
    const goalInstruction = goal ? `The user's goal is: ${goal}. Focus on achieving this.` : '';

    const systemPrompt = `You are a prompt engineering expert. Analyze the prompt provided and optimize it for better AI results.

Generate your response in this exact markdown structure:

## OPTIMIZED PROMPT

{The improved version of their prompt - ready to copy and use}

## KEY IMPROVEMENTS

{Bulleted list of 3-5 specific changes made and why each matters}

## EXPLANATION

{2-3 paragraphs explaining:
- What was unclear or missing in the original
- How the optimized version will get better results
- What prompt engineering principles were applied}

## OPTIONAL ENHANCEMENTS

{2-3 suggestions for further refinement depending on their use case}

Optimization principles to apply:
1. CLARITY: Remove ambiguity, make instructions explicit
2. SPECIFICITY: Add helpful constraints (length, format, tone, audience)
3. STRUCTURE: Use clear sections, numbered steps, or formatting
4. CONTEXT: Include relevant background information
5. OUTPUT FORMAT: Specify exactly how the response should be structured
6. EXAMPLES: Add examples when helpful (few-shot prompting)
7. ROLE/PERSONA: Define the AI's role when beneficial
8. CONSTRAINTS: Add guardrails (what NOT to do)

${toolInstruction}
${goalInstruction}
${focusInstruction}

Make the optimized prompt copy-ready. Don't just describe improvements - actually rewrite it.
Tone: Helpful, educational, specific. Explain WHY changes improve results.`;

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
          { role: 'user', content: `Optimize this prompt:\n\n${prompt.trim()}` },
        ],
        max_tokens: 2000,
        temperature: 0.7,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      return new Response(JSON.stringify({ error: 'AI optimization failed' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });
  } catch (error) {
    console.error('optimize-prompt error:', error);
    return new Response(JSON.stringify({ error: 'An unexpected error occurred' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
