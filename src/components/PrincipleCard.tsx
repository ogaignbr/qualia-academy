import type { Principle } from "../data/types";

const personColor: Record<string, string> = {
  寺口泰海: "bg-navy-700",
  菅野航: "bg-navy-600",
  神農晶: "bg-gold-500",
};

export default function PrincipleCard({ p }: { p: Principle }) {
  return (
    <article className="card-hover bg-white rounded-xl border border-navy-100 shadow-sm overflow-hidden flex flex-col">
      <div className="bg-navy-900 text-white px-5 py-4">
        <span className="inline-block text-[0.65rem] eyebrow text-gold-300">
          {p.theme}
        </span>
        <p className="mincho text-lg md:text-xl font-bold leading-snug mt-1">
          「{p.quote}」
        </p>
      </div>
      <div className="px-5 py-4 flex-1 flex flex-col">
        <p className="text-sm text-navy-800 leading-relaxed flex-1">{p.body}</p>
        <div className="mt-4 flex items-center gap-2">
          <span
            className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white text-xs ${
              personColor[p.person] ?? "bg-navy-700"
            }`}
          >
            {p.person.slice(0, 1)}
          </span>
          <div className="leading-tight">
            <p className="text-sm font-medium text-navy-900">{p.person}</p>
            <p className="text-[0.7rem] text-navy-500">{p.role}</p>
          </div>
        </div>
        <a
          href={p.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 text-xs text-navy-600 hover:text-gold-500 inline-flex items-center gap-1"
        >
          ▶ 出典動画：{p.videoTitle}
        </a>
      </div>
    </article>
  );
}
