import type { CourseId } from "../data/types";

// ===== localStorage による受講記録（サーバー不要・本人端末に保存） =====
// 将来 Supabase 等へ移行しやすいよう、保存形は素直なJSON配列で持つ。

const STORAGE_KEY = "qualia_academy_v1";

export interface Attempt {
  courseId: CourseId;
  correct: number;
  total: number;
  score: number; // 0-100（百分率）
  passed: boolean;
  dateISO: string;
}

export interface Certificate {
  id: string; // 発行ID
  courseId: CourseId;
  courseTitle: string;
  name: string;
  memberNo: string;
  score: number;
  issuedAtISO: string;
}

export interface Profile {
  name: string;
  memberNo: string;
}

interface DailyPick {
  dateKey: string; // YYYY-MM-DD
  principleId: string;
}

interface Store {
  attempts: Attempt[];
  certificates: Certificate[];
  profile?: Profile;
  daily?: DailyPick;
}

function emptyStore(): Store {
  return { attempts: [], certificates: [] };
}

function load(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw) as Partial<Store>;
    return {
      attempts: parsed.attempts ?? [],
      certificates: parsed.certificates ?? [],
      profile: parsed.profile,
      daily: parsed.daily,
    };
  } catch {
    return emptyStore();
  }
}

function save(store: Store): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

// ---- 受講（テスト）記録 ----
export function recordAttempt(a: Attempt): void {
  const s = load();
  s.attempts.push(a);
  save(s);
}

export function getAttempts(): Attempt[] {
  return load().attempts.slice().reverse(); // 新しい順
}

export interface CourseSummary {
  attempts: number;
  bestScore: number;
  passed: boolean;
  lastPassedISO?: string;
}

export function getCourseSummary(courseId: CourseId): CourseSummary {
  const all = load().attempts.filter((a) => a.courseId === courseId);
  if (all.length === 0) {
    return { attempts: 0, bestScore: 0, passed: false };
  }
  const bestScore = Math.max(...all.map((a) => a.score));
  const passedAttempts = all.filter((a) => a.passed);
  return {
    attempts: all.length,
    bestScore,
    passed: passedAttempts.length > 0,
    lastPassedISO: passedAttempts.at(-1)?.dateISO,
  };
}

// ---- 修了証 ----
export function issueCertificate(args: {
  courseId: CourseId;
  courseTitle: string;
  name: string;
  memberNo: string;
  score: number;
}): Certificate {
  const cert: Certificate = {
    id: makeCertificateId(args.courseId, args.memberNo),
    courseId: args.courseId,
    courseTitle: args.courseTitle,
    name: args.name.trim(),
    memberNo: args.memberNo.trim(),
    score: args.score,
    issuedAtISO: new Date().toISOString(),
  };
  const s = load();
  // 同一コース・同一会員番号の既存証があれば置き換え（最新を保持）
  s.certificates = s.certificates.filter(
    (c) => !(c.courseId === cert.courseId && c.memberNo === cert.memberNo),
  );
  s.certificates.push(cert);
  s.profile = { name: cert.name, memberNo: cert.memberNo };
  save(s);
  return cert;
}

export function getCertificates(): Certificate[] {
  return load().certificates.slice().reverse();
}

export function getCertificate(
  courseId: CourseId,
  memberNo?: string,
): Certificate | undefined {
  const list = load().certificates.filter((c) => c.courseId === courseId);
  if (memberNo) return list.find((c) => c.memberNo === memberNo);
  return list.at(-1);
}

// ---- プロフィール（氏名・会員番号の再利用） ----
export function getProfile(): Profile | undefined {
  return load().profile;
}

// ---- デイリーメッセージの「今日の1枚」固定 ----
export function getDailyPrincipleId(
  candidateIds: string[],
  todayKey: string,
): string {
  const s = load();
  if (s.daily && s.daily.dateKey === todayKey) {
    // 候補に残っていればそのまま、無ければ選び直し
    if (candidateIds.includes(s.daily.principleId)) return s.daily.principleId;
  }
  // 日付から決定的に選ぶ（端末によらず同じ日は同じ並び基準）
  const idx = dateSeed(todayKey) % candidateIds.length;
  const principleId = candidateIds[idx];
  s.daily = { dateKey: todayKey, principleId };
  save(s);
  return principleId;
}

// ===== ヘルパー =====
function makeCertificateId(courseId: CourseId, memberNo: string): string {
  const code = courseId === "beginner" ? "B" : "L";
  const d = new Date();
  const ymd = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  const tail = (memberNo.replace(/\D/g, "").slice(-4) || rand4()).padStart(4, "0");
  return `Q-${code}-${ymd}-${tail}`;
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function rand4(): string {
  return Math.floor(Math.random() * 10000).toString();
}

function dateSeed(key: string): number {
  let h = 0;
  for (let i = 0; i < key.length; i++) {
    h = (h * 31 + key.charCodeAt(i)) >>> 0;
  }
  return h;
}

export function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function formatJpDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}
