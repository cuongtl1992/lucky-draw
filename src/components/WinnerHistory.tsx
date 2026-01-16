import { motion } from 'framer-motion';
import type { Winner } from '../types';

interface WinnerHistoryProps {
  winners: Winner[];
  loading?: boolean;
}

export function WinnerHistory({ winners, loading }: WinnerHistoryProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lucky-gold"></div>
      </div>
    );
  }

  if (winners.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="text-6xl">🎰</span>
        <p className="text-gray-400 mt-4">Chưa có người trúng thưởng nào</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {winners.map((winner, index) => (
        <motion.div
          key={winner.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:border-lucky-gold/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            {/* Rank badge */}
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
              index === 0 ? 'bg-yellow-500 text-yellow-900' :
              index === 1 ? 'bg-gray-300 text-gray-700' :
              index === 2 ? 'bg-amber-600 text-amber-100' :
              'bg-white/20 text-white'
            }`}>
              #{index + 1}
            </div>

            {/* Winner info */}
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-lucky-gold">
                  {winner.number.toString().padStart(3, '0')}
                </span>
                <span className="text-white font-medium">{winner.participantName}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-green-400 text-sm font-medium">
                  🎁 {winner.prize}
                </span>
                <span className="text-gray-500 text-sm">
                  • {winner.drawnAt.toLocaleString('vi-VN')}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
