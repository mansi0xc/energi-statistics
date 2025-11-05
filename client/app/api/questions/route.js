import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { Message, Session } from '@/lib/models';

export async function GET() {
  try {
    await dbConnect();

    // Get all user messages (questions)
    const questions = await Message.find({ role: 'user' })
      .sort({ timestamp: -1 })
      .lean();

    const sessionIds = [...new Set(questions.map(q => q.sessionId))];
    const sessions = await Session.find({ sessionId: { $in: sessionIds } }).lean();
    const sessionMap = new Map(sessions.map(s => [s.sessionId, s]));

    const result = questions.map(q => {
      const s = sessionMap.get(q.sessionId) || {};
      return {
        content: q.content,
        sessionId: q.sessionId,
        timestamp: q.timestamp,
        browser: s.browser || 'Unknown',
        device: s.device || 'Unknown',
        country: s.location?.country || 'Unknown',
      };
    });

    return NextResponse.json({ questions: result });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}


