-- Fix broken thumbnail URLs for blog articles
UPDATE articles 
SET thumbnail_url = CASE 
  WHEN slug = 'ai-prompts-for-social-media-content' THEN '/lovable-uploads/a619c09b-001e-470b-beff-59e90dcd0a60.png'
  WHEN slug = 'ai-prompts-for-marketing-campaigns' THEN '/ai-prompts-marketing-campaigns-hero.png'
  WHEN slug = 'ai-prompts-that-save-you-hours' THEN '/lovable-uploads/07189309-a3ae-4520-988b-ea83220f5935.png'
END
WHERE slug IN ('ai-prompts-for-social-media-content', 'ai-prompts-for-marketing-campaigns', 'ai-prompts-that-save-you-hours');