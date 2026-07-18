-- P0 SECURITY FIX: stored XSS via SVG/polyglot avatar upload
--
-- Prior policy only checked the filename suffix (right(name,4) IN ('.jpg','.png','.gif','.bmp')),
-- not the actual file content or declared content-type. An attacker could upload an SVG
-- (which can embed <script>) simply by naming it "payload.png" and it would pass this check,
-- then be served back with an image content-type that browsers will still parse as SVG/XML
-- for certain request paths, or via a crafted Content-Type at request time.
--
-- Fix: revoke direct client INSERT/UPDATE on the avatars bucket entirely. All uploads must
-- now go through the upload-avatar Edge Function (service_role), which performs real
-- magic-byte content sniffing before writing to storage. DELETE stays available to the
-- owning user (harmless — removing your own file cannot introduce XSS).

DROP POLICY IF EXISTS "avatars_authenticated_insert_own_folder" ON storage.objects;
DROP POLICY IF EXISTS "avatars_authenticated_update_own_files" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;

CREATE POLICY "avatars_service_role_insert"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND (auth.jwt() ->> 'role'::text) = 'service_role'::text
);

CREATE POLICY "avatars_service_role_update"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'avatars'
  AND (auth.jwt() ->> 'role'::text) = 'service_role'::text
)
WITH CHECK (
  bucket_id = 'avatars'
  AND (auth.jwt() ->> 'role'::text) = 'service_role'::text
);

COMMENT ON POLICY "avatars_service_role_insert" ON storage.objects IS 'SECURITY: avatar uploads must go through the upload-avatar Edge Function (content-sniffed), not direct client writes';
COMMENT ON POLICY "avatars_service_role_update" ON storage.objects IS 'SECURITY: avatar uploads must go through the upload-avatar Edge Function (content-sniffed), not direct client writes';
