// Tailwind CSS クラス名を結合するユーティリティ
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

// ランダム要素選択
export function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// ランダム数値生成
export function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 配列シャッフル
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// 日付フォーマット
export function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    weekday: 'long'
  };
  return date.toLocaleDateString('ja-JP', options);
}

// 遅延関数
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 確率に基づく選択
export function selectByProbability<T extends { probability: number }>(items: T[]): T {
  const random = Math.random();
  let cumulative = 0;
  
  for (const item of items) {
    cumulative += item.probability;
    if (random <= cumulative) {
      return item;
    }
  }
  
  // フォールバック（最後の要素を返す）
  return items[items.length - 1];
}

// 文字列の切り詰め
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// 現在の季節を取得
export function getCurrentSeason(): '春' | '夏' | '秋' | '冬' {
  const month = new Date().getMonth() + 1;
  
  if (month >= 3 && month <= 5) return '春';
  if (month >= 6 && month <= 8) return '夏';
  if (month >= 9 && month <= 11) return '秋';
  return '冬';
}

// 現在の時間帯を取得
export function getCurrentTimeOfDay(): '朝' | '昼' | '夕' | '夜' {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) return '朝';
  if (hour >= 12 && hour < 17) return '昼';
  if (hour >= 17 && hour < 21) return '夕';
  return '夜';
}

// ローカルストレージのヘルパー
export const storage = {
  get: <T>(key: string): T | null => {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ストレージが満杯の場合などのエラーを無視
    }
  },
  
  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  }
};

// セッションストレージのヘルパー
export const sessionStorage = {
  get: <T>(key: string): T | null => {
    if (typeof window === 'undefined') return null;
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ストレージが満杯の場合などのエラーを無視
    }
  },
  
  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    window.sessionStorage.removeItem(key);
  }
};

// アニメーション用のイージング関数
export const easing = {
  easeInOut: (t: number): number => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  },
  
  easeOut: (t: number): number => {
    return 1 - Math.pow(1 - t, 3);
  },
  
  easeIn: (t: number): number => {
    return t * t * t;
  }
};

// デバウンス関数
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// スロットル関数
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}