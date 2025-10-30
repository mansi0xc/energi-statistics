import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { User, Session, Message } from '@/lib/models';
import { calculateDuration } from '@/lib/utils';

export async function POST(request) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Skip processing for local sessions
    if (sessionId.startsWith('local-')) {
      return NextResponse.json({
        message: 'Local session ended (no data saved)',
        duration: 0,
        questionCount: 0
      });
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

    // Get message count (questions asked by the user)
    const messageCount = await Message.countDocuments({
      sessionId,
      role: 'user'
    });

    // Update session with end time and question count
    const endTime = new Date();
    const duration = calculateDuration(session.startTime, endTime);

    // Update session with end time and question count
    await Session.updateOne(
      { sessionId },
      {
        endTime,
        duration,
        questionCount: messageCount
      }
    );

    // Update user's statistics
    const user = await User.findOne({ encryptedIp: session.encryptedIp });
    if (user) {
      user.totalQuestions += messageCount;
      user.totalSessionDuration += duration;
      await user.save();
    }

    return NextResponse.json({
      message: 'Session ended successfully',
      duration,
      questionCount: messageCount
    });
  } catch (error) {
    console.error('Error ending session:', error);
    return NextResponse.json(
      { error: 'Failed to end session' },
      { status: 500 }
    );
  }
}