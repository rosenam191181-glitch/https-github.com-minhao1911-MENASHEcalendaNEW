import { useState } from "react";
import { HDate } from "@hebcal/core";
import { hebrewDayNumeral } from "../lib/hebrewCalendar";

interface Props { onClose: () => void; }

export default function BirthdayModal({ onClose }: Props) {
  const [birthDate, setBirthDate] = useState("");
  const [result, setResult] = useState<{ hdate: HDate; nextGreg: Date } | null>(null);

  function calculate() {
    if (!birthDate) return;
    const d = new Date(birthDate);
    const hd = new HDate(d);
    const currentYear = new HDate().getFullYear();
    let nextYear = currentYear;
    const next = new HDate(hd.getDate(), hd.getMonth(), nextYear);
    if (next.greg() < new Date()) {
      const next2 = new HDate(hd.getDate(), hd.getMonth(), currentYear + 1);
      setResult({ hdate: hd, nextGreg: next2.greg() });
    } else {
      setResult({ hdate: hd, nextGreg: next.greg() });
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)" }}>🎂 Hebrew Birthday</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Find your Jewish birthday</div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="card" style={{ padding: 16, marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>Date of birth (Gregorian)</div>
          <input
            type="date"
            value={birthDate}
            onChange={e => setBirthDate(e.target.value)}
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
          disabled={!birthDate}
        >
          Find My Birthday
        </button>

        {result && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", marginBottom: 8 }}>YOUR HEBREW BIRTHDAY</div>
              <div style={{ fontFamily: "'Noto Serif Hebrew', serif", fontSize: 26, color: "#d4a843", direction: "rtl" }}>
                {hebrewDayNumeral(result.hdate.getDate())} {HDate.getMonthName(result.hdate.getMonth(), result.hdate.getFullYear())}
              </div>
            </div>
            <div className="card" style={{ padding: 16, border: "1px solid rgba(212,168,67,0.3)", background: "rgba(212,168,67,0.05)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#d4a843", letterSpacing: "0.08em", marginBottom: 8 }}>NEXT CELEBRATION</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "var(--text-primary)" }}>
                {result.nextGreg.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </div>
            </div>
          </div>
        )}

        <button onClick={onClose} className="btn-close-full" style={{ marginTop: 14 }}>Close</button>
      </div>
    </div>
  );
}
