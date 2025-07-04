'use client';

import { useEffect, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FortuneResult as FortuneResultType, FortuneType } from '@/types';
import FortuneResultComponent from '@/components/fortune/FortuneResult';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

function ResultContent() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<FortuneResultType | null>(null);
  const [fortuneType, setFortuneType] = useState<FortuneType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const type = searchParams.get('type') as FortuneType;
    if (!type) return;

    setFortuneType(type);

    // ローカルストレージから結果を取得
    const storageKey = `${type}-result`;
    const storedResult = localStorage.getItem(storageKey);
    
    if (storedResult) {
      try {
        const parsedResult = JSON.parse(storedResult);
        setResult(parsedResult);
      } catch (error) {
        console.error('結果の読み込みに失敗しました:', error);
      }
    }
    
    setIsLoading(false);
  }, [searchParams]);

  const handleSaveResult = () => {
    if (!result || !fortuneType) return;

    // 結果履歴を保存
    const historyKey = 'fortune-history';
    const existingHistory = localStorage.getItem(historyKey);
    const history = existingHistory ? JSON.parse(existingHistory) : [];
    
    const newEntry = {
      id: Date.now().toString(),
      type: fortuneType,
      result,
      createdAt: new Date().toISOString()
    };
    
    history.unshift(newEntry);
    // 最新10件まで保存
    const limitedHistory = history.slice(0, 10);
    localStorage.setItem(historyKey, JSON.stringify(limitedHistory));
    
    alert('結果を保存しました！');
  };

  const getFortuneTypeInfo = (type: FortuneType) => {
    const info = {
      tarot: { title: 'タロット占い', icon: '🔮', color: 'from-purple-500 to-blue-500' },
      zodiac: { title: '星座占い', icon: '⭐', color: 'from-blue-500 to-cyan-500' },
      omikuji: { title: 'おみくじ', icon: '🎋', color: 'from-green-500 to-teal-500' },
      numerology: { title: '数秘術', icon: '🔢', color: 'from-orange-500 to-red-500' }
    };
    return info[type] || { title: '占い結果', icon: '✨', color: 'from-gold-400 to-gold-600' };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!result || !fortuneType) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold text-gold-400 mb-4">結果が見つかりません</h1>
          <p className="text-white/70 mb-8">
            占い結果が見つかりませんでした。<br />
            もう一度占いを行ってください。
          </p>
          <Link href="/">
            <Button>ホームに戻る</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const typeInfo = getFortuneTypeInfo(fortuneType);

  return (
    <div className="min-h-screen flex flex-col">
      {/* ヘッダー */}
      <motion.header
        className="text-center py-8 px-4"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className={`glass-effect rounded-2xl p-6 max-w-2xl mx-auto border-2 border-gold-400/30 bg-gradient-to-r ${typeInfo.color}/10`}>
          <h1 className="text-4xl font-bold text-gradient mb-2">
            {typeInfo.icon} {typeInfo.title}の結果
          </h1>
          <p className="text-white/80">あなたの運勢をお伝えします</p>
        </div>
      </motion.header>

      {/* メインコンテンツ */}
      <main className="flex-1 px-4 pb-8">
        <FortuneResultComponent
          result={result}
          fortuneType={fortuneType}
        />
      </main>

      {/* アクションボタン */}
      <motion.footer
        className="text-center py-8 px-4 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
          <Button
            onClick={handleSaveResult}
            variant="secondary"
            className="w-full sm:w-auto"
          >
            📱 結果を保存
          </Button>
          <Link href={`/${fortuneType}`} className="w-full sm:w-auto">
            <Button variant="secondary" className="w-full">
              🔄 もう一度占う
            </Button>
          </Link>
          <Link href="/" className="w-full sm:w-auto">
            <Button className="w-full">
              🏠 ホームに戻る
            </Button>
          </Link>
        </div>
        
        <motion.p
          className="text-white/60 text-sm"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          この結果があなたの人生に幸運をもたらしますように ✨
        </motion.p>
      </motion.footer>

      {/* 背景装飾 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-gold-400/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 30 + 20}px`
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.1, 0.3, 0.1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: Math.random() * 10 + 8,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          >
            {typeInfo.icon}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}