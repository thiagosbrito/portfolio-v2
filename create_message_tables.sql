-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  thread_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create message_replies table
CREATE TABLE IF NOT EXISTS public.message_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  reply_text TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  thread_id TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Foreign key to the original message
  CONSTRAINT fk_message FOREIGN KEY (message_id) REFERENCES public.messages(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_messages_thread_id ON public.messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_messages_read ON public.messages(read);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);
CREATE INDEX IF NOT EXISTS idx_message_replies_message_id ON public.message_replies(message_id);
CREATE INDEX IF NOT EXISTS idx_message_replies_thread_id ON public.message_replies(thread_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_replies ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first to avoid errors (these will fail silently if policies don't exist)
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