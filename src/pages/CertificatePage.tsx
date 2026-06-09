import { useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { courses } from "../data/courses";
import type { CourseId } from "../data/types";
import SectionHeading from "../components/SectionHeading";
import CertificateTemplate from "../components/CertificateTemplate";
import { exportCertificatePdf } from "../lib/certificate";
import {
  getCourseSummary,
  getCertificate,
  getProfile,
  issueCertificate,
  type Certificate,
} from "../lib/storage";

export default function CertificatePage() {
  const { courseId } = useParams<{ courseId: CourseId }>();
  const course = courseId ? courses[courseId] : undefined;
  const certRef = useRef<HTMLDivElement>(null);

  const summary = course ? getCourseSummary(course.id) : undefined;
  const existing = course ? getCertificate(course.id) : undefined;
  const profile = getProfile();

  const [name, setName] = useState(existing?.name ?? profile?.name ?? "");
  const [memberNo, setMemberNo] = useState(
    existing?.memberNo ?? profile?.memberNo ?? "",
  );
  const [cert, setCert] = useState<Certificate | undefined>(existing);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  if (!course || !summary) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-navy-700">コースが見つかりませんでした。</p>
        <Link to="/" className="text-gold-500 mt-4 inline-block">
          ホームへ
        </Link>
      </div>
    );
  }

  if (!summary.passed) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <SectionHeading en="Certificate" title="修了証の発行" center />
        <p className="text-navy-700 mt-6">
          修了証は、テストに<strong>合格</strong>すると発行できます。
          <br />
          まずは「{course.title}」のテストに合格しましょう。
        </p>
        <Link
          to={`/quiz/${course.id}`}
          className="mt-6 inline-block px-6 py-3 rounded-full bg-navy-900 text-white hover:bg-navy-800"
        >
          テストを受ける →
        </Link>
      </div>
    );
  }

  const handleIssue = () => {
    if (!name.trim() || !memberNo.trim()) {
      setError("受講者名と会員ナンバーの両方を入力してください。");
      return;
    }
    setError("");
    const issued = issueCertificate({
      courseId: course.id,
      courseTitle: course.title,
      name,
      memberNo,
      score: summary.bestScore,
    });
    setCert(issued);
    setTimeout(() => {
      document.getElementById("cert-preview")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const handleDownload = async () => {
    if (!certRef.current || !cert) return;
    setDownloading(true);
    try {
      await exportCertificatePdf(
        certRef.current,
        `QUALIA修了証_${cert.courseTitle}_${cert.name}.pdf`,
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <SectionHeading en="Certificate" title="修了証の発行" />
      <p className="text-sm text-navy-700 mt-4">
        「{course.title}」に合格済みです（最高スコア {summary.bestScore} 点）。
        受講者名と会員ナンバーを入力して、修了証を発行・PDF保存できます。
      </p>

      {/* 入力フォーム */}
      <div className="mt-6 grid sm:grid-cols-2 gap-4 bg-navy-50 rounded-xl border border-navy-100 p-5">
        <label className="block">
          <span className="text-sm text-navy-700">受講者名</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例：山田 太郎"
            className="mt-1 w-full px-3 py-2.5 rounded-lg border border-navy-200 bg-white focus:outline-none focus:border-navy-500"
          />
        </label>
        <label className="block">
          <span className="text-sm text-navy-700">会員ナンバー</span>
          <input
            value={memberNo}
            onChange={(e) => setMemberNo(e.target.value)}
            placeholder="例：Q-100123"
            className="mt-1 w-full px-3 py-2.5 rounded-lg border border-navy-200 bg-white focus:outline-none focus:border-navy-500"
          />
        </label>
        {error && <p className="sm:col-span-2 text-sm text-gold-600">{error}</p>}
        <div className="sm:col-span-2">
          <button
            onClick={handleIssue}
            className="px-6 py-3 rounded-full bg-gold-400 text-navy-900 font-medium hover:bg-gold-300"
          >
            {cert ? "入力内容で発行し直す" : "修了証を発行する"}
          </button>
        </div>
      </div>

      {/* プレビュー＋PDF */}
      {cert && (
        <div id="cert-preview" className="mt-10">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h3 className="mincho text-lg font-bold text-navy-900">プレビュー</h3>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="px-6 py-2.5 rounded-full bg-navy-900 text-white hover:bg-navy-800 disabled:opacity-50"
            >
              {downloading ? "作成中…" : "PDFを保存する"}
            </button>
          </div>

          {/* 横スクロールで全体表示（実体は固定1000px） */}
          <div className="mt-4 overflow-x-auto border border-navy-100 rounded-xl bg-white p-3">
            <div style={{ width: 1000, margin: "0 auto" }}>
              <CertificateTemplate ref={certRef} cert={cert} />
            </div>
          </div>
          <p className="text-xs text-navy-500 mt-3">
            ※この修了証は自己申告ベースの受講記録です。記録はこの端末（ブラウザ）に保存され、
            <Link to="/history" className="text-navy-700 underline ml-1">
              受講履歴
            </Link>
            からいつでも再発行できます。
          </p>
        </div>
      )}
    </div>
  );
}
