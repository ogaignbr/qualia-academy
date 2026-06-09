import { useMemo } from "react";
import { principles } from "../data/principles";
import { getDailyPrincipleId, todayKey } from "../lib/storage";

export default function DailyMessage() {
  const { p, dateLabel } = useMemo(() => {
    const key = todayKey();
    const id = getDailyPrincipleId(
      principles.map((x) => x.id),
      key,
    );
    const found = principles.find((x) => x.id === id) ?? principles[0];
    const d = new Date();
    return {
      p: found,
      dateLabel: `${d.getMonth() + 1}月${d.getDate()}日`,
    };
  }, []);

  return (
    <div className="cert-paper rounded-2xl border border-gold-300/60 shadow-sm px-6 py-7 md:px-10 md:py-9 text-center">
      <p className="eyebrow text-xs text-gold-500">Today’s Words ・ {dateLabel}</p>
      <p className="script text-gold-400 text-2xl mt-1">today's message</p>
      <p className="mincho text-2xl md:text-3xl font-bold text-navy-900 leading-relaxed mt-4">
        「{p.quote}」
      </p>
      <p className="text-sm text-navy-700 mt-4 max-w-xl mx-auto leading-relaxed">
        {p.body}
      </p>
      <p className="mt-5 text-xs text-navy-500">
        — {p.person}（{p.role}）
      </p>
    </div>
  );
}
