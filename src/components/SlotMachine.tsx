import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import type { Winner } from '../types';

interface SlotMachineProps {
  availableNumbers: number[];
  onDrawComplete: (prize: string) => Promise<Winner | null>;
  disabled?: boolean;
}

interface SlotColumnProps {
  spinning: boolean;
  finalDigit: number;
  stopDelay: number;
  onStop: () => void;
}

function SlotColumn({ spinning, finalDigit, stopDelay, onStop }: SlotColumnProps) {
  const [currentDigit, setCurrentDigit] = useState(0);
  const [stopped, setStopped] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (spinning && !stopped) {
      // Start spinning
      intervalRef.current = window.setInterval(() => {
        setCurrentDigit(Math.floor(Math.random() * 10));
      }, 50);

      // Stop after delay
      const stopTimeout = setTimeout(() => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        setCurrentDigit(finalDigit);
        setStopped(true);
        onStop();
      }, stopDelay);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        clearTimeout(stopTimeout);
      };
    } else if (!spinning) {
      setStopped(false);
      setCurrentDigit(0);
    }
  }, [spinning, finalDigit, stopDelay, stopped, onStop]);

  return (
    <div className="relative w-24 h-32 bg-gradient-to-b from-gray-900 to-gray-800 rounded-lg border-4 border-lucky-gold overflow-hidden shadow-lg">
      {/* Highlight effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>

      {/* Number display */}
      <div className="h-full flex items-center justify-center">
        <motion.span
          key={currentDigit}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`text-6xl font-bold ${stopped ? 'text-lucky-gold' : 'text-white'}`}
          style={{
            textShadow: stopped ? '0 0 20px rgba(255, 215, 0, 0.8)' : 'none'
          }}
        >
          {currentDigit}
        </motion.span>
      </div>

      {/* Spinning blur effect */}
      {spinning && !stopped && (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent animate-pulse"></div>
      )}
    </div>
  );
}

export function SlotMachine({ availableNumbers, onDrawComplete, disabled }: SlotMachineProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [prize, setPrize] = useState('');
  const [winner, setWinner] = useState<Winner | null>(null);
  const [targetNumber, setTargetNumber] = useState<number | null>(null);
  const [stoppedColumns, setStoppedColumns] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleColumnStop = useCallback(() => {
    setStoppedColumns(prev => prev + 1);
  }, []);

  useEffect(() => {
    if (stoppedColumns === 3 && targetNumber !== null) {
      // All columns stopped, trigger confetti and show result
      setTimeout(async () => {
        const result = await onDrawComplete(prize);
        if (result) {
          setWinner(result);
          setShowResult(true);

          // Fire confetti
          const duration = 3000;
          const end = Date.now() + duration;

          const frame = () => {
            confetti({
              particleCount: 3,
              angle: 60,
              spread: 55,
              origin: { x: 0 },
              colors: ['#FFD700', '#FFA500', '#FF6347']
            });
            confetti({
              particleCount: 3,
              angle: 120,
              spread: 55,
              origin: { x: 1 },
              colors: ['#FFD700', '#FFA500', '#FF6347']
            });

            if (Date.now() < end) {
              requestAnimationFrame(frame);
            }
          };
          frame();
        }
        setIsSpinning(false);
      }, 500);
    }
  }, [stoppedColumns, targetNumber, onDrawComplete, prize]);

  const startSpin = () => {
    if (availableNumbers.length === 0) {
      alert('Không còn số nào để quay!');
      return;
    }

    if (!prize.trim()) {
      alert('Vui lòng nhập tên giải thưởng!');
      return;
    }

    // Reset states
    setWinner(null);
    setShowResult(false);
    setStoppedColumns(0);

    // Pick random number from available
    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const selectedNumber = availableNumbers[randomIndex];
    setTargetNumber(selectedNumber);

    setIsSpinning(true);
  };

  const closeResult = () => {
    setShowResult(false);
    setWinner(null);
    setTargetNumber(null);
    setPrize('');
  };

  // Get digits from target number (padded to 3 digits)
  const digits = targetNumber !== null
    ? targetNumber.toString().padStart(3, '0').split('').map(Number)
    : [0, 0, 0];

  return (
    <div className="flex flex-col items-center">
      {/* Slot Machine Display */}
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-8 rounded-2xl border-4 border-lucky-gold shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-lucky-gold">LUCKY DRAW</h2>
          <p className="text-gray-400 text-sm mt-1">
            Còn lại {availableNumbers.length} số
          </p>
        </div>

        {/* Slot columns */}
        <div className="flex gap-4 justify-center mb-8">
          <SlotColumn
            spinning={isSpinning}
            finalDigit={digits[0]}
            stopDelay={2000}
            onStop={handleColumnStop}
          />
          <SlotColumn
            spinning={isSpinning}
            finalDigit={digits[1]}
            stopDelay={3000}
            onStop={handleColumnStop}
          />
          <SlotColumn
            spinning={isSpinning}
            finalDigit={digits[2]}
            stopDelay={4000}
            onStop={handleColumnStop}
          />
        </div>

        {/* Prize input */}
        <div className="mb-6">
          <label className="block text-white text-sm font-medium mb-2">
            Tên giải thưởng
          </label>
          <input
            type="text"
            value={prize}
            onChange={(e) => setPrize(e.target.value)}
            placeholder="VD: Giải nhất, bàn phím cơ..."
            disabled={isSpinning}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lucky-gold disabled:opacity-50"
          />
        </div>

        {/* Spin button */}
        <button
          onClick={startSpin}
          disabled={isSpinning || disabled || availableNumbers.length === 0}
          className="w-full py-4 bg-gradient-lucky text-lucky-dark font-bold text-xl rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {isSpinning ? (
            <>
              <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang quay...
            </>
          ) : (
            <>
              <span className="text-2xl">🎰</span>
              QUAY SÓ
            </>
          )}
        </button>
      </div>

      {/* Winner popup */}
      <AnimatePresence>
        {showResult && winner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={closeResult}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="bg-gradient-to-br from-lucky-dark to-[#16213e] p-8 rounded-2xl border-4 border-lucky-gold max-w-md w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-6xl">🎉</span>
              </motion.div>

              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-lucky-gold mt-4"
              >
                CHÚC MỪNG!
              </motion.h2>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: 'spring' }}
                className="my-6"
              >
                <p className="text-gray-400 mb-2">Số trúng thưởng</p>
                <p className="text-6xl font-bold text-lucky-gold text-shadow-gold">
                  {winner.number.toString().padStart(3, '0')}
                </p>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-gray-400 mb-1">Người chơi</p>
                <p className="text-2xl font-semibold text-white">{winner.participantName}</p>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-4"
              >
                <p className="text-gray-400 mb-1">Giải thưởng</p>
                <p className="text-xl font-semibold text-green-400">{winner.prize}</p>
              </motion.div>

              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                onClick={closeResult}
                className="mt-8 px-8 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
              >
                Đóng
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
