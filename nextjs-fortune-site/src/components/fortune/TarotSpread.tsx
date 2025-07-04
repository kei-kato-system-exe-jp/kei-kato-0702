'use client';

import { motion } from 'framer-motion';
import { tarotCards, tarotSpreads } from '@/lib/data/tarot';
import TarotCard from './TarotCard';
import Button from '@/components/ui/Button';

interface TarotSpreadProps {
  spread: 'oneCard' | 'threeCard';
  selectedCards: number[];
  onCardSelect: (cardIndex: number) => void;
  onComplete: () => void;
}

export default function TarotSpread({
  spread,
  selectedCards,
  onCardSelect,
  onComplete
}: TarotSpreadProps) {
  const maxCards = spread === 'oneCard' ? 1 : 3;
  const isComplete = selectedCards.length === maxCards;
  const spreadData = tarotSpreads[spread];

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
    hidden: { opacity: 0, y: 50, rotateY: 180 },
    visible: {
      opacity: 1,
      y: 0,
      rotateY: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* 説明セクション */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-gold-400 mb-4">
          {spreadData.name} - カードを選択してください
        </h2>
        <p className="text-white/80 mb-4">{spreadData.description}</p>
        <div className="flex justify-center items-center gap-4 mb-6">
          <span className="text-gold-400">選択済み:</span>
          <div className="flex gap-2">
            {Array.from({ length: maxCards }).map((_, index) => (
              <div
                key={index}
                className={`w-4 h-4 rounded-full border-2 transition-colors ${
                  index < selectedCards.length
                    ? 'bg-gold-400 border-gold-400'
                    : 'border-gold-400/50'
                }`}
              />
            ))}
          </div>
          <span className="text-white/60">({selectedCards.length}/{maxCards})</span>
        </div>
      </motion.div>

      {/* 選択されたカードの配置プレビュー */}
      {selectedCards.length > 0 && (
        <motion.div
          className="flex justify-center gap-4 mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {selectedCards.map((cardIndex, position) => (
            <div key={position} className="text-center">
              <div className="w-16 h-24 bg-gold-400/20 border-2 border-gold-400 rounded-lg mb-2 flex items-center justify-center">
                <span className="text-2xl">{tarotCards[cardIndex].symbol}</span>
              </div>
              <p className="text-xs text-gold-400">{spreadData.positions[position]}</p>
            </div>
          ))}
        </motion.div>
      )}

      {/* カード選択グリッド */}
      <motion.div
        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {tarotCards.map((card, index) => (
          <motion.div
            key={card.id}
            variants={cardVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <TarotCard
              card={card}
              isSelected={selectedCards.includes(index)}
              isDisabled={!selectedCards.includes(index) && selectedCards.length >= maxCards}
              onClick={() => onCardSelect(index)}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* 完了ボタン */}
      <motion.div
        className="text-center pt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <Button
          onClick={onComplete}
          disabled={!isComplete}
          size="lg"
          className={`${
            isComplete
              ? 'animate-pulse shadow-lg shadow-gold-400/50'
              : 'opacity-50 cursor-not-allowed'
          }`}
        >
          {isComplete ? '運命を読み取る' : `あと${maxCards - selectedCards.length}枚選択してください`}
        </Button>
      </motion.div>

      {/* 背景装飾 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-gold-400/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 30 + 20}px`
            }}
            animate={{
              rotate: [0, 360],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          >
            🔮
          </motion.div>
        ))}
      </div>
    </div>
  );
}