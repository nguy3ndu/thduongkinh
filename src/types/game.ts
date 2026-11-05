export type GameType = 'matching' | 'memory' | 'wheel' | 'quiz';

export type AspectRatio = '16:9' | '4:3' | '1:1' | 'portrait';

export interface MatchPair {
  id: string;
  // Left element (Source object / question / text)
  leftText?: string;
  leftImage?: string;
  // Right element (Target location / answer / image)
  rightText?: string;
  rightImage?: string;
  // Feedback when matched correctly
  hint?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  image?: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
}

export interface WheelItem {
  id: string;
  text: string;
  color?: string;
  weight?: number;
}

export interface MemoryCardItem {
  id: string;
  pairKey: string;
  text?: string;
  image?: string;
}

export interface Game {
  id: string;
  title: string;
  type: GameType;
  description: string;
  gradeLevel: string; // e.g. "Lớp 1", "Lớp 2", "Lớp 3", "Lớp 4", "Lớp 5", "Toàn trường"
  subject: string; // "Tiếng Việt", "Toán", "Tự nhiên & Xã hội", "Địa phương Hải Phòng", "Hoạt động trải nghiệm"
  thumbnail: string;
  aspectRatio: AspectRatio; // Specifically customizable per game as requested!
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isCustom?: boolean;

  // Game specific data
  matchPairs?: MatchPair[];
  quizQuestions?: QuizQuestion[];
  wheelItems?: WheelItem[];
  memoryPairs?: MatchPair[];

  // Settings
  timeLimitSeconds?: number; // 0 = no limit
  passingScore?: number;
  mascotName?: string;
  instruction?: string;
}

export interface GameResult {
  gameId: string;
  score: number;
  totalScore: number;
  timeSpentSeconds: number;
  completedAt: string;
  stars: number;
}
