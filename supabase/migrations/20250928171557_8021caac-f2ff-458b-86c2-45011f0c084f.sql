-- SECURITY FIX PART 2: Fix trigger syntax and complete migration

-- Step 1: Create secure contact validation trigger (fixed syntax)
CREATE OR REPLACE FUNCTION public.secure_contact_validation()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure only encrypted data is being inserted
  IF NEW.name != '[encrypted]' OR NEW.email != '[encrypted]' OR NEW.message != '[encrypted]' THEN
    RAISE EXCEPTION 'Contact data must be encrypted using secure_insert_contact function';
  END IF;
  
  -- Ensure encrypted fields are populated
  IF NEW.name_enc IS NULL OR NEW.email_enc IS NULL OR NEW.message_enc IS NULL THEN
    RAISE EXCEPTION 'Encrypted contact data is required';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 2: Create trigger to enforce secure contact insertion
DROP TRIGGER IF EXISTS enforce_secure_contact_insertion ON public.pending_contacts;
CREATE TRIGGER enforce_secure_contact_insertion
    BEFORE INSERT ON public.pending_contacts
    FOR EACH ROW EXECUTE FUNCTION public.secure_contact_validation();

-- Step 3: Create a secure contact confirmation function that doesn't expose plaintext
CREATE OR REPLACE FUNCTION public.confirm_contact_secure(p_token text, p_encryption_key text)
RETURNS TABLE(
    contact_id uuid,
    name text, 
    email text, 
    message text, 
    newsletter_opt_in boolean,
    created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    contact_record record;
BEGIN
    -- Only allow service role to call this function
    IF auth.role() != 'service_role' THEN
        RAISE EXCEPTION 'Access denied: service role required';
    END IF;
    
    -- Validate token format
    IF p_token IS NULL OR length(p_token) < 10 THEN
        RAISE EXCEPTION 'Invalid token format';
    END IF;
    
    -- Find the contact record
    SELECT * INTO contact_record
    FROM public.pending_contacts
    WHERE confirmation_token = p_token
      AND confirmed = false
      AND processed = false
      AND created_at > (now() - interval '24 hours');
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Contact not found or expired';
    END IF;
    
    -- Mark as confirmed and processed
    UPDATE public.pending_contacts
    SET confirmed = true,
        processed = true,
        updated_at = now()
    WHERE id = contact_record.id;
    
    -- Return decrypted data
    RETURN QUERY SELECT
        contact_record.id,
        COALESCE(extensions.pgp_sym_decrypt(contact_record.name_enc, p_encryption_key), '[decryption_failed]'),
        COALESCE(extensions.pgp_sym_decrypt(contact_record.email_enc, p_encryption_key), '[decryption_failed]'),
        COALESCE(extensions.pgp_sym_decrypt(contact_record.message_enc, p_encryption_key), '[decryption_failed]'),
        contact_record.newsletter_opt_in,
        contact_record.created_at;
END;
$$;

-- Step 4: Create function to safely retrieve pending contacts for admin (encrypted access only)
CREATE OR REPLACE FUNCTION public.get_pending_contacts_admin(p_encryption_key text)
RETURNS TABLE(
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
SET search_path = public
AS $$
BEGIN
    -- Only allow admin users
    IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
        RAISE EXCEPTION 'Access denied: admin role required';
    END IF;
    
    -- Log the access
    PERFORM public.log_data_access('ADMIN_DECRYPT_CONTACTS', 'pending_contacts');
    
    -- Return decrypted data for all contacts
    RETURN QUERY
    SELECT 
        pc.id,
        CASE 
            WHEN pc.name_enc IS NOT NULL THEN 
                COALESCE(extensions.pgp_sym_decrypt(pc.name_enc, p_encryption_key), '[decryption_failed]')
            ELSE pc.name
        END,
        CASE 
            WHEN pc.email_enc IS NOT NULL THEN 
                COALESCE(extensions.pgp_sym_decrypt(pc.email_enc, p_encryption_key), '[decryption_failed]')
            ELSE pc.email
        END,
        CASE 
            WHEN pc.message_enc IS NOT NULL THEN 
                COALESCE(extensions.pgp_sym_decrypt(pc.message_enc, p_encryption_key), '[decryption_failed]')
            ELSE pc.message
        END,
        pc.newsletter_opt_in,
        pc.confirmed,
        pc.processed,
        pc.created_at
    FROM public.pending_contacts pc
    ORDER BY pc.created_at DESC;
END;
$$;

-- Step 5: Add audit logging for contact data modifications (not selects)
CREATE OR REPLACE FUNCTION public.log_contact_modifications()
RETURNS TRIGGER AS $$
BEGIN
    -- Log any modification to the pending_contacts table
    INSERT INTO public.security_audit_log (
        user_id,
        action,
        table_name,
        record_id,
        created_at
    ) VALUES (
        auth.uid(),
        TG_OP || '_CONTACT_DATA',
        'pending_contacts',
        COALESCE(NEW.id, OLD.id),
        now()
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS audit_contact_modifications ON public.pending_contacts;
CREATE TRIGGER audit_contact_modifications
    AFTER INSERT OR UPDATE OR DELETE ON public.pending_contacts
    FOR EACH ROW EXECUTE FUNCTION public.log_contact_modifications();