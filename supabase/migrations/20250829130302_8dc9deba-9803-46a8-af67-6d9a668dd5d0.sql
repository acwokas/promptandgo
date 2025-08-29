-- Add manual percentage override fields to poll_options
ALTER TABLE public.poll_options 
ADD COLUMN manual_percentage numeric DEFAULT NULL,
ADD COLUMN use_manual_percentage boolean DEFAULT false;

-- Create updated function to get poll results with manual percentage support
CREATE OR REPLACE FUNCTION public.get_poll_results_with_manual(poll_id_param uuid)
RETURNS TABLE(option_id uuid, option_text text, option_icon text, vote_count bigint, percentage numeric, is_manual boolean)
LANGUAGE sql
STABLE
AS $function$
  WITH vote_counts AS (
    SELECT 
      po.id as option_id,
      po.text as option_text,
      po.icon as option_icon,
      po.manual_percentage,
      po.use_manual_percentage,
      COALESCE(COUNT(pv.id), 0) as vote_count
    FROM public.poll_options po
    LEFT JOIN public.poll_votes pv ON po.id = pv.option_id
    WHERE po.poll_id = poll_id_param
    GROUP BY po.id, po.text, po.icon, po.order_index, po.manual_percentage, po.use_manual_percentage
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
      WHEN vc.use_manual_percentage = true AND vc.manual_percentage IS NOT NULL THEN 
        vc.manual_percentage
      WHEN tv.total = 0 THEN 0
      ELSE ROUND((vc.vote_count::NUMERIC / tv.total::NUMERIC) * 100, 1)
    END as percentage,
    COALESCE(vc.use_manual_percentage, false) as is_manual
  FROM vote_counts vc
  CROSS JOIN total_votes tv
  ORDER BY 
    CASE 
      WHEN vc.use_manual_percentage = true AND vc.manual_percentage IS NOT NULL THEN 
        vc.manual_percentage
      WHEN tv.total = 0 THEN 0
      ELSE ROUND((vc.vote_count::NUMERIC / tv.total::NUMERIC) * 100, 1)
    END DESC, 
    vc.option_text;
$function$