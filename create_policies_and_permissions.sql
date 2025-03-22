-- Enable Row Level Security (RLS)
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_replies ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first to avoid errors
DROP POLICY IF EXISTS "Allow authenticated users to select messages" ON public.messages;
DROP POLICY IF EXISTS "Allow authenticated users to insert messages" ON public.messages;
DROP POLICY IF EXISTS "Allow authenticated users to update messages" ON public.messages;
DROP POLICY IF EXISTS "Allow authenticated users to delete messages" ON public.messages;
DROP POLICY IF EXISTS "Allow authenticated users to select message replies" ON public.message_replies;
DROP POLICY IF EXISTS "Allow authenticated users to insert message replies" ON public.message_replies;
DROP POLICY IF EXISTS "Allow anonymous users to insert messages" ON public.messages;

-- Create policies for authenticated users
CREATE POLICY "Allow authenticated users to select messages"
  ON public.messages FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert messages"
  ON public.messages FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update messages"
  ON public.messages FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete messages"
  ON public.messages FOR DELETE
  USING (auth.role() = 'authenticated');

-- Policies for message replies
CREATE POLICY "Allow authenticated users to select message replies"
  ON public.message_replies FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert message replies"
  ON public.message_replies FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Allow anonymous users to insert messages (for contact form)
CREATE POLICY "Allow anonymous users to insert messages"
  ON public.messages FOR INSERT
  WITH CHECK (true);

-- Grant permissions explicitly
GRANT SELECT, INSERT ON public.messages TO anon;
GRANT SELECT, INSERT ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;

GRANT SELECT, INSERT ON public.message_replies TO authenticated;
GRANT ALL ON public.message_replies TO service_role; 