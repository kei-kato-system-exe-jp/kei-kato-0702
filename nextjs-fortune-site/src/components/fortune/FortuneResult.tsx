'use client';

import { motion } from 'framer-motion';
import { FortuneResult as FortuneResultType, FortuneType, TarotResult, ZodiacResult, OmikujiResult, NumerologyResult } from '@/types';

interface FortuneResultProps {
  result: FortuneResultType;
  fortuneType: FortuneType;
}

export default function FortuneResult({
  result,
  fortuneType
}: FortuneResultProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };

  const renderTarotResult = (tarotResult: TarotResult) => (
    <motion.div variants={itemVariants} className="space-y-6">
      <div className="glass-effect rounded-2xl p-6 border-2 border-purple-400/30">
        <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2">
          🔮 選択されたカード
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tarotResult.cards.map((cardData, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="bg-white/5 rounded-xl p-4 border border-purple-400/20"
            >
              <div className="text-center mb-3">
                <div className="text-3xl mb-2">{cardData.card.symbol}</div>
                <h4 className="font-bold text-purple-300">{cardData.card.name}</h4>
                <p className="text-sm text-white/60">{cardData.position}</p>
                {cardData.isReversed && (
                  <span className="inline-block px-2 py-1 bg-red-500/20 text-red-300 rounded-full text-xs mt-1">
                    逆位置
                  </span>
                )}
              </div>
              <p className="text-sm text-white/80 leading-relaxed">
                {cardData.meaning}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderZodiacResult = (zodiacResult: ZodiacResult) => (
    <motion.div variants={itemVariants} className="space-y-6">
      <div className="glass-effect rounded-2xl p-6 border-2 border-blue-400/30">
        <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
          ⭐ あなたの星座
        </h3>
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">{zodiacResult.sign.symbol}</div>
          <h4 className="text-2xl font-bold text-blue-300 mb-2">{zodiacResult.sign.name}</h4>
          <p className="text-white/70">{zodiacResult.sign.period}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-xl p-4 border border-red-400/20">
            <h5 className="font-bold text-red-300 mb-2">💕 恋愛運</h5>
            <p className="text-sm text-white/80">{zodiacResult.todaysFortune.love}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-green-400/20">
            <h5 className="font-bold text-green-300 mb-2">💼 仕事運</h5>
            <p className="text-sm text-white/80">{zodiacResult.todaysFortune.work}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-yellow-400/20">
            <h5 className="font-bold text-yellow-300 mb-2">💰 金運</h5>
            <p className="text-sm text-white/80">{zodiacResult.todaysFortune.money}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-pink-400/20">
            <h5 className="font-bold text-pink-300 mb-2">🏥 健康運</h5>
            <p className="text-sm text-white/80">{zodiacResult.todaysFortune.health}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderOmikujiResult = (omikujiResult: OmikujiResult) => {
    const getLevelColor = (level: string) => {
      switch (level) {
        case '大吉': return 'text-yellow-300 bg-yellow-500/20 border-yellow-400';
        case '中吉': return 'text-green-300 bg-green-500/20 border-green-400';
        case '小吉': return 'text-blue-300 bg-blue-500/20 border-blue-400';
        case '末吉': return 'text-purple-300 bg-purple-500/20 border-purple-400';
        case '凶': return 'text-orange-300 bg-orange-500/20 border-orange-400';
        case '大凶': return 'text-red-300 bg-red-500/20 border-red-400';
        default: return 'text-white bg-white/20 border-white';
      }
    };

    return (
      <motion.div variants={itemVariants} className="space-y-6">
        <div className="glass-effect rounded-2xl p-6 border-2 border-green-400/30">
          <div className="text-center mb-6">
            <motion.div
              className={`inline-block px-8 py-4 rounded-2xl border-2 ${getLevelColor(omikujiResult.level)}`}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-3xl font-bold">{omikujiResult.level}</span>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-xl p-4 border border-red-400/20">
              <h5 className="font-bold text-red-300 mb-2">💕 恋愛</h5>
              <p className="text-sm text-white/80">{omikujiResult.fortune.love}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-green-400/20">
              <h5 className="font-bold text-green-300 mb-2">💼 仕事</h5>
              <p className="text-sm text-white/80">{omikujiResult.fortune.work}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-yellow-400/20">
              <h5 className="font-bold text-yellow-300 mb-2">💰 金運</h5>
              <p className="text-sm text-white/80">{omikujiResult.fortune.money}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-pink-400/20">
              <h5 className="font-bold text-pink-300 mb-2">🏥 健康</h5>
              <p className="text-sm text-white/80">{omikujiResult.fortune.health}</p>
            </div>
          </div>

          {omikujiResult.warning && (
            <div className="mt-4 p-4 bg-orange-500/20 border border-orange-400/50 rounded-xl">
              <h5 className="font-bold text-orange-300 mb-2">⚠️ 注意事項</h5>
              <p className="text-sm text-white/80">{omikujiResult.warning}</p>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const renderNumerologyResult = (numerologyResult: NumerologyResult) => (
    <motion.div variants={itemVariants} className="space-y-6">
      <div className="glass-effect rounded-2xl p-6 border-2 border-orange-400/30">
        <h3 className="text-xl font-bold text-orange-400 mb-4 flex items-center gap-2">
          🔢 ライフパスナンバー
        </h3>
        <div className="text-center mb-6">
          <motion.div
            className="inline-block w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mb-4"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <span className="text-4xl font-bold text-white">{numerologyResult.lifePathNumber}</span>
          </motion.div>
          <p className="text-white/70">{numerologyResult.calculation.birthDate}</p>
        </div>

        <div className="bg-white/5 rounded-xl p-4 border border-orange-400/20 mb-6">
          <h5 className="font-bold text-orange-300 mb-3">🧮 計算過程</h5>
          <div className="space-y-2">
            {numerologyResult.calculation.steps.map((step, index) => (
              <div key={index} className="text-sm text-white/80 font-mono">
                {step}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-xl p-4 border border-green-400/20">
            <h5 className="font-bold text-green-300 mb-3">💪 長所</h5>
            <ul className="space-y-1">
              {numerologyResult.personality.strengths.map((strength, index) => (
                <li key={index} className="text-sm text-white/80 flex items-center gap-2">
                  <span className="text-green-400">•</span>
                  {strength}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-yellow-400/20">
            <h5 className="font-bold text-yellow-300 mb-3">⚡ 課題</h5>
            <ul className="space-y-1">
              {numerologyResult.personality.challenges.map((challenge, index) => (
                <li key={index} className="text-sm text-white/80 flex items-center gap-2">
                  <span className="text-yellow-400">•</span>
                  {challenge}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-4 p-4 bg-purple-500/20 border border-purple-400/50 rounded-xl">
          <h5 className="font-bold text-purple-300 mb-2">🎯 人生の目標</h5>
          <p className="text-sm text-white/80">{numerologyResult.personality.lifeGoal}</p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      className="max-w-6xl mx-auto space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* メイン結果 */}
      <motion.div variants={itemVariants}>
        <div className="glass-effect rounded-2xl p-8 border-2 border-gold-400/30 text-center">
          <motion.h2
            className="text-3xl font-bold text-gradient mb-4"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {result.title}
          </motion.h2>
          <p className="text-xl text-white/90 mb-6 leading-relaxed">
            {result.description}
          </p>
          <div className="inline-block px-6 py-3 bg-gold-400/20 border border-gold-400/50 rounded-full">
            <span className="text-gold-300 font-bold">
              {new Date(result.timestamp).toLocaleDateString('ja-JP')} の結果
            </span>
          </div>
        </div>
      </motion.div>

      {/* 占い種別ごとの詳細結果 */}
      {fortuneType === 'tarot' && renderTarotResult(result as TarotResult)}
      {fortuneType === 'zodiac' && renderZodiacResult(result as ZodiacResult)}
      {fortuneType === 'omikuji' && renderOmikujiResult(result as OmikujiResult)}
      {fortuneType === 'numerology' && renderNumerologyResult(result as NumerologyResult)}

      {/* アドバイス */}
      <motion.div variants={itemVariants}>
        <div className="glass-effect rounded-2xl p-6 border-2 border-gold-400/30">
          <h3 className="text-xl font-bold text-gold-400 mb-4 flex items-center gap-2">
            💡 アドバイス
          </h3>
          <p className="text-white/90 leading-relaxed text-lg">
            {result.advice}
          </p>
        </div>
      </motion.div>

      {/* ラッキーアイテム */}
      {result.lucky && (
        <motion.div variants={itemVariants}>
          <div className="glass-effect rounded-2xl p-6 border-2 border-gold-400/30">
            <h3 className="text-xl font-bold text-gold-400 mb-4 flex items-center gap-2">
              🍀 今日のラッキーアイテム
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {result.lucky.color && (
                <div className="text-center p-4 bg-white/5 rounded-xl border border-gold-400/20">
                  <div className="text-2xl mb-2">🎨</div>
                  <h4 className="font-bold text-gold-300 mb-1">ラッキーカラー</h4>
                  <p className="text-white/80">{result.lucky.color}</p>
                </div>
              )}
              {result.lucky.number && (
                <div className="text-center p-4 bg-white/5 rounded-xl border border-gold-400/20">
                  <div className="text-2xl mb-2">🔢</div>
                  <h4 className="font-bold text-gold-300 mb-1">ラッキーナンバー</h4>
                  <p className="text-white/80">{result.lucky.number}</p>
                </div>
              )}
              {result.lucky.item && (
                <div className="text-center p-4 bg-white/5 rounded-xl border border-gold-400/20">
                  <div className="text-2xl mb-2">✨</div>
                  <h4 className="font-bold text-gold-300 mb-1">ラッキーアイテム</h4>
                  <p className="text-white/80">{result.lucky.item}</p>
                </div>
              )}
              {result.lucky.direction && (
                <div className="text-center p-4 bg-white/5 rounded-xl border border-gold-400/20">
                  <div className="text-2xl mb-2">🧭</div>
                  <h4 className="font-bold text-gold-300 mb-1">ラッキー方角</h4>
                  <p className="text-white/80">{result.lucky.direction}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}