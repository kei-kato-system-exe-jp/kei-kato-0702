'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { omikujiResults } from '@/lib/data/omikuji';
import { OmikujiResult } from '@/types';
import OmikujiBox from '@/components/fortune/OmikujiBox';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function OmikujiPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<'ready' | 'drawing' | 'loading' | 'result'>('ready');
  const [isDrawing, setIsDrawing] = useState(false);

  const handleDraw = async () => {
    setIsDrawing(true);
    setCurrentStep('drawing');
    
    // おみくじを引くアニメーション
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setCurrentStep('loading');
    
    // 結果計算の遅延
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // おみくじ結果をランダム選択（確率に基づく）
    const random = Math.random();
    let cumulativeProbability = 0;
    let selectedResult = omikujiResults[0];
    
    for (const result of omikujiResults) {
      cumulativeProbability += result.probability;
      if (random <= cumulativeProbability) {
        selectedResult = result;
        break;
      }
    }

    // 結果データを作成
    const result: OmikujiResult = {
      title: `おみくじの結果: ${selectedResult.level}`,
      description: selectedResult.description,
      advice: selectedResult.advice,
      level: selectedResult.level,
      fortune: selectedResult.fortune,
      warning: selectedResult.warning,
      timestamp: new Date().toISOString(),
      lucky: {
        color: selectedResult.luckyColor,
        number: selectedResult.luckyNumber,
        item: selectedResult.luckyItem,
        direction: selectedResult.luckyDirection
      }
    };

    // 結果をローカルストレージに保存
    localStorage.setItem('omikuji-result', JSON.stringify(result));
    
    // 結果ページに遷移
    router.push('/result?type=omikuji');
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
          <h1 className="text-4xl font-bold text-gradient mb-2">🎋 おみくじ</h1>
          <p className="text-white/80">古来より伝わる神聖なおみくじで運勢を占います</p>
        </div>
      </motion.header>

      {/* メインコンテンツ */}
      <main className="flex-1 px-4 pb-8">
        <AnimatePresence mode="wait">
          {currentStep === 'ready' && (
            <motion.div
              key="ready"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.8 }}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.div variants={itemVariants} className="mb-8">
                <h2 className="text-2xl font-bold text-gold-400 mb-4">おみくじを引く準備はできましたか？</h2>
                <p className="text-white/70 mb-6">
                  心を静めて、今日一日の運勢を占いましょう。<br />
                  おみくじ箱をクリックして、運命のおみくじを引いてください。
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="mb-8"
              >
                <OmikujiBox
                  isDrawing={isDrawing}
                  onDraw={handleDraw}
                />
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
              >
                <div className="glass-effect rounded-xl p-4 border border-gold-400/30">
                  <div className="text-2xl mb-2">🙏</div>
                  <h3 className="text-gold-400 font-bold mb-2">心を込めて</h3>
                  <p className="text-white/70 text-sm">真剣な気持ちでおみくじを引きましょう</p>
                </div>
                <div className="glass-effect rounded-xl p-4 border border-gold-400/30">
                  <div className="text-2xl mb-2">🌸</div>
                  <h3 className="text-gold-400 font-bold mb-2">感謝の心</h3>
                  <p className="text-white/70 text-sm">日々の恵みに感謝しながら</p>
                </div>
                <div className="glass-effect rounded-xl p-4 border border-gold-400/30">
                  <div className="text-2xl mb-2">✨</div>
                  <h3 className="text-gold-400 font-bold mb-2">前向きに</h3>
                  <p className="text-white/70 text-sm">結果を前向きに受け止めましょう</p>
                </div>
              </motion.div>
            </motion.div>
          )}

          {currentStep === 'drawing' && (
            <motion.div
              key="drawing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center min-h-[400px]"
            >
              <motion.div
                className="text-8xl mb-6"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity
                }}
              >
                🎋
              </motion.div>
              <motion.p
                className="text-xl text-gold-400 mb-4"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                おみくじを引いています...
              </motion.p>
              <motion.div
                className="flex gap-2"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {['🎋', '🌸', '⛩️', '🕯️'].map((icon, index) => (
                  <motion.span
                    key={index}
                    className="text-2xl"
                    animate={{
                      opacity: [0.3, 1, 0.3],
                      scale: [0.8, 1.2, 0.8]
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: index * 0.2
                    }}
                  >
                    {icon}
                  </motion.span>
                ))}
              </motion.div>
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
                運勢を読み取っています...
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

      {/* 背景装飾 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-gold-400/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 25 + 15}px`
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.4, 0.2],
              rotate: [0, 360]
            }}
            transition={{
              duration: Math.random() * 6 + 4,
              repeat: Infinity,
              delay: Math.random() * 3
            }}
          >
            {['🎋', '🌸', '⛩️', '🕯️', '🙏'][Math.floor(Math.random() * 5)]}
          </motion.div>
        ))}
      </div>
    </div>
  );
}