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
        url:='https://dkdakwyrqyfdkyukqmqs.supabase.co/functions/v1/rotate-featured-categories',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzenh4bXhxaWRrcGtobGtzdGdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1OTAwMDgsImV4cCI6MjA5MjE2NjAwOH0.W8hk9iWryQ3HahjQg0md133uWJN4rqW4ZFpCpZdmt_g"}'::jsonb,
        body:=concat('{"timestamp": "', now(), '"}')::jsonb
    ) as request_id
  $$
);

-- Also run the rotation once now to activate the new system
SELECT public.rotate_featured_categories();
