-- ============================================================
-- Migration: Enhanced Journaling (Image Uploads)
-- ============================================================

-- 1. Add image_url column to journal_entries
ALTER TABLE public.journal_entries 
ADD COLUMN IF NOT EXISTS image_url text;

-- 2. Create the Storage Bucket for Journal Images
INSERT INTO storage.buckets (id, name, public)
VALUES ('journal_images', 'journal_images', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Set up RLS for the journal_images bucket
-- Allow authenticated users to upload their own images
CREATE POLICY "Users can upload their own journal images" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'journal_images' AND 
  auth.uid() = owner
);

-- Allow users to update/delete their own images
CREATE POLICY "Users can update their own journal images" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'journal_images' AND 
  auth.uid() = owner
);

CREATE POLICY "Users can delete their own journal images" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'journal_images' AND 
  auth.uid() = owner
);

-- Allow public read access to images (since they might be shared, or just to simplify client fetching)
-- Note: You can restrict this if privacy is a strict concern, but since journal entries are already
-- isolated by RLS, making the bucket public just simplifies the image URLs.
CREATE POLICY "Anyone can view journal images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'journal_images');
