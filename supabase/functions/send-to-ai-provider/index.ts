import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProviderRequest {
  provider: string;
  prompt: string;
  temperature?: number;
  maxTokens?: number;
}

interface ProviderConfig {
  endpoint: string;
  headers: (apiKey: string) => Record<string, string>;
  formatRequest: (prompt: string, temperature: number, maxTokens: number) => any;
  parseResponse: (data: any) => string;
}

// Provider configurations
const PROVIDERS: Record<string, ProviderConfig> = {
  openai: {
    endpoint: 'https://api.openai.com/v1/chat/completions',
    headers: (apiKey: string) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    }),
    formatRequest: (prompt: string, temperature: number, maxTokens: number) => ({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature,
      max_tokens: maxTokens,
    }),
    parseResponse: (data: any) => data.choices[0]?.message?.content || 'No response received'
  },
  
  anthropic: {
    endpoint: 'https://api.anthropic.com/v1/messages',
    headers: (apiKey: string) => ({
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
    }),
    formatRequest: (prompt: string, temperature: number, maxTokens: number) => ({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: maxTokens,
      temperature,
      messages: [{ role: 'user', content: prompt }],
    }),
    parseResponse: (data: any) => data.content[0]?.text || 'No response received'
  },
  
  google: {
    endpoint: 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent',
    headers: (apiKey: string) => ({
      'Content-Type': 'application/json',
    }),
    formatRequest: (prompt: string, temperature: number, maxTokens: number) => ({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens,
      },
    }),
    parseResponse: (data: any) => data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received'
  },
  
  cohere: {
    endpoint: 'https://api.cohere.ai/v1/generate',
    headers: (apiKey: string) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    }),
    formatRequest: (prompt: string, temperature: number, maxTokens: number) => ({
      model: 'command',
      prompt,
      temperature,
      max_tokens: maxTokens,
    }),
    parseResponse: (data: any) => data.generations?.[0]?.text || 'No response received'
  },
  
  groq: {
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    headers: (apiKey: string) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    }),
    formatRequest: (prompt: string, temperature: number, maxTokens: number) => ({
      model: 'llama3-8b-8192',
      messages: [{ role: 'user', content: prompt }],
      temperature,
      max_tokens: maxTokens,
    }),
    parseResponse: (data: any) => data.choices[0]?.message?.content || 'No response received'
  },
  
  deepseek: {
    endpoint: 'https://api.deepseek.com/v1/chat/completions',
    headers: (apiKey: string) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    }),
    formatRequest: (prompt: string, temperature: number, maxTokens: number) => ({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature,
      max_tokens: maxTokens,
    }),
    parseResponse: (data: any) => data.choices[0]?.message?.content || 'No response received'
  },
  
  meta: {
    endpoint: 'https://api.together.xyz/v1/chat/completions',
    headers: (apiKey: string) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    }),
    formatRequest: (prompt: string, temperature: number, maxTokens: number) => ({
      model: 'meta-llama/Llama-3-8b-chat-hf',
      messages: [{ role: 'user', content: prompt }],
      temperature,
      max_tokens: maxTokens,
    }),
    parseResponse: (data: any) => data.choices[0]?.message?.content || 'No response received'
  },
  
  midjourney: {
    endpoint: 'https://api.useapi.net/v2/jobs/midjourney/imagine',
    headers: (apiKey: string) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    }),
    formatRequest: (prompt: string) => ({
      prompt,
    }),
    parseResponse: (data: any) => data.url || data.result_url || 'Image generation started. Check the provider for results.'
  },
  
  ideogram: {
    endpoint: 'https://api.ideogram.ai/generate',
    headers: (apiKey: string) => ({
      'Api-Key': apiKey,
      'Content-Type': 'application/json',
    }),
    formatRequest: (prompt: string) => ({
      image_request: {
        prompt,
        aspect_ratio: 'ASPECT_1_1',
        model: 'V_2',
        magic_prompt_option: 'AUTO',
      },
    }),
    parseResponse: (data: any) => data.data?.[0]?.url || 'Image generation completed. Check the provider for results.'
  },
};

async function callProvider(provider: string, prompt: string, temperature: number, maxTokens: number): Promise<string> {
  const config = PROVIDERS[provider];
  if (!config) {
    throw new Error(`Unsupported provider: ${provider}`);
  }

  // Get API key from environment
  const apiKeyEnvVar = `${provider.toUpperCase()}_API_KEY`;
  const apiKey = Deno.env.get(apiKeyEnvVar);
  
  if (!apiKey) {
    throw new Error(`API key not configured for ${provider}. Please set ${apiKeyEnvVar} in edge function secrets.`);
  }

  let endpoint = config.endpoint;
  
  // Special case for Google Gemini - append API key to URL
  if (provider === 'google') {
    endpoint += `?key=${apiKey}`;
  }

  const headers = config.headers(apiKey);
  const body = config.formatRequest(prompt, temperature, maxTokens);

  console.log(`Calling ${provider} API:`, { endpoint, body });

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`${provider} API error:`, response.status, errorText);
    throw new Error(`${provider} API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  console.log(`${provider} API response:`, data);
  
  return config.parseResponse(data);
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { provider, prompt, temperature = 0.7, maxTokens = 1000 }: ProviderRequest = await req.json();

    if (!provider || !prompt) {
      return new Response(
        JSON.stringify({ error: 'Provider and prompt are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const response = await callProvider(provider, prompt, temperature, maxTokens);

    return new Response(
      JSON.stringify({ response, provider }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Send to AI Provider error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});