'use client';

import { motion } from 'framer-motion';
import { DateInput } from '@/types';

interface NumerologyFormProps {
  dateInput: DateInput;
  onDateChange: (field: keyof DateInput, value: number | null) => void;
  isValid: boolean;
}

export default function NumerologyForm({
  dateInput,
  onDateChange,
  isValid
}: NumerologyFormProps) {
  const currentYear = new Date().getFullYear();
  
  const handleInputChange = (field: keyof DateInput, value: string) => {
    const numValue = value === '' ? null : parseInt(value, 10);
    onDateChange(field, numValue);
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
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };

  const inputVariants = {
    focus: {
      scale: 1.02,
      boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="glass-effect rounded-2xl p-8 border-2 border-gold-400/30">
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h3 className="text-xl font-bold text-gold-400 mb-2">生年月日入力</h3>
          <p className="text-white/70 text-sm">正確な生年月日を入力してください</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 年入力 */}
          <motion.div variants={itemVariants}>
            <label className="block text-gold-400 font-bold mb-3 text-center">
              年 (Year)
            </label>
            <motion.div
              className="relative"
              whileFocus="focus"
              variants={inputVariants}
            >
              <input
                type="number"
                min="1900"
                max={currentYear}
                value={dateInput.year || ''}
                onChange={(e) => handleInputChange('year', e.target.value)}
                placeholder="1990"
                className="w-full px-4 py-3 bg-white/10 border-2 border-gold-400/50 rounded-xl text-white text-center text-lg font-bold placeholder-white/40 focus:outline-none focus:border-gold-400 focus:bg-white/20 transition-all duration-300"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gold-400/0 via-gold-400/10 to-gold-400/0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
            <p className="text-xs text-white/50 text-center mt-2">
              1900 - {currentYear}
            </p>
          </motion.div>

          {/* 月入力 */}
          <motion.div variants={itemVariants}>
            <label className="block text-gold-400 font-bold mb-3 text-center">
              月 (Month)
            </label>
            <motion.div
              className="relative"
              whileFocus="focus"
              variants={inputVariants}
            >
              <input
                type="number"
                min="1"
                max="12"
                value={dateInput.month || ''}
                onChange={(e) => handleInputChange('month', e.target.value)}
                placeholder="12"
                className="w-full px-4 py-3 bg-white/10 border-2 border-gold-400/50 rounded-xl text-white text-center text-lg font-bold placeholder-white/40 focus:outline-none focus:border-gold-400 focus:bg-white/20 transition-all duration-300"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gold-400/0 via-gold-400/10 to-gold-400/0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
            <p className="text-xs text-white/50 text-center mt-2">
              1 - 12
            </p>
          </motion.div>

          {/* 日入力 */}
          <motion.div variants={itemVariants}>
            <label className="block text-gold-400 font-bold mb-3 text-center">
              日 (Day)
            </label>
            <motion.div
              className="relative"
              whileFocus="focus"
              variants={inputVariants}
            >
              <input
                type="number"
                min="1"
                max="31"
                value={dateInput.day || ''}
                onChange={(e) => handleInputChange('day', e.target.value)}
                placeholder="25"
                className="w-full px-4 py-3 bg-white/10 border-2 border-gold-400/50 rounded-xl text-white text-center text-lg font-bold placeholder-white/40 focus:outline-none focus:border-gold-400 focus:bg-white/20 transition-all duration-300"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gold-400/0 via-gold-400/10 to-gold-400/0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
            <p className="text-xs text-white/50 text-center mt-2">
              1 - 31
            </p>
          </motion.div>
        </div>

        {/* 入力状態表示 */}
        <motion.div
          className="mt-8 text-center"
          variants={itemVariants}
        >
          {dateInput.year && dateInput.month && dateInput.day ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 ${
                isValid 
                  ? 'border-green-400 bg-green-400/20 text-green-300' 
                  : 'border-red-400 bg-red-400/20 text-red-300'
              }`}
            >
              <span className="text-lg">
                {isValid ? '✓' : '⚠️'}
              </span>
              <span className="font-bold">
                {dateInput.year}年{dateInput.month}月{dateInput.day}日
              </span>
              {!isValid && (
                <span className="text-sm ml-2">
                  (無効な日付です)
                </span>
              )}
            </motion.div>
          ) : (
            <div className="text-white/50">
              生年月日を入力してください
            </div>
          )}
        </motion.div>

        {/* 計算プレビュー */}
        {isValid && (
          <motion.div
            className="mt-6 p-4 bg-white/5 rounded-xl border border-gold-400/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-gold-400 font-bold text-center mb-3">計算プレビュー</h4>
            <div className="text-center text-white/70">
              <span className="font-mono text-lg">
                {dateInput.year} + {dateInput.month} + {dateInput.day} = ?
              </span>
            </div>
            <p className="text-xs text-white/50 text-center mt-2">
              この数字からライフパスナンバーを計算します
            </p>
          </motion.div>
        )}
      </div>

      {/* 入力ヒント */}
      <motion.div
        className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"
        variants={containerVariants}
      >
        <motion.div
          variants={itemVariants}
          className="glass-effect rounded-xl p-4 border border-gold-400/20"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xl">💡</span>
            <h4 className="text-gold-400 font-bold">入力のコツ</h4>
          </div>
          <p className="text-white/70 text-sm">
            正確な生年月日を入力することで、より精密な数秘術診断が可能になります。
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="glass-effect rounded-xl p-4 border border-gold-400/20"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xl">🔒</span>
            <h4 className="text-gold-400 font-bold">プライバシー</h4>
          </div>
          <p className="text-white/70 text-sm">
            入力された情報は占い結果の計算にのみ使用され、保存されません。
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}