interface BottomNavProps {
  active: string;
  onNavigate: (page: string) => void;
}

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: HomeIcon },
  { id: "calendar", label: "Calendar", icon: CalendarIcon },
  { id: "zmanim", label: "Zmanim", icon: ClockIcon },
  { id: "siddur", label: "Siddur", icon: SiddurIcon },
  { id: "premium", label: "Premium", icon: PremiumIcon },
  { id: "settings", label: "Settings", icon: SettingsIcon },
];

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function CalendarIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" fill={active ? "rgba(212,168,67,0.15)" : "none"} />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ClockIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={active ? "rgba(212,168,67,0.15)" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function SiddurIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={active ? "rgba(212,168,67,0.1)" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <line x1="10" y1="8" x2="16" y2="8" />
      <line x1="10" y1="12" x2="14" y2="12" />
    </svg>
  );
}

function PremiumIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={active ? "#d4a843" : "none"} stroke={active ? "#d4a843" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  );
}

function SettingsIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

export default function BottomNav({ active, onNavigate }: BottomNavProps) {
  return (
    <div className="bottom-nav" style={{ display: "flex" }}>
      {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
        const isPremium = id === "premium";
        const isActive = active === id;
        return (
          <button
            key={id}
            className={`nav-item ${isActive ? "active" : ""}`}
            onClick={() => onNavigate(id)}
            style={{
              background: "none", border: "none", outline: "none",
              flex: 1,
              ...(isPremium ? {
                color: isActive ? "#d4a843" : "rgba(212,168,67,0.7)",
              } : {}),
            }}
          >
            <Icon active={isActive} />
            <span style={isPremium ? {
              background: isActive
                ? "linear-gradient(135deg, #b8860b 0%, #d4a843 50%, #f0c96a 100%)"
                : "none",
              WebkitBackgroundClip: isActive ? "text" : "unset",
              WebkitTextFillColor: isActive ? "transparent" : "rgba(212,168,67,0.8)",
              fontWeight: isActive ? 800 : 700,
            } : {}}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
