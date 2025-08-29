-- Complete rewrite of get_poll_results_with_manual function to fix ambiguity
CREATE OR REPLACE FUNCTION public.get_poll_results_with_manual(poll_id_param uuid)
RETURNS TABLE(option_id uuid, option_text text, option_icon text, vote_count bigint, percentage numeric, is_manual boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    total_count INTEGER := 0;
BEGIN
    -- Get total vote count first
    SELECT COALESCE(SUM(sub.count), 0) INTO total_count
    FROM (
        SELECT COUNT(pv.id) as count
        FROM public.poll_options po
        LEFT JOIN public.poll_votes pv ON po.id = pv.option_id
        WHERE po.poll_id = poll_id_param
        GROUP BY po.id
    ) sub;

    -- Return the results
    RETURN QUERY
    SELECT 
        po.id as option_id,
        po.text as option_text,
        po.icon as option_icon,
        COALESCE(COUNT(pv.id), 0) as vote_count,
        CASE 
            WHEN po.use_manual_percentage = true AND po.manual_percentage IS NOT NULL THEN 
                po.manual_percentage
            WHEN total_count = 0 THEN 0::numeric
            ELSE ROUND((COALESCE(COUNT(pv.id), 0)::NUMERIC / total_count::NUMERIC) * 100, 1)
        END as percentage,
        COALESCE(po.use_manual_percentage, false) as is_manual
    FROM public.poll_options po
    LEFT JOIN public.poll_votes pv ON po.id = pv.option_id
    WHERE po.poll_id = poll_id_param
    GROUP BY po.id, po.text, po.icon, po.order_index, po.manual_percentage, po.use_manual_percentage
    ORDER BY 
        CASE 
            WHEN po.use_manual_percentage = true AND po.manual_percentage IS NOT NULL THEN 
                po.manual_percentage
            WHEN total_count = 0 THEN 0::numeric
            ELSE ROUND((COALESCE(COUNT(pv.id), 0)::NUMERIC / total_count::NUMERIC) * 100, 1)
        END DESC, 
        po.text;
END;
$$;