-- Create table for rotating featured categories with daily fake usage stats
CREATE TABLE public.featured_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL,
  link text NOT NULL,
  icon text NOT NULL,
  usage_text text NOT NULL,
  is_active boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.featured_categories ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active categories
CREATE POLICY "Public can view active featured categories"
ON public.featured_categories
FOR SELECT
USING (is_active = true);

-- Only service role can manage categories
CREATE POLICY "Service role can manage featured categories"
ON public.featured_categories
FOR ALL
USING (auth.role() = 'service_role'::text);

-- Insert initial rotating categories data
INSERT INTO public.featured_categories (title, message, link, icon, usage_text, is_active, display_order) VALUES
-- Set 1: Current active set
('Marketing & Advertising', 'Boost your campaigns today', '/library?category=Marketing%20%26%20Advertising', 'Briefcase', '5x usage today', true, 1),
('Personal Growth & Mindfulness', 'Transform your mindset', '/library?category=Personal%20Growth%20%26%20Mindfulness', 'Heart', '3x usage today', true, 2),
('Creative Writing & Content', 'Unleash your creativity', '/library?category=Creative%20Writing%20%26%20Content', 'Edit3', '7x usage today', true, 3),

-- Set 2: Tomorrow's rotation
('Business Strategy', 'Strategic insights await', '/library?category=Business%20Strategy', 'TrendingUp', '12x usage today', false, 1),
('Social Media & Content', 'Viral content secrets', '/library?category=Social%20Media%20%26%20Content', 'Share2', '8x usage today', false, 2),
('Learning & Education', 'Expand your knowledge', '/library?category=Learning%20%26%20Education', 'BookOpen', '4x usage today', false, 3),

-- Set 3: Day 3 rotation
('Productivity & Time Management', 'Master your schedule', '/library?category=Productivity%20%26%20Time%20Management', 'Clock', '15x usage today', false, 1),
('Career & Professional Development', 'Advance your career', '/library?category=Career%20%26%20Professional%20Development', 'Users', '6x usage today', false, 2),
('Technology & AI', 'Future-proof your skills', '/library?category=Technology%20%26%20AI', 'Zap', '22x usage today', false, 3),

-- Set 4: Day 4 rotation
('Finance & Investment', 'Wealth building strategies', '/library?category=Finance%20%26%20Investment', 'DollarSign', '9x usage today', false, 1),
('Health & Wellness', 'Optimize your wellbeing', '/library?category=Health%20%26%20Wellness', 'Heart', '11x usage today', false, 2),
('Creative Arts & Design', 'Artistic inspiration flows', '/library?category=Creative%20Arts%20%26%20Design', 'Palette', '5x usage today', false, 3),

-- Set 5: Day 5 rotation
('Customer Service & Support', 'Exceptional service skills', '/library?category=Customer%20Service%20%26%20Support', 'Headphones', '7x usage today', false, 1),
('Sales & Negotiation', 'Close more deals', '/library?category=Sales%20%26%20Negotiation', 'Target', '14x usage today', false, 2),
('Research & Analysis', 'Data-driven insights', '/library?category=Research%20%26%20Analysis', 'Search', '3x usage today', false, 3),

-- Set 6: Day 6 rotation  
('Travel & Lifestyle', 'Adventure awaits you', '/library?category=Travel%20%26%20Lifestyle', 'Plane', '18x usage today', false, 1),
('Food & Cooking', 'Culinary mastery tips', '/library?category=Food%20%26%20Cooking', 'ChefHat', '6x usage today', false, 2),
('Gaming & Entertainment', 'Level up your fun', '/library?category=Gaming%20%26%20Entertainment', 'Gamepad2', '25x usage today', false, 3),

-- Set 7: Day 7 rotation (weekly cycle complete)
('Relationships & Communication', 'Connect more deeply', '/library?category=Relationships%20%26%20Communication', 'MessageCircle', '8x usage today', false, 1),
('Parenting & Family', 'Family harmony guide', '/library?category=Parenting%20%26%20Family', 'Home', '4x usage today', false, 2),
('Spiritual & Philosophy', 'Wisdom for the soul', '/library?category=Spiritual%20%26%20Philosophy', 'Star', '13x usage today', false, 3);

-- Create function to rotate featured categories
CREATE OR REPLACE FUNCTION public.rotate_featured_categories()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_date_sgt date;
  days_since_epoch integer;
  rotation_set integer;
  total_sets integer := 7; -- We have 7 different sets
BEGIN
  -- Get current date in Singapore timezone
  current_date_sgt := (now() AT TIME ZONE 'Asia/Singapore')::date;
  
  -- Calculate days since a fixed epoch (2024-01-01) to determine rotation
  days_since_epoch := current_date_sgt - '2024-01-01'::date;
  
  -- Calculate which set should be active (0-6, then cycles)
  rotation_set := days_since_epoch % total_sets;
  
  -- Deactivate all categories
  UPDATE public.featured_categories SET is_active = false;
  
  -- Activate the appropriate set based on rotation
  -- We'll use a more complex query to handle the rotation sets
  UPDATE public.featured_categories 
  SET is_active = true 
  WHERE id IN (
    SELECT id FROM (
      SELECT id, ROW_NUMBER() OVER (PARTITION BY display_order ORDER BY created_at) as set_number
      FROM public.featured_categories
      WHERE NOT is_active -- Get from inactive categories
    ) ranked
    WHERE set_number = rotation_set + 1 -- +1 because ROW_NUMBER starts at 1
  );
  
  -- If no categories were activated (shouldn't happen), activate the first set as fallback
  IF NOT EXISTS (SELECT 1 FROM public.featured_categories WHERE is_active = true) THEN
    UPDATE public.featured_categories 
    SET is_active = true 
    WHERE id IN (
      SELECT id FROM public.featured_categories 
      ORDER BY created_at 
      LIMIT 3
    );
  END IF;
END;
$$;

-- Set up the trigger to update timestamps
CREATE TRIGGER update_featured_categories_updated_at
  BEFORE UPDATE ON public.featured_categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();