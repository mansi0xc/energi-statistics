import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { User, Session, Message } from '@/lib/models';

export async function GET(request, { params }) {
  try {
    const { userId } = params;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Find the user
    const user = await User.findOne({ userId });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get all sessions for this user
    const sessions = await Session.find({ 
      sessionId: { $in: user.sessions } 
    }).sort({ startTime: -1 });

    // Format sessions with conversation data
    const sessionsWithMessages = await Promise.all(
      sessions.map(async (session) => {
        const messages = await Message.find({ 
          sessionId: session.sessionId 
        }).sort({ timestamp: 1 });

        return {
          sessionId: session.sessionId,
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
      })
    );

    // Format the response
    const userDetails = {
      userId: user.userId,
      encryptedIp: user.encryptedIp,
      location: user.location,
      browser: user.browser,
      device: user.device,
      firstSeen: user.firstSeen,
      lastSeen: user.lastSeen,
      totalSessions: user.sessions.length,
      totalQuestions: user.totalQuestions,
      totalSessionDuration: user.totalSessionDuration,
      sessions: sessionsWithMessages
    };

    return NextResponse.json(userDetails);
  } catch (error) {
    console.error('Error fetching user details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user details' },
      { status: 500 }
    );
  }
}
