-- Add PWA installation XP activity
INSERT INTO xp_activities (
  activity_key,
  activity_name,
  activity_description,
  xp_value,
  is_repeatable,
  icon,
  is_active
) VALUES (
  'pwa_install',
  'Install App',
  'Install PromptAndGo as a Progressive Web App',
  30,
  false,
  'Download',
  true
);