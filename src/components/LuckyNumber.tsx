import { motion } from 'framer-motion';

interface LuckyNumberProps {
  number: number;
  name: string;
  showDownload?: boolean;
}

export function LuckyNumber({ number, name, showDownload = true }: LuckyNumberProps) {
  const formattedNumber = number.toString().padStart(3, '0');

  const handleDownload = () => {
    // Create a canvas to generate image
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 600, 400);
      gradient.addColorStop(0, '#1a1a2e');
      gradient.addColorStop(0.5, '#16213e');
      gradient.addColorStop(1, '#0f3460');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 600, 400);

      // Border
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 4;
      ctx.strokeRect(20, 20, 560, 360);

      // Title
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('YEAR END PARTY 2025', 300, 70);

      // Lucky number label
      ctx.fillStyle = '#ffffff';
      ctx.font = '20px Arial';
      ctx.fillText('Số may mắn của bạn', 300, 130);

      // Number
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 120px Arial';
      ctx.fillText(formattedNumber, 300, 250);

      // Name
      ctx.fillStyle = '#ffffff';
      ctx.font = '24px Arial';
      ctx.fillText(name, 300, 320);

      // Footer
      ctx.fillStyle = '#888888';
      ctx.font = '14px Arial';
      ctx.fillText('Giữ lại số may mắn này để tham gia quay thưởng!', 300, 370);

      // Download
      const link = document.createElement('a');
      link.download = `lucky-number-${formattedNumber}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="relative p-8 rounded-2xl border-4 border-lucky-gold bg-gradient-to-br from-lucky-dark to-[#16213e] shadow-2xl"
    >
      {/* Decorative corners */}
      <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-lucky-gold"></div>
      <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-lucky-gold"></div>
      <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-lucky-gold"></div>
      <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-lucky-gold"></div>

      <div className="text-center">
        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lucky-gold text-xl font-bold mb-2"
        >
          YEAR END PARTY 2025
        </motion.p>

        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-white text-lg mb-4"
        >
          Số may mắn của bạn
        </motion.p>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
          className="relative"
        >
          <div className="text-8xl font-bold text-lucky-gold text-shadow-gold tracking-wider animate-glow py-4">
            {formattedNumber}
          </div>
        </motion.div>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-white text-xl mt-4 font-semibold"
        >
          {name}
        </motion.p>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-400 text-sm mt-4"
        >
          Giữ lại số may mắn này để tham gia quay thưởng!
        </motion.p>

        {showDownload && (
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            onClick={handleDownload}
            className="mt-6 px-6 py-3 bg-gradient-lucky text-lucky-dark font-bold rounded-lg hover:opacity-90 transition-opacity"
          >
            Tải ảnh số của tôi
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
