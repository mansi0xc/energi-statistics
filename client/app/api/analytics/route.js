import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { Session, Message } from '@/lib/models';

export async function GET() {
  try {
    // Connect to database
    await dbConnect();

    // Get overall metrics
    const totalSessions = await Session.countDocuments();
    
    // Count unique users based on encrypted IPs
    const uniqueUsers = await Session.distinct('encryptedIp');
    const uniqueUserCount = uniqueUsers.length;
    
    // Calculate total session hours
    const sessions = await Session.find({ duration: { $exists: true } });
    const totalSessionSeconds = sessions.reduce((acc, session) => acc + (session.duration || 0), 0);
    const totalSessionHours = Math.round((totalSessionSeconds / 3600) * 100) / 100; // Round to 2 decimal places
    
    // Count total questions
    const totalQuestions = await Message.countDocuments({ role: 'user' });
    
    // Get browser distribution
    const browsers = await Session.aggregate([
      { $group: { _id: '$browser', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Get device distribution
    const devices = await Session.aggregate([
      { $group: { _id: '$device', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Get location distribution
    const locations = await Session.aggregate([
      { $group: { _id: '$location.country', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Get session duration distribution
    const durationDistribution = [
      { range: '< 1 min', count: await Session.countDocuments({ duration: { $lt: 60 } }) },
      { range: '1-5 mins', count: await Session.countDocuments({ duration: { $gte: 60, $lt: 300 } }) },
      { range: '5-15 mins', count: await Session.countDocuments({ duration: { $gte: 300, $lt: 900 } }) },
      { range: '15-30 mins', count: await Session.countDocuments({ duration: { $gte: 900, $lt: 1800 } }) },
      { range: '> 30 mins', count: await Session.countDocuments({ duration: { $gte: 1800 } }) }
    ];
    
    // Get question count distribution
    const questionDistribution = [
      { range: '0 questions', count: await Session.countDocuments({ questionCount: 0 }) },
      { range: '1-3 questions', count: await Session.countDocuments({ questionCount: { $gte: 1, $lte: 3 } }) },
      { range: '4-10 questions', count: await Session.countDocuments({ questionCount: { $gte: 4, $lte: 10 } }) },
      { range: '> 10 questions', count: await Session.countDocuments({ questionCount: { $gt: 10 } }) }
    ];
    
    // Get session trend (last 7 days)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      
      const count = await Session.countDocuments({
        startTime: { $gte: date, $lt: nextDay }
      });
      
      last7Days.push({
        date: date.toISOString().split('T')[0],
        count
      });
    }
    
    return NextResponse.json({
      overview: {
        totalSessions,
        uniqueUsers: uniqueUserCount,
        totalSessionHours,
        totalQuestions,
        averageQuestionsPerSession: totalSessions ? Math.round((totalQuestions / totalSessions) * 10) / 10 : 0
      },
      browsers,
      devices,
      locations,
      durationDistribution,
      questionDistribution,
      sessionTrend: last7Days
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
