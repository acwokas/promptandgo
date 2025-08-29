-- Clear existing votes and add higher volume demo data with unique IPs
DELETE FROM poll_votes;

-- Generate higher volume votes for "Local Language Prompts" poll (edbc3a68-2a06-4593-b1f1-a9acbfe60834)
-- Total target: ~505 votes with realistic distribution
WITH vote_data AS (
  SELECT 
    'edbc3a68-2a06-4593-b1f1-a9acbfe60834'::uuid as poll_id,
    option_id,
    vote_count,
    -- Spread votes over past 30 days with increasing frequency towards recent days
    generate_series(1, vote_count) as vote_seq
  FROM (VALUES
    ('6c74f462-7a4f-40cf-b967-f79ddf09b563'::uuid, 142),  -- Spanish (most popular)
    ('a86f9381-f560-4880-a0a4-3c73fc570eb6'::uuid, 118),  -- Singlish 
    ('28f53fe9-b224-476e-bd96-338125036af7'::uuid, 97),   -- Hindi
    ('d3b7ce1d-90bc-4782-b97f-b66fd9a88731'::uuid, 86),   -- Tagalog
    ('d728f3b8-9489-4267-bb77-2fef0df970a4'::uuid, 62)    -- Bahasa Indonesia
  ) AS options(option_id, vote_count)
),
time_distributed_votes AS (
  SELECT 
    poll_id,
    option_id,
    vote_seq,
    -- Create more recent votes with weighted distribution
    now() - INTERVAL '30 days' + 
    (CASE 
      WHEN vote_seq <= vote_count * 0.15 THEN random() * INTERVAL '8 days'   -- 15% in first 8 days
      WHEN vote_seq <= vote_count * 0.35 THEN INTERVAL '8 days' + random() * INTERVAL '8 days'   -- 20% in middle 8 days  
      WHEN vote_seq <= vote_count * 0.65 THEN INTERVAL '16 days' + random() * INTERVAL '8 days'  -- 30% in next 8 days
      ELSE INTERVAL '24 days' + random() * INTERVAL '6 days'  -- 35% in last 6 days
    END) as created_at,
    -- Generate unique IP addresses using row_number to ensure uniqueness
    ('192.168.' || ((row_number() OVER()) % 255 + 1) || '.' || ((row_number() OVER() / 255) % 255 + 1))::inet as ip_address
  FROM vote_data
)
INSERT INTO poll_votes (poll_id, option_id, created_at, ip_address)
SELECT poll_id, option_id, created_at, ip_address
FROM time_distributed_votes;

-- Generate higher volume votes for "Which Pack Next?" poll (af0bfcf8-6eb7-4b43-8378-cd84738ccb47)
-- Total target: ~590 votes
WITH vote_data AS (
  SELECT 
    'af0bfcf8-6eb7-4b43-8378-cd84738ccb47'::uuid as poll_id,
    option_id,
    vote_count,
    generate_series(1, vote_count) as vote_seq
  FROM (VALUES
    ('3ed436b3-acc4-4c4c-b5ea-106d1141ea81'::uuid, 158), -- Marketing & Content Ideas (most popular)
    ('88f382d4-df14-4fe0-ae83-c0c0ff3d76ef'::uuid, 135), -- Productivity & Focus
    ('a758f95f-0092-4675-88c4-69f98a3b3c99'::uuid, 114), -- Creative Writing & Storytelling
    ('6f831ca1-45cb-4969-976f-2eea2e1c6805'::uuid, 98),  -- Career Growth & Job Prep
    ('e4502b3d-afb1-4dbd-9088-964ee9ec92ec'::uuid, 85)   -- Fun & Entertainment
  ) AS options(option_id, vote_count)
),
time_distributed_votes AS (
  SELECT 
    poll_id,
    option_id,
    vote_seq,
    -- Similar time distribution but slightly different pattern
    now() - INTERVAL '28 days' + 
    (CASE 
      WHEN vote_seq <= vote_count * 0.12 THEN random() * INTERVAL '7 days'   -- 12% in first 7 days
      WHEN vote_seq <= vote_count * 0.32 THEN INTERVAL '7 days' + random() * INTERVAL '9 days'   -- 20% in next 9 days
      WHEN vote_seq <= vote_count * 0.60 THEN INTERVAL '16 days' + random() * INTERVAL '7 days'  -- 28% in next 7 days
      ELSE INTERVAL '23 days' + random() * INTERVAL '5 days'   -- 40% in last 5 days
    END) as created_at,
    -- Generate unique IP addresses for this poll using different range
    ('10.0.' || ((row_number() OVER()) % 255 + 1) || '.' || ((row_number() OVER() / 255) % 255 + 1))::inet as ip_address
  FROM vote_data
)
INSERT INTO poll_votes (poll_id, option_id, created_at, ip_address)
SELECT poll_id, option_id, created_at, ip_address
FROM time_distributed_votes;