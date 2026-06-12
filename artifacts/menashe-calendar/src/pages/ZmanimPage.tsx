import { useState, useEffect } from "react";
import { calculateZmanim, formatTime } from "../lib/zmanim";
import { getHebrewDate, getHebrewMonthName, hebrewDayNumeral } from "../lib/hebrewCalendar";
import { Location } from "../lib/locations";

interface ZmanimPageProps {
  location: Location;
  onInfo: () => void;
  onLocationClick: () => void;
}

interface NextZman {
  name: string;
  time: Date;
}

function getNextZman(zmanim: ReturnType<typeof calculateZmanim>, now: Date): NextZman | null {
  const candidates: { name: string; time: Date | null }[] = [
    { name: "Alot HaShachar", time: zmanim.alotHaShachar },
    { name: "Netz HaChama", time: zmanim.sunrise },
    { name: "Latest Shema", time: zmanim.latestShema },
    { name: "Latest Shacharit", time: zmanim.latestShacharit },
    { name: "Chatzot", time: zmanim.chatzot },
    { name: "Mincha Gedolah", time: zmanim.minchaGedolah },
    { name: "Mincha Ketana", time: zmanim.minchaKetana },
    { name: "Plag HaMincha", time: zmanim.plagHamincha },
    { name: "Candle Lighting", time: zmanim.candleLighting },
    { name: "Shkia (Sunset)", time: zmanim.sunset },
    { name: "Tzais HaKochavim", time: zmanim.tzais },
  ];
  const upcoming = candidates
    .filter((c) => c.time && c.time > now)
    .sort((a, b) => a.time!.getTime() - b.time!.getTime());
  if (upcoming.length === 0) return null;
  return { name: upcoming[0].name, time: upcoming[0].time! };
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return "0:00:00";
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function ZmanimPage({ location, onInfo, onLocationClick }: ZmanimPageProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const today = now;
  const tz = location.tz;
  const zmanim = calculateZmanim(today, location.lat, location.lng, location.candleLightingMinutes);
  const hdate = getHebrewDate(today);

  const dayLabel = today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const isFriday = today.getDay() === 5;
  const isShabbat = today.getDay() === 6;

  const fmt = (d: Date | null) => formatTime(d, tz);

  const shaahMin = Math.floor(zmanim.shaahZmanitGra);
  const shaahSec = Math.round((zmanim.shaahZmanitGra % 1) * 60);

  const nextZman = getNextZman(zmanim, now);
  const msUntilNext = nextZman ? nextZman.time.getTime() - now.getTime() : null;

  const isAutoLocation = !["Jerusalem","Tel Aviv","Haifa","Be'er Sheva","Bnei Brak","Tzfat","Churachandpur","Imphal","Aizawl","Lunglei","New York","Los Angeles","Toronto","London","Paris","Melbourne"].includes(location.name);

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
          <span style={{ fontSize: 12 }}>{isAutoLocation ? "🎯" : "📍"}</span>
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

        {/* Next Zman Live Countdown */}
        {nextZman && msUntilNext !== null && (
          <div
            className="card"
            style={{
              padding: "14px 16px",
              marginBottom: 12,
              background: "linear-gradient(135deg, rgba(212,168,67,0.12), rgba(212,168,67,0.04))",
              border: "1px solid rgba(212,168,67,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontSize: 10, color: "#d4a843", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 4 }}>NEXT ZMAN</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>{nextZman.name}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{fmt(nextZman.time)}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.08em", marginBottom: 4 }}>IN</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#d4a843", fontVariantNumeric: "tabular-nums", letterSpacing: "0.03em" }}>
                {formatCountdown(msUntilNext)}
              </div>
            </div>
          </div>
        )}

        {!nextZman && (
          <div className="card" style={{ padding: "12px 16px", marginBottom: 12, textAlign: "center" }}>
            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>All Zmanim for today have passed.</div>
          </div>
        )}

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
            {isAutoLocation && (
              <span style={{ display: "block", marginTop: 4 }}>
                <span style={{ color: "#d4a843", fontWeight: 700 }}>📍 Auto-detected location</span> — coordinates from your device ({location.lat.toFixed(4)}°, {location.lng.toFixed(4)}°).
              </span>
            )}
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
