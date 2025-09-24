-- SECURITY FIX: Add encryption to pending_contacts table for PII protection
-- Add encrypted fields for sensitive contact data
ALTER TABLE public.pending_contacts 
ADD COLUMN name_enc bytea,
ADD COLUMN email_enc bytea,
ADD COLUMN message_enc bytea,
ADD COLUMN email_hash text;

-- Create secure function for inserting encrypted contact data
CREATE OR REPLACE FUNCTION public.secure_insert_contact(
  p_key text,
  p_name text,
  p_email text,
  p_message text,
  p_newsletter_opt_in boolean DEFAULT false
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_id uuid;
  confirmation_token text;
BEGIN
  -- Enable pgcrypto extension if not exists
  CREATE EXTENSION IF NOT EXISTS pgcrypto;
  
  -- Generate confirmation token
  confirmation_token := encode(gen_random_bytes(32), 'hex');
  new_id := gen_random_uuid();
  
  INSERT INTO public.pending_contacts (
    id,
    name,
    email,
    message,
    newsletter_opt_in,
    confirmation_token,
    confirmed,
    processed,
    created_at,
    updated_at,
    name_enc,
    email_enc,
    message_enc,
    email_hash
  ) VALUES (
    new_id,
    '[encrypted]',
    '[encrypted]',
    '[encrypted]',
    p_newsletter_opt_in,
    confirmation_token,
    false,
    false,
    now(),
    now(),
    pgp_sym_encrypt(p_name, p_key),
    pgp_sym_encrypt(p_email, p_key),
    pgp_sym_encrypt(p_message, p_key),
    encode(digest(p_email, 'sha256'), 'hex')
  );
  
  RETURN new_id;
END;
$$;

-- Create secure decryption function for admin access
CREATE OR REPLACE FUNCTION public.get_decrypted_contact(
  p_contact_id uuid,
  p_key text
) RETURNS TABLE(
  id uuid,
  name text,
  email text,
  message text,
  newsletter_opt_in boolean,
  confirmed boolean,
  processed boolean,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only allow admin access
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied: admin role required';
  END IF;
  
  RETURN QUERY
  SELECT 
    pc.id,
    COALESCE(pgp_sym_decrypt(pc.name_enc, p_key), pc.name) as name,
    COALESCE(pgp_sym_decrypt(pc.email_enc, p_key), pc.email) as email,
    COALESCE(pgp_sym_decrypt(pc.message_enc, p_key), pc.message) as message,
    pc.newsletter_opt_in,
    pc.confirmed,
    pc.processed,
    pc.created_at
  FROM public.pending_contacts pc
  WHERE pc.id = p_contact_id;
END;
$$;

-- Add encryption enforcement trigger
CREATE OR REPLACE FUNCTION public.enforce_contact_encryption()
RETURNS trigger AS $$
BEGIN
  -- Prevent insertion of plaintext sensitive data (except by secure function)
  IF NEW.name IS NOT NULL AND NEW.name != '[encrypted]' AND NEW.name != '' THEN
    RAISE EXCEPTION 'Direct contact data insertion not allowed. Use secure_insert_contact function.';
  END IF;
  
  IF NEW.email IS NOT NULL AND NEW.email != '[encrypted]' AND NEW.email != '' THEN
    RAISE EXCEPTION 'Direct contact data insertion not allowed. Use secure_insert_contact function.';
  END IF;
  
  IF NEW.message IS NOT NULL AND NEW.message != '[encrypted]' AND NEW.message != '' THEN
    RAISE EXCEPTION 'Direct contact data insertion not allowed. Use secure_insert_contact function.';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_contact_encryption_trigger
  BEFORE INSERT OR UPDATE ON public.pending_contacts
  FOR EACH ROW EXECUTE FUNCTION public.enforce_contact_encryption();

-- Migrate existing data to encrypted format (if any exists)
-- Note: This requires the SUBSCRIBERS_ENCRYPTION_KEY to be available
DO $$
DECLARE
  encryption_key text;
  contact_record record;
BEGIN
  -- This will only work if the encryption key is available
  -- In production, this migration should be run separately with proper key management
  encryption_key := current_setting('app.encryption_key', true);
  
  IF encryption_key IS NOT NULL AND encryption_key != '' THEN
    FOR contact_record IN 
      SELECT id, name, email, message 
      FROM public.pending_contacts 
      WHERE name_enc IS NULL 
        AND (name IS NOT NULL AND name != '[encrypted]')
    LOOP
      UPDATE public.pending_contacts 
      SET 
        name_enc = pgp_sym_encrypt(contact_record.name, encryption_key),
        email_enc = pgp_sym_encrypt(contact_record.email, encryption_key),
        message_enc = pgp_sym_encrypt(contact_record.message, encryption_key),
        email_hash = encode(digest(contact_record.email, 'sha256'), 'hex'),
        name = '[encrypted]',
        email = '[encrypted]',
        message = '[encrypted]'
      WHERE id = contact_record.id;
    END LOOP;
  END IF;
END $$;