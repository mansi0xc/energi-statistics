import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { User, Session, Message } from '@/lib/models';

export async function GET() {
  try {
    // Connect to database
    await dbConnect();
    
    // Get all sessions
    const sessions = await Session.find().lean();
    
    // Get all users
    const users = await User.find().lean();
    
    // Get all messages
    const messageCount = await Message.countDocuments();
    
    // Calculate duration stats
    const completedSessions = sessions.filter(s => s.duration && s.questionCount > 0);
    const totalDuration = completedSessions.reduce((acc, s) => acc + (s.duration || 0), 0);
    
    // Format data for debugging
    const formattedSessions = sessions.map(s => ({
      sessionId: s.sessionId,
      startTime: s.startTime,
      endTime: s.endTime,
      duration: s.duration ? `${s.duration}s (${Math.floor(s.duration / 60)}m)` : 'not ended',
      questionCount: s.questionCount,
      encryptedIp: s.encryptedIp,
    }));
    
    // Return debug info
    return NextResponse.json({
      sessionCount: sessions.length,
      userCount: users.length,
      messageCount,
      sessions: formattedSessions,
      users: users.map(u => ({
        userId: u.userId,
        encryptedIp: u.encryptedIp,
        sessionCount: (u.sessions || []).length,
        totalDuration: u.totalSessionDuration ? 
          `${u.totalSessionDuration}s (${Math.floor(u.totalSessionDuration / 60)}m)` : 
          '0s',
        totalQuestions: u.totalQuestions || 0,
      })),
      stats: {
        completedSessions: completedSessions.length,
        totalDuration: `${totalDuration}s (${Math.floor(totalDuration / 60)}m)`,
      }
    });
  } catch (error) {
    console.error('Error fetching debug info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch debug info' },
      { status: 500 }
    );
  }
}

