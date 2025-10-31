import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { Session, Message, User } from '@/lib/models';
import { calculateDuration } from '@/lib/utils';

// This endpoint can be used to manually end the last open session
export async function GET() {
  try {
    // Connect to database
    await dbConnect();
    
    // Find the latest session that doesn't have an end time
    const session = await Session.findOne({
      endTime: { $exists: false }
    }).sort({ startTime: -1 }); // Sort by most recent
    
    if (!session) {
      return NextResponse.json({
        success: false,
        message: 'No open sessions found'
      });
    }
    
    // Get message count for the session
    const messageCount = await Message.countDocuments({
      sessionId: session.sessionId,
      role: 'user'
    });
    
    // Calculate end time and duration
    const endTime = new Date();
    const duration = calculateDuration(session.startTime, endTime);
    
    // Update session data
    await Session.updateOne(
      { sessionId: session.sessionId },
      {
        endTime,
        duration,
        questionCount: messageCount
      }
    );
    
    // Update user data if there were messages
    if (messageCount > 0) {
      await User.updateOne(
        { encryptedIp: session.encryptedIp },
        {
          $set: { lastSeen: endTime },
          $inc: { totalSessionDuration: duration }
        }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: `Session ${session.sessionId} ended successfully`,
      sessionData: {
        sessionId: session.sessionId,
        startTime: session.startTime,
        endTime,
        duration,
        messageCount
      }
    });
  } catch (error) {
    console.error('Error ending last session:', error);
    return NextResponse.json(
      { error: 'Failed to end last session' },
      { status: 500 }
    );
  }
}

