-- Final security fix: Remove unnecessary public select policy
-- The edge function uses service role key and doesn't need public RLS policies

-- Drop the overly permissive select policy
DROP POLICY IF EXISTS "Allow select for confirmation flow" ON public.pending_contacts;

-- The confirm-contact edge function uses service role key, so no public select needed
-- Only keep admin access and public insert

-- Update the update policy to be more restrictive (though service role bypasses this)
DROP POLICY IF EXISTS "Allow update by own confirmation token" ON public.pending_contacts;

-- Create a more restrictive update policy (admins only, since service role bypasses RLS)
CREATE POLICY "Allow admin update of contacts" 
ON public.pending_contacts 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));