-- Fix security issues identified in the scan

-- 1. Ensure pending_contacts has bulletproof RLS policies
-- Drop and recreate policies to ensure they're correctly configured
DROP POLICY IF EXISTS "Admins can view all contacts" ON public.pending_contacts;
DROP POLICY IF EXISTS "Allow public insert of contacts" ON public.pending_contacts;
DROP POLICY IF EXISTS "Admins can update contacts" ON public.pending_contacts;

-- Recreate with explicit, secure policies
DROP POLICY IF EXISTS "Admin users can view all pending contacts" ON public.pending_contacts;
DROP POLICY IF EXISTS "Admin users can view all pending contacts" ON public.pending_contacts;
CREATE POLICY "Admin users can view all pending contacts" 
ON public.pending_contacts 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Public can submit contact forms" ON public.pending_contacts;
DROP POLICY IF EXISTS "Public can submit contact forms" ON public.pending_contacts;
CREATE POLICY "Public can submit contact forms" 
ON public.pending_contacts 
FOR INSERT 
WITH CHECK (
  -- Ensure basic validation on insert
  name IS NOT NULL AND 
  email IS NOT NULL AND 
  message IS NOT NULL AND
  length(name) > 0 AND 
  length(email) > 5 AND 
  length(message) > 0
);

DROP POLICY IF EXISTS "Admin users can update pending contacts" ON public.pending_contacts;
DROP POLICY IF EXISTS "Admin users can update pending contacts" ON public.pending_contacts;
CREATE POLICY "Admin users can update pending contacts" 
ON public.pending_contacts 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 2. Fix ai_usage table - add missing INSERT/UPDATE policies
DROP POLICY IF EXISTS "Users can only insert their own usage records" ON public.ai_usage;
DROP POLICY IF EXISTS "Users can only insert their own usage records" ON public.ai_usage;
CREATE POLICY "Users can only insert their own usage records" 
ON public.ai_usage 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can only update their own usage records" ON public.ai_usage;
DROP POLICY IF EXISTS "Users can only update their own usage records" ON public.ai_usage;
CREATE POLICY "Users can only update their own usage records" 
ON public.ai_usage 
FOR UPDATE 
USING (auth.uid() = user_id);

-- 3. Fix orders table - add comprehensive RLS policies
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Service role can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Service role can insert orders" ON public.orders;
CREATE POLICY "Service role can insert orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (
  -- Only service role (from Stripe webhooks) can create orders
  (auth.jwt() ->> 'role')::text = 'service_role'
);

DROP POLICY IF EXISTS "Service role can update orders" ON public.orders;
DROP POLICY IF EXISTS "Service role can update orders" ON public.orders;
CREATE POLICY "Service role can update orders" 
ON public.orders 
FOR UPDATE 
USING (
  -- Only service role (from Stripe webhooks) can update orders
  (auth.jwt() ->> 'role')::text = 'service_role'
);

-- 4. Ensure order_items follows the same pattern
DROP POLICY IF EXISTS "Service role can insert order items" ON public.order_items;
DROP POLICY IF EXISTS "Service role can insert order items" ON public.order_items;
CREATE POLICY "Service role can insert order items" 
ON public.order_items 
FOR INSERT 
WITH CHECK (
  -- Only service role can create order items
  (auth.jwt() ->> 'role')::text = 'service_role'
);

DROP POLICY IF EXISTS "Service role can update order items" ON public.order_items;
DROP POLICY IF EXISTS "Service role can update order items" ON public.order_items;
CREATE POLICY "Service role can update order items" 
ON public.order_items 
FOR UPDATE 
USING (
  -- Only service role can update order items
  (auth.jwt() ->> 'role')::text = 'service_role'
);

-- Explicit Data API privileges (Supabase new-table defaults, 30 October 2026).
-- Per-table rights accompany existing RLS and policies; no default privileges change.
ALTER TABLE public."ai_usage" ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE ON TABLE public."ai_usage" TO authenticated;
DO $grants_sequence$ DECLARE seq text; BEGIN
  FOR seq IN SELECT pg_get_serial_sequence('public."ai_usage"', a.attname)
    FROM pg_attribute a WHERE a.attrelid='public."ai_usage"'::regclass AND a.attnum>0 AND NOT a.attisdropped
  LOOP IF seq IS NOT NULL THEN
    EXECUTE format('GRANT USAGE ON SEQUENCE %s TO authenticated',seq);
  END IF; END LOOP;
END $grants_sequence$;

GRANT SELECT, INSERT, UPDATE ON TABLE public."order_items" TO service_role;
DO $grants_sequence$ DECLARE seq text; BEGIN
  FOR seq IN SELECT pg_get_serial_sequence('public."order_items"', a.attname)
    FROM pg_attribute a WHERE a.attrelid='public."order_items"'::regclass AND a.attnum>0 AND NOT a.attisdropped
  LOOP IF seq IS NOT NULL THEN
    EXECUTE format('GRANT USAGE ON SEQUENCE %s TO service_role',seq);
  END IF; END LOOP;
END $grants_sequence$;

ALTER TABLE public."orders" ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON TABLE public."orders" TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public."orders" TO service_role;
DO $grants_sequence$ DECLARE seq text; BEGIN
  FOR seq IN SELECT pg_get_serial_sequence('public."orders"', a.attname)
    FROM pg_attribute a WHERE a.attrelid='public."orders"'::regclass AND a.attnum>0 AND NOT a.attisdropped
  LOOP IF seq IS NOT NULL THEN
    EXECUTE format('GRANT USAGE ON SEQUENCE %s TO service_role',seq);
  END IF; END LOOP;
END $grants_sequence$;

ALTER TABLE public."pending_contacts" ENABLE ROW LEVEL SECURITY;
GRANT INSERT ON TABLE public."pending_contacts" TO anon;
GRANT SELECT, INSERT, UPDATE ON TABLE public."pending_contacts" TO authenticated;
DO $grants_sequence$ DECLARE seq text; BEGIN
  FOR seq IN SELECT pg_get_serial_sequence('public."pending_contacts"', a.attname)
    FROM pg_attribute a WHERE a.attrelid='public."pending_contacts"'::regclass AND a.attnum>0 AND NOT a.attisdropped
  LOOP IF seq IS NOT NULL THEN
    EXECUTE format('GRANT USAGE ON SEQUENCE %s TO anon, authenticated',seq);
  END IF; END LOOP;
END $grants_sequence$;
