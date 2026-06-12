import { useState } from "react";
import { HDate } from "@hebcal/core";

interface Props { onClose: () => void; }

export default function TaharaModal({ onClose }: Props) {
  const [lastDate, setLastDate] = useState("");
  const [result, setResult] = useState<{ mikveh: string; hefsek: string; count: number } | null>(null);

  function calculate() {
    if (!lastDate) return;
    const d = new Date(lastDate);
    const hefsekDate = new Date(d.getTime() + 5 * 86400000);
    const mikvehDate = new Date(hefsekDate.getTime() + 7 * 86400000);
    const hefsekHDate = new HDate(hefsekDate);
    const mikvehHDate = new HDate(mikvehDate);

    setResult({
      hefsek: `${hefsekDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} (${hefsekHDate.render("en")})`,
      mikveh: `${mikvehDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} (${mikvehHDate.render("en")})`,
      count: 12,
    });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)" }}>💧 Tahara Calculator</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Purity & Mikveh timing</div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="card" style={{ padding: 16, marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>Start of period (vesset)</div>
          <input
            type="date"
            value={lastDate}
            onChange={e => setLastDate(e.target.value)}
            style={{
              width: "100%", padding: "12px 14px", borderRadius: 10,
              background: "var(--elevated)", border: "1px solid var(--border)",
              color: "var(--text-primary)", fontSize: 15, outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        <button
          className="btn-gold"
          style={{ width: "100%", padding: "13px", marginBottom: 14, fontSize: 15, fontWeight: 700 }}
          onClick={calculate}
          disabled={!lastDate}
        >
          Calculate
        </button>

        {result && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div className="card" style={{ padding: 14, border: "1px solid rgba(59,130,246,0.3)", background: "rgba(59,130,246,0.05)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#60a5fa", letterSpacing: "0.08em", marginBottom: 4 }}>HEFSEK TAHARA</div>
              <div style={{ fontSize: 14, color: "var(--text-primary)", fontWeight: 600 }}>{result.hefsek}</div>
            </div>
            <div className="card" style={{ padding: 14, border: "1px solid rgba(212,168,67,0.3)", background: "rgba(212,168,67,0.05)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#d4a843", letterSpacing: "0.08em", marginBottom: 4 }}>MIKVEH NIGHT (EARLIEST)</div>
              <div style={{ fontSize: 14, color: "var(--text-primary)", fontWeight: 600 }}>{result.mikveh}</div>
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center", lineHeight: 1.5 }}>
              ⚠️ Always consult a qualified posek (halachic authority) for personal guidance.
            </div>
          </div>
        )}

        <button onClick={onClose} className="btn-close-full" style={{ marginTop: 14 }}>Close</button>
      </div>
    </div>
  );
}
