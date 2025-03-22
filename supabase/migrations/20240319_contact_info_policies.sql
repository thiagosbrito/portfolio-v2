-- Enable RLS on contact_info table
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to select contact info
CREATE POLICY "Allow anonymous users to select contact info"
  ON public.contact_info FOR SELECT
  USING (true);

-- Allow authenticated users to manage contact info
CREATE POLICY "Allow authenticated users to insert contact info"
  ON public.contact_info FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update contact info"
  ON public.contact_info FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete contact info"
  ON public.contact_info FOR DELETE
  USING (auth.role() = 'authenticated');

-- Grant permissions explicitly
GRANT SELECT ON public.contact_info TO anon;
GRANT ALL ON public.contact_info TO authenticated;
GRANT ALL ON public.contact_info TO service_role; 