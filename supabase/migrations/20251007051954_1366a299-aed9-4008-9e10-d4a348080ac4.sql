-- Enforce encryption on subscribers table to prevent plaintext storage of sensitive data
-- This addresses: "Payment Customer IDs Could Enable Fraud"

-- Drop the old enforcement function with CASCADE to remove all dependent triggers
DROP FUNCTION IF EXISTS public.enforce_subscriber_encryption() CASCADE;

-- Create a stricter encryption enforcement function
CREATE OR REPLACE FUNCTION public.enforce_subscriber_encryption()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- CRITICAL: Block any attempt to store plaintext emails (except the placeholder)
  IF NEW.email IS NOT NULL AND NEW.email != '[encrypted]' AND NEW.email != '' THEN
    RAISE EXCEPTION 'SECURITY VIOLATION: Plaintext email storage is prohibited. Use secure_upsert_subscriber() function with encryption key.';
  END IF;
  
  -- CRITICAL: Block any attempt to store plaintext Stripe customer IDs
  IF NEW.stripe_customer_id IS NOT NULL AND NEW.stripe_customer_id != '' THEN
    RAISE EXCEPTION 'SECURITY VIOLATION: Plaintext stripe_customer_id storage is prohibited. Use secure_upsert_subscriber() function with encryption key.';
  END IF;
  
  -- Ensure encrypted fields exist when email or stripe data should be present
  IF (NEW.email = '[encrypted]' OR NEW.email_hash IS NOT NULL) AND NEW.email_enc IS NULL THEN
    RAISE EXCEPTION 'SECURITY VIOLATION: email_enc must be populated when storing subscriber email data.';
  END IF;
  
  -- Log any attempts to access subscriber data for security audit
  IF TG_OP = 'UPDATE' OR TG_OP = 'INSERT' THEN
    PERFORM log_security_event(
      'SUBSCRIBER_DATA_MODIFICATION',
      'INFO',
      'Subscriber record modified for user_id: ' || COALESCE(NEW.user_id::text, 'NULL'),
      jsonb_build_object(
        'operation', TG_OP,
        'has_email_enc', (NEW.email_enc IS NOT NULL),
        'has_stripe_enc', (NEW.stripe_customer_id_enc IS NOT NULL),
        'caller_role', auth.role()
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create the trigger to enforce encryption on all INSERT and UPDATE operations
CREATE TRIGGER enforce_subscriber_encryption_trigger
BEFORE INSERT OR UPDATE ON public.subscribers
FOR EACH ROW
EXECUTE FUNCTION public.enforce_subscriber_encryption();

-- Update the table comment to reflect the strict security requirements
COMMENT ON TABLE public.subscribers IS 'CRITICAL SECURITY: This table stores sensitive payment and customer data. All email and Stripe customer ID data MUST be encrypted using the secure_upsert_subscriber() function. Direct INSERT/UPDATE operations with plaintext data are blocked by trigger. Service role can insert/update only via secure_upsert_subscriber().';

-- Add column comments for clarity
COMMENT ON COLUMN public.subscribers.email IS 'DEPRECATED: Must always be "[encrypted]" or empty. Use email_enc for actual data.';
COMMENT ON COLUMN public.subscribers.stripe_customer_id IS 'DEPRECATED: Must always be NULL or empty. Use stripe_customer_id_enc for actual data.';
COMMENT ON COLUMN public.subscribers.email_enc IS 'Encrypted email address (bytea). Decrypt only via get_admin_subscriber_data() with proper encryption key.';
COMMENT ON COLUMN public.subscribers.stripe_customer_id_enc IS 'Encrypted Stripe customer ID (bytea). Decrypt only via get_admin_subscriber_data() with proper encryption key.';
COMMENT ON COLUMN public.subscribers.email_hash IS 'SHA-256 hash of email for lookups without exposing plaintext.';

-- Update the secure_upsert_subscriber function comment
COMMENT ON FUNCTION public.secure_upsert_subscriber(text, uuid, text, text, boolean, text, timestamp with time zone) IS 'ONLY SECURE METHOD to insert/update subscriber data. Encrypts email and stripe_customer_id before storage. Requires SUBSCRIBERS_ENCRYPTION_KEY.';