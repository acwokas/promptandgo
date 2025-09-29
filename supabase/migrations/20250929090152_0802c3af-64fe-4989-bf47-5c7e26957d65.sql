-- Update published dates for blog articles
UPDATE articles 
SET published_date = CASE 
  WHEN slug = 'the-art-of-talking-to-ai-and-why-most-people-are-doing-it-wrong' THEN '2025-09-30'::date
  WHEN slug = 'beginners-guide-midjourney-prompts' THEN '2025-08-17'::date
  WHEN slug = 'best-ai-prompts-for-small-business-2025' THEN '2025-07-19'::date
  WHEN slug = 'ai-prompts-for-business-strategy' THEN '2025-06-05'::date
  WHEN slug = 'ai-prompts-for-content-writers' THEN '2025-05-26'::date
  WHEN slug = 'ai-prompts-for-social-media-content' THEN '2025-04-09'::date
  WHEN slug = 'ai-prompts-for-customer-support' THEN '2025-03-18'::date
  WHEN slug = 'ai-prompts-for-marketing-campaigns' THEN '2025-02-27'::date
  WHEN slug = 'ai-prompts-that-save-you-hours' THEN '2025-01-01'::date
  WHEN slug = 'how-to-write-ai-prompts' THEN '2024-12-01'::date
  WHEN slug = 'welcome-to-promptandgo-ai' THEN '2024-11-01'::date
END
WHERE slug IN (
  'the-art-of-talking-to-ai-and-why-most-people-are-doing-it-wrong',
  'beginners-guide-midjourney-prompts', 
  'best-ai-prompts-for-small-business-2025',
  'ai-prompts-for-business-strategy',
  'ai-prompts-for-content-writers',
  'ai-prompts-for-social-media-content',
  'ai-prompts-for-customer-support',
  'ai-prompts-for-marketing-campaigns',
  'ai-prompts-that-save-you-hours',
  'how-to-write-ai-prompts',
  'welcome-to-promptandgo-ai'
);