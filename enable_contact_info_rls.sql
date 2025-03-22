-- Enable RLS on contact_info table
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to select contact info
CREATE POLICY "Allow anonymous users to select contact info"
  ON public.contact_info FOR SELECT
  USING (true);

-- Grant permissions explicitly
GRANT SELECT ON public.contact_info TO anon; 