-- Fix 1: Add encryption enforcement triggers on subscribers table
CREATE TRIGGER enforce_subscriber_encryption_insert
  BEFORE INSERT ON public.subscribers
  FOR EACH ROW
  EXECUTE FUNCTION enforce_subscriber_encryption();

CREATE TRIGGER enforce_subscriber_encryption_update
  BEFORE UPDATE ON public.subscribers
  FOR EACH ROW
  EXECUTE FUNCTION enforce_subscriber_encryption();

-- Fix 2: Lock down newsletter_rate_limits RLS to service-role only
DROP POLICY IF EXISTS "rate_limits_service_role_only" ON public.newsletter_rate_limits;

CREATE POLICY "newsletter_rate_limits_service_role_only"
  ON public.newsletter_rate_limits
  FOR ALL
  USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text)
  WITH CHECK ((auth.jwt() ->> 'role'::text) = 'service_role'::text);

-- Fix 3: Create minimal RPC for newsletter status (avoiding direct subscribers access)
CREATE OR REPLACE FUNCTION get_user_newsletter_status()
RETURNS TABLE(newsletter_subscribed boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT CASE WHEN email_hash IS NOT NULL THEN true ELSE false END as newsletter_subscribed
  FROM subscribers
  WHERE user_id = auth.uid();
END;
$$;