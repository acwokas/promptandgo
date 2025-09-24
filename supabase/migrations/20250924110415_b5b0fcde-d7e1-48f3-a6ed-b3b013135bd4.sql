-- Set up cron job to rotate featured categories daily at midday SGT (4 AM UTC)
-- First enable the required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule the daily rotation at midday SGT (4 AM UTC)
SELECT cron.schedule(
  'rotate-featured-categories-daily',
  '0 4 * * *', -- Every day at 4 AM UTC (midday SGT)
  $$
  SELECT
    net.http_post(
        url:='https://mncxspmtqvqgvtrxbxzb.supabase.co/functions/v1/rotate-featured-categories',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uY3hzcG10cXZxZ3Z0cnhieHpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4MjI0NjUsImV4cCI6MjA3MDM5ODQ2NX0.UjglB_MtyXQgsAHbdWKk_sn2hSyOX9iPWIU8EOayn2M"}'::jsonb,
        body:=concat('{"timestamp": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);

-- Also run the rotation once now to activate the new system
SELECT public.rotate_featured_categories();