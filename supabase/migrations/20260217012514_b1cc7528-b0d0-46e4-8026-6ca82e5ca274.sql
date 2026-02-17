
-- Create storage bucket for AI-generated story images
INSERT INTO storage.buckets (id, name, public) VALUES ('story-images', 'story-images', true);

-- Allow public read access to story images
CREATE POLICY "Story images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'story-images');

-- Allow anonymous uploads (edge function uses service role, but just in case)
CREATE POLICY "Anyone can upload story images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'story-images');
