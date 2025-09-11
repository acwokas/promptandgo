-- Fix orphaned subscription records by linking them to users with matching emails
UPDATE subscribers 
SET user_id = auth_users.id 
FROM auth.users auth_users 
WHERE subscribers.user_id IS NULL 
  AND subscribers.subscribed = true 
  AND subscribers.email_hash = encode(digest(auth_users.email, 'sha256'), 'hex');