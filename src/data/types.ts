// ===== 共通データ型 =====

export type Person = "寺口泰海" | "菅野航" | "神農晶";

export interface Principle {
  id: string;
  person: Person;
  /** 役職表示 */
  role: string;
  /** テーマ（フィルタ用） */
  theme: string;
  /** 中核の言葉 */
  quote: string;
  /** 短い解説 */
  body: string;
  /** 出典動画タイトル */
  videoTitle: string;
  /** 出典動画URL */
  videoUrl: string;
}

export type CourseId = "beginner" | "leader";

export interface QuizQuestion {
  id: string;
  question: string;
  choices: string[];
  /** 正解の選択肢インデックス */
  answer: number;
  /** なぜそうなのかの解説 */
  explanation: string;
  /** 補足（正しい言い方・根拠など） */
  supplement: string;
  /** 根拠（法令・出典） */
  source: string;
}

export interface Course {
  id: CourseId;
  title: string;
  subtitle: string;
  titleEn: string;
  description: string;
  /** プールから出題する問題数 */
  drawCount: number;
  /** 合格率（0-1） */
  passRate: number;
  pool: QuizQuestion[];
}
