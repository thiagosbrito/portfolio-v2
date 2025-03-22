import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check for required fields
    const { to, subject, body: emailBody, threadId } = body;
    
    if (!to || !subject || !emailBody) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // For now, just return success as we're not sending emails
    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing message:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process message', 
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 