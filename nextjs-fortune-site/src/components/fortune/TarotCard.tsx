'use client';

import { motion } from 'framer-motion';
import { TarotCard as TarotCardType } from '@/types';

interface TarotCardProps {
  card: TarotCardType;
  isSelected: boolean;
  isDisabled: boolean;
  onClick: () => void;
  showDetails?: boolean;
}

export default function TarotCard({
  card,
  isSelected,
  isDisabled,
  onClick,
  showDetails = false
}: TarotCardProps) {
  const cardVariants = {
    hidden: { rotateY: 180, opacity: 0 },
    visible: {
      rotateY: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    },
    selected: {
      scale: 1.1,
      rotateY: 0,
      boxShadow: '0 0 30px rgba(255, 215, 0, 0.6)',
      transition: {
        duration: 0.3
      }
    },
    disabled: {
      opacity: 0.3,
      scale: 0.95,
      transition: {
        duration: 0.3
      }
    }
  };

  const flipVariants = {
    front: { rotateY: 0 },
    back: { rotateY: 180 }
  };

  return (
    <motion.div
      className={`relative cursor-pointer perspective-1000 ${isDisabled ? 'cursor-not-allowed' : ''}`}
      variants={cardVariants}
      initial="hidden"
      animate={
        isDisabled ? 'disabled' : isSelected ? 'selected' : 'visible'
      }
      whileHover={!isDisabled ? { scale: 1.05, y: -5 } : {}}
      whileTap={!isDisabled ? { scale: 0.95 } : {}}
      onClick={!isDisabled ? onClick : undefined}
    >
      <motion.div
        className="relative w-full h-32 preserve-3d"
        animate={showDetails ? 'front' : 'back'}
        variants={flipVariants}
        transition={{ duration: 0.6 }}
      >
        {/* カード裏面 */}
        <motion.div
          className="absolute inset-0 backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className={`
            w-full h-full rounded-lg border-2 transition-all duration-300
            ${isSelected 
              ? 'border-gold-400 bg-gradient-to-br from-gold-400/20 to-gold-600/20' 
              : 'border-gold-400/50 bg-gradient-to-br from-purple-900/50 to-blue-900/50'
            }
            ${isDisabled ? 'grayscale' : ''}
            backdrop-blur-sm
          `}>
            <div className="flex flex-col items-center justify-center h-full p-2">
              <motion.div
                className="text-3xl mb-2"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🔮
              </motion.div>
              <div className="w-full h-1 bg-gold-400/30 rounded mb-2" />
              <div className="w-3/4 h-1 bg-gold-400/20 rounded mb-1" />
              <div className="w-1/2 h-1 bg-gold-400/10 rounded" />
            </div>
          </div>
        </motion.div>

        {/* カード表面 */}
        <motion.div
          className="absolute inset-0 backface-hidden"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="w-full h-full rounded-lg border-2 border-gold-400 bg-gradient-to-br from-white/10 to-gold-400/10 backdrop-blur-sm p-2">
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-2xl mb-1">{card.symbol}</div>
              <h3 className="text-xs font-bold text-gold-400 mb-1 leading-tight">
                {card.name}
              </h3>
              <p className="text-xs text-white/70 leading-tight line-clamp-3">
                {card.uprightMeaning.substring(0, 50)}...
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* 選択インジケーター */}
      {isSelected && (
        <motion.div
          className="absolute -top-2 -right-2 w-6 h-6 bg-gold-400 rounded-full flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          <span className="text-mystic-900 text-sm font-bold">✓</span>
        </motion.div>
      )}

      {/* ホバーエフェクト */}
      {!isDisabled && (
        <motion.div
          className="absolute inset-0 rounded-lg bg-gradient-to-br from-gold-400/0 to-gold-400/20 opacity-0 pointer-events-none"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* グロー効果 */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 rounded-lg bg-gold-400/20 blur-md -z-10"
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      )}
    </motion.div>
  );
}