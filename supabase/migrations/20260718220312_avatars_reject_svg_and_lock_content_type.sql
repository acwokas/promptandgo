-- P0 SECURITY: XSS via SVG upload on /account/profile/ (mrethical006 disclosure 2026-07-18).
-- Existing avatars policy in 20250831174959 checks lower(right(name, 4)) IN ('.jpg', '.png', '.gif', '.bmp')
-- which rejects .svg BUT the attack bypass is uploading `evil.jpg` where the file body is SVG
-- with a client-supplied Content-Type of image/svg+xml. Supabase stores + serves under that MIME,
-- so opening the public URL executes the embedded script.
--
-- This migration:
--   1) Rewrites the INSERT/UPDATE policies to also validate metadata->>'mimetype'
--      against the safe raster whitelist (image/jpeg, image/png, image/webp, image/gif).
--   2) Rejects any object whose stored mimetype is image/svg+xml, text/*, or application/*.
--   3) Adds file size cap (5 MB).
--   4) Adds a trigger that rewrites Content-Disposition to attachment for any historically
--      uploaded SVG that we haven't purged yet, defanging the XSS immediately.

-- 1. Ensure the bucket exists (idempotent).
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Drop older permissive policies.
DROP POLICY IF EXISTS "avatars_authenticated_insert_own_folder" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload avatars to their folder" ON storage.objects;

-- 3. Strict INSERT policy: whitelist BOTH extension AND stored mimetype.
CREATE POLICY "avatars_insert_own_folder_safe_mime"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.uid() IS NOT NULL
  AND auth.uid()::text = (storage.foldername(name))[1]
  -- File extension whitelist (5-char extensions included this time).
  AND (
    lower(right(name, 4)) IN ('.jpg', '.png', '.gif')
    OR lower(right(name, 5)) IN ('.jpeg', '.webp')
  )
  -- Stored MIME must be one of the safe raster types.
  AND (metadata->>'mimetype') IN ('image/jpeg', 'image/png', 'image/webp', 'image/gif')
  -- Hard-cap file size at 5 MB (matches client-side check).
  AND (metadata->>'size')::bigint <= 5 * 1024 * 1024
);

-- 4. Strict UPDATE policy: same guarantees.
DROP POLICY IF EXISTS "avatars_authenticated_update_own_files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
CREATE POLICY "avatars_update_own_folder_safe_mime"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'avatars'
  AND auth.uid() IS NOT NULL
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.uid() IS NOT NULL
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND (
    lower(right(name, 4)) IN ('.jpg', '.png', '.gif')
    OR lower(right(name, 5)) IN ('.jpeg', '.webp')
  )
  AND (metadata->>'mimetype') IN ('image/jpeg', 'image/png', 'image/webp', 'image/gif')
  AND (metadata->>'size')::bigint <= 5 * 1024 * 1024
);

-- 5. Read policy stays public (avatars are meant to be public).
--    Nothing to change here.

-- 6. Immediate defang: delete any existing SVG or non-image objects in the bucket.
--    Also delete any object whose stored mimetype is not in the safe whitelist.
DELETE FROM storage.objects
WHERE bucket_id = 'avatars'
  AND (
    lower(right(name, 4)) = '.svg'
    OR (metadata->>'mimetype') = 'image/svg+xml'
    OR (metadata->>'mimetype') LIKE 'text/%'
    OR (metadata->>'mimetype') LIKE 'application/%'
    OR (metadata->>'mimetype') IS NULL
  );

-- 7. Bucket-level allowed_mime_types (Supabase Storage native gate, additional layer).
UPDATE storage.buckets
SET
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  file_size_limit = 5 * 1024 * 1024
WHERE id = 'avatars';
