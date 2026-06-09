import type { Course, CourseId } from "./types";
import { beginnerPool } from "./quizzes/beginner";
import { leaderPool } from "./quizzes/leader";

export const courses: Record<CourseId, Course> = {
  beginner: {
    id: "beginner",
    title: "コンプライアンス 初級編",
    subtitle: "はじめてビジネスをやる方へ",
    titleEn: "COMPLIANCE BASIC",
    description:
      "勧誘の基本ルール・面談・禁止行為・クーリングオフなど、まず必ず押さえる土台。",
    drawCount: 10,
    passRate: 0.8,
    pool: beginnerPool,
  },
  leader: {
    id: "leader",
    title: "コンプライアンス リーダー・プレゼンター編",
    subtitle: "グループを持つ方・人前で説明する方へ",
    titleEn: "COMPLIANCE for LEADERS",
    description:
      "プレゼン表現・SNSの注意点・景表法／薬機法・確定申告・メンバー教育責任まで。",
    drawCount: 10,
    passRate: 0.8,
    pool: leaderPool,
  },
};

export const courseList: Course[] = [courses.beginner, courses.leader];
