-- Create polls system tables
CREATE TABLE public.polls (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  intro_copy TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_pages TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.poll_options (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  icon TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.poll_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
  option_id UUID NOT NULL REFERENCES public.poll_options(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(poll_id, user_id),
  UNIQUE(poll_id, ip_address)
);

-- Enable RLS
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;

-- Policies for polls
CREATE POLICY "Public can view active polls" ON public.polls
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage polls" ON public.polls
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Policies for poll_options
CREATE POLICY "Public can view poll options" ON public.poll_options
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.polls 
    WHERE polls.id = poll_options.poll_id 
    AND polls.is_active = true
  )
);

CREATE POLICY "Admins can manage poll options" ON public.poll_options
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Policies for poll_votes
CREATE POLICY "Users can view poll votes" ON public.poll_votes
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.polls 
    WHERE polls.id = poll_votes.poll_id 
    AND polls.is_active = true
  )
);

CREATE POLICY "Users can vote on polls" ON public.poll_votes
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.polls 
    WHERE polls.id = poll_votes.poll_id 
    AND polls.is_active = true
  )
);

CREATE POLICY "Admins can manage poll votes" ON public.poll_votes
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create function to get poll results
CREATE OR REPLACE FUNCTION public.get_poll_results(poll_id_param UUID)
RETURNS TABLE(
  option_id UUID,
  option_text TEXT,
  option_icon TEXT,
  vote_count BIGINT,
  percentage NUMERIC
) LANGUAGE SQL STABLE AS $$
  WITH vote_counts AS (
    SELECT 
      po.id as option_id,
      po.text as option_text,
      po.icon as option_icon,
      COALESCE(COUNT(pv.id), 0) as vote_count
    FROM public.poll_options po
    LEFT JOIN public.poll_votes pv ON po.id = pv.option_id
    WHERE po.poll_id = poll_id_param
    GROUP BY po.id, po.text, po.icon, po.order_index
    ORDER BY po.order_index
  ),
  total_votes AS (
    SELECT SUM(vote_count) as total FROM vote_counts
  )
  SELECT 
    vc.option_id,
    vc.option_text,
    vc.option_icon,
    vc.vote_count,
    CASE 
      WHEN tv.total = 0 THEN 0
      ELSE ROUND((vc.vote_count::NUMERIC / tv.total::NUMERIC) * 100, 1)
    END as percentage
  FROM vote_counts vc
  CROSS JOIN total_votes tv
  ORDER BY vc.vote_count DESC, vc.option_text;
$$;

-- Create trigger for updated_at
CREATE TRIGGER update_polls_updated_at
  BEFORE UPDATE ON public.polls
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert the first poll based on the template
INSERT INTO public.polls (title, intro_copy, display_pages) VALUES (
  'Local Language Prompts',
  'We''ve started experimenting with local language prompts, help us choose what comes next!
👉 Vote for your favourite slang or language below.
💬 Got another idea? Drop it in the comments and we might add it!',
  ARRAY['all']
);

-- Get the poll ID and insert options
DO $$
DECLARE
  poll_uuid UUID;
BEGIN
  SELECT id INTO poll_uuid FROM public.polls WHERE title = 'Local Language Prompts';
  
  INSERT INTO public.poll_options (poll_id, text, icon, order_index) VALUES
  (poll_uuid, 'Singlish', '🇸🇬', 1),
  (poll_uuid, 'Tagalog', '🇵🇭', 2),
  (poll_uuid, 'Spanish', '🇪🇸', 3),
  (poll_uuid, 'Bahasa Indonesia', '🇮🇩', 4),
  (poll_uuid, 'Hindi', '🇮🇳', 5);
END$$;