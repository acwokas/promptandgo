-- Mark specific prompts as PRO based on provided list and remove bracketed codes from titles
BEGIN;

-- 1) Set is_pro = true for the listed prompts (case-insensitive match)
UPDATE public.prompts
SET is_pro = true
WHERE lower(title) IN (
  lower('Cross-Platform Campaign Blueprint (ROSES)'),
  lower('Trend Risk Assessment Guide (SCET)'),
  lower('Influencer ROI Projection Model (TREF)'),
  lower('Reactive Content Workflow (PECRA)'),
  lower('Community Building Playbook (ROSES)'),
  lower('Algorithm Update Response Plan (SCET)'),
  lower('Paid Social Creative Testing Matrix (TREF)'),
  lower('Customer Journey Content Map (PECRA)'),
  lower('Crisis Hashtag Strategy (ROSES)'),
  lower('Monthly Performance Review Framework (TREF)'),
  lower('Executive Resume Transformation Plan (TREF)'),
  lower('STAR Method Interview Answer Bank (ROSES)'),
  lower('LinkedIn Networking Campaign Blueprint (PECRA)'),
  lower('Salary Negotiation Role-Play Script (SCET)'),
  lower('Career Skills Gap Roadmap (TREF)'),
  lower('Personal Brand Story Framework (ROSES)'),
  lower('Promotion Readiness Audit (PECRA)'),
  lower('Career Change Decision Matrix (TREF)'),
  lower('Industry Thought Leadership Plan (ROSES)'),
  lower('Post-Interview Follow-Up Toolkit (SCET)'),
  lower('Neighborhood Buyer Persona Mapping (TREF)'),
  lower('Virtual Open House Script (ROSES)'),
  lower('Real Estate Content Calendar (PECRA)'),
  lower('Property Investment ROI Calculator Brief (TREF)'),
  lower('Luxury Listing Marketing Strategy (SCET)'),
  lower('Lead Nurture Email Sequence (ROSES)'),
  lower('Local Market Data Report Template (TREF)'),
  lower('First-Time Buyer Education Plan (PECRA)'),
  lower('Real Estate Video Ad Storyboard (ROSES)'),
  lower('Real Estate SEO Audit Checklist (SCET)'),
  lower('End-to-End Workflow Automation Blueprint (TREF)'),
  lower('Sales-to-Invoice Automation Plan (SCET)'),
  lower('Automated Compliance Audit Tracker (PECRA)'),
  lower('Customer Onboarding Automation Map (ROSES)'),
  lower('Data Sync & Reporting Automation Guide (TREF)'),
  lower('Evergreen Content Ecosystem Plan (TREF)'),
  lower('Authority Article Series Blueprint (ROSES)'),
  lower('Cross-Platform Repurposing Framework (PECRA)'),
  lower('Content ROI Measurement Dashboard Spec (SCET)'),
  lower('Thought Leadership Video Series Plan (ROSES)'),
  lower('Personalised Wellness Routine Designer (TREF)'),
  lower('Habit Transformation Plan (ROSES)'),
  lower('Stress Management Protocol (SCET)'),
  lower('Holistic Nutrition Plan (PECRA)'),
  lower('Mindfulness Practice Program (TREF)')
);

-- 2) Strip trailing bracketed codes from ALL prompt titles where present
UPDATE public.prompts
SET title = regexp_replace(title, '\s*\((SCET|ROSES|TREF|PECRA)\)\s*$', '', 'i')
WHERE title ~* '\s*\((SCET|ROSES|TREF|PECRA)\)\s*$';

COMMIT;