import { NextRequest, NextResponse } from 'next/server';
import { processEmailReply } from '@/lib/supabase/services';

// This endpoint will be called by a service that forwards emails to your webhook
// You can use services like Zapier, Make (Integromat), Pipedream, or EmailWebhook
export async function POST(request: NextRequest) {
  try {
    // Get the email data from the request
    const emailData = await request.json();
    console.log('Received webhook data:', JSON.stringify(emailData));

    // Basic validation to ensure the data contains required email content
    if (!emailData) {
      return NextResponse.json(
        { error: 'Missing email data' },
        { status: 400 }
      );
    }

    // Different email forwarding services send data in different formats
    // Here we normalize the data structure
    const normalizedEmailData = {
      // Try to extract the text content from various possible locations
      text: emailData.text || emailData.body?.text || emailData.content?.text || emailData.plain || '',
      
      // Try to extract HTML content from various possible locations
      html: emailData.html || emailData.body?.html || emailData.content?.html || '',
      
      // Extract the subject from various possible locations
      subject: emailData.subject || emailData.headers?.subject || '',
      
      // Extract from header or dedicated fields
      from: emailData.from || emailData.sender || emailData.headers?.from || '',
      
      // Extract email headers if available
      headers: emailData.headers || {},
      
      // Some services provide these directly
      threadId: emailData.threadId || emailData.thread_id || null,
      
      // Raw data for debugging
      raw: emailData
    };

    // Log normalized data for debugging
    console.log('Normalized email data:', JSON.stringify(normalizedEmailData));

    // Validate that we have minimal required data
    if ((!normalizedEmailData.text && !normalizedEmailData.html) || !normalizedEmailData.subject) {
      return NextResponse.json(
        { error: 'Invalid email data: missing content or subject' },
        { status: 400 }
      );
    }

    // Process the email reply (save to database)
    const result = await processEmailReply(normalizedEmailData);

    if (result.success) {
      return NextResponse.json(
        { success: true, message: 'Email reply processed successfully' },
        { status: 200 }
      );
    } else {
      console.error('Failed to process email:', result.error);
      return NextResponse.json(
        { error: 'Failed to process email reply', details: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to process incoming email', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}

// GET method for webhook verification (if needed by your email forwarding service)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const verificationToken = searchParams.get('verify');
  
  // Check if it's a verification request from your email service
  if (verificationToken) {
    // Verify the token against your expected value
    const expectedToken = process.env.EMAIL_WEBHOOK_VERIFY_TOKEN;
    
    if (verificationToken === expectedToken) {
      return NextResponse.json({ status: 'verified' }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Invalid verification token' }, { status: 401 });
    }
  }
  
  // Default response for GET requests
  return NextResponse.json(
    { message: 'This is the email webhook endpoint. Use POST to submit email data.' },
    { status: 200 }
  );
} 