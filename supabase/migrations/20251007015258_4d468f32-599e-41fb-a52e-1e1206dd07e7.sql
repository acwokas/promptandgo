-- Create XP system tables for gamification

-- Table to track user's total XP
CREATE TABLE public.user_xp (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  total_xp integer NOT NULL DEFAULT 0,
  available_xp integer NOT NULL DEFAULT 0,
  level integer NOT NULL DEFAULT 1,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Table to define XP-earning activities
CREATE TABLE public.xp_activities (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  activity_key text NOT NULL UNIQUE,
  activity_name text NOT NULL,
  activity_description text,
  xp_value integer NOT NULL,
  is_repeatable boolean NOT NULL DEFAULT false,
  repeat_interval text, -- 'daily', 'weekly', 'monthly'
  icon text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Table to log XP transactions
CREATE TABLE public.xp_transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  activity_key text,
  transaction_type text NOT NULL, -- 'earn' or 'spend'
  xp_amount integer NOT NULL,
  description text,
  metadata jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Table to define rewards that can be redeemed
CREATE TABLE public.xp_rewards (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reward_key text NOT NULL UNIQUE,
  reward_name text NOT NULL,
  reward_description text,
  xp_cost integer NOT NULL,
  reward_type text NOT NULL, -- 'prompt_unlock', 'pack_discount', 'feature_unlock'
  reward_value jsonb,
  icon text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Table to track reward redemptions
CREATE TABLE public.xp_reward_redemptions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  reward_id uuid NOT NULL,
  xp_spent integer NOT NULL,
  redeemed_at timestamp with time zone NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'cancelled'
  metadata jsonb
);

-- Enable RLS
ALTER TABLE public.user_xp ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_reward_redemptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_xp
CREATE POLICY "Users can view their own XP"
  ON public.user_xp FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own XP record"
  ON public.user_xp FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for xp_activities
CREATE POLICY "Anyone can view active activities"
  ON public.xp_activities FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage activities"
  ON public.xp_activities FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for xp_transactions
CREATE POLICY "Users can view their own transactions"
  ON public.xp_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert transactions"
  ON public.xp_transactions FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- RLS Policies for xp_rewards
CREATE POLICY "Anyone can view active rewards"
  ON public.xp_rewards FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage rewards"
  ON public.xp_rewards FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for xp_reward_redemptions
CREATE POLICY "Users can view their own redemptions"
  ON public.xp_reward_redemptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage redemptions"
  ON public.xp_reward_redemptions FOR ALL
  USING (auth.role() = 'service_role');

-- Function to award XP
CREATE OR REPLACE FUNCTION public.award_xp(
  p_user_id uuid,
  p_activity_key text,
  p_description text DEFAULT NULL,
  p_metadata jsonb DEFAULT NULL
)
RETURNS TABLE(success boolean, new_total_xp integer, xp_awarded integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_xp_value integer;
  v_is_repeatable boolean;
  v_repeat_interval text;
  v_last_completion timestamp with time zone;
  v_can_award boolean := true;
  v_current_xp integer;
  v_new_level integer;
BEGIN
  -- Get activity details
  SELECT xp_value, is_repeatable, repeat_interval
  INTO v_xp_value, v_is_repeatable, v_repeat_interval
  FROM public.xp_activities
  WHERE activity_key = p_activity_key AND is_active = true;

  IF v_xp_value IS NULL THEN
    RETURN QUERY SELECT false, 0, 0;
    RETURN;
  END IF;

  -- Check if already completed (for non-repeatable activities)
  IF NOT v_is_repeatable THEN
    SELECT EXISTS(
      SELECT 1 FROM public.xp_transactions
      WHERE user_id = p_user_id 
        AND activity_key = p_activity_key
        AND transaction_type = 'earn'
    ) INTO v_can_award;
    
    IF v_can_award THEN
      RETURN QUERY SELECT false, 0, 0;
      RETURN;
    END IF;
  END IF;

  -- Check repeat interval for repeatable activities
  IF v_is_repeatable AND v_repeat_interval IS NOT NULL THEN
    SELECT MAX(created_at) INTO v_last_completion
    FROM public.xp_transactions
    WHERE user_id = p_user_id 
      AND activity_key = p_activity_key
      AND transaction_type = 'earn';

    IF v_last_completion IS NOT NULL THEN
      CASE v_repeat_interval
        WHEN 'daily' THEN
          IF v_last_completion::date = CURRENT_DATE THEN
            v_can_award := false;
          END IF;
        WHEN 'weekly' THEN
          IF DATE_TRUNC('week', v_last_completion) = DATE_TRUNC('week', CURRENT_TIMESTAMP) THEN
            v_can_award := false;
          END IF;
        WHEN 'monthly' THEN
          IF DATE_TRUNC('month', v_last_completion) = DATE_TRUNC('month', CURRENT_TIMESTAMP) THEN
            v_can_award := false;
          END IF;
      END CASE;
    END IF;

    IF NOT v_can_award THEN
      RETURN QUERY SELECT false, 0, 0;
      RETURN;
    END IF;
  END IF;

  -- Create or get user XP record
  INSERT INTO public.user_xp (user_id, total_xp, available_xp)
  VALUES (p_user_id, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;

  -- Award XP
  UPDATE public.user_xp
  SET 
    total_xp = total_xp + v_xp_value,
    available_xp = available_xp + v_xp_value,
    level = FLOOR((total_xp + v_xp_value) / 100.0) + 1,
    updated_at = now()
  WHERE user_id = p_user_id
  RETURNING total_xp, level INTO v_current_xp, v_new_level;

  -- Log transaction
  INSERT INTO public.xp_transactions (user_id, activity_key, transaction_type, xp_amount, description, metadata)
  VALUES (p_user_id, p_activity_key, 'earn', v_xp_value, COALESCE(p_description, 'XP earned'), p_metadata);

  RETURN QUERY SELECT true, v_current_xp, v_xp_value;
END;
$$;

-- Function to redeem XP for rewards
CREATE OR REPLACE FUNCTION public.redeem_xp_reward(
  p_user_id uuid,
  p_reward_id uuid
)
RETURNS TABLE(success boolean, message text, new_available_xp integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_xp_cost integer;
  v_available_xp integer;
  v_reward_name text;
BEGIN
  -- Get reward cost and name
  SELECT xp_cost, reward_name
  INTO v_xp_cost, v_reward_name
  FROM public.xp_rewards
  WHERE id = p_reward_id AND is_active = true;

  IF v_xp_cost IS NULL THEN
    RETURN QUERY SELECT false, 'Reward not found or inactive', 0;
    RETURN;
  END IF;

  -- Get user's available XP
  SELECT available_xp INTO v_available_xp
  FROM public.user_xp
  WHERE user_id = p_user_id;

  IF v_available_xp IS NULL THEN
    RETURN QUERY SELECT false, 'User XP record not found', 0;
    RETURN;
  END IF;

  -- Check if user has enough XP
  IF v_available_xp < v_xp_cost THEN
    RETURN QUERY SELECT false, 'Insufficient XP', v_available_xp;
    RETURN;
  END IF;

  -- Deduct XP
  UPDATE public.user_xp
  SET 
    available_xp = available_xp - v_xp_cost,
    updated_at = now()
  WHERE user_id = p_user_id
  RETURNING available_xp INTO v_available_xp;

  -- Log transaction
  INSERT INTO public.xp_transactions (user_id, transaction_type, xp_amount, description, metadata)
  VALUES (p_user_id, 'spend', v_xp_cost, 'Redeemed: ' || v_reward_name, jsonb_build_object('reward_id', p_reward_id));

  -- Log redemption
  INSERT INTO public.xp_reward_redemptions (user_id, reward_id, xp_spent, status)
  VALUES (p_user_id, p_reward_id, v_xp_cost, 'completed');

  RETURN QUERY SELECT true, 'Reward redeemed successfully', v_available_xp;
END;
$$;

-- Insert default activities
INSERT INTO public.xp_activities (activity_key, activity_name, activity_description, xp_value, is_repeatable, repeat_interval, icon) VALUES
('account_created', 'Create Account', 'Sign up for a PromptAndGo account', 50, false, NULL, 'UserPlus'),
('newsletter_signup', 'Newsletter Signup', 'Subscribe to our newsletter', 25, false, NULL, 'Mail'),
('certification_completed', 'Complete Certification', 'Complete the Prompt Like a Pro certification', 100, false, NULL, 'Award'),
('linkedin_share', 'Share on LinkedIn', 'Share your certificate on LinkedIn', 30, false, NULL, 'Share2'),
('referral_signup', 'Friend Referral', 'Referred friend creates account', 75, true, NULL, 'Users'),
('pack_purchase', 'Purchase Pack', 'Buy a prompt pack', 50, true, NULL, 'ShoppingCart'),
('daily_login', 'Daily Login', 'Login to your account', 10, true, 'daily', 'Calendar'),
('prompt_favorite', 'Favorite Prompt', 'Add a prompt to favorites', 5, true, NULL, 'Heart'),
('profile_complete', 'Complete Profile', 'Fill out your profile information', 40, false, NULL, 'User');

-- Insert default rewards
INSERT INTO public.xp_rewards (reward_key, reward_name, reward_description, xp_cost, reward_type, reward_value, icon) VALUES
('unlock_pro_prompt', 'Unlock Pro Prompt', 'Unlock access to 1 premium prompt', 100, 'prompt_unlock', '{"quantity": 1}'::jsonb, 'Unlock'),
('pack_discount_10', '10% Pack Discount', 'Get 10% off your next pack purchase', 150, 'pack_discount', '{"discount_percent": 10}'::jsonb, 'Tag'),
('pack_discount_25', '25% Pack Discount', 'Get 25% off your next pack purchase', 300, 'pack_discount', '{"discount_percent": 25}'::jsonb, 'Tag'),
('unlock_5_prompts', 'Unlock 5 Pro Prompts', 'Unlock access to 5 premium prompts', 450, 'prompt_unlock', '{"quantity": 5}'::jsonb, 'Unlock'),
('free_pack', 'Free Pack', 'Get one pack completely free', 1000, 'pack_discount', '{"discount_percent": 100}'::jsonb, 'Gift');

-- Trigger to update updated_at
CREATE TRIGGER update_user_xp_updated_at
  BEFORE UPDATE ON public.user_xp
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
