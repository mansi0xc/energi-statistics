'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PixelBlast from '@/components/PixelBlast';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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
            
            <Link href="/analytics">
              <motion.div
                className="px-4 py-2 rounded-lg border border-emerald-500/30 bg-black/50 backdrop-blur-sm text-emerald-400 hover:bg-emerald-900/20 transition-all"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 0 8px rgba(0, 255, 157, 0.5)'
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                Back to Analytics
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
          ) : (
            <motion.div 
              className="w-full max-w-5xl mx-auto bg-black/40 backdrop-blur-sm rounded-xl border border-emerald-500/20 overflow-hidden glow-border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="overflow-x-auto p-6">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-emerald-500/30">
                      <th className="px-4 py-3 text-left text-emerald-400">User ID</th>
                      <th className="px-4 py-3 text-left text-emerald-400">IP (Encrypted)</th>
                      <th className="px-4 py-3 text-left text-emerald-400">Location</th>
                      <th className="px-4 py-3 text-left text-emerald-400">Browser</th>
                      <th className="px-4 py-3 text-left text-emerald-400">Device</th>
                      <th className="px-4 py-3 text-left text-emerald-400">Sessions</th>
                      <th className="px-4 py-3 text-left text-emerald-400">Questions</th>
                      <th className="px-4 py-3 text-left text-emerald-400">Duration</th>
                      <th className="px-4 py-3 text-left text-emerald-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.userId} className="border-b border-gray-800 hover:bg-black/60">
                        <td className="px-4 py-3 font-mono text-xs truncate max-w-[100px]">{user.userId}</td>
                        <td className="px-4 py-3 font-mono text-xs truncate max-w-[100px]">{user.encryptedIp}</td>
                        <td className="px-4 py-3">{user.location?.country || 'Unknown'}</td>
                        <td className="px-4 py-3">{user.browser || 'Unknown'}</td>
                        <td className="px-4 py-3">{user.device || 'Unknown'}</td>
                        <td className="px-4 py-3">{user.totalSessions || 0}</td>
                        <td className="px-4 py-3">{user.totalQuestions || 0}</td>
                        <td className="px-4 py-3">{formatDuration(user.totalSessionDuration)}</td>
                        <td className="px-4 py-3">
                          <Link href={`/users/${user.userId}`}>
                            <span className="text-emerald-400 hover:text-emerald-300 cursor-pointer">
                              View Details
                            </span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </main>
        
        <Footer />
      </div>
    </div>
  );
}
