import { Link } from "react-router-dom";
import SectionHeading from "../components/SectionHeading";
import { courseList } from "../data/courses";
import {
  getAttempts,
  getCourseSummary,
  getCertificates,
  formatJpDate,
} from "../lib/storage";

export default function HistoryPage() {
  const attempts = getAttempts();
  const certificates = getCertificates();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <SectionHeading en="My Record" title="受講履歴・修了証" />

      {/* コース別サマリー */}
      <div className="mt-6 grid sm:grid-cols-2 gap-4">
        {courseList.map((c) => {
          const s = getCourseSummary(c.id);
          return (
            <div
              key={c.id}
              className="rounded-xl border border-navy-100 bg-white p-5"
            >
              <p className="eyebrow text-[0.6rem] text-gold-500">{c.titleEn}</p>
              <h3 className="mincho text-base font-bold text-navy-900 mt-1">
                {c.title}
              </h3>
              <div className="mt-3 text-sm text-navy-700 space-y-1">
                <p>
                  状態：
                  {s.passed ? (
                    <span className="text-navy-900 font-bold">合格済み</span>
                  ) : s.attempts > 0 ? (
                    <span className="text-gold-600">未合格</span>
                  ) : (
                    <span className="text-navy-400">未受験</span>
                  )}
                </p>
                <p>受験回数：{s.attempts} 回</p>
                {s.attempts > 0 && <p>最高スコア：{s.bestScore} 点</p>}
                {s.lastPassedISO && (
                  <p className="text-xs text-navy-500">
                    合格日：{formatJpDate(s.lastPassedISO)}
                  </p>
                )}
              </div>
              <div className="mt-4 flex gap-2">
                <Link
                  to={`/quiz/${c.id}`}
                  className="text-sm px-4 py-2 rounded-lg bg-navy-900 text-white hover:bg-navy-800"
                >
                  受験する
                </Link>
                {s.passed && (
                  <Link
                    to={`/certificate/${c.id}`}
                    className="text-sm px-4 py-2 rounded-lg border border-gold-400 text-navy-800 hover:bg-gold-300/20"
                  >
                    修了証
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 発行済み修了証 */}
      {certificates.length > 0 && (
        <>
          <h3 className="mincho text-lg font-bold text-navy-900 mt-10 rule-under">
            発行済みの修了証
          </h3>
          <ul className="mt-4 space-y-2">
            {certificates.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between rounded-lg border border-navy-100 bg-white px-4 py-3"
              >
                <div className="text-sm">
                  <p className="font-medium text-navy-900">{c.courseTitle}</p>
                  <p className="text-xs text-navy-500">
                    {c.name}（{c.memberNo}）・{formatJpDate(c.issuedAtISO)}・
                    {c.id}
                  </p>
                </div>
                <Link
                  to={`/certificate/${c.courseId}`}
                  className="text-sm text-navy-700 hover:text-gold-500 whitespace-nowrap"
                >
                  再発行 →
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* 受験ログ */}
      <h3 className="mincho text-lg font-bold text-navy-900 mt-10 rule-under">
        受験ログ
      </h3>
      {attempts.length === 0 ? (
        <p className="text-sm text-navy-500 mt-4">
          まだ受験記録がありません。
          <Link to="/quiz/beginner" className="text-gold-500 ml-1">
            初級テストを受ける
          </Link>
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {attempts.map((a, i) => {
            const c = courseList.find((x) => x.id === a.courseId);
            return (
              <li
                key={i}
                className="flex items-center justify-between rounded-lg bg-navy-50 px-4 py-2.5 text-sm"
              >
                <span className="text-navy-800">
                  {c?.title ?? a.courseId}
                </span>
                <span className="flex items-center gap-3">
                  <span className="text-navy-600">{a.score}点</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      a.passed
                        ? "bg-navy-900 text-white"
                        : "bg-navy-200 text-navy-700"
                    }`}
                  >
                    {a.passed ? "合格" : "不合格"}
                  </span>
                  <span className="text-xs text-navy-400">
                    {formatJpDate(a.dateISO)}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
