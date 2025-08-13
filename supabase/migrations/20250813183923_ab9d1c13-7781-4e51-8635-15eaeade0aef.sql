-- Create a category for user-generated prompts
INSERT INTO categories (id, name, slug, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'User Generated',
  'user-generated',
  now(),
  now()
) ON CONFLICT (slug) DO NOTHING;

-- Create a table to store user-generated prompts with better structure
CREATE TABLE IF NOT EXISTS public.user_generated_prompts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  prompt TEXT NOT NULL,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_generated_prompts ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own generated prompts" 
ON public.user_generated_prompts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own generated prompts" 
ON public.user_generated_prompts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own generated prompts" 
ON public.user_generated_prompts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own generated prompts" 
ON public.user_generated_prompts 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_generated_prompts_updated_at
BEFORE UPDATE ON public.user_generated_prompts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();