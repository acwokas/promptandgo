-- Create coupons table
CREATE TABLE public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount', 'free_pack')),
  discount_value INTEGER, -- percentage (0-100) or cents for fixed_amount
  free_pack_id UUID, -- references packs table for free pack coupons
  max_uses INTEGER, -- NULL means unlimited
  current_uses INTEGER NOT NULL DEFAULT 0,
  valid_from TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  description TEXT,
  minimum_purchase_cents INTEGER DEFAULT 0 -- minimum cart value to use coupon
);

-- Create coupon_usage table to track who used which coupons
CREATE TABLE public.coupon_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  used_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  discount_applied INTEGER NOT NULL, -- amount in cents that was discounted
  UNIQUE(coupon_id, user_id) -- one use per user per coupon
);

-- Enable RLS
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies for coupons
CREATE POLICY "Public can view active coupons"
  ON public.coupons
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage coupons"
  ON public.coupons
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for coupon_usage
CREATE POLICY "Users can view their own coupon usage"
  ON public.coupon_usage
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert coupon usage"
  ON public.coupon_usage
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admins can view all coupon usage"
  ON public.coupon_usage
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Function to validate and apply coupon
CREATE OR REPLACE FUNCTION public.validate_coupon(
  p_code TEXT,
  p_user_id UUID,
  p_cart_total_cents INTEGER
)
RETURNS TABLE(
  valid BOOLEAN,
  coupon_id UUID,
  discount_type TEXT,
  discount_value INTEGER,
  free_pack_id UUID,
  message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_coupon RECORD;
  v_already_used BOOLEAN;
BEGIN
  -- Get coupon details
  SELECT * INTO v_coupon
  FROM public.coupons
  WHERE code = UPPER(p_code)
    AND is_active = true
    AND valid_from <= now()
    AND (valid_until IS NULL OR valid_until >= now());
  
  -- Check if coupon exists
  IF v_coupon.id IS NULL THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, NULL::INTEGER, NULL::UUID, 'Invalid or expired coupon code';
    RETURN;
  END IF;
  
  -- Check if user already used this coupon
  SELECT EXISTS(
    SELECT 1 FROM public.coupon_usage
    WHERE coupon_id = v_coupon.id AND user_id = p_user_id
  ) INTO v_already_used;
  
  IF v_already_used THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, NULL::INTEGER, NULL::UUID, 'You have already used this coupon';
    RETURN;
  END IF;
  
  -- Check max uses
  IF v_coupon.max_uses IS NOT NULL AND v_coupon.current_uses >= v_coupon.max_uses THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, NULL::INTEGER, NULL::UUID, 'This coupon has reached its usage limit';
    RETURN;
  END IF;
  
  -- Check minimum purchase
  IF p_cart_total_cents < v_coupon.minimum_purchase_cents THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, NULL::INTEGER, NULL::UUID, 
      'Minimum purchase of $' || (v_coupon.minimum_purchase_cents / 100.0)::TEXT || ' required';
    RETURN;
  END IF;
  
  -- Coupon is valid
  RETURN QUERY SELECT 
    true,
    v_coupon.id,
    v_coupon.discount_type,
    v_coupon.discount_value,
    v_coupon.free_pack_id,
    'Coupon applied successfully!'::TEXT;
END;
$$;

-- Insert the Welcome04! coupon (assuming a pack exists - admins can update free_pack_id later)
INSERT INTO public.coupons (
  code,
  discount_type,
  discount_value,
  free_pack_id,
  max_uses,
  description,
  minimum_purchase_cents
) VALUES (
  'WELCOME04!',
  'free_pack',
  NULL,
  NULL, -- Admin should update this with actual pack ID
  NULL, -- Unlimited uses for welcome code
  'Welcome bonus - Free Power Pack for new users',
  0
);

-- Create index for faster coupon lookups
CREATE INDEX idx_coupons_code ON public.coupons(UPPER(code)) WHERE is_active = true;