interface Props { onClose: () => void; }

const LINKS = [
  { emoji: "🏛", title: "Shavei Israel", sub: "Organization supporting Bnei Menashe aliyah", url: "https://www.shavei.org" },
  { emoji: "📞", title: "Community Hotline", sub: "For halachic and community questions" },
  { emoji: "📰", title: "Bnei Menashe Newsletter", sub: "Monthly community updates" },
  { emoji: "🎓", title: "Torah Classes", sub: "Online shiurim for Bnei Menashe communities" },
  { emoji: "🤝", title: "Connect with Members", sub: "Find community near you" },
];

export default function CommunityModal({ onClose }: Props) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)" }}>🤝 Community</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Bnei Menashe worldwide</div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div style={{
          padding: 16, borderRadius: 14, marginBottom: 14, textAlign: "center",
          background: "linear-gradient(135deg, #0f1e38, #1a2a4a)",
          border: "1px solid rgba(212,168,67,0.25)",
        }}>
          <div style={{ fontFamily: "'Noto Serif Hebrew', serif", fontSize: 24, color: "#d4a843", marginBottom: 6 }}>בְּנֵי מְנַשֶּׁה</div>
          <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>
            The Bnei Menashe are a community from northeastern India who trace their ancestry to the tribe of Menashe, one of the Ten Lost Tribes of Israel.
          </div>
        </div>

        <div className="card" style={{ overflow: "hidden", marginBottom: 14 }}>
          {LINKS.map((link, i) => (
            <div
              key={i}
              style={{
                display: "flex", alignItems: "center", gap: 12, padding: "13px 16px",
                borderBottom: i < LINKS.length - 1 ? "1px solid var(--border)" : "none",
                cursor: "pointer",
              }}
            >
              <span style={{ fontSize: 20 }}>{link.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{link.title}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{link.sub}</div>
              </div>
              <span style={{ color: "var(--text-muted)", fontSize: 14 }}>›</span>
            </div>
          ))}
        </div>

        <button onClick={onClose} className="btn-close-full">Close</button>
      </div>
    </div>
  );
}
