import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getAllWinners } from '../services/firebase';
import { WinnerHistory } from './WinnerHistory';
import type { Winner } from '../types';

export function HistoryPage() {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWinners = async () => {
      try {
        const data = await getAllWinners();
        setWinners(data);
      } catch (error) {
        console.error('Error loading winners:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWinners();
  }, []);

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-lucky-gold text-shadow-gold mb-2">
            🏆 Lịch sử trúng thưởng
          </h1>
          <p className="text-gray-400">Year End Party 2025</p>
        </motion.div>

        {/* Winner list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 rounded-2xl p-6 border border-white/10"
        >
          <WinnerHistory winners={winners} loading={loading} />
        </motion.div>

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-8"
        >
          <Link
            to="/"
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Quay lại trang chủ
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
