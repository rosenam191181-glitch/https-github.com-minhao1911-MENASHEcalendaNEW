import { useState } from "react";
import { HDate } from "@hebcal/core";
import { hebrewDayNumeral } from "../lib/hebrewCalendar";

interface Props { onClose: () => void; }

export default function YartzeitModal({ onClose }: Props) {
  const [passDate, setPassDate] = useState("");
  const [result, setResult] = useState<{ thisYear: Date; hebrewDate: HDate } | null>(null);

  function calculate() {
    if (!passDate) return;
    const d = new Date(passDate);
    const hd = new HDate(d);
    const currentYear = new HDate().getFullYear();
    const thisYearDate = new HDate(hd.getDate(), hd.getMonth(), currentYear);
    const thisYearGreg = thisYearDate.greg();
    setResult({ thisYear: thisYearGreg, hebrewDate: hd });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)" }}>🕯 Yahrzeit Calculator</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Anniversary of passing</div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="card" style={{ padding: 16, marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>Date of passing (Gregorian)</div>
          <input
            type="date"
            value={passDate}
            onChange={e => setPassDate(e.target.value)}
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
          disabled={!passDate}
        >
          Calculate
        </button>

        {result && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", marginBottom: 8 }}>HEBREW DATE OF PASSING</div>
              <div style={{ fontFamily: "'Noto Serif Hebrew', serif", fontSize: 22, color: "#d4a843", direction: "rtl", marginBottom: 4 }}>
                {hebrewDayNumeral(result.hebrewDate.getDate())} {HDate.getMonthName(result.hebrewDate.getMonth(), result.hebrewDate.getFullYear())}
              </div>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{result.hebrewDate.getFullYear()}</div>
            </div>
            <div className="card" style={{ padding: 16, border: "1px solid rgba(212,168,67,0.3)", background: "rgba(212,168,67,0.05)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#d4a843", letterSpacing: "0.08em", marginBottom: 8 }}>THIS YEAR'S YAHRZEIT</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>
                {result.thisYear.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </div>
            </div>
          </div>
        )}

        <button onClick={onClose} className="btn-close-full" style={{ marginTop: 14 }}>Close</button>
      </div>
    </div>
  );
}
