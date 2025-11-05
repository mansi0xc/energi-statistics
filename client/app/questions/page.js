'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PixelBlast from '@/components/PixelBlast';

export default function QuestionsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/questions');
        if (!res.ok) throw new Error('Failed to fetch questions');
        const data = await res.json();
        setRows(data.questions || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDate = (d) => {
    if (!d) return 'N/A';
    return new Date(d).toLocaleString();
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
              All Questions
            </motion.h1>
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
              className="w-full max-w-6xl mx-auto bg-black/40 backdrop-blur-sm rounded-xl border border-emerald-500/20 overflow-hidden glow-border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="overflow-x-auto p-6">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-emerald-500/30">
                      <th className="px-4 py-3 text-left text-emerald-400">Question</th>
                      <th className="px-4 py-3 text-left text-emerald-400">Session</th>
                      <th className="px-4 py-3 text-left text-emerald-400">Country</th>
                      <th className="px-4 py-3 text-left text-emerald-400">Browser</th>
                      <th className="px-4 py-3 text-left text-emerald-400">Device</th>
                      <th className="px-4 py-3 text-left text-emerald-400">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((q, idx) => (
                      <tr key={`${q.sessionId}-${idx}`} className="border-b border-gray-800 hover:bg-black/60">
                        <td className="px-4 py-3 text-sm">{q.content}</td>
                        <td className="px-4 py-3 font-mono text-xs truncate max-w-[140px]">{q.sessionId}</td>
                        <td className="px-4 py-3">{q.country}</td>
                        <td className="px-4 py-3">{q.browser}</td>
                        <td className="px-4 py-3">{q.device}</td>
                        <td className="px-4 py-3 text-xs">{formatDate(q.timestamp)}</td>
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


