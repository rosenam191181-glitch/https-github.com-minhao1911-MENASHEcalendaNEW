interface Props { onClose: () => void; }

const FEATURES = [
  { emoji: "⏰", title: "Full Zmanim", desc: "All 15+ daily prayer times for any location" },
  { emoji: "📖", title: "Torah Library", desc: "Complete Daf Yomi, Mishna Yomit, Halacha Yomit" },
  { emoji: "🗓", title: "Multi-year Calendar", desc: "Plan events years ahead with all holidays" },
  { emoji: "💧", title: "Tahara Tools", desc: "Advanced mikveh and purity calculator" },
  { emoji: "🕯", title: "Shabbat Notifications", desc: "Alerts before candle lighting every Friday" },
  { emoji: "📊", title: "Community Census", desc: "Full Bnei Menashe community data" },
];

export default function PremiumModal({ onClose }: Props) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxHeight: "88vh", overflowY: "auto" }}>
        <div className="modal-handle" />

        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>⭐</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)" }}>Upgrade to Premium</div>
          <div style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 4 }}>Unlock the full Sacred Calendar experience</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "var(--card)", borderRadius: 12, border: "1px solid var(--border)" }}>
              <span style={{ fontSize: 22 }}>{f.emoji}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>{f.title}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          <div style={{ padding: "14px 12px", borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)", textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)" }}>$2.99</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>/ month</div>
          </div>
          <div style={{ padding: "14px 12px", borderRadius: 12, border: "2px solid #d4a843", background: "rgba(212,168,67,0.08)", textAlign: "center", position: "relative" }}>
            <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: "#d4a843", color: "#0a0f1e", fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 99 }}>BEST VALUE</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#d4a843" }}>$24.99</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>/ year</div>
          </div>
        </div>

        <button className="btn-gold" style={{ width: "100%", padding: "15px", marginBottom: 10, fontSize: 15, fontWeight: 800 }}>
          Start 7-Day Free Trial
        </button>
        <button onClick={onClose} className="btn-close-full">Maybe Later</button>
      </div>
    </div>
  );
}
