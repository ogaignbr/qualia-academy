import { useState, useMemo } from "react";
import SectionHeading from "../components/SectionHeading";
import PrincipleCard from "../components/PrincipleCard";
import { principles, themes } from "../data/principles";

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function PrinciplesPage() {
  const [theme, setTheme] = useState<string>("all");

  // 人物で偏らないよう、表示順をランダムにする（マウント毎にシャッフル）
  const shuffled = useMemo(() => shuffle(principles), []);

  const filtered = useMemo(
    () =>
      theme === "all"
        ? shuffled
        : shuffled.filter((p) => p.theme === theme),
    [shuffled, theme],
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:py-12">
      <SectionHeading en="Philosophy" title="考え方・あり方" />
      <p className="text-sm text-navy-700 mt-4 max-w-2xl leading-loose">
        テクニックの前に、共通の「考え方・あり方」を。
        <br className="hidden sm:block" />
        クオリアで大切にされている言葉を集めました。
      </p>

      {/* テーマで絞り込み（人物名タグは表示しない） */}
      <div className="mt-5 flex flex-wrap gap-2">
        {["all", ...themes].map((t) => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            className={`px-3 py-1 rounded-full text-xs transition-colors ${
              theme === t
                ? "bg-gold-400 text-navy-900 font-medium"
                : "border border-navy-200 text-navy-600 hover:bg-navy-50"
            }`}
          >
            {t === "all" ? "すべてのテーマ" : t}
          </button>
        ))}
      </div>

      <div className="mt-7 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {filtered.map((p) => (
          <PrincipleCard key={p.id} p={p} />
        ))}
      </div>
    </div>
  );
}
