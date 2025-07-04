'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { numerologyData, calculateLifePathNumber, getCalculationSteps } from '@/lib/data/numerology';
import { NumerologyResult, DateInput } from '@/types';
import NumerologyForm from '@/components/fortune/NumerologyForm';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function NumerologyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<'input' | 'loading' | 'result'>('input');
  const [dateInput, setDateInput] = useState<DateInput>({
    year: null,
    month: null,
    day: null
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleDateChange = (field: keyof DateInput, value: number | null) => {
    setDateInput(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isValidDate = () => {
    const { year, month, day } = dateInput;
    if (!year || !month || !day) return false;
    
    // 基本的な日付検証
    if (year < 1900 || year > new Date().getFullYear()) return false;
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    
    // 月ごとの日数チェック
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day > daysInMonth) return false;
    
    return true;
  };

  const handleCalculate = async () => {
    if (!isValidDate()) return;

    setIsLoading(true);
    setCurrentStep('loading');
    
    // 計算アニメーション用の遅延
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const { year, month, day } = dateInput;
    const birthDate = new Date(year!, month! - 1, day!);
    const lifePathNumber = calculateLifePathNumber(birthDate);
    const calculationSteps = getCalculationSteps(year!, month!, day!);
    const numerologyInfo = numerologyData[lifePathNumber as keyof typeof numerologyData];

    // 結果データを作成
    const result: NumerologyResult = {
      title: `あなたのライフパスナンバー: ${lifePathNumber}`,
      description: numerologyInfo.description,
      advice: numerologyInfo.advice,
      lifePathNumber,
      calculation: {
        birthDate: `${year}年${month}月${day}日`,
        steps: calculationSteps,
        finalNumber: lifePathNumber
      },
      personality: numerologyInfo.personality,
      timestamp: new Date().toISOString(),
      lucky: {
        color: numerologyInfo.luckyColor,
        number: lifePathNumber,
        item: numerologyInfo.luckyItem,
        direction: ['北', '南', '東', '西'][Math.floor(Math.random() * 4)]
      }
    };

    // 結果をローカルストレージに保存
    localStorage.setItem('numerology-result', JSON.stringify(result));
    
    // 結果ページに遷移
    router.push('/result?type=numerology');
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
          <h1 className="text-4xl font-bold text-gradient mb-2">🔢 数秘術</h1>
          <p className="text-white/80">あなたの生年月日から運命の数字を導き出します</p>
        </div>
      </motion.header>

      {/* メインコンテンツ */}
      <main className="flex-1 px-4 pb-8">
        <AnimatePresence mode="wait">
          {currentStep === 'input' && (
            <motion.div
              key="input"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, x: -100 }}
              className="max-w-4xl mx-auto"
            >
              <motion.div variants={itemVariants} className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gold-400 mb-4">生年月日を入力してください</h2>
                <p className="text-white/70">
                  数秘術では、あなたの生年月日から「ライフパスナンバー」を計算し、<br />
                  人生の目的や性格の特徴を読み解きます。
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="mb-8">
                <NumerologyForm
                  dateInput={dateInput}
                  onDateChange={handleDateChange}
                  isValid={isValidDate()}
                />
              </motion.div>

              {isValidDate() && (
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    onClick={handleCalculate}
                    size="lg"
                    className="animate-pulse shadow-lg shadow-gold-400/50"
                  >
                    ライフパスナンバーを計算する
                  </Button>
                </motion.div>
              )}

              {/* 数秘術の説明 */}
              <motion.div
                variants={itemVariants}
                className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                <div className="glass-effect rounded-xl p-6 border border-gold-400/30">
                  <div className="text-3xl mb-4 text-center">🔮</div>
                  <h3 className="text-gold-400 font-bold mb-3 text-center">数秘術とは</h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    古代から伝わる占術で、数字に宿る神秘的な力を使って人の運命や性格を読み解きます。
                  </p>
                </div>
                <div className="glass-effect rounded-xl p-6 border border-gold-400/30">
                  <div className="text-3xl mb-4 text-center">🎯</div>
                  <h3 className="text-gold-400 font-bold mb-3 text-center">ライフパスナンバー</h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    生年月日から計算される最も重要な数字で、あなたの人生の目的や使命を表します。
                  </p>
                </div>
                <div className="glass-effect rounded-xl p-6 border border-gold-400/30">
                  <div className="text-3xl mb-4 text-center">✨</div>
                  <h3 className="text-gold-400 font-bold mb-3 text-center">活用方法</h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    自分の特性を理解し、人生の選択や人間関係の改善に活かすことができます。
                  </p>
                </div>
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
                className="text-xl text-gold-400 mt-6 mb-4"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ライフパスナンバーを計算しています...
              </motion.p>
              
              {/* 計算過程のアニメーション */}
              <motion.div
                className="flex items-center gap-4 text-white/70"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <span>{dateInput.year}</span>
                <span>+</span>
                <span>{dateInput.month}</span>
                <span>+</span>
                <span>{dateInput.day}</span>
                <span>=</span>
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  ?
                </motion.span>
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

      {/* 背景装飾 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num, i) => (
          <motion.div
            key={i}
            className="absolute text-gold-400/20 font-bold"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 40 + 30}px`
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.3, 0.1],
              rotate: [0, 360]
            }}
            transition={{
              duration: Math.random() * 8 + 6,
              repeat: Infinity,
              delay: Math.random() * 4
            }}
          >
            {num}
          </motion.div>
        ))}
      </div>
    </div>
  );
}