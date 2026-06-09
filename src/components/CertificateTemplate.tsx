import { forwardRef } from "react";
import type { Certificate } from "../lib/storage";
import { formatJpDate } from "../lib/storage";

// 画像化（PDF化）される修了証本体。横長・固定幅で安定して描画する。
const CertificateTemplate = forwardRef<HTMLDivElement, { cert: Certificate }>(
  ({ cert }, ref) => {
    return (
      <div
        ref={ref}
        className="cert-paper"
        style={{
          width: 1000,
          height: 707,
          position: "relative",
          padding: 56,
          boxSizing: "border-box",
          color: "#0f1d3a",
        }}
      >
        {/* 外枠 */}
        <div
          style={{
            position: "absolute",
            inset: 22,
            border: "2px solid #1f3a6b",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 30,
            border: "1px solid #b89150",
          }}
        />

        <div style={{ position: "relative", textAlign: "center" }}>
          <p
            className="script"
            style={{ color: "#b89150", fontSize: 46, lineHeight: 1 }}
          >
            Certificate of Completion
          </p>
          <p
            className="eyebrow"
            style={{ color: "#1f3a6b", fontSize: 13, marginTop: 6 }}
          >
            QUALIA ACADEMY
          </p>
          <div
            style={{
              width: 64,
              height: 2,
              background: "#b89150",
              margin: "18px auto",
            }}
          />

          <p className="mincho" style={{ fontSize: 18, color: "#16294f" }}>
            修　了　証　書
          </p>

          <p
            className="mincho"
            style={{ fontSize: 40, fontWeight: 800, marginTop: 26 }}
          >
            {cert.name}　様
          </p>
          <p style={{ fontSize: 13, color: "#2c4d86", marginTop: 6 }}>
            会員番号：{cert.memberNo}
          </p>

          <p
            className="mincho"
            style={{
              fontSize: 16,
              color: "#16294f",
              marginTop: 26,
              lineHeight: 1.9,
              maxWidth: 720,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            あなたは下記の課程を修了し、所定の基準に合格したことをここに証します。
          </p>

          <p
            className="mincho"
            style={{
              fontSize: 24,
              fontWeight: 700,
              marginTop: 18,
              color: "#0f1d3a",
            }}
          >
            「{cert.courseTitle}」
          </p>
          <p style={{ fontSize: 15, color: "#2c4d86", marginTop: 8 }}>
            スコア {cert.score} 点 ／ 合格
          </p>
        </div>

        {/* 下部：日付・発行ID・会社・印章 */}
        <div
          style={{
            position: "absolute",
            left: 70,
            right: 70,
            bottom: 64,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <div style={{ textAlign: "left", fontSize: 13, color: "#16294f" }}>
            <p>発行日：{formatJpDate(cert.issuedAtISO)}</p>
            <p style={{ color: "#6f8dc4", marginTop: 4 }}>発行ID：{cert.id}</p>
            <p className="mincho" style={{ marginTop: 10, fontSize: 15 }}>
              株式会社QUALIA
            </p>
          </div>
          <img src="./images/seal.svg" alt="" width={110} height={110} />
        </div>
      </div>
    );
  },
);

CertificateTemplate.displayName = "CertificateTemplate";
export default CertificateTemplate;
