
ALTER TABLE public.stories ADD COLUMN view_count integer NOT NULL DEFAULT 0;

CREATE OR REPLACE FUNCTION public.increment_view_count(story_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.stories SET view_count = view_count + 1 WHERE id = story_id AND is_public = true;
$$;
