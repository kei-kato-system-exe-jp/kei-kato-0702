// 占い結果の基本型
export interface FortuneResult {
  title: string;
  description: string;
  advice: string;
  lucky?: {
    color?: string;
    number?: number;
    item?: string;
    direction?: string;
  };
  timestamp: string;
}

// タロットカード型
export interface TarotCard {
  id: number;
  name: string;
  uprightMeaning: string;
  reversedMeaning: string;
  symbol?: string;
}

// タロット占い結果型
export interface TarotResult extends FortuneResult {
  cards: {
    card: TarotCard;
    position: string;
    isReversed: boolean;
    meaning: string;
  }[];
  spread: 'oneCard' | 'threeCard';
}

// 星座型
export interface ZodiacSign {
  id: number;
  name: string;
  symbol: string;
  element: '火' | '土' | '風' | '水';
  period: string;
  description: string;
  traits: {
    positive: string[];
    negative: string[];
  };
  compatibility: string[];
  luckyItems: string[];
  advice: string;
}

// 星座占い結果型
export interface ZodiacResult extends FortuneResult {
  sign: ZodiacSign;
  todaysFortune: {
    level: string;
    love: string;
    work: string;
    health: string;
    money: string;
  };
}

// おみくじ結果型
export interface OmikujiResult extends FortuneResult {
  level: '大吉' | '中吉' | '小吉' | '末吉' | '凶' | '大凶';
  fortune: {
    love: string;
    work: string;
    health: string;
    money: string;
  };
  warning?: string;
}

// 数秘術結果型
export interface NumerologyResult extends FortuneResult {
  lifePathNumber: number;
  calculation: {
    birthDate: string;
    steps: string[];
    finalNumber: number;
  };
  personality: {
    strengths: string[];
    challenges: string[];
    lifeGoal: string;
  };
}

// 占いの種類
export type FortuneType = 'tarot' | 'zodiac' | 'omikuji' | 'numerology';

// 占いセッション型
export interface FortuneSession {
  id: string;
  type: FortuneType;
  result: FortuneResult;
  createdAt: string;
}

// アニメーション設定型
export interface AnimationConfig {
  duration: number;
  delay?: number;
  easing?: string;
}

// UI状態型
export interface UIState {
  isLoading: boolean;
  error: string | null;
  currentStep: number;
  totalSteps: number;
}

// フォーム入力型
export interface DateInput {
  year: number | null;
  month: number | null;
  day: number | null;
}

// カード選択状態型
export interface CardSelection {
  selectedCards: number[];
  maxCards: number;
  isComplete: boolean;
}

// 占いエンジン設定型
export interface FortuneEngineConfig {
  enableAnimations: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';
  theme: 'dark' | 'light' | 'mystic';
  language: 'ja' | 'en';
}