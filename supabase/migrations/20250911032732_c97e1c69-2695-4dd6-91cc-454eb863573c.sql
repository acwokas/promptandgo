-- Create a function to fix orphaned subscriptions that bypasses encryption triggers
CREATE OR REPLACE FUNCTION fix_orphaned_subscriptions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Temporarily disable the trigger
  ALTER TABLE public.subscribers DISABLE TRIGGER enforce_subscriber_encryption_trigger;
  
  -- Update orphaned records
  UPDATE subscribers 
  SET user_id = auth_users.id 
  FROM auth.users auth_users 
  WHERE subscribers.user_id IS NULL 
    AND subscribers.subscribed = true 
    AND subscribers.email_hash = encode(digest(auth_users.email, 'sha256'), 'hex');
  
  -- Re-enable the trigger
  ALTER TABLE public.subscribers ENABLE TRIGGER enforce_subscriber_encryption_trigger;
END;
$$;

-- Execute the function
SELECT fix_orphaned_subscriptions();

-- Drop the function after use
DROP FUNCTION fix_orphaned_subscriptions();