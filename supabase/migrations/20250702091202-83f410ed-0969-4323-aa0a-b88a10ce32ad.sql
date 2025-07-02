-- Add file upload columns to group_messages table
ALTER TABLE public.group_messages 
ADD COLUMN file_url TEXT,
ADD COLUMN file_type TEXT,
ADD COLUMN file_name TEXT;

-- Create storage bucket for chat files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('chat-files', 'chat-files', true);

-- Create storage policies for chat files
CREATE POLICY "Users can view chat files"
ON storage.objects FOR SELECT
USING (bucket_id = 'chat-files');

CREATE POLICY "Authenticated users can upload chat files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'chat-files' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own chat files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'chat-files' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own chat files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'chat-files' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);