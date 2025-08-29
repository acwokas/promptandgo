-- Insert realistic demo vote data for polls
-- First, let's clear any existing votes to start fresh
DELETE FROM poll_votes;

-- Generate votes for "Local Language Prompts" poll (edbc3a68-2a06-4593-b1f1-a9acbfe60834)
-- Total target: ~350 votes with realistic distribution
WITH vote_data AS (
  SELECT 
    'edbc3a68-2a06-4593-b1f1-a9acbfe60834'::uuid as poll_id,
    option_id,
    vote_count,
    -- Spread votes over past 30 days with increasing frequency towards recent days
    generate_series(1, vote_count) as vote_seq
  FROM (VALUES
    ('6c74f462-7a4f-40cf-b967-f79ddf09b563'::uuid, 95),  -- Spanish (most popular)
    ('a86f9381-f560-4880-a0a4-3c73fc570eb6'::uuid, 78),  -- Singlish 
    ('28f53fe9-b224-476e-bd96-338125036af7'::uuid, 65),  -- Hindi
    ('d3b7ce1d-90bc-4782-b97f-b66fd9a88731'::uuid, 58),  -- Tagalog
    ('d728f3b8-9489-4267-bb77-2fef0df970a4'::uuid, 42)   -- Bahasa Indonesia
  ) AS options(option_id, vote_count)
),
time_distributed_votes AS (
  SELECT 
    poll_id,
    option_id,
    -- Create more recent votes with weighted distribution
    now() - INTERVAL '30 days' + 
    (CASE 
      WHEN vote_seq <= vote_count * 0.2 THEN random() * INTERVAL '10 days'  -- 20% in first 10 days
      WHEN vote_seq <= vote_count * 0.5 THEN INTERVAL '10 days' + random() * INTERVAL '10 days'  -- 30% in middle 10 days
      ELSE INTERVAL '20 days' + random() * INTERVAL '10 days'  -- 50% in last 10 days
    END) as created_at,
    -- Generate realistic IP addresses
    ('192.168.' || floor(random() * 255)::int || '.' || floor(random() * 255)::int)::inet as ip_address
  FROM vote_data
)
INSERT INTO poll_votes (poll_id, option_id, created_at, ip_address)
SELECT poll_id, option_id, created_at, ip_address
FROM time_distributed_votes;

-- Generate votes for "Which Pack Next?" poll (af0bfcf8-6eb7-4b43-8378-cd84738ccb47)
-- Total target: ~380 votes
WITH vote_data AS (
  SELECT 
    'af0bfcf8-6eb7-4b43-8378-cd84738ccb47'::uuid as poll_id,
    option_id,
    vote_count,
    generate_series(1, vote_count) as vote_seq
  FROM (VALUES
    ('3ed436b3-acc4-4c4c-b5ea-106d1141ea81'::uuid, 102), -- Marketing & Content Ideas (most popular)
    ('88f382d4-df14-4fe0-ae83-c0c0ff3d76ef'::uuid, 89),  -- Productivity & Focus
    ('a758f95f-0092-4675-88c4-69f98a3b3c99'::uuid, 76),  -- Creative Writing & Storytelling
    ('6f831ca1-45cb-4969-976f-2eea2e1c6805'::uuid, 67),  -- Career Growth & Job Prep
    ('e4502b3d-afb1-4dbd-9088-964ee9ec92ec'::uuid, 46)   -- Fun & Entertainment
  ) AS options(option_id, vote_count)
),
time_distributed_votes AS (
  SELECT 
    poll_id,
    option_id,
    -- Similar time distribution but slightly different pattern
    now() - INTERVAL '28 days' + 
    (CASE 
      WHEN vote_seq <= vote_count * 0.15 THEN random() * INTERVAL '8 days'   -- 15% in first 8 days
      WHEN vote_seq <= vote_count * 0.45 THEN INTERVAL '8 days' + random() * INTERVAL '12 days'  -- 30% in middle 12 days
      ELSE INTERVAL '20 days' + random() * INTERVAL '8 days'   -- 55% in last 8 days
    END) as created_at,
    -- Different IP range for variety
    ('10.0.' || floor(random() * 255)::int || '.' || floor(random() * 255)::int)::inet as ip_address
  FROM vote_data
)
INSERT INTO poll_votes (poll_id, option_id, created_at, ip_address)
SELECT poll_id, option_id, created_at, ip_address
FROM time_distributed_votes;