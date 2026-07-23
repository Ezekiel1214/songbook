
-- Storage: tighten story-images policies
DROP POLICY IF EXISTS "Story images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload story images" ON storage.objects;

CREATE POLICY "Authenticated users can upload to own folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'story-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Revoke EXECUTE on SECURITY DEFINER functions from public roles.
-- handle_new_user is invoked by trigger as table owner; direct exec not needed.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- increment_view_count is replaced by an edge function using service role.
REVOKE EXECUTE ON FUNCTION public.increment_view_count(uuid) FROM PUBLIC, anon, authenticated;
