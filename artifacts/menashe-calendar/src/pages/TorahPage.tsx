import { useState } from "react";
import { getCurrentParasha, getUpcomingParashiyot } from "../lib/parasha";

interface TorahPageProps {
  onAddNote: () => void;
  onShowParashah: () => void;
  onLocationClick: () => void;
}

export default function TorahPage({ onAddNote, onShowParashah, onLocationClick }: TorahPageProps) {
  const today = new Date();
  const parasha = getCurrentParasha(today);
  const upcoming = getUpcomingParashiyot(today, 6);

  const [copied, setCopied] = useState(false);

  function handleCopy() {
    if (!parasha) return;
    navigator.clipboard.writeText(
      `Parashat ${parasha.name} (${parasha.hebrewName})\n${parasha.book} ${parasha.verses}\n\n${parasha.summary}`
    ).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }

  if (!parasha) return null;

  return (
    <div style={{ padding: "0 0 4px" }}>
      {/* Header */}
      <div className="app-header">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="app-icon">✡</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>Menashe</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.1em", fontWeight: 600 }}>CALENDAR</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 16px 0" }}>
        {/* Page title */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)" }}>Torah Insights</h1>
          <button
            onClick={onShowParashah}
            style={{ fontSize: 11, color: "var(--gold)", background: "none", border: "none", cursor: "pointer", fontWeight: 700, letterSpacing: "0.08em" }}
          >
            SCHEDULE »
          </button>
        </div>

        {/* Parasha card */}
        <div className="card" style={{ padding: 20, marginBottom: 12, background: "linear-gradient(135deg, #0f1e38, #111e38)", border: "1px solid #1e3050", position: "relative", overflow: "hidden" }}>
          <div style={{ marginBottom: 10 }}>
            <span className="tag tag-blue">{parasha.book.toUpperCase()}</span>
          </div>
          <div style={{ fontFamily: "'Noto Serif Hebrew', serif", fontSize: 42, color: "var(--gold)", direction: "rtl", marginBottom: 8, lineHeight: 1 }}>
            {parasha.hebrewName}
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "white", marginBottom: 6 }}>Parashat {parasha.name}</div>
          <div style={{ fontSize: 14, color: "#64748b" }}>{parasha.book} {parasha.verses}</div>
          <div style={{ position: "absolute", right: -20, top: -20, width: 100, height: 100, borderRadius: "50%", border: "1px solid rgba(212,168,67,0.1)", pointerEvents: "none" }} />
        </div>

        {/* Actions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          <button
            onClick={handleCopy}
            style={{ padding: "12px 16px", background: "var(--elevated)", border: "1px solid var(--border)", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 13, color: "var(--text-primary)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
          >
            📋 {copied ? "Copied!" : "Copy Notes"}
          </button>
          <button
            onClick={onAddNote}
            style={{ padding: "12px 16px", background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 13, color: "#60a5fa", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
          >
            📝 Add Note
          </button>
        </div>

        {/* Overview */}
        <div className="card" style={{ padding: 16, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(212,168,67,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>📖</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>Overview</div>
          </div>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7 }}>{parasha.summary}</p>
        </div>

        {/* Upcoming Parashiyot */}
        {upcoming.length > 0 && (
          <div style={{ marginBottom: 4 }}>
            <div className="section-header">UPCOMING PARASHIYOT</div>
            <div className="card" style={{ overflow: "hidden" }}>
              {upcoming.map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: i < upcoming.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {p.hebrewName && (
                      <div style={{ fontFamily: "'Noto Serif Hebrew', serif", fontSize: 16, color: "var(--gold)", width: 40, textAlign: "right" }}>
                        {p.hebrewName.split(" ")[0]}
                      </div>
                    )}
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{p.name}</div>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {p.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
