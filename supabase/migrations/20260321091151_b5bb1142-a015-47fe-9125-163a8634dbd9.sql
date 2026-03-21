-- Create storage bucket for media uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('media-uploads', 'media-uploads', true);

-- Allow authenticated users with admin/editor role to upload
CREATE POLICY "Admins/editors can upload media" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'media-uploads'
    AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  );

CREATE POLICY "Admins/editors can update media" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'media-uploads'
    AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  );

CREATE POLICY "Admins/editors can delete media" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'media-uploads'
    AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  );

CREATE POLICY "Public can read media" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'media-uploads');