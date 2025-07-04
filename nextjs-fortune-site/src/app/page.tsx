'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const fortuneTypes = [
  {
    id: 'tarot',
    title: 'タロット占い',
    icon: '🔮',
    description: '神秘のタロットカードがあなたの未来を導きます',
    href: '/tarot'
  },
  {
    id: 'zodiac',
    title: '星座占い',
    icon: '⭐',
    description: '星々の配置があなたの今日の運勢を教えます',
    href: '/zodiac'
  },
  {
    id: 'omikuji',
    title: 'おみくじ',
    icon: '🎋',
    description: '古来より伝わる神聖なおみくじで運勢を占います',
    href: '/omikuji'
  },
  {
    id: 'numerology',
    title: '数秘術',
    icon: '🔢',
    description: 'あなたの生年月日から運命の数字を導き出します',
    href: '/numerology'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
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

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  },
  hover: {
    scale: 1.05,
    y: -10,
    transition: {
      duration: 0.3,
      ease: 'easeInOut'
    }
  }
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* ヘッダー */}
      <motion.header
        className="text-center py-16 px-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="glass-effect rounded-3xl p-8 max-w-4xl mx-auto border-2 border-gold-400/30">
          <motion.h1
            className="text-5xl md:text-6xl font-bold text-gradient mb-4 text-shadow"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            神秘の占いサイト
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-white/90 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            あなたの運命を占います
          </motion.p>
        </div>
      </motion.header>

      {/* メインコンテンツ */}
      <main className="flex-1 flex items-center justify-center px-4 pb-16">
        <motion.div
          className="w-full max-w-6xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
          >
            {fortuneTypes.map((fortune, index) => (
              <motion.div
                key={fortune.id}
                variants={cardVariants}
                whileHover="hover"
                className="group"
              >
                <Link href={fortune.href} className="block">
                  <div className="fortune-card h-full min-h-[300px] flex flex-col justify-between relative overflow-hidden">
                    {/* シマーエフェクト */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gold-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 shimmer" />
                    
                    {/* カードアイコン */}
                    <motion.div
                      className="text-6xl mb-6 filter drop-shadow-lg"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      {fortune.icon}
                    </motion.div>
                    
                    {/* カードタイトル */}
                    <motion.h2
                      className="text-2xl font-bold text-gold-400 mb-4"
                      variants={itemVariants}
                    >
                      {fortune.title}
                    </motion.h2>
                    
                    {/* カード説明 */}
                    <motion.p
                      className="text-white/80 text-sm leading-relaxed mb-6 flex-1"
                      variants={itemVariants}
                    >
                      {fortune.description}
                    </motion.p>
                    
                    {/* ボタン */}
                    <motion.button
                      className="btn-primary w-full"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      占いを始める
                    </motion.button>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </main>

      {/* フッター */}
      <motion.footer
        className="text-center py-8 px-4 border-t border-gold-400/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <p className="text-white/60">
          &copy; 2025 神秘の占いサイト. All rights reserved.
        </p>
      </motion.footer>

      {/* 背景装飾 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* 浮遊する星 */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-gold-400/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 10}px`
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          >
            ✨
          </motion.div>
        ))}
      </div>
    </div>
  );
}