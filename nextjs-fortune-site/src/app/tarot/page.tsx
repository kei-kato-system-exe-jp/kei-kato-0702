'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { tarotCards, tarotSpreads } from '@/lib/data/tarot';
import { TarotCard, TarotResult } from '@/types';
import TarotSpread from '@/components/fortune/TarotSpread';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

type SpreadType = 'oneCard' | 'threeCard';

export default function TarotPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<'select-spread' | 'select-cards' | 'loading' | 'result'>('select-spread');
  const [selectedSpread, setSelectedSpread] = useState<SpreadType>('threeCard');
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSpreadSelect = (spread: SpreadType) => {
    setSelectedSpread(spread);
    setCurrentStep('select-cards');
  };

  const handleCardSelect = (cardIndex: number) => {
    const maxCards = selectedSpread === 'oneCard' ? 1 : 3;
    
    if (selectedCards.includes(cardIndex)) {
      setSelectedCards(selectedCards.filter(index => index !== cardIndex));
    } else if (selectedCards.length < maxCards) {
      setSelectedCards([...selectedCards, cardIndex]);
    }
  };

  const handleComplete = async () => {
    if (selectedCards.length === (selectedSpread === 'oneCard' ? 1 : 3)) {
      setIsLoading(true);
      setCurrentStep('loading');
      
      // アニメーション用の遅延
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 結果データを作成
      const selectedTarotCards = selectedCards.map(index => ({
        card: tarotCards[index],
        position: selectedSpread === 'oneCard' 
          ? tarotSpreads.oneCard.positions[0]
          : tarotSpreads.threeCard.positions[selectedCards.indexOf(index)],
        isReversed: Math.random() > 0.5,
        meaning: Math.random() > 0.5 
          ? tarotCards[index].uprightMeaning 
          : tarotCards[index].reversedMeaning
      }));

      const result: TarotResult = {
        title: `${tarotSpreads[selectedSpread].name}の結果`,
        description: selectedTarotCards.map(c => `${c.position}: ${c.card.name}`).join(', '),
        advice: selectedTarotCards[0].meaning,
        cards: selectedTarotCards,
        spread: selectedSpread,
        timestamp: new Date().toISOString(),
        lucky: {
          color: ['赤', '青', '金', '紫', '緑'][Math.floor(Math.random() * 5)],
          number: Math.floor(Math.random() * 9) + 1,
          item: ['クリスタル', '鏡', 'ペンダント', '指輪', 'お守り'][Math.floor(Math.random() * 5)],
          direction: ['北', '南', '東', '西'][Math.floor(Math.random() * 4)]
        }
      };

      // 結果をローカルストレージに保存
      localStorage.setItem('tarot-result', JSON.stringify(result));
      
      // 結果ページに遷移
      router.push('/result?type=tarot');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* ヘッダー */}
      <motion.header
        className="text-center py-8 px-4"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="glass-effect rounded-2xl p-6 max-w-2xl mx-auto border-2 border-gold-400/30">
          <h1 className="text-4xl font-bold text-gradient mb-2">🔮 タロット占い</h1>
          <p className="text-white/80">神秘のタロットカードがあなたの運命を導きます</p>
        </div>
      </motion.header>

      {/* メインコンテンツ */}
      <main className="flex-1 px-4 pb-8">
        <AnimatePresence mode="wait">
          {currentStep === 'select-spread' && (
            <motion.div
              key="spread-selection"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, x: -100 }}
              className="max-w-4xl mx-auto"
            >
              <motion.div variants={itemVariants} className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gold-400 mb-4">占い方法を選択してください</h2>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {Object.entries(tarotSpreads).map(([key, spread]) => (
                  <motion.div
                    key={key}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div
                      className="fortune-card cursor-pointer h-full min-h-[200px] flex flex-col justify-between"
                      onClick={() => handleSpreadSelect(key as SpreadType)}
                    >
                      <div>
                        <h3 className="text-xl font-bold text-gold-400 mb-4">{spread.name}</h3>
                        <p className="text-white/80 mb-4">{spread.description}</p>
                        <div className="flex gap-2 justify-center">
                          {spread.positions.map((position, index) => (
                            <div
                              key={index}
                              className="w-12 h-16 bg-gold-400/20 border border-gold-400/50 rounded flex items-center justify-center text-xs text-gold-400"
                            >
                              {position}
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button className="mt-4">この方法で占う</Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {currentStep === 'select-cards' && (
            <motion.div
              key="card-selection"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="max-w-6xl mx-auto"
            >
              <TarotSpread
                spread={selectedSpread}
                selectedCards={selectedCards}
                onCardSelect={handleCardSelect}
                onComplete={handleComplete}
              />
            </motion.div>
          )}

          {currentStep === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center min-h-[400px]"
            >
              <LoadingSpinner size="lg" />
              <motion.p
                className="text-xl text-gold-400 mt-6"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                カードが運命を読み取っています...
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* フッター */}
      <footer className="text-center py-4 px-4">
        <Link href="/">
          <Button variant="ghost">ホームに戻る</Button>
        </Link>
      </footer>
    </div>
  );
}