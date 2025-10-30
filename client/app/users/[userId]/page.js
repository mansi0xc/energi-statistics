'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PixelBlast from '@/components/PixelBlast';

export default function UserDetailPage({ params }) {
  const { userId } = params;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }
        const data = await response.json();
        setUser(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Format duration in seconds to minutes
  const formatDuration = (seconds) => {
    if (!seconds) return '0m';
    return `${Math.round(seconds / 60)}m`;
  };

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
          <div className="flex justify-between items-center mb-10">
            <motion.h1 
              className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              User Details
            </motion.h1>
            
            <Link href="/users">
              <motion.div
                className="px-4 py-2 rounded-lg border border-emerald-500/30 bg-black/50 backdrop-blur-sm text-emerald-400 hover:bg-emerald-900/20 transition-all"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 0 8px rgba(0, 255, 157, 0.5)'
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                Back to Users
              </motion.div>
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 text-center">
              <p className="text-red-400">Error: {error}</p>
              <p className="text-gray-400 mt-2">Please try refreshing the page.</p>
            </div>
          ) : user ? (
            <div className="space-y-8">
              {/* User Info Card */}
              <motion.div 
                className="bg-black/40 backdrop-blur-sm border border-emerald-500/30 rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-xl font-bold mb-4 text-emerald-400">User Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-400">User ID</p>
                    <p className="font-mono text-xs break-all">{user.userId}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">IP (Encrypted)</p>
                    <p className="font-mono text-xs break-all">{user.encryptedIp}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Location</p>
                    <p>{user.location?.country || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Browser</p>
                    <p>{user.browser || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Device</p>
                    <p>{user.device || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">First Seen</p>
                    <p>{formatDate(user.firstSeen)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Last Seen</p>
                    <p>{formatDate(user.lastSeen)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Total Sessions</p>
                    <p>{user.totalSessions || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Total Questions</p>
                    <p>{user.totalQuestions || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Total Session Duration</p>
                    <p>{formatDuration(user.totalSessionDuration)}</p>
                  </div>
                </div>
              </motion.div>

              {/* Sessions List */}
              <motion.div 
                className="bg-black/40 backdrop-blur-sm border border-emerald-500/30 rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h2 className="text-xl font-bold mb-4 text-emerald-400">Sessions</h2>
                
                {user.sessions && user.sessions.length > 0 ? (
                  <div className="space-y-6">
                    {user.sessions.map((session) => (
                      <div key={session.sessionId} className="border border-gray-800 rounded-lg p-4">
                        <div className="flex flex-wrap justify-between items-center mb-4">
                          <div>
                            <p className="text-sm text-gray-400">Session ID:</p>
                            <p className="font-mono text-xs">{session.sessionId}</p>
                          </div>
                          <div className="flex space-x-4">
                            <div>
                              <p className="text-sm text-gray-400">Started:</p>
                              <p>{formatDate(session.startTime)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Duration:</p>
                              <p>{formatDuration(session.duration)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Questions:</p>
                              <p>{session.questionCount}</p>
                            </div>
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-semibold mb-2 text-emerald-400">Conversation</h3>
                        <div className="space-y-3 max-h-80 overflow-y-auto p-2">
                          {session.conversation && session.conversation.map((msg, index) => (
                            <div 
                              key={index} 
                              className={`p-3 rounded-lg ${
                                msg.role === 'user' 
                                  ? 'bg-gray-900 text-white ml-auto max-w-[80%]' 
                                  : 'bg-emerald-900/60 border border-emerald-500/30 text-white mr-auto max-w-[80%]'
                              }`}
                            >
                              <p>{msg.content}</p>
                              <p className="text-xs text-gray-400 mt-1">{formatDate(msg.timestamp)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No sessions found for this user.</p>
                )}
              </motion.div>
            </div>
          ) : (
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-6 text-center">
              <p className="text-yellow-400">User not found</p>
            </div>
          )}
        </main>
        
        <Footer />
      </div>
    </div>
  );
}
