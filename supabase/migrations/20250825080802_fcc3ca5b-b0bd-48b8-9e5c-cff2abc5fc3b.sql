-- Fix security issues identified in the scan

-- 1. Ensure pending_contacts has bulletproof RLS policies
-- Drop and recreate policies to ensure they're correctly configured
DROP POLICY IF EXISTS "Admins can view all contacts" ON public.pending_contacts;
DROP POLICY IF EXISTS "Allow public insert of contacts" ON public.pending_contacts;
DROP POLICY IF EXISTS "Admins can update contacts" ON public.pending_contacts;

-- Recreate with explicit, secure policies
CREATE POLICY "Admin users can view all pending contacts" 
ON public.pending_contacts 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'::app_role));

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

CREATE POLICY "Admin users can update pending contacts" 
ON public.pending_contacts 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 2. Fix ai_usage table - add missing INSERT/UPDATE policies
CREATE POLICY "Users can only insert their own usage records" 
ON public.ai_usage 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own usage records" 
ON public.ai_usage 
FOR UPDATE 
USING (auth.uid() = user_id);

-- 3. Fix orders table - add comprehensive RLS policies
CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Service role can insert orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (
  -- Only service role (from Stripe webhooks) can create orders
  (auth.jwt() ->> 'role')::text = 'service_role'
);

CREATE POLICY "Service role can update orders" 
ON public.orders 
FOR UPDATE 
USING (
  -- Only service role (from Stripe webhooks) can update orders
  (auth.jwt() ->> 'role')::text = 'service_role'
);

-- 4. Ensure order_items follows the same pattern
CREATE POLICY "Service role can insert order items" 
ON public.order_items 
FOR INSERT 
WITH CHECK (
  -- Only service role can create order items
  (auth.jwt() ->> 'role')::text = 'service_role'
);

CREATE POLICY "Service role can update order items" 
ON public.order_items 
FOR UPDATE 
USING (
  -- Only service role can update order items
  (auth.jwt() ->> 'role')::text = 'service_role'
);