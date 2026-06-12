import { HDate } from "@hebcal/core";

interface Props { onClose: () => void; }

const TRACTATES = [
  { name: "Berakhot", pages: 64 },
  { name: "Shabbat", pages: 157 },
  { name: "Eruvin", pages: 105 },
  { name: "Pesachim", pages: 121 },
  { name: "Yoma", pages: 88 },
  { name: "Sukkah", pages: 56 },
  { name: "Beitzah", pages: 40 },
  { name: "Rosh Hashana", pages: 35 },
  { name: "Ta'anit", pages: 31 },
  { name: "Megillah", pages: 32 },
  { name: "Moed Katan", pages: 29 },
  { name: "Chagigah", pages: 27 },
  { name: "Yevamot", pages: 122 },
  { name: "Ketubot", pages: 112 },
  { name: "Nedarim", pages: 91 },
  { name: "Nazir", pages: 66 },
  { name: "Sotah", pages: 49 },
  { name: "Gittin", pages: 90 },
  { name: "Kiddushin", pages: 82 },
  { name: "Bava Kamma", pages: 119 },
  { name: "Bava Metzia", pages: 119 },
  { name: "Bava Batra", pages: 176 },
  { name: "Sanhedrin", pages: 113 },
  { name: "Makkot", pages: 24 },
  { name: "Shevuot", pages: 49 },
  { name: "Avodah Zarah", pages: 76 },
  { name: "Horayot", pages: 14 },
  { name: "Zevachim", pages: 120 },
  { name: "Menachot", pages: 110 },
  { name: "Chullin", pages: 142 },
  { name: "Bekhorot", pages: 61 },
  { name: "Arakhin", pages: 34 },
  { name: "Temurah", pages: 34 },
  { name: "Keritot", pages: 28 },
  { name: "Meilah", pages: 22 },
  { name: "Niddah", pages: 73 },
];

const TOTAL_PAGES = TRACTATES.reduce((a, t) => a + t.pages, 0);
const CYCLE_START = new Date(2020, 0, 5); // Jan 5, 2020 — cycle 14 start

function getDafYomi(): { tractate: string; daf: number; cycle: number } {
  const today = new Date();
  const daysSinceStart = Math.floor((today.getTime() - CYCLE_START.getTime()) / 86400000);
  const dayInCycle = daysSinceStart % TOTAL_PAGES;
  const cycle = Math.floor(daysSinceStart / TOTAL_PAGES) + 14;

  let remaining = dayInCycle;
  for (const t of TRACTATES) {
    if (remaining < t.pages) return { tractate: t.name, daf: remaining + 2, cycle };
    remaining -= t.pages;
  }
  return { tractate: TRACTATES[0].name, daf: 2, cycle };
}

export default function DafYomiModal({ onClose }: Props) {
  const daf = getDafYomi();
  const hdate = new HDate();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)" }}>Daf Yomi</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Daily Talmud study — Cycle {daf.cycle}</div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div style={{
          padding: 20, borderRadius: 16, marginBottom: 14, textAlign: "center",
          background: "linear-gradient(135deg, #0f1e38, #1a2a4a)",
          border: "1px solid rgba(212,168,67,0.3)",
        }}>
          <div style={{ fontFamily: "'Noto Serif Hebrew', serif", fontSize: 14, color: "#d4a843", marginBottom: 6 }}>
            {hdate.renderGematriya()}
          </div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 14 }}>Today's Learning</div>
          <div style={{ fontSize: 34, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>{daf.tractate}</div>
          <div style={{ fontSize: 22, color: "#d4a843", fontWeight: 700 }}>Daf {daf.daf}</div>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <div className="card" style={{ flex: 1, padding: 14, textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 4 }}>CYCLE</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)" }}>{daf.cycle}</div>
          </div>
          <div className="card" style={{ flex: 1, padding: 14, textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 4 }}>TOTAL PAGES</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)" }}>{TOTAL_PAGES}</div>
          </div>
        </div>

        <div style={{ padding: 14, background: "rgba(212,168,67,0.08)", borderRadius: 12, border: "1px solid rgba(212,168,67,0.2)", marginBottom: 14 }}>
          <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
            📚 The Daf Yomi (daily page) cycle covers all of Talmud Bavli in 7.5 years. Thousands of Jews worldwide study the same page each day.
          </div>
        </div>

        <button onClick={onClose} className="btn-close-full">Close</button>
      </div>
    </div>
  );
}
