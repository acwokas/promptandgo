-- Add manual vote count fields to poll_options table
ALTER TABLE public.poll_options 
ADD COLUMN manual_vote_count integer DEFAULT NULL,
ADD COLUMN use_manual_vote_count boolean DEFAULT false;

-- Update the get_poll_results_with_manual function to handle manual vote counts
CREATE OR REPLACE FUNCTION public.get_poll_results_with_manual(poll_id_param uuid)
RETURNS TABLE(option_id uuid, option_text text, option_icon text, vote_count bigint, percentage numeric, is_manual boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  WITH vote_counts AS (
    SELECT 
      po.id as option_id,
      po.text as option_text,
      po.icon as option_icon,
      po.manual_percentage,
      po.use_manual_percentage,
      po.manual_vote_count,
      po.use_manual_vote_count,
      CASE 
        WHEN po.use_manual_vote_count = true AND po.manual_vote_count IS NOT NULL THEN 
          po.manual_vote_count::bigint
        ELSE 
          COALESCE(COUNT(pv.id), 0)
      END as vote_count,
      po.order_index
    FROM public.poll_options po
    LEFT JOIN public.poll_votes pv ON po.id = pv.option_id
    WHERE po.poll_id = poll_id_param
    GROUP BY po.id, po.text, po.icon, po.order_index, po.manual_percentage, po.use_manual_percentage, po.manual_vote_count, po.use_manual_vote_count
    ORDER BY po.order_index
  ),
  total_votes AS (
    SELECT SUM(vote_counts.vote_count) as total FROM vote_counts
  )
  SELECT 
    vote_counts.option_id,
    vote_counts.option_text,
    vote_counts.option_icon,
    vote_counts.vote_count,
    CASE 
      WHEN vote_counts.use_manual_percentage = true AND vote_counts.manual_percentage IS NOT NULL THEN 
        vote_counts.manual_percentage
      WHEN total_votes.total = 0 THEN 0::numeric
      ELSE ROUND((vote_counts.vote_count::NUMERIC / total_votes.total::NUMERIC) * 100, 1)
    END as percentage,
    COALESCE(vote_counts.use_manual_percentage OR vote_counts.use_manual_vote_count, false) as is_manual
  FROM vote_counts
  CROSS JOIN total_votes
  ORDER BY 
    CASE 
      WHEN vote_counts.use_manual_percentage = true AND vote_counts.manual_percentage IS NOT NULL THEN 
        vote_counts.manual_percentage
      WHEN total_votes.total = 0 THEN 0::numeric
      ELSE ROUND((vote_counts.vote_count::NUMERIC / total_votes.total::NUMERIC) * 100, 1)
    END DESC, 
    vote_counts.option_text;
END;
$$;