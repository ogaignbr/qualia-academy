import { useMemo, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { courses } from "../data/courses";
import type { CourseId, QuizQuestion } from "../data/types";
import { recordAttempt } from "../lib/storage";

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function QuizPage() {
  const { courseId } = useParams<{ courseId: CourseId }>();
  const navigate = useNavigate();
  const course = courseId ? courses[courseId] : undefined;

  const [round, setRound] = useState(0);
  const questions = useMemo<QuizQuestion[]>(() => {
    if (!course) return [];
    return shuffle(course.pool).slice(0, course.drawCount);
    // round を依存に入れて再受験で引き直す
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course, round]);

  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    new Array(course?.drawCount ?? 0).fill(null),
  );
  const [current, setCurrent] = useState(0);
  const [phase, setPhase] = useState<"taking" | "result">("taking");

  const finish = useCallback(
    (finalAnswers: (number | null)[]) => {
      if (!course) return;
      const correct = questions.reduce(
        (acc, q, i) => acc + (finalAnswers[i] === q.answer ? 1 : 0),
        0,
      );
      const total = questions.length;
      const score = Math.round((correct / total) * 100);
      const passed = score >= Math.round(course.passRate * 100);
      recordAttempt({
        courseId: course.id,
        correct,
        total,
        score,
        passed,
        dateISO: new Date().toISOString(),
      });
      setPhase("result");
      window.scrollTo({ top: 0 });
    },
    [course, questions],
  );

  const retake = () => {
    setRound((r) => r + 1);
    setAnswers(new Array(course?.drawCount ?? 0).fill(null));
    setCurrent(0);
    setPhase("taking");
    window.scrollTo({ top: 0 });
  };

  if (!course) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-navy-700">コースが見つかりませんでした。</p>
        <Link to="/" className="text-gold-500 mt-4 inline-block">
          ホームへ戻る
        </Link>
      </div>
    );
  }

  // ===== 結果画面 =====
  if (phase === "result") {
    const correct = questions.reduce(
      (acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0),
      0,
    );
    const total = questions.length;
    const score = Math.round((correct / total) * 100);
    const passLine = Math.round(course.passRate * 100);
    const passed = score >= passLine;

    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div
          className={`rounded-2xl p-8 text-center text-white ${
            passed ? "bg-navy-900" : "bg-navy-700"
          }`}
        >
          <p className="eyebrow text-xs text-gold-300">{course.titleEn} ・ RESULT</p>
          <p className="script text-gold-300 text-3xl mt-1">
            {passed ? "Congratulations" : "Keep going"}
          </p>
          <p className="mincho text-5xl font-extrabold mt-3">{score}点</p>
          <p className="text-sm text-navy-100 mt-2">
            {total}問中 {correct}問正解（合格ライン {passLine}点）
          </p>
          <p
            className={`mt-4 inline-block px-5 py-1.5 rounded-full text-sm font-bold ${
              passed ? "bg-gold-400 text-navy-900" : "bg-navy-900/60 text-white"
            }`}
          >
            {passed ? "合格！" : "不合格 — 解説を見て再挑戦しましょう"}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          {passed && (
            <button
              onClick={() => navigate(`/certificate/${course.id}`)}
              className="px-6 py-3 rounded-full bg-gold-400 text-navy-900 font-medium hover:bg-gold-300"
            >
              修了証を発行する →
            </button>
          )}
          <button
            onClick={retake}
            className="px-6 py-3 rounded-full border border-navy-300 text-navy-800 hover:bg-navy-50"
          >
            もう一度受ける
          </button>
          <Link
            to="/"
            className="px-6 py-3 rounded-full border border-navy-200 text-navy-600 hover:bg-navy-50"
          >
            ホームへ
          </Link>
        </div>

        {/* 各問の正誤と解説 */}
        <h3 className="mincho text-xl font-bold text-navy-900 mt-10 rule-under">
          解説と補足
        </h3>
        <ol className="mt-6 space-y-5">
          {questions.map((q, i) => {
            const ua = answers[i];
            const ok = ua === q.answer;
            return (
              <li
                key={q.id}
                className={`rounded-xl border p-5 ${
                  ok ? "border-navy-100 bg-white" : "border-gold-300 bg-gold-300/10"
                }`}
              >
                <div className="flex items-start gap-2">
                  <span
                    className={`mt-0.5 shrink-0 w-6 h-6 rounded-full text-white text-xs flex items-center justify-center ${
                      ok ? "bg-navy-600" : "bg-gold-500"
                    }`}
                  >
                    {ok ? "○" : "×"}
                  </span>
                  <p className="font-medium text-navy-900">
                    Q{i + 1}. {q.question}
                  </p>
                </div>
                <div className="mt-3 ml-8 space-y-1 text-sm">
                  <p className="text-navy-800">
                    正解：<strong>{q.choices[q.answer]}</strong>
                  </p>
                  {!ok && (
                    <p className="text-navy-500">
                      あなたの回答：
                      {ua !== null ? q.choices[ua] : "（未回答）"}
                    </p>
                  )}
                  <p className="text-navy-700 mt-2 leading-relaxed">
                    💡 {q.explanation}
                  </p>
                  <p className="text-navy-600 leading-relaxed">補足：{q.supplement}</p>
                  <p className="text-[0.7rem] text-navy-400 mt-1">根拠：{q.source}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    );
  }

  // ===== 受験画面（1問ずつ） =====
  const q = questions[current];
  const selected = answers[current];
  const isLast = current === questions.length - 1;
  const progress = Math.round(((current + (selected !== null ? 1 : 0)) / questions.length) * 100);

  const choose = (idx: number) => {
    setAnswers((prev) => {
      const next = prev.slice();
      next[current] = idx;
      return next;
    });
  };

  const goNext = () => {
    if (isLast) {
      finish(answers);
    } else {
      setCurrent((c) => c + 1);
      window.scrollTo({ top: 0 });
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="flex items-center justify-between text-sm text-navy-600">
        <Link to="/" className="hover:text-gold-500">
          ← 中断してホームへ
        </Link>
        <span>
          {current + 1} / {questions.length}
        </span>
      </div>
      <h1 className="mincho text-xl font-bold text-navy-900 mt-2">{course.title}</h1>

      {/* 進捗バー */}
      <div className="mt-3 h-1.5 bg-navy-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gold-400 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-8 bg-white rounded-2xl border border-navy-100 shadow-sm p-6 md:p-8">
        <p className="eyebrow text-[0.65rem] text-gold-500">
          Question {current + 1}
        </p>
        <p className="mincho text-lg md:text-xl font-bold text-navy-900 mt-1 leading-relaxed">
          {q.question}
        </p>

        <div className="mt-6 space-y-3">
          {q.choices.map((c, idx) => {
            const active = selected === idx;
            return (
              <button
                key={idx}
                onClick={() => choose(idx)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-colors flex items-center gap-3 ${
                  active
                    ? "border-navy-700 bg-navy-900 text-white"
                    : "border-navy-200 hover:border-navy-400 hover:bg-navy-50 text-navy-800"
                }`}
              >
                <span
                  className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    active ? "bg-gold-400 text-navy-900" : "bg-navy-100 text-navy-600"
                  }`}
                >
                  {["ア", "イ", "ウ", "エ"][idx] ?? idx + 1}
                </span>
                <span className="text-sm">{c}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={() => {
            setCurrent((c) => Math.max(0, c - 1));
            window.scrollTo({ top: 0 });
          }}
          disabled={current === 0}
          className="px-5 py-2.5 rounded-full border border-navy-200 text-navy-600 disabled:opacity-40 hover:bg-navy-50"
        >
          前へ
        </button>
        <button
          onClick={goNext}
          disabled={selected === null}
          className="px-7 py-2.5 rounded-full bg-navy-900 text-white disabled:opacity-40 hover:bg-navy-800"
        >
          {isLast ? "採点する" : "次へ"}
        </button>
      </div>
    </div>
  );
}
