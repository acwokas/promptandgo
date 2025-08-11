-- Add is_pro flag to prompts
ALTER TABLE public.prompts ADD COLUMN IF NOT EXISTS is_pro boolean NOT NULL DEFAULT false;

-- Index for filtering
CREATE INDEX IF NOT EXISTS idx_prompts_is_pro ON public.prompts(is_pro);
