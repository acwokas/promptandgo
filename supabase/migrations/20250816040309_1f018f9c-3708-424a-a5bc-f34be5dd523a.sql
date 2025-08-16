-- Revoke public execute permissions on sensitive RPC functions
REVOKE EXECUTE ON FUNCTION public.check_and_increment_usage(uuid, text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_user_ai_limits(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_subscriber_info(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.secure_upsert_subscriber(text, uuid, text, text, boolean, text, timestamp with time zone) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.increment_link_clicks(text) FROM PUBLIC;

-- Grant execute permissions only to authenticated users for safe functions
GRANT EXECUTE ON FUNCTION public.check_and_increment_usage(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_ai_limits(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_subscriber_info(uuid) TO authenticated;

-- Keep increment_link_clicks accessible to service_role only (for share redirect)
GRANT EXECUTE ON FUNCTION public.increment_link_clicks(text) TO service_role;

-- secure_upsert_subscriber should only be callable by service_role (used in edge functions)
GRANT EXECUTE ON FUNCTION public.secure_upsert_subscriber(text, uuid, text, text, boolean, text, timestamp with time zone) TO service_role;