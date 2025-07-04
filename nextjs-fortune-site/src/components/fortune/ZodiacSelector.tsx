'use client';

import { motion } from 'framer-motion';
import { zodiacSigns, elements } from '@/lib/data/zodiac';
import { ZodiacSign } from '@/types';

interface ZodiacSelectorProps {
  selectedSign: ZodiacSign | null;
  onSignSelect: (sign: ZodiacSign) => void;
}

export default function ZodiacSelector({
  selectedSign,
  onSignSelect
}: ZodiacSelectorProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };

  const getElementColor = (element: string) => {
    switch (element) {
      case '火': return 'from-red-500/20 to-orange-500/20 border-red-400/50';
      case '土': return 'from-yellow-500/20 to-brown-500/20 border-yellow-400/50';
      case '風': return 'from-blue-500/20 to-cyan-500/20 border-blue-400/50';
      case '水': return 'from-purple-500/20 to-blue-500/20 border-purple-400/50';
      default: return 'from-gold-400/20 to-gold-600/20 border-gold-400/50';
    }
  };

  const getElementIcon = (element: string) => {
    switch (element) {
      case '火': return '🔥';
      case '土': return '🌍';
      case '風': return '💨';
      case '水': return '💧';
      default: return '✨';
    }
  };

  return (
    <div className="space-y-8">
      {/* エレメント別グループ表示 */}
      {Object.entries(elements).map(([elementName, elementData]) => (
        <motion.div
          key={elementName}
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* エレメントヘッダー */}
          <motion.div
            className="text-center"
            variants={cardVariants}
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-gold-400/30">
              <span className="text-2xl">{getElementIcon(elementName)}</span>
              <span className="text-lg font-bold text-gold-400">{elementName}の星座</span>
            </div>
            <p className="text-sm text-white/60 mt-2">{elementData.characteristics}</p>
          </motion.div>

          {/* 星座カードグリッド */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={containerVariants}
          >
            {zodiacSigns
              .filter(sign => sign.element === elementName)
              .map((sign) => (
                <motion.div
                  key={sign.id}
                  variants={cardVariants}
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className="group"
                >
                  <div
                    className={`
                      relative cursor-pointer rounded-2xl p-6 transition-all duration-300
                      bg-gradient-to-br ${getElementColor(sign.element)}
                      backdrop-blur-md border-2
                      ${selectedSign?.id === sign.id
                        ? 'border-gold-400 shadow-lg shadow-gold-400/30 scale-105'
                        : 'hover:border-gold-400/70 hover:shadow-md hover:shadow-gold-400/20'
                      }
                    `}
                    onClick={() => onSignSelect(sign)}
                  >
                    {/* 選択インジケーター */}
                    {selectedSign?.id === sign.id && (
                      <motion.div
                        className="absolute -top-2 -right-2 w-8 h-8 bg-gold-400 rounded-full flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      >
                        <span className="text-mystic-900 text-sm font-bold">✓</span>
                      </motion.div>
                    )}

                    {/* 星座シンボル */}
                    <motion.div
                      className="text-center mb-4"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="text-4xl mb-2 filter drop-shadow-lg">
                        {sign.symbol}
                      </div>
                      <h3 className="text-xl font-bold text-gold-400">
                        {sign.name}
                      </h3>
                      <p className="text-sm text-white/70">
                        {sign.period}
                      </p>
                    </motion.div>

                    {/* 星座の特徴 */}
                    <div className="space-y-2">
                      <p className="text-sm text-white/80 leading-relaxed line-clamp-2">
                        {sign.description}
                      </p>
                      
                      {/* 長所 */}
                      <div className="flex flex-wrap gap-1">
                        {sign.traits.positive.slice(0, 3).map((trait, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-green-500/20 text-green-300 rounded-full border border-green-500/30"
                          >
                            {trait}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* ホバーエフェクト */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gold-400/0 to-gold-400/10 opacity-0 pointer-events-none"
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />

                    {/* グロー効果 */}
                    {selectedSign?.id === sign.id && (
                      <motion.div
                        className="absolute inset-0 rounded-2xl bg-gold-400/10 blur-md -z-10"
                        animate={{
                          opacity: [0.3, 0.6, 0.3],
                          scale: [1, 1.05, 1]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut'
                        }}
                      />
                    )}
                  </div>
                </motion.div>
              ))}
          </motion.div>
        </motion.div>
      ))}

      {/* 背景装飾 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-gold-400/10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 40 + 20}px`
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.3, 0.1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: Math.random() * 8 + 6,
              repeat: Infinity,
              delay: Math.random() * 4
            }}
          >
            {zodiacSigns[i]?.symbol || '⭐'}
          </motion.div>
        ))}
      </div>
    </div>
  );
}