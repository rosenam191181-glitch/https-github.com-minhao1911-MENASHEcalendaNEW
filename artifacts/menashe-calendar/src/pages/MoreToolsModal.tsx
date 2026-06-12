interface MoreToolsModalProps {
  onClose: () => void;
  onTahara: () => void;
  onYartzeit: () => void;
  onCommunity: () => void;
  onCensus: () => void;
  onSettings: () => void;
  onDafYomi: () => void;
  onBirthday: () => void;
  onOmer: () => void;
  onPrayers: () => void;
}

export default function MoreToolsModal({
  onClose, onTahara, onYartzeit, onCommunity, onCensus, onSettings, onDafYomi, onBirthday, onOmer, onPrayers,
}: MoreToolsModalProps) {
  const TOOLS = [
    { emoji: "🕍", bg: "rgba(99,102,241,0.15)",  label: "Prayer Times",         sub: "Shacharit, Mincha & Maariv windows", action: onPrayers },
    { emoji: "🌾", bg: "rgba(212,168,67,0.15)",  label: "Sefirat HaOmer",      sub: "Daily Omer count & sefirot",         action: onOmer },
    { emoji: "💧", bg: "rgba(59,130,246,0.15)",  label: "Tahara Calculator",   sub: "Purity & Mikveh timing",             action: onTahara },
    { emoji: "🕯", bg: "rgba(212,168,67,0.15)",  label: "Yahrzeit Calculator", sub: "Anniversary of passing",             action: onYartzeit },
    { emoji: "🎂", bg: "rgba(255,99,31,0.15)",   label: "Hebrew Birthday",     sub: "Find your Jewish birthday",          action: onBirthday },
    { emoji: "📚", bg: "rgba(139,92,246,0.15)",  label: "Daf Yomi",            sub: "Today's daily Talmud page",          action: onDafYomi },
    { emoji: "🤝", bg: "rgba(255,99,31,0.15)",   label: "Community",           sub: "Connect with Bnei Menashe",          action: onCommunity },
    { emoji: "📊", bg: "rgba(22,163,74,0.15)",   label: "Community Census",    sub: "Demographics & statistics",          action: onCensus },
    { emoji: "⚙️", bg: "rgba(100,116,139,0.15)", label: "Settings",            sub: "App preferences & account",          action: onSettings },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-sheet"
        onClick={e => e.stopPropagation()}
        style={{ maxHeight: "84vh", overflowY: "auto" }}
      >
        <div className="modal-handle" />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)" }}>More Tools</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>All features at a glance</div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {TOOLS.map((tool, i) => (
            <div
              key={i}
              className="tools-item"
              onClick={() => { tool.action(); }}
            >
              <div className="tools-icon" style={{ background: tool.bg }}>
                {tool.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>{tool.label}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{tool.sub}</div>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          ))}
        </div>

        <button onClick={onClose} className="btn-close-full" style={{ marginTop: 16 }}>
          Close
        </button>
      </div>
    </div>
  );
}
