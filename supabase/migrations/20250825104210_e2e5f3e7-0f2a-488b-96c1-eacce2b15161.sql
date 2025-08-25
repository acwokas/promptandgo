-- Comprehensive security cleanup: Fix all remaining RLS policy issues

-- 1. Fix pending_contacts table - make sure it has proper SELECT restrictions
DROP POLICY IF EXISTS "Only allow anonymous contact submissions with validation" ON public.pending_contacts;
DROP POLICY IF EXISTS "Admin users can view all pending contacts" ON public.pending_contacts;
DROP POLICY IF EXISTS "Admin users can update pending contacts" ON public.pending_contacts;

-- Add secure contact policies
CREATE POLICY "Allow validated contact submissions" 
ON public.pending_contacts 
FOR INSERT 
WITH CHECK (
  name IS NOT NULL AND 
  email IS NOT NULL AND 
  message IS NOT NULL AND 
  length(trim(name)) >= 2 AND 
  length(trim(email)) >= 5 AND 
  length(trim(message)) >= 10 AND
  email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
);

CREATE POLICY "Admin only can view contacts" 
ON public.pending_contacts 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin only can update contacts" 
ON public.pending_contacts 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. Clean up subscribers table policies completely
DROP POLICY IF EXISTS "Service role can manage subscriptions" ON public.subscribers;
DROP POLICY IF EXISTS "Users can view only their own subscription" ON public.subscribers;

-- Add single comprehensive policy for subscribers
CREATE POLICY "Secure subscription access" 
ON public.subscribers 
FOR ALL 
USING (
  -- Service role can do everything
  (auth.jwt() ->> 'role'::text) = 'service_role'::text OR
  -- Users can only view their own data
  (auth.uid() = user_id AND auth.uid() IS NOT NULL)
)
WITH CHECK (
  -- Only service role can insert/update
  (auth.jwt() ->> 'role'::text) = 'service_role'::text
);

-- 3. Clean up orders table policies
DROP POLICY IF EXISTS "select_own_orders" ON public.orders;
-- Keep the existing "Users can view their own orders" policy as it's properly scoped

-- 4. Make sure all sensitive tables have proper RLS enabled
ALTER TABLE public.pending_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;