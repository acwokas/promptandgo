-- Enable pgcrypto for encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Add encrypted columns and hash
ALTER TABLE public.subscribers
  ADD COLUMN IF NOT EXISTS email_enc BYTEA,
  ADD COLUMN IF NOT EXISTS stripe_customer_id_enc BYTEA,
  ADD COLUMN IF NOT EXISTS email_hash TEXT;

-- Unique index on email_hash for optional deduplication by email
CREATE UNIQUE INDEX IF NOT EXISTS subscribers_email_hash_key ON public.subscribers (email_hash);

-- Secure upsert function to write encrypted fields
CREATE OR REPLACE FUNCTION public.secure_upsert_subscriber(
  p_key TEXT,
  p_user_id UUID,
  p_email TEXT,
  p_stripe_customer_id TEXT,
  p_subscribed BOOLEAN,
  p_subscription_tier TEXT,
  p_subscription_end TIMESTAMPTZ
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.subscribers (
    user_id,
    email,
    stripe_customer_id,
    subscribed,
    subscription_tier,
    subscription_end,
    updated_at,
    email_enc,
    stripe_customer_id_enc,
    email_hash
  ) VALUES (
    p_user_id,
    '[encrypted]',
    NULL,
    p_subscribed,
    p_subscription_tier,
    p_subscription_end,
    now(),
    pgp_sym_encrypt(coalesce(p_email, ''), p_key),
    CASE WHEN p_stripe_customer_id IS NULL THEN NULL ELSE pgp_sym_encrypt(p_stripe_customer_id, p_key) END,
    CASE WHEN p_email IS NULL THEN NULL ELSE encode(digest(p_email, 'sha256'), 'hex') END
  )
  ON CONFLICT (user_id) DO UPDATE SET
    subscribed = EXCLUDED.subscribed,
    subscription_tier = EXCLUDED.subscription_tier,
    subscription_end = EXCLUDED.subscription_end,
    updated_at = now(),
    email_enc = EXCLUDED.email_enc,
    stripe_customer_id_enc = EXCLUDED.stripe_customer_id_enc,
    email_hash = EXCLUDED.email_hash;
END;
$$;

-- Allow authenticated (JWT) to call if needed (edge functions use service role regardless)
GRANT EXECUTE ON FUNCTION public.secure_upsert_subscriber(TEXT, UUID, TEXT, TEXT, BOOLEAN, TEXT, TIMESTAMPTZ) TO authenticated;