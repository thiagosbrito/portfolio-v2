import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body to get the message details
    const { message } = await request.json();

    // Validate the message
    if (!message || !message.email || !message.name || !message.subject || !message.message) {
      return NextResponse.json(
        { error: 'Missing required message fields' },
        { status: 400 }
      );
    }

    // For now, just return success as we're not sending emails
    return NextResponse.json({ success: true }, { status: 200 });
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