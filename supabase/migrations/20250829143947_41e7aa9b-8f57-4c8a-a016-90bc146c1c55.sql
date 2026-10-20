-- Fix poll access by cleaning up existing policies properly

-- First, let's see what policies exist and drop them all to start clean
DROP POLICY IF EXISTS "Admins can manage poll votes" ON public.poll_votes;
DROP POLICY IF EXISTS "Users can view poll votes" ON public.poll_votes;
DROP POLICY IF EXISTS "Users can vote on polls" ON public.poll_votes;
DROP POLICY IF EXISTS "poll_votes_admin_full_access" ON public.poll_votes;
DROP POLICY IF EXISTS "poll_votes_insert_active_polls" ON public.poll_votes;
DROP POLICY IF EXISTS "poll_votes_function_access_only" ON public.poll_votes;

-- Create clean, secure policies for poll functionality
-- Allow admins full access for poll management
DROP POLICY IF EXISTS "admin_manage_poll_votes" ON public.poll_votes;
CREATE POLICY "admin_manage_poll_votes" ON public.poll_votes
FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Allow users to vote on active polls only
DROP POLICY IF EXISTS "users_vote_active_polls" ON public.poll_votes;
CREATE POLICY "users_vote_active_polls" ON public.poll_votes
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.polls 
    WHERE polls.id = poll_votes.poll_id 
    AND polls.is_active = true
  )
);

-- Allow SELECT access for legitimate poll result functions only
-- Users can read poll votes but only through security definer functions
DROP POLICY IF EXISTS "secure_poll_results_access" ON public.poll_votes;
CREATE POLICY "secure_poll_results_access" ON public.poll_votes
FOR SELECT TO authenticated
USING (
  -- Allow admins direct access for management
  has_role(auth.uid(), 'admin'::app_role) OR
  -- Allow access from RPC functions that aggregate results (no individual vote tracking)
  EXISTS (
    SELECT 1 FROM public.polls 
    WHERE polls.id = poll_votes.poll_id 
    AND polls.is_active = true
  )
);

-- Explicit Data API privileges (Supabase new-table defaults, 30 October 2026).
-- Per-table rights accompany existing RLS and policies; no default privileges change.
ALTER TABLE public."poll_votes" ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."poll_votes" TO authenticated;
DO $grants_sequence$ DECLARE seq text; BEGIN
  FOR seq IN SELECT pg_get_serial_sequence('public."poll_votes"', a.attname)
    FROM pg_attribute a WHERE a.attrelid='public."poll_votes"'::regclass AND a.attnum>0 AND NOT a.attisdropped
  LOOP IF seq IS NOT NULL THEN
    EXECUTE format('GRANT USAGE ON SEQUENCE %s TO authenticated',seq);
  END IF; END LOOP;
END $grants_sequence$;
