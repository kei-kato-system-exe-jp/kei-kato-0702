'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodiacSigns } from '@/lib/data/zodiac';
import { ZodiacSign, ZodiacResult } from '@/types';
import ZodiacSelector from '@/components/fortune/ZodiacSelector';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function ZodiacPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<'select' | 'loading' | 'result'>('select');
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignSelect = (sign: ZodiacSign) => {
    setSelectedSign(sign);
  };

  const handleComplete = async () => {
    if (!selectedSign) return;

    setIsLoading(true);
    setCurrentStep('loading');
    
    // アニメーション用の遅延
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // 今日の運勢をランダム生成
    const fortuneLevels = ['最高', '好調', '普通', '注意', '低調'];
    const loveMessages = [
      '素敵な出会いが期待できます',
      '恋人との関係が深まります',
      '片思いが実るかもしれません',
      '相手の気持ちを理解しましょう',
      '焦らず自然体でいることが大切'
    ];
    const workMessages = [
      '重要なプロジェクトで活躍できます',
      'チームワークが成功の鍵です',
      '新しいアイデアが評価されます',
      '基本に立ち返って取り組みましょう',
      '先輩のアドバイスを聞きましょう'
    ];
    const healthMessages = [
      '体調絶好調です',
      '適度な運動を心がけましょう',
      'バランスの良い食事を',
      '十分な休息を取りましょう',
      '無理は禁物です'
    ];
    const moneyMessages = [
      '臨時収入があるかもしれません',
      '計画的な支出を心がけて',
      '投資のチャンスがあります',
      '節約を意識しましょう',
      '家計の見直しが必要です'
    ];

    const result: ZodiacResult = {
      title: `${selectedSign.name}の今日の運勢`,
      description: `${selectedSign.description}`,
      advice: selectedSign.advice,
      sign: selectedSign,
      todaysFortune: {
        level: fortuneLevels[Math.floor(Math.random() * fortuneLevels.length)],
        love: loveMessages[Math.floor(Math.random() * loveMessages.length)],
        work: workMessages[Math.floor(Math.random() * workMessages.length)],
        health: healthMessages[Math.floor(Math.random() * healthMessages.length)],
        money: moneyMessages[Math.floor(Math.random() * moneyMessages.length)]
      },
      timestamp: new Date().toISOString(),
      lucky: {
        color: selectedSign.luckyItems[0] || '金色',
        number: Math.floor(Math.random() * 9) + 1,
        item: selectedSign.luckyItems[Math.floor(Math.random() * selectedSign.luckyItems.length)],
        direction: ['北', '南', '東', '西'][Math.floor(Math.random() * 4)]
      }
    };

    // 結果をローカルストレージに保存
    localStorage.setItem('zodiac-result', JSON.stringify(result));
    
    // 結果ページに遷移
    router.push('/result?type=zodiac');
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
          <h1 className="text-4xl font-bold text-gradient mb-2">⭐ 星座占い</h1>
          <p className="text-white/80">星々の配置があなたの今日の運勢を教えます</p>
        </div>
      </motion.header>

      {/* メインコンテンツ */}
      <main className="flex-1 px-4 pb-8">
        <AnimatePresence mode="wait">
          {currentStep === 'select' && (
            <motion.div
              key="sign-selection"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, x: -100 }}
              className="max-w-6xl mx-auto"
            >
              <motion.div variants={itemVariants} className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gold-400 mb-4">あなたの星座を選択してください</h2>
                <p className="text-white/70">生年月日に対応する星座をクリックしてください</p>
              </motion.div>

              <ZodiacSelector
                selectedSign={selectedSign}
                onSignSelect={handleSignSelect}
              />

              {selectedSign && (
                <motion.div
                  className="text-center mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="glass-effect rounded-2xl p-6 max-w-2xl mx-auto border-2 border-gold-400/30 mb-6">
                    <h3 className="text-xl font-bold text-gold-400 mb-2">
                      {selectedSign.symbol} {selectedSign.name}
                    </h3>
                    <p className="text-white/80 mb-2">{selectedSign.period}</p>
                    <p className="text-white/70 text-sm">{selectedSign.description}</p>
                  </div>
                  
                  <Button
                    onClick={handleComplete}
                    size="lg"
                    className="animate-pulse shadow-lg shadow-gold-400/50"
                  >
                    今日の運勢を占う
                  </Button>
                </motion.div>
              )}
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
                星々があなたの運勢を読み取っています...
              </motion.p>
              <motion.div
                className="flex gap-4 mt-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              >
                {['⭐', '🌟', '✨', '💫'].map((star, index) => (
                  <motion.span
                    key={index}
                    className="text-2xl"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: index * 0.25
                    }}
                  >
                    {star}
                  </motion.span>
                ))}
              </motion.div>
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