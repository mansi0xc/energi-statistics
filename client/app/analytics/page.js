'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PixelBlast from '@/components/PixelBlast';
import MetricCard from '@/components/analytics/MetricCard';
import ChartCard from '@/components/analytics/ChartCard';
import BarChartComponent from '@/components/analytics/BarChartComponent';
import PieChartComponent from '@/components/analytics/PieChartComponent';
import LineChartComponent from '@/components/analytics/LineChartComponent';

// Icons for metric cards
const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
  </svg>
);

const SessionsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
  </svg>
);

const QuestionsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
  </svg>
);

const HoursIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
  </svg>
);

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to end any open sessions
  const endOpenSessions = async () => {
    try {
      const response = await fetch('/api/end-last-session');
      const data = await response.json();
      console.log('End session response:', data);
      return data;
    } catch (err) {
      console.error('Error ending open sessions:', err);
      return null;
    }
  };

  // Function to fetch analytics data
  const fetchAnalytics = async () => {
    try {
      // Try to fetch real data, but don't worry if it fails
      try {
        const response = await fetch('/api/analytics');
        if (response.ok) {
          const data = await response.json();
          setAnalyticsData(data);
        }
      } catch (err) {
        console.error('Using mock data instead:', err);
      }
      
      // Always set loading to false after a short delay to show the mock data
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } catch (err) {
      console.error('Error in analytics:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Attempt to end any open sessions when the analytics page loads
    endOpenSessions().then(() => {
      // Then fetch analytics data
      fetchAnalytics();
    });
  }, []);

  // Mock data for development/preview
  const mockData = {
    overview: {
      totalSessions: 1254,
      uniqueUsers: 876,
      totalSessionHours: 342.5,
      totalQuestions: 5432,
      averageQuestionsPerSession: 4.3
    },
    browsers: [
      { _id: 'Chrome', count: 654 },
      { _id: 'Firefox', count: 245 },
      { _id: 'Safari', count: 187 },
      { _id: 'Edge', count: 98 },
      { _id: 'Others', count: 70 }
    ],
    devices: [
      { _id: 'Desktop', count: 723 },
      { _id: 'Mobile', count: 412 },
      { _id: 'Tablet', count: 119 }
    ],
    locations: [
      { _id: 'United States', count: 432 },
      { _id: 'United Kingdom', count: 187 },
      { _id: 'Germany', count: 143 },
      { _id: 'Canada', count: 98 },
      { _id: 'Others', count: 394 }
    ],
    durationDistribution: [
      { range: '< 1 min', count: 234 },
      { range: '1-5 mins', count: 456 },
      { range: '5-15 mins', count: 321 },
      { range: '15-30 mins', count: 165 },
      { range: '> 30 mins', count: 78 }
    ],
    questionDistribution: [
      { range: '0 questions', count: 143 },
      { range: '1-3 questions', count: 543 },
      { range: '4-10 questions', count: 432 },
      { range: '> 10 questions', count: 136 }
    ],
    sessionTrend: [
      { date: '2023-10-24', count: 145 },
      { date: '2023-10-25', count: 156 },
      { date: '2023-10-26', count: 132 },
      { date: '2023-10-27', count: 178 },
      { date: '2023-10-28', count: 189 },
      { date: '2023-10-29', count: 201 },
      { date: '2023-10-30', count: 187 }
    ]
  };

  // Use mock data if no real data is available yet
  const data = analyticsData || mockData;

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <PixelBlast
          variant="circle"
          pixelSize={6}
          color="#00FF9D"
          patternScale={3}
          patternDensity={1.2}
          pixelSizeJitter={0.5}
          enableRipples
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          liquid
          liquidStrength={0.12}
          liquidRadius={1.2}
          liquidWobbleSpeed={5}
          speed={0.6}
          edgeFade={0.25}
          transparent
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        
        <main className="container mx-auto px-4 py-20">
          <motion.div
            className="flex justify-between items-center mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            
            {/* <div className="flex space-x-4">
              <Link href="/users">
                <motion.div
                  className="px-4 py-2 rounded-lg border border-emerald-500/30 bg-black/50 backdrop-blur-sm text-emerald-400 hover:bg-emerald-900/20 transition-all"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: '0 0 8px rgba(0, 255, 157, 0.5)'
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  View Users
                </motion.div>
              </Link>
              
              <Link href="/">
                <motion.div
                  className="px-4 py-2 rounded-lg border border-emerald-500/30 bg-black/50 backdrop-blur-sm text-emerald-400 hover:bg-emerald-900/20 transition-all"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: '0 0 8px rgba(0, 255, 157, 0.5)'
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  Back to Chat
                </motion.div>
              </Link>
            </div> */}
          </motion.div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          ) : (
            <>
              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-10">
                <MetricCard 
                  title="Unique Users" 
                  value={data.overview.uniqueUsers} 
                  icon={<UsersIcon />} 
                  color="emerald"
                  onClick={() => window.location.href = '/users'}
                />
                <MetricCard 
                  title="Total Sessions" 
                  value={data.overview.totalSessions} 
                  icon={<SessionsIcon />} 
                  color="blue"
                />
                <MetricCard 
                  title="Total Session Minutes" 
                  value={data.overview.totalSessionMinutes} 
                  icon={<HoursIcon />} 
                  color="amber"
                />
                <MetricCard 
                  title="Avg Session Minutes" 
                  value={
                    data.overview.totalSessions
                      ? Math.round((data.overview.totalSessionMinutes / data.overview.totalSessions) * 10) / 10
                      : 0
                  } 
                  icon={<HoursIcon />} 
                  color="amber"
                />
                <MetricCard 
                  title="Total Questions" 
                  value={data.overview.totalQuestions} 
                  icon={<QuestionsIcon />} 
                  color="purple"
                />
                <MetricCard 
                  title="Avg Questions / Session" 
                  value={data.overview.averageQuestionsPerSession} 
                  icon={<QuestionsIcon />} 
                  color="purple"
                />
              </div>
              
              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                <ChartCard title="Session Trend (Last 7 Days)">
                  <LineChartComponent 
                    data={data.sessionTrend} 
                    dataKey="count" 
                    xAxisKey="date"
                  />
                </ChartCard>
                
                <ChartCard title="Question Distribution (Sessions by Question Count)">
                  <BarChartComponent 
                    data={data.questionDistribution} 
                    dataKey="count" 
                    nameKey="range"
                  />
                </ChartCard>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                <ChartCard title="Device Distribution">
                  <PieChartComponent 
                    data={data.devices} 
                    dataKey="count" 
                    nameKey="_id"
                  />
                </ChartCard>
                
                <ChartCard title="Browser Distribution">
                  <PieChartComponent 
                    data={data.browsers} 
                    dataKey="count" 
                    nameKey="_id"
                  />
                </ChartCard>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                <ChartCard title="Session Duration Distribution">
                  <BarChartComponent 
                    data={data.durationDistribution} 
                    dataKey="count" 
                    nameKey="range"
                    barColor="#00E5E1"
                  />
                </ChartCard>
                
                <ChartCard title="Top Locations">
                  <BarChartComponent 
                    data={data.locations} 
                    dataKey="count" 
                    nameKey="_id"
                    barColor="#9D00FF"
                  />
                </ChartCard>
              </div>
            </>
          )}
        </main>
        
        <Footer />
      </div>
    </div>
  );
}
