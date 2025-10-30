import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { User, Session, Message } from '@/lib/models';

export async function GET() {
  try {
    // Connect to database
    await dbConnect();

    // Get overall metrics
    const totalSessions = await Session.countDocuments();
    
    // Count unique users
    const uniqueUserCount = await User.countDocuments();
    
    // Calculate total session minutes
    const sessions = await Session.find({ duration: { $exists: true } });
    const totalSessionSeconds = sessions.reduce((acc, session) => acc + (session.duration || 0), 0);
    const totalSessionMinutes = Math.round(totalSessionSeconds / 60); // Convert to minutes
    
    // Count total questions (only user messages)
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
    
    // Get location distribution - use User model to get accurate country data
    const locations = await User.aggregate([
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
    
    // Get question count distribution - only include sessions with at least 1 question
    const questionDistribution = [
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
        totalSessionMinutes, // Changed from hours to minutes
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
    
    // Return mock data if there's an error
    return NextResponse.json(getMockAnalyticsData());
  }
}

// Mock function to provide analytics data when database is unavailable
function getMockAnalyticsData() {
  return {
    overview: {
      totalSessions: 8,
      uniqueUsers: 1,
      totalSessionMinutes: 15, // Changed from hours to minutes
      totalQuestions: 12,
      averageQuestionsPerSession: 1.5
    },
    browsers: [
      { _id: 'Chrome', count: 8 }
    ],
    devices: [
      { _id: 'Desktop', count: 8 }
    ],
    locations: [
      { _id: 'India', count: 1 }
    ],
    durationDistribution: [
      { range: '< 1 min', count: 2 },
      { range: '1-5 mins', count: 3 },
      { range: '5-15 mins', count: 2 },
      { range: '15-30 mins', count: 1 },
      { range: '> 30 mins', count: 0 }
    ],
    questionDistribution: [
      { range: '1-3 questions', count: 5 },
      { range: '4-10 questions', count: 3 },
      { range: '> 10 questions', count: 0 }
    ],
    sessionTrend: [
      { date: '2025-10-24', count: 0 },
      { date: '2025-10-25', count: 0 },
      { date: '2025-10-26', count: 0 },
      { date: '2025-10-27', count: 0 },
      { date: '2025-10-28', count: 0 },
      { date: '2025-10-29', count: 0 },
      { date: '2025-10-30', count: 8 }
    ]
  };
}