'use client';

import { motion } from 'framer-motion';

interface OmikujiBoxProps {
  isDrawing: boolean;
  onDraw: () => void;
}

export default function OmikujiBox({
  isDrawing,
  onDraw
}: OmikujiBoxProps) {
  const boxVariants = {
    idle: {
      scale: 1,
      rotateY: 0,
      boxShadow: '0 10px 30px rgba(255, 215, 0, 0.3)'
    },
    hover: {
      scale: 1.05,
      rotateY: 5,
      boxShadow: '0 15px 40px rgba(255, 215, 0, 0.5)',
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    },
    drawing: {
      scale: [1, 1.1, 0.95, 1.05, 1],
      rotateY: [0, 10, -10, 5, 0],
      rotateX: [0, 5, -5, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  const lidVariants = {
    closed: { rotateX: 0 },
    opening: {
      rotateX: [-5, -15, -10, -20, -15],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  const sparkleVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: [0, 1, 0],
      scale: [0, 1.5, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatDelay: 0.5
      }
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* おみくじ箱 */}
      <motion.div
        className="relative cursor-pointer"
        variants={boxVariants}
        initial="idle"
        animate={isDrawing ? 'drawing' : 'idle'}
        whileHover={!isDrawing ? 'hover' : {}}
        whileTap={!isDrawing ? { scale: 0.95 } : {}}
        onClick={!isDrawing ? onDraw : undefined}
        style={{ perspective: '1000px' }}
      >
        {/* 箱本体 */}
        <div className="relative w-64 h-48 bg-gradient-to-br from-amber-800 to-amber-900 rounded-2xl border-4 border-gold-400 overflow-hidden">
          {/* 木目テクスチャ */}
          <div className="absolute inset-0 opacity-30">
            <div className="w-full h-full bg-gradient-to-r from-transparent via-amber-700/50 to-transparent transform skew-y-12" />
            <div className="absolute top-4 w-full h-1 bg-amber-700/50" />
            <div className="absolute top-8 w-full h-1 bg-amber-700/30" />
            <div className="absolute top-12 w-full h-1 bg-amber-700/50" />
          </div>

          {/* 箱の蓋 */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-br from-amber-700 to-amber-800 border-b-2 border-gold-400/50 rounded-t-2xl"
            variants={lidVariants}
            animate={isDrawing ? 'opening' : 'closed'}
            style={{ transformOrigin: 'bottom center' }}
          >
            {/* 蓋の装飾 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-gold-400 rounded-full flex items-center justify-center">
                <span className="text-amber-900 font-bold text-sm">神</span>
              </div>
            </div>
          </motion.div>

          {/* おみくじ棒 */}
          <div className="absolute inset-x-4 top-20 bottom-4 flex items-end justify-center">
            <div className="grid grid-cols-8 gap-1 h-20">
              {Array.from({ length: 24 }).map((_, index) => (
                <motion.div
                  key={index}
                  className="w-2 bg-gradient-to-t from-amber-200 to-amber-100 rounded-full"
                  style={{ height: `${Math.random() * 60 + 40}%` }}
                  animate={isDrawing ? {
                    y: [0, -5, 0],
                    rotateZ: [0, Math.random() * 10 - 5, 0]
                  } : {}}
                  transition={{
                    duration: 0.5,
                    repeat: isDrawing ? Infinity : 0,
                    delay: index * 0.05
                  }}
                />
              ))}
            </div>
          </div>

          {/* 箱の文字 */}
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <span className="text-gold-400 font-bold text-lg tracking-wider">おみくじ</span>
          </div>
        </div>

        {/* 光るエフェクト */}
        {isDrawing && (
          <motion.div
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gold-400/20 to-transparent"
            animate={{
              opacity: [0, 0.5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 1,
              repeat: Infinity
            }}
          />
        )}
      </motion.div>

      {/* 説明テキスト */}
      <motion.div
        className="mt-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {!isDrawing ? (
          <div>
            <p className="text-gold-400 font-bold text-lg mb-2">おみくじ箱をクリック</p>
            <p className="text-white/70 text-sm">心を込めて運勢を占いましょう</p>
          </div>
        ) : (
          <div>
            <p className="text-gold-400 font-bold text-lg mb-2">おみくじを引いています...</p>
            <p className="text-white/70 text-sm">しばらくお待ちください</p>
          </div>
        )}
      </motion.div>

      {/* キラキラエフェクト */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 8 }).map((_, index) => (
          <motion.div
            key={index}
            className="absolute text-gold-400"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
              fontSize: `${Math.random() * 20 + 15}px`
            }}
            variants={sparkleVariants}
            initial="hidden"
            animate={isDrawing ? 'visible' : 'hidden'}
            transition={{ delay: index * 0.2 }}
          >
            ✨
          </motion.div>
        ))}
      </div>

      {/* 神聖な光 */}
      {isDrawing && (
        <motion.div
          className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-gold-400 to-transparent opacity-70"
          style={{ height: '200px', top: '-100px' }}
          animate={{
            opacity: [0, 0.7, 0],
            scaleX: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      )}
    </div>
  );
}