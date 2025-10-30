import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { Session, Message } from '@/lib/models';

export async function GET(request, { params }) {
  try {
    const { sessionId } = params;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Find the session
    const session = await Session.findOne({ sessionId });

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Get all messages for this session
    const messages = await Message.find({ 
      sessionId 
    }).sort({ timestamp: 1 });

    // Format the response
    const sessionDetails = {
      sessionId: session.sessionId,
      encryptedIp: session.encryptedIp,
      browser: session.browser,
      device: session.device,
      location: session.location,
      startTime: session.startTime,
      endTime: session.endTime,
      duration: session.duration,
      questionCount: session.questionCount,
      conversation: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp
      }))
    };

    return NextResponse.json(sessionDetails);
  } catch (error) {
    console.error('Error fetching session details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch session details' },
      { status: 500 }
    );
  }
}
