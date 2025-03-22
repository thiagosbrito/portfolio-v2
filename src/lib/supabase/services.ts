import { supabase, isSupabaseAvailable } from './client';
import { AboutMe, ContactInfo, Education, Experience, Project, Skill } from '../types';

export async function getProjects(): Promise<Project[]> {
  if (!isSupabaseAvailable() || !supabase) {
    console.log('Supabase not configured, returning empty projects array');
    return [];
  }
  
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  if (!isSupabaseAvailable() || !supabase) {
    console.log('Supabase not configured, returning empty featured projects array');
    return [];
  }
  
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('featured', true)
      .order('display_order', { ascending: true });
    
    if (error) {
      console.error('Error fetching featured projects:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    return [];
  }
}

export async function getExperiences(): Promise<Experience[]> {
  if (!isSupabaseAvailable() || !supabase) {
    console.log('Supabase not configured, returning empty experiences array');
    return [];
  }
  
  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (error) {
      console.error('Error fetching experiences:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return [];
  }
}

export async function getSkills(): Promise<Skill[]> {
  if (!isSupabaseAvailable() || !supabase) {
    console.log('Supabase not configured, returning empty skills array');
    return [];
  }
  
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (error) {
      console.error('Error fetching skills:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching skills:', error);
    return [];
  }
}

export async function getEducation(): Promise<Education[]> {
  if (!isSupabaseAvailable() || !supabase) {
    console.log('Supabase not configured, returning empty education array');
    return [];
  }
  
  try {
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (error) {
      console.error('Error fetching education:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching education:', error);
    return [];
  }
}

export interface AboutMe {
  id: string;
  headline: string;
  bio: string;
  profile_image: string;
  social_links: {
    github?: string;
    linkedin?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface HomeContent {
  id: string;
  headline: string;
  sub_headline: string;
  welcome_text: string;
  profile_image: string;
  cta_text: string;
  cta_link: string;
  created_at: string;
  updated_at: string;
}

export async function getAboutMe(): Promise<AboutMe | null> {
  if (!supabase) {
    console.error('Supabase client not initialized');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('about_me')
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching about me data:', error);
    return null;
  }
}

export async function getHomeContent(): Promise<HomeContent | null> {
  if (!supabase) {
    console.error('Supabase client not initialized');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('home')
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching home content:', error);
    return null;
  }
}

export async function getContactInfo(): Promise<ContactInfo | null> {
  if (!isSupabaseAvailable() || !supabase) {
    console.log('Supabase not configured, returning null for contact info');
    return null;
  }
  
  try {
    const { data, error } = await supabase
      .from('contact_info')
      .select('*')
      .single();
    
    if (error) {
      console.error('Error fetching contact info:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return null;
  }
}

// Message types
export interface Message {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read?: boolean;
  created_at?: string;
  thread_id?: string; // For tracking email conversation threads
}

export interface MessageReply {
  message_id: string;
  reply_text: string;
  sender_email: string;
  recipient_email: string;
  subject: string;
  sent_at?: string;
}

// Get messages from Supabase
export async function getMessages(): Promise<Message[]> {
  if (!isSupabaseAvailable() || !supabase) {
    console.log('Supabase not configured, returning empty messages array');
    return [];
  }
  
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
}

// Save a new message to Supabase
export async function saveMessage(message: Message): Promise<{ success: boolean; id?: string; error?: string }> {
  if (!isSupabaseAvailable() || !supabase) {
    console.error('Supabase not configured, cannot save message');
    return { success: false, error: 'Supabase not configured' };
  }
  
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([
        { 
          name: message.name,
          email: message.email,
          subject: message.subject,
          message: message.message,
          read: false,
          // Generate a unique thread ID for new messages
          thread_id: `thread_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
        }
      ])
      .select();
    
    if (error) {
      console.error('Error saving message:', error);
      return { success: false, error: error.message };
    }
    
    // After saving to database, send a notification email
    await sendNewMessageNotification(data[0]);
    
    return { success: true, id: data?.[0]?.id };
  } catch (error) {
    console.error('Error saving message:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Save a reply to a message
export async function saveMessageReply(reply: MessageReply): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseAvailable() || !supabase) {
    console.error('Supabase not configured, cannot save reply');
    return { success: false, error: 'Supabase not configured' };
  }
  
  try {
    // First get the original message to get the thread_id
    const { data: messageData, error: messageError } = await supabase
      .from('messages')
      .select('thread_id')
      .eq('id', reply.message_id)
      .single();
    
    if (messageError) {
      console.error('Error getting original message:', messageError);
      return { success: false, error: messageError.message };
    }
    
    // Save the reply to the message_replies table
    const { error } = await supabase
      .from('message_replies')
      .insert([
        {
          message_id: reply.message_id,
          reply_text: reply.reply_text,
          sender_email: reply.sender_email,
          recipient_email: reply.recipient_email,
          subject: reply.subject,
          thread_id: messageData.thread_id
        }
      ]);
    
    if (error) {
      console.error('Error saving reply:', error);
      return { success: false, error: error.message };
    }
    
    // Mark the original message as read
    await supabase!
      .from('messages')
      .update({ read: true })
      .eq('id', reply.message_id);
    
    return { success: true };
  } catch (error) {
    console.error('Error saving reply:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Send an email notification when a new message is received
async function sendNewMessageNotification(message: Message) {
  // This would normally call an API route to send an email
  // We'll implement this in the next step with the API route
  console.log('Would send email notification for new message:', message);
  
  // In a real implementation, you would make an API call like:
  try {
    const response = await fetch('/api/email/new-message-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to send notification email');
    }
    
    return true;
  } catch (error) {
    console.error('Error sending notification email:', error);
    return false;
  }
}

// Process an email reply and save it to the database
export async function processEmailReply(emailData: Record<string, unknown>): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseAvailable() || !supabase) {
    console.error('Supabase not configured, cannot process email reply');
    return { success: false, error: 'Supabase not configured' };
  }
  
  try {
    console.log('Processing email reply:', JSON.stringify(emailData));
    
    // Extract thread ID from email subject, headers, or other fields
    const threadId = extractThreadIdFromEmail(emailData);
    
    if (!threadId) {
      console.error('Could not extract thread ID from email:', JSON.stringify(emailData));
      return { success: false, error: 'Could not extract thread ID from email' };
    }
    
    console.log('Extracted thread ID:', threadId);
    
    // Find the original message by thread ID
    const { data: messageData, error: messageError } = await supabase
      .from('messages')
      .select('id, email, subject')
      .eq('thread_id', threadId)
      .single();
    
    if (messageError) {
      console.error('Error finding original message:', messageError);
      return { success: false, error: `Error finding original message: ${messageError.message}` };
    }
    
    if (!messageData) {
      console.error('No message found with thread ID:', threadId);
      return { success: false, error: `No message found with thread ID: ${threadId}` };
    }
    
    // Get the reply text - prefer text over HTML for simplicity
    const replyText = String(emailData.text || extractTextFromHtml(emailData.html as string) || '');
    
    if (!replyText.trim()) {
      console.error('No reply text found in email');
      return { success: false, error: 'No reply text found in email' };
    }
    
    // Create a reply object
    const reply: MessageReply = {
      message_id: messageData.id,
      reply_text: replyText,
      sender_email: 'brito.dev@outlook.com', // Your email
      recipient_email: messageData.email,
      subject: `Re: ${messageData.subject}`
    };
    
    console.log('Saving reply:', JSON.stringify(reply));
    
    // Save the reply to the database
    return await saveMessageReply(reply);
  } catch (error) {
    console.error('Error processing email reply:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error processing email reply' 
    };
  }
}

// Helper function to extract thread ID from email
function extractThreadIdFromEmail(emailData: Record<string, unknown>): string | null {
  // Try multiple extraction methods to find a thread ID
  
  // 1. Look for thread ID in subject - [thread_123456789]
  const subject = String(emailData.subject || '');
  const subjectMatch = subject.match(/\[(thread_[a-zA-Z0-9_]+)\]/);
  if (subjectMatch && subjectMatch[1]) {
    return subjectMatch[1];
  }
  
  // 2. Look for thread ID in custom headers
  const headers = emailData.headers as Record<string, string> | undefined;
  if (headers) {
    // Check X-Thread-ID header
    if (headers['X-Thread-ID']) {
      return headers['X-Thread-ID'];
    }
    
    // Check References header which might contain the thread ID
    if (headers['References'] && headers['References'].includes('thread_')) {
      const referencesMatch = headers['References'].match(/thread_[a-zA-Z0-9_]+/);
      if (referencesMatch) {
        return referencesMatch[0];
      }
    }
  }
  
  // 3. Look in the threadId field (some email services extract this)
  if (emailData.threadId) {
    return String(emailData.threadId);
  }
  
  // 4. Search in the email body for the thread ID pattern
  const body = String(emailData.text || emailData.html || '');
  const bodyMatch = body.match(/thread_[a-zA-Z0-9_]+/);
  if (bodyMatch) {
    return bodyMatch[0];
  }
  
  // No thread ID found
  return null;
}

// Helper function to extract text from HTML
function extractTextFromHtml(html: string | undefined): string {
  if (!html) return '';
  
  // Very simple HTML to text conversion
  // Remove HTML tags
  return html
    .replace(/<[^>]*>/g, ' ')  // Replace tags with space
    .replace(/\s+/g, ' ')      // Replace multiple spaces with single space
    .trim();                   // Trim whitespace
} 