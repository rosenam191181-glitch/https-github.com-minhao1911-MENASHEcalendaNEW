import { calculateZmanim, formatTime } from "../lib/zmanim";
import { getHebrewDate, getHebrewMonthName, hebrewDayNumeral } from "../lib/hebrewCalendar";
import { Location } from "../lib/locations";

interface ZmanimPageProps {
  location: Location;
  onInfo: () => void;
  onLocationClick: () => void;
}

export default function ZmanimPage({ location, onInfo, onLocationClick }: ZmanimPageProps) {
  const today = new Date();
  const tz = location.tz;
  const zmanim = calculateZmanim(today, location.lat, location.lng, location.candleLightingMinutes);
  const hdate = getHebrewDate(today);

  const dayLabel = today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const isFriday = today.getDay() === 5;
  const isShabbat = today.getDay() === 6;

  const fmt = (d: Date | null) => formatTime(d, tz);

  const shaahMin = Math.floor(zmanim.shaahZmanitGra);
  const shaahSec = Math.round((zmanim.shaahZmanitGra % 1) * 60);

  const prayerRows = [
    { name: "Latest Shema",      sub: "Gra — 3 shaot after Netz HaChama",    time: zmanim.latestShema },
    { name: "Latest Shacharit",  sub: "Gra — 4 shaot after Netz HaChama",    time: zmanim.latestShacharit },
    { name: "Mincha Gedolah",    sub: "Earliest Mincha (½ shaah after Chatzot)", time: zmanim.minchaGedolah },
    { name: "Mincha Ketana",     sub: "Preferred Mincha time",                time: zmanim.minchaKetana },
    { name: "Plag HaMincha",     sub: "Earliest Ma'ariv / Shabbat acceptance", time: zmanim.plagHamincha },
  ];

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
        <button
          onClick={onLocationClick}
          style={{ display: "flex", alignItems: "center", gap: 4, background: "var(--elevated)", border: "1px solid var(--border)", borderRadius: 99, padding: "5px 12px", cursor: "pointer" }}
        >
          <span style={{ fontSize: 12 }}>📍</span>
          <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{location.name}</span>
        </button>
      </div>

      <div style={{ padding: "16px 16px 0" }}>
        {/* Title */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>Zmanim</h1>
            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{location.name} · {dayLabel}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="premium-badge">⭐ PREMIUM</span>
            <button
              onClick={onInfo}
              style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--elevated)", border: "1px solid var(--border)", cursor: "pointer", color: "var(--text-muted)", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}
            >ℹ</button>
          </div>
        </div>

        {/* Alot · Sunrise · Sunset in one row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
          <div className="card" style={{ padding: "12px 10px", textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.06em", marginBottom: 6 }}>ALOT</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", marginBottom: 2 }}>{fmt(zmanim.alotHaShachar)}</div>
            <div style={{ fontSize: 9, color: "var(--text-muted)" }}>Hashachar</div>
          </div>
          <div className="card" style={{ padding: "12px 10px", textAlign: "center", border: "1px solid rgba(212,168,67,0.25)" }}>
            <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.06em", marginBottom: 6 }}>SUNRISE</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#d4a843", marginBottom: 2 }}>{fmt(zmanim.sunrise)}</div>
            <div style={{ fontSize: 9, color: "var(--text-muted)" }}>Netz HaChama</div>
          </div>
          <div className="card" style={{ padding: "12px 10px", textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.06em", marginBottom: 6 }}>SUNSET</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", marginBottom: 2 }}>{fmt(zmanim.sunset)}</div>
            <div style={{ fontSize: 9, color: "var(--text-muted)" }}>Shkia</div>
          </div>
        </div>

        {/* Chatzot */}
        <div className="card" style={{ padding: 14, marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>Chatzot</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Halachic noon — midpoint of the solar day</div>
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)" }}>{fmt(zmanim.chatzot)}</div>
        </div>

        {/* Shabbat times */}
        {(isFriday || isShabbat) && (
          <div className="card" style={{ padding: 16, marginBottom: 12, background: "linear-gradient(135deg, #1a2540, #0f1e38)", border: "1px solid rgba(212,168,67,0.25)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 18 }}>🕯</span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>Candle Lighting</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{location.candleLightingMinutes} min before sunset</div>
              </div>
              <div style={{ marginLeft: "auto", fontSize: 24, fontWeight: 800, color: "#d4a843" }}>
                {fmt(zmanim.candleLighting)}
              </div>
            </div>
            <div className="divider" style={{ marginBottom: 12 }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>Havdalah / Tzais</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>3 stars — 42 min after sunset</div>
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)" }}>{fmt(zmanim.havdalah)}</div>
            </div>
          </div>
        )}

        {/* Tzais (non-Shabbat) */}
        {!isFriday && !isShabbat && (
          <div className="card" style={{ padding: 14, marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>Tzais HaKochavim</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Nightfall — 42 min after sunset (3 stars)</div>
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)" }}>{fmt(zmanim.tzais)}</div>
            </div>
          </div>
        )}

        {/* Prayer times */}
        <div style={{ marginBottom: 12 }}>
          <div className="section-header">PRAYERS (Gra / Vilna Gaon)</div>
          <div className="card" style={{ overflow: "hidden" }}>
            {prayerRows.map((item, i) => (
              <div key={i} className="zmanim-row">
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>{item.name}</div>
                  {item.sub && <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{item.sub}</div>}
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>{fmt(item.time)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Shaah Zmanit */}
        <div className="card" style={{ padding: 14, marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>Shaah Zmanit</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Halachic hour — Gra (Netz to Shkia ÷ 12)</div>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--gold)" }}>
              {shaahMin}m {shaahSec}s
            </div>
          </div>
        </div>

        {/* Method note */}
        <div style={{ padding: "10px 14px", background: "rgba(212,168,67,0.06)", borderRadius: 10, border: "1px solid rgba(212,168,67,0.15)", marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.6 }}>
            <span style={{ fontWeight: 700, color: "#d4a843" }}>Method: </span>
            Calculations follow the <strong>Gra (Vilna Gaon)</strong> — halachic day from Netz HaChama to Shkia.
            Alot HaShachar = 72 min before Netz. Tzais = 42 min after Shkia.
            Candle lighting: {location.candleLightingMinutes} min before Shkia ({location.name} custom).
          </div>
        </div>

        {/* Hebrew date footer */}
        <div style={{ textAlign: "center", padding: "8px 0 8px", opacity: 0.5 }}>
          <div style={{ fontFamily: "'Noto Serif Hebrew', serif", fontSize: 18, color: "var(--gold)" }}>
            {hebrewDayNumeral(hdate.getDate())} {getHebrewMonthName(hdate)} {hdate.getFullYear()}
          </div>
        </div>
      </div>
    </div>
  );
}
