-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policies for viewing files (public access)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id IN ('home', 'projects', 'about-me', 'resume'));

-- Create policies for uploading files (authenticated users only)
CREATE POLICY "Authenticated Insert"
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK (bucket_id IN ('home', 'projects', 'about-me', 'resume'));

-- Create policies for updating files (authenticated users only)
CREATE POLICY "Authenticated Update"
ON storage.objects FOR UPDATE 
TO authenticated
USING (bucket_id IN ('home', 'projects', 'about-me', 'resume'));

-- Create policies for deleting files (authenticated users only)
CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE 
TO authenticated
USING (bucket_id IN ('home', 'projects', 'about-me', 'resume')); 