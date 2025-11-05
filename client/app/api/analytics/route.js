import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { User, Session, Message } from '@/lib/models';

export async function GET(request) {
  try {
    // Connect to database
    await dbConnect();

    // Time range selection for session trend
    const { searchParams } = new URL(request.url);
    const range = (searchParams.get('range') || 'week').toLowerCase();
    const now = new Date();
    let startDate = null;
    if (range === 'week') {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 6);
      startDate.setHours(0,0,0,0);
    } else if (range === 'month') {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 29);
      startDate.setHours(0,0,0,0);
    } else if (range === 'year') {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 364);
      startDate.setHours(0,0,0,0);
    }

    // Get overall metrics - only count sessions with at least one question
    const totalSessions = await Session.countDocuments({ questionCount: { $gt: 0 } });
    
    // Count unique users
    const uniqueUserCount = await User.countDocuments();
    
    // Calculate total session minutes directly from sessions with questions and duration
    const sessionsWithQuestions = await Session.find({ 
      questionCount: { $gt: 0 }
    });
    
    // Debug each session to see what's happening
    console.log(`Sessions data debug:`);
    sessionsWithQuestions.forEach((session, index) => {
      console.log(`Session ${index + 1}: ID: ${session.sessionId}, Questions: ${session.questionCount}, Duration: ${session.duration || 'undefined'}, Start: ${session.startTime}, End: ${session.endTime || 'not ended'}`);
    });
    
    // Only count sessions that have a duration value
    const completedSessions = sessionsWithQuestions.filter(s => s.duration && s.duration > 0);
    
    // Calculate total seconds and convert to minutes
    const totalSessionSeconds = completedSessions.reduce((acc, session) => acc + (session.duration || 0), 0);
    const totalSessionMinutes = Math.round(totalSessionSeconds / 60); // Convert to minutes
    
    console.log(`Analytics: Found ${completedSessions.length} completed sessions with duration totaling ${totalSessionSeconds} seconds (${totalSessionMinutes} minutes)`);
    
    // Count total questions (only user messages)
    const totalQuestions = await Message.countDocuments({ role: 'user' });
    
    // Get browser distribution - only include sessions with questions
    const browsers = await Session.aggregate([
      { $match: { questionCount: { $gt: 0 } } },
      { $group: { _id: '$browser', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Get device distribution - only include sessions with questions
    const devices = await Session.aggregate([
      { $match: { questionCount: { $gt: 0 } } },
      { $group: { _id: '$device', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Get location distribution - use User model to get accurate country data
    const locations = await User.aggregate([
      { $group: { _id: '$location.country', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Get session duration distribution - only include sessions with at least one question
    const durationDistribution = await Promise.all([
      Session.countDocuments({ duration: { $exists: true, $gt: 0, $lt: 60 }, questionCount: { $gt: 0 } })
        .then(count => ({ range: '< 1 min', count })),
      Session.countDocuments({ duration: { $gte: 60, $lt: 300 }, questionCount: { $gt: 0 } })
        .then(count => ({ range: '1-5 mins', count })),
      Session.countDocuments({ duration: { $gte: 300, $lt: 900 }, questionCount: { $gt: 0 } })
        .then(count => ({ range: '5-15 mins', count })),
      Session.countDocuments({ duration: { $gte: 900, $lt: 1800 }, questionCount: { $gt: 0 } })
        .then(count => ({ range: '15-30 mins', count })),
      Session.countDocuments({ duration: { $gte: 1800 }, questionCount: { $gt: 0 } })
        .then(count => ({ range: '> 30 mins', count }))
    ]);
    
    // Log duration distribution for debugging
    console.log("Duration distribution:", durationDistribution);
    
    // Get question count distribution - only include sessions with at least 1 question
    const questionDistribution = [
      { range: '1-3 questions', count: await Session.countDocuments({ questionCount: { $gte: 1, $lte: 3 } }) },
      { range: '4-10 questions', count: await Session.countDocuments({ questionCount: { $gte: 4, $lte: 10 } }) },
      { range: '> 10 questions', count: await Session.countDocuments({ questionCount: { $gt: 10 } }) }
    ];
    
    // Build session trend for selected range
    let sessionTrend = [];
    if (range === 'all') {
      const trend = await Session.aggregate([
        { $match: { questionCount: { $gt: 0 } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$startTime' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]);
      sessionTrend = trend.map(t => ({ date: t._id, count: t.count }));
    } else {
      const days = [];
      const iter = new Date(startDate);
      iter.setHours(0,0,0,0);
      const endDate = new Date(now);
      endDate.setHours(0,0,0,0);
      while (iter <= endDate) {
        days.push(iter.toISOString().split('T')[0]);
        const next = new Date(iter);
        next.setDate(iter.getDate() + 1);
        iter.setTime(next.getTime());
      }
      const trend = await Session.aggregate([
        { $match: { questionCount: { $gt: 0 }, startTime: { $gte: startDate, $lte: now } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$startTime' } }, count: { $sum: 1 } } }
      ]);
      const map = new Map(trend.map(t => [t._id, t.count]));
      sessionTrend = days.map(d => ({ date: d, count: map.get(d) || 0 }));
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
      sessionTrend
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
      totalSessions: 3,
      uniqueUsers: 1,
      totalSessionMinutes: 15,
      totalQuestions: 7,
      averageQuestionsPerSession: 2.3
    },
    browsers: [
      { _id: 'Opera', count: 3 }
    ],
    devices: [
      { _id: 'Desktop', count: 3 }
    ],
    locations: [
      { _id: 'India', count: 1 }
    ],
    durationDistribution: [
      { range: '< 1 min', count: 1 },
      { range: '1-5 mins', count: 1 },
      { range: '5-15 mins', count: 1 },
      { range: '15-30 mins', count: 0 },
      { range: '> 30 mins', count: 0 }
    ],
    questionDistribution: [
      { range: '1-3 questions', count: 2 },
      { range: '4-10 questions', count: 1 },
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