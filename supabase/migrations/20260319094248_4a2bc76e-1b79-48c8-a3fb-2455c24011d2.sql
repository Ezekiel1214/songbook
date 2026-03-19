
ALTER TABLE public.stories ADD COLUMN is_public boolean NOT NULL DEFAULT false;

CREATE POLICY "Anyone can view public stories"
ON public.stories
FOR SELECT
TO anon, authenticated
USING (is_public = true);
