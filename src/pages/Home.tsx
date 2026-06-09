import { Link } from "react-router-dom";
import SectionHeading from "../components/SectionHeading";
import DailyMessage from "../components/DailyMessage";
import { courseList } from "../data/courses";
import { getCourseSummary } from "../lib/storage";

const quickLinks = [
  { to: "/principles", label: "考え方", en: "Philosophy" },
  { to: "/quiz/beginner", label: "コンプラ初級", en: "Basic" },
  { to: "/quiz/leader", label: "リーダー編", en: "Leaders" },
  { to: "/history", label: "受講履歴", en: "Record" },
];

// QUALIA の頭字語（理念）
const acronym = [
  ["Q", "Quality", "品質を見極める"],
  ["U", "Unique", "唯一の存在として"],
  ["A", "Active", "挑戦を忘れない"],
  ["L", "Liberty", "自由な発想"],
  ["I", "Incubator", "人を育てる"],
  ["A", "Association", "公平公正な組織"],
];

export default function Home() {
  return (
    <div>
      {/* ヒーロー */}
      <section className="relative text-white">
        <img
          src="./images/hero.svg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative mx-auto max-w-4xl px-5 py-14 md:py-24 text-center">
          <p className="wordmark text-gold-300 text-lg md:text-2xl">
            QUALIA ACADEMY
          </p>
          <h1 className="mincho text-2xl md:text-4xl font-extrabold mt-4 leading-[1.7] md:leading-[1.6]">
            考え方とコンプライアンスを、
            <wbr />
            一人ひとりの力に。
          </h1>
          <p className="text-navy-100 mt-5 mx-auto max-w-xl text-sm md:text-base leading-loose">
            ビジネスで何より大切な「共通の考え方・あり方」と、
            <br className="hidden sm:block" />
            組織と仲間を守る「コンプライアンス」を学ぶ、会員向けアプリです。
          </p>
        </div>
      </section>

      {/* クイックメニュー（モバイルでも選びやすい 2×2 / PC 4列） */}
      <section className="mx-auto max-w-4xl px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3">
          {quickLinks.map((q) => (
            <Link
              key={q.to}
              to={q.to}
              className="card-hover bg-white rounded-xl border border-navy-100 shadow-sm px-3 py-4 text-center"
            >
              <p className="eyebrow text-[0.55rem] text-gold-500">{q.en}</p>
              <p className="mincho text-base md:text-lg font-bold text-navy-900 mt-1">
                {q.label}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 今日の言葉 */}
      <section className="mx-auto max-w-3xl px-4 mt-10 md:mt-12">
        <DailyMessage />
      </section>

      <Divider />

      {/* 理念・ビジョン */}
      <section className="mx-auto max-w-4xl px-4">
        <SectionHeading en="Our Vision" title="クオリアの理念" center />
        <p className="mincho text-xl md:text-2xl font-bold text-navy-900 text-center mt-6 leading-relaxed">
          ドリームアクセラレーター、QUALIA
        </p>
        <p className="text-sm md:text-base text-navy-700 text-center mt-4 max-w-2xl mx-auto leading-loose">
          あなたの夢の実現を、加速させたい。
          <br className="hidden sm:block" />
          常識・偏見・差別の壁を越えたところに、答えはある。
        </p>
        <p className="text-xs text-navy-500 text-center mt-4">
          ── ネットワークビジネス（MLM）業界の規範となる企業を目指して ──
        </p>

        {/* QUALIA の頭字語 */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-px bg-navy-100 rounded-xl overflow-hidden border border-navy-100">
          {acronym.map(([letter, en, ja], i) => (
            <div key={i} className="bg-white px-4 py-4 flex items-center gap-3">
              <span className="wordmark text-2xl text-gold-500 w-6 text-center">
                {letter}
              </span>
              <span className="leading-tight">
                <span className="block text-xs text-navy-500">{en}</span>
                <span className="block text-sm text-navy-900">{ja}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* コンプライアンス テスト */}
      <section className="mx-auto max-w-4xl px-4">
        <SectionHeading en="Compliance" title="コンプライアンス テスト" />
        <p className="text-sm text-navy-700 mt-4 leading-loose">
          合格基準は <strong>80%</strong>。間違えた問題には<strong>解説と補足</strong>が表示され、
          <br className="hidden sm:block" />
          何度でも再受験できます。合格すると<strong>修了証（PDF）</strong>を発行できます。
        </p>
        <div className="mt-5 grid sm:grid-cols-2 gap-4">
          {courseList.map((c) => {
            const s = getCourseSummary(c.id);
            return (
              <div
                key={c.id}
                className="card-hover rounded-xl border border-navy-100 bg-white p-4 flex flex-col"
              >
                <div className="flex items-center justify-between">
                  <p className="eyebrow text-[0.6rem] text-gold-500">
                    {c.titleEn}
                  </p>
                  {s.passed && (
                    <span className="bg-gold-400 text-navy-900 text-[0.6rem] font-bold px-2 py-0.5 rounded-full">
                      合格済み
                    </span>
                  )}
                </div>
                <h3 className="mincho text-base md:text-lg font-bold text-navy-900 mt-1.5">
                  {c.title}
                </h3>
                <p className="text-xs text-navy-500 mt-0.5">{c.subtitle}</p>
                <p className="hidden sm:block text-sm text-navy-700 mt-2 flex-1 leading-relaxed">
                  {c.description}
                </p>
                <p className="text-[0.7rem] text-navy-500 mt-2">
                  全{c.pool.length}問から{c.drawCount}問
                  {s.attempts > 0 && ` ・ 最高 ${s.bestScore}点`}
                </p>
                <div className="mt-3 flex gap-2">
                  <Link
                    to={`/quiz/${c.id}`}
                    className="flex-1 text-center px-3 py-2 rounded-lg bg-navy-900 text-white text-sm hover:bg-navy-800 transition-colors"
                  >
                    {s.attempts > 0 ? "もう一度" : "始める"}
                  </Link>
                  {s.passed && (
                    <Link
                      to={`/certificate/${c.id}`}
                      className="px-3 py-2 rounded-lg border border-gold-400 text-navy-800 text-sm hover:bg-gold-300/20 transition-colors"
                    >
                      修了証
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="h-14" />
    </div>
  );
}

function Divider() {
  return (
    <div className="mx-auto max-w-4xl px-4 my-12 md:my-14">
      <div className="flex items-center gap-4">
        <span className="h-px flex-1 bg-navy-100" />
        <span className="w-1.5 h-1.5 rotate-45 bg-gold-400" />
        <span className="h-px flex-1 bg-navy-100" />
      </div>
    </div>
  );
}
