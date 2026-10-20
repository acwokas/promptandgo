-- Fix the poll voting RLS policy
DROP POLICY IF EXISTS "users_vote_active_polls" ON poll_votes;

-- Create a proper policy that allows voting on active polls for both authenticated and anonymous users
DROP POLICY IF EXISTS "users_vote_active_polls" ON poll_votes;
DROP POLICY IF EXISTS "users_vote_active_polls" ON poll_votes;
CREATE POLICY "users_vote_active_polls" 
ON poll_votes 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM polls 
    WHERE polls.id = poll_votes.poll_id 
    AND polls.is_active = true
  )
);

-- Explicit Data API privileges (Supabase new-table defaults, 30 October 2026).
-- Per-table rights accompany existing RLS and policies; no default privileges change.
ALTER TABLE public."poll_votes" ENABLE ROW LEVEL SECURITY;
GRANT INSERT ON TABLE public."poll_votes" TO anon;
GRANT INSERT ON TABLE public."poll_votes" TO authenticated;
DO $grants_sequence$ DECLARE seq text; BEGIN
  FOR seq IN SELECT pg_get_serial_sequence('public."poll_votes"', a.attname)
    FROM pg_attribute a WHERE a.attrelid='public."poll_votes"'::regclass AND a.attnum>0 AND NOT a.attisdropped
  LOOP IF seq IS NOT NULL THEN
    EXECUTE format('GRANT USAGE ON SEQUENCE %s TO anon, authenticated',seq);
  END IF; END LOOP;
END $grants_sequence$;
