import { NavLink, Outlet, Link } from "react-router-dom";

const navItems = [
  { to: "/", label: "ホーム", end: true },
  { to: "/principles", label: "考え方" },
  { to: "/quiz/beginner", label: "コンプラ初級" },
  { to: "/quiz/leader", label: "リーダー編" },
  { to: "/history", label: "受講履歴" },
];

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="sticky top-0 z-30 bg-navy-900/95 backdrop-blur text-white border-b border-navy-700">
        <div className="mx-auto max-w-5xl px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <svg viewBox="0 0 120 120" className="w-8 h-8 text-gold-300" aria-hidden>
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              <text
                x="60"
                y="83"
                textAnchor="middle"
                fontFamily="Cormorant Garamond, Georgia, serif"
                fontSize="72"
                fontWeight="600"
                fill="currentColor"
              >
                Q
              </text>
            </svg>
            <span className="flex flex-col leading-none">
              <span className="wordmark text-gold-300 text-xl leading-none">
                QUALIA
              </span>
              <span className="eyebrow text-[0.55rem] text-navy-300 mt-1">
                Academy
              </span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                end={it.end}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm rounded-md transition-colors ${
                    isActive
                      ? "text-gold-300"
                      : "text-navy-100 hover:text-white hover:bg-navy-800"
                  }`
                }
              >
                {it.label}
              </NavLink>
            ))}
          </nav>
        </div>
        {/* モバイル用ナビ */}
        <nav className="md:hidden flex overflow-x-auto border-t border-navy-800 px-2 py-1.5 gap-1">
          {navItems.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.end}
              className={({ isActive }) =>
                `whitespace-nowrap px-3 py-1.5 text-xs rounded-full transition-colors ${
                  isActive
                    ? "bg-gold-400 text-navy-900 font-medium"
                    : "bg-navy-800 text-navy-100"
                }`
              }
            >
              {it.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-navy-950 text-navy-300 text-xs">
        <div className="mx-auto max-w-5xl px-4 py-8 space-y-2">
          <p className="wordmark text-gold-300 text-lg">QUALIA ACADEMY</p>
          <p>株式会社QUALIA 会員向け 考え方・コンプライアンス学習アプリ</p>
          <p className="text-navy-400">
            ※本アプリの学習・テスト内容は社内向けの教育用です。法令の最終的な解釈・運用は会社の公式案内に従ってください。
          </p>
        </div>
      </footer>
    </div>
  );
}
