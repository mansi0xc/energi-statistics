import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { User, Session, Message } from '@/lib/models';

export async function GET() {
  try {
    // Connect to database
    await dbConnect();

    // Get all users with their details
    const users = await User.find().sort({ lastSeen: -1 });

    // Format the response
    const formattedUsers = users.map(user => ({
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
      sessionIds: user.sessions
    }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
