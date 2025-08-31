-- Fix the poll voting RLS policy
DROP POLICY IF EXISTS "users_vote_active_polls" ON poll_votes;

-- Create a proper policy that allows voting on active polls for both authenticated and anonymous users
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