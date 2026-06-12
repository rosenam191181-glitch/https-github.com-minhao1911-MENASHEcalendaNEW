import { LOCATIONS, Location } from "../lib/locations";

interface Props {
  current: Location;
  onSelect: (loc: Location) => void;
  onClose: () => void;
}

export default function LocationModal({ current, onSelect, onClose }: Props) {
  const byCountry: Record<string, Location[]> = {};
  for (const loc of LOCATIONS) {
    if (!byCountry[loc.country]) byCountry[loc.country] = [];
    byCountry[loc.country].push(loc);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxHeight: "82vh", overflowY: "auto" }}>
        <div className="modal-handle" />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)" }}>Choose Location</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Used for Zmanim calculations</div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        {Object.entries(byCountry).map(([country, locs]) => (
          <div key={country} style={{ marginBottom: 12 }}>
            <div className="section-header">{country.toUpperCase()}</div>
            <div className="card" style={{ overflow: "hidden" }}>
              {locs.map((loc, i) => (
                <div
                  key={loc.name}
                  onClick={() => onSelect(loc)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "13px 16px",
                    borderBottom: i < locs.length - 1 ? "1px solid var(--border)" : "none",
                    cursor: "pointer",
                    background: current.name === loc.name ? "rgba(212,168,67,0.08)" : "transparent",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 16 }}>📍</span>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>{loc.name}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{loc.tz}</div>
                    </div>
                  </div>
                  {current.name === loc.name && (
                    <span style={{ color: "#d4a843", fontSize: 16 }}>✓</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
